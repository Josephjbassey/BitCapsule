"use client";

import { useState, useEffect } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction, useSendBTCTransactions } from "@midl/executor-react";
import { useWaitForTransaction, useAddNetwork } from "@midl/react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import { ConnectButton } from "@midl/satoshi-kit";
import * as TimeCapsule from "@/shared/contracts/TimeCapsule";
import { encodeFunctionData, zeroAddress, isAddress, parseEther } from "viem";
import SuccessOverlay from "@/components/SuccessOverlay";
import TemporalSyncOverlay from "@/components/TemporalSyncOverlay";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import Navbar from "@/components/Navbar";

// Import Screens
import VaultCreation, { VaultType } from "@/components/screens/VaultCreation";
import VaultArchive from "@/components/screens/VaultArchive";
import UnlockProcess from "@/components/screens/UnlockProcess";

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();
  const { addNetworkAsync } = useAddNetwork();
  const publicClient = usePublicClient();

  // Diagnostics
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== 'undefined') {
      console.log("[BitCapsule] Connection State:", { isConnected, address });
    }
  }, [isConnected, address]);

  // Handle network auto-switch on connection
  useEffect(() => {
    if (isConnected && connectors) {
      const activeConnector = connectors.find(c => c.name.toLowerCase().includes("xverse"));
      if (activeConnector) {
        addNetworkAsync({
          connectorId: activeConnector.id,
          networkConfig: {
            chainId: 420,
            chainName: "MIDL Regtest",
            rpcUrls: ["https://rpc.staging.midl.xyz"],
            nativeCurrency: { name: "Bitcoin", symbol: "BTC", decimals: 18 },
            blockExplorerUrls: ["https://blockscout.staging.midl.xyz"],
          }
        } as any).catch(err => console.warn("Auto network switch failed", err));
      }
    }
  }, [isConnected, connectors, addNetworkAsync]);

  // State
  const [view, setView] = useState<'creation' | 'archive'>('creation');
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [vaultType, setVaultType] = useState<VaultType>(VaultType.TEMPORAL);
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockTimeDays, setUnlockTimeDays] = useState(365); // Default 1 year

  const [isMinting, setIsMinting] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [unlockStatus, setUnlockStatus] = useState<'none' | 'penalty' | 'success'>('none');

  const isSigningOrPending = isMinting || isBroadcasting || isWithdrawing || isClaiming;

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    if (!publicClient) return;
    try {
      const logs = await publicClient.getLogs({
        address: TimeCapsule.address as `0x${string}`,
        event: {
            type: 'event',
            name: 'CapsuleCreated',
            inputs: [
                { type: 'uint256', name: 'id', indexed: true },
                { type: 'address', name: 'owner', indexed: true },
                { type: 'address', name: 'token' },
                { type: 'uint256', name: 'amount' },
                { type: 'uint256', name: 'unlockTime' },
                { type: 'address', name: 'beneficiary' },
                { type: 'uint8', name: 'vaultType' },
                { type: 'string', name: 'message' }
            ]
        },
        fromBlock: 'earliest'
      });
      setHistory(logs);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    if (isConnected && publicClient) {
      fetchHistory();
    }
  }, [isConnected, publicClient]);

  const handleMint = async () => {
    if (!message || !amount || !isConnected || isMinting) {
      if (!amount && isConnected) toast.error("Please enter an amount");
      return;
    }

    if (vaultType === VaultType.SOCIAL && !isAddress(beneficiary)) {
      toast.error("Please enter a valid EVM beneficiary address");
      return;
    }

    if (!address) {
      toast.error("Wallet address not found. Please reconnect.");
      return;
    }

    let targetBeneficiary: `0x${string}` = address as `0x${string}`;

    if (vaultType === VaultType.SOCIAL || vaultType === VaultType.LEGACY) {
      if (!beneficiary || beneficiary === zeroAddress) {
        toast.error("Beneficiary is required for Social and Legacy vaults.");
        return;
      }
      if (!isAddress(beneficiary)) {
        toast.error("Invalid beneficiary address format.");
        return;
      }
      targetBeneficiary = beneficiary as `0x${string}`;
    }

    setIsMinting(true);
    try {
      const amountInWei = parseEther(amount);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + unlockTimeDays * 24 * 60 * 60);

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            value: amountInWei,
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "createCapsule",
              args: [
                zeroAddress,
                amountInWei,
                unlockTimestamp,
                targetBeneficiary as `0x${string}`,
                vaultType,
                message
              ],
            }),
          },
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({
        intention,
        txId: tx.id,
      });

      setIsBroadcasting(true);
      const txHashes = await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });

      if (txHashes && txHashes.length > 0) {
        await waitForTransactionAsync({ txId: tx.id });
        setSuccessTxHash(txHashes[0]);
        setMessage("");
        setAmount("");
        fetchHistory();
      }
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Transaction failed");
      setSuccessTxHash(null);
    } finally {
      setIsMinting(false);
      setIsBroadcasting(false);
    }
  };

  const handleWithdrawEarly = async (id: bigint) => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    setUnlockStatus('penalty');
    try {
      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: "withdrawEarly",
              args: [id],
            }),
          },
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
      setIsBroadcasting(true);
      await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      await waitForTransactionAsync({ txId: tx.id });
      toast.success("Early withdrawal successful!");
      fetchHistory();
      setUnlockStatus('none');
    } catch (e: any) {
      console.error("Withdrawal failed", e);
      toast.error(e.message || "Withdrawal failed");
      setUnlockStatus('none');
    } finally {
      setIsWithdrawing(false);
      setIsBroadcasting(false);
    }
  };

  const handleClaim = async (id: bigint, useLegacy: boolean) => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: TimeCapsule.address as `0x${string}`,
            data: encodeFunctionData({
              abi: TimeCapsule.abi,
              functionName: useLegacy ? "claimLegacy" : "claim",
              args: [id],
            }),
          },
        },
        reset: true,
      });

      const { tx } = await finalizeBTCTransactionAsync();
      const signedTransaction = await signIntentionAsync({ intention, txId: tx.id });
      setIsBroadcasting(true);
      await sendBTCTransactionsAsync({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
      await waitForTransactionAsync({ txId: tx.id });
      toast.success("Payload claimed successfully!");
      fetchHistory();
      setUnlockStatus('success');
    } catch (e: any) {
      console.error("Claim failed", e);
      toast.error(e.message || "Claim failed");
    } finally {
      setIsClaiming(false);
      setIsBroadcasting(false);
    }
  };

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <BackgroundEffects />
        <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center border border-primary shadow-neon">
              <span className="material-icons text-primary text-3xl">hourglass_empty</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase glow-text">BitCapsule</h1>
            <p className="text-primary/60 font-mono tracking-widest text-xs uppercase">SECURE CHANNEL V.4.1.0</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">Secure your legacy on the Bitcoin timeline.</h2>
            <div className="p-1 rounded-lg bg-gradient-to-r from-primary/50 via-bitcoin-gold/50 to-primary/50">
               <div className="bg-background-dark rounded-md p-4">
                 <ConnectButton />
               </div>
            </div>
          </div>

          <div className="pt-12">
            <a
              href="https://faucet.staging.midl.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary/30 rounded-full text-primary/80 hover:text-white hover:border-primary transition-all text-[10px] font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/20"
            >
              Access MIDL Faucet
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-grow w-full h-full overflow-hidden animate-in fade-in duration-700">
        {view === 'creation' ? (
          <VaultCreation
            vaultType={vaultType}
            setVaultType={setVaultType}
            beneficiary={beneficiary}
            setBeneficiary={setBeneficiary}
            unlockTimeDays={unlockTimeDays}
            setUnlockTimeDays={setUnlockTimeDays}
            message={message}
            setMessage={setMessage}
            amount={amount}
            setAmount={setAmount}
            handleMint={handleMint}
            isSigningOrPending={isSigningOrPending}
          />
        ) : (
          <VaultArchive
            history={history}
            currentTime={currentTime}
            handleWithdrawEarly={handleWithdrawEarly}
            handleClaim={handleClaim}
            address={address}
            isSigningOrPending={isSigningOrPending}
            onNavigateBack={() => setView('creation')}
          />
        )}
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-obsidian/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Legacy Protocol v1.2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Dead Man's Switch Active</span>
        </div>
        <div className="mt-2 md:mt-0 font-mono uppercase">
          ID: <span className="text-primary/60">XJ-9200-ALPHA</span> {'//'} Node: <span className="text-green-500/60">Verified</span>
        </div>
      </footer>

      {successTxHash && (
        <SuccessOverlay
          txHash={successTxHash}
          onClose={() => setSuccessTxHash(null)}
          onRefresh={fetchHistory}
        />
      )}

      {unlockStatus !== 'none' && (
        <UnlockProcess
          status={unlockStatus}
          onClose={() => setUnlockStatus('none')}
          txHash={successTxHash || undefined}
        />
      )}

      {isSigningOrPending && unlockStatus === 'none' && <TemporalSyncOverlay />}
    </div>
  );
}
