import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import WindiCSS from "vite-plugin-windicss";
import { minifyHtml } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import Autoprefixer from "autoprefixer";

export default defineConfig({
	plugins: [
		Vue(),
		Pages(),
		WindiCSS(),
		minifyHtml(),
		VitePWA({
			strategies: "injectManifest",
			filename: "sw.js",
			injectRegister: "auto",
			injectManifest: {
				dontCacheBustURLsMatching: /assets\/.*/,
			},
			manifest: {
				background_color: "#20262e",
				description: "Guess the Pokemon!",
				name: "PokeGuess",
				short_name: "PokeGuess",
				theme_color: "#8dd0ff",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/maskable_icon_x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
	server: {
		fs: {
			allow: ["."],
			strict: true,
		},
	},
	css: {
		postcss: {
			plugins: [Autoprefixer()],
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: id => {
					if (id.includes("node_modules/vue")) return "vendor/vue";
					if (id.includes("node_modules/primevue")) return "vendor/primevue";
					if (id.includes("node_modules/date-fns")) return "vendor/date-fns";
				},
			},
		},
		terserOptions: {
			compress: {
				passes: 3,
			},
		},
	},
	define: {
		__VUE_OPTIONS_API__: false,
	},
});
