export type Difficulty = "easy" | "medium" | "hard";
export type QuizUniverse = "marvel" | "dc" | "avengers" | "thanos";
export type QuizScope = "all" | "marvel" | "dc" | string; // string = heroId

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: Difficulty;
  universe: QuizUniverse;
  heroId: string | null;
  explanation: string;
}

export interface QuizConfig {
  difficulty: Difficulty;
  scope: QuizScope;
  scopeLabel: string;
  count: number;
}

export interface QuizAnswer {
  question: QuizQuestion;
  picked: number;
  correct: boolean;
}

export function filterQuestions(
  questions: QuizQuestion[],
  difficulty: Difficulty,
  scope: QuizScope,
): QuizQuestion[] {
  return questions.filter((q) => {
    if (q.difficulty !== difficulty) return false;
    if (scope === "all") return true;
    if (scope === "marvel") return q.universe === "marvel";
    if (scope === "dc") return q.universe === "dc";
    return q.heroId === scope;
  });
}

export function pickRandom(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
