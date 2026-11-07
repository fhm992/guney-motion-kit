// j04 — Basic Bookkeeper -> Fractional Financial Analyst / Cash-Flow Advisor (224.08 – 277.32)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const apron = { top: OR, top2: C.orange2 };
  const calc = `<g filter="url(#cut)"><rect x="-70" y="-90" width="140" height="180" rx="14" fill="${INK}"/><rect x="-54" y="-74" width="108" height="40" rx="6" fill="#B9E3C6"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${-50 + c * 36}" y="${-22 + r * 34}" width="28" height="26" rx="5" fill="${r === 2 && c === 2 ? OR : '#3A4C74'}"/>`).join('')).join('')}</g>`;

  // ===== card (224.08 – 226.34) =====
  {
    const S = F.shot(224.08, 226.34);
    X.card(F, S, 4, 'BASIC BOOKKEEPER', 224.2, (I) => I.box(-190, -120, 320, 150, 100, '#9AA8BE') + [0, 1, 2].map(k => I.box(-150, -100 + k * 4, 110, 80, 22, [BL, GR, RD][k], 100 + k * 22)).join('') + I.box(40, -80, 60, 80, 16, INK, 100) + [[-40, 100], [60, 130]].map(([u, v]) => I.box(u, v, 60, 40, 8, WH)).join(''));
  }

  // ===== you, the calculator, receipts (226.34 – 228.54) =====
  {
    const S = F.shot(226.34, 228.54, { cam: [900, 560, 1.08] });
    X.tiltIn(F, S, 226.34);
    X.room(F, S);
    F.set(S.mid, P.desk(260, 780, 900), 3);
    const you = F.puppet(S, S.mid, 'you', 560, 920, 1.45, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    F.prop(S.mid, calc, 760, 720, 160, 200, 4);
    [...Array(8)].forEach((_, i) => { const r = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-40 -60 H40 V60 L28 52 L14 60 L0 52 L-14 60 L-28 52 L-40 60Z" fill="#fff"/><rect x="-26" y="-40" width="52" height="7" fill="${C.grey}"/><rect x="-26" y="-24" width="40" height="7" fill="${C.grey}"/></g>`, 980 + (i % 4) * 90, 700 - Math.floor(i / 4) * 40, 100, 140, 4 + i);
      F.in(r, 226.4 + i * 0.15, 'above', { dur: 0.3, rot: (i * 17) % 20 - 10, sfx: i % 3 ? false : 'flick', gain: 0.25 }); });
    for (let x = 226.5; x < 228.4; x += 0.18) F.sfx(x, 'click', 0.12);
    S.cam(226.5, 820, 580, 1.14, 2, 'inOutSine');
  }

  // ===== the platform categorises, matches, reconciles (228.54 – 234.58) =====
  {
    const S = F.shot(228.54, 234.58, { cam: [960, 500, 1.0] });
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 690, 480, 0.76, 3);
    const tx = [['Coffee beans supplier', '-$640', 'Supplies', OR], ['Card payments', '+$2,310', 'Revenue', GR], ['Rent · April', '-$1,800', 'Rent', BL], ['Payroll', '-$3,120', 'Payroll', '#8C97AA'], ['Equipment lease', '-$420', 'Equipment', '#D99E00']];
    L.screen.innerHTML = `${F.winBar('Bank feed · accounting platform')}<div style="padding:22px 34px;font:600 32px Inter">${tx.map(([n, a, c, col], i) => `<div style="display:flex;align-items:center;gap:18px;padding:20px 8px;border-bottom:2px solid #E3E8F0"><div style="flex:1">${n}</div><div style="width:160px;text-align:right;font-weight:800">${a}</div><div class="pill p${i}" style="width:220px;text-align:center;padding:8px;border-radius:30px;background:${col};color:#fff;font-weight:800;opacity:0">${c}</div><div class="rc r${i}" style="width:60px;height:46px;border-radius:6px;border:3px dashed #C3CDDC"></div></div>`).join('')}</div>`;
    const tc = w('categorize', 229.5);
    tx.forEach((_, i) => { const pl = L.screen.querySelector('.p' + i); F.fromTo(pl, tc + i * 0.18, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 }, 0.25, 'back.out(2)'); F.sfx(tc + i * 0.18, 'clickin', 0.3); });
    const tm = w('match', 231.4);
    tx.forEach((_, i) => { const r = L.screen.querySelector('.r' + i); F.fromTo(r, tm + i * 0.15, { backgroundColor: 'rgba(52,168,83,0)', borderColor: '#C3CDDC' }, { backgroundColor: 'rgba(52,168,83,1)', borderColor: '#34A853' }, 0.2); F.sfx(tm + i * 0.15, 'zip', 0.2); });
    const lbls = [['CATEGORIZE', tc, BL], ['MATCH RECEIPTS', tm, OR], ['RECONCILE', w('reconcile', 232.5), GR]].map(([t, at, c], i) => { const l = F.label(S.ui, t, 1630, 260 + i * 150, { size: 46, bg: c, color: WH, rot: [-2, 2, -1][i] }); F.in(l, at - 0.1, 'right', { dur: 0.35, sfx: false }); return l; });
    const sc = F.html(S.ui, `<svg width="300" height="220" viewBox="-150 -110 300 220"><g filter="url(#cut)"><rect x="-6" y="-80" width="12" height="160" fill="${INK}"/><rect x="-60" y="76" width="120" height="16" rx="6" fill="${INK}"/><g class="beam"><rect x="-130" y="-86" width="260" height="10" rx="5" fill="${INK}"/><path d="M-120 -76 l-26 60 h52z M120 -76 l-26 60 h52z" fill="${YL}"/></g></g></svg>`, 1630, 780, 0, 0, 9);
    gsap.set(sc, { xPercent: -50, yPercent: -50 }); F.in(sc, w('statements', 233.3) - 0.3, 'below', { dur: 0.35, sfx: 'settle', gain: 0.3 });
    const beam = sc.querySelector('.beam'); F.fromTo(beam, w('automatically', 233.8), { rotation: -12, transformOrigin: '50% 50%' }, { rotation: 0 }, 0.5, 'back.out(2)'); F.sfx(w('automatically', 233.8) + 0.4, 'ding', 0.4);
    S.cam(228.6, 960, 500, 1.0, 4, 'inOutSine');
  }

  // ===== Friday afternoon: you still keying, AI already done (234.58 – 238.02) =====
  {
    const S = F.shot(234.58, 238.02, { cam: [960, 560, 1.02] });
    X.room(F, S);
    const cal = F.prop(S.back, K.calendar('FRIDAY', '4:45', 'pm'), 960, 300, 300, 320, 2);
    F.set(S.mid, P.desk(160, 780, 700), 3);
    const you = F.puppet(S, S.mid, 'you', 430, 920, 1.45, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    F.prop(S.mid, calc, 640, 720, 160, 200, 4);
    for (let x = 234.7; x < 237.9; x += 0.16) F.sfx(x, 'click', 0.1);
    F.every(S, (G) => { you.armR.wob.style.transform = `rotate(${4 * Math.sin(G * 30)}deg)`; });
    const rob = F.puppet(S, S.mid, 'intern', 1500, 960, 1.2, { mood: 'proud', armL: 'up', armR: 'down' });
    const done = F.label(S.mid, 'DONE ✓', 1380, 450, { size: 64, bg: GR, color: WH, rot: -6, font: "'Archivo Black'", weight: 400, z: 6 }); F.in(done, w('without', 234.5), 'above', { dur: 0.4, sfx: 'stamp', gain: 0.4 });
    you.mood(w('Friday', 236.7), 'worry').tilt(w('Friday', 236.7), -5);
    S.cam(234.7, 960, 540, 1.05, 3, 'inOutSine');
  }

  // ===== the switch (238.02 – 242.00) =====
  {
    const S = F.shot(238.02, 242.00, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 3, w('switch', 238.3), 2.6);
    const you = F.puppet(S, S.mid, 'you', 960, 920, 1.6, { mood: 'smile', armR: 'hip', armL: 'hip', look: { top: INK, top2: '#24365E' }, badge: `<circle cx="30" cy="-150" r="15" fill="${GR}"/>` });
    you.hop(w('fractional', 239.3));
    X.role(F, S.ui, 'FRACTIONAL FINANCIAL ANALYST', 1240, 160, w('fractional', 239.3), 50);
    X.role(F, S.ui, 'CASH-FLOW ADVISOR', 1240, 260, w('cash', 240.9), 60);
    const chart = F.html(S.mid, `<svg width="360" height="260" viewBox="0 0 360 260"><g filter="url(#cut)"><rect width="360" height="260" rx="14" fill="#fff"/><path d="M30 210 L110 160 L190 180 L270 90 L330 60" stroke="${GR}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`, 1360, 520, 0, 0, 3);
    F.in(chart, w('analyst', 240.2), 'right', { dur: 0.4, sfx: 'pop' });
  }

  // ===== local owners: balanced but tight (242.00 – 247.94) =====
  {
    const S = F.shot(242.00, 247.94, { cam: [960, 560, 1.0] });
    X.room(F, S, '#F3E9DC', '#D9C9B0', 840);
    F.set(S.back, `<g filter="url(#cut)"><rect x="120" y="140" width="520" height="140" rx="10" fill="${INK}"/></g>` + F.T('LOCAL CAFÉ', 380, 232, 56, YL, 'Archivo Black'), 1);
    const own = F.puppet(S, S.mid, 'client', 520, 960, 1.55, { mood: 'smile', armL: 'down', look: apron });
    own.mood(w('no', 245), 'worry').tilt(w('no', 245), -6).arm(w('tight.', 247.1), 'r', 'hold', 0.3);
    const sc = F.html(S.mid, `<svg width="300" height="220" viewBox="-150 -110 300 220"><g filter="url(#cut)"><rect x="-6" y="-80" width="12" height="160" fill="${INK}"/><rect x="-60" y="76" width="120" height="16" rx="6" fill="${INK}"/><rect x="-130" y="-86" width="260" height="10" rx="5" fill="${INK}"/><path d="M-120 -76 l-26 60 h52z M120 -76 l-26 60 h52z" fill="${YL}"/></g></svg>`, 860, 480, 0, 0, 4);
    F.in(sc, w('balanced', 244.1) - 0.3, 'below', { dur: 0.4, sfx: 'settle', gain: 0.3 });
    const ok = F.label(S.mid, 'BALANCED ✓', 1010, 450, { size: 40, bg: GR, color: WH, rot: -4, z: 5 }); F.in(ok, w('balanced', 244.1), 'none', { dur: 0.3, sfx: 'tick', gain: 0.4 });
    const card = F.html(S.mid, `<div style="width:420px;height:250px;border-radius:22px;background:${INK};padding:26px 32px;box-sizing:border-box;box-shadow:0 22px 40px rgba(14,24,48,.35)"><div style="font:800 30px Inter;color:#7F8BA3">BANK ACCOUNT</div><div class="bal" style="font:400 92px 'Archivo Black';color:${RD};margin-top:20px">$1,084</div></div>`, 1260, 360, 0, 0, 5);
    F.in(card, w('bank', 246) - 0.3, 'right', { dur: 0.4 });
    const vl = F.html(S.mid, `<div style="width:60px;height:300px;background:#8C97AA;border-radius:8px"></div>`, 1170, 330, 0, 0, 6), vr = F.html(S.mid, `<div style="width:60px;height:300px;background:#8C97AA;border-radius:8px"></div>`, 1710, 330, 0, 0, 6);
    [vl, vr].forEach((v, i) => { F.in(v, w('still', 246.5), i ? 'right' : 'left', { dur: 0.3, sfx: false }); F.to(v, w('tight.', 247.1), { x: i ? -36 : 36 }, 0.25, 'power2.in'); });
    F.fromTo(card, w('tight.', 247.1) + 0.2, { scaleX: 1 }, { scaleX: 0.93 }, 0.2); F.sfx(w('tight.', 247.1), 'creak', 0.5);
    const tt = F.hand(S.ui, 'but it still feels tight', 1480, 720, 58, RD, -3); F.in(tt, w('feels', 246.8), 'none', { dur: 0.35, sfx: false });
    S.cam(242.1, 900, 560, 1.03, 1.5).cam(w('bank', 246) - 0.4, 1000, 540, 1.02, 1.2);
  }

  // ===== dry balance sheets -> plain English advice (247.94 – 255.16) =====
  {
    const S = F.shot(247.94, 255.16, { cam: [960, 560, 1.0] });
    X.room(F, S);
    const dry = F.html(S.mid, `<div style="width:380px;background:#EDE6D6;border-radius:6px;padding:26px;box-sizing:border-box;box-shadow:0 16px 30px rgba(14,24,48,.2);font:600 22px 'JetBrains Mono',monospace;color:#7D879A;line-height:1.7">BALANCE SHEET<br>AR ....... 18,400<br>AP ....... 22,900<br>DSO ...... 61 days<br>Inventory  9,120</div>`, 130, 330, 0, 0, 3);
    F.in(dry, w('dry', 250.2) - 0.4, 'left', { dur: 0.4 });
    const you = F.puppet(S, S.mid, 'you', 900, 940, 1.5, { mood: 'smile', armL: 'down', armR: 'down', look: { top: INK, top2: '#24365E' } });
    you.arm(w('translating', 249.7), 'l', 'point', 0.4).arm(w('plain', 251.7), 'l', 'down', 0.3).arm(w('plain', 251.7), 'r', 'fwd', 0.4);
    const arr = F.set(S.mid, `<path d="M560 520 Q 700 440 780 500" stroke="${YL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M780 500 l-34 -6 m34 6 l-14 -30" stroke="${YL}" stroke-width="8" stroke-linecap="round"/>`, 8);
    F.fromTo(arr, w('translating', 249.7) + 0.2, { opacity: 0 }, { opacity: 1 }, 0.3);
    const adv = F.html(S.ui, `<div style="width:520px;background:#fff;border-radius:24px;padding:26px 30px;box-shadow:0 16px 30px rgba(14,24,48,.2);font:700 38px/1.3 Inter;color:${INK}">“You pay suppliers in 30 days, but customers pay you in 61. That’s the squeeze.”</div>`, 1180, 220, 0, 0, 9);
    F.in(adv, w('plain', 251.7), 'right', { dur: 0.45, sfx: 'chime', gain: 0.4 });
    const pe = F.label(S.ui, 'PLAIN ENGLISH', 1440, 165, { size: 50, bg: GR, color: WH, rot: -2 }); F.in(pe, w('English', 252), 'below', { dur: 0.35, sfx: false });
    const own = F.puppet(S, S.mid, 'client', 1560, 960, 1.35, { mood: 'happy', armL: 'fwd', look: apron, flip: true });
    own.enter(w('small', 253) - 0.3, 'right');
    const chq = F.prop(S.mid, K.paycheck('$ FEE'), 1300, 700, 320, 160, 8); F.in(chq, w('gladly', 254.1), 'right', { dur: 0.4, sfx: 'kaching', gain: 0.4 });
    S.cam(248, 960, 560, 1.02, 6, 'inOutSine');
  }

  // ===== the prompt (255.16 – 277.32) =====
  {
    const S = F.shot(255.16, 277.32);
    X.prompt(F, S, 4, 'Act as a small business chief financial officer. I am a bookkeeper transitioning into financial advisory. Give me a sample profit and loss statement for a local service business that has rising revenue but shrinking cash flow. Teach me how to spot the three biggest money leaks and write a five-minute script to explain the fix to the business owner in plain English.', w('Act', 257.8), w('English.', 276.2) + 0.4, { tIn: 255.6, size: 40 });
  }
  F.done();
})();
