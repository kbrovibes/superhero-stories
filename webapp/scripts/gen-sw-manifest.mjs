// Post-build: scan out/ and emit out/sw-manifest.json — the precache list for sw.js.
// Run after `next build` (static export). Maps .html files to their clean URLs and
// includes JS/CSS/images/fonts/icons. Skips RSC .txt payloads (too large; Next falls
// back to full-page navigation offline), the vector db, and OS junk.

import { createHash } from "node:crypto";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

const SKIP_EXT = new Set([".txt", ".db", ".map"]);
const SKIP_NAMES = new Set([
  ".DS_Store",
  "sw.js",
  "sw-manifest.json",
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function toUrl(rel) {
  // rel is posix-ish relative path under out/
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"/index.html".length);
  if (rel.endsWith(".html")) return "/" + rel.slice(0, -".html".length);
  return "/" + rel;
}

const all = walk(OUT);
const assets = [];
const hash = createHash("sha1");

for (const full of all) {
  const rel = relative(OUT, full).split("\\").join("/");
  const ext = rel.includes(".") ? rel.slice(rel.lastIndexOf(".")) : "";
  if (SKIP_EXT.has(ext)) continue;
  if (SKIP_NAMES.has(rel)) continue;
  const url = toUrl(rel);
  assets.push(url);
  hash.update(url + ":" + statSync(full).size + "\n");
}

assets.sort();
const version = hash.digest("hex").slice(0, 12);

const manifest = { version, assets };
// Write to public/ so the second `next build` pass copies it into out/ where
// Vercel's onBuildComplete hook captures it. (A post-build write into out/
// directly is too late — Vercel has already ingested the export output.)
const PUBLIC = new URL("../public/", import.meta.url).pathname;
writeFileSync(join(PUBLIC, "sw-manifest.json"), JSON.stringify(manifest));
writeFileSync(join(OUT, "sw-manifest.json"), JSON.stringify(manifest));

console.log(
  `sw-manifest.json: ${assets.length} assets precached, version ${version}`
);
