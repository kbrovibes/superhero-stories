import { getHero, getHeroStories, getHeroes } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryRow from "@/components/StoryRow";
import { notFound } from "next/navigation";

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

  return (
    <>
      <NavBar crumbs={[
        { label: universe.toUpperCase(), href: "/" },
        { label: hero.name },
      ]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
          <span style={{ fontSize: 96 }}>{hero.emoji}</span>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 48, fontWeight: 900, margin: 0, lineHeight: 1, textTransform: "uppercase" }}>{hero.name}</h1>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "12px 0 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, opacity: 0.6 }}>
              {universe.toUpperCase()} ARCHIVE · {stories.length} DATA FILES
            </p>
          </div>
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
