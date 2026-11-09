# Score for "10 Jobs AI Will Erase by 2030": synthesised in numpy/scipy, no piano.
# Follows plan/cues.json: each job gets its own key; threat = minor + ticking pulse, pivot = major lift,
# prompt = light groove; chapter cards get riser -> boom; finale lifts and resolves.
# Writes assets/audio/music.wav (48 kHz stereo).
import json, numpy as np, wave
from scipy.signal import butter, sosfilt, oaconvolve

SR = 48000
C = json.load(open('plan/cues.json')); E = json.load(open('plan/edit.json'))
TOTAL = E['total']; N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
BUS = {k: np.zeros((2, N), np.float32) for k in ('pad', 'lead', 'bass', 'drums', 'fx')}

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2.2), 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def saw(f, n, ph=0.0):
    t = np.arange(n) / SR; return 2 * ((f * t + ph) % 1.0) - 1
def tri(f, n): return 2 * np.abs(saw(f, n)) - 1
def adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); e = np.full(n, s, np.float32)
    a = min(a, n); e[:a] = np.linspace(0, 1, a, endpoint=False)
    d2 = min(d, n - a); e[a:a + d2] = np.linspace(1, s, d2, endpoint=False)
    r = min(r, n); e[n - r:] *= np.linspace(1, 0, r); return e
def put(bus, t, x, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[:N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    BUS[bus][0, i:i + len(x)] += x * g * L * 1.414; BUS[bus][1, i:i + len(x)] += x * g * R * 1.414

# ---------------- instruments ----------------
def pad(t, notes, dur, g=0.12, cut=1600, a=1.2, r=1.6, bright=0.0):
    n = int((dur + r) * SR)
    for m in notes:
        for k, det in enumerate((-0.09, 0.0, 0.08)):
            x = saw(hz(m + det), n, ph=0.13 * k) * 0.6 + tri(hz(m + det) * 0.5, n) * 0.4
            x = lp(x, cut * (1 + bright)) * adsr(n, a, 0.5, 0.85, r)
            put('pad', t, x, g / len(notes) * 1.6, pan=(-0.6, 0.0, 0.6)[k])
def pluck(t, m, g=0.1, dec=0.35, cut=2600, pan=0.0):
    n = int((dec * 4 + 0.05) * SR); x = saw(hz(m), n) * 0.7 + saw(hz(m) * 1.003, n) * 0.3
    tt = np.arange(n) / SR; body = lp(x, cut) * np.exp(-tt / dec); bite = (x - lp(x, cut)) * np.exp(-tt / (dec * 0.15)) * 0.4
    y = (body + bite) * adsr(n, 0.003, 0.0, 1, 0.05); put('lead', t, y, g, pan)
def mallet(t, m, g=0.08, pan=0.0):  # soft sine mallet (kalimba-like), not a piano
    n = int(1.6 * SR); tt = np.arange(n) / SR; f = hz(m)
    y = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 4.0 * tt) * np.exp(-tt / 0.08)) * np.exp(-tt / 0.45)
    y *= adsr(n, 0.004, 0, 1, 0.05); put('lead', t, y, g, pan)
def bass(t, m, dur, g=0.22, cut=420):
    n = int((dur + 0.08) * SR); x = np.sin(2 * np.pi * hz(m) * np.arange(n) / SR) * 0.8 + lp(saw(hz(m), n), cut) * 0.5
    put('bass', t, x * adsr(n, 0.008, 0.1, 0.8, 0.08), g)
def kick(t, g=0.5, low=46, hi=150):
    n = int(0.5 * SR); tt = np.arange(n) / SR; f = low + (hi - low) * np.exp(-tt / 0.04)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.18); y[:200] += rng.standard_normal(200) * 0.3 * np.linspace(1, 0, 200)
    put('drums', t, y, g)
def hat(t, g=0.06, dec=0.04, pan=0.2):
    n = int(0.2 * SR); y = hp(rng.standard_normal(n), 7500, 4) * np.exp(-np.arange(n) / SR / dec); put('drums', t, y, g, pan)
def clap(t, g=0.16):
    n = int(0.35 * SR); tt = np.arange(n) / SR; env = np.exp(-tt / 0.09)
    for o in (0, 0.012, 0.024): env += np.exp(-np.maximum(0, tt - o) / 0.008) * (tt >= o) * 0.6
    y = bp(rng.standard_normal(n), 900, 4200) * env; put('drums', t, y, g)
def tick(t, g=0.05, f=3200):
    n = int(0.05 * SR); y = bp(rng.standard_normal(n), f * 0.8, f * 1.25) * np.exp(-np.arange(n) / SR / 0.006); put('drums', t, y, g, 0.3)
def boom(t, g=0.7):
    n = int(3.5 * SR); tt = np.arange(n) / SR; f = 38 + 50 * np.exp(-tt / 0.08)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 1.1) + lp(rng.standard_normal(n), 600) * np.exp(-tt / 0.25) * 0.5
    put('fx', t, y, g)
def riser(t_end, dur=2.6, g=0.22):
    n = int(dur * SR); tt = np.arange(n) / SR; u = tt / dur
    noise = rng.standard_normal(n); y = np.zeros(n)
    for k in range(8):  # band sweeps up
        a, b = int(k * n / 8), int((k + 1) * n / 8); f0 = 400 * 2 ** (k * 0.55)
        y[a:b] = bp(noise[a:b], f0, f0 * 2.2)
    f = 180 + 900 * u ** 2; tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    y = (y * 0.8 + tone) * u ** 2.2; y[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    put('fx', t_end - dur, y, g)
def swell(t, dur, g=0.12):  # reversed cymbal style
    n = int(dur * SR); y = hp(rng.standard_normal(n), 3000) * np.linspace(0, 1, n) ** 3; put('fx', t, y, g, -0.2); put('fx', t, y[::-1][::-1], g * 0.7, 0.2)
def drone(t, m, dur, g=0.12, cut=380):
    n = int((dur + 1.5) * SR); tt = np.arange(n) / SR
    x = (saw(hz(m), n) + saw(hz(m) * 1.004, n) + 0.6 * saw(hz(m + 7) * 0.998, n)) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * tt))
    put('pad', t, lp(x, cut) * adsr(n, 2.0, 0.5, 0.9, 1.5), g, 0)
def shimmer(t, notes, dur, g=0.035):
    n = int((dur + 1) * SR); tt = np.arange(n) / SR
    for i, m in enumerate(notes):
        y = np.sin(2 * np.pi * hz(m + 24) * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * (0.3 + i * 0.07) * tt)); put('pad', t, y * adsr(n, 1.0, 0, 1, 1.0), g, (-0.7, 0.7)[i % 2])

MAJ = [0, 2, 4, 5, 7, 9, 11]; MIN = [0, 2, 3, 5, 7, 8, 10]
def chord(root, kind, deg):
    sc = MAJ if kind == 'maj' else MIN
    return [root + sc[(deg + k) % 7] + 12 * ((deg + k) // 7) for k in (0, 2, 4)]

# ---------------- sections ----------------
def threat(a, b, root, bpm):
    beat = 60 / bpm; drone(a, root - 12, b - a, 0.13)
    prog = [0, 5, 3, 6]; t = a; k = 0
    while t < b - 0.2:
        ch = chord(root, 'min', prog[k % 4]); pad(t, [m + 12 for m in ch], min(beat * 8, b - t), g=0.07, cut=900, a=1.5)
        for i in range(8):  # bass pulse on 8ths
            tb = t + i * beat / 2
            if tb < b: bass(tb, ch[0] - 12, beat * 0.4, g=0.13 if i % 2 else 0.18)
        for i in range(16):  # ticking clock
            tb = t + i * beat / 4
            if tb < b: tick(tb, g=0.03 if i % 4 else 0.05, f=2600 if i % 4 else 3400)
        if k % 2 == 1:  # sparse low motif
            for i, d in enumerate((0, 2, 1)):
                tb = t + beat * (4 + i * 1.5)
                if tb < b: pluck(tb, root + MIN[d] + 12, g=0.05, dec=0.5, cut=1400, pan=-0.3)
        t += beat * 8; k += 1
def lift(a, b, root, bpm, groove=False, seed=0):
    beat = 60 / bpm; prog = [0, 4, 5, 3] if seed % 2 == 0 else [0, 5, 3, 4]; t = a; k = 0
    r = np.random.default_rng(seed)
    arp = [0, 2, 4, 7, 4, 2, 0, 4] if seed % 3 == 0 else [0, 4, 7, 9, 7, 4, 2, 4] if seed % 3 == 1 else [4, 2, 0, 2, 4, 7, 4, 2]
    while t < b - 0.2:
        deg = prog[k % 4]; ch = chord(root, 'maj', deg)
        pad(t, [m + 12 for m in ch], min(beat * 4, b - t), g=0.08, cut=2200, a=0.6, r=1.2)
        for i in range(8):
            tb = t + i * beat / 2
            if tb >= b: break
            sc = [root + MAJ[(deg + x) % 7] + 12 * ((deg + x) // 7) for x in range(10)]
            m = sc[arp[i] % len(sc)] + 24
            (pluck if groove or seed % 2 == 0 else mallet)(tb, m, g=0.055 if i % 2 else 0.07, pan=(-0.35, 0.35)[i % 2])
            if i % 2 == 0: bass(tb, ch[0] - 12, beat * 0.45, g=0.16)
        if groove:
            for i in range(4):
                tb = t + i * beat
                if tb >= b: break
                if i % 2 == 0: kick(tb, 0.36)
                else: clap(tb, 0.08)
                hat(tb + beat / 2, 0.03); hat(tb + beat / 4, 0.012); hat(tb + 3 * beat / 4, 0.012)
        else:
            if k % 2 == 0: kick(t, 0.22)
        t += beat * 4; k += 1
def card(a, desc, root, nxt=None):
    boom(a, 0.75); kick(a, 0.6, 40, 120)
    shimmer(a, [root, root + 7], desc - a + 0.5, 0.03)
    pad(a, [root, root + 7, root + 12], desc - a, g=0.09, cut=1200, a=0.3, r=1.5)
    for i in range(int((desc - a) / 0.5)): tick(a + 0.5 + i * 0.5, 0.04, 2000)

# intro
I = C['intro']
pad(0.0, [57, 64, 69, 73], I['hook'] + 0.5, g=0.16, cut=1800, a=2.5, r=1.2); shimmer(0.0, [57, 64], I['hook'] + 0.5, 0.05); swell(I['hook'] - 1.6, 1.6, 0.1)
drone(I['hook'], 33, I['boss'] - I['hook'], 0.16)
for i in range(int((I['boss'] - I['hook']) / 0.95)):  # heartbeat
    tb = I['hook'] + 0.4 + i * 0.95; kick(tb, 0.28, 40, 90); kick(tb + 0.24, 0.18, 40, 85)
threat(I['boss'], I['loud'], 45, 96)
boom(I['loud'], 0.45); drone(I['loud'], 33, I['title'] - I['loud'], 0.1, 220)
# title: building arp at 110 bpm, riser into chapter 1
beat = 60 / 110; t = I['title']; k = 0
while t < I['end'] - 0.1:
    ch = chord(45, 'min', [0, 5, 2, 6][k % 4]); pad(t, [m + 12 for m in ch], beat * 4, g=0.08, cut=1400 + k * 300, a=0.2, r=0.8)
    for i in range(16):
        tb = t + i * beat / 4
        if tb < I['end']: pluck(tb, ch[i % 3] + 24 + 12 * (i // 8 % 2), g=0.04 + 0.01 * k, dec=0.12, cut=1800 + k * 500, pan=(-0.4, 0.4)[i % 2])
    for i in range(4):
        tb = t + i * beat
        if tb < I['end'] - 0.3: kick(tb, 0.2 + 0.05 * k); bass(tb, ch[0] - 12, beat * 0.8, 0.12)
    t += beat * 4; k += 1
riser(I['end'], 3.0, 0.24)

# jobs: own key each, threat (minor) -> pivot (major) -> prompt groove
ROOTS = [45, 48, 50, 43, 52, 47, 53, 46, 49, 44]
BPM = [92, 96, 90, 94, 100, 88, 98, 92, 96, 102]
for j in range(10):
    c = C[f'job{j + 1:02d}']; r = ROOTS[j]
    card(c['start'], c['desc'], r - 12)
    threat(c['desc'], c['pivot'], r, BPM[j])
    swell(c['pivot'] - 1.2, 1.2, 0.08)
    lift(c['pivot'], c['prompt'], r + 3, BPM[j] + 4, groove=False, seed=j)   # relative major
    lift(c['prompt'], c['end'], r + 3, BPM[j] + 8, groove=True, seed=j + 1)
    riser(c['end'], 2.6, 0.2)

# finale
F = C['finale']; r = 50  # D major
pad(F['start'], [62, 66, 69], F['breath'] - F['start'], g=0.1, cut=1500, a=1.5); shimmer(F['start'], [62, 69], F['breath'] - F['start'], 0.04)
for i in range(int((F['breath'] - F['start']) / 0.6)): mallet(F['start'] + i * 0.6, [74, 78, 81, 78][i % 4], 0.05, (-0.3, 0.3)[i % 2])
swell(F['breath'] - 1.5, 1.5, 0.12); boom(F['breath'], 0.5)
lift(F['breath'], F['end_voice'] + 0.5, r, 104, groove=True, seed=3)
# melody on top in the breath and after
mel = [74, 76, 78, 81, 78, 76, 74, 71]
for i, m in enumerate(mel * 2):
    tb = F['breath'] + i * 0.577
    if tb < F['next'] + 3: pluck(tb, m, 0.07, 0.4, 3200, (-0.2, 0.2)[i % 2])
# end card: resolve and fade
pad(F['end_voice'] + 0.5, [50, 57, 62, 66, 69], TOTAL - F['end_voice'], g=0.16, cut=2000, a=0.4, r=3.5); shimmer(F['end_voice'] + 0.5, [62, 69], TOTAL - F['end_voice'] - 0.5, 0.05)
boom(F['end_voice'] + 0.5, 0.4)

# ---------------- mix ----------------
def reverb(x, secs=2.4, wet=0.25, seed=1):
    r2 = np.random.default_rng(seed); n = int(secs * SR); tt = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = r2.standard_normal(n) * np.exp(-tt / (secs / 6.9)); ir = lp(ir, 6000); ir /= np.sqrt((ir ** 2).sum())
        out[ch] = oaconvolve(x[ch], ir)[:x.shape[1]]
    return x * (1 - wet) + out * wet * 1.6
mix = reverb(BUS['pad'], 3.0, 0.35) + reverb(BUS['lead'], 2.2, 0.3, 2) + BUS['bass'] + reverb(BUS['drums'], 1.2, 0.12, 3) + reverb(BUS['fx'], 2.5, 0.3, 4)
mix[:, :] = hp(mix, 28)
# duck under the voice: smooth voice envelope (attack 60 ms, release 450 ms)
v = np.load('qa/voice_edit.npy'); hop = 480; nfr = len(v) // hop
env = np.sqrt((v[:nfr * hop].reshape(nfr, hop) ** 2).mean(1)); env = np.clip(env / (np.percentile(env[env > 0.005], 85) + 1e-9), 0, 1)
sm = np.zeros_like(env); a_, r_ = 1 - np.exp(-1 / (0.06 * 100)), 1 - np.exp(-1 / (0.45 * 100))
for i in range(1, nfr): sm[i] = sm[i - 1] + (a_ if env[i] > sm[i - 1] else r_) * (env[i] - sm[i - 1])
duck = np.interp(np.arange(N) / hop, np.arange(nfr), 1 - 0.66 * sm, right=1.0)
mix *= duck
peak = np.abs(mix).max(); mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4) * 0.5   # gentle saturation, -6 dB peak
mix = mix[:, :int(TOTAL * SR)]
fo = int(2.5 * SR); mix[:, -fo:] *= np.linspace(1, 0, fo)
w = wave.open('assets/audio/music.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix.T * 32767).astype('<i2').tobytes()); w.close()
print('music', round(TOTAL, 1), 's')
