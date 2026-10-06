/* PIECE D — results screen. Owns: the final score, the cheeky title, the per-skill breakdown, play again. */
window.TIO = window.TIO || {};
TIO.results = {
  render: function (S) {
    var t = TIO.titleFor(S.bananas);
    var rows = Object.keys(TIO.SKILLS).map(function (k) {
      var mine = S.log.filter(function (l) { return l.skill === k; });
      var got = mine.reduce(function (n, l) { return n + TIO.PTS[l.rating]; }, 0), max = mine.length * 2;
      return '<li class="skillrow"><span class="skillrow-name">' + TIO.SKILLS[k].name + '</span>' +
        '<span class="skillrow-score">' + got + ' / ' + max + ' 🍌</span>' +
        '<span class="skillrow-tip">' + TIO.SKILLS[k].tip + '</span></li>';
    }).join('');
    return '<section class="results">' +
      '<p class="results-kicker">You are…</p>' +
      '<h1 class="results-title">' + t.title + '</h1>' +
      '<p class="results-blurb">' + t.blurb + '</p>' +
      '<p class="results-score"><b>' + S.bananas + '</b> of ' + TIO.MAX + ' bananas</p>' +
      '<ul class="skillrows">' + rows + '</ul>' +
      '<button class="btn" data-act="replay">Play again</button>' +
      '</section>';
  }
};
