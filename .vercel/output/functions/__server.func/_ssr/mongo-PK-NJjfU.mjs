import { o as __toESM } from "../_runtime.mjs";
import { d as atfIdFromTelegram, f as defaultTasks, i as REACT_TASK_ID, n as DEFAULT_SETTINGS, v as newId, y as normalizeUser } from "./store-C4rWle75.mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mongo-PK-NJjfU.js
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var userSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true
	},
	telegramId: {
		type: String,
		unique: true,
		index: true
	},
	username: {
		type: String,
		default: ""
	},
	firstName: {
		type: String,
		default: "Miner"
	},
	lastName: {
		type: String,
		default: ""
	},
	atfId: {
		type: String,
		unique: true,
		index: true
	},
	balance: {
		type: Number,
		default: 0
	},
	holdingBalance: {
		type: Number,
		default: 0
	},
	minedTotal: {
		type: Number,
		default: 0
	},
	referralCount: {
		type: Number,
		default: 0
	},
	referralSuccessCount: {
		type: Number,
		default: 0
	},
	referralClaimedCount: {
		type: Number,
		default: 0
	},
	referralEarnings: {
		type: Number,
		default: 0
	},
	teamBalance: {
		type: Number,
		default: 0
	},
	referredBy: {
		type: String,
		default: null
	},
	walletAddress: {
		type: String,
		default: null
	},
	miningStartedAt: {
		type: String,
		default: null
	},
	lastClaimAt: {
		type: String,
		default: null
	},
	minerLevel: {
		type: Number,
		default: 1
	},
	peakLevel: {
		type: Number,
		default: 1
	},
	boostUntil: {
		type: Number,
		default: 0
	},
	dailyPnl: {
		type: Number,
		default: 0
	},
	dailyPnlDate: {
		type: String,
		default: ""
	},
	pnlHistory: {
		type: [Number],
		default: []
	},
	journey: {
		type: [import_mongoose.Schema.Types.Mixed],
		default: []
	},
	isBanned: {
		type: Boolean,
		default: false
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	createdAt: String,
	updatedAt: String
}, { collection: "atf_users" });
var taskSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true
	},
	title: String,
	description: String,
	type: String,
	url: String,
	reward: Number,
	isRecurring: Boolean,
	isActive: Boolean,
	sortOrder: Number,
	createdAt: String,
	locked: Boolean
}, { collection: "atf_tasks" });
var completionSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true
	},
	userId: {
		type: String,
		index: true
	},
	taskId: {
		type: String,
		index: true
	},
	completedAt: String
}, { collection: "atf_completions" });
var progressSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true
	},
	userId: {
		type: String,
		index: true
	},
	taskId: {
		type: String,
		index: true
	},
	status: String,
	goAt: String,
	updatedAt: String
}, { collection: "atf_progress" });
var withdrawalSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true
	},
	userId: String,
	telegramId: String,
	atfId: String,
	username: String,
	amount: Number,
	fee: Number,
	netAmount: Number,
	walletAddress: String,
	status: {
		type: String,
		index: true
	},
	note: String,
	txHash: {
		type: String,
		default: null
	},
	createdAt: String,
	processedAt: String
}, { collection: "atf_withdrawals" });
var settingsSchema = new import_mongoose.Schema({
	key: {
		type: String,
		unique: true
	},
	...Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((k) => [k, import_mongoose.Schema.Types.Mixed]))
}, {
	collection: "atf_settings",
	strict: false
});
var paymentSchema = new import_mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true
	},
	userId: String,
	telegramId: String,
	level: Number,
	memo: {
		type: String,
		unique: true,
		index: true
	},
	dest: String,
	amountNano: String,
	amountTon: Number,
	amountUsd: Number,
	status: String,
	txHash: String,
	createdAt: String
}, { collection: "atf_payments" });
var postSchema = new import_mongoose.Schema({
	chatId: {
		type: String,
		index: true
	},
	messageId: Number,
	date: Number
}, { collection: "atf_posts" });
var reactionSchema = new import_mongoose.Schema({
	telegramId: {
		type: String,
		index: true
	},
	chatId: String,
	messageId: Number,
	reactedAt: String
}, { collection: "atf_reactions" });
var g = globalThis;
function leanUser(d) {
	if (!d) return null;
	const { _id: _ignored, ...rest } = d;
	return normalizeUser(rest);
}
function stripId(d) {
	if (!d) return null;
	const { _id, ...rest } = d;
	return rest;
}
async function createMongoStore(uri) {
	if (!g.__zxMongo || g.__zxMongo.conn.connection.readyState !== 1) g.__zxMongo = {
		conn: await import_mongoose.default.connect(uri, { dbName: process.env.MONGODB_DB || "atf_airdrop" }),
		User: import_mongoose.default.models.atf_user || import_mongoose.default.model("atf_user", userSchema),
		Task: import_mongoose.default.models.atf_task || import_mongoose.default.model("atf_task", taskSchema),
		Completion: import_mongoose.default.models.atf_completion || import_mongoose.default.model("atf_completion", completionSchema),
		Progress: import_mongoose.default.models.atf_progress || import_mongoose.default.model("atf_progress", progressSchema),
		Withdrawal: import_mongoose.default.models.atf_withdrawal || import_mongoose.default.model("atf_withdrawal", withdrawalSchema),
		Settings: import_mongoose.default.models.atf_settings || import_mongoose.default.model("atf_settings", settingsSchema),
		Payment: import_mongoose.default.models.atf_payment || import_mongoose.default.model("atf_payment", paymentSchema),
		Post: import_mongoose.default.models.atf_post || import_mongoose.default.model("atf_post", postSchema),
		Reaction: import_mongoose.default.models.atf_reaction || import_mongoose.default.model("atf_reaction", reactionSchema)
	};
	const db = g.__zxMongo;
	async function ensureSeed() {
		if (await db.Settings.countDocuments() === 0) await db.Settings.create({
			key: "main",
			...DEFAULT_SETTINGS
		});
		if (await db.Task.countDocuments() === 0) await db.Task.insertMany(defaultTasks());
		else if (!await db.Task.findOne({ id: "task-react-latest" }).lean()) {
			const [reactTask] = defaultTasks().filter((t) => t.id === REACT_TASK_ID);
			if (reactTask) await db.Task.create(reactTask);
		}
	}
	await ensureSeed();
	const store = {
		backend: "mongo",
		async ready() {
			await ensureSeed();
		},
		async getSettings() {
			const doc = await db.Settings.findOne({ key: "main" }).lean();
			return {
				...DEFAULT_SETTINGS,
				...stripId(doc)
			};
		},
		async updateSettings(patch) {
			const doc = await db.Settings.findOneAndUpdate({ key: "main" }, { $set: patch }, {
				returnDocument: "after",
				upsert: true
			}).lean();
			return {
				...DEFAULT_SETTINGS,
				...stripId(doc)
			};
		},
		async getUserByTelegramId(id) {
			return leanUser(await db.User.findOne({ telegramId: id }).lean());
		},
		async getUserById(id) {
			return leanUser(await db.User.findOne({ id }).lean());
		},
		async createUser(input) {
			const existing = await db.User.findOne({ telegramId: input.telegramId }).lean();
			if (existing) return leanUser(existing);
			const settings = await store.getSettings();
			const t = (/* @__PURE__ */ new Date()).toISOString();
			const user = normalizeUser({
				id: newId("usr"),
				telegramId: input.telegramId,
				username: input.username ?? "",
				firstName: input.firstName ?? "Miner",
				lastName: input.lastName ?? "",
				atfId: atfIdFromTelegram(input.telegramId),
				balance: settings.welcomeBonus,
				holdingBalance: 0,
				minedTotal: 0,
				referralCount: 0,
				referralSuccessCount: 0,
				referralClaimedCount: 0,
				referralEarnings: 0,
				teamBalance: 0,
				referredBy: input.referredBy ?? null,
				walletAddress: null,
				miningStartedAt: t,
				lastClaimAt: null,
				minerLevel: 1,
				peakLevel: 1,
				boostUntil: 0,
				dailyPnl: 0,
				dailyPnlDate: t.slice(0, 10),
				pnlHistory: [],
				journey: [],
				isBanned: false,
				isVerified: false,
				createdAt: t,
				updatedAt: t
			});
			try {
				await db.User.create(user);
			} catch (err) {
				const raced = await db.User.findOne({ telegramId: input.telegramId }).lean();
				if (raced) return leanUser(raced);
				throw err;
			}
			if (input.referredBy && input.referredBy !== input.telegramId) await db.User.updateOne({ telegramId: input.referredBy }, {
				$inc: { referralCount: 1 },
				$set: { updatedAt: t }
			});
			return user;
		},
		async saveUser(user) {
			const next = normalizeUser({
				...user,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			await db.User.updateOne({ id: next.id }, { $set: next }, { upsert: true });
			return next;
		},
		async applyClaim(userId, expectedStartedAt, pending) {
			const t = (/* @__PURE__ */ new Date()).toISOString();
			const before = await db.User.findOne({
				id: userId,
				miningStartedAt: expectedStartedAt,
				isBanned: false
			}).lean();
			const next = leanUser(await db.User.findOneAndUpdate({
				id: userId,
				miningStartedAt: expectedStartedAt,
				isBanned: false
			}, {
				$inc: {
					balance: pending,
					minedTotal: pending,
					dailyPnl: pending
				},
				$set: {
					lastClaimAt: t,
					miningStartedAt: t,
					boostUntil: 0,
					dailyPnlDate: t.slice(0, 10),
					updatedAt: t
				},
				$push: { pnlHistory: {
					$each: [pending],
					$slice: -48
				} }
			}, { returnDocument: "after" }).lean());
			if (next && before && before.referredBy && (before.minedTotal ?? 0) <= 1e-4) await db.User.updateOne({ telegramId: before.referredBy }, {
				$inc: { referralSuccessCount: 1 },
				$set: { updatedAt: t }
			});
			return next;
		},
		async applyDebit(userId, amount) {
			const t = (/* @__PURE__ */ new Date()).toISOString();
			return leanUser(await db.User.findOneAndUpdate({
				id: userId,
				isBanned: false,
				balance: { $gte: amount }
			}, {
				$inc: { balance: -amount },
				$set: { updatedAt: t }
			}, { returnDocument: "after" }).lean());
		},
		async creditHolding(userId, amount) {
			const t = (/* @__PURE__ */ new Date()).toISOString();
			return leanUser(await db.User.findOneAndUpdate({ id: userId }, {
				$inc: { holdingBalance: amount },
				$set: { updatedAt: t }
			}, { returnDocument: "after" }).lean());
		},
		async listUsers(opts = {}) {
			const page = opts.page ?? 1;
			const limit = opts.limit ?? 20;
			const filter = {};
			if (opts.banned === true) filter.isBanned = true;
			if (opts.q) {
				const rx = new RegExp(opts.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
				filter.$or = [
					{ atfId: rx },
					{ username: rx },
					{ firstName: rx },
					{ telegramId: rx },
					{ walletAddress: rx }
				];
			}
			const total = await db.User.countDocuments(filter);
			return {
				items: (await db.User.find(filter).sort({ minedTotal: -1 }).skip((page - 1) * limit).limit(limit).lean()).map((d) => leanUser(d)),
				total
			};
		},
		async iterateUsers(fn) {
			const cursor = db.User.find({ isBanned: { $ne: true } }).lean().cursor();
			let n = 0;
			for await (const doc of cursor) {
				const u = leanUser(doc);
				if (u) {
					await fn(u);
					n += 1;
				}
			}
			return n;
		},
		async topMiners(limit) {
			return (await db.User.find({ isBanned: false }).sort({ minedTotal: -1 }).limit(limit).lean()).map((d) => leanUser(d));
		},
		async referredFriends(telegramId) {
			return (await db.User.find({ referredBy: telegramId }).sort({ createdAt: -1 }).lean()).map((u) => ({
				firstName: u.firstName,
				username: u.username,
				atfId: u.atfId,
				createdAt: u.createdAt,
				isActive: Boolean(u.lastClaimAt) || (u.minedTotal ?? 0) > .01
			}));
		},
		async listTasks() {
			return (await db.Task.find().sort({ sortOrder: 1 }).lean()).map((d) => stripId(d));
		},
		async saveTask(task) {
			await db.Task.updateOne({ id: task.id }, { $set: task }, { upsert: true });
			return task;
		},
		async deleteTask(id) {
			if (id === "task-react-latest") return;
			await db.Task.deleteOne({ id });
		},
		async getCompletions(userId) {
			return (await db.Completion.find({ userId }).lean()).map((d) => stripId(d));
		},
		async addCompletion(c) {
			try {
				await db.Completion.create(c);
			} catch {}
			return c;
		},
		async getProgress(userId, taskId) {
			return stripId(await db.Progress.findOne({
				userId,
				taskId
			}).lean());
		},
		async saveProgress(p) {
			await db.Progress.updateOne({
				userId: p.userId,
				taskId: p.taskId
			}, { $set: p }, { upsert: true });
			return p;
		},
		async createWithdrawal(w) {
			await db.Withdrawal.create(w);
			return w;
		},
		async listWithdrawals(opts = {}) {
			const page = opts.page ?? 1;
			const limit = opts.limit ?? 20;
			const filter = {};
			if (opts.status) filter.status = opts.status;
			if (opts.q) {
				const rx = new RegExp(opts.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
				filter.$or = [
					{ atfId: rx },
					{ username: rx },
					{ walletAddress: rx },
					{ telegramId: rx }
				];
			}
			const total = await db.Withdrawal.countDocuments(filter);
			return {
				items: (await db.Withdrawal.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()).map((d) => stripId(d)),
				total
			};
		},
		async getWithdrawal(id) {
			return stripId(await db.Withdrawal.findOne({ id }).lean());
		},
		async saveWithdrawal(w) {
			await db.Withdrawal.updateOne({ id: w.id }, { $set: w }, { upsert: true });
			return w;
		},
		async createPayment(p) {
			await db.Payment.create(p);
			return p;
		},
		async getPayment(id) {
			return stripId(await db.Payment.findOne({ id }).lean());
		},
		async getPaymentByMemo(memo) {
			return stripId(await db.Payment.findOne({ memo }).lean());
		},
		async savePayment(p) {
			await db.Payment.updateOne({ id: p.id }, { $set: p }, { upsert: true });
			return p;
		},
		async saveChannelPost(p) {
			await db.Post.updateOne({
				chatId: p.chatId,
				messageId: p.messageId
			}, { $set: p }, { upsert: true });
			return p;
		},
		async latestChannelPost(chatId) {
			const filter = chatId ? { chatId } : {};
			return stripId(await db.Post.findOne(filter).sort({ date: -1 }).lean());
		},
		async recordReaction(r) {
			await db.Reaction.updateOne({
				telegramId: r.telegramId,
				chatId: r.chatId,
				messageId: r.messageId
			}, { $set: r }, { upsert: true });
			return r;
		},
		async hasReaction(telegramId, chatId, messageId) {
			return await db.Reaction.countDocuments({
				telegramId,
				chatId,
				messageId
			}) > 0;
		},
		async stats() {
			const startOfDay = /* @__PURE__ */ new Date();
			startOfDay.setHours(0, 0, 0, 0);
			const startOfWeek = new Date(startOfDay);
			startOfWeek.setDate(startOfWeek.getDate() - 6);
			const [users, activeMiners, mined, pending, paid, tasks, newUsersToday, weekUsers] = await Promise.all([
				db.User.countDocuments(),
				db.User.countDocuments({
					miningStartedAt: { $ne: null },
					isBanned: false
				}),
				db.User.aggregate([{ $group: {
					_id: null,
					v: { $sum: "$minedTotal" }
				} }]),
				db.Withdrawal.aggregate([{ $match: { status: "pending" } }, { $group: {
					_id: null,
					n: { $sum: 1 },
					v: { $sum: "$amount" }
				} }]),
				db.Withdrawal.aggregate([{ $match: { status: { $in: ["paid", "approved"] } } }, { $group: {
					_id: null,
					v: { $sum: "$netAmount" }
				} }]),
				db.Task.countDocuments({ isActive: true }),
				db.User.countDocuments({ createdAt: { $gte: startOfDay.toISOString() } }),
				db.User.countDocuments({ createdAt: { $gte: startOfWeek.toISOString() } })
			]);
			const balances = await db.User.aggregate([{ $group: {
				_id: null,
				v: { $sum: "$balance" }
			} }]);
			return {
				users,
				activeMiners,
				totalMined: mined[0]?.v ?? 0,
				totalBalance: balances[0]?.v ?? 0,
				pendingWithdrawals: pending[0]?.n ?? 0,
				pendingAmount: pending[0]?.v ?? 0,
				paidAmount: paid[0]?.v ?? 0,
				tasks,
				newUsersToday,
				todayUsers: newUsersToday,
				weekUsers
			};
		}
	};
	return store;
}
//#endregion
export { createMongoStore };
