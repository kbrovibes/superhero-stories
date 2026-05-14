"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { THEME } from "@/lib/theme";

interface HeroCardProps {
  hero: {
    id: string;
    name: string;
    emoji: string;
    universe: "marvel" | "dc" | "avengers";
  };
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = THEME[hero.universe];
  const href = hero.universe === "avengers" ? "/avengers" : `/${hero.universe}/${hero.id}`;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered ? "var(--surface-raised)" : "var(--surface)",
            borderLeft: `3px solid ${theme.accent}`,
            boxShadow: hovered
              ? `0 0 0 1px var(--border-hover), 0 8px 24px ${theme.glow}`
              : "0 0 0 1px var(--border)",
            borderRadius: 8,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transition: "background 0.15s ease, box-shadow 0.15s ease",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 40 }}>{hero.emoji}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{hero.name}</span>
        </div>
      </Link>
    </motion.div>
  );
}
