// c08 — Method 8: connect two parts of your company that never talk (411.70 – 448.94)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;
  const ticket = () => `<g filter="url(#cut)"><rect x="-44" y="-30" width="88" height="60" fill="${C.white}"/><rect x="-32" y="-16" width="50" height="8" fill="${C.tomato}"/><rect x="-32" y="0" width="64" height="6" fill="${C.grey}"/><rect x="-32" y="12" width="40" height="6" fill="${C.grey}"/></g>`;

  // ===== card (411.70 – 415.78) =====
  {
    const S = F.shot(411.70, 415.78);
    F.chapter(S, 411.75, 8, 'BUILD THE BRIDGE', 'connect two teams that never talk');
    const isl = F.prop(S.front, `<g filter="url(#cut)"><path d="M-260 0 L-60 0 L-80 60 L-240 60Z" fill="${C.kraft}"/><path d="M60 0 L260 0 L240 60 L80 60Z" fill="${C.kraft}"/></g>`, 1000, 900, 560, 100, 9);
    F.in(isl, w('never', 414), 'below', { dur: 0.4, sfx: 'paperslide' });
  }

  // ===== sales / support / marketing (415.78 – 422.96) =====
  {
    const S = F.shot(415.78, 422.96, { bg: '#E7E2D4', cam: [620, 600, 1.15], backDepth: 1 });
    F.set(S.back, `<g filter="url(#cut)"><rect x="80" y="380" width="760" height="560" fill="${C.white}"/><rect x="1080" y="380" width="760" height="560" fill="${C.white}"/><rect x="40" y="920" width="1840" height="40" fill="${C.kraft2}"/><rect x="940" y="380" width="40" height="560" fill="${C.kraft2}"/></g>`);
    const sl = F.label(S.back, 'SALES', 460, 440, { size: 54, bg: C.navy }), su = F.label(S.back, 'SUPPORT', 1460, 440, { size: 54, bg: C.sage2 });
    const s1 = F.puppet(S, S.mid, 'co2', 300, 920, 0.95, { mood: 'smile', armR: 'high' }), s2 = F.puppet(S, S.mid, 'grey', 620, 920, 0.95, { mood: 'smile', look: { top: C.navy2, skin: C.skin1, hair: C.hair1 }, armL: 'high' });
    s1.nod(415.8, 419, 4, 1.6); s2.nod(415.8, 419, 4, 1.4);
    const r1 = F.prop(S.mid, `<g stroke="${C.tomato}" stroke-width="5" fill="none" stroke-linecap="round"><path d="M0 -14 q10 14 0 28"/><path d="M14 -26 q20 26 0 52"/></g>`, 380, 580, 60, 70, 5);
    F.every(S, (G) => { r1.style.opacity = Math.floor(G * 4) % 2 ? 1 : 0.2; });
    F.sfx(w('sales', 416), 'ring', 0.4);
    const hd = `<path d="M-60 -270 Q0 -350 60 -270" stroke="${C.navy}" stroke-width="10" fill="none"/><path d="M60 -270 q20 50 -20 70" stroke="${C.navy}" stroke-width="6" fill="none"/>`;
    const u1 = F.puppet(S, S.mid, 'co1', 1300, 920, 0.95, { mood: 'worry', headExtra: hd }), u2 = F.puppet(S, S.mid, 'newhire', 1620, 920, 0.95, { mood: 'worry', headExtra: hd });
    const ts = w('support', 417) - 0.3;
    const comps = ["it's broken again", 'where is my refund?', 'the app logs me out', 'too confusing!', 'still waiting…'];
    comps.forEach((c, i) => { const b = F.label(S.mid, c, 1300 + (i % 2) * 300, 820 - i * 70, { size: 28, bg: C.white, color: C.navy, font: 'Inter', weight: 600, rot: (i % 2 ? 3 : -3), z: 6 });
      F.in(b, ts + 0.2 + i * 0.3, 'below', { dur: 0.3, sfx: 'ping', gain: 0.2, dist: 0.3 }); });
    const tm = w('marketing', 419);
    const planet = F.prop(S.front, `<g filter="url(#cut)"><circle r="150" fill="${C.gold}"/><ellipse rx="230" ry="44" fill="none" stroke="${C.tomato}" stroke-width="16" transform="rotate(-14)"/></g>`, 960, -160, 500, 340, 8);
    const mk = F.label(S.front, 'MARKETING', 960, -160, { size: 44, bg: C.navy, z: 9 });
    F.fromTo([planet, mk], tm - 0.2, { opacity: 0, y: 200 }, { opacity: 1, y: 0 }, 0.8, 'power2.out'); F.sfx(tm, 'whimsy', 0.5);
    for (let i = 0; i < 12; i++) { const cf = F.prop(S.front, `<rect x="-8" y="-5" width="16" height="10" fill="${[C.tomato, C.sage, C.navy][i % 3]}"/>`, 760 + i * 36, -120, 30, 30, 9);
      F.fromTo(cf, tm + 0.3 + i * 0.05, { opacity: 0, y: 0 }, { opacity: 1, y: 160 + (i % 4) * 40, rotation: i * 70 }, 1.4, 'power1.out'); }
    const ow = F.hand(S.front, 'in its own world', 1300, -40, 60, C.tomato2, -3); F.in(ow, w('own', 421), 'none', { dur: 0.3, sfx: false });
    const noidea = F.prop(S.back, `<g stroke="${C.tomato}" stroke-width="10" stroke-dasharray="20 14"><path d="M960 400 L960 900"/></g>`, 960, 650, 60, 600, 3);
    S.cam(ts - 0.3, 1320, 600, 1.15, 1.2).cam(tm - 0.6, 960, 260, 0.9, 1.4);
  }

  // ===== your own lane; 47 unread; no free time (422.96 – 428.46) =====
  {
    const S = F.shot(422.96, 428.46, { bg: '#E7DFCB', cam: [700, 600, 1.05] });
    F.set(S.back, `<rect x="-800" y="760" width="3600" height="700" fill="${C.kraft}" filter="url(#cutflat)"/><g filter="url(#cut)"><rect x="-800" y="700" width="3600" height="60" fill="${C.kraft2}"/><rect x="-800" y="960" width="3600" height="60" fill="${C.kraft2}"/></g><path d="M-800 860 H2800" stroke="${C.white}" stroke-width="8" stroke-dasharray="50 40"/>`);
    const you = F.puppet(S, S.mid, 'you', 200, 920, 1.25, { mood: 'tired' });
    const tl2 = w('lane', 423);
    you.walk(422.98, 425.6).move(422.98, 900, 920, 2.6, 'none');
    for (let x = 423; x < 425.6; x += 0.35) F.sfx(x, 'step', 0.25);
    const ol = F.label(S.ui, 'your own lane', 640, 170, { size: 84, bg: C.navy, rot: -1.5, z: 20 }); F.in(ol, tl2 - 0.3, 'below', { dur: 0.4 }); F.out(ol, w('47', 425) - 0.2, 'above');
    const inbox = F.html(S.mid, `<div style="width:520px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter;color:#1E2A44">${F.winBar('Inbox')}<div style="display:flex;align-items:center;justify-content:space-between;padding:26px 30px;font:700 40px Inter">Unread <span class="n" style="background:#E4572E;color:#fff;border-radius:40px;padding:6px 24px;font:800 52px Inter">0</span></div></div>`, 1180, 220, 520, 0, 4);
    const t47 = w('47', 425);
    F.in(inbox, t47 - 0.5, 'right', { dur: 0.4 }); F.count(S, inbox.querySelector('.n'), t47 - 0.2, t47 + 0.6, 0, 47);
    for (let k = 0; k < 10; k++) F.sfx(t47 - 0.2 + k * 0.08, 'ping', 0.12);
    const cal = F.html(S.mid, `<div style="width:520px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter">${F.winBar('This week')}<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:18px">${[...Array(20)].map((_, i) => `<div class="b" style="height:44px;border-radius:8px;background:${['#E4572E', '#1E2A44', '#7FA88B', '#E2A93B'][i % 4]};opacity:0"></div>`).join('')}</div></div>`, 1180, 520, 520, 0, 4);
    const tf = w('free', 427) - 0.5;
    F.in(cal, tf - 0.3, 'right', { dur: 0.4 }); [...cal.querySelectorAll('.b')].forEach((b, i) => F.to(b, tf + i * 0.03, { opacity: 1 }, 0.1)); F.sfx(tf, 'flipcards', 0.5);
    you.mood(t47, 'worry');
    S.cam(t47 - 0.6, 1100, 540, 1.0, 1.0);
  }

  // ===== five hours saved; bridge the gap; tickets → AI → top 3 → sales (428.46 – 442.30) =====
  {
    const S = F.shot(428.46, 442.30, { bg: '#E4EAE5', cam: [960, 560, 1.0] });
    F.set(S.back, `<g filter="url(#cut)"><path d="M-400 640 L620 640 L700 1300 L-400 1300Z" fill="${C.kraft}"/><path d="M2320 640 L1300 640 L1220 1300 L2320 1300Z" fill="${C.kraft}"/><rect x="40" y="200" width="520" height="440" fill="${C.white}"/><rect x="1360" y="200" width="520" height="440" fill="${C.white}"/></g>`);
    F.label(S.back, 'SALES', 300, 270, { size: 60, bg: C.navy }); F.label(S.back, 'SUPPORT', 1620, 270, { size: 60, bg: C.sage2 });
    const sales = [F.puppet(S, S.back, 'co2', 220, 640, 0.75, { mood: 'neutral' }), F.puppet(S, S.back, 'grey', 420, 640, 0.75, { mood: 'neutral', look: { top: C.navy2, skin: C.skin1, hair: C.hair1 } })];
    F.puppet(S, S.back, 'co1', 1620, 640, 0.75, { mood: 'worry' }); F.puppet(S, S.back, 'newhire', 1800, 640, 0.75, { mood: 'worry' });
    const you = F.puppet(S, S.mid, 'you', 1400, 640, 0.95, { mood: 'smile', armR: 'fwd', flip: true });
    // five hour tokens
    const t5 = w('five', 429);
    const toks = [...Array(5)].map((_, i) => { const tk = F.prop(S.front, `<g filter="url(#cut)"><circle r="34" fill="${C.gold}"/><circle r="26" fill="${C.white}"/><path d="M0 0 V-16 M0 0 H12" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/></g>`, 1460 + i * 52, 200, 80, 80, 10);
      F.fromTo(tk, t5 - 0.2 + i * 0.1, { opacity: 0, y: -300 }, { opacity: 1, y: 0 }, 0.4, 'power2.in'); F.sfx(t5 + 0.2 + i * 0.1, 'coin', 0.35); return tk; });
    const fh = F.label(S.ui, '+5 hrs / week', 1600, 110, { size: 56, bg: C.sage2, rot: 2, z: 20 }); F.in(fh, t5 + 0.1, 'below', { dur: 0.35 });
    // one token becomes the bridge
    const tb = w('bridge', 433) - 0.3;
    toks.forEach((tk, i) => { if (i) F.to(tk, tb - 0.4, { opacity: 0, y: -40 }, 0.3); });
    F.to(toks[0], tb - 0.4, { x: 960 - 1460, y: 440 }, 0.5, 'power2.inOut'); F.to(toks[0], tb + 0.1, { opacity: 0, scale: 2 }, 0.3);
    const planks = [...Array(9)].map((_, i) => { const pl = F.prop(S.mid, `<rect x="-26" y="-9" width="52" height="18" fill="${C.kraft2}" filter="url(#cut)"/>`, 660 + i * 75, 648 - Math.sin((i + 0.5) / 9 * Math.PI) * 60, 70, 30, 3); F.fromTo(pl, tb + 0.1 + i * 0.06, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.25); return pl; });
    const rope = F.prop(S.mid, `<path d="M-340 0 Q0 -120 340 0" stroke="${C.kraft2}" stroke-width="10" fill="none"/>`, 960, 620, 720, 160, 2); F.fromTo(rope, tb, { opacity: 0 }, { opacity: 1 }, 0.4); F.sfx(tb + 0.1, 'build', 0.6);
    const bg2 = F.label(S.ui, 'bridge the gap', 960, 990, { size: 90, bg: C.navy, rot: -1, z: 20 }); F.in(bg2, tb + 0.3, 'below', { dur: 0.4 }); F.out(bg2, w('Take', 434) + 0.4, 'below');
    F.out(fh, tb, 'above');
    // complaints from support tickets fly across
    const tt = w('complaints', 435);
    const tks = [...Array(6)].map((_, i) => { const t = F.prop(S.front, ticket(), 1640 + (i % 3) * 40, 520 + i * 10, 100, 80, 9); F.fromTo(t, tt - 0.3 + i * 0.1, { opacity: 0, y: 100 }, { opacity: 1, y: 0, rotation: (i - 3) * 6 }, 0.3); return t; });
    F.sfx(tt, 'flutter', 0.5);
    // the intern with a funnel in the middle of the bridge
    const tfeed = w('feed', 437);
    const ai = F.puppet(S, S.mid, 'intern', 960, 640, 0.9, { mood: 'happy', armL: 'up', armR: 'up' });
    F.fromTo(ai.root, tfeed - 0.5, { opacity: 0, y: -400 }, { opacity: 1, y: 0 }, 0.45, 'power2.out'); F.sfx(tfeed - 0.1, 'thunk', 0.4);
    const fun = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-80 -60 L80 -60 L20 20 L20 50 L-20 50 L-20 20Z" fill="${C.grey}"/></g>`, 960, 290, 180, 130, 6);
    F.in(fun, tfeed - 0.3, 'above', { dur: 0.3, sfx: false });
    tks.forEach((t, i) => F.to(t, tfeed + i * 0.12, { x: 960 - (1640 + (i % 3) * 40), y: 260 - (520 + i * 10), scale: 0.3, opacity: 0, rotation: 180 }, 0.55, 'power2.in'));
    F.sfx(tfeed + 0.3, 'chug', 0.6);
    const t3 = w('three', 439);
    const top3 = ['#1', '#2', '#3'].map((n, i) => { const c = F.label(S.mid, `${n}<br><span style="font:600 22px Inter">${['slow refunds', 'login bugs', 'confusing setup'][i]}</span>`, 820 + i * 140, 470, { size: 40, bg: C.tomato, rot: (i - 1) * 4, z: 8, font: "'Archivo Black'", weight: 400 }); F.fromTo(c, t3 + i * 0.18, { opacity: 0, y: -120, scale: 0.4 }, { opacity: 1, y: 0, scale: 1 }, 0.35, 'power3.out'); F.sfx(t3 + i * 0.18, 'ding', 0.35); return c; });
    const pt = F.hand(S.ui, 'top 3 patterns', 960, 160, 64, C.navy, -2); F.in(pt, t3, 'none', { dur: 0.3, sfx: false });
    // hand the shortlist to sales
    const th = w('hand', 440);
    F.to(ai.root, th - 0.4, { opacity: 0, y: -300 }, 0.4, 'power2.in'); F.to(fun, th - 0.4, { opacity: 0 }, 0.3);
    you.walk(th - 0.2, th + 1.3).move(th - 0.2, 600, 640, 1.5, 'power1.inOut');
    top3.forEach((c, i) => F.to(c, th - 0.1, { x: -560 + i * -20, y: 40 + i * 10, scale: 0.7 }, 1.4, 'power1.inOut'));
    sales.forEach((s, i) => s.mood(th + 1.3 + i * 0.1, 'happy').hop(th + 1.4 + i * 0.1, 14)); F.sfx(th + 1.4, 'ooh', 0.6);
    S.cam(t5 - 0.4, 1460, 360, 1.2, 1.0).cam(tb - 0.5, 960, 560, 1.0, 1.0).cam(th, 700, 520, 1.12, 1.4);
  }

  // ===== software reads one box; a human walks across the hall (442.30 – 448.94) =====
  {
    const S = F.shot(442.30, 448.94, { bg: '#E7E2D4', cam: [960, 560, 1.0] });
    F.set(S.back, `<rect x="-800" y="900" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const boxp = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-150" y="-110" width="300" height="220" fill="${C.kraft}"/><path d="M-150 -110 L-110 -150 L190 -150 L150 -110Z" fill="#D9B98E"/><path d="M150 -110 L190 -150 L190 70 L150 110Z" fill="${C.kraft2}"/></g>`, 960, 800, 400, 340, 4);
    const ai = F.puppet(S, S.mid, 'intern', 960, 820, 0.9, { mood: 'neutral', armL: 'fwd', z: 2 });
    const pg = F.prop(S.mid, P.sheet(0, 0, -8, 0.45), 900, 590, 100, 130, 3);
    F.in(boxp, 442.35, 'below', { dur: 0.4 }); F.in(ai.root, 442.45, 'below', { dur: 0.4, sfx: false });
    const ob = F.label(S.ui, 'software reads data inside one box', 960, 170, { size: 66, bg: C.navy, rot: -1, z: 20 }); F.in(ob, w('Software', 442), 'below', { dur: 0.4 }); F.out(ob, w('takes', 445) - 0.2, 'above');
    // two rooms either side; a human walks across the hall
    const tw = w('walk', 446) - 0.4;
    const L1 = F.label(S.back, 'SALES', 200, 420, { size: 54, bg: C.navy }), L2 = F.label(S.back, 'SUPPORT', 1720, 420, { size: 54, bg: C.sage2 });
    F.in(L1, w('human', 445) - 0.4, 'left', { dur: 0.4 }); F.in(L2, w('human', 445) - 0.3, 'right', { dur: 0.4 });
    F.to([boxp, ai.root, pg], w('human', 445) - 0.5, { y: 260, opacity: 0.0 }, 0.5, 'power2.in');
    const you = F.puppet(S, S.mid, 'you', 260, 930, 1.3, { mood: 'happy', armR: 'fwd' }); you.enter(w('human', 445) - 0.3, 'left', 0.4);
    you.walk(tw, tw + 2.0).move(tw, 1620, 930, 2.0, 'power1.inOut');
    for (let x = tw; x < tw + 2; x += 0.35) F.sfx(x, 'step', 0.3);
    const thread = F.html(S.mid, '', 260, 600, 1400, 8, 1, { background: C.tomato, transformOrigin: '0 50%' });
    F.fromTo(thread, tw, { scaleX: 0 }, { scaleX: 1 }, 2.0, 'power1.inOut'); F.sfx(w('connect', 447), 'zip', 0.7);
    F.to([L1, L2], w('teams.', 448) - 0.3, { y: '+=0' }, 0.1);
    const ct = F.label(S.ui, 'connect two teams', 960, 170, { size: 90, bg: C.tomato, rot: -1.5, z: 20 }); F.in(ct, w('connect', 447), 'below', { dur: 0.4 });
    F.miniSnap(S, 8, w('teams.', 448) - 0.3, 1.1);
  }
  F.done();
})();
