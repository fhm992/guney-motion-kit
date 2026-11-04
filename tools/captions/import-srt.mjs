#!/usr/bin/env node
// Use a word-by-word SRT (or VTT) the person already has: NO Whisper, nothing to download.
//   node ../../tools/captions/import-srt.mjs <words.srt> [--merge "ja+chen" ...]
// Run from a video project folder. Writes qa/words.json and assets/vo-times.js (what lib/captions.js reads).
//   --merge "ja+chen"   joins consecutive cues into one word ("jachhen" if you write "ja+chen=jachhen"); repeat the flag for more.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const argv = process.argv.slice(2), file = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--merge');
if (!file || !existsSync(file)) { console.log('Usage: node ../../tools/captions/import-srt.mjs <words.srt> [--merge "ja+chen=jachhen"]'); process.exit(1); }
const sec = (t) => { const [h, m, s] = t.replace(',', '.').split(':'); return +h * 3600 + +m * 60 + parseFloat(s); };
const cue = /(\d+:\d\d:\d\d[.,]\d+|\d\d:\d\d[.,]\d+)\s*-->\s*(\d+:\d\d:\d\d[.,]\d+|\d\d:\d\d[.,]\d+)[^\n]*\n([\s\S]*?)(?=\n\s*\n|\n?$)/g;
const fix = (t) => (t.split(':').length === 2 ? '00:' + t : t);
let words = [...readFileSync(file, 'utf8').replace(/\r/g, '').matchAll(cue)].map((m) => ({ w: m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), s: +sec(fix(m[1])).toFixed(3), e: +sec(fix(m[2])).toFixed(3) })).filter((w) => w.w);
if (!words.length) { console.error('No subtitles found in that file.'); process.exit(1); }
const many = words.filter((w) => w.w.includes(' ')).length;
for (let i = 0; i < argv.length; i++) if (argv[i] === '--merge') {   // --merge "ja+chen=jachhen"
  const [parts, name] = argv[i + 1].split('='), seq = parts.split('+');
  for (let k = 0; k + seq.length <= words.length; k++) if (seq.every((p, q) => words[k + q].w === p)) { words.splice(k, seq.length, { w: name || seq.join(''), s: words[k].s, e: words[k + seq.length - 1].e }); }
}
mkdirSync('qa', { recursive: true }); mkdirSync('assets', { recursive: true });
writeFileSync('qa/words.json', JSON.stringify(words, null, 1) + '\n');
writeFileSync('assets/vo-times.js', `window.VO = Object.assign(window.VO || {}, { captions: { base: 0, words: ${JSON.stringify(words)} } });\n`);
console.log(`${words.length} words from your SRT (Whisper not used) -> qa/words.json and assets/vo-times.js` + (many ? `\nNote: ${many} cues hold more than one word; this is not a strict word-by-word file.` : ''));
console.log(words.map((w) => `${w.w}@${w.s.toFixed(2)}`).join(' '));
