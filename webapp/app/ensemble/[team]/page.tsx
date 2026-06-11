import { ENSEMBLES, getEnsemble, getEnsembleStories, ensembleHasStories } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryRow from "@/components/StoryRow";
import { notFound } from "next/navigation";

type Params = Promise<{ team: string }>;

// Only ensembles that already have a story folder get a route (Avengers has its own).
export async function generateStaticParams() {
  return ENSEMBLES.filter((e) => e.id !== "avengers" && ensembleHasStories(e.id)).map((e) => ({ team: e.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { team } = await params;
  const e = getEnsemble(team);
  return { title: e ? `${e.name} — Superhero Stories` : "Ensemble" };
}

export default async function EnsemblePage({ params }: { params: Params }) {
  const { team } = await params;
  const ensemble = getEnsemble(team);
  if (!ensemble || ensemble.id === "avengers") notFound();
  const stories = getEnsembleStories(ensemble.id);
  if (stories.length === 0) notFound();

  return (
    <>
      <NavBar crumbs={[{ label: "Stories", href: "/" }, { label: ensemble.name }]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
          <span style={{ fontSize: 96 }}>{ensemble.emoji}</span>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 42, fontWeight: 900, margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>{ensemble.name}</h1>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "12px 0 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, opacity: 0.6 }}>
              {ensemble.kicker} · {stories.length} Stories
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {stories.map((story, index) => (
            <div key={story.number} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.4s",
              animationFillMode: "both",
            }}>
              <StoryRow
                title={story.title}
                storyTheme="Ensemble"
                index={index}
                href={`/ensemble/${ensemble.id}/${story.id}`}
                universe="avengers"
                accent={ensemble.accent}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
