# Original score, made in code (no piano). Run from a project folder: python3 ../../tools/paper/music.py  (reads plan/music.json)
# Original score, made in code (no piano): marimba, pizzicato, kalimba, upright-style bass, warm pads, brushes.
# One section per chapter so the mood follows the story. Writes audio/music.wav (44.1 kHz stereo).
import numpy as np, wave, os, json
SR = 44100; BPM = 92; BEAT = 60 / BPM; BAR = 4 * BEAT
CFG = json.load(open('plan/music.json')); BPM = CFG.get('bpm', BPM); BEAT = 60 / BPM; BAR = 4 * BEAT
END = CFG['end']
rng = np.random.default_rng(3)
OUT = 'audio'; os.makedirs(OUT, exist_ok=True)
L = np.zeros(int(END * SR) + SR * 4, np.float32); R = np.zeros_like(L)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def t_(d): return np.arange(int(d * SR)) / SR
cache = {}
def add(buf, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0 or i >= len(L): return
    n = min(len(buf), len(L) - i); g = gain
    L[i:i + n] += buf[:n] * g * np.sqrt(0.5 * (1 - pan)); R[i:i + n] += buf[:n] * g * np.sqrt(0.5 * (1 + pan))
def mk(key, fn):
    if key not in cache: cache[key] = fn().astype(np.float32)
    return cache[key]
def marimba(m):
    def f():
        d = 1.0; t = t_(d); f0 = hz(m)
        y = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.45) + 0.28 * np.sin(2 * np.pi * f0 * 3.93 * t) * np.exp(-t / 0.07) + 0.08 * np.sin(2 * np.pi * f0 * 9.2 * t) * np.exp(-t / 0.025)
        return y * np.minimum(1, t / 0.002)
    return mk(('mar', m), f)
def kalimba(m):
    def f():
        d = 1.6; t = t_(d); f0 = hz(m)
        y = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.8) + 0.25 * np.sin(2 * np.pi * f0 * 5.4 * t) * np.exp(-t / 0.05) + 0.12 * np.sin(2 * np.pi * f0 * 2.01 * t) * np.exp(-t / 0.3)
        return y * np.minimum(1, t / 0.003)
    return mk(('kal', m), f)
def pizz(m):
    def f():
        d = 0.45; t = t_(d); f0 = hz(m); y = np.zeros_like(t)
        for k in range(1, 9): y += (1 / k) * np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * (6 + 4 * k))
        return y * np.minimum(1, t / 0.004)
    return mk(('piz', m), f)
def bass(m, d=0.55):
    def f():
        t = t_(d + 0.1); f0 = hz(m)
        y = np.sin(2 * np.pi * f0 * t) + 0.35 * np.sin(2 * np.pi * 2 * f0 * t) * np.exp(-t / 0.12) + 0.12 * np.sin(2 * np.pi * 3 * f0 * t) * np.exp(-t / 0.06)
        e = np.minimum(1, t / 0.008) * np.exp(-t / 0.5) * np.clip((d + 0.1 - t) / 0.1, 0, 1)
        return y * e
    return mk(('bas', m, round(d, 2)), f)
def pad(ms, d, bright=0.5):
    def f():
        t = t_(d); y = np.zeros_like(t)
        for m in ms:
            for det in (-0.0018, 0.0016):
                f0 = hz(m) * (1 + det)
                for k in range(1, 9): y += (1 / k) * (bright ** (k - 1)) * np.sin(2 * np.pi * f0 * k * t + k * 0.7)
        a = min(0.9, d * 0.35); e = np.minimum(1, t / a) * np.clip((d - t) / a, 0, 1)
        return y * e * (1 + 0.08 * np.sin(2 * np.pi * 0.4 * t)) / (len(ms) * 4)
    return mk(('pad', tuple(ms), round(d, 2), bright), f)
def noise_hit(lo, hi, d, dec):
    def f():
        n = rng.standard_normal(int(d * SR)); X = np.fft.rfft(n); fr = np.fft.rfftfreq(len(n), 1 / SR); X[(fr < lo) | (fr > hi)] = 0
        t = t_(d); return np.fft.irfft(X, len(n)) * np.exp(-t / dec) * np.minimum(1, t / 0.002)
    return mk(('nz', lo, hi, d, dec), f)
def kick():
    def f():
        t = t_(0.35); ff = 52 * (1 + 2.2 * np.exp(-t / 0.03)); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.12)
    return mk(('kick',), f)
brush = lambda: noise_hit(1800, 9000, 0.25, 0.07)
shaker = lambda: noise_hit(5000, 10000, 0.06, 0.016)
tickc = lambda: noise_hit(3000, 9000, 0.03, 0.006)

# chords as MIDI (root triads). D=62
CH = {'D': [50, 62, 66, 69], 'Bm': [47, 59, 62, 66], 'G': [43, 59, 62, 67], 'A': [45, 61, 64, 69], 'Em': [40, 59, 64, 67], 'C': [48, 60, 64, 67],
      'Dm': [50, 62, 65, 69], 'Bb': [46, 58, 62, 65], 'Gm': [43, 58, 62, 67], 'F': [41, 60, 65, 69], 'F#m': [42, 61, 66, 69], 'A7': [45, 61, 64, 67]}
SECTIONS = [tuple(s) for s in CFG['sections']]  # start, end, progression, style (tension|groove|play|warm|cta|lift), intensity 1-3
ARP = [0, 1, 2, 3, 2, 1, 2, 3]
for (a, b, prog, style, inten) in SECTIONS:
    nb = int(np.ceil((b - a) / BAR))
    for bi in range(nb):
        t0 = a + bi * BAR
        if t0 >= b: break
        ch = CH[prog[bi % len(prog)]]; root, tones = ch[0], ch[1:]
        bar_end = min(t0 + BAR, b); bd = bar_end - t0 + 0.6
        bright = {'tension': 0.35, 'warm': 0.45, 'cta': 0.4, 'lift': 0.6}.get(style, 0.45)
        add(pad(tones + [tones[0] - 12], bd, bright), t0, 0.32 if style != 'lift' else 0.42)
        for k in range(8):  # eighth-note grid
            tt = t0 + k * BEAT / 2
            if tt >= b - 0.05: break
            beat = k // 2; off = k % 2
            if style == 'tension':
                if off == 0: add(bass(root, BEAT * 0.45), tt, 0.42); add(tickc(), tt, 0.10, 0.4)
                if inten >= 2: add(marimba(tones[ARP[k] % 3] + 12), tt, 0.16, -0.3 + 0.1 * k)
                if k == 0 and inten >= 2: add(kick(), tt, 0.35)
            elif style in ('groove', 'play', 'lift'):
                m = tones[ARP[k] % 3] + (12 if k in (3, 7) else 0)
                if style == 'play' and off: add(pizz(m + 12), tt, 0.20, 0.35)
                add(marimba(m), tt, 0.18 if off else 0.22, -0.35 + 0.09 * k)
                if k in (0, 4): add(bass(root, BEAT * 0.9), tt, 0.5)
                if k == 7 and inten >= 2: add(bass(root + 7, BEAT * 0.4), tt, 0.35)
                if inten >= 2: add(shaker(), tt, 0.04 + 0.02 * off, 0.5)
                if inten >= 3 and k in (2, 6): add(brush(), tt, 0.22, -0.2)
                if inten >= 3 and k in (0, 5): add(kick(), tt, 0.38)
                if style == 'lift' and k in (0, 4): add(kalimba(tones[2] + 24), tt, 0.12, 0.3)
            elif style == 'warm':
                if k in (0, 3, 6): add(kalimba(tones[ARP[k] % 3] + 12), tt, 0.20, -0.2 + 0.1 * k)
                if k in (0, 4): add(bass(root, BEAT * 1.6), tt, 0.40)
                if inten >= 2 and k in (2, 6): add(brush(), tt, 0.12)
            elif style == 'cta':
                if k in (0, 4): add(kalimba(tones[k // 4] + 12), tt, 0.20)
                if k == 0: add(bass(root, BEAT * 3), tt, 0.35)
# final chord of the outro, held to the end
FC = CFG.get('final_chord')
if FC:
    add(pad(CH['D'][1:] + [50, 74], 3.2, 0.6), FC, 0.55)
    for i, mm in enumerate([62, 66, 69, 74, 78]): add(kalimba(mm), FC + i * 0.07, 0.22, -0.4 + 0.2 * i)
    add(bass(38, 2.5), FC, 0.6)

# arrangement automation: fades between sections, the hard stop on "Here is the problem", the dip on "Your boss notices"
g = np.ones(len(L), np.float32); tt = np.arange(len(L)) / SR
def ramp(t0, t1, v0, v1):
    m = (tt >= t0) & (tt < t1); g[m] *= v0 + (v1 - v0) * (tt[m] - t0) / (t1 - t0)
def hold(t0, t1, v): g[(tt >= t0) & (tt < t1)] *= v
ramp(0, 1.5, 0.3, 1)
for t0, t1, lv in CFG.get('stops', []): ramp(t0, t0 + 0.3, 1, lv); hold(t0 + 0.3, t1, lv); ramp(t1, t1 + 1.0, lv, 1)   # music drops out (a dramatic beat)
for t0, t1, lv in CFG.get('dips', []): ramp(t0, t0 + 0.3, 1, lv); hold(t0 + 0.3, t1, lv); ramp(t1, t1 + 0.6, lv, 1)   # music ducks
ramp(END - 2.3, END, 1, 0)
g[tt >= END] = 0
L *= g; R *= g
# gentle glue: soft-clip and normalise to -3 dBFS
mx = max(np.abs(L).max(), np.abs(R).max()); L /= mx; R /= mx
L = np.tanh(L * 1.2) / np.tanh(1.2) * 0.7; R = np.tanh(R * 1.2) / np.tanh(1.2) * 0.7
n = int(END * SR)
st = np.stack([L[:n], R[:n]], 1)
with wave.open(os.path.join(OUT, 'music.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
print('music.wav', n / SR, 's')
