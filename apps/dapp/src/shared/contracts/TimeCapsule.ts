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
            { internalType: "string", name: "message", type: "string" },
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
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: false, internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
            { indexed: false, internalType: "string", name: "message", type: "string" }
        ],
        name: "CapsuleCreated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "claimant", type: "address" }
        ],
        name: "CapsuleClaimed",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "CapsuleWithdrawnEarly",
        type: "event"
    }
] as const;

export const getAddress = () => {
    const address = process.env.NEXT_PUBLIC_TIME_CAPSULE_ADDRESS;
    // Validate that it starts with 0x and is a string
    if (!address || !address.startsWith("0x") || address === "0x0000000000000000000000000000000000000000") {
        throw new Error("TimeCapsule address is missing or invalid. Check environment configuration.");
    }
    return address as `0x${string}`;
}

export const address = (() => {
    try {
        return getAddress();
    } catch (e) {
        console.warn(e);
        return "0x0000000000000000000000000000000000000000" as `0x${string}`;
    }
})();
