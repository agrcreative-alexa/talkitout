/* PIECE D — results screen. Owns: the final score, the cheeky title, the per-skill breakdown, play again.
   render(S) is pure (same state -> same string). All motion is CSS that starts from a "from" keyframe, so with
   reduced motion the markup already shows the final state. after() adds the count-up and the confetti burst. */
window.TIO = window.TIO || {};
(function () {
  var T = window.TIO;

  /* ---------- little drawing helpers ---------- */
  function eye(x, y, r) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 1.2).toFixed(1) + '" fill="#2a2233"/>' +
      '<circle cx="' + (x + r * 0.35).toFixed(1) + '" cy="' + (y - r * 0.5).toFixed(1) + '" r="' + (r * 0.38).toFixed(1) + '" fill="#fff"/>';
  }
  function cheeks(x1, x2, y, r) {
    return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#ff8fa3" opacity=".55"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#ff8fa3" opacity=".55"/>';
  }
  var BAN = '<path d="M5.200 4.300C4.600 12.600 10.400 19.600 19 19.900c1.700.100 2.700-1.500 1.700-2.700C15.500 16.300 11 12.400 9.200 5.100 8.900 3.800 7.800 3.200 6.700 3.300 5.900 3.400 5.300 3.600 5.200 4.300z" fill="var(--b1,#ffc933)"/>' +
    '<path d="M5 4.700 5.200 2.300 7.700 2 8 4z" fill="var(--b2,#8a5a3c)"/>' +
    '<path d="M7 7.500c1 4.500 4 8.300 8.500 10" fill="none" stroke="var(--b3,#ffe894)" stroke-width="1.300" stroke-linecap="round"/>';

  /* ---------- the animals (viewBox 0 0 200 160, flat shapes, no outlines) ---------- */
  var ART = {
    monkey:
      '<path d="M136 150C176 152 184 112 166 105c-12-4-17 11-5 14" fill="none" stroke="#8a5a3c" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M52 162c0-30 20-44 48-44s48 14 48 44z" fill="#8a5a3c"/>' +
      '<ellipse cx="100" cy="160" rx="25" ry="24" fill="#f6d3b0"/>' +
      '<circle cx="46" cy="74" r="20" fill="#8a5a3c"/><circle cx="46" cy="74" r="11" fill="#f6b99a"/>' +
      '<circle cx="154" cy="74" r="20" fill="#8a5a3c"/><circle cx="154" cy="74" r="11" fill="#f6b99a"/>' +
      '<path d="M90 30q4-18 12-6q8-10 8 6z" fill="#8a5a3c"/>' +
      '<ellipse cx="100" cy="74" rx="52" ry="50" fill="#8a5a3c"/>' +
      '<circle cx="81" cy="68" r="22" fill="#f6d3b0"/><circle cx="119" cy="68" r="22" fill="#f6d3b0"/>' +
      '<ellipse cx="100" cy="94" rx="38" ry="26" fill="#f6d3b0"/>' +
      eye(82, 68, 7) +
      '<path d="M110 70q9-10 18 0" fill="none" stroke="#2a2233" stroke-width="4.500" stroke-linecap="round"/>' +
      '<circle cx="95" cy="85" r="2" fill="#b57f5c"/><circle cx="105" cy="85" r="2" fill="#b57f5c"/>' +
      '<path d="M76 95q24 28 48 0z" fill="#5a2630"/>' +
      '<ellipse cx="106" cy="107" rx="9" ry="7" fill="#ff7a8a"/>' +
      cheeks(64, 136, 90, 7),
    penguin:
      '<ellipse cx="100" cy="147" rx="58" ry="9" fill="#bfe3ff"/>' +
      '<ellipse cx="80" cy="144" rx="14" ry="7" fill="#ff9d2e"/><ellipse cx="120" cy="144" rx="14" ry="7" fill="#ff9d2e"/>' +
      '<ellipse cx="50" cy="92" rx="10" ry="30" transform="rotate(38 50 92)" fill="#2f3d66"/>' +
      '<ellipse cx="150" cy="92" rx="10" ry="30" transform="rotate(-38 150 92)" fill="#2f3d66"/>' +
      '<ellipse cx="100" cy="82" rx="48" ry="62" fill="#2f3d66"/>' +
      '<ellipse cx="100" cy="100" rx="33" ry="42" fill="#fff"/>' +
      '<circle cx="85" cy="58" r="19" fill="#fff"/><circle cx="115" cy="58" r="19" fill="#fff"/>' +
      eye(86, 58, 6) + eye(114, 58, 6) +
      '<path d="M90 70h20q2 0 1 2l-9 11q-2 2-4 0l-9-11q-1-2 1-2z" fill="#ff9d2e"/>' +
      cheeks(72, 128, 72, 7) +
      '<path d="M66 96q34 16 68 0l2 12q-36 16-72 0z" fill="#ffc933"/>' +
      '<path d="M118 104l14 26-14-4-6 10-6-30z" fill="#ffc933"/>',
    parrot:
      '<path d="M86 118l-10 40h14l10-22 10 22h14l-10-40z" fill="#2f7de1"/>' +
      '<rect x="42" y="137" width="116" height="10" rx="5" fill="#a9744f"/>' +
      '<path d="M62 84c-20 8-24 34-14 50 14-6 22-22 22-40z" fill="#ffc933"/>' +
      '<path d="M52 108c-8 8-8 20-4 26 9-4 15-12 18-22z" fill="#2f7de1"/>' +
      '<g transform="translate(200 0) scale(-1 1)"><path d="M62 84c-20 8-24 34-14 50 14-6 22-22 22-40z" fill="#ffc933"/><path d="M52 108c-8 8-8 20-4 26 9-4 15-12 18-22z" fill="#2f7de1"/></g>' +
      '<ellipse cx="100" cy="106" rx="40" ry="40" fill="#ef4f4f"/>' +
      '<ellipse cx="100" cy="116" rx="24" ry="24" fill="#ff8a7a"/>' +
      '<rect x="80" y="134" width="15" height="11" rx="5.500" fill="#f5a623"/><rect x="105" y="134" width="15" height="11" rx="5.500" fill="#f5a623"/>' +
      '<path d="M100 30c-12-14-3-25 2-27 0 9 7 13 4 27z" fill="#ffc933"/>' +
      '<path d="M90 32c-15-8-13-21-10-25 4 9 13 11 15 23z" fill="#2f7de1"/>' +
      '<path d="M110 32c15-8 13-21 10-25-4 9-13 11-15 23z" fill="#2f7de1"/>' +
      '<circle cx="100" cy="62" r="37" fill="#ef4f4f"/>' +
      '<ellipse cx="80" cy="60" rx="16" ry="17" fill="#fff"/><ellipse cx="120" cy="60" rx="16" ry="17" fill="#fff"/>' +
      eye(83, 60, 6) + eye(117, 60, 6) +
      '<path d="M85 72q15-14 30 0q0 22-15 30q-15-8-15-30z" fill="#ffb627"/>' +
      '<path d="M92 88q8 5 16 0q-2 9-8 14q-6-5-8-14z" fill="#3a2a33"/>' +
      '<path d="M150 20h30a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-16l-9 9v-9h-5a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z" fill="#fff"/>' +
      '<circle cx="155" cy="35" r="3.500" fill="#ef4f4f"/><circle cx="166" cy="35" r="3.500" fill="#ffb627"/><circle cx="177" cy="35" r="3.500" fill="#2f7de1"/>',
    giraffe:
      '<g transform="rotate(-7 100 160)">' +
      '<path d="M80 164l5-74h30l5 74z" fill="#ffcf66"/>' +
      '<ellipse cx="94" cy="118" rx="6" ry="8" fill="#d98b3a"/><ellipse cx="108" cy="136" rx="7" ry="8" fill="#d98b3a"/><ellipse cx="92" cy="150" rx="6" ry="7" fill="#d98b3a"/>' +
      '<ellipse cx="56" cy="52" rx="18" ry="9" transform="rotate(-18 56 52)" fill="#ffcf66"/><ellipse cx="57" cy="52" rx="10" ry="4.500" transform="rotate(-18 57 52)" fill="#f6a08c"/>' +
      '<ellipse cx="144" cy="52" rx="18" ry="9" transform="rotate(18 144 52)" fill="#ffcf66"/><ellipse cx="143" cy="52" rx="10" ry="4.500" transform="rotate(18 143 52)" fill="#f6a08c"/>' +
      '<rect x="82" y="14" width="8" height="26" rx="4" fill="#ffcf66"/><circle cx="86" cy="14" r="8" fill="#a8642a"/>' +
      '<rect x="110" y="14" width="8" height="26" rx="4" fill="#ffcf66"/><circle cx="114" cy="14" r="8" fill="#a8642a"/>' +
      '<ellipse cx="100" cy="62" rx="36" ry="32" fill="#ffcf66"/>' +
      '<ellipse cx="74" cy="44" rx="7" ry="5" fill="#d98b3a"/><ellipse cx="126" cy="46" rx="6" ry="5" fill="#d98b3a"/><ellipse cx="100" cy="36" rx="6" ry="4" fill="#d98b3a"/>' +
      '<ellipse cx="100" cy="88" rx="31" ry="21" fill="#fff0cc"/>' +
      eye(83, 62, 7) + eye(117, 62, 7) +
      '<ellipse cx="91" cy="84" rx="3" ry="4" fill="#c98a4a"/><ellipse cx="109" cy="84" rx="3" ry="4" fill="#c98a4a"/>' +
      '<path d="M86 95q5 6 10 1q5 6 10 1q4 3 8-2" fill="none" stroke="#7a4a22" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/>' +
      cheeks(68, 132, 78, 6) +
      '</g>',
    sloth:
      '<rect x="6" y="14" width="188" height="13" rx="6.500" fill="#a9744f"/>' +
      '<path d="M150 14c8-10 20-8 22 0z" fill="#58c08a"/><path d="M24 14c4-9 16-9 20 0z" fill="#58c08a"/>' +
      '<path d="M62 76V26M138 76V26" stroke="#a98b6d" stroke-width="22" stroke-linecap="round"/>' +
      '<path d="M54 12v10M62 10v10M70 12v10M130 12v10M138 10v10M146 12v10" stroke="#f1e2c6" stroke-width="4.500" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="98" rx="60" ry="52" fill="#a98b6d"/>' +
      '<ellipse cx="100" cy="100" rx="45" ry="37" fill="#f4e6cd"/>' +
      '<ellipse cx="78" cy="96" rx="17" ry="10" transform="rotate(-24 78 96)" fill="#7a5f47"/>' +
      '<ellipse cx="122" cy="96" rx="17" ry="10" transform="rotate(24 122 96)" fill="#7a5f47"/>' +
      '<path d="M73 96q6 6 12 0M115 96q6 6 12 0" fill="none" stroke="#f4e6cd" stroke-width="3.500" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="106" rx="8" ry="5.500" fill="#4a382a"/>' +
      '<path d="M89 117q11 9 22 0" fill="none" stroke="#4a382a" stroke-width="3.500" stroke-linecap="round"/>' +
      cheeks(66, 134, 112, 6) +
      '<g class="rs-zz" fill="#8b7bd8" font-family="Baloo 2,Trebuchet MS,sans-serif" font-weight="800"><text x="160" y="72" font-size="22">z</text><text x="174" y="54" font-size="16">z</text></g>',
    buddy: /* fallback: a happy banana */
      '<path d="M54 118q-22-6-26-26" fill="none" stroke="#e0a800" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M150 96q22-10 22-34" fill="none" stroke="#e0a800" stroke-width="8" stroke-linecap="round"/>' +
      '<g transform="translate(22 -6) scale(6.600)">' + BAN + '</g>' +
      eye(92, 84, 7) + eye(118, 98, 7) +
      '<path d="M88 104q8 14 22 10" fill="none" stroke="#5a2630" stroke-width="4.500" stroke-linecap="round"/>' +
      cheeks(80, 122, 100, 0)
  };
  /* the 20/20 reward: same monkey, golden fur, and a crown that drops on after the reveal */
  ART.monkeyGold = ART.monkey.replace(/#8a5a3c/g, '#f0a41c').replace(/#f6d3b0/g, '#fff1d0').replace(/#f6b99a/g, '#ffd08a').replace(/#b57f5c/g, '#d98b1f') +
    '<g class="rs-crown"><g transform="translate(0 5) rotate(-9 100 30)">' +
    '<path d="M71 33L66 5l20 13L100 0l14 18 20-13-5 28z" fill="#ffd84a"/>' +
    '<path d="M100 0l14 18 20-13-5 28h-29z" fill="#ffc21a"/>' +
    '<rect x="69" y="27" width="62" height="9" rx="4.500" fill="#e58a00"/>' +
    '<circle cx="66" cy="5" r="4.500" fill="#fff"/><circle cx="100" cy="1" r="5" fill="#fff"/><circle cx="134" cy="5" r="4.500" fill="#fff"/>' +
    '<circle cx="100" cy="31.500" r="4" fill="#ff5d73"/><circle cx="82" cy="31.500" r="3" fill="#5db4ff"/><circle cx="118" cy="31.500" r="3" fill="#5db4ff"/>' +
    '</g></g>';
  var ANIMALS = [
    { k: 'monkey',  re: /monkey|chimp|\bape\b|gibbon/i },
    { k: 'penguin', re: /penguin/i },
    { k: 'parrot',  re: /parrot|parakeet|macaw|cockatoo|budgie/i },
    { k: 'giraffe', re: /giraffe/i },
    { k: 'sloth',   re: /sloth/i }
  ];
  function animalFor(title) {
    for (var i = 0; i < ANIMALS.length; i++) if (ANIMALS[i].re.test(title || '')) return ANIMALS[i].k;
    return 'buddy';
  }
  function art(k, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 200 160" aria-hidden="true" focusable="false"><g clip-path="url(#rs-clip)">' + ART[k] + '</g></svg>';
  }

  /* ---------- skill icons (24x24) ---------- */
  var ICON = {
    real: '<path d="M12 20.500S4.600 16 2.900 11.300C1.700 8 3.700 4.800 7 4.800c2 0 3.500 1 5 2.900 1.500-1.900 3-2.900 5-2.900 3.300 0 5.300 3.200 4.100 6.500C19.400 16 12 20.500 12 20.500z"/>',
    present: '<path fill-rule="evenodd" d="M1.800 12S5.500 5.300 12 5.300 22.200 12 22.200 12 18.500 18.700 12 18.700 1.800 12 1.800 12zm10.200-3.700a3.700 3.700 0 1 0 0 7.400 3.700 3.700 0 0 0 0-7.400z"/>',
    well: '<path d="M12 2.300s7 7 7 12.200a7 7 0 0 1-14 0C5 9.300 12 2.300 12 2.300z"/>',
    comfort: '<circle cx="7.500" cy="7.500" r="3.300"/><circle cx="16.500" cy="7.500" r="3.300"/><path d="M1.500 20.500c0-4.500 2.600-7.300 6-7.300 1.800 0 3.300.800 4.500 2.100 1.200-1.300 2.700-2.100 4.500-2.100 3.400 0 6 2.800 6 7.300z"/>',
    cool: '<path fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round" d="M12 2.500v19M3.800 7.200l16.400 9.600M20.200 7.200 3.800 16.800M9.300 3.800 12 6.300l2.700-2.500M9.300 20.200l2.700-2.500 2.700 2.500"/>',
    star: '<path d="M12 2.200l2.900 6.300 6.900.800-5.100 4.700 1.400 6.800L12 17.400l-6.100 3.400 1.400-6.800L2.200 9.300l6.900-.800z"/>'
  };
  function icon(k) {
    return '<svg class="rs-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + (ICON[k] || ICON.star) + '</svg>';
  }
  var SPARK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l1.600 4.400L12 6 7.600 7.600 6 12 4.400 7.600 0 6l4.400-1.600z" fill="currentColor"/></svg>';

  function splitTitle(title) {
    var m = /^(.*\bas an?)\s+(.+)$/i.exec(title || '');
    return m ? { lead: m[1], punch: m[2] } : { lead: '', punch: title || '' };
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  function mascot(mood, size) {
    try {
      if (T.chrome && typeof T.chrome.mascot === 'function') {
        var s = T.chrome.mascot(mood, size);
        if (typeof s === 'string' && s.indexOf('<svg') > -1) return s;
      }
    } catch (e) {}
    return '';
  }

  /* ---------- render ---------- */
  function render(S) {
    var max = T.MAX || 20, b = Math.max(0, Math.min(max, S.bananas || 0)), ratio = max ? b / max : 0;
    var t = T.titleFor(b) || { title: 'A talker in training', blurb: '' };
    var gold = max > 0 && b >= max;   /* keyed on the score, so it works with or without a dedicated top title */
    var animal = gold ? 'monkey' : animalFor(t.title), parts = splitTitle(t.title);
    var cele = b >= max ? 'max' : ratio >= 0.9 ? 'big' : ratio >= 0.7 ? 'mid' : ratio >= 0.5 ? 'small' : 'soft';

    /* skills */
    /* A skill is "nailed" only when every one of its rounds is logged as great. A skill with nothing logged is
       "not played". "Next up" only ever goes to a skill with a round that was actually missed. */
    var keys = Object.keys(T.SKILLS || {}), weakest = -1, weakRatio = 2, log = S.log || [], allNailed = keys.length > 0;
    var stats = keys.map(function (k, i) {
      var mine = log.filter(function (l) { return l.skill === k; });
      var total = (T.SCENES || []).filter(function (sc) { return sc.skill === k; }).length || mine.length;
      var got = mine.reduce(function (n, l) { return n + (T.PTS[l.rating] || 0); }, 0);
      var missed = mine.some(function (l) { return l.rating !== 'great'; });
      var nailed = total > 0 && mine.length >= total && !missed;
      var pr = mine.length ? got / (mine.length * 2) : null;
      if (missed && pr < weakRatio) { weakRatio = pr; weakest = i; }
      if (!nailed) allNailed = false;
      return { k: k, got: got, max: total * 2, played: mine.length, nailed: nailed, r: total ? Math.min(1, got / (total * 2)) : 0 };
    });
    var C = 2 * Math.PI * 21;
    var tiles = stats.map(function (s, i) {
      var lvl = !s.played ? 'none' : s.nailed ? 'strong' : s.r >= 0.5 ? 'mid' : 'low';
      var word = lvl === 'strong' ? 'nailed it' : lvl === 'mid' ? 'getting there' : lvl === 'low' ? 'needs practice' : 'not played';
      var off = (C * (1 - s.r)).toFixed(1);
      return '<li class="rs-skill is-' + lvl + (s.r ? '' : ' is-zero') + (i === weakest ? ' is-next' : '') + '" style="--i:' + i + '" ' +
        'aria-label="' + T.SKILLS[s.k].name + ': ' + (s.played ? s.got + ' of ' + s.max + ' bananas, ' : '') + word + (i === weakest ? ', practise this next' : '') + '">' +
        '<span class="rs-medal" aria-hidden="true">' +
          '<svg class="rs-ring" viewBox="0 0 52 52"><circle class="rs-ring-track" cx="26" cy="26" r="21"/>' +
          '<circle class="rs-ring-fill" cx="26" cy="26" r="21" style="--c:' + C.toFixed(1) + ';stroke-dasharray:' + C.toFixed(1) + ';stroke-dashoffset:' + off + '"/></svg>' +
          '<span class="rs-disc">' + icon(s.k) + '</span>' +
          (lvl === 'strong' ? '<span class="rs-tick"><svg viewBox="0 0 12 12"><path d="M2.500 6.300l2.400 2.400 4.600-5" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' : '') +
        '</span>' +
        '<span class="rs-skill-name" aria-hidden="true">' + T.SKILLS[s.k].name + '</span>' +
        (i === weakest ? '<span class="rs-next-tag" aria-hidden="true">Next up</span>' : '') +
        '</li>';
    }).join('');

    /* the tip row always has the same shape: mascot face on the left, label + one line on the right */
    function tipRow(cls, at, mood, label, body) {
      var face = mascot(mood, 44);
      return '<div class="rs-tip' + cls + '"' + (at > -1 ? ' style="--at:' + at + ';--n:' + keys.length + '"' : '') + '>' +
        (face ? '<span class="rs-tip-face" aria-hidden="true">' + face + '</span>' : '') +
        '<p class="rs-tip-text"><span class="rs-tip-k">' + label + '</span>' + body + '</p></div>';
    }
    var tip;
    if (weakest > -1) {
      var w = T.SKILLS[stats[weakest].k];
      tip = tipRow('', weakest, 'think', 'Try this next time', '<b>' + w.name + ':</b> ' + w.tip);
    } else if (allNailed) {
      tip = tipRow(' is-all', -1, 'cheer', 'All ' + (keys.length === 5 ? 'five' : keys.length) + ' skills nailed', 'Now try one on a real person today.');
    } else {
      tip = tipRow(' is-info', -1, 'happy', 'Nothing missed so far', 'Play every round to fill in all the skills.');
    }

    /* bananas you can see */
    var cols = max % 2 === 0 && max / 2 <= 14 ? max / 2 : 10, slots = '';
    for (var i = 0; i < max; i++) {
      slots += '<span class="rs-b' + (i < b ? ' is-got' : '') + '" style="--i:' + i + '">' +
        '<svg class="rs-b-ghost" viewBox="0 0 24 24"><use href="#rs-ban"/></svg>' +
        (i < b ? '<svg class="rs-b-full" viewBox="0 0 24 24"><use href="#rs-ban"/></svg>' : '') + '</span>';
    }

    /* a reason to press Play again — one goal per row: the next animal (or, from the top band, the golden monkey) */
    var next = (T.TITLES || []).filter(function (x) { return x.min > b; }).sort(function (a, c) { return a.min - c.min; })[0];
    var head, sub, sil;
    if (gold) {
      head = 'Golden monkey unlocked!'; sub = 'Can you do it twice in a row?';
      sil = '<span class="rs-sil is-won" aria-hidden="true">' + art('monkeyGold', 'rs-sil-art') + '</span>';
    } else if (next && next.min < max) {
      var need = next.min - b;
      head = ratio < 0.5 ? 'You can beat that. Go again?' : 'Who’s hiding?';
      sub = need + (need === 1 ? ' more banana unlocks' : ' more bananas unlock') + ' a new animal.';
      sil = '<span class="rs-sil" aria-hidden="true">' + art(animalFor(next.title), 'rs-sil-art') + '<b>?</b></span>';
    } else {
      head = 'So close!'; sub = plural(max - b, 'more banana') + ' for the golden monkey.';
      sil = '<span class="rs-sil" aria-hidden="true">' + art('monkeyGold', 'rs-sil-art') + '<b>?</b></span>';
    }

    return '<section class="results" data-animal="' + animal + '" data-cele="' + cele + '"' + (gold ? ' data-gold="1"' : '') + ' aria-label="Your results">' +
      '<svg class="rs-defs" width="0" height="0" aria-hidden="true" focusable="false"><symbol id="rs-ban" viewBox="0 0 24 24">' + BAN + '</symbol>' +
        '<clipPath id="rs-clip"><rect x="-30" y="-30" width="260" height="176"/><circle cx="100" cy="86" r="77"/></clipPath></svg>' +
      '<div class="rs-hero">' +
        '<p class="rs-kicker">' + (gold ? '<b class="rs-perfect">Perfect score!</b> ' : '') + 'You are<span class="rs-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p>' +
        '<div class="rs-art">' +
          '<span class="rs-spark s1">' + SPARK + '</span><span class="rs-spark s2">' + SPARK + '</span>' +
          '<span class="rs-spark s3">' + SPARK + '</span><span class="rs-spark s4">' + SPARK + '</span>' +
          (gold ? '<span class="rs-spark s5">' + SPARK + '</span><span class="rs-spark s6">' + SPARK + '</span><span class="rs-spark s7">' + SPARK + '</span>' : '') +
          '<span class="rs-q" aria-hidden="true">?</span>' +
          '<span class="rs-pop"><span class="rs-idle">' + art(gold ? 'monkeyGold' : animal, 'rs-animal') + '</span></span>' +
        '</div>' +
        '<div class="rs-words">' +
          '<h1 class="rs-title' + (parts.punch.length > 14 ? ' is-long' : '') + '">' +
            (parts.lead ? '<span class="rs-lead">' + parts.lead + '</span> ' : '') +
            '<span class="rs-punch">' + parts.punch + '</span></h1>' +
          (t.blurb ? '<p class="rs-blurb">' + t.blurb + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="rs-score" role="img" aria-label="' + b + ' of ' + max + ' bananas">' +
        '<div class="rs-count" aria-hidden="true"><b class="rs-num" data-n="' + b + '">' + b + '</b><span>of ' + max + '</span></div>' +
        '<div class="rs-bunch" aria-hidden="true" style="--cols:' + cols + '">' + slots + '</div>' +
      '</div>' +
      '<ul class="rs-skills" style="--n:' + keys.length + '">' + tiles + '</ul>' +
      tip +
      '<div class="rs-end">' +
        '<div class="rs-nudge">' + sil + '<p><b>' + head + '</b><span>' + sub + '</span></p></div>' +
        '<div class="rs-cta"><button class="btn rs-go" data-act="replay">Play again</button></div>' +
      '</div>' +
      '</section>';
  }

  /* ---------- after: count-up + confetti (both skipped for reduced motion, both stop by themselves) ---------- */
  var run = 0, canvas = null, raf = 0;
  var T_BANANAS = 1750, STEP = 45, T_BURST = 1150;
  function stop() {
    run++;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
  }
  function still() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function countUp(el, me) {
    var n = +el.getAttribute('data-n') || 0, t0 = performance.now(), shown = -1;
    if (!n) return;
    el.textContent = '0';
    (function tick(now) {
      if (me !== run || !el.isConnected) return;
      var v = Math.max(0, Math.min(n, Math.floor((now - t0 - T_BANANAS) / STEP) + 1));
      if (v !== shown) { shown = v; el.textContent = v; }
      if (v < n) requestAnimationFrame(tick);
    })(t0);
    /* never leave a wrong number behind if frames stop coming (hidden tab) */
    setTimeout(function () { if (me === run && el.isConnected) el.textContent = n; }, T_BANANAS + n * STEP + 400);
  }
  function confetti(level, ox, oy, me) {
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    var n = level === 'max' ? 150 : level === 'big' ? 130 : level === 'mid' ? 80 : 34;
    var power = (level === 'small' ? 0.7 : 1) * (W < 520 ? 0.82 : 1.15);
    var life = level === 'small' ? 2000 : 2900;
    var cols = ['#ffc933', '#1fa97a', '#3b82f6', '#ff7a8a', '#8b5cf6', '#ff9d2e'];
    /* a perfect score gets a show: the centre burst, then one cannon from each side, then a golden finale */
    var bursts = [{ x: ox, y: oy, n: n, d: 0, dir: 0, pw: 1 }];
    if (level === 'max') {
      cols = ['#ffc933', '#ffe27a', '#fff', '#ffc933', '#ff7a8a', '#3b82f6', '#ffb000', '#1fa97a'];
      bursts.push({ x: W * 0.04, y: H * 0.66, n: 70, d: 550, dir: 0.5, pw: 1.25 }, { x: W * 0.96, y: H * 0.66, n: 70, d: 900, dir: -0.5, pw: 1.25 },
        { x: ox, y: oy, n: 110, d: 1500, dir: 0, pw: 1.15 });
      life = 2900 + 1500;
    }
    var c = document.createElement('canvas'), g = c.getContext && c.getContext('2d');
    if (!g) return;
    c.className = 'rs-confetti'; c.setAttribute('aria-hidden', 'true');
    c.width = W * dpr; c.height = H * dpr;
    document.body.appendChild(c); canvas = c; g.scale(dpr, dpr);
    var ps = [];
    bursts.forEach(function (bu) {
      for (var i = 0; i < bu.n; i++) {
        var a = -Math.PI / 2 + bu.dir + (Math.random() - 0.5) * (bu.dir ? 1.2 : 2.3), sp = (5 + Math.random() * 12) * power * bu.pw;
        ps.push({ x: bu.x + (Math.random() - 0.5) * 40, y: bu.y + (Math.random() - 0.5) * 20, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
          r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 6, col: cols[i % cols.length],
          ban: i % 4 === 0, ph: Math.random() * 6.3, d: bu.d });
      }
    });
    var t0 = performance.now(), prev = t0;
    (function frame(now) {
      if (me !== run) return;
      var el = now - t0, k = Math.min(3, (now - prev) / 16.7); prev = now;
      g.clearRect(0, 0, W, H);
      g.globalAlpha = el > life - 600 ? Math.max(0, (life - el) / 600) : 1;
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        if (el < p.d) continue;
        p.vy += 0.32 * k; p.vx *= Math.pow(0.985, k); p.vy *= Math.pow(0.985, k);
        p.x += (p.vx + Math.sin(el / 240 + p.ph) * 0.8) * k; p.y += p.vy * k; p.r += p.vr * k;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r);
        if (p.ban) {
          g.strokeStyle = '#ffc933'; g.lineWidth = p.s * 0.55; g.lineCap = 'round';
          g.beginPath(); g.arc(0, 0, p.s * 1.1, 0.25, 2.1); g.stroke();
        } else {
          g.fillStyle = p.col; g.scale(1, Math.cos(el / 130 + p.ph));
          g.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66);
        }
        g.restore();
      }
      if (el < life) raf = requestAnimationFrame(frame);
      else { raf = 0; if (c.parentNode) c.parentNode.removeChild(c); if (canvas === c) canvas = null; }
    })(t0);
  }
  function after(S, root, changed) {
    if (S.screen !== 'results') { if (canvas || raf) stop(); return; }
    if (!changed || !changed.stage) return;
    stop();
    var me = run, stage = document.getElementById('tio-stage');
    if (stage) stage.scrollTop = 0;
    if (still()) return;
    var num = stage && stage.querySelector('.rs-num'), sec = stage && stage.querySelector('.results');
    if (num) countUp(num, me);
    var level = sec && sec.getAttribute('data-cele');
    if (level && level !== 'soft') {
      setTimeout(function () {
        if (me !== run || document.hidden) return;
        var a = stage.querySelector('.rs-art'); if (!a) return;
        var r = a.getBoundingClientRect();
        confetti(level, r.left + r.width / 2, r.top + r.height * 0.55, me);
      }, T_BURST);
    }
  }

  T.results = { render: render, after: after };
})();
