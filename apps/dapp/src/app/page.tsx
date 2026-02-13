"use client";

import { useState, useEffect, useCallback } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import { LockMechanism } from "@/components/ui/vault/LockMechanism";
import { TemporalSlider } from "@/components/ui/vault/TemporalSlider";
import { VaultButton, VaultCard } from "@/components/ui/vault";

// Import Screens
import WalletConnect from "@/components/screens/WalletConnect";
import VaultCreation, { VaultType } from "@/components/screens/VaultCreation";
import VaultArchive from "@/components/screens/VaultArchive";
import UnlockProcess from "@/components/screens/UnlockProcess";

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors, connect } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const publicClient = usePublicClient();

  // State
  const [view, setView] = useState<'creation' | 'archive'>('creation');
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');

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

  const handleConnect = () => {
    const xverseConnector = connectors.find(c => c.name.toLowerCase().includes("xverse"));
    if (xverseConnector) {
        connect({ connector: xverseConnector });
    } else {
        toast.error("Xverse wallet not found");
    }
  };

  const handleMint = async () => {
    if (!message || !isConnected || isMinting) return;

    if (vaultType === VaultType.SOCIAL && !isAddress(beneficiary)) {
        toast.error("Please enter a valid EVM beneficiary address");
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
        setUnlockStatus('success'); // Use generic success screen
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
    setUnlockStatus('penalty'); // Show penalty screen
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
          setUnlockStatus('none'); // Hide penalty screen on completion? Or show success?
          // Maybe show success screen?
    } catch (e: any) {
        console.error("Withdrawal failed", e);
        toast.error(e.message || "Withdrawal failed");
        setUnlockStatus('none');
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
          setUnlockStatus('success');
    } catch (e: any) {
        console.error("Claim failed", e);
        toast.error(e.message || "Claim failed");
    } finally {
        setIsClaiming(false);
    }
  };

  if (!isMounted) return null;

  if (!isConnected) {
    return <WalletConnect onConnect={handleConnect} />;
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0"></div>
        <div className="scanline"></div>

        {/* Dynamic Header */}
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
                <button
                    onClick={() => setView(view === 'creation' ? 'archive' : 'creation')}
                    className="flex flex-col items-end hover:text-white transition-colors group cursor-pointer"
                >
                    <span className="text-primary/70 group-hover:text-primary">VIEW MODE</span>
                    <span className="text-white font-bold uppercase flex items-center gap-1">
                        {view === 'creation' ? 'CREATE' : 'ARCHIVE'}
                        <span className="material-icons text-[10px]">swap_horiz</span>
                    </span>
                </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-grow w-full h-full overflow-hidden">
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
                />
            )}
        </main>

        {/* Footer HUD */}
        <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-obsidian/80 backdrop-blur-md">
            <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors uppercase">Legacy Protocol v1.2</span>
            <span className="hover:text-primary cursor-pointer transition-colors uppercase">Dead Man's Switch Active</span>
            </div>
            <div className="mt-2 md:mt-0 font-mono uppercase">
            ID: <span className="text-primary/60">XJ-9200-ALPHA</span> {'//'} Node: <span className="text-green-500/60">Verified</span>
            </div>
        </footer>
      </div>

      {/* Overlays */}
      {unlockStatus === 'penalty' && (
          <UnlockProcess status="penalty" />
      )}

      {unlockStatus === 'success' && (
          <UnlockProcess
            status="success"
            txHash={successTxHash || undefined}
            onClose={() => {
                setUnlockStatus('none');
                setSuccessTxHash(null);
            }}
          />
      )}

      {/* Generic Loading Overlay for other ops */}
      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay />}
    </>
  );
}
