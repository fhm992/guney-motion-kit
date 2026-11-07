// j08 — Paralegal -> Legal Ops Manager / AI Compliance Specialist (457.26 – 510.40)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;

  // ===== card (457.26 – 460.70) =====
  {
    const S = F.shot(457.26, 460.70);
    X.card(F, S, 8, 'PARALEGAL & LEGAL RESEARCH', 457.4, (I) => I.box(-200, -130, 340, 160, 100, '#9AA8BE') + [0, 1, 2, 3, 4, 5].map(k => I.box(-170, -110, 120, 90, 14, k % 2 ? '#F4F6FA' : WH, 100 + k * 14)).join('') + I.box(30, -60, 10, 10, 110, INK, 100) + I.box(0, -66, 70, 6, 6, INK, 210) + I.box(-10, -66, 20, 20, 10, YL, 180) + I.box(50, -66, 20, 20, 10, YL, 180), { size: 60 });
  }

  // ===== 30 hours a week reading court pages, summarizing NDAs (460.70 – 468.44) =====
  {
    const S = F.shot(460.70, 468.44, { cam: [960, 560, 1.0] });
    X.tiltIn(F, S, 460.70);
    X.room(F, S);
    F.set(S.mid, P.desk(160, 800, 900), 2);
    const you = F.puppet(S, S.mid, 'you', 520, 940, 1.45, { mood: 'tired', armL: 'hold', armR: 'hold', z: 1 });
    for (let c = 0; c < 4; c++) { const h = 6 + c * 3; for (let k = 0; k < h; k++) { const d = F.prop(S.mid, `<g filter="url(#cutflat)"><rect x="-90" y="-10" width="180" height="20" fill="${k % 2 ? '#F4F6FA' : WH}"/></g>`, 900 + c * 200, 790 - k * 22, 200, 30, 3);
      F.in(d, 462 + c * 0.35 + k * 0.03, 'above', { dur: 0.2, rot: 0, sfx: k === 0 ? 'flipcards' : false, gain: 0.3 }); } }
    const wk = F.html(S.ui, `<div style="padding:18px 26px;border-radius:16px;background:${INK};color:#fff;font:800 32px Inter;text-align:center">reading / week<div class="n" style="font:400 100px 'Archivo Black';color:${YL}">0h</div></div>`, 1640, 250, 0, 0, 9);
    gsap.set(wk, { xPercent: -50, yPercent: -50 }); F.in(wk, w('30', 462.2) - 0.2, 'right', { dur: 0.35, sfx: 'pop' });
    const n = wk.querySelector('.n'); F.every(S, (G) => { n.textContent = Math.round(30 * Math.max(0, Math.min(1, (G - w('30', 462.2)) / 0.9))) + 'h'; });
    const old = F.hand(S.ui, 'thousands of old court pages', 1150, 330, 52, '#5D6B88', -2); F.in(old, w('court', 464.6), 'none', { dur: 0.35, sfx: false }); F.out(old, w('summarizing', 465.6), 'above', { dur: 0.3 });
    const nda = F.html(S.ui, `<div style="width:380px;background:#fff;border-radius:10px;padding:24px;box-sizing:border-box;box-shadow:0 18px 30px rgba(14,24,48,.22);font:800 30px Inter;color:${INK}">NON-DISCLOSURE<br>AGREEMENT${[0, 1, 2, 3].map((k) => `<div style="height:12px;border-radius:6px;margin-top:16px;width:${300 - (k % 2) * 60}px;background:${k === 1 ? YL : '#C3CDDC'}"></div>`).join('')}</div>`, 120, 120, 0, 0, 9);
    F.in(nda, w('non', 466.6) - 0.3, 'below', { dur: 0.4, sfx: 'paperslide' }); F.sfx(w('agreements,', 467.3), 'marker', 0.4);
    you.slump(w('summarizing', 465.6), 10);
    S.cam(460.8, 760, 560, 1.06, 1.5).cam(w('30', 462.2) - 0.5, 980, 540, 1.0, 1.4);
  }

  // ===== legal AI scans 10,000 pages, highlights risky clauses (468.44 – 474.16) — isometric =====
  {
    const S = F.shot(468.44, 474.16, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const I = X.iso(720, 660, 1);
    F.set(S.back, I.tile(-280, -280, 560, 560, '#D5DCE7'), 0);
    F.set(S.mid, [...Array(14)].map((_, k) => I.box(-120, -160, 240, 320, 22, k % 2 ? '#F4F6FA' : WH, k * 22)).join(''), 2);
    const top = I.p(0, 0, 320);
    const beam = F.html(S.mid, `<div style="width:700px;height:14px;background:${RD};box-shadow:0 0 30px ${RD};opacity:.85"></div>`, top[0] - 350, top[1] - 160, 0, 0, 4); F.hidden(beam);
    F.show(beam, w('scan', 469.6)); F.fromTo(beam, w('scan', 469.6), { y: 0 }, { y: 400 }, 1.4, 'sine.inOut'); F.hide(beam, w('scan', 469.6) + 1.45); F.sfx(w('scan', 469.6), 'copier', 0.4);
    const cnt = F.label(S.ui, '<span class="n">0</span> pages', 340, 170, { size: 72, bg: YL, color: INK, rot: -3, font: "'Archivo Black'", weight: 400 }); F.in(cnt, w('10', 469.9) - 0.2, 'left', { dur: 0.35, sfx: false });
    const n = cnt.querySelector('.n'); F.every(S, (G) => { n.textContent = Math.round(10000 * Math.max(0, Math.min(1, (G - w('10', 469.9)) / 0.9))).toLocaleString('en-US'); });
    const rob = F.puppet(S, S.mid, 'intern', 1160, 960, 1.0, { mood: 'happy', armL: 'point' });
    const doc = F.html(S.ui, `<div style="width:520px;background:#fff;border-radius:10px;padding:30px;box-sizing:border-box;box-shadow:0 20px 36px rgba(14,24,48,.22);font:800 32px Inter;color:${INK};transform:rotate(2deg)">NDA §7.2${[...Array(7)].map((_, k) => `<div class="ln${k}" style="height:16px;border-radius:8px;margin-top:22px;width:${440 - (k % 3) * 70}px;background:#C3CDDC;position:relative"></div>`).join('')}</div>`, 1340, 230, 0, 0, 9);
    F.in(doc, w('highlight', 471.3) - 0.4, 'right', { dur: 0.4 });
    [2, 5].forEach((k, i) => { const l = doc.querySelector('.ln' + k); const t = w('risky', 472.1) + i * 0.3; F.fromTo(l, t, { backgroundColor: '#C3CDDC' }, { backgroundColor: YL }, 0.2); F.sfx(t, 'marker', 0.4);
      const fl = F.html(l, `<div style="position:absolute;right:-60px;top:-20px;width:44px;height:56px"><div style="width:6px;height:56px;background:${INK}"></div><div style="position:absolute;left:6px;top:0;width:36px;height:26px;background:${RD}"></div></div>`, 0, 0, 0, 0, 2);
      F.fromTo(fl, t + 0.15, { opacity: 0, y: -20 }, { opacity: 1, y: 0 }, 0.25); });
    const sw = F.prop(S.ui, P.stopwatch(0, 0, 0.52, '0:59'), 1620, 860, 190, 230, 10); F.in(sw, w('minute.', 473.5) - 0.3, 'none', { dur: 0.3, sfx: 'ding', gain: 0.5 });
    S.cam(468.5, 960, 540, 1.02, 5, 'inOutSine');
  }

  // ===== the switch: workflows, private client data, new AI laws (474.16 – 484.66) =====
  {
    const S = F.shot(474.16, 484.66, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 7, w('pivot', 474.5), 3.0);
    X.role(F, S.ui, 'LEGAL OPERATIONS MANAGER', 1260, 125, w('legal', 475.5) - 0.1, 50);
    X.role(F, S.ui, 'AI COMPLIANCE SPECIALIST', 1300, 220, w('compliance', 477.1) - 0.1, 50);
    const you = F.puppet(S, S.mid, 'you', 330, 940, 1.45, { mood: 'smile', armR: 'down', look: { top: INK, top2: '#24365E' }, badge: `<circle cx="30" cy="-150" r="15" fill="${GR}"/>` });
    you.arm(w('sets', 478.9), 'r', 'point', 0.4);
    const wf = [['INTAKE', BL], ['AI REVIEW', RD], ['LAWYER ✓', GR]].map(([t, c], i) => { const d = F.label(S.mid, t, 680 + i * 330, 420, { size: 44, bg: c, color: WH, rot: 0, z: 3 }); F.in(d, w('sets', 478.9) + i * 0.3, 'below', { dur: 0.35, sfx: 'clickin', gain: 0.35 });
      if (i < 2) { const a = F.set(S.mid, `<path d="M${680 + i * 330 + 120} 420 h80 m-18 -14 l18 14 l-18 14" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`, 2); F.fromTo(a, w('software', 480) + i * 0.3, { opacity: 0 }, { opacity: 1 }, 0.2); } return d; });
    const vault = F.html(S.mid, `<div style="width:300px;height:300px;border-radius:20px;background:#5D6B88;box-shadow:0 18px 30px rgba(14,24,48,.3);position:relative"><div style="position:absolute;inset:20px;border-radius:14px;background:#3A4C74"></div><div style="position:absolute;left:50%;top:50%;width:110px;height:110px;margin:-55px 0 0 -55px;border-radius:50%;border:12px solid #C3CDDC"></div><div class="fd" style="position:absolute;left:70px;top:-120px;width:160px;height:110px;border-radius:8px;background:${YL};font:800 22px Inter;color:${INK};display:grid;place-items:center">CLIENT DATA</div></div>`, 830, 560, 0, 0, 3);
    F.in(vault, w('client', 481.4) - 0.4, 'below', { dur: 0.4 });
    F.fromTo(vault.querySelector('.fd'), w('private', 482.3) - 0.4, { y: 0 }, { y: 200, opacity: 0 }, 0.5, 'power2.in'); F.sfx(w('private', 482.3), 'lock', 0.6);
    const law = F.html(S.mid, `<div style="width:260px;height:320px;border-radius:10px;background:${INK};box-shadow:0 18px 30px rgba(14,24,48,.3);padding:30px 24px;box-sizing:border-box;color:#fff;font:400 38px/1.15 'Archivo Black';text-align:center">NEW<br>AI<br>LAWS<div style="margin:20px auto 0;width:80px;height:8px;background:${YL}"></div></div>`, 1300, 560, 0, 0, 3);
    F.in(law, w('laws.', 483.6) - 0.6, 'right', { dur: 0.4, sfx: 'thud', gain: 0.5 });
    S.cam(474.3, 960, 560, 1.02, 10, 'inOutSine');
  }

  // ===== evaluate software, protect privacy (484.66 – 489.46) =====
  {
    const S = F.shot(484.66, 489.46, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const items = ['Where is client data stored?', 'Is it used to train models?', 'Who can see the prompts?', 'Can we delete it?'];
    const cl = F.html(S.mid, `<div style="width:900px;background:#fff;border-radius:14px;padding:40px 46px;box-sizing:border-box;box-shadow:0 22px 40px rgba(14,24,48,.2);font:700 40px Inter;color:${INK}"><div style="font:400 40px 'Archivo Black';margin-bottom:20px">SOFTWARE CHECKLIST</div>${items.map((t, i) => `<div style="display:flex;align-items:center;gap:20px;margin-top:20px"><div class="b${i}" style="width:48px;height:48px;border-radius:10px;border:4px solid #C3CDDC;display:grid;place-items:center;color:#fff;font:800 32px Inter;flex:none"><span class="k" style="opacity:0">✓</span></div>${t}</div>`).join('')}</div>`, 510, 200, 0, 0, 3);
    F.in(cl, 484.8, 'below', { dur: 0.45, sfx: 'paperslide' });
    items.forEach((_, i) => { const b = cl.querySelector('.b' + i), t = w('evaluate', 486.3) + i * 0.6; F.fromTo(b, t, { backgroundColor: 'rgba(52,168,83,0)', borderColor: '#C3CDDC' }, { backgroundColor: '#34A853', borderColor: '#34A853' }, 0.2); F.fromTo(b.querySelector('.k'), t, { opacity: 0 }, { opacity: 1 }, 0.2); F.sfx(t, 'tick', 0.5); });
    S.cam(484.8, 960, 540, 1.04, 4.5, 'inOutSine');
  }

  // ===== the prompt (489.46 – 510.40) =====
  {
    const S = F.shot(489.46, 510.40);
    X.prompt(F, S, 8, 'Act as a legal operations director at a mid-sized law firm. I am a paralegal transitioning into legal operations and AI compliance. Teach me the five biggest data privacy risks when lawyers use AI tools on client files and help me draft a one-page AI usage policy that I can show during job interviews.', w('Act', 491.6), w('interviews.', 509.4) + 0.3, { tIn: 489.9, size: 42 });
  }
  F.done();
})();
