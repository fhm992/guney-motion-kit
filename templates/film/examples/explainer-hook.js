// v2 s00 HOOK: you, everyone else, the hiring machine, the silence, "unfortunately", 11 ways to hack it.
(() => {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, ell, path, line, text, glow, E, seg, clamp, kf, f, L, cue } = F, K = V.K;
  const SECTION = F.section('s00'), { start, end } = SECTION;
  const desk = (x, y) => V.OL(rect(x, y, 620, 34, '#B9773A', { rx: 12 }) + rect(x + 30, y + 34, 26, 180, '#94592A') + rect(x + 564, y + 34, 26, 180, '#94592A'), 2);
  const lap = (x, y, s, scr) => G(tr(x, y, s), V.OL(rect(-150, -210, 300, 200, K.navy, { rx: 14 }) + path('M-170,-10 L170,-10 L184,4 L-184,4 Z', '#D9D3E8'), 2) + rect(-136, -198, 272, 176, K.cream, { rx: 6 }) + G('translate(-136,-198)', scr || ''));
  const gradCap = (x, y, s = 1) => G(tr(x, y, s), path('M-80,0 L0,-34 L80,0 L0,34 Z', K.ink) + rect(-44, 6, 88, 40, K.ink, { rx: 8 }) + line('M60,6 V54', K.yellow, 6) + circ(60, 58, 8, K.yellow));
  cue(0.3, 'pop', 0.5); cue(1.0, 'popup', 0.45); cue(1.7, 'sparkle', 0.6); cue(3.05, 'slam', 0.4); cue(3.8, 'rise', 0.35); cue(4.5, 'whoosh', 0.6); cue(6.1, 'poprip', 0.5);
  cue(7.3, 'hum', 0.6); [7.7, 8.0, 8.3, 8.6, 8.9].forEach((t) => cue(t, 'paper', 0.25)); cue(9.1, 'question', 0.35); cue(9.9, 'thunk', 0.5);
  cue(11.58, 'refresh', 0.5); cue(12.7, 'refresh', 0.5); cue(13.4, 'refresh', 0.5); cue(15.56, 'ding', 0.55); cue(17.4, 'stamp', 0.7); cue(17.6, 'deflate', 0.4);
  cue(18.9, 'rise', 0.55); for (let k = 0; k < 11; k++) cue(19.3 + k * 0.1, 'pop', 0.22); cue(21.9, 'impact', 0.45); cue(22.3, 'stamp', 0.5);

  const shots = [
    // 1. you asked AI to fix your resume; it made you sound smart
    { a: start, b: 4.4, cam: [[0, { x: 960, y: 560, z: 1.12 }], [4.5, { x: 900, y: 520, z: 1.3 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'day');
      const up = E.inOutCubic(seg(T, 3.0, 3.5)), cap = E.outBackSoft(seg(T, 3.05, 3.4));
      const scr = rect(0, 0, 272, 26, K.purple, { rx: 6 }) + rect(0, 26, 272, 150, '#2C2F66') + (T > 1.0 ? rect(110, 40, 150, 40, K.purple, { rx: 12 }) + rect(122, 54, 110, 8, K.cream, { rx: 4 }) : '') + (T > 1.8 ? A.resume(20, 92, 56, { gold: true, lines: 4 }) : '');
      let w = V.floor(870) + V.ch({ x: 620, y: 880, face: 1, sit: true, lean: 10 - up * 12, tilt: 8 - up * 12, brows: up > 0.5 ? 'up' : 'neutral', mouth: up > 0.5 ? 'grin' : 'flat', look: [1, 1 - up], armL: [72 + 7 * Math.sin(T * 15) * (1 - up), 40], armR: [62 + 7 * Math.sin(T * 15 + 1.7) * (1 - up), 50], legL: [4, -4], legR: [-2, -2], seed: 1 }, T);
      w += desk(700, 680) + lap(990, 680, 1, scr);
      if (cap > 0) w += gradCap(642, F.lerp(-200, 452, cap), 0.9);
      const pu = E.outBackSoft(seg(T, 1.75, 2.2));
      if (pu > 0) w += G(tr(1320, 330, pu, 6), V.OL(A.resume(-80, -104, 160, { gold: true, shine: seg(T, 2.0, 2.8) }), 2));
      w += V.label(T, 0.3, 380, 330, 'YOU', { to: [560, 470], bg: K.yellow, size: 52 });
      if (T > 3.6) w += V.gauge(1480, 560, 130, 0.1 + 0.8 * E.outCubic(seg(T, 3.7, 4.2)), 'SOUNDS SMART', { flip: true });
      s += L(c, 1, w);
      return s;
    } },
    // 2. ...like everyone else: she is one face in a crowd of identical graduates
    { a: 4.4, b: 7.15, xin: 0.3, cam: [[4.4, { x: 960, y: 560, z: 5.2 }], [6.9, { x: 960, y: 560, z: 1.0 }, 'inOutCubic'], [7.3, { x: 960, y: 560, z: 0.96 }]], draw: (T, c) => {
      let s = V.bg(T, c, 'day', { id: 'b' });
      s += L(c, 1, V.crowd(T, 21, 11, 92, 104, { x0: 960 - 10 * 92, y0: 560 - 5 * 104 + 30, s: 1.0, cap: true, me: [10, 5], meCol: K.coral }));
      return s;
    } },
    // 3. the hiring machine: applications pour in, nothing comes out
    { a: 7.15, b: 11.2, cam: [[7.15, { x: 960, y: 420, z: 1.25 }], [9.6, { x: 960, y: 560, z: 1.02 }, 'inOutSine'], [11.3, { x: 960, y: 600, z: 1.1 }]], draw: (T, c) => {
      let s = V.bg(T, c, 'day', { id: 'c' });
      let m = path('M560,140 L1360,140 L1120,420 L800,420 Z', K.purple) + rect(720, 420, 480, 320, '#5345C9', { rx: 26 }) + rect(900, 740, 120, 120, '#3C3391', { rx: 10 });
      [[830, 560, 70], [1090, 560, 70], [960, 640, 50]].forEach(([x, y, r], i) => { let g = circ(0, 0, r, K.yellow); for (let k = 0; k < 8; k++) g += rect(-10, -r - 16, 20, 26, K.yellow, { transform: `rotate(${k * 45})` }); g += circ(0, 0, r * 0.4, K.yellowD); m += G(`translate(${x},${y}) rotate(${f(T * (i % 2 ? -90 : 90))})`, g); });
      m += text(960, 230, 'THE HIRING MACHINE', { 'text-anchor': 'middle', 'font-size': 52, 'font-weight': 900, fill: K.cream });
      s += L(c, 1, V.OL(m));
      let w = '';
      for (let k = 0; k < 14; k++) { const t0 = 7.4 + k * 0.22, u = seg(T, t0, t0 + 0.9); if (u > 0 && u < 1) { const x = F.lerp(300 + (k % 5) * 320, 960, E.inSine(u)), y = F.lerp(-120, 300, E.inSine(u)); w += G(tr(x, y, 1, u * 200), V.OL(A.resume(-30, -39, 60, { fill: T > 9.85 ? K.yellow : undefined }), 2)); } }
      // nothing comes out: Maya waits at the output with an empty tray
      w += V.OL(rect(820, 880, 280, 30, K.cream, { rx: 10 }), 2) + V.ch({ x: 1300, y: 940, s: 0.9, face: -1, brows: 'worried', mouth: 'flat', look: [-1, 1], tilt: 8, seed: 1 }, T);
      if (T > 9.05) w += G({ opacity: f(seg(T, 9.05, 9.3) * (1 - seg(T, 10.6, 11.0))) }, A.bubble(1180, 420, 200, 100, { fill: K.cream, inner: [0, 1, 2].map((k) => circ(-40 + k * 40, 0, 10, K.greyD)).join('') }));
      s += L(c, 1, w) + V.label(T, 9.9, 960, 990, 'ALL THE SAME', { bg: K.yellow, size: 56 });
      return s;
    } },
    // 4. a day in the life: a check of the inbox between every little task
    { a: 11.2, b: 14.4, cam: [[11.2, { x: 700, y: 540, z: 1.2 }], [14.5, { x: 1260, y: 540, z: 1.2 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'day', { id: 'd' });
      let w = V.OL(rect(160, 600, 1600, 20, K.cream, { rx: 10 }), 2);
      ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'].forEach((h, i) => (w += text(200 + i * 380, 680, h, { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 900, fill: K.cream })));
      [['clock', 330, 'COFFEE'], ['doc', 900, 'LAUNDRY'], ['heart', 1470, 'DISHES']].forEach(([ic, x, lab], i) => (w += V.icon(ic, x, 470, 1.4, K.cream) + text(x, 370, lab, { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 900, fill: K.cream })));
      [11.58, 12.7, 13.4].forEach((t0, i) => { const u = E.outBackSoft(seg(T, t0, t0 + 0.35)); if (u > 0) { const x = 615 + i * 570; w += G(tr(x, 470, u), V.OL(rect(-44, -80, 88, 160, K.navy, { rx: 16 }), 2) + rect(-34, -66, 68, 132, K.cream, { rx: 8 }) + G(`rotate(${f(T * 400)},0,0)`, path('M0,-22 A22,22 0 0 1 22,0', 'none', { stroke: K.purple, 'stroke-width': 7, 'stroke-linecap': 'round' }))); w += text(x, 590, `CHECK #${i + 1}`, { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: K.yellow }); } });
      w += V.ch({ x: F.lerp(250, 1700, seg(T, 11.2, 14.4)), y: 590, s: 0.42, face: 1, walk: T * 2.2, brows: 'neutral', mouth: 'flat', seed: 1 }, T);
      s += L(c, 1, w);
      return s;
    } },
    // 5. one reply this week... "Unfortunately," REJECTED
    { a: 14.4, b: 18.6, cam: [[14.4, { x: 960, y: 560, z: 1.1 }], [17.3, { x: 1060, y: 500, z: 1.3 }, 'inOutSine'], [18.7, { x: 1060, y: 500, z: 1.34 }]], draw: (T, c) => {
      let s = V.bg(T, c, T > 17.36 ? ['#E88A7A', '#B5524A'] : 'day', { id: 'e' });
      const hop = E.inOutCubic(seg(T, 15.6, 15.9)) * (1 - E.inOutCubic(seg(T, 16.0, 16.3))), sad = E.inOutCubic(seg(T, 17.5, 18.0));
      let w = V.floor(900) + V.ch({ x: 600, y: 940 - hop * 50, s: 1.1, face: 1, lean: sad * 10, tilt: sad * 14, brows: sad > 0.5 ? 'sad' : T > 15.6 ? 'up' : 'neutral', mouth: sad > 0.5 ? 'frown' : T > 15.6 ? 'grin' : 'flat', eyes: sad > 0.6 ? 'half' : 'open', look: [1, 0], armL: [80 - sad * 40, 20], seed: 1 }, T);
      let ph = V.OL(rect(-210, -360, 420, 720, K.navy, { rx: 50 })) + rect(-190, -340, 380, 680, K.cream, { rx: 36 }) + rect(-190, -340, 380, 90, K.purple, { rx: 36 }) + rect(-190, -280, 380, 30, K.purple) + text(-160, -282, 'Inbox', { 'font-size': 34, 'font-weight': 900, fill: K.cream });
      if (T > 15.56) ph += G({ opacity: f(seg(T, 15.56, 15.8)) }, rect(-170, -230, 340, 90, '#FFFFFF', { rx: 14, stroke: K.coral, 'stroke-width': 4 }) + circ(-130, -185, 14, K.coral) + text(-100, -176, 'Re: your application', { 'font-size': 26, 'font-weight': 800, fill: K.ink }));
      const k = Math.floor(14 * clamp((T - 17.36) / 0.6));
      if (T > 16.7) ph += text(-160, -60, 'Hi,', { 'font-size': 36, 'font-weight': 800, fill: K.ink }) + text(-160, 20, 'Unfortunately,'.slice(0, k), { 'font-size': 56, 'font-weight': 900, fill: K.coralD });
      w += G(tr(1300, 520, 1, 4), ph);
      s += L(c, 1, w) + L(c, 1, V.stamp(T, 17.4, 1300, 680, 'REJECTED', { size: 80 }));
      return s;
    } },
    // 6 + 7. 11 ways to hack the machine; number 7 is the one most people skip
    { a: 18.6, b: end, cam: [[18.6, { x: 960, y: 540, z: 1.3 }], [21.3, { x: 960, y: 540, z: 1.0 }, 'inOutCubic'], [24.2, { x: 1150, y: 600, z: 1.35 }, 'inOutSine']], draw: (T, c) => {
      let s = V.bg(T, c, 'purple', { id: 'f' });
      let w = '';
      for (let i = 0; i < 11; i++) {
        const a = Math.PI + (i / 10) * Math.PI, x = 960 + Math.cos(a) * 700, y = 860 + Math.sin(a) * 420, u = E.outBackSoft(seg(T, 19.3 + i * 0.1, 19.65 + i * 0.1)), seven = i === 6, hot = seven ? seg(T, 21.8, 22.2) : 0;
        if (u > 0) w += G(tr(x, y, u * (1 + hot * 0.45)), (seven && hot ? glow(0, 0, 160, 'amber', hot) : '') + V.OL(circ(0, 0, 62, seven && hot ? K.yellow : K.cream)) + text(0, 26, String(i + 1), { 'text-anchor': 'middle', 'font-size': 72, 'font-weight': 900, fill: K.ink }));
      }
      // tiny grey people walk right past token 7
      if (T > 22.3) for (let k = 0; k < 4; k++) { const x = F.lerp(700, 1700, ((T - 22.3) * 0.35 + k * 0.25) % 1); w += V.OL(H.svg({ x, y: 1000, s: 0.32, face: 1, pal: 'twin', walk: x / 60, seed: k }, T), 2); }
      w += V.stamp(T, 22.3, 1300, 220, 'MOST SKIPPED', { size: 60, col: K.coral, r: 8 });
      s += L(c, 1, w);
      return s + V.big(T, 19.25, 21.35, '11 WAYS TO HACK', { y: 170, size: 110, col: K.yellow }) + V.big(T, 19.6, 21.35, 'THE HIRING MACHINE', { y: 300, size: 90 });
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots, zoomOut: false, overlay: (T) => V.big(T, 5.95, 6.95, 'EVERYONE ELSE', { y: 160, size: 120 }) + V.hud(T) });
})();
