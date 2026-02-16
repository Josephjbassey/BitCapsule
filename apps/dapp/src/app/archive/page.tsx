"use client";

import { useState, useEffect } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction } from "@midl/react";
import { useAccount, usePublicClient } from "wagmi";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";
import VaultArchive from "@/components/screens/VaultArchive";
import UnlockProcess from "@/components/screens/UnlockProcess";
import { toast } from "sonner";
import Link from "next/link";

export default function ArchivePage() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();
  const publicClient = usePublicClient();

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [successBtcTxHash, setSuccessBtcTxHash] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<any>(null);

  const isSigningOrPending = isBroadcasting || isWithdrawing || isClaiming;

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

  const handleWithdrawEarly = async (id: bigint) => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    setUnlockStatus('penalty');

    // Find the log to extract original message/amount
    const log = history.find(l => (l as any).args.id === id);
    if (log) {
      try {
        const data = JSON.parse(log.args.message);
        setRevealedData({
          message: data.secret,
          amount: data.amount || "---",
          file: data.file
        });
      } catch (e) {
        setRevealedData({ message: log.args.message });
      }
    }

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

    // Find the log to extract original message/amount
    const log = history.find(l => (l as any).args.id === id);
    if (log) {
      try {
        const data = JSON.parse(log.args.message);
        setRevealedData({
          message: data.secret,
          amount: data.amount || "---",
          file: data.file
        });
      } catch (e) {
        setRevealedData({ message: log.args.message });
      }
    }

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

  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-background-dark text-white font-display flex flex-col items-center justify-center p-8 text-center overflow-x-hidden">
        <BackgroundEffects />
        <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center border border-primary shadow-neon">
              <span className="material-icons text-primary text-3xl">hourglass_empty</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase glow-text">BitCapsule</h1>

          </div>

          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">Connect protocol to access archive.</h2>
            <div className="p-1 rounded-lg bg-gradient-to-r from-primary/50 via-xverse-orange/50 to-primary/50">
               <div className="bg-background-dark rounded-md p-4">
                 <Link href="/" className="px-8 py-3 bg-primary text-black font-bold rounded-sm hover:bg-white transition-all uppercase text-sm inline-block font-display tracking-widest">
                   Establish Link
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background-dark text-white font-display flex flex-col selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full h-full animate-in fade-in duration-700">
        <VaultArchive
          history={history}
          currentTime={currentTime}
          handleWithdrawEarly={handleWithdrawEarly}
          handleClaim={handleClaim}
          address={address}
          isSigningOrPending={isSigningOrPending}
          onNavigateBack={() => window.location.href = '/'}
            onRefresh={fetchHistory}
        />
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono">Legacy Protocol v1.2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono">Archive Active</span>
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
          revealedData={revealedData}
          txHash={successTxHash || undefined}
          onClose={() => { setUnlockStatus('none'); setRevealedData(null); }}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay />}
    </div>
  );
}
