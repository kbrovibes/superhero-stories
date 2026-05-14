import { getAvengersStories } from "@/lib/stories";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ story: string }>;

export async function generateStaticParams() {
  const stories = getAvengersStories();
  return stories.map((s) => ({ story: String(s.number) }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { story } = await params;
  const stories = getAvengersStories();
  const s = stories[Number(story) - 1];
  return { title: s ? `Avengers: ${s.title}` : "Story" };
}

export default async function AvengersStoryPage({ params }: { params: Params }) {
  const { story } = await params;
  const stories = getAvengersStories();
  const idx = Number(story) - 1;
  if (idx < 0 || idx >= stories.length) notFound();
  const current = stories[idx];
  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-950 text-white pb-20">
        <div className="bg-purple-800 px-6 py-5 flex items-center gap-3">
          <Link href="/avengers" className="text-white/70 hover:text-white text-sm transition-colors">
            ← The Avengers
          </Link>
          <span className="text-white/30 text-sm">·</span>
          <span className="text-sm font-semibold text-yellow-400">
            Story {current.number} of {stories.length}
          </span>
        </div>

        <div className="max-w-2xl mx-auto px-6 mt-10">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-yellow-400 opacity-70">
              Story {current.number}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-8 leading-tight">{current.title}</h1>

          <div>
            {current.body.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-gray-200 text-lg leading-relaxed mb-5 font-[450]">
                {para.trim()}
              </p>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/avengers/${prev.number}`} className="flex-1 rounded-xl p-4 bg-purple-800 hover:brightness-110 transition-[filter] text-left">
                <div className="text-xs text-white/50 mb-1">← Previous</div>
                <div className="font-bold text-sm text-yellow-400">{prev.title}</div>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link href={`/avengers/${next.number}`} className="flex-1 rounded-xl p-4 bg-purple-800 hover:brightness-110 transition-[filter] text-right">
                <div className="text-xs text-white/50 mb-1">Next →</div>
                <div className="font-bold text-sm text-yellow-400">{next.title}</div>
              </Link>
            ) : (
              <Link href="/avengers" className="flex-1 rounded-xl p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-right">
                <div className="text-xs text-white/50 mb-1">Done!</div>
                <div className="font-bold text-sm text-white">Back to Avengers</div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
