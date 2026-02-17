"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@midl/satoshi-kit';
import { BackgroundEffects } from '@/components/ui/vault/BackgroundEffects';
import Wallet, { BitcoinNetworkType } from 'sats-connect';
import { toast } from 'sonner';

export default function WalletConnect() {
  const [isCheckingNetwork, setIsCheckingNetwork] = useState(false);

  const setupNetwork = async () => {
    setIsCheckingNetwork(true);
    try {
      // 1. Get current network
      const getNetworkRes = await Wallet.request('wallet_getNetwork', null);
      if (getNetworkRes.status === 'error') {
        throw new Error(getNetworkRes.error.message);
      }

      const currentBitcoinNetwork = getNetworkRes.result.bitcoin?.name;
      console.log("Current Bitcoin Network:", currentBitcoinNetwork);

      // 2. Add MIDL Regtest if not present (or just try to add it as per docs)
      // We'll try to add the custom MIDL Regtest network
      const addNetworkRes = await Wallet.request('wallet_addNetwork', {
        name: 'MIDL-Regtest',
        chain: 'bitcoin',
        type: BitcoinNetworkType.Regtest,
        rpcUrl: 'https://rpc.staging.midl.xyz/bitcoin', // Example RPC for Bitcoin side
        indexerUrl: 'https://indexer.staging.midl.xyz',
        blockExplorerUrl: 'https://blockscout.staging.midl.xyz',
      });

      if (addNetworkRes.status === 'error' && !addNetworkRes.error.message.includes('already exists')) {
        console.warn("Add network error (might already exist):", addNetworkRes.error.message);
      }

      // 3. Prompt to switch to Regtest
      const changeNetworkRes = await Wallet.request('wallet_changeNetwork', {
        name: BitcoinNetworkType.Regtest
      });

      if (changeNetworkRes.status === 'error') {
        throw new Error(changeNetworkRes.error.message);
      }

      toast.success("Protocol Synchronized", {
        description: "Wallet switched to Regtest network."
      });
    } catch (error: any) {
      console.error("Network setup failed:", error);
      toast.error("Network Sync Failed", {
        description: error.message || "Please manually switch Xverse to Regtest."
      });
    } finally {
      setIsCheckingNetwork(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background-dark text-gray-100 flex flex-col font-display overflow-x-hidden">
      <BackgroundEffects />

      <div className="relative z-10 w-full flex-grow flex flex-col justify-between p-8 md:p-12">
        <header className="flex justify-between items-center animate-fade-in-down flex-shrink-0">
          <div className="flex items-center gap-4 text-primary/80">
            <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
            <span className="text-xs tracking-[0.2em] font-bold uppercase">BitCapsule</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span>ENCRYPTION: <span className="text-primary">AES-256</span></span>
            <span className="text-primary font-bold">ACTIVE</span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center relative py-12">
          <div className="text-center mb-10 relative z-20">
            <h1 className="text-primary text-sm md:text-base font-mono mb-2 tracking-widest opacity-80 animate-pulse uppercase">
              &gt; ESTABLISHING TEMPORAL CONNECTION...
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Select Authentication Protocol
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 animate-pulse"></div>
          </div>

          <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12 z-20">
            {/* Neural Sync / Network Config */}
            <div className="relative z-10 group cursor-pointer order-2 md:order-1" onClick={setupNetwork}>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-primary/50 animate-[spin-slow_10s_linear_infinite]"></div>
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse-slow"></div>
                <div className="relative w-24 h-24 bg-gradient-to-b from-[#3a3010] to-[#1a180d] rounded-full border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(242,185,13,0.3)] group-hover:shadow-[0_0_50px_rgba(242,185,13,0.6)] transition-all duration-500">
                  <span className="material-icons text-primary text-4xl animate-pulse">
                    {isCheckingNetwork ? "sync" : "fingerprint"}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-primary/60 text-[10px] tracking-[0.3em] font-mono whitespace-nowrap text-center">
                {isCheckingNetwork ? "SYNCING..." : "NEURAL SYNC READY"}
              </div>
            </div>

            {/* ConnectButton */}
            <div className="order-1 md:order-2">
              <div className="p-1 rounded-xl bg-gradient-to-tr from-xverse-orange/50 via-transparent to-xverse-orange/50 group holographic-card">
                <div className="glass-panel rounded-xl p-8 flex flex-col items-center gap-6 border border-xverse-orange/30 group-hover:border-xverse-orange animate-border-pulse">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background-dark px-3 py-1 border border-xverse-orange/50 text-[10px] text-xverse-orange font-mono tracking-widest uppercase rounded">
                    Recommended
                  </div>

                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-xverse-orange/40 group-hover:border-xverse-orange transition-colors relative overflow-hidden shadow-[0_0_20px_rgba(247,147,26,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-xverse-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-4xl text-xverse-orange drop-shadow-[0_0_10px_rgba(247,147,26,0.8)] relative z-10">
                      currency_bitcoin
                    </span>
                  </div>

                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-xverse-orange transition-colors uppercase">Auth Link</h3>
                    <p className="text-sm text-gray-400 font-mono lowercase">establish bitcoin protocol</p>
                  </div>

                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-xverse-orange to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>

                  <div className="scale-125 transform transition-transform group-hover:scale-135">
                    <ConnectButton />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span>STATUS: READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center animate-in slide-in-from-bottom duration-1000">
            <button
              type="button"
              onClick={setupNetwork}
              className="px-6 py-3 border border-primary/30 rounded-full text-primary/80 hover:text-white hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/20 mr-4"
            >
              Initialize Network
            </button>
            <a
              href="https://faucet.staging.midl.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary/30 rounded-full text-primary/80 hover:text-white hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/20"
            >
              Access MIDL Faucet
            </a>
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-end mt-8 flex-shrink-0">
          <div className="flex flex-col items-start text-left">
             <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Vault Status</span>
             <span className="text-xs font-bold text-primary/70 tracking-widest uppercase">Temporal Archive Online</span>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-gray-500 text-[10px] max-w-xs font-mono">
              By establishing a link, you agree to the BitCapsule <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Temporal Terms</a> &amp; <a className="text-primary hover:underline decoration-1 underline-offset-4" href="#">Protocol Policy</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
