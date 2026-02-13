"use client";

import { useState, useEffect, useCallback } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, parseUnits, isAddress } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import { EXPLORER_BASE_URL } from "./config";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import { LockMechanism } from "@/components/ui/vault/LockMechanism";
import { TemporalSlider } from "@/components/ui/vault/TemporalSlider";
import { VaultButton, VaultCard } from "@/components/ui/vault";

// Enum to match the contract
enum VaultType {
  TIME_LOCK = 0,
  SOCIAL = 1,
  LEGACY = 2,
}

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors, connect } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const publicClient = usePublicClient();

  // Form State
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState(zeroAddress); // Default to ETH/Zero Address
  const [duration, setDuration] = useState(31536000); // 1 year default
  const [vaultType, setVaultType] = useState<VaultType>(VaultType.TIME_LOCK);
  const [beneficiary, setBeneficiary] = useState("");

  const [isMinting, setIsMinting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!publicClient || !isConnected) return;
    try {
      const logs = await publicClient.getLogs({
        address: TimeCapsule.address,
        event: {
          type: 'event',
          name: 'CapsuleCreated',
          inputs: [
            { indexed: true, name: 'id', type: 'uint256' },
            { indexed: true, name: 'owner', type: 'address' },
            { indexed: false, name: 'unlockTimestamp', type: 'uint256' },
            { indexed: false, name: 'message', type: 'string' }
          ]
        },
        fromBlock: BigInt(0),
      });
      const sortedLogs = [...logs].sort((a, b) =>
        Number((b.blockNumber || BigInt(0)) - (a.blockNumber || BigInt(0)))
      );
      setHistory(sortedLogs);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  }, [publicClient, isConnected]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!publicClient || !isConnected) return;
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [publicClient, isConnected, fetchHistory]);

  const handleSealVibe = async () => {
    // Validate amount
    const amountVal = Number(amount);
    if (!amount || isNaN(amountVal) || amountVal <= 0) {
        toast.error("Please enter a positive amount");
        return;
    }

    // Validation logic for beneficiary
    let targetBeneficiary: `0x${string}` = zeroAddress;

    if (vaultType === VaultType.SOCIAL || vaultType === VaultType.LEGACY) {
        if (!beneficiary || beneficiary === zeroAddress) {
            toast.error("Beneficiary is required for Social and Legacy vaults.");
            return;
        }
        if (!isAddress(beneficiary)) {
            toast.error("Invalid beneficiary address format.");
            return;
        }
        targetBeneficiary = beneficiary as `0x${string}`;
    }

    setIsMinting(true);
    try {
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + duration);
      const weiAmount = parseUnits(amount, 18); // Assuming 18 decimals

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address,
            value: tokenAddress === zeroAddress ? weiAmount : BigInt(0),
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                  tokenAddress as `0x${string}`,
                  weiAmount,
                  unlockTimestamp,
                  targetBeneficiary,
                  vaultType,
                  message // Include message
              ],
            }),
          },
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();

      const signedTransaction = await signIntentionAsync({
        intention,
        txId: tx.id,
      });

      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });

      if (txHashes && txHashes.length > 0) {
        setSuccessTxHash(txHashes[0]);
        setMessage("");
        setAmount("");
      }
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Transaction failed");
      setSuccessTxHash(null);
    } finally {
      setIsMinting(false);
    }
  };

  const xverseConnector = connectors.find(c => c.name.toLowerCase().includes("xverse"));

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark text-gray-100 min-h-screen w-full flex flex-col relative font-display overflow-hidden">
        {/* Simplified Login View for brevity - reusing existing structure */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-40 transform perspective-1000 rotate-x-12 scale-110"></div>
        </div>
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-widest text-white uppercase">TimeVibe</h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center relative">
              <button
                type="button"
                onClick={() => xverseConnector && connect({ connector: xverseConnector })}
                className="xverse-card p-8 rounded-2xl bg-black border border-white/20 hover:border-bitcoin-orange transition-all"
              >
                  <span className="text-2xl font-bold text-white uppercase">Connect Xverse</span>
              </button>
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <BackgroundEffects />

      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-obsidian/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse">
            <span className="material-icons text-primary text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">TimeVibe</h1>
            <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">Secure Channel V.2.0</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-primary/70">ENCRYPTION</span>
            <span className="text-green-400 font-bold uppercase">Quantum-256</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-primary/70 uppercase">Address</span>
            <span className="text-primary font-bold uppercase font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full">
        <LockMechanism />

        <div className="w-full md:w-1/2 max-w-lg relative">
          <VaultCard>
            <div className="space-y-4">
                {/* Vault Type Selection */}
                <div className="space-y-2">
                    <label id="vault-protocol-label" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                        <span>Vault Protocol</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="vault-protocol-label">
                        <button
                            type="button"
                            onClick={() => setVaultType(VaultType.TIME_LOCK)}
                            className={`p-2 text-[10px] uppercase font-mono border rounded transition-all ${vaultType === VaultType.TIME_LOCK ? "bg-primary/20 border-primary text-primary" : "bg-black/20 border-white/10 text-gray-400"}`}
                        >
                            Time Lock
                        </button>
                        <button
                            type="button"
                            onClick={() => setVaultType(VaultType.SOCIAL)}
                            className={`p-2 text-[10px] uppercase font-mono border rounded transition-all ${vaultType === VaultType.SOCIAL ? "bg-primary/20 border-primary text-primary" : "bg-black/20 border-white/10 text-gray-400"}`}
                        >
                            Social
                        </button>
                        <button
                            type="button"
                            onClick={() => setVaultType(VaultType.LEGACY)}
                            className={`p-2 text-[10px] uppercase font-mono border rounded transition-all ${vaultType === VaultType.LEGACY ? "bg-primary/20 border-primary text-primary" : "bg-black/20 border-white/10 text-gray-400"}`}
                        >
                            Legacy
                        </button>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <label htmlFor="assets-amount" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                        <span>Assets to Seal</span>
                    </label>
                    <input
                        id="assets-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount (ETH/Tokens)"
                        className="w-full bg-obsidian border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary placeholder-primary/30"
                    />
                </div>

                {/* Beneficiary Input (Conditional) */}
                {(vaultType === VaultType.LEGACY || vaultType === VaultType.SOCIAL) && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label htmlFor="beneficiary-address" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                            <span>Beneficiary Address</span>
                            <span className="text-red-400 text-[10px]">REQUIRED</span>
                        </label>
                        <input
                            id="beneficiary-address"
                            type="text"
                            value={beneficiary}
                            onChange={(e) => setBeneficiary(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-obsidian border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary placeholder-primary/30"
                        />
                    </div>
                )}

                {/* Message Input */}
                <div className="space-y-2">
                    <label htmlFor="message-stream" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                        <span>Input Stream</span>
                        <span className="animate-pulse">_Ready</span>
                    </label>
                    <div className="relative group">
                    <textarea
                        id="message-stream"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-24 bg-obsidian border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                        placeholder="Write to your future self..."
                    />
                    <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(52,132,244,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>

                <TemporalSlider
                    value={duration}
                    onChange={setDuration}
                    min={60}
                    max={3153600000}
                />

                <div className="pt-2">
                    <VaultButton
                    onClick={handleSealVibe}
                    disabled={isMinting}
                    >
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-bitcoin-gold/80 uppercase tracking-widest mb-1 group-hover:text-bitcoin-gold transition-colors">
                            {isMinting ? "Processing..." : "Confirm Protocol"}
                        </span>
                        <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all uppercase">
                            Seal Vibe
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-lg border border-bitcoin-gold/50 bg-bitcoin-gold/10 flex items-center justify-center shadow-gold-glow group-hover:bg-bitcoin-gold group-hover:text-black transition-all duration-300">
                        <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
                    </div>
                    </VaultButton>
                </div>
            </div>
          </VaultCard>
        </div>
      </main>

      {/* Archive Feed */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-obsidian/80 border border-primary/20 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex justify-between items-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="material-icons text-xs animate-pulse">history</span>
              Temporal Archive Feed
            </span>
            <span className="text-[10px] font-mono text-primary/60 uppercase">
              Status: Connected {'//'} {history.length} Data Blocks
            </span>
          </div>

          <div className="h-48 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs relative">
            {history.length === 0 ? (
              <div className="text-primary/40 text-center py-10 animate-pulse uppercase tracking-[0.2em]">
                _Waiting for incoming transmissions...
              </div>
            ) : (
              history.map((log, i) => (
                <div key={`${log.transactionHash}-${log.logIndex}-${i}`} className="border-l-2 border-primary/30 pl-4 py-2 hover:bg-primary/5 transition-colors group relative">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-primary font-bold uppercase tracking-wider">
                      [Block {log.blockNumber?.toString()}] Vibe Sealed
                    </span>
                    <a
                      href={`${EXPLORER_BASE_URL}/tx/${log.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary/40 hover:text-primary transition-colors text-[10px] flex items-center gap-1"
                    >
                      EXPLORER <span className="material-icons text-[10px]">open_in_new</span>
                    </a>
                  </div>
                  <div className="text-gray-400 leading-relaxed break-all">
                    {/* Display message if available in log */}
                    {log.args.message ? `Message: ${log.args.message}` : `New Time Capsule Created. Unlock time: ${new Date(Number(log.args.unlockTimestamp) * 1000).toLocaleDateString()}`}
                  </div>
                  <div className="mt-1 text-[10px] text-primary/60 flex justify-between">
                    <span>OWNER: {log.args.owner?.slice(0, 6)}...{log.args.owner?.slice(-4)}</span>
                    <span>TX: {log.transactionHash?.slice(0, 10)}...</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {successTxHash && (
        <SuccessOverlay
          txHash={successTxHash}
          onClose={() => setSuccessTxHash(null)}
          onRefresh={fetchHistory}
        />
      )}
    </div>
  );
}
