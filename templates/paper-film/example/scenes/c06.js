// c06 — Method 6: teach your boss one simple AI trick (304.82 – 358.00)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;
  const slip = (t = 'prompt') => `<g filter="url(#cut)"><rect x="-90" y="-30" width="180" height="60" rx="6" fill="${C.sticky}"/>${T(t, 0, 12, 34, C.navy, 'Caveat')}</g>`;

  // ===== AI is a solo game → big mistake (304.82 – 309.72) =====
  {
    const S = F.shot(304.82, 309.72, { bg: '#E5DAC4', cam: [900, 560, 1.15] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><path d="M300 820 L300 -200 M300 820 L-800 1200" stroke="${C.kraft2}" stroke-width="6"/>`);
    const you = F.puppet(S, S.mid, 'you', 700, 900, 1.5, { mood: 'happy', armL: 'type', armR: 'type' });
    const dev = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-90" y="-60" width="180" height="120" rx="20" fill="${C.sage2}"/><rect x="-60" y="-42" width="120" height="70" rx="6" fill="#B9D2A8"/><circle cx="-62" cy="40" r="8" fill="${C.navy}"/><circle cx="62" cy="40" r="8" fill="${C.tomato}"/></g>`, 700, 640, 200, 140, 6);
    const scr = F.label(S.mid, 'AI · solo mode', 700, 625, { size: 20, bg: 'none', color: C.navy, font: "'JetBrains Mono'", weight: 700, flat: true, z: 7 });
    const go = F.label(S.mid, 'GAME OVER', 700, 625, { size: 24, bg: 'none', color: C.tomato2, font: "'JetBrains Mono'", weight: 700, flat: true, z: 8 }); F.hidden(go);
    F.every(S, (G) => { you.armL.wob.style.transform = `rotate(${3 * Math.sin(G * 18)}deg)`; });
    for (let x = 305; x < 308; x += 0.25) F.sfx(x, 'blip', 0.12);
    const sg = F.hand(S.ui, 'a solo game?', 1300, 230, 80, C.navy, -3); F.in(sg, w('solo', 306), 'none', { dur: 0.35, sfx: false });
    const tm = w('mistake.', 309);
    F.to(scr, tm - 0.4, { opacity: 0 }, 0.1); F.show(go, tm - 0.3); F.sfx(tm - 0.3, 'gameover', 0.7);
    you.mood(tm - 0.2, 'sad').slump(tm, 10);
    const bm = F.label(S.ui, 'BIG MISTAKE', 1300, 900, { size: 90, bg: C.tomato, rot: -2, z: 20 }); F.in(bm, w('big', 308), 'below', { dur: 0.4 });
    S.cam(w('which', 307), 760, 600, 1.4, 1.2);
  }

  // ===== card (309.72 – 313.60) =====
  {
    const S = F.shot(309.72, 313.60);
    F.chapter(S, 309.75, 6, 'TEACH YOUR BOSS', 'one simple AI trick');
    const apple = F.prop(S.front, `<g filter="url(#cut)"><circle cx="-24" cy="10" r="56" fill="${C.tomato}"/><circle cx="24" cy="10" r="56" fill="${C.tomato}"/><path d="M0 -40 q6 -30 20 -40" stroke="${C.kraft2}" stroke-width="8" fill="none"/><path d="M10 -60 q30 -20 46 4 q-30 10 -46 -4z" fill="${C.sage}"/></g>`, 980, 880, 180, 180, 9);
    F.in(apple, w('trick.', 312) - 0.3, 'below', { dur: 0.4, sfx: 'pop' });
  }

  // ===== 3-hour Thursday report → 20 minutes; keep it a secret (313.60 – 320.06) =====
  {
    const S = F.shot(313.60, 320.06, { bg: '#E9DDC6', cam: [960, 540, 1.0] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const cal = F.prop(S.back, K.calendar('THURSDAY', 'REPORT', ''), 360, 330, 300, 320, 2); F.in(cal, w('Thursday', 314) - 0.2, 'left', { dur: 0.4, sfx: 'flip' });
    const hg = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-90" y="-150" width="180" height="24" rx="8" fill="${C.kraft2}"/><rect x="-90" y="126" width="180" height="24" rx="8" fill="${C.kraft2}"/><path d="M-70 -126 L70 -126 L10 0 L70 126 L-70 126 L-10 0Z" fill="${C.white}" opacity=".9"/></g>`, 960, 470, 220, 320, 3);
    const sandTop = F.prop(S.mid, `<path d="M-60 -120 L60 -120 L8 -6 L-8 -6Z" fill="${C.gold}"/>`, 960, 470, 140, 260, 4, '50% 0%');
    const sandBot = F.prop(S.mid, `<path d="M-60 120 L60 120 L20 60 L-20 60Z" fill="${C.gold}"/>`, 960, 470, 140, 260, 4, '50% 100%');
    F.in(hg, 313.65, 'none', { dur: 0.4 }); F.in(sandTop, 313.65, 'none', { dur: 0.4, sfx: false }); F.in(sandBot, 313.65, 'none', { dur: 0.4, sfx: false });
    const t20 = w('20', 316);
    F.fromTo(sandTop, t20 - 0.6, { scaleY: 1 }, { scaleY: 0.1 }, 0.9, 'power2.in'); F.fromTo(sandBot, t20 - 0.6, { scaleY: 0.3 }, { scaleY: 1.4 }, 0.9, 'power2.in'); F.sfx(t20 - 0.6, 'sand', 0.6);
    const h3 = F.label(S.mid, '3 HRS', 1320, 400, { size: 96, bg: C.navy, rot: -3 }), m20 = F.label(S.mid, '20 MIN', 1320, 400, { size: 96, bg: C.sage2, rot: 3 });
    F.in(h3, w('three', 314), 'right', { dur: 0.4 }); F.hidden(m20); F.to(h3, t20, { opacity: 0, rotationX: 90 }, 0.2); F.fromTo(m20, t20 + 0.15, { opacity: 0, rotationX: -90 }, { opacity: 1, rotationX: 0 }, 0.25); F.sfx(t20 + 0.2, 'ding', 0.6);
    const ts = w('secret.', 319);
    F.to([hg, sandTop, sandBot, h3, m20, cal], ts - 1.6, { opacity: 0, y: -60 }, 0.4);
    const you = F.puppet(S, S.mid, 'you', 780, 940, 1.45, { mood: 'sly', armR: 'down' }); you.enter(ts - 1.6, 'below', 0.5);
    const dr = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-200" y="-110" width="400" height="220" fill="${C.kraft2}"/><rect x="-170" y="-80" width="340" height="80" fill="${C.kraft}"/><rect x="-40" y="-50" width="80" height="14" rx="6" fill="${C.navy}"/></g>`, 1240, 800, 420, 240, 4);
    F.in(dr, ts - 1.4, 'right', { dur: 0.4 });
    const sp = F.prop(S.mid, slip('my 20-min trick'), 1000, 620, 240, 90, 6);
    F.in(sp, ts - 1.2, 'none', { dur: 0.3, sfx: false }); F.to(sp, ts - 0.4, { x: 240, y: 150, scale: 0.6, opacity: 0 }, 0.45, 'power2.in'); F.sfx(ts - 0.1, 'drawer', 0.6);
    const lk = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-30" y="-10" width="60" height="50" rx="8" fill="${C.gold}"/><path d="M-18 -10 v-16 a18 18 0 0 1 36 0 v16" stroke="${C.navy}" stroke-width="8" fill="none"/></g>`, 1240, 760, 90, 110, 7);
    F.in(lk, ts + 0.15, 'none', { dur: 0.25, sfx: 'lock', gain: 0.6 });
    you.arm(ts - 0.6, 'r', 'fwd', 0.3).arm(ts + 0.1, 'r', 'down', 0.3).mood(ts + 0.2, 'look').tilt(ts + 0.2, 6);
    const sc = F.hand(S.ui, 'keep it a secret…', 560, 200, 70, C.navy, -3); F.in(sc, w('secret.', 319) - 0.2, 'none', { dur: 0.3, sfx: false });
  }

  // ===== afraid: twice as much work, or fired (320.06 – 326.60) =====
  {
    const S = F.shot(320.06, 326.60, { bg: '#E9DDC6', cam: [900, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const mgr = F.puppet(S, S.back, 'manager', -300, 790, 0.85, { mood: 'neutral' });
    const tm = w('manager', 320);
    mgr.walk(tm - 0.5, tm + 2.2).move(tm - 0.5, 1500, 790, 2.7, 'none');
    for (let x = tm - 0.5; x < tm + 2.2; x += 0.4) F.sfx(x, 'step', 0.2);
    const you = F.puppet(S, S.mid, 'you', 620, 920, 1.45, { mood: 'worry', armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(300, 780, 640), 4);
    const L = F.laptop(S.mid, 760, 640, 0.18, 5);
    you.arms(tm + 0.2, 'fwd', 'fwd', 0.25).mood(tm + 0.2, 'shock').arms(tm + 2.4, 'type', 'type', 0.4).mood(tm + 2.4, 'worry');
    const bub = F.prop(S.front, K.thought(640, 380), 1300, 380, 720, 520, 8);
    const tt = w('twice', 323);
    F.fromTo(bub, tt - 0.5, { opacity: 0, scale: 0.3, transformOrigin: '10% 100%' }, { opacity: 1, scale: 1 }, 0.4); F.sfx(tt - 0.5, 'pop', 0.5);
    const st1 = F.prop(S.front, P.sheet(0, 0, -4, 0.9), 1180, 400, 200, 240, 9), st2 = F.prop(S.front, P.sheet(0, 0, 6, 0.9), 1220, 380, 200, 240, 10);
    const x2 = F.label(S.front, 'x2', 1420, 380, { size: 90, bg: 'none', color: C.tomato2, font: "'Archivo Black'", weight: 400, flat: true, z: 11 });
    F.in(st1, tt - 0.2, 'none', { dur: 0.25, sfx: 'paperslide' }); F.in(st2, tt, 'none', { dur: 0.25, sfx: false }); F.in(x2, tt + 0.2, 'none', { dur: 0.25, sfx: false });
    const tf = w('fire', 325);
    F.to([st1, st2, x2], tf - 0.4, { opacity: 0 }, 0.2);
    const fired = F.prop(S.front, `<g filter="url(#cut)"><rect x="-200" y="-110" width="400" height="220" fill="${C.kraft}"/><path d="M-200 -50 H200" stroke="${C.kraft2}" stroke-width="10"/>${T('FIRED', 0, 50, 90, C.tomato2)}</g>`, 1300, 380, 420, 240, 11);
    F.fromTo(fired, tf - 0.2, { opacity: 0, scale: 1.5, rotation: -10 }, { opacity: 1, scale: 1, rotation: -4 }, 0.25, 'power3.in'); F.sfx(tf + 0.05, 'stamp', 0.8); S.shake(tf + 0.05, 8);
    you.mood(tf, 'gulp');
    S.cam(tt - 0.6, 1060, 520, 1.0, 1.0);
  }

  // ===== the bigger picture: managers are scared too (326.60 – 332.74) =====
  {
    const S = F.shot(326.60, 332.74, { cam: [960, 540, 2.2] });
    const boxes = [[960, 160, 'exec'], [480, 440, 'manager'], [960, 440, 'co2'], [1440, 440, 'co1'], [320, 760, 'grey'], [640, 760, 'newhire'], [960, 760, 'grey'], [1280, 760, 'co2'], [1600, 760, 'grey']];
    F.set(S.back, `<g stroke="${C.navy}" stroke-width="5" fill="none"><path d="M960 220 V340 M480 340 H1440 M480 340 V380 M960 340 V380 M1440 340 V380 M480 500 V640 M320 640 H1600 M320 640 V700 M640 640 V700 M960 640 V700 M1280 640 V700 M1600 640 V700"/></g>`);
    const ps = boxes.map(([x, y, k], i) => { const b = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-120" y="-70" width="240" height="140" rx="10" fill="${C.white}"/></g>`, x, y, 260, 160, 2);
      const pp = F.puppet(S, S.mid, k, x, y + 66, 0.42, { mood: 'neutral' }); return pp; });
    F.sfx(326.7, 'whoosh', 0.5);
    const mg = ps[1];
    const tsc = w('scared', 330);
    mg.mood(tsc - 0.3, 'worry');
    const sw = F.prop(S.front, `<g fill="#9CC3D8">${[0, 1, 2].map((i) => `<path d="M${-40 + i * 40} 0 q10 18 0 24 q-10 -6 0 -24z"/>`).join('')}</g>`, 480, 330, 140, 60, 9);
    F.hidden(sw); F.show(sw, tsc); F.every(S, (G) => { sw.style.translate = `0 ${((G * 50) % 30).toFixed(1)}px`; });
    const sl = F.label(S.ui, 'managers are scared too', 960, 990, { size: 76, bg: C.navy, rot: -1, z: 20 }); F.in(sl, w('Managers', 329), 'below', { dur: 0.4 });
    S.cam(326.65, 960, 480, 1.0, 1.6, 'inOutCubic').cam(w('Managers', 329) - 0.2, 480, 420, 2.2, 1.2);
    F.sfx(tsc, 'gulp', 0.6);
  }

  // ===== roll out AI; nodding like they know what an LLM is; secretly panicking (332.74 – 341.58) =====
  {
    const S = F.shot(332.74, 341.58, { bg: '#E8DCC6', cam: [960, 300, 1.1] });
    F.set(S.back, `<rect x="-800" y="800" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const ex = F.puppet(S, S.mid, 'exec', 960, 360, 0.9, { mood: 'angry', armR: 'point' });
    const memo = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-150" y="-90" width="300" height="180" fill="${C.white}"/>${T('MEMO', 0, -40, 30, C.grey2)}${T('ROLL OUT AI', 0, 22, 44, C.tomato2)}${T('across the team', 0, 66, 30, C.navy, 'Caveat')}</g>`, 1260, 170, 320, 200, 4);
    F.in(memo, w('telling', 333), 'right', { dur: 0.4, sfx: 'slap', gain: 0.5 });
    const tn = w('nodding', 336);
    const wb = F.prop(S.back, `<g filter="url(#cut)"><rect x="-260" y="-130" width="520" height="260" fill="${C.white}"/>${T('LLM ??', 0, 46, 120, C.navy)}</g>`, 960, 300, 540, 280, 2);
    F.in(wb, w('LLM', 338) - 0.3, 'above', { dur: 0.4, sfx: 'marker', gain: 0.5 }); F.out(memo, w('LLM', 338) - 0.6, 'right'); F.out(ex.root, w('LLM', 338) - 0.6, 'above');
    F.set(S.mid, `<g filter="url(#cut)"><ellipse cx="960" cy="900" rx="820" ry="110" fill="${C.kraft}"/></g>`, 1);
    const mgrs = [[380, 'co2', C.navy], [660, 'exec', C.navy2], [1260, 'co1', C.sage2], [1540, 'grey', C.kraft2]].map(([x, k, col]) => F.puppet(S, S.mid, k, x, 860, 1.15, { mood: 'smile', look: { top: col } }));
    const boss = F.puppet(S, S.mid, 'manager', 960, 860, 1.25, { mood: 'smile' });
    [...mgrs, boss].forEach((m, i) => m.nod(tn - 0.2 + i * 0.03, 341.5, 7, 1.6));
    for (let x = tn; x < 341; x += 0.62) F.sfx(x, 'boing', 0.15);
    const tp = w('panicking.', 341) - 0.6;
    boss.mood(tp, 'shock').shakeHead(tp + 0.2, tp + 0.9);
    const sw = F.prop(S.front, `<g fill="#9CC3D8"><path d="M0 0 q12 22 0 30 q-12 -8 0 -30z"/><path d="M60 20 q12 22 0 30 q-12 -8 0 -30z"/></g>`, 1050, 420, 120, 80, 9); F.hidden(sw); F.show(sw, tp);
    const np = F.hand(S.ui, 'nodding… secretly panicking', 960, 1010, 64, C.navy, -1); F.in(np, tn + 0.3, 'none', { dur: 0.35, sfx: false });
    S.cam(tn - 0.6, 960, 600, 1.0, 1.4).cam(tp - 0.2, 960, 500, 1.35, 0.8);
  }

  // ===== hide your tricks = a cost they can cut (341.58 – 344.94) =====
  {
    const S = F.shot(341.58, 344.94, { cam: [960, 560, 1.1] });
    F.set(S.back, `<rect x="-800" y="900" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const you = F.puppet(S, S.mid, 'you', 900, 940, 1.6, { mood: 'worry', armL: 'in', armR: 'in' });
    const tag = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-110 -60 L90 -60 L140 0 L90 60 L-110 60Z" fill="${C.kraft}"/><circle cx="90" cy="0" r="10" fill="${C.paper}"/>${T('COST', -20, 20, 54, C.tomato2)}</g>`, 1180, 520, 300, 150, 6);
    F.in(tag, w('cost', 343) - 0.3, 'right', { dur: 0.35, sfx: 'paperslide' });
    const sc = F.prop(S.front, K.scissors(), 1360, 360, 130, 210, 8);
    F.fromTo(sc, w('cut.', 344) - 0.5, { opacity: 0, x: 300, y: -300, rotation: 40 }, { opacity: 1, x: 0, y: 0, rotation: 20 }, 0.45, 'power2.out');
    F.every(S, (G) => { const q = G - w('cut.', 344); sc.style.scale = q > 0 && q < 0.6 ? String(1 + 0.15 * Math.sin(q * 40)) : '1'; }); F.sfx(w('cut.', 344), 'snip', 0.8);
    const ht = F.hand(S.ui, 'hide your tricks →', 520, 220, 70, C.navy, -3); F.in(ht, w('hide', 341), 'none', { dur: 0.3, sfx: false });
    you.mood(w('cut.', 344), 'shock');
  }

  // ===== share one trick every Friday → your manager's guide (344.94 – 349.02) =====
  {
    const S = F.shot(344.94, 349.02, { bg: '#EDE4D0', cam: [960, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.sage}" opacity=".35" filter="url(#cutflat)"/><path d="M-200 960 C400 900 900 1000 1500 930 S2200 900 2600 950" stroke="${C.tomato}" stroke-width="10" stroke-dasharray="26 20" fill="none"/>`);
    const cal = F.prop(S.back, K.calendar('FRIDAY', 'TRICK', '#1'), 1560, 300, 300, 320, 2); F.in(cal, w('Friday,', 346) - 0.3, 'right', { dur: 0.4, sfx: 'flip' });
    const you = F.puppet(S, S.mid, 'you', 620, 920, 1.4, { mood: 'smile', armR: 'fwd' }), mgr = F.puppet(S, S.mid, 'manager', 960, 920, 1.4, { mood: 'worry', flip: true });
    const sl = F.prop(S.mid, slip('summarize emails'), 790, 620, 240, 90, 6); F.in(sl, w('share', 345) - 0.1, 'none', { dur: 0.3, sfx: 'pop' });
    F.to(sl, w('small', 345), { x: 80, rotation: 6 }, 0.4); mgr.arm(w('small', 345) + 0.2, 'r', 'fwd', 0.3).mood(w('trick', 345) + 0.2, 'happy');
    const tg = w('guide.', 348) - 0.6;
    you.arm(tg - 0.4, 'r', 'point', 0.4).walk(tg - 0.3, tg + 1.0).move(tg - 0.3, 900, 920, 1.3); mgr.walk(tg - 0.2, tg + 1.0).move(tg - 0.2, 1200, 920, 1.2);
    const gd = F.label(S.ui, "your manager's guide", 960, 160, { size: 86, bg: C.sage2, rot: -1.5, z: 20 }); F.in(gd, tg, 'below', { dur: 0.4 });
    S.cam(tg - 0.4, 1060, 600, 1.0, 1.4);
  }

  // ===== show her: summarize long email threads, clean up messy notes (349.02 – 354.56) =====
  {
    const S = F.shot(349.02, 354.56, { bg: '#E3D7C1', cam: [960, 540, 1.0] });
    const mk = (x, title) => F.html(S.mid, `<div style="width:760px;height:760px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter;color:#1E2A44">${F.winBar(title)}<div class="b" style="padding:26px 32px"></div></div>`, x, 170, 760, 760, 3);
    const A = mk(140, 'Re: Re: Re: Fwd: Q3 plan (24)'), B = mk(1020, 'meeting notes.txt');
    const ab = A.querySelector('.b'), bb = B.querySelector('.b');
    ab.innerHTML = [...Array(9)].map((_, i) => `<div class="em" style="border-bottom:2px solid #E6DAC2;padding:10px 0;font:500 24px Inter;color:#5a6378"><b style="color:#1E2A44">${['Ana', 'Raj', 'Lee', 'Sam', 'Mo', 'Ana', 'Raj', 'Lee', 'Sam'][i]}</b> — ${['thoughts on the plan?', 're: plan, see below', 'agree with Raj but…', 'looping in Mo', 'two questions', 'circling back', '+1', 'what about budget?', 'any update?'][i]}</div>`).join('') + `<div class="sum" style="margin-top:6px;background:#E5EFE3;border-radius:14px;padding:18px 20px;font:600 28px/1.5 Inter;color:#1E2A44;opacity:0">✓ Plan approved<br>✓ Budget: +5%<br>✓ Owner: Raj, due Fri</div>`;
    bb.innerHTML = `<div class="mess" style="font:700 38px/1.3 Caveat;color:#5a6378;transform:rotate(-2deg)">mtg w/ sales?? → maybe tues<br>NEED numbers!!! (who)<br>budget → ask Ana<br>~~launch~~ moved?? july</div><div class="clean" style="font:600 30px/1.7 Inter;opacity:0;margin-top:10px">• Sales meeting: Tuesday<br>• Numbers: Raj, by Mon<br>• Budget: ask Ana<br>• Launch: moved to July</div>`;
    const tsu = w('summarize', 349), tc = w('clean', 352);
    F.in(A, 349.05, 'left', { dur: 0.45 });
    const ems = [...ab.querySelectorAll('.em')];
    ems.forEach((e, i) => F.to(e, tsu + 0.4 + i * 0.06, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 }, 0.3, 'power2.in')); F.sfx(tsu + 0.4, 'accordion', 0.6);
    F.to(ab.querySelector('.sum'), tsu + 1.1, { opacity: 1 }, 0.4); F.sfx(tsu + 1.2, 'chime', 0.4);
    F.in(B, tc - 0.6, 'right', { dur: 0.45 });
    F.to(bb.querySelector('.mess'), tc + 0.4, { opacity: 0, y: -20 }, 0.3); F.to(bb.querySelector('.clean'), tc + 0.6, { opacity: 1, y: -170 }, 0.4); F.sfx(tc + 0.6, 'settle', 0.5);
    const sh = F.hand(S.ui, 'show her', 960, 1000, 72, C.tomato2, -3); F.in(sh, 349.1, 'none', { dur: 0.3, sfx: false });
    S.cam(349.05, 540, 560, 1.15, 0.01).cam(tc - 0.7, 1400, 560, 1.15, 0.9);
  }

  // ===== nobody fires the person who makes them look smart (354.56 – 358.00) =====
  {
    const S = F.shot(354.56, 358.00, { bg: '#E8DCC6', cam: [960, 560, 1.0] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><g filter="url(#cut)"><rect x="160" y="200" width="560" height="360" fill="${C.white}"/><path d="M200 500 l120 -110 l100 70 l160 -180" stroke="${C.sage2}" stroke-width="12" fill="none"/></g>`);
    const mgr = F.puppet(S, S.mid, 'manager', 840, 920, 1.4, { mood: 'happy', armL: 'point' });
    const execs = [1300, 1520, 1740].map((x, i) => F.puppet(S, S.mid, i === 1 ? 'exec' : 'grey', x, 900, 1.15, { mood: 'smile', flip: true, look: i === 1 ? {} : { top: C.navy2, skin: C.skin3, hair: C.hair1 } }));
    execs.forEach((e) => e.nod(355, 357.8, 5, 1.4));
    const star = F.prop(S.front, K.star(70), 840, 330, 180, 180, 9);
    const tsm = w('smart', 355);
    F.fromTo(star, tsm, { opacity: 0, scale: 0.2, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0 }, 0.45, 'power3.out'); F.sfx(tsm, 'shimmer', 0.6);
    const you = F.puppet(S, S.front, 'you', 220, 1180, 1.4, { mood: 'smile' }); you.enter(354.6, 'left', 0.5);
    mgr.tilt(w('management.', 357) - 0.3, -8).mood(w('management.', 357) - 0.1, 'wink'); F.sfx(w('management.', 357), 'wink', 0.5);
    const nf = F.label(S.ui, 'look smart to upper management', 960, 110, { size: 64, bg: C.navy, rot: -1, z: 20 }); F.in(nf, w('fires', 354), 'below', { dur: 0.4 });
    S.cam(354.6, 1000, 560, 1.06, 2.6, 'inOutSine');
    F.miniSnap(S, 6, w('management.', 357) - 0.6, 1.1);
  }
  F.done();
})();
