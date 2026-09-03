import {
  ATF_USD_PRICE,
  getLevelCard,
  levelFromAssets,
  MAX_LEVEL,
  ratePerHourAtf,
  round4,
  speedThs,
  TAP_BOOST_MS,
  TAP_BOOST_MULT,
} from "./levels";
import type { JourneyPoint, SessionUser, Settings, User } from "./types";

export { round4 };

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function todayStamp(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

function assetsOf(user: User) {
  return round4((user.holdingBalance ?? 0) + (user.balance ?? 0));
}

export function normalizeUser(user: User): User {
  const date = user.dailyPnlDate || todayStamp();
  const reset = date !== todayStamp();
  const journey = Array.isArray(user.journey) ? user.journey.slice(-80) : [];
  const level = Math.min(MAX_LEVEL, Math.max(1, user.minerLevel || 1));
  return {
    ...user,
    holdingBalance: user.holdingBalance ?? 0,
    minerLevel: level,
    peakLevel: Math.max(user.peakLevel || level, level),
    boostUntil: user.boostUntil ?? 0,
    dailyPnl: reset ? 0 : user.dailyPnl ?? 0,
    dailyPnlDate: reset ? todayStamp() : date,
    pnlHistory: Array.isArray(user.pnlHistory) ? user.pnlHistory.slice(-48) : [],
    journey,
    referralSuccessCount: user.referralSuccessCount ?? 0,
    referralClaimedCount: user.referralClaimedCount ?? 0,
    teamBalance: user.teamBalance ?? 0,
  };
}

export function syncUnlockLevel(user: User): { user: User; leveledUpTo: number | null } {
  const u = normalizeUser(user);
  const fromAssets = levelFromAssets(assetsOf(u));
  const nextLevel = Math.min(MAX_LEVEL, Math.max(1, fromAssets));
  const leveledUpTo = nextLevel > u.minerLevel ? nextLevel : null;
  if (nextLevel !== u.minerLevel || Math.max(u.peakLevel, nextLevel) !== u.peakLevel) {
    return {
      user: {
        ...u,
        minerLevel: nextLevel,
        peakLevel: Math.max(u.peakLevel, nextLevel),
      },
      leveledUpTo,
    };
  }
  return { user: u, leveledUpTo: null };
}

export function baseRate(user: User, settings: Settings): number {
  const level = Math.max(1, user.minerLevel || 1);
  const refBoost = Math.min(
    (user.referralSuccessCount || 0) * settings.referralBoostPct,
    settings.maxReferralBoostPct,
  );
  const walletBoost = user.walletAddress ? settings.walletBoostPct : 0;
  return round4(ratePerHourAtf(level) * (1 + refBoost + walletBoost));
}

export function effectiveRate(user: User, settings: Settings, now = Date.now()): number {
  const rate = baseRate(user, settings);
  if ((user.boostUntil || 0) > now) return round4(rate * TAP_BOOST_MULT);
  return rate;
}

export function pendingMined(user: User, settings: Settings, now = Date.now()): number {
  if (!user.miningStartedAt) return 0;
  const start = new Date(user.miningStartedAt).getTime();
  const end = Math.max(start, now);
  if (end <= start) return 0;
  const rate = baseRate(user, settings);
  const boostEnd = user.boostUntil || 0;
  const boostStart = boostEnd - TAP_BOOST_MS;
  const overlapStart = Math.max(start, boostStart);
  const overlapEnd = Math.min(end, boostEnd);
  const boostMs = Math.max(0, overlapEnd - overlapStart);
  const totalMs = end - start;
  const normalMs = totalMs - boostMs;
  const mined = (normalMs / 3_600_000) * rate + (boostMs / 3_600_000) * rate * TAP_BOOST_MULT;
  return round4(mined);
}

export function cycleRemainingMs(_user: User, _settings: Settings, _now = Date.now()): number {
  return 1;
}

export function miningStatus(
  user: User,
  _settings: Settings,
  now = Date.now(),
): SessionUser["miningStatus"] {
  if ((user.boostUntil || 0) > now) return "MINING";
  if (!user.miningStartedAt) return "READY";
  return "READY";
}

export function toSessionUser(
  user: User,
  settings: Settings,
  now = Date.now(),
  leveledUpTo: number | null = null,
): SessionUser {
  const synced = syncUnlockLevel(user);
  const u = synced.user;
  const lvl = Math.max(1, u.minerLevel || 1);
  const nxt = lvl < MAX_LEVEL ? getLevelCard(lvl + 1) : null;
  const pending = pendingMined(u, settings, now);
  const holding = u.holdingBalance ?? 0;
  const pool = u.balance;
  const status = miningStatus(u, settings, now);
  const available = Math.max(0, (u.referralSuccessCount || 0) - (u.referralClaimedCount || 0));
  return {
    ...u,
    holdingBalance: holding,
    level: lvl,
    ratePerHour: effectiveRate(u, settings, now),
    speedThs: speedThs(lvl),
    pending,
    poolBalance: pool,
    assets: round4(holding + pool),
    cycleRemainingMs: 0,
    cycleComplete: false,
    nextLevelAt: nxt ? nxt.requiredAtf : null,
    nextLevelRate: nxt ? nxt.ratePerHour : null,
    nextRequiredAtf: nxt ? nxt.requiredAtf : null,
    nextRequiredUsd: nxt ? nxt.requiredUsd : null,
    miningStatus: status,
    boosted: (u.boostUntil || 0) > now,
    leveledUpTo: leveledUpTo ?? synced.leveledUpTo,
    referralAvailable: available,
  };
}

export function makeCaptcha() {
  const a = 4 + Math.floor(Math.random() * 12);
  const b = 3 + Math.floor(Math.random() * 9);
  return { a, b, answer: a + b };
}

export function usdLeftToNext(user: User) {
  const lvl = Math.max(1, user.minerLevel || 1);
  if (lvl >= MAX_LEVEL) return 0;
  const need = getLevelCard(lvl + 1).requiredAtf;
  const have = assetsOf(user);
  return Math.max(0, round2((need - have) * ATF_USD_PRICE));
}

export function defaultJourney(peak: number, current: number, assets: number): JourneyPoint[] {
  const peakLvl = Math.max(peak, current, 1);
  const points: JourneyPoint[] = [];
  const start = Math.max(1, Math.min(21, current - 40));
  for (let L = start; L <= peakLvl; L++) {
    let atf = requiredAtfApprox(L) + (L % 3) * 1.8;
    if (L === 44 || L === 43) atf = Math.max(12, atf * 0.18);
    if (L === peakLvl) atf = Math.max(atf, requiredAtfApprox(peakLvl) + 8);
    points.push({ level: L, atf: round4(atf) });
  }
  if (current < peakLvl) {
    const crash = Math.max(20, requiredAtfApprox(current) * 0.22);
    points.push({ level: current, atf: round4(crash) });
    points.push({ level: current, atf: round4(assets) });
  } else {
    points[points.length - 1] = { level: current, atf: round4(assets) };
  }
  return points;
}

function requiredAtfApprox(level: number) {
  if (level <= 1) return 0;
  return Math.max(0, 12.5 * level - 318);
}
