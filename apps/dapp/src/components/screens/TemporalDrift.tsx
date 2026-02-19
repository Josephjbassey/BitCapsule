"use client";

import React, { useState, useEffect } from "react";

export default function TemporalDrift() {
  const [drift, setDrift] = useState(12.4);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCapsules, setActiveCapsules] = useState(1337);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      setDrift(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Number((prev + change).toFixed(2));
      });
    }, 2000);

    const capsuleInterval = setInterval(() => {
        setActiveCapsules(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);

    const logMessages = [
        "Analyzing block #829,312...",
        "Verifying temporal anchors...",
        "Syncing with Bitcoin mainnet...",
        "Calibrating neural interface...",
        "Scanning cross-chain events...",
        "Protocol integrity: 100%",
        "Temporal entropy detected: 0.002%",
        "Optimizing data transmission...",
        "Establishing P2P handshake...",
        "Indexing BitCapsule metadata..."
    ];

    const logInterval = setInterval(() => {
        setLogs(prev => {
            const nextLog = `[${new Date().toLocaleTimeString()}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`;
            return [nextLog, ...prev].slice(0, 8);
        });
    }, 3000);

    return () => {
      clearInterval(driftInterval);
      clearInterval(capsuleInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-full w-full p-4 md:p-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-primary/10 pb-6 md:pb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase glow-text leading-tight">
            Temporal<br className="md:hidden" /> Analytics
          </h1>
          <p className="text-primary/60 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] mt-2 animate-pulse">
            System Health & Chain Metrics // Active
          </p>
        </div>
        <div className="flex gap-1.5 md:gap-2 h-10 items-end">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 md:w-1.5 bg-primary/20 rounded-full overflow-hidden h-full relative">
                    <div
                        className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-500 ease-in-out"
                        style={{
                            height: `${20 + Math.random() * 80}%`,
                            opacity: 0.3 + Math.random() * 0.7
                        }}
                    ></div>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Drift Card */}
        <div className="glass-panel p-8 rounded-2xl border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-icons text-7xl transform group-hover:scale-110 transition-transform duration-700">timeline</span>
            </div>
            <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Temporal Drift</span>
                <div className="text-4xl md:text-5xl font-mono text-white mt-2 font-bold tracking-tighter tabular-nums">
                    {drift > 0 ? "+" : ""}{drift}ms
                </div>
            </div>
            <div className="w-full h-1 bg-white/5 mt-6 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div
                    className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-in-out relative z-10"
                    style={{ width: `${Math.min(100, Math.max(0, 50 + drift * 2))}%` }}
                >
                    <div className="absolute inset-0 scanline opacity-30"></div>
                </div>
            </div>
        </div>

        {/* TVL Card */}
        <div className="glass-panel p-8 rounded-2xl border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-icons text-7xl transform group-hover:scale-110 transition-transform duration-700">account_balance</span>
            </div>
            <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Protocol TVL</span>
                <div className="text-4xl md:text-5xl font-mono text-bitcoin-gold mt-2 font-bold tracking-tighter">
                    42.0 <span className="text-xl md:text-2xl text-bitcoin-gold/60 font-light ml-1">BTC</span>
                </div>
            </div>
            <div className="flex gap-1.5 mt-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 bg-green-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500/40 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Locks Card */}
        <div className="glass-panel p-8 rounded-2xl border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-icons text-7xl transform group-hover:scale-110 transition-transform duration-700">lock</span>
            </div>
            <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Anchors</span>
                <div className="text-4xl md:text-5xl font-mono text-white mt-2 font-bold tracking-tighter tabular-nums">
                    {activeCapsules.toLocaleString()}
                </div>
            </div>
            <p className="text-[10px] text-primary/40 font-mono mt-6 uppercase tracking-widest font-bold">
                Distributed Across 4 Vault Protocols
            </p>
        </div>
      </div>

      {/* Neural Monitor */}
      <div className="flex-grow glass-panel rounded-2xl border border-white/5 p-6 md:p-10 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute inset-0 grid-bg opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Link Monitor</h3>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    Live Feed // Node 0x420
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Visualization */}
                <div className="relative flex items-center justify-center bg-black/40 rounded-xl border border-white/5 p-8 group overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.03)_0%,transparent_70%)]"></div>
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                        <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-4 border border-dashed border-primary/20 rounded-full animate-spin-reverse"></div>
                        <div className="absolute inset-10 border border-primary/5 rounded-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-icons text-primary/40 text-6xl md:text-8xl animate-pulse">radar</span>
                        </div>
                    </div>
                    <div className="absolute bottom-6 text-[10px] font-mono text-primary/40 uppercase tracking-widest">
                        Scanning Temporal Plane...
                    </div>
                </div>

                {/* Right: Console Logs */}
                <div className="flex flex-col bg-black/60 rounded-xl border border-white/5 p-6 font-mono text-xs shadow-inner">
                    <div className="text-primary/60 mb-4 border-b border-primary/10 pb-2 flex justify-between uppercase text-[10px] font-bold">
                        <span>Terminal Output</span>
                        <span className="animate-pulse">_Recv</span>
                    </div>
                    <div className="space-y-3 overflow-hidden">
                        {logs.length === 0 ? (
                            <div className="text-gray-700 animate-pulse italic">Initializing link...</div>
                        ) : (
                            logs.map((log, i) => (
                                <div
                                    key={i}
                                    className="flex gap-3 animate-in slide-in-from-left duration-500"
                                    style={{ opacity: 1 - (i * 0.12) }}
                                >
                                    <span className="text-primary/30 shrink-0">&gt;</span>
                                    <span className="text-gray-400 break-all">{log}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-auto pt-6 flex items-center gap-2">
                        <div className="w-1.5 h-3 bg-primary animate-pulse"></div>
                        <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
