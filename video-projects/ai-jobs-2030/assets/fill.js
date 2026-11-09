// fill.js: fills the empty parts of every shot. (1) Beat icons: a stressed word with a matching icon pops into a free
// area of the frame, floats and fades. (2) Ambient pieces: a few themed floating objects in the larger free areas.
// Free areas per shot come from tools/freecells.py (assets/free.js). Switched off with #nofill.
(function () {
  const ICON = {
    linkedin: '💼', feed: '📱', morning: '🌅', company: '🏢', workers: '👷', software: '💾', update: '🔄', job: '💼', jobs: '💼', boss: '👔', team: '👥',
    document: '📝', task: '✅', spreadsheet: '📊', quiet: '🤫', loud: '📢', erase: '🧽', '2030': '📅', role: '🧑‍💼', switch: '🔀', prompts: '⌨️', prompt: '⌨️', jump: '🚀',
    data: '📊', clerk: '🗂️', optical: '👁️', recognition: '🔎', automated: '⚙️', agents: '🤖', numbers: '🔢', invoices: '🧾', receipts: '🧾', pdf: '📄', files: '📁',
    databases: '🗄️', database: '🗄️', seconds: '⏱️', typos: '❌', ai: '🤖', tired: '😴', afternoon: '🕓', rows: '📋', excel: '📗', cutting: '✂️', typing: '⌨️', first: '🥇',
    quality: '🏅', analyst: '🧑‍💻', audits: '🔍', weird: '🧩', edge: '📐', cases: '🗃️', machine: '⚙️', fixes: '🔧', broken: '🛠️', pipelines: '🔗', prepare: '🎯', dirty: '🧹',
    cleaning: '🧽', rules: '📏', chatgpt: '💬', claude: '💬', open: '🖥️', senior: '🎖️', sample: '🧪', table: '📋', customer: '🙋', records: '🗂️', missing: '❓', duplicate: '📑',
    formatting: '🔤', steps: '🪜', manager: '👩‍💼', check: '☑️', practice: '🏋️', workflow: '🔁', week: '🗓️', interview: '🎙️', support: '🎧', rep: '🎧', voice: '🗣️', chat: '💬',
    password: '🔑', resets: '🔑', shipping: '📦', questions: '❓', refund: '💸', requests: '📨', instantly: '⚡', languages: '🌍', '40': '🌍', world: '🌐', economic: '📈',
    forum: '🏛️', million: '📈', repetitive: '🔁', fading: '📉', growing: '🌱', systems: '🧠', success: '🏆', conversation: '💬', designer: '🎨', angry: '😠', clients: '🤝',
    trains: '🧑‍🏫', bots: '🤖', human: '🧑', ticket: '🎫', history: '📜', training: '🏋️', portfolio: '🗂️', complaints: '😤', decision: '🌳', tree: '🌳', empathetic: '💗',
    templates: '🧩', trigger: '🎯', words: '🔤', agent: '🧑‍💻', save: '💾', profile: '🪪', automation: '⚙️', junior: '🌱', copywriter: '✍️', marketing: '📣', writers: '✍️',
    hours: '⏳', drafting: '📝', '500': '📝', generic: '📄', blog: '📰', posts: '📰', product: '🛍️', descriptions: '🏷️', language: '🗣️', models: '🧠', drafts: '📝',
    intern: '🧑‍🎓', website: '🌐', earth: '🌎', zero: '0️⃣', original: '💡', ideas: '💡', stories: '📖', content: '🧱', strategist: '♟️', brand: '🏷️', editor: '🖊️',
    funnel: '🔻', experts: '🎤', convert: '🔄', buyers: '🛒', strategy: '♟️', chief: '👑', officer: '👔', hooks: '🪝', robotic: '🤖', proof: '🧾', calendar: '📅',
    case: '📚', studies: '📚', seo: '🔍', keywords: '🔑', fake: '🎭', bookkeeper: '📒', accounting: '🧮', platforms: '🖥️', bank: '🏦', transactions: '💳', match: '🧩',
    reconcile: '⚖️', monthly: '🗓️', statements: '📄', friday: '📆', financial: '💹', cash: '💵', flow: '🌊', advisor: '🧭', local: '📍', business: '🏪', owners: '🧑‍💼',
    balanced: '⚖️', account: '🏦', tight: '🪢', balance: '⚖️', sheets: '📑', plain: '🗣️', english: '🇬🇧', advice: '💡', pay: '💰', profit: '📈', loss: '📉', service: '🛎️',
    revenue: '💹', shrinking: '📉', leaks: '💧', money: '💰', script: '📜', fix: '🔧', owner: '🧑‍💼', manual: '🖐️', tester: '🧪', clicking: '🖱️', login: '🔐', screen: '🖥️',
    code: '👨‍💻', disappearing: '💨', testing: '🧪', thousands: '🔢', sizes: '📐', overnight: '🌙', assurance: '✅', engineer: '🛠️', security: '🛡️', auditor: '🔍',
    suites: '🧰', break: '🔨', creative: '🎨', frameworks: '🧱', school: '🎓', years: '📆', playwright: '🎭', metaphors: '💡', beginner: '🌱', project: '📁', checkout: '🛒',
    technical: '⚙️', list: '📋', comment: '💬', free: '🎁', traditional: '📜', translator: '🗣️', neural: '🧠', translation: '🈯', tools: '🧰', contracts: '📜',
    videos: '🎬', meetings: '👥', pennies: '🪙', cultural: '🎎', localization: '🗺️', specialist: '🎓', campaign: '📣', joke: '😂', launch: '🚀', country: '🗺️',
    offend: '😬', textbook: '📚', audit: '🔍', employers: '🏢', alone: '🚫', hurt: '💔', sales: '📈', slogans: '📣', fail: '❌', awkward: '😬', pitch: '🎤', humor: '😄',
    references: '🔗', graphic: '🎨', social: '📲', media: '📲', banners: '🖼️', backgrounds: '🖼️', icons: '✏️', image: '🖼️', generators: '✨', text: '🔤', box: '🔲',
    industry: '🏭', production: '🎬', teams: '👥', person: '🧑', direct: '🎬', visual: '👁️', style: '🎨', systems_: '🧩', director: '🎬', ux: '🧭', ui: '📱',
    app: '📱', buy: '🛒', experience: '✨', weekend: '🗓️', lead: '🧭', restaurant: '🍔', mobile: '📱', ordering: '🍽️', cart: '🛒', research: '🔬', journey: '🗺️',
    redesigned: '✏️', paralegal: '⚖️', legal: '⚖️', court: '🏛️', pages: '📄', summarizing: '📝', agreements: '🤝', scan: '📠', highlight: '🖍️', risky: '⚠️',
    clause: '📜', minute: '⏱️', operations: '⚙️', compliance: '✅', firm: '🏢', workflows: '🔁', client: '🙋', private: '🔒', laws: '⚖️', privacy: '🔒',
    lawyers: '👩‍⚖️', policy: '📋', retail: '🛍️', cashier: '🧾', teller: '🏦', kiosks: '🏧', counter: '🧾', physical: '🏬', america: '🇺🇸', relationship: '🤝',
    banker: '🏦', merchant: '🏪', showroom: '🏬', advisor_: '🧭', trusted: '🤝', face: '🙂', choice: '✅', consultative: '🗨️', commission: '💰', resume: '📄',
    trust: '🤝', upselling: '📈', solving: '🧩', roleplay: '🎭', confident: '💪', appointment: '📅', setter: '📅', telemarketer: '☎️', cold: '🧊', phone: '☎️',
    callers: '📞', email: '📧', sequences: '🔁', dial: '📞', leads: '📇', objections: '🛑', book: '📅', links: '🔗', executive: '👔', outreach: '📡',
    closes: '🤝', deals: '🤝', video: '🎥', calls: '📞', builder: '🏗️', caller: '📞', president: '👔', outbound: '📤', prospects: '🎯', news: '📰',
    personalized: '✍️', discovery: '🔭', briefing: '📋', closer: '🏁', erasing: '🧽', work: '🛠️', stuck: '🪤', worried: '😟', running: '🏃', career: '🚀',
    channel: '📺', fahim: '👋', yours: '🎁', watching: '👀', pivot: '🔀', exact: '🎯', tonight: '🌙', starting: '🏁', new: '✨', clear: '🔆', manage: '🧭',
  };
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const stem = (k) => ICON[k] ? k : ICON[k.replace(/s$/, '')] ? k.replace(/s$/, '') : ICON[k.replace(/ing$/, '')] ? k.replace(/ing$/, '') : ICON[k.replace(/ed$/, '')] ? k.replace(/ed$/, '') : null;
  const iconFor = (w) => { const k = stem(norm(w)); return k ? ICON[k] : null; };

  // build fills for one section. stage: root element, shots: shot defs, T0: section start (program time), id: section id
  function build(stage, shots, T0, id, el, GC, S) {
    if (location.hash.includes('nofill')) return () => {};
    const FREE = (window.FREE || {})[id] || [], B = window.BEATS || { words: [], excl: [] };
    const off = (T) => B.excl.some(([a, b]) => T >= a && T < b);
    const layer = el(stage, `<div class="fl-a" style="inset:0;z-index:40;pointer-events:none"></div>`);
    const items = []; const LIFE = 3.2, MIN = 250;
    shots.forEach((d, si) => {
      const F = FREE[si] || { all: [], win: [] }; const free = F.all.slice();
      const a = T0 + d.t0, b = T0 + d.t1, col = d.fillColor || GC[(si + id.length) % 4];
      // ambient: up to 3 pieces in cells far apart
      const amb = [];
      if (free.length >= 5) {
        const sorted = free.slice().sort((p, q) => STAGE.hash(p[0] * 7 + p[1] + si) - STAGE.hash(q[0] * 7 + q[1] + si));
        for (const c of sorted) { if (amb.length >= Math.min(3, Math.floor(free.length / 4))) break; if (amb.every((o) => Math.hypot(o[0] - c[0], o[1] - c[1]) > 420)) amb.push(c); }
      }
      amb.forEach((c, k) => {
        const kind = (si + k) % 4, cc = GC[(si + k + 1) % 4];
        const html = kind === 0 ? `<div style="width:120px;height:120px;border-radius:50%;border:5px solid ${cc};box-shadow:0 0 30px ${cc}88,inset 0 0 24px ${cc}55"></div>`
          : kind === 1 ? `<div style="width:150px;height:110px;border-radius:18px;background:rgba(255,255,255,.07);border:2px solid ${cc}88;display:flex;align-items:flex-end;gap:10px;padding:14px;box-sizing:border-box">${[0.4, 0.7, 0.5, 0.95].map((h) => `<i style="flex:1;height:${h * 70}px;border-radius:4px;background:${cc}"></i>`).join('')}</div>`
          : kind === 2 ? `<div style="width:170px;height:100px;border-radius:18px;background:rgba(255,255,255,.07);border:2px solid ${cc}88;padding:16px;box-sizing:border-box"><i style="display:block;width:36px;height:36px;border-radius:50%;background:${cc}"></i><i style="display:block;margin-top:12px;height:10px;width:80%;border-radius:5px;background:rgba(255,255,255,.4)"></i></div>`
          : `<div style="display:grid;grid-template-columns:repeat(4,14px);gap:12px">${Array.from({ length: 12 }, (_, i) => `<i style="width:14px;height:14px;border-radius:50%;background:${GC[i % 4]};opacity:.8"></i>`).join('')}</div>`;
        const n = el(layer, `<div class="fl-a" style="left:${c[0]}px;top:${c[1]}px;opacity:0">${html}</div>`);
        items.push({ n, a: a + 0.5 + k * 0.6, b: b + 0.2, x: c[0], y: c[1], amb: true, ph: si * 3 + k });
      });
      // drifting fragments: short-lived ambient pieces in the free parts of each ~2 s window (camera-moving shots too)
      F.win.forEach((wv, wi) => {
        if (wi % 2 || wv[2].length < 8) return;
        const cands = wv[2].filter((c) => amb.every((o) => Math.hypot(o[0] - c[0], o[1] - c[1]) > 300));
        if (!cands.length) return;
        const c = cands[Math.floor(STAGE.hash(wi * 13 + si) * cands.length)], cc = GC[(wi + si) % 4], kind = wi / 2 % 3;
        const html = kind === 0 ? `<div style="width:90px;height:90px;border-radius:50%;border:4px solid ${cc};box-shadow:0 0 24px ${cc}88"></div>`
          : kind === 1 ? `<div style="width:120px;height:80px;border-radius:14px;background:rgba(255,255,255,.07);border:2px solid ${cc}88;display:flex;align-items:flex-end;gap:8px;padding:12px;box-sizing:border-box">${[0.5, 0.8, 0.4, 1].map((h) => `<i style="flex:1;height:${h * 50}px;border-radius:3px;background:${cc}"></i>`).join('')}</div>`
          : `<div style="width:26px;height:26px;transform:rotate(45deg);border-radius:6px;background:${cc};box-shadow:0 0 20px ${cc}"></div>`;
        const n = el(layer, `<div class="fl-a" style="left:${c[0] - 50}px;top:${c[1] - 40}px;opacity:0">${html}</div>`);
        items.push({ n, a: T0 + wv[0], b: T0 + wv[1] + 2.2, x: c[0], y: c[1], amb: true, ph: wi + si * 7 });
      });
      // beat icons on stressed words
      const notAmb = (c) => amb.every((o) => Math.hypot(o[0] - c[0], o[1] - c[1]) > 200);
      const poolAt = (Tw) => { const lt = Tw - T0; let best = null; for (const w of F.win) if (lt >= w[0] - 0.6 && lt <= w[1] + 0.6) { if (!best || Math.abs((w[0] + w[1]) / 2 - lt) < Math.abs((best[0] + best[1]) / 2 - lt)) best = w; } return (best ? best[2] : free).filter(notAmb); };
      const alive = []; let rr = Math.floor(STAGE.hash(si + id.length) * 97);
      B.words.forEach((w) => {
        if (!w.em || w.s < a + 0.3 || w.s > b - 0.6 || off(w.s)) return;
        const ic = iconFor(w.w); if (!ic) return;
        for (let i = alive.length - 1; i >= 0; i--) if (alive[i].end < w.s) alive.splice(i, 1);
        let pick = null; const pool = poolAt(w.s + 0.8);
        for (let k = 0; k < pool.length; k++) { const c = pool[(rr + k * 5) % pool.length]; if (alive.every((o) => Math.hypot(o.x - c[0], o.y - c[1]) > MIN)) { pick = c; rr += k * 5 + 3; break; } }
        if (!pick) return;
        const cc = GC[(items.length + si) % 4], label = w.w.replace(/[^A-Za-z0-9&-]/g, '').toUpperCase();
        const n = el(layer, `<div class="fl-a" style="left:${pick[0] - 76}px;top:${pick[1] - 88}px;width:152px;text-align:center;opacity:0">
          <div style="width:152px;height:152px;border-radius:36px;background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.04));border:2px solid ${cc};box-shadow:0 0 34px ${cc}66,0 20px 40px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font-size:90px;line-height:1">${ic}</div>
          <div style="margin-top:10px;font:900 24px Figtree;color:${cc};letter-spacing:1px;text-shadow:0 2px 10px #000;white-space:nowrap">${label}</div></div>`);
        const end = Math.min(w.s + LIFE, b + 0.1);
        alive.push({ x: pick[0], y: pick[1], end });
        items.push({ n, a: w.s - 0.05, b: end, x: pick[0], y: pick[1], ph: items.length });
        FILM.sfx('pop', w.s - 0.02, 0.12, (pick[0] - 960) / 1200);
      });
    });
    return (T) => {
      for (const it of items) {
        if (T < it.a - 0.01 || T > it.b + 0.4) { if (it.n.style.opacity !== '0') it.n.style.opacity = '0'; continue; }
        const inA = it.amb ? S.E.outCubic(S.seg(T, it.a, it.a + 0.8)) : S.clamp((T - it.a) / 0.32), out = S.seg(T, it.b - 0.35, it.b);
        const e = it.amb ? inA : (inA >= 1 ? 1 : S.E.outBack(inA));
        const fx = Math.sin((T + it.ph) * 0.8) * 10, fy = Math.cos((T + it.ph) * 0.65) * 12 - out * 30;
        it.n.style.opacity = ((it.amb ? 0.55 : 1) * Math.min(1, inA * 1.6) * (1 - out)).toFixed(3);
        it.n.style.transform = `translate(${fx.toFixed(1)}px,${fy.toFixed(1)}px) scale(${(it.amb ? 1 : 0.4 + 0.6 * e).toFixed(3)}) rotate(${(Math.sin((T + it.ph) * 0.5) * 4).toFixed(1)}deg)`;
      }
    };
  }
  window.FILL = { build, iconFor };
})();
