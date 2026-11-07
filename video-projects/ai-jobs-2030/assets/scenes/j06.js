// j06 — Traditional Translator -> Cultural Localization Specialist (340.32 – 396.58)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const book = (col, t) => `<g filter="url(#cut)"><rect x="-70" y="-95" width="140" height="190" rx="8" fill="${col}"/><rect x="-56" y="-95" width="10" height="190" fill="rgba(0,0,0,.18)"/>${F.T(t, 6, 10, 28, WH, 'Archivo Black')}</g>`;

  // ===== card (340.32 – 343.08) =====
  {
    const S = F.shot(340.32, 343.08);
    X.card(F, S, 6, 'TRADITIONAL TRANSLATOR', 340.45, (I) => I.box(-190, -120, 320, 150, 100, '#9AA8BE') + [0, 1, 2, 3].map(k => I.box(-160 + k * 6, -100, 100, 70, 22, [RD, BL, GR, OR][k], 100 + k * 22)).join('') + I.box(60, -60, 8, 8, 120, INK, 100) + I.box(68, -60, 50, 4, 34, BL, 186) + I.box(-60, 90, 8, 8, 120, INK) + I.box(-52, 90, 50, 4, 34, RD, 86), { size: 64 });
  }

  // ===== buried in dictionaries; machine translation + voice models (343.08 – 348.40) =====
  {
    const S = F.shot(343.08, 348.40, { cam: [960, 560, 1.0] });
    X.tiltIn(F, S, 343.08);
    X.room(F, S);
    F.set(S.mid, P.desk(140, 780, 760), 3);
    const you = F.puppet(S, S.mid, 'you', 420, 920, 1.45, { mood: 'tired', armL: 'type', armR: 'type', z: 1 });
    [[220, 690, BL, 'EN'], [330, 680, RD, 'ES'], [620, 690, GR, 'FR'], [720, 700, OR, 'DE']].forEach(([x, y, c, t], i) => { const b = F.prop(S.mid, book(c, t), x, y, 160, 210, 4); F.in(b, 343.2 + i * 0.2, 'above', { dur: 0.35, sfx: i ? false : 'thud', gain: 0.4 }); });
    const rob = F.puppet(S, S.mid, 'intern', 1500, 960, 1.15, { mood: 'happy', armL: 'fwd', armR: 'fwd' });
    rob.enter(w('neural', 345) - 0.4, 'right');
    const pA = F.html(S.ui, `<div style="width:300px;padding:20px;border-radius:12px;background:#fff;box-shadow:0 12px 24px rgba(14,24,48,.2);font:700 30px Inter;color:${INK}">Hello, friend</div>`, 1060, 230, 0, 0, 9);
    const pB = F.html(S.ui, `<div style="width:300px;padding:20px;border-radius:12px;background:${BL};box-shadow:0 12px 24px rgba(14,24,48,.2);font:700 30px Inter;color:#fff">Hola, amigo</div>`, 1520, 230, 0, 0, 9);
    F.in(pA, w('translation', 345.5) - 0.2, 'left', { dur: 0.35, sfx: 'pop' }); F.in(pB, w('tools', 346.1) - 0.1, 'right', { dur: 0.35, sfx: 'swish', gain: 0.35 });
    const arr = F.set(S.ui, `<path d="M1380 270 h120 m-24 -18 l24 18 l-24 18" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`, 9); F.fromTo(arr, w('tools', 346.1), { opacity: 0 }, { opacity: 1 }, 0.25);
    const wave = F.html(S.ui, `<svg width="520" height="120" viewBox="0 0 520 120">${[...Array(26)].map((_, i) => `<rect class="b" x="${i * 20}" y="${60 - (10 + Math.abs(Math.sin(i * 1.7)) * 46)}" width="12" height="${(10 + Math.abs(Math.sin(i * 1.7)) * 46) * 2}" rx="6" fill="${RD}"/>`).join('')}</svg>`, 1080, 380, 0, 0, 9);
    F.in(wave, w('voice', 347.3) - 0.2, 'below', { dur: 0.35, sfx: 'blip', gain: 0.35 });
    F.every(S, (G) => { wave.style.transform = `scaleY(${0.7 + 0.3 * Math.abs(Math.sin(G * 9))})`; });
    you.mood(w('neural', 345), 'look').tilt(w('neural', 345), 6);
    S.cam(343.2, 760, 580, 1.08, 1.4).cam(w('neural', 345) - 0.5, 1060, 540, 1.0, 1.2);
  }

  // ===== contracts, videos, live meetings in seconds for pennies (348.40 – 354.16) =====
  {
    const S = F.shot(348.40, 354.16, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const card = (x, html, t, label) => { const d = F.html(S.mid, `<div style="width:460px;height:400px;border-radius:20px;background:#fff;box-shadow:0 20px 40px rgba(14,24,48,.2);overflow:hidden;position:relative">${html}<div style="position:absolute;left:0;right:0;bottom:0;padding:14px;background:${INK};color:#fff;font:800 30px Inter;text-align:center">${label}</div></div>`, x, 220, 0, 0, 3); F.in(d, t - 0.2, 'below', { dur: 0.4, sfx: 'paperslide', gain: 0.35 }); return d; };
    card(130, `<div style="padding:30px;font:700 24px Inter;color:${INK}">CONTRACT<div style="font:500 22px/1.7 Inter;color:#7D879A;margin-top:10px">Cláusula 7.2 — Confidencialidad…<br>Clause 7.2 — Confidentiality…</div><div style="position:absolute;right:30px;top:120px;width:100px;height:100px;border:6px solid ${RD};border-radius:50%;color:${RD};font:800 22px Inter;display:grid;place-items:center;transform:rotate(-12deg)">SEAL</div></div>`, w('legal', 349), 'legal contracts');
    card(730, `<div style="height:330px;background:linear-gradient(135deg,#2A62C9,${BL});position:relative"><div style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:0;height:0;border-left:56px solid #fff;border-top:34px solid transparent;border-bottom:34px solid transparent"></div><div style="position:absolute;left:30px;right:30px;bottom:24px;padding:8px;background:rgba(0,0,0,.6);color:#fff;font:700 24px Inter;text-align:center">[EN] Welcome to our launch</div></div>`, w('videos,', 350.2), 'videos');
    card(1330, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:6px;height:330px;box-sizing:border-box">${['#FBE3DF', '#DDEAFD', '#DDF1E3', '#FFF3CC'].map((c, i) => `<div style="background:${c};border-radius:8px;position:relative"><div style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;background:${[C.skin1, C.skin2, C.skin3, C.skin1][i]}"></div><div style="position:absolute;left:6px;right:6px;bottom:6px;font:700 15px Inter;color:${INK};background:#fff;border-radius:4px;padding:2px 4px">${['Hola', 'Hi', 'Ciao', 'Hallo'][i]} → EN</div></div>`).join('')}</div>`, w('live', 351), 'live meetings');
    const sw = F.prop(S.ui, P.stopwatch(0, 0, 0.55, '0:02'), 520, 870, 200, 240, 10); F.in(sw, w('seconds', 352.4) - 0.1, 'none', { dur: 0.3, sfx: 'ding', gain: 0.5 });
    const coins = [0, 1, 2].map((i) => { const c = F.prop(S.ui, `<g filter="url(#cut)"><circle r="44" fill="#C97A3A"/><circle r="34" fill="none" stroke="#9C5A26" stroke-width="5"/>${F.T('1¢', 0, 14, 36, '#5A3214', 'Archivo Black')}</g>`, 1240 + i * 110, 880, 110, 110, 10);
      F.fromTo(c, w('pennies.', 353.1) - 0.1 + i * 0.12, { opacity: 0, y: -300 }, { opacity: 1, y: 0 }, 0.35, 'bounce.out'); F.sfx(w('pennies.', 353.1) + i * 0.12 + 0.2, 'coin', 0.4); return c; });
    S.cam(348.5, 960, 540, 1.03, 5, 'inOutSine');
  }

  // ===== the switch (354.16 – 357.60) =====
  {
    const S = F.shot(354.16, 357.60, { cam: [960, 540, 1.0] });
    X.room(F, S, '#E2E8F1', '#CBD4E2', 900);
    X.cornerBoard(F, S, 5, w('switch', 354.5), 2.6);
    const globe = `<circle cx="22" cy="-150" r="14" fill="${GR}"/>`;
    const you = F.puppet(S, S.mid, 'you', 960, 930, 1.6, { mood: 'smile', armL: 'hip', armR: 'hip', badge: globe });
    you.hop(w('cultural', 355.5));
    X.role(F, S.ui, 'CULTURAL LOCALIZATION SPECIALIST', 1130, 180, w('localization', 355.9) - 0.1, 54);
    ['🇯🇵', '🇧🇷', '🇩🇪', '🇸🇦', '🇮🇳'].forEach((f, i) => { const d = F.label(S.mid, f, 560 + i * 200, 470 + (i % 2) * 40, { size: 60, bg: WH, color: INK, rot: (i % 2 ? 4 : -4), font: 'Inter', z: 4 }); F.in(d, w('specialist', 356.6) + i * 0.1, 'none', { dur: 0.25, sfx: 'pop', gain: 0.2 }); });
  }

  // ===== campaign, joke, launch: don't offend; don't sound like a textbook (357.60 – 365.90) =====
  {
    const S = F.shot(357.60, 365.90, { cam: [960, 540, 1.0] });
    X.room(F, S);
    const icons = [['📣', 'brand campaign', 'campaign,', 358.2], ['😄', 'joke', 'joke,', 359.2], ['🚀', 'product launch', 'launch', 360.1]];
    const ic = icons.map(([e, t, wd, af], i) => { const d = F.html(S.ui, `<div style="display:flex;align-items:center;gap:12px;padding:14px 24px;border-radius:40px;background:#fff;box-shadow:0 10px 20px rgba(14,24,48,.18);font:800 34px Inter;color:${INK}"><span style="font-size:44px">${e}</span>${t}</div>`, 140 + i * 520, 90, 0, 0, 9); F.in(d, w(wd, af) - 0.2, 'above', { dur: 0.35, sfx: 'pop', gain: 0.3 }); return d; });
    const pin = F.prop(S.ui, `<g filter="url(#cut)"><path d="M0 50 C-50 -10 -36 -50 0 -50 C36 -50 50 -10 0 50Z" fill="${RD}"/><circle cy="-18" r="14" fill="#fff"/></g>`, 1720, 120, 110, 120, 9); F.in(pin, w('country', 360.9) - 0.2, 'above', { dur: 0.35, sfx: 'clip', gain: 0.4 });
    F.set(S.mid, `<g filter="url(#cut)"><rect x="300" y="220" width="760" height="380" fill="${WH}"/><rect x="660" y="600" width="40" height="320" fill="#8C97AA"/></g>`, 2);
    const bad = F.html(S.mid, `<div style="width:700px;height:320px;background:${OR};display:grid;place-items:center;text-align:center;color:#fff"><div><div style="font:800 64px 'Bricolage Grotesque'">“Eat your fingers off!”</div><div style="font:700 38px Caveat;color:#FFF3CC;margin-top:10px">(word-for-word translation)</div></div></div>`, 330, 250, 0, 0, 3);
    const good = F.html(S.mid, `<div style="width:700px;height:320px;background:${GR};display:grid;place-items:center;text-align:center;color:#fff"><div><div style="font:800 60px 'Bricolage Grotesque'">“So good you’ll lick<br>your fingers!”</div><div style="font:700 38px Caveat;color:#E6F5EA;margin-top:6px">(localized)</div></div></div>`, 330, 250, 0, 0, 4);
    F.hidden(good); F.in(bad, 357.7, 'none', { dur: 0.4, sfx: false });
    const crowd = [[260, 'client'], [460, 'co2'], [1100, 'co1'], [1280, 'exec']].map(([x, k]) => F.puppet(S, S.mid, k, x, 960, 0.9, { mood: 'neutral', z: 5 }));
    const to = w('offend', 362.6);
    crowd.forEach((c, i) => c.mood(to - 0.1 + i * 0.1, i % 2 ? 'shock' : 'angry')); F.sfx(to, 'gasp', 0.45);
    const tb = F.html(S.ui, `<div style="width:260px;height:320px;border-radius:8px;background:#C3CDDC;box-shadow:0 14px 26px rgba(14,24,48,.25);padding:20px;box-sizing:border-box;font:400 32px 'Archivo Black';color:${INK};text-align:center;transform:rotate(3deg)">STIFF<br>TEXT<br>BOOK<div style="font:600 20px 'JetBrains Mono',monospace;margin-top:20px;color:#5D6B88">“Greetings, valued purchaser.”</div></div>`, 1560, 150, 0, 0, 9);
    F.in(tb, w('stiff', 364.6) - 0.3, 'right', { dur: 0.35, sfx: 'creak', gain: 0.4 });
    const you = F.puppet(S, S.mid, 'you', 1640, 960, 1.15, { mood: 'smile', armL: 'down', flip: true, z: 6 });
    you.enter(w('buyers', 363.3), 'right').arm(w('sound', 364.1), 'l', 'point', 0.4);
    F.show(good, w('textbook.', 364.8) + 0.3); F.fromTo(good, w('textbook.', 364.8) + 0.3, { rotationY: 90 }, { rotationY: 0 }, 0.35); F.sfx(w('textbook.', 364.8) + 0.3, 'flip', 0.5);
    crowd.forEach((c, i) => c.mood(w('textbook.', 364.8) + 0.6 + i * 0.08, 'happy')); F.sfx(w('textbook.', 364.8) + 0.6, 'warm', 0.4);
    S.cam(357.7, 900, 560, 1.02, 7, 'inOutSine');
  }

  // ===== localization audit: machine alone hurts sales (365.90 – 372.34) =====
  {
    const S = F.shot(365.90, 372.34, { cam: [960, 540, 1.0] });
    S.el.style.backgroundColor = '#E9EDF3';
    const rep = F.html(S.mid, `<div style="width:1100px;height:640px;background:#fff;border-radius:12px;box-shadow:0 24px 46px rgba(14,24,48,.2);padding:40px 50px;box-sizing:border-box;position:relative"><div style="font:400 46px 'Archivo Black';color:${INK}">LOCALIZATION AUDIT</div><div style="font:700 28px Inter;color:#7D879A;margin-top:6px">Spring campaign · 3 markets</div>
      <svg width="1000" height="420" viewBox="0 0 1000 420" style="position:absolute;left:50px;top:180px"><path d="M0 400 H1000 M0 0 V400" stroke="#C3CDDC" stroke-width="4"/><path class="g" d="M20 330 C 260 300, 480 220, 980 60" stroke="${GR}" stroke-width="14" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path class="r" d="M20 280 C 260 300, 520 340, 980 380" stroke="${RD}" stroke-width="14" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div>`, 410, 230, 0, 0, 3);
    F.in(rep, w('audit', 367.7) - 0.4, 'below', { dur: 0.45, sfx: 'paperslide' });
    F.fromTo(rep.querySelector('.r'), w('machine', 369.3), { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 1.6, 'power1.inOut'); F.sfx(w('machine', 369.3), 'deflate', 0.4);
    F.fromTo(rep.querySelector('.g'), w('alone', 370.3) - 0.6, { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 1.4, 'power1.inOut');
    const l1 = F.label(S.ui, 'MACHINE ONLY ↓', 1720, 820, { size: 40, bg: RD, color: WH, rot: -2 }); F.in(l1, w('hurt', 371), 'right', { dur: 0.3, sfx: false });
    const l2 = F.label(S.ui, 'LOCALIZED ↑', 1720, 300, { size: 40, bg: GR, color: WH, rot: 2 }); F.in(l2, w('alone', 370.3), 'right', { dur: 0.3, sfx: false });
    const you = F.puppet(S, S.mid, 'you', 230, 980, 1.3, { mood: 'smile', armR: 'point' });
    const emp = F.hand(S.ui, 'show employers', 230, 270, 54, BL, -3); F.in(emp, w('employers', 368.5), 'none', { dur: 0.35, sfx: false });
    S.cam(366, 960, 560, 1.02, 6, 'inOutSine');
  }

  // ===== the prompt (372.34 – 396.58) =====
  {
    const S = F.shot(372.34, 396.58);
    X.prompt(F, S, 6, 'I am a translator pivoting to cultural localization for [your target language and country]. Give me five examples of English marketing slogans that fail or sound awkward when translated word-for-word into my language. Help me build a one-page localization pitch that shows companies how I adapt their brand voice, humor, and cultural references to increase local sales.', w('I', 374.9), w('sales.', 395.1) + 0.3, { tIn: 372.8, size: 40 });
  }
  F.done();
})();
