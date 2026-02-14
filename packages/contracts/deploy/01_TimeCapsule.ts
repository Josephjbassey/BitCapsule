import type { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
	await hre.midl.initialize();

	// Use a dummy treasury address for regtest
	const treasury = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

	await hre.midl.deploy("TimeCapsule", [treasury]);

	await hre.midl.execute();
}
