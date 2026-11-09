// film.js: the engine for "10 Jobs AI Will Erase by 2030".
// A section = one composition; it holds shots. A shot builds its own 2.5D set out of depth layers once, then a frame
// function moves the camera and the actors. Everything is a pure function of time (deterministic, seekable).
(function () {
  const S = STAGE, G = { b: '#4285F4', r: '#EA4335', y: '#FBBC05', g: '#34A853', w: '#FFFFFF' };
  const GC = [G.b, G.r, G.y, G.g];
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const PWN = (window.PW || []).map((w) => norm(w.w));

  // ---------- words (program time) ----------
  function word(phrase, after = 0) {
    const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < PWN.length; i++) {
      if (PW[i].s < after - 0.01) continue;
      let ok = true; for (let k = 0; k < toks.length; k++) if (PWN[i + k] !== toks[k]) { ok = false; break; }
      if (ok) return { s: PW[i].s, e: PW[i + toks.length - 1].e, i };
    }
    throw new Error('word not found: ' + phrase + ' after ' + after);
  }
  function wordsBetween(T0, T1) { return PW.filter((w) => w.s >= T0 - 0.01 && w.s < T1); }
  function env(T) { const c = (window.VOENV || '').charCodeAt(Math.floor(T * 60)); return c ? (c - 48) / 60 : 0; }

  // ---------- css ----------
  const CSS = `
  .fl-root{position:absolute;inset:0;overflow:hidden;background:#000}
  .fl-shot{position:absolute;inset:0;overflow:hidden;visibility:hidden}
  .fl-cam{position:absolute;inset:0;transform-origin:960px 540px}
  .fl-L{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:960px 540px;will-change:transform}
  .fl-a{position:absolute}
  .fl-t{position:absolute;font-family:Figtree;font-weight:900;color:#fff;white-space:nowrap;letter-spacing:-1px;line-height:1}
  .fl-glow{position:absolute;border-radius:50%}
  .fl-grain{position:absolute;left:-100px;top:-100px;width:2120px;height:1280px;opacity:.08;mix-blend-mode:overlay;pointer-events:none;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='4'/></filter><rect width='256' height='256' filter='url(%23n)'/></svg>")}
  .fl-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 78% 74% at 50% 50%,transparent 52%,rgba(0,0,0,.72) 100%)}
  .fl-flash{position:absolute;inset:0;pointer-events:none;background:#fff;opacity:0}
  .fl-bars{position:absolute;left:0;right:0;height:0;background:#000}
  .fl-cap{position:absolute;left:0;right:0;top:952px;height:90px;display:flex;justify-content:center;align-items:center;pointer-events:none;z-index:50}
  .fl-cap .ph{position:absolute;display:flex;gap:16px;white-space:nowrap;font:900 60px/1 Figtree;letter-spacing:-0.5px}
  .fl-cap .wd{display:inline-block;color:rgba(255,255,255,.38);text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 2px rgba(0,0,0,.9);transform-origin:50% 80%}
  .fl-capband{position:absolute;left:0;right:0;top:880px;height:200px;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(0,0,0,.55));z-index:49}
  .fl-pulse{position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;background:radial-gradient(ellipse 70% 60% at 50% 45%,#fff,transparent 70%);opacity:0;z-index:48}
  .fl-card{position:absolute;border-radius:28px;background:#1f1f1e;border:1px solid #3a3a38;box-shadow:0 50px 120px rgba(0,0,0,.6)}`;
  function css() { if (document.getElementById('fl-css')) return; const s = document.createElement('style'); s.id = 'fl-css'; s.textContent = CSS + (location.hash.includes('noblur') ? '.fl-L{filter:none!important}' : '') + (location.hash.includes('noblend') ? '.fl-grain,.fl-tint{display:none!important}' : '') + (location.hash.includes('nomote') ? '.mote{display:none!important}' : ''); document.head.appendChild(s); }
  const el = (parent, html) => { const t = document.createElement('div'); t.innerHTML = html.trim(); const n = t.firstElementChild; while (t.firstChild) parent.appendChild(t.firstChild); return n; };

  // ---------- camera paths: Catmull-Rom through [time, x, y, zoom, roll] keys, so the camera never stops ----------
  function path(keys) {
    return (t) => {
      if (t <= keys[0][0]) { const a = keys[0], b = keys[1], u = (t - a[0]) / (b[0] - a[0]); return a.slice(1).map((v, i) => v + (b[i + 1] - v) * u); }
      const n = keys.length - 1;
      if (t >= keys[n][0]) { const a = keys[n - 1], b = keys[n], u = (t - a[0]) / (b[0] - a[0]); return a.slice(1).map((v, i) => v + (b[i + 1] - v) * u); }
      let i = 0; while (keys[i + 1][0] < t) i++;
      const p0 = keys[Math.max(0, i - 1)], p1 = keys[i], p2 = keys[i + 1], p3 = keys[Math.min(n, i + 2)];
      const u = (t - p1[0]) / (p2[0] - p1[0]), u2 = u * u, u3 = u2 * u;
      const d1 = p2[0] - p1[0], d0 = Math.max(1e-3, p1[0] - p0[0]) || d1, d2 = Math.max(1e-3, p3[0] - p2[0]) || d1;
      return p1.slice(1).map((v, k) => {
        const a = p0[k + 1], b = p2[k + 1], c = p3[k + 1];
        const m1 = (p0 === p1 ? (b - v) : ((v - a) / d0 + (b - v) / d1) / 2) * d1;   // tangents scaled to the segment
        const m2 = (p3 === p2 ? (b - v) : ((b - v) / d1 + (c - b) / d2) / 2) * d1;
        return (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * b + (u3 - u2) * m2;
      });
    };
  }

  // ---------- stressed-word bump, shared by actors: [strength 0..1, index of the word] ----------
  const EMW = ((window.BEATS || {}).words || []).map((w, i) => (w.em ? [w.s, w.em, i] : null)).filter(Boolean);
  function emBeat(T) {
    let lo = 0, hi = EMW.length; while (lo < hi) { const m = (lo + hi) >> 1; if (EMW[m][0] < T) lo = m + 1; else hi = m; }
    let best = 0, idx = 0;
    for (let k = lo - 1; k >= 0 && T - EMW[k][0] < 1.2; k--) { const d = T - EMW[k][0], tau = 0.22, b = (d / tau) * Math.exp(1 - d / tau) * (EMW[k][1] > 1 ? 1 : 0.75); if (b > best) { best = b; idx = EMW[k][2]; } }
    return [best, idx];
  }

  // ---------- actors ----------
  function actor(parent, o) {
    const h = o.h || 700, w = h * 400 / 960;
    const box = el(parent, `<div class="fl-a" style="left:${o.x - w / 2}px;top:${o.y - h}px;width:${w}px;height:${h}px;transform-origin:50% 100%;${o.css || ''}"></div>`);
    let last = '';
    const A = { el: box, o: Object.assign({}, o), x: o.x, y: o.y, h,
      set(p, T, lt) {
        const q = Object.assign({}, A.o, p || {});
        // blink every ~3.3 to 4.6 s (seeded per actor), lasting 0.14 s
        const seed = (q.id || 'a').length * 1.37 + (q.blinkSeed || 0), per = 3.3 + (seed % 1.3);
        const ph = ((lt + seed) % per) / 0.14; q.blink = ph < 1 ? Math.sin(ph * Math.PI) : 0;
        if (q.talk) { const e = env(T); if (e > 0.06) { q.face = 'talk'; q.open = Math.min(1, e * 1.2); } }
        q.bob = (q.bob || 0) + Math.sin(lt * 2.1 + seed) * (q.breathe ?? 3);
        if (q.beat !== false) { const [b, i] = emBeat(T); q.bob += b * 9; q.tilt = (q.tilt || 0) + b * (i % 2 ? 3 : -3); }
        const key = JSON.stringify(q);
        if (key !== last) { box.innerHTML = HERO.svg(q); last = key; }
        if (p && (p.x !== undefined || p.y !== undefined || p.s !== undefined || p.flip !== undefined)) {
          const x = p.x ?? A.x, y = p.y ?? A.y, s = p.s ?? 1;
          box.style.transform = `translate(${x - A.x}px,${y - A.y}px) scale(${(p.flip ? -1 : 1) * s},${s})`;
        }
      } };
    return A;
  }

  // ---------- timed text ----------
  // key(layer, html, x, y, size, color, at, out, opts): word-timed title; enters from below with a blur, exits upward
  function key(layer, html, x, y, size, color, at, out, o = {}) {
    const n = el(layer, `<div class="fl-t" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color};${o.css || ''}">${html}</div>`);
    const cx = o.align === 'center' ? 'translateX(-50%) ' : o.align === 'right' ? 'translateX(-100%) ' : '';
    const dy = o.dy ?? 60;
    return (T) => {
      const a = S.E.outExpo(S.seg(T, at, at + 0.55)), b = out ? S.E.inCubic(S.seg(T, out, out + 0.4)) : 0;
      n.style.opacity = (a * (1 - b)).toFixed(3);
      n.style.transform = `${cx}translateY(${(1 - a) * dy - b * dy}px)`;
      n.style.filter = a < 1 || b > 0 ? `blur(${((1 - a) * 14 + b * 10).toFixed(1)}px)` : 'none';
      n.style.visibility = a <= 0.001 || b >= 0.999 ? 'hidden' : 'visible';
    };
  }
  // words revealed exactly when spoken (karaoke build); highlight map word -> color
  function spoken(layer, T0, T1, x, y, size, o = {}) {
    const ws = wordsBetween(T0, T1); const hi = o.hi || {};
    const n = el(layer, `<div class="fl-t" style="left:${x}px;top:${y}px;font-size:${size}px;white-space:normal;width:${o.w || 1400}px;line-height:1.12;font-weight:${o.weight || 900};${o.css || ''}"></div>`);
    const spans = ws.map((w) => { const s = document.createElement('span'); const c = hi[norm(w.w)]; s.textContent = w.w + ' '; s.style.color = c || o.color || '#fff'; s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; n.appendChild(s); return [s, w.s]; });
    return (T) => { for (const [s, t] of spans) { const a = S.E.outCubic(S.seg(T, t - 0.05, t + 0.25)); s.style.opacity = a.toFixed(3); s.style.transform = `translateY(${(1 - a) * 24}px)`; } };
  }

  // ---------- chat window with a prompt typed in time with the voice ----------
  // chat(layer, { x, y, w, h, T0, T1, hi, title, accent, size }) -> update(T) ; returns {update, caretY()} where caretY gives the y of the line being typed
  function chat(layer, o) {
    const ws = wordsBetween(o.T0, o.T1), size = o.size || 40, hi = o.hi || {};
    const n = el(layer, `<div class="fl-card" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;overflow:hidden">
      <div style="height:62px;border-bottom:1px solid #333;display:flex;align-items:center;padding-left:26px;gap:12px">
        <i style="width:16px;height:16px;border-radius:50%;background:#ff5f57"></i><i style="width:16px;height:16px;border-radius:50%;background:#febc2e"></i><i style="width:16px;height:16px;border-radius:50%;background:#28c840"></i>
        <span style="margin-left:24px;font:700 24px Figtree;color:#9a9a96">${o.title || 'New chat'}</span></div>
      <div class="pr" style="margin:40px 50px 0;padding:30px 36px;background:#2d2d2b;border-radius:22px;font:600 ${size}px/1.42 Figtree;color:#f1f0ec;min-height:${size * 1.5}px"></div>
      <div style="position:absolute;left:50px;right:50px;bottom:36px;height:84px;border-radius:24px;border:1px solid #474744;background:#262624;display:flex;align-items:center;padding-left:30px;font:600 26px Figtree;color:#7a7a76">Reply...<i class="snd" style="position:absolute;right:16px;width:52px;height:52px;border-radius:14px;background:${o.accent || G.b}"></i></div></div>`);
    const pr = n.querySelector('.pr');
    const spans = ws.map((w) => { const s = document.createElement('span'); s.textContent = w.w + ' '; const c = hi[norm(w.w)]; if (c) { s.style.color = c; } pr.appendChild(s); return [s, w]; });
    const caret = document.createElement('span'); caret.style.cssText = 'display:inline-block;width:4px;height:' + size + 'px;background:#fff;vertical-align:-6px;margin-left:2px'; pr.appendChild(caret);
    let lastY = 0;
    return { el: n, update(T) {
      let lastShown = null;
      for (const [s, w] of spans) { const on = T >= w.s - 0.04; s.style.visibility = on ? 'visible' : 'hidden'; if (on) lastShown = s; }
      caret.style.opacity = (Math.floor(T * 2.2) % 2 === 0 || T < o.T1) ? 1 : 0;
      // move the caret after the last visible word
      if (lastShown) lastShown.after(caret); else pr.prepend(caret);
    }, caretY() { return caret.offsetTop + n.offsetTop + pr.offsetTop; } };
  }

  // ---------- world helpers (return html) ----------
  const K = {
    G, GC,
    sky: (stops) => `<div class="fl-a" style="inset:0;background:linear-gradient(180deg,${stops})"></div>`,
    rad: (x, y, w, h, c, o = 1) => `<div class="fl-a" style="left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;opacity:${o};background:radial-gradient(ellipse at center,${c},transparent 70%)"></div>`,
    box: (x, y, w, h, bg, extra = '') => `<div class="fl-a" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};${extra}"></div>`,
    t: (html, x, y, size, color, extra = '') => `<div class="fl-t" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color};${extra}">${html}</div>`,
    skyline(seed, base, col, win, minH, maxH, winCol, x0 = -200, x1 = 2120) {
      const r = S.mulberry32(seed); let s = '', x = x0;
      while (x < x1) { const w = 60 + r() * 120, h = minH + r() * (maxH - minH); s += `<rect x="${x.toFixed(0)}" y="${(base - h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 600).toFixed(0)}" fill="${col}"/>`;
        if (win) for (let yy = base - h + 20; yy < base - 10; yy += 26) for (let xx = x + 10; xx < x + w - 14; xx += 22) if (r() < win) s += `<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="10" height="13" fill="${winCol || '#ffcf7a'}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
        x += w + 4 + r() * 10; }
      return `<svg class="fl-a" style="left:0;top:0;width:1920px;height:1080px;overflow:visible" viewBox="0 0 1920 1080">${s}</svg>`;
    },
    rays(x, y, n, len, w0, ang0, step, col, op) { let s = ''; for (let i = 0; i < n; i++) s += `<div class="fl-a" style="left:${x}px;top:${y}px;width:${len}px;height:${w0 + i * 10}px;transform-origin:0 50%;transform:rotate(${ang0 + i * step}deg);background:linear-gradient(90deg,${col},transparent);opacity:${op}"></div>`; return s; },
    motes(seed, n, col, x0 = 0, y0 = 0, w = 1920, h = 1080, size = 5) { const r = S.mulberry32(seed); let s = ''; for (let i = 0; i < n; i++) { const z = 1 + r() * size; s += `<div class="fl-a mote" data-p="${r().toFixed(3)}" style="left:${(x0 + r() * w).toFixed(0)}px;top:${(y0 + r() * h).toFixed(0)}px;width:${z.toFixed(1)}px;height:${z.toFixed(1)}px;border-radius:50%;background:${Array.isArray(col) ? col[i % col.length] : col};box-shadow:0 0 ${z * 3}px ${Array.isArray(col) ? col[i % col.length] : col}"></div>`; } return s; },
    floor: (top, c1, c2) => `<div class="fl-a" style="left:-400px;width:2720px;top:${top}px;height:${1400 - top}px;background:linear-gradient(180deg,${c1},${c2})"></div>`,
    num: (n, x, y, size, color, stroke) => `<div class="fl-t" style="left:${x}px;top:${y}px;font-family:'Archivo Black';font-size:${size}px;${stroke ? `color:transparent;-webkit-text-stroke:${stroke}px ${color}` : `color:${color}`};letter-spacing:0">${n}</div>`,
    gword: (txt) => [...txt].map((c, i) => c === ' ' ? ' ' : `<span style="color:${GC[i % 4]}">${c}</span>`).join(''),
  };

  // ---------- sound cues: collected at build time, read by tools/sfxcues.mjs ----------
  window.__sfx = window.__sfx || [];
  function sfx(name, T, g = 1, pan = 0) { window.__sfx.push({ name, t: +T.toFixed(3), g, pan }); }

  // ---------- the section ----------
  // FILM.section(id, shots, { grade }) builds the composition root content and registers the timeline.
  function section(id, shotDefs) {
    css();
    const sec = EDIT.sections.find((s) => s.id === id), T0 = sec.start, DUR = +(sec.end - sec.start).toFixed(3);
    const root = document.getElementById('root'); root.dataset.duration = DUR;
    const stage = root.querySelector('#stage'); stage.dataset.duration = DUR; stage.classList.add('fl-root');
    const shots = shotDefs.map((d) => Object.assign({ fadeIn: 0.5 }, d));
    shots.forEach((d) => {
      d.node = el(stage, `<div class="fl-shot"><div class="fl-cam"></div></div>`); d.cam = d.node.firstChild; d.layers = []; d.fx = [];
      d.L = (depth, html = '', o = {}) => { const n = el(d.cam, `<div class="fl-L" style="${o.forceBlur ? `filter:blur(${o.forceBlur}px);` : ''}${o.blur ? `opacity:${Math.max(0.55, 1 - o.blur * 0.06).toFixed(2)};` : ''}${o.css || ''}">${html}</div>`); n.__d = depth; d.layers.push(n); return n; };
      d.on = (f) => d.fx.push(f);
      d.hud = () => { const n = el(d.node, `<div class="fl-a" style="inset:0;z-index:5"></div>`); d.huds = (d.huds || []).concat(n); return n; };
      d.build(d);
      if (d.fadeIn > 0 && d.t0 > 0.1 && d.whoosh !== false) sfx(d.whoosh || 'whoosh', T0 + d.t0 - 0.25, d.whooshG ?? 0.6, 0);
      // grade on top of the shot
      const tint = d.tint ? el(d.node, `<div class="fl-a fl-tint" style="inset:0;background:${d.tint};mix-blend-mode:soft-light;opacity:${d.tintOp ?? 0.6}"></div>`) : null;
      el(d.node, `<div class="fl-vig"></div>`);
      d.motes = [...d.node.querySelectorAll('.mote')];
    });
    const post = el(stage, `<div class="fl-a" style="inset:0;pointer-events:none"><div class="fl-grain"></div><div class="fl-flash"></div></div>`);
    const grain = post.querySelector('.fl-grain'), flash = post.querySelector('.fl-flash');
    // ---- micro beats: word captions, camera pulses and light pulses on the rhythm of the voice ----
    const B = window.BEATS || { words: [], phrases: [], excl: [] }, Tend = T0 + DUR;
    const off = (T) => B.excl.some(([a, b]) => T >= a && T < b);
    const PH = B.phrases.filter((p) => p.e > T0 - 0.5 && p.s < Tend + 0.5);
    const capBand = el(stage, `<div class="fl-capband"></div>`), cap = el(stage, `<div class="fl-cap"></div>`), pulseEl = el(stage, `<div class="fl-pulse"></div>`);
    const capPh = PH.map((p, k) => {
      const n = el(cap, `<div class="ph"></div>`); const ws = [];
      for (let i = p.a; i <= p.b; i++) { const w = B.words[i]; const sp = document.createElement('span'); sp.className = 'wd'; sp.textContent = w.w; n.appendChild(sp); ws.push([sp, w]); }
      const next = PH[k + 1]; return { n, ws, p, until: next ? Math.min(next.s - 0.02, p.e + 0.9) : p.e + 0.9, hidden: off(p.s + 0.05) };
    });
    const emW = B.words.filter((w) => w.em && w.s > T0 - 2 && w.s < Tend);
    const pulseAt = (T) => { // smooth bump d/tau*exp(1-d/tau): rises and settles, no shake
      const bump = (d, tau) => (d <= 0 ? 0 : (d / tau) * Math.exp(1 - d / tau));
      let z = 0, l = 0;
      for (const p of PH) { const d = T - p.s; if (d > 0 && d < 3) z += 0.010 * bump(d, 0.35); }
      for (const w of emW) { const d = T - w.s; if (d > 0 && d < 3) { const b = bump(d, 0.28); z += (w.em > 1 ? 0.02 : 0.013) * b; l = Math.max(l, (w.em > 1 ? 0.22 : 0.12) * b); } }
      return [Math.min(z, 0.05), l];
    };
    let colorIdx = 0; const emColor = new Map(); emW.forEach((w) => emColor.set(w, GC[colorIdx++ % 4]));
    function captions(T) {
      let anyOn = 0;
      for (const c of capPh) {
        const on = !c.hidden && T >= c.p.s - 0.06 && T < c.until;
        if (!on) { if (c.n.style.display !== 'none') c.n.style.display = 'none'; continue; }
        anyOn = 1; c.n.style.display = 'flex';
        const a = S.E.outCubic(S.seg(T, c.p.s - 0.06, c.p.s + 0.14)), b = S.seg(T, c.until - 0.12, c.until);
        c.n.style.opacity = (a * (1 - b)).toFixed(3); c.n.style.transform = `translateY(${((1 - a) * 18 - b * 10).toFixed(1)}px)`;
        for (const [sp, w] of c.ws) {
          const said = T >= w.s - 0.03, k = S.seg(T, w.s - 0.03, w.s + 0.16);
          const col = w.em ? emColor.get(w) || '#fff' : '#fff';
          sp.style.color = said ? col : 'rgba(255,255,255,.38)';
          const pop = said ? 1 + (w.em ? 0.16 : 0.07) * Math.sin(Math.PI * Math.min(1, k)) : 1;
          sp.style.transform = `scale(${pop.toFixed(3)}) translateY(${(said ? -4 * Math.sin(Math.PI * Math.min(1, k)) : 0).toFixed(1)}px)`;
        }
      }
      capBand.style.opacity = anyOn ? '1' : '0';
    }

    function frame(t) {
      const T = T0 + t;
      let fl = 0;
      const [pz, pl] = pulseAt(T);
      captions(T); pulseEl.style.opacity = pl.toFixed(3);
      shots.forEach((d, i) => {
        const a = d.t0, b = d.t1, fin = d.fadeIn, nextIn = shots[i + 1] ? shots[i + 1].fadeIn : 0;
        const vis = t >= a - 1e-6 && t < b + nextIn;
        if (!vis) { if (d.node.style.visibility !== 'hidden') d.node.style.visibility = 'hidden'; return; }
        d.node.style.visibility = 'visible';
        // dissolve in over fadeIn (the new shot sits on top of the old one, which keeps moving underneath)
        const op = fin > 0 && i > 0 ? S.E.inOutSine(S.seg(t, a, a + fin)) : 1;
        d.node.style.opacity = op.toFixed(3); d.node.style.zIndex = i + 1;
        if (d.flash && t >= a && t < a + 0.5) fl = Math.max(fl, (1 - (t - a) / 0.5) * d.flash);
        const lt = t - a, u = (t - a) / (b - a);
        const c = d.camPath ? d.camPath(lt) : [0, 0, 1, 0];
        const [cx, cy, cz0, cr] = c; const cz = cz0 * (1 + pz);
        d.cam.style.transform = `rotate(${cr}deg)`;
        for (const L of d.layers) { const k = 1 / L.__d; L.style.transform = `translate(${(-cx * k).toFixed(2)}px,${(-cy * k).toFixed(2)}px) scale(${(1 + (cz - 1) * k).toFixed(4)})`; }
        for (const m of d.motes) { const p = +m.dataset.p; m.style.transform = `translate(${(Math.sin(lt * 0.4 + p * 40) * 30).toFixed(1)}px,${(-((lt * (12 + p * 30)) % 300)).toFixed(1)}px)`; m.style.opacity = (0.4 + 0.6 * Math.abs(Math.sin(lt * 0.8 + p * 20))).toFixed(2); }
        if (d.huds) for (const h of d.huds) h.style.transform = `translate(${(Math.sin(lt * 0.35) * 10).toFixed(1)}px,${(Math.cos(lt * 0.27) * 6).toFixed(1)}px) scale(${(1 + 0.012 * Math.sin(lt * 0.2)).toFixed(4)})`;
        for (const f of d.fx) f(T, lt, u);
      });
      grain.style.transform = `translate(${(S.hash(Math.floor(t * 24)) * 100 - 50).toFixed(0)}px,${(S.hash(Math.floor(t * 24) + 7) * 100 - 50).toFixed(0)}px)`;
      flash.style.opacity = fl.toFixed(3);
      // fade from / to black at the very start and end of the film
      const fb = (id === 'intro' ? 1 - S.seg(t, 0, 1.2) : 0) + (id === 'finale' ? S.seg(t, DUR - 1.5, DUR) : 0);
      stage.style.filter = fb > 0.001 ? `brightness(${(1 - fb).toFixed(3)})` : 'none';
    }
    const tl = S.driver(DUR, frame);
    window.__timelines = window.__timelines || {}; window.__timelines[id] = tl;
    return { T0, DUR, word: (p, after) => { const w = word(p, after ?? T0); return { s: w.s - T0, e: w.e - T0, S: w.s, E: w.e }; } };
  }

  // sec(id): helpers for a scene file. w(phrase, afterLocal) -> { s, e } local times and { S, E } program times.
  function sec(id) {
    const s = EDIT.sections.find((x) => x.id === id), T0 = s.start;
    return { T0, DUR: s.end - s.start, w: (p, after = 0) => { const r = word(p, T0 + after); return { s: r.s - T0, e: r.e - T0, S: r.s, E: r.e }; } };
  }
  window.FILM = { sfx, G, GC, word, wordsBetween, env, path, actor, key, spoken, chat, K, section, sec, el };
})();
