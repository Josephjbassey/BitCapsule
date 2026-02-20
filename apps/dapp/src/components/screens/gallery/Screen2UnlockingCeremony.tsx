"use client";

import React from "react";

export default function Screen2UnlockingCeremony() {
  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-screen selection:bg-success selection:text-black flex flex-col items-center justify-center relative">
      <div className="fixed inset-0 z-0 grid-bg opacity-20 pointer-events-none transform rotate-x-12 scale-125 origin-center"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.15)_0%,transparent_70%)] opacity-40 pointer-events-none animate-pulse-fast"></div>

      {/* Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-bitcoin-gold rounded-full blur-[1px] animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}
      </div>

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute top-10 left-0 w-full flex justify-center z-20">
          <div className="flex items-center gap-3 bg-black/40 border border-green-500/30 px-6 py-2 rounded-full backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-mono text-green-500 text-xs tracking-[0.2em] font-bold">SEQUENCE INITIATED</span>
          </div>
        </div>

        {/* System Logs on the left (Hidden on mobile) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 h-96 hidden lg:flex flex-col gap-2 font-mono text-xs z-20 pointer-events-none">
          <div className="text-green-500/50 text-[10px] uppercase border-b border-green-500/20 pb-1 mb-2">System Log</div>
          <div className="relative h-full overflow-hidden mask-gradient-b">
            <div className="absolute bottom-0 left-0 w-full flex flex-col gap-1 justify-end">
              <div className="flex gap-2 text-white/40"><span className="text-green-500/60">[SYS]</span> ACCESS REQUESTED</div>
              <div className="flex gap-2 text-white/40"><span className="text-green-500/60">[NET]</span> PING 12ms</div>
              <div className="flex gap-2 text-white/60"><span className="text-green-500/80">[SEC]</span> BIO-AUTH PASSED</div>
              <div className="flex gap-2 text-white/60"><span className="text-green-500/80">[CRYPTO]</span> KEY FOUND</div>
              <div className="flex gap-2 text-primary/80"><span className="text-green-500">[PROC]</span> DECRYPTING NEURAL LINK...</div>
              <div className="flex gap-2 text-white/80"><span className="text-green-500">[TIME]</span> SYNCING CHRONOMETER</div>
              <div className="flex gap-2 text-green-500 font-bold animate-pulse"><span className="text-white">&gt;&gt;&gt;</span> BARRIER DISSOLVING...</div>
            </div>
          </div>
        </div>

        {/* Central Lock Graphic */}
        <div className="relative flex items-center justify-center scale-75 md:scale-100 lg:scale-110 mb-12">
          <div className="w-[400px] h-[400px] rounded-full border border-white/10 relative flex items-center justify-center animate-spin-slow">
            <div className="absolute inset-0 border-t-2 border-b-2 border-primary/30 rounded-full"></div>
          </div>
          <div className="absolute w-[320px] h-[320px] rounded-full border border-white/5 flex items-center justify-center animate-spin-reverse">
            <div className="absolute inset-0 border-l-4 border-r-4 border-dashed border-green-500/20 rounded-full"></div>
          </div>
          <div className="absolute w-[240px] h-[240px] rounded-full bg-[#111] border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden z-10">
            <div className="absolute inset-0 bg-green-500/5 animate-pulse-fast"></div>
            <div className="absolute w-1 h-full bg-black z-20 shadow-[0_0_15px_#00ff88]"></div>
            <div className="absolute w-full h-1 bg-black z-20 shadow-[0_0_15px_#00ff88]"></div>
            <div className="absolute inset-4 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/40 animate-spin-slow"></div>
            </div>
            <div className="absolute w-16 h-16 rounded-full bg-gray-900 border-2 border-green-500 shadow-[0_0_20px_#00ff88] flex items-center justify-center z-30">
              <span className="material-symbols-outlined text-3xl text-green-500 animate-pulse">lock_open</span>
            </div>
            <div className="scanline"></div>
          </div>
          <div className="absolute w-[260px] h-[260px] rounded-full bg-green-500/10 blur-xl animate-pulse"></div>
        </div>

        <div className="relative z-20 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-white to-green-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
            TEMPORAL BARRIER<br/>BREACHED
          </h1>
          <p className="mt-4 text-primary font-mono text-sm tracking-[0.5em] uppercase">Capsule Unlocked successfully</p>
        </div>

        <div className="relative z-30 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-primary rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
          <button className="relative px-12 py-6 bg-black border border-green-500/50 rounded-lg font-display text-xl tracking-widest uppercase text-white shadow-neon hover:shadow-neon-intense transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center gap-3">
              Enter The Future
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
            <div className="absolute inset-0 bg-green-500/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>

        <div className="absolute bottom-8 w-full px-8 flex justify-between items-end text-[10px] font-mono text-white/30 z-20 uppercase tracking-widest">
          <div className="flex flex-col gap-1">
            <span>Encryption: AES-256-GCM (DISSOLVED)</span>
            <span>Integrity: 100% VERIFIED</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span>Session ID: #99-AX-2025</span>
            <span>Latency: 0.0004s</span>
          </div>
        </div>
      </main>
    </div>
  );
}
