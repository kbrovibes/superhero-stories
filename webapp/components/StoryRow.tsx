"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { THEME } from "@/lib/theme";

interface StoryRowProps {
  title: string;
  storyTheme: string;
  index: number;
  href: string;
  universe: "marvel" | "dc" | "avengers";
}

export default function StoryRow({ title, storyTheme, index, href, universe }: StoryRowProps) {
  const [hovered, setHovered] = useState(false);
  const theme = THEME[universe];

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateZ: hovered ? 1 : 0 }}
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
            boxShadow: hovered ? `0 0 20px ${theme.glow}` : "none",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
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
            fontSize: 28,
            fontWeight: 900,
            color: theme.accent,
            opacity: 0.4,
            lineHeight: 1,
          }}>
            {String(index + 1).padStart(2, "0")}
          </div>

          <div style={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}>
            <span style={{ 
              fontSize: 14, 
              fontWeight: 900, 
              color: "var(--text-primary)", 
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1.1
            }}>
              {title}
            </span>
            <span style={{ 
              fontSize: 8, 
              fontWeight: 600, 
              color: "var(--text-secondary)", 
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              opacity: 0.6
            }}>
              {storyTheme}
            </span>
          </div>
          
          {hovered && (
            <span style={{
              position: "absolute",
              bottom: 12,
              color: theme.accent,
              fontSize: 16,
              fontWeight: 900
            }}>
              →
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
