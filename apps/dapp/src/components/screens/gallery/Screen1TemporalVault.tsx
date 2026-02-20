"use client";

import React from "react";

export default function Screen1TemporalVault() {
  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0 grid-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0"></div>
      <div className="scanline"></div>

      {/* Top HUD Interface */}
      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-surface-dark/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse">
            <span className="material-icons text-primary text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">BitCapsule</h1>
            <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">Secure Channel V.2.0</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-primary/70">ENCRYPTION</span>
            <span className="text-green-400 font-bold uppercase">Bitcoin-Secure</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-primary/70">STATUS</span>
            <span className="text-primary font-bold animate-pulse">LIVE</span>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full overflow-y-auto no-scrollbar">
        {/* Left Panel: The Lock Mechanism */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-reverse"></div>
            {/* Middle Ring with Data */}
            <div className="absolute inset-12 rounded-full border border-primary/30 bg-surface-dark/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.15)_0%,transparent_70%)] opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            {/* Core Lock */}
            <div className="absolute w-32 h-32 bg-surface-dark rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10">
              <span className="material-icons text-6xl text-primary drop-shadow-[0_0_15px_rgba(242,185,13,1)] gold-glow">lock</span>
            </div>
            {/* Floating Particles/Embers */}
            <div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce"></div>
            <div className="absolute top-20 -left-12 w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse"></div>
            <div className="absolute bottom-10 right-0 w-1.5 h-1.5 bg-bitcoin-gold rounded-full blur-[1px] animate-pulse"></div>
            {/* Holographic projection lines */}
            <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform -rotate-45"></div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-xs tracking-[0.3em] uppercase">System Armed</p>
            <h2 className="text-2xl font-bold text-white tracking-wide glow-text uppercase">Temporal Vault</h2>
          </div>
        </div>

        {/* Right Panel: Data Terminal */}
        <div className="w-full md:w-1/2 max-w-lg relative">
          <div className="bg-surface-dark/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
            <div className="p-6 md:p-8 space-y-8 grid-bg bg-[length:10px_10px]">
              {/* Text Input Area */}
              <div className="space-y-3">
                <label className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                  <span>Input Stream</span>
                  <span className="animate-pulse">_Ready</span>
                </label>
                <div className="relative group">
                  <textarea
                    className="w-full h-40 bg-background-dark border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                    placeholder="Initializing encryption... Write to your future self..."
                  ></textarea>
                  <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(242,185,13,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Temporal Slider (Simulated) */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs tracking-wider text-primary/80 uppercase font-semibold">Temporal Coordinates</label>
                  <span className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">2029 <span className="text-xs text-gray-400 font-normal">A.D.</span></span>
                </div>
                <div className="relative h-12 flex items-center select-none">
                  {/* Track */}
                  <div className="absolute w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 w-1/3"></div>
                  </div>
                  {/* Ticks */}
                  <div className="absolute w-full flex justify-between px-1 pointer-events-none">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-2 w-[1px] bg-gray-600"></div>)}
                  </div>
                  {/* Thumb/Knob */}
                  <div className="absolute left-1/3 w-6 h-6 bg-background-dark border-2 border-primary rounded-full shadow-neon cursor-pointer hover:scale-110 transition-transform z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                  <span>1 YR</span>
                  <span>5 YRS</span>
                  <span>10 YRS</span>
                  <span className="text-primary/70">50 YRS</span>
                  <span>2100</span>
                </div>
              </div>

              {/* Seal Button */}
              <div className="pt-4">
                <button className="relative w-full group overflow-hidden rounded-lg bg-surface-dark border border-bitcoin-gold/30 hover:border-bitcoin-gold/80 transition-all duration-300">
                  <div className="absolute inset-0 mechanical-load opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-between px-6 py-5">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-bitcoin-gold/80 uppercase tracking-widest mb-1 group-hover:text-bitcoin-gold transition-colors">Confirm Protocol</span>
                      <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all">SEAL VIBE</span>
                    </div>
                    <div className="w-12 h-12 rounded-lg border border-bitcoin-gold/50 bg-bitcoin-gold/10 flex items-center justify-center shadow-gold-glow group-hover:bg-bitcoin-gold group-hover:text-black transition-all duration-300">
                      <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bitcoin-gold/50"></div>
                </button>
                <div className="text-center mt-3">
                  <span className="text-[10px] text-red-400/70 tracking-widest uppercase flex items-center justify-center gap-1">
                    <span className="material-icons text-[10px]">warning</span>
                    Irreversible Action
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer HUD */}
      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono tracking-wider">Privacy Protocol v2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase font-mono tracking-wider">Terms of Engagement</span>
        </div>
        <div className="mt-2 md:mt-0 font-mono">
          ID: <span className="text-primary/60">XJ-9200-ALPHA</span> // NODE: <span className="text-green-500/60">VERIFIED</span>
        </div>
      </footer>
    </div>
  );
}
