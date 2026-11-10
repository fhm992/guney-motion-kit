// shot.js: the AISLE 9 scene engine. A scene is a list of shots; each shot has its own layer (camera "world" + overlay),
// a setup() that builds its set and actors once, and a draw(lt) called every frame with the shot-local time.
// Everything is a pure function of time. Voice timings come from window.CUES[scene] (audio-src/cues/*.json).
(function () {
  const S = STAGE, E = S.E;
  const SH = { T: 0, scene: null };

  // ---------- keyframes: k(t, [[t0, v0], [t1, v1], ...], ease) -> number or array ----------
  SH.k = (t, keys, ease = E.inOutCubic) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [ta, va] = keys[i - 1], [tb, vb] = keys[i];
      if (t <= tb) {
        const u = (keys[i][2] || ease)(S.clamp((t - ta) / (tb - ta || 1e-6)));
        return Array.isArray(va) ? va.map((a, j) => S.lerp(a, vb[j], u)) : S.lerp(va, vb, u);
      }
    }
    return keys[keys.length - 1][1];
  };
  SH.on = (t, a, b) => t >= a && t < b;
  SH.ramp = (t, a, b, ease = E.inOutCubic) => ease(S.seg(t, a, b));

  // ---------- walk / run cycle ----------
  SH.walk = (t, speed = 1, amp = 1, run = false) => {
    const p = t * (run ? 9 : 5.2) * speed, s = Math.sin(p), c = Math.cos(p);
    const A = (run ? 34 : 20) * amp;
    return { legL: s * A, legR: -s * A, armL: [12 - s * A * 0.9, run ? -70 : -10], armR: [12 + s * A * 0.9, run ? -70 : -10],
      bob: -Math.abs(c) * (run ? 26 : 12) * amp, lean: run ? 8 : 2 };
  };
  SH.idle = (t, seed = 0) => ({ bob: Math.sin(t * 2.1 + seed) * 3, blink: TOON.blinkAt(t, 3.3 + (seed % 1.3), seed) });
  SH.shamble = (t, seed = 0, speed = 1) => {
    const p = t * 2.6 * speed + seed, s = Math.sin(p);
    return { legL: s * 12, legR: -s * 12, bob: -Math.abs(Math.cos(p)) * 8, lean: 3 + Math.sin(p * 0.5) * 3,
      headTilt: -14 + Math.sin(t * 0.9 + seed) * 10, armL: [22 + s * 6, -18], armR: [26 - s * 6, -24] };
  };

  // ---------- lip sync from the real voice files ----------
  SH.cue = (id) => { const c = (window.CUES[SH.scene] || {})[id]; return c == null ? -99 : c; };
  SH.say = (id, base = {}) => {
    const st = SH.cue(id), env = window.VOENV[id] || '', i = Math.floor((SH.T - st) * 30);
    const v = i >= 0 && i < env.length ? +env[i] / 9 : 0;
    const smile = base.smile == null ? 0.25 : base.smile;
    return { open: v > 0.08 ? 0.1 + v * (base.amp || 0.75) : 0, smile, wide: (base.wide || 1) * (0.85 + v * 0.25) };
  };
  SH.speaking = (id) => { const st = SH.cue(id), env = window.VOENV[id] || ''; return SH.T >= st && SH.T < st + env.length / 30; };
  // merge several characters' mouths: first one speaking wins, else rest pose
  SH.mouth = (ids, rest = { open: 0, smile: 0.25 }, base) => {
    for (const id of ids) if (SH.speaking(id)) return SH.say(id, base || rest);
    return rest;
  };

  // ---------- scene: shots in sequence ----------
  SH.run = (sceneId, compId, dur, shots, opt = {}) => {
    SH.scene = sceneId;
    const root = document.getElementById('stage');
    shots.forEach((sh, i) => {
      const L = document.createElement('div'); L.className = 'shot'; root.appendChild(L);
      const W = document.createElement('div'); W.className = 'world'; L.appendChild(W);
      const O = document.createElement('div'); O.className = 'over'; L.appendChild(O);
      sh.L = L; sh.W = W; sh.O = O; sh.t1 = sh.t1 == null ? (shots[i + 1] ? shots[i + 1].t0 : dur) : sh.t1;
      sh.st = sh.setup ? sh.setup(W, O, sh) || {} : {};
    });
    const fade = document.createElement('div'); fade.className = 'fadeblack'; root.appendChild(fade);
    const ov = document.createElement('div'); ov.className = 'over'; ov.style.zIndex = 50; root.appendChild(ov);
    const gfx = (opt.gfx || []).map((g) => { const f = g.type === 'note' ? GFX.note(ov, g.text, g.icon) : g.type === 'tag' ? GFX.nameTag(ov, g.name, g.role, g.color) : g.type === 'stamp' ? GFX.stamp(ov, g.text, g.sub) : g.type === 'map' ? GFX.map(ov, g.route) : null; return [f, g]; });
    let capF = null;
    if (opt.captions !== false && window.GFX && window.CAPW) { const c = window.CUES[sceneId] || {}; const lines = Object.keys(c).filter((k) => k[0] !== '_' && window.CAPW[k]).map((id) => ({ id, at: c[id] })); capF = GFX.captions(ov, lines); }
    const grain = document.createElement('div'); grain.className = 'grain'; root.appendChild(grain);
    const tl = S.driver(dur, (t) => {
      SH.T = t;
      shots.forEach((sh) => {
        const on = t >= sh.t0 && t < sh.t1;
        sh.L.style.visibility = on ? 'visible' : 'hidden';
        if (on && sh.draw) { sh.draw(t - sh.t0, sh.st, t, sh); if (sh.st && sh.st.R && sh.st.R.flush) sh.st.R.flush(); }
      });
      // optional fades: [[a, b, from, to], ...] opacity of black
      let fb = 0; (opt.fades || []).forEach(([a, b, f0, f1]) => { if (t >= a && t <= b) fb = S.lerp(f0, f1, E.inOutSine(S.seg(t, a, b))); });
      fade.style.opacity = fb;
      gfx.forEach(([f, g]) => f && f(t, g.at, g.dur || (g.type === 'map' ? 3.6 : g.type === 'tag' ? 3.4 : 3.6)));
      if (capF) capF(t);
      grain.style.backgroundPosition = `${Math.floor(t * 24) * 37 % 200}px ${Math.floor(t * 24) * 53 % 200}px`;
    });
    window.__timelines = window.__timelines || {}; window.__timelines[compId] = tl;
    return tl;
  };

  // ---------- camera: focus point + zoom, eased between keys [[t, x, y, zoom], ...] ----------
  SH.cam = (W, lt, keys, shake = 0) => {
    const [x, y, z] = SH.k(lt, keys.map(([t, a, b, c]) => [t, [a, b, c]]));
    const sx = shake ? (S.hash(Math.floor(lt * 30)) - 0.5) * shake : 0, sy = shake ? (S.hash(Math.floor(lt * 30) + 77) - 0.5) * shake : 0;
    W.style.transform = `translate(${960 - x * z + sx}px, ${540 - y * z + sy}px) scale(${z})`;
  };

  // ---------- backgrounds ----------
  SH.canvas = (W, w = 2240, h = 1260, x = -160, y = -90) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    W.appendChild(c); return c;
  };
  SH.aisle = (W, o) => { const c = SH.canvas(W); ENV.aisle(c, o); return c; };
  SH.bokeh = (W, o) => { const c = SH.canvas(W); ENV.bokeh(c, o); return c; };
  SH.div = (parent, css, html = '', cls = '') => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; d.innerHTML = html; if (cls) d.className = cls; parent.appendChild(d); return d; };
  SH.actor = (W, key, extra) => TOON.make(W, Object.assign({}, CAST[key], extra || {}));

  // ---------- title cards ----------
  // DAY n: white slam on black, with a jitter
  SH.dayCard = (O, text) => {
    const bg = SH.div(O, 'inset:0;background:#000');
    const tx = SH.div(O, "left:0;right:0;top:400px;text-align:center;font:400 260px/1 'Anton';color:#F4F1EA;letter-spacing:.06em", text);
    return (lt, at = 0.15) => { const d = lt - at; tx.style.opacity = d > 0 ? 1 : 0; const sc = d > 0 ? 1 + 0.5 * Math.exp(-d * 18) : 1.5, j = d > 0 && d < 0.25 ? (S.hash(Math.floor(lt * 60)) - 0.5) * 14 : 0; tx.style.transform = `translate(${j}px,0) scale(${sc})`; };
  };
  // RULE card: a stamped card that slams in over the picture
  SH.ruleCard = (O, n, text, ice = false) => {
    const wrap = SH.div(O, 'inset:0;background:rgba(0,0,0,.55);opacity:0');
    const card = SH.div(wrap, `left:260px;top:250px;width:1400px;height:560px;border-radius:28px;background:${ice ? 'linear-gradient(160deg,#E9FBFF,#9FDDF5)' : 'linear-gradient(160deg,#FFF6E0,#F2D79B)'};box-shadow:0 30px 80px rgba(0,0,0,.6);transform-origin:50% 50%`);
    SH.div(card, "left:0;right:0;top:70px;text-align:center;font:700 54px/1 'JetBrains Mono';letter-spacing:.3em;color:#7a1010", 'RULE #' + n);
    SH.div(card, `left:70px;right:70px;top:160px;text-align:center;font:400 132px/1.0 'Anton';letter-spacing:.02em;color:#1b1b1b`, text);
    const stamp = SH.div(card, `right:60px;bottom:40px;width:300px;height:110px;border:10px solid #C9302C;border-radius:16px;color:#C9302C;font:400 64px/90px 'Anton';text-align:center;transform:rotate(-8deg);opacity:0`, 'SURVIVE');
    if (ice) SH.div(card, 'inset:0;border-radius:28px;background:radial-gradient(circle at 10% 10%,rgba(255,255,255,.9),transparent 30%),radial-gradient(circle at 90% 85%,rgba(255,255,255,.8),transparent 25%)');
    return (lt, at, out) => {
      const d = lt - at; wrap.style.opacity = d < 0 ? 0 : out != null && lt > out ? 1 - S.seg(lt, out, out + 0.4) : Math.min(1, d / 0.15);
      const sc = d > 0 ? 1 + 0.35 * Math.exp(-d * 14) * Math.cos(d * 30) : 1.4; card.style.transform = `scale(${sc}) rotate(${d > 0 ? -1.5 : -6}deg)`;
      const ds = d - 0.45; stamp.style.opacity = ds > 0 ? 1 : 0; stamp.style.transform = `rotate(-8deg) scale(${ds > 0 ? 1 + 0.8 * Math.exp(-ds * 20) : 2})`;
    };
  };
  // small label (time, place)
  SH.label = (O, text, css = '') => SH.div(O, "left:70px;top:60px;font:700 54px/1 'JetBrains Mono';color:#fff;background:rgba(0,0,0,.45);padding:14px 22px;border-radius:12px;" + css, text);

  // ---------- sound rings (blue ripples that show a noise travelling) ----------
  SH.rings = (W, color = '#5FC8FF') => {
    const g = SH.div(W, 'left:0;top:0;width:0;height:0');
    const rs = [0, 1, 2, 3].map(() => SH.div(g, `left:0;top:0;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:8px solid ${color};box-shadow:0 0 30px ${color};opacity:0`));
    return (lt, at, x, y, size = 900, every = 0.35, life = 1.4, until = 1e9) => {
      g.style.transform = `translate(${x}px,${y}px)`;
      rs.forEach((r, i) => {
        let best = -1; for (let k = 0; k < 40; k++) { const s = at + k * every; if (s > Math.min(lt, until)) break; if ((k % 4) === i) best = s; }
        const d = lt - best; if (best < 0 || d > life) { r.style.opacity = 0; return; }
        const u = d / life; r.style.opacity = (1 - u) * 0.9; r.style.transform = `scale(${0.1 + u * size / 200})`;
      });
    };
  };

  // ---------- red emergency flicker overlay ----------
  SH.flicker = (O, color = 'rgba(255,30,20,.28)') => {
    const f = SH.div(O, `inset:0;background:radial-gradient(ellipse at 50% 0%,${color},rgba(25,0,0,.55) 80%);pointer-events:none`);
    return (t) => { const h = S.hash(Math.floor(t * 14)), k = h > 0.88 ? 0.55 : h > 0.82 ? 0.8 : 1; f.style.opacity = 1.05 - 0.4 * k; return k; };
  };
  // vignette + letterbox helpers
  SH.vignette = (O, a = 0.55) => SH.div(O, `inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,${a}));pointer-events:none`);

  // ---------- 3D stage: far world pass, actors, near world pass, cinematic fx ----------
  SH.stage = (W, world, o = {}) => {
    const mk = (z) => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; c.style.cssText = `position:absolute;left:0;top:0;z-index:${z}`; W.appendChild(c); return c; };
    const back = o.outside ? mk(0) : null; if (back) o.outside(back);
    // depth bands: canvas 0 (farthest) .. canvas N (nearest), with an actor layer between each pair
    const NB = 6, cvs = [], lays = [];
    for (let i = 0; i < NB; i++) { cvs.push(mk(1 + i * 2)); if (i < NB - 1) { const L = document.createElement('div'); L.style.cssText = `position:absolute;inset:0;z-index:${2 + i * 2}`; W.appendChild(L); lays.push(L); } }
    const A = lays[0];
    const F = document.createElement('div'); F.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:40'; W.appendChild(F);
    const fx = FX.make(F, Object.assign({ mood: world.moodName, beams: true }, o.fx || {}));
    let placed = [], tNow = 0, pending = false;
    const R = {
      W, A, F, world, fx, cam: null,
      actor: (key, extra) => TOON.make(A, Object.assign({}, CAST[key], extra || {})),
      prop: (el) => { A.appendChild(el); el.style.left = '0px'; el.style.top = '0px'; return el; },
      at: (actor, x, z, pose = {}, opt2) => {
        const p = Object.assign({}, SH.lit(world.moodName), pose);
        if (p.face != null) p.yaw = SH.faceYaw(R.cam, x, z, p.face);
        if (p.headFace != null) p.headYaw = SH.faceYaw(R.cam, x, z, p.headFace);
        const P = WORLD.actorAt(actor, R.cam, x, z, p, opt2); if (P.visible) placed.push([P.depth - ((opt2 && opt2.bias) || 0), actor.svg]); return P;
      },
      put: (el, x, z, mH, pxH, opt2) => { const P = WORLD.spriteAt(el, R.cam, x, z, mH, pxH, opt2); if (P.visible) placed.push([P.depth - (opt2 && (opt2.front || (opt2.y || 0) > 0.3) ? 0.6 : 0), el]); return P; },
      frame: (t, cam) => { R.cam = cam; tNow = t; placed = []; pending = true; },
      flush: () => {
        if (!pending) return; pending = false; const t = tNow, cam = R.cam;
        // band edges = the distinct actor depths (far -> near), capped to NB-1 bands
        const ds = [...new Set(placed.map(([d]) => Math.round(d * 20) / 20))].sort((a, b) => b - a).slice(0, NB - 1);
        const edges = ds.map((d) => d + 0.02);
        cvs.forEach((c) => c.getContext('2d').clearRect(0, 0, 1920, 1080));
        // canvas 0: everything at least edges[0] away (plus floor/ceiling/walls); canvas i: between edges[i] and edges[i-1]; last: nearer than the last edge
        if (!edges.length) world.render(cvs[0].getContext('2d'), cam, t);
        else {
          world.render(cvs[0].getContext('2d'), cam, t, { far: edges[0] });
          for (let i = 1; i < edges.length; i++) world.render(cvs[i].getContext('2d'), cam, t, { near: edges[i - 1], far: edges[i] });
          world.render(cvs[edges.length].getContext('2d'), cam, t, { near: edges[edges.length - 1] });
        }
        placed.forEach(([d, el]) => { let k = 0; while (k < edges.length && d < edges[k] - 0.02 - 1e-6) k++; const L = lays[Math.min(lays.length - 1, k)]; if (el.parentNode !== L) L.appendChild(el); });
        fx.draw(t, cam, world, o.fxExtra ? o.fxExtra(t) : {});
        if (o.dof) cvs[0].style.filter = `blur(${typeof o.dof === 'function' ? o.dof(t) : o.dof}px)`;
      },
    };
    return R;
  };
  // world heading (radians; 0 = facing -z toward the store front, +PI/2 = facing +x) -> rig yaw for this camera
  SH.faceYaw = (cam, x, z, h) => {
    const fx = Math.sin(h), fz = -Math.cos(h), cy = Math.cos(cam.yaw || 0), sy = Math.sin(cam.yaw || 0);
    // direction from the character to the camera, so the angle is relative to the line of sight
    const dx = cam.x - x, dz = cam.z - z, ax = Math.atan2(dx, dz);
    let rel = Math.atan2(fx, fz) - ax; while (rel > Math.PI) rel -= 2 * Math.PI; while (rel < -Math.PI) rel += 2 * Math.PI;
    // rel 0 = facing the camera; positive = turned toward screen-right
    const y = -rel / (Math.PI / 2); return Math.max(-2, Math.min(2, y));
  };
  SH.headingTo = (x, z, tx, tz) => Math.atan2(tx - x, -(tz - z));
  // scene key + rim light per mood (feeds the rig)
  const LIT = { day: [{ x: -0.4, y: -0.8 }, { color: '#FFE9C0', k: 0.45 }], night: [{ x: -0.2, y: -0.9, k: 0.7 }, { color: '#7FA8FF', k: 0.9 }], red: [{ x: 0.3, y: -0.8, k: 0.7 }, { color: '#FF4436', k: 1 }],
    gray: [{ x: -0.5, y: -0.6, k: 0.8 }, { color: '#C9D3DF', k: 0.6 }], ice: [{ x: 0, y: -0.9 }, { color: '#BFF1FF', k: 0.9 }], warm: [{ x: 0.4, y: -0.7 }, { color: '#FFC070', k: 0.8 }] };
  SH.lit = (mood) => { const L = LIT[mood] || LIT.day; return { light: L[0], rim: L[1] }; };
  // camera keyframes: [[t, x, y, z, yaw, pitch, f], ...] (+ optional handheld wobble)
  SH.cam3 = (lt, keys, o = {}) => {
    const v = SH.k(lt, keys.map((k) => [k[0], k.slice(1)]), o.ease);
    const h = o.hand || 0, n = (a, b) => Math.sin(lt * a + b) * 0.6 + Math.sin(lt * a * 2.3 + b * 1.7) * 0.4;
    return { x: v[0] + n(1.3, 1) * h * 0.02, y: v[1] + n(1.7, 2) * h * 0.015, z: v[2], yaw: v[3] + n(1.1, 3) * h * 0.006, pitch: v[4] + n(1.5, 4) * h * 0.005, roll: n(0.9, 5) * h * 0.004, f: v[5] };
  };
  window.SH = SH;
})();
