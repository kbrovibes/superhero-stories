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
```

## Content Rules
- Audience: 7-year-old. Tone: warm narrator, like a great picture-book biography.
- Stories are factual to canonical comics/MCU lore — real names, places, items, mentors, villains.
- Authentic origin beats are allowed when iconic (Uncle Ben's death, Krypton's destruction, the Wayne murder in Crime Alley, the Stark cave). Keep them tasteful: no gore, no graphic violence, no nightmare imagery. Death is a quiet sadness, not a horror beat.
- Villains are mischievous-to-menacing, but never sadistic. They scheme, fight, lose. They do not torture.
- Word target: 300–400 words per story, 4–5 paragraphs.
- No filler adjectives, no "super-duper amazing" kid-pandering. Density of named-entities matters: at least 5 proper nouns per story (people, places, items).

## Story Structure Per Hero
| File                     | Theme                              |
|--------------------------|------------------------------------||
| 01-origin.txt            | Origin — the "how"                 |
| 02-villain-<name>.txt    | Villain encounter 1                |
| 03-villain-<name>.txt    | Villain encounter 2                |
| 04-<artifact>.txt        | Artifact / lore / world-building   |
| 05-teamwork-<topic>.txt  | Teamwork / lesson                  |

## Key Lore to Preserve
- Thor: Mjolnir (worthy enchantment) + Stormbreaker (forged in a dying star by Eitri)
- Cap: Vibranium shield bounces back
- Iron Man: Arc Reactor in chest powers his suit and keeps him alive
- Tesseract: glowing blue cube; one of the Infinity Stones
- Infinity Stones: six colors, six powers
- Joker: purple suit, orange tie, bright green hair, huge red smile, "HA HA HA"
- Two-Face: split charcoal/purple suit, silver coin, one happy face / one uncertain
- Green Goblin: orange glider, glowing goblin mask, purple costume, pumpkin bombs
- Venom: black goo, enormous white eyes, huge teeth — misunderstood, not evil

## Web App Rules
- Data source: `superhero-repo/**/*.txt` read with `fs` at build time only.
- All routes use `generateStaticParams` — zero server runtime needed.
- Transitions: Framer Motion page animations (slide or fade).
- Palettes: Marvel = red/gold, DC = blue/gold, Avengers = purple/gold.
- Hero tiles on homepage; story rows on hero page; full text on story page.
- Story files use slug naming: `01-origin.txt`, `02-villain-<name>.txt`, etc.
- `lib/stories.ts` reads all `*.txt` files in each hero directory, sorted alphabetically; derives `id` and `title` from the filename slug.

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