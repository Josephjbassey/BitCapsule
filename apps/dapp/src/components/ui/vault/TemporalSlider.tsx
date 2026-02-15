"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";

interface TemporalSliderProps {
    value: number; // Value in seconds (duration)
    onChange: (value: number) => void;
    min: number; // Minimum duration in seconds
    max: number; // Maximum duration in seconds
}

export const TemporalSlider = ({ value, onChange, min, max }: TemporalSliderProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate position percentage based on value with guard for zero division
    const percentage = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    // Calculate current target date based on duration
    const targetDate = new Date(Date.now() + value * 1000);
    const targetYear = targetDate.getFullYear();

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        if (seconds < 31536000) return `${Math.floor(seconds / 86400)}d`;
        return `${Math.floor(seconds / 31536000)}y`;
    };

    const labels = useMemo(() => {
        const steps = 5;
        const result = [];
        for (let i = 0; i < steps; i++) {
            const val = min + ((max - min) * i) / (steps - 1);
            result.push({
                val,
                label: formatDuration(Math.round(val))
            });
        }
        return result;
    }, [min, max]);

    const handleInteract = useCallback((clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newPercentage = x / rect.width;
        const newValue = Math.round(min + newPercentage * (max - min));
        onChange(newValue);
    }, [min, max, onChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteract(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleInteract(e.touches[0].clientX);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const step = (max - min) / 100; // 1% step
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            onChange(Math.min(max, value + step));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            onChange(Math.max(min, value - step));
        } else if (e.key === "Home") {
            onChange(min);
        } else if (e.key === "End") {
            onChange(max);
        } else if (e.key === "PageUp") {
            onChange(Math.min(max, value + step * 10));
        } else if (e.key === "PageDown") {
            onChange(Math.max(min, value - step * 10));
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleInteract(e.clientX);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                handleInteract(e.touches[0].clientX);
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleInteract]);

    return (
        <div className="space-y-4 pt-4 pb-2">
            <div className="flex justify-between items-end">
                <label id="temporal-slider-label" className="text-xs tracking-wider text-primary/80 uppercase font-semibold">
                    Temporal Coordinates
                </label>
                <span className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    {targetYear} <span className="text-xs text-gray-400 font-normal">A.D.</span>
                </span>
            </div>
            <div
                className="relative h-12 flex items-center select-none cursor-pointer group outline-none"
                ref={trackRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onKeyDown={handleKeyDown}
                role="slider"
                tabIndex={0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-labelledby="temporal-slider-label"
                aria-label="Select lock duration"
            >
                {/* Track Background */}
                <div className="absolute w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {/* Ticks */}
                <div className="absolute w-full flex justify-between px-1 pointer-events-none opacity-50">
                    <div className="h-2 w-[1px] bg-gray-600" />
                    <div className="h-2 w-[1px] bg-gray-600" />
                    <div className="h-2 w-[1px] bg-gray-600" />
                    <div className="h-2 w-[1px] bg-gray-600" />
                    <div className="h-2 w-[1px] bg-gray-600" />
                </div>
                {/* Thumb/Knob */}
                <div
                    className="absolute w-6 h-6 bg-background-dark border-2 border-primary rounded-full shadow-neon z-10 flex items-center justify-center transform -translate-x-1/2 group-hover:scale-110 transition-transform"
                    style={{ left: `${percentage}%` }}
                >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                {labels.map((item, i) => (
                    <span
                        key={i}
                        className={cn(
                            Math.abs(item.val - value) < (max - min) / 10 ? "text-primary/70" : ""
                        )}
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
};
