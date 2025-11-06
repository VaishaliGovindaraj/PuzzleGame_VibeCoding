export type AgeRange = "3-4" | "4-5" | "5-6" | "3-5" | "4-6";

export interface Puzzle {
  id: string;
  ageRange: AgeRange;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}
