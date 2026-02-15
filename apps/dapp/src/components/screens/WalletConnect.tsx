"use client";

import React from "react";
import { NetworkScout } from "../NetworkScout";

interface WalletConnectProps {
  onConnect: () => void;
  onAbort?: () => void;
}

export default function WalletConnect({ onConnect, onAbort }: WalletConnectProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-gray-100 min-h-screen w-full flex flex-col relative font-display overflow-hidden">
      <NetworkScout />
      {/* Background Environment */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-40 transform perspective-1000 rotate-x-12 scale-110"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-bitcoin-gold rounded-full opacity-40 animate-float" style={{ animationDelay: "3s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
        <header className="flex justify-between items-center animate-fade-in-down">
          <div className="flex items-center gap-4 text-primary/80">
            <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
            <span className="text-xs tracking-[0.2em] font-bold">BITCAPSULE // SECURE LINK v.3.0.1</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span>ENCRYPTION: AES-256</span>
            <span className="text-primary">ACTIVE</span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center relative">
          <div className="text-center mb-10 relative z-20">
            <h1 className="text-primary text-sm md:text-base font-mono mb-2 tracking-widest opacity-80">
              &gt; ESTABLISHING TEMPORAL CONNECTION...
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Select Authentication Protocol
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 animate-pulse"></div>
          </div>

          <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center flex-col md:flex-row gap-12">
            {/* SVG Connector Line */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible hidden md:block" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(242, 185, 13, 0)"></stop>
                  <stop offset="50%" stopColor="rgba(242, 185, 13, 0.6)"></stop>
                  <stop offset="100%" stopColor="rgba(242, 185, 13, 0)"></stop>
                </linearGradient>
              </defs>
              <path className="opacity-50" d="M 300,200 L 500,200" fill="none" stroke="url(#goldGradient)" strokeDasharray="4 4" strokeWidth="2"></path>
            </svg>

            {/* Fingerprint / Identity Node */}
            <div className="relative z-10 group cursor-pointer order-2 md:order-1">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-primary/50 animate-spin-slow"></div>
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-b from-[#3a3010] to-[#1a180d] rounded-full border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(242,185,13,0.3)] group-hover:shadow-[0_0_50px_rgba(242,185,13,0.6)] transition-all duration-500">
                  <span className="material-icons text-primary text-4xl animate-pulse">fingerprint</span>
                </div>
              </div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-primary/60 text-[10px] tracking-[0.3em] font-mono whitespace-nowrap text-center">
                NEURAL SYNC READY
              </div>
            </div>

            {/* Xverse Wallet Card */}
            <button
              onClick={onConnect}
              className="glass-panel group relative z-20 w-72 p-8 rounded-xl flex flex-col items-center justify-center gap-6 text-center border border-bitcoin-gold/30 hover:border-bitcoin-gold transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(247,147,26,0.3)] order-1 md:order-2"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-bitcoin-gold/50 text-[10px] text-bitcoin-gold font-mono tracking-widest uppercase rounded">
                Recommended
              </div>
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-bitcoin-gold/40 group-hover:border-bitcoin-gold transition-colors relative overflow-hidden shadow-[0_0_20px_rgba(247,147,26,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-bitcoin-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-4xl text-bitcoin-gold drop-shadow-[0_0_10px_rgba(247,147,26,0.8)] relative z-10">currency_bitcoin</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-bitcoin-gold transition-colors drop-shadow-md">XVERSE</h3>
                <p className="text-sm text-gray-300 font-mono">Bitcoin Wallet</p>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-bitcoin-gold to-transparent mt-2 opacity-50 group-hover:opacity-100 transition-all"></div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>STATUS: ONLINE</span>
              </div>
            </button>
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-end mt-8">
          <button
            type="button"
            onClick={onAbort}
            className="group flex items-center gap-3 px-6 py-3 border border-white/20 rounded hover:bg-white/5 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="material-icons text-gray-400 text-lg group-hover:text-primary group-hover:-translate-x-1 transition-all">arrow_back_ios_new</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider group-hover:text-primary/70">System</span>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-widest">ABORT SEQUENCE</span>
            </div>
          </button>
          <div className="hidden md:block text-right">
            <p className="text-gray-500 text-xs max-w-xs font-mono">
              By connecting a wallet, you agree to the BitCapsule <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Temporal Terms</a> &amp; <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Protocol Policy</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
