"use client";

import React from "react";

export default function Screen4TemporalLock() {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen overflow-x-hidden relative selection:bg-red-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-bg bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-transparent to-background-dark"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,51,51,0.1)_0%,transparent_80%)] opacity-60"></div>
      </div>

      <div className="relative flex h-auto min-h-screen w-full flex-col z-10">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <h2 className="text-white/90 text-xl font-bold tracking-tight uppercase">BitCapsule</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono text-red-500 font-bold tracking-widest uppercase">System Lock</span>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-6 py-12 max-w-[900px] mx-auto w-full flex-1 relative z-20">
          <div className="glass-panel rounded-3xl p-8 md:p-12 w-full flex flex-col items-center relative overflow-hidden border-red-500/20">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500 rounded-br-lg"></div>

            <div className="relative mb-8 flex justify-center items-center">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-[80px]"></div>
              <div className="relative bg-background-dark/80 border border-red-500/50 rounded-full p-10 shadow-[0_0_50px_rgba(255,51,51,0.2)]">
                <span className="material-symbols-outlined text-red-500 text-[100px] drop-shadow-[0_0_15px_rgba(255,51,51,0.8)]">
                  shield_with_heart
                </span>
                <div className="absolute inset-0 rounded-full border border-dashed border-red-500/40 animate-[spin_10s_linear_infinite]"></div>
              </div>
            </div>

            <div className="text-center space-y-2 mb-10 max-w-2xl">
              <h1 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase">
                CRITICAL: TEMPORAL LOCK ACTIVE
              </h1>
              <p className="text-red-500/80 font-mono text-sm uppercase tracking-[0.2em]">Security Protocol 99-Delta Engaged</p>
            </div>

            <div className="w-full bg-black/40 border-l-4 border-red-500 rounded-r-lg p-6 mb-10 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent pointer-events-none"></div>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <span className="material-symbols-outlined text-red-500 text-4xl animate-pulse">warning</span>
                <div className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Premature Access Warning</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    Attempting to breach this capsule before its destination date will incur a
                    <span className="text-red-500 font-bold"> 0.05 BTC quantum instability penalty </span>
                    and may lead to permanent data corruption across the timeline.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-stretch">
              <div className="md:col-span-4 flex flex-col justify-center items-center bg-white/5 rounded-xl border border-white/10 p-6 relative overflow-hidden group">
                <div className="relative size-24 border border-white/20 rounded-xl flex items-center justify-center bg-black/50 overflow-hidden mb-3">
                  <span className="material-symbols-outlined text-white/20 text-5xl group-hover:text-red-500 transition-colors duration-300">
                    fingerprint
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xs tracking-widest uppercase">Admin Override</p>
                  <p className="text-white/30 text-[10px] uppercase mt-1">Biometric Scan Required</p>
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col gap-4 justify-center">
                <button className="bg-gradient-to-r from-primary to-orange-500 text-white font-black text-xl py-6 rounded-xl w-full flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden uppercase tracking-widest shadow-neon">
                  <span className="relative z-10 flex items-center gap-3">
                    Cancel Breach Sequence
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </span>
                </button>
                <button className="bg-white/5 border border-white/20 text-white/50 text-xs md:text-sm font-semibold py-4 rounded-xl w-full flex items-center justify-center gap-2 transition-all duration-300 hover:border-red-500/50 hover:text-red-500 uppercase tracking-wider">
                  Proceed at your own risk
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center border-t border-white/5 bg-background-dark/90 backdrop-blur-sm relative z-20">
          <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] text-white/30 uppercase font-mono tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Network: Secure
            </span>
            <span>ID: TV-4491-Ω</span>
            <span>Encryption: Quantum-256</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
