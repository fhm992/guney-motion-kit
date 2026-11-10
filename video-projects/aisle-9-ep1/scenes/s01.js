// @scene s01 13.5 Beat 1 - Cold Open
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const BX = -0.9, BZ = 3.0;
  SH.run('s01', 's01', 13.5, [
    { // B: extreme close-up on Bob's wide eye -> slow dolly back: Bob frozen, hand on the shelf, a Shopper swaying two metres away
      t0: 0, t1: 8.3, setup(W) {
        const world = SETS.aisle('snacks', 'red', { seed: 31, sign: 'AISLE 4', sub: 'SNACKS', signColor: '#7a1010', header: 'SNACKS', flicker: true });
        const R = SH.stage(W, world, { fx: { flicker: true, beacon: [1750, 90], dust: 60, beamK: 1.3 }, dof: (t) => S.lerp(9, 1.2, E.inOutCubic(S.seg(t, 3.4, 7.8))) });
        return { R, zed: R.actor('zShopper'), bob: R.actor('bob'),
          drops: [0, 1, 2].map(() => SH.div(R.A, 'left:0;top:0;width:22px;height:30px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;z-index:2000;background:radial-gradient(circle at 35% 35%,#fff 0 18%,rgba(200,230,255,.85) 30%,rgba(120,170,220,.5) 70%,rgba(80,120,170,.2))')) };
      },
      draw(lt, st, t) {
        const R = st.R, u = E.inOutCubic(S.seg(t, 3.6, 7.9));
        const cam = SH.cam3(t, [[0, BX + 0.1, 1.09, BZ - 0.42, 0, 0, 2300], [3.6, BX + 0.1, 1.09, BZ - 0.45, 0, 0, 2250], [7.9, 0.35, 1.38, -0.6, -0.04, -0.03, 1100], [8.3, 0.36, 1.39, -0.7, -0.04, -0.03, 1100]], { hand: 0.6 });
        R.frame(t, cam);
        const sw = Math.sin(t * 1.1), dart = t > 4.8 && t < 5.3 ? 0.15 : 0;
        st.zed.svg.style.filter = `blur(${S.lerp(7, 0.6, u)}px)`;
        R.at(st.zed, 0.55, 5.0, Object.assign({}, EXPR.zombie, { yaw: -0.25, lean: -2 + sw * 4, headTilt: -16 + Math.sin(t * 0.7 + 1) * 8, headX: sw * 6, look: [0, 0.2], mouth: { open: 0.35 + 0.1 * Math.sin(t * 2.3), smile: -0.6 }, armL: [14 + sw * 5, -18], armR: [10 - sw * 5, -10], gait: { phase: t * 0.08, stride: 18, kind: 'shamble' } }));
        const P = R.at(st.bob, BX, BZ, Object.assign({}, EXPR.scared, { yaw: 0.28, look: [0.75 + dart, -0.05 + 0.02 * Math.sin(t * 40)], armL: [84, 8], armR: [12, -28], headTilt: 2, bob: 0.6 * Math.sin(t * 9) }));
        // sweat beads slide down near the temple (head space)
        st.drops.forEach((d, i) => { const k = ((t + i * 1.3) % 3.9) / 3.9, s = P.ppm / WORLD.RIG_PER_M; d.style.opacity = Math.sin(k * Math.PI) * 0.95;
          d.style.transform = `translate(${P.x + [150, -138, 118][i] * s}px, ${P.y + ([120, 150, 62][i] - 900 + k * 46) * s}px) scale(${s * 1.1})`; });
      } },
    { t0: 8.3, t1: 10.7, setup(W, O) { return { tt: GFX.title(O) }; }, draw(lt, st) { st.tt(lt, 0, 2.0); } },
    { t0: 10.7, setup(W, O) { return { card: SH.dayCard(O, 'DAY 1') }; }, draw(lt, st) { st.card(lt, 0.05); } },
  ], { fades: [[0, 1.5, 1, 1], [1.5, 2.4, 1, 0]] });
})();
