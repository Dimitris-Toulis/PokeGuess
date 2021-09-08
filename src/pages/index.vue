<template>
	<div class="text-center pt-5">
		<h1 class="text-7xl">PokeGuess</h1>
	</div>
	<div class="flex flex-col flex-1 place-items-center place-content-center">
		<div class="center">
			<Button class="button-2xl"><router-link to="/game">Start Game</router-link></Button>
			<br />
			<Button class="mt-10 button-xl">
				<router-link to="/pokedex">PokeGuess Pokedex</router-link>
			</Button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getPokemonCount } from "../PokeApi";
await getPokemonCount();
</script>

<style scoped>
.center {
	text-align: center;
}
h1 {
	--minFontSize: 64px;
	--maxFontSize: 180px;
	--scaler: 10vw;
	font-size: clamp(var(--minFontSize), var(--scaler), var(--maxFontSize));

	margin-bottom: 32px;
}
</style>
