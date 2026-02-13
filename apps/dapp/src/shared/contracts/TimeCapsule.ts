export const abi = [
	{
		inputs: [],
		name: "capsuleCount",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "token", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
			{ internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
			{ internalType: "address", name: "beneficiary", type: "address" },
			{ internalType: "uint8", name: "vaultType", type: "uint8" },
		],
		name: "createCapsule",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
		name: "withdrawEarly",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
    {
		inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
		name: "claim",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
    {
		inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
		name: "claimLegacy",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;

export const getAddress = () => {
    const address = process.env.NEXT_PUBLIC_TIME_CAPSULE_ADDRESS;
    if (!address || address === "0x0000000000000000000000000000000000000000") {
        throw new Error("TimeCapsule address is missing or invalid. Check environment configuration.");
    }
    return address as `0x${string}`;
}

export const address = (() => {
    try {
        return getAddress();
    } catch (e) {
        console.warn(e);
        return "0x0000000000000000000000000000000000000000" as `0x${string}`; // Fallback to avoid crash during static analysis/build, but calls will fail
    }
})();
