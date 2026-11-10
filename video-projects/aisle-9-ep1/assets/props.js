// props.js: AISLE 9 set pieces (SVG/HTML). Each maker returns the element (positioned absolutely in world space).
(function () {
  const S = STAGE;
  const mk = (parent, x, y, w, h, svg, extra = '') => {
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}`;
    d.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="overflow:visible">${svg}</svg>`;
    parent.appendChild(d); return d;
  };
  const P = {};

  // checkout counter, register screen, lane light "3"
  P.counter = (W, x, y, w = 1300, lane = '3') => {
    const g = mk(W, x, y, w, 420, `
      <defs><linearGradient id="ctr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6170"/><stop offset=".12" stop-color="#3a3f4b"/><stop offset="1" stop-color="#1f222a"/></linearGradient>
      <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9AF0C4"/><stop offset="1" stop-color="#2FA36B"/></linearGradient></defs>
      <rect x="0" y="40" width="${w}" height="380" rx="26" fill="url(#ctr)"/>
      <rect x="0" y="86" width="${w}" height="26" fill="#1F8A55"/>
      <rect x="0" y="16" width="${w * 0.62}" height="34" rx="10" fill="#1b1d22"/>
      ${Array.from({ length: 24 }, (_, i) => `<rect x="${i * w * 0.62 / 24}" y="18" width="3" height="30" fill="#2a2d35"/>`).join('')}
      <rect x="${w * 0.66}" y="-170" width="240" height="180" rx="16" fill="#202329"/>
      <rect x="${w * 0.66 + 16}" y="-154" width="208" height="120" rx="8" fill="url(#scr)"/>
      <text x="${w * 0.66 + 120}" y="-84" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="34" fill="#0d3d26">$4.79</text>
      <rect x="${w * 0.66 + 90}" y="10" width="60" height="30" fill="#202329"/>
      <rect x="${w * 0.9}" y="-470" width="14" height="510" fill="#9aa0aa"/>`);
    const light = mk(W, x + w * 0.9 - 63, y - 560, 140, 140, `<defs><radialGradient id="ln"><stop offset="0" stop-color="#fff7c2"/><stop offset=".6" stop-color="#F2B134"/><stop offset="1" stop-color="#b07a16"/></radialGradient></defs>
      <circle cx="70" cy="70" r="70" fill="url(#ln)"/><text x="70" y="104" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="100" fill="#1b1b1b">${lane}</text>`, 'filter:drop-shadow(0 0 40px rgba(255,210,90,.8))');
    return { g, light };
  };
  // counter front only (to draw in front of the cashier)
  P.counterFront = (W, x, y, w = 1300) => mk(W, x, y, w, 380, `<defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a505e"/><stop offset="1" stop-color="#1f222a"/></linearGradient></defs>
      <rect x="0" y="0" width="${w}" height="380" rx="20" fill="url(#cf)"/><rect x="0" y="40" width="${w}" height="26" fill="#1F8A55"/>
      <text x="60" y="160" font-family="Basement Grotesque" font-weight="900" font-size="64" fill="#F7F4EA" opacity=".9">FRESHMART</text>`);

  // shopping cart (side view). set(x, y, wheelPhase)
  P.cart = (W, scale = 1) => {
    const d = mk(W, 0, 0, 520, 420, `
      <g stroke="#C9CED6" stroke-width="10" fill="none" stroke-linejoin="round">
        <path d="M 40 40 L 90 40 L 140 260 L 460 260 L 500 90 L 110 90"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M ${130 + i * 40} 90 L ${150 + i * 37} 260"/>`).join('')}
        <path d="M 112 140 L 488 140 M 122 200 L 474 200"/>
        <path d="M 150 260 L 170 330 L 450 330"/></g>
      <rect x="20" y="28" width="60" height="24" rx="10" fill="#E8382F"/>
      <g class="wh"><circle cx="190" cy="360" r="28" fill="#2a2a2a"/><circle cx="190" cy="360" r="10" fill="#888"/></g>
      <g class="wh"><circle cx="430" cy="360" r="28" fill="#2a2a2a"/><circle cx="430" cy="360" r="10" fill="#888"/></g>`, `transform-origin:0 0`);
    d.set = (x, y, s = scale, flip = false) => { d.style.transform = `translate(${x}px,${y}px) scale(${flip ? -s : s},${s})`; };
    return d;
  };
  // self-checkout kiosk; flash(k) turns the screen red
  P.kiosk = (W, x, y) => {
    const d = mk(W, x, y, 300, 620, `<rect x="40" y="200" width="220" height="420" rx="18" fill="#2b2f39"/><rect x="0" y="0" width="300" height="230" rx="20" fill="#16181d"/>
      <rect class="scr" x="18" y="18" width="264" height="190" rx="10" fill="#5FA8FF"/>
      <text x="150" y="105" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#fff">UNEXPECTED ITEM</text>
      <text x="150" y="140" text-anchor="middle" font-family="Inter" font-weight="600" font-size="20" fill="#fff">in the bagging area</text>
      <rect x="-60" y="300" width="420" height="40" rx="10" fill="#3a3f4b"/><rect x="200" y="340" width="140" height="160" rx="8" fill="#e9e2d0" opacity=".9"/>`);
    d.flash = (k) => { d.querySelector('.scr').setAttribute('fill', k ? '#E8382F' : '#5FA8FF'); };
    return d;
  };
  // customer service desk with a gooseneck mic and a "GARY ONLY" sticky note
  P.desk = (W, x, y) => {
    const d = mk(W, x, y, 900, 520, `
      <rect x="0" y="200" width="900" height="320" rx="24" fill="#2F7BE8"/><rect x="0" y="200" width="900" height="40" rx="12" fill="#5FA8FF"/>
      <text x="450" y="400" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="66" fill="#fff">CUSTOMER SERVICE</text>
      <rect x="560" y="150" width="140" height="56" rx="10" fill="#202329"/>
      <path d="M 630 150 C 630 60 560 40 520 20" stroke="#333" stroke-width="10" fill="none"/>
      <rect x="490" y="-6" width="56" height="44" rx="18" fill="#1b1b1b" transform="rotate(-25 518 16)"/>
      <rect class="btn" x="585" y="160" width="40" height="30" rx="6" fill="#C9302C"/>
      <g transform="rotate(-6 760 120)"><rect x="700" y="70" width="150" height="130" fill="#FFE14D"/><text x="775" y="125" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="44" fill="#1b1b1b">GARY</text><text x="775" y="170" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="44" fill="#1b1b1b">ONLY</text></g>`);
    d.press = (k) => d.querySelector('.btn').setAttribute('fill', k ? '#FF6A3D' : '#C9302C');
    return d;
  };
  // phone with a glowing screen
  P.phone = (W, scale = 1) => {
    const d = mk(W, 0, 0, 120, 220, `<rect x="0" y="0" width="120" height="220" rx="20" fill="#111"/><rect class="s" x="8" y="10" width="104" height="200" rx="14" fill="#3D5AFE"/>
      <text x="60" y="80" text-anchor="middle" font-family="Inter" font-weight="800" font-size="16" fill="#fff">BREAK TIME</text><text x="60" y="120" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="26" fill="#fff">1:00 AM</text>`, 'transform-origin:60px 110px;filter:drop-shadow(0 0 30px rgba(120,150,255,.9))');
    d.set = (x, y, s = scale, rot = 0) => { d.style.transform = `translate(${x - 60}px,${y - 110}px) rotate(${rot}deg) scale(${s})`; };
    return d;
  };
  // steel shutter: drop(u) 0 = open (up), 1 = closed
  P.shutter = (W, x, y, w, h) => {
    const d = mk(W, x, y, w, h, `<defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f96a3"/><stop offset="1" stop-color="#5b616c"/></linearGradient></defs>
      <rect x="0" y="0" width="${w}" height="${h}" fill="url(#sh)"/>${Array.from({ length: Math.ceil(h / 40) }, (_, i) => `<rect x="0" y="${i * 40}" width="${w}" height="6" fill="#4a4f58"/>`).join('')}`, 'overflow:hidden');
    d.drop = (u) => { d.style.clipPath = `inset(0 0 ${(1 - u) * 100}% 0)`; d.firstChild.style.transform = `translateY(${-(1 - u) * h}px)`; };
    return d;
  };
  // night parking lot seen through glass: canvas painter
  P.lot = (cv, o = {}) => {
    const W = cv.width, H = cv.height, c = cv.getContext('2d'), r = S.mulberry32(o.seed || 5);
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1024'); g.addColorStop(0.55, '#1b2140'); g.addColorStop(0.56, '#20232c'); g.addColorStop(1, '#2c2f38');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`; c.fillRect(r() * W, r() * H * 0.45, 2, 2); }
    // distant building with windows
    c.fillStyle = '#151a2c'; c.fillRect(W * 0.62, H * 0.28, W * 0.3, H * 0.28);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { c.fillStyle = '#0d1120'; c.fillRect(W * 0.64 + i * W * 0.045, H * 0.31 + j * H * 0.06, W * 0.025, H * 0.035); }
    // parking lines
    c.strokeStyle = 'rgba(240,240,220,.5)'; c.lineWidth = 6;
    for (let i = -8; i < 14; i++) { c.beginPath(); c.moveTo(W * 0.5 + i * 160, H * 0.62); c.lineTo(W * 0.5 + i * 330, H); c.stroke(); }
    // streetlight pool
    if (o.lamp !== false) { const lx = W * (o.lampX || 0.3); c.fillStyle = '#333'; c.fillRect(lx - 6, H * 0.22, 12, H * 0.4);
      const pg = c.createRadialGradient(lx, H * 0.7, 0, lx, H * 0.7, 420); pg.addColorStop(0, 'rgba(255,200,120,.45)'); pg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = pg; c.fillRect(lx - 420, H * 0.45, 840, H * 0.55);
      c.fillStyle = '#FFD58A'; c.beginPath(); c.ellipse(lx, H * 0.22, 40, 12, 0, 0, 7); c.fill(); }
    return { winX: W * 0.64 + 3 * W * 0.045, winY: H * 0.31 + 1 * H * 0.06, winW: W * 0.025, winH: H * 0.035 };
  };
  // stockroom painter: dark concrete, pallet racks with boxes, a door with a light crack
  P.stockroom = (cv, o = {}) => {
    const W = cv.width, H = cv.height, c = cv.getContext('2d'), r = S.mulberry32(o.seed || 9);
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d2028'); g.addColorStop(0.62, '#2a2d36'); g.addColorStop(0.63, '#3a3a3e'); g.addColorStop(1, '#232326'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let k = 0; k < 3; k++) { const x0 = W * (0.05 + k * 0.32); c.fillStyle = '#C7652B'; c.fillRect(x0, H * 0.12, 16, H * 0.52); c.fillRect(x0 + W * 0.26, H * 0.12, 16, H * 0.52);
      for (let l = 0; l < 3; l++) { const y = H * (0.25 + l * 0.17); c.fillStyle = '#2F5FA8'; c.fillRect(x0, y, W * 0.26 + 16, 12);
        let x = x0 + 20; while (x < x0 + W * 0.25) { const bw = 60 + r() * 90, bh = 60 + r() * 70; c.fillStyle = ['#B98A5A', '#A57A4B', '#C99A66', '#8E6A44'][Math.floor(r() * 4)]; c.fillRect(x, y - bh, bw, bh); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x, y - bh, bw, 8); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x + bw * 0.4, y - bh, bw * 0.15, bh); x += bw + 6; } } }
    // pallets on the floor
    for (let i = 0; i < 4; i++) { const x = W * (0.08 + i * 0.24); c.fillStyle = '#8E6A44'; c.fillRect(x, H * 0.8, W * 0.16, 26); c.fillStyle = '#6f5235'; c.fillRect(x, H * 0.8 + 26, W * 0.16, 10); }
    const vg = c.createRadialGradient(W / 2, H * 0.4, H * 0.1, W / 2, H * 0.5, W * 0.7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  };
  // wall clock: set(hours, minutes)
  P.clock = (W, x, y, r = 90) => {
    const d = mk(W, x - r, y - r, r * 2, r * 2, `<circle cx="${r}" cy="${r}" r="${r}" fill="#F7F4EA" stroke="#333" stroke-width="10"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<rect x="${r - 3}" y="12" width="6" height="16" fill="#333" transform="rotate(${i * 30} ${r} ${r})"/>`; }).join('')}
      <rect class="hh" x="${r - 5}" y="${r * 0.45}" width="10" height="${r * 0.55}" rx="5" fill="#222"/><rect class="mh" x="${r - 3}" y="${r * 0.18}" width="6" height="${r * 0.82}" rx="3" fill="#222"/><circle cx="${r}" cy="${r}" r="8" fill="#C9302C"/>`);
    d.set = (hh, mm) => { d.querySelector('.hh').setAttribute('transform', `rotate(${(hh % 12) * 30 + mm * 0.5} ${r} ${r})`); d.querySelector('.mh').setAttribute('transform', `rotate(${mm * 6} ${r} ${r})`); };
    return d;
  };
  // ceiling PA speaker horn
  P.speaker = (W, x, y, s = 1) => mk(W, x, y, 160 * s, 140 * s, `<g transform="scale(${s})"><rect x="70" y="0" width="20" height="40" fill="#555"/><path d="M 40 40 L 120 40 L 150 130 L 10 130 Z" fill="#d9dce2"/><ellipse cx="80" cy="130" rx="70" ry="12" fill="#2a2d35"/></g>`);
  // deli case (glass counter with food)
  P.deli = (W, x, y, w = 900) => mk(W, x, y, w, 360, `<rect x="0" y="120" width="${w}" height="240" rx="16" fill="#E9E2D0"/><rect x="0" y="0" width="${w}" height="130" rx="16" fill="rgba(190,230,255,.45)" stroke="#fff" stroke-width="6"/>
      ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${60 + i * (w - 120) / 7}" cy="100" rx="${(w - 120) / 18}" ry="22" fill="${['#E8382F', '#F2B134', '#F06EA9', '#FF8A3D'][i % 4]}"/>`).join('')}
      <rect x="0" y="180" width="${w}" height="20" fill="#C9302C"/><text x="${w / 2}" y="290" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="60" fill="#1F8A55">DELI</text>`);
  // cereal pyramid display; topple(u) knocks the boxes over
  P.cereal = (W, x, y) => {
    const g = document.createElement('div'); g.style.cssText = `position:absolute;left:${x}px;top:${y}px`; W.appendChild(g);
    const cols = ['#F2B134', '#E8382F', '#2F7BE8', '#FF8A3D', '#8A4FE0', '#2FA36B'], boxes = [];
    let k = 0; for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) {
      const b = document.createElement('div'); const bx = i * 110 + row * 55, by = -row * 150;
      b.style.cssText = `position:absolute;left:${bx}px;top:${by - 150}px;width:100px;height:146px;border-radius:6px;background:linear-gradient(90deg,${cols[k % 6]},${TOON.shade(cols[k % 6], 0.25)} 40%,${TOON.shade(cols[k % 6], -0.3)});box-shadow:inset 0 0 0 4px rgba(255,255,255,.25)`;
      b.innerHTML = `<div style="position:absolute;left:10px;right:10px;top:40px;height:40px;border-radius:50%;background:#fff;opacity:.85;font:900 16px/40px Inter;text-align:center;color:#333">CRUNCH</div>`;
      g.appendChild(b); boxes.push({ b, bx, by, seed: k++ }); }
    g.topple = (u) => boxes.forEach(({ b, seed, by }) => { const r = STAGE.hash(seed); const d = Math.max(0, u - r * 0.2); b.style.transform = `translate(${d * (r - 0.3) * 600}px, ${Math.min(1, d * 1.6) * (-by + 10)}px) rotate(${d * (r - 0.5) * 300}deg)`; });
    return g;
  };
  // a single can; label colour + text
  P.can = (W, label = 'PEACH', col = '#F2B134', scale = 1) => {
    const d = mk(W, 0, 0, 150, 190, `<defs><linearGradient id="cg${label}" x1="0" x2="1"><stop offset="0" stop-color="#8a8f98"/><stop offset=".35" stop-color="#eef0f4"/><stop offset="1" stop-color="#7d828b"/></linearGradient></defs>
      <rect x="0" y="0" width="150" height="190" rx="16" fill="url(#cg${label})"/><rect x="0" y="42" width="150" height="106" fill="${col}"/><rect x="0" y="42" width="150" height="106" fill="url(#cg${label})" opacity=".25"/>
      <text x="75" y="108" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="30" fill="#fff">${label}</text>
      <g class="tab"><ellipse cx="75" cy="8" rx="68" ry="10" fill="#c7ccd3"/><rect x="58" y="0" width="34" height="14" rx="7" fill="#9aa0a8"/></g>`, 'transform-origin:75px 95px');
    d.set = (x, y, s = scale, rot = 0) => { d.style.transform = `translate(${x - 75}px,${y - 95}px) rotate(${rot}deg) scale(${s})`; };
    return d;
  };
  // waffle box
  P.waffles = (W) => mk(W, 0, 0, 220, 160, `<rect x="0" y="0" width="220" height="160" rx="12" fill="#2F7BE8"/><rect x="14" y="14" width="192" height="60" rx="8" fill="#FFE14D"/>
      <text x="110" y="56" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="34" fill="#C9302C">WAFFLES</text>
      ${Array.from({ length: 3 }, (_, i) => `<rect x="${30 + i * 58}" y="92" width="46" height="46" rx="6" fill="#E8A33D"/>`).join('')}`, 'transform-origin:110px 80px;filter:drop-shadow(0 0 20px rgba(200,240,255,.7))');
  // shopping basket (held by a shopper)
  P.basket = (W) => mk(W, 0, 0, 200, 150, `<path d="M 40 50 Q 100 -40 160 50" stroke="#E8382F" stroke-width="12" fill="none"/><rect x="0" y="50" width="200" height="100" rx="14" fill="#E8382F"/>
      ${Array.from({ length: 6 }, (_, i) => `<rect x="${16 + i * 30}" y="66" width="18" height="70" rx="6" fill="#B81F1A"/>`).join('')}`, 'transform-origin:100px 0');
  // stool
  P.stool = (W, x, y) => mk(W, x, y, 260, 300, `<ellipse cx="130" cy="20" rx="120" ry="24" fill="#C9302C"/><rect x="40" y="30" width="16" height="270" fill="#9aa0aa" transform="rotate(8 48 30)"/><rect x="204" y="30" width="16" height="270" fill="#9aa0aa" transform="rotate(-8 212 30)"/><rect x="40" y="200" width="180" height="12" fill="#9aa0aa"/>`);
  // store front: glass doors, frames
  P.doors = (W, x, y, w, h) => mk(W, x, y, w, h, `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#9aa0aa" stroke-width="24"/><rect x="${w / 2 - 8}" y="0" width="16" height="${h}" fill="#9aa0aa"/>
      <rect x="${w / 2 - 60}" y="${h * 0.45}" width="30" height="120" rx="8" fill="#ccc"/><rect x="${w / 2 + 30}" y="${h * 0.45}" width="30" height="120" rx="8" fill="#ccc"/>
      <path d="M 40 40 L 200 ${h - 40}" stroke="rgba(255,255,255,.12)" stroke-width="40"/><path d="M ${w / 2 + 60} 40 L ${w / 2 + 200} ${h - 40}" stroke="rgba(255,255,255,.1)" stroke-width="30"/>
      <text x="${w / 4}" y="${h * 0.3}" text-anchor="middle" font-family="Basement Grotesque" font-weight="900" font-size="54" fill="rgba(255,255,255,.25)">PUSH</text>`);
  // flat silhouette of a standing figure (for crowds far away)
  P.silhouette = (W, x, y, s = 1, col = '#0a0c14') => mk(W, x - 60 * s, y - 300 * s, 120 * s, 300 * s, `<g transform="scale(${s})"><circle cx="60" cy="55" r="52" fill="${col}"/><rect x="18" y="100" width="84" height="120" rx="30" fill="${col}"/><rect x="26" y="200" width="30" height="100" rx="12" fill="${col}"/><rect x="64" y="200" width="30" height="100" rx="12" fill="${col}"/></g>`, 'transform-origin:50% 100%');
  // towel wrap on arm, bandage
  P.towel = (W) => mk(W, 0, 0, 90, 70, `<rect x="0" y="10" width="90" height="50" rx="14" fill="#F7F4EA"/><path d="M 0 22 L 90 22 M 0 48 L 90 48" stroke="#5FA8FF" stroke-width="5"/><circle cx="50" cy="35" r="10" fill="#C9302C" opacity=".6"/>`);

  window.PROPS = P;
})();
