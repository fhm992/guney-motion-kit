// v3 s00 HOOK (0 - 24): "The Two Applicants", paper cut-out. "You" = Sam. Maya arrives when the 11 ways begin.
(() => {
  const F = FILM, H = HERO, { G, tr, rect, circ, ell, path, line, text, E, seg, clamp, f, L, cue } = F, K = P.K, st = P.st;
  const SECTION = F.section('s00'), { start, end } = SECTION;

  // sounds (names from sfx/synth)
  cue(0.05, 'paper', 0.5); [0.7, 0.86, 1.0, 1.14, 1.3, 1.45, 1.6, 1.74].forEach((t) => cue(t, 'key1', 0.32)); cue(2.2, 'popup', 0.45); cue(2.3, 'sparkle', 0.35);
  [3.54, 3.78, 4.0].forEach((t) => cue(t, 'peel', 0.42)); cue(4.5, 'whoosh_rev', 0.4); cue(5.45, 'carddeal', 0.35); cue(6.1, 'flutter', 0.4);
  cue(7.3, 'unfold', 0.4); [7.62, 8.06, 8.3, 8.66].forEach((t) => cue(t, 'swish', 0.4)); cue(9.1, 'paper', 0.35); cue(9.84, 'scratch', 0.5);
  cue(11.3, 'slide', 0.35); [12.06, 12.92, 13.62].forEach((t) => cue(t, 'tick', 0.4)); cue(12.2, 'water', 0.25);
  [14.6, 14.85, 15.1, 15.35].forEach((t) => cue(t, 'tick', 0.3)); cue(15.6, 'slot', 0.45); cue(16.7, 'peel', 0.4); cue(16.9, 'unfold', 0.4);
  'Unfortunately,'.split('').forEach((ch, i) => i % 2 === 0 && cue(17.36 + i * 0.05, 'typewriter', 0.3)); cue(18.1, 'deflate', 0.4);
  cue(18.6, 'swish', 0.55); cue(19.28, 'stamp', 0.5); cue(19.6, 'pop', 0.4); cue(20.26, 'poprip', 0.55); cue(20.82, 'thunk', 0.45);
  cue(21.4, 'slide', 0.4); [21.9, 22.25, 22.6].forEach((t) => cue(t, 'hop', 0.3)); cue(21.9, 'scratch', 0.45); cue(22.8, 'stamp', 0.5);

  // a generic AI chat on the laptop screen (300 x 186)
  const chat = (T) => {
    let s = rect(0, 0, 300, 22, '#EDE6D8') + circ(14, 11, 4, K.coral) + circ(28, 11, 4, K.mustard) + circ(42, 11, 4, K.sage) + text(150, 16, 'AI chat', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: K.inkS });
    const msg = 'Fix my resume', n = Math.round(msg.length * clamp(seg(T, 0.66, 1.8)));
    if (n > 0) s += rect(140, 34, 148, 30, K.mustard, { rx: 12 }) + text(152, 54, msg.slice(0, n), { 'font-size': 15, 'font-weight': 800, fill: K.ink });
    const r = seg(T, 2.1, 2.6);
    if (r > 0) { s += rect(12, 74, 200, 100, '#F1EBDF', { rx: 12 }) + text(22, 94, 'Here you go! ✓', { 'font-size': 14, 'font-weight': 800, fill: K.ink }); for (let k = 0; k < 4; k++) if (r * 4 > k) s += rect(22, 106 + k * 15, 150 - k * 18, 7, K.grey, { rx: 3 }); }
    return s;
  };
  const STK = [['Results-driven', 3.54, K.mustard], ['Dynamic', 3.78, K.pink], ['Team player', 4.0, K.sky]];
  const stickers = (T, sx, sy, w, on) => STK.map(([s, t, col], i) => { const u = on ? on : P.pop(T, t); return u > 0 ? G(tr(sx + w * (i === 1 ? 0.7 : 0.45), sy + w * (0.55 + i * 0.32), u * w / 520, i === 1 ? 6 : -4), P.cut(rect(-150, -34, 300, 68, col, { rx: 8 }), 'cutS') + text(0, 14, s, { 'text-anchor': 'middle', 'font-size': 38, 'font-weight': 900, fill: K.ink })) : ''; }).join('');

  const shots = [
    // 1. You asked ChatGPT to fix your resume: Sam at his desk, push in to the screen
    { a: start, b: 3.0, cam: [[0, { x: 1000, y: 560, z: 1.0 }], [2.95, { x: 1150, y: 520, z: 1.75 }, 'inOutSine']], draw: (T, c) => {
      const S = st(T);
      let w = G('', P.cut(rect(250, 200, 360, 300, '#CFE3E2') + rect(250, 200, 360, 300, 'none', { stroke: K.wood, 'stroke-width': 18 }) + line('M430,200 V500 M250,350 H610', K.wood, 10), 'cut')) + P.plant(1640, 690, 0.9);
      w += P.desk(860, 690, 720) + P.laptop(1180, 690, 1.3, chat(S)) + G(tr(1440, 690), P.cut(path('M-26,0 L26,0 L22,-60 L-22,-60 Z', K.coral) + line('M22,-46 q22,0 22,18 q0,18 -22,18', K.coral, 8), 'cutS'));
      w += P.cut(rect(640, 800, 230, 26, K.coralD, { rx: 8 }) + rect(660, 826, 20, 54, K.coralD) + rect(830, 826, 20, 54, K.coralD) + rect(630, 620, 26, 200, K.coralD, { rx: 8 }), 'cut');
      w += P.ch({ x: 760, y: 880, face: 1, sit: true, lean: 6, brows: S > 2.2 ? 'happy' : 'neutral', mouth: S > 2.2 ? 'smile' : 'flat', look: [1, 0], armL: [70 + 6 * Math.sin(S * 22), 40], armR: [62 + 6 * Math.sin(S * 22 + 1.6), 50], legL: [4, -4], legR: [-2, -2], seed: 1 }, T);
      return P.bg(T, c, 'room') + L(c, 1, w) + L(c, 1, P.label(T, 0.5, 600, 260, 'SAM', { bg: K.mustard, size: 56, r: -5 }));
    } },
    // 2. It made you sound smart... but also like everyone else: pull back to a wall of identical resumes
    { a: 3.0, b: 7.05, xin: 0.25, cam: [[3.0, { x: 960, y: 560, z: 1.25 }], [4.4, { x: 960, y: 560, z: 1.18 }], [6.4, { x: 960, y: 540, z: 0.3 }, 'inOutCubic'], [7.1, { x: 960, y: 540, z: 0.28 }]], draw: (T, c) => {
      const S = st(T), w0 = 460, h0 = w0 * 1.35;
      let g = '';
      for (let j = -4; j <= 4; j++) for (let i = -6; i <= 6; i++) {
        if (!i && !j) continue;
        const R = F.R(i * 31 + j * 7 + 99), x = 960 + i * 600 - w0 / 2, y = 540 + j * 760 - h0 / 2, dd = Math.hypot(i, j);
        g += P.sheet(x, y, w0, { flatShadow: true, r: (R() - 0.5) * 6, seed: 2 }) + G(tr(x, y, 1, 0), stickers(T, 0, 0, w0, P.pop(T, 5.3 + dd * 0.09)));
      }
      g += P.sheet(960 - w0 / 2, 540 - h0 / 2, w0, { seed: 2, k: 'lift' }) + stickers(T, 960 - w0 / 2, 540 - h0 / 2, w0);
      let o = P.label(T, 3.6, 960, 110, 'SMART!', { bg: K.cream, size: 80, r: -4 });
      if (S > 4.4) o = P.label(T, 6.08, 960, 540, 'LIKE EVERYONE ELSE', { bg: K.coral, fg: K.cream, size: 96, r: -3, lift: true });
      return P.bg(T, c, 'kraft', { noHills: true, floor: false }) + L(c, 1, g) + (S > 4.4 ? '' : '') + o;
    } },
    // 3. Keep applying, hearing nothing: paper planes fly off and land on a hill of identical planes
    { a: 7.05, b: 11.1, cam: [[7.05, { x: 760, y: 560, z: 1.05 }], [8.4, { x: 820, y: 560, z: 1.05 }], [9.5, { x: 2140, y: 600, z: 1.0 }, 'inOutCubic'], [11.2, { x: 2180, y: 600, z: 1.08 }]], draw: (T, c) => {
      const S = st(T), launches = [7.62, 8.06, 8.3, 8.66];
      let g = '';
      // the hill of planes
      const R = F.R(5);
      for (let k = 0; k < 70; k++) { const a = R() * Math.PI, rr = Math.sqrt(R()), x = 2200 + Math.cos(a) * 420 * rr, y = 880 - Math.sin(a) * 230 * rr; g += P.plane(x, y, 0.9, (R() - 0.5) * 70); }
      g += P.cut(rect(2420, 520, 12, 360, K.woodD), 'cutS') + G(tr(2426, 520, 1, 4), P.cut(rect(-150, -50, 300, 100, K.cream, { rx: 8 }), 'cutS') + text(0, 16, 'APPLICATIONS', { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 900, fill: K.ink }));
      launches.forEach((t0, i) => { const u = seg(S, t0, t0 + 1.4); if (u <= 0) return; const x = F.lerp(560, 2150 + i * 40, E.inOutSine(u)), y = 600 - Math.sin(u * Math.PI) * 220 + u * 200; g += P.plane(x, y, 0.95, -10 + u * 30 + Math.sin(u * 9) * 6); });
      const fold = S > 7.3 && S < 8.9;
      g += P.ch({ x: 420, y: 880, face: 1, brows: S > 9.1 ? 'worried' : 'up', mouth: S > 9.1 ? 'flat' : 'smile', armL: fold ? [100 + 40 * Math.sin(S * 14), -30] : [10, 10], armR: [40, 40], seed: 1 }, T);
      g += P.sticky(1880, 360, 170, 'replies: 0', { r: -6, size: 40, s: P.pop(T, 9.04) });
      g += P.loop(T, 9.84, 2200, 760, 520, 230, { d: 0.6, w: 11 }) + (S > 10.25 ? P.pencil(2200, 440, 'all the same', { size: 84, r: -4 }) : '');
      return P.bg(T, c, 'sky', { seed: 8 }) + L(c, 1, g);
    } },
    // 4. You check your email between every little task: a cut-away flat, three rooms
    { a: 11.1, b: 14.3, cam: [[11.1, { x: 520, y: 560, z: 1.08 }], [14.35, { x: 1420, y: 560, z: 1.08 }, 'inOutSine']], draw: (T, c) => {
      const S = st(T);
      let g = '';
      const rooms = [[60, '#F3D9A0', 'KITCHEN'], [700, '#CFE3E2', 'LIVING ROOM'], [1340, '#F3C3B8', 'LAUNDRY']];
      rooms.forEach(([x, col]) => (g += P.cut(rect(x, 240, 620, 640, col), 'flat')));
      g += P.cut(rect(40, 220, 1940, 24, K.woodD) + rect(40, 860, 1940, 30, K.woodD) + rect(680, 240, 20, 640, K.woodD) + rect(1320, 240, 20, 640, K.woodD) + rect(1960, 240, 20, 640, K.woodD), 'cut');
      // props
      g += P.cut(rect(120, 640, 500, 220, '#E9E1D2') + rect(140, 600, 460, 40, K.grey), 'cut') + G(tr(240, 600), P.cut(path('M-30,0 L30,0 L24,-56 L-24,-56 Z', K.teal), 'cutS'));
      g += P.plant(1080, 860, 1.1) + P.cut(rect(760, 720, 240, 140, K.coral, { rx: 20 }), 'cut');
      g += P.cut(rect(1420, 640, 220, 220, K.white, { rx: 24 }) + circ(1530, 750, 70, '#CFE3E2') + circ(1530, 750, 70, 'none', { stroke: K.grey, 'stroke-width': 12 }), 'cut') + P.cut(path('M1700,860 L1900,860 L1880,760 L1720,760 Z', '#E7C48E'), 'cut');
      // Sam hops room to room (stop-motion); between tasks he checks his phone: 0 new
      const steps = [[11.1, 470, 12.3, 12.04], [12.3, 1180, 13.14, 12.9], [13.14, 1800, 99, 13.6]];
      steps.forEach(([a, x, b, chk]) => {
        if (S < a || S >= b) return;
        const look = S >= chk && S < chk + 0.55;
        const scr = look ? text(0, 6, '0', { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: K.coral }) : '';
        g += P.ch({ x, y: 860, face: x > 1500 ? -1 : 1, brows: look ? 'worried' : 'neutral', mouth: look ? 'flat' : 'smile', look: look ? [0, -1] : [1, 0], armL: look ? [150, 40] : [60 + 20 * Math.sin(S * 10), 30], prop: look ? G('rotate(-150)', P.phone(1.3, scr)) : '', seed: 1 }, T);
        if (look) g += G(tr(x + (x > 1500 ? -120 : 120), 420, P.pop(T, chk, 0.2)), P.cut(circ(0, 0, 58, K.white), 'cutS') + G('translate(-30,-20) scale(0.34)', P.env(90, 58, 1)) + circ(36, -36, 22, K.coral) + text(36, -26, '0', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 900, fill: K.cream }));
      });
      return P.bg(T, c, 'kraft', { noHills: true, floor: false }) + L(c, 1, g);
    } },
    // 5. The only reply this week starts with... "Unfortunately,"
    { a: 14.3, b: 18.62, xin: 0.3, cam: [[14.3, { x: 960, y: 540, z: 1.0 }], [16.5, { x: 960, y: 560, z: 1.06 }], [17.3, { x: 980, y: 560, z: 1.12 }, 'inOutCubic'], [18.7, { x: 990, y: 570, z: 1.16 }]], draw: (T, c) => {
      const S = st(T);
      let g = '';
      const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], cur = Math.min(6, Math.floor(seg(S, 14.5, 16.3) * 7));
      days.forEach((d, i) => { const on = i <= cur; g += G(tr(420 + i * 180, 170, 1, (i % 2 ? 2 : -2)), P.cut(rect(-70, -50, 140, 100, on ? K.cream : '#8C97B5', { rx: 10 }), 'cutS') + text(0, 14, d, { 'text-anchor': 'middle', 'font-size': 38, 'font-weight': 900, fill: on ? K.ink : '#5E6890' }) + (on && i < cur ? line('M-50,-30 L50,30', K.red, 7, { opacity: 0.85 }) : '')); });
      // door with mail slot; the envelope drops through it
      g += P.cut(rect(1300, 300, 360, 580, K.navy, { rx: 10 }) + rect(1400, 560, 160, 22, '#1B2240', { rx: 8 }) + circ(1340, 600, 12, K.mustard), 'cut');
      const drop = seg(S, 15.56, 16.2), opn = E.outCubic(seg(S, 16.66, 16.95)), rise = E.outCubic(seg(S, 16.9, 17.3));
      if (drop > 0 && rise < 1) g += P.env(F.lerp(1480, 1200, E.outBounce ? E.outBounce(drop) : drop), F.lerp(570, 840, E.inQuad ? E.inQuad(drop) : drop), 0.9, opn);
      // Sam waits, then deflates
      const sad = S > 18.0;
      g += P.ch({ x: 560, y: 880, face: 1, brows: sad ? 'sad' : 'up', mouth: sad ? 'frown' : 'o', eyes: sad ? 'half' : 'open', look: [1, 1], lean: sad ? -6 : 2, armL: [10, 10], seed: 1 }, T);
      if (S > 18.0) g += G(tr(540, 330, P.pop(T, 18.0, 0.3)), P.cloud(0, 0, 0.9));
      // the letter rises over the scene
      let ov = '';
      if (rise > 0) { const typed = 'Unfortunately,'.slice(0, Math.round(14 * seg(S, 17.36, 18.08))); ov = G(tr(1150, 1240 - 640 * rise, 0.85, -3), P.cut(rect(-280, -330, 560, 660, K.white, { rx: 6 }), 'lift') + text(-220, -240, 'Dear Sam,', { 'font-family': 'Courier New, monospace', 'font-size': 40, 'font-weight': 700, fill: K.ink }) + text(-220, -170, typed, { 'font-family': 'Courier New, monospace', 'font-size': 54, 'font-weight': 700, fill: K.red }) + [0, 1, 2, 3, 4].map((k) => rect(-220, -100 + k * 50, 400 - k * 30, 12, K.grey, { rx: 4 })).join('')); }
      return P.bg(T, c, 'dusk', { seed: 4 }) + L(c, 1, g + ov);
    } },
    // 6. Here are 11 ways to use AI to fix that: the 11 slams in; the frame tears into two: Sam | Maya
    { a: 18.62, b: 21.45, xin: 0.04, cam: [[18.62, { x: 960, y: 540, z: 1.12 }], [21.5, { x: 960, y: 540, z: 1.0 }, 'inOutSine']], draw: (T, c) => {
      const S = st(T);
      if (S < 20.26) {
        const u = P.pop(T, 19.28), v = P.pop(T, 19.58);
        let g = '';
        if (u > 0) g += G(tr(960, 520, u, -4), P.cut(text(0, 160, '11', { 'text-anchor': 'middle', 'font-size': 460, 'font-weight': 900, fill: K.coral }), 'lift'));
        if (v > 0) g += P.strip(960, 760, 'WAYS TO USE AI', { size: 84, s: v, bg: K.cream, r: 2 });
        return P.bg(T, c, 'sun', { seed: 6 }) + L(c, 1, g);
      }
      const sl = E.outCubic(seg(S, 20.26, 20.7));
      const room = (pal, mood, x, wave) => (T2, c2) => P.bg(T2, c2, mood, { seed: pal === 'maya' ? 11 : 3 }) + L(c2, 1, P.ch({ pal, x, y: 860, s: 1.2, face: 0, brows: wave ? 'happy' : 'up', mouth: wave ? 'grin' : 'smile', armL: wave ? [150 + 18 * Math.sin(st(T2) * 9), -30] : [12, 10], seed: wave ? 3 : 1 }, T2) + P.label(T2, 20.4, x, 980, pal === 'maya' ? 'MAYA' : 'SAM', { bg: K.cream, fg: pal === 'maya' ? K.tealD : K.ink, size: 90 }));
      const cc = { x: 960, y: 560, z: 1.0 + 0.04 * seg(T, 20.3, 21.5) };
      return P.bg(T, c, 'board', { noHills: true, floor: false }) + P.split(T, F.drift(T, cc, 0.7), F.drift(T + 3, cc, 0.7), room('sam', 'mustard', 960, false), room('maya', 'teal', 960, true), { slide: sl, id: 'sp6' }) + P.score(T, 20.8, 0, 0, { round: '' });
    } },
    // 7. Number seven is the one most people skip: stepping stones 1-11, paper people hop over 7
    { a: 21.45, b: end, xin: 0.04, cam: [[21.45, { x: 900, y: 600, z: 0.95 }], [23.2, { x: 1100, y: 620, z: 1.25 }, 'inOutCubic'], [24, { x: 1140, y: 620, z: 1.32 }]], draw: (T, c) => {
      const S = st(T);
      let g = '';
      const sx = (i) => 140 + i * 165, sy = (i) => 820 - Math.sin(i * 0.6) * 20;
      for (let i = 0; i < 11; i++) g += G(tr(sx(i), sy(i)), P.cut(ell(0, 0, 70, 30, i === 6 ? K.mustard : K.cream), 'cutS') + text(0, 14, String(i + 1), { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 900, fill: K.ink }));
      // three paper people hop along, leaping clean over stone 7
      [0, 1, 2].forEach((k) => {
        const p = (S - 21.5) * 2.6 - k * 1.3; if (p < 0) return;
        const i0 = Math.floor(p), fr = p - i0; if (i0 >= 10) return;
        let from = i0, to = i0 + 1; if (to === 6) { to = 7; } if (from === 6) return;
        const x = F.lerp(sx(from), sx(to), fr), y = F.lerp(sy(from), sy(to), fr) - Math.sin(fr * Math.PI) * (to - from > 1 ? 200 : 70) - 20;
        g += P.ch({ pal: 'paperfolk', x, y, s: 0.5, face: 1, armL: [40, 20], armR: [-30, 20], legL: [20, -30], legR: [-10, -20], seed: 4 + k }, T);
      });
      g += P.loop(T, 21.88, sx(6), sy(6), 110, 60, { d: 0.5 });
      return P.bg(T, c, 'sky', { seed: 12, fy: 860 }) + L(c, 1, g) + P.label(T, 22.78, 960, 200, 'MOST PEOPLE SKIP #7', { bg: K.coral, fg: K.cream, size: 84, lift: true });
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots, xfade: 0.3, vignette: '', overlay: (T) => P.wipe(T, 18.62) + P.wipe(T, 21.45, { col: K.sky, seed: 4 }) });
})();
