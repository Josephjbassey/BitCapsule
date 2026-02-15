"use client";

import React from "react";

export default function TemporalSyncOverlay() {
  return (
    <div className="fixed inset-0 z-[150] bg-obsidian/90 flex flex-col items-center justify-center text-white backdrop-blur-md overflow-hidden">
      {/* Scanning Laser Line */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="scanline"></div>
      </div>

      <div className="relative flex flex-col items-center animate-in zoom-in fade-in duration-500">
        {/* Core Ring Animation */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-2 border-2 border-primary/40 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-4 border-b-2 border-primary rounded-full animate-spin"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons text-primary text-4xl animate-pulse">sync</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold tracking-[0.3em] uppercase glow-text">Temporal Syncing</h3>
          <p className="text-xs text-primary/60 font-mono tracking-widest animate-pulse">&gt; COMMITTING TO BITCOIN_LEDGER...</p>
        </div>

        <div className="mt-8 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-1 bg-primary/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-10"></div>
    </div>
  );
}
