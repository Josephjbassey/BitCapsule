"use client";

import React from "react";

export default function Screen3MessageReveal() {
  return (
    <div className="bg-background-dark font-display text-gray-300 min-h-screen flex flex-col overflow-hidden relative selection:bg-red-500 selection:text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,25,1)_0%,rgba(0,0,0,1)_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(238,43,43,0.15)_90%,rgba(238,43,43,0.3)_100%)] mix-blend-overlay"></div>
        <div className="absolute inset-0 grid-bg opacity-10"></div>
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      </div>

      <nav className="relative z-10 w-full border-b border-white/10 bg-black/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_10px_rgba(238,43,43,0.5)]">
            <span className="material-symbols-outlined text-white text-sm">hourglass_disabled</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-widest uppercase text-white leading-none">BitCapsule</span>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Secure Vault Access</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs tracking-widest font-mono text-red-500">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>SYSTEM COMPROMISED</span>
          </div>
          <div className="hidden md:block text-gray-500">
            SESSION: <span className="text-white">XJ-99-BREACH</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] p-6 gap-6 overflow-y-auto no-scrollbar">
        <div className="flex-grow flex flex-col justify-center items-center relative perspective-[2000px]">
          <div className="mb-10 text-center relative z-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase relative inline-block">
              <span className="absolute -inset-1 bg-red-500/20 blur-xl"></span>
              <span className="relative flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-4xl animate-pulse">warning</span>
                Temporal Barrier Breached
              </span>
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-red-500/80 font-mono tracking-[0.2em] text-xs uppercase">
              <span className="w-8 h-[1px] bg-red-500/50"></span>
              Message Retrieved // Protocol Overridden
              <span className="w-8 h-[1px] bg-red-500/50"></span>
            </div>
          </div>

          <div className="relative w-full max-w-4xl animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-primary/10 blur-3xl opacity-40"></div>
            <div className="relative glass-panel rounded-lg p-1 overflow-hidden transition-all duration-500 hover:scale-[1.01] border-red-500/30">
              <div className="bg-black/80 rounded border border-white/5 p-8 md:p-12 relative min-h-[450px] flex flex-col">
                <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Origin Timestamp</span>
                    <div className="text-white text-xl font-display font-medium tracking-wide">OCT 24, 2028</div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Decryption Status</span>
                    <div className="text-primary text-sm font-mono font-bold flex items-center justify-end gap-2 bg-primary/10 px-2 py-1 rounded border border-primary/20">
                      <span className="material-symbols-outlined text-sm">lock_open</span>
                      FORCED_ACCESS
                    </div>
                  </div>
                </div>

                <div className="flex-grow relative z-20">
                  <div className="font-display text-2xl md:text-3xl leading-relaxed text-gray-200 relative">
                    <span className="text-red-500 font-mono text-xs block mb-6 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-500"></span>
                      Subject: Don't forget who you were
                    </span>
                    <p className="mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      "To my future self...
                    </p>
                    <p className="mb-4">
                      If you are reading this early, something must have gone wrong. Or maybe you just got impatient. I hope the price was worth it.
                    </p>
                    <p>
                      <span className="inline-block relative group cursor-help">
                        <span className="absolute inset-0 bg-red-500/20 -skew-x-12 group-hover:bg-red-500/40 transition-colors"></span>
                        <span className="relative z-10 font-bold text-white px-1">Remember the promise</span>
                      </span>
                      we made under the neon lights of the old district. Stay wild."
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <div className="flex gap-1">
                      <span className="w-1 h-4 bg-green-500/50"></span>
                      <span className="w-1 h-4 bg-green-500/30"></span>
                    </div>
                    <span>INTEGRITY CHECK PASSED</span>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 rounded text-xs font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                      Wipe Traces
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-3 rounded text-xs font-mono font-bold uppercase tracking-wider text-primary shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden bg-primary/10 border border-primary/30">
                      Save to Local
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full md:w-80 flex flex-col gap-4 relative z-20">
          <div className="glass-panel rounded p-6 relative overflow-hidden group border-white/10">
            <h2 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="material-symbols-outlined text-sm text-red-500">analytics</span>
              Breach Analytics
            </h2>
            <div className="space-y-6 font-mono">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                  <span>Penalty Assessment</span>
                  <span className="text-red-500 animate-pulse uppercase">Confirmed</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-red-500 tracking-tighter">-0.05</span>
                  <span className="text-sm text-gray-400 mb-1">BTC</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                  <span>Container Integrity</span>
                  <span className="text-primary uppercase">Unstable</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white tracking-tight">85%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 h-full w-[85%] shadow-[0_0_10px_#22c55e]"></div>
                  <div className="bg-red-500 h-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow glass-panel rounded p-4 font-mono text-[10px] leading-relaxed overflow-hidden flex flex-col border border-white/5">
            <h3 className="text-gray-500 uppercase mb-3 border-b border-white/5 pb-2 flex justify-between tracking-widest">
              <span>System_Log.log</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </h3>
            <div className="flex-grow overflow-y-auto space-y-1.5 text-gray-400 opacity-90 no-scrollbar">
              <div className="flex gap-2"><span className="text-red-500">[ERR-0x9]</span><span className="text-gray-300">Signature verification bypassed.</span></div>
              <div className="flex gap-2"><span className="text-green-500">[SUC-200]</span><span>Decryption key generated locally.</span></div>
              <div className="flex gap-2"><span className="text-blue-400">[INF-102]</span><span>Fragment reassembly: 99.9%</span></div>
              <div className="flex gap-2"><span className="text-primary">[WRN-404]</span><span>Structural micro-fractures detected.</span></div>
              <div className="flex gap-2 border-t border-white/5 pt-1 mt-1 opacity-50"><span className="text-gray-600">_waiting for input...</span><span className="w-1.5 h-3 bg-white animate-pulse"></span></div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
