"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import allQuestions from "@/lib/quiz-questions.json";
import {
  type Difficulty,
  type QuizScope,
  type QuizQuestion,
  type QuizAnswer,
  filterQuestions,
  pickRandom,
} from "@/lib/quiz";

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
];

// ─── Config ───────────────────────────────────────────────────────────────────

const DIFFICULTIES: { id: Difficulty; label: string; color: string }[] = [
  { id: "easy",   label: "Easy",   color: "#22c55e" },
  { id: "medium", label: "Medium", color: "#f59e0b" },
  { id: "hard",   label: "Hard",   color: "#ef4444" },
];

const COUNTS = [5, 10, 15, 20];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreEmoji(correct: number, total: number) {
  const pct = correct / total;
  if (pct === 1)   return "🏆";
  if (pct >= 0.8)  return "⭐";
  if (pct >= 0.6)  return "👍";
  if (pct >= 0.4)  return "📚";
  return "💪";
}

// ─── Config Screen ────────────────────────────────────────────────────────────

function ConfigScreen({
  initialScope,
  initialLabel,
  onStart,
}: {
  initialScope: QuizScope;
  initialLabel: string;
  onStart: (difficulty: Difficulty, scope: QuizScope, scopeLabel: string, count: number, questions: QuizQuestion[]) => void;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [scope, setScope] = useState<QuizScope>(initialScope);
  const [count, setCount] = useState(5);

  // Derive display label from scope
  const scopeLabel = scope === "all" ? "All Heroes"
    : scope === "marvel" ? "Marvel"
    : scope === "dc" ? "DC"
    : HERO_LIST.find(h => h.id === scope)?.name ?? scope;

  // Which universe tab is active (for the top row buttons)
  const universeTab: "all" | "marvel" | "dc" =
    scope === "all" || scope === "marvel" || scope === "dc"
      ? (scope as "all" | "marvel" | "dc")
      : (HERO_LIST.find(h => h.id === scope)?.universe ?? "all");

  // Heroes visible below the universe toggle
  const visibleHeroes = universeTab === "all" ? HERO_LIST : HERO_LIST.filter(h => h.universe === universeTab);

  function handleStart() {
    const pool = filterQuestions(allQuestions as QuizQuestion[], difficulty, scope);
    const picked = pickRandom(pool, count);
    onStart(difficulty, scope, scopeLabel, count, picked);
  }

  const available = filterQuestions(allQuestions as QuizQuestion[], difficulty, scope).length;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 className="liquid-text" style={{ fontSize: 52, fontWeight: 900, margin: "0 0 8px", lineHeight: 0.9, textTransform: "uppercase" }}>
          Quiz<br />Time!
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
          Test your superhero knowledge.
        </p>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 36 }}>
        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 12 }}>
          Difficulty
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 12,
                border: difficulty === d.id ? `2px solid ${d.color}` : "2px solid var(--border)",
                background: difficulty === d.id ? `${d.color}22` : "var(--surface)",
                color: difficulty === d.id ? d.color : "var(--text-muted)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope */}
      <div style={{ marginBottom: 36 }}>
        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 12 }}>
          Characters
        </label>
        {/* Universe toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {(["all", "marvel", "dc"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setScope(u)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 10,
                border: universeTab === u ? "2px solid var(--av-accent)" : "2px solid var(--border)",
                background: universeTab === u ? "rgba(255,217,0,0.12)" : "var(--surface)",
                color: universeTab === u ? "var(--av-accent)" : "var(--text-muted)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {u === "all" ? "All" : u.toUpperCase()}
            </button>
          ))}
        </div>
        {/* Individual hero chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {visibleHeroes.map((h) => (
            <button
              key={h.id}
              onClick={() => setScope(h.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: scope === h.id ? "2px solid var(--marvel-accent)" : "1px solid var(--border)",
                background: scope === h.id ? "rgba(229,9,20,0.15)" : "transparent",
                color: scope === h.id ? "var(--marvel-accent)" : "var(--text-muted)",
                fontWeight: scope === h.id ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div style={{ marginBottom: 48 }}>
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
        disabled={available === 0}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 16,
          border: "none",
          background: available === 0
            ? "var(--surface)"
            : "radial-gradient(circle at 30% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
          color: available === 0 ? "var(--text-muted)" : "#0a0a14",
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: available === 0 ? "not-allowed" : "pointer",
          transition: "opacity 0.15s",
        }}
      >
        {available === 0 ? "Questions Loading…" : `Start Quiz · ${Math.min(count, available)} Questions`}
      </button>

      {available > 0 && (
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          {available} questions available in pool
        </p>
      )}
    </div>
  );
}

// ─── Question Screen ──────────────────────────────────────────────────────────

function QuestionScreen({
  question,
  index,
  total,
  onAnswer,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  onAnswer: (picked: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  const diffColor = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" }[question.difficulty];

  function handlePick(i: number) {
    if (answered) return;
    setPicked(i);
    setTimeout(() => onAnswer(i), 900);
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
    if (i === picked) return { ...base, border: "2px solid #ef4444", background: "rgba(239,68,68,0.15)", color: "#ef4444" };
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
      {answered && (
        <div style={{
          padding: "12px 16px",
          borderRadius: 12,
          background: picked === question.correctIndex ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${picked === question.correctIndex ? "#22c55e44" : "#ef444444"}`,
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700, color: picked === question.correctIndex ? "#22c55e" : "#ef4444", marginRight: 6 }}>
            {picked === question.correctIndex ? "✓ Correct!" : "✗ Not quite."}
          </span>
          {question.explanation}
        </div>
      )}
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

      {/* Per-question review */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        {answers.map((a, i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "var(--surface)",
              border: `1px solid ${a.correct ? "#22c55e44" : "#ef444444"}`,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{a.correct ? "✓" : "✗"}</span>
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
        ))}
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

  const initialScope = (searchParams.get("scope") ?? "all") as QuizScope;
  const initialLabel = searchParams.get("label") ?? "All Heroes";

  const [phase, setPhase] = useState<Phase>("config");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [lastConfig, setLastConfig] = useState<{ difficulty: Difficulty; scope: QuizScope; scopeLabel: string; count: number } | null>(null);

  function handleStart(difficulty: Difficulty, scope: QuizScope, scopeLabel: string, count: number, picked: QuizQuestion[]) {
    setLastConfig({ difficulty, scope, scopeLabel, count });
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("playing");
  }

  function handleAnswer(picked: number) {
    const q = questions[currentIndex];
    const newAnswer: QuizAnswer = { question: q, picked, correct: picked === q.correctIndex };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setPhase("results");
      }
    }, 300);
  }

  function handleRetry() {
    if (!lastConfig) return;
    const pool = filterQuestions(allQuestions as QuizQuestion[], lastConfig.difficulty, lastConfig.scope);
    const picked = pickRandom(pool, lastConfig.count);
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("playing");
  }

  function handleReconfigure() {
    setPhase("config");
  }

  if (phase === "config") {
    return <ConfigScreen initialScope={initialScope} initialLabel={initialLabel} onStart={handleStart} />;
  }

  if (phase === "playing") {
    return (
      <QuestionScreen
        key={currentIndex}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    );
  }

  return <ResultsScreen answers={answers} onRetry={handleRetry} onReconfigure={handleReconfigure} />;
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
