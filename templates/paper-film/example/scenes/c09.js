// c09 — Method 9: track the money you make or save (448.94 – 501.28)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== card (448.94 – 452.60) =====
  {
    const S = F.shot(448.94, 452.60);
    F.chapter(S, 448.98, 9, 'TRACK THE MONEY', 'results beat hard work');
    const coin = F.prop(S.front, K.coin(60), 1000, 860, 160, 160, 9);
    F.in(coin, w('money', 450) - 0.2, 'below', { dur: 0.4, sfx: 'coin', gain: 0.6 });
    F.every(S, (G) => { coin.style.scale = `${Math.cos(G * 5).toFixed(3)} 1`; });
  }

  // ===== this last step changes how you see the other eight (452.60 – 455.60) =====
  {
    const S = F.shot(452.60, 455.60, { cam: [960, 540, 1.0] });
    const sh = F.shield(S.mid, 960, 560, 1.15, 8, 3);
    F.in(sh.el, 452.62, 'none', { dur: 0.4 });
    const tc = w('changes', 453);
    for (let i = 0; i < 8; i++) { const r = Math.floor(i / 3), c = i % 3, x = 960 + (-240 + c * 160 + 80) * 1.15, y = 560 + (-300 + r * 200 + 100) * 1.15;
      const d = F.prop(S.front, K.coin(28), x + 40, y - 50, 70, 70, 9); F.fromTo(d, tc + i * 0.18, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1 }, 0.3, 'power3.out'); F.sfx(tc + i * 0.18, 'tick', 0.35);
      F.fromTo(sh.pieces[i], tc + i * 0.18, { filter: 'brightness(1)' }, { filter: 'brightness(1.25)' }, 0.15); F.to(sh.pieces[i], tc + i * 0.18 + 0.2, { filter: 'brightness(1)' }, 0.3); }
    const ot = F.hand(S.ui, 'every method = money', 960, 1020, 64, C.navy, -1); F.in(ot, tc + 0.6, 'none', { dur: 0.3, sfx: false });
    S.cam(452.7, 960, 520, 1.08, 2.8, 'inOutSine');
  }

  // ===== budgets: not hard work, not staying late (455.60 – 462.00) =====
  {
    const S = F.shot(455.60, 462.00, { bg: '#E8DCC6', cam: [960, 560, 1.0] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    F.set(S.mid, `<g filter="url(#cut)"><ellipse cx="960" cy="860" rx="840" ry="130" fill="${C.kraft2}"/><ellipse cx="960" cy="840" rx="820" ry="120" fill="${C.kraft}"/></g>`, 2);
    [[400, 'exec'], [700, 'grey'], [1220, 'manager'], [1520, 'co1']].forEach(([x, k], i) => F.puppet(S, S.back, k, x, 780, 0.95, { mood: 'neutral', flip: x > 960, look: k === 'grey' ? { top: C.navy, skin: C.skin2, hair: C.hair1 } : {} }));
    const bs = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-360" y="-60" width="720" height="140" fill="${C.white}" transform="skewX(-20)"/>${T('BUDGET', -40, 30, 60, C.navy)}</g>`, 960, 820, 900, 200, 4);
    const tb = w('budgets,', 457);
    F.fromTo(bs, tb - 0.5, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1 }, 0.6, 'power3.out'); F.sfx(tb - 0.5, 'unroll', 0.6);
    const yr = F.hand(S.ui, 'end of the year', 960, 160, 70, C.navy, -2); F.in(yr, w('end', 455), 'none', { dur: 0.3, sfx: false }); F.out(yr, w('they', 458), 'above');
    const brow = F.prop(S.front, `<g filter="url(#cut)"><circle r="56" fill="${C.skin1}"/><path d="M30 -40 q14 24 0 34 q-14 -10 0 -34z" fill="#9CC3D8"/><path d="M-26 -10 h18 M8 -10 h18" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/></g>`, 760, 760, 140, 140, 9);
    const moon = F.prop(S.front, `<g filter="url(#cut)"><path d="M20 -56 A60 60 0 1 0 20 56 A46 46 0 1 1 20 -56Z" fill="${C.gold}"/></g>`, 1160, 760, 140, 140, 9);
    const th = w('hard', 460), tl = w('late.', 461);
    F.in(brow, th - 0.4, 'above', { dur: 0.35, sfx: 'pop' }); F.in(moon, w('stay', 461) - 0.3, 'above', { dur: 0.35, sfx: 'pop' });
    const lh = F.label(S.ui, 'work hard', 760, 560, { size: 44, bg: C.navy, z: 20 }), ll = F.label(S.ui, 'stay late', 1160, 560, { size: 44, bg: C.navy, z: 20 });
    F.in(lh, th - 0.3, 'below', { dur: 0.3, sfx: false }); F.in(ll, w('stay', 461) - 0.2, 'below', { dur: 0.3, sfx: false });
    F.to([brow, lh], tl + 0.05, { x: -900, opacity: 0, rotation: -30 }, 0.4, 'power2.in'); F.to([moon, ll], tl + 0.15, { x: 900, opacity: 0, rotation: 30 }, 0.4, 'power2.in'); F.sfx(tl + 0.05, 'swipe', 0.6); F.sfx(tl + 0.15, 'swipe', 0.6);
    S.cam(th - 0.6, 960, 680, 1.2, 1.0);
  }

  // ===== answering emails at nine at night, during dinner (462.00 – 466.54) =====
  {
    const S = F.shot(462.00, 466.54, { bg: '#2E3A55', cam: [900, 560, 1.1] });
    F.set(S.back, `<g filter="url(#cutflat)"><rect x="1300" y="120" width="420" height="320" fill="#1E2A44"/><circle cx="1600" cy="220" r="50" fill="${C.gold}"/><circle cx="1620" cy="205" r="44" fill="#1E2A44"/></g><rect x="-800" y="820" width="3600" height="600" fill="#3A4766" filter="url(#cutflat)"/>`);
    const you = F.puppet(S, S.mid, 'you', 760, 940, 1.5, { mood: 'tired', armR: 'hold', armL: 'down' });
    F.set(S.mid, `<g filter="url(#cut)"><rect x="380" y="760" width="900" height="36" rx="6" fill="${C.kraft}"/><rect x="420" y="796" width="30" height="300" fill="${C.kraft2}"/><rect x="1210" y="796" width="30" height="300" fill="${C.kraft2}"/><ellipse cx="1000" cy="750" rx="120" ry="24" fill="${C.white}"/><ellipse cx="1000" cy="742" rx="70" ry="14" fill="${C.sage}"/></g>`, 4);
    const steam = F.prop(S.mid, `<path d="M-14 0 q-12 -34 6 -60 M16 2 q-12 -36 6 -66" stroke="${C.white}" stroke-width="6" fill="none" stroke-linecap="round"/>`, 1000, 680, 80, 120, 5);
    F.to(steam, w('dinner.', 465) - 0.3, { opacity: 0 }, 0.8);
    const ph = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-50" y="-90" width="100" height="180" rx="16" fill="${C.navy}"/><rect x="-42" y="-80" width="84" height="160" rx="10" fill="#FBF7EE"/>${T('9:00', 0, -40, 26, C.navy)}${T('PM', 0, -14, 18, C.grey2)}<rect x="-34" y="10" width="68" height="40" rx="6" fill="${C.tomato}"/></g>`, 900, 600, 120, 200, 6);
    F.in(ph, w('answer', 462) - 0.2, 'none', { dur: 0.3, sfx: 'ping', gain: 0.6 });
    F.every(S, (G) => { ph.style.rotate = (Math.floor(G * 3) % 3 === 0 ? 3 * Math.sin(G * 60) : 0) + 'deg'; });
    for (let x = w('nine', 463); x < 466; x += 1.0) F.sfx(x, 'ping', 0.25);
    F.sfx(w('dinner.', 465), 'clink', 0.4);
    const nn = F.label(S.ui, '9 PM. during dinner.', 960, 170, { size: 80, bg: C.tomato, rot: -1.5, z: 20 }); F.in(nn, w('nine', 463), 'below', { dur: 0.4 });
    S.cam(w('nine', 463), 860, 600, 1.25, 1.2);
  }

  // ===== hard work is invisible; results stand out (466.54 – 471.48) =====
  {
    const S = F.shot(466.54, 471.48, { cam: [960, 540, 1.0] });
    const sheet = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-660" y="-430" width="1320" height="860" fill="${C.white}"/></g>${T('BUDGET 2027', -580, -340, 56, C.navy, 'Archivo Black', 'start')}${[-260, -180, -100, -20, 140, 220, 300].map((y, i) => `<rect x="-580" y="${y}" width="1160" height="2" fill="${C.grey}"/><rect x="-580" y="${y + 24}" width="${300 + (i * 97) % 300}" height="16" fill="${C.grey}"/><rect x="340" y="${y + 24}" width="${120 + (i * 41) % 100}" height="16" fill="${C.grey}"/>`).join('')}`, 960, 540, 1360, 900, 2);
    sheet.style.rotate = '-1.5deg';
    const you = F.puppet(S, S.mid, 'you', 640, 980, 1.1, { mood: 'tired' });
    const ti = w('invisible', 467);
    F.to(you.root, ti - 0.1, { opacity: 0.25 }, 0.8); you.grey(ti - 0.1, true, 0.8); F.sfx(ti, 'fade', 0.5);
    const hw = F.hand(S.mid, 'hard work: invisible', 640, 560, 56, C.grey2, -2); F.in(hw, ti, 'none', { dur: 0.35, sfx: false });
    const tr = w('results', 469);
    const res = F.prop(S.front, `<g filter="url(#cut)"><rect x="-340" y="-60" width="680" height="120" fill="${C.tomato}"/></g>`, 1120, 640, 700, 140, 9);
    const rt = F.label(res, 'Saved $40k · −6 hrs/wk', 350, 70, { bg: 'none', size: 50, color: C.white, font: 'Inter', weight: 800, flat: true });
    F.fromTo(res, tr - 0.1, { opacity: 0, scale: 0.6, y: 60 }, { opacity: 1, scale: 1.08, y: -20, rotation: -3 }, 0.45, 'power3.out'); F.sfx(tr, 'pop', 0.8);
    const so = F.label(S.ui, 'results stand out', 960, 1000, { size: 92, bg: C.navy, rot: -1, z: 20 }); F.in(so, w('stand', 470) - 0.1, 'below', { dur: 0.4 });
    S.cam(tr - 0.3, 1060, 600, 1.12, 1.0);
  }

  // ===== write it down in a private note (471.48 – 479.64) =====
  {
    const S = F.shot(471.48, 479.64, { bg: C.kraft, cam: [960, 540, 1.0] });
    const nb = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-620" y="-400" width="1240" height="800" rx="16" fill="${C.navy2}"/><rect x="-590" y="-375" width="580" height="750" fill="${C.white}"/><rect x="10" y="-375" width="580" height="750" fill="${C.white}"/>${[...Array(12)].map((_, i) => `<rect x="${-560}" y="${-300 + i * 56}" width="520" height="2" fill="#C9D6E3"/><rect x="40" y="${-300 + i * 56}" width="520" height="2" fill="#C9D6E3"/>`).join('')}</g>`, 960, 540, 1260, 820, 2);
    F.in(nb, 471.5, 'below', { dur: 0.5 });
    const ttl = F.hand(S.mid, 'my wins (private)', 660, 220, 56, C.tomato2, -1); F.in(ttl, 471.8, 'none', { dur: 0.3, sfx: false });
    const ents = [[w('speed', 473), 'Sped up Q3 report: −6 hrs'], [w('fix', 474), 'Automated status sheet: −3 hrs/wk'], [w('catch', 475), 'Caught client error: saved $40k']];
    ents.forEach(([t, txt], i) => { const l = F.label(S.mid, txt, 1250, 340 + i * 112, { bg: 'none', size: 40, color: C.navy, font: 'Caveat', weight: 700, flat: true });
      l.box.style.clipPath = 'inset(0 100% 0 0)'; F.fromTo(l.box, t, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }, 0.9, 'none'); F.sfx(t, 'scribble', 0.5); });
    const pen = F.prop(S.front, `<g filter="url(#cut)" transform="rotate(35)"><rect x="-14" y="-110" width="28" height="180" rx="10" fill="${C.navy}"/><path d="M-14 70 L0 106 L14 70Z" fill="${C.kraft}"/></g>`, 1100, 260, 180, 260, 9);
    F.in(pen, ents[0][0] - 0.3, 'right', { dur: 0.3, sfx: false });
    ents.forEach(([t], i) => { F.to(pen, t, { x: 0 + 380, y: 112 * i + 40 }, 0.9, 'none'); if (i < 2) F.to(pen, t + 0.9, { x: -100, y: 112 * (i + 1) + 40 }, Math.max(0.1, ents[i + 1][0] - t - 0.95), 'power2.inOut'); });
    const tpv = w('private', 478);
    F.to(pen, tpv - 0.3, { opacity: 0, x: 800 }, 0.4);
    const lock = F.prop(S.front, `<g filter="url(#cut)"><rect x="-70" y="-30" width="140" height="110" rx="14" fill="${C.gold}"/><path d="M-42 -30 v-36 a42 42 0 0 1 84 0 v36" stroke="${C.navy}" stroke-width="16" fill="none"/><circle cx="0" cy="22" r="14" fill="${C.navy}"/></g>`, 1560, 820, 180, 220, 10);
    F.in(lock, tpv, 'below', { dur: 0.35, sfx: 'lock', gain: 0.7 });
    S.cam(ents[0][0] - 0.3, 1200, 460, 1.18, 1.2).cam(tpv - 0.4, 1000, 560, 1.02, 1.0);
  }

  // ===== before your next review: type this (479.64 – 490.80) =====
  {
    const S = F.shot(479.64, 490.80, { bg: '#E3D7C1', cam: [960, 540, 0.85], drift: 0.5 });
    const L = F.laptop(S.mid, 960, 540, 1.0); const chat = F.chat(S, L.screen, { size: 44, top: true });
    const cal = F.prop(S.ui, K.calendar('NEXT WEEK', 'REVIEW', 'performance'), 1640, 640, 300, 320, 20);
    F.in(cal, w('review,', 480) - 0.3, 'left', { dur: 0.4, sfx: 'flip' }); F.out(cal, w('type', 482) + 0.3, 'left');
    const t0 = w('Turn', 483), t1 = w('company.', 490) + 0.1;
    chat.type('Turn these notes of what I did this year into five short sentences that show how much time and money I saved the company.', t0, t1);
    const k = F.label(S.ui, 'TYPE THIS', 1500, 90, { size: 60, bg: C.tomato, rot: -1.5, z: 20 }); F.in(k, w('type', 482) - 0.05, 'above', { dur: 0.4 }); F.out(k, t0 + 1.2, 'above');
    const st = F.prop(S.front, P.sticky(0, 0, 7, 'pause &amp;|copy!', 54, C.sticky, 200), 1800, 300, 240, 240, 9); F.in(st, t0 + 1.0, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.5 });
    S.cam(w('open', 481) - 0.1, 960, 470, 1.08, 1.0).cam(t0, 960, 430, 1.16, 6.5, 'inOutSine');
  }

  // ===== the ping again — no knot this time; real wins; the 30-second stopwatch shatters (490.80 – 501.28) =====
  {
    const S = F.shot(490.80, 501.28, { bg: '#E9DDC6', cam: [880, 580, 1.0] });
    F.set(S.back, `<rect x="-400" y="860" width="2800" height="500" fill="${C.kraft}" filter="url(#cutflat)"/><g filter="url(#cutflat)" opacity=".7"><rect x="-200" y="120" width="380" height="260" fill="${C.white}"/><rect x="1760" y="90" width="260" height="380" fill="#D9CBB0"/></g>`);
    const you = F.puppet(S, S.mid, 'you', 620, 1320, 2.6, { mood: 'neutral' });
    const phone = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-110" y="-200" width="220" height="400" rx="30" fill="${C.navy}"/><rect x="-96" y="-180" width="192" height="360" rx="18" fill="#2A3A5C"/></g>`, 1340, 560, 280, 460, 4);
    phone.style.transform = 'scale(1.7) rotate(6deg)'; const ph = F.html(S.mid, '', 1340 - 238, 560 - 391, 476, 782, 5); ph.style.transform = 'rotate(6deg)';
    ph.innerHTML = `<div style="position:absolute;inset:0;padding:60px 30px;color:#fff;font-family:Inter"><div style="font:700 64px Inter;text-align:center;opacity:.9">4:40</div><div style="font:500 22px Inter;text-align:center;opacity:.6">Friday</div></div>`;
    const tp = w('pops', 492);
    const card = F.html(ph, `<div style="background:#FBF7EE;border-radius:20px;padding:18px;color:#1E2A44;font-family:Inter;box-shadow:0 8px 20px rgba(0,0,0,.3)"><div style="display:flex;align-items:center;gap:10px;font:700 18px Inter;color:#8a8f9c"><span style="width:30px;height:30px;border-radius:8px;background:#C9441F;display:inline-block"></span>Team chat · now</div><div style="margin-top:10px;font:700 24px Inter">Manager</div><div style="font:500 27px/1.3 Inter;margin-top:4px">What are you working on this afternoon?</div></div>`, 26, 250, 424, 0, 2);
    F.in(card, tp, 'above', { dur: 0.45, rot: 0, dist: 0.6, sfx: 'ping', gain: 0.9 });
    F.every(S, (G) => { const q = G - tp; const a = q > 0 && q < 0.7 ? 4 * Math.sin(q * 60) * (1 - q / 0.7) : 0; phone.style.transform = `scale(1.7) rotate(${6 + a}deg)`; ph.style.transform = `rotate(${6 + a}deg)`; });
    const tdr = w("doesn't", 495);
    you.mood(tp + 0.2, 'look').tilt(tp + 0.2, 5).mood(tdr, 'happy').tilt(tdr, 0);
    const knot = F.prop(S.front, `<g filter="url(#cut)"><path d="M-110 0 q55 -70 110 0 q55 70 110 0" stroke="${C.tomato}" stroke-width="24" fill="none" stroke-linecap="round"/></g>`, 640, 1000, 300, 200, 6);
    const free = F.prop(S.front, `<g filter="url(#cut)"><path d="M-130 10 q60 -30 120 -10 M10 0 q60 20 120 -10" stroke="${C.sage2}" stroke-width="20" fill="none" stroke-linecap="round"/></g>`, 640, 1000, 320, 120, 6);
    F.hidden(knot); F.show(knot, tdr - 0.6); F.to(knot, tdr, { opacity: 0, scaleX: 1.6 }, 0.4); F.fromTo(free, tdr + 0.1, { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1 }, 0.4); F.sfx(tdr, 'release', 0.7);
    const sd = F.hand(S.ui, "your stomach doesn't drop", 760, 130, 70, C.sage2, -2); F.in(sd, tdr, 'none', { dur: 0.35, sfx: false });
    // the reply: a list of real wins
    const tw = w('wins', 497);
    const reply = F.html(ph, `<div style="margin-left:40px;background:#1E2A44;color:#fff;border-radius:16px;padding:14px 16px;font:500 25px/1.45 Inter">✓ Saved team 3 hrs/wk<br>✓ Caught a $40k error<br>✓ Q3 report in 20 min</div>`, 26, 520, 400, 0, 3);
    F.in(reply, tw - 0.4, 'below', { dur: 0.4, rot: 0, dist: 0.4, sfx: 'send', gain: 0.6 });
    // the 30-second stopwatch shatters
    const trp = w('replace.', 500);
    const sw = F.prop(S.front, `<g filter="url(#cut)"><rect x="-22" y="-176" width="44" height="34" rx="6" fill="${C.navy}"/><circle r="150" fill="${C.tomato}"/><circle r="122" fill="${C.white}"/>${T('0:30', 0, 20, 70)}</g>`, 960, 340, 340, 380, 9);
    F.fromTo(sw, w('30', 499) - 0.3, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 0.8 }, 0.35, 'power3.out');
    F.to(sw, trp - 0.1, { opacity: 0 }, 0.05);
    for (let i = 0; i < 16; i++) { const sh = F.prop(S.front, `<path d="M0 -${12 + (i % 3) * 6} L${10 + (i % 4) * 4} 8 L-${8 + (i % 2) * 6} 10Z" fill="${[C.tomato, C.white, C.gold, C.navy][i % 4]}" filter="url(#cutflat)"/>`, 960, 340, 60, 60, 10);
      const a = i / 16 * Math.PI * 2; F.fromTo(sh, trp - 0.1, { opacity: 1, x: 0, y: 0, rotation: 0 }, { x: Math.cos(a) * (300 + (i % 3) * 80), y: Math.sin(a) * 260 + 300, rotation: 360 + i * 40, opacity: 0 }, 1.2, 'power2.out'); F.hidden(sh); F.show(sh, trp - 0.1); }
    F.sfx(trp - 0.1, 'shatter', 0.8);
    const rw = F.label(S.ui, 'real wins > a 30-second prompt', 960, 1000, { size: 64, bg: C.navy, rot: -1, z: 20 }); F.in(rw, tw, 'below', { dur: 0.4 });
    K; S.cam(tp + 0.2, 1240, 470, 1.18, 1.1).cam(tdr - 0.4, 760, 760, 1.1, 1.0).cam(tw - 0.6, 1100, 560, 1.0, 1.0);
    F.miniSnap(S, 9, trp + 0.2, 0.9);
  }
  F.done();
})();
