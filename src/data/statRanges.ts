export const STAT_RANGES_SERIES = {
  attack: 75,
  defense: 70,
  stamina: 80,
} as const;

export type StatKey = keyof typeof STAT_RANGES_SERIES;
