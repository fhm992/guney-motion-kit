// Run from a project folder: node ../../tools/paper/cues.mjs
// collect window.__SFX from every composition -> audio/cues.json (global seconds)
import fs from 'node:fs';
import { puppeteer, chromePath } from '../chrome.mjs';
const ids = Object.keys(JSON.parse(fs.readFileSync('plan/scenes.json', 'utf8')).scenes);
fs.mkdirSync('audio', { recursive: true }); fs.mkdirSync('qa', { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--allow-file-access-from-files'] });
const all = [];
for (const id of ids) {
  const page = await browser.newPage();
  const html = fs.readFileSync(`compositions/${id}.html`, 'utf8').replace('<head>', `<head><base href="file://${process.cwd()}/">`);
  const tmp = `${process.cwd()}/qa/_cue-${id}.html`; fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  const r = await page.evaluate(() => ({ sfx: window.__SFX, start: +document.getElementById('root').dataset.voStart, dur: +document.getElementById('root').dataset.duration }));
  r.sfx.forEach((e) => { if (e.t >= r.start - 0.6 && e.t < r.start + r.dur) all.push({ ...e, scene: id }); });
  fs.unlinkSync(tmp); await page.close();
}
await browser.close();
all.sort((a, b) => a.t - b.t);
fs.writeFileSync('audio/cues.json', JSON.stringify(all));
const names = {}; all.forEach((e) => names[e.name] = (names[e.name] || 0) + 1);
console.log(all.length, 'cues'); console.log(JSON.stringify(names));
