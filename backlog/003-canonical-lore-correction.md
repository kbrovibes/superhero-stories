# 003 — Canonical Lore Correction & Parallel Overhaul

**Status:** backlog
**Estimate:** 600 minutes
**Created:** 2026-05-13

## Summary
The initial story overhaul mistakenly reused Spider-Man's villains (Green Goblin, Venom) across other Marvel heroes. This task corrects that by ensuring every hero features their own canonical villains, factual lore, and unique teamwork contributions. Furthermore, files will be explicitly named based on their content (e.g., `02-red-skull.txt` instead of `02-villain-1.txt`) so the UI displays meaningful titles. The remaining heroes will be processed in parallel to expedite the overhaul, with continuous deployment to GitHub and Vercel.

## Task Breakdown
| # | Task | Minutes |
|---|------|---------|
| 1 | Fix corrupted Marvel heroes (Ant-Man, Black Panther, Black Widow, Captain America, Doctor Strange) with canonical villains/lore and explicit filenames. | 120 |
| 2 | Overhaul remaining Marvel heroes (Hawkeye, Hulk, Iron Man, Thor) in parallel. | 120 |
| 3 | Overhaul all 10 DC heroes in parallel. | 240 |
| 4 | Overhaul Avengers ensemble stories. | 60 |
| 5 | Run manual Vercel deployments after each batch. | 60 |
| **Total** | | **600** |

## Spec
### Story Standards
- **Word Count:** 250 - 350 words.
- **Structure:** 4-5 paragraphs.
- **Tone:** Engaging, factual, and serious but safe for 7-year-olds (mischievous villains, no trauma).
- **Details:** Must include accurate, hero-specific trivia from comic/movie canon.

### Explicit Naming Convention
Files must be named to describe their actual content, which the webapp will parse into the title:
- `01-origin.txt`
- `02-[villain-name].txt` (e.g., `02-red-skull.txt`)
- `03-[villain-name].txt` (e.g., `03-baron-zemo.txt`)
- `04-[lore-topic].txt` (e.g., `04-vibranium-shield.txt`)
- `05-[teamwork-event].txt` (e.g., `05-avengers-leadership.txt`)

### Implementation Rules
- Delete any existing `02-villain-1.txt` or `03-villain-2.txt` for the affected heroes.
- Ensure `superhero-repo` and `webapp/superhero-repo` are synchronized.
- Execute generation in parallel using subagents.
- Push to git and deploy to Vercel (`npx vercel deploy --prod --yes`) continuously.