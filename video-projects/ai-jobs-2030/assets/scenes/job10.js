// JOB 10: Appointment Setter & Telemarketer -> Account Executive / Revenue Operations (Ray)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 10, color: G.r, color2: G.g, title: ['APPOINTMENT SETTER', '& TELEMARKETER'], oldCast: 'ray_old', newCast: 'ray_new',
    threats: [
      { // AI callers dial thousands of leads and book the calendar
        cam: (J, t0, t1) => path([[0, -240, 0, 1.3, -0.3], [(t1 - t0) * 0.5, 0, 0, 1.1, 0], [t1 - t0, 220, 20, 1.02, 0.3]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#100406,#280c12 60%,#080203') + K.rad(1200, 480, 1500, 1000, 'rgba(234,67,53,.2)'));
          let grid = ''; for (let i = 0; i < 40; i++) grid += `<div class="fl-a ph" style="left:${820 + (i % 8) * 120}px;top:${170 + Math.floor(i / 8) * 120}px;width:90px;height:90px;border-radius:50%;background:#1d2230;border:3px solid #3a4152;font:900 40px Figtree;color:#fff;text-align:center;line-height:88px">☎</div>`;
          const Gr = d.L(1.6, grid + P.calendar(1520, 760, 0.9, 'cal')); const phs = [...Gr.querySelectorAll('.ph')], cal = Gr.querySelector('.cal');
          const A = d.L(1.2);
          const ry = actor(A, Object.assign({ id: 'j10a', x: 400, y: 1100, h: 760, pose: 'call', face: 'talk', look: [0.6, -0.1], rim: '#ff8a80', rim2: G.r }, J.oldCast));
          el(A, `<div class="fl-a" style="left:80px;top:860px;width:300px;height:200px;background:#f6f4ef;border-radius:6px;transform:rotate(-6deg);padding:20px;box-sizing:border-box"><div style="font:900 26px Figtree;color:${G.r}">COLD SCRIPT</div>${[0, 1, 2, 3].map(() => '<div style="height:8px;background:#cfd3da;border-radius:4px;margin-top:14px"></div>').join('')}</div>`);
          const hud = d.hud();
          const tD = J.w('dial thousands', t0).S, tB = J.w('book calendar links', t0).S, tO = J.w('handle basic objections', t0).S;
          const cnt = el(hud, `<div class="fl-t" style="left:1840px;top:780px;font-size:100px;color:#fff;transform:translateX(-100%)"></div>`);
          const k2 = key(hud, `<span style="color:${G.g}">AUTO-BOOKED</span>`, 110, 90, 110, '#fff', tB, null);
          for (let i = 0; i < 10; i++) sfx('ring', tD + i * 0.2, 0.08, (i % 2) * 0.8 - 0.4);
          sfx('ping', tB + 0.2, 0.4);
          d.on((T, lt) => {
            phs.forEach((p, i) => { const on = T > tD + (i % 13) * 0.08 && ((lt * 3 + i * 0.37) % 2) < 1.2; p.style.borderColor = on ? G.g : '#3a4152'; p.style.boxShadow = on ? `0 0 24px ${G.g}` : 'none'; p.style.transform = on ? `rotate(${(Math.sin(lt * 40 + i) * 8).toFixed(0)}deg)` : 'none'; });
            const c = S.E.outCubic(S.seg(T, tD, tD + 5)); cnt.innerHTML = T > tD ? `<span style="color:${G.r}">${Math.round(c * 10000).toLocaleString('en-US')}</span> LEADS` : ''; cnt.style.opacity = T > tD ? 1 : 0;
            cal.querySelectorAll('.cal').forEach((n, i) => n.style.background = T > tB + i * 0.08 ? K.GC[i % 4] : 'rgba(0,0,0,.08)');
            ry.set({ face: T > tO ? 'worried' : 'talk', open: 0.3 + 0.3 * Math.abs(Math.sin(lt * 7)) }, T, lt);
            k2(T);
          });
        } },
    ],
    pivot: { role: ['ACCOUNT', 'EXECUTIVE'], roleAt: 'full -cycle account executive', color: G.g, bg: '#031008,#0a2a14 60%,#020804', pose: 'present',
      props(d, flip) {
        const x0 = flip ? 90 : 1060;
        const L = d.L(1.6, `<div class="fl-a" style="left:${x0}px;top:540px;width:700px;height:430px;border-radius:24px;background:#1f1f1e;border:2px solid #3a3a38;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6)"><div style="height:46px;background:#2a2a28"></div><div class="vc" style="position:absolute;left:0;top:46px;width:700px;height:384px;background:radial-gradient(circle at 50% 40%,#2b3a5a,#101626)"></div></div>
          <div class="fl-a stamp" style="left:${x0 + 120}px;top:880px;padding:16px 36px;border:8px solid ${G.g};border-radius:16px;font:900 64px Figtree;color:${G.g};transform:rotate(-8deg);background:rgba(0,0,0,.4)">DEAL CLOSED</div>`);
        const vc = L.querySelector('.vc'), stamp = L.querySelector('.stamp');
        const cl = actor(vc, { id: 'cl10', cast: 'boss', x: 350, y: 700, h: 640, pose: 'idle', face: 'smile', look: [0, 0], rim: '#8ab4f8', rim2: G.g });
        return (T, lt) => { cl.set({ face: lt > 3 ? 'happy' : 'talk', open: 0.4 + 0.3 * Math.abs(Math.sin(lt * 6)) }, T, lt);
          const s = S.seg(lt, 3.5, 3.8); stamp.style.opacity = s.toFixed(2); stamp.style.transform = `rotate(-8deg) scale(${(1.8 - 0.8 * S.E.outCubic(s)).toFixed(3)})`; };
      } },
    prompt: { title: 'Revenue builder', key: `TYPE INTO <span style="color:${G.r}">ChatGPT</span>`, size: 32,
      hi: { vice: G.y, president: G.y, sales: G.y, appointment: G.r, setter: G.r, revenue: G.b, operations: G.b, account: G.g, executive: G.g, automated: G.b, outbound: G.b, workflow: G.b, prospects: G.y, company: G.y, news: G.y, personalized: G.g, first: G.g, line: G.g, discovery: G.y, call: G.y, briefing: G.y, sheet: G.y, closer: G.r } },
  });
})();
