"use client";

import { useState, useEffect } from "react";
import { useEVMAddress, useAddTxIntention, useSignIntention, useFinalizeBTCTransaction } from "@midl/executor-react";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import * as Vault from "@/shared/contracts/Vault";
import { encodeFunctionData } from "viem";

export default function Home() {
  const { isConnected } = useAccount();
  const address = useEVMAddress();
  const { connectors, connect } = useConnect();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const publicClient = usePublicClient();

  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!publicClient || !isConnected) return;

    const fetchHistory = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: Vault.address,
          event: {
            type: 'event',
            name: 'Deposit',
            inputs: [
              { indexed: true, name: 'user', type: 'address' },
              { indexed: true, name: 'token', type: 'address' },
              { indexed: false, name: 'amount', type: 'uint256' }
            ]
          },
          fromBlock: BigInt(0),
        });
        // Sort by block number descending
        const sortedLogs = [...logs].sort((a, b) =>
          Number((b.blockNumber || BigInt(0)) - (a.blockNumber || BigInt(0)))
        );
        setHistory(sortedLogs);
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };

    fetchHistory();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [publicClient, isConnected]);

  const handleMint = async () => {
    if (!message) return;
    try {
      // Utilizing the message to derive a dummy amount for the demo
      const amount = BigInt(message.length);

      const intention = await addTxIntentionAsync({
        intention: {
          evmTransaction: {
            to: Vault.address,
            data: encodeFunctionData({
              abi: Vault.abi,
              functionName: "deposit",
              args: [Vault.address, amount],
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

      await publicClient?.sendBTCTransactions({
        serializedTransactions: [signedTransaction],
        btcTransaction: tx.hex,
      });
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  const xverseConnector = connectors.find(c => c.name.toLowerCase().includes("xverse"));

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark text-gray-100 min-h-screen w-full flex flex-col relative font-display overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-40 transform perspective-1000 rotate-x-12 scale-110"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-bitcoin-orange rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary rounded-full opacity-40 animate-float"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-bitcoin-orange/50 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bitcoin-orange/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-bitcoin-orange/80">
              <span className="material-icons text-sm animate-pulse">wifi_tethering</span>
              <span className="text-xs tracking-[0.2em] font-bold uppercase">TimeVibe // Secure Link v.3.1.0</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>ENCRYPTION: AES-256</span>
              <span className="text-bitcoin-orange">BITCOIN MAINNET ACTIVE</span>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center relative">
            <div className="text-center mb-12 relative z-20">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Authenticate Identity
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-bitcoin-orange to-transparent mx-auto mt-4 animate-pulse"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-24">
              <div className="relative group cursor-pointer">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-bitcoin-orange/30 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border border-bitcoin-orange/50 animate-spin-slow"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-b from-[#3a2010] to-[#1a0e0d] rounded-full border border-bitcoin-orange flex items-center justify-center shadow-neon">
                    <span className="material-icons text-bitcoin-orange text-4xl animate-pulse">fingerprint</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => xverseConnector && connect({ connector: xverseConnector })}
                className="xverse-card w-full md:w-80 p-1 rounded-2xl group relative overflow-hidden bg-black border border-white/5 hover:border-bitcoin-orange/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-orange/40 via-transparent to-bitcoin-orange/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-[#0a0a0c] rounded-xl p-8 flex flex-col items-center justify-center gap-6 h-full transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-xverse-orange/40 group-hover:border-xverse-orange transition-colors shadow-neon">
                    <span className="material-symbols-outlined text-4xl text-xverse-orange">currency_bitcoin</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-widest group-hover:text-bitcoin-orange transition-colors uppercase">Xverse</h3>
                    <p className="text-xs text-bitcoin-orange font-mono font-medium">Bitcoin Web3 Wallet</p>
                  </div>
                </div>
              </button>
            </div>
          </main>

          <footer className="flex justify-between items-end mt-8">
            <p className="text-gray-500 text-[10px] font-mono uppercase">
              Node: <span className="text-bitcoin-orange">Verified</span> // ID: TV-4491-Ω
            </p>
            <p className="text-gray-500 text-[10px] font-mono max-w-xs text-right">
              By connecting, you agree to the <span className="text-bitcoin-orange cursor-pointer">Temporal Terms</span>.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0"></div>
      <div className="scanline"></div>

      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-obsidian/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse">
            <span className="material-icons text-primary text-sm">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest leading-none glow-text uppercase">TimeVibe</h1>
            <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">Secure Channel V.2.0</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-primary/70">ENCRYPTION</span>
            <span className="text-green-400 font-bold uppercase">Quantum-256</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-primary/70 uppercase">Address</span>
            <span className="text-primary font-bold uppercase font-mono">{address}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-reverse"></div>
            <div className="absolute inset-12 rounded-full border border-primary/30 bg-obsidian/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
              <img alt="Vault core" className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvp6ARoUsE7ll4bSnvXa5_py9g5qGQVp98jVr6EVbZdGU9SbB2Drz6NpQnj2xkbjwKoudv-PJ7elemYUR3IrIwSyQfDdba5_em0Y6815By_SgLK-UbienHRzGWeex8ssVlRpy9UENyxOSpJquFsQ39mKOC-UpS5k43z9vyCCq5UhNju0S2hwr2wvXukoT3pujQIurKhX6jdz5WAheiUIx3MP_yY35P-aBKwp2TYlMEykCZFy-5o71EyQxltig9VfrCJPQxRHsQEA" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute w-32 h-32 bg-obsidian rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10">
              <span className="material-icons text-6xl text-primary drop-shadow-[0_0_15px_rgba(52,132,244,1)]">lock</span>
            </div>

            <div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce"></div>
            <div className="absolute top-20 -left-12 w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse"></div>
            <div className="absolute bottom-10 right-0 w-1.5 h-1.5 bg-bitcoin-gold rounded-full blur-[1px] animate-pulse"></div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-xs tracking-[0.3em] uppercase">System Armed</p>
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Temporal Vault</h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-lg relative">
          <div className="bg-obsidian-light/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg"></div>

            <div className="p-6 md:p-8 space-y-8 bg-cyber-grid bg-[length:10px_10px]">
              <div className="space-y-3">
                <label className="flex justify-between text-xs tracking-wider text-primary/80 uppercase font-semibold">
                  <span>Input Stream</span>
                  <span className="animate-pulse">_Ready</span>
                </label>
                <div className="relative group">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 bg-obsidian border border-primary/40 rounded-lg p-4 text-gray-300 font-display text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-primary/30 resize-none leading-relaxed"
                    placeholder="Initializing encryption... Write to your future self..."
                  />
                  <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary shadow-[0_0_10px_rgba(52,132,244,1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleMint}
                  className="relative w-full group overflow-hidden rounded-lg bg-obsidian-light border border-bitcoin-gold/30 hover:border-bitcoin-gold/80 transition-all duration-300"
                >
                  <div className="absolute inset-0 circuit-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative flex items-center justify-between px-6 py-5">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-bitcoin-gold/80 uppercase tracking-widest mb-1 group-hover:text-bitcoin-gold transition-colors">Confirm Protocol</span>
                      <span className="text-xl font-bold text-white tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(247,147,26,0.6)] transition-all uppercase">Seal Vibe</span>
                    </div>
                    <div className="w-12 h-12 rounded-lg border border-bitcoin-gold/50 bg-bitcoin-gold/10 flex items-center justify-center shadow-gold-glow group-hover:bg-bitcoin-gold group-hover:text-black transition-all duration-300">
                      <span className="material-icons text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform">send</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bitcoin-gold/50"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-obsidian/80 backdrop-blur-md">
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Privacy Protocol V2</span>
          <span className="hover:text-primary cursor-pointer transition-colors uppercase">Terms of Engagement</span>
        </div>
        <div className="mt-2 md:mt-0 font-mono uppercase">
          ID: <span className="text-primary/60">XJ-9200-ALPHA</span> // Node: <span className="text-green-500/60">Verified</span>
        </div>
      </footer>

      {/* Archive Section */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-obsidian/80 border border-primary/20 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex justify-between items-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="material-icons text-xs animate-pulse">history</span>
              Temporal Archive Feed
            </span>
            <span className="text-[10px] font-mono text-primary/60 uppercase">
              Status: Connected // {history.length} Data Blocks
            </span>
          </div>

          <div className="h-64 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none scanline opacity-5"></div>
            {history.length === 0 ? (
              <div className="text-primary/40 text-center py-10 animate-pulse uppercase tracking-[0.2em]">
                _Waiting for incoming transmissions...
              </div>
            ) : (
              history.map((log, i) => (
                <div key={log.transactionHash || i} className="border-l-2 border-primary/30 pl-4 py-2 hover:bg-primary/5 transition-colors group relative">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-primary font-bold uppercase tracking-wider">
                      [Block {log.blockNumber?.toString()}] Vibe Sealed
                    </span>
                    <a
                      href={`https://blockscout.staging.midl.xyz/tx/${log.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary/40 hover:text-primary transition-colors text-[10px] flex items-center gap-1"
                    >
                      EXPLORER <span className="material-icons text-[10px]">open_in_new</span>
                    </a>
                  </div>
                  <div className="text-gray-400 leading-relaxed break-all">
                    MSG: Future self, I sealed a temporal vibe of {log.args.amount?.toString()} units. Stay wild.
                  </div>
                  <div className="mt-1 text-[10px] text-primary/60 flex justify-between">
                    <span>SENDER: {log.args.user?.slice(0, 6)}...{log.args.user?.slice(-4)}</span>
                    <span>TX: {log.transactionHash?.slice(0, 10)}...</span>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                </div>
              ))
            )}
          </div>

          {/* Decorative Terminal Footer */}
          <div className="bg-black/40 px-4 py-1 text-[8px] font-mono text-primary/30 uppercase flex justify-between">
            <span>Buffer: 100% // Stream: Encrypted</span>
            <span>Ref_ID: XJ-ARCHIVE-LINK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
