"use client";

import React from "react";

export const LockMechanism = () => {
  return (
    <div className="w-full lg:w-5/12 flex flex-col items-center justify-center relative group perspective-1000">
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-reverse"></div>

        {/* Middle Ring with Glow */}
        <div className="absolute inset-8 sm:inset-12 rounded-full border border-primary/30 bg-background-dark/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.15)_0%,transparent_70%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
        </div>

        {/* Core Lock */}
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-background-dark rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110">
          <span className="material-icons text-4xl sm:text-6xl text-primary drop-shadow-[0_0_15px_rgba(242,185,13,1)] gold-glow">lock</span>
        </div>

        {/* Holographic projection lines */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform -rotate-45"></div>

        {/* Floating elements */}
        <div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce"></div>
        <div className="absolute bottom-10 -left-12 w-1.5 h-1.5 bg-primary rounded-full blur-[1px] animate-pulse"></div>
      </div>
      <div className="mt-8 text-center space-y-2">
        <p className="text-primary/60 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1">System Armed</p>
        <h3 className="text-white text-xl sm:text-2xl font-black tracking-widest uppercase glow-text">Temporal Barrier</h3>
      </div>
    </div>
  );
};
