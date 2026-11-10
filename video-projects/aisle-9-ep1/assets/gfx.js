// gfx.js: AISLE 9 on-screen graphics. All build once and update with update(t); deterministic.
//   GFX.captions(O, [{id, at}], opts)  word-by-word horror captions (narrator white/green, dialogue with a speaker tag)
//   GFX.nameTag(O, name, role, color)  lower-third       GFX.stamp(O, top, sub)  place/time stamp
//   GFX.note(O, text, icon)  explainer note              GFX.map(O)  store map with Bob's route
//   GFX.subscribe(O)  end card button                     GFX.title(O)  series title card
(function () {
  const S = STAGE, E = S.E;
  const div = (p, css, html = '') => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; d.innerHTML = html; p.appendChild(d); return d; };
  // grungy texture for lettering (seeded noise), used as a mask so letters look worn
  let NOISE = null;
  function noise() {
    if (NOISE) return NOISE; const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), r = S.mulberry32(77), im = x.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = r() < 0.06 ? 0 : 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = 255; im.data[i * 4 + 3] = v; }
    x.putImageData(im, 0, 0); for (let k = 0; k < 40; k++) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,.8)'; x.beginPath(); x.arc(r() * 256, r() * 256, 1 + r() * 3, 0, 7); x.fill(); }
    return (NOISE = c.toDataURL());
  }
  const GREEN = '#A6FF3D', SPEAKER = { b: ['BOB', '#FF5A4E'], t: ['TYLER', '#5FA8FF'], h: ['MR. HALLORAN', '#E0B070'], r: ['SELF-CHECKOUT', '#9fe0ff'], n: null, x: null };
  const CSS = `
    .cap{position:absolute;left:0;right:0;bottom:92px;text-align:center;pointer-events:none}
    .cap .ln{display:inline-block;font:400 92px/1 'Anton',sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#F4F1EA;
      -webkit-text-stroke:10px #0b0b0d;paint-order:stroke fill;text-shadow:0 6px 0 #000,0 0 24px rgba(0,0,0,.7);-webkit-mask-image:url(MASK);-webkit-mask-size:256px}
    .cap .w{display:inline-block;margin:0 .26em;transform-origin:50% 80%}
    .cap .w.on{color:${GREEN};text-shadow:0 6px 0 #000,0 0 26px rgba(150,255,60,.55)}
    .cap .spk{display:block;margin:0 auto 10px;width:max-content;padding:6px 16px 4px;border-radius:8px;font:700 30px/1 'JetBrains Mono';letter-spacing:.12em;color:#0b0b0d}
    .tag{position:absolute;left:90px;bottom:250px;height:120px;display:flex;align-items:stretch;transform-origin:0 50%}
    .tag .bar{width:16px;border-radius:6px}
    .tag .tx{margin-left:18px;padding:14px 26px 10px;background:rgba(10,10,14,.82);border-radius:10px;-webkit-mask-image:url(MASK);-webkit-mask-size:256px}
    .tag .nm{font:400 64px/1 'Anton';letter-spacing:.03em;color:#fff;text-transform:uppercase}
    .tag .rl{margin-top:6px;font:700 24px/1 'JetBrains Mono';letter-spacing:.14em;color:#cfc8bd;text-transform:uppercase}
    .stamp{position:absolute;left:80px;top:64px}
    .stamp .a{font:400 58px/1 'Anton';color:#fff;letter-spacing:.04em;text-shadow:0 4px 0 #000;-webkit-text-stroke:6px #0b0b0d;paint-order:stroke fill}
    .stamp .b{margin-top:8px;font:700 26px/1 'JetBrains Mono';letter-spacing:.16em;color:${GREEN};text-shadow:0 2px 0 #000}
    .note{position:absolute;top:58px;left:50%;display:flex;align-items:center;gap:18px;padding:16px 30px 16px 18px;border-radius:16px;background:rgba(12,12,16,.86);border:3px solid ${GREEN};box-shadow:0 10px 30px rgba(0,0,0,.5);white-space:nowrap}
    .note .ic{width:54px;height:54px;border-radius:50%;background:${GREEN};color:#0b0b0d;font:400 40px/56px 'Anton';text-align:center}
    .note .tx{font:400 46px/1 'Anton';letter-spacing:.03em;color:#fff;text-transform:uppercase}
  `;
  let styled = false;
  function style() { if (styled) return; styled = true; const st = document.createElement('style'); st.textContent = CSS.split('url(MASK)').join(`url(${noise()})`); document.head.appendChild(st); }

  // ---------- captions ----------
  // lines: [{ id, at }] (scene-local start time of each voice line). Chunks of up to 3 words; shake on loud words.
  function captions(O, lines, o = {}) {
    style();
    const box = div(O, 'left:0;right:0;bottom:0;height:0', ''); box.className = '';
    const cap = div(O, '', ''); cap.className = 'cap';
    const spk = document.createElement('div'); spk.className = 'spk'; cap.appendChild(spk);
    const ln = document.createElement('div'); ln.className = 'ln'; cap.appendChild(ln);
    // pre-chunk every line
    const chunks = [];
    lines.forEach(({ id, at }) => {
      const words = (window.CAPW[id] || []).map(([w, s, e]) => ({ w: w.replace(/^\.\.\./, ''), s: at + s, e: at + e }));
      let cur = [];
      words.forEach((w, i) => { cur.push(w); const end = /[.,!?;:]$/.test(w.w) || cur.length >= (o.max || 3) || i === words.length - 1; if (end) { chunks.push({ id, words: cur }); cur = []; } });
    });
    chunks.forEach((c, i) => { c.s = c.words[0].s; c.e = Math.max(c.words[c.words.length - 1].e + 0.25, c.s + 0.5); if (chunks[i + 1] && chunks[i + 1].s - c.e < 0.35) c.e = chunks[i + 1].s; });
    let shown = null, spans = [];
    return (t) => {
      const c = chunks.find((k) => t >= k.s && t < k.e);
      if (c !== shown) {
        shown = c; ln.innerHTML = ''; spans = [];
        if (c) { c.words.forEach((w) => { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = w.w; ln.appendChild(sp); spans.push(sp); });
          const who = SPEAKER[c.id[0]]; spk.style.display = who ? 'block' : 'none'; if (who) { spk.textContent = who[0]; spk.style.background = who[1]; } }
      }
      cap.style.opacity = c ? 1 : 0; if (!c) return;
      const d = t - c.s; cap.style.transform = `translateY(${(1 - E.outBack(S.clamp(d / 0.18), 2)) * 30}px) scale(${0.92 + 0.08 * S.clamp(d / 0.18)})`;
      c.words.forEach((w, i) => { const on = t >= w.s - 0.05 && t < Math.max(w.e, (c.words[i + 1] || { s: 1e9 }).s); spans[i].className = on ? 'w on' : 'w';
        const env = window.VOENV[c.id] || '', k = Math.floor((t - (w.s - (window.CAPW[c.id] || [[0, 0]])[0][1] * 0)) * 30); const loud = /!$/.test(w.w) || o.shake;
        spans[i].style.transform = on ? `scale(1.05) translate(${loud ? (S.hash(Math.floor(t * 30) + i) - 0.5) * 6 : 0}px, ${loud ? (S.hash(Math.floor(t * 30) + i + 9) - 0.5) * 6 : 0}px)` : 'scale(1)'; });
    };
  }

  // ---------- name tag (lower third) ----------
  function nameTag(O, name, role, color) {
    style(); const t = div(O, ''); t.className = 'tag'; t.innerHTML = `<div class="bar" style="background:${color}"></div><div class="tx"><div class="nm">${name}</div><div class="rl">${role}</div></div>`;
    return (lt, at, dur = 4) => { const a = S.seg(lt, at, at + 0.4), b = S.seg(lt, at + dur, at + dur + 0.35); t.style.opacity = a * (1 - b); t.style.transform = `translateX(${(1 - E.outCubic(a)) * -80 + E.inCubic(b) * -60}px)`; };
  }
  // ---------- place / time stamp (types on) ----------
  function stamp(O, top, sub) {
    style(); const s = div(O, ''); s.className = 'stamp'; s.innerHTML = `<div class="a"></div><div class="b"></div>`; const A = s.firstChild, B = s.lastChild;
    return (lt, at, dur = 4) => { const n1 = Math.floor(S.seg(lt, at, at + top.length * 0.045) * top.length), n2 = Math.floor(S.seg(lt, at + 0.3, at + 0.3 + (sub || '').length * 0.03) * (sub || '').length);
      A.textContent = top.slice(0, n1); B.textContent = (sub || '').slice(0, n2); s.style.opacity = 1 - S.seg(lt, at + dur, at + dur + 0.4); s.style.visibility = lt < at ? 'hidden' : ''; };
  }
  // ---------- explainer note ----------
  function note(O, text, icon = '!') {
    style(); const n = div(O, ''); n.className = 'note'; n.innerHTML = `<div class="ic">${icon}</div><div class="tx">${text}</div>`;
    return (lt, at, dur = 3.5) => { const a = S.seg(lt, at, at + 0.35), b = S.seg(lt, at + dur, at + dur + 0.3); n.style.opacity = a * (1 - b); n.style.transform = `translate(-50%, ${(1 - E.outBack(a, 1.6)) * -40 + b * -30}px)`; };
  }
  // ---------- store map: top-down plan, Bob's route draws on, a pulsing dot at the current spot ----------
  // stops: [[x, y, label], ...] in the 1000x600 map space; showUpTo = how many legs are drawn
  const STOPS = { reg: [500, 520, 'REGISTER 3'], stock: [860, 120, 'STOCKROOM'], desk: [160, 470, 'CUSTOMER SERVICE'], a9: [500, 250, 'AISLE 9'], frz: [880, 330, 'FREEZERS'], door: [500, 585, 'DOORS'] };
  function map(O, route) {
    style();
    const w = div(O, 'left:1180px;top:110px;width:1000px;height:600px;opacity:0;transform-origin:0 0');
    const aisles = [200, 300, 400, 500, 600, 700, 800].map((x, i) => `<rect x="${x - 34}" y="90" width="68" height="300" rx="8" fill="${i === 3 ? '#3a1e1e' : '#2a2e38'}" stroke="${i === 3 ? '#C9302C' : '#3e4452'}" stroke-width="4"/>`).join('');
    const lanes = [300, 420, 580, 700].map((x) => `<rect x="${x - 40}" y="470" width="80" height="26" rx="6" fill="#1F8A55"/>`).join('');
    w.innerHTML = `<svg viewBox="0 0 1000 600" width="1000" height="600" style="overflow:visible">
      <rect x="20" y="20" width="960" height="560" rx="24" fill="rgba(10,12,18,.9)" stroke="#A6FF3D" stroke-width="4"/>
      <text x="500" y="70" text-anchor="middle" font-family="Anton" font-size="40" fill="#fff" letter-spacing="3">FRESHMART · ROUTE 9</text>
      ${aisles}${lanes}<text x="500" y="410" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="20" fill="#ff8a80">AISLE 9</text>
      <rect x="780" y="70" width="170" height="110" rx="10" fill="#3b2f25" stroke="#7a5a3a" stroke-width="4"/><rect x="820" y="270" width="120" height="120" rx="10" fill="#1d3a4a" stroke="#5FC8F0" stroke-width="4"/>
      <rect x="70" y="440" width="190" height="60" rx="10" fill="#1d3060" stroke="#2F7BE8" stroke-width="4"/><rect x="380" y="560" width="240" height="18" rx="6" fill="#9aa0aa"/>
      <path class="route" d="" fill="none" stroke="#A6FF3D" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 22"/>
      <circle class="dot" r="16" fill="#FF5A4E" stroke="#fff" stroke-width="4"/><circle class="ring" r="16" fill="none" stroke="#FF5A4E" stroke-width="4"/>
      <text class="lbl" text-anchor="middle" font-family="Anton" font-size="34" fill="#fff"></text></svg>`;
    const path = w.querySelector('.route'), dot = w.querySelector('.dot'), ring = w.querySelector('.ring'), lbl = w.querySelector('.lbl');
    const pts = route.map((k) => STOPS[k]);
    return (lt, at, dur = 4) => {
      const a = S.seg(lt, at, at + 0.4), b = S.seg(lt, at + dur, at + dur + 0.4); w.style.opacity = a * (1 - b); w.style.transform = `scale(${0.62 * (0.92 + 0.08 * E.outCubic(a))})`;
      const u = E.inOutCubic(S.seg(lt, at + 0.4, at + 0.4 + 1.6)); const n = pts.length - 1, seg = Math.min(n - 1, Math.floor(u * n)), f = u * n - seg;
      let d = `M ${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i <= seg; i++) d += ` L ${pts[i][0]} ${pts[i][1]}`;
      const cx = n ? pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * f : pts[0][0], cy = n ? pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * f : pts[0][1]; d += ` L ${cx} ${cy}`;
      path.setAttribute('d', d); dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); ring.setAttribute('cx', cx); ring.setAttribute('cy', cy);
      const pu = (lt * 1.5) % 1; ring.setAttribute('r', 16 + pu * 30); ring.setAttribute('opacity', 1 - pu);
      const last = pts[pts.length - 1]; lbl.setAttribute('x', last[0]); lbl.setAttribute('y', last[1] - 34); lbl.textContent = u >= 1 ? last[2] : '';
    };
  }
  // ---------- subscribe end card ----------
  function subscribe(O) {
    style();
    const w = div(O, 'left:0;right:0;top:640px;text-align:center;opacity:0');
    w.innerHTML = `<div style="display:inline-flex;align-items:center;gap:26px">
      <div class="btn" style="padding:22px 44px 18px;border-radius:16px;background:#E8382F;font:400 64px/1 'Anton';letter-spacing:.04em;color:#fff;box-shadow:0 10px 0 #8a1c1a,0 20px 40px rgba(0,0,0,.6)">SUBSCRIBE</div>
      <svg class="bell" width="92" height="92" viewBox="0 0 92 92" style="transform-origin:46px 10px"><path d="M46 10 C 26 10 20 28 20 44 L 20 60 L 12 70 L 80 70 L 72 60 L 72 44 C 72 28 66 10 46 10 Z" fill="#F2B134"/><circle cx="46" cy="78" r="9" fill="#F2B134"/></svg></div>
      <div style="margin-top:26px;font:700 36px/1 'JetBrains Mono';letter-spacing:.18em;color:#A6FF3D">FOR EPISODE 2</div>
      <svg class="cur" width="70" height="90" viewBox="0 0 70 90" style="position:absolute;left:50%;top:0"><path d="M10 6 L 10 70 L 26 56 L 38 84 L 50 78 L 38 52 L 60 52 Z" fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round"/></svg>`;
    const btn = w.querySelector('.btn'), bell = w.querySelector('.bell'), cur = w.querySelector('.cur');
    return (lt, at) => {
      const a = S.seg(lt, at, at + 0.4); w.style.opacity = a; w.style.transform = `translateY(${(1 - E.outBack(a, 1.5)) * 40}px)`;
      const c = S.seg(lt, at + 0.8, at + 1.6), click = lt > at + 1.7 && lt < at + 1.9;
      cur.style.transform = `translate(${S.lerp(260, -60, E.inOutCubic(c))}px, ${S.lerp(160, 40, E.inOutCubic(c))}px) scale(${click ? 0.85 : 1})`;
      const done = lt > at + 1.8; btn.textContent = done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'; btn.style.background = done ? '#3a3f4b' : '#E8382F'; btn.style.transform = `scale(${click ? 0.94 : 1})`;
      bell.style.transform = `rotate(${done ? Math.sin((lt - at - 1.8) * 14) * 22 * Math.exp(-(lt - at - 1.8) * 1.5) : 0}deg)`;
    };
  }
  // ---------- series title card ----------
  function title(O) {
    style(); const w = div(O, 'inset:0;background:#000;opacity:0');
    w.innerHTML = `<div style="position:absolute;left:0;right:0;top:330px;text-align:center;font:400 240px/1 'Anton';letter-spacing:.06em;color:#F4F1EA;-webkit-text-stroke:2px #000;-webkit-mask-image:url(${noise()});-webkit-mask-size:256px">AISLE <span style="color:#C9302C">9</span></div>
      <div style="position:absolute;left:0;right:0;top:610px;text-align:center;font:700 40px/1 'JetBrains Mono';letter-spacing:.3em;color:#A6FF3D">EPISODE 1 · CLOSING TIME</div>`;
    return (lt, at, dur) => { const a = S.seg(lt, at, at + 0.25), b = S.seg(lt, at + dur, at + dur + 0.4); w.style.opacity = a * (1 - b); w.firstChild.style.transform = `scale(${1 + 0.04 * S.seg(lt, at, at + dur)}) translateX(${(S.hash(Math.floor(lt * 18)) > 0.92 ? 6 : 0)}px)`; };
  }
  window.GFX = { captions, nameTag, stamp, note, map, subscribe, title, GREEN, STOPS };
})();
