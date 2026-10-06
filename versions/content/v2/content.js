/* PIECE E — scene writing. Owns: SKILLS, SCENES, TITLES.
   Shape is a contract with the other pieces; add optional fields freely, don't rename existing ones.
   Word budgets: setting ≤ 14 · says ≤ 12 · reply text ≤ 14 · act ≤ 6 · why ≤ 18 (one idea) · tip ≤ 12.
   who.mood is one of: happy | sad | smirk | angry | curious | stern | excited. */
window.TIO = window.TIO || {};

TIO.SKILLS = {
  real:     { name: 'Be real',      tip: 'True and kind. No fibs, no stings, no masks.' },
  present:  { name: 'Be all there', tip: 'Screens away, eyes up. Keep the string tight.' },
  well:     { name: 'Be a well',    tip: 'Breathe first. Say a little. Let them ask for more.' },
  comfort:  { name: 'Show up',      tip: 'Say it’s unfair. Then just do one helpful thing.' },
  cool:     { name: 'Stay cool',    tip: 'Count to five. Then ask: “Did you mean that to hurt?”' }
};

/* rating: 'great' (2 bananas) | 'ok' (1) | 'oops' (0). Each scene needs exactly one of each.
   Order eases in: light and funny first, the two grief scenes in the middle, a win to finish. */
TIO.SCENES = [
  { id: 'haircut', skill: 'real',
    who: { name: 'Maya', face: '👧', color: '#ffb4a2', mood: 'happy' },
    setting: 'Maya’s new fringe is very, very short. She is beaming.',
    says: 'I cut my own fringe! Do you love it?',
    replies: [
      { text: 'You look so happy with it. That’s what matters!', rating: 'great',
        why: 'All true, all kind. You cheered for her smile, not the fringe.' },
      { text: 'I LOVE it! Best fringe ever!', rating: 'ok',
        why: 'Kind, but a fib. Fibs make your real compliments worth less.' },
      { text: 'Um… it’s a bit wonky.', rating: 'oops',
        why: 'True, but ouch. Being real doesn’t mean being rude.' }
    ] },
  { id: 'rocket', skill: 'present',
    who: { name: 'Sam', face: '👦', color: '#ffd166', mood: 'excited' },
    setting: 'You’re mid-level on your tablet. Your little brother Sam crashes in.',
    says: 'LOOK! My rocket! It took me a hundred years!',
    replies: [
      { act: 'Tablet face-down. Eyes on Sam.', text: 'Whoa! Show me how it flies.', rating: 'great',
        why: 'Picture a string between you and Sam. Screen down pulls it tight.' },
      { text: 'One sec, let me finish this level.', rating: 'ok',
        why: 'Honest, but Sam’s big moment is now, not after your level.' },
      { act: 'Keep playing.', text: 'Mm-hm. Cool. I’m listening.', rating: 'oops',
        why: 'Mouth says listening, eyes say game. The string goes floppy and Sam lets go.' }
    ] },
  { id: 'book', skill: 'well',
    who: { name: 'Zara', face: '👩', color: '#cdb4db', mood: 'curious' },
    setting: 'Reading time. The new girl, Zara, points at your book.',
    says: 'What’s that one about?',
    replies: [
      { text: 'A kid finds a dragon egg. Want the best bit?', rating: 'great',
        why: 'Like a well: a little to start, and Zara can pull up more.' },
      { text: 'It’s good. You’d like it.', rating: 'ok',
        why: 'Not a waterfall, but the bucket came up empty. Give her one fun thing.' },
      { text: 'So there’s this kid, and his uncle, and they move house, and then…', rating: 'oops',
        why: 'Waterfall! When words gush out, people stop listening.' }
    ] },
  { id: 'show', skill: 'real',
    who: { name: 'Theo', face: '🧒', color: '#a2d2ff', mood: 'excited' },
    setting: 'Everyone at lunch loves a show called Sock Wizards. You think it’s boring.',
    says: 'Sock Wizards is the BEST. You love it too, right?',
    replies: [
      { text: 'Not really my thing. Who’s your favourite wizard, though?', rating: 'great',
        why: 'You stayed you, and stayed friendly. That’s who friends end up trusting.' },
      { text: 'Um… yeah, it’s okay I guess.', rating: 'ok',
        why: 'A small fib, but now you have to keep pretending every lunchtime.' },
      { text: 'YES! Obsessed! I’ve seen every episode!', rating: 'oops',
        why: 'That’s a mask. Masks get itchy, and friends can tell.' }
    ] },
  { id: 'biscuit', skill: 'comfort',
    who: { name: 'Priya', face: '😢', color: '#bde0fe', mood: 'sad' },
    setting: 'Priya is very quiet at break. She’s holding a photo of her dog.',
    says: 'Biscuit died yesterday.',
    replies: [
      { text: 'That’s so unfair. Biscuit was the best dog.', rating: 'great',
        why: 'You said it’s unfair, and you said Biscuit’s name. Priya will remember that.' },
      { text: 'I’m so sorry.', rating: 'ok',
        why: 'Kind, and never wrong. Something about Biscuit would stay with her longer.' },
      { text: 'At least you can get a new puppy.', rating: 'oops',
        why: '“At least” tries to shrink a big sadness. Priya needs it seen, not fixed.' }
    ] },
  { id: 'notes', skill: 'comfort',
    who: { name: 'Ava', face: '😔', color: '#d8e2dc', mood: 'sad' },
    setting: 'Ava is back after her grandad’s funeral. She missed a week of school.',
    says: 'I’ve missed so much. I don’t know where to start.',
    replies: [
      { text: 'I copied this week’s notes for you. Sit with me at lunch?', rating: 'great',
        why: 'You just did it. Ava didn’t have to ask or work anything out.' },
      { text: 'Let me know if you need anything.', rating: 'ok',
        why: 'Sounds kind, but it’s homework for a sad person: working out what to ask for.' },
      { text: 'Don’t worry. Everything happens for a reason.', rating: 'oops',
        why: 'That skips right past how Ava feels. She needs a friend, not a saying.' }
    ] },
  { id: 'homework', skill: 'well',
    who: { name: 'Ms Okoye', face: '👩‍🏫', color: '#f6bd60', mood: 'stern' },
    setting: 'Ms Okoye stops at your desk. Your homework is on the kitchen table.',
    says: 'So. Where is your homework?',
    replies: [
      { act: 'One slow breath first.', text: 'I left it at home. I’ll bring it tomorrow.', rating: 'great',
        why: 'Breath first, then a short true answer. That sounds calm, even if you’re not.' },
      { text: 'Sorry sorry sorry! I forgot it!', rating: 'ok',
        why: 'True and short, but it tumbled out in a panic. Breathe first next time.' },
      { text: 'Well, my sister had football, and the dog was barking, and my bag…', rating: 'oops',
        why: 'A waterfall of reasons sounds nervous. The real answer gets lost in the splash.' }
    ] },
  { id: 'buzz', skill: 'present',
    who: { name: 'Leo', face: '🧑', color: '#b8e0d2', mood: 'sad' },
    setting: 'Leo is telling you about his terrible morning. Your phone buzzes.',
    says: '…and then I called Mr Hill “Mum”. In front of EVERYONE.',
    replies: [
      { act: 'Phone goes in your pocket.', text: 'Oh no. What did he say?!', rating: 'great',
        why: 'Phone out of sight tells Leo he’s number one right now.' },
      { act: 'Peek at the screen.', text: 'Sorry, what? Say that again.', rating: 'ok',
        why: 'You came back, but Leo felt the string go slack for a second.' },
      { act: 'Reply to the message.', text: 'Keep going, I’m listening.', rating: 'oops',
        why: 'Nobody can read and listen at once. Leo drops his end of the string.' }
    ] },
  { id: 'shoes', skill: 'cool',
    who: { name: 'Dex', face: '😏', color: '#ffadad', mood: 'smirk' },
    setting: 'Dex smirks at your shoes. A few kids are watching.',
    says: 'Nice shoes. Did your grandma pick them?',
    replies: [
      { act: 'Count to five. Silently.', text: 'Can you say that again?', rating: 'great',
        why: 'In the quiet, his mean words echo back at him. Saying them twice is even harder.' },
      { act: 'Shrug and walk off.', text: 'Okay.', rating: 'ok',
        why: 'Cool and calm, nice. But Dex never had to hear how mean it sounded.' },
      { text: 'At least mine don’t smell like yours!', rating: 'oops',
        why: 'A comeback is just what he wanted. Now it’s a show for the crowd.' }
    ] },
  { id: 'match', skill: 'cool',
    who: { name: 'Riley', face: '😠', color: '#ffc6ff', mood: 'angry' },
    setting: 'Your team just lost by one goal. Riley storms over.',
    says: 'You’re the reason we lost!',
    replies: [
      { act: 'Wait. Look at Riley.', text: 'Did you mean for that to sound hurtful?', rating: 'great',
        why: 'Riley goes red: “No. Sorry.” Hardly anyone wants to be the mean one.' },
      { text: 'Whatever.', rating: 'ok',
        why: 'No explosion, good. But “whatever” leaves the mean words sitting there.' },
      { text: 'No, YOU are! You missed three shots!', rating: 'oops',
        why: 'Now it’s a shouting match. Nobody ever wins those.' }
    ] }
];

/* Final titles, matched on bananas out of 20 (highest `min` that fits wins).
   Pattern: "As ___ as a ___" with an animal the results screen can draw (monkey, penguin, parrot, giraffe, sloth). */
TIO.TITLES = [
  { min: 18, title: 'As fluent as a cheeky monkey',            blurb: 'You swing through tricky chats like they’re vines.' },
  { min: 14, title: 'As smooth as a penguin on a water slide', blurb: 'One or two wobbles, then whoosh. Nearly top banana.' },
  { min: 10, title: 'As chatty as a parrot at a party',        blurb: 'Plenty of words! Next up: picking the kind ones.' },
  { min: 6,  title: 'As wobbly as a giraffe on roller skates', blurb: 'Wobbly, but still standing. Skates get easier every go.' },
  { min: 0,  title: 'As sleepy as a sloth on a Monday',        blurb: 'Slow start. Sloths always get there. Have another go!' }
];
