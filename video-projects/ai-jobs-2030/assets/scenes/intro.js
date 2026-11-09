// INTRO: cold open (music) -> the LinkedIn hook -> the boss's spreadsheet -> breath -> title world
(() => {
  const { K, G, path, actor, key, spoken } = FILM, S = STAGE;
  const X = FILM.sec('intro'), w = X.w, DUR = X.DUR;
  const tHook = w('You checked').s, tAnother = w('another company').s, tReplaced = w('replaced 300').s, t300 = w('300 workers').s, tWonder = w('wonder if').s, tNext = w('is next').s;
  const tRight = w('Right now').s, tDoc = w('document every').s, tEvery = w('every single').s, tNobody = w('nobody wants').s, tQuiet = w('quiet part').s, tLoud = w('out loud').e;
  const tHere = w('Here are 10').s, tTen = w('10 jobs').s, tErase = w('erase').s, t2030 = w('by 2030').s, tExact = w('the exact role').s, tSwitch = w('switch to').s, tPrompts = w('the prompts').s, tStarting = w('starting with').s;

  const shots = [];
  // ---------------- S01 cold open: dawn city, crane down to the one lit window ----------------
  shots.push({ t0: 0, t1: tHook - 0.35, fadeIn: 0,
    camPath: path([[0, 0, -260, 1.0, 0], [2.5, 30, -120, 1.12, 0], [tHook, 90, 30, 1.45, 0]]),
    build(d) {
      d.L(9, K.sky('#0b1430 0%,#2a2a5a 34%,#b0607a 58%,#ffb36b 70%,#ffe0a8 78%,#ffd09a 100%') + K.rad(1000, 700, 900, 420, 'rgba(255,230,170,.95)'));
      const title = d.L(7, K.t('2030', 470, 170, 330, 'rgba(255,255,255,.22)', "font-family:'Archivo Black';letter-spacing:24px"), { blur: 1 });
      d.L(5, K.skyline(3, 860, '#6a4a73', 0, 90, 240), { blur: 3 });
      d.L(3, K.skyline(5, 940, '#3a2a4a', 0.16, 80, 320), { blur: 1.2 });
      d.L(2.2, K.box(-300, 0, 2520, 1080, 'linear-gradient(180deg,transparent 55%,rgba(255,180,130,.35) 72%,transparent 88%)'));
      const near = d.L(1.1, K.skyline(9, 1120, '#130e1b', 0.1, 140, 380) + `<div class="fl-a win" style="left:1010px;top:858px;width:26px;height:32px;background:#ffd27a;box-shadow:0 0 50px 14px rgba(255,200,110,.75)"></div>`);
      d.L(0.6, K.motes(4, 30, 'rgba(255,220,180,.8)', 0, 0, 1920, 1080, 4), { blur: 2 });
      d.on((T, lt) => { title.style.opacity = (S.seg(lt, 0.6, 2.4) * (1 - S.seg(lt, 3.6, 4.6))).toFixed(3); });
    } });
  // ---------------- S02 the hook: bedroom, phone glow, the feed floats in 3D ----------------
  let fahim2;
  shots.push({ t0: tHook - 0.35, t1: tRight - 0.25, fadeIn: 0.7,
    camPath: path([[0, -160, 40, 1.0, -0.6], [tAnother - tHook, -80, 20, 1.06, -0.3], [t300 - tHook + 1, 40, 0, 1.12, 0], [tWonder - tHook, 160, -40, 1.28, 0.3], [tRight - tHook, 260, -110, 1.55, 0.6]]),
    build(d) {
      d.L(6, K.sky('#070b16,#0d1630 60%,#05070d') + `<div class="fl-a" style="left:1300px;top:120px;width:440px;height:560px;background:linear-gradient(160deg,#1c2a4a,#0b1222);border:12px solid #10182b"><div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 25%,#dfe8ff 0 34px,rgba(200,215,255,.25) 36px,transparent 90px)"></div></div>`, { blur: 4 });
      d.L(3, K.box(140, 700, 1800, 380, 'linear-gradient(180deg,#1b2440,#0a0f1c)', 'border-radius:50px 50px 0 0') + K.box(1450, 520, 420, 200, 'linear-gradient(180deg,#2a3558,#141b30)', 'border-radius:40px'), { blur: 2 });
      const glow = d.L(1.6, K.rad(1060, 520, 760, 760, 'rgba(66,133,244,.55)'));
      const A = d.L(1.4);
      fahim2 = actor(A, { id: 'f2', x: 1080, y: 1210, h: 1000, pose: 'phone', face: 'smile', look: [0.55, 0.55], rim: '#8ab4f8', rim2: '#8ab4f8' });
      // the feed card
      const F = d.L(1.15, `<div class="fl-a feed" style="left:150px;top:120px;width:640px;height:800px;transform:perspective(1400px) rotateY(24deg) rotateX(4deg);transform-origin:100% 50%">
        <div style="position:absolute;inset:0;border-radius:30px;background:linear-gradient(180deg,#f8fafd,#e8eef8);box-shadow:0 0 140px rgba(66,133,244,.6);overflow:hidden">
          <div style="height:92px;background:#fff;display:flex;align-items:center;padding:0 30px;gap:16px"><div style="width:52px;height:52px;border-radius:12px;background:${G.b}"></div><div style="height:22px;width:300px;background:#e1e6ef;border-radius:11px"></div></div>
          <div class="posts" style="position:absolute;left:0;right:0;top:92px">
            ${[0, 1].map(() => `<div style="margin:24px;padding:28px;background:#fff;border-radius:20px;height:300px"><div style="display:flex;gap:16px"><div style="width:60px;height:60px;border-radius:50%;background:#dfe5ee"></div><div style="flex:1"><div style="height:18px;width:60%;background:#e4e8ef;border-radius:9px"></div><div style="height:14px;width:30%;background:#eef1f5;border-radius:7px;margin-top:12px"></div></div></div><div style="height:150px;margin-top:24px;border-radius:14px;background:#eef2f8"></div></div>`).join('')}
            <div style="margin:24px;padding:30px;background:#fff;border-radius:20px;box-shadow:0 8px 24px rgba(0,0,0,.08)">
              <div style="display:flex;gap:16px;align-items:center"><div style="width:64px;height:64px;border-radius:50%;background:#c9d3e3"></div><div style="font:800 26px Figtree;color:#5f6368">Industry News<br><span style="font-weight:700;font-size:20px;color:#9aa0a6">2h</span></div></div>
              <div style="font:900 52px/1.08 Figtree;color:#202124;margin-top:26px">Company replaces<br><span class="n300" style="color:${G.r}">300 workers</span><br>with a software update</div>
              <div style="height:200px;margin-top:26px;border-radius:14px;background:linear-gradient(135deg,#d2e3fc,#fce8e6)"></div></div></div></div></div>`);
      const posts = F.querySelector('.posts'), n300 = F.querySelector('.n300'), card = F.querySelector('.feed');
      const big = d.hud();
      const k1 = key(big, `<span style="color:${G.r}">300</span> REPLACED`, 1840, 110, 140, '#fff', X.T0 + t300, X.T0 + tWonder - 0.3, { align: 'right', css: 'text-shadow:0 20px 60px rgba(0,0,0,.6)' });
      const k2 = key(big, `IS YOUR JOB <span style="color:${G.y}">NEXT?</span>`, 1840, 110, 130, '#fff', X.T0 + tWonder + 0.2, null, { align: 'right', css: 'text-shadow:0 20px 60px rgba(0,0,0,.6)' });
      d.L(0.5, K.motes(8, 18, 'rgba(138,180,248,.7)', 0, 0, 1920, 1080, 5), { blur: 3 });
      d.on((T, lt) => {
        const t = lt + tHook - 0.35;
        // the feed scrolls, then stops on the headline
        posts.style.transform = `translateY(${(-700 * S.E.outCubic(S.seg(t, tHook, tAnother + 0.6))).toFixed(1)}px)`;
        n300.style.textShadow = t > t300 ? `0 0 ${(20 * Math.abs(Math.sin(t * 3))).toFixed(0)}px rgba(234,67,53,.6)` : 'none';
        card.style.opacity = (1 - S.seg(t, tWonder - 0.2, tWonder + 0.6) * 0.65).toFixed(3);
        const face = t < tReplaced ? 'smile' : t < tWonder ? 'shocked' : 'worried';
        fahim2.set({ face, look: t < tWonder ? [-0.9, 0.3] : [0.1, -0.1], tilt: t > tWonder ? -4 : 0, pose: t < tWonder ? 'phone' : 'phone' }, T, lt);
        glow.style.opacity = (0.8 + 0.2 * Math.sin(lt * 7.3) * Math.sin(lt * 3.1)).toFixed(3);
        k1(T); k2(T);
      });
    } });
  // ---------------- S03 the boss and the spreadsheet; then the quiet breath ----------------
  let fahim3, boss, team;
  shots.push({ t0: tRight - 0.25, t1: tHere - 0.4, fadeIn: 0.6,
    camPath: path([[0, -300, 30, 1.08, 0.6], [tDoc - tRight, -200, 20, 1.05, 0.4], [tNobody - tRight, 40, 10, 1.03, 0], [tLoud - tRight, 160, 0, 1.12, -0.3], [tHere - tRight, 260, 10, 1.3, -0.5]]),
    build(d) {
      d.L(5, K.sky('#0a0e18,#111a2c 60%,#070a12'));
      let rows = '';
      for (let i = 0; i < 12; i++) { rows += `<div style="display:flex;gap:6px;margin-bottom:6px">`; for (let j = 0; j < 7; j++) rows += `<div class="cell" data-i="${i}" data-j="${j}" style="width:${j ? 210 : 90}px;height:58px;background:rgba(255,255,255,.04);border:1px solid rgba(138,180,248,.3)"><div class="ink" style="margin:22px 14px;height:14px;width:${(60 + S.hash(i * 9 + j) * 110).toFixed(0)}px;background:rgba(232,240,254,.85);border-radius:7px;transform-origin:0 50%;transform:scaleX(0)"></div></div>`; rows += '</div>'; }
      const wall = d.L(3, `<div class="fl-a" style="left:-80px;top:-60px;width:1640px;height:960px;transform:perspective(1400px) rotateY(-28deg) translateZ(-200px);transform-origin:0 50%;padding:40px;box-shadow:0 0 160px rgba(66,133,244,.35);background:#0c1424">${rows}</div>` + K.rad(700, 520, 1100, 600, 'rgba(66,133,244,.22)'));
      const cells = [...wall.querySelectorAll('.cell')];
      d.L(2.4, K.floor(850, '#0b1222', '#060912'));
      const back = d.L(1.6, K.floor(930, '#0b1222', '#070a12'));
      team = [actor(back, { id: 't1', cast: 'maya', x: 1260, y: 990, h: 470, face: 'smile', look: [-0.8, -0.4], rim: '#8ab4f8', css: 'filter:brightness(.6) blur(1.5px)' }),
        actor(back, { id: 't2', cast: 'omar', x: 1440, y: 985, h: 450, face: 'smile', look: [-0.8, -0.4], rim: '#8ab4f8', css: 'filter:brightness(.5) blur(2px)' }),
        actor(back, { id: 't3', cast: 'kofi', headset: false, x: 1620, y: 995, h: 480, pose: 'folded', face: 'smile', look: [-0.8, -0.4], rim: '#8ab4f8', css: 'filter:brightness(.45) blur(2.5px)' })];
      const mid = d.L(1.2, K.floor(1010, '#0c1426', '#04060b'));
      fahim3 = actor(mid, { id: 'f3', x: 820, y: 1060, h: 580, face: 'focused', look: [-0.6, -0.3], rim: '#8ab4f8', rim2: '#4285F4' });
      boss = actor(mid, { id: 'b3', cast: 'boss', x: 1750, y: 1110, h: 680, pose: 'idle', face: 'stern', look: [-0.9, -0.2], rim: '#8ab4f8', rim2: '#4285F4', css: 'transform:scaleX(-1)' });
      const tx = d.hud();
      const k1 = key(tx, 'EVERY TASK.', 1840, 100, 120, '#fff', X.T0 + tEvery, X.T0 + tNobody - 0.2, { align: 'right', css: 'text-shadow:0 10px 40px #000' });
      const k2 = key(tx, `<span style="color:${G.b}">DOCUMENTED.</span>`, 1840, 230, 120, '#fff', X.T0 + tEvery + 0.9, X.T0 + tNobody - 0.2, { align: 'right', css: 'text-shadow:0 10px 40px #000' });
      const k3 = key(tx, `THE <span style="color:${G.r}">QUIET</span> PART`, 1840, 140, 120, '#fff', X.T0 + tQuiet, X.T0 + tHere - 1.0, { align: 'right', css: 'text-shadow:0 10px 40px #000' });
      d.L(0.6, K.motes(12, 14, 'rgba(138,180,248,.6)', 0, 0, 1920, 1080, 4), { blur: 3 });
      d.on((T, lt) => {
        const t = lt + tRight - 0.25;
        // the spreadsheet fills, row by row; during the breath the rows turn red one after another
        cells.forEach((c, n) => { const i = +c.dataset.i, j = +c.dataset.j; const on = S.E.outCubic(S.seg(t, tDoc + i * 0.32 + j * 0.05, tDoc + i * 0.32 + j * 0.05 + 0.3));
          c.firstChild.style.transform = `scaleX(${on.toFixed(3)})`;
          const red = S.seg(t, tLoud + 0.2 + i * 0.12, tLoud + 0.5 + i * 0.12);
          c.style.background = red > 0 ? `rgba(234,67,53,${(0.12 + red * 0.3).toFixed(2)})` : on > 0 ? 'rgba(66,133,244,.16)' : 'rgba(255,255,255,.04)';
          c.style.borderColor = red > 0.5 ? 'rgba(255,120,110,.5)' : 'rgba(138,180,248,.3)'; });
        boss.set({ pose: t > tDoc - 0.3 && t < tNobody ? 'point' : 'folded', face: 'stern' }, T, lt);
        const look = t < tNobody ? [-0.9, -0.3] : [-0.9, 0.2];
        team.forEach((a, i) => a.set({ face: t > tNobody ? 'worried' : 'focused', look: t > tNobody + 0.4 + i * 0.3 ? [0.6, 0.1] : look }, T, lt));
        fahim3.set({ pose: t > tLoud ? 'worried' : 'idle', face: t > tNobody ? 'worried' : 'focused', look: t > tLoud ? [-0.7, -0.6] : [-0.8, -0.3] }, T, lt);
        k1(T); k2(T); k3(T);
      });
    } });
  // ---------------- S04 title world: the road of ten monoliths, fly to 01 ----------------
  let fahim4;
  shots.push({ t0: tHere - 0.4, t1: DUR, fadeIn: 0.8,
    camPath: path([[0, 0, -80, 0.86, 0], [tTen - tHere + 0.4, 0, -40, 0.95, 0], [tExact - tHere, -30, 0, 1.15, -0.4], [tPrompts - tHere, -60, 20, 1.45, -0.8], [tStarting - tHere, -300, 110, 1.7, -0.4], [DUR - (tHere - 0.4), -2085, 675, 3.0, 0]]),
    build(d) {
      d.L(12, K.sky('#05060c 0%,#141a35 44%,#3b2b55 58%,#0b0b14 59%,#06070b') + K.rad(960, 600, 1000, 300, 'rgba(201,166,255,.7)'));
      d.L(8, K.motes(21, 60, ['#4285F4', '#EA4335', '#FBBC05', '#34A853'], 0, 60, 1920, 500, 3), { blur: 0.5 });
      d.L(4, `<svg class="fl-a" style="left:-1000px;top:0;width:3920px;height:1080px" viewBox="-1000 0 3920 1080"><path d="M935 640 L985 640 L2400 1400 L-480 1400Z" fill="#141826"/><path d="M958 642 L962 642 L990 1400 L930 1400Z" fill="${G.y}" opacity=".8"/></svg>`);
      for (let i = 9; i >= 0; i--) {
        const k = i % 2 ? 1 : -1, sc = 1 / (1 + i * 0.42), c = K.GC[i % 4], wd = 130 * sc, h = 430 * sc, yb = 650 + 330 * sc, xo = 70 + 560 * sc, x = k > 0 ? 960 + xo : 960 - xo - wd;
        d.L(1 / sc * 1.0, `<div class="fl-a" style="left:${x}px;top:${yb - h}px;width:${wd}px;height:${h}px;background:linear-gradient(180deg,${c},#0a0a12 130%);box-shadow:0 0 ${70 * sc}px ${c};border-radius:${8 * sc}px">${K.num(String(i + 1).padStart(2, '0'), 0, 18 * sc, 62 * sc, '#fff').replace('left:0px', 'left:0;right:0;text-align:center')}</div>`, { blur: i > 4 ? (i - 4) * 0.3 : 0 });
      }
      const A = d.L(1.3);
      fahim4 = actor(A, { id: 'f4', x: 960, y: 1015, h: 300, face: 'focused', look: [0, -0.6], rim: '#c9a6ff', rim2: '#4285F4' });
      const tx = d.hud();
      const k1 = key(tx, `<span style="color:${G.b}">10</span> JOBS AI WILL <span style="color:${G.r}">ERASE</span>`, 960, 110, 110, '#fff', X.T0 + tTen - 0.05, X.T0 + tExact - 0.1, { align: 'center' });
      const k2 = key(tx, `BY <span style="color:${G.y}">2030</span>`, 960, 240, 96, '#fff', X.T0 + t2030, X.T0 + tExact - 0.1, { align: 'center' });
      const k3 = key(tx, `THE <span style="color:${G.g}">NEW ROLE</span>`, 960, 140, 110, '#fff', X.T0 + tSwitch, X.T0 + tStarting - 0.1, { align: 'center' });
      const k4 = key(tx, `+ THE <span style="color:${G.b}">PROMPTS</span>`, 960, 270, 96, '#fff', X.T0 + tPrompts, X.T0 + tStarting - 0.1, { align: 'center' });
      d.on((T, lt) => {
        const t = lt + tHere - 0.4;
        const walk = t > tStarting ? (t - tStarting) * 7 : undefined;
        fahim4.set({ face: t > tSwitch ? 'determined' : 'focused', look: [0, -0.6], walk, s: 1 }, T, lt);
        k1(T); k2(T); k3(T); k4(T);
      });
    } });
  const { sfx } = FILM, T = (x) => X.T0 + x;
  sfx('ping', T(tHook + 1.0), 0.45); sfx('paper', T(tHook + 0.3), 0.15); sfx('boom', T(t300), 0.45); sfx('glitch', T(tReplaced), 0.25);
  sfx('stamp', T(tEvery), 0.5); sfx('stamp', T(tEvery + 0.9), 0.4); for (let i = 0; i < 12; i++) sfx('tick', T(tDoc + i * 0.32), 0.25);
  sfx('error', T(tLoud + 0.2), 0.3); sfx('glitch', T(tLoud + 0.6), 0.3); sfx('whoosh', T(tHere - 0.6), 0.5);
  sfx('pop', T(tTen), 0.35); sfx('stamp', T(tErase), 0.45); sfx('chime', T(tSwitch), 0.35); sfx('whoosh_up', T(DUR - 1.4), 0.7);
  FILM.section('intro', shots);
})();
