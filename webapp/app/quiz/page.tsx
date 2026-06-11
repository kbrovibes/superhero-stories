"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import allQuestions from "@/lib/quiz-questions.json";
import {
  type Difficulty,
  type QuizQuestion,
  type QuizAnswer,
  filterQuestionsByHeroes,
  pickSmart,
  shuffleOptions,
} from "@/lib/quiz";
import {
  loadStats,
  saveStats,
  recordAsked,
  recordSkipped,
  type QuizStats,
} from "@/lib/quiz-stats";

// ─── Static hero list ─────────────────────────────────────────────────────────

const HERO_LIST: { id: string; name: string; universe: "marvel" | "dc" }[] = [
  { id: "iron-man",        name: "Iron Man",         universe: "marvel" },
  { id: "spider-man",      name: "Spider-Man",       universe: "marvel" },
  { id: "thor",            name: "Thor",             universe: "marvel" },
  { id: "captain-america", name: "Captain America",  universe: "marvel" },
  { id: "hulk",            name: "Hulk",             universe: "marvel" },
  { id: "black-widow",     name: "Black Widow",      universe: "marvel" },
  { id: "hawkeye",         name: "Hawkeye",          universe: "marvel" },
  { id: "doctor-strange",  name: "Doctor Strange",   universe: "marvel" },
  { id: "black-panther",   name: "Black Panther",    universe: "marvel" },
  { id: "ant-man",         name: "Ant-Man",          universe: "marvel" },
  { id: "scarlet-witch",   name: "Scarlet Witch",    universe: "marvel" },
  { id: "vision",          name: "Vision",           universe: "marvel" },
  { id: "falcon",          name: "Falcon",           universe: "marvel" },
  { id: "winter-soldier",  name: "Winter Soldier",   universe: "marvel" },
  { id: "star-lord",       name: "Star-Lord",        universe: "marvel" },
  { id: "loki",            name: "Loki",             universe: "marvel" },
  { id: "wasp",            name: "Wasp",             universe: "marvel" },
  { id: "batman",          name: "Batman",           universe: "dc" },
  { id: "superman",        name: "Superman",         universe: "dc" },
  { id: "wonder-woman",    name: "Wonder Woman",     universe: "dc" },
  { id: "the-flash",       name: "The Flash",        universe: "dc" },
  { id: "aquaman",         name: "Aquaman",          universe: "dc" },
  { id: "green-lantern",   name: "Green Lantern",    universe: "dc" },
  { id: "batgirl",         name: "Batgirl",          universe: "dc" },
  { id: "shazam",          name: "Shazam",           universe: "dc" },
  { id: "cyborg",          name: "Cyborg",           universe: "dc" },
  { id: "martian-manhunter", name: "Martian Manhunter", universe: "dc" },
  { id: "robin",           name: "Robin",            universe: "dc" },
  // X-Men (Marvel heroes)
  { id: "wolverine",       name: "Wolverine",        universe: "marvel" },
  { id: "storm",           name: "Storm",            universe: "marvel" },
  { id: "cyclops",         name: "Cyclops",          universe: "marvel" },
  { id: "jean-grey",       name: "Jean Grey",        universe: "marvel" },
  { id: "beast",           name: "Beast",            universe: "marvel" },
  { id: "rogue",           name: "Rogue",            universe: "marvel" },
  { id: "nightcrawler",    name: "Nightcrawler",     universe: "marvel" },
  { id: "gambit",          name: "Gambit",           universe: "marvel" },
  // DC heroes
  { id: "starfire",        name: "Starfire",         universe: "dc" },
  { id: "raven",           name: "Raven",            universe: "dc" },
  { id: "beast-boy",       name: "Beast Boy",        universe: "dc" },
  { id: "supergirl",       name: "Supergirl",        universe: "dc" },
  { id: "green-arrow",     name: "Green Arrow",      universe: "dc" },
  { id: "nightwing",       name: "Nightwing",        universe: "dc" },
  // Marvel villains
  { id: "green-goblin",    name: "Green Goblin",     universe: "marvel" },
  { id: "doctor-octopus",  name: "Doctor Octopus",   universe: "marvel" },
  { id: "venom",           name: "Venom",            universe: "marvel" },
  { id: "magneto",         name: "Magneto",          universe: "marvel" },
  { id: "ultron",          name: "Ultron",           universe: "marvel" },
  { id: "red-skull",       name: "Red Skull",        universe: "marvel" },
  { id: "abomination",     name: "Abomination",      universe: "marvel" },
  { id: "killmonger",      name: "Killmonger",       universe: "marvel" },
  { id: "mysterio",        name: "Mysterio",         universe: "marvel" },
  // DC villains
  { id: "joker",           name: "The Joker",        universe: "dc" },
  { id: "harley-quinn",    name: "Harley Quinn",     universe: "dc" },
  { id: "lex-luthor",      name: "Lex Luthor",       universe: "dc" },
  { id: "riddler",         name: "The Riddler",      universe: "dc" },
  { id: "two-face",        name: "Two-Face",         universe: "dc" },
  { id: "catwoman",        name: "Catwoman",         universe: "dc" },
  { id: "bane",            name: "Bane",             universe: "dc" },
  { id: "sinestro",        name: "Sinestro",         universe: "dc" },
  { id: "black-manta",     name: "Black Manta",      universe: "dc" },
  { id: "darkseid",        name: "Darkseid",         universe: "dc" },
];

const ALL_IDS = HERO_LIST.map((h) => h.id);
const MARVEL_IDS = HERO_LIST.filter((h) => h.universe === "marvel").map((h) => h.id);
const DC_IDS = HERO_LIST.filter((h) => h.universe === "dc").map((h) => h.id);

// ─── Config ───────────────────────────────────────────────────────────────────

const COUNTS = [5, 10, 15, 20];

// Only trivia mode is exposed in the UI right now; easy/medium/hard data
// stays in quiz-questions.json so the picker can be re-enabled later.
const MODE: Difficulty = "trivia";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreEmoji(correct: number, total: number) {
  const pct = correct / total;
  if (pct === 1)   return "🏆";
  if (pct >= 0.8)  return "⭐";
  if (pct >= 0.6)  return "👍";
  if (pct >= 0.4)  return "📚";
  return "💪";
}

function describeSelection(selected: string[]): string {
  if (selected.length === 0) return "No heroes";
  if (selected.length === ALL_IDS.length) return "All Heroes";
  if (selected.length === MARVEL_IDS.length && selected.every((id) => MARVEL_IDS.includes(id))) return "Marvel";
  if (selected.length === DC_IDS.length && selected.every((id) => DC_IDS.includes(id))) return "DC";
  if (selected.length === 1) return HERO_LIST.find((h) => h.id === selected[0])?.name ?? selected[0];
  return `${selected.length} heroes`;
}

// Parse ?scope=... from old hero-page links. Accepts:
//   "all" | "marvel" | "dc"  → expanded preset
//   "<heroId>"               → single hero
//   "id1,id2,id3"            → multi
function parseInitialSelection(scope: string | null): string[] {
  if (!scope) return [];
  if (scope === "all") return [...ALL_IDS];
  if (scope === "marvel") return [...MARVEL_IDS];
  if (scope === "dc") return [...DC_IDS];
  const ids = scope.split(",").map((s) => s.trim()).filter((id) => ALL_IDS.includes(id));
  return ids;
}

// ─── Config Screen ────────────────────────────────────────────────────────────

function ConfigScreen({
  initialSelected,
  stats,
  onStart,
}: {
  initialSelected: string[];
  stats: QuizStats;
  onStart: (mode: Difficulty, selected: string[], scopeLabel: string, count: number, questions: QuizQuestion[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [count, setCount] = useState(10);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleHero(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAll() { setSelected([...ALL_IDS]); }
  function selectMarvel() { setSelected([...MARVEL_IDS]); }
  function selectDC() { setSelected([...DC_IDS]); }
  function selectNone() { setSelected([]); }

  const available = filterQuestionsByHeroes(
    allQuestions as QuizQuestion[],
    MODE,
    selected,
  ).length;

  const scopeLabel = describeSelection(selected);

  function handleStart() {
    const pool = filterQuestionsByHeroes(allQuestions as QuizQuestion[], MODE, selected);
    const picked = pickSmart(pool, count, stats).map(shuffleOptions);
    onStart(MODE, selected, scopeLabel, count, picked);
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 className="liquid-text" style={{ fontSize: 52, fontWeight: 900, margin: "0 0 8px", lineHeight: 0.9, textTransform: "uppercase" }}>
          Quiz<br />Time!
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
          Test your superhero knowledge.
        </p>
      </div>

      {/* Heroes */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Heroes · {selected.length} selected
          </label>
          <button
            onClick={selectNone}
            disabled={selected.length === 0}
            style={{
              padding: 0,
              border: "none",
              background: "transparent",
              color: selected.length === 0 ? "var(--text-muted)" : "var(--marvel-accent)",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: selected.length === 0 ? "default" : "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {/* Quick-select buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={selectAll}
            style={quickBtnStyle(selected.length === ALL_IDS.length)}
          >
            All
          </button>
          <button
            onClick={selectMarvel}
            style={quickBtnStyle(selected.length === MARVEL_IDS.length && selected.every((id) => MARVEL_IDS.includes(id)))}
          >
            Marvel
          </button>
          <button
            onClick={selectDC}
            style={quickBtnStyle(selected.length === DC_IDS.length && selected.every((id) => DC_IDS.includes(id)))}
          >
            DC
          </button>
        </div>

        {/* Hero chips — multi-select */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HERO_LIST.map((h) => {
            const on = selectedSet.has(h.id);
            const accent = h.universe === "marvel" ? "var(--marvel-accent)" : "var(--dc-accent)";
            const tint = h.universe === "marvel" ? "rgba(229,9,20,0.18)" : "rgba(0,153,255,0.18)";
            return (
              <button
                key={h.id}
                onClick={() => toggleHero(h.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: on ? `2px solid ${accent}` : "1px solid var(--border)",
                  background: on ? tint : "transparent",
                  color: on ? accent : "var(--text-muted)",
                  fontWeight: on ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {on ? "✓ " : ""}{h.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question count */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 12 }}>
          Questions
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                border: count === n ? "2px solid var(--thanos-accent)" : "2px solid var(--border)",
                background: count === n ? "rgba(162,107,255,0.15)" : "var(--surface)",
                color: count === n ? "var(--thanos-accent)" : "var(--text-muted)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={handleStart}
        disabled={available === 0 || selected.length === 0}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 16,
          border: "none",
          background: (available === 0 || selected.length === 0)
            ? "var(--surface)"
            : "radial-gradient(circle at 30% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
          color: (available === 0 || selected.length === 0) ? "var(--text-muted)" : "#0a0a14",
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: (available === 0 || selected.length === 0) ? "not-allowed" : "pointer",
          transition: "opacity 0.15s",
        }}
      >
        {selected.length === 0
          ? "Pick at least one hero"
          : available === 0
            ? "No questions in pool"
            : `Start · ${Math.min(count, available)} Questions`}
      </button>

      {available > 0 && selected.length > 0 && (
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          {available} trivia questions across {scopeLabel.toLowerCase()}
        </p>
      )}
    </div>
  );
}

function quickBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "9px 0",
    borderRadius: 10,
    border: active ? "2px solid var(--av-accent)" : "2px solid var(--border)",
    background: active ? "rgba(255,217,0,0.12)" : "var(--surface)",
    color: active ? "var(--av-accent)" : "var(--text-muted)",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

// ─── Question Screen ──────────────────────────────────────────────────────────

function QuestionScreen({
  question,
  index,
  total,
  existingPick,
  existingSkipped,
  onAnswer,
  onSkip,
  onNext,
  onBack,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  existingPick?: number | null;
  existingSkipped?: boolean;
  onAnswer: (picked: number) => void;
  onSkip: () => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(existingPick ?? null);
  const [skipped, setSkipped] = useState<boolean>(existingSkipped ?? false);
  const answered = picked !== null || skipped;

  const diffColor = {
    easy: "#22c55e",
    medium: "#f59e0b",
    hard: "#ef4444",
    trivia: "#a26bff",
  }[question.difficulty];

  function handlePick(i: number) {
    if (answered) return;
    setPicked(i);
    onAnswer(i);
  }

  function handleSkip() {
    if (answered) return;
    setSkipped(true);
    onSkip();
  }

  function optionStyle(i: number) {
    const base: React.CSSProperties = {
      width: "100%",
      padding: "14px 18px",
      borderRadius: 14,
      border: "2px solid var(--border)",
      background: "var(--surface)",
      color: "var(--text-secondary)",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "left",
      cursor: answered ? "default" : "pointer",
      transition: "all 0.2s",
      lineHeight: 1.4,
    };
    if (!answered) return base;
    if (i === question.correctIndex) return { ...base, border: "2px solid #22c55e", background: "rgba(34,197,94,0.15)", color: "#22c55e" };
    if (picked !== null && i === picked) return { ...base, border: "2px solid #ef4444", background: "rgba(239,68,68,0.15)", color: "#ef4444" };
    return { ...base, opacity: 0.4 };
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 24px" }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Question {index + 1} of {total}
          </span>
          <span style={{ fontSize: 11, color: diffColor, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${diffColor}`, padding: "2px 8px", borderRadius: 999 }}>
            {question.difficulty}
          </span>
        </div>
        <div style={{ height: 4, background: "var(--surface)", borderRadius: 99 }}>
          <div style={{ height: 4, width: `${((index + 1) / total) * 100}%`, background: "var(--thanos-accent)", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question */}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 32px", lineHeight: 1.35 }}>
        {question.question}
      </h2>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handlePick(i)} style={optionStyle(i)}>
            <span style={{ color: "var(--text-muted)", marginRight: 10, fontWeight: 700, fontSize: 13 }}>
              {["A", "B", "C", "D"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation after answer */}
      {answered && (() => {
        const wasCorrect = picked === question.correctIndex;
        const tint = skipped ? "rgba(245,158,11,0.08)" : wasCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";
        const border = skipped ? "#f59e0b44" : wasCorrect ? "#22c55e44" : "#ef444444";
        const labelColor = skipped ? "#f59e0b" : wasCorrect ? "#22c55e" : "#ef4444";
        const label = skipped ? "↷ Skipped." : wasCorrect ? "✓ Correct!" : "✗ Not quite.";
        return (
          <div style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: tint,
            border: `1px solid ${border}`,
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            <span style={{ fontWeight: 700, color: labelColor, marginRight: 6 }}>
              {label}
            </span>
            {skipped && (
              <span style={{ marginRight: 6 }}>
                Answer: <strong>{question.options[question.correctIndex]}</strong>.
              </span>
            )}
            {question.explanation}
          </div>
        );
      })()}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "13px 20px",
              borderRadius: 14,
              border: "2px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-muted)",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            ← Back
          </button>
        )}
        {!answered && (
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 14,
              border: "2px dashed var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Skip · Show Answer
          </button>
        )}
        {answered && (
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 14,
              border: "none",
              background: "radial-gradient(circle at 30% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
              color: "#0a0a14",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {index + 1 < total ? "Next →" : "See Results →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  answers,
  onRetry,
  onReconfigure,
}: {
  answers: QuizAnswer[];
  onRetry: () => void;
  onReconfigure: () => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const skippedCount = answers.filter((a) => a.skipped).length;
  const total = answers.length;
  const emoji = scoreEmoji(correct, total);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>{emoji}</div>
        <h1 className="liquid-text" style={{ fontSize: 64, fontWeight: 900, margin: 0, lineHeight: 0.85 }}>
          {correct}<span style={{ fontSize: 32, color: "var(--text-muted)", fontWeight: 500 }}>/{total}</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "12px 0 0" }}>
          {correct === total ? "Perfect score! You know your heroes." :
           correct >= total * 0.8 ? "Excellent — true hero knowledge!" :
           correct >= total * 0.6 ? "Solid. A few more stories to go." :
           correct >= total * 0.4 ? "Keep reading — the stories have the answers." :
           "Time to hit the archives!"}
        </p>
      </div>

      {skippedCount > 0 && (
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", margin: "0 0 24px" }}>
          {skippedCount} skipped · those will appear less often next time
        </p>
      )}

      {/* Per-question review */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        {answers.map((a, i) => {
          const borderColor = a.skipped ? "#f59e0b44" : a.correct ? "#22c55e44" : "#ef444444";
          const icon = a.skipped ? "↷" : a.correct ? "✓" : "✗";
          return (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "var(--surface)",
                border: `1px solid ${borderColor}`,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {a.question.question}
                </p>
                {!a.correct && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#22c55e" }}>
                    ✓ {a.question.options[a.question.correctIndex]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={onRetry}
          style={{
            padding: "14px 0",
            borderRadius: 14,
            border: "none",
            background: "radial-gradient(circle at 30% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
            color: "#0a0a14",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <button
          onClick={onReconfigure}
          style={{
            padding: "14px 0",
            borderRadius: 14,
            border: "2px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Change Settings
        </button>
        <Link
          href="/"
          style={{
            display: "block",
            padding: "14px 0",
            borderRadius: 14,
            border: "none",
            background: "transparent",
            color: "var(--text-muted)",
            fontWeight: 600,
            fontSize: 14,
            textAlign: "center",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Back to Stories
        </Link>
      </div>
    </div>
  );
}

// ─── Main Quiz Controller ─────────────────────────────────────────────────────

type Phase = "config" | "playing" | "results";

function QuizController() {
  const searchParams = useSearchParams();

  const initialSelected = useMemo(
    () => parseInitialSelection(searchParams.get("scope")),
    [searchParams],
  );

  const [phase, setPhase] = useState<Phase>("config");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuizAnswer>>({});
  const [lastConfig, setLastConfig] = useState<{ mode: Difficulty; selected: string[]; scopeLabel: string; count: number } | null>(null);
  const [stats, setStats] = useState<QuizStats>({});

  // Hydrate stats from localStorage on mount (client-only).
  useEffect(() => {
    setStats(loadStats());
  }, []);

  function bumpAsked(id: string) {
    setStats((prev) => {
      const next = recordAsked(prev, id);
      saveStats(next);
      return next;
    });
  }

  function bumpSkipped(id: string) {
    setStats((prev) => {
      const next = recordSkipped(recordAsked(prev, id), id);
      saveStats(next);
      return next;
    });
  }

  function handleStart(mode: Difficulty, selected: string[], scopeLabel: string, count: number, picked: QuizQuestion[]) {
    setLastConfig({ mode, selected, scopeLabel, count });
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers({});
    setPhase("playing");
  }

  function handleAnswer(picked: number) {
    const q = questions[currentIndex];
    if (answers[currentIndex]) return; // already recorded
    const newAnswer: QuizAnswer = { question: q, picked, correct: picked === q.correctIndex, skipped: false };
    setAnswers((prev) => ({ ...prev, [currentIndex]: newAnswer }));
    bumpAsked(q.id);
  }

  function handleSkip() {
    const q = questions[currentIndex];
    if (answers[currentIndex]) return;
    const newAnswer: QuizAnswer = { question: q, picked: null, correct: false, skipped: true };
    setAnswers((prev) => ({ ...prev, [currentIndex]: newAnswer }));
    bumpSkipped(q.id);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function handleRetry() {
    if (!lastConfig) return;
    const pool = filterQuestionsByHeroes(allQuestions as QuizQuestion[], lastConfig.mode, lastConfig.selected);
    const picked = pickSmart(pool, lastConfig.count, stats).map(shuffleOptions);
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers({});
    setPhase("playing");
  }

  function handleReconfigure() {
    setPhase("config");
  }

  if (phase === "config") {
    return <ConfigScreen initialSelected={initialSelected} stats={stats} onStart={handleStart} />;
  }

  if (phase === "playing") {
    return (
      <QuestionScreen
        key={currentIndex}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        existingPick={answers[currentIndex]?.picked ?? null}
        existingSkipped={answers[currentIndex]?.skipped ?? false}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onNext={handleNext}
        onBack={currentIndex > 0 ? handleBack : undefined}
      />
    );
  }

  const orderedAnswers = questions.map((_, i) => answers[i]).filter(Boolean) as QuizAnswer[];
  return <ResultsScreen answers={orderedAnswers} onRetry={handleRetry} onReconfigure={handleReconfigure} />;
}

export default function QuizPage() {
  return (
    <>
      <NavBar crumbs={[{ label: "Stories", href: "/" }, { label: "Quiz Time" }]} />
      <Suspense>
        <QuizController />
      </Suspense>
    </>
  );
}
