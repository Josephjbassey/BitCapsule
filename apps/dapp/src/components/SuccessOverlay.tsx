"use client";

interface SuccessOverlayProps {
  txHash: string;
  onClose: () => void;
  onRefresh: () => void;
}

export default function SuccessOverlay({ txHash, onClose, onRefresh }: SuccessOverlayProps) {
  const handleReturn = () => {
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-black/70 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-10 pointer-events-none"></div>

      <div className="relative max-w-lg w-full bg-obsidian-light/95 border border-primary/30 rounded-2xl p-8 md:p-12 shadow-2xl text-center space-y-8 overflow-hidden group animate-in zoom-in-95 duration-300">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-xl"></div>

        <div className="relative flex justify-center py-6">
          <div className="w-40 h-40 rounded-full bg-green-500/10 border-4 border-green-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)] relative">
            <span className="material-symbols-outlined text-[100px] text-green-400 animate-pulse drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>
              check_circle
            </span>
          </div>
          <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full scale-125 opacity-50"></div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase leading-none">
            Message Encrypted <br />
            <span className="text-bitcoin-orange drop-shadow-[0_0_15px_rgba(247,147,26,0.6)]">to Bitcoin</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-primary/60 font-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="w-12 h-px bg-primary/20"></span>
            Temporal Link Verified
            <span className="w-12 h-px bg-primary/20"></span>
          </div>
        </div>

        <div className="bg-black/80 border border-white/10 rounded-xl p-6 space-y-3 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-left flex justify-between">
            <span>TX_HASH_IDENTIFIER</span>
            <span className="text-green-500 font-bold animate-pulse">CONFIRMED</span>
          </div>
          <div className="text-xs font-mono text-primary/90 break-all text-left bg-primary/5 p-3 rounded border border-primary/10 leading-relaxed">
            {txHash}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <a
            href={`https://blockscout.staging.midl.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 bg-primary/10 hover:bg-primary/20 border border-primary/40 text-white font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 rounded-xl group/btn hover:shadow-neon"
          >
            <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">open_in_new</span>
            View on Explorer
          </a>

          <button
            onClick={handleReturn}
            className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 rounded-xl hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">keyboard_backspace</span>
            Return to Vault
          </button>
        </div>

        <div className="absolute inset-0 pointer-events-none scanline opacity-10"></div>
      </div>
    </div>
  );
}
