// hero.js: the video's cast, a posable 2D vector rig (pure SVG, deterministic).
//   el.innerHTML = HERO.svg({ cast: 'fahim', pose, face, look, blink, tilt, rim, rim2, bob, walk, ... })
// or build any character inline: HERO.svg({ hair: 'bob', top: 'blazer', topColor: '#34A853', ... })
// Box is 400 x 960 user units, feet at (200, 945). Every part is a function of the options, so it animates per frame.
(function () {
  const POSES = {
    //            left arm (viewer's left)      right arm                 legs (hip, knee)
    idle:     { la: [8, -6, 'fist'],    ra: [-8, 6, 'fist'],     ll: [3, 0],   rl: [-3, 0] },
    wave:     { la: [10, -60, 'hip'],   ra: [-150, 28, 'open'],  ll: [3, 0],   rl: [-3, 0] },
    think:    { la: [6, -4, 'fist'],    ra: [-30, -128, 'fist'], ll: [3, 0],   rl: [-3, 0] },
    worried:  { la: [172, -14, 'open'], ra: [-172, 14, 'open'],  ll: [5, 0],   rl: [-5, 0] },
    point:    { la: [8, -6, 'fist'],    ra: [-96, -6, 'point'],  ll: [3, 0],   rl: [-3, 0] },
    present:  { la: [40, -30, 'open'],  ra: [-40, 30, 'open'],   ll: [4, 0],   rl: [-4, 0] },
    cheer:    { la: [160, -10, 'fist'], ra: [-160, 10, 'fist'],  ll: [6, 0],   rl: [-6, 0] },
    type:     { la: [-30, 85, 'fist'],  ra: [30, -85, 'fist'],   ll: [3, 0],   rl: [-3, 0] },
    phone:    { la: [8, -6, 'fist'],    ra: [-22, -120, 'phone'], ll: [3, 0],  rl: [-3, 0] },
    shrug:    { la: [55, -95, 'open'],  ra: [-55, 95, 'open'],   ll: [3, 0],   rl: [-3, 0] },
    folded:   { la: [-14, -78, 'fist'], ra: [14, 78, 'fist'],    ll: [3, 0],   rl: [-3, 0] },   // arms folded
    call:     { la: [8, -6, 'fist'],    ra: [-30, -140, 'phone'], ll: [3, 0],  rl: [-3, 0] },
  };
  const FACES = {
    smile:     { brow: [0, 0],    eyeH: 1,    mouth: 'smile' },
    happy:     { brow: [-8, 6],   eyeH: 0.9,  mouth: 'grin' },
    talk:      { brow: [-4, 0],   eyeH: 1,    mouth: 'talk' },
    worried:   { brow: [6, -14],  eyeH: 1.05, mouth: 'wobble' },
    shocked:   { brow: [-16, 0],  eyeH: 1.15, mouth: 'o' },
    focused:   { brow: [6, 8],    eyeH: 0.8,  mouth: 'flat' },
    determined:{ brow: [4, 12],   eyeH: 0.9,  mouth: 'smirk' },
    sad:       { brow: [4, -16],  eyeH: 0.85, mouth: 'frown' },
    stern:     { brow: [8, 16],   eyeH: 0.75, mouth: 'flat' },
  };
  // The cast. Same toy-like style (glossy dark heads, big eyes), different hair and clothes.
  const CAST = {
    fahim:  { hair: 'tufts',    top: 'hoodie',   topColor: '#E2302B', bottom: 'jeans', bottomColor: '#252E47', shoes: '#D8302B' },
    maya:   { hairColor: '#2a1710', hairShine: '#8a5a3c', hair: 'long',     top: 'blazer',   topColor: '#2F6FE0', inner: '#F4F2EF', bottom: 'skirt', bottomColor: '#20283A', shoes: '#20283A', lashes: true, lips: '#C2185B' },
    priya:  { hairColor: '#141018', hairShine: '#6a5a8a', hair: 'bun',      top: 'sweater',  topColor: '#F2B705', bottom: 'jeans', bottomColor: '#2B3A55', shoes: '#F4F2EF', lashes: true, glasses: true },
    lena:   { hairColor: '#3a140c', hairShine: '#b0583a', hair: 'ponytail', top: 'tee',      topColor: '#34A853', bottom: 'jeans', bottomColor: '#3A4A6B', shoes: '#F4F2EF', lashes: true, headset: true },
    zara:   { hairColor: '#101014', hairShine: '#5a6a8a', hair: 'bob',      top: 'shirt',    topColor: '#F4F2EF', tie: null, bottom: 'skirt', bottomColor: '#7A1F2B', shoes: '#1A1A1E', lashes: true, lips: '#B3261E' },
    boss:   { hair: 'side',     top: 'blazer',   topColor: '#2A2D34', inner: '#F4F2EF', tie: '#EA4335', bottom: 'trousers', bottomColor: '#2A2D34', shoes: '#1A1A1E', beard: true },
    omar:   { hair: 'buzz',     top: 'shirt',    topColor: '#8AB4F8', tie: '#1A3D7C', bottom: 'trousers', bottomColor: '#3C4043', shoes: '#5A3A22', glasses: true },
    kofi:   { hair: 'curly',    top: 'tee',      topColor: '#FBBC05', bottom: 'jeans', bottomColor: '#1F2A44', shoes: '#4285F4', headset: true },
    owner:  { hair: 'side',     top: 'apron',    topColor: '#6D4C41', inner: '#F4F2EF', bottom: 'trousers', bottomColor: '#3E2723', shoes: '#1A1A1E', beard: true },
  };
  const lerp = (a, b, u) => a + (b - a) * u;
  const mix = (A, B, u) => Array.isArray(A) ? A.map((v, i) => typeof v === 'number' ? lerp(v, B[i], u) : (u < 0.5 ? v : B[i])) : A;
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k)); return '#' + [f(r), f(g), f(b)].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join(''); };

  function hand(kind, id) {
    const g = `url(#${id}skin)`;
    if (kind === 'open') return `<g transform="translate(0,104)">
      ${[-15, -5, 5, 15].map((x, i) => `<rect x="${x - 5.5}" y="${[10, 6, 6, 10][i]}" width="11" height="${[28, 34, 34, 28][i]}" rx="5.5" fill="${g}"/>`).join('')}
      <rect x="18" y="-6" width="11" height="26" rx="5.5" fill="${g}" transform="rotate(-38 22 0)"/>
      <ellipse cx="0" cy="8" rx="22" ry="20" fill="${g}"/></g>`;
    if (kind === 'point') return `<g transform="translate(0,104)"><ellipse cx="0" cy="6" rx="21" ry="20" fill="${g}"/>
      <rect x="-6" y="10" width="12" height="44" rx="6" fill="${g}"/></g>`;
    if (kind === 'phone') return `<g transform="translate(0,100)"><rect x="-20" y="-6" width="40" height="70" rx="8" fill="#1d2430" stroke="#4a5568" stroke-width="2"/>
      <rect x="-16" y="-1" width="32" height="58" rx="5" fill="#8ab4f8" opacity="0.9"/><ellipse cx="0" cy="40" rx="20" ry="17" fill="${g}"/></g>`;
    if (kind === 'hip') return `<g transform="translate(0,100)"><ellipse cx="0" cy="6" rx="20" ry="18" fill="${g}"/></g>`;
    return `<g transform="translate(0,102)"><ellipse cx="0" cy="8" rx="22" ry="21" fill="${g}"/><ellipse cx="-8" cy="2" rx="7" ry="5" fill="#fff" opacity="0.08"/></g>`;
  }
  function limb(x, y, a, b, len1, len2, w, paint, end, cap, paint2) {
    return `<g transform="translate(${x},${y}) rotate(${a})">
      <line x1="0" y1="0" x2="0" y2="${len1}" stroke="${paint}" stroke-width="${w}" stroke-linecap="round"/>
      <g transform="translate(0,${len1}) rotate(${b})">
        <line x1="0" y1="0" x2="0" y2="${len2}" stroke="${paint2 || paint}" stroke-width="${paint2 ? w - 22 : w - 4}" stroke-linecap="round"/>${cap || ''}${end}</g></g>`;
  }
  function mouth(kind, open, lips) {
    const lip = lips ? `stroke="${lips}" stroke-width="5"` : '';
    switch (kind) {
      case 'grin': return `<path d="M-52 -4 Q0 6 52 -4 Q46 50 0 52 Q-46 50 -52 -4Z" fill="#7a0f16" ${lip}/><path d="M-44 0 Q0 9 44 0 L40 14 Q0 20 -40 14Z" fill="#fff"/><ellipse cx="0" cy="38" rx="26" ry="12" fill="#e2545c"/>`;
      case 'talk': { const h = 10 + 26 * open; return `<path d="M-38 -2 Q0 4 38 -2 Q32 ${h} 0 ${h + 4} Q-32 ${h} -38 -2Z" fill="#7a0f16" ${lip}/><path d="M-32 0 Q0 5 32 0 L28 9 Q0 13 -28 9Z" fill="#fff"/><ellipse cx="0" cy="${h - 4}" rx="${14 + 6 * open}" ry="${3 + 5 * open}" fill="#e2545c"/>`; }
      case 'o': return `<ellipse cx="0" cy="14" rx="20" ry="24" fill="#7a0f16" ${lip}/><ellipse cx="0" cy="26" rx="12" ry="7" fill="#e2545c"/>`;
      case 'wobble': return `<path d="M-30 14 Q-15 4 0 12 Q15 20 30 10" stroke="${lips || '#e8e8e8'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      case 'flat': return `<path d="M-24 10 Q0 14 24 10" stroke="${lips || '#e8e8e8'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      case 'smirk': return `<path d="M-30 8 Q4 22 34 2" stroke="${lips || '#e8e8e8'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      case 'frown': return `<path d="M-28 20 Q0 2 28 20" stroke="${lips || '#e8e8e8'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      default: return `<path d="M-46 -4 Q0 8 46 -4 Q40 40 0 42 Q-40 40 -46 -4Z" fill="#7a0f16" ${lip}/><path d="M-38 0 Q0 9 38 0 L34 12 Q0 18 -34 12Z" fill="#fff"/><ellipse cx="0" cy="30" rx="20" ry="9" fill="#e2545c"/>`;
    }
  }

  // ---- hair: back layer (behind the head) and front layer (over it) ----
  let HC = '#0c0c0e', HS = '#45474f';
  function hairBack(kind, swing) {
    const s = swing || 0;
    switch (kind) {
      case 'long': return `<path d="M54 230 Q40 120 120 76 Q200 40 280 76 Q360 120 346 230 Q352 360 ${336 + s} 470 Q300 500 262 478 L262 330 L138 330 L138 478 Q100 500 ${64 + s} 470 Q48 360 54 230Z" fill="${HC}"/>
        <path d="M${80 + s * .5} 330 Q70 400 ${84 + s} 460 M${320 + s * .5} 330 Q332 400 ${318 + s} 460" stroke="${HS}" stroke-width="4" fill="none" opacity=".6"/>`;
      case 'bob': return `<path d="M50 236 Q40 110 130 74 Q200 48 270 74 Q360 110 350 236 L352 352 Q320 372 290 356 L290 300 L110 300 L110 356 Q80 372 48 352Z" fill="${HC}"/>`;
      case 'ponytail': return `<path d="M318 160 Q${392 + s} 190 ${384 + s} 300 Q${380 + s} 400 ${344 + s} 450 Q${360 + s} 360 340 260 Q330 210 300 186Z" fill="${HC}"/><path d="M${352 + s} 250 Q${372 + s} 330 ${352 + s} 410" stroke="${HS}" stroke-width="4" fill="none" opacity=".6"/>`;
      default: return '';
    }
  }
  function hairFront(kind) {
    const st = (d) => `<path d="${d}" stroke="${HS}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>`;
    switch (kind) {
      case 'long': return `<g fill="${HC}" stroke="${HS}" stroke-width="3" stroke-opacity=".5"><path d="M56 236 Q48 130 130 82 Q200 50 272 82 Q352 130 344 236 Q330 160 280 130 Q236 112 206 128 Q190 160 150 176 Q100 196 56 236Z"/></g>${st('M120 110 Q160 86 200 92 M230 96 Q270 104 300 132')}`;
      case 'bob': return `<g fill="${HC}" stroke="${HS}" stroke-width="3" stroke-opacity=".5"><path d="M52 240 Q44 120 132 80 Q200 52 268 80 Q356 120 348 240 Q340 196 320 176 Q290 150 200 150 Q110 150 80 176 Q60 196 52 240Z"/><path d="M90 170 Q120 120 200 118 Q280 120 310 170 Q260 150 200 156 Q140 150 90 170Z"/></g>${st('M110 120 Q160 92 220 96 M250 104 Q290 120 310 150')}`;
      case 'bun': return `<g fill="${HC}" stroke="${HS}" stroke-width="3" stroke-opacity=".5"><circle cx="200" cy="58" r="58"/><path d="M58 220 Q50 130 122 90 Q200 54 278 90 Q350 130 342 220 Q326 160 280 140 Q200 116 120 140 Q74 160 58 220Z"/></g>${st('M168 34 Q200 20 232 36 M120 112 Q170 92 220 96 M248 104 Q290 118 314 150')}`;
      case 'ponytail': return `<g fill="${HC}" stroke="${HS}" stroke-width="3" stroke-opacity=".5"><path d="M58 222 Q50 128 124 88 Q200 52 276 88 Q350 128 342 222 Q330 168 290 146 Q200 112 110 146 Q70 168 58 222Z"/><rect x="306" y="150" width="26" height="30" rx="10" fill="#EA4335" transform="rotate(30 319 165)"/></g>${st('M116 114 Q166 92 216 96 M246 102 Q290 118 316 148')}`;
      case 'side': return `<g fill="${HC}"><path d="M60 214 Q52 120 130 84 Q200 56 274 84 Q350 118 344 214 Q336 170 308 148 Q250 120 150 132 Q130 150 120 170 Q100 150 86 160 Q66 184 60 214Z"/></g>${st('M150 132 Q200 100 300 128 M116 110 Q150 92 190 90')}`;
      case 'buzz': return `<path d="M60 206 Q58 110 140 80 Q200 64 260 80 Q342 110 340 206 Q320 140 260 120 Q200 108 140 120 Q80 140 60 206Z" fill="#1c1d21"/><path d="M60 206 Q58 110 140 80 Q200 64 260 80 Q342 110 340 206" fill="none" stroke="#2c2e35" stroke-width="3" stroke-dasharray="2 5"/>`;
      case 'curly': { let s = ''; const pts = [[80, 170], [96, 120], [130, 88], [172, 70], [218, 68], [262, 82], [298, 110], [322, 150], [330, 196], [70, 214], [150, 110], [200, 100], [250, 108], [110, 140], [290, 140]];
        pts.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="${30 + (i % 3) * 5}" fill="${HC}"/>`; }); return s + st('M120 90 Q140 80 160 86 M230 76 Q250 72 268 84 M300 120 Q312 130 316 146'); }
      default: // 'tufts' (Fahim)
        return `<g fill="${HC}" stroke="${HC}" stroke-width="4" stroke-linejoin="round">
          <path d="M58 220 Q48 140 108 96 Q150 64 206 68 Q280 66 322 118 Q356 160 346 222 Q330 170 300 150 Q262 128 214 136 Q150 136 112 160 Q76 184 58 220Z"/>
          <path d="M92 120 Q110 52 178 48 Q150 70 150 104Z"/><path d="M158 74 Q196 20 252 44 Q220 52 214 86Z"/>
          <path d="M224 70 Q290 40 330 92 Q300 84 276 104Z"/><path d="M296 106 Q356 104 360 170 Q336 140 312 136Z"/>
          <path d="M70 168 Q40 150 52 110 Q70 140 96 140Z"/><path d="M120 132 Q140 94 186 104 Q160 122 150 150Z"/>
          <path d="M196 116 Q236 88 280 120 Q246 116 228 140Z"/></g>${st('M120 112 Q150 92 182 96 M220 82 Q252 76 282 96 M110 150 Q128 128 154 124')}`;
    }
  }

  // ---- torso / clothing ----
  function torso(c, id, rim, rim2) {
    const T = c.topColor, d1 = shade(T, -0.18), d2 = shade(T, -0.35), l1 = shade(T, 0.12);
    const shell = `<path d="M126 398 Q200 380 274 398 Q300 410 300 450 L292 600 Q292 622 270 624 L130 624 Q108 622 108 600 L100 450 Q100 410 126 398Z" fill="url(#${id}top)"/>`;
    const rims = `<path d="M100 450 L108 600" stroke="${rim2}" stroke-opacity="0.35" stroke-width="5" fill="none"/><path d="M300 450 L292 600" stroke="${rim}" stroke-opacity="0.5" stroke-width="5" fill="none"/>`;
    const neck = `<path d="M170 392 Q200 420 230 392 L226 380 L174 380Z" fill="#0d0d0f"/>`;
    const tie = c.tie ? `<path d="M192 410 L208 410 L212 424 L204 432 L214 540 L200 560 L186 540 L196 432 L188 424Z" fill="${c.tie}"/><path d="M200 434 L204 540" stroke="${shade(c.tie, -0.3)}" stroke-width="3"/>` : '';
    switch (c.top) {
      case 'hoodie': return `${shell}<rect x="112" y="596" width="176" height="30" rx="12" fill="${d1}"/>
        <path d="M144 520 Q200 512 256 520 L262 580 Q200 588 138 580Z" fill="${shade(T, -0.1)}"/><path d="M144 520 Q200 512 256 520" stroke="${d2}" stroke-width="3" fill="none"/>
        <path d="M150 396 Q200 432 250 396 Q240 420 200 446 Q160 420 150 396Z" fill="#0d0d0f"/>
        <path d="M136 392 Q200 452 264 392 Q268 380 252 384 Q200 430 148 384 Q132 380 136 392Z" fill="${d1}"/>
        <path d="M182 432 L178 492 M218 432 L222 492" stroke="${d2}" stroke-width="5" stroke-linecap="round"/>
        <rect x="173" y="488" width="9" height="14" rx="3" fill="#ffd7d2"/><rect x="218" y="488" width="9" height="14" rx="3" fill="#ffd7d2"/>${rims}`;
      case 'blazer': { const I = c.inner || '#F4F2EF'; return `<path d="M150 396 L250 396 L246 600 L154 600Z" fill="${I}"/>${neck}${tie}
        <path d="M126 398 Q150 388 168 392 L200 520 L176 624 L130 624 Q108 622 108 600 L100 450 Q100 410 126 398Z" fill="url(#${id}top)"/>
        <path d="M274 398 Q250 388 232 392 L200 520 L224 624 L270 624 Q292 622 292 600 L300 450 Q300 410 274 398Z" fill="url(#${id}top)"/>
        <path d="M168 392 L150 450 L184 470 L200 520Z" fill="${l1}"/><path d="M232 392 L250 450 L216 470 L200 520Z" fill="${d1}"/>
        <circle cx="214" cy="556" r="6" fill="${d2}"/><circle cx="214" cy="590" r="6" fill="${d2}"/><path d="M240 540 L276 540" stroke="${d2}" stroke-width="4"/>${rims}`; }
      case 'shirt': return `${shell}${neck}<path d="M168 384 L200 414 L186 432 L156 400Z M232 384 L200 414 L214 432 L244 400Z" fill="${l1}" stroke="${d1}" stroke-width="2"/>${tie}
        ${c.tie ? '' : `<path d="M200 416 L200 620" stroke="${d1}" stroke-width="3"/>${[450, 490, 530, 570].map((y) => `<circle cx="207" cy="${y}" r="4" fill="${d1}"/>`).join('')}`}
        <path d="M120 470 L132 470" stroke="${d1}" stroke-width="0"/><rect x="226" y="446" width="44" height="40" rx="4" fill="none" stroke="${d1}" stroke-width="3"/>${rims}`;
      case 'tee': return `${shell}${neck}<path d="M160 390 Q200 430 240 390" stroke="${d1}" stroke-width="10" fill="none"/>
        <circle cx="200" cy="510" r="38" fill="${shade(T, 0.35)}" opacity=".5"/><path d="M184 510 L196 522 L218 498" stroke="${d2}" stroke-width="7" fill="none" stroke-linecap="round"/>${rims}`;
      case 'sweater': return `${shell}${neck}<path d="M150 392 Q200 440 250 392" stroke="${d1}" stroke-width="14" fill="none"/>
        <rect x="112" y="596" width="176" height="30" rx="12" fill="${d1}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${122 + i * 22} 600 L${122 + i * 22} 622" stroke="${d2}" stroke-width="3"/>`).join('')}
        ${[460, 500, 540].map((y) => `<path d="M112 ${y} Q200 ${y + 10} 288 ${y}" stroke="${l1}" stroke-width="4" fill="none" opacity=".6"/>`).join('')}${rims}`;
      case 'apron': { const I = c.inner || '#F4F2EF'; return `<path d="M126 398 Q200 380 274 398 Q300 410 300 450 L292 600 Q292 622 270 624 L130 624 Q108 622 108 600 L100 450 Q100 410 126 398Z" fill="${I}"/>${neck}
        <path d="M146 410 L254 410 L262 640 L138 640Z" fill="url(#${id}top)"/><path d="M146 410 L170 384 M254 410 L230 384" stroke="${d1}" stroke-width="8"/>
        <rect x="160" y="520" width="80" height="54" rx="8" fill="${d1}"/>${rims}`; }
      default: return shell + rims;
    }
  }
  function sleeveCap(c) { return c.top === 'tee' ? '' : `<rect x="-24" y="80" width="48" height="20" rx="9" fill="${shade(c.top === 'apron' ? (c.inner || '#F4F2EF') : c.topColor, -0.18)}"/>`; }

  let uid = 0;
  function svg(o = {}) {
    const c = Object.assign({}, CAST.fahim, o.cast ? CAST[o.cast] : {}, o);
    HC = c.hairColor || '#0c0c0e'; HS = c.hairShine || '#45474f';
    const id = 'h' + (o.id || ++uid) + '_';
    const P = o.poseB ? (() => { const A = POSES[o.pose || 'idle'], B = POSES[o.poseB]; const u = o.poseMix || 0; return { la: mix(A.la, B.la, u), ra: mix(A.ra, B.ra, u), ll: mix(A.ll, B.ll, u), rl: mix(A.rl, B.rl, u) }; })() : POSES[o.pose || 'idle'];
    const F = FACES[o.face || 'smile'];
    const rim = o.rim || '#ffb070', rim2 = o.rim2 || '#7fa8ff';
    const lookX = (o.look && o.look[0]) || 0, lookY = (o.look && o.look[1]) || 0;
    const blink = o.blink || 0, tilt = o.tilt || 0, bob = o.bob || 0, lean = o.lean || 0;
    const walk = o.walk; // phase in radians, or undefined
    let ll = P.ll.slice(), rl = P.rl.slice(), la = P.la.slice(), ra = P.ra.slice();
    if (o.arms) { if (o.arms.la) la = o.arms.la; if (o.arms.ra) ra = o.arms.ra; }
    if (walk !== undefined) { const s = Math.sin(walk); ll = [s * 22, Math.max(0, -Math.cos(walk)) * 30]; rl = [-s * 22, Math.max(0, Math.cos(walk)) * 30];
      if (!o.arms) { la = [-s * 20 + 6, -10, la[2]]; ra = [-s * 20 - 6, 10, ra[2]]; } }
    const eyeH = F.eyeH * (1 - blink);
    const sleeveColor = c.top === 'apron' ? (c.inner || '#F4F2EF') : c.topColor;
    const sleeve = `url(#${id}sleeve)`, legs = `url(#${id}legs)`;
    const skinLine = c.top === 'tee' ? `url(#${id}skinL)` : null;
    const B = c.bottomColor, S = c.shoes;
    const shoe = (side) => `<g transform="translate(0,150) rotate(${-((side ? rl : ll)[0]) * 0.5}) scale(1.45)">
        <path d="M-24 -20 Q-26 -4 -26 6 L44 6 Q48 -6 30 -12 Q14 -16 6 -24 Z" fill="url(#${id}shoe)"/>
        <path d="M14 -14 Q28 -12 42 -2 L44 6 L14 6Z" fill="${S === '#F4F2EF' ? '#dedad4' : '#f4f2ef'}"/>
        <rect x="-30" y="4" width="78" height="14" rx="7" fill="#f4f2ef"/><rect x="-30" y="13" width="78" height="5" rx="2.5" fill="#cfcac4"/>
        <path d="M-6 -18 L10 -12 M-2 -24 L14 -18" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/></g>`;
    const cuff = c.bottom === 'jeans' ? `<rect x="-32" y="120" width="64" height="20" rx="8" fill="${shade(B, 0.25)}"/><path d="M-26 126 L26 126" stroke="${shade(B, 0.4)}" stroke-width="2"/>` : '';
    const legW = c.bottom === 'skirt' ? 34 : 66;
    const legPaint = c.bottom === 'skirt' ? `url(#${id}skinL)` : legs;
    const skirt = c.bottom === 'skirt' ? `<path d="M112 600 L288 600 L314 760 Q200 784 86 760Z" fill="url(#${id}legs)"/><path d="M112 600 L288 600 L290 616 L110 616Z" fill="${shade(B, -0.3)}"/>
      <path d="M160 616 L150 768 M240 616 L250 768" stroke="${shade(B, -0.25)}" stroke-width="3"/>` : '';
    const glasses = c.glasses ? `<g fill="none" stroke="#e8eaed" stroke-width="7"><circle cx="150" cy="236" r="52"/><circle cx="250" cy="236" r="52"/><path d="M202 230 Q200 222 198 230"/><path d="M98 228 L56 214 M302 228 L344 214"/></g>
      <circle cx="150" cy="236" r="52" fill="#9fc3ff" opacity=".08"/><circle cx="250" cy="236" r="52" fill="#9fc3ff" opacity=".08"/>` : '';
    const headset = c.headset ? `<path d="M58 230 Q60 70 200 66 Q340 70 342 230" stroke="#2a2d34" stroke-width="14" fill="none"/><rect x="36" y="200" width="40" height="76" rx="18" fill="#3c4043"/><rect x="324" y="200" width="40" height="76" rx="18" fill="#3c4043"/>
      <path d="M344 270 Q340 340 270 340" stroke="#3c4043" stroke-width="7" fill="none"/><circle cx="266" cy="340" r="11" fill="#4285F4"/>` : '';
    const beard = c.beard ? `<path d="M76 290 Q100 380 200 388 Q300 380 324 290 Q300 340 260 344 Q230 330 200 334 Q170 330 140 344 Q100 340 76 290Z" fill="#34363d"/><path d="M110 330 Q200 372 290 330" stroke="#4a4c55" stroke-width="3" fill="none" stroke-dasharray="3 7"/>` : '';
    const lashes = c.lashes ? [150, 250].map((cx, i) => { const dx = i ? 1 : -1; return `<path d="M${cx + dx * 34} ${236 - 46 * Math.max(0.06, eyeH) + 10} l${dx * 16} -12 M${cx + dx * 40} ${236 - 46 * Math.max(0.06, eyeH) + 24} l${dx * 18} -6" stroke="#0a0a0c" stroke-width="7" stroke-linecap="round"/>`; }).join('') : '';
    const body = `
      <defs>
        <radialGradient id="${id}head" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#3d3f46"/><stop offset="0.45" stop-color="#16171b"/><stop offset="1" stop-color="#050506"/></radialGradient>
        <radialGradient id="${id}skin" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#3a3b40"/><stop offset="1" stop-color="#0a0a0c"/></radialGradient>
        <linearGradient id="${id}skinL" x1="-30" y1="0" x2="30" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a3b40"/><stop offset="1" stop-color="#0a0a0c"/></linearGradient>
        <linearGradient id="${id}sleeve" x1="-30" y1="0" x2="30" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${shade(sleeveColor, 0.15)}"/><stop offset="0.55" stop-color="${sleeveColor}"/><stop offset="1" stop-color="${shade(sleeveColor, -0.35)}"/></linearGradient>
        <linearGradient id="${id}legs" x1="-30" y1="0" x2="30" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${shade(B, 0.15)}"/><stop offset="0.6" stop-color="${B}"/><stop offset="1" stop-color="${shade(B, -0.4)}"/></linearGradient>
        <linearGradient id="${id}top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(c.topColor, 0.15)}"/><stop offset="0.6" stop-color="${c.topColor}"/><stop offset="1" stop-color="${shade(c.topColor, -0.3)}"/></linearGradient>
        <linearGradient id="${id}shoe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(S, 0.08)}"/><stop offset="1" stop-color="${shade(S, -0.3)}"/></linearGradient>
        <linearGradient id="${id}rimL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${rim2}" stop-opacity="0.9"/><stop offset="0.25" stop-color="${rim2}" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}rimR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${rim}" stop-opacity="0.95"/><stop offset="0.28" stop-color="${rim}" stop-opacity="0"/></linearGradient>
        <radialGradient id="${id}eye" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.75" stop-color="#eceef2"/><stop offset="1" stop-color="#b9bec8"/></radialGradient>
      </defs>
      <ellipse cx="200" cy="948" rx="${130 - bob * 2}" ry="18" fill="#000" opacity="${o.shadow ?? 0.35}"/>
      <g transform="translate(0,${-bob})">
      <g transform="rotate(${tilt} 200 380)">${hairBack(c.hair, o.swing)}</g>
      ${limb(162, 610, ll[0], ll[1], 150, 150, legW, legPaint, shoe(0), cuff)}
      ${limb(238, 610, rl[0], rl[1], 150, 150, legW, legPaint, shoe(1), cuff)}
      ${skirt}
      <g transform="rotate(${lean} 200 610)">
      ${limb(118, 432, la[0], la[1], 104, 98, 58, sleeve, hand(la[2], id), sleeveCap(c), skinLine)}
      ${torso(c, id, rim, rim2)}
      ${limb(282, 432, ra[0], ra[1], 104, 98, 58, sleeve, hand(ra[2], id), sleeveCap(c), skinLine)}
      <g transform="rotate(${tilt} 200 380)">
        <path d="M196 360 L204 360 L208 400 L192 400Z" fill="#0b0b0d"/>
        <circle cx="200" cy="236" r="150" fill="url(#${id}head)"/>
        <circle cx="200" cy="236" r="150" fill="none" stroke="url(#${id}rimR)" stroke-width="7"/>
        <circle cx="200" cy="236" r="150" fill="none" stroke="url(#${id}rimL)" stroke-width="5"/>
        <ellipse cx="140" cy="168" rx="42" ry="24" fill="#fff" opacity="0.07" transform="rotate(-30 140 168)"/>
        ${beard}
        ${hairFront(c.hair)}
        <g transform="translate(0,${F.brow[0]})" stroke="#3b3d45" stroke-width="${c.lashes ? 9 : 12}" stroke-linecap="round" fill="none">
          <path d="M120 ${178 - F.brow[1]} Q146 ${166} 172 ${176 + F.brow[1] * 0.4}"/><path d="M228 ${176 + F.brow[1] * 0.4} Q254 ${166} 280 ${178 - F.brow[1]}"/>
        </g>
        ${lashes}
        ${[150, 250].map((cx) => `<g transform="translate(${cx},236) scale(1,${Math.max(0.06, eyeH)})">
          <ellipse cx="0" cy="0" rx="43" ry="49" fill="url(#${id}eye)"/>
          <circle cx="${8 + lookX * 14}" cy="${4 + lookY * 14}" r="19" fill="#0a0a0c"/>
          <circle cx="${15 + lookX * 14}" cy="${-4 + lookY * 14}" r="6.5" fill="#fff"/><circle cx="${2 + lookX * 14}" cy="${12 + lookY * 14}" r="2.6" fill="#fff" opacity="0.8"/></g>`).join('')}
        ${glasses}
        <g transform="translate(200,${306 + (o.mouthY || 0)})">${mouth(F.mouth, o.open ?? 0.5, c.lips)}</g>
        ${headset}
      </g></g></g>`;
    return `<svg viewBox="0 0 400 960" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;width:100%;height:100%">${body}</svg>`;
  }
  window.HERO = { svg, POSES, FACES, CAST };
})();
