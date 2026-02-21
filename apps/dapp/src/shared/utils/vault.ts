import { formatEther, type Log } from "viem";

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


export function reconcileArchiveLogs(
  createdLogs: Log[],
  claimedLogs: Log[],
  withdrawnLogs: Log[],
  transferredLogs: Log[] = [],
  beneficiaryLogs: Log[] = []
) {
  const processedIds = new Set<string>();

  [...claimedLogs, ...withdrawnLogs].forEach(log => {
    const id = (log as any)?.args?.id;
    if (id != null) processedIds.add(id.toString());
  });

  const ownerMap = new Map<string, string>();
  const beneficiaryMap = new Map<string, string>();

  const allStateLogs = [...transferredLogs, ...beneficiaryLogs].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) return Number((a.blockNumber || 0n) - (b.blockNumber || 0n));
    return (a.logIndex || 0) - (b.logIndex || 0);
  });

  allStateLogs.forEach(log => {
    const args = (log as any).args;
    if (!args || args.id == null) return;

    let id: string;
    try {
      id = args.id.toString();
    } catch (e) {
      return;
    }

    const eventName = (log as any).eventName;

    if (eventName === 'CapsuleTransferred' && args.to) {
      ownerMap.set(id, args.to);
    } else if (eventName === 'BeneficiaryUpdated' && args.newBeneficiary) {
      beneficiaryMap.set(id, args.newBeneficiary);
    }
  });

  return createdLogs
    .filter((log) => {
        const id = (log as any)?.args?.id;
        return id != null && !processedIds.has(id.toString());
    })
    .map(log => {
      const args = (log as any).args;
      const id = args.id.toString();
      const updatedLog = { ...log, args: { ...args } };
      if (ownerMap.has(id)) {
        (updatedLog as any).args.owner = ownerMap.get(id);
      }
      if (beneficiaryMap.has(id)) {
        (updatedLog as any).args.beneficiary = beneficiaryMap.get(id);
      }
      return updatedLog;
    });
}
