/* PIECE A — scene screen. Owns: the setting line, the speaker and their speech bubble, the reply cards (idle / picked / checked states). */
window.TIO = window.TIO || {};
TIO.sceneView = {
  render: function (S) {
    var sc = TIO.cur(), sk = TIO.SKILLS[sc.skill];
    var replies = S.order.map(function (ri, k) {
      var r = sc.replies[ri], cls = 'reply';
      if (S.picked === k) cls += ' is-picked';
      if (S.checked) cls += (S.picked === k ? ' is-' + r.rating : r.rating === 'great' ? ' is-best' : ' is-dim');
      return '<button class="' + cls + '" data-act="pick" data-k="' + k + '" role="radio" aria-checked="' + (S.picked === k) + '"' + (S.checked ? ' disabled' : '') + '>' +
        '<span class="reply-key" aria-hidden="true">' + (k + 1) + '</span>' +
        '<span class="reply-body">' + (r.act ? '<i class="reply-act">' + r.act + '</i>' : '') + '<span class="reply-text">' + r.text + '</span></span>' +
        '</button>';
    }).join('');
    return '<section class="scene">' +
      '<p class="scene-skill">Skill: ' + sk.name + '</p>' +
      '<p class="scene-setting">' + sc.setting + '</p>' +
      '<div class="speaker">' +
        '<div class="speaker-face" style="background:' + sc.who.color + '" aria-hidden="true">' + sc.who.face + '</div>' +
        '<div class="bubble"><b class="bubble-who">' + sc.who.name + '</b><p class="bubble-says">' + sc.says + '</p></div>' +
      '</div>' +
      '<h2 class="scene-ask">What do you say?</h2>' +
      '<div class="replies" role="radiogroup" aria-label="Your reply">' + replies + '</div>' +
      '</section>';
  }
};
