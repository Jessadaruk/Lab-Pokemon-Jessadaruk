export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonStat {
  base_stat: number;
  stat: NamedAPIResource;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonType[];
  stats: PokemonStat[];
  species: NamedAPIResource;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
      home?: {
        front_default: string | null;
      };
    };
  };
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedAPIResource;
  }>;
  genera: Array<{
    genus: string;
    language: NamedAPIResource;
  }>;
}

interface EvolutionChainLink {
  species: NamedAPIResource;
  evolves_to: EvolutionChainLink[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

export interface EvolutionPokemon {
  name: string;
  url: string;
  id: number | null;
}

export interface PokemonDetailBundle {
  pokemon: PokemonDetail;
  species: PokemonSpecies;
  evolutionStages: EvolutionPokemon[][];
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getIdFromUrl(url: string): number | null {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

export function getPokemonSpriteById(id: number | null): string {
  if (!id) {
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtwork(pokemon: PokemonDetail): string {
  return (
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    getPokemonSpriteById(pokemon.id)
  );
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatStatName(name: string): string {
  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  return statNames[name] ?? formatPokemonName(name);
}

export function getEnglishFlavorText(species: PokemonSpecies): string {
  const entry = species.flavor_text_entries.find(
    (item) => item.language.name === "en",
  );

  return entry?.flavor_text.replace(/\f/g, " ").replace(/\s+/g, " ").trim() ?? "";
}

export function getEnglishGenus(species: PokemonSpecies): string {
  return species.genera.find((item) => item.language.name === "en")?.genus ?? "";
}

function parseEvolutionChain(chain: EvolutionChainLink): EvolutionPokemon[][] {
  const stages: EvolutionPokemon[][] = [];

  function walk(link: EvolutionChainLink, depth: number) {
    if (!stages[depth]) {
      stages[depth] = [];
    }

    stages[depth].push({
      name: link.species.name,
      url: link.species.url,
      id: getIdFromUrl(link.species.url),
    });

    link.evolves_to.forEach((nextLink) => walk(nextLink, depth + 1));
  }

  walk(chain, 0);
  return stages;
}

export async function fetchPokemonPage(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PokemonListResponse> {
  const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  return fetchJson<PokemonListResponse>(url, signal);
}

export async function fetchPokemonDetailBundle(
  pokemonName: string,
  signal?: AbortSignal,
): Promise<PokemonDetailBundle> {
  const pokemon = await fetchJson<PokemonDetail>(
    `${POKEAPI_BASE_URL}/pokemon/${encodeURIComponent(pokemonName)}`,
    signal,
  );
  const species = await fetchJson<PokemonSpecies>(pokemon.species.url, signal);
  const evolutionChain = await fetchJson<EvolutionChainResponse>(
    species.evolution_chain.url,
    signal,
  );

  return {
    pokemon,
    species,
    evolutionStages: parseEvolutionChain(evolutionChain.chain),
  };
}
