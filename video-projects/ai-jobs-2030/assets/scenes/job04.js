// JOB 04: Basic Bookkeeper -> Fractional Financial Analyst / Cash Flow Advisor (Omar)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 4, color: G.g, color2: G.y, title: ['BASIC', 'BOOKKEEPER'], oldCast: 'omar_old', newCast: 'omar_new',
    threats: [
      { // transactions sort themselves into categories, receipts match, statements reconcile
        cam: (J, t0, t1) => path([[0, 300, 80, 1.3, 0.5], [(t1 - t0) * 0.5, 80, 20, 1.12, 0], [t1 - t0, -220, -20, 1.05, -0.4]]),
        build(d, J, t0, t1) {
          d.L(6, K.sky('#03100a,#0a2618 60%,#030a06') + K.rad(1100, 500, 1500, 900, 'rgba(52,168,83,.2)'));
          d.L(4, K.motes(404, 50, 'rgba(120,220,150,.7)', 0, 0, 1920, 1080, 3));
          const cats = [['FOOD', G.r], ['RENT', G.b], ['TRAVEL', G.y], ['SUPPLIES', G.g]];
          const bins = d.L(1.6, cats.map(([n, c], i) => `<div class="fl-a" style="left:${760 + i * 270}px;top:700px;width:230px;height:200px;border-radius:0 0 26px 26px;border:6px solid ${c};border-top:none;background:linear-gradient(180deg,transparent,${c}33);box-shadow:0 0 30px ${c}55"><div class="fl-t" style="position:relative;top:210px;width:230px;text-align:center;font-size:30px;color:${c}">${n}</div></div>`).join(''));
          const tx = d.L(1.4, Array.from({ length: 16 }, (_, i) => `<div class="fl-a tr" style="left:0;top:0;padding:14px 20px;border-radius:12px;background:#f4f6fa;font:800 24px 'JetBrains Mono';color:#202124;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap"><span style="color:${cats[i % 4][1]}">●</span> ${['-$42.10', '-$1,200', '-$318.00', '-$64.75'][i % 4]}</div>`).join(''));
          const trs = [...tx.querySelectorAll('.tr')];
          const R = d.L(1.5, P.robot(1500, 230, 0.8, G.g, 'rb') + P.calendar(820, 160, 0.9, 'cal'));
          const cal = R.querySelector('.cal');
          const A = d.L(1.2);
          const om = actor(A, Object.assign({ id: 'j4a', x: 380, y: 1080, h: 720, face: 'worried', look: [0.9, -0.2], rim: '#8ae0a8', rim2: G.g }, J.oldCast));
          const hud = d.hud();
          const tAuto = J.w('automatically', t0).S, tFri = J.w('Friday afternoon', t0).S;
          const k1 = key(hud, `<span style="color:${G.g}">AUTOMATIC</span>`, 1840, 80, 120, '#fff', tAuto, tFri - 0.1, { align: 'right' });
          const k2 = key(hud, `NO MORE <span style="color:${G.y}">FRIDAY</span> TYPING`, 1840, 80, 100, '#fff', tFri, null, { align: 'right' });
          for (let i = 0; i < 8; i++) sfx('data', J.T(t0) + 0.8 + i * 1.2, 0.18, 0.3);
          d.on((T, lt) => {
            trs.forEach((n, i) => { const u = ((lt * 0.42 + i / trs.length) % 1); const bx = 790 + (i % 4) * 270;
              const x = u < 0.5 ? -200 + u * 2 * (bx + 200) : bx, y = u < 0.5 ? 470 - Math.sin(u * 2 * Math.PI / 2) * 60 : 470 + (u - 0.5) * 2 * 330;
              n.style.transform = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) scale(${u > 0.5 ? (1 - (u - 0.5) * 1.2).toFixed(3) : 1})`; n.style.opacity = u > 0.9 ? ((1 - u) * 10).toFixed(2) : '1'; });
            const cells = cal.querySelectorAll('.cal'); cells.forEach((c, i) => c.style.background = S.seg(lt, 1 + i * 0.3, 1.2 + i * 0.3) > 0.5 ? K.GC[i % 4] : 'rgba(0,0,0,.08)');
            om.set({ pose: T > tFri ? 'shrug' : 'idle', face: T > tAuto ? 'sad' : 'worried' }, T, lt);
            k1(T); k2(T);
          });
        } },
    ],
    pivot: { role: ['CASH FLOW', 'ADVISOR'], roleAt: 'cash flow advisor', color: G.y, bg: '#0d0c05,#262210 60%,#080703', pose: 'present',
      props(d, flip) {
        const x0 = flip ? 100 : 960;
        const L = d.L(1.6, P.bars(x0, 560, [0.35, 0.5, 0.62, 0.8], [G.g], 80, 30, 380, 'rev') + P.bars(x0 + 440, 560, [0.7, 0.5, 0.32, 0.18], [G.r], 50, 22, 380, 'cash') +
          `<div class="fl-t" style="left:${x0}px;top:960px;font-size:34px;color:${G.g}">REVENUE ↑</div><div class="fl-t" style="left:${x0 + 440}px;top:960px;font-size:34px;color:${G.r}">CASH ↓</div>` +
          Array.from({ length: 6 }, () => `<div class="fl-a drop" style="left:0;top:0;width:18px;height:26px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:${G.y}"></div>`).join(''));
        const drops = [...L.querySelectorAll('.drop')], bars = [...L.querySelectorAll('.bar')];
        return (T, lt) => {
          bars.forEach((b, i) => b.style.transform = `scaleY(${S.E.outCubic(S.seg(lt, 0.3 + i * 0.12, 1.2 + i * 0.12)).toFixed(3)})`);
          drops.forEach((n, i) => { const u = (lt * 0.8 + i / 6) % 1; n.style.transform = `translate(${(x0 + 470 + (i % 3) * 70).toFixed(0)}px,${(800 + u * 160).toFixed(0)}px)`; n.style.opacity = (1 - u).toFixed(2); });
        };
      } },
    prompt: { title: 'Cash flow advisory', key: `TYPE INTO <span style="color:${G.g}">ChatGPT</span>`, size: 34,
      hi: { small: G.y, business: G.y, chief: G.y, financial: G.y, officer: G.y, profit: G.b, loss: G.b, statement: G.b, rising: G.g, revenue: G.g, shrinking: G.r, cash: G.r, flow: G.r, three: G.r, biggest: G.r, money: G.r, leaks: G.r, script: G.b, plain: G.g, english: G.g } },
  });
})();
