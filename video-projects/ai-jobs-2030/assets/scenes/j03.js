// j03 — Junior Copywriter -> AI Content Strategist & Brand Editor (162.18 – 224.08)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const page = (title, col = '#8C97AA', lines = 6) => `<g filter="url(#cut)"><rect x="-120" y="-160" width="240" height="320" fill="${WH}"/>${title ? F.T(title, 0, -108, 36, col) : ''}${[...Array(lines)].map((_, k) => `<rect x="-90" y="${-74 + k * 34}" width="${180 - (k % 3) * 34}" height="11" fill="${C.grey}"/>`).join('')}</g>`;

  // ===== card (162.18 – 165.94) =====
  {
    const S = F.shot(162.18, 165.94);
    X.card(F, S, 3, 'JUNIOR COPYWRITER', 162.3, (I) => I.box(-190, -120, 320, 150, 100, '#9AA8BE') + I.box(-150, -100, 150, 24, 110, INK, 100) + I.box(-140, -94, 130, 12, 90, '#D6E4FB', 106)
      + I.box(60, -100, 20, 20, 150, '#5D6B88', 100) + I.box(40, -120, 70, 50, 20, YL, 250) + [[-60, 90], [40, 120], [120, 60]].map(([u, v]) => I.box(u, v, 34, 34, 30, WH)).join(''));
  }

  // ===== four hours, 500 words of generic posts (165.94 – 174.76) =====
  {
    const S = F.shot(165.94, 174.76, { cam: [880, 560, 1.06] });
    X.tiltIn(F, S, 165.94);
    X.room(F, S);
    F.set(S.mid, P.desk(160, 780, 820) + P.laptopBack(470, 780, 0.8), 3);
    F.set(S.mid, `<g filter="url(#cut)"><rect x="840" y="560" width="14" height="220" fill="#5D6B88"/><path d="M780 560 L920 560 L880 500 L820 500Z" fill="${YL}"/></g>`, 3);
    const you = F.puppet(S, S.mid, 'you', 400, 920, 1.4, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    [[640, 860, 20], [760, 900, -14], [300, 900, 8]].forEach(([x, y, r], i) => { const b = F.prop(S.mid, `<g filter="url(#cut)"><circle r="34" fill="${WH}"/><path d="M-20 -10 L14 6 M-14 14 L20 -12" stroke="${C.grey}" stroke-width="4"/></g>`, x, y, 80, 80, 6); F.in(b, 166.2 + i * 0.6, 'above', { dur: 0.4, sfx: 'crunch', gain: 0.25 }); });
    for (let x = 166; x < 174.5; x += 0.15) F.sfx(x, 'key', 0.08);
    const ck = F.prop(S.ui, K.clock(80), 1250, 230, 200, 200, 8), hand = F.prop(S.ui, K.hand(56, RD, 7), 1250, 230, 40, 140, 9);
    F.in(ck, w('four', 170) - 0.2, 'none', { dur: 0.3 }); F.in(hand, w('four', 170) - 0.2, 'none', { dur: 0.3, sfx: false }); F.to(hand, w('four', 170), { rotation: 1440 }, 2.2, 'power1.inOut');
    const hrs = F.label(S.ui, '4 HRS', 1250, 380, { size: 50, bg: RD, color: WH, rot: -3, font: "'Archivo Black'", weight: 400 }); F.in(hrs, w('hours', 170.6), 'below', { dur: 0.3 });
    const wc = F.html(S.ui, `<div style="padding:14px 24px;border-radius:12px;background:${INK};color:#fff;font:800 40px Inter"><span class="n">0</span> words</div>`, 1520, 200, 0, 0, 9);
    F.in(wc, w('500', 171.4) - 0.2, 'right', { dur: 0.35, sfx: 'pop' });
    const n = wc.querySelector('.n'); F.every(S, (G) => { n.textContent = Math.round(500 * Math.max(0, Math.min(1, (G - w('500', 171.4)) / 0.8))); });
    const blog = F.prop(S.mid, page('BLOG'), 1300, 640, 260, 340, 5), prod = F.prop(S.mid, page('PRODUCT'), 1620, 660, 260, 340, 5);
    F.in(blog, w('blog', 172.9) - 0.1, 'below', { dur: 0.4 }); F.in(prod, w('product', 173.8) - 0.1, 'below', { dur: 0.4 });
    const gen = F.hand(S.ui, 'generic', 1300, 860, 56, '#5D6B88', -4); F.in(gen, w('generic', 172.5), 'none', { dur: 0.3, sfx: false });
    S.cam(166.1, 640, 600, 1.12, 2).cam(w('four', 170) - 0.5, 1050, 520, 0.98, 1.4);
  }

  // ===== 10 drafts in 10 seconds (174.76 – 179.18) =====
  {
    const S = F.shot(174.76, 179.18, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const rob = F.puppet(S, S.mid, 'intern', 520, 960, 1.4, { mood: 'proud', armL: 'fwd', armR: 'fwd' });
    const lb = F.label(S.ui, 'LARGE LANGUAGE MODEL', 520, 200, { size: 46, bg: RD, color: WH, rot: -2 }); F.in(lb, w('large', 175.2), 'above', { dur: 0.4 });
    const tg = w('generate', 176.2);
    for (let i = 0; i < 10; i++) { const pg = F.prop(S.mid, page('DRAFT ' + (i + 1), RD, 4), 820, 640, 260, 340, 3 + i);
      const a = -40 + i * 9; F.fromTo(pg, tg + i * 0.12, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.6 }, { opacity: 1, x: 520 + Math.sin(i) * 40, y: -120 + (i % 3) * 40, rotation: a, scale: 0.8 }, 0.45, 'power3.out'); F.sfx(tg + i * 0.12, 'flick', 0.25); }
    const sw = F.prop(S.ui, P.stopwatch(0, 0, 0.62, '0:10'), 1650, 220, 220, 260, 10); F.in(sw, w('seconds.', 178) - 0.1, 'none', { dur: 0.3, sfx: 'ding', gain: 0.6 });
    const t10 = F.label(S.ui, '10 DRAFTS', 1300, 930, { size: 72, bg: YL, color: INK, rot: -2, font: "'Archivo Black'", weight: 400 }); F.in(t10, w('drafts', 177), 'below', { dur: 0.35 });
    S.cam(174.9, 960, 540, 1.04, 4, 'inOutSine');
  }

  // ===== the very fast intern who read every website (179.18 – 187.16) =====
  {
    const S = F.shot(179.18, 187.16, { cam: [960, 560, 1.0] });
    X.room(F, S);
    const rob = F.puppet(S, S.mid, 'intern', 960, 960, 1.5, { mood: 'happy', armL: 'down', armR: 'down', badge: `<text x="0" y="-60" font-family="Archivo Black" font-size="14" text-anchor="middle" fill="${INK}">INTERN</text>` });
    rob.hop(w('fast', 181.2)).arms(w('read', 182.1), 'up', 'up', 0.4).mood(w('read', 182.1), 'twitch');
    const lb = F.label(S.ui, 'VERY FAST INTERN', 960, 150, { size: 70, bg: INK, color: WH, rot: -1.5 }); F.in(lb, w('intern', 181.5) - 0.2, 'above', { dur: 0.4 }); F.out(lb, w('read', 182.1), 'above', { dur: 0.3 });
    const tr = w('every', 182.3);
    for (let i = 0; i < 16; i++) { const a = Math.PI + i * (Math.PI / 15), x = 960 + Math.cos(a) * 700, y = 500 + Math.sin(a) * 300; const cols = [BL, RD, GR, YL, OR];
      const pg = F.html(S.mid, `<div style="width:120px;height:86px;border-radius:6px;background:#fff;box-shadow:0 8px 14px rgba(14,24,48,.2);overflow:hidden"><div style="height:16px;background:${cols[i % 5]}"></div></div>`, x - 60, y - 43, 0, 0, 6);
      F.fromTo(pg, tr + i * 0.08, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, 0.25); F.to(pg, tr + 0.9 + i * 0.05, { x: 960 - x, y: 560 - y, scale: 0.1, opacity: 0, rotation: 200 }, 0.6, 'power2.in'); }
    F.sfx(tr, 'flutter', 0.5); F.sfx(tr + 0.9, 'whoosh', 0.4);
    const earth = F.hand(S.ui, 'every website on Earth', 960, 150, 64, BL, -2); F.in(earth, w('Earth', 183.3), 'none', { dur: 0.35, sfx: false }); F.out(earth, w('zero', 184.2) - 0.2, 'above', { dur: 0.3 });
    rob.mood(w('zero', 184.2), 'neutral').arms(w('zero', 184.2), 'down', 'down', 0.4);
    const bulb = F.html(S.ui, `<div style="display:flex;flex-direction:column;align-items:center"><svg width="300" height="360" viewBox="-100 -120 200 240"><g filter="url(#cut)"><circle cy="-20" r="80" fill="#fff"/><rect x="-36" y="60" width="72" height="44" rx="8" fill="#8C97AA"/></g><text y="10" text-anchor="middle" font-family="Archivo Black" font-size="96" fill="#8C97AA">0</text></svg><div style="font:700 60px Caveat;color:${RD}">original ideas</div></div>`, 380, 600, 0, 0, 8);
    gsap.set(bulb, { xPercent: -50, yPercent: -50 }); F.in(bulb, w('original', 184.7) - 0.2, 'left', { dur: 0.4, sfx: 'boop', gain: 0.4 });
    const frame = F.html(S.ui, `<div style="display:flex;flex-direction:column;align-items:center"><div style="width:250px;height:200px;background:#fff;padding:22px;box-sizing:border-box;box-shadow:0 14px 26px rgba(14,24,48,.2);transform:rotate(4deg)"><div style="width:100%;height:100%;background:#E9EDF3;display:grid;place-items:center;font:400 90px 'Archivo Black';color:#B3BCCB">?</div></div><div style="font:700 50px Caveat;color:${RD};margin-top:18px">real-life stories</div></div>`, 1550, 640, 0, 0, 8);
    gsap.set(frame, { xPercent: -50, yPercent: -50 }); F.in(frame, w('real', 185.8) - 0.2, 'right', { dur: 0.4, sfx: 'tink', gain: 0.4 });
    S.cam(179.3, 960, 560, 1.06, 6, 'inOutSine');
  }

  // ===== the switch + the funnel (187.16 – 192.40) =====
  {
    const S = F.shot(187.16, 192.40, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 2, w('switch', 187.5), 3.0);
    X.role(F, S.ui, 'AI CONTENT STRATEGIST', 1250, 130, w('content', 188.9) - 0.1, 56);
    const be = X.role(F, S.ui, '+ BRAND EDITOR', 1340, 230, w('editor', 190.4) - 0.1, 48);
    const steps = [[BL, 'AWARE', 560], [YL, 'CONSIDER', 450], [OR, 'COMPARE', 340], [GR, 'BUY', 230]];
    steps.forEach(([c, t, wd], i) => { const d = F.html(S.mid, `<div style="width:${wd}px;height:120px;background:${c};clip-path:polygon(0 0,100% 0,${100 - 50 / wd * 100}% 100%,${50 / wd * 100}% 100%);display:grid;place-items:center;font:400 40px 'Archivo Black';color:${i === 1 ? INK : '#fff'}">${t}</div>`, 600 - wd / 2, 350 + i * 135, 0, 0, 3, { filter: 'drop-shadow(4px 10px 10px rgba(14,24,48,.25))' });
      F.in(d, w('plans', 191) - 0.3 + i * 0.22, 'left', { dur: 0.35, rot: 0, sfx: 'clickin', gain: 0.35 }); });
    const you = F.puppet(S, S.mid, 'you', 1250, 900, 1.45, { mood: 'smile', armL: 'down', flip: true });
    you.arm(w('plans', 191), 'l', 'point', 0.4);
    const fl = F.hand(S.ui, 'the marketing funnel', 600, 960, 52, INK, -2); F.in(fl, w('funnel,', 191.7), 'none', { dur: 0.3, sfx: false });
    S.cam(187.3, 960, 560, 1.03, 4, 'inOutSine');
  }

  // ===== interviews real experts (192.40 – 194.00) =====
  {
    const S = F.shot(192.40, 194.00, { cam: [960, 560, 1.06] });
    X.room(F, S, '#E5EAF2', '#CDD6E3', 880);
    const you = F.puppet(S, S.mid, 'you', 700, 920, 1.5, { mood: 'smile', armR: 'fwd' });
    const ex = F.puppet(S, S.mid, 'exec', 1250, 920, 1.5, { mood: 'happy', armL: 'out', flip: true }); ex.nod(192.6, 194);
    F.prop(S.mid, `<g filter="url(#cut)"><rect x="-12" y="-10" width="24" height="80" rx="10" fill="${INK}"/><rect x="-24" y="-60" width="48" height="58" rx="24" fill="#3A4C74"/></g>`, 880, 620, 80, 160, 6);
    const lb = F.label(S.ui, 'INTERVIEW REAL EXPERTS', 960, 160, { size: 64, bg: INK, color: WH, rot: -1 }); F.in(lb, 192.45, 'above', { dur: 0.35 });
  }

  // ===== edits machine drafts so they convert (194.00 – 196.60) =====
  {
    const S = F.shot(194.00, 196.60, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const d = F.html(S.mid, `<div style="width:760px;background:#fff;border-radius:10px;padding:40px;box-shadow:0 20px 40px rgba(14,24,48,.18);font:500 40px/1.5 Inter;color:${INK}"><div style="font:800 34px Inter;color:${RD};margin-bottom:10px">MACHINE DRAFT</div><span class="a" style="position:relative">In today’s fast-paced world,</span> our product <span class="b" style="position:relative">leverages synergy</span> to delight customers.</div>`, 180, 260, 0, 0, 3);
    [['.a', 0], ['.b', 0.45]].forEach(([c, k]) => { const el = d.querySelector(c); const line = document.createElement('span'); Object.assign(line.style, { position: 'absolute', left: '-4px', right: '-4px', top: '52%', height: '6px', background: RD, transformOrigin: '0 50%' }); el.appendChild(line);
      F.fromTo(line, w('edits', 194) + k, { scaleX: 0 }, { scaleX: 1 }, 0.3); F.sfx(w('edits', 194) + k, 'marker', 0.45); });
    const fix = F.hand(S.mid, 'a real customer story', 560, 620, 54, GR, -2); F.in(fix, w('drafts', 194.6), 'none', { dur: 0.35, sfx: false });
    const cart = F.html(S.ui, `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div style="width:220px;height:220px;border-radius:50%;background:${GR};display:grid;place-items:center;font:800 110px Inter;color:#fff;box-shadow:0 16px 30px rgba(14,24,48,.25)">$</div><div style="font:400 44px 'Archivo Black';color:${INK}">CONVERTS</div></div>`, 1460, 420, 0, 0, 9);
    F.in(cart, w('convert', 195.7) - 0.2, 'right', { dur: 0.4, sfx: 'kaching', gain: 0.4 });
  }

  // ===== practice auditing machine writing, build a strategy (196.60 – 202.06) =====
  {
    const S = F.shot(196.60, 202.06, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const d = F.prop(S.mid, page('AI DRAFT', RD), 560, 520, 260, 340, 3);
    const gr = F.label(S.mid, 'C−', 760, 330, { size: 110, bg: 'none', color: RD, font: "'Archivo Black'", weight: 400, rot: -10, flat: true, z: 6 });
    F.fromTo(gr, w('bad', 198.6), { opacity: 0, scale: 2 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(w('bad', 198.6) + 0.2, 'stamp', 0.5);
    const board = F.html(S.mid, `<div style="width:640px;height:440px;border-radius:12px;background:#C9A57A;padding:24px;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;gap:20px;box-shadow:0 20px 40px rgba(14,24,48,.25)">${[['WHO', BL], ['WHAT', YL], ['WHERE', OR], ['PROOF', GR]].map(([t, c]) => `<div class="pin" style="background:${c};border-radius:6px;display:grid;place-items:center;font:400 38px 'Archivo Black';color:${c === YL ? INK : '#fff'}">${t}</div>`).join('')}</div>`, 1020, 280, 0, 0, 3);
    F.in(board, w('building', 199.8) - 0.3, 'right', { dur: 0.45 });
    [...board.querySelectorAll('.pin')].forEach((pn, i) => { F.fromTo(pn, w('real', 200.3) + i * 0.2, { opacity: 0, scale: 0.6, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0 }, 0.3, 'back.out(2)'); F.sfx(w('real', 200.3) + i * 0.2, 'sticky', 0.3); });
    const lb = F.label(S.ui, 'REAL CONTENT STRATEGY', 1340, 880, { size: 56, bg: GR, color: WH, rot: -1.5 }); F.in(lb, w('strategy.', 200.9), 'below', { dur: 0.35 });
    S.cam(196.7, 900, 540, 1.04, 1.5).cam(w('building', 199.8) - 0.4, 1060, 520, 1.02, 1.2);
  }

  // ===== the prompt (202.06 – 224.08) =====
  {
    const S = F.shot(202.06, 224.08);
    X.prompt(F, S, 3, 'Act as a chief marketing officer. I am going to paste a generic blog post about [my industry] below. Critique it for weak hooks, robotic phrasing, and missing proof points. Then, help me build a 30-day content calendar that combines expert interviews, customer case studies, and SEO keywords that AI cannot easily fake.', w('Act', 204.9), w('fake.', 223) + 0.3, { tIn: 202.5, size: 42 });
  }
  F.done();
})();
