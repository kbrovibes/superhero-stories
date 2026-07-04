import { getHero, getHeroStories, getHeroes, getStoryAudioSrc, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryTabs from "@/components/StoryTabs";
import ReadAloudButton from "@/components/ReadAloudButton";
import { notFound } from "next/navigation";

type Params = Promise<{ universe: string; hero: string; story: string }>;

export async function generateStaticParams() {
  const params: { universe: string; hero: string; story: string }[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      for (const story of getHeroStories(universe, hero.id)) {
        params.push({ universe, hero: hero.id, story: story.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { universe, hero: heroId, story: storyId } = await params;
  const hero = getHero(universe as "marvel" | "dc", heroId);
  const stories = hero ? getHeroStories(universe as "marvel" | "dc", heroId) : [];
  const s = stories.find((s) => s.id === storyId);
  return { title: s ? `${hero!.name}: ${s.title}` : "Story" };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { universe, hero: heroId, story: storyId } = await params;
  if (universe !== "marvel" && universe !== "dc") notFound();
  const hero = getHero(universe, heroId);
  if (!hero) notFound();
  const stories = getHeroStories(universe, heroId);
  const storyIndex = stories.findIndex((s) => s.id === storyId);
  if (storyIndex === -1) notFound();
  const current = stories[storyIndex];
  const prev = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const next = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const accent = THEME[universe as "marvel" | "dc"].accent;
  const audioSrc = getStoryAudioSrc(universe, heroId, storyId);

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <a
            href={`/${universe}/${heroId}`}
            title={hero.name}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: `2px solid ${accent}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              display: "block",
            }}
          >
            <img
              src={`/avatars/${universe}/${heroId}.${hero.avatarFormat}`}
              alt={hero.name}
              width={48}
              height={48}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </a>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <a
              href={`/${universe}/${heroId}`}
              style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}
            >
              {hero.name}
            </a>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Story {storyIndex + 1} of {stories.length}
            </span>
          </div>
        </div>

        <h1 className="liquid-text" style={{ fontSize: 36, fontWeight: 900, margin: "0 0 32px", lineHeight: 1.15 }}>
          {current.title}
        </h1>

        {audioSrc && (
          <ReadAloudButton
            src={audioSrc}
            accent={accent}
            title={current.title}
            heroName={hero.name}
            artwork={`/avatars/${universe}/${heroId}.${hero.avatarFormat}`}
          />
        )}

        <StoryTabs
          body={current.body}
          tldr={current.tldr}
          readAloud={current.readAloud}
          storyTime={current.storyTime}
          accent={accent}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 48 }}>
          <a
            href={prev ? `/${universe}/${heroId}/${prev.id}` : undefined}
            className="liquid-card"
            style={{
              height: 72,
              borderRadius: "16px 4px 16px 4px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textDecoration: "none",
              opacity: prev ? 1 : 0,
              pointerEvents: prev ? "auto" : "none",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>← Previous</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{prev?.title ?? ""}</span>
          </a>
          <a
            href={next ? `/${universe}/${heroId}/${next.id}` : `/${universe}/${heroId}`}
            className="liquid-card"
            style={{
              height: 72,
              borderRadius: "4px 16px 4px 16px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textDecoration: "none",
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{next ? "Next →" : "All stories"}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{next?.title ?? hero.name}</span>
          </a>
        </div>
      </main>
    </>
  );
}
