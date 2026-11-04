#!/usr/bin/env node
// Word-by-word timings (and a word-by-word SRT) from a voiceover, using Whisper (via HyperFrames).
//
//   node ../../tools/captions/transcribe.mjs <voice.mp3|wav|mp4> [--script script.txt] [--lang bn] [--model small.en]
//
// Run it from a video project folder. It writes:
//   qa/words.json        [{ "w": "Never", "s": 31.85, "e": 32.40 }, ...]
//   qa/words.srt         one word per subtitle, same times (import it in CapCut, Premiere, Resolve ...)
//   assets/vo-times.js   window.VO = { captions: { base: 0, words: [...] } }   (what lib/captions.js reads)
//
// --script  a plain-text file with the exact words you want on screen (any language). Whisper only supplies the TIMES;
//           your spelling is kept, and the tool tells you how much of the script it could match to the audio.
//           The script is also given to Whisper as a hint, so it writes the same words in the same script.
// --shift   seconds added to every word time (e.g. -0.2 if the words appear a little late). Default 0.
// --lang    language code (en, bn, hi, ...). Anything other than English uses a multilingual model (default "small").
// --model   tiny.en base.en small.en medium.en (English) | tiny base small medium large-v3 (any language). Bigger = slower, better.
//           English: small.en is fine. Bangla and other languages: use medium (about 1.5 GB, still under a minute for a short clip).
//
// The model (about 150 MB to 3 GB) is downloaded once with curl into ~/.cache/hyperframes/whisper/models.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const argv = process.argv.slice(2);
const flag = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const input = argv.find((a, i) => !a.startsWith('--') && !['--script', '--lang', '--model', '--shift'].includes(argv[i - 1]));
if (!input || !existsSync(input)) {
  console.log('Usage: node ../../tools/captions/transcribe.mjs <voice.mp3|wav|mp4> [--script script.txt] [--lang bn] [--model small.en]');
  process.exit(1);
}
const lang = flag('--lang');
const english = !lang || lang === 'en';
const model = flag('--model', english ? 'small.en' : 'small');
const scriptFile = flag('--script');
if (scriptFile && !existsSync(scriptFile)) { console.error(`Script file not found: ${scriptFile}`); process.exit(1); }
mkdirSync('qa', { recursive: true }); mkdirSync('assets', { recursive: true });

// 1) make sure the speech model is on disk (curl follows the environment's proxy; HyperFrames' own downloader may not)
const dir = join(homedir(), '.cache', 'hyperframes', 'whisper', 'models'), file = join(dir, `ggml-${model}.bin`);
if (!existsSync(file)) {
  mkdirSync(dir, { recursive: true });
  console.log(`Downloading the Whisper "${model}" model once (this can take a few minutes) ...`);
  const dl = spawnSync('curl', ['-fL', '--retry', '3', '-o', file + '.part', `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin`], { stdio: 'inherit' });
  if (dl.status !== 0) { console.error('\nCould not download the model. huggingface.co must be reachable (cloud environment settings > Network access).'); process.exit(1); }
  renameSync(file + '.part', file);
}

// 2) listen to the voice. Preferred: whisper.cpp directly with DTW word timing (steadier) and the script as a prompt, so
//    the words come out in the script's language and spelling. Fallback: `hyperframes transcribe`.
const cli = spawnSync('bash', ['-c', 'find "$HOME/.cache/hyperframes/whisper" -name whisper-cli -type f 2>/dev/null | head -1'], { encoding: 'utf8' }).stdout.trim();
const shift = parseFloat(flag('--shift', '0'));
let words;
if (cli) {
  const wav = join('qa', 'voice-16k.wav');
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-ar', '16000', '-ac', '1', wav], { stdio: 'inherit' });
  const prompt = scriptFile ? readFileSync(scriptFile, 'utf8').replace(/^\s*#.*$/gm, '').replace(/\s+/g, ' ').trim().slice(0, 400) : '';
  const dtw = model.replace('large-v3', 'large.v3');
  const out = join('qa', 'whisper-dtw');
  const r = spawnSync(cli, ['-m', file, '-f', wav, '-ml', '1', '-sow', '-ojf', '-of', out, '--dtw', dtw, '-nfa', '-np', ...(lang ? ['-l', lang] : []), ...(prompt ? ['--prompt', prompt] : [])], { encoding: 'utf8' });
  if (r.status !== 0) { console.error((r.stdout || '') + (r.stderr || '')); console.error('\nTranscription failed (see above).'); process.exit(1); }
  words = [];
  for (const seg of JSON.parse(readFileSync(out + '.json', 'utf8')).transcription) {
    const toks = (seg.tokens || []).filter((t) => !t.text.startsWith('['));
    if (!seg.text.trim() || !toks.length) continue;
    const s = toks[0].t_dtw / 100 - 0.07 + shift;                       // DTW starts run about 0.07 s late
    if (seg.text.startsWith(' ') || !words.length) words.push({ w: seg.text.trim(), s });
    else words[words.length - 1].w += seg.text.trim();
  }
  words.forEach((w, k) => { w.s = +Math.max(0, w.s).toFixed(3); w.e = +(k + 1 < words.length ? Math.max(0, words[k + 1].s + 0) : w.s + 0.6).toFixed(3); });
  for (let k = 1; k < words.length; k++) if (words[k].s <= words[k - 1].s) words[k].s = +(words[k - 1].s + 0.02).toFixed(3);
  words.forEach((w, k) => { w.e = +(k + 1 < words.length ? Math.max(w.s + 0.05, Math.min(words[k + 1].s, w.s + 1.2)) : w.s + 0.6).toFixed(3); });
} else {
  const run = spawnSync('npx', ['hyperframes', 'transcribe', input, '--json', '-d', 'qa', '-m', model, ...(lang ? ['-l', lang] : [])], { encoding: 'utf8' });
  if (run.status !== 0) { console.error((run.stdout || '') + (run.stderr || '')); console.error('\nTranscription failed (see above).'); process.exit(1); }
  const raw = JSON.parse(readFileSync(join('qa', 'transcript.json'), 'utf8'));
  words = raw.filter((w) => (w.text || '').trim()).map((w) => ({ w: w.text.trim(), s: +Math.max(0, +w.start + shift).toFixed(3), e: +(+w.end + shift).toFixed(3) }));
}
if (!words.length) { console.error('No words found in the audio.'); process.exit(1); }

// 3) keep the script's own words: match them onto Whisper's words, spread the unmatched ones between their neighbours
if (scriptFile) {
  const norm = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}\p{M}]/gu, '');
  const toks = readFileSync(scriptFile, 'utf8').replace(/^\s*#.*$/gm, '').split(/\s+/).filter((t) => norm(t));
  const a = toks.map(norm), b = words.map((x) => norm(x.w)), n = a.length, m = b.length;
  // two words "match" when they are close in spelling (so a slightly misheard word still lands on the right time)
  const sim = (x, y) => { if (x === y) return 1; const u = [...x], v = [...y]; if (!u.length || !v.length) return 0;
    let prev = Array.from({ length: v.length + 1 }, (_, k) => k);
    for (let p = 1; p <= u.length; p++) { const cur = [p]; for (let q = 1; q <= v.length; q++) cur[q] = Math.min(prev[q] + 1, cur[q - 1] + 1, prev[q - 1] + (u[p - 1] === v[q - 1] ? 0 : 1)); prev = cur; }
    return 1 - prev[v.length] / Math.max(u.length, v.length); };
  const same = (x, y) => sim(x, y) >= 0.55;
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));            // longest common subsequence
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = same(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const t = new Array(n).fill(null); let i = 0, j = 0, matched = 0;
  while (i < n && j < m) { if (same(a[i], b[j])) { t[i] = [words[j].s, words[j].e]; matched++; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  for (let k = 0; k < n;) {
    if (t[k]) { k++; continue; }
    let q = k; while (q < n && !t[q]) q++;
    const t0 = k > 0 ? t[k - 1][1] : words[0].s, t1 = q < n ? t[q][0] : words[m - 1].e;
    const len = toks.slice(k, q).map((x) => Math.max(1, [...norm(x)].length)), tot = len.reduce((x, y) => x + y, 0), span = Math.max(0.05, t1 - t0);
    let acc = 0; for (let p = k; p < q; p++) { t[p] = [t0 + (span * acc) / tot, t0 + (span * (acc + len[p - k])) / tot]; acc += len[p - k]; }
    k = q;
  }
  words = toks.map((w, p) => ({ w, s: +t[p][0].toFixed(3), e: +t[p][1].toFixed(3) }));
  const pct = Math.round((100 * matched) / n);
  console.log(`Script match: ${matched} of ${n} script words found in the audio (${pct}%).` + (pct < 90 ? '\n  Under 90%: check that this is the right script and the right audio. Unmatched words are still given a time, spread between their neighbours.' : ''));
}
for (let k = 0; k < words.length - 1; k++) if (words[k].e > words[k + 1].s) words[k].e = words[k + 1].s;   // no overlaps

// 4) write everything
const ts = (x) => { const ms = Math.round(x * 1000), p = (v, z) => String(v).padStart(z, '0'); return `${p(Math.floor(ms / 3600000), 2)}:${p(Math.floor(ms / 60000) % 60, 2)}:${p(Math.floor(ms / 1000) % 60, 2)},${p(ms % 1000, 3)}`; };
writeFileSync('qa/words.json', JSON.stringify(words, null, 1) + '\n');
writeFileSync('qa/words.srt', words.map((w, k) => `${k + 1}\n${ts(w.s)} --> ${ts(Math.max(w.e, w.s + 0.08))}\n${w.w}\n`).join('\n'));
writeFileSync('assets/vo-times.js', `window.VO = Object.assign(window.VO || {}, { captions: { base: 0, words: ${JSON.stringify(words)} } });\n`);
console.log(`${words.length} words -> qa/words.json, qa/words.srt and assets/vo-times.js\n` + words.map((w) => `${w.w}@${w.s.toFixed(2)}`).join(' '));
