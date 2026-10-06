/* PIECE B — feedback moment. Owns: the docked footer — Check button before answering; after Check, the rating banner,
   the "why" explanation, the better reply when you missed it, the skill tip, and Continue. */
window.TIO = window.TIO || {};
TIO.feedback = {
  HEAD: { great: 'Nailed it!', ok: 'Nearly!', oops: 'Not this time' },
  render: function (S) {
    if (!S.checked) {
      return '<div class="dock"><div class="dock-row dock-row-end">' +
        '<button class="btn" data-act="check"' + (S.picked == null ? ' disabled' : '') + '>Check</button></div></div>';
    }
    var sc = TIO.cur(), r = TIO.reply(S.picked), sk = TIO.SKILLS[sc.skill];
    var best = sc.replies.filter(function (x) { return x.rating === 'great'; })[0];
    var last = S.i >= TIO.SCENES.length - 1;
    return '<div class="dock dock-' + r.rating + '" role="status" aria-live="polite"><div class="dock-row">' +
      '<div class="verdict">' +
        '<h3 class="verdict-head">' + this.HEAD[r.rating] + ' <span class="verdict-pts">+' + TIO.PTS[r.rating] + ' 🍌</span></h3>' +
        '<p class="verdict-why">' + r.why + '</p>' +
        (r.rating !== 'great' ? '<p class="verdict-best"><b>Try:</b> “' + best.text + '” ' + best.why + '</p>' : '') +
        '<p class="verdict-tip"><b>' + sk.name + ':</b> ' + sk.tip + '</p>' +
      '</div>' +
      '<button class="btn btn-next" data-act="next">' + (last ? 'See my title' : 'Continue') + '</button>' +
      '</div></div>';
  }
};
