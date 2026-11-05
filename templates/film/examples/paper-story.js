// The Two Applicants: when each point lands on the scoreboard (voice seconds). Maya scores every round;
// Sam starts scoring at round 7, when he stops copy-pasting and starts using AI as a coach.
P.SCORE = [
  [55.0, 'maya'], [92.6, 'maya'], [128.6, 'maya'], [165.2, 'maya'], [194.5, 'maya'], [230.3, 'maya'],
  [268.7, 'sam'], [269.2, 'maya'], [303.0, 'sam'], [303.4, 'maya'], [335.4, 'sam'], [335.8, 'maya'],
  [364.4, 'sam'], [364.8, 'maya'], [394.6, 'sam'], [395.0, 'maya'],
];

// film props (paper pieces this story reuses)
(() => {
  const F = FILM, { G, tr, rect, circ, ell, path, line, text, E, seg, clamp, f } = F, K = P.K;
  const J = (window.J = {});
  // a job post: n bullets; o.grey = set of bullet indexes greyed out; o.hl = {index: colour}; o.title
  J.post = (x, y, w, o = {}) => {
    const n = o.n ?? 12, h = o.h ?? w * 1.3, R = F.R(o.seed || 21), lh = (h - w * 0.36) / n;
    let s = rect(0, 0, w, h, K.white) + rect(0, 0, w, w * 0.22, K.navy) + text(w * 0.07, w * 0.14, o.title || 'JOB POST', { 'font-size': w * 0.08, 'font-weight': 900, fill: K.cream });
    for (let k = 0; k < Math.min(n, o.show ?? n); k++) { const yy = w * 0.3 + k * lh, col = (o.hl && o.hl[k]) || null, gr = o.grey && o.grey.includes(k); if (col) s += rect(w * 0.05, yy - lh * 0.05, w * 0.9, lh * 0.8, col, { rx: 4 }); s += circ(w * 0.1, yy + lh * 0.32, lh * 0.12, gr ? K.grey : K.ink) + rect(w * 0.16, yy + lh * 0.22, w * (0.45 + R() * 0.32), lh * 0.22, gr ? '#E4DED2' : K.greyD, { rx: 3 }); }
    return G(tr(x, y, 1, o.r || 0), P.cut(s, o.k || 'cut'));
  };
  J.glass = (x, y, s = 1, r = -20) => G(tr(x, y, s, r), P.cut(circ(0, 0, 70, 'none', { stroke: K.navy, 'stroke-width': 18 }) + rect(-12, 76, 24, 120, K.wood, { rx: 8 }), 'cutS') + circ(0, 0, 60, '#CFE8EA', { opacity: 0.45 }));
  J.button = (x, y, str, col, s = 1, down = 0) => G(tr(x, y, s), P.cut(rect(-150, -40, 300, 92, '#00000033', { rx: 30 }) + rect(-150, -50 + 10 * down, 300, 84, col, { rx: 30 }), 'cutS') + text(0, 6 + 10 * down, str, { 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 900, fill: K.cream }));
  J.puff = (x, y, u) => (u > 0 && u < 1 ? G({ transform: tr(x + 60 * u, y - 30 * u, 0.5 + u), opacity: f(1 - u) }, P.cut(path('M-40,10 Q-50,-20 -20,-24 Q-6,-48 20,-30 Q50,-34 44,0 Q40,20 0,18 Z', '#FFFFFF'), 'cutS')) : '');
  J.chest = (x, y, s = 1, open = 0) => G(tr(x, y, s), P.cut(rect(-80, -60, 160, 100, K.woodD, { rx: 8 }) + rect(-80, -60, 160, 16, K.mustard) + path(`M-80,-60 Q0,${f(-120 - 40 * open)} 80,-60 Z`, K.wood) + rect(-14, -40, 28, 30, K.mustard, { rx: 4 }), 'cut'));
  J.clock = (x, y, s, T) => G(tr(x, y, s), P.cut(circ(0, 0, 60, K.cream) + circ(0, 0, 60, 'none', { stroke: K.navy, 'stroke-width': 10 }), 'cutS') + line(`M0,0 L${f(Math.sin(T * 3) * 40)},${f(-Math.cos(T * 3) * 40)}`, K.ink, 6) + line(`M0,0 L${f(Math.sin(T * 0.3) * 26)},${f(-Math.cos(T * 0.3) * 26)}`, K.ink, 8));
  J.card = (x, y, w, h, title, inner, o = {}) => G(tr(x, y, o.s ?? 1, o.r ?? 0), P.cut(rect(0, 0, w, h, o.bg || K.white, { rx: 12 }) + rect(0, 0, w, 70, o.col || K.teal, { rx: 12 }) + rect(0, 50, w, 20, o.col || K.teal), o.k || 'cut') + text(26, 48, title, { 'font-size': 36, 'font-weight': 900, fill: o.tf || K.cream }) + (inner || ''));
  J.check = (x, y, s, col = K.teal, u = 1) => u > 0 ? G(tr(x, y, s * E.outBack(clamp(u))), circ(0, 0, 26, col) + line('M-12,0 L-3,10 L13,-9', K.cream, 7)) : '';
  J.cross = (x, y, s, col = K.red, u = 1) => u > 0 ? G(tr(x, y, s * E.outBack(clamp(u))), circ(0, 0, 26, col) + line('M-10,-10 L10,10 M10,-10 L-10,10', K.cream, 7)) : '';
})();
