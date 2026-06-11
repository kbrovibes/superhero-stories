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
    avatarFormat?: "webp" | "svg";
    href?: string;       // override link (used by ensembles)
    avatarSrc?: string;  // override avatar image path (used by ensembles)
    kicker?: string;     // override the small label under the name
  };
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = THEME[hero.universe];
  const href =
    hero.href ??
    (hero.universe === "avengers" ? "/avengers" :
     hero.universe === "thanos"   ? "/thanos"   :
     `/${hero.universe}/${hero.id}`);

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
            borderRadius: "20px 6px 20px 6px",
            padding: "10px 10px 14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
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
            width: 68,
            height: 68,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${theme.accent}66`,
            boxShadow: hovered
              ? `0 0 0 3px ${theme.accent}33, 0 8px 24px ${theme.accent}55`
              : `0 0 0 1px ${theme.accent}22, 0 3px 10px rgba(0,0,0,0.5)`,
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            zIndex: 2,
            background: "#0a0a14",
            position: "relative",
          }}>
            <img
              src={hero.avatarSrc ?? (hero.universe === "avengers"
                ? `/avatars/avengers/avengers.${hero.avatarFormat ?? "webp"}`
                : `/avatars/${hero.universe}/${hero.id}.${hero.avatarFormat ?? "webp"}`)}
              alt={hero.name}
              width={68}
              height={68}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* inner vignette so cartoon edges melt into the dark card */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "radial-gradient(circle, transparent 55%, rgba(5,5,8,0.55) 100%)",
              pointerEvents: "none",
            }} />
          </div>
          
          <div style={{ 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 2
          }}>
            <span style={{
              fontSize: 11,
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
              {hero.kicker ?? hero.universe}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
