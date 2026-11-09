// JOB 07: Junior Graphic Designer -> Brand Systems Director / UX Product Designer (Mia)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 7, color: G.r, color2: G.y, title: ['JUNIOR GRAPHIC', 'DESIGNER'], oldCast: 'mia_old', newCast: 'mia_new',
    threats: [
      { // a 10-word text box makes banners and icons
        cam: (J, t0, t1) => path([[0, -100, -60, 1.25, -0.3], [(t1 - t0) * 0.5, 0, 0, 1.08, 0], [t1 - t0, 100, 40, 1.0, 0.3]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#12060a,#2a0f18 60%,#0a0306') + K.rad(1100, 460, 1400, 900, 'rgba(234,67,53,.22)'));
          d.L(5, K.motes(707, 60, [G.r, G.y, G.b, G.g], 0, 0, 1920, 1080, 3));
          const box = d.L(1.5, `<div class="fl-a" style="left:700px;top:160px;width:980px;height:110px;border-radius:55px;background:#f4f6fa;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 60px rgba(234,67,53,.35);display:flex;align-items:center;padding:0 40px;box-sizing:border-box;font:700 38px Figtree;color:#202124"><span class="pt"></span><span style="display:inline-block;width:4px;height:44px;background:#202124;margin-left:4px"></span><div style="position:absolute;right:16px;width:80px;height:80px;border-radius:40px;background:${G.r}"></div></div>`);
          const pt = box.querySelector('.pt'); const promptTxt = 'summer sale banner, bold, friendly, orange, simple icons, clean';
          const tiles = [];
          let g = ''; for (let i = 0; i < 12; i++) { const c = K.GC[i % 4]; g += `<div class="fl-a tile" style="left:${700 + (i % 4) * 250}px;top:${330 + Math.floor(i / 4) * 210}px;width:230px;height:190px;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,${c},${K.GC[(i + 1) % 4]});box-shadow:0 16px 40px rgba(0,0,0,.45)">${i % 3 === 0 ? `<div class="fl-t" style="position:relative;left:20px;top:60px;font-size:44px">SALE</div>` : i % 3 === 1 ? `<div style="position:absolute;left:65px;top:45px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.85)"></div>` : `<div style="position:absolute;left:40px;top:40px;width:150px;height:110px;border-radius:14px;background:rgba(0,0,0,.25)"></div>`}</div>`; }
          const T = d.L(1.4, g); const ts = [...T.querySelectorAll('.tile')];
          const A = d.L(1.2);
          const mi = actor(A, Object.assign({ id: 'j7a', x: 340, y: 1100, h: 760, face: 'focused', look: [0.9, -0.3], rim: '#ff8a80', rim2: G.r }, J.oldCast));
          el(A, `<div class="fl-a" style="left:470px;top:620px;width:24px;height:150px;border-radius:12px;background:#ddd;transform:rotate(25deg)"></div>`);
          const hud = d.hud();
          const tBox = J.w('text box', t0).S, tGen = J.w('image generators', t0).S;
          const k1 = key(hud, `A <span style="color:${G.y}">10-WORD</span> TEXT BOX`, 110, 870, 110, '#fff', tBox - 0.6, null);
          ts.forEach((n, i) => sfx('pop', tGen + 0.4 + i * 0.22, 0.18, (i % 4) * 0.3 - 0.45));
          d.on((T2, lt) => {
            const nC = Math.floor(S.clamp((T2 - J.T(t0) - 0.5) / 0.06, 0, promptTxt.length)); pt.textContent = promptTxt.slice(0, nC);
            ts.forEach((n, i) => P.pop(n, T2, tGen + 0.4 + i * 0.22, 0.3));
            mi.set({ face: T2 > tGen + 1 ? 'shocked' : 'focused', pose: T2 > tBox ? 'shrug' : 'idle' }, T2, lt);
            k1(T2);
          });
        } },
      { from: 'Across the entire', // the team shrinks to one director
        cam: (J, t0, t1) => path([[0, 0, 60, 1.0, 0], [t1 - t0, 0, 20, 1.22, 0]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#08080d,#16161f 60%,#060609'));
          d.L(2, K.floor(900, '#15151d', '#050507'));
          const A = d.L(1.3);
          const team = [{ cast: 'maya' }, { cast: 'omar' }, { cast: 'kofi', headset: false }, J.oldCast, { cast: 'priya' }, { cast: 'boss' }].map((c, i) => actor(A, Object.assign({ id: 'tm' + i, x: 260 + i * 280, y: 1000, h: 520, face: 'smile', look: [0, -0.1], rim: '#ffffff', rim2: '#8ab4f8' }, c)));
          const spot = el(A, `<div class="fl-a" style="left:${260 + 3 * 280 - 260}px;top:-100px;width:520px;height:1180px;background:linear-gradient(180deg,rgba(255,240,200,.3),rgba(255,240,200,.02));clip-path:polygon(42% 0,58% 0,100% 100%,0 100%);opacity:0"></div>`);
          const hud = d.hud();
          const tOne = J.w('hiring one person', t0).S, tShr = J.w('shrinking production teams', t0).S;
          const k1 = key(hud, `<span style="color:${G.r}">SHRINKING</span> TEAMS`, 960, 90, 110, '#fff', tShr, tOne - 0.1, { align: 'center' });
          const k2 = key(hud, `HIRING <span style="color:${G.y}">ONE PERSON</span>`, 960, 90, 110, '#fff', tOne, null, { align: 'center' });
          [0, 1, 2, 4, 5].forEach((i, k) => sfx('thud', tShr + 0.5 + k * 0.45, 0.25));
          d.on((T, lt) => {
            team.forEach((a, i) => { if (i === 3) { a.set({ face: T > tOne ? 'determined' : 'worried', look: [0, -0.2] }, T, lt); return; }
              const k = [0, 1, 2, -1, 3, 4][i], f = S.seg(T, tShr + 0.5 + k * 0.45, tShr + 1.0 + k * 0.45);
              a.el.style.opacity = (1 - f * 0.92).toFixed(2); a.el.style.filter = `brightness(${(1 - f * 0.7).toFixed(2)})`; a.set({ face: 'worried' }, T, lt); });
            spot.style.opacity = S.seg(T, tOne - 0.3, tOne + 0.5).toFixed(2);
            k1(T); k2(T);
          });
        } },
    ],
    pivot: { role: ['UX PRODUCT', 'DESIGNER'], roleAt: 'UI and UX', color: G.y, bg: '#0d0a02,#2a210a 60%,#080601', pose: 'point',
      props(d, flip) {
        const x0 = flip ? 80 : 1000;
        const scr = ['MENU', 'CART', 'PAY ✓'];
        const L = d.L(1.6, scr.map((s, i) => P.device(x0 + i * 270, 560 + (i % 2) * 30, 'phone', 1.5, `<div style="position:absolute;inset:0;background:#f4f6fa"><div style="height:44px;background:${K.GC[i]}"></div><div class="fl-t" style="position:relative;left:16px;top:20px;font-size:34px;color:#202124">${s}</div>${[0, 1, 2].map((k) => `<div style="margin:30px 16px 0;height:34px;border-radius:10px;background:#dfe5ee"></div>`).join('')}</div>`, 'ph')).join('') +
          `<svg class="fl-a" style="left:0;top:0;width:1920px;height:1080px;overflow:visible" viewBox="0 0 1920 1080"><path class="flow" d="M${x0 + 180} 740 C ${x0 + 240} 640, ${x0 + 300} 640, ${x0 + 330} 760 S ${x0 + 520} 860, ${x0 + 600} 760" stroke="${G.y}" stroke-width="8" fill="none" stroke-dasharray="20 14"/></svg>`);
        const flow = L.querySelector('.flow');
        return (T, lt) => { flow.style.strokeDashoffset = (-lt * 80).toFixed(0); };
      } },
    prompt: { title: 'UX case study', key: `TYPE INTO <span style="color:${G.r}">ChatGPT</span>`, size: 34,
      hi: { lead: G.y, ux: G.y, designer: G.y, graphic: G.b, product: G.b, design: G.b, restaurant: G.g, mobile: G.g, ordering: G.g, abandoning: G.r, cart: G.r, research: G.b, user: G.b, problem: G.b, map: G.g, customer: G.g, journey: G.g, three: G.y, screen: G.y, portfolio: G.g } },
  });
})();
