# 001 — UI Revamp: Cinematic Dark Editorial

**Status:** backlog
**Estimate:** 130 minutes
**Created:** 2026-05-13

## Summary

Replace the current saturated flat-color aesthetic with a cinematic dark editorial design. The end user is the parent (adult), not the child — so the target aesthetic is HBO Max / Apple TV+ / Letterboxd: dark, immersive, sophisticated. Key pain points to fix: eye-jarring colors everywhere, back navigation that is nearly invisible inside hero pages, and no persistent sense of "where am I."

## Task Breakdown

| # | Task | Minutes |
|---|------|---------|
| 1 | Add CSS custom-property token system to `globals.css` | 10 |
| 2 | Update `lib/stories.ts` — remove `color`/`accent` from `Hero` interface | 5 |
| 3 | Create `NavBar` component with animated breadcrumb | 15 |
| 4 | Wire NavBar into all pages (homepage, hero, story, avengers) | 10 |
| 5 | Redesign homepage: tight header, universe shelf labels, stagger animation | 20 |
| 6 | Redesign `HeroCard`: dark surface + accent left-border + glow hover | 15 |
| 7 | Rename `StoryCard` → `StoryRow`, rewrite as horizontal list row | 10 |
| 8 | Redesign hero detail page: left-aligned header, staggered story rows | 15 |
| 9 | Redesign story reader: progress bar, larger text, big prev/next buttons | 20 |
| 10 | Update avengers pages to match new patterns | 5 |
| 11 | Update `PageTransition`: fade only, remove y-offset | 5 |
| **Total** | | **130** |

## Spec

### Design direction
"Cinematic dark editorial." Reference: HBO Max, Apple TV+, Letterboxd.
No bright saturated color blocks as backgrounds. Color is used as accent only.

---

### Design Tokens

Add to `webapp/app/globals.css` inside `:root`:

```css
:root {
  --bg:              #09090f;
  --surface:         #111118;
  --surface-raised:  #1c1c28;
  --border:          rgba(255, 255, 255, 0.08);
  --border-hover:    rgba(255, 255, 255, 0.16);

  --text-primary:    #f0f0f8;
  --text-secondary:  #9ca3af;
  --text-muted:      #6b7280;

  --marvel-accent:   #e63946;
  --marvel-surface:  #1a0609;
  --marvel-glow:     rgba(230, 57, 70, 0.20);

  --dc-accent:       #4895ef;
  --dc-surface:      #060d1a;
  --dc-glow:         rgba(72, 149, 239, 0.20);

  --av-accent:       #f4a261;
  --av-surface:      #150e06;
  --av-glow:         rgba(244, 162, 97, 0.20);
}

body { background-color: var(--bg); color: var(--text-primary); }

::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }
```

---

### `lib/stories.ts` changes

Remove `color: string` and `accent: string` from the `Hero` interface.
Remove the `universeTheme()` helper function entirely.
Components derive styling from `hero.universe` directly using the CSS token map:

```ts
const THEME = {
  marvel:   { accent: "var(--marvel-accent)", surface: "var(--marvel-surface)", glow: "var(--marvel-glow)" },
  dc:       { accent: "var(--dc-accent)",     surface: "var(--dc-surface)",     glow: "var(--dc-glow)" },
  avengers: { accent: "var(--av-accent)",     surface: "var(--av-surface)",     glow: "var(--av-glow)" },
} as const;
```

Export this `THEME` map from `lib/stories.ts` so all components import it from one place.

---

### New component: `NavBar` (`webapp/components/NavBar.tsx`)

Persistent top bar rendered in each page's JSX (not in `layout.tsx` — each page builds its own crumb array).

Props:
```ts
interface Crumb { label: string; href?: string; }
interface NavBarProps { crumbs: Crumb[]; }
```

Visual spec:
- Height 52px, `background: var(--surface)`, `border-bottom: 1px solid var(--border)`
- Left: `✦ Stories` — bold, links to `/`
- Center: crumbs joined by `/` separators — last crumb plain text `var(--text-primary)`, parent crumbs are links `var(--text-secondary)` → hover `var(--text-primary)`
- Animation: each crumb `motion.span` with stagger `initial={{ opacity:0 }} animate={{ opacity:1 }}`, delay 40ms per crumb

Usage per page:
```tsx
// homepage
<NavBar crumbs={[{ label: "Stories" }]} />

// hero detail
<NavBar crumbs={[
  { label: "Stories", href: "/" },
  { label: "Marvel",  href: "/" },
  { label: hero.name }
]} />

// story reader
<NavBar crumbs={[
  { label: "Stories",  href: "/" },
  { label: "Marvel",   href: "/" },
  { label: hero.name,  href: `/${universe}/${heroId}` },
  { label: current.title }
]} />

// avengers list
<NavBar crumbs={[{ label: "Stories", href: "/" }, { label: "Avengers" }]} />

// avengers story
<NavBar crumbs={[
  { label: "Stories",   href: "/" },
  { label: "Avengers",  href: "/avengers" },
  { label: current.title }
]} />
```

---

### Homepage (`webapp/app/page.tsx`)

Remove: the large radial-gradient header banner.

Replace with a tight left-aligned header (48px top padding, no background):
```tsx
<h1>✦ Superhero Stories</h1>
<p>108 stories across Marvel, DC, and the Avengers.</p>
```
`h1`: 28px, weight 800, `var(--text-primary)`
`p`: 14px, `var(--text-secondary)`

Universe section labels:
```tsx
<div className="flex items-center gap-3">
  <div className="h-px flex-1 bg-[var(--border)]" />
  <span>MARVEL</span>   {/* 11px, tracking-widest, var(--text-muted) */}
  <div className="h-px flex-1 bg-[var(--border)]" />
  <span>10 heroes</span>  {/* badge */}
</div>
```

Hero grid stagger (Framer Motion):
```ts
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };
// <motion.div variants={container} initial="hidden" animate="show">
//   {heroes.map(h => <motion.div key={h.id} variants={item}><HeroCard hero={h} /></motion.div>)}
// </motion.div>
```

---

### `HeroCard` (`webapp/components/HeroCard.tsx`)

Full rewrite. No solid colored background.

```tsx
// Structure:
<motion.div whileHover={{ y: -3, scale: 1.02 }} style={{ boxShadow: `0 0 0 1px var(--border)` }}>
  <Link href={...}>
    <div style={{
      background: "var(--surface)",
      borderLeft: `3px solid ${THEME[hero.universe].accent}`,
      // on hover: boxShadow includes glow
    }}>
      <span>{hero.emoji}</span>   {/* 40px */}
      <span>{hero.name}</span>    {/* 14px bold, var(--text-primary) */}
    </div>
  </Link>
</motion.div>
```

Hover: background → `var(--surface-raised)`, boxShadow → `0 0 0 1px var(--border-hover), 0 8px 24px ${THEME[universe].glow}`

---

### `StoryCard` → `StoryRow` (`webapp/components/StoryRow.tsx`)

Delete `StoryCard.tsx`. Create `StoryRow.tsx` as a horizontal row.

```tsx
// Layout: full-width row, border-bottom: 1px solid var(--border), padding 16px 0
// Left:   story number "01" — 32px, weight 800, accent color at 30% opacity
// Center: title (16px bold) + theme label (12px, var(--text-secondary))
// Right:  → arrow, var(--text-muted), transitions to var(--text-primary) on hover
// Hover:  background var(--surface), left border 3px accent slides in
```

Update all imports of `StoryCard` in:
- `webapp/app/[universe]/[hero]/page.tsx`
- `webapp/app/avengers/page.tsx`

---

### Hero detail page (`webapp/app/[universe]/[hero]/page.tsx`)

Remove: full-width colored banner.

New hero header (left-aligned flex, `padding: 48px 24px 32px`, no background):
```tsx
<div className="flex items-center gap-6">
  <span style={{ fontSize: 72 }}>{hero.emoji}</span>
  <div>
    <h1>{hero.name}</h1>    {/* 42px, weight 800 */}
    <p>MARVEL UNIVERSE · 5 Stories</p>  {/* 13px, var(--text-muted) */}
  </div>
</div>
<hr style={{ borderColor: "var(--border)" }} />
```

Story list stagger: same container/item pattern as homepage with `staggerChildren: 0.08`.

---

### Story reader (`webapp/app/[universe]/[hero]/[story]/page.tsx`)

Remove: colored top bar.

Add below NavBar — progress bar:
```tsx
<motion.div
  style={{ height: 3, background: THEME[universe].accent }}
  initial={{ width: 0 }}
  animate={{ width: `${(storyIndex + 1) / stories.length * 100}%` }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
```

Content area: `max-width: 680px`, centered, `padding: 40px 24px 80px`.

Story number pill: `03 / 05` — small pill, `var(--surface)` bg, `var(--text-muted)`, border `var(--border)`, `border-radius: 999px`, `padding: 4px 12px`, `font-size: 12px`.

Title: 36px, weight 800. Animation: `initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}` duration 0.35s.

Body paragraphs:
- Font size: 19px, line-height: 1.85, color: `#d4d4e8`
- Each `<p>` is a `motion.p` with `initial={{ opacity:0 }} animate={{ opacity:1 }}` staggered 0.12s after title

Bottom nav — two large buttons side-by-side:
```tsx
// Left button: "← {prev.title}" or invisible placeholder
// Right button: "→ {next.title}" or "Back to {hero.name}"
// Each: height 72px, background var(--surface), border 1px solid var(--border),
//       border-radius 12px, padding 16px 20px
// Hover: background var(--surface-raised), border var(--border-hover)
```

---

### Avengers pages

Apply same patterns. Swap all universe-specific values for `--av-*` tokens.

- `webapp/app/avengers/page.tsx` — same layout as hero detail
- `webapp/app/avengers/[story]/page.tsx` — same as story reader

---

### `PageTransition` (`webapp/components/PageTransition.tsx`)

Remove y-offset. Fade only:
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2, ease: "easeOut" }}
```

---

### Files to touch

| Action | File |
|--------|------|
| Modify | `webapp/app/globals.css` |
| Modify | `webapp/app/page.tsx` |
| Modify | `webapp/app/[universe]/[hero]/page.tsx` |
| Modify | `webapp/app/[universe]/[hero]/[story]/page.tsx` |
| Modify | `webapp/app/avengers/page.tsx` |
| Modify | `webapp/app/avengers/[story]/page.tsx` |
| Modify | `webapp/components/HeroCard.tsx` |
| Modify | `webapp/components/PageTransition.tsx` |
| Modify | `webapp/lib/stories.ts` |
| Create | `webapp/components/NavBar.tsx` |
| Delete + Create | `webapp/components/StoryCard.tsx` → `StoryRow.tsx` |

---

### Acceptance criteria

1. Every page has `NavBar` with a correct breadcrumb. No page is a dead end.
2. From any story page, clicking the hero name crumb returns to that hero's list.
3. No raw Tailwind color classes (`bg-red-700`, `bg-blue-800`, etc.) in any component.
4. All colors via `var(--)` tokens or inline `THEME[universe].*` references.
5. Hero tiles stagger in on homepage (visually offset entrance).
6. Story rows stagger in on hero detail page.
7. Story reader has a visible progress bar and large, unmissable prev/next buttons.
8. `npm run build` from `webapp/` → 133 static pages, zero TypeScript errors.
9. `vercel --prod` from `webapp/` deploys cleanly.
