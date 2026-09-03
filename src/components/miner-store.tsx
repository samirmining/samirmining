import { useEffect, useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getLevelCard, MAX_LEVEL } from "@/lib/atf/levels";
import type { PublicConfig, SessionUser } from "@/lib/atf/types";
import { cn, formatAtf, formatUsd } from "@/lib/utils";

const COLS = 2;
const CARD_H = 172;
const GAP = 10;
const ROW_H = CARD_H + GAP;
const OVERSCAN = 4;

type Quote = {
  level: number;
  usdPerHour: number;
  ratePerHour: number;
  speedThs: number;
  requiredAtf: number;
  requiredUsd: number;
  holding: number;
  pool: number;
  assets: number;
  missingAtf: number;
  missingUsd: number;
  unlocked: boolean;
  canBuy: boolean;
};

function formatRate(n: number) {
  return `${n.toFixed(3)}$`;
}

function needAtfLabel(need: number) {
  return Math.max(0, Math.floor(need + 1e-9)).toLocaleString("en-US");
}

export function MinerStore({
  user,
  config,
  onOpenLevel,
}: {
  user: SessionUser;
  config: PublicConfig;
  onOpenLevel: (level: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const startRowRef = useRef(0);
  const [startRow, setStartRow] = useState(0);
  const [height, setHeight] = useState(520);
  const [pnlOpen, setPnlOpen] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const next = Math.max(0, Math.floor(el.scrollTop / ROW_H) - OVERSCAN);
      if (next !== startRowRef.current) {
        startRowRef.current = next;
        setStartRow(next);
      }
    };
    const applyHeight = () => setHeight(el.clientHeight || 520);
    applyHeight();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(applyHeight) : null;
    ro?.observe(el);
    const row = Math.floor((Math.max(1, user.level) - 1) / COLS);
    el.scrollTop = Math.max(0, row * ROW_H - 24);
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [user.level]);

  const visRows = Math.ceil(height / ROW_H) + OVERSCAN * 2;
  const start = startRow * COLS;
  const end = Math.min(MAX_LEVEL, (startRow + visRows) * COLS);
  const items = useMemo(
    () => Array.from({ length: Math.max(0, end - start) }, (_, i) => getLevelCard(start + i + 1)),
    [start, end],
  );

  const holding = user.holdingBalance ?? 0;
  const points = user.pnlHistory ?? [];
  const usdLeft = user.nextRequiredUsd ? Math.max(0, user.nextRequiredUsd - holding * config.atfUsd) : 0;
  const peak = user.peakLevel || user.level;
  const fromPeak = Math.max(0, peak - user.level);
  const pnl = user.dailyPnl ?? 0;

  return (
    <div className="rise-in flex min-h-0 flex-1 flex-col pt-1">
      <h2 className="text-center font-display text-[1.65rem] font-semibold tracking-tight">Miner Store</h2>
      <p className="text-center text-sm text-muted">Auto-unlocks based on your ZX Holding.</p>

      <button
        type="button"
        className="miner-journey mt-3 w-full rounded-[18px] px-3.5 py-3 text-left"
        onClick={() => setPnlOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            My Level Journey
          </p>
          {fromPeak > 0 ? <span className="miner-peak-chip">{fromPeak} from peak</span> : null}
        </div>
        <p className="mt-1 font-display text-[1.35rem] font-semibold leading-tight">
          Level {user.level} <span className="text-muted">•</span> Peak {peak}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          Today's P&L{" "}
          <span className={cn("font-display font-semibold", pnl >= 0 ? "text-ok" : "text-danger")}>
            {pnl >= 0 ? "+" : ""}
            {formatAtf(pnl, Math.abs(pnl) >= 10 ? 1 : 2)} ZX
          </span>
        </p>
        <Sparkline points={points} />
        <p className="mt-0.5 text-[11px] text-muted">Tap to view full PNL chart</p>
      </button>

      <p className="mt-2 px-1 font-display text-[11px] text-ok">
        {user.nextRequiredUsd ? `${formatUsd(usdLeft)} left to Lvl UP` : "Max level"}
      </p>

      <div ref={scroller} className="miner-scroller mt-1 min-h-0 flex-1 pb-2">
        <div className="relative" style={{ height: Math.ceil(MAX_LEVEL / COLS) * ROW_H }}>
          {items.map((card) => {
            const idx = card.level - 1;
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            const active = user.level >= card.level;
            const nextUp = card.level === user.level + 1;
            const need = Math.max(0, card.requiredAtf - holding);
            const usdNeed = Math.max(0, card.requiredUsd - holding * config.atfUsd);
            return (
              <button
                key={card.level}
                type="button"
                onClick={() => onOpenLevel(card.level)}
                className="miner-tile absolute flex flex-col px-2.5 pb-2.5 pt-2 text-left"
                style={{
                  top: row * ROW_H,
                  left: col === 0 ? 0 : `calc(50% + ${GAP / 2}px)`,
                  width: `calc(50% - ${GAP / 2}px)`,
                  height: CARD_H,
                }}
              >
                <p className="font-display text-[13px] font-semibold text-gold">Lvl {card.level}</p>
                <div className="miner-rate-well mx-auto mt-1 grid h-[58px] w-[58px] place-items-center">
                  <p className="font-display text-[1.15rem] font-bold leading-none text-ok">
                    {formatRate(card.usdPerHour)}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center justify-between px-0.5 font-display text-[10px] text-muted">
                  <span>Speed</span>
                  <span className="text-[11px] font-semibold text-fg">{card.speedThs.toFixed(2)} TH/s</span>
                </div>
                <div className="mt-auto">
                  {active ? (
                    <span className="miner-pill-active">ACTIVE</span>
                  ) : nextUp ? (
                    <>
                      <span className="miner-pill-need">
                        <Lock className="size-3" />
                        NEED {needAtfLabel(need)} ZX
                      </span>
                      <p className="mt-1 text-center font-display text-[10px] text-ok">
                        {formatUsd(usdNeed)} left to unlock
                      </p>
                    </>
                  ) : (
                    <span className="miner-lockbar">
                      <Lock className="size-3.5 text-gold" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {pnlOpen ? <PnlChartModal points={points} daily={pnl} peak={peak} onClose={() => setPnlOpen(false)} /> : null}
    </div>
  );
}

export function LevelDetail({
  quote,
  busy,
  confirmLabel,
  onClose,
  onBuy,
}: {
  quote: Quote;
  busy?: boolean;
  confirmLabel?: string;
  onClose: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Lvl {quote.level} Details</h3>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <Row k="Mining Speed" v={`${quote.speedThs.toFixed(2)} TH/s`} />
        <Row
          k="Required Holding"
          v={`${quote.requiredAtf.toLocaleString(undefined, { maximumFractionDigits: 2 })} ZX (${formatUsd(quote.requiredUsd)})`}
        />
        <Row k="Your Assets" v={`${quote.assets.toFixed(4)} ZX`} />
        <Row
          k="Missing"
          v={`${quote.missingAtf.toLocaleString(undefined, { maximumFractionDigits: 2 })} ZX (${formatUsd(quote.missingUsd)})`}
        />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-11 rounded-full border border-border font-display text-sm font-semibold text-muted"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-claim h-11 rounded-full font-display text-sm font-bold"
            disabled={busy || quote.unlocked}
            onClick={onBuy}
          >
            {quote.unlocked ? "Unlocked" : confirmLabel || `Buy Level ${quote.level}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2.5 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-display font-semibold">{v}</span>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 320;
  const h = 56;
  if (!points.length) {
    return (
      <div className="mt-2 grid h-14 place-items-center rounded-lg bg-white/4 text-[11px] text-muted">
        No PNL yet — claim to build your chart
      </div>
    );
  }
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 0.01);
  const d = points
    .map((p, i) => {
      const x = (i / Math.max(1, points.length - 1)) * w;
      const y = h - 8 - ((p - min) / (max - min || 1)) * (h - 16);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-1 w-full" aria-hidden>
      <path d={d} fill="none" stroke="var(--color-pnl)" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function PnlChartModal({
  points,
  daily,
  peak,
  onClose,
}: {
  points: number[];
  daily: number;
  peak: number;
  onClose: () => void;
}) {
  const data = points.map((v, i) => ({ i: i + 1, v }));
  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">PNL chart</h3>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        {points.length === 0 ? (
          <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border text-center">
            <div>
              <p className="font-display text-sm font-semibold">No history yet</p>
              <p className="mt-1 px-6 text-xs text-muted">Claim mining rewards to build your PNL chart.</p>
            </div>
          </div>
        ) : (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="i" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "#141416",
                    border: "1px solid #2a2418",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${Number(value ?? 0).toFixed(4)} ZX`, "PNL"]}
                  labelFormatter={(label) => `Claim ${label}`}
                />
                <Line type="monotone" dataKey="v" stroke="var(--color-pnl)" strokeWidth={2.4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-3 text-sm text-muted">
          Today {formatAtf(daily, 4)} ZX · Peak Lvl {peak}
        </p>
      </div>
    </div>
  );
}
