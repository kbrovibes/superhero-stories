import { ENSEMBLES, getEnsemble, getEnsembleStories, ensembleHasStories } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryTabs from "@/components/StoryTabs";
import { notFound } from "next/navigation";

type Params = Promise<{ team: string; story: string }>;

export async function generateStaticParams() {
  const params: { team: string; story: string }[] = [];
  for (const e of ENSEMBLES) {
    if (e.id === "avengers" || !ensembleHasStories(e.id)) continue;
    for (const s of getEnsembleStories(e.id)) params.push({ team: e.id, story: s.id });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { team, story: storyId } = await params;
  const e = getEnsemble(team);
  const s = e ? getEnsembleStories(e.id).find((s) => s.id === storyId) : null;
  return { title: s && e ? `${e.name}: ${s.title}` : "Story" };
}

export default async function EnsembleStoryPage({ params }: { params: Params }) {
  const { team, story: storyId } = await params;
  const ensemble = getEnsemble(team);
  if (!ensemble || ensemble.id === "avengers") notFound();
  const stories = getEnsembleStories(ensemble.id);
  const idx = stories.findIndex((s) => s.id === storyId);
  if (idx === -1) notFound();
  const current = stories[idx];
  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;
  const accent = ensemble.accent;
  const base = `/ensemble/${ensemble.id}`;

  return (
    <>
      <NavBar crumbs={[
        { label: "Stories", href: "/" },
        { label: ensemble.name, href: base },
        { label: current.title },
      ]} />

      <div style={{ height: 3, background: "var(--surface)" }}>
        <div style={{ height: 3, width: `calc(${idx + 1} / ${stories.length} * 100%)`, background: accent, transition: "width 0.3s ease" }} />
      </div>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "inline-block", border: "1px solid var(--border)", borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
          {idx + 1} / {stories.length}
        </div>

        <h1 className="liquid-text" style={{ fontSize: 36, fontWeight: 900, margin: "0 0 32px", lineHeight: 1.15 }}>
          {current.title}
        </h1>

        <StoryTabs
          body={current.body}
          tldr={current.tldr}
          readAloud={current.readAloud}
          storyTime={current.storyTime}
          accent={accent}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 48 }}>
          <a href={prev ? `${base}/${prev.id}` : undefined} className="liquid-card" style={{ height: 72, borderRadius: "16px 4px 16px 4px", padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", textDecoration: "none", opacity: prev ? 1 : 0, pointerEvents: prev ? "auto" : "none" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>← Previous</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{prev?.title ?? ""}</span>
          </a>
          <a href={next ? `${base}/${next.id}` : base} className="liquid-card" style={{ height: 72, borderRadius: "4px 16px 4px 16px", padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", textDecoration: "none", textAlign: "right" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{next ? "Next →" : `All ${ensemble.name} Stories`}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{next?.title ?? ensemble.name}</span>
          </a>
        </div>
      </main>
    </>
  );
}
