import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction } from "@midl/react";
import { regtest } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { reconcileArchiveLogs, parseRevealedData, RevealedData } from "@/shared/utils/vault";
import { encodeFunctionData, isAddress } from "viem";
import { toast } from "sonner";

export function useVault() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const publicClient = usePublicClient();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();

  const [history, setHistory] = useState<any[]>([]);
  const [pendingVaults, setPendingVaults] = useState<any[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [mintStep, setMintStep] = useState("");
  const [successData, setSuccessData] = useState<{
    txHash: string;
    btcTxHash: string;
    message?: string;
    amount?: string | number;
    file?: RevealedData['file']
  } | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!publicClient) return;
    try {
      const contractAddress = TimeCapsule.getAddress();
      const abi = TimeCapsule.abi;

      const [created, claimed, withdrawn, transferred, beneficiary] = await Promise.all([
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleCreated', strict: false, fromBlock: 'earliest' } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleClaimed', strict: false, fromBlock: 'earliest' } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'EarlyWithdrawal', strict: false, fromBlock: 'earliest' } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleTransferred', strict: false, fromBlock: 'earliest' } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'BeneficiaryUpdated', strict: false, fromBlock: 'earliest' } as any),
      ]);

      const activeLogs = reconcileArchiveLogs(created, claimed, withdrawn, transferred, beneficiary);
      setHistory(activeLogs);

      if (typeof window !== 'undefined') {
        const confirmedHashes = new Set(created.map(l => (l as any).transactionHash));
        setPendingVaults(prev => {
          const filtered = prev.filter(p => !confirmedHashes.has(p.transactionHash));
          if (filtered.length !== prev.length) {
            localStorage.setItem('bitcapsule_pending_vaults', JSON.stringify(filtered, (k, v) => typeof v === 'bigint' ? v.toString() : v));
          }
          return filtered;
        });
      }
      console.log("[useVault] Sync Complete. Active:", activeLogs.length);
    } catch (error) {
      console.error("[useVault] Failed to fetch history", error);
    }
  }, [publicClient]);

  useEffect(() => {
    if (isConnected && publicClient) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected, publicClient, fetchHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bitcapsule_pending_vaults');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const normalized = parsed.map((v: any) => ({
            ...v,
            args: {
              ...v.args,
              unlockTime: BigInt(v.args.unlockTime),
              amount: BigInt(v.args.amount)
            }
          }));
          setPendingVaults(normalized);
        } catch (e) { console.error('Failed to parse pending vaults', e); }
      }
    }
  }, []);

  const handleAction = async (functionName: string, args: any[], successMsg: string, mintMsg: string, revealedData?: RevealedData) => {
    setIsPerformingAction(true);
    setMintStep(mintMsg);
    try {
      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.getAddress(),
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: functionName as any,
              args,
            }),
          },
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({ serializedTransactions: [signedTransaction], btcTransaction: tx.hex });
      await waitForTransactionAsync({ txId: tx.id });

      toast.success(successMsg);
      setSuccessData({
        txHash: txHashes[0],
        btcTxHash: tx.id,
        message: revealedData?.message,
        amount: revealedData?.amount,
        file: revealedData?.file
      });
      setTimeout(fetchHistory, 2000);
      return txHashes[0];
    } catch (e: any) {
      toast.error(e.message || `${functionName} failed`);
      throw e;
    } finally {
      setIsBroadcasting(false);
      setIsPerformingAction(false);
      setMintStep("");
    }
  };

  const handleTransferCapsule = async (id: bigint, newOwner: string) => {
    const mapped = isAddress(newOwner) ? newOwner : (await getEVMAddress(newOwner as any, regtest)) as `0x${string}`;
    return handleAction("transferCapsule", [id, mapped], "Capsule ownership transferred!", "Initializing Transfer...");
  };

  const handleTransferBeneficiary = async (id: bigint, newBeneficiary: string) => {
    const mapped = isAddress(newBeneficiary) ? newBeneficiary : (await getEVMAddress(newBeneficiary as any, regtest)) as `0x${string}`;
    return handleAction("transferBeneficiary", [id, mapped], "Beneficiary updated!", "Updating Beneficiary...");
  };

  const handleWithdrawEarly = async (id: bigint) => {
    const log = history.find(l => (l as any).args.id === id);
    const revealed = log ? parseRevealedData(log) : undefined;
    return handleAction("withdrawEarly", [id], "Early withdrawal successful!", "Initializing Temporal Intention...", revealed);
  };

  const handleClaim = async (id: bigint, useLegacy: boolean) => {
    const log = history.find(l => (l as any).args.id === id);
    const revealed = log ? parseRevealedData(log) : undefined;
    return handleAction(useLegacy ? "claimLegacy" : "claim", [id], "Payload claimed successfully!", "Initializing Temporal Intention...", revealed);
  };

  return {
    history,
    pendingVaults,
    setPendingVaults,
    fetchHistory,
    handleTransferCapsule,
    handleTransferBeneficiary,
    handleWithdrawEarly,
    handleClaim,
    isBroadcasting,
    setIsBroadcasting,
    isPerformingAction,
    setIsPerformingAction,
    mintStep,
    setMintStep,
    successData,
    setSuccessData,
    address,
    isConnected
  };
}
