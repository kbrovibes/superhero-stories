import Link from "next/link";
import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";
import { getAllCandidates, getHeroes } from "@/lib/stories";
import React from "react";

export default function Home() {
  const marvelHeroes = getHeroes("marvel").filter((h) => h.kind === "hero");
  const marvelVillains = getHeroes("marvel").filter((h) => h.kind === "villain");
  const dcHeroes = getHeroes("dc").filter((h) => h.kind === "hero");
  const dcVillains = getHeroes("dc").filter((h) => h.kind === "villain");
  const storyCount = getAllCandidates().length;

  const avengersEntry = {
    id: "avengers",
    name: "The Avengers",
    emoji: "🛡️",
    universe: "avengers" as const,
  };

  const thanosEntry = {
    id: "thanos",
    name: "Thanos",
    emoji: "🟣",
    universe: "thanos" as const,
  };

  type CardEntry = {
    id: string;
    name: string;
    emoji: string;
    universe: "marvel" | "dc" | "avengers" | "thanos";
    avatarFormat?: "webp" | "svg";
  };

  const renderCards = (list: CardEntry[]) =>
    list.map((hero, index) => (
      <div
        key={hero.id}
        style={{
          animationDelay: `${index * 40}ms`,
          animationName: "fadeIn",
          animationDuration: "0.4s",
          animationFillMode: "both",
        }}
      >
        <HeroCard hero={hero} />
      </div>
    ));

  return (
    <>
      <NavBar crumbs={[]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 className="liquid-text" style={{ margin: 0, lineHeight: 0.88, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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

        <UniverseSection label="ENSEMBLE" count={1}>
          {renderCards([avengersEntry])}
        </UniverseSection>

        <UniverseSection label="MARVEL · HEROES" count={marvelHeroes.length}>
          {renderCards(marvelHeroes)}
        </UniverseSection>

        {(marvelVillains.length > 0) && (
          <UniverseSection label="MARVEL · VILLAINS" count={marvelVillains.length + 1}>
            {renderCards([...marvelVillains, thanosEntry])}
          </UniverseSection>
        )}

        <UniverseSection label="DC · HEROES" count={dcHeroes.length}>
          {renderCards(dcHeroes)}
        </UniverseSection>

        {(dcVillains.length > 0) && (
          <UniverseSection label="DC · VILLAINS" count={dcVillains.length}>
            {renderCards(dcVillains)}
          </UniverseSection>
        )}
      </main>
    </>
  );
}
