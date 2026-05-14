import { getHeroes } from "@/lib/stories";
import HeroCard from "@/components/HeroCard";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default function HomePage() {
  const marvelHeroes = getHeroes("marvel");
  const dcHeroes = getHeroes("dc");

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-950 text-white pb-20">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black py-16 px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-yellow-400 font-semibold tracking-[0.3em] text-xs uppercase mb-3">
              ✨ Story Repository ✨
            </p>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
              Superhero
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Stories
              </span>
            </h1>
            <p className="text-gray-400 max-w-sm mx-auto text-base">
              Pick a hero. Read an adventure. Save the day.
            </p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 space-y-14 mt-12">
          {/* Marvel */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔴</span>
              <h2 className="text-2xl font-black tracking-tight">Marvel Heroes</h2>
              <span className="ml-auto text-xs text-gray-500 font-medium">{marvelHeroes.length} heroes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {marvelHeroes.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          </section>

          {/* DC */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔵</span>
              <h2 className="text-2xl font-black tracking-tight">DC Heroes</h2>
              <span className="ml-auto text-xs text-gray-500 font-medium">{dcHeroes.length} heroes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {dcHeroes.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          </section>

          {/* Avengers */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⭐</span>
              <h2 className="text-2xl font-black tracking-tight">Avengers Team Stories</h2>
            </div>
            <Link href="/avengers">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800 to-purple-900 p-8 shadow-xl hover:brightness-110 transition-[filter] cursor-pointer group">
                <div className="absolute right-0 top-0 text-[120px] opacity-10 leading-none select-none">⭐</div>
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-2">
                  Ensemble Stories
                </p>
                <h3 className="text-3xl font-black text-white mb-2">The Avengers</h3>
                <p className="text-purple-200 text-sm max-w-sm">
                  8 stories where Marvel&apos;s mightiest heroes work together.
                  Team-ups, training days, and rest days included.
                </p>
                <span className="mt-4 inline-block text-yellow-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Read all stories →
                </span>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
