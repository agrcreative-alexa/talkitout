/* PIECE B — feedback moment. Owns the docked footer: Check before answering; after Check, ONE beat —
   mood monkey + short verdict (+ banana reward) → one reason line → Continue. Nothing else competes.
   Peek: after Check the player may tap another reply (state.peek); the reason line then explains THAT reply, the
   headline becomes a quiet label, and the whole sheet goes neutral (calm monkey, grey-blue wash, navy button, reward
   pill hidden but its space kept) so nothing about the player's own verdict sticks to a reply they did not choose.
   Tapping their own reply brings their verdict back.
   Height: all three reasons are stacked in one grid cell (two invisible), and the quiet foot line is the same in
   every state of a round, so the sheet is exactly as tall after any peek as it was when it opened.
   Foot: "Tap a reply to see why" in every outcome; on the first round of each skill the "New skill" tip too, in
   every outcome. If both do not fit the height budget the tip's label shortens, then the hint gives way; the tip goes last.
   Gentle scenes (scene.tone === 'gentle'): caring face, quiet words, no sparkle, one soft note.
   The button is the same element box in every state (no resting transforms), so Check and Continue never move.
   Sound: tiny Web Audio chime. Silent before a user gesture, under reduced motion, if TIO.muted /
   TIO.state.muted / TIO.feedback.muted is truthy, or if anything throws. */
window.TIO = window.TIO || {};
TIO.feedback = (function () {
  var HEADS = {
    great: ['Nailed it!', 'Top banana!', 'Smooth talking!', 'Spot on!'],
    ok:    ['So close!', 'Nearly there!', 'Good thinking!'],
    oops:  ['Let’s look at that', 'Ooh, tricky one!', 'Good try!']
  };
  var GENTLE = { great: 'That helped.', ok: 'Kind. Almost there.', oops: 'Ouch — that one stings.' };
  var PEEK = { best: 'Why this one works', other: 'If you said that…' };
  var HINT = 'Tap a reply to see why';
  var BUDGET = { phone: 230, wide: 170 };   /* tallest the sheet may ever be, px */
  var FUR = '#9a6240', SKIN = '#ffd9b0', INK = '#3a2418';

  /* The cheeky monkey. Three playful moods, plus two soft ones for the gentle scenes. */
  function monkey(mood) {
    var eyes, mouth, extra = '';
    var blush = function (o) { return '<circle cx="22" cy="45" r="4" fill="#ff9d8a" opacity="' + o + '"/><circle cx="58" cy="45" r="4" fill="#ff9d8a" opacity="' + o + '"/>'; };
    if (mood === 'great') {
      eyes = '<path d="M23.5 36q5.5-8 11 0M45.5 36q5.5-8 11 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      mouth = '<path d="M28 47.5q12 4 24 0q-1 13.5-12 13.5t-12-13.5z" fill="' + INK + '"/>' +
              '<path d="M33.5 57q6.5-4.5 13 0q-2.5 4-6.5 4t-6.5-4z" fill="#ff8a80"/>';
      extra = blush('.55');
    } else if (mood === 'ok') {
      eyes = '<circle cx="29" cy="35" r="4" fill="' + INK + '"/><circle cx="30.4" cy="33.5" r="1.3" fill="#fff"/>' +
             '<path d="M45.5 36q5.5-5 11 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      mouth = '<path d="M30 49.5q10 9 20 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      extra = blush('.45');
    } else if (mood === 'oops') {
      /* curious, not cross: big eyes looking over at the replies, one brow up, a small thinking mouth */
      eyes = '<circle cx="29" cy="36" r="5.6" fill="#fff"/><circle cx="51" cy="36" r="5.6" fill="#fff"/>' +
             '<circle cx="30.8" cy="34.3" r="2.9" fill="' + INK + '"/><circle cx="52.8" cy="34.3" r="2.9" fill="' + INK + '"/>' +
             '<path d="M44.5 26.5q6-4.5 12-1.5" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>' +
             '<path d="M23.5 29q5.5-1.5 10 .5" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>';
      mouth = '<path d="M33 53q6 3.5 13-.5" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
      extra = blush('.3');
    } else if (mood === 'calm') {
      /* peeking at another reply: plain round eyes, level little smile — no opinion on show */
      eyes = '<circle cx="29" cy="36.5" r="3.9" fill="' + INK + '"/><circle cx="51" cy="36.5" r="3.9" fill="' + INK + '"/>' +
             '<circle cx="30.3" cy="35.1" r="1.3" fill="#fff"/><circle cx="52.3" cy="35.1" r="1.3" fill="#fff"/>';
      mouth = '<path d="M33.5 51.5q6.5 3.6 13 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
      extra = blush('.35');
    } else {
      /* gentle: soft round eyes, brows tipped up in the middle (caring), small warm mouth */
      eyes = '<circle cx="29" cy="37" r="3.7" fill="' + INK + '"/><circle cx="51" cy="37" r="3.7" fill="' + INK + '"/>' +
             '<circle cx="30.2" cy="35.7" r="1.25" fill="#fff"/><circle cx="52.2" cy="35.7" r="1.25" fill="#fff"/>' +
             '<path d="M22.5 30.5q5.5-1 10.5-4.5M57.5 30.5q-5.5-1-10.5-4.5" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      mouth = mood === 'gentle-oops'
        ? '<path d="M34.5 53.5q5.5-3 11 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>'
        : '<path d="M33 51q7 5 14 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
      extra = blush('.5');
    }
    return '<svg class="fb-monkey" viewBox="0 0 80 80" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="40" r="11" fill="' + FUR + '"/><circle cx="68" cy="40" r="11" fill="' + FUR + '"/>' +
      '<circle cx="12" cy="40" r="6" fill="' + SKIN + '"/><circle cx="68" cy="40" r="6" fill="' + SKIN + '"/>' +
      '<path d="M36 13q2-7 7-6q-2 3 0 6z" fill="' + FUR + '"/>' +
      '<circle cx="40" cy="40" r="28" fill="' + FUR + '"/>' +
      '<circle cx="29.5" cy="35" r="12.5" fill="' + SKIN + '"/><circle cx="50.5" cy="35" r="12.5" fill="' + SKIN + '"/>' +
      '<ellipse cx="40" cy="51" rx="20" ry="14.5" fill="' + SKIN + '"/>' +
      extra + eyes + mouth + '</svg>';
  }

  /* Corner badge: tick / step-up arrow / magnifying glass ("let's look") / heart for the gentle scenes. */
  function badge(kind) {
    var p = kind === 'great' ? '<path d="M6.5 12.5l4 4 7.5-8.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
      : kind === 'ok' ? '<path d="M12 18V7M7 11.5l5-5 5 5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'
      : kind === 'heart' ? '<path d="M12 19.2s-7-4.5-7-9.1a3.8 3.8 0 0 1 7-2.1 3.8 3.8 0 0 1 7 2.1c0 4.6-7 9.1-7 9.1z" fill="#fff"/>'
      : '<circle cx="10.6" cy="10.6" r="4.9" fill="none" stroke="#fff" stroke-width="3"/><path d="M14.6 14.6l4.2 4.2" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>';
    return '<svg class="fb-badge" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  function banana() {
    return '<svg class="fb-banana" viewBox="0 0 28 28" aria-hidden="true" focusable="false">' +
      '<path d="M5.2 5.4c-.9 9.8 6 17.8 16.2 17.4 2.3-.1 3.9-1.4 3.5-2.9-.3-1-1.4-1.3-2.7-1.2C15.5 19.3 10.3 14 9.3 5.3 9.1 3.6 5.4 3.7 5.2 5.4z" fill="#ffc933" stroke="#c98f00" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M5.3 5.2c.2-1.5 3.8-1.6 4 .1l-.3-2.5c-.1-.9-3.2-.9-3.4 0z" fill="#7a4a22"/>' +
      '<path d="M8.5 11c1.8 5.2 6 8.8 11.5 9.6" fill="none" stroke="#fff3c4" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>' +
      '</svg>';
  }

  function tap() {
    return '<svg class="fb-tap" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
      '<path d="M8 10V4.6a1.6 1.6 0 0 1 3.2 0V9l3.6.8c.9.2 1.5 1 1.4 1.9l-.5 3.6c-.2 1.2-1.2 2.1-2.4 2.1H9.9c-.8 0-1.5-.4-2-1L4.6 12c-.5-.7-.3-1.6.4-2 .6-.4 1.4-.3 1.9.3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  }

  function sparks() {
    var s = '';
    for (var a = 0; a < 8; a++) s += '<i style="--a:' + (a * 45 + 12) + 'deg;--d:' + (a % 2 ? 40 : 52) + 'px"></i>';
    return '<span class="fb-sparks" aria-hidden="true">' + s + '</span>';
  }

  function render(S) {
    if (!S.checked) {
      var ready = S.picked != null;
      return '<div class="dock dock-check ' + (ready ? 'is-ready' : 'is-idle') + '"><div class="dock-in"><div class="dock-row">' +
        '<p class="dock-hint" aria-hidden="true">' + (ready ? 'Happy with it?' : 'Pick the reply you’d say') + '</p>' +
        '<button class="btn btn-check" data-act="check"' + (ready ? '' : ' disabled') + '>Check</button>' +
        '</div></div></div>';
    }
    var sc = TIO.cur(), mine = TIO.reply(S.picked), m = mine.rating, pts = TIO.PTS[m];
    var peeking = S.peek != null && S.peek !== S.picked;
    var shown = (peeking && TIO.reply(S.peek)) || mine;
    var gentle = sc.tone === 'gentle';
    var sk = TIO.SKILLS[sc.skill] || {};
    var last = S.i >= TIO.SCENES.length - 1;

    var nanas = '';
    for (var b = 0; b < pts; b++) nanas += '<span class="fb-nana" style="--n:' + b + '">' + banana() + '</span>';
    var reward = pts
      ? '<span class="fb-reward" role="img" aria-label="plus ' + pts + (pts === 1 ? ' banana' : ' bananas') + '">' +
          '<b class="fb-plus" aria-hidden="true">+' + pts + '</b>' + nanas + '</span>'
      : '';
    var head = peeking
      ? '<h3 class="verdict-head verdict-peek" id="tio-fb-h">' + (shown.rating === 'great' ? PEEK.best : PEEK.other) + '</h3>'
      : '<h3 class="verdict-head" id="tio-fb-h">' + (gentle ? GENTLE[m] : HEADS[m][S.i % HEADS[m].length]) + '</h3>';

    /* every reason sits in the same grid cell; only the shown one is visible — the cell is always as tall as the tallest */
    var whys = '';
    for (var k = 0; k < S.order.length; k++) {
      var r = TIO.reply(k), on = r === shown;
      whys += '<p class="verdict-why' + (on ? '" id="tio-fb-w"' : ' is-ghost" aria-hidden="true"') + '>' + (r.why || '') + '</p>';
    }

    /* the quiet foot line is the same for the whole round: skill tip on a skill's first round, and the peek hint */
    var first = !!sk.tip;
    for (var j = 0; j < S.i; j++) if (TIO.SCENES[j].skill === sc.skill) first = false;
    var foot = '<div class="fb-foot">' +
      (first ? '<p class="fb-tip"><b>New skill</b><span>' + sk.tip + '</span></p>' : '') +
      '<p class="fb-hint">' + tap() + '<span>' + HINT + '</span></p></div>';

    var skin = peeking ? 'peek' : m;
    var face = peeking ? 'calm' : gentle ? (m === 'oops' ? 'gentle-oops' : 'gentle') : m;
    var mark = peeking ? 'look' : gentle && m !== 'oops' ? 'heart' : m;
    return '<div class="dock dock-fb dock-' + skin + (gentle ? ' is-gentle' : '') + (peeking ? ' is-peek' : '') + '"><div class="dock-in"><div class="dock-row">' +
      '<div class="fb-body">' +
        '<div class="fb-icon">' + (m === 'great' && !gentle && !peeking ? sparks() : '') +
          '<span class="fb-disc">' + monkey(face) + '</span><span class="fb-badge-wrap">' + badge(mark) + '</span></div>' +
        '<div class="verdict">' +
          '<div class="verdict-top">' + head + reward + '</div>' +
          '<div class="fb-whys">' + whys + '</div>' +
          foot +
        '</div>' +
      '</div>' +
      '<button class="btn btn-next" data-act="next" aria-describedby="tio-fb-h tio-fb-w">' + (last ? 'See my title' : 'Continue') + '</button>' +
      '</div></div></div>';
  }

  /* ---- sound: generated, quiet, and never allowed to break the game ---- */
  var gestured = false, ctx = null;
  function mark() { gestured = true; }
  try {
    window.addEventListener('pointerdown', mark, true);
    window.addEventListener('keydown', mark, true);
  } catch (e) {}
  function mq(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }
  var TUNES = {
    great:  [[659.25, 0, .16, .11], [783.99, .09, .16, .11], [1046.5, .18, .34, .12]],
    ok:     [[523.25, 0, .16, .09], [659.25, .11, .28, .09]],
    oops:   [[392, 0, .22, .06], [440, .14, .30, .05]],   /* a small "hm?" that turns up, not a buzzer */
    gentle: [[440, 0, .5, .05]]
  };
  function chime(m) {
    try {
      if (!gestured || mq('(prefers-reduced-motion: reduce)') || TIO.muted || (TIO.state && TIO.state.muted) || TIO.feedback.muted) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = ctx || new AC();
      if (ctx.state === 'suspended' && ctx.resume) { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); }
      var t0 = ctx.currentTime + .02;
      (TUNES[m] || []).forEach(function (n) {
        var o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + n[1];
        o.type = m === 'great' ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(n[0], t);
        g.gain.setValueAtTime(0.01, t);
        g.gain.exponentialRampToValueAtTime(n[3], t + .015);
        g.gain.exponentialRampToValueAtTime(0.01, t + n[2]);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + n[2] + .03);
      });
    } catch (e) {}
  }

  /* Keep the sheet inside its height budget. Runs on every re-draw of the sheet and always lands on the same answer for a
     round (nothing it measures changes between peeks), so the height it settles on at arrival is the height for the round. */
  function fit(dock, root) {
    try {
      var hint = dock.querySelector('.fb-hint'), tip = dock.querySelector('.fb-tip');
      if (hint && !root.querySelector('#tio-stage [data-act="peek"]')) hint.hidden = true;   /* nothing to tap: don't promise it */
      var max = mq('(max-width: 600px)') ? BUDGET.phone : BUDGET.wide;
      var over = function () { return dock.offsetHeight > max; };
      if (tip && over()) tip.classList.add('is-tight');                                      /* label shrinks to "New": often saves a line */
      if (tip && hint && !hint.hidden && over()) { tip.classList.remove('is-tight'); hint.hidden = true; }   /* the takeaway outranks the hint */
      if (tip && over()) tip.classList.add('is-tight');
      if (tip && over()) tip.hidden = true;
      if (hint && !hint.hidden && dock.offsetHeight > max) hint.hidden = true;
      /* headline and reward pill share one line: if a headline is ever too long for it, step the type down */
      var h = dock.querySelector('.verdict-head');
      if (h) for (var n = 0, px = parseFloat(getComputedStyle(h).fontSize); n < 8 && px > 14 && h.scrollWidth > h.clientWidth + 1; n++)
        h.style.fontSize = (px -= 1) + 'px';
    } catch (e) {}
  }

  /* capture phase runs before the engine re-draws: remember whether focus was on our button */
  var focusInDock = false;
  function noteFocus() {
    try { var a = document.activeElement; focusInDock = !!(a && a.closest && a.closest('#tio-dock')); } catch (e) { focusInDock = false; }
  }
  try {
    document.addEventListener('click', noteFocus, true);
    document.addEventListener('keydown', noteFocus, true);
  } catch (e) {}

  var wasChecked = false;
  function after(S, root, changed) {
    try {
      var now = S.screen === 'play' && S.checked;
      if (changed && changed.dock && now) {
        var dock = root.querySelector('#tio-dock .dock-fb'), btn = root.querySelector('#tio-dock .btn-next');
        if (dock) fit(dock, root);
        if (!wasChecked) {
          /* arrival: the only time the sheet animates, chimes, or takes focus */
          if (dock) dock.classList.add('is-arriving');
          if (btn) { try { btn.focus({ preventScroll: true }); } catch (e) { btn.focus(); } }
          var r = TIO.reply(S.picked);
          if (r) chime(TIO.cur().tone === 'gentle' ? 'gentle' : r.rating);
        } else if (btn && focusInDock && (!document.activeElement || document.activeElement === document.body)) {
          /* a peek re-drew the sheet; if focus was on Continue it fell off the page — put it back; never take it from a card */
          try { btn.focus({ preventScroll: true }); } catch (e) {}
        }
      }
      wasChecked = now;
    } catch (e) {}
  }

  return { HEAD: { great: HEADS.great[0], ok: HEADS.ok[0], oops: HEADS.oops[0] }, render: render, after: after, muted: false };
})();
