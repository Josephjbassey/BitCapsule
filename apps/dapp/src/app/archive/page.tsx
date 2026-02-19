"use client";
import { RevealedData, parseRevealedData } from "@/shared/utils/vault";

import WalletConnect from "@/components/screens/WalletConnect";
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
  const [mintStep, setMintStep] = useState<string>("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [successBtcTxHash, setSuccessBtcTxHash] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successAmount, setSuccessAmount] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<RevealedData | null>(null);


  const extractRevealedData = (id: bigint) => {
    const log = history.find(l => (l as any).args.id === id);
    if (log) {
      const data = parseRevealedData(log);
      setRevealedData(data);
      return data;
    }
    return null;
  };

const isSigningOrPending = isBroadcasting || isWithdrawing || isClaiming;

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    const tcAddress = TimeCapsule.getAddress();
    if (!publicClient) return;
    try {
      const [logs, claimedLogs, withdrawnLogs, transferLogs, beneficiaryLogs] = await Promise.all([
        publicClient.getLogs({
          address: tcAddress,
          abi: TimeCapsule.abi,
          eventName: 'CapsuleCreated', strict: false,
          fromBlock: 'earliest'
        } as any),
        publicClient.getLogs({
          address: tcAddress,
          abi: TimeCapsule.abi,
          eventName: 'CapsuleClaimed', strict: false,
          fromBlock: 'earliest'
        } as any),
        publicClient.getLogs({
          address: tcAddress,
          abi: TimeCapsule.abi,
          eventName: 'EarlyWithdrawal', strict: false,
          fromBlock: 'earliest'
        } as any),
        publicClient.getLogs({
          address: tcAddress,
          abi: TimeCapsule.abi,
          eventName: 'CapsuleTransferred', strict: false,
          fromBlock: 'earliest'
        } as any),
        publicClient.getLogs({
          address: tcAddress,
          abi: TimeCapsule.abi,
          eventName: 'BeneficiaryUpdated', strict: false,
          fromBlock: 'earliest'
        } as any)
      ]);

      const processedIds = new Set([
        ...claimedLogs.map(l => (l as any).args.id?.toString()),
        ...withdrawnLogs.map(l => (l as any).args.id?.toString())
      ]);

      const currentOwners = new Map();
      const currentBeneficiaries = new Map();

      logs.forEach(l => {
        const id = l.args.id?.toString();
        if (id) {
          currentOwners.set(id, l.args.owner);
          currentBeneficiaries.set(id, l.args.beneficiary);
        }
      });

      [...transferLogs].sort((a, b) => Number(a.blockNumber || 0) - Number(b.blockNumber || 0)).forEach(l => {
        const id = l.args.id?.toString();
        if (id) currentOwners.set(id, l.args.newOwner);
      });

      [...beneficiaryLogs].sort((a, b) => Number(a.blockNumber || 0) - Number(b.blockNumber || 0)).forEach(l => {
        const id = l.args.id?.toString();
        if (id) currentBeneficiaries.set(id, l.args.newBeneficiary);
      });

      const activeLogs = logs.filter(l => !processedIds.has(l.args.id?.toString())).map(l => {
        const id = l.args.id?.toString();
        return {
          ...l,
          args: {
            ...l.args,
            owner: currentOwners.get(id) || l.args.owner,
            beneficiary: currentBeneficiaries.get(id) || l.args.beneficiary
          }
        };
      });

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
    const data = extractRevealedData(id);

    try {
      setMintStep("Initializing Temporal Intention...");
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

      setMintStep("Finalizing Bitcoin Anchor...");
      const { tx } = await finalizeBTCTransactionAsync();
      setMintStep("Awaiting Neural Signature...");
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
      setMintStep("Broadcasting to Blockchain...");
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      setMintStep("Confirming Temporal Link...");
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessTxHash(txHashes[0]);
      setSuccessBtcTxHash(tx.id);
      setSuccessMessage(data?.message || null);
      setSuccessAmount(data?.amount?.toString() || null);

      toast.success("Early withdrawal successful!");
      setTimeout(fetchHistory, 2000);
      setUnlockStatus('none');
    } catch (e: any) {
      console.error("Withdrawal failed", e);
      toast.error(e.message || "Withdrawal failed");
      setUnlockStatus('none');
      setRevealedData(null);
    } finally {
      setIsWithdrawing(false);
      setIsBroadcasting(false);
      setMintStep("");
    }
  };

  const handleClaim = async (id: bigint, useLegacy: boolean) => {
    if (isClaiming) return;
    setIsClaiming(true);

    // Find the log to extract original message/amount
    const data = extractRevealedData(id);

    try {
      setMintStep("Initializing Temporal Intention...");
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

      setMintStep("Finalizing Bitcoin Anchor...");
      const { tx } = await finalizeBTCTransactionAsync();
      setMintStep("Awaiting Neural Signature...");
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
      setMintStep("Broadcasting to Blockchain...");
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      setMintStep("Confirming Temporal Link...");
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessTxHash(txHashes[0]);
      setSuccessBtcTxHash(tx.id);
      setSuccessMessage(data?.message || null);
      setSuccessAmount(data?.amount?.toString() || null);

      toast.success("Payload claimed successfully!");
      setTimeout(fetchHistory, 2000);
      setUnlockStatus('success');
    } catch (e: any) {
      console.error("Claim failed", e);
      toast.error(e.message || "Claim failed");
      setRevealedData(null);
    } finally {
      setIsClaiming(false);
      setIsBroadcasting(false);
      setMintStep("");
    }
  };

  if (!isMounted) return null;

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="relative h-screen bg-background-dark overflow-hidden text-white font-display flex flex-col selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full overflow-hidden animate-in fade-in duration-700">
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
          message={successMessage || undefined}
          amount={successAmount || undefined}
          onClose={() => {
            setSuccessTxHash(null);
            setSuccessBtcTxHash(null);
            setSuccessMessage(null);
            setSuccessAmount(null);
          }}
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

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay message={mintStep} />}
    </div>
  );
}
