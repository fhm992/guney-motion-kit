// c10 — Outro (501.28 – 523.30)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w, p = F.p;

  // ===== I'm Fahim; AI working for your career (501.28 – 506.40) =====
  {
    const S = F.shot(501.28, 506.40, { cam: [960, 560, 1.05] });
    F.set(S.back, `<rect x="-800" y="880" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const plate = F.label(S.mid, 'FAHIM', 960, 190, { size: 150, bg: C.navy, font: "'Archivo Black'", weight: 400, rot: -2 });
    F.in(plate, w('Fahim,', 501) - 0.2, 'above', { dur: 0.5, sfx: 'card', gain: 0.7 });
    const sub = F.hand(S.mid, 'AI that works for your career', 960, 330, 66, C.tomato2, -1); F.in(sub, w('career', 504) - 0.3, 'none', { dur: 0.35, sfx: false });
    const you = F.puppet(S, S.mid, 'you', 720, 940, 1.4, { mood: 'happy' }), ai = F.puppet(S, S.mid, 'intern', 1200, 940, 1.3, { mood: 'happy', flip: true });
    you.enter(501.35, 'left', 0.5); ai.enter(501.45, 'right', 0.5);
    const th = w('work', 503);
    you.move(th - 0.4, 850, 940, 0.5).arm(th, 'r', 'high', 0.25); ai.move(th - 0.4, 1060, 940, 0.5).arm(th, 'r', 'high', 0.25);
    const clap = F.prop(S.front, `<g stroke="${C.gold}" stroke-width="8" stroke-linecap="round">${[0, 1, 2, 3, 4].map((i) => `<path d="M0 -30 L0 -60" transform="rotate(${-60 + i * 30})"/>`).join('')}</g>`, 955, 560, 160, 120, 9);
    F.in(clap, th + 0.25, 'none', { dur: 0.25, sfx: 'clap', gain: 0.8 });
    you.hop(th + 0.3, 16); ai.hop(th + 0.35, 16);
    const ag = F.hand(S.ui, '…not against it', 1440, 980, 60, C.navy, -2); F.in(ag, w('against', 505), 'none', { dur: 0.3, sfx: false });
    S.cam(th, 960, 520, 1.1, 1.6, 'inOutSine');
  }

  // ===== comment SECURE; the full prompt list is yours (506.40 – 510.94) =====
  {
    const S = F.shot(506.40, 510.94, { bg: '#E9DFC9', cam: [960, 540, 1.0] });
    const box = F.html(S.mid, `<div style="width:900px;background:#fff;border-radius:24px;box-shadow:0 18px 36px rgba(30,42,68,.22);padding:34px 40px;font-family:Inter"><div style="display:flex;align-items:center;gap:14px;color:#8a8f9c;font:600 30px Inter"><span style="width:56px;height:56px;border-radius:50%;background:#7FA88B"></span>Add a comment…</div><div class="cm" style="margin-top:22px;font:800 140px 'Bricolage Grotesque';color:#1E2A44;min-height:150px"></div></div>`, 510, 300, 900, 0, 5);
    F.in(box, 506.45, 'below', { dur: 0.45 });
    const cm = box.querySelector('.cm'); const ts = w('secure,', 507);
    F.every(S, (G) => { const n = Math.max(0, Math.min(6, Math.floor((G - ts + 0.15) * 14))); cm.innerHTML = 'SECURE'.slice(0, n) + (Math.floor(G * 2.4) % 2 ? '<span style="display:inline-block;width:8px;height:110px;background:#E4572E;vertical-align:-12px"></span>' : ''); });
    for (let i = 0; i < 6; i++) F.sfx(ts - 0.15 + i / 14, 'key', 0.35);
    const board = F.prop(S.front, `<g filter="url(#cut)"><rect x="-150" y="-200" width="300" height="400" rx="14" fill="${C.kraft2}"/><rect x="-126" y="-170" width="252" height="350" fill="${C.white}"/>${[...Array(9)].map((_, i) => `<rect x="-100" y="${-140 + i * 36}" width="${180 - (i % 3) * 20}" height="20" rx="4" fill="${i === 6 ? C.gold : C.paper2}"/>`).join('')}</g>`, 1650, 760, 320, 420, 9);
    F.fromTo(board, w('full', 509) - 0.2, { opacity: 0, x: 400, rotation: 20 }, { opacity: 1, x: 0, rotation: -6 }, 0.5, 'power3.out'); F.sfx(w('full', 509), 'paperslide', 0.6);
    const yo = F.label(S.ui, 'the full prompt list is yours', 900, 820, { size: 66, bg: C.tomato, rot: -1, z: 20 }); F.in(yo, w('yours.', 510) - 0.4, 'below', { dur: 0.4 });
    S.cam(506.5, 1000, 540, 1.06, 4.0, 'inOutSine');
  }

  // ===== you started with the fear… (510.94 – 515.40) =====
  {
    const S = F.shot(510.94, 515.40, { bg: '#E4D8C0', cam: [960, 540, 1.0] });
    const fr = F.html(S.mid, '', 360, 120, 1200, 800, 3, { background: '#F4EAD6', boxShadow: '8px 14px 24px rgba(40,30,20,.35)', transform: 'rotate(-2deg)' });
    const inner = F.html(fr, '', 30, 30, 1140, 740, 1, { overflow: 'hidden', filter: 'sepia(.8) saturate(.7)' });
    F.set(inner, `<rect width="1140" height="740" fill="#E9DDC6"/><rect y="560" width="1140" height="200" fill="${C.paper2}"/>${P.desk(60, 470, 520)}${P.desk(640, 470, 440)}<g filter="url(#cut)"><rect x="700" y="80" width="380" height="260" fill="${C.sky}"/></g>`);
    F.puppet(S, inner, 'you', 320, 640, 1.1, { mood: 'worry' });
    F.puppet(S, inner, 'manager', 860, 640, 1.1, { mood: 'smile' });
    F.set(inner, P.desk(60, 470, 520) + P.desk(640, 470, 440), 6);
    const sw = F.prop(inner, `<g filter="url(#cut)"><circle r="90" fill="${C.tomato}"/><circle r="72" fill="${C.white}"/>${T('0:30', 0, 16, 40)}</g>`, 600, 220, 200, 200, 7);
    F.fromTo(fr, 510.98, { opacity: 0, scale: 0.9, rotation: 4 }, { opacity: 1, scale: 1, rotation: -2 }, 0.6, 'power3.out'); F.sfx(510.98, 'rewind', 0.6);
    const fe = F.hand(S.ui, 'the fear: "AI might take my job"', 960, 1010, 64, C.navy, -1); F.in(fe, w('fear', 512), 'none', { dur: 0.35, sfx: false });
    S.cam(511.0, 960, 520, 1.1, 4.3, 'inOutSine');
  }

  // ===== the exact plan: the full Job Shield; the person your company cannot afford to lose (515.40 – 523.30) =====
  {
    const S = F.shot(515.40, 523.30, { cam: [960, 500, 1.15] });
    F.set(S.back, `<rect x="-800" y="900" width="3600" height="600" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    const glow = F.prop(S.back, `<circle r="440" fill="${C.gold}" opacity=".2"/>`, 960, 470, 900, 900, 1);
    const sh = F.shield(S.mid, 960, 470, 1.05, 9, 3);
    F.in(sh.el, 515.45, 'none', { dur: 0.5, sfx: 'swell', gain: 0.7 }); F.fromTo(glow, 515.6, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, 1.0);
    const names = ['Audit', 'Edit', 'Human', 'Context', 'Automate', 'Teach', 'Fact-check', 'Bridge', 'Track $'];
    const tpl = w('exact', 515);
    names.forEach((n, i) => { const r = Math.floor(i / 3), c = i % 3, x = 960 + (-240 + c * 160 + 80) * 1.05, y = 470 + (-300 + r * 200 + 100) * 1.05;
      const l = F.label(S.front, n, x, y + 60, { size: 26, bg: i === 6 ? C.navy : C.white, color: i === 6 ? C.white : C.navy, font: 'Inter', weight: 800, z: 9 });
      F.fromTo(l, tpl - 0.6 + i * 0.13, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25); F.sfx(tpl - 0.6 + i * 0.13, 'tick', 0.3); });
    const pl = F.label(S.ui, 'the exact plan', 960, 90, { size: 76, bg: C.tomato, rot: -1.5, z: 20 }); F.in(pl, tpl, 'below', { dur: 0.4 }); F.out(pl, w('person', 518) - 0.3, 'above');
    const you = F.puppet(S, S.front, 'you', 960, 1180, 1.35, { mood: 'happy', armR: 'up', z: 10 });
    const tp2 = w('person', 518);
    you.enter(tp2 - 0.6, 'below', 0.6).arm(tp2 - 0.6, 'r', 'up', 0.4);
    const fin = F.label(S.ui, 'the person your company cannot afford to lose', 960, 90, { size: 60, bg: C.navy, rot: -1, z: 20 });
    F.in(fin, tp2 - 0.1, 'below', { dur: 0.45 });
    F.sfx(w('lose.', 520), 'finale', 0.8);
    S.cam(tpl - 0.6, 960, 470, 1.0, 1.4).cam(tp2 - 0.8, 960, 470, 0.92, 2.4, 'inOutSine');
  }
  F.done();
})();
