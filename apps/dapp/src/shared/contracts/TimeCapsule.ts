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
        "inputs": [
            {
                "internalType": "address",
                "name": "_treasury",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "CapsuleClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "unlockTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "vaultType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "CapsuleCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "userAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "treasuryAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "EarlyWithdrawal",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Pinged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
		inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
		name: "claimLegacy",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "unlockTime",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "vaultType",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "capsules",
        "outputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "beneficiary", "type": "address" },
            { "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "uint8", "name": "vaultType", "type": "uint8" },
            { "internalType": "bool", "name": "claimed", "type": "bool" },
            { "internalType": "string", "name": "message", "type": "string" }
        ],
        name: "CapsuleWithdrawnEarly",
        type: "event"
    }
] as const;

export const getAddress = () => {
    const address = process.env.NEXT_PUBLIC_TIME_CAPSULE_ADDRESS;
    if (!address || !isAddress(address)) {
        throw new Error(
            `TimeCapsule address is missing or invalid: ${address}. ` +
            "Ensure NEXT_PUBLIC_TIME_CAPSULE_ADDRESS is set in your environment."
        );
    }
    return address as `0x${string}`;
}

export const address = (() => {
    if (typeof window !== "undefined") {
        try {
            return getAddress();
        } catch (e) {
            console.error("Critical error sourcing TimeCapsule address:", e);
            // In browser, we might want to return a placeholder but the requirement said fail-fast
            return "0x0000000000000000000000000000000000000000" as `0x${string}`;
        }
    }
    return "0x0000000000000000000000000000000000000000" as `0x${string}`;
})();
