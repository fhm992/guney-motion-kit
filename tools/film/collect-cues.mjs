// Collects the sound cues every scene registers (FILM.cue) -> qa/audio/cues.json. Run from a project folder: node ../../tools/film/collect-cues.mjs
import fs from 'node:fs';
import { puppeteer, chromePath } from '../chrome.mjs';
const ids = fs.readdirSync('compositions').filter((n) => /^s\d+\.html$/.test(n)).map((n) => n.replace('.html', '')).sort();
const b = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--allow-file-access-from-files'] });
const all = [];
for (const id of ids) {
  const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  const html = fs.readFileSync(`compositions/${id}.html`, 'utf8').replace('<head>', `<head><base href="file://${process.cwd()}/">`);
  fs.writeFileSync(`qa/_c_${id}.html`, html); await p.goto(`file://${process.cwd()}/qa/_c_${id}.html`);
  const cues = await p.evaluate(() => window.__cues || []);
  console.log(id, cues.length, errs.join(' | '));
  all.push(...cues); await p.close(); fs.unlinkSync(`qa/_c_${id}.html`);
}
await b.close();
fs.mkdirSync('qa/audio', { recursive: true });
fs.writeFileSync('qa/audio/cues.json', JSON.stringify(all.sort((a, b) => a.t - b.t)));
console.log('total', all.length);
