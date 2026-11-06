// c02 — Method 2: become the editor, not the writer (82.46 – 143.24)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== the second step (82.46 – 84.80) =====
  {
    const S = F.shot(82.46, 84.80, { cam: [960, 540, 1.0] });
    const tag = F.prop(S.mid, P.tag(-180, -117, 0, '02', C.white, 1.8), 960, 500, 480, 360, 3);
    F.fromTo(tag, 82.5, { opacity: 0, x: 1200, rotation: 20 }, { opacity: 1, x: 0, rotation: -3 }, 0.7, 'power3.out'); F.sfx(82.5, 'card', 0.6);
    const l = F.hand(S.mid, 'step two', 960, 760, 84, C.tomato2, -3); F.in(l, w('second', 83), 'none', { dur: 0.4, sfx: false });
    const sh = F.shield(S.ui, 1730, 300, 0.36, 1, 10); F.in(sh.el, 82.7, 'right', { dur: 0.5, sfx: false });
    S.cam(82.5, 960, 560, 1.08, 2.2, 'inOutSine');
  }

  // ===== the typing race (84.80 – 90.46) =====
  {
    const S = F.shot(84.80, 90.46, { cam: [760, 600, 1.0] });
    let flag = ''; for (let r = 0; r < 8; r++) for (let c = 0; c < 2; c++) flag += `<rect x="${3060 + c * 30}" y="${560 + r * 50}" width="30" height="50" fill="${(r + c) % 2 ? C.navy : C.white}"/>`;
    F.set(S.back, `<rect x="-800" y="-300" width="5200" height="900" fill="#E3EAE6"/><g filter="url(#cutflat)">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M${-400 + i * 500} 600 l140 -260 l140 260z" fill="${i % 2 ? '#C6D3CD' : '#B4C4BD'}"/>`).join('')}</g>
      <rect x="-800" y="560" width="5200" height="700" fill="${C.kraft}" filter="url(#cutflat)"/><path d="M-800 800 H4400" stroke="${C.white}" stroke-width="10" stroke-dasharray="60 40"/><g filter="url(#cutflat)">${flag}</g>`);
    const fin = F.label(S.back, 'FINISH', 3075, 520, { size: 40, bg: C.navy, z: 3 });
    // racers
    const ai = F.puppet(S, S.mid, 'intern', 400, 690, 1.05, { mood: 'happy', armL: 'type', armR: 'type' });
    const tw = F.prop(ai.root, `<g filter="url(#cut)"><rect x="-120" y="-40" width="240" height="80" rx="12" fill="${C.navy}"/><rect x="-96" y="-90" width="192" height="56" fill="${C.navy2}"/><rect x="-60" y="-120" width="120" height="40" fill="${C.white}"/><circle cx="-80" cy="50" r="22" fill="${C.grey2}"/><circle cx="80" cy="50" r="22" fill="${C.grey2}"/></g>`, 0, -30, 280, 220, 5);
    const you = F.puppet(S, S.mid, 'you', 380, 1000, 1.15, { mood: 'angry', armL: 'type', armR: 'type' });
    const cart = F.prop(you.root, `<g filter="url(#cut)"><rect x="-150" y="-40" width="300" height="34" rx="6" fill="${C.kraft2}"/><rect x="-130" y="-6" width="260" height="70" fill="${C.kraft}"/><circle cx="-100" cy="80" r="22" fill="${C.grey2}"/><circle cx="100" cy="80" r="22" fill="${C.grey2}"/><path d="M30 -40 L50 -150 L200 -150 L180 -40Z" fill="${C.navy2}"/></g>`, 0, -120, 440, 280, 5);
    const t0 = w('outrun', 85) - 0.6, tl2 = w('lose', 88);
    you.walk(t0, tl2 + 0.2).move(t0, 2300, 1000, tl2 + 0.2 - t0, 'power1.inOut');
    ai.move(t0, 3400, 690, tl2 + 0.6 - t0, 'power2.in');
    F.every(S, (G) => { if (G < tl2 + 0.2) { const a = Math.sin(G * 40) * 6; you.armL.wob.style.transform = `rotate(${a}deg)`; you.armR.wob.style.transform = `rotate(${-a}deg)`; } });
    for (let x = t0; x < tl2; x += 0.08) F.sfx(x, 'key', 0.12);
    F.sfx(t0, 'rumble', 0.5);
    const smoke = F.prop(you.root, `<g filter="url(#cut)" opacity=".9"><circle cx="0" cy="0" r="46" fill="${C.grey}"/><circle cx="50" cy="-40" r="56" fill="${C.grey}"/><circle cx="110" cy="-6" r="40" fill="${C.grey}"/></g>`, 110, -300, 300, 220, 6);
    F.fromTo(smoke, tl2 + 0.2, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1 }, 0.6); F.sfx(tl2 + 0.2, 'deflate', 0.7); F.sfx(tl2 - 0.2, 'ding', 0.6);
    you.mood(tl2 + 0.2, 'sad').arms(tl2 + 0.2, 'down', 'down', 0.4).slump(tl2 + 0.3, 10);
    const lt = F.label(S.ui, 'you lose. every time.', 960, 180, { size: 88, bg: C.navy, rot: -1.5, z: 20 }); F.in(lt, w('every', 89), 'below', { dur: 0.4 });
    S.cam(t0, 1300, 640, 0.95, 1.6, 'inOutSine').cam(t0 + 1.6, 2350, 640, 0.95, 1.4, 'inOutSine').cam(tl2 + 0.1, 2550, 680, 0.9, 1.0);
  }

  // ===== chapter card 2 (90.46 – 94.88) =====
  {
    const S = F.shot(90.46, 94.88);
    const c = F.chapter(S, w('number', 90) - 0.2, 2, 'EDITOR, NOT WRITER', 'let the machine type. you edit.');
    const pen = F.prop(S.front, `<g filter="url(#cut)" transform="rotate(35)"><rect x="-16" y="-120" width="32" height="200" rx="10" fill="${C.tomato}"/><path d="M-16 80 L0 120 L16 80Z" fill="${C.kraft}"/><path d="M-5 108 L0 120 L5 108Z" fill="${C.navy}"/></g>`, 700, 640, 200, 280, 9);
    const te = w('editor', 92);
    F.fromTo(pen, te - 0.3, { opacity: 0, x: 600, y: -200 }, { opacity: 1, x: 0, y: 0 }, 0.4); F.to(pen, te + 0.1, { x: 260 }, 0.35, 'power2.inOut'); F.to(pen, w('writer.', 93), { x: 900, y: -300, opacity: 0 }, 0.5, 'power2.in');
    F.sfx(te + 0.1, 'scribble', 0.6);
    const ul = F.html(S.front, '', 420, 805, 300, 8, 8, { background: C.tomato, transformOrigin: '0 50%' }); F.fromTo(ul, te + 0.1, { scaleX: 0 }, { scaleX: 1 }, 0.35, 'power2.out');
  }

  // ===== refuse; cheating; training your replacement (94.88 – 102.82) =====
  {
    const S = F.shot(94.88, 102.82, { bg: '#ECE0CA', cam: [800, 600, 1.1] });
    F.set(S.back, `<rect x="-600" y="800" width="3200" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const you = F.puppet(S, S.mid, 'you', 560, 900, 1.45, { mood: 'neutral', armL: 'down', armR: 'down' });
    F.set(S.mid, P.desk(260, 760, 640), 4);
    const lap = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-110 0 L-100 -140 L120 -140 L110 0Z" fill="${C.navy2}"/><rect x="-130" y="-6" width="260" height="12" rx="4" fill="${C.navy}"/><circle cx="5" cy="-70" r="16" fill="${C.tomato}"/></g>`, 720, 700, 280, 200, 5);
    const tr = w('refuse', 95);
    you.arm(tr - 0.1, 'r', 'fwd', 0.3).arm(tr + 0.5, 'r', 'in', 0.3).arm(tr + 0.5, 'l', 'in', 0.3).mood(tr, 'angry').tilt(tr + 0.4, -6);
    F.to(lap, tr + 0.15, { x: 90, rotation: 3 }, 0.5, 'power2.out'); F.sfx(tr + 0.15, 'paperslide', 0.5);
    const nm = F.html(S.ui, `<div style="display:flex;gap:16px"><span style="background:#1E2A44;color:#fff;font:700 54px Inter;padding:14px 26px;border-radius:16px">Claude</span><span style="background:#1E2A44;color:#fff;font:700 54px Inter;padding:10px 18px;border-radius:12px">ChatGPT</span></div>`, 1060, 150, 0, 0, 20);
    F.in(nm, w('Claude', 96) - 0.1, 'below', { dur: 0.35, sfx: 'pop' });
    const no = F.prop(S.ui, `<g filter="url(#cut)"><circle r="120" fill="none" stroke="${C.tomato}" stroke-width="22"/><path d="M-84 84 L84 -84" stroke="${C.tomato}" stroke-width="22"/></g>`, 1330, 196, 280, 280, 21);
    F.in(no, w('because', 97), 'none', { dur: 0.3, sfx: 'stamp', gain: 0.5 }); F.out(no, w('feel', 98) + 0.3, 'above'); F.out(nm, w('feel', 98) + 0.3, 'above');
    // thought bubble
    const tb = F.prop(S.front, K.thought(760, 440), 1340, 400, 840, 560, 8);
    const tc = w('cheating,', 99);
    F.fromTo(tb, tc - 0.5, { opacity: 0, scale: 0.3, transformOrigin: '10% 100%' }, { opacity: 1, scale: 1 }, 0.45, 'power3.out'); F.sfx(tc - 0.5, 'pop', 0.6);
    const bub = document.createElement('div'); Object.assign(bub.style, { position: 'absolute', left: '960px', top: '180px', width: '760px', height: '440px', zIndex: 9, overflow: 'hidden', borderRadius: '50%' }); S.front.appendChild(bub); F.hidden(bub); F.fromTo(bub, w('cheating,', 99) - 0.4, { opacity: 0 }, { opacity: 1 }, 0.3);
    const fake = { mid: bub };
    const teacher = F.puppet(S, bub, 'teacher', 250, 470, 1.0, { mood: 'angry', armR: 'high' });
    teacher.wave(tc - 0.2, tc + 1.6, 'r');
    const ch = F.label(bub, 'CHEATING?', 520, 200, { size: 64, bg: C.tomato, rot: -4 });
    F.fromTo([teacher.root, ch], tc - 0.3, { opacity: 0 }, { opacity: 1 }, 0.3);
    you.mood(tc - 0.3, 'worry').arms(tc - 0.3, 'down', 'down', 0.4).tilt(tc - 0.3, 6);
    const trp = w('replacement.', 101);
    F.to([teacher.root, ch], trp - 0.9, { opacity: 0, y: 60 }, 0.3);
    const twin = F.puppet(S, bub, 'intern', 380, 480, 0.95, { mood: 'happy', color: C.navy, badge: `<circle cx="-4" cy="-60" r="4" fill="${C.kraft}"/>`, armR: 'out' });
    F.set(bub, P.desk(180, 380, 400) + P.mug(450, 380, 0.8), 5);
    F.fromTo(twin.root, trp - 0.7, { opacity: 0, x: 300 }, { opacity: 1, x: 0 }, 0.5, 'power3.out'); F.sfx(trp - 0.6, 'sting', 0.5);
    twin.wave(trp, trp + 1.2, 'r');
    const ry = F.hand(bub, 'your replacement?', 560, 120, 54, C.tomato2, -3); F.in(ry, trp, 'none', { dur: 0.35, sfx: false });
    you.mood(trp, 'shock');
    S.cam(tc - 0.6, 1060, 520, 1.0, 1.0);
  }

  // ===== rewriting the same two-line email four times; coffee gets cold (102.82 – 108.04) =====
  {
    const S = F.shot(102.82, 108.04, { bg: '#E3D7C1', cam: [900, 480, 1.12] });
    const L = F.laptop(S.mid, 900, 540, 0.95);
    L.screen.innerHTML = `${F.winBar('New message')}<div style="padding:30px 46px;font:500 34px/1.6 Inter"><div style="color:#8a8f9c;border-bottom:2px solid #E6DAC2;padding-bottom:10px">To: <b style="color:#1E2A44">Sam</b> &nbsp; Subject: <b style="color:#1E2A44">Quick update</b></div><div class="body" style="margin-top:24px;min-height:200px"></div></div>`;
    const body = L.screen.querySelector('.body');
    const drafts = ['Hi Sam, just a quick note on the report.', 'Hey Sam! Quick update on the report:', 'Hi Sam, hope you are well. About the report', 'Sam, the report. Quick note below.'];
    const t0 = w('rewriting', 103) - 0.2, t1 = w('times', 105) + 0.3, seg = (t1 - t0) / 4;
    F.every(S, (G) => { const k = Math.min(3, Math.max(0, Math.floor((G - t0) / seg))); const q = (G - t0 - k * seg) / seg; const txt = drafts[k];
      let n = G < t0 ? 0 : q < 0.65 || k === 3 ? Math.round(txt.length * Math.min(1, q / 0.55)) : Math.round(txt.length * (1 - (q - 0.65) / 0.35));
      body.innerHTML = txt.slice(0, Math.max(0, n)) + '<span style="display:inline-block;width:4px;height:36px;background:#E4572E;vertical-align:-6px"></span>'; });
    for (let x = t0; x < t1; x += 0.09) F.sfx(x, 'key', 0.12);
    const tally = F.prop(S.front, P.sticky(0, 0, -5, '', 40, C.sticky, 230), 1480, 300, 270, 270, 8); F.in(tally, t0 + 0.3, 'none', { dur: 0.3, sfx: 'sticky' });
    const marks = [0, 1, 2, 3].map((i) => { const m = F.prop(S.front, `<path d="M0 -50 L0 50" stroke="${C.navy}" stroke-width="10" stroke-linecap="round" filter="url(#cutflat)"/>`, 1420 + i * 40, 300, 30, 120, 9); F.in(m, t0 + seg * (i + 0.9), 'none', { dur: 0.15, sfx: 'scribble', gain: 0.25 }); return m; });
    const mug = F.prop(S.front, P.mug(0, 0, 1.6, false), 1580, 860, 220, 260, 8);
    const steam = F.prop(S.front, `<path d="M-14 0 q-12 -34 6 -60 M16 2 q-12 -36 6 -66" stroke="${C.white}" stroke-width="7" fill="none" stroke-linecap="round"/>`, 1570, 660, 80, 120, 9);
    const tcold = w('cold.', 106);
    F.to(steam, w('coffee', 106), { opacity: 0, y: -30 }, 0.8);
    const snow = F.prop(S.front, `<g stroke="#9CC3D8" stroke-width="8" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M0 -34 L0 34" transform="rotate(${a})"/>`).join('')}</g>`, 1580, 640, 90, 90, 10);
    F.in(snow, tcold, 'none', { dur: 0.4, sfx: 'frost' });
    F.every(S, (G) => { snow.style.rotate = (G * 30) + 'deg'; });
    const k4 = F.label(S.ui, '4 times', 1480, 110, { size: 60, bg: C.tomato, rot: 3, z: 20 }); F.in(k4, w('four', 105), 'below', { dur: 0.35 });
    S.cam(w('while', 106) - 0.2, 1300, 700, 1.25, 1.0);
  }

  // ===== across every big industry, companies change how they measure work (108.04 – 112.80) =====
  {
    const S = F.shot(108.04, 112.80, { bg: '#E4EAE6', cam: [960, 560, 1.3] });
    F.set(S.back, `<rect x="-600" y="860" width="3200" height="500" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const B = [['BANK', 360, 360, C.navy2], ['HOSPITAL', 800, 300, C.sage2], ['FACTORY', 1240, 420, C.kraft2], ['LAW FIRM', 1660, 340, C.tomato2]];
    const tm = w('measure', 111);
    B.forEach(([n, x, top, col], i) => {
      const b = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-170" y="${top - 860}" width="340" height="${860 - top}" fill="${col}"/>${[...Array(4)].map((_, r) => [0, 1, 2].map((c) => `<rect x="${-120 + c * 90}" y="${top - 860 + 120 + r * 90}" width="60" height="50" fill="${C.white}" opacity=".8"/>`).join('')).join('')}<rect x="-130" y="${top - 860 + 26}" width="260" height="60" fill="${C.white}"/>${T(n, 0, top - 860 + 70, 36, C.navy)}</g>`, x, 860, 360, 1000, 2, '50% 100%');
      F.fromTo(b, 108.1 + i * 0.12, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1 }, 0.5, 'power3.out'); F.sfx(108.1 + i * 0.12, 'paperslide', 0.35);
      const s1 = F.label(S.front, 'HOURS TYPED', x, top - 70, { size: 34, bg: C.grey2, rot: i % 2 ? 3 : -3 });
      const s2 = F.label(S.front, 'QUALITY', x, top - 70, { size: 40, bg: C.tomato, rot: i % 2 ? -3 : 3 });
      F.in(s1, w('companies', 110) + i * 0.08, 'below', { dur: 0.3, sfx: false }); F.out(s1, tm + i * 0.12, 'none', { dur: 0.2 }); F.fromTo(s2, tm + i * 0.12, { opacity: 0, rotationX: 90 }, { opacity: 1, rotationX: 0 }, 0.3); F.sfx(tm + i * 0.12, 'flip', 0.4);
    });
    S.cam(108.2, 1000, 540, 0.95, 2.0, 'inOutCubic');
  }

  // ===== the eager intern (112.80 – 121.00) =====
  {
    const S = F.shot(112.80, 121.00, { bg: '#EEDFCB', cam: [960, 560, 1.15] });
    F.set(S.back, `<rect x="-600" y="820" width="3200" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    F.set(S.mid, P.desk(480, 740, 1000), 4);
    const ai = F.puppet(S, S.mid, 'intern', 960, 750, 1.7, { mood: 'happy', armR: 'wave' });
    const tE = w('eager', 113);
    ai.enter(112.85, 'below', 0.5).wave(tE - 0.3, tE + 1.2, 'r');
    const nm = F.label(S.ui, 'EAGER INTERN', 960, 1000, { size: 76, bg: C.tomato, rot: -1, z: 20 }); F.in(nm, tE, 'below', { dur: 0.4 });
    F.out(nm, w('read', 115) - 0.1, 'below');
    // read the whole internet: pages pour into the head
    const tr = w('internet', 116) - 0.6;
    for (let i = 0; i < 14; i++) { const kind = i % 3; const pg = F.prop(S.front, kind === 0 ? P.sheet(0, 0, 0, 0.45) : kind === 1 ? `<g filter="url(#cut)"><rect x="-40" y="-52" width="80" height="104" fill="${C.sage}"/><rect x="-30" y="-40" width="60" height="10" fill="${C.white}"/></g>` : `<g filter="url(#cut)"><rect x="-50" y="-36" width="100" height="72" rx="6" fill="${C.white}"/><rect x="-50" y="-36" width="100" height="16" fill="${C.navy2}"/></g>`, 300 + (i * 137) % 1300, -100, 140, 140, 7);
      const tt = tr + i * 0.11; F.fromTo(pg, tt, { opacity: 1, x: 0, y: 0, rotation: i * 40 }, { x: 960 - (300 + (i * 137) % 1300), y: 300, rotation: 0, scale: 0.2, opacity: 0.0 }, 0.65, 'power2.in'); F.hidden(pg); if (i % 3 === 0) F.sfx(tt, 'flutter', 0.3); }
    ai.mood(tr, 'shock').mood(tr + 1.6, 'neutral');
    const li = F.hand(S.ui, 'read the whole internet', 420, 160, 64, C.navy, -3); F.in(li, tr + 0.2, 'none', { dur: 0.35, sfx: false });
    // ten coffees
    const tc = w('drank', 117);
    for (let i = 0; i < 10; i++) { const x = 1240 + (i % 4) * 66, y = 740 - Math.floor(i / 4) * 96; const c = F.prop(S.mid, K.cup(), x, y - 48, 80, 120, 5); F.in(c, tc + i * 0.1, 'above', { dur: 0.25, dist: 0.5, sfx: 'clink', gain: 0.2 }); }
    const lc = F.hand(S.ui, '10 cups of coffee', 1500, 160, 64, C.navy, 3); F.in(lc, tc + 0.2, 'none', { dur: 0.35, sfx: false });
    ai.mood(tc + 0.6, 'twitch').shakeHead(tc + 0.8, tc + 1.6);
    // zero common sense: staples a sandwich to the report
    const tz = w('zero', 119);
    const rep = F.prop(S.mid, P.sheet(0, 0, -6, 1.1), 700, 640, 220, 260, 6);
    const sand = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-70 -20 Q0 -60 70 -20 L60 10 L-60 10Z" fill="${C.kraft}"/><rect x="-66" y="10" width="132" height="14" fill="${C.sage}"/><rect x="-62" y="24" width="124" height="12" fill="${C.tomato}"/><path d="M-60 36 Q0 56 60 36 L60 46 L-60 46Z" fill="${C.kraft}"/></g>`, 700, 610, 180, 140, 7);
    F.in(rep, tz - 1.0, 'left', { dur: 0.4, sfx: 'paperslide' }); F.fromTo(sand, tz - 0.6, { opacity: 0, y: -300, rotation: 30 }, { opacity: 1, y: 0, rotation: -8 }, 0.45, 'power2.out');
    const stap = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-80" y="-16" width="160" height="32" rx="8" fill="${C.navy}"/><rect x="-80" y="10" width="160" height="16" rx="6" fill="${C.grey2}"/></g>`, 780, 560, 200, 80, 8, '100% 50%');
    F.in(stap, tz - 0.3, 'right', { dur: 0.3, sfx: false }); ai.arm(tz - 0.4, 'l', 'fwd', 0.3).mood(tz - 0.4, 'proud');
    F.to(stap, tz + 0.3, { rotation: 18 }, 0.12, 'power2.in'); F.to(stap, tz + 0.42, { rotation: 0 }, 0.2); F.sfx(tz + 0.42, 'staple', 0.8); F.sfx(tz + 0.55, 'boing', 0.5);
    const zc = F.label(S.ui, 'zero common sense', 960, 1000, { size: 70, bg: C.navy, rot: -1, z: 20 }); F.in(zc, w('common', 119), 'below', { dur: 0.4 });
    S.cam(tr - 0.2, 960, 420, 1.05, 1.0).cam(tc - 0.3, 1200, 540, 1.2, 1.0).cam(tz - 1.1, 820, 560, 1.25, 1.0);
  }

  // ===== they pay you to fix the intern's mistakes (121.00 – 126.92) =====
  {
    const S = F.shot(121.00, 126.92, { cam: [960, 560, 1.0] });
    const rep = F.prop(S.mid, P.sheet(0, 0, -4, 2.6), 760, 560, 480, 600, 3);
    F.in(rep, 121.05, 'below', { dur: 0.5 });
    const rl = F.hand(S.mid, 'rough draft', 760, 230, 70, C.navy, -4); F.in(rl, 121.3, 'none', { dur: 0.35, sfx: false });
    const tag = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-130 -70 L120 -70 L170 0 L120 70 L-130 70Z" fill="${C.kraft}"/><circle cx="120" cy="0" r="12" fill="${C.paper}"/></g>`, 1320, 460, 360, 180, 5, '90% 50%');
    const price = F.label(tag, '$$$', 150, 90, { bg: 'none', size: 80, color: C.navy, font: "'Archivo Black'", weight: 400, flat: true });
    F.in(tag, w('pay', 121), 'right', { dur: 0.45, sfx: 'paperslide' });
    const ta = w('anymore.', 123);
    const strike = F.html(tag, '', 70, 85, 160, 10, 3, { background: C.tomato, transformOrigin: '0 50%' }); F.fromTo(strike, ta - 0.1, { scaleX: 0 }, { scaleX: 1 }, 0.25); F.sfx(ta - 0.1, 'scribble', 0.5);
    const zero = F.label(tag, '$0', 150, 160, { bg: 'none', size: 60, color: C.tomato2, font: "'Archivo Black'", weight: 400, flat: true }); F.in(zero, ta + 0.2, 'none', { dur: 0.3, sfx: false });
    F.every(S, (G) => { tag.style.rotate = (4 * Math.sin(G * 2)) + 'deg'; });
    // the intern's mistake: sandwich stapled on; you circle it
    const sand = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-70 -20 Q0 -60 70 -20 L60 10 L-60 10Z" fill="${C.kraft}"/><rect x="-66" y="10" width="132" height="14" fill="${C.sage}"/><rect x="-62" y="24" width="124" height="12" fill="${C.tomato}"/><path d="M-60 36 Q0 56 60 36 L60 46 L-60 46Z" fill="${C.kraft}"/></g>`, 820, 640, 180, 140, 6);
    const tm = w('fix', 124);
    F.fromTo(sand, tm - 0.6, { opacity: 0, y: -400, rotation: 40 }, { opacity: 1, y: 0, rotation: -8 }, 0.4, 'power2.out'); F.sfx(tm - 0.25, 'staple', 0.5);
    const you = F.puppet(S, S.front, 'you', 260, 1150, 1.35, { mood: 'sly', armR: 'down' }); you.enter(tm - 0.4, 'left', 0.5).arm(tm, 'r', 'point', 0.35);
    const circ = F.prop(S.front, `<ellipse rx="140" ry="90" fill="none" stroke="${C.tomato}" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100" transform="rotate(-8)"/>`, 820, 650, 320, 220, 9);
    const ce = circ.querySelector('ellipse'); F.every(S, (G) => { ce.setAttribute('stroke-dasharray', `${(STAGE.seg(G, tm + 0.3, tm + 0.9) * 100).toFixed(1)} 100`); });
    F.sfx(tm + 0.3, 'scribble', 0.6);
    const tmk = w('mistakes.', 125);
    F.to(strike, tmk, { opacity: 0 }, 0.2); F.to(zero, tmk, { opacity: 0 }, 0.2);
    const pay = F.label(tag, '$$$$', 150, 160, { bg: 'none', size: 70, color: C.sage2, font: "'Archivo Black'", weight: 400, flat: true }); F.in(pay, tmk + 0.1, 'none', { dur: 0.35, sfx: 'kaching', gain: 0.7 });
    F.to(price, tmk, { opacity: 0 }, 0.2);
    you.mood(tmk + 0.1, 'happy');
    S.cam(tm - 0.5, 820, 600, 1.12, 1.0);
  }

  // ===== blank doc → ugly first draft → you edit it (126.92 – 143.24) =====
  {
    const S = F.shot(126.92, 143.24, { bg: '#E3D7C1', cam: [960, 540, 1.0] });
    const L = F.laptop(S.mid, 960, 540, 1.0);
    L.screen.innerHTML = `${F.winBar('Untitled document')}<div style="padding:40px 120px;font:500 36px/1.55 Inter;color:#1E2A44"><div class="title" style="font:800 50px Inter;margin-bottom:18px;height:62px"></div><div class="lines"></div></div>`;
    const title = L.screen.querySelector('.title'), lines = L.screen.querySelector('.lines');
    const draft = ['Our team improved customer onboarding this quarter.', 'Response times dropped by <span class="fact">47%</span> across all regions.', 'In conclusion, synergy was leveraged to delve into outcomes.', 'We recommend continuing this approach next quarter.', 'Key risks include timing, budget, and staffing.'];
    const ls = draft.map((t) => { const d = document.createElement('div'); d.innerHTML = t; d.style.marginBottom = '14px'; d.style.opacity = 0; lines.appendChild(d); return d; });
    const tb = w('blinking', 127);
    F.every(S, (G) => { const on = G < tb - 0.5 ? true : Math.floor(G * 2.2) % 2 === 0; title.innerHTML = G < w('let', 130) ? `<span style="display:inline-block;width:5px;height:50px;background:#1E2A44;vertical-align:-8px;opacity:${on ? 1 : 0}"></span>` : 'Q3 Update'; });
    const ystare = F.puppet(S, S.front, 'you', 1690, 1090, 1.2, { mood: 'tired', flip: true }); ystare.enter(tb - 0.6, 'right', 0.5).exit(w('let', 130), 'right', 0.4);
    const blank = F.hand(S.ui, 'blank page', 380, 960, 70, C.tomato2, -3); F.in(blank, w('blank', 128), 'none', { dur: 0.3, sfx: false }); F.out(blank, w('let', 130), 'below');
    const tl3 = w('ugly', 131) - 0.2;
    ls.forEach((d, i) => { F.fromTo(d, tl3 + i * 0.22, { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, 0.2); F.sfx(tl3 + i * 0.22, 'flutter', 0.25); });
    const tm = F.prop(S.ui, `<g filter="url(#cut)"><rect x="-22" y="-120" width="44" height="30" rx="6" fill="${C.navy}"/><circle r="100" fill="${C.tomato}"/><circle r="80" fill="${C.white}"/></g>`, 1680, 230, 240, 280, 20);
    const tmN = F.label(tm, '0:00', 120, 152, { bg: 'none', size: 44, font: "'Archivo Black'", weight: 400, color: C.navy, flat: true });
    F.in(tm, tl3 - 0.3, 'right', { dur: 0.35 }); F.count(S, tmN.box, tl3, w('seconds.', 132) + 0.3, 0, 10, (v) => '0:' + String(Math.round(v)).padStart(2, '0'));
    F.sfx(w('seconds.', 132) + 0.3, 'ding', 0.5); F.out(tm, w('Then', 133), 'right');
    const ug = F.label(S.ui, 'UGLY FIRST DRAFT', 960, 980, { size: 80, bg: C.tomato, rot: -1.5, z: 20 }); F.in(ug, w('ugly', 131), 'below', { dur: 0.4 }); F.out(ug, w('Then', 133), 'below');
    // editing marks (positions in frame coords of the doc lines)
    const lineY = (i) => 318 + i * 69.5;
    const tf = w('facts,', 135);
    const tick = (x, y, tt) => { const m = F.prop(S.mid, `<path d="M-18 0 L-4 16 L24 -18" stroke="${C.sage2}" stroke-width="10" fill="none" stroke-linecap="round" filter="url(#cutflat)"/>`, x, y, 70, 60, 9); F.in(m, tt, 'none', { dur: 0.2, sfx: 'tick', gain: 0.4 }); };
    tick(1500, lineY(0), tf - 0.6); tick(1500, lineY(3), tf - 0.3);
    const cross = F.prop(S.mid, `<ellipse rx="62" ry="34" fill="none" stroke="${C.tomato}" stroke-width="8"/>`, 913, lineY(1), 170, 90, 9); F.in(cross, tf - 0.1, 'none', { dur: 0.25, sfx: 'scribble', gain: 0.5 });
    const fix = F.hand(S.mid, '31%, checked', 913, lineY(1) - 52, 44, C.tomato2, -3); F.in(fix, tf + 0.2, 'none', { dur: 0.3, sfx: false });
    const stk = F.html(S.mid, '', 387, lineY(2) - 4, 1000, 7, 9, { background: C.tomato, transformOrigin: '0 50%' }); F.fromTo(stk, tf + 0.5, { scaleX: 0 }, { scaleX: 1 }, 0.35); F.sfx(tf + 0.5, 'scribble', 0.4);
    const pen = F.prop(S.mid, `<g filter="url(#cut)" transform="rotate(35)"><rect x="-14" y="-110" width="28" height="180" rx="10" fill="${C.tomato}"/><path d="M-14 70 L0 106 L14 70Z" fill="${C.kraft}"/></g>`, 1300, 400, 180, 260, 12);
    F.fromTo(pen, tf - 0.9, { opacity: 0, x: 400 }, { opacity: 1, x: 0 }, 0.3);
    F.to(pen, tf - 0.6, { x: 190, y: lineY(0) - 400 - 60 }, 0.25); F.to(pen, tf - 0.3, { x: 190, y: lineY(3) - 400 - 60 }, 0.25); F.to(pen, tf - 0.1, { x: -330, y: lineY(1) - 400 - 60 }, 0.3); F.to(pen, tf + 0.5, { x: 100, y: lineY(2) - 400 - 60 }, 0.4);
    // add real stories: a team photo pasted in
    const ts = w('stories', 137);
    const photo = F.prop(S.mid, `<g filter="url(#cut)" transform="rotate(5)"><rect x="-130" y="-100" width="260" height="200" fill="${C.white}"/><rect x="-114" y="-84" width="228" height="140" fill="${C.sky}"/>${[-70, 0, 70].map((x, i) => `<circle cx="${x}" cy="-30" r="22" fill="${[C.skin1, C.skin2, C.skin3][i]}"/><rect x="${x - 30}" y="-8" width="60" height="64" rx="20" fill="${[C.navy, C.sage2, C.tomato2][i]}"/>`).join('')}${T('our team', 0, 88, 26, C.navy, 'Caveat')}</g>`, 1360, 720, 320, 260, 10);
    F.fromTo(photo, ts - 0.4, { opacity: 0, x: 400, y: 200, rotation: 25, scale: 1.3 }, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 }, 0.5, 'power3.out'); F.sfx(ts - 0.1, 'glue', 0.6);
    F.to(pen, ts - 0.5, { opacity: 0 }, 0.2);
    // fix the tone: a dial from ROBOT to YOU
    const tt = w('tone.', 138);
    const dial = F.prop(S.ui, `<g filter="url(#cut)"><circle r="110" fill="${C.white}"/><circle r="92" fill="${C.paper2}"/>${T('ROBOT', -100, 150, 40, C.grey2)}${T('YOU', 100, 150, 46, C.sage2)}</g>`, 260, 330, 360, 360, 20);
    const knob = F.prop(S.ui, `<g filter="url(#cut)"><circle r="60" fill="${C.navy}"/><rect x="-6" y="-80" width="12" height="44" rx="6" fill="${C.tomato}"/></g>`, 260, 330, 200, 200, 21, '50% 50%');
    F.in(dial, tt - 0.8, 'left', { dur: 0.4 }); F.in(knob, tt - 0.8, 'left', { dur: 0.4, sfx: false });
    tl3; F.fromTo(knob, tt - 0.4, { rotation: -60 }, { rotation: 60 }, 0.8, 'power2.inOut'); for (let k = 0; k < 6; k++) F.sfx(tt - 0.4 + k * 0.12, 'tick', 0.25);
    F.to(ls[2], tt, { opacity: 0.25 }, 0.3);
    // save an hour; still sounds like you
    const th = w('hour,', 140);
    const clk = F.prop(S.ui, K.clock(80), 1700, 300, 200, 200, 20), ch = F.prop(S.ui, K.hand(58, C.tomato, 7), 1700, 300, 40, 140, 21, '50% 50%');
    F.in(clk, th - 0.6, 'right', { dur: 0.35 }); F.in(ch, th - 0.6, 'right', { dur: 0.35, sfx: false }); F.fromTo(ch, th - 0.3, { rotation: 0 }, { rotation: -360 }, 0.9, 'power2.inOut'); F.sfx(th - 0.3, 'rewind', 0.5);
    const h1 = F.label(S.ui, '−1 hour', 1700, 450, { size: 54, bg: C.sage2, rot: -3, z: 22 }); F.in(h1, th, 'below', { dur: 0.35 });
    const tl4 = w('sounds', 141);
    const sig = F.prop(S.mid, `<path d="M-160 20 q30 -60 50 -10 t40 0 q20 -40 40 0 t50 -10 q30 -20 60 10 q10 10 50 -20" stroke="${C.navy}" stroke-width="7" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"/>`, 1180, 900, 380, 120, 12);
    const sp = sig.querySelector('path'); F.every(S, (G) => sp.setAttribute('stroke-dasharray', `${(STAGE.seg(G, tl4 - 0.2, tl4 + 0.7) * 100).toFixed(1)} 100`)); F.sfx(tl4 - 0.2, 'scribble', 0.6);
    const ly = F.hand(S.mid, '— still sounds like you', 1250, 980, 48, C.navy, -2); F.in(ly, tl4 + 0.3, 'none', { dur: 0.3, sfx: false });
    S.cam(tb, 960, 520, 1.06, 1.4).cam(tl3, 960, 520, 1.0, 0.8).cam(tf - 1.0, 900, 520, 1.12, 1.0).cam(tt - 1.0, 960, 560, 1.0, 1.0).cam(tl4 - 0.6, 1100, 700, 1.15, 1.0);
    F.miniSnap(S, 2, w('like', 142) - 0.1, 1.2);
  }
  F.done();
})();
