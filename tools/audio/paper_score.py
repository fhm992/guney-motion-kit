#!/usr/bin/env python3
"""Hand-made-sounding music for the paper cut-out look: marimba, plucked strings (pizzicato), a soft felt pad,
woodblock, shaker and a little glockenspiel. Two themes: a hollow, minor one for Sam (the copy-paster) and a bright
one for Maya (the coached one); they can play together.
Run from a project folder:
  python3 ../../tools/audio/paper_score.py --map plan/paper-score.json qa/audio/score.wav
  python3 ../../tools/audio/paper_score.py --loop <mood> --bars 8 out.wav       (one mood, for another project)
  python3 ../../tools/audio/paper_score.py --list
Map: {"bpm": 100, "dur": 24.5, "parts": [[0, "puzzle"], [7.2, "puzzle-busy"], [14.5, "letdown"], [18.6, "bright"]]}
Moods change on the given second (snapped to the next beat); a part ends where the next one starts."""
import json, sys, wave
import numpy as np

SR = 48000
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
def hz(n):
    name, octv = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)

rng = np.random.default_rng(11)
def env_exp(n, tau): return np.exp(-np.arange(n) / (SR * tau))
def marimba(f, level=1.0, d=1.2):
    n = int(SR * d); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * env_exp(n, 0.42) + 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * env_exp(n, 0.06) + 0.08 * np.sin(2 * np.pi * f * 9.2 * t) * env_exp(n, 0.015)
    x[: int(SR * 0.002)] *= np.linspace(0, 1, int(SR * 0.002))
    return x * level
def pizz(f, level=1.0, d=0.9):
    n = int(SR * d); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.994
    return out * env_exp(n, 0.35) * level
def glock(f, level=1.0, d=1.8):
    n = int(SR * d); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * env_exp(n, 0.3) + 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * env_exp(n, 0.1)) * env_exp(n, 0.7) * level
def wood(level=1.0, f=900):
    n = int(SR * 0.08); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env_exp(n, 0.012) * level
def shaker(level=1.0):
    n = int(SR * 0.09); x = rng.standard_normal(n); x = np.diff(np.concatenate([[0], x]))
    return x * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.25 * level
def pad(freqs, d, level=1.0):
    n = int(SR * d); t = np.arange(n) / SR; x = np.zeros(n)
    for k, f in enumerate(freqs):
        for det in (-0.12, 0.12):
            ph = 2 * np.pi * (f + det) * t
            x += np.sin(ph) + 0.12 * np.sin(3 * ph)
    a = min(n, int(SR * 0.8)); e = np.ones(n); e[:a] = np.linspace(0, 1, a); r = min(n, int(SR * 0.9)); e[-r:] *= np.linspace(1, 0, r)
    return x * e * level / (2 * len(freqs))

CH = {'Am': ['A2', 'C3', 'E3'], 'F': ['F2', 'A2', 'C3'], 'C': ['C3', 'E3', 'G3'], 'G': ['G2', 'B2', 'D3'], 'Dm': ['D3', 'F3', 'A3'], 'Em': ['E3', 'G3', 'B3']}
# mood: chords (one per bar), what plays, levels
MOODS = {
    'puzzle':      dict(ch=['Am', 'Am', 'F', 'G'], pz='8', mar='sam', pad=0.5, wood=0, shk=0, glk=0),
    'puzzle-busy': dict(ch=['Am', 'F', 'Am', 'G'], pz='8', mar='sam', pad=0.5, wood=0.5, shk=0.5, glk=0),
    'letdown':     dict(ch=['Dm', 'Am'], pz='', mar='fall', pad=0.6, wood=0, shk=0, glk=0),
    'bright':      dict(ch=['C', 'F', 'Am', 'G'], pz='8', mar='maya', pad=0.55, wood=0.6, shk=0.6, glk=0.5),
    'duet':        dict(ch=['F', 'C', 'G', 'Am'], pz='8', mar='both', pad=0.55, wood=0.5, shk=0.5, glk=0.4),
    'think':       dict(ch=['Am', 'Em', 'F', 'C'], pz='4', mar='', pad=0.6, wood=0.3, shk=0, glk=0.3),
    'win':         dict(ch=['F', 'G', 'C', 'C'], pz='8', mar='maya', pad=0.6, wood=0.7, shk=0.7, glk=0.7),
}
SAM = [('A4', 0), ('C5', 1), ('B4', 1.5), ('A4', 2), ('E4', 3)]                    # per bar, beat offsets (hollow, questioning)
MAYA = [('E5', 0), ('G5', 0.5), ('C6', 1), ('B5', 2), ('G5', 2.5), ('A5', 3), ('G5', 3.5)]
FALL = [('E4', 0), ('D4', 1.5), ('C4', 3)]

def render_part(mood, bars, bpm, buf, t0):
    m = MOODS[mood]; beat = 60 / bpm; bar = 4 * beat
    def put(x, t, g=1.0, pan=0.0):
        i = int((t0 + t) * SR); j = min(buf.shape[1], i + len(x))
        if i >= buf.shape[1] or j <= i: return
        buf[0, i:j] += x[: j - i] * g * (1 - pan) ; buf[1, i:j] += x[: j - i] * g * (1 + pan)
    for b in range(bars):
        name = m['ch'][b % len(m['ch'])]; ch = [hz(n) for n in CH[name]]; tb = b * bar
        put(pad([c * 2 for c in ch], bar + 0.8), tb, m['pad'] * 0.5)
        if m['pz']:
            step = beat / 2 if m['pz'] == '8' else beat
            for k in range(int(bar / step)):
                f = ch[[0, 2, 1, 2][k % 4]] * (1 if k % 2 == 0 else 2)
                put(pizz(f), tb + k * step, 0.35 * (1.0 if k % 2 == 0 else 0.7), -0.2)
        else:
            put(pizz(ch[0] / 2, d=1.6), tb, 0.35)
        mel = {'sam': SAM, 'maya': MAYA, 'fall': FALL, 'both': SAM if b % 2 == 0 else MAYA}.get(m['mar'], [])
        for n, off in mel:
            put(marimba(hz(n)), tb + off * beat, 0.32, 0.25)
        if m['glk'] and b % 2 == 1: put(glock(hz('E6')), tb + 3.5 * beat, 0.18 * m['glk'] / 0.5, 0.3); put(glock(hz('G6')), tb + 3.75 * beat, 0.14 * m['glk'] / 0.5, 0.3)
        for k in range(4):
            if m['wood']: put(wood(f=1000 if k % 2 else 760), tb + k * beat, 0.25 * m['wood'], 0.15)
            if m['shk']:
                for h in (0.5,): put(shaker(), tb + (k + h) * beat, 0.5 * m['shk'], -0.3)

def reverb(x, sec=2.2, mix=0.25):
    n = int(SR * sec); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * sec / 5)); ir /= np.sqrt((ir ** 2).sum())
    L = x.shape[1] + n; N = 1 << (L - 1).bit_length(); IR = np.fft.rfft(ir, N); out = np.zeros_like(x)
    for c in range(2):
        out[c] = np.fft.irfft(np.fft.rfft(x[c], N) * IR, N)[: x.shape[1]]
    return x * (1 - mix) + out * mix

def render(parts, bpm, dur):
    beat = 60 / bpm; bar = 4 * beat
    buf = np.zeros((2, int(SR * (dur + 3))))
    starts = [round(t / beat) * beat for t, _ in parts]
    for k, (t, mood) in enumerate(parts):
        end = starts[k + 1] if k + 1 < len(parts) else dur
        bars = max(1, int(np.ceil((end - starts[k]) / bar)))
        part = np.zeros_like(buf); render_part(mood, bars, bpm, part, starts[k])
        # each part fades out where the next begins
        e = np.ones(buf.shape[1]); i = int(end * SR); fl = int(SR * 0.35)
        if k + 1 < len(parts): e[i: i + fl] = np.linspace(1, 0, len(e[i: i + fl])); e[i + fl:] = 0
        buf += part * e
    buf = reverb(buf)[:, : int(SR * dur)]
    fo = int(SR * 1.2); buf[:, -fo:] *= np.linspace(1, 0, fo)
    return buf / (np.abs(buf).max() + 1e-9) * 0.8

def save(x, path):
    w = wave.open(path, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1).T * 32767).astype(np.int16).tobytes()); w.close()

if __name__ == '__main__':
    a = sys.argv[1:]
    if '--list' in a: print(' '.join(MOODS)); sys.exit()
    if '--map' in a:
        m = json.load(open(a[a.index('--map') + 1])); out = [x for x in a if x.endswith('.wav')][0]
        save(render(m['parts'], m.get('bpm', 100), m['dur']), out); print('score ->', out)
    elif '--loop' in a:
        mood = a[a.index('--loop') + 1]; bars = int(a[a.index('--bars') + 1]) if '--bars' in a else 8; bpm = 100; out = [x for x in a if x.endswith('.wav')][0]
        save(render([[0, mood]], bpm, bars * 4 * 60 / bpm + 1.2), out); print('loop ->', out)
    else: print(__doc__)
