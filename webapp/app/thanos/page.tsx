import { getThanosStories, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryRow from "@/components/StoryRow";

export const metadata = { title: "Thanos — Superhero Stories" };

export default function ThanosPage() {
  const stories = getThanosStories();
  const accent = THEME.thanos.accent;

  return (
    <>
      <NavBar crumbs={[
        { label: "Stories", href: "/" },
        { label: "Thanos" },
      ]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
          <div style={{
            width: 160, height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${accent}77`,
            boxShadow: `0 0 0 6px ${accent}18, 0 0 48px ${accent}44, 0 16px 48px rgba(0,0,0,0.6)`,
            background: "#0a0a14",
            position: "relative",
          }}>
            <img
              src="/avatars/thanos/thanos.webp"
              alt="Thanos"
              width={160}
              height={160}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "radial-gradient(circle, transparent 50%, rgba(5,5,8,0.65) 100%)",
              pointerEvents: "none",
            }} />
          </div>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 42, fontWeight: 900, margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>Thanos</h1>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "12px 0 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, opacity: 0.6, textShadow: `0 0 12px ${accent}` }}>
              THE MAD TITAN · {stories.length} Stories
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12
        }}>
          {stories.map((story, index) => (
            <div key={story.number} style={{
              animationDelay: `${index * 50}ms`,
              animationName: "fadeIn",
              animationDuration: "0.4s",
              animationFillMode: "both",
            }}>
              <StoryRow
                title={story.title}
                storyTheme="Saga"
                index={index}
                href={`/thanos/${story.id}`}
                universe="thanos"
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
