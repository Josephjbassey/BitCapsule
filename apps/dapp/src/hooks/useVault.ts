import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, usePublicClient, useConnect } from "wagmi";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction } from "@midl/react";
import { regtest } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { reconcileArchiveLogs, parseRevealedData, RevealedData } from "@/shared/utils/vault";
import { encodeFunctionData, isAddress, zeroAddress, parseEther } from "viem";
import { toast } from "sonner";
import { uploadToIPFS } from "@/shared/utils/ipfs";
import { VaultType } from "@/shared/contracts/TimeCapsule";

export function useVault(fromBlockWindow: bigint = 30000n) {
  const { isConnected, connector } = useAccount();
  const { connectors } = useConnect();
  const address = useEVMAddress();
  const publicClient = usePublicClient();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();

  const [history, setHistory] = useState<any[]>([]);
  const [pendingVaults, setPendingVaults] = useState<any[]>([]);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [mintStep, setMintStep] = useState("");
  const [successData, setSuccessData] = useState<{ txHash: string; btcTxHash: string; message?: string; amount?: string; file?: any } | null>(null);

  const [allLogs, setAllLogs] = useState({
    created: [] as any[],
    claimed: [] as any[],
    withdrawn: [] as any[],
    transferred: [] as any[],
    beneficiary: [] as any[]
  });

  const fetchHistory = useCallback(async () => {
    if (!publicClient) return;
    try {
      const contractAddress = TimeCapsule.getAddress();
      const abi = TimeCapsule.abi;

      const currentBlock = await publicClient.getBlockNumber();

      const safeWindow = fromBlockWindow < 0n ? 0n : fromBlockWindow;
      const fromBlock = currentBlock > safeWindow ? currentBlock - safeWindow : 0n;
      if (process.env.NODE_ENV === "development") console.log("[useVault] Syncing from block:", fromBlock.toString(), "to", currentBlock.toString(), "Contract:", contractAddress);

      const results = await Promise.allSettled([
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleCreated', strict: false, fromBlock, toBlock: currentBlock } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleClaimed', strict: false, fromBlock, toBlock: currentBlock } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'EarlyWithdrawal', strict: false, fromBlock, toBlock: currentBlock } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'CapsuleTransferred', strict: false, fromBlock, toBlock: currentBlock } as any),
        publicClient.getLogs({ address: contractAddress, abi, eventName: 'BeneficiaryUpdated', strict: false, fromBlock, toBlock: currentBlock } as any),
      ]);

      const logs = results.map((res, i) => {
        if (res.status === 'fulfilled') return res.value;
        const eventNames = ['CapsuleCreated', 'CapsuleClaimed', 'EarlyWithdrawal', 'CapsuleTransferred', 'BeneficiaryUpdated'];
        console.error(`[useVault] Failed to fetch logs for ${eventNames[i]}`, res.reason);
        return [];
      });
      const [created, claimed, withdrawn, transferred, beneficiary] = logs;


      const nextLogs = {
          created,
          claimed,
          withdrawn,
          transferred,
          beneficiary
      };

      setAllLogs(nextLogs);
      if (process.env.NODE_ENV === "development") console.log("[useVault] Raw log lengths:", { created: created.length, claimed: claimed.length, withdrawn: withdrawn.length, transferred: transferred.length, beneficiary: beneficiary.length });

      const activeLogs = reconcileArchiveLogs(nextLogs.created, nextLogs.claimed, nextLogs.withdrawn, nextLogs.transferred, nextLogs.beneficiary);
      setHistory(activeLogs);

      if (typeof window !== 'undefined') {
          const confirmedHashes = new Set(nextLogs.created.map(l => (l as any).transactionHash));
          setPendingVaults(pending => {
              const filtered = pending.filter(p => !confirmedHashes.has(p.transactionHash));
              if (filtered.length !== pending.length) {
                  localStorage.setItem('bitcapsule_pending_vaults', JSON.stringify(filtered, (k, v) => typeof v === 'bigint' ? v.toString() : v));
              }
              return filtered;
          });
      }

    } catch (error) {
      console.error("[useVault] Failed to fetch history", error);
    }
  }, [publicClient, fromBlockWindow]);

  useEffect(() => {
    if (isConnected && publicClient) {
      fetchHistory();
      const interval = setInterval(() => fetchHistory(), 15000);
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
              args: args as any,
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
        amount: revealedData?.amount?.toString(),
        file: revealedData?.file
      });
      setTimeout(() => fetchHistory(), 2000);
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

  const handleMint = async (params: {
    amount: string;
    message: string;
    label: string;
    vaultType: VaultType;
    beneficiary: string;
    unlockTimeDays: number;
    fileInfo: { name: string; size: number; file?: File } | null;
  }) => {
    if (!isConnected || isPerformingAction || isBroadcasting) return;

    setIsPerformingAction(true);
    setMintStep("Preparing Vault Protocol...");

    try {
      let targetBeneficiary: `0x${string}` = address as `0x${string}`;
      if (params.vaultType === VaultType.SOCIAL || params.vaultType === VaultType.LEGACY) {
          const isEvm = isAddress(params.beneficiary);
          if (isEvm) {
            targetBeneficiary = params.beneficiary as `0x${string}`;
          } else {
            setMintStep("Mapping Bitcoin Identity...");
            targetBeneficiary = (await getEVMAddress(params.beneficiary as any, regtest)) as `0x${string}`;
          }
      }

      let fileUrl = "";
      if (params.fileInfo?.file) {
        setMintStep("Uploading to IPFS Archive...");
        fileUrl = await uploadToIPFS(params.fileInfo.file);
      }

      const amountInWei = parseEther(params.amount);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + params.unlockTimeDays * 24 * 60 * 60);
      const combinedMessage = JSON.stringify({
        label: params.label || "Unnamed Vault",
        secret: params.message,
        file: { ...params.fileInfo, url: fileUrl },
        amount: params.amount
      });

      setMintStep("Initializing Temporal Intention...");

      const denom = 10n ** 10n;
      const satoshis = Number((amountInWei + denom - 1n) / denom);

      if (process.env.NODE_ENV === "development") {
        console.log("[useVault] Transaction params:", {
          amount: params.amount,
          amountInWei: amountInWei.toString(),
          satoshis,
          walletName: connector?.name
        });
      }

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.getAddress(),
            value: amountInWei,
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                zeroAddress,
                amountInWei,
                unlockTimestamp,
                targetBeneficiary,
                params.vaultType,
                combinedMessage
              ],
            }),
          },
          deposit: (amountInWei > 0n) ? { satoshis } : undefined,
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });

      setMintStep("Broadcasting to Blockchain...");
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });

      setMintStep("Confirming Temporal Link...");
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessData({
        txHash: txHashes[0],
        btcTxHash: tx.id,
        message: params.message,
        amount: params.amount
      });

      const newPending = {
        transactionHash: txHashes[0],
        btcTxHash: tx.id,
        args: {
          id: BigInt(0),
          owner: address,
          beneficiary: targetBeneficiary,
          unlockTime: unlockTimestamp,
          vaultType: params.vaultType,
          amount: amountInWei,
          message: combinedMessage,
        },
        isPending: true,
        timestamp: Date.now()
      };

      setPendingVaults(prev => {
        const updated = [newPending, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('bitcapsule_pending_vaults', JSON.stringify(updated, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ));
        }
        return updated;
      });

      setTimeout(() => fetchHistory(), 2000);
    } catch (error: any) {
      toast.error(error.message || "Minting failed");
      throw error;
    } finally {
      setIsPerformingAction(false);
      setIsBroadcasting(false);
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

  const clearSuccessData = useCallback(() => setSuccessData(null), []);

  return {
    history,
    pendingVaults,
    fetchHistory,
    handleMint,
    handleTransferCapsule,
    handleTransferBeneficiary,
    handleWithdrawEarly,
    handleClaim,
    isBroadcasting,
    isPerformingAction,
    mintStep,
    successData,
    clearSuccessData,
    address,
    isConnected
  };
}
