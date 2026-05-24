# EXPANDED-STORIES: Three-Tab Story Views

## Objective

For every story in this repo, generate two additional content variants alongside the existing
story text. Then update `lib/stories.ts` and all story page components to expose three tabs:
**TLDR**, **Summary** (existing), and **Read Aloud**.

The user is a parent who reads these to a 6-year-old daughter. TLDR is for the parent to
quickly recall the key facts before telling the story verbally. Read Aloud is a polished
storybook narration meant to be spoken out loud.

---

## Repository Layout

Working directory: `webapp/` (all Next.js code lives here)

```
superhero-repo/
  marvel/         15 heroes × 5–10 stories each
  dc/             10 heroes × 10 stories each
  avengers/       12 ensemble stories
  thanos/          5 ensemble stories
```

Full hero list:

**Marvel (15):** ant-man, black-panther, black-widow, captain-america, doctor-strange,
falcon, hawkeye, hulk, iron-man, scarlet-witch, spider-man, star-lord, thor, vision,
winter-soldier

**DC (10):** aquaman, batgirl, batman, cyborg, green-lantern, martian-manhunter, shazam,
superman, the-flash, wonder-woman

**Ensemble:** avengers (12 stories), thanos (5 stories)

**Total: ~242 stories across 27 parallel workstreams**

---

## Step 1 — Code Changes (do this FIRST, before content generation)

### 1a. Extend `webapp/lib/stories.ts`

Add two optional fields to the `Story` interface:

```typescript
export interface Story {
  id: string;
  number: number;
  title: string;
  body: string;       // Summary — the original .txt file, unchanged
  tldr?: string;      // TLDR — companion .tldr.txt file
  readAloud?: string; // Read Aloud — companion .readaloud.txt file
}
```

Update `getHeroStories` and `readEnsembleStories` (the `folder` variant) to also load
companion files when they exist. For each `.txt` file at path `{dir}/{slug}.txt`:
- check for `{dir}/{slug}.tldr.txt` → if exists, read into `tldr`
- check for `{dir}/{slug}.readaloud.txt` → if exists, read into `readAloud`

Example change to the map() in `readEnsembleStories`:
```typescript
const tldrPath = path.join(dir, f.replace(".txt", ".tldr.txt"));
const readAloudPath = path.join(dir, f.replace(".txt", ".readaloud.txt"));
return {
  id,
  number: i + 1,
  title: slugToTitle(id),
  body,
  tldr: fs.existsSync(tldrPath) ? fs.readFileSync(tldrPath, "utf-8").trim() : undefined,
  readAloud: fs.existsSync(readAloudPath) ? fs.readFileSync(readAloudPath, "utf-8").trim() : undefined,
};
```

Apply the same pattern to `getHeroStories`.

### 1b. Create `webapp/components/StoryTabs.tsx`

A client component that receives `tldr`, `body`, and `readAloud` and renders a three-tab UI.
Only render tabs that have content (if `tldr` is undefined, hide the TLDR tab — show it once
content is available). Default active tab: Summary.

Tab labels: **TLDR** / **Summary** / **Read Aloud**

Styling requirements:
- Inline styles only — no new Tailwind classes (consistent with the existing story pages)
- Tab bar uses `var(--surface)`, `var(--border)`, `var(--accent)` CSS variables
- Active tab: accent color underline or background pill
- TLDR content: render each line starting with `•` as a styled bullet
- Read Aloud content: render paragraphs with slightly larger line-height (2.0) and font-size
  (19px) for comfortable reading aloud
- Summary content: preserve the existing paragraph rendering (fontSize 18, lineHeight 1.8)

### 1c. Update All Story Page Components

There are three story page files. Update each to pass tab content to `<StoryTabs>`:

1. `webapp/app/[universe]/[hero]/[story]/page.tsx`
2. `webapp/app/avengers/[story]/page.tsx`
3. `webapp/app/thanos/[story]/page.tsx`

In each page, replace the current `<div>` that maps `current.body` paragraphs with:
```tsx
<StoryTabs
  body={current.body}
  tldr={current.tldr}
  readAloud={current.readAloud}
  accent={accent}
/>
```

The surrounding layout (progress bar, h1 title, prev/next nav) stays exactly as-is.

### 1d. Commit the code changes

```
git add webapp/lib/stories.ts webapp/components/StoryTabs.tsx webapp/app/...
git commit -m "feat(stories): three-tab UI — TLDR / Summary / Read Aloud"
git push origin main
```

---

## Step 2 — Content Generation (parallel across all 27 workstreams)

After the code commit, generate content for all heroes and groups **in parallel**.
Use as many parallel agents or tasks as possible — do not process heroes sequentially.

### File naming convention

For each existing `{slug}.txt`, create two companions in the same directory:
- `{slug}.tldr.txt`
- `{slug}.readaloud.txt`

Example: for `01-origin.txt` → create `01-origin.tldr.txt` and `01-origin.readaloud.txt`

---

### TLDR Format Specification

**Purpose:** Parent reads this in 30 seconds to load the story's key facts into memory
before telling it verbally. Trivia density is everything.

**Format:**
- 6–10 bullet points, one per line, starting with `•`
- NO prose, NO full sentences required — tight noun phrases are fine
- MUST include: hero real name, key location(s), key villain(s) or antagonist(s) if any,
  key artifact(s) or power(s) introduced, the pivotal event, the outcome/lesson
- Every proper noun in the original story must appear in at least one bullet
- Bullets are sorted by narrative order (chronological through the story)
- No filler ("in this story", "we learn that") — just the facts

**Example (spider-man/01-origin.txt):**
```
• Peter Parker — shy teen, Forest Hills, Queens; lives with Aunt May and Uncle Ben
• Brilliant science student, bullied by Flash Thompson at school
• School field trip → radioactive spider bite at a particle research lab
• New powers: spider-sense (skull vibration), wall-crawling, super strength, perfect vision
• Built mechanical web-shooters himself (not biological)
• Sought fame first — "Spider-Man" wrestling ring persona for money
• Let a thief escape ("not my problem") → same thief later murders Uncle Ben
• Grief + guilt → Uncle Ben's words: "With great power comes great responsibility"
• Becomes the Friendly Neighborhood Spider-Man, patrolling Queens and Manhattan
```

---

### Read Aloud Format Specification

**Purpose:** Parent reads this straight off the screen to their 6-year-old at bedtime or
story time. It must FEEL like a picture book being read aloud.

**Format:**
- 3–5 paragraphs, 200–320 words total
- Written for the VOICE — short sentences, natural pauses, dramatic rhythm
- Warm narrator tone, like the best picture books (think Mo Willems cadence, or
  "The Gruffalo" pacing — playful but gripping)
- Direct address is allowed sparingly: "And do you know what happened next?" or "Can you
  imagine that?"
- Preserve ALL proper nouns from the original (names, places, artifacts, villains)
- Keep the authentic origin beat if iconic (Uncle Ben's death, Krypton's destruction, etc)
  — tasteful, quiet sadness, never graphic
- End with a one-sentence "And that is how..." or "From that day on..." closing line
- Do NOT mention "in the comics" or "in the MCU" — speak as if the events are real history

**Example opening paragraph voice (spider-man/01-origin.txt):**
```
Once upon a time, in a cozy house in Forest Hills, Queens, there lived a boy named Peter
Parker. He wasn't a popular kid — not the kind who won races or got cheered at lunch. He
was the kind of boy who read science books for fun and knew exactly how spider silk was
made. But Peter was about to find out that being different... is sometimes a superpower
in disguise.
```

---

## Step 3 — Commit Strategy

**Commit after every hero/group completes — do not batch everything into one commit.**

Use this commit message format per hero:
```
content(stories): TLDR + read-aloud for {hero-name} ({N} stories)
```

For ensemble groups:
```
content(stories): TLDR + read-aloud for The Avengers (12 stories)
content(stories): TLDR + read-aloud for Thanos (5 stories)
```

Push after each commit so progress is visible incrementally.

---

## Step 4 — Final Verification

After all 27 workstreams complete:

1. Run `find webapp/superhero-repo -name "*.tldr.txt" | wc -l` — should be ~242
2. Run `find webapp/superhero-repo -name "*.readaloud.txt" | wc -l` — should be ~242
3. Run `npm run build` from `webapp/` — must pass with zero errors
4. Deploy: `vercel --prod` from `webapp/`

---

## Parallelization Blueprint

Spawn one agent per workstream below **simultaneously**:

| # | Workstream | Stories |
|---|-----------|---------|
| 1 | marvel/spider-man | 10 |
| 2 | marvel/iron-man | 10 |
| 3 | marvel/thor | 10 |
| 4 | marvel/captain-america | 10 |
| 5 | marvel/hulk | 10 |
| 6 | marvel/black-widow | 10 |
| 7 | marvel/black-panther | 10 |
| 8 | marvel/doctor-strange | 10 |
| 9 | marvel/hawkeye | 10 |
| 10 | marvel/ant-man | 10 |
| 11 | marvel/scarlet-witch | 5 |
| 12 | marvel/vision | 5 |
| 13 | marvel/falcon | 5 |
| 14 | marvel/winter-soldier | 5 |
| 15 | marvel/star-lord | 5 |
| 16 | dc/batman | 10 |
| 17 | dc/superman | 10 |
| 18 | dc/wonder-woman | 10 |
| 19 | dc/the-flash | 10 |
| 20 | dc/aquaman | 10 |
| 21 | dc/green-lantern | 10 |
| 22 | dc/batgirl | 10 |
| 23 | dc/shazam | 10 |
| 24 | dc/cyborg | 10 |
| 25 | dc/martian-manhunter | 10 |
| 26 | avengers (ensemble) | 12 |
| 27 | thanos (ensemble) | 5 |

Each workstream agent:
1. Reads each `.txt` file in its directory
2. Generates `.tldr.txt` and `.readaloud.txt` for every story
3. Writes files to disk
4. `git add` + `git commit` + `git push` for that hero

The code changes in Step 1 can run as a 28th parallel task if the agent framework supports
it, but must be committed before the final build/deploy step.

---

## Content Quality Rules

- Audience for Read Aloud: 6-year-old child
- Audience for TLDR: adult parent who knows comics but needs a quick memory refresh
- No filler, no purple prose in TLDR — every word must be a loadable fact
- No gore, no graphic death in Read Aloud — death is quiet sadness, not horror
- Villains: mischievous-to-menacing, scheme and lose, never torture
- All canon proper nouns must be preserved (Mjolnir, Vibranium, Batcave, Krypton, etc.)
- LORE SHEET — preserve these exactly:
  - Thor: Mjolnir (worthiness enchantment) + Stormbreaker (forged in dying star by Eitri)
  - Cap: Vibranium shield bounces back, made from Wakandan ore
  - Iron Man: Arc Reactor in chest — powers suit AND keeps him alive
  - Tesseract: glowing blue cube, one of the six Infinity Stones
  - Joker: purple suit, orange tie, bright green hair, huge red smile, "HA HA HA"
  - Two-Face: split charcoal/purple suit, silver coin, one side happy / one uncertain
  - Green Goblin: orange glider, glowing goblin mask, purple costume, pumpkin bombs
  - Venom: black symbiote goo, enormous white eyes, huge teeth — anti-hero, not pure evil
