// toon.js: illustrated 2D cartoon kit for CLOSING TIME. Outlined, cel-shaded characters with rigs + illustrated sets.
// Characters are live SVG DOM (animate with c.pose({...}) every frame). Sets are SVG strings (static), moved by a camera.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#17161c';
  const R = (s) => { let a = s >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const f = (n) => Math.round(n * 10) / 10;
  function el(tag, at, parent) { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; }
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const m = (c) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k))); return '#' + ((1 << 24) | (m(r) << 16) | (m(g) << 8) | m(b)).toString(16).slice(1); };

  // ---------- shared defs (call once per svg) ----------
  function defs(svg) {
    const d = el('defs', {}, svg);
    d.innerHTML = `
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.9 -0.32"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="soft40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="soft6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.75"/></radialGradient>
<radialGradient id="lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd98a" stop-opacity="0.75"/><stop offset="60%" stop-color="#ffb84a" stop-opacity="0.18"/><stop offset="100%" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
<radialGradient id="redlamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff5a3a" stop-opacity="0.8"/><stop offset="100%" stop-color="#ff2a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="coolglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#cfe6ff" stop-opacity="0.7"/><stop offset="100%" stop-color="#cfe6ff" stop-opacity="0"/></radialGradient>
<radialGradient id="headSkin" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#3c3a40"/><stop offset="55%" stop-color="#1f1e24"/><stop offset="100%" stop-color="#121116"/></radialGradient>
<radialGradient id="zSkin" cx="38%" cy="30%" r="80%"><stop offset="0%" stop-color="#9ccf62"/><stop offset="60%" stop-color="#5e9636"/><stop offset="100%" stop-color="#3a6420"/></radialGradient>
<radialGradient id="zEye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fffbe0"/><stop offset="55%" stop-color="#ffe66a"/><stop offset="100%" stop-color="#d9a400"/></radialGradient>`;
    return d;
  }

  // ---------- CHARACTERS ----------
  const LOOK = {
    sami: { top: '#d42a2f', sleeve: 'short', pants: '#36588f', shoes: '#f4f4f4', hair: 'sami', badge: true },
    maya: { top: '#f4b81f', sleeve: 'long', pants: '#232229', shoes: '#f4c21d', hair: 'maya', hood: true },
    zoe: { top: '#4f74ad', sleeve: 'long', inner: '#f6f6f6', skirt: '#c02a30', legs: 'skin', shoes: '#d42a2f', hair: 'zoe' },
    theo: { top: '#2c2c33', sleeve: 'short', pants: '#7a5636', shoes: '#7a4b2a', hair: 'theo' },
    rico: { top: '#2f8a35', sleeve: 'long', inner: '#f6f6f6', plaid: '#11461a', pants: '#5d7eae', shoes: '#f4f4f4', hair: 'rico' },
    davis: { top: '#eceef0', sleeve: 'short', pants: '#33343d', shoes: '#26262b', hair: 'davis', tie: '#c02a30', lanyard: true },
    man: { top: '#3d4a3c', sleeve: 'long', pants: '#25252b', shoes: '#1e1e22', hair: 'shaggy' },
    mum: { top: '#c25a8a', sleeve: 'long', pants: '#2c2c34', shoes: '#222', hair: 'bun' },
    zombie: { top: '#2b2d2b', sleeve: 'torn', pants: '#2a2a2c', shoes: '#4f7d2c', hair: 'none', zombie: true },
  };
  const SKIN = '#1d1c22', SKIN_HI = '#2c2b33';
  function capsule(parent, x1, y1, x2, y2, w, fill, ow = 5) {
    el('line', { x1, y1, x2, y2, stroke: INK, 'stroke-width': w + ow * 2, 'stroke-linecap': 'round' }, parent);
    return el('line', { x1, y1, x2, y2, stroke: fill, 'stroke-width': w, 'stroke-linecap': 'round' }, parent);
  }
  // Builds a rig. Units: character is ~400 tall at s=1, feet at (0,0).
  function char(parent, o) {
    const L = Object.assign({}, LOOK[o.who] || LOOK.sami, o.zombie && o.who && o.who !== 'zombie' ? { shoes: LOOK[o.who].shoes } : {}, o.look || {});
    const z = !!L.zombie || !!o.zombie; const skin = z ? '#5e9636' : SKIN; const hand = z ? '#5e9636' : SKIN;
    const root = el('g', {}, parent); const bob = el('g', {}, root);
    const back = !!o.back;
    const sl = L.sleeve === 'long' || L.sleeve === 'torn';
    const mk = (side) => { // leg
      const hip = el('g', {}, bob); const thighC = L.legs === 'skin' ? skin : L.pants;
      capsule(hip, 0, 0, 0, 78, 30, thighC); const knee = el('g', { transform: 'translate(0,78)' }, hip); capsule(knee, 0, 0, 0, 74, 27, L.legs === 'skin' || L.skirt ? (L.legs === 'skin' ? skin : L.pants) : L.pants);
      const shoe = el('g', { transform: 'translate(0,74)' }, knee); el('path', { d: `M-17,-4 Q-18,-18 0,-18 Q18,-18 26,-4 Q30,8 18,9 L-14,9 Q-22,8 -17,-4Z`, fill: L.shoes, stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, shoe);
      el('path', { d: 'M-15,4 L24,4', stroke: shade(L.shoes, -0.3), 'stroke-width': 4 }, shoe);
      return { hip, knee, shoe };
    };
    const legs = [mk(-1), mk(1)];
    let armIdx = 0;
    const armMk = () => {
      const idx = armIdx++;
      const sh = el('g', {}, bob);
      const up = capsule(sh, 0, 0, 0, 62, 24, sl || L.sleeve === 'short' ? L.top : skin);
      const el2 = el('g', { transform: 'translate(0,62)' }, sh);
      capsule(el2, 0, 0, 0, 56, 21, sl ? L.top : skin);
      if (L.sleeve === 'torn') el('path', { d: 'M-13,40 l6,10 l5,-8 l6,9 l5,-10 l4,6', stroke: INK, 'stroke-width': 4, fill: 'none' }, el2);
      if (o.stain && idx === 1) { el('path', { d: 'M-11,26 Q0,20 11,28 L11,58 Q0,64 -11,58Z', fill: '#5a0c10', opacity: 0.9 }, el2); el('circle', { cx: 4, cy: 66, r: 4, fill: '#5a0c10' }, el2); }
      const hd = el('g', { transform: 'translate(0,60)' }, el2);
      el('ellipse', { cx: 0, cy: 6, rx: 15, ry: 17, fill: hand, stroke: INK, 'stroke-width': 5 }, hd);
      if (z) el('path', { d: 'M-10,18 l-3,12 M0,22 l0,13 M10,18 l3,12', stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, hd);
      return { sh, el: el2, hd };
    };
    const torso = el('g', {}, bob);
    const arms = [armMk(), armMk()];
    // torso drawing
    const ty = -232, tw = 104, th = 112;
    const tp = `M${-tw / 2},${ty + 18} Q${-tw / 2},${ty} ${-tw / 2 + 22},${ty - 2} L${tw / 2 - 22},${ty - 2} Q${tw / 2},${ty} ${tw / 2},${ty + 18} L${tw / 2 + 4},${ty + th} Q0,${ty + th + 8} ${-tw / 2 - 4},${ty + th}Z`;
    el('path', { d: tp, fill: L.top, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, torso);
    const clip = 'c' + Math.floor(Math.random() * 1e9); const cp = el('clipPath', { id: clip }, torso); el('path', { d: tp }, cp);
    const det = el('g', { 'clip-path': `url(#${clip})` }, torso);
    el('path', { d: `M${tw / 2 - 26},${ty - 10} L${tw / 2 + 10},${ty - 10} L${tw / 2 + 10},${ty + th + 20} L${tw / 2 - 14},${ty + th + 20}Z`, fill: shade(L.top, -0.28), opacity: 0.9 }, det);
    if (L.plaid) { for (let i = -3; i <= 3; i++) el('line', { x1: i * 18, y1: ty - 10, x2: i * 18, y2: ty + th + 10, stroke: L.plaid, 'stroke-width': 5, opacity: 0.8 }, det); for (let j = 0; j < 7; j++) el('line', { x1: -70, y1: ty + j * 18, x2: 70, y2: ty + j * 18, stroke: L.plaid, 'stroke-width': 5, opacity: 0.8 }, det); }
    if (L.inner && !back) { el('path', { d: `M-17,${ty - 4} L17,${ty - 4} L14,${ty + th + 10} L-14,${ty + th + 10}Z`, fill: L.inner, stroke: INK, 'stroke-width': 4 }, det); }
    if (L.hood) { el('path', { d: `M-44,${ty + 2} Q0,${ty + 34} 44,${ty + 2}`, stroke: shade(L.top, -0.35), 'stroke-width': 9, fill: 'none' }, det); if (!back) { el('path', { d: `M-30,${ty + 64} L30,${ty + 64} L36,${ty + 98} L-36,${ty + 98}Z`, fill: shade(L.top, -0.12), stroke: INK, 'stroke-width': 4 }, det); el('line', { x1: -10, y1: ty + 14, x2: -12, y2: ty + 52, stroke: '#f6f6f6', 'stroke-width': 4 }, det); el('line', { x1: 10, y1: ty + 14, x2: 12, y2: ty + 52, stroke: '#f6f6f6', 'stroke-width': 4 }, det); } }
    if (L.tie && !back) { el('path', { d: `M0,${ty} l9,10 l-5,60 l-4,8 l-4,-8 l-5,-60Z`, fill: L.tie, stroke: INK, 'stroke-width': 3 }, det); }
    if (L.lanyard && !back) { el('path', { d: `M-26,${ty} Q-8,${ty + 50} 22,${ty}`, stroke: '#3a6bd6', 'stroke-width': 4, fill: 'none' }, det); el('rect', { x: -12, y: ty + 40, width: 20, height: 26, fill: '#f4f4f4', stroke: INK, 'stroke-width': 3 }, det); }
    if (L.badge && !back) { el('rect', { x: 16, y: ty + 26, width: 28, height: 13, rx: 3, fill: '#f6f6f6', stroke: INK, 'stroke-width': 3 }, det); }
    if (L.sleeve === 'torn') { el('path', { d: `M${-tw / 2},${ty + th - 6} l12,14 l10,-12 l12,16 l12,-14 l12,12 l12,-14 l12,14 l12,-12`, fill: 'none', stroke: INK, 'stroke-width': 4 }, det); el('circle', { cx: 18, cy: ty + 40, r: 9, fill: '#141414' }, det); el('path', { d: `M-30,${ty + 30} l10,22`, stroke: '#3d6a22', 'stroke-width': 7 }, det); }
    if (o.bite && !back) { el('path', { d: `M-46,${ty + 2} q14,-6 22,4 q-2,14 -14,16 q-10,-2 -8,-20Z`, fill: '#7a0c12', stroke: INK, 'stroke-width': 3 }, torso); el('path', { d: `M-40,${ty + 18} q4,30 -2,52`, stroke: '#7a0c12', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', opacity: 0.9 }, torso); }
    if (L.skirt) el('path', { d: `M${-tw / 2 - 4},${ty + th - 10} L${tw / 2 + 4},${ty + th - 10} L${tw / 2 + 22},${ty + th + 36} Q0,${ty + th + 44} ${-tw / 2 - 22},${ty + th + 36}Z`, fill: L.skirt, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, torso);
    // head
    const headG = el('g', {}, bob); const hr = 78; const hcy = -232 - 70;
    const hairBack = el('g', {}, headG);
    el('circle', { cx: 0, cy: hcy, r: hr, fill: z ? 'url(#zSkin)' : 'url(#headSkin)', stroke: INK, 'stroke-width': 6 }, headG);
    const face = el('g', {}, headG); const hairFront = el('g', {}, headG);
    const H = { sami: () => { el('path', { d: `M-80,${hcy - 4} Q-92,${hcy - 70} -40,${hcy - 88} Q-20,${hcy - 112} 8,${hcy - 92} Q30,${hcy - 116} 52,${hcy - 86} Q96,${hcy - 76} 82,${hcy - 10} Q70,${hcy - 46} 46,${hcy - 52} Q30,${hcy - 30} 8,${hcy - 50} Q-14,${hcy - 30} -36,${hcy - 50} Q-60,${hcy - 40} -80,${hcy - 4}Z`, fill: '#5d3a22', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hairFront); el('path', { d: `M-30,${hcy - 76} Q-6,${hcy - 90} 20,${hcy - 78}`, stroke: '#8a5a36', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, hairFront); },
      maya: () => { el('path', { d: `M-10,${hcy - 76} C-150,${hcy - 120} -150,${hcy + 10} -120,${hcy + 70} C-100,${hcy + 20} -90,${hcy - 30} -40,${hcy - 50}Z`, fill: '#7c4a26', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, back ? hairFront : hairBack); el('path', { d: `M-80,${hcy - 2} Q-84,${hcy - 84} 0,${hcy - 82} Q84,${hcy - 84} 80,${hcy - 2} Q70,${hcy - 50} 20,${hcy - 54} Q-40,${hcy - 58} -80,${hcy - 2}Z`, fill: '#6b3f22', stroke: INK, 'stroke-width': 6 }, hairFront); el('circle', { cx: -52, cy: hcy - 64, r: 12, fill: '#f4c21d', stroke: INK, 'stroke-width': 4 }, hairFront); },
      zoe: () => { el('path', { d: `M-88,${hcy + 52} L-86,${hcy - 20} Q-84,${hcy - 92} 0,${hcy - 90} Q86,${hcy - 92} 88,${hcy - 20} L90,${hcy + 52} L58,${hcy + 48} L56,${hcy - 18} Q20,${hcy - 50} -30,${hcy - 46} Q-50,${hcy - 30} -56,${hcy - 8} L-58,${hcy + 48}Z`, fill: '#f2cb4c', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hairFront); el('path', { d: `M-20,${hcy - 76} Q30,${hcy - 84} 60,${hcy - 50}`, stroke: '#fff1a8', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, hairFront); },
      theo: () => { const r = R(4); for (let i = 0; i < 17; i++) { const a = Math.PI * 1.04 + (i / 16) * Math.PI * 0.92; el('circle', { cx: f(Math.cos(a) * 74), cy: f(hcy + Math.sin(a) * 74 - 4), r: f(20 + r() * 7), fill: '#2e1e14', stroke: INK, 'stroke-width': 5 }, hairFront); } el('ellipse', { cx: 0, cy: hcy - 58, rx: 70, ry: 30, fill: '#2e1e14' }, hairFront); },
      rico: () => { el('path', { d: `M-82,${hcy - 14} Q-80,${hcy - 92} 0,${hcy - 92} Q80,${hcy - 92} 82,${hcy - 14}Z`, fill: '#2c2c33', stroke: INK, 'stroke-width': 6 }, hairFront); el('rect', { x: -84, y: hcy - 26, width: 168, height: 16, rx: 5, fill: '#d42a2f', stroke: INK, 'stroke-width': 5 }, hairFront); el('path', { d: `M60,${hcy - 30} q60,-6 74,18 l-62,6Z`, fill: '#d42a2f', stroke: INK, 'stroke-width': 5 }, hairBack); },
      davis: () => { el('path', { d: `M-80,${hcy - 8} Q-82,${hcy - 80} 0,${hcy - 84} Q82,${hcy - 80} 80,${hcy - 8} Q70,${hcy - 50} 0,${hcy - 56} Q-70,${hcy - 50} -80,${hcy - 8}Z`, fill: '#8d8d93', stroke: INK, 'stroke-width': 6 }, hairFront); },
      shaggy: () => { el('path', { d: `M-82,${hcy + 6} Q-90,${hcy - 88} 0,${hcy - 88} Q90,${hcy - 88} 82,${hcy + 6} L70,${hcy - 30} L50,${hcy - 10} L36,${hcy - 44} L10,${hcy - 20} L-10,${hcy - 46} L-36,${hcy - 18} L-56,${hcy - 44}Z`, fill: '#2a241e', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hairFront); },
      bun: () => { el('circle', { cx: 0, cy: hcy - 92, r: 30, fill: '#3a2216', stroke: INK, 'stroke-width': 5 }, hairBack); el('path', { d: `M-80,${hcy - 4} Q-84,${hcy - 84} 0,${hcy - 84} Q84,${hcy - 84} 80,${hcy - 4} Q60,${hcy - 56} 0,${hcy - 58} Q-60,${hcy - 56} -80,${hcy - 4}Z`, fill: '#3a2216', stroke: INK, 'stroke-width': 6 }, hairFront); },
      none: () => { if (o.zhair) el('path', { d: `M-70,${hcy - 40} L-50,${hcy - 92} L-30,${hcy - 60} L-6,${hcy - 98} L14,${hcy - 62} L40,${hcy - 94} L56,${hcy - 50}`, fill: '#3a2a1e', stroke: INK, 'stroke-width': 5 }, hairFront); el('ellipse', { cx: 34, cy: hcy - 46, rx: 16, ry: 11, fill: '#3d6a22', opacity: 0.8 }, face); el('ellipse', { cx: -46, cy: hcy + 30, rx: 10, ry: 7, fill: '#3d6a22', opacity: 0.8 }, face); } };
    (H[L.hair] || H.none)();
    // face parts (front only)
    const eyes = [], lids = [], pupils = [], brows = [];
    let mouth = null, mouthIn = null, teeth = null;
    if (!back) {
      [-1, 1].forEach((sd) => {
        const ex = sd * 30, ey = hcy - 2;
        const eg = el('g', {}, face);
        if (z) { el('ellipse', { cx: ex, cy: ey, rx: 23, ry: 21, fill: 'url(#zEye)', stroke: INK, 'stroke-width': 5 }, eg); pupils.push(el('circle', { cx: ex, cy: ey, r: 5, fill: '#3a2a00' }, eg)); }
        else { eyes.push(el('ellipse', { cx: ex, cy: ey, rx: 25, ry: 29, fill: '#fbfbfb', stroke: INK, 'stroke-width': 5 }, eg)); pupils.push(el('circle', { cx: ex, cy: ey + 3, r: 10, fill: INK }, eg)); el('circle', { cx: ex + 4, cy: ey - 2, r: 3, fill: '#fff' }, eg); }
        const lclip = 'l' + Math.floor(Math.random() * 1e9); const cl = el('clipPath', { id: lclip }, eg); el('ellipse', { cx: ex, cy: ey, rx: 25, ry: 29 }, cl);
        lids.push(el('rect', { x: ex - 30, y: ey - 34, width: 60, height: 0, fill: z ? '#4f8a2c' : SKIN_HI, 'clip-path': `url(#${lclip})` }, eg));
        brows.push(el('path', { d: '', stroke: z ? '#2a4a14' : '#3b3a42', 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, face));
      });
      mouth = el('g', {}, face);
      mouthIn = el('path', { d: '', fill: z ? '#1a0d0a' : '#7a1c22', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, mouth);
      teeth = el('path', { d: '', fill: z ? '#e9e2c0' : '#f8f8f8' }, mouth);
      if (o.tear) el('path', { d: `M38,${hcy + 28} q8,18 0,26 q-8,-8 0,-26Z`, fill: '#8fd0ff', stroke: INK, 'stroke-width': 3 }, face);
    } else face.remove();
    // layout joints
    const HIP = [[-24, -112], [24, -112]], SHO = [[-58, -214], [58, -214]];
    const c = { root, bob, legs, arms, headG, face, eyes, pupils, lids, brows, mouth, hcy, z, back,
      pose(p = {}) {
        const sc = (o.s || 1) * (p.s || 1);
        root.setAttribute('transform', `translate(${f(p.x ?? o.x ?? 0)},${f(p.y ?? o.y ?? 0)}) scale(${f(sc * (p.flip ? -1 : 1) * 1000) / 1000},${f(sc * 1000) / 1000})`);
        const crouch = p.crouch || 0;
        bob.setAttribute('transform', `translate(0,${f((p.bob || 0) + crouch * 60)}) rotate(${f(p.lean || 0)},0,-60)`);
        const lg = p.legs || [[4, 0], [-4, 0]];
        legs.forEach((l, i) => { l.hip.setAttribute('transform', `translate(${HIP[i][0]},${HIP[i][1]}) rotate(${f(lg[i][0] + crouch * (i ? -50 : 50))})`); l.knee.setAttribute('transform', `translate(0,78) rotate(${f(lg[i][1] - crouch * (i ? -95 : 95))})`); l.shoe.setAttribute('transform', `translate(0,74) rotate(${f(-(lg[i][0] + lg[i][1]) * 0.6 + crouch * (i ? -45 : 45))})`); });
        const am = p.arms || [[14, -10], [-14, 10]];
        arms.forEach((a, i) => { a.sh.setAttribute('transform', `translate(${SHO[i][0]},${SHO[i][1]}) rotate(${f(am[i][0])})`); a.el.setAttribute('transform', `translate(0,62) rotate(${f(am[i][1])})`); });
        headG.setAttribute('transform', `rotate(${f(p.head || 0)},0,${hcy + 60}) translate(${f(p.hx || 0)},${f(p.hy || 0)})`);
        if (!back) {
          const lk = p.look || [0, 0]; pupils.forEach((pp, i) => { const ex = (i ? 1 : -1) * 30; pp.setAttribute('cx', f(ex + lk[0] * 11)); pp.setAttribute('cy', f(hcy + 1 + lk[1] * 11 + (z ? -3 : 0))); });
          const bl = p.blink || 0; lids.forEach((ld) => { ld.setAttribute('height', f(bl * 64)); });
          const mood = p.mood || (z ? 'angry' : 'calm'); const wide = mood === 'scared' || mood === 'shock' ? 1.15 : 1;
          eyes.forEach((e) => { e.setAttribute('ry', f(29 * wide * (mood === 'sad' ? 0.92 : 1))); e.setAttribute('rx', f(25 * wide)); });
          const bz = { calm: [0, 0], scared: [10, -8], shock: [-8, -14], sad: [10, -2], angry: [-12, 4], smile: [0, -4] }[mood] || [0, 0];
          brows.forEach((b, i) => { const sd = i ? 1 : -1; const y0 = hcy - 46 + bz[1]; b.setAttribute('d', `M${sd * 14},${f(y0 - (bz[0] > 0 ? bz[0] : 0))} L${sd * 48},${f(y0 + (bz[0] > 0 ? 0 : -bz[0] * 0.6) + (mood === 'angry' ? -10 : 0))}`); });
          // mouth: open 0..1 (lip-sync), base shape by mood
          const op = Math.max(p.talk || 0, z ? 0.42 : 0, { scared: 0.35, shock: 0.55, calm: 0, sad: 0, angry: 0.1, smile: 0 }[mood] || 0) * (z ? 1.5 : 1);
          const my = hcy + 44; const w = z ? 30 : 22 + op * 6;
          if (op < 0.06) { const cv = mood === 'smile' ? 10 : mood === 'sad' ? -8 : 2; mouthIn.setAttribute('d', `M${-w},${my} Q0,${my + cv} ${w},${my} Q0,${my + cv + 4} ${-w},${my}Z`); teeth.setAttribute('d', ''); }
          else { const hgt = 6 + op * 34; mouthIn.setAttribute('d', `M${-w},${my - 2} Q0,${my - 8} ${w},${my - 2} Q${w + 2},${f(my + hgt)} 0,${f(my + hgt + 4)} Q${-w - 2},${f(my + hgt)} ${-w},${my - 2}Z`); teeth.setAttribute('d', z ? `M${-w + 4},${my - 1} l7,10 l7,-9 l7,10 l7,-10 l7,10 l7,-10 l6,9 l0,-4Z` : `M${-w + 5},${my - 1} Q0,${my - 5} ${w - 5},${my - 1} L${w - 7},${my + 6} Q0,${my + 3} ${-w + 7},${my + 6}Z`); }
        }
        return c;
      } };
    c.pose({});
    return c;
  }
  // walk/run cycle helper: returns pose fields for phase ph (radians)
  function gait(ph, kind = 'walk', dir = 1) {
    const a = kind === 'run' ? 42 : 24, k = kind === 'run' ? 70 : 34, ar = kind === 'run' ? 60 : 22;
    const s = Math.sin(ph), c2 = Math.cos(ph);
    return { legs: [[s * a, Math.max(0, -c2) * k + 6], [-s * a, Math.max(0, c2) * k + 6]], arms: [[-s * ar + 8, -(kind === 'run' ? 70 : 20)], [s * ar - 8, kind === 'run' ? 70 : 20]], bob: -Math.abs(Math.sin(ph)) * (kind === 'run' ? 16 : 7), lean: (kind === 'run' ? 8 : 2) * dir };
  }
  const ZOMBIE_ARMS = (t, ph = 0) => [[-100 + Math.sin(t * 2 + ph) * 8, -12 + Math.sin(t * 3 + ph) * 8], [-84 + Math.sin(t * 2.3 + ph + 1) * 8, -6]];

  // ---------- SETS (SVG strings) ----------
  // Supermarket aisle, one-point perspective. o: {vx, vy, light:'bright'|'night'|'red'|'dawn', seed, empty}
  function aisle(o = {}) {
    const W = 1920, Hh = 1080, vx = o.vx ?? 960, vy = o.vy ?? 470, F = 900; const r = R(o.seed || 3);
    const P = (X, Y, Z) => [vx + (F * X) / Z, vy + (F * Y) / Z]; const pts = (a) => a.map((p) => p.map(f).join(',')).join(' ');
    const lt = o.light || 'bright';
    const pal = ['#e0483f', '#f4b81f', '#3f8fd8', '#f6f2e6', '#5bb85b', '#ff8a3d', '#9b5bd6', '#e8e0cc', '#2a9a8a', '#d63a7a'];
    const C = { bright: { wall: '#d9dde2', floor: '#c4c9ce', ceil: '#eef0f2', shelf: '#e9edf0', frame: '#8f98a1' }, night: { wall: '#2a3140', floor: '#232a36', ceil: '#1b2029', shelf: '#3a4250', frame: '#2c3340' }, red: { wall: '#3a1414', floor: '#2a0f10', ceil: '#1f0a0a', shelf: '#4a1c1c', frame: '#2e1010' }, dawn: { wall: '#3d4658', floor: '#38404e', ceil: '#262c38', shelf: '#4d5668', frame: '#353d4c' } }[lt];
    let s = `<rect width="${W}" height="${Hh}" fill="${C.wall}"/>`;
    s += `<polygon points="${pts([P(-1.7, 1.2, 1), P(1.7, 1.2, 1), P(1.7, 1.2, 60), P(-1.7, 1.2, 60)])}" fill="${C.floor}"/>`;
    for (let z = 1.4; z < 60; z *= 1.16) s += `<line x1="${f(P(-1.7, 1.2, z)[0])}" y1="${f(P(-1.7, 1.2, z)[1])}" x2="${f(P(1.7, 1.2, z)[0])}" y2="${f(P(1.7, 1.2, z)[1])}" stroke="${INK}" stroke-opacity="0.12" stroke-width="3"/>`;
    s += `<polygon points="${pts([P(-1.7, -2.2, 1), P(1.7, -2.2, 1), P(1.7, -2.2, 60), P(-1.7, -2.2, 60)])}" fill="${C.ceil}"/>`;
    for (let z = 1.6; z < 60; z += 2.6) { const on = lt === 'bright' || (o.flicker && Math.abs(z - o.flicker) < 1.4); const q = [P(-0.3, -2.18, z), P(0.3, -2.18, z), P(0.3, -2.18, z + 1.4), P(-0.3, -2.18, z + 1.4)]; s += `<polygon points="${pts(q)}" fill="${on ? '#fbfdff' : '#3a404a'}" stroke="${INK}" stroke-width="${f(Math.max(1, 5 / z))}"/>`; if (on) s += `<ellipse cx="${f(P(0, 1.2, z + 0.7)[0])}" cy="${f(P(0, 1.2, z + 0.7)[1])}" rx="${f(320 / z)}" ry="${f(46 / z)}" fill="#ffffff" opacity="0.28"/>`; }
    for (const side of [-1, 1]) {
      const X = side * 1.6;
      s += `<polygon points="${pts([P(X, 1.2, 1), P(X, -1.45, 1), P(X, -1.45, 60), P(X, 1.2, 60)])}" fill="${C.frame}"/>`;
      const levels = [1.15, 0.6, 0.05, -0.5, -1.05];
      for (let zi = 0; zi < 2; zi++) {}
      levels.forEach((Y) => {
        let z = 1.0;
        while (z < 60) {
          const dz = 0.32 + r() * 0.45;
          if (r() > (o.empty || 0)) {
            const top = Y - (0.26 + r() * 0.22); const col = pal[Math.floor(r() * pal.length)]; const dark = lt === 'bright' ? col : shade(col, lt === 'red' ? -0.55 : -0.6);
            const q = [P(X, Y - 0.03, z), P(X, top, z), P(X, top, z + dz), P(X, Y - 0.03, z + dz)];
            s += `<polygon points="${pts(q)}" fill="${dark}" stroke="${INK}" stroke-width="${f(Math.max(0.6, 4 / z))}" stroke-linejoin="round"/>`;
            if (z < 9) { const lab = [P(X, Y - 0.12, z + dz * 0.2), P(X, top + 0.08, z + dz * 0.2), P(X, top + 0.08, z + dz * 0.8), P(X, Y - 0.12, z + dz * 0.8)]; s += `<polygon points="${pts(lab)}" fill="${shade(dark, 0.35)}" opacity="0.8"/>`; }
          }
          z += dz + 0.03;
        }
        const e1 = [P(X, Y, 1), P(X - side * 0.26, Y, 1), P(X - side * 0.26, Y, 60), P(X, Y, 60)];
        s += `<polygon points="${pts(e1)}" fill="${C.shelf}" stroke="${INK}" stroke-width="2"/>`;
        const e2 = [P(X - side * 0.26, Y, 1), P(X - side * 0.26, Y + 0.07, 1), P(X - side * 0.26, Y + 0.07, 60), P(X - side * 0.26, Y, 60)];
        s += `<polygon points="${pts(e2)}" fill="${lt === 'bright' ? '#f25a3a' : '#5a2020'}" stroke="${INK}" stroke-width="2"/>`;
      });
    }
    s += `<polygon points="${pts([P(-1.7, -2.2, 60), P(1.7, -2.2, 60), P(1.7, 1.2, 60), P(-1.7, 1.2, 60)])}" fill="${shade(C.wall, -0.08)}"/>`;
    if (lt === 'red') s += `<rect width="${W}" height="${Hh}" fill="#ff1a0a" opacity="0.18"/>`;
    return s;
  }
  // Night car park seen from inside the store through the front glass (or from outside)
  function nightSky(o = {}) {
    const W = 1920; let s = `<linearGradient id="ns${o.id || 0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.top || '#0b1222'}"/><stop offset="0.7" stop-color="${o.mid || '#1d2a44'}"/><stop offset="1" stop-color="${o.bot || '#3a3550'}"/></linearGradient><rect width="${W}" height="${o.h || 700}" fill="url(#ns${o.id || 0})"/>`;
    if (o.moon) s += `<circle cx="${o.moon[0]}" cy="${o.moon[1]}" r="160" fill="#cfe0ff" opacity="0.12" filter="url(#soft40)"/><circle cx="${o.moon[0]}" cy="${o.moon[1]}" r="52" fill="#eef3ff" stroke="${INK}" stroke-width="4"/><circle cx="${o.moon[0] - 16}" cy="${o.moon[1] - 10}" r="10" fill="#d4dcea"/><circle cx="${o.moon[0] + 14}" cy="${o.moon[1] + 16}" r="7" fill="#d4dcea"/>`;
    const r = R(o.seed || 2); for (let i = 0; i < (o.clouds || 5); i++) { const x = r() * W, y = 60 + r() * 260, w = 220 + r() * 300; s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(28 + r() * 30)}" fill="#3a4766" opacity="0.35" filter="url(#soft)"/>`; }
    return s;
  }
  function skyline(y, o = {}) {
    const r = R(o.seed || 5); let s = ''; let x = -40;
    while (x < 1960) { const w = 70 + r() * 150, h = 90 + r() * (o.hMax || 300); const col = o.col || '#151b28'; s += `<rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h + 600)}" fill="${col}" stroke="${INK}" stroke-width="3"/>`; if (r() > 0.6) s += `<rect x="${f(x + w * 0.3)}" y="${f(y - h - 26)}" width="${f(w * 0.2)}" height="26" fill="${col}" stroke="${INK}" stroke-width="3"/>`; for (let wy = y - h + 18; wy < y - 12; wy += 30) for (let wx = x + 12; wx < x + w - 18; wx += 26) if (r() < (o.lit ?? 0.08)) s += `<rect x="${f(wx)}" y="${f(wy)}" width="11" height="15" fill="${r() > 0.4 ? '#ffd27a' : '#cfe0ff'}" opacity="0.85"/>`; x += w + 6; }
    return s;
  }
  function lamp(x, yg, h, o = {}) {
    return `<ellipse cx="${x + 60}" cy="${yg + 4}" rx="${h * 0.95}" ry="${h * 0.2}" fill="url(#lamp)"/><polygon points="${x + 44},${yg - h + 14} ${x + 78},${yg - h + 14} ${x + 60 + h * 0.55},${yg} ${x + 60 - h * 0.55},${yg}" fill="#ffd98a" opacity="0.08"/>
<rect x="${x - 6}" y="${yg - h}" width="12" height="${h}" fill="#222730" stroke="${INK}" stroke-width="4"/><path d="M${x},${yg - h} q4,-14 30,-14 l46,0" stroke="${INK}" stroke-width="16" fill="none"/><path d="M${x},${yg - h} q4,-14 30,-14 l46,0" stroke="#222730" stroke-width="8" fill="none"/>
<path d="M${x + 44},${yg - h - 10} l40,0 l-6,16 l-28,0Z" fill="#fff3cf" stroke="${INK}" stroke-width="4" filter="url(#glow)"/>`;
  }
  function car(x, y, s, col, o = {}) {
    const d = col, dk = shade(col, -0.35);
    return `<g transform="translate(${x},${y}) scale(${o.flip ? -s : s},${s})"><ellipse cx="0" cy="4" rx="230" ry="14" fill="#000" opacity="0.35"/>
<path d="M-215,-22 L-205,-78 L-130,-88 L-80,-148 L72,-148 L138,-88 L208,-74 L218,-22 Q0,-8 -215,-22Z" fill="${d}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="M-205,-50 L216,-46 L218,-22 Q0,-8 -215,-22Z" fill="${dk}"/>
<path d="M-66,-136 L-114,-90 L-8,-90 L-8,-136Z M4,-136 L4,-90 L120,-90 L66,-136Z" fill="${o.lit ? '#2a3a50' : '#141b26'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
<path d="M-50,-128 L-80,-98" stroke="#5a6a80" stroke-width="6" opacity="0.6"/>
<circle cx="-130" cy="-18" r="40" fill="#141414" stroke="${INK}" stroke-width="6"/><circle cx="-130" cy="-18" r="17" fill="#6a6f76"/><circle cx="132" cy="-18" r="40" fill="#141414" stroke="${INK}" stroke-width="6"/><circle cx="132" cy="-18" r="17" fill="#6a6f76"/>
<rect x="200" y="-70" width="18" height="14" rx="4" fill="${o.wreck ? '#444' : '#ffe9a8'}" stroke="${INK}" stroke-width="4"/>${o.wreck ? `<path d="M-60,-136 L-30,-110 L-56,-98 M30,-120 l20,10" stroke="#9aa" stroke-width="4" fill="none"/>` : ''}</g>`;
  }
  function carFront(x, y, s, col, o = {}) {
    const dk = shade(col, -0.35);
    return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="2" rx="210" ry="16" fill="#000" opacity="0.4"/>
<path d="M-196,-20 L-200,-92 Q-196,-118 -160,-124 L-120,-196 Q-110,-212 -86,-212 L86,-212 Q110,-212 120,-196 L160,-124 Q196,-118 200,-92 L196,-20Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="M-112,-190 L-150,-128 L150,-128 L112,-190Z" fill="${o.lit ? '#2f4058' : '#18202c'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-90,-180 L-122,-136" stroke="#5a6a80" stroke-width="7" opacity="0.6"/>
<rect x="-200" y="-92" width="400" height="40" fill="${dk}"/><rect x="-70" y="-84" width="140" height="34" rx="6" fill="#1a1d22" stroke="${INK}" stroke-width="5"/>
<rect x="-188" y="-100" width="56" height="26" rx="8" fill="${o.lights ? '#fff3c8' : '#d8d8c8'}" stroke="${INK}" stroke-width="5"/><rect x="132" y="-100" width="56" height="26" rx="8" fill="${o.lights ? '#fff3c8' : '#d8d8c8'}" stroke="${INK}" stroke-width="5"/>
<rect x="-206" y="-40" width="412" height="24" rx="8" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>
<rect x="-186" y="-24" width="50" height="28" rx="6" fill="#111" stroke="${INK}" stroke-width="5"/><rect x="136" y="-24" width="50" height="28" rx="6" fill="#111" stroke="${INK}" stroke-width="5"/>${o.door ? `<path d="M200,-120 L300,-150 L300,-40 L196,-30Z" fill="${col}" stroke="${INK}" stroke-width="6"/>` : ''}</g>`;
  }
  function shutter(x, y, w, h, o = {}) {
    let s = `<linearGradient id="sh${o.id || 0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.c1 || '#a8afb6'}"/><stop offset="1" stop-color="${o.c2 || '#6b737b'}"/></linearGradient><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sh${o.id || 0})" stroke="${INK}" stroke-width="6"/>`;
    for (let yy = y + 14; yy < y + h; yy += 22) s += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="${INK}" stroke-opacity="0.55" stroke-width="3"/><line x1="${x}" y1="${yy + 4}" x2="${x + w}" y2="${yy + 4}" stroke="#d6dce2" stroke-opacity="0.5" stroke-width="2"/>`;
    return s + `<rect x="${x}" y="${y + h - 16}" width="${w}" height="16" fill="#4a5058" stroke="${INK}" stroke-width="5"/>`;
  }
  function vignette() { return `<rect width="1920" height="1080" fill="url(#vig)"/><rect width="1920" height="1080" filter="url(#grain)" opacity="0.18"/>`; }

  window.TOON = { INK, el, defs, char, gait, ZOMBIE_ARMS, aisle, nightSky, skyline, lamp, car, carFront, shutter, vignette, shade, R, f };
})();
