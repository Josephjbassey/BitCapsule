"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { toast } from "sonner";
import Wallet from "sats-connect";

export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    const handleNetworkSync = async () => {
      if (!isConnected || isConnecting) return;

      try {
        // 1. Check EVM Chain ID (420 for MIDL Regtest)
        if (chainId !== 420) {
           if (!hasNotified) {
              toast.warning("Protocol Mismatch", {
                description: "EVM chain is not MIDL Regtest (420). Please switch in your wallet.",
                duration: 3000
              });
              setHasNotified(true);
           }
        }

        // 2. Check Bitcoin Network via sats-connect
        const res = await Wallet.request('wallet_getNetwork', null);
        if (res.status === 'success') {
          const btcNetwork = res.result.bitcoin?.name;
          if (btcNetwork !== 'Regtest') {
            console.warn("[BitCapsule] Bitcoin network is not Regtest:", btcNetwork);
            // We don't necessarily want to force a toast here if EVM is right,
            // but for BitCapsule, Regtest is required.
          }
        }
      } catch (err) {
        console.error("[BitCapsule] Network sync check failed:", err);
      }
    };

    handleNetworkSync();
  }, [isConnected, chainId, hasNotified]);

  return <>{children}</>;
}
