// thumbnails in the bright palette (blue, red, yellow, green, white, orange) on cream paper
(() => {
  const F = FILM.boot();
  const { C, P, T, K } = F;
  const BLUE = C.blue, BLUED = C.blueDark, RED = C.tomato, YEL = C.gold, GRN = C.sage, OR = C.orange, INK = C.ink;
  const youLook = { top: BLUE, top2: BLUED };
  const word = (layer, html, x, y, size, color = BLUE, shadow = INK) => {
    const l = F.label(layer, html, x, y, { size, font: "'Archivo Black'", weight: 400, bg: 'none', flat: true, color, z: 20 });
    l.box.style.lineHeight = '0.95'; l.box.style.textShadow = `7px 7px 0 ${shadow}`; return l;
  };
  const strip = (layer, html, x, y, size, bg, color, rot) => F.label(layer, html, x, y, { size, font: "'Archivo Black'", weight: 400, bg, color, rot, pad: `${size * 0.1}px ${size * 0.26}px`, z: 21 });
  const recolorShield = (sh) => sh.el.querySelectorAll('rect').forEach((r) => { if (r.getAttribute('fill') === '#1E2A44') r.setAttribute('fill', BLUE); });

  // ===== 1: PROTECT YOUR JOB FROM AI =====
  {
    const S = F.shot(0, 1, { cam: [960, 540, 1], drift: 0 });
    F.prop(S.back, `<circle r="520" fill="${YEL}" opacity=".35"/>`, 1430, 620, 1100, 1100, 1);
    F.puppet(S, S.mid, 'you', 1380, 1820, 4.6, { mood: 'shock', sweat: true, z: 3, look: youLook });
    F.prop(S.mid, `<g stroke="${OR}" stroke-width="16" stroke-linecap="round"><path d="M-40 -70 L-10 -10"/><path d="M40 -80 L20 -10"/><path d="M110 -40 L60 10"/></g>`, 1640, 140, 300, 220, 6);
    F.puppet(S, S.mid, 'intern', 1910, 1130, 2.3, { mood: 'twitch', armL: 'fwd', z: 7 });
    F.prop(S.mid, `<g transform="rotate(-130) scale(2.2)">${K.scissors()}</g>`, 1640, 1000, 420, 420, 8);
    word(S.ui, 'PROTECT', 540, 190, 180);
    strip(S.ui, 'YOUR JOB', 540, 440, 165, RED, C.white, -2.5);
    word(S.ui, 'FROM AI', 520, 700, 190);
  }

  // ===== 2: AI CAN'T TAKE YOUR JOB =====
  {
    const S = F.shot(1, 2, { cam: [960, 540, 1], drift: 0 });
    F.prop(S.back, `<circle r="520" fill="${GRN}" opacity=".22"/>`, 1400, 560, 1100, 1100, 1);
    F.puppet(S, S.mid, 'you', 1250, 1700, 3.9, { mood: 'happy', armL: 'hip', armR: 'up', z: 3, look: youLook });
    recolorShield(F.shield(S.mid, 1560, 760, 0.95, 9, 6));
    const ai = F.puppet(S, S.mid, 'intern', 1760, 640, 1.2, { mood: 'shock', armL: 'up', armR: 'up', z: 7 });
    ai.root.style.transform = 'rotate(22deg)';
    F.prop(S.mid, `<g stroke="${OR}" stroke-width="12" stroke-linecap="round"><path d="M-30 30 L-80 70"/><path d="M0 40 L0 100"/><path d="M30 30 L80 70"/></g>`, 1700, 470, 220, 160, 8);
    word(S.ui, "AI CAN'T", 530, 210, 180, RED, '#8E1B12');
    word(S.ui, 'TAKE', 530, 440, 190);
    strip(S.ui, 'YOUR JOB', 540, 690, 160, GRN, C.white, -2);
  }

  // ===== 3: HOW TO SAVE YOUR JOB FROM AI =====
  {
    const S = F.shot(2, 3, { cam: [960, 540, 1], drift: 0 });
    F.set(S.back, `<rect x="-40" y="930" width="2000" height="300" fill="${C.paper2}" filter="url(#cutflat)"/>`);
    F.prop(S.back, `<circle r="460" fill="${OR}" opacity=".22"/>`, 1480, 560, 1000, 1000, 1);
    F.puppet(S, S.mid, 'you', 1210, 1360, 2.3, { mood: 'angry', armR: 'high', z: 4, look: youLook });
    F.puppet(S, S.mid, 'intern', 1773, 1180, 1.9, { mood: 'twitch', armL: 'high', z: 4 });
    F.prop(S.mid, `<g filter="url(#cut)" transform="rotate(-4) scale(.78)"><path d="M-200 -120 L10 -120 L-12 -40 L14 30 L-8 120 L-200 120Z" fill="${C.white}"/><path d="M30 -120 L200 -120 L200 120 L22 120 L44 30 L18 -40Z" fill="${C.white}"/>${T('YOUR', -100, -16, 64, BLUE)}${T('JOB', 110, -16, 64, BLUE)}<rect x="-170" y="30" width="150" height="14" fill="${C.grey}"/><rect x="50" y="30" width="130" height="14" fill="${C.grey}"/></g>`, 1590, 680, 460, 300, 3);
    F.prop(S.mid, `<g stroke="${OR}" stroke-width="10" stroke-linecap="round"><path d="M-20 -40 l-40 -30"/><path d="M-20 0 l-50 0"/><path d="M-20 40 l-40 30"/></g>`, 1350, 560, 140, 160, 6);
    word(S.ui, 'HOW TO', 500, 150, 120, OR, '#9A4A00');
    word(S.ui, 'SAVE', 500, 370, 230);
    strip(S.ui, 'YOUR JOB', 510, 620, 150, RED, C.white, -2.5);
    word(S.ui, 'FROM AI', 500, 850, 150);
  }
  F.done();
})();
