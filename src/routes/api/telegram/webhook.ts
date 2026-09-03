import { createFileRoute } from "@tanstack/react-router";
import { handleTelegramUpdate } from "@/lib/atf/bot";

export const Route = createFileRoute("/api/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
        if (secret) {
          const header = request.headers.get("x-telegram-bot-api-secret-token");
          if (header !== secret) {
            return new Response("forbidden", { status: 403 });
          }
        }
        const update = (await request.json()) as Parameters<typeof handleTelegramUpdate>[0];
        try {
          await handleTelegramUpdate(update);
        } catch (err) {
          console.error("[atf] telegram update failed", err);
        }
        return Response.json({ ok: true });
      },
    },
  },
});
