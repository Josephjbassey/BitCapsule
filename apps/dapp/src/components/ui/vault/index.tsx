"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface VaultCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export const VaultCard = React.forwardRef<HTMLDivElement, VaultCardProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"bg-background-dark-light/90 border border-primary/30 rounded-xl p-1 shadow-2xl backdrop-blur-sm relative overflow-hidden group",
					className
				)}
				{...props}
			>
				{/* Corner accents */}
				<div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />
				<div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg" />
				<div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg" />
				<div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />

				<div className="p-6 md:p-8 bg-cyber-grid bg-[length:10px_10px]">
					{children}
				</div>
			</div>
		);
	}
);
VaultCard.displayName = "VaultCard";

export const VaultButton = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, type = "button", ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={cn(
				"relative w-full group overflow-hidden rounded-lg bg-background-dark-light border border-primary/30 hover:border-primary/80 transition-all duration-300",
				className
			)}
			type={type}
			{...props}
		>
			{/* Gold Circuitry Pattern Background */}
			<div className="absolute inset-0 circuit-pattern opacity-10 group-hover:opacity-20 transition-opacity" />
			{/* Glass shine effect */}
			<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
			<div className="relative flex items-center justify-between px-6 py-5">
				{children}
			</div>
			{/* Bottom warning strip */}
			<div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/50" />
		</button>
	);
});
VaultButton.displayName = "VaultButton";
