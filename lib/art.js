// art.js: props, sets and interface pieces for the film. Every function returns an SVG string.
(function () {
  const { f, G, tr, rect, circ, ell, path, line, text, glow, C, esc, E, seg, clamp, kf, R, cue, cmix, skyCols } = FILM;
  const A = {};

  // ---------- paper things ----------
  A.resume = (x, y, w, o = {}) => {
    const h = w * 1.3, gold = o.gold, ink = o.ink || (gold ? '#8A5A1E' : '#3A3F73'), ink2 = o.ink2 || (gold ? '#D9A24A' : '#C9BFAE');
    let s = rect(0, 0, w, h, o.fill || (gold ? 'url(#goldG)' : 'url(#paperG)'), { rx: w * 0.05 });
    s += circ(w * 0.2, w * 0.2, w * 0.11, ink2) + rect(w * 0.37, w * 0.12, w * 0.48, w * 0.07, ink, { rx: w * 0.035 }) + rect(w * 0.37, w * 0.23, w * 0.32, w * 0.045, ink2, { rx: w * 0.02 });
    const n = o.lines ?? 7;
    for (let i = 0; i < n; i++) {
      const yy = w * (0.44 + i * 0.105), ww = w * (i % 3 === 0 ? 0.55 : 0.78 - (i % 2) * 0.12);
      if (i % 3 === 0) s += rect(w * 0.09, yy, ww * 0.6, w * 0.05, ink, { rx: w * 0.025 });
      else s += circ(w * 0.11, yy + w * 0.02, w * 0.018, ink2) + rect(w * 0.16, yy, ww - w * 0.07, w * 0.038, (o.hlRows || []).includes(i) ? (o.hlCol || C.amber) : ink2, { rx: w * 0.02 });
    }
    if (o.shine) s += path(`M${w * 0.1},${h} L${w * 0.45},0 L${w * 0.6},0 L${w * 0.25},${h} Z`, '#FFFFFF', { opacity: f(0.35 * o.shine) });
    return G({ transform: `translate(${f(x)},${f(y)}) rotate(${f(o.r || 0)},${f(w / 2)},${f(h / 2)})`, opacity: o.op !== undefined ? f(o.op) : undefined }, s);
  };
  A.plane = (x, y, s = 1, r = 0, col = '#FFF8EA') => G(tr(x, y, s, r), path('M-40,0 L40,-14 L-10,18 Z', col) + path('M-10,18 L40,-14 L-4,6 Z', '#D9CFBF') + path('M-4,6 L-14,22 L-10,18 Z', '#C9BFAE'));
  A.envelope = (x, y, s = 1, o = {}) => G(tr(x, y, s, o.r || 0), rect(-70, -46, 140, 92, o.col || '#FFF8EA', { rx: 10 }) + path('M-70,-40 L0,10 L70,-40', 'none', { stroke: '#D9CFBF', 'stroke-width': 6 }) + (o.seal ? circ(0, 6, 16, o.seal) : ''));
  A.note = (x, y, s = 1, r = 0, col = '#FFE7A3') => G(tr(x, y, s, r), rect(-30, -24, 60, 48, col, { rx: 5 }) + rect(-20, -12, 34, 5, '#C48E36', { rx: 2 }) + rect(-20, 0, 40, 5, '#C48E36', { rx: 2 }));

  // ---------- devices ----------
  A.laptop = (x, y, s = 1, screen = '', o = {}) => {
    let g = rect(-150, -210, 300, 200, '#2B2F66', { rx: 14 }) + rect(-136, -198, 272, 176, o.scr || '#F4F0E6', { rx: 6 }) + G('translate(-136,-198)', screen);
    g += path('M-170,-10 L170,-10 L184,4 L-184,4 Z', '#C9C2B4') + rect(-30, -10, 60, 5, '#A9A193', { rx: 2 });
    if (o.glow) g = glow(0, -110, 260, 'white', o.glow) + g;
    return G(tr(x, y, s), g);
  };
  A.phone = (x, y, s = 1, screen = '', o = {}) => G(tr(x, y, s, o.r || 0), rect(-40, -76, 80, 152, '#1A1747', { rx: 16 }) + rect(-33, -66, 66, 128, o.scr || '#F4F0E6', { rx: 9 }) + G('translate(-33,-66)', screen));
  A.inbox = (T, w, h, o = {}) => {   // mail app screen content (0,0 top-left)
    let s = rect(0, 0, w, h * 0.17, C.violet, { rx: 6 }) + text(w * 0.06, h * 0.12, o.title || 'Inbox', { 'font-size': h * 0.09, fill: '#FFF8EA' });
    if (o.spin !== undefined) { const a = o.spin * 360; s += circ(w / 2, h * 0.58, h * 0.15, 'none', { stroke: '#D9CFBF', 'stroke-width': h * 0.04 }) + G(`rotate(${f(a)},${f(w / 2)},${f(h * 0.58)})`, path(`M${f(w / 2)},${f(h * 0.43)} A${f(h * 0.15)},${f(h * 0.15)} 0 0 1 ${f(w / 2 + h * 0.15)},${f(h * 0.58)}`, 'none', { stroke: C.violet, 'stroke-width': h * 0.04, 'stroke-linecap': 'round' })); }
    (o.rows || []).forEach((r, i) => { const yy = h * (0.24 + i * 0.16); s += rect(w * 0.05, yy, w * 0.9, h * 0.12, r.col || '#FFFFFF', { rx: 4 }) + circ(w * 0.12, yy + h * 0.06, h * 0.035, r.dot || C.coral) + rect(w * 0.2, yy + h * 0.03, w * 0.5, h * 0.025, '#3A3F73', { rx: 2 }) + rect(w * 0.2, yy + h * 0.07, w * 0.65, h * 0.02, '#C9BFAE', { rx: 2 }); });
    return s;
  };

  // ---------- rooms and furniture ----------
  A.window = (T, x, y, w, h, o = {}) => {   // a window onto the sky and the city
    const id = 'wclip' + (o.id || ''), [top, mid] = skyCols(T);
    let inner = rect(x, y, w, h, top) + rect(x, y + h * 0.5, w, h * 0.5, mid, { opacity: 0.8 });
    if (o.moon !== false) inner += glow(x + w * 0.78, y + h * 0.24, h * 0.3, 'white', 0.4) + circ(x + w * 0.78, y + h * 0.24, h * 0.1, '#FFE7A3');
    const Rr = R(o.seed || 5);
    for (let i = 0; i < 12; i++) {
      const bw = w * (0.07 + Rr() * 0.07), bh = h * (0.2 + Rr() * 0.45), bx = x + i * w * 0.09 - w * 0.02;
      inner += rect(bx, y + h - bh, bw, bh, '#232063');
      for (let k = 0; k < 6; k++) if (Rr() < 0.42) inner += rect(bx + bw * 0.2 + (k % 2) * bw * 0.4, y + h - bh + bh * 0.1 + Math.floor(k / 2) * bh * 0.18, bw * 0.18, bh * 0.07, '#FFC145', { opacity: 0.6 });
    }
    if (o.extra) inner += o.extra;
    let s = `<defs><clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="14"/></clipPath></defs>` + G({ 'clip-path': `url(#${id})` }, inner);
    s += rect(x, y, w, h, 'none', { rx: 14, stroke: o.frame || '#2E2A6E', 'stroke-width': 18 }) + line(`M${f(x + w / 2)},${f(y)} V${f(y + h)} M${f(x)},${f(y + h * 0.47)} H${f(x + w)}`, o.frame || '#2E2A6E', 12);
    s += rect(x - 24, y + h, w + 48, 18, o.frame || '#2E2A6E', { rx: 6 });
    return s;
  };
  A.room = (T, o = {}) => {   // his room; light 0 (night) .. 1 (morning)
    const lt = o.light || 0;
    let s = rect(-600, -400, 3120, 1880, cmix('#1A1849', '#4B4C9E', lt));
    s += rect(-600, 840, 3120, 700, cmix('#14123A', '#33337A', lt));
    s += rect(-600, 830, 3120, 14, cmix('#24215E', '#5A5BB0', lt));
    s += A.window(T, 1180, 120, 560, 420, { id: o.id || 'r', extra: o.windowExtra });
    // poster + shelf + plant
    s += rect(240, 170, 190, 250, cmix('#2B2770', '#5E5FB8', lt), { rx: 10 }) + circ(335, 260, 50, C.amber, { opacity: 0.7 }) + path('M260,400 L335,300 L410,400 Z', C.indigoL, { opacity: 0.8 });
    s += rect(520, 330, 300, 16, '#6E4616', { rx: 6 }) + rect(540, 262, 36, 68, C.coral, { rx: 4 }) + rect(582, 276, 28, 54, C.mint, { rx: 4 }) + rect(616, 252, 32, 78, C.indigoL, { rx: 4 });
    s += rect(700, 280, 50, 50, '#B4553F', { rx: 8 }) + path('M725,282 q-30,-60 -40,-50 q30,0 40,50 q10,-70 30,-60 q-10,20 -30,60', C.mintD);
    return s;
  };
  A.desk = (x, y, w = 640) => rect(x, y, w, 34, '#8A5A1E', { rx: 12 }) + rect(x + 20, y + 34, 24, 176, '#6E4616') + rect(x + w - 50, y + 34, 24, 176, '#6E4616');
  A.chair = (x, y) => rect(x + 50, y - 150, 40, 300, '#2E2A6E', { rx: 16 }) + rect(x, y - 18, 220, 30, '#3C3790', { rx: 14 });
  A.mug = (x, y, col = C.coral, T = 0, steam = 0) => {
    let s = rect(x, y, 52, 56, col, { rx: 10 }) + line(`M${x + 52},${y + 14} q22,0 22,16 q0,16 -22,16`, col, 8);
    if (steam) for (let i = 0; i < 2; i++) { const ph = T * 1.4 + i * 2; s += line(`M${f(x + 16 + i * 18)},${y - 10} q${f(10 * Math.sin(ph))},-20 0,-40 q${f(-10 * Math.sin(ph))},-20 0,-40`, '#FFFFFF', 5, { opacity: f(steam * 0.25) }); }
    return s;
  };
  A.lamp = (x, y, on = 1) => glow(x + 40, y + 60, 320, 'amber', 0.5 * on) + line(`M${x},${y + 160} L${x + 20},${y + 40} L${x + 70},${y}`, '#3C3790', 10) + path(`M${x + 40},${y - 20} L${x + 110},${y - 10} L${x + 90},${y + 40} Z`, C.amber) + ell(x, y + 162, 40, 10, '#3C3790');
  A.couch = (x, y, col = '#5A4FCF') => rect(x, y - 150, 520, 130, col, { rx: 40 }) + rect(x - 30, y - 70, 580, 70, cmix(col, '#000000', 0.15), { rx: 30 }) + rect(x - 40, y - 120, 70, 120, col, { rx: 30 }) + rect(x + 490, y - 120, 70, 120, col, { rx: 30 }) + rect(x + 20, y, 24, 20, '#2E2A6E') + rect(x + 476, y, 24, 20, '#2E2A6E');

  // ---------- outdoors ----------
  A.hills = (T, o = {}) => {
    const c = o.cols || ['#2B2366', '#221D57', '#191545'];
    return path('M-800,560 Q300,470 620,540 T1260,500 T2700,520 V1700 H-800 Z', c[0]) + path('M-800,700 Q420,600 900,680 T2700,640 V1700 H-800 Z', c[1]) + path('M-800,860 Q500,780 1000,850 T2700,820 V1700 H-800 Z', c[2]);
  };
  A.ROAD = 'M820,1180 C760,940 1260,900 1180,800 C1100,700 600,720 640,640 C680,560 1180,600 1240,540 C1290,490 900,470 960,430';
  A.signpost = (x, y, n, o = {}) => {
    const k = o.s || 1, hot = o.hot || 0;
    let s = '';
    if (hot) s += glow(0, -90, 130, 'amber', hot);
    s += rect(-6, -80, 12, 80, '#8A5A1E') + rect(-44, -142, 88, 72, o.lit ? C.amber : C.indigo, { rx: 16 }) + rect(-44, -82, 88, 12, o.lit ? C.amberD : C.indigoD, { rx: 6 });
    s += text(0, -88, String(n), { 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 900, fill: o.lit ? '#3B2410' : '#E8E6FF' });
    return G({ transform: tr(x, y, k), opacity: o.op !== undefined ? f(o.op) : undefined }, s);
  };
  A.office = (x, y, s = 1, o = {}) => G(tr(x, y, s), (o.glow ? glow(0, -60, 200, 'amber', o.glow) : '') + rect(-40, -110, 80, 110, C.amber, { rx: 8 }) + Array.from({ length: 6 }, (_, k) => rect(-28 + (k % 2) * 34, -96 + Math.floor(k / 2) * 30, 22, 18, '#8A5A1E')).join(''));
  A.city = (T, y, o = {}) => {
    const Rr = R(o.seed || 9); let s = '';
    for (let i = 0; i < (o.n || 30); i++) {
      const w = 60 + Rr() * 90, h = (o.hmin || 120) + Rr() * (o.hvar || 300), x = (o.x0 ?? -600) + i * (o.step || 90);
      s += rect(x, y - h, w, h, o.col || '#221F5C');
      for (let k = 0; k < 10; k++) if (Rr() < 0.35) s += rect(x + 10 + (k % 3) * 18, y - h + 20 + Math.floor(k / 3) * 30, 8, 12, '#FFC145', { opacity: f(0.35 + 0.25 * Math.sin(T * 0.7 + k + i)) });
    }
    return s;
  };

  // ---------- speech / thought ----------
  A.bubble = (x, y, w, h, o = {}) => G(tr(x, y, o.s || 1), rect(-w / 2, -h / 2, w, h, o.fill || '#FFF8EA', { rx: Math.min(h / 2, 40) }) + path(`M${-w * 0.15},${h / 2 - 2} l${o.tailX ?? -20},34 l40,-34 Z`, o.fill || '#FFF8EA') + (o.inner || ''));
  A.thought = (x, y, w, h, o = {}) => G(tr(x, y, o.s || 1), circ(-w * 0.32, h * 0.62 + 30, 10, o.fill || '#FFF8EA') + circ(-w * 0.24, h * 0.5 + 10, 16, o.fill || '#FFF8EA') + rect(-w / 2, -h / 2, w, h, o.fill || '#FFF8EA', { rx: h / 2.2 }) + (o.inner || ''));

  // ---------- the chat screen (full frame) ----------
  // words: VO words to type; hl: lowercase words to show in amber; ph: [[i0, i1]] word ranges shown as fill-in chips;
  // strike: [{ i: wordIndex, at }] to strike out; chips: [{ at, label }] attachment chips; reply(T, y) -> svg under the bubble
  A.chat = (T, o) => {
    const words = o.words, x0 = 260, y0 = 110, w = 1400, h = 860;
    const u = E.outExpo(seg(T, o.a, o.a + 0.6));
    let s = '';
    s += G({ transform: `translate(0,${f((1 - u) * 80)})`, opacity: f(u) },
      rect(x0, y0 + 18, w, h, '#05061A', { rx: 40, opacity: 0.4 }) + rect(x0, y0, w, h, 'url(#winG)', { rx: 40 }) + rect(x0, y0, w, h, 'none', { rx: 40, stroke: '#3A3F8A', 'stroke-width': 3 }) +
      path(`M${x0},${y0 + 40} a40,40 0 0 1 40,-40 h${w - 80} a40,40 0 0 1 40,40 v56 h${-w} Z`, '#232864') +
      [0, 1, 2].map((i) => circ(x0 + 46 + i * 32, y0 + 48, 10, [C.coral, C.amber, C.mint][i])).join('') +
      text(x0 + w / 2, y0 + 60, o.title || 'ChatGPT  or  Claude', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 800, fill: C.lav }) +
      rect(x0 + 60, y0 + h - 120, w - 120, 76, '#141841', { rx: 38, stroke: '#3A3F8A', 'stroke-width': 2 }) +
      circ(x0 + w - 104, y0 + h - 82, 28, o.sentAt && T > o.sentAt ? C.mint : C.amber) + line(`M${x0 + w - 116},${y0 + h - 80} l12,-12 l12,12 M${x0 + w - 104},${y0 + h - 92} v24`, '#1A1747', 5));
    if (u < 0.05) return s;
    // lay out the words
    const size = o.size || 52, lh = size * 1.42, maxW = o.maxW || 1060, cw = size * 0.5, sp = size * 0.28;
    const MW = (str, hl) => FILM.measure(str, size, hl ? 900 : 700);
    const lines = [[]]; let lw = 0;
    words.forEach((wd, i) => { const ww = MW(wd.w, true) + sp; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += ww; });
    const bw = Math.min(maxW + 40, Math.max(...lines.map((L) => L.reduce((p, i) => p + MW(words[i].w, true) + sp, 0)))) + 90;
    const bh = lines.length * lh + 60, bx = x0 + w - 70 - bw, by = y0 + 150 + ((o.chips || []).length ? 70 : 0);
    const first = words[0] ? words[0].s : o.a + 0.6;
    const bu = E.outExpo(seg(T, first - 0.35, first + 0.1));
    if (bu > 0) {
      s += G({ opacity: f(bu) }, rect(bx, by, bw, bh, '#3A3F8A', { rx: 30 }));
      const isHl = (i) => (o.hl || []).includes(words[i].w.toLowerCase().replace(/[^a-z0-9']/g, '')) || (o.hlIdx || []).includes(i);
      const inPh = (i) => (o.ph || []).some(([a, b]) => i >= a && i <= b);
      let caret = null;
      lines.forEach((L, li) => {
        let x = bx + 45; const y = by + 30 + size + li * lh - size * 0.18;
        L.forEach((i) => {
          const wd = words[i], ws = wd.s - 0.06, we = Math.max(wd.s + 0.12, wd.e - 0.05);
          const n = wd.w.length, k = Math.floor(n * clamp((T - ws) / (we - ws)));
          const wfull = MW(wd.w, isHl(i)), ww = MW(wd.w, true) + sp;
          if (inPh(i) && T >= ws) s += rect(x - 8, y - size * 0.86, wfull + 16, size * 1.12, 'none', { rx: 12, stroke: C.amber, 'stroke-width': 3, 'stroke-dasharray': '8 7' });
          if (k > 0) {
            const col = isHl(i) ? C.amber : inPh(i) ? '#FFE3A1' : '#F4F1EA';
            s += text(x, y, wd.w.slice(0, k), { 'font-size': size, 'font-weight': isHl(i) ? 900 : 700, fill: col });
            const st = (o.strike || []).find((z) => z.i === i);
            if (st && T > st.at) s += line(`M${f(x - 4)},${f(y - size * 0.32)} h${f((wfull + 8) * E.outCubic(seg(T, st.at, st.at + 0.3)))}`, C.coral, 6);
          }
          if (T >= ws && (k < n || i === words.length - 1)) caret = [x + MW(wd.w.slice(0, k), isHl(i)), y];
          x += ww;
        });
      });
      const last = words[words.length - 1];
      if (caret && T < (o.sentAt || last.e + 0.4) && Math.floor(T * 2.2) % 2 === 0) s += rect(caret[0] + 4, caret[1] - size * 0.8, 5, size * 0.95, C.amber);
    }
    (o.chips || []).forEach((cp, j) => { const cu = E.outExpo(seg(T, cp.at, cp.at + 0.45)); if (cu > 0) s += G({ transform: tr(bx + 40 + j * 330, by - 70 + (1 - cu) * 24), opacity: f(cu) }, rect(0, 0, 300, 60, '#2E3480', { rx: 16 }) + rect(14, 12, 28, 36, '#FFF8EA', { rx: 4 }) + text(58, 41, cp.label, { 'font-size': 30, 'font-weight': 800, fill: C.lav })); });
    const sent = o.sentAt || (words.length ? words[words.length - 1].e + 0.25 : 1e9);
    if (o.reply) s += o.reply(T, by + bh + 50);
    else if (T > sent) {   // the AI answers: thinking dots, then lines of answer
      const ry = by + bh + 60, ax = x0 + 80;
      s += circ(ax + 30, ry + 30, 30, C.amber) + A.sparkle(ax + 30, ry + 30, 0.55, 1, '#3B2410');
      if (T < sent + 0.7) [0, 1, 2].forEach((k) => (s += circ(ax + 100 + k * 34, ry + 32, 10, C.lav, { opacity: f(0.35 + 0.65 * Math.max(0, Math.sin(T * 9 - k))) })));
      else for (let k = 0; k < 4; k++) { const u = E.outCubic(seg(T, sent + 0.7 + k * 0.18, sent + 1.2 + k * 0.18)); if (u > 0) s += rect(ax + 90, ry + 14 + k * 50, (740 - (k % 2) * 180 - (k === 3) * 260) * u, 22, '#4A50A0', { rx: 11 }); }
    }
    return s;
  };
  // register typing sounds for a prompt (a soft key every ~2 letters)
  A.typingCues = (words, gain = 0.5) => { words.forEach((wd) => { const n = Math.max(1, Math.round(wd.w.length / 2)); for (let k = 0; k < n; k++) cue(wd.s - 0.04 + ((wd.e - wd.s) * k) / n, k % 2 ? 'key2' : 'key1', gain * (0.75 + 0.25 * ((k * 7) % 3) / 2)); }); };

  // chips / pills in world space
  A.pill = (x, y, label, o = {}) => { const size = o.size || 40, w = FILM.measure(label, size, 800) + size * 1.3, h = size * 1.75; return G({ transform: tr(x, y, o.s || 1, o.r || 0), opacity: o.op !== undefined ? f(o.op) : undefined }, rect(-w / 2, -h / 2, w, h, o.bg || C.mint, { rx: h / 2 }) + text(0, size * 0.36, label, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 800, fill: o.fg || '#0E2A2A' })); };
  A.check = (x, y, s = 1, col = C.mint, u = 1) => G(tr(x, y, s), circ(0, 0, 30, col) + line(`M-13,1 l9,9 l17,-19`, '#0E2A2A', 7, { 'stroke-dasharray': 50, 'stroke-dashoffset': f(50 * (1 - u)) }));
  A.cross = (x, y, s = 1, u = 1) => G(tr(x, y, s * E.outBackSoft(u)), circ(0, 0, 30, C.coral) + line('M-11,-11 l22,22 M11,-11 l-22,22', '#3A0E0E', 7));
  A.sparkle = (x, y, s = 1, op = 1, col = '#FFF3C4') => G({ transform: tr(x, y, s), opacity: f(op) }, path('M0,-34 L8,-8 L34,0 L8,8 L0,34 L-8,8 L-34,0 L-8,-8 Z', col));

  // sample any path: A.along(d)(u) -> [x, y, angle]; cached
  const _paths = {};
  A.along = (d) => {
    if (!_paths[d]) {
      const sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.style.position = 'absolute'; sv.style.width = '0'; sv.style.height = '0';
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); sv.appendChild(p); document.body.appendChild(sv);
      const L = p.getTotalLength(), N = 400, pts = [];
      for (let i = 0; i <= N; i++) { const q = p.getPointAtLength((L * i) / N); pts.push([q.x, q.y]); }
      sv.remove(); _paths[d] = pts;
    }
    const pts = _paths[d];
    return (u) => { u = clamp(u); const k = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(k)), r = k - i; const a = pts[i], b = pts[i + 1]; return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI]; };
  };
  // the road of 11 stops, as seen from his window in the hook
  A.POSTS = Array.from({ length: 11 }, (_, i) => 0.12 + i * 0.08);
  A.landscape = (T, o = {}) => {
    const road = A.along(A.ROAD);
    let s = A.hills(T);
    s += line(A.ROAD, '#3A3290', 70) + line(A.ROAD, C.amber, 5, { 'stroke-dasharray': '18 22', opacity: 0.7 });
    s += A.office(960, 430, 1, { glow: o.officeGlow ?? 1 });
    const posts = A.POSTS.map((u, i) => { const [x, y] = road(u); return { i, x: x + (i % 2 ? 60 : -60) * (1 - i * 0.065), y, k: 1 - i * 0.065 }; });
    posts.slice().reverse().forEach((p) => { const on = o.postsOn ? o.postsOn(p.i) : 1; if (on <= 0) return; s += A.signpost(p.x, p.y + (1 - on) * 20, p.i + 1, { s: p.k * (0.6 + 0.4 * on), op: on, lit: p.i === 6 && (o.seven || 0) > 0.5, hot: p.i === 6 ? (o.seven || 0) : 0 }); });
    if (o.extra) s += o.extra(road, posts);
    return s;
  };

  // ---------- the road set: a long side-on road under the sky, with parallax layers ----------
  A.roadSet = (T, c, o = {}) => {
    const { L } = FILM;
    const tint = o.tint || 0;   // 0 night .. 1 morning
    const g0 = cmix('#2B2366', '#6F78C8', tint), g1 = cmix('#221D57', '#5A63B0', tint), g2 = cmix('#191545', '#3E4590', tint), rd = cmix('#3A3290', '#6A6CC0', tint);
    let s = L(c, 0.08, FILM.sky(T, { id: o.id || 'rs', stars: o.stars ?? 1 }));
    if (o.sun) { const so = o.sun[2] ?? 0.8, [sx, sy] = o.sun; let rays = ''; for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2 + T * 0.05; rays += path(`M${f(sx)},${f(sy)} L${f(sx + Math.cos(a - 0.08) * 1400)},${f(sy + Math.sin(a - 0.08) * 1400)} L${f(sx + Math.cos(a + 0.08) * 1400)},${f(sy + Math.sin(a + 0.08) * 1400)} Z`, '#FFD58A', { opacity: f(0.07 * so) }); }
      s += L(c, 0.1, rays + glow(sx, sy, 900, 'amber', 0.7 * so) + glow(sx, sy, 300, 'white', so) + circ(sx, sy, 90, '#FFE9B8', { opacity: f(so) })); }
    s += L(c, 0.3, A.city(T, 640, { seed: o.seed || 21, n: 70, x0: -3000, step: 110, col: cmix('#221F5C', '#5560A8', tint), hmin: 80, hvar: 220 }));
    s += L(c, 0.55, path('M-4000,700 Q-3000,600 -2000,680 T0,660 T2000,690 T4000,650 T6000,680 T8000,660 V1800 H-4000 Z', g0));
    let near = rect(-6000, 780, 16000, 1200, g1) + rect(-6000, 830, 16000, 110, rd) + line('M-6000,885 H10000', C.amber, 5, { 'stroke-dasharray': '30 34', opacity: 0.55 });
    near += rect(-6000, 940, 16000, 1000, g2);
    for (let k = -8; k < 14; k++) { const x = k * 700 + 200; near += line(`M${x},830 V560`, '#3C3790', 10) + line(`M${x},565 q30,-20 60,0`, '#3C3790', 8) + glow(x + 60, 580, 150, 'amber', 0.45 * (1 - tint * 0.7)) + circ(x + 60, 578, 12, '#FFE7A3', { opacity: f(1 - tint * 0.6) }); }
    const Rr = R(o.seed || 5);
    for (let k = 0; k < 60; k++) { const x = -6000 + Rr() * 16000; near += ell(x, 790, 40 + Rr() * 50, 20 + Rr() * 16, cmix('#2E2A6E', '#7078C8', tint)); }
    s += L(c, 1, near + (o.world || ''));
    if (o.front) s += L(c, 1.25, o.front);
    return s;
  };
  // walking: x from keys [[T, x]], phase follows the distance so feet never slide
  A.walkX = (T, keys) => { const x = kf(T, keys, 'inOutSine'); return { x, phase: x / 175 }; };

  // a standard full-frame prompt shot: the chat window types your words as you say them
  A.promptShot = (o) => {
    const words = FILM.vo(o.t0, o.t1);
    A.typingCues(words, o.keyGain ?? 0.42);
    cue(o.a + 0.05, 'whoosh', 0.35);
    if (o.sendAt) cue(o.sendAt, 'send', 0.4);
    return {
      a: o.a, b: o.b, xin: o.xin, cam: o.cam || [[o.a, { x: 960, y: 560, z: 1.0 }], [o.b + 0.4, { x: 1010, y: 545, z: 1.07 }, 'inOutSine']],
      draw: (T, c) => {
        const { L } = FILM;
        let s = L(c, 0.2, FILM.sky(T, { id: 'pr', n: 90 }) + glow(1300, 300, 900, 'violet', 0.55) + glow(500, 900, 700, 'amber', 0.18));
        s += L(c, 0.5, FILM.motes(T, 30, 9, '#C9C8FF', 0.35));
        s += L(c, 1, A.chat(T, Object.assign({ a: o.a, words }, o.chat || {})));
        if (o.extra) s += o.extra(T, c);
        return s;
      },
    };
  };

  // the chapter mark: a big signpost with the number, and the title beside it (screen space)
  A.chapter = (T, a, b, n, title, o = {}) => {
    if (T < a - 0.1 || T > b + 0.6) return '';
    const u = E.outExpo(seg(T, a, a + 0.7)), out = E.inCubic(seg(T, b, b + 0.45));
    const x = o.x ?? 300, y = o.y ?? 250;
    let s = G({ transform: tr(x, y + (1 - u) * 160 + out * -60, 1.5), opacity: f(u * (1 - out)) }, A.signpost(0, 120, n, { lit: true, hot: 0.8 }));
    s += G({ opacity: f((1 - out) * E.outCubic(seg(T, a + 0.25, a + 0.8))) }, text(x + 110, y + 36 + (1 - E.outExpo(seg(T, a + 0.2, a + 0.9))) * 30, title, { 'font-size': o.size || 92, 'font-weight': 900, fill: '#FFF8EA' }));
    return s;
  };
  A.FILM = FILM;
  window.ART = A;
})();
