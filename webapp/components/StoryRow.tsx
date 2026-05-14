"use client";
import Link from "next/link";
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
  const accent = THEME[universe].accent;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "16px 12px",
          borderBottom: "1px solid var(--border)",
          background: hovered ? "var(--surface)" : "transparent",
          borderLeft: hovered ? `3px solid ${accent}` : "3px solid transparent",
          transition: "all 0.15s ease",
          cursor: "pointer",
        }}
      >
        <span style={{
          fontSize: 32,
          fontWeight: 800,
          color: accent,
          opacity: 0.3,
          minWidth: 48,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{storyTheme}</div>
        </div>
        <span style={{
          color: hovered ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: 20,
          transition: "color 0.15s ease",
        }}>→</span>
      </div>
    </Link>
  );
}
