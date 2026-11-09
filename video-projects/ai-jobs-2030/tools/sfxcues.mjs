// Loads each composition headless and saves the sound cues it registers (window.__sfx) to plan/sfx-cues.json.
import fs from 'node:fs';
import { puppeteer, chromePath } from '../../../tools/chrome.mjs';
const ids = JSON.parse(fs.readFileSync('plan/edit.json', 'utf8')).sections.map((s) => s.id);
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--allow-file-access-from-files'] });
const all = [];
for (const id of ids) {
  const page = await browser.newPage();
  const html = fs.readFileSync(`compositions/${id}.html`, 'utf8').replace('<head>', `<head><base href="file://${process.cwd()}/">`);
  const tmp = `${process.cwd()}/qa/_cue-${id}.html`; fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  const cues = await page.evaluate(() => window.__sfx || []);
  console.log(id, cues.length); all.push(...cues); fs.rmSync(tmp); await page.close();
}
fs.writeFileSync('plan/sfx-cues.json', JSON.stringify(all.sort((a, b) => a.t - b.t), null, 1));
await browser.close();
