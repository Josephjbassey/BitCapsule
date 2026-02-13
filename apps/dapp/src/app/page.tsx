"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress, isAddressEqual } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { EXPLORER_BASE_URL } from "./config";
import { toast } from "sonner";

enum VaultType {
  TEMPORAL = 0,
  LEGACY = 1,
  HODL = 2,
  SOCIAL = 3
}

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors, connect } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync, isPending: isBroadcasting } = useSendBTCTransactions();
  const publicClient = usePublicClient();

  const [message, setMessage] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  // New platform states
  const [vaultType, setVaultType] = useState<VaultType>(VaultType.TEMPORAL);
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockTimeDays, setUnlockTimeDays] = useState(365); // Default 1 year
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  const isSigningOrPending = isMinting || isBroadcasting || isWithdrawing || isClaiming;

  const fetchHistory = useCallback(async () => {
    if (!publicClient || !isConnected) return;
    try {
      const logs = await publicClient.getLogs({
        address: TimeCapsule.address as `0x${string}`,
        event: {
          type: 'event',
          name: 'CapsuleCreated',
          inputs: [
            { indexed: true, name: 'id', type: 'uint256' },
            { indexed: true, name: 'owner', type: 'address' },
            { indexed: true, name: 'beneficiary', type: 'address' },
            { indexed: false, name: 'unlockTime', type: 'uint256' },
            { indexed: false, name: 'vaultType', type: 'uint8' },
            { indexed: false, name: 'amount', type: 'uint256' },
            { indexed: false, name: 'token', type: 'address' }
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
    const timer = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!publicClient || !isConnected) return;
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [publicClient, isConnected, fetchHistory]);

  const handleMint = async () => {
    if (!message || !isConnected || isMinting) return;

    if (vaultType === VaultType.SOCIAL && !isAddress(beneficiary)) {
        toast.error("Please enter a valid EVM beneficiary address");
        return;
    }

    setIsMinting(true);
    try {
      const amount = BigInt(message.length * 100000); // Dummy amount based on message length
      const targetBeneficiary = vaultType === VaultType.SOCIAL ? beneficiary : (address || zeroAddress);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + unlockTimeDays * 24 * 60 * 60);

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            value: amount, // Pass native value
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                targetBeneficiary as `0x${string}`,
                unlockTimestamp,
                vaultType,
                zeroAddress, // Sentinel for native BTC/ETH
                amount
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
      }
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Transaction failed");
      setSuccessTxHash(null);
    } finally {
      setIsMinting(false);
    }
  };

  const handleWithdrawEarly = async (id: bigint) => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    try {
        const intention = await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: TimeCapsule.address as `0x${string}`,
                data: encodeFunctionData({
                  abi: TimeCapsule.abi,
                  functionName: "withdrawEarly",
                  args: [id],
                }),
              },
            },
            reset: true,
          });

          const { tx } = await finalizeBTCTransactionAsync();
          const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
          await sendBTCTransactionsAsync({
            serializedTransactions: [signedTransaction],
            btcTransaction: tx.hex,
          });
          toast.success("Early withdrawal initiated!");
          fetchHistory();
    } catch (e: any) {
        console.error("Withdrawal failed", e);
        toast.error(e.message || "Withdrawal failed");
    } finally {
        setIsWithdrawing(false);
    }
  };

  const handleClaim = async (id: bigint, useLegacy: boolean) => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
        const intention = await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: TimeCapsule.address as `0x${string}`,
                data: encodeFunctionData({
                  abi: TimeCapsule.abi,
                  functionName: useLegacy ? "claimLegacy" : "claim",
                  args: [id],
                }),
              },
            },
            reset: true,
          });

          const { tx } = await finalizeBTCTransactionAsync();
          const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
          await sendBTCTransactionsAsync({
            serializedTransactions: [signedTransaction],
            btcTransaction: tx.hex,
          });
          toast.success("Payload claimed successfully!");
          fetchHistory();
    } catch (e: any) {
        console.error("Claim failed", e);
        toast.error(e.message || "Claim failed");
    } finally {
        setIsClaiming(false);
    }
  };

  const xverseConnector = connectors.find(c => c.name.toLowerCase().includes("xverse"));

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark text-gray-100 min-h-screen w-full flex flex-col relative font-display overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-40 transform perspective-1000 rotate-x-12 scale-110"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-bitcoin-orange rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary rounded-full opacity-40 animate-float"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-bitcoin-orange/50 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bitcoin-orange/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-bitcoin-orange/80">
              <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
              <span className="text-xs tracking-[0.2em] font-bold uppercase">TimeVibe // Secure Link v.4.0.0</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>ENCRYPTION: AES-256</span>
              <span className="text-bitcoin-orange">BITCOIN MAINNET ACTIVE</span>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center relative">
            <div className="text-center mb-12 relative z-20">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Authenticate Identity
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-bitcoin-orange to-transparent mx-auto mt-4 animate-pulse"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-24">
              <div className="relative group cursor-pointer">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-bitcoin-orange/30 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border border-bitcoin-orange/50 animate-spin-slow"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-b from-[#3a2010] to-[#1a0e0d] rounded-full border border-bitcoin-orange flex items-center justify-center shadow-neon">
                    <span className="material-icons text-bitcoin-orange text-4xl animate-pulse">fingerprint</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => xverseConnector && connect({ connector: xverseConnector })}
                className="xverse-card w-full md:w-80 p-1 rounded-2xl group relative overflow-hidden bg-black border border-white/5 hover:border-bitcoin-orange/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-orange/40 via-transparent to-bitcoin-orange/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-[#0a0a0c] rounded-xl p-8 flex flex-col items-center justify-center gap-6 h-full transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-xverse-orange/40 group-hover:border-xverse-orange transition-colors shadow-neon">
                    <span className="material-symbols-outlined text-4xl text-xverse-orange">currency_bitcoin</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-bitcoin-orange transition-colors uppercase">Xverse</h3>
                    <p className="text-xs text-bitcoin-orange font-mono font-medium">Bitcoin Web3 Wallet</p>
                  </div>
                </div>
              </button>
            </div>
          </main>

          <footer className="flex justify-between items-end mt-8">
            <p className="text-gray-500 text-[10px] font-mono uppercase">
              Node: <span className="text-bitcoin-orange">Verified</span> // ID: TV-4491-Ω
            </p>
            <p className="text-gray-500 text-[10px] font-mono max-w-xs text-right">
              By connecting, you agree to the <span className="text-bitcoin-orange cursor-pointer">Temporal Terms</span>.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0"></div>
      <div className="scanline"></div>

      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-obsidian/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse">
            <span className="material-icons text-primary text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">TimeVibe</h1>
            <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">Secure Channel V.4.0</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-primary/70">ENCRYPTION</span>
            <span className="text-green-400 font-bold uppercase">Quantum-256</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-primary/70 uppercase">Address</span>
            <span className="text-primary font-bold uppercase font-mono">{address}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full overflow-y-auto">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-reverse"></div>
            <div className="absolute inset-12 rounded-full border border-primary/30 bg-obsidian/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
              <img alt="Vault core" className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvp6ARoUsE7ll4bSnvXa5_py9g5qGQVp98jVr6EVbZdGU9SbB2Drz6NpQnj2xkbjwKoudv-PJ7elemYUR3IrIwSyQfDdba5_em0Y6815By_SgLK-UbienHRzGWeex8ssVlRpy9UENyxOSpJquFsQ39mKOC-UpS5k43z9vyCCq5UhNju0S2hwr2wvXukoT3pujQIurKhX6jdz5WAheiUIx3MP_yY35P-aBKwp2TYlMEykCZFy-5o71EyQxltig9VfrCJPQxRHsQEA" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute w-32 h-32 bg-obsidian rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10">
              <span className="material-icons text-6xl text-primary drop-shadow-[0_0_15px_rgba(52,132,244,1)]">lock</span>
            </div>

            <div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce"></div>
            <div className="absolute top-20 -left-12 w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse"></div>
            <div className="absolute bottom-10 right-0 w-1.5 h-1.5 bg-bitcoin-gold rounded-full blur-[1px] animate-pulse"></div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-xs tracking-[0.3em] uppercase">Temporal Utility Platform</p>
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Multi-Tier Vault</h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-lg relative">
          <div className="bg-obsidian-light/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>

            <div className="p-6 md:p-8 space-y-6 bg-cyber-grid bg-[length:10px_10px]">
              {/* Vault Type Selector */}
              <div className="space-y-2">
                <label htmlFor="protocol-selector" className="text-xs tracking-wider text-primary/80 uppercase font-semibold block">Utility Protocol</label>
                <select
                    id="protocol-selector"
                    value={vaultType}
                    onChange={(e) => setVaultType(Number(e.target.value))}
                    className="w-full bg-obsidian border border-primary/40 rounded-lg p-3 text-gray-300 font-display text-sm focus:outline-none focus:border-primary transition-all"
                >
                    <option value={VaultType.TEMPORAL}>TEMPORAL VAULT (Personal)</option>
                    <option value={VaultType.LEGACY}>LEGACY SWITCH (Inheritance)</option>
                    <option value={VaultType.HODL}>HODL LOCKER (Forced Savings)</option>
                    <option value={VaultType.SOCIAL}>SOCIAL GIFT (P2P Transfer)</option>
                </select>
              </div>

              {vaultType === VaultType.SOCIAL && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                    <label htmlFor="beneficiary-address" className="text-xs tracking-wider text-bitcoin-gold uppercase font-semibold block">Friend's EVM Address</label>
                    <input
                        id="beneficiary-address"
                        type="text"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-obsidian border border-bitcoin-gold/40 rounded-lg p-3 text-gray-300 font-mono text-xs focus:outline-none focus:border-bitcoin-gold transition-all"
                    />
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="input-stream" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                  <span>Input Stream</span>
                  <span className="animate-pulse">_Ready</span>
                </label>
                <div className="relative group">
                  <textarea
                    id="input-stream"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 bg-obsidian border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                    placeholder="Initialize encryption sequence..."
                  />
                  <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(52,132,244,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="unlock-horizon" className="text-xs tracking-wider text-primary/80 uppercase font-semibold block">Unlock Horizon ({unlockTimeDays} Days)</label>
                <input
                    id="unlock-horizon"
                    type="range"
                    min="1"
                    max="3650"
                    value={unlockTimeDays}
                    onChange={(e) => setUnlockTimeDays(Number(e.target.value))}
                    className="w-full accent-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleMint}
                  disabled={isSigningOrPending}
                  className="relative w-full group overflow-hidden rounded-lg bg-obsidian-light border border-bitcoin-gold/30 hover:border-bitcoin-gold/80 transition-all duration-300 disabled:opacity-50"
                >
                  <div className="absolute inset-0 circuit-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative flex items-center justify-between px-6 py-5">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-bitcoin-gold/80 uppercase tracking-widest mb-1 group-hover:text-bitcoin-gold transition-colors">Confirm Protocol</span>
                      <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all uppercase">
                        {isSigningOrPending ? "Syncing..." : "Seal Utility"}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-lg border border-bitcoin-gold/50 bg-bitcoin-gold/10 flex items-center justify-center shadow-gold-glow group-hover:bg-bitcoin-gold group-hover:text-black transition-all duration-300">
                      <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bitcoin-gold/50"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-obsidian/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Legacy Protocol v1.2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Dead Man's Switch Active</span>
        </div>
        <div className="mt-2 md:mt-0 font-mono uppercase">
          ID: <span className="text-primary/60">XJ-9200-ALPHA</span> {'//'} Node: <span className="text-green-500/60">Verified</span>
        </div>
      </footer>

      {/* Archive Section */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12 overflow-y-auto">
        <div className="bg-obsidian/80 border border-primary/20 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex justify-between items-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="material-icons text-xs animate-pulse">history</span>
              Active Temporal Vaults
            </span>
            <span className="text-[10px] font-mono text-primary/60 uppercase">
              {history.length} Registered Anchors
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs relative">
            <div className="absolute inset-0 pointer-events-none scanline opacity-5"></div>
            {history.length === 0 ? (
              <div className="text-primary/40 text-center py-10 animate-pulse uppercase tracking-[0.2em]">
                _No active vaults detected in local radius...
              </div>
            ) : (
              history.map((log, i) => {
                const id = log.args.id;
                const unlockTime = Number(log.args.unlockTime);
                const isLocked = currentTime < unlockTime;
                const timeLeft = unlockTime - currentTime;

                const days = Math.floor(timeLeft / (24 * 60 * 60));
                const hrs = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
                const mins = Math.floor((timeLeft % (60 * 60)) / 60);

                const isOwner = address && log.args.owner && isAddressEqual(address as `0x${string}`, log.args.owner as `0x${string}`);
                const isBeneficiary = address && log.args.beneficiary && isAddressEqual(address as `0x${string}`, log.args.beneficiary as `0x${string}`);
                const isLegacy = log.args.vaultType === VaultType.LEGACY;

                return (
                  <div key={`${log.transactionHash}-${log.logIndex}-${i}`} className="border-l-2 border-primary/30 pl-4 py-3 hover:bg-primary/5 transition-colors group relative bg-black/20 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <span className="text-primary font-bold uppercase tracking-wider block">
                          [Vault #{id?.toString()}] Type: {VaultType[log.args.vaultType]}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                            Beneficiary: {log.args.beneficiary?.slice(0, 10)}...
                        </span>
                      </div>
                      <div className="text-right">
                        {isLocked ? (
                            <div className="text-bitcoin-gold font-bold">
                                T-MINUS: {days}d {hrs}h {mins}m
                            </div>
                        ) : (
                            <div className="text-green-500 font-bold animate-pulse">VAULT OPEN</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 items-center mt-3">
                        <a
                            href={`${EXPLORER_BASE_URL}/tx/${log.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary/40 hover:text-primary transition-colors text-[10px] flex items-center gap-1"
                        >
                            EXPLORER <span className="material-icons text-[10px]">open_in_new</span>
                        </a>

                        {isLocked && isOwner && (
                            <button
                                type="button"
                                onClick={() => handleWithdrawEarly(id)}
                                disabled={isSigningOrPending}
                                className="bg-red-500/10 border border-red-500/40 text-red-500 text-[9px] px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-all uppercase font-bold disabled:opacity-50"
                            >
                                {isWithdrawing ? "Processing..." : "Panic Button (80/20 Split)"}
                            </button>
                        )}

                        {isLocked && isLegacy && isBeneficiary && (
                             <button
                                type="button"
                                onClick={() => handleClaim(id, true)}
                                disabled={isSigningOrPending}
                                className="bg-orange-500/10 border border-orange-500/40 text-orange-500 text-[9px] px-3 py-1 rounded hover:bg-orange-500 hover:text-white transition-all uppercase font-bold disabled:opacity-50"
                            >
                                {isClaiming ? "Syncing..." : "Claim Legacy"}
                            </button>
                        )}

                        {!isLocked && (isOwner || isBeneficiary) && (
                            <button
                                type="button"
                                onClick={() => handleClaim(id, false)}
                                disabled={isSigningOrPending}
                                className="bg-green-500/10 border border-green-500/40 text-green-500 text-[9px] px-3 py-1 rounded hover:bg-green-500 hover:text-white transition-all uppercase font-bold disabled:opacity-50"
                            >
                                {isClaiming ? "Claiming..." : "Claim Payload"}
                            </button>
                        )}
                    </div>
                  </div>
                );
              })
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

      {isSigningOrPending && <TemporalSyncOverlay />}
    </div>
  );
}
