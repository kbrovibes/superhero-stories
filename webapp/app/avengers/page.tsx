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
            <h1 style={{ fontSize: 42, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.1 }}>The Avengers</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
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
                href={`/avengers/${story.number}`}
                universe="avengers"
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
