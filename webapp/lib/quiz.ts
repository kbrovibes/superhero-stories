export type Difficulty = "easy" | "medium" | "hard" | "trivia";
export type QuizUniverse = "marvel" | "dc" | "avengers" | "thanos";

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

export interface QuizAnswer {
  question: QuizQuestion;
  picked: number;
  correct: boolean;
}

// Multi-hero filter. heroIds=null means "everything" (incl. ensemble nulls).
export function filterQuestionsByHeroes(
  questions: QuizQuestion[],
  difficulty: Difficulty,
  heroIds: string[] | null,
): QuizQuestion[] {
  return questions.filter((q) => {
    if (q.difficulty !== difficulty) return false;
    if (heroIds === null) return true;
    if (q.heroId === null) return false;
    return heroIds.includes(q.heroId);
  });
}

export function pickRandom(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
