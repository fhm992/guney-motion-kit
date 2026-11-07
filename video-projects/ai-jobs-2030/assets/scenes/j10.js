// j10 — Appointment Setter & Telemarketer -> Account Executive / RevOps (566.76 – 617.70)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const headset = `<path d="M-58 -268 Q0 -352 58 -268" stroke="${INK}" stroke-width="9" fill="none"/><rect x="-68" y="-286" width="20" height="38" rx="7" fill="${INK}"/><rect x="48" y="-286" width="20" height="38" rx="7" fill="${INK}"/><path d="M-60 -252 Q-54 -214 -20 -220" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="-16" cy="-220" r="8" fill="${RD}"/>`;
  const rheadset = `<path d="M-80 -250 Q0 -360 80 -250" stroke="${INK}" stroke-width="10" fill="none"/><rect x="-92" y="-262" width="22" height="44" rx="8" fill="${INK}"/><rect x="70" y="-262" width="22" height="44" rx="8" fill="${INK}"/>`;

  // ===== card (566.76 – 569.74) =====
  {
    const S = F.shot(566.76, 569.74);
    X.card(F, S, 10, 'APPOINTMENT SETTER', 566.9, (I) => I.box(-190, -120, 320, 150, 100, '#9AA8BE') + I.box(-150, -100, 60, 40, 40, INK, 100) + I.box(-140, -94, 40, 8, 6, RD, 140) + I.box(0, -100, 110, 80, 4, WH, 100) + I.box(-40, 90, 100, 80, 60, INK) + I.box(-34, 96, 88, 6, 6, '#D6E4FB', 60));
  }

  // ===== the cold script; AI callers + email sequences (569.74 – 577.80) =====
  {
    const S = F.shot(569.74, 573.10, { cam: [900, 560, 1.06] });
    X.tiltIn(F, S, 569.74);
    X.room(F, S);
    F.set(S.mid, P.desk(240, 780, 800), 3);
    const you = F.puppet(S, S.mid, 'you', 560, 920, 1.45, { mood: 'neutral', armL: 'hold', armR: 'type', headExtra: headset, z: 1 });
    const sc = F.html(S.mid, `<div style="width:300px;padding:22px;border-radius:8px;background:#fff;box-shadow:0 14px 26px rgba(14,24,48,.2);font:600 24px/1.5 'JetBrains Mono',monospace;color:${INK};transform:rotate(-3deg)">COLD SCRIPT<br>“Hi, is this a good time…”<br>“I’ll only take a minute…”</div>`, 880, 480, 0, 0, 5);
    F.in(sc, w('cold', 571.4) - 0.3, 'right', { dur: 0.35, sfx: 'paperslide', gain: 0.35 });
    F.sfx(w('phone,', 572.3), 'ring', 0.3); F.sfx(w('phone,', 572.3) + 0.5, 'click', 0.5);
    const hu = F.hand(S.ui, '*click* — hung up', 1380, 300, 58, RD, -3); F.in(hu, w('phone,', 572.3) + 0.5, 'none', { dur: 0.3, sfx: false });
    you.mood(w('phone,', 572.3) + 0.5, 'sad');
    S.cam(569.9, 780, 560, 1.1, 3, 'inOutSine');
  }
  {
    const S = F.shot(573.10, 581.46, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const bots = [...Array(6)].map((_, i) => { const b = F.puppet(S, S.mid, 'intern', 180 + i * 150, 960 - (i % 2) * 24, 0.62, { mood: 'happy', armR: 'up', headExtra: rheadset, z: 3 + (i % 2) }); b.enter(w('voice', 573.7) - 0.3 + i * 0.1, 'below'); return b; });
    F.sfx(w('voice', 573.7), 'ring', 0.25); F.sfx(w('voice', 573.7) + 0.3, 'ring', 0.2);
    const env = [...Array(8)].map((_, i) => { const e = F.html(S.mid, `<svg width="90" height="64"><g filter="url(#cutflat)"><rect x="2" y="2" width="86" height="60" rx="4" fill="#fff"/><path d="M2 2 L45 36 L88 2" stroke="${RD}" stroke-width="4" fill="none"/></g></svg>`, 150 + i * 100, 300 - (i % 2) * 60, 0, 0, 3);
      F.fromTo(e, w('email', 574.7) + i * 0.1, { opacity: 0, x: -120, rotation: -20 }, { opacity: 1, x: 0, rotation: (i * 9) % 30 - 15 }, 0.35); return e; });
    F.sfx(w('email', 574.7), 'flutter', 0.35);
    const dl = F.label(S.ui, '<span class="n">0</span> dials', 1400, 860, { size: 56, bg: YL, color: INK, rot: -3, font: "'Archivo Black'", weight: 400 }); F.in(dl, w('dial', 576) - 0.1, 'left', { dur: 0.3, sfx: false });
    const n = dl.querySelector('.n'); F.every(S, (G) => { const u = Math.max(0, Math.min(1, (G - w('dial', 576)) / 1.2)); n.textContent = Math.round(1000 * u).toLocaleString('en-US') + (u >= 1 ? 's' : ''); });
    for (let x = w('dial', 576); x < w('dial', 576) + 1.2; x += 0.08) F.sfx(x, 'tick', 0.12);
    const ob = F.html(S.ui, `<div style="display:flex;flex-direction:column;gap:12px;font:700 28px Inter"><div class="q" style="align-self:flex-start;padding:14px 20px;border-radius:18px;background:#fff;color:${INK};box-shadow:0 10px 18px rgba(14,24,48,.15)">“Not interested.”</div><div class="a" style="align-self:flex-end;padding:14px 20px;border-radius:18px;background:${RD};color:#fff">“Totally fair — can I send a 2-min summary?”</div></div>`, 120, 420, 0, 0, 9);
    F.in(ob.querySelector('.q'), w('handle', 577.8) - 0.2, 'left', { dur: 0.3, sfx: 'pop', gain: 0.3 }); F.in(ob.querySelector('.a'), w('objections,', 578.3), 'right', { dur: 0.3, sfx: 'blip', gain: 0.3 });
    const L = F.laptop(S.mid, 1400, 450, 0.52, 3);
    L.screen.innerHTML = `${F.winBar('Calendar')}<div style="padding:26px;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;font:800 30px Inter">${['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d) => `<div style="text-align:center;color:#7D879A">${d}</div>`).join('')}${[...Array(20)].map((_, i) => `<div class="s${i}" style="height:120px;border-radius:10px;background:#F4F6FA;color:#fff;padding:10px;box-sizing:border-box">${(i * 7) % 5 < 3 ? '<span class="t" style="opacity:0">Booked</span>' : ''}</div>`).join('')}</div>`;
    let k = 0; [...Array(20)].forEach((_, i) => { if ((i * 7) % 5 >= 3) return; const sl = L.screen.querySelector('.s' + i), t = w('book', 579.3) + k * 0.12; k++;
      F.fromTo(sl, t, { backgroundColor: '#F4F6FA' }, { backgroundColor: '#34A853' }, 0.2); F.fromTo(sl.querySelector('.t'), t, { opacity: 0 }, { opacity: 1 }, 0.2); F.sfx(t, 'clickin', 0.15); });
    S.cam(573.2, 960, 540, 1.02, 8, 'inOutSine');
  }

  // ===== the switch: builds the outreach system, closes big deals (581.46 – 590.88) =====
  {
    const S = F.shot(581.46, 590.88, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 9, w('switch', 581.8), 2.8);
    X.role(F, S.ui, 'FULL-CYCLE ACCOUNT EXECUTIVE', 1200, 125, w('account', 583.2) - 0.1, 50);
    X.role(F, S.ui, 'REVENUE OPERATIONS SPECIALIST', 1240, 220, w('revenue', 584.4) - 0.1, 50);
    const you = F.puppet(S, S.mid, 'you', 330, 940, 1.45, { mood: 'smile', armR: 'down', look: { top: INK, top2: '#24365E' }, badge: `<circle cx="30" cy="-150" r="15" fill="${GR}"/>` });
    you.arm(w('builds', 586.3), 'r', 'point', 0.4);
    const pipe = [['RESEARCH', BL], ['WRITE', OR], ['SEND', RD], ['BOOK', GR]].map(([t, c], i) => { const d = F.html(S.mid, `<div style="width:190px;height:150px;border-radius:16px;background:${c};color:#fff;font:400 30px 'Archivo Black';display:grid;place-items:center;box-shadow:0 14px 24px rgba(14,24,48,.25)">${t}</div>`, 600 + i * 250, 380, 0, 0, 3);
      F.in(d, w('builds', 586.3) + i * 0.22, 'above', { dur: 0.35, sfx: 'clunk', gain: 0.3 }); return d; });
    const sys = F.hand(S.ui, 'the automated outreach system', 1060, 590, 50, INK, -2); F.in(sys, w('outreach', 587.3), 'none', { dur: 0.35, sfx: false });
    const call = F.html(S.mid, `<div style="width:520px;height:250px;border-radius:18px;background:${INK};display:flex;gap:10px;padding:10px;box-sizing:border-box;box-shadow:0 18px 30px rgba(14,24,48,.3)"><div style="flex:1;border-radius:10px;background:#DDEAFD;position:relative"><div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:70px;height:70px;border-radius:50%;background:${C.skin1}"></div></div><div style="flex:1;border-radius:10px;background:#FBE3DF;position:relative"><div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:70px;height:70px;border-radius:50%;background:${C.skin3}"></div></div></div>`, 1000, 690, 0, 0, 4);
    F.in(call, w('closes', 588.4) - 0.2, 'below', { dur: 0.4, sfx: 'callchime', gain: 0.4 });
    const sg = F.label(S.ui, 'DEAL SIGNED', 1660, 820, { size: 54, bg: GR, color: WH, rot: 6, font: "'Archivo Black'", weight: 400 });
    F.fromTo(sg, w('calls.', 589.9) - 0.2, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(w('calls.', 589.9), 'stamp', 0.6);
    S.cam(581.6, 960, 560, 1.02, 9, 'inOutSine');
  }

  // ===== connect lead tools; revenue builder, not cold caller (590.88 – 597.62) =====
  {
    const S = F.shot(590.88, 597.62, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const pz = [['CRM', BL], ['EMAIL', OR], ['CALENDAR', GR]].map(([t, c], i) => { const d = F.label(S.mid, t, 520 + i * 300, 320, { size: 48, bg: c, color: WH, rot: 0, font: "'Archivo Black'", weight: 400, z: 3 }); F.fromTo(d, w('connect', 592.7) + i * 0.2, { opacity: 0, x: (i - 1) * 200 }, { opacity: 1, x: 0 }, 0.4, 'power3.out'); F.sfx(w('connect', 592.7) + i * 0.2 + 0.35, 'snap', 0.4); return d; });
    const plate = F.html(S.mid, `<div style="position:relative;width:640px;height:150px;perspective:900px"><div class="a" style="position:absolute;inset:0;border-radius:14px;background:#5D6B88;color:#fff;font:400 54px 'Archivo Black';display:grid;place-items:center;transform-origin:50% 100%">COLD CALLER</div><div class="b" style="position:absolute;inset:0;border-radius:14px;background:${GR};color:#fff;font:400 54px 'Archivo Black';display:grid;place-items:center;transform-origin:50% 0%;opacity:0">REVENUE BUILDER</div></div>`, 640, 620, 0, 0, 4);
    F.in(plate, w('pitch', 594.3) - 0.2, 'below', { dur: 0.4 });
    const tb = w('caller.', 596.9) + 0.1;
    F.to(plate.querySelector('.a'), tb, { rotationX: 90 }, 0.18, 'power1.in'); F.tl.fromTo(plate.querySelector('.b'), { opacity: 1, rotationX: -90 }, { opacity: 1, rotationX: 0, duration: 0.25, immediateRender: false }, F.rel(tb + 0.18)); F.sfx(tb, 'flip', 0.6);
    const you = F.puppet(S, S.mid, 'you', 1520, 960, 1.4, { mood: 'smile', armL: 'down', look: { top: INK, top2: '#24365E' } });
    you.mood(tb + 0.3, 'happy').hop(tb + 0.3);
    S.cam(591, 960, 540, 1.02, 6, 'inOutSine');
  }

  // ===== the prompt (597.62 – 617.70) =====
  {
    const S = F.shot(597.62, 617.70);
    X.prompt(F, S, 10, 'Act as a vice president of sales. I am an appointment setter pivoting to a revenue operations and account executive role. Walk me through how to design an automated outbound sales workflow that researches a prospect’s company news, writes a personalized first line, and prepares a discovery call briefing sheet for the closer.', w('Act', 599.9), w('closer.', 616.8) + 0.3, { tIn: 598.0, size: 42 });
  }
  F.done();
})();
