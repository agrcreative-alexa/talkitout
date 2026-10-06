/* PIECE A — scene screen. Owns: the skill tag, the setting line, the speaker (a drawn character) and their speech bubble,
   the reply cards (idle / picked / checked states). Each card leads with a drawn "how you'd say it" face (reply.vibe)
   on its own colour, so the three choices are three different objects. After Check the cards stay tappable (peek).
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

  var MOODS = { happy: 1, sad: 1, smirk: 1, angry: 1, curious: 1, stern: 1, excited: 1, embarrassed: 1 };
  var EMOJI_MOOD = { '😢': 'sad', '😔': 'sad', '😞': 'sad', '😭': 'sad', '😏': 'smirk', '😠': 'angry', '😡': 'angry', '🤔': 'curious', '😳': 'embarrassed', '😬': 'embarrassed', '😃': 'excited', '😄': 'excited', '🤩': 'excited' };
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
      case 'embarrassed':
        /* cringing: eyes squeezed shut, teeth-gritting wobbly mouth, hot cheeks, one bead of sweat — no tears */
        eyes = stroke('M43 59L53 63.5L43 68', 3.2) + stroke('M77 59L67 63.5L77 68', 3.2);
        brows = stroke('M42 54Q48 49 55 51', 2.6) + stroke('M65 51Q72 49 78 54', 2.6);
        mouth = '<path d="M49 76Q54.500 73 60 75.500Q65.500 73 71 76Q72 82 66 83.500Q60 81.500 54 83.500Q48 82 49 76Z" fill="#fff" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M55.500 75.500V82.500M60 75.500V82M64.500 75.500V82.500" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>';
        extra = '<g stroke="#e5484d" stroke-width="1.7" stroke-linecap="round" opacity=".75"><path d="M35.500 75l2.500-5M39.500 76l2.500-5M43.500 75l2.500-5M75 75l2.500-5M79 76l2.500-5M83 75l2.500-5"/></g>' +
          '<path d="M89 40Q84.500 48 89 50.500Q93.500 48 89 40Z" fill="#5db8ff"/>';
        cheek = '#ff5a6e'; cheekO = 0.62;
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
    var cr = mood === 'embarrassed' ? 8 : 5.5;
    return '<circle cx="40" cy="73" r="' + cr + '" fill="' + cheek + '" opacity="' + cheekO + '"/><circle cx="80" cy="73" r="' + cr + '" fill="' + cheek + '" opacity="' + cheekO + '"/>' +
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
    var tilt = mood === 'curious' ? 'rotate(-5 60 90)' : mood === 'sad' ? 'translate(0 3) rotate(4 60 90)' : mood === 'smirk' ? 'rotate(5 60 90)' : mood === 'excited' ? 'translate(0 -2)' : mood === 'embarrassed' ? 'translate(0 4) rotate(-4 60 90)' : '';
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

  /* ---------- "you" faces: one per vibe (how the reply is said). Head colour comes from the card (CSS --face). ---------- */
  function vl(d, w) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function ve(x, y, r, dx, dy) {
    r = r || 3.5;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (x + 1.2 + (dx || 0)) + '" cy="' + (y - 1.3 + (dy || 0)) + '" r="' + (r * 0.36).toFixed(1) + '" fill="#fff"/>';
  }
  function vbig(x, y, dx, dy) {
    return '<circle cx="' + x + '" cy="' + y + '" r="5.6" fill="#fff"/><circle cx="' + (x + (dx || 0)) + '" cy="' + (y + (dy || 0)) + '" r="2.9" fill="' + INK + '"/>';
  }
  var BLUSH = '<circle cx="13.5" cy="34" r="3.6" fill="#ff5c7a" opacity=".4"/><circle cx="42.500" cy="34" r="3.6" fill="#ff5c7a" opacity=".4"/>';
  var VIBE = {
    neutral: function () { return ve(19, 26) + ve(37, 26) + vl('M21 36Q28 41 35 36'); },
    kind: function () {
      return BLUSH + vl('M14 27Q19 21 24 27') + vl('M32 27Q37 21 42 27') + vl('M19 35Q28 44 37 35') +
        '<path class="vf-out" d="M51 12.500c-2.600-3.600-7.500-.6-5.300 3.200 1.100 1.900 3.300 3.300 5.300 4.800 2-1.500 4.200-2.900 5.300-4.800 2.200-3.800-2.700-6.800-5.300-3.200z" fill="#ff5c8a"/>';
    },
    blunt: function () {
      return ve(19, 27, 3.2) + ve(37, 27, 3.2) + vl('M13 21H25', 3.4) + vl('M31 21H43', 3.4) + vl('M20 38.500H36', 3.4);
    },
    gush: function () {
      return BLUSH + ve(18, 24, 5, .4) + ve(38, 24, 5, .4) +
        '<path d="M17 33H39Q39 46 28 46Q17 46 17 33Z" fill="#7a2338"/><path d="M19.500 33H36.500V36Q28 37.500 19.500 36Z" fill="#fff"/><ellipse cx="28" cy="43" rx="5" ry="2.4" fill="#ff8b94"/>' +
        '<path class="vf-out" d="M52 4l1.700 4.300 4.300 1.700-4.300 1.700-1.700 4.300-1.700-4.300-4.300-1.700 4.300-1.700zM2.500 40l1.100 2.900 2.900 1.100-2.900 1.100-1.100 2.900-1.100-2.900-2.900-1.100 2.900-1.100z" fill="' + INK + '"/>';
    },
    mumble: function () {
      return ve(21, 29, 3, .6, 1.6) + ve(39, 29, 3, .6, 1.6) + vl('M14 23L23 21', 2.6) + vl('M33 21L42 23', 2.6) +
        vl('M21 39q2.300-3 4.600 0t4.600 0t4.600 0', 2.6) +
        '<g class="vf-out" fill="' + INK + '"><circle cx="46.500" cy="7" r="2.1"/><circle cx="52.500" cy="7" r="2.1"/><circle cx="58.500" cy="7" r="2.1"/></g>';
    },
    joke: function () {
      return vl('M14 22.500L23 26L14 29.500', 3.2) + ve(38, 26, 3.8) + vl('M33 19Q38 15.500 43 18.500', 2.6) +
        '<path d="M17 33Q28 37 39 33Q38 45 28 45Q18 45 17 33Z" fill="#7a2338"/><path d="M27 39H37V44.500A5 5 0 0 1 27 44.500Z" fill="#ff8b94" stroke="' + INK + '" stroke-width="1.6"/>';
    },
    snap: function () {
      return ve(19, 28, 3.2) + ve(37, 28, 3.2) + vl('M12 18.500L24 23.500', 3.8) + vl('M44 18.500L32 23.500', 3.8) +
        '<path d="M18 35H38L35.500 44H20.500Z" fill="#7a2338" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M20 35.500l2.700 3.200 2.700-3.200 2.600 3.200 2.600-3.200 2.700 3.200 2.700-3.200" fill="#fff"/>' +
        '<path class="vf-out" d="M48 13l4.500-7M53 17l7-4M54 23l6 1" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    },
    calm: function () {
      return vl('M14 25Q19 30 24 25') + vl('M32 25Q37 30 42 25') + vl('M22.500 36.500Q28 41 33.500 36.500') +
        '<path class="vf-out" d="M47 38q5-3.500 8.500 0t-1 4.500M48 46q4-2 7 0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".75"/>';
    },
    rush: function () {
      return vbig(19, 26) + vbig(37, 26) + vl('M13 17Q19 13.500 24 16.500', 2.6) + vl('M32 16.500Q37 13.500 43 17', 2.6) +
        '<ellipse cx="28" cy="39.500" rx="4.600" ry="5.200" fill="#7a2338"/>' +
        '<path class="vf-out" d="M51 5Q46.500 13 51 15.500Q55.500 13 51 5Z" fill="#5db8ff"/>' +
        '<path class="vf-out" d="M-3 20h6M-5 29h8M-3 38h6" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
    },
    shrug: function () {
      return ve(21, 27, 3.3, 1.200) + ve(39, 27, 3.3, 1.200) + vl('M13 22.500H25', 2.8) + vl('M33 18.500Q39 15.500 44 19', 2.8) + vl('M21 39Q29 36 36 40', 3) +
        '<g class="vf-out"><circle class="vf-hand" cx="-1" cy="44" r="5.500"/><circle class="vf-hand" cx="57" cy="44" r="5.500"/></g>';
    },
    curious: function () {
      return vbig(19, 27, 1.5, -1.5) + vbig(37, 27, 1.5, -1.5) + vl('M13 20Q19 18 24 20', 2.6) + vl('M32 16.500Q38 12.500 44 16', 2.6) +
        '<ellipse cx="29" cy="40" rx="3.600" ry="3.900" fill="#7a2338"/>' +
        '<path class="vf-out" d="M48 8.500a4.300 4.300 0 1 1 6.300 3.800c-1.400.8-2 1.500-2 3" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/><circle class="vf-out" cx="52.300" cy="20.500" r="2" fill="' + INK + '"/>';
    }
  };
  function vibeFace(vibe) {
    var v = VIBE[vibe] ? vibe : 'neutral';
    return '<svg class="vf vf-' + v + '" viewBox="-7 0 70 54" aria-hidden="true" focusable="false">' +
      '<rect class="vf-edge" x="4" y="7" width="48" height="46" rx="19"/><rect class="vf-head" x="4" y="3" width="48" height="46" rx="19"/>' +
      '<ellipse cx="17" cy="12.500" rx="7" ry="3.600" fill="#fff" opacity=".4" transform="rotate(-24 17 12.500)"/>' +
      '<g class="vf-face">' + VIBE[v]() + '</g></svg>';
  }
  var ACT_IC = '<svg class="reply-act-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.500 2.500L5 13.500h5.500L9.500 21.500 19 10h-5.800z"/></svg>';

  /* ---------- render ---------- */
  function render(S) {
    var sc = TIO.cur(), sk = TIO.SKILLS[sc.skill] || { name: '' }, mood = moodFor(sc);
    var anyAct = sc.replies.some(function (r) { return r.act; });
    var replies = S.order.map(function (ri, k) {
      var r = sc.replies[ri], cls = 'reply reply-p' + (k % 3), mark = '', flag = '';
      var mine = S.picked === k, shown = S.checked && (S.peek == null ? mine : S.peek === k);
      if (mine) cls += ' is-picked';
      if (S.checked) {
        /* own pick wears its rating; a missed best reply stays lit; anything else is neutral until it is peeked */
        var st = mine ? r.rating : r.rating === 'great' ? 'best' : (S.peek === k ? r.rating : '');
        if (mine) cls += ' is-' + r.rating;
        else if (st === 'best') cls += ' is-best';
        else if (st) cls += ' is-peeked-' + st;
        else cls += ' is-dim';
        if (shown) cls += ' is-shown';
        mark = st
          ? '<span class="reply-mark" role="img" aria-label="' + MARK_LABEL[st] + '">' + ico(MARK[st], 'reply-mark-ic') + '</span>'
          : '<span class="reply-mark reply-why" aria-hidden="true">?</span>';
        if (mine) flag = '<b class="reply-flag">Your pick</b>';
        else if (st === 'best') flag = '<b class="reply-flag">' + ico(STAR, 'reply-flag-ic') + 'Best reply</b>';
      }
      var body = (r.act ? '<span class="reply-act">' + ACT_IC + '<span>' + r.act + '</span></span>' : '') +
        '<span class="reply-text">' + r.text + '</span>';
      var attrs = S.checked
        ? ' data-act="peek" data-k="' + k + '" aria-pressed="' + shown + '"'
        : ' data-act="pick" data-k="' + k + '" role="radio" aria-checked="' + mine + '"';
      return '<button type="button" class="' + cls + '" style="--n:' + k + '"' + attrs + '>' +
        '<span class="reply-face">' + vibeFace(r.vibe) + '</span>' +
        '<span class="reply-body">' + body + (S.checked && !shown ? '<span class="scene-sr"> (tap to see why)</span>' : '') + '</span>' + mark + flag +
        '<span class="reply-key" aria-hidden="true">' + (k + 1) + '</span>' +
        '</button>';
    }).join('');
    var len = String(sc.says || '').length;
    return '<section class="scene' + (S.checked ? ' is-checked' : '') + (anyAct ? ' has-acts' : '') + '" data-skill="' + sc.skill + '" data-mood="' + mood + '">' +
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
      '<h2 class="scene-ask">' + (S.checked ? '<span class="scene-sr">Your replies. Tap one to see why.</span>' : 'What do you say?') + '</h2>' +
      (S.checked
        ? '<div class="replies" role="group" aria-label="The replies. Tap one to see why.">'
        : '<div class="replies" role="radiogroup" aria-label="Your reply">') + replies + '</div>' +
      '</section>';
  }

  /* ---------- after-draw: entry motion once per round, pick/check pops, focus keeping ---------- */
  var seen = null, lastPicked = null, lastChecked = false, lastPeek = null, focusK = null;
  /* capture phase runs before the engine re-draws, so we can note which card had focus */
  function noteFocus() {
    var a = document.activeElement, card = a && a.closest ? a.closest('.replies .reply') : null;
    focusK = card ? card.getAttribute('data-k') : null;
  }
  document.addEventListener('click', noteFocus, true);
  document.addEventListener('keydown', noteFocus, true);

  function after(S, root, ch) {
    if (S.screen !== 'play') { seen = null; lastPicked = null; lastChecked = false; lastPeek = null; return; }
    if (!ch || !ch.stage) return;
    var scene = root.querySelector('.scene');
    if (!scene) return;
    var stage = document.getElementById('tio-stage');
    var key = S.i + '|' + S.order.join('') + '|' + (S.checked ? S.log.length - 1 : S.log.length);
    var picked = S.picked != null ? scene.querySelector('.reply[data-k="' + S.picked + '"]') : null;
    if (key !== seen) {
      seen = key;
      if (stage) stage.scrollTop = 0;
      if (S.picked == null && !S.checked) scene.classList.add('is-enter');
    } else if (S.checked && !lastChecked) {
      /* the top of the scene has just been compacted so all three cards fit above the feedback sheet: start from the top */
      if (stage) stage.scrollTop = 0;
      if (picked) picked.classList.add('just-checked');
      var best = scene.querySelector('.reply.is-best');
      if (best) best.classList.add('just-checked');
    } else if (S.checked && S.peek !== lastPeek) {
      var pk = scene.querySelector('.reply[data-k="' + (S.peek == null ? S.picked : S.peek) + '"]');
      if (pk) pk.classList.add('just-picked');
    } else if (picked && !S.checked && S.picked !== lastPicked) picked.classList.add('just-picked');
    /* the stage was re-built, so a focused card is gone: put focus back on the same card */
    if (focusK != null && !(S.checked && !lastChecked) && (!document.activeElement || document.activeElement === document.body)) {
      var again = scene.querySelector('.reply[data-k="' + focusK + '"]');
      if (again) { try { again.focus({ preventScroll: true }); } catch (e) { /* older browsers */ } }
    }
    lastPicked = S.picked; lastChecked = S.checked; lastPeek = S.peek;
  }

  TIO.sceneView = { render: render, after: after, character: character, moodFor: moodFor, vibeFace: vibeFace };
})();
