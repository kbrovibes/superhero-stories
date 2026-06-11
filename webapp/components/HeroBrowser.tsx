"use client";

import { useEffect, useMemo, useState } from "react";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";
import { getPopular } from "@/lib/popularity";

export type CardEntry = {
  id: string;
  name: string;
  emoji: string;
  universe: "marvel" | "dc" | "avengers" | "thanos";
  avatarFormat?: "webp" | "svg";
  href?: string;
  avatarSrc?: string;
  kicker?: string;
};

export type Section = { label: string; entries: CardEntry[] };

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function matches(entry: CardEntry, q: string): boolean {
  if (!q) return true;
  const needle = normalize(q);
  return normalize(entry.name).includes(needle) || normalize(entry.id).includes(needle);
}

export default function HeroBrowser({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const [popularIds, setPopularIds] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setPopularIds(getPopular(6));
    refresh();
    window.addEventListener("hero-popularity-changed", refresh);
    return () => window.removeEventListener("hero-popularity-changed", refresh);
  }, []);

  const allEntries = useMemo(
    () => sections.flatMap((s) => s.entries),
    [sections],
  );

  const popularSection: Section | null = useMemo(() => {
    if (!popularIds.length) return null;
    const byId = new Map(allEntries.map((e) => [e.id, e]));
    const entries = popularIds.map((id) => byId.get(id)).filter(Boolean) as CardEntry[];
    return entries.length ? { label: "POPULAR · YOUR FAVORITES", entries } : null;
  }, [popularIds, allEntries]);

  const visibleSections = popularSection && !query ? [popularSection, ...sections] : sections;

  const filtered = useMemo(
    () =>
      visibleSections
        .map((s) => ({ ...s, entries: s.entries.filter((e) => matches(e, query)) }))
        .filter((s) => s.entries.length > 0),
    [visibleSections, query],
  );

  const totalMatches = filtered.reduce((n, s) => n + s.entries.length, 0);

  return (
    <>
      <div style={{ marginBottom: 36, position: "relative" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name…"
          aria-label="Search heroes and villains"
          autoComplete="off"
          spellCheck={false}
          className="hero-search-input"
          style={{
            width: "100%",
            padding: "10px 36px 10px 0",
            border: "none",
            borderBottom: "2px solid var(--border)",
            borderRadius: 0,
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: query ? 32 : 22,
            fontFamily: "inherit",
            fontWeight: query ? 700 : 500,
            letterSpacing: query ? "-0.01em" : "0",
            lineHeight: 1.3,
            outline: "none",
            transition: "font-size 0.18s ease, font-weight 0.18s ease, border-color 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor = "var(--thanos-accent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor = "var(--border)";
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 22,
              cursor: "pointer",
              padding: "8px 12px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--text-muted)",
            fontSize: 14,
          }}
        >
          No characters match <strong style={{ color: "var(--text-secondary)" }}>{query}</strong>.
        </div>
      ) : (
        filtered.map((s) => (
          <UniverseSection key={s.label} label={s.label} count={s.entries.length}>
            {s.entries.map((hero, index) => (
              <div
                key={hero.id}
                style={{
                  animationDelay: query ? "0ms" : `${index * 40}ms`,
                  animationName: "fadeIn",
                  animationDuration: "0.4s",
                  animationFillMode: "both",
                }}
              >
                <HeroCard hero={hero} />
              </div>
            ))}
          </UniverseSection>
        ))
      )}

      {query && totalMatches > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 16,
          }}
        >
          {totalMatches} match{totalMatches === 1 ? "" : "es"} for “{query}”
        </p>
      )}
    </>
  );
}
