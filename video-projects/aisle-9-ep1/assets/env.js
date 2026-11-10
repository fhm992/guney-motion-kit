// env.js: AISLE 9 environments painted on canvas. Deterministic (seeded). Paint once, move with CSS.
//   ENV.aisle(canvas, { seed, mood, kind:'mixed'|'cans'|'freezer'|'cereal', sign, light })
//   ENV.bokeh(canvas, { seed, mood })  - soft, out-of-focus store behind a character (like a portrait lens)
//   ENV.counter(canvas, {...})          - the checkout counter, register 3
// mood: 'day' (bright warm), 'red' (emergency), 'gray' (dawn), 'ice' (freezer), 'night'
(function () {
  const R = (s) => STAGE.mulberry32(s);
  const MOODS = {
    day:   { ceil: '#EDE6D6', floor: '#D8CFC0', floor2: '#C9BEAD', wall: '#F2EADB', light: '#FFF8E6', fog: '#F6EBD6', fogA: 0.30, tint: null, sat: 1 },
    red:   { ceil: '#1A0608', floor: '#2A0C0E', floor2: '#1E0809', wall: '#2E0B0D', light: '#FF3B30', fog: '#3A0A0C', fogA: 0.55, tint: ['#FF2A20', 0.38], sat: 0.6 },
    gray:  { ceil: '#2C3036', floor: '#3A3E44', floor2: '#30343A', wall: '#40454C', light: '#B9C3CF', fog: '#4A5058', fogA: 0.5, tint: ['#7F8C9C', 0.3], sat: 0.55 },
    ice:   { ceil: '#CFE9F7', floor: '#A9CDE0', floor2: '#97BED3', wall: '#DDF1FB', light: '#E9FBFF', fog: '#BFE6F7', fogA: 0.42, tint: ['#5FC8F0', 0.18], sat: 0.85 },
    night: { ceil: '#111523', floor: '#1B2030', floor2: '#151927', wall: '#1C2133', light: '#8FB4FF', fog: '#1A1F30', fogA: 0.5, tint: ['#2B3D78', 0.35], sat: 0.6 },
  };
  const PAL = {
    mixed: ['#E8382F', '#F2B134', '#2FA36B', '#2F7BE8', '#F06EA9', '#8A4FE0', '#FF8A3D', '#FFE14D', '#21C7C7', '#FFFFFF'],
    cans:  ['#C9302C', '#E8A33D', '#3C8D4E', '#F2D24B', '#D96B2B', '#9C2F4A', '#2E6FBF', '#E7E2D4'],
    cereal:['#F2B134', '#E8382F', '#2F7BE8', '#FF8A3D', '#8A4FE0', '#2FA36B', '#F06EA9'],
    freezer:['#7FD3F5', '#FFFFFF', '#F06EA9', '#B58CFF', '#FFE14D', '#5FA8FF'],
  };
  const mix = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = (s) => Math.round(((pa >> s) & 255) * (1 - u) + ((pb >> s) & 255) * u); return `rgb(${c(16)},${c(8)},${c(0)})`; };
  const hex = (rgb) => { if (rgb[0] === '#') return rgb; const m = rgb.match(/\d+/g).map(Number); return '#' + ((1 << 24) + (m[0] << 16) + (m[1] << 8) + m[2]).toString(16).slice(1); };
  const moodCol = (c, M, depth) => { let x = c; if (M.tint) x = hex(mix(x, M.tint[0], M.tint[1])); if (M.sat < 1) x = hex(mix(x, '#808080', (1 - M.sat) * 0.5)); return mix(x, M.fog, Math.min(0.92, depth * M.fogA)); };

  // one-point perspective aisle. World: camera at origin, looking +z; shelves at x=±W; floor y=+H; shelf top y=-T.
  function aisle(cv, o = {}) {
    const W = cv.width, Hh = cv.height, ctx = cv.getContext('2d'), rnd = R(o.seed || 1), M = MOODS[o.mood || 'day'];
    const vx = W * (o.vx || 0.5), vy = Hh * (o.vy || 0.46), f = W * 0.42;
    const AW = o.width || 2.6, FY = 1.7, TY = -1.9, CY = -2.6, Z0 = 0.6, Z1 = o.depth || 16;
    const P = (x, y, z) => [vx + (x / z) * f, vy + (y / z) * f];
    const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
    const dep = (z) => Math.min(1, (z - Z0) / (Z1 - Z0));
    // back wall / end cap
    ctx.fillStyle = moodCol(M.wall, M, 1); ctx.fillRect(0, 0, W, Hh);
    const bw = [P(-AW, CY, Z1), P(AW, CY, Z1), P(AW, FY, Z1), P(-AW, FY, Z1)];
    poly(bw, moodCol(o.kind === 'freezer' ? '#BFE6F7' : '#E9DCC4', M, 0.9));
    if (o.backSign) { const [a, b] = [P(-AW * 0.8, -1.6, Z1), P(AW * 0.8, -0.9, Z1)]; ctx.fillStyle = moodCol(o.backSignColor || '#2FA36B', M, 0.6); ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.fillStyle = moodCol('#FFFFFF', M, 0.5); ctx.font = `900 ${Math.round((b[1] - a[1]) * 0.62)}px "Basement Grotesque", Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.backSign, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2); }
    // ceiling
    poly([P(-AW, CY, Z0), P(AW, CY, Z0), P(AW, CY, Z1), P(-AW, CY, Z1)], moodCol(M.ceil, M, 0.2));
    // ceiling light panels
    for (let z = 1.2; z < Z1; z += 1.6) { const a = P(-0.5, CY + 0.01, z), b = P(0.5, CY + 0.01, z + 0.7); ctx.fillStyle = moodCol(M.light, M, dep(z) * 0.6); ctx.globalAlpha = 0.95; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.globalAlpha = 1; }
    // floor with tiles + reflections
    const fg = ctx.createLinearGradient(0, vy, 0, Hh); fg.addColorStop(0, moodCol(M.floor2, M, 0.9)); fg.addColorStop(1, moodCol(M.floor, M, 0));
    poly([P(-AW, FY, Z0), P(AW, FY, Z0), P(AW, FY, Z1), P(-AW, FY, Z1)], fg);
    ctx.strokeStyle = moodCol(M.floor2, M, 0.2); ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
    for (let z = Z0 + 0.4; z < Z1; z *= 1.18) { const a = P(-AW, FY, z), b = P(AW, FY, z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    for (let x = -AW; x <= AW + 0.01; x += AW / 3) { const a = P(x, FY, Z0), b = P(x, FY, Z1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // light reflection streak down the middle of the floor
    const rg = ctx.createLinearGradient(vx - 200, 0, vx + 200, 0); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(0.5, M === MOODS.red ? 'rgba(255,60,50,0.35)' : 'rgba(255,255,255,0.28)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    poly([P(-0.5, FY, Z0), P(0.5, FY, Z0), P(0.3, FY, Z1), P(-0.3, FY, Z1)], rg);
    // shelves on both sides
    const pal = PAL[o.kind || 'mixed'], levels = [FY - 0.25, 0.85, 0.05, -0.75, -1.5];
    [-1, 1].forEach((side) => {
      const X = side * AW;
      // shelf back panel
      poly([P(X, TY - 0.2, Z0), P(X, TY - 0.2, Z1), P(X, FY, Z1), P(X, FY, Z0)], moodCol(o.kind === 'freezer' ? '#E4F5FC' : '#3A3F4A', M, 0.3));
      if (o.kind === 'freezer') { // glass doors with frames and inner glow
        for (let z = Z0 + 0.2; z < Z1; z += 1.3) {
          const a = P(X, TY, z), b = P(X, TY, z + 1.2), c = P(X, FY - 0.1, z + 1.2), d = P(X, FY - 0.1, z);
          poly([a, b, c, d], moodCol('#9FDDF5', M, dep(z) * 0.8));
          for (let l = 0; l < 4; l++) for (let k = 0; k < 4; k++) { const y0 = TY + 0.3 + l * 0.8, zz = z + 0.1 + k * 0.27; const q = [P(X * 0.99, y0, zz), P(X * 0.99, y0, zz + 0.22), P(X * 0.99, y0 + 0.6, zz + 0.22), P(X * 0.99, y0 + 0.6, zz)]; poly(q, moodCol(pal[Math.floor(rnd() * pal.length)], M, dep(zz) * 0.8 + 0.25)); }
          ctx.globalAlpha = 0.55; poly([a, b, c, d], 'rgba(235,250,255,0.55)'); ctx.globalAlpha = 1; // frost
          ctx.strokeStyle = moodCol('#F4FBFF', M, dep(z) * 0.5); ctx.lineWidth = Math.max(2, 14 / z); ctx.beginPath(); [a, b, c, d, a].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        }
        return;
      }
      levels.forEach((ly, li) => {
        // the shelf lip
        poly([P(X, ly, Z0), P(X, ly, Z1), P(X - side * 0.25, ly, Z1), P(X - side * 0.25, ly, Z0)], moodCol('#D9DCE2', M, 0.35));
        poly([P(X - side * 0.25, ly, Z0), P(X - side * 0.25, ly, Z1), P(X - side * 0.25, ly + 0.08, Z1), P(X - side * 0.25, ly + 0.08, Z0)], moodCol(o.lip || '#F2B134', M, 0.3));
        if (li === 0) return;
        // products standing on the shelf: front faces in the shelf plane
        let z = Z0 + 0.05;
        while (z < Z1) {
          const w = o.kind === 'cans' ? 0.24 : 0.18 + rnd() * 0.22, hgt = o.kind === 'cans' ? 0.36 + (rnd() < 0.3 ? 0.12 : 0) : 0.35 + rnd() * 0.32;
          const col = pal[Math.floor(rnd() * pal.length)], Xp = X - side * 0.22;
          const q = [P(Xp, ly, z), P(Xp, ly, z + w), P(Xp, ly - hgt, z + w), P(Xp, ly - hgt, z)];
          const d = dep(z);
          poly(q, moodCol(col, M, d));
          // label band and highlight
          const lb = [P(Xp, ly - hgt * 0.62, z), P(Xp, ly - hgt * 0.62, z + w), P(Xp, ly - hgt * 0.38, z + w), P(Xp, ly - hgt * 0.38, z)];
          poly(lb, moodCol(o.kind === 'cans' ? '#F4EFE2' : (rnd() < 0.5 ? '#FFFFFF' : '#1B1B1B'), M, d + 0.1));
          if (o.kind === 'cans') { const tp = [P(Xp, ly - hgt, z), P(Xp, ly - hgt, z + w), P(Xp, ly - hgt + 0.03, z + w), P(Xp, ly - hgt + 0.03, z)]; poly(tp, moodCol('#C7CCD3', M, d)); }
          ctx.globalAlpha = 0.25; poly([P(Xp, ly, z), P(Xp, ly, z + w * 0.25), P(Xp, ly - hgt, z + w * 0.25), P(Xp, ly - hgt, z)], '#FFFFFF'); ctx.globalAlpha = 1;
          z += w + 0.01 + (rnd() < 0.06 ? 0.3 : 0);
        }
        // price tags
        for (let zz = Z0 + 0.4; zz < Z1; zz += 1.1) { const t = [P(X - side * 0.25, ly + 0.01, zz), P(X - side * 0.25, ly + 0.01, zz + 0.18), P(X - side * 0.25, ly + 0.08, zz + 0.18), P(X - side * 0.25, ly + 0.08, zz)]; poly(t, moodCol('#FFFFFF', M, dep(zz))); }
      });
    });
    // hanging aisle sign
    if (o.sign) {
      const z = o.signZ || 5.2, a = P(-0.9, CY + 0.5, z), b = P(0.9, CY + 1.25, z);
      ctx.strokeStyle = moodCol('#777', M, 0.4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0] + 20, P(0, CY, z)[1]); ctx.lineTo(a[0] + 20, a[1]); ctx.moveTo(b[0] - 20, P(0, CY, z)[1]); ctx.lineTo(b[0] - 20, a[1]); ctx.stroke();
      ctx.fillStyle = moodCol(o.signColor || '#1F8A55', M, 0.15); roundRect(ctx, a[0], a[1], b[0] - a[0], b[1] - a[1], 14); ctx.fill();
      ctx.fillStyle = moodCol('#FFFFFF', M, 0.1); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const lines = o.sign.split('\n'); const fh = (b[1] - a[1]) / (lines.length + 0.6);
      lines.forEach((ln, i) => { ctx.font = `${i ? 700 : 900} ${Math.round(fh * (i ? 0.62 : 0.9))}px "Basement Grotesque", Inter, sans-serif`; ctx.fillText(ln, (a[0] + b[0]) / 2, a[1] + fh * (i + 0.85)); });
    }
    // vignette
    const vg = ctx.createRadialGradient(vx, vy, Hh * 0.2, vx, vy, W * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${o.vignette == null ? 0.45 : o.vignette})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, Hh);
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // out-of-focus store: big soft colour blobs and bokeh discs over a gradient (portrait-lens background)
  function bokeh(cv, o = {}) {
    const W = cv.width, Hh = cv.height, ctx = cv.getContext('2d'), rnd = R(o.seed || 3), M = MOODS[o.mood || 'day'];
    const top = o.mood === 'red' ? ['#3A0B0E', '#140405'] : o.mood === 'gray' ? ['#4A5058', '#2A2E34'] : o.mood === 'ice' ? ['#BFE6F7', '#7DB7D2'] : o.mood === 'night' ? ['#1B2238', '#0B0E18'] : ['#C9A889', '#D9CFC6'];
    const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, top[0]); g.addColorStop(0.62, mix(top[0], top[1], 0.6)); g.addColorStop(1, top[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    const pal = o.palette || (o.mood === 'red' ? ['#FF3B30', '#B3161A', '#FF6A3D', '#5A0C10'] : o.mood === 'ice' ? ['#FFFFFF', '#7FD3F5', '#B58CFF', '#E9FBFF'] : o.mood === 'gray' ? ['#8C96A3', '#5E6873', '#B9C3CF'] : o.mood === 'night' ? ['#3D5AFE', '#8FB4FF', '#F2B134', '#1F2B5A'] : ['#E8382F', '#F2B134', '#FF8A3D', '#2FA36B', '#F06EA9', '#FFE14D', '#2F7BE8']);
    ctx.filter = `blur(${Math.round(W / 40)}px)`;
    // shelf-like coloured columns (blurred)
    for (let i = 0; i < 26; i++) { const x = rnd() * W, w = 60 + rnd() * 200, y = Hh * (0.15 + rnd() * 0.35), h = Hh * (0.2 + rnd() * 0.25); ctx.globalAlpha = 0.55 + rnd() * 0.35; ctx.fillStyle = pal[Math.floor(rnd() * pal.length)]; ctx.fillRect(x, y, w, h); }
    // floor
    ctx.globalAlpha = 1; const fg = ctx.createLinearGradient(0, Hh * 0.6, 0, Hh); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, o.mood === 'day' || !o.mood ? 'rgba(200,198,210,0.95)' : 'rgba(0,0,0,0.6)'); ctx.fillStyle = fg; ctx.fillRect(0, Hh * 0.55, W, Hh * 0.45);
    ctx.filter = 'none';
    // bokeh discs
    for (let i = 0; i < 38; i++) { const x = rnd() * W, y = Hh * (0.05 + rnd() * 0.55), r = 20 + rnd() * 70; const c = pal[Math.floor(rnd() * pal.length)]; const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, c); rg.addColorStop(0.7, c); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = 0.18 + rnd() * 0.3; ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    // ceiling lights glow
    for (let i = 0; i < 6; i++) { const x = W * (0.1 + i * 0.16), y = Hh * 0.04; const rg = ctx.createRadialGradient(x, y, 0, x, y, 260); rg.addColorStop(0, o.mood === 'red' ? 'rgba(255,60,40,0.7)' : 'rgba(255,250,235,0.85)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.globalAlpha = 0.8; ctx.fillStyle = rg; ctx.fillRect(x - 260, 0, 520, 300); }
    ctx.globalAlpha = 1;
  }

  window.ENV = { aisle, bokeh, MOODS, roundRect, mix };
})();
