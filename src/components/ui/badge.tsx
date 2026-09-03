import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "accent" | "ok" | "danger" | "warn" }) {
  const tones = {
    muted: "bg-elevated text-muted border-border",
    accent: "bg-accent/15 text-accent border-accent/20",
    ok: "bg-ok/15 text-ok border-ok/20",
    danger: "bg-danger/15 text-danger border-danger/20",
    warn: "bg-warn/15 text-warn border-warn/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
