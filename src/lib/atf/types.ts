export type TaskType =
  | "telegram"
  | "twitter"
  | "website"
  | "daily"
  | "wallet"
  | "partner"
  | "react"
  | "youtube";

export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid";

export type WelcomeButton = {
  text: string;
  url: string;
};

export type JourneyPoint = {
  level: number;
  atf: number;
};

export type User = {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  atfId: string;
  balance: number;
  holdingBalance: number;
  minedTotal: number;
  referralCount: number;
  referralSuccessCount: number;
  referralClaimedCount: number;
  referralEarnings: number;
  teamBalance: number;
  referredBy: string | null;
  walletAddress: string | null;
  miningStartedAt: string | null;
  lastClaimAt: string | null;
  minerLevel: number;
  peakLevel: number;
  boostUntil: number;
  dailyPnl: number;
  dailyPnlDate: string;
  pnlHistory: number[];
  journey: JourneyPoint[];
  isBanned: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  url: string;
  reward: number;
  isRecurring: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  locked?: boolean;
};

export type TaskCompletion = {
  id: string;
  userId: string;
  taskId: string;
  completedAt: string;
};

export type TaskProgress = {
  id: string;
  userId: string;
  taskId: string;
  status: "processing" | "claimable" | "claimed";
  goAt: string;
  updatedAt: string;
};

export type Withdrawal = {
  id: string;
  userId: string;
  telegramId: string;
  atfId: string;
  username: string;
  amount: number;
  fee: number;
  netAmount: number;
  walletAddress: string;
  status: WithdrawalStatus;
  note: string;
  txHash: string | null;
  createdAt: string;
  processedAt: string | null;
};

export type Settings = {
  projectName: string;
  tokenSymbol: string;
  botUsername: string;
  channelUrl: string;
  groupUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  cycleHours: number;
  minWithdraw: number;
  withdrawFee: number;
  referralReward: number;
  welcomeBonus: number;
  referralBoostPct: number;
  maxReferralBoostPct: number;
  walletBoostPct: number;
  maintenanceMode: boolean;
  minWithdrawLevel: number;
  welcomeText: string;
  welcomeButtons: WelcomeButton[];
  reactChannelUrl: string;
  reactChannelId: string;
  newTaskBroadcastTemplate: string;
  adminTelegramIds: string[];
  communityUrl: string;
};

export type LevelDef = {
  level: number;
  minMined: number;
  ratePerHour: number;
};

export type PublicConfig = {
  projectName: string;
  tokenSymbol: string;
  botUsername: string;
  channelUrl: string;
  groupUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  communityUrl: string;
  cycleHours: number;
  minWithdraw: number;
  withdrawFee: number;
  referralReward: number;
  welcomeBonus: number;
  minWithdrawLevel: number;
  atfUsd: number;
  maxLevel: number;
  ownerTon: string;
  ownerDefi: string;
  demoMode: boolean;
  mongoConfigured: boolean;
  botConfigured: boolean;
  webappUrl: string;
  usdPerHourPerLevel: number;
  speedBase: number;
  speedStep: number;
  requiredUsdCoeff: number;
  tapBoostMs: number;
  tapBoostMult: number;
  tapBoostCooldownMs: number;
  verifyEmail: string;
  verifyTelegram: string;
};

export type DashboardStats = {
  users: number;
  activeMiners: number;
  totalMined: number;
  totalBalance: number;
  pendingWithdrawals: number;
  pendingAmount: number;
  paidAmount: number;
  tasks: number;
  newUsersToday: number;
  todayUsers: number;
  weekUsers: number;
};

export type ReferredFriend = {
  firstName: string;
  username: string;
  atfId: string;
  createdAt: string;
  isActive: boolean;
};

export type SessionUser = User & {
  level: number;
  ratePerHour: number;
  speedThs: number;
  pending: number;
  poolBalance: number;
  assets: number;
  cycleRemainingMs: number;
  cycleComplete: boolean;
  nextLevelAt: number | null;
  nextLevelRate: number | null;
  nextRequiredAtf: number | null;
  nextRequiredUsd: number | null;
  miningStatus: "IDLE" | "READY" | "MINING";
  boosted: boolean;
  leveledUpTo: number | null;
  referralAvailable: number;
};

export type ListOpts = {
  q?: string;
  page?: number;
  limit?: number;
  banned?: boolean;
  status?: WithdrawalStatus;
};

export type CreateUserInput = {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  referredBy?: string | null;
};

export type LevelPayment = {
  id: string;
  userId: string;
  telegramId: string;
  level: number;
  memo: string;
  dest: string;
  amountNano: string;
  amountTon: number;
  amountUsd: number;
  status: "pending" | "confirmed";
  txHash: string | null;
  createdAt: string;
};

export type ChannelPost = {
  chatId: string;
  messageId: number;
  date: number;
};

export type ReactionRecord = {
  telegramId: string;
  chatId: string;
  messageId: number;
  reactedAt: string;
};
