"use client";

import React from 'react';

export default function TemporalSyncOverlay() {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="relative max-w-md w-full text-center space-y-12">
        {/* Animated Scanner Visual */}
        <div className="relative flex justify-center h-48">
          <div className="w-48 h-48 rounded-full border-2 border-primary/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
            {/* Rotating Rings */}
            <div className="absolute inset-2 border-t-2 border-primary/60 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-6 border-b-2 border-bitcoin-gold/60 rounded-full animate-spin-reverse"></div>

            {/* Scanning Beam */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_#3484f4] animate-scanline opacity-70"></div>

            <span className="material-icons text-6xl text-primary drop-shadow-[0_0_10px_rgba(52,132,244,0.8)]">sync</span>
          </div>

          {/* Decorative Particles */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase glow-text">
            Temporal Sync In Progress
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden max-w-[200px] border border-primary/20">
              <div className="h-full bg-gradient-to-r from-primary to-bitcoin-gold w-1/2 animate-[shimmer_2s_infinite]"></div>
            </div>
            <p className="text-primary/60 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
              Establishing Multi-Chain Anchor...
            </p>
          </div>
        </div>

        <div className="bg-black/60 border border-white/5 p-4 rounded-lg font-mono text-[10px] text-gray-500 space-y-1 text-left">
          <div className="flex gap-2">
            <span className="text-primary/40">[SEC]</span>
            <span>ENCRYPTING_EVM_INTENT...</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary/40">[NET]</span>
            <span>BITCOIN_NETWORK_HANDSHAKE_READY</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary/40">[SYS]</span>
            <span>WAIT_FOR_USER_SIGNATURE...</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
