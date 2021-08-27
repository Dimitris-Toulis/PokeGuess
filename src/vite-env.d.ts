/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-pwa/client" />
import Vue from "vue";
declare module "vue" {
	export type PluginFunction<T> = (app: Vue.App, ...options: any[]) => any;
}
