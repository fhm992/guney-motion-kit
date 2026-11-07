// j01 — Data Entry Clerk -> Data Quality Analyst (28.64 – 93.64)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const doc = (title, col = INK) => `<g filter="url(#cut)"><rect x="-110" y="-140" width="220" height="280" fill="${WH}"/>${F.T(title, 0, -90, 34, col)}${[0, 1, 2, 3].map(k => `<rect x="-80" y="${-58 + k * 38}" width="${160 - (k % 2) * 40}" height="10" fill="${C.grey}"/>`).join('')}<rect x="-80" y="94" width="160" height="26" fill="${YL}"/></g>`;
  const chip = (t) => `<div style="padding:10px 18px;border-radius:10px;background:${YL};font:800 30px Inter;color:${INK};white-space:nowrap;box-shadow:0 8px 14px rgba(14,24,48,.25)">${t}</div>`;

  // ===== chapter card (28.64 – 31.10) =====
  {
    const S = F.shot(28.64, 31.10);
    X.card(F, S, 1, 'DATA ENTRY CLERK', 28.75, (I) => I.box(-190, -130, 300, 150, 110, '#9AA8BE') + I.box(-160, -120, 140, 30, 120, INK, 110) + I.box(-150, -112, 120, 14, 100, '#D6E4FB', 116)
      + [0, 1, 2, 3].map(k => I.box(60 + k * 4, -110 + k * 34, 70, 50, 26 + k * 18, WH, 110)).join('') + I.box(-60, 80, 120, 120, 70, RD) + I.box(-60, 80, 120, 120, 4, WH, 70));
  }

  // ===== you at the desk; OCR + agents (31.10 – 36.12) =====
  {
    const S = F.shot(31.10, 36.12, { cam: [900, 560, 1.06] });
    X.tiltIn(F, S, 31.10);
    X.room(F, S);
    F.set(S.mid, P.desk(240, 760, 900), 2);
    const you = F.puppet(S, S.mid, 'you', 560, 900, 1.45, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    F.set(S.mid, P.laptopBack(700, 760, 0.8) + [0, 1, 2, 3, 4].map(k => P.sheet(980 + (k % 2) * 8, 700 - k * 18, k * 2 - 4, 0.8)).join(''), 3);
    for (let x = 31.2; x < 32.9; x += 0.13) F.sfx(x, 'key', 0.12);
    // the invoice + scan beam
    const inv = F.prop(S.mid, doc('INVOICE'), 1460, 470, 260, 320, 4); F.in(inv, w('optical', 32) - 0.3, 'right', { dur: 0.45 });
    const beam = F.html(S.mid, `<div style="width:300px;height:26px;background:linear-gradient(${RD}00,${RD}AA,${RD}00);box-shadow:0 0 30px ${RD}"></div>`, 1310, 320, 0, 0, 6);
    F.hidden(beam); F.show(beam, w('character', 33)); F.fromTo(beam, w('character', 33), { y: 0 }, { y: 290 }, 1.0, 'sine.inOut'); F.hide(beam, w('character', 33) + 1.05);
    F.sfx(w('character', 33), 'scrape', 0.4);
    const letters = ['$', '1', '2', '4', '0'].map((ch, i) => { const d = F.html(S.front, `<div style="font:400 64px 'Archivo Black';color:${RD}">${ch}</div>`, 1400 + i * 40, 520, 0, 0, 8); F.hidden(d);
      F.fromTo(d, w('recognition', 33) + i * 0.08, { opacity: 0, y: 0 }, { opacity: 1, y: -160 - i * 10 }, 0.6); F.to(d, w('recognition', 33) + 1.2, { opacity: 0 }, 0.3); return d; });
    const r1 = F.puppet(S, S.mid, 'intern', 1660, 900, 0.95, { mood: 'happy', armL: 'point', z: 5 }); r1.enter(w('optical', 32) - 0.4, 'right');
    const ra = F.puppet(S, S.mid, 'intern', 1250, 900, 0.7, { mood: 'neutral', armR: 'up', z: 5 }); ra.enter(w('automated', 34), 'right'); ra.walk(w('automated', 34), w('automated', 34) + 0.7);
    const rb = F.puppet(S, S.mid, 'intern', 1450, 930, 0.7, { mood: 'neutral', armL: 'up', z: 6 }); rb.enter(w('agents', 35), 'right'); rb.walk(w('agents', 35), w('agents', 35) + 0.7);
    you.mood(w('agents', 35), 'look').tilt(w('agents', 35), 6);
    S.cam(31.4, 820, 560, 1.1, 1.2).cam(w('optical', 32) - 0.5, 1180, 520, 1.06, 1.2).cam(w('automated', 34), 1040, 540, 1.0, 1.2);
  }

  // ===== pull numbers into the database (36.12 – 43.68) — isometric =====
  {
    const S = F.shot(36.12, 43.68, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const I = X.iso(1300, 560, 1);
    F.set(S.back, I.tile(-280, -280, 560, 560, '#D5DCE7'), 0);
    const db = F.set(S.mid, [0, 1, 2].map(k => I.cyl(0, 0, 150, 100, k % 2 ? '#2A62C9' : BL, k * 110)).join(''), 3);
    const dbl = F.label(S.ui, 'COMPANY DATABASE', 1300, 800, { size: 40, bg: INK, color: WH, rot: -1 }); F.in(dbl, w('databases', 40) - 0.2, 'below', { dur: 0.4 });
    F.fromTo(db, 36.15, { opacity: 0, y: 80 }, { opacity: 1, y: 0 }, 0.6, 'power3.out');
    const docs = [['INVOICE', 'invoices,', 36, 250, '$1,240.00'], ['RECEIPT', 'receipts,', 37.5, 540, '$86.50'], ['PDF', 'PDF', 38.5, 830, '#INV-3391']];
    docs.forEach(([n, word, af, y, val], i) => { const t = w(word, af); const d = F.prop(S.mid, doc(n, n === 'PDF' ? RD : INK), 270, y, 260, 320, 4); F.in(d, t - 0.25, 'left', { dur: 0.4 });
      const c = F.html(S.front, chip(val), 330, y - 30, 0, 0, 9); F.hidden(c);
      F.fromTo(c, t + 0.2, { opacity: 0, x: 0, y: 0, scale: 0.6 }, { opacity: 1, x: 120, y: -10, scale: 1 }, 0.35, 'back.out(2)'); F.sfx(t + 0.2, 'pop', 0.35);
      const ts = w('straight', 39) + i * 0.25; F.to(c, ts, { x: 900 - i * 10, y: 470 - y + 10, scale: 0.7, rotation: 10 }, 0.7, 'power2.in'); F.to(c, ts + 0.65, { opacity: 0 }, 0.1); F.sfx(ts, 'swish', 0.3); });
    const sw = F.prop(S.ui, P.stopwatch(0, 0, 0.62, '0:03'), 1680, 200, 220, 260, 10); F.in(sw, w('seconds', 41) - 0.1, 'none', { dur: 0.35, sfx: 'ding', gain: 0.5 });
    const ty = F.label(S.ui, '1,24O <span style="font-size:30px">← human typo</span>', 760, 980, { size: 52, bg: WH, color: INK, rot: -2 });
    F.in(ty, w('without', 41.5) - 0.1, 'below', { dur: 0.35 });
    const ring = F.html(S.ui, `<div style="width:120px;height:80px;border:7px solid ${RD};border-radius:50%"></div>`, 670, 935, 0, 0, 12); F.hidden(ring);
    F.fromTo(ring, w('typos.', 42), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1 }, 0.3); F.sfx(w('typos.', 42), 'marker', 0.4);
    const rob = F.puppet(S, S.mid, 'intern', 1700, 900, 0.75, { mood: 'proud', armR: 'up', z: 6 });
    S.cam(36.3, 960, 540, 1.03, 4, 'inOutSine');
  }

  // ===== never tired at 4pm (43.68 – 46.50) =====
  {
    const S = F.shot(43.68, 46.50, { cam: [960, 560, 1.02] });
    X.room(F, S);
    const ck = F.prop(S.back, P.clock(0, 0, 100, 4, 0, '4:00 PM'), 1500, 260, 260, 300, 2);
    F.set(S.mid, P.desk(220, 780, 760) + P.laptopBack(560, 780, 0.8), 2);
    const you = F.puppet(S, S.mid, 'you', 500, 920, 1.4, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    you.mood(w('tired', 44.5), 'yawn').mood(w('tired', 44.5) + 1.0, 'tired').slump(w('afternoon', 45.5), 10); F.sfx(w('tired', 44.5), 'yawn', 0.4);
    const rob = F.puppet(S, S.mid, 'intern', 1480, 960, 1.0, { mood: 'happy', armL: 'wave' }); rob.wave(w('never', 44), w('never', 44) + 1.4, 'l');
    const lb = F.hand(S.ui, 'never tired', 1360, 560, 60, RD, -3); F.in(lb, w('never', 44), 'none', { dur: 0.4, sfx: false });
    S.cam(43.8, 900, 560, 1.08, 2.6, 'inOutSine');
  }
  // ===== 500 rows in Excel (46.50 – 49.14) =====
  {
    const S = F.shot(46.50, 49.14, { cam: [960, 500, 1.0] });
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 960, 500, 0.9, 3);
    let rows = ''; for (let i = 0; i < 40; i++) rows += `<div style="display:flex;border-top:2px solid #E3E8F0;font:500 30px Inter"><div style="width:110px;padding:10px;background:#F4F6FA;color:#7D879A">${i + 1}</div><div style="flex:1;padding:10px">${['Acme Ltd', 'Northwind', 'Globex', 'Initech', 'Umbrella'][i % 5]}</div><div style="width:240px;padding:10px">${(1000 + i * 37) % 9000}</div></div>`;
    L.screen.innerHTML = `${F.winBar('rows.xlsx')}<div class="sc" style="position:relative">${rows}</div><div style="position:absolute;right:30px;bottom:24px;padding:14px 26px;border-radius:12px;background:${INK};color:#fff;font:800 54px Inter" class="ct">row 1</div>`;
    const sc = L.screen.querySelector('.sc'), ct = L.screen.querySelector('.ct'); const ta = w('staring', 46.5) - 0.1;
    F.every(S, (G) => { const u = Math.max(0, Math.min(1, (G - ta) / 1.6)); sc.style.transform = `translateY(${-(u * 1400) % 1400}px)`; ct.textContent = 'row ' + Math.max(1, Math.round(u * 500)); });
    for (let x = ta; x < ta + 1.6; x += 0.1) F.sfx(x, 'tick', 0.12);
    S.cam(46.6, 960, 520, 1.08, 2.4, 'inOutSine');
  }

  // ===== cutting pure typing roles first (49.14 – 51.82) =====
  {
    const S = F.shot(49.14, 51.82, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const box = (x, y, t, col) => `<g filter="url(#cut)"><rect x="${x - 120}" y="${y - 40}" width="240" height="80" rx="8" fill="${col}"/>${F.T(t, x, y + 12, 30, WH, 'Inter', 'middle', 'font-weight="800"')}</g>`;
    F.set(S.mid, `<path d="M960 250 V330 M440 330 H1480 M440 330 V400 M800 330 V400 M1120 330 V400 M1480 330 V400" stroke="${INK}" stroke-width="5" fill="none"/>` + box(960, 210, 'COMPANY', INK) + box(440, 440, 'SALES', BL) + box(1480, 440, 'FINANCE', BL), 2);
    const cuts = [[800, 440], [1120, 440]].map(([x, y], i) => { const d = F.prop(S.mid, box(0, 0, 'TYPING', RD), x, y, 260, 100, 3); const tc = w('cutting', 49) + 0.2 + i * 0.5;
      F.to(d, tc + 0.3, { y: 520, rotation: i ? 25 : -25, opacity: 0 }, 0.6, 'power2.in'); F.sfx(tc, 'snip', 0.6); return d; });
    const sc = F.prop(S.front, K.scissors(), 700, 380, 160, 200, 8); F.fromTo(sc, w('cutting', 49), { x: 0, rotation: -90, opacity: 0 }, { x: 420, rotation: -90, opacity: 1 }, 1.0, 'power1.inOut'); F.to(sc, w('first.', 50.5), { opacity: 0 }, 0.3);
    const lb = F.label(S.ui, 'TYPING ROLES GO FIRST', 960, 860, { size: 72, bg: RD, color: WH, rot: -1.5 }); F.in(lb, w('first.', 50.5) - 0.4, 'below', { dur: 0.4 });
  }

  // ===== the switch: data quality analyst audits the database (51.82 – 58.56) =====
  {
    const S = F.shot(51.82, 58.56, { cam: [960, 540, 1.0] });
    X.room(F, S);
    X.cornerBoard(F, S, 0, w('switch', 52), 3.2);
    const L = F.laptop(S.mid, 1170, 430, 0.6, 3);
    const data = [['M. Ortiz', 'mo@site.com', '12/03/2026', '$240'], ['K. Lee', 'klee@site.com', '31/02/2026', '$1,240'], ['K. Lee', 'klee@site.com', '31/02/2026', '$1,240'], ['A. Ruiz', '—', '05/04/2026', '$88'], ['J. Park', 'jp@site.com', '19/04/2026', '$412']];
    L.screen.innerHTML = `${F.winBar('Database audit')}<div style="padding:26px 30px"><div style="display:grid;grid-template-columns:240px 300px 260px 1fr;border:2px solid #E3E8F0;font:600 32px Inter">${['Customer', 'Email', 'Date', 'Total'].map(h => `<div style="padding:12px;background:#F4F6FA;font-weight:800">${h}</div>`).join('')}${data.map((r, i) => r.map((c, j) => `<div class="r${i}${j === 2 ? ' d' : ''}" style="padding:14px 12px;border-top:2px solid #E3E8F0">${c}</div>`).join('')).join('')}</div></div>`;
    const you = F.puppet(S, S.mid, 'you', 330, 1000, 1.55, { mood: 'smile', armR: 'down', z: 5, badge: `<circle cx="30" cy="-150" r="15" fill="${GR}"/>` });
    you.arm(w('audits', 54) - 0.2, 'r', 'point', 0.5);
    const mag = F.prop(S.front, K.magnifier(70), 900, 400, 220, 220, 9); F.hidden(mag);
    const ta = w('audits', 54);
    F.fromTo(mag, ta, { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: 120, y: 30 }, 0.5); F.to(mag, ta + 0.6, { x: 420, y: 80 }, 1.0, 'sine.inOut'); F.sfx(ta, 'swish', 0.35);
    const te = w('weird', 56); F.to(mag, te - 0.4, { x: 340, y: 110 }, 0.5);
    ['r1', 'r2'].forEach((r, k) => L.screen.querySelectorAll('.' + r).forEach((c) => F.fromTo(c, te + k * 0.4, { backgroundColor: 'rgba(234,67,53,0)' }, { backgroundColor: 'rgba(234,67,53,.16)' }, 0.3)));
    L.screen.querySelectorAll('.r1.d').forEach((c) => F.fromTo(c, te, { color: INK }, { color: RD }, 0.2));
    F.sfx(te, 'ping', 0.4); F.sfx(te + 0.4, 'ping', 0.3);
    const ec = F.hand(S.ui, 'Feb 31st? doesn’t exist', 1300, 840, 52, RD, -2); F.in(ec, w('edge', 56.5), 'none', { dur: 0.35, sfx: false });
    const dup = F.hand(S.ui, '+ a duplicate', 1300, 905, 46, RD, -2); F.in(dup, w('cases', 56.8), 'none', { dur: 0.35, sfx: false });
    const rob = F.puppet(S, S.mid, 'intern', 1760, 960, 0.7, { mood: 'neutral', z: 6 });
    rob.arms(w('misses,', 57.5), 'out', 'out', 0.3).mood(w('misses,', 57.5), 'twitch'); F.sfx(w('misses,', 57.5), 'boop', 0.4);
    X.role(F, S.ui, 'DATA QUALITY ANALYST', 760, 960, w('data', 53) - 0.1, 56);
    S.cam(52, 960, 520, 1.02, 1.4).cam(te - 0.5, 1000, 500, 1.05, 1.2);
  }

  // ===== fixes broken pipelines (58.56 – 61.18) =====
  {
    const S = F.shot(58.56, 61.18, { cam: [960, 540, 1.04] });
    S.el.style.backgroundColor = '#E9EDF3';
    F.set(S.mid, `<g filter="url(#cut)"><rect x="-100" y="470" width="900" height="90" fill="#8C97AA"/><rect x="1060" y="470" width="1000" height="90" fill="#8C97AA"/><rect x="780" y="455" width="40" height="120" rx="6" fill="#5D6B88"/><rect x="1040" y="455" width="40" height="120" rx="6" fill="#5D6B88"/></g>`, 2);
    const gap = F.set(S.mid, `<g filter="url(#cut)"><path d="M820 480 L900 470 L880 515 L940 505 L920 560 L820 560Z" fill="#8C97AA"/><path d="M1040 480 L980 470 L1000 520 L960 512 L975 560 L1040 560Z" fill="#8C97AA"/></g>`, 3);
    const tape = F.set(S.mid, `<g filter="url(#cut)"><rect x="800" y="458" width="300" height="114" rx="10" fill="${YL}"/><path d="M820 470 L1080 560 M820 560 L1080 470" stroke="#D99E00" stroke-width="6"/></g>`, 4); F.hidden(tape);
    const leak = [...Array(6)].map((_, i) => { const d = F.html(S.mid, chip(['7', '3', '$', '0', '9', '#'][i]), 900 + (i % 3) * 20, 560, 0, 0, 5); F.fromTo(d, 58.6 + i * 0.18, { y: 0, opacity: 1 }, { y: 380, opacity: 0 }, 0.9, 'power2.in'); F.hide(d, 59.9); return d; });
    const flow = [...Array(8)].map((_, i) => { const d = F.html(S.mid, `<div style="width:40px;height:40px;border-radius:50%;background:${GR}"></div>`, -40, 495, 0, 0, 6); F.hidden(d); F.fromTo(d, w('pipelines.', 59.5) + 0.3 + i * 0.12, { x: 0, opacity: 1 }, { x: 2100, opacity: 1 }, 1.6, 'none'); return d; });
    const you = F.puppet(S, S.mid, 'you', 940, 960, 1.15, { mood: 'smile', armL: 'up', armR: 'up', z: 7 });
    F.show(tape, w('fixes', 58.6) + 0.3); F.fromTo(tape, w('fixes', 58.6) + 0.3, { scaleX: 0 }, { scaleX: 1 }, 0.4); F.sfx(w('fixes', 58.6) + 0.3, 'tear', 0.5);
    you.mood(w('pipelines.', 59.5) + 0.3, 'happy'); F.sfx(w('pipelines.', 59.5) + 0.3, 'chime', 0.4);
    const lb = F.label(S.ui, 'FIX THE PIPELINE', 960, 200, { size: 70, bg: INK, color: WH, rot: -1 }); F.in(lb, w('broken', 59), 'above', { dur: 0.4 });
  }

  // ===== prepare: dirty data + cleaning rules (61.18 – 68.12) =====
  {
    const S = F.shot(61.18, 68.12, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 860);
    const sheet = F.html(S.mid, `<div style="width:900px;background:#fff;border-radius:10px;padding:26px;box-shadow:0 20px 40px rgba(14,24,48,.18);font:600 32px Inter;color:${INK}">
      ${[['john SMITH ', 'NY'], ['Mary Jones', ''], ['mary jones', 'ny'], ['  Ali Khan', 'N.Y.'], ['Sara Lee', 'NY']].map((r, i) => `<div style="display:flex;border-top:2px solid #E3E8F0;position:relative"><div style="flex:1;padding:12px">${r[0]}</div><div style="width:200px;padding:12px">${r[1] || '<i style="color:#B3BCCB">empty</i>'}</div><div class="sm${i}" style="position:absolute;left:${80 + i * 130}px;top:6px;width:90px;height:40px;border-radius:50%;background:rgba(90,70,40,.18);opacity:0"></div></div>`).join('')}</div>`, 140, 220, 0, 0, 3);
    F.in(sheet, 61.3, 'left', { dur: 0.5 });
    const td = w('dirty', 63.5); [0, 1, 2, 3].forEach((i) => F.fromTo(sheet.querySelector('.sm' + i), td + i * 0.1, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1 }, 0.3));
    F.sfx(td, 'sand', 0.4);
    const you = F.puppet(S, S.mid, 'you', 1240, 960, 1.45, { mood: 'look', armR: 'down', flip: true, z: 4 });
    you.arm(w('spot', 63.4) - 0.2, 'r', 'point', 0.4).mood(w('spot', 63.4), 'sly');
    const rules = [['TRIM', BL], ['DEDUPE', OR], ['FORMAT', GR]].map(([t, c], i) => { const l = F.label(S.ui, t, [1120, 1400, 1720][i], 220, { size: 50, bg: c, color: WH, rot: [-4, 3, -2][i], font: "'Archivo Black'", weight: 400 });
      F.in(l, w('cleaning', 65) + i * 0.3, 'above', { dur: 0.35, sfx: 'sticky', gain: 0.45 }); return l; });
    const ai = F.hand(S.ui, 'written with AI', 1420, 330, 50, '#5D6B88', -3); F.in(ai, w('ChatGPT.', 66), 'none', { dur: 0.4, sfx: false });
    S.cam(61.3, 760, 520, 1.08, 1.4).cam(w('cleaning', 65) - 0.3, 1060, 480, 1.0, 1.2);
  }

  // ===== the prompt (68.12 – 87.88) =====
  {
    const S = F.shot(68.12, 87.88);
    X.prompt(F, S, 1, 'Act as a senior data analyst. Give me a sample table of 20 messy customer records with missing values, duplicate rows, and formatting errors. Walk me through five steps to audit and clean this data using basic Excel rules and explain how to set up an automated check for my manager.', w('Act', 71), w('manager.', 86) + 0.5, { tIn: 68.6 });
  }

  // ===== practice 3x, then the interview (87.88 – 93.64) =====
  {
    const S = F.shot(87.88, 90.70, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const cal = F.html(S.mid, `<div style="display:flex;gap:18px">${['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, i) => `<div style="width:230px;height:300px;border-radius:14px;background:#fff;box-shadow:0 16px 30px rgba(14,24,48,.18);overflow:hidden"><div style="height:70px;background:${INK};color:#fff;font:400 34px 'Archivo Black';display:grid;place-items:center">${d}</div><div class="k${i}" style="height:230px;display:grid;place-items:center;font:800 130px Inter;color:${GR};opacity:0">✓</div></div>`).join('')}</div>`, 340, 300, 0, 0, 3);
    F.in(cal, 87.9, 'below', { dur: 0.45 });
    [0, 2, 4].forEach((d, i) => { const t = w('three', 88.5) + i * 0.35; F.fromTo(cal.querySelector('.k' + d), t, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(t + 0.2, 'tick', 0.6); });
    const lb = F.label(S.ui, '3× THIS WEEK', 960, 840, { size: 80, bg: YL, color: INK, rot: -2, font: "'Archivo Black'", weight: 400 }); F.in(lb, w('times', 89), 'below', { dur: 0.4 });
  }
  {
    const S = F.shot(90.70, 93.64, { cam: [960, 560, 1.0] });
    X.room(F, S, '#E5EAF2', '#CDD6E3', 830);
    F.set(S.mid, P.desk(560, 760, 800), 4);
    const iv = F.puppet(S, S.mid, 'exec', 1250, 800, 1.4, { mood: 'neutral', flip: true, z: 3 });
    const you = F.puppet(S, S.mid, 'you', 640, 800, 1.45, { mood: 'smile', armR: 'fwd', z: 3 });
    const b = F.html(S.ui, `<div style="background:#fff;border-radius:22px;padding:22px 28px;box-shadow:0 14px 26px rgba(14,24,48,.2);font:700 30px Inter;color:${INK}">“Here’s how I audit data…”<div style="display:grid;grid-template-columns:repeat(3,70px);gap:8px;margin-top:14px">${[GR, GR, RD, GR, YL, GR].map(c => `<div style="height:24px;border-radius:6px;background:${c}"></div>`).join('')}</div></div>`, 300, 200, 0, 0, 10);
    F.in(b, w('talk', 90.4) + 0.2, 'below', { dur: 0.4, sfx: 'pop' });
    iv.nod(w('interview.', 92), 93.6).mood(w('interview.', 92), 'smile'); F.sfx(w('interview.', 92), 'warm', 0.4);
    const lb = F.label(S.ui, 'NEXT INTERVIEW: READY', 1300, 960, { size: 56, bg: GR, color: WH, rot: -1.5 }); F.in(lb, w('next', 91.8), 'below', { dur: 0.4 });
    S.cam(90.8, 960, 520, 1.08, 2.6, 'inOutSine');
  }
  F.done();
})();
