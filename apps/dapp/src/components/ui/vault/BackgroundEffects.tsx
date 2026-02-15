"use client";

export const BackgroundEffects = () => {
	return (
		<>
			{/* Ambient Background Effects */}
			<div className="absolute inset-0 z-0 grid-bg opacity-40 pointer-events-none transform perspective-1000 rotate-x-12 scale-110" />
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/95 via-transparent to-background-dark/95 pointer-events-none z-0" />

			{/* Floating Ambient Orbs */}
			<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-20 animate-float pointer-events-none"></div>
			<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-xverse-orange rounded-full opacity-40 animate-float-delayed pointer-events-none"></div>
			<div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full opacity-30 animate-pulse pointer-events-none"></div>

			<div className="scanline" />
		</>
	);
};
