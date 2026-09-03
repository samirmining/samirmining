import { DEFAULT_SETTINGS, DEMO_TELEGRAM_ID, DEMO_WALLET, defaultTasks, REACT_TASK_ID } from "./constants";
import { atfIdFromTelegram, newId } from "./crypto";
import { defaultJourney, normalizeUser, round4 } from "./mining";
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
  WithdrawalStatus,
} from "./types";

export type AtfStore = {
  backend: "memory" | "mongo";
  ready(): Promise<void>;
  getSettings(): Promise<Settings>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;
  getUserByTelegramId(id: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(input: CreateUserInput): Promise<User>;
  saveUser(user: User): Promise<User>;
  applyClaim(userId: string, expectedStartedAt: string, pending: number): Promise<User | null>;
  applyDebit(userId: string, amount: number): Promise<User | null>;
  creditHolding(userId: string, amount: number): Promise<User | null>;
  listUsers(opts?: ListOpts): Promise<{ items: User[]; total: number }>;
  iterateUsers(fn: (u: User) => Promise<void>): Promise<number>;
  topMiners(limit: number): Promise<User[]>;
  referredFriends(telegramId: string): Promise<ReferredFriend[]>;
  listTasks(): Promise<Task[]>;
  saveTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getCompletions(userId: string): Promise<TaskCompletion[]>;
  addCompletion(c: TaskCompletion): Promise<TaskCompletion>;
  getProgress(userId: string, taskId: string): Promise<TaskProgress | null>;
  saveProgress(p: TaskProgress): Promise<TaskProgress>;
  createWithdrawal(w: Withdrawal): Promise<Withdrawal>;
  listWithdrawals(opts?: ListOpts): Promise<{ items: Withdrawal[]; total: number }>;
  getWithdrawal(id: string): Promise<Withdrawal | null>;
  saveWithdrawal(w: Withdrawal): Promise<Withdrawal>;
  createPayment(p: LevelPayment): Promise<LevelPayment>;
  getPayment(id: string): Promise<LevelPayment | null>;
  getPaymentByMemo(memo: string): Promise<LevelPayment | null>;
  savePayment(p: LevelPayment): Promise<LevelPayment>;
  saveChannelPost(p: ChannelPost): Promise<ChannelPost>;
  latestChannelPost(chatId?: string): Promise<ChannelPost | null>;
  recordReaction(r: ReactionRecord): Promise<ReactionRecord>;
  hasReaction(telegramId: string, chatId: string, messageId: number): Promise<boolean>;
  stats(): Promise<DashboardStats>;
};

type MemoryState = {
  settings: Settings;
  users: Map<string, User>;
  usersByTg: Map<string, string>;
  tasks: Map<string, Task>;
  completions: TaskCompletion[];
  progress: Map<string, TaskProgress>;
  withdrawals: Map<string, Withdrawal>;
  payments: Map<string, LevelPayment>;
  posts: ChannelPost[];
  reactions: ReactionRecord[];
};

const g = globalThis as unknown as { __zxMemory?: MemoryState };

function nowIso() {
  return new Date().toISOString();
}

function blankUserFields(): Pick<
  User,
  | "minerLevel"
  | "peakLevel"
  | "boostUntil"
  | "dailyPnl"
  | "dailyPnlDate"
  | "pnlHistory"
  | "journey"
  | "referralSuccessCount"
  | "referralClaimedCount"
  | "teamBalance"
> {
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
    teamBalance: 0,
  };
}

function seedUser(
  telegramId: string,
  firstName: string,
  extra: Partial<User> = {},
): User {
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
    miningStartedAt: extra.miningStartedAt ?? new Date(Date.now() - 35_000).toISOString(),
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
    updatedAt: t,
  });
}

const FRIEND_NAMES: Array<[string, string]> = [
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
  ["Jamal", "jamal"],
];

function seedState(): MemoryState {
  const settings = { ...DEFAULT_SETTINGS };
  const users = new Map<string, User>();
  const usersByTg = new Map<string, string>();
  const add = (u: User) => {
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
    pnlHistory: [0.6, 0.9, 1.2, 1.1, 1.8, 2.4, 3.1, 2.2, 3.6, 4.1, 3.4, 4.8],
    miningStartedAt: new Date(Date.now() - 16_000).toISOString(),
    lastClaimAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  });
  add(demo);

  FRIEND_NAMES.forEach(([name, uname], i) => {
    add(
      seedUser(`8${String(20000 + i)}`, name, {
        username: uname,
        referredBy: demo.telegramId,
        balance: 0,
        holdingBalance: 0,
        minedTotal: 0,
        minerLevel: 1,
        peakLevel: 1,
        miningStartedAt: null,
        lastClaimAt: null,
        createdAt: new Date(Date.now() - (11 - i) * 86400_000).toISOString(),
      }),
    );
  });

  const names: Array<[string, string, Partial<User>]> = [
    ["20001", "Amina", { balance: 920, minedTotal: 3100, referralCount: 6, username: "amina_k", minerLevel: 12, peakLevel: 12 }],
    ["20002", "Chidi", { balance: 540, minedTotal: 1800, referralCount: 2, username: "chidi", minerLevel: 8, peakLevel: 8 }],
    ["20003", "Sofia", { balance: 2100, holdingBalance: 400, minedTotal: 8800, referralCount: 11, username: "sofia_m", minerLevel: 28, peakLevel: 28 }],
    ["20004", "Ibrahim", { balance: 80, minedTotal: 420, referralCount: 0, username: "ibrahim" }],
    ["20005", "Maya", { balance: 1560, minedTotal: 5400, referralCount: 8, username: "maya", minerLevel: 18, peakLevel: 18 }],
  ];
  for (const [id, name, extra] of names) {
    add(
      seedUser(id, name, {
        ...extra,
        createdAt: new Date(Date.now() - Math.random() * 12 * 86400_000).toISOString(),
      }),
    );
  }

  const tasks = new Map<string, Task>();
  for (const task of defaultTasks()) tasks.set(task.id, task);

  const withdrawals = new Map<string, Withdrawal>();
  const w1: Withdrawal = {
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
    processedAt: "2026-08-30T04:10:46.000Z",
  };
  withdrawals.set(w1.id, w1);

  return {
    settings,
    users,
    usersByTg,
    tasks,
    completions: [],
    progress: new Map(),
    withdrawals,
    payments: new Map(),
    posts: [],
    reactions: [],
  };
}

function state(): MemoryState {
  if (!g.__zxMemory) g.__zxMemory = seedState();
  return g.__zxMemory;
}

function matchesQ(user: User, q?: string) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    user.atfId.toLowerCase().includes(s) ||
    user.username.toLowerCase().includes(s) ||
    user.firstName.toLowerCase().includes(s) ||
    user.telegramId.includes(s) ||
    (user.walletAddress ?? "").toLowerCase().includes(s)
  );
}

function isFriendActive(u: User) {
  return Boolean(u.lastClaimAt) || u.minedTotal > 0.01;
}

export const memoryStore: AtfStore = {
  backend: "memory",
  async ready() {},
  async getSettings() {
    return { ...DEFAULT_SETTINGS, ...state().settings };
  },
  async updateSettings(patch) {
    const s = state();
    s.settings = { ...DEFAULT_SETTINGS, ...s.settings, ...patch };
    return { ...s.settings };
  },
  async getUserByTelegramId(id) {
    const s = state();
    const uid = s.usersByTg.get(id);
    return uid ? normalizeUser(s.users.get(uid)!) : null;
  },
  async getUserById(id) {
    const u = state().users.get(id);
    return u ? normalizeUser(u) : null;
  },
  async createUser(input) {
    const s = state();
    const existing = s.usersByTg.get(input.telegramId);
    if (existing) return normalizeUser(s.users.get(existing)!);
    const t = nowIso();
    const user: User = normalizeUser({
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
      updatedAt: t,
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
    const next = normalizeUser({ ...user, updatedAt: nowIso() });
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
    const next: User = normalizeUser({
      ...u,
      balance: round4(u.balance + pending),
      minedTotal: round4(u.minedTotal + pending),
      dailyPnl: nextPnl,
      dailyPnlDate: t.slice(0, 10),
      pnlHistory: [...(u.pnlHistory ?? []), nextPnl].slice(-48),
      lastClaimAt: t,
      miningStartedAt: t,
      boostUntil: 0,
      updatedAt: t,
    });
    s.users.set(next.id, next);
    if (next.referredBy) {
      const refId = s.usersByTg.get(next.referredBy);
      const ref = refId ? s.users.get(refId) : null;
      if (ref && next.minedTotal - pending <= 0.0001) {
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
    const next: User = normalizeUser({
      ...u,
      balance: round4(u.balance - amount),
      updatedAt: nowIso(),
    });
    s.users.set(next.id, next);
    return { ...next };
  },
  async creditHolding(userId, amount) {
    const s = state();
    const u = s.users.get(userId);
    if (!u) return null;
    const next: User = normalizeUser({
      ...u,
      holdingBalance: round4((u.holdingBalance ?? 0) + amount),
      updatedAt: nowIso(),
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
    return { items: items.slice(start, start + limit).map((u) => normalizeUser(u)), total };
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
    return [...state().users.values()]
      .filter((u) => !u.isBanned)
      .sort((a, b) => b.minedTotal - a.minedTotal)
      .slice(0, limit)
      .map((u) => normalizeUser(u));
  },
  async referredFriends(telegramId) {
    return [...state().users.values()]
      .filter((u) => u.referredBy === telegramId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((u) => ({
        firstName: u.firstName,
        username: u.username,
        atfId: u.atfId,
        createdAt: u.createdAt,
        isActive: isFriendActive(u),
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
    if (id === REACT_TASK_ID) return;
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
      items = items.filter(
        (w) =>
          w.atfId.toLowerCase().includes(s) ||
          w.username.toLowerCase().includes(s) ||
          w.telegramId.includes(s) ||
          w.walletAddress.toLowerCase().includes(s),
      );
    }
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit).map((w) => ({ ...w })), total };
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
    const items = chatId ? s.posts.filter((p) => p.chatId === chatId) : s.posts;
    return items[0] ?? null;
  },
  async recordReaction(r) {
    state().reactions.push(r);
    return r;
  },
  async hasReaction(telegramId, chatId, messageId) {
    return state().reactions.some(
      (r) => r.telegramId === telegramId && r.chatId === chatId && r.messageId === messageId,
    );
  },
  async stats() {
    const s = state();
    const users = [...s.users.values()];
    const withdrawals = [...s.withdrawals.values()];
    const startOfDay = new Date();
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
      paidAmount: withdrawals
        .filter((w) => w.status === "paid" || w.status === "approved")
        .reduce((a, w) => a + w.netAmount, 0),
      tasks: [...s.tasks.values()].filter((t) => t.isActive).length,
      newUsersToday,
      todayUsers: newUsersToday,
      weekUsers: users.filter((u) => new Date(u.createdAt) >= startOfWeek).length,
    };
  },
};

let cached: AtfStore | null = null;
let mongoTried = false;

export async function getStore(): Promise<AtfStore> {
  if (cached) return cached;
  const uri = process.env.MONGODB_URI;
  if (uri && !mongoTried) {
    mongoTried = true;
    try {
      const { createMongoStore } = await import("./mongo");
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

export function resetStoreCache() {
  cached = null;
  mongoTried = false;
}

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export function isBotConfigured() {
  return Boolean(process.env.BOT_TOKEN);
}

export function isDemoMode() {
  return !process.env.BOT_TOKEN || !process.env.MONGODB_URI;
}

export function webappUrl() {
  return (process.env.WEBAPP_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "");
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || (isDemoMode() ? "atf-admin" : "");
}

export type { WithdrawalStatus };
