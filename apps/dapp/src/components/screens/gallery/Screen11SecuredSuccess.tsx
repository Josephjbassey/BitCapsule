"use client";

import React from "react";

export default function Screen11SecuredSuccess() {
  return (
    <div className="bg-background-dark text-white font-display min-h-screen overflow-hidden flex flex-col relative selection:bg-primary selection:text-white">
      {/* Ambient Starfield */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 opacity-20 animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-primary rounded-full top-3/4 left-1/3 opacity-30 animate-pulse delay-700"></div>
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl -bottom-20 -left-20"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto h-screen">
        <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center opacity-70">
          <div className="flex items-center space-x-2 text-primary text-xs tracking-[0.2em] uppercase font-mono">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span>System Online</span>
          </div>
          <div className="text-xs text-slate-400 font-mono uppercase">Secure_Connection_V.9.2</div>
        </div>

        <div className="relative w-full max-w-4xl aspect-[16/10] flex flex-col items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-primary/10 opacity-30 scale-150 animate-pulse-slow"></div>

          <div className="relative flex flex-col items-center justify-center space-y-10">
            <div className="text-center space-y-2 relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scanline"></div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-neon uppercase">Temporal Archive Secured</h1>
              <p className="text-primary/80 font-mono text-sm tracking-widest uppercase">
                Capsule ID: #TV-8X92-ALPHA <span className="text-green-400 ml-2">● LOCKED</span>
              </p>
            </div>

            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center animate-float">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse"></div>
              <div className="relative z-10 w-32 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-neon transform rotate-45 group">
                <span className="material-icons -rotate-45 text-bitcoin-gold text-6xl drop-shadow-neon">lock</span>
              </div>
              <div className="absolute w-64 h-64 border border-dashed border-primary/20 rounded-full animate-spin-slow"></div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-primary/20 rounded-lg p-6 flex flex-col items-center space-y-2 shadow-lg w-full max-w-lg">
              <div className="text-xs text-slate-400 font-mono tracking-[0.3em] uppercase mb-1">Unlock Countdown</div>
              <div className="font-mono text-3xl md:text-5xl text-white tracking-widest flex items-baseline space-x-4 tabular-nums uppercase">
                <div className="flex flex-col items-center">
                  <span>3649</span>
                  <span className="text-[10px] text-slate-500 mt-1 tracking-normal">Days</span>
                </div>
                <span className="text-primary animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span>23</span>
                  <span className="text-[10px] text-slate-500 mt-1 tracking-normal">Hrs</span>
                </div>
                <span className="text-primary animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span>59</span>
                  <span className="text-[10px] text-slate-500 mt-1 tracking-normal">Mins</span>
                </div>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary w-[2%] shadow-neon"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <button className="px-8 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/50 text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:shadow-neon hover:-translate-y-1 uppercase font-bold tracking-wider">
                Create New Vibe
              </button>
              <button className="px-8 py-3 bg-transparent hover:bg-white/5 border border-slate-600 hover:border-white/50 text-slate-300 hover:text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 uppercase font-bold tracking-wider">
                View Archive
              </button>
            </div>
          </div>
        </div>

        <footer className="absolute bottom-8 flex justify-between w-full max-w-7xl px-8 text-[10px] text-slate-600 font-mono uppercase tracking-widest opacity-60">
          <div>Encrypted: SHA-256</div>
          <div className="hidden md:block">Lat: 40.7128° N • Lon: 74.0060° W</div>
          <div>Node: US-EAST-1</div>
        </footer>
      </main>
    </div>
  );
}
