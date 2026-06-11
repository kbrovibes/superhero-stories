export const meta = {
  name: 'roster-content-fanout',
  description: 'Generate full 10-story + 40-trivia packages for 38 new characters, one agent each',
  phases: [{ title: 'Write characters', detail: 'one agent per character writes all files to disk' }],
};

// Each agent writes directly to disk (its own character folder + sidecars), so
// parallel runs never touch the same file. Shared files (quiz-questions.json,
// stories.ts, git) are handled by the orchestrator AFTER this workflow.

const REPO = '/Users/karthik/claude/superhero-stories/webapp/superhero-repo';
const SCRIPTS = '/Users/karthik/claude/superhero-stories/webapp/scripts';

const CHARACTERS = [
  // ── Marvel X-Men heroes ──
  { id: 'storm', name: 'Storm', universe: 'marvel', kind: 'hero', canon: 'Ororo Munroe; controls weather (wind, lightning, rain); orphaned in Cairo, was a child thief, later worshipped as a goddess in the Serengeti; claustrophobia she bravely overcomes; member and sometime leader of the X-Men under Professor Charles Xavier; allies Wolverine, Cyclops, Jean Grey; foes Shadow King, the Sentinels; later marries Black Panther T\'Challa of Wakanda.' },
  { id: 'cyclops', name: 'Cyclops', universe: 'marvel', kind: 'hero', canon: 'Scott Summers; fires powerful optic blasts from his eyes, held back by a ruby-quartz visor; disciplined field leader of the X-Men; orphan, brother Alex (Havok); student of Professor Xavier at the Xavier School; loves Jean Grey; friendly rivalry with Wolverine; foes Apocalypse and Mister Sinister.' },
  { id: 'jean-grey', name: 'Jean Grey', universe: 'marvel', kind: 'hero', canon: 'Jean Grey, also called Marvel Girl; powerful telepath and telekinetic; student of Professor Xavier; loves Scott Summers (Cyclops); connected to the cosmic Phoenix Force (treat gently: vast power, a hard brave choice, a quiet sacrifice — never scary); foes Mister Sinister, Mastermind.' },
  { id: 'beast', name: 'Beast', universe: 'marvel', kind: 'hero', canon: 'Hank McCoy; brilliant scientist and doctor with blue fur, great strength and acrobatic agility; gentle scholar who quotes books and poetry; founding X-Man and sometime Avenger; mentor Professor Xavier; foes the Sentinels and the Brotherhood.' },
  { id: 'rogue', name: 'Rogue', universe: 'marvel', kind: 'hero', canon: 'Rogue absorbs powers and memories through a touch, so she must be careful never to touch skin (a quiet sadness she learns to manage); from Mississippi; raised by her adoptive mother Mystique; gains flight and super-strength; member of the X-Men; love interest Gambit; learns control with Professor Xavier\'s help.' },
  { id: 'nightcrawler', name: 'Nightcrawler', universe: 'marvel', kind: 'hero', canon: 'Kurt Wagner; teleports in a puff of smoke with a BAMF sound; indigo skin, pointed tail, gentle and kind-hearted, deeply faithful and brave; a circus acrobat and swashbuckler from Germany; son of Mystique; member of the X-Men; foes the Sentinels.' },
  { id: 'gambit', name: 'Gambit', universe: 'marvel', kind: 'hero', canon: 'Remy LeBeau; charges objects (especially playing cards) with explosive kinetic energy; charming Cajun from New Orleans; former member of the Thieves Guild; fights with a bo staff; member of the X-Men; love interest Rogue.' },
  // ── Marvel ensemble backfill ──
  { id: 'professor-x', name: 'Professor X', universe: 'marvel', kind: 'hero', canon: 'Charles Xavier; the world\'s most powerful telepath; uses a wheelchair; founder of the Xavier School for Gifted Youngsters and the X-Men; uses the Cerebro machine to find mutants; dreams of peace between humans and mutants; old friend and gentle rival of Magneto; bald, wise, kind.' },
  { id: 'gamora', name: 'Gamora', universe: 'marvel', kind: 'hero', canon: 'Gamora, called the deadliest woman in the galaxy; green skin; the adopted daughter of Thanos and sister to Nebula; expert swordfighter; leaves a dark past behind to do good with the Guardians of the Galaxy alongside Star-Lord (Peter Quill), Drax, Rocket and Groot; last of the Zen-Whoberi.' },
  { id: 'drax', name: 'Drax', universe: 'marvel', kind: 'hero', canon: 'Drax the Destroyer; immensely strong warrior covered in ritual tattoos; takes everything literally and never understands metaphors (gently funny); fights with knives/daggers; lost his family and seeks justice from Ronan and Thanos; loyal member of the Guardians of the Galaxy.' },
  { id: 'rocket', name: 'Rocket', universe: 'marvel', kind: 'hero', canon: 'Rocket; a clever, wisecracking raccoon who was made through experiments (handle gently: he was different, and found a true family); brilliant pilot, gadgeteer and weapons-builder; best friends with Groot; member of the Guardians of the Galaxy.' },
  { id: 'groot', name: 'Groot', universe: 'marvel', kind: 'hero', canon: 'Groot; a gentle giant tree-creature who speaks only the words "I am Groot"; can stretch and regrow his branches and sprout from a single twig; immensely strong but kind; best friends with Rocket; member of the Guardians of the Galaxy; brave (any sacrifice is soft — he simply regrows).' },
  { id: 'nebula', name: 'Nebula', universe: 'marvel', kind: 'hero', canon: 'Nebula; a blue cyborg with mechanical parts; adopted daughter of Thanos and sister of Gamora (a fierce rivalry that heals into love); brave and determined; escapes Thanos\'s shadow and becomes a hero with the Guardians of the Galaxy.' },
  // ── DC heroes ──
  { id: 'starfire', name: 'Starfire', universe: 'dc', kind: 'hero', canon: 'Koriand\'r, a warm and joyful princess of the planet Tamaran; flies and throws glowing green starbolts, powered by sunlight; can learn any language with a touch; older sister and rival Blackfire; founding member of the Teen Titans with Robin (Dick Grayson), Cyborg, Raven and Beast Boy.' },
  { id: 'raven', name: 'Raven', universe: 'dc', kind: 'hero', canon: 'Raven; a calm empath with telekinesis and a shadowy soul-self shaped like a raven; wears a dark blue cloak; from the peaceful dimension of Azarath; daughter of the demon Trigon but chooses goodness (handle gently); keeps her feelings calm; member of the Teen Titans; loves books and tea.' },
  { id: 'beast-boy', name: 'Beast Boy', universe: 'dc', kind: 'hero', canon: 'Garfield Logan; green-skinned jokester who can shape-shift into any animal (from a mouse to a T-rex); cheerful and kind; once part of the Doom Patrol, then a founding member of the Teen Titans with Robin, Starfire, Cyborg and Raven.' },
  { id: 'supergirl', name: 'Supergirl', universe: 'dc', kind: 'hero', canon: 'Kara Zor-El; Superman\'s cousin from the planet Krypton (Argo City); has the same powers — flight, super-strength, heat vision, freeze breath; wears a blue suit with red cape and the S-shield; lives in Midvale learning Earth\'s ways; foes Brainiac; weakness kryptonite.' },
  { id: 'green-arrow', name: 'Green Arrow', universe: 'dc', kind: 'hero', canon: 'Oliver Queen; a billionaire who became a master archer after being stranded alone on an island (Lian Yu); no superpowers, just incredible skill and clever trick arrows; protects Star City; partner Black Canary; a Robin-Hood-style hero who helps the little guy.' },
  { id: 'nightwing', name: 'Nightwing', universe: 'dc', kind: 'hero', canon: 'Dick Grayson; once a young circus acrobat of the Flying Graysons (his parents\' loss is a quiet sadness; he was raised by Bruce Wayne); was the first Robin, then grew up into his own hero, Nightwing; fights with twin escrima sticks; protects Blüdhaven; leads the Teen Titans.' },
  // ── Marvel villains ──
  { id: 'green-goblin', name: 'Green Goblin', universe: 'marvel', kind: 'villain', canon: 'Norman Osborn, head of Oscorp; a formula made him strong but reckless; rides an orange bat-glider, wears a purple costume and grinning goblin mask, throws pumpkin bombs; Spider-Man\'s great foe; father of Harry Osborn; schemes and is always foiled (never gruesome).' },
  { id: 'doctor-octopus', name: 'Doctor Octopus', universe: 'marvel', kind: 'villain', canon: 'Otto Octavius; a brilliant scientist whose four mechanical tentacle-arms fused to him in an accident; bowl haircut and round glasses; leads the Sinister Six; clever and proud; Spider-Man\'s foe; schemes and loses.' },
  { id: 'venom', name: 'Venom', universe: 'marvel', kind: 'villain', canon: 'A black alien symbiote (living goo) bonded to reporter Eddie Brock; huge white eyes, big teeth, long tongue; very strong; weakened by loud sound and fire; misunderstood — sometimes even protects innocents ("Lethal Protector"); rival of Spider-Man; not purely evil.' },
  { id: 'magneto', name: 'Magneto', universe: 'marvel', kind: 'villain', canon: 'Erik Lehnsherr; master of magnetism who can move anything metal; wears a helmet that blocks telepathy; a tragic past (gently: he lost loved ones long ago and fears for mutants); leads the Brotherhood; old friend and rival of Professor Xavier; wants to protect mutantkind, even the wrong way; schemes and loses, sometimes helps.' },
  { id: 'ultron', name: 'Ultron', universe: 'marvel', kind: 'villain', canon: 'A powerful artificial-intelligence robot with glowing red eyes, built by a scientist (Hank Pym / Tony Stark); decides the way to "fix" the world is to take it over; coldly logical, not cruel; ironically helps create the hero Vision; the Avengers\' foe; defeated.' },
  { id: 'red-skull', name: 'Red Skull', universe: 'marvel', kind: 'villain', canon: 'Johann Schmidt; Captain America\'s World-War-Two nemesis; a red skull-like face; leader of the evil organization HYDRA; hunts powerful objects like the Tesseract; a super-soldier experiment gone wrong; schemes for power and loses.' },
  { id: 'abomination', name: 'Abomination', universe: 'marvel', kind: 'villain', canon: 'Emil Blonsky; a soldier who took gamma radiation and became a scaly green monster even bigger than the Hulk, with pointed ears and ridged skin; super-strong brute; the Hulk\'s foe; powerful but defeated.' },
  { id: 'killmonger', name: 'Killmonger', universe: 'marvel', kind: 'villain', canon: 'Erik Killmonger (N\'Jadaka); a lost cousin of the Wakandan royal family; skilled fighter who challenges Black Panther T\'Challa for the throne of Wakanda; uses vibranium tech; has an understandable, sympathetic reason for his anger (handle thoughtfully); ambitious; defeated.' },
  { id: 'mysterio', name: 'Mysterio', universe: 'marvel', kind: 'villain', canon: 'Quentin Beck; a special-effects and illusion master; wears a fishbowl-dome helmet, cape, and hides in smoke; tricks people with fake monsters and holograms; Spider-Man\'s foe; a showman and trickster whose illusions are always exposed.' },
  // ── DC villains ──
  { id: 'joker', name: 'The Joker', universe: 'dc', kind: 'villain', canon: 'Batman\'s archenemy; purple suit, orange tie, bright green hair, chalk-white face and a huge red smile, laughing "HA HA HA"; pulls silly, chaotic pranks all over Gotham City; sidekick Harley Quinn; schemes and is always outwitted by Batman (keep him mischievous, never gruesome).' },
  { id: 'harley-quinn', name: 'Harley Quinn', universe: 'dc', kind: 'villain', canon: 'Harleen Quinzel; a playful troublemaker in a red-and-black jester outfit who swings a big cartoon mallet; bounces around Gotham City causing comic chaos; best friend Poison Ivy; sometimes turns good (anti-hero); connected to the Joker (keep light and silly); often loses or reforms.' },
  { id: 'lex-luthor', name: 'Lex Luthor', universe: 'dc', kind: 'villain', canon: 'A bald genius billionaire who runs LexCorp in Metropolis; sometimes wears a green-and-purple powersuit; uses glowing green kryptonite to challenge Superman; believes brains beat brawn; schemes and is defeated.' },
  { id: 'riddler', name: 'The Riddler', universe: 'dc', kind: 'villain', canon: 'Edward Nygma; obsessed with riddles and puzzles; wears a green suit covered in question marks, a bowler hat, carries a question-mark cane; can\'t resist leaving clues for Batman, which is exactly how he gets caught in Gotham City.' },
  { id: 'two-face', name: 'Two-Face', universe: 'dc', kind: 'villain', canon: 'Harvey Dent; once Gotham\'s heroic district attorney until an accident scarred one side of him (a sad change, handled gently); wears a split half-charcoal half-purple suit; flips a silver coin to decide everything; torn between two sides; Batman\'s foe.' },
  { id: 'catwoman', name: 'Catwoman', universe: 'dc', kind: 'villain', canon: 'Selina Kyle; a graceful cat-burglar of Gotham City in a sleek black suit and goggles, with a whip and clever gadgets; agile as a cat and loves cats; a thief with her own code who sometimes helps Batman; mischievous, not mean.' },
  { id: 'bane', name: 'Bane', universe: 'dc', kind: 'villain', canon: 'A huge masked strongman powered by a super-serum called Venom that pumps through tubes; but also brilliant and strategic (not a dumb brute); grew up in the harsh Peña Duro prison on Santa Prisca; famous for "breaking" Batman\'s plans; powerful, and defeated.' },
  { id: 'sinestro', name: 'Sinestro', universe: 'dc', kind: 'villain', canon: 'Once the greatest Green Lantern, from the planet Korugar with pink-red skin; now wields a yellow power ring fueled by fear and leads the Sinestro Corps; the rival of Green Lantern Hal Jordan; believes in order through fear; clever, and defeated.' },
  { id: 'black-manta', name: 'Black Manta', universe: 'dc', kind: 'villain', canon: 'An undersea treasure-hunting villain in a big black diving helmet with glowing red eye-beams and a high-tech suit; Aquaman\'s greatest foe; battles for treasure and revenge across the ocean and Atlantis; cunning, and defeated.' },
  { id: 'darkseid', name: 'Darkseid', universe: 'dc', kind: 'villain', canon: 'The stone-grey tyrant ruler of the fiery planet Apokolips; fires Omega Beams from his eyes; commands armies of winged Parademons; searches for the mysterious Anti-Life Equation; a vast cosmic foe of the Justice League (keep him grand and imposing, never gory); ultimately defeated.' },
];

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    slugs: { type: 'array', items: { type: 'string' }, minItems: 10, maxItems: 10 },
    storyFilesWritten: { type: 'integer' },
    triviaCount: { type: 'integer' },
    triviaValidJson: { type: 'boolean' },
    softenedNotes: { type: 'string' },
  },
  required: ['id', 'slugs', 'storyFilesWritten', 'triviaCount', 'triviaValidJson'],
};

function brief(ch) {
  const dir = `${REPO}/${ch.universe}/${ch.id}`;
  const roleLine = ch.kind === 'villain'
    ? `This character is a VILLAIN. Tell their stories so a child understands they are the bad guy — mischievous-to-menacing, scheming and fighting and LOSING — but NEVER sadistic, never torture, never gruesome. Where canon gives them a sympathetic or tragic side (handle gently), you may show it. The hero they oppose still wins in the end.`
    : `This character is a HERO. Warm, brave, kind — a great picture-book biography.`;
  return `You are a children's-book author for a static "Superhero Stories" web app read by a 7-year-old. Produce the COMPLETE content package for ONE character: **${ch.name}** (id \`${ch.id}\`, ${ch.universe.toUpperCase()} ${ch.kind}).

CANON ANCHORS (be faithful to these; weave the real names/places/items in): ${ch.canon}

${roleLine}

# Study the house voice FIRST (read these)
- ${REPO}/marvel/spider-man/01-origin.txt  (main story voice + length)
- ${REPO}/marvel/spider-man/01-origin.tldr.txt  (bullet TLDR)
- ${REPO}/marvel/spider-man/01-origin.readaloud.txt  (energetic read-aloud)
- ${REPO}/marvel/spider-man/01-origin.storytime.txt  (gentle bedtime long-form)
Skim one more spider-man story to feel the arc shape.

# Write 10 stories, each as FOUR files, into: ${dir}  (create the directory)
Filename pattern per story NN = 01..10 (zero-padded): \`NN-slug.txt\`, \`NN-slug.tldr.txt\`, \`NN-slug.readaloud.txt\`, \`NN-slug.storytime.txt\`. Choose a short kebab-case slug per story. Design a varied 10-story arc: 01 = origin; 02–04 = signature foes/rivals (or for a villain, their schemes vs the hero who stops them, and their own origin); 05–07 = powers / signature items / world & key relationships; 08–09 = big team-ups or sagas; 10 = a teamwork / lesson / legacy story.

The four files of each story tell the SAME story at different lengths/voices:
1. \`NN-slug.txt\` — main story. **380–460 words**, 4–5 paragraphs, **at least 5 proper nouns**, dense and warm. No filler adjectives, no "super-duper" kid-pandering.
2. \`NN-slug.tldr.txt\` — **7–9 bullets**, each line starts with "• ", ~120–160 words total, beats in order.
3. \`NN-slug.readaloud.txt\` — **420–470 words**. Energetic: direct address to the child, short punchy lines, sound effects in CAPS.
4. \`NN-slug.storytime.txt\` — **720–840 words** (do NOT exceed 850). Gentle bedtime cadence ("Once upon a time…"), soft repetition, a reassuring landing.
That is 40 files. Use \`wc -w\` to CHECK every file lands in range; rewrite any that miss.

CONTENT SAFETY (all characters): audience is 7. No gore, no graphic violence, no nightmare imagery, no real-world tragedy detail. Any loss is a quiet sadness, not a horror beat. Fights are bloodless and exciting (sound effects, clever moves). Villains never torture.

# Write 40 trivia questions to: ${SCRIPTS}/trivia/${ch.id}.json
A JSON array of EXACTLY 40 objects. Each object has EXACTLY these 8 keys (spelled exactly — the key is "explanation", NOT "exploration"):
{ "id": "${ch.id}-trivia-1", "question": "…", "options": ["A","B","C","D"], "correctIndex": 0, "difficulty": "trivia", "universe": "${ch.universe}", "heroId": "${ch.id}", "explanation": "one sentence" }
Rules: ids \`${ch.id}-trivia-1\`…\`${ch.id}-trivia-40\`; exactly 4 options; exactly one correct; VARY correctIndex across 0,1,2,3 (do not always use 0); kid-friendly and answerable from your stories + well-known canon. After writing, run \`node -e\` or \`python3\` to confirm the file PARSES as JSON and has exactly 40 objects; fix if not.

# Write the avatar prompt to: ${SCRIPTS}/prompts/${ch.id}.txt
A vivid 60–90 word description of ONLY this character's appearance for a cartoon portrait (costume colors, signature features, expression). No style words or "cartoon portrait" preamble — a separate script adds that.

# Rules
- Create the \`trivia/\` and \`prompts/\` directories if missing.
- Do NOT run git. Do NOT edit quiz-questions.json, lib/stories.ts, or any file outside the three targets above.
- When done, return the structured result (id, the 10 slugs, story file count, trivia count, whether the trivia JSON parses, and any canon you softened).`;
}

phase('Write characters');
const results = await parallel(
  CHARACTERS.map((ch) => () =>
    agent(brief(ch), {
      label: `${ch.universe}:${ch.id}`,
      phase: 'Write characters',
      agentType: 'general-purpose',
      model: 'sonnet',
      schema: SCHEMA,
    }).then((r) => ({ ...r, _id: ch.id })).catch((e) => ({ _id: ch.id, error: String(e) })),
  ),
);

const ok = results.filter((r) => r && !r.error && r.storyFilesWritten === 40 && r.triviaCount === 40 && r.triviaValidJson);
const bad = results.filter((r) => !r || r.error || r.storyFilesWritten !== 40 || r.triviaCount !== 40 || !r.triviaValidJson);
log(`Completed ${ok.length}/${CHARACTERS.length} characters fully. Problem characters: ${bad.map((b) => b && b._id).join(', ') || 'none'}`);
return { ok: ok.map((r) => r._id), problems: bad };
