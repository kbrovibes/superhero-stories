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
      whileHover={{ scale: 1.05, rotateZ: hovered ? -1 : 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="spider-glitch"
          style={{
            aspectRatio: "1 / 1",
            background: hovered ? "var(--surface-raised)" : "var(--surface)",
            border: `1px solid ${hovered ? theme.accent : "var(--border)"}`,
            boxShadow: hovered ? `0 0 30px ${theme.glow}` : "none",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Halftone Overlay on Hover */}
          {hovered && (
            <div 
              className="halftone" 
              style={{ 
                position: "absolute", 
                inset: 0, 
                color: theme.accent,
                opacity: 0.15 
              }} 
            />
          )}

          <div style={{ 
            fontSize: 84, 
            filter: hovered ? `drop-shadow(0 0 10px ${theme.accent})` : "none",
            transition: "all 0.3s ease"
          }}>
            {hero.emoji}
          </div>
          
          <div style={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>
            <span style={{ 
              fontSize: 18, 
              fontWeight: 900, 
              color: "var(--text-primary)", 
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1
            }}>
              {hero.name}
            </span>
            <span style={{ 
              fontSize: 10, 
              fontWeight: 600, 
              color: theme.accent, 
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              opacity: hovered ? 1 : 0.6
            }}>
              {hero.universe}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
