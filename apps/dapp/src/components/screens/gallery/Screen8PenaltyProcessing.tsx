"use client";

import React from "react";

export default function Screen8PenaltyProcessing() {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen overflow-x-hidden relative selection:bg-red-500/30">
      <div className="fixed inset-0 grid-bg bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,0,0.05)_0%,rgba(0,0,0,1)_90%)] pointer-events-none z-0"></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 z-50 animate-pulse"></div>

      <div className="relative flex h-auto min-h-screen w-full flex-col z-10">
        <header className="flex items-center justify-between border-b border-white/5 bg-background-dark/80 backdrop-blur-xl px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="size-8 text-red-500 animate-pulse">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" fill="none" stroke="currentColor" strokeWidth="2"></path>
                <path d="M24 10V24L36 31" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-lg font-bold tracking-[0.2em] uppercase font-mono">BitCapsule</h2>
              <span className="text-[10px] text-red-500/60 font-mono tracking-wider uppercase">Sys.Secure // Breach Detected</span>
            </div>
          </div>
          <div className="bg-red-500/10 text-red-500 border border-red-500/30 rounded px-3 py-1 text-xs font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(255,60,0,0.2)]">
            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE PROTOCOL
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-5xl mx-auto w-full flex-1 relative">
          <div className="w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden border-red-500/20">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/50 rounded-br-lg"></div>

            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex flex-col items-center justify-center shrink-0 relative">
                <div className="absolute inset-0 bg-bitcoin-gold/10 blur-[80px] rounded-full"></div>
                <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                  <div className="absolute inset-0 w-full h-full border border-dashed border-white/40 rounded-full animate-spin-slow opacity-30"></div>
                  <div className="relative w-[180px] h-[180px] bg-black rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)] border border-white/10 z-10">
                    <span className="material-symbols-outlined text-bitcoin-gold text-[90px] gold-glow animate-pulse">
                      currency_bitcoin
                    </span>
                  </div>
                  <div className="absolute -bottom-6 bg-black border border-red-500 text-red-500 px-6 py-2 rounded-none text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,60,0,0.5)] z-20">
                    -0.05 BTC
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-8">
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                    Penalty<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-[0_0_10px_rgba(236,91,19,0.5)]">Authorized</span>
                  </h1>
                  <div className="h-px w-full bg-gradient-to-r from-red-500/50 to-transparent my-4"></div>
                  <p className="text-red-500 font-mono text-sm tracking-[0.2em] uppercase animate-pulse">
                    &gt;&gt; Initiating Decrypt Sequence
                  </p>
                </div>

                <div className="bg-white/5 border-l-2 border-red-500 p-4 rounded-r-lg backdrop-blur-sm relative overflow-hidden">
                  <div className="flex items-start gap-4 relative z-10">
                    <span className="material-symbols-outlined text-red-500 mt-1">lock_clock</span>
                    <p className="text-gray-300 text-sm leading-relaxed font-mono">
                      <strong className="text-white">0.05 BTC</strong> locked in quantum buffer. Decryption algorithms are currently bypassing temporal locks.
                    </p>
                  </div>
                </div>

                <div className="bg-black border border-white/10 rounded-lg h-40 relative overflow-hidden font-mono text-xs shadow-inner">
                  <div className="absolute inset-0 terminal-scanline pointer-events-none z-20 opacity-20"></div>
                  <div className="p-4 h-full flex flex-col justify-end space-y-1 relative z-10">
                    <div className="text-green-500/50">root@bitcapsule:~# init_breach --force</div>
                    <div className="text-gray-500">[14:02:22] Establishing P2P handshake... OK</div>
                    <div className="text-white">[14:02:24] Accessing cold storage wallet...</div>
                    <div className="flex items-center gap-2 text-red-500 font-bold">
                      <span>&gt; DECRYPTING KEY FRAGMENTS</span>
                      <span className="inline-block w-2 h-4 bg-red-500 animate-pulse"></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full relative group overflow-hidden bg-black border border-white/20 text-white/50 h-16 rounded-sm transition-all duration-300 cursor-wait disabled:opacity-50">
                    <div className="absolute inset-0 mechanical-load opacity-30"></div>
                    <div className="relative z-10 flex items-center justify-center gap-4 h-full font-mono text-lg tracking-widest font-bold">
                      <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                      PROCESSING...
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-white/5 bg-black/60 backdrop-blur-md py-4 mt-auto z-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span>ID: <span className="text-white">TV-PEN-4491</span></span>
              <span>Status: <span className="text-red-500">Unconfirmed</span></span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="material-symbols-outlined text-[14px]">encrypted</span>
              <span>256-BIT ENCRYPTION ACTIVE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
