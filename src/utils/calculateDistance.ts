import type { Stats } from '../types';

export function calculateDistance(a: Stats, b: Stats): number {
  return Math.sqrt(
    Math.pow(a.attack - b.attack, 2) +
    Math.pow(a.defense - b.defense, 2) +
    Math.pow(a.stamina - b.stamina, 2)
  );
}
