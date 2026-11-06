// paper.js: the paper cut-out look. Every piece is cut from coloured card: slightly rough edges, a soft shadow under it,
// paper grain over the frame. Motion is smooth; set P.STOP = 12 only if you really want stepped stop-motion poses.
(function () {
  const F = window.FILM, H = window.HERO, { G, tr, rect, circ, ell, path, line, text, E, seg, clamp, f } = F;
  const K = {
    board: '#E9DDC5', kraft: '#D3B38A', kraftD: '#B8956A', cream: '#FBF4E4', white: '#FFFDF7',
    ink: '#2B2433', inkS: '#5B5266', mustard: '#EFAE3E', mustardD: '#CF8E22', teal: '#2E8C87', tealD: '#21706C',
    coral: '#E9654F', coralD: '#C94D39', navy: '#2D3A63', navyD: '#222C4E', sage: '#9DBE9A', sageD: '#7DA07A',
    sky: '#BFDCDD', skyD: '#9CC4C6', pink: '#F3AFA4', lilac: '#B8A6D9', red: '#D7393A', grey: '#C9C2B6', greyD: '#A79F93',
    dusk: '#4C5A80', duskD: '#3A466A', sun: '#F6CB6B', wood: '#C98B52', woodD: '#A86E3B',
  };
  H.PAL.sam = { skin: '#C98D63', skinD: '#AD7349', hair: '#2A1E1A', top: K.mustard, topD: K.mustardD, pants: '#3B4775', pantsD: '#2E3860', shoe: '#FBF4E4', shoeD: '#D8CDB8', style: 'short', hood: true };
  H.PAL.maya = { skin: '#8E5B3E', skinD: '#76482E', hair: '#1E1414', top: K.teal, topD: K.tealD, pants: '#3A3358', pantsD: '#2D2846', shoe: '#FBF4E4', shoeD: '#D8CDB8', style: 'bun' };
  H.PAL.paperfolk = { skin: '#D9C7AC', skinD: '#C4B193', hair: '#A99476', top: '#C9B795', topD: '#B3A07D', pants: '#A99476', pantsD: '#968263', shoe: '#A99476', shoeD: '#968263', style: 'short', faceless: true };

  // ---------- filters: the cut edge + shadow, three heights ----------
  const cutF = (id, sd, dy, op, sc = 5, fr = 0.05) => `<filter id="${id}" x="-12%" y="-12%" width="124%" height="132%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${fr}" numOctaves="1" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="${sd}" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.11  0 0 0 0 0.06  0 0 0 ${op} 0" result="s"/>
    <feOffset in="s" dx="${dy * 0.45}" dy="${dy}" result="so"/>
    <feMerge><feMergeNode in="so"/><feMergeNode in="d"/></feMerge></filter>`;
  const DEFS = `<defs>${cutF('cut', 5, 7, 0.38)}${cutF('cutS', 3, 4, 0.34, 4, 0.08)}${cutF('lift', 12, 20, 0.32)}${cutF('flat', 6, 6, 0.3, 7, 0.02)}
    <radialGradient id="pvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#3A2A18" stop-opacity="0"/><stop offset="1" stop-color="#3A2A18" stop-opacity="0.32"/></radialGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE7A8" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient></defs>`;
  const cut = (inner, k = 'cut') => `<g filter="url(#${k})">${inner}</g>`;

  // ---------- stop-motion time: poses step at 12 per second; a hand-placed nudge per step ----------
  // smooth by default. P.STOP = 12 steps motion like stop-motion (it reads as a tremble on screen, so it is off)
  const st = (T, fps) => { const k = fps || (window.P && window.P.STOP) || 0; return k ? Math.floor(T * k + 1e-6) / k : T; };
  const jit = (T, seed = 1, amt = 1.6) => { const R = F.R(Math.floor(T * 12) * 97 + seed * 13); return [(R() - 0.5) * 2 * amt, (R() - 0.5) * 2 * amt, (R() - 0.5) * amt * 0.8]; };
  const nudge = (T, seed, inner, amt) => { const [dx, dy, r] = jit(T, seed, amt); return G(`translate(${f(dx)},${f(dy)}) rotate(${f(r)})`, inner); };
  // pop in steps (stop-motion scale: 0 -> 1.12 -> 1 in a few frames)
  const pop = (T, a, d = 0.34) => { const u = seg(st(T), a, a + d); return u <= 0 ? 0 : u >= 1 ? 1 : E.outBack(u); };

  // ---------- people ----------
  const ch = (pose, T) => cut(H.svg(Object.assign({ pal: 'sam' }, pose), st(T)));

  // ---------- backgrounds: a board, torn layers at depth, a floor ----------
  // a torn edge along y from x0 to x1; the jag at each 60 px step is fixed by its position, so a culled range never shifts it
  const torn = (x0, x1, y, amp, seed, down = 1200) => { const a = Math.floor(x0 / 60), b = Math.ceil(x1 / 60); let d = `M${a * 60},${down} L${a * 60},${y}`; for (let k = a; k <= b; k++) d += ` L${k * 60},${f(y + (F.R(seed * 7919 + k * 31)() - 0.5) * amp)}`; return d + ` L${b * 60},${down} Z`; };
  // the slice of the world a layer at depth d can see (plus a margin)
  const view = (c, d, m = 160) => { const z = 1 + (c.z - 1) * d, x = 960 + (c.x - 960) * d, y = 540 + (c.y - 540) * d; return [x - 960 / z - m, x + 960 / z + m, y + 540 / z + m]; };
  const MOODS = {
    board: { wall: '#3E3A4A', far: '#3E3A4A', floor: '#3E3A4A', floorD: '#3E3A4A' },
    room: { wall: '#EADFC8', far: '#DCCDB0', floor: K.wood, floorD: K.woodD },
    kraft: { wall: K.kraft, far: '#C8A77C', floor: '#B8956A', floorD: '#9F7C52' },
    sky: { wall: K.sky, far: '#A9CFD0', floor: K.sage, floorD: K.sageD },
    dusk: { wall: '#56638A', far: '#47537A', floor: '#3A466A', floorD: '#2F3958' },
    sun: { wall: '#F7D88F', far: '#F2C56A', floor: K.coral, floorD: K.coralD },
    mustard: { wall: '#F3D9A0', far: '#E9C47C', floor: K.mustard, floorD: K.mustardD },
    teal: { wall: '#BFE0DA', far: '#9FD0C8', floor: K.teal, floorD: K.tealD },
  };
  function bg(T, c, mood = 'room', o = {}) {
    const m = MOODS[mood] || MOODS.room, L = F.L;
    let s = L(c, 0.2, rect(-2000, -1500, 6000, 4500, m.wall));
    if (!o.noHills) { const [x0, x1, yb] = view(c, 0.45); s += L(c, 0.45, cut(path(torn(x0, x1, o.hy ?? 700, 50, o.seed || 3, Math.max(yb, (o.hy ?? 700) + 200)), m.far), 'flat')); }
    if (o.floor !== false) { const [x0, x1, yb] = view(c, 1), fy = o.fy ?? 880; s += L(c, 1, cut(path(torn(x0, x1, fy, 14, (o.seed || 3) + 5, Math.max(yb, fy + 200)), m.floor), 'flat') + rect(x0, fy + 40, x1 - x0, 6, m.floorD, { opacity: 0.35 })); }
    return s;
  }
  const GRAIN = `<image href="assets/tex/grain-a.png" x="0" y="0" width="1920" height="1080"/>`;
  const VIG = rect(0, 0, 1920, 1080, 'url(#pvig)');
  // grain, vignette and filters live outside the per-frame redraw (a fresh <image> every frame means a fresh PNG decode)
  const mount = () => { const st = document.getElementById('stage'); if (!st || st.querySelector('#paperStatic')) return; st.insertAdjacentHTML('afterbegin', `<g id="paperStaticDefs">${DEFS}</g>`); st.insertAdjacentHTML('beforeend', `<g id="paperStatic" pointer-events="none">${GRAIN}${VIG}</g>`); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  const finish = () => '';

  // ---------- paper pieces ----------
  const strip = (x, y, str, o = {}) => {   // a torn strip of paper with a word on it
    const size = o.size || 64, w = F.measure(str, size, 900) + size * 0.9, h = size * 1.42, R = F.R(o.seed || 7);
    let d = `M${-w / 2},${-h / 2}`; for (let k = 1; k <= 8; k++) d += ` L${f(-w / 2 + (w * k) / 8)},${f(-h / 2 + (R() - 0.5) * 6)}`;
    d += ` L${f(w / 2 + (R() - 0.5) * 10)},${f(h / 2)}`; for (let k = 7; k >= 0; k--) d += ` L${f(-w / 2 + (w * k) / 8)},${f(h / 2 + (R() - 0.5) * 6)}`; d += ' Z';
    return G(tr(x, y, o.s ?? 1, o.r ?? -2), cut(path(d, o.bg || K.cream), o.lift ? 'lift' : 'cut') + text(0, size * 0.35, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: o.fg || K.ink, 'letter-spacing': o.ls ?? 1 }));
  };
  const label = (T, a, x, y, str, o = {}) => { const u = pop(T, a); return u > 0 ? strip(x, y, str, Object.assign({}, o, { s: (o.s ?? 1) * u })) : ''; };
  const pencil = (x, y, str, o = {}) => text(x, y, str, { 'font-family': 'Caveat, cursive', 'font-weight': 700, 'font-size': o.size || 56, fill: o.col || K.red, 'text-anchor': o.anchor || 'middle', transform: o.r ? `rotate(${o.r},${x},${y})` : undefined });
  // a hand-drawn pencil loop around a point, drawn on over d seconds
  function loop(T, a, cx, cy, rx, ry, o = {}) {
    const u = seg(T, a, a + (o.d || 0.45)); if (u <= 0) return '';
    let d = ''; const n = 40, turns = 1.15;
    for (let k = 0; k <= n; k++) { const t = (k / n) * turns * Math.PI * 2 - 2.2, rr = 1 + 0.06 * Math.sin(k * 0.7) + (k / n) * 0.08; d += (k ? ' L' : 'M') + f(cx + Math.cos(t) * rx * rr) + ',' + f(cy + Math.sin(t) * ry * rr); }
    return path(d, 'none', { stroke: o.col || K.red, 'stroke-width': o.w || 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '4000', 'stroke-dashoffset': f(4000 - 4000 * E.inOutSine(u) * 0.55), opacity: 0.92 });
  }
  const sticky = (x, y, w, str, o = {}) => G(tr(x, y, o.s ?? 1, o.r ?? 3), cut(rect(-w / 2, -w / 2, w, w, o.bg || '#F7DD6B') + rect(-w / 2, -w / 2, w, w * 0.16, '#000', { opacity: 0.06 }), 'cutS') + (str ? pencil(0, w * 0.12, str, { size: o.size || w * 0.32, col: o.col || K.ink }) : ''));
  // resume sheet
  function sheet(x, y, w, o = {}) {
    const h = w * 1.35, R = F.R(o.seed || 2);
    let s = rect(0, 0, w, h, o.bg || K.white) + circ(w * 0.18, h * 0.12, w * 0.08, o.photo || K.sky) + rect(w * 0.32, h * 0.08, w * 0.45, h * 0.035, K.ink, { rx: 3 }) + rect(w * 0.32, h * 0.135, w * 0.3, h * 0.022, K.greyD, { rx: 3 });
    for (let k = 0; k < (o.lines ?? 8); k++) s += rect(w * 0.1, h * (0.27 + k * 0.08), w * (0.5 + R() * 0.32), h * 0.022, K.grey, { rx: 3 });
    return G(tr(x, y, 1, o.r || 0), o.flatShadow ? rect(5, 9, w, h, '#2B1D10', { opacity: 0.18 }) + s : cut(s, o.k || 'cut'));
  }
  // a laptop seen from the front; screen content is drawn crisp (no cut filter) in a 300 x 190 box
  const laptop = (x, y, s, screen) => G(tr(x, y, s), cut(rect(-165, -215, 330, 215, K.navy, { rx: 14 }) + path('M-190,-4 L190,-4 L206,14 L-206,14 Z', '#D8D0C2'), 'cutS') + G('translate(-150,-200)', rect(0, 0, 300, 186, K.white, { rx: 6 }) + (screen || '')));
  const phone = (s = 1, scr = '') => G(`scale(${s})`, rect(-26, -50, 52, 92, K.ink, { rx: 9 }) + rect(-21, -43, 42, 76, K.white, { rx: 5 }) + scr);
  const env = (x, y, s, open = 0, col = K.white) => G(tr(x, y, s), cut(rect(-90, -58, 180, 116, col, { rx: 6 }) + path(`M-90,-58 L0,${f(10 - 120 * open)} L90,-58`, open > 0.5 ? '#EFE6D3' : '#E7DCC6', { stroke: '#CDBFA6', 'stroke-width': 3 }) + line('M-90,58 L-20,0 M90,58 L20,0', '#D9CDB6', 3), 'cutS'));
  const plane = (x, y, s, r = 0, col = K.white) => G(tr(x, y, s, r), cut(path('M-70,0 L70,-6 L-40,-34 Z', col) + path('M-70,0 L70,-6 L-30,22 Z', '#E6DCC9') + path('M-40,0 L70,-6 L-34,8 Z', '#D9CDB6'), 'cutS'));
  const desk = (x, y, w = 640) => cut(rect(x, y, w, 30, K.wood, { rx: 6 }) + rect(x + 24, y + 30, 24, 200, K.woodD) + rect(x + w - 48, y + 30, 24, 200, K.woodD), 'cut');
  const plant = (x, y, s = 1) => G(tr(x, y, s), cut(path('M-38,0 L38,0 L30,-62 L-30,-62 Z', K.coral) + path('M0,-60 Q-60,-120 -50,-190 Q-10,-150 0,-60 Z', K.sage) + path('M0,-60 Q50,-140 30,-210 Q-6,-150 0,-60 Z', K.sageD) + path('M0,-60 Q70,-90 86,-150 Q30,-130 0,-60 Z', K.sage), 'cutS'));
  const cloud = (x, y, s, col = '#8D97B3') => G(tr(x, y, s), cut(path('M-120,30 Q-140,-30 -80,-36 Q-60,-96 0,-80 Q50,-120 90,-60 Q150,-56 130,30 Z', col), 'cut'));

  // ---------- scoreboard (the round counter of the two applicants) ----------
  function score(T, a, sam, maya, o = {}) {
    const u = E.outBack(seg(st(T), a, a + 0.4)); if (u <= 0) return '';
    const y = -140 + 200 * u;
    let s = cut(rect(-330, -58, 660, 116, K.ink, { rx: 22 }), 'lift');
    s += cut(rect(-310, -44, 270, 88, K.mustard, { rx: 14 }) + rect(40, -44, 270, 88, K.teal, { rx: 14 }), 'cutS');
    s += text(-260, 18, 'SAM', { 'font-size': 46, 'font-weight': 900, fill: K.ink }) + text(-70, 22, String(sam), { 'text-anchor': 'end', 'font-size': 60, 'font-weight': 900, fill: K.ink });
    s += text(260, 18, 'MAYA', { 'text-anchor': 'end', 'font-size': 46, 'font-weight': 900, fill: K.cream }) + text(70, 22, String(maya), { 'font-size': 60, 'font-weight': 900, fill: K.cream });
    s += text(0, 16, o.round || '', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 900, fill: K.cream });
    return G(tr(960, y), s);
  }
  // split screen: two cards side by side, each with its own camera (draws get (T, c))
  function split(T, cL, cR, drawL, drawR, o = {}) {
    const gap = 18, w = 960 - gap * 1.5, h = 1080 - 2 * (o.m ?? 40), y0 = o.m ?? 40;
    const sl = o.slide ?? 1;
    const xL = gap - (1 - sl) * 1000, xR = 960 + gap / 2 + (1 - sl) * 1000;
    const id = o.id || 'sp';
    let s = `<defs><clipPath id="${id}L"><rect x="${f(xL)}" y="${y0}" width="${f(w)}" height="${h}" rx="18"/></clipPath><clipPath id="${id}R"><rect x="${f(xR)}" y="${y0}" width="${f(w)}" height="${h}" rx="18"/></clipPath></defs>`;
    s += cut(rect(xL, y0, w, h, K.white, { rx: 18 }) + rect(xR, y0, w, h, K.white, { rx: 18 }), 'lift');
    const sc = h / 1080, ox = w / 2 - 960 * sc;   // each panel shows the middle of its own 1920 x 1080 world, full height
    s += `<g clip-path="url(#${id}L)"><g transform="translate(${f(xL + ox)},${y0}) scale(${f(sc)})">${drawL(T, cL)}</g></g>`;
    s += `<g clip-path="url(#${id}R)"><g transform="translate(${f(xR + ox)},${y0}) scale(${f(sc)})">${drawR(T, cR)}</g></g>`;
    return s;
  }
  // a sheet of paper slides across the frame to hide a cut at time t (dir 1 = right to left)
  function wipe(T, t, o = {}) {
    const d = o.d || 0.7, u = seg(T, t - d / 2, t + d / 2); if (u <= 0 || u >= 1) return '';
    const x = 2000 - E.inOutCubic(u) * 4400, R = F.R(o.seed || 9);
    let pd = 'M0,-40'; for (let y = 0; y <= 1140; y += 50) pd += ` L${f((R() - 0.5) * 34)},${y}`; pd += ' L2600,1140 L2600,-40 Z';
    return G(tr(x, 0), cut(path(pd, o.col || K.cream), 'lift') + (o.inner ? G(tr(1100, 540), o.inner) : ''));
  }

  // ---------- the running scoreboard: P.SCORE = [[t, 'sam'|'maya'], ...] (set by the film's story.js) ----------
  // board(T, {a, b}): slides in at a, out at b; a point lands with a pop and a flying "+1"
  function board(T, o = {}) {
    const S = st(T), a = o.a ?? -1, b = o.b ?? 1e9;
    const u = Math.min(E.outBack(seg(S, a, a + 0.4)), 1 - E.inCubic(seg(S, b - 0.35, b)));
    if (u <= 0) return '';
    const ev = (P.SCORE || []).filter(([t]) => t <= S), n = (who) => ev.filter(([, w]) => w === who).length;
    const lastHit = (who) => { const e = ev.filter(([, w]) => w === who).pop(); return e ? S - e[0] : 99; };
    const bump = (who) => { const d = lastHit(who); return d < 0.5 ? 1 + 0.35 * Math.sin((d / 0.5) * Math.PI) : 1; };
    const y = (o.y ?? 70) - 200 * (1 - u);
    let s = cut(rect(-330, -58, 660, 116, K.ink, { rx: 22 }), 'lift');
    s += cut(rect(-310, -44, 270, 88, K.mustard, { rx: 14 }) + rect(40, -44, 270, 88, K.teal, { rx: 14 }), 'cutS');
    s += text(-290, 18, 'SAM', { 'font-size': 46, 'font-weight': 900, fill: K.ink }) + G(tr(-90, 0, bump('sam')), text(0, 22, String(n('sam')), { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 900, fill: K.ink }));
    s += text(290, 18, 'MAYA', { 'text-anchor': 'end', 'font-size': 46, 'font-weight': 900, fill: K.cream }) + G(tr(90, 0, bump('maya')), text(0, 22, String(n('maya')), { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 900, fill: K.cream }));
    ['sam', 'maya'].forEach((who) => { const d = lastHit(who); if (d < 0.9) { const v = d / 0.9; s += G({ transform: tr(who === 'sam' ? -90 : 90, 70 + 60 * v, 1), opacity: f(1 - v) }, text(0, 0, '+1', { 'text-anchor': 'middle', 'font-size': 48, 'font-weight': 900, fill: who === 'sam' ? K.mustardD : K.tealD, stroke: K.cream, 'stroke-width': 8, 'paint-order': 'stroke' })); } });
    return G(tr(960, y, o.s ?? 0.85), s);
  }

  // ---------- round banner: "ROUND 3" chip + the tip, pinned to the top-left for a moment ----------
  function round(T, a, n, title, o = {}) {
    const S = st(T), b = a + (o.d ?? 2.4), u = Math.min(E.outBack(seg(S, a, a + 0.4)), 1 - E.inCubic(seg(S, b - 0.3, b)));
    if (u <= 0) return '';
    const x = 960, y = o.y ?? 540, sc = o.s ?? 1;
    let s = strip(0, 30, title, { size: 92, bg: K.cream, r: -2, lift: true, seed: n + 3 });
    s += G(tr(-F.measure(title, 92, 900) / 2 + 40, -70, 1, -6), cut(rect(-120, -40, 240, 80, K.coral, { rx: 12 }), 'cutS') + text(0, 16, `ROUND ${n}`, { 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 900, fill: K.cream }));
    return G({ transform: tr(x, y + (1 - u) * 60, sc * (0.6 + 0.4 * u)), opacity: f(Math.min(1, u * 1.5)) }, s);
  }

  // ---------- a desk scene: who sits at a laptop; screen(T) draws its 300 x 186 screen ----------
  function deskScene(T, c, o = {}) {
    const S = st(T), who = o.who || 'sam', typing = o.typing ?? true;
    let w = cut(rect(250, 200, 360, 300, '#CFE3E2') + rect(250, 200, 360, 300, 'none', { stroke: K.wood, 'stroke-width': 18 }) + line('M430,200 V500 M250,350 H610', K.wood, 10), 'cut') + plant(1640, 690, 0.9);
    w += desk(860, 690, 720) + laptop(1180, 690, 1.3, o.screen ? o.screen(S) : '') + G(tr(1440, 690), cut(path('M-26,0 L26,0 L22,-60 L-22,-60 Z', who === 'maya' ? K.teal : K.coral) + line('M22,-46 q22,0 22,18 q0,18 -22,18', who === 'maya' ? K.teal : K.coral, 8), 'cutS'));
    w += cut(rect(640, 800, 230, 26, K.coralD, { rx: 8 }) + rect(660, 826, 20, 54, K.coralD) + rect(830, 826, 20, 54, K.coralD) + rect(630, 620, 26, 200, K.coralD, { rx: 8 }), 'cut');
    const k = typing ? 6 * Math.sin(S * 22) : 0;
    w += ch(Object.assign({ pal: who, x: 760, y: 880, face: 1, sit: true, lean: 6, brows: 'neutral', mouth: 'flat', look: [1, 0], armL: [70 + k, 40], armR: [62 - k, 50], legL: [4, -4], legR: [-2, -2], seed: who === 'maya' ? 3 : 1 }, o.pose || {}), T);
    return bg(T, c, o.mood || (who === 'maya' ? 'teal' : 'room'), { seed: o.seed || 3 }) + F.L(c, 1, w + (o.extra ? o.extra(S) : ''));
  }

  // ---------- the prompt: a big paper monitor; the voice's words type into the message box as they are said ----------
  // o: { a, b, t0, t1, who, hl: [words to mark], reply: [lines], sentAt, cam, title }
  function promptShot(o) {
    const who = o.who || 'maya', acc = who === 'maya' ? K.teal : K.mustard, accD = who === 'maya' ? K.tealD : K.mustardD;
    const MX = 470, MY = 110, MW = 1330, MH = 720, size = 46, lh = 64, maxW = 820, sp = size * 0.28;
    const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
    const cam = o.cam || [[o.a, { x: 1000, y: 520, z: 1.0 }], [o.b, { x: 1060, y: 500, z: 1.1 }, 'inOutSine']];
    return { a: o.a, b: o.b, xin: o.xin, cam, draw: (T, c) => {
      const S = st(T), words = F.vo(o.t0, o.t1), sent = o.sentAt ?? (words.length ? words[words.length - 1].e + 0.35 : o.b);
      const MWd = (s, hl) => F.measure(s, size, hl ? 900 : 700);
      let scr = rect(0, 0, MW - 60, 70, '#EDE6D8') + circ(36, 35, 11, K.coral) + circ(70, 35, 11, K.mustard) + circ(104, 35, 11, K.sage) + text((MW - 60) / 2, 48, o.title || 'ChatGPT or Claude', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 800, fill: K.inkS });
      // the message bubble (right side), wrapped by measured width
      const lines = [[]]; let lw = 0;
      words.forEach((wd, i) => { const ww = MWd(wd.w, true) + sp; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += ww; });
      const bw = Math.min(maxW, Math.max(0, ...lines.map((Ln) => Ln.reduce((p, i) => p + MWd(words[i].w, true) + sp, 0)))) + 70, bh = lines.length * lh + 44;
      const sendU = E.inOutCubic(seg(T, sent, sent + 0.45));
      const bx = MW - 60 - 40 - bw, by = 110 - sendU * Math.max(0, bh - 150) * 0;
      const first = words[0] ? words[0].s : o.a, bu = E.outBack(seg(S, first - 0.25, first + 0.1));
      if (bu > 0) {
        scr += G({ transform: `translate(${f(bx + bw)},${f(by)}) scale(${f(bu)}) translate(${f(-bw)},0)` }, rect(0, 0, bw, bh, acc, { rx: 30 }));
        let caret = null;
        lines.forEach((Ln, li) => {
          let xx = bx + 35; const yy = by + 22 + size + li * lh - 6;
          Ln.forEach((i) => {
            const wd = words[i], ws = wd.s - 0.06, we = Math.max(wd.s + 0.12, wd.e - 0.05), n = wd.w.length, k = Math.floor(n * clamp((T - ws) / (we - ws)));
            const hl = (o.hl || []).includes(norm(wd.w)), wf = MWd(wd.w, hl);
            if (hl && k > 0) scr += rect(xx - 6, yy - size * 0.86, MWd(wd.w.slice(0, k), true) + 12, size * 1.12, K.cream, { rx: 8, opacity: 0.95 });
            if (k > 0) scr += text(xx, yy, wd.w.slice(0, k), { 'font-size': size, 'font-weight': hl ? 900 : 700, fill: hl ? accD : (who === 'maya' ? K.cream : K.ink) });
            if (T >= ws && (k < n || i === words.length - 1)) caret = [xx + MWd(wd.w.slice(0, k), hl), yy];
            xx += wf + sp;
          });
        });
        if (caret && T < sent && Math.floor(T * 2.4) % 2 === 0) scr += rect(caret[0] + 4, caret[1] - size * 0.8, 5, size * 0.95, who === 'maya' ? K.cream : K.ink);
      }
      // the reply arrives after sending: typing dots, then lines
      const ru = seg(S, sent + 0.3, sent + 0.6);
      if (ru > 0 && by + bh + 30 < MH - 140) {
        const ry = by + bh + 30, rl = o.reply || [], rh = Math.max(110, rl.length * 54 + 50), rw = 760;
        scr += G({ transform: tr(40, ry, E.outBack(ru)) }, rect(0, 0, rw, Math.min(rh, MH - 130 - ry), '#F1EBDF', { rx: 26 }) + circ(-2, -2, 20, acc) + (S < sent + 0.9 ? [0, 1, 2].map((k) => circ(50 + k * 34, 55, 10, K.greyD, { opacity: f(0.4 + 0.6 * Math.abs(Math.sin(S * 6 + k))) })).join('') : rl.map((Ln, k) => { const vis = Math.round(Ln.length * clamp((S - sent - 0.9 - k * 0.35) / 0.4)); return vis > 0 ? text(36, 64 + k * 54, Ln.slice(0, vis), { 'font-size': 38, 'font-weight': 800, fill: K.ink }) : ''; }).join('')));
      }
      // input box at the bottom with a send button
      scr += rect(40, MH - 130, MW - 140, 80, K.white, { rx: 40, stroke: '#DED4C0', 'stroke-width': 3 }) + circ(MW - 140, MH - 90, 32, T > sent ? K.sage : acc) + line(`M${MW - 154},${MH - 86} l14,-14 l14,14 M${MW - 140},${MH - 100} v30`, K.cream, 6);
      let w = cut(rect(MX - 30, MY - 30, MW, MH + 60, K.navy, { rx: 30 }) + path(`M${MX + MW / 2 - 140},${MY + MH + 30} L${MX + MW / 2 + 80},${MY + MH + 30} L${MX + MW / 2 + 120},${MY + MH + 120} L${MX + MW / 2 - 180},${MY + MH + 120} Z`, K.navyD), 'cut');
      w += G(`translate(${MX},${MY})`, rect(0, 0, MW - 60, MH, K.white, { rx: 14 }) + scr);
      // who is typing, at the bottom left
      const kk = T < sent ? 7 * Math.sin(S * 24) : 0;
      w += ch({ pal: who, x: 250, y: 1150, s: 1.15, face: 1, lean: 4, brows: T > sent + 1 ? 'happy' : 'neutral', mouth: T > sent + 1 ? 'smile' : 'flat', look: [1, -1], armL: [100 + kk, 30], armR: [90 - kk, 40], seed: who === 'maya' ? 3 : 1 }, T);
      w += cut(rect(-200, 960, 2400, 300, K.woodD), 'flat');
      return bg(T, c, who === 'maya' ? 'teal' : 'mustard', { noHills: true, floor: false }) + F.L(c, 1, w) + (o.left ? o.left(T, S) : '');
    } };
  }

  // ---------- a split shot: Sam (left) | Maya (right), the scoreboard on top ----------
  // o: { a, b, xin, L(T, c), R(T, c), camL, camR, board: {a, b} }
  function splitShot(o) {
    return { a: o.a, b: o.b, xin: o.xin, cam: [[o.a, { x: 960, y: 540, z: 1 }], [o.b, { x: 960, y: 540, z: 1.04 }]], draw: (T, c) => {
      const cl = F.drift(T, o.camL ? F.camPath(T, o.camL) : { x: 960, y: 560, z: 1 }, 0.7), cr = F.drift(T + 3, o.camR ? F.camPath(T, o.camR) : { x: 960, y: 560, z: 1 }, 0.7);
      const id = 'sp' + Math.round(o.a * 10);
      return bg(T, c, 'board', { noHills: true, floor: false }) + F.L(c, 1, split(T, cl, cr, o.L, o.R, { id, slide: o.slideIn ? E.outCubic(seg(T, o.a, o.a + 0.45)) : 1 })) + board(T, Object.assign({ a: o.a - 1 }, o.board || {})) + (o.over ? o.over(T, st(T)) : '');
    } };
  }

  window.FILM_CAMERA = window.FILM_CAMERA || 'smooth';   // paper films use the smooth camera path (FILM.camPath)
  window.P = { K, DEFS, view, cut, st, jit, nudge, pop, ch, bg, torn, MOODS, finish, GRAIN, strip, label, pencil, loop, sticky, sheet, laptop, phone, env, plane, desk, plant, cloud, score, split, wipe, board, round, deskScene, promptShot, splitShot, SCORE: [] };
})();
