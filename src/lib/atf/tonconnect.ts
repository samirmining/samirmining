import { toFriendlyTonAddress } from "./address";

type TonConnectUIInstance = {
  openModal: () => Promise<void>;
  disconnect: () => Promise<void>;
  onStatusChange: (fn: (wallet: TonWallet | null) => void) => () => void;
  account?: { address?: string } | null;
};

type TonWallet = {
  account?: { address?: string } | null;
};

let uiPromise: Promise<TonConnectUIInstance | null> | null = null;

export function friendlyFromTonConnect(address?: string | null) {
  if (!address) return "";
  return toFriendlyTonAddress(address, false);
}

export async function getTonConnectUI(): Promise<TonConnectUIInstance | null> {
  if (typeof window === "undefined") return null;
  if (!uiPromise) {
    uiPromise = (async () => {
      try {
        const mod = await import("@tonconnect/ui");
        const TonConnectUI = mod.TonConnectUI;
        const THEME = mod.THEME;
        const ui = new TonConnectUI({
          manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
          buttonRootId: null,
          uiPreferences: { theme: THEME?.DARK ?? "DARK" },
        });
        return ui as unknown as TonConnectUIInstance;
      } catch (err) {
        console.warn("[zx] TonConnect UI failed to load", err);
        return null;
      }
    })();
  }
  return uiPromise;
}

export async function openTonConnectModal() {
  const ui = await getTonConnectUI();
  if (!ui) throw new Error("TON Connect is not available.");
  await ui.openModal();
}

export async function disconnectTonConnect() {
  const ui = await getTonConnectUI();
  if (!ui) return;
  try {
    await ui.disconnect();
  } catch {
    /* already disconnected */
  }
}
