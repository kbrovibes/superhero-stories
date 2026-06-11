#!/usr/bin/env node
// Merges per-character trivia sidecars (scripts/trivia/<id>.json) into the
// canonical lib/quiz-questions.json. Idempotent: re-running replaces a
// character's questions rather than duplicating. Validates schema and fails
// loudly on malformed input so bad agent output never reaches the app.
//
// Usage:  node scripts/merge-trivia.mjs wolverine   # one character
//         node scripts/merge-trivia.mjs all          # every sidecar
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const QUIZ = path.join(ROOT, "lib", "quiz-questions.json");
const TRIVIA_DIR = path.join(__dirname, "trivia");

const KEYS = ["id", "question", "options", "correctIndex", "difficulty", "universe", "heroId", "explanation"];

// Repair known agent typos in-place before validation (e.g. an "exploration"
// key instead of "explanation"). Returns the count of fixed objects.
function normalize(arr) {
  let fixed = 0;
  for (const q of arr) {
    if (q && typeof q === "object" && "exploration" in q) {
      if (!q.explanation) q.explanation = q.exploration;
      delete q.exploration;
      fixed++;
    }
  }
  return fixed;
}

function validate(q, file, i) {
  const errs = [];
  const keys = Object.keys(q).sort();
  if (keys.join(",") !== [...KEYS].sort().join(",")) errs.push(`keys=${keys.join("|")}`);
  if (!Array.isArray(q.options) || q.options.length !== 4) errs.push("options!=4");
  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) errs.push("correctIndex");
  if (q.difficulty !== "trivia") errs.push("difficulty");
  if (q.universe !== "marvel" && q.universe !== "dc") errs.push("universe");
  if (typeof q.heroId !== "string" || !q.heroId) errs.push("heroId");
  if (typeof q.question !== "string" || !q.question) errs.push("question");
  if (typeof q.explanation !== "string" || !q.explanation) errs.push("explanation");
  if (errs.length) throw new Error(`${path.basename(file)}[${i}] (${q.id}): ${errs.join(", ")}`);
}

const arg = process.argv[2];
if (!arg) { console.error("usage: merge-trivia.mjs <id|all>"); process.exit(1); }

const files = arg === "all"
  ? fs.readdirSync(TRIVIA_DIR).filter((f) => f.endsWith(".json")).map((f) => path.join(TRIVIA_DIR, f))
  : [path.join(TRIVIA_DIR, `${arg}.json`)];

const quiz = JSON.parse(fs.readFileSync(QUIZ, "utf-8"));
let added = 0, replacedHeroes = [];

for (const file of files) {
  if (!fs.existsSync(file)) { console.error(`missing ${file}`); process.exit(1); }
  const incoming = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (!Array.isArray(incoming) || incoming.length === 0) throw new Error(`${file}: not a non-empty array`);
  const repaired = normalize(incoming);
  if (repaired) {
    fs.writeFileSync(file, JSON.stringify(incoming, null, 2) + "\n");
    console.log(`  normalized ${repaired} object(s) in ${path.basename(file)}`);
  }
  incoming.forEach((q, i) => validate(q, file, i));
  const heroId = incoming[0].heroId;
  if (!incoming.every((q) => q.heroId === heroId)) throw new Error(`${file}: mixed heroId`);
  const ids = new Set(incoming.map((q) => q.id));
  if (ids.size !== incoming.length) throw new Error(`${file}: duplicate question ids`);
  // drop any existing questions for this hero, then append
  const before = quiz.length;
  for (let k = quiz.length - 1; k >= 0; k--) if (quiz[k].heroId === heroId) quiz.splice(k, 1);
  if (before !== quiz.length) replacedHeroes.push(heroId);
  quiz.push(...incoming);
  added += incoming.length;
  console.log(`merged ${incoming.length} for ${heroId}`);
}

fs.writeFileSync(QUIZ, JSON.stringify(quiz, null, 2) + "\n");
console.log(`\nquiz-questions.json now has ${quiz.length} questions (+${added}${replacedHeroes.length ? `, replaced: ${replacedHeroes.join(", ")}` : ""}).`);
