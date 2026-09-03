import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/store-C4rWle75.js
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
var ATF_USD_PRICE = .001088;
var TAP_BOOST_MS = 4e3;
var TAP_BOOST_COOLDOWN_MS = 5e3;
var TASK_PROCESS_MS = 1e4;
var ATF_PER_THS_HOUR = 1.735;
var REQUIRED_ATF_ANCHOR = {
	63: 470,
	64: 482,
	65: 495,
	66: 507,
	67: 520,
	68: 534
};
function round4(n) {
	return Math.round(n * 1e4) / 1e4;
}
function round3(n) {
	return Math.round(n * 1e3) / 1e3;
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function requiredAtf(level) {
	const lvl = Math.min(680, Math.max(1, Math.floor(level)));
	if (lvl <= 1) return 0;
	if (REQUIRED_ATF_ANCHOR[lvl] != null) return REQUIRED_ATF_ANCHOR[lvl];
	return Math.max(0, Math.round(12.5 * lvl - 318));
}
function requiredUsd(level) {
	return round2(requiredAtf(level) * ATF_USD_PRICE);
}
function cardUsd(level) {
	const usd = requiredAtf(level) * ATF_USD_PRICE;
	if (usd <= 0) return .005;
	return round3(usd);
}
function usdPerHour(level) {
	return cardUsd(level);
}
function speedThs(level) {
	return round2(Math.max(.5, .02 * Math.floor(Math.max(1, Math.floor(level)) / 2) - .02));
}
function ratePerHourAtf(level) {
	return round4(speedThs(level) * ATF_PER_THS_HOUR);
}
function getLevelCard(level) {
	const lvl = Math.min(680, Math.max(1, Math.floor(level)));
	return {
		level: lvl,
		usdPerHour: usdPerHour(lvl),
		ratePerHour: ratePerHourAtf(lvl),
		speedThs: speedThs(lvl),
		requiredAtf: requiredAtf(lvl),
		requiredUsd: requiredUsd(lvl)
	};
}
/** Highest level whose required ATF is covered by assets (holding + pool). */
function levelFromAssets(assetsAtf) {
	let lo = 1;
	let hi = 680;
	let ans = 1;
	while (lo <= hi) {
		const mid = lo + hi >> 1;
		if (requiredAtf(mid) <= assetsAtf + 1e-9) {
			ans = mid;
			lo = mid + 1;
		} else hi = mid - 1;
	}
	return ans;
}
var LEVEL_FORMULA = {
	maxLevel: 680,
	atfUsd: ATF_USD_PRICE,
	usdPerHourPerLevel: .005,
	speedBase: .5,
	speedStep: .02,
	requiredUsdCoeff: 12.5,
	tapBoostMs: TAP_BOOST_MS,
	tapBoostMult: 2,
	tapBoostCooldownMs: TAP_BOOST_COOLDOWN_MS,
	atfPerThsHour: ATF_PER_THS_HOUR
};
var VERIFY_EMAIL = "Ai_trading_forex@outlook.com";
var VERIFY_TELEGRAM = "ATF_Verification";
var DEFAULT_WELCOME_TEXT = [
	"👋 Welcome to ZX Miner!",
	"⛏ Mine ZX tokens directly to your Pool Wallet.",
	"⚡ Tap to boost mining speed!",
	"🔗 Connect your TON wallet.",
	"💰 Hold ZX to upgrade your miner level!",
	"Click below to start."
].join("\n");
var DEFAULT_TASK_BROADCAST = "🎉 New task unlocked: {title}\nReward: {reward} ZX\n{description}\n\nOpen the Mini App → Tasks to claim.";
Array.from({ length: 10 }, (_, i) => {
	const card = getLevelCard(i + 1);
	return {
		level: card.level,
		minMined: card.requiredAtf,
		ratePerHour: card.ratePerHour
	};
});
var DEFAULT_SETTINGS = {
	projectName: "ZX Miner",
	tokenSymbol: "ZX",
	botUsername: "ATF_AIRDROP_bot",
	channelUrl: "https://t.me/AI_TRADING_FOREX",
	groupUrl: "https://t.me/AI_TRADING_FOREX",
	twitterUrl: "https://x.com/ai_trading_frx",
	websiteUrl: "https://www.atftoken.com",
	cycleHours: 8760,
	minWithdraw: 500,
	withdrawFee: 70,
	referralReward: 100,
	welcomeBonus: 25,
	referralBoostPct: .03,
	maxReferralBoostPct: .5,
	walletBoostPct: .1,
	maintenanceMode: false,
	minWithdrawLevel: 1,
	welcomeText: DEFAULT_WELCOME_TEXT,
	welcomeButtons: [{
		text: "🚀 Start ZX Mining",
		url: "webapp"
	}, {
		text: "🌐 Community",
		url: "https://t.me/AI_TRADING_FOREX"
	}],
	reactChannelUrl: "https://t.me/AI_TRADING_FOREX",
	reactChannelId: "",
	newTaskBroadcastTemplate: DEFAULT_TASK_BROADCAST,
	adminTelegramIds: [],
	communityUrl: "https://t.me/AI_TRADING_FOREX"
};
var DEMO_TELEGRAM_ID = "7657544184";
var DEMO_WALLET = "UQAV7nK8pQ2wX9cL4mR1sT6yH3bF0eD5aZ8uC2vxxxxxHXkg";
var REACT_TASK_ID = "task-react-latest";
function defaultTasks(now = (/* @__PURE__ */ new Date()).toISOString()) {
	return [
		{
			id: "task-youtube",
			title: "YouTube Like & Comment (Videos + Shorts)",
			description: "Like and comment on official ZX YouTube videos and Shorts.",
			type: "youtube",
			url: "https://www.youtube.com/@AITradingForex",
			reward: 3,
			isRecurring: false,
			isActive: true,
			sortOrder: 0,
			createdAt: now
		},
		{
			id: "task-x",
			title: "X (Twitter) Retweet",
			description: "Retweet the latest ZX post on X.",
			type: "twitter",
			url: DEFAULT_SETTINGS.twitterUrl,
			reward: 3,
			isRecurring: false,
			isActive: true,
			sortOrder: 1,
			createdAt: now
		},
		{
			id: "task-web",
			title: "Visit Website (atftoken.com)",
			description: "Open the official project site.",
			type: "website",
			url: DEFAULT_SETTINGS.websiteUrl,
			reward: 3,
			isRecurring: false,
			isActive: true,
			sortOrder: 2,
			createdAt: now
		},
		{
			id: REACT_TASK_ID,
			title: "React to latest post (English)",
			description: "Open the channel and react to the latest English post, then claim.",
			type: "react",
			url: DEFAULT_SETTINGS.reactChannelUrl,
			reward: 3,
			isRecurring: true,
			isActive: true,
			sortOrder: 3,
			createdAt: now,
			locked: true
		}
	];
}
function todayStamp(now = Date.now()) {
	return new Date(now).toISOString().slice(0, 10);
}
function assetsOf(user) {
	return round4((user.holdingBalance ?? 0) + (user.balance ?? 0));
}
function normalizeUser(user) {
	const date = user.dailyPnlDate || todayStamp();
	const reset = date !== todayStamp();
	const journey = Array.isArray(user.journey) ? user.journey.slice(-80) : [];
	const level = Math.min(680, Math.max(1, user.minerLevel || 1));
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
		teamBalance: user.teamBalance ?? 0
	};
}
function syncUnlockLevel(user) {
	const u = normalizeUser(user);
	const fromAssets = levelFromAssets(assetsOf(u));
	const nextLevel = Math.min(680, Math.max(1, fromAssets));
	const leveledUpTo = nextLevel > u.minerLevel ? nextLevel : null;
	if (nextLevel !== u.minerLevel || Math.max(u.peakLevel, nextLevel) !== u.peakLevel) return {
		user: {
			...u,
			minerLevel: nextLevel,
			peakLevel: Math.max(u.peakLevel, nextLevel)
		},
		leveledUpTo
	};
	return {
		user: u,
		leveledUpTo: null
	};
}
function baseRate(user, settings) {
	const level = Math.max(1, user.minerLevel || 1);
	const refBoost = Math.min((user.referralSuccessCount || 0) * settings.referralBoostPct, settings.maxReferralBoostPct);
	const walletBoost = user.walletAddress ? settings.walletBoostPct : 0;
	return round4(ratePerHourAtf(level) * (1 + refBoost + walletBoost));
}
function effectiveRate(user, settings, now = Date.now()) {
	const rate = baseRate(user, settings);
	if ((user.boostUntil || 0) > now) return round4(rate * 2);
	return rate;
}
function pendingMined(user, settings, now = Date.now()) {
	if (!user.miningStartedAt) return 0;
	const start = new Date(user.miningStartedAt).getTime();
	const end = Math.max(start, now);
	if (end <= start) return 0;
	const rate = baseRate(user, settings);
	const boostEnd = user.boostUntil || 0;
	const boostStart = boostEnd - TAP_BOOST_MS;
	const boostMs = Math.max(0, Math.min(end, boostEnd) - Math.max(start, boostStart));
	return round4((end - start - boostMs) / 36e5 * rate + boostMs / 36e5 * rate * 2);
}
function miningStatus(user, _settings, now = Date.now()) {
	if ((user.boostUntil || 0) > now) return "MINING";
	if (!user.miningStartedAt) return "READY";
	return "READY";
}
function toSessionUser(user, settings, now = Date.now(), leveledUpTo = null) {
	const synced = syncUnlockLevel(user);
	const u = synced.user;
	const lvl = Math.max(1, u.minerLevel || 1);
	const nxt = lvl < 680 ? getLevelCard(lvl + 1) : null;
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
		referralAvailable: available
	};
}
function defaultJourney(peak, current, assets) {
	const peakLvl = Math.max(peak, current, 1);
	const points = [];
	const start = Math.max(1, Math.min(21, current - 40));
	for (let L = start; L <= peakLvl; L++) {
		let atf = requiredAtfApprox(L) + L % 3 * 1.8;
		if (L === 44 || L === 43) atf = Math.max(12, atf * .18);
		if (L === peakLvl) atf = Math.max(atf, requiredAtfApprox(peakLvl) + 8);
		points.push({
			level: L,
			atf: round4(atf)
		});
	}
	if (current < peakLvl) {
		const crash = Math.max(20, requiredAtfApprox(current) * .22);
		points.push({
			level: current,
			atf: round4(crash)
		});
		points.push({
			level: current,
			atf: round4(assets)
		});
	} else points[points.length - 1] = {
		level: current,
		atf: round4(assets)
	};
	return points;
}
function requiredAtfApprox(level) {
	if (level <= 1) return 0;
	return Math.max(0, 12.5 * level - 318);
}
function secret() {
	return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.BOT_TOKEN || "zx-demo-secret-change-on-render";
}
function hmac(data, key = secret()) {
	return createHmac("sha256", key).update(data).digest("hex");
}
function sha256(data) {
	return createHash("sha256").update(data).digest("hex");
}
function newId(prefix = "id") {
	return `${prefix}_${randomBytes(8).toString("hex")}`;
}
/** Display prefix for newly generated miner IDs. Old ATF-XXXXXXXX values remain valid and are still matched/looked-up correctly. */
function atfIdFromTelegram(telegramId) {
	return `ZX-${sha256(telegramId).slice(0, 8).toUpperCase()}`;
}
function signPayload(payload, ttlMs) {
	const body = {
		...payload,
		exp: Date.now() + ttlMs
	};
	const json = Buffer.from(JSON.stringify(body)).toString("base64url");
	return `${json}.${hmac(json)}`;
}
function verifyPayload(token) {
	const [json, sig] = token.split(".");
	if (!json || !sig) return null;
	const expected = hmac(json);
	const a = Buffer.from(sig);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	try {
		const body = JSON.parse(Buffer.from(json, "base64url").toString("utf8"));
		if (typeof body.exp === "number" && body.exp < Date.now()) return null;
		return body;
	} catch {
		return null;
	}
}
function safeEqual(a, b) {
	const aa = Buffer.from(a);
	const bb = Buffer.from(b);
	if (aa.length !== bb.length) return false;
	return timingSafeEqual(aa, bb);
}
/** Telegram Mini App initData HMAC verification. */
function verifyTelegramInitData(initData, botToken, maxAgeSec = 86400) {
	const params = new URLSearchParams(initData);
	const hash = params.get("hash");
	if (!hash) return null;
	params.delete("hash");
	const dataCheck = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
	const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
	const calc = createHmac("sha256", secretKey).update(dataCheck).digest("hex");
	const a = Buffer.from(calc, "hex");
	const b = Buffer.from(hash, "hex");
	if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	const authDate = Number(params.get("auth_date") || 0);
	if (authDate && Date.now() / 1e3 - authDate > maxAgeSec) return null;
	const userRaw = params.get("user");
	if (!userRaw) return null;
	try {
		return {
			user: JSON.parse(userRaw),
			startParam: params.get("start_param")
		};
	} catch {
		return null;
	}
}
function parseStartRef(startParam) {
	if (!startParam) return null;
	const cleaned = startParam.replace(/^ref[_-]?/i, "");
	if (!cleaned || cleaned.length > 32) return null;
	return cleaned;
}
/** Convert TON raw (`0:hex`) or bounceable addresses to EQ/UQ user-friendly form. */
var CRC_TABLE = (() => {
	const table = /* @__PURE__ */ new Uint16Array(256);
	for (let i = 0; i < 256; i++) {
		let crc = i << 8;
		for (let j = 0; j < 8; j++) crc = crc & 32768 ? (crc << 1 ^ 4129) & 65535 : crc << 1 & 65535;
		table[i] = crc;
	}
	return table;
})();
function crc16(data) {
	let crc = 0;
	for (const b of data) crc = (crc << 8 ^ CRC_TABLE[(crc >> 8 ^ b) & 255]) & 65535;
	return crc;
}
function b64url(bytes) {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
var FRIENDLY_TON_RE = /^(EQ|UQ)[A-Za-z0-9_-]{46}$/;
var RAW_TON_RE = /^(-?\d+):([0-9a-fA-F]{64})$/;
function toFriendlyTonAddress(input, bounceable = false) {
	const trimmed = input.trim();
	if (FRIENDLY_TON_RE.test(trimmed)) return trimmed;
	const m = trimmed.match(RAW_TON_RE);
	if (!m) return trimmed;
	const wc = Number(m[1]);
	const hash = /* @__PURE__ */ new Uint8Array(32);
	for (let i = 0; i < 32; i++) hash[i] = parseInt(m[2].slice(i * 2, i * 2 + 2), 16);
	const buf = /* @__PURE__ */ new Uint8Array(34);
	buf[0] = bounceable ? 17 : 81;
	buf[1] = wc < 0 ? 256 + wc % 256 & 255 : wc & 255;
	buf.set(hash, 2);
	const crc = crc16(buf);
	const full = /* @__PURE__ */ new Uint8Array(36);
	full.set(buf);
	full[34] = crc >> 8 & 255;
	full[35] = crc & 255;
	return b64url(full);
}
var hits = globalThis.__zxHits ?? /* @__PURE__ */ new Map();
globalThis.__zxHits = hits;
var locks = globalThis.__zxLocks ?? /* @__PURE__ */ new Map();
globalThis.__zxLocks = locks;
function rateLimit(key, max, windowMs) {
	const now = Date.now();
	const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (prev.length >= max) throw new Error("Too many requests. Please wait a moment.");
	prev.push(now);
	hits.set(key, prev);
}
async function withLock(key, fn) {
	const prev = locks.get(key) ?? Promise.resolve();
	let release;
	const gate = new Promise((resolve) => {
		release = resolve;
	});
	const next = prev.then(() => gate);
	locks.set(key, next);
	await prev.catch(() => void 0);
	try {
		return await fn();
	} finally {
		release();
	}
}
function looksLikeSeed(value) {
	const trimmed = value.trim();
	if (/\s/.test(trimmed) && trimmed.split(/\s+/).length >= 8) return true;
	if (/seed|mnemonic|private key/i.test(trimmed)) return true;
	return false;
}
function assertTonAddress(address) {
	const trimmed = toFriendlyTonAddress(address.trim());
	if (looksLikeSeed(address.trim())) throw new Error("Never paste a seed phrase. TON public address only.");
	if (!FRIENDLY_TON_RE.test(trimmed)) throw new Error("Enter a valid TON address (starts with EQ or UQ).");
	return trimmed;
}
var g = globalThis;
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function blankUserFields() {
	return {
		minerLevel: 1,
		peakLevel: 1,
		boostUntil: 0,
		dailyPnl: 0,
		dailyPnlDate: nowIso().slice(0, 10),
		pnlHistory: [],
		journey: [],
		referralSuccessCount: 0,
		referralClaimedCount: 0,
		teamBalance: 0
	};
}
function seedUser(telegramId, firstName, extra = {}) {
	const t = nowIso();
	const minerLevel = extra.minerLevel ?? 1;
	const holding = extra.holdingBalance ?? 0;
	const pool = extra.balance ?? 0;
	return normalizeUser({
		id: extra.id ?? newId("usr"),
		telegramId,
		username: extra.username ?? firstName.toLowerCase().replace(/\s+/g, "_"),
		firstName,
		lastName: extra.lastName ?? "",
		atfId: extra.atfId ?? atfIdFromTelegram(telegramId),
		balance: pool,
		holdingBalance: holding,
		minedTotal: extra.minedTotal ?? 0,
		referralCount: extra.referralCount ?? 0,
		referralEarnings: extra.referralEarnings ?? 0,
		referredBy: extra.referredBy ?? null,
		walletAddress: extra.walletAddress ?? null,
		miningStartedAt: extra.miningStartedAt ?? (/* @__PURE__ */ new Date(Date.now() - 35e3)).toISOString(),
		lastClaimAt: extra.lastClaimAt ?? null,
		...blankUserFields(),
		minerLevel,
		peakLevel: extra.peakLevel ?? minerLevel,
		isBanned: extra.isBanned ?? false,
		isVerified: extra.isVerified ?? false,
		dailyPnl: extra.dailyPnl ?? 0,
		pnlHistory: extra.pnlHistory ?? [],
		journey: extra.journey ?? defaultJourney(extra.peakLevel ?? minerLevel, minerLevel, holding + pool),
		createdAt: extra.createdAt ?? t,
		updatedAt: t
	});
}
var FRIEND_NAMES = [
	["Md", "md1"],
	["md shahin", "mdshahin"],
	["Md", "md2"],
	["md", "md3"],
	["MD", "md4"],
	["Rafi", "rafi"],
	["Sakib", "sakib"],
	["Nayeem", "nayeem"],
	["Hasan", "hasan"],
	["Karim", "karim"],
	["Jamal", "jamal"]
];
function seedState() {
	const settings = { ...DEFAULT_SETTINGS };
	const users = /* @__PURE__ */ new Map();
	const usersByTg = /* @__PURE__ */ new Map();
	const add = (u) => {
		users.set(u.id, u);
		usersByTg.set(u.telegramId, u.id);
	};
	const demo = seedUser(DEMO_TELEGRAM_ID, "Miner", {
		username: "zx_miner",
		lastName: "",
		balance: 46.2672,
		holdingBalance: 430.7009,
		minedTotal: 1840.5,
		referralCount: 11,
		referralSuccessCount: 0,
		referralClaimedCount: 0,
		referralEarnings: 0,
		teamBalance: 0,
		walletAddress: DEMO_WALLET,
		isVerified: false,
		minerLevel: 63,
		peakLevel: 68,
		dailyPnl: 4.8,
		pnlHistory: [
			.6,
			.9,
			1.2,
			1.1,
			1.8,
			2.4,
			3.1,
			2.2,
			3.6,
			4.1,
			3.4,
			4.8
		],
		miningStartedAt: (/* @__PURE__ */ new Date(Date.now() - 16e3)).toISOString(),
		lastClaimAt: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString()
	});
	add(demo);
	FRIEND_NAMES.forEach(([name, uname], i) => {
		add(seedUser(`8${String(2e4 + i)}`, name, {
			username: uname,
			referredBy: demo.telegramId,
			balance: 0,
			holdingBalance: 0,
			minedTotal: 0,
			minerLevel: 1,
			peakLevel: 1,
			miningStartedAt: null,
			lastClaimAt: null,
			createdAt: (/* @__PURE__ */ new Date(Date.now() - (11 - i) * 864e5)).toISOString()
		}));
	});
	for (const [id, name, extra] of [
		[
			"20001",
			"Amina",
			{
				balance: 920,
				minedTotal: 3100,
				referralCount: 6,
				username: "amina_k",
				minerLevel: 12,
				peakLevel: 12
			}
		],
		[
			"20002",
			"Chidi",
			{
				balance: 540,
				minedTotal: 1800,
				referralCount: 2,
				username: "chidi",
				minerLevel: 8,
				peakLevel: 8
			}
		],
		[
			"20003",
			"Sofia",
			{
				balance: 2100,
				holdingBalance: 400,
				minedTotal: 8800,
				referralCount: 11,
				username: "sofia_m",
				minerLevel: 28,
				peakLevel: 28
			}
		],
		[
			"20004",
			"Ibrahim",
			{
				balance: 80,
				minedTotal: 420,
				referralCount: 0,
				username: "ibrahim"
			}
		],
		[
			"20005",
			"Maya",
			{
				balance: 1560,
				minedTotal: 5400,
				referralCount: 8,
				username: "maya",
				minerLevel: 18,
				peakLevel: 18
			}
		]
	]) add(seedUser(id, name, {
		...extra,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - Math.random() * 12 * 864e5)).toISOString()
	}));
	const tasks = /* @__PURE__ */ new Map();
	for (const task of defaultTasks()) tasks.set(task.id, task);
	const withdrawals = /* @__PURE__ */ new Map();
	const w1 = {
		id: newId("wd"),
		userId: demo.id,
		telegramId: demo.telegramId,
		atfId: demo.atfId,
		username: demo.username,
		amount: 500.7009,
		fee: 70,
		netAmount: 430.7009,
		walletAddress: "0:1510f053df91346a61373e940e6c10c2f591807e531c365529c02455a61d9e1d",
		status: "approved",
		note: "",
		txHash: "CsOjyvPRJfLJyVUU6Fcs2cUzzBT5gB6M4deqIKq8WXA=",
		createdAt: "2026-08-30T04:10:46.000Z",
		processedAt: "2026-08-30T04:10:46.000Z"
	};
	withdrawals.set(w1.id, w1);
	return {
		settings,
		users,
		usersByTg,
		tasks,
		completions: [],
		progress: /* @__PURE__ */ new Map(),
		withdrawals,
		payments: /* @__PURE__ */ new Map(),
		posts: [],
		reactions: []
	};
}
function state() {
	if (!g.__zxMemory) g.__zxMemory = seedState();
	return g.__zxMemory;
}
function matchesQ(user, q) {
	if (!q) return true;
	const s = q.toLowerCase();
	return user.atfId.toLowerCase().includes(s) || user.username.toLowerCase().includes(s) || user.firstName.toLowerCase().includes(s) || user.telegramId.includes(s) || (user.walletAddress ?? "").toLowerCase().includes(s);
}
function isFriendActive(u) {
	return Boolean(u.lastClaimAt) || u.minedTotal > .01;
}
var memoryStore = {
	backend: "memory",
	async ready() {},
	async getSettings() {
		return {
			...DEFAULT_SETTINGS,
			...state().settings
		};
	},
	async updateSettings(patch) {
		const s = state();
		s.settings = {
			...DEFAULT_SETTINGS,
			...s.settings,
			...patch
		};
		return { ...s.settings };
	},
	async getUserByTelegramId(id) {
		const s = state();
		const uid = s.usersByTg.get(id);
		return uid ? normalizeUser(s.users.get(uid)) : null;
	},
	async getUserById(id) {
		const u = state().users.get(id);
		return u ? normalizeUser(u) : null;
	},
	async createUser(input) {
		const s = state();
		const existing = s.usersByTg.get(input.telegramId);
		if (existing) return normalizeUser(s.users.get(existing));
		const t = nowIso();
		const user = normalizeUser({
			id: newId("usr"),
			telegramId: input.telegramId,
			username: input.username ?? "",
			firstName: input.firstName ?? "Miner",
			lastName: input.lastName ?? "",
			atfId: atfIdFromTelegram(input.telegramId),
			balance: s.settings.welcomeBonus,
			holdingBalance: 0,
			minedTotal: 0,
			referralCount: 0,
			referralEarnings: 0,
			referredBy: input.referredBy ?? null,
			walletAddress: null,
			miningStartedAt: t,
			lastClaimAt: null,
			...blankUserFields(),
			isBanned: false,
			isVerified: false,
			createdAt: t,
			updatedAt: t
		});
		s.users.set(user.id, user);
		s.usersByTg.set(user.telegramId, user.id);
		if (input.referredBy && input.referredBy !== input.telegramId) {
			const refId = s.usersByTg.get(input.referredBy);
			const ref = refId ? s.users.get(refId) : null;
			if (ref) {
				ref.referralCount += 1;
				ref.updatedAt = t;
			}
		}
		return { ...user };
	},
	async saveUser(user) {
		const s = state();
		const next = normalizeUser({
			...user,
			updatedAt: nowIso()
		});
		s.users.set(next.id, next);
		s.usersByTg.set(next.telegramId, next.id);
		return { ...next };
	},
	async applyClaim(userId, expectedStartedAt, pending) {
		const s = state();
		const u = s.users.get(userId);
		if (!u || u.isBanned) return null;
		if (u.miningStartedAt !== expectedStartedAt) return null;
		const t = nowIso();
		const nextPnl = round4((u.dailyPnl ?? 0) + pending);
		const next = normalizeUser({
			...u,
			balance: round4(u.balance + pending),
			minedTotal: round4(u.minedTotal + pending),
			dailyPnl: nextPnl,
			dailyPnlDate: t.slice(0, 10),
			pnlHistory: [...u.pnlHistory ?? [], nextPnl].slice(-48),
			lastClaimAt: t,
			miningStartedAt: t,
			boostUntil: 0,
			updatedAt: t
		});
		s.users.set(next.id, next);
		if (next.referredBy) {
			const refId = s.usersByTg.get(next.referredBy);
			const ref = refId ? s.users.get(refId) : null;
			if (ref && next.minedTotal - pending <= 1e-4) {
				ref.referralSuccessCount = (ref.referralSuccessCount || 0) + 1;
				ref.updatedAt = t;
			}
		}
		return { ...next };
	},
	async applyDebit(userId, amount) {
		const s = state();
		const u = s.users.get(userId);
		if (!u || u.isBanned) return null;
		if (u.balance + 1e-9 < amount) return null;
		const next = normalizeUser({
			...u,
			balance: round4(u.balance - amount),
			updatedAt: nowIso()
		});
		s.users.set(next.id, next);
		return { ...next };
	},
	async creditHolding(userId, amount) {
		const s = state();
		const u = s.users.get(userId);
		if (!u) return null;
		const next = normalizeUser({
			...u,
			holdingBalance: round4((u.holdingBalance ?? 0) + amount),
			updatedAt: nowIso()
		});
		s.users.set(next.id, next);
		return { ...next };
	},
	async listUsers(opts = {}) {
		const page = opts.page ?? 1;
		const limit = opts.limit ?? 20;
		let items = [...state().users.values()].filter((u) => matchesQ(u, opts.q));
		if (opts.banned === true) items = items.filter((u) => u.isBanned);
		items.sort((a, b) => b.minedTotal - a.minedTotal);
		const total = items.length;
		const start = (page - 1) * limit;
		return {
			items: items.slice(start, start + limit).map((u) => normalizeUser(u)),
			total
		};
	},
	async iterateUsers(fn) {
		let n = 0;
		for (const u of state().users.values()) {
			if (u.isBanned) continue;
			await fn(normalizeUser(u));
			n += 1;
		}
		return n;
	},
	async topMiners(limit) {
		return [...state().users.values()].filter((u) => !u.isBanned).sort((a, b) => b.minedTotal - a.minedTotal).slice(0, limit).map((u) => normalizeUser(u));
	},
	async referredFriends(telegramId) {
		return [...state().users.values()].filter((u) => u.referredBy === telegramId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((u) => ({
			firstName: u.firstName,
			username: u.username,
			atfId: u.atfId,
			createdAt: u.createdAt,
			isActive: isFriendActive(u)
		}));
	},
	async listTasks() {
		return [...state().tasks.values()].sort((a, b) => a.sortOrder - b.sortOrder);
	},
	async saveTask(task) {
		state().tasks.set(task.id, { ...task });
		return { ...task };
	},
	async deleteTask(id) {
		if (id === "task-react-latest") return;
		state().tasks.delete(id);
	},
	async getCompletions(userId) {
		return state().completions.filter((c) => c.userId === userId).map((c) => ({ ...c }));
	},
	async addCompletion(c) {
		state().completions.push(c);
		return { ...c };
	},
	async getProgress(userId, taskId) {
		const p = state().progress.get(`${userId}:${taskId}`);
		return p ? { ...p } : null;
	},
	async saveProgress(p) {
		state().progress.set(`${p.userId}:${p.taskId}`, { ...p });
		return { ...p };
	},
	async createWithdrawal(w) {
		state().withdrawals.set(w.id, { ...w });
		return { ...w };
	},
	async listWithdrawals(opts = {}) {
		const page = opts.page ?? 1;
		const limit = opts.limit ?? 20;
		let items = [...state().withdrawals.values()];
		if (opts.status) items = items.filter((w) => w.status === opts.status);
		if (opts.q) {
			const s = opts.q.toLowerCase();
			items = items.filter((w) => w.atfId.toLowerCase().includes(s) || w.username.toLowerCase().includes(s) || w.telegramId.includes(s) || w.walletAddress.toLowerCase().includes(s));
		}
		items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		const total = items.length;
		const start = (page - 1) * limit;
		return {
			items: items.slice(start, start + limit).map((w) => ({ ...w })),
			total
		};
	},
	async getWithdrawal(id) {
		const w = state().withdrawals.get(id);
		return w ? { ...w } : null;
	},
	async saveWithdrawal(w) {
		const next = { ...w };
		state().withdrawals.set(next.id, next);
		return { ...next };
	},
	async createPayment(p) {
		state().payments.set(p.id, { ...p });
		return { ...p };
	},
	async getPayment(id) {
		const p = state().payments.get(id);
		return p ? { ...p } : null;
	},
	async getPaymentByMemo(memo) {
		return [...state().payments.values()].find((p) => p.memo === memo) ?? null;
	},
	async savePayment(p) {
		state().payments.set(p.id, { ...p });
		return { ...p };
	},
	async saveChannelPost(p) {
		const s = state();
		s.posts = [p, ...s.posts.filter((x) => !(x.chatId === p.chatId && x.messageId === p.messageId))].slice(0, 20);
		return p;
	},
	async latestChannelPost(chatId) {
		const s = state();
		return (chatId ? s.posts.filter((p) => p.chatId === chatId) : s.posts)[0] ?? null;
	},
	async recordReaction(r) {
		state().reactions.push(r);
		return r;
	},
	async hasReaction(telegramId, chatId, messageId) {
		return state().reactions.some((r) => r.telegramId === telegramId && r.chatId === chatId && r.messageId === messageId);
	},
	async stats() {
		const s = state();
		const users = [...s.users.values()];
		const withdrawals = [...s.withdrawals.values()];
		const startOfDay = /* @__PURE__ */ new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const startOfWeek = new Date(startOfDay);
		startOfWeek.setDate(startOfWeek.getDate() - 6);
		const pending = withdrawals.filter((w) => w.status === "pending");
		const newUsersToday = users.filter((u) => new Date(u.createdAt) >= startOfDay).length;
		return {
			users: users.length,
			activeMiners: users.filter((u) => Boolean(u.miningStartedAt) && !u.isBanned).length,
			totalMined: users.reduce((a, u) => a + u.minedTotal, 0),
			totalBalance: users.reduce((a, u) => a + u.balance, 0),
			pendingWithdrawals: pending.length,
			pendingAmount: pending.reduce((a, w) => a + w.amount, 0),
			paidAmount: withdrawals.filter((w) => w.status === "paid" || w.status === "approved").reduce((a, w) => a + w.netAmount, 0),
			tasks: [...s.tasks.values()].filter((t) => t.isActive).length,
			newUsersToday,
			todayUsers: newUsersToday,
			weekUsers: users.filter((u) => new Date(u.createdAt) >= startOfWeek).length
		};
	}
};
var cached = null;
var mongoTried = false;
async function getStore() {
	if (cached) return cached;
	const uri = process.env.MONGODB_URI;
	if (uri && !mongoTried) {
		mongoTried = true;
		try {
			const { createMongoStore } = await import("./mongo-PK-NJjfU.mjs");
			const store = await createMongoStore(uri);
			cached = store;
			return store;
		} catch (err) {
			console.error("[zx] MongoDB connect failed, using memory store:", err);
		}
	}
	cached = memoryStore;
	return memoryStore;
}
function isMongoConfigured() {
	return Boolean(process.env.MONGODB_URI);
}
function isBotConfigured() {
	return Boolean(process.env.BOT_TOKEN);
}
function isDemoMode() {
	return !process.env.BOT_TOKEN || !process.env.MONGODB_URI;
}
function webappUrl() {
	return (process.env.WEBAPP_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "");
}
function adminPassword() {
	return process.env.ADMIN_PASSWORD || (isDemoMode() ? "atf-admin" : "");
}
//#endregion
export { toSessionUser as A, requiredAtf as C, signPayload as D, safeEqual as E, verifyTelegramInitData as M, webappUrl as N, syncUnlockLevel as O, withLock as P, rateLimit as S, round4 as T, isMongoConfigured as _, TAP_BOOST_MS as a, parseStartRef as b, VERIFY_TELEGRAM as c, atfIdFromTelegram as d, defaultTasks as f, isDemoMode as g, isBotConfigured as h, REACT_TASK_ID as i, verifyPayload as j, toFriendlyTonAddress as k, adminPassword as l, getStore as m, DEFAULT_SETTINGS as n, TASK_PROCESS_MS as o, getLevelCard as p, LEVEL_FORMULA as r, VERIFY_EMAIL as s, ATF_USD_PRICE as t, assertTonAddress as u, newId as v, requiredUsd as w, pendingMined as x, normalizeUser as y };
