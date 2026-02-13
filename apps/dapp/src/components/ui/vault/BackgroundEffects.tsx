"use client";

export const BackgroundEffects = () => {
	return (
		<>
			{/* Ambient Background Effects */}
			<div className="absolute inset-0 z-0 cyber-grid opacity-20 pointer-events-none" />
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0" />
			<div className="scanline" />
		</>
	);
};
