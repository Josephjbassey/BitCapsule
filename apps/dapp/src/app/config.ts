import { MaestroSymphonyProvider, regtest } from "@midl/core";
import { createMidlConfig } from "@midl/satoshi-kit";
import { xverseConnector, unisatConnector, leatherConnector, okxConnector, phantomConnector } from "@midl/connectors";
import { QueryClient } from "@tanstack/react-query";

export const midlConfig = createMidlConfig({
	networks: [regtest],
	persist: true,
	connectors: [
		xverseConnector(),
		unisatConnector(),
		leatherConnector(),
		okxConnector(),
		phantomConnector(),
	],
	runesProvider: new MaestroSymphonyProvider({ regtest: "https://runes.staging.midl.xyz" }),
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

export const EXPLORER_BASE_URL = "https://blockscout.staging.midl.xyz";
export const BTC_EXPLORER_BASE_URL = "https://mempool.staging.midl.xyz";
