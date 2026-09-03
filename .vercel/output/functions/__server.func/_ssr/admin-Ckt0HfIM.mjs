import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as formatAtf, I as shortWallet, T as formatCompact, a as adminDeleteTask, b as cn, c as adminListWithdrawals, d as adminPatchUser, f as adminProcessWithdrawal, h as adminSyncWebhook, i as adminBroadcast, l as adminLogin, m as adminSaveTask, n as Card, o as adminListTasks, p as adminSaveSettings, r as Input, s as adminListUsers, t as Badge, u as adminOverview, z as timeAgo } from "./input-7ROTXz8O.mjs";
import { D as Ban, O as ArrowUpRight, T as Check, _ as ListTodo, f as Radio, h as LogOut, o as Users, r as Wallet, u as Settings, v as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Ckt0HfIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-elevated text-fg border border-border hover:bg-surface",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-danger text-bg hover:opacity-90",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition-colors focus:ring-2 focus:ring-ring/50", className),
		...props
	});
}
var ADMIN_KEY = "atf_admin";
function AdminApp() {
	const [token, setToken] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [overview, setOverview] = (0, import_react.useState)(null);
	const [users, setUsers] = (0, import_react.useState)({
		items: [],
		total: 0
	});
	const [userQ, setUserQ] = (0, import_react.useState)("");
	const [payouts, setPayouts] = (0, import_react.useState)({
		items: [],
		total: 0
	});
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [broadcast, setBroadcast] = (0, import_react.useState)("");
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [taskDraft, setTaskDraft] = (0, import_react.useState)({
		title: "",
		description: "",
		type: "telegram",
		url: "",
		reward: 20,
		isRecurring: false,
		isActive: true,
		sortOrder: 10
	});
	(0, import_react.useEffect)(() => {
		const saved = sessionStorage.getItem(ADMIN_KEY);
		if (saved) setToken(saved);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!token) return;
		loadOverview();
	}, [token]);
	async function loadOverview() {
		try {
			const data = await adminOverview({ data: { token } });
			setOverview(data);
			setSettings(data.settings);
			setError("");
		} catch {
			setToken("");
			sessionStorage.removeItem(ADMIN_KEY);
		}
	}
	async function onLogin(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			const res = await adminLogin({ data: { password } });
			setToken(res.token);
			sessionStorage.setItem(ADMIN_KEY, res.token);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setBusy(false);
		}
	}
	async function loadUsers() {
		const res = await adminListUsers({ data: {
			token,
			q: userQ,
			page: 1
		} });
		setUsers(res);
	}
	async function loadPayouts() {
		const res = await adminListWithdrawals({ data: {
			token,
			page: 1
		} });
		setPayouts(res);
	}
	async function loadTasks() {
		setTasks(await adminListTasks({ data: { token } }));
	}
	(0, import_react.useEffect)(() => {
		if (!token) return;
		if (tab === "users") loadUsers();
		if (tab === "payouts") loadPayouts();
		if (tab === "tasks") loadTasks();
	}, [tab, token]);
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-sm p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted",
					children: "ZX Control"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold",
					children: "Admin sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Demo password is ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "atf-admin"
						}),
						". Change it with ADMIN_PASSWORD on Render."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 grid gap-3",
					onSubmit: onLogin,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pw",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pw",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								autoComplete: "current-password"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: "Enter console"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-sm text-muted hover:text-fg",
					children: "Back to terminal"
				})
			]
		})
	});
	const stats = overview?.stats;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border-b border-border md:min-h-dvh md:w-56 md:border-b-0 md:border-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-4 md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted",
						children: "ZX"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold",
						children: "Control"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "md:mt-6",
						onClick: () => {
							setToken("");
							sessionStorage.removeItem(ADMIN_KEY);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3",
					children: [
						[
							"overview",
							LayoutDashboard,
							"Overview"
						],
						[
							"users",
							Users,
							"Users"
						],
						[
							"payouts",
							Wallet,
							"Payouts"
						],
						[
							"tasks",
							ListTodo,
							"Tasks"
						],
						[
							"settings",
							Settings,
							"Settings"
						],
						[
							"setup",
							Radio,
							"Render setup"
						]
					].map(([id, Icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: `flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm ${tab === id ? "bg-elevated text-fg" : "text-muted hover:text-fg"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
					}, id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex-1 px-4 py-5 md:px-8",
				children: [
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-danger",
						children: error
					}) : null,
					tab === "overview" && stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold",
								children: "Overview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Store: ",
									overview?.backend,
									overview?.demoMode ? " · demo data until MongoDB is connected" : ""
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
								children: [
									["Miners", formatCompact(stats.users)],
									["Active cycles", formatCompact(stats.activeMiners)],
									["Mined ZX", formatCompact(Math.round(stats.totalMined))],
									["Pending payouts", String(stats.pendingWithdrawals)]
								].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] uppercase tracking-wider text-muted",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-display text-2xl font-semibold tabular-nums",
										children: v
									})]
								}, k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 lg:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-medium",
										children: "Latest miners"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-2",
										children: overview?.recentUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												u.firstName,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs text-muted",
													children: u.atfId
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: formatAtf(u.minedTotal, 0)
											})]
										}, u.id))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-medium",
										children: "Payout queue"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-2",
										children: (overview?.pending ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-sm text-muted",
											children: "Queue is clear."
										}) : overview?.pending.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs",
												children: w.atfId
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums",
												children: [formatAtf(w.netAmount), " ZX"]
											})]
										}, w.id))
									})]
								})]
							})
						]
					}) : null,
					tab === "users" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold",
								children: "Users"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									loadUsers();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search ZX ID, username, wallet",
									value: userQ,
									onChange: (e) => setUserQ(e.target.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									variant: "secondary",
									children: "Search"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[720px] text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-elevated text-xs uppercase tracking-wider text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Miner"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Balance"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Mined"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Refs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.items.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: u.firstName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-mono text-[11px] text-muted",
													children: u.atfId
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 tabular-nums",
												children: formatAtf(u.balance)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 tabular-nums",
												children: formatAtf(u.minedTotal, 0)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 tabular-nums",
												children: u.referralCount
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2",
												children: u.isBanned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													tone: "danger",
													children: "Banned"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													tone: "ok",
													children: "Live"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "secondary",
														onClick: async () => {
															const raw = window.prompt("Set balance", String(u.balance));
															if (raw == null) return;
															await adminPatchUser({ data: {
																token,
																userId: u.id,
																balance: Number(raw)
															} });
															await loadUsers();
														},
														children: "Edit"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: async () => {
															await adminPatchUser({ data: {
																token,
																userId: u.id,
																banned: !u.isBanned
															} });
															await loadUsers();
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-3.5" }), u.isBanned ? "Unban" : "Ban"]
													})]
												})
											})
										]
									}, u.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [users.total, " miners"]
							})
						]
					}) : null,
					tab === "payouts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-semibold",
							children: "Payouts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: payouts.items.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium tabular-nums",
									children: [
										formatAtf(w.amount),
										" → ",
										formatAtf(w.netAmount),
										" ZX"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-muted",
									children: [
										w.atfId,
										" · ",
										shortWallet(w.walletAddress),
										" · ",
										timeAgo(w.createdAt)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: w.status === "pending" ? "warn" : w.status === "rejected" ? "danger" : "ok",
										children: w.status
									}), w.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: async () => {
											await adminProcessWithdrawal({ data: {
												token,
												id: w.id,
												status: "paid"
											} });
											await loadPayouts();
											await loadOverview();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Pay"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: async () => {
											await adminProcessWithdrawal({ data: {
												token,
												id: w.id,
												status: "rejected"
											} });
											await loadPayouts();
										},
										children: "Reject"
									})] }) : null]
								})]
							}, w.id))
						})]
					}) : null,
					tab === "tasks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold",
								children: "Tasks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "grid gap-3 p-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: taskDraft.title ?? "",
											onChange: (e) => setTaskDraft({
												...taskDraft,
												title: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reward" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: taskDraft.reward ?? 0,
											onChange: (e) => setTaskDraft({
												...taskDraft,
												reward: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5 md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: taskDraft.url ?? "",
											onChange: (e) => setTaskDraft({
												...taskDraft,
												url: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: async () => {
											if (!taskDraft.title) return;
											await adminSaveTask({ data: {
												token,
												task: {
													id: "",
													title: taskDraft.title,
													description: taskDraft.description || taskDraft.title,
													type: taskDraft.type || "partner",
													url: taskDraft.url || "",
													reward: Number(taskDraft.reward) || 0,
													isRecurring: Boolean(taskDraft.isRecurring),
													isActive: true,
													sortOrder: Number(taskDraft.sortOrder) || 10,
													createdAt: (/* @__PURE__ */ new Date()).toISOString()
												}
											} });
											setTaskDraft({
												...taskDraft,
												title: "",
												url: ""
											});
											await loadTasks();
										},
										children: "Add task"
									})
								]
							}),
							tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "flex items-center justify-between p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										"+",
										t.reward,
										" ZX · ",
										t.type,
										t.isRecurring ? " · daily" : ""
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: async () => {
										await adminDeleteTask({ data: {
											token,
											id: t.id
										} });
										await loadTasks();
									},
									children: "Remove"
								})]
							}, t.id))
						]
					}) : null,
					tab === "settings" && settings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold",
								children: "Settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "grid gap-3 p-4 md:grid-cols-2",
								children: [[
									["botUsername", "Bot username"],
									["channelUrl", "Channel URL"],
									["groupUrl", "Group URL"],
									["twitterUrl", "X URL"],
									["websiteUrl", "Website"]
								].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(settings[key]),
										onChange: (e) => setSettings({
											...settings,
											[key]: e.target.value
										})
									})]
								}, key)), [
									["minWithdraw", "Min withdraw"],
									["withdrawFee", "Withdraw fee"],
									["referralReward", "Referral reward"],
									["welcomeBonus", "Welcome bonus"],
									["cycleHours", "Cycle hours"]
								].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: Number(settings[key]),
										onChange: (e) => setSettings({
											...settings,
											[key]: Number(e.target.value)
										})
									})]
								}, key))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: async () => {
									await adminSaveSettings({ data: {
										token,
										settings
									} });
									await loadOverview();
								},
								children: "Save settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-medium",
										children: "Broadcast"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-2",
										value: broadcast,
										onChange: (e) => setBroadcast(e.target.value),
										placeholder: "Message to all miners"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "mt-3",
										variant: "secondary",
										onClick: async () => {
											const res = await adminBroadcast({ data: {
												token,
												text: broadcast
											} });
											setBroadcast("");
											setError(res.skipped ? "Bot token missing — broadcast skipped." : `Sent ${res.sent}, failed ${res.failed}.`);
										},
										children: "Send"
									})
								]
							})
						]
					}) : null,
					tab === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupPanel, {
						overview,
						onSync: async () => {
							const res = await adminSyncWebhook({ data: { token } });
							setError(res.ok ? `Webhook set: ${res.url}` : res.reason || "Webhook failed");
						}
					}) : null
				]
			})]
		})
	});
}
function SetupPanel({ overview, onSync }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Render setup"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-muted",
				children: "Host only on Render. Use MongoDB Atlas for data. Do not deploy this bot on any other platform."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase text-muted",
							children: "MongoDB"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: overview?.mongoConfigured ? "URI present" : "Not set"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase text-muted",
							children: "Bot token"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: overview?.botConfigured ? "Present" : "Not set"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase text-muted",
							children: "Web app URL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate font-medium",
							children: overview?.webappUrl || "Not set"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5 text-sm leading-relaxed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-3 pl-5 text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"In BotFather, create or reuse ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "@ATF_AIRDROP_bot"
							}),
							". Copy the token."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Create a free MongoDB Atlas cluster. Database user + Network Access ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "0.0.0.0/0"
							}),
							". Copy the connection string."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"On Render, New Web Service from this repo. Build:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "npm install && npm run build"
							}),
							". Start:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "npm start"
							}),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Set env vars: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "MONGODB_URI"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "BOT_TOKEN"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "ADMIN_PASSWORD"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "WEBAPP_URL"
							}),
							" (your https://….onrender.com),",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "NITRO_PRESET=render_com"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "NODE_VERSION=22"
							}),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"BotFather → /newapp → Mini App URL",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: "https://YOUR.onrender.com/app"
							}),
							"."
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void onSync(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" }), "Set Telegram webhook"]
				})]
			})
		]
	});
}
var SplitComponent = AdminApp;
//#endregion
export { SplitComponent as component };
