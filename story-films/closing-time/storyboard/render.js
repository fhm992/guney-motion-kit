// Renders SVG panels to JPEG with Playwright. usage: node render.js <module> [outdir] [only-ids]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FONTS = path.resolve(__dirname, '../../../fonts');
const css = ['anton', 'jetbrains-mono-700', 'figtree-800-latin', 'caveat-700'].map((n) => `@font-face{font-family:'${{ anton: 'Anton', 'jetbrains-mono-700': 'JetBrains Mono', 'figtree-800-latin': 'Figtree', 'caveat-700': 'Caveat' }[n]}';src:url('file://${FONTS}/${n}.woff2')}`).join('');
(async () => {
  const mod = require(path.resolve(process.argv[2]));
  const out = path.resolve(process.argv[3] || 'panels');
  const only = process.argv[4] ? process.argv[4].split(',') : null;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  for (const sh of mod.shots) {
    if (only && !only.includes(String(sh.id))) continue;
    const svg = sh.draw();
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;background:#000}svg{width:1280px;height:720px;display:block}</style></head><body>${svg}</body></html>`;
    const f = path.join(out, `_tmp.html`);
    fs.writeFileSync(f, html);
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `shot-${String(sh.id).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 86 });
  }
  fs.unlinkSync(path.join(out, '_tmp.html'));
  await b.close();
})();
