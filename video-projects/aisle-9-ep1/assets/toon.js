// toon.js: the AISLE 9 character rig. A glossy round-headed figure (big white eyes, soft 3D shading) drawn in SVG, with
// swappable hair, outfit and colours, and a pose you set every frame. Pure function of the state you pass: deterministic.
//   const c = TOON.make(parent, { hair:'messy', outfit:'hoodie', top:'#E8382F', ... });
//   c.set({ x, y, scale, lean, headTilt, look:[x,y], lid, mouth:{open,smile,wide}, armL:[a,b], armR:[a,b], legL, legR, blink })
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  let UID = 0;
  const h = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const shade = (hex, k) => { // k<0 darker, k>0 lighter
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  };
  function radial(defs, id, stops, cx = '38%', cy = '30%', r = '75%') {
    const g = h('radialGradient', { id, cx, cy, r, fx: cx, fy: cy }, defs);
    stops.forEach(([o, c, a]) => h('stop', { offset: o, 'stop-color': c, 'stop-opacity': a == null ? 1 : a }, g));
    return `url(#${id})`;
  }
  function linear(defs, id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) {
    const g = h('linearGradient', { id, x1, y1, x2, y2 }, defs);
    stops.forEach(([o, c, a]) => h('stop', { offset: o, 'stop-color': c, 'stop-opacity': a == null ? 1 : a }, g));
    return `url(#${id})`;
  }

  const DEF = {
    skin: '#161616', hair: 'messy', hairColor: '#0d0d0d', outfit: 'hoodie', top: '#E8382F', pants: '#2B3550',
    shoe: '#C9302C', sole: '#F2F0EC', apron: null, zombie: false, seed: 1, name: '', brows: true, lashes: false,
  };

  function make(parent, opt) {
    const o = Object.assign({}, DEF, opt || {});
    const id = 't' + (++UID);
    const svg = h('svg', { viewBox: '-300 -120 600 1060', width: 600, height: 1060, style: 'position:absolute;left:0;top:0;overflow:visible;transform-origin:300px 1000px' });
    parent.appendChild(svg);
    const defs = h('defs', {}, svg);
    // soft blur for highlights and contact shadow
    const fb = h('filter', { id: id + 'b', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); h('feGaussianBlur', { stdDeviation: 8 }, fb);
    const fb2 = h('filter', { id: id + 'b2', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); h('feGaussianBlur', { stdDeviation: 3 }, fb2);
    const fb3 = h('filter', { id: id + 'b3', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); h('feGaussianBlur', { stdDeviation: 16 }, fb3);

    const skin = o.zombie ? (o.skin === DEF.skin ? '#55615A' : o.skin) : o.skin;
    const skinFill = radial(defs, id + 'sk', [[0, shade(skin, o.zombie ? 0.35 : 0.30)], [0.45, skin], [1, shade(skin, -0.6)]], '36%', '28%', '78%');
    const limbSkin = linear(defs, id + 'ls', [[0, shade(skin, -0.4)], [0.35, shade(skin, 0.2)], [1, shade(skin, -0.5)]]);
    const topFill = linear(defs, id + 'tp', [[0, shade(o.top, -0.35)], [0.32, shade(o.top, 0.12)], [0.7, o.top], [1, shade(o.top, -0.45)]]);
    const sleeveFill = linear(defs, id + 'sl', [[0, shade(o.top, -0.4)], [0.4, shade(o.top, 0.1)], [1, shade(o.top, -0.5)]]);
    const pantFill = linear(defs, id + 'pa', [[0, shade(o.pants, -0.45)], [0.4, shade(o.pants, 0.12)], [1, shade(o.pants, -0.5)]]);
    const hairFill = radial(defs, id + 'hr', [[0, shade(o.hairColor, 0.28)], [0.5, o.hairColor], [1, shade(o.hairColor, -0.5)]], '40%', '25%', '80%');
    const scleraFill = radial(defs, id + 'sc', o.zombie ? [[0, '#E9EFE6'], [0.7, '#C9D3C6'], [1, '#8F9B8C']] : [[0, '#FFFFFF'], [0.72, '#F1F1F1'], [1, '#B9B9BE']], '45%', '40%', '62%');

    const root = h('g', {}, svg);
    const texts = [];
    // contact shadow on the floor
    const shadow = h('ellipse', { cx: 0, cy: 905, rx: 190, ry: 30, fill: '#000', opacity: 0.38, filter: `url(#${id}b3)` }, root);
    const body = h('g', {}, root); // lean pivots at the feet

    // ---------- legs ----------
    const legs = [];
    [-1, 1].forEach((s) => {
      const g = h('g', {}, body);
      h('rect', { x: -38, y: -10, width: 76, height: 255, rx: 30, fill: pantFill }, g);
      h('path', { d: 'M -4 20 L -2 230', stroke: shade(o.pants, -0.5), 'stroke-width': 3, opacity: 0.5 }, g);
      h('rect', { x: -41, y: 214, width: 82, height: 30, rx: 12, fill: shade(o.pants, 0.18) }, g); // rolled cuff
      // shoe
      const sh = h('g', { transform: `translate(${s * 10} 246)` }, g);
      h('path', { d: 'M -46 6 Q -48 -18 -18 -22 L 24 -22 Q 44 -20 52 4 Q 76 14 74 34 L -46 34 Z', fill: radial(defs, id + 'sh' + s, [[0, shade(o.shoe, 0.25)], [0.6, o.shoe], [1, shade(o.shoe, -0.45)]], '45%', '25%') }, sh);
      h('path', { d: 'M -50 26 L 78 26 Q 80 44 64 46 L -44 46 Q -54 44 -50 26 Z', fill: o.sole }, sh);
      h('path', { d: 'M 34 -8 Q 60 2 70 22', stroke: o.sole, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, sh);
      h('path', { d: 'M -6 -14 L 26 -8 M -2 -4 L 30 2', stroke: o.sole, 'stroke-width': 6, 'stroke-linecap': 'round' }, sh);
      legs.push(g);
    });

    // ---------- torso ----------
    const torso = h('g', {}, body);
    const T = (d, fill, extra = {}) => h('path', Object.assign({ d, fill }, extra), torso);
    if (o.outfit === 'pajamas') {
      T('M -112 360 Q -128 470 -116 600 Q 0 618 116 600 Q 128 470 112 360 Q 60 335 0 335 Q -60 335 -112 360 Z', topFill);
      for (let i = -3; i <= 3; i++) h('path', { d: `M ${i * 32} 345 L ${i * 32 + 6} 605`, stroke: shade(o.top, 0.45), 'stroke-width': 9, opacity: 0.55 }, torso);
      T('M -40 348 L 0 400 L 40 348', 'none', { stroke: shade(o.top, -0.4), 'stroke-width': 10, 'stroke-linejoin': 'round' });
    } else if (o.outfit === 'cardigan') {
      T('M -110 362 Q -126 470 -114 598 Q 0 614 114 598 Q 126 470 110 362 Q 60 336 0 336 Q -60 336 -110 362 Z', topFill);
      T('M -26 340 L 0 590 L 26 340 Z', '#E9E2D0');
      T('M -6 340 L 0 420 L 6 340 Z', shade(o.top, -0.35));
      [420, 470, 520].forEach((y) => h('circle', { cx: 30, cy: y, r: 7, fill: '#3a2a1c' }, torso));
      h('rect', { x: -96, y: 470, width: 56, height: 48, rx: 10, fill: shade(o.top, -0.15) }, torso);
    } else { // hoodie
      T('M -112 362 Q -130 470 -116 586 Q 0 600 116 586 Q 130 470 112 362 Q 60 334 0 334 Q -60 334 -112 362 Z', topFill);
      h('rect', { x: -118, y: 566, width: 236, height: 40, rx: 16, fill: shade(o.top, -0.12) }, torso); // ribbed hem
      // hood around the neck
      T('M -86 352 Q -70 318 0 316 Q 70 318 86 352 Q 60 382 0 384 Q -60 382 -86 352 Z', shade(o.top, -0.05));
      T('M -50 350 Q 0 330 50 350 L 0 410 Z', shade(skin, -0.3));
      // drawstrings
      [-18, 18].forEach((x) => { h('path', { d: `M ${x} 372 Q ${x * 1.1} 420 ${x} 462`, stroke: shade(o.top, -0.3), 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, torso); h('rect', { x: x - 4, y: 458, width: 8, height: 16, rx: 3, fill: shade(o.top, -0.4) }, torso); });
      // kangaroo pocket
      T('M -72 500 Q -64 476 -40 476 L 40 476 Q 64 476 72 500 L 82 560 L -82 560 Z', shade(o.top, -0.08), { stroke: shade(o.top, -0.3), 'stroke-width': 3 });
    }
    if (o.apron) { // FreshMart apron with a name tag
      const ap = linear(defs, id + 'ap', [[0, shade(o.apron, -0.35)], [0.4, shade(o.apron, 0.12)], [1, shade(o.apron, -0.4)]]);
      T('M -78 390 L 78 390 L 96 640 Q 0 656 -96 640 Z', ap);
      T('M -78 390 Q -70 352 -46 340 M 78 390 Q 70 352 46 340', 'none', { stroke: shade(o.apron, -0.25), 'stroke-width': 12, 'stroke-linecap': 'round' });
      h('rect', { x: -66, y: 500, width: 132, height: 70, rx: 10, fill: shade(o.apron, -0.12) }, torso); // pocket
      const pocketGlow = h('rect', { x: -60, y: 500, width: 120, height: 18, rx: 8, fill: '#9fe0ff', opacity: 0 }, torso);
      h('rect', { x: 8, y: 412, width: 72, height: 30, rx: 5, fill: '#F7F4EA' }, torso);
      const nt = h('text', { x: 44, y: 434, 'text-anchor': 'middle', 'font-family': 'Inter, sans-serif', 'font-weight': 800, 'font-size': 16, fill: '#1B5E3B' }, torso); nt.textContent = o.name || ''; texts.push([nt, 44]);
      const fm = h('text', { x: -40, y: 470, 'text-anchor': 'middle', 'font-family': 'Basement Grotesque, Inter, sans-serif', 'font-weight': 900, 'font-size': 15, fill: '#F7F4EA', opacity: 0.85 }, torso); fm.textContent = 'FRESHMART'; texts.push([fm, -40]);
      torso.__pocketGlow = pocketGlow;
    }
    if (o.zombie) { // stains
      h('path', { d: 'M 30 430 q 20 -10 26 14 q -4 22 -22 14 q -16 -6 -4 -28 Z', fill: '#3b1a16', opacity: 0.6 }, torso);
      h('path', { d: 'M -70 540 q 14 -6 18 10 q -6 12 -18 4 Z', fill: '#3b1a16', opacity: 0.5 }, torso);
    }

    // ---------- arms ----------
    function arm(side) {
      const sh = h('g', {}, body);
      h('rect', { x: -30, y: -20, width: 60, height: 140, rx: 28, fill: sleeveFill }, sh);
      const el = h('g', {}, sh);
      h('rect', { x: -28, y: -14, width: 56, height: 118, rx: 26, fill: sleeveFill }, el);
      h('rect', { x: -31, y: 86, width: 62, height: 30, rx: 13, fill: shade(o.top, -0.15) }, el); // cuff
      const hand = h('g', { transform: 'translate(0 136)' }, el);
      // mitten hand with four fingers and a thumb
      h('ellipse', { cx: 0, cy: 0, rx: 30, ry: 32, fill: limbSkin }, hand);
      [-18, -6, 6, 18].forEach((x, i) => h('rect', { x: x - 7.5, y: 4, width: 15, height: 38 - Math.abs(i - 1.5) * 5, rx: 7.5, fill: limbSkin }, hand));
      h('rect', { x: side * 22 - 8, y: -18, width: 16, height: 34, rx: 8, fill: limbSkin, transform: `rotate(${-side * 38} ${side * 22} 0)` }, hand);
      h('ellipse', { cx: -8, cy: -12, rx: 12, ry: 7, fill: '#fff', opacity: o.zombie ? 0.18 : 0.12, filter: `url(#${id}b2)` }, hand);
      return { sh, el, hand };
    }
    const AL = arm(-1), AR = arm(1);

    // ---------- head ----------
    const head = h('g', {}, body);
    h('ellipse', { cx: 0, cy: 345, rx: 120, ry: 26, fill: '#000', opacity: 0.35, filter: `url(#${id}b)` }, head); // chin shadow
    // back hair (behind head)
    const hairBack = h('g', {}, head);
    h('circle', { cx: 0, cy: 180, r: 165, fill: skinFill }, head);
    // rim light + specular
    h('path', { d: 'M 120 80 A 165 165 0 0 1 150 260', stroke: shade(skin, 0.55), 'stroke-width': 8, fill: 'none', opacity: 0.35, filter: `url(#${id}b2)` }, head);
    h('ellipse', { cx: -70, cy: 80, rx: 50, ry: 26, fill: '#fff', opacity: o.zombie ? 0.18 : 0.14, transform: 'rotate(-30 -70 80)', filter: `url(#${id}b)` }, head);
    if (o.zombie) { // dark veins
      ['M -120 230 q 20 -10 30 6 q 10 16 30 8', 'M 110 120 q -16 10 -10 30 q 4 16 -14 26', 'M -40 300 q 6 -14 22 -10'].forEach((d) => h('path', { d, stroke: '#2a2f3a', 'stroke-width': 4, fill: 'none', opacity: 0.7, 'stroke-linecap': 'round' }, head));
    }
    // ears hint
    // eyes
    const face = h('g', {}, head);
    const eyes = [];
    [-1, 1].forEach((s) => {
      const g = h('g', { transform: `translate(${s * 66} 170)` }, face);
      h('ellipse', { cx: 0, cy: 8, rx: 58, ry: 64, fill: '#000', opacity: 0.45, filter: `url(#${id}b2)` }, g); // socket shade
      const ball = h('g', {}, g);
      h('ellipse', { cx: 0, cy: 0, rx: 52, ry: 58, fill: scleraFill }, ball);
      const pupil = h('g', {}, ball);
      if (o.zombie) {
        h('circle', { cx: 0, cy: 0, r: 20, fill: '#B7C1B4', opacity: 0.8 }, pupil);
        h('circle', { cx: 0, cy: 0, r: 8, fill: '#9DA89A', opacity: 0.7 }, pupil);
      } else {
        h('circle', { cx: 0, cy: 0, r: 22, fill: '#0b0b0b' }, pupil);
        h('circle', { cx: 0, cy: 0, r: 16, fill: '#24180f' }, pupil);
        h('circle', { cx: 0, cy: 0, r: 9, fill: '#000' }, pupil);
        h('circle', { cx: -8, cy: -9, r: 6.5, fill: '#fff' }, pupil);
        h('circle', { cx: 7, cy: 7, r: 2.5, fill: '#fff', opacity: 0.8 }, pupil);
      }
      h('ellipse', { cx: -16, cy: -24, rx: 14, ry: 8, fill: '#fff', opacity: 0.9, transform: 'rotate(-25 -16 -24)' }, ball); // glossy shine
      // eyelid (skin coloured, slides down for deadpan / blink)
      const clipId = id + 'ec' + s; const cp = h('clipPath', { id: clipId }, defs); h('ellipse', { cx: 0, cy: 0, rx: 53, ry: 59 }, cp);
      const lidG = h('g', { 'clip-path': `url(#${clipId})` }, g);
      const lid = h('rect', { x: -60, y: -120, width: 120, height: 60, fill: shade(skin, 0.12) }, lidG);
      const lidLine = h('rect', { x: -60, y: -64, width: 120, height: 5, fill: shade(skin, -0.5) }, lidG);
      if (o.lashes) h('path', { d: `M ${s * 40} -36 l ${s * 16} -12 M ${s * 46} -22 l ${s * 18} -6`, stroke: '#050505', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      eyes.push({ g, ball, pupil, lid, lidLine });
    });
    // brows
    const brows = [];
    if (o.brows) [-1, 1].forEach((s) => {
      const b = h('path', { d: 'M -30 6 Q 0 -10 30 4', stroke: o.zombie ? '#3a443d' : shade(o.hairColor, 0.12), 'stroke-width': 13, fill: 'none', 'stroke-linecap': 'round' }, face);
      brows.push({ b, s });
    });
    // mouth
    const mouthG = h('g', { transform: 'translate(0 282)' }, face);
    const mclip = id + 'mc'; const mcp = h('clipPath', { id: mclip }, defs); const mclipPath = h('path', {}, mcp);
    const mouth = h('path', { fill: o.zombie ? '#1d1414' : '#4A0E10' }, mouthG);
    const inner = h('g', { 'clip-path': `url(#${mclip})` }, mouthG);
    const tongue = h('ellipse', { cx: 6, cy: 40, rx: 40, ry: 22, fill: o.zombie ? '#5b3d3d' : '#E25B5E' }, inner);
    const teeth = h('rect', { x: -80, y: -40, width: 160, height: 18, rx: 8, fill: o.zombie ? '#C9C3A8' : '#F7F7F2' }, inner);
    const lipLine = h('path', { fill: 'none', stroke: shade(skin, -0.6), 'stroke-width': 5, 'stroke-linecap': 'round' }, mouthG);

    // ---------- hair (front) ----------
    const hairG = h('g', {}, head);
    const rnd = STAGE.mulberry32(o.seed * 977 + 13);
    const lock = (cx, cy, len, ang, w, par = hairG) => {
      // a teardrop lock from (cx,cy) pointing at angle ang (deg, 0 = up)
      const a = (ang - 90) * Math.PI / 180, tx = cx + Math.cos(a) * len, ty = cy + Math.sin(a) * len;
      const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
      const d = `M ${cx + nx} ${cy + ny} Q ${cx + nx * 1.3 + Math.cos(a) * len * 0.6} ${cy + ny * 1.3 + Math.sin(a) * len * 0.6} ${tx} ${ty} Q ${cx - nx * 1.1 + Math.cos(a) * len * 0.5} ${cy - ny * 1.1 + Math.sin(a) * len * 0.5} ${cx - nx} ${cy - ny} Z`;
      h('path', { d, fill: hairFill }, par);
      h('path', { d: `M ${cx + nx * 0.2} ${cy + ny * 0.2} Q ${cx + Math.cos(a) * len * 0.55 + nx * 0.4} ${cy + Math.sin(a) * len * 0.55 + ny * 0.4} ${tx - Math.cos(a) * 6} ${ty - Math.sin(a) * 6}`, stroke: shade(o.hairColor, 0.35), 'stroke-width': 3, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, par);
    };
    const cap = (d, par = hairG) => { h('path', { d, fill: hairFill }, par); };
    const HS = o.hair;
    if (HS === 'messy') {
      cap('M -165 190 Q -175 40 -60 10 Q 0 -6 60 10 Q 175 40 165 190 Q 150 120 100 92 Q 40 70 -20 84 Q -110 100 -150 200 Z');
      for (let i = 0; i < 16; i++) { const u = i / 15, ang = -80 + u * 160, r = 130; const a = (ang - 90) * Math.PI / 180; lock(Math.cos(a) * r * 0.85, 160 + Math.sin(a) * r * 0.95, 70 + rnd() * 60, ang + (rnd() - 0.5) * 50, 26 + rnd() * 10); }
      lock(-30, 80, 90, 150, 22); lock(20, 84, 80, -160, 20); lock(-90, 120, 70, 210, 18);
    } else if (HS === 'bun') { // smooth hair pulled back into a top bun, a few loose strands
      cap('M -168 200 Q -178 30 0 12 Q 178 30 168 200 Q 160 110 90 72 Q 30 58 -40 74 Q -120 100 -150 210 Z');
      const bun = h('g', {}, hairBack); h('circle', { cx: 30, cy: 0, r: 70, fill: hairFill }, bun);
      h('path', { d: 'M -20 -20 Q 30 -60 80 -10', stroke: shade(o.hairColor, 0.35), 'stroke-width': 4, fill: 'none', opacity: 0.5 }, bun);
      h('rect', { x: -26, y: 40, width: 110, height: 18, rx: 9, fill: o.tie || '#2FA36B' }, hairBack);
      lock(-110, 120, 90, 200, 12); lock(-60, 84, 70, 215, 9);
      for (let i = 0; i < 6; i++) { const ang = -60 + i * 24; const a = (ang - 90) * Math.PI / 180; h('path', { d: `M ${Math.cos(a) * 30} ${120 + Math.sin(a) * 40} Q ${Math.cos(a) * 100} ${120 + Math.sin(a) * 110} ${Math.cos(a) * 150} ${150 + Math.sin(a) * 120}`, stroke: shade(o.hairColor, 0.3), 'stroke-width': 3, fill: 'none', opacity: 0.4 }, hairG); }
    } else if (HS === 'beanie') {
      const bf = linear(defs, id + 'bn', [[0, shade(o.hat || '#F2B134', -0.35)], [0.4, shade(o.hat || '#F2B134', 0.15)], [1, shade(o.hat || '#F2B134', -0.4)]]);
      for (let i = 0; i < 7; i++) lock(-150 + i * 50, 150, 40 + rnd() * 20, 180 + (rnd() - 0.5) * 40, 16);
      h('path', { d: 'M -166 170 Q -170 -10 0 -20 Q 170 -10 166 170 Z', fill: bf }, hairG);
      h('rect', { x: -172, y: 120, width: 344, height: 56, rx: 26, fill: shade(o.hat || '#F2B134', -0.1) }, hairG);
      for (let i = -6; i <= 6; i++) h('path', { d: `M ${i * 26} 124 L ${i * 26} 172`, stroke: shade(o.hat || '#F2B134', -0.3), 'stroke-width': 4 }, hairG);
      h('circle', { cx: 0, cy: -30, r: 30, fill: shade(o.hat || '#F2B134', 0.1) }, hairG);
    } else if (HS === 'old') { // bald dome, white tufts at the sides, glasses
      [-1, 1].forEach((s) => { for (let i = 0; i < 5; i++) lock(s * (146 + i * 3), 130 + i * 20, 22 + rnd() * 10, s * (70 + i * 14), 11, hairBack); });
      if (o.glasses !== false) [-1, 1].forEach((s) => h('circle', { cx: s * 64, cy: 176, r: 58, fill: 'none', stroke: '#C9A44A', 'stroke-width': 6, opacity: 0.9 }, face));
      if (o.glasses !== false) h('path', { d: 'M -8 172 Q 0 164 8 172', stroke: '#C9A44A', 'stroke-width': 6, fill: 'none' }, face);
    } else if (HS === 'curly') {
      for (let i = 0; i < 26; i++) { const ang = -100 + rnd() * 200, r = 120 + rnd() * 40; const a = (ang - 90) * Math.PI / 180; h('circle', { cx: Math.cos(a) * r, cy: 170 + Math.sin(a) * r, r: 34 + rnd() * 16, fill: hairFill }, i < 10 ? hairBack : hairG); }
    } else if (HS === 'side') {
      cap('M -166 200 Q -180 20 10 6 Q 176 24 166 190 Q 140 90 40 96 Q -60 100 -130 140 Q -150 160 -150 210 Z');
      lock(60, 70, 120, -110, 30);
    }
    // shopper basket etc. are drawn by scenes

    const st = {};
    function set(s) {
      Object.assign(st, s);
      const x = s.x || 0, y = s.y || 0, sc = s.scale || 1;
      svg.style.transform = `translate(${x - 300}px, ${y - 1000}px) scale(${sc * (s.flip ? -1 : 1)}, ${sc})`;
      texts.forEach(([e, cx]) => e.setAttribute('transform', s.flip ? `translate(${2 * cx} 0) scale(-1 1)` : ''));
      const sq = s.squash || [1, 1];
      body.setAttribute('transform', `translate(0 ${s.bob || 0}) rotate(${s.lean || 0} 0 900) translate(0 900) scale(${sq[0]} ${sq[1]}) translate(0 -900)`);
      head.setAttribute('transform', `translate(${s.headX || 0} ${s.headY || 0}) rotate(${s.headTilt || 0} 0 330)`);
      torso.setAttribute('transform', `rotate(${s.torso || 0} 0 590)`);
      const leg = (g, side, a) => g.setAttribute('transform', `translate(${side * 44} 600) rotate(${a || 0} 0 0)`);
      leg(legs[0], -1, s.legL); leg(legs[1], 1, s.legR);
      const [la1, la2] = s.armL || [8, 6], [ra1, ra2] = s.armR || [8, 6];
      AL.sh.setAttribute('transform', `translate(-108 382) rotate(${la1})`); AL.el.setAttribute('transform', `translate(0 112) rotate(${la2})`);
      AR.sh.setAttribute('transform', `translate(108 382) rotate(${-ra1})`); AR.el.setAttribute('transform', `translate(0 112) rotate(${-ra2})`);
      if (s.handL) AL.hand.setAttribute('transform', `translate(0 136) ${s.handL}`); if (s.handR) AR.hand.setAttribute('transform', `translate(0 136) ${s.handR}`);
      const [lx, ly] = s.look || [0, 0], blink = s.blink || 0, lidv = Math.max(s.lid || 0, blink);
      const eyeScale = s.eyeScale || 1;
      eyes.forEach((e, i) => {
        e.pupil.setAttribute('transform', `translate(${lx * 18} ${ly * 18}) scale(${s.pupil || 1})`);
        e.ball.setAttribute('transform', `scale(${eyeScale})`);
        const ly2 = -66 + lidv * 124; // lid bottom edge from -60 (open) to +52 (closed)
        e.lid.setAttribute('y', ly2 - 60); e.lidLine.setAttribute('y', ly2 - 3);
      });
      brows.forEach(({ b, s: side }) => {
        const r = (s.brow || 0) * side, up = s.browUp || 0;
        b.setAttribute('transform', `translate(${side * 66} ${92 - up * 16 + (s.lid || 0) * 14}) rotate(${r * 14})`);
      });
      // mouth: open 0..1, smile -1..1, wide 0.5..1.5
      const m = s.mouth || {}, op = m.open || 0, sm = m.smile == null ? 0.4 : m.smile, wd = (m.wide || 1) * 58;
      const up = -sm * 14, lo = up + 6 + op * 56 + Math.max(0, sm) * op * 10;
      const dm = `M ${-wd} ${-sm * 6} Q 0 ${up + sm * 10} ${wd} ${-sm * 6} Q 0 ${lo + 12} ${-wd} ${-sm * 6} Z`;
      if (op < 0.04) { mouth.setAttribute('d', ''); mclipPath.setAttribute('d', ''); lipLine.setAttribute('d', `M ${-wd * 0.8} ${-sm * 4} Q 0 ${sm * 14} ${wd * 0.8} ${-sm * 4}`); lipLine.setAttribute('opacity', 1); }
      else { mouth.setAttribute('d', dm); mclipPath.setAttribute('d', dm); lipLine.setAttribute('opacity', 0); teeth.setAttribute('y', up + sm * 4 - 14); tongue.setAttribute('cy', lo + 2); }
      mouthG.setAttribute('transform', `translate(${(s.mouthX || 0)} 282)`);
      if (torso.__pocketGlow) torso.__pocketGlow.setAttribute('opacity', s.phoneGlow || 0);
      shadow.setAttribute('opacity', s.shadow == null ? 0.38 : s.shadow);
    }
    set({});
    return { svg, set, state: st, opt: o };
  }

  // talking mouth from an amplitude envelope: returns {open, smile}
  function talk(t, start, end, base = { smile: 0.3 }) {
    if (t < start || t > end) return { open: 0, smile: base.smile, wide: base.wide };
    const u = t - start;
    const v = Math.abs(Math.sin(u * 13.1) * 0.6 + Math.sin(u * 7.3 + 1) * 0.4);
    return { open: 0.12 + v * (base.amp || 0.5), smile: base.smile, wide: (base.wide || 1) * (0.9 + v * 0.15) };
  }
  // blink helper: periodic blinks, deterministic
  function blinkAt(t, period = 3.7, phase = 0) {
    const p = ((t + phase) % period) / period * period; return p < 0.14 ? Math.sin(p / 0.14 * Math.PI) : 0;
  }

  window.TOON = { make, talk, blinkAt, shade };
})();
