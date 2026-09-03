import { createServerFn } from "@tanstack/react-start";
import { REACT_TASK_ID, VERIFY_EMAIL, VERIFY_TELEGRAM } from "./constants";
import {
  ATF_USD_PRICE,
  getLevelCard,
  LEVEL_FORMULA,
  MAX_LEVEL,
  requiredAtf,
  requiredUsd,
  TAP_BOOST_MS,
  TAP_BOOST_COOLDOWN_MS,
  TASK_PROCESS_MS,
} from "./levels";
import { pendingMined, round4, syncUnlockLevel, toSessionUser } from "./mining";
import { newId, parseStartRef, safeEqual, signPayload, verifyPayload, verifyTelegramInitData } from "./crypto";
import { assertTonAddress, rateLimit, withLock } from "./security";
import {
  adminPassword,
  getStore,
  isBotConfigured,
  isDemoMode,
  isMongoConfigured,
  webappUrl,
} from "./store";
import { findIncomingPayment, ownerDefiAddress, ownerTonAddress, transferDeepLink, usdToNano } from "./ton";
import type {
  PublicConfig,
  SessionUser,
  Settings,
  Task,
  User,
  Withdrawal,
  WithdrawalStatus,
} from "./types";

const SESSION_TTL = 14 * 24 * 3600_000;
const ADMIN_TTL = 7 * 24 * 3600_000;

const captchas = (globalThis as unknown as {
  __zxCaptcha?: Map<string, { answer: number; exp: number; fails: number }>;
}).__zxCaptcha ?? new Map<string, { answer: number; exp: number; fails: number }>();
(globalThis as unknown as { __zxCaptcha: typeof captchas }).__zxCaptcha = captchas;

function requireUserToken(token: string) {
  const payload = verifyPayload<{ sub: string; kind: string }>(token);
  if (!payload || payload.kind !== "user" || !payload.sub) {
    throw new Error("Session expired. Open the mini app again.");
  }
  return payload.sub;
}

function requireAdminToken(token: string) {
  const payload = verifyPayload<{ kind: string }>(token);
  if (!payload || payload.kind !== "admin") {
    throw new Error("Admin session expired.");
  }
}

async function persistUnlock(user: User) {
  const store = await getStore();
  const { user: next, leveledUpTo } = syncUnlockLevel(user);
  if (leveledUpTo && (next.minerLevel !== user.minerLevel || next.peakLevel !== user.peakLevel)) {
    await store.saveUser(next);
  } else if (next.minerLevel !== user.minerLevel) {
    await store.saveUser(next);
  }
  return { user: next, leveledUpTo };
}

async function loadSession(telegramId: string): Promise<SessionUser> {
  const store = await getStore();
  const settings = await store.getSettings();
  const user = await store.getUserByTelegramId(telegramId);
  if (!user) throw new Error("User not found.");
  if (user.isBanned) throw new Error("This account is banned.");
  const synced = await persistUnlock(user);
  return toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo);
}

export const getPublicConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicConfig> => {
    const store = await getStore();
    const s = await store.getSettings();
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
      maxLevel: MAX_LEVEL,
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
      verifyTelegram: VERIFY_TELEGRAM,
    };
  },
);

export const bootstrapUser = createServerFn({ method: "POST" })
  .validator((data: { initData?: string; demo?: boolean; startParam?: string }) => data)
  .handler(async ({ data }) => {
    const store = await getStore();
    const settings = await store.getSettings();
    const botToken = process.env.BOT_TOKEN;
    let telegramId = "";
    let username = "";
    let firstName = "Miner";
    let lastName = "";
    let referredBy: string | null = parseStartRef(data.startParam);

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
    } else {
      throw new Error("Open this mini app from Telegram.");
    }

    rateLimit(`boot:${telegramId}`, 20, 60_000);

    let user = await store.getUserByTelegramId(telegramId);
    if (!user) {
      user = await store.createUser({
        telegramId,
        username,
        firstName,
        lastName,
        referredBy,
      });
    } else {
      user = await store.saveUser({
        ...user,
        username: username || user.username,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      });
    }
    if (user.isBanned) throw new Error("This account is banned.");
    if (!user.miningStartedAt) {
      user = await store.saveUser({ ...user, miningStartedAt: new Date().toISOString() });
    }
    const synced = await persistUnlock(user);
    const token = signPayload({ kind: "user", sub: telegramId }, SESSION_TTL);
    return { token, user: toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo), demo: isDemoMode() };
  });

export const getMe = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    return loadSession(telegramId);
  });

export const getCaptcha = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`cap:${telegramId}`, 12, 60_000);
    const c = { a: 4 + Math.floor(Math.random() * 12), b: 3 + Math.floor(Math.random() * 9) };
    captchas.set(telegramId, { answer: c.a + c.b, exp: Date.now() + 10 * 60_000, fails: 0 });
    return c;
  });

export const startMining = createServerFn({ method: "POST" })
  .validator((data: { token: string; answer?: number }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`start:${telegramId}`, 8, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      if (settings.maintenanceMode) throw new Error("Mining is paused. Try again later.");
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (user.isBanned) throw new Error("This account is banned.");
      if (user.miningStartedAt) {
        return toSessionUser(user, settings);
      }
      const next = await store.saveUser({
        ...user,
        miningStartedAt: new Date().toISOString(),
      });
      return toSessionUser(next, settings);
    });
  });

export const claimMining = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`claim:${telegramId}`, 12, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (user.isBanned) throw new Error("This account is banned.");
      if (!user.miningStartedAt) throw new Error("Nothing to claim yet.");
      const pending = pendingMined(user, settings);
      if (pending <= 0.0001) throw new Error("Nothing to claim yet.");
      const next = await store.applyClaim(user.id, user.miningStartedAt, pending);
      if (!next) throw new Error("Claim already processed.");
      const synced = await persistUnlock(next);
      return { user: toSessionUser(synced.user, settings, Date.now(), synced.leveledUpTo), claimed: pending };
    });
  });

export const tapBoost = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`boost:${telegramId}`, 20, 10_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (!user.miningStartedAt) throw new Error("Start mining first.");
      const now = Date.now();
      const until = user.boostUntil || 0;
      if (until > now) {
        return toSessionUser(user, settings, now);
      }
      if (until > 0 && now < until + TAP_BOOST_COOLDOWN_MS) {
        return toSessionUser(user, settings, now);
      }
      const next = await store.saveUser({
        ...user,
        boostUntil: now + TAP_BOOST_MS,
      });
      return toSessionUser(next, settings, now);
    });
  });

type TaskUi = Task & {
  completed: boolean;
  lastCompletedAt: string | null;
  available: boolean;
  uiState: "go" | "processing" | "claim" | "done";
};

async function mapTasks(user: User): Promise<TaskUi[]> {
  const store = await getStore();
  const settings = await store.getSettings();
  const [tasks, completions] = await Promise.all([store.listTasks(), store.getCompletions(user.id)]);
  const latestPost = await store.latestChannelPost(settings.reactChannelId || undefined);
  const reacted =
    latestPost && settings.reactChannelId
      ? await store.hasReaction(user.telegramId, latestPost.chatId, latestPost.messageId)
      : isDemoMode();

  return Promise.all(
    tasks
      .filter((t) => t.isActive)
      .map(async (task) => {
        const done = completions.filter((c) => c.taskId === task.id);
        const last = done.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
        const cooldown = 24 * 3600_000;
        const available = task.isRecurring
          ? !last || Date.now() - new Date(last.completedAt).getTime() > cooldown
          : done.length === 0;
        const progress = await store.getProgress(user.id, task.id);
        let uiState: TaskUi["uiState"] = "go";
        if (!available) uiState = "done";
        else if (task.type === "react") {
          if (reacted && progress) uiState = "claim";
          else if (progress) uiState = "processing";
          else uiState = "go";
        } else if (progress?.status === "claimed" && !task.isRecurring) uiState = "done";
        else if (progress) {
          const ready = Date.now() - new Date(progress.goAt).getTime() >= TASK_PROCESS_MS;
          uiState = ready ? "claim" : "processing";
        }
        const url = task.id === REACT_TASK_ID ? settings.reactChannelUrl || task.url : task.url;
        return {
          ...task,
          url,
          completed: uiState === "done",
          lastCompletedAt: last?.completedAt ?? null,
          available: uiState !== "done",
          uiState,
        };
      }),
  );
}

export const listActiveTasks = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    const store = await getStore();
    const user = await store.getUserByTelegramId(telegramId);
    if (!user) throw new Error("User not found.");
    return mapTasks(user);
  });

export const openTask = createServerFn({ method: "POST" })
  .validator((data: { token: string; taskId: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`taskgo:${telegramId}`, 30, 60_000);
    const store = await getStore();
    const user = await store.getUserByTelegramId(telegramId);
    if (!user) throw new Error("User not found.");
    const tasks = await store.listTasks();
    const task = tasks.find((t) => t.id === data.taskId);
    if (!task || !task.isActive) throw new Error("Task not found.");
    if (task.type === "wallet" && !user.walletAddress) {
      throw new Error("WALLET_REQUIRED");
    }
    const t = new Date().toISOString();
    await store.saveProgress({
      id: newId("prg"),
      userId: user.id,
      taskId: task.id,
      status: "processing",
      goAt: t,
      updatedAt: t,
    });
    return { ok: true, processMs: TASK_PROCESS_MS };
  });

export const claimTask = createServerFn({ method: "POST" })
  .validator((data: { token: string; taskId: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`task:${telegramId}`, 20, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (user.isBanned) throw new Error("This account is banned.");
      const tasks = await store.listTasks();
      const task = tasks.find((t) => t.id === data.taskId);
      if (!task || !task.isActive) throw new Error("Task not found.");
      if (task.type === "wallet" && !user.walletAddress) {
        throw new Error("Connect a TON wallet first.");
      }
      const completions = await store.getCompletions(user.id);
      const mine = completions.filter((c) => c.taskId === task.id);
      const last = mine.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
      if (!task.isRecurring && mine.length > 0) throw new Error("Already claimed.");
      if (task.isRecurring && last && Date.now() - new Date(last.completedAt).getTime() < 24 * 3600_000) {
        throw new Error("Come back tomorrow.");
      }
      const progress = await store.getProgress(user.id, task.id);
      if (!progress) throw new Error("Open the task first.");
      if (task.type === "react") {
        const post = await store.latestChannelPost(settings.reactChannelId || undefined);
        if (!isDemoMode()) {
          if (!settings.reactChannelId) {
            throw new Error("React channel is not configured.");
          }
          if (!post) throw new Error("No channel post yet. Bot must be admin in the channel.");
          const ok = await store.hasReaction(user.telegramId, post.chatId, post.messageId);
          if (!ok) throw new Error("React to the latest channel post first.");
        }
      } else if (Date.now() - new Date(progress.goAt).getTime() < TASK_PROCESS_MS) {
        throw new Error("Still processing.");
      }
      await store.addCompletion({
        id: newId("cmp"),
        userId: user.id,
        taskId: task.id,
        completedAt: new Date().toISOString(),
      });
      await store.saveProgress({ ...progress, status: "claimed", updatedAt: new Date().toISOString() });
      const next = await store.saveUser({
        ...user,
        balance: round4(user.balance + task.reward),
        minedTotal: round4(user.minedTotal + task.reward),
      });
      return { user: toSessionUser(next, settings), reward: task.reward };
    });
  });

export const completeTask = claimTask;

export const saveWallet = createServerFn({ method: "POST" })
  .validator((data: { token: string; address: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`wallet:${telegramId}`, 8, 60_000);
    const address = assertTonAddress(data.address);
    const store = await getStore();
    const settings = await store.getSettings();
    const user = await store.getUserByTelegramId(telegramId);
    if (!user) throw new Error("User not found.");
    const next = await store.saveUser({ ...user, walletAddress: address });
    return toSessionUser(next, settings);
  });

export const disconnectWallet = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`walletdc:${telegramId}`, 8, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      const next = await store.saveUser({
        ...user,
        walletAddress: null,
      });
      return toSessionUser(next, settings);
    });
  });

export const getLevelQuote = createServerFn({ method: "POST" })
  .validator((data: { token: string; level: number }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    const store = await getStore();
    const user = await store.getUserByTelegramId(telegramId);
    if (!user) throw new Error("User not found.");
    const level = Math.min(MAX_LEVEL, Math.max(1, Math.floor(data.level)));
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
      canBuy: missingUsd > 0.001 && user.minerLevel < level,
    };
  });

export const createLevelInvoice = createServerFn({ method: "POST" })
  .validator((data: { token: string; level: number }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`inv:${telegramId}`, 10, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (!user.walletAddress) throw new Error("Connect a TON wallet first.");
      const level = Math.min(MAX_LEVEL, Math.max(user.minerLevel + 1, Math.floor(data.level)));
      if (level > user.minerLevel + 1) throw new Error("Unlock previous levels first.");
      const needAtf = requiredAtf(level);
      const assets = round4((user.holdingBalance ?? 0) + user.balance);
      if (assets + 1e-9 >= needAtf) {
        const next = await store.saveUser({
          ...user,
          minerLevel: Math.max(user.minerLevel, level),
          peakLevel: Math.max(user.peakLevel, level),
        });
        return {
          unlocked: true,
          user: toSessionUser(next, settings, Date.now(), level),
        };
      }
      const missingUsd = Math.max(0.01, requiredUsd(level) - user.holdingBalance * ATF_USD_PRICE);
      const { ton, nano, usd } = usdToNano(missingUsd);
      const dest = ownerTonAddress();
      const memo = `ZX-L${level}-${user.atfId.slice(-6)}-${newId("m").slice(-6)}`;
      const payment = await store.createPayment({
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
        createdAt: new Date().toISOString(),
      });
      const links = transferDeepLink(dest, nano, memo);
      return {
        unlocked: false,
        payment,
        links,
        dest,
        defiDest: ownerDefiAddress(),
        user: toSessionUser(user, settings),
      };
    });
  });

export const verifyLevelPayment = createServerFn({ method: "POST" })
  .validator((data: { token: string; paymentId: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`payv:${telegramId}`, 12, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      const payment = await store.getPayment(data.paymentId);
      if (!payment || payment.userId !== user.id) throw new Error("Payment not found.");
      if (payment.status === "confirmed") {
        return { user: toSessionUser(user, settings), ok: true };
      }
      let txHash: string | null = null;
      if (isDemoMode()) {
        txHash = "demo";
      } else {
        txHash = await findIncomingPayment({
          dest: payment.dest,
          memo: payment.memo,
          minNano: BigInt(payment.amountNano) * 95n / 100n,
          sinceMs: new Date(payment.createdAt).getTime(),
        });
      }
      if (!txHash) throw new Error("Payment not found yet. Confirm in your wallet, then retry.");
      await store.savePayment({ ...payment, status: "confirmed", txHash });
      const next = await store.saveUser({
        ...user,
        minerLevel: Math.max(user.minerLevel, payment.level),
        peakLevel: Math.max(user.peakLevel, payment.level),
      });
      return { user: toSessionUser(next, settings, Date.now(), payment.level), ok: true };
    });
  });

export const requestWithdraw = createServerFn({ method: "POST" })
  .validator((data: { token: string; amount: number }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    rateLimit(`wd:${telegramId}`, 5, 60_000);
    return withLock(`u:${telegramId}`, async () => {
      const store = await getStore();
      const settings = await store.getSettings();
      const user = await store.getUserByTelegramId(telegramId);
      if (!user) throw new Error("User not found.");
      if (user.isBanned) throw new Error("This account is banned.");
      if (!user.walletAddress) throw new Error("Connect a TON wallet first.");
      const amount = round4(Number(data.amount));
      if (!Number.isFinite(amount) || amount < settings.minWithdraw) {
        throw new Error(`Minimum withdrawal is ${settings.minWithdraw} ${settings.tokenSymbol}.`);
      }
      if (amount <= settings.withdrawFee) throw new Error("Amount is too small after fee.");
      const session = toSessionUser(user, settings);
      if (session.level < settings.minWithdrawLevel) {
        throw new Error(`Reach level ${settings.minWithdrawLevel} to withdraw.`);
      }
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
        createdAt: new Date().toISOString(),
        processedAt: null,
      });
      return { user: toSessionUser(next, settings), withdrawal: w };
    });
  });

export const myWithdrawals = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    const store = await getStore();
    const { items } = await store.listWithdrawals({ page: 1, limit: 50, q: telegramId });
    return items.filter((w) => w.telegramId === telegramId);
  });

export const getFriends = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const telegramId = requireUserToken(data.token);
    const store = await getStore();
    const settings = await store.getSettings();
    const friends = await store.referredFriends(telegramId);
    const bot = settings.botUsername.replace(/^@/, "");
    return {
      friends,
      inviteLink: `https://t.me/${bot}?start=ref${telegramId}`,
      reward: settings.referralReward,
    };
  });

export const getLeaderboard = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    requireUserToken(data.token);
    const store = await getStore();
    const top = await store.topMiners(20);
    return top.map((u, i) => ({
      rank: i + 1,
      atfId: u.atfId,
      firstName: u.firstName,
      minedTotal: u.minedTotal,
      referralCount: u.referralCount,
      level: u.minerLevel || 1,
    }));
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    rateLimit("admin-login", 8, 5 * 60_000);
    const expected = adminPassword();
    if (!expected || !safeEqual(data.password, expected)) {
      throw new Error("Wrong password.");
    }
    const token = signPayload({ kind: "admin" }, ADMIN_TTL);
    return { token };
  });

export const adminOverview = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    const [stats, settings, recentUsers, pending] = await Promise.all([
      store.stats(),
      store.getSettings(),
      store.listUsers({ page: 1, limit: 8 }),
      store.listWithdrawals({ page: 1, limit: 8, status: "pending" }),
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
      demoPassword: isDemoMode() ? adminPassword() : null,
    };
  });

export const adminListUsers = createServerFn({ method: "POST" })
  .validator((data: { token: string; q?: string; page?: number }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    return store.listUsers({ q: data.q, page: data.page ?? 1, limit: 20 });
  });

export const adminPatchUser = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      userId: string;
      balance?: number;
      holdingBalance?: number;
      banned?: boolean;
      verified?: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    const user = await store.getUserById(data.userId);
    if (!user) throw new Error("User not found.");
    const next: User = {
      ...user,
      balance: data.balance !== undefined ? round4(data.balance) : user.balance,
      holdingBalance: data.holdingBalance !== undefined ? round4(data.holdingBalance) : user.holdingBalance,
      isBanned: data.banned ?? user.isBanned,
      isVerified: data.verified ?? user.isVerified,
    };
    return store.saveUser(next);
  });

export const adminListWithdrawals = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; status?: WithdrawalStatus; q?: string; page?: number }) => data,
  )
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    return store.listWithdrawals({
      status: data.status,
      q: data.q,
      page: data.page ?? 1,
      limit: 20,
    });
  });

export const adminProcessWithdrawal = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; id: string; status: WithdrawalStatus; note?: string }) => data,
  )
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    const w = await store.getWithdrawal(data.id);
    if (!w) throw new Error("Withdrawal not found.");
    if (w.status !== "pending") throw new Error("Already processed.");
    if (data.status === "rejected") {
      const user = await store.getUserById(w.userId);
      if (user) {
        await store.saveUser({ ...user, balance: round4(user.balance + w.amount) });
      }
    }
    const next: Withdrawal = {
      ...w,
      status: data.status,
      note: data.note ?? w.note,
      processedAt: new Date().toISOString(),
    };
    const saved = await store.saveWithdrawal(next);
    try {
      const { notifyUser } = await import("./bot");
      const msg =
        data.status === "rejected"
          ? `Withdrawal of ${w.amount} ZX was rejected. Balance restored.`
          : `Withdrawal of ${w.netAmount} ZX was ${data.status}.`;
      await notifyUser(w.telegramId, msg);
    } catch {
      /* bot optional */
    }
    return saved;
  });

export const adminListTasks = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    return store.listTasks();
  });

export const adminSaveTask = createServerFn({ method: "POST" })
  .validator((data: { token: string; task: Task; broadcast?: boolean }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    const existing = (await store.listTasks()).find((t) => t.id && t.id === data.task.id);
    const isNew = !existing && !data.task.id;
    const task: Task = {
      ...data.task,
      id: data.task.id || newId("task"),
      createdAt: data.task.createdAt || new Date().toISOString(),
    };
    const saved = await store.saveTask(task);
    if (isNew || data.broadcast) {
      try {
        const { broadcastNewTask } = await import("./bot");
        await broadcastNewTask(saved);
      } catch {
        /* bot optional */
      }
    }
    return saved;
  });

export const adminDeleteTask = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    if (data.id === REACT_TASK_ID) throw new Error("React Latest Post cannot be deleted.");
    const store = await getStore();
    await store.deleteTask(data.id);
    return { ok: true };
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .validator((data: { token: string; settings: Partial<Settings> }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const store = await getStore();
    return store.updateSettings(data.settings);
  });

export const adminBroadcast = createServerFn({ method: "POST" })
  .validator((data: { token: string; text: string }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    if (!data.text.trim()) throw new Error("Message is empty.");
    const { broadcastMessage } = await import("./bot");
    return broadcastMessage(data.text.trim());
  });

export const adminSyncWebhook = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    requireAdminToken(data.token);
    const { ensureTelegramWebhook } = await import("./bot");
    return ensureTelegramWebhook();
  });
