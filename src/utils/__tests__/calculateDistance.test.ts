import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../calculateDistance';

describe('calculateDistance', () => {
  it('should return 0 for identical stats', () => {
    const stats = { attack: 0.5, defense: 0.3, stamina: 0.2 };
    expect(calculateDistance(stats, stats)).toBe(0);
  });

  it('should calculate correct distance', () => {
    const a = { attack: 1, defense: 0, stamina: 0 };
    const b = { attack: 0, defense: 1, stamina: 0 };
    expect(calculateDistance(a, b)).toBeCloseTo(Math.sqrt(2), 5);
  });

  it('should be symmetric', () => {
    const a = { attack: 0.6, defense: 0.3, stamina: 0.1 };
    const b = { attack: 0.2, defense: 0.5, stamina: 0.3 };
    expect(calculateDistance(a, b)).toBeCloseTo(calculateDistance(b, a), 5);
  });
});
