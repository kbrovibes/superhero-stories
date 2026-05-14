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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            aspectRatio: "1 / 1",
            background: hovered ? "#000" : "var(--surface)",
            border: `1px solid ${hovered ? "transparent" : "var(--border)"}`,
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.3s ease, border-color 0.3s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Fluid Path SVG Border */}
          <svg 
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.rect
              x="1"
              y="1"
              width="98"
              height="98"
              rx="12"
              fill="none"
              stroke={theme.accent}
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: hovered ? 1 : 0,
                opacity: hovered ? 1 : 0
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </svg>

          <div style={{
            fontSize: 28,
            fontWeight: 900,
            color: theme.accent,
            opacity: 0.4,
            lineHeight: 1,
            zIndex: 2
          }}>
            {String(index + 1).padStart(2, "0")}
          </div>

          <div style={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 2
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
          
          <motion.span 
            animate={{ 
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 5
            }}
            style={{
              position: "absolute",
              bottom: 12,
              color: theme.accent,
              fontSize: 16,
              fontWeight: 900,
              zIndex: 2
            }}
          >
            →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}
