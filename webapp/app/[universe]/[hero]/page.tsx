import { getHero, getHeroStories, getHeroes } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryRow from "@/components/StoryRow";
import VisitRecorder from "@/components/VisitRecorder";
import Link from "next/link";
import { notFound } from "next/navigation";
import allQuestions from "@/lib/quiz-questions.json";
import type { QuizQuestion } from "@/lib/quiz";
import { THEME } from "@/lib/theme";

type Params = Promise<{ universe: string; hero: string }>;

export async function generateStaticParams() {
  const params: { universe: string; hero: string }[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      params.push({ universe, hero: hero.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { universe, hero: heroId } = await params;
  const hero = getHero(universe as "marvel" | "dc", heroId);
  return { title: hero ? `${hero.name} — Superhero Stories` : "Hero" };
}

const STORY_THEMES = ["Origin Story", "Villain Encounter", "Villain Encounter 2", "Artifact & Lore", "Teamwork & Lessons"];

export default async function HeroPage({ params }: { params: Params }) {
  const { universe, hero: heroId } = await params;
  if (universe !== "marvel" && universe !== "dc") notFound();
  const hero = getHero(universe, heroId);
  if (!hero) notFound();
  const stories = getHeroStories(universe, heroId);
  const heroQs = (allQuestions as QuizQuestion[]).filter(q => q.heroId === heroId);
  const qBank = {
    easy: heroQs.filter(q => q.difficulty === "easy").length,
    medium: heroQs.filter(q => q.difficulty === "medium").length,
    hard: heroQs.filter(q => q.difficulty === "hard").length,
  };
  const theme = THEME[universe as "marvel" | "dc"];

  return (
    <>
      <VisitRecorder heroId={heroId} />
      <NavBar crumbs={[
        { label: universe.toUpperCase(), href: "/" },
        { label: hero.name },
      ]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
          {/* Cartoon avatar bubble */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: 160, height: 160,
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${theme.accent}77`,
              boxShadow: `0 0 0 6px ${theme.accent}18, 0 0 48px ${theme.accent}44, 0 16px 48px rgba(0,0,0,0.6)`,
              background: "#0a0a14",
              position: "relative",
            }}>
              <img
                src={`/avatars/${universe}/${heroId}.webp`}
                alt={hero.name}
                width={160}
                height={160}
                style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* vignette so edges dissolve into page background */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle, transparent 50%, rgba(5,5,8,0.65) 100%)",
                pointerEvents: "none",
              }} />
            </div>
          </div>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 44, fontWeight: 900, margin: 0, lineHeight: 1, textTransform: "uppercase", textAlign: "center" }}>{hero.name}</h1>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "12px 0 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, opacity: 0.6 }}>
              {universe.toUpperCase()} ARCHIVE · {stories.length} DATA FILES
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
              {(["easy", "medium", "hard"] as const).map((d) => {
                const count = qBank[d];
                const color = d === "easy" ? "#22c55e" : d === "medium" ? "#f59e0b" : "#ef4444";
                return (
                  <span key={d} style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: count >= 10 ? color : "var(--text-muted)",
                    border: `1px solid ${count >= 10 ? color + "55" : "var(--border)"}`,
                    borderRadius: 999,
                    padding: "2px 8px",
                    opacity: count === 0 ? 0.35 : 1,
                  }}>
                    {count} {d[0].toUpperCase()}
                  </span>
                );
              })}
            </div>
          </div>
          <Link
            href={`/quiz?scope=${heroId}&universe=${universe}&label=${encodeURIComponent(hero.name)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              borderRadius: 999,
              background: "radial-gradient(circle at 70% 30%, var(--thanos-accent), var(--dc-accent) 70%)",
              color: "#0a0a14",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(162,107,255,0.2)",
            }}
          >
            <span>⚡</span>
            <span>Quiz {hero.name}</span>
          </Link>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 12 
        }}>
          {stories.map((story, index) => (
            <div key={story.id} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.4s",
              animationFillMode: "both",
            }}>
              <StoryRow
                title={story.title}
                storyTheme={STORY_THEMES[index] ?? "Story"}
                index={index}
                href={`/${universe}/${heroId}/${story.id}`}
                universe={universe as "marvel" | "dc" | "avengers"}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
