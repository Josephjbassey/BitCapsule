import { isAddress } from "viem";

export enum VaultType {
  TEMPORAL = 0,
  LEGACY = 1,
  HODL = 2,
  SOCIAL = 3
}

export const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_treasury", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "claimant", "type": "address" }
    ],
    "name": "CapsuleClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
      { "indexed": false, "internalType": "enum TimeCapsule.VaultType", "name": "vaultType", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "token", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "CapsuleCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "userAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "treasuryAmount", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "token", "type": "address" }
    ],
    "name": "EarlyWithdrawal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "CapsuleTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "newBeneficiary", "type": "address" }
    ],
    "name": "BeneficiaryUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "Pinged",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "capsuleCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "capsules",
    "outputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "unlockTimestamp", "type": "uint256" },
      { "internalType": "address", "name": "beneficiary", "type": "address" },
      { "internalType": "enum TimeCapsule.VaultType", "name": "vaultType", "type": "uint8" },
      { "internalType": "bool", "name": "claimed", "type": "bool" },
      { "internalType": "string", "name": "message", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "claimLegacy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "unlockTimestamp", "type": "uint256" },
      { "internalType": "address", "name": "beneficiary", "type": "address" },
      { "internalType": "enum TimeCapsule.VaultType", "name": "vaultType", "type": "uint8" },
      { "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "createCapsule",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "newBeneficiary", "type": "address" }
    ],
    "name": "transferBeneficiary",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "lastPing",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ping",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "withdrawEarly",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const getAddress = (): `0x${string}` => {
    const FALLBACK_ADDRESS = "0x1c599181a7d0AF5fcA5FE824C20F5E0d0Cb02F32";
    const envAddr = process.env.NEXT_PUBLIC_TIME_CAPSULE_ADDRESS;
    const address = (envAddr && envAddr !== "undefined") ? envAddr : FALLBACK_ADDRESS;

    if (address === FALLBACK_ADDRESS && (!envAddr || envAddr === "undefined")) {
        if (typeof window !== "undefined" && !(window as any)._TC_ADDR_WARNED) {
            console.warn("NEXT_PUBLIC_TIME_CAPSULE_ADDRESS not set or invalid — using fallback address.");
            (window as any)._TC_ADDR_WARNED = true;
        }
    }

    if (!isAddress(address)) {
        throw new Error(`TimeCapsule address invalid: ${address}`);
    }
    return address as `0x${string}`;
}

export const address = getAddress();
