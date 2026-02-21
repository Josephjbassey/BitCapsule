"use client";
import { regtest } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import { RevealedData, parseRevealedData } from "@/shared/utils/vault";
import { uploadToIPFS } from "@/shared/utils/ipfs";
import dynamic from "next/dynamic";
import WalletConnect from "@/components/screens/WalletConnect";

import { useState, useEffect } from "react";
import { useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction } from "@midl/react";
import { useAccount, useConnect } from "wagmi";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress, parseEther } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";
import { useVault } from "@/hooks/useVault";

// Import Screens
import { VaultType } from "@/components/screens/VaultCreation";
const VaultCreation = dynamic(() => import("@/components/screens/VaultCreation"), { ssr: false });
const VaultArchive = dynamic(() => import("@/components/screens/VaultArchive"), { ssr: false });
const UnlockProcess = dynamic(() => import("@/components/screens/UnlockProcess"), { ssr: false });

export default function Home() {
  const { connectors } = useConnect();
  const { connector } = useAccount();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();

  const {
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
    mintStep,
    setMintStep,
    successData,
    setSuccessData,
    address,
    isConnected
  } = useVault();

  // Diagnostics & Wallet Validation
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== 'undefined') {
      console.log("[BitCapsule] Connection State:", { isConnected, address });
    }

    if (isConnected) {
        const btcConnector = connectors.find(c =>
            c.name.toLowerCase().includes('xverse') ||
            c.name.toLowerCase().includes('bitcoin') ||
            c.name.toLowerCase().includes('satoshi')
        );
        if (!btcConnector && process.env.NODE_ENV === "development") {
            console.warn("[BitCapsule] Warning: No explicitly Bitcoin-compatible connector detected in the current session.");
        }
    }
  }, [isConnected, address, connectors]);


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
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<RevealedData | null>(null);

  const isSigningOrPending = isMinting || isBroadcasting || isPerformingAction;

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
        setMintStep("Mapping Bitcoin Identity...");
        targetBeneficiary = (await getEVMAddress(beneficiary as any, regtest)) as `0x${string}`;
        toast.info("Bitcoin beneficiary mapped to EVM.");
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
          storageFee = parseEther("0.0001");
          toast.success("File archived on IPFS");
        } catch (e) {
          toast.error("IPFS Upload Failed");
          throw e;
        }
      }

      const amountInWei = parseEther(amount);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + unlockTimeDays * 24 * 60 * 60);

      const combinedMessage = JSON.stringify({
        label: label || "Unnamed Vault",
        secret: message,
        file: { ...fileInfo, url: fileUrl },
        amount: amount
      });

      setMintStep("Initializing Temporal Intention...");
      const isXverse = connector?.id?.toLowerCase().includes('xverse') || connector?.name?.toLowerCase().includes('xverse');
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
                targetBeneficiary as `0x${string}`,
                vaultType,
                combinedMessage
              ],
            }),
          },
          deposit: (isXverse && amountInWei > 0n) ? {
            satoshis: Math.ceil(Number(amountInWei) / 10**10)
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

      setMintStep("Confirming Temporal Link...");
      await waitForTransactionAsync({ txId: tx.id });

      setSuccessData({
        txHash: txHashes[0],
        btcTxHash: tx.id,
        message: message,
        amount: amount
      });

      const newPending = {
        transactionHash: txHashes[0],
        btcTxHash: tx.id,
        args: {
          id: BigInt(0),
          owner: address,
          beneficiary: targetBeneficiary,
          unlockTime: unlockTimestamp,
          vaultType: vaultType,
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

      setMessage("");
      setLabel("");
      setAmount("");
      setFileInfo(null);
      setTimeout(fetchHistory, 2000);
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Transaction failed");
    } finally {
      setIsMinting(false);
      setIsBroadcasting(false);
      setMintStep("");
    }
  };

  const onWithdrawEarly = async (id: bigint) => {
    setUnlockStatus('penalty');
    const log = history.find(l => (l as any).args.id === id);
    if (log) setRevealedData(parseRevealedData(log));
    try {
      await handleWithdrawEarly(id);
    } catch (e) {
      setUnlockStatus('none');
      setRevealedData(null);
    }
  };

  const onClaim = async (id: bigint, useLegacy: boolean) => {
    const log = history.find(l => (l as any).args.id === id);
    if (log) setRevealedData(parseRevealedData(log));
    try {
      await handleClaim(id, useLegacy);
      setUnlockStatus('success');
    } catch (e) {
      setRevealedData(null);
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

      <main className="relative z-10 flex-grow w-full flex flex-col items-center overflow-hidden animate-in fade-in duration-700">
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
            pendingVaults={pendingVaults}
            history={history}
            currentTime={currentTime}
            handleWithdrawEarly={onWithdrawEarly}
            handleClaim={onClaim}
            handleTransferCapsule={handleTransferCapsule}
            handleTransferBeneficiary={handleTransferBeneficiary}
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

      {successData && (
        <SuccessOverlay
          txHash={successData.txHash}
          btcTxHash={successData.btcTxHash}
          message={successData.message}
          amount={successData.amount}
          onClose={() => setSuccessData(null)}
          onRefresh={fetchHistory}
        />
      )}

      {unlockStatus !== 'none' && (
        <UnlockProcess
          status={unlockStatus}
          revealedData={revealedData || (successData ? {
            message: successData.message || "Protocol Active. Payload Recovered.",
            amount: successData.amount || "---",
            file: successData.file
          } : null)}
          txHash={successData?.txHash}
          onClose={() => { setUnlockStatus('none'); setRevealedData(null); }}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay message={mintStep} />}
    </div>
  );
}
