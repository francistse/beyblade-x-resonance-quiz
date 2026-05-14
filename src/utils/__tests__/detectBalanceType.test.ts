import { describe, it, expect } from 'vitest';
import { detectBalanceType } from '../detectBalanceType';

describe('detectBalanceType', () => {
  it('should detect balanced stats', () => {
    const balanced = { attack: 0.33, defense: 0.34, stamina: 0.33 };
    expect(detectBalanceType(balanced)).toBe(true);
  });

  it('should detect unbalanced stats', () => {
    const unbalanced = { attack: 0.8, defense: 0.1, stamina: 0.1 };
    expect(detectBalanceType(unbalanced)).toBe(false);
  });

  it('should use custom threshold', () => {
    const stats = { attack: 0.4, defense: 0.35, stamina: 0.25 };
    expect(detectBalanceType(stats, 0.1)).toBe(true);
    expect(detectBalanceType(stats, 0.05)).toBe(false);
  });
});
