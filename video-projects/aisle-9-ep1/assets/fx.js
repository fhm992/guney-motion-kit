// fx.js: cinematic layers for AISLE 9, drawn over (or into) the world canvas each frame. Deterministic.
//   const F = FX.make(layerEl, { mood, dust: 60, beams: true, grade: 'red', vignette: .5 })
//   F.draw(t, cam, world)   (call after world.render)
(function () {
  const S = STAGE;
  const GRADES = { // [shadow tint, highlight tint, strength]
    day: ['rgba(40,20,60,0.10)', 'rgba(255,220,170,0.10)'], night: ['rgba(10,20,60,0.35)', 'rgba(120,160,255,0.08)'],
    red: ['rgba(60,0,0,0.40)', 'rgba(255,60,40,0.12)'], gray: ['rgba(20,30,45,0.30)', 'rgba(200,215,230,0.08)'],
    ice: ['rgba(10,60,100,0.18)', 'rgba(200,245,255,0.16)'], warm: ['rgba(40,15,0,0.25)', 'rgba(255,190,110,0.16)'], lot: ['rgba(5,10,30,0.45)', 'rgba(255,200,120,0.08)'],
  };
  function make(layer, o = {}) {
    const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; c.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;mix-blend-mode:screen';
    layer.appendChild(c); const ctx = c.getContext('2d');
    const grade = document.createElement('div'); grade.style.cssText = 'position:absolute;inset:0;pointer-events:none'; layer.appendChild(grade);
    const vign = document.createElement('div'); vign.style.cssText = `position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 48%,rgba(0,0,0,0) 52%,rgba(0,0,0,${o.vignette == null ? 0.5 : o.vignette}) 100%)`; layer.appendChild(vign);
    const G = GRADES[o.grade || o.mood || 'day'];
    grade.style.background = `linear-gradient(180deg, ${G[1]} 0%, rgba(0,0,0,0) 45%, ${G[0]} 100%)`; grade.style.mixBlendMode = 'normal';
    const r = S.mulberry32(o.seed || 11), motes = Array.from({ length: o.dust == null ? 70 : o.dust }, () => ({ x: r() * 1920, y: r() * 1080, s: 1 + r() * 2.6, v: 4 + r() * 14, ph: r() * 6.28, a: 0.15 + r() * 0.35 }));
    const MOODCOL = { red: '255,70,50', ice: '220,248,255', night: '150,180,255', gray: '210,220,235', warm: '255,200,130', day: '255,240,210' };
    const lightCol = o.lightColor || MOODCOL[o.mood] || '255,240,210';
    return {
      el: c, grade, vign,
      draw(t, cam, world, extra = {}) {
        ctx.clearRect(0, 0, 1920, 1080);
        // god-ray beams from ceiling lights down to the floor
        if (o.beams && world && cam) {
          const C = WORLD.camera(cam);
          world.lights.forEach(([x, y, z], i) => {
            const top = C.toCam(x, y, z), bot = C.toCam(x + (o.beamSlant || 0.3), 0, z + 0.4); if (top[2] < 0.4 || bot[2] < 0.4 || top[2] > (o.beamMax || 11)) return;
            const [tx, ty] = C.proj(top), [bx, by] = C.proj(bot), wt = C.f / top[2] * 0.5, wb = C.f / bot[2] * 1.1;
            if (Math.max(tx, bx) < -wb || Math.min(tx, bx) > 1920 + wb) return;
            const fl = o.flicker ? (S.hash(Math.floor(t * 12) + i * 31) > 0.9 ? 0.3 : 1) : 1;
            const g = ctx.createLinearGradient(tx, ty, bx, by); g.addColorStop(0, `rgba(${lightCol},${0.11 * fl * (o.beamK || 1) * Math.max(0.25, 1 - top[2] / (o.beamMax || 11))})`); g.addColorStop(1, `rgba(${lightCol},0)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(tx - wt, ty); ctx.lineTo(tx + wt, ty); ctx.lineTo(bx + wb, by); ctx.lineTo(bx - wb, by); ctx.closePath(); ctx.fill();
            // floor glint under the light
            const fp = C.toCam(x, 0, z + 0.6); if (fp[2] > 0.5) { const [gx, gy] = C.proj(fp), gr = C.f / fp[2] * 0.9; const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr); gg.addColorStop(0, `rgba(${lightCol},${0.22 * fl})`); gg.addColorStop(1, `rgba(${lightCol},0)`); ctx.save(); ctx.translate(gx, gy); ctx.scale(1.6, 0.35); ctx.translate(-gx, -gy); ctx.fillStyle = gg; ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); ctx.restore(); }
            // anamorphic lens streak on the light itself
            if (o.flares !== false && top[2] < 9) { const a = 0.35 * fl * (1 - top[2] / 9); const sg = ctx.createLinearGradient(tx - 500, 0, tx + 500, 0); sg.addColorStop(0, `rgba(${lightCol},0)`); sg.addColorStop(0.5, `rgba(${lightCol},${a})`); sg.addColorStop(1, `rgba(${lightCol},0)`); ctx.fillStyle = sg; ctx.fillRect(tx - 500, ty - 2, 1000, 4); }
          });
        }
        // spinning emergency beacon sweep
        if (o.beacon) { const ang = t * 4.2, cx = o.beacon[0], cy = o.beacon[1]; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); const bg = ctx.createLinearGradient(0, 0, 1400, 0); bg.addColorStop(0, 'rgba(255,40,30,0.38)'); bg.addColorStop(1, 'rgba(255,40,30,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -260); ctx.lineTo(1400, 260); ctx.closePath(); ctx.fill(); ctx.restore(); }
        // dust motes drifting in the light
        motes.forEach((m) => { const x = (m.x + Math.sin(t * 0.3 + m.ph) * 40 + t * m.v * 0.6) % 1960 - 20, y = (m.y + t * m.v * 0.35 + Math.cos(t * 0.4 + m.ph) * 20) % 1100 - 10; ctx.fillStyle = `rgba(${lightCol},${m.a * (o.dustK || 1)})`; ctx.beginPath(); ctx.arc(x, y, m.s, 0, 7); ctx.fill(); });
        // haze near the floor / fog bands
        if (o.haze) { const hg = ctx.createLinearGradient(0, 600, 0, 1080); hg.addColorStop(0, `rgba(${o.haze},0)`); hg.addColorStop(1, `rgba(${o.haze},${o.hazeK || 0.25})`); ctx.fillStyle = hg; ctx.fillRect(0, 600, 1920, 480); }
        if (extra.flash) { ctx.fillStyle = `rgba(255,255,255,${extra.flash})`; ctx.fillRect(0, 0, 1920, 1080); }
      },
    };
  }
  window.FX = { make, GRADES };
})();
