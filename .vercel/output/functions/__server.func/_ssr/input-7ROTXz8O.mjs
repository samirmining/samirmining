import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as ATF_USD_PRICE } from "./store-C4rWle75.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-7ROTXz8O.js
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var captchas = globalThis.__zxCaptcha ?? /* @__PURE__ */ new Map();
globalThis.__zxCaptcha = captchas;
var getPublicConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("5b29d892f21bca7f52235288740f5d84cbab69d7db662c45bf6fd17af2a8f29e"));
var bootstrapUser = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8f732f068345f35684726c177ce61ac9c25a3b3709daf023bb673a9b96694adb"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d8c32a8c6aabe1f309f41cbc9ead7ac6ca47dabe776428189d5fc6d0557ed303"));
var getCaptcha = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("050f58920409e05b16b9c0dfe101dec688786f20e97d14b935b8b342a88da59f"));
var startMining = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("efd1a02340847c66f454429946f2ba2085b1ce3bea25ebbcfeaea8897ae1f107"));
var claimMining = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("139d34ae6f1a4ae903464909521c65c836bf81f61b6ff31a305a823276facd26"));
var tapBoost = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8bec1ade602afa66001b6542ff008e0fc1d333e7ac8b799699bdd59f3920ea7b"));
var listActiveTasks = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d41e833f002fc5070cd28b3f5cb1ba94f5cd4ae0fcb0ed71fa338a664c13001e"));
var openTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("67d2b98ea9efd1af525b636505303f89573c999e815e8cf983f4582ad8095e89"));
var claimTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("026ffc2d65c4efe2941c366e3f63d3e94014cb54e8e9f3a1b5a0707e33976806"));
var saveWallet = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("82bb69c04172990eabd18ee0ec505829744cb194a64c1de78bc71873413fe555"));
var disconnectWallet = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0b3696bf3b664cc856c73a21c3eb5e6f3c6557c9b6bf8caba889382ab707fc1a"));
var getLevelQuote = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ce6642cf91f7c4b5ad4c2121bf67dfa4f09c2a0119bdb045528277af74c62b09"));
var createLevelInvoice = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5e9f63bfcaee4e38cf352f27b5c62191068efc8a75d270118e1d2d899a70637d"));
var verifyLevelPayment = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2f5dd03b5b6eb16ded465b3e822f8122185aab8412da49be5c5480aaa86cd368"));
var requestWithdraw = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0b9fea727cf6ff9ef9fe7fc3c834e77b2b3f7a1cce3e07f1e760ad458d889dd8"));
var myWithdrawals = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3e789a01c61d1b2ad2c0381564477c0dbf4d0c7486ba4892bf99a090c38acc98"));
var getFriends = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e2bcf34df157ac708b22eabf7eb9be62939a3f36af42bb1360e6655fb9021ccf"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("dc1ae9e444826a5ec49731819d1935c59b4e66ec161c72cda4b921f79e3f2a9e"));
var adminLogin = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("471bd8bc871c89024193683ea03d8f628a7c8829143952e52f66087d069734bd"));
var adminOverview = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4d54d0909cf69b0b0ca99a2c20dadfd96e76ec9fb8b3fe3a8c7e61ca9137ae75"));
var adminListUsers = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6279df3219ff393e538c08f79cc51eb556b40417df406f9af2af6832ab572a22"));
var adminPatchUser = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("eb5cc169856776d15b9ded88a059c25067a5a16a23389545603327e6e0fb11a1"));
var adminListWithdrawals = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("1194e71f98fa27b9bbb9c6e95ebc464c3000d55a9762bb9ed727032d2e63013c"));
var adminProcessWithdrawal = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c9c949a383b29a63f025bbee70ad23841282981191955eae8c566c5f77662cac"));
var adminListTasks = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0a4bf0a92a2e85f049b81e42e037ffe05273853119576c56f59e51e9052fe788"));
var adminSaveTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9c45d705b9b90af31077b8b3b86b311cc2f838a31b1861edab91e7da52ec32f0"));
var adminDeleteTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a151aff3db9f755dad4b4f9c13a1347b9f0c019a381f43ee28de014151223f59"));
var adminSaveSettings = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("25d91265666ef16a573e0fa8d8a45cc9a00aa66ee61ec679a2de57ea015e825b"));
var adminBroadcast = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("961a57e2933d64a6dbe4b63b8b705c4477251328de23331d58e7391d829048bc"));
var adminSyncWebhook = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7ec302f7c7c7d649dae2e7dca0ee8c79934a4ccddb9799580b00961a283b7d25"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatAtf(n, digits = 4) {
	return n.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatAtfShort(n) {
	if (Math.abs(n) < 5e-5) return "0";
	if (Math.abs(n) >= 1e3) return formatAtf(n, 1);
	if (Math.abs(n) >= 100) return formatAtf(n, 2);
	return formatAtf(n, 4);
}
function formatUsd(n, digits = 2) {
	return `$${n.toFixed(digits)}`;
}
function atfToUsd(atf) {
	return atf * ATF_USD_PRICE;
}
function formatCompact(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
	return n.toLocaleString("en-US");
}
function shortWallet(addr) {
	if (addr.length < 12) return addr;
	return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}
function timeAgo(iso) {
	const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1e3));
	if (s < 60) return `${s}s ago`;
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	return `${Math.floor(s / 86400)}d ago`;
}
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", {
			muted: "bg-elevated text-muted border-border",
			accent: "bg-accent/15 text-accent border-accent/20",
			ok: "bg-ok/15 text-ok border-ok/20",
			danger: "bg-danger/15 text-danger border-danger/20",
			warn: "bg-warn/15 text-warn border-warn/20"
		}[tone], className),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-surface", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors focus:ring-2 focus:ring-ring/50", className),
		...props
	});
}
//#endregion
export { getPublicConfig as A, verifyLevelPayment as B, formatAtf as C, getCaptcha as D, formatUsd as E, saveWallet as F, shortWallet as I, startMining as L, myWithdrawals as M, openTask as N, getFriends as O, requestWithdraw as P, tapBoost as R, disconnectWallet as S, formatCompact as T, bootstrapUser as _, adminDeleteTask as a, cn as b, adminListWithdrawals as c, adminPatchUser as d, adminProcessWithdrawal as f, atfToUsd as g, adminSyncWebhook as h, adminBroadcast as i, listActiveTasks as j, getLevelQuote as k, adminLogin as l, adminSaveTask as m, Card as n, adminListTasks as o, adminSaveSettings as p, Input as r, adminListUsers as s, Badge as t, adminOverview as u, claimMining as v, formatAtfShort as w, createLevelInvoice as x, claimTask as y, timeAgo as z };
