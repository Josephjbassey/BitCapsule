"use client";

import React from "react";

export default function Screen5LegacyTransmission() {
  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 grid-bg opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/95 via-transparent to-background-dark/95 pointer-events-none z-0"></div>
      <div className="scanline"></div>

      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-surface-dark/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/50 animate-pulse">
            <span className="material-icons text-primary text-sm">hub</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text text-white uppercase">BitCapsule</h1>
            <span className="text-[10px] text-primary/80 tracking-[0.2em] uppercase font-mono">Legacy Protocol</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
          <div className="hidden md:flex flex-col items-end font-mono">
            <span className="text-primary/70 uppercase">Connection</span>
            <span className="text-green-400 font-bold uppercase">Secure-Link</span>
          </div>
          <div className="flex flex-col items-end font-mono">
            <span className="text-primary/70 uppercase">Mode</span>
            <span className="text-primary font-bold animate-pulse uppercase">Legacy</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full overflow-y-auto no-scrollbar">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute w-[80%] h-[80%] border border-primary/30 rounded-full animate-[spin_40s_linear_infinite] opacity-60"></div>
            <div className="absolute w-[70%] h-[70%] border-2 border-primary/10 border-t-primary/60 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-16 rounded-full border border-primary/30 bg-surface-dark/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.15)_0%,transparent_70%)] opacity-40"></div>
            </div>
            <div className="absolute w-28 h-28 bg-surface-dark rounded-full border-4 border-primary shadow-gold-glow flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-500">
              <span className="material-icons text-5xl text-primary drop-shadow-[0_0_15px_rgba(242,185,13,0.8)]">connect_without_contact</span>
            </div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-xs tracking-[0.3em] uppercase animate-pulse">Link Established</p>
            <h2 className="text-2xl font-bold text-white tracking-wide glow-text uppercase">Dual-Orbital Sync</h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-lg relative">
          <div className="bg-surface-dark/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <div className="p-6 md:p-8 space-y-6 grid-bg bg-[length:60px_60px]">
              <div className="space-y-2">
                <label className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                  <span>Recipient Neural ID</span>
                  <span className="material-icons text-xs animate-pulse">sensors</span>
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-background-dark border border-primary/40 rounded-lg py-3 px-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30"
                    placeholder="Enter Neural Email or Wallet Address..."
                    type="text"
                  />
                  <div className="absolute right-3 top-3 text-primary/40">
                    <span className="material-icons text-sm">alternate_email</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                  <span>Legacy Transmission</span>
                  <span className="animate-pulse">_Recording</span>
                </label>
                <div className="relative group">
                  <textarea
                    className="w-full h-32 bg-background-dark border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                    placeholder="Write to your future self..."
                  ></textarea>
                  <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(242,185,13,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs tracking-wider text-primary/80 uppercase font-semibold">Unlock Horizon</label>
                  <span className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">2045 <span className="text-xs text-gray-400 font-normal">A.D.</span></span>
                </div>
                <div className="relative h-8 flex items-center select-none pt-2">
                  <div className="absolute w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 w-1/2"></div>
                  </div>
                  <div className="absolute left-1/2 w-6 h-6 bg-background-dark border-2 border-primary rounded-full shadow-neon z-10"></div>
                </div>
              </div>

              <div className="pt-2">
                <button className="relative w-full group overflow-hidden rounded-lg bg-surface-dark border border-primary hover:border-primary transition-all duration-300 shadow-neon">
                  <div className="absolute inset-0 circuit-pattern opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative flex items-center justify-between px-6 py-5">
                    <div className="flex flex-col items-start z-10">
                      <span className="text-xs text-primary/80 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Finalize Sequence</span>
                      <span className="text-lg font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(242,185,13,0.8)] transition-all uppercase">Initiate Legacy</span>
                    </div>
                    <div className="w-10 h-10 rounded border border-primary/50 bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(242,185,13,0.3)] group-hover:bg-primary group-hover:text-black transition-all duration-300 z-10">
                      <span className="material-icons text-xl">fingerprint</span>
                    </div>
                  </div>
                </button>
                <div className="text-center mt-3 flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-mono">HASH: 0x8F...3A2</span>
                  <span className="text-[10px] text-primary/70 tracking-widest uppercase flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Network Stable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
