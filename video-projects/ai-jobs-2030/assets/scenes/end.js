// end — Outro: you run the update; Fahim; comment + subscribe; signature (617.70 – 652.10)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;

  // ===== AI is not erasing work itself — the full board (617.70 – 620.40) =====
  {
    const S = F.shot(617.70, 620.40, { cam: [960, 540, 1.0] });
    F.wipe(617.70);
    X.darkBg(F, S);
    const B = X.board(F, S.mid, 960, 520, 0.95, { done: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], z: 4 });
    F.in(B.el, 617.8, 'below', { dur: 0.6, rot: 0, sfx: false });
    B.rows.forEach((r, i) => F.fromTo(r.g, 618.2 + i * 0.07, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, 0.25));
    F.sfx(618.2, 'flipcards', 0.4);
    S.cam(617.8, 960, 520, 1.05, 2.6, 'inOutSine');
  }

  // ===== it erases the robotic parts (620.40 – 625.60) =====
  {
    const S = F.shot(620.40, 625.60, { cam: [960, 560, 1.0] });
    X.room(F, S);
    const you = F.puppet(S, S.mid, 'you', 760, 940, 1.5, { mood: 'neutral', armL: 'down', armR: 'down' });
    const grey = ['copy data', 'reset passwords', 'retype drafts', 'click 50×', 'dial lists'].map((t, i) => { const c = F.prop(S.mid, K.card(t, '#B3BCCB', 230, 110, INK, 34), 380 + (i % 3) * 260, 260 + Math.floor(i / 3) * 150, 250, 130, 3 + i); F.in(c, 620.5 + i * 0.12, 'none', { dur: 0.25, sfx: false }); return c; });
    const human = ['judgment', 'trust', 'strategy'].map((t, i) => { const c = F.prop(S.mid, K.card(t, BL, 230, 110, WH, 38), 1300, 280 + i * 150, 250, 130, 3); F.in(c, 620.7 + i * 0.12, 'none', { dur: 0.25, sfx: false }); return c; });
    const rob = F.puppet(S, S.mid, 'intern', 1650, 960, 1.1, { mood: 'happy', armL: 'up' });
    const er = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#F4B8C8"/><rect x="-60" y="-30" width="50" height="60" rx="10" fill="${BL}"/></g>`, 1500, 500, 140, 80, 9);
    F.hidden(er); F.show(er, w('robotic', 621)); 
    grey.forEach((c, i) => { const t = w('robotic', 621) + i * 0.35; const x = 380 + (i % 3) * 260 - 1500, y = 260 + Math.floor(i / 3) * 150 - 500;
      F.to(er, t - 0.15, { x, y }, 0.15); F.tl.to(er, { rotation: 14, duration: 0.06, yoyo: true, repeat: 3 }, F.rel(t)); F.to(c, t, { opacity: 0, scale: 0.6 }, 0.3); F.sfx(t, 'sand', 0.3); });
    F.to(er, w('robotic', 621) + 1.9, { opacity: 0 }, 0.3);
    you.mood(w('stuck', 622.8), 'smile').arms(w('day.', 624.9), 'high', 'high', 0.5);
    const lp = F.label(S.ui, 'ROBOTIC PARTS: ERASED', 760, 960, { size: 54, bg: RD, color: WH, rot: -1.5 }); F.in(lp, w('parts', 621.5), 'below', { dur: 0.35 });
    const hu = F.label(S.ui, 'YOU KEEP THE HUMAN PARTS', 1260, 110, { size: 44, bg: GR, color: WH, rot: 1.5 }); F.in(hu, w('day.', 624.9) - 0.6, 'above', { dur: 0.35 });
    S.cam(620.5, 960, 560, 1.03, 5, 'inOutSine');
  }

  // ===== next time you check your feed (625.60 – 629.40) =====
  {
    const S = F.shot(625.60, 629.40, { cam: [960, 540, 1.04] });
    X.room(F, S, '#DCE6F5', '#C9D4E6', 840);
    F.set(S.back, `<g filter="url(#cut)"><rect x="1250" y="110" width="540" height="430" fill="#BFD6FB"/><rect x="1250" y="390" width="540" height="150" fill="#FFE6A8"/><circle cx="1640" cy="410" r="70" fill="${YL}"/><rect x="1250" y="450" width="540" height="90" fill="#9FB6DA"/><rect x="1250" y="320" width="540" height="14" fill="#fff"/><rect x="1514" y="110" width="14" height="430" fill="#fff"/></g>`);
    const you = F.puppet(S, S.mid, 'you', 560, 1290, 2.4, { mood: 'look', armL: 'hold', armR: 'hold' });
    F.prop(S.mid, P.phone(0, 0, 2.0, 4), 1000, 560, 520, 900, 7);
    const ph = F.html(S.mid, `<div style="width:340px;transform:rotate(4deg)"><div style="font:800 26px Inter;color:${BL};margin-bottom:14px">Feed</div><div style="background:#fff;border:2px solid #E3E8F0;border-radius:16px;padding:18px;font:700 25px/1.3 Inter;color:${INK}">Another software update rolling out company-wide…<div style="height:30px;margin-top:16px;border-radius:8px;border:3px solid #3A4C74;overflow:hidden"><div class="f" style="height:100%;width:30%;background:${RD}"></div></div></div></div>`, 830, 260, 0, 0, 8);
    you.mood(w('worried', 627.8) - 0.2, 'smile').tilt(w('worried', 627.8), 4);
    const nw = F.hand(S.ui, 'not worried.', 1500, 690, 74, GR, -4); F.in(nw, w('worried', 627.8), 'none', { dur: 0.35, sfx: false });
    S.cam(625.7, 980, 520, 1.12, 3.5, 'inOutSine');
  }

  // ===== you will be the person running the update (629.40 – 633.10) — isometric =====
  {
    const S = F.shot(629.40, 633.10, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    X.tiltIn(F, S, 629.40, 0.9);
    const I = X.iso(960, 560, 1);
    F.set(S.back, I.tile(-360, -360, 720, 720, '#D5DCE7'), 0);
    F.set(S.mid, I.box(-60, -60, 120, 120, 60, INK) + I.cyl(0, 0, 44, 18, GR, 60), 2);
    const you = F.puppet(S, S.mid, 'you', 760, 760, 1.15, { mood: 'happy', armR: 'down', z: 4 });
    const tp = w('running', 631.7) - 0.3;
    you.arm(tp - 0.3, 'r', 'fwd', 0.35); F.sfx(tp, 'thunk', 0.6);
    const bots = [1180, 1320, 1460, 1600].map((x, i) => { const b = F.puppet(S, S.mid, 'intern', x, 820 + i * 20, 0.55, { mood: 'happy', z: 5 }); b.enter(tp + 0.3 + i * 0.12, 'right'); return b; });
    const bar = F.html(S.ui, `<div style="width:900px;height:120px;border-radius:16px;background:${INK};padding:36px 30px;box-sizing:border-box;display:flex;align-items:center;gap:24px;box-shadow:0 18px 30px rgba(5,10,25,.3)"><div style="flex:1;height:48px;border-radius:10px;border:4px solid #3A4C74;overflow:hidden"><div class="fill" style="height:100%;width:0;background:${GR}"></div></div><div class="pct" style="font:800 30px Inter;color:#fff;white-space:nowrap">UPDATE 0%</div></div>`, 510, 110, 0, 0, 9);
    F.in(bar, 629.6, 'above', { dur: 0.4, sfx: false });
    const fill = bar.querySelector('.fill'), pct = bar.querySelector('.pct');
    F.every(S, (G) => { const u = Math.max(0, Math.min(1, (G - tp) / 1.0)); fill.style.width = (u * 100) + '%'; pct.textContent = u >= 1 ? 'RUN BY YOU ✓' : 'UPDATE ' + Math.round(u * 100) + '%'; });
    F.sfx(tp + 1.0, 'finale', 0.45); S.shake(tp + 0.05, 5);
    const lb = F.label(S.ui, 'YOU RUN THE UPDATE', 960, 980, { size: 74, bg: GR, color: WH, rot: -1.5 }); F.in(lb, w('update.', 632.3) - 0.1, 'below', { dur: 0.35 });
    S.cam(629.5, 960, 560, 1.06, 3.4, 'inOutSine');
  }

  // ===== I am Fahim · channel · subscribe (633.10 – 637.42) =====
  {
    const S = F.shot(633.10, 641.96, { cam: [960, 540, 1.0] });
    X.darkBg(F, S);
    const name = F.html(S.ui, `<div style="padding:26px 54px;background:${YL};clip-path:${F.rough(91)};font:400 110px/1 'Archivo Black';color:${INK}">FAHIM</div>`, 960, 230, 0, 0, 8, { filter: 'drop-shadow(6px 14px 14px rgba(0,0,0,.45))' });
    gsap.set(name, { xPercent: -50, yPercent: -50 }); F.in(name, w('Fahim,', 633.3) - 0.2, 'above', { dur: 0.45, sfx: 'card', gain: 0.6 });
    const sig = X.sig(F, S.ui, 960, 360, 64, w('Fahim,', 633.3) + 0.2, '#DDE4EE', { rot: -3, swash: YL, z: 9 });
    const tag = F.label(S.ui, 'making AI work for your career', 960, 470, { size: 46, bg: 'none', color: '#C3CDDC', font: 'Inter', weight: 700, flat: true, z: 8 });
    F.in(tag, w('channel', 634.3), 'below', { dur: 0.35, sfx: false });
    const rob = F.puppet(S, S.mid, 'intern', 380, 980, 0.9, { mood: 'happy', armR: 'down', z: 6 });
    const tsub = w('making', 635);
    X.subscribe(F, S.ui, 960, 660, tsub - 0.6, w('career.', 636.5) - 0.1, { z: 12 });
    rob.move(tsub - 0.2, 560, 980, 0.6).walk(tsub - 0.2, tsub + 0.4).arm(w('career.', 636.5) - 0.4, 'r', 'point', 0.25).mood(w('career.', 636.5), 'proud'); rob.exit(w('Comment', 637.4) - 0.4, 'left');
    const hint = F.hand(S.ui, 'new AI-career video every week', 960, 780, 46, YL, -2); F.in(hint, w('career.', 636.5) + 0.5, 'none', { dur: 0.35, sfx: false });
    // comment AI JOBS (637.42 – 641.96)
    const box = F.html(S.ui, `<div style="width:760px;padding:24px 34px;border-radius:22px;background:#fff;box-shadow:0 18px 34px rgba(0,0,0,.35);box-sizing:border-box"><div style="font:600 26px Inter;color:#7D879A">Add a comment…</div><div style="margin-top:10px;font:800 96px 'Bricolage Grotesque';color:${INK};white-space:nowrap"><span class="tx"></span><span style="display:inline-block;width:7px;height:84px;background:${BL};vertical-align:-8px;margin-left:6px"></span></div></div>`, 960, 900, 0, 0, 12);
    gsap.set(box, { xPercent: -50, yPercent: -50 }); F.hidden(box);
    F.out(hint, w('Comment', 637.4) - 0.3, 'below', { dur: 0.3 });
    F.in(box, w('Comment', 637.4) - 0.1, 'below', { dur: 0.4, sfx: 'pop' });
    const tx = box.querySelector('.tx'), t0 = w('AI', 638) - 0.05;
    F.every(S, (G) => { const s = 'AI JOBS'; tx.textContent = s.slice(0, Math.max(0, Math.min(7, Math.floor((G - t0) / 0.1)))); });
    for (let i = 0; i < 7; i++) F.sfx(t0 + i * 0.1, 'key', 0.35);
    const book = F.html(S.ui, `<div style="width:230px;height:300px;border-radius:12px;background:${BL};box-shadow:0 18px 30px rgba(0,0,0,.35);padding:22px;box-sizing:border-box;transform:rotate(-6deg)"><div style="height:100%;background:#fff;border-radius:4px;padding:16px;box-sizing:border-box;font:400 30px 'Archivo Black';color:${INK}">10<br>PROMPTS${[BL, RD, YL, GR].map((c) => `<div style="height:12px;border-radius:6px;background:${c};margin-top:12px"></div>`).join('')}</div></div>`, 300, 640, 0, 0, 11);
    F.in(book, w('full', 640) - 0.2, 'left', { dur: 0.45, sfx: 'paperslide' });
    const yours = F.label(S.ui, 'IT’S YOURS', 300, 850, { size: 46, bg: GR, color: WH, rot: -4, font: "'Archivo Black'", weight: 400, z: 12 }); F.in(yours, w('yours.', 641.1), 'below', { dur: 0.3, sfx: 'stamp', gain: 0.4 });
    S.cam(633.2, 960, 540, 1.04, 8.6, 'inOutSine');
  }

  // ===== recap: worried -> clear pivot + prompts, starting tonight (641.96 – 652.10) =====
  {
    const S = F.shot(641.96, 652.10, { cam: [960, 540, 1.0] });
    X.room(F, S, '#2A3E6A', '#1D2E52', 860);
    F.set(S.back, `<g filter="url(#cut)"><rect x="1220" y="120" width="560" height="420" fill="#14213D"/><circle cx="1640" cy="250" r="56" fill="#FFF3CC"/><circle cx="1670" cy="232" r="50" fill="#14213D"/>${[...Array(9)].map((_, i) => `<circle cx="${1250 + (i * 61) % 520}" cy="${150 + (i * 47) % 360}" r="3" fill="#fff" opacity=".7"/>`).join('')}<rect x="1220" y="320" width="560" height="14" fill="#3A4C74"/><rect x="1494" y="120" width="14" height="420" fill="#3A4C74"/></g>`);
    const sep = F.html(S.mid, '', 0, 0, 1920, 1080, 2);
    const you = F.puppet(S, S.mid, 'you', 620, 960, 1.6, { mood: 'worry', armL: 'down', armR: 'down', z: 3 });
    F.fromTo(S.mid, 641.96, { filter: 'sepia(.9) saturate(.5) brightness(.9)' }, { filter: 'sepia(.9) saturate(.5) brightness(.9)' }, 0.01);
    const tp = w('now', 646.4);
    F.to(S.mid, tp, { filter: 'sepia(0) saturate(1) brightness(1)' }, 0.8); F.sfx(tp, 'tear', 0.4);
    const q = F.hand(S.ui, 'will AI erase my job by 2030?', 660, 300, 66, '#FFFFFF', -3); F.in(q, w('worried', 643.2), 'none', { dur: 0.35, sfx: false }); F.out(q, tp, 'above', { dur: 0.3 });
    you.mood(tp + 0.2, 'happy').arm(w('clear', 647.2), 'r', 'up', 0.4);
    const piv = F.html(S.ui, `<div style="display:flex;align-items:center;gap:22px;font:800 40px Inter;color:#fff"><div style="padding:14px 24px;border-radius:10px;background:${RD};text-decoration:line-through">OLD ROLE</div><div style="font-size:60px;color:${YL}">→</div><div style="padding:14px 24px;border-radius:10px;background:${GR}">NEW ROLE</div></div>`, 960, 160, 0, 0, 9);
    gsap.set(piv, { xPercent: -50 }); F.in(piv, w('clear', 647.2) - 0.1, 'above', { dur: 0.4, sfx: 'flip', gain: 0.5 });
    const cards = [...Array(5)].map((_, i) => { const c = F.html(S.ui, `<div style="width:170px;height:110px;border-radius:12px;background:#fff;box-shadow:0 14px 24px rgba(0,0,0,.3);padding:14px;box-sizing:border-box;font:400 24px 'Archivo Black';color:${INK}">PROMPT ${String(i * 2 + 1).padStart(2, '0')}<div style="height:10px;border-radius:5px;margin-top:12px;background:${[BL, RD, YL, GR, OR][i]}"></div></div>`, 1080 + i * 140, 560 + (i % 2) * 30, 0, 0, 9);
      F.fromTo(c, w('exact', 648.6) + i * 0.1, { opacity: 0, y: 80, rotation: 0 }, { opacity: 1, y: 0, rotation: (i - 2) * 5 }, 0.35, 'back.out(1.6)'); F.sfx(w('exact', 648.6) + i * 0.1, 'flick', 0.3); return c; });
    const lap = F.prop(S.mid, P.laptopBack(0, 0, 0.9), 860, 940, 300, 160, 4); F.in(lap, w('starting', 650.9) - 0.6, 'below', { dur: 0.4, sfx: false });
    const tn = F.label(S.ui, 'STARTING TONIGHT', 1460, 830, { size: 72, bg: YL, color: INK, rot: -2, font: "'Archivo Black'", weight: 400, z: 10 }); F.in(tn, w('tonight.', 651.3) - 0.3, 'below', { dur: 0.35, sfx: 'stamp', gain: 0.5 });
    const sig = X.sig(F, S.ui, 1500, 990, 58, 650.6, '#FFFFFF', { rot: -4, swash: YL, z: 12, dur: 1.0 });
    S.cam(642, 900, 560, 1.06, 9.5, 'inOutSine');
  }
  F.done();
})();
