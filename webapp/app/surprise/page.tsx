import { getAllCandidates } from "@/lib/stories";
import NavBar from "@/components/NavBar";
import SurpriseSpinner from "@/components/SurpriseSpinner";

export const metadata = { title: "Surprise Me! — Superhero Stories" };

export default function SurprisePage() {
  const candidates = getAllCandidates();

  return (
    <>
      <NavBar crumbs={[{ label: "Stories", href: "/" }, { label: "Surprise Me" }]} />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px 80px", textAlign: "center" }}>
        <h1 className="liquid-text" style={{
          fontSize: 42,
          fontWeight: 900,
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
        }}>
          Surprise Me!
        </h1>
        <p style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          margin: "16px auto 40px",
          maxWidth: 380,
          lineHeight: 1.5,
          opacity: 0.7,
        }}>
          Press and hold the button. Let go when you&rsquo;re ready.
        </p>
        <SurpriseSpinner candidates={candidates} />
      </main>
    </>
  );
}
