// JOB 08: Paralegal / Legal Research Assistant -> Legal Operations Manager / AI Compliance Specialist (Zara)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 8, color: G.y, color2: G.g, title: ['PARALEGAL &', 'LEGAL RESEARCH'], oldCast: 'zara_old', newCast: 'zara_new',
    threats: [
      { // a tower of 10,000 pages, scanned in under a minute
        cam: (J, t0, t1) => path([[0, 0, -420, 1.3, 0], [(t1 - t0) * 0.45, 0, -160, 1.15, 0.2], [t1 - t0, 0, 80, 1.0, -0.2]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#0c0a05,#1f1a0e 50%,#080603') + K.rad(1180, 300, 900, 1500, 'rgba(251,188,5,.18)'));
          d.L(5, K.motes(808, 50, 'rgba(255,230,160,.7)', 0, -400, 1920, 1500, 3));
          let tower = ''; for (let i = 0; i < 90; i++) { const risky = i % 11 === 4; tower += `<div class="fl-a pg${risky ? ' risky' : ''}" style="left:${1000 + (S.hash(i) * 30 - 15)}px;top:${900 - i * 13}px;width:360px;height:12px;border-radius:2px;background:${i % 2 ? '#f1ece2' : '#e3dccf'};box-shadow:0 2px 0 rgba(0,0,0,.25)"></div>`; }
          const Tw = d.L(1.5, tower + `<div class="fl-a scan" style="left:940px;top:0;width:480px;height:14px;background:${G.g};box-shadow:0 0 30px ${G.g},0 0 80px ${G.g}"></div>`);
          const scan = Tw.querySelector('.scan'), risky = [...Tw.querySelectorAll('.risky')];
          const A = d.L(1.2, '');
          const za = actor(A, Object.assign({ id: 'j8a', x: 560, y: 1060, h: 700, face: 'sad', look: [0.2, 0.6], rim: '#ffd27a', rim2: G.y }, J.oldCast));
          el(A, P.page(560, 640, 1.1, 'rd'));
          const rd = A.querySelector('.rd');
          const hud = d.hud();
          const t30 = J.w('30 hours a week', t0).S, t10k = J.w('10 ,000 pages', t0).S, tMin = J.w('under a minute', t0).S, tRisk = J.w('risky clause', t0).S;
          const k1 = key(hud, `<span style="color:${G.y}">30</span> HOURS A WEEK`, 110, 90, 110, '#fff', t30, t10k - 0.2);
          const cnt = el(hud, `<div class="fl-t" style="left:110px;top:90px;font-size:110px;color:#fff"></div>`);
          const k3 = key(hud, `UNDER <span style="color:${G.g}">A MINUTE</span>`, 110, 220, 96, '#fff', tMin, null);
          sfx('beam', t10k, 0.4); risky.forEach((r, i) => sfx('error', tRisk + i * 0.3, 0.18));
          d.on((T, lt) => {
            const sc = S.seg(T, t10k, tMin + 1.0); scan.style.transform = `translateY(${(900 - sc * 1200).toFixed(0)}px)`; scan.style.opacity = sc > 0 && sc < 1 ? 1 : 0;
            risky.forEach((r, i) => { const on = T > tRisk + i * 0.3; r.style.background = on ? G.r : ''; r.style.boxShadow = on ? `0 0 24px ${G.r}` : '0 2px 0 rgba(0,0,0,.25)'; });
            const c = S.E.outCubic(S.seg(T, t10k, t10k + 1.5)); cnt.innerHTML = T >= t10k ? `<span style="color:${G.b}">${Math.round(c * 10000).toLocaleString('en-US')}</span> PAGES` : ''; cnt.style.opacity = T >= t10k ? 1 : 0;
            rd.style.transform = `rotate(${(Math.sin(lt * 0.8) * 3).toFixed(1)}deg)`;
            za.set({ face: T > t10k ? 'shocked' : 'sad', look: T > t10k ? [0.9, -0.7] : [0.2, 0.6] }, T, lt);
            k1(T); k3(T);
          });
        } },
    ],
    pivot: { role: ['LEGAL OPS', 'MANAGER'], roleAt: 'legal operations manager', color: G.g, bg: '#03100a,#0a2a1a 60%,#020805', pose: 'present',
      props(d, flip) {
        const x0 = flip ? 200 : 1180;
        const L = d.L(1.6, P.shield(x0 + 120, 560, 1.2, G.g, 'sh') + Array.from({ length: 6 }, (_, i) => P.page(0, 0, 0.6, 'op')).join(''));
        const ops = [...L.querySelectorAll('.op')];
        return (T, lt) => ops.forEach((p, i) => { const a = lt * 0.7 + i * 1.047; p.style.transform = `translate(${(x0 + 240 + Math.cos(a) * 300 - 45).toFixed(0)}px,${(730 + Math.sin(a) * 140 - 60).toFixed(0)}px)`; p.style.zIndex = Math.sin(a) > 0 ? 3 : 0; });
      } },
    prompt: { title: 'AI usage policy', key: `OPEN <span style="color:${G.y}">ChatGPT</span>`, size: 34,
      hi: { legal: G.y, operations: G.y, director: G.y, paralegal: G.b, compliance: G.g, five: G.r, biggest: G.r, data: G.r, privacy: G.r, risks: G.r, client: G.b, files: G.b, policy: G.g, usage: G.g, interviews: G.b } },
  });
})();
