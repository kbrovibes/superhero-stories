export const meta = {
  name: 'ensemble-content-fanout',
  description: 'Generate 10 multi-hero stories + 40 trivia for 4 ensembles (X-Men, Guardians, Justice League, Teen Titans)',
  phases: [{ title: 'Write ensembles' }],
};

const REPO = '/Users/karthik/claude/superhero-stories/webapp/superhero-repo';
const SCRIPTS = '/Users/karthik/claude/superhero-stories/webapp/scripts';

const ENSEMBLES = [
  { id: 'x-men', name: 'The X-Men', universe: 'marvel',
    roster: 'Professor X (Charles Xavier, telepath leader in a wheelchair), Cyclops (Scott Summers, optic blasts), Jean Grey (telepath/telekinetic), Storm (Ororo Munroe, weather), Wolverine (Logan, claws & healing), Beast (Hank McCoy, blue genius), Rogue (power-absorbing touch), Gambit (charged cards), Nightcrawler (teleporting BAMF)',
    canon: 'Mutants who train at the Xavier School for Gifted Youngsters and protect a world that fears them. Tools: the Danger Room, Cerebro, the Blackbird jet. Foes: Magneto and his Brotherhood, the giant robot Sentinels. Themes: found family, belonging, using gifts to protect everyone — even people who fear you.' },
  { id: 'guardians', name: 'Guardians of the Galaxy', universe: 'marvel',
    roster: 'Star-Lord (Peter Quill, blasters & a Walkman), Gamora (sword, green warrior), Drax (literal-minded strongman), Rocket (clever raccoon pilot), Groot (gentle tree, "I am Groot"), Nebula (blue cyborg, Gamora\'s sister)',
    canon: 'A ragtag band of misfits who become a family and protect the galaxy. They fly the Milano, guard a powerful Orb (the Power Stone), and stop the villain Ronan and the threat of Thanos. Set on worlds like Xandar and Knowhere. Themes: misfits becoming family, loyalty, "we are Groot."' },
  { id: 'justice-league', name: 'Justice League', universe: 'dc',
    roster: 'Superman (Clark Kent, Kryptonian powers), Batman (Bruce Wayne, detective & gadgets), Wonder Woman (Diana, Lasso of Truth), The Flash (Barry Allen, super-speed), Aquaman (Arthur Curry, king of Atlantis), Green Lantern (Hal Jordan, power ring), Cyborg (Victor Stone, tech), Martian Manhunter (J\'onn J\'onzz, shapeshifting telepath)',
    canon: 'Earth\'s greatest heroes who unite when no single hero is enough. They meet at the Hall of Justice / Watchtower. Foes: the tyrant Darkseid of Apokolips and his Parademons, the alien Brainiac, the Legion of Doom. Themes: teamwork, each hero\'s strength covering another\'s, protecting everyone.' },
  { id: 'teen-titans', name: 'Teen Titans', universe: 'dc',
    roster: 'Robin / Dick Grayson (acrobatic leader), Starfire (Koriand\'r, joyful alien with starbolts), Raven (calm empath, dark cloak), Beast Boy (green animal shapeshifter, jokester), Cyborg (Victor Stone, half-machine, the team\'s heart)',
    canon: 'Young heroes who live together in Titans Tower (a giant T on an island) and protect Jump City. Foes: the masked Slade, Brother Blood, and Raven\'s demon father Trigon (handled gently); Starfire\'s rival sister Blackfire. Themes: friendship, growing up, being a chosen family — and pizza.' },
];

const SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    id: { type: 'string' },
    slugs: { type: 'array', items: { type: 'string' }, minItems: 10, maxItems: 10 },
    storyFilesWritten: { type: 'integer' },
    triviaCount: { type: 'integer' },
    triviaValidJson: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['id', 'slugs', 'storyFilesWritten', 'triviaCount', 'triviaValidJson'],
};

function brief(e) {
  const dir = `${REPO}/${e.id}`;
  return `You are a children's-book author for a static "Superhero Stories" web app read by a 7-year-old. Produce the COMPLETE content package for ONE ENSEMBLE TEAM: **${e.name}** (id \`${e.id}\`, ${e.universe.toUpperCase()}).

These are MULTI-HERO ensemble stories (like the Avengers collection) — the whole team works together; no single hero is the sole star.

TEAM ROSTER (feature them together, by their real names): ${e.roster}
CANON & THEMES: ${e.canon}

# Study the house voice FIRST (read these)
- ${REPO}/avengers/02-assembling-the-team.txt  (ensemble main-story voice)
- ${REPO}/avengers/02-assembling-the-team.tldr.txt
- ${REPO}/avengers/02-assembling-the-team.readaloud.txt
- ${REPO}/avengers/02-assembling-the-team.storytime.txt
- ${REPO}/marvel/spider-man/01-origin.txt  (for length/density reference)

# Write 10 ensemble stories, each as FOUR files, into: ${dir}  (create it)
Filename pattern NN = 01..10 (zero-padded): \`NN-slug.txt\`, \`NN-slug.tldr.txt\`, \`NN-slug.readaloud.txt\`, \`NN-slug.storytime.txt\`. Choose short kebab-case slugs. Design a varied 10-story arc: how the team first comes together; settling into their base; a first shared mission; a clash with their signature foe; a story that spotlights two teammates working as a pair; a bigger saga; a moment of disagreement they overcome; a rescue that needs every member; a quieter character/friendship story; a finale about what makes them a family/team.

Each story's four files tell the SAME story at different lengths/voices:
1. \`NN-slug.txt\` — **380–460 words**, 4–5 paragraphs, **at least 5 proper nouns**, warm and dense, no filler.
2. \`NN-slug.tldr.txt\` — **7–9 bullets**, each line "• ", ~120–160 words, beats in order.
3. \`NN-slug.readaloud.txt\` — **420–470 words**, energetic, direct address, CAPS sound effects.
4. \`NN-slug.storytime.txt\` — **720–840 words** (never exceed 850), gentle bedtime cadence, soft landing.
40 files total. Use \`wc -w\` to verify ranges and rewrite any that miss.

CONTENT SAFETY: audience is 7. No gore, no graphic violence, no nightmare imagery. Loss is a quiet sadness. Fights are bloodless and exciting. Villains scheme, fight, and lose; never sadistic.

# Write 40 trivia questions to: ${SCRIPTS}/trivia/${e.id}.json
JSON array of EXACTLY 40 objects, each with EXACTLY these 8 keys (key spelled "explanation"):
{ "id": "${e.id}-trivia-1", "question": "…", "options": ["A","B","C","D"], "correctIndex": 0, "difficulty": "trivia", "universe": "${e.universe}", "heroId": "${e.id}", "explanation": "one sentence" }
ids \`${e.id}-trivia-1\`…\`${e.id}-trivia-40\`; exactly 4 options; one correct; VARY correctIndex across 0,1,2,3; about the TEAM and its members. After writing, verify it parses and has 40 objects; fix if not.

# Write a team avatar prompt to: ${SCRIPTS}/prompts/${e.id}.txt
A vivid 60–90 word description of the TEAM together for a group cartoon portrait (the key members, their colors/poses). No style preamble.

# Rules
- Create \`trivia/\` and \`prompts/\` dirs if missing.
- Do NOT run git. Do NOT edit quiz-questions.json, lib/stories.ts, or anything outside the three targets.
- Return the structured result when done.`;
}

phase('Write ensembles');
const results = await parallel(
  ENSEMBLES.map((e) => () =>
    agent(brief(e), { label: `ensemble:${e.id}`, phase: 'Write ensembles', agentType: 'general-purpose', model: 'sonnet', schema: SCHEMA })
      .then((r) => ({ ...r, _id: e.id })).catch((err) => ({ _id: e.id, error: String(err) })),
  ),
);
const ok = results.filter((r) => r && !r.error && r.storyFilesWritten === 40 && r.triviaCount === 40 && r.triviaValidJson);
log(`Ensembles complete: ${ok.map((r) => r._id).join(', ') || 'none fully ok'}`);
return { ok: ok.map((r) => r._id), all: results };
