"use client";

import { EXPLORER_BASE_URL, BTC_EXPLORER_BASE_URL } from "@/app/config";

interface SuccessOverlayProps {
  txHash: string;
  btcTxHash?: string;
  onClose: () => void;
  onRefresh: () => void;
}

export default function SuccessOverlay({ txHash, btcTxHash, onClose, onRefresh }: SuccessOverlayProps) {
  const handleReturn = () => {
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background-dark text-white font-display overflow-hidden">
        <div className="fixed inset-0 grid-bg opacity-30 transform perspective-1000 rotate-x-12 scale-110 pointer-events-none"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(242,185,13,0.05)_0%,rgba(0,0,0,1)_90%)] pointer-events-none"></div>

        <div className="relative max-w-2xl w-full glass-panel rounded-3xl p-8 md:p-12 overflow-hidden border border-primary/20 flex flex-col items-center text-center animate-in zoom-in fade-in duration-700">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg"></div>

            <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full scale-150 animate-pulse-slow"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-2 border-primary/40 border-t-transparent animate-spin-reverse"></div>

                <div className="relative w-28 h-28 bg-background-dark rounded-full border-4 border-primary flex items-center justify-center shadow-neon animate-in zoom-in duration-500 delay-300">
                    <span className="material-icons text-primary text-5xl gold-glow">check_circle</span>
                </div>

                <div className="absolute -bottom-4 bg-primary text-black px-4 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-neon z-20">
                    Verified
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] glow-text">
                    Capsule<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Secured</span>
                </h1>
                <p className="text-primary/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                    &gt; TEMPORAL ANCHOR ESTABLISHED
                </p>
            </div>

            <div className="w-full space-y-4 mb-8">
                <div className="bg-black/40 border border-white/5 rounded-lg p-4 relative overflow-hidden text-left group hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em]">EVM Transmission</span>
                        <span className="text-[8px] text-green-500 font-bold border border-green-500/30 px-1 rounded">INDEXING</span>
                    </div>
                    <div className="text-xs font-mono text-primary/80 break-all bg-white/5 p-2 rounded mb-2">
                        {txHash}
                    </div>
                    <a href={`${EXPLORER_BASE_URL}/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-[9px] text-gray-500 hover:text-primary transition-all flex items-center gap-1 uppercase font-bold">
                        <span className="material-icons text-[10px]">open_in_new</span>
                        Verify on Blockscout
                    </a>
                </div>

                {btcTxHash && (
                    <div className="bg-black/40 border border-white/5 rounded-lg p-4 relative overflow-hidden text-left group hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em]">Bitcoin Anchor</span>
                            <span className="text-[8px] text-bitcoin-gold font-bold border border-bitcoin-gold/30 px-1 rounded">BROADCASTED</span>
                        </div>
                        <div className="text-xs font-mono text-bitcoin-gold/80 break-all bg-white/5 p-2 rounded mb-2">
                            {btcTxHash}
                        </div>
                        <a href={`${BTC_EXPLORER_BASE_URL}/tx/${btcTxHash}`} target="_blank" rel="noreferrer" className="text-[9px] text-gray-500 hover:text-bitcoin-gold transition-all flex items-center gap-1 uppercase font-bold">
                            <span className="material-icons text-[10px]">open_in_new</span>
                            Verify on Mempool.space
                        </a>
                    </div>
                )}
            </div>

            <button type="button" onClick={handleReturn} className="w-full py-4 bg-primary text-black font-black tracking-[0.3em] uppercase rounded-sm hover:bg-white transition-all duration-300 transform active:scale-[0.98] shadow-neon">
                Return to Core
            </button>
        </div>
    </div>
  );
}
