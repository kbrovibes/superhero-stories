import NavBar from "@/components/NavBar";
import HeroCard from "@/components/HeroCard";
import { getHeroes } from "@/lib/stories";
import React from "react";

function UniverseSection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: 12, 
          letterSpacing: "0.25em", 
          color: "var(--text-secondary)", 
          fontWeight: 800,
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap"
        }}>
          {label}
        </h2>
        <div style={{ 
          height: 1, 
          flex: 1, 
          background: "linear-gradient(90deg, var(--border), transparent)",
          position: "relative",
          overflow: "hidden"
        }}>
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent, var(--text-muted), transparent)",
              opacity: 0.3
            }}
          />
        </div>
        <span style={{ 
          fontSize: 9, 
          color: "var(--text-muted)", 
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}>
          {count} Units
        </span>
      </div>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: 12 
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
