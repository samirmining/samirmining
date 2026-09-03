import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Ban,
  Check,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Radio,
  Settings as SettingsIcon,
  Users,
  Wallet,
} from "lucide-react";
import {
  adminBroadcast,
  adminDeleteTask,
  adminListTasks,
  adminListUsers,
  adminListWithdrawals,
  adminLogin,
  adminOverview,
  adminPatchUser,
  adminProcessWithdrawal,
  adminSaveSettings,
  adminSaveTask,
  adminSyncWebhook,
} from "@/lib/atf/actions";
import type { DashboardStats, Settings, Task, User, Withdrawal } from "@/lib/atf/types";
import { formatAtf, formatCompact, shortWallet, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_KEY = "atf_admin";
type Tab = "overview" | "users" | "payouts" | "tasks" | "settings" | "setup";

export function AdminApp() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof adminOverview>> | null>(null);
  const [users, setUsers] = useState<{ items: User[]; total: number }>({ items: [], total: 0 });
  const [userQ, setUserQ] = useState("");
  const [payouts, setPayouts] = useState<{ items: Withdrawal[]; total: number }>({ items: [], total: 0 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [broadcast, setBroadcast] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [taskDraft, setTaskDraft] = useState<Partial<Task>>({
    title: "",
    description: "",
    type: "telegram",
    url: "",
    reward: 20,
    isRecurring: false,
    isActive: true,
    sortOrder: 10,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY);
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
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

  async function onLogin(e: React.FormEvent) {
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
    const res = await adminListUsers({ data: { token, q: userQ, page: 1 } });
    setUsers(res);
  }

  async function loadPayouts() {
    const res = await adminListWithdrawals({ data: { token, page: 1 } });
    setPayouts(res);
  }

  async function loadTasks() {
    setTasks(await adminListTasks({ data: { token } }));
  }

  useEffect(() => {
    if (!token) return;
    if (tab === "users") void loadUsers();
    if (tab === "payouts") void loadPayouts();
    if (tab === "tasks") void loadTasks();
  }, [tab, token]);

  if (!token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-5">
        <Card className="w-full max-w-sm p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">ZX Control</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Demo password is <span className="font-mono text-fg">atf-admin</span>. Change it with
            ADMIN_PASSWORD on Render.
          </p>
          <form className="mt-5 grid gap-3" onSubmit={onLogin}>
            <div className="grid gap-1.5">
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              Enter console
            </Button>
          </form>
          <Link to="/" className="mt-4 block text-center text-sm text-muted hover:text-fg">
            Back to terminal
          </Link>
        </Card>
      </div>
    );
  }

  const stats: DashboardStats | undefined = overview?.stats;

  return (
    <div className="min-h-dvh bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-border md:min-h-dvh md:w-56 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-4 md:block">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">ZX</p>
              <p className="font-display text-lg font-semibold">Control</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="md:mt-6"
              onClick={() => {
                setToken("");
                sessionStorage.removeItem(ADMIN_KEY);
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3">
            {(
              [
                ["overview", LayoutDashboard, "Overview"],
                ["users", Users, "Users"],
                ["payouts", Wallet, "Payouts"],
                ["tasks", ListTodo, "Tasks"],
                ["settings", SettingsIcon, "Settings"],
                ["setup", Radio, "Render setup"],
              ] as const
            ).map(([id, Icon, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm ${
                  tab === id ? "bg-elevated text-fg" : "text-muted hover:text-fg"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 px-4 py-5 md:px-8">
          {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}

          {tab === "overview" && stats ? (
            <div className="space-y-5">
              <header>
                <h1 className="font-display text-2xl font-semibold">Overview</h1>
                <p className="text-sm text-muted">
                  Store: {overview?.backend}
                  {overview?.demoMode ? " · demo data until MongoDB is connected" : ""}
                </p>
              </header>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["Miners", formatCompact(stats.users)],
                  ["Active cycles", formatCompact(stats.activeMiners)],
                  ["Mined ZX", formatCompact(Math.round(stats.totalMined))],
                  ["Pending payouts", String(stats.pendingWithdrawals)],
                ].map(([k, v]) => (
                  <Card key={k} className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{k}</p>
                    <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{v}</p>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="p-4">
                  <h2 className="font-medium">Latest miners</h2>
                  <ul className="mt-3 space-y-2">
                    {overview?.recentUsers.map((u) => (
                      <li key={u.id} className="flex items-center justify-between text-sm">
                        <span>
                          {u.firstName}{" "}
                          <span className="font-mono text-xs text-muted">{u.atfId}</span>
                        </span>
                        <span className="tabular-nums">{formatAtf(u.minedTotal, 0)}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4">
                  <h2 className="font-medium">Payout queue</h2>
                  <ul className="mt-3 space-y-2">
                    {(overview?.pending ?? []).length === 0 ? (
                      <li className="text-sm text-muted">Queue is clear.</li>
                    ) : (
                      overview?.pending.map((w) => (
                        <li key={w.id} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-xs">{w.atfId}</span>
                          <span className="tabular-nums">{formatAtf(w.netAmount)} ZX</span>
                        </li>
                      ))
                    )}
                  </ul>
                </Card>
              </div>
            </div>
          ) : null}

          {tab === "users" ? (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-semibold">Users</h1>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void loadUsers();
                }}
              >
                <Input
                  placeholder="Search ZX ID, username, wallet"
                  value={userQ}
                  onChange={(e) => setUserQ(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-elevated text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">Miner</th>
                      <th className="px-3 py-2 font-medium">Balance</th>
                      <th className="px-3 py-2 font-medium">Mined</th>
                      <th className="px-3 py-2 font-medium">Refs</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.items.map((u) => (
                      <tr key={u.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          <p>{u.firstName}</p>
                          <p className="font-mono text-[11px] text-muted">{u.atfId}</p>
                        </td>
                        <td className="px-3 py-2 tabular-nums">{formatAtf(u.balance)}</td>
                        <td className="px-3 py-2 tabular-nums">{formatAtf(u.minedTotal, 0)}</td>
                        <td className="px-3 py-2 tabular-nums">{u.referralCount}</td>
                        <td className="px-3 py-2">
                          {u.isBanned ? <Badge tone="danger">Banned</Badge> : <Badge tone="ok">Live</Badge>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                const raw = window.prompt("Set balance", String(u.balance));
                                if (raw == null) return;
                                await adminPatchUser({
                                  data: { token, userId: u.id, balance: Number(raw) },
                                });
                                await loadUsers();
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                await adminPatchUser({
                                  data: { token, userId: u.id, banned: !u.isBanned },
                                });
                                await loadUsers();
                              }}
                            >
                              <Ban className="size-3.5" />
                              {u.isBanned ? "Unban" : "Ban"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted">{users.total} miners</p>
            </div>
          ) : null}

          {tab === "payouts" ? (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-semibold">Payouts</h1>
              <div className="space-y-2">
                {payouts.items.map((w) => (
                  <Card key={w.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium tabular-nums">
                        {formatAtf(w.amount)} → {formatAtf(w.netAmount)} ZX
                      </p>
                      <p className="font-mono text-xs text-muted">
                        {w.atfId} · {shortWallet(w.walletAddress)} · {timeAgo(w.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        tone={
                          w.status === "pending"
                            ? "warn"
                            : w.status === "rejected"
                              ? "danger"
                              : "ok"
                        }
                      >
                        {w.status}
                      </Badge>
                      {w.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={async () => {
                              await adminProcessWithdrawal({
                                data: { token, id: w.id, status: "paid" },
                              });
                              await loadPayouts();
                              await loadOverview();
                            }}
                          >
                            <Check className="size-3.5" /> Pay
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await adminProcessWithdrawal({
                                data: { token, id: w.id, status: "rejected" },
                              });
                              await loadPayouts();
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "tasks" ? (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-semibold">Tasks</h1>
              <Card className="grid gap-3 p-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>Title</Label>
                  <Input
                    value={taskDraft.title ?? ""}
                    onChange={(e) => setTaskDraft({ ...taskDraft, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Reward</Label>
                  <Input
                    type="number"
                    value={taskDraft.reward ?? 0}
                    onChange={(e) => setTaskDraft({ ...taskDraft, reward: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-1.5 md:col-span-2">
                  <Label>URL</Label>
                  <Input
                    value={taskDraft.url ?? ""}
                    onChange={(e) => setTaskDraft({ ...taskDraft, url: e.target.value })}
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (!taskDraft.title) return;
                    await adminSaveTask({
                      data: {
                        token,
                        task: {
                          id: "",
                          title: taskDraft.title,
                          description: taskDraft.description || taskDraft.title,
                          type: (taskDraft.type as Task["type"]) || "partner",
                          url: taskDraft.url || "",
                          reward: Number(taskDraft.reward) || 0,
                          isRecurring: Boolean(taskDraft.isRecurring),
                          isActive: true,
                          sortOrder: Number(taskDraft.sortOrder) || 10,
                          createdAt: new Date().toISOString(),
                        },
                      },
                    });
                    setTaskDraft({ ...taskDraft, title: "", url: "" });
                    await loadTasks();
                  }}
                >
                  Add task
                </Button>
              </Card>
              {tasks.map((t) => (
                <Card key={t.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted">
                      +{t.reward} ZX · {t.type}
                      {t.isRecurring ? " · daily" : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await adminDeleteTask({ data: { token, id: t.id } });
                      await loadTasks();
                    }}
                  >
                    Remove
                  </Button>
                </Card>
              ))}
            </div>
          ) : null}

          {tab === "settings" && settings ? (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-semibold">Settings</h1>
              <Card className="grid gap-3 p-4 md:grid-cols-2">
                {(
                  [
                    ["botUsername", "Bot username"],
                    ["channelUrl", "Channel URL"],
                    ["groupUrl", "Group URL"],
                    ["twitterUrl", "X URL"],
                    ["websiteUrl", "Website"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="grid gap-1.5">
                    <Label>{label}</Label>
                    <Input
                      value={String(settings[key])}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    />
                  </div>
                ))}
                {(
                  [
                    ["minWithdraw", "Min withdraw"],
                    ["withdrawFee", "Withdraw fee"],
                    ["referralReward", "Referral reward"],
                    ["welcomeBonus", "Welcome bonus"],
                    ["cycleHours", "Cycle hours"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="grid gap-1.5">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      value={Number(settings[key])}
                      onChange={(e) => setSettings({ ...settings, [key]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </Card>
              <Button
                onClick={async () => {
                  await adminSaveSettings({ data: { token, settings } });
                  await loadOverview();
                }}
              >
                Save settings
              </Button>
              <Card className="p-4">
                <h2 className="font-medium">Broadcast</h2>
                <Textarea
                  className="mt-2"
                  value={broadcast}
                  onChange={(e) => setBroadcast(e.target.value)}
                  placeholder="Message to all miners"
                />
                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={async () => {
                    const res = await adminBroadcast({ data: { token, text: broadcast } });
                    setBroadcast("");
                    setError(
                      res.skipped
                        ? "Bot token missing — broadcast skipped."
                        : `Sent ${res.sent}, failed ${res.failed}.`,
                    );
                  }}
                >
                  Send
                </Button>
              </Card>
            </div>
          ) : null}

          {tab === "setup" ? (
            <SetupPanel
              overview={overview}
              onSync={async () => {
                const res = await adminSyncWebhook({ data: { token } });
                setError(res.ok ? `Webhook set: ${res.url}` : res.reason || "Webhook failed");
              }}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}

function SetupPanel({
  overview,
  onSync,
}: {
  overview: Awaited<ReturnType<typeof adminOverview>> | null;
  onSync: () => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Render setup</h1>
      <p className="max-w-2xl text-sm text-muted">
        Host only on Render. Use MongoDB Atlas for data. Do not deploy this bot on any other
        platform.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-4">
          <p className="font-mono text-[10px] uppercase text-muted">MongoDB</p>
          <p className="mt-1 font-medium">{overview?.mongoConfigured ? "URI present" : "Not set"}</p>
        </Card>
        <Card className="p-4">
          <p className="font-mono text-[10px] uppercase text-muted">Bot token</p>
          <p className="mt-1 font-medium">{overview?.botConfigured ? "Present" : "Not set"}</p>
        </Card>
        <Card className="p-4">
          <p className="font-mono text-[10px] uppercase text-muted">Web app URL</p>
          <p className="mt-1 truncate font-medium">{overview?.webappUrl || "Not set"}</p>
        </Card>
      </div>
      <Card className="space-y-3 p-5 text-sm leading-relaxed">
        <ol className="list-decimal space-y-3 pl-5 text-muted">
          <li>
            In BotFather, create or reuse <span className="font-mono text-fg">@ATF_AIRDROP_bot</span>.
            Copy the token.
          </li>
          <li>
            Create a free MongoDB Atlas cluster. Database user + Network Access <span className="font-mono text-fg">0.0.0.0/0</span>.
            Copy the connection string.
          </li>
          <li>
            On Render, New Web Service from this repo. Build:{" "}
            <span className="font-mono text-fg">npm install && npm run build</span>. Start:{" "}
            <span className="font-mono text-fg">npm start</span>.
          </li>
          <li>
            Set env vars: <span className="font-mono text-fg">MONGODB_URI</span>,{" "}
            <span className="font-mono text-fg">BOT_TOKEN</span>,{" "}
            <span className="font-mono text-fg">ADMIN_PASSWORD</span>,{" "}
            <span className="font-mono text-fg">WEBAPP_URL</span> (your https://….onrender.com),{" "}
            <span className="font-mono text-fg">NITRO_PRESET=render_com</span>,{" "}
            <span className="font-mono text-fg">NODE_VERSION=22</span>.
          </li>
          <li>
            BotFather → /newapp → Mini App URL{" "}
            <span className="font-mono text-fg">https://YOUR.onrender.com/app</span>.
          </li>
        </ol>
        <Button onClick={() => void onSync()}>
          <ArrowUpRight className="size-4" />
          Set Telegram webhook
        </Button>
      </Card>
    </div>
  );
}
