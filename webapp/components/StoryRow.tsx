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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="liquid-card"
          style={{
            aspectRatio: "1 / 1",
            borderRadius: "16px 32px 16px 32px",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Liquid Blob Background */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: hovered ? 1.5 : 0, 
              opacity: hovered ? 0.15 : 0,
              rotate: hovered ? -180 : 0
            }}
            transition={{ duration: 0.8, ease: "circOut" }}
            style={{
              position: "absolute",
              width: "150%",
              height: "150%",
              background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`,
              filter: "blur(40px)",
              zIndex: 1,
              pointerEvents: "none"
            }}
          />

          <div style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.accent,
            opacity: 0.3,
            lineHeight: 1,
            zIndex: 2,
            transition: "opacity 0.3s ease"
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
              fontSize: 13, 
              fontWeight: 800, 
              color: "#fff", 
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1.1
            }}>
              {title}
            </span>
            <span style={{ 
              fontSize: 7.5, 
              fontWeight: 600, 
              color: "var(--text-secondary)", 
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0.8
            }}>
              {storyTheme}
            </span>
          </div>
          
          <motion.span 
            animate={{ 
              opacity: hovered ? 1 : 0,
              x: hovered ? 0 : -10
            }}
            style={{
              position: "absolute",
              bottom: 12,
              color: theme.accent,
              fontSize: 18,
              fontWeight: 800,
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
