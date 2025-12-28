
import { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.EASY]: { rows: 3, cols: 4, name: Difficulty.EASY },
  [Difficulty.MEDIUM]: { rows: 4, cols: 4, name: Difficulty.MEDIUM },
  [Difficulty.HARD]: { rows: 6, cols: 6, name: Difficulty.HARD },
};

export const SYMBOLS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
  '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
  '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎',
  '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟'
];

export const POSITIVE_MESSAGES = [
  "Match Found!",
  "Great Memory!",
  "Nice One!",
  "You Got It!",
  "Impressive!",
  "Brilliant!",
  "Keep Going!",
];

export const NEUTRAL_MESSAGES = [
  "Try Again!",
  "Not Quite!",
  "Almost Got It!",
  "Whoops!",
  "Keep Looking!",
];
