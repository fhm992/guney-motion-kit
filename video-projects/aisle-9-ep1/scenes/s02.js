// @scene s02 52 Beat 2 - The Normal Night
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const LANE3 = -0.85, BOBZ = 1.95; // Bob's spot behind register 3 (lane 3 counter spans x -2.0 .. 0.3 at z = 1.2)
  const outside = (cv) => PROPS.lot(cv, { seed: 3, lampX: 0.5 });
  const deadpan = Object.assign({}, EXPR.deadpan);
  SH.run('s02', 's02', 52, [
    { // A: "Let's go back..." crane down over the bright store toward the checkout lanes
      t0: 0, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { fx: { dust: 50, beamK: 0.8 } });
        return { R, bob: R.actor('bob'), ty: R.actor('tyler'), cust: R.actor('customer') };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(t, [[0, 0.6, 4.2, -2.6, -0.16, -0.36, 920], [7.0, -0.3, 1.75, -1.4, 0.02, -0.06, 1050]], { ease: E.inOutSine });
        R.frame(t, cam);
        R.at(st.bob, LANE3, BOBZ, Object.assign({}, deadpan, { face: 0, armR: [30 + 30 * Math.sin(t * 2), -60], armL: [18, -40], blink: TOON.blinkAt(t, 3.1) }));
        R.at(st.ty, 3.0, K(t, [[0, 12], [7, 8.2]], E.lin), Object.assign({}, EXPR.neutral, { face: 0, gait: { phase: t * 0.9, stride: 150, kind: 'walk' } }));
        R.at(st.cust, 5.8, 9 - t * 0.4, Object.assign({}, EXPR.neutral, { face: 0.3, gait: { phase: t * 0.8, stride: 140, kind: 'walk' } }));
      } },
    { // B: register three. Push in on Bob, deadpan, scanning. "...The night shift."
      t0: 7.0, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { fx: { dust: 40, beamK: 0.7 }, dof: 2.2 });
        const items = ['#E8382F', '#2F7BE8', '#F2B134'].map((c) => R.prop(PROPS.item(R.A, c)));
        return { R, bob: R.actor('bob'), items };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, -0.8, 1.32, -0.9, -0.02, -0.04, 1100], [8.6, -0.88, 1.2, 0.05, -0.01, -0.02, 1450]], { hand: 0.3 });
        R.frame(t, cam);
        const sc = (lt % 2.6) / 2.6, sweep = Math.sin(sc * Math.PI);
        R.at(st.bob, LANE3, BOBZ, Object.assign({}, deadpan, { face: 0.1, look: [0.35 * sweep, 0.35], armR: [36 + 46 * sweep, -64], armL: [20, -50], headTilt: 2 + Math.sin(lt * 0.6) * 2, blink: TOON.blinkAt(lt, 3.1), mouth: SH.mouth(['b01'], deadpan.mouth) }));
        st.items.forEach((el, i) => { const u = ((lt + i * 0.9) % 2.7) / 2.7; R.put(el, S.lerp(-2.0, -0.6, u), 1.2, 0.12, 90, { y: 0.74 }); el.style.opacity = u < 0.9 ? 1 : 0; });
      } },
    { // C: Tyler pushes the squeaky cart past the lanes. "Sorry! ...since, like, forever." / Bob: "...So, never."
      t0: 15.6, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { fx: { dust: 40 } });
        return { R, bob: R.actor('bob'), ty: R.actor('tyler'), cart: R.prop(PROPS.cart(R.A, 1)) };
      },
      draw(lt, st, t) {
        const R = st.R, tx = K(lt, [[0, 3.6], [1.8, 0.6, E.outCubic], [5.6, 0.25], [8.6, 0.0], [10.6, -3.2, E.inCubic]]);
        const cam = SH.cam3(lt, [[0, 1.7, 1.45, -2.8, -0.3, -0.05, 1000], [10.6, -0.5, 1.4, -2.9, -0.1, -0.04, 1050]], { hand: 0.25 });
        R.frame(t, cam);
        const moving = lt < 1.8 || lt > 8.6;
        R.at(st.ty, tx + 0.35, 0.05, Object.assign({}, SH.speaking('t01') ? EXPR.happy : EXPR.neutral, { face: -Math.PI / 2, headFace: SH.speaking('t01') ? SH.headingTo(tx + 0.35, 0.05, LANE3, BOBZ) : -1.3, look: [-0.4, 0], armL: [72, -22], armR: [76, -24],
          gait: moving ? { phase: lt * 0.95, stride: 140, kind: 'walk' } : null, mouth: SH.mouth(['t01'], { open: 0.05, smile: 0.6 }, { smile: 0.6 }), blink: TOON.blinkAt(lt, 2.7, 1) }));
        R.hold(st.cart, st.ty, 'both', 1.0, { gx: 0.125, gy: 0.1, flip: true, ground: true });
        const lookAt = S.clamp((tx - LANE3) / 2.4, -1, 1);
        R.at(st.bob, LANE3, BOBZ, Object.assign({}, deadpan, { face: 0, headFace: S.clamp(SH.headingTo(LANE3, BOBZ, tx, 0.05), -1.2, 1.2), look: [S.clamp(lookAt, -1, 1) * 0.5, 0.1], headTilt: 4, armL: [16, -40], armR: [16, -40],
          mouth: SH.mouth(['b01'], deadpan.mouth, { smile: 0.0, amp: 0.6 }), blink: TOON.blinkAt(lt, 3.4, 2) }));
      } },
    { // D: a customer fights the self-checkout and slaps the screen
      t0: 26.2, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { fx: { dust: 40 } });
        return { R, k: R.prop(PROPS.kiosk(R.A, 0, 0)), c: R.actor('customer') };
      },
      draw(lt, st, t) {
        const R = st.R, slap = (lt > 3.4 && lt < 3.6) || (lt > 3.9 && lt < 4.1);
        const cam = SH.cam3(lt, [[0, 4.4, 1.45, -1.3, 0.32, -0.04, 1250], [4.8, 4.85, 1.4, -0.8, 0.22, -0.03, 1500]], { hand: slap ? 4 : 0.4 });
        R.frame(t, cam);
        st.k.flash(Math.floor(lt * 4) % 2 === 0); R.put(st.k, 6.45, 0.35, 1.55, 620);
        R.at(st.c, 5.75, 0.25, Object.assign({}, lt > 2.6 ? EXPR.worried : EXPR.neutral, { face: SH.headingTo(5.75, 0.25, 6.45, 0.35) - 0.5, brow: 0.8, look: [0.6, -0.1], mouth: lt > 2.8 ? { open: 0.35, smile: -0.6, wide: 0.8 } : { open: 0, smile: -0.4 },
          armR: slap ? [100, -10] : [52 + Math.sin(lt * 6) * 10, -40], armL: [24, -60], lean: slap ? 6 : 2, blink: TOON.blinkAt(lt, 2.2) }));
      } },
    { // E: "...and the PA belongs to Gary." Slow dolly to the customer service desk; rack focus onto the GARY ONLY note
      t0: 31.0, setup(W) {
        const world = SETS.service('day', { seed: 6 }); const R = SH.stage(W, world, { fx: { dust: 50 }, dof: (t) => S.lerp(0, 3.5, S.seg(t, 34, 36.5)) });
        return { R, mic: R.prop(PROPS.mic(R.A)), sp: R.prop(PROPS.speaker(R.A, 0, 0, 1.2)) };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, -2.6, 1.6, -0.6, 0.32, -0.05, 1000], [3.6, -0.6, 1.4, 0.6, 0.14, -0.06, 1200], [7.2, 0.15, 1.25, 1.75, 0.02, -0.06, 1900]], { ease: E.inOutSine });
        R.frame(t, cam);
        R.put(st.mic, 0.15, 3.25, 0.42, 300, { y: 0.8 }); R.put(st.sp, 1.6, 4.0, 0.4, 170, { y: 3.6 });
      } },
    { // F: door chime; Mr. Halloran shuffles in from the dark parking lot
      t0: 38.2, setup(W) {
        const world = SETS.entrance('day', { seed: 7 }); const R = SH.stage(W, world, { outside: (cv) => PROPS.lot(cv, { seed: 3, lampX: 0.62 }), fx: { dust: 40 } });
        return { R, h: R.actor('halloran'), can: R.prop(PROPS.can(R.A, 'MEOW', '#F06EA9', 1)), tk: R.prop(PROPS.ticket(R.A)) };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, 0.4, 1.35, 0.4, 0, -0.02, 1050], [5.0, 0.3, 1.3, 1.1, 0, -0.02, 1150]]);
        R.frame(t, cam);
        const z = K(lt, [[0, 8.2], [5.0, 4.4]], E.lin), wk = { phase: lt * 0.6, stride: 90, kind: 'walk' };
        const P = R.at(st.h, 0.2, z, Object.assign({}, EXPR.happy, { face: 0, lean: 5, armL: [30, -70], armR: [30, -80], headTilt: -4, look: [0.2, 0.1], gait: wk, blink: TOON.blinkAt(lt, 2.8), mouth: { open: 0, smile: 0.55 } }));
        R.put(st.can, 0.42, z - 0.25, 0.14, 190, { y: 0.62 + Math.sin(lt * 4) * 0.01 }); R.put(st.tk, -0.05, z - 0.25, 0.07, 74, { y: 0.66 });
      } },
    { // G: at the counter. Over his shoulder: "Same as always, sweetheart." -> reverse over Bob's shoulder: "...my most predictable man."
      t0: 43.2, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { outside, fx: { dust: 40 }, dof: 1.8 });
        return { R, bob: R.actor('bob'), h: R.actor('halloran'), can: R.prop(PROPS.can(R.A, 'MEOW', '#F06EA9', 1)), tk: R.prop(PROPS.ticket(R.A)) };
      },
      draw(lt, st, t) {
        const R = st.R, rev = t >= 45.9;
        const cam = rev ? SH.cam3(t - 45.9, [[0, -0.3, 1.5, 3.4, 3.30, -0.06, 1400], [6.1, -0.32, 1.45, 3.15, 3.28, -0.06, 1550]], { hand: 0.25 })
                        : SH.cam3(lt, [[0, -0.05, 1.5, -1.05, -0.24, -0.06, 1250], [2.7, -0.1, 1.47, -0.8, -0.26, -0.06, 1350]], { hand: 0.25 });
        R.frame(t, cam);
        const sc = S.seg(t, 46.4, 47.2);
        R.at(st.bob, LANE3, BOBZ, Object.assign({}, SH.speaking('b02') ? EXPR.happy : EXPR.relieved, { face: 0, look: [0, 0.1], armR: [40 + 40 * Math.sin(sc * Math.PI), -70], armL: [16, -40], headTilt: 5, mouth: SH.mouth(['b02'], { open: 0, smile: 0.6 }, { smile: 0.55 }), blink: TOON.blinkAt(lt, 3.2) }));
        R.at(st.h, LANE3 + 0.55, 0.42, Object.assign({}, EXPR.happy, { face: Math.PI, look: [0, -0.1], armL: [30, -50], armR: [24, -40], lean: 4, headTilt: -5, mouth: SH.mouth(['h01'], { open: 0, smile: 0.55 }, { smile: 0.5, amp: 0.55 }), blink: TOON.blinkAt(lt, 2.9, 1), browUp: 0.4 }));
        R.put(st.can, S.lerp(LANE3 + 0.3, LANE3 - 0.4, sc), 1.05, 0.14, 190, { y: 0.74 }); R.put(st.tk, LANE3 + 0.45, 0.95, 0.07, 74, { y: 0.74 });
      } },
  ], { fades: [[0, 0.5, 1, 0]], gfx: [
    { type: 'stamp', text: 'DAY 1 · 11:48 PM', sub: 'FRESHMART · ROUTE 9', at: 1.2, dur: 5 },
    { type: 'tag', name: 'BOB', role: 'NIGHT CASHIER · REGISTER 3', color: '#E8382F', at: 8.4 },
    { type: 'tag', name: 'TYLER', role: 'COWORKER', color: '#2F7BE8', at: 16.6 },
    { type: 'note', text: 'NOTICE THE NOISES: THE CART, THE MACHINE, THE PA', icon: '!', at: 32.0, dur: 4.5 },
    { type: 'tag', name: 'MR. HALLORAN', role: 'REGULAR CUSTOMER', color: '#E0B070', at: 39.6 },
  ] });
})();
