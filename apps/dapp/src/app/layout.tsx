import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/global";
import "@midl/satoshi-kit/styles.css";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/cinematic.css";

const inter = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TimeVibe Cinematic Vault",
	description: "Secure Channel V.2.0 - Temporal Vault System",
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
				<body className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} bg-background-dark font-sans overflow-hidden h-screen w-screen`}>
					{children}
					<Toaster />
				</body>
			</Web3Provider>
		</html>
	);
}
