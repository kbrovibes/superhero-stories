# 005 — Short / Detailed Story Versions with In-Page Toggle

**Status:** backlog
**Estimate:** 240 minutes (toggle infra) + content backfill (separate pass per hero)
**Created:** 2026-05-14

## Summary
Today every story has exactly one length — roughly 300–400 words, 4–5 paragraphs. That is the right size for a quick bedtime read, but a 7-year-old who has just been hooked on a hero often wants *more*: more named villains, more places, more lore, more "wait, what happened next". This backlog item adds a second, longer canonical version of every story (~600–800 words, 8–10 paragraphs) and a toggle on the story page so the reader can choose. **SHORT is the default** and the toggle preference is remembered across visits.

Crucially, the DETAILED version is longer *because it contains more verifiable facts and lore*, not because it pads the same beats with extra adjectives. If the SHORT version says "Tony built a suit in a cave", the DETAILED version names the warlord (Wong-Chiu / the Ten Rings), names Yinsen, describes the magnet keeping shrapnel out of Tony's heart, and explains why the Mark I crawled instead of flying. Same story, more density.

## Scope & Impact
- **Content:** ~108 new story files across `superhero-repo/marvel/`, `superhero-repo/dc/`, and `superhero-repo/avengers/` — one DETAILED sibling per existing SHORT story.
- **Data layer:** `webapp/lib/stories.ts` — extend `Story` to carry both `short` and `detailed` bodies; update both readers.
- **Route:** `webapp/app/[universe]/[hero]/[story]/page.tsx` and `webapp/app/avengers/[story]/page.tsx` — render both bodies, mount a small client toggle.
- **New component:** `webapp/components/StoryLengthToggle.tsx` — segmented control with `localStorage` persistence.
- Static export remains intact (`generateStaticParams` still drives all routes; toggle is client-only).

## Content Model

### File layout
For every existing SHORT file, add a sibling DETAILED file using a `.detailed.txt` infix:

```
superhero-repo/marvel/iron-man/
  01-origin.txt              ← SHORT (existing, untouched)
  01-origin.detailed.txt     ← DETAILED (new)
  02-villain-whiplash.txt
  02-villain-whiplash.detailed.txt
  ...
```

Rationale: keeping the SHORT filename unchanged means existing slugs, routes, and `generateStaticParams` output are preserved bit-for-bit. The DETAILED file is opt-in — if missing, the page silently falls back to SHORT-only (no toggle rendered).

### Content rules for DETAILED
Inherit every rule from `CLAUDE.md` ("Content Rules"), with these deltas:
- **Length:** 600–800 words, 8–10 paragraphs. Target ~2× the SHORT length.
- **Density:** at least **10 proper nouns** per story (vs. 5 for SHORT). Real names, real places, real artifacts, real mentors, real villains.
- **What "more" means — keep:** more *named* characters who matter (mentors, sidekicks, second-tier villains), more *specific* objects (model numbers, suit marks, weapon names, hideout names), more *cause-and-effect* (why X led to Y), one additional canonical beat that didn't fit in SHORT (e.g., for Spider-Man origin: the wrestling-ring money, the burglar Peter let pass).
- **What "more" does NOT mean:** no extra adjectives, no kid-pandering, no recap of what just happened a paragraph ago, no invented lore, no padded transitions ("And so, our hero…"). If a sentence doesn't add a noun, a fact, or a cause, it doesn't belong.
- **Tone parity:** same warm-narrator voice as SHORT. Tasteful canonical darkness (Uncle Ben, Krypton, Crime Alley) is allowed but never gory. Villains scheme and lose; they do not torture.
- **Internal consistency:** DETAILED must not contradict SHORT. It expands on the same continuity; it does not retcon.

### Acceptance bar for content (per file)
- 600–800 words.
- ≥10 distinct proper nouns.
- ≥1 named entity that does not appear in the SHORT version.
- Reads aloud cleanly to a 7-year-old in roughly 4–5 minutes.
- Passes the "delete this sentence — did we lose a fact?" test on every sentence.

## Toggle UX
- Segmented control on the story page, near the title: `[ Short ]  [ Detailed ]`. Active option is filled with the universe accent color; inactive is outlined.
- **Default:** SHORT.
- **Persistence:** stored in `localStorage` under key `story-length-pref` with values `"short" | "detailed"`. Read on mount; written on toggle.
- **Cross-story behavior:** the preference is global — if the reader picked DETAILED on Spider-Man's origin, Thor's origin also opens in DETAILED.
- **Fallback:** if the current story has no `*.detailed.txt` sibling, the toggle is not rendered and SHORT is shown.
- **No URL change.** Avoids doubling the static export and avoids preference being lost on share/back-button navigation.
- **No flash of wrong version.** Server renders both bodies; client hides one via CSS / state on mount. First paint shows SHORT (the default), preventing a flash when the user has no stored preference. For users with `"detailed"` stored, a one-frame swap is acceptable — do not block paint.

## Data Layer Changes

In `webapp/lib/stories.ts`:

```ts
export interface Story {
  id: string;
  number: number;
  title: string;
  short: string;             // was `body`
  detailed: string | null;   // null when no *.detailed.txt sibling exists
}
```

`getHeroStories` and `getAvengersStories` must:
1. List `.txt` files, **excluding** `.detailed.txt`, sort alphabetically. (This preserves story order — the slug prefix `01-`, `02-`… still drives ordering, and we don't want detailed files to interleave.)
2. For each SHORT file `NN-slug.txt`, look for a sibling `NN-slug.detailed.txt`. If present, read it into `detailed`; otherwise `detailed = null`.
3. Rename the existing `body` field to `short` everywhere it is consumed (only the story pages today).

## Component: StoryLengthToggle
- Lives at `webapp/components/StoryLengthToggle.tsx`, marked `"use client"`.
- Props: `{ hasDetailed: boolean }`.
- Renders nothing if `!hasDetailed`.
- Manages a `pref` state (`"short" | "detailed"`), hydrated from `localStorage` in a `useEffect`.
- Communicates with the page via a small mechanism — pick one:
  - **(a)** lift state to a client wrapper around the body and pass children for both versions (cleanest);
  - **(b)** toggle a `data-length="short|detailed"` attribute on `<main>` and use CSS `[data-length="short"] .body-detailed { display: none }`.
  - Prefer **(a)**; it keeps the DOM honest and avoids shipping both bodies into the visible accessibility tree.

## Implementation Steps
| # | Task | Minutes |
|---|------|---------|
| 1 | Extend `Story` type in `lib/stories.ts`; rename `body` → `short`; add `detailed` loader and the `.detailed.txt` exclusion in the file filter. | 30 |
| 2 | Add `StoryLengthToggle.tsx` client component + `StoryBodySwitcher.tsx` client wrapper that renders SHORT or DETAILED based on toggle state + `localStorage` persistence. | 60 |
| 3 | Update `app/[universe]/[hero]/[story]/page.tsx` to pass both bodies to the switcher, mount the toggle near the title, hide toggle when `detailed === null`. | 30 |
| 4 | Mirror the page changes in `app/avengers/[story]/page.tsx`. | 20 |
| 5 | Style toggle to match liquid-card aesthetic; accent color per universe (Marvel red/gold, DC blue/gold, Avengers purple/gold). | 30 |
| 6 | Manual QA: SHORT default on first visit, persistence across navigation, fallback when sibling is missing, static build (`next build`) succeeds, no hydration warnings. | 30 |
| 7 | Write a one-shot generator prompt + checklist for the content backfill (separate from this PR's code work). | 40 |
| **Total (code)** | | **240** |

### Content backfill (separate effort, tracked here)
- 100 hero stories (10 Marvel heroes × 5 + 10 DC heroes × 5) + 8 Avengers ensemble = **108 DETAILED files**.
- Suggested cadence: one hero (5 files) per batch so each batch can be reviewed for canon accuracy and tone in one sitting.
- Each batch: ~15–20 minutes of review per hero after generation. Total review load ≈ 5–6 hours across the full backfill.
- The generator should consume the existing SHORT file plus the hero's other SHORT files (for continuity) and emit the DETAILED file in place. It must not modify the SHORT file.

## Spec — full detail for a remote agent

### 1. File-system contract
- Source of truth remains `superhero-repo/`. The webapp continues to read at build time only.
- A DETAILED file is *exactly* the SHORT filename with `.txt` replaced by `.detailed.txt`. No other naming variant is accepted.
- The file listing in `getHeroStories` / `getAvengersStories` must filter `f.endsWith(".txt") && !f.endsWith(".detailed.txt")` so the detailed siblings do not become their own story entries.

### 2. Type & reader changes (`webapp/lib/stories.ts`)
- Replace `body: string` with `short: string` and `detailed: string | null`.
- For each SHORT file at `<dir>/<slug>.txt`, compute the sibling path `<dir>/<slug>.detailed.txt`. Use `fs.existsSync` then `fs.readFileSync(..., "utf-8").trim()`; assign `null` when absent.
- Do **not** add a separate "list detailed stories" API — DETAILED is always an attribute of a SHORT story, never its own route.

### 3. Page changes
For both `[universe]/[hero]/[story]/page.tsx` and `avengers/[story]/page.tsx`:
- Replace the existing body renderer block with `<StoryBodySwitcher short={current.short} detailed={current.detailed} />`.
- Mount `<StoryLengthToggle hasDetailed={current.detailed !== null} />` directly under the title, above the body. Right-aligned or centered — match the existing typographic rhythm.
- Server renders both `<div className="body-short">` and (when present) `<div className="body-detailed">` inside the switcher; the client toggle decides which one is visible. SHORT visible on first paint.

### 4. Client toggle behavior
- `localStorage` key: `story-length-pref`. Values: `"short" | "detailed"`. Anything else is treated as `"short"`.
- On mount: read pref, set state, update visible body. If the current story has no DETAILED, ignore stored pref for *this* story (still show SHORT) but do not clear the global pref.
- On click: update state, write pref, no navigation.
- Toggle must be keyboard-accessible (tab-focusable, Enter/Space activates, `aria-pressed` reflects state).

### 5. Static export integrity
- `generateStaticParams` is unchanged in both pages — still one route per SHORT story, no new routes for DETAILED.
- `next build` must produce the same number of HTML pages as before. Each page is larger (it embeds two bodies when DETAILED exists), but route count is identical.

### 6. Visual styling
- Use existing CSS variables (`--surface`, `--border`, `--text-primary`, `--text-muted`) and the universe accent (`THEME[universe].accent`).
- Inactive button: transparent background, 1px solid `var(--border)`, `--text-muted` text.
- Active button: background = accent, text = white/black depending on accent contrast, no border.
- Pill shape: `border-radius: 999px`, padding `6px 14px`, font-size 12, font-weight 700, `text-transform: uppercase`.
- Container: inline-flex, 4px gap, sits inline near the `1 / 5` chip already on the page — they should look like siblings.

### 7. Content generation guidelines (for the backfill agent)
When writing a DETAILED file, the agent must:
- Read the corresponding SHORT file in full and treat it as canon for this app.
- Read all other SHORT files in the same hero directory to maintain continuity (names, items, mentors should match).
- Produce 600–800 words, 8–10 paragraphs.
- Include every named entity from the SHORT version + at least one new canonical named entity.
- Add at least one new canonical beat (e.g., a second villain encounter that didn't fit, a named sidekick moment, a specific item being forged or repaired).
- Never invent lore. If unsure, prefer omission over fabrication.
- Output only the story body — no title, no header, no metadata.
- Save as `<slug>.detailed.txt` next to the SHORT file.

### 8. Out of scope (do not do in this item)
- A "very short" or "tiny" third length.
- Audio narration, TTS, or any media.
- Per-story toggle (preference is global by design).
- Server-side preference (no cookies, no auth, no DB — this app stays fully static).
- Changing existing SHORT content.

## Open Questions
- Should the toggle label be "Short / Detailed", "Quick / Full", or "Short / Long"? Recommendation: **Short / Detailed** — most honest to what they are.
- Should we surface on the hero index page that a story has a DETAILED version available? Recommendation: **no** for v1 — keep the index uncluttered; let discovery happen on the story page.
