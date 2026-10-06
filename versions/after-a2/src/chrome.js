/* PIECE C — lesson chrome and flow. Owns: start screen, top bar (quit, progress, banana count, streak), round-to-round transitions.
   Public: TIO.chrome.start(S), TIO.chrome.topbar(S), TIO.chrome.after(S, root, changed),
           TIO.chrome.mascot(mood, size)  -> SVG string, moods: happy | cheer | oops | think (head only, square)
           TIO.chrome.banana(size)        -> SVG string, a single banana
   The top bar string is deliberately constant for a whole game, so the engine never replaces its DOM;
   progress, banana count, streak and the little rider are updated in after(), which lets them animate. */
(function () {
  var T = window.TIO = window.TIO || {};
  var FUR = '#9a623c', FUR_D = '#74452a', FACE = '#ffdcb0', EAR = '#f4b78a', INK = '#23304f', MOUTH = '#6b2533';

  /* ---------- art ---------- */
  var FACES = {
    happy:
      '<path d="M37 44q8-5 15-1M68 41q8-6 16 0" fill="none" stroke="' + FUR_D + '" stroke-width="3" stroke-linecap="round"/>' +
      '<g class="mk-eyes"><ellipse cx="45" cy="57" rx="5.5" ry="7.5" fill="' + INK + '"/><ellipse cx="75" cy="57" rx="5.5" ry="7.5" fill="' + INK + '"/>' +
      '<circle cx="47" cy="54" r="2.2" fill="#fff"/><circle cx="77" cy="54" r="2.2" fill="#fff"/></g>' +
      '<path d="M45 77Q62 98 76 74Q60 83 45 77Z" fill="' + MOUTH + '" stroke="' + MOUTH + '" stroke-width="2" stroke-linejoin="round"/>',
    cheer:
      '<path d="M37 59q8-12 16 0M67 59q8-12 16 0" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M43 74Q60 104 77 74Z" fill="' + MOUTH + '" stroke="' + MOUTH + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M53 85Q60 80 67 85Q60 91 53 85Z" fill="#ff8597"/>' +
      '<path class="mk-spark" d="M9 8l2.4 6.6L18 17l-6.6 2.4L9 26l-2.4-6.6L0 17l6.600-2.4z" fill="#ffc933"/>' +
      '<path class="mk-spark" d="M110 2l1.9 5.100 5.100 1.900-5.100 1.900-1.900 5.100-1.900-5.100-5.100-1.900 5.100-1.900z" fill="#ffc933"/>',
    oops:
      '<path d="M35 47l16-5M69 42l16 5" fill="none" stroke="' + FUR_D + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="45" cy="58" r="8.5" fill="#fff"/><circle cx="75" cy="58" r="8.5" fill="#fff"/>' +
      '<circle cx="46" cy="60" r="3.6" fill="' + INK + '"/><circle cx="74" cy="60" r="3.6" fill="' + INK + '"/>' +
      '<path d="M48 85q4-5 8 0t8 0t8 0" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M101 10c4 6 6.500 9.500 6.500 13a6.500 6.500 0 0 1-13 0c0-3.500 2.500-7 6.500-13z" fill="#7cc8ff"/>',
    think:
      '<path d="M37 46h14M68 41q8-6 16 0" fill="none" stroke="' + FUR_D + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="45" cy="58" r="8" fill="#fff"/><circle cx="75" cy="58" r="8" fill="#fff"/>' +
      '<circle cx="48" cy="54.500" r="3.600" fill="' + INK + '"/><circle cx="78" cy="54.500" r="3.600" fill="' + INK + '"/>' +
      '<path d="M53 83q8 4 15-3" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="104" cy="20" r="5" fill="#c9d3e6"/><circle cx="114" cy="8" r="3" fill="#c9d3e6"/>'
  };
  function head(mood) {
    return '<g class="mk-head">' +
      '<circle cx="18" cy="60" r="16" fill="' + FUR + '"/><circle cx="18" cy="60" r="9" fill="' + EAR + '"/>' +
      '<circle cx="102" cy="60" r="16" fill="' + FUR + '"/><circle cx="102" cy="60" r="9" fill="' + EAR + '"/>' +
      '<path d="M50 24q2-15 12-12q-3 4-1 8q7-8 13-2q-7 2-9 9z" fill="' + FUR + '"/>' +
      '<ellipse cx="60" cy="61" rx="41" ry="42" fill="' + FUR + '"/>' +
      '<path d="M60 40c-8-12-34-8-34 12c0 10 5 16 8 20c-3 16 10 28 26 28s29-12 26-28c3-4 8-10 8-20c0-20-26-24-34-12z" fill="' + FACE + '"/>' +
      '<circle cx="35" cy="76" r="6" fill="#ff8f7a" opacity=".5"/><circle cx="85" cy="76" r="6" fill="#ff8f7a" opacity=".5"/>' +
      '<circle cx="56" cy="70" r="1.800" fill="' + FUR_D + '"/><circle cx="64" cy="70" r="1.800" fill="' + FUR_D + '"/>' +
      FACES[mood] + '</g>';
  }
  function mascot(mood, size) {
    mood = FACES[mood] ? mood : 'happy'; size = +size || 96;
    return '<svg class="mk mk-' + mood + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + head(mood) + '</svg>';
  }
  var BANANA = '<path d="M8 5c-2 13 6 23 20 22c1.500-1 1.500-2.500 0-3.500c-8 .5-14-6-14.500-18c-2-1.500-4-1.500-5.500-.5z" fill="#ffc933" stroke="#e0a800" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M8.200 5.200l.6-3.400l3.600.4l1 3.300z" fill="#74452a"/><path d="M11.500 10c1 8 5 13 12 14.500" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>';
  function banana(size) {
    size = +size || 24;
    return '<svg class="ico-banana" width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' + BANANA + '</svg>';
  }
  var FLAME = '<svg class="ico-flame" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M13 1.500c.5 4.500 6 6.500 6 12.500a7 7 0 0 1-14 0c0-3.200 1.800-4.800 2.300-7.500c1.700.8 2.700 2 2.900 3.800c1.500-2 2.900-4.800 2.800-8.800z" fill="#ff7a1a"/>' +
    '<path d="M12 12c.4 2 2.800 2.900 2.800 5.300a2.800 2.800 0 0 1-5.600 0c0-2 1.800-2.800 2.800-5.300z" fill="#ffd34d"/></svg>';
  /* whole monkey for the start screen: sits, waves, holds a banana */
  function hero() {
    return '<svg class="mk mk-hero" viewBox="-18 0 236 212" aria-hidden="true" focusable="false">' +
      '<ellipse cx="100" cy="203" rx="58" ry="7" fill="#23304f" opacity=".1"/>' +
      '<path class="mk-tail" d="M72 180C28 186 10 150 32 138C47 130 56 147 43 153" fill="none" stroke="' + FUR + '" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="mk-wave"><path d="M74 150Q44 146 36 112" fill="none" stroke="' + FUR + '" stroke-width="12" stroke-linecap="round"/><circle cx="35" cy="107" r="10" fill="' + FACE + '"/></g>' +
      '<ellipse cx="100" cy="162" rx="35" ry="33" fill="' + FUR + '"/><ellipse cx="100" cy="166" rx="21" ry="22" fill="' + FACE + '"/>' +
      '<ellipse cx="78" cy="195" rx="16" ry="9" fill="' + FACE + '"/><ellipse cx="122" cy="195" rx="16" ry="9" fill="' + FACE + '"/>' +
      '<g class="mk-bob" transform="translate(40 20)">' + head('happy') + '</g>' +
      '<g class="mk-hold"><path d="M126 152Q162 158 178 130" fill="none" stroke="' + FUR + '" stroke-width="12" stroke-linecap="round"/>' +
      '<g transform="translate(183 100) rotate(58) scale(1.9)"><g transform="translate(-16 -16)">' + BANANA + '</g></g>' +
      '<circle cx="179" cy="127" r="10" fill="' + FACE + '"/></g>' +
      '</svg>';
  }

  /* ---------- screens ---------- */
  var TILT = [-3, 2, -1.5, 3, -2];
  function start() {
    var skills = Object.keys(T.SKILLS || {}).map(function (k, n) {
      return '<li class="sticker sticker-' + (n % 5) + '" style="--tilt:' + TILT[n % 5] + 'deg;--n:' + n + '">' + T.SKILLS[k].name + '</li>';
    }).join('');
    var rounds = (T.SCENES || []).length || 10, max = T.MAX || rounds * 2;
    return '<section class="start">' +
      '<div class="start-hero">' +
        '<p class="start-bubble">Bet you can’t grab all <b>' + max + '</b> bananas!</p>' +
        '<div class="start-monkey">' + hero() + '</div>' +
      '</div>' +
      '<h1 class="start-title">Talk It <span>Out</span></h1>' +
      '<p class="start-sub">' + rounds + ' tricky moments. What would <em>you</em> say?</p>' +
      '<button class="btn btn-go" data-act="start">Start</button>' +
      (skills ? '<ul class="start-skills" aria-label="Superpowers you will pick up">' + skills + '</ul>' : '') +
      '</section>';
  }
  function topbar() {
    var n = (T.SCENES || []).length;
    return '<div class="topbar">' +
      '<button class="topbar-quit" type="button" data-chrome="quit" aria-label="Quit game">' +
        '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 3l14 14M17 3L3 17" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg></button>' +
      '<div class="progress" role="progressbar" aria-label="Rounds done" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="0">' +
        '<div class="progress-track"><div class="progress-fill"></div></div>' +
        '<div class="progress-lane"><div class="progress-rider"></div></div>' +
      '</div>' +
      '<div class="topbar-streak" hidden>' + FLAME + '<b></b></div>' +
      '<div class="topbar-count">' + banana(28) + '<b>0</b></div>' +
      '</div>' +
      '<div class="quit" hidden>' +
        '<div class="quit-card" role="alertdialog" aria-modal="true" aria-labelledby="quit-h" aria-describedby="quit-p">' +
          '<div class="quit-art">' + mascot('oops', 104) + '</div>' +
          '<h2 class="quit-head" id="quit-h">Leave already?</h2>' +
          '<p class="quit-text" id="quit-p"></p>' +
          '<button class="btn quit-stay" type="button" data-chrome="stay">Keep playing</button>' +
          '<button class="btn quit-leave" type="button" data-act="home">Leave</button>' +
        '</div>' +
      '</div>';
  }

  /* ---------- live updates ---------- */
  var prev = null, lastKey = null, opener = null;
  function $(sel) { var top = document.getElementById('tio-top'); return top && top.querySelector(sel); }
  function calm() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function replay(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function floatPlus(host, n) {
    if (!host || calm()) return;
    var chip = document.createElement('span');
    chip.className = 'topbar-plus'; chip.setAttribute('aria-hidden', 'true'); chip.textContent = '+' + n;
    host.appendChild(chip);
    setTimeout(function () { if (chip.parentNode) chip.parentNode.removeChild(chip); }, 1100);
  }

  function after(S, root, ch) {
    var stage = document.getElementById('tio-stage');
    var key = S.screen + ':' + (S.screen === 'play' ? S.i : '');
    if (stage && ch.stage) {
      /* only a new round / new screen arrives; a pick or check re-render of the same round must not replay it */
      stage.classList.remove('is-arriving');
      if (key !== lastKey) {
        stage.scrollTop = 0;
        if (S.screen !== 'start') { void stage.offsetWidth; stage.classList.add('is-arriving'); }
        if (!stage.__tioArrive) {
          stage.__tioArrive = true;
          stage.addEventListener('animationend', function (e) { if (e.animationName === 'stage-arrive') stage.classList.remove('is-arriving'); });
        }
      }
    }
    lastKey = key;
    if (S.screen !== 'play') { prev = null; opener = null; return; }

    var bar = $('.topbar'); if (!bar) return;
    var prog = $('.progress'), fill = $('.progress-fill'), rider = $('.progress-rider');
    var count = $('.topbar-count'), streak = $('.topbar-streak');
    var n = T.SCENES.length, done = S.i + (S.checked ? 1 : 0), pct = done / n * 100;
    var fresh = ch.top || !prev, snap = fresh || Math.abs(done - prev.done) > 1;

    if (snap) bar.classList.add('is-snap');
    fill.style.width = pct + '%'; rider.style.left = pct + '%';
    prog.setAttribute('aria-valuenow', done);
    if (snap) { void bar.offsetWidth; bar.classList.remove('is-snap'); }
    else if (done > prev.done) replay(prog, 'is-bump');

    if (fresh || S.bananas !== prev.bananas) {
      count.querySelector('b').textContent = S.bananas;
      count.setAttribute('aria-label', S.bananas + (S.bananas === 1 ? ' banana' : ' bananas'));
      if (!snap && S.bananas > prev.bananas) { replay(count, 'is-bump'); floatPlus(count, S.bananas - prev.bananas); }
    }

    var hot = S.streak >= 2;
    if (fresh || S.streak !== prev.streak) {
      streak.hidden = !hot;
      if (hot) {
        streak.querySelector('b').textContent = S.streak;
        streak.setAttribute('aria-label', S.streak + ' great answers in a row');
        if (!snap) replay(streak, 'is-bump');
      }
    }

    var rating = S.checked && S.picked != null ? T.reply(S.picked).rating : null;
    var gentle = T.cur && T.cur() && T.cur().tone === 'gentle';
    var mood = rating ? (gentle ? 'happy' : rating === 'great' ? 'cheer' : rating === 'oops' ? 'oops' : 'happy') : S.picked != null ? 'think' : 'happy';
    if (fresh || mood !== prev.mood) {
      rider.innerHTML = mascot(mood, 40);
      if (!snap && rating) replay(rider, rating === 'oops' ? 'is-shake' : 'is-hop');
    }
    prev = { done: done, bananas: S.bananas, streak: S.streak, mood: mood };
  }

  /* ---------- quit confirm (in-page, no confirm()) ---------- */
  function quitBox() { return $('.quit'); }
  function quitOpen() { var q = quitBox(); return !!q && !q.hidden; }
  function openQuit() {
    var S = T.state, q = quitBox(); if (!S || S.screen !== 'play' || !q) return;
    if (!S.bananas && !S.i && !S.checked) { T.actions.home(); return; }   /* nothing to lose yet */
    var p = q.querySelector('.quit-text');
    p.textContent = S.bananas ? 'You’ll lose your ' + S.bananas + (S.bananas === 1 ? ' banana.' : ' bananas.') : 'You’ll lose your spot.';
    opener = document.activeElement;
    q.hidden = false;
    var stay = q.querySelector('.quit-stay'); if (stay) stay.focus();
  }
  function closeQuit() {
    var q = quitBox(); if (!q || q.hidden) return;
    q.hidden = true;
    var back = opener && document.contains(opener) ? opener : $('.topbar-quit');
    opener = null; if (back && back.focus) back.focus();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-chrome]') : null;
    if (el) { if (el.getAttribute('data-chrome') === 'quit') openQuit(); else closeQuit(); return; }
    if (e.target.classList && e.target.classList.contains('quit')) closeQuit();   /* tap outside the card */
  });
  /* capture phase: while the confirm is open the engine must not see Enter / 1-3 */
  window.addEventListener('keydown', function (e) {
    if (quitOpen()) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeQuit(); return; }
      if (e.key === 'Tab') {
        var f = quitBox().querySelectorAll('button'), first = f[0], last = f[f.length - 1], a = document.activeElement;
        if (e.shiftKey && (a === first || !quitBox().contains(a))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (a === last || !quitBox().contains(a))) { e.preventDefault(); first.focus(); }
      }
      e.stopPropagation();   /* focused button still gets its native Enter / Space click */
      return;
    }
    if (e.key === 'Escape' && T.state && T.state.screen === 'play') { e.preventDefault(); openQuit(); }
  }, true);

  T.chrome = { start: start, topbar: topbar, after: after, mascot: mascot, banana: banana };
})();
