// toon.js v2: the AISLE 9 character rig.
// A glossy round-headed figure in SVG with: knees (two-bone legs solved from foot targets, so feet plant on the floor),
// head + body turn (yaw: 0 = facing camera, +1 = profile facing screen-right, -1 = facing left, |yaw|>1 = turning away),
// a scene key light (direction + colour) and a rim light, rounder plush shapes, gait cycles (walk / run / sneak / shamble)
// and expressions. Everything is a pure function of the state passed to set(): deterministic.
//
//   const c = TOON.make(parent, CAST.bob);
//   c.set({ x, y (feet on floor, px), scale, yaw, headYaw, lean, headTilt, look:[x,y], lid, mouth:{open,smile,wide},
//           armL:[shoulder, elbow], armR:[...], gait:{ phase, stride, kind }, feet:[[x,y],[x,y]] (local override),
//           light:{ x, y, color, k }, rim:{ color, k }, crouch, squash, expr: 'fear' | ... })
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  let UID = 0;
  const h = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  function grad(defs, type, id, stops, attrs) {
    const g = h(type, Object.assign({ id }, attrs), defs);
    stops.forEach(([o, c, a]) => h('stop', { offset: o, 'stop-color': c, 'stop-opacity': a == null ? 1 : a }, g));
    return g;
  }
  const DEF = { skin: '#161616', hair: 'messy', hairColor: '#0d0d0d', outfit: 'hoodie', top: '#E8382F', pants: '#2B3550',
    shoe: '#C9302C', sole: '#F2F0EC', apron: null, zombie: false, seed: 1, name: '', brows: true, lashes: false };

  // Legs: hip at (±HX, HIP_Y), thigh L1, shin L2, ankle -> sole SOLE px below.
  const HIP_Y = 600, L1 = 140, L2 = 140, SOLE = 40, GROUND = HIP_Y + L1 + L2 + SOLE - 20; // ground = 900

  function make(parent, opt) {
    const o = Object.assign({}, DEF, opt || {});
    const id = 'q' + (++UID);
    const svg = h('svg', { viewBox: '-300 -140 600 1080', width: 600, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;transform-origin:300px 1040px' });
    parent.appendChild(svg);
    const defs = h('defs', {}, svg);
    const blur = (n, sd) => { const f = h('filter', { id: id + n, x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs); h('feGaussianBlur', { stdDeviation: sd }, f); return `url(#${id + n})`; };
    const B2 = blur('b2', 3), B6 = blur('b6', 6), B14 = blur('b14', 14);

    const zombie = o.zombie, skin = zombie && o.skin === DEF.skin ? '#55615A' : o.skin;
    // head shading gradient: its highlight moves with the key light
    const headG = grad(defs, 'radialGradient', id + 'hd', [[0, shade(skin, zombie ? 0.42 : 0.38)], [0.38, shade(skin, 0.06)], [0.78, skin], [1, shade(skin, -0.7)]], { cx: '36%', cy: '28%', r: '80%', fx: '36%', fy: '28%' });
    const limbG = grad(defs, 'linearGradient', id + 'lm', [[0, shade(skin, -0.45)], [0.35, shade(skin, 0.22)], [1, shade(skin, -0.55)]], { x1: 0, y1: 0, x2: 1, y2: 0 });
    const cloth = (base, key) => { grad(defs, 'linearGradient', id + key, [[0, shade(base, -0.42)], [0.28, shade(base, 0.14)], [0.62, base], [1, shade(base, -0.5)]], { x1: 0, y1: 0, x2: 1, y2: 0 }); return `url(#${id + key})`; };
    const topF = cloth(o.top, 'tp'), sleeveF = cloth(o.top, 'sl'), pantF = cloth(o.pants, 'pa');
    grad(defs, 'radialGradient', id + 'hr', [[0, shade(o.hairColor, 0.3)], [0.5, o.hairColor], [1, shade(o.hairColor, -0.5)]], { cx: '40%', cy: '25%', r: '80%' });
    const scleraG = grad(defs, 'radialGradient', id + 'sc', zombie ? [[0, '#EEF3EA'], [0.7, '#C9D3C6'], [1, '#8F9B8C']] : [[0, '#FFFFFF'], [0.72, '#F3F3F3'], [1, '#B4B4BA']], { cx: '45%', cy: '40%', r: '62%' });
    const HAIR = `url(#${id}hr)`;

    const root = h('g', {}, svg);
    const shadow = h('ellipse', { cx: 0, cy: GROUND + 4, rx: 170, ry: 26, fill: '#000', opacity: 0.4, filter: B14 }, root);
    const footShadows = [0, 1].map(() => h('ellipse', { cx: 0, cy: GROUND + 2, rx: 70, ry: 12, fill: '#000', opacity: 0.35, filter: B6 }, root));
    const body = h('g', {}, root);

    // z-ordered slots so the far arm / leg can go behind the torso when the body turns
    const backSlot = h('g', {}, body), legSlot = h('g', {}, body), torsoSlot = h('g', {}, body), frontSlot = h('g', {}, body), headSlot = h('g', {}, body);

    // ---------- legs (thigh -> knee -> shin -> shoe) ----------
    function leg(i) {
      const g = h('g', {}, legSlot), thigh = h('g', {}, g);
      h('rect', { x: -40, y: -16, width: 80, height: L1 + 40, rx: 36, fill: pantF }, thigh);
      const knee = h('g', { transform: `translate(0 ${L1})` }, thigh);
      h('rect', { x: -36, y: -26, width: 72, height: L2 + 30, rx: 32, fill: pantF }, knee);
      h('rect', { x: -40, y: L2 - 30, width: 80, height: 28, rx: 12, fill: shade(o.pants, 0.16) }, knee); // rolled cuff
      h('path', { d: `M -6 -10 L -4 ${L2 - 34}`, stroke: shade(o.pants, -0.5), 'stroke-width': 3, opacity: 0.45 }, knee);
      const foot = h('g', { transform: `translate(0 ${L2})` }, knee);
      const shoeG = grad(defs, 'radialGradient', id + 'sh' + i, [[0, shade(o.shoe, 0.25)], [0.6, o.shoe], [1, shade(o.shoe, -0.45)]], { cx: '45%', cy: '25%', r: '70%' });
      const shoe = h('g', {}, foot);
      h('path', { d: 'M -44 8 Q -46 -16 -16 -20 L 26 -20 Q 46 -18 54 6 Q 78 16 76 36 L -44 36 Z', fill: `url(#${id}sh${i})` }, shoe);
      h('path', { d: 'M -48 28 L 80 28 Q 82 46 66 48 L -42 48 Q -52 46 -48 28 Z', fill: o.sole }, shoe);
      h('path', { d: 'M 36 -6 Q 62 4 72 24', stroke: o.sole, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, shoe);
      h('path', { d: 'M -4 -12 L 28 -6 M 0 -2 L 32 4', stroke: o.sole, 'stroke-width': 6, 'stroke-linecap': 'round' }, shoe);
      return { g, thigh, knee, foot, shoe };
    }
    const LEGS = [leg(0), leg(1)];

    // ---------- torso ----------
    const torso = h('g', {}, torsoSlot), T = (d, fill, extra = {}) => h('path', Object.assign({ d, fill }, extra), torso);
    const torsoFrontMarker = h('g', {}, torso);
    const texts = [];
    if (o.outfit === 'pajamas') {
      T('M -116 368 Q -138 480 -120 612 Q 0 632 120 612 Q 138 480 116 368 Q 60 336 0 336 Q -60 336 -116 368 Z', topF);
      for (let i = -3; i <= 3; i++) h('path', { d: `M ${i * 32} 348 L ${i * 32 + 6} 615`, stroke: shade(o.top, 0.45), 'stroke-width': 9, opacity: 0.5 }, torso);
      T('M -40 348 L 0 400 L 40 348', 'none', { stroke: shade(o.top, -0.4), 'stroke-width': 10, 'stroke-linejoin': 'round' });
    } else if (o.outfit === 'cardigan') {
      T('M -114 368 Q -136 480 -118 610 Q 0 628 118 610 Q 136 480 114 368 Q 60 336 0 336 Q -60 336 -114 368 Z', topF);
      T('M -26 340 L 0 600 L 26 340 Z', '#E9E2D0'); T('M -6 340 L 0 420 L 6 340 Z', shade(o.top, -0.35));
      [420, 470, 520].forEach((y) => h('circle', { cx: 30, cy: y, r: 7, fill: '#3a2a1c' }, torso));
      h('rect', { x: -98, y: 476, width: 58, height: 50, rx: 12, fill: shade(o.top, -0.15) }, torso);
    } else {
      T('M -118 368 Q -142 480 -122 598 Q 0 616 122 598 Q 142 480 118 368 Q 62 332 0 332 Q -62 332 -118 368 Z', topF);
      h('rect', { x: -122, y: 576, width: 244, height: 42, rx: 18, fill: shade(o.top, -0.12) }, torso);
      T('M -88 354 Q -72 316 0 314 Q 72 316 88 354 Q 62 386 0 388 Q -62 386 -88 354 Z', shade(o.top, -0.04));
      T('M -50 350 Q 0 330 50 350 L 0 412 Z', shade(skin, -0.3));
      [-18, 18].forEach((x) => { h('path', { d: `M ${x} 374 Q ${x * 1.1} 422 ${x} 464`, stroke: shade(o.top, -0.3), 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, torso); h('rect', { x: x - 4, y: 460, width: 8, height: 16, rx: 3, fill: shade(o.top, -0.4) }, torso); });
      T('M -74 506 Q -66 480 -40 480 L 40 480 Q 66 480 74 506 L 84 568 L -84 568 Z', shade(o.top, -0.08), { stroke: shade(o.top, -0.3), 'stroke-width': 3 });
    }
    let pocketGlow = null;
    const apronG = h('g', {}, torso);
    if (o.apron) {
      const T = (d, fill, extra = {}) => h('path', Object.assign({ d, fill }, extra), apronG);
      grad(defs, 'linearGradient', id + 'ap', [[0, shade(o.apron, -0.35)], [0.4, shade(o.apron, 0.12)], [1, shade(o.apron, -0.4)]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      T('M -80 394 L 80 394 L 98 648 Q 0 664 -98 648 Z', `url(#${id}ap)`);
      T('M -80 394 Q -72 354 -46 340 M 80 394 Q 72 354 46 340', 'none', { stroke: shade(o.apron, -0.25), 'stroke-width': 12, 'stroke-linecap': 'round' });
      h('rect', { x: -66, y: 506, width: 132, height: 72, rx: 10, fill: shade(o.apron, -0.12) }, apronG);
      pocketGlow = h('rect', { x: -60, y: 506, width: 120, height: 18, rx: 8, fill: '#9fe0ff', opacity: 0 }, apronG);
      h('rect', { x: 8, y: 416, width: 72, height: 30, rx: 5, fill: '#F7F4EA' }, apronG);
      const nt = h('text', { x: 44, y: 437, 'text-anchor': 'middle', 'font-family': 'Inter, sans-serif', 'font-weight': 800, 'font-size': 16, fill: '#1B5E3B' }, apronG); nt.textContent = o.name || ''; texts.push([nt, 44]);
      const fm = h('text', { x: -40, y: 474, 'text-anchor': 'middle', 'font-family': 'Basement Grotesque, Inter, sans-serif', 'font-weight': 900, 'font-size': 15, fill: '#F7F4EA', opacity: 0.85 }, apronG); fm.textContent = 'FRESHMART'; texts.push([fm, -40]);
    }
    if (zombie) { T('M 30 430 q 20 -10 26 14 q -4 22 -22 14 q -16 -6 -4 -28 Z', '#3b1a16', { opacity: 0.6 }); T('M -70 546 q 14 -6 18 10 q -6 12 -18 4 Z', '#3b1a16', { opacity: 0.5 }); }
    // torso light overlays (key light side + ambient occlusion under the head)
    const torsoKey = h('ellipse', { cx: -60, cy: 440, rx: 90, ry: 150, fill: '#fff', opacity: 0.08, filter: B14 }, torso);
    h('ellipse', { cx: 0, cy: 360, rx: 130, ry: 34, fill: '#000', opacity: 0.35, filter: B14 }, torso);
    const torsoRim = h('path', { d: 'M 118 372 Q 140 480 122 598', stroke: '#fff', 'stroke-width': 8, fill: 'none', opacity: 0, filter: B2, 'stroke-linecap': 'round' }, torso);

    // ---------- arms ----------
    function arm(side) {
      const sh = h('g', {}, frontSlot);
      h('rect', { x: -32, y: -22, width: 64, height: 142, rx: 30, fill: sleeveF }, sh);
      const el = h('g', {}, sh);
      h('rect', { x: -30, y: -16, width: 60, height: 120, rx: 28, fill: sleeveF }, el);
      h('rect', { x: -33, y: 86, width: 66, height: 30, rx: 13, fill: shade(o.top, -0.15) }, el);
      const hand = h('g', { transform: 'translate(0 136)' }, el);
      h('ellipse', { cx: 0, cy: 0, rx: 31, ry: 33, fill: `url(#${id}lm)` }, hand);
      [-18, -6, 6, 18].forEach((x, i) => h('rect', { x: x - 7.5, y: 4, width: 15, height: 38 - Math.abs(i - 1.5) * 5, rx: 7.5, fill: `url(#${id}lm)` }, hand));
      h('rect', { x: side * 22 - 8, y: -18, width: 16, height: 34, rx: 8, fill: `url(#${id}lm)`, transform: `rotate(${-side * 38} ${side * 22} 0)` }, hand);
      h('ellipse', { cx: -8, cy: -12, rx: 12, ry: 7, fill: '#fff', opacity: zombie ? 0.18 : 0.12, filter: B2 }, hand);
      return { sh, el, hand };
    }
    const ARMS = [arm(-1), arm(1)];

    // ---------- head ----------
    const head = h('g', {}, headSlot);
    h('ellipse', { cx: 0, cy: 350, rx: 120, ry: 26, fill: '#000', opacity: 0.35, filter: B6 }, head);
    const hairBack = h('g', {}, head);
    h('circle', { cx: 0, cy: 180, r: 168, fill: `url(#${id}hd)` }, head);
    const headRim = h('path', { d: 'M 120 60 A 168 168 0 0 1 150 290', stroke: '#fff', 'stroke-width': 12, fill: 'none', opacity: 0, filter: B2, 'stroke-linecap': 'round' }, head);
    const spec = h('ellipse', { cx: -70, cy: 78, rx: 54, ry: 26, fill: '#fff', opacity: zombie ? 0.18 : 0.15, transform: 'rotate(-30 -70 78)', filter: B6 }, head);
    if (zombie) ['M -120 230 q 20 -10 30 6 q 10 16 30 8', 'M 110 120 q -16 10 -10 30 q 4 16 -14 26', 'M -40 300 q 6 -14 22 -10'].forEach((d) => h('path', { d, stroke: '#2a2f3a', 'stroke-width': 4, fill: 'none', opacity: 0.7, 'stroke-linecap': 'round' }, head));
    // the face lives on the sphere: it slides and squashes with head yaw, clipped to the head circle
    const fclip = h('clipPath', { id: id + 'fc' }, defs); h('circle', { cx: 0, cy: 180, r: 166 }, fclip);
    const faceClip = h('g', { 'clip-path': `url(#${id}fc)` }, head);
    const face = h('g', {}, faceClip);
    const eyes = [-1, 1].map((s) => {
      const g = h('g', {}, face);
      h('ellipse', { cx: 0, cy: 8, rx: 58, ry: 64, fill: '#000', opacity: 0.45, filter: B2 }, g);
      const ball = h('g', {}, g);
      h('ellipse', { cx: 0, cy: 0, rx: 52, ry: 58, fill: `url(#${id}sc)` }, ball);
      const pupil = h('g', {}, ball);
      if (zombie) { h('circle', { cx: 0, cy: 0, r: 20, fill: '#B7C1B4', opacity: 0.8 }, pupil); h('circle', { cx: 0, cy: 0, r: 8, fill: '#9DA89A', opacity: 0.7 }, pupil); }
      else { h('circle', { r: 23, fill: '#0b0b0b' }, pupil); h('circle', { r: 17, fill: '#24180f' }, pupil); h('circle', { r: 9, fill: '#000' }, pupil); h('circle', { cx: -8, cy: -9, r: 6.5, fill: '#fff' }, pupil); h('circle', { cx: 7, cy: 7, r: 2.5, fill: '#fff', opacity: 0.8 }, pupil); }
      h('ellipse', { cx: -16, cy: -26, rx: 14, ry: 8, fill: '#fff', opacity: 0.9, transform: 'rotate(-25 -16 -26)' }, ball);
      const cp = h('clipPath', { id: id + 'ec' + s }, defs); h('ellipse', { cx: 0, cy: 0, rx: 53, ry: 59 }, cp);
      const lidG = h('g', { 'clip-path': `url(#${id}ec${s})` }, g);
      const lid = h('rect', { x: -60, y: -126, width: 120, height: 60, fill: shade(skin, 0.12) }, lidG);
      const lidLine = h('rect', { x: -60, y: -70, width: 120, height: 5, fill: shade(skin, -0.5) }, lidG);
      if (o.lashes) h('path', { d: `M ${s * 42} -38 l ${s * 16} -12 M ${s * 48} -24 l ${s * 18} -6`, stroke: '#050505', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      return { g, ball, pupil, lid, lidLine, s };
    });
    const brows = o.brows ? [-1, 1].map((s) => ({ b: h('path', { d: 'M -30 6 Q 0 -10 30 4', stroke: zombie ? '#3a443d' : shade(o.hairColor, 0.14), 'stroke-width': 13, fill: 'none', 'stroke-linecap': 'round' }, face), s })) : [];
    const mouthG = h('g', {}, face);
    const mclip = h('clipPath', { id: id + 'mc' }, defs), mclipPath = h('path', {}, mclip);
    const mouth = h('path', { fill: zombie ? '#1d1414' : '#4A0E10' }, mouthG);
    const inner = h('g', { 'clip-path': `url(#${id}mc)` }, mouthG);
    const tongue = h('ellipse', { cx: 6, cy: 40, rx: 40, ry: 22, fill: zombie ? '#5b3d3d' : '#E25B5E' }, inner);
    const teeth = h('rect', { x: -80, y: -40, width: 160, height: 18, rx: 8, fill: zombie ? '#C9C3A8' : '#F7F7F2' }, inner);
    const lipLine = h('path', { fill: 'none', stroke: shade(skin, -0.6), 'stroke-width': 5, 'stroke-linecap': 'round' }, mouthG);
    const glasses = h('g', {}, face);

    // ---------- hair (front) ----------
    const hairG = h('g', {}, head);
    const rnd = STAGE.mulberry32(o.seed * 977 + 13);
    const lock = (cx, cy, len, ang, w, par = hairG) => {
      const a = (ang - 90) * Math.PI / 180, tx = cx + Math.cos(a) * len, ty = cy + Math.sin(a) * len, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
      h('path', { d: `M ${cx + nx} ${cy + ny} Q ${cx + nx * 1.3 + Math.cos(a) * len * 0.6} ${cy + ny * 1.3 + Math.sin(a) * len * 0.6} ${tx} ${ty} Q ${cx - nx * 1.1 + Math.cos(a) * len * 0.5} ${cy - ny * 1.1 + Math.sin(a) * len * 0.5} ${cx - nx} ${cy - ny} Z`, fill: HAIR }, par);
      h('path', { d: `M ${cx + nx * 0.2} ${cy + ny * 0.2} Q ${cx + Math.cos(a) * len * 0.55 + nx * 0.4} ${cy + Math.sin(a) * len * 0.55 + ny * 0.4} ${tx - Math.cos(a) * 6} ${ty - Math.sin(a) * 6}`, stroke: shade(o.hairColor, 0.35), 'stroke-width': 3, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, par);
    };
    const cap = (d, par = hairG) => h('path', { d, fill: HAIR }, par);
    if (o.hair === 'messy') { // soft wavy clumps like the reference
      cap('M -168 196 Q -180 40 -60 8 Q 0 -8 60 8 Q 180 40 168 196 Q 152 120 100 92 Q 40 70 -20 84 Q -112 100 -152 206 Z');
      for (let i = 0; i < 18; i++) { const u = i / 17, ang = -84 + u * 168, r = 132; const a = (ang - 90) * Math.PI / 180; lock(Math.cos(a) * r * 0.85, 162 + Math.sin(a) * r * 0.95, 64 + rnd() * 50, ang + (rnd() - 0.5) * 60, 30 + rnd() * 10); }
      lock(-30, 80, 96, 150, 24); lock(24, 84, 84, -160, 22); lock(-96, 120, 74, 210, 20); lock(70, 70, 70, 120, 20);
    } else if (o.hair === 'bun') {
      cap('M -170 206 Q -180 30 0 12 Q 180 30 170 206 Q 160 110 90 72 Q 30 58 -40 74 Q -120 100 -152 214 Z');
      const bun = h('g', {}, hairBack); h('circle', { cx: 30, cy: 0, r: 70, fill: HAIR }, bun);
      h('rect', { x: -26, y: 40, width: 110, height: 18, rx: 9, fill: o.tie || '#2FA36B' }, hairBack); lock(-110, 120, 90, 200, 12);
    } else if (o.hair === 'beanie') {
      grad(defs, 'linearGradient', id + 'bn', [[0, shade(o.hat || '#F2B134', -0.35)], [0.4, shade(o.hat || '#F2B134', 0.15)], [1, shade(o.hat || '#F2B134', -0.4)]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      for (let i = 0; i < 7; i++) lock(-150 + i * 50, 150, 40 + rnd() * 20, 180 + (rnd() - 0.5) * 40, 16);
      h('path', { d: 'M -168 176 Q -172 -12 0 -22 Q 172 -12 168 176 Z', fill: `url(#${id}bn)` }, hairG);
      h('rect', { x: -174, y: 122, width: 348, height: 58, rx: 26, fill: shade(o.hat || '#F2B134', -0.1) }, hairG);
      for (let i = -6; i <= 6; i++) h('path', { d: `M ${i * 26} 126 L ${i * 26} 176`, stroke: shade(o.hat || '#F2B134', -0.3), 'stroke-width': 4 }, hairG);
      h('circle', { cx: 0, cy: -32, r: 32, fill: shade(o.hat || '#F2B134', 0.1) }, hairG);
    } else if (o.hair === 'old') {
      [-1, 1].forEach((s) => { for (let i = 0; i < 5; i++) lock(s * (148 + i * 3), 130 + i * 20, 22 + rnd() * 10, s * (70 + i * 14), 11, hairBack); });
      if (o.glasses !== false) { [-1, 1].forEach((s) => h('circle', { cx: s * 66, cy: 172, r: 60, fill: 'none', stroke: '#C9A44A', 'stroke-width': 6, opacity: 0.9, class: 'gl' + s }, glasses)); h('path', { d: 'M -8 168 Q 0 160 8 168', stroke: '#C9A44A', 'stroke-width': 6, fill: 'none' }, glasses); }
    } else if (o.hair === 'curly') {
      for (let i = 0; i < 26; i++) { const ang = -100 + rnd() * 200, r = 120 + rnd() * 40; const a = (ang - 90) * Math.PI / 180; h('circle', { cx: Math.cos(a) * r, cy: 170 + Math.sin(a) * r, r: 34 + rnd() * 16, fill: HAIR }, i < 10 ? hairBack : hairG); }
    } else if (o.hair === 'side') {
      cap('M -168 206 Q -182 20 10 6 Q 178 24 168 196 Q 140 90 40 96 Q -60 100 -130 140 Q -150 160 -152 214 Z'); lock(60, 70, 120, -110, 30);
    }
    // back of head (shown when turned away)
    const backHair = h('circle', { cx: 0, cy: 170, r: 170, fill: o.hair === 'old' ? `url(#${id}hd)` : o.hair === 'beanie' ? shade(o.hat || '#F2B134', -0.1) : HAIR, opacity: 0 }, head);

    // ---------- leg IK ----------
    function solve(hx, hy, fx, fy, bendDir) {
      let dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy); const maxD = L1 + L2 - 0.5;
      if (d > maxD) { dx *= maxD / d; dy *= maxD / d; d = maxD; }
      const a0 = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
      const ka = a0 - bendDir * k, kx = hx + Math.cos(ka) * L1, ky = hy + Math.sin(ka) * L1;
      const r1 = Math.atan2(-(kx - hx), ky - hy) * 180 / Math.PI;           // rotation of the thigh (0 = straight down)
      const r2 = Math.atan2(-(hx + dx - kx), hy + dy - ky) * 180 / Math.PI - r1;
      return [r1, r2];
    }
    // gait: returns foot targets relative to the hips' ground point, plus hip bob and arm swing
    function gait(g, side) {
      const kind = g.kind || 'walk', stride = g.stride == null ? 150 : g.stride;
      const P = { walk: [0.62, 34, 14], run: [0.38, 90, 30], sneak: [0.7, 22, 6], shamble: [0.7, 18, 10] }[kind];
      const [stance, lift, bob] = P;
      const q = (((g.phase + (side > 0 ? 0.5 : 0)) % 1) + 1) % 1;
      let x, y;
      if (q < stance) { x = stride / 2 - (q / stance) * stride; y = 0; }
      else { const u = (q - stance) / (1 - stance); x = -stride / 2 + u * stride; y = -Math.sin(u * Math.PI) * lift * (kind === 'shamble' ? 0.6 : 1); if (kind === 'shamble' && side > 0) x *= 0.55; }
      return { x, y, q, bob, stance };
    }

    const st = {};
    function set(s) {
      Object.assign(st, s);
      let yaw = s.yaw || 0; const flip = yaw < 0 || (!!s.flip && yaw === 0); const ay = Math.abs(yaw); const away = ay > 1; const side = Math.min(1, ay);
      const sc = s.scale || 1;
      svg.style.transform = `translate(${(s.x || 0) - 300}px, ${(s.y || 0) - 1040}px) scale(${sc * (flip ? -1 : 1)}, ${sc})`;
      texts.forEach(([e, cx]) => e.setAttribute('transform', flip ? `translate(${2 * cx} 0) scale(-1 1)` : ''));
      const crouch = s.crouch || 0, sq = s.squash || [1, 1];

      // gait + hips
      let bob = s.bob || 0, swing = 0; const feet = [];
      const g = s.gait;
      for (let i = 0; i < 2; i++) {
        const sideSign = i === 0 ? -1 : 1, hipX = sideSign * 46 * (1 - side * 0.65);
        if (s.feet) { feet.push([s.feet[i][0], s.feet[i][1]]); continue; }
        if (g && g.stride !== 0) {
          const f = gait(g, sideSign), fwd = side; // forward travel shows as x in profile, as a small depth shuffle when facing camera
          feet.push([hipX + f.x * fwd, GROUND - SOLE + 20 + f.y - (1 - fwd) * Math.max(0, -f.x) * 0.08]);
          if (i === 0) { const ph = g.phase * Math.PI * 4; bob -= Math.abs(Math.cos(ph)) * f.bob * 0 + (Math.cos(ph) * 0.5 + 0.5) * f.bob; swing = Math.sin(g.phase * Math.PI * 2); }
        } else feet.push([hipX + (s.stance || 0) * sideSign, GROUND - SOLE + 20]);
      }
      const hipY = HIP_Y + crouch * 150 - bob * -1;
      LEGS.forEach((L, i) => {
        const sideSign = i === 0 ? -1 : 1, hipX = sideSign * 46 * (1 - side * 0.65);
        const [fx, fy] = feet[i];
        const [r1, r2] = solve(hipX, hipY + (s.bodyY || 0), fx, fy, 1);
        L.thigh.setAttribute('transform', `translate(${hipX} ${hipY + (s.bodyY || 0)}) rotate(${r1})`);
        L.knee.setAttribute('transform', `translate(0 ${L1}) rotate(${r2})`);
        L.foot.setAttribute('transform', `translate(0 ${L2}) rotate(${-(r1 + r2) + (s.toe ? s.toe[i] : 0)})`);
        L.shoe.setAttribute('transform', `scale(${1 - side * 0.0 + (1 - side) * -0.25}, 1)`);
        const ground = GROUND + 2; footShadows[i].setAttribute('cx', fx); footShadows[i].setAttribute('opacity', 0.35 * clamp(1 - (ground - 30 - fy) / 160, 0, 1));
      });
      // far leg goes behind when turned
      const farLeg = LEGS[flip ? 1 : 0]; if (side > 0.5) backSlot.appendChild(farLeg.g); else legSlot.insertBefore(farLeg.g, legSlot.firstChild);

      // upper body: everything above the hips follows hipY change
      const upY = hipY - HIP_Y + (s.bodyY || 0);
      const lean = s.lean || 0;
      const up = `translate(0 ${upY}) rotate(${lean} 0 ${HIP_Y})`;
      torso.setAttribute('transform', `${up} translate(0 ${HIP_Y}) scale(${1 - side * 0.22} 1) translate(0 ${-HIP_Y}) translate(${side * 10} 0)`);
      apronG.style.opacity = away ? 0 : 1; apronG.setAttribute('transform', `translate(${side * 34} 0) translate(0 500) scale(${1 - side * 0.3} 1) translate(0 -500)`);
      // arms: shoulder x narrows with yaw; far arm goes behind torso
      const swingA = g ? swing * (g.kind === 'run' ? 46 : g.kind === 'sneak' ? 10 : 22) * (s.armSwing == null ? 1 : s.armSwing) : 0;
      ARMS.forEach((A, i) => {
        const sideSign = i === 0 ? -1 : 1; const near = flip ? sideSign < 0 : sideSign > 0;
        const sx = sideSign * 110 * (1 - side * 0.62) + side * 14;
        const def = g ? (g.kind === 'run' ? [10, -80] : [8, -14]) : [8, 6];
        let [a1, a2] = (i === 0 ? s.armL : s.armR) || def;
        if (g && !(i === 0 ? s.armL : s.armR)) a1 = def[0] + (i === 0 ? -swingA : swingA) * (side > 0.3 ? 1 : 0.4);
        // front view: a1 = how far the arm lifts outward; side view: a1 = how far it swings forward (toward facing)
        const prof = side > 0.3;
        A.sh.setAttribute('transform', `${up} translate(${sx} 386) rotate(${prof ? -a1 : (i === 0 ? a1 : -a1)})`);
        A.el.setAttribute('transform', `translate(0 112) rotate(${prof ? a2 : (i === 0 ? a2 : -a2)})`);
        if (side > 0.45 && !near) backSlot.appendChild(A.sh); else frontSlot.appendChild(A.sh);
        const hp = i === 0 ? s.handL : s.handR; A.hand.setAttribute('transform', `translate(0 136) ${hp || ''}`);
      });

      // head: tilt + yaw (face slides across the sphere)
      const hy = s.headYaw == null ? yaw : s.headYaw, hside = clamp(Math.abs(hy), 0, 1), hAway = Math.abs(hy) > 1;
      head.setAttribute('transform', `${up} translate(${(s.headX || 0) + hside * 12} ${s.headY || 0}) rotate(${s.headTilt || 0} 0 330)`);
      const phi = hside * 1.08;                       // head rotation in radians (0 .. ~72 degrees)
      const proj = (theta) => ({ x: 150 * Math.sin(theta + phi), k: Math.cos(theta + phi) });
      face.style.opacity = hAway ? 0 : 1; backHair.setAttribute('opacity', hAway ? 1 : 0);
      hairG.setAttribute('transform', `translate(${-hside * 22} 0)`);
      const [lx, ly] = s.look || [0, 0], lidv = Math.max(s.lid || 0, s.blink || 0), es = s.eyeScale || 1;
      eyes.forEach((e) => {
        const P = proj(e.s * 0.47); e.g.style.opacity = P.k < 0.12 ? 0 : 1;
        e.g.setAttribute('transform', `translate(${P.x} 170) scale(${Math.max(0.05, P.k)} 1)`);
        e.ball.setAttribute('transform', `scale(${es})`);
        e.pupil.setAttribute('transform', `translate(${lx * 18} ${ly * 18}) scale(${s.pupil || 1})`);
        const ly2 = -72 + lidv * 128; e.lid.setAttribute('y', ly2 - 60); e.lidLine.setAttribute('y', ly2 - 3);
      });
      brows.forEach(({ b, s: sd }) => { const P = proj(sd * 0.47); b.style.opacity = P.k < 0.12 ? 0 : 1; b.setAttribute('transform', `translate(${P.x} ${90 - (s.browUp || 0) * 16 + (s.lid || 0) * 14}) rotate(${(s.brow || 0) * sd * 14}) scale(${Math.max(0.05, P.k)} 1)`); });
      glasses.querySelectorAll('circle').forEach((c, i) => { const sd = i === 0 ? -1 : 1, P = proj(sd * 0.47); c.style.opacity = P.k < 0.12 ? 0 : 0.9; c.setAttribute('transform', `translate(${P.x - sd * 66} 0) translate(${sd * 66} 172) scale(${Math.max(0.05, P.k)} 1) translate(${-sd * 66} -172)`); });
      glasses.querySelectorAll('path').forEach((pth) => { const P = proj(0); pth.setAttribute('transform', `translate(${P.x} 0) scale(${P.k} 1)`); });
      const m = s.mouth || {}, op = m.open || 0, sm = m.smile == null ? 0.35 : m.smile, wd = (m.wide || 1) * 58;
      const up2 = -sm * 14, lo = up2 + 6 + op * 56 + Math.max(0, sm) * op * 10;
      const dm = `M ${-wd} ${-sm * 6} Q 0 ${up2 + sm * 10} ${wd} ${-sm * 6} Q 0 ${lo + 12} ${-wd} ${-sm * 6} Z`;
      if (op < 0.04) { mouth.setAttribute('d', ''); mclipPath.setAttribute('d', ''); lipLine.setAttribute('d', `M ${-wd * 0.8} ${-sm * 4} Q 0 ${sm * 14} ${wd * 0.8} ${-sm * 4}`); lipLine.setAttribute('opacity', 1); }
      else { mouth.setAttribute('d', dm); mclipPath.setAttribute('d', dm); lipLine.setAttribute('opacity', 0); teeth.setAttribute('y', up2 + sm * 4 - 14); tongue.setAttribute('cy', lo + 2); }
      { const P = proj(0); mouthG.setAttribute('transform', `translate(${P.x * 0.92 + (s.mouthX || 0)} 284) scale(${Math.max(0.2, P.k)} 1)`); }

      // lighting: key light direction moves the head highlight and the torso key; rim light on the far side
      const L = s.light || {}, lxx = L.x == null ? -0.5 : L.x, lyy = L.y == null ? -0.6 : L.y, kx = flip ? -lxx : lxx;
      headG.setAttribute('cx', `${50 + kx * 18}%`); headG.setAttribute('cy', `${50 + lyy * 24}%`); headG.setAttribute('fx', `${50 + kx * 20}%`); headG.setAttribute('fy', `${50 + lyy * 26}%`);
      spec.setAttribute('transform', `translate(${(kx + 0.5) * 120} ${(lyy + 0.6) * 90}) rotate(-30 -70 78)`); spec.setAttribute('opacity', (zombie ? 0.18 : 0.15) * (L.k == null ? 1 : L.k));
      torsoKey.setAttribute('cx', kx * 80); torsoKey.setAttribute('opacity', 0.1 * (L.k == null ? 1 : L.k)); if (L.color) torsoKey.setAttribute('fill', L.color);
      const R = s.rim || {}, rk = R.k || 0, rsx = (R.side == null ? -Math.sign(kx || 1) : R.side) * (flip ? -1 : 1);
      headRim.setAttribute('opacity', rk); headRim.setAttribute('stroke', R.color || '#fff'); headRim.setAttribute('transform', rsx < 0 ? 'scale(-1 1)' : '');
      torsoRim.setAttribute('opacity', rk * 0.8); torsoRim.setAttribute('stroke', R.color || '#fff'); torsoRim.setAttribute('transform', rsx < 0 ? 'scale(-1 1)' : '');

      body.setAttribute('transform', `translate(0 ${GROUND}) scale(${sq[0]} ${sq[1]}) translate(0 ${-GROUND})`);
      if (pocketGlow) pocketGlow.setAttribute('opacity', s.phoneGlow || 0);
      shadow.setAttribute('opacity', s.shadow == null ? 0.4 : s.shadow); shadow.setAttribute('rx', 150 + crouch * 30);
    }
    set({});
    return { svg, set, state: st, opt: o, hands: ARMS.map((A) => A.hand) };
  }

  function blinkAt(t, period = 3.7, phase = 0) { const p = ((t + phase) % period + period) % period; return p < 0.14 ? Math.sin(p / 0.14 * Math.PI) : 0; }
  window.TOON = { make, blinkAt, shade, GROUND: 900 };
})();
