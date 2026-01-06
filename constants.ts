
import { Team, RoundConfig } from './types';

export const INITIAL_TEAMS: Team[] = [
  { id: 1, name: 'Chennai Super Kings', score: 0, color: 'bg-yellow-400' },
  { id: 2, name: 'Mumbai Indians', score: 0, color: 'bg-blue-600' },
  { id: 3, name: 'Royal Challengers Bangalore', score: 0, color: 'bg-red-600' },
  { id: 4, name: 'Kolkata Knight Riders', score: 0, color: 'bg-purple-700' },
  { id: 5, name: 'Rajasthan Royals', score: 0, color: 'bg-pink-500' },
];

export const ROUNDS: RoundConfig[] = [
  { id: 1, name: 'Round 1', correctPoints: 5, wrongPoints: 0, allowNegative: false },
  { id: 2, name: 'Round 2', correctPoints: 5, wrongPoints: 0, allowNegative: false },
  { id: 3, name: 'Round 3', correctPoints: 5, wrongPoints: 0, allowNegative: false },
  { id: 4, name: 'Round 4 (Negative)', correctPoints: 20, wrongPoints: -5, allowNegative: true },
  { id: 5, name: 'Round 5 (Final Negative)', correctPoints: 20, wrongPoints: -5, allowNegative: true },
];

export const ASSETS = {
  CORRECT: 'https://cdn.freesound.org/previews/171/171671_2437358-lq.mp3',
  WRONG: 'https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3',
  WINNER: 'https://cdn.freesound.org/previews/659/659798_11502450-lq.mp3',
};
