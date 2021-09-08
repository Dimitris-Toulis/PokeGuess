<template>
	<main class="bg-blue-gray-700 shadow-lg p-5 shadow-gray-400 shadow-gray-600 rrounded-md">
		<div class="flex mb-3 place-content-center">
			<img
				alt="Pokemon shadow"
				:src="pokemon.image"
				@dragstart.prevent
				:class="{ 'shadow-only': !hints[1] }"
			/>
		</div>
		<p :class="{ hidden: !hints[0] }">Description: {{ pokemon.genera }}</p>
		<p :class="{ hidden: !hints[2] }">First Letter: {{ pokemon.name.slice(0, 1) }}</p>
		<input
			type="text"
			class="
				rounded-md
				bg-gray-600
				mt-3
				text-lg
				mb-3
				w-full
				p-2
				text-light-600
				focus:(outline-none
				ring ring-gray-300 ring-2)
				"
			v-model="name"
			@keyup="InputKeyPress"
		/>

		<div class="grid gap-3 md:grid-cols-2">
			<Button @click.once="submit">Submit</Button>
			<Button class="border-none bg-orange-400 button-help !hover:bg-orange-600" @click="hint"
				>Hint</Button
			>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { getPokemon } from "../PokeApi";
import { distance } from "fastest-levenshtein";
import { reactive, ref } from "vue";
const props = defineProps({
	pokemon: {
		required: true,
		type: Number,
	},
});
let blockSubmit = false;
function InputKeyPress(e: KeyboardEvent) {
	if (blockSubmit) return;
	if (e.code == "Enter") {
		blockSubmit = true;
		submit();
	}
}
const emit = defineEmits(["submit"]);
const pokemon = await getPokemon(props.pokemon);
let hints: boolean[] = reactive([false, false, false]);
let hintsAmount: number = 0;
let name = ref("");
function hint() {
	const next = hints.findIndex(val => val == false);
	if (next != -1) {
		hints[next] = true;
		hintsAmount++;
	}
}
function normalizeName(str: string) {
	return str
		.trim()
		.normalize()
		.toLowerCase()
		.replace(/[^0-9a-z]/gi, "");
}
function submit() {
	let difference = distance(normalizeName(pokemon.name), normalizeName(name.value));
	emit("submit", difference, { name: pokemon.name, id: pokemon.id }, hintsAmount);
}
</script>
<style scoped>
.shadow-only {
	filter: contrast(0%) brightness(150%);
}
img {
	width: max(33vw, 300px);
	max-width: 100%;
}
p {
	font-size: clamp(1.25rem, -0.875rem + 8.333vw, 2rem);
}
.hidden {
	visibility: hidden;
}
</style>
