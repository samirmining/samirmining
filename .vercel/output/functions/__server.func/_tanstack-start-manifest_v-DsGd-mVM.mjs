//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-DsGd-mVM.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/admin",
			"/app",
			"/tonconnect-manifest.json",
			"/api/health",
			"/api/telegram/webhook"
		],
		preloads: ["/assets/index-CDuzJaa9.js", "/assets/rolldown-runtime-Dd_uD5pT.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-CDuzJaa9.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: ["/assets/routes-DPk4_FAY.js", "/assets/mini-app-B9qzH4nh.js"]
	},
	"/admin": {
		filePath: "/workspace/src/routes/admin.tsx",
		children: void 0,
		preloads: ["/assets/admin-CEqoKQ4S.js", "/assets/input-CmkQ68cL.js"]
	},
	"/app": {
		filePath: "/workspace/src/routes/app.tsx",
		children: void 0,
		preloads: ["/assets/app-DPk4_FAY.js", "/assets/mini-app-B9qzH4nh.js"]
	}
} });
//#endregion
export { tsrStartManifest };
