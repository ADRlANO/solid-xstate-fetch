import { pokemon } from './mock-data';

const DEFAULT_MAX_DELAY = 3000;

export function fetchPokemon() {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(pokemon);
    }, DEFAULT_MAX_DELAY)
  })
};
