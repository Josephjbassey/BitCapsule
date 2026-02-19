"use client";

import React from "react";
import { LockMechanism } from "@/components/ui/vault/LockMechanism";
import { DepositForm } from "@/components/ui/vault/DepositForm";

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
  label: string;
  setLabel: (lbl: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  handleMint: () => void;
  isSigningOrPending: boolean;
  fileInfo: { name: string; size: number } | null;
  setFileInfo: (info: { name: string; size: number } | null) => void;
}

export default function VaultCreation(props: VaultCreationProps) {
  return (
    <div className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 md:px-6 py-12 md:py-20 w-full max-w-7xl mx-auto overflow-x-hidden min-h-full">
      {/* Left Panel: The Lock Mechanism */}
      <LockMechanism />

      {/* Right Panel: Data Terminal */}
      <div className="w-full md:w-1/2 max-w-lg relative z-10">
        <DepositForm {...props} />
      </div>
    </div>
  );
}
