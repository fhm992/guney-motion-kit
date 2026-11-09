// node shoot.cjs page.html out.png [w h] [hash]
const { chromium } = require('playwright');
(async () => { const [f, out, w = 1920, h = 1080, hash = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on('pageerror', (e) => console.log('ERR', e.message)); await p.goto('file://' + require('path').resolve(f) + (hash ? '#' + hash : ''));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150); await p.screenshot({ path: out }); await b.close(); })();
