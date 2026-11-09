// job.js: the shared shots every job chapter uses - chapter card, pivot transformation, prompt scene, CTA.
// A job file calls JOB.make({ ... }) with its own threat shots and pivot props.
(function () {
  const { K, G, path, actor, key, chat, sfx } = FILM, S = STAGE;
  const CUES = window.CUES;
  // cast presets: the worker in the old job and the same person after the switch
  const CAST = {
    priya_old: { cast: 'priya', glasses: false, top: 'shirt', topColor: '#C9B8A0', bottomColor: '#4A4036' },
    priya_new: { cast: 'priya' },
    lena_old: { cast: 'lena' },
    lena_new: { cast: 'lena', headset: false, top: 'blazer', topColor: '#4285F4', inner: '#F4F2EF', bottom: 'skirt', bottomColor: '#1E2A44', shoes: '#1E2A44' },
    theo_old: { hair: 'side', top: 'tee', topColor: '#FF8A3D', bottom: 'jeans', bottomColor: '#2B3A55', shoes: '#F4F2EF', beard: false },
    theo_new: { hair: 'side', top: 'blazer', topColor: '#7B3FA0', inner: '#F4F2EF', bottom: 'trousers', bottomColor: '#24203A', shoes: '#1A1A1E', glasses: true },
    omar_old: { cast: 'omar' },
    omar_new: { cast: 'omar', top: 'blazer', topColor: '#34A853', inner: '#F4F2EF', tie: '#0F5132', bottomColor: '#20302A' },
    kofi_old: { cast: 'kofi', headset: false, top: 'tee', topColor: '#9AA0A6' },
    kofi_new: { cast: 'kofi', headset: false, top: 'hoodie', topColor: '#1A73E8', glasses: true },
    sofia_old: { hair: 'long', hairColor: '#3a1a10', hairShine: '#c0704a', top: 'sweater', topColor: '#8D6E63', bottom: 'skirt', bottomColor: '#3E2723', shoes: '#3E2723', lashes: true, glasses: true },
    sofia_new: { hair: 'long', hairColor: '#3a1a10', hairShine: '#c0704a', top: 'blazer', topColor: '#00897B', inner: '#F4F2EF', bottom: 'skirt', bottomColor: '#123', shoes: '#123', lashes: true, lips: '#C2185B' },
    mia_old: { hair: 'bun', hairColor: '#1a1020', hairShine: '#a070c0', top: 'tee', topColor: '#F06292', bottom: 'jeans', bottomColor: '#2B3A55', shoes: '#F4F2EF', lashes: true },
    mia_new: { hair: 'bun', hairColor: '#1a1020', hairShine: '#a070c0', top: 'sweater', topColor: '#7E57C2', bottom: 'trousers', bottomColor: '#1F1A2E', shoes: '#F4F2EF', lashes: true, glasses: true },
    zara_old: { cast: 'zara' },
    zara_new: { cast: 'zara', top: 'blazer', topColor: '#1F2937', inner: '#F4F2EF', tie: null },
    sam_old: { cast: 'owner', top: 'apron', topColor: '#34A853' },
    sam_new: { cast: 'owner', top: 'blazer', topColor: '#1A3D7C', inner: '#F4F2EF', tie: '#FBBC05', bottomColor: '#1A2238' },
    ray_old: { hair: 'buzz', top: 'shirt', topColor: '#B0BEC5', tie: null, bottom: 'trousers', bottomColor: '#37474F', shoes: '#1A1A1E', headset: true, beard: true },
    ray_new: { hair: 'buzz', top: 'blazer', topColor: '#C62828', inner: '#F4F2EF', tie: null, bottom: 'trousers', bottomColor: '#212121', shoes: '#1A1A1E', beard: true },
  };

  // ---------------- chapter card ----------------
  function card(J) {
    const c = J.c, n = J.n, col = J.color, flip = n % 2 === 0;
    const tName = J.w('number').s, dur = c.desc - c.start - 0.25;
    return { t0: 0, t1: dur, fadeIn: 0.0, flash: 0.85,
      camPath: path(flip ? [[0, 120, 30, 1.12, -0.6], [dur, -80, -10, 1.0, 0.4]] : [[0, -120, 30, 1.12, 0.6], [dur, 80, -10, 1.0, -0.4]]),
      build(d) {
        d.L(6, K.sky('#05060a,#0b0d16 60%,#05060a') + K.rad(flip ? 520 : 1400, 520, 1300, 900, col + '33'));
        const sweep = d.L(4, `<div class="fl-a sw" style="left:0;top:-300px;width:420px;height:1800px;background:linear-gradient(90deg,transparent,${col}66,transparent);transform-origin:50% 50%"></div>`);
        const swEl = sweep.querySelector('.sw');
        d.L(3, K.motes(n * 7, 40, col, 0, 0, 1920, 1080, 4));
        const nx = flip ? 1000 : 90;
        const num = d.L(1.6, K.num(String(n).padStart(2, '0'), nx, 60, 560, col, 4) + K.num(String(n).padStart(2, '0'), nx, 60, 560, col).replace('class="fl-t"', 'class="fl-t fill"'));
        const fill = num.querySelector('.fill');
        const W = d.L(1.2, K.box(flip ? 160 : 1150, 690, 620, 400, 'linear-gradient(180deg,#151925,#090b11)', 'border-top:5px solid #2a3040;border-radius:8px'));
        const wk = actor(W, Object.assign({ id: 'cw' + n, x: flip ? 470 : 1460, y: 960, h: 620, pose: 'type', face: 'sad', look: [0, 0.5], rim: col, rim2: col, css: 'filter:brightness(.5)' }, J.oldCast));
        d.L(1.15, K.box(flip ? 100 : 1090, 760, 740, 400, 'linear-gradient(180deg,#0d1018,#05060a)', 'border-radius:6px'));
        const hud = d.hud();
        const tx = flip ? 140 : 140;
        const k1 = key(hud, J.title[0], flip ? 1840 : 140, 700, 140, '#fff', c.start + 0.5, null, { align: flip ? 'right' : 'left' });
        const k2 = key(hud, `<span style="color:${col}">${J.title[1]}</span>`, flip ? 1840 : 140, 850, 140, '#fff', c.start + 0.8, null, { align: flip ? 'right' : 'left' });
        sfx('stamp', c.start + 0.5, 0.6);
        d.on((T, lt) => {
          swEl.style.transform = `translateX(${(-500 + ((lt * 520) % 2900)).toFixed(0)}px) rotate(22deg)`;
          fill.style.opacity = (0.12 + 0.25 * S.seg(lt, 0, 0.4) * (1 - S.seg(lt, 0.4, 1.4))).toFixed(3);
          wk.set({}, T, lt);
          k1(T); k2(T);
        });
      } };
  }

  // ---------------- pivot: spotlight transformation into the new role ----------------
  // J.pivot = { props(d) -> update(T, lt), role: ['LINE 1', 'LINE 2'], roleAt: 'phrase', bg: [c1,c2], light }
  function pivot(J, t0, t1) {
    const c = J.c, P = J.pivot, col = P.color || J.color2 || G.g, flip = J.n % 2 === 1;
    const tBecome = J.w(P.at || 'becoming', t0 - 0.5).s, tRole = J.w(P.roleAt, t0 - 0.5).s;
    const ax = flip ? 1340 : 580;
    const dur = t1 - t0;
    return { t0, t1, fadeIn: 0.6, whoosh: 'whoosh_up',
      camPath: path(flip ? [[0, 260, 60, 1.25, 0.6], [tBecome - t0, 200, 30, 1.18, 0.3], [tBecome - t0 + 1.5, 120, 0, 1.06, 0], [dur, -140, -20, 1.0, -0.5]]
                         : [[0, -260, 60, 1.25, -0.6], [tBecome - t0, -200, 30, 1.18, -0.3], [tBecome - t0 + 1.5, -120, 0, 1.06, 0], [dur, 140, -20, 1.0, 0.5]]),
      build(d) {
        d.L(6, K.sky(P.bg || '#04080c,#0a1a22 60%,#04070a') + K.rad(ax, 560, 1300, 1100, col + '30'));
        d.L(4, K.motes(J.n * 13, 50, [G.b, G.r, G.y, G.g], 0, 0, 1920, 1080, 3));
        const upd = P.props ? P.props(d, flip) : null;
        const cone = d.L(1.5, `<div class="fl-a" style="left:${ax - 330}px;top:-100px;width:660px;height:1180px;background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.03) 80%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)"></div>` + `<div class="fl-a" style="left:${ax - 300}px;top:900px;width:600px;height:110px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.35),transparent 70%)"></div>`);
        const ring = el(cone, `<div class="fl-a" style="left:${ax - 220}px;top:950px;width:440px;height:80px;border-radius:50%;border:6px solid ${col};box-shadow:0 0 40px ${col}"></div>`);
        const A = d.L(1.2);
        const old = actor(A, Object.assign({ id: 'po' + J.n, x: ax, y: 975, h: 760, face: 'worried', look: [0, -0.4], rim: col, rim2: '#ffffff' }, J.oldCast));
        const neu = actor(A, Object.assign({ id: 'pn' + J.n, x: ax, y: 975, h: 760, face: 'determined', look: [flip ? -0.5 : 0.5, -0.2], rim: col, rim2: '#ffffff' }, J.newCast));
        const hud = d.hud();
        const kx = flip ? 110 : 1830, al = flip ? 'left' : 'right';
        const k0 = key(hud, 'SWITCH TO', kx, 150, 64, '#c9d1e0', J.T(tBecome - 0.2), null, { align: al, css: 'letter-spacing:6px;font-weight:800' });
        const k1 = key(hud, P.role[0], kx, 240, P.size || 120, '#fff', J.T(tRole), null, { align: al, css: 'text-shadow:0 14px 50px rgba(0,0,0,.6)' });
        const k2 = P.role[1] ? key(hud, `<span style="color:${col}">${P.role[1]}</span>`, kx, 240 + (P.size || 120) * 1.05, P.size || 120, '#fff', J.T(tRole) + 0.35, null, { align: al, css: 'text-shadow:0 14px 50px rgba(0,0,0,.6)' }) : null;
        sfx('chime', J.T(tBecome), 0.7); sfx('whoosh_up', J.T(tBecome) - 0.3, 0.5);
        d.on((T, lt) => {
          const t = t0 + lt, sw = S.seg(t, tBecome, tBecome + 0.7);
          // light sweeps up the body: old outfit below the line, new above
          const yCut = 975 - 820 * S.E.inOutCubic(sw);
          old.el.style.clipPath = `inset(0 0 ${Math.max(0, 975 - yCut)}px 0)`;
          neu.el.style.clipPath = sw >= 1 ? 'none' : `inset(${Math.max(0, yCut - (975 - 760))}px 0 0 0)`;
          neu.el.style.visibility = sw > 0 ? 'visible' : 'hidden'; old.el.style.visibility = sw < 1 ? 'visible' : 'hidden';
          ring.style.transform = `translateY(${(yCut - 975).toFixed(1)}px) scale(${(1 - 0.35 * sw).toFixed(3)})`; ring.style.opacity = (sw > 0 && sw < 1 ? 1 : 0);
          old.set({ face: t < tBecome - 1.5 ? 'focused' : 'worried' }, T, lt);
          neu.set({ pose: t > tBecome + 1.2 ? (P.pose || 'present') : 'idle', face: t > tBecome + 0.5 ? 'happy' : 'determined', talk: false }, T, lt);
          if (upd) upd(T, lt, t);
          k0(T); k1(T); if (k2) k2(T);
        });
      } };
  }
  const el = FILM.el;

  // ---------------- prompt: the person at a desk, camera flies into the chat window ----------------
  // J.prompt = { hi: {word: color}, title, accent, who: 'new'|'fahim', outro: phrase (sentence after the prompt) }
  function prompt(J, t0, t1) {
    const c = J.c, P = J.prompt || {}, col = J.color;
    const tOpen = c.prompt - c.start, tBody = c.body - c.start;
    const outroT = P.outro ? J.w(P.outro, tBody).s : null;
    const bodyEnd = outroT ?? (c.end_voice - c.start) + 0.2;
    const dur = t1 - t0;
    const winX = 660, winY = 170, winW = 1140, winH = 700;
    let ch;
    // camera: wide on the person -> into the window -> follows the typing -> (outro) pulls back
    const F = (t, fx, fy, z, r) => { const sc = 1 + (z - 1) / 1.5; return [t, (fx - 960) * sc * 1.5, (fy - 540) * sc * 1.5, z, r]; };
    const bt = bodyEnd - tBody;
    const keys = [F(0, 560, 560, 1.0, -0.4), F(tOpen - t0, 700, 540, 1.04, -0.2), F(tBody - t0 - 0.2, 1180, 450, 1.32, 0.2), F(tBody - t0 + 2, 1220, 420, 1.42, 0.3),
      F(tBody - t0 + bt * 0.55, 1230, 470, 1.46, 0.1), F(bodyEnd - t0, 1220, 520, 1.44, -0.1)];
    if (outroT) keys.push(F(dur, 900, 540, 1.02, -0.3)); else keys.push(F(Math.max(dur, keys[keys.length - 1][0] + 0.5), 1210, 540, 1.5, -0.2));
    for (let i = 1; i < keys.length; i++) if (keys[i][0] <= keys[i - 1][0] + 0.05) keys[i][0] = keys[i - 1][0] + 0.05;
    return { t0, t1, fadeIn: 0.6,
      camPath: path(keys),
      build(d) {
        d.L(7, K.sky(P.bg || '#07080f,#141833 60%,#07080f') + K.rad(1300, 480, 1400, 900, col + '2a'));
        d.L(5, `<div class="fl-a" style="left:-120px;top:120px;width:820px;height:600px;border:14px solid #1a1f33;border-radius:10px;overflow:hidden;background:linear-gradient(180deg,#0b1030,#1a1f4a)">${K.skyline(J.n * 3, 600, '#121733', 0.18, 80, 380, '#ffd27a', 0, 820).replace('width:1920px;height:1080px', 'width:820px;height:600px')}</div>` + K.motes(J.n * 17, 60, [G.b, G.r, G.y, G.g], 0, 0, 1920, 1080, 4));
        d.L(2.4, `<div class="fl-a" style="left:-60px;top:540px;width:90px;height:300px;border-radius:40px 40px 10px 10px;background:#1f5130"></div><div class="fl-a" style="left:-80px;top:800px;width:130px;height:110px;border-radius:10px;background:#3a2a22"></div>`);
        const win = d.L(1.5);
        ch = chat(win, { x: winX, y: winY, w: winW, h: winH, T0: c.body - 0.1, T1: c.start + bodyEnd, hi: P.hi || {}, size: P.size || 36, title: P.title || 'New chat', accent: col });
        ch.el.style.transformOrigin = '0 50%';
        const desk = d.L(1.0, K.rad(330, 560, 700, 600, 'rgba(138,180,248,.35)'));
        const who = P.who === 'fahim' ? { id: 'pf' + J.n } : Object.assign({ id: 'pw' + J.n }, J.newCast);
        const A = actor(desk, Object.assign({ x: 330, y: 1230, h: 900, pose: 'type', face: 'focused', look: [0.7, -0.3], rim: '#8ab4f8', rim2: col }, who));
        el(desk, `<div class="fl-a" style="left:170px;top:720px;width:330px;height:210px;border-radius:16px 16px 4px 4px;background:linear-gradient(160deg,#c9ced8,#7a808c 60%,#4a4f5a);box-shadow:0 30px 60px rgba(0,0,0,.6)"><div style="position:absolute;left:145px;top:85px;width:40px;height:40px;border-radius:50%;background:${col};opacity:.9;box-shadow:0 0 20px ${col}"></div></div>`);
        el(desk, K.box(-200, 925, 1300, 200, 'linear-gradient(180deg,#2a2f45,#0d0f1a)', 'border-radius:8px'));
        const hud = d.hud();
        const k = P.key ? key(hud, P.key, 110, 70, 84, '#fff', J.T(tOpen) - 0.1, J.T(tBody) - 0.4, { css: 'text-shadow:0 10px 40px #000' }) : null;
        const k2 = outroT && P.outroKey ? key(hud, P.outroKey, 1830, 140, 104, '#fff', J.T(outroT) + 0.3, null, { align: 'right', css: 'text-shadow:0 10px 40px #000' }) : null;
        // a soft key click for each spoken word of the prompt
        FILM.wordsBetween(c.body - 0.1, c.start + bodyEnd).forEach((w, i) => { if (i % 2 === 0) sfx('key', w.s, 0.22, 0.2); });
        sfx('ping', c.prompt + 0.6, 0.35); sfx('send', c.start + bodyEnd - 0.2, 0.4);
        const winOp = (lt) => S.E.outCubic(S.seg(t0 + lt, tOpen, tOpen + 0.7));
        d.on((T, lt) => {
          const t = t0 + lt, o = winOp(lt);
          ch.el.style.opacity = o.toFixed(3);
          ch.el.style.transform = `perspective(1600px) rotateY(${(-14 + 8 * o).toFixed(2)}deg) translateY(${((1 - o) * 80).toFixed(1)}px)`;
          ch.update(T);
          A.set({ face: t > tBody ? 'focused' : 'determined', look: t > tOpen ? [0.8, -0.4] : [0.4, -0.1], arms: t > tBody && t < bodyEnd ? { la: [-30 + 6 * Math.sin(lt * 14), 85, 'fist'], ra: [30 + 6 * Math.sin(lt * 13 + 1), -85, 'fist'] } : undefined }, T, lt);
          if (outroT) ch.el.style.filter = `brightness(${(1 - 0.6 * S.seg(t, outroT, outroT + 0.6)).toFixed(3)})`;
          if (k) k(T); if (k2) k2(T);
        });
      } };
  }

  // ---------------- CTA: Fahim asks for the comment ----------------
  function cta(J, t0, t1) {
    const c = J.c, dur = t1 - t0;
    const tComment = J.w('comment the word', t0 - 0.5).s;
    return { t0, t1, fadeIn: 0.6, whoosh: 'whoosh',
      camPath: path([[0, 200, 40, 1.1, 0.4], [dur, -60, 0, 1.0, -0.3]]),
      build(d) {
        d.L(6, K.sky('#0a0c16,#1b1f33 60%,#090a12') + K.rad(640, 560, 1100, 1000, 'rgba(234,67,53,.25)'));
        d.L(4, K.motes(91, 40, [G.b, G.r, G.y, G.g], 0, 0, 1920, 1080, 4));
        const A = d.L(1.2);
        const f = actor(A, { id: 'cta', x: 620, y: 1060, h: 860, pose: 'wave', face: 'happy', look: [0.4, -0.1], rim: G.y, rim2: G.b });
        const hud = d.hud();
        const box = el(hud, `<div class="fl-a" style="left:1020px;top:430px;padding:30px 50px;border-radius:30px;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.5);opacity:0"><span class="fl-t gw" style="position:relative;font-size:150px;letter-spacing:-3px"></span></div>`);
        const gw = box.querySelector('.gw'); const word = 'AI JOBS';
        const k1 = key(hud, 'COMMENT', 1030, 290, 110, '#fff', J.T(tComment), null);
        const k2 = key(hud, 'Free list of every prompt', 1040, 700, 54, '#c9d1e0', J.T(t0) + 0.4, null, { css: 'font-weight:800' });
        for (let i = 0; i < word.length; i++) if (word[i] !== ' ') sfx('key', J.T(tComment) + 0.6 + i * 0.09, 0.35);
        sfx('pop', J.T(tComment) + 0.4, 0.5);
        d.on((T, lt) => {
          const t = t0 + lt, a = S.E.outBack(S.seg(t, tComment + 0.3, tComment + 0.8));
          box.style.opacity = Math.min(1, a * 1.5).toFixed(3); box.style.transform = `scale(${(0.6 + 0.4 * a).toFixed(3)})`;
          const n = Math.floor(S.clamp((t - tComment - 0.6) / 0.09, 0, word.length));
          gw.innerHTML = K.gword(word.slice(0, n)) + (n < word.length ? '<span style="opacity:.3">|</span>' : '');
          f.set({ talk: true, pose: t > tComment ? 'point' : 'wave', look: t > tComment ? [0.9, 0] : [0.3, -0.1] }, T, lt);
          k1(T); k2(T);
        });
      } };
  }

  // ---------------- assemble a job ----------------
  // spec: { n, color, color2, title:[a,b], oldCast, newCast, threats:[{until: phrase|null, build, cam}], pivot:{...}, prompt:{...} }
  function make(spec) {
    const id = 'job' + String(spec.n).padStart(2, '0');
    const X = FILM.sec(id), c = Object.assign({}, CUES[id]);
    for (const k of Object.keys(c)) if (c[k] != null) c[k] = +c[k];
    const J = Object.assign({}, spec, { id, c, X, w: X.w, T: (lt) => X.T0 + lt,
      oldCast: CAST[spec.oldCast] || spec.oldCast, newCast: CAST[spec.newCast] || spec.newCast });
    const L = (abs) => abs - c.start;
    const shots = [card(J)];
    // threat shots between desc and pivot
    let t = L(c.desc) - 0.25;
    spec.threats.forEach((th, i) => {
      const end = i < spec.threats.length - 1 ? X.w(spec.threats[i + 1].from, t + 1).s - 0.25 : L(c.pivot) - 0.25;
      const a = t; shots.push(Object.assign({ fadeIn: 0.6 }, th, { t0: a, t1: end, build: (d) => th.build(d, J, a, end), camPath: th.cam(J, a, end) }));
      t = end;
    });
    shots.push(pivot(J, t, L(c.prep) - 0.25));
    const tEnd = c.cta ? L(c.cta) - 0.25 : X.DUR;
    shots.push(prompt(J, L(c.prep) - 0.25, tEnd));
    if (c.cta) shots.push(cta(J, tEnd, X.DUR));
    FILM.section(id, shots);
  }
  window.JOB = { make, CAST };
})();
