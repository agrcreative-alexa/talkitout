/* PIECE E — scene writing. Owns: SKILLS, SCENES, TITLES.
   Shape is a contract with the other pieces; add optional fields freely, don't rename existing ones. */
window.TIO = window.TIO || {};

TIO.SKILLS = {
  real:     { name: 'Be real',            tip: 'Tell the truth kindly. No faking, no stinging.' },
  present:  { name: 'Be all there',       tip: 'Screens down, eyes up. Keep the string between you tight.' },
  well:     { name: 'Be a well',          tip: 'Breathe first. Say a little, and let them ask for more.' },
  comfort:  { name: 'Show up',            tip: 'Say it’s unfair. Then do one helpful thing without being asked.' },
  cool:     { name: 'Stay cool',          tip: 'Pause. Ask them to repeat it. Ask if they meant it to hurt.' }
};

/* rating: 'great' (2 bananas) | 'ok' (1) | 'oops' (0). Each scene needs exactly one 'great'. */
TIO.SCENES = [
  { id: 'haircut', skill: 'real',
    who: { name: 'Maya', face: '👧', color: '#ffb4a2' },
    setting: 'Maya bounces up to you before class. You are not sure about her new haircut.',
    says: 'I got my hair cut! Do you like it?',
    replies: [
      { text: 'You look so happy with it. That’s what matters!', rating: 'great',
        why: 'True and kind. You didn’t fake it, and you didn’t sting her.' },
      { text: 'It’s the best haircut I have ever seen!', rating: 'ok',
        why: 'Kind, but it isn’t what you think. Fibs make your real compliments worth less.' },
      { text: 'Honestly? It looks a bit weird.', rating: 'oops',
        why: 'Honest, but it hurts. Being real is not the same as being rude.' }
    ] },
  { id: 'show', skill: 'real',
    who: { name: 'Theo', face: '🧒', color: '#a2d2ff' },
    setting: 'Everyone at the lunch table loves a show called Robo Squad. You find it boring.',
    says: 'Robo Squad is the best. You love it too, right?',
    replies: [
      { text: 'It’s not really my thing. What’s your favourite bit, though?', rating: 'great',
        why: 'You stayed yourself and stayed friendly. People trust friends who don’t just copy them.' },
      { text: 'Um… yeah, it’s okay I guess.', rating: 'ok',
        why: 'Not a big fib, but you hid what you really think. Now you might have to keep pretending.' },
      { text: 'YES! Best show ever! I’ve seen every episode!', rating: 'oops',
        why: 'That’s wearing a mask to fit in. It gets tiring, and friends can tell.' }
    ] },
  { id: 'rocket', skill: 'present',
    who: { name: 'Sam', face: '👦', color: '#ffd166' },
    setting: 'You are in the middle of a game on your tablet. Your little brother runs in.',
    says: 'Look! I finally finished my rocket!',
    replies: [
      { act: 'Put the tablet face-down and look at him.', text: 'Whoa! Show me how it launches.', rating: 'great',
        why: 'Screen down tells Sam he matters most right now. The string between you goes tight.' },
      { text: 'One minute, let me finish this level. Then show me properly.', rating: 'ok',
        why: 'Honest, and better than half-listening. It only works if you really come back.' },
      { act: 'Keep playing.', text: 'Uh-huh. Cool. I’m listening.', rating: 'oops',
        why: 'Your mouth said listening but your eyes said game. The string went floppy and Sam let go.' }
    ] },
  { id: 'buzz', skill: 'present',
    who: { name: 'Leo', face: '🧑', color: '#b8e0d2' },
    setting: 'Leo is telling you about his awful morning. Your phone buzzes in your hand.',
    says: '…and then the whole class laughed at me.',
    replies: [
      { act: 'Slide the phone into your pocket.', text: 'That sounds horrible. What happened next?', rating: 'great',
        why: 'Phone out of sight means Leo is your number one. That’s what being present looks like.' },
      { act: 'Glance at the screen.', text: 'Sorry, what? Say that again.', rating: 'ok',
        why: 'You came back, but Leo felt the string go slack for a second.' },
      { act: 'Type a reply.', text: 'Keep going, I’m listening.', rating: 'oops',
        why: 'Nobody can read and listen at once. Leo will stop sharing things with you.' }
    ] },
  { id: 'book', skill: 'well',
    who: { name: 'Zara', face: '👩', color: '#cdb4db' },
    setting: 'A new girl sits next to you at reading time and points at your book.',
    says: 'What’s that book about?',
    replies: [
      { text: 'A kid who finds a dragon egg. Want to hear the best part?', rating: 'great',
        why: 'Short and interesting, like a well. Zara can pull up more if she wants it.' },
      { text: 'It’s good.', rating: 'ok',
        why: 'Not too much, but not enough either. Give her one thing to be curious about.' },
      { text: 'So there’s this kid, and his uncle, and first they move house, and then in chapter two…', rating: 'oops',
        why: 'That’s a waterfall. When words gush out, people stop listening.' }
    ] },
  { id: 'homework', skill: 'well',
    who: { name: 'Ms. Okoye', face: '👩‍🏫', color: '#f6bd60' },
    setting: 'Your teacher stops at your desk. Your homework is still at home on the kitchen table.',
    says: 'Where is your homework?',
    replies: [
      { act: 'Take one slow breath.', text: 'I left it at home. I’ll bring it tomorrow.', rating: 'great',
        why: 'Breath first, then a short true answer. That sounds calm and sure of yourself.' },
      { text: 'I don’t know.', rating: 'ok',
        why: 'Short, but it dodges the question. A clear answer earns more trust.' },
      { text: 'Well, my sister had football, and the dog was barking, and my bag was in the car, and…', rating: 'oops',
        why: 'Rushing out lots of reasons sounds nervous. The real answer gets lost in the splash.' }
    ] },
  { id: 'biscuit', skill: 'comfort',
    who: { name: 'Priya', face: '😢', color: '#bde0fe' },
    setting: 'Priya is very quiet at break. She is holding a photo of her dog.',
    says: 'Biscuit died yesterday.',
    replies: [
      { text: 'That is so unfair. Biscuit was the best dog. I’m really sad for you.', rating: 'great',
        why: 'You said her pain is real and you used Biscuit’s name. People remember words like that.' },
      { text: 'I’m sorry.', rating: 'ok',
        why: 'Kind, and never wrong. Saying something about Biscuit would stay with her longer.' },
      { text: 'At least he’s in a better place now.', rating: 'oops',
        why: '"At least" tries to shrink a big sadness. Priya needs you to see it, not fix it.' }
    ] },
  { id: 'notes', skill: 'comfort',
    who: { name: 'Ava', face: '😔', color: '#d8e2dc' },
    setting: 'Ava is back at school after her grandad’s funeral. She has missed a week.',
    says: 'I’ve missed so much. I don’t know where to start.',
    replies: [
      { text: 'I copied this week’s notes for you. Come sit with me at lunch.', rating: 'great',
        why: 'You just did the helpful thing. Ava didn’t have to ask or work anything out.' },
      { text: 'Let me know if you need anything.', rating: 'ok',
        why: 'It sounds kind, but it gives Ava a job: figuring out what to ask for.' },
      { text: 'Don’t worry. Everything happens for a reason.', rating: 'oops',
        why: 'That skips right over how she feels. Sad people need company, not a saying.' }
    ] },
  { id: 'shoes', skill: 'cool',
    who: { name: 'Dex', face: '😏', color: '#ffadad' },
    setting: 'Dex looks at your shoes and smirks. A few kids are watching.',
    says: 'Nice shoes. Did your grandma pick them?',
    replies: [
      { act: 'Stay quiet and count to five.', text: 'Can you say that again?', rating: 'great',
        why: 'Silence makes his words hang in the air. Most people can’t repeat a mean thing out loud.' },
      { act: 'Walk away without a word.', text: '…', rating: 'ok',
        why: 'You kept your cool, which is good. A calm question would show it didn’t rattle you.' },
      { text: 'At least mine don’t smell like yours!', rating: 'oops',
        why: 'An insult back is exactly the fight he wanted. Now you are both in it.' }
    ] },
  { id: 'match', skill: 'cool',
    who: { name: 'Riley', face: '😠', color: '#ffc6ff' },
    setting: 'Your team just lost. Riley storms over to you.',
    says: 'You’re the reason we lost.',
    replies: [
      { act: 'Pause. Look at Riley.', text: 'Did you mean for that to sound hurtful?', rating: 'great',
        why: 'Most people don’t think of themselves as mean. A calm question makes them stop and take it back.' },
      { text: 'Whatever.', rating: 'ok',
        why: 'You didn’t explode, but "whatever" keeps the bad feeling going.' },
      { text: 'No, YOU are! You missed three shots!', rating: 'oops',
        why: 'Now it’s a shouting match and nobody feels better.' }
    ] }
];

/* Final titles, matched on bananas out of 20 (highest `min` that fits wins). */
TIO.TITLES = [
  { min: 18, title: 'As fluent as a cheeky monkey',   blurb: 'You swing through tricky talks like they are vines.' },
  { min: 14, title: 'As smooth as a penguin on ice',  blurb: 'A couple of wobbles, but you glide through most of it.' },
  { min: 10, title: 'As chatty as a parrot in training', blurb: 'You have the words. Now practise picking the kind ones.' },
  { min: 6,  title: 'As wobbly as a baby giraffe',    blurb: 'Still finding your legs. Every giraffe starts this way.' },
  { min: 0,  title: 'As tongue-tied as a sleepy sloth', blurb: 'Slow start. Go again and see how much sticks.' }
];
