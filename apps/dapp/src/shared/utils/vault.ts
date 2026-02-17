export interface RevealedData {
  message: string;
  amount: string | number;
  file?: {
    name: string;
    size: number;
  } | null;
}

export function parseRevealedData(log: any): RevealedData {
  try {
    const data = JSON.parse(log.args.message);
    return {
      message: data.secret || "Protocol Active. Payload Recovered.",
      amount: data.amount || "---",
      file: data.file || null
    };
  } catch (e) {
    return {
      message: log.args.message,
      amount: "---",
      file: null
    };
  }
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
