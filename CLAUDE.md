# Superhero Story Repository — Project Context

## What This Is
A story database for a 7-year-old, presented as a static web app.
Stories are plain `.txt` files; the app reads them at build time and generates a fully static site.

## Repository Layout
```
superhero-repo/
  marvel/   10 heroes, 5 stories each
  dc/       10 heroes, 5 stories each
  avengers/ 8 multi-hero ensemble stories
generate-repo.sh   Regenerates all story files from scratch
```

## Content Rules (NEVER break these)
- No death, no tragedy, no scary trauma.
- Villains are mischievous, never violent or scary.
- Orphan backstories → "raised by a loving family" or "started a new journey."
- Audience is 7 years old. Language must be simple and joyful.
- Each story ~80-100 words.

## Story Structure Per Hero
| File  | Theme                              |
|-------|------------------------------------|
| 1.txt | Origin — the "how"                 |
| 2.txt | Villain encounter 1                |
| 3.txt | Villain encounter 2                |
| 4.txt | Artifact / lore / world-building   |
| 5.txt | Teamwork / lesson                  |

## Key Lore to Preserve
- Thor: Mjolnir (worthy enchantment) + Stormbreaker (forged in a dying star)
- Cap: Vibranium shield bounces back
- Iron Man: Arc Reactor in chest powers his suit and ideas
- Tesseract: glowing blue cube; one of the Infinity Stones
- Infinity Stones: six colors, six powers
- Joker: purple suit, orange tie, bright green hair, huge red smile, "HA HA HA"
- Two-Face: split charcoal/purple suit, silver coin, one happy face / one uncertain
- Green Goblin: orange glider, glowing goblin mask, purple costume
- Venom: black goo, enormous white eyes, huge teeth — misunderstood, not evil

## Web App Rules
- Data source: `superhero-repo/**/*.txt` read with `fs` at build time only.
- All routes use `generateStaticParams` — zero server runtime needed.
- Transitions: Framer Motion page animations (slide or fade).
- Palettes: Marvel = red/gold, DC = blue/gold, Avengers = purple/gold.
- Hero tiles on homepage; story cards on hero page; full text on story page.
- If stories are refreshed and the app is rebuilt, new content appears automatically.

## Refreshing Stories
Run `bash generate-repo.sh` to regenerate all 108 story files, then redeploy.

---

## Backlog Rules

When the user says "add to backlog", "save for later", "file this", "put this in the backlog", or any similar intent:

### NEVER do this
- Do **not** run `gh issue create` or create any GitHub issue.
- Do **not** create an unnumbered file like `backlog/some-feature.md`.

### Always do this
1. **Look up the next number** — run `ls backlog/` and find the highest `NNN-` prefix, then increment by 1. Start at `001` if backlog is empty.
2. **Create** `backlog/NNN-kebab-title.md` — zero-padded 3-digit number, kebab-case title.
3. **Use the template** — every entry must have all five sections below.

### Required file template
```markdown
# NNN — Title

**Status:** backlog
**Estimate:** X minutes
**Created:** YYYY-MM-DD

## Summary
One paragraph describing what this is and why it matters.

## Task Breakdown
| # | Task | Minutes |
|---|------|---------|
| 1 | ... | X |
| 2 | ... | X |
| **Total** | | **X** |

## Spec
Full implementation detail — enough for a remote Claude agent to execute
with no additional context from the original conversation.
```

### Finding the next number (shell one-liner)
```bash
ls backlog/*.md 2>/dev/null | grep -oP '^\d+' | sort -n | tail -1
# then add 1, zero-pad to 3 digits
```
