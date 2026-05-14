import { getAvengersStories, THEME } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import StoryRow from "@/components/StoryRow";

export const metadata = { title: "The Avengers — Superhero Stories" };

export default function AvengersPage() {
  const stories = getAvengersStories();
  const accent = THEME.avengers.accent;

  return (
    <>
      <NavBar crumbs={[
        { label: "Stories", href: "/" },
        { label: "Avengers" },
      ]} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <span style={{ fontSize: 72 }}>🛡️</span>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 42, fontWeight: 900, margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>The Avengers</h1>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, opacity: 0.6 }}>
              AVENGERS · {stories.length} Stories
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
                storyTheme="Ensemble Story"
                index={index}
                href={`/avengers/${story.id}`}
                universe="avengers"
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
