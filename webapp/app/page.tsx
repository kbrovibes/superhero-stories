import Link from "next/link";
import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";
import { getAllCandidates, getHeroes } from "@/lib/stories";
import React from "react";

export default function Home() {
  const marvelHeroes = getHeroes("marvel");
  const dcHeroes = getHeroes("dc");
  const storyCount = getAllCandidates().length;

  const avengersEntry = {
    id: "avengers",
    name: "The Avengers",
    emoji: "🛡️",
    universe: "avengers" as const,
  };

  return (
    <>
      <NavBar crumbs={[]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <h1 className="liquid-text" style={{ 
            fontSize: 48, 
            fontWeight: 900, 
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 0.85
          }}>
            Superhero<br />Stories
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

          <Link
            href="/surprise"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 28,
              padding: "12px 24px",
              borderRadius: 999,
              background: "radial-gradient(circle at 30% 30%, var(--av-accent), var(--marvel-accent) 70%, var(--dc-accent))",
              color: "#0a0a14",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 12px 32px rgba(255,217,0,0.18), 0 6px 16px rgba(255,60,92,0.18)",
            }}
          >
            <span>✦</span>
            Surprise Me!
          </Link>
        </div>

        <UniverseSection label="AVENGERS" count={1}>
          <div style={{
            animationDelay: "0ms",
            animationName: "fadeIn",
            animationDuration: "0.4s",
            animationFillMode: "both",
          }}>
            <HeroCard hero={avengersEntry} />
          </div>
        </UniverseSection>

        <UniverseSection label="MARVEL" count={marvelHeroes.length}>
          {marvelHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 40}ms`,
              animationName: "fadeIn",
              animationDuration: "0.4s",
              animationFillMode: "both",
            }}>
              <HeroCard hero={hero} />
            </div>
          ))}
        </UniverseSection>

        <UniverseSection label="DC" count={dcHeroes.length}>
          {dcHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 40}ms`,
              animationName: "fadeIn",
              animationDuration: "0.4s",
              animationFillMode: "both",
            }}>
              <HeroCard hero={hero} />
            </div>
          ))}
        </UniverseSection>
      </main>
    </>
  );
}
