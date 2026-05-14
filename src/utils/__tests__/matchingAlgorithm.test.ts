import { describe, it, expect } from 'vitest';
import { findTopMatches, determineUserType } from '../matchingAlgorithm';
import type { BeybladeData } from '../../types';

const mockBeyblades: BeybladeData[] = [
  {
    id: 'TEST-01',
    en_name: 'ATTACKER',
    type: 'attack',
    tags: ['test'],
    stats: { attack: 70, defense: 20, stamina: 10 },
    rotation: 'right',
    image: '/test.png',
    name: { 'en-US': 'ATTACKER' },
    description: { 'en-US': 'Test' },
  },
  {
    id: 'TEST-02',
    en_name: 'DEFENDER',
    type: 'defense',
    tags: ['test'],
    stats: { attack: 20, defense: 70, stamina: 10 },
    rotation: 'right',
    image: '/test.png',
    name: { 'en-US': 'DEFENDER' },
    description: { 'en-US': 'Test' },
  },
  {
    id: 'TEST-03',
    en_name: 'BALANCER',
    type: 'balance',
    tags: ['test'],
    stats: { attack: 33, defense: 34, stamina: 33 },
    rotation: 'right',
    image: '/test.png',
    name: { 'en-US': 'BALANCER' },
    description: { 'en-US': 'Test' },
  },
];

describe('findTopMatches', () => {
  it('should return top N matches', () => {
    const userScores = { attack: 60, defense: 20, stamina: 20 };
    const matches = findTopMatches(userScores, mockBeyblades, 2);
    expect(matches).toHaveLength(2);
  });

  it('should sort by distance', () => {
    const userScores = { attack: 60, defense: 20, stamina: 20 };
    const matches = findTopMatches(userScores, mockBeyblades, 3);
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].distance).toBeLessThanOrEqual(matches[i].distance);
    }
  });
});

describe('determineUserType', () => {
  it('should detect attack type', () => {
    const result = determineUserType({ attack: 60, defense: 20, stamina: 20 });
    expect(result).toBe('attack');
  });

  it('should detect defense type', () => {
    const result = determineUserType({ attack: 20, defense: 60, stamina: 20 });
    expect(result).toBe('defense');
  });

  it('should detect stamina type', () => {
    const result = determineUserType({ attack: 20, defense: 20, stamina: 60 });
    expect(result).toBe('stamina');
  });

  it('should detect balance type', () => {
    const result = determineUserType({ attack: 33, defense: 34, stamina: 33 });
    expect(result).toBe('balance');
  });
});
