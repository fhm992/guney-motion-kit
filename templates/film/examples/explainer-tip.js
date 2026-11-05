// v2 s04 TIP 3: TURN DUTIES INTO RESULTS (93.33 - 130.75)
(() => {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, ell, path, line, text, glow, E, seg, clamp, kf, f, L, cue } = F, K = V.K;
  const SECTION = F.section('s04'), { start, end } = SECTION;
  cue(93.4, 'whoosh', 0.4); [95.7, 96.0, 96.3, 96.6].forEach((t) => cue(t, 'highlight', 0.4)); cue(98.3, 'poprip', 0.4); cue(102.24, 'tick', 0.45); cue(103.92, 'rise', 0.4); cue(104.4, 'glint', 0.4);
  F.SEC_CUES(105.2); cue(106.3, 'thunk', 0.45); cue(107.04, 'sparkle', 0.5); cue(108.4, 'peel', 0.5); cue(109.6, 'paste', 0.5); cue(115.4, 'pop', 0.4); cue(116.24, 'pop', 0.4); cue(117.42, 'pop', 0.4);
  cue(119.0, 'question', 0.3); cue(120.06, 'chime', 0.5); cue(120.3, 'sparkle', 0.35); for (let k = 0; k < 14; k++) cue(125.34 + k * 0.04, 'counter', 0.3); cue(127.85, 'chop', 0.55); cue(129.4, 'rise', 0.35); cue(129.9, 'thunk', 0.45);
  const shots = [
    // 1. your bullet points: half start with "Responsible for"
    { a: start, b: 98.25, cam: [[93.33, { x: 960, y: 540, z: 1.35 }], [98.3, { x: 960, y: 520, z: 1.05 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'day');
      let inner = '';
      for (let i = 0; i < 8; i++) { const y = 140 + i * 74, resp = i % 2 === 0, u = resp ? E.outCubic(seg(T, 95.6 + (i / 2) * 0.3, 95.9 + (i / 2) * 0.3)) : 0; if (u > 0) inner += rect(40, y - 40, 310 * u, 56, K.yellow, { rx: 12 }); inner += circ(56, y - 12, 9, K.ink) + text(80, y, resp ? 'Responsible for' : '', { 'font-size': 40, 'font-weight': 800, fill: K.ink }) + rect(resp ? 380 : 80, y - 26, resp ? 400 : 680 - (i * 41) % 160, 22, '#B9BDCC', { rx: 11 }); }
      let g = V.card(500, 120, 900, 760, 'YOUR BULLET POINTS', { inner, col: K.navy });
      const cnt = Math.min(4, Math.floor(seg(T, 95.6, 96.9) * 4.99));
      if (T > 95.6) g += G(tr(1520, 300), V.OL(circ(0, 0, 100, K.coral)) + text(0, 20, `${cnt}/8`, { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 900, fill: K.cream }));
      return s + L(c, 1, g);
    } },
    // 2. most people's do: a crowd, every one holding the same yellow lines
    { a: 98.25, b: 99.7, xin: 0.3, cam: [[98.25, { x: 960, y: 560, z: 1.6 }], [99.8, { x: 960, y: 560, z: 1.0 }, 'inOutCubic']], draw: (T, c) => V.bg(T, c, 'day', { id: 'b' }) + L(c, 1, V.crowd(T, 17, 9, 112, 118, { x0: 960 - 8 * 112, y0: 560 - 4 * 118 + 30, s: 1.1, col: '#E7E2F5', me: [8, 4], meCol: K.coral })) + V.big(T, 98.3, 99.6, 'MOST PEOPLE', { y: 150, size: 110, col: K.yellow }) },
    // 3. a hiring manager weighs "supposed to do" against "actually did"
    { a: 99.7, b: 105.15, cam: [[99.7, { x: 960, y: 560, z: 1.08 }], [102.3, { x: 760, y: 540, z: 1.15 }, 'inOutSine'], [104.0, { x: 1160, y: 540, z: 1.15 }, 'inOutCubic'], [105.3, { x: 1160, y: 540, z: 1.2 }]], draw: (T, c) => {
      let s = V.bg(T, c, 'purple', { id: 'c' });
      const lr = E.inOutCubic(seg(T, 103.7, 104.1)), ll = E.inOutCubic(seg(T, 101.9, 102.3));
      let li = '', ri = '';
      for (let i = 0; i < 4; i++) li += rect(40, 110 + i * 70, 44, 44, 'none', { rx: 8, stroke: K.ink, 'stroke-width': 6 }) + rect(110, 124 + i * 70, 220 - (i % 2) * 50, 16, '#B9BDCC', { rx: 8 });
      [0.4, 0.62, 0.9].forEach((h, i) => { const u = E.outCubic(seg(T, 103.95 + i * 0.12, 104.5 + i * 0.12)); ri += rect(70 + i * 100, 400 - 260 * h * u, 76, 260 * h * u, [K.mint, K.yellow, K.coral][i], { rx: 10 }); });
      let g = V.card(220, 180, 420, 440, 'SUPPOSED TO DO', { inner: li, col: K.greyD, op: 1 - 0.45 * lr }) + V.card(1280, 180, 420, 440, 'ACTUALLY DID', { inner: ri, col: K.coral, op: 0.6 + 0.4 * lr });
      g += V.floor(920) + V.OL(H.svg({ x: 960, y: 950, face: lr > 0.5 ? 1 : ll > 0.5 ? -1 : 0, pal: 'boss', brows: lr > 0.5 ? 'up' : 'neutral', mouth: lr > 0.5 ? 'smile' : 'flat', look: [lr > 0.5 ? 1 : -ll, 0], armL: [10, 10], armR: [10, 10], seed: 9 }, T)) + V.label(T, 100.0, 960, 420, 'HIRING MANAGER', { bg: K.cream, size: 34 });
      return s + L(c, 1, g);
    } },
    // 4. the duty -> result machine (tip 3)
    { a: 105.15, b: 108.0, cam: [[105.15, { x: 960, y: 580, z: 1.1 }], [108.1, { x: 1000, y: 560, z: 1.2 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'day', { id: 'd' });
      let g = V.OL(rect(800, 480, 360, 300, K.purple, { rx: 30 })) + G(`translate(980,630) rotate(${f(T * 160)})`, V.OL(circ(0, 0, 70, K.yellow), 2) + circ(0, 0, 26, K.yellowD));
      const iu = seg(T, 105.6, 106.3), ou = seg(T, 106.9, 107.6);
      if (iu < 1) g += G(tr(F.lerp(450, 800, E.inCubic(iu)), 700), V.OL(rect(-70, -50, 140, 100, '#B9BDCC', { rx: 12 }), 2) + text(0, 12, 'DUTY', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: K.ink }));
      if (ou > 0) { const x = F.lerp(1160, 1480, E.outCubic(ou)), y = 700 - Math.sin(ou * Math.PI) * 140; g += glow(x, y, 160, 'amber', 0.9) + G(tr(x, y, 1.2, ou * 20), V.OL(path('M0,-70 L60,-24 L36,60 L-36,60 L-60,-24 Z', K.yellow), 2) + text(0, 12, 'RESULT', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 900, fill: K.ink })); }
      return s + L(c, 1, V.floor(860) + g);
    } },
    // 5. paste one bullet (sticker peel) into the phone
    { a: 108.0, b: 111.9, cam: [[108.0, { x: 960, y: 540, z: 1.15 }], [111.95, { x: 1000, y: 540, z: 1.05 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'purple', { id: 'e' });
      const fly = E.inOutCubic(seg(T, 108.9, 109.6));
      let g = V.card(240, 240, 520, 600, 'RESUME', { col: K.navy, inner: [0, 1, 2, 3, 4].map((i) => rect(40, 120 + i * 90, 400 - (i % 2) * 80, 24, i === 1 && T < 108.4 ? K.yellow : '#B9BDCC', { rx: 12 })).join('') });
      g += V.phone(T, { a: 108.2, words: [], x: 1120, y: 60, s: 0.9 });
      if (T > 108.3) g += G(tr(F.lerp(500, 1390, fly), F.lerp(452, 430, fly), 1 + 0.2 * Math.sin(fly * Math.PI), -10 + 10 * fly), V.OL(rect(-200, -30, 400, 60, K.yellow, { rx: 12 }), 2) + text(0, 14, 'Responsible for...', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 900, fill: K.ink }));
      return s + L(c, 1, g);
    } },
    // 6. the prompt, with three questions as icons
    V.promptShot({ a: 111.9, b: 118.45, t0: 111.9, t1: 118.1, xin: 0.35, sendAt: 118.2, phone: { hl: ['result.', 'questions'], sentAt: 118.2, reply: () => '' },
      left: (T) => [['HOW MANY?', 115.4, K.yellow], ['HOW FAST?', 116.24, K.mint], ['HOW MUCH $?', 117.42, K.coral]].map(([lab, t0, col], i) => V.label(T, t0, 300 + (i % 2) * 120, 220 + i * 130, lab, { bg: col, size: 44 })).join('') }),
    // 7. memory unlocked
    { a: 118.45, b: 121.55, cam: [[118.45, { x: 960, y: 540, z: 1.1 }], [121.6, { x: 960, y: 500, z: 1.25 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'mint', { id: 'f' });
      const un = E.outBackSoft(seg(T, 120.0, 120.4));
      let g = V.floor(920) + V.ch({ x: 960, y: 960, face: 0, brows: T > 120 ? 'up' : 'worried', mouth: T > 120 ? 'o' : 'wavy', eyes: T > 120 ? 'wide' : 'open', look: [0, -1], armL: T < 120 ? [160, 40] : [30, 20], armR: [30, 20], seed: 1 }, T);
      if (T < 120.1) ['How many a day?', 'How fast?'].forEach((q, i) => (g += V.chip(640 + i * 640, 300, q, { size: 40, bg: K.cream, op: seg(T, 118.7 + i * 0.4, 119.0 + i * 0.4) })));
      if (un > 0) { g += glow(960, 330, 300, 'amber', un) + G(tr(960, 330, un), V.OL(circ(0, 0, 110, K.yellow)) + V.OL(circ(0, -14, 50, K.cream) + rect(-24, 34, 48, 34, K.greyD, { rx: 8 }), 2) + line('M-16,-10 l16,22 l16,-22', K.yellowD, 6)); [['40 emails a day', -1], ['Wait times cut in half', 1]].forEach(([lab, sd], i) => (g += V.chip(960 + sd * 470, 240 + i * 150, lab, { size: 42, bg: K.cream, s: E.outBackSoft(seg(T, 120.3 + i * 0.25, 120.7 + i * 0.25)) }))); }
      return s + L(c, 1, g) + V.big(T, 120.05, 121.4, 'MEMORY UNLOCKED', { y: 1010, size: 80, col: K.yellow });
    } },
    // 8. before / after: the line rewrites itself with a counter and a bar chart
    { a: 121.55, b: 128.5, cam: [[121.55, { x: 960, y: 520, z: 1.12 }], [125.0, { x: 960, y: 520, z: 1.18 }], [128.6, { x: 960, y: 540, z: 1.08 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'day', { id: 'g' });
      const mo = E.inOutCubic(seg(T, 124.86, 125.3)), n = Math.min(40, Math.floor(seg(T, 125.34, 125.95) * 40));
      let g = V.card(260, 160, 640, 260, 'BEFORE', { col: K.greyD, op: E.outCubic(seg(T, 121.7, 122.2)), inner: text(320, 170, 'Responsible for', { 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 900, fill: '#6E7790' }) + text(320, 226, 'customer emails', { 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 900, fill: '#6E7790' }) });
      if (mo > 0) {
        g += V.card(1020, 160, 640, 260, 'AFTER', { col: K.coral, op: mo, inner: text(320, 170, `Answered ${n} emails a day`, { 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 900, fill: K.ink }) + text(320, 226, T > 126.9 ? 'and cut wait times in half' : '', { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 900, fill: K.ink }) });
        g += G(tr(640, 640), V.OL(circ(0, 0, 150, K.yellow)) + text(0, 30, String(n), { 'text-anchor': 'middle', 'font-size': 130, 'font-weight': 900, fill: K.ink }) + text(0, 110, 'emails / day', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 900, fill: K.ink }));
        const bu = E.outCubic(seg(T, 126.4, 126.9)), cut = E.inOutCubic(seg(T, 127.85, 128.2));
        if (bu > 0) g += V.bar(1050, 600, 600 * bu, 70, 1, K.coral, 'WAIT TIME', { size: 40 }) + (cut > 0 ? V.bar(1050, 720, 600 * bu * (1 - 0.5 * cut), 70, 1, K.mint, 'AFTER', { size: 40 }) : '');
      }
      return s + L(c, 1, g);
    } },
    // 9. same job, much stronger line: impact gauge
    { a: 128.5, b: end, cam: [[128.5, { x: 960, y: 540, z: 1.15 }], [130.9, { x: 960, y: 540, z: 1.05 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'mint', { id: 'h' });
      const v = 0.12 + 0.8 * E.outCubic(seg(T, 129.3, 130.0));
      let g = V.gauge(960, 560, 260, v, 'IMPACT', { flip: true }) + V.floor(920) + V.ch({ x: 1500, y: 960, face: 0, brows: 'happy', mouth: T > 129.7 ? 'grin' : 'smile', armL: T > 129.7 ? [100, 80] : [10, 10], armR: T > 129.7 ? [100, 80] : [10, 10], seed: 1 }, T);
      return s + L(c, 1, g) + V.big(T, 128.6, 130.6, 'SAME JOB. STRONGER LINE.', { y: 150, size: 90, col: K.yellow });
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots, overlay: (T) => V.big(T, 96.45, 97.95, '“RESPONSIBLE FOR”', { y: 1000, size: 90, col: K.yellow }) + V.tip(T, 105.2, 106.0, 3, 'Duties into results') + V.hud(T) });
})();
