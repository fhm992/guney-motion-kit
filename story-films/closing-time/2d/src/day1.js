// day1.js: CLOSING TIME, Day 1, in illustrated 2D. Every shot = build(svg) -> frame(t). Deterministic.
// Grounded rules: one horizon per set, everything scaled from it; light from real sources; rain all night; wounds where the story puts them.
(function () {
  const T = TOON, INK = T.INK, f = T.f;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  const easeIn = (u) => { u = clamp(u); return u * u * u; };
  const outBack = (u) => { u = clamp(u); const s = 1.7; return 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2); };
  const noise = (t, k = 1) => Math.sin(t * 7.1 * k) * 0.6 + Math.sin(t * 13.3 * k + 1.3) * 0.4;
  const imp = (t, at, len = 0.5) => (t >= at && t < at + len ? Math.exp(-((t - at) / len) * 5) : 0);
  const blinkAt = (t, seed = 0) => { const p = (t + seed * 1.7) % 3.7; return p < 0.12 ? Math.sin((p / 0.12) * Math.PI) : 0; };
  const svgEl = (parent, html) => { const g = T.el('g', {}, parent); g.innerHTML = html; return g; };

  // ---------- camera with parallax layers ----------
  function rig(svg) {
    const layers = [];
    const L = (d, blurId) => { const g = T.el('g', {}, svg); const inner = T.el('g', {}, g); layers.push({ g, d, inner }); if (blurId) g.setAttribute('filter', `url(#${blurId})`); return inner; };
    const set = (c) => { const z = c.z || 1, r = c.r || 0; layers.forEach(({ g, d }) => { const zd = 1 + (z - 1) * d; const fx = 960 + ((c.x ?? 960) - 960) * d, fy = 540 + ((c.y ?? 540) - 540) * d; g.setAttribute('transform', `translate(960,540) rotate(${f(r)}) scale(${(zd).toFixed(4)}) translate(${f(-fx)},${f(-fy)})`); }); };
    return { L, set };
  }
  function blurFilter(svg, id) { const d = svg.querySelector('defs'); const fl = T.el('filter', { id, x: '-10%', y: '-10%', width: '120%', height: '120%' }, d); const b = T.el('feGaussianBlur', { stdDeviation: 0 }, fl); return (v) => b.setAttribute('stdDeviation', f(v)); }
  function camKeys(keys, t) { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)]; const u = b.t === a.t ? 0 : (b.lin ? clamp : ease)((t - a.t) / (b.t - a.t)); const o = {}; ['x', 'y', 'z', 'r'].forEach((k) => (o[k] = lerp(a[k] ?? (k === 'z' ? 1 : k === 'r' ? 0 : k === 'x' ? 960 : 540), b[k] ?? a[k] ?? (k === 'z' ? 1 : k === 'r' ? 0 : k === 'x' ? 960 : 540), u))); return o; }

  // rain streaks in a box; returns update(t)
  function rain(parent, o) {
    const r = T.R(o.seed || 1); const g = T.el('g', { stroke: o.color || '#a9c4e6', 'stroke-width': o.w || 2, opacity: o.op ?? 0.5, 'stroke-linecap': 'round' }, parent);
    const drops = []; for (let i = 0; i < (o.n || 160); i++) drops.push({ x: o.x0 + r() * (o.x1 - o.x0), p: r(), sp: 0.8 + r() * 0.5, l: (o.len || 34) * (0.6 + r() * 0.6), e: T.el('line', {}, g) });
    return (t) => drops.forEach((d) => { const h = o.y1 - o.y0; const y = o.y0 + ((d.p + t * d.sp * (o.speed || 1.6)) % 1) * h; const x = d.x + (y - o.y0) * (o.slant || 0.08); d.e.setAttribute('x1', f(x)); d.e.setAttribute('y1', f(y)); d.e.setAttribute('x2', f(x + d.l * (o.slant || 0.08))); d.e.setAttribute('y2', f(y + d.l)); });
  }
  const shadow = (x, y, w) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(w * 0.18)}" fill="#000" opacity="0.38"/>`;

  // ---------- recurring sets ----------
  // 1) View from the checkouts into the store (aisle ends, hanging signs). Horizon y=470.
  function storeInterior(o = {}) {
    const H = 470, VX = 960; let s = `<rect width="1920" height="1080" fill="#d4d9de"/>`;
    // ceiling with light panels in perspective
    s += `<polygon points="0,0 1920,0 1920,${H - 230} 0,${H - 230}" fill="#e9ecef"/>`;
    for (let row = 0; row < 6; row++) { const z = 1 + row * 0.9; for (let c = -3; c <= 3; c++) { const x = VX + (c * 380) / z, y = H - 640 / z; const w = 150 / z, h = 34 / z; s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#fbfdff" stroke="${INK}" stroke-width="${f(Math.max(1.5, 4 / z))}"/>`; } }
    // back wall with dairy coolers
    s += `<rect x="0" y="${H - 230}" width="1920" height="300" fill="#c6ccd2"/>`;
    for (let i = 0; i < 12; i++) { const x = 20 + i * 160; s += `<rect x="${x}" y="${H - 170}" width="140" height="210" fill="#bfe4f2" stroke="${INK}" stroke-width="4"/><rect x="${x + 8}" y="${H - 160}" width="124" height="190" fill="#e8f6fb" opacity="0.6"/>`; for (let l = 0; l < 3; l++) for (let k = 0; k < 5; k++) s += `<rect x="${x + 14 + k * 24}" y="${H - 140 + l * 60}" width="18" height="30" fill="${['#f6f6f6', '#3f8fd8', '#f4b81f', '#e0483f'][(i + k + l) % 4]}" stroke="${INK}" stroke-width="2"/>`; }
    s += `<rect x="0" y="${H - 236}" width="1920" height="34" fill="#2f6f4a" stroke="${INK}" stroke-width="4"/><text x="960" y="${H - 210}" font-family="Anton" font-size="26" fill="#eaf6ea" text-anchor="middle" letter-spacing="10">DAIRY · FRESH · FROZEN</text>`;
    // floor
    s += `<polygon points="0,${H + 70} 1920,${H + 70} 1920,1080 0,1080" fill="#cfd4d8"/>`;
    for (let k = -14; k <= 14; k++) s += `<line x1="${VX + k * 60}" y1="${H + 70}" x2="${VX + k * 330}" y2="1080" stroke="${INK}" stroke-opacity="0.1" stroke-width="3"/>`;
    for (let y = H + 90; y < 1080; y += (y - H) * 0.28) s += `<line x1="0" y1="${f(y)}" x2="1920" y2="${f(y)}" stroke="${INK}" stroke-opacity="0.1" stroke-width="3"/>`;
    // aisle end caps with hanging numbered signs
    const cats = ['BREAD', 'CEREAL', 'SNACKS', 'CANNED', 'PASTA', 'DRINKS', 'BABY', 'PETS'];
    const r = T.R(o.seed || 2);
    for (let i = 0; i < 8; i++) {
      const x = -100 + i * 280, w = 200, top = H - 150, bot = H + 140;
      s += `<polygon points="${x + w},${top} ${x + w + 80},${top + 30} ${x + w + 80},${bot - 30} ${x + w},${bot}" fill="#5d6670" stroke="${INK}" stroke-width="4"/>`;
      s += `<rect x="${x}" y="${top}" width="${w}" height="${bot - top}" fill="#eef1f3" stroke="${INK}" stroke-width="5"/>`;
      for (let l = 0; l < 4; l++) { const y = top + 30 + l * 64; s += `<rect x="${x + 8}" y="${y + 40}" width="${w - 16}" height="8" fill="#f25a3a" stroke="${INK}" stroke-width="3"/>`; for (let k = 0; k < 6; k++) { const pw = 22 + r() * 8, ph = 26 + r() * 14; s += `<rect x="${x + 12 + k * 30}" y="${y + 40 - ph}" width="${pw}" height="${ph}" fill="${['#e0483f', '#f4b81f', '#3f8fd8', '#5bb85b', '#ff8a3d', '#9b5bd6', '#f6f2e6'][Math.floor(r() * 7)]}" stroke="${INK}" stroke-width="2.5"/>`; } }
      s += `<line x1="${x + w / 2 - 40}" y1="0" x2="${x + w / 2 - 40}" y2="${top - 110}" stroke="${INK}" stroke-width="3"/><line x1="${x + w / 2 + 40}" y1="0" x2="${x + w / 2 + 40}" y2="${top - 110}" stroke="${INK}" stroke-width="3"/>`;
      s += `<rect x="${x + w / 2 - 70}" y="${top - 112}" width="140" height="70" rx="6" fill="#1f5ea8" stroke="${INK}" stroke-width="5"/><text x="${x + w / 2}" y="${top - 70}" font-family="Anton" font-size="38" fill="#fff" text-anchor="middle">${i + 4}</text><text x="${x + w / 2}" y="${top - 50}" font-family="Figtree" font-weight="800" font-size="13" fill="#cfe0ff" text-anchor="middle" letter-spacing="2">${cats[i]}</text>`;
    }
    return s;
  }
  // 2) Store front from inside, looking out through the glass at the car park in the rain. Horizon y=520. Glass base y=930.
  const FH = 520, GB = 930;
  const fs = (y) => 0.95 * (y - FH) / (GB - FH); // person scale on the car park ground
  function carParkOutside(o = {}) {
    let s = T.nightSky({ h: 760, moon: o.moon || [1500, 160], seed: 3, top: '#070c18', mid: '#16213a', bot: '#2c2f48' });
    s += T.skyline(FH, { seed: 7, lit: 0.09, hMax: 240, col: '#121826' });
    s += `<rect y="${FH}" width="1920" height="${1080 - FH}" fill="#1a1f27"/>`;
    // wet asphalt sheen + bay lines toward the vanishing point
    s += `<rect y="${FH}" width="1920" height="${GB - FH}" fill="#2b3550" opacity="0.25"/>`;
    // painted parking bays: two rows of short lines, perpendicular to the store front, on the same ground plane
    const gx = (x, y) => 960 + (x - 960) * (y - FH) / (GB - FH); // ground x at depth y for a line that is at x at the glass
    [[600, 660], [730, 830]].forEach(([ya, yb]) => { for (let k = -12; k <= 12; k++) { const xg = 960 + k * 260; s += `<line x1="${f(gx(xg, ya))}" y1="${ya}" x2="${f(gx(xg, yb))}" y2="${yb}" stroke="#e8e4d0" stroke-width="${f(2 + (yb - FH) / 90)}" opacity="0.6"/>`; } s += `<line x1="0" y1="${yb}" x2="1920" y2="${yb}" stroke="#e8e4d0" stroke-width="${f(2 + (yb - FH) / 90)}" opacity="0.35"/>`; });
    s += `<rect x="0" y="${FH + 4}" width="1920" height="${GB - FH}" fill="url(#lamp)" opacity="0.0"/>`;
    // cars parked in bays (front view), scaled from the same ground
    const cars = o.cars || [[540, 660, '#8a96a6'], [1500, 660, '#b03a36'], [250, 830, '#c8c8c0'], [1760, 830, '#3f6aa0']];
    cars.forEach(([x, y, c]) => (s += T.carFront(x, y, fs(y) * 0.98, c)));
    // street lamps (lit pools on wet ground)
    (o.lamps || [[1150, 640]]).forEach(([x, y]) => { const sc = fs(y); s += `<ellipse cx="${x + 40 * sc}" cy="${y}" rx="${420 * sc + 80}" ry="${70 * sc + 16}" fill="url(#lamp)"/><ellipse cx="${x + 40 * sc}" cy="${y + 30}" rx="${200 * sc + 30}" ry="${120 * sc + 30}" fill="#ffd98a" opacity="0.08"/>` + `<g transform="translate(${x},${y}) scale(${(sc * 1.8).toFixed(3)})">${T.lamp(0, 0, 700).replace(/url\(#lamp\)/, 'none')}</g>`; });
    return s;
  }
  function glassFront(o = {}) { // mullions, door frame, floor inside; doors open by o.door 0..1 handled by caller
    let s = '';
    for (let i = 0; i <= 6; i++) { const x = i * 320; if (i === 3) continue; s += `<rect x="${x - 14}" y="0" width="28" height="${GB}" fill="#2a2f37" stroke="${INK}" stroke-width="6"/>`; }
    s += `<rect x="0" y="230" width="1920" height="22" fill="#2a2f37" stroke="${INK}" stroke-width="6"/><rect x="0" y="0" width="1920" height="40" fill="#cfd5da" stroke="${INK}" stroke-width="6"/>`;
    s += `<rect x="0" y="${GB}" width="1920" height="${1080 - GB}" fill="#d3d8dc" stroke="${INK}" stroke-width="6"/><ellipse cx="960" cy="1010" rx="700" ry="36" fill="#ffffff" opacity="0.35"/>`;
    s += `<rect x="760" y="${GB - 14}" width="400" height="14" fill="#9aa2aa" stroke="${INK}" stroke-width="4"/><text x="960" y="276" font-family="Figtree" font-weight="800" font-size="22" fill="#e8ffe8" text-anchor="middle" letter-spacing="4">ENTRANCE · EXIT</text>`;
    return s;
  }
  function dropletsOnGlass(seed, n = 70) { const r = T.R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * 1920, y = 260 + r() * 640, rr = 2 + r() * 5; s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr)}" ry="${f(rr * 1.3)}" fill="#cfe6ff" opacity="0.35"/>`; if (r() > 0.7) s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + 2)}" y2="${f(y + 20 + r() * 60)}" stroke="#cfe6ff" stroke-width="2" opacity="0.25"/>`; } return s; }
  function slidingDoors(parent) { const g = T.el('g', {}, parent); const a = svgEl(g, `<rect x="0" y="252" width="200" height="${GB - 266}" fill="#9fd0ff" opacity="0.08" stroke="${INK}" stroke-width="8"/>`); const b = svgEl(g, `<rect x="0" y="252" width="200" height="${GB - 266}" fill="#9fd0ff" opacity="0.08" stroke="${INK}" stroke-width="8"/>`); return (u) => { a.setAttribute('transform', `translate(${f(760 - u * 180)},0)`); b.setAttribute('transform', `translate(${f(960 + u * 180)},0)`); }; }

  // 3) Stockroom (night 1: fluorescent light, power on). Floor line y=900.
  function stockroom(o = {}) {
    const r = T.R(o.seed || 5); let s = `<rect width="1920" height="1080" fill="#b9c2bf"/><rect width="1920" height="140" fill="#8e9894"/>`;
    for (let k = 0; k < 3; k++) { const x = 300 + k * 640; const on = !(o.flicker && k === 1); s += `<rect x="${x}" y="40" width="300" height="26" rx="6" fill="${on ? '#f4fffb' : '#6e7a76'}" stroke="${INK}" stroke-width="5" ${on ? 'filter="url(#glow)"' : ''}/>`; }
    const brands = ['CRUNCHY O\'S', 'SODA 24PK', 'PAPER TOWEL', 'BEANS', 'RICE 10KG', 'TOMATOES', 'CHIPS', 'WATER'];
    for (let k = 0; k < 4; k++) { const x = k < 2 ? 20 + k * 360 : 1180 + (k - 2) * 360; s += `<rect x="${x}" y="150" width="20" height="750" fill="#2f5a9a" stroke="${INK}" stroke-width="5"/><rect x="${x + 300}" y="150" width="20" height="750" fill="#2f5a9a" stroke="${INK}" stroke-width="5"/>`; for (let l = 0; l < 4; l++) { const y = 330 + l * 190; s += `<rect x="${x}" y="${y}" width="320" height="16" fill="#e07a2a" stroke="${INK}" stroke-width="5"/>`; let bx = x + 26; while (bx < x + 290) { const w = 70 + r() * 40, h = 70 + r() * 70; if (bx + w > x + 296) break; s += `<rect x="${f(bx)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="#a27a4a" stroke="${INK}" stroke-width="4"/><rect x="${f(bx)}" y="${f(y - h * 0.55)}" width="${f(w)}" height="10" fill="#c9a46c"/><text x="${f(bx + w / 2)}" y="${f(y - h * 0.2)}" font-family="Figtree" font-weight="800" font-size="11" fill="#3a2a18" text-anchor="middle">${brands[Math.floor(r() * brands.length)]}</text>`; bx += w + 6; } } }
    // walk-in freezer (insulated door, heavy handle, keypad lock)
    s += `<rect x="700" y="210" width="520" height="690" fill="#c9d3da" stroke="${INK}" stroke-width="8"/><rect x="730" y="240" width="460" height="660" rx="10" fill="#e3eaef" stroke="${INK}" stroke-width="6"/>`;
    s += `<rect x="740" y="250" width="440" height="40" fill="#2a6ab0" stroke="${INK}" stroke-width="4"/><text x="960" y="279" font-family="Anton" font-size="26" fill="#fff" text-anchor="middle" letter-spacing="6">WALK-IN FREEZER  -18°C</text>`;
    s += `<rect x="1110" y="520" width="44" height="150" rx="14" fill="#8a949c" stroke="${INK}" stroke-width="6"/><rect x="1100" y="560" width="64" height="20" fill="#5a636b" stroke="${INK}" stroke-width="4"/>`;
    s += `<g transform="translate(1250,540)"><rect x="-40" y="-70" width="80" height="140" rx="8" fill="#2a2f35" stroke="${INK}" stroke-width="6"/><rect x="-30" y="-60" width="60" height="26" rx="3" fill="#06200f"/><text x="0" y="-41" font-family="JetBrains Mono" font-weight="700" font-size="13" fill="${o.lockCol || '#7dff9e'}" text-anchor="middle">${o.lockText || 'LOCKED'}</text>${[0, 1, 2].map((rr) => [0, 1, 2].map((cc) => `<rect x="${-26 + cc * 19}" y="${-24 + rr * 19}" width="14" height="14" rx="3" fill="#6a737c"/>`).join('')).join('')}<circle cx="0" cy="48" r="9" fill="${o.led || '#3dff6a'}" filter="url(#glow)"/></g>`;
    s += `<rect x="0" y="900" width="1920" height="180" fill="#7f8784"/><rect x="0" y="900" width="1920" height="12" fill="#5c6461"/>`;
    s += `<g transform="translate(1660,900)"><rect x="-30" y="-120" width="60" height="120" rx="20" fill="#d42a2f" stroke="${INK}" stroke-width="6"/><rect x="-12" y="-150" width="24" height="34" fill="#2a2a2a" stroke="${INK}" stroke-width="5"/></g>`;
    s += `<g transform="translate(220,900)"><path d="M-60,0 L-50,-90 L50,-90 L60,0Z" fill="#f4c21d" stroke="${INK}" stroke-width="6"/><rect x="-6" y="-200" width="12" height="120" fill="#8a6a40" stroke="${INK}" stroke-width="4"/></g>`;
    s += `<rect x="1440" y="300" width="170" height="110" fill="#fafafa" stroke="${INK}" stroke-width="5"/><text x="1525" y="345" font-family="Figtree" font-weight="800" font-size="20" fill="#222" text-anchor="middle">EMPLOYEES</text><text x="1525" y="372" font-family="Figtree" font-weight="800" font-size="20" fill="#222" text-anchor="middle">MUST WASH</text><text x="1525" y="399" font-family="Figtree" font-weight="800" font-size="20" fill="#222" text-anchor="middle">HANDS</text>`;
    return s;
  }
  const ZLOOKS = [{ top: '#3a5a8a', sleeve: 'short', pants: '#2a2a30' }, { top: '#6a6f76', sleeve: 'torn', pants: '#3a3226' }, { top: '#e8e6e0', sleeve: 'torn', pants: '#2c2c34' }, { top: '#8a3a2a', sleeve: 'short', pants: '#46586e' }, { top: '#2f6a3a', sleeve: 'torn', pants: '#2a2a2c' }, { top: '#c8a03a', sleeve: 'short', pants: '#2a2a2c' }, { top: '#4a2f5a', sleeve: 'torn', pants: '#1e1e22' }, { top: '#1f4a8a', sleeve: 'short', pants: '#7a5a3a' }];
  function zombieMob(parent, list, seed) { const r = T.R(seed); return list.sort((a, b) => a.y - b.y).map((z, i) => { svgEl(parent, shadow(z.x, z.y, 70 * z.s)); const c = T.char(parent, { who: 'zombie', zombie: true, s: z.s, x: z.x, y: z.y, look: ZLOOKS[Math.floor(r() * ZLOOKS.length)], zhair: r() > 0.6 ? 1 : 0 }); return Object.assign(z, { c, ph: r() * 6.28, d: r() > 0.5 ? 1 : -1 }); }); }
  function moveMob(mob, t, k = 1) { mob.forEach((z) => z.c.pose({ x: z.x + Math.sin(t * 0.8 + z.ph) * 6 * z.s, arms: T.ZOMBIE_ARMS(t * k, z.ph), lean: -6 * z.d + Math.sin(t * 1.7 + z.ph) * 4, flip: z.d < 0, head: Math.sin(t * 1.3 + z.ph) * 9, look: [z.d * 0.3, -0.3], bob: Math.abs(Math.sin(t * 2.4 + z.ph)) * -6 })); }

  // ---------- SHOTS ----------
  const SH = {};
  SH.day1 = { dur: 2, build(svg) { const g = svgEl(svg, `<rect width="1920" height="1080" fill="#000"/><text x="960" y="600" font-family="Caveat" font-size="230" fill="#f2f2ee" text-anchor="middle">DAY 1</text>`); return (t) => g.setAttribute('opacity', f(seg(t, 0.2, 0.8) * (1 - seg(t, 1.5, 1.95)))); } };

  SH.till = { dur: 6, build(svg) { // customer pole display, close
    const cam = rig(svg); const bl = blurFilter(svg, 'b_till'); bl(10);
    cam.L(0.4, 'b_till').innerHTML = storeInterior({ seed: 1 });
    cam.L(1).innerHTML = `<rect x="905" y="700" width="110" height="420" fill="#3a4049" stroke="${INK}" stroke-width="10"/><g transform="translate(960,520) rotate(-4)"><rect x="-430" y="-230" width="860" height="440" rx="40" fill="#20252b" stroke="${INK}" stroke-width="12"/><rect x="-380" y="-185" width="760" height="350" rx="16" fill="#041a0b" stroke="${INK}" stroke-width="8"/><g font-family="JetBrains Mono" font-weight="700" fill="#7dff9e" filter="url(#glow)"><text x="-340" y="-90" font-size="72">ICE 10LB</text><text x="340" y="40" font-size="130" text-anchor="end">$3.49</text><text x="-340" y="130" font-size="46" fill="#48c96a">REG 2      23:52</text></g><rect x="-380" y="-185" width="760" height="120" rx="16" fill="#ffffff" opacity="0.05"/></g>`;
    return (t) => cam.set({ x: 960 + t * 6, y: 520, z: 1 + t * 0.04, r: -1 }); } };

  SH.ots = { dur: 9, build(svg) {
    const cam = rig(svg); const bl = blurFilter(svg, 'b_ots'); bl(2.2); const bf = blurFilter(svg, 'b_otsf'); bf(14);
    cam.L(0.6, 'b_ots').innerHTML = storeInterior({ seed: 2 });
    const mid = cam.L(1);
    svgEl(mid, `<g transform="translate(1500,0)"><rect x="-10" y="0" width="20" height="620" fill="#2a2f37" stroke="${INK}" stroke-width="5"/><rect x="-60" y="140" width="120" height="120" rx="12" fill="#1d2228" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="200" r="44" fill="#ffd23a" filter="url(#glow)"/><text x="0" y="222" font-family="Anton" font-size="64" fill="#1d1d1d" text-anchor="middle">2</text></g>`);
    const sami = T.char(mid, { who: 'sami', s: 1.42, x: 1040, y: 1010 });
    svgEl(mid, `<g transform="translate(1290,660)"><rect x="-90" y="-60" width="180" height="120" rx="10" fill="#2a3038" stroke="${INK}" stroke-width="7"/><rect x="-10" y="60" width="20" height="90" fill="#2a3038" stroke="${INK}" stroke-width="6"/></g>
      <path d="M380,1080 L470,800 L1700,800 L1790,1080Z" fill="#46505c" stroke="${INK}" stroke-width="9"/><path d="M470,800 L1700,800 L1708,835 L462,835Z" fill="#6a7682" stroke="${INK}" stroke-width="6"/><path d="M520,835 L1300,835 L1330,1080 L470,1080Z" fill="#17191d"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${560 + i * 85}" y1="840" x2="${520 + i * 95}" y2="1080" stroke="#2c3036" stroke-width="5"/>`).join('')}
      <g transform="translate(860,822)"><path d="M0,0 C-10,-70 30,-108 115,-110 C200,-108 240,-70 230,0Z" fill="#dff1ff" stroke="${INK}" stroke-width="8"/><path d="M30,-60 q85,-40 170,0" stroke="#fff" stroke-width="10" fill="none" opacity="0.8"/><path d="M90,-108 q25,-30 50,0" stroke="${INK}" stroke-width="7" fill="#dff1ff"/><text x="115" y="-30" font-family="Anton" font-size="48" fill="#3d7ad6" text-anchor="middle">ICE</text><text x="115" y="-6" font-family="Figtree" font-weight="800" font-size="16" fill="#3d7ad6" text-anchor="middle">10 LB · 4.5 KG</text></g>
      <g transform="translate(1560,700)"><rect x="-70" y="-50" width="140" height="90" rx="8" fill="#1a1e24" stroke="${INK}" stroke-width="6"/><rect x="-58" y="-38" width="116" height="62" rx="4" fill="#04200d"/><text x="0" y="-4" font-family="JetBrains Mono" font-weight="700" font-size="30" fill="#7dff9e" text-anchor="middle" filter="url(#glow)">$3.49</text><rect x="-8" y="40" width="16" height="70" fill="#1a1e24" stroke="${INK}" stroke-width="5"/></g>`);
    const fg = cam.L(1.25, 'b_otsf'); svgEl(fg, `<path d="M-60,1080 L-60,600 C60,500 330,500 470,640 L600,1080Z" fill="#26302a" stroke="${INK}" stroke-width="12"/><path d="M60,640 Q200,600 330,660" stroke="#3a463c" stroke-width="16" fill="none"/><circle cx="210" cy="440" r="215" fill="#1d1c22" stroke="${INK}" stroke-width="12"/><path d="M20,420 L50,300 L110,360 L160,260 L220,350 L280,250 L330,360 L400,320 L420,430" fill="#2a241e" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/><path d="M40,700 q30,40 0,90" stroke="#9fc0e0" stroke-width="6" fill="none" opacity="0.5"/>`);
    return (t) => { cam.set({ x: 1000 + t * 4, y: 600, z: 1.02 + t * 0.012 }); const lk = t < 4.2 ? [-0.6, 0.5] : [0.5, -0.1]; sami.pose({ mood: t > 7 ? 'scared' : 'calm', look: lk, blink: blinkAt(t, 1), bob: Math.sin(t * 1.4) * 2, arms: [[22 + Math.sin(t) * 2, -72], [-22, 72]], head: t < 4.2 ? -4 : 2 }); }; } };

  SH.cash = { dur: 5, build(svg) { // close on the counter: the stained sleeve, the sweat, the bag lifted away
    const cam = rig(svg); const bl = blurFilter(svg, 'b_cash'); bl(9);
    cam.L(0.5, 'b_cash').innerHTML = storeInterior({ seed: 3 });
    const m = cam.L(1);
    svgEl(m, `<rect x="0" y="560" width="1920" height="520" fill="#46505c" stroke="${INK}" stroke-width="8"/><rect x="0" y="600" width="1920" height="480" fill="#17191d"/>${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 130}" y1="600" x2="${i * 130 - 60}" y2="1080" stroke="#2c3036" stroke-width="6"/>`).join('')}<rect x="1300" y="610" width="420" height="200" rx="10" fill="#2a3a40" stroke="${INK}" stroke-width="7"/><rect x="1330" y="640" width="360" height="140" fill="#8fd0c0" opacity="0.35"/><line x1="1330" y1="710" x2="1690" y2="710" stroke="#ff3a2a" stroke-width="4" opacity="0.8"/>`);
    const bag = T.el('g', {}, m); bag.innerHTML = `<path d="M-200,40 C-220,-140 -120,-230 40,-232 C200,-230 290,-140 270,40Z" fill="#dff1ff" stroke="${INK}" stroke-width="10"/><path d="M-120,-150 q150,-80 300,0" stroke="#fff" stroke-width="16" fill="none" opacity="0.8"/><text x="35" y="-40" font-family="Anton" font-size="100" fill="#3d7ad6" text-anchor="middle">ICE</text>`;
    const arm = T.el('g', {}, m); arm.innerHTML = `<path d="M-60,-30 Q40,-60 120,-40 L200,420 L-60,420Z" fill="#3d4a3c" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/><path d="M-40,-20 Q40,-46 112,-30 L118,30 Q40,10 -40,40Z" fill="#2f3a2e"/>`;
    const stain = T.el('path', { fill: '#6a0c12', opacity: 0.92 }, arm); const hand = svgEl(arm, `<ellipse cx="30" cy="-58" rx="70" ry="38" fill="#1d1c22" stroke="${INK}" stroke-width="10"/><path d="M-20,-80 q10,-30 40,-26 M30,-86 q10,-28 40,-22" stroke="${INK}" stroke-width="9" fill="none"/>`);
    const drop = T.el('path', { d: 'M0,0 q10,18 0,26 q-10,-8 0,-26Z', fill: '#bfe6ff', stroke: INK, 'stroke-width': 3 }, m);
    return (t) => { cam.set({ x: 960, y: 640, z: 1.05 + t * 0.03 });
      const lift = easeIn(seg(t, 3.6, 4.8)); const tr = Math.sin(t * 29) * 3 + Math.sin(t * 17) * 2;
      bag.setAttribute('transform', `translate(${f(820 + tr)},${f(820 - lift * 700)})`); arm.setAttribute('transform', `translate(${f(1000 + tr)},${f(800 - lift * 700)}) rotate(-12)`);
      const sp = 0.4 + seg(t, 0.3, 3.4) * 0.6; stain.setAttribute('d', `M${f(-50 + 20 * (1 - sp))},${f(-10)} Q40,${f(-34 - 10 * sp)} ${f(116)},${f(-20)} L${f(118)},${f(20 + 60 * sp)} Q40,${f(30 + 70 * sp)} ${f(-46)},${f(40 + 50 * sp)}Z`);
      const dt = seg(t, 1.4, 2.2); drop.setAttribute('transform', `translate(1090,${f(700 + dt * dt * 260)})`); drop.setAttribute('opacity', t > 1.3 && t < 2.25 ? 1 : 0); }; } };

  function windowWorld(svg, o) { // shared by window + rack shots
    const cam = rig(svg); const bo = blurFilter(svg, 'b_out_' + o.id); const bg2 = blurFilter(svg, 'b_glass_' + o.id);
    const far = cam.L(0.85, 'b_out_' + o.id); far.innerHTML = carParkOutside({ lamps: [[1150, 640]] });
    const rainU = rain(far, { x0: -200, x1: 2100, y0: 0, y1: GB, n: 260, seed: 4, op: 0.35, slant: 0.12 });
    const out = cam.L(0.9, 'b_out_' + o.id);
    const glass = cam.L(1); const doorsU = slidingDoors(glass); svgEl(glass, glassFront());
    const drops = cam.L(1, 'b_glass_' + o.id); drops.innerHTML = dropletsOnGlass(9) + `<rect width="1920" height="${GB}" fill="#a8d0ff" opacity="0.04"/>`;
    const inside = cam.L(1.15);
    return { cam, far, out, glass, drops, inside, rainU, doorsU, blurOut: bo, blurGlass: bg2 };
  }
  SH.window = { dur: 13, build(svg) {
    const W = windowWorld(svg, { id: 'w' }); W.blurOut(0.6); W.blurGlass(0);
    const walkG = T.el('g', {}, W.out); const shG = svgEl(walkG, ''); const man = T.char(walkG, { who: 'man', back: true, stain: true });
    const ice = svgEl(W.out, `<path d="M-30,0 C-32,-26 -16,-36 0,-36 C16,-36 32,-26 30,0Z" fill="#dff1ff" stroke="${INK}" stroke-width="5"/>`);
    svgEl(W.inside, `<rect x="-120" y="760" width="560" height="420" fill="#46505c" stroke="${INK}" stroke-width="9"/><rect x="-120" y="760" width="560" height="36" fill="#6a7682" stroke="${INK}" stroke-width="6"/><g transform="translate(380,0)"><rect x="-8" y="0" width="16" height="560" fill="#2a2f37" stroke="${INK}" stroke-width="5"/><rect x="-46" y="420" width="92" height="92" rx="10" fill="#1d2228" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="466" r="34" fill="#ffd23a" filter="url(#glow)"/><text x="0" y="484" font-family="Anton" font-size="50" fill="#1d1d1d" text-anchor="middle">2</text></g>`);
    const sami = T.char(W.inside, { who: 'sami', back: true, s: 1.35, x: 640, y: 1220 });
    return (t) => { W.cam.set({ x: 980 - t * 10, y: 560, z: 1.02 }); W.rainU(t);
      const door = t < 0.4 ? 1 : 1 - seg(t, 1.2, 2.2); W.doorsU(Math.max(0, door) * (t < 1.2 ? seg(t, 0, 0.3) : 1));
      // walk from the doors (y=GB) to the lamp (y=650) in 6.6 s, then drop the ice and kneel
      const u = seg(t, 0, 6.6); const y = lerp(GB + 10, 652, ease(u) * 0.9 + u * 0.1), x = lerp(1000, 1200, u); const sc = fs(y);
      const ph = t * 7.5; const kneel = seg(t, 7.6, 8.4);
      shG.innerHTML = shadow(x, y, 70 * sc);
      man.pose(Object.assign(T.gait(ph, 'walk'), { x, y, s: sc / (man._s || 1), crouch: ease(kneel), lean: 4 + kneel * 10 }, kneel > 0 ? { legs: [[0, 0], [0, 0]], arms: [[30, -50], [-30, 50]] } : {}));
      const drop = t >= 6.9; const iy = drop ? Math.min(652, 652 - 70 * sc + (t - 6.9) * (t - 6.9) * 600) : y - 90 * sc;
      ice.setAttribute('transform', `translate(${f(drop ? x + 50 * sc : x + 36 * sc)},${f(iy)}) scale(${f(sc * 1.1)}) rotate(${drop ? f(Math.min(1, (t - 6.9) * 3) * 50) : 0})`);
      sami.pose({ bob: Math.sin(t * 1.3) * 2, head: Math.sin(t * 0.5) * 2 }); }; } };

  SH.rack = { dur: 8, build(svg) {
    const W = windowWorld(svg, { id: 'r' });
    const man = T.char(W.out, { who: 'man', back: true, stain: true }); const zm = T.char(W.out, { who: 'man', zombie: true, look: { top: '#3d4a3c', sleeve: 'long', pants: '#25252b', shoes: '#1e1e22', hair: 'shaggy' }, stain: true });
    svgEl(W.out, `<g transform="translate(1268,652) scale(${f(fs(652) * 1.1)}) rotate(50)"><path d="M-30,0 C-32,-26 -16,-36 0,-36 C16,-36 32,-26 30,0Z" fill="#dff1ff" stroke="${INK}" stroke-width="5"/></g>`);
    const refl = T.el('g', { opacity: 0.16 }, W.drops); const rs = T.char(refl, { who: 'sami', s: 2.1, x: 700, y: 1260 });
    return (t) => { W.rainU(t); W.doorsU(0); const fp = ease(seg(t, 0.8, 2.6)); W.blurOut(lerp(7, 0.4, fp)); W.blurGlass(lerp(0, 5, fp));
      W.cam.set({ x: 1180 + t * 3, y: 590, z: 2.3 + t * 0.03 + Math.sin(t * 3) * 0.002 });
      const sc = fs(652); const up = t >= 3.0; man.root.style.display = up ? 'none' : ''; zm.root.style.display = up ? '' : 'none';
      man.pose({ x: 1200, y: 652, s: sc, crouch: 1, lean: 14, arms: [[30, -50], [-30, 50]], legs: [[0, 0], [0, 0]] });
      if (up) { const d = t - 3; const rise = d < 0.5 ? outBack(d / 0.5) : 1; zm.pose({ x: 1200 + Math.sin(d * 0.9) * 4, y: 652, s: sc, crouch: 1 - rise, head: -26 * (1 - rise) + Math.sin(d * 7) * (d < 1 ? 8 : 2) + 8, lean: -6, arms: T.ZOMBIE_ARMS(t, 0), look: [-0.4, -0.2] }); }
      rs.pose({ mood: up ? 'shock' : 'scared', look: [0.6, -0.2], blink: up ? 0 : blinkAt(t, 3) }); }; } };

  SH.aerial = { dur: 8, build(svg) { // high angle over the city at night; the crowd streams toward the one lit store
    const cam = rig(svg); const r = T.R(61);
    const W = 1920; const VX = 960, HZ = 120, F = 900, CH = 260; // camera height (m) above ground, pitch fixed
    const P = (x, z, y = 0) => { const zc = z + 300; return [VX + (F * x) / zc, HZ + (F * (CH - y)) / zc]; };
    const items = [];
    for (let bz = -2; bz < 22; bz++) for (let bx = -10; bx <= 10; bx++) { const x = bx * 40, z = bz * 40 + 60; if (Math.abs(bx) <= 1 && bz >= 0 && bz <= 2) continue; const h = 8 + r() * 26, w = 26; items.push({ z, x, h, w }); }
    items.sort((a, b) => b.z - a.z);
    let s = `<rect width="${W}" height="1080" fill="#0b1018"/>` + `<polygon points="${[P(-600, -80), P(600, -80), P(600, 1000), P(-600, 1000)].map((p) => p.map(f).join(',')).join(' ')}" fill="#151b25"/>`;
    for (let k = -10; k <= 10; k++) { const a = P(k * 40 - 7, -80), b = P(k * 40 - 7, 1000); s += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#2a3446" stroke-width="${f(Math.max(1, 3))}"/>`; }
    // the store and its lit car park
    const st = [P(-50, 40), P(50, 40), P(50, 110), P(-50, 110)];
    s += `<polygon points="${[P(-60, 10), P(60, 10), P(60, 40), P(-60, 40)].map((p) => p.map(f).join(',')).join(' ')}" fill="#3a3f2e"/><ellipse cx="${f(P(0, 25)[0])}" cy="${f(P(0, 25)[1])}" rx="320" ry="90" fill="url(#lamp)"/>`;
    const box = (x, z, w, d, h, top, front, lit) => { const a = P(x - w / 2, z, h), b = P(x + w / 2, z, h), c = P(x + w / 2, z + d, h), e = P(x - w / 2, z + d, h), g0 = P(x - w / 2, z, 0), g1 = P(x + w / 2, z, 0); let o = `<polygon points="${[g0, g1, b, a].map((p) => p.map(f).join(',')).join(' ')}" fill="${front}" stroke="${INK}" stroke-width="2.5"/>`; if (lit) { const rr = T.R(Math.floor(x * 3 + z)); for (let yy = 3; yy < h - 2; yy += 4) for (let xx = -w / 2 + 3; xx < w / 2 - 3; xx += 5) if (rr() < lit) { const q = P(x + xx, z, yy); o += `<rect x="${f(q[0])}" y="${f(q[1])}" width="${f(Math.max(1.5, 900 / (z + 300) * 2))}" height="${f(Math.max(1.5, 900 / (z + 300) * 2.5))}" fill="#ffcf73" opacity="0.85"/>`; } } o += `<polygon points="${[a, b, c, e].map((p) => p.map(f).join(',')).join(' ')}" fill="${top}" stroke="${INK}" stroke-width="2.5"/>`; return o; };
    const near = items.filter((b) => b.z < 40), farB = items.filter((b) => b.z >= 40);
    farB.forEach((b) => (s += box(b.x, b.z, b.w, 30, b.h, '#283040', '#1a202c', 0.06)));
    s += box(0, 40, 100, 70, 7, '#4a505a', '#e8c070', 0) + `<text x="${f(P(0, 40, 5)[0])}" y="${f(P(0, 40, 5)[1])}" font-family="Anton" font-size="20" fill="#ff5a3a" text-anchor="middle" filter="url(#glow)">FRESHWAY</text>`;
    cam.L(0.9).innerHTML = s;
    const crowdL = cam.L(0.95); const crowd = []; for (let i = 0; i < 520; i++) { const st2 = Math.floor(r() * 9) - 4; const along = r() < 0.65; crowd.push({ along, sx: st2 * 40 - 7 + (r() - 0.5) * 5, z0: 60 + r() * 700, x0: -380 + r() * 760, zr: 40 * (Math.floor(r() * 12) + 3) - 7 + (r() - 0.5) * 5, sp: 2 + r() * 2.5, e: T.el('g', {}, crowdL) }); }
    crowd.forEach((c) => (c.e.innerHTML = `<circle r="3" fill="#1a1d1a"/><circle cy="-3" r="2.4" fill="#7fc04a"/>`));
    const nearL = cam.L(1); let ns = ''; near.forEach((b) => (ns += box(b.x, b.z, b.w, 30, b.h, '#2c3446', '#1c2230', 0.05))); nearL.innerHTML = ns;
    const fx = cam.L(1); const pol = [[-87, 200], [33, 150], [-47, 330]].map(([x, z], i) => { const p = P(x, z); return svgEl(fx, `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="${i % 2 ? '#3a6bff' : '#ff2a2a'}" filter="url(#glow)"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="40" fill="${i % 2 ? '#3a6bff' : '#ff2a2a'}" opacity="0.25" filter="url(#soft)"/>`); });
    const heli = svgEl(fx, `<polygon points="0,0 -140,520 140,520" fill="#e8f2ff" opacity="0.12"/><g><ellipse cx="0" cy="0" rx="34" ry="14" fill="#1a1d22" stroke="${INK}" stroke-width="4"/><rect x="20" y="-4" width="60" height="7" fill="#1a1d22"/><line x1="-60" y1="-16" x2="60" y2="-16" stroke="#2a2d33" stroke-width="4"/><circle cx="-6" cy="8" r="4" fill="#ff3b2e"/></g>`);
    svgEl(svg, `<rect width="1920" height="320" fill="#0b1018" opacity="0.7" filter="url(#soft40)"/>`);
    return (t) => { cam.set({ x: 960, y: 520 - t * 6, z: 1.0 + t * 0.03, r: -0.5 });
      crowd.forEach((c) => { let x, z; if (c.along) { x = c.sx; z = Math.max(118, c.z0 - t * c.sp * 6); } else { z = c.zr; x = c.x0 > 0 ? Math.max(-7, c.x0 - t * c.sp * 6) : Math.min(-7, c.x0 + t * c.sp * 6); } const p = P(x, z); const k = 900 / (z + 300) * 1.1; c.e.setAttribute('transform', `translate(${f(p[0])},${f(p[1])}) scale(${k.toFixed(2)})`); });
      pol.forEach((p, i) => p.setAttribute('opacity', Math.floor(t * 3 + i) % 2 ? 1 : 0.2));
      heli.setAttribute('transform', `translate(${f(1500 - t * 40)},${f(200 + Math.sin(t) * 6)}) rotate(${f(-8 + t * 1.5)})`); }; } };

  SH.title = { dur: 4, build(svg) { const g = svgEl(svg, `<rect width="1920" height="1080" fill="#040406"/><g id="tt"><text x="960" y="600" font-family="Anton" font-size="230" fill="#ff4a32" text-anchor="middle" letter-spacing="10" filter="url(#glow)">CLOSING TIME</text></g>`); const tt = g.querySelector('#tt'); const fl = [[0.35, 0.5], [0.62, 0.7], [1.2, 1.3], [2.9, 3.0]]; return (t) => { let a = seg(t, 0.3, 0.9) * (1 - seg(t, 3.2, 3.9)); fl.forEach(([x, y]) => { if (t > x && t < y) a *= 0.15; }); tt.setAttribute('opacity', f(a)); }; } };

  SH.davis = { dur: 8, build(svg) { // Davis runs up aisle 7 from the staff doors, hand on his bitten neck
    const cam = rig(svg); const back = cam.L(0.95); back.innerHTML = T.aisle({ light: 'bright', seed: 7, vx: 960, vy: 470 }) + `<g transform="translate(960,470)"><rect x="-46" y="-34" width="92" height="66" fill="#8a949c" stroke="${INK}" stroke-width="3"/><rect x="-40" y="-28" width="38" height="60" fill="#c9d0d6" stroke="${INK}" stroke-width="2"/><rect x="2" y="-28" width="38" height="60" fill="#c9d0d6" stroke="${INK}" stroke-width="2"/><rect x="-28" y="-46" width="56" height="12" fill="#d42a2f" stroke="${INK}" stroke-width="2"/><text x="0" y="-36" font-family="Figtree" font-weight="800" font-size="8" fill="#fff" text-anchor="middle">STAFF ONLY</text></g><g transform="translate(960,150)"><line x1="-40" y1="-160" x2="-40" y2="0" stroke="${INK}" stroke-width="4"/><line x1="40" y1="-160" x2="40" y2="0" stroke="${INK}" stroke-width="4"/><rect x="-110" y="0" width="220" height="96" rx="8" fill="#1f5ea8" stroke="${INK}" stroke-width="6"/><text x="0" y="56" font-family="Anton" font-size="56" fill="#fff" text-anchor="middle">7</text><text x="0" y="84" font-family="Figtree" font-weight="800" font-size="18" fill="#cfe0ff" text-anchor="middle" letter-spacing="3">CEREAL · BREAKFAST</text></g>`;
    const mid = cam.L(1); const shG = svgEl(mid, ''); const dav = T.char(mid, { who: 'davis', bite: true });
    const fg = cam.L(1.1); const sami = T.char(fg, { who: 'sami', back: true, s: 1.6, x: 1520, y: 1330 }); const samiF = T.char(fg, { who: 'sami', s: 1.6, x: 1560, y: 1330 });
    const LS = window.LIPSYNC;
    return (t) => { const sh = noise(t, 1.3) * 5; cam.set({ x: 960 + sh, y: 560 + noise(t + 3, 1.1) * 4, z: 1.04 + t * 0.008 });
      const u = ease(seg(t, 0, 7.4)); const yF = lerp(500, 900, u); const sc = 0.9 * 900 / (900 - (yF - 470) * 1.4); const s2 = 0.08 + (yF - 470) / 430 * 1.0;
      const g = T.gait(t * 11, 'run'); const k = Math.floor((t - 1.0) * LS.fps); const talk = t > 1.0 && k < LS.D1.length ? LS.D1[k] : 0;
      shG.innerHTML = shadow(960 + Math.sin(t * 2.4) * 20, yF, 70 * s2);
      dav.pose(Object.assign(g, { x: 960 + Math.sin(t * 2.4) * 20, y: yF, s: s2, mood: 'scared', talk, arms: [[-160, -110], g.arms[1]], lean: 6, look: [0, 0.2] }));
      const turned = t > 4.6; sami.root.style.display = turned ? 'none' : ''; samiF.root.style.display = turned ? '' : 'none';
      sami.pose({ bob: Math.sin(t * 2) * 2 }); samiF.pose({ mood: 'shock', look: [-0.8, 0], arms: [[30, -20], [-20, 10]], x: 1560 + ease(seg(t, 4.6, 5.6)) * 60 }); }; } };

  SH.shutter = { dur: 6.5, build(svg) { // Sami hits the red button; the shutter comes down as they run at the glass
    const W = windowWorld(svg, { id: 's' }); W.blurOut(0.8); W.blurGlass(0);
    const runners = []; const r = T.R(8); for (let i = 0; i < 9; i++) { const y0 = 640 + r() * 120; runners.push({ x0: 200 + r() * 1500, y0, ph: r() * 6, sp: 0.75 + r() * 0.3 }); }
    const mobG = T.el('g', {}, W.out); runners.forEach((z) => { z.sg = svgEl(mobG, ''); z.c = T.char(mobG, { who: 'zombie', zombie: true, look: ZLOOKS[Math.floor(r() * 8)] }); });
    const shG = T.el('g', {}, W.glass); const tx = T.el('g', {}, shG); tx.innerHTML = T.shutter(0, 0, 1920, 760, { id: 'S1' });
    svgEl(W.glass, `<rect x="0" y="236" width="1920" height="40" fill="#2a2f37" stroke="${INK}" stroke-width="6"/><rect x="40" y="236" width="20" height="${GB - 236}" fill="#5a6068" stroke="${INK}" stroke-width="4"/><rect x="1860" y="236" width="20" height="${GB - 236}" fill="#5a6068" stroke="${INK}" stroke-width="4"/>`);
    svgEl(W.inside, `<rect x="-60" y="700" width="460" height="420" fill="#c8a46a" stroke="${INK}" stroke-width="8"/><rect x="-60" y="700" width="460" height="40" fill="#e4c98e" stroke="${INK}" stroke-width="6"/><text x="170" y="830" font-family="Anton" font-size="44" fill="#3a2a18" text-anchor="middle">CUSTOMER SERVICE</text><g transform="translate(330,560)"><rect x="-44" y="-44" width="88" height="88" rx="10" fill="#e8e8e8" stroke="${INK}" stroke-width="6"/><circle id="btn" cx="0" cy="0" r="26" fill="#d42a2f" stroke="${INK}" stroke-width="6"/><text x="0" y="66" font-family="Figtree" font-weight="800" font-size="16" fill="#fff" text-anchor="middle">SHUTTER</text></g>`);
    const btn = svg.querySelector('#btn'); const sami = T.char(W.inside, { who: 'sami', s: 1.3, x: 160, y: 1190 });
    return (t) => { W.rainU(t); W.doorsU(0);
      const d = easeIn(seg(t, 1.0, 5.2)); shG.setAttribute('transform', `translate(0,${f(-760 + 236 + d * (GB - 236 - 0) + (d * 0) - 0)})`); tx.setAttribute('transform', `translate(0,${f(0)})`);
      shG.setAttribute('transform', `translate(0,${f(lerp(-524, GB - 760, d))})`);
      runners.forEach((z) => { const u = clamp((t - 0.3) * 0.22 * z.sp); const y = lerp(z.y0, GB - 4, u); const sc = fs(y); const x = lerp(z.x0, 960 + (z.x0 - 960) * 0.6, u); z.sg.innerHTML = shadow(x, y, 70 * sc); z.c.pose(Object.assign(T.gait(t * 10 + z.ph, 'run'), { x, y, s: sc, arms: T.ZOMBIE_ARMS(t * 2, z.ph), lean: 10 })); });
      const sh = imp(t, 5.2, 0.6) * 16; W.cam.set({ x: 960 + noise(t * 3) * sh, y: 600 + noise(t * 3 + 1) * sh, z: 1.06 });
      btn.setAttribute('r', t > 0.6 && t < 0.9 ? 22 : 26); sami.pose({ mood: t > 2 ? 'scared' : 'shock', look: [0.8, -0.2], arms: [[-20, 10], [t > 0.4 ? -150 : -20, t > 0.4 ? -30 : 10]], head: 6 }); }; } };

  SH.crane = { dur: 11, build(svg) { // outside: the horde at the shutter, rain, crane up
    const cam = rig(svg); const HZ = 420; const sc = (y) => 0.33 * (y - HZ) / (640 - HZ);
    const sky = cam.L(0.3); sky.innerHTML = T.nightSky({ h: 760, moon: [300, 150], seed: 9, clouds: 7, top: '#060a14', mid: '#141d33' }) + T.skyline(HZ, { seed: 3, lit: 0.05, hMax: 220, col: '#10151f' });
    const st = cam.L(0.7); st.innerHTML = `<rect y="${HZ - 10}" width="1920" height="${1080 - HZ + 10}" fill="#1b2029"/><rect y="${HZ}" width="1920" height="700" fill="#2b3550" opacity="0.2"/><rect x="290" y="170" width="1340" height="450" fill="#454b55" stroke="${INK}" stroke-width="8"/><rect x="280" y="150" width="1360" height="34" fill="#2c3038" stroke="${INK}" stroke-width="7"/><rect x="660" y="196" width="600" height="96" rx="10" fill="#1d2026" stroke="${INK}" stroke-width="7"/><text x="960" y="270" font-family="Anton" font-size="74" fill="#ff5a3a" text-anchor="middle" letter-spacing="6" filter="url(#glow)">FRESHWAY MARKET</text>` + T.shutter(330, 330, 1260, 296, { id: 'S2' }) + `<rect x="330" y="300" width="1260" height="36" fill="#3a3f47" stroke="${INK}" stroke-width="6"/>` + T.lamp(110, 900, 560) + T.lamp(1700, 900, 560) + T.carFront(1780, 1000, 0.62, '#7a2a2a') + T.carFront(140, 1030, 0.66, '#3e4a5c');
    const mobL = cam.L(1); const list = []; const r = T.R(11); for (let i = 0; i < 64; i++) { const u = Math.pow(r(), 1.2); const y = 640 + u * 420; list.push({ x: 330 + r() * 1260 + (u * (r() - 0.5) * 600), y, s: sc(y) }); }
    const mob = zombieMob(mobL, list, 21);
    const rainL = cam.L(1.1); const rainU = rain(rainL, { x0: -300, x1: 2200, y0: -200, y1: 1200, n: 320, seed: 5, op: 0.35, slant: 0.1 });
    svgEl(svg, `<rect width="1920" height="1080" fill="#22305a" opacity="0.16"/>`);
    return (t) => { cam.set({ x: 960, y: lerp(700, 560, ease(t / 11)), z: lerp(1.35, 1.0, ease(t / 11)) }); moveMob(mob, t); rainU(t); }; } };

  SH.turn = { dur: 6, build(svg) {
    const cam = rig(svg); const room = cam.L(1); room.innerHTML = stockroom({ seed: 10, flicker: true });
    const fl = svg.querySelectorAll('rect[filter="url(#glow)"]');
    const sit = T.char(room, { who: 'davis', bite: true, s: 1.15, x: 900, y: 1020 }); const up = T.char(room, { who: 'davis', zombie: true, bite: true, s: 1.2, x: 900, y: 1000 });
    const red = svgEl(svg, `<rect width="1920" height="1080" fill="#0a1a10" opacity="0.18"/>`);
    return (t) => { const T0 = 2.3; const z = t < T0 ? 1.0 + t * 0.02 : lerp(1.05, 1.55, ease((t - T0) / 0.35)); const sh = t > T0 ? noise(t * 2) * (8 + 30 * imp(t, T0, 0.6)) : 0;
      cam.set({ x: 920 + sh, y: t < T0 ? 760 : lerp(760, 560, ease((t - T0) / 0.35)) + sh * 0.5, z, r: t < T0 ? 1 : lerp(1, 12, ease((t - T0) / 0.35)) });
      const isUp = t >= T0; sit.root.style.display = isUp ? 'none' : ''; up.root.style.display = isUp ? '' : 'none';
      sit.pose({ crouch: 1, mood: 'sad', blink: 1, arms: [[-150, -110], [-25, 40]], head: 14, lean: 8 });
      if (isUp) { const d = t - T0; const rise = d < 0.4 ? outBack(d / 0.4) : 1; up.pose({ crouch: 1 - rise, mood: 'angry', talk: 0.9, arms: [[-120 + Math.sin(d * 9) * 6, -20], [-70, -30]], head: -14 + Math.sin(d * 6) * 5, look: [0.1, -0.3], lean: -6 }); }
      fl.forEach((e) => e.setAttribute('opacity', Math.sin(t * 37) > 0.4 && t < T0 ? 0.2 : 1)); }; } };

  SH.freezer = { dur: 16, build(svg) {
    const cam = rig(svg); const room = cam.L(1); room.innerHTML = stockroom({ seed: 11 });
    const doorG = svg.querySelectorAll('rect[x="730"]')[0];
    const frost = T.el('g', {}, room); const sami = T.char(room, { who: 'sami', s: 1.25, x: 930, y: 1010 });
    const bangs = [0.8, 1.5, 2.1, 4.6, 5.2, 7.9, 10.4, 11.0, 13.6];
    return (t) => { let k = 0; bangs.forEach((b) => (k += imp(t, b, 0.4))); cam.set({ x: 960 + noise(t * 2) * k * 10, y: lerp(600, 560, t / 16) + noise(t * 2 + 2) * k * 6, z: lerp(1.0, 1.35, ease(t / 16)) });
      if (doorG) doorG.setAttribute('transform', `translate(${f(noise(t * 5) * k * 4)},0)`);
      frost.innerHTML = k > 0.25 ? Array.from({ length: 12 }, (_, i) => `<circle cx="${f(730 + (i * 37) % 460)}" cy="${f(240 + ((i * 53) % 640))}" r="${f(6 + k * 10)}" fill="#e8f6ff" opacity="${f(0.35 * k)}" filter="url(#soft6)"/>`).join('') : '';
      sami.pose({ mood: k > 0.3 ? 'shock' : 'scared', look: k > 0.3 ? [-0.6, -0.4] : [0.7, 0.1], blink: k > 0.3 ? 0 : blinkAt(t, 2), arms: [[30, -40], [-30, 40]], bob: Math.sin(t * 2.4) * 3 + k * 8, head: k * 4 }); }; } };

  SH.phone = { dur: 22, build(svg) { // Sami on the floor of the stockroom, phone to his ear
    const cam = rig(svg); const room = cam.L(1); room.innerHTML = stockroom({ seed: 12 }) + `<rect width="1920" height="1080" fill="#0a1022" opacity="0.55"/>`;
    const sami = T.char(room, { who: 'sami', s: 1.25, x: 520, y: 1010 });
    const ph = T.el('g', {}, room); const scr = T.el('g', {}, ph); const glow = svgEl(room, `<ellipse cx="0" cy="0" rx="260" ry="220" fill="#8fc0ff" opacity="0.28" filter="url(#soft40)"/>`);
    let last = -1;
    return (t) => { cam.set({ x: 600, y: 700, z: lerp(1.25, 1.6, ease(t / 22)) });
      const st = t < 11.6 ? 0 : 1; const ear = t < 12.4; sami.pose({ crouch: 1, mood: st ? 'sad' : 'scared', look: st ? [0.4, 0.7] : [0.6, 0], blink: blinkAt(t, 5), arms: [[20, -40], ear ? [-170, -130] : [-40, -80]], head: ear ? -10 : 8, tear: st });
      const px = ear ? 620 : 600, py = ear ? 620 : 800; ph.setAttribute('transform', `translate(${px},${py}) rotate(${ear ? -15 : 10})`);
      if (st !== last) { last = st; scr.innerHTML = `<rect x="-26" y="-48" width="52" height="96" rx="9" fill="#111" stroke="${INK}" stroke-width="5"/><rect x="-20" y="-40" width="40" height="78" rx="5" fill="${st ? '#2a2a34' : '#2a5a9a'}"/><text x="0" y="-8" font-family="Anton" font-size="13" fill="#fff" text-anchor="middle">${st ? 'CALL' : 'MUM'}</text><text x="0" y="10" font-family="Anton" font-size="13" fill="#fff" text-anchor="middle">${st ? 'FAILED' : ''}</text><text x="0" y="28" font-family="Figtree" font-size="8" fill="#cfe" text-anchor="middle">${st ? 'No service' : 'calling…'}</text>`; }
      glow.setAttribute('transform', `translate(${px},${py})`); glow.setAttribute('opacity', st ? 0.6 : 1); }; } };

  SH.chalk = { dur: 23, build(svg) { // by the entrance: the specials board becomes the rules
    const cam = rig(svg); const back = cam.L(0.8); back.innerHTML = `<rect width="1920" height="1080" fill="#cfd5da"/>` + T.shutter(0, 120, 1920, 770, { id: 'S3' }) + `<rect x="0" y="80" width="1920" height="44" fill="#2a2f37" stroke="${INK}" stroke-width="6"/>` + [1, 2, 3, 4, 5].map((i) => `<rect x="${i * 320 - 12}" y="120" width="24" height="770" fill="#2a2f37" stroke="${INK}" stroke-width="5" opacity="0.6"/>`).join('') + `<rect y="890" width="1920" height="190" fill="#d3d8dc" stroke="${INK}" stroke-width="6"/><g transform="translate(1500,40)"><ellipse cx="0" cy="0" rx="46" ry="16" fill="#e8ecef" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="4" r="10" fill="#555"/></g>`;
    const mid = cam.L(1); svgEl(mid, `<g transform="translate(840,980)"><path d="M-300,0 L-250,-640 L250,-640 L300,0" fill="none" stroke="#6b4a2a" stroke-width="22"/><rect x="-280" y="-660" width="560" height="520" rx="12" fill="#6b4a2a" stroke="${INK}" stroke-width="8"/><rect x="-252" y="-632" width="504" height="464" fill="#1e2b25" stroke="${INK}" stroke-width="5"/></g>`);
    const board = T.el('g', { transform: 'translate(840,980)' }, mid);
    const sami = T.char(mid, { who: 'sami', s: 1.3, x: 1290, y: 1040 });
    const lines = ['1. NO NOISE.', '2. NEVER OPEN THE SHUTTER.', '3. NEVER OPEN THE FREEZER.']; const tm = [[2.5, 5.5], [7.0, 10.5], [11.5, 15.0]]; let key = '';
    return (t) => { cam.set({ x: lerp(960, 900, ease(t / 23)), y: lerp(600, 640, ease(t / 23)), z: lerp(1.0, 1.42, ease(t / 23)) });
      const wipe = seg(t, 0.2, 2.0); const parts = tm.map(([a, b], i) => Math.floor(lines[i].length * seg(t, a, b))); const ul = seg(t, 18.0, 18.8);
      const k2 = `${Math.floor(wipe * 10)}|${parts}|${Math.floor(ul * 10)}`;
      if (k2 !== key) { key = k2; board.innerHTML = `<g opacity="${f(0.55 * (1 - wipe))}" font-family="Caveat" fill="#f2f2ee" text-anchor="middle"><text x="0" y="-560" font-size="54">TODAY'S SPECIALS</text><text x="0" y="-480" font-size="44">Ice 10lb ... $3.49</text><text x="0" y="-420" font-size="44">Bananas ... 59¢/lb</text></g><g font-family="Caveat" font-size="44" fill="#f4f4ee">${parts.map((n, i) => `<text x="-226" y="${-520 + i * 110}">${lines[i].slice(0, n)}</text>`).join('')}</g>${ul > 0 ? `<line x1="-226" y1="-504" x2="${f(-226 + 210 * ul)}" y2="-508" stroke="#f4f4ee" stroke-width="5"/>` : ''}`; }
      const writing = parts.some((n, i) => n > 0 && n < lines[i].length) || (ul > 0 && ul < 1);
      sami.pose({ mood: t > 17.5 ? 'angry' : 'calm', look: [-0.9, -0.2], blink: blinkAt(t, 4), arms: [[30, -30], writing ? [-120 + Math.sin(t * 14) * 8, -40] : [-30, 20]], lean: -6 }); }; } };

  window.DAY1 = { SH, order: ['day1', 'till', 'ots', 'cash', 'window', 'rack', 'aerial', 'title', 'davis', 'shutter', 'crane', 'turn', 'freezer', 'phone', 'chalk'] };
})();
