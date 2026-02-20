"use client";

import React from "react";

export default function Screen10ArchiveGallery() {
  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-screen selection:bg-primary selection:text-white flex">
      <div className="fixed inset-0 z-0 grid-bg opacity-30 pointer-events-none transform rotate-x-12 scale-125 origin-bottom"></div>

      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/10 bg-background-dark/80 backdrop-blur-xl z-30 flex flex-col justify-between relative shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5">
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse">hourglass_top</span>
            <span className="hidden md:block ml-3 font-bold tracking-widest text-lg uppercase">Archive</span>
          </div>
          <nav className="flex flex-col mt-8 gap-2">
            <a className="flex items-center px-4 md:px-6 py-4 text-white bg-white/5 border-l-2 border-primary" href="#">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide uppercase">All Shards</span>
              <span className="hidden md:block ml-auto text-xs text-white/30 font-mono">24</span>
            </a>
            <a className="flex items-center px-4 md:px-6 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-colors" href="#">
              <span className="material-symbols-outlined">lock</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide uppercase">Locked</span>
              <span className="hidden md:block ml-auto text-xs text-white/30 font-mono">18</span>
            </a>
            <a className="flex items-center px-4 md:px-6 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-colors" href="#">
              <span className="material-symbols-outlined text-bitcoin-gold">schedule_send</span>
              <span className="hidden md:block ml-4 text-sm font-mono tracking-wide uppercase">Approaching</span>
            </a>
          </nav>
        </div>
        <div className="p-4 md:p-6 border-t border-white/5">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer">
            <div className="w-8 h-8 rounded bg-surface-dark border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">settings</span>
            </div>
            <div className="hidden md:block text-[10px] font-mono uppercase">
              <div className="text-white">System Config</div>
              <div className="text-white/40">V 2.4.9</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <header className="h-20 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Temporal Archive</h1>
            <div className="hidden md:flex px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-mono text-primary items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Synced
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-white/70">search</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {/* Shard 1 */}
            <div className="group relative h-64 perspective-1000">
              <div className="glass-panel w-full h-full rounded-xl p-6 relative flex flex-col justify-between border-bitcoin-gold/30 hover:border-bitcoin-gold transition-all duration-300 animate-float cursor-pointer">
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-bitcoin-gold font-mono tracking-tight">2025</span>
                    <span className="text-[10px] font-mono text-bitcoin-gold/80 tracking-widest mt-1 uppercase">Approaching</span>
                  </div>
                  <span className="material-symbols-outlined text-bitcoin-gold/60">timer</span>
                </div>
                <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative border-y border-white/5 bg-black/20 rounded">
                  <p className="text-xs text-white/50 font-mono leading-relaxed blur-[2px] p-4 uppercase">
                    The decentralized revolution begins today. Hold the keys tight...
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 z-10">
                  <span>ID: #8A29F</span>
                </div>
              </div>
            </div>

            {/* Shard 2 */}
            <div className="group relative h-64 perspective-1000">
              <div className="glass-panel w-full h-full rounded-xl p-6 relative flex flex-col justify-between border-primary/30 hover:border-primary transition-all duration-300 animate-float delay-150 cursor-pointer">
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-primary font-mono tracking-tight">2030</span>
                    <span className="text-[10px] font-mono text-primary/80 tracking-widest mt-1 uppercase">Locked</span>
                  </div>
                  <span className="material-symbols-outlined text-primary/60">lock</span>
                </div>
                <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative border-y border-white/5 bg-black/20 rounded">
                  <p className="text-xs text-white/50 font-mono leading-relaxed blur-[2px] p-4 uppercase">
                    To my future self, remember the first line of code...
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 z-10 uppercase">
                  <span>ID: #9C11B</span>
                </div>
              </div>
            </div>

            {/* Shard 3 */}
            <div className="group relative h-64 perspective-1000">
              <div className="glass-panel w-full h-full rounded-xl p-6 relative flex flex-col justify-between border-green-500/30 hover:border-green-500 transition-all duration-300 animate-float delay-300 cursor-pointer">
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-white font-mono tracking-tight">2023</span>
                    <span className="text-[10px] font-mono text-green-400 tracking-widest mt-1 uppercase">Unlocked</span>
                  </div>
                  <span className="material-symbols-outlined text-green-400">lock_open</span>
                </div>
                <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative border-y border-white/5 bg-black/20 rounded">
                  <p className="text-xs text-white/80 font-mono leading-relaxed p-4 uppercase">
                    Remember to buy the dip. The AI singularity is closer than we think.
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 z-10 uppercase">
                  <span>ID: #1A00Z</span>
                  <span className="text-[10px] border border-green-500/30 text-green-400 px-2 py-0.5 rounded">Accessible</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-40">
            <button className="relative w-14 h-14 bg-surface-dark border border-primary text-primary rounded-full flex items-center justify-center shadow-neon hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
