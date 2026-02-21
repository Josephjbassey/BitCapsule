"use client";
import { RevealedData, parseRevealedData } from "@/shared/utils/vault";
import dynamic from "next/dynamic";
import WalletConnect from "@/components/screens/WalletConnect";

import { useState, useEffect, useCallback } from "react";
import { useConnect } from "wagmi";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";
import { useVault } from "@/hooks/useVault";

// Import Screens
import { VaultType } from "@/shared/contracts/TimeCapsule";
const VaultCreation = dynamic(() => import("@/components/screens/VaultCreation"), { ssr: false });
const VaultArchive = dynamic(() => import("@/components/screens/VaultArchive"), { ssr: false });
const UnlockProcess = dynamic(() => import("@/components/screens/UnlockProcess"), { ssr: false });

export default function Home() {
  const { connectors } = useConnect();

  const {
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

  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<RevealedData | null>(null);

  const isSigningOrPending = isBroadcasting || isPerformingAction;

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const onMint = async () => {
    if (!amount) {
      toast.error("Please enter a deposit amount");
      return;
    }
    if (!message) {
      toast.error("Please enter a secret message for your capsule");
      return;
    }

    try {
      await handleMint({
        amount,
        message,
        label,
        vaultType,
        beneficiary,
        unlockTimeDays,
        fileInfo
      });
      setMessage("");
      setLabel("");
      setAmount("");
      setFileInfo(null);
    } catch (e) {}
  };

  const onWithdrawEarly = async (id: bigint) => {
    setUnlockStatus('penalty');
    const log = history.find(l => (l as any).args.id === id);
    if (log) setRevealedData(parseRevealedData(log));
    try {
      await handleWithdrawEarly(id);
      setUnlockStatus('success');
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
            handleMint={onMint}
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
          onClose={clearSuccessData}
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
          onClose={() => {
            setUnlockStatus('none');
            setRevealedData(null);
            if (successData) clearSuccessData();
          }}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay message={mintStep} />}
    </div>
  );
}
