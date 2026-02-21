import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "@midl/hardhat-deploy";
import { midlRegtest } from "@midl/executor";
import { type HardhatUserConfig, vars, task } from "hardhat/config";

task("list-accounts", "Prints the list of named accounts", async (taskArgs, hre) => {
  const namedAccounts = await hre.getNamedAccounts();
  console.log("\nNamed Accounts:");
  for (const [name, address] of Object.entries(namedAccounts)) {
    console.log(`  - ${name}: ${address}`);
  }
  console.log("\nNote: These addresses are derived from your configured MNEMONIC.");
});

export default (<HardhatUserConfig>{
	solidity: "0.8.28",
	defaultNetwork: "regtest",
	namedAccounts: {
		deployer: {
			default: 0,
		},
		treasury: {
			default: 0,
		},
	},
	midl: {
		networks: {
			regtest: {
				mnemonic: vars.has("MNEMONIC") ? vars.get("MNEMONIC") : "test test test test test test test test test test test junk",
				path: "deployments",
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
				hardhatNetwork: "regtest",
				network: {
					explorerUrl: "https://mempool.staging.midl.xyz",
					id: "regtest",
					accounts: { mnemonic: vars.has("MNEMONIC") ? vars.get("MNEMONIC") : "test test test test test test test test test test test junk" },
					network: "regtest",
				},
			},
		},
	},
	networks: {
		regtest: {
			url: vars.has("MIDL_RPC_URL") ? vars.get("MIDL_RPC_URL") : (process.env.MIDL_RPC_URL || "https://rpc.staging.midl.xyz"),
			chainId: vars.has("MIDL_CHAIN_ID") ? Number(vars.get("MIDL_CHAIN_ID")) : Number(process.env.MIDL_CHAIN_ID || midlRegtest.id),
		},
	},
	etherscan: {
		apiKey: {
			regtest: "empty",
		},
		customChains: [
			{
				network: "regtest",
				chainId: midlRegtest.id,
				urls: {
					apiURL: "https://blockscout.staging.midl.xyz/api",
					browserURL: "https://blockscout.staging.midl.xyz",
				},
			},
		],
	},
});
