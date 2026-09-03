import { createFileRoute } from "@tanstack/react-router";
import { getStore, isBotConfigured, isMongoConfigured, webappUrl } from "@/lib/atf/store";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const store = await getStore();
        if (isBotConfigured() && webappUrl()) {
          try {
            const { ensureTelegramWebhook } = await import("@/lib/atf/bot");
            await ensureTelegramWebhook();
          } catch (err) {
            console.warn("[zx] webhook sync skipped", err);
          }
        }
        return Response.json({
          ok: true,
          backend: store.backend,
          mongo: isMongoConfigured(),
          bot: isBotConfigured(),
        });
      },
    },
  },
});
