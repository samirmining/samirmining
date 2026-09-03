import type { LevelDef, Settings, Task } from "./types";
import { ATF_USD_PRICE, getLevelCard, MAX_LEVEL } from "./levels";

export { ATF_USD_PRICE, MAX_LEVEL };

export const OWNER_TON_FALLBACK = "UQCzzBp_io5zdMiOCMykYY7HzUFkhRqST-xMWvr_DzSScooi";

export const VERIFY_EMAIL = "Ai_trading_forex@outlook.com";
export const VERIFY_TELEGRAM = "ATF_Verification";

export const DEFAULT_WELCOME_TEXT = [
  "👋 Welcome to ZX Miner!",
  "⛏ Mine ZX tokens directly to your Pool Wallet.",
  "⚡ Tap to boost mining speed!",
  "🔗 Connect your TON wallet.",
  "💰 Hold ZX to upgrade your miner level!",
  "Click below to start.",
].join("\n");

export const DEFAULT_TASK_BROADCAST =
  "🎉 New task unlocked: {title}\nReward: {reward} ZX\n{description}\n\nOpen the Mini App → Tasks to claim.";

/** First 10 levels kept for any leftover callers. Full 1–680 is generated. */
export const LEVELS: LevelDef[] = Array.from({ length: 10 }, (_, i) => {
  const card = getLevelCard(i + 1);
  return { level: card.level, minMined: card.requiredAtf, ratePerHour: card.ratePerHour };
});

export const DEFAULT_SETTINGS: Settings = {
  projectName: "ZX Miner",
  tokenSymbol: "ZX",
  botUsername: "ATF_AIRDROP_bot",
  channelUrl: "https://t.me/AI_TRADING_FOREX",
  groupUrl: "https://t.me/AI_TRADING_FOREX",
  twitterUrl: "https://x.com/ai_trading_frx",
  websiteUrl: "https://www.atftoken.com",
  cycleHours: 8760,
  minWithdraw: 500,
  withdrawFee: 70,
  referralReward: 100,
  welcomeBonus: 25,
  referralBoostPct: 0.03,
  maxReferralBoostPct: 0.5,
  walletBoostPct: 0.1,
  maintenanceMode: false,
  minWithdrawLevel: 1,
  welcomeText: DEFAULT_WELCOME_TEXT,
  welcomeButtons: [
    { text: "🚀 Start ZX Mining", url: "webapp" },
    { text: "🌐 Community", url: "https://t.me/AI_TRADING_FOREX" },
  ],
  reactChannelUrl: "https://t.me/AI_TRADING_FOREX",
  reactChannelId: "",
  newTaskBroadcastTemplate: DEFAULT_TASK_BROADCAST,
  adminTelegramIds: [],
  communityUrl: "https://t.me/AI_TRADING_FOREX",
};

export const DEMO_ADMIN_PASSWORD = "atf-admin";
export const DEMO_TELEGRAM_ID = "7657544184";
export const DEMO_WALLET = "UQAV7nK8pQ2wX9cL4mR1sT6yH3bF0eD5aZ8uC2vxxxxxHXkg";

export const TON_ADDRESS_RE = /^(EQ|UQ)[A-Za-z0-9_-]{46}$/;

export const REACT_TASK_ID = "task-react-latest";

export function defaultTasks(now = new Date().toISOString()): Task[] {
  return [
    {
      id: "task-youtube",
      title: "YouTube Like & Comment (Videos + Shorts)",
      description: "Like and comment on official ZX YouTube videos and Shorts.",
      type: "youtube",
      url: "https://www.youtube.com/@AITradingForex",
      reward: 3,
      isRecurring: false,
      isActive: true,
      sortOrder: 0,
      createdAt: now,
    },
    {
      id: "task-x",
      title: "X (Twitter) Retweet",
      description: "Retweet the latest ZX post on X.",
      type: "twitter",
      url: DEFAULT_SETTINGS.twitterUrl,
      reward: 3,
      isRecurring: false,
      isActive: true,
      sortOrder: 1,
      createdAt: now,
    },
    {
      id: "task-web",
      title: "Visit Website (atftoken.com)",
      description: "Open the official project site.",
      type: "website",
      url: DEFAULT_SETTINGS.websiteUrl,
      reward: 3,
      isRecurring: false,
      isActive: true,
      sortOrder: 2,
      createdAt: now,
    },
    {
      id: REACT_TASK_ID,
      title: "React to latest post (English)",
      description: "Open the channel and react to the latest English post, then claim.",
      type: "react",
      url: DEFAULT_SETTINGS.reactChannelUrl,
      reward: 3,
      isRecurring: true,
      isActive: true,
      sortOrder: 3,
      createdAt: now,
      locked: true,
    },
  ];
}
