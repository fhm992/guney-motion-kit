// One still from the middle of every shot of every section -> qa/shots/<id>-<n>.png
import fs from 'node:fs';
import { puppeteer, chromePath } from '../../../tools/chrome.mjs';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : JSON.parse(fs.readFileSync('plan/edit.json', 'utf8')).sections.map((s) => s.id);
fs.mkdirSync('qa/shots', { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--allow-file-access-from-files'] });
for (const id of ids) {
  const page = await browser.newPage(); await page.setViewport({ width: 1920, height: 1080 });
  const html = fs.readFileSync(`compositions/${id}.html`, 'utf8').replace('<head>', `<head><base href="file://${process.cwd()}/">`);
  const tmp = `${process.cwd()}/qa/_ss-${id}.html`; fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
  const shots = await page.evaluate(() => window.__shots);
  for (const s of shots) {
    const t = s.t0 + (s.t1 - s.t0) * (+process.env.AT || 0.55);
    await page.evaluate(({ t, id }) => { window.__timelines[id].seek(t, false); window.dispatchEvent(new CustomEvent('hf-seek', { detail: { time: t } })); }, { t, id });
    await page.screenshot({ path: `qa/shots/${id}-${s.i}.png` });
  }
  console.log(id, shots.length); fs.rmSync(tmp); await page.close();
}
await browser.close();
