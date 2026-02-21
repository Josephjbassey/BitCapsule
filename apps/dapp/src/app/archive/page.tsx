"use client";
import { RevealedData, parseRevealedData } from "@/shared/utils/vault";
import WalletConnect from "@/components/screens/WalletConnect";
import { useState, useEffect } from "react";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";
import VaultArchive from "@/components/screens/VaultArchive";
import UnlockProcess from "@/components/screens/UnlockProcess";
import { useVault } from "@/hooks/useVault";

export default function ArchivePage() {
  const {
    history,
    pendingVaults,
    fetchHistory,
    handleTransferCapsule,
    handleTransferBeneficiary,
    handleWithdrawEarly,
    handleClaim,
    isBroadcasting,
    isPerformingAction,
    mintStep,
    successData,
    setSuccessData,
    address,
    isConnected
  } = useVault();

  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');
  const [revealedData, setRevealedData] = useState<RevealedData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isSigningOrPending = isBroadcasting || isPerformingAction;

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

      <main className="relative z-10 flex-grow w-full overflow-hidden animate-in fade-in duration-700">
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
          revealedData={revealedData || successData}
          txHash={successData?.txHash}
          onClose={() => { setUnlockStatus('none'); setRevealedData(null); }}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay message={mintStep} />}
    </div>
  );
}
