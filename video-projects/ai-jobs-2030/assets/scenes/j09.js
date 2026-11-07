// j09 — Retail Cashier & Bank Teller -> Relationship Banker (510.40 – 566.76)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const visor = `<path d="M-60 -296 Q0 -330 60 -296 L80 -282 L-60 -282Z" fill="${RD}"/>`;

  // ===== card (510.40 – 514.36) =====
  {
    const S = F.shot(510.40, 514.36);
    X.card(F, S, 9, 'CASHIER & BANK TELLER', 510.5, (I) => I.box(-220, -60, 380, 110, 90, '#9AA8BE') + I.box(-200, -50, 60, 40, 50, INK, 90) + I.box(-190, -44, 40, 8, 26, GR, 140) + I.box(40, -60, 120, 10, 160, '#D6E4FB', 90) + I.box(-80, 100, 90, 70, 150, INK) + I.box(-72, 104, 74, 6, 60, BL, 70), { size: 64 });
  }

  // ===== self-checkout, mobile banking, kiosks replace the counter (514.36 – 526.88) =====
  {
    const S = F.shot(514.36, 526.88, { cam: [960, 560, 1.0] });
    X.tiltIn(F, S, 514.36);
    X.room(F, S);
    F.set(S.mid, `<g filter="url(#cut)"><rect x="520" y="700" width="760" height="300" rx="10" fill="#9AA8BE"/><rect x="500" y="690" width="800" height="30" rx="8" fill="#C3CDDC"/></g>`, 4);
    const you = F.puppet(S, S.mid, 'you', 900, 760, 1.4, { mood: 'smile', armL: 'fwd', armR: 'fwd', headExtra: visor, z: 2 });
    for (let t = 514.6; t < 517; t += 0.5) F.sfx(t, 'blip', 0.25);
    const scan = F.html(S.mid, `<div style="width:120px;height:20px;border-radius:6px;background:${RD};box-shadow:0 0 20px ${RD}"></div>`, 1100, 676, 0, 0, 6);
    F.every(S, (G) => { scan.style.opacity = G < 517.2 && (G * 2) % 1 < 0.5 ? 1 : 0.2; });
    const mk = (x, html, wd, af, label) => { const d = F.html(S.mid, `<div style="display:flex;flex-direction:column;align-items:center;gap:12px">${html}<div style="padding:8px 16px;border-radius:10px;background:${INK};color:#fff;font:800 26px Inter;white-space:nowrap">${label}</div></div>`, x, 330, 0, 0, 5);
      gsap.set(d, { xPercent: -50 }); F.in(d, w(wd, af) - 0.25, 'above', { dur: 0.45, sfx: 'clunk', gain: 0.35 }); return d; };
    mk(230, `<div style="width:220px;height:300px;border-radius:16px;background:#3A4C74;padding:20px;box-sizing:border-box"><div style="height:120px;border-radius:8px;background:#D6E4FB"></div><div style="height:30px;margin-top:20px;border-radius:6px;background:${GR}"></div></div>`, 'self', 517.4, 'self-checkout');
    mk(1640, `<div style="width:150px;height:280px;border-radius:24px;background:${INK};padding:14px;box-sizing:border-box"><div style="height:100%;border-radius:14px;background:#fff;padding:12px;box-sizing:border-box;font:800 18px Inter;color:${INK}">Balance<div style="font:800 30px Inter;color:${GR}">$4,210</div><div style="height:40px;margin-top:14px;border-radius:8px;background:${BL}"></div></div></div>`, 'mobile', 518.7, 'mobile banking');
    mk(1340, `<div style="width:190px;height:300px;border-radius:14px;background:#5D6B88;padding:18px;box-sizing:border-box"><div style="height:110px;border-radius:8px;background:#D6E4FB"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:14px">${[...Array(9)].map(() => '<div style="height:24px;border-radius:4px;background:#C3CDDC"></div>').join('')}</div></div>`, 'kiosks', 520.3, 'automated kiosk');
    const closed = F.html(S.mid, `<div style="padding:14px 30px;border-radius:10px;background:${RD};color:#fff;font:400 48px 'Archivo Black';transform:rotate(-4deg)">CLOSED</div>`, 800, 790, 0, 0, 7);
    F.fromTo(closed, w('counter', 522.1), { opacity: 0, rotationX: -90, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0 }, 0.4, 'back.out(2)'); F.sfx(w('counter', 522.1), 'clack', 0.5);
    you.mood(w('replacing', 521.2), 'worry').arms(w('replacing', 521.2), 'down', 'down', 0.5);
    const sp = F.html(S.ui, `<svg width="300" height="190" viewBox="-150 -150 300 190"><g filter="url(#cut)"><path d="M-130 0 A130 130 0 0 1 130 0" stroke="#C3CDDC" stroke-width="30" fill="none"/><path d="M50 -120 A130 130 0 0 1 130 0" stroke="${RD}" stroke-width="30" fill="none"/></g><g class="nd"><path d="M0 0 L0 -110" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g><circle r="14" fill="${INK}"/></svg>`, 1560, 820, 0, 0, 9);
    gsap.set(sp, { xPercent: -50, yPercent: -50 }); F.in(sp, w('faster', 523.1) - 0.3, 'below', { dur: 0.35, sfx: false });
    F.fromTo(sp.querySelector('.nd'), w('faster', 523.1), { rotation: -80, transformOrigin: '0 0' }, { rotation: 62 }, 0.8, 'back.out(1.5)'); F.sfx(w('faster', 523.1), 'whoosh', 0.4);
    const am = F.hand(S.ui, 'fastest-shrinking physical job', 1520, 990, 46, RD, -2); F.in(am, w('physical', 524.8), 'none', { dur: 0.35, sfx: false });
    S.cam(514.5, 900, 640, 1.12, 1.5).cam(w('self', 517.4) - 0.5, 960, 560, 1.0, 1.4);
  }

  // ===== the switch: banker, merchant rep, showroom advisor (526.88 – 537.08) =====
  {
    const S = F.shot(526.88, 533.70, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 8, w('switch', 527.1), 2.8);
    const you = F.puppet(S, S.mid, 'you', 960, 930, 1.55, { mood: 'happy', armL: 'hip', armR: 'hip', look: { top: INK, top2: '#24365E' }, badge: `<circle cx="30" cy="-150" r="15" fill="${GR}"/>` });
    you.hop(w('personal', 528.1));
    X.role(F, S.ui, 'PERSONAL RELATIONSHIP BANKER', 1180, 130, w('relationship', 528.5) - 0.2, 52);
    const vig = [['💳', 'merchant services rep', 'merchant', 529.9, 420], ['🚗', 'high-ticket showroom advisor', 'high', 531.4, 1500]];
    vig.forEach(([e, t, wd, af, x]) => { const d = F.html(S.mid, `<div style="width:340px;padding:24px;border-radius:20px;background:#fff;box-shadow:0 16px 30px rgba(14,24,48,.2);text-align:center;font:800 30px Inter;color:${INK}"><div style="font-size:90px">${e}</div>${t}</div>`, x - 170, 380, 0, 0, 4); F.in(d, w(wd, af) - 0.2, x < 960 ? 'left' : 'right', { dur: 0.4, sfx: 'pop' }); });
    S.cam(527, 960, 560, 1.02, 6, 'inOutSine');
  }
  {
    const S = F.shot(533.70, 540.20, { cam: [960, 560, 1.0] });
    X.room(F, S, '#E5EAF2', '#CDD6E3', 860);
    F.set(S.back, `<g filter="url(#cut)" transform="translate(960 220) rotate(-2)"><rect x="-260" y="-120" width="520" height="250" fill="${WH}"/><path d="M-90 90 L0 0 L90 90Z" fill="${BL}"/><rect x="-60" y="90" width="120" height="10" fill="${INK}"/></g>` + F.T('NEW HOME?', 960, 150, 42, INK, 'Archivo Black'), 1);
    F.set(S.mid, P.desk(560, 800, 820), 5);
    const c1 = F.puppet(S, S.mid, 'client', 640, 820, 1.35, { mood: 'worry', armR: 'fwd', z: 3 }), c2 = F.puppet(S, S.mid, 'co1', 440, 820, 1.3, { mood: 'worry', look: { top: YL, top2: '#D99E00' }, z: 3 });
    const you = F.puppet(S, S.mid, 'you', 1260, 820, 1.45, { mood: 'smile', armL: 'fwd', flip: false, look: { top: INK, top2: '#24365E' }, z: 3 });
    const tf = w('face', 534.5);
    c1.mood(tf, 'smile'); c2.mood(tf + 0.2, 'smile'); you.nod(tf - 0.6, tf + 1.2);
    const sh = F.prop(S.ui, `<g filter="url(#cut)"><path d="M0 -130 L115 -88 Q124 70 0 140 Q-124 70 -115 -88Z" fill="${GR}"/><path d="M-44 0 l30 30 l62 -70" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round"/></g>`, 1640, 330, 280, 300, 9);
    F.in(sh, w('trusted', 533.8) - 0.1, 'right', { dur: 0.4, sfx: 'shimmer', gain: 0.4 });
    const th = F.hand(S.ui, 'a trusted human face', 1640, 540, 54, INK, -2); F.in(th, w('human', 534.2), 'none', { dur: 0.35, sfx: false });
    const big = F.label(S.ui, 'BIG FINANCIAL CHOICE', 960, 1000, { size: 50, bg: OR, color: WH, rot: -1 }); F.in(big, w('big', 535.6) - 0.1, 'below', { dur: 0.35 });
    F.out(big, w('already', 537.2) - 0.3, 'below', { dur: 0.3 }); const fc = F.label(S.ui, 'you already talk to customers face-to-face', 960, 1000, { size: 44, bg: BL, color: WH, rot: -1 }); F.in(fc, w('already', 537.2), 'below', { dur: 0.35, sfx: false });
    S.cam(533.8, 960, 540, 1.03, 6, 'inOutSine');
  }

  // ===== consultative sales skills that pay commission (540.20 – 543.88) =====
  {
    const S = F.shot(540.20, 543.88, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const steps = [['ASK', BL], ['LISTEN', OR], ['RECOMMEND', GR]].map(([t, c], i) => { const d = F.label(S.mid, t, 380 + i * 420, 360, { size: 60, bg: c, color: WH, rot: [-2, 1, -1][i], font: "'Archivo Black'", weight: 400, z: 3 }); F.in(d, 540.35 + i * 0.35, 'below', { dur: 0.35, sfx: 'clickin', gain: 0.35 }); return d; });
    const cs = F.hand(S.ui, 'consultative sales', 760, 200, 64, INK, -2); F.in(cs, w('sales', 541.9), 'none', { dur: 0.35, sfx: false });
    const coins = [...Array(6)].map((_, i) => { const c = F.prop(S.mid, `<g filter="url(#cut)"><ellipse rx="70" ry="22" fill="#D99E00"/><rect x="-70" y="-14" width="140" height="14" fill="${YL}"/><ellipse cy="-14" rx="70" ry="22" fill="${YL}"/></g>`, 1500, 820 - i * 30, 160, 70, 4 + i);
      F.fromTo(c, w('pay', 542.7) + i * 0.08, { opacity: 0, y: -260 }, { opacity: 1, y: 0 }, 0.3, 'power2.in'); F.sfx(w('pay', 542.7) + i * 0.08 + 0.28, 'coin', 0.3); return c; });
    const cm = F.label(S.ui, 'COMMISSION', 1500, 960, { size: 56, bg: GR, color: WH, rot: -2, font: "'Archivo Black'", weight: 400 }); F.in(cm, w('commission.', 542.9), 'below', { dur: 0.3, sfx: 'kaching', gain: 0.4 });
  }

  // ===== the prompt (543.88 – 566.76) =====
  {
    const S = F.shot(543.88, 566.76);
    X.prompt(F, S, 9, 'I have worked as a bank teller and cashier for [three years], and I want to pivot into consultative sales or personal relationship banking. Rewrite my resume bullets to highlight customer trust, upselling, and problem solving. Then, roleplay a 10-minute job interview with me for a relationship banker role, grading each of my answers and telling me how to sound more confident.', w('I', 545.9), w('confident.', 565.7) + 0.3, { tIn: 544.3, size: 40 });
  }
  F.done();
})();
