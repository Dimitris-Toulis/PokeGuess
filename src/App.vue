<template>
	<Toast />

	<suspense>
		<template #default>
			<router-view></router-view>
		</template>
		<template #fallback>
			<p>Loading...</p>
		</template>
	</suspense>
	<div
		class="h-35 m-5 text-center p-3 right-0 bottom-0 shadow-2xl text-2xl w-75 SWupdate fixed"
		v-if="showSWpromt"
	>
		<p>Reload to Update</p>
		<div class="flex flex-row mt-2 justify-around">
			<Button class="p-button-md" @click="updateSW()">Reload</Button
			><Button class="p-button-md" @click="hideSWpromt()">Dismiss</Button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { registerSW } from "virtual:pwa-register";
import { useRouter } from "vue-router";
const router = useRouter();
let SWRefresh = ref(false);
let showSWpromt = computed(() =>
	SWRefresh.value ? router.currentRoute.value.name == "index" : false
);

let hideSWpromt = () => (SWRefresh.value = false);
const updateSW = registerSW({
	onNeedRefresh() {
		SWRefresh.value = true;
	},
});

onMounted(() => {
	let prevClientHeight: number;
	function handleResize() {
		let clientHeight = document.documentElement.clientHeight;
		if (clientHeight === prevClientHeight) return;
		requestAnimationFrame(() => {
			document.documentElement.style.setProperty("--vh", clientHeight * 0.01 + "px");
			prevClientHeight = clientHeight;
		});
	}
	handleResize();
	window.addEventListener("resize", handleResize);
});
</script>

<style>
body,
#app {
	padding: 0px;
	margin: 0px;
	min-height: inherit;
}
html {
	min-height: calc(100 * var(--vh));
	background-color: var(--surface-b);
}
#app {
	display: flex;
	flex-direction: column;
}
p,
h1,
label {
	color: var(--text-color);
}
</style>
<style scoped>
.SWupdate {
	background-color: var(--surface-d);
}
</style>
