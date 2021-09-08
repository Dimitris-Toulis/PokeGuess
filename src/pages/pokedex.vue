<template>
	<div
		ref="sidebar"
		v-show="pokemonDetailsVisible"
		class="bg-gray-800 p-10 pr-12 top-0 right-0 bottom-0 fixed sidebar"
	>
		<div>
			<h1 class="text-5xl">{{ currentPokemon.name }}</h1>
			<br />
			<p class="text-2xl">First Correct Guess: {{ currentPokemon.ago }} ago</p>
		</div>
	</div>
	<div class="text-center pt-5" :class="{ grid: !persisted }">
		<h1 class="text-7xl inline-block">Your PokeGuess Pokedex</h1>
		<div class="mt-5 md:mt-0" v-if="!persisted">
			<Button class="button-md" @click="enablePersistentStorage"
				>Enable Persistent Storage</Button
			>
		</div>
	</div>
	<p class="bg-gray-700 m-2 p-5 top-0 right-0 text-4xl fixed sm:top-auto sm:bottom-0">
		{{ pokedex.length }}/{{ pokemonAmount }}
	</p>
	<div class="m-10 pokedex" v-if="pokedex.length > 0">
		<div
			v-for="pokemon in pokedex"
			class="flex flex-col text-center text-2xl place-content-between pokemon"
			@click="e => showDetails(pokemon, e)"
		>
			<div class="flex place-content-center">
				<img :src="pokemon.image" @dragstart.prevent />
			</div>
			<p>{{ pokemon.name }}</p>
		</div>
	</div>
	<div
		v-if="pokedex.length <= 0"
		class="flex flex-1 text-center place-content-center place-items-center"
	>
		<h1 class="text-4xl">No Pokemon Guessed</h1>
	</div>
</template>

<script lang="ts" setup>
import { createStore, entries } from "idb-keyval";
import { getPokemon, getPokemonCount, Pokemon } from "../PokeApi";
import { Ref, ref } from "vue";
import { formatDistanceToNow } from "date-fns";
let persisted = ref(navigator.storage?.persisted ? await navigator.storage.persisted() : false);

interface PokedexEntry extends Pokemon {
	ago: string;
}
const pokemonAmount = await getPokemonCount();
const PokedexIDs: [number, Date][] = await entries(createStore("pokedex", "pokedex"));
let pokedex: PokedexEntry[] = [];
pokedex = await Promise.all(
	PokedexIDs.map(async val => {
		return { ...(await getPokemon(val[0])), ago: formatDistanceToNow(val[1]) };
	})
);
let pokemonDetailsVisible = ref(false);
let currentPokemon: Ref<PokedexEntry> = ref(pokedex[0]);
let sidebar: Ref<null | HTMLElement> = ref(null);
function handleClick(e: Event) {
	if (!sidebar.value?.contains(e.target as HTMLElement)) {
		pokemonDetailsVisible.value = false;
	}
}
document.addEventListener("click", handleClick);
function showDetails(pokemon: PokedexEntry, e: Event) {
	e.stopImmediatePropagation();
	currentPokemon.value = pokemon;
	pokemonDetailsVisible.value = true;
}
async function enablePersistentStorage() {
	if (await navigator.storage.persist()) {
		persisted.value = true;
	} else {
		alert("Your browser did not allow access persistent storage");
	}
}
console.log(pokedex);
</script>

<style scoped>
.pokedex {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
.pokemon {
	border: 2px solid grey;
	border-radius: 15%;
	padding: 1.5rem;
}
@screen md {
	.grid {
		grid-template-columns: 5fr 1fr;
	}
}
.sidebar {
	box-shadow: rgba(0, 0, 0, 0.4) 1px 0px 0px 99999px;
}
</style>
