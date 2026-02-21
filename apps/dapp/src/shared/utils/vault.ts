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
      origAmount: data.amount || null
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
