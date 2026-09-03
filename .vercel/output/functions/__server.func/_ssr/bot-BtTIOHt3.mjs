import { N as webappUrl, S as rateLimit, T as round4, i as REACT_TASK_ID, m as getStore, v as newId } from "./store-C4rWle75.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bot-BtTIOHt3.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function ownerTelegramId() {
	return (process.env.OWNER_TELEGRAM_ID || "").trim();
}
function envAdminIds() {
	return (process.env.ADMIN_TELEGRAM_IDS || "").split(/[, ]+/).map((s) => s.trim()).filter(Boolean);
}
function isOwnerId(telegramId) {
	const owner = ownerTelegramId();
	return Boolean(owner) && telegramId === owner;
}
async function isAdminId(telegramId) {
	if (isOwnerId(telegramId)) return true;
	if (envAdminIds().includes(telegramId)) return true;
	return ((await (await getStore()).getSettings()).adminTelegramIds || []).includes(telegramId);
}
var bot_exports = /* @__PURE__ */ __exportAll({
	broadcastMessage: () => broadcastMessage,
	broadcastNewTask: () => broadcastNewTask,
	broadcastPayload: () => broadcastPayload,
	broadcastPhoto: () => broadcastPhoto,
	ensureTelegramWebhook: () => ensureTelegramWebhook,
	handleTelegramUpdate: () => handleTelegramUpdate,
	notifyUser: () => notifyUser,
	tg: () => tg
});
var flows = globalThis.__zxFlows ?? /* @__PURE__ */ new Map();
globalThis.__zxFlows = flows;
var announceLock = globalThis.__zxAnnounceAt ?? 0;
globalThis.__zxAnnounceAt = announceLock;
function token() {
	return process.env.BOT_TOKEN || "";
}
async function tg(method, body) {
	const t = token();
	if (!t) throw new Error("BOT_TOKEN is not set");
	const json = await (await fetch(`https://api.telegram.org/bot${t}/${method}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body)
	})).json();
	if (!json.ok) throw new Error(json.description || `Telegram ${method} failed`);
	return json.result;
}
function appUrl(tab) {
	const base = webappUrl();
	if (!base) return "";
	return tab ? `${base}/app?tab=${tab}` : `${base}/app`;
}
function startKeyboard() {
	const url = appUrl();
	if (!url) return {
		keyboard: [[{ text: "Open ZX Miner" }]],
		resize_keyboard: true
	};
	return {
		keyboard: [[{
			text: "Open ZX Miner",
			web_app: { url }
		}]],
		resize_keyboard: true
	};
}
function welcomeMarkup(buttons) {
	const url = appUrl();
	const rows = [];
	for (const b of buttons) if (b.url === "webapp" || b.url === "app") {
		if (url) rows.push([{
			text: b.text,
			web_app: { url }
		}]);
		else rows.push([{ text: b.text }]);
	} else if (b.url) rows.push([{
		text: b.text,
		url: b.url
	}]);
	if (!rows.length && url) rows.push([{
		text: "🚀 Start ZX Mining",
		web_app: { url }
	}]);
	return { inline_keyboard: rows };
}
function parseRef(text) {
	if (!text) return null;
	const m = text.match(/^\/start(?:@\w+)?(?:\s+(.+))?$/i);
	if (!m?.[1]) return null;
	return m[1].replace(/^ref[_-]?/i, "").trim() || null;
}
function cmd(text) {
	return text.trim().split(/\s+/)[0]?.split("@")[0]?.toLowerCase() ?? "";
}
function arg(text) {
	return text.replace(/^\/\S+\s*/, "").trim();
}
async function send(chatId, text, extra = {}) {
	await tg("sendMessage", {
		chat_id: chatId,
		text,
		disable_web_page_preview: true,
		...extra
	});
}
async function answerCb(id, text) {
	try {
		await tg("answerCallbackQuery", {
			callback_query_id: id,
			text: text || ""
		});
	} catch {}
}
var USER_HELP = [
	"ZX Miner",
	"/start — open miner",
	"/balance — your ZX",
	"/ref — invite link"
].join("\n");
function adminHelp(isOwner, users) {
	const lines = [
		"ZX Admin",
		`Users who started: ${users}`,
		"/totalusers — all-time / this week / today",
		"",
		"Broadcast",
		"/announcement — text ± button",
		"/announcepic — image + text ± button",
		"",
		"Tasks",
		"/listtasks",
		"/addtask — name, description, link, reward",
		"/edittask — name / link / reward",
		"/deletetask",
		"/setreactchannel — React Latest Post link",
		"/setnewtaskmsg — new-task broadcast template",
		"",
		"Welcome / links",
		"/setwelcome — welcome text",
		"/addwelcomebutton — label + URL",
		"/renamewelcomebutton — change a button label",
		"/clearwelcomebuttons",
		"/listwelcomebuttons",
		"/setchannel — community / channel URL",
		"/setgroup — group URL",
		"",
		"/cancel — abort current flow"
	];
	if (isOwner) lines.push("", "Owner", "/addadmin <telegram_id>", "/removeadmin <telegram_id>", "/listadmins", "/sendzx <telegram_id|ZX-id> <amount>", "/sendatf /send_atf /credit — same as /sendzx");
	return lines.join("\n");
}
async function rateLimitedBroadcast() {
	const now = Date.now();
	if (now - (globalThis.__zxAnnounceAt || 0) < 2e4) throw new Error("Please wait before broadcasting again.");
	globalThis.__zxAnnounceAt = now;
}
async function broadcastPayload(payload) {
	if (!token()) return {
		sent: 0,
		failed: 0,
		skipped: true
	};
	const store = await getStore();
	let sent = 0;
	let failed = 0;
	await store.iterateUsers(async (user) => {
		try {
			await tg("sendMessage", {
				chat_id: Number(user.telegramId),
				...payload
			});
			sent += 1;
			await new Promise((r) => setTimeout(r, 40));
		} catch {
			failed += 1;
		}
	});
	return {
		sent,
		failed,
		skipped: false
	};
}
async function broadcastMessage(text, extra = {}) {
	return broadcastPayload({
		text,
		disable_web_page_preview: true,
		...extra
	});
}
async function broadcastPhoto(fileId, caption, extra = {}) {
	if (!token()) return {
		sent: 0,
		failed: 0,
		skipped: true
	};
	const store = await getStore();
	let sent = 0;
	let failed = 0;
	await store.iterateUsers(async (user) => {
		try {
			await tg("sendPhoto", {
				chat_id: Number(user.telegramId),
				photo: fileId,
				caption,
				...extra
			});
			sent += 1;
			await new Promise((r) => setTimeout(r, 50));
		} catch {
			failed += 1;
		}
	});
	return {
		sent,
		failed,
		skipped: false
	};
}
async function broadcastNewTask(task) {
	const settings = await (await getStore()).getSettings();
	const text = (settings.newTaskBroadcastTemplate || "🎉 New task unlocked: {title}\nReward: {reward} ZX\n{description}\n\nOpen the Mini App → Tasks to claim.").replaceAll("{title}", task.title).replaceAll("{reward}", String(task.reward)).replaceAll("{description}", task.description);
	const url = appUrl("tasks");
	const extra = url ? { reply_markup: { inline_keyboard: [[{
		text: "Open Tasks",
		web_app: { url }
	}]] } } : {};
	const res = await broadcastMessage(text, extra);
	if (settings.channelUrl || settings.reactChannelId) try {
		await tg("sendMessage", {
			chat_id: settings.reactChannelId || settings.channelUrl,
			text,
			...extra
		});
	} catch {}
	return res;
}
async function sendWelcome(chatId) {
	const settings = await (await getStore()).getSettings();
	const text = settings.welcomeText || "Welcome to ZX Miner!";
	const markup = welcomeMarkup(settings.welcomeButtons || []);
	const photo = webappUrl() ? `${webappUrl()}/zx-welcome.jpg` : "";
	try {
		if (photo) await tg("sendPhoto", {
			chat_id: chatId,
			photo,
			caption: text,
			reply_markup: markup
		});
		else await send(chatId, text, { reply_markup: markup });
	} catch {
		await send(chatId, text, { reply_markup: markup });
	}
	await tg("sendMessage", {
		chat_id: chatId,
		text: "Tap below anytime.",
		reply_markup: startKeyboard()
	}).catch(() => void 0);
}
async function handleAdminFlow(chatId, fromId, text, msg) {
	const flow = flows.get(fromId);
	const store = await getStore();
	if (cmd(text) === "/cancel") {
		flows.delete(fromId);
		await send(chatId, "Cancelled.");
		return true;
	}
	if (!flow) return false;
	if (flow.kind === "announce" || flow.kind === "announcepic") {
		if (flow.kind === "announcepic" && flow.step === "photo") {
			const file = msg.photo?.[msg.photo.length - 1]?.file_id;
			if (!file) {
				await send(chatId, "Send an image.");
				return true;
			}
			flows.set(fromId, {
				...flow,
				photo: file,
				step: "text"
			});
			await send(chatId, "Send the announcement text.");
			return true;
		}
		if (flow.step === "text") {
			const body = text || msg.caption || "";
			if (!body.trim()) {
				await send(chatId, "Send the announcement text.");
				return true;
			}
			flows.set(fromId, {
				...flow,
				text: body,
				step: "btn"
			});
			await send(chatId, "Button name? Send the label, or /skip for no button.", { reply_markup: { inline_keyboard: [[{
				text: "Skip",
				callback_data: "flow:skip"
			}]] } });
			return true;
		}
		if (flow.step === "btn") {
			if (/^\/skip$/i.test(text) || text === "-") {
				await rateLimitedBroadcast();
				const res = flow.photo ? await broadcastPhoto(flow.photo, flow.text || "") : await broadcastMessage(flow.text || "");
				flows.delete(fromId);
				await send(chatId, `Sent ${res.sent}, failed ${res.failed}.`);
				return true;
			}
			flows.set(fromId, {
				...flow,
				btn: text.slice(0, 40),
				step: "url"
			});
			await send(chatId, "Send the button URL (https://… or webapp).");
			return true;
		}
		if (flow.step === "url") {
			const url = /^webapp$/i.test(text) ? appUrl() : text;
			if (!url || !url.startsWith("http") && url !== appUrl()) {
				await send(chatId, "Send a valid https URL, or webapp.");
				return true;
			}
			await rateLimitedBroadcast();
			const markup = { inline_keyboard: [url === appUrl() ? [{
				text: flow.btn,
				web_app: { url }
			}] : [{
				text: flow.btn,
				url
			}]] };
			const res = flow.photo ? await broadcastPhoto(flow.photo, flow.text || "", { reply_markup: markup }) : await broadcastMessage(flow.text || "", { reply_markup: markup });
			flows.delete(fromId);
			await send(chatId, `Sent ${res.sent}, failed ${res.failed}.`);
			return true;
		}
	}
	if (flow.kind === "addtask") {
		if (flow.step === "name") {
			flows.set(fromId, {
				...flow,
				name: text,
				step: "desc"
			});
			await send(chatId, "Task description?");
			return true;
		}
		if (flow.step === "desc") {
			flows.set(fromId, {
				...flow,
				desc: text,
				step: "link"
			});
			await send(chatId, "Task link? (https://… or - for none)");
			return true;
		}
		if (flow.step === "link") {
			const link = text === "-" ? "" : text;
			flows.set(fromId, {
				...flow,
				link,
				step: "reward"
			});
			await send(chatId, "Reward in ZX? (number)");
			return true;
		}
		if (flow.step === "reward") {
			const reward = Number(text);
			if (!Number.isFinite(reward) || reward < 0) {
				await send(chatId, "Send a valid ZX amount.");
				return true;
			}
			const tasks = await store.listTasks();
			const task = {
				id: newId("task"),
				title: flow.name || "Task",
				description: flow.desc || flow.name || "Task",
				type: "partner",
				url: flow.link || "",
				reward,
				isRecurring: false,
				isActive: true,
				sortOrder: tasks.length + 1,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await store.saveTask(task);
			flows.delete(fromId);
			await send(chatId, `Task saved: ${task.title} (+${reward} ZX). Broadcasting…`);
			const res = await broadcastNewTask(task);
			await send(chatId, `Broadcast sent ${res.sent}, failed ${res.failed}.`);
			return true;
		}
	}
	if (flow.kind === "edittask") {
		if (flow.step === "pick") {
			const task = (await store.listTasks()).find((t) => t.id === text || t.title.toLowerCase() === text.toLowerCase());
			if (!task) {
				await send(chatId, "Task not found. Send id or exact name from /listtasks.");
				return true;
			}
			flows.set(fromId, {
				kind: "edittask",
				step: "field",
				taskId: task.id
			});
			await send(chatId, "Edit what? name / link / reward / description");
			return true;
		}
		if (flow.step === "field") {
			const field = text.toLowerCase();
			if (![
				"name",
				"link",
				"reward",
				"description",
				"title",
				"url"
			].includes(field)) {
				await send(chatId, "Use name, link, reward, or description.");
				return true;
			}
			flows.set(fromId, {
				kind: "edittask",
				step: "value",
				taskId: flow.taskId,
				field
			});
			await send(chatId, "Send the new value.");
			return true;
		}
		if (flow.step === "value" && flow.taskId) {
			const task = (await store.listTasks()).find((t) => t.id === flow.taskId);
			if (!task) {
				flows.delete(fromId);
				await send(chatId, "Task missing.");
				return true;
			}
			const field = flow.field;
			const next = { ...task };
			if (field === "name" || field === "title") next.title = text;
			else if (field === "link" || field === "url") next.url = text;
			else if (field === "description") next.description = text;
			else if (field === "reward") {
				const n = Number(text);
				if (!Number.isFinite(n) || n < 0) {
					await send(chatId, "Send a number.");
					return true;
				}
				next.reward = n;
			}
			await store.saveTask(next);
			flows.delete(fromId);
			await send(chatId, `Updated ${next.title}.`);
			return true;
		}
	}
	if (flow.kind === "deletetask") {
		const task = (await store.listTasks()).find((t) => t.id === text || t.title.toLowerCase() === text.toLowerCase());
		if (!task) {
			await send(chatId, "Task not found.");
			return true;
		}
		if (task.id === "task-react-latest") {
			flows.delete(fromId);
			await send(chatId, "React Latest Post cannot be deleted. Use /setreactchannel to change the link.");
			return true;
		}
		await store.deleteTask(task.id);
		flows.delete(fromId);
		await send(chatId, `Deleted ${task.title}.`);
		return true;
	}
	if (flow.kind === "welcome") {
		await store.updateSettings({ welcomeText: text });
		flows.delete(fromId);
		await send(chatId, "Welcome text saved.");
		return true;
	}
	if (flow.kind === "welcomebtn") {
		if (flow.step === "name") {
			flows.set(fromId, {
				kind: "welcomebtn",
				step: "url",
				name: text.slice(0, 40)
			});
			await send(chatId, "Button URL? https://… or webapp");
			return true;
		}
		const url = /^webapp$/i.test(text) ? "webapp" : text;
		const buttons = [...(await store.getSettings()).welcomeButtons || [], {
			text: flow.name || "Open",
			url
		}];
		await store.updateSettings({ welcomeButtons: buttons });
		flows.delete(fromId);
		await send(chatId, "Welcome button added.");
		return true;
	}
	if (flow.kind === "renamewelcomebtn") {
		const buttons = [...(await store.getSettings()).welcomeButtons || []];
		if (flow.step === "index") {
			const index = Number(text.trim()) - 1;
			if (!Number.isInteger(index) || index < 0 || index >= buttons.length) {
				await send(chatId, "Send a valid button number from /listwelcomebuttons.");
				return true;
			}
			flows.set(fromId, {
				kind: "renamewelcomebtn",
				step: "name",
				index
			});
			await send(chatId, `Current label: ${buttons[index].text}\nSend the new button name.`);
			return true;
		}
		if (flow.index == null || flow.index < 0 || flow.index >= buttons.length) {
			flows.delete(fromId);
			await send(chatId, "Button not found. Use /listwelcomebuttons and try again.");
			return true;
		}
		const updated = buttons.map((b, i) => i === flow.index ? {
			...b,
			text: text.slice(0, 40)
		} : b);
		await store.updateSettings({ welcomeButtons: updated });
		flows.delete(fromId);
		await send(chatId, `Button ${flow.index + 1} renamed to: ${text.slice(0, 40)}`);
		return true;
	}
	if (flow.kind === "channel") {
		await store.updateSettings({
			channelUrl: text,
			communityUrl: text
		});
		flows.delete(fromId);
		await send(chatId, "Channel / community link saved.");
		return true;
	}
	if (flow.kind === "reactchannel") {
		let channelId = "";
		const username = text.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "").split("/")[0];
		try {
			const chat = await tg("getChat", { chat_id: `@${username}` });
			channelId = String(chat.id);
		} catch {
			if (/^-?\d+$/.test(text)) channelId = text;
		}
		const url = text.startsWith("http") ? text : `https://t.me/${username}`;
		await store.updateSettings({
			reactChannelUrl: url,
			reactChannelId: channelId,
			channelUrl: url
		});
		const react = (await store.listTasks()).find((t) => t.id === REACT_TASK_ID);
		if (react) await store.saveTask({
			...react,
			url
		});
		flows.delete(fromId);
		await send(chatId, channelId ? `React channel saved.\n${url}\nChat id ${channelId}\nMake the bot admin in that channel so reactions can be verified.` : `Link saved (${url}) but chat id was not resolved. Send @username after adding the bot as admin.`);
		return true;
	}
	if (flow.kind === "newtaskmsg") {
		await store.updateSettings({ newTaskBroadcastTemplate: text });
		flows.delete(fromId);
		await send(chatId, "New-task broadcast template saved. Use {title} {reward} {description}.");
		return true;
	}
	if (flow.kind === "addadmin") {
		const id = text.replace(/\D/g, "");
		if (!id) {
			await send(chatId, "Send a numeric Telegram user id.");
			return true;
		}
		if (isOwnerId(id)) {
			flows.delete(fromId);
			await send(chatId, "That id is the owner.");
			return true;
		}
		const settings = await store.getSettings();
		const ids = Array.from(/* @__PURE__ */ new Set([...settings.adminTelegramIds || [], id]));
		await store.updateSettings({ adminTelegramIds: ids });
		flows.delete(fromId);
		await send(chatId, `Admin added: ${id}`);
		return true;
	}
	if (flow.kind === "removeadmin") {
		const id = text.replace(/\D/g, "");
		const settings = await store.getSettings();
		await store.updateSettings({ adminTelegramIds: (settings.adminTelegramIds || []).filter((x) => x !== id) });
		flows.delete(fromId);
		await send(chatId, `Admin removed: ${id}`);
		return true;
	}
	if (flow.kind === "sendzx") {
		if (!isOwnerId(fromId)) {
			flows.delete(fromId);
			await send(chatId, "Owner only.");
			return true;
		}
		if (flow.step === "who") {
			flows.set(fromId, {
				kind: "sendzx",
				step: "amount",
				who: text.trim()
			});
			await send(chatId, "Amount of ZX to credit to Pool Wallet?");
			return true;
		}
		await creditZxFromOwner(chatId, fromId, flow.who || "", text);
		flows.delete(fromId);
		return true;
	}
	return true;
}
var ownerCreditLog = globalThis.__zxOwnerCredits ?? [];
globalThis.__zxOwnerCredits = ownerCreditLog;
async function findCreditTarget(raw) {
	const id = raw.trim();
	if (!id) return null;
	const store = await getStore();
	if (/^\d+$/.test(id)) {
		const byTg = await store.getUserByTelegramId(id);
		if (byTg) return byTg;
	}
	const byInternal = await store.getUserById(id);
	if (byInternal) return byInternal;
	const alt = /^zx-/i.test(id) ? `ATF-${id.slice(3)}` : /^atf-/i.test(id) ? `ZX-${id.slice(4)}` : "";
	const queries = alt ? [id, alt] : [id];
	const seen = /* @__PURE__ */ new Set();
	const pool = [];
	for (const q of queries) {
		const { items } = await store.listUsers({
			q,
			limit: 25
		});
		for (const u of items) {
			if (seen.has(u.id)) continue;
			seen.add(u.id);
			pool.push(u);
		}
	}
	const needle = id.toLowerCase();
	const altNeedle = alt.toLowerCase();
	const handle = id.replace(/^@/, "").toLowerCase();
	return pool.find((u) => u.atfId.toLowerCase() === needle || altNeedle && u.atfId.toLowerCase() === altNeedle || u.telegramId === id || u.id === id || u.username && u.username.toLowerCase() === handle) ?? null;
}
async function creditZxFromOwner(chatId, ownerId, whoRaw, amountRaw) {
	if (!isOwnerId(ownerId)) {
		await send(chatId, "Owner only.");
		return;
	}
	try {
		rateLimit(`sendzx:${ownerId}`, 8, 6e4);
	} catch (err) {
		await send(chatId, err instanceof Error ? err.message : "Please wait.");
		return;
	}
	const who = whoRaw.trim();
	const amount = Number(String(amountRaw).replace(/,/g, "").trim());
	if (!who) {
		await send(chatId, "Usage: /sendzx <telegram_id|ZX-id> <amount>");
		return;
	}
	if (!Number.isFinite(amount) || amount <= 0) {
		await send(chatId, "Amount must be a number greater than 0.");
		return;
	}
	if (amount > 1e9) {
		await send(chatId, "Amount is too large.");
		return;
	}
	const user = await findCreditTarget(who);
	if (!user) {
		await send(chatId, `User not found: ${who}\nUse a Telegram id or ZX-XXXXXXXX (legacy ATF-XXXXXXXX still matches).`);
		return;
	}
	const store = await getStore();
	const credited = round4(amount);
	const before = user.balance;
	const next = await store.saveUser({
		...user,
		balance: round4(user.balance + credited)
	});
	const log = {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		ownerId,
		toTelegramId: next.telegramId,
		toZxId: next.atfId,
		amount: credited,
		poolBefore: before,
		poolAfter: next.balance
	};
	ownerCreditLog.push(log);
	if (ownerCreditLog.length > 200) ownerCreditLog.shift();
	console.info("[zx] owner-credit", log);
	await send(chatId, [
		`Credited ${credited} ZX to Pool Wallet.`,
		`User: ${next.atfId}`,
		`Telegram: ${next.telegramId}`,
		next.username ? `Username: @${next.username}` : "",
		`Pool: ${before.toFixed(4)} → ${next.balance.toFixed(4)} ZX`
	].filter(Boolean).join("\n"));
	try {
		await notifyUser(next.telegramId, `The owner credited ${credited} ZX to your Pool Wallet.\nNew Pool balance: ${next.balance.toFixed(4)} ZX`);
	} catch {}
}
async function handleAdminCommand(chatId, fromId, text) {
	const store = await getStore();
	const c = cmd(text);
	const rest = arg(text);
	if (c === "/announcement") {
		flows.set(fromId, {
			kind: "announce",
			step: "text"
		});
		await send(chatId, "Send the announcement text.");
		return;
	}
	if (c === "/announcepic" || c === "/announce_image") {
		flows.set(fromId, {
			kind: "announcepic",
			step: "photo"
		});
		await send(chatId, "Send the image.");
		return;
	}
	if (c === "/addtask") {
		flows.set(fromId, {
			kind: "addtask",
			step: "name"
		});
		await send(chatId, "Task name?");
		return;
	}
	if (c === "/edittask") {
		flows.set(fromId, {
			kind: "edittask",
			step: "pick"
		});
		await send(chatId, `Send task id or name to edit:\n${(await store.listTasks()).map((t) => `${t.id} — ${t.title} (+${t.reward})`).join("\n") || "No tasks."}`);
		return;
	}
	if (c === "/deletetask") {
		flows.set(fromId, {
			kind: "deletetask",
			step: "pick"
		});
		await send(chatId, `Send task id or name to delete:\n${(await store.listTasks()).map((t) => `${t.id} — ${t.title}`).join("\n") || "No tasks."}`);
		return;
	}
	if (c === "/listtasks") {
		await send(chatId, (await store.listTasks()).map((t) => `• ${t.title}\n  ${t.id} | +${t.reward} ZX | ${t.url || "no link"}`).join("\n\n") || "No tasks.");
		return;
	}
	if (c === "/setreactchannel") {
		if (rest) {
			flows.set(fromId, { kind: "reactchannel" });
			await handleAdminFlow(chatId, fromId, rest, {
				chat: { id: chatId },
				text: rest
			});
			return;
		}
		flows.set(fromId, { kind: "reactchannel" });
		await send(chatId, "Send the channel link or @username. Bot must be admin there.");
		return;
	}
	if (c === "/setwelcome") {
		if (rest) {
			await store.updateSettings({ welcomeText: rest });
			await send(chatId, "Welcome text saved.");
			return;
		}
		flows.set(fromId, { kind: "welcome" });
		await send(chatId, "Send the new welcome message text.");
		return;
	}
	if (c === "/addwelcomebutton") {
		flows.set(fromId, {
			kind: "welcomebtn",
			step: "name"
		});
		await send(chatId, "Button label?");
		return;
	}
	if (c === "/renamewelcomebutton" || c === "/editwelcomebutton") {
		const buttons = (await store.getSettings()).welcomeButtons || [];
		if (!buttons.length) {
			await send(chatId, "No welcome buttons yet. Use /addwelcomebutton first.");
			return;
		}
		const lines = buttons.map((b, i) => `${i + 1}. ${b.text} → ${b.url}`).join("\n");
		flows.set(fromId, {
			kind: "renamewelcomebtn",
			step: "index"
		});
		await send(chatId, `Send the button number to rename:\n${lines}`);
		return;
	}
	if (c === "/totalusers") {
		const s = await store.stats();
		await send(chatId, `Total users: ${s.users}\nThis week: ${s.weekUsers}\nToday: ${s.todayUsers}`);
		return;
	}
	if (c === "/clearwelcomebuttons") {
		await store.updateSettings({ welcomeButtons: [] });
		await send(chatId, "Welcome buttons cleared.");
		return;
	}
	if (c === "/listwelcomebuttons") {
		await send(chatId, ((await store.getSettings()).welcomeButtons || []).map((b, i) => `${i + 1}. ${b.text} → ${b.url}`).join("\n") || "None.");
		return;
	}
	if (c === "/setchannel" || c === "/setcommunity") {
		if (rest) {
			await store.updateSettings({
				channelUrl: rest,
				communityUrl: rest
			});
			await send(chatId, "Channel link saved.");
			return;
		}
		flows.set(fromId, { kind: "channel" });
		await send(chatId, "Send the community / channel URL.");
		return;
	}
	if (c === "/setgroup") {
		if (rest) {
			await store.updateSettings({ groupUrl: rest });
			await send(chatId, "Group link saved.");
			return;
		}
		await send(chatId, "Send /setgroup https://t.me/…");
		return;
	}
	if (c === "/setnewtaskmsg") {
		flows.set(fromId, { kind: "newtaskmsg" });
		await send(chatId, "Send the template. Placeholders: {title} {reward} {description}");
		return;
	}
	if (c === "/addadmin") {
		if (!isOwnerId(fromId)) {
			await send(chatId, "Owner only.");
			return;
		}
		if (rest.replace(/\D/g, "")) {
			flows.set(fromId, { kind: "addadmin" });
			await handleAdminFlow(chatId, fromId, rest, {
				chat: { id: chatId },
				text: rest
			});
			return;
		}
		flows.set(fromId, { kind: "addadmin" });
		await send(chatId, "Send the Telegram user id to promote.");
		return;
	}
	if (c === "/removeadmin") {
		if (!isOwnerId(fromId)) {
			await send(chatId, "Owner only.");
			return;
		}
		if (rest.replace(/\D/g, "")) {
			flows.set(fromId, { kind: "removeadmin" });
			await handleAdminFlow(chatId, fromId, rest, {
				chat: { id: chatId },
				text: rest
			});
			return;
		}
		flows.set(fromId, { kind: "removeadmin" });
		await send(chatId, "Send the Telegram user id to demote.");
		return;
	}
	if (c === "/listadmins") {
		if (!isOwnerId(fromId) && !await isAdminId(fromId)) return;
		const s = await store.getSettings();
		await send(chatId, `Owner: ${process.env.OWNER_TELEGRAM_ID || "(not set)"}\nEnv admins: ${(process.env.ADMIN_TELEGRAM_IDS || "").trim() || "(none)"}\nDB admins: ${(s.adminTelegramIds || []).join(", ") || "(none)"}`);
		return;
	}
	if (c === "/sendzx" || c === "/sendatf" || c === "/credit" || c === "/send_atf") {
		if (!isOwnerId(fromId)) {
			await send(chatId, "Owner only.");
			return;
		}
		const parts = rest.split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			const amountToken = parts[parts.length - 1];
			await creditZxFromOwner(chatId, fromId, parts.slice(0, -1).join(" "), amountToken);
			return;
		}
		if (parts.length === 1) {
			flows.set(fromId, {
				kind: "sendzx",
				step: "amount",
				who: parts[0]
			});
			await send(chatId, "Amount of ZX to credit to Pool Wallet?");
			return;
		}
		flows.set(fromId, {
			kind: "sendzx",
			step: "who"
		});
		await send(chatId, "Send the Telegram user id or ZX-XXXXXXXX to credit (legacy ATF-XXXXXXXX still matches).");
		return;
	}
}
async function handleTelegramUpdate(update) {
	if (update.channel_post) {
		const post = update.channel_post;
		const store = await getStore();
		const settings = await store.getSettings();
		const chatId = String(post.chat.id);
		if (!settings.reactChannelId || settings.reactChannelId === chatId) {
			await store.saveChannelPost({
				chatId,
				messageId: post.message_id || 0,
				date: Math.floor(Date.now() / 1e3)
			});
			if (!settings.reactChannelId) await store.updateSettings({ reactChannelId: chatId });
		}
		return;
	}
	if (update.message_reaction) {
		const r = update.message_reaction;
		const userId = r.user?.id ? String(r.user.id) : "";
		if (!userId) return;
		if ((r.new_reaction || []).length === 0) return;
		await (await getStore()).recordReaction({
			telegramId: userId,
			chatId: String(r.chat.id),
			messageId: r.message_id,
			reactedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return;
	}
	if (update.callback_query) {
		const q = update.callback_query;
		const fromId = String(q.from.id);
		const chatId = q.message?.chat.id;
		if (q.data === "flow:skip" && chatId) {
			const flow = flows.get(fromId);
			await answerCb(q.id);
			if (flow && (flow.kind === "announce" || flow.kind === "announcepic") && flow.step === "btn") try {
				await rateLimitedBroadcast();
				const res = flow.photo ? await broadcastPhoto(flow.photo, flow.text || "") : await broadcastMessage(flow.text || "");
				flows.delete(fromId);
				await send(chatId, `Sent ${res.sent}, failed ${res.failed}.`);
			} catch (err) {
				await send(chatId, err instanceof Error ? err.message : "Broadcast failed.");
			}
		}
		return;
	}
	const msg = update.message;
	if (!msg?.from) return;
	const text = msg.text || "";
	const store = await getStore();
	const settings = await store.getSettings();
	const telegramId = String(msg.from.id);
	const ref = parseRef(text);
	const c = cmd(text);
	if (await handleAdminFlow(msg.chat.id, telegramId, text, msg)) return;
	if (c === "/start" || text === "Open ZX Miner" || text === "Open ATF Miner") {
		if (!await store.getUserByTelegramId(telegramId)) await store.createUser({
			telegramId,
			username: msg.from.username,
			firstName: msg.from.first_name,
			lastName: msg.from.last_name,
			referredBy: ref && ref !== telegramId ? ref : null
		});
		await sendWelcome(msg.chat.id);
		return;
	}
	if (c === "/balance" || c === "/me") {
		const user = await store.getUserByTelegramId(telegramId);
		await send(msg.chat.id, user ? `${user.atfId}\nPool ${user.balance.toFixed(2)} ${settings.tokenSymbol}\nHolding ${user.holdingBalance.toFixed(2)}\nLevel ${user.minerLevel || 1}` : "Tap /start first.");
		return;
	}
	if (c === "/ref") {
		const bot = settings.botUsername.replace(/^@/, "");
		await send(msg.chat.id, `Invite link:\nhttps://t.me/${bot}?start=ref${telegramId}\n\nYou earn ${settings.referralReward} ${settings.tokenSymbol} per friend plus a mining boost.`);
		return;
	}
	if (c === "/help") {
		if (!await isAdminId(telegramId)) {
			await send(msg.chat.id, USER_HELP, { reply_markup: startKeyboard() });
			return;
		}
		const stats = await store.stats();
		await send(msg.chat.id, adminHelp(isOwnerId(telegramId), stats.users), { reply_markup: startKeyboard() });
		return;
	}
	if ([
		"/announcement",
		"/announcepic",
		"/announce_image",
		"/addtask",
		"/edittask",
		"/deletetask",
		"/listtasks",
		"/setreactchannel",
		"/setwelcome",
		"/addwelcomebutton",
		"/renamewelcomebutton",
		"/editwelcomebutton",
		"/clearwelcomebuttons",
		"/listwelcomebuttons",
		"/totalusers",
		"/setchannel",
		"/setcommunity",
		"/setgroup",
		"/setnewtaskmsg",
		"/addadmin",
		"/removeadmin",
		"/listadmins",
		"/sendzx",
		"/sendatf",
		"/send_atf",
		"/credit",
		"/cancel"
	].includes(c)) {
		if (!await isAdminId(telegramId)) return;
		await handleAdminCommand(msg.chat.id, telegramId, text);
	}
}
async function ensureTelegramWebhook() {
	const t = token();
	const base = webappUrl();
	if (!t || !base) return {
		ok: false,
		reason: "BOT_TOKEN or WEBAPP_URL missing"
	};
	const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
	const url = `${base}/api/telegram/webhook`;
	await tg("setWebhook", {
		url,
		secret_token: secret || void 0,
		allowed_updates: [
			"message",
			"channel_post",
			"message_reaction",
			"callback_query"
		],
		drop_pending_updates: false
	});
	return {
		ok: true,
		url,
		menuUrl: `${base}/app`
	};
}
async function notifyUser(telegramId, text) {
	if (!token()) return;
	try {
		await tg("sendMessage", {
			chat_id: Number(telegramId),
			text
		});
	} catch (err) {
		console.warn("[zx] notify failed", err);
	}
}
//#endregion
export { handleTelegramUpdate as n, bot_exports as t };
