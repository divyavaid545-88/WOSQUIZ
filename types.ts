
export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface RoundConfig {
  id: number;
  name: string;
  correctPoints: number;
  wrongPoints: number;
  allowNegative: boolean;
}
