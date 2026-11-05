// s00 HOOK (0 - 24): night. He polishes his resume, becomes one of thousands, hears nothing, gets "unfortunately", then sees the road.
(() => {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, ell, path, line, text, glow, C, E, seg, clamp, kf, f, L, cue, phrase } = F;
  const SECTION = F.section('s00'), { start, end } = SECTION;
  const goldResume = (w = 110, sh = 0) => A.resume(-12, -w * 1.15, w, { gold: true, shine: sh });
  const typing = (T, k = 1) => ({ armL: [72 + 7 * Math.sin(T * 15) * k, 40], armR: [62 + 7 * Math.sin(T * 15 + 1.7) * k, 50] });

  // tiny chat on the laptop screen (272 x 176)
  const miniChat = (T) => {
    let s = rect(0, 0, 272, 26, '#232864', { rx: 6 }) + text(136, 19, 'ChatGPT or Claude', { 'font-size': 14, 'text-anchor': 'middle', fill: C.lav });
    s += rect(0, 26, 272, 150, '#1C2152');
    const u = E.outCubic(seg(T, 0.4, 1.0));
    s += G({ opacity: f(u) }, rect(120, 40, 140, 40, '#3A3F8A', { rx: 12 }) + rect(132, 52, 90, 7, '#F4F1EA', { rx: 3 }) + rect(132, 64, 60, 7, '#F4F1EA', { rx: 3 }));
    const g = E.outCubic(seg(T, 1.8, 2.4));
    if (g > 0) s += G({ opacity: f(g) }, A.resume(20, 92, 56, { gold: true, lines: 4 }) + rect(90, 100, 150, 8, '#E9B95A', { rx: 4 }) + rect(90, 116, 110, 8, '#E9B95A', { rx: 4 }));
    const sw = seg(T, 1.6, 2.2); if (sw > 0 && sw < 1) s += path(`M${f(-60 + sw * 380)},26 l40,0 l-60,150 l-40,0 Z`, '#FFF3C4', { opacity: 0.6 });
    return s;
  };

  // ---------- shot builders ----------
  const room = (T, c, o = {}) => L(c, 0.85, A.room(T, { id: o.id, light: o.light || 0 })) ;
  cue(0.05, 'roomtone', 0.5); cue(0.6, 'key1', 0.5); cue(0.95, 'key2', 0.5); cue(1.25, 'key1', 0.5); cue(1.72, 'sparkle', 0.7); cue(3.05, 'chime', 0.6);
  cue(4.5, 'whoosh', 0.7); cue(5.9, 'poprip', 0.5); cue(7.9, 'swish', 0.45); cue(8.25, 'swish', 0.45); cue(8.6, 'swish', 0.45); cue(9.95, 'thunk', 0.5);
  cue(11.58, 'refresh', 0.55); cue(12.7, 'refresh', 0.55); cue(13.4, 'refresh', 0.55); cue(16.25, 'buzz', 0.6); cue(17.36, 'lownote', 0.6);
  cue(19.2, 'rise', 0.55); cue(20.4, 'chime', 0.55); cue(22.25, 'pop', 0.6); cue(22.6, 'hop', 0.35); cue(22.95, 'hop', 0.35);

  const shots = [
    // 1. at the desk: he asks AI to fix his resume, it comes back gold, he sits up proud
    { a: start, b: 4.4, cam: [[0, { x: 1000, y: 560, z: 1.0 }], [4.4, { x: 820, y: 540, z: 1.42 }, 'inOutSine']], draw: (T, c) => {
      const up = E.inOutCubic(seg(T, 3.0, 3.6));
      const pose = Object.assign({ x: 500, y: 860, face: 1, sit: true, lean: 12 - up * 14, tilt: 12 - up * 16, brows: up > 0.5 ? 'up' : 'neutral', mouth: up > 0.5 ? 'smile' : 'flat', eyes: up > 0.5 ? 'open' : 'half', look: [1, 1 - up * 2], legL: [4, -4], legR: [-2, -2], seed: 1 }, typing(T, T < 2.6 ? 1 : 0));
      if (up > 0) { pose.armL = F.mix(pose.armL, [128, -12], up); pose.prop = goldResume(110, seg(T, 3.4, 4.2)); }
      let s = room(T, c);
      s += L(c, 1, A.chair(380, 730) + H.svg(pose, T) + A.desk(600, 650) + A.laptop(860, 650, 1, miniChat(T), { scr: '#1C2152', glow: 0.5 + 0.4 * seg(T, 1.6, 2.2) }) + A.mug(1080, 596, C.coral, T, 1) + A.lamp(1180, 480, 1));
      if (up > 0.2) s += L(c, 1, A.sparkle(612, 270, 0.7 * E.outBack(seg(T, 3.2, 3.7)), 1 - seg(T, 4.0, 4.4)));
      return s;
    } },
    // 2. out of his window: thousands of identical windows, identical him, identical gold resume
    { a: 4.4, b: 7.05, xin: 0.3, cam: [[4.4, { x: 960, y: 520, z: 5.2 }], [6.9, { x: 960, y: 560, z: 0.92 }, 'inOutCubic'], [7.3, { x: 960, y: 570, z: 0.88 }]], draw: (T, c) => {
      let s = L(c, 0.1, F.sky(T, { id: 'b' }));
      let b = rect(-700, -500, 3320, 2200, '#272366') + rect(-700, -500, 3320, 2200, 'url(#shade)', { opacity: 0.6 });
      for (let r = -3; r <= 3; r++) for (let q = -6; q <= 6; q++) {
        const wx = 960 + q * 230, wy = 540 + r * 210;
        b += rect(wx - 95, wy - 80, 190, 160, '#3B2F6A', { rx: 10 }) + rect(wx - 88, wy - 73, 176, 146, '#FFD98A', { rx: 8, opacity: 0.9 });
        b += G(`translate(0,0)`, `<clipPath id="wc${q}_${r}"><rect x="${wx - 88}" y="${wy - 73}" width="176" height="146" rx="8"/></clipPath>` + G({ 'clip-path': `url(#wc${q}_${r})` }, glow(wx, wy, 120, 'amber', 0.8) + H.svg({ x: wx - 10, y: wy + 130, s: 0.38, face: 1, pal: q === 0 && r === 0 ? 'hero' : 'clone', brows: 'up', mouth: 'smile', armL: [128, -12], prop: goldResume(110, 0.4), seed: q * 3 + r * 7, blink: q === 0 && r === 0 }, T)));
        b += rect(wx - 100, wy + 73, 200, 14, '#3B2F6A', { rx: 5 });
      }
      s += L(c, 1, b);
      return s;
    } },
    // 3. apply, apply, apply: paper planes fly out of the window into the dark; nothing comes back
    { a: 7.05, b: 9.75, cam: [[7.05, { x: 1080, y: 520, z: 1.18 }], [9.9, { x: 1320, y: 420, z: 1.32 }, 'inOutSine']], draw: (T, c) => {
      const click = [7.9, 8.25, 8.6].map((t) => Math.exp(-Math.max(0, T - t) * 12) * (T > t ? 1 : 0)).reduce((p, q) => p + q, 0);
      const pose = { x: 500, y: 860, face: 1, sit: true, lean: 10, tilt: 6, brows: 'neutral', mouth: 'flat', look: [1, 0], armL: [80 - click * 12, 30], armR: [62, 50], legL: [4, -4], legR: [-2, -2], seed: 1 };
      let s = room(T, c, { id: 'c' });
      let planes = '';
      [7.9, 8.25, 8.6].forEach((t0, i) => {
        const u = seg(T, t0, t0 + 1.6); if (u <= 0 || u >= 1) return;
        const e = E.inOutSine(u), x = F.lerp(880, 1700, e), y = F.lerp(520, 210, e) - Math.sin(u * Math.PI) * 120 + i * 20;
        planes += A.plane(x, y, F.lerp(1.4, 0.25, e), -18 - 10 * Math.sin(u * 6), '#FFE7A3');
      });
      const nb = seg(T, 9.0, 9.4) * (1 - seg(T, 9.55, 9.8));
      s += L(c, 1, A.chair(380, 730) + H.svg(pose, T) + A.desk(600, 650) + A.laptop(860, 650, 1, A.inbox(T, 272, 176, { title: 'Applied (12)', rows: [{ dot: C.amber }, { dot: C.amber }, { dot: C.amber }] }), { glow: 0.5 }) + A.mug(1080, 596, C.coral, T, 1) + planes);
      if (nb > 0) s += L(c, 1, G({ opacity: f(nb) }, A.bubble(1470, 300, 200, 100, { fill: '#3A3F8A', inner: [0, 1, 2].map((k) => circ(-40 + k * 40, 0, 10, C.lav)).join('') })));
      return s;
    } },
    // 4. he looks at the gold resume and frowns
    { a: 9.75, b: 11.15, cam: [[9.75, { x: 1020, y: 470, z: 1.9 }], [11.4, { x: 1000, y: 455, z: 2.25 }, 'inOutSine']], draw: (T, c) => {
      const k = E.inOutCubic(seg(T, 9.9, 10.4));
      const pose = { x: 1060, y: 860, face: -1, tilt: 8 + 6 * k, brows: k > 0.5 ? 'sad' : 'neutral', mouth: k > 0.5 ? 'frown' : 'flat', look: [-1, 1], armL: [80, 30], armR: [60, 50], prop: goldResume(120, 0), seed: 2 };
      return room(T, c, { id: 'd' }) + L(c, 1, H.svg(pose, T));
    } },
    // 5. between every little task: coffee, laundry, dishes; phone out, pull to refresh
    { a: 11.15, b: 14.35, cam: [[11.15, { x: 900, y: 520, z: 1.12 }], [11.9, { x: 960, y: 520, z: 1.12 }], [12.45, { x: 2260, y: 520, z: 1.12 }, 'inOutCubic'], [13.0, { x: 2300, y: 520, z: 1.12 }], [13.25, { x: 3560, y: 520, z: 1.12 }, 'inOutCubic'], [14.5, { x: 3640, y: 520, z: 1.16 }]], draw: (T, c) => {
      let w = rect(-600, -400, 5400, 1880, '#1E1B52') + rect(-600, 840, 5400, 700, '#16143E') + rect(-600, 830, 5400, 14, '#24215E');
      w += glow(960, 500, 600, 'violet', 0.5) + glow(2260, 500, 600, 'violet', 0.5) + glow(3560, 500, 600, 'violet', 0.5);
      const station = (cx, tCheck, task) => {
        const ph = E.inOutCubic(seg(T, tCheck - 0.15, tCheck + 0.2)) * (1 - E.inOutCubic(seg(T, tCheck + 0.75, tCheck + 1.0)));
        const spin = seg(T, tCheck + 0.1, tCheck + 0.8);
        const busy = Math.sin(T * 7);
        const pose = { x: cx - 120, y: 860, face: 1, brows: ph > 0.5 ? 'up' : 'neutral', mouth: 'flat', look: ph > 0.5 ? [0, -1] : [1, 1], tilt: ph > 0.5 ? -4 : 8, armL: F.mix([60 + busy * 10, 40], [130, 40], ph), armR: [50 - busy * 8, 50], seed: cx };
        if (ph > 0.05) pose.prop = A.phone(20, -60, 0.9, A.inbox(T, 66, 128, { title: '', spin: spin * 2 }), { r: -10 });
        return task + H.svg(pose, T);
      };
      // coffee
      w += station(960, 11.58, rect(900, 640, 360, 200, '#3C3790', { rx: 12 }) + rect(980, 470, 140, 170, '#2B2770', { rx: 14 }) + rect(1010, 520, 80, 30, '#1A1747', { rx: 8 }) + A.mug(1022, 584, C.mint, T, 1));
      // laundry
      w += station(2260, 12.7, rect(2200, 700, 300, 140, '#6E66D9', { rx: 30 }) + path('M2230,700 q50,-80 120,-30 q60,-60 120,30 Z', C.coral) + path('M2300,690 q40,-40 90,-10', C.amber));
      // dishes
      w += station(3560, 13.4, rect(3480, 640, 420, 200, '#3C3790', { rx: 12 }) + rect(3560, 620, 260, 30, '#9FD3FF', { rx: 14 }) + ell(3690, 600, 70, 20, '#FFF8EA') + [0, 1, 2, 3].map((k) => circ(3600 + k * 50 + 10 * Math.sin(T * 3 + k), 560 - k * 12 - ((T * 30 + k * 20) % 60), 10, '#FFFFFF', { opacity: 0.6 })).join(''));
      return L(c, 1, w);
    } },
    // 6. the week: Mon..Thu crossed out, he waits on the couch; Friday the phone buzzes
    { a: 14.35, b: 17.25, cam: [[14.35, { x: 760, y: 420, z: 1.3 }], [15.9, { x: 900, y: 450, z: 1.25 }], [16.6, { x: 1220, y: 520, z: 1.35 }, 'inOutCubic'], [17.4, { x: 1270, y: 470, z: 1.7 }]], draw: (T, c) => {
      let w = A.room(T, { id: 'e' });
      // calendar
      w += rect(330, 200, 860, 260, '#FFF8EA', { rx: 18 }) + rect(330, 200, 860, 60, C.violet, { rx: 18 }) + rect(330, 240, 860, 20, C.violet) + text(760, 245, 'THIS WEEK', { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 900, fill: '#FFF8EA' });
      ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((d, i) => {
        const x = 360 + i * 166;
        w += rect(x, 280, 146, 160, i === 4 ? '#FFE7A3' : '#EFE6D6', { rx: 12 }) + text(x + 73, 318, d, { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#3A3F73' });
        const tx = [14.7, 15.0, 15.3, 15.6][i];
        if (tx !== undefined) { const u = E.outCubic(seg(T, tx, tx + 0.25)); if (u > 0) w += line(`M${x + 30},${350} l${f(86 * u)},${f(70 * u)} M${x + 116},${350} l${f(-86 * u)},${f(70 * u)}`, C.coral, 9, { opacity: 0.9 }); }
        else { const u = E.outBack(seg(T, 16.14, 16.5)); if (u > 0) w += A.envelope(x + 73, 385, 0.55 * u, { seal: C.coral }); }
      });
      // couch + him
      const hop = E.inOutCubic(seg(T, 16.3, 16.75));
      const buzz = T > 16.25 && T < 17 ? Math.sin(T * 90) * 4 : 0;
      const pose = hop < 0.5 ? { x: 1240, y: 900, face: -1, sit: true, lean: 14, tilt: 12, brows: 'sad', mouth: 'flat', eyes: 'half', look: [0, 1], armL: [50, 60], armR: [30, 40], legL: [4, -4], legR: [-2, -2], seed: 3 }
        : { x: 1240, y: 900 - Math.sin(hop * Math.PI) * 40, face: -1, lean: -4, tilt: -6, brows: 'up', mouth: 'open', eyes: 'wide', look: [0, -1], armL: [120, 40], armR: [20, 30], legL: [12, 0], legR: [-10, 0], seed: 3 };
      pose.prop = A.phone(buzz, -50, 0.9, A.inbox(T, 66, 128, { title: '', rows: T > 16.25 ? [{ dot: C.coral }] : [] }), { r: -8 });
      w += A.couch(1000, 880) + H.svg(pose, T);
      return L(c, 1, w);
    } },
    // 7. "Unfortunately," on the phone; he deflates
    { a: 17.25, b: 18.65, xin: 0.3, cam: [[17.25, { x: 960, y: 540, z: 1.0 }], [18.8, { x: 960, y: 560, z: 1.08 }]], draw: (T, c) => {
      let s = L(c, 0.2, rect(-200, -200, 2400, 1500, '#151340') + glow(960, 540, 700, 'coral', 0.35 * seg(T, 17.4, 18.0)));
      const ph = rect(-300, -560, 600, 1120, '#1A1747', { rx: 70 }) + rect(-270, -520, 540, 1040, '#F4F0E6', { rx: 44 }) + rect(-270, -520, 540, 130, C.violet, { rx: 44 }) + rect(-270, -430, 540, 40, C.violet) +
        text(-230, -440, 'Re: your application', { 'font-size': 34, 'font-weight': 800, fill: '#FFF8EA' }) + text(-230, -290, 'Hi,', { 'font-size': 40, 'font-weight': 700, fill: '#3A3F73' });
      const k = Math.floor(14 * clamp((T - 17.36) / 0.7));
      let u = text(-230, -200, 'Unfortunately,'.slice(0, k), { 'font-size': 70, 'font-weight': 900, fill: C.coral });
      const lines = [0, 1, 2, 3].map((i) => rect(-230, -140 + i * 54, 420 - (i % 2) * 90, 22, '#D9CFBF', { rx: 10, opacity: f(seg(T, 17.9, 18.2)) })).join('');
      s += L(c, 1, G(tr(960, 600 + (1 - E.outExpo(seg(T, 17.1, 17.6))) * 200), ph + u + lines));
      return s;
    } },
    // 8. he goes to the window, slumped... and outside, a road appears
    { a: 18.65, b: 19.85, xin: 0.3, cam: [[18.65, { x: 1300, y: 430, z: 1.25 }], [19.85, { x: 1460, y: 340, z: 2.1 }, 'inCubic']], draw: (T, c) => {
      const look = E.inOutCubic(seg(T, 18.9, 19.4));
      const extra = G({ opacity: f(seg(T, 18.85, 19.3)) }, G(`translate(1180,120) scale(0.29,0.39)`, A.landscape(T, { postsOn: (i) => E.outCubic(seg(T, 19.0 + i * 0.05, 19.3 + i * 0.05)), seven: 0 })));
      let s = L(c, 0.85, A.room(T, { id: 'f', windowExtra: extra }));
      s += L(c, 1, H.svg({ x: 1330, y: 880, face: -1, s: 1, lean: 8 - look * 10, tilt: 12 - look * 20, brows: look > 0.5 ? 'up' : 'sad', mouth: look > 0.5 ? 'o' : 'frown', look: [-1, -1], armL: [10, 10], armR: [-10, 10], seed: 4, blink: false }, T));
      return s;
    } },
    // 9. the road of 11 stops, lit one by one; number 7 glows, and everyone steps around it
    { a: 19.85, b: end, xin: 0.5, cam: [[19.85, { x: 960, y: 520, z: 1.7 }], [21.4, { x: 960, y: 590, z: 1.0 }, 'inOutCubic'], [24.2, { x: 760, y: 560, z: 1.55 }, 'inOutSine']], draw: (T, c) => {
      let s = L(c, 0.1, F.sky(T, { id: 'g' }));
      const seven = E.inOutSine(seg(T, 21.9, 22.5));
      s += L(c, 1, A.landscape(T, {
        postsOn: (i) => E.outBack(seg(T, 19.9 + i * 0.11, 20.25 + i * 0.11)), seven: seven,
        extra: (road, posts) => {
          let w = '';
          const p7 = posts[6];
          for (let k = 0; k < 7; k++) {
            const u0 = 0.28 + k * 0.06 + (T - 21.6) * 0.016;
            if (T < 21.6 || u0 > 0.98) continue;
            const [x, y] = road(u0);
            const d = Math.abs(u0 - A.POSTS[6]); const detour = Math.max(0, 1 - d / 0.035);
            const sc = 0.13 * (1 - u0 * 0.6);
            w += H.svg({ x: x + (p7.x > x ? -1 : 1) * detour * 70 * sc / 0.13, y: y - detour * 40 * sc / 0.13, s: sc, face: 1, pal: 'crowd', walk: T * 1.6 + k * 0.3, seed: k }, T);
          }
          return w;
        },
      }));
      s += L(c, 1.3, F.motes(T, 22, 4, '#FFE3A1', 0.35));
      return s;
    } },
  ];
  F.run({ id: SECTION.id, start, end, shots, zoomOut: false,
    overlay: (T) => phrase(T, 5.95, 6.95, 'everyone else') + phrase(T, 19.2, 21.3, '11 ways', { hl: [0] }) + phrase(T, 22.2, 23.75, 'number 7', { hl: [1], size: 120 }) });
})();
