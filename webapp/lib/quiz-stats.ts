// Per-question usage stats persisted in localStorage. Used to (a) bias selection
// toward less-asked questions so the same set doesn't repeat and (b) throttle
// skipped questions so the kid sees them only occasionally.

export type QuestionStat = {
  asked: number;     // total times this question has been served
  skipped: number;   // total times skipped (counted as wrong + dampened later)
  lastAsked: number; // ms epoch — used as a tiebreaker
};

export type QuizStats = Record<string, QuestionStat>;

const KEY = "superhero-quiz-stats:v1";
const EMPTY: QuestionStat = { asked: 0, skipped: 0, lastAsked: 0 };

export function loadStats(): QuizStats {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizStats) : {};
  } catch {
    return {};
  }
}

export function saveStats(stats: QuizStats): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    // quota/disabled — silently ignore; selection still works, just no learning
  }
}

export function getStat(stats: QuizStats, id: string): QuestionStat {
  return stats[id] ?? EMPTY;
}

export function recordAsked(stats: QuizStats, id: string): QuizStats {
  const cur = stats[id] ?? EMPTY;
  return { ...stats, [id]: { ...cur, asked: cur.asked + 1, lastAsked: Date.now() } };
}

export function recordSkipped(stats: QuizStats, id: string): QuizStats {
  const cur = stats[id] ?? EMPTY;
  return { ...stats, [id]: { ...cur, skipped: cur.skipped + 1 } };
}
