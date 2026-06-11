"use client";

const KEY = "hero-popularity-v1";
const VISIT_WEIGHT = 2; // a story-page visit is worth more than a quiz check-toggle
const SELECT_WEIGHT = 1;

type Counters = { visits: number; selects: number; lastTouched: number };
type Store = Record<string, Counters>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("hero-popularity-changed"));
  } catch {
    /* quota or privacy mode — silent */
  }
}

function bump(heroId: string, kind: keyof Omit<Counters, "lastTouched">): void {
  if (!heroId) return;
  const store = read();
  const cur = store[heroId] ?? { visits: 0, selects: 0, lastTouched: 0 };
  store[heroId] = {
    visits: cur.visits + (kind === "visits" ? 1 : 0),
    selects: cur.selects + (kind === "selects" ? 1 : 0),
    lastTouched: Date.now(),
  };
  write(store);
}

export function recordVisit(heroId: string): void {
  bump(heroId, "visits");
}

export function recordSelect(heroId: string): void {
  bump(heroId, "selects");
}

export function recordSelects(heroIds: string[]): void {
  if (!heroIds.length) return;
  const store = read();
  const now = Date.now();
  for (const id of heroIds) {
    const cur = store[id] ?? { visits: 0, selects: 0, lastTouched: 0 };
    store[id] = { ...cur, selects: cur.selects + 1, lastTouched: now };
  }
  write(store);
}

export function getPopular(limit = 6): string[] {
  const store = read();
  return Object.entries(store)
    .map(([id, c]) => ({
      id,
      score: c.visits * VISIT_WEIGHT + c.selects * SELECT_WEIGHT,
      lastTouched: c.lastTouched,
    }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score || b.lastTouched - a.lastTouched)
    .slice(0, limit)
    .map((e) => e.id);
}

export function clearPopularity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("hero-popularity-changed"));
}
