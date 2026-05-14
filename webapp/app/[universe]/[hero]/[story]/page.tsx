import { getHero, getHeroStories, getHeroes, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import { notFound } from "next/navigation";

type Params = Promise<{ universe: string; hero: string; story: string }>;

export async function generateStaticParams() {
  const params: { universe: string; hero: string; story: string }[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      for (let n = 1; n <= 5; n++) {
        params.push({ universe, hero: hero.id, story: String(n) });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { universe, hero: heroId, story } = await params;
  const hero = getHero(universe as "marvel" | "dc", heroId);
  const stories = hero ? getHeroStories(universe as "marvel" | "dc", heroId) : [];
  const s = stories[Number(story) - 1];
  return { title: s ? `${hero!.name}: ${s.title}` : "Story" };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { universe, hero: heroId, story } = await params;
  if (universe !== "marvel" && universe !== "dc") notFound();
  const hero = getHero(universe, heroId);
  if (!hero) notFound();
  const stories = getHeroStories(universe, heroId);
  const storyIndex = Number(story) - 1;
  if (storyIndex < 0 || storyIndex >= stories.length) notFound();
  const current = stories[storyIndex];
  const prev = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const next = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const accent = THEME[universe as "marvel" | "dc"].accent;

  return (
    <>
      <NavBar crumbs={[
        { label: universe.toUpperCase(), href: "/" },
        { label: hero.name, href: `/${universe}/${heroId}` },
        { label: current.title },
      ]} />

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface)" }}>
        <div style={{
          height: 3,
          width: `calc(${storyIndex + 1} / ${stories.length} * 100%)`,
          background: accent,
          transition: "width 0.3s ease",
        }} />
      </div>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{
          display: "inline-block",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "4px 12px",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 20,
        }}>
          {storyIndex + 1} / {stories.length}
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 32px", lineHeight: 1.15 }}>
          {current.title}
        </h1>

        <div>
          {current.body.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={{ fontSize: 19, lineHeight: 1.85, color: "#d4d4e8", margin: "0 0 20px" }}>
              {para.trim()}
            </p>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 48 }}>
          <a
            href={prev ? `/${universe}/${heroId}/${prev.number}` : undefined}
            style={{
              height: 72,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textDecoration: "none",
              opacity: prev ? 1 : 0,
              pointerEvents: prev ? "auto" : "none",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>← Previous</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{prev?.title ?? ""}</span>
          </a>
          <a
            href={next ? `/${universe}/${heroId}/${next.number}` : `/${universe}/${heroId}`}
            style={{
              height: 72,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textDecoration: "none",
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{next ? "Next →" : "All stories"}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{next?.title ?? hero.name}</span>
          </a>
        </div>
      </main>
    </>
  );
}
