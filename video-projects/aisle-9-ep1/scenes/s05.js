// @scene s05 48 Beat 5 - The Stockroom
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const room = () => SETS.stockroom('warm', { seed: 9 });
  const FXW = { dust: 70, beamK: 0.9, dustK: 1.3 };
  const doorCol = (u) => { const r = Math.round(S.lerp(255, 150, u)), g = Math.round(S.lerp(74, 165, u)), b = Math.round(S.lerp(58, 185, u)); return `rgb(${r},${g},${b})`; };
  SH.run('s05', 's05', 48, [
    { // A: Bob slips in, eases the door shut, slides down against it
      t0: 0, setup(W) { const world = room(); const R = SH.stage(W, world, { fx: FXW }); return { R, world, bob: R.actor('bob') }; },
      draw(lt, st, t) {
        const R = st.R; st.world.doorStrip.fill = st.world.doorStrip.crack.fill = doorCol(0);
        R.frame(t, SH.cam3(lt, [[0, 1.2, 1.3, 1.6, -2.75, -0.08, 1000], [2.4, 0.9, 1.1, 1.0, -2.8, -0.08, 1150]], { hand: 0.4 }));
        const slide = E.inOutCubic(S.seg(lt, 1.0, 2.3));
        R.at(st.bob, 0.15, -2.55, Object.assign({}, EXPR.scared, { face: lt < 1.0 ? 0 : Math.PI, crouch: slide * 0.7, armR: lt < 1.0 ? [60, -60] : [-10, -120], armL: lt < 1.0 ? [20, -20] : [-10, -120], look: [0.4, 0], mouth: { open: 0.2 + Math.abs(Math.sin(lt * 5)) * 0.1, smile: -0.5, wide: 0.6 } }));
      } },
    { // B: sitting against the door. "Okay. Think. Tyler's gone. The doors are sealed..."
      t0: 2.4, setup(W) { const world = room(); const R = SH.stage(W, world, { fx: FXW, dof: 1.5 }); return { R, world, bob: R.actor('bob') }; },
      draw(lt, st, t) {
        const R = st.R; st.world.doorStrip.fill = st.world.doorStrip.crack.fill = doorCol(0);
        R.frame(t, SH.cam3(lt, [[0, 0.9, 0.85, -0.6, -2.82, 0.04, 1050], [12.6, 0.25, 0.7, -1.55, -3.05, 0.04, 1450]], { ease: E.inOutSine, hand: 0.3 }));
        R.at(st.bob, 0.15, -2.55, Object.assign({}, EXPR.exhausted, { face: Math.PI, crouch: 0.7, look: [Math.sin(lt * 0.4) * 0.6, 0.2], lid: 0.25, browUp: 0.6, brow: 0.5, armL: [-15, -125], armR: [-15, -125], headTilt: -6 + Math.sin(lt * 0.5) * 4, blink: TOON.blinkAt(lt, 3.4), bob: Math.sin(lt * 2.2) * 3 }));
      } },
    { // C: through the crack in the door - shoppers drifting: a woman with her basket, a man in pajamas
      t0: 15.0, setup(W, O) {
        const world = SETS.aisle('mixed', 'red', { seed: 81, sign: 'AISLE 4', sub: 'SNACKS', signColor: '#7a1010', header: 'SNACKS' });
        const R = SH.stage(W, world, { fx: { flicker: true, dust: 40, beamK: 0.6, beamMax: 9 } });
        const bk = R.prop(PROPS.basket(R.A));
        SH.div(O, 'left:0;top:0;width:800px;height:1080px;background:#000;box-shadow:40px 0 70px 40px #000'); SH.div(O, 'left:1120px;top:0;width:800px;height:1080px;background:#000;box-shadow:-40px 0 70px 40px #000');
        SH.div(O, 'left:800px;top:0;width:320px;height:1080px;background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,rgba(0,0,0,.55))');
        return { R, zw: R.actor('zBasketW'), zp: R.actor('zPajama'), bk };
      },
      draw(lt, st, t) {
        const R = st.R; R.frame(t, SH.cam3(lt, [[0, 0.1, 1.3, -1.0, -0.06, -0.03, 1100], [13.8, 0.1, 1.3, -0.6, 0.06, -0.03, 1150]]));
        const xw = K(lt, [[0, -1.3], [9, 1.2]], E.lin);
        const P = R.at(st.zw, xw, 4.2, Object.assign({}, EXPR.zombie, SH.shamble(lt, 0, 0.6), { face: Math.PI / 2, gait: { phase: lt * 0.35, stride: 70, kind: 'shamble' }, armR: [40, -70] }));
        R.put(st.bk, xw + 0.12, 4.15, 0.32, 150, { y: 0.55 + Math.sin(lt * 2) * 0.02 });
        R.at(st.zp, K(lt, [[4, 1.4], [13.8, -1.3]], E.lin), 6.0, Object.assign({}, EXPR.zombie, SH.shamble(lt + 2, 4, 0.5), { face: -Math.PI / 2, gait: { phase: lt * 0.3, stride: 60, kind: 'shamble' }, look: [0, 0.3] }));
      } },
    { // D: a metallic clink deep in the stockroom. A can rolls out of the dark and stops. "Hello?" / "Probably a rat."
      t0: 28.8, setup(W) { const world = room(); const R = SH.stage(W, world, { fx: FXW }); return { R, world, bob: R.actor('bob'), can: R.prop(PROPS.can(R.A, 'BEANS', '#C9302C', 1)) }; },
      draw(lt, st, t) {
        const R = st.R; st.world.doorStrip.fill = st.world.doorStrip.crack.fill = doorCol(0.05);
        const whip = E.outCubic(S.seg(lt, 0.15, 0.45));
        R.frame(t, SH.cam3(lt, [[0, -0.2, 0.75, -1.3, -2.9, 0.03, 1300], [0.5, -0.2, 0.75, -1.3, -2.9, 0.03, 1300], [1.2, 0.4, 1.0, -0.6, 0.12, -0.06, 1000], [10.5, 0.35, 1.0, 0.4, 0.15, -0.05, 1250]], { hand: lt > 0.2 && lt < 1.2 ? 5 : 0.5 }));
        R.at(st.bob, 0.15, -2.55, Object.assign({}, lt < 0.5 ? EXPR.exhausted : EXPR.scared, { face: Math.PI, headFace: Math.PI + S.lerp(0, 0.9, whip), crouch: 0.7, look: [0.3, 0], armL: [-15, -125], armR: [-15, -125], mouth: SH.mouth(['b07'], { open: 0, smile: -0.6, wide: 0.6 }, { smile: -0.5, amp: 0.4, wide: 0.6 }) }));
        const r = S.seg(lt, 0.3, 2.6); R.put(st.can, S.lerp(-2.6, -0.9, E.outCubic(r)), S.lerp(6.0, 4.2, E.outCubic(r)), 0.14, 190, { rot: r * 520 });
      } },
    { // E: time-lapse - the light under the door goes from red to grey while the clock jumps 1:00 -> 6:00
      t0: 39.3, setup(W) { const world = room(); const R = SH.stage(W, world, { fx: FXW }); return { R, world, bob: R.actor('bob'), clk: R.prop(PROPS.clock(R.A, 110, 110, 110)) }; },
      draw(lt, st, t) {
        const R = st.R, u = S.seg(lt, 0.6, 7.6); st.world.doorStrip.fill = st.world.doorStrip.crack.fill = doorCol(u);
        R.frame(t, SH.cam3(lt, [[0, 1.6, 1.4, 0.6, -2.62, -0.12, 950], [8.7, 1.3, 1.3, 0.2, -2.68, -0.1, 1050]]));
        const mins = 60 + u * 300; st.clk.set(Math.floor(mins / 60), mins % 60); R.put(st.clk, -1.6, -2.95, 0.5, 220, { y: 2.2 });
        R.at(st.bob, 0.15, -2.55, Object.assign({}, EXPR.exhausted, { face: Math.PI, crouch: 0.7, lid: S.lerp(0.3, 0.6, u), look: [0.5, -0.2], armL: [-15, -125], armR: [-15, -125], headTilt: -6, blink: TOON.blinkAt(lt, 2.8) }));
        R.F.style.filter = ''; // grade handled by the door light
      } },
  ], { fades: [[0, 0.5, 1, 0], [47.3, 48, 0, 1]], gfx: [
    { type: 'stamp', text: 'THE STOCKROOM', sub: 'STAFF ONLY · 1:00 AM', at: 0.6, dur: 4 },
    { type: 'note', text: 'THE SHOPPERS JUST WANDER... UNTIL THEY HEAR SOMETHING', icon: '!', at: 22.0, dur: 4.6 },
  ] });
})();
