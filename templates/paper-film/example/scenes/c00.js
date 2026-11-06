// c00 — Cold open (0:00–0:25.3)
(() => {
  const F = FILM.boot();
  const { C, P, T } = F, w = F.w, p = F.p;

  // ===== A: the office. Manager does the report in 30 seconds, you take four hours (0 – 7.92) =====
  {
    const A = F.shot(0, 7.92, { cam: [1380, 500, 1.22] });
    F.set(A.back, `<rect x="-900" y="-300" width="3800" height="1070" fill="#E9DDC6"/>
      <g filter="url(#cutflat)"><rect x="1060" y="80" width="760" height="500" rx="10" fill="${C.white}"/><rect x="1080" y="100" width="720" height="460" fill="${C.sky}"/>
      <path d="M1080 560 L1080 410 L1140 410 L1140 350 L1220 350 L1220 430 L1300 430 L1300 290 L1370 290 L1370 390 L1450 390 L1450 330 L1530 330 L1530 460 L1610 460 L1610 370 L1690 370 L1690 440 L1800 440 L1800 560 Z" fill="#B9C9C4"/>
      <path d="M1080 560 L1080 490 L1180 490 L1180 460 L1270 460 L1270 510 L1400 510 L1400 470 L1500 470 L1500 520 L1640 520 L1640 480 L1800 480 L1800 560 Z" fill="#9DB3AD"/><rect x="1435" y="100" width="10" height="460" fill="${C.white}"/></g>
      <g filter="url(#cutflat)"><rect x="-180" y="120" width="300" height="200" fill="${C.white}"/><rect x="-160" y="140" width="260" height="160" fill="#D9CBB0"/><path d="M-150 280 l60 -70 l40 40 l50 -60 l60 70z" fill="${C.sage}"/></g>
      <rect x="-900" y="760" width="3800" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    // wall clock behind you
    const clock = F.prop(A.back, `<g filter="url(#cut)"><circle r="110" fill="${C.navy}"/><circle r="94" fill="${C.white}"/>${[...Array(12)].map((_, i) => `<rect x="-3" y="-86" width="6" height="14" fill="${C.navy}" transform="rotate(${i * 30})"/>`).join('')}</g>`, 420, 250, 260, 260);
    const hourH = F.prop(A.back, `<path d="M0 0 L0 -48" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>`, 420, 250, 40, 120, 1, '50% 50%');
    const minH = F.prop(A.back, `<path d="M0 0 L0 -72" stroke="${C.tomato}" stroke-width="6" stroke-linecap="round"/><circle r="8" fill="${C.navy}"/>`, 420, 250, 40, 170, 2, '50% 50%');
    F.to(minH, w('takes', 3), { rotation: 360 * 4, ease: 'power1.inOut' }, 1.5); F.to(hourH, w('takes', 3), { rotation: 120, ease: 'power1.inOut' }, 1.5);
    for (let k = 0; k < 8; k++) F.sfx(3.8 + k * 0.17, 'tick', 0.22);
    // you, at your desk
    const you = F.puppet(A, A.mid, 'you', 330, 860, 1.35, { armL: 'type', armR: 'type' });
    F.set(A.mid, P.desk(60, 700, 640) + P.laptopBack(480, 700, 0.72, C.navy2) + P.mug(170, 700, 0.9), 4);
    const sticky = F.prop(A.front, P.sticky(0, 0, -6, 'you:|4 hrs', 64, C.sticky, 210), 640, 300, 260, 260, 6);
    F.in(sticky, w('four', 4) - 0.05, 'none', { dur: 0.35, sfx: 'stamp', gain: 0.6, rot: -12 });
    you.mood(w('usually') - 0.1, 'look').tilt(w('takes'), -6).mood(w('four'), 'tired').slump(w('hours.'), 8);
    // manager, at hers
    const mgr = F.puppet(A, A.mid, 'manager', 1440, 860, 1.35, { armL: 'type', armR: 'type', mood: 'smile' });
    F.set(A.mid, P.desk(1160, 700, 700) + P.laptopBack(1300, 700, 0.8), 4);
    // typing jitter
    F.every(A, (G) => { if (G < 2.4) { mgr.armL.wob.style.transform = `rotate(${4 * Math.sin(G * 31)}deg)`; mgr.armR.wob.style.transform = `rotate(${4 * Math.sin(G * 27 + 1)}deg)`; } });
    for (let x = 0.1; x < 2.3; x += 0.13) F.sfx(x, 'key', 0.14);
    // AI chat popup over her laptop
    const pop = F.html(A.front, `<div style="width:420px;background:#FBF7EE;border-radius:18px;box-shadow:0 14px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter">
      <div style="height:40px;background:#F4EEE1;display:flex;align-items:center;gap:7px;padding:0 16px;border-bottom:2px solid #E6DAC2"><i style="width:11px;height:11px;border-radius:50%;background:#E4572E"></i><i style="width:11px;height:11px;border-radius:50%;background:#E2A93B"></i><i style="width:11px;height:11px;border-radius:50%;background:#7FA88B"></i><b style="margin-left:10px;font:600 17px Inter;color:#5a6378">AI chat</b></div>
      <div style="padding:16px 18px;font:500 22px/1.35 Inter;color:#1E2A44"><div style="background:#1E2A44;color:#fff;border-radius:14px;padding:10px 14px;margin-left:50px">Write the Q3 report</div>
      <div style="margin-top:12px;background:#F1E9DA;border-radius:14px;padding:10px 14px;width:220px">Done. 12 pages ✓</div></div></div>`, 1240, 300, 420, 0, 6);
    F.in(pop, w('ChatGPT') + 0.05, 'none', { dur: 0.4, sfx: 'pop' });
    F.out(pop, 5.2, 'above', { dur: 0.35 });
    // the report flies out, page by page
    const pages = [0, 1, 2].map((i) => F.prop(A.front, P.sheet(0, 0, 0, 0.8), 1440, 640, 200, 240, 7));
    pages.forEach((pg, i) => { const t0 = w('finish') + i * 0.25;
      F.fromTo(pg, t0, { opacity: 0, x: 0, y: 40, rotation: 0, scale: 0.6 }, { opacity: 1, x: 260 - i * 6, y: -i * 8 - 30, rotation: -6 + i * 5, scale: 1 }, 0.5, 'power3.out'); F.sfx(t0, 'paperslide', 0.45); });
    // 30 seconds: stopwatch drops, the stack slides to your desk
    const sw = F.prop(A.front, `<g filter="url(#cut)"><rect x="-22" y="-176" width="44" height="34" rx="6" fill="${C.navy}"/><circle r="150" fill="${C.tomato}"/><circle r="122" fill="${C.white}"/></g>`, 980, 380, 340, 380, 8);
    const hand = F.prop(sw, `<path d="M0 0 L0 -100" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/><circle r="12" fill="${C.navy}"/>`, 170, 200, 40, 240, 1, '50% 50%');
    const swNum = F.label(sw, '0:00', 170, 292, { bg: 'none', font: "'Archivo Black'", weight: 400, size: 54, color: C.navy, flat: true });
    const t30 = w('took', 5);
    F.fromTo(sw, t30 - 0.1, { opacity: 0, y: -700, rotation: -20 }, { opacity: 1, y: 0, rotation: 0 }, 0.55, 'power3.out'); F.sfx(t30 - 0.05, 'whoosh', 0.4);
    F.to(hand, w('30', 5), { rotation: 180 }, w('seconds!') + 0.12 - w('30', 5), 'power1.in');
    F.count(A, swNum.box, w('30', 5), w('seconds!') + 0.12, 0, 30, (v) => '0:' + String(Math.round(v)).padStart(2, '0'));
    const tDing = w('seconds!') + 0.12; F.sfx(tDing, 'ding', 0.7);
    pages.forEach((pg, i) => F.to(pg, tDing + 0.15 + i * 0.04, { x: -820 - i * 6, y: 30 - i * 6, rotation: -10 + i * 6 }, 0.5, 'power2.in'));
    F.sfx(tDing + 0.62, 'slap', 0.8); A.shake(tDing + 0.62, 12);
    you.mood(tDing + 0.62, 'shock').tilt(tDing + 0.62, 4, 0.2).hop(tDing + 0.62, 18);
    mgr.mood(w('her', 5), 'sly').tilt(w('her', 5), 6);
    // camera: her desk -> pan to you -> both
    A.cam(w('that', 3), 470, 500, 1.12, 1.0).cam(t30 - 0.25, 880, 520, 0.9, 0.9);
    F.sfx(w('that', 3), 'whoosh', 0.25);
  }

  // ===== B: your desk from above. daily work on the chopping block (7.92 – 11.72) =====
  {
    const B = F.shot(7.92, 11.72, { bg: C.kraft, cam: [960, 560, 1.06] });
    F.set(B.back, `<g filter="url(#cutflat)">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="-200" y="${i * 200 + 90}" width="2400" height="6" fill="${C.kraft2}" opacity=".5"/>`).join('')}</g>`);
    F.set(B.mid, P.mug(1640, 900, 1.3, true) + `<g filter="url(#cut)" transform="rotate(-20 300 880)"><rect x="160" y="860" width="300" height="26" rx="10" fill="${C.navy}"/><path d="M460 860 l40 13 l-40 13z" fill="${C.kraft2}"/></g>`, 1);
    const notes = [['copy numbers', 520, 380, -8], ['weekly report', 860, 330, 5], ['status emails', 1200, 400, -4], ['update slides', 690, 640, 6], ['fix the sheet', 1040, 660, -6]];
    const nt = w('that', 8);
    notes.forEach(([t, x, y, r], i) => { const n = F.prop(B.mid, P.sticky(0, 0, r, t.replace(' ', '|'), 48, i % 2 ? '#F2C66B' : C.sticky, 240), x, y, 280, 280, 3);
      F.in(n, nt + i * 0.22, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.45, rot: r * 2 }); });
    const tc = w('chopping');
    const cleaver = F.prop(B.front, `<g filter="url(#cut)"><path d="M-240 -120 L200 -120 Q230 -120 230 -90 L230 80 L-240 80 Z" fill="#C9C6BE"/><path d="M-240 60 L230 60 L230 80 L-240 80Z" fill="${C.tomato}"/><circle cx="160" cy="-70" r="18" fill="${C.kraft}"/>
      <rect x="230" y="-110" width="300" height="70" rx="20" fill="${C.kraft2}"/><circle cx="300" cy="-75" r="8" fill="${C.kraft}"/><circle cx="440" cy="-75" r="8" fill="${C.kraft}"/></g>`, 900, 470, 1100, 300, 8, '30% 50%');
    F.fromTo(cleaver, tc, { opacity: 0, y: -720, rotation: -24 }, { opacity: 1, y: 0, rotation: -6 }, 0.32, 'power3.in');
    F.sfx(tc + 0.3, 'thunk', 1.0); F.sfx(tc - 0.1, 'dread', 0.7); B.shake(tc + 0.32, 18);
    B.cam(nt, 900, 520, 1.14, 3.2, 'inOutSine');
  }

  // ===== C: the team-chat ping, stomach in a knot (11.72 – 17.38) =====
  {
    const K = F.shot(11.72, 17.38, { bg: '#E9DDC6', cam: [880, 580, 1.0] });
    F.set(K.back, `<rect x="-400" y="860" width="2800" height="500" fill="${C.kraft}" filter="url(#cutflat)"/><g filter="url(#cutflat)" opacity=".7"><rect x="-200" y="120" width="380" height="260" fill="${C.white}"/><rect x="1760" y="90" width="260" height="380" fill="#D9CBB0"/></g>`);
    const you = F.puppet(K, K.mid, 'you', 620, 1320, 2.6, { armL: 'down', armR: 'down', mood: 'tired' });
    const phone = F.prop(K.mid, `<g filter="url(#cut)"><rect x="-110" y="-200" width="220" height="400" rx="30" fill="${C.navy}"/><rect x="-96" y="-180" width="192" height="360" rx="18" fill="#2A3A5C"/></g>`, 1340, 560, 280, 460, 4);
    phone.style.transform = 'scale(1.7) rotate(6deg)'; const phW = F.html(K.mid, '', 1340 - 238, 560 - 391, 476, 782, 5); phW.style.transform = 'rotate(6deg)';
    const ph = phW; ph.innerHTML = `<div style="position:absolute;inset:0;padding:60px 30px;color:#fff;font-family:Inter"><div style="font:700 64px Inter;text-align:center;opacity:.9">4:40</div><div style="font:500 22px Inter;text-align:center;opacity:.6">Friday</div></div>`;
    const tp = w('ping', 12);
    const card = F.html(ph, `<div style="background:#FBF7EE;border-radius:20px;padding:18px 18px;color:#1E2A44;font-family:Inter;box-shadow:0 8px 20px rgba(0,0,0,.3)"><div style="display:flex;align-items:center;gap:10px;font:700 18px Inter;color:#8a8f9c"><span style="width:30px;height:30px;border-radius:8px;background:#C9441F;display:inline-block"></span>Team chat · now</div>
      <div style="margin-top:10px;font:700 24px Inter">Manager</div><div style="font:500 27px/1.3 Inter;margin-top:4px">What are you working on this afternoon?</div></div>`, 26, 250, 424, 0, 2);
    F.in(card, tp, 'above', { dur: 0.45, rot: 0, dist: 0.6, sfx: 'ping', gain: 0.9 });
    const badge = F.prop(K.mid, `<g filter="url(#cut)"><circle r="40" fill="${C.tomato}"/>${T('1', 0, 16, 46, C.white)}</g>`, 1545, 210, 100, 100, 7);
    F.in(badge, tp + 0.05, 'none', { dur: 0.3, sfx: false });
    F.every(K, (G) => { const q = G - tp; const a = q > 0 && q < 0.7 ? 4 * Math.sin(q * 60) * (1 - q / 0.7) : 0; phone.style.transform = `scale(1.7) rotate(${6 + a}deg)`; phW.style.transform = `rotate(${6 + a}deg)`; });
    you.mood(tp + 0.15, 'look').tilt(tp + 0.15, 5).mood(w('stomach') - 0.1, 'gulp').mood(w('knot.') + 0.15, 'worry').tilt(w('stomach'), -3);
    const knot = F.prop(K.front, `<g filter="url(#cut)"><path d="M-110 0 q55 -70 110 0 q55 70 110 0" stroke="${C.tomato}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M-40 -42 q40 44 80 0 q-40 -44 -80 0z" fill="${C.tomato2}"/></g>`, 640, 1000, 300, 200, 6);
    F.fromTo(knot, w('knot.') - 0.1, { opacity: 0, scale: 0.2, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0 }, 0.5, 'power3.out'); F.sfx(w('knot.') - 0.05, 'creak', 0.6);
    F.every(K, (G) => { if (G > w('knot.') + 0.4) knot.style.scale = String(1 + 0.04 * Math.sin(G * 9)); });
    const lbl = F.hand(K.front, 'stomach in a knot', 980, 980, 70, C.tomato2, -4);
    F.in(lbl, w('knot.'), 'none', { dur: 0.4, sfx: false });
    K.cam(tp + 0.2, 1240, 470, 1.18, 1.1).cam(w('with', 15) - 0.1, 760, 760, 1.12, 1.0);
  }

  // ===== D: nine ways, number seven, impossible to fire (17.38 – 25.30) =====
  {
    const D = F.shot(17.38, 25.30, { cam: [960, 560, 1.0] });
    const sh = F.shield(D.mid, 960, 540, 0.95, 0, 2);
    F.in(sh.el, w('Here', 17) + 0.05, 'none', { dur: 0.6, sfx: 'card', gain: 0.6 });
    const pos = [[230, 190, 0], [300, 480, 5], [210, 790, -6], [1690, 190, 7], [1640, 480, -5], [1700, 790, 6], [1410, 860, -4], [540, 930, 4], [1350, 120, -8]];
    const tn = w('nine', 17);
    const tags = pos.map(([x, y, r], i) => { const g = F.prop(D.mid, P.tag(-100, -65, r, '0' + (i + 1), C.white), x, y, 280, 220, 3);
      F.fromTo(g, tn + i * 0.1, { opacity: 0, x: 960 - x, y: 540 - y, scale: 0.3, rotation: 0 }, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 }, 0.55, 'power3.out'); F.sfx(tn + i * 0.1, 'flick', 0.35); return g; });
    const t7 = w('seven', 20);
    const gold = F.prop(D.mid, P.tag(-100, -65, 0, '07', C.gold), 1410, 860, 280, 220, 9);
    F.fromTo(gold, t7, { opacity: 0 }, { opacity: 1 }, 0.25); F.to(gold, t7, { x: 1250 - 1410, y: 330 - 860, scale: 1.6, rotation: -4 }, 0.7, 'power3.inOut');
    F.to(tags[6], t7, { opacity: 0 }, 0.25); F.sfx(t7, 'shimmer', 0.7);
    // you, protected by number seven
    const you = F.puppet(D, D.front, 'you', 760, 1080, 0.95, { mood: 'worry' });
    you.enter(w('makes', 21) - 0.3, 'below', 0.5);
    const ti = w('impossible', 21);
    const stamp = F.prop(D.front, `<g filter="url(#cut)"><rect x="-30" y="-260" width="60" height="170" rx="20" fill="${C.kraft2}"/><circle cx="0" cy="-270" r="46" fill="${C.kraft2}"/><rect x="-130" y="-100" width="260" height="70" rx="10" fill="${C.navy}"/><rect x="-140" y="-34" width="280" height="80" rx="6" fill="${C.tomato}"/>${T('FIRED', 0, 28, 52, C.white)}</g>`, 760, 380, 320, 640, 8, '50% 100%');
    F.fromTo(stamp, ti - 0.35, { opacity: 0, x: -700, y: -500, rotation: -40 }, { opacity: 1, x: 0, y: -40, rotation: -10 }, 0.5, 'power2.out');
    F.to(gold, ti - 0.05, { x: 760 - 1410, y: 640 - 860, scale: 1.25, rotation: 0 }, 0.35, 'power3.out');
    F.to(stamp, ti + 0.3, { y: 60, rotation: 0 }, 0.18, 'power3.in'); F.sfx(ti + 0.47, 'tink', 0.8);
    F.to(stamp, ti + 0.5, { y: -500, x: -900, rotation: -60, opacity: 0 }, 0.6, 'power2.in');
    you.mood(ti - 0.3, 'shock').mood(ti + 0.6, 'happy').hop(ti + 0.7, 22);
    D.cam(t7 - 0.2, 1080, 470, 1.08, 0.8).cam(ti - 0.5, 900, 640, 1.06, 0.8);
    // number one: everything else leaves, tag 01 flies into the camera
    const t1 = w('So', 23);
    tags.forEach((g, i) => { if (i) F.out(g, t1 + 0.05 + i * 0.04, i < 3 ? 'left' : 'right', { dur: 0.45 }); });
    F.out(gold, t1, 'below', { dur: 0.4 }); F.out(sh.el, t1 + 0.1, 'below', { dur: 0.5 }); you.exit(t1, 'below', 0.45); F.sfx(t1, 'whoosh', 0.4);
    D.cam(t1, 960, 540, 1.0, 0.6);
    F.to(tags[0], w('number', 24) - 0.1, { x: 960 - 230, y: 540 - 190, rotation: 0, scale: 3.2 }, 0.9, 'power3.inOut'); F.sfx(w('number', 24), 'whoosh', 0.35);
  }
  F.done();
})();
