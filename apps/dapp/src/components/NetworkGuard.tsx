"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useChainId } from "wagmi";
import { useAddNetwork } from "@midl/react";
import { toast } from "sonner";

export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { connectors } = useConnect();
  const { addNetworkAsync } = useAddNetwork();
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    const handleNetworkSwitch = async () => {
      // MIDL Regtest Chain ID is 420
      if (isConnected && chainId !== 420) {
        if (!hasNotified) {
           toast.warning("Incompatible Network Detected", {
             description: "Attempting auto-sync with MIDL Regtest Protocol...",
             duration: 5000
           });
           setHasNotified(true);
        }

        const activeConnector = connector || connectors.find(c => ["xverse", "leather", "unisat", "phantom", "okx"].some(name => c.name.toLowerCase().includes(name)));

        if (activeConnector) {
          try {
            console.log("[BitCapsule] Guard: Switching to MIDL Regtest (420)...");
            await addNetworkAsync({
              connectorId: activeConnector.id,
              networkConfig: {
                chainId: 420,
                chainName: "MIDL Regtest",
                rpcUrls: ["https://rpc.staging.midl.xyz"],
                nativeCurrency: { name: "Bitcoin", symbol: "BTC", decimals: 18 },
                blockExplorerUrls: ["https://blockscout.staging.midl.xyz"],
              }
            } as any);
            toast.success("Synchronized with MIDL Regtest");
          } catch (err: any) {
            console.warn("[BitCapsule] Guard: Switch failed", err);
            // On mobile, this often fails if the wallet app is not in the foreground or doesn't support auto-switch
          }
        }
      } else if (isConnected && chainId === 420) {
        if (hasNotified) {
           toast.success("Protocol Secure: MIDL Regtest Active");
           setHasNotified(false);
        }
      }
    };

    handleNetworkSwitch();
  }, [isConnected, chainId, connector, connectors, addNetworkAsync, hasNotified]);

  return <>{children}</>;
}
