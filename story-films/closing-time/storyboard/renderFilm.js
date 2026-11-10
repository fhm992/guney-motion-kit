// Renders the animated three.js shots. node renderFilm.js [--stills] [--fps 24] [shotIds,...]
const http = require('http'), fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const { actorSvg } = require('./shots3d');
const ROOT = __dirname, FONTS = path.resolve(__dirname, '../../../fonts');
const OUT = path.resolve(__dirname, '../film');
const args = process.argv.slice(2);
const stills = args.includes('--stills');
const fps = Number(args[args.indexOf('--fps') + 1]) || 24;
const only = args.filter((a) => !a.startsWith('--') && isNaN(Number(a)) || /,/.test(a)).join(',').split(',').filter(Boolean);
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2' };
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Anton';src:url('/fonts/anton.woff2')}@font-face{font-family:'Caveat';src:url('/fonts/caveat-700.woff2')}@font-face{font-family:'JetBrains Mono';src:url('/fonts/jetbrains-mono-700.woff2')}@font-face{font-family:'Figtree';src:url('/fonts/figtree-800-latin.woff2')}
html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">await Promise.all(['Anton','Caveat','JetBrains Mono','Figtree'].map(f=>document.fonts.load('40px "'+f+'"')));await import('/film.js');</script></body></html>`;
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = u.startsWith('/fonts/') ? path.join(FONTS, u.slice(7)) : path.join(ROOT, u);
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
srv.listen(0, '127.0.0.1', async () => {
  const port = srv.address().port;
  fs.mkdirSync(path.join(OUT, stills ? 'stills' : 'shots'), { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.log('pageerror:', e.message));
  p.on('console', (m) => { if (m.type() === 'error') console.log('page:', m.text()); });
  await p.exposeFunction('svg', (spec) => actorSvg(spec));
  await p.goto(`http://127.0.0.1:${port}/`);
  await p.waitForFunction(() => window.filmReady === true, null, { timeout: 120000 });
  const list = await p.evaluate(() => window.SHOT_LIST);
  for (let i = 0; i < list.length; i++) {
    const { id, dur } = list[i];
    if (only.length && !only.includes(id)) continue;
    const t0 = Date.now();
    await p.evaluate((k) => window.buildShot(k), i);
    if (stills) {
      for (const fr of [0.1, 0.5, 0.9]) { const url = await p.evaluate((t) => window.renderFrame(t), dur * fr); fs.writeFileSync(path.join(OUT, 'stills', `${String(i).padStart(2, '0')}-${id}-${Math.round(fr * 100)}.jpg`), Buffer.from(url.split(',')[1], 'base64')); }
      console.log(id, 'stills', ((Date.now() - t0) / 1000).toFixed(1) + 's'); continue;
    }
    const out = path.join(OUT, 'shots', `${String(i).padStart(2, '0')}-${id}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out]);
    const n = Math.round(dur * fps);
    for (let f = 0; f < n; f++) {
      const url = await p.evaluate((t) => window.renderFrame(t), f / fps);
      const buf = Buffer.from(url.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r));
    console.log(id, n, 'frames', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await b.close(); srv.close();
});
