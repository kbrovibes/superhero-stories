#!/usr/bin/env node
// Generates themed SVG placeholder avatars for every character in
// new-characters.json. Heroes get a bright universe-accent gradient; villains
// get a darker, deeper variant. The character emoji sits in the center.
//
// These are placeholders so tiles render before real cartoon .webp avatars
// exist. Once a real <id>.webp is added, flip avatarFormat back to "webp" in
// lib/stories.ts (default) and the webp wins.
//
// Usage:  node scripts/gen-avatars.mjs            # all characters
//         node scripts/gen-avatars.mjs wolverine  # one id
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "new-characters.json"), "utf-8"),
);

// center, mid, edge stops per universe + kind
const PALETTE = {
  marvel: {
    hero:    ["#ff6b82", "#c11f3a", "#1a0508"],
    villain: ["#b3324a", "#5e0f1f", "#0a0204"],
  },
  dc: {
    hero:    ["#5cf0ff", "#0095b3", "#051a1f"],
    villain: ["#2aa7bd", "#044049", "#02080a"],
  },
};

function svgFor({ id, universe, kind, emoji }) {
  const [c0, c1, c2] = PALETTE[universe][kind];
  const gid = `g-${id}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="${gid}" cx="32%" cy="28%" r="92%">
      <stop offset="0%" stop-color="${c0}"/>
      <stop offset="52%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="url(#${gid})"/>
  <circle cx="100" cy="100" r="92" fill="none" stroke="${c0}" stroke-opacity="0.25" stroke-width="3"/>
  <text x="100" y="100" text-anchor="middle" dominant-baseline="central"
        font-size="104" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif">${emoji}</text>
</svg>
`;
}

const only = process.argv[2];
let count = 0;
for (const ch of manifest.characters) {
  if (only && ch.id !== only) continue;
  const dir = path.join(ROOT, "public", "avatars", ch.universe);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${ch.id}.svg`);
  fs.writeFileSync(file, svgFor(ch));
  count++;
  console.log(`wrote ${path.relative(ROOT, file)}`);
}
console.log(`\n${count} avatar(s) generated.`);
