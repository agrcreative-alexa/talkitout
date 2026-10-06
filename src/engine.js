/* SHARED — state machine and render loop. Pieces should not edit this file.
   Contract:
     TIO.state          { screen:'start'|'play'|'results', i, order[], picked, checked, peek, bananas, streak, best, log[] }
                        peek = display position of a reply the player tapped AFTER checking to see its reason (null = their own pick)
     TIO.cur()          current scene;  TIO.reply(k) reply at display position k
     TIO.actions        start, pick(k), check, peek(k) (only after check), next, replay, home  (wired to [data-act] clicks, data-k as arg)
     Regions            #tio-top, #tio-stage, #tio-dock — each re-rendered only when its HTML string changes
     Module hooks       TIO.chrome / TIO.sceneView / TIO.feedback / TIO.results may define after(state, root, changed)
                        which runs after every draw; `changed` = { top, stage, dock } booleans.
   Debug URL params:    ?r=4 jump to round 4 · &pick=great|ok|oops select that reply · &check=1 show feedback
                        ?end=17 show the results screen with 17 bananas */
(function () {
  var T = window.TIO, PTS = { great: 2, ok: 1, oops: 0 };
  var S = T.state = { screen: 'start', i: 0, order: [], picked: null, checked: false, peek: null, bananas: 0, streak: 0, best: 0, log: [] };
  T.PTS = PTS;
  T.MAX = T.SCENES.length * 2;
  T.cur = function () { return T.SCENES[S.i]; };
  T.reply = function (k) { return T.cur().replies[S.order[k]]; };
  T.titleFor = function (b) {
    return T.TITLES.slice().sort(function (a, c) { return c.min - a.min; }).filter(function (t) { return b >= t.min; })[0];
  };

  function newRound() {
    var n = T.cur().replies.length, o = [];
    for (var a = 0; a < n; a++) o.push(a);
    for (var j = n - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)), t = o[j]; o[j] = o[r]; o[r] = t; }
    S.order = o; S.picked = null; S.checked = false; S.peek = null;
  }

  T.actions = {
    start: function () {
      S.screen = 'play'; S.i = 0; S.bananas = 0; S.streak = 0; S.best = 0; S.log = [];
      newRound(); draw();
    },
    pick: function (k) { if (S.screen !== 'play' || S.checked) return; S.picked = +k; draw(); },
    check: function () {
      if (S.screen !== 'play' || S.picked == null || S.checked) return;
      var r = T.reply(S.picked);
      S.checked = true; S.bananas += PTS[r.rating];
      S.streak = r.rating === 'great' ? S.streak + 1 : 0; S.best = Math.max(S.best, S.streak);
      S.log.push({ id: T.cur().id, skill: T.cur().skill, rating: r.rating });
      draw();
    },
    peek: function (k) { if (S.screen !== 'play' || !S.checked) return; S.peek = +k === S.picked ? null : +k; draw(); },
    next: function () {
      if (S.screen !== 'play' || !S.checked) return;
      if (S.i >= T.SCENES.length - 1) S.screen = 'results'; else { S.i++; newRound(); }
      draw();
    },
    replay: function () { T.actions.start(); },
    home: function () { S.screen = 'start'; draw(); }
  };

  var last = {};
  function put(id, html) {
    if (last[id] === html) return false;
    document.getElementById(id).innerHTML = html; last[id] = html; return true;
  }
  function draw() {
    var root = document.getElementById('tio'), ch = {};
    root.setAttribute('data-screen', S.screen);
    root.setAttribute('data-state', S.screen !== 'play' ? '' : S.checked ? 'checked' : S.picked != null ? 'picked' : 'idle');
    if (S.screen === 'start') {
      ch.top = put('tio-top', ''); ch.stage = put('tio-stage', T.chrome.start(S)); ch.dock = put('tio-dock', '');
    } else if (S.screen === 'play') {
      ch.top = put('tio-top', T.chrome.topbar(S)); ch.stage = put('tio-stage', T.sceneView.render(S)); ch.dock = put('tio-dock', T.feedback.render(S));
    } else {
      ch.top = put('tio-top', ''); ch.stage = put('tio-stage', T.results.render(S)); ch.dock = put('tio-dock', '');
    }
    [T.chrome, T.sceneView, T.feedback, T.results].forEach(function (m) { if (m && m.after) m.after(S, root, ch); });
  }
  T.draw = draw;

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    var fn = T.actions[el.getAttribute('data-act')];
    if (fn) fn(el.getAttribute('data-k'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (S.screen === 'start') T.actions.start();
      else if (S.screen === 'results') T.actions.replay();
      else if (S.checked) T.actions.next(); else T.actions.check();
    } else if (S.screen === 'play' && /^[1-9]$/.test(e.key) && +e.key <= S.order.length) T.actions[S.checked ? 'peek' : 'pick'](+e.key - 1);
  });

  var q = new URLSearchParams(location.search);
  if (q.has('end')) {
    S.screen = 'results'; S.bananas = Math.max(0, Math.min(T.MAX, +q.get('end') || 0));
    var left = S.bananas;
    S.log = T.SCENES.map(function (sc) {
      var r = left >= 2 ? 'great' : left === 1 ? 'ok' : 'oops'; left -= PTS[r];
      return { id: sc.id, skill: sc.skill, rating: r };
    });
    S.best = S.log.filter(function (l) { return l.rating === 'great'; }).length;
    draw();
  } else if (q.has('r')) {
    T.actions.start();
    S.i = Math.max(0, Math.min(T.SCENES.length - 1, (+q.get('r') || 1) - 1)); newRound();
    if (q.has('pick')) {
      var want = q.get('pick');
      S.order.forEach(function (ri, k) { if (T.cur().replies[ri].rating === want) S.picked = k; });
    }
    draw();
    if (q.has('check')) T.actions.check();
  } else draw();
})();
