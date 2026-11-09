// JOB 05: Manual Software Tester -> AI QA Engineer & Security Auditor (Kofi) + comment CTA
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 5, color: G.b, color2: G.r, title: ['MANUAL', 'SOFTWARE TESTER'], oldCast: 'kofi_old', newCast: 'kofi_new',
    threats: [
      { // click, click, click... then AI agents test a thousand screens overnight
        cam: (J, t0, t1) => {
          const tB = J.w('because AI testing', t0).s - t0;
          return path([[0, -200, 40, 1.45, -0.3], [tB - 0.5, -120, 20, 1.35, 0], [tB + 1.5, 120, -40, 1.0, 0.3], [t1 - t0, 220, -60, 0.92, 0.5]]);
        },
        build(d, J, t0, t1) {
          const tB = J.w('because AI testing', t0).S, t50 = J.w('50 times', t0).S, tOv = J.w('overnight', t0).S;
          const sky = d.L(8, K.sky('#050a14,#0c1730 60%,#04070d') + `<div class="fl-a moon" style="left:1560px;top:120px;width:110px;height:110px;border-radius:50%;background:#f1f3f4;box-shadow:0 0 80px 20px rgba(220,230,255,.45)"></div>`);
          const moon = sky.querySelector('.moon');
          // the wall of screens
          let wall = ''; const kinds = ['phone', 'tablet', 'laptop'];
          for (let i = 0; i < 24; i++) { const k = kinds[i % 3], c = i % 8, r = Math.floor(i / 8); wall += P.device(820 + c * 140 + (r % 2) * 40, 140 + r * 250, k, 0.42, P.loginUI(0.42) + P.check(30, 40, 0.5, G.g, 'ok'), 'sc'); }
          const Wl = d.L(2.4, wall); const scr = [...Wl.querySelectorAll('.sc')];
          const big = d.L(1.5, P.device(520, 240, 'laptop', 1.6, P.loginUI(1.6) + `<div class="fl-a cur" style="left:250px;top:250px;width:0;height:0;border-left:16px solid #fff;border-right:16px solid transparent;border-bottom:26px solid transparent;filter:drop-shadow(0 2px 2px #000)"></div>`, 'bigdev'));
          const bigdev = big.querySelector('.bigdev'), cur = big.querySelector('.cur');
          const A = d.L(1.2);
          const kf = actor(A, Object.assign({ id: 'j5a', x: 340, y: 1180, h: 760, pose: 'type', face: 'focused', look: [0.8, -0.3], rim: '#8ab4f8', rim2: G.b }, J.oldCast));
          el(A, P.desk(20, 900, 1300));
          const hud = d.hud();
          const cnt = el(hud, `<div class="fl-t" style="left:110px;top:90px;font-size:130px;color:#fff"></div>`);
          const k2 = key(hud, `AI TESTS <span style="color:${G.g}">OVERNIGHT</span>`, 1840, 780, 110, '#fff', tOv - 0.3, null, { align: 'right' });
          for (let i = 0; i < 14; i++) sfx('click', J.T(t0) + 0.5 + i * 0.42, 0.3, 0.2);
          sfx('whoosh', tB, 0.5);
          d.on((T, lt) => {
            const nClick = Math.min(50, Math.floor(S.clamp((T - J.T(t0) - 0.5) / 0.42, 0, 99)) * 4 + 1);
            cnt.innerHTML = T < tB ? `CLICK <span style="color:${G.r}">×${nClick}</span>` : ''; cnt.style.opacity = T < tB ? 1 : 0;
            const cl = ((T - J.T(t0) - 0.5) % 0.42) / 0.42; cur.style.transform = `translate(${(Math.sin(lt * 2) * 10).toFixed(0)}px,${(cl < 0.15 ? 4 : 0)}px)`;
            bigdev.style.opacity = (1 - S.seg(T, tB, tB + 1)).toFixed(2);
            moon.style.transform = `translateY(${(200 - 200 * S.E.outCubic(S.seg(T, tB, tB + 3))).toFixed(0)}px)`;
            scr.forEach((s, i) => { P.pop(s, T, tB + 0.3 + (i % 8) * 0.12 + Math.floor(i / 8) * 0.2, 0.6); const ok = s.querySelector('.ok'); ok.style.opacity = T > tB + 1.6 + i * 0.15 ? 1 : 0; });
            kf.set({ face: T > tB ? 'shocked' : 'focused', look: T > tB ? [0.9, -0.6] : [0.8, -0.3], arms: T < tB ? { la: [-30, 85, 'fist'], ra: [30 + (cl < 0.2 ? 8 : 0), -85, 'fist'] } : undefined }, T, lt);
            k2(T);
          });
        } },
    ],
    pivot: { role: ['AI QA', 'ENGINEER'], roleAt: 'AI quality assurance', color: G.r, bg: '#120507,#2a0c12 60%,#080304', pose: 'point',
      props(d, flip) {
        const x0 = flip ? 80 : 1100;
        const L = d.L(1.6, P.device(x0, 560, 'laptop', 1.5, P.loginUI(1.5) + `<svg class="crack" style="position:absolute;inset:0" viewBox="0 0 510 330"><path d="M250 140 L200 60 M250 140 L330 40 M250 140 L420 170 M250 140 L180 260 M250 140 L300 300 M200 60 L150 20 M420 170 L500 160" stroke="#fff" stroke-width="4" fill="none"/></svg>`, 'lap') + P.shield(x0 + 560, 600, 0.7, G.g, 'sh') +
          Array.from({ length: 5 }, (_, i) => `<div class="fl-a bug" style="left:0;top:0;width:40px;height:30px;border-radius:50%;background:${G.r};box-shadow:0 0 14px ${G.r}"></div>`).join(''));
        const bugs = [...L.querySelectorAll('.bug')], crack = L.querySelector('.crack'), sh = L.querySelector('.sh');
        return (T, lt) => {
          crack.style.opacity = S.seg(lt, 2, 2.2).toFixed(2);
          bugs.forEach((b, i) => { const a = lt * 1.5 + i * 1.3; b.style.transform = `translate(${(x0 + 255 + Math.cos(a) * 200).toFixed(0)}px,${(720 + Math.sin(a * 1.3) * 120).toFixed(0)}px)`; b.style.opacity = S.seg(lt, 2.2 + i * 0.3, 2.5 + i * 0.3).toFixed(2); });
          sh.style.transform = `scale(${(0.9 + 0.1 * Math.sin(lt * 2)).toFixed(3)})`;
        };
      } },
    prompt: { title: 'Learn test automation', key: `OPEN <span style="color:${G.b}">ChatGPT</span>`, size: 32,
      hi: { manual: G.r, tester: G.r, test: G.b, automation: G.b, playwright: G.g, simple: G.y, everyday: G.y, metaphors: G.y, beginner: G.g, project: G.g, login: G.r, checkout: G.r, automated: G.b, script: G.b, line: G.y, code: G.y, interview: G.g, questions: G.g } },
  });
})();
