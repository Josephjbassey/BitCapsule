import type { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
	const { deployer } = await hre.getNamedAccounts();
	console.log(`\nStarting Vault deployment sequence...`);
	console.log(`Deployer account: ${deployer}`);

	/**
	 * Initializes MIDL hardhat deploy SDK
	 */
	await hre.midl.initialize();

	/**
	 * Add the deploy contract transaction intention
	 */
	console.log(`Queueing Vault deployment intention...`);
	await hre.midl.deploy("Vault");

	/**
	 * Sends the BTC transaction and EVM transaction to the network
	 */
	console.log(`Executing transactions via MIDL...`);
	const result = await hre.midl.execute();

	if (result) {
		console.log(`Vault deployment executed. Check deployments folder for details.`);
	} else {
		console.log(`Vault deployment complete (or already deployed).`);
	}
}
