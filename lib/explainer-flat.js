// kurz.js: a science-explainer look (inspired by the genre, not copied): saturated flat shapes, deep gradient skies,
// soft glows, layered parallax landscapes, drifting particles. Same API as paper.js (P), so paper-film scenes run on it.
(function () {
  const F = window.FILM, H = window.HERO, { G, tr, rect, circ, ell, path, line, text, E, seg, clamp, f } = F;
  const K = {
    board: '#0B0D2A', kraft: '#1F7A86', kraftD: '#0E4F5A', cream: '#FFF4E0', white: '#FFFFFF',
    ink: '#1B1640', inkS: '#4B4670', mustard: '#FFB938', mustardD: '#E08A12', teal: '#1FC8C0', tealD: '#0E8F96',
    coral: '#FF5E5B', coralD: '#D93E45', navy: '#25285E', navyD: '#181A45', sage: '#5ED39A', sageD: '#2FA873',
    sky: '#7FD3FF', skyD: '#4BB0E8', pink: '#FF8FB1', lilac: '#A88BFF', red: '#FF3B5C', grey: '#C9CCE0', greyD: '#9A9EC0',
    dusk: '#2B2A6B', duskD: '#1A1C48', sun: '#FFD166', wood: '#C9784A', woodD: '#9E5A33',
  };
  H.PAL.sam = { skin: '#E8A27A', skinD: '#C9825C', hair: '#2A1E3A', top: K.mustard, topD: K.mustardD, pants: '#3D3F8F', pantsD: '#2E3070', shoe: '#FFF4E0', shoeD: '#D9CFE8', style: 'short', hood: true };
  H.PAL.maya = { skin: '#9A5E3E', skinD: '#7C4A30', hair: '#1A1030', top: K.teal, topD: K.tealD, pants: '#46306E', pantsD: '#352458', shoe: '#FFF4E0', shoeD: '#D9CFE8', style: 'bun' };
  H.PAL.paperfolk = { skin: '#8F8BD0', skinD: '#7671BC', hair: '#5D58A8', top: '#6F69C2', topD: '#5D57AE', pants: '#4A4596', pantsD: '#3D3984', shoe: '#4A4596', shoeD: '#3D3984', style: 'short', faceless: true };

  // ---------- moods: sky gradient, light, far / mid hills, floor, particles ----------
  const MOODS = {
    board: { sky: ['#0B0D2A', '#1A1D4E'], glow: '#5B5FD6', stars: true },
    room: { sky: ['#241A55', '#4E347F'], glow: '#FFB45E', far: '#3B2A70', mid: '#30225F', floor: '#22184A', top: '#5A3F8F', mote: '#FFD9A0' },
    kraft: { sky: ['#0B3D4E', '#18727E'], glow: '#7FF0E0', far: '#12586A', mid: '#0E4A5A', floor: '#0A3A48', top: '#1F8A92', mote: '#9FFFF0' },
    sky: { sky: ['#2F64C8', '#7CC2F2'], glow: '#FFF2B0', far: '#4F8FD8', mid: '#2F9C77', floor: '#237E5F', top: '#4FC48F', mote: '#FFFFFF' },
    dusk: { sky: ['#0E1036', '#2E2C72'], glow: '#8F97FF', far: '#252463', mid: '#1C1B50', floor: '#14133D', top: '#3B3A86', mote: '#C9CCFF', stars: true },
    sun: { sky: ['#F0703A', '#FFC94A'], glow: '#FFF3C0', far: '#E8603A', mid: '#C9462E', floor: '#A63528', top: '#F07A4A', mote: '#FFF3C0' },
    mustard: { sky: ['#B9501C', '#F2A33A'], glow: '#FFE19A', far: '#A9471B', mid: '#8F3A16', floor: '#722D12', top: '#C25A22', mote: '#FFE19A' },
    teal: { sky: ['#0A4E62', '#17A0A6'], glow: '#B5FFF4', far: '#0D6E7A', mid: '#0A5A66', floor: '#084852', top: '#14858C', mote: '#B5FFF4' },
  };
  const grads = Object.entries(MOODS).map(([k, m]) => `<linearGradient id="ksky-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sky[0]}"/><stop offset="1" stop-color="${m.sky[1]}"/></linearGradient><radialGradient id="kglow-${k}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${m.glow}" stop-opacity="0.75"/><stop offset="0.35" stop-color="${m.glow}" stop-opacity="0.22"/><stop offset="1" stop-color="${m.glow}" stop-opacity="0"/></radialGradient>`).join('');
  const DEFS = `<defs>${grads}
    <filter id="klift" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.03  0 0 0 0 0.2  0 0 0 0.4 0"/><feOffset dy="16" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="pvig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.62" stop-color="#05061A" stop-opacity="0"/><stop offset="1" stop-color="#05061A" stop-opacity="0.38"/></radialGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE7A8" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient></defs>`;
  // flat, crisp shapes; only "lift" pieces float on a soft shadow
  const cut = (inner, k = 'cut') => (k === 'lift' ? `<g filter="url(#klift)">${inner}</g>` : inner);

  // time helpers (kept for scene compatibility; motion is smooth)
  const st = (T, fps) => { const k = fps || (window.P && window.P.STOP) || 0; return k ? Math.floor(T * k + 1e-6) / k : T; };
  const jit = () => [0, 0, 0];
  const nudge = (T, seed, inner) => inner;
  const pop = (T, a, d = 0.34) => { const u = seg(T, a, a + d); return u <= 0 ? 0 : u >= 1 ? 1 : E.outBack(u); };

  // ---------- people ----------
  const ch = (pose, T) => H.svg(Object.assign({ pal: 'sam' }, pose), T);

  // ---------- backgrounds: gradient sky, a soft light, stars, two hill layers, a floor with a lit top edge ----------
  const view = (c, d, m = 160) => { const z = 1 + (c.z - 1) * d, x = 960 + (c.x - 960) * d, y = 540 + (c.y - 540) * d; return [x - 960 / z - m, x + 960 / z + m, y + 540 / z + m]; };
  // a smooth ridge line (sum of sines, fixed by world x so culling never shifts it)
  const ridge = (x0, x1, y, amp, seed, down) => { const a = Math.floor(x0 / 40) * 40, b = Math.ceil(x1 / 40) * 40, p1 = seed * 1.7, p2 = seed * 0.9; let d = `M${a},${down} L${a},${f(y)}`; for (let x = a; x <= b; x += 40) d += ` L${x},${f(y + amp * (0.6 * Math.sin(x / 260 + p1) + 0.4 * Math.sin(x / 113 + p2)))}`; return d + ` L${b},${down} Z`; };
  const torn = (x0, x1, y, amp, seed, down = 1200) => ridge(x0, x1, y, amp, seed, down);
  function stars(T, seed) { const R = F.R(seed * 13 + 1); let s = ''; for (let k = 0; k < 60; k++) { const x = R() * 2400 - 240, y = R() * 700 - 100, r = 1.2 + R() * 2.4, ph = R() * 6.28; s += circ(x, y, r, '#FFFFFF', { opacity: f(0.35 + 0.45 * Math.abs(Math.sin(T * 0.8 + ph))) }); } return s; }
  function bg(T, c, mood = 'room', o = {}) {
    const m = MOODS[mood] || MOODS.room, L = F.L, sd = o.seed || 3;
    let s = L(c, 0.15, rect(-2400, -1800, 6720, 4680, `url(#ksky-${mood in MOODS ? mood : 'room'})`));
    s += L(c, 0.15, ell(1280 + 120 * Math.sin(sd), 300, 760, 560, `url(#kglow-${mood in MOODS ? mood : 'room'})`));
    if (m.stars) s += L(c, 0.2, stars(T, sd));
    if (mood !== 'board' && !o.noHills) {
      const hy = o.hy ?? 700; let [x0, x1, yb] = view(c, 0.35); s += L(c, 0.35, path(ridge(x0, x1, hy - 70, 70, sd, Math.max(yb, hy + 300)), m.far));
      [x0, x1, yb] = view(c, 0.6); s += L(c, 0.6, path(ridge(x0, x1, hy + 20, 46, sd + 3, Math.max(yb, hy + 300)), m.mid));
    }
    if (mood !== 'board') s += L(c, 0.5, F.motes(T, 22, sd + 7, m.mote, 0.55));
    if (mood !== 'board' && o.floor !== false) { const [x0, x1, yb] = view(c, 1), fy = o.fy ?? 880; s += L(c, 1, path(ridge(x0, x1, fy, 10, sd + 5, Math.max(yb, fy + 300)), m.floor) + path(ridge(x0, x1, fy, 10, sd + 5, fy + 14).replace(/L(-?\d+),(\d+) Z$/, ''), 'none', { stroke: m.top, 'stroke-width': 10, opacity: 0.9 })); }
    return s;
  }
  const VIG = rect(0, 0, 1920, 1080, 'url(#pvig)');
  const GRAIN = '';
  const mount = () => { const st2 = document.getElementById('stage'); if (!st2 || st2.querySelector('#paperStatic')) return; st2.insertAdjacentHTML('afterbegin', `<g id="paperStaticDefs">${DEFS}</g>`); st2.insertAdjacentHTML('beforeend', `<g id="paperStatic" pointer-events="none">${VIG}</g>`); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  const finish = () => '';

  // ---------- pieces ----------
  // a clean rounded label (o.bg, o.fg, o.size, o.r, o.lift)
  const strip = (x, y, str, o = {}) => {
    const size = o.size || 64, w = F.measure(str, size, 900) + size * 1.0, h = size * 1.45;
    return G(tr(x, y, o.s ?? 1, (o.r ?? -2) * 0.5), cut(rect(-w / 2, -h / 2, w, h, o.bg || K.cream, { rx: h * 0.32 }) + rect(-w / 2 + 8, -h / 2 + 6, w - 16, h * 0.28, '#FFFFFF', { rx: h * 0.14, opacity: 0.18 }), o.lift ? 'lift' : 'cut') + text(0, size * 0.35, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: o.fg || K.ink, 'letter-spacing': o.ls ?? 1 }));
  };
  const label = (T, a, x, y, str, o = {}) => { const u = pop(T, a); return u > 0 ? strip(x, y, str, Object.assign({}, o, { s: (o.s ?? 1) * u })) : ''; };
  // an annotation: bold sans with a dark halo so it reads on any sky; dark colours become cream
  const pencil = (x, y, str, o = {}) => { const dark = !o.col || o.col === K.ink || o.col === K.inkS; const col = dark ? K.cream : o.col === K.red ? '#FFD166' : o.col; return text(x, y, str, { 'font-weight': 800, 'font-size': (o.size || 56) * 0.82, fill: col, stroke: '#120E33', 'stroke-width': 7, 'paint-order': 'stroke', 'stroke-linejoin': 'round', 'text-anchor': o.anchor || 'middle', transform: o.r ? `rotate(${o.r * 0.5},${x},${y})` : undefined }); };
  // a glowing ring drawn around a point
  function loop(T, a, cx, cy, rx, ry, o = {}) {
    const u = seg(T, a, a + (o.d || 0.45)); if (u <= 0) return '';
    const col = !o.col || o.col === K.red ? '#FFD166' : o.col, len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.12, v = E.inOutSine(u);
    const RX = rx * 1.12, RY = ry * 1.12, d = `M${f(cx - RX)},${f(cy)} a${f(RX)},${f(RY)} 0 1 1 ${f(2 * RX)},0 a${f(RX)},${f(RY)} 0 1 1 ${f(-2 * RX)},0`;
    return path(d, 'none', { stroke: col, 'stroke-width': (o.w || 9) * 2.4, opacity: 0.18, 'stroke-dasharray': f(len), 'stroke-dashoffset': f(len * (1 - v)) }) + path(d, 'none', { stroke: col, 'stroke-width': o.w || 9, 'stroke-linecap': 'round', 'stroke-dasharray': f(len), 'stroke-dashoffset': f(len * (1 - v)) });
  }
  const sticky = (x, y, w, str, o = {}) => G(tr(x, y, o.s ?? 1, (o.r ?? 3) * 0.5), rect(-w / 2, -w / 2, w, w, o.bg || K.sun, { rx: 12 }) + (str ? text(0, w * 0.1, str, { 'text-anchor': 'middle', 'font-size': (o.size || w * 0.32) * 0.82, 'font-weight': 800, fill: K.ink }) : ''));
  function sheet(x, y, w, o = {}) {
    const h = w * 1.35, R = F.R(o.seed || 2);
    let s = rect(0, 0, w, h, o.bg || K.white, { rx: w * 0.03 }) + circ(w * 0.18, h * 0.12, w * 0.08, o.photo || K.sky) + rect(w * 0.32, h * 0.08, w * 0.45, h * 0.035, K.ink, { rx: 3 }) + rect(w * 0.32, h * 0.135, w * 0.3, h * 0.022, K.greyD, { rx: 3 });
    for (let k = 0; k < (o.lines ?? 8); k++) s += rect(w * 0.1, h * (0.27 + k * 0.08), w * (0.5 + R() * 0.32), h * 0.022, K.grey, { rx: 3 });
    return G(tr(x, y, 1, o.r ? o.r * 0.6 : 0), o.flatShadow ? rect(0, 10, w, h, '#0A0830', { opacity: 0.28, rx: w * 0.03 }) + s : cut(s, o.k || 'cut'));
  }
  const laptop = (x, y, s, screen) => G(tr(x, y, s), rect(-165, -215, 330, 215, K.navyD, { rx: 16 }) + rect(-165, -215, 330, 10, '#3A3D84', { rx: 5 }) + path('M-190,-4 L190,-4 L206,14 L-206,14 Z', '#C9CCE0') + G('translate(-150,-200)', rect(0, 0, 300, 186, K.white, { rx: 6 }) + (screen || '')));
  const phone = (s = 1, scr = '') => G(`scale(${s})`, rect(-26, -50, 52, 92, K.ink, { rx: 9 }) + rect(-21, -43, 42, 76, K.white, { rx: 5 }) + scr);
  const env = (x, y, s, open = 0, col = K.white) => G(tr(x, y, s), rect(-90, -58, 180, 116, col, { rx: 8 }) + path(`M-90,-58 L0,${f(10 - 120 * open)} L90,-58`, open > 0.5 ? '#E6E8F5' : '#DCDFF0', { stroke: '#B9BDDA', 'stroke-width': 3 }) + line('M-90,58 L-20,0 M90,58 L20,0', '#C9CCE0', 3));
  const plane = (x, y, s, r = 0, col = K.white) => G(tr(x, y, s, r), path('M-70,0 L70,-6 L-40,-34 Z', col) + path('M-70,0 L70,-6 L-30,22 Z', '#DDE0F2') + path('M-40,0 L70,-6 L-34,8 Z', '#C2C6E2'));
  const desk = (x, y, w = 640) => rect(x, y, w, 30, K.wood, { rx: 8 }) + rect(x, y, w, 8, '#E39A6A', { rx: 4 }) + rect(x + 24, y + 30, 24, 200, K.woodD) + rect(x + w - 48, y + 30, 24, 200, K.woodD);
  const plant = (x, y, s = 1) => G(tr(x, y, s), path('M-38,0 L38,0 L30,-62 L-30,-62 Z', K.coral) + path('M0,-60 Q-60,-120 -50,-190 Q-10,-150 0,-60 Z', K.sage) + path('M0,-60 Q50,-140 30,-210 Q-6,-150 0,-60 Z', K.sageD) + path('M0,-60 Q70,-90 86,-150 Q30,-130 0,-60 Z', K.sage));
  const cloud = (x, y, s, col = '#6E73B8') => G(tr(x, y, s), path('M-120,30 Q-140,-30 -80,-36 Q-60,-96 0,-80 Q50,-120 90,-60 Q150,-56 130,30 Z', col));

  // ---------- scoreboard, split screen, wipe ----------
  function score(T, a, sam, maya, o = {}) {
    const u = E.outBack(seg(T, a, a + 0.4)); if (u <= 0) return '';
    const y = -140 + 200 * u;
    let s = cut(rect(-330, -58, 660, 116, '#14113A', { rx: 30 }), 'lift') + rect(-310, -44, 270, 88, K.mustard, { rx: 22 }) + rect(40, -44, 270, 88, K.teal, { rx: 22 });
    s += text(-260, 18, 'SAM', { 'font-size': 46, 'font-weight': 900, fill: K.ink }) + text(-70, 22, String(sam), { 'text-anchor': 'end', 'font-size': 60, 'font-weight': 900, fill: K.ink });
    s += text(260, 18, 'MAYA', { 'text-anchor': 'end', 'font-size': 46, 'font-weight': 900, fill: K.ink }) + text(70, 22, String(maya), { 'font-size': 60, 'font-weight': 900, fill: K.ink });
    return G(tr(960, y), s);
  }
  function split(T, cL, cR, drawL, drawR, o = {}) {
    const gap = 18, w = 960 - gap * 1.5, h = 1080 - 2 * (o.m ?? 40), y0 = o.m ?? 40;
    const sl = o.slide ?? 1;
    const xL = gap - (1 - sl) * 1000, xR = 960 + gap / 2 + (1 - sl) * 1000;
    const id = o.id || 'sp';
    let s = `<defs><clipPath id="${id}L"><rect x="${f(xL)}" y="${y0}" width="${f(w)}" height="${h}" rx="28"/></clipPath><clipPath id="${id}R"><rect x="${f(xR)}" y="${y0}" width="${f(w)}" height="${h}" rx="28"/></clipPath></defs>`;
    s += cut(rect(xL, y0, w, h, '#14113A', { rx: 28 }) + rect(xR, y0, w, h, '#14113A', { rx: 28 }), 'lift');
    const sc = h / 1080, ox = w / 2 - 960 * sc;
    s += `<g clip-path="url(#${id}L)"><g transform="translate(${f(xL + ox)},${y0}) scale(${sc.toFixed(5)})">${drawL(T, cL)}</g></g>`;
    s += `<g clip-path="url(#${id}R)"><g transform="translate(${f(xR + ox)},${y0}) scale(${sc.toFixed(5)})">${drawR(T, cR)}</g></g>`;
    s += rect(xL, y0, w, h, 'none', { rx: 28, stroke: K.mustard, 'stroke-width': 6, opacity: 0.85 }) + rect(xR, y0, w, h, 'none', { rx: 28, stroke: K.teal, 'stroke-width': 6, opacity: 0.85 });
    return s;
  }
  // a band of colour sweeps across the frame to hide a cut at time t
  function wipe(T, t, o = {}) {
    const d = o.d || 0.7, u = seg(T, t - d / 2, t + d / 2); if (u <= 0 || u >= 1) return '';
    const x = 2300 - E.inOutCubic(u) * 4900, col = o.col || K.lilac;
    return G(tr(x, 0), path('M0,-40 L360,-40 L120,1120 L-240,1120 Z', '#FFFFFF', { opacity: 0.35 }) + path('M260,-40 L2700,-40 L2460,1120 L20,1120 Z', col) + (o.inner ? G(tr(1300, 540), o.inner) : ''));
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

  window.FILM_CAMERA = window.FILM_CAMERA || 'smooth';   // smooth camera path (FILM.camPath)
  window.P = { K, DEFS, view, cut, st, jit, nudge, pop, ch, bg, torn, MOODS, finish, GRAIN, strip, label, pencil, loop, sticky, sheet, laptop, phone, env, plane, desk, plant, cloud, score, split, wipe, board, round, deskScene, promptShot, splitShot, SCORE: [] };
})();
