"use client";

export type TileTheme =
  | "dark-gradient"
  | "polaroid"
  | "comic-panel"
  | "minimal-glass"
  | "sticker";

export const TILE_THEMES: { id: TileTheme; label: string; hint: string; swatch: string }[] = [
  { id: "dark-gradient", label: "Dark Gradient", hint: "Cinematic, the default",     swatch: "linear-gradient(135deg,#ff3c5c 0%, #050508 70%)" },
  { id: "polaroid",      label: "Polaroid",      hint: "Storybook scrapbook",        swatch: "linear-gradient(135deg,#ffffff 0%, #f0ebe1 100%)" },
  { id: "comic-panel",   label: "Comic Panel",   hint: "Bold, energetic, halftone",  swatch: "linear-gradient(135deg,#ffd900 0%, #1a1a1a 100%)" },
  { id: "minimal-glass", label: "Minimal Glass", hint: "Premium, frosted, quiet",    swatch: "linear-gradient(135deg,#0f3460 0%, #1a1a2e 100%)" },
  { id: "sticker",       label: "Sticker",       hint: "Playful, kid-first",         swatch: "linear-gradient(135deg,#fff 0%, #e8efff 100%)" },
];

const KEY = "tile-theme-v1";
const DEFAULT: TileTheme = "dark-gradient";
const ALL_IDS = new Set(TILE_THEMES.map((t) => t.id));

export function loadTileTheme(): TileTheme {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const v = window.localStorage.getItem(KEY);
    return v && ALL_IDS.has(v as TileTheme) ? (v as TileTheme) : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveTileTheme(t: TileTheme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, t);
    document.documentElement.setAttribute("data-tile-theme", t);
    window.dispatchEvent(new CustomEvent("tile-theme-changed", { detail: t }));
  } catch {
    /* private mode, ignore */
  }
}

/**
 * Inline this in <head> to avoid a flash of the wrong theme on first paint.
 * Returns a string of JS that synchronously sets [data-tile-theme] on <html>.
 */
export const PREHYDRATE_SCRIPT = `(function(){try{var t=localStorage.getItem('tile-theme-v1')||'dark-gradient';document.documentElement.setAttribute('data-tile-theme',t);}catch(e){}})();`;
