// hero.js: the cast. HERO.svg(pose, T) -> svg string. One rig for the hero and every other person in the film.
// pose: x, y (feet), s (scale; 1 = ~430 px tall), face (1 right, -1 left, 0 front), lean, tilt (deg),
//   brows ('neutral'|'sad'|'worried'|'happy'|'angry'|'up'), mouth ('flat'|'smile'|'grin'|'frown'|'o'|'wavy'|'open'|'sigh'),
//   eyes ('open'|'closed'|'half'|'wide'), look [dx,dy], armL/armR [shoulder, elbow], legL/legR [hip, knee], sit,
//   walk (phase in cycles: drives legs, arms and bob), prop / propBack (svg drawn in the front / back hand), blush 0..1,
//   pal (palette name), faceless, hat ('pilot'), frost 0..1, op (opacity), blink (false to stop auto blinks)
(function () {
  const F = () => window.FILM;
  const PAL = {
    hero: { skin: '#B97A56', skinD: '#9C6243', hair: '#1E1A2E', top: '#F2A93B', topD: '#D4861F', pants: '#2C3170', pantsD: '#22265A', shoe: '#F4F0E6', shoeD: '#C9C2B4', style: 'short', hood: true },
    recruiter: { skin: '#E3A77F', skinD: '#C98A63', hair: '#3B2416', top: '#45D6B5', topD: '#2FB892', pants: '#2A2F5A', pantsD: '#1F2348', shoe: '#2A2F5A', shoeD: '#1F2348', style: 'bun' },
    manager: { skin: '#8A5A3E', skinD: '#714630', hair: '#141022', top: '#7B6CFF', topD: '#5A4FCF', pants: '#1F2348', pantsD: '#171A3A', shoe: '#141022', shoeD: '#0E0B1A', style: 'long' },
    friend: { skin: '#F0C09A', skinD: '#D8A37B', hair: '#7A4A22', top: '#FF8A7A', topD: '#E06A5C', pants: '#2C3170', pantsD: '#22265A', shoe: '#F4F0E6', shoeD: '#C9C2B4', style: 'short' },
    crowd: { skin: '#5B54A8', skinD: '#4A4392', hair: '#2A2468', top: '#3E3891', topD: '#332D7C', pants: '#2A2468', pantsD: '#221D58', shoe: '#2A2468', shoeD: '#221D58', style: 'short', faceless: true },
    clone: { skin: '#B97A56', skinD: '#9C6243', hair: '#1E1A2E', top: '#C9A35E', topD: '#A8833F', pants: '#2C3170', pantsD: '#22265A', shoe: '#D9D2C4', shoeD: '#B5AE9F', style: 'short', hood: true },
  };
  const rad = (d) => (d * Math.PI) / 180;
  function limb(x, y, a1, a2, l1, l2, dir) {
    const ex = x + Math.sin(rad(a1)) * l1 * dir, ey = y + Math.cos(rad(a1)) * l1, a = a1 + a2;
    return [ex, ey, ex + Math.sin(rad(a)) * l2 * dir, ey + Math.cos(rad(a)) * l2];
  }
  const BROWS = { neutral: [0, 0], sad: [-14, 3], worried: [-18, 0], happy: [6, -4], angry: [16, 3], up: [0, -9] };
  function svg(p, T = 0) {
    const { f, G, path, circ, ell, rect, line } = F();
    p = Object.assign({ x: 0, y: 0, s: 1, face: 1, lean: 0, tilt: 0, brows: 'neutral', mouth: 'flat', eyes: 'open', look: [0, 0], armL: [8, 10], armR: [-8, 10], legL: [12, 0], legR: [-10, 0], sit: false, blush: 0, pal: 'hero', op: 1 }, p);
    const C = PAL[p.pal] || PAL.hero, faceless = p.faceless ?? C.faceless;
    let bob = 0;
    if (p.walk !== undefined) {   // walk cycle overrides limbs
      const ph = p.walk * Math.PI * 2, sw = p.stride ?? 1;
      p.legL = [24 * sw * Math.sin(ph), -Math.max(0, 34 * sw * Math.sin(ph + 1.9))];
      p.legR = [-24 * sw * Math.sin(ph), -Math.max(0, 34 * sw * Math.sin(ph + 1.9 + Math.PI))];
      if (!p.holdL) p.armL = [-22 * sw * Math.sin(ph), 18]; if (!p.holdR) p.armR = [22 * sw * Math.sin(ph), 18];
      bob = -6 * Math.abs(Math.cos(ph)) * sw; p.lean += 4 * sw;
    }
    // auto blink (seeded by who this is, so a crowd doesn't blink in unison)
    if (p.blink !== false && p.eyes === 'open') { const k = (p.seed || 0) * 1.37; const ph = ((T + k) % 3.7 + 3.7) % 3.7; if (ph < 0.12) p.eyes = 'closed'; }
    const breath = Math.sin((T + (p.seed || 0)) * 1.6) * 0.012;
    const dir = p.face === 0 ? 1 : p.face, side = p.face === 0 ? 0 : 1;
    let s = '';
    s += ell(0, 4, 92, 14, '#05061A', { opacity: 0.32 });
    let g = '';
    const hipY = -140;
    const leg = (pp, off, back) => {
      const hx = off * (side ? 0.55 : 1.25), d = side ? dir : Math.sign(off);
      const a = p.sit ? [pp[0] + 90, pp[1] - 90] : pp;
      const [kx, ky, fx, fy] = limb(hx, hipY + 8, a[0], a[1], 70, 68, d);
      let o = line(`M${f(hx)},${hipY + 8} L${f(kx)},${f(ky)} L${f(fx)},${f(fy)}`, back ? C.pantsD : C.pants, 40);
      if (side) o += path(`M${f(fx - 16 * dir)},${f(fy + 6)} q0,-22 ${22 * dir},-22 h${10 * dir} q${22 * dir},0 ${24 * dir},22 z`, back ? C.shoeD : C.shoe);
      else o += path(`M${f(fx - 24)},${f(fy + 6)} q0,-22 24,-22 q24,0 24,22 z`, back ? C.shoeD : C.shoe);
      return o;
    };
    g += leg(p.legR, 18, true) + leg(p.legL, -18, false);
    let body = '';
    const arm = (pp, off, back, prop) => {
      const sx = off * (side ? 0.35 : 1.15), sy = -262, d = side ? dir : Math.sign(off);
      const [ex, ey, hx, hy] = limb(sx, sy, pp[0], pp[1], 62, 60, d);
      let o = line(`M${f(sx)},${sy} L${f(ex)},${f(ey)} L${f(hx)},${f(hy)}`, back ? C.topD : C.top, 34);
      o += circ(hx, hy, 17, back ? C.skinD : C.skin);
      if (prop) o += G(`translate(${f(hx)},${f(hy)})${dir < 0 && side ? ' scale(-1,1)' : ''}`, prop);
      return o;
    };
    body += arm(p.armR, 40, true, p.propBack);
    // torso
    body += path('M-62,-150 Q-70,-268 -30,-284 L30,-284 Q70,-268 62,-150 Q60,-128 40,-126 L-40,-126 Q-60,-128 -62,-150 Z', C.top);
    body += path(`M${18 * dir},-282 Q${64 * dir},-266 ${62 * dir},-150 Q${60 * dir},-128 ${40 * dir},-126 L${22 * dir},-126 Q${42 * dir},-200 ${18 * dir},-282 Z`, C.topD);
    if (C.hood) {
      body += line('M-46,-150 L46,-150', C.topD, 8);
      body += line(`M${-26 + 8 * dir * side},-286 Q${8 * dir * side},-262 ${26 + 8 * dir * side},-286`, C.topD, 10);
      body += line(`M${-8 + 6 * dir * side},-262 v34 M${8 + 6 * dir * side},-262 v30`, '#FFF8EA', 4, { opacity: 0.85 });
    } else body += path(`M${-20 + 8 * dir * side},-284 L${8 * dir * side},-252 L${20 + 8 * dir * side},-284 Z`, C.skinD);
    // head
    let head = rect(-14, -302, 28, 26, C.skinD);
    const hx0 = 6 * dir * side;
    head += circ(hx0, -352, 66, C.skin);
    head += path(`M${hx0 + 20 * dir * side},-418 A66,66 0 0 1 ${hx0 + 66 * dir},-352 Q${hx0 + 40 * dir},-340 ${hx0 + 30 * dir},-360 Z`, C.skinD, { opacity: 0.35 });
    if (side) head += ell(hx0 - 44 * dir, -346, 11, 15, C.skinD);
    const P = (x, y) => `${f(hx0 + x * dir)},${y}`;
    if (C.style === 'bun') { head += circ(hx0 - 30 * dir * side, -420, 30, C.hair); }
    if (C.style === 'long') head += path(`M${P(-66, -300)} Q${P(-80, -400)} ${P(-10, -424)} Q${P(60, -428)} ${P(68, -370)} L${P(40, -380)} Q${P(-20, -392)} ${P(-40, -350)} L${P(-50, -290)} Z`, C.hair);
    else if (side) head += path(`M${P(-64, -326)} Q${P(-76, -412)} ${P(-4, -422)} Q${P(62, -426)} ${P(67, -370)} Q${P(44, -388)} ${P(16, -384)} Q${P(-12, -394)} ${P(-30, -370)} Q${P(-42, -350)} ${P(-64, -326)} Z`, C.hair);
    else head += path(`M${hx0 - 67},-350 Q${hx0 - 70},-424 ${hx0},-424 Q${hx0 + 70},-424 ${hx0 + 67},-350 Q${hx0 + 46},-388 ${hx0 + 8},-384 Q${hx0 - 30},-392 ${hx0 - 50},-372 Q${hx0 - 60},-362 ${hx0 - 67},-350 Z`, C.hair);
    if (p.hat === 'pilot') head += path(`M${hx0 - 70},-372 Q${hx0 - 70},-436 ${hx0},-436 Q${hx0 + 70},-436 ${hx0 + 70},-372 Z`, '#6E4616') + rect(hx0 - 46, -400, 34, 22, '#9FD3FF', { rx: 8 }) + rect(hx0 + 10, -400, 34, 22, '#9FD3FF', { rx: 8 });
    if (!faceless) {
      const fx = hx0 + 18 * dir * side, ey = -350, gap = side ? 25 : 27;
      const [bA, bY] = BROWS[p.brows] || BROWS.neutral;
      [fx - gap, fx + gap].forEach((cx, i) => {
        const inner = i === 0 ? 1 : -1, lx = p.look[0] * 3 + (side ? 2 * dir : 0), ly = p.look[1] * 3;
        if (p.eyes === 'closed') head += line(`M${f(cx - 9)},${ey} q9,7 18,0`, '#1A1530', 5);
        else if (p.eyes === 'half') head += ell(cx + lx, ey + 2, 8, 5, '#1A1530') + line(`M${f(cx - 11)},${ey - 3} h22`, C.skinD, 5);
        else if (p.eyes === 'wide') head += circ(cx, ey, 13, '#FFF8EA') + circ(cx + lx, ey + ly, 7, '#1A1530') + circ(cx + lx + 2.5, ey + ly - 2.5, 2.2, '#FFF8EA');
        else head += circ(cx + lx, ey + ly, 8.5, '#1A1530') + circ(cx + lx + 3, ey + ly - 3, 2.6, '#FFF8EA');
        head += line(`M${f(cx - 11)},${ey - 20 + bY} L${f(cx + 11)},${ey - 20 + bY}`, C.hair, 7, { transform: `rotate(${bA * inner},${f(cx)},${ey - 20 + bY})` });
      });
      if (p.blush) [fx - gap, fx + gap].forEach((cx) => (head += ell(cx, ey + 22, 11, 6, '#FF7A6E', { opacity: f(0.5 * p.blush) })));
      const mx = fx, my = -316;
      if (p.mouth === 'grin') head += path(`M${f(mx - 18)},${my - 6} q18,24 36,0 z`, '#1A1530') + path(`M${f(mx - 12)},${my - 4} q12,7 24,0 z`, '#FFF8EA');
      else if (p.mouth === 'o') head += ell(mx, my, 7, 9, '#1A1530');
      else if (p.mouth === 'open') head += path(`M${f(mx - 13)},${my - 4} q13,18 26,0 z`, '#1A1530');
      else if (p.mouth === 'sigh') head += ell(mx + 2 * dir, my, 9, 6, '#1A1530');
      else {
        const M = { flat: `M${f(mx - 12)},${my} h24`, smile: `M${f(mx - 15)},${my - 3} q15,13 30,0`, frown: `M${f(mx - 13)},${my + 4} q13,-11 26,0`, wavy: `M${f(mx - 15)},${my} q5,-5 10,0 t10,0 t10,0` };
        head += line(M[p.mouth] || M.flat, '#1A1530', 5);
      }
    }
    body += G(`rotate(${f(p.tilt * dir)},0,-290)`, head);
    body += arm(p.armL, -40, false, p.prop);
    g += G(`rotate(${f(p.lean * dir)},0,-140) translate(0,-140) scale(1,${f(1 + breath)}) translate(0,140)`, body);
    if (p.frost) g += G({ opacity: f(p.frost) }, path('M-70,-150 Q-75,-280 -30,-290 L30,-290 Q75,-280 70,-150 Z', '#CFEFFF', { opacity: 0.55 }) + circ(hx0, -352, 70, '#CFEFFF', { opacity: 0.4 }) + line('M-40,-200 l20,-20 m0,20 l-20,-20 M30,-180 l14,-14 m0,14 l-14,-14 M-10,-380 l16,-16 m0,16 l-16,-16', '#FFFFFF', 4));
    s += G(`translate(0,${f(bob + (p.sit ? 64 : 0))})`, g);
    return G({ transform: `translate(${f(p.x)},${f(p.y)}) scale(${f(p.s)})`, opacity: p.op < 1 ? f(p.op) : undefined }, s);
  }
  // blend two poses (numbers/arrays lerp; words switch halfway)
  const blend = (a, b, u) => F().mix(a, b, u);
  // pose keyframes: [[T, pose], ...]
  const at = (T, keys, e) => F().kf(T, keys, e || 'inOutCubic');
  window.HERO = { svg, blend, at, PAL };
})();
