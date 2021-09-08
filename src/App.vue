<template>
	<suspense>
		<template #default>
			<router-view></router-view>
		</template>
		<template #fallback>
			<p>Loading...</p>
		</template>
	</suspense>
	<div
		class="
			bg-blue-gray-700
			h-35
			m-5
			text-center
			p-3
			right-0
			bottom-0
			shadow-2xl
			text-2xl
			w-75
			fixed
		"
		v-if="showSWpromt"
	>
		<p>Reload to Update</p>
		<div class="flex flex-row mt-4 justify-around">
			<Button class="button-md" @click="updateSW()">Reload</Button
			><Button class="button-md" @click="hideSWpromt()">Dismiss</Button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { registerSW } from "virtual:pwa-register";
import { useRouter } from "vue-router";
const router = useRouter();
let SWRefresh = ref(true);
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
}
#app {
	display: flex;
	flex-direction: column;
	@apply bg-blue-gray-800;
}
p,
h1,
label,
input {
	@apply text-light-500;
}
</style>
