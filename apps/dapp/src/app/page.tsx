"use client";
import { RevealedData, parseRevealedData } from "@/shared/utils/vault";
import { uploadToIPFS } from "@/shared/utils/ipfs";
import dynamic from "next/dynamic";
import WalletConnect from "@/components/screens/WalletConnect";

import { useState, useEffect } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";

import { useWaitForTransaction, useAddNetwork } from "@midl/react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import { ConnectButton } from "@midl/satoshi-kit";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress, parseEther, isAddressEqual } from "viem";
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
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; file?: File } | null>(null);
  const [vaultType, setVaultType] = useState<VaultType>(VaultType.TEMPORAL);
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockTimeDays, setUnlockTimeDays] = useState(365); // Default 1 year

  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState<string>("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [successBtcTxHash, setSuccessBtcTxHash] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<RevealedData | null>(null);


  const extractRevealedData = (id: bigint) => {
    const log = history.find(l => (l as any).args.id === id);
    if (log) {
      setRevealedData(parseRevealedData(log));
    }
  };

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

      const activeLogs = logs.filter(l => {
        const isNotProcessed = !processedIds.has((l as any).args.id?.toString());
        const isRelevant = address && (
          isAddressEqual((l as any).args.owner as `0x${string}`, address as `0x${string}`) ||
          isAddressEqual((l as any).args.beneficiary as `0x${string}`, address as `0x${string}`)
        );
        return isNotProcessed && isRelevant;
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

  const handleMint = async () => {
    if (!isConnected || isMinting) return;
    if (!amount) {
      toast.error("Please enter a deposit amount");
      return;
    }
    if (!message) {
      toast.error("Please enter a secret message for your capsule");
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
      const isEvm = isAddress(beneficiary);
      const isBtc = /^(1|3|bc1)[a-zA-Z0-9]{25,59}$/.test(beneficiary);

      if (!isEvm && !isBtc) {
        toast.error("Invalid beneficiary format. Use EVM (0x...) or Bitcoin (1, 3, bc1...) address.");
        return;
      }

      if (isEvm) {
        targetBeneficiary = beneficiary as `0x${string}`;
      } else {
        toast.info("Bitcoin beneficiary detected. Metadata archived.");
        targetBeneficiary = zeroAddress;
      }
    }

    setIsMinting(true);
    setMintStep("Preparing Vault Protocol...");
    try {
      let fileUrl = "";
      let storageFee = 0n;

      if (fileInfo?.file) {
        setMintStep("Uploading to IPFS Archive...");
        try {
          fileUrl = await uploadToIPFS(fileInfo.file);
          // Simulate a storage fee calculation (e.g., 0.0001 BTC)
          storageFee = parseEther("0.0001");
          toast.success("File archived on IPFS");
        } catch (e) {
          toast.error("IPFS Upload Failed");
          throw e;
        }
      }

      const amountInWei = parseEther(amount);
      const netAmount = amountInWei - storageFee;

      if (netAmount <= 0n && amountInWei > 0n) {
        toast.error("Insufficient funds for storage fees.");
        return;
      }

      const finalAmount = netAmount > 0n ? netAmount : amountInWei;
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + unlockTimeDays * 24 * 60 * 60);

      // Combine label, message, and fileInfo into a JSON string
      const combinedMessage = JSON.stringify({
        label: label || "Unnamed Vault",
        secret: message,
        file: { ...fileInfo, url: fileUrl },
        amount: amount // Store original BTC amount for reveal
      });

      setMintStep("Initializing Temporal Intention...");
      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            value: amountInWei, // Send full amount, fee stays in contract or sent to treasury
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                zeroAddress,
                finalAmount,
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

      setMintStep("Finalizing Bitcoin Anchor...");
      const { tx } = await finalizeBTCTransactionAsync();
      setMintStep("Awaiting Neural Signature...");
      const signedTransaction = await signIntentionAsync({
        intention,
        txId: tx.id,
      });

      setMintStep("Broadcasting to Blockchain...");
      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });

      if (txHashes && txHashes.length > 0) {
        console.log("[BitCapsule] Tx hashes:", txHashes);
        console.log("[BitCapsule] BTC Tx ID:", tx.id);

        setMintStep("Confirming Temporal Link...");
      await waitForTransactionAsync({ txId: tx.id });

        setSuccessTxHash(txHashes[0]); // EVM hash
        setSuccessBtcTxHash(tx.id);    // BTC hash

        setMessage("");
        setLabel("");
        setAmount("");
        setFileInfo(null);
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
      setMintStep("");
    }
  };

  const handleWithdrawEarly = async (id: bigint) => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    setUnlockStatus('penalty');

    // Find the log to extract original message/amount
    extractRevealedData(id);

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
    }
  };

  const handleClaim = async (id: bigint, useLegacy: boolean) => {
    if (isClaiming) return;
    setIsClaiming(true);

    // Find the log to extract original message/amount
    extractRevealedData(id);

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
    }
  };

  if (!isMounted) return null;

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="relative min-h-screen bg-background-dark text-white font-display flex flex-col selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full flex flex-col items-center animate-in fade-in duration-700">
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
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
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
          revealedData={revealedData}
          txHash={successTxHash || undefined}
          onClose={() => { setUnlockStatus('none'); setRevealedData(null); }}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay message={mintStep} />}
    </div>
  );
}
