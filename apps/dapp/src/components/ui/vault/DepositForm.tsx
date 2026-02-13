"use client";

import { TemporalSlider } from "@/components/ui/vault/TemporalSlider";
import { useState } from "react";
import { VaultCard, VaultButton } from "@/components/ui/vault";
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from "wagmi";
import { vaultAbi } from "@/lib/abi";
import { addresses } from "@/lib/constants";
import { toast } from "sonner";
import { parseUnits, isAddress, erc20Abi } from "viem";

export const DepositForm = () => {
    const [duration, setDuration] = useState(31536000); // 1 year in seconds
    const [amount, setAmount] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const [message, setMessage] = useState("");

    const { writeContractAsync, isPending } = useWriteContract();
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleDurationChange = (newDuration: number) => {
        setDuration(newDuration);
    };

    const handleDeposit = async (msg: string) => {
        if (!amount || !tokenAddress) {
            toast.error("Please enter amount and token address");
            return;
        }

        if (!isAddress(tokenAddress)) {
            toast.error("Invalid token address");
            return;
        }

        try {
            // Fetch decimals dynamically
            let decimals = 18;
            try {
                if (publicClient) {
                    decimals = await publicClient.readContract({
                        address: tokenAddress as `0x${string}`,
                        abi: erc20Abi,
                        functionName: "decimals",
                    });
                }
            } catch (err) {
                console.warn("Failed to fetch decimals, defaulting to 18", err);
                toast.warning("Could not fetch token decimals, defaulting to 18");
            }

            const amountInWei = parseUnits(amount, decimals);

            // Check allowance
            if (publicClient && address) {
                const allowance = await publicClient.readContract({
                    address: tokenAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: "allowance",
                    args: [address, addresses.vault as `0x${string}`],
                });

                if (allowance < amountInWei) {
                    toast.info("Approving token allowance...");
                    const approveHash = await writeContractAsync({
                        address: tokenAddress as `0x${string}`,
                        abi: erc20Abi,
                        functionName: "approve",
                        args: [addresses.vault as `0x${string}`, amountInWei],
                    });
                    await publicClient.waitForTransactionReceipt({ hash: approveHash });
                    toast.success("Allowance approved!");
                }
            }

            const txHash = await writeContractAsync({
                address: addresses.vault as `0x${string}`,
                abi: vaultAbi,
                functionName: "depositWithLock",
                args: [
                    tokenAddress as `0x${string}`,
                    amountInWei,
                    BigInt(duration),
                    msg
                ],
            });
            setHash(txHash);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to initiate deposit");
        }
    };

    return (
        <VaultCard>
             <div className="space-y-3 mb-4">
                <label className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                    <span>Asset Details</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="token-address" className="sr-only">Token Address</label>
                        <input
                            id="token-address"
                            type="text"
                            placeholder="Token Address (0x...)"
                            className="bg-obsidian border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="amount" className="sr-only">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Amount"
                            className="bg-obsidian border border-primary/40 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-primary"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="input-stream" className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                    <span>Input Stream</span>
                    <span className="animate-pulse">_Ready</span>
                </label>
                <div className="relative group">
                    <textarea
                        id="input-stream"
                        className="w-full h-32 bg-obsidian border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                        placeholder="Initializing encryption... Write to your future self..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(52,132,244,1)] opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <TemporalSlider
                value={duration}
                onChange={handleDurationChange}
                min={60}
                max={3153600000}
            />

            <div className="pt-4">
                <VaultButton
                    onClick={() => handleDeposit(message)}
                    disabled={isPending || isConfirming}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-bitcoin-gold/80 uppercase tracking-widest mb-1 group-hover:text-bitcoin-gold transition-colors">
                            {isPending ? "Confirming..." : isConfirming ? "Sealing..." : "Confirm Protocol"}
                        </span>
                        <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all">
                            SEAL VIBE
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-lg border border-bitcoin-gold/50 bg-bitcoin-gold/10 flex items-center justify-center shadow-gold-glow group-hover:bg-bitcoin-gold group-hover:text-black transition-all duration-300">
                        <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">
                            send
                        </span>
                    </div>
                </VaultButton>
                <div className="text-center mt-3">
                    <span className="text-[10px] text-red-400/70 tracking-widest uppercase flex items-center justify-center gap-1">
                        <span className="material-icons text-[10px]">warning</span>
                        Irreversible Action
                    </span>
                </div>
            </div>
        </VaultCard>
    );
};
