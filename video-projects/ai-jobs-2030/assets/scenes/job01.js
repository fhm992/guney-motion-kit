// JOB 01: Data Entry Clerk -> Data Quality Analyst (Priya)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE;
  const doc = (kind, x, y, s = 1) => {
    const col = kind === 'PDF' ? G.r : kind === 'RECEIPT' ? G.y : G.b;
    return `<div class="fl-a doc" style="left:${x}px;top:${y}px;width:${150 * s}px;height:${196 * s}px;background:#f6f4ef;border-radius:${8 * s}px;box-shadow:0 14px 30px rgba(0,0,0,.45);padding:${14 * s}px;box-sizing:border-box">
      <div style="height:${22 * s}px;width:60%;background:${col};border-radius:4px"></div>
      ${[0, 1, 2, 3, 4].map((i) => `<div style="height:${8 * s}px;width:${(50 + ((i * 37) % 45))}%;background:#cfd3da;border-radius:4px;margin-top:${12 * s}px"></div>`).join('')}
      <div style="position:absolute;right:${10 * s}px;bottom:${10 * s}px;font:900 ${18 * s}px Figtree;color:${col}">${kind}</div></div>`;
  };
  JOB.make({
    n: 1, color: G.b, color2: G.g, title: ['DATA ENTRY', 'CLERK'], oldCast: 'priya_old', newCast: 'priya_new',
    threats: [
      { // documents ride a conveyor through the AI scanner into the database
        cam: (J, t0, t1) => path([[0, -380, 150, 1.5, 0.5], [(t1 - t0) * 0.5, 0, 110, 1.38, 0], [t1 - t0, 380, 120, 1.48, -0.4]]),
        build(d, J, t0, t1) {
          const T0 = J.X.T0;
          d.L(6, K.sky('#06101c,#0b1a2e 60%,#05080e') + K.rad(1180, 470, 1200, 700, 'rgba(66,133,244,.28)'));
          d.L(4, `<div class="fl-a" style="left:-200px;top:620px;width:2400px;height:12px;background:repeating-linear-gradient(90deg,#1e3354 0 60px,#0f1c30 60px 120px)"></div>` + K.motes(31, 40, 'rgba(138,180,248,.8)', 0, 0, 1920, 1080, 3));
          const belt = d.L(1.6, K.box(-400, 760, 2700, 46, 'linear-gradient(180deg,#2b3446,#141a26)', 'border-radius:23px') + K.floor(806, '#0b1220', '#05080e'));
          // scanner arch and beam
          const arch = d.L(1.5, `<div class="fl-a" style="left:880px;top:420px;width:260px;height:390px;border:22px solid #2a3550;border-bottom:none;border-radius:40px 40px 0 0;box-shadow:0 0 40px rgba(66,133,244,.4)"></div>
            <div class="fl-a beam" style="left:902px;top:442px;width:216px;height:350px;background:linear-gradient(90deg,transparent,rgba(52,168,83,.55),transparent)"></div>
            <div class="fl-a" style="left:950px;top:380px;width:120px;height:40px;border-radius:20px;background:#0c1424;border:2px solid ${G.g};font:800 22px Figtree;color:${G.g};text-align:center;line-height:40px">AI OCR</div>`);
          const beam = arch.querySelector('.beam');
          // database cylinder
          const db = d.L(1.5, `<div class="fl-a" style="left:1560px;top:400px;width:260px;height:420px">${[0, 1, 2, 3].map((i) => `<div class="disc" style="position:absolute;left:0;top:${i * 96}px;width:260px;height:110px;border-radius:50%/40px;background:linear-gradient(180deg,#2d5bd8,#173a8f);box-shadow:inset 0 10px 0 rgba(255,255,255,.18),0 0 40px rgba(66,133,244,.45)"></div>`).join('')}</div>`);
          const discs = [...db.querySelectorAll('.disc')];
          const docs = d.L(1.5, ['INVOICE', 'RECEIPT', 'PDF', 'INVOICE', 'PDF', 'RECEIPT', 'INVOICE', 'PDF'].map((k, i) => doc(k, 0, 560, 1)).join(''));
          const ds = [...docs.querySelectorAll('.doc')];
          const nums = d.L(1.4, Array.from({ length: 18 }, (_, i) => `<div class="fl-t num" style="left:0;top:0;font-family:'JetBrains Mono';font-weight:700;font-size:30px;color:${K.GC[i % 4]}">${['$1,240', '04/11', '#A-552', '$86.10', '0098', '$12k', 'Q3', '7.5%', 'TX-19'][i % 9]}</div>`).join(''));
          const ns = [...nums.querySelectorAll('.num')];
          const A = d.L(1.15, K.box(40, 820, 620, 300, 'linear-gradient(180deg,#1d2433,#0b0f17)', 'border-radius:8px;border-top:5px solid #2e3850'));
          const pr = actor(A, Object.assign({ id: 'j1a', x: 330, y: 1100, h: 640, pose: 'type', face: 'worried', look: [0.9, -0.2], rim: '#8ab4f8', rim2: G.b }, J.oldCast));
          el(A, K.box(10, 880, 680, 260, 'linear-gradient(180deg,#151b28,#06080d)', 'border-radius:8px'));
          const hud = d.hud();
          const ks = J.w('in seconds', t0).S, kt = J.w('typos', t0).S;
          const k1 = key(hud, `IN <span style="color:${G.g}">SECONDS</span>`, 1840, 110, 120, '#fff', ks, null, { align: 'right' });
          const k2 = key(hud, `<span style="color:${G.r}">0</span> TYPOS`, 1840, 240, 120, '#fff', kt, null, { align: 'right' });
          sfx('beam', J.T(t0) + 1.0, 0.35); sfx('paper', J.T(t0) + 0.3, 0.4); sfx('data', J.T(t0) + 3.0, 0.3);
          d.on((T, lt) => {
            const sp = 330; // px per second along the belt
            ds.forEach((n, i) => {
              const x = -260 + ((lt * sp + i * 300) % 2400);
              const inS = S.seg(x, 840, 1000), past = x > 1000;
              n.style.transform = `translate(${x.toFixed(0)}px,${(past ? -20 : 0)}px) rotate(${((i % 3) - 1) * 4}deg) scale(${past ? (1 - S.seg(x, 1000, 1500) * 0.9).toFixed(3) : 1})`;
              n.style.opacity = past ? (1 - S.seg(x, 1250, 1500)).toFixed(3) : '1';
              n.style.filter = inS > 0 && !past ? `brightness(${1 + inS * 0.6}) hue-rotate(${inS * 60}deg)` : 'none';
            });
            ns.forEach((n, i) => { const p = ((lt * 0.55 + i / ns.length) % 1); const x = 1080 + p * 560, y = 560 - Math.sin(p * Math.PI) * 220 + (i % 3) * 30;
              n.style.transform = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) scale(${(1 - p * 0.4).toFixed(2)})`; n.style.opacity = (Math.sin(p * Math.PI)).toFixed(2); });
            beam.style.opacity = (0.55 + 0.45 * Math.sin(lt * 9)).toFixed(2);
            discs.forEach((c, i) => c.style.filter = `brightness(${(1 + 0.35 * Math.max(0, Math.sin(lt * 6 - i))).toFixed(2)})`);
            pr.set({ look: [0.9, -0.2 + 0.1 * Math.sin(lt)] , face: T > kt ? 'sad' : 'worried' }, T, lt);
            k1(T); k2(T);
          });
        } },
      { from: 'Because AI never', // 4 PM, 500 rows, the tireless AI orb, typing roles cut
        cam: (J, t0, t1) => path([[0, 220, -40, 1.0, -0.4], [(t1 - t0) * 0.6, 60, 0, 1.14, 0], [t1 - t0, -120, 30, 1.3, 0.4]]),
        build(d, J, t0, t1) {
          d.L(6, K.sky('#3a2418,#5a3420 50%,#2a1a12') + `<div class="fl-a" style="left:1100px;top:70px;width:660px;height:480px;padding:20px;background:#2a1a10">${Array.from({ length: 14 }, () => '<div style="height:22px;margin-bottom:12px;background:rgba(255,190,100,.85)"></div>').join('')}</div>`);
          d.L(3, K.rays(1300, 300, 6, 1500, 30, 150, 6, 'rgba(255,180,90,.35)', 0.8));
          const clock = d.L(2.6, `<div class="fl-a" style="left:880px;top:80px;width:180px;height:180px;border-radius:50%;background:#f4efe6;border:12px solid #3a2a1e;box-shadow:0 10px 40px rgba(0,0,0,.5)"><div class="hh" style="position:absolute;left:84px;top:40px;width:12px;height:52px;background:#222;border-radius:6px;transform-origin:6px 50px"></div><div class="mh" style="position:absolute;left:86px;top:18px;width:8px;height:74px;background:#555;border-radius:4px;transform-origin:4px 72px"></div></div>`);
          const hh = clock.querySelector('.hh'), mh = clock.querySelector('.mh');
          let rows = ''; for (let i = 0; i < 16; i++) rows += `<div class="row" style="display:flex;gap:4px;margin:5px">${Array.from({ length: 6 }, (_, j) => `<div style="flex:1;height:11px;background:${j ? '#2c6b3f' : '#3e8e55'}"></div>`).join('')}</div>`;
          const mon = d.L(1.6, `<div class="fl-a" style="left:540px;top:330px;width:440px;height:330px;background:#141820;border-radius:16px;border:12px solid #22262f;overflow:hidden"><div class="rows">${rows}${rows}${rows}</div></div><div class="fl-a" style="left:730px;top:665px;width:60px;height:80px;background:#22262f"></div>`);
          const rowsEl = mon.querySelector('.rows');
          // the AI orb never gets tired
          const orb = d.L(1.4, `<div class="fl-a orb" style="left:1080px;top:340px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,${G.b} 45%,#0b2a6a);box-shadow:0 0 60px ${G.b},0 0 140px rgba(66,133,244,.6)"><div style="position:absolute;left:30px;top:44px;width:16px;height:22px;border-radius:8px;background:#fff"></div><div style="position:absolute;left:72px;top:44px;width:16px;height:22px;border-radius:8px;background:#fff"></div></div>`);
          const orbEl = orb.querySelector('.orb');
          let paper = ''; [[200, 380], [370, 520], [1390, 460], [1560, 300]].forEach(([x, h], s) => { for (let i = 0; i < h; i += 14) paper += `<div class="fl-a" style="left:${x + (S.hash(s * 99 + i) * 14 - 7)}px;top:${800 - i}px;width:150px;height:12px;background:${i % 28 ? '#f1ece2' : '#e3dccf'};border-radius:2px;box-shadow:0 2px 0 rgba(0,0,0,.25)"></div>`; });
          const A = d.L(1.2);
          const pr = actor(A, Object.assign({ id: 'j1b', x: 960, y: 1240, h: 960, pose: 'type', face: 'sad', look: [-0.6, -0.5], rim: '#ffb060', rim2: '#ffb060' }, J.oldCast));
          el(A, K.box(-300, 800, 2500, 400, 'linear-gradient(180deg,#4a2c1a,#1b100a)') + paper);
          const hud = d.hud();
          const t4 = J.w('4 in the afternoon', t0).S, t500 = J.w('500 rows', t0).S, tCut = J.w('cutting', t0).S;
          const k1 = key(hud, `<span style="color:${G.y}">4:00</span> PM`, 110, 110, 120, '#fff', t4, t500 - 0.2);
          const k2 = key(hud, `<span style="color:${G.g}">500</span> ROWS`, 110, 110, 120, '#fff', t500, tCut - 0.3);
          const k3 = key(hud, `TYPING ROLES <span style="color:${G.r}">CUT FIRST</span>`, 110, 110, 110, '#fff', tCut, null);
          const strike = el(hud, `<div class="fl-a" style="left:100px;top:170px;width:0;height:12px;background:${G.r};box-shadow:0 0 20px ${G.r}"></div>`);
          sfx('tick', t4, 0.4); sfx('stamp', tCut + 0.3, 0.7); sfx('glitch', tCut + 0.2, 0.4);
          d.on((T, lt) => {
            const t = t0 + lt;
            rowsEl.style.transform = `translateY(${(-(lt * 90) % 352).toFixed(1)}px)`;
            const tod = 15.9 + lt * 0.012; hh.style.transform = `rotate(${(tod % 12) * 30}deg)`; mh.style.transform = `rotate(${(tod * 360 * 6) % 360}deg)`;
            orbEl.style.transform = `translateY(${(Math.sin(lt * 2.2) * 18).toFixed(1)}px) scale(${(1 + 0.05 * Math.sin(lt * 5)).toFixed(3)})`;
            strike.style.width = (S.E.outCubic(S.seg(T, tCut + 0.25, tCut + 0.6)) * 700).toFixed(0) + 'px';
            pr.set({ face: T > tCut ? 'worried' : 'sad', look: T > t500 ? [0.9, -0.3] : [-0.6, -0.5], blink: 0 }, T, lt);
            k1(T); k2(T); k3(T);
          });
        } },
    ],
    pivot: { role: ['DATA QUALITY', 'ANALYST'], roleAt: 'data quality analyst', color: G.g, bg: '#04100f,#0a2622 60%,#04080a', pose: 'point',
      props(d, flip) {
        let g = ''; for (let i = 0; i < 7; i++) for (let j = 0; j < 8; j++) { const bad = (i === 2 && j === 5) || (i === 5 && j === 2); g += `<div class="fl-a cell${bad ? ' bad' : ''}" style="left:${j * 108}px;top:${i * 68}px;width:100px;height:60px;border-radius:8px;background:rgba(66,133,244,.18);border:1px solid rgba(138,180,248,.45)"></div>`; }
        const x0 = flip ? 60 : 1000;
        const L = d.L(1.6, `<div class="fl-a grid" style="left:${x0}px;top:520px;width:870px;height:480px;transform:perspective(1200px) rotateX(48deg) rotateZ(${flip ? 10 : -10}deg)">${g}</div>
          <div class="fl-a mag" style="left:${x0 + 480}px;top:560px;width:190px;height:190px;border-radius:50%;border:16px solid #e8eaed;box-shadow:0 0 40px rgba(255,255,255,.4),inset 0 0 50px rgba(52,168,83,.4)"><div style="position:absolute;left:150px;top:160px;width:36px;height:140px;background:#3c4043;border-radius:18px;transform:rotate(-40deg)"></div></div>`);
        const cells = [...L.querySelectorAll('.cell')], mag = L.querySelector('.mag');
        return (T, lt) => {
          cells.forEach((c, k) => { const bad = c.classList.contains('bad'); const on = (lt * 3 + k * 0.37) % 7 < 0.4;
            c.style.background = bad ? `rgba(234,67,53,${(0.55 + 0.35 * Math.sin(lt * 6)).toFixed(2)})` : on ? 'rgba(52,168,83,.6)' : 'rgba(66,133,244,.18)';
            c.style.boxShadow = bad ? '0 0 30px #EA4335' : 'none'; });
          mag.style.transform = `translate(${(Math.sin(lt * 0.7) * 120 - 60).toFixed(0)}px,${(Math.cos(lt * 0.5) * 50 + 40).toFixed(0)}px)`;
        };
      } },
    prompt: { title: 'Data audit practice', key: `OPEN <span style="color:${G.b}">ChatGPT</span>`, outro: 'Practice that workflow', outroKey: `PRACTICE <span style="color:${G.y}">3×</span> THIS WEEK`,
      hi: { senior: G.y, data: G.y, analyst: G.y, '20': G.b, messy: G.b, missing: G.r, duplicate: G.r, formatting: G.r, five: G.g, audit: G.g, automated: G.b, check: G.b } },
  });
})();
