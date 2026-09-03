import mongoose, { Schema } from "mongoose";
import { DEFAULT_SETTINGS, defaultTasks, REACT_TASK_ID } from "./constants";
import { atfIdFromTelegram, newId } from "./crypto";
import { normalizeUser } from "./mining";
import type { AtfStore } from "./store";
import type {
  ChannelPost,
  CreateUserInput,
  DashboardStats,
  LevelPayment,
  ListOpts,
  ReactionRecord,
  ReferredFriend,
  Settings,
  Task,
  TaskCompletion,
  TaskProgress,
  User,
  Withdrawal,
} from "./types";

type UserDoc = User & { _id?: unknown };
type TaskDoc = Task & { _id?: unknown };
type CompletionDoc = TaskCompletion & { _id?: unknown };
type ProgressDoc = TaskProgress & { _id?: unknown };
type WithdrawalDoc = Withdrawal & { _id?: unknown };
type SettingsDoc = Settings & { key: string; _id?: unknown };
type PaymentDoc = LevelPayment & { _id?: unknown };
type PostDoc = ChannelPost & { _id?: unknown };
type ReactionDoc = ReactionRecord & { _id?: unknown };

const userSchema = new Schema<UserDoc>(
  {
    id: { type: String, unique: true, index: true },
    telegramId: { type: String, unique: true, index: true },
    username: { type: String, default: "" },
    firstName: { type: String, default: "Miner" },
    lastName: { type: String, default: "" },
    atfId: { type: String, unique: true, index: true },
    balance: { type: Number, default: 0 },
    holdingBalance: { type: Number, default: 0 },
    minedTotal: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
    referralSuccessCount: { type: Number, default: 0 },
    referralClaimedCount: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },
    teamBalance: { type: Number, default: 0 },
    referredBy: { type: String, default: null },
    walletAddress: { type: String, default: null },
    miningStartedAt: { type: String, default: null },
    lastClaimAt: { type: String, default: null },
    minerLevel: { type: Number, default: 1 },
    peakLevel: { type: Number, default: 1 },
    boostUntil: { type: Number, default: 0 },
    dailyPnl: { type: Number, default: 0 },
    dailyPnlDate: { type: String, default: "" },
    pnlHistory: { type: [Number], default: [] },
    journey: { type: [Schema.Types.Mixed], default: [] } as never,
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    createdAt: String,
    updatedAt: String,
  },
  { collection: "atf_users" },
);

const taskSchema = new Schema<TaskDoc>(
  {
    id: { type: String, unique: true, index: true },
    title: String,
    description: String,
    type: String,
    url: String,
    reward: Number,
    isRecurring: Boolean,
    isActive: Boolean,
    sortOrder: Number,
    createdAt: String,
    locked: Boolean,
  },
  { collection: "atf_tasks" },
);

const completionSchema = new Schema<CompletionDoc>(
  {
    id: { type: String, unique: true },
    userId: { type: String, index: true },
    taskId: { type: String, index: true },
    completedAt: String,
  },
  { collection: "atf_completions" },
);

const progressSchema = new Schema<ProgressDoc>(
  {
    id: { type: String, unique: true },
    userId: { type: String, index: true },
    taskId: { type: String, index: true },
    status: String,
    goAt: String,
    updatedAt: String,
  },
  { collection: "atf_progress" },
);

const withdrawalSchema = new Schema<WithdrawalDoc>(
  {
    id: { type: String, unique: true, index: true },
    userId: String,
    telegramId: String,
    atfId: String,
    username: String,
    amount: Number,
    fee: Number,
    netAmount: Number,
    walletAddress: String,
    status: { type: String, index: true },
    note: String,
    txHash: { type: String, default: null },
    createdAt: String,
    processedAt: String,
  },
  { collection: "atf_withdrawals" },
);

const settingsSchema = new Schema<SettingsDoc>(
  { key: { type: String, unique: true }, ...Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((k) => [k, Schema.Types.Mixed])) },
  { collection: "atf_settings", strict: false },
);

const paymentSchema = new Schema<PaymentDoc>(
  {
    id: { type: String, unique: true, index: true },
    userId: String,
    telegramId: String,
    level: Number,
    memo: { type: String, unique: true, index: true },
    dest: String,
    amountNano: String,
    amountTon: Number,
    amountUsd: Number,
    status: String,
    txHash: String,
    createdAt: String,
  },
  { collection: "atf_payments" },
);

const postSchema = new Schema<PostDoc>(
  {
    chatId: { type: String, index: true },
    messageId: Number,
    date: Number,
  },
  { collection: "atf_posts" },
);

const reactionSchema = new Schema<ReactionDoc>(
  {
    telegramId: { type: String, index: true },
    chatId: String,
    messageId: Number,
    reactedAt: String,
  },
  { collection: "atf_reactions" },
);

const g = globalThis as unknown as {
  __zxMongo?: {
    conn: typeof mongoose;
    User: mongoose.Model<UserDoc>;
    Task: mongoose.Model<TaskDoc>;
    Completion: mongoose.Model<CompletionDoc>;
    Progress: mongoose.Model<ProgressDoc>;
    Withdrawal: mongoose.Model<WithdrawalDoc>;
    Settings: mongoose.Model<SettingsDoc>;
    Payment: mongoose.Model<PaymentDoc>;
    Post: mongoose.Model<PostDoc>;
    Reaction: mongoose.Model<ReactionDoc>;
  };
};

function leanUser(d: UserDoc | null): User | null {
  if (!d) return null;
  const { _id: _ignored, ...rest } = d as UserDoc & { _id?: unknown };
  void _ignored;
  return normalizeUser(rest as User);
}

function stripId<T extends { _id?: unknown }>(d: T | null): Omit<T, "_id"> | null {
  if (!d) return null;
  const { _id, ...rest } = d;
  void _id;
  return rest;
}

export async function createMongoStore(uri: string): Promise<AtfStore> {
  if (!g.__zxMongo || g.__zxMongo.conn.connection.readyState !== 1) {
    const conn = await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "atf_airdrop" });
    const UserM = mongoose.models.atf_user || mongoose.model<UserDoc>("atf_user", userSchema);
    const TaskM = mongoose.models.atf_task || mongoose.model<TaskDoc>("atf_task", taskSchema);
    const CompletionM =
      mongoose.models.atf_completion || mongoose.model<CompletionDoc>("atf_completion", completionSchema);
    const ProgressM =
      mongoose.models.atf_progress || mongoose.model<ProgressDoc>("atf_progress", progressSchema);
    const WithdrawalM =
      mongoose.models.atf_withdrawal || mongoose.model<WithdrawalDoc>("atf_withdrawal", withdrawalSchema);
    const SettingsM =
      mongoose.models.atf_settings || mongoose.model<SettingsDoc>("atf_settings", settingsSchema);
    const PaymentM =
      mongoose.models.atf_payment || mongoose.model<PaymentDoc>("atf_payment", paymentSchema);
    const PostM = mongoose.models.atf_post || mongoose.model<PostDoc>("atf_post", postSchema);
    const ReactionM =
      mongoose.models.atf_reaction || mongoose.model<ReactionDoc>("atf_reaction", reactionSchema);
    g.__zxMongo = {
      conn,
      User: UserM as mongoose.Model<UserDoc>,
      Task: TaskM as mongoose.Model<TaskDoc>,
      Completion: CompletionM as mongoose.Model<CompletionDoc>,
      Progress: ProgressM as mongoose.Model<ProgressDoc>,
      Withdrawal: WithdrawalM as mongoose.Model<WithdrawalDoc>,
      Settings: SettingsM as mongoose.Model<SettingsDoc>,
      Payment: PaymentM as mongoose.Model<PaymentDoc>,
      Post: PostM as mongoose.Model<PostDoc>,
      Reaction: ReactionM as mongoose.Model<ReactionDoc>,
    };
  }

  const db = g.__zxMongo;

  async function ensureSeed() {
    const settingsCount = await db.Settings.countDocuments();
    if (settingsCount === 0) {
      await db.Settings.create({ key: "main", ...DEFAULT_SETTINGS });
    }
    const taskCount = await db.Task.countDocuments();
    if (taskCount === 0) {
      await db.Task.insertMany(defaultTasks());
    } else {
      const react = await db.Task.findOne({ id: REACT_TASK_ID }).lean();
      if (!react) {
        const [reactTask] = defaultTasks().filter((t) => t.id === REACT_TASK_ID);
        if (reactTask) await db.Task.create(reactTask);
      }
    }
  }

  await ensureSeed();

  const store: AtfStore = {
    backend: "mongo",
    async ready() {
      await ensureSeed();
    },
    async getSettings() {
      const doc = await db.Settings.findOne({ key: "main" }).lean();
      return { ...DEFAULT_SETTINGS, ...(stripId(doc as (Settings & { _id?: unknown }) | null)) };
    },
    async updateSettings(patch) {
      const doc = await db.Settings.findOneAndUpdate(
        { key: "main" },
        { $set: patch },
        { returnDocument: "after", upsert: true },
      ).lean();
      return { ...DEFAULT_SETTINGS, ...(stripId(doc as (Settings & { _id?: unknown }) | null)) };
    },
    async getUserByTelegramId(id) {
      const doc = await db.User.findOne({ telegramId: id }).lean();
      return leanUser(doc as UserDoc | null);
    },
    async getUserById(id) {
      const doc = await db.User.findOne({ id }).lean();
      return leanUser(doc as UserDoc | null);
    },
    async createUser(input: CreateUserInput) {
      const existing = await db.User.findOne({ telegramId: input.telegramId }).lean();
      if (existing) return leanUser(existing as UserDoc)!;
      const settings = await store.getSettings();
      const t = new Date().toISOString();
      const user: User = normalizeUser({
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
        updatedAt: t,
      });
      try {
        await db.User.create(user);
      } catch (err) {
        const raced = await db.User.findOne({ telegramId: input.telegramId }).lean();
        if (raced) return leanUser(raced as UserDoc)!;
        throw err;
      }
      if (input.referredBy && input.referredBy !== input.telegramId) {
        await db.User.updateOne(
          { telegramId: input.referredBy },
          {
            $inc: { referralCount: 1 },
            $set: { updatedAt: t },
          },
        );
      }
      return user;
    },
    async saveUser(user) {
      const next = normalizeUser({ ...user, updatedAt: new Date().toISOString() });
      await db.User.updateOne({ id: next.id }, { $set: next }, { upsert: true });
      return next;
    },
    async applyClaim(userId, expectedStartedAt, pending) {
      const t = new Date().toISOString();
      const before = await db.User.findOne({ id: userId, miningStartedAt: expectedStartedAt, isBanned: false }).lean();
      const doc = await db.User.findOneAndUpdate(
        { id: userId, miningStartedAt: expectedStartedAt, isBanned: false },
        {
          $inc: { balance: pending, minedTotal: pending, dailyPnl: pending },
          $set: { lastClaimAt: t, miningStartedAt: t, boostUntil: 0, dailyPnlDate: t.slice(0, 10), updatedAt: t },
          $push: { pnlHistory: { $each: [pending], $slice: -48 } },
        },
        { returnDocument: "after" },
      ).lean();
      const next = leanUser(doc as UserDoc | null);
      if (next && before && (before as UserDoc).referredBy && ((before as UserDoc).minedTotal ?? 0) <= 0.0001) {
        await db.User.updateOne(
          { telegramId: (before as UserDoc).referredBy },
          { $inc: { referralSuccessCount: 1 }, $set: { updatedAt: t } },
        );
      }
      return next;
    },
    async applyDebit(userId, amount) {
      const t = new Date().toISOString();
      const doc = await db.User.findOneAndUpdate(
        { id: userId, isBanned: false, balance: { $gte: amount } },
        { $inc: { balance: -amount }, $set: { updatedAt: t } },
        { returnDocument: "after" },
      ).lean();
      return leanUser(doc as UserDoc | null);
    },
    async creditHolding(userId, amount) {
      const t = new Date().toISOString();
      const doc = await db.User.findOneAndUpdate(
        { id: userId },
        { $inc: { holdingBalance: amount }, $set: { updatedAt: t } },
        { returnDocument: "after" },
      ).lean();
      return leanUser(doc as UserDoc | null);
    },
    async listUsers(opts: ListOpts = {}) {
      const page = opts.page ?? 1;
      const limit = opts.limit ?? 20;
      const filter: Record<string, unknown> = {};
      if (opts.banned === true) filter.isBanned = true;
      if (opts.q) {
        const rx = new RegExp(opts.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [
          { atfId: rx },
          { username: rx },
          { firstName: rx },
          { telegramId: rx },
          { walletAddress: rx },
        ];
      }
      const total = await db.User.countDocuments(filter);
      const items = await db.User.find(filter)
        .sort({ minedTotal: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return { items: (items as UserDoc[]).map((d) => leanUser(d)!), total };
    },
    async iterateUsers(fn) {
      const cursor = db.User.find({ isBanned: { $ne: true } }).lean().cursor();
      let n = 0;
      for await (const doc of cursor) {
        const u = leanUser(doc as UserDoc);
        if (u) {
          await fn(u);
          n += 1;
        }
      }
      return n;
    },
    async topMiners(limit) {
      const items = await db.User.find({ isBanned: false }).sort({ minedTotal: -1 }).limit(limit).lean();
      return (items as UserDoc[]).map((d) => leanUser(d)!);
    },
    async referredFriends(telegramId) {
      const items = await db.User.find({ referredBy: telegramId }).sort({ createdAt: -1 }).lean();
      return (items as UserDoc[]).map((u) => ({
        firstName: u.firstName,
        username: u.username,
        atfId: u.atfId,
        createdAt: u.createdAt,
        isActive: Boolean(u.lastClaimAt) || (u.minedTotal ?? 0) > 0.01,
      })) as ReferredFriend[];
    },
    async listTasks() {
      const items = await db.Task.find().sort({ sortOrder: 1 }).lean();
      return (items as (Task & { _id?: unknown })[]).map((d) => stripId(d)) as Task[];
    },
    async saveTask(task) {
      await db.Task.updateOne({ id: task.id }, { $set: task }, { upsert: true });
      return task;
    },
    async deleteTask(id) {
      if (id === REACT_TASK_ID) return;
      await db.Task.deleteOne({ id });
    },
    async getCompletions(userId) {
      const items = await db.Completion.find({ userId }).lean();
      return (items as (TaskCompletion & { _id?: unknown })[]).map((d) => stripId(d)) as TaskCompletion[];
    },
    async addCompletion(c) {
      try {
        await db.Completion.create(c);
      } catch {
        /* duplicate id */
      }
      return c;
    },
    async getProgress(userId, taskId) {
      const doc = await db.Progress.findOne({ userId, taskId }).lean();
      return stripId(doc as (TaskProgress & { _id?: unknown }) | null) as TaskProgress | null;
    },
    async saveProgress(p) {
      await db.Progress.updateOne({ userId: p.userId, taskId: p.taskId }, { $set: p }, { upsert: true });
      return p;
    },
    async createWithdrawal(w) {
      await db.Withdrawal.create(w);
      return w;
    },
    async listWithdrawals(opts: ListOpts = {}) {
      const page = opts.page ?? 1;
      const limit = opts.limit ?? 20;
      const filter: Record<string, unknown> = {};
      if (opts.status) filter.status = opts.status;
      if (opts.q) {
        const rx = new RegExp(opts.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [{ atfId: rx }, { username: rx }, { walletAddress: rx }, { telegramId: rx }];
      }
      const total = await db.Withdrawal.countDocuments(filter);
      const items = await db.Withdrawal.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return { items: (items as (Withdrawal & { _id?: unknown })[]).map((d) => stripId(d)) as Withdrawal[], total };
    },
    async getWithdrawal(id) {
      const doc = await db.Withdrawal.findOne({ id }).lean();
      return stripId(doc as (Withdrawal & { _id?: unknown }) | null) as Withdrawal | null;
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
      const doc = await db.Payment.findOne({ id }).lean();
      return stripId(doc as (LevelPayment & { _id?: unknown }) | null) as LevelPayment | null;
    },
    async getPaymentByMemo(memo) {
      const doc = await db.Payment.findOne({ memo }).lean();
      return stripId(doc as (LevelPayment & { _id?: unknown }) | null) as LevelPayment | null;
    },
    async savePayment(p) {
      await db.Payment.updateOne({ id: p.id }, { $set: p }, { upsert: true });
      return p;
    },
    async saveChannelPost(p) {
      await db.Post.updateOne({ chatId: p.chatId, messageId: p.messageId }, { $set: p }, { upsert: true });
      return p;
    },
    async latestChannelPost(chatId) {
      const filter = chatId ? { chatId } : {};
      const doc = await db.Post.findOne(filter).sort({ date: -1 }).lean();
      return stripId(doc as (ChannelPost & { _id?: unknown }) | null) as ChannelPost | null;
    },
    async recordReaction(r) {
      await db.Reaction.updateOne(
        { telegramId: r.telegramId, chatId: r.chatId, messageId: r.messageId },
        { $set: r },
        { upsert: true },
      );
      return r;
    },
    async hasReaction(telegramId, chatId, messageId) {
      const n = await db.Reaction.countDocuments({ telegramId, chatId, messageId });
      return n > 0;
    },
    async stats(): Promise<DashboardStats> {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      const [users, activeMiners, mined, pending, paid, tasks, newUsersToday, weekUsers] = await Promise.all([
        db.User.countDocuments(),
        db.User.countDocuments({ miningStartedAt: { $ne: null }, isBanned: false }),
        db.User.aggregate([{ $group: { _id: null, v: { $sum: "$minedTotal" } } }]),
        db.Withdrawal.aggregate([
          { $match: { status: "pending" } },
          { $group: { _id: null, n: { $sum: 1 }, v: { $sum: "$amount" } } },
        ]),
        db.Withdrawal.aggregate([
          { $match: { status: { $in: ["paid", "approved"] } } },
          { $group: { _id: null, v: { $sum: "$netAmount" } } },
        ]),
        db.Task.countDocuments({ isActive: true }),
        db.User.countDocuments({ createdAt: { $gte: startOfDay.toISOString() } }),
        db.User.countDocuments({ createdAt: { $gte: startOfWeek.toISOString() } }),
      ]);
      const balances = await db.User.aggregate([{ $group: { _id: null, v: { $sum: "$balance" } } }]);
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
        weekUsers,
      };
    },
  };

  return store;
}
