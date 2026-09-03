# ZX Miner — Telegram Mini App

Complete `@ATF_AIRDROP_bot` stack: miner mini app, admin console, Telegram bot webhook, MongoDB.

**Host this only on Render.** Use MongoDB Atlas. Do not deploy it anywhere else.

## What you get

- Telegram Mini App at `/app` — mine, tap-boost, tasks, miner store (lvls 1–680), friends, TON wallet, withdrawals
- Admin console at `/admin` — users, payouts, tasks, settings, broadcast, webhook
- Bot webhook at `/api/telegram/webhook` — `/start` welcome, `/balance`, `/ref`, `/help`, owner/admin commands
- MongoDB when `MONGODB_URI` is set; in-memory demo data otherwise

## Render

1. Push this project to a Git repo.
2. [Render Dashboard](https://dashboard.render.com) → New Web Service → that repo.
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add the env vars from `.env.example`.
6. `WEBAPP_URL` must be your public `https://….onrender.com` URL (no trailing slash).
7. BotFather → `/newapp` → Mini App URL `https://YOUR.onrender.com/app`.
8. Open `/admin` → Render setup → Set Telegram webhook.

`render.yaml` is a Blueprint for the same service.

## MongoDB Atlas

1. Create a free cluster.
2. Database Access → user with read/write.
3. Network Access → `0.0.0.0/0` (Render egress IPs vary).
4. Connect → Drivers → copy `MONGODB_URI`.

## BotFather

```
/newbot
/setmenubutton  → Open ZX Miner  →  https://YOUR.onrender.com/app
/newapp         → ZX Miner → https://YOUR.onrender.com/app
```

Start payload for referrals: `https://t.me/ATF_AIRDROP_bot?start=ref{telegramId}`

For **React Latest Post**, add the bot as **admin** in the channel so it can see the latest post and user reactions.

## Env extras

| Var | Purpose |
|---|---|
| `OWNER_TELEGRAM_ID` | Owner (can add/remove admins) |
| `ADMIN_TELEGRAM_IDS` | Extra admins (comma-separated) |
| `OWNER_TON_ADDRESS` | TON destination for buy-level (default is set) |
| `OWNER_DEFI_ADDRESS` | Optional USDT/DeFi destination |
| `TON_USD` | Used to pre-fill buy-level TON amount |
| `TONCENTER_API_KEY` | Optional, verifies on-chain TON payments |

## Admin bot commands (owner + admins)

`/help` shows this list only to owner/admin, plus the count of users who started the bot.

- `/announcement` — text, optional button name + URL
- `/announcepic` — image, then text, optional button
- `/listtasks` `/addtask` `/edittask` `/deletetask`
- `/setreactchannel` — React Latest Post channel
- `/setwelcome` `/addwelcomebutton` `/renamewelcomebutton` `/clearwelcomebuttons` `/listwelcomebuttons`
- `/totalusers` — all-time / this week / today
- `/setchannel` `/setgroup` `/setnewtaskmsg`
- Owner only: `/addadmin` `/removeadmin` `/listadmins` `/sendzx` (`/sendatf` `/send_atf` `/credit` aliases)
- `/cancel` — abort a flow

New tasks are broadcast to everyone who `/start`ed the bot (and optionally posted to the channel).

## Admin console

- Local / demo password: `atf-admin`
- Production: set `ADMIN_PASSWORD` on Render

Withdrawals stay pending until you mark them Paid in the console. Paying does not send on-chain tokens automatically — send ZX from your treasury, then mark Paid.

Never collect seed phrases. Only TON public addresses (`EQ` / `UQ`).
