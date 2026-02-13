"use client";

import React from "react";

export default function TemporalSyncOverlay() {
  return (
    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center text-white backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-primary font-mono tracking-widest animate-pulse">PROCESSING...</p>
      </div>
    </div>
  );
}
