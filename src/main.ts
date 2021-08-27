import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import "primevue/resources/primevue.css";
import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import "virtual:windi.css";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "./all.css";

if (!window.indexedDB) {
	alert("Please update your browser to use PokeGuess");
	throw new Error("Old Browser");
}

const router = createRouter({
	history: createWebHistory(),
	routes,
});

createApp(App)
	.use(router)
	.use(PrimeVue)
	.use(ToastService)
	.component("Toast", Toast)
	.component("Button", Button)
	.mount("#app");
