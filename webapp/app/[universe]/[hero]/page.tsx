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
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <span style={{ fontSize: 72 }}>{hero.emoji}</span>
          <div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.1 }}>{hero.name}</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {universe.toUpperCase()} · {stories.length} Stories
            </p>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />

        <div>
          {stories.map((story, index) => (
            <div key={story.number} style={{
              animationDelay: `${index * 80}ms`,
              animationName: "fadeIn",
              animationDuration: "0.3s",
              animationFillMode: "both",
            }}>
              <StoryRow
                title={story.title}
                storyTheme={STORY_THEMES[index] ?? "Story"}
                index={index}
                href={`/${universe}/${heroId}/${story.number}`}
                universe={universe as "marvel" | "dc" | "avengers"}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
