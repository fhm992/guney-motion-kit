// Renders the 3D shots with three.js in headless Chromium. usage: node render3d.js [ids]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { S } = require('./shots3d');
const ROOT = __dirname, FONTS = path.resolve(__dirname, '../../../fonts');
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2' };
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Anton';src:url('/fonts/anton.woff2')}@font-face{font-family:'Caveat';src:url('/fonts/caveat-700.woff2')}@font-face{font-family:'JetBrains Mono';src:url('/fonts/jetbrains-mono-700.woff2')}@font-face{font-family:'Figtree';src:url('/fonts/figtree-800-latin.woff2')}
html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">await Promise.all(['Anton','Caveat','JetBrains Mono','Figtree'].map(f=>document.fonts.load('40px "'+f+'"')));await import('/scene3d.js');</script></body></html>`;
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = u.startsWith('/fonts/') ? path.join(FONTS, u.slice(7)) : path.join(ROOT, u);
  if (!f.startsWith(ROOT) && !f.startsWith(FONTS)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
srv.listen(0, '127.0.0.1', async () => {
  const port = srv.address().port;
  const only = process.argv[2] ? process.argv[2].split(',').map(Number) : Object.keys(S).map(Number);
  fs.mkdirSync(path.join(ROOT, 'panels3d'), { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', (m) => { if (m.type() === 'error') console.log('page:', m.text()); });
  p.on('pageerror', (e) => console.log('pageerror:', e.message));
  await p.goto(`http://127.0.0.1:${port}/`);
  await p.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  for (const id of only) {
    const t0 = Date.now();
    const url = await p.evaluate((spec) => window.renderShot(spec), S[id]);
    fs.writeFileSync(path.join(ROOT, 'panels3d', `raw-${String(id).padStart(2, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    console.log('shot', id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await b.close(); srv.close();
});
