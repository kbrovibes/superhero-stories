import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..", "superhero-repo");

export type Universe = "marvel" | "dc" | "avengers";

export interface Hero {
  id: string;          // kebab-case folder name
  name: string;        // display name
  universe: Universe;
  color: string;       // tailwind bg class
  accent: string;      // tailwind text/border class
  emoji: string;
}

export interface Story {
  number: number;
  title: string;
  body: string;
}

const HERO_META: Record<string, Pick<Hero, "name" | "emoji">> = {
  "iron-man":           { name: "Iron Man",           emoji: "🤖" },
  "spider-man":         { name: "Spider-Man",          emoji: "🕷️" },
  thor:                 { name: "Thor",                emoji: "⚡" },
  "captain-america":    { name: "Captain America",     emoji: "🛡️" },
  "black-panther":      { name: "Black Panther",       emoji: "🐾" },
  hulk:                 { name: "Hulk",                emoji: "💪" },
  "black-widow":        { name: "Black Widow",         emoji: "🕸️" },
  "doctor-strange":     { name: "Doctor Strange",      emoji: "✨" },
  hawkeye:              { name: "Hawkeye",             emoji: "🏹" },
  "ant-man":            { name: "Ant-Man",             emoji: "🐜" },
  batman:               { name: "Batman",              emoji: "🦇" },
  superman:             { name: "Superman",            emoji: "🦸" },
  "wonder-woman":       { name: "Wonder Woman",        emoji: "⚔️" },
  "the-flash":          { name: "The Flash",           emoji: "⚡" },
  "green-lantern":      { name: "Green Lantern",       emoji: "💚" },
  aquaman:              { name: "Aquaman",             emoji: "🌊" },
  shazam:               { name: "Shazam",              emoji: "🌩️" },
  cyborg:               { name: "Cyborg",              emoji: "🔧" },
  batgirl:              { name: "Batgirl",             emoji: "🦇" },
  "martian-manhunter":  { name: "Martian Manhunter",   emoji: "👽" },
};

const STORY_TITLES = [
  "The Origin",
  "First Villain",
  "Second Villain",
  "Artifacts & Lore",
  "Teamwork",
];

function universeTheme(universe: Universe): Pick<Hero, "color" | "accent"> {
  if (universe === "marvel")   return { color: "bg-red-700",    accent: "text-yellow-400" };
  if (universe === "dc")       return { color: "bg-blue-800",   accent: "text-yellow-300" };
  return                              { color: "bg-purple-800", accent: "text-yellow-300" };
}

export function getHeroes(universe: "marvel" | "dc"): Hero[] {
  const dir = path.join(REPO_ROOT, universe);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isDirectory())
    .map((id) => ({
      id,
      universe,
      name: HERO_META[id]?.name ?? id,
      emoji: HERO_META[id]?.emoji ?? "⭐",
      ...universeTheme(universe),
    }));
}

export function getAvengersStories(): Story[] {
  const dir = path.join(REPO_ROOT, "avengers");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
  return files.map((f, i) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8").trim();
    const lines = raw.split("\n");
    // First line is the story title (ALL CAPS), rest is body
    const firstLine = lines[0].trim();
    const isTitle = firstLine === firstLine.toUpperCase() && firstLine.length > 0 && !/[.?!]$/.test(firstLine);
    return {
      number: i + 1,
      title: isTitle ? toTitleCase(firstLine) : `Story ${i + 1}`,
      body: isTitle ? lines.slice(1).join("\n").trim() : raw,
    };
  });
}

export function getHeroStories(universe: "marvel" | "dc", heroId: string): Story[] {
  const dir = path.join(REPO_ROOT, universe, heroId);
  if (!fs.existsSync(dir)) return [];
  return [1, 2, 3, 4, 5].map((n) => {
    const file = path.join(dir, `${n}.txt`);
    const body = fs.existsSync(file) ? fs.readFileSync(file, "utf-8").trim() : "";
    return { number: n, title: STORY_TITLES[n - 1], body };
  });
}

export function getHero(universe: "marvel" | "dc", heroId: string): Hero | null {
  const heroes = getHeroes(universe);
  return heroes.find((h) => h.id === heroId) ?? null;
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
