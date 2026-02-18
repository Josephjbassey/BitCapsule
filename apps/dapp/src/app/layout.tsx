import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/global";
import "@midl/satoshi-kit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/cinematic.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
	title: "BitCapsule Cinematic Vault",
	description: "BitCapsule - Temporal Vault System",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	// Removed maximumScale and userScalable to allow standard mobile behavior
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<head>
				<link
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-background-dark text-foreground font-sans min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
				<Web3Provider>
					{children}
					<Toaster />
				</Web3Provider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
