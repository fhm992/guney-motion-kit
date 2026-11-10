"""Builds assets/vo-env.js (mouth-open envelope per voice line, 30 per second, 0-9) and assets/cues.js (every scene's
voice line start times, read from audio-src/cues/*.json) so the animation and the sound mix share one timing source."""
import glob, json, os, subprocess
import numpy as np
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
env = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'assets/audio/vo/[nbthrx][0-9][0-9].mp3'))):
    k = os.path.basename(f)[:-4]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, '<f4'); hop = 16000 // 30
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x), hop)])
    rms = rms / (np.percentile(rms, 95) or 1)
    rms = np.convolve(rms, [0.25, 0.5, 0.25], 'same')
    env[k] = ''.join(str(int(min(9, max(0, v * 9)))) for v in rms)
cues = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'audio-src/cues/s*.json'))):
    s = json.load(open(f)); sid = os.path.basename(f)[:-5]
    cues[sid] = {(c.get('sync') or os.path.basename(c['f'])[:-4]): c['at'] for c in s['cues'] if c.get('bus') == 'vo' and ('/vo/' in c['f'] or c.get('sync'))}
    cues[sid]['_len'] = s['length']
open(os.path.join(ROOT, 'assets/vo-env.js'), 'w').write('window.VOENV=' + json.dumps(env) + ';\n')
open(os.path.join(ROOT, 'assets/cues.js'), 'w').write('window.CUES=' + json.dumps(cues) + ';\n')
print('envelopes', len(env), 'scenes', list(cues))
