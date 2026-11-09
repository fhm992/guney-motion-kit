// props.js: set pieces shared by the job scenes (HTML strings, absolutely positioned in layer coordinates).
(function () {
  const G = FILM.G, GC = FILM.GC;
  const P = {
    // a friendly AI robot: rounded head with a screen face, antenna, small body
    robot(x, y, s = 1, col = G.b, cls = '') {
      return `<div class="fl-a robot ${cls}" style="left:${x}px;top:${y}px;width:${200 * s}px;height:${260 * s}px">
        <div style="position:absolute;left:${92 * s}px;top:0;width:${16 * s}px;height:${36 * s}px;background:#9aa0a6;border-radius:${8 * s}px"></div>
        <div style="position:absolute;left:${82 * s}px;top:${-14 * s}px;width:${36 * s}px;height:${36 * s}px;border-radius:50%;background:${col};box-shadow:0 0 ${24 * s}px ${col}"></div>
        <div style="position:absolute;left:0;top:${30 * s}px;width:${200 * s}px;height:${150 * s}px;border-radius:${46 * s}px;background:linear-gradient(160deg,#eef1f6,#aab2c0);box-shadow:0 ${14 * s}px ${30 * s}px rgba(0,0,0,.45)">
          <div style="position:absolute;left:${18 * s}px;top:${18 * s}px;right:${18 * s}px;bottom:${18 * s}px;border-radius:${32 * s}px;background:#0d1424;box-shadow:inset 0 0 ${20 * s}px ${col}66">
            <div class="eye" style="position:absolute;left:${38 * s}px;top:${36 * s}px;width:${22 * s}px;height:${36 * s}px;border-radius:${11 * s}px;background:${col};box-shadow:0 0 ${14 * s}px ${col}"></div>
            <div class="eye" style="position:absolute;right:${38 * s}px;top:${36 * s}px;width:${22 * s}px;height:${36 * s}px;border-radius:${11 * s}px;background:${col};box-shadow:0 0 ${14 * s}px ${col}"></div></div></div>
        <div style="position:absolute;left:${40 * s}px;top:${186 * s}px;width:${120 * s}px;height:${74 * s}px;border-radius:${24 * s}px;background:linear-gradient(160deg,#dfe3ea,#8d95a3)"></div></div>`;
    },
    bubble(x, y, text, col, size = 34, cls = '', tail = 'left') {
      const r = tail === 'left' ? '30px 30px 30px 6px' : '30px 30px 6px 30px';
      return `<div class="fl-a bub ${cls}" style="left:${x}px;top:${y}px;padding:${size * 0.55}px ${size * 0.85}px;border-radius:${r};background:${col};font:800 ${size}px Figtree;color:#fff;white-space:nowrap;box-shadow:0 0 ${size}px ${col}88">${text}</div>`;
    },
    // device screens: kind = phone | tablet | laptop
    device(x, y, kind, s = 1, inner = '', cls = '') {
      const [w, h, r] = kind === 'phone' ? [120, 230, 22] : kind === 'tablet' ? [220, 290, 20] : [340, 220, 12];
      return `<div class="fl-a dev ${cls}" style="left:${x}px;top:${y}px;width:${w * s}px;height:${h * s}px;border-radius:${r * s}px;background:#1d2230;border:${6 * s}px solid #2c3242;box-shadow:0 ${12 * s}px ${30 * s}px rgba(0,0,0,.5);overflow:hidden">${inner}</div>`;
    },
    loginUI(s = 1) {
      return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#f8fafd,#e8eef8);padding:${18 * s}px;box-sizing:border-box">
        <div style="width:${40 * s}px;height:${40 * s}px;border-radius:50%;background:${G.b};margin:${6 * s}px auto ${16 * s}px"></div>
        <div style="height:${16 * s}px;background:#dfe5ee;border-radius:${8 * s}px;margin-bottom:${10 * s}px"></div><div style="height:${16 * s}px;background:#dfe5ee;border-radius:${8 * s}px;margin-bottom:${14 * s}px"></div>
        <div style="height:${24 * s}px;background:${G.b};border-radius:${12 * s}px"></div></div>`;
    },
    globe(x, y, d, cls = '') {
      let lines = '';
      for (let i = 1; i < 6; i++) lines += `<div style="position:absolute;left:0;right:0;top:${(i * d) / 6}px;height:2px;background:rgba(138,180,248,.35)"></div>`;
      for (let i = 0; i < 6; i++) lines += `<div class="mer" data-i="${i}" style="position:absolute;top:0;bottom:0;left:50%;width:${d}px;margin-left:${-d / 2}px;border-radius:50%;border:2px solid rgba(138,180,248,.35)"></div>`;
      let land = ''; [[0.2, 0.3, 0.28, 0.2], [0.55, 0.25, 0.22, 0.3], [0.35, 0.62, 0.3, 0.18], [0.7, 0.6, 0.18, 0.22]].forEach(([a, b, w, h], i) => land += `<div class="land" data-i="${i}" style="position:absolute;left:${a * d}px;top:${b * d}px;width:${w * d}px;height:${h * d}px;border-radius:40% 60% 50% 45%;background:${G.g};opacity:.75"></div>`);
      return `<div class="fl-a ${cls}" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 35% 30%,#3f7be8,#123a8a 60%,#071a3f);box-shadow:0 0 120px rgba(66,133,244,.6),inset -40px -40px 80px rgba(0,0,0,.5)"><div class="landwrap" style="position:absolute;inset:0">${land}</div>${lines}</div>`;
    },
    funnel(x, y, w, cls = '') {
      return `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 0.9}px">${[G.b, G.r, G.y, G.g].map((c, i) => `<div style="position:absolute;left:${i * w * 0.1}px;top:${i * w * 0.2}px;width:${w - i * w * 0.2}px;height:${w * 0.17}px;background:${c};clip-path:polygon(0 0,100% 0,${100 - 6}% 100%,6% 100%);border-radius:6px;box-shadow:0 0 30px ${c}66"></div>`).join('')}</div>`;
    },
    calendar(x, y, s = 1, cls = '') {
      let cells = ''; for (let i = 0; i < 20; i++) cells += `<div class="cal" style="width:${48 * s}px;height:${38 * s}px;border-radius:${6 * s}px;background:rgba(255,255,255,.08)"></div>`;
      return `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${300 * s}px;padding:${16 * s}px;border-radius:${18 * s}px;background:#f4f6fa;box-shadow:0 20px 50px rgba(0,0,0,.5)"><div style="height:${34 * s}px;border-radius:${8 * s}px;background:${G.r};margin-bottom:${12 * s}px"></div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:${6 * s}px;background:#dfe5ee;padding:${6 * s}px;border-radius:${8 * s}px">${cells}</div></div>`;
    },
    shield(x, y, s = 1, col = G.g, cls = '') {
      return `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${240 * s}px;height:${280 * s}px;background:linear-gradient(160deg,${col},#0b3d1c);clip-path:polygon(50% 0,100% 15%,92% 60%,50% 100%,8% 60%,0 15%);filter:drop-shadow(0 0 30px ${col})">
        <div style="position:absolute;left:${80 * s}px;top:${110 * s}px;width:${80 * s}px;height:${70 * s}px;border-radius:${10 * s}px;background:#fff"></div><div style="position:absolute;left:${94 * s}px;top:${70 * s}px;width:${52 * s}px;height:${60 * s}px;border-radius:${26 * s}px ${26 * s}px 0 0;border:${12 * s}px solid #fff;border-bottom:none;box-sizing:border-box"></div></div>`;
    },
    page(x, y, s = 1, cls = '', mark = '') {
      return `<div class="fl-a page ${cls}" style="left:${x}px;top:${y}px;width:${150 * s}px;height:${196 * s}px;background:#f6f4ef;border-radius:${6 * s}px;box-shadow:0 10px 24px rgba(0,0,0,.4);padding:${14 * s}px;box-sizing:border-box">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<div class="ln" style="height:${8 * s}px;width:${55 + ((i * 29) % 40)}%;background:${mark && i === 3 ? mark : '#cfd3da'};border-radius:4px;margin-top:${10 * s}px"></div>`).join('')}</div>`;
    },
    bars(x, y, vals, cols, w = 70, gap = 26, hmax = 380, cls = '') {
      return `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${vals.length * (w + gap)}px;height:${hmax}px">${vals.map((v, i) => `<div class="bar" data-v="${v}" style="position:absolute;left:${i * (w + gap)}px;bottom:0;width:${w}px;height:${v * hmax}px;border-radius:10px 10px 0 0;background:linear-gradient(180deg,${cols[i % cols.length]},${cols[i % cols.length]}55);transform-origin:50% 100%;box-shadow:0 0 30px ${cols[i % cols.length]}55"></div>`).join('')}</div>`;
    },
    check: (x, y, s = 1, col = G.g, cls = '') => `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${60 * s}px;height:${60 * s}px;border-radius:50%;background:${col};box-shadow:0 0 ${20 * s}px ${col}"><div style="position:absolute;left:${17 * s}px;top:${13 * s}px;width:${16 * s}px;height:${28 * s}px;border:solid #fff;border-width:0 ${7 * s}px ${7 * s}px 0;transform:rotate(40deg)"></div></div>`,
    cross: (x, y, s = 1, cls = '') => `<div class="fl-a ${cls}" style="left:${x}px;top:${y}px;width:${60 * s}px;height:${60 * s}px;border-radius:50%;background:${G.r};box-shadow:0 0 ${20 * s}px ${G.r}"><div style="position:absolute;left:${27 * s}px;top:${12 * s}px;width:${7 * s}px;height:${36 * s}px;background:#fff;transform:rotate(45deg)"></div><div style="position:absolute;left:${27 * s}px;top:${12 * s}px;width:${7 * s}px;height:${36 * s}px;background:#fff;transform:rotate(-45deg)"></div></div>`,
    desk: (x, y, w, col = '#1d2433') => `<div class="fl-a" style="left:${x}px;top:${y}px;width:${w}px;height:420px;background:linear-gradient(180deg,${col},#07090e);border-radius:8px;border-top:5px solid #2e3850"></div>`,
    win: (x, y, w, h, sky, city) => `<div class="fl-a" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:14px solid #141826;border-radius:8px;overflow:hidden;background:${sky}">${city || ''}</div>`,
  };
  // pop-in helper: element appears at time a (program time) with a small overshoot
  P.pop = (n, T, a, from = 0.4) => { const u = STAGE.clamp((T - a) / 0.35); const e = u >= 1 ? 1 : STAGE.E.outBack(u); n.style.opacity = Math.min(1, u * 2).toFixed(2); n.style.transform = `scale(${(from + (1 - from) * e).toFixed(3)})`; };
  window.PROPS = P;
})();
