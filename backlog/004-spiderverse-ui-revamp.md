# 004 — Spider-Verse UI Revamp

**Status:** backlog
**Estimate:** 180 minutes
**Created:** 2026-05-13

## Background & Motivation
The current UI is functional but lacks visual excitement. To better match the energetic and imaginative superhero stories, we are redesigning the app with a sleek, modern aesthetic inspired by "Spider-Verse" visuals. This involves shifting from a simple list layout to a vibrant, dynamic grid of square cards.

## Scope & Impact
This redesign affects the global stylesheet (`globals.css`), the main landing page (`app/page.tsx`), the hero and story pages, and shared components like `HeroCard` and `NavBar`. 

## Proposed Solution: CSS + Framer Motion
We will use advanced CSS features combined with Framer Motion to achieve the desired effect without the heavy performance cost of WebGL:
1.  **Chromatic Aberration:** Implementing a `.spider-glitch` CSS class using `text-shadow` to create red/cyan color splitting on hover or for primary headings.
2.  **Halftone Patterns:** Adding a subtle comic-book style dot pattern overlay to backgrounds and cards using `radial-gradient` backgrounds.
3.  **Bold Typography & Layout:** 
    *   Transitioning from a 1-column list to a responsive 3-column grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) for the homepage and story lists.
    *   Updating `HeroCard` to be perfectly square (e.g., using `aspect-ratio: 1 / 1`), featuring bold typography and glowing borders on hover.
4.  **Immersive Animations:** Utilizing Framer Motion for smooth scaling, tilting, and subtle "glitching" when interacting with cards.

## Implementation Steps
| # | Task | Minutes |
|---|------|---------|
| 1 | Update `globals.css` with new variables, halftone patterns, and glitch utilities. | 30 |
| 2 | Redesign `components/HeroCard.tsx` to a square layout with Framer Motion hover effects. | 45 |
| 3 | Redesign `app/page.tsx` to use the 3-column grid layout for hero categories. | 30 |
| 4 | Redesign `components/NavBar.tsx` and update typography/spacing on Hero/Story pages. | 45 |
| 5 | Test static build and verify responsive behavior across devices. | 30 |
| **Total** | | **180** |

## Verification
- Run `npm run dev` and visually inspect the 3-column grid and square cards.
- Hover over cards to ensure chromatic aberration and scaling animations work smoothly.
- Run `npm run build` to ensure the new CSS/components compile cleanly for static export.