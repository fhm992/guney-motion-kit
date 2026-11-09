// JOB 09: Retail Cashier & Bank Teller -> Personal Relationship Banker (Sam)
(() => {
  const { K, G, path, actor, key, sfx, el } = FILM, S = STAGE, P = PROPS;
  JOB.make({
    n: 9, color: G.b, color2: G.y, title: ['CASHIER &', 'BANK TELLER'], oldCast: 'sam_old', newCast: 'sam_new',
    threats: [
      { // night supermarket: self-checkout lanes, mobile banking, kiosks
        cam: (J, t0, t1) => path([[0, -260, 30, 1.25, 0.3], [(t1 - t0) * 0.5, -40, 0, 1.1, 0], [t1 - t0, 200, -20, 1.0, -0.3]]),
        build(d, J, t0, t1) {
          d.L(8, K.sky('#0b0d12,#151a22 60%,#0a0c10') + Array.from({ length: 7 }, (_, i) => `<div class="fl-a" style="left:${150 + i * 260}px;top:60px;width:200px;height:16px;background:#e8f0ff;box-shadow:0 0 50px 14px rgba(200,220,255,.5);opacity:${0.9 - i * 0.08}"></div>`).join(''));
          d.L(4, `<svg class="fl-a" style="left:0;top:0;width:1920px;height:1080px" viewBox="0 0 1920 1080"><path d="M0 200 L640 360 L640 800 L0 940Z" fill="#1c222c"/>${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${280 + i * 120} L640 ${400 + i * 78}" stroke="#2c3440" stroke-width="10"/>`).join('')}${Array.from({ length: 16 }, (_, i) => `<rect x="${20 + (i % 4) * 150}" y="${230 + Math.floor(i / 4) * 125}" width="60" height="70" fill="${K.GC[i % 4]}" opacity=".55"/>`).join('')}</svg>` + K.floor(800, '#2a2f38', '#0d0f13'));
          let k = ''; for (let i = 0; i < 4; i++) k += `<div class="fl-a kio" style="left:${1080 + i * 190}px;top:${470 + i * 12}px;width:160px;height:340px;border-radius:14px;background:linear-gradient(180deg,#e8eaed,#9aa0a6)"><div style="margin:14px;height:120px;border-radius:8px;background:${G.b};box-shadow:0 0 50px ${G.b}"></div><div style="margin:0 14px;height:34px;border-radius:6px;background:${G.g}"></div></div>`;
          const Kk = d.L(1.6, k + P.device(1600, 160, 'phone', 1.2, `<div style="position:absolute;inset:0;background:#f4f6fa"><div style="height:60px;background:${G.b}"></div><div class="fl-t" style="position:relative;left:14px;top:20px;font-size:30px;color:#202124">$2,480.00</div><div style="margin:40px 14px 0;height:40px;border-radius:10px;background:${G.g}"></div></div>`, 'phone'));
          const kio = [...Kk.querySelectorAll('.kio')], phone = Kk.querySelector('.phone');
          const A = d.L(1.2);
          const sm = actor(A, Object.assign({ id: 'j9a', x: 520, y: 1040, h: 640, face: 'sad', look: [0.9, 0], rim: '#cfe0ff', rim2: G.b }, J.oldCast));
          el(A, `<div class="fl-a" style="left:240px;top:780px;width:640px;height:300px;background:linear-gradient(180deg,#3a3f4a,#16191f);border-radius:8px"><div style="position:absolute;left:420px;top:-80px;width:160px;height:90px;border-radius:8px;background:#22262e"><div style="margin:12px;height:40px;background:#0c2;opacity:.4"></div></div></div>`);
          const hud = d.hud();
          const tS = J.w('self -checkout lanes', t0).S, tM = J.w('mobile banking apps', t0).S, tK = J.w('automated kiosks', t0).S, tF = J.w('faster than almost', t0).S;
          const k1 = key(hud, `<span style="color:${G.b}">SELF-CHECKOUT</span>`, 110, 90, 110, '#fff', tS, tM - 0.1);
          const k2 = key(hud, `<span style="color:${G.g}">MOBILE</span> BANKING`, 110, 90, 110, '#fff', tM, tK - 0.1);
          const k3 = key(hud, `<span style="color:${G.y}">KIOSKS</span> EVERYWHERE`, 110, 90, 110, '#fff', tK, null);
          kio.forEach((n, i) => sfx('beep', tS + 0.3 + i * 0.3, 0.25)); sfx('ping', tM + 0.3, 0.3);
          d.on((T, lt) => {
            kio.forEach((n, i) => P.pop(n, T, tS + 0.2 + i * 0.3, 0.7));
            P.pop(phone, T, tM + 0.2, 0.5); phone.style.transform += ` translateY(${(Math.sin(lt * 1.6) * 10).toFixed(1)}px)`;
            sm.set({ face: T > tF ? 'worried' : 'sad', look: [0.9, -0.1] }, T, lt);
            k1(T); k2(T); k3(T);
          });
        } },
    ],
    pivot: { role: ['RELATIONSHIP', 'BANKER'], roleAt: 'personal relationship banker', color: G.y, bg: '#120c03,#2e2208 60%,#0a0702', pose: 'present', size: 110,
      props(d, flip) {
        const x0 = flip ? 300 : 1400;
        const L = d.L(1.6, `<div class="fl-a" style="left:${x0 - 260}px;top:860px;width:560px;height:200px;border-radius:12px;background:linear-gradient(180deg,#6d4c41,#3e2723)"></div>`);
        const cl = actor(L, { id: 'cl9', cast: 'maya', x: x0, y: 1010, h: 560, pose: 'present', face: 'smile', look: [flip ? 0.8 : -0.8, -0.1], rim: G.y, rim2: '#ffffff', css: flip ? '' : 'transform:scaleX(-1)' });
        const heart = el(L, `<div class="fl-a" style="left:${x0 - 40}px;top:600px;font:900 90px Figtree;color:${G.r};text-shadow:0 0 30px ${G.r}">♥</div>`);
        return (T, lt) => { cl.set({ face: lt > 2 ? 'happy' : 'smile' }, T, lt); heart.style.transform = `translateY(${(-lt * 6).toFixed(0)}px) scale(${(0.9 + 0.1 * Math.sin(lt * 4)).toFixed(3)})`; heart.style.opacity = S.seg(lt, 2, 2.5).toFixed(2); };
      } },
    prompt: { title: 'Interview practice', key: `OPEN <span style="color:${G.b}">ChatGPT</span>`, size: 32,
      hi: { bank: G.b, teller: G.b, cashier: G.b, three: G.y, years: G.y, consultative: G.y, sales: G.y, personal: G.g, relationship: G.g, banking: G.g, resume: G.b, bullets: G.b, trust: G.g, upselling: G.g, problem: G.g, solving: G.g, roleplay: G.r, interview: G.r, confident: G.y } },
  });
})();
