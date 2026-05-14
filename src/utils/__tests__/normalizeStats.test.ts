import { describe, it, expect } from 'vitest';
import { normalizeStats } from '../normalizeStats';

describe('normalizeStats', () => {
  it('should normalize stats to sum of 1', () => {
    const result = normalizeStats({ attack: 30, defense: 30, stamina: 30 });
    expect(result.attack + result.defense + result.stamina).toBeCloseTo(1, 5);
  });

  it('should handle zero stats', () => {
    const result = normalizeStats({ attack: 0, defense: 0, stamina: 0 });
    expect(result.attack).toBeCloseTo(0.33, 2);
    expect(result.defense).toBeCloseTo(0.33, 2);
    expect(result.stamina).toBeCloseTo(0.33, 2);
  });

  it('should preserve proportions', () => {
    const result = normalizeStats({ attack: 60, defense: 30, stamina: 10 });
    expect(result.attack).toBeCloseTo(0.6, 5);
    expect(result.defense).toBeCloseTo(0.3, 5);
    expect(result.stamina).toBeCloseTo(0.1, 5);
  });
});
