import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";

function secret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.BOT_TOKEN ||
    "zx-demo-secret-change-on-render"
  );
}

export function hmac(data: string, key = secret()) {
  return createHmac("sha256", key).update(data).digest("hex");
}

export function sha256(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

export function newId(prefix = "id") {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

/** Display prefix for newly generated miner IDs. Old ATF-XXXXXXXX values remain valid and are still matched/looked-up correctly. */
export function atfIdFromTelegram(telegramId: string) {
  return `ZX-${sha256(telegramId).slice(0, 8).toUpperCase()}`;
}

export function signPayload(payload: Record<string, unknown>, ttlMs: number) {
  const body = { ...payload, exp: Date.now() + ttlMs };
  const json = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${json}.${hmac(json)}`;
}

export function verifyPayload<T extends Record<string, unknown>>(token: string): T | null {
  const [json, sig] = token.split(".");
  if (!json || !sig) return null;
  const expected = hmac(json);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const body = JSON.parse(Buffer.from(json, "base64url").toString("utf8")) as T & {
      exp?: number;
    };
    if (typeof body.exp === "number" && body.exp < Date.now()) return null;
    return body;
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

/** Telegram Mini App initData HMAC verification. */
export function verifyTelegramInitData(initData: string, botToken: string, maxAgeSec = 86_400) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const pairs = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const dataCheck = pairs.map(([k, v]) => `${k}=${v}`).join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calc = createHmac("sha256", secretKey).update(dataCheck).digest("hex");
  const a = Buffer.from(calc, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const authDate = Number(params.get("auth_date") || 0);
  if (authDate && Date.now() / 1000 - authDate > maxAgeSec) return null;
  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    const user = JSON.parse(userRaw) as {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    const startParam = params.get("start_param");
    return { user, startParam };
  } catch {
    return null;
  }
}

export function parseStartRef(startParam: string | null | undefined): string | null {
  if (!startParam) return null;
  const cleaned = startParam.replace(/^ref[_-]?/i, "");
  if (!cleaned || cleaned.length > 32) return null;
  return cleaned;
}
