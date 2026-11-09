// JOB 02: Tier 1 Customer Support Rep -> Customer Success Manager / AI Conversation Designer (Lena)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 2, color: G.r, color2: G.b, title: ['CUSTOMER', 'SUPPORT REP'], oldCast: 'lena_old', newCast: 'lena_new',
    threats: [
      { // 2 AM: the bots answer everything in 40 languages
        cam: (J, t0, t1) => path([[0, 0, 60, 1.35, 0], [(t1 - t0) * 0.5, -60, 20, 1.15, -0.3], [t1 - t0, -160, -20, 1.0, -0.5]]),
        build(d, J, t0, t1) {
          d.L(6, K.sky('#05081a,#0c1433 60%,#05060c') + P.win(90, 90, 360, 440, 'linear-gradient(180deg,#0e1840,#1a2a5a)', `<div style="position:absolute;left:190px;top:60px;width:96px;height:96px;border-radius:50%;background:#f1f3f4;box-shadow:0 0 70px 20px rgba(220,230,255,.5)"></div>`));
          const langs = ['Hola!', 'Bonjour', 'こんにちは', 'مرحبا', 'Hallo', 'Olá', '你好', 'Ciao', 'नमस्ते', 'Привет', 'Merhaba', '안녕하세요', 'Hej', 'Salut', 'Xin chào', 'Jambo'];
          const B = d.L(2.2, langs.map((l, i) => P.bubble(560 + (i % 4) * 330 + (Math.floor(i / 4) % 2) * 100, 70 + Math.floor(i / 4) * 120, l, K.GC[i % 4], 34, 'lb')).join(''));
          const bubs = [...B.querySelectorAll('.lb')];
          const R = d.L(1.7, P.robot(1500, 560, 1.05, G.b, 'rb'));
          const tix = d.L(1.5, ['PASSWORD RESET', 'SHIPPING QUESTION', 'REFUND REQUEST'].map((t, i) => `<div class="fl-a tk" style="left:${820 + i * 40}px;top:${560 + i * 110}px;padding:18px 26px;border-radius:16px;background:#f4f6fa;font:800 30px Figtree;color:#202124;display:flex;gap:16px;align-items:center;box-shadow:0 14px 30px rgba(0,0,0,.4)">${t}${P.check(0, 0, 0.6).replace('fl-a', 'ck').replace('left:0px;top:0px;', 'position:relative;')}</div>`).join(''));
          const tks = [...tix.querySelectorAll('.tk')];
          const A = d.L(1.2, '');
          const ln = actor(A, Object.assign({ id: 'j2a', x: 360, y: 1180, h: 760, face: 'sad', look: [0.9, -0.5], rim: '#8ab4f8', rim2: G.r }, J.oldCast));
          el(A, P.desk(40, 900, 700));
          const hud = d.hud();
          const tTix = [J.w('password resets', t0).S, J.w('shipping questions', t0).S, J.w('refund requests', t0).S];
          const t40 = J.w('40 languages', t0).S, t2 = J.w('2 in the morning', t0).S;
          const k1 = key(hud, `<span style="color:${G.b}">40</span> LANGUAGES`, 1840, 870, 110, '#fff', t40, t2 - 0.1, { align: 'right' });
          const k2 = key(hud, `<span style="color:${G.y}">2:00</span> AM`, 1840, 870, 120, '#fff', t2, null, { align: 'right' });
          tTix.forEach((t) => sfx('ping', t, 0.35));
          bubs.forEach((b, i) => sfx('pop', J.T(t0) + 0.6 + i * 0.35, 0.15, (i % 2) * 0.6 - 0.3));
          d.on((T, lt) => {
            bubs.forEach((b, i) => { P.pop(b, T, J.T(t0) + 0.6 + i * 0.35); b.style.transform += ` translateY(${(Math.sin(lt * 1.3 + i) * 6).toFixed(1)}px)`; });
            tks.forEach((k, i) => { P.pop(k, T, tTix[i]); });
            R.firstChild.style.transform = `translateY(${(Math.sin(lt * 2) * 12).toFixed(1)}px)`;
            ln.set({ face: T > t40 ? 'worried' : 'sad', look: [0.9, -0.4] }, T, lt);
            k1(T); k2(T);
          });
        } },
      { from: 'The World Economic', // WEF: 92 million fading, 170 million growing
        cam: (J, t0, t1) => path([[0, 0, 220, 1.2, 0.3], [(t1 - t0) * 0.55, 40, 60, 1.05, 0], [t1 - t0, 80, -40, 1.12, -0.3]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#03050c,#0b1226 70%,#03050c') + K.rad(960, 900, 1800, 700, 'rgba(66,133,244,.18)'));
          d.L(4, K.motes(202, 70, ['#EA4335', '#34A853'], 0, 0, 1920, 1080, 3));
          const fl = d.L(1.8, `<div class="fl-a" style="left:-200px;top:880px;width:2320px;height:300px;background:linear-gradient(180deg,#0e1730,#03050c)"></div>`);
          const red = d.L(1.5, `<div class="fl-a" style="left:470px;top:300px;width:300px;height:580px">${Array.from({ length: 48 }, (_, i) => `<div class="blk" style="position:absolute;left:${(i % 6) * 50}px;bottom:${Math.floor(i / 6) * 72}px;width:46px;height:68px;border-radius:6px;background:${G.r};box-shadow:0 0 18px ${G.r}88"></div>`).join('')}</div>`);
          const blks = [...red.querySelectorAll('.blk')];
          const grn = d.L(1.5, `<div class="fl-a gt" style="left:1150px;top:880px;width:300px;height:0;border-radius:10px 10px 0 0;background:linear-gradient(180deg,${G.g},#0d3a1e);box-shadow:0 0 70px ${G.g}"></div>`);
          const gt = grn.querySelector('.gt');
          const A = d.L(1.2);
          const ln = actor(A, Object.assign({ id: 'j2b', x: 960, y: 1010, h: 380, face: 'shocked', look: [0, -0.9], rim: '#8ab4f8', rim2: G.g }, J.oldCast));
          const hud = d.hud();
          const t92 = J.w('92 million', t0).S, t170 = J.w('170 million', t0).S, tWEF = J.w('World Economic Forum', t0).S;
          const k0 = key(hud, 'WORLD ECONOMIC FORUM', 960, 70, 54, '#c9d1e0', tWEF, null, { align: 'center', css: 'letter-spacing:6px;font-weight:800' });
          const n92 = el(hud, `<div class="fl-t" style="left:620px;top:150px;font-size:120px;color:${G.r};transform:translateX(-50%)"></div>`);
          const n170 = el(hud, `<div class="fl-t" style="left:1300px;top:150px;font-size:120px;color:${G.g};transform:translateX(-50%)"></div>`);
          const l92 = key(hud, 'FADING', 620, 290, 52, '#fff', t92 + 0.6, null, { align: 'center', css: 'letter-spacing:8px;font-weight:800' });
          const l170 = key(hud, 'GROWING', 1300, 290, 52, '#fff', t170 + 0.6, null, { align: 'center', css: 'letter-spacing:8px;font-weight:800' });
          sfx('boom', t92, 0.6); sfx('boom', t170, 0.7); sfx('whoosh_up', t170 + 0.1, 0.4);
          d.on((T, lt) => {
            const a = S.E.outCubic(S.seg(T, t92, t92 + 1.2)), f = S.seg(T, t92 + 1.0, t92 + 5);
            n92.textContent = Math.round(92 * a) + 'M'; n92.style.opacity = a > 0 ? 1 : 0;
            blks.forEach((b, i) => { const k = (47 - i) / 47; const o = S.seg(f, k * 0.8, k * 0.8 + 0.2); b.style.opacity = (a * (1 - o)).toFixed(2); b.style.transform = `translateY(${(-o * 120).toFixed(0)}px) rotate(${(o * (i % 2 ? 40 : -40)).toFixed(0)}deg)`; });
            const g = S.E.outCubic(S.seg(T, t170, t170 + 2.5)); gt.style.height = (g * 640).toFixed(0) + 'px'; gt.style.top = (880 - g * 640).toFixed(0) + 'px';
            n170.textContent = Math.round(170 * g) + 'M'; n170.style.opacity = g > 0 ? 1 : 0;
            ln.set({ face: T > t170 + 1 ? 'smile' : 'shocked', look: T > t170 ? [0.8, -0.9] : [-0.7, -0.9] }, T, lt);
            k0(T); l92(T); l170(T);
          });
        } },
    ],
    pivot: { role: ['CUSTOMER SUCCESS', 'MANAGER'], roleAt: 'customer success manager', color: G.b, bg: '#060a18,#101a3a 60%,#05070e', pose: 'present', size: 104,
      props(d, flip) {
        const x0 = flip ? 80 : 1060;
        const L = d.L(1.6, [0, 1, 2].map((i) => P.robot(x0 + i * 230, 640 + (i % 2) * 40, 0.8, K.GC[i], 'pb')).join('') +
          P.bubble(x0 + 120, 500, 'I want a refund. NOW.', G.r, 32, 'angry', 'right') + P.bubble(x0 + 160, 500, 'Happy to help ♥', G.g, 32, 'calm', 'right'));
        const bots = [...L.querySelectorAll('.pb')], angry = L.querySelector('.angry'), calm = L.querySelector('.calm');
        return (T, lt) => {
          bots.forEach((b, i) => b.style.transform = `translateY(${(Math.sin(lt * 2 + i) * 10).toFixed(1)}px)`);
          const c = S.seg(lt, 6, 6.6); angry.style.opacity = (1 - c).toFixed(2); calm.style.opacity = c.toFixed(2);
          angry.style.transform = `translateX(${(Math.sin(lt * 30) * 3 * (1 - c)).toFixed(1)}px)`;
        };
      } },
    prompt: { title: 'Bot training portfolio', key: `OPEN <span style="color:${G.b}">ChatGPT</span>`, outro: 'Save that output', outroKey: `ADD IT TO <span style="color:${G.b}">LinkedIn</span>`, size: 34,
      hi: { conversation: G.y, designer: G.y, three: G.b, angry: G.r, complaints: G.r, decision: G.g, tree: G.g, empathetic: G.g, templates: G.g, trigger: G.r, words: G.r, human: G.b, agent: G.b } },
  });
})();
