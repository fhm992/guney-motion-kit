// JOB 03: Junior Copywriter -> AI Content Strategist & Brand Editor (Theo)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 3, color: G.y, color2: G.b, title: ['JUNIOR', 'COPYWRITER'], oldCast: 'theo_old', newCast: 'theo_new',
    threats: [
      { // four hours of typing vs 10 drafts in 10 seconds
        cam: (J, t0, t1) => path([[0, -300, 60, 1.25, -0.4], [(t1 - t0) * 0.45, -200, 40, 1.2, 0], [(t1 - t0) * 0.7, 160, 0, 1.08, 0.3], [t1 - t0, 300, -30, 1.15, 0.5]]),
        build(d, J, t0, t1) {
          d.L(6, K.sky('#14100a,#2a1f12 60%,#0c0906') + K.rad(1300, 500, 1200, 900, 'rgba(251,188,5,.18)'));
          d.L(4, K.motes(303, 40, 'rgba(255,220,150,.8)', 0, 0, 1920, 1080, 3));
          // the LLM machine
          const M = d.L(1.6, `<div class="fl-a" style="left:1180px;top:330px;width:520px;height:460px;border-radius:40px;background:linear-gradient(160deg,#3c4250,#1a1d25);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(251,188,5,.25)">
            <div style="position:absolute;left:40px;top:40px;width:440px;height:110px;border-radius:20px;background:#0d1424;box-shadow:inset 0 0 30px rgba(251,188,5,.4)"><div class="fl-t" style="position:relative;left:0;top:28px;width:440px;text-align:center;font-size:54px;color:${G.y}">LLM</div></div>
            <div style="position:absolute;left:60px;top:320px;width:400px;height:30px;border-radius:15px;background:#07090d"></div>
            ${[0, 1, 2].map((i) => `<div class="led" style="position:absolute;left:${90 + i * 60}px;top:200px;width:30px;height:30px;border-radius:50%;background:${K.GC[i]}"></div>`).join('')}</div>`);
          const leds = [...M.querySelectorAll('.led')];
          const pages = d.L(1.4, Array.from({ length: 10 }, (_, i) => P.page(0, 0, 0.9, 'fly')).join(''));
          const fly = [...pages.querySelectorAll('.fly')];
          // hourglass + slow typing
          const H = d.L(1.5, `<div class="fl-a" style="left:640px;top:420px;width:120px;height:200px"><div style="position:absolute;inset:0;background:linear-gradient(180deg,#e9e2d0 0 6%,transparent 6% 94%,#e9e2d0 94%);"></div>
            <div class="sandT" style="position:absolute;left:20px;top:22px;width:80px;height:70px;background:${G.y};clip-path:polygon(0 0,100% 0,55% 100%,45% 100%)"></div>
            <div class="sandB" style="position:absolute;left:20px;bottom:22px;width:80px;height:10px;background:${G.y};clip-path:polygon(45% 0,55% 0,100% 100%,0 100%)"></div></div>`);
          const sandT = H.querySelector('.sandT'), sandB = H.querySelector('.sandB');
          const A = d.L(1.2);
          const th = actor(A, Object.assign({ id: 'j3a', x: 360, y: 1180, h: 760, pose: 'type', face: 'focused', look: [0.6, 0.3], rim: '#ffb060', rim2: G.y }, J.oldCast));
          el(A, P.desk(40, 900, 700, '#2a2016') + `<div class="fl-a" style="left:600px;top:700px;width:300px;height:190px;border-radius:12px;background:#f6f4ef;padding:24px;box-sizing:border-box"><div class="wc fl-t" style="position:relative;font-size:30px;color:#5f6368;font-weight:800">0 / 500 words</div></div>`);
          const wc = A.querySelector('.wc');
          const hud = d.hud();
          const t4h = J.w('four hours', t0).S, t10 = J.w('10 drafts', t0).S, tGen = J.w('large language models', t0).S;
          const k1 = key(hud, `<span style="color:${G.y}">4 HOURS</span> FOR 500 WORDS`, 110, 90, 96, '#fff', t4h, t10 - 0.3);
          const k2 = key(hud, `<span style="color:${G.b}">10</span> DRAFTS IN <span style="color:${G.g}">10</span> SECONDS`, 1840, 90, 96, '#fff', t10, null, { align: 'right' });
          for (let i = 0; i < 10; i++) sfx('paper', tGen + 0.4 + i * 0.28, 0.25, 0.4);
          sfx('machine', tGen, 0.4);
          d.on((T, lt) => {
            const sand = S.seg(T, J.T(t0), t10); sandT.style.transform = `scaleY(${(1 - sand * 0.85).toFixed(3)})`; sandT.style.transformOrigin = '50% 100%'; sandB.style.height = (10 + sand * 60).toFixed(0) + 'px';
            wc.textContent = Math.min(500, Math.floor(S.seg(T, J.T(t0), J.T(t1)) * 140)) + ' / 500 words';
            fly.forEach((p, i) => { const a = tGen + 0.4 + i * 0.28, u = S.clamp((T - a) / 1.4);
              const x = 1300 + u * (-500 - i * 40), y = 560 - Math.sin(u * Math.PI) * 420 + u * (200 + (i % 3) * 60);
              p.style.transform = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) rotate(${(u * (200 + i * 40)).toFixed(0)}deg)`; p.style.opacity = u > 0 ? 1 : 0; });
            leds.forEach((l, i) => l.style.opacity = T > tGen ? (0.4 + 0.6 * ((Math.floor(lt * 8) + i) % 3 === 0)).toFixed(2) : '0.3');
            th.set({ face: T > t10 ? 'shocked' : 'focused', look: T > tGen ? [0.9, -0.3] : [0.5, 0.4] }, T, lt);
            k1(T); k2(T);
          });
        } },
      { from: 'Think of an AI', // the very fast intern
        cam: (J, t0, t1) => path([[0, 0, -120, 1.0, 0.3], [(t1 - t0) * 0.6, 0, 0, 1.12, 0], [t1 - t0, 40, 60, 1.3, -0.3]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#070612,#1a1336 60%,#070612') + K.rad(960, 560, 1400, 900, 'rgba(197,138,249,.25)'));
          const sites = ['news', 'wiki', 'blog', 'shop', 'forum', 'docs', 'video', 'recipes', 'travel', 'sports', 'finance', 'music'];
          const W = d.L(3, sites.map((s, i) => `<div class="fl-a site" style="left:0;top:0;width:200px;height:130px;border-radius:14px;background:#f4f6fa;box-shadow:0 10px 30px rgba(0,0,0,.4);overflow:hidden"><div style="height:26px;background:${K.GC[i % 4]}"></div><div style="padding:12px;font:800 22px Figtree;color:#202124">${s}.com</div><div style="margin:0 12px;height:10px;background:#dfe5ee;border-radius:5px"></div></div>`).join(''));
          const sw = [...W.querySelectorAll('.site')];
          let books = ''; for (let i = 0; i < 16; i++) books += `<div class="fl-a" style="left:${700 + (i % 4) * 130 + (S.hash(i) * 30)}px;top:${820 - Math.floor(i / 4) * 44}px;width:150px;height:40px;border-radius:6px;background:${K.GC[i % 4]};filter:brightness(.8)"></div>`;
          const R = d.L(1.4, books + P.robot(860, 380, 1.2, G.y, 'rb') + `<div class="fl-a bulb" style="left:1180px;top:240px;width:140px;height:140px;border-radius:50%;border:8px dashed rgba(255,255,255,.5)"><div class="fl-t" style="position:relative;left:0;top:28px;width:124px;text-align:center;font-size:80px;color:${G.r}">0</div></div>`);
          const rb = R.querySelector('.rb'), bulb = R.querySelector('.bulb');
          const A = d.L(1.2);
          const th = actor(A, Object.assign({ id: 'j3b', x: 330, y: 1060, h: 640, pose: 'think', face: 'focused', look: [0.9, -0.3], rim: '#c58af9', rim2: G.y }, J.oldCast));
          const hud = d.hud();
          const tI = J.w('very fast intern', t0).S, tZ = J.w('zero original', t0).S;
          const k1 = key(hud, `A VERY <span style="color:${G.y}">FAST INTERN</span>`, 960, 90, 110, '#fff', tI, tZ - 0.2, { align: 'center' });
          const k2 = key(hud, `<span style="color:${G.r}">ZERO</span> ORIGINAL IDEAS`, 960, 90, 110, '#fff', tZ, null, { align: 'center' });
          sfx('glitch', tZ, 0.3);
          d.on((T, lt) => {
            sw.forEach((s, i) => { const a = lt * 0.5 + (i / sw.length) * Math.PI * 2; const x = 960 + Math.cos(a) * 760 - 100, y = 470 + Math.sin(a) * 300 - 65;
              s.style.transform = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) scale(${(0.8 + 0.25 * Math.sin(a)).toFixed(3)})`; s.style.zIndex = Math.sin(a) > 0 ? 2 : 0; });
            rb.style.transform = `translateY(${(Math.sin(lt * 3) * 10).toFixed(1)}px) rotate(${(Math.sin(lt * 1.5) * 4).toFixed(1)}deg)`;
            bulb.style.opacity = S.seg(T, tZ - 0.2, tZ + 0.3).toFixed(2);
            th.set({ face: T > tZ ? 'determined' : 'focused' }, T, lt);
            k1(T); k2(T);
          });
        } },
    ],
    pivot: { role: ['CONTENT', 'STRATEGIST'], roleAt: 'AI content strategist', color: G.y, bg: '#0e0a14,#211a33 60%,#09070e', pose: 'point',
      props(d, flip) {
        const x0 = flip ? 120 : 1180;
        const L = d.L(1.6, P.funnel(x0, 520, 520, 'fn') + `<div class="fl-t" style="left:${x0 + 150}px;top:1000px;font-size:44px;color:${G.g}">BUYERS ✓</div>` + Array.from({ length: 14 }, (_, i) => `<div class="fl-a dot" style="left:0;top:0;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 12px #fff"></div>`).join(''));
        const dots = [...L.querySelectorAll('.dot')];
        return (T, lt) => dots.forEach((n, i) => { const u = ((lt * 0.35 + i / dots.length) % 1); const half = 260 * (1 - u * 0.75);
          n.style.transform = `translate(${(x0 + 260 + Math.sin(i * 7.1) * half * 0.8 - 8).toFixed(0)}px,${(500 + u * 470).toFixed(0)}px)`; n.style.opacity = (Math.sin(u * Math.PI)).toFixed(2); });
      } },
    prompt: { title: 'Content strategy', key: `OPEN <span style="color:${G.y}">Claude</span> OR <span style="color:${G.b}">ChatGPT</span>`, size: 34,
      hi: { chief: G.y, marketing: G.y, officer: G.y, weak: G.r, hooks: G.r, robotic: G.r, phrasing: G.r, missing: G.r, proof: G.g, points: G.g, '30': G.b, content: G.b, calendar: G.b, expert: G.g, interviews: G.g, case: G.g, studies: G.g, seo: G.b, keywords: G.b, fake: G.r } },
  });
})();
