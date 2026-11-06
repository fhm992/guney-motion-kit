// c04 — Method 4: build a personal context file (191.04 – 250.50)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== use AI without looking lazy (191.04 – 196.68) =====
  {
    const S = F.shot(191.04, 196.68, { bg: '#E9DDC6', cam: [900, 560, 1.08] });
    F.set(S.back, `<rect x="-800" y="780" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const you = F.puppet(S, S.mid, 'you', 620, 900, 1.45, { mood: 'smile', armL: 'type', armR: 'type' });
    F.set(S.mid, P.desk(330, 760, 600), 4);
    const L = F.laptop(S.mid, 1240, 520, 0.5, 5); const ch = F.chat(S, L.screen, { size: 40 });
    ch.reply(191.3, ['Here is a draft of your project update…', '• Section 1 …', '• Section 2 …'], 0.25, { size: 34 });
    const tg = w('great', 191);
    const hearts = F.hand(S.ui, 'great human work ✓', 560, 170, 64, C.sage2, -3); F.in(hearts, tg, 'none', { dur: 0.35, sfx: false }); F.out(hearts, w('still', 193), 'above');
    const tl = w('lazy.', 195);
    you.mood(w('use', 194), 'look').tilt(w('use', 194), 6).mood(w('without', 195), 'lookL').tilt(w('without', 195), -8);
    const lz = F.prop(S.front, `<g filter="url(#cut)"><path d="M0 -400 L0 -60" stroke="${C.navy}" stroke-width="4"/><rect x="-110" y="-60" width="220" height="110" rx="10" fill="${C.tomato}"/>${T('LAZY?', 0, 18, 56, C.white)}</g>`, 620, 120, 260, 520, 9, '50% 0%');
    F.fromTo(lz, tl - 0.25, { opacity: 0, y: -400 }, { opacity: 1, y: 0 }, 0.4, 'power2.out'); F.sfx(tl - 0.2, 'swish', 0.5);
    F.every(S, (G) => { lz.style.rotate = (G > tl ? 6 * Math.sin((G - tl) * 4) * Math.exp(-(G - tl) * 0.8) : 0) + 'deg'; });
    S.cam(tl - 0.6, 700, 420, 1.2, 1.0);
  }

  // ===== card (196.68 – 200.40) =====
  {
    const S = F.shot(196.68, 200.40);
    const c = F.chapter(S, w('number', 197) - 0.2, 4, 'YOUR CONTEXT FILE', 'teach the AI how you think');
    const fol = F.prop(S.front, `<g filter="url(#cut)"><path d="M-130 -90 L-40 -90 L-20 -66 L130 -66 L130 90 L-130 90Z" fill="${C.gold}"/><rect x="-130" y="-50" width="260" height="140" fill="#F0C060"/>${T('ME.txt', 0, 40, 46, C.navy)}</g>`, 960, 840, 300, 220, 9);
    F.in(fol, w('context', 199) - 0.2, 'below', { dur: 0.45, sfx: 'paperslide' });
  }

  // ===== pasted a prompt, robotic answer, regenerate x3, paste anyway, tired (200.40 – 210.52) =====
  {
    const S = F.shot(200.40, 210.52, { bg: '#E3D7C1', cam: [840, 520, 1.0] });
    const L = F.laptop(S.mid, 840, 540, 0.92, 2);
    L.screen.innerHTML = `<div style="display:flex;flex-direction:column;height:100%">${F.winBar('AI chat')}<div class="m" style="flex:1;padding:30px 60px;display:flex;flex-direction:column;gap:22px"></div></div>`;
    const m = L.screen.querySelector('.m');
    const up = F.html(m, `<div style="background:#1E2A44;color:#fff;border-radius:22px 22px 6px 22px;padding:20px 28px;font:500 32px/1.4 Inter;margin-left:300px">Write my project update for this week.</div>`, 0, 0, 0, 0, 1, { position: 'relative' });
    const tp = w('pasted', 200);
    F.fromTo(up, tp, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1 }, 0.25); F.sfx(tp, 'paste', 0.6);
    const flash = F.html(m, '', 0, 0, 1260, 120, 2, { background: '#fff', position: 'absolute', left: '60px', top: '30px' }); F.hidden(flash); F.fromTo(flash, tp, { opacity: 0.8 }, { opacity: 0 }, 0.35);
    const answers = ['In today\'s fast-paced landscape, our team leveraged synergies to delve into deliverables.', 'It is important to note that, in conclusion, we leveraged robust synergies going forward.', 'As an AI, I can confirm the team delved into a dynamic tapestry of deliverables.', 'Our team leveraged cross-functional synergies to unlock robust value.'];
    const ans = F.html(m, `<div style="background:#F1E9DA;border-radius:22px 22px 22px 6px;padding:22px 30px;font:500 32px/1.45 Inter;width:880px;position:relative"><span class="a"></span><div style="margin-top:16px;display:flex;gap:12px"><span class="rg" style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:2px solid #E6DAC2;border-radius:12px;padding:8px 16px;font:600 24px Inter">↻ Regenerate</span></div></div>`, 0, 0, 0, 0, 1, { position: 'relative' });
    const aEl = ans.querySelector('.a'), rg = ans.querySelector('.rg');
    const th = w('hated', 202), tr = w('regenerate', 204), t3 = w('times,', 205);
    F.fromTo(ans, th - 0.4, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.35); F.sfx(th - 0.4, 'pop', 0.4);
    const rgT = [tr, tr + (t3 - tr) / 2 + 0.1, t3 + 0.2];
    F.every(S, (G) => { let k = 0; rgT.forEach((t) => { if (G >= t + 0.15) k++; }); aEl.textContent = answers[k]; const pressed = rgT.some((t) => G >= t && G < t + 0.15); rg.style.background = pressed ? '#E4572E' : '#fff'; rg.style.color = pressed ? '#fff' : '#1E2A44'; });
    rgT.forEach((t) => { F.sfx(t, 'click', 0.6); F.sfx(t + 0.15, 'flip', 0.3); });
    const mask = F.prop(S.front, `<g filter="url(#cut)"><rect x="-70" y="-60" width="140" height="120" rx="24" fill="${C.grey}"/><rect x="-52" y="-34" width="36" height="20" fill="${C.navy}"/><rect x="16" y="-34" width="36" height="20" fill="${C.navy}"/><rect x="-40" y="20" width="80" height="12" fill="${C.navy}"/><path d="M0 -60 v-30" stroke="${C.navy}" stroke-width="6"/><circle cx="0" cy="-94" r="8" fill="${C.tomato}"/></g>`, 1270, 520, 180, 220, 8);
    F.in(mask, th, 'none', { dur: 0.35, sfx: 'boop', gain: 0.5 });
    const you = F.puppet(S, S.front, 'you', 1660, 1180, 1.4, { mood: 'neutral', flip: true });
    you.enter(th - 0.6, 'right', 0.5).mood(th + 0.1, 'sad').shakeHead(th + 0.2, th + 0.9).mood(tr, 'angry').mood(w('pasted', 206), 'tired').mood(w('tired?', 209) - 0.2, 'yawn').mood(w('tired?', 209) + 0.6, 'tired');
    // paste into the report anyway
    const tpa = w('pasted', 206);
    const rep = F.html(S.ui, `<div style="width:640px;background:#FBF7EE;border-radius:12px;box-shadow:0 18px 36px rgba(30,42,68,.3);overflow:hidden;font-family:Inter">${F.winBar('Weekly report.docx')}<div style="padding:24px 32px;font:500 26px/1.5 Inter;color:#1E2A44"><b style="font-size:32px">Project update</b><div class="pz" style="margin-top:12px;background:#F6D9CF"></div></div></div>`, 160, 360, 640, 0, 20);
    F.in(rep, tpa - 0.3, 'left', { dur: 0.45, sfx: 'paperslide' });
    const pz = rep.querySelector('.pz'); F.every(S, (G) => { pz.textContent = G >= tpa + 0.4 ? answers[3] : ''; }); F.sfx(tpa + 0.4, 'paste', 0.6);
    const kc = F.hand(S.ui, 'anyway…', 520, 300, 64, C.tomato2, -4); F.in(kc, w('anyway', 207), 'none', { dur: 0.3, sfx: false });
    F.sfx(w('tired?', 209) - 0.2, 'yawn', 0.5);
    S.cam(th - 0.5, 980, 520, 1.06, 1.0).cam(tpa - 0.4, 800, 560, 1.0, 1.0);
  }

  // ===== stiff words; hope nobody notices (210.52 – 215.34) =====
  {
    const S = F.shot(210.52, 215.34, { bg: '#E2D5BE', cam: [960, 600, 1.0] });
    const page = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-580" y="-360" width="1160" height="800" fill="${C.white}"/></g>`, 960, 760, 1200, 840, 2);
    F.in(page, 210.55, 'below', { dur: 0.45 });
    const words = [['delve', 560, 600, -6], ['leverage', 900, 610, 4], ['synergy', 1280, 600, -3], ["in today's fast-paced world", 960, 770, 0], ['robust', 600, 900, 5], ['tapestry', 1300, 900, -5]];
    const ts = w('stiff', 214);
    words.forEach(([t, x, y, r], i) => { const l = F.label(S.mid, t, x, y, { size: 52, bg: C.kraft, color: C.navy, font: 'Inter', weight: 700, rot: r, z: 4 });
      F.fromTo(l, 211.0 + i * 0.25, { opacity: 0, rotationX: 90, transformOrigin: '50% 100%' }, { opacity: 1, rotationX: 0 }, 0.4, 'power3.out'); F.sfx(211.0 + i * 0.25, 'creak', 0.3);
      F.every(S, (G) => { if (G > ts) l.style.rotate = (1.5 * Math.sin(G * 6 + i)) + 'deg'; }); });
    const you = F.puppet(S, S.front, 'you', 260, 1220, 1.5, { mood: 'worry', armR: 'high' });
    you.enter(w('hope', 213) - 0.3, 'left', 0.5);
    const fx = F.prop(S.front, `<g filter="url(#cut)"><path d="M-6 30 L-14 -30 M6 30 L16 -26" stroke="${C.skin1}" stroke-width="16" stroke-linecap="round"/></g>`, 400, 590, 60, 90, 9);
    F.in(fx, w('hope', 213), 'none', { dur: 0.3, sfx: false });
    const hn = F.hand(S.ui, 'hope nobody notices…', 1300, 200, 66, C.navy, -2); F.in(hn, w('nobody', 213), 'none', { dur: 0.3, sfx: false });
    S.cam(ts - 0.4, 1000, 680, 1.15, 1.2);
  }

  // ===== Your boss notices. (215.34 – 216.88) =====
  {
    const S = F.shot(215.34, 216.88, { bg: '#E2D5BE', cam: [960, 560, 1.06], drift: 0.3 });
    const mgr = F.puppet(S, S.mid, 'manager', 960, 1090, 2.3, { mood: 'angry' });
    F.fromTo(mgr.root, 215.36, { y: 160 }, { y: 0 }, 0.5, 'power2.out');
    F.set(S.mid, `<g filter="url(#cut)"><rect x="360" y="640" width="1200" height="700" fill="${C.white}"/></g>` + ['delve', 'leverage', 'synergy'].map((t, i) => `<g filter="url(#cut)" transform="rotate(${[-6, 4, -3][i]} ${560 + i * 400} 760)"><rect x="${470 + i * 400}" y="710" width="200" height="80" fill="${C.kraft}"/>${T(t, 570 + i * 400, 765, 44, C.navy, "Inter")}</g>`).join(''), 5);
    const bn = F.label(S.ui, 'Your boss notices.', 960, 150, { size: 104, bg: 'none', color: C.navy, flat: true, z: 20 }); F.in(bn, 215.4, 'none', { dur: 0.35, sfx: false });
    F.sfx(215.34, 'sting', 0.7);
    S.cam(215.4, 960, 500, 1.12, 1.4, 'inOutSine');
  }

  // ===== everyone's AI work looks the same; zero special value (216.88 – 222.76) =====
  {
    const S = F.shot(216.88, 222.76, { cam: [960, 540, 1.6] });
    const reps = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const x = 200 + c * 253, y = 150 + r * 260;
      const rp = F.prop(S.mid, `${P.sheet(0, 0, 0, 1)}<g><rect x="-36" y="-30" width="72" height="60" rx="14" fill="${C.grey}"/><rect x="-22" y="-14" width="14" height="10" fill="${C.navy}"/><rect x="8" y="-14" width="14" height="10" fill="${C.navy}"/><rect x="-14" y="10" width="28" height="5" fill="${C.navy}"/></g>`, x, y, 200, 240, 2);
      reps.push(rp); const tt = 216.95 + (r * 7 + c) * 0.035; F.fromTo(rp, tt, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1 }, 0.25); if ((r * 7 + c) % 5 === 0) F.sfx(tt, 'copier', 0.25); }
    const mine = reps[10];
    const ring = F.prop(S.mid, `<rect x="-112" y="-132" width="224" height="264" rx="12" fill="none" stroke="${C.tomato}" stroke-width="8"/>`, 200 + 3 * 253, 150 + 260, 240, 280, 4);
    const tz = w('zero', 221);
    F.in(ring, w('your', 217) + 0.1, 'none', { dur: 0.3, sfx: false });
    const yl = F.hand(S.mid, 'yours', 200 + 3 * 253, 150 + 260 - 160, 56, C.tomato2, -3); F.in(yl, w('your', 217) + 0.2, 'none', { dur: 0.3, sfx: false });
    F.to(ring, tz, { opacity: 0 }, 0.5); F.to(yl, tz, { opacity: 0 }, 0.5); F.to(mine, tz, { opacity: 0.35, filter: 'grayscale(1)' }, 0.6);
    const zv = F.label(S.ui, 'ZERO SPECIAL VALUE', 960, 540, { size: 110, bg: C.tomato, rot: -2, z: 20 }); F.in(zv, tz, 'below', { dur: 0.45, sfx: 'thud', gain: 0.7 });
    S.cam(w('your', 217), 960, 410, 1.5, 0.6).cam(w('looks', 218), 960, 540, 0.98, 2.0, 'inOutSine');
  }

  // ===== the fix: give the AI a memory of how you think (222.76 – 226.14) =====
  {
    const S = F.shot(222.76, 226.14, { cam: [960, 580, 1.1] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const ai = F.puppet(S, S.mid, 'intern', 860, 920, 1.6, { mood: 'neutral' });
    ai.enter(222.8, 'below', 0.45);
    const bag = F.prop(S.mid, `<g filter="url(#cut)"><path d="M-80 30 C-120 -60 -60 -130 0 -100 C60 -130 120 -60 80 30 C80 90 -80 90 -80 30Z" fill="${C.sage}"/><path d="M-40 -60 q20 30 0 60 M10 -80 q-20 40 10 80 M50 -50 q-20 30 0 60" stroke="${C.sage2}" stroke-width="7" fill="none"/>${T('YOU', 0, 60, 36, C.navy)}</g>`, 1080, 680, 280, 260, 4);
    const tm = w('memory', 223);
    F.fromTo(bag, tm - 0.4, { opacity: 0, x: 600, rotation: 30 }, { opacity: 1, x: 0, rotation: 0 }, 0.5, 'power3.out'); F.sfx(tm + 0.05, 'clickin', 0.8);
    ai.mood(tm + 0.1, 'happy').hop(tm + 0.15, 20);
    const lb = F.label(S.ui, 'give it a memory of YOU', 960, 160, { size: 80, bg: C.navy, rot: -1.5, z: 20 }); F.in(lb, w('fix', 223), 'below', { dur: 0.4 });
    F.every(S, (G) => { if (G > tm + 0.3) bag.style.filter = `drop-shadow(0 0 ${(14 + 8 * Math.sin(G * 5)).toFixed(1)}px rgba(127,168,139,.9))`; });
    S.cam(tm, 980, 600, 1.2, 1.0);
  }

  // ===== the plain text file (226.14 – 233.80) =====
  {
    const S = F.shot(226.14, 233.80, { bg: '#E3D7C1', cam: [960, 520, 0.9] });
    const L = F.laptop(S.mid, 960, 540, 1.0);
    L.screen.innerHTML = `${F.winBar('my-context.txt')}<div class="ed" style="padding:40px 70px;font:500 40px/1.7 'JetBrains Mono', monospace;color:#1E2A44;white-space:pre-wrap"></div>`;
    const ed = L.screen.querySelector('.ed');
    const lines = [[w('rules,', 229) - 0.4, 'MY JOB RULES: clear, short, no jargon'], [w('sells', 230) - 0.3, 'WHO WE SELL TO: small clinics, 30+ staff'], [w('three', 231) - 0.1, 'MY BEST WORK: 1.  2.  3.']];
    F.every(S, (G) => { let h = ''; lines.forEach(([t, txt], i) => { const n = Math.max(0, Math.min(txt.length, Math.round((G - t) * 32))); if (G >= t) h += `<div><b style="color:#C9441F">${txt.slice(0, Math.min(n, txt.indexOf(':') + 1))}</b>${txt.slice(txt.indexOf(':') + 1, n)}</div>`; });
      ed.innerHTML = h + '<span style="display:inline-block;width:4px;height:44px;background:#E4572E;vertical-align:-8px"></span>'; });
    lines.forEach(([t, txt]) => { for (let x = 0; x < txt.length / 32; x += 0.1) F.sfx(t + x, 'key', 0.14); });
    const tb = w('best', 232);
    [0, 1, 2].forEach((i) => { const th = F.prop(S.mid, `${P.sheet(0, 0, -4 + i * 4, 0.7)}`, 1180 + i * 140, 600, 150, 180, 6); F.in(th, tb + i * 0.15, 'below', { dur: 0.35, sfx: 'paperslide', gain: 0.3 }); });
    const tf = w('plain', 226);
    const fl = F.label(S.ui, 'one plain text file', 960, 990, { size: 70, bg: C.navy, rot: -1, z: 20 }); F.in(fl, tf, 'below', { dur: 0.4 }); F.out(fl, w('rules,', 229) - 0.2, 'below');
    S.cam(tf, 960, 520, 1.08, 1.0).cam(w('rules,', 229) - 0.4, 900, 420, 1.15, 3.0, 'inOutSine');
  }

  // ===== type this: the style prompt; your brain inside (233.80 – 250.50) =====
  {
    const S = F.shot(233.80, 250.50, { bg: '#E3D7C1', cam: [960, 540, 0.85], drift: 0.5 });
    const L = F.laptop(S.mid, 960, 540, 1.0); const chat = F.chat(S, L.screen, { size: 44, bubble: 28, top: true });
    const t0 = w('Read', 237), t1 = w('goals.', 244) + 0.3;
    const clip = F.html(chat.comp, `<span style="display:inline-flex;align-items:center;gap:8px;background:#EFE6D3;border:2px solid #C9A57A;border-radius:12px;padding:4px 14px;font:600 26px Inter;color:#1E2A44">📎 my-context.txt</span>`, 0, 0, 0, 0, 1, { position: 'relative', marginBottom: '10px' });
    chat.comp.prepend(clip); F.in(clip, t0 - 0.6, 'below', { dur: 0.35, sfx: 'clip', gain: 0.6, dist: 0.3 });
    chat.type('Read my work notes and examples, learn my style, and rewrite this new project update so it sounds like me and fits our company goals.', t0, t1);
    const k = F.label(S.ui, 'TYPE THIS', 1500, 90, { size: 60, bg: C.tomato, rot: -1.5, z: 20 }); F.in(k, w('type', 236) - 0.05, 'above', { dur: 0.4 }); F.out(k, t0 + 1.2, 'above');
    const st = F.prop(S.front, P.sticky(0, 0, 7, 'pause &amp;|copy!', 54, C.sticky, 200), 1800, 300, 240, 240, 9); F.in(st, t0 + 1.4, 'none', { dur: 0.35, sfx: 'sticky', gain: 0.5 });
    const tsnd = t1 + 0.4; chat.send(tsnd); F.to(clip, tsnd, { opacity: 0 }, 0.2);
    const tbr = w('brain', 246);
    const rp = chat.reply(tsnd + 0.6, ['<span style="font:700 46px Caveat;color:#1E2A44">This week we got the clinic onboarding down to 3 days. Short version: it works, and here is what is next.</span>'], 0.3);
    rp.style.border = '3px solid #7FA88B';
    const br = F.prop(S.ui, `<g filter="url(#cut)"><path d="M-80 30 C-120 -60 -60 -130 0 -100 C60 -130 120 -60 80 30 C80 90 -80 90 -80 30Z" fill="${C.sage}"/><path d="M-40 -60 q20 30 0 60 M10 -80 q-20 40 10 80 M50 -50 q-20 30 0 60" stroke="${C.sage2}" stroke-width="7" fill="none"/></g>`, 1720, 860, 260, 240, 20);
    F.in(br, tbr - 0.2, 'right', { dur: 0.4, sfx: 'chime', gain: 0.5 });
    const yb = F.hand(S.ui, 'your real brain inside', 1500, 1010, 58, C.sage2, -2); F.in(yb, tbr, 'none', { dur: 0.3, sfx: false });
    S.cam(w('open', 234) - 0.1, 960, 470, 1.08, 1.2).cam(t0 + 0.2, 960, 430, 1.16, 7.0, 'inOutSine').cam(tsnd, 960, 560, 1.0, 1.0);
    // nobody else can copy that: a grey colleague tries to photocopy it
    const tc = w('copy', 248) - 0.9;
    const cp = F.html(S.ui, '', 0, 0, 1920, 1080, 30, { background: 'rgba(239,230,211,.0)' });
    const card = F.html(S.ui, '', 1180, 420, 640, 460, 31, { background: '#EFE6D3', borderRadius: '18px', boxShadow: '0 18px 40px rgba(30,42,68,.35)', overflow: 'hidden' });
    card.style.backgroundImage = F.paperTex();
    const g = F.puppet(S, card, 'grey', 180, 480, 1.0, { mood: 'shock', armR: 'fwd' });
    F.prop(card, `<g filter="url(#cut)"><rect x="-120" y="-80" width="240" height="160" rx="10" fill="${C.grey2}"/><rect x="-100" y="-110" width="200" height="40" fill="${C.grey}"/><rect x="-80" y="0" width="160" height="16" fill="${C.navy}"/></g>`, 450, 340, 280, 260, 2);
    const blank = F.prop(card, P.sheet(0, 0, 0, 0.8).replace(/fill="#B8B0A2"/g, 'fill="none"').replace(/fill="#1E2A44"/, 'fill="none"'), 450, 250, 180, 220, 3);
    F.fromTo(blank, tc + 0.5, { opacity: 0, y: 120 }, { opacity: 1, y: 0 }, 0.4); F.sfx(tc + 0.4, 'copier', 0.6);
    g.mood(tc + 0.9, 'sad');
    const cf = F.label(card, 'copy failed', 450, 80, { size: 44, bg: C.tomato, rot: -3 });
    F.in(card, tc, 'right', { dur: 0.45, sfx: 'paperslide' }); F.in(cf, tc + 0.9, 'none', { dur: 0.3, sfx: false });
    F.miniSnap(S, 4, w('that.', 249) - 0.2, 1.1);
  }
  F.done();
})();
