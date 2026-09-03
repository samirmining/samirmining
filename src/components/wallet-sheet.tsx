import { HelpCircle, Wallet, X } from "lucide-react";
import { cn, shortWallet } from "@/lib/utils";

type Props = {
  current?: string | null;
  busy?: boolean;
  onClose: () => void;
  onConnect: () => void;
  onDisconnect?: () => void;
};

export function WalletSheet({ current, busy, onClose, onConnect, onDisconnect }: Props) {
  const connected = Boolean(current);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/70 sm:items-center sm:justify-center">
      <div className="ton-sheet w-full max-w-md rounded-t-[28px] px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-[28px]">
        <div className="mb-1 flex items-center justify-between">
          <span className="grid size-9 place-items-center rounded-full bg-white/6 text-muted" aria-hidden>
            <Wallet className="size-4" />
          </span>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full bg-white/8 text-muted"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {connected ? (
          <div className="pb-3 pt-2">
            <h3 className="text-center text-[1.35rem] font-semibold tracking-tight">TON wallet</h3>
            <p className="mt-1 text-center text-sm text-muted">Connected</p>
            <div className="mt-5 rounded-2xl bg-white/6 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-muted">Address</p>
              <p className="mt-1 break-all font-display text-sm">{current}</p>
            </div>
            <button
              type="button"
              className="mt-4 h-12 w-full rounded-full bg-white/8 font-medium text-fg"
              disabled={busy}
              onClick={onConnect}
            >
              Connect another wallet
            </button>
            <button
              type="button"
              className="mt-2 h-12 w-full rounded-full bg-[#3a1a1a] font-semibold text-danger"
              disabled={busy}
              onClick={onDisconnect}
            >
              Disconnect wallet
            </button>
            <TonFooter />
          </div>
        ) : (
          <div className="pb-2 pt-1">
            <h3 className="text-center text-[1.35rem] font-semibold tracking-tight">Connect your TON wallet</h3>
            <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-[13px] leading-snug text-muted">
              Official TON Connect — Telegram Wallet, Tonkeeper and others
            </p>
            <button
              type="button"
              className="ton-primary mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold text-white"
              disabled={busy}
              onClick={onConnect}
            >
              <Wallet className="size-4" />
              Connect TON wallet
            </button>
            <TonFooter />
          </div>
        )}
      </div>
    </div>
  );
}

function TonFooter() {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[#0098ea]">
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path d="M4 8.5 12 5l8 3.5-8 12L4 8.5Z" fill="#fff" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          TON <span className="font-normal text-muted">Connect</span>
        </span>
      </div>
      <span className={cn("grid size-8 place-items-center rounded-full bg-white/8 text-muted")}>
        <HelpCircle className="size-4" />
      </span>
    </div>
  );
}
