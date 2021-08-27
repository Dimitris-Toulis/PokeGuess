import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import WindiCSS from "vite-plugin-windicss";
import { minifyHtml } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import PurgeCSS from "@fullhuman/postcss-purgecss";
import { Plugin } from "postcss";
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
			plugins: [
				PurgeCSS({
					content: [
						"./src/**/*.vue",
						"./node_modules/primevue/{sidebar,button,toast,inputtext,card}/*.{vue,js}",
					],
					extractors: [
						{
							extractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
							extensions: ["vue", "js"],
						},
					],
				}) as unknown as Plugin,
				Autoprefixer(),
			],
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
	},
});
