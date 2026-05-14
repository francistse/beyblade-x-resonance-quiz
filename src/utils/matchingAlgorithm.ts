import type { BeybladeData, Stats, BeybladeMatch, BeybladeType } from '../types';
import { normalizeStats } from './normalizeStats';
import { calculateDistance } from './calculateDistance';
import { detectBalanceType } from './detectBalanceType';

export function findTopMatches(
  userScores: Stats,
  beyblades: BeybladeData[],
  topN = 3
): BeybladeMatch[] {
  const userVector = normalizeStats(userScores);
  const isBalance = detectBalanceType(userVector);
  
  const matches: BeybladeMatch[] = beyblades.map(beyblade => {
    const beybladeVector = normalizeStats(beyblade.stats);
    const distance = calculateDistance(userVector, beybladeVector);
    const maxDistance = Math.sqrt(2);
    const fitPercentage = Math.round((1 - distance / maxDistance) * 100);
    
    return {
      beyblade,
      distance,
      fitPercentage,
    };
  });
  
  if (isBalance) {
    const balanceTypes = matches.filter(m => m.beyblade.type === 'balance');
    const others = matches.filter(m => m.beyblade.type !== 'balance');
    balanceTypes.sort((a, b) => a.distance - b.distance);
    others.sort((a, b) => a.distance - b.distance);
    const sorted = [...balanceTypes, ...others];
    return sorted.slice(0, topN);
  }
  
  matches.sort((a, b) => a.distance - b.distance);
  return matches.slice(0, topN);
}

export function determineUserType(stats: Stats): BeybladeType {
  const normalized = normalizeStats(stats);
  const { attack, defense, stamina } = normalized;
  
  if (detectBalanceType(normalized)) {
    return 'balance';
  }
  
  if (attack >= defense && attack >= stamina) return 'attack';
  if (defense >= attack && defense >= stamina) return 'defense';
  return 'stamina';
}
