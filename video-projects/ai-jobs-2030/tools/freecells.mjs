// Samples every shot about once a second (fills switched off) and saves small greyscale frames for tools/freecells.py.
import fs from 'node:fs';
import { puppeteer, chromePath } from '../../../tools/chrome.mjs';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : JSON.parse(fs.readFileSync('plan/edit.json', 'utf8')).sections.map((s) => s.id);
fs.mkdirSync('qa/free', { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--allow-file-access-from-files'] });
const meta = fs.existsSync('qa/free/meta.json') ? JSON.parse(fs.readFileSync('qa/free/meta.json', 'utf8')) : {};
for (const id of ids) {
  const page = await browser.newPage(); await page.setViewport({ width: 1920, height: 1080 });
  const html = fs.readFileSync(`compositions/${id}.html`, 'utf8').replace('<head>', `<head><base href="file://${process.cwd()}/">`);
  const tmp = `${process.cwd()}/qa/_fc-${id}.html`; fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp + '#nofill', { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
  const shots = await page.evaluate(() => window.__shots); meta[id] = shots;
  for (const s of shots) {
    const n = Math.max(3, Math.ceil((s.t1 - s.t0) / 1.0));
    for (let k = 0; k < n; k++) {
      const t = s.t0 + 0.15 + (s.t1 - s.t0 - 0.3) * (k / (n - 1));
      await page.evaluate(({ t, id }) => { window.__timelines[id].seek(t, false); window.dispatchEvent(new CustomEvent('hf-seek', { detail: { time: t } })); }, { t, id });
      await page.screenshot({ path: `qa/free/${id}-${s.i}-${k}.jpg`, type: 'jpeg', quality: 70 });
    }
  }
  console.log(id, shots.length); fs.rmSync(tmp); await page.close();
}
fs.writeFileSync('qa/free/meta.json', JSON.stringify(meta));
await browser.close();
