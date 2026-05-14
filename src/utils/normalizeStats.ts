import type { Stats } from '../types';

export function normalizeStats(stats: Stats): Stats {
  const total = stats.attack + stats.defense + stats.stamina;
  if (total === 0) {
    return { attack: 0.33, defense: 0.33, stamina: 0.33 };
  }
  return {
    attack: stats.attack / total,
    defense: stats.defense / total,
    stamina: stats.stamina / total,
  };
}
