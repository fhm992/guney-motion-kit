// cta — every prompt in one free list; comment SECURE (297.74 – 304.82)
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F, w = F.w;
  const S = F.shot(297.74, 304.82, { bg: '#E9DFC9', cam: [960, 540, 1.0] });
  const board = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-270" y="-370" width="540" height="740" rx="20" fill="${C.kraft2}"/><rect x="-230" y="-320" width="460" height="660" fill="${C.white}"/><rect x="-90" y="-400" width="180" height="70" rx="14" fill="${C.navy}"/></g>`, 560, 560, 600, 820, 2);
  F.fromTo(board, 297.78, { opacity: 0, y: 300, rotation: 8 }, { opacity: 1, y: 0, rotation: -3 }, 0.55, 'power3.out'); F.sfx(297.8, 'paperslide', 0.6);
  const tp = w('every', 297);
  const names = ['Audit my tasks', 'Edit, don\'t write', 'Human problems', 'Context file', 'Automate a process', 'Teach my boss', 'Fact-check the AI', 'Bridge two teams', 'Track my wins'];
  names.forEach((n, i) => { const sl = F.label(S.mid, `<span style="opacity:.55">0${i + 1}</span> ${n}`, 560, 290 + i * 66, { size: 32, bg: i === 6 ? C.gold : C.paper2, color: C.navy, font: 'Inter', weight: 700, rot: -3 + (i % 3), z: 4 });
    F.in(sl, tp + 0.1 + i * 0.12, 'right', { dur: 0.3, sfx: i % 2 ? false : 'flip', gain: 0.25 }); });
  const fl = F.label(S.mid, 'FREE PROMPT LIST', 1380, 260, { size: 70, bg: C.tomato, rot: 2, z: 5 }); F.in(fl, w('free', 299) - 0.1, 'below', { dur: 0.4 });
  const box = F.html(S.mid, `<div style="width:760px;background:#fff;border-radius:24px;box-shadow:0 18px 36px rgba(30,42,68,.22);padding:30px 36px;font-family:Inter"><div style="display:flex;align-items:center;gap:14px;color:#8a8f9c;font:600 28px Inter"><span style="width:52px;height:52px;border-radius:50%;background:#7FA88B"></span>Add a comment…</div><div class="cm" style="margin-top:22px;font:800 116px 'Bricolage Grotesque';color:#1E2A44;min-height:120px"></div></div>`, 1000, 420, 760, 0, 5);
  const cm = box.querySelector('.cm');
  F.in(box, w('comment', 301) - 0.4, 'right', { dur: 0.45 });
  const ts = w('secure', 301);
  F.every(S, (G) => { const n = Math.max(0, Math.min(6, Math.floor((G - ts + 0.15) * 14))); cm.innerHTML = 'SECURE'.slice(0, n) + (Math.floor(G * 2.4) % 2 ? '<span style="display:inline-block;width:8px;height:96px;background:#E4572E;vertical-align:-10px"></span>' : ''); });
  for (let i = 0; i < 6; i++) F.sfx(ts - 0.15 + i / 14, 'key', 0.35);
  const lock = F.prop(S.mid, `<g filter="url(#cut)"><rect x="-80" y="-30" width="160" height="124" rx="16" fill="${C.gold}"/><circle cx="0" cy="26" r="16" fill="${C.navy}"/><rect x="-6" y="30" width="12" height="34" fill="${C.navy}"/></g>`, 760, 900, 200, 200, 7);
  const shack = F.prop(S.mid, `<path d="M-48 0 v-46 a48 48 0 0 1 96 0 v46" stroke="${C.navy}" stroke-width="18" fill="none"/>`, 760, 860, 140, 120, 6);
  F.in(lock, ts + 0.3, 'below', { dur: 0.35, sfx: false }); F.fromTo(shack, ts + 0.3, { opacity: 0, y: -50 }, { opacity: 1, y: -30 }, 0.3); F.to(shack, ts + 0.8, { y: 0 }, 0.15, 'power3.in'); F.sfx(ts + 0.95, 'lock', 0.8);
  const ar = F.prop(S.front, `<g filter="url(#cut)"><rect x="-26" y="-90" width="52" height="120" fill="${C.tomato}"/><path d="M-70 30 L70 30 L0 110Z" fill="${C.tomato}"/></g>`, 1380, 820, 160, 220, 8);
  F.in(ar, w('below', 302) - 0.1, 'above', { dur: 0.4, sfx: 'swish' });
  F.every(S, (G) => { ar.style.translate = `0 ${(12 * Math.sin(G * 6)).toFixed(1)}px`; });
  const sd = F.hand(S.front, "and I'll send it to you", 1380, 700, 60, C.navy, -2); F.in(sd, w('send', 303) - 0.1, 'none', { dur: 0.3, sfx: false });
  S.cam(w('comment', 301) - 0.5, 1120, 560, 1.06, 1.0);
  F.done();
})();
