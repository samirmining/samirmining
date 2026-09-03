import { OWNER_TON_ADDRESS } from "./levels";

const NANO = 1_000_000_000;

export function ownerTonAddress() {
  return (process.env.OWNER_TON_ADDRESS || OWNER_TON_ADDRESS).trim();
}

export function ownerDefiAddress() {
  return (process.env.OWNER_DEFI_ADDRESS || "").trim();
}

export function tonUsdPrice() {
  const n = Number(process.env.TON_USD || "5.5");
  return Number.isFinite(n) && n > 0 ? n : 5.5;
}

export function usdToNano(usd: number) {
  const ton = usd / tonUsdPrice();
  const nano = Math.max(1, Math.round(ton * NANO));
  return { ton: Math.round(ton * 1e6) / 1e6, nano: String(nano), usd };
}

export function transferDeepLink(dest: string, nano: string, memo: string) {
  const text = encodeURIComponent(memo);
  return {
    ton: `ton://transfer/${dest}?amount=${nano}&text=${text}`,
    tonkeeper: `https://app.tonkeeper.com/transfer/${dest}?amount=${nano}&text=${text}`,
    telegram: `https://t.me/wallet?startattach=tontransfer`,
  };
}

type TonTx = {
  transaction_id?: { hash?: string };
  in_msg?: { message?: string; value?: string; source?: string };
  in_msg_decoded?: { comment?: string };
};

/** Best-effort on-chain check via Toncenter. Fails soft. */
export async function findIncomingPayment(opts: {
  dest: string;
  memo: string;
  minNano: bigint;
  sinceMs: number;
}): Promise<string | null> {
  const key = process.env.TONCENTER_API_KEY;
  const url = new URL("https://toncenter.com/api/v2/getTransactions");
  url.searchParams.set("address", opts.dest);
  url.searchParams.set("limit", "30");
  url.searchParams.set("archival", "true");
  try {
    const res = await fetch(url, {
      headers: key ? { "X-API-Key": key } : undefined,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; result?: TonTx[] };
    const rows = json.result ?? [];
    for (const tx of rows) {
      const comment = tx.in_msg?.message || "";
      const value = BigInt(tx.in_msg?.value || "0");
      if (comment.includes(opts.memo) && value >= opts.minNano) {
        return tx.transaction_id?.hash || "onchain";
      }
    }
  } catch {
    /* network optional */
  }
  return null;
}
