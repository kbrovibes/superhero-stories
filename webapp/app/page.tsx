import Link from "next/link";
import NavBar from "@/components/NavBar";
import HeroBrowser, { type CardEntry, type Section } from "@/components/HeroBrowser";
import { getAllCandidates, getHeroes, ENSEMBLES, ensembleHasStories } from "@/lib/stories";
import React from "react";

export default function Home() {
  const marvelHeroes = getHeroes("marvel").filter((h) => h.kind === "hero");
  const marvelVillains = getHeroes("marvel").filter((h) => h.kind === "villain");
  const dcHeroes = getHeroes("dc").filter((h) => h.kind === "hero");
  const dcVillains = getHeroes("dc").filter((h) => h.kind === "villain");
  const storyCount = getAllCandidates().length;

  const thanosEntry = {
    id: "thanos",
    name: "Thanos",
    emoji: "🟣",
    universe: "thanos" as const,
  };

  // Ensembles: Avengers always shows; the rest appear once their stories exist.
  const ensembleEntries: CardEntry[] = ENSEMBLES.filter(
    (e) => e.id === "avengers" || ensembleHasStories(e.id),
  ).map((e) => ({
    id: e.id,
    name: e.name,
    emoji: e.emoji,
    universe: "avengers" as const,
    href: e.route,
    avatarSrc: e.id === "avengers" ? "/avatars/avengers/avengers.webp" : `/avatars/teams/${e.id}.svg`,
    kicker: "ENSEMBLE",
  }));

  const sections: Section[] = [
    { label: "ENSEMBLE", entries: ensembleEntries },
    { label: "MARVEL · HEROES", entries: marvelHeroes },
    ...(marvelVillains.length > 0
      ? [{ label: "MARVEL · VILLAINS", entries: [...marvelVillains, thanosEntry] as CardEntry[] }]
      : []),
    { label: "DC · HEROES", entries: dcHeroes },
    ...(dcVillains.length > 0
      ? [{ label: "DC · VILLAINS", entries: dcVillains as CardEntry[] }]
      : []),
  ];

  return (
    <>
      <NavBar crumbs={[]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 className="liquid-text" style={{ margin: 0, lineHeight: 0.88, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 52, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", display: "block" }}>Superhero</span>
            <span style={{ fontSize: 74, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", display: "block" }}>Stories</span>
          </h1>
          <p style={{ 
            fontSize: 14, 
            color: "var(--text-secondary)", 
            marginTop: 16,
            maxWidth: 400,
            marginInline: "auto",
            lineHeight: 1.5,
            opacity: 0.7
          }}>
            {storyCount} canonical narratives for young heroes.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "center", flexWrap: "wrap", width: "100%", maxWidth: 380, marginInline: "auto" }}>
            <Link
              href="/surprise"
              aria-label="Surprise Me — pick a random story"
              className="surprise-cta"
              style={{
                flex: 1,
                minWidth: 148,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 999,
                background: "radial-gradient(circle at 30% 30%, var(--av-accent), var(--marvel-accent) 70%, var(--dc-accent))",
                color: "#0a0a14",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 12px 32px rgba(255,217,0,0.18), 0 6px 16px rgba(255,60,92,0.18)",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <span>Surprise Me!</span>
            </Link>
            <Link
              href="/quiz"
              aria-label="Quiz Me — test your hero knowledge"
              style={{
                flex: 1,
                minWidth: 148,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 999,
                background: "radial-gradient(circle at 70% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
                color: "#0a0a14",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 12px 32px rgba(162,107,255,0.22), 0 6px 16px rgba(0,229,255,0.15)",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <span>Quiz Me!</span>
            </Link>
          </div>
        </div>

        <HeroBrowser sections={sections} />
      </main>
    </>
  );
}
