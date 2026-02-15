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
      <div className="px-4 md:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse group-hover:bg-primary/30 transition-colors">
            <span className="material-icons text-primary text-xs md:text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-bold tracking-widest leading-none glow-text uppercase">BitCapsule</h1>
            <span className="text-[8px] md:text-[10px] text-primary/60 tracking-[0.2em] uppercase hidden sm:block">SECURE CHANNEL V.4.1.0</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 mx-4">
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

        <div className="flex items-center gap-2 md:gap-4">
          {isConnected && address && (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-primary/70 uppercase tracking-widest text-[8px]">Linked Address</span>
              <span className="text-primary font-bold uppercase font-mono text-[10px]">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
          )}

          <div className="scale-75 sm:scale-90 md:scale-100 origin-right">
            <ConnectButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden text-primary p-1 hover:bg-white/5 rounded transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-icons">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background-dark/98 border-b border-primary/20 backdrop-blur-2xl animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm tracking-[0.3em] uppercase font-bold transition-all ${pathname === link.href ? "text-primary" : "text-gray-400"}`}
              >
                {link.label}
              </Link>
            ))}
            {isConnected && address && (
              <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                <span className="text-primary/70 uppercase tracking-widest text-[10px]">Linked Address</span>
                <span className="text-primary font-bold uppercase font-mono text-xs break-all shadow-neon p-2 bg-white/5 rounded-sm">{address}</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
