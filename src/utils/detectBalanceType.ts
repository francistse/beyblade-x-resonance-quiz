import type { Stats } from '../types';

export function detectBalanceType(stats: Stats, threshold = 0.1): boolean {
  const mean = (stats.attack + stats.defense + stats.stamina) / 3;
  const variance = (
    Math.pow(stats.attack - mean, 2) +
    Math.pow(stats.defense - mean, 2) +
    Math.pow(stats.stamina - mean, 2)
  ) / 3;
  const stdDev = Math.sqrt(variance);
  return stdDev < threshold;
}
