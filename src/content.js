/* PIECE E — scene writing. Owns: SKILLS, SCENES, TITLES.
   Shape is a contract with the other pieces; add optional fields freely, don't rename existing ones.
   Word budgets (hard): setting ≤ 9 · says ≤ 9 · reply text ≤ 8 · act ≤ 4 · why ≤ 12 (one idea) · tip ≤ 9 · blurb ≤ 10.
   Whole pre-tap screen (setting + says + three replies with their DO lines) ≤ 40 words.
   who.mood: happy | sad | smirk | angry | curious | stern | excited | embarrassed.
   reply.vibe: kind | blunt | gush | mumble | joke | snap | calm | rush | shrug | curious. It is how the reply FEELS
     to the person saying it, never a verdict: every vibe in use sits on both best and wrong replies, and the
     gentle rounds use only kind | calm | mumble | curious. (`snap` is allowed but unused: a comeback feels great.)
   reply.back (optional, ≤ 4 words): what the other person says straight after this reply. reply.backMood: their
     face then (same list as who.mood). Quiet and never punishing in the gentle rounds.
   scene.tone: 'gentle' on the two loss rounds (quiet feedback, no fanfare).
   In a round either all three replies have an `act` or none do. */
window.TIO = window.TIO || {};

/* Names must make sense cold on the start-screen chips. Tips are shown once, the first time a skill is met,
   so each is plain (no image) and true for both rounds of its skill. */
TIO.SKILLS = {
  real:     { name: 'Be real',          tip: 'Say true things kindly. No fibs, no faking.' },
  present:  { name: 'Eyes up',          tip: 'Screen away. Eyes on the person talking.' },
  well:     { name: 'Say less',         tip: 'Say a little. They can ask for more.' },
  comfort:  { name: 'Be there',         tip: 'Say it’s unfair. Or just do something kind.' },
  cool:     { name: 'Stay cool',        tip: 'Wait five seconds. Then ask a calm question.' }
};

/* rating: 'great' (2 bananas) | 'ok' (1) | 'oops' (0). Each scene needs exactly one of each.
   Order: light and funny first; the two loss rounds are 4 and 7 with two light rounds between; a win to finish.
   After Check any reply's `why` can be opened, picked or not, so every `why` describes the REPLY (never "you said…"),
   stands on its own and explains any image it uses. Wrong `act` lines must sound sensible to the kid doing them. */
TIO.SCENES = [
  { id: 'haircut', skill: 'real',
    who: { name: 'Maya', face: '👧', color: '#ffb4a2', mood: 'happy' },
    setting: 'Maya cut her own fringe. It’s very short.',
    says: 'Do you love it?',
    replies: [
      { text: 'It’s so YOU! Love how happy you are.', rating: 'great', vibe: 'gush',
        why: 'All true and all kind. No fib needed.',
        back: 'Aww, thanks!', backMood: 'happy' },
      { text: 'I LOVE it! Best fringe ever!', rating: 'ok', vibe: 'kind',
        why: 'Kind, but a fib. Fibs make real compliments worth less.',
        back: 'Really? Best EVER?', backMood: 'curious' },
      { text: 'Um… it’s a bit wonky.', rating: 'oops', vibe: 'blunt',
        why: 'True, but ouch. Being real doesn’t mean being rude.',
        back: 'Oh.', backMood: 'sad' }
    ] },
  { id: 'rocket', skill: 'present',
    who: { name: 'Sam', face: '👦', color: '#ffd166', mood: 'excited' },
    setting: 'You’re mid-game. Little brother Sam bursts in.',
    says: 'LOOK! My rocket took a HUNDRED years!',
    replies: [
      { act: 'Tablet face-down.', text: 'Whoa! How does it fly?', rating: 'great', vibe: 'curious',
        why: 'Tablet down, eyes on Sam. Like a tight string between you.',
        back: 'It flies SO high!', backMood: 'excited' },
      { act: 'Hold up one finger.', text: 'One sec. Nearly finished!', rating: 'ok', vibe: 'rush',
        why: 'Honest! But Sam’s big moment is right now.',
        back: '…Okay.', backMood: 'sad' },
      { act: 'Turn the sound off.', text: 'Mm-hm. Cool. I’m listening.', rating: 'oops', vibe: 'calm',
        why: 'Sound off, but eyes still on the game. Sam can tell.',
        back: 'You’re not looking!', backMood: 'sad' }
    ] },
  { id: 'book', skill: 'well',
    who: { name: 'Zara', face: '👩', color: '#cdb4db', mood: 'curious' },
    setting: 'Reading time. Zara points at your book.',
    says: 'What’s that one about?',
    replies: [
      { text: 'A kid finds a dragon egg. Then chaos.', rating: 'great', vibe: 'joke',
        why: 'Short and fun. Now Zara can ask for more.',
        back: 'Ooh! What chaos?', backMood: 'excited' },
      { text: 'Dunno. It’s good. You’d like it.', rating: 'ok', vibe: 'shrug',
        why: 'Short is good! But it gives Zara nothing fun to picture.',
        back: 'Good how?', backMood: 'curious' },
      { text: 'So there’s this kid, and his uncle, and…', rating: 'oops', vibe: 'gush',
        why: 'Words gushing like a waterfall. People stop listening.',
        back: 'Um. Never mind.', backMood: 'embarrassed' }
    ] },
  { id: 'biscuit', skill: 'comfort', tone: 'gentle',
    who: { name: 'Priya', face: '😢', color: '#bde0fe', mood: 'sad' },
    setting: 'Break time. Priya holds a photo of her dog.',
    says: 'Biscuit died yesterday.',
    replies: [
      { text: 'That’s so unfair. Biscuit was the best.', rating: 'great', vibe: 'mumble',
        why: 'Says it’s unfair and uses Biscuit’s name. That helps.',
        back: 'He really was.', backMood: 'happy' },
      { text: 'Don’t be sad! Want to play football?', rating: 'ok', vibe: 'kind',
        why: 'A kind idea. Priya needs to be sad for a bit first.',
        back: 'Maybe later.', backMood: 'sad' },
      { text: 'At least you can get a new one.', rating: 'oops', vibe: 'calm',
        why: 'Meant kindly. But a new dog isn’t Biscuit.',
        back: 'I want Biscuit.', backMood: 'sad' }
    ] },
  { id: 'show', skill: 'real',
    who: { name: 'Theo', face: '🧒', color: '#a2d2ff', mood: 'excited' },
    setting: 'Everyone loves Sock Wizards. You think it’s boring.',
    says: 'Sock Wizards is the BEST. Right?',
    replies: [
      { text: 'Not my thing. Who’s your favourite wizard?', rating: 'great', vibe: 'kind',
        why: 'Honest and still friendly. Friends trust that.',
        back: 'Sockrates. Obviously!', backMood: 'happy' },
      { text: 'Um… yeah, it’s okay I guess.', rating: 'ok', vibe: 'mumble',
        why: 'A small fib. Small fibs need more fibs later.',
        back: 'Just okay?!', backMood: 'curious' },
      { text: 'YES! Obsessed! Seen every episode!', rating: 'oops', vibe: 'gush',
        why: 'Faking it means more faking. Friends can usually tell.',
        back: 'Favourite episode? Go!', backMood: 'excited' }
    ] },
  { id: 'buzz', skill: 'present',
    who: { name: 'Leo', face: '🧑', color: '#b8e0d2', mood: 'embarrassed' },
    setting: 'Leo’s mid-story. Your phone buzzes.',
    says: 'I called Mr Hill “Mum”. In front of EVERYONE.',
    replies: [
      { act: 'Let it buzz.', text: 'NO. What did he say?!', rating: 'great', vibe: 'rush',
        why: 'The buzz can wait. Leo’s story can’t.',
        back: 'He said “Yes, dear”!', backMood: 'happy' },
      { act: 'Quick look, then back.', text: 'Sorry! Go on, go on.', rating: 'ok', vibe: 'curious',
        why: 'Polite. But one glance is enough to miss the best bit.',
        back: 'Um. Where was I?', backMood: 'embarrassed' },
      { act: 'Peek under the table.', text: 'Keep going, I’m listening.', rating: 'oops', vibe: 'calm',
        why: 'Hiding the phone doesn’t hide it. Leo sees the eyes drop.',
        back: 'Never mind.', backMood: 'sad' }
    ] },
  { id: 'notes', skill: 'comfort', tone: 'gentle',
    who: { name: 'Ava', face: '😔', color: '#d8e2dc', mood: 'sad' },
    setting: 'Ava’s back at school. Her grandad died.',
    says: 'I missed a whole week.',
    replies: [
      { text: 'That’s so hard. Here, I copied my notes.', rating: 'great', vibe: 'calm',
        why: 'Doesn’t wait to be asked. Just does the helpful thing.',
        back: 'Oh. Thank you.', backMood: 'happy' },
      { text: 'Tell me if you need anything, okay?', rating: 'ok', vibe: 'kind',
        why: 'Kind! But now Ava has to work out what to ask.',
        back: 'Okay. Thanks.', backMood: 'sad' },
      { text: 'At least you missed the maths test!', rating: 'oops', vibe: 'mumble',
        why: 'Meant kindly. But it skips past how sad Ava feels.',
        back: '…Yeah. I guess.', backMood: 'sad' }
    ] },
  { id: 'homework', skill: 'well',
    who: { name: 'Ms Okoye', face: '👩‍🏫', color: '#f6bd60', mood: 'stern' },
    setting: 'Ms Okoye stops at your desk.',
    says: 'So. Where’s your homework?',
    replies: [
      { act: 'One slow breath.', text: 'I left it at home. Tomorrow, promise.', rating: 'great', vibe: 'blunt',
        why: 'Breath first, then short and true. That sounds calm.',
        back: 'Tomorrow it is.', backMood: 'happy' },
      { act: 'Answer straight away.', text: 'Sorry sorry sorry! I forgot!', rating: 'ok', vibe: 'rush',
        why: 'True and short! A breath first would sound calmer.',
        back: 'Okay, okay. Tomorrow.', backMood: 'stern' },
      { act: 'Explain it properly.', text: 'Well, my sister had football, then the dog—', rating: 'oops', vibe: 'joke',
        why: 'A waterfall of reasons. The real answer gets lost.',
        back: 'The short version?', backMood: 'stern' }
    ] },
  { id: 'shoes', skill: 'cool',
    who: { name: 'Dex', face: '😏', color: '#ffadad', mood: 'smirk' },
    setting: 'Dex smirks at your shoes. Kids watch.',
    says: 'Nice shoes. Did your grandma pick them?',
    replies: [
      { act: 'Count to five.', text: 'Huh? Say that again.', rating: 'great', vibe: 'shrug',
        why: 'Buys a calm second. Mean words sound meaner said twice.',
        back: 'Uh… never mind.', backMood: 'embarrassed' },
      { act: 'Shrug it off.', text: 'Yeah, okay. Whatever.', rating: 'ok', vibe: 'blunt',
        why: 'Calm, nice. But Dex never hears how mean it sounded.',
        back: 'Ha. Thought so.', backMood: 'smirk' },
      { act: 'Make everyone laugh.', text: 'At least mine don’t smell like yours!', rating: 'oops', vibe: 'joke',
        why: 'A comeback is what Dex wanted. Now it’s a show.',
        back: 'Oh, it’s ON.', backMood: 'angry' }
    ] },
  { id: 'match', skill: 'cool',
    who: { name: 'Riley', face: '😠', color: '#ffc6ff', mood: 'angry' },
    setting: 'You lost by one goal. Riley storms over.',
    says: 'You’re the reason we lost!',
    replies: [
      { act: 'Go quiet first.', text: 'Whoa. Did you mean that to sting?', rating: 'great', vibe: 'curious',
        why: 'A calm question. Hardly anyone wants to be the mean one.',
        back: '…No. Sorry.', backMood: 'embarrassed' },
      { act: 'Walk away.', text: 'Whatever. Don’t care.', rating: 'ok', vibe: 'shrug',
        why: 'No shouting, good. But the mean words just sit there.',
        back: 'Ugh. Fine.', backMood: 'angry' },
      { act: 'Stand up for yourself.', text: 'No, YOU are! You missed three!', rating: 'oops', vibe: 'gush',
        why: 'Shouting back starts a shouting match. Nobody wins those.',
        back: 'Oh yeah?!', backMood: 'angry' }
    ] }
];

/* Final titles, matched on bananas out of 20 (highest `min` that fits wins).
   Pattern: "As ___ as a ___" with an animal the results screen can draw (monkey, penguin, parrot, giraffe, sloth).
   Each blurb is true for its whole band: 20 · 18–19 · 14–17 · 10–13 · 6–9 · 0–5. */
TIO.TITLES = [
  { min: 20, title: 'As golden as a royal cheeky monkey',      blurb: 'Every single banana. The whole jungle bows.' },
  { min: 18, title: 'As fluent as a cheeky monkey',            blurb: 'You swing through tricky chats like vines.' },
  { min: 14, title: 'As smooth as a penguin on a water slide', blurb: 'Mostly whoosh, a few wobbles. Smooth sliding!' },
  { min: 10, title: 'As chatty as a parrot at a party',        blurb: 'Plenty of words! Next: picking the best ones.' },
  { min: 6,  title: 'As wobbly as a giraffe on roller skates', blurb: 'Wobbly, but still rolling. Skates get easier.' },
  { min: 0,  title: 'As sleepy as a sloth on a Monday',        blurb: 'Slow start. Sloths get there. Have another go!' }
];
