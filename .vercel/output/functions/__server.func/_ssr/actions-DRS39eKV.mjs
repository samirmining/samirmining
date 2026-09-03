import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { A as toSessionUser, C as requiredAtf, D as signPayload, E as safeEqual, M as verifyTelegramInitData, N as webappUrl, O as syncUnlockLevel, P as withLock, S as rateLimit, T as round4, _ as isMongoConfigured, a as TAP_BOOST_MS, b as parseStartRef, c as VERIFY_TELEGRAM, g as isDemoMode, h as isBotConfigured, j as verifyPayload, l as adminPassword, m as getStore, o as TASK_PROCESS_MS, p as getLevelCard, r as LEVEL_FORMULA, s as VERIFY_EMAIL, t as ATF_USD_PRICE, u as assertTonAddress, v as newId, w as requiredUsd, x as pendingMined } from "./store-C4rWle75.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-DRS39eKV.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var NANO = 1e9;
function ownerTonAddress() {
	return (process.env.OWNER_TON_ADDRESS || "UQCzzBp_io5zdMiOCMykYY7HzUFkhRqST-xMWvr_DzSScooi").trim();
}
function ownerDefiAddress() {
	return (process.env.OWNER_DEFI_ADDRESS || "").trim();
}
function tonUsdPrice() {
	const n = Number(process.env.TON_USD || "5.5");
	return Number.isFinite(n) && n > 0 ? n : 5.5;
}
function usdToNano(usd) {
	const ton = usd / tonUsdPrice();
	const nano = Math.max(1, Math.round(ton * NANO));
	return {
		ton: Math.round(ton * 1e6) / 1e6,
		nano: String(nano),
		usd
	};
}
function transferDeepLink(dest, nano, memo) {
	const text = encodeURIComponent(memo);
	return {
		ton: `ton://transfer/${dest}?amount=${nano}&text=${text}`,
		tonkeeper: `https://app.tonkeeper.com/transfer/${dest}?amount=${nano}&text=${text}`,
		telegram: `https://t.me/wallet?startattach=tontransfer`
	};
}
/** Best-effort on-chain check via Toncenter. Fails soft. */
async function findIncomingPayment(opts) {
	const key = process.env.TONCENTER_API_KEY;
	const url = new URL("https://toncenter.com/api/v2/getTransactions");
	url.searchParams.set("address", opts.dest);
	url.searchParams.set("limit", "30");
	url.searchParams.set("archival", "true");
	try {
		const res = await fetch(url, { headers: key ? { "X-API-Key": key } : void 0 });
		if (!res.ok) return null;
		const rows = (await res.json()).result ?? [];
		for (const tx of rows) {
			const comment = tx.in_msg?.message || "";
			const value = BigInt(tx.in_msg?.value || "0");
			if (comment.includes(opts.memo) && value >= opts.minNano) return tx.transaction_id?.hash || "onchain";
		}
	} catch {}
	return null;
}
var SESSION_TTL = 12096e5;
var ADMIN_TTL = 6048e5;
var captchas = globalThis.__zxCaptcha ?? /* @__PURE__ */ new Map();
globalThis.__zxCaptcha = captchas;
function requireUserToken(token) {
	const payload = verifyPayload(token);
	if (!payload || payload.kind !== "user" || !payload.sub) throw new Error("Session expired. Open the mini app again.");
	return payload.sub;
}
function requireAdminToken(token) {
	const payload = verifyPayload(token);
	if (!payload || payload.kind !== "admin") throw new Error("Admin session expired.");
}
async function persistUnlock(user) {
	const store = await getStore();
	const { user: next, leveledUpTo } = syncUnlockLevel(user);
	if (leveledUpTo && (next.minerLevel !== user.minerLevel || next.peakLevel !== user.peakLevel)) await store.saveUser(next);
	else if (next.minerLevel !== user.minerLevel) await store.saveUser(next);
	return {
		user: next,
		leveledUpTo
	};
}
async function loadSession(telegramId) {
	const store = await getStore();
	const settings = await store.getSettings();
	const user = await store.getUserByTelegramId(telegramId);
	if (!user) throw new Error("User not found.");
	if (user.isBanned) throw new Error("This account is banned.");
	const synced = await persistUnlock(user);
	return toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo);
}
var getPublicConfig_createServerFn_handler = createServerRpc({
	id: "5b29d892f21bca7f52235288740f5d84cbab69d7db662c45bf6fd17af2a8f29e",
	name: "getPublicConfig",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getPublicConfig.__executeServer(opts));
var getPublicConfig = createServerFn({ method: "GET" }).handler(getPublicConfig_createServerFn_handler, async () => {
	const s = await (await getStore()).getSettings();
	return {
		projectName: s.projectName,
		tokenSymbol: s.tokenSymbol,
		botUsername: s.botUsername,
		channelUrl: s.channelUrl,
		groupUrl: s.groupUrl,
		twitterUrl: s.twitterUrl,
		websiteUrl: s.websiteUrl,
		communityUrl: s.communityUrl || s.channelUrl,
		cycleHours: s.cycleHours,
		minWithdraw: s.minWithdraw,
		withdrawFee: s.withdrawFee,
		referralReward: s.referralReward,
		welcomeBonus: s.welcomeBonus,
		minWithdrawLevel: s.minWithdrawLevel,
		atfUsd: ATF_USD_PRICE,
		maxLevel: 680,
		ownerTon: ownerTonAddress(),
		ownerDefi: ownerDefiAddress(),
		demoMode: isDemoMode(),
		mongoConfigured: isMongoConfigured(),
		botConfigured: isBotConfigured(),
		webappUrl: webappUrl(),
		usdPerHourPerLevel: LEVEL_FORMULA.usdPerHourPerLevel,
		speedBase: LEVEL_FORMULA.speedBase,
		speedStep: LEVEL_FORMULA.speedStep,
		requiredUsdCoeff: LEVEL_FORMULA.requiredUsdCoeff,
		tapBoostMs: LEVEL_FORMULA.tapBoostMs,
		tapBoostMult: LEVEL_FORMULA.tapBoostMult,
		tapBoostCooldownMs: LEVEL_FORMULA.tapBoostCooldownMs,
		verifyEmail: VERIFY_EMAIL,
		verifyTelegram: VERIFY_TELEGRAM
	};
});
var bootstrapUser_createServerFn_handler = createServerRpc({
	id: "8f732f068345f35684726c177ce61ac9c25a3b3709daf023bb673a9b96694adb",
	name: "bootstrapUser",
	filename: "src/lib/atf/actions.ts"
}, (opts) => bootstrapUser.__executeServer(opts));
var bootstrapUser = createServerFn({ method: "POST" }).validator((data) => data).handler(bootstrapUser_createServerFn_handler, async ({ data }) => {
	const store = await getStore();
	const settings = await store.getSettings();
	const botToken = process.env.BOT_TOKEN;
	let telegramId = "";
	let username = "";
	let firstName = "Miner";
	let lastName = "";
	let referredBy = parseStartRef(data.startParam);
	if (data.initData && botToken) {
		const verified = verifyTelegramInitData(data.initData, botToken);
		if (!verified) throw new Error("Telegram verification failed.");
		telegramId = String(verified.user.id);
		username = verified.user.username ?? "";
		firstName = verified.user.first_name ?? "Miner";
		lastName = verified.user.last_name ?? "";
		referredBy = parseStartRef(verified.startParam) ?? referredBy;
	} else if (!botToken) {
		telegramId = "7657544184";
		username = "zx_miner";
		firstName = "Miner";
		lastName = "";
	} else throw new Error("Open this mini app from Telegram.");
	rateLimit(`boot:${telegramId}`, 20, 6e4);
	let user = await store.getUserByTelegramId(telegramId);
	if (!user) user = await store.createUser({
		telegramId,
		username,
		firstName,
		lastName,
		referredBy
	});
	else user = await store.saveUser({
		...user,
		username: username || user.username,
		firstName: firstName || user.firstName,
		lastName: lastName || user.lastName
	});
	if (user.isBanned) throw new Error("This account is banned.");
	if (!user.miningStartedAt) user = await store.saveUser({
		...user,
		miningStartedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	const synced = await persistUnlock(user);
	return {
		token: signPayload({
			kind: "user",
			sub: telegramId
		}, SESSION_TTL),
		user: toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo),
		demo: isDemoMode()
	};
});
var getMe_createServerFn_handler = createServerRpc({
	id: "d8c32a8c6aabe1f309f41cbc9ead7ac6ca47dabe776428189d5fc6d0557ed303",
	name: "getMe",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "POST" }).validator((data) => data).handler(getMe_createServerFn_handler, async ({ data }) => {
	return loadSession(requireUserToken(data.token));
});
var getCaptcha_createServerFn_handler = createServerRpc({
	id: "050f58920409e05b16b9c0dfe101dec688786f20e97d14b935b8b342a88da59f",
	name: "getCaptcha",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getCaptcha.__executeServer(opts));
var getCaptcha = createServerFn({ method: "POST" }).validator((data) => data).handler(getCaptcha_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`cap:${telegramId}`, 12, 6e4);
	const c = {
		a: 4 + Math.floor(Math.random() * 12),
		b: 3 + Math.floor(Math.random() * 9)
	};
	captchas.set(telegramId, {
		answer: c.a + c.b,
		exp: Date.now() + 6e5,
		fails: 0
	});
	return c;
});
var startMining_createServerFn_handler = createServerRpc({
	id: "efd1a02340847c66f454429946f2ba2085b1ce3bea25ebbcfeaea8897ae1f107",
	name: "startMining",
	filename: "src/lib/atf/actions.ts"
}, (opts) => startMining.__executeServer(opts));
var startMining = createServerFn({ method: "POST" }).validator((data) => data).handler(startMining_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`start:${telegramId}`, 8, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		if (settings.maintenanceMode) throw new Error("Mining is paused. Try again later.");
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (user.isBanned) throw new Error("This account is banned.");
		if (user.miningStartedAt) return toSessionUser(user, settings);
		const next = await store.saveUser({
			...user,
			miningStartedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return toSessionUser(next, settings);
	});
});
var claimMining_createServerFn_handler = createServerRpc({
	id: "139d34ae6f1a4ae903464909521c65c836bf81f61b6ff31a305a823276facd26",
	name: "claimMining",
	filename: "src/lib/atf/actions.ts"
}, (opts) => claimMining.__executeServer(opts));
var claimMining = createServerFn({ method: "POST" }).validator((data) => data).handler(claimMining_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`claim:${telegramId}`, 12, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (user.isBanned) throw new Error("This account is banned.");
		if (!user.miningStartedAt) throw new Error("Nothing to claim yet.");
		const pending = pendingMined(user, settings);
		if (pending <= 1e-4) throw new Error("Nothing to claim yet.");
		const next = await store.applyClaim(user.id, user.miningStartedAt, pending);
		if (!next) throw new Error("Claim already processed.");
		const synced = await persistUnlock(next);
		return {
			user: toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo),
			claimed: pending
		};
	});
});
var tapBoost_createServerFn_handler = createServerRpc({
	id: "8bec1ade602afa66001b6542ff008e0fc1d333e7ac8b799699bdd59f3920ea7b",
	name: "tapBoost",
	filename: "src/lib/atf/actions.ts"
}, (opts) => tapBoost.__executeServer(opts));
var tapBoost = createServerFn({ method: "POST" }).validator((data) => data).handler(tapBoost_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`boost:${telegramId}`, 20, 1e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (!user.miningStartedAt) throw new Error("Start mining first.");
		const now = Date.now();
		const until = user.boostUntil || 0;
		if (until > now) return toSessionUser(user, settings, now);
		if (until > 0 && now < until + 5e3) return toSessionUser(user, settings, now);
		const next = await store.saveUser({
			...user,
			boostUntil: now + TAP_BOOST_MS
		});
		return toSessionUser(next, settings, now);
	});
});
async function mapTasks(user) {
	const store = await getStore();
	const settings = await store.getSettings();
	const [tasks, completions] = await Promise.all([store.listTasks(), store.getCompletions(user.id)]);
	const latestPost = await store.latestChannelPost(settings.reactChannelId || void 0);
	const reacted = latestPost && settings.reactChannelId ? await store.hasReaction(user.telegramId, latestPost.chatId, latestPost.messageId) : isDemoMode();
	return Promise.all(tasks.filter((t) => t.isActive).map(async (task) => {
		const done = completions.filter((c) => c.taskId === task.id);
		const last = done.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
		const available = task.isRecurring ? !last || Date.now() - new Date(last.completedAt).getTime() > 864e5 : done.length === 0;
		const progress = await store.getProgress(user.id, task.id);
		let uiState = "go";
		if (!available) uiState = "done";
		else if (task.type === "react") {
			if (reacted && progress) uiState = "claim";
			else if (progress) uiState = "processing";
			else uiState = "go";
		} else if (progress?.status === "claimed" && !task.isRecurring) uiState = "done";
		else if (progress) uiState = Date.now() - new Date(progress.goAt).getTime() >= 1e4 ? "claim" : "processing";
		const url = task.id === "task-react-latest" ? settings.reactChannelUrl || task.url : task.url;
		return {
			...task,
			url,
			completed: uiState === "done",
			lastCompletedAt: last?.completedAt ?? null,
			available: uiState !== "done",
			uiState
		};
	}));
}
var listActiveTasks_createServerFn_handler = createServerRpc({
	id: "d41e833f002fc5070cd28b3f5cb1ba94f5cd4ae0fcb0ed71fa338a664c13001e",
	name: "listActiveTasks",
	filename: "src/lib/atf/actions.ts"
}, (opts) => listActiveTasks.__executeServer(opts));
var listActiveTasks = createServerFn({ method: "POST" }).validator((data) => data).handler(listActiveTasks_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	const user = await (await getStore()).getUserByTelegramId(telegramId);
	if (!user) throw new Error("User not found.");
	return mapTasks(user);
});
var openTask_createServerFn_handler = createServerRpc({
	id: "67d2b98ea9efd1af525b636505303f89573c999e815e8cf983f4582ad8095e89",
	name: "openTask",
	filename: "src/lib/atf/actions.ts"
}, (opts) => openTask.__executeServer(opts));
var openTask = createServerFn({ method: "POST" }).validator((data) => data).handler(openTask_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`taskgo:${telegramId}`, 30, 6e4);
	const store = await getStore();
	const user = await store.getUserByTelegramId(telegramId);
	if (!user) throw new Error("User not found.");
	const task = (await store.listTasks()).find((t) => t.id === data.taskId);
	if (!task || !task.isActive) throw new Error("Task not found.");
	if (task.type === "wallet" && !user.walletAddress) throw new Error("WALLET_REQUIRED");
	const t = (/* @__PURE__ */ new Date()).toISOString();
	await store.saveProgress({
		id: newId("prg"),
		userId: user.id,
		taskId: task.id,
		status: "processing",
		goAt: t,
		updatedAt: t
	});
	return {
		ok: true,
		processMs: TASK_PROCESS_MS
	};
});
var claimTask_createServerFn_handler = createServerRpc({
	id: "026ffc2d65c4efe2941c366e3f63d3e94014cb54e8e9f3a1b5a0707e33976806",
	name: "claimTask",
	filename: "src/lib/atf/actions.ts"
}, (opts) => claimTask.__executeServer(opts));
var claimTask = createServerFn({ method: "POST" }).validator((data) => data).handler(claimTask_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`task:${telegramId}`, 20, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (user.isBanned) throw new Error("This account is banned.");
		const task = (await store.listTasks()).find((t) => t.id === data.taskId);
		if (!task || !task.isActive) throw new Error("Task not found.");
		if (task.type === "wallet" && !user.walletAddress) throw new Error("Connect a TON wallet first.");
		const mine = (await store.getCompletions(user.id)).filter((c) => c.taskId === task.id);
		const last = mine.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
		if (!task.isRecurring && mine.length > 0) throw new Error("Already claimed.");
		if (task.isRecurring && last && Date.now() - new Date(last.completedAt).getTime() < 864e5) throw new Error("Come back tomorrow.");
		const progress = await store.getProgress(user.id, task.id);
		if (!progress) throw new Error("Open the task first.");
		if (task.type === "react") {
			const post = await store.latestChannelPost(settings.reactChannelId || void 0);
			if (!isDemoMode()) {
				if (!settings.reactChannelId) throw new Error("React channel is not configured.");
				if (!post) throw new Error("No channel post yet. Bot must be admin in the channel.");
				if (!await store.hasReaction(user.telegramId, post.chatId, post.messageId)) throw new Error("React to the latest channel post first.");
			}
		} else if (Date.now() - new Date(progress.goAt).getTime() < 1e4) throw new Error("Still processing.");
		await store.addCompletion({
			id: newId("cmp"),
			userId: user.id,
			taskId: task.id,
			completedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		await store.saveProgress({
			...progress,
			status: "claimed",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		const next = await store.saveUser({
			...user,
			balance: round4(user.balance + task.reward),
			minedTotal: round4(user.minedTotal + task.reward)
		});
		return {
			user: toSessionUser(next, settings),
			reward: task.reward
		};
	});
});
var saveWallet_createServerFn_handler = createServerRpc({
	id: "82bb69c04172990eabd18ee0ec505829744cb194a64c1de78bc71873413fe555",
	name: "saveWallet",
	filename: "src/lib/atf/actions.ts"
}, (opts) => saveWallet.__executeServer(opts));
var saveWallet = createServerFn({ method: "POST" }).validator((data) => data).handler(saveWallet_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`wallet:${telegramId}`, 8, 6e4);
	const address = assertTonAddress(data.address);
	const store = await getStore();
	const settings = await store.getSettings();
	const user = await store.getUserByTelegramId(telegramId);
	if (!user) throw new Error("User not found.");
	const next = await store.saveUser({
		...user,
		walletAddress: address
	});
	return toSessionUser(next, settings);
});
var disconnectWallet_createServerFn_handler = createServerRpc({
	id: "0b3696bf3b664cc856c73a21c3eb5e6f3c6557c9b6bf8caba889382ab707fc1a",
	name: "disconnectWallet",
	filename: "src/lib/atf/actions.ts"
}, (opts) => disconnectWallet.__executeServer(opts));
var disconnectWallet = createServerFn({ method: "POST" }).validator((data) => data).handler(disconnectWallet_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`walletdc:${telegramId}`, 8, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		const next = await store.saveUser({
			...user,
			walletAddress: null
		});
		return toSessionUser(next, settings);
	});
});
var getLevelQuote_createServerFn_handler = createServerRpc({
	id: "ce6642cf91f7c4b5ad4c2121bf67dfa4f09c2a0119bdb045528277af74c62b09",
	name: "getLevelQuote",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getLevelQuote.__executeServer(opts));
var getLevelQuote = createServerFn({ method: "POST" }).validator((data) => data).handler(getLevelQuote_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	const user = await (await getStore()).getUserByTelegramId(telegramId);
	if (!user) throw new Error("User not found.");
	const level = Math.min(680, Math.max(1, Math.floor(data.level)));
	const card = getLevelCard(level);
	const holding = user.holdingBalance ?? 0;
	const pool = user.balance;
	const assets = round4(holding + pool);
	const missingAtf = Math.max(0, round4(card.requiredAtf - assets));
	const missingUsd = Math.max(0, round4(card.requiredAtf * ATF_USD_PRICE - assets * ATF_USD_PRICE));
	return {
		...card,
		holding,
		pool,
		assets,
		missingAtf,
		missingUsd,
		unlocked: user.minerLevel >= level || assets + 1e-9 >= card.requiredAtf,
		canBuy: missingUsd > .001 && user.minerLevel < level
	};
});
var createLevelInvoice_createServerFn_handler = createServerRpc({
	id: "5e9f63bfcaee4e38cf352f27b5c62191068efc8a75d270118e1d2d899a70637d",
	name: "createLevelInvoice",
	filename: "src/lib/atf/actions.ts"
}, (opts) => createLevelInvoice.__executeServer(opts));
var createLevelInvoice = createServerFn({ method: "POST" }).validator((data) => data).handler(createLevelInvoice_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`inv:${telegramId}`, 10, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (!user.walletAddress) throw new Error("Connect a TON wallet first.");
		const level = Math.min(680, Math.max(user.minerLevel + 1, Math.floor(data.level)));
		if (level > user.minerLevel + 1) throw new Error("Unlock previous levels first.");
		const needAtf = requiredAtf(level);
		if (round4((user.holdingBalance ?? 0) + user.balance) + 1e-9 >= needAtf) {
			const next = await store.saveUser({
				...user,
				minerLevel: Math.max(user.minerLevel, level),
				peakLevel: Math.max(user.peakLevel, level)
			});
			return {
				unlocked: true,
				user: toSessionUser(next, settings, Date.now(), level)
			};
		}
		const { ton, nano, usd } = usdToNano(Math.max(.01, requiredUsd(level) - user.holdingBalance * ATF_USD_PRICE));
		const dest = ownerTonAddress();
		const memo = `ZX-L${level}-${user.atfId.slice(-6)}-${newId("m").slice(-6)}`;
		return {
			unlocked: false,
			payment: await store.createPayment({
				id: newId("pay"),
				userId: user.id,
				telegramId: user.telegramId,
				level,
				memo,
				dest,
				amountNano: nano,
				amountTon: ton,
				amountUsd: usd,
				status: "pending",
				txHash: null,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}),
			links: transferDeepLink(dest, nano, memo),
			dest,
			defiDest: ownerDefiAddress(),
			user: toSessionUser(user, settings)
		};
	});
});
var verifyLevelPayment_createServerFn_handler = createServerRpc({
	id: "2f5dd03b5b6eb16ded465b3e822f8122185aab8412da49be5c5480aaa86cd368",
	name: "verifyLevelPayment",
	filename: "src/lib/atf/actions.ts"
}, (opts) => verifyLevelPayment.__executeServer(opts));
var verifyLevelPayment = createServerFn({ method: "POST" }).validator((data) => data).handler(verifyLevelPayment_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`payv:${telegramId}`, 12, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		const payment = await store.getPayment(data.paymentId);
		if (!payment || payment.userId !== user.id) throw new Error("Payment not found.");
		if (payment.status === "confirmed") return {
			user: toSessionUser(user, settings),
			ok: true
		};
		let txHash = null;
		if (isDemoMode()) txHash = "demo";
		else txHash = await findIncomingPayment({
			dest: payment.dest,
			memo: payment.memo,
			minNano: BigInt(payment.amountNano) * 95n / 100n,
			sinceMs: new Date(payment.createdAt).getTime()
		});
		if (!txHash) throw new Error("Payment not found yet. Confirm in your wallet, then retry.");
		await store.savePayment({
			...payment,
			status: "confirmed",
			txHash
		});
		const next = await store.saveUser({
			...user,
			minerLevel: Math.max(user.minerLevel, payment.level),
			peakLevel: Math.max(user.peakLevel, payment.level)
		});
		return {
			user: toSessionUser(next, settings, Date.now(), payment.level),
			ok: true
		};
	});
});
var requestWithdraw_createServerFn_handler = createServerRpc({
	id: "0b9fea727cf6ff9ef9fe7fc3c834e77b2b3f7a1cce3e07f1e760ad458d889dd8",
	name: "requestWithdraw",
	filename: "src/lib/atf/actions.ts"
}, (opts) => requestWithdraw.__executeServer(opts));
var requestWithdraw = createServerFn({ method: "POST" }).validator((data) => data).handler(requestWithdraw_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	rateLimit(`wd:${telegramId}`, 5, 6e4);
	return withLock(`u:${telegramId}`, async () => {
		const store = await getStore();
		const settings = await store.getSettings();
		const user = await store.getUserByTelegramId(telegramId);
		if (!user) throw new Error("User not found.");
		if (user.isBanned) throw new Error("This account is banned.");
		if (!user.walletAddress) throw new Error("Connect a TON wallet first.");
		const amount = round4(Number(data.amount));
		if (!Number.isFinite(amount) || amount < settings.minWithdraw) throw new Error(`Minimum withdrawal is ${settings.minWithdraw} ${settings.tokenSymbol}.`);
		if (amount <= settings.withdrawFee) throw new Error("Amount is too small after fee.");
		if (toSessionUser(user, settings).level < settings.minWithdrawLevel) throw new Error(`Reach level ${settings.minWithdrawLevel} to withdraw.`);
		const next = await store.applyDebit(user.id, amount);
		if (!next) throw new Error("Insufficient Pool Wallet balance.");
		const w = await store.createWithdrawal({
			id: newId("wd"),
			userId: user.id,
			telegramId: user.telegramId,
			atfId: user.atfId,
			username: user.username,
			amount,
			fee: settings.withdrawFee,
			netAmount: round4(amount - settings.withdrawFee),
			walletAddress: user.walletAddress,
			status: "pending",
			note: "",
			txHash: null,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			processedAt: null
		});
		return {
			user: toSessionUser(next, settings),
			withdrawal: w
		};
	});
});
var myWithdrawals_createServerFn_handler = createServerRpc({
	id: "3e789a01c61d1b2ad2c0381564477c0dbf4d0c7486ba4892bf99a090c38acc98",
	name: "myWithdrawals",
	filename: "src/lib/atf/actions.ts"
}, (opts) => myWithdrawals.__executeServer(opts));
var myWithdrawals = createServerFn({ method: "POST" }).validator((data) => data).handler(myWithdrawals_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	const { items } = await (await getStore()).listWithdrawals({
		page: 1,
		limit: 50,
		q: telegramId
	});
	return items.filter((w) => w.telegramId === telegramId);
});
var getFriends_createServerFn_handler = createServerRpc({
	id: "e2bcf34df157ac708b22eabf7eb9be62939a3f36af42bb1360e6655fb9021ccf",
	name: "getFriends",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getFriends.__executeServer(opts));
var getFriends = createServerFn({ method: "POST" }).validator((data) => data).handler(getFriends_createServerFn_handler, async ({ data }) => {
	const telegramId = requireUserToken(data.token);
	const store = await getStore();
	const settings = await store.getSettings();
	return {
		friends: await store.referredFriends(telegramId),
		inviteLink: `https://t.me/${settings.botUsername.replace(/^@/, "")}?start=ref${telegramId}`,
		reward: settings.referralReward
	};
});
var getLeaderboard_createServerFn_handler = createServerRpc({
	id: "dc1ae9e444826a5ec49731819d1935c59b4e66ec161c72cda4b921f79e3f2a9e",
	name: "getLeaderboard",
	filename: "src/lib/atf/actions.ts"
}, (opts) => getLeaderboard.__executeServer(opts));
var getLeaderboard = createServerFn({ method: "POST" }).validator((data) => data).handler(getLeaderboard_createServerFn_handler, async ({ data }) => {
	requireUserToken(data.token);
	return (await (await getStore()).topMiners(20)).map((u, i) => ({
		rank: i + 1,
		atfId: u.atfId,
		firstName: u.firstName,
		minedTotal: u.minedTotal,
		referralCount: u.referralCount,
		level: u.minerLevel || 1
	}));
});
var adminLogin_createServerFn_handler = createServerRpc({
	id: "471bd8bc871c89024193683ea03d8f628a7c8829143952e52f66087d069734bd",
	name: "adminLogin",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminLogin.__executeServer(opts));
var adminLogin = createServerFn({ method: "POST" }).validator((data) => data).handler(adminLogin_createServerFn_handler, async ({ data }) => {
	rateLimit("admin-login", 8, 3e5);
	const expected = adminPassword();
	if (!expected || !safeEqual(data.password, expected)) throw new Error("Wrong password.");
	return { token: signPayload({ kind: "admin" }, ADMIN_TTL) };
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "4d54d0909cf69b0b0ca99a2c20dadfd96e76ec9fb8b3fe3a8c7e61ca9137ae75",
	name: "adminOverview",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "POST" }).validator((data) => data).handler(adminOverview_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	const store = await getStore();
	const [stats, settings, recentUsers, pending] = await Promise.all([
		store.stats(),
		store.getSettings(),
		store.listUsers({
			page: 1,
			limit: 8
		}),
		store.listWithdrawals({
			page: 1,
			limit: 8,
			status: "pending"
		})
	]);
	return {
		stats,
		settings,
		recentUsers: recentUsers.items,
		pending: pending.items,
		backend: store.backend,
		demoMode: isDemoMode(),
		mongoConfigured: isMongoConfigured(),
		botConfigured: isBotConfigured(),
		webappUrl: webappUrl(),
		demoPassword: isDemoMode() ? adminPassword() : null
	};
});
var adminListUsers_createServerFn_handler = createServerRpc({
	id: "6279df3219ff393e538c08f79cc51eb556b40417df406f9af2af6832ab572a22",
	name: "adminListUsers",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
var adminListUsers = createServerFn({ method: "POST" }).validator((data) => data).handler(adminListUsers_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	return (await getStore()).listUsers({
		q: data.q,
		page: data.page ?? 1,
		limit: 20
	});
});
var adminPatchUser_createServerFn_handler = createServerRpc({
	id: "eb5cc169856776d15b9ded88a059c25067a5a16a23389545603327e6e0fb11a1",
	name: "adminPatchUser",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminPatchUser.__executeServer(opts));
var adminPatchUser = createServerFn({ method: "POST" }).validator((data) => data).handler(adminPatchUser_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	const store = await getStore();
	const user = await store.getUserById(data.userId);
	if (!user) throw new Error("User not found.");
	const next = {
		...user,
		balance: data.balance !== void 0 ? round4(data.balance) : user.balance,
		holdingBalance: data.holdingBalance !== void 0 ? round4(data.holdingBalance) : user.holdingBalance,
		isBanned: data.banned ?? user.isBanned,
		isVerified: data.verified ?? user.isVerified
	};
	return store.saveUser(next);
});
var adminListWithdrawals_createServerFn_handler = createServerRpc({
	id: "1194e71f98fa27b9bbb9c6e95ebc464c3000d55a9762bb9ed727032d2e63013c",
	name: "adminListWithdrawals",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminListWithdrawals.__executeServer(opts));
var adminListWithdrawals = createServerFn({ method: "POST" }).validator((data) => data).handler(adminListWithdrawals_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	return (await getStore()).listWithdrawals({
		status: data.status,
		q: data.q,
		page: data.page ?? 1,
		limit: 20
	});
});
var adminProcessWithdrawal_createServerFn_handler = createServerRpc({
	id: "c9c949a383b29a63f025bbee70ad23841282981191955eae8c566c5f77662cac",
	name: "adminProcessWithdrawal",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminProcessWithdrawal.__executeServer(opts));
var adminProcessWithdrawal = createServerFn({ method: "POST" }).validator((data) => data).handler(adminProcessWithdrawal_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	const store = await getStore();
	const w = await store.getWithdrawal(data.id);
	if (!w) throw new Error("Withdrawal not found.");
	if (w.status !== "pending") throw new Error("Already processed.");
	if (data.status === "rejected") {
		const user = await store.getUserById(w.userId);
		if (user) await store.saveUser({
			...user,
			balance: round4(user.balance + w.amount)
		});
	}
	const next = {
		...w,
		status: data.status,
		note: data.note ?? w.note,
		processedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const saved = await store.saveWithdrawal(next);
	try {
		const { notifyUser } = await import("./bot-BtTIOHt3.mjs").then((n) => n.t);
		const msg = data.status === "rejected" ? `Withdrawal of ${w.amount} ZX was rejected. Balance restored.` : `Withdrawal of ${w.netAmount} ZX was ${data.status}.`;
		await notifyUser(w.telegramId, msg);
	} catch {}
	return saved;
});
var adminListTasks_createServerFn_handler = createServerRpc({
	id: "0a4bf0a92a2e85f049b81e42e037ffe05273853119576c56f59e51e9052fe788",
	name: "adminListTasks",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminListTasks.__executeServer(opts));
var adminListTasks = createServerFn({ method: "POST" }).validator((data) => data).handler(adminListTasks_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	return (await getStore()).listTasks();
});
var adminSaveTask_createServerFn_handler = createServerRpc({
	id: "9c45d705b9b90af31077b8b3b86b311cc2f838a31b1861edab91e7da52ec32f0",
	name: "adminSaveTask",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminSaveTask.__executeServer(opts));
var adminSaveTask = createServerFn({ method: "POST" }).validator((data) => data).handler(adminSaveTask_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	const store = await getStore();
	const isNew = !(await store.listTasks()).find((t) => t.id && t.id === data.task.id) && !data.task.id;
	const task = {
		...data.task,
		id: data.task.id || newId("task"),
		createdAt: data.task.createdAt || (/* @__PURE__ */ new Date()).toISOString()
	};
	const saved = await store.saveTask(task);
	if (isNew || data.broadcast) try {
		const { broadcastNewTask } = await import("./bot-BtTIOHt3.mjs").then((n) => n.t);
		await broadcastNewTask(saved);
	} catch {}
	return saved;
});
var adminDeleteTask_createServerFn_handler = createServerRpc({
	id: "a151aff3db9f755dad4b4f9c13a1347b9f0c019a381f43ee28de014151223f59",
	name: "adminDeleteTask",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminDeleteTask.__executeServer(opts));
var adminDeleteTask = createServerFn({ method: "POST" }).validator((data) => data).handler(adminDeleteTask_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	if (data.id === "task-react-latest") throw new Error("React Latest Post cannot be deleted.");
	await (await getStore()).deleteTask(data.id);
	return { ok: true };
});
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "25d91265666ef16a573e0fa8d8a45cc9a00aa66ee61ec679a2de57ea015e825b",
	name: "adminSaveSettings",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).validator((data) => data).handler(adminSaveSettings_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	return (await getStore()).updateSettings(data.settings);
});
var adminBroadcast_createServerFn_handler = createServerRpc({
	id: "961a57e2933d64a6dbe4b63b8b705c4477251328de23331d58e7391d829048bc",
	name: "adminBroadcast",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminBroadcast.__executeServer(opts));
var adminBroadcast = createServerFn({ method: "POST" }).validator((data) => data).handler(adminBroadcast_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	if (!data.text.trim()) throw new Error("Message is empty.");
	const { broadcastMessage } = await import("./bot-BtTIOHt3.mjs").then((n) => n.t);
	return broadcastMessage(data.text.trim());
});
var adminSyncWebhook_createServerFn_handler = createServerRpc({
	id: "7ec302f7c7c7d649dae2e7dca0ee8c79934a4ccddb9799580b00961a283b7d25",
	name: "adminSyncWebhook",
	filename: "src/lib/atf/actions.ts"
}, (opts) => adminSyncWebhook.__executeServer(opts));
var adminSyncWebhook = createServerFn({ method: "POST" }).validator((data) => data).handler(adminSyncWebhook_createServerFn_handler, async ({ data }) => {
	requireAdminToken(data.token);
	const { ensureTelegramWebhook } = await import("./bot-BtTIOHt3.mjs").then((n) => n.t);
	return ensureTelegramWebhook();
});
//#endregion
export { adminBroadcast_createServerFn_handler, adminDeleteTask_createServerFn_handler, adminListTasks_createServerFn_handler, adminListUsers_createServerFn_handler, adminListWithdrawals_createServerFn_handler, adminLogin_createServerFn_handler, adminOverview_createServerFn_handler, adminPatchUser_createServerFn_handler, adminProcessWithdrawal_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminSaveTask_createServerFn_handler, adminSyncWebhook_createServerFn_handler, bootstrapUser_createServerFn_handler, claimMining_createServerFn_handler, claimTask_createServerFn_handler, createLevelInvoice_createServerFn_handler, disconnectWallet_createServerFn_handler, getCaptcha_createServerFn_handler, getFriends_createServerFn_handler, getLeaderboard_createServerFn_handler, getLevelQuote_createServerFn_handler, getMe_createServerFn_handler, getPublicConfig_createServerFn_handler, listActiveTasks_createServerFn_handler, myWithdrawals_createServerFn_handler, openTask_createServerFn_handler, requestWithdraw_createServerFn_handler, saveWallet_createServerFn_handler, startMining_createServerFn_handler, tapBoost_createServerFn_handler, verifyLevelPayment_createServerFn_handler };
