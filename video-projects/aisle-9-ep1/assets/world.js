// world.js: AISLE 9's 2.5D world. A real perspective camera (position, yaw, pitch, lens) draws the store every frame on
// a canvas: floor tiles, ceiling lights, shelf gondolas full of varied products, checkout lanes, freezer cases, walls,
// windows and signs. Characters and DOM props are placed with the same camera (WORLD.place) so feet sit on the floor and
// sizes stay true. Units are metres; X right, Y up, Z forward. Deterministic: every product is generated from a seed.
(function () {
  const S = STAGE;
  const MOOD = {
    day:   { floor: ['#E7E1D6', '#D6CEC1'], wall: '#EFE6D5', ceil: '#F3EEE4', light: '#FFF6E0', fog: [246, 238, 222], fogK: 0.035, amb: 1, tint: null, glow: 0.55 },
    night: { floor: ['#272C3C', '#1E2230'], wall: '#232838', ceil: '#191C28', light: '#9DB6FF', fog: [22, 26, 40], fogK: 0.07, amb: 0.55, tint: [40, 60, 120, 0.35], glow: 0.35 },
    red:   { floor: ['#3A1517', '#2A0E10'], wall: '#3A1012', ceil: '#1E0708', light: '#FF4436', fog: [40, 8, 10], fogK: 0.08, amb: 0.5, tint: [255, 40, 30, 0.35], glow: 0.7 },
    gray:  { floor: ['#5A5F67', '#4A4F57'], wall: '#62676F', ceil: '#3C4047', light: '#C9D3DF', fog: [70, 76, 86], fogK: 0.06, amb: 0.72, tint: [110, 125, 145, 0.3], glow: 0.3 },
    ice:   { floor: ['#BCDDEC', '#A6CCDF'], wall: '#DDF2FB', ceil: '#E8F6FC', light: '#EFFBFF', fog: [200, 232, 246], fogK: 0.05, amb: 0.95, tint: [90, 190, 235, 0.16], glow: 0.7 },
    warm:  { floor: ['#5A4A40', '#4A3C34'], wall: '#5A4638', ceil: '#2A221C', light: '#FFD9A0', fog: [60, 44, 34], fogK: 0.06, amb: 0.7, tint: [255, 170, 90, 0.18], glow: 0.6 },
  };
  const PAL = {
    mixed: ['#E8382F', '#F2B134', '#2FA36B', '#2F7BE8', '#F06EA9', '#8A4FE0', '#FF8A3D', '#FFE14D', '#21C7C7', '#FFFFFF'],
    cans: ['#C9302C', '#E8A33D', '#3C8D4E', '#F2D24B', '#D96B2B', '#9C2F4A', '#2E6FBF', '#E7E2D4'],
    cereal: ['#F2B134', '#E8382F', '#2F7BE8', '#FF8A3D', '#8A4FE0', '#2FA36B', '#F06EA9'],
    snacks: ['#E8382F', '#FFE14D', '#2F7BE8', '#FF8A3D', '#2FA36B', '#8A4FE0'],
    drinks: ['#2F7BE8', '#21C7C7', '#E8382F', '#FFE14D', '#2FA36B', '#FFFFFF'],
    freezer: ['#7FD3F5', '#FFFFFF', '#F06EA9', '#B58CFF', '#FFE14D', '#5FA8FF'],
  };
  const hex = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const rgb = (a, k = 1) => `rgb(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])})`;

  // ---------- camera ----------
  function camera(c) {
    const cy = Math.cos(c.yaw || 0), sy = Math.sin(c.yaw || 0), cp = Math.cos(c.pitch || 0), sp = Math.sin(c.pitch || 0);
    const f = c.f || 1150, W = 1920, H = 1080, roll = c.roll || 0;
    const toCam = (x, y, z) => { let dx = x - c.x, dy = y - c.y, dz = z - c.z; let x1 = cy * dx - sy * dz, z1 = sy * dx + cy * dz; let y2 = cp * dy - sp * z1, z2 = sp * dy + cp * z1; return [x1, y2, z2]; };
    const proj = (p) => { const s = f / p[2]; let X = p[0] * s, Y = -p[1] * s; if (roll) { const cr = Math.cos(roll), sr = Math.sin(roll); [X, Y] = [cr * X - sr * Y, sr * X + cr * Y]; } return [W / 2 + X, H / 2 + Y]; };
    const flat = (x, z) => sy * (x - c.x) + cy * (z - c.z);   // ground-plane distance along the view direction (ignores pitch)
    return { c, f, toCam, proj, W, H, flat };
  }
  function clipNear(pts, n = 0.12) { // Sutherland-Hodgman against z = n
    const out = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const ia = a[2] >= n, ib = b[2] >= n;
      if (ia) out.push(a); if (ia !== ib) { const t = (n - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, n]); } }
    return out;
  }

  // ---------- scene builders: each returns draw items {pts:[[x,y,z]...], fill, depthBias, detail(ctx, P)} ----------
  function World(opt = {}) {
    this.items = []; this.sprites = []; this.mood = MOOD[opt.mood || 'day']; this.moodName = opt.mood || 'day'; this.lights = []; this.rnd = S.mulberry32(opt.seed || 1);
  }
  const W = World.prototype;
  W.quad = function (pts, fill, o = {}) { this.items.push(Object.assign({ pts, fill }, o)); return this; };
  W.box = function (x0, y0, z0, x1, y1, z1, fill, o = {}) { // axis-aligned box: draw the faces that can face the camera
    const c = o.colors || {}; const F = (k, d) => c[k] || shade(fill, d);
    this.quad([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], F('top', 0.12), Object.assign({ face: 'top' }, o));
    this.quad([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], F('front', 0), Object.assign({ face: 'front', nz: -1 }, o));
    this.quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], F('back', -0.15), Object.assign({ face: 'back', nz: 1 }, o));
    this.quad([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], F('left', -0.22), Object.assign({ face: 'left', nx: -1 }, o));
    this.quad([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], F('right', -0.22), Object.assign({ face: 'right', nx: 1 }, o));
    return this;
  };
  // floor + ceiling with tiles and light panels
  W.room = function (x0, x1, z0, z1, h = 4.2, o = {}) {
    const M = this.mood, tile = o.tile || 1.0;
    for (let x = x0; x < x1; x += tile) for (let z = z0; z < z1; z += tile) {
      const odd = (Math.round(x / tile) + Math.round(z / tile)) % 2; this.quad([[x, 0, z], [x + tile, 0, z], [x + tile, 0, z + tile], [x, 0, z + tile]], odd ? M.floor[0] : M.floor[1], { floor: true });
    }
    this.quad([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], M.ceil, { ceil: true });
    if (o.backWall !== false) this.quad([[x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]], M.wall, { wall: true });
    if (o.frontWall) this.quad([[x1, 0, z0], [x0, 0, z0], [x0, h, z0], [x1, h, z0]], shade(M.wall, -0.05), { wall: true });
    if (o.sideWalls !== false) { this.quad([[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]], shade(M.wall, -0.1), { wall: true }); this.quad([[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]], shade(M.wall, -0.1), { wall: true }); }
    const lx = o.lightRows || [(x0 + x1) / 2];
    lx.forEach((lxx) => { for (let z = z0 + 1; z < z1 - 0.5; z += (o.lightGap || 2.4)) { this.quad([[lxx - 0.35, h - 0.01, z], [lxx + 0.35, h - 0.01, z], [lxx + 0.35, h - 0.01, z + 1.2], [lxx - 0.35, h - 0.01, z + 1.2]], M.light, { emissive: true, flick: o.flicker ? this.rnd() : -1 }); this.lights.push([lxx, h - 0.05, z + 0.6]); } });
    return this;
  };
  // a shelf gondola face along Z at x = X, facing direction dir (+1 faces +x, -1 faces -x), full of products
  W.shelves = function (X, dir, z0, z1, o = {}) {
    const pal = PAL[o.kind || 'mixed'], r = S.mulberry32(o.seed || 7), levels = o.levels || [0.12, 0.52, 0.92, 1.32, 1.68], top = o.height || 2.3, depth = 0.55;
    const back = X - dir * depth, M = this.mood;
    // back panel + uprights + top header
    const SEG = 1.25, segs = []; for (let z = z0; z < z1 - 0.01; z += SEG) segs.push([z, Math.min(z1, z + SEG)]);
    segs.forEach(([a, b]) => { this.quad([[back, 0, a], [back, 0, b], [back, top, b], [back, top, a]], shade(o.panel || '#3A3F4A', 0), { shelfBack: true });
      this.quad([[X, top, a], [X, top, b], [back, top, b], [back, top, a]], shade('#C9CED6', -0.1)); });
    for (let z = z0; z < z1 - 0.01; z += 2.5) { const ze = Math.min(z1, z + 2.5); this.quad([[X, top - 0.32, z], [X, top - 0.32, ze], [X, top, ze], [X, top, z]], o.header || '#1F8A55', { header: o.headerText, dir, nx: dir }); }
    for (let z = z0; z <= z1 + 0.01; z += 1.25) this.quad([[X, 0, z - 0.03], [X, 0, z + 0.03], [X, top, z + 0.03], [X, top, z - 0.03]], '#8E949E');
    levels.forEach((ly, li) => {
      // shelf lip with price tags
      segs.forEach(([a, b]) => { this.quad([[X, ly - 0.06, a], [X, ly - 0.06, b], [X, ly, b], [X, ly, a]], o.lip || '#F2B134', { tags: true, dir, nx: dir });
        this.quad([[X, ly, a], [X, ly, b], [back, ly, b], [back, ly, a]], shade('#D9DCE2', -0.2)); });
      if (li === levels.length) return;
      const nextY = levels[li + 1] || top - 0.34, maxH = Math.min(0.4, nextY - ly - 0.04);
      let z = z0 + 0.03;
      while (z < z1 - 0.1) {
        const type = o.kind === 'cans' ? (r() < 0.8 ? 'can' : 'jar') : o.kind === 'drinks' ? (r() < 0.6 ? 'bottle' : 'box') : o.kind === 'snacks' ? (r() < 0.6 ? 'bag' : 'box') : ['box', 'box', 'bottle', 'can', 'bag', 'jar'][Math.floor(r() * 6)];
        const w = type === 'can' ? 0.13 : type === 'bottle' ? 0.1 : type === 'jar' ? 0.12 : 0.14 + r() * 0.14;
        const hgt = Math.min(maxH, type === 'can' ? 0.16 + (r() < 0.3 ? 0.06 : 0) : type === 'bottle' ? 0.3 : type === 'jar' ? 0.16 : 0.2 + r() * 0.18);
        const col = pal[Math.floor(r() * pal.length)];
        const facings = type === 'box' || type === 'bag' ? 1 : 1 + Math.floor(r() * 3);
        for (let k = 0; k < facings && z < z1 - 0.1; k++) {
          const x = X - dir * 0.02;
          if (!(o.gap && z > o.gap[0] && z < o.gap[1] && li > 0 && li < 4))
            this.quad([[x, ly, z], [x, ly, z + w], [x, ly + hgt, z + w], [x, ly + hgt, z]], col, { product: type, dir, nx: dir, seed: r(), label: r() < 0.5 ? '#FFFFFF' : r() < 0.5 ? '#1B1B1B' : '#F7F4EA' });
          z += w + 0.012;
        }
        if (r() < 0.04) z += 0.25;
      }
    });
    return this;
  };
  // checkout lane counter running along X (cashier stands on +z side). returns this
  W.checkout = function (x0, x1, z, o = {}) {
    this.box(x0, 0, z - 0.45, x1, 0.72, z + 0.45, '#3A3F4B', { colors: { top: '#23262E', front: '#3A3F4B' }, stripe: '#1F8A55' });
    this.quad([[x0, 0.73, z - 0.3], [x0 + (x1 - x0) * 0.6, 0.73, z - 0.3], [x0 + (x1 - x0) * 0.6, 0.73, z + 0.3], [x0, 0.73, z + 0.3]], '#16181D', { belt: true });
    // register monitor
    const mx = x0 + (x1 - x0) * 0.7; this.box(mx, 0.72, z - 0.08, mx + 0.42, 1.1, z + 0.0, '#202329', { colors: { front: '#202329' } });
    this.quad([[mx + 0.03, 0.76, z - 0.081], [mx + 0.39, 0.76, z - 0.081], [mx + 0.39, 1.06, z - 0.081], [mx + 0.03, 1.06, z - 0.081]], '#57D69A', { screen: o.screen || '$4.79', emissive: true });
    // candy rack beside the lane
    if (o.candy !== false) { const cx = x0 - 0.5; this.box(cx, 0, z - 0.3, cx + 0.42, 1.4, z + 0.3, '#2b2f39'); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) this.quad([[cx - 0.001, 0.25 + i * 0.28, z - 0.25 + j * 0.17], [cx - 0.001, 0.25 + i * 0.28, z - 0.1 + j * 0.17], [cx - 0.001, 0.45 + i * 0.28, z - 0.1 + j * 0.17], [cx - 0.001, 0.45 + i * 0.28, z - 0.25 + j * 0.17]], PAL.snacks[(i * 3 + j) % 6], { product: 'bag', dir: -1, seed: i * 0.1 + j * 0.3, label: '#fff' }); }
    // lane light pole
    if (o.lane) { const px = x1 - 0.1; this.box(px - 0.03, 0.72, z - 0.03, px + 0.03, 2.5, z + 0.03, '#9aa0aa'); this.sprites.push({ kind: 'lane', x: px, y: 2.65, z, text: o.lane }); }
    return this;
  };
  // freezer case: glass doors with lit products, along Z at x = X facing dir
  W.freezers = function (X, dir, z0, z1, o = {}) {
    const r = S.mulberry32(o.seed || 3), top = 2.2, back = X - dir * 0.8;
    this.quad([[back, 0, z0], [back, 0, z1], [back, top, z1], [back, top, z0]], '#E6F6FD', { shelfBack: true });
    for (let z = z0; z < z1 - 0.2; z += 1.0) {
      for (let l = 0; l < 4; l++) for (let k = 0; k < 4; k++) { const y0 = 0.35 + l * 0.45, zz = z + 0.08 + k * 0.22; this.quad([[X - dir * 0.3, y0, zz], [X - dir * 0.3, y0, zz + 0.18], [X - dir * 0.3, y0 + 0.32, zz + 0.18], [X - dir * 0.3, y0 + 0.32, zz]], PAL.freezer[Math.floor(r() * 6)], { product: 'box', dir, seed: r(), label: '#fff', frosty: true }); }
      this.quad([[X, 0.2, z + 0.02], [X, 0.2, z + 0.96], [X, 2.05, z + 0.96], [X, 2.05, z + 0.02]], 'rgba(225,245,255,0.42)', { glass: true, dir });
      this.quad([[X, 0.2, z], [X, 0.2, z + 0.04], [X, 2.05, z + 0.04], [X, 2.05, z]], '#F4FBFF');
      this.quad([[X - dir * 0.02, 1.0, z + 0.88], [X - dir * 0.02, 1.0, z + 0.91], [X - dir * 0.02, 1.35, z + 0.91], [X - dir * 0.02, 1.35, z + 0.88]], '#C9D2DA');
    }
    for (let z = z0; z < z1 - 0.01; z += 2.5) { const ze = Math.min(z1, z + 2.5); this.quad([[X, 2.05, z], [X, 2.05, ze], [X, top + 0.25, ze], [X, top + 0.25, z]], '#2F7BE8', { header: o.headerText || 'FROZEN', dir }); }
    return this;
  };
  // stockroom: pallet racks with cartons, along Z at x = X facing dir
  W.racks = function (X, dir, z0, z1, o = {}) {
    const r = S.mulberry32(o.seed || 9), top = 3.2, back = X - dir * 1.0, levels = [0.1, 1.1, 2.1];
    for (let z = z0; z <= z1 + 0.01; z += 2.4) { this.box(Math.min(X, back), 0, z - 0.05, Math.max(X, back), top, z + 0.05, '#C7652B'); }
    levels.forEach((ly) => {
      for (let za = z0; za < z1 - 0.01; za += 1.2) { const zb = Math.min(z1, za + 1.2);
        this.quad([[X, ly + 0.08, za], [X, ly + 0.08, zb], [X, ly + 0.16, zb], [X, ly + 0.16, za]], '#2F5FA8');
        this.quad([[X, ly + 0.16, za], [X, ly + 0.16, zb], [back, ly + 0.16, zb], [back, ly + 0.16, za]], shade('#2F5FA8', -0.3)); }
      let z = z0 + 0.1; while (z < z1 - 0.3) { const w = 0.4 + r() * 0.5, hh = 0.35 + r() * 0.5, col = ['#B98A5A', '#A57A4B', '#C99A66', '#8E6A44'][Math.floor(r() * 4)], x = X - dir * 0.05;
        this.quad([[x, ly + 0.16, z], [x, ly + 0.16, z + w], [x, ly + 0.16 + hh, z + w], [x, ly + 0.16 + hh, z]], col, { product: 'carton', dir, seed: r(), label: '#E9DCC4' }); z += w + 0.04; }
    });
    return this;
  };
  // free-standing cardboard boxes / pallets on the floor
  W.pallet = function (x, z, w = 1.1, d = 1.0, hgt = 0.6, col = '#A57A4B') { this.box(x, 0, z, x + w, 0.14, z + d, '#8E6A44'); this.box(x + 0.05, 0.14, z + 0.05, x + w - 0.05, 0.14 + hgt, z + d - 0.05, col, { product: 'carton' }); return this; };
  // store front: glass wall with doors along X at z = Z (outside is +z), shutters can drop
  W.storefront = function (x0, x1, Z, o = {}) {
    for (let x = x0; x < x1; x += 2) { this.quad([[x, 0, Z], [x + 2, 0, Z], [x + 2, 3.0, Z], [x, 3.0, Z]], 'rgba(30,40,70,0.0)', { window: true }); this.box(x - 0.06, 0, Z - 0.06, x + 0.06, 3.0, Z + 0.06, '#9aa0aa'); }
    this.box(x0, 3.0, Z - 0.1, x1, 4.2, Z + 0.1, '#E9E2D6', { colors: { front: '#E9E2D6' } });
    this.quad([[x0, 3.0, Z - 0.11], [x1, 3.0, Z - 0.11], [x1, 3.55, Z - 0.11], [x0, 3.55, Z - 0.11]], '#1F8A55', { poster: 'FRESHMART · OPEN 24 HOURS', dir: 1 });
    return this;
  };
  // a door in a wall facing +z (seen from inside the room); returns the light-strip item so its colour can change
  W.door = function (x, z, o = {}) {
    const w = 1.1, h = 2.2;
    this.quad([[x - w / 2 - 0.08, 0, z + 0.01], [x + w / 2 + 0.08, 0, z + 0.01], [x + w / 2 + 0.08, h + 0.08, z + 0.01], [x - w / 2 - 0.08, h + 0.08, z + 0.01]], '#2a2d33');
    this.quad([[x - w / 2, 0.03, z + 0.02], [x + w / 2, 0.03, z + 0.02], [x + w / 2, h, z + 0.02], [x - w / 2, h, z + 0.02]], o.color || '#6b717c', { poster: o.label || '', dir: -1 });
    this.quad([[x + w / 2 - 0.16, 1.0, z + 0.03], [x + w / 2 - 0.1, 1.0, z + 0.03], [x + w / 2 - 0.1, 1.18, z + 0.03], [x + w / 2 - 0.16, 1.18, z + 0.03]], '#c9ced6');
    const strip = { pts: [[x - w / 2, 0, z + 0.04], [x + w / 2, 0, z + 0.04], [x + w / 2, 0.03, z + 0.04], [x - w / 2, 0.03, z + 0.04]], fill: o.strip || '#ff4a3a', emissive: false, glowStrip: true };
    this.items.push(strip);
    if (o.crack) { const c = { pts: [[x + w / 2 - 0.01, 0.03, z + 0.04], [x + w / 2 + 0.02, 0.03, z + 0.04], [x + w / 2 + 0.02, h, z + 0.04], [x + w / 2 - 0.01, h, z + 0.04]], fill: o.strip || '#ff4a3a', glowStrip: true }; this.items.push(c); strip.crack = c; }
    return strip;
  };
  // hanging aisle sign (as a sprite drawn on canvas)
  W.sign = function (x, y, z, text, sub, color = '#1F8A55') { this.items.push({ sign: true, at: [x, y, z], text, sub, color }); return this; };
  W.poster = function (pts, color, text) { return this.quad(pts, color, { poster: text }); };

  // ---------- drawing ----------
  function shade(c, k) { if (c[0] !== '#') return c; const [r, g, b] = hex(c); const f = (v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k); return `rgb(${f(r)},${f(g)},${f(b)})`; }
  function fogMix(col, z, M) {
    if (col[0] !== '#' && !col.startsWith('rgb(')) return col;
    let c = col[0] === '#' ? hex(col) : col.match(/\d+/g).map(Number);
    if (M.tint) c = c.map((v, i) => v * (1 - M.tint[3]) + M.tint[i] * M.tint[3]);
    c = c.map((v) => v * M.amb);
    const k = 1 - Math.exp(-M.fogK * Math.max(0, z));
    return rgb(c.map((v, i) => v * (1 - k) + M.fog[i] * k));
  }
  W.render = function (ctx, cam, t = 0, ro = {}) {
    const M = this.mood, C = camera(cam), list = [];
    if (ro.near == null) { ctx.fillStyle = fogMix(M.wall, 30, M); ctx.fillRect(0, 0, 1920, 1080); }
    for (const it of this.items) {
      if (it.sign) { const p = C.toCam(...it.at), fd = C.flat(it.at[0], it.at[2]); if (p[2] > 0.3 && (ro.near == null || fd < ro.near) && (ro.far == null || fd >= ro.far)) list.push({ it, z: p[2], sp: C.proj(p), s: C.f / p[2] }); continue; }
      let pc = it.pts.map((p) => C.toCam(p[0], p[1], p[2]));
      if (pc.every((p) => p[2] < 0.12)) continue;
      const clipped = pc.some((p) => p[2] < 0.12); pc = clipNear(pc); if (pc.length < 3) continue;
      const sp = pc.map(C.proj);
      // cull off-screen
      let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9; for (const [x, y] of sp) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
      if (maxx < -50 || minx > 1970 || maxy < -50 || miny > 1130) continue;
      // back-face cull for boxes
      if (it.nx || it.nz) { const n = it.pts.length, cx = it.pts.reduce((a, p) => a + p[0], 0) / n - cam.x, cz = it.pts.reduce((a, p) => a + p[2], 0) / n - cam.z; if ((it.nx || 0) * cx + (it.nz || 0) * cz > 0) continue; }
      const zavg = pc.reduce((a, p) => a + p[2], 0) / pc.length;
      const zmin = Math.min(...it.pts.map((p) => C.flat(p[0], p[2])));
      const bg = it.floor || it.ceil || it.wall || it.shelfBack || it.window;
      if (ro.near != null && (bg || zmin >= ro.near)) continue;
      if (ro.far != null && !bg && zmin < ro.far) continue;
      list.push({ clipped, it, z: zavg + (it.floor ? 1000 : it.ceil ? 900 : it.wall ? 800 : it.shelfBack ? 0.6 : 0) - (it.product ? 0.02 : 0) - (it.glass ? 0.05 : 0), sp, pc });
    }
    list.sort((a, b) => b.z - a.z);
    for (const L of list) {
      const it = L.it;
      if (it.sign) { drawSign(ctx, L, M); continue; }
      const z = L.pc.reduce((a, p) => a + p[2], 0) / L.pc.length;
      let fill = it.fill;
      if (it.window) { ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); L.sp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(160,190,230,0.10)'; ctx.fill(); continue; }
      if (it.emissive) { const fl = it.flick >= 0 ? flicker(t, it.flick) : 1; fill = M.light; ctx.globalAlpha = 0.25 + 0.75 * fl; }
      else if (!it.glowStrip) fill = fogMix(fill, z, M);
      ctx.beginPath(); L.sp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); ctx.globalAlpha = 1;
      if (it.glowStrip) { ctx.save(); ctx.shadowColor = fill; ctx.shadowBlur = 40; ctx.fill(); ctx.fill(); ctx.restore(); }
      if (L.clipped) { /* no detail on faces cut by the camera plane */ }
      else if (it.product && L.sp.length === 4) drawProduct(ctx, L, M, z);
      else if (it.tags && L.sp.length === 4) drawTags(ctx, L, M, z);
      else if (it.header && L.sp.length === 4) drawText(ctx, L, it.header, '#FFFFFF', M, z);
      else if (it.screen && L.sp.length === 4) drawText(ctx, L, it.screen, '#0d3d26', M, z, 'JetBrains Mono');
      else if (it.poster && L.sp.length === 4) drawText(ctx, L, it.poster, '#FFFFFF', M, z);
      else if (it.floor && z < 14) { ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1; ctx.stroke(); }
      if (it.glass && L.sp.length === 4) { ctx.save(); ctx.clip(); const [a, , c] = L.sp; const g = ctx.createLinearGradient(a[0], a[1], c[0], c[1]); g.addColorStop(0.2, 'rgba(255,255,255,0)'); g.addColorStop(0.45, 'rgba(255,255,255,0.35)'); g.addColorStop(0.55, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fill(); ctx.restore(); }
      if (it.stripe && it.face === 'front' && L.sp.length === 4) { // green band on counters
        const [a, b, c, d] = L.sp; const lerp = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
        const p0 = lerp(a, d, 0.72), p1 = lerp(b, c, 0.72), p2 = lerp(b, c, 0.8), p3 = lerp(a, d, 0.8); ctx.beginPath(); [p0, p1, p2, p3].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.fillStyle = fogMix(it.stripe, z, M); ctx.fill(); }
    }
    // light glows on the ceiling fixtures
    if (ro.near != null) return C;
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, z0] of this.lights) { const p = C.toCam(x, y, z0); if (p[2] < 0.3) continue; const [sx, sy] = C.proj(p), r = C.f / p[2] * 1.1; if (sx < -r || sx > 1920 + r || sy < -r || sy > 1080 + r) continue;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r); const lc = hex(M.light); g.addColorStop(0, `rgba(${lc},${0.5 * M.glow})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - r, sy - r, r * 2, r * 2); }
    ctx.globalCompositeOperation = 'source-over';
    return C;
  };
  function flicker(t, seed) { const h = S.hash(Math.floor(t * 12) + seed * 1000); return h > 0.93 ? 0.2 : h > 0.88 ? 0.6 : 1; }
  // draw shapes inside a projected quad using an affine map from the unit square (u along the face, v up)
  function withQuad(ctx, sp, fn) {
    const [a, b, c, d] = sp; // a=(u0,v0) bottom-left, b=(u1,v0), c=(u1,v1), d=(u0,v1)
    ctx.save(); ctx.transform(b[0] - a[0], b[1] - a[1], d[0] - a[0], d[1] - a[1], a[0], a[1]); fn(); ctx.restore();
  }
  function drawProduct(ctx, L, M, z) {
    const it = L.it, s = it.seed || 0.3, lab = fogMix(it.label || '#E9DCC4', z, M), dark = fogMix('#111111', z, M), hi = 'rgba(255,255,255,0.28)';
    const flip = it.dir > 0 ? L.sp : [L.sp[1], L.sp[0], L.sp[3], L.sp[2]];
    if (Math.abs(flip[1][0] - flip[0][0]) < 2) return; // too thin to detail
    withQuad(ctx, flip, () => {
      ctx.beginPath();
      if (it.product === 'can') { ctx.fillStyle = lab; ctx.fillRect(0, 0.3, 1, 0.38); ctx.fillStyle = 'rgba(200,205,212,0.9)'; ctx.fillRect(0, 0.92, 1, 0.08); ctx.fillRect(0, 0, 1, 0.06); ctx.fillStyle = hi; ctx.fillRect(0.15, 0, 0.15, 1); }
      else if (it.product === 'bottle') { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0.72, 0.28, 0.28); ctx.fillRect(0.72, 0.72, 0.28, 0.28); ctx.fillStyle = lab; ctx.fillRect(0, 0.25, 1, 0.25); ctx.fillStyle = dark; ctx.fillRect(0.38, 0.92, 0.24, 0.08); ctx.fillStyle = hi; ctx.fillRect(0.15, 0.05, 0.12, 0.6); }
      else if (it.product === 'jar') { ctx.fillStyle = dark; ctx.fillRect(0.05, 0.85, 0.9, 0.15); ctx.fillStyle = lab; ctx.fillRect(0, 0.25, 1, 0.4); ctx.fillStyle = hi; ctx.fillRect(0.12, 0.1, 0.12, 0.65); }
      else if (it.product === 'bag') { ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0, 0.88, 1, 0.12); ctx.fillStyle = lab; ctx.beginPath(); ctx.ellipse(0.5, 0.45, 0.3, 0.2, 0, 0, 7); ctx.fill(); ctx.fillStyle = hi; ctx.fillRect(0.08, 0.1, 0.1, 0.7); }
      else if (it.product === 'carton') { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(0, 0.86, 1, 0.08); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(0.44, 0, 0.12, 1); ctx.fillStyle = 'rgba(40,30,20,0.5)'; ctx.fillRect(0.12, 0.3, 0.22, 0.12); }
      else { ctx.fillStyle = lab; ctx.fillRect(0.12, 0.52, 0.76, 0.22); ctx.fillStyle = s < 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0.5, 0.28, 0.22, 0.12, 0, 0, 7); ctx.fill(); ctx.fillStyle = hi; ctx.fillRect(0.06, 0.04, 0.08, 0.9); }
    });
  }
  function drawTags(ctx, L, M, z) {
    const flip = L.it.dir > 0 ? L.sp : [L.sp[1], L.sp[0], L.sp[3], L.sp[2]]; const len = Math.hypot(flip[1][0] - flip[0][0], flip[1][1] - flip[0][1]); if (len < 40) return;
    const n = Math.max(2, Math.floor(len / 70)), col = fogMix('#FFFFFF', z, M);
    withQuad(ctx, flip, () => { ctx.fillStyle = col; for (let i = 0; i < n; i++) ctx.fillRect((i + 0.3) / n, 0.15, 0.4 / n, 0.7); });
  }
  const TEX = {};
  function textTex(text, color, font, aspect) {
    const key = text + color + font + Math.round(aspect); if (TEX[key]) return TEX[key];
    const H = 128, W = Math.max(128, Math.round(H * aspect)), c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle'; let fs = H * 0.7; x.font = `900 ${fs}px "${font}"`;
    const reps = Math.max(1, Math.floor(aspect / Math.max(3.5, text.length * 0.75)));
    for (let i = 0; i < reps; i++) { let w = x.measureText(text).width; const maxW = W / reps * 0.9; const k = Math.min(1, maxW / w); x.save(); x.translate(W * (i + 0.5) / reps, H * 0.54); x.scale(k, 1); x.fillText(text, 0, 0); x.restore(); }
    if (document.fonts && !document.fonts.check(`900 20px "${font}"`)) return c; // font not ready yet: don't cache
    return (TEX[key] = c);
  }
  function drawText(ctx, L, text, color, M, z, font = 'Basement Grotesque') {
    const it = L.it, sp = it.dir < 0 ? [L.sp[1], L.sp[0], L.sp[3], L.sp[2]] : L.sp; const [a, b, c, d] = sp;
    const hgt = Math.hypot(d[0] - a[0], d[1] - a[1]), w = Math.hypot(b[0] - a[0], b[1] - a[1]); if (hgt < 5 || w < 10) return;
    // world aspect of the face (not screen), so text keeps its proportions in perspective
    const P = it.pts, wa = Math.hypot(P[1][0] - P[0][0], P[1][2] - P[0][2], P[1][1] - P[0][1]), ha = Math.hypot(P[3][0] - P[0][0], P[3][1] - P[0][1], P[3][2] - P[0][2]);
    const tex = textTex(text, color, font, wa / ha);
    ctx.save(); ctx.globalAlpha = Math.max(0.2, 1 - (1 - Math.exp(-M.fogK * z)));
    ctx.transform(c[0] - d[0], c[1] - d[1], a[0] - d[0], a[1] - d[1], d[0], d[1]); ctx.drawImage(tex, 0, 0, 1, 1); ctx.restore();
  }
  function drawSign(ctx, L, M) {
    const { sp, s, it } = L, w = 1.8 * s, hh = 0.62 * s; if (w < 20) return;
    const x = sp[0] - w / 2, y = sp[1] - hh / 2;
    ctx.strokeStyle = fogMix('#777777', L.z, M); ctx.lineWidth = Math.max(1, s * 0.02); ctx.beginPath(); ctx.moveTo(x + w * 0.15, y); ctx.lineTo(x + w * 0.15, y - s * 0.6); ctx.moveTo(x + w * 0.85, y); ctx.lineTo(x + w * 0.85, y - s * 0.6); ctx.stroke();
    ctx.fillStyle = fogMix(it.color, L.z, M); ENV.roundRect(ctx, x, y, w, hh, hh * 0.18); ctx.fill();
    ctx.fillStyle = fogMix('#FFFFFF', L.z, M); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `900 ${hh * 0.42}px "Basement Grotesque"`; ctx.fillText(it.text, sp[0], y + hh * (it.sub ? 0.36 : 0.52));
    if (it.sub) { ctx.font = `700 ${hh * 0.22}px Inter`; ctx.fillText(it.sub, sp[0], y + hh * 0.74); }
  }

  // place a character (TOON) or a DOM prop on the floor at world (x, z); returns screen info
  function place(cam, x, z, y = 0) {
    const C = camera(cam), p = C.toCam(x, y, z); if (p[2] < 0.2) return { visible: false };
    const [sx, sy] = C.proj(p); return { visible: true, x: sx, y: sy, ppm: C.f / p[2], depth: C.flat(x, z) };
  }
  // character height: the rig is ~1040 units tall from sole to hair top; a person here is ~1.55 m
  const RIG_PER_M = 1040 / 1.55;
  function actorAt(actor, cam, x, z, pose = {}, opt = {}) {
    const P = place(cam, x, z, opt.y || 0); actor.svg.style.visibility = P.visible ? '' : 'hidden'; if (!P.visible) return P;
    const scale = P.ppm / RIG_PER_M * (opt.size || 1);
    actor.set(Object.assign({}, pose, { x: P.x, y: P.y + 20 * scale * 0 + 0, scale }));
    actor.svg.style.zIndex = Math.round(1000 - P.depth * 10);
    return P;
  }
  // place a DOM element (e.g. an SVG prop) standing on the floor at (x, z): pxH = its height in px at scale 1, mH = real height in metres
  function spriteAt(el, cam, x, z, mH, pxH, o = {}) {
    const P = place(cam, x, z, o.y || 0); el.style.visibility = P.visible ? '' : 'hidden'; if (!P.visible) return P;
    const k = P.ppm * mH / pxH, w = el.offsetWidth || o.w || 0, hh = el.offsetHeight || pxH;
    el.style.transformOrigin = '0 0'; el.style.left = '0px'; el.style.top = '0px';
    el.style.transform = `translate(${P.x - (o.ax == null ? 0.5 : o.ax) * w * k}px, ${P.y - hh * k}px) scale(${k * (o.flip ? -1 : 1)}, ${k}) ${o.rot ? `rotate(${o.rot}deg)` : ''}`;
    el.style.zIndex = Math.round(1000 - P.depth * 10) + (o.z || 0);
    return Object.assign(P, { k });
  }
  window.WORLD = { World, camera, place, actorAt, spriteAt, MOOD, PAL, shade, RIG_PER_M };
})();
