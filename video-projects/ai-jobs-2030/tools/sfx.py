# Synthesised sound effects -> assets/audio/fx/<name>.wav (48 kHz mono). Soft and short, made to sit under the voice.
import numpy as np, wave, os
from scipy.signal import butter, sosfilt
SR = 48000; rng = np.random.default_rng(11); OUT = 'assets/audio/fx'; os.makedirs(OUT, exist_ok=True)
t_ = lambda d: np.arange(int(d * SR)) / SR
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def sweep_noise(d, f0, f1, q=1.6, env=None):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); seg = 24
    for k in range(seg):
        a, b = k * n // seg, (k + 1) * n // seg; f = f0 * (f1 / f0) ** (k / (seg - 1))
        y[a:b] = bp(x[max(0, a - 2000):b], f / q, min(f * q, SR / 2.2))[-(b - a):]
    return y * (env if env is not None else 1)
def fade(x, a=0.005, r=0.02):
    a, r = int(a * SR), int(r * SR); x[:a] *= np.linspace(0, 1, a); x[-r:] *= np.linspace(1, 0, r); return x
def save(name, x, peak=0.8):
    x = fade(np.asarray(x, np.float64)); x = x / (np.abs(x).max() + 1e-9) * peak
    w = wave.open(f'{OUT}/{name}.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes()); w.close()
def tone(f, d, dec):
    t = t_(d); return np.sin(2 * np.pi * f * t) * np.exp(-t / dec)

t = t_(0.9); u = t / 0.9
save('whoosh', sweep_noise(0.9, 300, 2600, 1.5, np.sin(np.pi * u) ** 2), 0.6)
t = t_(1.0); u = t / 1.0
save('whoosh_up', sweep_noise(1.0, 400, 6000, 1.4, u ** 2 * np.exp(-np.maximum(0, u - 0.9) * 40)) + np.sin(2 * np.pi * np.cumsum(300 + 900 * u ** 2) / SR) * u ** 2 * 0.15, 0.6)
t = t_(2.5); u = t / 2.5
save('swell', hp(rng.standard_normal(len(t)), 2500) * u ** 3 + np.sin(2 * np.pi * 220 * t) * u ** 2 * 0.1, 0.5)
t = t_(0.6)
save('stamp', np.sin(2 * np.pi * np.cumsum(55 + 120 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.15) + bp(rng.standard_normal(len(t)), 300, 3000) * np.exp(-t / 0.02) * 0.8, 0.85)
save('chime', sum(tone(f, 2.0, 0.6) * g for f, g in ((1046.5, 1), (1568, 0.6), (2093, 0.35), (2637, 0.2))) + np.concatenate([np.zeros(int(0.12 * SR)), sum(tone(f, 1.88, 0.6) * g for f, g in ((1318.5, 0.8), (1975.5, 0.4)))]), 0.6)
save('ping', tone(1760, 0.6, 0.15) + tone(2637, 0.6, 0.08) * 0.4, 0.5)
t = t_(0.35); u = t / 0.35
save('send', sweep_noise(0.35, 800, 5000, 1.5, np.sin(np.pi * u)) + np.sin(2 * np.pi * np.cumsum(600 + 900 * u) / SR) * np.sin(np.pi * u) * 0.3, 0.45)
t = t_(0.06)
save('key', bp(rng.standard_normal(len(t)), 1800, 5200) * np.exp(-t / 0.008) + np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.01) * 0.4, 0.5)
t = t_(0.18)
save('pop', np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t / 0.04) + 300) / SR) * np.exp(-t / 0.05), 0.5)
t = t_(2.2)
save('beam', (np.sin(2 * np.pi * 420 * t + 3 * np.sin(2 * np.pi * 6 * t)) * 0.5 + bp(rng.standard_normal(len(t)), 2000, 6000) * 0.2) * np.sin(np.pi * t / 2.2) ** 0.5, 0.35)
t = t_(0.7); x = bp(rng.standard_normal(len(t)), 1500, 7000); crk = (rng.random(len(t)) < 0.004) * rng.standard_normal(len(t)) * 6
save('paper', (x * 0.3 + lp(crk, 6000)) * np.sin(np.pi * t / 0.7), 0.4)
t = t_(0.9); s = np.sign(np.sin(2 * np.pi * 14 * t)) * 0.5 + 0.5
save('data', np.sin(2 * np.pi * (1200 + 600 * np.floor(t * 14 % 3)) * t) * s * np.exp(-t / 0.5) * 0.4, 0.3)
t = t_(0.05)
save('tick', bp(rng.standard_normal(len(t)), 2500, 4500) * np.exp(-t / 0.006), 0.5)
t = t_(0.45); x = rng.standard_normal(len(t)); x = np.repeat(x[::40], 40)[:len(t)]
save('glitch', (x * 0.6 + np.sign(np.sin(2 * np.pi * 110 * t)) * 0.4) * (np.floor(t * 30) % 2) * np.exp(-t / 0.25), 0.45)
t = t_(1.4)
save('machine', (lp(np.sign(np.sin(2 * np.pi * 70 * t)), 900) * 0.5 + bp(rng.standard_normal(len(t)), 300, 1200) * 0.4) * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * t)) * np.sin(np.pi * t / 1.4), 0.4)
t = t_(0.4)
save('thud', np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12), 0.6)
t = t_(0.08)
save('click', bp(rng.standard_normal(len(t)), 2000, 6000) * np.exp(-t / 0.006) + np.sin(2 * np.pi * 1200 * t) * np.exp(-t / 0.004) * 0.5, 0.45)
t = t_(3.0)
save('boom', np.sin(2 * np.pi * np.cumsum(36 + 60 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.9) + lp(rng.standard_normal(len(t)), 500) * np.exp(-t / 0.2) * 0.4, 0.85)
save('coin', tone(1975, 0.9, 0.25) + np.concatenate([np.zeros(int(0.08 * SR)), tone(2637, 0.82, 0.3)]) * 0.8, 0.45)
t = t_(0.35)
save('error', np.sign(np.sin(2 * np.pi * 140 * t)) * lp(np.ones(len(t)), 10) * np.exp(-t / 0.15) * 0.5, 0.3)
save('beep', np.sin(2 * np.pi * 2400 * t_(0.12)) * 0.6, 0.35)
t = t_(0.5)
save('ring', (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * (np.floor(t * 20) % 2) * np.exp(-t / 0.4), 0.3)
print(sorted(os.listdir(OUT)))
