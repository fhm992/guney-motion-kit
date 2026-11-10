// @scene s11 54 Beat 11 - The Light
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const ZK = ['zPajama', 'zBasketW', 'zShopper'];
  const freezer = (W, seed) => SH.aisle(W, { seed, mood: 'ice', kind: 'freezer', sign: 'FROZEN', signColor: '#2F7BE8', signZ: 6.5, vignette: 0.3, depth: 7 });
  const frost = (z) => { z.svg.style.filter = 'drop-shadow(0 -4px 0 rgba(255,255,255,.9)) saturate(.5) brightness(1.25)'; };
  // flash pattern for the distant window, in n29-local seconds: on at 3.0; twice; pause; twice again
  const winOn = (u) => { if (u < 2.9) return 0; const f = [[3.6, 3.95], [4.25, 4.6], [6.6, 6.95], [7.25, 7.6]]; if (u < 3.6) return 0.25; for (const [a, b] of f) if (u >= a && u < b) return 1; return u > 8.5 ? 0.55 : 0.12; };
  SH.run('s11', 's11', 54, [
    { // A: for the first time in three days he can just walk - out between the sluggish shoppers
      t0: 0, setup(W) { freezer(W, 41); const zs = ZK.map((k, i) => SH.actor(W, k, { seed: 110 + i })); const bob = SH.actor(W, 'bob'); return { zs, bob, W }; },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [8.4, 960, 560, 1.08]]);
        st.zs.forEach((z, i) => { const sh = SH.shamble(lt, i * 2, 0.15); z.set(Object.assign({}, sh, { x: [560, 1000, 1380][i], y: [1000, 900, 1020][i], scale: [0.72, 0.5, 0.74][i], flip: i === 1, mouth: { open: 0.3, smile: -0.5 }, armL: [60, -20], armR: [70, -20] })); frost(z); });
        const wk = SH.walk(lt, 0.7, 0.6), p = S.seg(lt, 0, 8.4);
        st.bob.set(Object.assign({}, wk, { x: 960 + Math.sin(p * Math.PI * 3) * 160, y: S.lerp(800, 1300, p), scale: S.lerp(0.5, 1.15, p), look: [Math.sin(lt * 1.3) * 0.5, 0], lid: 0.2, browUp: 0.2, mouth: { open: 0, smile: 0.3 }, lean: 0, armL: [10, -10], armR: [10, -10] }));
      } },
    { // B: frozen waffles. "Okay, new plan. We live here."
      t0: 8.4, setup(W) { SH.bokeh(W, { seed: 42, mood: 'ice' }); const bob = SH.actor(W, 'bob'); const wf = PROPS.waffles(W); return { bob, wf, W }; },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 520, 1.15], [12, 960, 560, 1.0]]);
        st.bob.set({ x: 960, y: 1220, scale: 1.0, look: [0, 0.4], lid: 0.3, browUp: 0.5, mouth: SH.mouth(['b15'], { open: 0, smile: 0.7, wide: 0.9 }, { smile: 0.6, amp: 0.4 }), armL: [-20, -125], armR: [-20, -125], headTilt: 6 + Math.sin(lt * 0.7) * 3, blink: TOON.blinkAt(lt, 3.4) });
        st.wf.style.transform = `translate(850px, ${800 + Math.sin(lt) * 4}px) rotate(-6deg)`;
      } },
    { // C: night falls. He climbs a stool and looks through the gap in the front shutters.
      t0: 20.4, setup(W) {
        const lot = SH.canvas(W); PROPS.lot(lot, { seed: 12, lampX: 0.3 });
        const sh = PROPS.shutter(W, -200, -200, 2400, 1500); sh.drop(1);
        const gap = SH.div(W, 'left:620px;top:470px;width:700px;height:70px;background:transparent;box-shadow:0 0 0 3000px rgba(0,0,0,0)');
        sh.style.clipPath = 'polygon(0 0,100% 0,100% 100%,0 100%,0 0,34% 44.6%,34% 49.3%,63.3% 49.3%,63.3% 44.6%,34% 44.6%,0 0)';
        PROPS.stool(W, 820, 900); const bob = SH.actor(W, 'bob');
        const dark = SH.div(W, 'left:-200px;top:-200px;width:2400px;height:1500px;background:radial-gradient(ellipse at 50% 35%,rgba(10,14,30,0),rgba(5,6,14,.75))');
        return { bob, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 620, 1.0], [10, 960, 520, 1.25]]);
        const climb = E.inOutCubic(S.seg(lt, 0.4, 2.0));
        st.bob.set({ x: 960, y: S.lerp(1290, 990, climb), scale: 0.95, look: [0, -0.6], lid: 0.25, browUp: 0.3, mouth: { open: 0, smile: -0.2, wide: 0.7 }, armL: [150, -20], armR: [150, -20], blink: TOON.blinkAt(lt, 3.8) });
        st.bob.svg.style.filter = 'brightness(.55)';
      } },
    { // D: through the gap: the empty lot, one flickering streetlight - then a window across the lot flashes. Twice. A pause. Twice.
      t0: 30.4, setup(W, O) {
        const lot = SH.canvas(W); const win = PROPS.lot(lot, { seed: 12, lampX: 0.3 });
        const lampGlow = SH.div(W, 'left:300px;top:380px;width:900px;height:700px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,200,120,.35),rgba(255,200,120,0) 70%)');
        const wl = SH.div(W, `left:${win.winX - 160}px;top:${win.winY - 90}px;width:${win.winW}px;height:${win.winH}px;background:#FFE7A0;box-shadow:0 0 30px 12px rgba(255,220,140,.8);opacity:0`);
        SH.div(O, 'left:0;top:0;width:1920px;height:380px;background:linear-gradient(#5b616c,#3a3f48)'); SH.div(O, 'left:0;top:700px;width:1920px;height:380px;background:linear-gradient(#3a3f48,#5b616c)');
        for (let i = 0; i < 9; i++) SH.div(O, `left:0;top:${i * 42}px;width:1920px;height:6px;background:#2a2e35`);
        for (let i = 0; i < 9; i++) SH.div(O, `left:0;top:${700 + i * 42}px;width:1920px;height:6px;background:#2a2e35`);
        return { lampGlow, wl, W };
      },
      draw(lt, st, t) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [1.0, 960, 560, 1.0], [3.9, 1440, 385, 1.9], [13.6, 1460, 385, 2.1]]);
        const h = S.hash(Math.floor(lt * 9)); st.lampGlow.style.opacity = h > 0.8 ? 0.2 : 1;
        st.wl.style.opacity = winOn(t - SH.cue('n29'));
      } },
    { // E: smash to black - EPISODE 2: SHELF LIFE, the three rules glowing faintly below
      t0: 44.0, setup(W, O) {
        SH.div(O, 'inset:0;background:#000');
        const t = SH.div(O, "left:0;right:0;top:300px;text-align:center;font:900 120px/1 'Basement Grotesque';color:#fff;letter-spacing:.03em", 'EPISODE 2:<br>SHELF LIFE');
        const rules = ['1. SILENCE IS SURVIVAL', '2. NEVER USE THE PA SYSTEM', '3. THE FREEZER SLOWS THEM DOWN'].map((r, i) => SH.div(O, `left:0;right:0;top:${640 + i * 70}px;text-align:center;font:700 44px/1 'JetBrains Mono';color:#7FD3FF;letter-spacing:.08em;opacity:0;text-shadow:0 0 18px rgba(127,211,255,.8)`, r));
        return { t, rules };
      },
      draw(lt, st) {
        st.t.style.opacity = lt > 0.1 ? 1 : 0; st.t.style.transform = `scale(${lt > 0.1 ? 1 + 0.2 * Math.exp(-(lt - 0.1) * 14) : 1.2})`;
        st.rules.forEach((r, i) => { r.style.opacity = S.seg(lt, 1.6 + i * 0.7, 2.6 + i * 0.7) * (0.55 + 0.15 * Math.sin(lt * 2 + i)); });
      } },
  ], { fades: [[52.6, 54, 0, 1]] });
})();
