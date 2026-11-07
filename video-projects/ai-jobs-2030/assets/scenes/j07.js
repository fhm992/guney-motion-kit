// j07 — Junior Graphic Designer -> Brand Systems Director / UX Product Designer (396.58 – 457.26)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;

  // ===== card (396.58 – 399.72) =====
  {
    const S = F.shot(396.58, 399.72);
    X.card(F, S, 7, 'JUNIOR GRAPHIC DESIGNER', 396.7, (I) => I.box(-200, -120, 340, 160, 100, '#9AA8BE') + I.box(-170, -110, 180, 120, 8, INK, 100) + I.box(-160, -100, 160, 100, 3, '#D6E4FB', 108) + [BL, RD, YL, GR, OR].map((c, k) => I.box(60, -110 + k * 32, 60, 24, 10, c, 100)).join(''), { size: 62 });
  }

  // ===== banners, backgrounds, icons (399.72 – 406.68) =====
  {
    const S = F.shot(399.72, 406.68, { cam: [960, 540, 1.0] });
    X.tiltIn(F, S, 399.72);
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 1060, 480, 0.78, 3);
    L.screen.innerHTML = `${F.winBar('Design studio')}<div style="display:flex;gap:26px;padding:30px;height:640px;box-sizing:border-box">
      <div class="ban" style="flex:1.3;border-radius:16px;background:linear-gradient(135deg,${BL},#2A62C9);position:relative;opacity:0"><div style="position:absolute;left:30px;bottom:30px;color:#fff;font:800 60px 'Bricolage Grotesque'">SALE 40%</div></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:26px"><div class="ph" style="flex:1;border-radius:16px;background:#FBE3DF;position:relative;overflow:hidden;opacity:0"><div class="bg" style="position:absolute;inset:0;background-image:linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,#fff 25%,#fff 75%,#ddd 75%);background-size:40px 40px;background-position:0 0,20px 20px;opacity:0"></div><div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:140px;height:200px;border-radius:70px 70px 0 0;background:${C.skin2}"></div></div>
      <div class="ic" style="height:150px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${[BL, RD, YL, GR, OR, BL, RD, GR].map((c) => `<div class="i" style="border-radius:14px;background:${c};opacity:0"></div>`).join('')}</div></div></div>`;
    F.fromTo(L.screen.querySelector('.ban'), 400.3, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }, 0.4); F.sfx(400.3, 'pop', 0.4);
    F.fromTo(L.screen.querySelector('.ph'), w('removes', 403.5) - 0.2, { opacity: 0 }, { opacity: 1 }, 0.3); F.fromTo(L.screen.querySelector('.bg'), w('backgrounds,', 403.8) + 0.1, { opacity: 0 }, { opacity: 1 }, 0.4); F.sfx(w('backgrounds,', 403.8), 'sand', 0.4);
    [...L.screen.querySelectorAll('.i')].forEach((d, i) => { F.fromTo(d, w('icons,', 405.5) - 0.3 + i * 0.07, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, 0.2, 'back.out(2)'); F.sfx(w('icons,', 405.5) - 0.3 + i * 0.07, 'pop', 0.15); });
    const you = F.puppet(S, S.front, 'you', 230, 1140, 1.5, { mood: 'smile', armR: 'fwd', noShadow: true });
    S.cam(399.8, 960, 520, 1.03, 6, 'inOutSine');
  }

  // ===== a 10-word text box does it (406.68 – 412.96) =====
  {
    const S = F.shot(406.68, 412.96, { cam: [960, 500, 1.0] });
    S.el.style.backgroundColor = '#DCE3EE';
    const L = F.laptop(S.mid, 960, 480, 0.9, 3);
    L.screen.innerHTML = `${F.winBar('Design tool · generate')}<div style="padding:30px 40px"><div style="border:3px solid ${BL};border-radius:16px;padding:18px 22px;font:500 38px Inter;color:${INK};min-height:56px"><span class="tx"></span><span style="display:inline-block;width:4px;height:40px;background:${BL};vertical-align:-6px"></span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px">${[[BL, '#2A62C9'], [YL, OR], [OR, RD], [GR, '#1E8E3E']].map(([a, b]) => `<div class="g" style="height:220px;border-radius:14px;background:linear-gradient(135deg,${a},${b});position:relative;opacity:0"><div style="position:absolute;left:24px;bottom:20px;color:#fff;font:800 44px 'Bricolage Grotesque'">SUMMER SALE</div></div>`).join('')}</div></div>`;
    const tx = L.screen.querySelector('.tx'), prm = 'summer sale banner, bold yellow, happy family, beach, 40% off', t0 = w('image', 406.6), t1 = w('word', 410.5);
    F.every(S, (G) => { tx.textContent = prm.slice(0, Math.round(prm.length * Math.max(0, Math.min(1, (G - t0) / (t1 - t0))))); });
    for (let x = t0; x < t1; x += 0.12) F.sfx(x, 'key', 0.15);
    [...L.screen.querySelectorAll('.g')].forEach((g, i) => { F.fromTo(g, w('box.', 411.1) + 0.1 + i * 0.12, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }, 0.3); F.sfx(w('box.', 411.1) + 0.1 + i * 0.12, 'pop', 0.3); });
    const ten = F.label(S.ui, '10 WORDS', 1700, 990, { size: 56, bg: YL, color: INK, rot: -3, font: "'Archivo Black'", weight: 400 }); F.in(ten, w('10', 410.2), 'right', { dur: 0.3, sfx: false });
    S.cam(406.8, 960, 480, 1.04, 5, 'inOutSine');
  }

  // ===== production teams shrink; one person directs the style (412.96 – 421.14) =====
  {
    const S = F.shot(412.96, 421.14, { cam: [960, 560, 1.0] });
    X.room(F, S);
    const lb = F.label(S.ui, 'THE ENTIRE CREATIVE INDUSTRY', 960, 130, { size: 54, bg: INK, color: WH, rot: -1 }); F.in(lb, w('Across', 412.9), 'above', { dur: 0.4 });
    const team = [300, 520, 740, 1180, 1400, 1620].map((x, i) => F.puppet(S, S.mid, ['co1', 'co2', 'grey', 'client', 'newhire', 'exec'][i], x, 900, 1.0, { mood: 'neutral', z: 3 }));
    const ts = w('shrinking', 415.7);
    team.forEach((t, i) => { t.grey(ts + i * 0.15, true, 0.5); F.to(t.root, ts + 0.6 + i * 0.12, { opacity: 0, y: 40 }, 0.5); });
    F.sfx(ts, 'fade', 0.4);
    const you = F.puppet(S, S.mid, 'you', 960, 920, 1.5, { mood: 'smile', armR: 'down', z: 4 });
    F.hidden(you.root); F.show(you.root, w('hiring', 417.1) - 0.2); F.fromTo(you.root, w('hiring', 417.1) - 0.2, { y: 60, opacity: 0 }, { y: 0, opacity: 1 }, 0.5);
    you.arm(w('direct', 418.5), 'r', 'point', 0.4).mood(w('direct', 418.5), 'happy');
    const sb = F.html(S.mid, `<div style="display:grid;grid-template-columns:repeat(3,110px);gap:10px;padding:18px;border-radius:14px;background:#fff;box-shadow:0 16px 30px rgba(14,24,48,.2)">${[BL, RD, YL, GR, OR, INK].map((c) => `<div style="height:80px;border-radius:8px;background:${c}"></div>`).join('')}<div style="grid-column:1/4;font:800 30px Inter;color:${INK};text-align:center">STYLE SYSTEM</div></div>`, 1250, 420, 0, 0, 5);
    F.in(sb, w('visual', 419) - 0.2, 'right', { dur: 0.4, sfx: 'paperslide' });
    const one = F.hand(S.ui, 'start → finish', 1450, 820, 58, GR, -3); F.in(one, w('finish.', 420.4) - 0.3, 'none', { dur: 0.35, sfx: false });
    S.cam(413, 960, 560, 1.02, 7, 'inOutSine');
  }

  // ===== the switch: UX — how customers actually move to buy (421.14 – 430.38) — isometric journey =====
  {
    const S = F.shot(421.14, 430.38, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    X.cornerBoard(F, S, 6, w('switch', 421.5), 2.8);
    X.role(F, S.ui, 'BRAND SYSTEMS DIRECTOR', 1300, 120, w('brand', 422.4), 50);
    X.role(F, S.ui, 'UI / UX PRODUCT DESIGNER', 1340, 215, w('UI', 423.9), 56);
    const I = X.iso(960, 520, 1);
    F.set(S.back, I.tile(-420, -160, 840, 320, '#D5DCE7'), 0);
    const scr = ['MENU', 'ITEM', 'CART', 'PAY ✓'];
    const phones = scr.map((t, i) => { const [x, y] = I.p(-330 + i * 220, 0, 0); const col = i === 3 ? GR : BL;
      const d = F.set(S.mid, I.box(-360 + i * 220, -30, 70, 14, 150, INK, 0, '#24365E') + `<g transform="translate(${x - 20} ${y - 120}) skewY(30)"><rect x="-26" y="-40" width="62" height="110" rx="6" fill="#fff"/><rect x="-20" y="-30" width="50" height="18" rx="3" fill="${col}"/></g>` + F.T(t, x - 20, y - 200, 30, INK, 'Archivo Black'), 2 + i);
      F.fromTo(d, w('solves', 426) + i * 0.3, { opacity: 0, y: -60 }, { opacity: 1, y: 0 }, 0.35, 'power3.out'); F.sfx(w('solves', 426) + i * 0.3, 'clickin', 0.3); return d; });
    const path = F.set(S.mid, (() => { const pts = scr.map((_, i) => I.p(-330 + i * 220, 150, 0)); return `<path d="M${pts.map(q => q.join(' ')).join(' L')}" stroke="${OR}" stroke-width="8" stroke-dasharray="14 14" fill="none" stroke-linecap="round"/>`; })(), 1);
    F.fromTo(path, w('move', 427.5) - 0.3, { opacity: 0 }, { opacity: 1 }, 0.4);
    const walker = F.puppet(S, S.mid, 'client', I.p(-330, 150)[0], I.p(-330, 150)[1], 0.55, { mood: 'smile', z: 9 });
    const tm = w('move', 427.5); walker.walk(tm, tm + 2.0);
    const end = I.p(330, 150); walker.move(tm, end[0], end[1], 2.0, 'none');
    F.sfx(tm, 'step', 0.3); F.sfx(w('something.', 429.4), 'ding', 0.5);
    S.cam(421.2, 960, 520, 1.02, 9, 'inOutSine');
  }

  // ===== case study this weekend (430.38 – 435.36) =====
  {
    const S = F.shot(430.38, 435.36, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const you = F.puppet(S, S.mid, 'you', 380, 960, 1.45, { mood: 'happy', armR: 'fwd' });
    const eye = F.prop(S.ui, `<g filter="url(#cut)"><path d="M-110 0 Q0 -80 110 0 Q0 80 -110 0Z" fill="#fff"/><circle r="40" fill="${BL}"/><circle r="18" fill="${INK}"/></g>`, 380, 300, 240, 180, 9);
    F.in(eye, w('eye', 432) - 0.2, 'none', { dur: 0.3, sfx: 'wink', gain: 0.4 }); F.out(eye, w('user', 433.3) - 0.2, 'above', { dur: 0.3 });
    const cs = F.html(S.mid, `<div style="width:620px;height:460px;border-radius:14px;background:#fff;box-shadow:0 22px 40px rgba(14,24,48,.22);padding:34px;box-sizing:border-box"><div style="font:400 44px 'Archivo Black';color:${INK}">UX CASE STUDY</div><div style="font:700 26px Inter;color:#7D879A;margin:8px 0 22px">problem · journey · redesign</div><div style="display:flex;gap:14px">${[BL, OR, GR].map((c) => `<div style="flex:1;height:220px;border-radius:12px;border:4px solid ${c}"></div>`).join('')}</div></div>`, 700, 260, 0, 0, 3);
    F.in(cs, w('user', 433.3) - 0.3, 'right', { dur: 0.45, sfx: 'paperslide' });
    const cal = F.html(S.ui, `<div style="display:flex;gap:10px">${['SAT', 'SUN'].map((d) => `<div style="width:140px;height:150px;border-radius:12px;background:#fff;box-shadow:0 12px 22px rgba(14,24,48,.2);overflow:hidden"><div style="height:46px;background:${RD};color:#fff;font:400 26px 'Archivo Black';display:grid;place-items:center">${d}</div><div style="height:104px;display:grid;place-items:center;font:800 64px Inter;color:${GR}">✓</div></div>`).join('')}</div>`, 1440, 780, 0, 0, 9);
    F.in(cal, w('weekend.', 434.9) - 0.2, 'right', { dur: 0.35, sfx: 'tick', gain: 0.5 });
    S.cam(430.5, 960, 540, 1.02, 5, 'inOutSine');
  }

  // ===== the prompt (435.36 – 457.26) =====
  {
    const S = F.shot(435.36, 457.26);
    X.prompt(F, S, 7, 'Act as a lead UX designer. I am a graphic designer switching to product design. Give me a real-world design problem for a local restaurant mobile ordering app where customers keep abandoning their cart. Walk me through how to research the user problem, map the customer journey, and present a three-screen redesigned case study for my portfolio.', w('Act', 438), w('portfolio.', 455.9) + 0.4, { tIn: 435.8, size: 40 });
  }
  F.done();
})();
