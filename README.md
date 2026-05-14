# Superhero Story Repository

A story database for young heroes-in-training — 108 original stories across 20 heroes, presented as a fully static web app.

## What's inside

| Universe | Heroes | Stories |
|----------|--------|---------|
| Marvel | Iron Man, Spider-Man, Thor, Captain America, Black Panther, Hulk, Black Widow, Doctor Strange, Hawkeye, Ant-Man | 50 |
| DC | Batman, Superman, Wonder Woman, The Flash, Green Lantern, Aquaman, Shazam, Cyborg, Batgirl, Martian Manhunter | 50 |
| Avengers | Multi-hero ensemble | 8 |

## Story structure (per hero)

| File | Theme |
|------|-------|
| `1.txt` | The Origin |
| `2.txt` | First Villain Encounter |
| `3.txt` | Second Villain Encounter |
| `4.txt` | Artifacts & Lore |
| `5.txt` | Teamwork & Lesson |

## Running the web app

```bash
cd webapp
npm install
npm run dev        # local dev server
npm run build      # static export to webapp/out/
```

## Refreshing stories

```bash
bash generate-repo.sh   # regenerates all 108 .txt files
cd webapp && npm run build  # rebuild the static site
```

The app reads story files at build time — push new stories and redeploy, and they appear automatically.

## Content rules

- Audience: 7-year-olds
- No death, no tragedy, no scary trauma
- Villains are mischievous, never violent
- Each story ~80–100 words
