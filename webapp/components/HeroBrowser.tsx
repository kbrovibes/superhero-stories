"use client";

import { useMemo, useState } from "react";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";

export type CardEntry = {
  id: string;
  name: string;
  emoji: string;
  universe: "marvel" | "dc" | "avengers" | "thanos";
  avatarFormat?: "webp" | "svg";
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

  const filtered = useMemo(
    () =>
      sections
        .map((s) => ({ ...s, entries: s.entries.filter((e) => matches(e, query)) }))
        .filter((s) => s.entries.length > 0),
    [sections, query],
  );

  const totalMatches = filtered.reduce((n, s) => n + s.entries.length, 0);

  return (
    <>
      <div style={{ marginBottom: 32, position: "relative" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search heroes & villains…"
          aria-label="Search heroes and villains"
          autoComplete="off"
          spellCheck={false}
          style={{
            width: "100%",
            padding: "12px 16px 12px 42px",
            borderRadius: 14,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontSize: 15,
            fontFamily: "inherit",
            fontWeight: 500,
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-hover)";
            e.currentTarget.style.background = "var(--surface-raised)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--surface)";
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 16,
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          ⌕
        </span>
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 18,
              cursor: "pointer",
              padding: "6px 10px",
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
