import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/global";
import { Header } from "@/widgets";
import "@midl/satoshi-kit/styles.css";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
	title: "MIDL DApp Demo",
	description:
		"A demo application for building decentralized applications with MIDL.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<Web3Provider>
				<body className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} bg-muted font-sans`}>
					<Header />
					<div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
					<Toaster />
				</body>
			</Web3Provider>
		</html>
	);
}
