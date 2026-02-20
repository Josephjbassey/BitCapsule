"use client";

import React from "react";

export default function Screen6PastMessage() {
  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-screen selection:bg-primary selection:text-black flex flex-col items-center justify-center relative">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(242,185,13,0.05)_0%,transparent_80%)]"></div>

      {/* Circuit lines & Embers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/3 left-0 w-full h-px bg-primary/20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-primary/10 animate-pulse delay-700"></div>
      </div>

      <div className="fixed inset-0 z-50 terminal-scanline opacity-10 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center gap-8 p-6 overflow-y-auto no-scrollbar">
        {/* Left Side: Stats (Desktop only) */}
        <div className="hidden md:flex flex-col gap-6 w-64 items-end text-right animate-float">
          <div className="relative glass-panel p-4 rounded-lg border-r-2 border-primary/50 w-full">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Sealed On</div>
            <div className="text-xl font-mono text-primary font-bold tracking-wider uppercase">10.24.2024</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">20:45:12 UTC</div>
          </div>
          <div className="relative glass-panel p-4 rounded-lg border-r-2 border-white/20 w-full">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Journey</div>
            <div className="text-xl font-mono text-white font-bold tracking-wider uppercase">3650 Days</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Temporal Distance</div>
          </div>
          <div className="relative glass-panel p-4 rounded-lg border-r-2 border-white/20 w-full">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Data Size</div>
            <div className="text-sm font-mono text-white tracking-wider uppercase">4.2 MB</div>
          </div>
        </div>

        {/* Center: Message Card */}
        <div className="relative w-full max-w-2xl flex flex-col animate-float delay-75">
          <div className="flex items-end justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary animate-pulse text-2xl">wifi_tethering</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-widest uppercase">Signal From 2024</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              Connection Stable
            </div>
          </div>

          <div className="relative glass-panel rounded-xl p-1 shadow-neon overflow-hidden border-primary/20">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-xl"></div>

            <div className="bg-black/40 rounded-lg p-8 md:p-12 min-h-[400px] relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-white/10 select-none pointer-events-none text-right uppercase">
                0x1F4A...B2C9<br/>
                BLOCK #865,210<br/>
                MSG_ID_9921
              </div>
              <div className="font-mono text-gray-200 leading-relaxed text-lg md:text-xl space-y-6 relative z-10">
                <p className="animate-pulse-slow">Hey future self,</p>
                <p>If you're reading this, it means we made it. Ten years have passed since I sat in that small apartment, wondering where life would take us.</p>
                <p>I hope you still have that fire in your belly. I hope you learned to play the guitar like we promised. Did Bitcoin hit 100k yet? Don't laugh.</p>
                <p>Remember: happiness isn't a destination, it's a method of life. Don't forget where you came from.</p>
                <p className="text-primary/80">- You, from Oct 24, 2024</p>
              </div>
              <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg transition-all duration-300 border border-primary/40 hover:border-primary">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative flex items-center gap-3 font-display font-bold tracking-widest text-primary group-hover:text-white transition-colors uppercase">
                <span className="material-symbols-outlined text-xl">download</span>
                Download Data Shard
                <span className="text-[10px] ml-1 opacity-60">4.2MB</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full p-4 flex justify-between items-center text-[10px] font-mono text-white/20 pointer-events-none z-20 uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Sys_Ready</span>
          <span>Mem_Ok</span>
        </div>
        <div>BitCapsule v2.0</div>
      </div>
    </div>
  );
}
