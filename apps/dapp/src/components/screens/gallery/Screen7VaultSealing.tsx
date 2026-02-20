"use client";

import React from "react";

export default function Screen7VaultSealing() {
  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-screen selection:bg-primary selection:text-white flex flex-col relative">
      <div className="fixed inset-0 z-0 grid-bg opacity-40 pointer-events-none transform rotate-x-12 scale-110 origin-bottom"></div>

      {/* HUD Elements */}
      <div className="fixed inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-primary/50 bg-primary/10 flex items-center justify-center rounded animate-pulse">
              <span className="material-icons text-primary text-xl">lock_clock</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-white uppercase glow-text">BitCapsule</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs text-primary font-mono tracking-widest uppercase">Encryption Active</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-primary/70 font-mono uppercase">Process: Sealing_Sequence</div>
            <div className="text-xs text-primary/70 font-mono animate-pulse uppercase">CPU Load: 98%</div>
            <div className="text-xs text-bitcoin-gold/70 font-mono mt-1 uppercase">Hashing Blocks...</div>
          </div>
        </div>
      </div>

      <main className="relative z-20 flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-8 md:gap-10 overflow-y-auto no-scrollbar">
        {/* Central Orb */}
        <div className="relative scale-110 transition-transform duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-bitcoin-gold/30 rounded-full blur-3xl transform scale-150 animate-pulse"></div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-primary/60 bg-background-dark/90 backdrop-blur-md flex items-center justify-center shadow-neon-intense">
            <div className="absolute inset-1 border-2 border-dashed border-primary/60 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-6 border border-primary/40 rounded-full animate-spin-reverse"></div>

            <div className="w-32 h-32 rounded-full bg-black border-4 border-primary/50 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-[8px] font-mono text-primary/80 leading-tight opacity-60 uppercase">
                <span>0x4F3A</span>
                <span>0x9B2C</span>
                <span>0xA7F0</span>
              </div>
              <span className="material-icons text-primary text-5xl drop-shadow-[0_0_10px_rgba(242,185,13,0.8)] z-10">lock</span>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] z-30">
            <div className="bg-black/80 backdrop-blur border border-primary p-4 rounded-lg text-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <div className="text-primary font-bold font-mono text-xl tracking-widest mb-2 animate-pulse uppercase">Encrypting</div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-bitcoin-gold to-primary w-[75%] animate-pulse"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-primary mt-1 uppercase">
                <span>Block 492,001</span>
                <span>75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="glass-panel rounded-lg p-1 relative overflow-hidden border-primary/30">
            <div className="h-6 bg-primary/10 border-b border-primary/20 flex items-center px-3 justify-between">
              <span className="text-[10px] text-primary font-mono animate-pulse uppercase">System_Log :: Live</span>
            </div>
            <div className="relative h-32 bg-black/50 p-4 font-mono text-xs md:text-sm overflow-hidden flex flex-col justify-end">
              <div className="flex flex-col gap-1 text-primary/80">
                <div className="opacity-40 uppercase">&gt;&gt; Initiating Sealing Protocol... [OK]</div>
                <div className="opacity-60 uppercase">&gt;&gt; Generating Quantum Keys... [OK]</div>
                <div className="opacity-80 uppercase">&gt;&gt; Establishing Temporal Anchor... [SECURED]</div>
                <div className="text-white flex items-center gap-2 uppercase">
                  <span>&gt;&gt; Write_To_Blockchain</span>
                  <span className="inline-block w-2 h-4 bg-white animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="glass-panel p-5 rounded-lg border-l-4 border-l-primary/50 flex flex-col gap-4 relative overflow-hidden bg-black/20">
              <div className="flex justify-between items-end">
                <label className="text-xs text-primary/60 font-mono tracking-widest uppercase">Target Year</label>
                <span className="text-3xl font-bold text-white font-mono tracking-tight">2035<span className="text-xs text-primary/50 ml-1 lowercase">.locked</span></span>
              </div>
              <div className="relative w-full h-1 bg-gray-800 rounded">
                <div className="absolute top-1/2 left-[40%] w-3 h-6 bg-primary rounded shadow-neon -translate-y-1/2"></div>
              </div>
            </div>
            <div className="relative bg-black border border-primary rounded-lg p-4 flex flex-col items-center justify-center h-24 overflow-hidden group shadow-neon">
               <div className="absolute inset-0 mechanical-load opacity-10 group-hover:opacity-20 transition-opacity"></div>
               <span className="text-2xl font-bold text-white tracking-widest uppercase z-10">Lock Engaged</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-4 flex justify-center pointer-events-none z-10">
        <div className="flex gap-8 opacity-50">
          <div className="h-1 w-16 bg-primary animate-pulse"></div>
          <div className="h-1 w-16 bg-bitcoin-gold animate-pulse delay-200"></div>
          <div className="h-1 w-16 bg-primary animate-pulse delay-400"></div>
        </div>
      </footer>
    </div>
  );
}
