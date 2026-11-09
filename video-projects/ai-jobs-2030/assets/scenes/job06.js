// JOB 06: Traditional Translator -> Cultural Localization Specialist (Sofia)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 6, color: G.g, color2: G.b, title: ['TRADITIONAL', 'TRANSLATOR'], oldCast: 'sofia_old', newCast: 'sofia_new',
    threats: [
      { // the globe translates contracts, videos and meetings in seconds, for pennies
        cam: (J, t0, t1) => path([[0, 160, 40, 1.3, 0.4], [(t1 - t0) * 0.5, 40, 0, 1.12, 0], [t1 - t0, -120, -20, 1.04, -0.4]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#020814,#071a33 60%,#020610') + K.rad(1180, 520, 1300, 1100, 'rgba(66,133,244,.25)'));
          d.L(5, K.motes(606, 80, '#cfe0ff', 0, 0, 1920, 1080, 2.5));
          const Gl = d.L(1.8, P.globe(1180, 520, 560, 'glb'));
          const land = Gl.querySelector('.landwrap');
          const items = [['📄 CONTRACT', G.b], ['▶ VIDEO', G.r], ['👥 MEETING', G.y]];
          const O = d.L(1.5, items.map(([t, c], i) => P.bubble(0, 0, t, c, 34, 'orb')).join('') + ['Hello → Hola', 'Thanks → Merci', 'Deal → 成交', 'Price → Preis', 'Yes → Sí'].map((t, i) => P.bubble(0, 0, t, '#1f2a44', 26, 'sub')).join(''));
          const orbs = [...O.querySelectorAll('.orb')], subs = [...O.querySelectorAll('.sub')];
          let books = ''; for (let i = 0; i < 9; i++) books += `<div class="fl-a" style="left:${120 + (i % 3) * 18}px;top:${880 - i * 40}px;width:260px;height:38px;border-radius:5px;background:${['#8d6e63', '#5d4037', '#a1887f'][i % 3]};box-shadow:0 2px 0 rgba(0,0,0,.4)"><div style="margin:12px 30px;height:6px;background:#e8d7b0;opacity:.6"></div></div>`;
          const A = d.L(1.2, books);
          const so = actor(A, Object.assign({ id: 'j6a', x: 560, y: 1090, h: 720, face: 'worried', look: [0.9, -0.3], rim: '#8ab4f8', rim2: G.g }, J.oldCast));
          const hud = d.hud();
          const tSec = J.w('in seconds', t0).S, tPen = J.w('pennies', t0).S;
          const tIt = [J.w('legal contracts', t0).S, J.w('videos', t0).S, J.w('live business meetings', t0).S];
          const k1 = key(hud, `IN <span style="color:${G.g}">SECONDS</span>`, 110, 90, 120, '#fff', tSec, tPen - 0.1);
          const k2 = key(hud, `FOR <span style="color:${G.y}">PENNIES</span>`, 110, 90, 120, '#fff', tPen, null);
          const coin = el(hud, `<div class="fl-a" style="left:640px;top:70px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe082,${G.y} 50%,#b8860b);box-shadow:0 0 40px ${G.y};font:900 64px Figtree;color:#7a5200;text-align:center;line-height:150px;opacity:0">1¢</div>`);
          tIt.forEach((t) => sfx('pop', t, 0.35)); sfx('coin', tPen + 0.2, 0.5);
          d.on((T, lt) => {
            land.style.transform = `translateX(${(((lt * 60) % 560) - 280).toFixed(0)}px)`;
            orbs.forEach((n, i) => { const a = lt * 0.6 + i * 2.1; n.style.transform = `translate(${(1180 + Math.cos(a) * 420 - 110).toFixed(0)}px,${(500 + Math.sin(a) * 200).toFixed(0)}px) scale(${Math.min(1, S.E.outBack(S.seg(T, tIt[i], tIt[i] + 0.4))).toFixed(3)})`; n.style.zIndex = Math.sin(a) > 0 ? 3 : 0; });
            subs.forEach((n, i) => { const a = -lt * 0.45 + i * 1.26; n.style.transform = `translate(${(1180 + Math.cos(a) * 340 - 90).toFixed(0)}px,${(520 + Math.sin(a) * 300).toFixed(0)}px)`; n.style.opacity = (0.5 + 0.5 * Math.sin(a + 1)).toFixed(2); });
            const c = S.E.outBack(S.seg(T, tPen + 0.1, tPen + 0.5)); coin.style.opacity = Math.min(1, c * 2).toFixed(2); coin.style.transform = `scale(${c.toFixed(3)}) rotateY(${(lt * 200 % 360).toFixed(0)}deg)`;
            so.set({ face: T > tSec ? 'sad' : 'worried', pose: T > tPen ? 'shrug' : 'idle' }, T, lt);
            k1(T); k2(T);
          });
        } },
    ],
    pivot: { role: ['LOCALIZATION', 'SPECIALIST'], roleAt: 'cultural localization', color: G.g, bg: '#020d0a,#0a2a22 60%,#020806', pose: 'present', size: 110,
      props(d, flip) {
        const x0 = flip ? 90 : 1040;
        const L = d.L(1.6, `<div class="fl-a" style="left:${x0}px;top:560px;width:640px;height:150px;border-radius:24px;background:#2a1215;border:3px solid ${G.r};padding:24px 30px;box-sizing:border-box"><div style="font:800 28px Figtree;color:#ffb4ab">WORD FOR WORD</div><div style="font:900 40px Figtree;color:#fff">“Stiff as a textbook.”</div></div>
          <div class="fl-a good" style="left:${x0 + 60}px;top:760px;width:640px;height:150px;border-radius:24px;background:#0f2a1a;border:3px solid ${G.g};padding:24px 30px;box-sizing:border-box"><div style="font:800 28px Figtree;color:#a8e6b8">LOCALIZED</div><div style="font:900 40px Figtree;color:#fff">“Feels made right here.”</div></div>` +
          P.cross(x0 + 590, 530, 1, 'x1') + P.check(x0 + 650, 730, 1, G.g, 'c1'));
        const good = L.querySelector('.good'), c1 = L.querySelector('.c1');
        return (T, lt) => { P.pop(good, T, T - lt + 2.4, 0.7); P.pop(c1, T, T - lt + 2.9); };
      } },
    prompt: { title: 'Localization audit', key: `TYPE INTO <span style="color:${G.g}">ChatGPT</span>`, size: 34,
      hi: { translator: G.y, cultural: G.g, localization: G.g, target: G.b, language: G.b, country: G.b, five: G.y, examples: G.y, slogans: G.y, fail: G.r, awkward: G.r, word: G.r, pitch: G.b, brand: G.b, voice: G.b, humor: G.y, references: G.g, local: G.g, sales: G.g } },
  });
})();
