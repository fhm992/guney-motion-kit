// FINALE: not work, the robotic parts -> music-only sunrise -> rooftop with the whole cast -> Fahim signs off -> the road at dawn -> end card
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  const X = FILM.sec('finale'), w = X.w, DUR = X.DUR, C = CUES.finale, L = (a) => a - X.T0;
  const tBreath = L(C.breath), tNext = L(C.next), tIam = L(C.iam), tStarted = L(C.started), tEndV = L(C.end_voice);
  const shots = [];
  // ---------- F1: the robotic parts of work lift away ----------
  shots.push({ t0: 0, t1: tBreath, fadeIn: 0.6,
    camPath: path([[0, -200, 40, 1.25, -0.4], [tBreath * 0.6, 0, 0, 1.1, 0], [tBreath, 120, -60, 1.0, 0.4]]),
    build(d) {
      d.L(8, K.sky('#06070d,#11152a 60%,#05060a') + K.rad(960, 420, 1400, 900, 'rgba(66,133,244,.2)'));
      d.L(5, K.motes(901, 60, [G.b, G.r, G.y, G.g], 0, 0, 1920, 1080, 3));
      let stack = ''; for (let i = 0; i < 30; i++) stack += `<div class="fl-a blk" style="left:${1180 + (S.hash(i) * 20 - 10)}px;top:${1010 - i * 22}px;width:300px;height:20px;border-radius:4px;background:${['#9aa0a6', '#80868b', '#bdc1c6'][i % 3]}"></div>`;
      const St = d.L(1.5, stack + P.robot(1230, 250, 1.0, G.b, 'rb')); const blks = [...St.querySelectorAll('.blk')], rb = St.querySelector('.rb');
      const A = d.L(1.2);
      const f = actor(A, { id: 'fa', x: 640, y: 1080, h: 820, face: 'determined', look: [0.8, -0.3], rim: '#8ab4f8', rim2: G.y });
      const hud = d.hud();
      const tNot = w('AI is not erasing').s, tWork = w('work itself').s, tRob = w('robotic parts').s, tStuck = w('kept you stuck').s;
      const k1 = key(hud, `AI ISN'T ERASING <span style="color:${G.g}">WORK</span>`, 110, 90, 104, '#fff', X.T0 + tNot + 0.2, X.T0 + tRob - 0.3);
      const k2 = key(hud, `IT ERASES THE <span style="color:${G.r}">ROBOTIC PARTS</span>`, 110, 90, 96, '#fff', X.T0 + tRob, null);
      sfx('whoosh_up', X.T0 + tRob + 0.2, 0.5); sfx('machine', X.T0 + tRob, 0.3);
      d.on((T, lt) => {
        // the robot lifts the repetitive stack away, block by block
        blks.forEach((b, i) => { const k = 29 - i, u = S.E.inCubic(S.seg(lt, tRob + 0.3 + (29 - k) * 0.12, tRob + 1.1 + (29 - k) * 0.12));
          b.style.transform = `translate(${(u * 120).toFixed(0)}px,${(-u * 1200).toFixed(0)}px) rotate(${(u * 30).toFixed(0)}deg)`; b.style.opacity = (1 - u).toFixed(2); });
        rb.style.transform = `translateY(${(Math.sin(lt * 2) * 12 - S.seg(lt, tRob, tStuck + 2) * 600).toFixed(0)}px)`;
        f.set({ talk: true, pose: lt > tStuck ? 'present' : 'idle', face: 'determined' }, T, lt);
        k1(T); k2(T);
      });
    } });
  // ---------- F2: sunrise breath -> rooftop, the whole cast in their new roles ----------
  const castNew = ['priya_new', 'lena_new', 'theo_new', 'omar_new', 'kofi_new', 'sofia_new', 'mia_new', 'zara_new', 'sam_new', 'ray_new'];
  shots.push({ t0: tBreath, t1: tIam - 0.2, fadeIn: 1.0, whoosh: 'swell',
    camPath: path([[0, 0, 420, 1.0, 0], [tNext - tBreath, 0, 160, 1.0, 0], [tIam - tBreath - 3, 80, 40, 1.08, 0.3], [tIam - tBreath, 140, 0, 1.18, 0.5]]),
    build(d) {
      const sky = d.L(10, K.sky('#1a2a6a 0%,#5a4a9a 28%,#f08a6a 52%,#ffd27a 64%,#fff0c0 70%,#ffe6b0 100%'));
      const sun = d.L(9, `<div class="fl-a" style="left:760px;top:420px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,#fffbe8,#ffe9a8 45%,rgba(255,220,150,0) 70%)"></div>` + K.rays(960, 620, 9, 2000, 40, 180, 20, 'rgba(255,240,190,.45)', 0.7));
      d.L(6, K.skyline(21, 840, '#8a5a7a', 0, 60, 230), { blur: 4 });
      d.L(3.5, K.skyline(23, 900, '#4a3050', 0.12, 50, 260, '#ffe0a0'), { blur: 2 });
      d.L(1.6, K.floor(930, '#2a1830', '#120a16'));
      const A = d.L(1.3);
      const cast = castNew.map((c, i) => actor(A, Object.assign({ id: 'fc' + i, x: i < 5 ? 150 + i * 150 : 1170 + (i - 5) * 150, y: 990, h: 400, face: 'smile', look: [i < 5 ? 0.6 : -0.6, -0.2], rim: '#ffd27a', rim2: '#ff9a7a', breathe: 2 }, JOB.CAST[c])));
      const M = d.L(1.15);
      const f = actor(M, { id: 'fb', x: 960, y: 1060, h: 640, pose: 'phone', face: 'smile', look: [0, -0.3], rim: '#ffd27a', rim2: '#ff9a7a' });
      const hud = d.hud();
      const tRun = w('the person running the update').s, tWorr = w('will not be worried').s, tBec = w('because you will be').s;
      const k1 = key(hud, `YOU RUN`, 960, 90, 150, '#fff', X.T0 + tRun, null, { align: 'center', css: 'text-shadow:0 14px 50px rgba(80,30,60,.6)' });
      const k2 = key(hud, `THE ${K.gword('UPDATE')}`, 960, 245, 150, '#fff', X.T0 + tRun + 0.35, null, { align: 'center', css: 'text-shadow:0 14px 50px rgba(80,30,60,.6)' });
      const k0 = key(hud, `NOT <span style="color:${G.r}">WORRIED</span>`, 960, 120, 120, '#fff', X.T0 + tWorr, X.T0 + tBec, { align: 'center', css: 'text-shadow:0 14px 50px rgba(80,30,60,.6)' });
      sfx('boom', X.T0 + tRun, 0.4); sfx('chime', X.T0 + tRun + 0.2, 0.6);
      d.on((T, lt) => {
        const t = tBreath + lt;
        sun.style.transform = `translateY(${(200 - 200 * S.E.outCubic(S.seg(t, tBreath, tNext + 2))).toFixed(0)}px)`;
        const walk = t < tNext ? (t - tBreath) * 7 : undefined, wx = t < tNext ? -500 + (t - tBreath) / (tNext - tBreath) * 500 : 0;
        f.set({ walk, x: 960 + wx, pose: t > tRun ? 'cheer' : 'phone', face: t > tRun ? 'happy' : 'smile', talk: t > tNext && t < tRun, look: t > tRun ? [0, -0.6] : [0, 0.4] }, T, lt);
        cast.forEach((a, i) => { const on = S.E.outCubic(S.seg(t, tRun - 0.4 + Math.abs(i - 4.5) * 0.08, tRun + 0.3 + Math.abs(i - 4.5) * 0.08));
          a.el.style.opacity = on.toFixed(2); a.set({ y: 990 + (1 - on) * 60, pose: t > tRun + 0.8 ? 'cheer' : 'idle', face: 'happy' }, T, lt); });
        k0(T); k1(T); k2(T);
      });
    } });
  // ---------- F3: Fahim signs off ----------
  shots.push({ t0: tIam - 0.2, t1: tStarted - 0.2, fadeIn: 0.6,
    camPath: path([[0, 260, -60, 1.35, 0.3], [(tStarted - tIam) * 0.5, 120, -20, 1.2, 0], [tStarted - tIam, -40, 0, 1.08, -0.3]]),
    build(d) {
      d.L(6, K.sky('#0a0c16,#1b1f33 60%,#090a12') + K.rad(700, 480, 1200, 1000, 'rgba(66,133,244,.25)') + K.rad(1300, 700, 900, 700, 'rgba(234,67,53,.18)'));
      d.L(4, K.motes(931, 50, [G.b, G.r, G.y, G.g], 0, 0, 1920, 1080, 4));
      const A = d.L(1.2);
      const f = actor(A, { id: 'fs', x: 700, y: 1300, h: 1150, pose: 'wave', face: 'happy', look: [0.2, -0.1], rim: G.y, rim2: G.b });
      const hud = d.hud();
      const tC = w('Comment the word').s, tF = w('Fahim').s, tCh = w('this channel').s;
      const name = el(hud, `<div class="fl-a" style="left:1150px;top:300px;opacity:0"><div class="fl-t" style="position:relative;font-size:150px">FAHIM</div><div style="height:10px;width:520px;margin-top:20px;background:linear-gradient(90deg,${G.b} 25%,${G.r} 25% 50%,${G.y} 50% 75%,${G.g} 75%)"></div><div class="fl-t" style="position:relative;margin-top:26px;font-size:48px;color:#c9d1e0;font-weight:800">AI that works for your career</div></div>`);
      const box = el(hud, `<div class="fl-a" style="left:1150px;top:620px;padding:24px 44px;border-radius:28px;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.5);opacity:0"><span class="fl-t gw" style="position:relative;font-size:120px;letter-spacing:-3px"></span></div>`);
      const gw = box.querySelector('.gw');
      sfx('pop', X.T0 + tF, 0.4); for (let i = 0; i < 6; i++) sfx('key', X.T0 + tC + 0.7 + i * 0.09, 0.3);
      d.on((T, lt) => {
        const t = tIam - 0.2 + lt, a = S.E.outCubic(S.seg(t, tF, tF + 0.6));
        name.style.opacity = a.toFixed(2); name.style.transform = `translateY(${((1 - a) * 40 - S.seg(t, tC - 0.4, tC) * 0).toFixed(0)}px)`;
        const b = S.E.outBack(S.seg(t, tC + 0.3, tC + 0.8)); box.style.opacity = Math.min(1, b * 1.5).toFixed(2); box.style.transform = `scale(${(0.6 + 0.4 * b).toFixed(3)})`;
        const n = Math.floor(S.clamp((t - tC - 0.7) / 0.09, 0, 7)); gw.innerHTML = K.gword('AI JOBS'.slice(0, n));
        f.set({ talk: true, pose: t < tCh ? 'wave' : t > tC ? 'point' : 'present', look: t > tC ? [0.9, 0.1] : [0.2, -0.1] }, T, lt);
      });
    } });
  // ---------- F4: the road at dawn, all ten monoliths turned green; end card ----------
  shots.push({ t0: tStarted - 0.2, t1: DUR, fadeIn: 0.8,
    camPath: path([[0, 0, 300, 2.2, 0], [(tEndV - tStarted) * 0.6, 0, 100, 1.3, 0], [tEndV - tStarted + 0.5, 0, -40, 0.95, 0], [DUR - tStarted, 0, -60, 0.9, 0]]),
    build(d) {
      d.L(12, K.sky('#1a2350 0%,#5a4a9a 36%,#f0907a 55%,#ffd9a0 60%,#2a2238 61%,#120e1a') + `<div class="fl-a" style="left:760px;top:420px;width:400px;height:300px;border-radius:50%;background:radial-gradient(ellipse,#fff3c4,rgba(255,220,150,0) 70%)"></div>`);
      d.L(4, `<svg class="fl-a" style="left:-1000px;top:0;width:3920px;height:1080px" viewBox="-1000 0 3920 1080"><path d="M935 650 L985 650 L2400 1400 L-480 1400Z" fill="#241a2e"/><path d="M958 652 L962 652 L990 1400 L930 1400Z" fill="${G.y}" opacity=".85"/></svg>`);
      const mons = [];
      for (let i = 9; i >= 0; i--) {
        const k = i % 2 ? 1 : -1, sc = 1 / (1 + i * 0.42), wd = 130 * sc, h = 430 * sc, yb = 660 + 330 * sc, xo = 70 + 560 * sc, x = k > 0 ? 960 + xo : 960 - xo - wd;
        const Lm = d.L(1 / sc, `<div class="fl-a mon" style="left:${x}px;top:${yb - h}px;width:${wd}px;height:${h}px;background:linear-gradient(180deg,${K.GC[i % 4]},#0a0a12 130%);box-shadow:0 0 ${70 * sc}px ${K.GC[i % 4]};border-radius:${8 * sc}px">${K.num(String(i + 1).padStart(2, '0'), 0, 18 * sc, 62 * sc, '#fff').replace('left:0px', 'left:0;right:0;text-align:center')}</div>`);
        mons[i] = Lm.querySelector('.mon');
      }
      const A = d.L(1.3);
      const f = actor(A, { id: 'fr', x: 960, y: 1015, h: 320, face: 'happy', look: [0, -0.6], rim: '#ffd27a', rim2: G.b });
      const hud = d.hud();
      const tPivot = w('clear career pivot').s, tPr = w('exact prompts').s, tTon = w('tonight').s;
      const k1 = key(hud, `<span style="color:${G.g}">10</span> NEW ROLES`, 960, 110, 120, '#fff', X.T0 + tPivot, X.T0 + tEndV + 0.2, { align: 'center' });
      const k2 = key(hud, `+ THE <span style="color:${G.b}">PROMPTS</span>`, 960, 250, 100, '#fff', X.T0 + tPr, X.T0 + tEndV + 0.2, { align: 'center' });
      const k3 = key(hud, `START <span style="color:${G.y}">TONIGHT.</span>`, 960, 160, 150, '#fff', X.T0 + tTon - 0.1, null, { align: 'center', css: 'text-shadow:0 14px 60px rgba(0,0,0,.5)' });
      const end = el(hud, `<div class="fl-a" style="left:0;right:0;top:420px;text-align:center;opacity:0"><div class="fl-t" style="position:relative;font-size:64px;font-weight:800;color:#e8eaed;letter-spacing:4px">10 JOBS · 10 NEW ROLES · 1 CAREER</div><div style="margin:24px auto 0;height:8px;width:620px;background:linear-gradient(90deg,${G.b} 25%,${G.r} 25% 50%,${G.y} 50% 75%,${G.g} 75%)"></div></div>`);
      sfx('chime', X.T0 + tTon, 0.6); sfx('boom', X.T0 + tEndV + 0.5, 0.35);
      d.on((T, lt) => {
        const t = tStarted - 0.2 + lt;
        mons.forEach((m, i) => { const g = S.seg(t, tPivot + i * 0.15, tPivot + 0.4 + i * 0.15); if (g > 0) { m.style.background = `linear-gradient(180deg,${G.g},#0a0a12 130%)`; m.style.boxShadow = `0 0 ${(40 + 60 * g).toFixed(0)}px ${G.g}`; } });
        f.set({ walk: t > tPivot && t < tEndV ? (t - tPivot) * 7 : undefined, pose: t > tTon ? 'cheer' : 'idle', face: 'happy', s: 1 - 0.35 * S.seg(t, tPivot, tEndV) , y: 1015 - 60 * S.seg(t, tPivot, tEndV) }, T, lt);
        end.style.opacity = S.seg(t, tEndV + 0.8, tEndV + 1.6).toFixed(2);
        k1(T); k2(T); k3(T);
      });
    } });
  FILM.section('finale', shots);
})();
