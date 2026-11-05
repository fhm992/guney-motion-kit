# Sound effects, synthesised with numpy (no downloads, no licences). SFX[name]() -> mono float32 array at 48 kHz. Deterministic.
# Render the whole library to WAV files:  python3 tools/audio/sfx_synth.py sfx/synth
# Use in a mix: tools/audio/mixdown.py reads cue names straight from this table (or from the WAVs).
import numpy as np

SR = 48000


def t_(d):
    return np.arange(int(SR * d)) / SR


def rng(seed):
    return np.random.default_rng(seed)


def band(x, lo, hi, soft=0.25):
    """FFT band-pass with soft edges."""
    n = len(x)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    m = 1 / (1 + np.exp(-(np.log(fr + 1) - np.log(lo)) / soft)) * 1 / (1 + np.exp((np.log(fr + 1) - np.log(hi)) / soft))
    return np.fft.irfft(X * m, n)


def sweep_noise(d, f0, f1, width=0.6, seed=1, fmid=None):
    """noise whose band centre glides f0 -> (fmid) -> f1, overlap-add of short filtered grains"""
    n = int(SR * d)
    out = np.zeros(n)
    hop = 960
    win = np.hanning(hop * 2)
    nz = rng(seed).standard_normal(n + hop * 2)
    for i in range(0, n, hop):
        u = i / n
        if fmid:
            fc = np.exp(np.interp(u, [0, 0.55, 1], np.log([f0, fmid, f1])))
        else:
            fc = np.exp(np.log(f0) + (np.log(f1) - np.log(f0)) * u)
        g = band(nz[i:i + hop * 2], fc * (1 - width / 2), fc * (1 + width), 0.18) * win
        j = min(n, i + hop * 2)
        out[i:j] += g[: j - i]
    return out


def env(n, a=0.005, r=0.1, shape=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(r, 1e-4))
    return e


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return (x / m * peak).astype(np.float32)


def sine_glide(d, f0, f1, curve=1.0):
    t = t_(d)
    u = (t / d) ** curve
    f = f0 * (f1 / f0) ** u
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def bell(f, d=1.6, parts=((1, 1, 1), (2.76, 0.4, 1.8), (5.4, 0.2, 3), (0.5, 0.25, 0.7)), detune=1.002):
    t = t_(d)
    s = np.zeros_like(t)
    for m, a, k in parts:
        s += a * (np.sin(2 * np.pi * f * m * t) + 0.5 * np.sin(2 * np.pi * f * m * detune * t)) * np.exp(-t * k * 2.2 / d * 2)
    return s * np.minimum(1, t / 0.003)


def pluck(f, d=0.6, bright=1.0):
    t = t_(d)
    s = sum((0.6 ** k) * bright ** k * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (4 + 3 * k)) for k in range(5))
    return s * np.minimum(1, t / 0.004)


def click(seed=1, d=0.03, lo=2000, hi=9000, body=180):
    n = int(SR * d)
    x = band(rng(seed).standard_normal(n), lo, hi) * env(n, 0.0005, 0.006)
    x = x / (np.max(np.abs(x)) + 1e-9)
    t = t_(d)
    x += 0.5 * np.sin(2 * np.pi * body * t) * np.exp(-t / 0.008)
    return x


def pop(f0=700, f1=280, d=0.12):
    x = sine_glide(d, f0, f1, 0.5) * env(int(SR * d), 0.002, 0.045)
    return x + 0.15 * click(5, d, 1500, 6000, 0)[: len(x)]


def thump(f0=110, f1=55, d=0.35, noise=0.3, seed=3):
    n = int(SR * d)
    x = sine_glide(d, f0, f1, 0.4) * env(n, 0.002, d / 4)
    x += noise * band(rng(seed).standard_normal(n), 80, 900) * env(n, 0.001, 0.03)
    return x


def grains(d, n, lo, hi, gd=0.12, seed=4, pitch=None):
    out = np.zeros(int(SR * d))
    r = rng(seed)
    for k in range(n):
        st = int(r.uniform(0, d - gd) * SR)
        if pitch:
            f = r.uniform(*pitch)
            g = np.sin(2 * np.pi * f * t_(gd)) * env(int(SR * gd), 0.002, gd / 3)
        else:
            g = band(r.standard_normal(int(SR * gd)), lo, hi) * env(int(SR * gd), 0.004, gd / 3)
        out[st:st + len(g)] += g * r.uniform(0.4, 1)
    return out


def swell(x, a=0.6):
    n = len(x)
    u = np.linspace(0, 1, n)
    return x * np.sin(np.pi * np.clip(u / a, 0, 1) * 0.5) * np.clip((1 - u) / (1 - a + 1e-6), 0, 1) ** 0.7


def add(*xs):
    n = max(len(x) for x in xs)
    return sum(np.pad(x, (0, n - len(x))) for x in xs)


def chain(*parts, gap=0.0):
    out = []
    for p in parts:
        out.append(p)
        out.append(np.zeros(int(SR * gap)))
    return np.concatenate(out)


def mixat(base_d, items):
    out = np.zeros(int(SR * base_d))
    for t0, x, g in items:
        i = int(t0 * SR)
        j = min(len(out), i + len(x))
        out[i:j] += g * x[: j - i]
    return out


N = lambda d, s=1: rng(s).standard_normal(int(SR * d))

SFX = {
    'whoosh': lambda: swell(sweep_noise(0.8, 300, 700, 0.7, 11, fmid=1700), 0.62),
    'whoosh_rev': lambda: swell(sweep_noise(0.8, 300, 700, 0.7, 11, fmid=1700), 0.62)[::-1].copy(),
    'swish': lambda: swell(sweep_noise(0.38, 1200, 3800, 0.6, 12), 0.5),
    'flick': lambda: swell(sweep_noise(0.14, 2000, 5000, 0.6, 13), 0.4),
    'slide': lambda: swell(sweep_noise(0.45, 500, 1400, 0.6, 14), 0.5),
    'pop': lambda: pop(),
    'popup': lambda: pop(500, 900, 0.12),
    'hop': lambda: pop(900, 1300, 0.08) * 0.6,
    'poprip': lambda: mixat(0.8, [(0.06 * k + 0.02 * np.sin(k * 3), pop(600 + 70 * ((k * 5) % 7), 300, 0.1), 0.7 - 0.05 * k) for k in range(10)]),
    'key1': lambda: click(21, 0.035, 2500, 9000, 210) * 0.8,
    'key2': lambda: click(22, 0.035, 2000, 8000, 170) * 0.8,
    'click': lambda: click(23, 0.04, 1800, 7000, 240),
    'copy': lambda: chain(click(24, 0.03), click(25, 0.03), gap=0.05),
    'paste': lambda: click(26, 0.05, 1200, 5000, 150),
    'select': lambda: pop(800, 1200, 0.07) + 0.5 * click(27, 0.07),
    'refresh': lambda: sine_glide(0.18, 380, 950, 0.7) * env(int(SR * 0.18), 0.01, 0.07) + 0.4 * click(28, 0.18),
    'sparkle': lambda: grains(0.9, 14, 0, 0, 0.18, 31, pitch=(2400, 5200)) * 0.6,
    'shimmer': lambda: grains(1.4, 26, 0, 0, 0.25, 32, pitch=(1800, 4800)) * 0.5,
    'glint': lambda: bell(3136, 0.6, ((1, 1, 2), (1.5, 0.4, 3))) * 0.5,
    'chime': lambda: add(bell(1175, 2.2) * 0.6, 0.4 * np.pad(bell(1568, 2.0), (int(SR * 0.09), 0))),
    'ding': lambda: chain(bell(1760, 0.18, ((1, 1, 6),)), bell(2349, 1.4)) * 0.6,
    'check': lambda: chain(pluck(1319, 0.08), pluck(1760, 0.5)) * 0.5,
    'thunk': lambda: thump(120, 60, 0.4, 0.25),
    'impact': lambda: thump(80, 38, 1.4, 0.4) + 0.3 * swell(band(N(1.4, 41), 40, 400), 0.05),
    'slam': lambda: thump(140, 50, 0.5, 0.6, 42),
    'stamp': lambda: thump(200, 90, 0.25, 0.8, 43),
    'door': lambda: thump(90, 50, 0.5, 0.5, 44) + 0.3 * np.pad(click(45, 0.05, 800, 3000, 100), (int(SR * 0.06), int(SR * 0.39))),
    'step': lambda: thump(95, 60, 0.12, 0.6, 46) * 0.7,
    'plank': lambda: pluck(330, 0.3, 0.6) + 0.6 * click(47, 0.3, 800, 4000, 0),
    'buzz': lambda: chain(*[(np.sin(2 * np.pi * 150 * t_(0.22)) + 0.35 * np.sin(2 * np.pi * 450 * t_(0.22))) * env(int(SR * 0.22), 0.01, 0.2) for _ in range(2)], gap=0.12) * 0.7,
    'lownote': lambda: add(pluck(73.4, 2.6, 0.7), 0.7 * pluck(110, 2.6, 0.6), 0.4 * pluck(146.8, 2.4, 0.5)) * 0.8,
    'rise': lambda: swell(sweep_noise(1.3, 250, 2400, 0.5, 51), 0.92) * 0.8 + 0.25 * sine_glide(1.3, 220, 880, 1.5) * np.linspace(0, 1, int(SR * 1.3)) ** 2,
    'roomtone': lambda: band(N(18, 52), 40, 300) * 0.05 * np.minimum(1, np.minimum(t_(18) / 3, (18 - t_(18)) / 4)),
    'paper': lambda: grains(0.45, 22, 1500, 6000, 0.03, 53),
    'unfold': lambda: grains(0.7, 40, 1200, 6000, 0.04, 54),
    'crumple': lambda: grains(0.6, 60, 800, 5000, 0.03, 55),
    'flutter': lambda: grains(0.9, 30, 1500, 6000, 0.05, 56),
    'slot': lambda: chain(click(57, 0.03), click(58, 0.04), gap=0.04) + 0.0,
    'lock': lambda: chain(click(59, 0.03, 1500, 6000, 300), bell(2637, 0.4, ((1, 1, 4),)) * 0.3, gap=0.02),
    'no': lambda: ((np.sin(2 * np.pi * 220 * t_(0.32)) + np.sin(2 * np.pi * 233 * t_(0.32))) * env(int(SR * 0.32), 0.01, 0.12)) * 0.5,
    'wind': lambda: swell(sweep_noise(2.4, 300, 500, 0.8, 61, fmid=800), 0.5) * 0.5,
    'inflate': lambda: sine_glide(0.9, 280, 900, 1.2) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t_(0.9))) * env(int(SR * 0.9), 0.1, 0.9) * 0.5 + 0.3 * swell(sweep_noise(0.9, 400, 1500, 0.6, 62), 0.8),
    'deflate': lambda: sine_glide(0.8, 700, 140, 0.6) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 26 * t_(0.8)))) * env(int(SR * 0.8), 0.01, 0.5) * 0.4,
    'strike': lambda: swell(sweep_noise(0.18, 2500, 5500, 0.6, 63), 0.3),
    'scratch': lambda: band(N(0.7, 64), 2000, 6000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t_(0.7)))) * env(int(SR * 0.7), 0.02, 0.5) * 0.4,
    'whistle': lambda: chain(*[np.sin(2 * np.pi * (2300 + 60 * np.sin(2 * np.pi * 30 * t_(0.16))) * t_(0.16)) * env(int(SR * 0.16), 0.01, 0.12) for _ in range(2)], gap=0.06) * 0.35,
    'crash': lambda: thump(110, 45, 0.6, 1.0, 65) + 0.4 * grains(0.6, 20, 500, 3000, 0.05, 66),
    'reset': lambda: chain(pluck(880, 0.07), pluck(1109, 0.07), pluck(1319, 0.3)) * 0.5,
    'water': lambda: band(N(4.5, 67), 1500, 9000) * 0.12 * np.minimum(1, np.minimum(t_(4.5) / 0.6, (4.5 - t_(4.5)) / 0.8)),
    'engine': lambda: sum(np.sin(2 * np.pi * 72 * k * t_(2.2) + 0.3 * np.sin(2 * np.pi * 5 * t_(2.2))) / k for k in range(1, 5)) * 0.25 * np.minimum(1, np.minimum(t_(2.2) / 0.4, (2.2 - t_(2.2)) / 0.6)),
    'drone': lambda: (np.sin(2 * np.pi * 55 * t_(3)) + 0.6 * np.sin(2 * np.pi * 82.4 * t_(3)) + 0.3 * np.sin(2 * np.pi * 110.5 * t_(3))) * np.sin(np.pi * t_(3) / 3) * 0.5,
    'crumble': lambda: grains(0.9, 50, 150, 1500, 0.05, 68),
    'sweep': lambda: swell(band(N(0.5, 69), 500, 3000), 0.5) * 0.6,
    'build': lambda: mixat(0.7, [(0.12 * k, add(pluck(660 * 1.12 ** k, 0.15, 0.5), click(70 + k, 0.03)), 0.6) for k in range(5)]),
    'tick': lambda: click(75, 0.025, 3000, 9000, 1200) * 0.7,
    'ticking': lambda: mixat(2.0, [(0.25 * k, click(76 + k % 2, 0.025, 3000, 9000, 1200), 0.6) for k in range(8)]),
    'roadhum': lambda: band(N(3, 78), 50, 400) * 0.3 * np.minimum(1, np.minimum(t_(3) / 0.5, (3 - t_(3)) / 0.8)),
    'chop': lambda: add(swell(sweep_noise(0.2, 1500, 600, 0.6, 79), 0.6), thump(160, 70, 0.25, 0.4)),
    'wings': lambda: band(N(0.7, 80), 300, 2500) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * t_(0.7)))) * env(int(SR * 0.7), 0.02, 0.4) * 0.5,
    'crackle': lambda: grains(1.0, 70, 3000, 9000, 0.01, 81),
    'melt': lambda: grains(1.0, 18, 0, 0, 0.2, 82, pitch=(800, 2200)) * np.linspace(1, 0.3, int(SR * 1.0)) * 0.5,
    'send': lambda: swell(sweep_noise(0.5, 600, 4000, 0.5, 83), 0.4) + 0.4 * np.pad(bell(2093, 0.6, ((1, 1, 3),)), (int(SR * 0.25), 0))[: int(SR * 0.85)].copy()[: int(SR * 0.5)],
    'breath': lambda: swell(band(N(1.0, 84), 300, 2200), 0.55) * 0.35,
    'rumble': lambda: swell(band(N(1.8, 85), 30, 220), 0.4) * 0.9,
    'cloth': lambda: band(N(0.25, 86), 150, 1200) * env(int(SR * 0.25), 0.01, 0.08),
    'zoomby': lambda: swell(sweep_noise(0.7, 900, 300, 0.6, 87), 0.45) + 0.3 * sine_glide(0.7, 520, 260, 1) * swell(np.ones(int(SR * 0.7)), 0.45),
    'murmur': lambda: sum(band(N(2.5, 88 + k), 200 + 150 * k, 900 + 200 * k) * (0.5 + 0.5 * np.sin(2 * np.pi * (2.3 + k) * t_(2.5) + k)) for k in range(4)) * 0.25 * np.sin(np.pi * t_(2.5) / 2.5),
    'hum': lambda: (np.sin(2 * np.pi * 100 * t_(3)) * 0.4 + band(N(3, 93), 100, 600) * 0.5) * np.minimum(1, np.minimum(t_(3) / 0.4, (3 - t_(3)) / 0.6)) * 0.5,
    'beep': lambda: np.sin(2 * np.pi * 1760 * t_(0.09)) * env(int(SR * 0.09), 0.003, 0.05) * 0.4,
    'bass': lambda: mixat(1.8, [(0.43 * k, thump(70, 45, 0.35, 0.05), 0.8) for k in range(4)]),
    'rope': lambda: bell(1600, 0.35, ((1, 1, 6), (1.43, 0.6, 7))) * 0.4,
    'attach': lambda: pop(600, 900, 0.1) + 0.5 * click(94, 0.1),
    'highlight': lambda: swell(band(N(0.28, 95), 1000, 4000), 0.4) * 0.6,
    'peel': lambda: swell(sweep_noise(0.32, 800, 3000, 0.5, 96), 0.85) * 0.7,
    'counter': lambda: click(97, 0.02, 3000, 9000, 1500) * 0.5,
    'warm': lambda: swell(sum(np.sin(2 * np.pi * f * t_(2.0)) * a for f, a in ((293.7, 0.5), (370, 0.35), (440, 0.35), (587.3, 0.2))), 0.5) * 0.5,
    'robot': lambda: chain(*[np.sign(np.sin(2 * np.pi * f * t_(0.07))) * 0.2 * env(int(SR * 0.07), 0.002, 0.05) for f in (660, 880, 660)], gap=0.02),
    'typewriter': lambda: click(98, 0.05, 1200, 6000, 120),
    'carddeal': lambda: swell(band(N(0.12, 99), 2000, 7000), 0.3),
    'question': lambda: chain(pluck(587, 0.15), pluck(784, 0.4)) * 0.4,
    'ice': lambda: grains(0.9, 60, 3000, 9000, 0.012, 100) + 0.3 * bell(2637, 0.9, ((1, 1, 3), (2.1, 0.5, 4))),
    'snap': lambda: add(click(101, 0.05, 1000, 7000, 300), pop(400, 700, 0.06) * 0.5),
}


if __name__ == '__main__':
    import sys, os, wave
    out = sys.argv[1] if len(sys.argv) > 1 else 'sfx/synth'
    os.makedirs(out, exist_ok=True)
    for name, fn in SFX.items():
        x = norm(fn(), 0.89)
        w = wave.open(os.path.join(out, f'{name}.wav'), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
    print(len(SFX), 'sounds ->', out)
