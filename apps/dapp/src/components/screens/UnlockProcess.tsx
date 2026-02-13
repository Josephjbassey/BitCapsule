"use client";

import React from "react";

interface UnlockProcessProps {
  status: 'penalty' | 'success';
  onClose?: () => void;
  txHash?: string;
}

export default function UnlockProcess({ status, onClose, txHash }: UnlockProcessProps) {
  if (status === 'penalty') {
    return (
      <div className="fixed inset-0 z-[200] bg-background-dark text-white font-display overflow-hidden flex flex-col items-center justify-center p-6">
        <div className="fixed inset-0 bg-grid-pattern bg-[size:40px_40px] pointer-events-none z-0 opacity-20"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,0,0.05)_0%,rgba(0,0,0,1)_90%)] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl p-8 md:p-12 overflow-hidden border-t border-white/10">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/50 rounded-br-lg"></div>

            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                {/* Left: Graphic */}
                <div className="flex flex-col items-center justify-center shrink-0 relative">
                    <div className="absolute inset-0 bg-bitcoin-gold/10 blur-[80px] rounded-full"></div>
                    <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="none" r="48" stroke="#333" strokeWidth="1"></circle>
                            <circle cx="50" cy="50" fill="none" r="44" stroke="#222" strokeWidth="8"></circle>
                        </svg>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_#ff3c00]" viewBox="0 0 100 100">
                            <circle className="text-secondary/20" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeWidth="4"></circle>
                            <circle className="text-secondary animate-pulse" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset="138" strokeLinecap="butt" strokeWidth="4"></circle>
                        </svg>
                        <div className="absolute inset-0 w-full h-full animate-spin-slow opacity-30">
                            <div className="w-full h-full border border-dashed border-white/40 rounded-full"></div>
                        </div>
                        <div className="relative w-[180px] h-[180px] bg-black rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)] border border-white/10 z-10">
                            <span className="material-symbols-outlined text-bitcoin-gold text-[90px] drop-shadow-[0_0_20px_#F7931A] animate-pulse">currency_bitcoin</span>
                        </div>
                        <div className="absolute -bottom-6 bg-black border border-secondary text-secondary px-6 py-2 rounded-none text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,60,0,0.5)] z-20">
                            -0.05 BTC
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 w-full space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Penalty<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500 drop-shadow-[0_0_10px_rgba(236,91,19,0.5)]">Authorized</span>
                        </h1>
                        <div className="h-px w-full bg-gradient-to-r from-secondary/50 to-transparent my-4"></div>
                        <p className="text-secondary font-mono text-sm tracking-[0.2em] uppercase animate-pulse">
                            &gt;&gt; Initiating Decrypt Sequence
                        </p>
                    </div>

                    <div className="bg-white/5 border-l-2 border-secondary p-4 rounded-r-lg backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-secondary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-start gap-4 relative z-10">
                            <span className="material-symbols-outlined text-secondary mt-1">lock_clock</span>
                            <div>
                                <p className="text-gray-300 text-sm leading-relaxed font-mono">
                                    <strong className="text-white">0.05 BTC</strong> locked in quantum buffer. Decryption algorithms are currently bypassing temporal locks.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-white/10 rounded-lg h-40 relative overflow-hidden font-mono text-xs shadow-inner">
                        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[size:100%_4px]"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30 animate-scanline z-30 blur-[2px]"></div>
                        <div className="p-4 h-full flex flex-col justify-end space-y-1 relative z-10">
                            <div className="text-green-500/50">root@timevibe:~# init_breach --force</div>
                            <div className="text-gray-500">[14:02:22] Establishing P2P handshake... OK</div>
                            <div className="text-gray-400">[14:02:23] Verifying user signature... MATCH</div>
                            <div className="text-white">[14:02:24] Accessing cold storage wallet...</div>
                            <div className="flex items-center gap-2 text-secondary font-bold">
                                <span>&gt; DECRYPTING KEY FRAGMENTS</span>
                                <span className="inline-block w-2 h-4 bg-secondary animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="fixed inset-0 z-[200] bg-background-dark text-white font-display overflow-hidden flex flex-col items-center justify-center relative">
        <div className="fixed inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none transform rotate-x-12 scale-125 origin-center"></div>

        <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center scale-75 md:scale-100 lg:scale-110 mb-12">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="energy-beam h-[600px] rotate-45"></div>
                    <div className="energy-beam h-[600px] -rotate-45" style={{ animationDelay: "0.5s" }}></div>
                </div>

                <div className="w-[400px] h-[400px] rounded-full border border-white/10 relative flex items-center justify-center animate-spin-slow">
                    <div className="absolute inset-0 border-t-2 border-b-2 border-primary/30 rounded-full"></div>
                </div>

                <div className="absolute w-[240px] h-[240px] rounded-full bg-[#111] border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden z-10 animate-[shake_0.5s_ease-in-out_infinite]">
                    <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                    <div className="absolute w-16 h-16 rounded-full bg-gray-900 border-2 border-green-500 shadow-[0_0_20px_#00ff88] flex items-center justify-center z-30">
                        <span className="material-symbols-outlined text-3xl text-green-500 animate-pulse">lock_open</span>
                    </div>
                </div>
            </div>

            <div className="relative z-20 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-white to-green-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
                    TEMPORAL BARRIER<br/>BREACHED
                </h1>
                <p className="mt-4 text-primary font-mono text-sm tracking-[0.5em] uppercase">Capsule Unlocked successfully</p>
                {txHash && (
                    <a href={`https://mempool.space/tx/${txHash}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[10px] font-mono text-gray-500 hover:text-white underline decoration-dashed">
                        TX: {txHash.slice(0, 10)}...
                    </a>
                )}
            </div>

            <div className="relative z-30 group">
                <button onClick={onClose} className="relative px-12 py-6 bg-black border border-green-500/50 rounded-lg font-display text-xl tracking-widest uppercase text-white shadow-neon hover:shadow-neon-intense transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                        Enter The Future
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                </button>
            </div>
        </div>
    </div>
  );
}
