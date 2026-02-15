"use client";

import React from "react";
import { EXPLORER_BASE_URL } from "@/app/config";

interface UnlockProcessProps {
  status: 'none' | 'penalty' | 'success';
  onClose: () => void;
  txHash?: string;
}

export default function UnlockProcess({ status, onClose, txHash }: UnlockProcessProps) {
  if (status === 'none') return null;

  // Penalty State (Premature Access Warning)
  if (status === 'penalty') {
    return (
      <div className="fixed inset-0 z-[200] bg-background-dark text-white font-display overflow-hidden flex flex-col items-center justify-center p-6">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,0,0.05)_0%,rgba(0,0,0,1)_90%)] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl p-8 md:p-12 overflow-hidden border-t border-white/10">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg"></div>

            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                {/* Left: Graphic */}
                <div className="flex flex-col items-center justify-center shrink-0 relative">
                    <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full"></div>
                    <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="none" r="48" stroke="#333" strokeWidth="1"></circle>
                            <circle cx="50" cy="50" fill="none" r="44" stroke="#222" strokeWidth="8"></circle>
                        </svg>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_#ff3c00]" viewBox="0 0 100 100">
                            <circle className="text-primary/20" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeWidth="4"></circle>
                            <circle className="text-primary animate-pulse" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset="138" strokeLinecap="butt" strokeWidth="4"></circle>
                        </svg>
                        <div className="absolute inset-0 w-full h-full animate-spin-slow opacity-30">
                            <div className="w-full h-full border border-dashed border-white/40 rounded-full"></div>
                        </div>
                        <div className="relative w-[180px] h-[180px] bg-black rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)] border border-white/10 z-10">
                            <span className="material-symbols-outlined text-primary text-[90px] gold-glow animate-pulse">currency_bitcoin</span>
                        </div>
                        <div className="absolute -bottom-6 bg-black border border-primary text-primary px-6 py-2 rounded-none text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,60,0,0.5)] z-20 font-mono">
                            -20% PENALTY
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 w-full space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Penalty<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 drop-shadow-[0_0_10px_rgba(236,91,19,0.5)]">Authorized</span>
                        </h1>
                        <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent my-4"></div>
                        <p className="text-primary font-mono text-sm tracking-[0.2em] uppercase animate-pulse">
                            &gt;&gt; Initiating Decrypt Sequence
                        </p>
                    </div>

                    <div className="bg-white/5 border-l-2 border-primary p-4 rounded-r-lg backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-start gap-4 relative z-10">
                            <span className="material-symbols-outlined text-primary mt-1">lock_clock</span>
                            <div>
                                <p className="text-gray-300 text-sm leading-relaxed font-mono">
                                    Temporal lock is still active. Early access incurs a <strong className="text-white">20% protocol fee</strong>. Decryption algorithms are currently bypassing temporal locks.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-white/10 rounded-lg h-40 relative overflow-hidden font-mono text-xs shadow-inner">
                        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 terminal-scanline"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 animate-scanline z-30 blur-[2px]"></div>
                        <div className="p-4 h-full flex flex-col justify-end space-y-1 relative z-10">
                            <div className="text-green-500/50">root@bitcapsule:~# init_breach --force</div>
                            <div className="text-gray-500">[14:02:22] Establishing P2P handshake... OK</div>
                            <div className="text-gray-400">[14:02:23] Verifying user signature... MATCH</div>
                            <div className="text-white">[14:02:24] Accessing cold storage wallet...</div>
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <span>&gt; DECRYPTING KEY FRAGMENTS</span>
                                <span className="inline-block w-2 h-4 bg-primary animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Success State (Post-Breach Message Reveal)
  return (
    <div className="fixed inset-0 z-[200] bg-background-dark text-white font-display overflow-hidden flex flex-col items-center justify-center relative">
        <div className="fixed inset-0 z-0 grid-bg opacity-20 pointer-events-none transform rotate-x-12 scale-125 origin-center"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6">
            <div className="relative flex items-center justify-center scale-75 md:scale-100 lg:scale-110 mb-12">
                <div className="w-[300px] h-[300px] rounded-full border border-primary/20 relative flex items-center justify-center animate-spin-slow">
                    <div className="absolute inset-0 border-t-2 border-b-2 border-primary/30 rounded-full"></div>
                </div>

                <div className="absolute w-[200px] h-[200px] rounded-full bg-[#111] border-2 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden z-10">
                    <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                    <div className="absolute w-16 h-16 rounded-full bg-gray-900 border-2 border-green-500 shadow-[0_0_20px_#00ff88] flex items-center justify-center z-30">
                        <span className="material-symbols-outlined text-3xl text-green-500 animate-pulse">lock_open</span>
                    </div>
                </div>
            </div>

            <div className="relative z-20 text-center mb-10">
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-white to-green-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
                    BREACH SUCCESSFUL
                </h1>
                <p className="mt-4 text-primary font-mono text-sm tracking-[0.5em] uppercase">Temporal Payload Recovered</p>
            </div>

            <div className="w-full glass-panel rounded-xl p-8 border border-green-500/30 mb-12 relative overflow-hidden animate-in fade-in zoom-in duration-700">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30 terminal-scanline"></div>
                <div className="flex flex-col gap-4 relative z-10 font-mono text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-gray-500 uppercase tracking-widest">
                        <span>Source: Bitcoin Blockchain</span>
                        <span>Status: Verified</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed italic text-lg text-center py-4">
                        "Your temporal message has been decrypted and your assets returned to your secure wallet."
                    </p>
                    {txHash && (
                        <div className="text-center">
                            <a href={`${EXPLORER_BASE_URL}/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary/60 hover:text-primary transition-colors underline decoration-dashed uppercase tracking-widest">
                                View On Explorer: {txHash.slice(0, 16)}...
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-30">
                <button onClick={onClose} className="px-12 py-4 bg-primary text-black font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-neon">
                    Close Archive
                </button>
            </div>
        </div>
    </div>
  );
}
