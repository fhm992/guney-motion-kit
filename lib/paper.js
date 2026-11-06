// Paper cut-out kit: texture filters, cut-paper shapes, characters and props. Deterministic, SVG only.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const C = {
    paper: '#EFE6D3', paper2: '#E6DAC2', white: '#FBF7EE', navy: '#1E2A44', navy2: '#2D3D60', tomato: '#E4572E', tomato2: '#C9441F',
    sage: '#7FA88B', sage2: '#5F8A6C', kraft: '#C9A57A', kraft2: '#B08A5E', gold: '#E2A93B', skin1: '#E9B48F', skin2: '#B9785A', skin3: '#F1C9A5',
    hair1: '#2A1E1A', hair2: '#5A3A2A', hair3: '#8A5A2B', grey: '#B8B0A2', grey2: '#9C9486', sticky: '#F4D36B', sky: '#DCE6E3'
  };
  function defs() {
    if (document.getElementById('paper-defs')) return;
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('id', 'paper-defs'); s.setAttribute('width', 0); s.setAttribute('height', 0); s.style.position = 'absolute';
    s.innerHTML = `<defs>
      <filter id="cut" x="-10%" y="-10%" width="120%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="g"/>
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.62" result="ga"/>
        <feComposite in="ga" in2="d" operator="in" result="gi"/>
        <feBlend in="d" in2="gi" mode="multiply" result="tex"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b"/>
        <feOffset in="b" dx="3" dy="6" result="o"/>
        <feComponentTransfer in="o" result="sh"><feFuncA type="linear" slope="0.32"/></feComponentTransfer>
        <feMerge><feMergeNode in="sh"/><feMergeNode in="tex"/></feMerge>
      </filter>
      <filter id="cutflat" x="-10%" y="-10%" width="120%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b"/><feOffset in="b" dx="1.5" dy="3" result="o"/>
        <feComponentTransfer in="o" result="sh"><feFuncA type="linear" slope="0.28"/></feComponentTransfer>
        <feMerge><feMergeNode in="sh"/><feMergeNode in="d"/></feMerge>
      </filter>
      <filter id="sepia"><feColorMatrix type="matrix" values="0.5 0.45 0.15 0 0.08  0.42 0.42 0.12 0 0.06  0.33 0.32 0.1 0 0.04  0 0 0 1 0"/></filter>
    </defs>`;
    document.body.prepend(s);
  }
  function ground(el, color = C.paper) {
    el.style.background = color;
    const tex = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' seed='3'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.10 0'/></filter><rect width='600' height='600' filter='url(%23f)'/><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.05' numOctaves='2' seed='8'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0 0.2  0 0 0 0.07 0'/></filter><rect width='600' height='600' filter='url(%23g)'/></svg>`;
    el.style.backgroundImage = `url("data:image/svg+xml;utf8,${tex}"), radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.35), rgba(0,0,0,0.10) 95%)`;
  }
  function svg(parent, { x = 0, y = 0, w = 1920, h = 1080 } = {}) {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('width', w); s.setAttribute('height', h);
    Object.assign(s.style, { position: 'absolute', left: x + 'px', top: y + 'px', overflow: 'visible' });
    parent.appendChild(s); return s;
  }
  function g(parent, html, attrs = {}) { const e = document.createElementNS(NS, 'g'); e.innerHTML = html; for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
  const T = (s, x, y, size, fill = C.navy, font = 'Archivo Black', anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${s}</text>`;

  // ---------- faces ----------
  function face(mood, cx, cy, skin) {
    const N = C.navy;
    const eyes = {
      shock: `<circle cx="${cx - 17}" cy="${cy}" r="9" fill="${C.white}" stroke="${N}" stroke-width="3"/><circle cx="${cx + 17}" cy="${cy}" r="9" fill="${C.white}" stroke="${N}" stroke-width="3"/><circle cx="${cx - 17}" cy="${cy}" r="3.5" fill="${N}"/><circle cx="${cx + 17}" cy="${cy}" r="3.5" fill="${N}"/>`,
      tired: `<path d="M${cx - 25} ${cy} h16 M${cx + 9} ${cy} h16" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
      happy: `<path d="M${cx - 25} ${cy + 3} q8 -10 16 0 M${cx + 9} ${cy + 3} q8 -10 16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      wink: `<ellipse cx="${cx - 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><path d="M${cx + 9} ${cy + 2} q8 -8 16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    }[mood] || `<ellipse cx="${cx - 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/><ellipse cx="${cx + 17}" cy="${cy}" rx="5" ry="6.5" fill="${N}"/>`;
    const brows = { worry: `<path d="M${cx - 30} ${cy - 16} L${cx - 8} ${cy - 25} M${cx + 8} ${cy - 25} L${cx + 30} ${cy - 16}" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
      angry: `<path d="M${cx - 30} ${cy - 24} L${cx - 8} ${cy - 14} M${cx + 8} ${cy - 14} L${cx + 30} ${cy - 24}" stroke="${N}" stroke-width="6" stroke-linecap="round"/>`,
      shock: `<path d="M${cx - 30} ${cy - 26} q11 -8 22 0 M${cx + 8} ${cy - 26} q11 -8 22 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>` }[mood === 'sad' || mood === 'worry' ? 'worry' : mood] || '';
    const my = cy + 26;
    const mouth = {
      smile: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      happy: `<path d="M${cx - 18} ${my - 2} Q${cx} ${my + 22} ${cx + 18} ${my - 2} Z" fill="${N}"/>`,
      wink: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      sad: `<path d="M${cx - 15} ${my + 6} Q${cx} ${my - 6} ${cx + 15} ${my + 6}" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      worry: `<path d="M${cx - 14} ${my + 4} q7 -6 14 0 q7 6 14 0" stroke="${N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      shock: `<ellipse cx="${cx}" cy="${my + 4}" rx="9" ry="12" fill="${N}"/>`,
      angry: `<path d="M${cx - 18} ${my + 6} h36" stroke="${N}" stroke-width="6" stroke-linecap="round"/>`,
      tired: `<path d="M${cx - 10} ${my + 4} h20" stroke="${N}" stroke-width="4.5" stroke-linecap="round"/>`
    }[mood] || `<path d="M${cx - 12} ${my} Q${cx} ${my + 6} ${cx + 12} ${my}" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const cheeks = (mood === 'happy' || mood === 'smile' || mood === 'wink') ? `<circle cx="${cx - 34}" cy="${cy + 18}" r="8" fill="${C.tomato}" opacity=".35"/><circle cx="${cx + 34}" cy="${cy + 18}" r="8" fill="${C.tomato}" opacity=".35"/>` : '';
    const red = mood === 'angry' ? `<ellipse cx="${cx}" cy="${cy + 6}" rx="48" ry="44" fill="${C.tomato}" opacity=".35"/>` : '';
    return red + eyes + brows + mouth + cheeks;
  }
  // ---------- arms (shoulder at sx,sy; returns path + hand) ----------
  function arm(pose, side, sx, sy, sleeve, skin) {
    const d = side === 'l' ? -1 : 1;
    const ends = { down: [d * 18, 140], hip: [d * 50, 100], up: [d * 30, -150], wave: [d * 90, -110], forward: [d * 120, 40], hold: [d * 70, 70], type: [d * 70, 90], cross: [-d * 50, 70], point: [d * 150, -20], out: [d * 140, 30] }[pose] || [d * 18, 140];
    const [ex, ey] = [sx + ends[0], sy + ends[1]];
    const mx = (sx + ex) / 2 + d * (pose === 'down' ? 12 : 20), my = (sy + ey) / 2 + (pose === 'up' || pose === 'wave' ? 0 : 10);
    return `<g filter="url(#cut)"><path d="M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}" stroke="${sleeve}" stroke-width="34" fill="none" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="17" fill="${skin}"/></g>`;
  }
  // ---------- generic person: feet at 0,0, about 345 tall ----------
  const LOOK = {
    you: { top: C.navy, top2: C.navy2, skin: C.skin1, hair: C.hair1, hairStyle: 'short', collar: C.white, cardigan: true },
    manager: { top: C.tomato2, top2: C.tomato, skin: C.skin2, hair: C.hair2, hairStyle: 'bob', collar: C.white, blazer: true },
    grey: { top: C.grey2, top2: C.grey, skin: '#CFC6B8', hair: C.grey2, hairStyle: 'short', collar: C.grey },
    client: { top: C.sage2, top2: C.sage, skin: C.skin3, hair: C.hair3, hairStyle: 'side', collar: C.white },
    exec: { top: C.navy, top2: C.navy2, skin: C.skin3, hair: C.grey, hairStyle: 'bald', collar: C.white, tie: C.tomato },
    co1: { top: C.kraft2, top2: C.kraft, skin: C.skin2, hair: C.hair1, hairStyle: 'bun', collar: C.white },
    co2: { top: C.sage2, top2: C.sage, skin: C.skin1, hair: C.hair3, hairStyle: 'short', collar: C.white },
    newhire: { top: C.gold, top2: '#C99230', skin: C.skin3, hair: C.hair2, hairStyle: 'side', collar: C.white }
  };
  function hairPath(style, color) {
    return {
      short: `<path d="M-56 -270 Q-62 -340 4 -344 Q62 -340 58 -282 Q30 -300 -6 -296 Q-30 -296 -44 -262 Z" fill="${color}"/>`,
      bob: `<path d="M-60 -250 Q-66 -340 2 -342 Q68 -340 60 -250 L44 -230 Q48 -290 20 -300 Q-10 -284 -44 -290 Q-48 -260 -46 -230 Z" fill="${color}"/>`,
      side: `<path d="M-54 -262 Q-60 -338 6 -342 Q60 -338 56 -270 Q50 -304 -20 -300 Q-44 -290 -48 -250 Z" fill="${color}"/>`,
      bun: `<circle cx="0" cy="-350" r="26" fill="${color}"/><path d="M-54 -262 Q-58 -336 0 -338 Q58 -336 54 -262 Q40 -300 0 -302 Q-40 -300 -54 -262 Z" fill="${color}"/>`,
      bald: `<path d="M-54 -262 Q-56 -290 -46 -296 L-40 -260 Z M54 -262 Q56 -290 46 -296 L40 -260 Z" fill="${color}"/>`
    }[style];
  }
  function personSVG(kind, o = {}) {
    const L = Object.assign({}, LOOK[kind] || LOOK.you, o.look || {});
    const mood = o.mood || 'neutral', la = o.armL || 'down', ra = o.armR || 'down';
    let s = '';
    if (o.seated) s += ''; else s += `<g filter="url(#cut)"><rect x="-44" y="-40" width="34" height="42" fill="${C.navy}"/><rect x="10" y="-40" width="34" height="42" fill="${C.navy}"/></g>`;
    s += `<g filter="url(#cut)">
      <path d="M-66 -30 L-60 -150 Q-58 -190 -20 -196 L20 -196 Q58 -190 60 -150 L66 -30 Z" fill="${L.top}"/>
      <path d="M-15 -196 L0 -156 L15 -196 Z" fill="${L.collar}"/>
      ${L.cardigan ? `<path d="M-4 -156 L-4 -34" stroke="${L.top2}" stroke-width="5"/><circle cx="-4" cy="-120" r="4" fill="${C.kraft}"/><circle cx="-4" cy="-82" r="4" fill="${C.kraft}"/>` : ''}
      ${L.blazer ? `<path d="M-15 -196 L-28 -110 L0 -150 Z M15 -196 L28 -110 L0 -150 Z" fill="${L.top2}"/>` : ''}
      ${L.tie ? `<path d="M0 -190 L-8 -110 L0 -96 L8 -110 Z" fill="${L.tie}"/>` : ''}
      ${o.badge ? o.badge : ''}
    </g>`;
    const armL = arm(la, 'l', -48, -178, L.top2, L.skin), armR = arm(ra, 'r', 48, -178, L.top2, L.skin);
    s += armL + armR;
    s += `<g filter="url(#cut)">
      <rect x="-13" y="-214" width="26" height="24" fill="${L.skin}"/>
      <path d="M-52 -268 Q-54 -322 0 -326 Q54 -322 52 -268 Q50 -214 0 -208 Q-50 -214 -52 -268 Z" fill="${L.skin}"/>
      ${hairPath(L.hairStyle, L.hair)}
      ${face(mood, 0, -262, L.skin)}
      ${o.sweat ? `<path d="M50 -300 q10 18 0 24 q-10 -6 0 -24z" fill="#9CC3D8"/><path d="M-58 -280 q8 14 0 20 q-8 -6 0 -20z" fill="#9CC3D8"/>` : ''}
    </g>`;
    return s;
  }
  function internSVG(o = {}) {
    const N = C.navy, mood = o.mood || 'neutral';
    const eyes = mood === 'twitch' ? `<circle cx="-24" cy="-226" r="20" fill="${N}"/><circle cx="24" cy="-226" r="13" fill="${N}"/><circle cx="-18" cy="-233" r="6" fill="${C.white}"/><circle cx="28" cy="-231" r="4" fill="${C.white}"/>`
      : mood === 'proud' ? `<path d="M-40 -222 q16 -16 32 0 M8 -222 q16 -16 32 0" stroke="${N}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      : `<circle cx="-24" cy="-226" r="17" fill="${N}"/><circle cx="24" cy="-226" r="17" fill="${N}"/><circle cx="-19" cy="-232" r="5" fill="${C.white}"/><circle cx="29" cy="-232" r="5" fill="${C.white}"/>`;
    const mouth = mood === 'proud' || mood === 'happy' ? `<path d="M-16 -202 Q0 -186 16 -202 Z" fill="${N}"/>` : `<path d="M-12 -200 Q0 -192 12 -200" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const la = o.armL || 'down', ra = o.armR || 'down';
    return `<g filter="url(#cut)"><rect x="-44" y="-40" width="16" height="40" rx="6" fill="${N}"/><rect x="28" y="-40" width="16" height="40" rx="6" fill="${N}"/>
        <rect x="-62" y="-150" width="124" height="116" rx="26" fill="${C.tomato}"/>
        <path d="M-22 -150 L0 -112 L22 -150" stroke="${N}" stroke-width="4" fill="none"/>
        <rect x="-18" y="-112" width="36" height="46" rx="5" fill="${C.white}"/>
        <text x="0" y="-85" font-family="Archivo Black" font-size="7" text-anchor="middle" fill="${N}">INTERN</text></g>
      ${arm(la, 'l', -56, -130, C.tomato2, C.tomato2)}${arm(ra, 'r', 56, -130, C.tomato2, C.tomato2)}
      <g filter="url(#cut)">
        <rect x="-8" y="-172" width="16" height="26" fill="${N}"/>
        <rect x="-76" y="-282" width="152" height="114" rx="34" fill="${C.tomato}"/>
        <rect x="-58" y="-264" width="116" height="78" rx="22" fill="${C.white}"/>
        ${eyes}${mouth}
        ${o.nose ? `<rect x="-6" y="-216" width="${o.nose}" height="12" rx="6" fill="${C.tomato2}"/>` : ''}
        <path d="M0 -282 L0 -312" stroke="${N}" stroke-width="5"/><circle cx="0" cy="-318" r="10" fill="${C.gold}"/>
      </g>`;
  }
  function person(parent, kind, x, y, scale = 1, o = {}) {
    const html = kind === 'intern' ? internSVG(o) : personSVG(kind, o);
    return g(parent, html, { transform: `translate(${x} ${y}) scale(${o.flip ? -scale : scale} ${scale})`, class: 'puppet ' + kind });
  }

  // ---------- props ----------
  const P = {
    floor: (y, color = C.paper2) => `<rect x="-40" y="${y}" width="2000" height="${1200 - y}" fill="${color}" filter="url(#cutflat)"/>`,
    wall: (y, color = '#E9DDC6') => `<rect x="-40" y="-40" width="2000" height="${y + 40}" fill="${color}"/>`,
    desk: (x, y, w, color = C.kraft) => `<g filter="url(#cut)"><rect x="${x + 40}" y="${y + 36}" width="${w - 80}" height="170" fill="${C.kraft2}"/><rect x="${x}" y="${y}" width="${w}" height="40" rx="6" fill="${color}"/><rect x="${x + 30}" y="${y + 40}" width="26" height="320" fill="${C.kraft2}"/><rect x="${x + w - 56}" y="${y + 40}" width="26" height="320" fill="${C.kraft2}"/></g>`,
    laptopBack: (x, y, s = 1, logo = C.tomato) => `<g filter="url(#cut)" transform="translate(${x} ${y}) scale(${s})"><path d="M-130 0 L-110 -150 L130 -150 L110 0 Z" fill="${C.navy2}"/><rect x="-150" y="-6" width="300" height="12" rx="4" fill="${C.navy}"/><circle cx="0" cy="-76" r="20" fill="${logo}"/><circle cx="0" cy="-76" r="8" fill="${C.white}"/></g>`,
    mug: (x, y, s = 1, steam = true) => `<g filter="url(#cut)" transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0 L-30 -80 L30 -80 L34 0Z" fill="${C.white}"/><path d="M30 -62 q34 0 30 26 q-4 22 -32 18" stroke="${C.white}" stroke-width="11" fill="none"/>${steam ? `<path d="M-12 -94 q-8 -22 4 -40 M10 -92 q-8 -24 4 -44" stroke="${C.white}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>` : ''}</g>`,
    sheet: (x, y, r = 0, s = 1, hl = -1) => `<g filter="url(#cut)" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-80" y="-105" width="160" height="210" fill="${C.white}"/><rect x="-56" y="-78" width="80" height="12" fill="${C.navy}"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="-56" y="${-48 + k * 22}" width="${112 - (k % 3) * 18}" height="7" fill="${k === hl ? C.tomato : C.grey}"/>`).join('')}</g>`,
    sticky: (x, y, r, text, size = 54, color = C.sticky, w = 220) => `<g filter="url(#cut)" transform="translate(${x} ${y}) rotate(${r})"><rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" fill="${color}"/>${String(text).split('|').map((l, i, a) => T(l, 0, (i - (a.length - 1) / 2) * size * 0.95 + size * 0.32, size, C.navy, 'Caveat')).join('')}</g>`,
    clock: (x, y, r, h, m, label = '') => { const ha = (h % 12 + m / 60) * 30, ma = m * 6; return `<g filter="url(#cut)" transform="translate(${x} ${y})"><circle r="${r}" fill="${C.navy}"/><circle r="${r * 0.86}" fill="${C.white}"/>${[...Array(12)].map((_, i) => `<rect x="-3" y="${-r * 0.8}" width="6" height="${r * 0.12}" fill="${C.navy}" transform="rotate(${i * 30})"/>`).join('')}<path d="M0 0 L0 ${-r * 0.45}" stroke="${C.navy}" stroke-width="${r * 0.08}" stroke-linecap="round" transform="rotate(${ha})"/><path d="M0 0 L0 ${-r * 0.68}" stroke="${C.tomato}" stroke-width="${r * 0.05}" stroke-linecap="round" transform="rotate(${ma})"/><circle r="${r * 0.07}" fill="${C.navy}"/>${label ? T(label, 0, r + r * 0.45, r * 0.32) : ''}</g>`; },
    stopwatch: (x, y, s, label) => `<g filter="url(#cut)" transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="-176" width="44" height="34" rx="6" fill="${C.navy}"/><circle r="150" fill="${C.tomato}"/><circle r="122" fill="${C.white}"/><path d="M0 0 L0 -100" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/><circle r="12" fill="${C.navy}"/>${T(label, 0, 70, 54)}</g>`,
    phone: (x, y, s, r = 0) => `<g filter="url(#cut)" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-110" y="-200" width="220" height="400" rx="30" fill="${C.navy}"/><rect x="-96" y="-180" width="192" height="360" rx="18" fill="${C.white}"/></g>`,
    bubble: (x, y, w, h, tail = 'bl', fill = C.white) => `<g filter="url(#cut)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(30, h / 3)}" fill="${fill}"/>${tail === 'bl' ? `<path d="M${x + 30} ${y + h - 4} l-18 34 l50 -34z" fill="${fill}"/>` : tail === 'br' ? `<path d="M${x + w - 30} ${y + h - 4} l18 34 l-50 -34z" fill="${fill}"/>` : ''}</g>`,
    thought: (x, y, w, h) => `<g filter="url(#cut)"><ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${C.white}"/><circle cx="${x + w * 0.2}" cy="${y + h + 26}" r="20" fill="${C.white}"/><circle cx="${x + w * 0.12}" cy="${y + h + 66}" r="11" fill="${C.white}"/></g>`,
    tag: (x, y, r, num, color = C.white, s = 1) => `<g filter="url(#cut)" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0 L200 0 L200 130 L0 130 Z" fill="${color}"/><circle cx="26" cy="26" r="10" fill="${C.paper}"/>${T(num, 112, 96, 74, C.navy)}</g>`,
    paycheck: (x, y, r, s, text = '$ PAY') => `<g filter="url(#cut)" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-150" y="-70" width="300" height="140" fill="#DDEBD9"/><rect x="-130" y="-50" width="120" height="14" fill="${C.sage2}"/>${T(text, 50, 30, 46, C.sage2)}<rect x="-130" y="40" width="160" height="6" fill="${C.sage2}"/></g>`,
    shield: (cx, cy, s, n, glow = false) => {
      const cols = [C.sage, C.navy, C.sage, C.navy, C.sage, C.navy, C.gold, C.sage, C.navy];
      let pieces = ''; for (let i = 0; i < 9; i++) { const r = Math.floor(i / 3), c = i % 3, x = -240 + c * 160, y = -300 + r * 200;
        pieces += i < n ? `<rect x="${x + 5}" y="${y + 5}" width="150" height="190" fill="${cols[i]}"/>${T(i + 1, x + 80, y + 122, 64, i === 6 ? C.navy : C.white, 'Archivo Black', 'middle', 'opacity=".9"')}` : `<rect x="${x + 14}" y="${y + 14}" width="132" height="172" fill="none" stroke="${C.grey}" stroke-width="5" stroke-dasharray="12 10"/>`; }
      const id = 'sc' + Math.round(cx) + '_' + Math.round(cy);
      return `<g transform="translate(${cx} ${cy}) scale(${s})">${glow ? `<circle r="420" fill="${C.gold}" opacity=".18"/>` : ''}<defs><clipPath id="${id}"><path d="M0 -300 L240 -228 Q250 110 0 298 Q-250 110 -240 -228 Z"/></clipPath></defs>
        <g filter="url(#cut)"><path d="M0 -330 L270 -250 Q280 120 0 330 Q-280 120 -270 -250 Z" fill="${C.white}"/></g><g clip-path="url(#${id})" filter="url(#cutflat)">${pieces}</g></g>`;
    },
    brick: (x, y, color, w = 114, h = 58) => { const d = color === C.tomato ? C.tomato2 : color === C.navy ? C.navy2 : C.sage2; return `<g filter="url(#cut)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${color}"/><circle cx="${x + w * 0.27}" cy="${y}" r="11" fill="${d}"/><circle cx="${x + w * 0.73}" cy="${y}" r="11" fill="${d}"/></g>`; },
    banner: (x, y, w, h, text, fill = C.tomato, color = C.white, size = 72, r = 0) => `<g filter="url(#cut)" transform="rotate(${r} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>${T(text, x + w / 2, y + h / 2 + size * 0.36, size, color, 'Bricolage Grotesque', 'middle', 'font-weight="800"')}</g>`
  };
  // an HTML UI panel (crisp interface inside paper props)
  function ui(parent, x, y, w, h, inner, title = 'AI chat') {
    const d = document.createElement('div');
    Object.assign(d.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', background: '#FBF7EE', borderRadius: '10px', overflow: 'hidden', fontFamily: 'Inter, sans-serif', color: C.navy });
    d.innerHTML = (title ? `<div style="height:52px;display:flex;align-items:center;gap:10px;padding:0 22px;border-bottom:2px solid #E6DAC2;background:#F4EEE1">
      <span style="width:14px;height:14px;border-radius:50%;background:#E4572E"></span><span style="width:14px;height:14px;border-radius:50%;background:#E2A93B"></span><span style="width:14px;height:14px;border-radius:50%;background:#7FA88B"></span>
      <span style="margin-left:18px;font:600 22px Inter;color:#5a6378">${title}</span></div>` : '') + inner;
    parent.appendChild(d); return d;
  }
  window.PAPER = { C, defs, ground, svg, g, person, P, T, ui, NS };
})();
