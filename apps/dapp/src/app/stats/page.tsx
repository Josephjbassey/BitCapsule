"use client";

import React from "react";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";
import TemporalDrift from "@/components/screens/TemporalDrift";

export default function StatsPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full h-full overflow-y-auto">
        <TemporalDrift />
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="uppercase font-mono">Analytics Module v0.1-alpha</span>
        </div>
      </footer>
    </div>
  );
}
