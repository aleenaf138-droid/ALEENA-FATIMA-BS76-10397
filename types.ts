
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface DifficultyConfig {
  rows: number;
  cols: number;
  name: Difficulty;
}

export interface CardData {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameStats {
  moves: number;
  matches: number;
  time: number;
}
