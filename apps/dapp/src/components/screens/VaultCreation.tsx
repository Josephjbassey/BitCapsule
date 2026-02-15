"use client";

import React from "react";

export enum VaultType {
  TEMPORAL = 0,
  LEGACY = 1,
  HODL = 2,
  SOCIAL = 3
}

interface VaultCreationProps {
  vaultType: VaultType;
  setVaultType: (type: VaultType) => void;
  beneficiary: string;
  setBeneficiary: (addr: string) => void;
  unlockTimeDays: number;
  setUnlockTimeDays: (days: number) => void;
  message: string;
  setMessage: (msg: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  handleMint: () => void;
  isSigningOrPending: boolean;
}

export default function VaultCreation({
  vaultType,
  setVaultType,
  beneficiary,
  setBeneficiary,
  unlockTimeDays,
  setUnlockTimeDays,
  message,
  setMessage,
  amount,
  setAmount,
  handleMint,
  isSigningOrPending,
}: VaultCreationProps) {
  return (
    <div className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 px-4 md:px-6 py-4 md:py-8 w-full max-w-7xl mx-auto h-full">
      {/* Left Panel: The Lock Mechanism */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
        {/* Decorative concentric circles representing the 'Lock' */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 md:w-96 md:h-96 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-reverse"></div>

          {/* Middle Ring with Data */}
          <div className="absolute inset-12 rounded-full border border-primary/30 bg-background-dark/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
            <img
              alt="Abstract neon geometric pattern"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvp6ARoUsE7ll4bSnvXa5_py9g5qGQVp98jVr6EVbZdGU9SbB2Drz6NpQnj2xkbjwKoudv-PJ7elemYUR3IrIwSyQfDdba5_em0Y6815By_SgLK-UbienHRzGWeex8ssVlRpy9UENyxOSpJquFsQ39mKOC-UpS5k43z9vyCCq5UhNju0S2hwr2wvXukoT3pujQIurKhX6jdz5WAheiUIx3MP_yY35P-aBKwp2TYlMEykCZFy-5o71EyQxltig9VfrCJPQxRHsQEA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>

          {/* Core Lock */}
          <div className="absolute w-32 h-32 bg-background-dark rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10">
            <span className="material-icons text-6xl text-primary drop-shadow-[0_0_15px_rgba(52,132,244,1)]">lock</span>
          </div>

          {/* Floating Particles/Embers */}
          <div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce"></div>
          <div className="absolute top-20 -left-12 w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse"></div>
          <div className="absolute bottom-10 right-0 w-1.5 h-1.5 bg-primary rounded-full blur-[1px] animate-pulse"></div>

          {/* Holographic projection lines */}
          <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform -rotate-45"></div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-primary/60 text-xs tracking-[0.3em] uppercase">System Armed</p>
          <h2 className="text-2xl font-bold text-white tracking-wide">TEMPORAL VAULT</h2>
        </div>
      </div>

      {/* Right Panel: Data Terminal */}
      <div className="w-full lg:w-1/2 max-w-lg relative z-10">
        {/* Terminal Container */}
        <div className="bg-surface-dark/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>

          <div className="p-6 md:p-8 space-y-8 bg-cyber-grid bg-[length:10px_10px] animate-in fade-in zoom-in duration-700">

            {/* Vault Type Selector (Added from functionality requirement) */}
            <div className="space-y-2">
              <label htmlFor="vault-type-selector" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                <span>Utility Protocol</span>
                <span className="material-icons text-xs animate-pulse">settings</span>
              </label>
              <select
                  id="vault-type-selector"
                  value={vaultType}
                  onChange={(e) => setVaultType(Number(e.target.value))}
                  className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60"
              >
                  <option value={VaultType.TEMPORAL}>TEMPORAL VAULT (Personal)</option>
                  <option value={VaultType.LEGACY}>LEGACY SWITCH (Inheritance)</option>
                  <option value={VaultType.HODL}>HODL LOCKER (Forced Savings)</option>
                  <option value={VaultType.SOCIAL}>SOCIAL GIFT (P2P Transfer)</option>
              </select>
            </div>

            {vaultType === VaultType.SOCIAL && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                    <label htmlFor="beneficiary-input" className="text-xs tracking-wider text-primary uppercase font-semibold block">Friend's EVM Address</label>
                    <input
                        id="beneficiary-input"
                        type="text"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60"
                    />
                </div>
            )}

            {/* Amount Field */}
            <div className="space-y-2">
                <label htmlFor="amount-input" className="text-xs tracking-wider text-primary/80 uppercase font-semibold block">Deposit Amount (ETH/BTC)</label>
                <input
                    id="amount-input"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.01"
                    className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60"
                />
            </div>

            {/* Text Input Area */}
            <div className="space-y-3">
              <label htmlFor="message-input" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                <span>Input Stream</span>
                <span className="animate-pulse">_Ready</span>
              </label>
              <div className="relative group">
                <textarea
                  id="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 bg-background-dark border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                  placeholder="Initializing encryption... Write to your future self..."
                ></textarea>
                {/* Glowing line at bottom of active input */}
                <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(52,132,244,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Temporal Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label htmlFor="unlock-horizon" className="text-xs tracking-wider text-primary/80 uppercase font-semibold">Temporal Coordinates</label>
                <span className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    {unlockTimeDays} <span className="text-xs text-gray-400 font-normal">DAYS</span>
                </span>
              </div>
              <div className="relative h-12 flex items-center select-none">
                <input
                    id="unlock-horizon"
                    type="range"
                    min="1"
                    max="3650"
                    value={unlockTimeDays}
                    onChange={(e) => setUnlockTimeDays(Number(e.target.value))}
                    className="w-full accent-primary bg-transparent z-20 opacity-0 absolute cursor-pointer"
                />
                {/* Custom Track Visuals */}
                <div className="absolute w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                    style={{ width: `${(unlockTimeDays / 3650) * 100}%` }}
                  ></div>
                </div>
                {/* Ticks */}
                <div className="absolute w-full flex justify-between px-1 pointer-events-none">
                  <div className="h-2 w-[1px] bg-gray-600"></div>
                  <div className="h-2 w-[1px] bg-gray-600"></div>
                  <div className="h-2 w-[1px] bg-gray-600"></div>
                  <div className="h-2 w-[1px] bg-gray-600"></div>
                  <div className="h-2 w-[1px] bg-gray-600"></div>
                </div>
                {/* Thumb/Knob (Visual only, aligned with real input) */}
                <div
                    className="absolute w-6 h-6 bg-background-dark border-2 border-primary rounded-full shadow-neon cursor-pointer hover:scale-110 transition-transform z-10 flex items-center justify-center pointer-events-none"
                    style={{ left: `calc(${(unlockTimeDays / 3650) * 100}% - 12px)` }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                <span>1 D</span>
                <span>1 YR</span>
                <span>5 YRS</span>
                <span className="text-primary/70">10 YRS</span>
              </div>
            </div>

            {/* Seal Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleMint}
                disabled={isSigningOrPending}
                className="relative w-full group overflow-hidden rounded-lg bg-surface-dark border border-primary/30 hover:border-primary/80 transition-all duration-300 disabled:opacity-50"
              >
                {/* Gold Circuitry Pattern Background */}
                <div className="absolute inset-0 circuit-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative flex items-center justify-between px-6 py-5">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-primary/80 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Confirm Protocol</span>
                    <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all uppercase">
                        {isSigningOrPending ? "Syncing..." : "SEAL VIBE"}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-lg border border-primary/50 bg-primary/10 flex items-center justify-center shadow-gold-glow group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
                  </div>
                </div>
                {/* Bottom warning strip */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/50"></div>
              </button>
              <div className="text-center mt-6 pt-4 border-t border-primary/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Running low on Regtest BTC?</p>
                <a
                  href="https://faucet.staging.midl.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 rounded text-primary/60 hover:text-primary hover:border-primary transition-all text-[9px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/10"
                >
                  <span className="material-icons text-[12px]">local_gas_station</span>
                  Refuel at Faucet
                </a>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] text-red-400/70 tracking-widest uppercase flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">warning</span>
                  Irreversible Action
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
