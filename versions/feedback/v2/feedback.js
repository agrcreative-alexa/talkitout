/* PIECE B — feedback moment. Owns: the docked footer — Check button before answering; after Check, the rating banner,
   the "why" explanation, the better reply when you missed it, the skill tip, and Continue.
   Hierarchy after Check: monkey + verdict + bananas (instant read) → one "why" line → quieter card with the better
   reply (if missed) and the skill tip. Nothing is hidden behind a click. Continue is pinned; only the text scrolls.
   Sound: tiny Web Audio chime per rating. Silent before a user gesture, under reduced motion, if TIO.muted /
   TIO.state.muted / TIO.feedback.muted is truthy, or if anything throws. */
window.TIO = window.TIO || {};
TIO.feedback = (function () {
  var HEADS = {
    great: ['Nailed it!', 'Top banana!', 'Smooth talking!', 'Spot on!'],
    ok:    ['So close!', 'Nearly there!', 'Good thinking!'],
    oops:  ['Ooh, tricky one!', 'Good try!', 'Hmm, let’s look']
  };
  var TRY = { ok: 'Even better', oops: 'Try this one' };
  var FUR = '#9a6240', SKIN = '#ffd9b0', INK = '#3a2418';

  /* The cheeky monkey, three moods. Drawn here so the moment has a face, not just a tick. */
  function monkey(mood) {
    var eyes, mouth, extra = '';
    if (mood === 'great') {
      eyes = '<path d="M23.5 36q5.5-8 11 0M45.5 36q5.5-8 11 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      mouth = '<path d="M28 47.5q12 4 24 0q-1 13.5-12 13.5t-12-13.5z" fill="' + INK + '"/>' +
              '<path d="M33.5 57q6.5-4.5 13 0q-2.5 4-6.5 4t-6.5-4z" fill="#ff8a80"/>';
      extra = '<circle cx="22" cy="45" r="4" fill="#ff9d8a" opacity=".55"/><circle cx="58" cy="45" r="4" fill="#ff9d8a" opacity=".55"/>';
    } else if (mood === 'ok') {
      eyes = '<circle cx="29" cy="35" r="4" fill="' + INK + '"/><circle cx="30.4" cy="33.5" r="1.3" fill="#fff"/>' +
             '<path d="M45.5 36q5.5-5 11 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      mouth = '<path d="M30 49.5q10 9 20 0" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      extra = '<circle cx="22" cy="45" r="4" fill="#ff9d8a" opacity=".45"/><circle cx="58" cy="45" r="4" fill="#ff9d8a" opacity=".45"/>';
    } else {
      eyes = '<circle cx="29" cy="36" r="5.6" fill="#fff"/><circle cx="51" cy="36" r="5.6" fill="#fff"/>' +
             '<circle cx="30.8" cy="34.3" r="2.9" fill="' + INK + '"/><circle cx="52.8" cy="34.3" r="2.9" fill="' + INK + '"/>' +
             '<path d="M44.5 26.5q6-4.5 12-1.5" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>' +
             '<path d="M23.5 29q5.5-1.5 10 .5" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>';
      mouth = '<path d="M33 53.5q5 3.5 12-1.5" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
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

  /* Corner badge: tick / nearly-there arrow / curious question mark. */
  function badge(mood) {
    var p = mood === 'great' ? '<path d="M6.5 12.5l4 4 7.5-8.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
      : mood === 'ok' ? '<path d="M12 18V7M7 11.5l5-5 5 5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M8.5 9.5a3.6 3.6 0 1 1 5.3 3.2c-1.2.7-1.8 1.3-1.8 2.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="18.7" r="1.8" fill="#fff"/>';
    return '<svg class="fb-badge" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  function banana() {
    return '<svg class="fb-banana" viewBox="0 0 28 28" aria-hidden="true" focusable="false">' +
      '<path d="M5.2 5.4c-.9 9.8 6 17.8 16.2 17.4 2.3-.1 3.9-1.4 3.5-2.9-.3-1-1.4-1.3-2.7-1.2C15.5 19.3 10.3 14 9.3 5.3 9.1 3.6 5.4 3.7 5.2 5.4z" fill="#ffc933" stroke="#c98f00" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M5.3 5.2c.2-1.5 3.8-1.6 4 .1l-.3-2.5c-.1-.9-3.2-.9-3.4 0z" fill="#7a4a22"/>' +
      '<path d="M8.5 11c1.8 5.2 6 8.8 11.5 9.6" fill="none" stroke="#fff3c4" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>' +
      '</svg>';
  }

  function bulb() {
    return '<svg class="fb-bulb" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 3a6.5 6.5 0 0 0-3.8 11.8c.7.5 1 1.2 1 2V17h5.6v-.2c0-.8.3-1.5 1-2A6.5 6.5 0 0 0 12 3z" fill="#ffc933" stroke="#c98f00" stroke-width="1.5"/>' +
      '<path d="M9.7 20h4.6" stroke="#6a7592" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function sparks() {
    var s = '';
    for (var a = 0; a < 8; a++) s += '<i style="--a:' + (a * 45 + 12) + 'deg;--d:' + (a % 2 ? 46 : 60) + 'px"></i>';
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
    var sc = TIO.cur(), r = TIO.reply(S.picked), sk = TIO.SKILLS[sc.skill], m = r.rating, pts = TIO.PTS[m];
    var best = sc.replies.filter(function (x) { return x.rating === 'great'; })[0];
    var last = S.i >= TIO.SCENES.length - 1;
    var head = HEADS[m][S.i % HEADS[m].length];
    var nanas = '';
    for (var b = 0; b < pts; b++) nanas += '<span class="fb-nana" style="--n:' + b + '">' + banana() + '</span>';
    var reward = pts
      ? '<span class="fb-reward" role="img" aria-label="plus ' + pts + (pts === 1 ? ' banana' : ' bananas') + '">' +
          '<b class="fb-plus" aria-hidden="true">+' + pts + '</b>' + nanas + '</span>'
      : '';
    var better = (m !== 'great' && best)
      ? '<div class="fb-better"><span class="fb-label">' + TRY[m] + '</span>' +
          '<p class="fb-quote">“' + best.text + '”</p>' +
          (best.why ? '<p class="fb-quote-why">' + best.why + '</p>' : '') + '</div>'
      : '';
    return '<div class="dock dock-fb dock-' + m + '"><div class="dock-in"><div class="dock-row">' +
      '<div class="fb-scroll">' +
        '<div class="fb-icon">' + (m === 'great' ? sparks() : '') +
          '<span class="fb-disc">' + monkey(m) + '</span><span class="fb-badge-wrap">' + badge(m) + '</span></div>' +
        '<div class="verdict">' +
          '<div class="verdict-top"><h3 class="verdict-head" id="tio-fb-h">' + head + '</h3>' + reward + '</div>' +
          '<p class="verdict-why" id="tio-fb-w">' + r.why + '</p>' +
          '<div class="fb-more" id="tio-fb-m">' + better +
            '<p class="verdict-tip">' + bulb() + '<span><b>' + sk.name + '.</b> ' + sk.tip + '</span></p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="fb-cta"><button class="btn btn-next" data-act="next" aria-describedby="tio-fb-h tio-fb-w tio-fb-m">' +
        (last ? 'See my title' : 'Continue') + '</button></div>' +
      '</div></div></div>';
  }

  /* ---- sound: generated, quiet, and never allowed to break the game ---- */
  var gestured = false, ctx = null;
  function mark() { gestured = true; }
  try {
    window.addEventListener('pointerdown', mark, true);
    window.addEventListener('keydown', mark, true);
  } catch (e) {}
  function calm() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return true; }
  }
  var TUNES = {
    great: [[659.25, 0, .16, .11], [783.99, .09, .16, .11], [1046.5, .18, .34, .12]],
    ok:    [[523.25, 0, .16, .09], [659.25, .11, .28, .09]],
    oops:  [[392, 0, .18, .07], [349.23, .13, .30, .07]]
  };
  function chime(m) {
    try {
      if (!gestured || calm() || TIO.muted || (TIO.state && TIO.state.muted) || TIO.feedback.muted) return;
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

  var wasChecked = false;
  function after(S, root, changed) {
    try {
      var now = S.screen === 'play' && S.checked;
      if (changed && changed.dock && now) {
        var btn = root.querySelector('#tio-dock .btn-next');
        if (btn) { try { btn.focus({ preventScroll: true }); } catch (e) { btn.focus(); } }
        /* the dock just took space from the stage: keep the player's own reply in view */
        var mine = root.querySelector('#tio-stage .is-picked');
        if (mine && mine.scrollIntoView) { try { mine.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
        if (!wasChecked) { var r = TIO.reply(S.picked); if (r) chime(r.rating); }
      }
      wasChecked = now;
    } catch (e) {}
  }

  return { HEAD: { great: HEADS.great[0], ok: HEADS.ok[0], oops: HEADS.oops[0] }, render: render, after: after, muted: false };
})();
