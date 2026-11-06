// c07 — Method 7 (gold): become the fact-checker for the machine (358.00 – 411.70)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;
  const officeSet = (S) => F.set(S.back, `<rect x="-900" y="-300" width="3800" height="1070" fill="#E9DDC6"/>
      <g filter="url(#cutflat)"><rect x="1060" y="80" width="760" height="500" rx="10" fill="${C.white}"/><rect x="1080" y="100" width="720" height="460" fill="${C.sky}"/>
      <path d="M1080 560 L1080 410 L1140 410 L1140 350 L1220 350 L1220 430 L1300 430 L1300 290 L1370 290 L1370 390 L1450 390 L1450 330 L1530 330 L1530 460 L1610 460 L1610 370 L1690 370 L1690 440 L1800 440 L1800 560 Z" fill="#B9C9C4"/><rect x="1435" y="100" width="10" height="460" fill="${C.white}"/></g>
      <rect x="-900" y="760" width="3800" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);

  // ===== right back to your desk (358.00 – 361.00) =====
  {
    const S = F.shot(358.00, 361.00, { cam: [880, 520, 0.9] });
    officeSet(S);
    F.prop(S.back, K.clock(110), 420, 250, 260, 260, 2);
    const you = F.puppet(S, S.mid, 'you', 330, 860, 1.35, { mood: 'smile', armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(60, 700, 640) + P.laptopBack(480, 700, 0.72, C.navy2) + P.mug(170, 700, 0.9), 4);
    F.puppet(S, S.mid, 'manager', 1440, 860, 1.35, { mood: 'smile', armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(1160, 700, 700) + P.laptopBack(1300, 700, 0.8), 4);
    const t7 = w('seven,', 359);
    S.cam(358.05, 420, 520, 1.25, 2.2, 'inOutCubic');
    F.sfx(358.05, 'whoosh', 0.4);
    const g = F.prop(S.front, P.tag(-100, -65, 0, '07', C.gold), 700, 320, 280, 220, 9);
    F.fromTo(g, t7 - 0.2, { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1.3, rotation: -4 }, 0.45, 'power3.out'); F.sfx(t7 - 0.2, 'shimmer', 0.8);
  }

  // ===== gold card (361.00 – 363.84) =====
  {
    const S = F.shot(361.00, 363.84);
    F.chapter(S, 361.05, 7, 'THE FACT-CHECKER', 'the move that makes you impossible to fire');
    const mag = F.prop(S.front, K.magnifier(80).replace(/#1E2A44/, C.gold), 1000, 820, 260, 260, 9);
    F.fromTo(mag, w('fact', 361) - 0.2, { opacity: 0, x: -400, rotation: -30 }, { opacity: 1, x: 0, rotation: 0 }, 0.5); F.sfx(w('fact', 361), 'shimmer', 0.5);
  }

  // ===== the 30-second report; paragraph three (363.84 – 372.40) =====
  {
    const S = F.shot(363.84, 372.40, { cam: [960, 540, 1.0] });
    const page = F.html(S.mid, `<div style="width:1100px;height:1300px;background:#FBF7EE;box-shadow:10px 18px 30px rgba(40,30,20,.3);padding:70px 80px;box-sizing:border-box;font:500 40px/1.5 Inter;color:#1E2A44">
      <div style="font:800 54px Inter">Q3 Report</div><div style="color:#8a8f9c;font-size:24px;margin-bottom:26px">generated in 30 seconds</div>
      <p><b>¶1</b> Customer onboarding improved across every region this quarter, with stronger retention.</p>
      <p><b>¶2</b> Support tickets fell as the new help center launched in July.</p>
      <p class="p3" style="position:relative"><b>¶3</b> Revenue grew <span class="fake">47.3%</span> year over year, and <span class="rule">refunds are allowed up to 400 days</span> after purchase.</p>
      <p><b>¶4</b> We recommend expanding the program next quarter.</p></div>`, 410, 120, 1100, 1300, 3);
    page.style.rotate = '-1.5deg';
    F.in(page, 363.9, 'below', { dur: 0.5 });
    const sw = F.prop(S.front, `<g filter="url(#cut)"><rect x="-22" y="-176" width="44" height="34" rx="6" fill="${C.navy}"/><circle r="150" fill="${C.tomato}"/><circle r="122" fill="${C.white}"/><path d="M0 0 L0 100" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/><circle r="12" fill="${C.navy}"/>${T('0:30', 0, -40, 54)}</g>`, 1580, 330, 340, 380, 9);
    F.fromTo(sw, w('30', 364) - 0.3, { opacity: 0, y: -600, rotation: -20 }, { opacity: 1, y: 0, rotation: 6 }, 0.5, 'power3.out'); F.sfx(w('30', 364) - 0.1, 'tick', 0.6);
    const rb = F.hand(S.ui, 'remember this?', 1560, 820, 70, C.tomato2, -3); F.in(rb, w('Remember', 363) + 0.2, 'none', { dur: 0.3, sfx: false }); F.out(rb, w('fake', 368) - 0.8, 'below');
    const tf = w('fake', 368), tr = w('made', 369), t3 = w('paragraph', 370);
    const fake = page.querySelector('.fake'), rule = page.querySelector('.rule');
    F.every(S, (G) => { const a = G > tf ? Math.min(1, (G - tf) * 3) : 0, b = G > tr ? Math.min(1, (G - tr) * 3) : 0; const pul = 0.5 + 0.5 * Math.sin(G * 7);
      fake.style.background = `rgba(228,87,46,${(a * (0.25 + 0.2 * pul)).toFixed(2)})`; fake.style.color = a > 0.5 ? '#C9441F' : ''; fake.style.fontWeight = a > 0.5 ? 800 : 500;
      rule.style.background = `rgba(228,87,46,${(b * (0.18 + 0.15 * pul)).toFixed(2)})`; });
    F.sfx(tf, 'pluck', 0.6); F.sfx(tr, 'pluck', 0.6);
    const fl = F.prop(S.mid, `<g filter="url(#cut)"><path d="M0 0 v-90" stroke="${C.navy}" stroke-width="6"/><path d="M0 -90 h70 l-14 22 l14 22 h-70z" fill="${C.tomato}"/></g>`, 500, 760, 120, 140, 9);
    F.in(fl, t3, 'left', { dur: 0.35, sfx: 'flag', gain: 0.5 });
    const p3 = F.label(S.ui, 'paragraph 3', 300, 200, { size: 90, bg: C.tomato, rot: -4, z: 20 }); F.in(p3, t3 + 0.1, 'left', { dur: 0.35, sfx: false });
    S.cam(363.9, 960, 520, 0.92, 0.01).cam(tf - 0.8, 962, 740, 1.4, 1.6, 'inOutCubic');
  }

  // ===== AI loves to guess (372.40 – 375.86) =====
  {
    const S = F.shot(372.40, 375.86, { cam: [960, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="900" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const board = F.prop(S.mid, `<g filter="url(#cut)"><circle r="190" fill="${C.white}"/><circle r="150" fill="${C.tomato}"/><circle r="105" fill="${C.white}"/><circle r="60" fill="${C.tomato}"/><circle r="20" fill="${C.white}"/></g>`, 1420, 420, 420, 420, 2);
    const ai = F.puppet(S, S.mid, 'intern', 640, 940, 1.6, { mood: 'happy', armR: 'up', armL: 'hip' });
    const tg = w('guess', 373);
    const darts = [[1330, 300], [1560, 520], [1290, 560]].map(([x, y], i) => { const d = F.prop(S.mid, `<g filter="url(#cut)" transform="rotate(-20)"><rect x="-70" y="-5" width="110" height="10" fill="${C.navy}"/><path d="M-70 0 l-26 -16 l6 16 l-6 16z" fill="${C.sage}"/><path d="M40 -8 L60 0 L40 8Z" fill="${C.grey2}"/></g>`, x, y, 200, 80, 5);
      const tt = tg - 0.5 + i * 0.45; F.fromTo(d, tt, { opacity: 1, x: 760 - x, y: 400 - y, rotation: -10 }, { x: 0, y: 0, rotation: 0 }, 0.3, 'power1.in'); F.hidden(d); F.set && null;
      F.sfx(tt + 0.28, 'dart', 0.6); ai.arm(tt - 0.15, 'r', 'high', 0.12).arm(tt + 0.05, 'r', 'fwd', 0.15); return d; });
    darts.forEach((d, i) => { const tt = tg - 0.5 + i * 0.45; F.show(d, tt); });
    ai.mood(tg + 0.6, 'proud');
    const lg = F.label(S.ui, 'AI loves to guess', 960, 150, { size: 96, bg: C.navy, rot: -1.5, z: 20 }); F.in(lg, w('loves', 373) - 0.1, 'below', { dur: 0.4 });
    const nk = F.hand(S.ui, "…when it doesn't know", 1300, 960, 60, C.tomato2, -2); F.in(nk, w('know', 375) - 0.3, 'none', { dur: 0.3, sfx: false });
    S.cam(tg, 1000, 560, 1.0, 1.2);
  }

  // ===== hallucination = lying with total confidence (375.86 – 382.48) =====
  {
    const S = F.shot(375.86, 382.48, { bg: '#E9E2D2', cam: [960, 540, 1.0] });
    const word = 'HALLUCINATION';
    const th = w('hallucination,', 378) - 0.3;
    const letters = word.split('').map((ch, i) => { const l = F.label(S.mid, ch, 260 + i * 117, 380, { size: 120, bg: i % 3 === 0 ? C.tomato : i % 3 === 1 ? C.navy : C.sage2, font: "'Archivo Black'", weight: 400, rot: ((i * 37) % 11) - 5, z: 4 });
      F.in(l, th + i * 0.04, 'none', { dur: 0.35, sfx: i % 4 ? false : 'pop', gain: 0.25 });
      F.every(S, (G) => { if (G > th) l.style.translate = `${(6 * Math.sin(G * 1.3 + i)).toFixed(1)}px ${(14 * Math.sin(G * 1.7 + i * 0.8)).toFixed(1)}px`; }); return l; });
    F.sfx(th, 'dreamy', 0.6);
    const tw = F.hand(S.ui, 'in the tech world, they call it…', 960, 180, 64, C.navy, -2); F.in(tw, w('tech', 376), 'none', { dur: 0.35, sfx: false });
    const tl3 = w('lying', 380);
    letters.forEach((l, i) => F.to(l, tl3 - 0.6 + i * 0.02, { y: -200, opacity: 0 }, 0.4, 'power2.in'));
    F.out(tw, tl3 - 0.6, 'above');
    const ai = F.puppet(S, S.mid, 'intern', 960, 980, 1.7, { mood: 'proud', armL: 'hip', armR: 'hip' });
    ai.enter(tl3 - 0.4, 'below', 0.45);
    const nose = F.prop(ai.root, `<rect x="0" y="-12" width="200" height="24" rx="12" fill="${C.tomato2}" filter="url(#cut)"/>`, 100, -360, 220, 40, 9, '0% 50%');
    F.fromTo(nose, tl3 + 0.2, { scaleX: 0.08 }, { scaleX: 1.2 }, 1.4, 'power2.out'); F.sfx(tl3 + 0.2, 'stretch', 0.7); F.sfx(tl3 + 1.6, 'boop', 0.5);
    const lc = F.label(S.ui, 'lying with total confidence', 960, 200, { size: 80, bg: C.tomato, rot: -1.5, z: 20 }); F.in(lc, tl3, 'below', { dur: 0.4 });
    S.cam(tl3 - 0.4, 1000, 640, 1.12, 1.0);
  }

  // ===== bad AI report to a big client → loses money and trust → safety net (382.48 – 389.50) =====
  {
    const S = F.shot(382.48, 389.50, { bg: '#DFE6E1', cam: [700, 560, 1.0] });
    F.set(S.back, `<g filter="url(#cutflat)"><path d="M1500 1100 L1500 160 L1820 100 L1820 1100Z" fill="#9DB3AD"/>${[...Array(7)].map((_, r) => [0, 1].map((c) => `<rect x="${1560 + c * 130}" y="${260 + r * 110}" width="80" height="60" fill="${C.white}" opacity=".7"/>`).join('')).join('')}<rect x="1540" y="150" width="240" height="70" fill="${C.white}"/></g>${T('BIG CLIENT', 1660, 198, 36, C.navy)}<rect x="-800" y="920" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const mgr = F.puppet(S, S.mid, 'manager', 260, 940, 1.3, { mood: 'happy', armR: 'fwd' });
    const plane = F.prop(S.front, `<g filter="url(#cut)"><path d="M-120 0 L120 -30 L-40 40 Z" fill="${C.white}"/><path d="M-40 40 L120 -30 L-20 70Z" fill="#E1D8C8"/></g>`, 420, 640, 260, 140, 9);
    const ts = w('sends', 382), tl4 = w('loses', 385);
    F.fromTo(plane, ts, { opacity: 1, x: 0, y: 0, rotation: -10 }, { x: 1150, y: -260, rotation: 8 }, tl4 - ts - 0.1, 'power1.in'); F.sfx(ts, 'plane', 0.7);
    mgr.arm(ts - 0.2, 'r', 'high', 0.2).arm(ts + 0.1, 'r', 'point', 0.25);
    S.cam(ts + 0.3, 1250, 480, 1.0, tl4 - ts - 0.4, 'inOutSine');
    F.sfx(tl4 - 0.05, 'crash', 0.9); S.shake(tl4, 22);
    F.to(plane, tl4 - 0.1, { rotation: 120, y: 120, opacity: 0 }, 0.5, 'power2.in');
    const coins = [...Array(8)].map((_, i) => { const c = F.prop(S.front, K.coin(30), 1580, 400, 80, 80, 10); F.fromTo(c, tl4 + i * 0.05, { opacity: 1, x: 0, y: 0 }, { x: (i - 4) * 60, y: 520 + (i % 3) * 30, rotation: i * 80 }, 0.8, 'power2.in'); F.hidden(c); F.show(c, tl4 + i * 0.05); return c; });
    F.sfx(tl4 + 0.4, 'coins', 0.7);
    const hs = F.prop(S.front, `<g filter="url(#cut)"><path d="M-120 0 q60 -40 120 -10 l-10 40 q-60 10 -110 -10z" fill="${C.skin1}"/></g>`, 1400, 300, 260, 120, 10), hs2 = F.prop(S.front, `<g filter="url(#cut)"><path d="M120 0 q-60 -40 -120 -10 l10 40 q60 10 110 -10z" fill="${C.skin2}"/></g>`, 1460, 300, 260, 120, 10);
    const tt = w('trust.', 387);
    F.in(hs, tt - 0.6, 'left', { dur: 0.3, sfx: false }); F.in(hs2, tt - 0.6, 'right', { dur: 0.3, sfx: false });
    F.to(hs, tt, { x: -120, rotation: -20 }, 0.35); F.to(hs2, tt, { x: 120, rotation: 20 }, 0.35); F.sfx(tt, 'tear', 0.8);
    const lm = F.label(S.ui, 'money + trust: lost', 960, 990, { size: 74, bg: C.tomato, rot: -1, z: 20 }); F.in(lm, tl4 + 0.2, 'below', { dur: 0.4 });
    // you can be the safety net
    const tn = w('safety', 388) - 0.4;
    const dip = F.html(S.ui, '', 0, 0, 1920, 1080, 30, { background: '#DFE6E1' }); dip.style.backgroundImage = F.paperTex(); F.hidden(dip); F.fromTo(dip, tn - 0.25, { opacity: 0 }, { opacity: 1 }, 0.2); F.sfx(tn - 0.3, 'rewind', 0.6);
    const net = F.prop(dip, `<g filter="url(#cut)"><path d="M-300 -40 Q0 120 300 -40" stroke="${C.navy}" stroke-width="10" fill="none"/>${[...Array(9)].map((_, i) => `<path d="M${-270 + i * 66} ${-30 + Math.sin((i + 0.5) / 9 * Math.PI) * 75} l30 -40" stroke="${C.navy}" stroke-width="4"/>`).join('')}<rect x="-320" y="-80" width="20" height="440" fill="${C.kraft2}"/><rect x="300" y="-80" width="20" height="440" fill="${C.kraft2}"/></g>`, 960, 600, 680, 520, 2);
    const yu = F.puppet(S, dip, 'you', 960, 1060, 1.3, { mood: 'happy', armL: 'up', armR: 'up' });
    const pl2 = F.prop(dip, `<g filter="url(#cut)" transform="rotate(8) scale(1.3)"><path d="M-120 0 L120 -30 L-40 40 Z" fill="${C.white}"/><path d="M-40 40 L120 -30 L-20 70Z" fill="#E1D8C8"/></g>`, 960, 600, 340, 200, 4);
    F.fromTo(pl2, tn + 0.1, { x: 900, y: -500, rotation: -20 }, { x: 0, y: 0, rotation: 0 }, 0.6, 'power2.in'); F.sfx(tn + 0.65, 'netcatch', 0.8);
    const sn = F.label(dip, 'the safety net', 960, 170, { size: 110, bg: C.navy, rot: -1.5, z: 9 }); F.in(sn, tn + 0.6, 'below', { dur: 0.4, sfx: false });
  }

  // ===== type this: the fact-check prompt (389.50 – 401.62) =====
  {
    const S = F.shot(389.50, 401.62, { bg: '#E3D7C1', cam: [960, 540, 0.85], drift: 0.5 });
    const L = F.laptop(S.mid, 960, 540, 1.0); const chat = F.chat(S, L.screen, { size: 44, top: true });
    const clip = F.html(chat.comp, `<span style="display:inline-flex;align-items:center;gap:8px;background:#EFE6D3;border:2px solid #C9A57A;border-radius:12px;padding:4px 14px;font:600 26px Inter;color:#1E2A44">📄 Q3 Report (draft).docx</span>`, 0, 0, 0, 0, 1, { position: 'relative', marginBottom: '10px' });
    chat.comp.prepend(clip); F.in(clip, w('paste', 390) - 0.05, 'below', { dur: 0.3, sfx: 'paste', gain: 0.7, dist: 0.3 });
    const t0 = w('Read', 393), t1 = w('client.', 401) + 0.1;
    chat.type('Read this draft and list every claim, number, or rule that could be wrong, outdated, or risky for a business to send to a client.', t0, t1);
    const k = F.label(S.ui, 'TYPE THIS', 1500, 90, { size: 60, bg: C.tomato, rot: -1.5, z: 20 }); F.in(k, w('type', 392) - 0.05, 'above', { dur: 0.4 }); F.out(k, t0 + 1.2, 'above');
    const st = F.prop(S.front, P.sticky(0, 0, 7, 'pause &amp;|copy!', 54, C.sticky, 200), 1800, 300, 240, 240, 9); F.in(st, t0 + 1.0, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.5 });
    S.cam(w('Open', 389) - 0.1, 960, 470, 1.08, 1.0).cam(t0, 960, 430, 1.16, 7.5, 'inOutSine');
  }

  // ===== check the flagged lines against real files; catch one; paid for the year (401.62 – 411.70) =====
  {
    const S = F.shot(401.62, 411.70, { bg: '#E9DDC6', cam: [900, 560, 1.0] });
    F.set(S.back, `<rect x="-800" y="860" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const list = F.html(S.mid, `<div style="width:640px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter;color:#1E2A44">${F.winBar('AI · flagged lines')}<div style="padding:20px 26px;font:600 30px/1.4 Inter">${['Revenue grew 47.3%', 'Refunds up to 400 days', 'Help center launched July'].map((t, i) => `<div class="fl" style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:2px solid #E6DAC2"><span style="color:#E4572E">⚑</span><span style="flex:1">${t}</span><span class="mk" style="font:800 34px Inter;opacity:0;color:${i === 2 ? '#5F8A6C' : '#C9441F'}">${i === 2 ? '✓' : '✗'}</span></div>`).join('')}</div></div>`, 1160, 180, 640, 0, 3);
    F.in(list, 401.7, 'right', { dur: 0.5 }); [...list.querySelectorAll('.fl')].forEach((r, i) => F.fromTo(r, 401.9 + i * 0.2, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, 0.3));
    const cab = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-120" y="-260" width="240" height="520" fill="${C.kraft2}"/>${[0, 1, 2].map((i) => `<rect x="-100" y="${-240 + i * 166}" width="200" height="150" fill="${C.kraft}"/><rect x="-36" y="${-190 + i * 166}" width="72" height="16" rx="6" fill="${C.navy}"/>`).join('')}</g>`, 220, 600, 260, 540, 2);
    const you = F.puppet(S, S.mid, 'you', 620, 920, 1.4, { mood: 'neutral', armL: 'down' });
    const tc = w('check', 401) + 0.1;
    you.arm(tc - 0.2, 'l', 'out', 0.3).mood(tc, 'look');
    const files = [0, 1].map((i) => { const f = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-80 -60 L-20 -60 L-6 -44 L80 -44 L80 60 L-80 60Z" fill="${C.gold}"/>${T(i ? 'POLICY' : 'FINANCE', 0, 20, 26, C.navy)}</g>`, 260, 520 + i * 40, 180, 140, 6);
      F.fromTo(f, tc + 0.1 + i * 0.4, { opacity: 0, x: 0 }, { opacity: 1, x: 520 + i * 90, y: 260 - i * 10, rotation: -6 + i * 8 }, 0.5, 'power2.out'); F.sfx(tc + 0.1 + i * 0.4, 'drawer', 0.4); return f; });
    const marks = [...list.querySelectorAll('.mk')];
    marks.forEach((m, i) => { F.to(m, w('company', 404) + i * 0.35, { opacity: 1 }, 0.2); F.sfx(w('company', 404) + i * 0.35, i === 2 ? 'tick' : 'scribble', 0.5); });
    const rf = F.hand(S.ui, 'real company files', 400, 200, 64, C.navy, -2); F.in(rf, w('real', 403), 'none', { dur: 0.3, sfx: false }); F.out(rf, w('When', 405), 'above');
    // catch one mistake; boss relieved
    const tcatch = w('catch', 406);
    F.to([list, ...files], tcatch - 0.3, { opacity: 0, y: -60 }, 0.4);
    const mgr = F.puppet(S, S.mid, 'manager', 1300, 920, 1.4, { mood: 'neutral', flip: true });
    mgr.enter(tcatch - 0.3, 'right', 0.5);
    const big = F.prop(S.front, `<g filter="url(#cut)"><rect x="-150" y="-80" width="300" height="160" fill="${C.white}"/>${T('47.3%', 0, 26, 76, C.tomato2)}<path d="M-120 -50 L120 50" stroke="${C.tomato}" stroke-width="10"/></g>`, 900, 420, 320, 180, 9);
    F.fromTo(big, tcatch, { opacity: 0, y: 200, scale: 0.5 }, { opacity: 1, y: 0, scale: 1 }, 0.4, 'power3.out'); you.arm(tcatch - 0.1, 'r', 'up', 0.3).mood(tcatch + 0.2, 'happy');
    const te = w('embarrassed', 407);
    mgr.mood(te - 0.2, 'shock').mood(te + 0.9, 'smile').tilt(te + 0.9, 6); F.sfx(te - 0.2, 'gasp', 0.6); F.sfx(te + 0.9, 'sigh', 0.5);
    const tp = w('paid', 408);
    const chk = F.prop(S.front, `<g transform="scale(1.5)">${K.paycheck('PAID · 12 MO')}</g>`, 960, 260, 500, 260, 10);
    F.fromTo(chk, tp - 0.2, { opacity: 0, y: -300, rotation: -20 }, { opacity: 1, y: 0, rotation: -4 }, 0.45, 'power3.out'); F.sfx(tp + 0.1, 'kaching', 0.8);
    F.to(big, tp - 0.3, { opacity: 0 }, 0.3);
    const yr = F.label(S.ui, 'your salary: paid for the year', 960, 1000, { size: 70, bg: C.sage2, rot: -1, z: 20 }); F.in(yr, w('salary', 409) - 0.1, 'below', { dur: 0.4 });
    S.cam(tcatch - 0.3, 960, 560, 1.06, 1.0);
    F.miniSnap(S, 7, w('year.', 410) - 0.1, 1.2);
  }
  F.done();
})();
