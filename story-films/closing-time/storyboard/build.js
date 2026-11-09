// Builds storyboard.md and storyboard.html (images embedded) from panels.js
const fs = require('fs'), path = require('path');
const { STYLE } = require('./panels'); const { shots } = require('./final');
const MUSIC = [
  ['M1', 'Closing Time (store muzak)', '0:00–0:42', 'Bland, cheerful store music. On shot 5 it warps, slows down and dies.'],
  ['M2', 'The Turn', '0:42–2:30', 'Low drone and pulses, sharp hits on the shutter and the freezer. Cuts out under Mum\'s call.'],
  ['M3', 'Alone', '2:30–3:55', 'Lonely ticking piano: Sami\'s theme. Warm but empty.'],
  ['M4', 'The Knock', '3:55–4:35', 'Heartbeat, rising strings, a slam into silence.'],
  ['M5', 'Five', '4:35–5:00', 'Sami\'s theme, warmer, with a second voice joining.'],
  ['M6', 'The Air', '5:00–6:40', 'The generator drone becomes the music. Detuned, sick, with a digital tick for the countdown. Silence, then a sub hit on the freezer.'],
  ['M7', 'Grief', '6:40–7:40', 'Sami\'s theme, one hand only, slow.'],
  ['M8', 'Theo\'s Song (on screen)', '7:40–8:20', 'A cheerful pop loop played from Theo\'s speaker, under a rising orchestral drone.'],
  ['M9', 'Plan B (escape theme)', '8:20–9:05', 'The full theme: drums, strings, piano, big and hopeful. Ends on one held note.'],
];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'panels', f)).toString('base64');
const fname = (id) => `shot-${String(id).padStart(2, '0')}.jpg`;

// Markdown
let md = `# CLOSING TIME — storyboard (v1)\n\n35 shots · about 9 minutes · 2.39:1 widescreen · zombie survival\n\n`;
md += `The pictures set framing, staging and camera. 20 shots are rendered in real 3D with three.js (2D characters inside 3D sets); the close-up inserts are flat drawings. The final 3D art is made from the **image prompt** on each shot (every prompt ends with the style line below).\n\n`;
md += `**Style line (add to every prompt):** ${STYLE}.\n\n![Cast](panels/cast.jpg)\n\n`;
md += `## Music cues (to be composed in Python)\n\n| Cue | Title | Time | Feel |\n|---|---|---|---|\n` + MUSIC.map((m) => `| ${m.join(' | ')} |`).join('\n') + '\n\n## Shots\n\n';
for (const s of shots) {
  md += `### ${s.id}. ${s.scene} — ${s.time}\n\n![Shot ${s.id}](panels/${fname(s.id)})\n\n`;
  md += `- **Shot:** ${s.size} · **Lens:** ${s.lens}\n- **Camera:** ${s.move}\n- **Action:** ${s.action}\n- **Sound:** ${s.audio}\n- **Image prompt:** ${s.prompt}. ${STYLE}.\n\n`;
}
fs.writeFileSync(path.join(__dirname, 'storyboard.md'), md);

// HTML
const aerials = shots.filter((s) => /AERIAL/.test(s.size)).map((s) => s.id);
const card = (s) => `<article class="shot${/AERIAL/.test(s.size) ? ' key' : ''}" id="s${s.id}">
<img src="${img(fname(s.id))}" alt="Shot ${s.id}" loading="lazy">
<div class="meta"><div class="top"><span class="num">${s.id}</span><span class="scene">${esc(s.scene)}</span><span class="time">${esc(s.time)}</span></div>
<div class="tags"><span>${esc(s.size)}</span><span>${esc(s.lens)}</span>${s.is3d ? '<span class="t3d">three.js 3D</span>' : ''}</div>
<p><b>Camera</b> ${esc(s.move)}</p><p><b>Action</b> ${esc(s.action)}</p><p><b>Sound</b> ${esc(s.audio)}</p>
<details><summary>Image prompt</summary><p class="prompt">${esc(s.prompt)}. ${esc(STYLE)}.</p></details></div></article>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Closing Time Storyboard</title>
<style>
:root{--bg:#0b0d10;--card:#14181d;--ink:#e9ecef;--mute:#9aa4ad;--line:#262c33;--accent:#7fc04a;--warn:#ff5a3a}
:root[data-theme="light"]{--bg:#f3f4f6;--card:#fff;--ink:#14181d;--mute:#5b6570;--line:#dde1e5;--accent:#3d7a1a;--warn:#c8262b}
@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--bg:#f3f4f6;--card:#fff;--ink:#14181d;--mute:#5b6570;--line:#dde1e5;--accent:#3d7a1a;--warn:#c8262b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:32px 16px 80px}
h1{font-size:clamp(34px,6vw,64px);letter-spacing:.02em;margin:0 0 4px}h2{margin:48px 0 12px;font-size:24px}
.lede{color:var(--mute);margin:0 0 24px;max-width:70ch}.cast{width:100%;border-radius:10px;display:block}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid var(--line);padding:8px 6px;text-align:left;vertical-align:top}th{color:var(--mute);font-weight:600}
.tablewrap{overflow-x:auto}
.shot{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:20px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:16px 0}
.shot.key{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.shot img{width:100%;border-radius:8px;display:block;align-self:start}
.top{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.num{font-weight:800;font-size:28px}.scene{font-weight:700}.time{color:var(--mute);margin-left:auto;font-variant-numeric:tabular-nums}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 4px}.tags span{font-size:12px;border:1px solid var(--line);border-radius:99px;padding:2px 10px;color:var(--mute)}
.shot.key .tags span:first-child{border-color:var(--accent);color:var(--accent)}.tags .t3d{border-color:#4a8fd6;color:#4a8fd6}
.meta p{margin:8px 0;font-size:15px}.meta b{display:inline-block;min-width:64px;color:var(--mute);font-weight:600}
details{margin-top:8px}summary{cursor:pointer;color:var(--mute);font-size:14px}.prompt{font-size:13px;color:var(--mute)}
.note{border-left:3px solid var(--warn);padding:8px 14px;background:var(--card);border-radius:0 8px 8px 0;margin:16px 0;font-size:15px}
@media (max-width:760px){.shot{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<h1>CLOSING TIME</h1><p class="lede">Storyboard v1 · 35 shots · about 9 minutes · 2.39:1 widescreen. A night-shift shelf stacker, a supermarket, a zombie outbreak, and fourteen days.</p>
<p class="note">These are storyboard sketches: they set framing, staging, lens and camera movement. Shots tagged <b>three.js 3D</b> are rendered as real 3D sets (aisles, car park, stockroom, the city) with the 2D characters standing in them; close-up inserts stay as flat drawings. The final art is made from each shot's image prompt. Aerial shots (${aerials.join(', ')}) are outlined in green.</p>
<img class="cast" src="${img('cast.jpg')}" alt="Cast reference">
<h2>Music cues</h2><div class="tablewrap"><table><tr><th>Cue</th><th>Title</th><th>Time</th><th>Feel</th></tr>${MUSIC.map((m) => `<tr>${m.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
<h2>Shots</h2>${shots.map(card).join('\n')}
</div></body></html>`;
fs.writeFileSync(path.join(__dirname, 'storyboard.html'), html);
console.log('md + html written', (html.length / 1e6).toFixed(1) + 'MB');
