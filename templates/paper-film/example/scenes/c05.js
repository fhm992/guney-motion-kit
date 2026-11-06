// c05 — Method 5: automate one broken team process (250.50 – 297.74)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;
  const gear = (r, teeth, col, broken = -1) => { let d = ''; for (let i = 0; i < teeth; i++) { if (i === broken) continue; d += `<rect x="-${r * 0.13}" y="${-r - r * 0.22}" width="${r * 0.26}" height="${r * 0.32}" fill="${col}" transform="rotate(${i * 360 / teeth})"/>`; } return `<g filter="url(#cut)">${d}<circle r="${r}" fill="${col}"/><circle r="${r * 0.35}" fill="${C.paper}"/></g>`; };

  // ===== card (250.50 – 254.18) =====
  {
    const S = F.shot(250.50, 254.18);
    F.chapter(S, 250.55, 5, 'FIX ONE BROKEN PROCESS', 'use AI to fix it for everyone');
    const g1 = F.prop(S.front, gear(70, 10, C.tomato, 3), 900, 900, 220, 220, 9, '50% 50%'), g2 = F.prop(S.front, gear(46, 8, C.navy), 1020, 840, 160, 160, 9, '50% 50%');
    F.in(g1, w('broken', 252) - 0.3, 'below', { dur: 0.4, sfx: 'clunk', gain: 0.6 }); F.in(g2, w('broken', 252) - 0.2, 'below', { dur: 0.4, sfx: false });
    F.every(S, (G) => { const q = Math.floor(G * 3) / 3; g1.style.rotate = (q * 40) + 'deg'; g2.style.rotate = (-q * 60) + 'deg'; });
  }

  // ===== the most annoying chore: the weekly status sheet (254.18 – 259.82) =====
  {
    const S = F.shot(254.18, 259.82, { bg: '#E9DDC6', cam: [960, 560, 1.0] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const cab = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-100" y="-200" width="200" height="400" fill="${C.grey2}"/>${[0, 1, 2].map((i) => `<rect x="-84" y="${-184 + i * 128}" width="168" height="112" fill="${C.grey}"/><rect x="-30" y="${-140 + i * 128}" width="60" height="14" rx="6" fill="${C.navy}"/>`).join('')}</g>`, 220, 640, 220, 420, 2);
    const cloud = F.prop(S.mid, K.cloud(300), 220, 300, 340, 180, 3);
    const tc = w('annoying', 254);
    F.in(cloud, tc - 0.2, 'above', { dur: 0.5, sfx: 'rumble', gain: 0.5 });
    F.every(S, (G) => { cloud.style.translate = `${(8 * Math.sin(G * 2)).toFixed(1)}px 0`; });
    const ch = F.hand(S.ui, 'the most annoying chore', 560, 160, 66, C.navy, -2); F.in(ch, tc, 'none', { dur: 0.35, sfx: false });
    const ppl = [['co1', 640], ['co2', 1040], ['grey', 1440]].map(([k, x], i) => { const pp = F.puppet(S, S.mid, k, x, 860, 1.15, { mood: 'neutral', look: k === 'grey' ? { top: C.navy2, top2: C.navy, skin: C.skin3, hair: C.hair2 } : {} }); F.set(S.mid, P.desk(x - 160, 760, 320), 4); return pp; });
    const sheet = F.prop(S.front, `<g filter="url(#cut)"><rect x="-90" y="-110" width="180" height="220" fill="${C.white}"/>${T('STATUS', 0, -70, 28, C.tomato2)}${[0, 1, 2, 3, 4].map((i) => `<rect x="-70" y="${-46 + i * 32}" width="140" height="22" fill="none" stroke="${C.grey}" stroke-width="3"/>`).join('')}</g>`, 500, 640, 200, 240, 8);
    const ts = w('status', 257);
    F.in(sheet, ts - 0.6, 'left', { dur: 0.4, sfx: 'paperslide' });
    ppl.forEach((pp, i) => { const t = ts - 0.1 + i * 0.75; F.to(sheet, t, { x: 260 + i * 400, rotation: (i % 2 ? 8 : -8) }, 0.5, 'power2.inOut'); F.sfx(t, 'swish', 0.35);
      pp.tilt(t + 0.2, 14).arm(t + 0.2, 'l', 'out', 0.3).mood(t + 0.2, 'shock').tilt(t + 0.9, 0).arm(t + 0.9, 'l', 'down', 0.4).mood(t + 0.9, 'neutral'); });
    F.to(sheet, ts + 2.2, { x: 1700, opacity: 0 }, 0.4, 'power2.in');
    const nb = F.label(S.ui, 'nobody fills it out', 1300, 990, { size: 64, bg: C.tomato, rot: -1, z: 20 }); F.in(nb, w('nobody', 257), 'below', { dur: 0.4 });
    S.cam(ts - 0.6, 1060, 600, 1.06, 1.6);
  }

  // ===== over the weekend. You won't. Monday 9 (259.82 – 267.52) =====
  {
    const S = F.shot(259.82, 267.52, { bg: '#E6DCCB', cam: [900, 560, 1.12] });
    F.set(S.back, `<rect x="-800" y="820" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const ck = F.prop(S.back, K.clock(150), 1560, 300, 340, 340, 2), mh = F.prop(S.back, K.hand(110, C.tomato, 7), 1560, 300, 40, 260, 3, '50% 50%'), hh = F.prop(S.back, K.hand(70, C.navy, 11), 1560, 300, 40, 180, 3, '50% 50%');
    hh.style.rotate = '270deg';
    const mon = F.label(S.back, 'MON 9:00', 1560, 520, { size: 52, bg: 'none', color: C.navy, font: "'Archivo Black'", weight: 400, flat: true });
    const you = F.puppet(S, S.mid, 'you', 760, 900, 1.5, { mood: 'happy', armR: 'fwd' });
    F.set(S.mid, P.desk(400, 760, 760) + P.mug(1040, 760, 0.9), 4);
    const tw = w('weekend.', 261);
    const st = F.prop(S.front, P.sticky(0, 0, -4, 'WEEKEND:|fix status sheet', 42, C.sticky, 260), 1060, 560, 300, 300, 8);
    F.in(st, w('tell', 260), 'none', { dur: 0.35, sfx: 'sticky' }); F.sfx(w('organize', 260), 'scribble', 0.5);
    you.nod(w('organize', 260), tw + 0.4, 4, 2);
    const tn = w("won't.", 262);
    F.to(st, tn - 0.05, { rotation: 30, x: 140, y: 380, opacity: 0.9 }, 1.1, 'sine.in'); F.sfx(tn, 'flutter', 0.5);
    you.mood(tn, 'neutral');
    const wt = F.label(S.ui, "You won't.", 960, 170, { size: 130, bg: 'none', color: C.tomato2, flat: true, z: 20 }); F.in(wt, tn, 'none', { dur: 0.3, sfx: false }); F.out(wt, w('You', 263) + 0.5, 'above');
    const td = w('dread', 264);
    F.fromTo(mh, td - 0.6, { rotation: 180 }, { rotation: 360 }, 0.8, 'power2.out'); F.sfx(td + 0.2, 'clockchime', 0.6);
    const cl = F.prop(S.front, K.cloud(320), 760, 230, 360, 200, 9); F.fromTo(cl, td - 0.2, { opacity: 0, y: -200 }, { opacity: 1, y: 0 }, 0.5, 'power2.out');
    const rain = F.prop(S.front, [0, 1, 2, 3, 4].map((i) => `<path d="M${-120 + i * 60} 0 l-12 40" stroke="#7FA4BC" stroke-width="7" stroke-linecap="round"/>`).join(''), 760, 330, 320, 80, 8);
    F.hidden(rain); F.show(rain, td + 0.3); F.every(S, (G) => { rain.style.translate = `0 ${((G * 140) % 40).toFixed(1)}px`; });
    F.sfx(td + 0.2, 'rain', 0.4);
    you.mood(td, 'tired').arms(td, 'type', 'type', 0.4).slump(td + 0.2, 12);
    S.cam(tn - 0.2, 900, 520, 1.25, 0.6).cam(td - 0.6, 1100, 480, 1.0, 1.0);
  }

  // ===== complaining in the group chat; fix it for everyone (267.52 – 272.24) =====
  {
    const S = F.shot(267.52, 272.24, { bg: '#E9DDC6', cam: [960, 470, 1.3] });
    F.set(S.back, `<rect x="-800" y="860" width="3600" height="600" fill="${C.kraft}" filter="url(#cutflat)"/>`);
    F.prop(S.mid, `<g filter="url(#cut)"><rect x="-230" y="-420" width="460" height="840" rx="50" fill="${C.navy}"/><rect x="-206" y="-392" width="412" height="784" rx="30" fill="#FBF7EE"/></g>`, 960, 520, 480, 860, 2);
    const screen = F.html(S.mid, `<div style="font:700 26px Inter;color:#8a8f9c;padding:6px 0 18px;border-bottom:2px solid #E6DAC2"># team-chat</div>`, 754, 128, 412, 784, 3, { padding: '20px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' });
    const msgs = [['Ana', 'status sheet AGAIN??', C.tomato2], ['Raj', 'who has the sheet?', C.sage2], ['Lee', 'I sent mine… I think', C.gold], ['Ana', 'this is every monday 😩', C.tomato2], ['Raj', 'can someone fix this', C.sage2]];
    const t0 = w('complaining', 267);
    msgs.forEach(([n, m, col], i) => { const d = document.createElement('div'); d.innerHTML = `<div style="display:flex;gap:10px"><span style="width:40px;height:40px;border-radius:10px;background:${col};flex:none"></span><div style="background:#F1E9DA;border-radius:14px;padding:10px 14px;font:500 24px/1.3 Inter;color:#1E2A44"><b style="font-size:20px">${n}</b><br>${m}</div></div>`; screen.appendChild(d);
      F.in(d, t0 + i * 0.4, 'below', { dur: 0.3, dist: 0.3, rot: 0, sfx: 'ping', gain: 0.3 }); });
    const tf = w('fix', 270);
    const you = F.puppet(S, S.front, 'you', 1560, 1150, 1.5, { mood: 'tired', flip: true });
    you.enter(t0 + 0.5, 'right', 0.5).mood(tf - 0.4, 'sly').arm(tf - 0.2, 'r', 'point', 0.3);
    const fe = F.label(S.ui, 'fix it for everyone', 960, 990, { size: 76, bg: C.sage2, rot: -1.5, z: 20 }); F.in(fe, tf, 'below', { dur: 0.4 });
    S.cam(t0, 1060, 520, 1.25, 2.0, 'inOutSine');
  }

  // ===== a simple form + a spreadsheet rule that collects updates automatically (272.24 – 278.66) =====
  {
    const S = F.shot(272.24, 278.66, { cam: [960, 540, 1.0] });
    const form = F.html(S.mid, `<div style="width:520px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter">${F.winBar('Weekly update · form')}<div style="padding:26px 30px;font:600 28px/1.4 Inter;color:#1E2A44">What did you finish?<div style="height:50px;border:2px solid #E6DAC2;border-radius:10px;margin:10px 0 18px;background:#fff"></div>Any blockers?<div style="height:50px;border:2px solid #E6DAC2;border-radius:10px;margin:10px 0 18px;background:#fff"></div><div style="display:inline-block;background:#1E2A44;color:#fff;border-radius:10px;padding:10px 26px">Submit</div></div></div>`, 160, 260, 520, 0, 3);
    const rows = ['Ana', 'Raj', 'Lee', 'Sam', 'Mo'];
    const sheet = F.html(S.mid, `<div style="width:620px;background:#FBF7EE;border-radius:16px;box-shadow:0 16px 30px rgba(30,42,68,.25);overflow:hidden;font-family:Inter">${F.winBar('Status sheet')}<table style="border-collapse:collapse;width:100%;font:500 28px Inter;color:#1E2A44">${['<b>Name</b>', ...rows].map((r, i) => `<tr><td style="border:2px solid #E6DAC2;padding:12px 18px;background:${i ? '#fff' : '#F4EEE1'};width:35%">${r}</td><td class="st" style="border:2px solid #E6DAC2;padding:12px 18px;background:${i ? '#fff' : '#F4EEE1'}">${i ? '' : '<b>Status</b>'}</td></tr>`).join('')}</table></div>`, 1140, 250, 620, 0, 3);
    const cells = [...sheet.querySelectorAll('.st')].slice(1);
    const tfm = w('form', 273), tsr = w('spreadsheet', 274), ta = w('automatically.', 277);
    F.in(form, tfm - 0.4, 'left', { dur: 0.5 }); F.in(sheet, tsr - 0.3, 'right', { dur: 0.5 });
    const fl = F.hand(S.mid, 'simple form', 420, 200, 64, C.navy, -2); F.in(fl, tfm, 'none', { dur: 0.3, sfx: false });
    const sl = F.hand(S.mid, 'spreadsheet rule', 1450, 190, 64, C.navy, 2); F.in(sl, tsr + 0.2, 'none', { dur: 0.3, sfx: false });
    const arrow = F.prop(S.mid, `<path d="M-200 0 Q0 -90 200 0" stroke="${C.tomato}" stroke-width="10" fill="none" stroke-dasharray="20 14" stroke-linecap="round"/><path d="M200 0 l-36 -28 l4 40z" fill="${C.tomato}"/>`, 910, 520, 460, 160, 4);
    F.in(arrow, w('rule', 275), 'none', { dur: 0.35, sfx: 'swish' });
    F.every(S, (G) => { arrow.querySelector('path').setAttribute('stroke-dashoffset', String(-G * 60)); });
    rows.forEach((r, i) => { const tt = w('collects', 276) + i * 0.3; const slip = F.prop(S.front, `<g filter="url(#cut)"><rect x="-50" y="-26" width="100" height="52" rx="6" fill="${C.sticky}"/><rect x="-34" y="-8" width="68" height="8" fill="${C.navy}"/></g>`, 700, 520, 120, 70, 8);
      F.fromTo(slip, tt, { opacity: 1, x: 0, y: 0, scale: 0.8 }, { x: 440, y: -20, scale: 0.6 }, 0.55, 'power2.inOut'); F.hidden(slip); F.to(slip, tt + 0.55, { opacity: 0 }, 0.1);
      F.every(S, (G) => { cells[i].innerHTML = G >= tt + 0.6 ? '<span style="color:#5F8A6C;font-weight:700">✓ done</span>' : ''; }); F.sfx(tt + 0.6, 'tick', 0.35); });
    const au = F.label(S.ui, 'AUTOMATICALLY', 960, 980, { size: 84, bg: C.navy, rot: -1, z: 20 }); F.in(au, ta, 'below', { dur: 0.4 });
    S.cam(tfm - 0.4, 960, 540, 0.98, 2.0, 'inOutSine');
  }

  // ===== no code (278.66 – 280.78) =====
  {
    const S = F.shot(278.66, 280.78, { cam: [960, 540, 1.0] });
    const code = F.label(S.mid, '&lt;/&gt;', 760, 520, { size: 260, bg: C.navy, color: C.white, font: "'JetBrains Mono'", weight: 700 });
    F.in(code, 278.7, 'none', { dur: 0.35 });
    const x = F.prop(S.mid, `<g stroke="${C.tomato}" stroke-width="26" stroke-linecap="round" filter="url(#cut)"><path d="M-200 -160 L200 160"/><path d="M200 -160 L-200 160"/></g>`, 760, 520, 460, 380, 6);
    F.in(x, w('code.', 280) - 0.35, 'none', { dur: 0.25, sfx: 'scribble', gain: 0.7 });
    const nc = F.label(S.mid, 'NO CODE', 1360, 520, { size: 140, bg: C.sage2, rot: 3 }); F.in(nc, w('code.', 280) - 0.1, 'right', { dur: 0.4, sfx: 'stamp', gain: 0.5 });
    S.cam(278.7, 1000, 520, 1.08, 2.0, 'inOutSine');
  }

  // ===== type this: automate the weekly update (280.78 – 288.74) =====
  {
    const S = F.shot(280.78, 288.74, { bg: '#E3D7C1', cam: [960, 470, 1.08], drift: 0.5 });
    const L = F.laptop(S.mid, 960, 540, 1.0); const chat = F.chat(S, L.screen, { size: 46, top: true });
    const t0 = w('Give', 281), t1 = w('coding.', 288) + 0.2;
    chat.type('Give me a step-by-step guide to automate a weekly team update using only Google Forms and Google Sheets with no coding.', t0, t1);
    const k = F.label(S.ui, 'TYPE THIS', 1500, 90, { size: 60, bg: C.tomato, rot: -1.5, z: 20 }); F.in(k, w('type', 280) - 0.05, 'above', { dur: 0.4 }); F.out(k, t0 + 1.2, 'above');
    const st = F.prop(S.front, P.sticky(0, 0, 7, 'pause &amp;|copy!', 54, C.sticky, 200), 1800, 300, 240, 240, 9); F.in(st, t0 + 1.0, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.5 });
    S.cam(t0, 960, 430, 1.16, 6.5, 'inOutSine');
  }

  // ===== the Monday meeting: +3 hours a week; ordinary worker → toolmaker (288.74 – 297.74) =====
  {
    const S = F.shot(288.74, 297.74, { bg: '#E7DFCB', cam: [700, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/><g filter="url(#cutflat)"><rect x="140" y="160" width="420" height="700" fill="#D2C3A6"/><rect x="170" y="190" width="360" height="670" fill="${C.kraft2}"/></g>`);
    const crew = [['co1', 1000], ['grey', 1260], ['co2', 1520], ['newhire', 1780]].map(([k, x]) => F.puppet(S, S.mid, k, x, 920, 1.1, { mood: 'neutral', flip: true }));
    const you = F.puppet(S, S.mid, 'you', 350, 920, 1.35, { mood: 'smile', armR: 'hold', z: 5 });
    const lap = F.prop(you.root, `<g filter="url(#cut)"><rect x="-70" y="-50" width="140" height="100" rx="8" fill="${C.navy2}"/></g>`, 90, -150, 160, 120, 6);
    const tw = w('walk', 289);
    you.walk(tw - 0.2, tw + 1.4).move(tw - 0.2, 720, 920, 1.6, 'power1.out');
    for (let x = tw - 0.2; x < tw + 1.4; x += 0.35) F.sfx(x, 'step', 0.3);
    F.sfx(tw - 0.4, 'door', 0.5);
    const t3 = w('three', 291);
    const ban = F.prop(S.front, `<g filter="url(#cut)"><rect x="-420" y="-80" width="840" height="160" fill="${C.sage2}"/>${T('+3 HRS / WEEK', 0, 34, 100, C.white, 'Bricolage Grotesque', 'middle', 'font-weight="800"')}</g>`, 1140, 220, 880, 200, 9, '0% 50%');
    F.fromTo(ban, t3 - 0.2, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1 }, 0.6, 'power3.out'); F.sfx(t3 - 0.2, 'unroll', 0.7);
    crew.forEach((c, i) => c.mood(t3 + 0.2 + i * 0.08, 'shock').tilt(t3 + 0.2, -6).mood(t3 + 1.0, 'happy'));
    you.mood(t3, 'happy').arm(t3, 'l', 'up', 0.4);
    // ordinary worker: everyone turns grey, you too
    const to = w('ordinary', 293);
    F.to(ban, to - 0.2, { opacity: 0, y: -80 }, 0.4);
    [...crew, you].forEach((c) => c.grey(to, true, 0.5));
    you.mood(to, 'neutral').arm(to, 'l', 'down', 0.4);
    const ow = F.hand(S.ui, 'an ordinary worker…', 960, 160, 70, C.grey2, -2); F.in(ow, to, 'none', { dur: 0.35, sfx: false }); F.out(ow, w('become', 295), 'above');
    const tb = w('builds', 296);
    you.grey(tb - 0.6, false, 0.5).move(tb - 0.6, 760, 980, 0.5).mood(tb - 0.5, 'happy').arm(tb - 0.4, 'r', 'up', 0.4).hop(tb - 0.1, 18);
    const wr = F.prop(you.root, `<g filter="url(#cut)" transform="rotate(-30)"><rect x="-10" y="-60" width="20" height="100" rx="6" fill="${C.grey2}"/><path d="M-28 -60 a28 28 0 1 1 56 0 l-12 0 l0 -16 l-32 0 l0 16z" fill="${C.grey2}"/></g>`, 66, -470, 100, 140, 6);
    F.in(wr, tb - 0.3, 'none', { dur: 0.3, sfx: 'shimmer', gain: 0.5 });
    const bt = F.label(S.ui, 'the person who builds the tools', 960, 990, { size: 74, bg: C.navy, rot: -1, z: 20 }); F.in(bt, tb - 0.2, 'below', { dur: 0.4 });
    S.cam(tw, 960, 560, 1.0, 1.6).cam(tb - 0.7, 820, 600, 1.12, 1.0);
    F.miniSnap(S, 5, w('tools.', 297) - 0.4, 0.8);
  }
  F.done();
})();
