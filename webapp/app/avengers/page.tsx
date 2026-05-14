import { getAvengersStories } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export const metadata = { title: "The Avengers — Superhero Stories" };

export default function AvengersPage() {
  const stories = getAvengersStories();

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-950 text-white pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 to-purple-950 py-14 px-6 text-center">
          <div className="absolute inset-0 opacity-5 text-[200px] flex items-center justify-center select-none leading-none">⭐</div>
          <Link
            href="/"
            className="relative inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            ← All Heroes
          </Link>
          <div className="relative">
            <div className="text-6xl mb-3">⭐</div>
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-400">The Avengers</h1>
            <p className="text-purple-300 mt-2 text-sm uppercase tracking-widest font-semibold">
              {stories.length} Team Stories
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-10">
          <div className="grid gap-4">
            {stories.map((story) => (
              <StoryCard
                key={story.number}
                href={`/avengers/${story.number}`}
                number={story.number}
                title={story.title}
                preview={story.body}
                color="bg-purple-800"
                accent="text-yellow-400"
              />
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
