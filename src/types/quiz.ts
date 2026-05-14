import type { Stats, BeybladeMatch, BeybladeType } from './beyblade';

export interface QuizOption {
  key: string;
  scores: Stats;
}

export interface Question {
  id: number;
  questionKey: string;
  options: QuizOption[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  scores: Stats;
}

export interface DemographicData {
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  ageGroup?: 'under_13' | '13_17' | '18_24' | '25_34' | '35_44' | '45_54' | '55_plus';
}

export interface QuizState {
  currentQuestion: number;
  answers: QuizAnswer[];
  totalScores: Stats;
  isComplete: boolean;
  demographics: DemographicData;
  demographicsComplete: boolean;
}

export interface QuizResult {
  userVector: Stats;
  topMatches: BeybladeMatch[];
  awakeningKeyword: string;
  type: BeybladeType;
}
