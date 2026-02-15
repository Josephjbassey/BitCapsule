"use client";

import React, { useState, useEffect } from "react";
import { NetworkScout } from "../NetworkScout";

interface WalletConnectProps {
  onConnect: (connector: any) => void;
  onAbort?: () => void;
  connectors?: readonly any[];
}

export default function WalletConnect({ onConnect, onAbort, connectors = [] }: WalletConnectProps) {
  const [isSearching, setIsSearching] = useState(true);

  // Give extensions a moment to inject
  useEffect(() => {
    const timer = setTimeout(() => setIsSearching(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter for Bitcoin/MIDL compatible connectors
  const bitcoinConnectors = connectors.filter(c =>
    c.name.toLowerCase().includes("xverse") ||
    c.name.toLowerCase().includes("unisat") ||
    c.name.toLowerCase().includes("leather") ||
    c.id.toLowerCase().includes("satoshi") ||
    c.id.toLowerCase().includes("bitcoin")
  );

  // If no specific bitcoin connectors found, use all of them as fallback
  const displayConnectors = bitcoinConnectors.length > 0 ? bitcoinConnectors : connectors;

  const handleRefresh = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1000);
    // Force a small state update if needed, but connectors from wagmi should update automatically
  };

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

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center animate-fade-in-down flex-shrink-0">
          <div className="flex items-center gap-4 text-primary/80">
            <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
            <span className="text-xs tracking-[0.2em] font-bold">BITCAPSULE // SECURE CHANNEL V.4.1.0</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span>NETWORK: <span className="text-primary">REGTEST</span></span>
            <span className="text-gray-600">|</span>
            <span>ENCRYPTION: <span className="text-primary">ACTIVE</span></span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center relative py-12">
          <div className="text-center mb-10 relative z-20">
            <h1 className="text-primary text-sm md:text-base font-mono mb-2 tracking-widest opacity-80 animate-pulse">
              {isSearching ? "> SCANNING FOR TEMPORAL ANCHORS..." : "> INITIALIZING TEMPORAL HANDSHAKE..."}
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {isSearching ? "Detecting Protocols" : "Establish Secure Protocol"}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 animate-pulse"></div>
          </div>

          <div className="relative w-full max-w-5xl flex flex-wrap items-center justify-center gap-8 md:gap-12 z-20">
            {isSearching ? (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin"></div>
                <p className="text-xs text-primary font-mono tracking-widest">Searching for injected modules...</p>
              </div>
            ) : displayConnectors.length > 0 ? (
              displayConnectors.map((connector) => {
                const isXverse = connector.name.toLowerCase().includes("xverse");
                return (
                  <button
                    key={connector.id}
                    onClick={() => onConnect(connector)}
                    className="glass-panel group relative w-72 p-8 rounded-xl flex flex-col items-center justify-center gap-6 text-center border border-bitcoin-gold/30 hover:border-bitcoin-gold transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(247,147,26,0.3)] active:scale-95"
                  >
                    {isXverse && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-bitcoin-gold/50 text-[10px] text-bitcoin-gold font-mono tracking-widest uppercase rounded flex items-center gap-1">
                        <span className="material-icons text-[10px]">verified</span>
                        Recommended
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-bitcoin-gold/40 group-hover:border-bitcoin-gold transition-colors relative overflow-hidden shadow-[0_0_20px_rgba(247,147,26,0.2)]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-bitcoin-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-4xl text-bitcoin-gold drop-shadow-[0_0_10px_rgba(247,147,26,0.8)] relative z-10">
                        {connector.name.toLowerCase().includes("unisat") ? "account_balance_wallet" : "currency_bitcoin"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-bitcoin-gold transition-colors drop-shadow-md uppercase">
                        {connector.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-mono">Temporal Authority</p>
                    </div>
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-bitcoin-gold to-transparent mt-2 opacity-30 group-hover:opacity-100 transition-all"></div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>STATUS: READY</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center p-12 glass-panel border border-primary/20 rounded-xl backdrop-blur-md max-w-md animate-in fade-in zoom-in duration-500">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping"></div>
                  <div className="relative w-24 h-24 bg-primary/10 rounded-full border border-primary/40 flex items-center justify-center">
                    <span className="material-icons text-primary/60 text-5xl">sensors_off</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Signal Lost</h3>
                <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">No Bitcoin-compatible protocols detected. Please ensure your wallet extension is unlocked and set to a compatible network.</p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRefresh}
                    className="w-full py-3 bg-primary/10 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest rounded hover:bg-primary/20 transition-all active:scale-95"
                  >
                    Retry Scan
                  </button>
                  <a
                    href="https://www.xverse.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/20 text-gray-300 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all active:scale-95"
                  >
                    <span className="material-icons text-sm">download</span>
                    Install Xverse
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center animate-in slide-in-from-bottom duration-1000">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Low on Temporal fuel?</p>
            <a
              href="https://faucet.staging.midl.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-primary/30 rounded text-primary/80 hover:text-primary hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/10"
            >
              Access MIDL Faucet
            </a>
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-end mt-8 flex-shrink-0">
          <button
            type="button"
            onClick={onAbort}
            className="group flex items-center gap-3 px-6 py-3 border border-white/20 rounded hover:bg-white/5 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm active:scale-95"
          >
            <span className="material-icons text-gray-400 text-lg group-hover:text-primary group-hover:-translate-x-1 transition-all">arrow_back_ios_new</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider group-hover:text-primary/70">System</span>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-widest">ABORT SEQUENCE</span>
            </div>
          </button>
          <div className="hidden md:block text-right">
            <p className="text-gray-500 text-xs max-w-xs font-mono">
              By establishing a link, you agree to the BitCapsule <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Temporal Terms</a> &amp; <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Protocol Policy</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
