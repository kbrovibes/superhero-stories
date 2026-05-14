import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import { getHeroes } from "@/lib/stories";
import React from "react";

function UniverseSection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
        <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 10px" }}>{count} heroes</span>
        <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
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
      <NavBar crumbs={[{ label: "Stories" }]} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>✦ Superhero Stories</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "8px 0 0" }}>108 stories across Marvel, DC, and the Avengers.</p>
        </div>

        <UniverseSection label="MARVEL" count={marvelHeroes.length}>
          {marvelHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.3s",
              animationFillMode: "both",
            }}>
              <HeroCard hero={hero} />
            </div>
          ))}
        </UniverseSection>

        <UniverseSection label="DC" count={dcHeroes.length}>
          {dcHeroes.map((hero, index) => (
            <div key={hero.id} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.3s",
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
            animationDuration: "0.3s",
            animationFillMode: "both",
          }}>
            <HeroCard hero={avengersEntry} />
          </div>
        </UniverseSection>
      </main>
    </>
  );
}
