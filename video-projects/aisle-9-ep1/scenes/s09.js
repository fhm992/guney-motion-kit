// @scene s09 40 Beat 9 - Day 3, The Pop-Top
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const cans = (W, seed, o = {}) => SH.aisle(W, Object.assign({ seed, mood: 'gray', kind: 'cans', sign: 'AISLE 9\nCANNED GOODS', signZ: 6.5, lip: '#E8382F', vignette: 0.5 }, o));
  SH.run('s09', 's09', 40, [
    { t0: 0, setup(W, O) { return { card: SH.dayCard(O, 'DAY 3') }; }, draw(lt, st) { st.card(lt, 0.3); } },
    { // B: scraped arm, wrapped in a store towel; a store full of cans and no can opener
      t0: 3.6, setup(W) {
        cans(W, 21); const bob = SH.actor(W, 'bob'); const tw = PROPS.towel(W);
        const scr = SH.div(W, 'left:0;top:0;width:60px;height:30px', '<svg width="60" height="30"><path d="M2 6 L58 4 M4 15 L56 14 M6 24 L50 25" stroke="#C9302C" stroke-width="5" stroke-linecap="round"/></svg>');
        return { bob, tw, scr, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [8.8, 980, 600, 1.3]]);
        const wrap = S.seg(lt, 1.0, 4.0);
        st.bob.set({ x: 960, y: 1240, scale: 1.0, look: [0.3, 0.7], lid: 0.4, brow: 0.6, browUp: 0.4, mouth: { open: 0, smile: -0.5, wide: 0.6 }, armL: [-10, -110], armR: [40 + Math.sin(lt * 5) * 10 * (1 - wrap), -70], headTilt: 8, blink: TOON.blinkAt(lt, 3.2) });
        st.tw.style.transform = `translate(${900}px, ${640}px) rotate(-30deg) scale(${S.lerp(0.3, 1, wrap)})`; st.tw.style.opacity = wrap > 0 ? 1 : 0;
        st.scr.style.transform = 'translate(915px, 655px) rotate(-30deg)'; st.scr.style.opacity = 1 - wrap;
      } },
    { // C: there it is - pop-top chili. Quiet, easy.
      t0: 12.4, setup(W) { cans(W, 22); const can = PROPS.can(W, 'CHILI', '#C9302C', 1.3); const glow = SH.div(W, 'left:0;top:0;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,120,.6),rgba(255,220,120,0) 70%)'); return { can, glow, W }; },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [6.6, 960, 560, 1.35]]);
        st.glow.style.transform = `translate(710px, 310px) scale(${1 + Math.sin(lt * 3) * 0.05})`; st.can.set(960, 560 + Math.sin(lt * 2) * 6, 1.3, Math.sin(lt * 1.5) * 3);
      } },
    { // D: he pulls the tab - TSSSK-POP. Time freezes on his face as a blue ring spreads outward.
      t0: 19.0, setup(W, O) {
        cans(W, 23); const bob = SH.actor(W, 'bob'); const can = PROPS.can(W, 'CHILI', '#C9302C', 0.6); const rings = SH.rings(W, '#7FD3FF');
        const fx = SH.div(O, 'inset:0;background:rgba(80,140,255,.0);'); return { bob, can, rings, fx, W };
      },
      draw(lt, st) {
        const frozen = lt > 0.6;
        SH.cam(st.W, lt, [[0, 960, 640, 1.6], [0.6, 960, 520, 1.6], [3.2, 960, 470, 2.0]], lt > 0.15 && lt < 0.5 ? 10 : 0);
        st.bob.set({ x: 960, y: 1240, scale: 1.0, look: [0, frozen ? -0.2 : 0.8], eyeScale: frozen ? 1.25 : 1, pupil: frozen ? 0.45 : 1, browUp: frozen ? 1 : 0.3, brow: frozen ? 0.6 : 0,
          mouth: frozen ? { open: 0.25, smile: -0.8, wide: 0.5 } : { open: 0, smile: 0.4 }, armL: [-10, -115], armR: [-10, -115], headTilt: frozen ? 0 : 6 });
        st.can.set(960, 870, 0.6, 0); st.can.querySelector('.tab').setAttribute('transform', lt > 0.25 ? 'rotate(-60 75 8) translate(0 -14)' : '');
        st.rings(lt, 0.3, 960, 860, 2400, 0.9, 2.4);
        st.W.style.filter = frozen ? `saturate(${S.lerp(1, 0.3, S.seg(lt, 0.6, 1.2))})` : 'none';
      } },
    { // E: at the end of the aisle a shopper's head turns. Then another. "Oh, come on."
      t0: 22.0, setup(W) {
        cans(W, 24); const z1 = SH.actor(W, 'zPajama'); const z2 = SH.actor(W, 'zShopper'); const bob = SH.actor(W, 'bob'); return { z1, z2, bob, W };
      },
      draw(lt, st, t) {
        SH.cam(st.W, lt, [[0, 960, 520, 1.5], [3.4, 960, 520, 1.5], [4.2, 960, 560, 1.0]]);
        const t1 = E.inOutCubic(S.seg(lt, 0.3, 1.4)), t2 = E.inOutCubic(S.seg(lt, 2.3, 3.4));
        st.z1.set({ x: 900, y: 700, scale: 0.34, flip: t1 < 0.5, headTilt: S.lerp(-30, 0, t1), look: [0, 0], mouth: { open: 0.3, smile: -0.5 } });
        st.z2.set({ x: 1040, y: 705, scale: 0.34, flip: t2 > 0.5, headTilt: S.lerp(30, 0, t2), look: [0, 0], mouth: { open: 0.3, smile: -0.5 } });
        const show = lt > 3.8;
        st.bob.svg.style.visibility = show ? 'visible' : 'hidden';
        st.bob.set({ x: 960, y: 1260, scale: 1.0, look: [0, -0.4], lid: 0.35, brow: -0.6, browUp: 0, mouth: SH.mouth(['b13'], { open: 0, smile: -0.6, wide: 0.7 }, { smile: -0.4, amp: 0.4 }), armL: [-10, -115], armR: [20, -40], headTilt: -6 });
      } },
    { // F: he backs up - another one at the other end. Boxed in.
      t0: 29.2, setup(W) {
        SH.aisle(W, { seed: 25, mood: 'gray', kind: 'cans', lip: '#E8382F', vx: 0.5, width: 3.2 });
        const zA = SH.actor(W, 'zBasketW'); const zB = SH.actor(W, 'zHalloran'); const bob = SH.actor(W, 'bob'); return { zA, zB, bob, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [6, 960, 580, 1.1]], 3);
        const a = SH.shamble(lt, 1, 0.5), b = SH.shamble(lt, 3, 0.5);
        st.zA.set(Object.assign({}, a, { x: S.lerp(80, 360, S.seg(lt, 0, 6)), y: 1080, scale: 0.86, look: [0.6, 0], mouth: { open: 0.4, smile: -0.5 }, armL: [80, -20], armR: [90, -20] }));
        st.zB.set(Object.assign({}, b, { x: S.lerp(1840, 1560, S.seg(lt, 0, 6)), y: 1080, scale: 0.86, flip: true, look: [-0.6, 0], mouth: { open: 0.4, smile: -0.5 }, armL: [80, -20], armR: [90, -20] }));
        const lookR = Math.sin(lt * 2.5) > 0;
        st.bob.set({ x: 960, y: 1100, scale: 0.95, look: [lookR ? 0.9 : -0.9, 0], eyeScale: 1.15, pupil: 0.5, browUp: 1, brow: 0.8, mouth: { open: 0.1, smile: -0.8, wide: 0.5 }, armL: [30, -40], armR: [30, -40] });
      } },
    { // G: he grabs a can and bolts through a gap between the shelves
      t0: 35.0, setup(W) { SH.aisle(W, { seed: 26, mood: 'gray', kind: 'cans', lip: '#E8382F', vx: 0.2 }); const bob = SH.actor(W, 'bob'); const can = PROPS.can(W, 'BEANS', '#2FA36B', 0.4); return { bob, can, W }; },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [5, 1200, 560, 1.0]], 8);
        const wk = SH.walk(lt, 1.3, 1, true), x = S.lerp(400, 2300, E.inCubic(S.seg(lt, 0.8, 3.6)));
        st.bob.set(Object.assign({}, wk, { x, y: 1100, scale: 0.95, look: [0.9, 0], eyeScale: 1.1, pupil: 0.5, browUp: 1, mouth: { open: 0.3, smile: -0.7, wide: 0.6 }, lean: 14, armR: [100, -30] }));
        st.can.set(x + 150, 620 + wk.bob, 0.4, lt * 90);
      } },
  ]);
})();
