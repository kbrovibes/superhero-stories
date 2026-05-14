import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "superhero-repo");

export type Universe = "marvel" | "dc" | "avengers";

export interface Hero {
  id: string;          // kebab-case folder name
  name: string;        // display name
  universe: Universe;
  emoji: string;
}

export interface Story {
  id: string;      // slug from filename, e.g. "01-origin"
  number: number;  // 1-based index for display ("Story 1 of 5")
  title: string;   // human-readable, e.g. "Origin"
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

function slugToTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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
    }));
}

export function getAvengersStories(): Story[] {
  const dir = path.join(REPO_ROOT, "avengers");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
  return files.map((f, i) => {
    const id = f.replace(".txt", "");
    const body = fs.readFileSync(path.join(dir, f), "utf-8").trim();
    return {
      id,
      number: i + 1,
      title: slugToTitle(id),
      body,
    };
  });
}

export function getHeroStories(universe: "marvel" | "dc", heroId: string): Story[] {
  const dir = path.join(REPO_ROOT, universe, heroId);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
  return files.map((f, i) => {
    const id = f.replace(".txt", "");
    const body = fs.readFileSync(path.join(dir, f), "utf-8").trim();
    return {
      id,
      number: i + 1,
      title: slugToTitle(id),
      body,
    };
  });
}

export function getHero(universe: "marvel" | "dc", heroId: string): Hero | null {
  const heroes = getHeroes(universe);
  return heroes.find((h) => h.id === heroId) ?? null;
}

export { THEME } from "./theme";
