"use client";

import React, { useState } from "react";
import { useAddNetwork } from "@midl/react";
import { toast } from "sonner";

export const NetworkScout = () => {
    const { addNetwork, status } = useAddNetwork();
    const [isHovering, setIsHovering] = useState(false);

    const handleAddNetwork = () => {
        try {
            addNetwork({
                connectorId: "xverse", // Targeting Xverse as per Vibehack guide
                networkConfig: {
                    name: "MIDL Regtest",
                    network: "regtest",
                    rpcUrl: "https://rpc.staging.midl.xyz",
                    indexerUrl: "https://mempool.staging.midl.xyz",
                },
            });
            toast.info("Requesting network switch...");
        } catch (err) {
            console.error("Failed to add network:", err);
            toast.error("Failed to trigger network switch");
        }
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                type="button"
                onClick={handleAddNetwork}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-primary/30 rounded text-[10px] font-mono text-primary/80 hover:text-primary hover:border-primary/80 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
            >
                <div className={`w-1.5 h-1.5 rounded-full bg-primary ${isHovering ? 'animate-ping' : ''}`}></div>
                <span className="tracking-widest uppercase">
                    {status === 'pending' ? 'CALIBRATING...' : 'CALIBRATE NETWORK'}
                </span>
                <span className="material-icons text-[10px] group-hover:rotate-90 transition-transform">
                    settings_input_antenna
                </span>
            </button>

            {/* Tooltip-like helper */}
            <div className={`absolute top-full right-0 mt-2 w-48 p-2 bg-black/80 border border-white/10 rounded text-[9px] text-gray-400 font-mono transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                Required for Xverse Regtest connection.
            </div>
        </div>
    );
};
