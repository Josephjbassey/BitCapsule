import { type Config, MaestroSymphonyProvider, regtest, createConfig } from "@midl/core";
// import { createMidlConfig } from "@midl/satoshi-kit";
import { QueryClient } from "@tanstack/react-query";
import { xverseConnector, unisatConnector, leatherConnector } from "@midl/connectors";

export const midlConfig = createConfig({
	networks: [regtest],
	persist: true,
	connectors: [xverseConnector(), unisatConnector(), leatherConnector()],
	// @ts-ignore - runesProvider might not be in the strict Config type from core, but needed by consumers
	runesProvider: new MaestroSymphonyProvider({ regtest: "https://runes.staging.midl.xyz" }),
}) as Config;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

export const EXPLORER_BASE_URL = "https://blockscout.staging.midl.xyz";
