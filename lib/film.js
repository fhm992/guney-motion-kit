// film.js: the kit's film engine (character explainers in the style of Kurzgesagt / The Infographics Show). Immediate-mode SVG: every frame is a pure function of the absolute voice time T.
// FILM.run({ id, start, end, shots }) builds one composition. A shot = { a, b, cam: [[T, {x,y,z,r}], ...], draw(T, c) -> svg string }.
// Shots cross-dissolve at their seams while both cameras keep moving; sections zoom through at their edges.
(function () {
  const S = STAGE, { clamp, lerp, seg } = S;
  const E = Object.assign({}, S.E, {
    outSine: (u) => Math.sin((u * Math.PI) / 2), inSine: (u) => 1 - Math.cos((u * Math.PI) / 2),
    outBackSoft: (u) => { const s = 0.9; return 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2); },
  });
  const W = 1920, H = 1080;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const f = (n) => (Math.round(n * 100) / 100).toString();

  // ---------- interpolation ----------
  function mix(a, b, u) {
    if (typeof a === 'number') return a + (b - a) * u;
    if (Array.isArray(a)) return a.map((v, i) => mix(v, b[i], u));
    if (a && typeof a === 'object') { const o = {}; for (const k in a) o[k] = k in b ? mix(a[k], b[k], u) : a[k]; for (const k in b) if (!(k in o)) o[k] = b[k]; return o; }
    return u < 0.5 ? a : b;
  }
  function kf(t, keys, ease = 'inOutCubic') {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, v0] = keys[i], [t1, v1, e] = keys[i + 1];
      if (t < t1) { const u = (t - t0) / (t1 - t0); return mix(v0, v1, (E[e || ease] || E.inOutCubic)(u)); }
    }
    return keys[keys.length - 1][1];
  }
  const ease = (t, a, d = 0.5, e = 'outCubic') => E[e](seg(t, a, a + d));
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const rgb = (c) => `rgb(${c.map((v) => Math.round(clamp(v, 0, 255))).join(',')})`;
  const cmix = (a, b, u) => rgb(mix(hex(a), hex(b), clamp(u)));
  const ckf = (t, keys) => rgb(kf(t, keys.map(([tt, c, e]) => [tt, hex(c), e]), 'inOutSine'));

  // ---------- svg string helpers ----------
  const at = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${typeof v === 'number' ? f(v) : v}"`).join(' ');
  const el = (tag, o, inner) => (inner === undefined ? `<${tag} ${at(o)}/>` : `<${tag} ${at(o)}>${inner}</${tag}>`);
  const G = (o, inner) => (typeof o === 'string' ? `<g transform="${o}">${inner}</g>` : el('g', o, inner));
  const tr = (x = 0, y = 0, s = 1, r = 0) => `translate(${f(x)},${f(y)})${r ? ` rotate(${f(r)})` : ''}${s !== 1 ? ` scale(${f(s)})` : ''}`;
  const rect = (x, y, w, h, fill, o = {}) => el('rect', Object.assign({ x, y, width: Math.max(0, w), height: Math.max(0, h), fill }, o));
  const circ = (cx, cy, r, fill, o = {}) => el('circle', Object.assign({ cx, cy, r: Math.max(0, r), fill }, o));
  const ell = (cx, cy, rx, ry, fill, o = {}) => el('ellipse', Object.assign({ cx, cy, rx: Math.max(0, rx), ry: Math.max(0, ry), fill }, o));
  const path = (d, fill, o = {}) => el('path', Object.assign({ d, fill }, o));
  const line = (d, stroke, w, o = {}) => el('path', Object.assign({ d, stroke, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o));
  const text = (x, y, s, o = {}) => el('text', Object.assign({ x, y, 'font-family': "Figtree, sans-serif", 'font-weight': 800, 'font-size': 40, fill: '#FFF8EA' }, o), esc(s));
  const glow = (cx, cy, r, color = 'amber', op = 1) => ell(cx, cy, r, r, `url(#glow-${color})`, { opacity: op });

  // ---------- colours ----------
  const C = {
    night: '#0E1236', ink: '#1A1530', paper: '#FFF8EA', paperD: '#E7DCC8', line: '#C9BFAE', navy: '#2A2F5A',
    indigo: '#4A43A8', indigoD: '#2E2A6E', indigoL: '#6E66D9', violet: '#5A4FCF', lav: '#B9B8FF',
    amber: '#FFC145', amberD: '#C48E36', gold: '#E9B95A', brown: '#8A5A1E', coral: '#FF6B6B', mint: '#45D6B5', mintD: '#2FB892', sky: '#6FA8FF',
  };

  // ---------- the sky clock: night -> pre-dawn -> sunrise (#7) -> morning ----------
  const SKY = [
    [0, ['#090C29', '#1A1850', '#33286E']], [190, ['#0C1033', '#1E1D5A', '#3A2E7A']],
    [232, ['#121848', '#2D2F7E', '#6A4FA6']], [262, ['#1C2463', '#5A4C9E', '#E58A6B']], [272, ['#22307A', '#7A63A8', '#FFB36B']],
    [306, ['#141A4A', '#2E2C78', '#5E4596']], [338, ['#161D52', '#3A3A88', '#8A5FA0']],
    [368, ['#2C4FA0', '#7C8FD0', '#FFD08A']], [412, ['#3460B4', '#8FA6DD', '#FFDDA0']],
  ];
  function skyCols(T) { const v = kf(T, SKY.map(([t, cs]) => [t, cs.map(hex)]), 'inOutSine'); return v.map(rgb); }
  const starFade = (T) => 1 - 0.85 * clamp(seg(T, 236, 272)) * (T < 306 || T > 368 ? 1 : 0.2) - (T > 368 ? 0.15 : 0);
  function sky(T, o = {}) {
    const [top, mid, hor] = skyCols(T + (o.shift || 0));
    const id = 'sk' + (o.id || '');
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="0.65" stop-color="${mid}"/><stop offset="1" stop-color="${hor}"/></linearGradient></defs>`;
    s += rect(-2000, -2000, W + 4000, H + 4000, `url(#${id})`);
    const R = S.mulberry32(o.seed || 7), sf = clamp(starFade(T)) * (o.stars ?? 1);
    if (sf > 0.02) for (let i = 0; i < (o.n || 150); i++) {
      const x = R() * 2600 - 340, y = R() * 900 - 200, r = R() < 0.1 ? 2.6 : 1.1 + R() * 1.1, ph = R() * 6.28, warm = R() < 0.22;
      s += circ(x, y, r, warm ? '#FFE3A1' : '#C9C8FF', { opacity: f(sf * (0.3 + 0.5 * (0.5 + 0.5 * Math.sin(T * (0.8 + R()) + ph)))) });
    }
    return s;
  }
  // drifting motes in the air (screen space, gentle)
  function motes(T, n = 26, seed = 3, col = '#FFE3A1', op = 0.5) {
    const R = S.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x0 = R() * W, y0 = R() * H, sp = 6 + R() * 14, r = 1.5 + R() * 3, ph = R() * 6.28;
      const x = ((x0 + T * sp * 0.6 + Math.sin(T * 0.3 + ph) * 30) % (W + 60) + W + 60) % (W + 60) - 30;
      const y = ((y0 - T * sp + 3000) % (H + 60)) - 30;
      s += circ(x, y, r, col, { opacity: f(op * (0.4 + 0.6 * Math.abs(Math.sin(T * 0.5 + ph)))) });
    }
    return s;
  }

  // ---------- camera ----------
  // world coords are 1920x1080 at zoom 1, camera centre (x,y); depth d < 1 moves less (far), > 1 more (near)
  function camT(c, d = 1) {
    const z = 1 + (c.z - 1) * d, x = W / 2 + (c.x - W / 2) * d, y = H / 2 + (c.y - H / 2) * d;
    return `translate(${f(W / 2)},${f(H / 2)}) rotate(${f((c.r || 0) * d)}) scale(${f(z)}) translate(${f(-x)},${f(-y)})`;
  }
  // a constant, gentle breathing drift so no frame is ever still
  function drift(T, c, k = 1) {
    return { x: c.x + k * (Math.sin(T * 0.21) * 10 + Math.sin(T * 0.07 + 1) * 8), y: c.y + k * (Math.cos(T * 0.17) * 6), z: c.z * (1 + k * 0.006 * Math.sin(T * 0.13)), r: (c.r || 0) + k * 0.25 * Math.sin(T * 0.09) };
  }
  const L = (c, d, inner) => G(camT(c, d), inner);   // draw a layer at depth d

  // real text widths (Figtree), so words never collide
  const _cv = document.createElement('canvas').getContext('2d');
  const FONTS = ['700 100px Figtree', '800 100px Figtree', '900 100px Figtree', '700 100px Caveat'];
  const loadFonts = () => (document.fonts ? Promise.all(FONTS.map((q) => document.fonts.load(q).catch(() => null))) : Promise.resolve());
  loadFonts();
  const fontOk = (w) => !document.fonts || document.fonts.check(`${w} 100px Figtree`, 'Ag');
  const measure = (str, size, weight = 800) => { if (!fontOk(weight)) return str.length * size * 0.55; _cv.font = `${weight} ${size}px Figtree`; return _cv.measureText(str).width; };

  // ---------- key phrase: words rise in one at a time ----------
  function phrase(T, a, b, str, o = {}) {
    if (T < a - 0.05 || T > b + 0.6) return '';
    const size = o.size || 132, x = o.x ?? W / 2, y = o.y ?? 190, words = str.split(' ');
    const out = E.inCubic(seg(T, b, b + 0.45));
    let s = '', cw = 0;
    const widths = words.map((w) => measure(w, size, 900) + size * 0.26); const total = widths.reduce((p, q) => p + q, 0) - size * 0.24;
    let cx = o.anchor === 'start' ? x : x - total / 2;
    if (o.plate) { const pu = E.outExpo(seg(T, a, a + 0.5)) * (1 - out); s += rect(cx - size * 0.45, y - size * 0.95 - out * 40, total + size * 0.9, size * 1.3, '#141238', { rx: size * 0.4, opacity: f(0.82 * pu) }); }
    words.forEach((w, i) => {
      const u = E.outExpo(seg(T, a + i * 0.08, a + i * 0.08 + 0.55));
      const yy = y + (1 - u) * size * 0.5 - out * 40;
      const op = u * (1 - out);
      const col = (o.hl || []).includes(i) ? (o.hc || C.amber) : (o.fill || C.paper);
      s += text(cx + 4, yy + 6, w, { 'font-size': size, 'font-weight': 900, fill: '#05061A', opacity: f(op * 0.35) });
      s += text(cx, yy, w, { 'font-size': size, 'font-weight': 900, fill: col, opacity: f(op) });
      cx += widths[i];
    });
    return s;
  }
  // a small label tag (40 px+), slides in
  function tag(T, a, x, y, str, o = {}) {
    const u = E.outExpo(seg(T, a, a + 0.5)); if (u <= 0) return '';
    const size = o.size || 44, w = measure(str, size, 800) + size * 1.1, h = size * 1.7;
    return G({ transform: tr(x, y + (1 - u) * 30), opacity: f(u * (o.op ?? 1)) }, rect(-w / 2, -h / 2, w, h, o.bg || C.amber, { rx: h / 2 }) + text(0, size * 0.36, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 800, fill: o.fg || '#2A1A08' }));
  }

  // ---------- voice words ----------
  const WORDS = () => (window.VO && window.VO.captions ? window.VO.captions.words : []);
  const vo = (t0, t1) => WORDS().filter((w) => w.s >= t0 - 0.02 && w.s < t1);
  const wordAt = (word, near) => { let best = null; for (const w of WORDS()) if (w.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word && (!best || Math.abs(w.s - near) < Math.abs(best.s - near))) best = w; return best ? best.s : near; };

  // ---------- cues for the sound mix (collected at build time, not draw time) ----------
  const CUES = (window.__cues = window.__cues || []);
  const cue = (t, name, gain = 1, o = {}) => CUES.push(Object.assign({ t: +t.toFixed(3), name, gain }, o));

  // ---------- the composition runner ----------
  function run(def) {
    const { id, start, end, shots } = def, dur = +(end - start).toFixed(3);
    const root = document.getElementById('root');
    root.setAttribute('data-duration', dur); root.setAttribute('data-composition-id', id);
    const stage = document.getElementById('stage');
    stage.setAttribute('data-duration', dur);
    const svg = document.getElementById('svg');
    const X = def.xfade ?? 0.42;
    const defs = DEFS();
    const frame = (lt) => {
      const T = start + lt;
      let out = defs;
      for (let i = 0; i < shots.length; i++) {
        const sh = shots[i], a = sh.a ?? (i ? shots[i - 1].b : start), b = sh.b ?? (shots[i + 1] ? shots[i + 1].a : end);
        sh._a = a; sh._b = b;
        const xin = i === 0 ? 0 : (sh.xin ?? X), xout = i === shots.length - 1 ? 0 : (shots[i + 1].xin ?? X);
        if (T < a - xin / 2 || T > b + xout / 2) continue;
        let c = sh.cam ? kf(T, sh.cam) : { x: W / 2, y: H / 2, z: 1, r: 0 };
        c = Object.assign({ r: 0 }, c);
        c = drift(T, c, sh.drift ?? 1);
        // section edges: zoom through
        if (def.zoomOut !== false && i === 0) { const u = 1 - E.outExpo(seg(T, start, start + 0.55)); c.z *= 1 + 0.5 * u; }
        if (def.zoomIn !== false && i === shots.length - 1) { const u = E.inExpo(seg(T, end - 0.45, end)); c.z *= 1 + 0.6 * u; }
        const op = i === 0 ? 1 : E.inOutSine(seg(T, a - xin / 2, a + xin / 2));
        const body = sh.draw(T, c, sh);
        out += op < 1 ? `<g opacity="${f(op)}">${body}</g>` : body;
      }
      // dip at the section seam to hide the cut inside the zoom
      const dip = Math.max(def.zoomOut === false ? 0 : 1 - E.outCubic(seg(T, start, start + 0.3)), def.zoomIn === false ? 0 : E.inCubic(seg(T, end - 0.25, end)));
      if (dip > 0.001) out += rect(0, 0, W, H, '#0A0C26', { opacity: f(dip * 0.55) });
      if (def.overlay) out += def.overlay(T);
      out += VIGNETTE;
      svg.innerHTML = out;
    };
    loadFonts().then(() => { try { frame(window.__film && window.__film.lastT !== undefined ? window.__film.lastT : 0); } catch (e) { console.error(e); } });
    const tl = S.driver(dur, (lt) => { window.__film && (window.__film.lastT = lt); frame(lt); });
    window.__timelines = window.__timelines || {}; window.__timelines[id] = tl;
    window.__film = { id, start, end, dur, frame };
    return tl;
  }
  const VIGNETTE = rect(0, 0, W, H, 'url(#vig)');
  function DEFS() {
    const rg = (id, c, o0 = 0.55) => `<radialGradient id="glow-${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${c}" stop-opacity="${o0}"/><stop offset="0.45" stop-color="${c}" stop-opacity="${o0 * 0.35}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
    return `<defs>${rg('amber', '#FFC145')}${rg('violet', '#7B6CFF', 0.5)}${rg('coral', '#FF6B6B', 0.5)}${rg('mint', '#45D6B5', 0.5)}${rg('white', '#FFF3D6', 0.7)}${rg('sky', '#6FA8FF', 0.5)}
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stop-color="#05061A" stop-opacity="0"/><stop offset="1" stop-color="#05061A" stop-opacity="0.62"/></radialGradient>
      <linearGradient id="paperG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF8EA"/><stop offset="1" stop-color="#E9DECB"/></linearGradient>
      <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE7A3"/><stop offset="1" stop-color="#E9B95A"/></linearGradient>
      <linearGradient id="winG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F2458"/><stop offset="1" stop-color="#151943"/></linearGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061A" stop-opacity="0"/><stop offset="1" stop-color="#05061A" stop-opacity="0.55"/></linearGradient></defs>`;
  }

  // the project's sections come from assets/sections.js: window.FILM_SECTIONS = { s00: [0, 24], s01: [24, 56.6], ... }
  const SECTIONS = window.FILM_SECTIONS || {};
  // section(id): its time range; a test copy of a composition can set data-t0 / data-t1 on #root to render a slice
  function section(id) {
    const root = document.getElementById('root'), cid = root.getAttribute('data-composition-id');
    if (!SECTIONS[id]) throw new Error(`film.js: section ${id} is missing from assets/sections.js (window.FILM_SECTIONS)`);
    const [a, b] = SECTIONS[id];
    if (root.hasAttribute('data-t0')) return { id: cid, start: +root.getAttribute('data-t0'), end: +root.getAttribute('data-t1'), a, b };
    return { id, start: a, end: b, a, b };
  }
  window.FILM = { section, SECTIONS, measure, W, H, E, kf, mix, ease, seg, clamp, lerp, esc, f, at, el, G, tr, rect, circ, ell, path, line, text, glow, C, hex, rgb, cmix, ckf, sky, skyCols, motes, camT, drift, L, phrase, tag, vo, wordAt, cue, run, R: S.mulberry32, hash: S.hash };
})();
