import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SPARKS = [
  { t: "3%", l: "18%", d: "0s", s: "2px", star: false },
  { t: "6%", l: "72%", d: "0.35s", s: "3px", star: true },
  { t: "10%", l: "42%", d: "1.1s", s: "2px", star: false },
  { t: "14%", l: "8%", d: "0.6s", s: "4px", star: true },
  { t: "16%", l: "88%", d: "1.8s", s: "2px", star: false },
  { t: "20%", l: "28%", d: "0.2s", s: "3px", star: false },
  { t: "24%", l: "64%", d: "2.2s", s: "2px", star: true },
  { t: "28%", l: "14%", d: "0.9s", s: "3px", star: false },
  { t: "32%", l: "92%", d: "1.4s", s: "2px", star: false },
  { t: "36%", l: "48%", d: "0.5s", s: "5px", star: true },
  { t: "40%", l: "6%", d: "1.7s", s: "2px", star: false },
  { t: "44%", l: "78%", d: "0.1s", s: "3px", star: false },
  { t: "48%", l: "22%", d: "2.4s", s: "2px", star: true },
  { t: "52%", l: "58%", d: "0.8s", s: "4px", star: false },
  { t: "56%", l: "86%", d: "1.5s", s: "2px", star: false },
  { t: "60%", l: "12%", d: "2.0s", s: "3px", star: true },
  { t: "64%", l: "38%", d: "0.4s", s: "2px", star: false },
  { t: "68%", l: "70%", d: "1.2s", s: "3px", star: false },
  { t: "72%", l: "4%", d: "1.9s", s: "2px", star: true },
  { t: "76%", l: "94%", d: "0.7s", s: "4px", star: false },
  { t: "80%", l: "32%", d: "2.3s", s: "2px", star: false },
  { t: "84%", l: "54%", d: "1.0s", s: "3px", star: true },
  { t: "88%", l: "16%", d: "1.6s", s: "2px", star: false },
  { t: "12%", l: "56%", d: "2.6s", s: "2px", star: false },
  { t: "42%", l: "36%", d: "0.35s", s: "2px", star: true },
  { t: "66%", l: "82%", d: "2.8s", s: "3px", star: false },
  { t: "22%", l: "96%", d: "1.3s", s: "2px", star: false },
  { t: "8%", l: "32%", d: "2.1s", s: "3px", star: true },
  { t: "92%", l: "44%", d: "0.55s", s: "2px", star: false },
  { t: "18%", l: "50%", d: "1.65s", s: "2px", star: false },
];

const STAGE_SPARKS = [
  { t: "6%", l: "6%", d: "0.2s", s: "2px" },
  { t: "11%", l: "94%", d: "1.1s", s: "3px" },
  { t: "18%", l: "4%", d: "2.0s", s: "2px" },
  { t: "27%", l: "96%", d: "0.7s", s: "2px" },
  { t: "38%", l: "3%", d: "1.6s", s: "3px" },
  { t: "49%", l: "97%", d: "0.4s", s: "2px" },
  { t: "61%", l: "5%", d: "2.4s", s: "2px" },
  { t: "72%", l: "95%", d: "0.9s", s: "3px" },
  { t: "84%", l: "7%", d: "1.8s", s: "2px" },
  { t: "14%", l: "78%", d: "2.7s", s: "2px" },
  { t: "33%", l: "22%", d: "0.15s", s: "2px" },
  { t: "55%", l: "88%", d: "1.35s", s: "2px" },
  { t: "77%", l: "18%", d: "2.15s", s: "3px" },
  { t: "8%", l: "48%", d: "0.85s", s: "2px" },
  { t: "91%", l: "62%", d: "1.55s", s: "2px" },
];

export function StageSparks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STAGE_SPARKS.map((p, i) => (
        <span
          key={i}
          className="gold-spark absolute rounded-full bg-gold-2"
          style={{
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s,
            animationDelay: p.d,
            boxShadow: "0 0 8px var(--color-gold-2)",
          }}
        />
      ))}
    </div>
  );
}

export function MiningCore({
  active,
  boosted,
  onHelp,
  onTap,
}: {
  active: boolean;
  boosted?: boolean;
  onHelp?: () => void;
  onTap?: () => void;
}) {
  return (
    <div className="relative mx-auto grid h-[248px] w-full shrink-0 place-items-center">
      {SPARKS.map((p, i) => (
        <span
          key={i}
          className={cn(
            "pointer-events-none absolute rounded-full bg-gold-2",
            p.star ? "gold-spark-star" : "gold-spark",
          )}
          style={{
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s,
            animationDelay: p.d,
            boxShadow: p.star ? "0 0 8px var(--color-gold-2)" : "0 0 6px var(--color-gold)",
          }}
        />
      ))}
      <div className={cn("coin-aura size-[15.5rem] opacity-55", active && "mining-glow")} />
      <div className="coin-floor bottom-5" />
      <button
        type="button"
        onClick={onTap}
        className={cn("relative z-10 rounded-full", boosted && "coin-boost")}
        aria-label="Tap coin to boost mining"
      >
        <img
          src="/zx-coin.png"
          alt=""
          width={280}
          height={280}
          className={cn("coin-hero", active ? "coin-float" : "coin-idle")}
          draggable={false}
        />
      </button>
      {onHelp ? (
        <button
          type="button"
          onClick={onHelp}
          className="absolute bottom-3 left-1 z-20 grid size-10 place-items-center rounded-full border border-border bg-elevated/90 text-muted"
          aria-label="Help"
        >
          <HelpCircle className="size-5" />
        </button>
      ) : null}
    </div>
  );
}
