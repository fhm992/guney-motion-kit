// @scene s03 57 Beat 3 - The Outbreak
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const LANE3 = -0.85, BOBZ = 1.95, HX = LANE3 + 0.55, HZ = 0.42;
  const outside = (cv) => PROPS.lot(cv, { seed: 3, lampX: 0.5 });
  SH.run('s03', 's03', 57, [
    { // A: he coughs. Over Bob's shoulder: Halloran's hand on the counter - grey, dark veins (his whole arm and body in frame)
      t0: 0, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { outside, fx: { dust: 40 }, dof: 1.6 });
        const veins = R.prop(SH.div(R.A, 'width:200px;height:140px', '<svg viewBox="0 0 200 140" width="200" height="140"><path d="M 20 70 q 30 -20 60 6 q 30 26 70 0 M 40 110 q 30 10 60 -14 q 30 -20 80 6 M 60 40 q 30 -30 70 -20" stroke="#1f2a40" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/></svg>'));
        return { R, bob: R.actor('bob'), h: R.actor('hallSick'), veins };
      },
      draw(lt, st, t) {
        const R = st.R, cough = lt < 1.2;
        const cam = SH.cam3(lt, [[0, 0.8, 1.2, 1.15, -1.57, -0.08, 820], [1.4, 0.78, 1.18, 1.12, -1.57, -0.09, 860], [5.2, 0.55, 0.95, 0.95, -1.57, -0.2, 1650], [5.9, 0.45, 0.93, 0.95, -1.57, -0.22, 1750]], { hand: cough ? 3 : 0.4 });
        R.frame(t, cam);
        R.at(st.bob, LANE3 + 0.4, BOBZ, Object.assign({}, EXPR.worried, { face: 0, headFace: -0.3, armL: [16, -40], armR: [20, -40] }));
        const P = R.at(st.h, HX, HZ, Object.assign({}, EXPR.exhausted, { face: Math.PI, headTilt: cough ? Math.sin(lt * 30) * 6 : -6, lean: cough ? 8 : 4, armR: [62, -30], armL: [24, -40],
          mouth: cough ? { open: 0.5, smile: -0.6 } : SH.mouth(['h02'], { open: 0.1, smile: -0.3 }), blink: TOON.blinkAt(lt, 2.5) }));
        R.put(st.veins, HX + 0.1, 0.95, 0.07, 140, { y: 0.74 });
      } },
    { // B: medium on Halloran, swaying, sweating. "Bob, I don't feel so good. Everything's... ringing."
      t0: 5.6, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { outside, fx: { dust: 40 }, dof: 2.2 });
        return { R, bob: R.actor('bob'), h: R.actor('hallSick') };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, 0.25, 1.25, 2.7, 3.39, -0.06, 1350], [6.4, 0.15, 1.2, 2.35, 3.37, -0.05, 1550]], { hand: 0.6 });
        R.frame(t, cam);
        const sway = Math.sin(lt * 1.6) * 6;
        R.at(st.bob, LANE3, BOBZ, Object.assign({}, EXPR.worried, { face: 0.2, armL: [16, -40], armR: [50, -40] }));
        R.at(st.h, HX, HZ, Object.assign({}, EXPR.exhausted, { face: Math.PI - 0.25, lean: 4 + sway, headTilt: -10 + sway, look: [Math.sin(lt * 2.3) * 0.5, 0.2], lid: 0.35 + 0.1 * Math.sin(lt), browUp: 0.8, brow: 0.6,
          mouth: SH.mouth(['h02'], { open: 0.1, smile: -0.3 }, { smile: -0.3, amp: 0.5 }), armL: [24, -40], armR: [34, -90] }));
      } },
    { // C: Bob comes round the counter, sits him down: "Okay, okay, sit down. Tyler, can you grab some water?"
      t0: 11.9, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { outside, fx: { dust: 40 } });
        return { R, bob: R.actor('bob'), h: R.actor('hallSick') };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, 2.8, 1.35, -0.45, -1.38, -0.07, 1000], [4.5, 2.5, 1.3, -0.45, -1.4, -0.07, 1080]], { hand: 0.5 });
        R.frame(t, cam);
        const bx = K(lt, [[0, LANE3], [1.0, 0.65], [1.9, 0.35]]), bz = K(lt, [[0, BOBZ], [1.0, BOBZ], [1.9, 0.55]]), walking = lt < 1.9, calling = t > 13.8;
        R.at(st.bob, bx, bz, Object.assign({}, calling ? EXPR.worried : EXPR.scared, { face: walking ? (lt < 1.0 ? Math.PI / 2 : 0) : -Math.PI / 2, headFace: calling ? 0.2 : null, armL: [50, -50], armR: [60, -40],
          gait: walking ? { phase: lt * 1.3, stride: 160, kind: 'walk' } : null, mouth: SH.mouth(['b03'], { open: 0, smile: -0.4 }, { smile: -0.2 }), blink: TOON.blinkAt(lt, 3) }));
        R.at(st.h, HX, HZ, Object.assign({}, EXPR.exhausted, { face: Math.PI / 2, lean: 6 + Math.sin(lt * 1.6) * 6, headTilt: -14, armL: [30, -30], armR: [40, -60], lid: 0.5 }));
      } },
    { // D: he collapses - cans roll - Bob drops to his knees beside him
      t0: 16.2, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { fx: { dust: 40 } });
        const cans = [0, 1, 2, 3].map((i) => R.prop(PROPS.can(R.A, ['MEOW', 'BEANS', 'SOUP', 'MEOW'][i], ['#F06EA9', '#C9302C', '#2FA36B', '#F06EA9'][i], 1)));
        return { R, bob: R.actor('bob'), h: R.actor('hallSick'), cans };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, 2.3, 0.75, -0.5, -1.45, 0.0, 1050], [3.2, 2.0, 0.62, -0.45, -1.47, 0.02, 1150]], { hand: lt < 0.7 ? 5 : 0.6 });
        R.frame(t, cam);
        const fall = E.inCubic(S.seg(lt, 0, 0.45));
        R.at(st.h, HX, 0.1, Object.assign({}, EXPR.exhausted, { face: Math.PI / 2, lean: -fall * 86, lid: 0.9, mouth: { open: 0.2, smile: -0.4 }, armL: [40 + fall * 60, -20], armR: [40, -20], shadow: 0.2 }));
        st.cans.forEach((c, i) => { const d = Math.max(0, lt - 0.1 - i * 0.12); R.put(c, HX + 0.2 + d * (0.35 + i * 0.18) * Math.exp(-d * 0.6), -0.1 - i * 0.12, 0.14, 190, { y: Math.abs(Math.sin(d * 8)) * 0.06 * Math.exp(-d * 3), rot: d * (300 + i * 80) }); });
        const kneel = E.outCubic(S.seg(lt, 0.8, 1.6));
        R.at(st.bob, K(lt, [[0.6, 1.0], [1.6, 0.1]]), 0.5, Object.assign({}, EXPR.terror, { face: -Math.PI / 2 - 0.4, crouch: kneel * 0.55, lean: kneel * 14, armL: [70, -40], armR: [80, -50], look: [-0.3, 0.6], gait: lt < 1.6 && lt > 0.6 ? { phase: lt * 1.6, stride: 200, kind: 'run' } : null }));
      } },
    { // E: Tyler jogs in from the entrance, pale. "Bob, there are people in the parking lot..." / "Not now!" / "Two seconds. I'm just gonna look."
      t0: 19.4, setup(W) {
        const world = SETS.store('day', { seed: 2 }); const R = SH.stage(W, world, { outside, fx: { dust: 40 } });
        return { R, bob: R.actor('bob'), h: R.actor('hallSick'), ty: R.actor('tyler') };
      },
      draw(lt, st, t) {
        const R = st.R, close = t > 25.7 && t < 29.6;
        const cam = close ? SH.cam3(t - 25.7, [[0, -0.95, 0.9, -1.0, 0.62, -0.02, 1450], [3.9, -0.9, 0.9, -0.9, 0.6, -0.02, 1550]], { hand: 0.7 })
                          : SH.cam3(lt, [[0, 2.7, 1.2, -0.6, -1.5, -0.06, 980], [13.2, 2.4, 1.15, -0.5, -1.52, -0.05, 1080]], { hand: 0.4 });
        R.frame(t, cam);
        R.at(st.h, HX, 0.2, Object.assign({}, EXPR.exhausted, { face: Math.PI / 2, lean: -86, lid: 1, mouth: { open: 0.15, smile: -0.3 }, armL: [70, -10], armR: [40, -20], shadow: 0.2 }));
        const tyGoing = t > 31.6, tz = K(t, [[19.4, -3.4], [21.2, -1.0, E.outCubic], [31.6, -1.0], [33.0, -3.6, E.inCubic]]), tx = K(t, [[19.4, 0.4], [21.2, 0.25], [31.6, 0.25], [33.0, 0.4]]);
        R.at(st.ty, tx, tz, Object.assign({}, SH.speaking('t03') ? EXPR.neutral : EXPR.worried, { face: tyGoing ? 0 : Math.PI, headFace: t < 31.6 && t > 21.2 ? SH.headingTo(tx, tz, 0.1, 0.62) : null,
          gait: (t < 21.2 || tyGoing) ? { phase: t * 1.4, stride: 190, kind: 'run' } : null, armL: t > 21.2 && t < 31.6 ? [60, -110] : null, mouth: SH.mouth(['t02', 't03'], { open: 0.05, smile: -0.2 }, { smile: SH.speaking('t03') ? 0.3 : -0.3 }), browUp: 1, blink: TOON.blinkAt(lt, 2.4) }));
        R.at(st.bob, 0.1, 0.62, Object.assign({}, close ? EXPR.determined : EXPR.worried, { face: SH.headingTo(0.1, 0.62, tx, tz), crouch: 0.55, lean: 12, armL: [70, -40], armR: [60, -50],
          mouth: SH.mouth(['b04'], { open: 0, smile: -0.5 }, { smile: -0.4, amp: 0.85 }), blink: TOON.blinkAt(lt, 2.6) }));
      } },
    { // F: through the glass: Tyler walks out into the lot... the silhouettes turn toward him. "...Bob?" - and he screams
      t0: 32.6, setup(W) {
        const world = SETS.entrance('night', { seed: 7 }); const R = SH.stage(W, world, { outside: (cv) => { PROPS.lot(cv, { seed: 8, lampX: 0.5 }); }, fx: { dust: 30, beams: false } });
        const r = S.mulberry32(4), sil = [];
        for (let i = 0; i < 14; i++) sil.push({ el: R.prop(PROPS.silhouette(R.A, 0, 0, 1, '#04050a')), x: -5 + r() * 10, z: 10 + r() * 4, ph: r() * 6 });
        return { R, ty: R.actor('tyler'), sil };
      },
      draw(lt, st, t) {
        const R = st.R, cam = SH.cam3(lt, [[0, 0.3, 1.35, 3.4, 0, -0.01, 1050], [6.9, 0.3, 1.32, 4.2, 0, 0.0, 1250]], { hand: lt > 4.4 ? 2 : 0.3 });
        R.frame(t, cam);
        const out = S.seg(lt, 0, 3.0), stop = lt > 3.0;
        const P = R.at(st.ty, 0.1, K(lt, [[0, 5.0], [3.0, 8.4]]), Object.assign({}, lt > 4.4 ? EXPR.terror : EXPR.worried, { face: stop && lt > 4.2 ? 0 : Math.PI, gait: stop ? null : { phase: lt * 0.9, stride: 140, kind: 'walk' },
          mouth: SH.mouth(['t04'], { open: 0, smile: 0 }, { smile: -0.6, amp: 1 }) }));
        st.ty.svg.style.filter = `brightness(${lt > 4.2 ? 0.55 : 0.25})`;
        st.sil.forEach((s2, i) => { const turn = S.seg(lt, 1.4 + i * 0.12, 2.2 + i * 0.12), lunge = E.inCubic(S.seg(lt, 4.6, 6.9));
          R.put(s2.el, s2.x + (0.1 - s2.x) * lunge * 0.55, s2.z + (8.8 - s2.z) * lunge * 0.55, 1.65, 300, { rot: Math.sin(lt * 1.3 + s2.ph) * 3 }); s2.el.style.filter = `brightness(${0.6 + turn * 0.4})`; });
      } },
    { // G: steel shutters slam down. The magnetic lock. Red emergency light. "Click. The doors lock by themselves..." -> "Tyler went to look. He never came back."
      t0: 39.5, setup(W) {
        const world = SETS.entrance('red', { seed: 7 }); const R = SH.stage(W, world, { outside: (cv) => PROPS.lot(cv, { seed: 8, lampX: 0.5 }), fx: { flicker: true, beacon: [1750, 90], dust: 50 } });
        const sh = R.prop(PROPS.shutter(R.A, 0, 0, 1600, 300)); return { R, sh, bob: R.actor('bob'), h: R.actor('hallSick') };
      },
      draw(lt, st, t) {
        const R = st.R, back = t > 47.5;
        const cam = back ? SH.cam3(t - 47.5, [[0, 1.0, 0.95, 5.5, 3.6, -0.08, 1100], [9.5, 0.8, 0.95, 5.3, 3.55, -0.07, 1300]], { hand: 0.5 })
                         : SH.cam3(lt, [[0, 0.2, 1.45, 0.2, 0, -0.03, 950], [1.0, 0.2, 1.45, 0.25, 0, -0.03, 950], [8, 0.0, 1.35, 1.4, 0.03, -0.03, 1050]], { hand: lt > 0.6 && lt < 1.2 ? 6 : 0.4 });
        R.frame(t, cam);
        st.sh.drop(E.inQuad(S.seg(lt, 0, 0.8))); R.put(st.sh, 0, 5.9, 3.0, 300, { front: true });
        R.at(st.h, -0.1, 4.3, Object.assign({}, EXPR.exhausted, { face: Math.PI / 2, lean: -86, lid: 1, mouth: { open: 0.15, smile: -0.3 }, armL: [70, -10], armR: [40, -20], shadow: 0.2 }));
        R.at(st.bob, 0.55, 4.6, Object.assign({}, lt > 1.2 ? EXPR.terror : EXPR.scared, { face: back ? -2.6 : Math.PI, headFace: back ? -2.9 : Math.PI, crouch: 0.4, lean: 10, armL: [40, -40], armR: [40, -40], look: [0, back ? 0.5 : -0.1] }));
      } },
  ], { gfx: [
    { type: 'note', text: "MR. HALLORAN IS VERY SICK", icon: '!', at: 1.6, dur: 3.6 },
    { type: 'note', text: 'TYLER WENT OUTSIDE', icon: '!', at: 33.4, dur: 3.2 },
    { type: 'note', text: 'THE DOORS LOCKED. BOB IS TRAPPED INSIDE', icon: '!', at: 43.0, dur: 4.2 },
  ] });
})();
