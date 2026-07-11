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
  storm:                { name: "Storm",               emoji: "⛈️" },
  cyclops:              { name: "Cyclops",             emoji: "🥽" },
  "jean-grey":          { name: "Jean Grey",           emoji: "🔥" },
  beast:                { name: "Beast",               emoji: "🦍" },
  rogue:                { name: "Rogue",               emoji: "🧤" },
  nightcrawler:         { name: "Nightcrawler",        emoji: "💨" },
  gambit:               { name: "Gambit",              emoji: "🃏" },
  "professor-x":        { name: "Professor X",         emoji: "🎓" },

  // ── Marvel heroes: symbiote protectors (added 2026-07-11) ──
  "anti-venom":         { name: "Anti-Venom",          emoji: "🤍" },

  // ── Marvel heroes: Guardians of the Galaxy backfill (added 2026-06-10) ──
  gamora:               { name: "Gamora",              emoji: "🌿" },
  drax:                 { name: "Drax",                emoji: "🔪" },
  rocket:               { name: "Rocket",              emoji: "🦝" },
  groot:                { name: "Groot",               emoji: "🌳" },
  nebula:               { name: "Nebula",              emoji: "🌌" },

  // ── DC heroes (added 2026-06-10) ──
  starfire:             { name: "Starfire",            emoji: "🧡" },
  raven:                { name: "Raven",               emoji: "🐦‍⬛" },
  "beast-boy":          { name: "Beast Boy",           emoji: "🦖" },
  supergirl:            { name: "Supergirl",           emoji: "💫" },
  "green-arrow":        { name: "Green Arrow",         emoji: "🎯" },
  nightwing:            { name: "Nightwing",           emoji: "🌃" },

  // ── Marvel villains (added 2026-06-10) ──
  "green-goblin":       { name: "Green Goblin",        emoji: "🎃", kind: "villain" },
  "doctor-octopus":     { name: "Doctor Octopus",      emoji: "🐙", kind: "villain" },
  venom:                { name: "Venom",               emoji: "🖤", kind: "villain" },
  magneto:              { name: "Magneto",             emoji: "🧲", kind: "villain" },
  ultron:               { name: "Ultron",              emoji: "⚙️", kind: "villain" },
  "red-skull":          { name: "Red Skull",           emoji: "💀", kind: "villain" },
  abomination:          { name: "Abomination",         emoji: "🦎", kind: "villain" },
  killmonger:           { name: "Killmonger",          emoji: "🐆", kind: "villain" },
  mysterio:             { name: "Mysterio",            emoji: "🎭", kind: "villain" },

  // ── DC villains (added 2026-06-10) ──
  joker:                { name: "The Joker",           emoji: "🤡", kind: "villain" },
  "harley-quinn":       { name: "Harley Quinn",        emoji: "🤹", kind: "villain" },
  "lex-luthor":         { name: "Lex Luthor",          emoji: "🧠", kind: "villain" },
  riddler:              { name: "The Riddler",         emoji: "❓", kind: "villain" },
  "two-face":           { name: "Two-Face",            emoji: "🪙", kind: "villain" },
  catwoman:             { name: "Catwoman",            emoji: "🐱", kind: "villain" },
  bane:                 { name: "Bane",                emoji: "🦾", kind: "villain" },
  sinestro:             { name: "Sinestro",            emoji: "💛", kind: "villain" },
  "black-manta":        { name: "Black Manta",         emoji: "🦈", kind: "villain" },
  darkseid:             { name: "Darkseid",            emoji: "👹", kind: "villain" },
};

function slugToTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Villains live in HERO_META but their story directories haven't been
// authored yet. They should still appear as tiles on the homepage and be
// selectable; the detail page renders "no stories yet" until content lands.
const VILLAIN_IDS_BY_UNIVERSE: Record<"marvel" | "dc", string[]> = {
  marvel: [
    "green-goblin", "doctor-octopus", "venom", "magneto", "ultron",
    "red-skull", "abomination", "killmonger", "mysterio",
  ],
  dc: [
    "joker", "harley-quinn", "lex-luthor", "riddler", "two-face",
    "catwoman", "bane", "sinestro", "black-manta", "darkseid",
  ],
};

function buildHero(id: string, universe: "marvel" | "dc", kindOverride?: HeroKind): Hero {
  return {
    id,
    universe,
    name: HERO_META[id]?.name ?? id,
    emoji: HERO_META[id]?.emoji ?? "⭐",
    avatarFormat: HERO_META[id]?.avatarFormat ?? "webp",
    kind: kindOverride ?? HERO_META[id]?.kind ?? "hero",
  };
}

export function getHeroes(universe: "marvel" | "dc"): Hero[] {
  const dir = path.join(REPO_ROOT, universe);
  const fsHeroes: Hero[] = fs.existsSync(dir)
    ? fs.readdirSync(dir)
        .filter((f) => fs.statSync(path.join(dir, f)).isDirectory())
        .map((id) => buildHero(id, universe))
    : [];
  const fsIds = new Set(fsHeroes.map((h) => h.id));
  const extraVillains = VILLAIN_IDS_BY_UNIVERSE[universe]
    .filter((id) => !fsIds.has(id))
    .map((id) => buildHero(id, universe, "villain"));
  return [...fsHeroes, ...extraVillains];
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

// Returns the public URL for a story's narrated audio if it has been generated
// (public/audio/<universe>/<hero>/<story>.wav), else null. Audio is optional and
// network-only — it is not precached for offline use.
export function getStoryAudioSrc(universe: string, heroId: string, storyId: string): string | null {
  const rel = `audio/${universe}/${heroId}/${storyId}.mp3`;
  return fs.existsSync(path.join(process.cwd(), "public", rel)) ? `/${rel}` : null;
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
