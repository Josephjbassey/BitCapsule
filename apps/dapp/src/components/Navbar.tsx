"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEVMAddress } from "@midl/executor-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@midl/satoshi-kit";

export default function Navbar() {
  const pathname = usePathname();
  const address = useEVMAddress();
  const { isConnected } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "/", label: "Create" },
    { href: "/archive", label: "Archive" },
    { href: "/stats", label: "Stats" },
  ];

  return (
    <header className="relative z-50 w-full border-b border-primary/20 backdrop-blur-sm bg-background-dark/50">
      <div className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse group-hover:bg-primary/30 transition-colors">
            <span className="material-icons text-primary text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">BitCapsule</h1>
            <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">SECURE CHANNEL V.4.1.0</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-all hover:text-primary ${pathname === link.href ? "text-primary border-b border-primary pb-1" : "text-gray-400"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-4">
            {isConnected && address && (
              <div className="flex flex-col items-end">
                <span className="text-primary/70 uppercase tracking-widest text-[8px]">Linked Address</span>
                <span className="text-primary font-bold uppercase font-mono text-[10px]">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
            )}
          </div>
          <div className="scale-90 md:scale-100">
            <ConnectButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden text-primary p-1"
            aria-label="Toggle Menu"
          >
            <span className="material-icons">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background-dark/95 border-b border-primary/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-xs tracking-[0.3em] uppercase font-bold transition-all ${pathname === link.href ? "text-primary" : "text-gray-400"}`}
              >
                {link.label}
              </Link>
            ))}
            {isConnected && address && (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
                <span className="text-primary/70 uppercase tracking-widest text-[8px]">Linked Address</span>
                <span className="text-primary font-bold uppercase font-mono text-xs">{address}</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
