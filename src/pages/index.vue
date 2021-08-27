<template>
	<div class="text-center pt-5">
		<h1 class="text-7xl">PokeGuess</h1>
	</div>
	<div class="flex flex-col flex-1 place-items-center place-content-center">
		<div class="center">
			<Button class="p-button-2xl"><router-link to="/game">Start</router-link></Button
			><br />
			<Button class="p-button-xl mt-10" v-if="!pokedexEnabled" @click="enablePokedex"
				>Enable PokeGuess Pokedex</Button
			>
			<Button class="p-button-xl mt-10" v-if="pokedexEnabled"
				><router-link to="/pokedex">PokeGuess Pokedex</router-link></Button
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getPokemonCount } from "../PokeApi";
import { createStore, set, get } from "idb-keyval";
const settingsStore = createStore("game", "game-settings");
let pokedexEnabled = ref(await get("pokedex", settingsStore));
await getPokemonCount();
async function enablePokedex() {
	if (navigator.storage?.persist) {
		if (await navigator.storage.persist()) {
		} else {
			alert(
				"Your browser did not allow access persistent storage. PokeGuess Pokedex data may be deleted if storage is low"
			);
		}
	} else {
		alert(
			"Your browser does not support persistent storage for PokeGuess Pokedex data. PokeGuess Pokedex data may be deleted if storage is low"
		);
	}
	await set("pokedex", true, settingsStore);
	pokedexEnabled.value = true;
}
</script>

<style scoped>
.center {
	text-align: center;
}
h1 {
	font-size: clamp(3rem, -0.875rem + 8.333vw, 5rem);
	margin-bottom: 32px;
}
</style>
