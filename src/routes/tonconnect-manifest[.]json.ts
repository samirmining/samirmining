import { createFileRoute } from "@tanstack/react-router";
import { webappUrl } from "@/lib/atf/store";

function manifest(origin: string) {
  const base = origin.replace(/\/$/, "");
  return {
    url: base,
    name: "ZX Miner",
    iconUrl: `${base}/zx-coin.png`,
    termsOfUseUrl: "https://t.me/AI_TRADING_FOREX",
    privacyPolicyUrl: "https://t.me/AI_TRADING_FOREX",
  };
}

export const Route = createFileRoute("/tonconnect-manifest.json")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const envUrl = webappUrl();
        const origin = envUrl || new URL(request.url).origin;
        return Response.json(manifest(origin), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": "*",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
