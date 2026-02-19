"use client";

import React, { useState, useEffect } from "react";

interface TemporalSyncOverlayProps {
  message?: string;
}

export default function TemporalSyncOverlay({ message }: TemporalSyncOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Slow crawl from 0 to 98%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        // The closer it gets to 98, the slower it increments
        const remaining = 98 - prev;
        const increment = Math.max(0.1, remaining * 0.05);
        return Math.min(98, prev + increment);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-background-dark text-white font-display overflow-hidden flex flex-col items-center justify-center p-6">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20 transform perspective-1000 rotate-x-12 scale-110"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.05)_0%,rgba(0,0,0,1)_90%)] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-2xl glass-panel rounded-2xl p-12 overflow-hidden border border-primary/20 flex flex-col items-center text-center animate-in zoom-in fade-in duration-700">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg"></div>

            <div className="relative w-40 h-40 mb-10">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-2 rounded-full border-2 border-primary/40 border-t-transparent animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-primary animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-icons text-primary text-5xl animate-pulse">sync</span>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase glow-text">Syncing Neural Data</h2>
                <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                <p className="text-primary/60 font-mono text-xs tracking-widest uppercase animate-pulse">
                    &gt; {message || "ESTABLISHING BITCOIN_ANCHOR..."}
                </p>
            </div>

            <div className="mt-12 w-full max-w-sm">
                <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase mb-2">
                    <span>Protocol Load</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-primary shadow-[0_0_15px_rgba(242,185,13,0.8)] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div className="absolute inset-0 terminal-scanline opacity-30"></div>
                </div>
            </div>

            <div className="mt-8 text-[9px] text-gray-600 font-mono uppercase">
                Temporal Coordinates Locked // Securing Hash
            </div>
        </div>

        <div className="absolute bottom-10 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            System Identity: BitCapsule-v4.1.0-Core
        </div>
    </div>
  );
}
