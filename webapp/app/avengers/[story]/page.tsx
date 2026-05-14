import { getAvengersStories, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import { notFound } from "next/navigation";

type Params = Promise<{ story: string }>;

export async function generateStaticParams() {
  const stories = getAvengersStories();
  return stories.map((s) => ({ story: s.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { story: storyId } = await params;
  const stories = getAvengersStories();
  const s = stories.find((s) => s.id === storyId);
  return { title: s ? `Avengers: ${s.title}` : "Story" };
}

export default async function AvengersStoryPage({ params }: { params: Params }) {
  const { story: storyId } = await params;
  const stories = getAvengersStories();
  const idx = stories.findIndex((s) => s.id === storyId);
  if (idx === -1) notFound();
  const current = stories[idx];
  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;
  const accent = THEME.avengers.accent;

  return (
    <>
      <NavBar crumbs={[
        { label: "Stories", href: "/" },
        { label: "Avengers", href: "/avengers" },
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
            href={prev ? `/avengers/${prev.id}` : undefined}
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
            href={next ? `/avengers/${next.id}` : "/avengers"}
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
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{next ? "Next →" : "All Avengers Stories"}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{next?.title ?? "The Avengers"}</span>
          </a>
        </div>
      </main>
    </>
  );
}
