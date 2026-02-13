import { DepositForm } from "@/components/ui/vault/DepositForm";
import { BackgroundEffects } from "@/components/ui/vault/BackgroundEffects";
import { LockMechanism } from "@/components/ui/vault/LockMechanism";
import { TemporalSlider } from "@/components/ui/vault/TemporalSlider";
import { VaultButton, VaultCard } from "@/components/ui/vault";

export default function TemporalArchivePage() {
	return (
		<div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
			<BackgroundEffects />

			{/* Top HUD Interface */}
			<header className="relative z-20 w-full px-6 py-4 flex justify-between items-center border-b border-primary/20 backdrop-blur-sm bg-obsidian/50">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary animate-pulse">
						<span className="material-icons text-primary text-sm">
							hourglass_empty
						</span>
					</div>
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold leading-none glow-text">
							TIMEVIBE
						</h1>
						<span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">
							Secure Channel V.2.0
						</span>
					</div>
				</div>
				<div className="flex gap-4 md:gap-8 text-[10px] tracking-widest text-gray-400">
					<div className="hidden md:flex flex-col items-end">
						<span className="text-primary/70">ENCRYPTION</span>
						<span className="text-green-400 font-bold">QUANTUM-256</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-primary/70">STATUS</span>
						<span className="text-primary font-bold animate-pulse">LIVE</span>
					</div>
				</div>
			</header>

			{/* Main Viewport */}
			<main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-8 w-full max-w-7xl mx-auto h-full">
				<LockMechanism />

				{/* Right Panel: Data Terminal */}
				<div className="w-full md:w-1/2 max-w-lg relative">
					<DepositForm />
				</div>
			</main>

			{/* Footer HUD */}
			<footer className="relative z-20 w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 border-t border-primary/10 bg-obsidian/80 backdrop-blur-md">
				<div className="flex gap-4">
					<span className="hover:text-primary cursor-pointer transition-colors">
						PRIVACY_PROTOCOL_V2
					</span>
					<span className="hover:text-primary cursor-pointer transition-colors">
						TERMS_OF_ENGAGEMENT
					</span>
				</div>
				<div className="mt-2 md:mt-0 font-mono">
					ID: <span className="text-primary/60">XJ-9200-ALPHA</span> // NODE:{" "}
					<span className="text-green-500/60">VERIFIED</span>
				</div>
			</footer>
		</div>
	);
}
