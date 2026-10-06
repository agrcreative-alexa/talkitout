/* PIECE C — lesson chrome and flow. Owns: start screen, top bar (quit, progress, banana count, streak), round-to-round transitions. */
window.TIO = window.TIO || {};
TIO.chrome = {
  start: function (S) {
    return '<section class="start">' +
      '<div class="start-mascot" aria-hidden="true">🐵</div>' +
      '<h1 class="start-title">Talk It Out</h1>' +
      '<p class="start-sub">Ten tricky moments. Pick what you would say.</p>' +
      '<ul class="start-skills">' + Object.keys(TIO.SKILLS).map(function (k) {
        return '<li>' + TIO.SKILLS[k].name + '</li>';
      }).join('') + '</ul>' +
      '<button class="btn btn-go" data-act="start">Start</button>' +
      '<p class="start-note">About 3 minutes</p>' +
      '</section>';
  },
  topbar: function (S) {
    var done = S.i + (S.checked ? 1 : 0), pct = Math.round(done / TIO.SCENES.length * 100);
    return '<div class="topbar">' +
      '<button class="topbar-quit" data-act="home" aria-label="Quit to start">✕</button>' +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + TIO.SCENES.length + '" aria-valuenow="' + done + '">' +
        '<div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="topbar-count" aria-label="' + S.bananas + ' bananas">🍌 <b>' + S.bananas + '</b></div>' +
      '</div>';
  }
};
