import { formatEther, isAddressEqual, type Log, decodeEventLog } from "viem";
import * as TimeCapsule from "../contracts/TimeCapsule";

export interface RevealedData {
  message: string;
  amount: string;
  file?: {
    name: string;
    size: number;
    url?: string;
  } | null;
}

export function parseRevealedData(log: Log): RevealedData {
  let message = "Protocol Active. Payload Recovered.";
  let amount = "---";
  let file = null;

  const args = (log as any).args;

  // Fallback to event amount if possible
  if (args?.amount) {
    try {
      amount = formatEther(args.amount);
    } catch (e) {
      console.warn("Failed to format ether from log amount", e);
    }
  }

  if (args?.message) {
      try {
        const data = JSON.parse(args.message);
        message = data.secret || message;
        amount = data.amount ?? amount;
        file = data.file ? { ...data.file, url: data.file.url } : null;
      } catch (e) {
        message = args.message;
      }
  }

  return { message, amount, file };
}

export function parseVaultMessage(msg: string) {
  if (!msg) return { label: "Unnamed Vault", secret: "", file: null, origAmount: null };
  try {
    const data = JSON.parse(msg);
    return {
      label: data.label || "Unnamed Vault",
      secret: data.secret || "",
      file: data.file || null,
      origAmount: data.amount ?? null
    };
  } catch (e) {
    // Handle legacy messages that aren't JSON
    return {
      label: "Archive Record",
      secret: msg,
      file: null,
      origAmount: null
    };
  }
}

export function reconcileArchiveLogs(allLogs: Log[]) {
  const processedIds = new Set<string>();
  const ownerMap = new Map<string, string>();
  const beneficiaryMap = new Map<string, string>();

  const createdLogs: any[] = [];

  // Sort logs chronologically to ensure state changes are applied in order
  const sortedLogs = [...allLogs].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) return Number((a.blockNumber || 0n) - (b.blockNumber || 0n));
    return (a.logIndex || 0) - (b.logIndex || 0);
  });

  if (process.env.NODE_ENV === "development") {
      console.log("[BitCapsule] Reconciling total logs:", sortedLogs.length);
  }

  sortedLogs.forEach(log => {
    try {
      let eventName = (log as any).eventName;
      let args = (log as any).args;

      // If log is not decoded, decode it
      if (!eventName || !args) {
        const decoded = decodeEventLog({
          abi: TimeCapsule.abi,
          data: log.data,
          topics: log.topics,
          strict: false
        });
        if (decoded) {
          eventName = decoded.eventName;
          args = decoded.args;
        }
      }

      if (!eventName || !args) return;
      const id = args?.id?.toString();

      if (!id) return;

      if (eventName === 'CapsuleCreated') {
        createdLogs.push({ ...log, eventName, args });
      } else if (eventName === 'CapsuleClaimed' || eventName === 'EarlyWithdrawal') {
        processedIds.add(id);
      } else if (eventName === 'CapsuleTransferred' && args.to) {
        ownerMap.set(id, args.to);
      } else if (eventName === 'BeneficiaryUpdated' && args.newBeneficiary) {
        beneficiaryMap.set(id, args.newBeneficiary);
      }
    } catch (e) {
      // Skip logs that can't be decoded
    }
  });

  return createdLogs
    .filter((log) => {
        const id = log.args.id.toString();
        const isProcessed = processedIds.has(id);
        if (isProcessed && process.env.NODE_ENV === "development") {
            console.log(`[BitCapsule] Filtering out vault #${id} (Already claimed/withdrawn)`);
        }
        return !isProcessed;
    })
    .map(log => {
      const id = log.args.id.toString();
      const updatedLog = { ...log, args: { ...log.args } };
      if (ownerMap.has(id)) {
        updatedLog.args.owner = ownerMap.get(id);
      }
      if (beneficiaryMap.has(id)) {
        updatedLog.args.beneficiary = beneficiaryMap.get(id);
      }
      return updatedLog;
    });
}
