// @scene s03 51 Beat 3 - The Outbreak
(() => {
  const S = STAGE, E = S.E, K = SH.k;
  const BOBREST = { open: 0, smile: 0.2, wide: 0.9 };
  const register = (W, seed) => { SH.bokeh(W, { seed, mood: 'day' }); PROPS.counter(W, 120, 660, 1000); };
  SH.run('s03', 's03', 51, [
    { // A: "Same as always, sweetheart." / Bob teases him, scanning the cat food
      t0: 0, setup(W) {
        register(W, 61); const bob = SH.actor(W, 'bob'); PROPS.counterFront(W, 120, 730, 1000);
        const h = SH.actor(W, 'halloran'); const can = PROPS.can(W, 'MEOW', '#F06EA9', 0.5);
        return { bob, h, can, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 560, 1.0], [8.8, 940, 540, 1.08]]);
        const sc = S.seg(lt, 3.6, 4.4);
        st.bob.set({ x: 560, y: 1150, scale: 1.05, look: [0.8, 0.05], mouth: SH.mouth(['b02'], BOBREST, { smile: 0.55 }), browUp: 0.3,
          armR: [40 + 40 * Math.sin(sc * Math.PI), -70], armL: [16, -40], headTilt: 5, blink: TOON.blinkAt(lt, 3.2) });
        st.h.set({ x: 1380, y: 1110, scale: 0.98, flip: true, look: [-0.6, 0], mouth: SH.mouth(['h01'], { open: 0, smile: 0.55 }, { smile: 0.5, amp: 0.55 }),
          armL: [30, -50], armR: [20, -30], lean: 4, headTilt: -5, blink: TOON.blinkAt(lt, 2.9, 1), browUp: 0.4 });
        st.can.set(S.lerp(1120, 760, sc), 690, 0.5);
      } },
    { // B: he coughs; close-up on his hand - grey, dark veins
      t0: 8.8, setup(W) {
        register(W, 62);
        const hand = SH.div(W, 'left:700px;top:430px;width:520px;height:420px', `<svg viewBox="0 0 520 420" width="520" height="420">
          <defs><radialGradient id="hg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#7b867e"/><stop offset=".6" stop-color="#4b544e"/><stop offset="1" stop-color="#2a302c"/></radialGradient></defs>
          <rect x="-40" y="250" width="300" height="140" rx="60" fill="#9A6A44"/>
          <ellipse cx="300" cy="300" rx="150" ry="110" fill="url(#hg)"/>
          ${[0, 1, 2, 3].map((i) => `<rect x="${330 + i * 6}" y="${190 + i * 44}" width="190" height="56" rx="28" fill="url(#hg)" transform="rotate(${-10 + i * 8} 330 ${210 + i * 44})"/>`).join('')}
          <path d="M 200 280 q 40 -20 70 10 q 30 30 70 4 M 230 340 q 30 10 60 -14 q 30 -20 80 6 M 300 250 q 30 -30 70 -20" stroke="#1f2a40" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/></svg>`);
        PROPS.counterFront(W, 120, 820, 1000);
        return { hand, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 600, 1.15], [5.8, 980, 620, 1.35]], lt < 1.0 ? 14 : 0);
        st.hand.style.transform = `translateY(${lt < 1 ? Math.sin(lt * 40) * 6 : 0}px)`;
      } },
    { // C: he sways, sick; "Everything's... ringing." Bob sits him down, calls for Tyler
      t0: 14.6, setup(W) {
        register(W, 63); const bob = SH.actor(W, 'bob'); PROPS.counterFront(W, 120, 730, 1000);
        const h = SH.actor(W, 'hallSick'); return { bob, h, W };
      },
      draw(lt, st, t) {
        SH.cam(st.W, lt, [[0, 1000, 540, 1.05], [10.4, 1060, 560, 1.15]]);
        const sway = Math.sin(lt * 1.6) * 6;
        st.h.set({ x: 1380, y: 1110, scale: 0.98, flip: true, look: [Math.sin(lt * 2.3) * 0.5, 0.2], lid: 0.35 + 0.1 * Math.sin(lt),
          mouth: SH.mouth(['h02'], { open: 0.1, smile: -0.3 }, { smile: -0.3, amp: 0.5 }), armL: [24, -40], armR: [34, -90], lean: 4 + sway, headTilt: -10 + sway, browUp: 0.8, brow: 0.6 });
        const calling = SH.speaking('b03') && t > 22.3;
        st.bob.set({ x: 560, y: 1150, scale: 1.05, look: calling ? [-0.9, -0.1] : [0.8, 0.1], headTilt: calling ? -6 : 3, browUp: 1, brow: 0.5,
          mouth: SH.mouth(['b03'], { open: 0, smile: -0.4 }, { smile: -0.2 }), armR: [70, -40], armL: [16, -40], blink: TOON.blinkAt(lt, 3.0) });
      } },
    { // D: he collapses; cans roll; Bob vaults the counter
      t0: 25.0, setup(W) {
        register(W, 64); const bob = SH.actor(W, 'bob'); PROPS.counterFront(W, 120, 730, 1000);
        const h = SH.actor(W, 'hallSick'); const cans = [0, 1, 2, 3].map((i) => PROPS.can(W, ['MEOW', 'BEANS', 'SOUP', 'MEOW'][i], ['#F06EA9', '#C9302C', '#2FA36B', '#F06EA9'][i], 0.4));
        return { bob, h, cans, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 1060, 560, 1.15], [3.4, 960, 600, 1.0]], lt < 0.6 ? 18 * (1 - lt / 0.6) : 0);
        const fall = E.inCubic(S.seg(lt, 0, 0.45));
        st.h.set({ x: 1380, y: 1110 + fall * 40, scale: 0.98, flip: true, lean: fall * -88, lid: 0.9, mouth: { open: 0.2, smile: -0.4 }, armL: [40 + fall * 60, -20], armR: [40, -20], shadow: 0.2 });
        st.cans.forEach((c, i) => { const d = Math.max(0, lt - 0.1 - i * 0.12); c.set(1300 + d * (180 + i * 90) * Math.exp(-d * 0.5) - i * 60, 1000 - Math.abs(Math.sin(d * 8)) * 30 * Math.exp(-d * 3), 0.4, d * (300 + i * 80)); });
        const v = S.seg(lt, 0.5, 1.4), arc = Math.sin(v * Math.PI);
        st.bob.set({ x: S.lerp(560, 1080, E.inOutCubic(v)), y: 1150 - arc * 260 + (v >= 1 ? 160 : 0), scale: 1.05, lean: arc * 20, look: [0.9, 0.5], eyeScale: 1.1, pupil: 0.7, browUp: 1,
          mouth: { open: 0.4, smile: -0.6, wide: 0.7 }, armR: [80 - arc * 40, -20], armL: [80, -20], legL: arc * 30, legR: -arc * 30 });
      } },
    { // E: Bob kneels over him; Tyler jogs in from the entrance, pale
      t0: 28.4, setup(W) {
        SH.bokeh(W, { seed: 65, mood: 'day' }); const ty = SH.actor(W, 'tyler'); const bob = SH.actor(W, 'bob'); const h = SH.actor(W, 'hallSick');
        return { bob, h, ty, W };
      },
      draw(lt, st, t) {
        SH.cam(st.W, lt, [[0, 900, 600, 1.0], [13.4, 980, 580, 1.08]]);
        st.h.set({ x: 1240, y: 1010, scale: 0.9, lean: -88, lid: 0.85, mouth: { open: 0.15, smile: -0.3 }, armL: [30, -10], armR: [80, -10], shadow: 0 });
        const looksUp = t > 29.2;
        st.bob.set({ x: 640, y: 1330, scale: 1.0, flip: false, lean: 10, look: looksUp ? [0.8, -0.2] : [0.3, 0.9], headTilt: looksUp ? -4 : 14, browUp: 1, brow: 0.6,
          mouth: SH.mouth(['b04'], { open: 0, smile: -0.5 }, { smile: -0.4, amp: 0.85 }), armL: [70, -40], armR: [60, -50], blink: TOON.blinkAt(lt, 2.6) });
        const x = K(lt, [[0, 2200], [1.6, 1460, E.outCubic], [10.6, 1460], [13.4, 2300, E.inCubic]]);
        const wk = lt < 1.6 || lt > 10.6 ? SH.walk(lt, 1.2, 0.9, lt > 10.6) : SH.idle(lt, 2);
        st.ty.set(Object.assign({ legL: 0, legR: 0 }, wk, { x, y: 1110, scale: 0.94, flip: lt < 10.6, look: lt < 10.6 ? [-0.6, 0.1] : [0.9, 0], browUp: 1, brow: 0.5,
          mouth: SH.mouth(['t02', 't03'], { open: 0.05, smile: -0.2 }, { smile: SH.speaking('t03') ? 0.3 : -0.3 }), armL: wk.armL || [14, -10], armR: lt < 10.6 ? [70, -100] : (wk.armR || [14, -10]) }));
      } },
    { // F: through the glass: Tyler walks out into the lot; silhouettes turn toward him
      t0: 41.8, setup(W) {
        const lotc = SH.canvas(W, 2240, 1260, -160, -90); PROPS.lot(lotc, { seed: 8, lampX: 0.5 });
        const sil = []; const r = S.mulberry32(4);
        for (let i = 0; i < 16; i++) { const x = 100 + r() * 1700, y = 760 + r() * 80, s = 0.55 + r() * 0.3; sil.push({ el: PROPS.silhouette(W, x, y, s, '#05060c'), x, y, s, ph: r() * 6 }); }
        const ty = SH.actor(W, 'tyler');
        PROPS.doors(W, -40, -40, 2000, 1160);
        SH.div(W, 'left:-200px;top:-200px;width:2400px;height:1500px;background:rgba(120,160,220,.06)');
        return { ty, sil, W };
      },
      draw(lt, st, t) {
        SH.cam(st.W, lt, [[0, 960, 540, 1.0], [6.6, 960, 560, 1.12]]);
        const walkOut = S.seg(lt, 0, 2.6), stop = lt > 2.6;
        const wk = stop ? { legL: 0, legR: 0, bob: 0, armL: [10, -10], armR: [10, -10] } : SH.walk(lt, 0.8, 0.8);
        st.ty.set(Object.assign({}, wk, { x: 700, y: S.lerp(1250, 900, walkOut), scale: S.lerp(0.9, 0.55, walkOut), look: [0, -0.3], lid: 0,
          mouth: SH.mouth(['t04'], { open: 0, smile: 0 }, { smile: -0.6, amp: 1 }), eyeScale: lt > 4 ? 1.15 : 1, pupil: lt > 4 ? 0.6 : 1, browUp: lt > 3 ? 1 : 0, shadow: 0.2 }));
        st.ty.svg.style.filter = 'brightness(.12) saturate(0)';
        st.sil.forEach(({ el, x, s, ph }, i) => { const turn = S.seg(lt, 1.4 + i * 0.12, 2.2 + i * 0.12), lunge = S.seg(lt, 4.6, 6.6);
          el.style.transform = `translate(${(960 - x) * lunge * 0.4}px, 0) scaleX(${1 - 2 * turn * (x > 960 ? 1 : 0) * 0.5}) rotate(${Math.sin(lt * 1.3 + ph) * 3}deg)`; });
      } },
    { // G: steel shutters slam down; magnetic lock; red emergency light
      t0: 48.4, setup(W, O) {
        const lotc = SH.canvas(W, 2240, 1260, -160, -90); PROPS.lot(lotc, { seed: 8, lampX: 0.5 });
        const sh = PROPS.shutter(W, -40, -40, 2000, 1160); PROPS.doors(W, -40, -40, 2000, 1160);
        const red = SH.div(O, 'inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,40,30,.45),rgba(40,0,0,.8));opacity:0');
        return { sh, red, W };
      },
      draw(lt, st) {
        SH.cam(st.W, lt, [[0, 960, 540, 1.0], [2.6, 960, 540, 1.0]], lt > 0.7 && lt < 1.1 ? 26 : 0);
        st.sh.drop(E.inQuad(S.seg(lt, 0.0, 0.8)));
        st.red.style.opacity = lt > 1.5 ? (S.hash(Math.floor(lt * 12)) > 0.85 ? 0.6 : 1) : 0;
      } },
  ]);
})();
