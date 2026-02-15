import type { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
	const { deployer, treasury } = await hre.getNamedAccounts();
	console.log(`\nStarting TimeCapsule deployment sequence...`);
	console.log(`Deployer: ${deployer}`);
	console.log(`Treasury: ${treasury}`);

	await hre.midl.initialize();

	console.log(`Queueing TimeCapsule deployment intention with treasury: ${treasury}`);
	await hre.midl.deploy("TimeCapsule", [treasury]);

	console.log(`Executing transactions via MIDL...`);
	const result = await hre.midl.execute();

	if (result) {
		console.log(`TimeCapsule deployment executed.`);
	} else {
		console.log(`TimeCapsule deployment complete (or already deployed).`);
	}
}
