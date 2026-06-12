"use client";

import { useEffect, useMemo, useState } from "react";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";
import { clearPopularity, getPopular } from "@/lib/popularity";

const POPULAR_LABEL = "POPULAR · YOUR FAVORITES";

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
    return entries.length ? { label: POPULAR_LABEL, entries } : null;
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
      <div className="hero-search-shell" style={{ marginBottom: 40, position: "relative" }}>
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
            padding: query ? "18px 56px 18px 22px" : "16px 56px 16px 22px",
            border: "1px solid var(--border)",
            borderRadius: 18,
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "var(--text-primary)",
            fontSize: query ? 36 : 26,
            fontFamily: "inherit",
            fontWeight: query ? 700 : 500,
            letterSpacing: query ? "-0.01em" : "0",
            lineHeight: 1.25,
            outline: "none",
            boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
            transition: "font-size 0.18s ease, font-weight 0.18s ease, border-color 0.2s, box-shadow 0.2s, padding 0.18s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--thanos-accent)";
            e.currentTarget.style.boxShadow = "0 0 0 4px rgba(162,107,255,0.18), 0 1px 0 rgba(255,255,255,0.04) inset";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.04) inset";
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--border-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
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
        filtered.map((s) => {
          const isPopular = s.label === POPULAR_LABEL;
          return (
            <UniverseSection
              key={s.label}
              label={s.label}
              count={s.entries.length}
              action={
                isPopular ? (
                  <button
                    onClick={() => clearPopularity()}
                    aria-label="Clear popularity history"
                    style={{
                      marginLeft: 4,
                      padding: "2px 10px",
                      border: "1px solid var(--border)",
                      borderRadius: 999,
                      background: "transparent",
                      color: "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "color 0.18s, border-color 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--marvel-accent)";
                      e.currentTarget.style.borderColor = "var(--marvel-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    Clear
                  </button>
                ) : undefined
              }
            >
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
          );
        })
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
