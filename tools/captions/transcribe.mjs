#!/usr/bin/env node
// node ../../tools/captions/transcribe.mjs <audio-or-video> [--model small.en] [--lang en]
// Run from a video project folder. Whisper (via HyperFrames) listens to the voice and writes word timings:
//   qa/words.json          [{ "w": "Never", "s": 31.85, "e": 32.40 }, ...]   (fix misheard words by hand, keep the times)
//   assets/vo-times.js     window.VO = { captions: { base: 0, words: [...] } }   (what lib/captions.js reads)
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--') && !['--model', '--lang'].includes(args[args.indexOf(a) - 1]));
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
if (!input || !existsSync(input)) { console.log('Usage: node ../../tools/captions/transcribe.mjs <audio-or-video> [--model small.en] [--lang en]'); process.exit(1); }
mkdirSync('qa', { recursive: true }); mkdirSync('assets', { recursive: true });

const run = spawnSync('npx', ['hyperframes', 'transcribe', input, '--json', '-d', 'qa', '-m', opt('--model', 'small.en'), ...(opt('--lang') ? ['-l', opt('--lang')] : [])], { encoding: 'utf8' });
if (run.status !== 0) { console.error((run.stdout || '') + (run.stderr || '')); console.error('\nTranscription failed (see above). If it says the model could not be downloaded, huggingface.co must be reachable.'); process.exit(1); }

const raw = JSON.parse(readFileSync(join('qa', 'transcript.json'), 'utf8'));
const words = raw.filter((w) => (w.text || '').trim()).map((w) => ({ w: w.text.trim(), s: +(+w.start).toFixed(3), e: +(+w.end).toFixed(3) }));
if (!words.length) { console.error('No words found in the audio.'); process.exit(1); }
for (let i = 0; i < words.length - 1; i++) if (words[i].e > words[i + 1].s) words[i].e = words[i + 1].s;   // no overlaps
writeFileSync('qa/words.json', JSON.stringify(words, null, 1) + '\n');
writeFileSync('assets/vo-times.js', `window.VO = Object.assign(window.VO || {}, { captions: { base: 0, words: ${JSON.stringify(words)} } });\n`);
console.log(`${words.length} words -> qa/words.json and assets/vo-times.js\n` + words.map((w) => `${w.w}@${w.s.toFixed(2)}`).join(' '));
