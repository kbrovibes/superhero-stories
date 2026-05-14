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
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
          <span style={{ fontSize: 96 }}>🛡️</span>
          <div>
            <h1 className="liquid-text" style={{ fontSize: 42, fontWeight: 900, margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>The Avengers</h1>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "12px 0 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, opacity: 0.6 }}>
              AVENGERS · {stories.length} Stories
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
                storyTheme="Ensemble"
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
