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
    universe: "marvel" | "dc" | "avengers" | "thanos";
  };
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = THEME[hero.universe];
  const href =
    hero.universe === "avengers" ? "/avengers" :
    hero.universe === "thanos"   ? "/thanos"   :
    `/${hero.universe}/${hero.id}`;

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
            borderRadius: "24px 8px 24px 8px",
            padding: "14px 12px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Liquid Blob Background (Animated on hover) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: hovered ? 1.5 : 0, 
              opacity: hovered ? 0.2 : 0,
              rotate: hovered ? 180 : 0
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
            fontSize: 48, 
            filter: hovered ? `drop-shadow(0 0 15px ${theme.accent}88)` : "none",
            transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            zIndex: 2
          }}>
            {hero.emoji}
          </div>
          
          <div style={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 2
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1.15,
              transition: "all 0.3s ease",
              textShadow: "0 1px 3px rgba(0,0,0,0.45)"
            }}>
              {hero.name}
            </span>
            <span style={{ 
              fontSize: 8.5, 
              fontWeight: 700, 
              color: theme.accent, 
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              opacity: hovered ? 1 : 0.9,
              transition: "opacity 0.3s ease",
              textShadow: `0 0 10px ${theme.accent}44`
            }}>
              {hero.universe}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
