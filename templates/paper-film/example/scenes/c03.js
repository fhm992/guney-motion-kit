// c03 — Method 3: own the messy human problems (143.24 – 191.04)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== card (143.24 – 145.98) =====
  {
    const S = F.shot(143.24, 145.98);
    F.chapter(S, 143.3, 3, 'OWN THE HUMAN MESS', 'the awkward parts are your armour');
  }

  // ===== flashback: that ping (145.98 – 149.06) =====
  {
    const S = F.shot(145.98, 149.06, { bg: '#E2D6BF', cam: [960, 540, 1.0] });
    const fr = F.html(S.mid, '', 560, 140, 800, 800, 3, { background: '#F4EAD6', boxShadow: '8px 14px 24px rgba(40,30,20,.35)', transform: 'rotate(-3deg)' });
    const inner = F.html(fr, '', 30, 30, 740, 740, 1, { overflow: 'hidden', filter: 'sepia(.75) saturate(.8)' });
    F.set(inner, `<rect width="740" height="740" fill="#E9DDC6"/><rect y="560" width="740" height="200" fill="${C.kraft}"/>`);
    const fake = { mid: inner };
    const you = F.puppet(S, inner, 'you', 240, 900, 1.7, { mood: 'worry' });
    const ph = F.prop(inner, `<g filter="url(#cut)"><rect x="-90" y="-160" width="180" height="320" rx="24" fill="${C.navy}"/><rect x="-78" y="-144" width="156" height="288" rx="14" fill="#2A3A5C"/><rect x="-70" y="-70" width="140" height="100" rx="10" fill="${C.white}"/></g>`, 560, 360, 220, 360, 3);
    const msg = F.html(inner, `<div style="font:600 17px/1.3 Inter;color:#1E2A44;width:130px">Manager<br><span style="font-weight:500">What are you working on?</span></div>`, 500, 300, 130, 0, 4);
    F.fromTo(fr, 146.0, { opacity: 0, scale: 0.85, rotation: -10 }, { opacity: 1, scale: 1, rotation: -3 }, 0.6, 'power3.out'); F.sfx(146.0, 'paperslide', 0.5);
    F.sfx(w('ping', 147), 'ping', 0.6);
    F.every(S, (G) => { const q = G - w('ping', 147); ph.style.rotate = (q > 0 && q < 0.6 ? 5 * Math.sin(q * 50) * (1 - q / 0.6) : 0) + 'deg'; });
    const lb = F.hand(S.front, 'remember this?', 1500, 880, 70, C.tomato2, -4); F.in(lb, w('Think', 146) + 0.3, 'none', { dur: 0.35, sfx: false });
    S.cam(146.1, 960, 520, 1.12, 2.8, 'inOutSine');
  }

  // ===== behind a screen moving files; easy to replace with software (149.06 – 156.68) =====
  {
    const S = F.shot(149.06, 156.68, { bg: '#E9DDC6', cam: [900, 560, 1.06] });
    F.set(S.back, `<rect x="-800" y="760" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><g filter="url(#cutflat)"><rect x="-400" y="120" width="300" height="400" fill="#D9CBB0"/><rect x="1900" y="160" width="300" height="360" fill="#D9CBB0"/></g>`);
    const walk = [['co1', 2300, -400], ['co2', 2500, -300], ['grey', -400, 2400]];
    const tn = w('never', 152);
    walk.forEach(([k, x0, x1], i) => { const pp = F.puppet(S, S.back, k, x0, 760, 0.95, { mood: i === 1 ? 'smile' : 'neutral', flip: x1 < x0 }); pp.walk(tn - 0.8 + i * 0.5, tn + 2.8 + i * 0.5).move(tn - 0.8 + i * 0.5, x1, 760, 3.6, 'none'); });
    for (let x = tn - 0.6; x < tn + 3; x += 0.4) F.sfx(x, 'step', 0.15);
    const you = F.puppet(S, S.mid, 'you', 820, 900, 1.4, { mood: 'tired', armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(500, 760, 660), 4);
    const L = F.laptop(S.mid, 1320, 540, 0.42, 5);
    L.screen.innerHTML = `${F.winBar('Files')}<div style="display:flex;height:700px;gap:30px;padding:30px"><div style="flex:1;background:#F4EEE1;border-radius:14px"></div><div style="flex:1;background:#F4EEE1;border-radius:14px"></div></div>`;
    const icons = [0, 1, 2, 3].map((i) => F.html(L.screen, `<div style="width:120px;height:90px;background:#E2A93B;border-radius:8px 8px 10px 10px;box-shadow:0 4px 0 #C99230"></div>`, 120 + (i % 2) * 160, 160 + Math.floor(i / 2) * 150, 120, 90, 3));
    const t0 = w('moving', 150) - 0.4;
    icons.forEach((ic, i) => { for (let k = 0; k < 3; k++) { const tt = t0 + i * 0.35 + k * 1.6; F.to(ic, tt, { x: k % 2 ? 0 : 680 }, 0.45, 'power2.inOut'); F.sfx(tt, 'tick', 0.15); } });
    const fl = F.hand(S.ui, 'moving files around…', 1400, 160, 60, C.navy, -3); F.in(fl, t0 + 0.3, 'none', { dur: 0.35, sfx: false }); F.out(fl, tn, 'above');
    const nt = F.hand(S.ui, '…never talking to a real person', 640, 160, 60, C.navy, 2); F.in(nt, tn + 0.2, 'none', { dur: 0.35, sfx: false }); F.out(nt, w('easy', 154) - 0.2, 'above');
    const te = w('replace', 155) - 0.2;
    const box = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-130" y="-170" width="260" height="340" fill="${C.grey}"/><path d="M-130 -170 L-90 -210 L170 -210 L130 -170Z" fill="#CFC8BB"/><path d="M130 -170 L170 -210 L170 130 L130 170Z" fill="${C.grey2}"/><rect x="-110" y="-80" width="220" height="80" fill="${C.white}"/>${T('SOFTWARE', 0, -28, 34, C.navy)}${T('v2.0', 0, 50, 40, C.navy, 'Caveat')}</g>`, 820, 700, 360, 460, 3);
    F.fromTo(box, te, { opacity: 0, x: -900 }, { opacity: 1, x: 0 }, 0.55, 'power3.out'); F.sfx(te + 0.4, 'thunk', 0.7);
    F.to(you.root, te - 0.05, { opacity: 0.0, x: 300 }, 0.5, 'power2.in');
    const ghost = F.prop(S.mid, `<g fill="none" stroke="${C.navy}" stroke-width="5" stroke-dasharray="14 10" opacity=".55"><circle cx="0" cy="-262" r="56"/><path d="M-66 -30 L-60 -150 Q-58 -190 0 -196 Q58 -190 60 -150 L66 -30"/></g>`, 1260, 900, 300, 600, 2);
    F.hidden(ghost); F.fromTo(ghost, te + 0.4, { opacity: 0 }, { opacity: 1 }, 0.4);
    const er = F.label(S.ui, 'EASY TO REPLACE', 960, 980, { size: 80, bg: C.tomato, rot: -1.5, z: 20 }); F.in(er, te + 0.1, 'below', { dur: 0.4 });
    S.cam(tn - 0.4, 960, 500, 0.96, 1.2).cam(te - 0.2, 900, 560, 1.12, 1.0);
  }

  // ===== quiet days; meetings; work alone; software does it best (156.68 – 166.10) =====
  {
    const S = F.shot(156.68, 166.10, { bg: '#E7DFCB', cam: [900, 560, 1.1] });
    F.set(S.back, `<rect x="-800" y="800" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    // meeting room door on the right
    F.set(S.back, `<g filter="url(#cutflat)"><rect x="1360" y="200" width="380" height="600" fill="#D2C3A6"/><rect x="1385" y="225" width="330" height="575" fill="#B9A685"/></g>`);
    const meet = F.label(S.back, 'MEETING', 1550, 170, { size: 36, bg: C.navy, z: 2 });
    const door = F.prop(S.back, `<g filter="url(#cut)"><rect x="0" y="0" width="330" height="575" fill="${C.kraft2}"/><circle cx="290" cy="300" r="14" fill="${C.gold}"/></g>`, 1550, 512, 330, 575, 3, '0% 50%');
    door.firstChild.setAttribute('viewBox', '0 0 330 575');
    const tm = w('meetings,', 159);
    F.fromTo(door, tm - 0.3, { rotationY: -70 }, { rotationY: 0 }, 0.45, 'power2.in'); F.sfx(tm + 0.1, 'door', 0.7);
    const hang = F.prop(S.back, `<g filter="url(#cut)"><rect x="-70" y="-40" width="140" height="80" rx="8" fill="${C.tomato}"/>${T('DO NOT', 0, -6, 24, C.white)}${T('DISTURB', 0, 24, 24, C.white)}</g>`, 1640, 420, 160, 100, 4);
    F.in(hang, tm + 0.2, 'above', { dur: 0.3, dist: 0.4, sfx: false });
    const bub = F.prop(S.mid, `<g><circle r="380" fill="${C.sage}" opacity=".28"/><circle r="380" fill="none" stroke="${C.sage2}" stroke-width="6" stroke-dasharray="20 14"/></g>`, 720, 620, 800, 800, 1);
    const you = F.puppet(S, S.mid, 'you', 720, 900, 1.4, { mood: 'happy', armL: 'type', armR: 'type', headExtra: `<path d="M-62 -280 Q0 -360 62 -280" stroke="${C.navy}" stroke-width="12" fill="none"/><rect x="-74" y="-290" width="26" height="48" rx="10" fill="${C.tomato}"/><rect x="48" y="-290" width="26" height="48" rx="10" fill="${C.tomato}"/>` });
    F.set(S.mid, P.desk(450, 760, 540), 4);
    F.set(S.mid, P.laptopBack(800, 760, 0.6, C.navy2), 5);
    you.nod(w('love', 157), w('love', 157) + 2.4, 5, 1.2);
    const tq = w('quiet', 157);
    const ql = F.hand(S.ui, 'quiet days…', 420, 200, 72, C.sage2, -3); F.in(ql, tq, 'none', { dur: 0.35, sfx: false }); F.out(ql, w('But', 161), 'above');
    const ta = w('alone.', 161);
    F.fromTo(bub, w('work', 160) - 0.3, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, 0.6, 'power3.out'); F.sfx(w('work', 160) - 0.3, 'shimmer', 0.4);
    const tb = w('quiet', 162);
    F.to(bub, tb + 0.1, { scale: 1.3, opacity: 0 }, 0.25, 'power2.out'); F.sfx(tb + 0.1, 'pop', 0.8);
    F.to(you.root, tb + 0.2, { x: -1300 }, 0.45, 'power2.in');
    const ai = F.puppet(S, S.mid, 'intern', 720, 900, 1.25, { mood: 'happy', armL: 'type', armR: 'type' });
    F.fromTo(ai.root, tb + 0.3, { opacity: 0, y: -600 }, { opacity: 1, y: 0 }, 0.45, 'power3.out'); F.sfx(tb + 0.7, 'thunk', 0.4);
    F.every(S, (G) => { if (G > tb + 0.6) { const a = Math.sin(G * 46) * 7; ai.armL.wob.style.transform = `rotate(${a}deg)`; ai.armR.wob.style.transform = `rotate(${-a}deg)`; } });
    for (let x = tb + 0.7; x < 166; x += 0.06) F.sfx(x, 'key', 0.08);
    const sb = F.label(S.ui, 'software does it best', 960, 990, { size: 76, bg: C.navy, rot: -1, z: 20 }); F.in(sb, w('software', 163), 'below', { dur: 0.4 });
    S.cam(tm - 0.5, 1160, 520, 1.0, 1.0).cam(ta - 0.6, 760, 560, 1.12, 1.0);
  }

  // ===== the angry client on a video call (166.10 – 172.32) =====
  {
    const S = F.shot(166.10, 172.32, { bg: '#E3D7C1', cam: [960, 560, 1.0] });
    F.set(S.mid, `<g filter="url(#cut)"><rect x="150" y="90" width="1620" height="900" rx="20" fill="${C.navy}"/></g>`);
    const tiles = [[190, 130, '#F2E3D8'], [980, 130, C.sky], [190, 560, '#E7EFE4'], [980, 560, '#EFE6D3']];
    const tEls = tiles.map(([x, y, c]) => { const d = F.html(S.mid, '', x, y, 750, 390, 2, { background: c, borderRadius: '14px', overflow: 'hidden' }); return d; });
    const client = F.puppet(S, tEls[0], 'client', 375, 610, 1.45, { mood: 'angry', armR: 'point' });
    const steam = F.prop(tEls[0], `<g filter="url(#cut)"><path d="M280 120 q-16 -30 4 -54 M470 120 q16 -30 -4 -54" stroke="${C.grey2}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`.replace(/M280 120/, 'M-95 0').replace(/M470 120/, 'M95 0'), 375, 110, 300, 120, 5);
    F.every(S, (G) => { steam.style.translate = `0 ${(-6 * Math.abs(Math.sin(G * 6))).toFixed(1)}px`; });
    const ai = F.puppet(S, tEls[1], 'intern', 290, 530, 1.15, { mood: 'neutral' });
    const spin = F.prop(tEls[1], `<circle r="58" fill="none" stroke="${C.grey}" stroke-width="12"/><path d="M0 -58 A58 58 0 0 1 58 0" stroke="${C.tomato}" stroke-width="12" fill="none" stroke-linecap="round"/>`, 570, 190, 140, 140, 5);
    F.every(S, (G) => { spin.style.rotate = (G * 300) + 'deg'; });
    const err = F.html(tEls[1], `<div style="font:700 26px Inter;color:#C9441F;background:#fff;padding:8px 14px;border-radius:10px">“I'm sorry you feel that way.”</div>`, 380, 300, 0, 0, 6);
    const you = F.puppet(S, tEls[2], 'you', 330, 590, 1.45, { mood: 'smile', armL: 'down', armR: 'down' });
    const ops = F.puppet(S, tEls[3], 'co1', 230, 590, 1.45, { mood: 'shock' });
    const parcel = F.prop(tEls[3], `<g filter="url(#cut)"><rect x="-110" y="-70" width="220" height="140" fill="${C.kraft}"/><path d="M-110 -26 H110" stroke="${C.kraft2}" stroke-width="8"/></g>`, 560, 220, 260, 180, 4);
    const late = F.label(tEls[3], 'LATE', 560, 250, { size: 40, bg: C.tomato, rot: -4 }), way = F.label(tEls[3], 'ON ITS WAY', 560, 250, { size: 34, bg: C.sage2, rot: 4 });
    F.hidden(way);
    [['Client', 210, 500], ['AI', 1000, 500], ['You', 210, 930], ['Ops', 1000, 930]].forEach(([n, x, y]) => F.html(S.mid, `<span style="background:rgba(30,42,68,.85);color:#fff;font:600 28px Inter;padding:6px 14px;border-radius:8px">${n}</span>`, x, y - 40, 0, 0, 5));
    const ta = w('angry', 166);
    F.sfx(166.2, 'callchime', 0.6);
    tEls.forEach((t, i) => F.fromTo(t, 166.15 + i * 0.1, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }, 0.35));
    F.fromTo(err, w('Zoom', 167) - 0.2, { opacity: 0 }, { opacity: 1 }, 0.3);
    const tc = w('calm', 169);
    you.arms(tc - 0.2, 'out', 'out', 0.5).nod(tc, tc + 1.6, 5, 1.4);
    client.mood(tc + 0.5, 'neutral').arm(tc + 0.5, 'r', 'down', 0.5); F.to(steam, tc + 0.5, { opacity: 0 }, 0.6); F.sfx(tc + 0.6, 'resolve', 0.6);
    const tl3 = w('late.', 171);
    F.to(late, tl3, { opacity: 0, rotationX: 90 }, 0.2); F.fromTo(way, tl3 + 0.15, { opacity: 0, rotationX: -90 }, { opacity: 1, rotationX: 0 }, 0.25); F.sfx(tl3 + 0.1, 'flip', 0.5);
    client.mood(tl3 + 0.2, 'smile'); ops.mood(tl3 + 0.2, 'happy');
    S.cam(ta - 0.3, 640, 360, 1.25, 1.3, 'inOutSine').cam(tc - 0.7, 640, 720, 1.25, 1.5, 'inOutSine').cam(tl3 - 0.9, 960, 560, 1.0, 1.2, 'inOutSine');
  }

  // ===== it cannot read the room (172.32 – 175.98) =====
  {
    const S = F.shot(172.32, 175.98, { bg: '#E8DCC6', cam: [960, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><g filter="url(#cutflat)"><rect x="560" y="120" width="800" height="300" fill="${C.white}"/></g>`);
    const a = F.puppet(S, S.mid, 'co1', 640, 880, 1.35, { mood: 'angry', armR: 'fwd' }), b = F.puppet(S, S.mid, 'co2', 1180, 880, 1.35, { mood: 'angry', armL: 'fwd', flip: false });
    const sheet = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-90" y="-60" width="180" height="120" fill="${C.white}"/>${T('$', 0, 30, 90, C.sage2)}</g>`, 910, 560, 220, 160, 6);
    F.every(S, (G) => { const x = 40 * Math.sin(G * 5); sheet.style.translate = `${x.toFixed(1)}px 0`; a.root.style.translate = `${(x * 0.3).toFixed(1)}px 0`; b.root.style.translate = `${(x * 0.3).toFixed(1)}px 0`; });
    F.in(sheet, 172.35, 'above', { dur: 0.3, sfx: 'tug', gain: 0.6 }); F.sfx(173.4, 'tug', 0.5); F.sfx(174.6, 'tug', 0.5);
    const bud = F.label(S.back, 'Q4 BUDGET', 960, 270, { size: 80, bg: 'none', color: C.navy, font: "'Archivo Black'", weight: 400, flat: true });
    const ai = F.puppet(S, S.front, 'intern', 1650, 1020, 1.1, { mood: 'neutral', armL: 'fwd' });
    const pad = F.prop(S.front, `<g filter="url(#cut)" transform="rotate(-6)"><rect x="-120" y="-90" width="240" height="180" fill="${C.sticky}"/>${T('two people.', 0, -14, 34, C.navy, 'Caveat')}${T('one paper.', 0, 36, 34, C.navy, 'Caveat')}</g>`, 1450, 760, 280, 220, 7);
    F.in(pad, w('room', 172) + 0.1, 'right', { dur: 0.4, sfx: 'scribble', gain: 0.4 });
    const rr = F.label(S.ui, "can't read the room", 960, 990, { size: 72, bg: C.navy, rot: -1.5, z: 20 }); F.in(rr, w('read', 172) - 0.05, 'below', { dur: 0.4 });
    S.cam(w('co', 173), 1150, 600, 1.12, 1.4);
  }

  // ===== raise your hand (175.98 – 180.40) =====
  {
    const S = F.shot(175.98, 180.40, { cam: [960, 580, 1.0] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const row = [['grey', 260], ['grey', 560], ['you', 960], ['grey', 1360], ['grey', 1660]];
    const ps = row.map(([k, x], i) => F.puppet(S, S.mid, k, x, 920, k === 'you' ? 1.35 : 1.15, { mood: k === 'you' ? 'smile' : 'neutral' }));
    ps.forEach((pp, i) => pp.enter(176.0 + i * 0.06, 'below', 0.45, { sfx: i ? false : 'paperslide' }));
    const tr = w('raising', 176);
    ps[2].arm(tr - 0.1, 'r', 'up', 0.4).hop(tr + 0.2, 16).mood(tr, 'happy');
    F.sfx(tr, 'swish', 0.6);
    ps.forEach((pp, i) => { if (i !== 2) pp.mood(tr + 0.4, 'lookL').tilt(tr + 0.4, i < 2 ? 6 : -6); });
    const k = F.label(S.ui, 'RAISE YOUR HAND', 960, 160, { size: 110, bg: C.navy, rot: -1.5, z: 20 }); F.in(k, tr + 0.1, 'below', { dur: 0.45 });
    const aw = F.hand(S.ui, 'for the awkward human parts', 960, 290, 60, C.tomato2, -1); F.in(aw, w('awkward', 178), 'none', { dur: 0.35, sfx: false });
    S.cam(tr, 960, 560, 1.12, 1.4, 'inOutSine');
  }

  // ===== three vignettes: call, lead, train (180.40 – 185.82) =====
  {
    const S = F.shot(180.40, 185.82, { cam: [700, 540, 1.0], backDepth: 1 });
    const PX = [100, 900, 1700];
    PX.forEach((x, i) => F.set(S.back, `<rect x="${x}" y="150" width="700" height="760" fill="${[C.white, '#F3EBDD', '#EDE4D3'][i]}" filter="url(#cut)"/>`));
    const t1 = w('call', 180), t2 = w('lead', 182), t3 = w('train', 184);
    // call
    const y1 = F.puppet(S, S.mid, 'you', 420, 880, 1.35, { mood: 'smile', armR: 'high' });
    F.prop(S.mid, `<g filter="url(#cut)" transform="rotate(-20)"><rect x="-24" y="-64" width="48" height="128" rx="16" fill="${C.navy}"/></g>`, 520, 480, 120, 160, 6);
    y1.nod(t1, t1 + 1.6, 5, 1.4);
    F.hand(S.mid, 'call the unhappy customer', 450, 230, 52, C.navy, -2);
    const wave = F.prop(S.mid, `<g stroke="${C.sage2}" stroke-width="6" fill="none" stroke-linecap="round"><path d="M0 -20 q14 20 0 40"/><path d="M18 -36 q26 36 0 72"/></g>`, 590, 470, 80, 100, 6);
    // lead
    F.set(S.mid, `<g filter="url(#cut)"><rect x="960" y="300" width="380" height="240" fill="${C.white}" stroke="${C.navy}" stroke-width="7"/><path d="M1000 480 l70 -70 l60 50 l90 -110" stroke="${C.tomato}" stroke-width="9" fill="none"/><rect x="1100" y="540" width="14" height="200" fill="${C.navy}"/></g>`, 2);
    const y2 = F.puppet(S, S.mid, 'you', 1460, 880, 1.35, { mood: 'happy', armL: 'point' });
    F.hand(S.mid, 'lead the messy meeting', 1250, 230, 52, C.navy, -2);
    const sticks = ['?!', 'who owns this?', 'deadline??'].map((t, i) => { const s = F.prop(S.mid, P.sticky(0, 0, -8 + i * 8, t, 26, i % 2 ? '#F2C66B' : C.sticky, 120), 1000 + i * 120, 620 + (i % 2) * 70, 150, 150, 4); return s; });
    // train
    const nh = F.puppet(S, S.mid, 'newhire', 1980, 880, 1.15, { mood: 'worry' });
    const y3 = F.puppet(S, S.mid, 'you', 2200, 880, 1.35, { mood: 'smile', armL: 'fwd' });
    F.set(S.mid, `<g filter="url(#cut)"><path d="M1960 700 L1980 600 L2120 600 L2100 700Z" fill="${C.navy2}"/></g>`, 7);
    F.hand(S.mid, 'train the new hire', 2050, 230, 52, C.navy, -2);
    nh.mood(t3 + 0.6, 'happy').hop(t3 + 0.8, 12);
    S.cam(t1 - 0.3, 760, 540, 1.0, 0.6).cam(t2 - 0.4, 1250, 540, 1.0, 0.9).cam(t3 - 0.4, 2050, 540, 1.0, 0.9);
    F.sfx(t1, 'ring', 0.5); F.sfx(t2 - 0.4, 'whoosh', 0.3); F.sfx(t2, 'marker', 0.5); F.sfx(t3 - 0.4, 'whoosh', 0.3); F.sfx(t3 + 0.2, 'pop', 0.4);
  }

  // ===== closer to real people, safer paycheck (185.82 – 191.04) =====
  {
    const S = F.shot(185.82, 191.04, { cam: [960, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const ring = [['co1', 440, 0.95], ['client', 690, 1.0], ['newhire', 1230, 1.0], ['co2', 1480, 0.95], ['manager', 1700, 0.9]];
    const you = F.puppet(S, S.mid, 'you', 960, 940, 1.35, { mood: 'happy', armL: 'out', armR: 'out', z: 5 });
    const tcl = w('closer', 185);
    ring.forEach(([k, x, s], i) => { const pp = F.puppet(S, S.mid, k, x, 900, s, { mood: 'smile', flip: x > 960 }); pp.enter(tcl + i * 0.1, x < 960 ? 'left' : 'right', 0.5, { sfx: i ? false : 'paperslide' }); });
    const tf = w('feelings,', 187);
    for (let i = 0; i < 9; i++) { const h = F.prop(S.front, `<path d="M0 12 C-30 -10 -20 -36 0 -22 C20 -36 30 -10 0 12Z" fill="${[C.tomato, C.sage, C.gold][i % 3]}" filter="url(#cut)" transform="scale(1.4)"/>`, 300 + i * 170, 700, 90, 90, 9);
      F.fromTo(h, tf - 0.3 + i * 0.12, { opacity: 0, y: 0, scale: 0.4 }, { opacity: 1, y: -380 - (i % 3) * 60, scale: 1 }, 1.8, 'power1.out'); F.to(h, tf + 1.4 + i * 0.12, { opacity: 0 }, 0.4); }
    F.sfx(tf - 0.3, 'warm', 0.6);
    const tp = w('paycheck', 189);
    const pay = F.prop(S.front, K.paycheck('$ SAFE'), 960, 300, 340, 180, 10);
    F.fromTo(pay, tp - 0.3, { opacity: 0, y: -400, rotation: -20 }, { opacity: 1, y: 0, rotation: -3 }, 0.5, 'power3.out'); F.sfx(tp - 0.1, 'kaching', 0.5);
    const lk = F.hand(S.ui, 'closer to people = safer paycheck', 960, 1000, 64, C.navy, -1); F.in(lk, tp, 'none', { dur: 0.35, sfx: false });
    S.cam(tcl, 960, 560, 0.95, 1.2).cam(tp - 0.4, 960, 480, 1.08, 1.0);
    F.miniSnap(S, 3, w('becomes.', 189) + 0.1, 1.2);
  }
  F.done();
})();
