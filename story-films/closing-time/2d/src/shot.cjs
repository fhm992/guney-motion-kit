const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const n of process.argv.slice(3)) { await p.goto('file://' + path.resolve(process.argv[2]) + '?f=' + n); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200); await p.screenshot({ path: `qa/style-${n}.jpg`, type: 'jpeg', quality: 90 }); }
  await b.close(); })();
