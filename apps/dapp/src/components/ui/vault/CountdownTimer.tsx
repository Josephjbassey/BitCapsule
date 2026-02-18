"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  unlockTimestamp: number;
}

export const CountdownTimer = ({ unlockTimestamp }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = unlockTimestamp - now;

      if (diff <= 0) {
        setTimeLeft("READY");
        return;
      }

      const days = Math.floor(diff / (24 * 3600));
      const hours = Math.floor((diff % (24 * 3600)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) {
        setTimeLeft(`${days}D ${hours}H ${minutes}M`);
      } else {
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [unlockTimestamp]);

  return (
    <div className="flex items-center gap-1">
      <span className="material-icons text-[10px] animate-pulse">timer</span>
      <span className="text-[10px] font-mono font-bold tracking-tighter text-primary">
        {timeLeft}
      </span>
    </div>
  );
};
