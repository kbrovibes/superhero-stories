# 006 — "Surprise Me!" Random Story Picker with Physics-Based Spinner

**Status:** backlog
**Estimate:** 300 minutes
**Created:** 2026-05-14

## Summary
A 7-year-old who can't decide which hero to read tonight should not have to scroll through 28 tiles to make up their mind. Add a **"Surprise Me!"** button on the homepage that opens a dedicated `/surprise` page. On that page sits a single big button (or wheel). **Press and hold** to start spinning through every hero+story combination in the library — heroes and titles flicker by, faster the longer you hold. **Release** and the spin slows under simulated friction until it lands on one specific story. The winner card animates in with a "Read this!" button that links straight to the story page.

The whole thing should *feel* like a carnival prize wheel, not a `Math.random()` lookup. Physics — angular momentum, friction, easing — is the point.

## Scope & Impact
- **New route:** `webapp/app/surprise/page.tsx` — a client component (interactive, no static params).
- **New components:** `SurpriseSpinner.tsx` (the press-and-hold spinner + physics), `SurpriseWinner.tsx` (the reveal card).
- **Homepage:** add a "Surprise Me!" CTA above or below the hero grid in `webapp/app/page.tsx`.
- **Data layer:** `webapp/lib/stories.ts` — add a helper that returns the **flat, build-time list** of every `(universe, heroId, heroName, heroEmoji, storyId, storyTitle)` tuple. This list is what the spinner cycles through.
- **Static export integrity:** preserved. The page itself is one new static route; the candidate list is baked into the bundle at build time.
- Stack: existing `framer-motion@^12.38.0` is already in deps — use its `useMotionValue`, `animate`, and `useAnimationFrame` for the physics. **No new dependency.**

## UX Spec

### Entry
- Homepage gets a single CTA: a big pill button reading **"Surprise Me!"** in the universe-neutral palette (purple/gold so it does not lean Marvel or DC). Sits centered, below the title block, above the universe sections.

### `/surprise` page layout
- Centered single-column page, same `NavBar` with crumb `["Surprise Me"]`.
- Below the nav: a short instruction line — `"Press and hold the button. Let go when you're ready."`
- Center of viewport: the **Spinner**.
- Bottom: a small `"Try again"` link, only visible after a winner has been revealed.

### The Spinner — three states
1. **Idle.** A large round button (~240px diameter) labeled **"HOLD ME"**. Subtle pulse/breathing animation so the kid knows it is alive. Above the button, a "viewport" strip shows one hero+story combo at a time (the next candidate), faintly visible.
2. **Spinning (pointer down).** Combos cycle through the viewport strip rapidly. Cycle speed *ramps up* the longer the user holds — slow first half-second, then accelerating, capped at ~60ms per combo so the text is still vaguely readable as a blur. Optional haptic vibration on mobile (`navigator.vibrate(10)` per cycle, max 30/sec).
3. **Coasting (pointer released).** No more user input. The cycle speed decays under simulated friction (see Physics below) until it stops on one combo. That combo is the winner. Transition to the **Winner** view.

### Winner view
- Spinner fades out, replaced by a **WinnerCard**: large emoji, hero name, story title, universe pill (Marvel/DC/Avengers accent), and a single primary button: **"Read this story →"** linking to `/{universe}/{heroId}/{storyId}` (or `/avengers/{storyId}`).
- Secondary link: **"Spin again"** resets to Idle.
- Confetti (CSS-only — no library) for ~1.2s when the winner appears. Triggered once, then settles.

## Physics Spec

This is the heart of the feature. Use Framer Motion's `useMotionValue` + `useAnimationFrame` so we can compute position per frame with real velocity/friction, not just keyframe interpolation.

### Model
- Track a single scalar **`position`** (in "candidate index units" — fractional, modulo the candidate list length). The displayed combo is `candidates[Math.floor(position) % candidates.length]`.
- Track **`velocity`** (candidates per second). Positive only — wheel spins one direction.

### Hold phase (pointer down)
- On `pointerdown`: record `holdStartedAt`.
- Each frame, increase `velocity` toward a max:
  - `targetVelocity = lerp(MIN_V, MAX_V, clamp01(holdDuration / RAMP_TIME))`
  - `velocity += (targetVelocity - velocity) * 0.15` (smoothed approach)
- Suggested constants:
  - `MIN_V = 4` (candidates/sec — readable trickle at start)
  - `MAX_V = 18` (candidates/sec — fully blurred)
  - `RAMP_TIME = 1500` (ms — full ramp at 1.5s hold)
- `position += velocity * dt` each frame.

### Release phase (pointer up)
- Stop updating `velocity` from input. Apply friction:
  - `velocity *= Math.pow(FRICTION_PER_SEC, dt)` where `FRICTION_PER_SEC = 0.35`. (Velocity drops to ~35% of itself per second. After ~4s the wheel is almost stopped.)
- Add a tiny **detent snap** when `velocity < 0.6`: ease `position` to the nearest integer over ~300ms (Framer `animate`). This is what makes it "click" into the winner instead of drifting to a random fractional spot.
- Stop condition: when the detent animation completes. That integer index is the winner. Persist it, transition to Winner view.

### Fairness
- The candidate list order should be **shuffled at mount time** (Fisher-Yates) so a fast/short hold doesn't favor the same hero every time. Shuffle is in-memory only; do not persist.
- No weighted bias toward any hero — every story has equal odds. (If you ever want to weight, do it later via a `weight` field on candidates; not in v1.)

### Anti-cheat / edge cases
- **Minimum hold time:** 250ms. Taps shorter than that are ignored (button "wiggles" but doesn't spin). Prevents accidental spins.
- **Maximum spin time:** none — a kid holding for 10 seconds just gets a longer, more dramatic deceleration.
- **Pointer cancel / pointer leave while held:** treat as release.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, skip the physics. Pressing the button picks a random winner instantly with a 400ms crossfade, and announces it via `aria-live="polite"`.

## Data Layer Changes

Add to `webapp/lib/stories.ts`:

```ts
export interface Candidate {
  universe: "marvel" | "dc" | "avengers";
  heroId: string | null;       // null for ensemble Avengers stories
  heroName: string;            // "The Avengers" for ensemble
  heroEmoji: string;
  storyId: string;
  storyTitle: string;
  href: string;                // pre-built link string
}

export function getAllCandidates(): Candidate[] { /* … */ }
```

`getAllCandidates`:
1. For each `universe` in `["marvel", "dc"]`: for each hero in `getHeroes(universe)`: for each story in `getHeroStories(universe, hero.id)`: push a Candidate with `href = /${universe}/${hero.id}/${story.id}`.
2. Append each `getAvengersStories()` entry with `heroId = null`, `heroName = "The Avengers"`, `heroEmoji = "🛡️"`, `href = /avengers/${story.id}`.
3. Return the flat array.

Called from `/surprise/page.tsx` (a server component that passes the array as a prop to the client spinner), so the full candidate list is serialized into the page HTML once at build time — no runtime fs.

## Component Sketch

### `app/surprise/page.tsx` (server component)
```tsx
import { getAllCandidates } from "@/lib/stories";
import SurpriseSpinner from "@/components/SurpriseSpinner";
import NavBar from "@/components/NavBar";

export const metadata = { title: "Surprise Me!" };

export default function SurprisePage() {
  const candidates = getAllCandidates();
  return (
    <>
      <NavBar crumbs={[{ label: "Surprise Me" }]} />
      <SurpriseSpinner candidates={candidates} />
    </>
  );
}
```

### `components/SurpriseSpinner.tsx` (client)
- `"use client"`.
- Props: `{ candidates: Candidate[] }`.
- State machine: `"idle" | "spinning" | "coasting" | "won"`.
- Owns `position` and `velocity` motion values; runs the per-frame loop with `useAnimationFrame`.
- Renders the viewport strip, the HOLD ME button, and switches to `<SurpriseWinner candidate={winner} onSpinAgain={...} />` in the `won` state.
- Pointer handlers: `onPointerDown`, `onPointerUp`, `onPointerCancel`, `onPointerLeave` (when captured).
- Use `e.currentTarget.setPointerCapture(e.pointerId)` on down so finger drift doesn't drop the spin.

### `components/SurpriseWinner.tsx` (client)
- Props: `{ candidate: Candidate; onSpinAgain: () => void }`.
- Big emoji (animated `scale` from 0.5 → 1 on mount with `type: "spring"`), universe-colored pill, hero name, story title, primary "Read this story →" link, secondary "Spin again" button, CSS confetti.

## Visual Style
- Match the existing **liquid morph** aesthetic — same CSS variables (`--surface`, `--border`, `--text-primary`), same `liquid-card` / `liquid-text` classes already in `globals.css`.
- HOLD ME button: 240×240px circle, accent purple/gold gradient, drop shadow that intensifies while pressed (transforms with `scale(0.96)` on hold).
- Viewport strip: 1 line tall, fixed-width, monospace-ish weight. Combos slide vertically (each new candidate enters from below). When spinning fast, motion-blur via `filter: blur(0.8px)` (kept subtle).
- Winner card: same `liquid-card` border-radius pattern as elsewhere; emoji ~96px.

## Accessibility
- The button must be reachable via keyboard (`Space` to start/hold, release to stop). Implement `onKeyDown`/`onKeyUp` mirroring pointer handlers.
- `aria-live="polite"` region announces "Spinning…" on hold, "[Hero Name]: [Story Title]" on win.
- All animations respect `prefers-reduced-motion` (instant pick, no spin).
- Winner card uses a real `<a href>` link, not a JS-only handler, so screen readers and right-click "open in new tab" work.

## Implementation Steps
| # | Task | Minutes |
|---|------|---------|
| 1 | Add `Candidate` type and `getAllCandidates()` to `lib/stories.ts`. Verify count = 108 (50 Marvel + 50 DC + 8 Avengers). | 30 |
| 2 | Create `app/surprise/page.tsx` as a server component that fetches candidates and renders the spinner. Add metadata. | 20 |
| 3 | Build `components/SurpriseSpinner.tsx`: state machine, viewport strip, HOLD ME button, pointer handlers, `useMotionValue`/`useAnimationFrame` loop with the hold-ramp and friction-decay physics described above. | 90 |
| 4 | Implement detent snap when velocity drops below threshold; finalize winner index; transition to `won` state. | 30 |
| 5 | Build `components/SurpriseWinner.tsx`: spring entrance, universe pill, "Read this story →" link, "Spin again" handler. CSS confetti (~30 absolutely positioned spans with random keyframe drifts). | 45 |
| 6 | Add "Surprise Me!" CTA on homepage (`app/page.tsx`) above the universe sections. | 15 |
| 7 | Reduced-motion fallback path: skip physics, pick random instantly, crossfade winner. | 20 |
| 8 | Keyboard support: Space-to-hold/release, focus-visible ring. | 20 |
| 9 | Manual QA across desktop mouse, touch (iPad), keyboard. Verify `next build` (static export) succeeds and `/surprise.html` exists in `out/`. | 30 |
| **Total** | | **300** |

## Spec — full detail for a remote agent

### 1. Files created
- `webapp/app/surprise/page.tsx` (server component, ≤30 LOC)
- `webapp/components/SurpriseSpinner.tsx` (`"use client"`, the bulk of the logic)
- `webapp/components/SurpriseWinner.tsx` (`"use client"`)

### 2. Files modified
- `webapp/lib/stories.ts` — add `Candidate` interface and `getAllCandidates()`. No change to existing exports.
- `webapp/app/page.tsx` — add "Surprise Me!" CTA. Use `<a href="/surprise">` styled as a liquid-card button. Place it in the centered intro block under the existing tagline paragraph.

### 3. Files NOT touched
- All story content files in `superhero-repo/`.
- `THEME` palette — reuse existing accents.
- All other hero/story routes.

### 4. Static export contract
- `/surprise` becomes a single static page at `out/surprise.html`.
- `getAllCandidates()` runs at build time; the resulting array is serialized into the page bundle as a prop, not refetched at runtime.
- `next build` must complete with no warnings, and route count = (existing) + 1.

### 5. Physics tuning targets (the kid-test)
- Holding for ≤500ms → spin lasts ~1.5s after release. Visible cycling, gentle slowdown, satisfying click into place.
- Holding for ~2s → spin lasts ~3.5s after release. Definite "wheee" feeling, harder to predict outcome.
- Holding for ≥4s → spin lasts ~4s after release (deceleration is capped by friction, not by hold time). Avoids tedious 15-second decays.
- The final 3–5 candidates of any spin should be readable (velocity has dropped enough). The very last transition into the detent should feel inevitable, not abrupt.
- If tuning feels off, adjust `MAX_V`, `RAMP_TIME`, and `FRICTION_PER_SEC` in that order. Do not change the model.

### 6. State machine transitions
```
idle      --pointerDown(>250ms)-->  spinning
spinning  --pointerUp/cancel-----> coasting
coasting  --velocity<0.6 + snap--> won
won       --"Spin again" click---> idle (re-shuffle candidates)
```

### 7. Confetti (CSS-only, no library)
Render ~30 `<span>` elements absolutely positioned over the winner card on mount, each with:
- random `--x` (horizontal start, -100% to 100%), `--rot` (rotation in degrees), `--dur` (1.0–1.6s), `--delay` (0–200ms).
- a keyframe animation that translates downward + sideways, rotates, fades out.
- removed from DOM after animation ends (e.g., via `setTimeout` in a `useEffect`).

### 8. Out of scope
- Persisting "stories you've been served" to avoid repeats (could come later as `localStorage.surprise-history`).
- Weighting by hero popularity, recency, or "kid hasn't seen this in a while".
- Server-side random (no need — this is a static site and randomness happens in the browser).
- Sound effects.
- A literal rotating wheel-of-fortune SVG. The viewport strip is the chosen visual; do not build a 360°-rotation wheel unless explicitly approved.
- Sharing the winner via URL (e.g., `/surprise?show=marvel/spider-man/01-origin`). v2 territory.

## Open Questions
- Button label: "Surprise Me!" vs "Random Story" vs "Spin!". Recommendation: **"Surprise Me!"** — most playful, matches the 7-year-old audience.
- Should the homepage CTA also live in `NavBar` so it's reachable from any page? Recommendation: **yes for v2, no for v1** — keep the first version's surface area small.
- Should an Avengers ensemble story count as one candidate or eight (since 8 heroes contribute)? Recommendation: **one** — it is one story, regardless of how many heroes are in it.
