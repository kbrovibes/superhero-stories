import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import { getHeroes } from "@/lib/stories";
import React from "react";

function UniverseSection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 14, 
          letterSpacing: "0.3em", 
          color: "var(--text-primary)", 
          fontWeight: 900,
          margin: 0,
          textTransform: "uppercase"
        }}>
          {label}
        </h2>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, var(--border), transparent)" }} />
        <span style={{ 
          fontSize: 10, 
          color: "var(--text-muted)", 
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}>
          {count} Units Detected
        </span>
      </div>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
        gap: 24 
      }}>
        {children}
      </div>
    </section>
  );
}

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
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 80, textAlign: "center" }}>
          <h1 className="spider-glitch" style={{ 
            fontSize: 64, 
            fontWeight: 900, 
            color: "var(--text-primary)", 
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.9
          }}>
            Superhero<br />Stories
          </h1>
          <p style={{ 
            fontSize: 16, 
            color: "var(--text-secondary)", 
            marginTop: 24,
            maxWidth: 500,
            marginInline: "auto",
            lineHeight: 1.6
          }}>
            An archive of 108 high-quality canonical narratives for young heroes-in-training.
          </p>
        </div>

        <UniverseSection label="Marvel Archive" count={marvelHeroes.length}>
          {marvelHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.5s",
              animationFillMode: "both",
            }}>
              <HeroCard hero={hero} />
            </div>
          ))}
        </UniverseSection>

        <UniverseSection label="DC Database" count={dcHeroes.length}>
          {dcHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.5s",
              animationFillMode: "both",
            }}>
              <HeroCard hero={hero} />
            </div>
          ))}
        </UniverseSection>

        <UniverseSection label="Avengers Ensemble" count={1}>
          <div style={{
            animationDelay: "0ms",
            animationName: "fadeIn",
            animationDuration: "0.5s",
            animationFillMode: "both",
          }}>
            <HeroCard hero={avengersEntry} />
          </div>
        </UniverseSection>
      </main>
    </>
  );
}
