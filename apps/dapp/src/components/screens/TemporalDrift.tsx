"use client";

import React from "react";

export default function TemporalDrift() {
  return (
    <div className="flex flex-col min-h-full w-full p-4 md:p-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase glow-text">Temporal Analytics</h1>
          <p className="text-primary/60 font-mono text-xs uppercase tracking-widest mt-1">System Health & Chain Metrics</p>
        </div>
        <div className="flex gap-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-icons text-6xl">timeline</span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Temporal Drift</span>
            <div className="text-3xl font-mono text-white mt-2 font-bold">+12.4ms</div>
            <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]"></div>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-icons text-6xl">account_balance</span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Protocol TVL</span>
            <div className="text-3xl font-mono text-white mt-2 font-bold">42.0 BTC</div>
            <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 h-1 bg-green-500/40 rounded-full"></div>
                ))}
            </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-icons text-6xl">lock</span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active Locks</span>
            <div className="text-3xl font-mono text-white mt-2 font-bold">1,337</div>
            <p className="text-[9px] text-primary/40 font-mono mt-4 uppercase">Across 4 Vault Types</p>
        </div>
      </div>

      <div className="flex-grow glass-panel rounded-xl border border-white/5 p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 grid-bg opacity-5"></div>
        <div className="relative z-10">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-primary/40 text-4xl animate-spin-slow">settings</span>
            </div>
            <h3 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-2">Deep Scan Initializing</h3>
            <p className="text-sm text-gray-500 font-mono max-w-md mx-auto leading-relaxed">
                BitCapsule is currently calibrating temporal sensors. Real-time on-chain analytics will be available in the next protocol upgrade.
            </p>
        </div>
      </div>
    </div>
  );
}
