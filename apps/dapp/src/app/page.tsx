"use client";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction, useAddNetwork } from "@midl/react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import { ConnectButton } from "@midl/satoshi-kit";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress, parseEther } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";

// Import Screens
import { VaultType } from "@/components/screens/VaultCreation";
const VaultCreation = dynamic(() => import("@/components/screens/VaultCreation"), { ssr: false });
const VaultArchive = dynamic(() => import("@/components/screens/VaultArchive"), { ssr: false });
const UnlockProcess = dynamic(() => import("@/components/screens/UnlockProcess"), { ssr: false });

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();
  const { addNetworkAsync } = useAddNetwork();
  const publicClient = usePublicClient();

  // Diagnostics
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== 'undefined') {
      console.log("[BitCapsule] Connection State:", { isConnected, address });
    }
  }, [isConnected, address]);


  // State
  const [view, setView] = useState<'creation' | 'archive'>('creation');
  const [message, setMessage] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [vaultType, setVaultType] = useState<VaultType>(VaultType.TEMPORAL);
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockTimeDays, setUnlockTimeDays] = useState(365); // Default 1 year

  const [isMinting, setIsMinting] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [successBtcTxHash, setSuccessBtcTxHash] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');

  const isSigningOrPending = isMinting || isBroadcasting || isWithdrawing || isClaiming;

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    if (!publicClient) return;
    try {
      const [logs, claimedLogs, withdrawnLogs] = await Promise.all([
        publicClient.getLogs({
          address: TimeCapsule.getAddress(),
          event: {
            type: 'event',
            name: 'CapsuleCreated',
            inputs: [
              { type: 'uint256', name: 'id', indexed: true },
              { type: 'address', name: 'owner', indexed: true },
              { type: 'address', name: 'beneficiary', indexed: true },
              { type: 'uint256', name: 'unlockTime', indexed: false },
              { type: 'uint8', name: 'vaultType', indexed: false },
              { type: 'uint256', name: 'amount', indexed: false },
              { type: 'address', name: 'token', indexed: false },
              { type: 'string', name: 'message', indexed: false }
            ]
          } as any,
          fromBlock: 'earliest'
        }),
        publicClient.getLogs({
          address: TimeCapsule.getAddress(),
          event: {
            type: 'event',
            name: 'CapsuleClaimed',
            inputs: [
              { type: 'uint256', name: 'id', indexed: true },
              { type: 'address', name: 'claimant', indexed: true }
            ]
          } as any,
          fromBlock: 'earliest'
        }),
        publicClient.getLogs({
          address: TimeCapsule.getAddress(),
          event: {
            type: 'event',
            name: 'EarlyWithdrawal',
            inputs: [
              { type: 'uint256', name: 'id', indexed: true },
              { type: 'address', name: 'owner', indexed: true },
              { type: 'uint256', name: 'userAmount', indexed: false },
              { type: 'uint256', name: 'treasuryAmount', indexed: false },
              { type: 'address', name: 'token', indexed: false }
            ]
          } as any,
          fromBlock: 'earliest'
        })
      ]);

      const processedIds = new Set([
        ...claimedLogs.map(l => (l as any).args.id?.toString()),
        ...withdrawnLogs.map(l => (l as any).args.id?.toString())
      ]);

      const activeLogs = logs.filter(l => !processedIds.has((l as any).args.id?.toString()));
      setHistory(activeLogs);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    if (isConnected && publicClient) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [isConnected, publicClient]);

  const handleMint = async () => {
    if (!message || !amount || !isConnected || isMinting) {
      if (!amount && isConnected) toast.error("Please enter an amount");
      return;
    }

    if (vaultType === VaultType.SOCIAL && !isAddress(beneficiary)) {
      toast.error("Please enter a valid EVM beneficiary address");
      return;
    }

    if (!address) {
      toast.error("Wallet address not found. Please reconnect.");
      return;
    }

    let targetBeneficiary: `0x${string}` = address as `0x${string}`;

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
      const amountInWei = parseEther(amount);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + unlockTimeDays * 24 * 60 * 60);

      // Combine label and message into a JSON string
      const combinedMessage = JSON.stringify({
        label: label || "Unnamed Vault",
        secret: message
      });

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            value: amountInWei,
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                zeroAddress,
                amountInWei,
                unlockTimestamp,
                targetBeneficiary as `0x${string}`,
                vaultType,
                combinedMessage
              ],
            }),
          },
          // Explicitly include deposit for native BTC funding from Bitcoin side to resolve PSBT issues
          deposit: amountInWei > 0n ? {
            satoshis: Number(amountInWei / BigInt(10**10))
          } : undefined,
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({
        intention,
        txId: tx.id,
      });

      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });

      if (txHashes && txHashes.length > 0) {
        console.log("[BitCapsule] Tx hashes:", txHashes);
        console.log("[BitCapsule] BTC Tx ID:", tx.id);

        await waitForTransactionAsync({ txId: tx.id });

        setSuccessTxHash(txHashes[0]); // EVM hash
        setSuccessBtcTxHash(tx.id);    // BTC hash

        setMessage("");
        setLabel("");
        setAmount("");
        setTimeout(fetchHistory, 2000);
      }
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Transaction failed");
      setSuccessTxHash(null);
      setSuccessBtcTxHash(null);
    } finally {
      setIsMinting(false);
      setIsBroadcasting(false);
    }
  };

  const handleWithdrawEarly = async (id: bigint) => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    setUnlockStatus('penalty');
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
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessTxHash(txHashes[0]);
      setSuccessBtcTxHash(tx.id);

      toast.success("Early withdrawal successful!");
      setTimeout(fetchHistory, 2000);
      setUnlockStatus('none');
    } catch (e: any) {
      console.error("Withdrawal failed", e);
      toast.error(e.message || "Withdrawal failed");
      setUnlockStatus('none');
    } finally {
      setIsWithdrawing(false);
      setIsBroadcasting(false);
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
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessTxHash(txHashes[0]);
      setSuccessBtcTxHash(tx.id);

      toast.success("Payload claimed successfully!");
      setTimeout(fetchHistory, 2000);
      setUnlockStatus('success');
    } catch (e: any) {
      console.error("Claim failed", e);
      toast.error(e.message || "Claim failed");
    } finally {
      setIsClaiming(false);
      setIsBroadcasting(false);
    }
  };

  if (!isMounted) return null;

  if (false && !isConnected) {
    return (
      <div className="relative min-h-screen bg-background-dark text-gray-100 flex flex-col font-display overflow-x-hidden">
        <BackgroundEffects />

        <div className="relative z-10 w-full flex-grow flex flex-col justify-between p-8 md:p-12">
          <header className="flex justify-between items-center animate-fade-in-down flex-shrink-0">
            <div className="flex items-center gap-4 text-primary/80">
              <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
              <span className="text-xs tracking-[0.2em] font-bold uppercase">BitCapsule</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>ENCRYPTION: <span className="text-primary">AES-256</span></span>
              <span className="text-primary font-bold">ACTIVE</span>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center relative py-12">
            <div className="text-center mb-10 relative z-20">
              <h1 className="text-primary text-sm md:text-base font-mono mb-2 tracking-widest opacity-80 animate-pulse uppercase">
                &gt; ESTABLISHING TEMPORAL CONNECTION...
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-white group-hover:text-primary transition-colors duration-500 tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Select Authentication Protocol
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 animate-pulse"></div>
            </div>

            <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12 z-20">
              {/* Fake Fingerprint Icon */}
              <div className="relative z-10 group cursor-pointer order-2 md:order-1">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-2 rounded-full border border-primary/50 animate-[spin-slow_10s_linear_infinite]"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse-slow"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-b from-[#3a3010] to-[#1a180d] rounded-full border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(242,185,13,0.3)] group-hover:shadow-[0_0_50px_rgba(242,185,13,0.6)] transition-all duration-500">
                    <span className="material-icons text-primary text-4xl animate-pulse">fingerprint</span>
                  </div>
                </div>
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-primary/60 text-[10px] tracking-[0.3em] font-mono whitespace-nowrap text-center">
                  NEURAL SYNC READY
                </div>
              </div>

              {/* ConnectButton with specialized styling */}
              <div className="order-1 md:order-2">
                <div className="p-1 rounded-xl bg-gradient-to-tr from-xverse-orange/50 via-transparent to-xverse-orange/50 group holographic-card">
                  <div className="glass-panel rounded-xl p-8 flex flex-col items-center gap-6 border border-xverse-orange/30 group-hover:border-xverse-orange animate-border-pulse">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-xverse-orange/50 text-[10px] text-xverse-orange font-mono tracking-widest uppercase rounded">
                      Recommended
                    </div>

                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-xverse-orange/40 group-hover:border-xverse-orange transition-colors relative overflow-hidden shadow-[0_0_20px_rgba(247,147,26,0.2)]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-xverse-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-4xl text-xverse-orange drop-shadow-[0_0_10px_rgba(247,147,26,0.8)] relative z-10">
                        currency_bitcoin
                      </span>
                    </div>

                    <div className="space-y-2 text-center">
                      <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-xverse-orange transition-colors uppercase">Auth Link</h3>
                      <p className="text-sm text-gray-400 font-mono lowercase">establish bitcoin protocol</p>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-xverse-orange to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>

                    <div className="scale-125 transform transition-transform group-hover:scale-135">
                      <ConnectButton />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>STATUS: READY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center animate-in slide-in-from-bottom duration-1000">
              <a
                href="https://faucet.staging.midl.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-primary/30 rounded-full text-primary/80 hover:text-white hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/20"
              >
                Access MIDL Faucet
              </a>
            </div>
          </main>

          <footer className="relative z-20 flex justify-between items-end mt-8 flex-shrink-0">
            <div className="flex flex-col items-start text-left">
               <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Vault Status</span>
               <span className="text-xs font-bold text-primary/70 tracking-widest uppercase">Temporal Archive Online</span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-gray-500 text-[10px] max-w-xs font-mono">
                By establishing a link, you agree to the BitCapsule <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Temporal Terms</a> &amp; <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Protocol Policy</a>.
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background-dark text-white font-display flex flex-col selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full h-full animate-in fade-in duration-700">
        {view === 'creation' ? (
          <VaultCreation
            vaultType={vaultType}
            setVaultType={setVaultType}
            beneficiary={beneficiary}
            setBeneficiary={setBeneficiary}
            unlockTimeDays={unlockTimeDays}
            setUnlockTimeDays={setUnlockTimeDays}
            message={message}
            setMessage={setMessage}
            label={label}
            setLabel={setLabel}
            amount={amount}
            setAmount={setAmount}
            handleMint={handleMint}
            isSigningOrPending={isSigningOrPending}
          />
        ) : (
          <VaultArchive
            history={history}
            currentTime={currentTime}
            handleWithdrawEarly={handleWithdrawEarly}
            handleClaim={handleClaim}
            address={address}
            isSigningOrPending={isSigningOrPending}
            onNavigateBack={() => setView('creation')}
            onRefresh={fetchHistory}
          />
        )}
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono">Legacy Protocol v1.2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono">Dead Man's Switch Active</span>
        </div>
        <div className="mt-2 md:mt-0 font-mono uppercase">
          ID: <span className="text-primary/60">XJ-9200-ALPHA</span> {'//'} Node: <span className="text-green-500/60">Verified</span>
        </div>
      </footer>

      {successTxHash && (
        <SuccessOverlay
          txHash={successTxHash}
          btcTxHash={successBtcTxHash || undefined}
          onClose={() => { setSuccessTxHash(null); setSuccessBtcTxHash(null); }}
          onRefresh={fetchHistory}
        />
      )}

      {unlockStatus !== 'none' && (
        <UnlockProcess
          status={unlockStatus}
          txHash={successTxHash || undefined}
          onClose={() => setUnlockStatus('none')}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay />}
    </div>
  );
}
