// Storyboard drawing kit for CLOSING TIME. Pure SVG strings, seeded randomness only.
'use strict';

const rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const f = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`;
const W = 1920, H = 1080;

// ---------- shared defs ----------
const defs = () => `<defs>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b8" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b20" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.4 -0.45"/></filter>
<filter id="mono"><feColorMatrix type="saturate" values="0.1"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.85"/></radialGradient>
<radialGradient id="headHi" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="60%" stop-color="#161616"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient>
<radialGradient id="zHead" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#8fbf5a"/><stop offset="70%" stop-color="#4f7d2c"/><stop offset="100%" stop-color="#2e4d18"/></radialGradient>
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd27a" stop-opacity="0.55"/><stop offset="100%" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<radialGradient id="poolRed" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff2a1a" stop-opacity="0.6"/><stop offset="100%" stop-color="#ff2a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="poolCool" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#bfe3ff" stop-opacity="0.5"/><stop offset="100%" stop-color="#bfe3ff" stop-opacity="0"/></radialGradient>
<radialGradient id="fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff1b0"/><stop offset="35%" stop-color="#ff9a2a" stop-opacity="0.9"/><stop offset="100%" stop-color="#ff4a00" stop-opacity="0"/></radialGradient>
<linearGradient id="fogUp" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#9fb4c8" stop-opacity="0.45"/><stop offset="100%" stop-color="#9fb4c8" stop-opacity="0"/></linearGradient>
<linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8d949c"/><stop offset="100%" stop-color="#4b5158"/></linearGradient>
</defs>`;

// ---------- frame ----------
const BAR = 138; // 2.39:1 letterbox
function frame(body, o = {}) {
  const label = o.label || '';
  const sub = o.sub || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}
<rect width="${W}" height="${H}" fill="${o.bg || '#05070a'}"/>
<g>${body}</g>
${o.tint ? `<rect width="${W}" height="${H}" fill="${o.tint}" style="mix-blend-mode:${o.blend || 'multiply'}"/>` : ''}
<rect width="${W}" height="${H}" fill="url(#vig)" opacity="${o.vig ?? 1}"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.10"/>
<rect width="${W}" height="${BAR}" fill="#000"/><rect y="${H - BAR}" width="${W}" height="${BAR}" fill="#000"/>
<text x="40" y="88" font-family="Anton" font-size="54" fill="#f0f0f0" letter-spacing="2">${label}</text>
<text x="${W - 40}" y="88" font-family="JetBrains Mono" font-weight="700" font-size="30" fill="#9aa4ad" text-anchor="end">${sub}</text>
${o.caption ? `<text x="${W / 2}" y="${H - 52}" font-family="Figtree" font-weight="800" font-size="40" fill="#e8e8e8" text-anchor="middle">${o.caption}</text>` : ''}
</svg>`;
}

// ---------- people ----------
const LOOKS = {
  sami: { shirt: '#c8262b', pants: '#33507d', hair: 'sami', shoes: '#f2f2f2' },
  maya: { shirt: '#f2b51d', pants: '#1d1d22', hair: 'maya', shoes: '#f2c21d', hood: true },
  zoe: { shirt: '#4a6fa5', pants: null, skirt: '#b3262c', hair: 'zoe', shoes: '#c8262b', denim: true },
  theo: { shirt: '#2a2a2e', pants: '#6b4e33', hair: 'theo', shoes: '#7a4b2a' },
  rico: { shirt: '#2f7d32', pants: '#5b78a3', hair: 'rico', shoes: '#f2f2f2', plaid: true },
  davis: { shirt: '#e8e8e8', pants: '#2c2c34', hair: 'davis', shoes: '#222', tie: '#b3262c' },
  man: { shirt: '#3a4a3a', pants: '#26262a', hair: 'theo', shoes: '#222' },
  mum: { shirt: '#c25a8a', pants: '#2c2c34', hair: 'maya', shoes: '#222' },
};

function limb(x, y, ang, len, w, color, end, endR, endColor) {
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})"><rect x="${f(-w / 2)}" y="0" width="${f(w)}" height="${f(len)}" rx="${f(w / 2)}" fill="${color}"/>${end ? `<ellipse cx="0" cy="${f(len)}" rx="${f(endR * 1.25)}" ry="${f(endR)}" fill="${endColor}"/>` : ''}</g>`;
}

function hair(kind, r, back, dir) {
  const d = dir;
  switch (kind) {
    case 'sami': {
      const p = [];
      for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI; const rr = r * (i % 2 ? 1.18 : 1.02); p.push([Math.cos(a) * rr, Math.sin(a) * rr - r * 0.05]); }
      p.push([r * 0.95, -r * 0.1], [r * 0.3, -r * 0.45], [-r * 0.2, -r * 0.3], [-r * 0.95, -r * 0.1]);
      return poly(p, '#5a3a22') + (back ? `<ellipse cx="0" cy="${-r * 0.1}" rx="${r * 0.98}" ry="${r * 0.85}" fill="#5a3a22"/>` : '');
    }
    case 'maya':
      return `<path d="M${-r * 1.02},${-r * 0.05} A${r * 1.02},${r * 1.02} 0 0 1 ${r * 1.02},${-r * 0.05} Q${r * 0.3},${-r * 0.55} ${-r * 1.02},${-r * 0.05}Z" fill="#6b4226"/>
<path d="M${-d * r * 0.6},${-r * 0.85} C${-d * r * 2.0},${-r * 1.4} ${-d * r * 2.4},${-r * 0.2} ${-d * r * 1.9},${r * 0.6} C${-d * r * 1.7},${-r * 0.1} ${-d * r * 1.3},${-r * 0.6} ${-d * r * 0.7},${-r * 0.6}Z" fill="#7a4a28"/>
<circle cx="${-d * r * 0.75}" cy="${-r * 0.8}" r="${r * 0.13}" fill="#f2c21d"/>` + (back ? `<ellipse cx="0" cy="${-r * 0.05}" rx="${r}" ry="${r * 0.9}" fill="#6b4226"/>` : '');
    case 'zoe':
      return `<path d="M${-r * 1.12},${r * 0.55} L${-r * 1.08},${-r * 0.2} A${r * 1.1},${r * 1.1} 0 0 1 ${r * 1.1},${-r * 0.25} L${r * 1.14},${r * 0.55} L${r * 0.78},${r * 0.5} L${r * 0.7},${-r * 0.2} Q${-r * 0.1},${-r * 0.5} ${-r * 0.75},${-r * 0.05} L${-r * 0.78},${r * 0.5}Z" fill="#f2c94c"/>` + (back ? `<ellipse cx="0" cy="${r * 0.05}" rx="${r * 1.1}" ry="${r * 0.95}" fill="#f2c94c"/>` : '');
    case 'theo': {
      let s = '';
      const R0 = rng(7);
      for (let i = 0; i < 15; i++) { const a = Math.PI * 1.02 + (i / 14) * Math.PI * 0.96; s += `<circle cx="${f(Math.cos(a) * r * 0.95)}" cy="${f(Math.sin(a) * r * 0.95 - r * 0.05)}" r="${f(r * (0.26 + R0() * 0.08))}" fill="#2b1d14"/>`; }
      return s + `<ellipse cx="0" cy="${-r * 0.55}" rx="${r * 0.85}" ry="${r * 0.42}" fill="#2b1d14"/>` + (back ? `<ellipse cx="0" cy="${-r * 0.05}" rx="${r * 1.05}" ry="${r * 0.9}" fill="#2b1d14"/>` : '');
    }
    case 'rico':
      return `<path d="M${-r * 1.04},${-r * 0.2} A${r * 1.04},${r * 1.0} 0 0 1 ${r * 1.04},${-r * 0.2}Z" fill="#2c2c30"/>
<rect x="${-r * 1.06}" y="${-r * 0.3}" width="${r * 2.12}" height="${r * 0.14}" rx="${r * 0.05}" fill="#c8262b"/>
<path d="M${-d * r * 0.9},${-r * 0.3} q${-d * r * 0.7},${r * 0.05} ${-d * r * 0.85},${r * 0.28} l${d * r * 0.5},${-r * 0.05}Z" fill="#c8262b"/>`;
    case 'davis':
      return `<path d="M${-r * 1.0},${-r * 0.15} A${r},${r} 0 0 1 ${r},${-r * 0.15} Q0,${-r * 0.6} ${-r},${-r * 0.15}Z" fill="#8a8a8a"/>`;
    default: return '';
  }
}

function face(r, mood, look, zombie) {
  const ex = r * 0.4, ey = r * 0.02;
  const big = mood === 'scared' || mood === 'shock' ? 1.15 : 1;
  const eR = r * 0.3 * big, eRy = r * 0.36 * big;
  let s = '';
  if (zombie) {
    s += `<g filter="url(#glow)"><ellipse cx="${-ex}" cy="${ey}" rx="${r * 0.26}" ry="${r * 0.24}" fill="#ffe680"/><ellipse cx="${ex}" cy="${ey}" rx="${r * 0.26}" ry="${r * 0.24}" fill="#ffe680"/></g>`;
    s += `<circle cx="${-ex + look * r * 0.05}" cy="${ey}" r="${r * 0.06}" fill="#3a2a00"/><circle cx="${ex + look * r * 0.05}" cy="${ey}" r="${r * 0.06}" fill="#3a2a00"/>`;
    s += `<ellipse cx="0" cy="${r * 0.58}" rx="${r * 0.26}" ry="${r * 0.22}" fill="#1a0d0a"/><rect x="${-r * 0.2}" y="${r * 0.4}" width="${r * 0.4}" height="${r * 0.08}" fill="#e9e2c0"/>`;
    s += `<circle cx="${r * 0.55}" cy="${-r * 0.55}" r="${r * 0.12}" fill="#3e6420" opacity="0.8"/><circle cx="${-r * 0.3}" cy="${-r * 0.7}" r="${r * 0.08}" fill="#3e6420" opacity="0.8"/>`;
    return s;
  }
  s += `<ellipse cx="${-ex}" cy="${ey}" rx="${eR}" ry="${eRy}" fill="#fafafa"/><ellipse cx="${ex}" cy="${ey}" rx="${eR}" ry="${eRy}" fill="#fafafa"/>`;
  const pr = r * (mood === 'shock' ? 0.09 : 0.13);
  s += `<circle cx="${-ex + look * r * 0.13}" cy="${ey + r * 0.03}" r="${pr}" fill="#111"/><circle cx="${ex + look * r * 0.13}" cy="${ey + r * 0.03}" r="${pr}" fill="#111"/>`;
  if (mood === 'closed') s = `<path d="M${-ex - r * 0.22},${ey} q${r * 0.22},${r * 0.14} ${r * 0.44},0 M${ex - r * 0.22},${ey} q${r * 0.22},${r * 0.14} ${r * 0.44},0" stroke="#e8e8e8" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>`;
  const brow = (dx, tilt) => `<path d="M${dx - r * 0.25},${ey - eRy - r * 0.12 + tilt} L${dx + r * 0.25},${ey - eRy - r * 0.12 - tilt}" stroke="#2c2c2c" stroke-width="${r * 0.08}" stroke-linecap="round"/>`;
  if (mood === 'scared' || mood === 'sad') s += brow(-ex, r * 0.1) + brow(ex, -r * 0.1);
  if (mood === 'angry') s += brow(-ex, -r * 0.1) + brow(ex, r * 0.1);
  if (mood === 'scared' || mood === 'shock') s += `<ellipse cx="0" cy="${r * 0.6}" rx="${r * 0.2}" ry="${r * 0.15}" fill="#7a1a1a"/><rect x="${-r * 0.15}" y="${r * 0.47}" width="${r * 0.3}" height="${r * 0.06}" rx="${r * 0.02}" fill="#f5f5f5"/>`;
  else if (mood === 'smile') s += `<path d="M${-r * 0.25},${r * 0.5} Q0,${r * 0.78} ${r * 0.25},${r * 0.5}Z" fill="#9a2424"/>`;
  else if (mood === 'sad') s += `<path d="M${-r * 0.2},${r * 0.65} Q0,${r * 0.5} ${r * 0.2},${r * 0.65}" stroke="#9a2424" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M${-r * 0.16},${r * 0.6} L${r * 0.16},${r * 0.6}" stroke="#9a2424" stroke-width="${r * 0.07}" stroke-linecap="round"/>`;
  if (mood === 'sad' || mood === 'cry') s += `<path d="M${ex + r * 0.2},${ey + eRy} q${r * 0.06},${r * 0.25} 0,${r * 0.35} q${-r * 0.06},${-r * 0.1} 0,${-r * 0.35}Z" fill="#7fc8ff"/>`;
  return s;
}

// x,y = feet on ground; s = scale (1 => 400px tall)
function person(o) {
  const L = Object.assign({}, LOOKS[o.who] || {}, o);
  const Hh = 400 * (o.s || 1);
  const r = 0.16 * Hh;
  const dir = o.dir || 1; // facing / running direction for arms and ponytail
  const pose = o.pose || 'stand';
  const zombie = !!o.zombie;
  let drop = pose === 'crouch' ? 0.14 * Hh : pose === 'sit' ? 0.3 * Hh : 0;
  const hipY = -0.36 * Hh + drop;
  const legW = 0.085 * Hh, legL = 0.34 * Hh;
  const pants = zombie ? '#232323' : (L.pants || '#121212');
  const shoes = zombie ? '#4f7d2c' : L.shoes;
  let legs = '';
  const legA = { stand: [4, -4], run: [32 * dir, -38 * dir], crouch: [40, -40], sit: [-80 * dir, -72 * dir], walk: [14, -14] }[pose] || [4, -4];
  const legCol = L.skirt ? '#151515' : pants;
  legs += limb(-0.05 * Hh, hipY, legA[0], legL * (pose === 'crouch' ? 0.75 : 1), legW, legCol, true, legW * 0.6, shoes);
  legs += limb(0.05 * Hh, hipY, legA[1], legL * (pose === 'crouch' ? 0.75 : 1), legW, legCol, true, legW * 0.6, shoes);
  const ty = -0.72 * Hh + drop;
  const shirt = zombie ? (o.zshirt || '#2b2b2b') : L.shirt;
  let torso = `<rect x="${-0.15 * Hh}" y="${ty}" width="${0.3 * Hh}" height="${0.4 * Hh}" rx="${0.06 * Hh}" fill="${shirt}"/>`;
  if (L.plaid && !zombie) { for (let i = 1; i < 5; i++) torso += `<line x1="${-0.15 * Hh + i * 0.06 * Hh}" y1="${ty}" x2="${-0.15 * Hh + i * 0.06 * Hh}" y2="${ty + 0.4 * Hh}" stroke="#123d14" stroke-width="${Hh * 0.012}"/><line x1="${-0.15 * Hh}" y1="${ty + i * 0.08 * Hh}" x2="${0.15 * Hh}" y2="${ty + i * 0.08 * Hh}" stroke="#123d14" stroke-width="${Hh * 0.012}"/>`; torso += `<rect x="${-0.05 * Hh}" y="${ty}" width="${0.1 * Hh}" height="${0.4 * Hh}" fill="#f2f2f2"/>`; }
  if (L.denim && !zombie) torso += `<rect x="${-0.045 * Hh}" y="${ty}" width="${0.09 * Hh}" height="${0.32 * Hh}" fill="#f2f2f2"/>`;
  if (L.tie && (!zombie || o.zshirt)) torso += `<polygon points="${pts([[0, ty], [0.025 * Hh, ty + 0.03 * Hh], [0.012 * Hh, ty + 0.22 * Hh], [0, ty + 0.25 * Hh], [-0.012 * Hh, ty + 0.22 * Hh], [-0.025 * Hh, ty + 0.03 * Hh]])}" fill="${L.tie}"/>`;
  if (L.badge && !zombie) torso += `<rect x="${0.04 * Hh}" y="${ty + 0.08 * Hh}" width="${0.07 * Hh}" height="${0.035 * Hh}" rx="3" fill="#f2f2f2"/>`;
  if (L.skirt && !zombie) torso += `<polygon points="${pts([[-0.15 * Hh, ty + 0.32 * Hh], [0.15 * Hh, ty + 0.32 * Hh], [0.2 * Hh, ty + 0.48 * Hh], [-0.2 * Hh, ty + 0.48 * Hh]])}" fill="${L.skirt}"/>`;
  if (zombie) { const p = [[-0.15 * Hh, ty + 0.34 * Hh]]; for (let i = 0; i <= 8; i++) p.push([-0.15 * Hh + i * 0.0375 * Hh, ty + (i % 2 ? 0.46 : 0.38) * Hh]); p.push([0.15 * Hh, ty + 0.34 * Hh]); torso += poly(p, '#2b2b2b'); torso += `<circle cx="${0.05 * Hh}" cy="${ty + 0.12 * Hh}" r="${0.03 * Hh}" fill="#1a1a1a"/>`; }
  const sy = ty + 0.06 * Hh;
  let armA = { stand: [12, -12], run: [-70 * dir, 55 * dir], crouch: [-30, 30], sit: [-20, 20], reach: [-95 * dir, -80 * dir], up: [160, -160], hold: [-40, 40], walk: [10, -10] }[o.arms || pose] || [12, -12];
  if (zombie && !o.arms) armA = [-100 * dir, -78 * dir];
  const hand = zombie ? '#4f7d2c' : '#141414';
  const armW = 0.075 * Hh, armL = 0.3 * Hh;
  const arms = limb(-0.14 * Hh, sy, armA[0], armL, armW, shirt, true, armW * 0.62, hand) + limb(0.14 * Hh, sy, armA[1], armL, armW, shirt, true, armW * 0.62, hand);
  const hy = -Hh + r + drop;
  const head = `<g transform="translate(0,${f(hy)})">${L.hood && !zombie ? `<ellipse cx="0" cy="${r * 0.95}" rx="${r * 0.95}" ry="${r * 0.35}" fill="#d99c10"/>` : ''}<circle r="${r}" fill="${zombie ? 'url(#zHead)' : 'url(#headHi)'}"/>${o.back ? '' : face(r, o.mood || 'calm', o.look || 0, zombie)}${zombie ? (o.zhair ? hair(o.zhair, r, o.back, dir) : '') : hair(L.hair, r, o.back, dir)}</g>`;
  const tilt = o.tilt || (zombie ? 6 * dir : pose === 'run' ? 8 * dir : 0);
  const shadow = o.noShadow ? '' : `<ellipse cx="0" cy="${drop > 0 && pose === 'sit' ? 0 : 0}" rx="${0.22 * Hh}" ry="${0.03 * Hh}" fill="#000" opacity="0.45"/>`;
  const front = o.back ? (legs + torso + head + arms) : (legs + arms.split('</g>')[0] + '</g>' + torso + head + arms.slice(arms.indexOf('</g>') + 4));
  return `<g transform="translate(${f(o.x)},${f(o.y)}) scale(${o.flip ? -1 : 1},1)" opacity="${o.op ?? 1}">${shadow}<g transform="rotate(${tilt})">${front}</g></g>`;
}

function zombie(o) { return person(Object.assign({ zombie: true }, o)); }

function tinyZ(x, y, s, R, dir = 1) { // cheap distant zombie
  const h = 400 * s; const r = 0.16 * h;
  const sway = (R() - 0.5) * 14;
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(sway)})"><rect x="${f(-0.15 * h)}" y="${f(-0.72 * h)}" width="${f(0.3 * h)}" height="${f(0.72 * h)}" rx="${f(0.06 * h)}" fill="#1e2420"/><line x1="${f(-0.1 * h)}" y1="${f(-0.62 * h)}" x2="${f(-0.1 * h + dir * 0.3 * h)}" y2="${f(-0.6 * h)}" stroke="#1e2420" stroke-width="${f(0.07 * h)}" stroke-linecap="round"/><line x1="${f(0.1 * h)}" y1="${f(-0.6 * h)}" x2="${f(0.1 * h + dir * 0.3 * h)}" y2="${f(-0.56 * h)}" stroke="#1e2420" stroke-width="${f(0.07 * h)}" stroke-linecap="round"/><circle cy="${f(-0.84 * h)}" r="${f(r)}" fill="#4f7d2c"/><circle cx="${f(-0.4 * r)}" cy="${f(-0.84 * h)}" r="${f(r * 0.24)}" fill="#ffe680"/><circle cx="${f(0.4 * r)}" cy="${f(-0.84 * h)}" r="${f(r * 0.24)}" fill="#ffe680"/></g>`;
}

// crowd between yTop and yBot; scale grows with y (perspective)
function horde(o) {
  const R = rng(o.seed || 1);
  const list = [];
  for (let i = 0; i < o.n; i++) {
    const t = Math.pow(R(), o.pow || 1.6);
    const y = o.yTop + (o.yBot - o.yTop) * t;
    const s = o.sTop + (o.sBot - o.sTop) * t;
    const xc = o.x0 + (o.x1 - o.x0) * R();
    const narrow = o.funnel ? (xc - o.funnel) * (0.25 + 0.75 * t) + o.funnel : xc;
    list.push({ x: narrow, y, s });
  }
  list.sort((a, b) => a.y - b.y);
  return list.map((z) => (z.s > (o.detail || 0.22) ? zombie({ x: z.x, y: z.y, s: z.s, dir: o.dir || (R() > 0.5 ? 1 : -1), look: (R() - 0.5) * 2, tilt: (R() - 0.5) * 16, zhair: R() > 0.7 ? 'theo' : null }) : tinyZ(z.x, z.y, z.s, R, o.dir || 1))).join('');
}

// ---------- environments ----------
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;

function sky(top = '#0b1220', bot = '#2a3a52', y1 = H) { return `<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>${rect(0, 0, W, y1, 'url(#sk)')}`; }
function moon(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="#cfe0ff" opacity="0.12" filter="url(#b40)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#e6eefc"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#cdd6e6"/>`; }
function skyline(y, seed, col = '#0a0f17', lit = 0.1, hMax = 320) {
  const R = rng(seed); let s = '', x = -20;
  while (x < W) { const w = 60 + R() * 140, h = 80 + R() * hMax; s += rect(x, y - h, w, h + 400, col); for (let wy = y - h + 20; wy < y - 10; wy += 34) for (let wx = x + 12; wx < x + w - 16; wx += 28) if (R() < lit) s += rect(wx, wy, 12, 16, R() > 0.5 ? '#ffcf73' : '#e8f1ff', 'opacity="0.8"'); x += w + 4; }
  return s;
}
function fog(y, h, op = 1) { return `<rect x="0" y="${y}" width="${W}" height="${h}" fill="url(#fogUp)" opacity="${op}"/>`; }
function lampPost(x, yGround, h, col = 'pool') { return `<ellipse cx="${x + 40}" cy="${yGround}" rx="${h * 0.9}" ry="${h * 0.22}" fill="url(#${col})"/><rect x="${x - 4}" y="${yGround - h}" width="8" height="${h}" fill="#1a1d22"/><rect x="${x - 4}" y="${yGround - h}" width="70" height="8" fill="#1a1d22"/><ellipse cx="${x + 60}" cy="${yGround - h + 10}" rx="22" ry="8" fill="#fff1c7" filter="url(#glow)"/><polygon points="${pts([[x + 45, yGround - h + 12], [x + 75, yGround - h + 12], [x + 60 + h * 0.5, yGround], [x + 60 - h * 0.5, yGround]])}" fill="#ffe2a0" opacity="0.07"/>`; }
function car(x, y, s, col, flip = false, wreck = false) {
  const b = `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
<path d="M-200,-20 L-190,-70 L-120,-80 L-70,-135 L70,-135 L130,-80 L195,-70 L205,-20 Z" fill="${col}"/>
<path d="M-60,-125 L-108,-82 L-5,-82 L-5,-125Z M5,-125 L5,-82 L115,-82 L65,-125Z" fill="${wreck ? '#0d0f12' : '#1b2633'}"/>
<rect x="-205" y="-30" width="410" height="14" fill="#15181c"/>
<circle cx="-120" cy="-15" r="38" fill="#0e0e0e"/><circle cx="125" cy="-15" r="38" fill="#0e0e0e"/><circle cx="-120" cy="-15" r="16" fill="#555"/><circle cx="125" cy="-15" r="16" fill="#555"/>
<rect x="190" y="-62" width="14" height="12" fill="${wreck ? '#333' : '#ffe9a8'}"/>${wreck ? '<path d="M-60,-125 L-20,-100 L-50,-90" stroke="#888" stroke-width="3" fill="none"/>' : ''}</g>`;
  return b;
}
function shutter(x, y, w, h, op = 1) {
  let s = `<g opacity="${op}">${rect(x, y, w, h, 'url(#metal)')}`;
  for (let yy = y + 10; yy < y + h; yy += 18) s += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="#2e3338" stroke-width="3"/><line x1="${x}" y1="${yy + 3}" x2="${x + w}" y2="${yy + 3}" stroke="#a9b0b8" stroke-width="1.5" opacity="0.6"/>`;
  return s + `</g>`;
}

// One-point-perspective supermarket aisle. light: 'bright' | 'red' | 'dark' | 'dawn'
function aisle(o = {}) {
  const vx = o.vx ?? W / 2, vy = o.vy ?? 470, F = 900;
  const R = rng(o.seed || 3);
  const P = (X, Y, Z) => [vx + (F * X) / Z, vy + (F * Y) / Z];
  const light = o.light || 'bright';
  const pal = light === 'bright' ? ['#e04848', '#f2b51d', '#3d8fd6', '#ffffff', '#5bb85b', '#ff8a3d', '#9b5bd6', '#e8e0cc'] : ['#5a2020', '#5a4612', '#1f3550', '#4a4a4a', '#25452a', '#5a3218', '#3a2650', '#4d4a42'];
  let s = '';
  const wall = light === 'bright' ? '#cfd6dc' : light === 'dawn' ? '#2a3442' : '#14171c';
  const floorC = light === 'bright' ? '#bfc4c8' : light === 'dawn' ? '#2b3540' : '#101216';
  s += rect(0, 0, W, H, wall);
  s += poly([P(-1.7, 1.2, 1), P(1.7, 1.2, 1), P(1.7, 1.2, 60), P(-1.7, 1.2, 60)], floorC);
  s += poly([P(-1.7, -2.2, 1), P(1.7, -2.2, 1), P(1.7, -2.2, 60), P(-1.7, -2.2, 60)], light === 'bright' ? '#e6eaee' : '#0b0d10');
  // floor tiles
  for (let z = 1.5; z < 60; z *= 1.18) s += `<line x1="${f(P(-1.7, 1.2, z)[0])}" y1="${f(P(-1.7, 1.2, z)[1])}" x2="${f(P(1.7, 1.2, z)[0])}" y2="${f(P(1.7, 1.2, z)[1])}" stroke="#000" stroke-opacity="0.12" stroke-width="2"/>`;
  // ceiling strips
  for (let z = 2; z < 60; z += 3.2) {
    const on = light === 'bright' || (light === 'red' && z > 20 && z < 24) || (o.flicker && Math.abs(z - o.flicker) < 1.7);
    const c = on ? (light === 'red' ? '#ff3b2e' : '#f4fbff') : '#1d2026';
    s += poly([P(-0.25, -2.19, z), P(0.25, -2.19, z), P(0.25, -2.19, z + 1.6), P(-0.25, -2.19, z + 1.6)], c, on ? 'filter="url(#glow)"' : '');
    if (on && light === 'bright') s += `<ellipse cx="${f(P(0, 1.2, z + 0.8)[0])}" cy="${f(P(0, 1.2, z + 0.8)[1])}" rx="${f(240 / z * 2)}" ry="${f(30 / z * 2)}" fill="#ffffff" opacity="0.18"/>`;
  }
  // shelves, both sides
  for (const side of [-1, 1]) {
    const X = side * 1.6;
    if (o.hide === side) continue;
    s += poly([P(X, 1.2, 1), P(X, -1.4, 1), P(X, -1.4, 60), P(X, 1.2, 60)], light === 'bright' ? '#9aa3ab' : '#0e1014');
    const levels = [1.15, 0.6, 0.05, -0.5, -1.05];
    for (let li = 0; li < levels.length; li++) {
      const Y = levels[li];
      let z = 1.0;
      while (z < 60) {
        const dz = 0.35 + R() * 0.5;
        const empty = (o.empty || 0) > R();
        if (!empty) {
          const top = Y - (0.3 + R() * 0.2);
          s += poly([P(X, Y - 0.04, z), P(X, top, z), P(X, top, z + dz), P(X, Y - 0.04, z + dz)], pal[Math.floor(R() * pal.length)]);
        }
        z += dz + 0.04;
      }
      s += poly([P(X, Y, 1), P(X - side * 0.25, Y, 1), P(X - side * 0.25, Y, 60), P(X, Y, 60)], light === 'bright' ? '#e9edf0' : '#1a1d22');
      s += poly([P(X - side * 0.25, Y, 1), P(X - side * 0.25, Y + 0.06, 1), P(X - side * 0.25, Y + 0.06, 60), P(X - side * 0.25, Y, 60)], light === 'bright' ? '#f25a3a' : '#2a1414');
    }
  }
  // far wall
  const fw = [P(-1.7, -2.2, 60), P(1.7, -2.2, 60), P(1.7, 1.2, 60), P(-1.7, 1.2, 60)];
  s += poly(fw, light === 'bright' ? '#dfe5ea' : '#0c0e12');
  if (light === 'red') s += `<rect width="${W}" height="${H}" fill="#ff1a0a" opacity="0.28" style="mix-blend-mode:multiply"/><ellipse cx="${vx}" cy="${vy - 120}" rx="700" ry="380" fill="url(#poolRed)"/>`;
  if (light === 'dark') s += `<rect width="${W}" height="${H}" fill="#0a1830" opacity="0.55"/>`;
  if (light === 'dawn') s += `<ellipse cx="${vx}" cy="${vy - 300}" rx="900" ry="400" fill="url(#poolCool)" opacity="0.7"/>`;
  return { svg: s, P };
}

// Store front seen from the car park (exterior)
function storefront(o = {}) {
  const y = o.ground ?? 700, x0 = o.x0 ?? 360, x1 = o.x1 ?? 1560;
  let s = '';
  s += rect(x0 - 80, y - 420, x1 - x0 + 160, 420, '#3a3f47') + rect(x0 - 80, y - 440, x1 - x0 + 160, 40, '#2a2e34');
  s += rect(x0 + 300, y - 400, x1 - x0 - 600, 90, '#20242a') + `<text x="${(x0 + x1) / 2}" y="${y - 335}" text-anchor="middle" font-family="Anton" font-size="62" fill="${o.signOn === false ? '#3a3f47' : '#ff5a3a'}" ${o.signOn === false ? '' : 'filter="url(#glow)"'} letter-spacing="8">${o.sign || 'FRESHWAY MARKET'}</text>`;
  const gx = x0, gy = y - 290, gw = x1 - x0, gh = 290;
  s += rect(gx, gy, gw, gh, o.lit === false ? '#111' : '#ffe7b0');
  if (o.lit !== false) s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#ffd27a" opacity="0.6" filter="url(#b20)"/>`;
  for (let i = 0; i <= 8; i++) s += rect(gx + (gw / 8) * i - 6, gy, 12, gh, '#2a2e34');
  if (o.shutter !== undefined) s += shutter(gx, gy, gw, gh * o.shutter);
  if (o.lit !== false) s += `<ellipse cx="${(x0 + x1) / 2}" cy="${y + 60}" rx="${(x1 - x0) * 0.7}" ry="120" fill="url(#pool)"/>`;
  return s;
}

// ---------- 3D aerial ----------
function aerial(o) {
  const R = rng(o.seed || 11);
  const cam = { h: o.h || 120, pitch: (o.pitch || 40) * Math.PI / 180, f: o.f || 1100, cx: W / 2, cy: o.cy || H / 2, x: o.camX || 0, z: o.camZ || 0 };
  const sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch);
  const proj = (X, Y, Z) => { X -= cam.x; Z -= cam.z; const dy = cam.h - Y; const zc = Z * cp + dy * sp; const yc = dy * cp - Z * sp; if (zc < 1) return null; return [cam.cx + (cam.f * X) / zc, cam.cy + (cam.f * yc) / zc, zc]; };
  const items = [];
  const quad = (a, fill, extra) => { const p = a.map((q) => proj(...q)); if (p.some((q) => !q)) return; items.push({ d: 1e7, s: poly(p, fill, extra) }); };
  const box = (x, z, w, d, h, top, side, front, lit) => {
    const dd = proj(x + w / 2, h, z + d / 2); if (!dd) return;
    let s = '';
    const P = (X, Y, Z) => proj(X, Y, Z);
    const fr = [P(x, 0, z), P(x + w, 0, z), P(x + w, h, z), P(x, h, z)];
    const sl = [P(x, 0, z), P(x, 0, z + d), P(x, h, z + d), P(x, h, z)];
    const sr = [P(x + w, 0, z), P(x + w, 0, z + d), P(x + w, h, z + d), P(x + w, h, z)];
    const tp = [P(x, h, z), P(x + w, h, z), P(x + w, h, z + d), P(x, h, z + d)];
    if ([fr, sl, sr, tp].flat().some((q) => !q)) return;
    if (x > cam.x) s += poly(sl, side); else if (x + w < cam.x) s += poly(sr, side);
    s += poly(fr, front);
    if (lit) { const Rw = rng(Math.floor(x * 7 + z * 3)); for (let yy = 4; yy < h - 3; yy += 4) for (let xx = x + 2; xx < x + w - 2; xx += 4) if (Rw() < lit) { const q = P(xx, yy, z); const q2 = P(xx + 1.6, yy + 2, z); if (q && q2) s += rect(Math.min(q[0], q2[0]), Math.min(q[1], q2[1]), Math.abs(q2[0] - q[0]) + 0.5, Math.abs(q2[1] - q[1]) + 0.5, '#ffcf73', 'opacity="0.85"'); } }
    s += poly(tp, top);
    items.push({ d: dd[2] + Math.max(w, d) * 0.1, s });
  };
  // ground
  quad([[-2000, 0, 1], [2000, 0, 1], [2000, 0, 3000], [-2000, 0, 3000]], o.groundCol || '#151a20');
  // city blocks
  const blk = o.block || 70, street = o.street || 22;
  for (let bz = -2; bz < 30; bz++) for (let bx = -14; bx < 14; bx++) {
    const x = bx * (blk + street), z = bz * (blk + street);
    if (o.clear && o.clear(x, z)) continue;
    const n = 1 + Math.floor(R() * 3);
    for (let k = 0; k < n; k++) {
      const w = blk / n - 3, h = 10 + R() * (o.tall || 60);
      const g = 22 + Math.floor(R() * 18);
      box(x + k * (blk / n), z, w, blk, h, `rgb(${g + 8},${g + 10},${g + 16})`, `rgb(${g - 6},${g - 4},${g})`, `rgb(${g - 2},${g},${g + 6})`, o.lit ?? 0.05);
    }
  }
  (o.boxes || []).forEach((b) => box(...b));
  (o.quads || []).forEach((q) => quad(q[0], q[1], q[2]));
  // fires
  (o.fires || []).forEach(([x, z, r]) => { const p = proj(x, 0, z); if (p) items.push({ d: p[2] - 50, s: `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f((cam.f * r) / p[2])}" fill="url(#fire)"/><ellipse cx="${f(p[0])}" cy="${f(p[1] - (cam.f * r * 2.5) / p[2])}" rx="${f((cam.f * r * 1.5) / p[2])}" ry="${f((cam.f * r * 3) / p[2])}" fill="#2a2a2e" opacity="0.5" filter="url(#b20)"/>` }); });
  // horde dots: o.crowd = [{x0,x1,z0,z1,n,flow:[dx,dz]}]
  (o.crowd || []).forEach((c, ci) => {
    const Rc = rng(100 + ci);
    for (let i = 0; i < c.n; i++) {
      let x, z;
      if (c.fn) [x, z] = c.fn(Rc); else { x = c.x0 + (c.x1 - c.x0) * Rc(); z = c.z0 + (c.z1 - c.z0) * Rc(); }
      const p = proj(x, 0.9, z); if (!p) continue;
      const r = Math.max(2.2, (cam.f * (c.size || 1.3)) / p[2]);
      items.push({ d: p[2] - 0.5, s: `<circle cx="${f(p[0])}" cy="${f(p[1] + r * 0.5)}" r="${f(r * 1.2)}" fill="#141814"/><circle cx="${f(p[0])}" cy="${f(p[1] - r * 0.3)}" r="${f(r)}" fill="${Rc() > 0.5 ? '#6fae3e' : '#5a9a34'}"/>` + (r > 3 ? `<circle cx="${f(p[0] - r * 0.35)}" cy="${f(p[1] - r * 0.3)}" r="${f(r * 0.24)}" fill="#ffe680"/><circle cx="${f(p[0] + r * 0.35)}" cy="${f(p[1] - r * 0.3)}" r="${f(r * 0.24)}" fill="#ffe680"/>` : '') });
    }
  });
  (o.extra || []).forEach((e) => { const p = proj(e.x, e.y || 0, e.z); if (p) items.push({ d: p[2] - (e.bias || 0), s: e.draw(p, cam.f / p[2]) }); });
  items.sort((a, b) => b.d - a.d);
  return { svg: items.map((i) => i.s).join(''), proj };
}

module.exports = { defs, W, H, BAR, rng, f, pts, poly, rect, frame, person, zombie, tinyZ, horde, sky, moon, skyline, fog, lampPost, car, shutter, aisle, storefront, aerial, LOOKS };
