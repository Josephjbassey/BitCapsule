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
}

export default function VaultArchive({
  history,
  currentTime,
  handleWithdrawEarly,
  handleClaim,
  address,
  isSigningOrPending,
  onNavigateBack,
}: VaultArchiveProps) {
  const [filter, setFilter] = useState<'ALL' | 'LOCKED' | 'UNLOCKED'>('ALL');

  const filteredHistory = history.filter(log => {
    const unlockTime = Number(log.args.unlockTime);
    const isLocked = currentTime < unlockTime;
    if (filter === 'LOCKED') return isLocked;
    if (filter === 'UNLOCKED') return !isLocked;
    return true;
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-background-dark text-white font-display">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/10 bg-background-dark/80 backdrop-blur-xl z-30 flex flex-col justify-between relative shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5 cursor-pointer" onClick={onNavigateBack}>
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse-fast">hourglass_top</span>
            <span className="hidden md:block ml-3 font-bold tracking-widest text-lg uppercase">Archive</span>
          </div>
          <nav className="flex flex-col mt-8 gap-2">
            <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`sidebar-item group flex items-center w-full px-4 md:px-6 py-4 text-left transition-colors ${filter === 'ALL' ? 'active text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">grid_view</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide">ALL SHARDS</span>
              <span className="hidden md:block ml-auto text-xs text-white/30 font-mono">{history.length}</span>
            </button>
            <div className="h-px bg-white/5 mx-4 my-2"></div>
            <button
                type="button"
                onClick={() => setFilter('LOCKED')}
                className={`sidebar-item group flex items-center w-full px-4 md:px-6 py-4 text-left transition-colors ${filter === 'LOCKED' ? 'active text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">lock</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide">LOCKED</span>
            </button>
            <button
                type="button"
                onClick={() => setFilter('UNLOCKED')}
                className={`sidebar-item group flex items-center w-full px-4 md:px-6 py-4 text-left transition-colors ${filter === 'UNLOCKED' ? 'active text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">lock_open</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide">UNLOCKED</span>
            </button>
          </nav>
        </div>
        <div className="p-4 md:p-6 border-t border-white/5">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">settings</span>
            </div>
            <div className="hidden md:block text-xs font-mono">
              <div className="text-white">SYSTEM CONFIG</div>
              <div className="text-white/40">V 2.4.9</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-background-dark">
        <header className="h-20 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">TEMPORAL ARCHIVE</h1>
            <div className="hidden md:flex px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-mono text-primary items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              SYNCED
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-mono text-white/40">
              <span className="hover:text-primary cursor-pointer transition-colors">SORT: CHRONOLOGICAL</span>
              <span>|</span>
              <span className="hover:text-primary cursor-pointer transition-colors">VIEW: GRID</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-white/70">search</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
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

              // Card Styles
              const isGold = isLegacy;
              const borderColor = isGold ? "border-bitcoin-gold/30" : (isLocked ? "border-primary/30" : "border-green-500/30");
              const glowShadow = isGold ? "shadow-gold-glow" : (isLocked ? "shadow-neon" : "shadow-neon-sm");
              const textColor = isGold ? "text-bitcoin-gold" : (isLocked ? "text-primary" : "text-green-400");
              const bgClass = isGold ? "bg-black/40" : "bg-shard-gradient";

              return (
                <div key={`${log.transactionHash}-${i}`} className="group relative shard-wrapper h-72 perspective-1000">
                  <div className={`glass-shard w-full h-full rounded-xl p-6 relative flex flex-col justify-between ${bgClass} animate-float cursor-pointer hover:border-opacity-100 border border-transparent ${borderColor} transition-all duration-300`}>
                    <div className="hologram-scan opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex justify-between items-start z-10">
                      <div className="flex flex-col">
                        <span className={`text-4xl font-bold ${textColor} font-mono tracking-tight drop-shadow-lg`}>{unlockYear}</span>
                        <span className={`text-[10px] font-mono tracking-widest mt-1 ${
                            isGold ? "text-bitcoin-gold/80" : (isLocked ? "text-primary/80" : "text-green-400/80")
                        }`}>
                            {isLocked ? "LOCKED" : "UNLOCKED"}
                        </span>
                      </div>
                      <span className={`material-symbols-outlined ${
                          isGold ? "text-bitcoin-gold/60" : (isLocked ? "text-primary/60" : "text-green-400/60")
                      }`}>
                        {isLocked ? "lock" : "lock_open"}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative border-y border-white/5 bg-black/20 rounded">
                      <p className={`text-xs text-white/50 font-mono leading-relaxed select-none p-4 ${isLocked ? "message-blur" : ""}`}>
                        {isLocked ? "Encrypted Content. Time-lock active." : (log.args.message || "Content Decrypted. Ready for access.")}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono text-white/40 z-10">
                      <span>ID: #{id?.toString()}</span>
                      <div className="flex gap-1">
                        <span className={`w-1 h-1 ${isLocked ? "bg-primary" : "bg-green-500"} rounded-full`}></span>
                        <span className={`w-1 h-1 ${isLocked ? "bg-primary/50" : "bg-green-500/50"} rounded-full`}></span>
                        <span className={`w-1 h-1 ${isLocked ? "bg-primary/20" : "bg-green-500/20"} rounded-full`}></span>
                      </div>
                    </div>
                  </div>

                  {/* Detail Pane / Action Menu */}
                  <div className="detail-pane-trigger absolute top-0 right-[-340px] w-80 h-full bg-background-dark/95 border border-primary/30 backdrop-blur-xl shadow-neon z-50 rounded-r-xl opacity-0 pointer-events-none transition-all duration-300 ease-out flex flex-col group-hover:right-[-20px] group-hover:opacity-100 group-hover:pointer-events-auto transform translate-x-4 group-hover:translate-x-0">
                    <div className={`h-1 w-full ${isLocked ? "bg-primary" : "bg-green-500"} shadow-[0_0_10px_currentColor]`}></div>
                    <div className="p-5 flex flex-col h-full justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Vault #{id?.toString()}</h3>
                        <p className="text-xs text-white/50 font-mono mb-4">Type: {VaultType[log.args.vaultType]}</p>

                        <div className="bg-black/40 border border-white/10 rounded p-3 mb-4">
                          <div className="text-[10px] uppercase tracking-widest text-primary/80 mb-1">Time Remaining</div>
                          <div className="text-xl font-mono text-white font-bold">
                            {isLocked ? `${days} DAYS` : "UNLOCKED"}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-white/60 font-mono">
                            <span>Beneficiary:</span>
                            <span className="text-blue-400">{log.args.beneficiary?.slice(0, 6)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {isLocked && isOwner && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleWithdrawEarly(id); }}
                                disabled={isSigningOrPending}
                                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-500 text-xs font-bold tracking-widest uppercase transition-colors"
                            >
                                {isSigningOrPending ? "Processing..." : "Panic Withdraw (Penalty)"}
                            </button>
                        )}

                        {(!isLocked || (isLegacy && isBeneficiary)) && (isOwner || isBeneficiary) && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleClaim(id, isLegacy); }}
                                disabled={isSigningOrPending}
                                className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-500 text-xs font-bold tracking-widest uppercase transition-colors"
                            >
                                {isSigningOrPending ? "Processing..." : "Claim Content"}
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-40 group">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <button
                type="button"
                onClick={onNavigateBack}
                className="relative w-14 h-14 bg-background-dark border border-primary text-primary rounded-full flex items-center justify-center shadow-neon hover:scale-110 transition-transform duration-300"
            >
            <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
      </main>
    </div>
  );
}
