// c01 — Method 1: audit your daily tasks (25.30 – 82.46)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== card (25.30 – 28.68) =====
  {
    const S = F.shot(25.30, 28.68);
    const c = F.chapter(S, 25.30, 1, 'AUDIT YOUR TASKS', 'before your boss does', { match: true });
    const mag = F.prop(S.front, K.magnifier(80), 560, 760, 260, 260, 9);
    F.fromTo(mag, w('auditing', 25), { opacity: 0, x: -700, rotation: -30 }, { opacity: 1, x: 260, rotation: 10 }, 0.9, 'power2.inOut');
    F.to(mag, w('before', 27), { x: 900, opacity: 0 }, 0.6, 'power2.in'); F.sfx(w('auditing', 25), 'swish', 0.4);
  }

  // ===== hiding the boring parts, Friday afternoon (28.68 – 34.80) =====
  {
    const S = F.shot(28.68, 34.80, { cam: [880, 560, 1.12] });
    F.set(S.back, `<rect x="-600" y="-300" width="3200" height="1060" fill="#E9DDC6"/><rect x="-600" y="760" width="3200" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const cal = F.prop(S.back, K.calendar('THU', '4:40', 'pm'), 1480, 300, 300, 320, 2);
    const cal2 = F.prop(S.back, K.calendar('FRIDAY', '4:40', 'pm'), 1480, 300, 300, 320, 3);
    const tf = w('Friday', 32);
    F.fromTo(cal2, tf - 0.1, { opacity: 0, rotationX: 90, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0 }, 0.4, 'power2.out'); F.to(cal, tf - 0.1, { opacity: 0 }, 0.15); F.sfx(tf - 0.1, 'flip', 0.6);
    const you = F.puppet(S, S.mid, 'you', 760, 880, 1.45, { armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(420, 740, 760), 4);
    const kb = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-190" y="-22" width="380" height="44" rx="8" fill="${C.navy2}"/>${[...Array(10)].map((_, i) => `<rect x="${-170 + i * 34}" y="-12" width="26" height="10" rx="2" fill="${C.navy}"/>`).join('')}</g>`, 800, 724, 400, 60, 6);
    F.set(S.mid, P.laptopBack(820, 740, 0.7, C.navy2) + P.mug(1080, 740, 0.9), 5);
    // the small boring cards slide under the keyboard
    const th = w('hide', 29);
    const smalls = ['copy|numbers', 'rename|files', 'resend|email'].map((t, i) => { const c = F.prop(S.mid, K.card(t, C.grey, 130, 84, C.navy, 26), 560 + i * 40, 600 - i * 30, 150, 100, 7);
      F.in(c, th - 0.9 + i * 0.12, 'none', { dur: 0.3, sfx: 'pop', gain: 0.25 }); F.to(c, th + 0.2 + i * 0.15, { x: 240 - i * 40, y: 120 + i * 30, scale: 0.6, rotation: 8, opacity: 0 }, 0.45, 'power2.in'); return c; });
    F.sfx(th + 0.2, 'paperslide', 0.4);
    you.mood(th - 0.2, 'look').mood(th + 0.5, 'lookL').mood(th + 1.2, 'look').tilt(th + 0.5, -6).tilt(th + 1.2, 4).tilt(w('busy', 32), 0);
    you.mood(w('busy', 32), 'angry');
    F.every(S, (G) => { if (G > w('busy', 32)) { you.armL.wob.style.transform = `rotate(${5 * Math.sin(G * 34)}deg)`; you.armR.wob.style.transform = `rotate(${5 * Math.sin(G * 29 + 1)}deg)`; } });
    for (let x = w('busy', 32); x < 34.7; x += 0.09) F.sfx(x, 'key', 0.12);
    const bz = F.hand(S.front, 'look busy!', 1180, 560, 64, C.tomato2, -6); F.in(bz, w('busy', 32) + 0.1, 'none', { dur: 0.35, sfx: false });
    S.cam(th - 0.4, 640, 560, 1.22, 1.0).cam(tf - 0.6, 1000, 520, 1.02, 1.1);
  }

  // ===== copying numbers from emails into a spreadsheet, podcast (34.80 – 40.00) =====
  {
    const S = F.shot(34.80, 40.00, { bg: '#E3D7C1', cam: [960, 470, 1.12] });
    const L = F.laptop(S.mid, 960, 560, 1.02);
    L.screen.innerHTML = `${F.winBar('Inbox  ·  Q3 numbers.xlsx')}<div style="display:flex;height:700px">
      <div style="width:520px;border-right:2px solid #E6DAC2;padding:26px 30px;font:500 32px/1.5 Inter;color:#1E2A44">
        <div style="font:700 34px Inter">Re: weekly figures</div><div style="color:#8a8f9c;font-size:20px;margin-bottom:16px">from: sales-team</div>
        <div>North: <b class="n">4,210</b></div><div>South: <b class="n">3,875</b></div><div>East: <b class="n">5,102</b></div><div>West: <b class="n">2,960</b></div><div>Online: <b class="n">7,440</b></div><div>Returns: <b class="n">312</b></div></div>
      <div style="flex:1;padding:26px"><table style="border-collapse:collapse;font:500 32px Inter;width:100%">${['Region', 'North', 'South', 'East', 'West', 'Online', 'Returns'].map((r, i) => `<tr><td style="border:2px solid #E6DAC2;padding:14px 18px;background:${i ? '#fff' : '#F4EEE1'};font-weight:${i ? 500 : 700};width:45%">${r}</td><td class="cell" style="border:2px solid #E6DAC2;padding:12px 16px;background:${i ? '#fff' : '#F4EEE1'};font-weight:700">${i ? '' : 'Total'}</td></tr>`).join('')}</table></div></div>`;
    const nums = [...L.screen.querySelectorAll('.n')], cells = [...L.screen.querySelectorAll('.cell')].slice(1);
    const t0 = w('copying', 35), t1 = w('podcast.', 38) + 0.2;
    nums.forEach((n, i) => { const tt = t0 + i * ((t1 - t0) / 6);
      const fly = F.html(L.screen, `<b style="font:700 32px Inter;color:#C9441F;background:#F6D9CF;padding:2px 8px;border-radius:6px">${n.textContent}</b>`, 120, 0, 0, 0, 10);
      const sy = 168 + i * 48 + 24, ey = 112 + (i + 1) * 66;
      F.fromTo(fly, tt, { opacity: 0, x: 0, y: sy }, { opacity: 1, x: 0, y: sy }, 0.12);
      F.to(fly, tt + 0.12, { x: 1020 - 120 + 30, y: ey }, 0.45, 'power2.inOut'); F.to(fly, tt + 0.6, { opacity: 0 }, 0.1);
      const v = n.textContent; F.every(S, (G) => { cells[i].textContent = G >= tt + 0.58 ? v : ''; });
      F.sfx(tt, 'key', 0.25); F.sfx(tt + 0.55, 'tick', 0.3); });
    // two hours clock
    const ck = F.prop(S.front, K.clock(70), 1660, 200, 160, 160, 8); const ckh = F.prop(S.front, K.hand(50, C.tomato, 7), 1660, 200, 40, 120, 9, '50% 50%');
    F.in(ck, w('two', 35), 'none', { dur: 0.35 }); F.in(ckh, w('two', 35), 'none', { dur: 0.35, sfx: false }); F.to(ckh, w('two', 35) + 0.2, { rotation: 720 }, 4.0, 'none');
    const twoh = F.label(S.front, '2 hrs', 1660, 320, { size: 46, bg: C.tomato, rot: -4 }); F.in(twoh, w('hours', 35), 'below', { dur: 0.35 });
    // podcast
    const pod = F.html(S.front, `<div style="display:flex;align-items:center;gap:16px;background:#1E2A44;color:#fff;border-radius:22px;padding:16px 24px;font:600 26px Inter;box-shadow:0 10px 24px rgba(0,0,0,.25)"><span style="width:54px;height:54px;border-radius:12px;background:#E2A93B;display:grid;place-items:center;font-size:30px">🎧</span><div>Now playing<div style="font:500 20px Inter;opacity:.7">The Calm Office podcast</div></div></div>`, 200, 820, 0, 0, 9);
    F.in(pod, w('podcast.', 38) - 0.2, 'left', { dur: 0.45, sfx: 'pop' });
    const waves = F.prop(S.front, `<g stroke="${C.gold}" stroke-width="6" fill="none" stroke-linecap="round"><path d="M0 -30 q20 30 0 60"/><path d="M24 -50 q34 50 0 100"/></g>`, 640, 880, 120, 140, 9);
    F.in(waves, w('podcast.', 38), 'left', { dur: 0.3, sfx: false });
    F.every(S, (G) => { waves.style.scale = String(1 + 0.08 * Math.sin(G * 8)); });
    S.cam(t0, 1060, 470, 1.2, 3.5, 'inOutSine');
  }

  // ===== it feels safe, it pays the bills. Here is the problem. (40.00 – 44.46) =====
  {
    const S = F.shot(40.00, 44.46, { bg: '#EDE1CA', cam: [800, 600, 1.45] });
    F.set(S.back, `<rect x="-600" y="800" width="3200" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><g filter="url(#cutflat)" opacity=".8"><rect x="1200" y="140" width="420" height="300" fill="${C.white}"/><rect x="1220" y="160" width="380" height="260" fill="${C.sky}"/></g>`);
    // armchair
    F.set(S.mid, `<g filter="url(#cut)"><rect x="560" y="560" width="420" height="300" rx="40" fill="${C.sage2}"/><rect x="520" y="660" width="80" height="220" rx="30" fill="${C.sage}"/><rect x="940" y="660" width="80" height="220" rx="30" fill="${C.sage}"/><rect x="600" y="780" width="340" height="100" rx="20" fill="${C.sage}"/></g>`, 1);
    const you = F.puppet(S, S.mid, 'you', 770, 860, 1.25, { mood: 'happy', armL: 'down', armR: 'down', z: 2 });
    F.set(S.mid, `<g filter="url(#cut)"><rect x="600" y="800" width="340" height="80" rx="20" fill="${C.sage}"/></g>`, 4);
    you.arms(w('feels', 40) - 0.2, 'high', 'high', 0.6).tilt(w('feels', 40), -8);
    const pay = F.prop(S.front, K.paycheck('$ PAY'), 1000, 300, 340, 180, 8);
    F.fromTo(pay, w('pays', 41) - 0.4, { opacity: 0, y: -500, rotation: 20 }, { opacity: 1, y: 160, rotation: -6 }, 1.0, 'sine.out'); F.sfx(w('pays', 41) - 0.3, 'flutter', 0.5);
    F.every(S, (G) => { const q = G - w('pays', 41); if (q > 0.6) pay.style.translate = `0 ${(Math.sin(q * 3) * 6).toFixed(1)}px`; });
    const tp = w('Here', 42);
    const dim = F.html(S.ui, '', 0, 0, 1920, 1080, 30, { background: 'rgba(30,42,68,.32)' }); F.fromTo(dim, tp, { opacity: 0 }, { opacity: 1 }, 0.6, 'power1.inOut');
    you.mood(tp, 'neutral').arms(tp, 'hip', 'hip', 0.8).tilt(tp, 0, 0.8).mood(w('problem.', 43), 'worry');
    F.sfx(tp, 'dread', 0.5);
    const pr = F.label(S.ui, 'the problem', 960, 170, { size: 120, bg: C.tomato, rot: -1.5, z: 40 }); F.in(pr, w('problem.', 43) - 0.1, 'below', { dur: 0.45, sfx: 'stamp', gain: 0.6 });
    S.cam(tp, 780, 580, 1.65, 1.6, 'inOutSine');
  }

  // ===== AI does not take whole jobs. It eats tasks. (44.46 – 48.80) =====
  const labels = ['email', 'report', 'data', 'meeting', 'ideas', 'clients', 'slides', 'notes', 'plans', 'team', 'calls', 'budget'];
  {
    const S = F.shot(44.46, 48.80, { cam: [900, 540, 1.0] });
    F.set(S.back, `<rect x="-600" y="900" width="3200" height="500" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const head = F.prop(S.mid, `<g filter="url(#cut)"><circle r="90" fill="${C.navy}"/></g>`, 745, 170, 200, 200, 2);
    const cards = labels.map((l, i) => { const r = Math.floor(i / 3), c = i % 3; return F.prop(S.mid, K.card(l, [C.navy, C.navy2, C.kraft2][(i * 7) % 3], 140, 140, C.white, 32), 595 + c * 150, 330 + r * 150, 150, 150, 3); });
    const tw = w('whole', 44);
    cards.forEach((c, i) => F.in(c, 44.5 + i * 0.05, 'none', { dur: 0.3, sfx: i % 3 ? false : 'tick', gain: 0.2 })); F.in(head, 44.5, 'none', { dur: 0.3, sfx: false });
    const jl = F.label(S.mid, 'YOUR JOB', 745, 935, { size: 56, bg: 'none', color: C.navy, font: "'Archivo Black'", weight: 400, flat: true }); F.in(jl, 44.7, 'below', { dur: 0.4, sfx: false });
    const ai = F.puppet(S, S.mid, 'intern', 2200, 900, 1.5, { mood: 'happy', armL: 'down', armR: 'down' });
    const te = w('eats', 47);
    ai.walk(tw, tw + 1.6).move(tw, 1330, 900, 1.6, 'power1.out');
    for (let x = tw; x < tw + 1.6; x += 0.33) F.sfx(x, 'step', 0.3);
    const sc = F.prop(S.front, K.scissors(), 1460, 440, 120, 200, 8);
    F.fromTo(sc, tw + 1.4, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, 0.3);
    ai.arm(tw + 1.4, 'r', 'up', 0.3).arm(te - 0.5, 'l', 'fwd', 0.35);
    F.to(sc, te - 0.5, { x: 760 - 1460, y: 480 - 440, rotation: -30 }, 0.4, 'power2.inOut');
    F.every(S, (G) => { const q = G - (te - 0.1); sc.style.scale = q > 0 && q < 0.5 ? String(1 + 0.12 * Math.sin(q * 40)) : '1'; });
    F.sfx(te - 0.1, 'snip', 0.8); F.sfx(te + 0.15, 'snip', 0.6);
    const hole = F.prop(S.mid, `<rect x="-68" y="-68" width="136" height="136" fill="none" stroke="${C.tomato}" stroke-width="5" stroke-dasharray="12 10"/>`, 745, 480, 150, 150, 2);
    F.hidden(hole); F.show(hole, te + 0.2);
    F.to(cards[4], te + 0.2, { x: 1100 - 745, y: 560 - 480, rotation: -18 }, 0.45, 'power2.inOut');
    F.to(cards[4], te + 0.9, { x: 1320 - 745, y: 380 - 480, scale: 0.15, opacity: 0, rotation: 40 }, 0.35, 'power2.in'); F.sfx(te + 1.0, 'crunch', 0.8);
    F.to(sc, te + 0.3, { opacity: 0 }, 0.3);
    ai.mood(te + 1.1, 'proud').hop(te + 1.2, 16);
    const et = F.hand(S.front, 'it eats tasks', 1500, 200, 92, C.tomato2, -3); F.in(et, te, 'none', { dur: 0.4, sfx: false });
    S.cam(te - 0.6, 1000, 480, 1.1, 1.0);
  }

  // ===== the castle (48.80 – 63.00) =====
  {
    const S = F.shot(48.80, 63.00, { cam: [980, 520, 1.0] });
    F.set(S.back, `<rect x="-600" y="860" width="3200" height="500" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const BW = 120, BH = 64, x0 = 560, base = 860, human = new Set(['0-3', '1-1', '2-5', '3-2', '4-4', '0-0', '2-0', 't0-1', 't1-0']);
    const bricks = []; const add = (x, y, key) => { const isH = human.has(key); const nb = F.prop(S.mid, K.brick(C.kraft), x + BW / 2, y + BH / 2, 140, 90, 3);
      const col = F.prop(S.mid, K.brick(isH ? C.navy : C.tomato) + (isH ? `<path d="M-16 6 q8 -14 16 -2 q8 -12 16 2 q4 10 -6 14 h-20 q-10 -4 -6 -14z" fill="${C.sage}"/>` : ''), x + BW / 2, y + BH / 2, 140, 90, 4);
      bricks.push({ nb, col, isH, x, y }); };
    for (let r = 0; r < 5; r++) for (let i = 0; i < 7; i++) { if ((r === 0 && i === 6) || (r % 2 && i === 6)) continue; add(x0 + i * BW + (r % 2 ? 60 : 0), base - (r + 1) * BH, r + '-' + i); }
    [x0, x0 + 6 * BW].forEach((tx, ti) => { for (let k = 0; k < 3; k++) add(tx, base - (6 + k) * BH, 't' + ti + '-' + k); });
    const roofs = [x0, x0 + 6 * BW].map((tx) => F.prop(S.mid, `<g filter="url(#cut)"><path d="M-70 0 L0 -130 L70 0 Z" fill="${C.navy}"/><path d="M0 -130 v-60" stroke="${C.navy}" stroke-width="5"/><path d="M0 -190 l46 14 l-46 14z" fill="${C.sage}"/></g>`, tx + 60, base - 8 * BH - 100, 160, 220, 2));
    const castle = [...bricks.flatMap((b) => [b.nb, b.col]), ...roofs];
    const tb = 48.85;
    bricks.forEach((b, i) => { F.fromTo(b.nb, tb + i * 0.032, { opacity: 0, y: -260 }, { opacity: 1, y: 0 }, 0.3, 'power3.out'); if (i % 4 === 0) F.sfx(tb + i * 0.032 + 0.2, 'clack', 0.3); F.hidden(b.col); });
    roofs.forEach((r, i) => F.in(r, tb + 1.4 + i * 0.1, 'above', { dur: 0.4, sfx: 'clack', gain: 0.4 }));
    const tl1 = w('castle.', 49) - 0.1; const lab = F.hand(S.front, 'your job = a castle of bricks', 980, 120, 64, C.navy, -2); F.in(lab, tl1, 'none', { dur: 0.4, sfx: false }); F.out(lab, w('Some', 50) + 0.4, 'above');
    const te = w('easy', 51), th = w('human', 54);
    bricks.filter((b) => !b.isH).forEach((b, i) => { F.fromTo(b.col, te + i * 0.025, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1 }, 0.25); });
    F.sfx(te, 'flipcards', 0.5);
    bricks.filter((b) => b.isH).forEach((b, i) => { F.fromTo(b.col, th + i * 0.06, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1 }, 0.3); });
    F.sfx(th, 'chime', 0.5);
    const kEasy = F.label(S.ui, 'easy for a computer', 560, 90, { size: 54, bg: C.tomato, rot: -3 }); F.in(kEasy, te + 0.1, 'below', { dur: 0.4 });
    const kHum = F.label(S.ui, 'needs a human brain', 1380, 90, { size: 54, bg: C.navy, rot: 2 }); F.in(kHum, th + 0.1, 'below', { dur: 0.4 });
    F.out(kEasy, w('If', 55) - 0.1, 'above'); F.out(kHum, w('If', 55), 'above');
    // the intern copies an easy brick
    const ai = F.puppet(S, S.mid, 'intern', 1640, 860, 1.25, { mood: 'happy' }); ai.enter(w('Some', 50), 'right', 0.6);
    const tc = w('copy,', 52);
    const flash = F.html(S.front, '', 0, 0, 1920, 1080, 30, { background: '#fff' }); F.hidden(flash); F.fromTo(flash, tc, { opacity: 0.0 }, { opacity: 0.7 }, 0.06, 'none'); F.to(flash, tc + 0.06, { opacity: 0 }, 0.3);
    const dup = F.prop(S.mid, K.brick(C.tomato), 1500, 560, 140, 90, 8); F.fromTo(dup, tc + 0.05, { opacity: 0, x: -400, y: 160 }, { opacity: 1, x: 0, y: 0, rotation: -14 }, 0.5); ai.arm(tc, 'l', 'up', 0.3);
    F.sfx(tc, 'copier', 0.6);
    // 80% gauge
    const tg = w('80', 55);
    const g = F.prop(S.ui, `<g filter="url(#cut)"><path d="M-170 0 A170 170 0 0 1 170 0" stroke="${C.paper2}" stroke-width="44" fill="none"/></g>`, 250, 330, 420, 300, 6);
    const arc = F.prop(S.ui, `<path id="garc" d="M-170 0 A170 170 0 0 1 170 0" stroke="${C.tomato}" stroke-width="44" fill="none" pathLength="100" stroke-dasharray="0 100"/>`, 250, 330, 420, 300, 7);
    const needle = F.prop(S.ui, `<g filter="url(#cut)"><path d="M0 0 L-150 0" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/><circle r="18" fill="${C.navy}"/></g>`, 250, 330, 340, 60, 8, '50% 50%');
    const pct = F.label(S.ui, '0%', 250, 420, { bg: 'none', size: 92, color: C.navy, font: "'Archivo Black'", weight: 400, flat: true, z: 8 });
    [g, arc, needle, pct].forEach((e) => F.in(e, tg - 0.3, 'left', { dur: 0.4, sfx: false })); F.sfx(tg - 0.3, 'paperslide', 0.4);
    const ap = arc.querySelector('path');
    F.every(S, (G) => { const u = STAGE.E.outCubic(STAGE.seg(G, tg, tg + 1.2)) * 80; ap.setAttribute('stroke-dasharray', `${u.toFixed(1)} 100`); needle.style.rotate = (u * 1.8).toFixed(1) + 'deg'; pct.box.textContent = Math.round(u) + '%'; });
    for (let k = 0; k < 8; k++) F.sfx(tg + k * 0.14, 'tick', 0.2);
    // danger: the intern pulls a bottom brick, the castle wobbles
    const td = w('danger.', 58);
    const bottom = bricks.find((b) => b.y === base - BH && b.x === x0 + 5 * BW);
    ai.move(td - 1.6, 1330, 860, 0.8).arm(td - 0.6, 'l', 'fwd', 0.3);
    F.to([bottom.nb, bottom.col], td - 0.3, { x: 220, rotation: 6 }, 0.4, 'power2.in'); F.sfx(td - 0.3, 'scrape', 0.6);
    const wob = (G) => { const q = G - td; return q > 0 && q < 2.2 ? 1.6 * Math.sin(q * 9) * Math.exp(-q * 1.2) : 0; };
    F.every(S, (G) => { S.mid.style.rotate = wob(G).toFixed(2) + 'deg'; });
    S.mid.style.transformOrigin = '980px 860px';
    F.sfx(td, 'creak', 0.8);
    const dz = F.label(S.ui, 'IN DANGER', 1500, 230, { size: 90, bg: C.tomato, rot: 3, z: 20 }); F.in(dz, td, 'below', { dur: 0.4, sfx: 'stamp', gain: 0.6 }); F.out(dz, w('So', 60), 'above');
    // find the easy bricks first: magnifier sweep and sticky flags
    const tfnd = w('find', 61);
    const mag = F.prop(S.front, K.magnifier(90), 400, 500, 280, 280, 12);
    F.fromTo(mag, tfnd - 0.3, { opacity: 0, x: -500 }, { opacity: 1, x: 0 }, 0.4); F.to(mag, tfnd + 0.1, { x: 1000, y: -120 }, 1.6, 'sine.inOut'); F.to(mag, tfnd + 1.7, { opacity: 0, x: 1400 }, 0.4, 'power2.in');
    bricks.filter((b) => !b.isH).slice(0, 18).forEach((b, i) => { if (i % 2) return; const f = F.prop(S.front, `<g filter="url(#cut)"><rect x="-22" y="-16" width="44" height="32" fill="${C.sticky}"/></g>`, b.x + 100, b.y + 10, 60, 50, 11);
      F.in(f, tfnd + 0.2 + i * 0.07, 'none', { dur: 0.2, sfx: i % 4 ? false : 'sticky', gain: 0.3 }); });
    S.cam(tg - 0.4, 900, 520, 1.0, 1.0).cam(td - 1.8, 1040, 540, 1.0, 1.2).cam(tfnd - 0.3, 960, 520, 1.0, 1.0);
    // the clipped easy-brick tally floats away and the scene transitions to the laptop
    F.wipe(63.0, 1);
  }

  // ===== type this: the audit prompt (63.00 – 75.02) =====
  {
    const S = F.shot(63.00, 75.02, { bg: '#E3D7C1', cam: [960, 560, 0.8], drift: 0.5 });
    F.set(S.back, `<rect x="-600" y="960" width="3200" height="500" fill="${C.kraft}" filter="url(#cutflat)"/>`);
    const L = F.laptop(S.mid, 960, 560, 1.0); const chat = F.chat(S, L.screen, { size: 48, bubble: 30, top: true });
    F.set(S.mid, P.mug(1790, 960, 1.3), 4);
    const t0 = w('I', 65), t1 = w('human.', 74) + 0.2;
    chat.type('I am a [your job title], and here are the 10 things I do every week. Tell me which five AI can do right now and which five need a human.', t0, t1);
    const st = F.prop(S.front, P.sticky(0, 0, 7, 'pause &amp;|copy!', 54, C.sticky, 200), 1800, 300, 240, 240, 9); F.in(st, t0 + 1.2, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.5 });
    const k = F.label(S.ui, 'TYPE THIS', 1500, 90, { size: 60, bg: C.tomato, rot: -1.5, z: 20 }); F.in(k, w('type', 64) - 0.05, 'above', { dur: 0.4 }); F.out(k, t0 + 1.0, 'above');
    S.cam(w('Open', 63), 960, 470, 1.08, 1.2).cam(t0 + 0.2, 960, 430, 1.16, 8.0, 'inOutSine');
  }

  // ===== the two lists; hand the easy five to the machine (75.02 – 82.46) =====
  {
    const S = F.shot(75.02, 82.46, { cam: [960, 540, 1.0] });
    F.set(S.back, `<rect x="-600" y="940" width="3200" height="500" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const aiT = F.label(S.mid, 'AI CAN DO', 420, 150, { size: 56, bg: C.tomato, rot: -2 }), huT = F.label(S.mid, 'NEEDS A HUMAN', 1500, 150, { size: 56, bg: C.navy, rot: 2 });
    const aiL = ['data entry', 'meeting notes', 'first drafts', 'formatting', 'inbox sorting'], huL = ['client calls', 'judgement calls', 'team conflict', 'strategy', 'training people'];
    const t0 = 75.1;
    F.in(aiT, t0, 'above', { dur: 0.4 }); F.in(huT, t0 + 0.1, 'above', { dur: 0.4 });
    const aiC = aiL.map((l, i) => { const c = F.prop(S.mid, K.card(l, C.tomato, 340, 96, C.white, 40), 420, 270 + i * 112, 360, 110, 3); F.in(c, t0 + 0.3 + i * 0.12, 'left', { dur: 0.35, sfx: 'deal', gain: 0.35 }); return c; });
    const huC = huL.map((l, i) => { const c = F.prop(S.mid, K.card(l, C.navy, 340, 96, C.white, 40), 1500, 270 + i * 112, 360, 110, 3); F.in(c, t0 + 0.4 + i * 0.12, 'right', { dur: 0.35, sfx: 'deal', gain: 0.35 }); return c; });
    const you = F.puppet(S, S.mid, 'you', 760, 960, 1.35, { mood: 'worry', armL: 'down', armR: 'down', z: 5 });
    const tg = w('guarding', 76);
    you.enter(tg - 0.9, 'below', 0.5).arms(tg - 0.2, 'fwd', 'in', 0.35).tilt(tg, -8).move(tg - 0.4, 620, 960, 0.5);
    you.shakeHead(w('easy', 77), w('five.', 77) + 0.4);
    const th = w('Hand', 78);
    you.arms(th - 0.2, 'out', 'down', 0.4).mood(th, 'smile').tilt(th, 0).move(th, 780, 960, 0.6);
    const ai = F.puppet(S, S.mid, 'intern', 2100, 960, 1.2, { mood: 'happy', z: 6 });
    ai.walk(th - 0.3, th + 0.5).move(th - 0.3, 1060, 960, 0.8, 'power2.out').arm(th + 0.5, 'l', 'fwd', 0.3).arm(th + 0.5, 'r', 'fwd', 0.3);
    aiC.forEach((c, i) => F.to(c, th + 0.5 + i * 0.08, { x: 1060 - 420 - 30, y: 760 - (270 + i * 112) - i * 14, scale: 0.42, rotation: -6 + i * 3 }, 0.5, 'power2.inOut'));
    F.sfx(th + 0.5, 'handoff', 0.6);
    F.out(aiT, th + 0.6, 'above');
    const ts = w('machine', 78) + 0.4;
    ai.arm(ts, 'r', 'up', 0.3).mood(ts, 'proud').hop(ts, 18);
    ai.walk(ts + 0.6, ts + 2.0).move(ts + 0.6, 2300, 960, 1.4, 'power1.in');
    aiC.forEach((c) => F.to(c, ts + 0.6, { x: '+=1240' }, 1.4, 'power1.in'));
    const tn = w('energy', 80);
    huC.forEach((c, i) => { const g = F.prop(S.mid, K.card(huL[i], C.sage2, 340, 96, C.white, 40), 1500, 270 + i * 112, 360, 110, 4); F.fromTo(g, tn + i * 0.1, { opacity: 0 }, { opacity: 1 }, 0.3);
      F.to([c, g], tn + 0.6 + i * 0.06, { x: -440 }, 0.6, 'power3.inOut'); });
    F.sfx(tn, 'chime', 0.5);
    F.to(huT, tn + 0.5, { x: -440 }, 0.6, 'power3.inOut');
    you.mood(tn + 0.6, 'happy').move(tn + 0.5, 520, 960, 0.6).arm(tn + 1.0, 'r', 'point', 0.35);
    S.cam(th, 1100, 560, 1.04, 1.0).cam(tn + 0.4, 900, 560, 1.0, 1.0);
    F.miniSnap(S, 1, w('five.', 81) - 0.1, 1.5);
  }
  F.done();
})();
