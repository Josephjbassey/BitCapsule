import { formatEther } from "viem";

export interface RevealedData {
  message: string;
  amount: string | number;
  file?: {
    name: string;
    size: number;
    url?: string;
  } | null;
}

export function parseRevealedData(log: any): RevealedData {
  let message = "Protocol Active. Payload Recovered.";
  let amount = "---";
  let file = null;

  // Fallback to event amount if possible
  if (log.args?.amount) {
    try {
      amount = formatEther(log.args.amount);
    } catch (e) {
      console.warn("Failed to format ether from log amount", e);
    }
  }

  try {
    const data = JSON.parse(log.args.message);
    message = data.secret || message;
    amount = data.amount ?? amount;
    file = data.file ? { ...data.file, url: data.file.url } : null;
  } catch (e) {
    message = log.args.message;
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
  createdLogs: any[],
  claimedLogs: any[],
  withdrawnLogs: any[],
  transferredLogs: any[] = [],
  beneficiaryLogs: any[] = []
) {
  const processedIds = new Set([
    ...claimedLogs.map((log) => log?.args?.id?.toString()),
    ...withdrawnLogs.map((log) => log?.args?.id?.toString())
  ]);

  const ownerMap = new Map<string, string>();
  const beneficiaryMap = new Map<string, string>();

  const allStateLogs = [...transferredLogs, ...beneficiaryLogs].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) return Number(a.blockNumber) - Number(b.blockNumber);
    return a.logIndex - b.logIndex;
  });

  allStateLogs.forEach(log => {
    if (!log.args || log.args.id == null) return;

    let id: string;
    try {
      id = log.args.id.toString();
    } catch (e) {
      return;
    }

    if (log.eventName === 'CapsuleTransferred' && log.args.to) {
      ownerMap.set(id, log.args.to);
    } else if (log.eventName === 'BeneficiaryUpdated' && log.args.newBeneficiary) {
      beneficiaryMap.set(id, log.args.newBeneficiary);
    }
  });

  return createdLogs
    .filter((log) => !processedIds.has(log?.args?.id?.toString()))
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
