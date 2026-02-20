"use client";

import React from "react";

export default function Screen9WalletConnection() {
  return (
    <div className="bg-background-dark text-gray-100 h-screen w-screen flex flex-col relative font-display overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg transform perspective-1000 rotate-x-12 scale-110 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-primary/80">
            <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
            <span className="text-xs tracking-[0.2em] font-bold uppercase">BitCapsule // Secure Link v.3.0.1</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono uppercase">
            <span>Encryption: AES-256</span>
            <span className="text-primary font-bold">Active</span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center relative">
          <div className="text-center mb-10 relative z-20">
            <h1 className="text-primary text-sm md:text-base font-mono mb-2 tracking-widest opacity-80 uppercase animate-pulse">
              &gt; Establishing Temporal Connection...
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Select Authentication Protocol
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 animate-pulse"></div>
          </div>

          <div className="relative w-full max-w-4xl flex items-center justify-center flex-col md:flex-row gap-12">
            {/* Neural Sync Placeholder */}
            <div className="relative z-10 group cursor-pointer order-2 md:order-1">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-primary/50 animate-spin-slow"></div>
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse-slow"></div>
                <div className="relative w-24 h-24 bg-surface-dark rounded-full border border-primary flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform duration-500">
                  <span className="material-icons text-primary text-4xl animate-pulse">fingerprint</span>
                </div>
              </div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-primary/60 text-[10px] tracking-[0.3em] font-mono whitespace-nowrap text-center uppercase">
                Neural Sync Ready
              </div>
            </div>

            {/* Wallet Button */}
            <button className="glass-panel group relative z-20 w-72 p-8 rounded-xl flex flex-col items-center justify-center gap-6 text-center border border-bitcoin-gold/30 hover:border-bitcoin-gold animate-border-pulse order-1 md:order-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-bitcoin-gold/50 text-[10px] text-bitcoin-gold font-mono tracking-widest uppercase rounded">
                Recommended
              </div>
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-bitcoin-gold/40 group-hover:border-bitcoin-gold transition-colors relative overflow-hidden shadow-neon">
                <span className="material-symbols-outlined text-4xl text-bitcoin-gold drop-shadow-neon relative z-10">
                  currency_bitcoin
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-bitcoin-gold transition-colors uppercase">Xverse</h3>
                <p className="text-sm text-gray-400 font-mono uppercase">Bitcoin Wallet</p>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-bitcoin-gold to-transparent mt-2 opacity-50"></div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Status: Online</span>
              </div>
            </button>
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-end mt-8">
          <button className="group flex items-center gap-3 px-6 py-3 border border-white/20 rounded hover:bg-white/5 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
            <span className="material-icons text-gray-400 text-lg group-hover:text-primary transition-all">arrow_back_ios_new</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">System</span>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-widest uppercase">Abort Sequence</span>
            </div>
          </button>
          <div className="hidden md:block text-right">
            <p className="text-gray-500 text-[10px] max-w-xs font-mono uppercase">
              By connecting a wallet, you agree to the BitCapsule <a className="text-primary hover:underline" href="#">Temporal Terms</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
