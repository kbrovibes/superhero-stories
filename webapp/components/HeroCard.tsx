"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { THEME } from "@/lib/theme";
import { loadTileTheme, type TileTheme } from "@/lib/tile-theme";

type Universe = "marvel" | "dc" | "avengers" | "thanos";

interface Hero {
  id: string;
  name: string;
  emoji: string;
  universe: Universe;
  avatarFormat?: "webp" | "svg";
  href?: string;
  avatarSrc?: string;
  kicker?: string;
}

interface HeroCardProps { hero: Hero }

function resolveHref(hero: Hero): string {
  return hero.href ?? (
    hero.universe === "avengers" ? "/avengers" :
    hero.universe === "thanos"   ? "/thanos"   :
    `/${hero.universe}/${hero.id}`
  );
}

function resolveAvatar(hero: Hero): string {
  return hero.avatarSrc ?? (
    hero.universe === "avengers"
      ? `/avatars/avengers/avengers.${hero.avatarFormat ?? "webp"}`
      : `/avatars/${hero.universe}/${hero.id}.${hero.avatarFormat ?? "webp"}`
  );
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [tileTheme, setTileTheme] = useState<TileTheme>("dark-gradient");
  useEffect(() => {
    setTileTheme(loadTileTheme());
    const h = () => setTileTheme(loadTileTheme());
    window.addEventListener("tile-theme-changed", h);
    return () => window.removeEventListener("tile-theme-changed", h);
  }, []);

  switch (tileTheme) {
    case "polaroid":      return <PolaroidCard hero={hero} />;
    case "comic-panel":   return <ComicCard hero={hero} />;
    case "minimal-glass": return <GlassCard hero={hero} />;
    case "sticker":       return <StickerCard hero={hero} />;
    default:              return <DarkGradientCard hero={hero} />;
  }
}

/* ── Variant 1: Dark Gradient (default, original) ─────────────────── */
function DarkGradientCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = THEME[hero.universe];
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link href={resolveHref(hero)} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="liquid-card"
          style={{
            aspectRatio: "1 / 1",
            borderRadius: "20px 6px 20px 6px",
            padding: "10px 10px 14px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 2, cursor: "pointer", position: "relative", overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: hovered ? 1.5 : 0, opacity: hovered ? 0.2 : 0, rotate: hovered ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            style={{ position: "absolute", width: "150%", height: "150%", background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`, filter: "blur(40px)", zIndex: 1, pointerEvents: "none" }}
          />
          <div style={{
            width: 68, height: 68, borderRadius: "50%", overflow: "hidden",
            border: `2px solid ${theme.accent}66`,
            boxShadow: hovered ? `0 0 0 3px ${theme.accent}33, 0 8px 24px ${theme.accent}55` : `0 0 0 1px ${theme.accent}22, 0 3px 10px rgba(0,0,0,0.5)`,
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            zIndex: 2, background: "#0a0a14", position: "relative",
          }}>
            <img src={resolveAvatar(hero)} alt={hero.name} width={68} height={68} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, transparent 55%, rgba(5,5,8,0.55) 100%)", pointerEvents: "none" }} />
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 2, zIndex: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.15, transition: "all 0.3s ease", textShadow: "0 1px 3px rgba(0,0,0,0.45)" }}>{hero.name}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: theme.accent, textTransform: "uppercase", letterSpacing: "0.15em", opacity: hovered ? 1 : 0.9, transition: "opacity 0.3s ease", textShadow: `0 0 10px ${theme.accent}44` }}>
              {hero.kicker ?? hero.universe}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Variant 2: Polaroid ─────────────────────────────────────────── */
function PolaroidCard({ hero }: HeroCardProps) {
  const isDc = hero.universe === "dc";
  return (
    <Link href={resolveHref(hero)} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        whileHover={{ rotate: 0, scale: 1.05 }}
        initial={{ rotate: (hero.id.charCodeAt(0) % 2 === 0 ? -1.5 : 1.5) }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          background: "#ffffff",
          padding: "6px 6px 10px",
          borderRadius: 4,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.08)",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div style={{
          aspectRatio: "1/1",
          borderRadius: 2,
          overflow: "hidden",
          background: isDc
            ? "linear-gradient(135deg, #d3f3fa 0%, #f5f5f8 100%)"
            : "linear-gradient(135deg, #fde2e7 0%, #f5f5f8 100%)",
          marginBottom: 6,
        }}>
          <img src={resolveAvatar(hero)} alt={hero.name} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ fontFamily: "'Caveat', 'Marker Felt', cursive", fontSize: 14, fontWeight: 500, color: "#2a2a2a", lineHeight: 1.05 }}>
          {hero.name}
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Variant 3: Comic Panel ───────────────────────────────────────── */
function ComicCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const isDc = hero.universe === "dc";
  const stripBg = isDc ? "var(--dc-accent)" : "var(--marvel-accent)";
  const stripFg = isDc ? "#0a0a14" : "#fff";
  return (
    <Link href={resolveHref(hero)} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          aspectRatio: "1/1",
          borderRadius: 10,
          overflow: "hidden",
          background: "#fff",
          border: "3px solid #1a1a1a",
          boxShadow: hovered ? "6px 6px 0 #1a1a1a" : "4px 4px 0 #1a1a1a",
          transform: hovered ? "translate(-2px,-2px)" : "translate(0,0)",
          transition: "transform 0.12s ease-out, box-shadow 0.12s ease-out",
          cursor: "pointer",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{
          flex: 1, position: "relative", overflow: "hidden",
          background: isDc
            ? `radial-gradient(circle at 30% 30%, #fff 30%, transparent 31%) 0 0 / 6px 6px, linear-gradient(135deg, #d3f3fa 0%, #b8edf8 100%)`
            : `radial-gradient(circle at 30% 30%, #fff 30%, transparent 31%) 0 0 / 6px 6px, linear-gradient(135deg, #ffe0e6 0%, #ffd1d9 100%)`,
        }}>
          <img src={resolveAvatar(hero)} alt={hero.name} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
        </div>
        <div style={{
          background: stripBg, color: stripFg,
          fontWeight: 900, fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.06em",
          padding: "5px 4px", textAlign: "center",
          borderTop: "3px solid #1a1a1a",
          textShadow: isDc ? "1px 1px 0 rgba(255,255,255,0.4)" : "1px 1px 0 #1a1a1a",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {hero.name}
        </div>
      </div>
    </Link>
  );
}

/* ── Variant 4: Minimal Glass ─────────────────────────────────────── */
function GlassCard({ hero }: HeroCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={resolveHref(hero)} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          aspectRatio: "1/1",
          borderRadius: 14,
          background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: hovered ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
          padding: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 6, cursor: "pointer",
          transition: "all 0.25s",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
          <img src={resolveAvatar(hero)} alt={hero.name} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.95)", textAlign: "center", lineHeight: 1.15, letterSpacing: "0.02em" }}>
          {hero.name}
        </div>
      </div>
    </Link>
  );
}

/* ── Variant 5: Sticker ───────────────────────────────────────────── */
function StickerCard({ hero }: HeroCardProps) {
  return (
    <Link href={resolveHref(hero)} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        whileHover={{ y: -4, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        style={{
          aspectRatio: "1/1",
          position: "relative",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "78%", aspectRatio: "1/1",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#fff",
          border: "3px solid #fff",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.08)",
        }}>
          <img src={resolveAvatar(hero)} alt={hero.name} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
        </div>
        <div style={{
          marginTop: "auto", background: "#0a0a14", color: "#fff",
          fontSize: 9, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.06em",
          padding: "5px 9px", borderRadius: 999,
          boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
          transform: "translateY(2px)",
          position: "relative", zIndex: 2,
          whiteSpace: "nowrap", maxWidth: "100%",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {hero.name}
        </div>
      </motion.div>
    </Link>
  );
}
