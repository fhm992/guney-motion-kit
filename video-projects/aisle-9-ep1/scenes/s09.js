// @scene s09 40 Beat 9 - Day 3, the pop-top
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const A9 = (mood, seed = 9) => SETS.aisle('cans', mood, { seed, sign: 'AISLE 9', sub: 'CANNED GOODS', signColor: '#C9302C', lip: '#E8382F', header: 'SOUP & BEANS' });
  const FXM = { dust: 70, beamK: 0.9, beamMax: 10 };
  const BX = -0.9, BZ = 8.6, ZK = ['zPajama', 'zBasketW', 'zShopper', 'zHalloran'];
  const atBob = (R, st, pose, x = BX, z = BZ) => R.at(st.bob, x, z, pose, { bias: 0.6 });
  const sit = (extra) => Object.assign({ face: Math.PI / 2, crouch: 0.72, armL: [-15, -125], armR: [-15, -125] }, extra);
  const run = (t, sp = 1.25) => ({ phase: t * sp, stride: 230, kind: 'run' });
  SH.run('s09', 's09', 40, [
    { t0: 0, setup(W, O) { return { card: SH.dayCard(O, 'DAY 3') }; }, draw(lt, st) { st.card(lt, 0.3); } },
    { // B: morning grey light. Towel round a scraped arm, a twisted ankle, a can he can't open. "Day three..."
      t0: 3.4, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM, dof: 1.2 }); return { R, bob: R.actor('bob'), tw: R.prop(PROPS.towel(R.A)), can: R.prop(PROPS.can(R.A, 'BEANS', '#C9302C', 1)) }; },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 1.3, 1.0, 6.4, -0.7, -0.08, 1050], [9, 0.55, 0.75, 7.6, -1.05, 0.0, 1300]], { ease: E.inOutSine, hand: 0.4 }));
        const turn = Math.sin(lt * 1.3);
        atBob(R, st, sit(Object.assign({}, EXPR.exhausted, { headFace: Math.PI / 2 + 0.4, look: [0.4, 0.5], armR: [55, -70], armL: [30, -60], headTilt: turn * 5, blink: TOON.blinkAt(lt, 2.8),
          mouth: lt > 6.4 ? { open: 0.1, smile: -0.7, wide: 0.6 } : undefined })));
        R.put(st.tw, BX + 0.02, BZ + 0.14, 0.12, 70, { y: 0.66 });
        R.hold(st.can, st.bob, 'R', 0.15, { rot: turn * 25 + (lt > 6.4 ? Math.sin(lt * 18) * 6 : 0) });
      } },
    { // C: then he spots it - one red can with a ring pull, glowing on the shelf. "Then you spot it. Pop-top chili..."
      t0: 12.4, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM }); const can = R.prop(PROPS.can(R.A, 'CHILI', '#E8382F', 1)); can.style.filter = 'drop-shadow(0 0 22px rgba(255,220,120,.9))'; return { R, bob: R.actor('bob'), can }; },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 0.2, 0.9, 10.6, -2.55, 0.02, 1000], [2.4, 0.0, 0.9, 10.2, -2.55, 0.02, 1050], [6.6, -0.6, 0.98, 9.7, -2.2, -0.02, 1600]], { ease: E.inOutCubic, hand: 0.4 }));
        const reach = S.seg(lt, 3.4, 5.6);
        atBob(R, st, sit(Object.assign({}, EXPR.happy, { headFace: Math.PI / 2 + 0.9, look: [0.6, -0.3], lid: 0.15, browUp: 0.6, armR: [S.lerp(-15, 150, E.inOutCubic(reach)), S.lerp(-125, -20, reach)], blink: TOON.blinkAt(lt, 3.1) })));
        R.put(st.can, -1.46, 9.35, 0.15, 190, { y: 0.92 });
      } },
    { // D: CLOSE. The ring pull. KSSHHK-POP. A shock ring of sound blasts out through the store - freeze.
      t0: 19.0, setup(W, O) { const R = SH.stage(W, A9('gray'), { fx: Object.assign({}, FXM, { dust: 30 }), dof: 3 }); const can = R.prop(PROPS.can(R.A, 'CHILI', '#E8382F', 1)); return { R, can, bob: R.actor('bob'), rings: SH.rings(O, '#7FD3FF'), fl: SH.div(O, 'inset:0;background:#fff;opacity:0') }; },
      draw(lt, st, t) {
        const R = st.R, pop = lt - 0.2, sh = pop > 0 && pop < 0.5 ? 10 : 0.3;
        R.frame(t, SH.cam3(lt, [[0, 0.4, 0.8, 8.0, -1.01, -0.14, 1900], [0.2, 0.4, 0.8, 8.0, -1.01, -0.14, 1900], [3.4, 0.75, 0.95, 7.75, -0.98, -0.12, 1150]], { hand: sh, ease: E.outCubic }));
        atBob(R, st, sit(Object.assign({}, lt < 0.2 ? EXPR.happy : EXPR.terror, { headFace: Math.PI / 2 + 0.5, look: [0.5, 0.4], armR: [55, -70], lid: lt < 0.2 ? 0.2 : 0 })));
        R.hold(st.can, st.bob, 'R', 0.15); const P = Object.assign({}, st.bob._P, (() => { const r = st.can.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + 70, visible: true }; })());
        const tab = st.can.querySelector('.tab'); tab.style.transformOrigin = '58px 8px'; tab.style.transform = `rotate(${-80 * E.outBack(S.seg(lt, 0.0, 0.25))}deg)`;
        if (P.visible) st.rings(lt, 0.2, P.x, P.y - 70, 2400, 0.22, 1.6, 1.3);
        st.fl.style.opacity = pop > 0 ? 0.55 * Math.exp(-pop * 7) : 0;
        R.F.style.filter = pop > 0 && pop < 1.6 ? `saturate(${0.2 + 0.8 * S.seg(pop, 0.6, 1.6)})` : '';
      } },
    { // E: heads snap round - one end of the aisle, then the other. Moans.
      t0: 22.4, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM }); return { R, zs: ZK.map((k, i) => R.actor(k, { seed: 110 + i })) }; },
      draw(lt, st, t) {
        const R = st.R, far = lt > 2.0, w = E.outCubic(S.seg(lt, 0.15, 0.4)), w2 = E.outCubic(S.seg(lt, 2.15, 2.4));
        R.frame(t, far ? SH.cam3(lt, [[2, 0.3, 1.3, 15.6, 0.02, 0.02, 1500], [4, 0.2, 1.3, 16.2, 0.0, 0.02, 1650]], { hand: lt < 2.5 ? 4 : 0.5 }) : SH.cam3(lt, [[0, -0.3, 1.3, 3.6, Math.PI + 0.02, 0.02, 1500], [2, -0.2, 1.3, 3.2, Math.PI, 0.02, 1650]], { hand: lt < 0.5 ? 4 : 0.5 }));
        [[-0.5, -0.4], [0.5, 0.1]].forEach(([x, z], i) => R.at(st.zs[i], x, z, Object.assign({}, EXPR.zombie, { face: Math.PI + (i ? -0.5 : 0.5) * (1 - w), headFace: Math.PI + (i ? -1.6 : 1.6) * (1 - w), look: [0, w > 0.5 ? 0 : -0.6], lid: 0, eyeScale: 1 + 0.25 * w })));
        [[-0.4, 22.6], [0.6, 23.0]].forEach(([x, z], i) => R.at(st.zs[i + 2], x, z, Object.assign({}, EXPR.zombie, { face: (i ? -0.5 : 0.5) * (1 - w2), headFace: (i ? -1.6 : 1.6) * (1 - w2), look: [0, w2 > 0.5 ? 0 : -0.6], eyeScale: 1 + 0.25 * w2 })));
      } },
    { // F: Bob, can in hand. "Oh, come on."
      t0: 26.4, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM, dof: 1.6 }); return { R, bob: R.actor('bob'), can: R.prop(PROPS.can(R.A, 'CHILI', '#E8382F', 1)) }; },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 0.35, 0.72, 7.5, -0.95, 0.0, 1500], [3, 0.2, 0.72, 7.75, -1.0, 0.0, 1700]], { hand: 0.4 }));
        atBob(R, st, sit(Object.assign({}, EXPR.deadpan, { headFace: Math.PI / 2 - 0.8, look: [0, 0], armR: [55, -70], mouth: SH.mouth(['b13'], { open: 0, smile: -0.2, wide: 0.9 }, { smile: -0.3, amp: 0.5 }), blink: TOON.blinkAt(lt, 2.2) })));
        R.hold(st.can, st.bob, 'R', 0.15);
      } },
    { // G: whip pan from one end of the aisle to the other - they're coming from BOTH sides. "Both ends. You're boxed in."
      t0: 29.4, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM }); return { R, bob: R.actor('bob'), zs: [0, 1, 2, 3, 4, 5].map((i) => R.actor(ZK[i % 4], { seed: 120 + i })) }; },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 0.0, 2.9, 8.0, 0.0, -0.32, 900], [2.2, 0.0, 2.9, 8.0, 0.0, -0.32, 900], [3.0, 0.0, 2.9, 8.0, Math.PI, -0.32, 900], [7.2, 0.0, 2.8, 8.6, Math.PI, -0.36, 820]], { hand: lt > 2.2 && lt < 3.1 ? 6 : 0.8 }));
        atBob(R, st, Object.assign({}, EXPR.terror, { face: Math.PI / 2, headFace: lt < 2.6 ? Math.PI : 0, crouch: 0.2, look: [0, -0.3] }), -0.2, 8.8);
        st.zs.forEach((z, i) => { const front = i < 3, a = S.seg(lt, 0, 7.2), zz = front ? S.lerp(1.0 + i * 0.5, 4.6 + i * 0.4, a) : S.lerp(19 + (i - 3) * 0.5, 13.0 + (i - 3) * 0.4, a);
          R.at(z, -0.7 + (i % 3) * 0.7, zz, Object.assign({}, EXPR.zombie, { face: front ? Math.PI : 0, gait: { phase: lt * 0.7 + i, stride: 50, kind: 'shamble' }, armL: [80, -10], armR: [90, -10], lean: 8 })); });
      } },
    { // H: he bolts - straight at us, ducking under grabbing arms
      t0: 36.6, setup(W) { const R = SH.stage(W, A9('gray'), { fx: FXM }); return { R, bob: R.actor('bob'), zs: [0, 1].map((i) => R.actor(ZK[i], { seed: 130 + i })) }; },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 0.1, 0.9, 1.6, 0, -0.02, 950], [3.4, 0.1, 0.85, 1.2, 0, -0.02, 900]], { hand: 3 }));
        const bz = K(lt, [[0, 9.5], [3.4, 1.5]], E.lin), duck = S.seg(lt, 1.6, 2.2) * (1 - S.seg(lt, 2.4, 2.9));
        atBob(R, st, Object.assign({}, EXPR.terror, { face: 0, gait: run(lt, 1.35), lean: 14 + duck * 20, crouch: duck * 0.35 }), 0.1, bz);
        [[-0.55, 5.4], [0.65, 5.0]].forEach(([x, z], i) => R.at(st.zs[i], x, z, Object.assign({}, EXPR.zombieShriek, { face: (i ? -1 : 1) * 1.2 * S.seg(lt, 1.5, 2.6), armL: [100, -10], armR: [110, -10], lean: 10 })));
      } },
  ], { fades: [[39.6, 40, 0, 0.6]], gfx: [
    { type: 'note', text: 'NO CAN OPENER = NO FOOD', icon: '!', at: 9.0, dur: 3.2 },
    { type: 'note', text: 'A POP-TOP CAN IS LOUD', icon: '!', at: 20.2, dur: 2.2 },
    { type: 'note', text: 'THEY HEARD IT', icon: '!', at: 22.8, dur: 3.0 },
  ] });
})();
