#!/usr/bin/env bash
# Superhero Story Repository Generator — v2
# 10 Marvel heroes, 10 DC heroes, Avengers ensemble folder
set -e

# ── Directories ──────────────────────────────────────────────────────────────
mkdir -p \
  webapp/superhero-repo/marvel/iron-man \
  webapp/superhero-repo/marvel/spider-man \
  webapp/superhero-repo/marvel/thor \
  webapp/superhero-repo/marvel/captain-america \
  webapp/superhero-repo/marvel/black-panther \
  webapp/superhero-repo/marvel/hulk \
  webapp/superhero-repo/marvel/black-widow \
  webapp/superhero-repo/marvel/doctor-strange \
  webapp/superhero-repo/marvel/hawkeye \
  webapp/superhero-repo/marvel/ant-man \
  webapp/superhero-repo/dc/batman \
  webapp/superhero-repo/dc/superman \
  webapp/superhero-repo/dc/wonder-woman \
  webapp/superhero-repo/dc/the-flash \
  webapp/superhero-repo/dc/green-lantern \
  webapp/superhero-repo/dc/aquaman \
  webapp/superhero-repo/dc/shazam \
  webapp/superhero-repo/dc/cyborg \
  webapp/superhero-repo/dc/batgirl \
  webapp/superhero-repo/dc/martian-manhunter \
  webapp/superhero-repo/avengers

echo "Directories ready."

# ════════════════════════════════════════════════════════════════════════════
# ORIGINAL MARVEL HEROES
# ════════════════════════════════════════════════════════════════════════════

# ── iron-man ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/iron-man/1.txt
Tony Stark was the world's greatest inventor. His workshop was full of gadgets,
blinking lights, and friendly robots. One special day, Tony built something truly
amazing: a glowing blue Arc Reactor, about the size of a frisbee, that hummed
with clean, endless energy. He set it right in the chest of his brand-new armor
suit — red and gold, shiny as a new penny. The suit had jet boots, rocket fists,
and a clever computer helper named JARVIS. Tony called himself Iron Man. He flew
out of his garage, looped three times over the ocean, and grinned inside his
helmet. "Now," he said, "let's do some good."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/iron-man/2.txt
One morning, Green Goblin swooped over New York on his bright orange glider,
scattering sparkly pumpkin-shaped smoke bombs across Central Park. His goblin
mask glowed neon green and his purple suit flapped like a flag. "HA! Fog
everywhere!" Iron Man's sensors flashed red. Tony zoomed into the sky. "Those
smoke bombs are blocking the balloon festival!" he called. He fired a gentle foam
net that wrapped the glider's wheels like a cozy cocoon, slowing it to a hover.
Goblin tumbled into a soft pile of raked leaves. "Next time," Tony said, landing
beside him, "maybe just bring confetti." Goblin picked a leaf off his mask and
considered this seriously.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/iron-man/3.txt
Venom was a big, gooey black creature with enormous white eyes and a grin full
of very large teeth. He liked jumping out from shadows and shouting "BOO!" at
pigeons on park benches, which he found hilarious. Iron Man tracked the shadowy
shape on his heads-up display. Venom leaped onto a city bus, sending passengers
scrambling for their phones. "Need a lift?" Tony quipped, descending smoothly.
He activated a sonic pulse tuned to exactly the frequency that made Venom wiggle
and wobble. The black goo peeled away from the bus like a sticker. Tony noted
the frequency in his datapad. Knowing a problem's weakness, he decided, was
usually kinder than fighting it head-on.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/iron-man/4.txt
Tony noticed an unusual blue glow drifting up from the harbor. It was the
Tesseract — a perfect glowing cube the color of a summer sky, humming with enough
energy to light every city on Earth for a thousand years. Someone had accidentally
left it on a dock. Tony put on his insulated gauntlets and lifted it carefully.
The Tesseract sent little blue sparks dancing across his armor. "Beautiful," he
whispered. He flew it directly to the Avengers vault, where it locked safely
behind three layers of reinforced doors. Nick Fury looked up from his desk.
"Nice work, Stark." Tony polished his helmet. "All in a day's tinkering," he
said, and went home to invent something new before breakfast.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/iron-man/5.txt
The whole city had lost power — every streetlight, hospital, and traffic signal
dark at once. Iron Man called the Avengers. Thor flew in swinging Mjolnir.
Captain America arrived with his Vibranium shield. Spider-Man swung between
rooftops. Black Panther sprinted across the bridges. "We each have one piece of
the puzzle," Tony said. Thor used a precise bolt of lightning to restart the
generators. Cap organized the streets so no one got lost. Spider-Man strung
glowing web-lines between buildings as emergency lights. Black Panther guided
people safely through the dark. Tony's Arc Reactor shared power directly to the
hospital. By sunrise, the city hummed warm and bright. "Alone we're strong,"
Tony said, "but together we're unstoppable." Everyone cheered.
STORY_EOF

# ── spider-man ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/spider-man/1.txt
Peter Parker was a kind, curious kid who loved science class more than anything.
One afternoon, visiting a research lab, a tiny spider with a faint radioactive
glow crawled across his hand and gave him a small, painless bite. The next
morning, Peter woke up and could stick to walls! He had a tingly spider-sense
that buzzed whenever danger was near. Using supplies from his school science kit,
he invented a pair of web-shooters and sewed a red-and-blue suit covered in a
web pattern. He leaped from his bedroom window, swung across the rooftops, and
hollered with joy. Peter became the friendly neighborhood Spider-Man, because he
knew: with great power comes great responsibility.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/spider-man/2.txt
Green Goblin zoomed over the park on his pumpkin-orange glider, tossing glitter
bombs that exploded in bursts of pink and gold. His glowing goblin mask grinned
wide and his purple costume flapped in the wind. "Glitter for everyone!" he
cackled. Kids laughed — until the glitter made the slide dangerously slippery.
Spider-Man leaped from a lamppost. "Hey, Goblin! Glitter is not a safety feature!"
He shot a web at the glider's back wheels, slowing it to a crawl. Goblin belly-
flopped into a pile of autumn leaves. "You're grounded," Spidey said with a
thumbs-up. He then helped the park crew sweep up every last sparkle. The pigeons
were extremely relieved.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/spider-man/3.txt
Venom slithered down the library wall, his black tendrils dripping like ink, his
enormous white spider-symbol gleaming under the fluorescent lights. He was tucking
forty library books under his gooey arms — without checking them out. "Library
cards are free, you know," Spider-Man said, dropping from the ceiling. They
tumbled through the fiction aisle, knocking over a display of mystery novels.
Peter remembered: Venom hated loud sounds. He webbed a speaker and played a
very enthusiastic tuba concerto. Venom shrieked and dropped every book with a
tremendous SPLAT. Peter stacked them neatly, then held out a laminated library
card. "Yours, if you use it properly." Venom grumbled — but he pocketed the
card.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/spider-man/4.txt
Swinging past the natural history museum, Spider-Man's spider-sense buzzed like
a whole hive of bees. Inside, a red stone pulsed behind its display glass —
glowing, warm, and alive. It was a Reality Stone, one of the colorful Infinity
Stones, each one a different shade and a different kind of power. A very curious
thief was reaching for it with a long mechanical claw. "I don't think that
belongs in your jacket," Spidey said, dropping from the skylight. He webbed the
claw, the thief, and the thief's hat for good measure. Then he carefully reset
the display case. "How did you know it was dangerous?" the curator gasped.
Peter tapped his temple. "Spider-sense never lies."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/spider-man/5.txt
A rainstorm flooded five blocks of New York. Spider-Man called for backup. Iron
Man flew overhead scanning for anyone stranded, his Arc Reactor cutting through
the grey sky like a lighthouse. Thor hovered above the clouds and gently nudged
the storm eastward with Mjolnir. Captain America waded chest-deep, holding his
Vibranium shield flat so kids could sit on it like a raft. Black Panther set up
warm dry shelters in the subway stations. Peter swung from building to building,
lowering web-ropes to pull people to safety, one by one, until every street was
accounted for. When the water drained, the team sat on a stoop eating hot soup.
"We couldn't have done this alone," Peter said quietly. Nobody disagreed.
STORY_EOF

# ── thor ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/thor/1.txt
Thor grew up in Asgard, a realm of golden towers and rainbow bridges that arced
across the sky. His most prized possession was Mjolnir — a hammer so special
that his father Odin had placed an enchantment on it: only someone truly worthy,
meaning brave AND kind AND humble, could ever lift it. Thor learned what
worthiness really meant after a great adventure on Earth. He also earned a second
weapon later: Stormbreaker, an axe-hammer forged inside a dying star, which could
also open the Bifrost rainbow bridge to anywhere in the nine realms. Two mighty
weapons, each earned through courage. Thor wore a red cape, had long golden hair,
and laughed like a thunderclap. He was the God of Thunder, and very good at it.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/thor/2.txt
At a superhero fair, the Joker appeared in his purple suit and bright orange tie,
green hair bouncing wildly, his enormous painted smile stretching ear to ear.
He had swapped every balloon in the fair for rubber chickens. "HA HA HA!" he
hollered, hurling confetti that honked like geese. Thor raised Mjolnir. Lightning
crackled between the clouds. A single gentle thunderclap sent the rubber chickens
flying into a neat, tidy pile in the corner. The crowd cheered. The Joker pouted
— nobody had laughed at the right moment! Thor put a large hand on the Joker's
shoulder. "Next time, perhaps keep one balloon. Balloons and chickens — a
partnership." The Joker honked a rubber chicken thoughtfully.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/thor/3.txt
Mjolnir sat patiently on the coffee table while Thor flew on Stormbreaker to a
distant planet wrapped in ice cream-coloured clouds. The clouds turned out to be
real frozen dessert — a mischievous Frost Giant had pointed a giant cold machine
at the planet's bakeries. Everything had turned to soft-serve. Thor swung
Stormbreaker in a wide arc and smashed the machine into scrap. The clouds
dissolved back into normal white fluff. The planet's bakers rushed out cheering
and presented Thor with seventeen pies of various flavours. He accepted them
gratefully, left fifteen for the villagers, kept two for the flight home, and
arrived back in Asgard with pastry crumbs on his cape and a very satisfied
expression.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/thor/4.txt
Strange blue lights drifted above Asgard's towers. The Tesseract — the most
powerful of the Infinity Stones, glowing like a trapped star — had been jostled
loose from its vault by a playful fire sprite who thought it was a very fancy
nightlight. Thor caught it mid-air on the flat of Stormbreaker, careful not to
touch it with bare hands. Even for a god, raw Tesseract energy could open a
doorway to somewhere very unexpected. He wrapped it in cloth woven from enchanted
Asgardian wool and carried it back to Odin's vault. The vault doors sealed with
a deep resonant CLUNK. "Even the greatest power," Thor said to the sprite, "needs
a safe place to rest." The sprite looked genuinely sorry.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/thor/5.txt
A freak ice storm had frozen all of Asgard solid. Thor could not melt it alone —
Mjolnir's lightning was powerful enough to crack the buildings! He called his
friends. Iron Man arrived with heating coils and a very long extension cord.
Captain America used the edge of his Vibranium shield to chip away the biggest
blocks of ice. Spider-Man crawled into frozen pipes no one else could reach and
cleared the blockages. Black Panther organised warm soup deliveries to every
household in the city. Thor summoned just enough lightning — precisely aimed — to
melt the outer crust without touching a single wall. The city thawed by afternoon.
Every Asgardian got hot soup. Thor declared it an official holiday. The soup,
he said, was magnificent.
STORY_EOF

# ── captain-america ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/captain-america/1.txt
Steve Rogers was a brave, kind young man who always stood up for what was right.
Scientists chose him for a special project because of his enormous heart. They
gave him a super-soldier serum that made him fast, strong, and tireless — but
Steve's absolute favourite gift was his shield. It was a perfect circle made from
Vibranium, the rarest, strongest metal on Earth, found only in the nation of
Wakanda. When Steve threw it, it bounced off walls at perfect angles and always
spun right back into his hand — like the world's most loyal frisbee. He put on
his red, white, and blue uniform and became Captain America: a symbol that
courage and kindness are always worth fighting for.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/captain-america/2.txt
Green Goblin swooped into Central Park on his roaring glider, goblin mask glowing,
and began tossing smoke pellets at the Saturday picnic. "Surprise!" Cap's shield
was already spinning through the air. CLANG — it knocked every pellet harmlessly
into the fountain, then curved back like a boomerang and slapped perfectly into
Steve's waiting hand. He didn't even look. "Clean catch!" a kid shouted. Steve
jogged through the fading smoke, sat down cross-legged beside the Goblin, and
offered him a ham sandwich from the picnic basket. "You could have just asked to
join us." Green Goblin sniffed the sandwich. He ate two. Nobody needed to pack
up and go home.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/captain-america/3.txt
Two-Face wore a remarkable suit: one half neat charcoal grey, one half wild purple
zigzag. His face was painted in matching halves — one side cheerful, one side
grumpy. He carried a coin he flipped to make every single decision. Today he
could not choose which mural to paint in the city park — a jungle or a space
scene. He kept repainting over himself, making a spectacular, gloopy muddle.
Captain America arrived with extra brushes. "How about both?" he suggested. They
spent the afternoon painting a space jungle together: astronauts swinging between
rocket-trees, alien birds nesting in satellite dishes. Two-Face stood back, coin
still. He smiled with both halves of his face. "This," he said, "I did not need
the coin for."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/captain-america/4.txt
Deep in the Wakandan mountains, King T'Challa's scholars invited Steve to learn
more about Vibranium. He had always known his shield was special, but here he
discovered just how alive the metal truly was. Vibranium does not merely absorb
impact — it hums with stored energy, and when struck at exactly the right angle,
it rings a single perfect, bell-clear note. Steve tapped the edge of his shield
lightly. A tone rang out across the valley like a struck tuning fork. A flock of
birds rose from the trees in a slow, beautiful spiral. "This metal remembers
every battle," a scholar said softly. Steve polished the edge with his sleeve.
"Then I'll make sure it only remembers good ones," he promised.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/captain-america/5.txt
The Avengers' headquarters needed a new roof after a training session involving
Thor's hammer going slightly further than planned. Tony designed the blueprints.
Thor swung the biggest steel beams into place — no crane could lift them anyway.
Spider-Man scurried into the awkward corners, tightening bolts no one else could
reach. Black Panther checked every Vibranium support strut for perfect alignment.
Steve organised everyone: right tool, right person, right moment. That was his
favourite kind of mission. By dinnertime the roof was solid, warm, and beautiful.
Nick Fury walked in, looked up slowly, and let out a low whistle. "Not bad,
Rogers." Steve grinned. "Teamwork builds things that last," he said. "Every
time."
STORY_EOF

# ── black-panther ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/black-panther/1.txt
T'Challa grew up in Wakanda — the most advanced nation on Earth, hidden under a
canopy of lush green forest and golden domes. Wakanda's greatest treasure was
Vibranium: a rare, shimmering metal that absorbed energy and made everything
stronger. T'Challa trained every day, running alongside cheetahs, climbing
waterfalls, studying engineering and medicine with his brilliant sister Shuri.
When he became king, he drank from a heart-shaped herb that gave him the speed,
strength, and silent senses of a panther. His suit, woven from Vibranium nano-
particles, absorbed every hit and released it as a burst of radiant purple light.
He became the Black Panther: a king who protected his people with equal parts
wisdom and courage.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/black-panther/2.txt
Venom had tracked a rare Wakandan crystal into the city. His black gooey form
slid between buildings, massive grin gleaming in the amber streetlights. Black
Panther dropped silently from a rooftop. His Vibranium suit absorbed every
vibration — no footstep, no breath, no sound. Venom spun around. Too late.
Panther triggered his suit's stored-energy burst. Venom tumbled backwards into
a decorative fountain with a tremendous SPLOOOSH. The crystal clattered onto the
pavement. T'Challa picked it up gently. "This belongs to Wakanda," he said,
calm as ever. Venom sat in the fountain, soaked and baffled. "How did you even
sneak up on me?" he gurgled. T'Challa straightened his collar. "Wakanda trains
quietly. And very, very thoroughly."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/black-panther/3.txt
Two-Face had wandered into a Wakandan technology expo. He kept flipping his coin
over each display table — heads he grabbed the gadget, tails he put it back —
making a thoroughly confused mess of the exhibit. Black Panther watched from the
doorway, arms folded, expression patient. Finally he walked over and offered
Two-Face a brochure with a small bow. "All items in this hall are free to take.
The expo is a gift to the public." Two-Face stared. He hadn't needed the coin at
all. He pocketed it, slightly embarrassed, and spent the rest of the afternoon
happily learning about Vibranium energy cells and solar-train engineering. He
left with a tote bag full of brochures and a look of genuine interest on both
halves of his face.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/black-panther/4.txt
T'Challa flew over Wakanda at dawn in a sleek ship powered entirely by Vibranium
energy. Below, the golden city hummed like a living thing: trains floated on
magnetic rails, buildings healed their own small cracks, and children's school
tablets glowed with soft Vibranium light. A sensor beeped — a new underground
deposit discovered in the eastern hills. He landed and knelt beside the raw ore,
glowing deep purple in the dark earth. "We do not take more than we need,"
T'Challa told his engineers quietly. "Vibranium is a gift from the earth. We use
it to heal, to build, to protect — never to hoard." He marked the site carefully
and flew home for dinner, where Shuri had already invented three new things.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/marvel/black-panther/5.txt
A strange energy wave was disrupting technology across three continents. T'Challa
opened a conference call. Iron Man, Thor, Captain America, Spider-Man, and
Wakanda's science team all appeared on screen. Tony tracked the signal's source.
Thor identified it as a cosmic vibration from deep space. Peter suggested a web-
lattice antenna. Cap organised the ground response teams. Wakanda's engineers,
led by Shuri, built the energy-absorption array overnight using precision-cut
Vibranium components. T'Challa calibrated the final settings himself. They
activated it at dawn. The energy wave bent smoothly into space like water around
a stone. Every screen on three continents flickered back on simultaneously.
"Good work, everyone," T'Challa said. Simply. Quietly. But everyone on that
call felt very proud.
STORY_EOF

# ════════════════════════════════════════════════════════════════════════════
# ORIGINAL DC HEROES
# ════════════════════════════════════════════════════════════════════════════

# ── batman ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/dc/batman/1.txt
Bruce Wayne grew up in the great city of Gotham, raised by a warm and devoted
butler named Alfred, who made the world's best hot chocolate and always knew
exactly when Bruce needed it. Bruce was endlessly curious. He studied martial
arts, chemistry, detective skills, and engineering — never stopping, never quite
satisfied. One day he decided to use everything he'd learned to protect his
beloved city. He chose the symbol of a bat — swift and sure in the dark — and
became Batman. He drove a sleek, low black Batmobile, used a grappling hook
to zip between rooftops, and built a cosy, wonderful cave beneath his mansion
called the Batcave. Alfred always kept the hot chocolate warm when he came home.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/batman/2.txt
The Joker had painted every park bench in Gotham a very loud shade of neon
orange. He danced around them in his purple suit and bright orange tie, green
hair flopping over his forehead, his wide red smile stretching from ear to ear.
"HA HA HA! Isn't it WONDERFUL?" he cackled, his laugh bouncing off every
building in the park. Batman glided in on his cape and landed without a sound.
"Joker. The benches." The Joker twirled. "I was redecorating!" Batman produced
a tin of original brown paint and a clean brush and held them out. "Help me fix
them." The Joker pouted — then grabbed the brush. He actually painted very
neatly. Batman strongly suspected he had enjoyed fixing them even more than
making the mess.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/batman/3.txt
Two-Face stood on the pavement between two ice cream shops, one on each side of
the street. His suit was split perfectly down the middle: one half neat charcoal,
one half wild purple zigzag. One half of his face looked pleased, the other
looked deeply uncertain. He had been flipping his silver coin for eleven minutes,
completely unable to decide which shop to enter. A queue of twelve very patient
people had formed behind him. Batman stepped out of the shadows. "The left shop
does an excellent caramel ripple," he said, matter-of-factly. Two-Face flipped
once more. The coin said yes. He walked in. Batman — quietly, without fuss —
bought ice cream from the right-hand shop for every single person in the queue.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/batman/4.txt
Saturday in the Batcave was gadget testing day. Alfred laid everything out on a
velvet cloth: the boomerang Batarang that always returned to Bruce's hand, the
grappling hook with its new titanium tip, a detective scanner that could read
footprints in complete darkness. Alfred polished each one with great care. Then
he held up a small round device Bruce did not recognise. "This wasn't in the
blueprints," Bruce said, puzzled. "No," Alfred agreed. "I added it. It is a
portable hot chocolate warmer. You consistently forget to eat on long patrol
nights, and cold chocolate is simply not acceptable." Batman stared at it for
a moment. Then he placed it in his utility belt, right next to the Batarang.
Some inventions, he decided, were more important than others.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/batman/5.txt
Every traffic signal in Gotham had gone haywire — flashing all colours at once,
sending cars into gentle, confused gridlock. Batman called Superman, Wonder Woman,
and The Flash. The Flash rerouted every car in the city in twelve seconds flat.
Wonder Woman stood at the busiest junction, golden lasso glowing, directing
buses and lorries with calm authority. Superman hovered above the tallest
intersections, calling guidance down in his warm, clear voice. Batman worked
from the Batmobile, hacking into the signal mainframe and resetting the entire
grid in under three minutes. Afterward, Alfred served tea on the Batmobile's
bonnet. "You barely needed us," Superman observed. Batman looked at his cup.
"I needed you," he said, "exactly the right amount." Alfred refilled everyone's
cup.
STORY_EOF

# ── superman ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/dc/superman/1.txt
Clark Kent came from a faraway world called Krypton, and a loving family raised
him in a warm farmhouse in Smallville, Kansas. Under Earth's yellow sun, Clark
discovered extraordinary gifts one by one: he could fly, he could see through
walls, he could hear a whisper from a mile away, and a single breath from him
could freeze a pond solid. He used his gifts quietly at first — saving animals,
helping neighbours, stopping a runaway tractor before it reached the cornfield.
Then one bright morning, wearing a red cape and a bold S-shield on his chest, he
flew to the great city of Metropolis. He hovered over the skyline, smiled at the
crowds below, and said simply: "I'm here to help." And he always was.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/superman/2.txt
The Joker arrived in Metropolis wearing his sharpest purple suit, orange tie
knotted perfectly, green hair swept into a magnificent swoop. He had covered the
Daily Planet's famous giant spinning globe in enormous rainbow polka dots. "AN
IMPROVEMENT!" he bellowed, laughing so hard that his tie flapped against his
chest. "HA HA HA!" The laugh echoed down four city blocks. Superman floated down,
arms folded, doing his level best not to smile. "The globe is a city landmark,
Joker." The Joker held out a polka-dot paintbrush. "Then help me put it right!"
Superman thought about this for exactly one second — then accepted the brush.
They repainted the globe together. The Joker insisted on keeping one small yellow
dot. Superman allowed it. It was, honestly, a good dot.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/superman/3.txt
Venom had wrapped himself entirely around the Metropolis Central Library's clock
tower. He perched there with his enormous white eyes, his grin full of oversized
teeth, his black tendrils rippling in the breeze. He was simply sitting there,
dramatically. "Everyone is ignoring me," he announced to the pigeons. Superman
flew up and sat beside him on the ledge. "I see you," Superman said, simply and
honestly. Venom blinked. "You're not frightened?" Superman shook his head. "Are
you alright? Would you like to come down and talk for a bit?" Venom considered
this for a very long, quiet moment. Then he slowly slid down the wall in a long
gloopy heap. Superman found him a good book from inside. Venom liked it quite
a lot.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/superman/4.txt
Superman flew north until the world turned white and silent, and there in the
deep Arctic was his Fortress of Solitude: a palace of tall glowing crystals, each
one holding a memory or a map of his home world. He chose one blue crystal that
pulsed softly and sat with it. The crystal played images of Krypton: cities of
silver, twin suns rising, libraries full of recorded knowledge. Clark sat for a
long time watching them float past like snow. Then he recorded something new into
a fresh crystal: Kansas sunsets, his mother's kitchen, the Metropolis skyline on
a clear evening. He set the two crystals side by side on the ice shelf. Home, he
thought, looking at both of them. He meant both of them equally.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/superman/5.txt
A massive ocean storm was sweeping toward the coast, four weather systems twisted
together into one enormous swirl. Superman flew into the eye to slow its spin.
Wonder Woman used her gleaming silver bracelets to deflect lightning strikes away
from shore. The Flash evacuated three coastal towns in just over forty minutes.
Batman's Batcomputer ran weather models in real time, guiding every decision.
Green Lantern constructed a wide emerald energy barrier across the harbour mouth.
Together they redirected the storm safely out to open sea. On the beach afterward,
a small girl handed Superman a drawing she had made of the whole team, each hero
coloured carefully in crayon. He kept it in the Fortress of Solitude, right next
to the crystals from Krypton. Some things, he thought, belong beside home.
STORY_EOF

# ── wonder-woman ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/dc/wonder-woman/1.txt
Diana grew up on Themyscira, a beautiful island where brave Amazon warriors
trained, learned, and explored together. She was raised with great love and
strong values: always be honest, always be kind, always be brave. When she was
ready, she left the island to help the wider world. She wore golden armour,
a shining crown, and carried two wonderful tools. The first was a golden lasso
that glowed warm when held — and anyone it gently touched could only speak the
truth. The second was a pair of silver bracelets that could deflect anything
thrown at her, sparking brilliantly with every strike. Diana flew through the
sky on the winds of Themyscira. The world called her Wonder Woman. She thought
it was a perfectly fine name.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/wonder-woman/2.txt
The Joker had turned the art museum's dinosaur gallery into a grand puppet show,
with a purple-suited Joker puppet perched dramatically atop the T-Rex skeleton.
"HA HA HA! IS IT NOT BRILLIANT?" he roared, green hair bouncing under the
gallery lights, his huge red smile beaming at the ceiling. Wonder Woman entered
the hall with calm grace, golden lasso looped loosely over one arm. "Joker.
The dinosaur." "NEVER!" She looped the glowing golden lasso gently around his
wrist. The truth-touch worked immediately. "...I was lonely and wanted an
audience for my show," Joker admitted, looking rather surprised at himself.
Wonder Woman organised him a proper afternoon puppet theatre in the park. He
performed to a packed crowd. He received a standing ovation. He cried a little.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/wonder-woman/3.txt
Two-Face had been invited to referee a children's football match, which he had
agreed to enthusiastically — but he was using his coin to decide every single
call. Offsides? Coin flip. Goal? Coin flip. Whether the half-time oranges should
be peeled or unpeeled? Coin flip. The children were baffled. The coaches were
wringing their hands. Wonder Woman arrived at the touchline, silver bracelets
gleaming. "Two-Face," she said, warm and matter-of-fact, "would you like to learn
the actual rules? They are quite good." His coin paused in mid-air. She walked
him through the rulebook during the second half. He turned out to be an excellent
referee once he had proper guidelines. He kept the coin only for selecting the
half-time snack. Both teams agreed this was fair.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/wonder-woman/4.txt
Diana was tracking a faint signal through the forest when her golden lasso began
to glow on its own — warm and steady — which meant someone nearby was caught in
a misunderstanding that needed the truth. She found a young fox and two squirrels
in a loud argument about a pile of acorns each claimed as their own. Diana looped
the lasso gently around the whole group, soft as a ring of light. "Now," she said,
"let us each say what truly happened." The fox admitted she had accidentally
kicked the pile. The squirrels admitted they had forgotten where they buried
their own winter store. Everyone apologised. Everyone made peace. The forest
settled into a warm, leafy quiet. Diana coiled the lasso back at her hip.
"Honesty," she said gently, "is nearly always the kindest shortcut."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/wonder-woman/5.txt
A volcanic island was rising from the sea near Themyscira, pushing a wall of
water toward three small fishing villages on the coast. Wonder Woman rallied
her team immediately. Superman flew into the crater and cooled the lava with
his freeze-breath, steadying the rise. The Flash sandbagged all three villages
before the wave arrived. Batman calculated the wave's exact path on his wrist
computer. Green Lantern built a wide circular energy dome around the harbour.
Diana flew into the face of the wave herself and struck both silver bracelets
together — CRACK — splitting the water into harmless white mist that rose
slowly into the sky like morning fog. The fishing villages did not even get
wet. The villagers looked up, blinking. "Together," Diana said, "we are a
shield."
STORY_EOF

# ── the-flash ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/dc/the-flash/1.txt
Barry Allen was a cheerful, quick-laughing scientist who loved two things above
all else: solving puzzles and eating. One stormy evening, lightning struck his
chemistry shelf, showering Barry in a rainbow cascade of sparkling experimental
compounds. He woke the next morning and discovered he could run faster than the
wind — faster than a racing car — faster than sound itself. He designed a bright
red suit with a gold lightning bolt across the chest, and called himself The
Flash. He could run so fast that the world seemed to slow around him, each second
stretching like warm toffee. He used this gift to arrive exactly when people
needed him — always at precisely the right moment. He never once used it to skip
a queue, because that, he said, would simply not be cricket.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/the-flash/2.txt
The Joker had built an elaborate prank obstacle course through Central City:
banana peels placed at precise intervals, whoopee cushions on every third bench,
and pie-launching catapults timed to fire in sequence. He stood in his purple
suit under a streetlight, green hair electric, his massive smile glowing with
anticipation. "HA HA HA! Let's see the Fastest Man Alive dodge THESE!" The Flash
ran the entire course in 0.003 seconds. He collected every banana peel, disarmed
every catapult, and returned them all to the Joker in a neat stack before the
Joker had finished his laugh. The Joker blinked. "Did you even run?" Flash held
out a dustpan. "Your mess," he said, cheerful as ever. "Shall we tidy up
together? I'm very fast at sweeping."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/the-flash/3.txt
Two-Face was standing in the exact centre of a bridge, perfectly still, coin
hovering between his fingers. His half-neat, half-wild suit flapped in the river
wind. He could not decide which neighbourhood on either side of the bridge to
visit, and had been standing there for forty-three minutes. The Flash appeared
beside him in a red-gold blur. "Where are you trying to go?" "I cannot decide,"
Two-Face said honestly. "Both, or neither." "Both," Flash said, brightly. Two-
Face nodded. The Flash ran him to the first neighbourhood, back to the bridge,
and then to the second neighbourhood, and back, in just under three seconds.
"There," Flash said. "Now you have visited both." Two-Face pocketed his coin
slowly. "That," he said, after a long pause, "actually works."
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/the-flash/4.txt
Deep inside the Speed Force — the warm, golden energy that gave Barry his power —
there were no roads or cities. Just pure, humming motion, and light the colour
of summer lightning. Barry visited once, just to understand it better. He watched
memories of every run he had ever taken drift past like photographs in the wind:
the girl's kitten rescued from a tree in 0.2 seconds, the elderly man's hat
returned before it touched the ground, the footbridge repaired before anyone
knew it was broken. The Speed Force hummed around him, steady and kind. "Keep
going," it seemed to say. "There is always someone who needs you to arrive."
Barry smiled. He zipped back to Central City, bought a large sandwich, and ate
it before he had fully stopped running.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/the-flash/5.txt
A wildfire raced toward a forest full of animal sanctuaries. The Flash ran laps
around the blaze so quickly that the wind he kicked up formed a spinning ring,
pushing the fire back from the tree line. Superman flew overhead, dropping ocean
water precisely on the hottest points. Wonder Woman moved through the smoke
directing animals — deer, foxes, owls, rabbits — to safety with calm golden
authority. Batman coordinated the ground firefighters by radio, keeping everyone
in position. Green Lantern built a glowing green containment dome to catch any
jumping embers. The fire was out in twelve minutes. The Flash counted every animal
at the sanctuaries. "All present," he reported, slightly out of breath for the
first time in recent memory. "Every single one." Everyone smiled.
STORY_EOF

# ── green-lantern ───────────────────────────────────────────────────────────────────

cat << 'STORY_EOF' > webapp/superhero-repo/dc/green-lantern/1.txt
Hal Jordan was a pilot who loved flying more than he loved almost anything — the
feeling of leaving the ground, of cloud and open sky and nothing between him and
the horizon. One evening a strange green light fell near his airfield. Inside
was a glowing emerald ring and a small lantern, left by a being from another
world. The ring chose Hal: it needed someone fearless and honest. When he slipped
it on, brilliant green light poured from his hand. The ring could build anything
Hal imagined: bridges, barriers, rocket ships, giant hands — all sculpted from
solid green energy powered by sheer willpower. Hal pointed the ring at the stars,
spoke the ancient oath, and flew. He went very, very far, and enjoyed every
second of it.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/green-lantern/2.txt
The Joker had replaced every green traffic light in Coast City with a tiny purple
disco ball that played dance music when it spun. Cars drifted to puzzled stops.
Drivers climbed out and began dancing. The Joker capered on the road median in
his purple suit, orange tie bouncing, green hair bright as a traffic cone, his
enormous smile flashing at every passing car. "HA HA! DANCE CITY!" Green Lantern
swept in on a ring-powered platform, rebuilt every traffic signal in the city
simultaneously in one sweep of green light, and then — thinking it over — created
a single small glowing green disco ball, person-sized, just for the Joker, right
there on the pavement. "You can keep this one," Lantern said. The Joker hugged it
immediately. A deal was struck.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/green-lantern/3.txt
Venom had been trying to climb the outside of the Coast City Space Museum to look
at the rocket exhibits through the skylight. His gooey black tendrils kept
setting off the exterior motion sensors. Green Lantern materialised a glowing
green platform beside him, hovering steady as a shelf. "There's a front entrance,"
Lantern said, pointing down. "Open until eight. Free on Tuesdays." Venom
blinked with his enormous white eyes. He slid down the wall, leaving only a
small smear on the brickwork. Inside, Lantern created a glowing green tour-guide
arrow that drifted ahead of Venom, pointing to the best exhibits. Venom stood
for a very long time in front of the Saturn V rocket model. Lantern built him a
glowing green version to take home. Venom carried it with remarkable gentleness
all the way back.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/green-lantern/4.txt
Hal flew to the far edge of the galaxy to test a new ring construct: a telescope
the size of a football pitch, built entirely from compressed willpower and emerald
light. Through it, he could see the whole painted cosmos — purple nebulae shaped
like enormous flowers, orange star clusters fizzing like fireworks, distant
galaxies spinning slow and golden like pinwheels left in a gentle wind. His ring
hummed warm against his finger. The ring ran on willpower, Hal knew. The stronger
your belief that good things were possible, the brighter it glowed. Tonight,
looking at that infinite, sparkling dark, it glowed its very brightest. He made
a note in his flight log: "Universe — full of wonder. Willpower — unlimited.
Status: very good indeed." He flew home happy.
STORY_EOF

cat << 'STORY_EOF' > webapp/superhero-repo/dc/green-lantern/5.txt
A damaged satellite tumbled out of orbit, falling toward a crowded city at a
steep angle. Green Lantern built a giant emerald catcher's mitt in the upper
atmosphere to slow it. Superman flew up and steered the satellite onto a safer
path. The Flash emptied the streets below in record time. Batman calculated the
precise reentry corridor that would send it into open ocean. Wonder Woman
deflected falling debris with her silver bracelets — PING PING PING — each
strike ringing clean as a bell. The satellite splashed into the sea with a single
enormous white plume of water. Green Lantern high-fived everyone, ring sparking
warm green. "That," he said, "is what a team does. Catches things before they
fall." Everyone agreed. It was exactly that.
STORY_EOF
# ════════════════════════════════════════════════════════════════════════════
# NEW MARVEL HEROES
# ════════════════════════════════════════════════════════════════════════════

# ── HULK ─────────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/marvel/hulk/1.txt
Dr. Bruce Banner was a brilliant scientist who worked with gamma rays — a
special kind of energy that could power cities and help crops grow. One day,
an accident in his lab washed him in a burst of green gamma light. Bruce was
fine — mostly. But whenever he felt very upset, something remarkable happened:
he grew enormous, green, and incredibly strong. He became the Hulk, the
strongest creature on Earth. The secret was that Bruce was always inside,
steering things, making sure all that tremendous power was used to protect
people. Two minds, one remarkable team.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hulk/2.txt
Green Goblin zoomed past the Avengers' courtyard on his orange glider, scattering
smoke pellets until the whole garden vanished into fog. "FIND ME IF YOU CAN!"
Bruce Banner crossed his arms and felt his heartbeat rise — which was all it
took. The Hulk appeared. Tony stepped back. Hulk simply sniffed — gamma-enhanced
senses could track anything — and pointed one enormous green finger directly into
the cloud. SMASH. The glider wobbled. Goblin tumbled onto the grass. Hulk sat
down beside him and offered a dandelion he had accidentally uprooted. Goblin
accepted it. Surprisingly pleasant ending.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hulk/3.txt
Venom dropped from the Brooklyn Bridge intending a dramatic harbor ambush. Hulk
was already sitting on the bridge eating a tuna sandwich with extra pickles.
Venom rose to full terrifying height — black tendrils, enormous teeth, the whole
display. Hulk looked at him. Venom looked at Hulk. For the first time in his
career, Venom was outclassed in the intimidating-size department. "Sit?" Hulk
offered, patting the railing. It creaked alarmingly. Venom chose a nearby pier
instead. Hulk shared half the sandwich. They ate in the kind of comfortable
silence that comes from mutual respect.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hulk/4.txt
On a calm afternoon, Bruce sat in his lab surrounded by gamma-ray charts and
holographic soil data. He was studying whether controlled gamma energy could
help crops grow in deserts — real food for places that couldn't grow it otherwise.
Tony wandered in. "Science day?" Bruce nodded and pointed to a tiny cactus growing
under a gamma lamp: three perfect pink flowers in one week. Tony looked genuinely
impressed. "What if we scaled it up?" Bruce's eyes lit up. He wrote seventeen
pages of notes before dinner. The cactus grew a fourth flower while he worked.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hulk/5.txt
A hillside had cracked open, sending a slow wall of rubble toward the valley
below. No machine could stop it. Thor flew in but there were too many rocks
moving too fast. "Hulk," Steve Rogers said, simply. Hulk sprinted at the rockslide
and spread his arms wide, catching it — boulders the size of school buses pressing
against his palms. "HURRY," he said through gritted teeth. Tony blasted a trench.
Thor redirected the flow. Spider-Man webbed loose flanking boulders. When every
villager was clear, Hulk stepped aside. The rubble poured harmlessly into the
trench. "Good work, big guy," Steve said. Hulk smiled.
EOF

# ── BLACK WIDOW ───────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/marvel/black-widow/1.txt
Natasha Romanoff was the best spy in the world, and she had made a choice to use
every skill she had for good. She spoke nine languages, could rewire any alarm
system, and could disappear from a crowded room without anyone noticing she had
left. Her tools were the Widow's Bite — small electric stingers on her wrists that
delivered a harmless but memorable zap — and a compact grappling line for any
rooftop. When Nick Fury asked why she joined the Avengers, she was quiet for a
moment. "I have a lot to make up for," she said. "Might as well start here."
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/black-widow/2.txt
Green Goblin had infiltrated a SHIELD data center wearing a disguise: a purple
hat placed directly on top of his goblin mask. It fooled no one. Natasha was
already inside, blending into the background like a shadow with a badge. She
watched him trip over three cables, trigger a sprinkler, and nearly topple a
server rack. "He doesn't need arresting," she murmured into her earpiece. "He
needs supervision." She walked up behind him, tapped his shoulder, and guided
him out a back door before any real damage occurred. "How did you even get in?"
she asked. "The door was open," Goblin said. Natasha went to talk to security.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/black-widow/3.txt
Venom sat on the pavement outside a locked warehouse, trying and failing to pick
the lock with fingers that were simply too wide for the keyhole. Natasha watched
from the rooftop across the street. She waited. She was extraordinarily patient.
After eleven minutes Venom sat down and looked at his own hands in frustrated
defeat. She dropped down beside him. "What's inside?" she asked. "A skateboard,"
Venom admitted, embarrassed. "Left it there two weeks ago." She picked the lock in
four seconds. "Next time, leave a note with your phone number." She handed the
skateboard over. Venom held it with unexpected gentleness.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/black-widow/4.txt
Natasha sat in SHIELD's intelligence room, monitoring seven cities at once on
a curved wall of screens. She was best at this: finding patterns in noise,
connecting dots so small no one else noticed them. Nick Fury stood at her shoulder.
"Anything?" She pointed to a faint blip near the harbor. "Someone moving slowly,
methodically. Not a threat — they're lost." She zoomed in. A tourist, map held
upside down, circling the same block for twenty minutes. She sent a nearby agent
to help with directions. Fury raised an eyebrow. Natasha shrugged. "Better safe,"
she said, and returned to her seven screens.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/black-widow/5.txt
A SHIELD communications satellite had been scrambled by a burst of solar energy,
and the Avengers were flying partially blind. Natasha took charge. Tony repaired
the hardware mid-flight, steadied by Thor. Cap organized ground communications
the old-fashioned way: radios and signal mirrors. Hulk stood guard at the relay
station. Peter swung emergency cable connections between two antenna towers.
Natasha coordinated everything from the center, monitoring five channels at once
and routing each team with precise, calm instructions. Comms were fully restored
in forty minutes. "How do you hold all that in your head?" Peter asked. She
shrugged. "Practice," she said. "And coffee."
EOF

# ── DOCTOR STRANGE ────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/marvel/doctor-strange/1.txt
Dr. Stephen Strange had been the world's most talented surgeon — calm, precise,
unflappable. Then he discovered that magic was real. A teacher called the Ancient
One showed him that reality had many layers, like pages in a book, and a trained
mind could bend them. After years of practice, Stephen became the Sorcerer Supreme,
Earth's magical protector. He wore a Cloak of Levitation that floated on its own
and occasionally patted him on the shoulder when he looked tired. His most
important tool: the Eye of Agamotto, a golden amulet holding the Time Stone —
a deep green Infinity Stone that let him glimpse past and future.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/doctor-strange/2.txt
Dormammu was a vast, swirling, fiery cosmic being who lived in a dimension of
purple flames. He loved dramatic entrances and very long speeches. Today he had
opened a portal in Central Park and was mid-speech about his own magnificence.
Pigeons were not listening. Strange stepped through his own portal and appeared
beside Dormammu at eye level. "Dormammu," he said pleasantly. "I've come to
bargain." He produced a bag of popcorn and offered some. Dormammu, genuinely
surprised, accepted it. They sat on a park bench. Dormammu finished his speech
to an audience of one. Strange gave honest feedback. Dormammu closed the portal
feeling considerably better about the afternoon.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/doctor-strange/3.txt
The Time Stone glowed deep green inside the Eye of Agamotto, humming like a
plucked cello string. Strange floated cross-legged in his study, being very
careful. The Time Stone was one of the most extraordinary Infinity Stones: it
could loop a moment, rewind an accident, or peer forward through a thousand
possible futures all at once. Strange looked ahead sometimes — only to see which
path kept people safest, never for personal gain. Tonight the city below was quiet
and warm. He closed the Eye gently, made a note in his journal: "All well," and
went to make tea.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/doctor-strange/4.txt
The Sanctum Sanctorum was Strange's home, library, and magical headquarters: a
tall narrow New York townhouse that was significantly larger on the inside than
the outside. Every bookshelf held ancient spell texts. Every mirror opened onto
a different dimension. The Cloak hung by the door and re-folded itself when
Strange was busy. That afternoon his friend Wong arrived carrying a tall stack of
books and a bag of takeaway noodles. "Studying or eating?" Wong asked. "Both,"
said Strange, opening a small portal to the kitchen so neither of them had to
walk. Wong passed chopsticks through the portal. It was a perfectly good Tuesday.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/doctor-strange/5.txt
A tear in reality had opened above the Hudson River — a shimmering rip leaking
strange dimensional energy that made every electronic device in ten city blocks
play flute music. Strange tried to seal it alone, but it was too wide. He called
for help. Thor's lightning energized the tear's edges. Tony's Arc Reactor provided
counter-frequency energy to stabilize it. Black Panther's Vibranium sensors pinpointed
the dimensional anchor. Strange then cast the sealing spell — hands moving in
precise glowing arcs — and the tear stitched itself closed with a sound like
a long zipper. The flute music stopped. "I liked the music," Thor said.
"Thor," said Strange. "No."
EOF

# ── HAWKEYE ───────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/marvel/hawkeye/1.txt
Clint Barton had one rule: never miss. He had practiced archery since he was
very young — morning, noon, and evening, rain or shine — until his aim became
something close to magic. No radioactive bites, no gamma rays, no enchanted
hammers. Just years of work and an extraordinarily steady hand. He had arrows
that fired nets, arrows with tiny cameras, arrows that released compressed air,
and one very loud distraction arrow. He wore purple and called himself Hawkeye.
He was living proof that dedication is its own kind of superpower — and that
you never, ever need to miss if you practise enough.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hawkeye/2.txt
Green Goblin swept low over the rooftops and launched smoke pellets directly at
the rooftop garden Clint had been nurturing for three months. "Ha! Smoke garden!"
The tomatoes disappeared into fog. Clint had an arrow nocked before the smoke
cleared. He listened for the glider's hum, led it by exactly two meters, and
fired. The net arrow deployed perfectly, tangling the stabilizing fins. Goblin
drifted to a grumbling stop on the neighbouring rooftop. Clint walked over calmly.
"Three months on those tomatoes." The Goblin surveyed the foggy garden. "I can
help replant," he offered. "Yes," Clint said evenly. "You can."
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hawkeye/3.txt
Venom was on top of a water tower, trying to fix a leaking pipe with his
tendrils. It was not going well. The pipe hissed and sprayed water in every
direction. Venom tried again. Hawkeye watched through his sight from two rooftops
away. He sighed, pulled an arrow fitted with a foam-sealant capsule — standard
infrastructure kit — and fired it with precision from two hundred metres. The
foam sealed the leak cleanly. Venom stared at the pipe. Then at the arrow. Then
looked in the direction it had come from. Clint gave a small wave from his
rooftop. Venom gave a slow, enormous thumbs-up.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hawkeye/4.txt
Saturday morning: Clint at his workbench, checking arrows methodically. Net arrow:
perfect. Smoke capsule: tight and secure. Camera arrow: lens clean and clear. Sonic
arrow: a test-beep that made his coffee mug ring. He laid each one in its foam
case with the same care a musician gives to instruments. Tony wandered in. "I
could build you a targeting computer that automatically—" "Don't," Clint said,
not looking up. "But it would—" "I know." Tony watched Clint nock an arrow and
hit the practice target dead-centre from across the room without standing up.
Tony left without finishing the sentence. Some conversations end themselves.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/hawkeye/5.txt
A fire spread across six connected warehouse rooftops. Trucks couldn't reach the
upper floors. Clint ran the full assessment in ninety seconds: six camera arrows
fired in sequence, each transmitting live images back to his phone. He mapped every
structural weak point and broadcast them on the shared channel. Thor created a
firebreak with targeted lightning. Iron Man directed water drops from above.
Spider-Man sealed ventilation shafts with heat-resistant webbing. Natasha pulled
trapped workers out through windows. Clint guided every single move by radio from
the street below. When it was over, Steve put a hand on his shoulder. "Best eyes
on the team," he said. Clint smiled.
EOF

# ── ANT-MAN ───────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/marvel/ant-man/1.txt
Scott Lang was a clever, kind inventor who loved puzzles and his daughter Cassie
more than anything. He was given an extraordinary suit by scientist Dr. Hank Pym.
The suit used Pym Particles — a discovery that could shrink anything to the size
of a bug, or restore it to normal in an instant. With the helmet on, Scott could
also communicate with ants: carpenter ants, leafcutters, fire ants — thousands of
them, marching wherever he directed. He became Ant-Man: the hero nobody saw coming,
quite literally, because he was usually thumbnail-sized on arrival. He found this
very useful, and also genuinely delightful.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/ant-man/2.txt
Green Goblin was zooming over the park, certain no one could stop him — when his
glider tilted, juddered, and completely lost power. He shook the controls. Nothing.
From somewhere impossibly close, he heard a tiny voice say, "Hi." Ant-Man had
been sitting on the engine cover for two minutes, guiding forty-seven carpenter
ants through the ignition wiring with quiet instructions. Scott grew back to full
size on the path below. "Those smoke pellets were landing in the duck pond," he
said pleasantly. Goblin looked at the ducks. They did look annoyed. "Sorry,"
the Goblin said. He sounded like he meant it.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/ant-man/3.txt
Venom was terrorizing a city block in his usual manner — looming, grinning, being
enormous — when something tiny kept landing on his shoulder. He swatted it. It
returned. He swatted again. This time it brought friends: an entire ant colony,
directed by the invisible Ant-Man, who had located the symbiote's most ticklish
frequencies. Venom squirmed. He writhed. He actually giggled — which surprised
everyone on the pavement below. He collapsed in a laughing heap against a parked
van. "STOP!" he wheezed. Scott grew to full size beside him. "Ready to head home?"
"Yes," Venom admitted, still laughing a little.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/ant-man/4.txt
Scott sat in a warm meadow with his helmet off, watching ants cross his fingers.
Carpenter ants, leafcutters, big calm garden ants — he had learned each species'
signals and rhythms over years of patient listening. Cassie sat beside him, eating
an apple. "What are they saying?" she asked. He watched a garden ant tap twice on
his knuckle. "This one is telling me there's a good crumb at the east end of the
meadow." Cassie squinted at the ant. "That is amazing, Dad." Scott smiled. "Every
creature has something to teach you," he said. The ant tapped twice again,
confirming the crumb situation. He found it and returned it. Seemed polite.
EOF

cat << 'EOF' > webapp/superhero-repo/marvel/ant-man/5.txt
A critical device had been stolen and hidden inside a building with security so
tight that even Natasha couldn't enter unseen. Every plan on the table was too
large. "I'll handle it," Scott said, pulling on his helmet. He shrank, mounted
a winged ant, flew through a ventilation slot the width of a postage stamp, navigated
seventeen corridors at thumbnail-height, located the secure cabinet, retrieved
the device, and rode back out the same way. Total elapsed time: four minutes,
eleven seconds. He set the device on the conference table and poured himself
a coffee. The rest of the team stared. "That's it?" Tony said. "Small problems,"
Scott said, "need small solutions."
EOF
# ════════════════════════════════════════════════════════════════════════════
# NEW DC HEROES
# ════════════════════════════════════════════════════════════════════════════

# ── AQUAMAN ───────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/dc/aquaman/1.txt
Arthur Curry grew up between two worlds: the busy fishing docks above the waves
and the glowing city of Atlantis far below. His father kept the local lighthouse;
his mother was the Queen of Atlantis. Arthur could breathe underwater, swim faster
than a dolphin, and lift an anchor with one hand. Most extraordinarily, he could
speak to every creature in the ocean — sharks, whales, sea turtles, vast schools
of fish — and they understood him completely. He carried a golden trident that
crackled with ocean energy. As Aquaman, King of the Oceans, he protected both the
surface world and the deep sea world, because both needed someone watching over them.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/aquaman/2.txt
The Joker had rented a paddleboat shaped like a swan and was paddling around
Amnesty Bay harbor, tossing rubber fish that beeped when handled into passing
fishing boats. His purple suit was damp, his green hair plastered flat, his
enormous grin completely undimmed. "HA HA! FISH FOR EVERYONE!" Aquaman rose from
the harbor in a single smooth surge, trident in hand, golden armor sheeting water.
"Those aren't real fish. The fishermen are confused." "That's the JOKE," Joker
explained. Arthur thought for a moment. "Come and see real ones instead." He took
the Joker on a full underwater harbor tour. The Joker was, against every
expectation, completely fascinated.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/aquaman/3.txt
Venom had decided to explore the ocean and had swum exactly twelve feet before
realizing he strongly disliked water in his ears. He sat on a dock looking
extremely damp and thoroughly miserable. Aquaman surfaced beside the dock, studying
the enormous gloopy figure with calm interest. "You were in the shipping lane.
There are tankers." Venom looked at the horizon. He had not considered tankers.
Arthur produced a waterproofed map of safe harbour swimming routes, printed on
Atlantean paper that never disintegrated. "The northeastern cove is quiet. Good
for sitting and thinking." Venom took the map carefully. He used it. The crabs
in the cove turned out to be excellent company.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/aquaman/4.txt
Atlantis shimmered in the deep ocean like a city made of moonlight and blue flame:
towers of pearl and living coral, streets lit by bioluminescent creatures, gardens
of flowing kelp and sea-glass. Arthur swam his morning patrol through its grand
archways. A pod of dolphins raced ahead showing off. A whale sang from somewhere
far below. His advisors reported a shifted ocean current rerouting three cargo
ships. Arthur sent a message through the water — a pulse passed from creature to
creature across hundreds of miles — and gently guided all three ships around the
obstruction. Above the surface, three captains simply noticed their navigation
improving. None of them knew why.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/aquaman/5.txt
An underwater fault was shifting, pushing a dangerous wave toward the coast.
Arthur dove deep and found the oldest whale in the Pacific — older than any city —
who knew this fault well. The whale described exactly where to apply pressure.
Arthur directed a thousand large fish to swim synchronized patterns above the
fault line, dampening its resonance (they were surprisingly effective). Above the
waves, Wonder Woman reinforced the coastline. Green Lantern built a subsurface
energy barrier. Superman hovered at the fault's western endpoint, applying precise
steady pressure with both hands. The fault stilled. The wave never rose. "The
ocean told you where to press?" Diana asked. "Always listen to the oldest voices,"
Arthur said.
EOF

# ── SHAZAM ────────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/dc/shazam/1.txt
Billy Batson was ten years old and loved comic books, cheeseburgers, and his
foster family above all things. One evening a magical escalator appeared in a
subway station and carried him up to the throne of an ancient wizard named Shazam.
"You have a pure heart," the old wizard said. "I'm choosing you." He gave Billy
a gift: whenever Billy shouts "SHAZAM!" a bolt of golden lightning transforms
him into the mightiest mortal on Earth — tall, strong, magical, and caped. Solomon's
wisdom. Hercules' strength. Zeus' power. All of it packed into one impressive adult
superhero body. Billy still had his ten-year-old brain inside, though, which meant
he sometimes stopped crime and then got ice cream on the way home.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/shazam/2.txt
The Joker had filled the shopping mall food court with over two thousand rubber
ducks and was sitting in the centre of them honking each one in sequence to
compose a duck orchestra. His purple suit was covered in rubber duck stickers.
"HA HA HA! DO YOU LIKE MY MUSIC?" Billy Batson stood at the entrance eating a
pretzel. He said the word. Lightning struck. He was suddenly very tall and very
caped. He looked around at two thousand rubber ducks and, because his brain was
still ten, said: "These are genuinely incredible." He sat down and honked one.
The Joker honked back. They played duck music together for forty minutes. Then
they cleaned up every single one.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/shazam/3.txt
Two-Face stood outside a cinema, unable to choose between an animated film about
talking fish or one about talking dogs. His coin kept landing on its edge, which
was not an option he had prepared for. SHAZAM! Billy arrived in a crack of gold
lightning, cape billowing impressively. He studied both movie posters. "I've seen
them both," he said with complete confidence — speaking from genuine ten-year-old
expertise. "The fish one has better music. The dog one has funnier bits in the
middle." Two-Face stared up at the very tall, very caped hero. He bought a ticket
for each film and the largest available popcorn. Billy had given excellent advice
and he knew it.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/shazam/4.txt
Billy had noticed something nobody else had written down about the transformation
lightning: it was warm. Not hot or sharp — warm, like a cheerful embrace from an
extremely enthusiastic thunderstorm. He experimented: standing in a garden and
calling the lightning with no threat present, he found that where the bolts struck
nearby earth, seedlings pushed through the soil in hours rather than days. He
reported this to a scientist at the local university. She spent six weeks studying
the effect and published a paper on magical growth energy and its agricultural
potential. Billy thought that was the coolest thing he had ever accidentally
discovered. He got extra credit in science class. Mrs. Alvarez was very proud.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/shazam/5.txt
A runaway freight train had lost its brakes on a mountain line heading for a
small valley town. Superman flew in and pushed from the front, but the grade was
too steep for a clean stop alone. SHAZAM — Billy transformed mid-sprint and threw
his full weight against the rear, boots carving furrows in the track. Wonder Woman
ran alongside, applying braking force to the wheels. The Flash evacuated the town
in three minutes flat. Batman broadcast the safest stopping coordinates: a long
sand embankment at the track's curve. Aquaman raised a packed earth wall there
with his trident. The train buried itself in the bank and stopped. Billy turned
back into Billy. He asked if there was ice cream nearby. There was.
EOF

# ── CYBORG ────────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/dc/cyborg/1.txt
Victor Stone was the fastest athlete and the best programmer his school had ever
seen — a combination that seemed impossible until you met him. After a laboratory
accident, his father used the most advanced technology on Earth to help him recover.
Victor woke to find parts of his body rebuilt with titanium, circuitry, and a
supercomputer woven into his chest. His right arm could fire a sonic cannon. His
eyes could see in infrared, ultraviolet, and sixteen other modes. At first Victor
felt sad. Then he wrote completely new code for himself over one very long weekend
and realised: he was not broken. He was upgraded. He became Cyborg — and he was
remarkable.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/cyborg/2.txt
The Joker had hacked Gotham's outdoor broadcast network — every public screen,
every digital billboard — and was running his greatest pranks on loop: enormous
honking sounds on the hour, the word "HA" in very large letters, and a repeating
image of a whoopee cushion. Victor located the intrusion in 0.4 seconds: a cheerful
purple router bolted to a lamppost outside City Hall. He cleanly disconnected it
in one more second. Every screen returned to normal. The Joker looked at his purple
router. Looked at a blank billboard. "That was fast," he said, sounding genuinely
impressed. Victor handed him the router back. "You left fingerprints on the
Ethernet cable," he said. "All of them."
EOF

cat << 'EOF' > webapp/superhero-repo/dc/cyborg/3.txt
Venom kept causing chaos in the city's data centers — not intentionally, but his
electromagnetic field disrupted servers wherever he walked. Cyborg tracked the
disturbances to their source and found Venom in a server room, genuinely puzzled
as his third batch of equipment beeped and flashed around him. "It just does that,"
Venom said helplessly. Victor scanned the symbiote's frequency, fabricated two
small electromagnetic dampeners in about four minutes, and clipped them to a vest.
"Wear this near electronics." Venom pulled it on. Every server around him quietly
settled. Venom looked down at the vest. "Am I helping?" "You're not hurting,"
Victor said. "That's an excellent start."
EOF

cat << 'EOF' > webapp/superhero-repo/dc/cyborg/4.txt
Victor ran his morning self-diagnostic: neural interface clear, sonic cannon at
ninety percent charge, sensor suite updated with three new filters, main battery
recharged via the wall socket (which always made him feel slightly domestic). He
then added three lines of personal code: a protocol for noticing when teammates
were tired and needed a rest, a new jazz library, and an improved interface for
the Justice League's coffee maker. Batman appeared in the doorway shortly after.
"Did you reprogram the coffee machine?" "It's significantly better," Victor said.
Batman poured a cup, took one sip, and nodded once. For Batman, that was
essentially a standing ovation, and Victor saved it in his personal log.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/cyborg/5.txt
An electromagnetic storm had scrambled the entire Justice League's communication
network. Every hero was unreachable. Victor boosted his own transmission power
and began bridging every communicator on the team one by one: Batman's earpiece,
Wonder Woman's bracelet relay, Superman's comm, Aquaman's sonar channel, Shazam's
magical frequency — he found them all and merged them into one clear shared
signal. "Testing," he broadcast. "Can everyone hear me?" Confirmations arrived
from seven heroes. "Good. Here's the situation." He briefed the full team in
ninety seconds, coordinates and all. Afterward, Diana said, "Victor, you ARE
the network." He filed that line under "nice things people said," which was a
folder he maintained carefully.
EOF

# ── BATGIRL ───────────────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/dc/batgirl/1.txt
Barbara Gordon had grown up in Gotham reading every detective novel she could
find and watching Batman with wide, determined eyes. She admired his precision
and his absolute refusal to stop. So she trained: martial arts, computer forensics,
detective science. She designed her own suit — purple-trimmed cowl, utility belt,
a grappling line she'd engineered herself — and one night appeared on a rooftop
beside Batman with a case already half-solved. He looked at her. "You're not
supposed to be here." "Neither," she said, "are most of the people I stop." He
almost smiled. She became Batgirl, and Gotham now had two silent figures on its
rooftops, which everyone agreed was an improvement.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/batgirl/2.txt
The Joker had scattered a fourteen-clue chalk riddle across Gotham's parks — each
clue pointing to the next, promising a spectacular prank finale at the civic
fountain. Barbara photographed every clue in twelve minutes and solved the complete
puzzle in eight more. She arrived at the fountain forty-five minutes before the
Joker and settled in with a book. When he arrived and pulled his prank lever,
expecting maximum surprise, he found Batgirl sitting on the fountain edge, reading.
"You're early!" he spluttered, deeply betrayed. "You're predictable," she said.
She handed him her solution notes. He read through them, eyebrows rising. "This
is quite good," he admitted. He eventually had them framed.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/batgirl/3.txt
Two-Face had agreed to judge a school science fair, which was a reasonable choice —
he was genuinely intelligent — but was scoring every project by coin flip. A
brilliant water-filtration model got a 2 out of 10. A hand-drawn poster of a potato
got a 9. The children looked bewildered. Batgirl appeared at his elbow and quietly
examined the filtration model. "Look at the gravity-sorting mechanism. That's
genuinely innovative." Two-Face peered at it properly, coin pocketed. His real
assessment: 9.5. He awarded it first prize on the spot. The potato received an
honorable mention for persistence. He thought that was entirely fair. He was quite
a good judge without the coin. He didn't mention this to anyone.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/batgirl/4.txt
The Batcave's secondary terminal was Barbara's. She had filled it with code,
open case files, and — quietly — a better filing system than Bruce's original, which
she had rebuilt over three weekends without telling him. Tonight she was cross-
referencing Gotham's petty crime patterns across twelve districts when she noticed
something: every incident occurred within a hundred metres of a bus stop. She began
drafting updated patrol recommendations. Alfred appeared with tea. "You remind me
of him," he said, nodding toward the main console. "The staying-up-until-three
part." "I'm in bed by midnight," Barbara said. "I have class in the morning."
Alfred smiled warmly. "Even better," he said.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/batgirl/5.txt
A sophisticated cyberattack was shutting down Gotham's emergency services one
system at a time — fire dispatch, ambulance radio, police channels going dark in
sequence. Victor called Barbara before anyone else. "I'll take the east nodes,
you take the west." They worked in parallel at full speed, two of the sharpest
technical minds in the hero community moving through the city's network with
precise coordination. Barbara found the attack's core — a loop of malicious code
disguised as a routine software update — isolated it, and quarantined it cleanly.
Victor swept the west side simultaneously. Batman handled the physical relay point.
All emergency services came back online in twenty-two minutes, two minutes ahead
of their own estimate. Victor said, "You're good." Barbara closed her laptop.
"I know," she said.
EOF

# ── MARTIAN MANHUNTER ─────────────────────────────────────────────────────────

cat << 'EOF' > webapp/superhero-repo/dc/martian-manhunter/1.txt
J'onn J'onzz came from Mars, where he had been a respected guardian and scholar.
When he arrived on Earth, a kind scientist named Dr. Erdel welcomed him with
warmth and genuine curiosity. Under Earth's yellow sun, J'onn found extraordinary
abilities: he could fly, become invisible, pass through solid walls, and lift
enormous weights. He could also read minds — gently, like listening through
glass — and change his shape to become anyone he had seen. But what J'onn loved
most about Earth was its food. Specifically: Oreo biscuits. He had sampled eight
hundred and forty-seven varieties of biscuit and nothing came close. He kept a
supply in his cape at all times. He joined the Justice League because Earth,
he had decided, was absolutely worth protecting.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/martian-manhunter/2.txt
The Joker had painted a large purple arrow on the pavement outside J'onn's
favourite Oreo shop with a sign reading "FREE BISCUITS INSIDE — MAYBE." He sat
nearby, waiting for confused reactions. J'onn walked past invisible, read the
plan from the Joker's surface thoughts — surprisingly cheerful, entirely
unorganised — then turned visible and sat down beside him on the bench. "You
hadn't actually decided what the prank was going to be," J'onn said. The Joker
blinked. "Are you READING MY MIND?" "Only the loud parts," J'onn said. "The
Oreo shop is excellent, by the way. I recommend the double-stuffed." Silence.
"I've never tried them," Joker admitted. They went in together. J'onn bought.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/martian-manhunter/3.txt
J'onn sensed Venom from three blocks away — a tangle of confused, restless emotions
broadcasting like a foghorn in the dark. He phased through a wall and appeared
calmly beside Venom in a narrow alley. Venom recoiled. "What ARE you?" "A friend,"
J'onn said simply. "You seem upset." He could feel it clearly: Venom wasn't
angry, just deeply lost. J'onn sat on a nearby crate. "Would you like to talk?"
Venom, who had genuinely never been asked that before, sat very slowly. They talked
for a long time in the quiet alley. J'onn didn't try to stop him or fight him.
He just listened. Venom left considerably calmer. Sometimes listening is the
strongest thing you can do.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/martian-manhunter/4.txt
On quiet evenings J'onn sat in the Watchtower's observation deck and remembered
Mars: the red plains that stretched forever, the crystal caves that hummed in the
wind, the great libraries where every Martian's memories were stored like living
books. He missed it. But when he looked down at Earth — cities glittering in the
dark, a single lit window in a small house somewhere below — he felt something
that wasn't quite the same as what he'd lost, but was its own good and real thing.
He ate an Oreo. He opened his log and wrote: "Earth: curious, warm, endlessly
surprising. Worth every day." He had another Oreo. The observation deck was very
peaceful at this hour.
EOF

cat << 'EOF' > webapp/superhero-repo/dc/martian-manhunter/5.txt
A strange panic had swept through a crowded stadium — no one could explain why;
everyone simply felt suddenly and unreasonably afraid. J'onn closed his eyes and
reached outward with his mind, scanning carefully. There: a small device beneath
the east stands, emitting a low-frequency fear signal. "East concourse, row four,
storage room C," he said into his communicator. Batman was there in ninety seconds.
The Flash evacuated the stands in four minutes. J'onn broadcast a quiet, warm
mental signal outward — nothing controlling, simply a gentle steady feeling of
"you are safe, everything is fine" that settled over twenty thousand people like
a warm blanket. The panic dissolved. J'onn opened his eyes. He had one Oreo
remaining. He ate it. A good afternoon's work.
EOF
# ════════════════════════════════════════════════════════════════════════════
# AVENGERS — MULTI-HERO ENSEMBLE STORIES
# ════════════════════════════════════════════════════════════════════════════

cat << 'EOF' > webapp/superhero-repo/avengers/1.txt
AVENGERS ASSEMBLE

The first day the Avengers officially met was not going smoothly. Thor set Mjolnir
on the glass coffee table, which cracked. Tony's security system kept targeting
Clint's arrows. Bruce tried to make tea; the kettle was broken and Hulk briefly
appeared to squeeze it back into shape. Natasha had already filed a complete
dossier on everyone before introductions. Steve tried to get everyone seated.
"Could we just—" CRASH. "—maybe put the hammer outside—" BEEP BEEP BEEP. Then
Peter Parker knocked on the door, unsure he had the right address. Everyone
turned to look. "Is this the Avengers?" Natasha checked her list. He was not on
it. He joined anyway. It was the right call.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/2.txt
THE STRONGEST AVENGER

The friendly strength contest was Thor's idea and everyone knew it would be
spectacular. First event: lifting a city bus. Thor lifted it with two fingers.
Hulk lifted it with one finger and held it steady while Steve ate his lunch on
the roof. Second event: arm wrestling. The table broke in seventeen seconds.
Third event: Thor threw Mjolnir and Hulk batted it back with one fist — it orbited
Earth twice before returning. Fourth: roaring. Hulk roared and every bird in
the park left. Thor roared and every bird in the next three parks left. They
declared it a draw. "Next time," Tony said, checking damage reports, "we do
this further outside the city." They were already outside the city. "Further,"
Tony said.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/3.txt
THE INFINITY STONE RELAY

Six Infinity Stones. Six colors. Six very different powers. The Reality Stone
(red) had turned up in a museum. The Space Stone — the Tesseract, glowing blue —
sat in an Asgardian vault under Thor's watch. The Time Stone (green) hung in the
Eye of Agamotto around Strange's neck. The Power Stone (purple) was found vibrating
quietly in a Wakandan mine by T'Challa's engineers. The Soul Stone (orange) had
sunk into the middle of the Atlantic Ocean and had to be retrieved via submarine.
The Mind Stone had been inside a library book nobody had checked out in forty-three
years. Strange put all six in a shielded case. "Do not open this," he said.
Tony had already tried.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/4.txt
THE ESCALATOR INCIDENT

Every escalator in New York had simultaneously started running backwards. Nobody
knew why. It was funny for the first ten minutes and extremely inconvenient
after that. Thor landed on a reversing escalator and was carried backwards into
a pretzel stand. Tony ran diagnostics from the air. Hulk sat on a stopped one
stoically. Natasha traced the malfunction to a single misaligned satellite relay
signal. Scott shrunk to circuit-board size, rode a carpenter ant through the relay
infrastructure, and replaced the faulty chip. Every escalator in the city
restarted — correctly. One child who had been riding the same backwards escalator
for twelve delighted minutes looked deeply disappointed. Hulk carried her to the
top. She gave him a pretzel. It was the best part of the day.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/5.txt
TONY'S LAB DAY

Tony had invited Peter and Scott into the workshop for what he called "next-
generation brainstorming," which meant he had a problem he couldn't solve alone
and needed different-sized perspectives. The problem: a power conduit too narrow
for human hands and too delicate for robot arms. Scott shrank to card-thickness
and walked the full length of it, mapping every junction. Peter's sticky fingers
let him work at vertical angles without dropping tools. Tony watched their body-
camera feeds on a hologram and talked them through each connection. Three hours
later, the conduit was fixed. "Told you we didn't need the robot arms," Peter said.
"The robot arms are still better in forty-three other scenarios," Tony replied.
"I've run the numbers." Scott ate a sandwich the size of a postage stamp.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/6.txt
SHIELD TRAINING DAY

Nick Fury arranged a team drill: rescue a practice dummy from the top floor of
a building, fastest time wins. Thor flew it out in four seconds. "No flying," Fury
said. Thor walked the stairs, carrying the dummy with great dignity. Cap climbed
the outside using his Vibranium shield as a stepping tool: 47 seconds. Natasha
used a grapple and a ventilation shaft: 38 seconds. Clint fired a zip-line arrow:
41 seconds. Scott rode an ant: 12 seconds, but spent 8 of them distracted by an
interesting spider. Hulk walked through the front wall: 9 seconds, but also
created a new door. "That's not a rescue," Fury said. "That's renovation," Hulk
said. Fury stared at the new door for a long moment. It was, he had to admit,
well-placed.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/7.txt
THE TESSERACT PUZZLE

The Tesseract — that humming blue cube of cosmic energy — had developed a new
behaviour: rhythmic pulses, like a slow heartbeat. Tony scanned it. Bruce studied
the gamma frequencies. Strange read the magical resonance. Thor sat beside it and
simply listened. "It is contented," Thor said at last. Everyone looked at him.
"Like a cat," he added. Bruce laughed, which was good because laughter kept the
Hulk at bay. They eventually determined that the Tesseract's rhythm had synced
to the resonant frequency of Avengers Tower itself — the building's own hum.
It had been sitting there long enough to feel at home. Tony filed this under
"things I did not expect today." Strange made tea. The Tesseract pulsed blue,
gently, steadily, like something happy.
EOF

cat << 'EOF' > webapp/superhero-repo/avengers/8.txt
REST DAY

Nick Fury declared a mandatory rest day. No missions. No armor. No hammers
indoors. Tony made breakfast for twelve, which was fine except he invented a new
waffle-maker prototype halfway through and got distracted for ninety minutes.
Steve did laps and taught Natasha the butterfly stroke. Clint and Scott played
cards and debated whether shrinking your hand counted as cheating (it did).
Bruce read three books by a duck pond. Thor played his first board game ever and
was extraordinarily serious about the rules. Peter called Aunt May to tell her
he was safe, which he did every single day without fail. At sunset everyone sat
on the rooftop eating Tony's eventually-perfect waffles, looking at the lit city
below. Nobody said anything for a while. They didn't need to.
EOF

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "Repository ready. Structure:"
find webapp/superhero-repo -type f | sort
echo ""
echo "Total story files: $(find webapp/superhero-repo -name '*.txt' | wc -l | tr -d ' ')"
