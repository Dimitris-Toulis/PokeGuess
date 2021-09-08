import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";
import "virtual:windi.css";
import "./all.css";
import Button from "./components/Button.vue";

if (!window.indexedDB) {
	alert("Please update your browser to use PokeGuess");
	throw new Error("Old Browser");
}

const router = createRouter({
	history: createWebHistory(),
	routes,
});

createApp(App).use(router).component("Button", Button).mount("#app");
