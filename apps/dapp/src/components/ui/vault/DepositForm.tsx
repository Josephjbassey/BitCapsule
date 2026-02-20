"use client";

import React from "react";
import { VaultType } from "@/components/screens/VaultCreation";

interface DepositFormProps {
  vaultType: VaultType;
  setVaultType: (type: VaultType) => void;
  beneficiary: string;
  setBeneficiary: (addr: string) => void;
  unlockTimeDays: number;
  setUnlockTimeDays: (days: number) => void;
  message: string;
  setMessage: (msg: string) => void;
  label: string;
  setLabel: (lbl: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  handleMint: () => void;
  isSigningOrPending: boolean;
  fileInfo: { name: string; size: number; file?: File } | null;
  setFileInfo: (info: { name: string; size: number; file?: File } | null) => void;
}

export const DepositForm = ({
  vaultType,
  setVaultType,
  beneficiary,
  setBeneficiary,
  unlockTimeDays,
  setUnlockTimeDays,
  message,
  setMessage,
  label,
  setLabel,
  amount,
  setAmount,
  handleMint,
  isSigningOrPending,
  fileInfo,
  setFileInfo,
}: DepositFormProps) => {
  return (
    <div className="bg-surface-dark/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group hover:shadow-primary/10 transition-shadow duration-500">
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>

      <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 grid-bg animate-in fade-in zoom-in duration-700">
        <div className="space-y-2">
          <label htmlFor="vault-type-selector" className="flex justify-between text-[10px] sm:text-xs tracking-wider text-primary/80 uppercase font-semibold">
            <span>Utility Protocol</span>
            <span className="material-icons text-xs animate-pulse">settings</span>
          </label>
          <select
              id="vault-type-selector"
              value={vaultType}
              onChange={(e) => setVaultType(Number(e.target.value))}
              className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60 hover:scale-[1.01]"
          >
              <option value={VaultType.TEMPORAL}>TEMPORAL VAULT (Personal)</option>
              <option value={VaultType.LEGACY}>LEGACY SWITCH (Inheritance)</option>
              <option value={VaultType.HODL}>HODL LOCKER (Forced Savings)</option>
              <option value={VaultType.SOCIAL}>SOCIAL GIFT (P2P Transfer)</option>
          </select>
        </div>

        <div className="space-y-2">
            <label htmlFor="label-input" className="text-[10px] sm:text-xs tracking-wider text-primary uppercase font-semibold block text-left">Vault Label (Public)</label>
            <input
                id="label-input"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Retirement Fund, 2030 Savings"
                className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-display text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60 hover:scale-[1.01]"
            />
        </div>

        {vaultType === VaultType.LEGACY && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <label htmlFor="legacy-file-input" className="text-[10px] sm:text-xs tracking-wider text-primary uppercase font-semibold block text-left">Digital Assets (Heritage)</label>
                <div className="relative group">
                    <input
                        id="legacy-file-input"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFileInfo({ name: file.name, size: file.size, file });
                            else setFileInfo(null);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-400 font-display text-[10px] flex items-center justify-between group-hover:border-primary/60 transition-all">
                        <span>{fileInfo ? `${fileInfo.name} (${(fileInfo.size / 1024).toFixed(1)} KB)` : "Archive metadata (Name, Size) only"}</span>
                        <span className="material-icons text-sm text-primary/60">{fileInfo ? "check_circle" : "upload_file"}</span>
                    </div>
                </div>
                <p className="text-[8px] text-gray-500 font-mono mt-1 text-left px-1">* BitCapsule currently archives file metadata only for temporal verification.</p>
            </div>
        )}
        {(vaultType === VaultType.SOCIAL || vaultType === VaultType.LEGACY) && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <label htmlFor="beneficiary-input" className="text-[10px] sm:text-xs tracking-wider text-primary uppercase font-semibold block text-left">Beneficiary Address (EVM or Bitcoin)</label>
                <input
                    id="beneficiary-input"
                    type="text"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    placeholder="0x... or 1, 3, bc1..."
                    className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60"
                />
            </div>
        )}

        <div className="space-y-2">
            <label htmlFor="amount-input" className="text-[10px] sm:text-xs tracking-wider text-primary/80 uppercase font-semibold block text-left">Deposit Amount (BTC)</label>
            <input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full bg-background-dark border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all hover:border-primary/60"
            />
        </div>

        <div className="space-y-3">
          <label htmlFor="message-input" className="flex justify-between text-[10px] sm:text-xs tracking-wider text-primary/80 uppercase font-semibold">
            <span>{vaultType === VaultType.SOCIAL ? "Temporal Greeting" : "Input Stream (Secret)"}</span>
            <span className="animate-pulse">_Ready</span>
          </label>
          <div className="relative group">
            <textarea
              id="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-20 sm:h-24 bg-background-dark border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
              placeholder="Encrypting... Write to the future..."
            ></textarea>
            <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(242,185,13,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label htmlFor="unlock-horizon" className="text-[10px] sm:text-xs tracking-wider text-primary/80 uppercase font-semibold">Temporal Coordinates</label>
            <span className="text-lg sm:text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                {unlockTimeDays} <span className="text-xs text-gray-400 font-normal">DAYS</span>
            </span>
          </div>
          <div className="relative h-10 flex items-center select-none">
            <input
                id="unlock-horizon"
                type="range"
                min="1"
                max="3650"
                value={unlockTimeDays}
                onChange={(e) => setUnlockTimeDays(Number(e.target.value))}
                className="w-full accent-primary bg-transparent z-20 opacity-0 absolute cursor-pointer"
            />
            <div className="absolute w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                style={{ width: `${(unlockTimeDays / 3650) * 100}%` }}
              ></div>
            </div>
            <div
                className="absolute w-6 h-6 bg-background-dark border-2 border-primary rounded-full shadow-neon z-10 flex items-center justify-center pointer-events-none"
                style={{ left: `calc(${(unlockTimeDays / 3650) * 100}% - 12px)` }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
            <span>1 D</span>
            <span>1 YR</span>
            <span>5 YRS</span>
            <span className="text-primary/70">10 YRS</span>
          </div>
        </div>

        <div className="pt-2 sm:pt-4">
          <button type="button"
            onClick={handleMint}
            disabled={isSigningOrPending}
            className="relative w-full group overflow-hidden rounded-lg bg-surface-dark border border-primary/30 hover:border-primary/80 transition-all duration-300 disabled:opacity-50 active:scale-95 hover:scale-[1.02] hover:shadow-neon"
          >
            <div className="absolute inset-0 circuit-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5">
              <div className="flex flex-col items-start">
                <span className="text-[10px] sm:text-xs text-primary/80 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors text-left">Confirm Protocol</span>
                <span className="text-lg sm:text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(242,185,13,0.6)] transition-all uppercase">
                    {isSigningOrPending ? "Syncing..." : "SEAL VAULT"}
                </span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-primary/50 bg-primary/10 flex items-center justify-center shadow-neon group-hover:bg-primary group-hover:text-black transition-all duration-300">
                <span className="material-icons text-xl sm:text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
              </div>
            </div>
          </button>
          <div className="text-center mt-6">
            <a
              href="https://faucet.staging.midl.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 border border-primary/20 rounded text-primary/60 hover:text-primary hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/10"
            >
              <span className="material-icons text-xs">local_gas_station</span>
              Refuel BTC
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
