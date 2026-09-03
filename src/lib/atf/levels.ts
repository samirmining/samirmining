/**
 * LEVEL_FORMULA — fitted to live @ATF_AIRDROP_bot (Sept 2026 video).
 *
 * ATF_USD_PRICE        = 0.001088   (476.9681 ATF ≈ $0.519)
 * Unlock gate          = assets (Holding Wallet + Pool Wallet)
 * requiredAtf(L)       = 0 at L1, then ~12.5 ATF / level
 *   L63=470  L64=482  L65=495  L66=507  L67=520  L68=534
 * cardUsd(L)           = requiredAtf * price  (L63 0.511$ … L68 0.581$)
 * speedThs(L)          = max(0.50, 0.02*floor(L/2) - 0.02)
 *   L63 0.60  L64/65 0.62  L66/67 0.64  L68 0.66
 * ratePerHour ATF      = speedThs * 1.735   (L63 ≈ 1.041 ATF/h)
 * tapBoost             = 2× for 4s, then 5s cooldown
 */
export const ATF_USD_PRICE = 0.001088;
export const MAX_LEVEL = 680;
export const TAP_BOOST_MS = 4000;
export const TAP_BOOST_MULT = 2;
export const TAP_BOOST_COOLDOWN_MS = 5000;
export const TASK_PROCESS_MS = 10_000;
export const OWNER_TON_ADDRESS = "UQCzzBp_io5zdMiOCMykYY7HzUFkhRqST-xMWvr_DzSScooi";
export const ATF_PER_THS_HOUR = 1.735;

const REQUIRED_ATF_ANCHOR: Record<number, number> = {
  63: 470,
  64: 482,
  65: 495,
  66: 507,
  67: 520,
  68: 534,
};

export type MinerLevelCard = {
  level: number;
  usdPerHour: number;
  ratePerHour: number;
  speedThs: number;
  requiredAtf: number;
  requiredUsd: number;
};

export function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

export function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function requiredAtf(level: number): number {
  const lvl = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  if (lvl <= 1) return 0;
  if (REQUIRED_ATF_ANCHOR[lvl] != null) return REQUIRED_ATF_ANCHOR[lvl];
  return Math.max(0, Math.round(12.5 * lvl - 318));
}

export function requiredUsd(level: number): number {
  return round2(requiredAtf(level) * ATF_USD_PRICE);
}

export function cardUsd(level: number): number {
  const usd = requiredAtf(level) * ATF_USD_PRICE;
  if (usd <= 0) return 0.005;
  return round3(usd);
}

export function usdPerHour(level: number): number {
  return cardUsd(level);
}

export function speedThs(level: number): number {
  const lvl = Math.max(1, Math.floor(level));
  return round2(Math.max(0.5, 0.02 * Math.floor(lvl / 2) - 0.02));
}

export function ratePerHourAtf(level: number): number {
  return round4(speedThs(level) * ATF_PER_THS_HOUR);
}

export function getLevelCard(level: number): MinerLevelCard {
  const lvl = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  return {
    level: lvl,
    usdPerHour: usdPerHour(lvl),
    ratePerHour: ratePerHourAtf(lvl),
    speedThs: speedThs(lvl),
    requiredAtf: requiredAtf(lvl),
    requiredUsd: requiredUsd(lvl),
  };
}

/** Highest level whose required ATF is covered by assets (holding + pool). */
export function levelFromAssets(assetsAtf: number): number {
  let lo = 1;
  let hi = MAX_LEVEL;
  let ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (requiredAtf(mid) <= assetsAtf + 1e-9) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

export const levelFromHolding = levelFromAssets;

export const LEVEL_FORMULA = {
  maxLevel: MAX_LEVEL,
  atfUsd: ATF_USD_PRICE,
  usdPerHourPerLevel: 0.005,
  speedBase: 0.5,
  speedStep: 0.02,
  requiredUsdCoeff: 12.5,
  tapBoostMs: TAP_BOOST_MS,
  tapBoostMult: TAP_BOOST_MULT,
  tapBoostCooldownMs: TAP_BOOST_COOLDOWN_MS,
  atfPerThsHour: ATF_PER_THS_HOUR,
};
