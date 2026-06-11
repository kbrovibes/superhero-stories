import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "superhero-repo");

export type Universe = "marvel" | "dc" | "avengers" | "thanos";

export type HeroKind = "hero" | "villain";

export interface Hero {
  id: string;          // kebab-case folder name
  name: string;        // display name
  universe: Universe;
  emoji: string;
  avatarFormat: "webp" | "svg";  // which file lives in /public/avatars/{universe}/
  kind: HeroKind;      // "hero" or "villain" — drives homepage sub-section
}

export interface Story {
  id: string;      // slug from filename, e.g. "01-origin"
  number: number;  // 1-based index for display ("Story 1 of 5")
  title: string;   // human-readable, e.g. "Origin"
  body: string;
  tldr?: string;       // companion .tldr.txt file
  readAloud?: string;  // companion .readaloud.txt file
  storyTime?: string;  // companion .storytime.txt — long-form 700-800w read-aloud
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

type HeroMeta = Pick<Hero, "name" | "emoji"> & { avatarFormat?: "webp" | "svg"; kind?: HeroKind };

const HERO_META: Record<string, HeroMeta> = {
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
  loki:                 { name: "Loki",                emoji: "🐍" },
  wasp:                 { name: "Wasp",                emoji: "🐝" },
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
  robin:                { name: "Robin",               emoji: "🐦" },

  // ── Marvel heroes: X-Men (added 2026-06-10) ──
  wolverine:            { name: "Wolverine",           emoji: "🗡️" },
  storm:                { name: "Storm",               emoji: "⛈️", avatarFormat: "svg" },
  cyclops:              { name: "Cyclops",             emoji: "🥽", avatarFormat: "svg" },
  "jean-grey":          { name: "Jean Grey",           emoji: "🔥", avatarFormat: "svg" },
  beast:                { name: "Beast",               emoji: "🦍", avatarFormat: "svg" },
  rogue:                { name: "Rogue",               emoji: "🧤", avatarFormat: "svg" },
  nightcrawler:         { name: "Nightcrawler",        emoji: "💨", avatarFormat: "svg" },
  gambit:               { name: "Gambit",              emoji: "🃏", avatarFormat: "svg" },
  "professor-x":        { name: "Professor X",         emoji: "🎓", avatarFormat: "svg" },

  // ── Marvel heroes: Guardians of the Galaxy backfill (added 2026-06-10) ──
  gamora:               { name: "Gamora",              emoji: "🌿", avatarFormat: "svg" },
  drax:                 { name: "Drax",                emoji: "🔪", avatarFormat: "svg" },
  rocket:               { name: "Rocket",              emoji: "🦝", avatarFormat: "svg" },
  groot:                { name: "Groot",               emoji: "🌳", avatarFormat: "svg" },
  nebula:               { name: "Nebula",              emoji: "🌌", avatarFormat: "svg" },

  // ── DC heroes (added 2026-06-10) ──
  starfire:             { name: "Starfire",            emoji: "🧡", avatarFormat: "svg" },
  raven:                { name: "Raven",               emoji: "🐦‍⬛", avatarFormat: "svg" },
  "beast-boy":          { name: "Beast Boy",           emoji: "🦖", avatarFormat: "svg" },
  supergirl:            { name: "Supergirl",           emoji: "💫", avatarFormat: "svg" },
  "green-arrow":        { name: "Green Arrow",         emoji: "🎯", avatarFormat: "svg" },
  nightwing:            { name: "Nightwing",           emoji: "🌃", avatarFormat: "svg" },

  // ── Marvel villains (added 2026-06-10) ──
  "green-goblin":       { name: "Green Goblin",        emoji: "🎃", avatarFormat: "svg", kind: "villain" },
  "doctor-octopus":     { name: "Doctor Octopus",      emoji: "🐙", avatarFormat: "svg", kind: "villain" },
  venom:                { name: "Venom",               emoji: "🖤", avatarFormat: "svg", kind: "villain" },
  magneto:              { name: "Magneto",             emoji: "🧲", avatarFormat: "svg", kind: "villain" },
  ultron:               { name: "Ultron",              emoji: "⚙️", avatarFormat: "svg", kind: "villain" },
  "red-skull":          { name: "Red Skull",           emoji: "💀", avatarFormat: "svg", kind: "villain" },
  abomination:          { name: "Abomination",         emoji: "🦎", avatarFormat: "svg", kind: "villain" },
  killmonger:           { name: "Killmonger",          emoji: "🐆", avatarFormat: "svg", kind: "villain" },
  mysterio:             { name: "Mysterio",            emoji: "🎭", avatarFormat: "svg", kind: "villain" },

  // ── DC villains (added 2026-06-10) ──
  joker:                { name: "The Joker",           emoji: "🤡", avatarFormat: "svg", kind: "villain" },
  "harley-quinn":       { name: "Harley Quinn",        emoji: "🤹", avatarFormat: "svg", kind: "villain" },
  "lex-luthor":         { name: "Lex Luthor",          emoji: "🧠", avatarFormat: "svg", kind: "villain" },
  riddler:              { name: "The Riddler",         emoji: "❓", avatarFormat: "svg", kind: "villain" },
  "two-face":           { name: "Two-Face",            emoji: "🪙", avatarFormat: "svg", kind: "villain" },
  catwoman:             { name: "Catwoman",            emoji: "🐱", avatarFormat: "svg", kind: "villain" },
  bane:                 { name: "Bane",                emoji: "🦾", avatarFormat: "svg", kind: "villain" },
  sinestro:             { name: "Sinestro",            emoji: "💛", avatarFormat: "svg", kind: "villain" },
  "black-manta":        { name: "Black Manta",         emoji: "🦈", avatarFormat: "svg", kind: "villain" },
  darkseid:             { name: "Darkseid",            emoji: "👹", avatarFormat: "svg", kind: "villain" },
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
      avatarFormat: HERO_META[id]?.avatarFormat ?? "webp",
      kind: HERO_META[id]?.kind ?? "hero",
    }));
}

// ── Ensembles: multi-hero story collections (like the Avengers) ──
export interface Ensemble {
  id: string;       // folder under superhero-repo/ AND url slug
  name: string;
  emoji: string;
  accent: string;   // CSS color for story rows / tabs
  kicker: string;   // short uppercase label
  route: string;    // full href to the ensemble landing page
}

export const ENSEMBLES: Ensemble[] = [
  { id: "avengers",       name: "The Avengers",            emoji: "🛡️", accent: "var(--av-accent)", kicker: "AVENGERS",       route: "/avengers" },
  { id: "x-men",          name: "The X-Men",               emoji: "🧬", accent: "#ffb000",          kicker: "X-MEN",          route: "/ensemble/x-men" },
  { id: "guardians",      name: "Guardians of the Galaxy", emoji: "🚀", accent: "#ff7a3c",          kicker: "GUARDIANS",      route: "/ensemble/guardians" },
  { id: "justice-league", name: "Justice League",          emoji: "⚖️", accent: "#4f8cff",          kicker: "JUSTICE LEAGUE", route: "/ensemble/justice-league" },
  { id: "teen-titans",    name: "Teen Titans",             emoji: "🏆", accent: "#ff5a5f",          kicker: "TEEN TITANS",    route: "/ensemble/teen-titans" },
];

export function getEnsemble(id: string): Ensemble | null {
  return ENSEMBLES.find((e) => e.id === id) ?? null;
}

// True only once the ensemble's story folder has at least one .txt file.
export function ensembleHasStories(id: string): boolean {
  const dir = path.join(REPO_ROOT, id);
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some((f) => f.endsWith(".txt"));
}

export function getEnsembleStories(id: string): Story[] {
  return readEnsembleStories(id);
}

export function getAvengersStories(): Story[] {
  return readEnsembleStories("avengers");
}

export function getThanosStories(): Story[] {
  return readEnsembleStories("thanos");
}

function readEnsembleStories(folder: string): Story[] {
  const dir = path.join(REPO_ROOT, folder);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt") && !f.endsWith(".tldr.txt") && !f.endsWith(".readaloud.txt") && !f.endsWith(".storytime.txt")).sort();
  return files.map((f, i) => {
    const id = f.replace(".txt", "");
    const body = fs.readFileSync(path.join(dir, f), "utf-8").trim();
    const tldrPath = path.join(dir, f.replace(".txt", ".tldr.txt"));
    const readAloudPath = path.join(dir, f.replace(".txt", ".readaloud.txt"));
    const storyTimePath = path.join(dir, f.replace(".txt", ".storytime.txt"));
    return {
      id,
      number: i + 1,
      title: slugToTitle(id),
      body,
      tldr: fs.existsSync(tldrPath) ? fs.readFileSync(tldrPath, "utf-8").trim() : undefined,
      readAloud: fs.existsSync(readAloudPath) ? fs.readFileSync(readAloudPath, "utf-8").trim() : undefined,
      storyTime: fs.existsSync(storyTimePath) ? fs.readFileSync(storyTimePath, "utf-8").trim() : undefined,
    };
  });
}

export function getHeroStories(universe: "marvel" | "dc", heroId: string): Story[] {
  const dir = path.join(REPO_ROOT, universe, heroId);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt") && !f.endsWith(".tldr.txt") && !f.endsWith(".readaloud.txt") && !f.endsWith(".storytime.txt")).sort();

  return files.map((f, i) => {
    const id = f.replace(".txt", "");
    const body = fs.readFileSync(path.join(dir, f), "utf-8").trim();
    const tldrPath = path.join(dir, f.replace(".txt", ".tldr.txt"));
    const readAloudPath = path.join(dir, f.replace(".txt", ".readaloud.txt"));
    const storyTimePath = path.join(dir, f.replace(".txt", ".storytime.txt"));
    return {
      id,
      number: i + 1,
      title: slugToTitle(id),
      body,
      tldr: fs.existsSync(tldrPath) ? fs.readFileSync(tldrPath, "utf-8").trim() : undefined,
      readAloud: fs.existsSync(readAloudPath) ? fs.readFileSync(readAloudPath, "utf-8").trim() : undefined,
      storyTime: fs.existsSync(storyTimePath) ? fs.readFileSync(storyTimePath, "utf-8").trim() : undefined,
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
  for (const story of getThanosStories()) {
    out.push({
      universe: "thanos",
      heroId: null,
      heroName: "Thanos",
      heroEmoji: "🟣",
      storyId: story.id,
      storyTitle: story.title,
      href: `/thanos/${story.id}`,
    });
  }
  return out;
}

export { THEME } from "./theme";
