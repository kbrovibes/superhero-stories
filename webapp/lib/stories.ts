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

export interface Candidate {
  universe: Universe;
  heroId: string | null;   // null for ensemble Avengers stories
  heroName: string;        // "The Avengers" for ensemble
  heroEmoji: string;
  storyId: string;
  storyTitle: string;
  href: string;            // pre-built link string for next/link
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
  "scarlet-witch":      { name: "Scarlet Witch",       emoji: "🔮" },
  vision:               { name: "Vision",              emoji: "💎" },
  falcon:               { name: "Falcon",              emoji: "🦅" },
  "winter-soldier":     { name: "Winter Soldier",      emoji: "❄️" },
  "star-lord":          { name: "Star-Lord",           emoji: "🚀" },
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

export function getAllCandidates(): Candidate[] {
  const out: Candidate[] = [];
  for (const universe of ["marvel", "dc"] as const) {
    for (const hero of getHeroes(universe)) {
      for (const story of getHeroStories(universe, hero.id)) {
        out.push({
          universe,
          heroId: hero.id,
          heroName: hero.name,
          heroEmoji: hero.emoji,
          storyId: story.id,
          storyTitle: story.title,
          href: `/${universe}/${hero.id}/${story.id}`,
        });
      }
    }
  }
  for (const story of getAvengersStories()) {
    out.push({
      universe: "avengers",
      heroId: null,
      heroName: "The Avengers",
      heroEmoji: "🛡️",
      storyId: story.id,
      storyTitle: story.title,
      href: `/avengers/${story.id}`,
    });
  }
  return out;
}

export { THEME } from "./theme";
