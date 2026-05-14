"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Candidate } from "@/lib/stories";
import { THEME } from "@/lib/theme";

interface SurpriseWinnerProps {
  candidate: Candidate;
  onSpinAgain: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;     // horizontal offset percent
  rot: number;   // rotation degrees
  dur: number;   // seconds
  delay: number; // seconds
  hue: string;
}

const CONFETTI_COUNT = 32;
const CONFETTI_TTL_MS = 1400;

// Generated once at module load. Visual randomness, not security-sensitive.
const CONFETTI_PIECES: ConfettiPiece[] = (() => {
  const palette = ["var(--marvel-accent)", "var(--dc-accent)", "var(--av-accent)"];
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    rot: Math.random() * 720 - 360,
    dur: 0.9 + Math.random() * 0.7,
    delay: Math.random() * 0.25,
    hue: palette[i % palette.length],
  }));
})();

export default function SurpriseWinner({ candidate, onSpinAgain }: SurpriseWinnerProps) {
  const theme = THEME[candidate.universe];
  const universeLabel = candidate.universe.toUpperCase();

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), CONFETTI_TTL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {showConfetti && (
        <div aria-hidden style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}>
          {CONFETTI_PIECES.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                left: "50%",
                top: 40,
                width: 8,
                height: 14,
                borderRadius: 2,
                background: p.hue,
                transform: "translate(-50%, 0)",
                animation: `surpriseConfetti ${p.dur}s ease-out ${p.delay}s forwards`,
                ["--x" as never]: `${p.x}vw`,
                ["--rot" as never]: `${p.rot}deg`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        style={{ fontSize: 96, lineHeight: 1 }}
      >
        {candidate.heroEmoji}
      </motion.div>

      <motion.span
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: 999,
          background: theme.accent,
          color: "#0a0a14",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {universeLabel}
      </motion.span>

      <motion.h2
        className="liquid-text"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        style={{
          fontSize: 30,
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        {candidate.heroName}
      </motion.h2>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.35 }}
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "var(--text-secondary)",
          margin: 0,
          textAlign: "center",
        }}
      >
        {candidate.storyTitle}
      </motion.p>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch", width: "100%", maxWidth: 320, marginTop: 8 }}
      >
        <Link
          href={candidate.href}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "14px 24px",
            borderRadius: 999,
            background: theme.accent,
            color: "#0a0a14",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.04em",
            textDecoration: "none",
          }}
        >
          Read this story →
        </Link>
        <button
          type="button"
          onClick={onSpinAgain}
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Spin again
        </button>
      </motion.div>

      <style>{`
        @keyframes surpriseConfetti {
          0%   { transform: translate(-50%, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--x)), 60vh) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
