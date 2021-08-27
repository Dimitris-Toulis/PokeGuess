import { set, get, del, createStore } from "idb-keyval";
import { add, compareAsc } from "date-fns";

const CacheVersion = 3;

async function getPokemon(id: number): Promise<Pokemon> {
	const pokemonCache = createStore("pokemon-details-cache", "pokemon-details-cache");
	let cache: { pokemon: Pokemon; version: number; from: Date } | null | undefined = await get(
		id,
		pokemonCache
	);
	if (
		typeof cache == "object" &&
		cache != null &&
		typeof cache.pokemon == "object" &&
		cache.pokemon != null
	) {
		return cache.pokemon;
	}

	const PokemonSpeciesResult: PokeApiPokemonSpeciesResult = await fetch(
		`https://pokeapi.co/api/v2/pokemon-species/${id}`
	).then(res => res.json());
	const defaultFormUrl = (
		PokemonSpeciesResult.varieties.find(val => val.is_default) ??
		PokemonSpeciesResult.varieties[0]
	).pokemon.url;
	const PokemonResult: PokeApiPokemonResult = await fetch(defaultFormUrl).then(res => res.json());
	const genera =
		PokemonSpeciesResult.genera.find(val => val.language.name == "en")?.genus ?? "Unavailable";
	let pokemon = {
		id: PokemonSpeciesResult.id,
		name: UpperCaseFirstLetter(PokemonSpeciesResult.name),
		image: PokemonResult.sprites.other["official-artwork"].front_default,
		genera,
	};

	await set(id, { pokemon, version: CacheVersion, from: Date.now() }, pokemonCache).catch(() =>
		del(`pokemon-${id}`, pokemonCache).catch()
	);
	return pokemon;
}

async function getPokemonCount(): Promise<number> {
	const pokemonOtherCache = createStore("pokemon-other-cache", "pokemon-other-cache");
	let cache:
		| {
				count: number;
				from: Date;
		  }
		| null
		| undefined = await get(`pokemon-count`, pokemonOtherCache);
	if (typeof cache == "object" && cache != null) {
		if (
			[0, -1].includes(
				compareAsc(
					add(cache.from, {
						days: 30,
					}),
					Date.now()
				)
			)
		) {
			return cache.count;
		}
	}

	const result = await fetch("https://pokeapi.co/api/v2/pokemon-species/").then(res =>
		res.json()
	);

	await set(
		"pokemon-count",
		{
			count: result.count,
			from: Date.now(),
		},
		pokemonOtherCache
	).catch(() => del("pokemon-count", pokemonOtherCache).catch());
	return result.count;
}

function UpperCaseFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

interface Pokemon {
	id: number;
	name: string;
	image: string;
	genera: string;
}

interface PokeApiPokemonResult {
	id: number;
	name: string;
	sprites: {
		front_default: string;
		other: {
			"official-artwork": {
				front_default: string;
			};
		};
	};
	types: {
		slot: number;
		type: {
			name: string;
			url: string;
		};
	}[];
}
interface PokeApiPokemonSpeciesResult {
	generation: {
		name: string;
		url: string;
	};
	id: number;
	name: string;
	varieties: {
		is_default: boolean;
		pokemon: {
			name: string;
			url: string;
		};
	}[];
	genera: {
		genus: string;
		language: {
			name: string;
			url: string;
		};
	}[];
}

export { getPokemon, getPokemonCount, Pokemon };
