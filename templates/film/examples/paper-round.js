// v3 s08 ROUND 7: MESSAGE A REAL PERSON (231.52 - 271.12). The turn: Sam freezes, looks across at Maya, and tries it her way.
(() => {
  const F = FILM, H = HERO, { G, tr, rect, circ, ell, path, line, text, E, seg, clamp, f, L, cue } = F, K = P.K, st = P.st;
  const SECTION = F.section('s08'), { start, end } = SECTION;
  cue(231.7, 'whoosh', 0.35); cue(232.6, 'paper', 0.35); cue(235.0, 'slide', 0.35); [235.5, 235.9, 236.3].forEach((t) => cue(t, 'hop', 0.3)); cue(236.98, 'scratch', 0.45); cue(238.0, 'stamp', 0.45);
  cue(241.1, 'paper', 0.4); cue(241.7, 'slot', 0.45); cue(243.3, 'murmur', 0.4); cue(246.6, 'cloth', 0.35); cue(247.1, 'chime', 0.4);
  cue(249.55, 'ice', 0.55); F.vo(250.5, 254.5).filter((w) => /hey|hi/i.test(w.w)).forEach((w) => [0, 0.08, 0.16].forEach((d) => cue(w.s + d, 'key1', 0.35))); cue(251.9, 'reset', 0.35); cue(253.95, 'reset', 0.35); cue(256.4, 'question', 0.4);
  cue(257.2, 'swish', 0.4); cue(258.0, 'glint', 0.4); cue(259.0, 'slide', 0.3); cue(268.0, 'breath', 0.4); cue(268.66, 'send', 0.5); cue(268.7, 'ding', 0.55); cue(269.2, 'ding', 0.4); cue(269.4, 'shimmer', 0.4);

  const msgBox = (x, y, s, str, caret) => G(tr(x, y, s), P.cut(rect(-460, -230, 920, 460, K.white, { rx: 24 }) + rect(-460, -230, 920, 80, K.navy, { rx: 24 }) + rect(-460, -170, 920, 20, K.navy), 'lift') + text(-420, -176, 'New message', { 'font-size': 36, 'font-weight': 900, fill: K.cream }) + rect(-420, -100, 840, 260, '#F7F2E8', { rx: 14 }) + text(-390, -30, str, { 'font-size': 60, 'font-weight': 800, fill: K.ink }) + (caret ? rect(-384 + F.measure(str, 60, 800), -84, 6, 70, K.ink) : ''));

  const shots = [
    // 1. Remember all those applications that went nowhere? (the hill of paper planes again)
    { a: start, b: 234.5, cam: [[231.52, { x: 2200, y: 600, z: 1.1 }], [234.55, { x: 2200, y: 640, z: 1.0 }, 'inOutSine']], draw: (T, c) => {
      const R = F.R(5); let g = '';
      for (let k = 0; k < 70; k++) { const a = R() * Math.PI, rr = Math.sqrt(R()), x = 2200 + Math.cos(a) * 420 * rr, y = 880 - Math.sin(a) * 230 * rr; g += P.plane(x, y, 0.9, (R() - 0.5) * 70); }
      g += P.cut(rect(2420, 520, 12, 360, K.woodD), 'cutS') + G(tr(2426, 520, 1, 4), P.cut(rect(-150, -50, 300, 100, K.cream, { rx: 8 }), 'cutS') + text(0, 16, 'APPLICATIONS', { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 900, fill: K.ink }));
      g += P.ch({ pal: 'sam', x: 1760, y: 880, face: 1, brows: 'sad', mouth: 'flat', look: [1, 0], seed: 1 }, T);
      return P.bg(T, c, 'sky', { seed: 8 }) + L(c, 1, g) + P.label(T, 232.12, 960, 150, 'WENT NOWHERE', { bg: K.cream, size: 64 });
    } },
    // 2. The step most people skip: number seven (the stepping stones, people hop over 7)
    { a: 234.5, b: 237.9, xin: 0.25, cam: [[234.5, { x: 1000, y: 620, z: 1.0 }], [237.95, { x: 1130, y: 640, z: 1.35 }, 'inOutCubic']], draw: (T, c) => {
      const S = st(T); let g = '';
      const sx = (i) => 140 + i * 165, sy = (i) => 820 - Math.sin(i * 0.6) * 20;
      for (let i = 0; i < 11; i++) g += G(tr(sx(i), sy(i)), P.cut(ell(0, 0, 70, 30, i === 6 ? K.mustard : K.cream), 'cutS') + text(0, 14, String(i + 1), { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 900, fill: K.ink }));
      [0, 1].forEach((k) => { const p = 4 + (S - 234.6) * 2.4 - k * 1.2; if (p < 4) return; const i0 = Math.floor(p), fr = p - i0; if (i0 >= 10 || i0 === 6) return; const to = i0 + 1 === 6 ? 7 : i0 + 1; const x = F.lerp(sx(i0), sx(to), fr), y = F.lerp(sy(i0), sy(to), fr) - Math.sin(fr * Math.PI) * (to - i0 > 1 ? 200 : 70) - 20; g += P.ch({ pal: 'paperfolk', x, y, s: 0.5, face: 1, legL: [20, -30], legR: [-10, -20], seed: 4 + k }, T); });
      g += P.loop(T, 236.98, sx(6), sy(6), 110, 60, { d: 0.45 });
      return P.bg(T, c, 'sky', { seed: 12, fy: 860 }) + L(c, 1, g) + P.round(T, 237.96, 7, 'Message a real person', { y: 240, s: 0.85, d: 2.2 });
    } },
    // 3. Applying online = dropping your note into a huge box with a thousand others
    { a: 237.9, b: 244.5, xin: 0.25, cam: [[237.9, { x: 960, y: 520, z: 1.12 }], [242.3, { x: 960, y: 560, z: 0.95 }, 'inOutSine'], [244.55, { x: 960, y: 560, z: 0.9 }]], draw: (T, c) => {
      const S = st(T), drop = seg(S, 241.06, 241.7);
      let g = P.cut(rect(520, 380, 880, 600, K.kraftD, { rx: 10 }) + rect(780, 380, 360, 30, K.ink, { rx: 10 }), 'cut') + text(960, 700, 'APPLY ONLINE', { 'text-anchor': 'middle', 'font-size': 70, 'font-weight': 900, fill: K.cream });
      if (S > 243.0) { const R = F.R(9); let pile = ''; for (let k = 0; k < 40; k++) pile += rect(560 + R() * 780, 420 + R() * 120, 70, 46, K.white, { transform: `rotate(${f((R() - 0.5) * 50)} ${f(560 + 35)} ${f(440)})`, opacity: 0.95 }); g += G({ opacity: f(seg(S, 243.0, 243.4)) }, pile); }
      if (drop < 1) g += G(tr(960, F.lerp(120, 380, E.inQuad(drop)), 1, -8 + 8 * drop), P.cut(rect(-70, -46, 140, 92, K.mustard, { rx: 6 }), 'cutS') + text(0, 12, 'Sam', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: K.ink }));
      g += P.ch({ pal: 'sam', x: 330, y: 980, face: 1, brows: 'neutral', mouth: 'flat', look: [1, -1], armL: drop > 0 && drop < 1 ? [140, 0] : [20, 20], seed: 1 }, T);
      return P.bg(T, c, 'kraft', { seed: 24 }) + L(c, 1, g) + P.label(T, 243.3, 960, 150, '+ A THOUSAND OTHER NOTES', { bg: K.cream, size: 60 });
    } },
    // 4. A message to someone at the company is like handing it over in person
    { a: 244.5, b: 248.6, xin: 0.25, cam: [[244.5, { x: 960, y: 560, z: 1.0 }], [248.65, { x: 960, y: 540, z: 1.14 }, 'inOutSine']], draw: (T, c) => {
      const S = st(T), u = E.inOutCubic(seg(S, 245.9, 246.8));
      let g = P.ch({ pal: 'maya', x: 700, y: 900, face: 1, brows: 'happy', mouth: 'smile', armL: [80 + 10 * u, 0], seed: 3 }, T) + P.ch({ pal: 'recruiter', x: 1240, y: 900, face: -1, brows: S > 247.1 ? 'happy' : 'up', mouth: S > 247.1 ? 'smile' : 'flat', armL: [60 + 30 * u, 0], seed: 6 }, T);
      g += G(tr(F.lerp(830, 960, u), 560, 1, -4), P.cut(rect(-70, -46, 140, 92, K.teal, { rx: 6 }), 'cutS') + text(0, 12, 'Maya', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: K.cream }));
      return P.bg(T, c, 'teal', { seed: 25 }) + L(c, 1, g) + P.label(T, 246.56, 960, 150, 'IN PERSON', { bg: K.cream, fg: K.tealD, size: 70 });
    } },
    // 5. But you freeze
    { a: 248.6, b: 250.4, xin: 0.15, cam: [[248.6, { x: 960, y: 520, z: 1.2 }], [249.5, { x: 960, y: 500, z: 1.2 }], [249.7, { x: 960, y: 480, z: 1.45 }, 'outExpo'], [250.45, { x: 960, y: 480, z: 1.48 }]], draw: (T, c) => {
      const S = st(T), fr = E.outCubic(seg(S, 249.54, 249.9));
      return P.bg(T, c, fr > 0 ? 'sky' : 'room', { seed: 26 }) + L(c, 1, P.ch({ pal: 'sam', x: 960, y: 900, face: 0, brows: 'worried', mouth: fr > 0 ? 'wavy' : 'flat', eyes: fr > 0 ? 'wide' : 'open', frost: fr, seed: 1, blink: false }, T)) + P.label(T, 249.54, 960, 140, 'FROZEN', { bg: '#CFEFFF', size: 80, lift: true });
    } },
    // 6. You type hey, delete it. Type hi, delete that too. What do you even say to a stranger?
    { a: 250.4, b: 257.0, xin: 0.15, cam: [[250.4, { x: 960, y: 480, z: 1.1 }], [256.0, { x: 960, y: 500, z: 1.0 }, 'inOutSine'], [257.05, { x: 960, y: 520, z: 0.95 }]], draw: (T, c) => {
      const S = st(T), h1 = F.wordAt('hey', 251.56), d1 = F.wordAt('delete', 251.88), h2 = F.wordAt('hi', 253.18), d2 = F.wordAt('delete', 253.94);
      let str = '';
      if (S >= h1 && S < d1 + 0.3) str = 'hey'.slice(0, Math.round(3 * clamp((S - h1) / 0.2)) - (S > d1 ? Math.round(3 * clamp((S - d1) / 0.25)) : 0));
      else if (S >= h2 && S < d2 + 0.3) str = 'hi'.slice(0, Math.round(2 * clamp((S - h2) / 0.15)) - (S > d2 ? Math.round(2 * clamp((S - d2) / 0.2)) : 0));
      let g = msgBox(960, 400, 1, str, Math.floor(S * 2.4) % 2 === 0) + P.ch({ pal: 'sam', x: 960, y: 1180, s: 0.9, face: 0, brows: 'worried', mouth: S > 255.1 ? 'wavy' : 'flat', look: [0, -1], seed: 1 }, T);
      if (S > 255.14) [[560, 200], [1380, 230], [1500, 620], [430, 640]].forEach(([x, y], i) => { const u = P.pop(T, 255.14 + i * 0.2); if (u > 0) g += G(tr(x, y, u, (i - 1.5) * 10), P.cut(circ(0, 0, 54, K.white), 'cutS') + text(0, 26, '?', { 'text-anchor': 'middle', 'font-size': 76, 'font-weight': 900, fill: K.coral })); });
      return P.bg(T, c, 'mustard', { noHills: true, floor: false }) + L(c, 1, g) + P.label(T, 256.16, 960, 940, 'WHAT DO YOU EVEN SAY?', { bg: K.ink, fg: K.cream, size: 60 });
    } },
    // 7. The turn: Sam leans across the split line and sees Maya's screen; "type this instead"
    P.splitShot({ a: 257.0, b: 260.0, xin: 0.25, board: { a: 256.6 },
      L: (T, c) => { const S = st(T), lean = E.outCubic(seg(S, 257.3, 258.0)); return P.bg(T, c, 'mustard') + L(c, 1, P.ch({ pal: 'sam', x: 1000 + 220 * lean, y: 900, face: 1, lean: 14 * lean, brows: S > 258.4 ? 'up' : 'worried', mouth: S > 258.4 ? 'o' : 'flat', eyes: S > 258.4 ? 'wide' : 'open', look: [1, 0], seed: 1 }, T)); },
      R: (T, c) => { const S = st(T), u = seg(S, 257.9, 258.5); return P.bg(T, c, 'teal', { seed: 11 }) + L(c, 1, P.laptop(820, 700, 1.4, rect(0, 0, 300, 22, '#EDE6D8') + rect(150, 40, 130, 60, K.teal, { rx: 10 }) + rect(14, 120, 180, 50, '#F1EBDF', { rx: 10 })) + P.ch({ pal: 'maya', x: 1260, y: 900, face: -1, brows: 'happy', mouth: 'smile', armL: u > 0 ? [100, -10] : [20, 20], look: [-1, 0], seed: 3 }, T) + (u > 0 ? P.pencil(860, 300, 'try it like this', { size: 58, col: K.cream }) : '')); },
      over: (T, S) => (S > 257.2 && S < 259.6 ? G({ transform: tr(960, 540, P.pop(T, 257.3)) }, P.cut(circ(0, 0, 46, K.cream), 'cutS') + text(0, 18, '👀'.length ? '!' : '', { 'text-anchor': 'middle', 'font-size': 56, 'font-weight': 900, fill: K.coral })) : '') }),
    // 8. The prompt, typed by Sam this time
    P.promptShot({ a: 260.0, b: 268.25, t0: 260.0, t1: 267.9, who: 'sam', hl: ['short', 'friendly', 'team', 'beg'], sentAt: 267.95, reply: ['"Hi Priya, I loved your post', 'about your support team…"'] }),
    // 9. Then send it, even if you feel nervous: Sam presses send; HIS FIRST POINT
    { a: 268.25, b: end, xin: 0.2, cam: [[268.25, { x: 960, y: 540, z: 1.1 }], [268.7, { x: 960, y: 520, z: 1.0 }, 'outExpo'], [271.2, { x: 960, y: 540, z: 1.06 }]], draw: (T, c) => {
      const S = st(T), sent = S > 268.66, fly = seg(S, 268.66, 269.8);
      let g = P.ch({ pal: 'sam', x: 760, y: 900, face: 1, brows: sent ? 'happy' : 'worried', mouth: sent ? 'grin' : 'wavy', armL: sent ? [150, -20] : [90, 10], blush: sent ? 0.5 : 0, seed: 1 }, T);
      if (!sent) g += G(tr(870, 470), path('M0,0 Q-14,22 0,30 Q14,22 0,0 Z', '#9FD3FF'));
      g += J.button(1200, 700, 'SEND', sent ? K.sage : K.teal, 1.1, S > 268.66 && S < 268.9 ? 1 : 0);
      if (fly > 0 && fly < 1) g += P.plane(F.lerp(1200, 2100, E.inCubic(fly)), 600 - 300 * fly, 1.1, -20);
      return P.bg(T, c, sent ? 'sun' : 'mustard', { seed: 27 }) + L(c, 1, g) + P.board(T, { a: 268.2, y: 90, s: 1.0 }) + P.label(T, 269.0, 960, 1000, 'SAM SCORES!', { bg: K.mustard, size: 76, lift: true });
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots, xfade: 0.3, vignette: '' });
})();
