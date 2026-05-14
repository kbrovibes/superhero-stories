import { getHero, getHeroStories, getHeroes } from "@/lib/stories";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ universe: string; hero: string; story: string }>;

export async function generateStaticParams() {
  const params: { universe: string; hero: string; story: string }[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      for (let n = 1; n <= 5; n++) {
        params.push({ universe, hero: hero.id, story: String(n) });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { universe, hero: heroId, story } = await params;
  const hero = getHero(universe as "marvel" | "dc", heroId);
  const stories = hero ? getHeroStories(universe as "marvel" | "dc", heroId) : [];
  const s = stories[Number(story) - 1];
  return { title: s ? `${hero!.name}: ${s.title}` : "Story" };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { universe, hero: heroId, story } = await params;
  if (universe !== "marvel" && universe !== "dc") notFound();
  const hero = getHero(universe, heroId);
  if (!hero) notFound();
  const stories = getHeroStories(universe, heroId);
  const storyIndex = Number(story) - 1;
  if (storyIndex < 0 || storyIndex >= stories.length) notFound();
  const current = stories[storyIndex];
  const prev = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const next = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-950 text-white pb-20">
        {/* Top bar */}
        <div className={`${hero.color} px-6 py-5 flex items-center gap-3`}>
          <Link
            href={`/${universe}/${heroId}`}
            className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            ← {hero.name}
          </Link>
          <span className="text-white/30 text-sm">·</span>
          <span className={`text-sm font-semibold ${hero.accent}`}>
            Story {current.number} of {stories.length}
          </span>
        </div>

        {/* Story content */}
        <div className="max-w-2xl mx-auto px-6 mt-10">
          <div className="mb-2">
            <span className={`text-xs uppercase tracking-widest font-semibold ${hero.accent} opacity-70`}>
              Story {current.number}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-8 leading-tight">{current.title}</h1>

          <div className="prose prose-invert prose-lg max-w-none">
            {current.body.split("\n").filter(Boolean).map((para, i) => (
              <p
                key={i}
                className="text-gray-200 text-lg leading-relaxed mb-5 font-[450]"
              >
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="mt-12 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/${universe}/${heroId}/${prev.number}`}
                className={`flex-1 rounded-xl p-4 ${hero.color} hover:brightness-110 transition-[filter] text-left`}
              >
                <div className="text-xs text-white/50 mb-1">← Previous</div>
                <div className={`font-bold text-sm ${hero.accent}`}>{prev.title}</div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/${universe}/${heroId}/${next.number}`}
                className={`flex-1 rounded-xl p-4 ${hero.color} hover:brightness-110 transition-[filter] text-right`}
              >
                <div className="text-xs text-white/50 mb-1">Next →</div>
                <div className={`font-bold text-sm ${hero.accent}`}>{next.title}</div>
              </Link>
            ) : (
              <Link
                href={`/${universe}/${heroId}`}
                className="flex-1 rounded-xl p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-right"
              >
                <div className="text-xs text-white/50 mb-1">Done!</div>
                <div className="font-bold text-sm text-white">Back to {hero.name}</div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
