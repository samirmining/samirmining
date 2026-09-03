import { getStore } from "./store";

export function ownerTelegramId() {
  return (process.env.OWNER_TELEGRAM_ID || "").trim();
}

export function envAdminIds(): string[] {
  return (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(/[, ]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isOwnerId(telegramId: string) {
  const owner = ownerTelegramId();
  return Boolean(owner) && telegramId === owner;
}

export async function isAdminId(telegramId: string): Promise<boolean> {
  if (isOwnerId(telegramId)) return true;
  if (envAdminIds().includes(telegramId)) return true;
  const store = await getStore();
  const settings = await store.getSettings();
  return (settings.adminTelegramIds || []).includes(telegramId);
}

export async function assertAdmin(telegramId: string) {
  if (!(await isAdminId(telegramId))) {
    throw new Error("Not authorized.");
  }
}

export async function assertOwner(telegramId: string) {
  if (!isOwnerId(telegramId)) {
    throw new Error("Owner only.");
  }
}
