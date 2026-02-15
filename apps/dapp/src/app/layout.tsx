import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/global";
import "@midl/satoshi-kit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/cinematic.css";

export const metadata: Metadata = {
	title: "BitCapsule Cinematic Vault",
	description: "BITCAPSULE // SECURE CHANNEL V.4.1.0 - Temporal Vault System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<head>
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
			</head>
			<Web3Provider>
				<body className="bg-background-dark font-sans min-h-screen overflow-auto">
					{children}
					<Toaster />
				</body>
			</Web3Provider>
		</html>
	);
}
