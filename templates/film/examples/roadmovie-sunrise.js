// s08 #7 MESSAGE A REAL PERSON (231.52 - 271.12): the turning point. Dawn breaks as he sends the message.
(() => {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, ell, path, line, text, glow, C, E, seg, clamp, kf, f, L, cue, phrase } = F;
  const SECTION = F.section('s08'), { start, end } = SECTION;
  const sunY = (T) => kf(T, [[236, 900], [262, 700], [271, 420]], 'inOutSine');
  const tintAt = (T) => clamp(seg(T, 250, 271)) * 0.55;
  const set = (T, c, id, world, o = {}) => A.roadSet(T, c, Object.assign({ id, seed: 81, tint: tintAt(T), world, sun: [1500, sunY(T), clamp(seg(T, 238, 262)) * 0.9] }, o));
  const officeDoor = (x, y, s = 1) => G(tr(x, y, s), rect(-200, -420, 400, 420, '#3C3790', { rx: 12 }) + rect(-70, -250, 140, 250, '#FFD98A', { rx: 10 }) + glow(0, -120, 260, 'amber', 0.8) + rect(-160, -380, 100, 80, '#FFD98A', { rx: 8, opacity: 0.8 }) + rect(60, -380, 100, 80, '#FFD98A', { rx: 8, opacity: 0.8 }));
  const note = (x, y, s = 1, r = 0) => A.note(x, y, s, r, '#FFE7A3');
  cue(231.6, 'whoosh_rev', 0.5); [232.3, 232.7, 233.1].forEach((t) => cue(t, 'swish', 0.3)); cue(234.6, 'rise', 0.6); cue(236.98, 'impact', 0.6); cue(237.0, 'chime', 0.45);
  cue(238.1, 'pop', 0.4); cue(241.1, 'paper', 0.5); cue(241.6, 'flutter', 0.5); for (let k = 0; k < 16; k++) cue(242.3 + k * 0.08, 'counter', 0.25); cue(244.8, 'warm', 0.45); cue(246.6, 'paper', 0.4);
  cue(249.3, 'ice', 0.7); cue(250.6, 'key1', 0.45); [251.56, 251.64, 251.72].forEach((t) => cue(t, 'key2', 0.45)); [251.9, 252.0, 252.1].forEach((t) => cue(t, 'key1', 0.35)); [253.18, 253.27].forEach((t) => cue(t, 'key2', 0.45)); [253.95, 254.05].forEach((t) => cue(t, 'key1', 0.35));
  cue(255.5, 'question', 0.35); cue(257.2, 'melt', 0.6); cue(257.6, 'whoosh', 0.35); cue(268.4, 'breath', 0.6); cue(269.0, 'click', 0.5); cue(269.1, 'send', 0.7); cue(269.3, 'whoosh', 0.5);

  const shots = [
    // 1. remember all those applications that went nowhere? (cold blue flashback)
    { a: start, b: 234.3, cam: [[231.52, { x: 1320, y: 420, z: 1.32 }], [234.4, { x: 1080, y: 520, z: 1.18 }, 'inOutSine']], draw: (T, c) => {
      let s = L(c, 0.85, A.room(T - 220, { id: 'a' }));
      let w = A.chair(380, 730) + H.svg({ x: 500, y: 860, face: 1, sit: true, lean: 10, tilt: 6, mouth: 'flat', look: [1, 0], armL: [80, 30], armR: [62, 50], legL: [4, -4], legR: [-2, -2], seed: 1 }, T) + A.desk(600, 650) + A.laptop(860, 650, 1, A.inbox(T, 272, 176, { title: 'Applied (31)' }), { glow: 0.4 });
      [231.8, 232.2, 232.6, 233.0].forEach((t0, i) => { const u = seg(T, t0, t0 + 1.4); if (u > 0 && u < 1) { const e = E.inOutSine(u); w += A.plane(F.lerp(880, 1700, e), F.lerp(520, 210, e) - Math.sin(u * Math.PI) * 120 + i * 18, F.lerp(1.4, 0.25, e), -18, '#C9D6FF'); } });
      return s + L(c, 1, w) + rect(0, 0, 1920, 1080, '#0B1A50', { opacity: 0.38 });
    } },
    // 2. number seven: everyone walks around it. He stops. He doesn't.
    { a: 234.3, b: 237.9, cam: [[234.3, { x: 700, y: 560, z: 1.0, r: -1.5 }], [237.9, { x: 1000, y: 470, z: 1.4, r: 1.5 }, 'inOutSine']], draw: (T, c) => {
      let w = A.signpost(1050, 830, 7, { s: 2.6, lit: true, hot: 0.7 + 0.3 * Math.sin(T * 3) });
      for (let k = 0; k < 6; k++) {
        const x = ((T - 234.3) * 230 + k * 330) % 2000 - 200, d = Math.max(0, 1 - Math.abs(x - 1050) / 260);
        w += H.svg({ x, y: 860 - d * 70, s: 0.7, face: 1, pal: 'crowd', walk: x / 140, seed: k }, T);
      }
      const stop = E.inOutCubic(seg(T, 235.6, 236.1));
      const wk = A.walkX(T, [[234.3, 300], [235.8, 780]]);
      w += H.svg(T < 235.8 ? { x: wk.x, y: 860, face: 1, walk: wk.phase, seed: 1, brows: 'neutral' } : { x: 780, y: 860, face: 1, brows: T > 236.9 ? 'up' : 'neutral', mouth: T > 236.9 ? 'o' : 'flat', look: [1, -1], tilt: -6 * stop, seed: 1 }, T);
      return set(T, c, 'b', w);
    } },
    // 3. up the hill: a real person at the office door, in the first light
    { a: 237.9, b: 239.95, cam: [[237.9, { x: 700, y: 640, z: 1.3 }], [240.0, { x: 1300, y: 400, z: 1.35 }, 'inOutCubic']], draw: (T, c) => {
      let w = path('M800,840 Q1200,700 1700,520 L2400,520 L2400,900 Z', '#2B2570') + officeDoor(1500, 560, 1);
      w += H.svg({ x: 1560, y: 560, s: 0.75, face: -1, pal: 'recruiter', brows: 'happy', mouth: 'smile', armL: [10, 10], seed: 5 }, T);
      w += H.svg({ x: 600, y: 860, face: 1, brows: 'up', mouth: 'flat', look: [1, -1], tilt: -8, seed: 1 }, T);
      return set(T, c, 'c', w);
    } },
    // 4. applying online: a note dropped into a huge box with a thousand others
    { a: 239.95, b: 244.5, cam: [[239.95, { x: 960, y: 360, z: 1.8 }], [244.6, { x: 960, y: 500, z: 0.92 }, 'inOutSine']], draw: (T, c) => {
      const R = F.R(42);
      let w = path('M560,380 L1360,380 L1300,940 L620,940 Z', '#8A5A1E') + path('M560,380 L1360,380 L1400,330 L520,330 Z', '#A86E28');
      for (let k = 0; k < 90; k++) w += note(560 + R() * 800, 300 + R() * 90 - (k % 3) * 20, 1, R() * 60 - 30);
      const fu = seg(T, 240.9, 241.7);
      w += note(960, F.lerp(-200, 320, E.inCubic(fu)), 1.3, fu * 40);
      w += H.svg({ x: 960, y: -180 + 0, s: 0.4, face: 0, brows: 'up', mouth: 'o', look: [0, 1], armL: [40, 20], armR: [40, 20], seed: 1, op: 1 - seg(T, 241.0, 241.6) }, T);
      const n = Math.floor(seg(T, 242.3, 243.6) * 1000);
      if (T > 242.2) w += G(tr(960, 640), rect(-200, -70, 400, 140, '#FFF8EA', { rx: 26 }) + text(0, 28, n.toLocaleString('en-US'), { 'text-anchor': 'middle', 'font-size': 92, 'font-weight': 900, fill: '#2A2F5A' }));
      return set(T, c, 'd', w);
    } },
    // 5. a message to someone at the company: handing it over in person
    { a: 244.5, b: 248.55, cam: [[244.5, { x: 960, y: 470, z: 1.2 }], [248.7, { x: 960, y: 430, z: 1.42 }, 'inOutSine']], draw: (T, c) => {
      const give = E.inOutCubic(seg(T, 245.6, 246.6)), took = T > 246.8;
      let w = officeDoor(1250, 830, 1.3) + glow(960, 560, 520, 'amber', 0.5);
      w += H.svg({ x: 1180, y: 860, face: -1, pal: 'recruiter', brows: took ? 'happy' : 'neutral', mouth: took ? 'smile' : 'flat', armL: took ? [80, 20] : [10, 10], prop: took ? note(20, -10, 1.2) : '', seed: 5 }, T);
      w += H.svg({ x: 740, y: 860, face: 1, brows: 'up', mouth: 'smile', armL: [F.lerp(30, 85, give), 10], prop: took ? '' : note(30, 0, 1.2), look: [1, 0], seed: 1 }, T);
      return set(T, c, 'e', w);
    } },
    // 6. but you freeze: frost covers him, everything slows
    { a: 248.55, b: 250.4, xin: 0.3, drift: 0.15, cam: [[248.55, { x: 960, y: 460, z: 1.4 }], [250.5, { x: 960, y: 450, z: 1.46 }]], draw: (T, c) => {
      const fr = E.outCubic(seg(T, 249.25, 249.95));
      let w = H.svg({ x: 960, y: 860, face: 0, brows: 'worried', mouth: 'wavy', eyes: 'wide', armL: [40, 70], armR: [40, 70], prop: A.phone(0, -40, 0.9, rect(0, 0, 66, 128, '#F4F0E6')), frost: fr, blink: false, seed: 1 }, T);
      let s = set(T, c, 'f', w);
      if (fr > 0) { s += rect(0, 0, 1920, 1080, '#CFEFFF', { opacity: f(0.12 * fr) }); const R = F.R(3); for (let k = 0; k < 18; k++) { const x = R() < 0.5 ? R() * 300 : 1620 + R() * 300, y = R() * 1080, r = 20 + R() * 40; s += G({ transform: tr(x, y, fr), opacity: f(0.6 * fr) }, line(`M${-r},0 H${r} M0,${-r} V${r} M${-r * 0.7},${-r * 0.7} L${r * 0.7},${r * 0.7} M${r * 0.7},${-r * 0.7} L${-r * 0.7},${r * 0.7}`, '#FFFFFF', 4)); } }
      return s;
    } },
    // 7 + 8. "hey" ... delete. "hi" ... delete. What do you even say to a stranger?
    { a: 250.4, b: 257.1, cam: [[250.4, { x: 960, y: 540, z: 1.0 }], [252.4, { x: 940, y: 540, z: 1.05 }], [254.4, { x: 980, y: 540, z: 1.03 }, 'inOutSine'], [257.2, { x: 960, y: 520, z: 1.12 }, 'inOutSine']], draw: (T, c) => {
      let s = L(c, 0.2, rect(-300, -300, 2520, 1680, '#121A44') + glow(960, 540, 800, 'sky', 0.35));
      const hey = 'hey', hi = 'hi';
      let typed = '';
      if (T > 251.5 && T < 252.15) typed = hey.slice(0, Math.max(0, 3 - Math.floor(seg(T, 251.88, 252.12) * 3.99)) * (T > 251.88 ? 1 : 0) || Math.min(3, Math.floor(seg(T, 251.5, 251.8) * 3.99)));
      if (T > 251.5 && T < 251.88) typed = hey.slice(0, Math.ceil(seg(T, 251.5, 251.8) * 3));
      else if (T >= 251.88 && T < 252.15) typed = hey.slice(0, 3 - Math.floor(seg(T, 251.88, 252.12) * 3));
      else if (T > 253.12 && T < 253.94) typed = hi.slice(0, Math.ceil(seg(T, 253.12, 253.32) * 2));
      else if (T >= 253.94 && T < 254.2) typed = hi.slice(0, 2 - Math.floor(seg(T, 253.94, 254.15) * 2));
      let ph = rect(-330, -500, 660, 1000, '#1A1747', { rx: 70 }) + rect(-300, -470, 600, 940, '#F4F0E6', { rx: 44 }) + rect(-300, -470, 600, 130, C.indigoL, { rx: 44 }) + rect(-300, -380, 600, 40, C.indigoL);
      ph += circ(-220, -400, 40, '#FFF8EA') + text(-160, -385, 'A. Rivera', { 'font-size': 38, 'font-weight': 900, fill: '#FFF8EA' });
      ph += rect(-270, 320, 540, 100, '#FFFFFF', { rx: 50, stroke: '#D9CFBF', 'stroke-width': 4 }) + text(-230, 386, typed, { 'font-size': 52, 'font-weight': 800, fill: '#2A2F5A' });
      if (Math.floor(T * 2.4) % 2 === 0) ph += rect(-226 + F.measure(typed, 52, 800), 340, 6, 60, C.violet);
      const fr = 1 - seg(T, 256.7, 257.1);
      ph += rect(-330, -500, 660, 1000, 'none', { rx: 70, stroke: '#CFEFFF', 'stroke-width': 26, opacity: f(0.55 * fr) });
      const q = E.outBackSoft(seg(T, 255.2, 255.6));
      if (q > 0) ph += G(tr(0, -120, q), circ(0, 0, 110, C.violet, { opacity: 0.2 }) + text(0, 50, '?', { 'text-anchor': 'middle', 'font-size': 200, 'font-weight': 900, fill: C.violet }));
      s += L(c, 1, G(tr(960, 560), ph));
      return s;
    } },
    // 9. the frost melts; he opens the chat
    { a: 257.1, b: 260.05, cam: [[257.1, { x: 960, y: 520, z: 1.1 }], [259.0, { x: 1090, y: 640, z: 1.4 }], [260.15, { x: 1135, y: 700, z: 2.7 }, 'inCubic']], draw: (T, c) => {
      const fr = 1 - E.inOutSine(seg(T, 257.1, 258.0));
      return set(T, c, 'g', rect(700, 800, 700, 40, '#4A43A8', { rx: 10 }) + H.svg({ x: 1000, y: 900, face: 1, sit: true, lean: 10, tilt: 6, brows: 'up', mouth: 'flat', look: [1, 1], armL: [72 + 6 * Math.sin(T * 15), 40], armR: [62 + 6 * Math.sin(T * 15 + 1.7), 50], legL: [4, -4], legR: [-2, -2], frost: fr, seed: 1 }, T) + A.laptop(1135, 826, 0.6, rect(0, 0, 272, 26, '#232864', { rx: 6 }) + rect(0, 26, 272, 150, '#1C2152'), { scr: '#1C2152', glow: 0.6 }));
    } },
    // 10. the prompt
    A.promptShot({ a: 260.05, b: 268.3, t0: 260.05, t1: 267.9, xin: 0.35, sendAt: 268.0, chat: { hl: ['short,', 'friendly', 'their', 'team,'], sentAt: 268.0 } }),
    // 11. a deep breath, send: the paper plane flies up the hill into the sunrise
    { a: 268.3, b: end, cam: [[268.3, { x: 820, y: 480, z: 1.45 }], [269.1, { x: 860, y: 480, z: 1.4 }], [271.3, { x: 1350, y: 380, z: 1.05 }, 'inOutSine']], draw: (T, c) => {
      const br = Math.sin(seg(T, 268.3, 268.95) * Math.PI);
      const sent = T > 269.0;
      let w = H.svg({ x: 760, y: 860, face: 1, lean: -br * 4, brows: sent ? 'happy' : 'neutral', mouth: sent ? 'smile' : br > 0.3 ? 'sigh' : 'flat', eyes: T > 268.5 && T < 269.2 ? 'closed' : 'open', look: [1, -1], armL: [85, 30 - (T > 268.9 && T < 269.1 ? 20 : 0)], prop: A.phone(10, -40, 0.8), seed: 1 }, T);
      const pu = seg(T, 269.05, 271.1);
      if (pu > 0) { const x = F.lerp(840, 1520, E.inOutSine(pu)), y = F.lerp(620, sunY(T) - 30, E.inOutSine(pu)) - Math.sin(pu * Math.PI) * 150; w += line(`M840,620 Q${f((840 + x) / 2)},${f(Math.min(620, y) - 160)} ${f(x)},${f(y)}`, '#FFE7A3', 4, { 'stroke-dasharray': '10 16', opacity: 0.6 }) + A.plane(x, y, F.lerp(1.4, 0.5, pu), -24, '#FFF8EA'); }
      return set(T, c, 'h', w);
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots,
    overlay: (T) => A.chapter(T, 236.95, 239.6, 7, 'Message a real person') + phrase(T, 243.3, 244.4, '1,000 notes', { y: 1000, plate: true }) + phrase(T, 247.2, 248.45, 'in person', { y: 1000, hl: [1] }) + phrase(T, 249.5, 250.35, 'freeze', { hc: '#CFEFFF', hl: [0] }) + phrase(T, 268.66, 270.6, 'send it', { y: 1000, hl: [0] }) });
})();
