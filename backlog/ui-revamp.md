# UI Revamp Spec — Cinematic Dark Editorial

**Status:** Backlog  
**Target app:** `webapp/` (Next.js App Router, static export, Framer Motion already installed)  
**Do not change:** route structure, data layer (`lib/stories.ts`), story `.txt` files, `generate-repo.sh`

---

## 1. Design Direction

Replace the current "saturated flat color blocks" aesthetic with a **cinematic dark editorial** style.
Reference: HBO Max / Apple TV+ / Letterboxd.
End user is an adult (the parent), not a child. Sophisticated, dark, immersive.

**Do NOT:**
- Use bright saturated Tailwind color classes like `bg-red-700`, `bg-blue-800`, `bg-purple-800` as backgrounds
- Use `text-yellow-400` as a primary accent on dark red surfaces
- Use opaque colored headers that span the full viewport
- Place back navigation in the middle of a colored banner where it blends in

---

## 2. Design Tokens

Create a CSS custom-property token system in `webapp/app/globals.css`.
Add these variables inside `:root`:

```css
:root {
  --bg:              #09090f;   /* page background — near black, cool blue undertone */
  --surface:         #111118;   /* default card background */
  --surface-raised:  #1c1c28;   /* card on hover / elevated state */
  --border:          rgba(255, 255, 255, 0.08);  /* all card borders */
  --border-hover:    rgba(255, 255, 255, 0.16);  /* border on hover */

  --text-primary:    #f0f0f8;   /* headings */
  --text-secondary:  #9ca3af;   /* labels, metadata, preview text */
  --text-muted:      #6b7280;   /* de-emphasized elements */

  /* Marvel */
  --marvel-accent:   #e63946;
  --marvel-surface:  #1a0609;
  --marvel-glow:     rgba(230, 57, 70, 0.20);

  /* DC */
  --dc-accent:       #4895ef;
  --dc-surface:      #060d1a;
  --dc-glow:         rgba(72, 149, 239, 0.20);

  /* Avengers */
  --av-accent:       #f4a261;
  --av-surface:      #150e06;
  --av-glow:         rgba(244, 162, 97, 0.20);
}
```

Set `body { background-color: var(--bg); color: var(--text-primary); }` in `globals.css`.

---

## 3. Remove / Replace in `lib/stories.ts`

The `universeTheme()` function currently returns raw Tailwind classes (`bg-red-700`, `text-yellow-400`).
**Replace its return type** to carry semantic tokens instead:

```ts
// Old approach — DELETE this pattern:
return { color: "bg-red-700", accent: "text-yellow-400" };

// New approach — return token identifiers:
export type UniverseTheme = "marvel" | "dc" | "avengers";
// Components will map universe → CSS var tokens directly.
// Remove the color/accent fields from the Hero interface.
```

Update the `Hero` interface: **remove** `color: string` and `accent: string`.
Components should derive styling purely from `hero.universe`.

---

## 4. New Component: `NavBar`

**File:** `webapp/components/NavBar.tsx`

A persistent top bar rendered on every page via `layout.tsx`. It is never hidden.

**Layout (horizontal flex, full width):**
```
[ ✦ Stories ]          [ Marvel  /  Iron Man  /  Story 3 ]          [ empty ]
  (left)                      (center, clickable breadcrumb)           (right)
```

**Breadcrumb data** is passed as a prop array:
```ts
interface Crumb { label: string; href?: string; }
// href omitted on the last (current) crumb — it renders as plain text
```

**Visual spec:**
- Background: `var(--surface)` with a 1px bottom border `var(--border)`
- Height: 52px
- Logo `✦ Stories`: `font-weight: 700`, `color: var(--text-primary)`, links to `/`
- Crumb separators: `/` in `var(--text-muted)`
- Active crumb (last): `var(--text-primary)`
- Parent crumbs: `var(--text-secondary)`, hover → `var(--text-primary)`, transition 150ms
- Animation: each breadcrumb crumb fades in left-to-right with 40ms stagger on mount (Framer Motion)

**Integration:** Add `<NavBar crumbs={[...]} />` as the first child in **each page's** JSX.
Do **not** put it in `layout.tsx` — each page constructs its own crumb array and passes it.

---

## 5. Homepage (`webapp/app/page.tsx`)

### 5a. Remove
- The large radial-gradient header banner
- The `✨ Story Repository ✨` label

### 5b. Tight page header (replace banner)
Left-aligned, 48px top padding, no background:
```
✦ Superhero Stories
  108 stories across Marvel, DC, and the Avengers.
```
`✦ Superhero Stories` — 28px, `font-weight: 800`, `color: var(--text-primary)`
Subtitle — 14px, `var(--text-secondary)`

NavBar crumbs: `[{ label: "Stories" }]` (single crumb, no href, not clickable)

### 5c. Universe sections
Each section: a label row + hero grid.

Label row:
```
────  MARVEL  ────────────────────────────────────  10 heroes
```
- `MARVEL` in 11px, `letter-spacing: 0.15em`, `var(--text-muted)`, `font-weight: 600`
- Horizontal rule lines: `1px solid var(--border)`, flex-grow
- Hero count badge: `var(--text-muted)`, 11px

Hero grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`, gap 12px

### 5d. Stagger animation (Framer Motion)
Wrap the entire grid in a `motion.div` with `variants` that staggers children:
```ts
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};
```
Each `HeroCard` is wrapped in `<motion.div variants={item}>`.
The container uses `initial="hidden" animate="show"`.

---

## 6. Redesigned `HeroCard` (`webapp/components/HeroCard.tsx`)

**Dimensions:** Full grid cell width, height ~140px (aspect-ratio or fixed).

**Visual layers (bottom to top):**
1. Background: `var(--surface)`
2. Left border: 3px solid, universe accent color (use inline style or a data attribute)
3. Content: emoji (40px) + hero name (14px bold) stacked, left-aligned, padding 16px

**No** solid colored background covering the whole card.

**Hover state (Framer Motion `whileHover`):**
- Background transitions to `var(--surface-raised)`
- Left border color: same accent but slightly brighter (increase L in HSL by ~10%)
- Box shadow: `0 0 0 1px var(--border-hover), 0 8px 24px var(--<universe>-glow)`
- `y: -3`, `transition: spring(stiffness:320, damping:22)`

**Universe → accent color mapping (inline styles, not class names):**
```ts
const theme = {
  marvel:   { accent: "var(--marvel-accent)",   glow: "var(--marvel-glow)" },
  dc:       { accent: "var(--dc-accent)",        glow: "var(--dc-glow)" },
  avengers: { accent: "var(--av-accent)",        glow: "var(--av-glow)" },
};
```

---

## 7. Hero Detail Page (`webapp/app/[universe]/[hero]/page.tsx`)

### 7a. Remove
The full-width colored banner with the huge background emoji watermark.

### 7b. New hero header (left-aligned, no full-width color block)
Layout: horizontal flex, `padding: 48px 24px 32px`, no background color.
```
[emoji 72px]   [Hero Name — 42px bold]
               [MARVEL UNIVERSE · 5 Stories — 13px muted]
```
A thin horizontal rule below (1px `var(--border)`) separates header from story list.

NavBar crumbs:
```ts
[
  { label: "Stories", href: "/" },
  { label: universe === "marvel" ? "Marvel" : "DC", href: `/${universe}` },  // not a real route yet, just back to "/" is fine
  { label: hero.name }
]
```
Note: the universe crumb can also just go to `/` for now since there's no separate universe index page.

### 7c. Story list
Each story is a row (not a colored box). Full width, with:
- Left: large story number `01` in 32px, `font-weight: 800`, `color: var(--<universe>-accent)` at 30% opacity
- Center: story title (16px bold, `var(--text-primary)`) + theme label below (12px, `var(--text-secondary)`)
- Right: `→` arrow, `var(--text-muted)`, transitions to `var(--text-primary)` on row hover
- Bottom border: `1px solid var(--border)` on each row except the last
- On hover: row background becomes `var(--surface)`, left accent bar (3px) slides in from left

**Stagger animation:** same container/item pattern as homepage, `staggerChildren: 0.08`

---

## 8. Redesigned `StoryCard` → becomes `StoryRow`

**Rename** the file to `webapp/components/StoryRow.tsx` and rewrite it as a horizontal list-row component (described in §7c above), not a colored card.

Update imports in all pages that use `StoryCard`.

---

## 9. Story Reader Page (`webapp/app/[universe]/[hero]/[story]/page.tsx`)

### 9a. Remove
The colored top bar (`bg-purple-800`, `bg-red-700`, etc.).

### 9b. NavBar crumbs
```ts
[
  { label: "Stories", href: "/" },
  { label: "Marvel",  href: "/" },          // or DC — goes to home for now
  { label: hero.name, href: `/${universe}/${heroId}` },
  { label: current.title }                  // current story, no href
]
```

### 9c. Progress bar
Directly below the NavBar: a thin (3px) full-width bar.
- Track: `var(--border)` (full width)
- Fill: universe accent color, width = `(storyIndex / totalStories) * 100%`
- Animated with `motion.div` `initial={{ width: 0 }} animate={{ width: "X%" }}` on mount, duration 0.5s ease-out

### 9d. Content area
Max-width 680px, centered, padding `40px 24px 80px`.

**Story number pill:** `03 / 05` — small pill, top of content, `var(--surface)` bg, `var(--text-muted)` text, border `var(--border)`, border-radius 999px.

**Title:** 36px, `font-weight: 800`, `var(--text-primary)`, margin-bottom 32px.
Animation: `initial={{ opacity:0, x: -16 }} animate={{ opacity:1, x:0 }}` duration 0.35s.

**Body text:** 
- Font size: 19px
- Line height: 1.85
- Color: `#d4d4e8` (warm off-white — easier to read than pure white)
- Each paragraph animates: `initial={{ opacity:0 }} animate={{ opacity:1 }}` with stagger 0.12s delay from title

### 9e. Bottom navigation
Two large buttons side-by-side (or full-width stacked on mobile):

```
[ ← The Origin ]                    [ Second Villain → ]
  prev story title                    next story title
```

Each button:
- Background: `var(--surface)`
- Border: `1px solid var(--border)`
- Hover: background `var(--surface-raised)`, border `var(--border-hover)`
- Border-radius: 12px
- Height: 72px
- Padding: 16px 20px
- Arrow + label: `var(--text-secondary)` arrow, `var(--text-primary)` title

When on the last story, the right button becomes **"Back to [Hero Name]"** linking to `/${universe}/${heroId}`.

---

## 10. Avengers Pages

Apply the **same patterns** as above:

- `webapp/app/avengers/page.tsx`: same layout as hero detail but with `--av-accent` / `--av-surface` / `--av-glow`
- `webapp/app/avengers/[story]/page.tsx`: same as story reader with Avengers tokens

NavBar crumbs for avengers listing:
```ts
[{ label: "Stories", href: "/" }, { label: "Avengers" }]
```

NavBar crumbs for avengers story:
```ts
[
  { label: "Stories", href: "/" },
  { label: "Avengers", href: "/avengers" },
  { label: current.title }
]
```

---

## 11. `PageTransition` component

Update `webapp/components/PageTransition.tsx`:
- **Remove** the `y` offset (it causes mild nausea on fast navigation)
- Keep only opacity fade: `initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}`
- Duration: 0.2s, ease: `"easeOut"`

---

## 12. `globals.css` updates

Add to `webapp/app/globals.css`:
```css
* { box-sizing: border-box; }

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar (webkit) */
::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }
```

Remove any default Tailwind `bg-zinc-50` or `bg-black` on `<main>` or `<body>` that may override `var(--bg)`.

---

## 13. Files to create / modify

| Action | File |
|--------|------|
| Modify | `webapp/app/globals.css` |
| Modify | `webapp/app/layout.tsx` |
| Modify | `webapp/app/page.tsx` |
| Modify | `webapp/app/[universe]/[hero]/page.tsx` |
| Modify | `webapp/app/[universe]/[hero]/[story]/page.tsx` |
| Modify | `webapp/app/avengers/page.tsx` |
| Modify | `webapp/app/avengers/[story]/page.tsx` |
| Modify | `webapp/components/HeroCard.tsx` |
| Modify | `webapp/components/PageTransition.tsx` |
| Rename + rewrite | `webapp/components/StoryCard.tsx` → `StoryRow.tsx` |
| Create | `webapp/components/NavBar.tsx` |
| Modify | `webapp/lib/stories.ts` (remove color/accent from Hero interface) |

---

## 14. What NOT to change

- `webapp/lib/stories.ts` — only remove the `color`/`accent` fields from `Hero`; keep all data-reading logic
- `webapp/next.config.ts` — keep `output: "export"`
- `webapp/superhero-repo/**` — all story `.txt` files
- Route structure — all URLs stay the same
- `generate-repo.sh` — no changes

---

## 15. Acceptance criteria

After the revamp:

1. Every page has the `NavBar` with a correct breadcrumb. No page is a dead end.
2. From any story, one click on the hero name crumb returns to that hero's story list.
3. No raw saturated color classes (`bg-red-700`, `bg-blue-800`, etc.) appear in any component.
4. All CSS colors reference `var(--...)` tokens or inline style universe mappings.
5. Hero tiles stagger in on the homepage (visually offset entrance, not all at once).
6. Story rows stagger in on the hero detail page.
7. The story reader has a visible progress bar and large, unmissable next/prev buttons.
8. `npm run build` completes with 133 static pages and zero TypeScript errors.
9. Deployed to Vercel — `vercel --prod` from `webapp/`.
