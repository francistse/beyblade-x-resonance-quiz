export type BeybladeType = 'attack' | 'defense' | 'stamina' | 'balance';
export type Rotation = 'left' | 'right';

export interface Stats {
  attack: number;
  defense: number;
  stamina: number;
}

export interface BeybladeData {
  id: string;
  en_name: string;
  type: BeybladeType;
  tags: string[];
  stats: Stats;
  rotation: Rotation;
  image: string;
  name: Record<string, string>;
  description: Record<string, string>;
  blade_id?: string | null;
}

export interface BeybladeMatch {
  beyblade: BeybladeData;
  distance: number;
  fitPercentage: number;
}
