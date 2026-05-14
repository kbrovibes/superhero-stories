"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Candidate } from "@/lib/stories";
import SurpriseWinner from "./SurpriseWinner";

type Phase = "idle" | "spinning" | "coasting" | "won";

// Physics constants (candidates per second, ms, dimensionless)
const MIN_V = 4;
const MAX_V = 18;
const RAMP_TIME = 1500;
const FRICTION_PER_SEC = 0.35;
const SNAP_VELOCITY = 0.6;
const SNAP_DURATION = 320;
const MIN_HOLD = 250;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

interface SurpriseSpinnerProps {
  candidates: Candidate[];
}

export default function SurpriseSpinner({ candidates }: SurpriseSpinnerProps) {
  // Keep the initial order from the server to avoid SSR/CSR hydration mismatch.
  // We reshuffle when the user actually spins (in startSpin) — that's a user
  // gesture, not render, so the random call is safely outside render.
  const [deck, setDeck] = useState<Candidate[]>(candidates);

  const [phase, setPhase] = useState<Phase>("idle");
  const [displayIndex, setDisplayIndex] = useState(0);
  const [winner, setWinner] = useState<Candidate | null>(null);
  const [blurAmt, setBlurAmt] = useState(0);

  // Mutable physics state — kept in refs so the rAF loop doesn't re-render on every tick.
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const holdStartedAtRef = useRef(0);
  const snapTargetRef = useRef<number | null>(null);
  const snapStartedAtRef = useRef(0);
  const snapStartPosRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion();
  }, []);

  const deckLen = deck.length;

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const finalize = useCallback((idx: number) => {
    const n = deckLen;
    if (n === 0) return;
    const final = ((idx % n) + n) % n;
    setDisplayIndex(final);
    setWinner(deck[final]);
    setPhaseBoth("won");
    velocityRef.current = 0;
    snapTargetRef.current = null;
  }, [deck, deckLen, setPhaseBoth]);

  // rAF loop — single source of truth for position/velocity.
  useEffect(() => {
    if (deckLen === 0) return;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000); // clamp to 50ms to survive tab pauses
      lastTsRef.current = ts;
      const phase = phaseRef.current;

      if (phase === "spinning") {
        const held = ts - holdStartedAtRef.current;
        const ramp = Math.min(1, held / RAMP_TIME);
        const target = MIN_V + (MAX_V - MIN_V) * ramp;
        velocityRef.current += (target - velocityRef.current) * Math.min(1, dt * 8);
        positionRef.current += velocityRef.current * dt;
      } else if (phase === "coasting") {
        velocityRef.current *= Math.pow(FRICTION_PER_SEC, dt);
        positionRef.current += velocityRef.current * dt;
        if (velocityRef.current < SNAP_VELOCITY && snapTargetRef.current === null) {
          const target = Math.ceil(positionRef.current) + 0.5; // land mid-cell for a clean read
          snapTargetRef.current = target;
          snapStartedAtRef.current = ts;
          snapStartPosRef.current = positionRef.current;
        }
        if (snapTargetRef.current !== null) {
          const elapsed = ts - snapStartedAtRef.current;
          const t = Math.min(1, elapsed / SNAP_DURATION);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - t, 3);
          positionRef.current = snapStartPosRef.current
            + (snapTargetRef.current - snapStartPosRef.current) * eased;
          velocityRef.current = 0;
          if (t >= 1) {
            const finalIdx = Math.floor(snapTargetRef.current);
            finalize(finalIdx);
            return; // stop the loop; a fresh effect will re-start it on "spin again"
          }
        }
      }

      const idx = ((Math.floor(positionRef.current) % deckLen) + deckLen) % deckLen;
      setDisplayIndex(idx);
      const moving = phase === "spinning" || phase === "coasting";
      setBlurAmt(moving ? Math.min(2, velocityRef.current * 0.12) : 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [deckLen, finalize, phase]); // re-arm loop when phase returns to idle after spin-again

  const startSpin = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    // Reshuffle on each user spin so a short hold doesn't always favor the same hero.
    setDeck((prev) => shuffle(prev));
    if (reducedMotionRef.current) {
      const pick = Math.floor(Math.random() * deckLen);
      finalize(pick);
      return;
    }
    holdStartedAtRef.current = performance.now();
    velocityRef.current = MIN_V * 0.4;
    snapTargetRef.current = null;
    setPhaseBoth("spinning");
  }, [deckLen, finalize, setPhaseBoth]);

  const releaseSpin = useCallback(() => {
    if (phaseRef.current !== "spinning") return;
    const held = performance.now() - holdStartedAtRef.current;
    if (held < MIN_HOLD) {
      // Too short — refuse the spin, go back to idle.
      velocityRef.current = 0;
      setPhaseBoth("idle");
      return;
    }
    setPhaseBoth("coasting");
  }, [setPhaseBoth]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    pointerIdRef.current = e.pointerId;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    startSpin();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerIdRef.current !== null) {
      try { e.currentTarget.releasePointerCapture(pointerIdRef.current); } catch {}
      pointerIdRef.current = null;
    }
    releaseSpin();
  };
  const onPointerCancel = onPointerUp;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code !== "Space" || e.repeat) return;
    e.preventDefault();
    startSpin();
  };
  const onKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code !== "Space") return;
    e.preventDefault();
    releaseSpin();
  };

  const onSpinAgain = useCallback(() => {
    setWinner(null);
    positionRef.current = 0;
    velocityRef.current = 0;
    snapTargetRef.current = null;
    setDeck(shuffle(candidates));
    setDisplayIndex(0);
    setPhaseBoth("idle");
  }, [candidates, setPhaseBoth]);

  // Aria-live message
  const liveMessage = useMemo(() => {
    if (phase === "spinning") return "Spinning…";
    if (phase === "won" && winner) return `Picked: ${winner.heroName}, ${winner.storyTitle}`;
    return "";
  }, [phase, winner]);

  if (deckLen === 0) {
    return <p style={{ color: "var(--text-muted)" }}>No stories yet.</p>;
  }

  if (phase === "won" && winner) {
    return <SurpriseWinner candidate={winner} onSpinAgain={onSpinAgain} />;
  }

  const current = deck[displayIndex];
  const spinning = phase === "spinning";
  const coasting = phase === "coasting";
  const moving = spinning || coasting;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {/* Viewport strip */}
      <div
        aria-hidden={moving}
        style={{
          width: "100%",
          maxWidth: 420,
          height: 96,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "12px 20px",
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          backdropFilter: "blur(12px)",
          overflow: "hidden",
          filter: blurAmt > 0 ? `blur(${blurAmt}px)` : undefined,
          transition: "filter 120ms linear",
        }}
      >
        <div style={{ fontSize: 32, lineHeight: 1 }}>{current.heroEmoji}</div>
        <div style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-muted)",
          fontWeight: 700,
        }}>
          {current.heroName}
        </div>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--text-primary)",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {current.storyTitle}
        </div>
      </div>

      {/* HOLD ME button */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={(e) => { if (pointerIdRef.current !== null) onPointerUp(e); }}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        disabled={phase === "coasting"}
        aria-label={spinning ? "Release to pick" : "Press and hold to spin"}
        style={{
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid var(--border-hover)",
          background: "radial-gradient(circle at 30% 30%, var(--av-accent), var(--marvel-accent) 55%, var(--dc-accent))",
          color: "#0a0a14",
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: phase === "coasting" ? "not-allowed" : "pointer",
          touchAction: "none",
          userSelect: "none",
          boxShadow: spinning
            ? "0 0 80px var(--av-glow), 0 0 40px var(--marvel-glow), inset 0 0 30px rgba(255,255,255,0.2)"
            : "0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.15)",
          transform: spinning ? "scale(0.96)" : "scale(1)",
          transition: "transform 140ms cubic-bezier(0.23,1,0.32,1), box-shadow 180ms ease",
          animation: phase === "idle" ? "surprisePulse 2.4s ease-in-out infinite" : undefined,
        }}
      >
        {spinning ? "RELEASE" : coasting ? "…" : "HOLD ME"}
      </button>

      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, minHeight: 18 }}>
        {phase === "idle" && "Tap and hold — or press Space."}
        {spinning && "Holding… let go to pick."}
        {coasting && "Coming to a stop…"}
      </p>

      <span aria-live="polite" role="status" style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}>
        {liveMessage}
      </span>

      <style>{`
        @keyframes surprisePulse {
          0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.15); }
          50%      { box-shadow: 0 20px 80px rgba(255,217,0,0.35), 0 0 40px rgba(255,60,92,0.25), inset 0 0 30px rgba(255,255,255,0.2); }
        }
      `}</style>
    </div>
  );
}
