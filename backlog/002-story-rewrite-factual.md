# 002 — Factual Story Rewrite: 300-Word Lore-Accurate Narratives

**Status:** backlog
**Estimate:** 455 minutes
**Created:** 2026-05-14

## Summary

Rewrite the entire superhero story corpus (108 stories: 50 Marvel, 50 DC, 8 Avengers) from shallow 80-word filler to factual, lore-accurate narratives targeting a 7-year-old audience. The quality bar is set by `SAMPLE-STORY.md` (Spider-Man origin): 300–400 words, 4–5 paragraphs, real named characters/places/items, authentic emotional beats (Uncle Ben's death, Crime Alley, Krypton's destruction). The file naming system changes from numeric (`1.txt`–`5.txt`) to descriptive slugs (`01-origin.txt`, `02-villain-<name>.txt`, etc.), requiring updates to `lib/stories.ts` and all app pages that link to stories by number.

## Task Breakdown

| # | Task | Minutes |
|---|------|---------|
| 1 | Create backlog spec file and commit | 5 |
| 2 | Update CLAUDE.md content rules | 5 |
| 3 | Update `lib/stories.ts` for dynamic file reading with slug-based IDs | 15 |
| 4 | Update app pages (story routes, avengers routes) for `story.id` links | 20 |
| 5 | Write Marvel stories (10 heroes × 5 = 50 stories) | 180 |
| 6 | Write DC stories (10 heroes × 5 = 50 stories) | 180 |
| 7 | Write Avengers ensemble stories (8 stories) | 30 |
| 8 | Delete old `N.txt` files, run build verification, commit per universe | 15 |
| 9 | Delete `generate-repo.sh`, final push to main | 5 |
| **Total** | | **455** |

## Spec

See original conversation for full per-hero lore checklists and implementation details.