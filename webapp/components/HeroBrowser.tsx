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

function sectionId(label: string): string {
  return "sec-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function accentFor(u: CardEntry["universe"]): string {
  return u === "marvel" ? "var(--marvel-accent)"
    : u === "dc" ? "var(--dc-accent)"
    : u === "thanos" ? "var(--thanos-accent)"
    : "var(--av-accent)";
}

function entryAvatar(e: CardEntry): string {
  if (e.avatarSrc) return e.avatarSrc;
  if (e.universe === "avengers") return `/avatars/avengers/avengers.${e.avatarFormat ?? "webp"}`;
  return `/avatars/${e.universe}/${e.id}.${e.avatarFormat ?? "webp"}`;
}

// Top row of quick-jump tiles, one per section, each using a small collage of
// that section's member avatars as the tile art. Smooth-scrolls to the section.
function QuickJumpNav({ sections }: { sections: Section[] }) {
  function jump(label: string) {
    document.getElementById(sectionId(label))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <nav
      aria-label="Jump to a section"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
        gap: 10,
        marginBottom: 32,
      }}
    >
      {sections.map((s) => {
        const accent = accentFor(s.entries[0]?.universe ?? "avengers");
        const collage = s.entries.slice(0, 3);
        const [main, ...rest] = s.label.split(" · ");
        return (
          <button
            key={s.label}
            onClick={() => jump(s.label)}
            className="quickjump-tile"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 8px 10px",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              cursor: "pointer",
              transition: "border-color 0.18s, transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 22px ${accent}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Group collage */}
            <span style={{ display: "flex", height: 40, alignItems: "center" }}>
              {collage.map((e, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={e.id}
                  src={entryAvatar(e)}
                  alt=""
                  aria-hidden
                  width={40}
                  height={40}
                  loading="lazy"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${accent}`,
                    background: "#0a0a14",
                    marginLeft: i === 0 ? 0 : -14,
                    zIndex: collage.length - i,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  }}
                />
              ))}
            </span>
            <span style={{ textAlign: "center", lineHeight: 1.15 }}>
              <span style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)" }}>
                {main}
              </span>
              {rest.length > 0 && (
                <span style={{ display: "block", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginTop: 1 }}>
                  {rest.join(" · ")}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
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
      {!query && <QuickJumpNav sections={sections} />}

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
              id={sectionId(s.label)}
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
