<template>
	<Toast :severity="toast.severity" :visible="toast.visible"
		><p class="text-xl">{{ toast.message }}</p></Toast
	>
	<div v-if="gameOver" class="flex top-0 right-0 bottom-0 left-0 fixed">
		<div class="flex flex-col flex-1 place-items-center place-content-evenly">
			<main class="flex flex-col place-content-evenly">
				<p class="text-5xl">Correct Rate: {{ rate }}%</p>
				<p class="mt-4 text-5xl">Points: {{ points }}</p>
			</main>
			<Button class="button-xl"><router-link to="/" replace>Home</router-link></Button>
		</div>
	</div>

	<teleport to="head">
		<link v-if="nextImage" rel="preload" as="image" :href="nextImage" />
	</teleport>
	<div v-if="!gameOver" class="flex flex-1 place-items-center place-content-center">
		<div class="m-3 top-0 left-0 fixed">
			<h1 class="text-4xl">Wrong: {{ wrong }}</h1>
			<h1 class="text-4xl">Total: {{ total }}</h1>
			<h1 class="text-4xl">Points: {{ points }}</h1>
		</div>
		<suspense>
			<template #default>
				<Pokemon
					v-if="pokemon != null"
					:key="pokemon"
					:pokemon="pokemon"
					@submit="submitted"
				/>
			</template>
			<template #fallback>
				<p>Loading...</p>
			</template>
		</suspense>
	</div>
</template>

<script lang="ts" setup>
import Pokemon from "../components/Pokemon.vue";
import Toast from "../components/Toast.vue";
import { getPokemonCount, getPokemon } from "../PokeApi";
import { reactive, Ref, ref } from "vue";
import { createStore, update } from "idb-keyval";
let pokemon: Ref<number | null> = ref(null);
let wrong = ref(0);
let total = ref(0);
let points = ref(0);
let gameOver = ref(false);
let rate = ref(0);
const PokemonCount = await getPokemonCount();
const PokedexStore = createStore("pokedex", "pokedex");
let next = Math.floor(Math.random() * PokemonCount + 1);
let nextImage = ref("");
let toast = reactive({
	visible: false,
	message: "",
	severity: "",
});
function pick() {
	pokemon.value = next;
	next = Math.floor(Math.random() * PokemonCount + 1);
	getPokemon(next).then(({ image }) => {
		nextImage.value = image;
	});
}
pick();
async function submitted(
	difference: number,
	correct: { name: string; id: number },
	hintsAmount: number
) {
	total.value++;
	if (difference <= Math.min(3, Math.ceil(correct.name.length / 3))) {
		toast.message =
			difference == 0 ? "Correct!" : `Almost Correct!\nThe correct name is ${correct.name}`;
		toast.severity = "correct";
		toast.visible = true;
		setTimeout(() => (toast.visible = false), 3000);
		points.value += (10 - hintsAmount) * 100;
		update(
			correct.id,
			old => {
				if (old == null || old == undefined) {
					return Date.now();
				} else {
					return old;
				}
			},
			PokedexStore
		);
	} else {
		toast.message = `Wrong!\nThe correct name is ${correct.name}`;
		toast.severity = "wrong";
		toast.visible = true;
		setTimeout(() => (toast.visible = false), 3000);
		wrong.value++;
		if (wrong.value >= 10) {
			rate.value =
				Math.round((100 - (wrong.value / total.value) * 100 + Number.EPSILON) * 100) / 100;
			gameOver.value = true;
		}
	}
	pick();
}
</script>
