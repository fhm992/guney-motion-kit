// YouTube thumbnails for a film made with the paper (--paper) or flat explainer (--flat) look. Approved style for a 30+
// audience: the video's own backgrounds and characters (calm, modest size), clean straight headlines, realistic job-search screens.
// Use: copy to assets/scenes/thumbnails.js, make compositions/thumbs.html from s00.html pointing at it (composition id "thumbs"),
// then: node ../../tools/qa/snap.mjs "compositions/thumbs.html#p1" thumbs qa/thumb-p1 0.5  and scale to 1280x720 with ffmpeg.
// 1920 x 1080, scaled to 1280 x 720 after. Pick a design with the URL hash: #p1 .. #p6 (p1-p3 light, p4-p6 dark).
(() => {
  const F = FILM, { G, tr, rect, circ, ell, path, line, text, f } = F;
  const id = (location.hash || '#p1').slice(1), c = { x: 960, y: 540, z: 1, r: 0 };
  const C = { cream: '#F3EEE6', paper: '#FFFFFF', ink: '#111827', inkS: '#4B5563', mute: '#9CA3AF', line: '#E5E7EB', amber: '#F5B83D', amberD: '#B7791F', teal: '#0F9F8F', green: '#16A34A', greenL: '#DCFCE7', red: '#DC2626', redL: '#FEE2E2', navy: '#0B1224', navy2: '#14203F', slate: '#1E293B', slate2: '#334155', cyan: '#38BDF8', violet: '#8B5CF6' };
  const DEFS = `<defs>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0B1224" flood-opacity="0.22"/></filter>
    <filter id="shd" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="20" stdDeviation="26" flood-color="#000000" flood-opacity="0.55"/></filter>
    <linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F3EC"/><stop offset="1" stop-color="#E9E2D6"/></linearGradient>
    <linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1224"/><stop offset="1" stop-color="#18264A"/></linearGradient>
    <radialGradient id="glowc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.45"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowa" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F5B83D" stop-opacity="0.45"/><stop offset="1" stop-color="#F5B83D" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#22C55E" stop-opacity="0.4"/><stop offset="1" stop-color="#22C55E" stop-opacity="0"/></radialGradient></defs>`;
  const T = (x, y, s, size, fill, o = {}) => text(x, y, s, Object.assign({ 'font-size': size, 'font-weight': o.w || 900, fill, 'letter-spacing': o.ls ?? -1 }, o.anchor ? { 'text-anchor': o.anchor } : {}));
  // headline block: lines [[text, colour], ...], left aligned
  const head = (x, y, lines, size, gap = 1.02) => lines.map(([s, col], i) => T(x, y + i * size * gap, s, size, col, { ls: -2 })).join('');
  const pill = (x, y, s, bg, fg, size = 40) => { const w = F.measure(s, size, 800) + size * 1.2; return rect(x, y - size * 1.05, w, size * 1.5, bg, { rx: size * 0.75 }) + T(x + size * 0.6, y, s, size, fg, { w: 800, ls: 0 }); };
  const card = (x, y, w, h, fill, rx = 22, filt = 'sh') => rect(x, y, w, h, fill, { rx, filter: `url(#${filt})` });
  const spark = (x, y, r, col) => path(`M${x},${y - r} Q${x + r * 0.16},${y - r * 0.16} ${x + r},${y} Q${x + r * 0.16},${y + r * 0.16} ${x},${y + r} Q${x - r * 0.16},${y + r * 0.16} ${x - r},${y} Q${x - r * 0.16},${y - r * 0.16} ${x},${y - r} Z`, col);
  const aiBadge = (x, y, s = 1, bg = C.violet) => G(tr(x, y, s), circ(0, 0, 54, bg) + spark(-6, 2, 30, '#FFFFFF') + spark(22, -24, 12, '#FFFFFF'));
  const check = (x, y, r, col) => circ(x, y, r, col) + line(`M${x - r * 0.45},${y} L${x - r * 0.1},${y + r * 0.38} L${x + r * 0.5},${y - r * 0.38}`, '#FFFFFF', r * 0.24);
  const cross = (x, y, r, col) => circ(x, y, r, col) + line(`M${x - r * 0.38},${y - r * 0.38} L${x + r * 0.38},${y + r * 0.38} M${x + r * 0.38},${y - r * 0.38} L${x - r * 0.38},${y + r * 0.38}`, '#FFFFFF', r * 0.22);
  const bar = (x, y, w, h, col) => rect(x, y, w, h, col, { rx: h / 2 });

  const D = {
    // ---- VIDEO 3 (light, editorial) ----
    // p1. USE AI TO GET HIRED: an inbox of rejections, one interview invitation on top
    p1: () => {
      let g = P.bg(1000, c, 'room', { seed: 3, fy: 1010 });
      const X = 930, Y = 120, W = 900, H = 840;
      g += card(X, Y, W, H, C.paper, 26) + rect(X, Y, W, 96, '#F9FAFB', { rx: 26 }) + rect(X, Y + 70, W, 26, '#F9FAFB') + T(X + 44, Y + 64, 'Inbox', 42, C.ink, { w: 800 }) + line(`M${X},${Y + 96} H${X + W}`, C.line, 3);
      const rows = [['Hiring Team', 'Interview invite: Thursday 10:00', true], ['Recruiting', 'Unfortunately, we have decided…'], ['Talent Team', 'Unfortunately, we have decided…'], ['HR', 'Unfortunately, the position…'], ['Careers', 'Unfortunately, we have decided…']];
      rows.forEach(([from, sub, good], i) => { const y = Y + 96 + i * 148;
        if (good) g += rect(X + 14, y + 12, W - 28, 124, C.greenL, { rx: 18 }) + rect(X + 14, y + 12, 10, 124, C.green, { rx: 5 });
        g += circ(X + 92, y + 74, 34, good ? C.green : '#E5E7EB') + T(X + 150, y + 62, from, 32, good ? C.ink : C.mute, { w: 800, ls: 0 }) + T(X + 150, y + 108, sub, good ? 34 : 32, good ? C.ink : C.mute, { w: good ? 900 : 700, ls: 0 });
        g += good ? check(X + W - 80, y + 74, 34, C.green) : cross(X + W - 80, y + 74, 28, '#F87171');
        if (i) g += line(`M${X + 40},${y} H${X + W - 40}`, C.line, 2); });
      g += head(110, 330, [['USE AI', C.ink], ['TO GET', C.ink], ['HIRED', C.amberD]], 190) + pill(116, 900, '11 proven ways', C.ink, '#FFFFFF', 44);
      return g;
    },
    // p2. FIND JOBS WITH AI: an AI chat that returns a target list of matching companies
    p2: () => {
      let g = P.bg(1000, c, 'sky', { seed: 8, fy: 1010 });
      const X = 860, Y = 110, W = 960, H = 860;
      g += card(X, Y, W, H, C.paper, 26) + T(X + 44, Y + 70, 'AI assistant', 36, C.inkS, { w: 800, ls: 0 }) + line(`M${X},${Y + 104} H${X + W}`, C.line, 3);
      g += rect(X + 260, Y + 140, W - 300, 130, C.slate, { rx: 28 }) + T(X + 300, Y + 196, 'List companies near me that', 36, '#FFFFFF', { w: 700, ls: 0 }) + T(X + 300, Y + 244, 'hire people with my skills.', 36, '#FFFFFF', { w: 700, ls: 0 });
      g += aiBadge(X + 90, Y + 360, 0.85);
      const jobs = [['Regional Clinic', 'Patient Support', '96%'], ['City Bank', 'Client Care Lead', '92%'], ['Logistics Co.', 'Customer Success', '89%'], ['Public School', 'Admin Coordinator', '85%']];
      jobs.forEach(([co, role, m], i) => { const y = Y + 310 + i * 128;
        g += rect(X + 170, y, W - 210, 108, '#F9FAFB', { rx: 18, stroke: C.line, 'stroke-width': 2 }) + rect(X + 196, y + 24, 60, 60, ['#DBEAFE', '#FEF3C7', '#DCFCE7', '#EDE9FE'][i], { rx: 14 }) + T(X + 280, y + 48, co, 34, C.ink, { w: 900, ls: 0 }) + T(X + 280, y + 88, role, 30, C.inkS, { w: 700, ls: 0 }) + rect(X + W - 210, y + 30, 150, 52, C.greenL, { rx: 26 }) + T(X + W - 135, y + 68, m + ' match', 28, C.green, { w: 900, ls: 0, anchor: 'middle' }); });
      g += head(110, 360, [['FIND', C.ink], ['JOBS', C.ink], ['WITH AI', C.teal]], 200) + pill(116, 940, 'Step-by-step prompts', C.ink, '#FFFFFF', 42);
      return g;
    },
    // p3. 11 AI PROMPTS TO GET HIRED: a real prompt in a clean chat window
    p3: () => {
      let g = P.bg(1000, c, 'teal', { seed: 11, fy: 1010 });
      const X = 1010, Y = 130, W = 830, H = 820;
      g += card(X, Y, W, H, C.slate, 28, 'shd') + circ(X + 44, Y + 44, 11, '#F87171') + circ(X + 78, Y + 44, 11, '#FBBF24') + circ(X + 112, Y + 44, 11, '#4ADE80');
      g += rect(X + 200, Y + 110, W - 240, 250, C.amber, { rx: 30 }) + [['Look at this job post.', 0], ['Tell me the 5 skills they', 1], ['care about most.', 2]].map(([s, k]) => T(X + 240, Y + 180 + k * 64, s, 42, C.ink, { w: 800, ls: 0 })).join('');
      g += aiBadge(X + 80, Y + 440, 0.75, C.violet) + rect(X + 160, Y + 400, W - 200, 360, C.slate2, { rx: 30 });
      ['1. Customer care', '2. Excel', '3. Clear writing', '4. CRM tools', '5. Teamwork'].forEach((s, k) => (g += T(X + 210, Y + 466 + k * 62, s, 42, '#E5E7EB', { w: 700, ls: 0 })));
      g += head(110, 290, [['11 AI', C.ink], ['PROMPTS', C.amberD], ['TO GET', C.ink], ['HIRED', C.ink]], 150) + pill(116, 960, 'Copy, paste, apply', C.ink, '#FFFFFF', 44);
      return g;
    },
    // ---- VIDEO 4 (dark, modern) ----
    // p4. GET HIRED FASTER WITH AI: a job-offer notification on a phone
    p4: () => {
      let g = P.bg(1000, c, 'dusk', { seed: 22, fy: 1010 }) + ell(1380, 520, 620, 620, 'url(#glowg)');
      const X = 1130, Y = 70, W = 500, H = 1000;
      g += rect(X, Y, W, H, '#05070F', { rx: 70, filter: 'url(#shd)' }) + rect(X + 18, Y + 18, W - 36, H - 36, '#101A33', { rx: 56 }) + T(X + W / 2, Y + 210, '9:41', 120, '#FFFFFF', { w: 700, anchor: 'middle', ls: 0 }) + T(X + W / 2, Y + 270, 'Tuesday', 36, '#94A3B8', { w: 700, anchor: 'middle', ls: 0 });
      const n = (y, title, sub, hl) => rect(X + 36, y, W - 72, 150, hl ? '#FFFFFF' : 'rgba(255,255,255,0.12)', { rx: 30 }) + rect(X + 64, y + 34, 56, 56, hl ? C.green : '#475569', { rx: 14 }) + T(X + 140, y + 64, title, 30, hl ? C.ink : '#CBD5E1', { w: 900, ls: 0 }) + T(X + 140, y + 108, sub, 28, hl ? C.inkS : '#94A3B8', { w: 700, ls: 0 });
      g += n(Y + 360, 'Job Offer 🎉'.replace(' 🎉', ''), 'We’d love you to join…', true) + n(Y + 530, 'Interview tomorrow', 'Thursday at 10:00', false) + n(Y + 700, 'New message', 'Thanks for reaching out!', false);
      g += check(X + W - 80, Y + 400, 30, C.green);
      g += head(110, 330, [['GET HIRED', '#FFFFFF'], ['FASTER', C.amber], ['WITH AI', '#FFFFFF']], 170) + pill(116, 900, '11 ways that work', C.amber, C.navy, 44);
      return g;
    },
    // p5. FIND THE RIGHT JOBS WITH AI: a recruiter search where your profile ranks first
    p5: () => {
      let g = P.bg(1000, c, 'dusk', { seed: 5, fy: 1010 }) + ell(1360, 380, 640, 520, 'url(#glowc)');
      const X = 1000, Y = 140, W = 840;
      g += rect(X, Y, W, 110, '#FFFFFF', { rx: 55, filter: 'url(#shd)' }) + circ(X + 70, Y + 55, 22, 'none', { stroke: C.inkS, 'stroke-width': 7 }) + line(`M${X + 86},${Y + 71} l20,20`, C.inkS, 7) + T(X + 130, Y + 72, 'customer support lead', 44, C.ink, { w: 800, ls: 0 });
      const rows = [['YOU', 'Customer Support Lead · CRM', true], ['Candidate', 'Looking for opportunities'], ['Candidate', 'Open to work'], ['Candidate', 'Hard-working team player']];
      rows.forEach(([nm, sub, top], i) => { const y = Y + 170 + i * 175;
        g += rect(X, y, W, 150, top ? '#FFFFFF' : 'rgba(255,255,255,0.08)', { rx: 26, filter: top ? 'url(#shd)' : undefined, stroke: top ? C.cyan : 'none', 'stroke-width': top ? 6 : 0 });
        g += circ(X + 80, y + 75, 44, top ? C.cyan : '#334155') + T(X + 150, y + 66, nm, 38, top ? C.ink : '#94A3B8', { w: 900, ls: 0 }) + T(X + 150, y + 112, sub, 30, top ? C.inkS : '#64748B', { w: 700, ls: 0 });
        if (top) g += rect(X + W - 230, y + 46, 190, 58, C.cyan, { rx: 29 }) + T(X + W - 135, y + 86, 'TOP MATCH', 28, C.navy, { w: 900, ls: 0, anchor: 'middle' }); });
      g += head(100, 330, [['GET FOUND.', '#FFFFFF'], ['GET HIRED.', C.cyan], ['USE AI.', '#FFFFFF']], 136) + pill(116, 860, 'Recruiters search keywords', 'rgba(255,255,255,0.12)', '#E2E8F0', 40);
      return g;
    },
    // p6. 11 WAYS TO USE AI TO GET HIRED: a stack of prompt cards, a big 11
    p6: () => {
      let g = P.bg(1000, c, 'room', { seed: 40, fy: 1010 }) + ell(1350, 560, 640, 640, 'url(#glowa)');
      const tips = ['Decode the job post', 'Match the right words', 'Turn duties into results', 'Write a cover letter like you', 'Message a real person'];
      tips.forEach((s, i) => { const y = 170 + i * 165, x = 1010 + i * 18;
        g += rect(x, y, 810, 140, i === 4 ? '#FFFFFF' : '#1E293B', { rx: 26, filter: 'url(#shd)', stroke: i === 4 ? C.amber : '#334155', 'stroke-width': i === 4 ? 6 : 2 }) + circ(x + 74, y + 70, 40, i === 4 ? C.amber : '#334155') + T(x + 74, y + 86, String([1, 2, 3, 4, 7][i]), 44, i === 4 ? C.navy : '#E2E8F0', { w: 900, anchor: 'middle', ls: 0 }) + T(x + 140, y + 86, s, 42, i === 4 ? C.ink : '#E2E8F0', { w: 800, ls: 0 }); });
      g += T(100, 520, '11', 420, C.amber, { ls: -20 }) + head(110, 690, [['WAYS TO USE AI', '#FFFFFF'], ['TO GET HIRED', '#FFFFFF']], 110) + pill(116, 980, 'Most people skip #7', 'rgba(255,255,255,0.12)', C.amber, 40);
      return g;
    },
  };
  // the cast, calm and modest in size (drawn last, placed clear of the headline)
  const who = (pal, x, y, s, face, extra = {}) => P.ch(Object.assign({ pal, x, y, s, face, brows: 'happy', mouth: 'smile', blink: false, seed: pal === 'maya' ? 3 : 1 }, extra), 1000);
  const CAST = {
    p1: () => who('maya', 850, 1080, 0.95, 1, { look: [1, -1] }),
    p2: () => who('maya', 880, 1150, 0.8, 1, { look: [1, -1], armL: [110, -10], prop: J.glass(0, 0, 0.8, 20) }),
    p3: () => who('sam', 900, 1090, 0.95, 1, { look: [1, -1], armL: [92, -6] }),
    p4: () => who('maya', 1770, 1090, 0.95, -1, { look: [-1, -1] }),
    p5: () => who('maya', 780, 1090, 0.85, 1, { look: [1, -1] }),
    p6: () => '',
  };
  const draw0 = D[id] || D.p1, draw = () => draw0() + (CAST[id] ? CAST[id]() : '');
  F.run({ id: 'thumbs', start: 0, end: 1, shots: [{ a: 0, b: 1, cam: [[0, c], [1, c]], drift: 0, draw: () => DEFS + G('', draw()) }], zoomOut: false, zoomIn: false, vignette: '' });
})();
