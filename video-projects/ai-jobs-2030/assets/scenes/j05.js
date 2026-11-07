// j05 — Manual Software Tester -> AI QA Engineer & Security Auditor (277.32 – 332.30)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const loginUI = `<div style="height:100%;display:grid;place-items:center;background:#F4F6FA"><div style="width:520px;background:#fff;border-radius:22px;padding:40px;box-shadow:0 14px 30px rgba(14,24,48,.12);font:600 30px Inter;color:${INK}"><div style="font:800 46px Inter;margin-bottom:26px">Log in</div><div style="height:66px;border:2px solid #E3E8F0;border-radius:12px;margin-bottom:18px;padding:14px;box-sizing:border-box;color:#A3ACBB">email</div><div style="height:66px;border:2px solid #E3E8F0;border-radius:12px;margin-bottom:26px;padding:14px;box-sizing:border-box;color:#A3ACBB">••••••••</div><div class="btn" style="height:70px;border-radius:12px;background:${BL};color:#fff;display:grid;place-items:center;font:800 32px Inter">Sign in</div></div></div>`;

  // ===== card (277.32 – 280.35) =====
  {
    const S = F.shot(277.32, 280.35);
    X.card(F, S, 5, 'MANUAL SOFTWARE TESTER', 277.45, (I) => I.box(-200, -130, 340, 160, 100, '#9AA8BE') + [[-170, -110, 40, 14, 70], [-110, -110, 70, 14, 110], [-20, -110, 110, 14, 80]].map(([u, v, wd, d, h]) => I.box(u, v, wd, d, h, INK, 100)).join('') + I.box(70, 60, 50, 50, 70, '#D6E4FB') + I.box(76, 66, 38, 38, 8, GR, 70), { size: 64 });
  }

  // ===== clicking the same login 50 times (280.35 – 286.92) =====
  {
    const S = F.shot(280.35, 286.92, { cam: [960, 520, 1.0] });
    X.tiltIn(F, S, 280.35);
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 820, 470, 0.78, 3); L.screen.innerHTML = F.winBar('app.example.com/login') + loginUI;
    const btn = L.screen.querySelector('.btn');
    const cnt = F.html(S.ui, `<div style="width:220px;padding:18px 0;border-radius:16px;background:${INK};color:#fff;font:800 40px Inter;text-align:center">clicks<div class="n" style="font:400 110px 'Archivo Black';color:${YL}">0</div></div>`, 1720, 330, 0, 0, 9);
    gsap.set(cnt, { xPercent: -50, yPercent: -50 }); F.in(cnt, w('clicking', 282.9) - 0.2, 'right', { dur: 0.35, sfx: 'pop' });
    const n = cnt.querySelector('.n'), tA = w('clicking', 282.9), tB = w('times', 284.9);
    F.every(S, (G) => { const u = Math.max(0, Math.min(1, (G - tA) / (tB - tA))); n.textContent = Math.round(u * 50); btn.style.filter = `brightness(${(G - tA) % 0.12 < 0.05 && G > tA && G < tB ? 0.8 : 1})`; });
    for (let x = tA; x < tB; x += 0.12) F.sfx(x, 'click', 0.15);
    const toast = F.html(L.screen, `<div style="padding:16px 24px;border-radius:14px;background:${OR};color:#fff;font:800 34px Inter;white-space:nowrap;box-shadow:0 12px 24px rgba(14,24,48,.25)">⟳ update v2.3.1 → v2.3.2</div>`, 860, 90, 0, 0, 9); F.in(toast, w('code', 286) - 0.1, 'right', { dur: 0.3, sfx: 'ping', gain: 0.4 });
    const you = F.puppet(S, S.front, 'you', 260, 1150, 1.4, { mood: 'tired', armR: 'fwd', noShadow: true });
    S.cam(280.5, 960, 500, 1.03, 5, 'inOutSine');
  }

  // ===== disappearing: AI testing agents write and run scripts (286.92 – 291.18) =====
  {
    const S = F.shot(286.92, 291.18, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const you = F.puppet(S, S.mid, 'you', 380, 940, 1.4, { mood: 'sad' }); you.grey(286.95, true, 0.8);
    const rob = F.puppet(S, S.mid, 'intern', 820, 960, 1.2, { mood: 'proud', armL: 'type', armR: 'type' });
    const code = F.html(S.ui, `<div style="width:780px;border-radius:18px;background:${INK};padding:28px 34px;box-sizing:border-box;font:500 28px/1.55 'JetBrains Mono',monospace;color:#C3CDDC;box-shadow:0 20px 40px rgba(14,24,48,.3)">${['test("login works")', 'test("checkout total")', 'test("reset password")', 'test("cart persists")', 'test("mobile menu")', 'test("coupon applies")'].map((t, i) => `<div class="l${i}" style="display:flex;justify-content:space-between;opacity:0"><span>${t}</span><span style="color:${GR};font-weight:800">✓ pass</span></div>`).join('')}</div>`, 1080, 260, 0, 0, 9);
    F.in(code, w('write', 289.2) - 0.3, 'right', { dur: 0.4 });
    [...Array(6)].forEach((_, i) => { const t = w('run', 289.8) + i * 0.2; F.fromTo(code.querySelector('.l' + i), t, { opacity: 0, x: -20 }, { opacity: 1, x: 0 }, 0.2); F.sfx(t + 0.1, 'tick', 0.3); });
    const lb = F.label(S.ui, 'AI TESTING AGENTS', 820, 200, { size: 56, bg: RD, color: WH, rot: -2 }); F.in(lb, w('testing', 288.5) - 0.2, 'above', { dur: 0.35 });
    const dis = F.hand(S.ui, 'disappearing…', 380, 300, 60, '#5D6B88', -3); F.in(dis, 287, 'none', { dur: 0.4, sfx: false });
    for (let x = 289.2; x < 291; x += 0.1) F.sfx(x, 'key', 0.1);
  }

  // ===== thousands of screen sizes, overnight (291.18 – 294.22) — isometric =====
  {
    const S = F.shot(291.18, 294.22, { cam: [960, 520, 1.0] });
    X.darkBg(F, S);
    const I = X.iso(960, 330, 1);
    F.set(S.back, I.tile(-460, -460, 920, 920, '#1D2E52'), 0);
    const devs = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) devs.push([r, c]);
    devs.sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([r, c]) => { const k = (r * 7 + c) % 3, wd = [50, 80, 120][k], d = [12, 14, 16][k], h = [90, 120, 80][k];
      const dv = F.set(S.mid, I.box(-420 + c * 120, -420 + r * 120, wd, d, h, '#5B7BC0', 0, '#7FA0E0'), 2);
      const [x, y] = I.p(-420 + c * 120 + wd / 2, -420 + r * 120, h / 2 + 10);
      const tk = F.set(S.mid, `<circle cx="${x}" cy="${y - 4}" r="15" fill="${GR}"/><path d="M${x - 7} ${y - 4} l5 6 l10 -11" stroke="#fff" stroke-width="4" fill="none"/>`, 3);
      F.fromTo(tk, w('thousands', 291.5) + (r + c) * 0.1, { opacity: 0, scale: 0.3, transformOrigin: `${x}px ${y}px` }, { opacity: 1, scale: 1 }, 0.25, 'back.out(2)'); });
    F.sfx(w('thousands', 291.5), 'shimmer', 0.4);
    const moon = F.set(S.ui, `<g filter="url(#cut)"><circle cx="0" cy="0" r="70" fill="#FFF3CC"/></g><circle cx="32" cy="-20" r="62" fill="#1A2A4D"/>`, 5); F.fromTo(moon, 291.2, { x: 160, y: 110 }, { x: 1760, y: 100 }, 3.0, 'sine.inOut');
    const lb = F.label(S.ui, '1,000s OF SCREEN SIZES', 400, 960, { size: 52, bg: YL, color: INK, rot: -2, font: "'Archivo Black'", weight: 400 }); F.in(lb, w('sizes', 292.6), 'left', { dur: 0.35 });
    const on = F.hand(S.ui, 'overnight', 1560, 960, 70, WH, -3); F.in(on, w('overnight.', 293), 'none', { dur: 0.35, sfx: 'swell', gain: 0.3 });
    S.cam(291.2, 960, 520, 1.06, 3, 'inOutSine');
  }

  // ===== the switch: designs suites, breaks things creatively (294.22 – 303.52) =====
  {
    const S = F.shot(294.22, 303.52, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 4, w('pivot', 294.5), 3.0);
    X.role(F, S.ui, 'AI QA ENGINEER', 1300, 130, w('engineer', 296.7) - 0.4, 60);
    X.role(F, S.ui, '+ SECURITY AUDITOR', 1380, 235, w('security', 297.4), 48);
    const hat = `<path d="M-62 -296 Q0 -360 62 -296 L72 -286 L-72 -286Z" fill="${YL}"/><rect x="-8" y="-350" width="16" height="30" rx="6" fill="#D99E00"/>`;
    const you = F.puppet(S, S.mid, 'you', 420, 940, 1.5, { mood: 'smile', armR: 'down', headExtra: hat });
    const bp = F.html(S.mid, `<div style="width:620px;height:400px;border-radius:12px;background:#2A62C9;padding:26px;box-sizing:border-box;font:700 28px 'JetBrains Mono',monospace;color:#DDEAFD;box-shadow:0 18px 34px rgba(14,24,48,.25);background-image:linear-gradient(rgba(255,255,255,.12) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.12) 2px,transparent 2px);background-size:40px 40px">TEST SUITE<br><br>▸ login ▸ checkout<br>▸ payments ▸ search<br>▸ accessibility<br>▸ security</div>`, 700, 360, 0, 0, 3);
    F.in(bp, w('designs', 298.7) - 0.3, 'below', { dur: 0.45, sfx: 'unroll', gain: 0.5 });
    you.arm(w('designs', 298.7), 'r', 'point', 0.4);
    const form = F.html(S.mid, `<div style="width:340px;background:#fff;border-radius:18px;padding:26px;box-sizing:border-box;box-shadow:0 14px 26px rgba(14,24,48,.2);font:800 30px Inter;color:${INK}">Log in<div style="height:44px;border:2px solid #E3E8F0;border-radius:8px;margin-top:14px"></div><div style="height:44px;border:2px solid #E3E8F0;border-radius:8px;margin-top:12px"></div><svg class="crack" width="200" height="120" style="position:absolute;left:80px;top:70px;opacity:0"><path d="M10 10 L60 50 L40 70 L110 100 L90 60 L180 40" stroke="${RD}" stroke-width="7" fill="none"/></svg></div>`, 1400, 420, 0, 0, 3);
    F.in(form, w('tries', 300.6) - 0.3, 'right', { dur: 0.4 });
    const bar = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-14" y="-110" width="28" height="220" rx="10" fill="#5D6B88" transform="rotate(30)"/><path d="M40 -100 q30 -10 20 30" stroke="#5D6B88" stroke-width="22" fill="none" transform="rotate(30)"/></g>`, 1340, 560, 200, 260, 6);
    F.in(bar, w('break', 301.1) - 0.2, 'left', { dur: 0.3, sfx: false }); F.to(bar, w('break', 301.1) + 0.1, { rotation: -20 }, 0.2, 'power2.in'); F.to(bar, w('break', 301.1) + 0.3, { rotation: 0 }, 0.3);
    F.fromTo(form.querySelector('.crack'), w('break', 301.1) + 0.3, { opacity: 0 }, { opacity: 1 }, 0.1); F.sfx(w('break', 301.1) + 0.3, 'crunch', 0.5);
    const bug = F.label(S.ui, 'BUG FOUND', 1560, 780, { size: 64, bg: RD, color: WH, rot: 6, font: "'Archivo Black'", weight: 400 });
    F.fromTo(bug, w('creative', 302.2), { opacity: 0, scale: 2 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(w('creative', 302.2) + 0.22, 'stamp', 0.6);
    S.cam(294.3, 960, 540, 1.02, 6, 'inOutSine');
  }

  // ===== learn frameworks without 4 years of school (303.52 – 309.98) =====
  {
    const S = F.shot(303.52, 309.98, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const steps = [['open page', BL], ['type', OR], ['click', YL], ['check ✓', GR]];
    steps.forEach(([t, c], i) => { const d = F.label(S.mid, t, 330 + i * 420, 380, { size: 52, bg: c, color: c === YL ? INK : WH, rot: [-2, 2, -1, 1][i], z: 3 }); F.in(d, 303.7 + i * 0.45, 'below', { dur: 0.35, sfx: 'clickin', gain: 0.35 });
      if (i < 3) { const a = F.set(S.mid, `<path d="M${330 + i * 420 + 150} 380 h110 m-20 -16 l20 16 l-20 16" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`, 2); F.fromTo(a, 303.7 + i * 0.45 + 0.25, { opacity: 0 }, { opacity: 1 }, 0.2); } });
    const fw = F.hand(S.ui, 'how testing frameworks work', 960, 220, 62, INK, -2); F.in(fw, w('frameworks', 306.3), 'none', { dur: 0.35, sfx: false });
    const cap = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-130 0 L0 -60 L130 0 L0 60Z" fill="${INK}"/><path d="M-80 24 v50 q80 40 160 0 v-50" fill="#24365E"/><path d="M110 8 v70" stroke="${YL}" stroke-width="8"/><circle cx="110" cy="84" r="12" fill="${YL}"/></g>`, 960, 760, 320, 240, 3);
    F.in(cap, w('school', 308.3) - 0.4, 'below', { dur: 0.4 });
    const y4 = F.label(S.mid, '4 YEARS', 960, 900, { size: 56, bg: WH, color: INK, rot: -2, font: "'Archivo Black'", weight: 400, z: 4 }); F.in(y4, w('four', 308.6), 'none', { dur: 0.25, sfx: false });
    const x = F.set(S.mid, `<path d="M790 880 L1130 925" stroke="${RD}" stroke-width="12" stroke-linecap="round"/>`, 6); F.fromTo(x, w('years.', 309), { opacity: 0, scaleX: 0, transformOrigin: '790px 880px' }, { opacity: 1, scaleX: 1 }, 0.25); F.sfx(w('years.', 309), 'marker', 0.5);
  }

  // ===== the prompt (309.98 – 332.30) =====
  {
    const S = F.shot(309.98, 332.30);
    X.prompt(F, S, 5, 'I am a manual QA tester learning test automation. Explain how Playwright automated testing works using simple everyday metaphors. Then, give me a step-by-step beginner project where I turn a manual login checkout test into an automated test script and explain every line of code so I can answer technical interview questions.', w('I', 312.8), w('questions.', 331.3) + 0.3, { tIn: 310.4, size: 40 });
  }
  F.done();
})();
