import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as toFriendlyTonAddress, p as getLevelCard } from "./store-C4rWle75.mjs";
import { A as getPublicConfig, B as verifyLevelPayment, C as formatAtf, D as getCaptcha, E as formatUsd, F as saveWallet, I as shortWallet, L as startMining, M as myWithdrawals, N as openTask, O as getFriends, P as requestWithdraw, R as tapBoost, S as disconnectWallet, _ as bootstrapUser, b as cn, g as atfToUsd, j as listActiveTasks, k as getLevelQuote, n as Card, r as Input, t as Badge, v as claimMining, w as formatAtfShort, x as createLevelInvoice, y as claimTask, z as timeAgo } from "./input-7ROTXz8O.mjs";
import { C as ClipboardList, E as Building2, S as CreditCard, T as Check, a as Volume2, b as Flame, d as Repeat2, g as Lock, i as VolumeX, l as Share2, m as MessageCircle, n as X, o as Users, p as Pickaxe, r as Wallet, s as User, t as Zap, w as CircleHelp, x as ExternalLink, y as Globe } from "../_libs/lucide-react.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mini-app-BbJvgg4k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
function audio() {
	if (typeof window === "undefined") return null;
	try {
		if (!ctx) ctx = new AudioContext();
		if (ctx.state === "suspended") ctx.resume();
		return ctx;
	} catch {
		return null;
	}
}
function tone(c, freq, when, dur, gain = .05, type = "sine") {
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	g.gain.setValueAtTime(1e-4, when);
	g.gain.exponentialRampToValueAtTime(gain, when + .015);
	g.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(g);
	g.connect(c.destination);
	osc.start(when);
	osc.stop(when + dur + .02);
}
function playClaimSound(enabled) {
	if (!enabled) return;
	const c = audio();
	if (!c) return;
	const t = c.currentTime;
	tone(c, 880, t, .09, .045, "triangle");
	tone(c, 1174, t + .08, .12, .04, "sine");
}
function playTaskSound(enabled) {
	if (!enabled) return;
	const c = audio();
	if (!c) return;
	const t = c.currentTime;
	tone(c, 784, t, .08, .04, "triangle");
	tone(c, 1046, t + .07, .11, .038, "sine");
}
function playLevelUpSound(enabled) {
	if (!enabled) return;
	const c = audio();
	if (!c) return;
	const t = c.currentTime;
	tone(c, 523, t, .1, .04, "triangle");
	tone(c, 659, t + .1, .1, .045, "triangle");
	tone(c, 784, t + .2, .14, .05, "sine");
	tone(c, 1046, t + .32, .18, .04, "sine");
}
function playTapSound(enabled) {
	if (!enabled) return;
	const c = audio();
	if (!c) return;
	tone(c, 1320, c.currentTime, .05, .03, "sine");
}
var uiPromise = null;
function friendlyFromTonConnect(address) {
	if (!address) return "";
	return toFriendlyTonAddress(address, false);
}
async function getTonConnectUI() {
	if (typeof window === "undefined") return null;
	if (!uiPromise) uiPromise = (async () => {
		try {
			const mod = await import("../_libs/@tonconnect/ui+[...].mjs").then((n) => n.t);
			const TonConnectUI = mod.TonConnectUI;
			const THEME = mod.THEME;
			return new TonConnectUI({
				manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
				buttonRootId: null,
				uiPreferences: { theme: THEME?.DARK ?? "DARK" }
			});
		} catch (err) {
			console.warn("[zx] TonConnect UI failed to load", err);
			return null;
		}
	})();
	return uiPromise;
}
async function openTonConnectModal() {
	const ui = await getTonConnectUI();
	if (!ui) throw new Error("TON Connect is not available.");
	await ui.openModal();
}
async function disconnectTonConnect() {
	const ui = await getTonConnectUI();
	if (!ui) return;
	try {
		await ui.disconnect();
	} catch {}
}
var SPARKS = [
	{
		t: "3%",
		l: "18%",
		d: "0s",
		s: "2px",
		star: false
	},
	{
		t: "6%",
		l: "72%",
		d: "0.35s",
		s: "3px",
		star: true
	},
	{
		t: "10%",
		l: "42%",
		d: "1.1s",
		s: "2px",
		star: false
	},
	{
		t: "14%",
		l: "8%",
		d: "0.6s",
		s: "4px",
		star: true
	},
	{
		t: "16%",
		l: "88%",
		d: "1.8s",
		s: "2px",
		star: false
	},
	{
		t: "20%",
		l: "28%",
		d: "0.2s",
		s: "3px",
		star: false
	},
	{
		t: "24%",
		l: "64%",
		d: "2.2s",
		s: "2px",
		star: true
	},
	{
		t: "28%",
		l: "14%",
		d: "0.9s",
		s: "3px",
		star: false
	},
	{
		t: "32%",
		l: "92%",
		d: "1.4s",
		s: "2px",
		star: false
	},
	{
		t: "36%",
		l: "48%",
		d: "0.5s",
		s: "5px",
		star: true
	},
	{
		t: "40%",
		l: "6%",
		d: "1.7s",
		s: "2px",
		star: false
	},
	{
		t: "44%",
		l: "78%",
		d: "0.1s",
		s: "3px",
		star: false
	},
	{
		t: "48%",
		l: "22%",
		d: "2.4s",
		s: "2px",
		star: true
	},
	{
		t: "52%",
		l: "58%",
		d: "0.8s",
		s: "4px",
		star: false
	},
	{
		t: "56%",
		l: "86%",
		d: "1.5s",
		s: "2px",
		star: false
	},
	{
		t: "60%",
		l: "12%",
		d: "2.0s",
		s: "3px",
		star: true
	},
	{
		t: "64%",
		l: "38%",
		d: "0.4s",
		s: "2px",
		star: false
	},
	{
		t: "68%",
		l: "70%",
		d: "1.2s",
		s: "3px",
		star: false
	},
	{
		t: "72%",
		l: "4%",
		d: "1.9s",
		s: "2px",
		star: true
	},
	{
		t: "76%",
		l: "94%",
		d: "0.7s",
		s: "4px",
		star: false
	},
	{
		t: "80%",
		l: "32%",
		d: "2.3s",
		s: "2px",
		star: false
	},
	{
		t: "84%",
		l: "54%",
		d: "1.0s",
		s: "3px",
		star: true
	},
	{
		t: "88%",
		l: "16%",
		d: "1.6s",
		s: "2px",
		star: false
	},
	{
		t: "12%",
		l: "56%",
		d: "2.6s",
		s: "2px",
		star: false
	},
	{
		t: "42%",
		l: "36%",
		d: "0.35s",
		s: "2px",
		star: true
	},
	{
		t: "66%",
		l: "82%",
		d: "2.8s",
		s: "3px",
		star: false
	},
	{
		t: "22%",
		l: "96%",
		d: "1.3s",
		s: "2px",
		star: false
	},
	{
		t: "8%",
		l: "32%",
		d: "2.1s",
		s: "3px",
		star: true
	},
	{
		t: "92%",
		l: "44%",
		d: "0.55s",
		s: "2px",
		star: false
	},
	{
		t: "18%",
		l: "50%",
		d: "1.65s",
		s: "2px",
		star: false
	}
];
var STAGE_SPARKS = [
	{
		t: "6%",
		l: "6%",
		d: "0.2s",
		s: "2px"
	},
	{
		t: "11%",
		l: "94%",
		d: "1.1s",
		s: "3px"
	},
	{
		t: "18%",
		l: "4%",
		d: "2.0s",
		s: "2px"
	},
	{
		t: "27%",
		l: "96%",
		d: "0.7s",
		s: "2px"
	},
	{
		t: "38%",
		l: "3%",
		d: "1.6s",
		s: "3px"
	},
	{
		t: "49%",
		l: "97%",
		d: "0.4s",
		s: "2px"
	},
	{
		t: "61%",
		l: "5%",
		d: "2.4s",
		s: "2px"
	},
	{
		t: "72%",
		l: "95%",
		d: "0.9s",
		s: "3px"
	},
	{
		t: "84%",
		l: "7%",
		d: "1.8s",
		s: "2px"
	},
	{
		t: "14%",
		l: "78%",
		d: "2.7s",
		s: "2px"
	},
	{
		t: "33%",
		l: "22%",
		d: "0.15s",
		s: "2px"
	},
	{
		t: "55%",
		l: "88%",
		d: "1.35s",
		s: "2px"
	},
	{
		t: "77%",
		l: "18%",
		d: "2.15s",
		s: "3px"
	},
	{
		t: "8%",
		l: "48%",
		d: "0.85s",
		s: "2px"
	},
	{
		t: "91%",
		l: "62%",
		d: "1.55s",
		s: "2px"
	}
];
function StageSparks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: STAGE_SPARKS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "gold-spark absolute rounded-full bg-gold-2",
			style: {
				top: p.t,
				left: p.l,
				width: p.s,
				height: p.s,
				animationDelay: p.d,
				boxShadow: "0 0 8px var(--color-gold-2)"
			}
		}, i))
	});
}
function MiningCore({ active, boosted, onHelp, onTap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto grid h-[248px] w-full shrink-0 place-items-center",
		children: [
			SPARKS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("pointer-events-none absolute rounded-full bg-gold-2", p.star ? "gold-spark-star" : "gold-spark"),
				style: {
					top: p.t,
					left: p.l,
					width: p.s,
					height: p.s,
					animationDelay: p.d,
					boxShadow: p.star ? "0 0 8px var(--color-gold-2)" : "0 0 6px var(--color-gold)"
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("coin-aura size-[15.5rem] opacity-55", active && "mining-glow") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "coin-floor bottom-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onTap,
				className: cn("relative z-10 rounded-full", boosted && "coin-boost"),
				"aria-label": "Tap coin to boost mining",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/zx-coin.png",
					alt: "",
					width: 280,
					height: 280,
					className: cn("coin-hero", active ? "coin-float" : "coin-idle"),
					draggable: false
				})
			}),
			onHelp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onHelp,
				className: "absolute bottom-3 left-1 z-20 grid size-10 place-items-center rounded-full border border-border bg-elevated/90 text-muted",
				"aria-label": "Help",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-5" })
			}) : null
		]
	});
}
var COLS = 2;
var CARD_H = 172;
var GAP = 10;
var ROW_H = 182;
var OVERSCAN = 4;
function formatRate(n) {
	return `${n.toFixed(3)}$`;
}
function needAtfLabel(need) {
	return Math.max(0, Math.floor(need + 1e-9)).toLocaleString("en-US");
}
function MinerStore({ user, config, onOpenLevel }) {
	const scroller = (0, import_react.useRef)(null);
	const startRowRef = (0, import_react.useRef)(0);
	const [startRow, setStartRow] = (0, import_react.useState)(0);
	const [height, setHeight] = (0, import_react.useState)(520);
	const [pnlOpen, setPnlOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	const visRows = Math.ceil(height / ROW_H) + 8;
	const start = startRow * COLS;
	const end = Math.min(680, (startRow + visRows) * COLS);
	const items = (0, import_react.useMemo)(() => Array.from({ length: Math.max(0, end - start) }, (_, i) => getLevelCard(start + i + 1)), [start, end]);
	const holding = user.holdingBalance ?? 0;
	const points = user.pnlHistory ?? [];
	const usdLeft = user.nextRequiredUsd ? Math.max(0, user.nextRequiredUsd - holding * config.atfUsd) : 0;
	const peak = user.peakLevel || user.level;
	const fromPeak = Math.max(0, peak - user.level);
	const pnl = user.dailyPnl ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise-in flex min-h-0 flex-1 flex-col pt-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-center font-display text-[1.65rem] font-semibold tracking-tight",
				children: "Miner Store"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted",
				children: "Auto-unlocks based on your ZX Holding."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "miner-journey mt-3 w-full rounded-[18px] px-3.5 py-3 text-left",
				onClick: () => setPnlOpen(true),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold",
							children: "My Level Journey"
						}), fromPeak > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "miner-peak-chip",
							children: [fromPeak, " from peak"]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-[1.35rem] font-semibold leading-tight",
						children: [
							"Level ",
							user.level,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "•"
							}),
							" Peak ",
							peak
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[13px] text-muted",
						children: [
							"Today's P&L",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("font-display font-semibold", pnl >= 0 ? "text-ok" : "text-danger"),
								children: [
									pnl >= 0 ? "+" : "",
									formatAtf(pnl, Math.abs(pnl) >= 10 ? 1 : 2),
									" ZX"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { points }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[11px] text-muted",
						children: "Tap to view full PNL chart"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 px-1 font-display text-[11px] text-ok",
				children: user.nextRequiredUsd ? `${formatUsd(usdLeft)} left to Lvl UP` : "Max level"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "miner-scroller mt-1 min-h-0 flex-1 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					style: { height: Math.ceil(680 / COLS) * ROW_H },
					children: items.map((card) => {
						const idx = card.level - 1;
						const row = Math.floor(idx / COLS);
						const col = idx % COLS;
						const active = user.level >= card.level;
						const nextUp = card.level === user.level + 1;
						const need = Math.max(0, card.requiredAtf - holding);
						const usdNeed = Math.max(0, card.requiredUsd - holding * config.atfUsd);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpenLevel(card.level),
							className: "miner-tile absolute flex flex-col px-2.5 pb-2.5 pt-2 text-left",
							style: {
								top: row * ROW_H,
								left: col === 0 ? 0 : `calc(50% + ${GAP / 2}px)`,
								width: `calc(50% - ${GAP / 2}px)`,
								height: CARD_H
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-[13px] font-semibold text-gold",
									children: ["Lvl ", card.level]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "miner-rate-well mx-auto mt-1 grid h-[58px] w-[58px] place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-[1.15rem] font-bold leading-none text-ok",
										children: formatRate(card.usdPerHour)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex items-center justify-between px-0.5 font-display text-[10px] text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Speed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-semibold text-fg",
										children: [card.speedThs.toFixed(2), " TH/s"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-auto",
									children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "miner-pill-active",
										children: "ACTIVE"
									}) : nextUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "miner-pill-need",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3" }),
											"NEED ",
											needAtfLabel(need),
											" ZX"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-center font-display text-[10px] text-ok",
										children: [formatUsd(usdNeed), " left to unlock"]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "miner-lockbar",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5 text-gold" })
									})
								})
							]
						}, card.level);
					})
				})
			}),
			pnlOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlChartModal, {
				points,
				daily: pnl,
				peak,
				onClose: () => setPnlOpen(false)
			}) : null
		]
	});
}
function LevelDetail({ quote, busy, confirmLabel, onClose, onBuy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-lg font-semibold",
						children: [
							"Lvl ",
							quote.level,
							" Details"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted",
						onClick: onClose,
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Mining Speed",
					v: `${quote.speedThs.toFixed(2)} TH/s`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Required Holding",
					v: `${quote.requiredAtf.toLocaleString(void 0, { maximumFractionDigits: 2 })} ZX (${formatUsd(quote.requiredUsd)})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Your Assets",
					v: `${quote.assets.toFixed(4)} ZX`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Missing",
					v: `${quote.missingAtf.toLocaleString(void 0, { maximumFractionDigits: 2 })} ZX (${formatUsd(quote.missingUsd)})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full border border-border font-display text-sm font-semibold text-muted",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-claim h-11 rounded-full font-display text-sm font-bold",
						disabled: busy || quote.unlocked,
						onClick: onBuy,
						children: quote.unlocked ? "Unlocked" : confirmLabel || `Buy Level ${quote.level}`
					})]
				})
			]
		})
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 border-b border-border/60 py-2.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-display font-semibold",
			children: v
		})]
	});
}
function Sparkline({ points }) {
	const w = 320;
	const h = 56;
	if (!points.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 grid h-14 place-items-center rounded-lg bg-white/4 text-[11px] text-muted",
		children: "No PNL yet — claim to build your chart"
	});
	const min = Math.min(...points, 0);
	const max = Math.max(...points, .01);
	const d = points.map((p, i) => {
		const x = i / Math.max(1, points.length - 1) * w;
		const y = 48 - (p - min) / (max - min || 1) * 40;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "mt-1 w-full",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "var(--color-pnl)",
			strokeWidth: "2.4",
			strokeLinejoin: "round"
		})
	});
}
function PnlChartModal({ points, daily, peak, onClose }) {
	const data = points.map((v, i) => ({
		i: i + 1,
		v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold",
						children: "PNL chart"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted",
						onClick: onClose,
						children: "Close"
					})]
				}),
				points.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-40 place-items-center rounded-xl border border-dashed border-border text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-semibold",
						children: "No history yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 px-6 text-xs text-muted",
						children: "Claim mining rewards to build your PNL chart."
					})] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "i",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									hide: true,
									domain: ["auto", "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#141416",
										border: "1px solid #2a2418",
										borderRadius: 12,
										fontSize: 12
									},
									formatter: (value) => [`${Number(value ?? 0).toFixed(4)} ZX`, "PNL"],
									labelFormatter: (label) => `Claim ${label}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "v",
									stroke: "var(--color-pnl)",
									strokeWidth: 2.4,
									dot: false
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"Today ",
						formatAtf(daily, 4),
						" ZX · Peak Lvl ",
						peak
					]
				})
			]
		})
	});
}
function WalletSheet({ current, busy, onClose, onConnect, onDisconnect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end bg-black/70 sm:items-center sm:justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ton-sheet w-full max-w-md rounded-t-[28px] px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-[28px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 place-items-center rounded-full bg-white/6 text-muted",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-9 place-items-center rounded-full bg-white/8 text-muted",
					onClick: onClose,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), Boolean(current) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-3 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-center text-[1.35rem] font-semibold tracking-tight",
						children: "TON wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center text-sm text-muted",
						children: "Connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-2xl bg-white/6 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 break-all font-display text-sm",
							children: current
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 h-12 w-full rounded-full bg-white/8 font-medium text-fg",
						disabled: busy,
						onClick: onConnect,
						children: "Connect another wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 h-12 w-full rounded-full bg-[#3a1a1a] font-semibold text-danger",
						disabled: busy,
						onClick: onDisconnect,
						children: "Disconnect wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TonFooter, {})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-center text-[1.35rem] font-semibold tracking-tight",
						children: "Connect your TON wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-1.5 max-w-[18rem] text-center text-[13px] leading-snug text-muted",
						children: "Official TON Connect — Telegram Wallet, Tonkeeper and others"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "ton-primary mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold text-white",
						disabled: busy,
						onClick: onConnect,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), "Connect TON wallet"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TonFooter, {})
				]
			})]
		})
	});
}
function TonFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-7 place-items-center rounded-full bg-[#0098ea]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					className: "size-4",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M4 8.5 12 5l8 3.5-8 12L4 8.5Z",
						fill: "#fff"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[15px] font-semibold tracking-tight",
				children: ["TON ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-normal text-muted",
					children: "Connect"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid size-8 place-items-center rounded-full bg-white/8 text-muted"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" })
		})]
	});
}
var TOKEN_KEY = "atf_session";
var SOUND_KEY = "atf_sound";
function telegramInitData() {
	if (typeof window === "undefined") return "";
	const w = window;
	w.Telegram?.WebApp?.ready?.();
	w.Telegram?.WebApp?.expand?.();
	return w.Telegram?.WebApp?.initData ?? "";
}
function haptic() {
	try {
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
	} catch {}
}
function openLink(url) {
	const w = window;
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
function MiniApp() {
	const [tab, setTab] = (0, import_react.useState)("mine");
	const [config, setConfig] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [captcha, setCaptcha] = (0, import_react.useState)(null);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [friends, setFriends] = (0, import_react.useState)(null);
	const [withdrawals, setWithdrawals] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)("");
	const [help, setHelp] = (0, import_react.useState)(false);
	const [walletOpen, setWalletOpen] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [withdrawOpen, setWithdrawOpen] = (0, import_react.useState)(false);
	const [wdAmount, setWdAmount] = (0, import_react.useState)("");
	const [sound, setSound] = (0, import_react.useState)(false);
	const [claimNote, setClaimNote] = (0, import_react.useState)(null);
	const [levelNote, setLevelNote] = (0, import_react.useState)(null);
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [payHint, setPayHint] = (0, import_react.useState)(null);
	const stageRef = (0, import_react.useRef)(null);
	const lastBoost = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 250);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		setSound(localStorage.getItem(SOUND_KEY) !== "0");
		const tabParam = new URLSearchParams(window.location.search).get("tab");
		if (tabParam === "tasks" || tabParam === "miners" || tabParam === "friends" || tabParam === "profile") setTab(tabParam);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = stageRef.current;
		if (!el) return;
		const block = (e) => {
			const t = e.target;
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
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const cfg = await getPublicConfig();
				if (cancelled) return;
				setConfig(cfg);
				const initData = telegramInitData();
				const boot = await bootstrapUser({ data: {
					initData,
					startParam: new URLSearchParams(window.location.search).get("tgWebAppStartParam") ?? ""
				} });
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
	(0, import_react.useEffect)(() => {
		if (!token) return;
		if (tab === "tasks") listActiveTasks({ data: { token } }).then(setTasks).catch((e) => setError(String(e.message ?? e)));
		if (tab === "friends") getFriends({ data: { token } }).then(setFriends).catch((e) => setError(String(e.message ?? e)));
		if (tab === "profile") myWithdrawals({ data: { token } }).then(setWithdrawals).catch((e) => setError(String(e.message ?? e)));
	}, [tab, token]);
	(0, import_react.useEffect)(() => {
		if (!token) return;
		let unsub;
		let cancelled = false;
		(async () => {
			const ui = await getTonConnectUI();
			if (!ui || cancelled) return;
			const apply = async (address) => {
				const friendly = friendlyFromTonConnect(address);
				if (!friendly) return;
				try {
					const next = await saveWallet({ data: {
						token,
						address: friendly
					} });
					if (!cancelled) {
						setUser(next);
						flash("Wallet connected");
					}
				} catch (err) {
					if (!cancelled) setError(err instanceof Error ? err.message : "Wallet failed");
				}
			};
			if (ui.account?.address) apply(ui.account.address);
			unsub = ui.onStatusChange((wallet) => {
				if (wallet?.account?.address) apply(wallet.account.address);
			});
		})();
		return () => {
			cancelled = true;
			unsub?.();
		};
	}, [token]);
	(0, import_react.useEffect)(() => {
		if (!token || tab !== "tasks") return;
		if (!tasks.some((t) => t.uiState === "processing")) return;
		const t = setTimeout(() => {
			listActiveTasks({ data: { token } }).then(setTasks).catch(() => void 0);
		}, 3e3);
		return () => clearTimeout(t);
	}, [
		tasks,
		token,
		tab
	]);
	const remaining = (0, import_react.useMemo)(() => {
		if (!user?.miningStartedAt || !config) return 0;
		const end = new Date(user.miningStartedAt).getTime() + config.cycleHours * 36e5;
		return Math.max(0, end - now);
	}, [
		user,
		config,
		now
	]);
	const boosted = Boolean(user && user.boostUntil > now);
	const livePending = (0, import_react.useMemo)(() => {
		if (!user || !config || !user.miningStartedAt) return 0;
		const start = new Date(user.miningStartedAt).getTime();
		const cap = config.cycleHours * 36e5;
		const end = Math.min(now, start + cap);
		if (end <= start) return 0;
		const base = user.ratePerHour / (boosted ? config.tapBoostMult : 1);
		const boostEnd = user.boostUntil || 0;
		const boostStart = boostEnd - config.tapBoostMs;
		const boostMs = Math.max(0, Math.min(end, boostEnd) - Math.max(start, boostStart));
		const mined = (end - start - boostMs) / 36e5 * base + boostMs / 36e5 * base * config.tapBoostMult;
		return Math.round(mined * 1e4) / 1e4;
	}, [
		user,
		config,
		now,
		boosted
	]);
	const status = (0, import_react.useMemo)(() => {
		if (!user?.miningStartedAt) return "READY";
		if (remaining === 0) return "READY";
		return "MINING";
	}, [
		user,
		remaining,
		livePending
	]);
	function applyUser(next) {
		setUser(next);
		if (next.leveledUpTo && next.leveledUpTo !== user?.level) {
			setLevelNote(next.leveledUpTo);
			playLevelUpSound(sound);
		}
	}
	function flash(msg) {
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
			applyUser(await startMining({ data: {
				token,
				answer: answer ? Number(answer) : void 0
			} }));
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
		if (livePending <= 1e-4) {
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
		const coolUntil = (user.boostUntil || 0) + (config.tapBoostCooldownMs || 5e3);
		if ((user.boostUntil || 0) > 0 && t < coolUntil) {
			haptic();
			return;
		}
		lastBoost.current = t;
		haptic();
		playTapSound(sound);
		try {
			applyUser(await tapBoost({ data: { token } }));
		} catch {}
	}
	async function onGoTask(task) {
		if (!token) return;
		setError("");
		if (task.type === "wallet" && !user?.walletAddress) {
			setWalletOpen(true);
			return;
		}
		if (task.url) openLink(task.url);
		setBusy(true);
		try {
			await openTask({ data: {
				token,
				taskId: task.id
			} });
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
	async function onClaimTask(task) {
		if (!token) return;
		setBusy(true);
		setError("");
		try {
			const res = await claimTask({ data: {
				token,
				taskId: task.id
			} });
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
			if (user?.walletAddress) await disconnectTonConnect();
			await openTonConnectModal();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open TON Connect");
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
			applyUser((await requestWithdraw({ data: {
				token,
				amount: Number(wdAmount)
			} })).user);
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
	async function openLevel(level) {
		if (!token) return;
		setError("");
		try {
			const q = await getLevelQuote({ data: {
				token,
				level
			} });
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
			const res = await createLevelInvoice({ data: {
				token,
				level: quote.level
			} });
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
			const res = await verifyLevelPayment({ data: {
				token,
				paymentId: payHint
			} });
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
	if (!user || !config) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "atf-stage no-callout relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/zx-bg.jpg",
				alt: "",
				className: "atf-bg-bloom"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/zx-bg.jpg",
				alt: "",
				className: "atf-bg-img"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "atf-vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/zx-coin.png",
				alt: "",
				className: "relative size-24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-4 font-display text-sm uppercase tracking-[0.28em] text-gold",
				children: "Booting miner"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-3 text-sm text-danger",
				children: error
			}) : null
		]
	});
	const mining = Boolean(user.miningStartedAt);
	const holding = user.holdingBalance ?? 0;
	const pool = user.balance;
	const assets = holding + pool;
	const usdLeft = user.nextRequiredUsd ? Math.max(0, user.nextRequiredUsd - holding * config.atfUsd) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: stageRef,
		className: "atf-stage no-callout relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden bg-bg pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/zx-bg.jpg",
				alt: "",
				className: "atf-bg-bloom"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/zx-bg.jpg",
				alt: "",
				className: "atf-bg-img"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "atf-vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "atf-dust" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageSparks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-start justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-8 place-items-center rounded-full bg-elevated/80 text-gold",
								onClick: () => {
									const next = !sound;
									setSound(next);
									localStorage.setItem(SOUND_KEY, next ? "1" : "0");
								},
								"aria-label": sound ? "Mute sounds" : "Enable sounds",
								children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4 text-muted" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lvl-badge px-2.5 py-0.5 font-display text-xs",
								children: ["Lvl ", user.level]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("status-pill inline-flex items-center gap-1 px-2.5 py-0.5 font-display text-[11px] uppercase", status === "READY" && "bg-ok/15 text-ok", status === "MINING" && "bg-gold/18 text-gold", boosted && "bg-ok/15 text-ok"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", status === "READY" || boosted ? "bg-ok shadow-[0_0_8px_var(--color-ok)]" : "bg-gold", status === "MINING" && !boosted && "mining-glow") }), boosted ? "MAX SPEED" : status]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lvl-up-hint px-0.5 font-display text-[11px] font-semibold",
						children: user.nextRequiredUsd ? `${formatUsd(usdLeft)} left to Lvl UP` : "Max level"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setError("");
						setWalletOpen(true);
					},
					className: "connect-pill inline-flex size-9 items-center justify-center rounded-full",
					"aria-label": user.walletAddress ? shortWallet(user.walletAddress) : "Connect TON wallet",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-gold" })
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative z-10 mx-4 mt-3 text-center text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-2 pt-1.5",
				children: [
					tab === "mine" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise-in flex min-h-0 flex-1 flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[11px] uppercase tracking-[0.42em] text-muted",
								children: "Assets"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 font-display text-[2.55rem] font-semibold leading-none tabular-nums tracking-tight",
								children: [
									formatAtfShort(assets),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-medium text-gold",
										children: "ZX"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-display text-sm text-muted",
								children: [
									"(",
									formatUsd(atfToUsd(assets)),
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 w-full max-w-xs space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "wallet-pill flex items-center justify-center gap-1 rounded-full px-3 py-1.5 font-display text-[11px] uppercase tracking-wider text-muted",
									children: [
										"Holding wallet: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: formatAtfShort(holding)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gold",
											children: "ZX"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "wallet-pill flex items-center justify-center gap-1 rounded-full px-3 py-1.5 font-display text-[11px] uppercase tracking-wider text-muted",
									children: [
										"Pool wallet: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: formatAtfShort(pool)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gold",
											children: "ZX"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "live-plate mt-2.5 w-full max-w-[228px] rounded-2xl px-4 py-1.5 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "live-green font-display text-[2.05rem] font-semibold leading-none tabular-nums",
									children: [
										"+",
										formatAtf(mining ? livePending : 0, 4),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[1.05rem] font-semibold",
											children: "ZX/s"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-h-0 w-full flex-1 items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiningCore, {
									active: mining,
									boosted,
									onHelp: () => setHelp(true),
									onTap: onCoinTap
								})
							}),
							captcha ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "mt-1 w-full p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: "Solve to start mining"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-display text-3xl font-semibold",
										children: [
											captcha.a,
											" + ",
											captcha.b,
											" = ?"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-3",
										inputMode: "numeric",
										value: answer,
										onChange: (e) => setAnswer(e.target.value),
										placeholder: "Answer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn-claim mt-3 h-12 w-full rounded-full font-display text-sm font-bold tracking-[0.2em]",
										disabled: busy,
										onClick: onStart,
										children: "CONFIRM"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: mining ? onClaim : onStart,
								className: "btn-claim mb-1 mt-0 w-full shrink-0 rounded-full font-display text-lg font-bold tracking-[0.32em]",
								style: { height: 54 },
								children: mining ? "CLAIM" : "START"
							})
						]
					}) : null,
					tab === "tasks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise-in space-y-2 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-center font-display text-[1.65rem] font-semibold tracking-tight",
								children: "Earn Rewards"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-sm text-muted",
								children: "Rewards go directly to Pool Wallet"
							}),
							tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "task-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "task-icon",
										children: taskGlyph(task.type)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-[15px] font-medium leading-snug",
											children: [task.title, task.isRecurring ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-gold/18 px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-gold",
												children: "Recurring"
											}) : null]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 font-display text-[13px] text-muted",
											children: [
												"+",
												task.reward,
												" ZX"
											]
										})]
									}),
									task.uiState === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "task-go shrink-0",
										disabled: busy,
										onClick: () => onGoTask(task),
										children: "Go"
									}) : task.uiState === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "task-processing grid place-items-center",
										children: "Processing"
									}) : task.uiState === "claim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "task-claim shrink-0",
										disabled: busy,
										onClick: () => onClaimTask(task),
										children: "Claim"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "task-done grid place-items-center",
										children: "Done"
									})
								]
							}, task.id))
						]
					}) : null,
					tab === "miners" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MinerStore, {
						user,
						config,
						onOpenLevel: openLevel
					}) : null,
					tab === "friends" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise-in space-y-2.5 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-center font-display text-2xl font-semibold tracking-tight",
								children: "Friends"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-sm text-muted",
								children: [
									"Earn ",
									friends?.reward ?? config.referralReward,
									" ZX per invite plus a mining boost."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "panel p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-[10px] uppercase tracking-wider text-muted",
										children: "Your invite link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 break-all font-display text-xs text-fg",
										children: friends?.inviteLink
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn-claim mt-3 h-11 w-full rounded-full font-display text-sm font-bold tracking-[0.18em]",
										onClick: async () => {
											if (!friends) return;
											await navigator.clipboard.writeText(friends.inviteLink);
											setCopied(true);
											setTimeout(() => setCopied(false), 1500);
										},
										children: copied ? "COPIED" : "COPY"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: (friends?.friends ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-muted",
									children: "No referrals yet."
								}) : friends?.friends.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "panel flex items-center justify-between px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: f.firstName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-[11px] text-muted",
										children: f.atfId
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: timeAgo(f.createdAt)
									})]
								}, f.atfId))
							})
						]
					}) : null,
					tab === "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise-in space-y-1.5 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2.5 text-center font-display text-2xl font-semibold tracking-tight",
								children: "Profile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }),
								title: "User ID",
								sub: user.telegramId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: user.isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-ok" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-muted" }),
								title: "Account Verification",
								sub: user.isVerified ? "Verified" : "Unverified",
								action: user.isVerified ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-claim h-8 rounded-full px-3 font-display text-[11px] font-bold",
									onClick: () => setWalletOpen(true),
									children: "Verify"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "panel flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
								onClick: () => {
									const next = !sound;
									setSound(next);
									localStorage.setItem(SOUND_KEY, next ? "1" : "0");
								},
								children: [sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4 text-danger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium leading-tight",
									children: "Sound effects"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: sound ? "On" : "Muted — tap to enable"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/zx-coin-sm.png",
									alt: "",
									className: "size-5"
								}),
								title: "Assets",
								sub: `${formatAtfShort(assets)} ZX`,
								extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-ok/15 px-2 py-0.5 font-display text-[11px] text-ok",
									children: ["≈ ", formatUsd(atfToUsd(assets), 3)]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4 text-gold" }),
								title: "Holding Wallet",
								sub: `${formatAtfShort(holding)} ZX`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-gold" }),
								title: "Pool Wallet",
								sub: "Withdrawable balance",
								extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-sm font-semibold text-ok",
									children: [formatAtfShort(pool), " ZX"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pt-2 text-center font-display text-sm uppercase tracking-[0.32em] text-gold",
								children: "Controls"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }),
								title: "Withdraw",
								sub: "Transfer Pool to Wallet",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-claim h-8 rounded-full px-3 font-display text-[11px] font-bold",
									onClick: () => {
										setError("");
										setWithdrawOpen(true);
									},
									children: "Withdraw"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "panel flex w-full items-center justify-between rounded-xl px-3 py-2.5",
								onClick: () => setHistoryOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "History"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted",
									children: [withdrawals.length, " records"]
								})]
							})
						]
					}) : null
				]
			}),
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-accent-fg",
				children: toast
			}) : null,
			claimNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "claim-banner pointer-events-none fixed left-1/2 top-[max(4.5rem,env(safe-area-inset-top))] z-40 w-[min(92%,22rem)] -translate-x-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/zx-coin-sm.png",
							alt: "",
							className: "size-10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-bold",
								children: "Congratulation!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs",
								children: ["You received ", claimNote]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-8 place-items-center rounded-full bg-ok text-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
						})
					]
				})
			}) : null,
			levelNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-bg/50 p-6 backdrop-blur-[2px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "levelup-card w-full max-w-xs rounded-3xl px-6 py-8 text-center",
					onClick: () => setLevelNote(null),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/zx-coin.png",
							alt: "",
							className: "mx-auto size-20"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-2xl font-bold text-gold",
							children: "Level up!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-fg",
							children: ["Your miner has been upgraded to Lvl ", levelNote]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-4 inline-flex size-10 items-center justify-center rounded-full bg-gold text-accent-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5" })
						})
					]
				})
			}) : null,
			help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setHelp(false),
				title: "ZX Miner",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: [
						"Tap the coin for a short speed boost. CLAIM moves mined ZX into the Pool Wallet. Holding Wallet unlocks miner levels. Withdraw sends Pool Wallet ZX to your connected TON address. Min",
						" ",
						config.minWithdraw,
						" ZX, fee ",
						config.withdrawFee,
						" ZX."
					]
				})
			}) : null,
			walletOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletSheet, {
				current: user.walletAddress,
				busy,
				onClose: () => setWalletOpen(false),
				onConnect: () => {
					onConnectWallet();
				},
				onDisconnect: onDisconnectWallet
			}) : null,
			quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelDetail, {
				quote,
				busy,
				confirmLabel: payHint ? "Verify payment" : void 0,
				onClose: () => {
					setQuote(null);
					setPayHint(null);
				},
				onBuy: payHint ? confirmPay : buyLevel
			}) : null,
			payHint && quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed bottom-28 left-1/2 z-50 w-[min(92%,22rem)] -translate-x-1/2 rounded-full bg-elevated px-4 py-2 text-center text-xs text-gold",
				children: "Confirm the TON transfer, then tap Buy again to verify."
			}) : null,
			withdrawOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				onClose: () => setWithdrawOpen(false),
				title: "Withdraw",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"From Pool Wallet. Min ",
							config.minWithdraw,
							" ZX, fee ",
							config.withdrawFee,
							" ZX."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3",
						inputMode: "decimal",
						placeholder: `Amount (min ${config.minWithdraw})`,
						value: wdAmount,
						onChange: (e) => setWdAmount(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-claim mt-3 h-11 w-full rounded-full font-display text-sm font-bold tracking-[0.18em]",
						disabled: busy,
						onClick: onWithdraw,
						children: "REQUEST PAYOUT"
					})
				]
			}) : null,
			historyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setHistoryOpen(false),
				title: "Withdrawal History",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-72 space-y-2 overflow-y-auto",
					children: withdrawals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No withdrawals yet."
					}) : withdrawals.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display font-semibold tabular-nums",
									children: [formatAtf(w.netAmount), " ZX"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: w.status === "paid" || w.status === "approved" ? "ok" : w.status === "rejected" ? "danger" : "warn",
									children: w.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"Requested ",
									formatAtf(w.amount),
									" · Fee ",
									formatAtf(w.fee, 0),
									" · ",
									timeAgo(w.createdAt)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 break-all font-display text-[11px] text-subtle",
								children: w.walletAddress
							})
						]
					}, w.id))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-end border-t border-border bg-bg/95 px-1 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm",
				children: [
					[
						"mine",
						Pickaxe,
						"Mine"
					],
					[
						"tasks",
						ClipboardList,
						"Tasks"
					],
					[
						"miners",
						Zap,
						"Miners"
					],
					[
						"friends",
						Users,
						"Friends"
					],
					[
						"profile",
						User,
						"Profile"
					]
				].map(([id, Icon, label]) => {
					const active = tab === id;
					if (id === "miners") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setError("");
							setTab(id);
						},
						className: "flex h-16 flex-1 flex-col items-center justify-end gap-0.5 pb-1 text-[11px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid size-12 -translate-y-2 place-items-center rounded-[14px] bg-ok text-bg shadow-[0_8px_20px_rgba(0,255,106,0.35)]", active && "ring-2 ring-gold"),
							style: { clipPath: "polygon(25% 4%, 75% 4%, 98% 50%, 75% 96%, 25% 96%, 2% 50%)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: active ? "text-gold" : "text-muted",
							children: label
						})]
					}, id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setError("");
							setTab(id);
						},
						className: cn("flex h-16 flex-1 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-gold" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), label]
					}, id);
				})
			})
		]
	});
}
function ProfileRow({ icon, title, sub, extra, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel flex items-center gap-3 rounded-xl px-3 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-9 place-items-center rounded-lg bg-surface text-gold",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted",
					children: sub
				})]
			}),
			extra,
			action
		]
	});
}
function Modal({ title, children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 backdrop-blur-sm sm:place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-surface p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: onClose,
					children: "Close"
				})]
			}), children]
		})
	});
}
function taskGlyph(type) {
	if (type === "twitter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, { className: "size-4 text-[#f97316]" });
	if (type === "website") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4 text-[#38bdf8]" });
	if (type === "react") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-[#fb923c]" });
	if (type === "telegram") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 text-[#2aabee]" });
	if (type === "wallet") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-gold" });
	if (type === "partner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4 text-gold" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4 text-muted" });
}
//#endregion
export { MiniApp as t };
