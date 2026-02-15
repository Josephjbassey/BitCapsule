import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "@midl/hardhat-deploy";
import { midlRegtest } from "@midl/executor";
import { type HardhatUserConfig, vars, task } from "hardhat/config";

// Task to list accounts derived from the mnemonic
task("list-accounts", "Prints the list of named accounts", async (taskArgs, hre) => {
  const namedAccounts = await hre.getNamedAccounts();
  console.log("\n--- BitCapsule Named Accounts ---");
  for (const [name, address] of Object.entries(namedAccounts)) {
    console.log(`  ${name.padEnd(10)}: ${address}`);
  }
  console.log("---------------------------------\n");
});

const MNEMONIC = vars.has("MNEMONIC") ? vars.get("MNEMONIC") : "test test test test test test test test test test test junk";

const config: HardhatUserConfig = {
	solidity: "0.8.28",
	defaultNetwork: MNEMONIC.includes("junk") ? "hardhat" : "regtest",
	namedAccounts: {
		deployer: 0,
		treasury: 1,
	},
	midl: {
		networks: {
			regtest: {
				mnemonic: MNEMONIC,
				path: "deployments",
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
				hardhatNetwork: "regtest",
				network: {
					explorerUrl: "https://mempool.staging.midl.xyz",
					id: "regtest",
					network: "regtest",
				},
			},
			// Add hardhat network to prevent crash during task initialization
			hardhat: {
				mnemonic: MNEMONIC,
				path: "deployments",
				hardhatNetwork: "hardhat",
			},
		},
	},
	networks: {
		regtest: {
			url: midlRegtest.rpcUrls.default.http[0],
			chainId: midlRegtest.id,
			accounts: {
				mnemonic: MNEMONIC,
			},
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
};

export default config;
