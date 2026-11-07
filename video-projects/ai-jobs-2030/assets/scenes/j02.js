// j02 — Tier 1 Support Rep -> Customer Success / AI Conversation Designer (93.64 – 162.18)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const headset = `<path d="M-58 -268 Q0 -352 58 -268" stroke="${INK}" stroke-width="9" fill="none"/><rect x="-68" y="-286" width="20" height="38" rx="7" fill="${INK}"/><rect x="48" y="-286" width="20" height="38" rx="7" fill="${INK}"/><path d="M-60 -252 Q-54 -214 -20 -220" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="-16" cy="-220" r="8" fill="${RD}"/>`;
  const rheadset = `<path d="M-80 -250 Q0 -360 80 -250" stroke="${INK}" stroke-width="10" fill="none"/><rect x="-92" y="-262" width="22" height="44" rx="8" fill="${INK}"/><rect x="70" y="-262" width="22" height="44" rx="8" fill="${INK}"/>`;

  // ===== card (93.64 – 97.14) =====
  {
    const S = F.shot(93.64, 97.14);
    X.card(F, S, 2, 'TIER 1 SUPPORT REP', 93.75, (I) => I.box(-200, -120, 340, 160, 100, '#9AA8BE') + I.box(-170, -110, 150, 26, 110, INK, 100) + I.box(-160, -104, 130, 12, 92, '#D6E4FB', 106)
      + [0, 1, 2, 3, 4].map(k => I.box(70, -120 + k * 28, 80, 20, 14, [RD, OR, YL, RD, OR][k], 100 + k * 16)).join('') + I.box(-40, 90, 90, 60, 40, INK));
  }

  // ===== you with a headset, the queue (97.14 – 99.66) =====
  {
    const S = F.shot(97.14, 99.66, { cam: [900, 560, 1.06] });
    X.tiltIn(F, S, 97.14);
    X.room(F, S);
    F.set(S.mid, P.desk(260, 780, 860) + P.laptopBack(640, 780, 0.8), 3);
    const you = F.puppet(S, S.mid, 'you', 560, 920, 1.45, { mood: 'worry', armL: 'type', armR: 'type', headExtra: headset, z: 1 });
    const q = F.html(S.ui, `<div style="width:420px;background:#fff;border-radius:18px;padding:22px;box-shadow:0 16px 30px rgba(14,24,48,.2);font:700 28px Inter;color:${INK}">Ticket queue<div class="n" style="font:400 110px 'Archivo Black';color:${RD};margin-top:6px">12</div><div style="font:600 24px Inter;color:#7D879A">waiting</div></div>`, 1280, 250, 0, 0, 8);
    F.in(q, 97.3, 'right', { dur: 0.45, sfx: 'pop' });
    const n = q.querySelector('.n'); F.every(S, (G) => { n.textContent = String(12 + Math.max(0, Math.floor((G - 97.6) * 9))); });
    for (let t = 97.6; t < 99.5; t += 0.4) F.sfx(t, 'ring', 0.15);
    for (let x = 97.3; x < 99.5; x += 0.14) F.sfx(x, 'key', 0.1);
    S.cam(97.3, 860, 560, 1.12, 2.2, 'inOutSine');
  }

  // ===== AI agents resolve: password, shipping, refunds (99.66 – 105.12) =====
  {
    const S = F.shot(99.66, 105.12, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const rob = F.puppet(S, S.mid, 'intern', 330, 960, 1.35, { mood: 'happy', armR: 'up', headExtra: rheadset });
    rob.enter(99.7, 'left');
    const bubs = [['voice', 'voice', 99.7], ['chat', 'chat', 100.2]].map(([t, wd, af], i) => { const b = F.label(S.ui, i ? '💬 chat' : '🎙 voice', 560 + i * 40, 230 + i * 110, { size: 58, bg: WH, color: INK, rot: i ? 3 : -3 }); F.in(b, w(wd, af), 'left', { dur: 0.35, sfx: 'pop', gain: 0.4 }); return b; });
    const icon = (svg, label, x, t) => { const card = F.html(S.mid, `<div style="width:340px;height:380px;border-radius:22px;background:#fff;box-shadow:0 20px 40px rgba(14,24,48,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px"><svg width="170" height="170" viewBox="-85 -85 170 170">${svg}</svg><div style="font:800 32px Inter;color:${INK};text-align:center">${label}</div><div class="ok" style="position:absolute;right:-18px;top:-18px;width:76px;height:76px;border-radius:50%;background:${GR};color:#fff;font:800 46px Inter;display:grid;place-items:center;opacity:0">✓</div></div>`, x, 330, 0, 0, 4);
      F.in(card, t - 0.15, 'below', { dur: 0.45, sfx: 'paperslide', gain: 0.35 }); F.fromTo(card.querySelector('.ok'), t + 0.45, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1 }, 0.3, 'back.out(2)'); F.sfx(t + 0.45, 'tick', 0.5); return card; };
    const lock = `<rect x="-55" y="-10" width="110" height="80" rx="12" fill="${YL}"/><path d="M-32 -10 v-30 a32 32 0 0 1 64 0" stroke="${INK}" stroke-width="14" fill="none" class="sh"/><circle cy="28" r="12" fill="${INK}"/>`;
    const box = `<path d="M-60 -30 L0 -60 L60 -30 L60 40 L0 70 L-60 40Z" fill="#C9A57A"/><path d="M-60 -30 L0 0 L60 -30 M0 0 V70" stroke="#9C7A4E" stroke-width="5" fill="none"/>`;
    const rec = `<path d="M-45 -70 H45 V70 L30 60 L15 70 L0 60 L-15 70 L-30 60 L-45 70Z" fill="${WH}" stroke="#C3CDDC" stroke-width="4"/><text y="10" text-anchor="middle" font-family="Archivo Black" font-size="44" fill="${GR}">↩$</text>`;
    const c1 = icon(lock, 'password reset', 720, w('password', 101)), c2 = icon(box, 'shipping question', 1110, w('shipping', 102.8)), c3 = icon(rec, 'refund request', 1500, w('refund', 104));
    const sh = c1.querySelector('.sh'); F.fromTo(sh, w('resets,', 101.8), { y: 0 }, { y: -18 }, 0.25, 'back.out(3)'); F.sfx(w('resets,', 101.8), 'lock', 0.5);
    S.cam(99.8, 960, 540, 1.03, 5, 'inOutSine');
  }

  // ===== instantly, 40 languages, 2 a.m. (105.12 – 108.30) =====
  {
    const S = F.shot(105.12, 108.30, { cam: [960, 540, 1.0] });
    X.darkBg(F, S);
    F.set(S.back, `<g filter="url(#cut)"><circle cx="1660" cy="190" r="80" fill="#FFF3CC"/></g><circle cx="1700" cy="160" r="70" fill="#1B2B4E"/>` + [...Array(18)].map((_, i) => `<circle cx="${(i * 233) % 1900}" cy="${(i * 137) % 420 + 40}" r="${2 + (i % 3)}" fill="#fff" opacity=".6"/>`).join(''), 0);
    const globe = F.prop(S.mid, `<g filter="url(#cut)"><circle r="230" fill="${BL}"/><path d="M-230 0 h460 M0 -230 v460" stroke="#7BA9F7" stroke-width="6"/><ellipse rx="110" ry="230" fill="none" stroke="#7BA9F7" stroke-width="6"/><ellipse rx="230" ry="100" fill="none" stroke="#7BA9F7" stroke-width="6"/></g>`, 960, 470, 500, 500, 2);
    F.every(S, (G) => { globe.style.transform = `rotate(${(G - 105) * 8}deg)`; });
    const words = [['Hola ✓', 470, 230], ['Bonjour ✓', 1450, 300], ['こんにちは', 400, 520], ['مرحبا', 1520, 560], ['Olá ✓', 560, 790], ['Hallo ✓', 1380, 800], ['你好', 760, 170], ['Ciao ✓', 1170, 150]];
    words.forEach(([t, x, y], i) => { const b = F.label(S.mid, t, x, y, { size: 42, bg: WH, color: INK, rot: (i % 2 ? 3 : -3), font: 'Inter', weight: 800, z: 4 }); F.in(b, w('instantly', 105) + i * 0.17, 'none', { dur: 0.3, sfx: 'pop', gain: 0.22 }); });
    const n40 = F.label(S.ui, '40 <span style="font:700 40px Caveat">languages</span>', 1640, 980, { size: 80, bg: YL, color: INK, rot: -3, font: "'Archivo Black'", weight: 400, z: 9 });
    F.in(n40, w('40', 106) - 0.1, 'right', { dur: 0.35, sfx: 'stamp', gain: 0.4 });
    const ck = F.prop(S.ui, P.clock(0, 0, 80, 2, 0, ''), 180, 960, 200, 200, 9); F.in(ck, w('2', 107) - 0.2, 'left', { dur: 0.35 });
    const am = F.label(S.ui, '2:00 AM', 410, 965, { size: 54, bg: 'none', color: WH, font: "'Archivo Black'", weight: 400, flat: true, z: 9 }); F.in(am, w('2', 107), 'left', { dur: 0.35, sfx: false });
    S.cam(105.2, 960, 520, 1.06, 3, 'inOutSine');
  }

  // ===== WEF: 92M fading, 170M growing (108.30 – 118.96) =====
  {
    const S = F.shot(108.30, 118.96, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 880);
    const src = F.label(S.ui, 'World Economic Forum', 330, 150, { size: 42, bg: WH, color: INK, font: 'Inter', weight: 800, rot: -2 }); F.in(src, w('World', 108.3), 'left', { dur: 0.4 });
    const by = F.label(S.ui, 'Future of Jobs · by 2030', 330, 235, { size: 34, bg: 'none', color: '#5D6B88', font: 'Inter', weight: 700, flat: true }); F.in(by, w('reports', 109.3), 'left', { dur: 0.4, sfx: false });
    const base = 880;
    const red = F.html(S.mid, `<div style="width:300px;height:330px;background:${RD};transform-origin:50% 100%"></div>`, 420, base - 330, 0, 0, 3);
    const redOut = F.html(S.mid, `<div style="width:300px;height:330px;border:8px dashed ${RD};box-sizing:border-box"></div>`, 420, base - 330, 0, 0, 2);
    F.fromTo(red, w('92', 110) - 0.1, { scaleY: 0 }, { scaleY: 1 }, 0.5, 'power3.out'); F.hidden(redOut); F.show(redOut, w('92', 110) + 0.3);
    F.to(red, w('fading', 112.4), { opacity: 0.18 }, 1.2); F.sfx(w('fading', 112.4), 'fade', 0.4);
    const l92 = F.label(S.mid, '92M', 570, base - 410, { size: 120, bg: 'none', color: RD, font: "'Archivo Black'", weight: 400, flat: true, z: 4 }); F.in(l92, w('92', 110), 'below', { dur: 0.4, sfx: 'thunk', gain: 0.4 });
    const c92 = F.hand(S.mid, 'repetitive jobs fading', 570, base + 60, 48, INK, -1); F.in(c92, w('repetitive', 111), 'none', { dur: 0.4, sfx: false });
    const green = F.html(S.mid, `<div style="width:300px;height:610px;background:${GR};transform-origin:50% 100%"></div>`, 1050, base - 610, 0, 0, 3);
    F.fromTo(green, w('170', 114), { scaleY: 0 }, { scaleY: 1 }, 1.6, 'power2.out'); F.sfx(w('170', 114), 'swell', 0.45);
    const l170 = F.label(S.mid, '170M', 1200, base - 690, { size: 120, bg: 'none', color: C.sage2, font: "'Archivo Black'", weight: 400, flat: true, z: 4 }); F.in(l170, w('170', 114) + 1.2, 'below', { dur: 0.4, sfx: 'chime', gain: 0.4 });
    const c170 = F.hand(S.mid, 'new roles growing', 1200, base + 60, 48, INK, -1); F.in(c170, w('growing', 116.5), 'none', { dur: 0.4, sfx: false });
    const you = F.puppet(S, S.mid, 'you', 1640, base, 1.3, { mood: 'look', armL: 'down', flip: false, z: 5 });
    you.enter(w('people', 117), 'right').walk(w('people', 117), w('people', 117) + 0.6).arm(w('manage', 117.5), 'l', 'point', 0.4).mood(w('systems.', 118), 'smile');
    S.cam(108.4, 760, 560, 1.08, 2).cam(w('170', 114) - 0.3, 1100, 470, 1.04, 2, 'inOutSine');
  }

  // ===== the switch: angry VIP client, you calm them (118.96 – 126.00) =====
  {
    const S = F.shot(118.96, 126.00, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#DCE3EE';
    X.cornerBoard(F, S, 1, w('pivot', 119), 3.3);
    X.role(F, S.ui, 'CUSTOMER SUCCESS MANAGER', 1200, 120, w('customer', 120), 54);
    const r2 = X.role(F, S.ui, 'AI CONVERSATION DESIGNER', 1240, 210, w('conversation', 122), 54);
    const frame = F.html(S.mid, `<div style="width:1500px;height:600px;border-radius:24px;background:${INK};box-shadow:0 26px 50px rgba(14,24,48,.3)"></div>`, 210, 330, 0, 0, 1);
    F.in(frame, w('handles', 123.5) - 0.4, 'below', { dur: 0.45, sfx: 'callchime', gain: 0.5 });
    const tile = (x, col, name) => { const d = F.html(S.mid, `<div style="position:relative;width:700px;height:540px;border-radius:16px;background:${col};overflow:hidden"><div style="position:absolute;left:18px;bottom:16px;padding:6px 14px;border-radius:8px;background:rgba(14,24,48,.8);color:#fff;font:700 26px Inter">${name}</div></div>`, x, 360, 0, 0, 2); F.in(d, w('handles', 123.5) - 0.3, 'none', { dur: 0.4, sfx: false }); return d.firstChild; };
    const t1 = tile(240, '#FBE3DF', 'VIP client 💎'), t2 = tile(980, '#DDEAFD', 'You');
    const cli = F.puppet(S, t1, 'client', 350, 760, 1.65, { mood: 'angry', armR: 'point', noShadow: true });
    const steam = F.prop(t1, `<g filter="url(#cut)"><path d="M-80 0 q-16 -30 4 -54 M80 0 q16 -30 -4 -54" stroke="#8C97AA" stroke-width="12" fill="none" stroke-linecap="round"/></g>`, 350, 150, 240, 120, 3);
    const you = F.puppet(S, t2, 'you', 350, 760, 1.65, { mood: 'smile', armL: 'out', armR: 'out', noShadow: true, headExtra: headset });
    you.nod(w('angry', 124.5), 126);
    F.to(steam, w('clients', 125) + 0.2, { opacity: 0 }, 0.6); cli.mood(w('clients', 125) + 0.3, 'neutral').arm(w('clients', 125) + 0.3, 'r', 'down', 0.5); F.sfx(w('clients', 125) + 0.3, 'resolve', 0.4);
    F.out(r2, w('handles', 123.5) - 0.2, 'above', { dur: 0.35 });
    S.cam(119, 960, 560, 1.0, 1).cam(w('handles', 123.5), 960, 640, 1.06, 1.4);
  }

  // ===== trains the bots to sound human (126.00 – 128.44) =====
  {
    const S = F.shot(126.00, 128.44, { cam: [960, 560, 1.04] });
    X.room(F, S);
    const you = F.puppet(S, S.mid, 'you', 560, 940, 1.45, { mood: 'smile', armR: 'fwd' });
    const rob = F.puppet(S, S.mid, 'intern', 1380, 940, 1.2, { mood: 'neutral' });
    const card = F.prop(S.mid, K.card('say sorry|like a human', YL, 260, 170, INK, 40), 860, 560, 280, 190, 6); F.in(card, 126.1, 'left', { dur: 0.35, sfx: 'flick', gain: 0.4 });
    const b1 = F.html(S.ui, `<div style="padding:18px 26px;border-radius:20px;background:#fff;font:600 32px 'JetBrains Mono',monospace;color:#7D879A;box-shadow:0 12px 24px rgba(14,24,48,.18)">TICKET #4471 CLOSED.</div>`, 1180, 260, 0, 0, 8);
    const b2 = F.html(S.ui, `<div style="padding:18px 26px;border-radius:20px;background:${GR};font:700 32px Inter;color:#fff;box-shadow:0 12px 24px rgba(14,24,48,.18)">So sorry about that, let’s fix it now.</div>`, 1060, 260, 0, 0, 8);
    F.in(b1, 126.2, 'below', { dur: 0.3, sfx: 'blip', gain: 0.4 }); F.out(b1, w('sound', 127.2), 'above', { dur: 0.25 });
    F.in(b2, w('sound', 127.2) + 0.15, 'below', { dur: 0.35, sfx: 'chime', gain: 0.4 }); rob.mood(w('human.', 127.5), 'happy');
  }

  // ===== ticket history -> bot training portfolio (128.44 – 134.52) =====
  {
    const S = F.shot(128.44, 134.52, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const tk = [...Array(7)].map((_, i) => { const d = F.html(S.mid, `<div style="width:300px;padding:16px 20px;border-radius:12px;background:#fff;box-shadow:0 10px 20px rgba(14,24,48,.16);font:700 24px Inter;color:${INK}">Ticket #${4400 + i * 13}<div style="height:10px;width:${180 - (i % 3) * 30}px;background:#C3CDDC;border-radius:5px;margin-top:10px"></div></div>`, 300 + (i % 2) * 30, 260 + i * 70, 0, 0, 3 + i);
      F.in(d, 128.6 + i * 0.2, 'left', { dur: 0.3, sfx: i % 2 ? false : 'deal', gain: 0.25 });
      F.to(d, w('into', 132) + i * 0.1, { x: 1020, y: 220 - i * 60, scale: 0.5, opacity: 0, rotation: 8 }, 0.6, 'power2.in'); return d; });
    const binder = F.html(S.mid, `<div style="width:420px;height:540px;border-radius:16px;background:${BL};box-shadow:0 24px 40px rgba(14,24,48,.28);position:relative"><div style="position:absolute;left:30px;top:0;bottom:0;width:22px;background:#2A62C9"></div><div style="position:absolute;left:80px;right:40px;top:170px;padding:20px;background:#fff;border-radius:8px;font:400 40px/1.1 'Archivo Black';color:${INK};text-align:center">BOT<br>TRAINING<br>PORTFOLIO</div></div>`, 1200, 260, 0, 0, 2);
    F.in(binder, 129.2, 'right', { dur: 0.5 });
    F.fromTo(binder, w('portfolio.', 133.3), { scale: 1 }, { scale: 1.06 }, 0.2); F.to(binder, w('portfolio.', 133.3) + 0.2, { scale: 1 }, 0.2); F.sfx(w('portfolio.', 133.3), 'snap', 0.5);
    const lb = F.label(S.ui, 'Claude or ChatGPT', 760, 140, { size: 50, bg: INK, color: WH, rot: -1.5 }); F.in(lb, w('Claude', 128.9), 'above', { dur: 0.4 });
    S.cam(128.5, 960, 540, 1.04, 5, 'inOutSine');
  }

  // ===== the prompt (134.52 – 155.92) =====
  {
    const S = F.shot(134.52, 155.92);
    X.prompt(F, S, 2, 'I am a customer support representative pivoting to an AI conversation designer role. Here are [three common complaints] from angry customers in my industry. Write a decision tree and five empathetic response templates that an AI chat bot should follow, including the exact trigger words that must hand the chat over to a human agent.', w('I', 137), w('agent.', 155) + 0.4, { tIn: 135.0 });
  }

  // ===== save as PDF, attach to your profile (155.92 – 162.18) =====
  {
    const S = F.shot(155.92, 162.18, { cam: [960, 500, 1.0] });
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 960, 480, 0.9, 3);
    L.screen.innerHTML = `${F.winBar('Profile')}<div style="padding:28px 46px;position:relative"><div style="height:150px;border-radius:14px;background:linear-gradient(120deg,${BL},#2A62C9)"></div>
      <div style="display:flex;gap:26px;align-items:flex-end;margin-top:-70px;padding-left:30px"><div style="width:150px;height:150px;border-radius:50%;background:#E8B08C;border:8px solid #fff"></div><div><div style="font:800 44px Inter">Your Name</div><div style="font:600 28px Inter;color:#5A6478">AI Conversation Designer · ex-Support</div></div></div>
      <div style="margin-top:34px;font:800 30px Inter">Featured</div><div style="display:flex;gap:20px;margin-top:14px">
      <div class="pdf" style="width:420px;border:2px solid #E3E8F0;border-radius:14px;padding:20px;background:#FFF;box-shadow:0 10px 24px rgba(20,33,61,.15);display:flex;gap:14px;align-items:center"><div style="width:64px;height:78px;background:${RD};border-radius:6px;color:#fff;font:800 22px Inter;display:grid;place-items:center;flex:none">PDF</div><div style="font:700 26px/1.25 Inter">Support Bot Playbook: decision tree + 5 templates</div></div>
      <div style="width:280px;border:2px dashed #C3CDDC;border-radius:14px"></div></div></div>`;
    const pdf = L.screen.querySelector('.pdf');
    F.fromTo(pdf, w('attach', 157.6), { opacity: 0, y: -260, scale: 1.2, rotation: -6 }, { opacity: 1, y: 0, scale: 1, rotation: 0 }, 0.6, 'power3.out'); F.sfx(w('attach', 157.6) + 0.5, 'clip', 0.5);
    const doc = F.html(S.ui, `<div style="width:220px;height:280px;border-radius:10px;background:#fff;box-shadow:0 18px 30px rgba(14,24,48,.25);padding:20px;box-sizing:border-box"><div style="width:70px;height:40px;border-radius:6px;background:${RD};color:#fff;font:800 22px Inter;display:grid;place-items:center">PDF</div>${[0, 1, 2, 3, 4].map(k => `<div style="height:12px;width:${150 - (k % 2) * 40}px;background:#C3CDDC;border-radius:6px;margin-top:18px"></div>`).join('')}</div>`, 830, 300, 0, 0, 9);
    F.in(doc, w('Save', 155.9), 'below', { dur: 0.45, sfx: 'copier', gain: 0.4 }); F.to(doc, w('attach', 157.6) - 0.1, { opacity: 0, scale: 0.6, y: 200 }, 0.35, 'power2.in');
    const proof = F.label(S.ui, 'PROOF', 1640, 860, { size: 84, bg: GR, color: WH, rot: 6, font: "'Archivo Black'", weight: 400, z: 12 });
    F.fromTo(proof, w('prove', 159.5), { opacity: 0, scale: 2 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(w('prove', 159.5) + 0.22, 'stamp', 0.6);
    S.cam(156, 960, 480, 1.0, 1).cam(w('attach', 157.6) - 0.2, 760, 640, 1.25, 1.2);
  }
  F.done();
})();
