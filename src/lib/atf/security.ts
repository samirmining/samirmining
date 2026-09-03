import { FRIENDLY_TON_RE, toFriendlyTonAddress } from "./address";

const hits = (globalThis as unknown as { __zxHits?: Map<string, number[]> }).__zxHits ??
  new Map<string, number[]>();
(globalThis as unknown as { __zxHits: Map<string, number[]> }).__zxHits = hits;

const locks = (globalThis as unknown as { __zxLocks?: Map<string, Promise<unknown>> }).__zxLocks ??
  new Map<string, Promise<unknown>>();
(globalThis as unknown as { __zxLocks: Map<string, Promise<unknown>> }).__zxLocks = locks;

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= max) {
    throw new Error("Too many requests. Please wait a moment.");
  }
  prev.push(now);
  hits.set(key, prev);
}

export async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const next = prev.then(() => gate);
  locks.set(key, next);
  await prev.catch(() => undefined);
  try {
    return await fn();
  } finally {
    release();
  }
}

export function looksLikeSeed(value: string) {
  const trimmed = value.trim();
  if (/\s/.test(trimmed) && trimmed.split(/\s+/).length >= 8) return true;
  if (/seed|mnemonic|private key/i.test(trimmed)) return true;
  return false;
}

export function assertTonAddress(address: string) {
  const trimmed = toFriendlyTonAddress(address.trim());
  if (looksLikeSeed(address.trim())) {
    throw new Error("Never paste a seed phrase. TON public address only.");
  }
  if (!FRIENDLY_TON_RE.test(trimmed)) {
    throw new Error("Enter a valid TON address (starts with EQ or UQ).");
  }
  return trimmed;
}
