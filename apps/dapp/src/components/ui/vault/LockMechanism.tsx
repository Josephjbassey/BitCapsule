export const LockMechanism = () => {
	return (
		<div className="w-full md:w-1/2 flex flex-col items-center justify-center relative group perspective-1000">
			{/* Decorative concentric circles representing the 'Lock' */}
			<div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
				{/* Outer Ring */}
				<div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]" />
				<div className="absolute inset-4 rounded-full border-2 border-primary/10 border-t-primary/60 animate-[spin_20s_linear_infinite_reverse]" />
				{/* Middle Ring with Data */}
				<div className="absolute inset-12 rounded-full border border-primary/30 bg-obsidian/80 backdrop-blur-md shadow-neon flex items-center justify-center overflow-hidden">
					<img
						alt="Abstract neon geometric pattern representing a digital lock core"
						className="w-full h-full object-cover opacity-40 mix-blend-overlay"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvp6ARoUsE7ll4bSnvXa5_py9g5qGQVp98jVr6EVbZdGU9SbB2Drz6NpQnj2xkbjwKoudv-PJ7elemYUR3IrIwSyQfDdba5_em0Y6815By_SgLK-UbienHRzGWeex8ssVlRpy9UENyxOSpJquFsQ39mKOC-UpS5k43z9vyCCq5UhNju0S2hwr2wvXukoT3pujQIurKhX6jdz5WAheiUIx3MP_yY35P-aBKwp2TYlMEykCZFy-5o71EyQxltig9VfrCJPQxRHsQEA"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
				</div>
				{/* Core Lock */}
				<div className="absolute w-32 h-32 bg-obsidian rounded-full border-4 border-primary shadow-neon-intense flex items-center justify-center z-10">
					<span className="material-icons text-6xl text-primary drop-shadow-[0_0_15px_rgba(52,132,244,1)]">
						lock
					</span>
				</div>
				{/* Floating Particles/Embers */}
				<div className="absolute -top-10 -right-10 w-2 h-2 bg-primary rounded-full blur-[1px] animate-bounce" />
				<div className="absolute top-20 -left-12 w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse" />
				<div className="absolute bottom-10 right-0 w-1.5 h-1.5 bg-bitcoin-gold rounded-full blur-[1px] animate-pulse" />
				{/* Holographic projection lines */}
				<div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform rotate-45" />
				<div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
			</div>
			<div className="mt-8 text-center space-y-2">
				<p className="text-primary/60 text-xs tracking-[0.3em] uppercase">
					System Armed
				</p>
				<h2 className="text-2xl font-bold text-white tracking-wide">
					TEMPORAL VAULT
				</h2>
			</div>
		</div>
	);
};
