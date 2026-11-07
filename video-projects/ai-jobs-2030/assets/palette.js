// Project palette: colour by role on cool white paper (approved storyboard look).
Object.assign(PAPER.C, {
  navy: '#14213D', navy2: '#24365E', ink: '#14213D',
  blue: '#4285F4', blueDark: '#2A62C9', blue2: '#2A62C9',
  tomato: '#EA4335', tomato2: '#C5221F', red: '#EA4335', sage: '#34A853', sage2: '#1E8E3E', green: '#34A853',
  gold: '#FBBC05', yellow: '#FBBC05', sticky: '#FDD45C', white: '#FFFFFF', orange: '#F5820D', orange2: '#D96A00',
  paper: '#E9EDF3', paper2: '#D5DCE7', kraft: '#C3CDDC', kraft2: '#9AA8BE', sky: '#D6E4FB',
  grey: '#B3BCCB', grey2: '#8C97AA'
});

// ===== shared building blocks for this film (K10). Call with the scene's F. =====
window.K10 = (() => {
  const C = PAPER.C, INK = C.ink, BL = C.blue, RD = C.red, YL = C.gold, GR = C.green, OR = C.orange, WH = C.white;
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = (c) => Math.max(0, Math.min(255, Math.round(k > 0 ? c + (255 - c) * k : c * (1 + k)))); return '#' + [f(r), f(g), f(b)].map(c => c.toString(16).padStart(2, '0')).join(''); };
  // isometric projection: ground (u, v), height z -> screen
  const iso = (ox, oy, sc = 1) => {
    const p = (u, v, z = 0) => [ox + (u - v) * 0.866 * sc, oy + (u + v) * 0.5 * sc - z * sc];
    const pt = (q) => q.map(n => n.toFixed(1)).join(' ');
    const box = (u, v, w, d, h, col, z = 0, top) => { const a = p(u, v, z + h), b = p(u + w, v, z + h), c = p(u + w, v + d, z + h), e = p(u, v + d, z + h), b0 = p(u + w, v, z), c0 = p(u + w, v + d, z), e0 = p(u, v + d, z);
      return `<g filter="url(#cutflat)"><path d="M${pt(e)} L${pt(c)} L${pt(c0)} L${pt(e0)}Z" fill="${shade(col, -0.16)}"/><path d="M${pt(c)} L${pt(b)} L${pt(b0)} L${pt(c0)}Z" fill="${shade(col, -0.36)}"/><path d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(e)}Z" fill="${top || shade(col, 0.12)}"/></g>`; };
    const tile = (u, v, w, d, col, z = 0) => { const q = [p(u, v, z), p(u + w, v, z), p(u + w, v + d, z), p(u, v + d, z)]; return `<path d="M${q.map(pt).join(' L')}Z" fill="${col}"/>`; };
    // a cylinder standing at (u,v) radius r, height h
    const cyl = (u, v, r, h, col, z = 0) => { const [x, y] = p(u, v, z); const rx = r * 1.22 * sc, ry = r * 0.7 * sc, hh = h * sc;
      return `<g filter="url(#cutflat)"><path d="M${x - rx} ${y} v${-hh} a${rx} ${ry} 0 0 0 ${2 * rx} 0 v${hh} a${rx} ${ry} 0 0 1 ${-2 * rx} 0z" fill="${shade(col, -0.2)}"/><ellipse cx="${x}" cy="${y - hh}" rx="${rx}" ry="${ry}" fill="${shade(col, 0.25)}"/></g>`; };
    return { p, box, tile, cyl };
  };
  const JOBS = [['DATA ENTRY CLERK', 'DATA QUALITY ANALYST'], ['TIER 1 SUPPORT REP', 'AI CONVERSATION DESIGNER'], ['JUNIOR COPYWRITER', 'AI CONTENT STRATEGIST'], ['BASIC BOOKKEEPER', 'CASH-FLOW ADVISOR'], ['MANUAL SOFTWARE TESTER', 'AI QA ENGINEER'],
    ['TRADITIONAL TRANSLATOR', 'LOCALIZATION SPECIALIST'], ['JUNIOR GRAPHIC DESIGNER', 'UX PRODUCT DESIGNER'], ['PARALEGAL', 'LEGAL OPS · AI COMPLIANCE'], ['CASHIER & BANK TELLER', 'RELATIONSHIP BANKER'], ['APPOINTMENT SETTER', 'ACCOUNT EXECUTIVE']];

  // ---- THE SWITCH BOARD (HTML, 1500 x 900 at scale 1). done = rows already green. ----
  function board(F, parent, cx, cy, sc, o = {}) {
    const done = o.done || [];
    const rows = JOBS.map(([a, b], i) => { const on = done.includes(i);
      return `<div class="row" style="position:relative;display:flex;align-items:center;height:64px;margin:0 30px 13px;border-radius:8px;background:#1D2E52">
        <div class="num" style="width:72px;height:64px;border-radius:8px;background:${on ? GR : RD};color:#fff;font:400 32px 'Archivo Black';display:grid;place-items:center">${String(i + 1).padStart(2, '0')}</div>
        <div class="old" style="width:640px;padding-left:28px;font:800 30px Inter;color:${on ? '#7F8BA3' : '#fff'};text-decoration:${on ? 'line-through' : 'none'};white-space:nowrap">${a}</div>
        <div class="arr" style="width:90px;opacity:${on ? 1 : 0};color:${YL};font:800 40px Inter;text-align:center">→</div>
        <div style="position:relative;width:590px;height:48px;perspective:600px">
          <div class="q" style="position:absolute;inset:0;border-radius:6px;background:#26385F;color:#5D6B88;font:400 28px 'Archivo Black';display:grid;place-items:center;transform-origin:50% 50%;${on ? 'opacity:0' : ''}">? ? ?</div>
          <div class="g" style="position:absolute;inset:0;border-radius:6px;background:${GR};color:#fff;font:800 28px Inter;display:grid;place-items:center;white-space:nowrap;transform-origin:50% 50%;${on ? '' : 'opacity:0'}">${b}</div></div></div>`; }).join('');
    const outer = F.html(parent, '', cx - 750 * sc, cy - 450 * sc, 1500 * sc, 900 * sc, o.z || 6);
    outer.innerHTML = `<div style="width:1500px;height:900px;transform:scale(${sc});transform-origin:0 0;border-radius:18px;background:#14213D;box-shadow:0 ${30}px 60px rgba(5,10,25,.45), 0 6px 0 #0B1428;overflow:hidden">
      <div style="height:92px;background:#1D2E52;display:flex;align-items:center;justify-content:space-between;padding:0 40px;margin-bottom:26px"><span style="font:400 40px 'Archivo Black';color:#fff;letter-spacing:.02em">THE SWITCH BOARD</span><span style="font:400 46px 'Archivo Black';color:${YL}">2030</span></div>${rows}</div>`;
    const R = [...outer.querySelectorAll('.row')].map((r) => ({ el: r, num: r.querySelector('.num'), old: r.querySelector('.old'), arr: r.querySelector('.arr'), q: r.querySelector('.q'), g: r.querySelector('.g') }));
    const api = { el: outer, rows: R };
    api.flip = (i, t, sound = true) => { const r = R[i];
      F.tl.to(r.q, { rotationX: 90, duration: 0.16, ease: 'power1.in' }, F.rel(t)); F.hide(r.q, t + 0.16);
      F.fromTo(r.g, t + 0.16, { rotationX: -90, opacity: 1 }, { rotationX: 0, opacity: 1 }, 0.22, 'power2.out');
      F.fromTo(r.num, t + 0.1, { backgroundColor: RD }, { backgroundColor: GR }, 0.3);
      F.fromTo(r.old, t + 0.1, { color: '#ffffff' }, { color: '#7F8BA3' }, 0.3); F.fromTo(r.arr, t + 0.15, { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, 0.3);
      F.tl.set(r.old, { textDecoration: 'line-through' }, F.rel(t + 0.2));
      if (sound) { F.sfx(t, 'flip', 0.55); F.sfx(t + 0.16, 'clack', 0.35); } };
    api.unflip = (i, t) => { const r = R[i], tl = F.tl, rl = F.rel; tl.to(r.g, { rotationX: 90, duration: 0.16, ease: 'power1.in' }, rl(t)); tl.set(r.g, { opacity: 0 }, rl(t + 0.16));
      tl.fromTo(r.q, { rotationX: -90, opacity: 1 }, { rotationX: 0, opacity: 1, duration: 0.2, immediateRender: false }, rl(t + 0.16)); tl.to(r.arr, { opacity: 0, duration: 0.2 }, rl(t));
      tl.to(r.num, { backgroundColor: RD, duration: 0.3 }, rl(t)); tl.to(r.old, { color: '#ffffff', duration: 0.3 }, rl(t)); tl.set(r.old, { textDecoration: 'none' }, rl(t + 0.1)); F.sfx(t, 'flick', 0.35); };
    api.hi = (i, t) => F.fromTo(R[i].el, t, { backgroundColor: '#1D2E52' }, { backgroundColor: '#2E4A80' }, 0.3);
    return api;
  }
  // corner board: slides in on the screen layer, flips row i, slides out
  function cornerBoard(F, S, i, t, hold = 3.0) {
    const b = board(F, S.ui, 330, 210, 0.36, { done: [...Array(i).keys()], z: 30 });
    F.in(b.el, t - 0.35, 'left', { dur: 0.45, rot: -3, sfx: 'paperslide', gain: 0.35 }); b.hi(i, t - 0.1); b.flip(i, t + 0.15); F.out(b.el, t + hold, 'left', { dur: 0.45 });
    return b;
  }

  // ---- dark stage + chapter card with an isometric desk diorama ----
  function darkBg(F, S) { S.el.style.backgroundColor = '#14213D'; S.el.style.backgroundImage = 'radial-gradient(ellipse 70% 65% at 58% 42%, #30487A 0%, #1A2A4D 55%, #0B1428 100%)'; }
  function card(F, S, n, title, t, buildIso, o = {}) {
    darkBg(F, S);
    const I = iso(1240, 450, 1.22);
    F.set(S.back, `<ellipse cx="1240" cy="690" rx="640" ry="230" fill="#000" opacity=".28" filter="url(#cutflat)"/>`, 0);
    const plat = F.set(S.mid, I.box(-260, -260, 520, 520, 40, '#DCE3EE'), 1);
    const dio = F.set(S.mid, buildIso(I), 2);
    const tag = F.html(S.ui, `<div style="position:relative;width:440px;height:250px;background:${YL};clip-path:${F.rough(n * 7)};box-shadow:none"><div style="position:absolute;left:28px;top:28px;width:32px;height:32px;border-radius:50%;background:#14213D"></div><div style="position:absolute;left:60px;top:10px;font:400 200px/1 'Archivo Black';color:#14213D">${String(n).padStart(2, '0')}<span style="font-size:54px;opacity:.5">/10</span></div></div>`, 110, 220, 0, 0, 8, { filter: 'drop-shadow(6px 14px 14px rgba(0,0,0,.45))' });
    const tt = F.label(S.ui, title, 110 + Math.max(560, title.length * 46) / 2, 640, { size: o.size || 76, bg: WH, color: INK, rot: 1, z: 8 });
    const stamp = F.html(S.ui, `<div style="padding:10px 30px;border:9px solid ${RD};border-radius:10px;color:${RD};font:400 56px 'Archivo Black';transform:rotate(-8deg)">AT RISK</div>`, 250, 760, 0, 0, 9);
    F.fromTo(plat, t, { opacity: 0, y: 140 }, { opacity: 1, y: 0 }, 0.7, 'power3.out');
    F.fromTo(dio, t + 0.25, { opacity: 0, y: -120 }, { opacity: 1, y: 0 }, 0.6, 'power3.out');
    F.in(tag, t + 0.1, 'left', { dur: 0.6, rot: -10, sfx: 'card', gain: 0.7 });
    F.in(tt, t + 0.5, 'below', { dur: 0.5, rot: 3 });
    F.fromTo(stamp, t + 1.1, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1 }, 0.25, 'power3.in'); F.sfx(t + 1.33, 'stamp', 0.7); S.shake(t + 1.35, 5);
    F.sfx(t, 'swell', 0.5);
    S.cam(t, 1000, 540, 0.96, 0.01).cam(t + 0.2, 1080, 520, 1.06, 3.2, 'inOutSine');
    return { tag, tt, stamp, I };
  }
  // the next shot arrives with an isometric tilt-down (signature move)
  function tiltIn(F, S, t, dur = 1.1) {
    F.fromTo(S.el, t, { rotationX: 48, rotationZ: -8, scale: 0.78, transformPerspective: 1700, transformOrigin: '50% 60%' }, { rotationX: 0, rotationZ: 0, scale: 1 }, dur, 'power3.out');
    F.sfx(t, 'whoosh', 0.45);
  }
  function tiltOut(F, S, t, dur = 0.6) { F.to(S.el, t - dur, { rotationX: -30, scale: 1.15, transformPerspective: 1700, transformOrigin: '50% 40%', opacity: 1 }, dur, 'power2.in'); }

  // ---- green new-role banner ----
  const role = (F, parent, text, x, y, t, size = 60) => { const l = F.label(parent, text, x, y, { size, bg: GR, color: WH, rot: -1.5, z: 12 }); F.in(l, t, 'below', { dur: 0.5, rot: 4, sfx: 'slap', gain: 0.45 }); return l; };

  // ---- Fahim F Hassan signature: write-on reveal ----
  function sig(F, parent, x, y, size, t, color = INK, o = {}) {
    const d = F.html(parent, `<div style="position:relative;display:inline-block;white-space:nowrap;font:700 ${size}px/1 Caveat;color:${color};transform:rotate(${o.rot ?? -4}deg)">Fahim F Hassan<svg style="position:absolute;left:-2%;top:${size * 0.82}px;overflow:visible" width="${size * 6}" height="${size * 0.5}"><path d="M0 ${size * 0.12} C ${size * 1.6} ${size * 0.38}, ${size * 3.6} ${size * 0.02}, ${size * 5.4} ${size * 0.2}" stroke="${o.swash || color}" stroke-width="${Math.max(2.5, size * 0.06)}" fill="none" stroke-linecap="round"/></svg></div>`, x, y, 0, 0, o.z || 14);
    const inner = d.firstChild; gsap.set(d, { xPercent: o.anchor === 'start' ? 0 : -50, yPercent: -50 });
    F.fromTo(inner, t, { clipPath: 'inset(-20% 100% -60% -5%)' }, { clipPath: 'inset(-20% -5% -60% -5%)' }, o.dur || 1.2, 'power1.inOut');
    if (o.sfx !== false) F.sfx(t, 'scribble', 0.5);
    return d;
  }

  // ---- subscribe button + bell; pressed at tPress ----
  function subscribe(F, parent, x, y, t, tPress, o = {}) {
    const d = F.html(parent, `<div style="display:flex;align-items:center;gap:22px">
      <div class="btn" style="position:relative;padding:22px 48px;border-radius:999px;background:${RD};color:#fff;font:800 48px Inter;letter-spacing:.02em;box-shadow:0 10px 0 #A3170F, 0 22px 30px rgba(10,20,40,.35)"><span class="a">SUBSCRIBE</span><span class="b" style="position:absolute;inset:0;display:grid;place-items:center;opacity:0">SUBSCRIBED ✓</span></div>
      <div class="bell" style="width:96px;height:96px;border-radius:50%;background:${YL};display:grid;place-items:center;box-shadow:0 8px 0 #C99200, 0 18px 26px rgba(10,20,40,.3);transform-origin:50% 10%"><svg width="56" height="56" viewBox="-28 -28 56 56"><path d="M-16 10 Q-16 -18 0 -20 Q16 -18 16 10 L20 14 L-20 14Z" fill="#14213D"/><circle cx="0" cy="19" r="6" fill="#14213D"/></svg></div></div>`, x, y, 0, 0, o.z || 20);
    gsap.set(d, { xPercent: -50, yPercent: -50 });
    const btn = d.querySelector('.btn'), a = d.querySelector('.a'), b = d.querySelector('.b'), bell = d.querySelector('.bell');
    F.in(d, t, 'below', { dur: 0.5, rot: 0, sfx: 'pop', gain: 0.45 });
    if (tPress != null) {
      F.to(btn, tPress, { y: 8, boxShadow: '0 2px 0 #A3170F, 0 8px 14px rgba(10,20,40,.3)' }, 0.1, 'power2.in');
      F.to(btn, tPress + 0.12, { y: 0, backgroundColor: '#5D6B88', boxShadow: '0 10px 0 #3A4560, 0 22px 30px rgba(10,20,40,.35)' }, 0.25);
      F.hide(a, tPress + 0.12); F.show(b, tPress + 0.12); F.sfx(tPress, 'click', 0.7);
      const tb = tPress + 0.6; F.tl.to(bell, { rotation: 18, duration: 0.08, yoyo: true, repeat: 7, ease: 'sine.inOut' }, F.rel(tb)); F.tl.set(bell, { rotation: 0 }, F.rel(tb + 0.66)); F.sfx(tb, 'ding', 0.6);
    }
    return { el: d, btn, bell };
  }

  // ---- the prompt shot: laptop + typed prompt + PROMPT tag + pause sticky + signed corner ----
  function prompt(F, S, n, text, t0, t1, o = {}) {
    S.el.style.backgroundColor = '#DCE3EE';
    F.set(S.back, `<rect x="-600" y="900" width="3200" height="600" fill="#C3CDDC" filter="url(#cutflat)"/>`);
    const L = F.laptop(S.mid, 960, 480, 0.9);
    const chat = F.chat(S, L.screen, { top: true, size: o.size || 44, kicker: 'TYPE THIS EXACT PROMPT', title: 'AI chat' });
    chat.type(text, t0, t1, { noCaret: false });
    const tag = F.label(S.ui, `PROMPT ${String(n).padStart(2, '0')}`, 260, 1012, { size: 46, bg: BL, color: WH, rot: -4, font: "'Archivo Black'", weight: 400, z: 10 });
    F.in(tag, (o.tIn ?? t0) - 0.6, 'left', { dur: 0.45 });
    const st = F.label(S.ui, 'pause &amp; copy', 960, 1012, { size: 56, bg: C.sticky, color: INK, rot: 2, font: 'Caveat', weight: 700, z: 10 });
    F.in(st, t0 + 1.2, 'below', { dur: 0.45, sfx: 'sticky', gain: 0.4 });
    const sg = sig(F, S.ui, 1640, 1008, 46, t1 - 1.4, INK, { rot: -3, sfx: false, z: 11 });
    S.cam((o.tIn ?? t0) - 0.8, 960, 480, 1.03, 1.0).cam(t0 + (t1 - t0) * 0.45, 960, 500, 1.07, (t1 - t0) * 0.45, 'inOutSine');
    return { L, chat, tag };
  }
  // ---- a floor + wall interior ----
  const room = (F, S, wall = '#DDE4EE', floor = '#C9D3E2', fy = 820) => F.set(S.back, `<rect x="-600" y="-300" width="3200" height="${fy + 300}" fill="${wall}"/><rect x="-600" y="${fy}" width="3200" height="700" fill="${floor}" filter="url(#cutflat)"/><rect x="-600" y="${fy - 6}" width="3200" height="14" fill="#0E1830" opacity=".08"/>`);
  return { iso, shade, JOBS, board, cornerBoard, darkBg, card, tiltIn, tiltOut, role, sig, subscribe, prompt, room };
})();
