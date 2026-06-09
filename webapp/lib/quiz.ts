import type { QuizStats, QuestionStat } from "./quiz-stats";

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
  picked: number | null; // null if skipped
  correct: boolean;
  skipped: boolean;
}

const EMPTY_STAT: QuestionStat = { asked: 0, skipped: 0, lastAsked: 0 };

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

// In-place Fisher–Yates shuffle.
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Weighted-sample without replacement. Higher weight => more likely.
function weightedSample<T>(items: T[], weights: number[], count: number): T[] {
  const picked: T[] = [];
  const pool = items.map((item, i) => ({ item, weight: weights[i] }));
  const target = Math.min(count, pool.length);
  while (picked.length < target && pool.length > 0) {
    const totalW = pool.reduce((s, x) => s + x.weight, 0);
    if (totalW <= 0) {
      // All weights zero — fall back to uniform random
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx].item);
      pool.splice(idx, 1);
      continue;
    }
    let r = Math.random() * totalW;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) { idx = i; break; }
    }
    picked.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return picked;
}

// Score-based selection that:
//   1. Prefers questions asked fewer times — weight = 1/(1+asked)
//   2. Throttles skipped questions to at most ~maxSkippedFraction of the quiz
//      (cap = max(0, floor(count/5))) — so a 10-question quiz allows up to 2 skipped.
//   3. Returns the picks in randomized order (not segregated by skipped/fresh).
export function pickSmart(
  pool: QuizQuestion[],
  count: number,
  stats: QuizStats,
): QuizQuestion[] {
  if (pool.length === 0 || count <= 0) return [];

  const statOf = (q: QuizQuestion): QuestionStat => stats[q.id] ?? EMPTY_STAT;

  const skippedPool = pool.filter((q) => statOf(q).skipped > 0);
  const freshPool = pool.filter((q) => statOf(q).skipped === 0);

  const skipCap = Math.max(0, Math.floor(count / 5)); // 10 → 2, 5 → 1, <5 → 0
  const skipQuota = Math.min(skipCap, skippedPool.length);
  const freshQuota = Math.min(count - skipQuota, freshPool.length);
  // If freshPool runs out, top up from skipped pool.
  const remainderQuota = count - skipQuota - freshQuota;

  const skippedWeights = skippedPool.map((q) => 1 / (1 + statOf(q).asked));
  const freshWeights = freshPool.map((q) => 1 / (1 + statOf(q).asked));

  const fromSkipped = weightedSample(skippedPool, skippedWeights, skipQuota);
  const fromFresh = weightedSample(freshPool, freshWeights, freshQuota);

  let extras: QuizQuestion[] = [];
  if (remainderQuota > 0) {
    const used = new Set([...fromSkipped, ...fromFresh].map((q) => q.id));
    const remaining = skippedPool.filter((q) => !used.has(q.id));
    extras = weightedSample(
      remaining,
      remaining.map((q) => 1 / (1 + statOf(q).asked)),
      remainderQuota,
    );
  }

  return shuffle([...fromFresh, ...fromSkipped, ...extras]);
}

// Per-question option shuffle. Returns a NEW question object with options
// rearranged and correctIndex recomputed. Keeps id stable for stats lookup.
export function shuffleOptions(q: QuizQuestion): QuizQuestion {
  const correctAnswer = q.options[q.correctIndex];
  const opts: [string, string, string, string] = [...q.options] as [string, string, string, string];
  shuffle(opts);
  const newCorrect = opts.indexOf(correctAnswer) as 0 | 1 | 2 | 3;
  return { ...q, options: opts, correctIndex: newCorrect };
}
