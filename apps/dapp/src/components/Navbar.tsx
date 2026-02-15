"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEVMAddress } from "@midl/executor-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@midl/satoshi-kit";

export default function Navbar() {
  const pathname = usePathname();
  const address = useEVMAddress();
  const { isConnected } = useAccount();

  return (
    <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-background-dark/50">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse group-hover:bg-primary/30 transition-colors">
          <span className="material-icons text-primary text-sm">hourglass_empty</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">BitCapsule</h1>
          <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">SECURE CHANNEL V.4.1.0</span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-all hover:text-primary ${pathname === "/" ? "text-primary border-b border-primary pb-1" : "text-gray-400"}`}
        >
          Create
        </Link>
        <Link
          href="/archive"
          className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-all hover:text-primary ${pathname === "/archive" ? "text-primary border-b border-primary pb-1" : "text-gray-400"}`}
        >
          Archive
        </Link>
        <Link
          href="/stats"
          className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-all hover:text-primary ${pathname === "/stats" ? "text-primary border-b border-primary pb-1" : "text-gray-400"}`}
        >
          Stats
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {isConnected && address && (
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-primary/70 uppercase tracking-widest text-[8px]">Linked Address</span>
            <span className="text-primary font-bold uppercase font-mono text-[10px]">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        )}
        <ConnectButton />
      </div>
    </header>
  );
}
