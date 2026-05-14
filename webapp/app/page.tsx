import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import UniverseSection from "@/components/UniverseSection";
import { getHeroes } from "@/lib/stories";
import React from "react";

export default function Home() {
  const marvelHeroes = getHeroes("marvel");
  const dcHeroes = getHeroes("dc");

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
            108 canonical narratives for young heroes.
          </p>
        </div>

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
      </main>
    </>
  );
}
