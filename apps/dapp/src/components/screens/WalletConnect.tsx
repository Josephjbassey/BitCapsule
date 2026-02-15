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
  const [hasXverseWindow, setHasXverseWindow] = useState(false);

  // Give extensions a moment to inject
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
      // Check for Xverse specifically in the window
      if (typeof window !== 'undefined') {
        const hasXverse = !!(window as any).XverseProviders || !!(window as any).xfi || !!(window as any).xverse;
        setHasXverseWindow(hasXverse);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Filter for Bitcoin/MIDL compatible connectors
  // Be very inclusive with names and IDs
  const bitcoinConnectors = connectors.filter(c => {
    const name = (c.name || "").toLowerCase();
    const id = (c.id || "").toLowerCase();
    return (
      name.includes("xverse") || id.includes("xverse") ||
      name.includes("unisat") || id.includes("unisat") ||
      name.includes("leather") || id.includes("leather") ||
      name.includes("satoshi") || id.includes("satoshi") ||
      name.includes("bitcoin") || id.includes("bitcoin") ||
      name.includes("okx") || id.includes("okx") ||
      name.includes("phantom") || id.includes("phantom")
    );
  });

  // If no specific bitcoin connectors found, use all of them as fallback
  const displayConnectors = bitcoinConnectors.length > 0 ? bitcoinConnectors : connectors;

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-gray-100 min-h-screen w-full flex flex-col relative font-display overflow-hidden">
      <NetworkScout />
      {/* Background Environment */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-40 transform perspective-1000 rotate-x-12 scale-110"></div>
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
          </div>

          <div className="relative w-full max-w-5xl flex flex-wrap items-center justify-center gap-8 md:gap-12 z-20">
            {isSearching ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : displayConnectors.length > 0 ? (
              displayConnectors.map((connector) => {
                const name = (connector.name || "").toLowerCase();
                const id = (connector.id || "").toLowerCase();
                const isXverse = name.includes("xverse") || id.includes("xverse");

                return (
                  <button
                    key={connector.id}
                    onClick={() => onConnect(connector)}
                    className="glass-panel group relative w-72 p-8 rounded-xl flex flex-col items-center justify-center gap-6 text-center border border-bitcoin-gold/30 hover:border-bitcoin-gold transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
                  >
                    {isXverse && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-bitcoin-gold/50 text-[10px] text-bitcoin-gold font-mono tracking-widest uppercase rounded">
                        Recommended
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-bitcoin-gold/40 group-hover:border-bitcoin-gold transition-colors relative overflow-hidden">
                      <span className="material-symbols-outlined text-4xl text-bitcoin-gold">
                        {name.includes("unisat") ? "account_balance_wallet" : "currency_bitcoin"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                        {connector.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-mono">Protocol Active</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center p-12 glass-panel border border-primary/20 rounded-xl backdrop-blur-md max-w-md animate-in fade-in zoom-in">
                <span className="material-icons text-primary/60 text-6xl mb-6">sensors_off</span>
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Signal Lost</h3>
                <p className="text-gray-400 text-sm mb-8 font-mono">
                  {hasXverseWindow
                    ? "Xverse detected in system but not responding to link. Please unlock Xverse and refresh."
                    : "No Bitcoin-compatible protocols detected. Please install Xverse to establish a link."}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRefresh}
                    className="w-full py-4 bg-primary/20 border border-primary text-primary font-bold rounded hover:bg-primary hover:text-white transition-all uppercase text-xs"
                  >
                    Refresh System
                  </button>
                  <a
                    href="https://www.xverse.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white text-[10px] uppercase underline underline-offset-4"
                  >
                    Download Xverse Authority
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://faucet.staging.midl.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-primary/30 rounded text-primary/80 hover:text-primary hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              MIDL Faucet
            </a>
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-end mt-8">
          <button
            type="button"
            onClick={onAbort}
            className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded hover:bg-white/5 transition-all text-xs text-gray-500 uppercase font-mono"
          >
            Abort Sequence
          </button>
        </footer>
      </div>
    </div>
  );
}
