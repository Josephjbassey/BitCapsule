"use client";

import React, { useState, useEffect } from "react";
import { isAddressEqual } from "viem";
import { parseVaultMessage } from "@/shared/utils/vault";
import { VaultType } from "@/shared/contracts/TimeCapsule";
import { CountdownTimer } from "../ui/vault/CountdownTimer";

interface VaultArchiveProps {
  history: any[];
  pendingVaults?: any[];
  currentTime: number;
  handleWithdrawEarly: (id: bigint) => void;
  handleClaim: (id: bigint, legacy: boolean) => void;
  handleTransferCapsule: (id: bigint, newOwner: string) => void;
  handleTransferBeneficiary: (id: bigint, newBeneficiary: string) => void;
  address: string | undefined;
  isSigningOrPending: boolean;
  onNavigateBack: () => void;
  onRefresh?: () => void;
}

export default function VaultArchive({
  history,
  pendingVaults,
  currentTime,
  handleWithdrawEarly,
  handleClaim,
  handleTransferCapsule,
  handleTransferBeneficiary,
  address,
  isSigningOrPending,
  onNavigateBack,
  onRefresh,
}: VaultArchiveProps) {
  const [filter, setFilter] = useState<'ALL' | 'LOCKED' | 'UNLOCKED'>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("[VaultArchive] Component Rendered. History Size:", history.length, "Pending Size:", pendingVaults?.length, "Connected Address:", address);
  }, [history, pendingVaults, address]);

  const combinedHistory = [
    ...(pendingVaults || []),
    ...history
  ];

  const filteredHistory = combinedHistory.filter(log => {
    // Only show vaults where user is owner or beneficiary
    const isOwner = address && log.args.owner && isAddressEqual(address as `0x${string}`, log.args.owner as `0x${string}`);
    const isBeneficiary = address && log.args.beneficiary && isAddressEqual(address as `0x${string}`, log.args.beneficiary as `0x${string}`);

    if (!isOwner && !isBeneficiary) return false;

    const unlockTime = Number(log.args.unlockTime);
    const isLocked = currentTime < unlockTime;
    if (filter === 'LOCKED') return isLocked;
    if (filter === 'UNLOCKED') return !isLocked;
    return true;
  });

  return (
    <div className="flex flex-grow w-full h-full min-h-[500px] bg-background-dark text-white font-display overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 lg:z-30 w-64 h-full border-r border-white/10 bg-background-dark/95 lg:bg-background-dark/80 backdrop-blur-xl transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="h-16 md:h-20 flex items-center px-6 border-b border-white/5 cursor-pointer" onClick={onNavigateBack}>
              <span className="material-symbols-outlined text-2xl md:text-3xl text-primary animate-pulse-fast">hourglass_top</span>
              <span className="ml-3 font-bold tracking-widest text-lg uppercase">Archive</span>
            </div>
            <nav className="flex flex-col mt-8 gap-2">
              {[
                { id: 'ALL', label: 'All Vaults', icon: 'auto_awesome_motion' },
                { id: 'LOCKED', label: 'Locked', icon: 'lock' },
                { id: 'UNLOCKED', label: 'Ready', icon: 'lock_open' }
              ].map((item) => (
                <button type="button"
                  key={item.id}
                  onClick={() => { setFilter(item.id as any); setIsSidebarOpen(false); }}
                  className={`group flex items-center w-full px-6 py-4 text-left transition-all hover:translate-x-1 active:scale-[0.98] ${filter === item.id ? "text-primary bg-primary/5 border-l-2 border-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  <span className="material-symbols-outlined text-xl mr-4">{item.icon}</span>
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">settings</span>
              </div>
              <div className="text-[10px] font-mono text-left">
                <div className="text-white uppercase tracking-tighter">BitCapsule OS</div>
                <div className="text-primary/40 text-[8px]">STABLE_CONNECTION</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-primary p-1"
            >
              <span className="material-icons">filter_list</span>
            </button>
            <h1 className="text-lg md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 uppercase">Temporal Archive</h1>
          </div>
          <div className="flex items-center gap-3">
             {onRefresh && (
               <button type="button"
                 onClick={onRefresh}
                 className="p-2 text-primary/60 hover:text-primary transition-colors flex items-center gap-2 group active:scale-[0.98]"
                 title="Force Temporal Sync"
               >
                 <span className="material-icons text-sm group-active:rotate-180 transition-transform duration-500">sync</span>
                 <span className="text-[10px] font-mono tracking-widest hidden sm:inline">SYNC</span>
               </button>
             )}
             <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-mono text-primary flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                LIVE_SYNC
             </div>
             <div className="hidden md:flex px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-mono text-blue-400 items-center gap-2" title="Blockscout may lag in indexing new transactions. Check Bitcoin mempool for real-time status.">
                <span className="material-icons text-[10px]">info</span>
                89% INDEXED
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6 opacity-20">
                <span className="material-icons text-6xl">cloud_off</span>
              </div>
              <h3 className="text-xl font-bold text-white/40 tracking-widest uppercase text-left">No Records Found</h3>
              <p className="text-xs text-white/20 font-mono mt-2">Initialize your first vault to begin archiving.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-24">
              {filteredHistory.map((log, i) => {
                const isPending = !!log.isPending;
                const id = log.args.id;
                const unlockTime = Number(log.args.unlockTime);
                const isLocked = currentTime < unlockTime;
                const { label, secret, file } = parseVaultMessage(log.args.message);

                const isOwner = address && log.args.owner && isAddressEqual(address as `0x${string}`, log.args.owner as `0x${string}`);
                const isBeneficiary = address && log.args.beneficiary && isAddressEqual(address as `0x${string}`, log.args.beneficiary as `0x${string}`);
                const isLegacy = log.args.vaultType === VaultType.LEGACY;

                const borderColor = isPending ? "border-yellow-500/40" : (isLocked ? "border-primary/20" : "border-green-500/20");
                const textColor = isPending ? "text-yellow-500" : (isLocked ? "text-primary" : "text-green-400");
                const unlockYear = new Date(unlockTime * 1000).getFullYear();

                return (
                  <div key={`${log.transactionHash}-${i}`} className="group relative holographic-card animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`glass-panel rounded-xl p-6 relative flex flex-col justify-between h-80 border ${borderColor} transition-all duration-300 hover:border-primary/60 hover:shadow-neon hover:-translate-y-1`}>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col text-left">
                          <div className="flex justify-between items-center w-full mb-1">
                            <span className={`text-[10px] font-mono tracking-widest ${isPending ? "text-yellow-500/60" : (isLocked ? "text-primary/60" : "text-green-400/60")}`}>
                                {label} {isPending && <span className="ml-2 px-1 bg-yellow-500/20 text-yellow-500 text-[8px] animate-pulse rounded">SYNCING</span>}
                            </span>
                            {isLocked && !isPending && <CountdownTimer unlockTimestamp={unlockTime} />}
                          </div>
                          <span className={`text-3xl font-bold ${textColor} font-mono tracking-tight`}>{isPending ? "----" : unlockYear}</span>
                        </div>
                        <span className={`material-symbols-outlined ${isPending ? "text-yellow-500/40 animate-spin" : (isLocked ? "text-primary/40" : "text-green-400/40")}`}>
                          {isPending ? "sync" : (isLocked ? "lock" : "lock_open")}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col items-start justify-center my-4 overflow-hidden relative bg-black/20 rounded p-4">
                        <span className="text-[8px] text-white/20 uppercase font-mono mb-2">Payload Data:</span>
                        <p className={`text-xs text-white/50 font-mono leading-relaxed text-left break-all line-clamp-4 ${isLocked || isPending ? "blur-sm select-none" : ""}`}>
                          {isPending ? "Temporal Link Initializing..." : (isLocked ? "Encrypted Content. Protocol Active." : (secret || "No message found."))}
                        </p>
                        {file && (
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[8px] text-primary/40 uppercase font-bold">
                              <span className="material-icons text-[10px]">attachment</span>
                              <span>{file.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-white/30">
                        <span>
                          {isPending ? (
                            <a href={`https://mempool.staging.midl.xyz/tx/${log.btcTxHash}`} target="_blank" rel="noreferrer" className="text-yellow-500/80 hover:text-yellow-500 transition-colors underline underline-offset-2 uppercase font-bold text-[9px]">
                              Verify on Bitcoin
                            </a>
                          ) : (
                            `VAULT_ID: #${id?.toString()}`
                          )}
                        </span>
                        <div className="flex flex-col gap-2 items-end">
                           {isLocked && isOwner && !isPending && (
                             <div className="flex gap-2">
                               <button type="button" onClick={() => {
                                 const addr = window.prompt("Enter new owner address (EVM or BTC):");
                                 if (addr) handleTransferCapsule(id, addr);
                               }} disabled={isSigningOrPending} className="text-blue-400 hover:text-blue-300 transition-all uppercase font-bold text-[9px] active:scale-90">Tfr Owner</button>
                               <button type="button" onClick={() => {
                                 const addr = window.prompt("Enter new beneficiary address (EVM or BTC):");
                                 if (addr) handleTransferBeneficiary(id, addr);
                               }} disabled={isSigningOrPending} className="text-purple-400 hover:text-purple-300 transition-all uppercase font-bold text-[9px] active:scale-90">Set Benf</button>
                             </div>
                           )}
                           <div className="flex gap-2">
                             {isPending && (
                               <span className="text-yellow-500/40 uppercase font-bold text-[9px]">Awaiting Confirmation</span>
                             )}
                             {isLocked && isOwner && !isLegacy && !isPending && (
                               <button type="button" onClick={() => handleWithdrawEarly(id)} disabled={isSigningOrPending} className="text-red-400 hover:text-red-300 transition-all uppercase font-bold active:scale-90 hover:scale-110">Panic</button>
                             )}
                             {isLocked && isOwner && isLegacy && !isPending && (
                               <span className="text-gray-600 cursor-not-allowed uppercase font-bold" title="Legacy vaults cannot be breached prematurely">Locked</span>
                             )}
                             {(!isLocked || (isLegacy && isBeneficiary)) && (isOwner || isBeneficiary) && !isPending && (
                               <button type="button" onClick={() => handleClaim(id, isLegacy)} disabled={isSigningOrPending} className="text-green-400 hover:text-green-300 transition-all uppercase font-bold active:scale-90 hover:scale-110">Claim</button>
                             )}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button type="button"
              onClick={onNavigateBack}
              className="w-12 h-12 bg-background-dark border border-primary text-primary rounded-full flex items-center justify-center shadow-neon active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
      </div>
    </div>
  );
}
