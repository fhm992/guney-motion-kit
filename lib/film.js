// FILM: the paper-cut film engine. Shots with a parallax camera, paper puppets that act, props, labels, UI screens,
// transitions and sound cues. Every composition works in GLOBAL voiceover seconds; F.init(id, start, dur) maps them.
(() => {
  const PA = PAPER, C = PA.C, S = STAGE, E = S.E;
  const F = { C, P: PA.P, T: PA.T };
  let START = 0, DUR = 0, tl = null, stage = null, overlay = null, ID = '';
  const shots = [], fns = [];
  window.__SFX = [];
  const rel = (g) => Math.max(0, g - START);
  F.rel = rel;

  // ---------------- words from the voiceover ----------------
  const WORDS = (window.VO && window.VO.captions.words) || [];
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9%]/g, '');
  F.w = (word, after = -1) => { const n = norm(word); const x = WORDS.find((w) => w.s >= after && norm(w.w) === n && w.s < after + 6) || WORDS.find((w) => w.s >= after - 2 && norm(w.w) === n); if (!x) throw new Error('word not found: ' + word + ' after ' + after); return x.s; };
  F.we = (word, after = -1) => { const n = norm(word); const x = WORDS.find((w) => w.s >= after && norm(w.w) === n && w.s < after + 6) || WORDS.find((w) => w.s >= after - 2 && norm(w.w) === n); if (!x) throw new Error('word not found: ' + word); return x.e; };
  F.p = (phrase, after = -1) => { const ps = phrase.split(/\s+/).map(norm); for (let i = 0; i < WORDS.length; i++) { if (WORDS[i].s < after) continue; if (ps.every((p, k) => WORDS[i + k] && norm(WORDS[i + k].w) === p)) return WORDS[i].s; } throw new Error('phrase not found: ' + phrase); };
  F.pe = (phrase, after = -1) => { const ps = phrase.split(/\s+/).map(norm); for (let i = 0; i < WORDS.length; i++) { if (WORDS[i].s < after) continue; if (ps.every((p, k) => WORDS[i + k] && norm(WORDS[i + k].w) === p)) return WORDS[i + ps.length - 1].e; } throw new Error('phrase not found: ' + phrase); };

  // ---------------- init / done ----------------
  F.init = (id, start, dur) => {
    ID = id; START = start; DUR = dur;
    PA.defs();
    ['500 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter', '800 40px "Bricolage Grotesque"', '400 40px "Archivo Black"', '700 40px Caveat', '400 40px "Instrument Serif"'].forEach((f) => document.fonts.load(f));
    const root = document.getElementById('root');
    stage = document.getElementById('stage');
    Object.assign(stage.style, { position: 'absolute', inset: '0', overflow: 'hidden', background: C.paper });
    overlay = document.createElement('div'); Object.assign(overlay.style, { position: 'absolute', inset: '0', zIndex: 50, pointerEvents: 'none' }); stage.appendChild(overlay); const vig = document.createElement('div'); Object.assign(vig.style, { position: 'absolute', inset: '0', zIndex: 49, pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(42,29,18,.24) 100%)' }); stage.appendChild(vig);
    tl = S.driver(dur, frame);
    F.tl = tl;
    return F;
  };
  // chunked rendering: data-chunk-off = seconds into the scene, data-scene-dur = full scene length
  let CHUNK = 0;
  F.boot = () => { const r = document.getElementById('root'); CHUNK = +(r.dataset.chunkOff || 0); return F.init(r.dataset.compositionId, +r.dataset.voStart, +(r.dataset.sceneDur || r.dataset.duration)); };
  F.done = () => {
    frame(0); window.__timelines = window.__timelines || {};
    if (!CHUNK) { window.__timelines[ID] = tl; return; }
    const D = +document.getElementById('root').dataset.duration;
    const wrap = gsap.timeline({ paused: true }); wrap.add(tl.tweenFromTo(CHUNK, CHUNK + D, { ease: 'none' }), 0);
    window.__timelines[ID] = wrap; tl.time(CHUNK); frame(CHUNK);
    window.addEventListener('hf-seek', () => frame(tl.time()));   // runs after the driver's own (chunk-local) redraw
  };

  // ---------------- per-frame ----------------
  function frame(t) {
    const G = START + t;
    for (const sh of shots) {
      const vis = G >= sh.a && G < sh.b;
      if (vis !== sh.vis) { sh.el.style.display = vis ? 'block' : 'none'; sh.vis = vis; }
      if (vis) camApply(sh, G);
    }
    for (const f of fns) if (!f.shot || f.shot.vis) f.fn(G);
  }
  F.every = (shot, fn) => fns.push({ shot, fn });

  // ---------------- shots and camera ----------------
  F.shot = (a, b, o = {}) => {
    const el = document.createElement('div'); Object.assign(el.style, { position: 'absolute', inset: '0', overflow: 'hidden', display: 'none' });
    PA.ground(el, o.bg || C.paper); stage.insertBefore(el, overlay);
    const mk = (d) => { const l = document.createElement('div'); Object.assign(l.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', transformOrigin: '0 0' }); el.appendChild(l); l.depth = d; return l; };
    const sh = { el, a, b, vis: false, keys: [], shakes: [], seed: (a * 7.13) % 6.28, drift: o.drift ?? 1, init: o.cam || [960, 540, 1] };
    sh.back = mk(o.backDepth ?? 0.82); sh.mid = mk(1); sh.front = mk(o.frontDepth ?? 1.16);
    sh.layers = [sh.back, sh.mid, sh.front];
    sh.ui = document.createElement('div'); Object.assign(sh.ui.style, { position: 'absolute', inset: 0 }); el.appendChild(sh.ui); // screen-fixed layer
    sh.cam = (t, cx, cy, s = 1, dur = 1.2, ease = 'inOutCubic') => { sh.keys.push({ t, cx, cy, s, dur, ease }); sh.keys.sort((x, y) => x.t - y.t); return sh; };
    sh.shake = (t, amp = 14) => { sh.shakes.push({ t, amp }); return sh; };
    shots.push(sh); return sh;
  };
  function camState(sh, G) {
    let [cx, cy, s] = sh.init;
    for (const k of sh.keys) { if (G < k.t) break; const u = E[k.ease](S.clamp((G - k.t) / k.dur)); cx = S.lerp(cx, k.cx, u); cy = S.lerp(cy, k.cy, u); s = S.lerp(s, k.s, u); }
    const d = sh.drift, ph = sh.seed;
    cx += d * 7 * Math.sin(G * 0.29 + ph); cy += d * 4 * Math.sin(G * 0.21 + ph * 1.7); s *= 1 + d * 0.006 * Math.sin(G * 0.17 + ph);
    for (const k of sh.shakes) { const q = G - k.t; if (q >= 0 && q < 0.6) { const e = Math.exp(-q / 0.12) * k.amp; cx += e * Math.sin(q * 70); cy += e * 0.7 * Math.cos(q * 55); } }
    return [cx, cy, s];
  }
  function camApply(sh, G) {
    const [cx, cy, s] = camState(sh, G);
    for (const l of sh.layers) { const d = l.depth, sl = 1 + (s - 1) * d, lx = 960 + (cx - 960) * d, ly = 540 + (cy - 540) * d;
      l.style.transform = `translate(${(960 - lx * sl).toFixed(2)}px, ${(540 - ly * sl).toFixed(2)}px) scale(${sl.toFixed(5)})`; }
  }

  // ---------------- transitions ----------------
  // a torn sheet of paper sweeps across; switch shots at time t (covered then)
  F.wipe = (t, dir = 1, color = C.paper2) => {
    const w = document.createElement('div'); Object.assign(w.style, { position: 'absolute', top: '-40px', left: 0, width: '2600px', height: '1160px', willChange: 'transform', filter: 'drop-shadow(-14px 0 18px rgba(40,30,20,.28)) drop-shadow(14px 0 18px rgba(40,30,20,.28))' });
    const inner = document.createElement('div'); Object.assign(inner.style, { position: 'absolute', inset: 0 }); PA.ground(inner, color);
    let pts = []; const R = S.mulberry32(Math.round(t * 100)); for (let y = 0; y <= 100; y += 4) pts.push(`${2 + R() * 2.2}% ${y}%`); let pts2 = []; for (let y = 100; y >= 0; y -= 4) pts2.push(`${96 + R() * 2.2}% ${y}%`);
    inner.style.clipPath = `polygon(${pts.concat(pts2).join(',')})`; w.appendChild(inner); overlay.appendChild(w);
    const from = dir > 0 ? 2000 : -2700, to = dir > 0 ? -2700 : 2000;
    tl.fromTo(w, { x: from }, { x: to, duration: 1.0, ease: 'power2.inOut', immediateRender: true }, rel(t - 0.5));
    F.sfx(t - 0.42, 'whoosh', 0.5); F.sfx(t - 0.3, 'paperslide', 0.5);
  };
  // dip to paper (fade through cream)
  F.dip = (t, d = 0.5, color = C.paper) => {
    const w = document.createElement('div'); Object.assign(w.style, { position: 'absolute', inset: 0, opacity: 0 }); PA.ground(w, color); overlay.appendChild(w);
    tl.to(w, { opacity: 1, duration: d / 2, ease: 'power1.in' }, rel(t - d / 2)); tl.to(w, { opacity: 0, duration: d / 2, ease: 'power1.out' }, rel(t));
  };

  // ---------------- sound ----------------
  F.sfx = (t, name, gain = 1) => { window.__SFX.push({ t: +t.toFixed(3), name, gain }); };

  // ---------------- props ----------------
  // an SVG prop drawn around (0,0); placed centred at cx,cy in a w x h box
  F.prop = (parent, html, cx, cy, w, h, z = 0, origin = '50% 50%') => {
    const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: (cx - w / 2) + 'px', top: (cy - h / 2) + 'px', width: w + 'px', height: h + 'px', zIndex: z, transformOrigin: origin });
    d.innerHTML = `<svg width="${w}" height="${h}" viewBox="${-w / 2} ${-h / 2} ${w} ${h}" style="overflow:visible;position:absolute;left:0;top:0">${html}</svg>`;
    parent.appendChild(d); return d;
  };
  // an SVG drawn in frame coordinates (static set dressing)
  F.set = (parent, html, z = 0) => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', zIndex: z });
    d.innerHTML = `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="overflow:visible">${html}</svg>`; parent.appendChild(d); return d; };
  F.html = (parent, html, x, y, w, h, z = 0, style = {}) => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: w ? w + 'px' : 'auto', height: h ? h + 'px' : 'auto', zIndex: z }, style); d.innerHTML = html; parent.appendChild(d); return d; };

  // rough paper clip path
  F.rough = (seed, j = 1.2) => { const R = S.mulberry32(seed), p = []; for (let x = 0; x <= 100; x += 10) p.push(`${x}% ${R() * j}%`); for (let y = 0; y <= 100; y += 20) p.push(`${100 - R() * j * 0.6}% ${y}%`); for (let x = 100; x >= 0; x -= 10) p.push(`${x}% ${100 - R() * j}%`); for (let y = 100; y >= 0; y -= 20) p.push(`${R() * j * 0.6}% ${y}%`); return `polygon(${p.join(',')})`; };
  let seedN = 1;
  // a cut-paper label: text on a strip of paper. (x,y) = centre
  F.label = (parent, text, x, y, o = {}) => {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, { position: 'absolute', left: x + 'px', top: y + 'px', zIndex: o.z || 5, filter: o.flat ? 'none' : 'drop-shadow(3px 6px 6px rgba(40,30,20,.30))' }); gsap.set(wrap, { xPercent: -50, yPercent: -50 });
    const box = document.createElement('div'); const size = o.size || 72;
    Object.assign(box.style, { position: 'relative', padding: o.pad || `${size * 0.22}px ${size * 0.42}px`, background: o.bg || C.navy, color: o.color || C.white, font: `${o.weight || 800} ${size}px/1.05 ${o.font || "'Bricolage Grotesque'"}`, whiteSpace: 'nowrap', clipPath: o.bg === 'none' ? 'none' : F.rough(seedN++), letterSpacing: o.ls || '0', transform: `rotate(${o.rot || 0}deg)`, textAlign: 'center' });
    if (o.bg === 'none') box.style.background = 'none'; else if (!o.plain) { box.style.backgroundImage = paperTex(); }
    box.innerHTML = text; wrap.appendChild(box); parent.appendChild(wrap); wrap.box = box; return wrap;
  };
  const paperTex = () => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0'/></filter><rect width='300' height='300' filter='url(%23f)'/></svg>")`;
  F.paperTex = paperTex;
  F.hand = (parent, text, x, y, size = 60, color = C.tomato2, rot = 0, z = 6) => F.label(parent, text, x, y, { bg: 'none', font: 'Caveat', weight: 700, size, color, rot, z, flat: true });


  // ---------------- reusable paper props (drawn around 0,0) ----------------
  const TT = PA.T;
  F.K = {
    card: (text, fill = C.navy, w = 180, h = 120, txt = C.white, size = 36) => `<g filter="url(#cut)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${fill}"/>${String(text).split('|').map((l, i, a) => TT(l, 0, (i - (a.length - 1) / 2) * size * 0.95 + size * 0.32, size, txt, 'Caveat')).join('')}</g>`,
    magnifier: (r = 70) => `<g filter="url(#cut)"><rect x="${r * 0.62}" y="${r * 0.62}" width="${r * 0.36}" height="${r * 1.3}" rx="${r * 0.16}" fill="${C.kraft2}" transform="rotate(-45 ${r * 0.8} ${r * 0.8})"/><circle r="${r}" fill="${N}"/><circle r="${r * 0.8}" fill="#DCE9EC" opacity=".85"/><path d="M${-r * 0.45} ${-r * 0.2} q${r * 0.2} ${-r * 0.35} ${r * 0.5} ${-r * 0.35}" stroke="#fff" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round"/></g>`,
    scissors: () => `<g filter="url(#cut)"><circle cx="-22" cy="40" r="22" fill="none" stroke="${N}" stroke-width="10"/><circle cx="22" cy="40" r="22" fill="none" stroke="${N}" stroke-width="10"/><path d="M-14 20 L30 -70 M14 20 L-30 -70" stroke="${C.grey2}" stroke-width="12" stroke-linecap="round"/></g>`,
    brick: (color, w = 114, h = 58) => P.brick(-w / 2, -h / 2, color, w, h),
    calendar: (top, big, sub = '') => `<g filter="url(#cut)"><rect x="-130" y="-140" width="260" height="280" rx="12" fill="${C.white}"/><rect x="-130" y="-140" width="260" height="70" rx="12" fill="${C.tomato}"/><rect x="-130" y="-90" width="260" height="20" fill="${C.tomato}"/><circle cx="-70" cy="-140" r="10" fill="${N}"/><circle cx="70" cy="-140" r="10" fill="${N}"/>${TT(top, 0, -88, 38, C.white)}${TT(big, 0, 40, 92, N)}${sub ? TT(sub, 0, 104, 40, C.tomato2, 'Caveat') : ''}</g>`,
    paycheck: (text = '$ PAY', fill = '#DDEBD9', ink = C.sage2) => `<g filter="url(#cut)"><rect x="-150" y="-70" width="300" height="140" fill="${fill}"/><rect x="-130" y="-50" width="120" height="14" fill="${ink}"/>${TT(text, 50, 30, 46, ink)}<rect x="-130" y="40" width="160" height="6" fill="${ink}"/></g>`,
    clock: (r = 100) => `<g filter="url(#cut)"><circle r="${r}" fill="${N}"/><circle r="${r * 0.86}" fill="${C.white}"/>${[...Array(12)].map((_, i) => `<rect x="-3" y="${-r * 0.8}" width="6" height="${r * 0.12}" fill="${N}" transform="rotate(${i * 30})"/>`).join('')}</g>`,
    hand: (len, col = N, w = 8) => `<path d="M0 0 L0 ${-len}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><circle r="${w}" fill="${N}"/>`,
    star: (r = 30, col = C.gold) => `<path d="${[...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); }).join(' ')}Z" fill="${col}" filter="url(#cut)"/>`,
    cloud: (w = 300, col = C.grey2) => `<g filter="url(#cut)"><ellipse cx="0" cy="0" rx="${w * 0.5}" ry="${w * 0.2}" fill="${col}"/><ellipse cx="${-w * 0.18}" cy="${-w * 0.12}" rx="${w * 0.24}" ry="${w * 0.2}" fill="${col}"/><ellipse cx="${w * 0.14}" cy="${-w * 0.16}" rx="${w * 0.26}" ry="${w * 0.24}" fill="${col}"/></g>`,
    bubble: (w, h, fill = C.white) => `<g filter="url(#cut)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(40, h / 3)}" fill="${fill}"/><path d="M${-w / 2 + 40} ${h / 2 - 4} l-22 40 l60 -40z" fill="${fill}"/></g>`,
    thought: (w, h) => `<g filter="url(#cut)"><ellipse rx="${w / 2}" ry="${h / 2}" fill="${C.white}"/><circle cx="${-w * 0.32}" cy="${h / 2 + 26}" r="22" fill="${C.white}"/><circle cx="${-w * 0.4}" cy="${h / 2 + 68}" r="12" fill="${C.white}"/></g>`,
    coin: (r = 40, txt = '$') => `<g filter="url(#cut)"><circle r="${r}" fill="${C.gold}"/><circle r="${r * 0.78}" fill="none" stroke="#C99230" stroke-width="4"/>${TT(txt, 0, r * 0.36, r, '#8a5d12')}</g>`,
    cup: () => `<g filter="url(#cut)"><path d="M-26 0 L-30 -86 L30 -86 L26 0Z" fill="${C.white}"/><rect x="-30" y="-60" width="60" height="22" fill="${C.kraft2}"/><rect x="-32" y="-96" width="64" height="12" rx="4" fill="${N}"/></g>`,
  };
  const P = PA.P;

  // ---------------- motion helpers (global times) ----------------
  const OFF = { below: [0, 160], above: [0, -160], left: [-200, 0], right: [200, 0], none: [0, 0] };
  F.in = (el, t, from = 'below', o = {}) => {
    const [dx, dy] = OFF[from] || OFF.below, k = o.dist ?? 1, r = o.rot ?? (from === 'left' ? -8 : from === 'right' ? 8 : from === 'below' ? 4 : -4);
    const fromV = { opacity: 0, x: dx * k, y: dy * k, rotation: r, scale: o.scale ?? (from === 'none' ? 0.85 : 1) };
    tl.fromTo(el, fromV, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: o.dur || 0.5, ease: o.ease || 'power3.out', immediateRender: true }, rel(t));
    if (o.sfx !== false) F.sfx(t, o.sfx || (from === 'none' ? 'pop' : 'paperslide'), o.gain ?? 0.5);
    return t + (o.dur || 0.5);
  };
  F.out = (el, t, to = 'below', o = {}) => { const [dx, dy] = OFF[to] || OFF.below, k = o.dist ?? 1.3; tl.to(el, { opacity: 0, x: dx * k, y: dy * k, rotation: o.rot ?? 0, duration: o.dur || 0.4, ease: 'power2.in' }, rel(t)); };
  F.to = (el, t, vars, dur = 0.5, ease = 'power2.inOut') => { tl.to(el, Object.assign({ duration: dur, ease }, vars), rel(t)); };
  F.fromTo = (el, t, a, b, dur = 0.5, ease = 'power3.out') => { tl.fromTo(el, a, Object.assign({ duration: dur, ease, immediateRender: true }, b), rel(t)); };
  F.show = (el, t) => tl.set(el, { opacity: 1 }, rel(t));
  F.hide = (el, t) => tl.set(el, { opacity: 0 }, rel(t));
  F.hidden = (el) => tl.set(el, { opacity: 0 }, 0);
  // word-by-word build of a label's text
  F.words = (lbl, t, gap = 0.12, o = {}) => { const box = lbl.box || lbl; const ws = box.innerHTML.split(' '); box.innerHTML = ws.map((w) => `<span style="display:inline-block">${w}</span>`).join(' ');
    const sp = [...box.children]; sp.forEach((s, i) => tl.fromTo(s, { opacity: 0, y: o.dy ?? 40, rotation: o.rot ?? 3 }, { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: 'power3.out', immediateRender: true }, rel(t + i * gap))); return t + sp.length * gap; };
  // count a number in a text element
  F.count = (shot, el, a, b, from, to, fmt = (v) => Math.round(v)) => F.every(shot, (G) => { const u = E.outCubic(S.seg(G, a, b)); el.textContent = fmt(S.lerp(from, to, u)); });

  // ---------------- puppets ----------------
  const LOOK = {
    you: { top: C.navy, top2: C.navy2, skin: C.skin1, hair: C.hair1, hairStyle: 'short', collar: C.white, cardigan: true },
    manager: { top: C.tomato2, top2: C.tomato, skin: C.skin2, hair: C.hair2, hairStyle: 'bob', collar: C.white, blazer: true },
    grey: { top: C.grey2, top2: C.grey, skin: '#CFC6B8', hair: C.grey2, hairStyle: 'short', collar: C.grey },
    client: { top: C.sage2, top2: C.sage, skin: C.skin3, hair: C.hair3, hairStyle: 'side', collar: C.white },
    exec: { top: C.navy, top2: C.navy2, skin: C.skin3, hair: C.grey, hairStyle: 'bald', collar: C.white, tie: C.tomato },
    co1: { top: C.kraft2, top2: C.kraft, skin: C.skin2, hair: C.hair1, hairStyle: 'bun', collar: C.white },
    co2: { top: C.sage2, top2: C.sage, skin: C.skin1, hair: C.hair3, hairStyle: 'short', collar: C.white },
    newhire: { top: C.gold, top2: '#C99230', skin: C.skin3, hair: C.hair2, hairStyle: 'side', collar: C.white },
    teacher: { top: C.sage2, top2: C.sage, skin: C.skin3, hair: C.grey, hairStyle: 'bun', collar: C.white }
  };
  if (C.orange) { LOOK.manager.top = C.orange; LOOK.manager.top2 = C.orange2 || C.orange; }
  if (C.blue) { LOOK.you.top = C.blue; LOOK.you.top2 = C.blueDark || C.blue; }
  F.LOOK = LOOK;
  const N = C.ink || C.navy;   // dark ink for faces, legs, laptops (a palette may recolour navy surfaces)
  function hairPath(style, color) {
    return {
      short: `<path d="M-56 -270 Q-62 -340 4 -344 Q62 -340 58 -282 Q30 -300 -6 -296 Q-30 -296 -44 -262 Z" fill="${color}"/>`,
      bob: `<path d="M-60 -250 Q-66 -340 2 -342 Q68 -340 60 -250 L44 -230 Q48 -290 20 -300 Q-10 -284 -44 -290 Q-48 -260 -46 -230 Z" fill="${color}"/>`,
      side: `<path d="M-54 -262 Q-60 -338 6 -342 Q60 -338 56 -270 Q50 -304 -20 -300 Q-44 -290 -48 -250 Z" fill="${color}"/>`,
      bun: `<circle cx="0" cy="-350" r="26" fill="${color}"/><path d="M-54 -262 Q-58 -336 0 -338 Q58 -336 54 -262 Q40 -300 0 -302 Q-40 -300 -54 -262 Z" fill="${color}"/>`,
      bald: `<path d="M-54 -262 Q-56 -290 -46 -296 L-40 -260 Z M54 -262 Q56 -290 46 -296 L40 -260 Z" fill="${color}"/>`
    }[style];
  }
  function face(mood, blink, cx = 0, cy = -262) {
    const closed = `<path d="M${cx - 25} ${cy + 1} q8 5 16 0 M${cx + 9} ${cy + 1} q8 5 16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const eyesBy = {
      shock: `<circle cx="${cx - 17}" cy="${cy}" r="9" fill="${C.white}" stroke="${N}" stroke-width="3"/><circle cx="${cx + 17}" cy="${cy}" r="9" fill="${C.white}" stroke="${N}" stroke-width="3"/><circle cx="${cx - 17}" cy="${cy}" r="3.5" fill="${N}"/><circle cx="${cx + 17}" cy="${cy}" r="3.5" fill="${N}"/>`,
      tired: `<path d="M${cx - 25} ${cy} h16 M${cx + 9} ${cy} h16" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
      happy: `<path d="M${cx - 25} ${cy + 3} q8 -10 16 0 M${cx + 9} ${cy + 3} q8 -10 16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      wink: `<ellipse cx="${cx - 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><path d="M${cx + 9} ${cy + 2} q8 -8 16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      side: `<ellipse cx="${cx - 11}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><ellipse cx="${cx + 23}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/>`,
      sideL: `<ellipse cx="${cx - 23}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><ellipse cx="${cx + 11}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/>`
    };
    const base = `<ellipse cx="${cx - 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><ellipse cx="${cx + 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/>`;
    const eyeKey = mood === 'look' ? 'side' : mood === 'lookL' ? 'sideL' : mood;
    let eyes = eyesBy[eyeKey] || base; if (blink && !['tired', 'happy'].includes(mood)) eyes = closed;
    const browKey = (mood === 'sad' || mood === 'worry') ? 'worry' : mood;
    const brows = { worry: `<path d="M${cx - 30} ${cy - 16} L${cx - 8} ${cy - 25} M${cx + 8} ${cy - 25} L${cx + 30} ${cy - 16}" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
      angry: `<path d="M${cx - 30} ${cy - 24} L${cx - 8} ${cy - 14} M${cx + 8} ${cy - 14} L${cx + 30} ${cy - 24}" stroke="${N}" stroke-width="6" stroke-linecap="round"/>`,
      shock: `<path d="M${cx - 30} ${cy - 26} q11 -8 22 0 M${cx + 8} ${cy - 26} q11 -8 22 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      sly: `<path d="M${cx - 30} ${cy - 18} L${cx - 8} ${cy - 22} M${cx + 8} ${cy - 26} L${cx + 30} ${cy - 18}" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` }[browKey] || '';
    const my = cy + 26;
    const mouth = {
      smile: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      happy: `<path d="M${cx - 18} ${my - 2} Q${cx} ${my + 22} ${cx + 18} ${my - 2} Z" fill="${N}"/>`,
      wink: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      sly: `<path d="M${cx - 14} ${my + 2} Q${cx + 4} ${my + 10} ${cx + 18} ${my - 4}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      sad: `<path d="M${cx - 15} ${my + 6} Q${cx} ${my - 6} ${cx + 15} ${my + 6}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      worry: `<path d="M${cx - 14} ${my + 4} q7 -6 14 0 q7 6 14 0" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      gulp: `<ellipse cx="${cx}" cy="${my + 4}" rx="7" ry="5" fill="${N}"/>`,
      shock: `<ellipse cx="${cx}" cy="${my + 4}" rx="9" ry="12" fill="${N}"/>`,
      angry: `<path d="M${cx - 18} ${my + 6} h36" stroke="${N}" stroke-width="6" stroke-linecap="round"/>`,
      tired: `<path d="M${cx - 10} ${my + 4} h20" stroke="${N}" stroke-width="4.5" stroke-linecap="round"/>`,
      yawn: `<ellipse cx="${cx}" cy="${my + 8}" rx="13" ry="17" fill="${N}"/>`
    }[mood] || `<path d="M${cx - 12} ${my} Q${cx} ${my + 6} ${cx + 12} ${my}" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const cheeks = ['happy', 'smile', 'wink', 'sly'].includes(mood) ? `<circle cx="${cx - 34}" cy="${cy + 18}" r="8" fill="${C.tomato}" opacity=".35"/><circle cx="${cx + 34}" cy="${cy + 18}" r="8" fill="${C.tomato}" opacity=".35"/>` : '';
    const red = mood === 'angry' ? `<ellipse cx="${cx}" cy="${cy + 6}" rx="48" ry="44" fill="${C.tomato}" opacity=".35"/>` : '';
    const sweat = mood === 'shock' || mood === 'worry' ? '' : '';
    return red + eyes + brows + mouth + cheeks + sweat;
  }
  const svgBox = (vx, vy, w, h, inner) => `<svg width="${w}" height="${h}" viewBox="${vx} ${vy} ${w} ${h}" style="position:absolute;left:0;top:0;overflow:visible">${inner}</svg>`;
  const abs = (l, t, w, h, origin) => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px', transformOrigin: origin || '50% 50%' }); return d; };

  function personBody(L, o) {
    return `<g filter="url(#cut)"><rect x="-44" y="-40" width="34" height="42" fill="${o.legs || N}"/><rect x="10" y="-40" width="34" height="42" fill="${o.legs || N}"/></g>
      <g filter="url(#cut)"><path d="M-66 -30 L-60 -150 Q-58 -190 -20 -196 L20 -196 Q58 -190 60 -150 L66 -30 Z" fill="${L.top}"/>
      <path d="M-15 -196 L0 -156 L15 -196 Z" fill="${L.collar}"/>
      ${L.cardigan ? `<path d="M-4 -156 L-4 -34" stroke="${L.top2}" stroke-width="5"/><circle cx="-4" cy="-120" r="4" fill="${C.kraft}"/><circle cx="-4" cy="-82" r="4" fill="${C.kraft}"/>` : ''}
      ${L.blazer ? `<path d="M-15 -196 L-28 -110 L0 -150 Z M15 -196 L28 -110 L0 -150 Z" fill="${L.top2}"/>` : ''}
      ${L.tie ? `<path d="M0 -190 L-8 -110 L0 -96 L8 -110 Z" fill="${L.tie}"/>` : ''}${o.badge || ''}</g>`;
  }
  function personHead(L, mood, blink, o) {
    return `<g filter="url(#cut)"><rect x="-13" y="-214" width="26" height="26" fill="${L.skin}"/>
      <path d="M-52 -268 Q-54 -322 0 -326 Q54 -322 52 -268 Q50 -214 0 -208 Q-50 -214 -52 -268 Z" fill="${L.skin}"/>
      ${hairPath(L.hairStyle, L.hair)}${face(mood, blink)}
      ${o.sweat ? `<path d="M50 -300 q10 18 0 24 q-10 -6 0 -24z" fill="#9CC3D8"/>` : ''}${o.headExtra || ''}</g>`;
  }
  function internBody(o) {
    return `<g filter="url(#cut)"><rect x="-44" y="-40" width="16" height="40" rx="6" fill="${N}"/><rect x="28" y="-40" width="16" height="40" rx="6" fill="${N}"/>
      <rect x="-62" y="-150" width="124" height="116" rx="26" fill="${o.color || C.tomato}"/>
      <path d="M-22 -150 L0 -112 L22 -150" stroke="${N}" stroke-width="4" fill="none"/><rect x="-18" y="-112" width="36" height="46" rx="5" fill="${C.white}"/>
      <rect x="-12" y="-104" width="24" height="5" fill="${N}"/><rect x="-12" y="-94" width="18" height="4" fill="${C.grey}"/><rect x="-12" y="-86" width="22" height="4" fill="${C.grey}"/>${o.badge || ''}</g>`;
  }
  function internHead(mood, blink, o) {
    let eyes = mood === 'twitch' ? `<circle cx="-24" cy="-226" r="21" fill="${N}"/><circle cx="24" cy="-226" r="12" fill="${N}"/><circle cx="-18" cy="-233" r="6" fill="${C.white}"/><circle cx="28" cy="-231" r="4" fill="${C.white}"/>`
      : (mood === 'proud' || mood === 'happy') ? `<path d="M-40 -222 q16 -16 32 0 M8 -222 q16 -16 32 0" stroke="${N}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      : mood === 'sad' ? `<circle cx="-24" cy="-222" r="15" fill="${N}"/><circle cx="24" cy="-222" r="15" fill="${N}"/><path d="M-44 -246 l28 8 M44 -246 l-28 8" stroke="${N}" stroke-width="5"/>`
      : `<circle cx="-24" cy="-226" r="17" fill="${N}"/><circle cx="24" cy="-226" r="17" fill="${N}"/><circle cx="-19" cy="-232" r="5" fill="${C.white}"/><circle cx="29" cy="-232" r="5" fill="${C.white}"/>`;
    if (blink && mood !== 'proud' && mood !== 'happy') eyes = `<path d="M-40 -226 h32 M8 -226 h32" stroke="${N}" stroke-width="7" stroke-linecap="round"/>`;
    const mouth = (mood === 'proud' || mood === 'happy') ? `<path d="M-16 -202 Q0 -186 16 -202 Z" fill="${N}"/>` : mood === 'sad' ? `<path d="M-12 -194 Q0 -204 12 -194" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>` : mood === 'shock' ? `<ellipse cx="0" cy="-198" rx="8" ry="10" fill="${N}"/>` : `<path d="M-12 -200 Q0 -192 12 -200" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return `<g filter="url(#cut)"><rect x="-8" y="-172" width="16" height="26" fill="${N}"/>
      <rect x="-76" y="-282" width="152" height="114" rx="34" fill="${o.color || C.tomato}"/><rect x="-58" y="-264" width="116" height="78" rx="22" fill="${C.white}"/>
      ${eyes}${mouth}<path d="M0 -282 L0 -312" stroke="${N}" stroke-width="5"/><circle cx="0" cy="-318" r="10" fill="${C.gold}"/>${o.headExtra || ''}</g>`;
  }
  const armSVG = (L, sleeve, skin, w = 34) => `<g filter="url(#cut)"><path d="M0 0 L0 ${L}" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round"/><circle cx="0" cy="${L}" r="${w / 2}" fill="${skin}"/></g>`;
  F.A = { down: 6, hip: 26, out: 62, fwd: 82, point: 96, wave: 140, up: 168, in: -18, type: -30, hold: 40, high: 125 };

  // kind: you | manager | grey | client | exec | co1 | co2 | newhire | intern
  F.puppet = (shot, layer, kind, x, y, s = 1, o = {}) => { let p0sh = null;
    const isI = kind === 'intern', L = Object.assign({}, LOOK[kind] || LOOK.you, o.look || {});
    const root = abs(x, y, 0, 0, '0 0'); root.style.zIndex = o.z || 3; (layer || shot.mid).appendChild(root);
    if (!o.noShadow) { const sh = abs(-85 * s, -16 * s, 170 * s, 30 * s); sh.style.background = 'radial-gradient(ellipse at 50% 50%, rgba(42,29,18,.38), rgba(42,29,18,0) 70%)'; root.appendChild(sh); p0sh = sh; } const rig = abs(0, 0, 0, 0, '0 0'); rig.style.transform = `scale(${o.flip ? -s : s}, ${s})`; root.appendChild(rig);
    const bob = abs(0, 0, 0, 0, '0 0'); rig.appendChild(bob);
    const p = { root, rig, bob, kind, moods: [[-1e9, o.mood || 'neutral']], heads: {}, waves: [], walks: [], nods: [], shakesH: [], seed: (x * 0.37 + y * 0.11) % 5, shot };
    const body = abs(isI ? -75 : -80, isI ? -160 : -210, isI ? 150 : 160, isI ? 165 : 222); body.innerHTML = svgBox(isI ? -75 : -80, isI ? -160 : -210, isI ? 150 : 160, isI ? 165 : 222, isI ? internBody(o) : personBody(L, o)); bob.appendChild(body);
    const mkArm = (side) => { const sx = isI ? side * 56 : side * 48, sy = isI ? -130 : -178, len = isI ? 104 : 136;
      const piv = abs(sx - 30, sy - 25, 60, len + 50, '30px 25px'); const wob = abs(0, 0, 60, len + 50, '30px 25px'); piv.appendChild(wob);
      wob.innerHTML = svgBox(-30, -25, 60, len + 50, armSVG(len, isI ? C.tomato2 : L.top2, isI ? C.tomato2 : L.skin, isI ? 28 : 34)); bob.appendChild(piv); return { piv, wob, side }; };
    p.armL = mkArm(-1); p.armR = mkArm(1);
    const hv = isI ? [-90, -340, 180, 180] : [-80, -380, 160, 190];
    p.headPiv = abs(hv[0], hv[1], hv[2], hv[3], isI ? '90px 175px' : '80px 180px'); p.headWob = abs(0, 0, hv[2], hv[3], isI ? '90px 175px' : '80px 180px'); p.headPiv.appendChild(p.headWob); bob.appendChild(p.headPiv);
    if (o.front) { const fr = abs(-200, -400, 400, 420); fr.innerHTML = svgBox(-200, -400, 400, 420, o.front); bob.appendChild(fr); }
    const headFor = (m, b) => { const k = m + (b ? '_b' : ''); if (!p.heads[k]) { const d = abs(0, 0, hv[2], hv[3]); d.style.display = 'none'; d.innerHTML = svgBox(hv[0], hv[1], hv[2], hv[3], isI ? internHead(m, b, o) : personHead(L, m, b, o)); p.headWob.appendChild(d); p.heads[k] = d; } return p.heads[k]; };
    p.cur = null;
    const setArm = (a, ang) => tl.set(a.piv, { rotation: -a.side * ang }, 0);
    setArm(p.armL, F.A[o.armL || 'down'] ?? o.armL); setArm(p.armR, F.A[o.armR || 'down'] ?? o.armR);
    p.mood = (t, m) => { headFor(m, false); headFor(m, true); p.moods.push([t, m]); p.moods.sort((a, b) => a[0] - b[0]); return p; };
    p.mood(-1e9, o.mood || 'neutral');
    p.arm = (t, side, pose, dur = 0.4, ease = 'power2.inOut') => { const a = side === 'l' ? p.armL : p.armR, ang = typeof pose === 'number' ? pose : F.A[pose]; tl.to(a.piv, { rotation: -a.side * ang, duration: dur, ease }, rel(t)); return p; };
    p.arms = (t, l, r, dur = 0.4) => { if (l != null) p.arm(t, 'l', l, dur); if (r != null) p.arm(t, 'r', r, dur); return p; };
    p.tilt = (t, deg, dur = 0.4) => { tl.to(p.headPiv, { rotation: deg, duration: dur, ease: 'power2.inOut' }, rel(t)); return p; };
    p.wave = (a, b, side = 'r') => { p.waves.push([a, b, side]); return p; };
    p.walk = (a, b) => { p.walks.push([a, b]); return p; };
    p.nod = (a, b, amp = 6, f = 2.2) => { p.nods.push([a, b, amp, f]); return p; };
    p.shakeHead = (a, b) => { p.shakesH.push([a, b]); return p; };
    p.move = (t, nx, ny, dur = 0.8, ease = 'power2.inOut') => { tl.to(root, { x: nx - x, y: ny - y, duration: dur, ease }, rel(t)); return p; };
    p.enter = (t, from = 'left', dur = 0.6, o2 = {}) => { F.in(root, t, from, Object.assign({ dur, rot: 0, dist: o2.dist ?? 1.4 }, o2)); return p; };
    p.exit = (t, to = 'right', dur = 0.5) => { F.out(root, t, to, { dur }); return p; };
    p.hop = (t, h = 30) => { tl.to(bob, { y: -h, duration: 0.15, ease: 'power2.out' }, rel(t)); tl.to(bob, { y: 0, duration: 0.2, ease: 'power2.in' }, rel(t + 0.15)); return p; };
    p.slump = (t, dy = 14, dur = 0.5) => { tl.to(p.headPiv, { y: dy, duration: dur, ease: 'power2.inOut' }, rel(t)); return p; };
    p.grey = (t, on = true, dur = 0.6) => { tl.to(rig, { filter: on ? 'grayscale(1) brightness(1.15) opacity(.75)' : 'grayscale(0) brightness(1) opacity(1)', duration: dur }, rel(t)); return p; };
    // per-frame acting: breathing, blinking, waves, walks, nods
    const blinkP = 3.1 + (p.seed % 1.7);
    F.every(shot, (G) => {
      let m = p.moods[0][1]; for (const [t, mm] of p.moods) { if (G >= t) m = mm; else break; }
      const ph = ((G + p.seed * 1.3) % blinkP) / blinkP, blink = ph > 0.955;
      const h = headFor(m, blink); if (h !== p.cur) { if (p.cur) p.cur.style.display = 'none'; h.style.display = 'block'; p.cur = h; }
      const br = 1 + 0.011 * Math.sin(G * 2.1 + p.seed);
      let by = 0, rot = 0;
      for (const [a, b] of p.walks) if (G >= a && G < b) { const q = (G - a) * 9.5; by = -Math.abs(Math.sin(q)) * 9; rot = Math.sin(q) * 2.2; }
      bob.style.transform = `translateY(${by.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scaleY(${br.toFixed(4)})`;
      let hw = 0; for (const [a, b, amp, f] of p.nods) if (G >= a && G < b) hw = amp * Math.sin((G - a) * f * 6.283) * Math.min(1, (G - a) * 4, (b - G) * 4);
      let hs = 0; for (const [a, b] of p.shakesH) if (G >= a && G < b) hs = 7 * Math.sin((G - a) * 15);
      p.headWob.style.transform = `translateY(${(hw * 0.8).toFixed(2)}px) rotate(${(hs + hw * 0.3).toFixed(2)}deg)`;
      for (const a of [p.armL, p.armR]) { let w = 0; for (const [wa, wb, side] of p.waves) if ((side === 'b' || (side === 'l') === (a.side < 0)) && G >= wa && G < wb) w = 16 * Math.sin((G - wa) * 11) * Math.min(1, (G - wa) * 5, (wb - G) * 5);
        a.wob.style.transform = `rotate(${(-a.side * w).toFixed(2)}deg)`; }
    });
    return p;
  };

  // ---------------- screens ----------------
  // paper laptop seen from the front; returns {el, screen}; screen is HTML 1380x760 inside
  F.laptop = (parent, cx, cy, s = 1, z = 2) => {
    const el = abs(cx - 840 * s, cy - 480 * s, 1680 * s, 960 * s); el.style.zIndex = z; const inner = abs(0, 0, 1680, 960, '0 0'); inner.style.transform = `scale(${s})`; el.appendChild(inner);
    inner.innerHTML = svgBox(0, 0, 1680, 960, `<g filter="url(#cut)"><path d="M130 0 L1550 0 Q1580 0 1580 30 L1580 840 L100 840 Q100 840 100 30 Q100 0 130 0Z" fill="${N}"/><path d="M0 840 L1680 840 L1620 920 L60 920 Z" fill="${C.navy2}"/><rect x="720" y="844" width="240" height="18" rx="8" fill="${N}"/></g>`);
    const scr = abs(150, 46, 1380, 760); Object.assign(scr.style, { background: '#FBF7EE', borderRadius: '10px', overflow: 'hidden', fontFamily: 'Inter, sans-serif', color: N });
    inner.appendChild(scr); parent.appendChild(el); return { el, screen: scr };
  };
  const winBar = (title) => `<div style="height:58px;display:flex;align-items:center;gap:10px;padding:0 24px;border-bottom:2px solid #E6DAC2;background:#F4EEE1;flex:none">
      <span style="width:15px;height:15px;border-radius:50%;background:#E4572E"></span><span style="width:15px;height:15px;border-radius:50%;background:#E2A93B"></span><span style="width:15px;height:15px;border-radius:50%;background:#7FA88B"></span>
      <span style="margin-left:18px;font:600 24px Inter;color:#5a6378">${title}</span></div>`;
  F.winBar = winBar;
  // AI chat app inside a screen element
  F.chat = (shot, screen, o = {}) => {
    const msgsH = `<div class="msgs" style="flex:1;padding:${o.top ? '0 70px 30px' : '34px 70px 0'};display:flex;flex-direction:column;gap:22px;overflow:hidden"></div>`;
    screen.innerHTML = `<div style="display:flex;flex-direction:column;height:100%">${winBar(o.title || 'AI chat')}
      ${o.top ? `<div style="padding:40px 70px 10px;font:700 26px Inter;color:#8a8f9c;letter-spacing:.08em">${o.kicker || 'TYPE THIS'}</div>` : msgsH}
      <div style="padding:${o.top ? '0 70px 30px' : '0 70px 34px'}"><div class="comp" style="position:relative;background:#fff;border:2px solid #E6DAC2;border-radius:22px;padding:28px 34px;min-height:96px;font:500 ${o.size || 40}px/1.42 Inter;box-shadow:0 10px 24px rgba(30,42,68,.10)"><span class="ph" style="color:#a9a59c">Message the AI…</span><span class="tx"></span></div></div>${o.top ? msgsH : ''}</div>`;
    const msgs = screen.querySelector('.msgs'), comp = screen.querySelector('.comp'), tx = comp.querySelector('.tx'), ph = comp.querySelector('.ph');
    const api = { msgs, comp };
    // parse text with [chip] markers
    api.type = (text, t0, t1, o2 = {}) => {
      const segs = []; text.split(/(\[[^\]]+\])/).forEach((p) => { if (!p) return; if (p[0] === '[') segs.push({ chip: p.slice(1, -1) }); else segs.push({ t: p }); });
      const total = segs.reduce((n, sg) => n + (sg.chip ? 1 : sg.t.length), 0); let last = -1;
      F.every(shot, (G) => { const n = G < t0 ? 0 : Math.round(total * E.lin(S.seg(G, t0, t1))); const sent = api.sentAt != null && G >= api.sentAt; const k = sent ? -2 : n; if (k === last) return; last = k;
        if (sent) { tx.innerHTML = ''; ph.style.display = 'inline'; return; }
        ph.style.display = n ? 'none' : 'inline'; let left = n, h = '';
        for (const sg of segs) { if (left <= 0) break; if (sg.chip) { h += `<span style="display:inline-block;padding:0 12px;border-radius:10px;background:#F6D9CF;color:#C9441F;border:2px dashed #E4572E">${sg.chip}</span>`; left -= 1; } else { h += sg.t.slice(0, left).replace(/\n/g, '<br>'); left -= sg.t.length; } }
        tx.innerHTML = h + (n < total || !o2.noCaret ? `<span style="display:inline-block;width:4px;height:1.05em;background:#E4572E;vertical-align:-4px;margin-left:3px"></span>` : ''); });
      for (let x = t0; x < t1; x += 0.11) F.sfx(x, 'key', 0.18);
      api.text = text;
    };
    api.send = (t) => { api.sentAt = t; F.sfx(t, 'send', 0.5); const b = document.createElement('div'); Object.assign(b.style, { alignSelf: 'flex-end', maxWidth: '78%', background: N, color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '20px 28px', font: `500 ${o.bubble || 28}px/1.4 Inter` });
      b.innerHTML = api.text.replace(/\[([^\]]+)\]/g, '<span style="color:#F4B8A4">$1</span>'); msgs.appendChild(b); F.in(b, t, 'below', { dist: 0.4, rot: 0, dur: 0.45, sfx: false }); return b; };
    api.reply = (t, lines, step = 0.35, o2 = {}) => { const b = document.createElement('div'); Object.assign(b.style, { alignSelf: 'flex-start', maxWidth: '86%', background: '#F1E9DA', borderRadius: '22px 22px 22px 6px', padding: '22px 30px', font: `500 ${o2.size || 30}px/1.4 Inter`, color: N });
      b.innerHTML = lines.map((l) => `<div>${l}</div>`).join(''); msgs.appendChild(b); F.in(b, t, 'below', { dist: 0.3, rot: 0, dur: 0.4, sfx: false });
      [...b.children].forEach((c, i) => { F.fromTo(c, t + 0.2 + i * step, { opacity: 0, x: -20 }, { opacity: 1, x: 0 }, 0.35); F.sfx(t + 0.2 + i * step, 'tick', 0.25); }); return b; };
    return api;
  };

  // ---------------- the Job Shield ----------------
  const SH_COLS = [C.sage, C.navy, C.sage, C.navy, C.sage, C.navy, C.gold, C.sage, C.navy];
  const shieldClip = `<path d="M0 -300 L240 -228 Q250 110 0 298 Q-250 110 -240 -228 Z"/>`;
  const pieceSVG = (i, id) => { const r = Math.floor(i / 3), c = i % 3, x = -240 + c * 160, y = -300 + r * 200;
    return `<defs><clipPath id="${id}">${shieldClip}</clipPath></defs><g clip-path="url(#${id})"><g filter="url(#cutflat)"><rect x="${x + 5}" y="${y + 5}" width="150" height="190" fill="${SH_COLS[i]}"/>${PA.T(i + 1, x + 80, y + 122, 64, i === 6 ? N : C.white, 'Archivo Black', 'middle', 'opacity=".92"')}</g></g>`; };
  let shN = 0;
  // shield showing pieces < have; returns {el, pieces:[divs]} with all 9 piece divs (hidden beyond `have`)
  F.shield = (parent, cx, cy, s, have, z = 4) => {
    const el = abs(cx - 300 * s, cy - 360 * s, 600 * s, 720 * s); el.style.zIndex = z; const inner = abs(0, 0, 600, 720, '0 0'); inner.style.transform = `scale(${s})`; el.appendChild(inner);
    let slots = ''; for (let i = 0; i < 9; i++) { const r = Math.floor(i / 3), c = i % 3, x = -240 + c * 160, y = -300 + r * 200; slots += `<rect x="${x + 14}" y="${y + 14}" width="132" height="172" fill="none" stroke="${C.grey}" stroke-width="5" stroke-dasharray="12 10"/>`; }
    const id = 'shc' + (shN++);
    inner.innerHTML = svgBox(-300, -360, 600, 720, `<g filter="url(#cut)"><path d="M0 -330 L270 -250 Q280 120 0 330 Q-280 120 -270 -250 Z" fill="${C.white}"/></g><defs><clipPath id="${id}">${shieldClip}</clipPath></defs><g clip-path="url(#${id})">${slots}</g>`);
    const pieces = []; for (let i = 0; i < 9; i++) { const d = abs(0, 0, 600, 720); const r = Math.floor(i / 3), c = i % 3; d.style.transformOrigin = `${300 - 240 + c * 160 + 80}px ${360 - 300 + r * 200 + 100}px`;
      d.innerHTML = svgBox(-300, -360, 600, 720, pieceSVG(i, 'pc' + (shN++))); if (i >= have) d.style.opacity = 0; inner.appendChild(d); pieces.push(d); }
    parent.appendChild(el); return { el, inner, pieces };
  };
  F.snap = (sh, i, t, from = [-500, -300]) => { const d = sh.pieces[i]; tl.fromTo(d, { opacity: 1, x: from[0], y: from[1], rotation: -25, scale: 1.25 }, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.55, ease: 'power3.out', immediateRender: false }, rel(t)); tl.set(d, { opacity: 0 }, 0); tl.set(d, { opacity: 1 }, rel(t));
    tl.fromTo(sh.inner.firstChild, { scale: 1 }, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, rel(t + 0.52)); F.sfx(t + 0.5, 'snap', 0.75); F.sfx(t, 'whoosh', 0.3); };
  // corner mini-shield that slides in, snaps piece n (1-based), slides out
  F.miniSnap = (shot, n, t, hold = 1.9) => {
    const sh = F.shield(shot.ui, 1730, 300, 0.36, n - 1, 20);
    F.in(sh.el, t, 'right', { dur: 0.45, rot: 6, sfx: false }); F.snap(sh, n - 1, t + 0.35, [-700, -100]); F.out(sh.el, t + hold, 'right', { dur: 0.4 });
    return sh;
  };
  // chapter card shot content
  F.chapter = (shot, t, n, title, sub, o = {}) => {
    const gold = n === 7;
    const tag = F.prop(shot.mid, `<g filter="url(#cut)"><path d="M-320 -210 L320 -210 L320 210 L-320 210 Z" fill="${gold ? C.gold : C.white}"/><circle cx="-256" cy="-146" r="22" fill="${C.paper}"/></g>`, 560, 420, 700, 480, 3);
    const num = F.label(tag, `0${n}<span style="font-size:70px;opacity:.5">/09</span>`, 350, 250, { bg: 'none', font: "'Archivo Black'", weight: 400, size: 240, color: C.navy, flat: true });
    const string = F.set(shot.back, `<path d="M318 230 Q250 120 150 160" stroke="${N}" stroke-width="5" fill="none"/>`);
    const tt = F.label(shot.mid, title, 560, 760, { size: 78, bg: gold ? C.navy : C.navy, color: C.white, rot: -1.2 });
    const st = sub ? F.hand(shot.mid, sub, 560, 880, 58, C.tomato2, -1) : null;
    const sh = F.shield(shot.mid, 1400, 540, 0.95, n - 1, 3);
    if (o.match) { F.fromTo(tag, t, { x: 400, y: 120, rotation: 0, opacity: 1 }, { x: 0, y: 0, rotation: 0 }, 0.8, 'power3.inOut'); F.fromTo(string, t + 0.5, { opacity: 0 }, { opacity: 1 }, 0.3); F.sfx(t, 'card', 0.6); }
    else { F.in(tag, t, 'left', { dur: 0.6, rot: -14, sfx: 'card', gain: 0.7 }); F.in(string, t + 0.1, 'left', { dur: 0.6, sfx: false }); }
    F.in(tt, t + 0.45, 'below', { dur: 0.5, rot: 3 }); if (st) F.in(st, t + 0.8, 'none', { dur: 0.5, sfx: false });
    F.in(sh.el, t + 0.15, 'right', { dur: 0.6, rot: 6, sfx: false });
    tl.fromTo(tag, { rotation: -3 }, { rotation: 2, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, rel(t + 0.6));
    shot.cam(t, 960, 540, 1.0, 0.01).cam(t + 0.4, 930, 560, 1.05, 3.5, 'inOutSine');
    F.sfx(t, 'swell', 0.6);
    return { tag, tt, st, sh };
  };

  window.FILM = F;
})();
