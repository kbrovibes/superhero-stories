import { getHero, getHeroStories, getHeroes } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ universe: string; hero: string }>;

export async function generateStaticParams() {
  const params: { universe: string; hero: string }[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      params.push({ universe, hero: hero.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { universe, hero: heroId } = await params;
  const hero = getHero(universe as "marvel" | "dc", heroId);
  return { title: hero ? `${hero.name} — Superhero Stories` : "Hero" };
}

export default async function HeroPage({ params }: { params: Params }) {
  const { universe, hero: heroId } = await params;
  if (universe !== "marvel" && universe !== "dc") notFound();
  const hero = getHero(universe, heroId);
  if (!hero) notFound();
  const stories = getHeroStories(universe, heroId);

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-950 text-white pb-20">
        {/* Hero banner */}
        <div className={`${hero.color} py-14 px-6 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-center select-none leading-none">
            {hero.emoji}
          </div>
          <Link
            href="/"
            className="relative inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            ← All Heroes
          </Link>
          <div className="relative">
            <div className="text-6xl mb-3">{hero.emoji}</div>
            <h1 className={`text-4xl sm:text-5xl font-black ${hero.accent}`}>{hero.name}</h1>
            <p className="text-white/60 mt-2 text-sm uppercase tracking-widest font-semibold">
              {universe.toUpperCase()} Universe · {stories.length} Stories
            </p>
          </div>
        </div>

        {/* Story grid */}
        <div className="max-w-3xl mx-auto px-4 mt-10">
          <div className="grid gap-4">
            {stories.map((story) => (
              <StoryCard
                key={story.number}
                href={`/${universe}/${heroId}/${story.number}`}
                number={story.number}
                title={story.title}
                preview={story.body}
                color={hero.color}
                accent={hero.accent}
              />
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
