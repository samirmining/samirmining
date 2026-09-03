import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Building2,
  Check,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  MessageCircle,
  Pickaxe,
  Repeat2,
  Share2,
  User as UserIcon,
  Users,
  Volume2,
  VolumeX,
  Wallet,
  Zap,
} from "lucide-react";
import {
  bootstrapUser,
  claimMining,
  claimTask,
  createLevelInvoice,
  disconnectWallet,
  getCaptcha,
  getFriends,
  getLevelQuote,
  getPublicConfig,
  listActiveTasks,
  myWithdrawals,
  openTask,
  requestWithdraw,
  saveWallet,
  startMining,
  tapBoost,
  verifyLevelPayment,
} from "@/lib/atf/actions";
import { playClaimSound, playLevelUpSound, playTapSound, playTaskSound } from "@/lib/atf/sounds";
import { disconnectTonConnect, friendlyFromTonConnect, getTonConnectUI, openTonConnectModal } from "@/lib/atf/tonconnect";
import type { PublicConfig, SessionUser, Withdrawal } from "@/lib/atf/types";
import {
  atfToUsd,
  cn,
  formatAtf,
  formatAtfShort,
  formatUsd,
  shortWallet,
  timeAgo,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MiningCore, StageSparks } from "@/components/mining-core";
import { LevelDetail, MinerStore } from "@/components/miner-store";
import { WalletSheet } from "@/components/wallet-sheet";

type Tab = "mine" | "tasks" | "miners" | "friends" | "profile";
type TaskRow = Awaited<ReturnType<typeof listActiveTasks>>[number];
type Quote = Awaited<ReturnType<typeof getLevelQuote>>;

const TOKEN_KEY = "atf_session";
const SOUND_KEY = "atf_sound";

function telegramInitData() {
  if (typeof window === "undefined") return "";
  const w = window as unknown as {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready?: () => void;
        expand?: () => void;
        HapticFeedback?: { impactOccurred?: (s: string) => void };
      };
    };
  };
  w.Telegram?.WebApp?.ready?.();
  w.Telegram?.WebApp?.expand?.();
  return w.Telegram?.WebApp?.initData ?? "";
}

function haptic() {
  try {
    (
      window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred?: (s: string) => void } } } }
    ).Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  } catch {
    /* optional */
  }
}

function openLink(url: string) {
  const w = window as unknown as {
    Telegram?: { WebApp?: { openTelegramLink?: (u: string) => void; openLink?: (u: string) => void } };
  };
  if (url.startsWith("https://t.me/") && w.Telegram?.WebApp?.openTelegramLink) {
    w.Telegram.WebApp.openTelegramLink(url);
    return;
  }
  if (w.Telegram?.WebApp?.openLink) {
    w.Telegram.WebApp.openLink(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export function MiniApp() {
  const [tab, setTab] = useState<Tab>("mine");
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState<{ a: number; b: number } | null>(null);
  const [answer, setAnswer] = useState("");
  const [now, setNow] = useState(Date.now());
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [friends, setFriends] = useState<{
    friends: { firstName: string; username: string; atfId: string; createdAt: string }[];
    inviteLink: string;
    reward: number;
  } | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [help, setHelp] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [wdAmount, setWdAmount] = useState("");
  const [sound, setSound] = useState(false);
  const [claimNote, setClaimNote] = useState<string | null>(null);
  const [levelNote, setLevelNote] = useState<number | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [payHint, setPayHint] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastBoost = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setSound(localStorage.getItem(SOUND_KEY) !== "0");
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam === "tasks" || tabParam === "miners" || tabParam === "friends" || tabParam === "profile") {
      setTab(tabParam);
    }
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const block = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
    };
    el.addEventListener("contextmenu", block);
    el.addEventListener("selectstart", block);
    return () => {
      el.removeEventListener("contextmenu", block);
      el.removeEventListener("selectstart", block);
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await getPublicConfig();
        if (cancelled) return;
        setConfig(cfg);
        const initData = telegramInitData();
        const boot = await bootstrapUser({
          data: {
            initData,
            startParam: new URLSearchParams(window.location.search).get("tgWebAppStartParam") ?? "",
          },
        });
        if (cancelled) return;
        setToken(boot.token);
        setUser(boot.user);
        sessionStorage.setItem(TOKEN_KEY, boot.token);
        if (boot.user.leveledUpTo) setLevelNote(boot.user.leveledUpTo);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to start");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    if (tab === "tasks") {
      listActiveTasks({ data: { token } })
        .then(setTasks)
        .catch((e) => setError(String(e.message ?? e)));
    }
    if (tab === "friends") {
      getFriends({ data: { token } })
        .then(setFriends)
        .catch((e) => setError(String(e.message ?? e)));
    }
    if (tab === "profile") {
      myWithdrawals({ data: { token } })
        .then(setWithdrawals)
        .catch((e) => setError(String(e.message ?? e)));
    }
  }, [tab, token]);

  useEffect(() => {
    if (!token) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const ui = await getTonConnectUI();
      if (!ui || cancelled) return;
      const apply = async (address?: string | null) => {
        const friendly = friendlyFromTonConnect(address);
        if (!friendly) return;
        try {
          const next = await saveWallet({ data: { token, address: friendly } });
          if (!cancelled) {
            setUser(next);
            flash("Wallet connected");
          }
        } catch (err) {
          if (!cancelled) setError(err instanceof Error ? err.message : "Wallet failed");
        }
      };
      if (ui.account?.address) void apply(ui.account.address);
      unsub = ui.onStatusChange((wallet) => {
        if (wallet?.account?.address) void apply(wallet.account.address);
      });
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [token]);

  useEffect(() => {
    if (!token || tab !== "tasks") return;
    const processing = tasks.some((t) => t.uiState === "processing");
    if (!processing) return;
    const t = setTimeout(() => {
      listActiveTasks({ data: { token } }).then(setTasks).catch(() => undefined);
    }, 3000);
    return () => clearTimeout(t);
  }, [tasks, token, tab]);

  const remaining = useMemo(() => {
    if (!user?.miningStartedAt || !config) return 0;
    const end = new Date(user.miningStartedAt).getTime() + config.cycleHours * 3_600_000;
    return Math.max(0, end - now);
  }, [user, config, now]);

  const boosted = Boolean(user && user.boostUntil > now);

  const livePending = useMemo(() => {
    if (!user || !config || !user.miningStartedAt) return 0;
    const start = new Date(user.miningStartedAt).getTime();
    const cap = config.cycleHours * 3_600_000;
    const end = Math.min(now, start + cap);
    if (end <= start) return 0;
    const base = user.ratePerHour / (boosted ? config.tapBoostMult : 1);
    const boostEnd = user.boostUntil || 0;
    const boostStart = boostEnd - config.tapBoostMs;
    const o0 = Math.max(start, boostStart);
    const o1 = Math.min(end, boostEnd);
    const boostMs = Math.max(0, o1 - o0);
    const totalMs = end - start;
    const mined =
      ((totalMs - boostMs) / 3_600_000) * base + (boostMs / 3_600_000) * base * config.tapBoostMult;
    return Math.round(mined * 10000) / 10000;
  }, [user, config, now, boosted]);

  const status = useMemo(() => {
    if (!user?.miningStartedAt) return "READY" as const;
    if (remaining === 0) return "READY" as const;
    return "MINING" as const;
  }, [user, remaining, livePending]);

  function applyUser(next: SessionUser) {
    setUser(next);
    if (next.leveledUpTo && next.leveledUpTo !== user?.level) {
      setLevelNote(next.leveledUpTo);
      playLevelUpSound(sound);
    }
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function onStart() {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      if (!user?.miningStartedAt && !user?.lastClaimAt && !captcha) {
        const c = await getCaptcha({ data: { token } });
        setCaptcha(c);
        setBusy(false);
        return;
      }
      const next = await startMining({
        data: { token, answer: answer ? Number(answer) : undefined },
      });
      applyUser(next);
      setCaptcha(null);
      setAnswer("");
      playTapSound(sound);
      flash("Mining started");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start");
    } finally {
      setBusy(false);
    }
  }

  async function onClaim() {
    if (!token) return;
    if (livePending <= 0.0001) {
      flash("Still mining…");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await claimMining({ data: { token } });
      applyUser(res.user);
      playClaimSound(sound);
      setClaimNote(`${formatAtf(res.claimed, 4)} ZX`);
      setTimeout(() => setClaimNote(null), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }

  async function onCoinTap() {
    if (!token || !user?.miningStartedAt || !config) return;
    const t = Date.now();
    if (t - lastBoost.current < 400) return;
    if (t < user.boostUntil) return;
    const coolUntil = (user.boostUntil || 0) + (config.tapBoostCooldownMs || 5000);
    if ((user.boostUntil || 0) > 0 && t < coolUntil) {
      haptic();
      return;
    }
    lastBoost.current = t;
    haptic();
    playTapSound(sound);
    try {
      const next = await tapBoost({ data: { token } });
      applyUser(next);
    } catch {
      /* start mining first */
    }
  }

  async function onGoTask(task: TaskRow) {
    if (!token) return;
    setError("");
    if (task.type === "wallet" && !user?.walletAddress) {
      setWalletOpen(true);
      return;
    }
    if (task.url) openLink(task.url);
    setBusy(true);
    try {
      await openTask({ data: { token, taskId: task.id } });
      const next = await listActiveTasks({ data: { token } });
      setTasks(next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Task failed";
      if (msg === "WALLET_REQUIRED") setWalletOpen(true);
      else setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onClaimTask(task: TaskRow) {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const res = await claimTask({ data: { token, taskId: task.id } });
      applyUser(res.user);
      const next = await listActiveTasks({ data: { token } });
      setTasks(next);
      playTaskSound(sound);
      setClaimNote(`${formatAtf(res.reward, 0)} ZX`);
      setTimeout(() => setClaimNote(null), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task failed");
    } finally {
      setBusy(false);
    }
  }

  async function onConnectWallet() {
    setError("");
    try {
      if (user?.walletAddress) {
        await disconnectTonConnect();
      }
      await openTonConnectModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open TON Connect");
    }
  }

  async function onSaveWallet(address: string) {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const next = await saveWallet({ data: { token, address } });
      applyUser(next);
      setWalletOpen(false);
      playClaimSound(sound);
      flash("Wallet connected");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDisconnectWallet() {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const next = await disconnectWallet({ data: { token } });
      await disconnectTonConnect();
      applyUser(next);
      setWalletOpen(false);
      playTapSound(sound);
      flash("Wallet disconnected");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setBusy(false);
    }
  }

  async function onWithdraw() {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const res = await requestWithdraw({ data: { token, amount: Number(wdAmount) } });
      applyUser(res.user);
      setWdAmount("");
      const list = await myWithdrawals({ data: { token } });
      setWithdrawals(list);
      setWithdrawOpen(false);
      playClaimSound(sound);
      flash("Withdrawal submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdraw failed");
    } finally {
      setBusy(false);
    }
  }

  async function openLevel(level: number) {
    if (!token) return;
    setError("");
    try {
      const q = await getLevelQuote({ data: { token, level } });
      setQuote(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load level");
    }
  }

  async function buyLevel() {
    if (!token || !quote) return;
    if (!user?.walletAddress) {
      setWalletOpen(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await createLevelInvoice({ data: { token, level: quote.level } });
      if (res.unlocked && res.user) {
        applyUser(res.user);
        setQuote(null);
        setLevelNote(quote.level);
        playLevelUpSound(sound);
        return;
      }
      if ("links" in res && res.links) {
        openLink(res.links.tonkeeper);
        setPayHint(res.payment.id);
        flash(`Pay ${res.payment.amountTon} TON · confirm in wallet`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Buy failed");
    } finally {
      setBusy(false);
    }
  }

  async function confirmPay() {
    if (!token || !payHint) return;
    setBusy(true);
    try {
      const res = await verifyLevelPayment({ data: { token, paymentId: payHint } });
      applyUser(res.user);
      setPayHint(null);
      setQuote(null);
      playLevelUpSound(sound);
      if (res.user.level) setLevelNote(res.user.level);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment not confirmed yet");
    } finally {
      setBusy(false);
    }
  }

  if (!user || !config) {
    return (
      <div className="atf-stage no-callout relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
        <img src="/zx-bg.jpg" alt="" className="atf-bg-bloom" />
        <img src="/zx-bg.jpg" alt="" className="atf-bg-img" />
        <div className="atf-vignette" />
        <img src="/zx-coin.png" alt="" className="relative size-24" />
        <p className="relative mt-4 font-display text-sm uppercase tracking-[0.28em] text-gold">Booting miner</p>
        {error ? <p className="relative mt-3 text-sm text-danger">{error}</p> : null}
      </div>
    );
  }

  const mining = Boolean(user.miningStartedAt);
  const holding = user.holdingBalance ?? 0;
  const pool = user.balance;
  const assets = holding + pool;
  const usdLeft = user.nextRequiredUsd ? Math.max(0, user.nextRequiredUsd - holding * config.atfUsd) : 0;

  return (
    <div
      ref={stageRef}
      className="atf-stage no-callout relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden bg-bg pb-24"
    >
      <img src="/zx-bg.jpg" alt="" className="atf-bg-bloom" />
      <img src="/zx-bg.jpg" alt="" className="atf-bg-img" />
      <div className="atf-vignette" />
      <div className="atf-dust" />
      <StageSparks />

      <header className="relative z-10 flex items-start justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full bg-elevated/80 text-gold"
              onClick={() => {
                const next = !sound;
                setSound(next);
                localStorage.setItem(SOUND_KEY, next ? "1" : "0");
              }}
              aria-label={sound ? "Mute sounds" : "Enable sounds"}
            >
              {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-muted" />}
            </button>
            <span className="lvl-badge px-2.5 py-0.5 font-display text-xs">Lvl {user.level}</span>
            <span
              className={cn(
                "status-pill inline-flex items-center gap-1 px-2.5 py-0.5 font-display text-[11px] uppercase",
                status === "READY" && "bg-ok/15 text-ok",
                status === "MINING" && "bg-gold/18 text-gold",
                boosted && "bg-ok/15 text-ok",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "READY" || boosted ? "bg-ok shadow-[0_0_8px_var(--color-ok)]" : "bg-gold",
                  status === "MINING" && !boosted && "mining-glow",
                )}
              />
              {boosted ? "MAX SPEED" : status}
            </span>
          </div>
          <p className="lvl-up-hint px-0.5 font-display text-[11px] font-semibold">
            {user.nextRequiredUsd ? `${formatUsd(usdLeft)} left to Lvl UP` : "Max level"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setWalletOpen(true);
          }}
          className="connect-pill inline-flex size-9 items-center justify-center rounded-full"
          aria-label={user.walletAddress ? shortWallet(user.walletAddress) : "Connect TON wallet"}
        >
          <Wallet className="size-4 text-gold" />
        </button>
      </header>

      {error ? <p className="relative z-10 mx-4 mt-3 text-center text-sm text-danger">{error}</p> : null}

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-2 pt-1.5">
        {tab === "mine" ? (
          <div className="rise-in flex min-h-0 flex-1 flex-col items-center">
            <p className="font-display text-[11px] uppercase tracking-[0.42em] text-muted">Assets</p>
            <p className="mt-0.5 font-display text-[2.55rem] font-semibold leading-none tabular-nums tracking-tight">
              {formatAtfShort(assets)} <span className="text-lg font-medium text-gold">ZX</span>
            </p>
            <p className="mt-1 font-display text-sm text-muted">({formatUsd(atfToUsd(assets))})</p>
            <div className="mt-2.5 w-full max-w-xs space-y-1.5">
              <div className="wallet-pill flex items-center justify-center gap-1 rounded-full px-3 py-1.5 font-display text-[11px] uppercase tracking-wider text-muted">
                Holding wallet: <span className="text-fg">{formatAtfShort(holding)}</span>
                <span className="text-gold">ZX</span>
              </div>
              <div className="wallet-pill flex items-center justify-center gap-1 rounded-full px-3 py-1.5 font-display text-[11px] uppercase tracking-wider text-muted">
                Pool wallet: <span className="text-fg">{formatAtfShort(pool)}</span>
                <span className="text-gold">ZX</span>
              </div>
            </div>
            <div className="live-plate mt-2.5 w-full max-w-[228px] rounded-2xl px-4 py-1.5 text-center">
              <p className="live-green font-display text-[2.05rem] font-semibold leading-none tabular-nums">
                +{formatAtf(mining ? livePending : 0, 4)}{" "}
                <span className="text-[1.05rem] font-semibold">ZX/s</span>
              </p>
            </div>
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <MiningCore active={mining} boosted={boosted} onHelp={() => setHelp(true)} onTap={onCoinTap} />
            </div>
            {captcha ? (
              <Card className="mt-1 w-full p-4">
                <p className="text-sm text-muted">Solve to start mining</p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {captcha.a} + {captcha.b} = ?
                </p>
                <Input
                  className="mt-3"
                  inputMode="numeric"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Answer"
                />
                <button
                  type="button"
                  className="btn-claim mt-3 h-12 w-full rounded-full font-display text-sm font-bold tracking-[0.2em]"
                  disabled={busy}
                  onClick={onStart}
                >
                  CONFIRM
                </button>
              </Card>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={mining ? onClaim : onStart}
                className="btn-claim mb-1 mt-0 w-full shrink-0 rounded-full font-display text-lg font-bold tracking-[0.32em]"
                style={{ height: 54 }}
              >
                {mining ? "CLAIM" : "START"}
              </button>
            )}
          </div>
        ) : null}

        {tab === "tasks" ? (
          <div className="rise-in space-y-2 pt-1">
            <h2 className="text-center font-display text-[1.65rem] font-semibold tracking-tight">Earn Rewards</h2>
            <p className="text-center text-sm text-muted">Rewards go directly to Pool Wallet</p>
            {tasks.map((task) => (
              <div key={task.id} className="task-row">
                <span className="task-icon">{taskGlyph(task.type)}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[15px] font-medium leading-snug">
                    {task.title}
                    {task.isRecurring ? (
                      <span className="rounded-full bg-gold/18 px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-gold">
                        Recurring
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 font-display text-[13px] text-muted">+{task.reward} ZX</p>
                </div>
                {task.uiState === "go" ? (
                  <button
                    type="button"
                    className="task-go shrink-0"
                    disabled={busy}
                    onClick={() => onGoTask(task)}
                  >
                    Go
                  </button>
                ) : task.uiState === "processing" ? (
                  <span className="task-processing grid place-items-center">Processing</span>
                ) : task.uiState === "claim" ? (
                  <button
                    type="button"
                    className="task-claim shrink-0"
                    disabled={busy}
                    onClick={() => onClaimTask(task)}
                  >
                    Claim
                  </button>
                ) : (
                  <span className="task-done grid place-items-center">Done</span>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {tab === "miners" ? (
          <MinerStore user={user} config={config} onOpenLevel={openLevel} />
        ) : null}

        {tab === "friends" ? (
          <div className="rise-in space-y-2.5 pt-1">
            <h2 className="text-center font-display text-2xl font-semibold tracking-tight">Friends</h2>
            <p className="text-center text-sm text-muted">
              Earn {friends?.reward ?? config.referralReward} ZX per invite plus a mining boost.
            </p>
            <Card className="panel p-4">
              <p className="font-display text-[10px] uppercase tracking-wider text-muted">Your invite link</p>
              <p className="mt-1 break-all font-display text-xs text-fg">{friends?.inviteLink}</p>
              <button
                type="button"
                className="btn-claim mt-3 h-11 w-full rounded-full font-display text-sm font-bold tracking-[0.18em]"
                onClick={async () => {
                  if (!friends) return;
                  await navigator.clipboard.writeText(friends.inviteLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </Card>
            <div className="space-y-2">
              {(friends?.friends ?? []).length === 0 ? (
                <p className="text-center text-sm text-muted">No referrals yet.</p>
              ) : (
                friends?.friends.map((f) => (
                  <Card key={f.atfId} className="panel flex items-center justify-between px-3 py-2.5">
                    <div>
                      <p className="font-medium">{f.firstName}</p>
                      <p className="font-display text-[11px] text-muted">{f.atfId}</p>
                    </div>
                    <p className="text-xs text-muted">{timeAgo(f.createdAt)}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : null}

        {tab === "profile" ? (
          <div className="rise-in space-y-1.5 pt-1">
            <h2 className="mb-2.5 text-center font-display text-2xl font-semibold tracking-tight">Profile</h2>
            <ProfileRow icon={<UserIcon className="size-4" />} title="User ID" sub={user.telegramId} />
            <ProfileRow
              icon={user.isVerified ? <Check className="size-4 text-ok" /> : <Check className="size-4 text-muted" />}
              title="Account Verification"
              sub={user.isVerified ? "Verified" : "Unverified"}
              action={
                user.isVerified ? null : (
                  <button
                    type="button"
                    className="btn-claim h-8 rounded-full px-3 font-display text-[11px] font-bold"
                    onClick={() => setWalletOpen(true)}
                  >
                    Verify
                  </button>
                )
              }
            />
            <button
              type="button"
              className="panel flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
              onClick={() => {
                const next = !sound;
                setSound(next);
                localStorage.setItem(SOUND_KEY, next ? "1" : "0");
              }}
            >
              {sound ? <Volume2 className="size-4 text-gold" /> : <VolumeX className="size-4 text-danger" />}
              <div>
                <p className="font-medium leading-tight">Sound effects</p>
                <p className="text-xs text-muted">{sound ? "On" : "Muted — tap to enable"}</p>
              </div>
            </button>
            <ProfileRow
              icon={<img src="/zx-coin-sm.png" alt="" className="size-5" />}
              title="Assets"
              sub={`${formatAtfShort(assets)} ZX`}
              extra={
                <span className="rounded-full bg-ok/15 px-2 py-0.5 font-display text-[11px] text-ok">
                  ≈ {formatUsd(atfToUsd(assets), 3)}
                </span>
              }
            />
            <ProfileRow
              icon={<CreditCard className="size-4 text-gold" />}
              title="Holding Wallet"
              sub={`${formatAtfShort(holding)} ZX`}
            />
            <ProfileRow
              icon={<Building2 className="size-4 text-gold" />}
              title="Pool Wallet"
              sub="Withdrawable balance"
              extra={<span className="font-display text-sm font-semibold text-ok">{formatAtfShort(pool)} ZX</span>}
            />
            <p className="pt-2 text-center font-display text-sm uppercase tracking-[0.32em] text-gold">Controls</p>
            <ProfileRow
              icon={<ExternalLink className="size-4" />}
              title="Withdraw"
              sub="Transfer Pool to Wallet"
              action={
                <button
                  type="button"
                  className="btn-claim h-8 rounded-full px-3 font-display text-[11px] font-bold"
                  onClick={() => {
                    setError("");
                    setWithdrawOpen(true);
                  }}
                >
                  Withdraw
                </button>
              }
            />
            <button
              type="button"
              className="panel flex w-full items-center justify-between rounded-xl px-3 py-2.5"
              onClick={() => setHistoryOpen(true)}
            >
              <span className="font-medium">History</span>
              <span className="text-xs text-muted">{withdrawals.length} records</span>
            </button>
          </div>
        ) : null}
      </main>

      {toast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-accent-fg">
          {toast}
        </div>
      ) : null}

      {claimNote ? (
        <div className="claim-banner pointer-events-none fixed left-1/2 top-[max(4.5rem,env(safe-area-inset-top))] z-40 w-[min(92%,22rem)] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
            <img src="/zx-coin-sm.png" alt="" className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">Congratulation!</p>
              <p className="text-xs">You received {claimNote}</p>
            </div>
            <span className="grid size-8 place-items-center rounded-full bg-ok text-bg">
              <Check className="size-4" />
            </span>
          </div>
        </div>
      ) : null}

      {levelNote ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/50 p-6 backdrop-blur-[2px]">
          <button type="button" className="levelup-card w-full max-w-xs rounded-3xl px-6 py-8 text-center" onClick={() => setLevelNote(null)}>
            <img src="/zx-coin.png" alt="" className="mx-auto size-20" />
            <p className="mt-3 font-display text-2xl font-bold text-gold">Level up!</p>
            <p className="mt-1 text-sm text-fg">Your miner has been upgraded to Lvl {levelNote}</p>
            <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-gold text-accent-fg">
              <Check className="size-5" />
            </span>
          </button>
        </div>
      ) : null}

      {help ? (
        <Modal onClose={() => setHelp(false)} title="ZX Miner">
          <p className="text-sm leading-relaxed text-muted">
            Tap the coin for a short speed boost. CLAIM moves mined ZX into the Pool Wallet. Holding Wallet
            unlocks miner levels. Withdraw sends Pool Wallet ZX to your connected TON address. Min{" "}
            {config.minWithdraw} ZX, fee {config.withdrawFee} ZX.
          </p>
        </Modal>
      ) : null}

      {walletOpen ? (
        <WalletSheet
          current={user.walletAddress}
          busy={busy}
          onClose={() => setWalletOpen(false)}
          onConnect={() => {
            void onConnectWallet();
          }}
          onDisconnect={onDisconnectWallet}
        />
      ) : null}

      {quote ? (
        <LevelDetail
          quote={quote}
          busy={busy}
          confirmLabel={payHint ? "Verify payment" : undefined}
          onClose={() => {
            setQuote(null);
            setPayHint(null);
          }}
          onBuy={payHint ? confirmPay : buyLevel}
        />
      ) : null}

      {payHint && quote ? (
        <div className="pointer-events-none fixed bottom-28 left-1/2 z-50 w-[min(92%,22rem)] -translate-x-1/2 rounded-full bg-elevated px-4 py-2 text-center text-xs text-gold">
          Confirm the TON transfer, then tap Buy again to verify.
        </div>
      ) : null}

      {withdrawOpen ? (
        <Modal onClose={() => setWithdrawOpen(false)} title="Withdraw">
          <p className="text-sm text-muted">
            From Pool Wallet. Min {config.minWithdraw} ZX, fee {config.withdrawFee} ZX.
          </p>
          <Input
            className="mt-3"
            inputMode="decimal"
            placeholder={`Amount (min ${config.minWithdraw})`}
            value={wdAmount}
            onChange={(e) => setWdAmount(e.target.value)}
          />
          <button
            type="button"
            className="btn-claim mt-3 h-11 w-full rounded-full font-display text-sm font-bold tracking-[0.18em]"
            disabled={busy}
            onClick={onWithdraw}
          >
            REQUEST PAYOUT
          </button>
        </Modal>
      ) : null}

      {historyOpen ? (
        <Modal onClose={() => setHistoryOpen(false)} title="Withdrawal History">
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-muted">No withdrawals yet.</p>
            ) : (
              withdrawals.map((w) => (
                <Card key={w.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-semibold tabular-nums">{formatAtf(w.netAmount)} ZX</p>
                    <Badge
                      tone={
                        w.status === "paid" || w.status === "approved"
                          ? "ok"
                          : w.status === "rejected"
                            ? "danger"
                            : "warn"
                      }
                    >
                      {w.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Requested {formatAtf(w.amount)} · Fee {formatAtf(w.fee, 0)} · {timeAgo(w.createdAt)}
                  </p>
                  <p className="mt-1 break-all font-display text-[11px] text-subtle">{w.walletAddress}</p>
                </Card>
              ))
            )}
          </div>
        </Modal>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-end border-t border-border bg-bg/95 px-1 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm">
        {(
          [
            ["mine", Pickaxe, "Mine"],
            ["tasks", ClipboardList, "Tasks"],
            ["miners", Zap, "Miners"],
            ["friends", Users, "Friends"],
            ["profile", UserIcon, "Profile"],
          ] as const
        ).map(([id, Icon, label]) => {
          const active = tab === id;
          if (id === "miners") {
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setError("");
                  setTab(id);
                }}
                className="flex h-16 flex-1 flex-col items-center justify-end gap-0.5 pb-1 text-[11px] text-muted"
              >
                <span
                  className={cn(
                    "grid size-12 -translate-y-2 place-items-center rounded-[14px] bg-ok text-bg shadow-[0_8px_20px_rgba(0,255,106,0.35)]",
                    active && "ring-2 ring-gold",
                  )}
                  style={{ clipPath: "polygon(25% 4%, 75% 4%, 98% 50%, 75% 96%, 25% 96%, 2% 50%)" }}
                >
                  <Icon className="size-5" />
                </span>
                <span className={active ? "text-gold" : "text-muted"}>{label}</span>
              </button>
            );
          }
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setError("");
                setTab(id);
              }}
              className={cn(
                "flex h-16 flex-1 flex-col items-center justify-center gap-1 text-[11px]",
                active ? "text-gold" : "text-muted",
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ProfileRow({
  icon,
  title,
  sub,
  extra,
  action,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  extra?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex items-center gap-3 rounded-xl px-3 py-2.5">
      <div className="grid size-9 place-items-center rounded-lg bg-surface text-gold">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="truncate text-xs text-muted">{sub}</p>
      </div>
      {extra}
      {action}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function taskGlyph(type: string) {
  if (type === "twitter") return <Repeat2 className="size-4 text-[#f97316]" />;
  if (type === "website") return <Globe className="size-4 text-[#38bdf8]" />;
  if (type === "react") return <Flame className="size-4 text-[#fb923c]" />;
  if (type === "telegram") return <MessageCircle className="size-4 text-[#2aabee]" />;
  if (type === "wallet") return <Wallet className="size-4 text-gold" />;
  if (type === "partner") return <Share2 className="size-4 text-gold" />;
  return <ClipboardList className="size-4 text-muted" />;
}
