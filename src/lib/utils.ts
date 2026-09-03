import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ATF_USD_PRICE } from "@/lib/atf/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAtf(n: number, digits = 4) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatAtfShort(n: number) {
  if (Math.abs(n) < 0.00005) return "0";
  if (Math.abs(n) >= 1000) return formatAtf(n, 1);
  if (Math.abs(n) >= 100) return formatAtf(n, 2);
  return formatAtf(n, 4);
}

export function formatUsd(n: number, digits = 2) {
  return `$${n.toFixed(digits)}`;
}

export function atfToUsd(atf: number) {
  return atf * ATF_USD_PRICE;
}

export function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export function shortWallet(addr: string) {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function timeAgo(iso: string) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}
