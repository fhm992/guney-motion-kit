// explainer.js: the bright "infographic explainer" look (load after film.js, hero.js, art.js). Bright daytime explainer: teal world, bold outlines, versus split-screens,
// meters and charts, a level bar that fills tip by tip, and prompts typed on a big phone.
(function () {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, ell, path, line, text, glow, E, seg, clamp, kf, f, L, cue, cmix } = F;
  const K = { ink: '#1D2340', teal: '#1F9AA0', tealD: '#127A82', tealL: '#7FD6D3', coral: '#FF6B57', coralD: '#D9493A', yellow: '#FFD15C', yellowD: '#E0A92E', cream: '#FFF6E5', pink: '#FF8FB1', purple: '#6C5CE7', grey: '#9AA3B5', greyD: '#6E7790', mint: '#3DD9A4', navy: '#26305C' };
  H.PAL.maya = { skin: '#A86B47', skinD: '#8C5536', hair: '#2B1B14', top: K.coral, topD: K.coralD, pants: '#2D3A6B', pantsD: '#232D57', shoe: '#FFF6E5', shoeD: '#D9CFBF', style: 'bun' };
  H.PAL.twin = { skin: '#C2B2A6', skinD: '#A8988C', hair: '#5D6375', top: K.grey, topD: K.greyD, pants: '#5D6375', pantsD: '#4C5263', shoe: '#D9D9E0', shoeD: '#B5B5C0', style: 'bun' };
  H.PAL.boss = { skin: '#E3A77F', skinD: '#C98A63', hair: '#3B2416', top: K.purple, topD: '#5345C9', pants: '#26305C', pantsD: '#1D2548', shoe: '#26305C', shoeD: '#1D2548', style: 'short' };
  H.PAL.rec = { skin: '#6E4630', skinD: '#5A3826', hair: '#141022', top: K.mint, topD: '#2BB685', pants: '#26305C', pantsD: '#1D2548', shoe: '#26305C', shoeD: '#1D2548', style: 'long' };
  const V = { K };
  V.DEFS = `<defs><filter id="ol" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="4.5" result="d"/><feFlood flood-color="${K.ink}"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="ol2" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/><feFlood flood-color="${K.ink}"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="3" fill="#FFFFFF" opacity="0.12"/></pattern></defs>`;
  const OL = (inner, w = 1) => `<g filter="url(#${w === 2 ? 'ol2' : 'ol'})">${inner}</g>`;
  V.OL = OL;
  // a character with the bold outline
  V.ch = (pose, T) => OL(H.svg(Object.assign({ pal: 'maya' }, pose), T));

  // ---------- the world: a bright backdrop that changes mood, with drifting shapes ----------
  const MOODS = { day: ['#26B3B0', '#17858C'], warm: ['#FF9A62', '#E0603F'], dark: ['#3A3F8F', '#20244F'], night: ['#2C3473', '#171B45'], gold: ['#FFC35C', '#F08A3C'], purple: ['#8E7CF0', '#5345C9'], mint: ['#4FD8B0', '#1FA584'] };
  V.bg = (T, c, mood = 'day', o = {}) => {
    const [a, b] = Array.isArray(mood) ? mood : MOODS[mood] || MOODS.day;
    const id = 'v2bg' + (o.id || '');
    let s = V.DEFS + `<defs><radialGradient id="${id}" cx="0.5" cy="0.42" r="0.8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>`;
    s += L(c, 0.05, rect(-1500, -1500, 4920, 4080, `url(#${id})`) + rect(-1500, -1500, 4920, 4080, 'url(#dots)'));
    const R = F.R(o.seed || 4);
    let far = '', mid = '';
    for (let k = 0; k < 22; k++) {
      const x = R() * 2600 - 340, y = R() * 1400 - 160, sz = 20 + R() * 60, kind = Math.floor(R() * 4), ph = R() * 6.28, rot = T * (10 + R() * 20) + ph * 50;
      const yy = y + Math.sin(T * 0.4 + ph) * 18, col = '#FFFFFF', op = 0.07 + R() * 0.08;
      const shape = kind === 0 ? circ(0, 0, sz / 2, col) : kind === 1 ? rect(-sz / 2, -sz / 2, sz, sz, col, { rx: sz * 0.25 }) : kind === 2 ? path(`M0,${-sz / 2} L${sz / 2},${sz / 2} L${-sz / 2},${sz / 2} Z`, col) : line(`M${-sz / 2},0 H${sz / 2} M0,${-sz / 2} V${sz / 2}`, col, sz * 0.22);
      const sh = G({ transform: `translate(${f(x)},${f(yy)}) rotate(${f(rot)})`, opacity: f(op) }, shape); if (k % 2) far += sh; else mid += sh;
    }
    s += L(c, 0.35, far) + L(c, 0.65, mid);
    return s;
  };
  // ground strip (a soft floor the characters stand on)
  V.floor = (y = 860, col = '#FFFFFF', op = 0.16) => ell(960, y + 40, 1600, 80, col, { opacity: op });

  // ---------- callouts, stamps, labels ----------
  V.label = (T, at, x, y, str, o = {}) => {
    const u = E.outBackSoft(seg(T, at, at + 0.4)); if (u <= 0) return '';
    const size = o.size || 40, w = F.measure(str, size, 900) + size * 1.1, h = size * 1.6;
    let s = '';
    if (o.to) s += line(`M${f(x)},${f(y)} L${f(F.lerp(x, o.to[0], u))},${f(F.lerp(y, o.to[1], u))}`, K.ink, 6) + circ(o.to[0], o.to[1], 10 * u, K.ink);
    s += G({ transform: tr(x, y, u, o.r || 0) }, OL(rect(-w / 2, -h / 2, w, h, o.bg || K.yellow, { rx: 14 }), 2) + text(0, size * 0.36, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: o.fg || K.ink }));
    return s;
  };
  V.stamp = (T, at, x, y, str, o = {}) => {
    const u = seg(T, at, at + 0.25); if (u <= 0) return '';
    const sc = F.lerp(2.2, 1, E.outCubic(u)), size = o.size || 90, w = F.measure(str, size, 900) + size * 0.8;
    return G({ transform: tr(x, y, sc, o.r ?? -8), opacity: f(Math.min(1, u * 2) * (o.op ?? 1)) }, rect(-w / 2, -size * 0.8, w, size * 1.3, 'none', { rx: 18, stroke: o.col || K.coral, 'stroke-width': 12 }) + text(0, size * 0.32, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: o.col || K.coral, 'letter-spacing': 4 }));
  };
  V.big = (T, a, b, str, o = {}) => {   // big outlined headline (screen space)
    if (T < a - 0.05 || T > b + 0.5) return '';
    const u = E.outBackSoft(seg(T, a, a + 0.45)), out = E.inCubic(seg(T, b, b + 0.4)), size = o.size || 120;
    const col = o.col || K.cream;
    return G({ transform: tr(o.x ?? 960, (o.y ?? 170) - out * 40, 0.6 + 0.4 * u), opacity: f(Math.min(1, u * 1.5) * (1 - out)) },
      text(0, size * 0.35, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: 'none', stroke: K.ink, 'stroke-width': size * 0.16, 'stroke-linejoin': 'round' }) + text(0, size * 0.35, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: col }));
  };
  V.gauge = (x, y, r, v, lab, o = {}) => {
    const a = Math.PI * (1 - clamp(v));
    let s = path(`M${-r},0 A${r},${r} 0 0 1 ${r},0 Z`, K.cream) + path(`M${-r},0 A${r},${r} 0 0 1 ${f(-r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} L0,0 Z`, K.mint) + path(`M${f(-r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} A${r},${r} 0 0 1 ${f(r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} L0,0 Z`, K.yellow) + path(`M${f(r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} A${r},${r} 0 0 1 ${r},0 L0,0 Z`, K.coral);
    if (o.flip) s = path(`M${-r},0 A${r},${r} 0 0 1 ${f(-r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} L0,0 Z`, K.coral) + path(`M${f(-r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} A${r},${r} 0 0 1 ${f(r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} L0,0 Z`, K.yellow) + path(`M${f(r * Math.cos(Math.PI / 3))},${f(-r * Math.sin(Math.PI / 3))} A${r},${r} 0 0 1 ${r},0 L0,0 Z`, K.mint);
    s += line(`M0,0 L${f(Math.cos(a) * r * 0.85)},${f(-Math.sin(a) * r * 0.85)}`, K.ink, r * 0.07) + circ(0, 0, r * 0.1, K.ink);
    return G(tr(x, y), OL(s, 2) + text(0, r * 0.38, lab, { 'text-anchor': 'middle', 'font-size': Math.max(34, r * 0.24), 'font-weight': 900, fill: o.fg || K.cream, stroke: K.ink, 'stroke-width': 8, 'paint-order': 'stroke' }));
  };
  V.bar = (x, y, w, h, v, col, lab, o = {}) => G(tr(x, y), OL(rect(0, 0, w, h, K.cream, { rx: h / 2 }) + rect(0, 0, Math.max(h, w * clamp(v)), h, col, { rx: h / 2 }), 2) + (lab ? text(o.labX ?? 0, -h * 0.45, lab, { 'font-size': o.size || 40, 'font-weight': 900, fill: K.cream, stroke: K.ink, 'stroke-width': 8, 'paint-order': 'stroke' }) : ''));

  // ---------- versus split: left = typical applicant, right = you ----------
  V.vs = (T, a, left, right, o = {}) => {
    const u = E.outExpo(seg(T, a, a + 0.6));
    let s = G({ transform: `translate(${f(-(1 - u) * 960)},0)` }, `<clipPath id="vsl"><path d="M0,0 H1000 L920,1080 H0 Z"/></clipPath>` + G({ 'clip-path': 'url(#vsl)' }, rect(0, 0, 1000, 1080, o.lbg || '#8E96A8') + rect(0, 0, 1000, 1080, 'url(#dots)') + left));
    s += G({ transform: `translate(${f((1 - u) * 960)},0)` }, `<clipPath id="vsr"><path d="M1000,0 H1920 V1080 H920 Z"/></clipPath>` + G({ 'clip-path': 'url(#vsr)' }, rect(900, 0, 1020, 1080, o.rbg || K.teal) + rect(900, 0, 1020, 1080, 'url(#dots)') + right));
    s += line('M1000,0 L920,1080', K.ink, 14);
    const b = E.outBackSoft(seg(T, a + 0.3, a + 0.7));
    s += G(tr(960, 540, b), OL(circ(0, 0, 70, K.yellow)) + text(0, 26, 'VS', { 'text-anchor': 'middle', 'font-size': 72, 'font-weight': 900, fill: K.ink }));
    s += V.label(T, a + 0.2, 470, 90, o.lt || 'TYPICAL APPLICANT', { bg: '#D9DCE5', size: 40 }) + V.label(T, a + 0.35, 1450, 90, o.rt || 'YOU', { bg: K.yellow, size: 40 });
    return s;
  };

  // ---------- the level bar (HUD): one level per tip ----------
  const CHS = [24.6, 75.45, 105.2, 131.1, 173.25, 196.0, 236.95, 286.95, 317.85, 338.85, 369.4];
  V.CHS = CHS;
  V.hud = (T) => {
    if (T < 24.4) return '';
    let n = 0; CHS.forEach((t, i) => { if (T >= t) n = i + 1; });
    const max = T >= 395.9;
    const t0 = CHS[n - 1] || 24.6, t1 = CHS[n] || 395.9, prog = max ? 1 : clamp((T - t0) / (t1 - t0));
    const u = E.outExpo(seg(T, 24.4, 25.0)), pop = n ? Math.exp(-Math.max(0, T - CHS[n - 1]) * 4) : 0;
    let s = G({ transform: tr(40 - (1 - u) * 400, 36), opacity: f(u * 0.96) }, OL(rect(0, 0, 420, 76, K.navy, { rx: 38 }), 2) + G(tr(46, 38, 1 + pop * 0.35), OL(circ(0, 0, 30, max ? K.mint : K.yellow), 2) + text(0, 13, max ? '★' : String(n), { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 900, fill: K.ink })) +
      text(92, 32, max ? 'LEVEL MAX' : `LEVEL ${n} / 11`, { 'font-size': 26, 'font-weight': 900, fill: K.cream, 'letter-spacing': 2 }) + rect(92, 44, 300, 16, '#3C4680', { rx: 8 }) + rect(92, 44, 300 * Math.max(0.04, (n - 1 + prog) / 11), 16, max ? K.mint : K.yellow, { rx: 8 }));
    return s;
  };
  // tip title card: a banner flies in with "TIP #n" and the title, the level ticks up
  V.tip = (T, a, b, n, title) => {
    if (T < a - 0.1 || T > b + 0.6) return '';
    const u = E.outExpo(seg(T, a, a + 0.6)), out = E.inCubic(seg(T, b, b + 0.45));
    const w = Math.max(900, F.measure(title, 84, 900) + 160);
    let s = G({ transform: `translate(${f(960 + (1 - u) * 1400 - out * 1400)},${f(540)}) rotate(-3)` },
      OL(rect(-w / 2, -150, w, 300, K.cream, { rx: 34 })) + OL(rect(-w / 2 + 40, -200, 300, 100, K.coral, { rx: 26 }), 2) + text(-w / 2 + 190, -128, `TIP #${n}`, { 'text-anchor': 'middle', 'font-size': 58, 'font-weight': 900, fill: K.cream }) +
      text(0, 40, title, { 'text-anchor': 'middle', 'font-size': 84, 'font-weight': 900, fill: K.ink }) + G(tr(w / 2 - 120, -150, E.outBackSoft(seg(T, a + 0.45, a + 0.85))), OL(rect(-110, -36, 220, 72, K.mint, { rx: 36 }), 2) + text(0, 14, 'LEVEL UP', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: K.ink })));
    return s;
  };
  F.SEC_CUES = (a) => { cue(a, 'whoosh', 0.5); cue(a + 0.45, 'reset', 0.45); };

  // ---------- the big phone: prompts typed as you say them ----------
  V.phone = (T, o) => {
    const words = o.words, w = 560, h = 960, x = o.x ?? 1190, y = o.y ?? 50;
    const u = E.outExpo(seg(T, o.a, o.a + 0.6));
    let s = OL(rect(0, 0, w, h, '#1D2340', { rx: 70 })) + rect(22, 22, w - 44, h - 44, K.cream, { rx: 52 }) + rect(22, 22, w - 44, 130, K.purple, { rx: 52 }) + rect(22, 100, w - 44, 52, K.purple);
    s += circ(90, 88, 32, K.yellow) + A.sparkle(90, 88, 0.5, 1, K.ink) + text(140, 80, o.title || 'ChatGPT or Claude', { 'font-size': 32, 'font-weight': 900, fill: K.cream }) + text(140, 116, 'AI assistant', { 'font-size': 24, 'font-weight': 700, fill: '#D9D3FF' });
    s += rect(48, h - 120, w - 96, 74, '#FFFFFF', { rx: 37, stroke: '#D9CFBF', 'stroke-width': 3 }) + circ(w - 88, h - 83, 26, o.sentAt && T > o.sentAt ? K.mint : K.coral) + line(`M${w - 100},${h - 80} l12,-12 l12,12 M${w - 88},${h - 92} v24`, K.cream, 5);
    const size = 38, lh = 54, maxW = 400, sp = size * 0.28;
    const MW = (str, hl) => F.measure(str, size, hl ? 900 : 700);
    const lines = [[]]; let lw = 0;
    words.forEach((wd, i) => { const ww = MW(wd.w, true) + sp; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += ww; });
    const bw = Math.min(maxW, Math.max(...lines.map((Ln) => Ln.reduce((p, i) => p + MW(words[i].w, true) + sp, 0)))) + 60, bh = lines.length * lh + 40;
    const bx = w - 48 - bw, by = 190;
    const first = words[0] ? words[0].s : o.a + 0.6, bu = E.outExpo(seg(T, first - 0.3, first + 0.1));
    const isHl = (i) => (o.hl || []).includes(words[i].w.toLowerCase().replace(/[^a-z0-9']/g, ''));
    const inPh = (i) => (o.ph || []).some(([p, q]) => i >= p && i <= q);
    if (bu > 0) {
      s += G({ opacity: f(bu) }, rect(bx, by, bw, bh, K.purple, { rx: 26 }));
      let caret = null;
      lines.forEach((Ln, li) => {
        let xx = bx + 30; const yy = by + 22 + size + li * lh - 8;
        Ln.forEach((i) => {
          const wd = words[i], ws = wd.s - 0.06, we = Math.max(wd.s + 0.12, wd.e - 0.05), n = wd.w.length, k = Math.floor(n * clamp((T - ws) / (we - ws)));
          const wf = MW(wd.w, isHl(i));
          if (inPh(i) && T >= ws) s += rect(xx - 6, yy - size * 0.86, wf + 12, size * 1.14, 'none', { rx: 10, stroke: K.yellow, 'stroke-width': 3, 'stroke-dasharray': '7 6' });
          if (k > 0) { s += text(xx, yy, wd.w.slice(0, k), { 'font-size': size, 'font-weight': isHl(i) ? 900 : 700, fill: isHl(i) ? K.yellow : K.cream }); const st = (o.strike || []).find((z) => z.i === i); if (st && T > st.at) s += line(`M${f(xx - 3)},${f(yy - size * 0.32)} h${f((wf + 6) * E.outCubic(seg(T, st.at, st.at + 0.3)))}`, K.coral, 6); }
          if (T >= ws && (k < n || i === words.length - 1)) caret = [xx + MW(wd.w.slice(0, k), isHl(i)), yy];
          xx += MW(wd.w, true) + sp;
        });
      });
      const last = words[words.length - 1];
      if (caret && T < (o.sentAt || last.e + 0.4) && Math.floor(T * 2.2) % 2 === 0) s += rect(caret[0] + 3, caret[1] - size * 0.8, 4, size * 0.95, K.yellow);
      const sent = o.sentAt || last.e + 0.3;
      if (T > sent) {
        const ry = by + bh + 40;
        s += circ(70, ry + 26, 24, K.yellow) + A.sparkle(70, ry + 26, 0.4, 1, K.ink);
        if (T < sent + 0.6) [0, 1, 2].forEach((k) => (s += circ(120 + k * 28, ry + 28, 8, K.purple, { opacity: f(0.35 + 0.65 * Math.max(0, Math.sin(T * 9 - k))) })));
        else for (let k = 0; k < 4; k++) { const v = E.outCubic(seg(T, sent + 0.6 + k * 0.15, sent + 1.0 + k * 0.15)); if (v > 0) s += rect(110, ry + 6 + k * 40, (330 - (k % 2) * 80 - (k === 3) * 120) * v, 18, '#D9D3FF', { rx: 9 }); }
      }
    }
    if (o.reply) s += o.reply(T, by + bh + 40);
    return G({ transform: `translate(${f(x)},${f(y + (1 - u) * 300)}) rotate(${f(o.r ?? 3)},${w / 2},${h / 2}) scale(${f(o.s || 1)})`, opacity: f(u) }, s);
  };
  // a prompt shot: Maya on the left with her phone, the big phone on the right
  V.promptShot = (o) => {
    const words = F.vo(o.t0, o.t1);
    A.typingCues(words, 0.4); cue(o.a + 0.05, 'whoosh', 0.35); if (o.sendAt) cue(o.sendAt, 'send', 0.4);
    return { a: o.a, b: o.b, xin: o.xin, cam: o.cam || [[o.a, { x: 960, y: 540, z: 1.0 }], [o.b + 0.4, { x: 1010, y: 530, z: 1.06 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, o.mood || 'purple', { seed: 9 });
      const tap = Math.sin(T * 14) * 6;
      s += L(c, 1, V.floor(900) + V.ch({ x: 560, y: 940, s: 1.15, face: 1, brows: 'up', mouth: 'flat', look: [1, 0], armL: [100 + tap * 0.3, 20], armR: [60, 60], prop: A.phone(10, -40, 0.8, rect(0, 0, 66, 128, K.purple)), seed: 1 }, T) + (o.left ? o.left(T) : ''));
      s += L(c, 1.02, V.phone(T, Object.assign({ a: o.a, words, s: 0.94 }, o.phone || {})));
      return s;
    } };
  };

  // ---------- icons ----------
  V.icon = (name, x, y, s = 1, col = K.cream) => {
    const I = {
      doc: rect(-30, -40, 60, 80, col, { rx: 8 }) + rect(-18, -24, 36, 6, K.ink, { rx: 3 }) + rect(-18, -10, 30, 6, K.ink, { rx: 3 }) + rect(-18, 4, 36, 6, K.ink, { rx: 3 }),
      mail: rect(-40, -28, 80, 56, col, { rx: 8 }) + line('M-36,-22 L0,6 L36,-22', K.ink, 6),
      clock: circ(0, 0, 38, col) + line('M0,0 V-24 M0,0 L16,10', K.ink, 7),
      star: path('M0,-40 L11,-12 L40,-12 L17,6 L25,36 L0,18 L-25,36 L-17,6 L-40,-12 L-11,-12 Z', col),
      target: circ(0, 0, 40, col) + circ(0, 0, 26, K.coral) + circ(0, 0, 12, col),
      search: circ(-6, -6, 26, 'none', { stroke: col, 'stroke-width': 10 }) + line('M14,14 L36,36', col, 12),
      bolt: path('M8,-44 L-26,6 L-2,6 L-10,44 L26,-8 L2,-8 Z', col),
      heart: path('M0,34 C-50,0 -40,-40 0,-18 C40,-40 50,0 0,34 Z', col),
      robot: rect(-34, -30, 68, 60, col, { rx: 12 }) + circ(-14, -4, 8, K.ink) + circ(14, -4, 8, K.ink) + rect(-14, 14, 28, 6, K.ink, { rx: 3 }) + line('M0,-30 V-44', col, 6) + circ(0, -48, 7, K.coral),
      person: circ(0, -20, 18, col) + path('M-28,36 Q-28,4 0,4 Q28,4 28,36 Z', col),
    };
    return G(tr(x, y, s), OL(I[name] || I.doc, 2));
  };
  // a grid of tiny people (everyone else); one can be highlighted
  V.crowd = (T, cols, rows, gx, gy, o = {}) => {
    let s = '';
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const me = o.me && o.me[0] === q && o.me[1] === r, x = (o.x0 || 0) + q * gx, y = (o.y0 || 0) + r * gy;
      const bob = Math.sin(T * 3 + q * 0.7 + r) * 3;
      s += G(tr(x, y + bob, o.s || 1), circ(0, -22, 16, me ? (o.meCol || K.coral) : o.col || '#E7E2F5') + path('M-24,30 Q-24,0 0,0 Q24,0 24,30 Z', me ? (o.meCol || K.coral) : o.col || '#E7E2F5') + (o.cap ? path('M-20,-34 L0,-46 L20,-34 L0,-24 Z', K.ink) : ''));
    }
    return s;
  };

  V.desk = (x, y, w = 620) => V.OL(rect(x, y, w, 34, '#B9773A', { rx: 12 }) + rect(x + 30, y + 34, 26, 180, '#94592A') + rect(x + w - 56, y + 34, 26, 180, '#94592A'), 2);
  V.lap = (x, y, s, scr) => G(tr(x, y, s), V.OL(rect(-150, -210, 300, 200, K.navy, { rx: 14 }) + path('M-170,-10 L170,-10 L184,4 L-184,4 Z', '#D9D3E8'), 2) + rect(-136, -198, 272, 176, K.cream, { rx: 6 }) + G('translate(-136,-198)', scr || ''));
  // an outlined card with a coloured header
  V.card = (x, y, w, h, title, o = {}) => G({ transform: tr(x, y, o.s || 1, o.r || 0), opacity: o.op !== undefined ? f(o.op) : undefined }, V.OL(rect(0, 0, w, h, o.bg || K.cream, { rx: 24 })) + (title ? rect(0, 0, w, 76, o.col || K.purple, { rx: 24 }) + rect(0, 50, w, 26, o.col || K.purple) + text(w / 2, 52, title, { 'text-anchor': 'middle', 'font-size': o.ts || 36, 'font-weight': 900, fill: o.tf || K.cream }) : '') + (o.inner || ''));
  // a job post card with n bullet rows; grey/gold rows
  V.post = (x, y, w, o = {}) => { let inner = ''; const n = o.n ?? 8; for (let i = 0; i < n; i++) { const yy = 110 + i * 46, ww = w * (0.5 + ((i * 37) % 30) / 100), g = (o.grey || []).includes(i), gd = (o.gold || []).includes(i); if (gd) inner += rect(24, yy - 14, ww + 60, 40, K.yellow, { rx: 10 }); inner += circ(44, yy + 6, 8, g ? '#C9C9D6' : K.ink, { opacity: g ? 1 : 0.7 }) + rect(64, yy, ww, 14, g ? '#D9D9E3' : '#8A8FB0', { rx: 7 }); } return V.card(x, y, w, 130 + n * 46, 'JOB POST', Object.assign({ inner }, o)); };
  V.chip = (x, y, str, o = {}) => { const size = o.size || 36, w = F.measure(str, size, 900) + size * 1.2, h = size * 1.7; return G({ transform: tr(x, y, o.s || 1, o.r || 0), opacity: o.op !== undefined ? f(o.op) : undefined }, V.OL(rect(-w / 2, -h / 2, w, h, o.bg || K.cream, { rx: h / 2 }), 2) + text(0, size * 0.36, str, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: o.fg || K.ink })); };
  window.V = V;
})();
