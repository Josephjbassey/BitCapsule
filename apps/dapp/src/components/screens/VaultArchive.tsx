"use client";

import React, { useState } from "react";
import { isAddressEqual } from "viem";
import { VaultType } from "./VaultCreation";

interface VaultArchiveProps {
  history: any[];
  currentTime: number;
  handleWithdrawEarly: (id: bigint) => void;
  handleClaim: (id: bigint, legacy: boolean) => void;
  address: string | undefined;
  isSigningOrPending: boolean;
  onNavigateBack: () => void;
  onRefresh?: () => void;
}

export default function VaultArchive({
  history,
  currentTime,
  handleWithdrawEarly,
  handleClaim,
  address,
  isSigningOrPending,
  onNavigateBack,
  onRefresh,
}: VaultArchiveProps) {
  const [filter, setFilter] = useState<'ALL' | 'LOCKED' | 'UNLOCKED'>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredHistory = history.filter(log => {
    const unlockTime = Number(log.args.unlockTime);
    const isLocked = currentTime < unlockTime;
    if (filter === 'LOCKED') return isLocked;
    if (filter === 'UNLOCKED') return !isLocked;
    return true;
  });

  return (
    <div className="flex h-full w-full bg-background-dark text-white font-display overflow-hidden relative">
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
                <button
                  key={item.id}
                  type="button"
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
              <div className="text-[10px] font-mono">
                <div className="text-white">SYS_CONFIG</div>

              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-primary p-1"
            >
              <span className="material-icons">filter_list</span>
            </button>
            <h1 className="text-lg md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 uppercase">Temporal Archive</h1>
          </div>
          <div className="flex items-center gap-3">
             {onRefresh && (
               <button
                 onClick={onRefresh}
                 className="p-2 text-primary/60 hover:text-primary transition-colors flex items-center gap-2 group"
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
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6 opacity-20">
                <span className="material-icons text-6xl">cloud_off</span>
              </div>
              <h3 className="text-xl font-bold text-white/40 tracking-widest uppercase">No Records Found</h3>
              <p className="text-xs text-white/20 font-mono mt-2">Initialize your first vault to begin archiving.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-24">
              {filteredHistory.map((log, i) => {
                const id = log.args.id;
                const unlockTime = Number(log.args.unlockTime);
                const isLocked = currentTime < unlockTime;
                const timeLeft = unlockTime - currentTime;
                const days = Math.floor(timeLeft / (24 * 60 * 60));
                const unlockYear = new Date(unlockTime * 1000).getFullYear();

                const isOwner = address && log.args.owner && isAddressEqual(address as `0x${string}`, log.args.owner as `0x${string}`);
                const isBeneficiary = address && log.args.beneficiary && isAddressEqual(address as `0x${string}`, log.args.beneficiary as `0x${string}`);
                const isLegacy = log.args.vaultType === VaultType.LEGACY;

                const isGold = isLegacy;
                const borderColor = isLocked ? "border-primary/20" : "border-green-500/20";
                const textColor = isLocked ? "text-primary" : "text-green-400";

                return (
                  <div key={`${log.transactionHash}-${i}`} className="group relative holographic-card">
                    <div className={`glass-panel rounded-xl p-6 relative flex flex-col justify-between h-72 border ${borderColor} transition-all duration-300 hover:border-primary/60`}>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className={`text-4xl font-bold ${textColor} font-mono tracking-tight`}>{unlockYear}</span>
                          <span className={`text-[9px] font-mono tracking-widest mt-1 ${isLocked ? "text-primary/60" : "text-green-400/60"}`}>
                              {isLocked ? "LOCKED" : "UNLOCKED"}
                          </span>
                        </div>
                        <span className={`material-symbols-outlined ${isLocked ? "text-primary/40" : "text-green-400/40"}`}>
                          {isLocked ? "lock" : "lock_open"}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative bg-black/20 rounded p-4">
                        <p className={`text-xs text-white/50 font-mono leading-relaxed ${isLocked ? "blur-sm select-none" : ""}`}>
                          {isLocked ? "Encrypted Content. Protocol Active." : (log.args.message || "No message found.")}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-white/30">
                        <span>VAULT_ID: #{id?.toString()}</span>
                        <div className="flex gap-2">
                           {isLocked && isOwner && (
                             <button onClick={() => handleWithdrawEarly(id)} disabled={isSigningOrPending} className="text-red-400 hover:text-red-300 transition-all uppercase font-bold active:scale-95">Panic</button>
                           )}
                           {(!isLocked || (isLegacy && isBeneficiary)) && (isOwner || isBeneficiary) && (
                             <button onClick={() => handleClaim(id, isLegacy)} disabled={isSigningOrPending} className="text-green-400 hover:text-green-300 transition-all uppercase font-bold active:scale-95">Claim</button>
                           )}
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
          <button
              onClick={onNavigateBack}
              className="w-12 h-12 bg-background-dark border border-primary text-primary rounded-full flex items-center justify-center shadow-neon active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
      </div>
    </div>
  );
}
