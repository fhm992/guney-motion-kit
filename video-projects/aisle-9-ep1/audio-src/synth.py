"""AISLE 9 sound engine: every sound effect and music cue is synthesized here with numpy (no samples).

Run:  python3 audio-src/synth.py            -> writes assets/audio/sfx/*.wav and assets/audio/bgm/*.wav
Deterministic: fixed seeds, so every run makes the same files.
"""
import os, wave, math
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_SFX = os.path.join(HERE, '..', 'assets', 'audio', 'sfx9')
OUT_BGM = os.path.join(HERE, '..', 'assets', 'audio', 'bgm')
os.makedirs(OUT_SFX, exist_ok=True); os.makedirs(OUT_BGM, exist_ok=True)
RNG = np.random.default_rng(9)


# ---------------------------------------------------------------- basics
def t_(d): return np.arange(int(d * SR)) / SR
def noise(d, seed=None):
    r = np.random.default_rng(seed) if seed is not None else RNG
    return r.standard_normal(int(d * SR))
def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); s_len = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(s_len, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]
def exp_decay(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def fade(x, fi=0.01, fo=0.05):
    x = x.copy(); a, b = int(fi * SR), int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x
def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1; return x / m * peak
def saw(f, t, ph=0): return 2 * ((f * t + ph) % 1) - 1
def sq(f, t, duty=0.5): return np.where((f * t) % 1 < duty, 1.0, -1.0)
def tri(f, t): return 2 * np.abs(2 * ((f * t) % 1) - 1) - 1
def phase_sine(freq_arr):  # sine with time-varying frequency
    return np.sin(2 * np.pi * np.cumsum(freq_arr) / SR)

def biquad(x, kind, f, q=0.707, gain_db=0):
    """RBJ biquad; f may be a scalar. Vectorised via a small direct-form loop in chunks (fast enough)."""
    w = 2 * math.pi * f / SR; cw, sw = math.cos(w), math.sin(w); al = sw / (2 * q); A = 10 ** (gain_db / 40)
    if kind == 'lp': b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'hp': b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'bp': b = [al, 0, -al]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'peak': b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    b = np.array(b) / a[0]; a = np.array(a) / a[0]
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    b0, b1, b2, a1, a2 = b[0], b[1], b[2], a[1], a[2]
    for i in range(len(x)):
        xi = x[i]; yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, xi, y1, yi; y[i] = yi
    return y

def onepole_lp(x, f):  # cheap vectorisable-ish lowpass (loop but tiny)
    a = math.exp(-2 * math.pi * f / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y

def reverb(x, mix=0.3, size=1.0, seed=3):
    """Simple convolution reverb with a synthetic exponentially decaying noise IR."""
    n = int(SR * 1.8 * size); ir = np.random.default_rng(seed).standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.35 * size))
    ir = onepole_lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n - 1; N = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:L]
    dry = np.pad(x, (0, n - 1))
    return dry * (1 - mix) + wet * mix * 0.6

def stereo(x, pan=0.0, width=0.0, seed=5):
    l = x * math.cos((pan + 1) * math.pi / 4); r = x * math.sin((pan + 1) * math.pi / 4)
    if width:
        d = int(0.011 * SR); r = np.concatenate([np.zeros(d), r[:-d]]) * (1 - width * 0.2) + r * width * 0.2
    return np.stack([l, r], 1)

def write(path, x, peak=0.9):
    if x.ndim == 1: x = stereo(x)
    x = norm(x, peak); x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
    print('wrote', os.path.relpath(path, os.path.join(HERE, '..')), f'{len(x) / SR:.2f}s')

def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i]


# ---------------------------------------------------------------- sound effects
def sfx_fridge_hum(d=6):
    t = t_(d); x = 0.5 * np.sin(2 * np.pi * 60 * t) + 0.3 * np.sin(2 * np.pi * 120 * t) + 0.15 * saw(180, t)
    x = biquad(x, 'lp', 700) + 0.05 * biquad(noise(d, 1), 'bp', 300, 2)
    x *= 1 + 0.08 * np.sin(2 * np.pi * 0.7 * t)
    return fade(x, 0.4, 0.6)

def sfx_breath_wet(d=6):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(4)
    for k, at in enumerate(np.arange(0.1, d - 1.0, 1.6)):
        for inhale, dur, f in ((True, 0.7, 900), (False, 0.8, 600)):
            n = noise(dur, 10 + k * 2 + inhale); e = np.sin(np.linspace(0, np.pi, len(n))) ** 1.5
            g = biquad(n, 'bp', f + r.uniform(-80, 80), 1.2) * e
            gurgle = np.sin(2 * np.pi * 38 * t_(dur)) * (np.sin(2 * np.pi * 9 * t_(dur)) > 0.6) * e * 0.25
            place(out, g + gurgle, at + (0 if inhale else 0.75))
    return reverb(out, 0.25, 0.5)

def sfx_sub_hit(d=3):
    t = t_(d); f = 32 + 60 * np.exp(-t * 18); x = phase_sine(f) * exp_decay(len(t), 0.9)
    click = biquad(noise(0.02, 2), 'lp', 3000) * np.linspace(1, 0, int(0.02 * SR))
    x[: len(click)] += click * 0.6
    return reverb(np.tanh(x * 1.6), 0.35, 1.2)

def sfx_stamp(d=1.6, ice=False):
    x = sfx_sub_hit(1.2)[: int(1.2 * SR)] * 0.8
    n = biquad(noise(0.25, 8), 'bp', 1800, 0.8) * exp_decay(int(0.25 * SR), 0.04)
    place(x, n * 1.5, 0.0)
    if ice:
        for k in range(14):
            c = biquad(noise(0.05, 30 + k), 'hp', 4000) * exp_decay(int(0.05 * SR), 0.006)
            place(x, c * 0.7, 0.02 + k * 0.025 + (k % 3) * 0.01)
        x = x + 0.2 * np.pad(np.sin(2 * np.pi * 3200 * t_(0.6)) * exp_decay(int(0.6 * SR), 0.15), (0, len(x) - int(0.6 * SR)))
    return reverb(x, 0.3, 1.0)

def sfx_beep(f=2800, d=0.12):
    t = t_(d); return np.sin(2 * np.pi * f * t) * env_adsr(len(t), 0.003, 0.02, 0.8, 0.03)

def sfx_scanner_beeps(d=4):
    out = np.zeros(int(d * SR))
    for at in (0.2, 1.3, 2.1, 3.2): place(out, sfx_beep(2750, 0.11), at)
    return reverb(out, 0.25, 0.6)

def sfx_cart_squeak(d=2.6):
    t = t_(d); out = np.zeros(len(t))
    for k, at in enumerate(np.arange(0.0, d - 0.4, 0.42)):
        dd = 0.34; tt = t_(dd); f = 1500 + 700 * np.sin(np.pi * tt / dd) + 60 * np.sin(2 * np.pi * 31 * tt)
        s = (phase_sine(f) + 0.5 * phase_sine(f * 2.01) + 0.25 * np.sign(phase_sine(f))) * np.sin(np.pi * tt / dd) ** 0.7
        rattle = biquad(noise(dd, 50 + k), 'bp', 400, 3) * 0.3
        place(out, s * 0.6 + rattle, at)
    return reverb(out, 0.2, 0.5)

def sfx_door_chime(d=2.6):
    out = np.zeros(int(d * SR))
    for f, at in ((659.25, 0.0), (523.25, 0.55)):
        tt = t_(1.9); bell = sum(a * np.sin(2 * np.pi * f * m * tt) for m, a in ((1, 1), (2.0, 0.4), (3.01, 0.2), (4.2, 0.08))) * exp_decay(len(tt), 0.6)
        place(out, bell, at)
    return reverb(out, 0.3, 0.8)

def sfx_thud(d=1.5):
    t = t_(d); x = phase_sine(55 + 80 * np.exp(-t * 25)) * exp_decay(len(t), 0.18)
    x += biquad(noise(d, 12), 'lp', 400) * exp_decay(len(t), 0.07) * 1.5
    return reverb(np.tanh(x * 2), 0.2, 0.6)

def sfx_cans_roll(d=3.5):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(13)
    for c in range(4):
        start = c * 0.12; f0 = r.uniform(1800, 2600)
        for k in range(int(30 + c * 6)):
            at = start + k * (0.05 + k * 0.004);
            if at > d - 0.2: break
            tt = t_(0.08); ping = np.sin(2 * np.pi * f0 * tt) * exp_decay(len(tt), 0.012) + 0.4 * np.sin(2 * np.pi * f0 * 2.7 * tt) * exp_decay(len(tt), 0.006)
            place(out, ping * (0.6 * math.exp(-at * 0.6)) * r.uniform(0.5, 1), at)
        rumble = biquad(noise(d - start, 60 + c), 'lp', 250) * np.exp(-t_(d - start) * 0.8) * 0.4
        place(out, rumble, start)
    return reverb(out, 0.3, 0.7)

def sfx_shutter_slam(d=2.6):
    out = np.zeros(int(d * SR))
    rattle = biquad(noise(0.7, 70), 'bp', 900, 1.5) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * t_(0.7)))) * np.linspace(0.4, 1, int(0.7 * SR))
    place(out, rattle * 0.6, 0.0)
    place(out, sfx_thud(1.4) * 1.3, 0.7)
    clang = sum(np.sin(2 * np.pi * f * t_(1.2)) for f in (310, 487, 733, 1190)) * exp_decay(int(1.2 * SR), 0.25)
    place(out, clang * 0.25, 0.7)
    return reverb(out, 0.35, 1.2)

def sfx_mag_lock(d=1.6):
    t = t_(d); x = phase_sine(70 + 30 * np.exp(-t * 40)) * exp_decay(len(t), 0.12) * 1.2
    x += sq(120, t) * exp_decay(len(t), 0.03) * 0.3
    hum = np.sin(2 * np.pi * 50 * t) * 0.08 * np.clip((t - 0.05) * 10, 0, 1) * exp_decay(len(t), 0.8)
    return reverb(biquad(x, 'lp', 1500) + hum, 0.3, 1.0)

def sfx_neck_crack(d=0.8):
    out = np.zeros(int(d * SR))
    for k, at in enumerate((0.0, 0.07, 0.11, 0.19)):
        c = biquad(noise(0.03, 80 + k), 'bp', 2500 + k * 300, 2) * exp_decay(int(0.03 * SR), 0.004)
        place(out, c * (1 - k * 0.15), at)
    return reverb(out, 0.15, 0.4)

def sfx_ringtone(d=10):
    """Cheerful marimba phone ring: loops a happy 8-note phrase."""
    out = np.zeros(int(d * SR)); notes = [76, 79, 84, 79, 81, 84, 88, 84]
    step = 0.16
    for k in range(int(d / step)):
        at = k * step; n = notes[k % 8]
        if (k // 8) % 2 == 1 and k % 8 > 5: continue
        f = 440 * 2 ** ((n - 69) / 12); tt = t_(0.35)
        m = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 4 * tt) * exp_decay(len(tt), 0.02)) * exp_decay(len(tt), 0.09)
        place(out, m, at)
    return out

def sfx_phone_clatter(d=1.4):
    out = np.zeros(int(d * SR))
    for k, at in enumerate((0.0, 0.18, 0.31, 0.42, 0.5)):
        h = biquad(noise(0.06, 90 + k), 'bp', 1200 + 400 * (k % 2), 1.5) * exp_decay(int(0.06 * SR), 0.012)
        place(out, h * (1 - k * 0.15), at)
    return reverb(out, 0.3, 0.8)

def sfx_heartbeat(d=1.2):
    out = np.zeros(int(d * SR))
    for at, a in ((0.0, 1.0), (0.24, 0.7)):
        tt = t_(0.35); b = phase_sine(45 + 25 * np.exp(-tt * 30)) * exp_decay(len(tt), 0.07)
        place(out, b * a, at)
    return biquad(out, 'lp', 300)

def sfx_heartbeat_loop(d=10, bpm=72):
    out = np.zeros(int(d * SR)); hb = sfx_heartbeat(1.0)
    for at in np.arange(0, d - 1, 60 / bpm): place(out, hb, at)
    return out

def sfx_can_clink(d=2.4):
    out = np.zeros(int(d * SR)); tt = t_(0.5)
    ping = (np.sin(2 * np.pi * 2300 * tt) + 0.5 * np.sin(2 * np.pi * 5100 * tt)) * exp_decay(len(tt), 0.05)
    place(out, ping, 0.0)
    roll = biquad(noise(1.1, 97), 'bp', 700, 4) * np.linspace(0.5, 0, int(1.1 * SR)) * (1 + np.sin(2 * np.pi * 11 * t_(1.1)))
    place(out, roll * 0.4, 0.15)
    return reverb(out, 0.55, 1.5)

def sfx_static(d=1.6):
    n = noise(d, 101) * (np.random.default_rng(102).random(int(d * SR)) > 0.7)
    x = biquad(n, 'bp', 2500, 0.6) * env_adsr(int(d * SR), 0.01, 0.2, 0.6, 0.4)
    x += 0.15 * np.sin(2 * np.pi * 60 * t_(d)) * env_adsr(int(d * SR), 0.01, 0.2, 0.6, 0.4)
    return x

def sfx_pop_top(d=1.6):
    out = np.zeros(int(d * SR))
    hiss = biquad(noise(0.35, 110), 'hp', 3500) * env_adsr(int(0.35 * SR), 0.005, 0.1, 0.5, 0.2)  # TSSSK
    place(out, hiss * 0.7, 0.0)
    pop = phase_sine(900 * np.exp(-t_(0.12) * 25) + 200) * exp_decay(int(0.12 * SR), 0.02)
    place(out, pop * 1.2, 0.33)
    place(out, biquad(noise(0.05, 111), 'bp', 3000, 1) * exp_decay(int(0.05 * SR), 0.01) * 0.8, 0.33)
    return reverb(out, 0.6, 2.2)  # echoing aisle

def sfx_mist_hiss(d=4):
    return fade(biquad(noise(d, 120), 'hp', 2500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t_(d))), 0.5, 1.0)

def sfx_whoosh(d=0.9):
    tt = t_(d); f = 400 + 3000 * np.sin(np.pi * tt / d) ** 2; n = noise(d, 130); y = np.zeros_like(n)
    # sweep bandpass in chunks
    ch = 1024
    for i in range(0, len(n), ch): y[i:i + ch] = biquad(n[i:i + ch], 'bp', float(f[i]), 0.8)
    return y * np.sin(np.pi * tt / d) ** 2

def _formant_voice(f0_curve, vowels, d, seed, rough=0.4):
    """Undead moan: sawtooth with jitter through two formant bandpasses, gliding between vowels."""
    r = np.random.default_rng(seed); n = int(d * SR)
    jitter = 1 + 0.02 * biquad(r.standard_normal(n), 'lp', 8)
    src = np.sin(2 * np.pi * np.cumsum(f0_curve * jitter) / SR)
    src = np.sign(src) * np.abs(src) ** 0.3 + rough * r.standard_normal(n) * 0.3   # buzzy, breathy
    out = np.zeros(n); seg = n // len(vowels)
    for i, (f1, f2) in enumerate(vowels):
        a, b = i * seg, n if i == len(vowels) - 1 else (i + 1) * seg
        s = src[a:b]; out[a:b] = biquad(s, 'bp', f1, 4) + 0.6 * biquad(s, 'bp', f2, 6)
    return onepole_lp(out, 2200)

def sfx_moan(d=2.8, seed=1, f0=95):
    tt = t_(d); f = f0 * (1 + 0.25 * np.sin(np.pi * tt / d)) * (1 - 0.15 * tt / d)
    x = _formant_voice(f, [(500, 900), (600, 1000), (400, 800)], d, seed)
    return fade(x * np.sin(np.pi * tt / d) ** 0.6, 0.1, 0.4)

def sfx_moans_layered(d=8, voices=7, seed=200):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(seed)
    for k in range(voices):
        dd = r.uniform(1.8, 3.2); at = r.uniform(0, d - dd); m = sfx_moan(dd, seed + k, r.uniform(70, 130))
        place(out, m * r.uniform(0.4, 1), at)
    return reverb(out, 0.45, 1.6)

def sfx_shriek(d=2.2):
    tt = t_(d); f = 300 + 900 * np.sin(np.pi * np.clip(tt / 1.2, 0, 1)) ** 0.5 * np.exp(-tt * 0.4)
    x = _formant_voice(f, [(800, 1800), (900, 2200), (700, 1600)], d, 300, rough=1.2)
    x = np.tanh(x * 3) * np.sin(np.pi * tt / d) ** 0.3
    return reverb(x, 0.5, 2.0)

def sfx_stampede(d=8):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(400)
    for k in range(int(d * 22)):
        at = r.uniform(0, d - 0.2); tt = t_(0.12)
        step = phase_sine(80 + 60 * np.exp(-tt * 40)) * exp_decay(len(tt), 0.03) + biquad(r.standard_normal(len(tt)), 'lp', 900) * exp_decay(len(tt), 0.015)
        place(out, step * r.uniform(0.3, 1) * min(1, at / 1.5 + 0.3), at)
    return reverb(out + sfx_moans_layered(d, 9, 410)[:len(out)] * 0.5, 0.3, 1.2)

def sfx_crash(d=2.0, seed=500):
    out = np.zeros(int(d * SR)); r = np.random.default_rng(seed)
    place(out, sfx_thud(1.2) * 0.8, 0)
    for k in range(40):
        at = r.uniform(0, 0.9); tt = t_(0.15); f = r.uniform(600, 3500)
        place(out, np.sin(2 * np.pi * f * tt) * exp_decay(len(tt), 0.03) * r.uniform(0.1, 0.4), at)
    place(out, biquad(noise(1.0, seed), 'bp', 1500, 0.6) * exp_decay(int(SR), 0.2) * 0.6, 0)
    return reverb(out, 0.3, 1.0)

def sfx_string_sting(d=4):
    tt = t_(d); out = np.zeros(len(tt))
    for f in (233.08, 246.94, 349.23, 493.88):  # dissonant cluster
        v = sum(saw(f * (1 + dt), tt, ph) for dt, ph in ((-0.004, 0), (0.003, 0.3), (0.0, 0.6))) / 3
        out += biquad(v, 'lp', 2400) * (1 + 0.1 * np.sin(2 * np.pi * 5.5 * tt))
    return reverb(out * env_adsr(len(tt), 0.05, 0.3, 0.6, 2.5), 0.5, 2.0)

def sfx_hope_note(d=4):
    tt = t_(d); f = 523.25
    x = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt) + 0.1 * np.sin(2 * np.pi * f * 3 * tt)) * env_adsr(len(tt), 0.3, 0.5, 0.6, 2.0)
    return reverb(x, 0.6, 2.0)

def sfx_robot_tone(d=0.5):
    tt = t_(d); return (sq(880, tt, 0.3) * 0.3 + np.sin(2 * np.pi * 660 * tt)) * env_adsr(len(tt), 0.005, 0.05, 0.6, 0.1)

def sfx_screen_slap(d=0.6):
    tt = t_(d); x = biquad(noise(d, 600), 'lp', 1800) * exp_decay(len(tt), 0.03) + np.sin(2 * np.pi * 180 * tt) * exp_decay(len(tt), 0.05)
    return reverb(x, 0.2, 0.4)


# ---------------------------------------------------------------- music cues
def kick(d=0.4):
    tt = t_(d); return np.tanh(2 * phase_sine(45 + 110 * np.exp(-tt * 30)) * exp_decay(len(tt), 0.12))
def snare(d=0.3, seed=1):
    tt = t_(d); return biquad(noise(d, seed), 'hp', 1200) * exp_decay(len(tt), 0.05) + 0.4 * np.sin(2 * np.pi * 190 * tt) * exp_decay(len(tt), 0.04)
def hat(d=0.06, seed=2):
    return biquad(noise(d, seed), 'hp', 7000) * exp_decay(int(d * SR), 0.012)
def tom(f=110, d=0.5):
    tt = t_(d); return phase_sine(f + f * np.exp(-tt * 20)) * exp_decay(len(tt), 0.15)
def mtof(n): return 440 * 2 ** ((n - 69) / 12)

def pad_chord(notes, d, bright=1800, detune=0.006, seed=0):
    tt = t_(d); out = np.zeros(len(tt))
    for n in notes:
        f = mtof(n)
        for k, dt in enumerate((-detune, 0, detune)): out += saw(f * (1 + dt), tt, (seed + k) * 0.37)
    out = biquad(out / len(notes), 'lp', bright, 0.8)
    return out * (1 + 0.15 * np.sin(2 * np.pi * 0.2 * tt))

def bgm_drone(d=20, root=38, dark=True):
    tt = t_(d)
    x = 0.6 * np.sin(2 * np.pi * mtof(root) * tt) + 0.4 * saw(mtof(root) * 1.003, tt) + 0.3 * saw(mtof(root + 7) * 0.997, tt)
    x = biquad(x, 'lp', 380 if dark else 900, 1.2)
    x += 0.12 * biquad(noise(d, 700), 'bp', 220, 3) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * tt))
    x *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.13 * tt)
    return reverb(fade(x, 2.0, 2.0), 0.4, 2.0)

def bgm_lofi(d=36, bpm=86, warp_from=None):
    """Upbeat lo-fi: Rhodes-ish chords, walking bass, dusty drums. warp_from: seconds where tape slows down."""
    beat = 60 / bpm; tt = t_(d); out = np.zeros(len(tt))
    prog = [(57, [60, 64, 67, 71]), (62, [65, 69, 72, 76]), (55, [59, 62, 65, 69]), (60, [64, 67, 71, 74])]  # Am9 Dm9 G13 Cmaj9 flavour
    bar = 4 * beat; nb = int(d / bar) + 1
    for b in range(nb):
        root, ch = prog[b % 4]; at = b * bar
        # rhodes: sine + bell partial, swung stabs
        for hit in (0, 1.5, 2.5):
            for n in ch:
                f = mtof(n); dd = beat * 1.4; t2 = t_(dd)
                ep = (np.sin(2 * np.pi * f * t2) + 0.25 * np.sin(2 * np.pi * f * 3 * t2) * exp_decay(len(t2), 0.05)) * exp_decay(len(t2), 0.5) * 0.12
                place(out, ep, at + hit * beat)
        # bassline
        for i, (off, n) in enumerate(((0, root - 24), (1.5, root - 24), (2, root - 17), (3, root - 22), (3.5, root - 20))):
            f = mtof(n); dd = beat * 0.9; t2 = t_(dd)
            bs = np.tanh(1.5 * (np.sin(2 * np.pi * f * t2) + 0.3 * tri(f * 2, t2))) * env_adsr(len(t2), 0.005, 0.1, 0.7, 0.1) * 0.45
            place(out, bs, at + off * beat)
        for k in range(4):  # drums
            place(out, kick() * 0.55, at + k * beat if k in (0, 2) else at + (k + 0.5) * beat if k == 3 else at + 99)
            if k in (1, 3): place(out, snare(seed=b * 4 + k) * 0.28, at + k * beat)
            for s in (0, 0.55): place(out, hat(seed=b * 9 + k * 2 + int(s * 2)) * 0.12, at + (k + s) * beat)
    out += biquad(noise(d, 800), 'hp', 3000) * 0.004  # vinyl hiss
    for k in range(int(d * 3)):
        at = RNG.uniform(0, d - 0.01); place(out, np.array([0.03, -0.02, 0.01]), at)  # crackle
    out = onepole_lp(out, 6000)
    if warp_from is not None:  # tape slow-down: resample with a rate that falls to 0.55
        i0 = int(warp_from * SR); rate = np.ones(len(out)); k = np.arange(len(out) - i0)
        rate[i0:] = np.maximum(0.55, 1 - k / (SR * 6.0) * 0.45)
        pos = np.cumsum(rate); pos = pos[pos < len(out) - 1]
        out = np.interp(pos, np.arange(len(out)), out); out = np.pad(out, (0, len(tt) - len(out)))
        out[i0:] = onepole_lp(out[i0:], 2500)
    return fade(out, 0.3, 1.5)

def bgm_pulse(d=30, bpm=100, root=38):
    beat = 60 / bpm; out = np.zeros(int(d * SR))
    for k in range(int(d / beat * 2)):
        at = k * beat / 2; tt = t_(beat / 2)
        n = root + (0 if k % 8 < 6 else 1)
        p = biquad(saw(mtof(n), tt), 'lp', 600 + 400 * (k % 4 == 0)) * exp_decay(len(tt), 0.12) * 0.5
        place(out, p, at)
        if k % 4 == 0: place(out, kick(0.3) * 0.35, at)
    tt = t_(d); out *= np.clip(tt / 8, 0.3, 1)  # builds
    return reverb(out + bgm_drone(d, root, True)[:len(out)] * 0.4, 0.3, 1.0)

def bgm_chase(d=40, bpm=150):
    beat = 60 / bpm; out = np.zeros(int(d * SR)); r = np.random.default_rng(900)
    pat_k = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
    for b in range(int(d / (4 * beat)) + 1):
        at = b * 4 * beat
        for s in range(16):
            ts = at + s * beat / 4
            if pat_k[s]: place(out, kick(0.35) * 0.8, ts)
            if s in (4, 12): place(out, snare(seed=b * 16 + s) * 0.5, ts)
            if s % 2 == 0: place(out, hat(seed=b * 16 + s) * 0.18, ts)
            if s in (10, 14) and b % 2: place(out, tom(90 if s == 10 else 70) * 0.6, ts)
        # driving low ostinato
        for s in range(8):
            n = [38, 38, 41, 38, 38, 43, 41, 36][s]; tt = t_(beat / 2)
            place(out, biquad(saw(mtof(n), tt) + saw(mtof(n + 12) * 1.004, tt) * 0.5, 'lp', 900) * exp_decay(len(tt), 0.15) * 0.35, at + s * beat / 2)
        if b % 4 == 3:  # brass-ish stab
            place(out, pad_chord([50, 53, 56], beat * 2, 1400) * env_adsr(int(beat * 2 * SR), 0.01, 0.2, 0.5, 0.3) * 0.5, at)
    return reverb(fade(out, 0.05, 1.5), 0.2, 0.8)

def bgm_warm_pads(d=30, root=50):
    out = np.zeros(int(d * SR)); prog = [[0, 4, 7, 11], [5, 9, 12, 16], [-3, 0, 4, 7], [2, 5, 9, 12]]
    seg = d / 4
    for i, ch in enumerate(prog):
        p = pad_chord([root + n for n in ch], seg + 2, 1200, seed=i) * env_adsr(int((seg + 2) * SR), 1.5, 0.5, 0.8, 2.0)
        place(out, p * 0.5, i * seg)
    return reverb(fade(out, 2, 3), 0.55, 2.2)

def bgm_icy(d=30):
    tt = t_(d); out = pad_chord([62, 69, 74, 76], d, 3200, 0.004) * 0.35
    for k in range(int(d * 2)):  # glassy bell arpeggio
        n = [86, 81, 88, 83, 90, 81][k % 6]; t2 = t_(1.2)
        place(out, np.sin(2 * np.pi * mtof(n) * t2) * exp_decay(len(t2), 0.3) * 0.12, k * 0.5)
    return reverb(fade(out, 2, 2), 0.6, 2.5)

def bgm_hopeful(d=24, root=55):
    out = bgm_warm_pads(d, root)[:int(d * SR)] * 0.8; tt = t_(d)
    mel = [(0, 74), (1.5, 76), (3, 79), (6, 78), (7.5, 76), (9, 74), (12, 71), (13.5, 74), (15, 76)]
    for at, n in mel:
        t2 = t_(2.5); place(out, (np.sin(2 * np.pi * mtof(n) * t2) + 0.2 * np.sin(4 * np.pi * mtof(n) * t2)) * env_adsr(len(t2), 0.05, 0.4, 0.4, 1.5) * 0.18, at + 2)
    return fade(out, 1.5, 3)


def sfx_cough(d=1.6):
    out = np.zeros(int(d * SR))
    for k, at in enumerate((0.0, 0.32, 0.6)):
        n = noise(0.22, 700 + k); e = exp_decay(len(n), 0.06) * np.minimum(1, np.arange(len(n)) / (0.01 * SR))
        x = biquad(n, 'bp', 700 + k * 80, 1.0) * e + 0.5 * np.sin(2 * np.pi * 110 * t_(0.22)) * e
        wet = biquad(noise(0.22, 720 + k), 'bp', 300, 3) * e * 0.4   # wet rattle
        place(out, (x + wet) * (1 - k * 0.2), at)
    return reverb(out, 0.15, 0.4)

SFX = {
    'fridge_hum': sfx_fridge_hum, 'breath_wet': sfx_breath_wet, 'sub_hit': sfx_sub_hit, 'stamp': sfx_stamp,
    'stamp_ice': lambda: sfx_stamp(ice=True), 'scanner_beeps': sfx_scanner_beeps, 'beep': sfx_beep, 'cart_squeak': sfx_cart_squeak,
    'door_chime': sfx_door_chime, 'thud': sfx_thud, 'cans_roll': sfx_cans_roll, 'shutter_slam': sfx_shutter_slam,
    'mag_lock': sfx_mag_lock, 'neck_crack': sfx_neck_crack, 'ringtone': sfx_ringtone, 'phone_clatter': sfx_phone_clatter,
    'heartbeat': sfx_heartbeat, 'heartbeat_loop': sfx_heartbeat_loop, 'can_clink': sfx_can_clink, 'static': sfx_static,
    'pop_top': sfx_pop_top, 'mist_hiss': sfx_mist_hiss, 'whoosh': sfx_whoosh, 'moan': sfx_moan,
    'moans_layered': sfx_moans_layered, 'shriek': sfx_shriek, 'stampede': sfx_stampede, 'crash': sfx_crash,
    'crash2': lambda: sfx_crash(seed=501), 'string_sting': sfx_string_sting, 'hope_note': sfx_hope_note,
    'robot_tone': sfx_robot_tone, 'cough': sfx_cough, 'screen_slap': sfx_screen_slap,
}
BGM = {
    'drone': lambda: bgm_drone(24), 'lofi': lambda: bgm_lofi(36), 'lofi_warp': lambda: bgm_lofi(20, warp_from=6.0),
    'pulse': lambda: bgm_pulse(40), 'chase': lambda: bgm_chase(40), 'warm_pads': lambda: bgm_warm_pads(32),
    'icy': lambda: bgm_icy(40), 'hopeful': lambda: bgm_hopeful(26), 'ambient_sparse': lambda: bgm_drone(60, 45, dark=False) * 0.7,
}

if __name__ == '__main__':
    import sys
    want = set(sys.argv[1:])
    for k, fn in SFX.items():
        if not want or k in want: write(os.path.join(OUT_SFX, k + '.wav'), fn())
    for k, fn in BGM.items():
        if not want or k in want: write(os.path.join(OUT_BGM, k + '.wav'), fn(), 0.8)
