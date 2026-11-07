// c00 — Hook: the software update (0 – 28.64)
(() => {
  const F = FILM.boot();
  const { C, P, K } = F, w = F.w, p = F.p, X = K10;
  const INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green;

  // ===== kitchen, the feed (0 – 3.52) =====
  {
    const S = F.shot(0, 3.52, { cam: [960, 540, 1.0] });
    X.room(F, S, '#DCE6F5', '#C9D4E6', 840);
    F.set(S.back, `<g filter="url(#cut)"><rect x="1250" y="110" width="540" height="430" fill="#BFD6FB"/><rect x="1250" y="390" width="540" height="150" fill="#FFE6A8"/><circle cx="1640" cy="410" r="70" fill="${YL}"/><rect x="1250" y="450" width="540" height="90" fill="#9FB6DA"/><rect x="1250" y="320" width="540" height="14" fill="#fff"/><rect x="1514" y="110" width="14" height="430" fill="#fff"/></g>`);
    const you = F.puppet(S, S.mid, 'you', 560, 1290, 2.4, { mood: 'neutral', armL: 'hold', armR: 'hold' });
    F.set(S.mid, P.mug(0, 0, 1.5).replace('translate(0 0)', 'translate(330 905)'), 6);
    const ph = F.prop(S.mid, P.phone(0, 0, 2.0, 4), 1000, 560, 520, 900, 7);
    const feed = F.html(S.mid, `<div style="width:340px;transform:rotate(4deg);transform-origin:170px 330px"><div style="font:800 26px Inter;color:${BL};margin-bottom:14px">Feed</div>
      <div class="post" style="background:#fff;border:2px solid #E3E8F0;border-radius:16px;padding:16px"><div style="display:flex;gap:10px;align-items:center"><div style="width:44px;height:44px;border-radius:8px;background:${INK}"></div><div style="font:700 20px Inter">Big Corp Inc.<div style="font:500 16px Inter;color:#7D879A">2h · promoted</div></div></div>
      <div style="font:700 25px/1.3 Inter;margin-top:14px">We're streamlining: 300 roles moving to our new AI platform.</div><div style="height:110px;margin-top:12px;border-radius:10px;background:linear-gradient(135deg,${BL},#2A62C9)"></div></div>
      <div style="margin-top:14px;height:120px;border-radius:16px;background:#F4F6FA"></div></div>`, 830, 230, 0, 0, 8);
    F.fromTo(feed.querySelector('.post'), w('this', 1), { y: 160, opacity: 0.0 }, { y: 0, opacity: 1 }, 0.6, 'power2.out'); F.sfx(w('this', 1), 'swipe', 0.4);
    for (let t = 0.3; t < 1.4; t += 0.35) F.sfx(t, 'tick', 0.12);
    const sg = X.sig(F, S.ui, 330, 170, 64, 0.6, INK, { rot: -6, swash: BL });
    const by = F.hand(S.ui, 'a story by', 250, 92, 38, '#5D6B88', -6); F.in(by, 0.35, 'none', { dur: 0.4, sfx: false });
    F.out(by, 3.0, 'above', { dur: 0.4 }); F.out(sg, 3.0, 'above', { dur: 0.4 });
    you.mood(w('morning,', 1), 'look');
    S.cam(0.4, 980, 520, 1.1, 3.0, 'inOutSine');
  }

  // ===== 300 workers, the update bar (3.52 – 7.62) — isometric =====
  {
    const S = F.shot(3.52, 7.62, { cam: [1060, 520, 0.94] });
    S.el.style.backgroundColor = '#E9EDF3';
    const I = X.iso(1060, 230, 1.12);
    F.set(S.back, `<g filter="url(#cutflat)">${I.tile(-420, -420, 840, 840, '#D5DCE7')}</g>`);
    const t0 = w('software', 6) - 0.25, t1 = 7.45;
    const pts = []; for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) pts.push([r, c]);
    pts.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    const grid = F.html(S.mid, '', 0, 0, 1920, 1080, 2);
    pts.forEach(([r, c]) => { const [x, y] = I.p(-390 + c * 66, -390 + r * 66);
      const d = F.html(grid, `<svg width="60" height="90" viewBox="-30 -80 60 90" style="overflow:visible"><g filter="url(#cutflat)"><rect x="-9" y="-12" width="7" height="12" fill="${INK}"/><rect x="2" y="-12" width="7" height="12" fill="${INK}"/><path d="M-14 -10 L-13 -40 Q-12 -48 0 -49 Q12 -48 13 -40 L14 -10Z" fill="${BL}"/><circle cx="0" cy="-60" r="11" fill="${C.skin1}"/><path d="M-11 -62 Q-11 -74 0 -74 Q11 -74 11 -64 Q4 -68 -9 -66Z" fill="${C.hair1}"/></g></svg>`, x - 30, y - 34, 60, 90, 2);
      const k = (r + c) / 22, tg = t0 + 0.2 + k * (t1 - t0);
      F.to(d, tg, { filter: 'grayscale(1) brightness(1.25) opacity(.55)', y: 6 }, 0.35);
    });
    const bar = F.html(S.ui, `<div style="width:1040px;height:120px;border-radius:16px;background:${INK};padding:38px 30px;box-sizing:border-box;display:flex;align-items:center;gap:26px;box-shadow:0 18px 30px rgba(5,10,25,.35)"><div style="flex:1;height:44px;border-radius:10px;border:4px solid #3A4C74;overflow:hidden"><div class="fill" style="height:100%;width:0;background:${RD}"></div></div><div class="pct" style="font:800 34px Inter;color:#fff;width:250px;white-space:nowrap">UPDATE 0%</div></div>`, 540, 900, 0, 0, 9);
    F.in(bar, w('software', 6) - 0.5, 'below', { dur: 0.45, sfx: 'pop' });
    const fill = bar.querySelector('.fill'), pct = bar.querySelector('.pct');
    F.every(S, (G) => { const u = Math.min(0.78, Math.max(0, (G - t0) / (t1 - t0)) * 0.78); fill.style.width = (u * 100).toFixed(1) + '%'; pct.textContent = 'UPDATE ' + Math.round(u * 100) + '%'; });
    const n300 = F.label(S.ui, '300', 250, 470, { size: 150, bg: C.white, color: RD, font: "'Archivo Black'", weight: 400, rot: -4, z: 9 });
    const wk = F.hand(S.ui, 'workers', 250, 610, 64, INK, -4);
    F.in(n300, w('300', 4) - 0.1, 'left', { dur: 0.45, sfx: 'stamp', gain: 0.5 }); F.in(wk, w('workers', 5), 'none', { dur: 0.35, sfx: false });
    F.sfx(t0 + 0.2, 'build', 0.35); F.sfx(w('update,', 6), 'ping', 0.4);
    S.cam(3.6, 1060, 480, 1.02, 3.0, 'inOutSine'); S.shake(w('update,', 6), 6);
  }

  // ===== your job is next (7.62 – 10.36) =====
  {
    const S = F.shot(7.62, 10.36, { cam: [620, 560, 1.25] });
    X.room(F, S, '#DCE6F5', '#C9D4E6', 840);
    const you = F.puppet(S, S.mid, 'you', 620, 1340, 2.6, { mood: 'look', armR: 'hold' });
    F.set(S.mid, P.phone(0, 0, 1.0, -6).replace('translate(0 0)', 'translate(1090 690)'), 6);
    const mini = F.html(S.mid, `<div style="width:170px;transform:rotate(-6deg)"><div style="height:22px;border-radius:6px;border:3px solid #3A4C74;overflow:hidden"><div style="height:100%;width:78%;background:${RD}"></div></div><div style="font:800 18px Inter;color:${INK};margin-top:6px">UPDATE 78%</div></div>`, 1005, 650, 0, 0, 7);
    you.mood(w('wonder', 8), 'worry').tilt(w('wonder', 8), -5).mood(w('next.', 9), 'gulp').mood(w('next.', 9) + 0.5, 'worry');
    F.sfx(w('next.', 9), 'gulp', 0.6); F.sfx(w('next.', 9) + 0.1, 'dread', 0.45);
    const q = F.label(S.ui, 'is my job next?', 1380, 260, { size: 64, bg: 'none', font: 'Caveat', weight: 700, color: RD, rot: -4, flat: true, z: 9 });
    F.in(q, w('job', 8), 'none', { dur: 0.4, sfx: false });
    S.cam(7.7, 700, 520, 1.42, 2.4, 'inOutSine');
  }

  // ===== the shared spreadsheet, the quiet part (10.36 – 19.04) =====
  {
    const S = F.shot(10.36, 19.04, { cam: [960, 540, 1.0] });
    X.room(F, S, '#DDE4EE', '#C9D3E2', 840);
    const robot = F.puppet(S, S.mid, 'intern', 1300, 640, 0.75, { mood: 'twitch', armL: 'up', noShadow: true });
    const L = F.laptop(S.mid, 960, 440, 0.7, 3);
    const names = [['Sam', 'Copy invoice totals', '90'], ['Priya', 'Answer ticket inbox', '120'], ['You', 'Weekly status report', '75'], ['Leo', 'Update CRM fields', '60'], ['Ana', 'Reconcile receipts', '45'], ['Ravi', 'Format slide decks', '50']];
    L.screen.innerHTML = `${F.winBar('Team tasks · shared')}<div style="position:absolute;right:30px;top:12px;display:flex;gap:6px" class="av">${[C.orange, C.blue, C.green].map((c) => `<span style="width:34px;height:34px;border-radius:50%;background:${c};border:3px solid #fff;opacity:0"></span>`).join('')}</div>
      <div style="padding:26px 34px"><div style="display:grid;grid-template-columns:70px 200px 1fr 120px;border:2px solid #E3E8F0;font:600 30px Inter">${['#', 'Name', 'Daily task', 'Mins'].map(h => `<div style="padding:12px;background:#F4F6FA;font-weight:800">${h}</div>`).join('')}
      ${names.map((r, i) => [i + 1, ...r].map(c => `<div class="c${i}" style="padding:13px 12px;border-top:2px solid #E3E8F0;opacity:0">${c}</div>`).join('')).join('')}</div></div>`;
    const tr = w('document', 12) - 0.1, tend = p('in a shared', 14);
    names.forEach((_, i) => { const tt = tr + i * (tend - tr) / names.length; L.screen.querySelectorAll('.c' + i).forEach((c) => F.fromTo(c, tt, { opacity: 0, x: -12 }, { opacity: 1, x: 0 }, 0.25)); F.sfx(tt, 'key', 0.3); F.sfx(tt + 0.08, 'key', 0.2); });
    L.screen.querySelectorAll('.c2').forEach((c) => F.fromTo(c, w('shared', 15), { backgroundColor: 'rgba(251,188,5,0)' }, { backgroundColor: 'rgba(251,188,5,.30)' }, 0.4));
    [...L.screen.querySelectorAll('.av span')].forEach((a, i) => { F.fromTo(a, w('shared', 15) + i * 0.12, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, 0.3, 'back.out(2)'); F.sfx(w('shared', 15) + i * 0.12, 'pop', 0.25); });
    const mgr = F.puppet(S, S.mid, 'manager', 330, 1000, 1.55, { mood: 'smile', armR: 'down', z: 5 });
    mgr.arm(w('boss', 11) + 0.1, 'r', 'point', 0.5).mood(w('asking', 11), 'neutral');
    const you = F.puppet(S, S.mid, 'you', 1520, 1010, 1.45, { mood: 'look', armL: 'hold', flip: true, z: 5 });
    const co = F.puppet(S, S.mid, 'co1', 1760, 1030, 1.35, { mood: 'neutral', z: 5 });
    const tq = w('quiet', 17);
    you.mood(w('nobody', 16), 'lookL').mood(tq, 'worry'); co.mood(w('nobody', 16) + 0.2, 'look').mood(tq + 0.4, 'worry').tilt(tq, 5);
    F.fromTo(robot.root, tq - 0.9, { y: 0 }, { y: -500 }, 1.4, 'power2.out'); robot.mood(tq + 0.6, 'neutral');
    F.sfx(tq - 0.8, 'creak', 0.4); F.sfx(tq, 'sting', 0.3);
    const hq = F.hand(S.ui, '…the quiet part', 1620, 110, 66, RD, -3); F.in(hq, w('out', 18), 'none', { dur: 0.4, sfx: false });
    S.cam(10.5, 960, 470, 1.08, 1.4).cam(tq - 1.0, 1060, 470, 1.06, 1.6, 'inOutSine');
  }

  // ===== THE SWITCH BOARD (19.04 – 28.64) =====
  {
    const S = F.shot(19.04, 28.64, { cam: [960, 540, 1.08] });
    X.darkBg(F, S);
    const B = X.board(F, S.mid, 960, 500, 0.93, { z: 4 });
    F.fromTo(B.el, 19.04, { y: -260, opacity: 0, rotation: -2 }, { y: 0, opacity: 1, rotation: 0 }, 0.7, 'power3.out'); F.sfx(19.1, 'paperslide', 0.5);
    B.rows.forEach((r, i) => { F.fromTo(r.el, w('10', 19) + i * 0.08, { opacity: 0, x: -40 }, { opacity: 1, x: 0 }, 0.3); F.sfx(w('10', 19) + i * 0.08, 'flick', 0.22); });
    const y2030 = F.label(S.ui, 'BY 2030', 1620, 960, { size: 64, bg: YL, color: INK, rot: -4, font: "'Archivo Black'", weight: 400, z: 9 });
    F.in(y2030, w('2030,', 21) - 0.1, 'none', { dur: 0.3, sfx: 'stamp', gain: 0.6 });
    F.out(y2030, w('prompts', 25) - 0.3, 'right', { dur: 0.35 });
    const tr = w('role', 23); B.hi(0, tr - 0.3); B.flip(0, tr); B.unflip(0, w('and', 24.8) + 0.1);
    const pr = F.label(S.ui, '+ THE PROMPTS', 1560, 960, { size: 60, bg: YL, color: INK, rot: -3, font: "'Archivo Black'", weight: 400, z: 9 });
    F.in(pr, w('prompts', 25), 'right', { dur: 0.4, sfx: 'slap', gain: 0.5 });
    const arc = F.set(S.ui, `<path d="M330 975 Q 700 820 1160 960" stroke="${YL}" stroke-width="7" fill="none" stroke-dasharray="4 16" stroke-linecap="round"/><path d="M1160 960 l-30 -22 m30 22 l-36 8" stroke="${YL}" stroke-width="7" stroke-linecap="round"/>`, 8);
    F.fromTo(arc, w('jump,', 26), { opacity: 0, x: -60 }, { opacity: 1, x: 0 }, 0.4); F.sfx(w('jump,', 26), 'whoosh', 0.35);
    const sg = X.sig(F, S.ui, 260, 1010, 40, 22.0, '#C9D3E2', { rot: -3, sfx: false });
    const t1 = w('one.', 27.5);
    B.hi(0, t1 - 0.6);
    S.cam(19.3, 960, 520, 1.0, 2.0, 'inOutSine').cam(t1 - 0.5, 960, 222, 1.7, 1.1, 'inOutCubic'); F.out(sg, t1 - 0.6, 'below', { dur: 0.3 });
    F.out(pr, t1 - 0.6, 'below', { dur: 0.3 }); F.out(arc, t1 - 0.6, 'below', { dur: 0.3 });
    F.sfx(t1 - 0.3, 'whoosh', 0.5);
  }
  F.done();
})();
