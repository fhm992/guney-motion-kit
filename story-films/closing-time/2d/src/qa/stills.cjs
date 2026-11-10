// node qa/stills.cjs [ids...] -> qa/still-<file>-<pct>.jpg at 10/50/90%
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  const files = fs.readdirSync('compositions').filter((f) => f.endsWith('.html')).filter((f) => process.argv.length < 3 || process.argv.slice(2).some((a) => f.includes(a)));
  for (const fl of files) { const id = fl.replace(/^\d+-/, '').replace('.html', ''); const tmp = path.resolve('_qa_' + fl); fs.copyFileSync(path.resolve('compositions', fl), tmp); await p.goto('file://' + tmp); 
    await p.evaluate(() => document.fonts.ready);
    for (const pc of [10, 50, 90]) { await p.evaluate(([id, pc]) => { const tl = window.__timelines[id]; tl.seek(tl.duration() * pc / 100, false); }, [id, pc]); await p.screenshot({ path: `qa/still-${fl.replace('.html', '')}-${pc}.jpg`, type: 'jpeg', quality: 80 }); }
    fs.unlinkSync(tmp);
  }
  await b.close(); })();
