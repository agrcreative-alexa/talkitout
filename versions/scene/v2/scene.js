/* PIECE A — scene screen. Owns: the skill tag, the setting line, the speaker (a drawn character) and their speech bubble,
   the reply cards (idle / picked / checked states).
   Also exports TIO.sceneView.character(who, mood) -> inline SVG string, in case another piece wants the same face. */
window.TIO = window.TIO || {};
(function () {
  /* ---------- character generator ---------- */
  var SKIN = ['#ffdcc2', '#f7c8a0', '#e9ad80', '#cc8f62', '#a86d46', '#80502f'];
  var HAIR = ['#2b1d1a', '#4a2c20', '#7a4a2a', '#b8652e', '#e2a93b', '#d9482f', '#1f2a44'];
  var SHIRT = ['#3b82f6', '#1fa97a', '#ef6f6c', '#8b5cf6', '#ff9f1c', '#23304f', '#14a3b8', '#e0568a'];
  var BACKS = ['none', 'bob', 'long', 'puffs', 'pony', 'pigtails', 'none', 'bun'];
  var FRONTS = ['round', 'fringe', 'side', 'spiky', 'curly', 'quiff', 'part', 'buzz'];
  var INK = '#2a2036';

  /* The ten cast members get hand-picked looks so no two are alike; any other name falls through to the hash. */
  var CAST = {
    'maya':      { skin: 2, hair: 1, back: 'bob',      front: 'fringe', shirt: 2, extra: ['clip'] },
    'theo':      { skin: 0, hair: 3, back: 'none',     front: 'curly',  shirt: 1, extra: ['freckles'] },
    'sam':       { skin: 1, hair: 4, back: 'none',     front: 'spiky',  shirt: 4, extra: ['tooth'], head: 'round' },
    'leo':       { skin: 3, hair: 0, back: 'none',     front: 'quiff',  shirt: 6 },
    'zara':      { skin: 4, hair: 0, back: 'puffs',    front: 'round',  shirt: 7, extra: ['band'] },
    'ms okoye':  { skin: 5, hair: 0, back: 'bun',      front: 'part',   shirt: 5, extra: ['glasses', 'earrings', 'collar'], head: 'tall' },
    'priya':     { skin: 3, hair: 0, back: 'long',     front: 'part',   shirt: 3, extra: ['braid'] },
    'ava':       { skin: 0, hair: 4, back: 'pony',     front: 'side',   shirt: 0 },
    'dex':       { skin: 1, hair: 2, back: 'none',     front: 'side',   shirt: 5, extra: ['cap'], head: 'square' },
    'riley':     { skin: 0, hair: 5, back: 'pigtails', front: 'round',  shirt: 2, extra: ['sweatband', 'freckles'] }
  };

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    return '#' + [n >> 16, n >> 8 & 255, n & 255].map(function (v) {
      v = Math.round(f <= 1 ? v * f : v + (255 - v) * (f - 1));
      return ('0' + Math.max(0, Math.min(255, v)).toString(16)).slice(-2);
    }).join('');
  }
  function lookFor(name) {
    var key = String(name || '').toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim(), c = CAST[key], h = hash(key || 'someone');
    var adult = /^(ms|mrs|mr|miss|dr|coach|sir|madam)\b/.test(key);
    var d = {
      skin: h % SKIN.length, hair: (h >>> 3) % HAIR.length, back: BACKS[(h >>> 6) % BACKS.length],
      front: FRONTS[(h >>> 9) % FRONTS.length], shirt: (h >>> 12) % SHIRT.length,
      head: adult ? 'tall' : ['oval', 'round', 'square'][(h >>> 15) % 3],
      extra: adult ? ['glasses', 'collar'] : (h >>> 17) % 4 === 0 ? ['freckles'] : []
    };
    if (adult) { d.front = ['part', 'side', 'round', 'buzz'][(h >>> 9) % 4]; d.back = ['none', 'bun', 'bob', 'none'][(h >>> 6) % 4]; }
    if (c) for (var k in c) d[k] = c[k];
    return d;
  }

  var MOODS = { happy: 1, sad: 1, smirk: 1, angry: 1, curious: 1, stern: 1, excited: 1 };
  var EMOJI_MOOD = { '😢': 'sad', '😔': 'sad', '😞': 'sad', '😭': 'sad', '😏': 'smirk', '😠': 'angry', '😡': 'angry', '🤔': 'curious', '😃': 'excited', '😄': 'excited', '🤩': 'excited' };
  function moodFor(sc) {
    var w = sc.who || {};
    if (MOODS[w.mood]) return w.mood;
    if (EMOJI_MOOD[w.face]) return EMOJI_MOOD[w.face];
    if (/🏫/.test(w.face || '')) return 'stern';
    var s = String(sc.says || '');
    if (/laughed at me|died|don.t know where|^…/.test(s)) return 'sad';
    if (/!/.test(s)) return 'excited';
    if (/\?\s*$/.test(s)) return 'curious';
    return 'happy';
  }

  function hairBack(kind) {
    switch (kind) {
      case 'bob': return '<path d="M26 62Q25 26 60 26Q95 26 94 62V82Q94 93 84 93H36Q26 93 26 82Z"/>';
      case 'long': return '<path d="M24 62Q23 25 60 25Q97 25 96 62V124H24Z"/>';
      case 'puffs': return '<circle cx="30" cy="36" r="16"/><circle cx="90" cy="36" r="16"/>';
      case 'bun': return '<circle cx="60" cy="20" r="13"/>';
      case 'pony': return '<path d="M82 32Q106 30 105 58Q104 80 93 88Q98 64 86 50Z"/>';
      case 'pigtails': return '<path d="M30 52Q12 54 13 74Q14 88 22 90Q30 80 32 64Z"/><path d="M90 52Q108 54 107 74Q106 88 98 90Q90 80 88 64Z"/>';
    }
    return '';
  }
  function hairFront(kind) {
    switch (kind) {
      case 'fringe': return '<path d="M32 63Q28 27 60 27Q92 27 88 63Q88 51 84 48Q60 52 36 48Q32 51 32 63Z"/>';
      case 'side': return '<path d="M32 63Q27 26 60 26Q94 26 88 63Q89 50 79 42Q60 55 35 47Q32 54 32 63Z"/>';
      case 'spiky': return '<path d="M32 60L28 38L39 43L41 24L52 36L60 19L68 36L79 24L81 43L92 38L88 60Q85 46 60 45Q35 46 32 60Z"/>';
      case 'curly': return '<path d="M32 60Q30 30 60 30Q90 30 88 60Q85 46 60 46Q35 46 32 60Z"/>' +
        '<circle cx="35" cy="46" r="10"/><circle cx="43" cy="33" r="11"/><circle cx="58" cy="27" r="11"/><circle cx="73" cy="30" r="11"/><circle cx="84" cy="41" r="10"/><circle cx="50" cy="42" r="8"/><circle cx="68" cy="42" r="8"/>';
      case 'quiff': return '<path d="M32 61Q29 42 38 33Q42 17 66 19Q86 20 89 40Q90 50 88 61Q85 45 70 43Q50 48 36 44Q32 50 32 61Z"/>';
      case 'part': return '<path d="M32 64Q28 27 60 27Q92 27 88 64Q87 48 60 36Q33 48 32 64Z"/>';
      case 'buzz': return '<path d="M33 57Q31 31 60 31Q89 31 87 57Q84 42 60 41Q36 42 33 57Z"/>';
    }
    return '<path d="M32 61Q29 27 60 27Q91 27 88 61Q86 46 60 45Q34 46 32 61Z"/>';
  }

  function eye(x, y, ry, look) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="4.4" ry="' + ry + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + 1.4 + (look || 0)) + '" cy="' + (y - ry * 0.38) + '" r="1.6" fill="#fff"/>';
  }
  function stroke(d, w) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }

  function faceFor(mood, skin) {
    var eyes, brows, mouth, extra = '', cheek = '#ff8f8f', cheekO = 0.38;
    switch (mood) {
      case 'excited':
        eyes = eye(48, 62, 6.2) + eye(72, 62, 6.2);
        brows = stroke('M42 50Q48 45 54 49', 2.6) + stroke('M66 49Q72 45 78 50', 2.6);
        mouth = '<path d="M48 73H72Q72 88 60 88Q48 88 48 73Z" fill="#7a2338"/><path d="M51 73H69V76.5Q60 78 51 76.5Z" fill="#fff"/><ellipse cx="60" cy="84.5" rx="5.5" ry="2.6" fill="#ff8b94"/>';
        break;
      case 'sad':
        eyes = eye(48, 64, 5, -0.6) + eye(72, 64, 5, -0.6);
        brows = stroke('M42 56L54 51', 2.8) + stroke('M66 51L78 56', 2.8);
        mouth = stroke('M52 81Q60 74 68 81');
        extra = '<path d="M43 70Q39 77 43 79.5Q47 77 43 70Z" fill="#5db8ff"/>';
        cheekO = 0.25;
        break;
      case 'angry':
        eyes = eye(48, 64, 4.2) + eye(72, 64, 4.2);
        brows = stroke('M41 52L55 58', 3.6) + stroke('M65 58L79 52', 3.6);
        mouth = stroke('M52 82Q60 74 68 82', 3.4);
        extra = '<path d="M86 30l5-7M92 36l8-3M90 42l7 2" stroke="#e5484d" stroke-width="3" stroke-linecap="round" fill="none"/>';
        cheek = '#ff5a5a'; cheekO = 0.5;
        break;
      case 'smirk':
        eyes = eye(48, 63, 5.2, 1) + eye(72, 63, 5.2, 1) + '<rect x="42" y="56" width="12" height="5.5" fill="' + skin + '"/><rect x="66" y="56" width="12" height="3.5" fill="' + skin + '"/>';
        brows = stroke('M42 55L54 56', 2.8) + stroke('M66 51Q72 46 79 50', 2.8);
        mouth = stroke('M52 77Q62 81 70 73', 3.2);
        break;
      case 'curious':
        eyes = eye(49, 62, 5.8, 1.2) + eye(73, 62, 5.8, 1.2);
        brows = stroke('M42 53Q48 50 54 53', 2.6) + stroke('M66 48Q72 43 79 47', 2.6);
        mouth = stroke('M53 76Q61 82 68 75');
        break;
      case 'stern':
        eyes = eye(48, 63, 4.8) + eye(72, 63, 4.8);
        brows = stroke('M41 54L54 55', 3) + stroke('M66 55L79 54', 3);
        mouth = stroke('M52 78Q60 76 68 78');
        cheekO = 0.2;
        break;
      default:
        eyes = eye(48, 62, 5.4) + eye(72, 62, 5.4);
        brows = stroke('M42 52Q48 49 54 52', 2.6) + stroke('M66 52Q72 49 78 52', 2.6);
        mouth = stroke('M50 74Q60 85 70 74');
    }
    return '<circle cx="40" cy="73" r="5.5" fill="' + cheek + '" opacity="' + cheekO + '"/><circle cx="80" cy="73" r="5.5" fill="' + cheek + '" opacity="' + cheekO + '"/>' +
      '<g class="char-eyes">' + eyes + '</g>' + brows + mouth + extra;
  }

  function character(who, mood) {
    who = who || {};
    var L = lookFor(who.name), skin = SKIN[L.skin], hair = HAIR[L.hair], shirt = SHIRT[L.shirt];
    var ex = {}; (L.extra || []).forEach(function (e) { ex[e] = 1; });
    var id = 'tioc' + hash(String(who.name || 'x')).toString(36);
    var bg = who.color || '#ffe08a';
    var head = L.head === 'round' ? '<rect x="33" y="35" width="54" height="53" rx="26.5"/>'
      : L.head === 'square' ? '<rect x="34" y="34" width="52" height="54" rx="19"/>'
      : L.head === 'tall' ? '<rect x="35" y="32" width="50" height="58" rx="24"/>'
      : '<rect x="34" y="34" width="52" height="54" rx="24"/>';
    var tilt = mood === 'curious' ? 'rotate(-5 60 90)' : mood === 'sad' ? 'translate(0 3) rotate(4 60 90)' : mood === 'smirk' ? 'rotate(5 60 90)' : mood === 'excited' ? 'translate(0 -2)' : '';
    var s = '<svg class="char-svg" viewBox="0 0 120 124" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
      '<defs><clipPath id="' + id + '"><path d="M-20 -20H140V66H114A54 54 0 0 1 6 66H-20Z"/></clipPath></defs>' +
      '<circle cx="60" cy="66" r="54" fill="' + bg + '"/>' +
      '<circle cx="34" cy="40" r="20" fill="#fff" opacity=".22"/><circle cx="96" cy="92" r="9" fill="#fff" opacity=".2"/>' +
      '<g clip-path="url(#' + id + ')"><g class="char-body">' +
      '<g' + (tilt ? ' transform="' + tilt + '"' : '') + '>' +
      '<g fill="' + hair + '">' + hairBack(L.back) + '</g>' +
      '</g>' +
      '<path d="M12 126Q12 99 42 96H78Q108 99 108 126Z" fill="' + shirt + '"/>' +
      (ex.collar ? '<path d="M46 96L60 108L74 96L80 100L66 114H54L40 100Z" fill="#fff"/>' : '<path d="M47 96Q60 108 73 96Z" fill="' + shade(shirt, 0.82) + '"/>') +
      '<path d="M52 82H68V96Q60 104 52 96Z" fill="' + shade(skin, 0.86) + '"/>' +
      '<g' + (tilt ? ' transform="' + tilt + '"' : '') + '>' +
      '<g fill="' + skin + '"><circle cx="33" cy="64" r="6.5"/><circle cx="87" cy="64" r="6.5"/>' + head + '</g>' +
      (ex.earrings ? '<circle cx="31.5" cy="72" r="2.6" fill="#ffc933"/><circle cx="88.5" cy="72" r="2.6" fill="#ffc933"/>' : '') +
      (ex.freckles ? '<g fill="' + shade(skin, 0.72) + '"><circle cx="42" cy="69" r="1.1"/><circle cx="46" cy="71" r="1.1"/><circle cx="74" cy="71" r="1.1"/><circle cx="78" cy="69" r="1.1"/><circle cx="60" cy="68" r="1"/></g>' : '') +
      faceFor(mood, skin) +
      (ex.tooth && mood === 'excited' ? '<rect x="57" y="73" width="6" height="5" fill="#7a2338"/>' : '') +
      '<g fill="' + hair + '">' + hairFront(L.front) + '</g>' +
      (ex.clip ? '<rect x="73" y="40" width="12" height="5" rx="2.5" fill="#ffc933" transform="rotate(24 79 42)"/>' : '') +
      (ex.band ? '<path d="M31 50Q60 32 89 50L88 44Q60 26 32 44Z" fill="#ffc933"/>' : '') +
      (ex.sweatband ? '<path d="M32 50Q60 40 88 50V43Q60 33 32 43Z" fill="#fff"/><path d="M32 47.5Q60 37.5 88 47.5" stroke="#3b82f6" stroke-width="2" fill="none"/>' : '') +
      (ex.cap ? '<path d="M30 46Q30 20 60 20Q90 20 90 46Z" fill="#e5484d"/><path d="M28 44H92Q108 44 110 51Q96 50 86 50H28Z" fill="#b93338"/><circle cx="60" cy="21" r="3" fill="#b93338"/>' : '') +
      (ex.glasses ? '<g fill="#fff" fill-opacity=".28" stroke="#23304f" stroke-width="2.4"><rect x="38.5" y="54" width="19" height="16" rx="7"/><rect x="62.5" y="54" width="19" height="16" rx="7"/></g><path d="M57.5 61Q60 59 62.5 61" stroke="#23304f" stroke-width="2.4" fill="none"/>' : '') +
      (ex.braid ? '<g fill="' + hair + '"><ellipse cx="29" cy="88" rx="7.5" ry="7"/><ellipse cx="30" cy="99" rx="7" ry="6.5"/><ellipse cx="31" cy="109" rx="6.5" ry="6"/></g><rect x="25" y="113" width="12" height="4" rx="2" fill="#ffc933"/>' : '') +
      '</g></g></g></svg>';
    return s;
  }

  /* ---------- small icons ---------- */
  var SKILL_ICON = {
    real: '<path fill="currentColor" d="M12 20.5s-7.5-4.7-7.5-10.4a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6c0 5.700-7.5 10.4-7.5 10.4z"/>',
    present: '<path fill="currentColor" fill-rule="evenodd" d="M1.800 12S5.500 5.500 12 5.500 22.200 12 22.200 12 18.500 18.500 12 18.500 1.800 12 1.800 12zM12 8.400a3.600 3.600 0 1 0 0 7.200 3.600 3.600 0 0 0 0-7.200z"/>',
    well: '<path fill="currentColor" d="M12 2.800s6.400 6.800 6.400 11.400a6.400 6.400 0 0 1-12.800 0C5.600 9.600 12 2.800 12 2.800z"/>',
    comfort: '<path fill="currentColor" d="M12 3a9.500 9.500 0 0 1 9.500 9.500h-19A9.500 9.500 0 0 1 12 3z"/><path fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" d="M12 12v6.200a2.300 2.300 0 0 1-4.600 0"/>',
    cool: '<path fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" d="M12 3v18M4.200 7.500l15.600 9M19.800 7.500l-15.600 9"/>'
  };
  var STAR = '<path fill="currentColor" d="M12 2.500l2.900 6 6.600.9-4.800 4.600 1.200 6.500L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9z"/>';
  function ico(inner, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + inner + '</svg>'; }
  var MARK = {
    great: '<path fill="none" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round" d="M5.500 12.500l4.300 4.300 8.700-9.300"/>',
    best: STAR,
    ok: '<path fill="none" stroke="currentColor" stroke-width="3.200" stroke-linecap="round" d="M5 13.500q3.500-5 7 0t7-1.500"/>',
    oops: '<path fill="none" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" d="M6.500 6.500l11 11M17.500 6.500l-11 11"/>'
  };
  var MARK_LABEL = { great: 'Great reply', best: 'The best reply', ok: 'Nearly', oops: 'Not this one' };

  /* ---------- render ---------- */
  function render(S) {
    var sc = TIO.cur(), sk = TIO.SKILLS[sc.skill] || { name: '' }, mood = moodFor(sc);
    var replies = S.order.map(function (ri, k) {
      var r = sc.replies[ri], cls = 'reply', mark = '';
      if (r.act) cls += ' has-act';
      if (S.picked === k) cls += ' is-picked';
      if (S.checked) {
        var st = S.picked === k ? r.rating : r.rating === 'great' ? 'best' : '';
        cls += st ? ' is-' + st : ' is-dim';
        if (st) mark = '<span class="reply-mark" role="img" aria-label="' + MARK_LABEL[st] + '">' + ico(MARK[st], 'reply-mark-ic') + '</span>';
      }
      var body = r.act
        ? '<span class="reply-line reply-do"><b class="reply-tag">Do</b><span class="reply-act">' + r.act + '</span></span>' +
          '<span class="reply-line reply-say"><b class="reply-tag">Say</b><span class="reply-text">' + r.text + '</span></span>'
        : '<span class="reply-text">' + r.text + '</span>';
      return '<button type="button" class="' + cls + '" style="--n:' + k + '" data-act="pick" data-k="' + k + '" role="radio" aria-checked="' + (S.picked === k) + '"' + (S.checked ? ' disabled' : '') + '>' +
        '<span class="reply-key" aria-hidden="true">' + (k + 1) + '</span>' +
        '<span class="reply-body">' + body + '</span>' + mark +
        '</button>';
    }).join('');
    var len = String(sc.says || '').length;
    return '<section class="scene" data-skill="' + sc.skill + '" data-mood="' + mood + '">' +
      '<div class="scene-head">' +
        '<p class="scene-skill">' + ico(SKILL_ICON[sc.skill] || STAR, 'scene-skill-ic') + '<span class="scene-sr">Skill: </span>' + sk.name + '</p>' +
        '<p class="scene-setting">' + sc.setting + '</p>' +
      '</div>' +
      '<div class="speaker">' +
        '<div class="char" aria-hidden="true">' + character(sc.who, mood) + '</div>' +
        '<div class="bubble' + (len <= 32 ? ' bubble-short' : len > 56 ? ' bubble-long' : '') + '">' +
          '<b class="bubble-who">' + sc.who.name + '<span class="scene-sr"> says:</span></b>' +
          '<p class="bubble-says">' + sc.says + '</p>' +
        '</div>' +
      '</div>' +
      '<h2 class="scene-ask">What do you say?</h2>' +
      '<div class="replies" role="radiogroup" aria-label="Your reply">' + replies + '</div>' +
      '</section>';
  }

  /* ---------- after-draw: entry motion once per round, pick/check pops, focus keeping ---------- */
  var seen = null, lastPicked = null, lastChecked = false, focusInReplies = false;
  /* capture phase runs before the engine re-draws, so we can note where focus was */
  function noteFocus() {
    var a = document.activeElement;
    focusInReplies = !!(a && a.closest && a.closest('.replies'));
  }
  document.addEventListener('click', noteFocus, true);
  document.addEventListener('keydown', noteFocus, true);

  function after(S, root, ch) {
    if (S.screen !== 'play') { seen = null; lastPicked = null; lastChecked = false; return; }
    if (!ch || !ch.stage) return;
    var scene = root.querySelector('.scene');
    if (!scene) return;
    var key = S.i + '|' + S.order.join('') + '|' + S.log.length;
    var picked = S.picked != null ? scene.querySelector('.reply[data-k="' + S.picked + '"]') : null;
    if (key !== seen && !S.checked) {
      seen = key;
      if (S.picked == null) {
        scene.classList.add('is-enter');
        var stage = document.getElementById('tio-stage');
        if (stage) stage.scrollTop = 0;
      }
    } else if (picked) {
      seen = key;
      if (S.checked && !lastChecked) {
        picked.classList.add('just-checked');
        var best = scene.querySelector('.reply.is-best');
        if (best) best.classList.add('just-checked');
      } else if (!S.checked && S.picked !== lastPicked) picked.classList.add('just-picked');
    }
    /* the stage was re-built, so a focused card is gone: put focus back where the player was */
    if (picked && !S.checked && focusInReplies && (!document.activeElement || document.activeElement === document.body)) {
      try { picked.focus({ preventScroll: true }); } catch (e) { /* older browsers */ }
    }
    if (picked && S.checked && !lastChecked && picked.scrollIntoView) {
      /* the dock grows when feedback appears; keep the chosen card on screen */
      setTimeout(function () { try { picked.scrollIntoView({ block: 'nearest' }); } catch (e) {} }, 0);
    }
    lastPicked = S.picked; lastChecked = S.checked;
  }

  TIO.sceneView = { render: render, after: after, character: character, moodFor: moodFor };
})();
