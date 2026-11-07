// cta — every prompt in one free list; comment AI JOBS; (visual) subscribe (332.30 – 340.32)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const S = F.shot(332.30, 340.32, { cam: [960, 540, 1.0] });
  F.wipe(332.30);
  S.el.style.backgroundColor = '#E9EDF3';
  const book = F.html(S.mid, `<div style="position:relative;width:500px;height:680px;border-radius:18px;background:${BL};box-shadow:0 30px 50px rgba(14,24,48,.3);transform:rotate(-4deg)"><div style="position:absolute;inset:40px 36px;background:#fff;border-radius:6px;padding:30px;box-sizing:border-box">
    <div style="font:400 46px 'Archivo Black';color:${INK}">10 PROMPTS</div><div style="font:700 26px Inter;color:#7D879A;margin:6px 0 20px">AI jobs · free list</div>
    ${[...Array(10)].map((_, i) => `<div class="pr" style="height:26px;width:${300 - (i % 3) * 40}px;border-radius:6px;margin-bottom:12px;background:${[BL, RD, YL, GR, OR][i % 5]};opacity:.85"></div>`).join('')}
    <div style="position:absolute;right:26px;bottom:18px;font:700 30px Caveat;color:${INK}">by Fahim F Hassan</div></div></div>`, 240, 200, 0, 0, 3);
  F.in(book, 332.4, 'left', { dur: 0.55, sfx: 'paperslide' });
  [...book.querySelectorAll('.pr')].forEach((r, i) => F.fromTo(r, w('every', 332.6) + i * 0.1, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1 }, 0.25));
  F.sfx(w('every', 332.6), 'flipcards', 0.4);
  const free = F.label(S.ui, 'FREE', 690, 230, { size: 64, bg: GR, color: WH, rot: 10, font: "'Archivo Black'", weight: 400, z: 9 }); F.in(free, w('free', 334.6), 'none', { dur: 0.3, sfx: 'stamp', gain: 0.5 });
  const box = F.html(S.mid, `<div style="width:860px;height:300px;border-radius:24px;background:#fff;box-shadow:0 20px 40px rgba(14,24,48,.2);padding:30px 40px;box-sizing:border-box"><div style="font:600 30px Inter;color:#7D879A">Add a comment…</div><div style="margin-top:30px;font:800 130px 'Bricolage Grotesque';color:${INK};white-space:nowrap"><span class="tx"></span><span class="car" style="display:inline-block;width:8px;height:110px;background:${BL};vertical-align:-12px;margin-left:6px"></span></div></div>`, 940, 330, 0, 0, 4);
  F.in(box, w('Comment', 335.3) - 0.3, 'right', { dur: 0.45, sfx: 'pop' });
  const tx = box.querySelector('.tx'), car = box.querySelector('.car'), t0 = w('AI', 336.4) - 0.1;
  F.every(S, (G) => { const s = 'AI JOBS'; tx.textContent = s.slice(0, Math.max(0, Math.min(s.length, Math.floor((G - t0) / 0.11)))); car.style.opacity = Math.floor(G * 2.4) % 2 ? 0.2 : 1; });
  for (let i = 0; i < 7; i++) F.sfx(t0 + i * 0.11, 'key', 0.35);
  const plane = F.prop(S.ui, `<g filter="url(#cut)"><path d="M-90 0 L90 -50 L20 60 Z" fill="${WH}"/><path d="M20 60 L90 -50 L0 20Z" fill="#D5DCE7"/></g>`, 560, 560, 200, 140, 12);
  F.hidden(plane); F.show(plane, w('send', 338.6)); F.fromTo(plane, w('send', 338.6), { x: 0, y: 0, rotation: -10, scale: 0.6 }, { x: 1180, y: -420, rotation: -24, scale: 1 }, 1.0, 'power2.in'); F.sfx(w('send', 338.6), 'plane', 0.5);
  const dm = F.html(S.ui, `<div style="width:120px;height:120px;border-radius:30px;background:${BL};display:grid;place-items:center;font:800 54px Inter;color:#fff;box-shadow:0 12px 24px rgba(14,24,48,.3)">✉</div>`, 1700, 80, 0, 0, 11);
  F.in(dm, w('send', 338.6) - 0.3, 'right', { dur: 0.35, sfx: false }); F.sfx(w('you.', 339.4), 'ping', 0.5);
  // visual subscribe nudge (the voice doesn't say it)
  const sub = X.subscribe(F, S.ui, 1370, 820, w('below', 337.3), w('you.', 339.4) - 0.2, { z: 14 });
  const hint = F.hand(S.ui, 'new AI career video every week', 1370, 940, 44, '#5D6B88', -2); F.in(hint, w('below', 337.3) + 0.3, 'none', { dur: 0.35, sfx: false });
  S.cam(332.4, 960, 540, 1.03, 8, 'inOutSine');
  F.done();
})();
