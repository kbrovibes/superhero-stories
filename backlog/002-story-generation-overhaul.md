# 002 — Story Generation Overhaul

**Status:** backlog
**Estimate:** 1220 minutes
**Created: 2026-05-13**

## Summary
The current story repository contains 108 stories that are too short (~100 words) and lack descriptive detail. We are transitioning to a new standard: ~300 words, 4-5 paragraphs, rich in factual trivia and character-specific lore. This overhaul also includes a move from simple numeric filenames (`1.txt`) to descriptive prefixed filenames (`01-origin.txt`).

## Task Breakdown
| # | Task | Minutes |
|---|------|---------|
| 1 | Update `webapp/lib/stories.ts` to support descriptive prefixed filenames | 30 |
| 2 | Rewrite Spider-Man stories (Origin, Villain 1, Villain 2, Lore, Teamwork) | 60 |
| 3 | Rewrite Iron Man stories | 60 |
| 4 | Rewrite remaining 8 Marvel heroes | 480 |
| 5 | Rewrite 10 DC heroes | 500 |
| 6 | Rewrite 8 Avengers ensemble stories | 60 |
| 7 | Update `generate-repo.sh` with new content and logic | 30 |
| **Total** | | **1220** |

## Spec
### Story Standards
- **Word Count:** 250 - 350 words.
- **Structure:** 4-5 paragraphs.
- **Tone:** Engaging, factual, and serious but safe for 7-year-olds.
- **Details:** Must include specific trivia (e.g., Uncle Ben's name, Aunt May, Queens, specific lab types, dummy suits, etc.).

### Filename Convention
Files should be renamed using a `NN-kebab-description.txt` format:
- `01-origin.txt`
- `02-villain-1.txt`
- `03-villain-2.txt`
- `04-lore.txt`
- `05-teamwork.txt`

### Implementation Rules
- Process one hero at a time.
- As a hero's stories are rewritten and saved with the new filenames, the corresponding old `N.txt` files must be deleted.
- The web application must be updated to dynamically find these files based on their numeric prefix to avoid broken links during the transition.
