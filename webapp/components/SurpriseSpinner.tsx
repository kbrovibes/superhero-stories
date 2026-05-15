"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Candidate } from "@/lib/stories";
import SurpriseWinner from "./SurpriseWinner";

type Phase = "idle" | "spinning" | "coasting" | "settled" | "won";

// How long to hold the final candidate visible after the wheel stops, before
// transitioning to the winner reveal. Short enough to stay snappy, long enough
// that the user can read what they landed on.
const SETTLE_MS = 850;

// Physics constants
//
// Spin phase: velocity ramps from 0 toward MAX_V over RAMP_TIME (smoothed).
// Coast phase: constant-deceleration model.
//   distance to stop: d = v0² / (2 * DECEL)
//   time to stop:     t = v0 / DECEL
//   This is the same shape as easeOutQuad(progress) = 1 - (1-progress)².
const MIN_V = 4;             // candidates/sec — velocity floor while held
const MAX_V = 14;            // candidates/sec — top speed at full hold
const RAMP_TIME = 900;       // ms — full ramp from idle to MAX_V
const DECEL = 11;            // candidates/sec² — constant friction during coast
const MIN_RELEASE_V = 7;     // candidates/sec — floor on release velocity so a short
                             // hold still travels enough cells to feel like a spin
const MIN_HOLD = 200;        // ms — taps shorter than this don't count as a spin

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
  // Coast plan — precomputed on release so the wheel decelerates deterministically.
  const coastStartPosRef = useRef(0);
  const coastEndPosRef = useRef(0);
  const coastStartedAtRef = useRef(0);
  const coastDurationRef = useRef(0); // ms
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
        velocityRef.current += (target - velocityRef.current) * Math.min(1, dt * 10);
        positionRef.current += velocityRef.current * dt;
      } else if (phase === "coasting") {
        // Single parametric ease-out from current → target over a velocity-derived
        // duration. easeOutQuad is the time-integral of linear velocity decay, so
        // this is equivalent to constant deceleration — no asymptote, definite stop.
        const elapsed = ts - coastStartedAtRef.current;
        const t = Math.min(1, elapsed / coastDurationRef.current);
        const eased = 1 - (1 - t) * (1 - t); // easeOutQuad
        const span = coastEndPosRef.current - coastStartPosRef.current;
        positionRef.current = coastStartPosRef.current + span * eased;
        velocityRef.current = span * (2 * (1 - t)) / (coastDurationRef.current / 1000);
        if (t >= 1) {
          // Snap to the final cell and enter the "settled" hold. The viewport
          // shows the final candidate clearly, then we transition to the
          // winner reveal after SETTLE_MS so the user has time to read it.
          const n = deckLen;
          const finalIdx = ((Math.floor(coastEndPosRef.current) % n) + n) % n;
          positionRef.current = finalIdx + 0.5;
          velocityRef.current = 0;
          setDisplayIndex(finalIdx);
          setBlurAmt(0);
          setPhaseBoth("settled");
          window.setTimeout(() => {
            // Guard against onSpinAgain or other phase changes during the pause.
            if (phaseRef.current === "settled") finalize(finalIdx);
          }, SETTLE_MS);
          return; // stop the loop; finalize() (or settle-cleanup) will re-arm.
        }
      }

      const idx = ((Math.floor(positionRef.current) % deckLen) + deckLen) % deckLen;
      setDisplayIndex(idx);
      const moving = phase === "spinning" || phase === "coasting";
      // Cap blur lower so the final cells are readable as the wheel slows.
      setBlurAmt(moving ? Math.min(1.2, velocityRef.current * 0.08) : 0);
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
    velocityRef.current = 0; // start from rest — feels like spinning up from a stop
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

    // Plan the coast deterministically from release velocity.
    const v0 = Math.max(velocityRef.current, MIN_RELEASE_V);
    const startPos = positionRef.current;
    const naturalDistance = (v0 * v0) / (2 * DECEL); // kinematics: d = v²/(2a)
    const naturalEnd = startPos + naturalDistance;
    // Snap target to nearest cell *center* (integer + 0.5) so the displayed candidate
    // is the one centered in the viewport when the animation stops.
    // Round to nearest .5 offset from the natural endpoint.
    const targetEnd = Math.round(naturalEnd - 0.5) + 0.5;
    // Recompute duration for the *adjusted* distance, scaled so the visual speed
    // still matches v0 at t=0 (initial slope of easeOutQuad over [0,1] is 2/T).
    const adjustedDistance = targetEnd - startPos;
    const duration = (2 * adjustedDistance / v0) * 1000; // ms; minimum bounded below
    coastStartPosRef.current = startPos;
    coastEndPosRef.current = targetEnd;
    coastStartedAtRef.current = performance.now();
    coastDurationRef.current = Math.max(450, duration);
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
    coastStartedAtRef.current = 0;
    coastDurationRef.current = 0;
    setDeck(shuffle(candidates));
    setDisplayIndex(0);
    setPhaseBoth("idle");
  }, [candidates, setPhaseBoth]);

  // Aria-live message
  const liveMessage = useMemo(() => {
    if (phase === "spinning") return "Spinning…";
    if (phase === "settled" && deck[displayIndex]) return `Landed on ${deck[displayIndex].heroName}, ${deck[displayIndex].storyTitle}`;
    if (phase === "won" && winner) return `Picked: ${winner.heroName}, ${winner.storyTitle}`;
    return "";
  }, [phase, winner, deck, displayIndex]);

  if (deckLen === 0) {
    return <p style={{ color: "var(--text-muted)" }}>No stories yet.</p>;
  }

  if (phase === "won" && winner) {
    return <SurpriseWinner candidate={winner} onSpinAgain={onSpinAgain} />;
  }

  const current = deck[displayIndex];
  const spinning = phase === "spinning";
  const coasting = phase === "coasting";
  const settled  = phase === "settled";
  const moving = spinning || coasting;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {/* Viewport strip */}
      <div
        aria-hidden={moving}
        data-phase={phase}
        className={settled ? "surprise-viewport surprise-viewport--settled" : "surprise-viewport"}
        style={{
          width: "100%",
          maxWidth: 560,
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "20px 24px",
          borderRadius: 20,
          border: settled ? "1px solid var(--av-accent)" : "1px solid var(--border)",
          background: "var(--surface)",
          backdropFilter: "blur(12px)",
          overflow: "hidden",
          filter: blurAmt > 0 ? `blur(${blurAmt}px)` : undefined,
          transition: "filter 120ms linear, border-color 220ms ease, box-shadow 220ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: settled ? "scale(1.04)" : "scale(1)",
          boxShadow: settled
            ? "0 12px 40px rgba(255,217,0,0.28), 0 0 0 4px rgba(255,217,0,0.08)"
            : "none",
        }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.18)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          background: "#0a0a14",
        }}>
          <img
            src={`/avatars/${current.universe}/${current.heroId ?? current.universe}.svg`}
            alt=""
            width={64}
            height={64}
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--text-muted)",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}>
          {current.heroName}
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text-primary)",
          maxWidth: "100%",
          textAlign: "center",
          lineHeight: 1.25,
          wordBreak: "break-word",
        }}>
          {current.storyTitle}
        </div>
      </div>

      {/* HOLD ME button — icon-only, no selectable text for clean mobile press-and-hold */}
      <button
        type="button"
        className="surprise-btn"
        data-phase={phase}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={(e) => { if (pointerIdRef.current !== null) onPointerUp(e); }}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onContextMenu={(e) => e.preventDefault()}
        disabled={phase === "coasting" || phase === "settled"}
        aria-label={spinning ? "Release to pick" : "Press and hold to spin"}
      >
        <span className="surprise-btn-icon" aria-hidden="true">
          {spinning ? (
            // Sparkle burst — spinning state
            <svg viewBox="0 0 64 64" width="84" height="84" fill="currentColor" focusable="false">
              <path d="M32 4 L36 24 L56 28 L36 32 L32 52 L28 32 L8 28 L28 24 Z" />
              <circle cx="14" cy="14" r="3" />
              <circle cx="50" cy="14" r="3" />
              <circle cx="50" cy="50" r="3" />
              <circle cx="14" cy="50" r="3" />
            </svg>
          ) : coasting ? (
            // Three dots — coasting
            <svg viewBox="0 0 64 64" width="84" height="84" fill="currentColor" focusable="false">
              <circle cx="14" cy="32" r="6" />
              <circle cx="32" cy="32" r="6" />
              <circle cx="50" cy="32" r="6" />
            </svg>
          ) : (
            // Magic wand with sparkles — idle state, invites a press to "cast" the surprise
            <svg viewBox="0 0 64 64" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              {/* wand shaft */}
              <path d="M14 50 L46 18" />
              {/* wand tip (filled star burst) */}
              <path d="M46 18 L50 14 M46 18 L42 14 M46 18 L50 22 M46 18 L42 22" />
              {/* sparkles around the tip */}
              <path d="M54 8 L56 4 L58 8 L62 10 L58 12 L56 16 L54 12 L50 10 Z" fill="currentColor" stroke="none" />
              <circle cx="22" cy="14" r="2" fill="currentColor" stroke="none" />
              <circle cx="56" cy="34" r="2.5" fill="currentColor" stroke="none" />
              <circle cx="10" cy="34" r="1.8" fill="currentColor" stroke="none" />
            </svg>
          )}
        </span>
      </button>

      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, minHeight: 18 }}>
        {phase === "idle" && "Tap and hold — or press Space."}
        {spinning && "Holding… let go to pick."}
        {coasting && "Coming to a stop…"}
        {settled && "And the pick is…"}
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
        .surprise-btn {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          border: 1px solid var(--border-hover);
          background: radial-gradient(circle at 30% 30%, var(--av-accent), var(--marvel-accent) 55%, var(--dc-accent));
          color: #0a0a14;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.15);
          transform: scale(1);
          transition: transform 90ms cubic-bezier(0.23,1,0.32,1), box-shadow 90ms ease;
          animation: surprisePulse 2.6s ease-in-out infinite;
          will-change: transform, box-shadow;
        }
        .surprise-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        .surprise-btn-icon svg {
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
        }
        .surprise-btn[data-phase="spinning"] .surprise-btn-icon svg {
          animation: surpriseIconSpin 0.9s linear infinite;
        }
        @keyframes surpriseIconSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .surprise-btn:hover {
          transform: scale(1.04);
          box-shadow:
            0 28px 80px rgba(255,217,0,0.35),
            0 0 60px rgba(255,60,92,0.35),
            0 0 40px rgba(0,229,255,0.25),
            inset 0 0 30px rgba(255,255,255,0.25);
          animation-play-state: paused;
        }
        .surprise-btn:focus-visible {
          outline: 3px solid var(--av-accent);
          outline-offset: 6px;
        }
        .surprise-btn[data-phase="spinning"] {
          transform: scale(0.96);
          box-shadow:
            0 0 100px var(--av-glow),
            0 0 60px var(--marvel-glow),
            0 0 40px var(--dc-glow),
            inset 0 0 30px rgba(255,255,255,0.25);
          animation: none;
          cursor: grabbing;
        }
        .surprise-btn[data-phase="coasting"] {
          transform: scale(0.98);
          box-shadow: 0 16px 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.12);
          animation: none;
          cursor: not-allowed;
          opacity: 0.85;
        }
        @keyframes surprisePulse {
          0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.15); }
          50%      { box-shadow: 0 20px 80px rgba(255,217,0,0.30), 0 0 40px rgba(255,60,92,0.22), inset 0 0 30px rgba(255,255,255,0.20); }
        }
        @media (prefers-reduced-motion: reduce) {
          .surprise-btn { animation: none; transition: none; }
        }
      `}</style>
    </div>
  );
}
