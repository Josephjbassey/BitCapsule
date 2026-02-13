"use client";

export const BackgroundEffects = () => {
	return (
		<>
			{/* Ambient Background Effects */}
			<div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:20px_20px] opacity-20 pointer-events-none" />
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-dark/90 via-transparent to-background-dark/90 pointer-events-none z-0" />
			<div className="scanline" />
			<style jsx global>{`
				.scanline {
					width: 100%;
					height: 100px;
					z-index: 10;
					background: linear-gradient(
						0deg,
						rgba(0, 0, 0, 0) 0%,
						rgba(52, 132, 244, 0.1) 50%,
						rgba(0, 0, 0, 0) 100%
					);
					opacity: 0.1;
					position: absolute;
					bottom: 100%;
					animation: scanline 10s linear infinite;
					pointer-events: none;
				}
				@keyframes scanline {
					0% {
						bottom: 100%;
					}
					100% {
						bottom: -100px;
					}
				}
				.circuit-pattern {
					background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F7931A' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
				}
				.glow-text {
					text-shadow: 0 0 10px rgba(52, 132, 244, 0.7);
				}
			`}</style>
		</>
	);
};
