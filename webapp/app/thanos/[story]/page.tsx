import { getThanosStories, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import { notFound } from "next/navigation";

type Params = Promise<{ story: string }>;

export async function generateStaticParams() {
  const stories = getThanosStories();
  return stories.map((s) => ({ story: s.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { story: storyId } = await params;
  const stories = getThanosStories();
  const s = stories.find((s) => s.id === storyId);
  return { title: s ? `Thanos: ${s.title}` : "Story" };
}

export default async function ThanosStoryPage({ params }: { params: Params }) {
  const { story: storyId } = await params;
  const stories = getThanosStories();
  const idx = stories.findIndex((s) => s.id === storyId);
  if (idx === -1) notFound();
  const current = stories[idx];
  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;
  const accent = THEME.thanos.accent;

  return (
    <>
      <NavBar crumbs={[
        { label: "Stories", href: "/" },
        { label: "Thanos", href: "/thanos" },
        { label: current.title },
      ]} />

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface)" }}>
        <div style={{
          height: 3,
          width: `calc(${idx + 1} / ${stories.length} * 100%)`,
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
          {idx + 1} / {stories.length}
        </div>

        <h1 className="liquid-text" style={{ fontSize: 36, fontWeight: 900, margin: "0 0 32px", lineHeight: 1.15 }}>
          {current.title}
        </h1>

        <div>
          {current.body.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)", margin: "0 0 20px" }}>
              {para.trim()}
            </p>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 48 }}>
          <a
            href={prev ? `/thanos/${prev.id}` : undefined}
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
            href={next ? `/thanos/${next.id}` : "/thanos"}
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
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{next ? "Next →" : "All Thanos Stories"}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{next?.title ?? "Thanos"}</span>
          </a>
        </div>
      </main>
    </>
  );
}
