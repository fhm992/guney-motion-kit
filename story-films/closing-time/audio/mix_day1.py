"""CLOSING TIME, Day 1 pilot: music, sound design, voices and captions, all generated in Python (numpy only).
Run: python3 mix_day1.py  ->  out/day1_mix.wav  +  out/day1.ass
"""
import json, os, subprocess, wave
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

# ---------- timeline (seconds, matches storyboard/film.js shot durations) ----------
SHOTS = [('day1', 2), ('till', 6), ('ots', 9), ('cash', 5), ('window', 13), ('rack', 8), ('aerial', 8), ('title', 4), ('davis', 8),
         ('shutter', 6.5), ('crane', 11), ('turn', 6), ('freezer', 16), ('phone', 22), ('chalk', 23)]
START = {}; t = 0.0
for name, d in SHOTS: START[name] = t; t += d
TOTAL = t
N = int(TOTAL * SR) + SR

# voice lines: (start, speaker, text, file or None, estimated seconds if missing)
LINES = [
    (2.6, 'N', 'The last thing you ever sell... is a bag of ice. Three forty-nine. Register two. Eleven fifty-two p.m.', 'voice/N1_ice.mp3', 0),
    (11.2, 'N', "He pays in cash, with his left hand. He doesn't wait for his change.", 'voice/N2_cash.mp3', 0),
    (17.3, 'N', "You notice the sleeve. You notice he's sweating... in October. You don't say anything. It's not your job to say anything. Your job is to stack shelves until six a.m.", 'voice/N3_sleeve.mp3', 0),
    (33.0, 'N', 'You count... without meaning to.', 'voice/N4_count.mp3', 0),
    (56.0, 'D', 'Shutter! Sami, the shutter! The red button!', 'voice/D1_shutter.mp3', 0),
    (62.0, 'N', 'Mr. Davis went out the back for a smoke at eleven forty. He came back with a bite on his neck.', 'voice/N5_davis_smoke.mp3', 0),
    (70.5, 'N', 'Plan A was a normal night shift. A sandwich at three. The bus home at six. Plan A just hit the floor.', 'voice/N6_planA.mp3', 0),
    (87.3, 'N', "Ten seconds. That's how long it takes, from a bite on the neck. You lean on the freezer door and listen to your manager try to get through it. The lock is electric. You don't think about that yet. You will.", 'voice/N7_ten_seconds.mp3', 0),
    (104.0, 'M', "Sami? Sami, listen to me. Are you inside? Lock everything. Stay where you are. I'm coming to get you, okay? I'm coming. I love y—", 'voice/M1_mum_call.mp3', 0),
    (116.5, 'N', "No bars. You try her forty times. It doesn't go through once.", 'voice/N8_no_bars.mp3', 0),
    (124.8, 'N', "Okay. Think. You're one guy, locked in forty thousand square feet of food. An adult needs about two thousand calories a day. One jar of peanut butter is nearly three thousand. Aisle six has two hundred jars. Food is not what kills you in here. Noise is.", 'voice/N9_noise.mp3', 0),
]

# ---------- dsp helpers ----------
def tt(d): return np.arange(int(d * SR)) / SR
def fft_filter(x, lo=None, hi=None, slope=6.0):
    n = len(x); X = np.fft.rfft(x, n=n * 2); f = np.fft.rfftfreq(n * 2, 1 / SR); g = np.ones_like(f)
    if lo: g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** slope)
    if hi: g *= 1 / (1 + (f / hi) ** slope)
    return np.fft.irfft(X * g)[:n]
def conv(x, ir):
    n = len(x) + len(ir) - 1; m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m))[:n]
def reverb_ir(dur=2.5, decay=3.0, bright=6000, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * decay)
    ir = fft_filter(ir, hi=bright); ir[0] = 0; return ir / np.sqrt((ir ** 2).sum()) * 0.35
IR_ROOM, IR_HALL, IR_CITY = reverb_ir(0.8, 7, 7000, 1), reverb_ir(3.0, 2.2, 5000, 2), reverb_ir(4.5, 1.4, 3000, 3)
def env(n, a=0.01, r=0.3, hold=None):
    e = np.ones(n); A = max(1, int(a * SR)); R = max(1, int(r * SR)); e[:A] = np.linspace(0, 1, A)
    if R < n: e[-R:] *= np.linspace(1, 0, R)
    return e
def pan(x, p=0.0):
    l, r = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4); return np.stack([x * l, x * r], 1)
def saw(f, t, ph=0.0): return 2 * ((f * t + ph) % 1) - 1

class Bus:
    def __init__(self): self.b = np.zeros((N, 2))
    def add(self, at, x, gain=1.0, p=0.0):
        if x.ndim == 1: x = pan(x, p)
        i = int(at * SR); j = min(N, i + len(x));
        if j > i: self.b[i:j] += x[: j - i] * gain
music, sfx, amb, vox = Bus(), Bus(), Bus(), Bus()
def mtof(m): return 440 * 2 ** ((m - 69) / 12)

# ---------- MUSIC ----------
def ep_note(m, d, vel=0.3):  # electric piano (FM)
    t = tt(d); f = mtof(m); e = np.exp(-t * 2.2) * env(len(t), 0.004, 0.15)
    return np.sin(2 * np.pi * f * t + 1.3 * np.exp(-t * 4) * np.sin(2 * np.pi * 2 * f * t)) * e * vel
def piano(m, d, vel=0.35):
    t = tt(d); f = mtof(m); x = sum(np.sin(2 * np.pi * f * k * t) * (0.6 / k) * np.exp(-t * (1.6 + k * 0.7)) for k in range(1, 6))
    return x * env(len(t), 0.003, 0.3) * vel
def muzak(dur):
    bpm = 96; beat = 60 / bpm; out = np.zeros((int(dur * SR) + SR, 2))
    chords = [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]]
    mel = [76, 74, 72, 74, 76, 79, 76, 74, 72, 69, 72, 74, 71, 74, 72, 67]
    r = np.random.default_rng(3); bar = 0
    while bar * 4 * beat < dur:
        ch = chords[(bar // 2) % 4]; t0 = bar * 4 * beat
        for k in range(4):
            for n_ in ch: x = ep_note(n_, beat * 1.4, 0.07); i = int((t0 + k * beat + 0.5 * beat * (k % 2)) * SR); out[i:i + len(x)] += pan(x, -0.3)
            b = ep_note(ch[0] - 24 + (7 if k == 2 else 0), beat * 0.9, 0.22); i = int((t0 + k * beat) * SR); out[i:i + len(b)] += pan(b, 0)
            sh = fft_filter(r.standard_normal(int(0.06 * SR)), lo=6000) * np.exp(-tt(0.06) * 60) * 0.05
            for h in (0, 0.5): i = int((t0 + (k + h) * beat) * SR); out[i:i + len(sh)] += pan(sh, 0.4)
        for k in range(4):
            m = mel[(bar * 4 + k) % len(mel)]; x = ep_note(m, beat * 1.2, 0.11); i = int((t0 + k * beat) * SR); out[i:i + len(x)] += pan(x, 0.25)
        bar += 1
    return out[: int(dur * SR)]
def store_speaker(x, gain=1.0):  # music heard through ceiling speakers
    y = np.stack([fft_filter(x[:, c], lo=250, hi=4500) for c in (0, 1)], 1)
    return np.stack([conv(y[:, c], IR_ROOM)[: len(y)] for c in (0, 1)], 1) * gain
def tape_stop(x, d=2.2):
    n = len(x); m = int(d * SR); head, tail = x[: n - m], x[n - m:]
    rate = np.linspace(1, 0.05, m); pos = np.cumsum(rate); pos = pos[pos < m - 1]
    stop = np.stack([np.interp(pos, np.arange(m), tail[:, c]) for c in (0, 1)], 1) * np.linspace(1, 0, len(pos))[:, None]
    return np.concatenate([head, stop])
MZ = muzak(150)
music.add(0, tape_stop(store_speaker(MZ[: int(38.6 * SR)], 0.9), 1.8), 1.0)
music.add(START['davis'], store_speaker(MZ[int(40 * SR): int(54.5 * SR)], 0.3) * env(int(14.5 * SR), 0.3, 1.0)[:, None])
music.add(START['chalk'], store_speaker(MZ[int(60 * SR): int(81 * SR)], 0.32)[: int((145.0 - START['chalk']) * SR)])

def drone(d, f0=55, bright=180, amp=0.25, seed=0):
    t = tt(d); x = sum(saw(f0 * m, t, k * 0.13) for k, m in enumerate([1, 1.006, 1.5, 0.5]))
    x = fft_filter(x, hi=bright, slope=4) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t + seed))
    return x * env(len(t), 2.0, 2.0) * amp
def sub_hit(d=2.5, amp=0.9):
    t = tt(d); f = 70 * np.exp(-t * 3) + 32; ph = 2 * np.pi * np.cumsum(f) / SR
    click = fft_filter(rng.standard_normal(len(t)), hi=3000) * np.exp(-t * 40) * 0.4
    return (np.sin(ph) * np.exp(-t * 1.6) + click) * amp
def riser(d=3.0, amp=0.25):
    t = tt(d); x = fft_filter(rng.standard_normal(len(t)), lo=400, hi=6000) * (t / d) ** 2
    x += np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / d) ** 2) / SR) * (t / d) ** 3 * 0.3
    return x * amp
def pad(notes, d, amp=0.12):
    t = tt(d); x = sum(sum(np.sin(2 * np.pi * mtof(n) * dt * t + k) for k, dt in enumerate([1, 1.003, 0.997])) for n in notes)
    return fft_filter(x, hi=2500) * env(len(t), 3.0, 4.0) * amp / len(notes)
def heartbeat(d, bpm=72, amp=0.5):
    out = np.zeros(int(d * SR)); beat = 60 / bpm; k = 0
    while k * beat < d - 0.5:
        for off, a in ((0, 1), (0.28, 0.7)):
            x = sub_hit(0.35, a * amp); x = fft_filter(x, hi=150); i = int((k * beat + off) * SR); out[i:i + len(x)] += x[: len(out) - i]
        k += 1
    return out

hall = lambda x: x + conv(x, IR_HALL)[: len(x)] * 0.6
music.add(START['rack'] + 1.0, drone(7.5, 55, 160, 0.18))
music.add(START['rack'] + 3.2, sub_hit(3.0, 0.8))
music.add(START['aerial'], drone(8, 41.2, 220, 0.25, 1))
music.add(START['title'] - 0.4, sub_hit(3.5, 1.0))
music.add(START['davis'], drone(14.5, 49, 200, 0.22, 2))
music.add(START['shutter'] + 2.2, riser(3.0, 0.22))
music.add(START['shutter'] + 5.2, sub_hit(3.0, 1.0))
music.add(START['crane'], drone(11, 36.7, 240, 0.28, 3))
music.add(START['turn'], drone(6, 46.2, 160, 0.2, 4)); music.add(START['turn'] + 2.3, sub_hit(2.5, 1.0))
music.add(START['freezer'], drone(16, 55, 140, 0.16, 5)); music.add(START['freezer'], heartbeat(16, 84, 0.45))
music.add(START['phone'], hall(pad([57, 60, 64, 69], 22, 0.16)))
alone = np.zeros(int(24 * SR)); motif = [(0, 76), (1.2, 72), (2.4, 69), (4.8, 71), (6.0, 72), (7.2, 67), (9.6, 76), (10.8, 72), (12.0, 69), (14.4, 74), (15.6, 72), (16.8, 71)]
for at, m in motif: x = piano(m, 2.4, 0.22); i = int(at * SR); alone[i:i + len(x)] += x
music.add(START['chalk'] + 0.5, hall(alone[: int(19 * SR)] * env(int(19 * SR), 0.5, 1.5)), 1.0, 0.1)

# ---------- SOUND DESIGN ----------
def beep(f=1800, d=0.09, amp=0.25): t = tt(d); return np.sin(2 * np.pi * f * t) * env(len(t), 0.003, 0.02) * amp
def hum(d, amp=0.03):
    t = tt(d); x = sum(np.sin(2 * np.pi * 60 * k * t) / k for k in (1, 2, 3, 5)) + fft_filter(rng.standard_normal(len(t)), lo=2000, hi=9000) * 0.3
    return x * env(len(t), 0.3, 0.3) * amp
def wind(d, amp=0.12, seed=1):
    r = np.random.default_rng(seed); t = tt(d); x = fft_filter(r.standard_normal(len(t)), lo=60, hi=900, slope=2)
    return x / (np.abs(x).max() + 1e-9) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t + seed)) * env(len(t), 1.0, 1.0) * amp
def howl(d=2.6, f0=170, seed=1, amp=0.5):
    r = np.random.default_rng(seed); t = tt(d); u = t / d
    f = f0 * (1 + 0.9 * np.sin(np.pi * u) ** 1.5) * (1 + 0.02 * np.sin(2 * np.pi * 6.5 * t)) * (1 - 0.35 * u ** 3)
    ph = 2 * np.pi * np.cumsum(f) / SR; x = np.sign(np.sin(ph)) * 0.4 + np.sin(ph * 2) * 0.3 + np.sin(ph * 3) * 0.2
    x = fft_filter(x, lo=250, hi=2400) + fft_filter(r.standard_normal(len(t)), lo=800, hi=4000) * 0.25
    x = np.tanh(x * 2.5) * np.sin(np.pi * u) ** 0.6
    return x * amp / (np.abs(x).max() + 1e-9)
def thump(amp=0.6, f=90, d=0.4): t = tt(d); return (np.sin(2 * np.pi * f * t * np.exp(-t * 3)) * np.exp(-t * 14) + fft_filter(rng.standard_normal(len(t)), hi=1500) * np.exp(-t * 30) * 0.5) * amp
def metal_crash(d=2.5, amp=0.9):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * t + k) * np.exp(-t * (3 + k)) for k, f in enumerate([180, 317, 449, 612, 890, 1230]))
    x += fft_filter(rng.standard_normal(len(t)), lo=200, hi=7000) * np.exp(-t * 6) * 1.5
    return np.tanh(x * 1.5) * amp
def rattle(d=4.6, amp=0.3):
    t = tt(d); x = fft_filter(rng.standard_normal(len(t)), lo=300, hi=5000) * (0.5 + 0.5 * (np.sin(2 * np.pi * 22 * t) > 0)) + np.sin(2 * np.pi * 95 * t) * 0.3
    return x * env(len(t), 0.2, 0.1) * amp * (0.6 + 0.4 * t / d)
def step(amp=0.4): t = tt(0.12); return (fft_filter(rng.standard_normal(len(t)), lo=150, hi=3000) * np.exp(-t * 45) + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 30)) * amp
def siren(d, amp=0.12):
    t = tt(d); f = np.where((t % 1.4) < 0.7, 960, 770); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3
    return fft_filter(x, lo=500, hi=2500) * env(len(t), 0.5, 1) * amp
def heli(d, amp=0.25):
    t = tt(d); x = fft_filter(rng.standard_normal(len(t)), hi=500) * (0.4 + 0.6 * (np.sin(2 * np.pi * 11 * t) > 0.3)); return x * env(len(t), 1, 1) * amp
def buzz(d, amp=0.08): t = tt(d); return (saw(120, t) * 0.5 + saw(240, t) * 0.3) * amp * env(len(t), 0.02, 0.05)
def crackle(d=0.15, amp=0.3): t = tt(d); return fft_filter(rng.standard_normal(len(t)), lo=1500) * (rng.random(len(t)) > 0.97) * amp * 3
def chalk(d, amp=0.12):
    t = tt(d); x = fft_filter(rng.standard_normal(len(t)), lo=1800, hi=7000) * (0.4 + 0.6 * (np.sin(2 * np.pi * 7 * t) > -0.2)); return x * env(len(t), 0.02, 0.05) * amp
def breath(d, amp=0.05):
    t = tt(d); x = fft_filter(rng.standard_normal(len(t)), lo=300, hi=2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.45 * t)) ** 2; return x * amp
def groans(d, n=12, amp=0.25, seed=5):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR))
    for k in range(n):
        x = howl(1.2 + r.random() * 1.8, 90 + r.random() * 80, seed + k, 0.4) * (0.3 + 0.7 * r.random()); i = int(r.random() * (d - 3) * SR); out[i:i + len(x)] += x
    return fft_filter(out, hi=1800) * amp

S = START
amb.add(0, hum(S['window'] - 0 + 0.1, 0.02))
sfx.add(S['till'] + 0.4, beep(1800), 0.8); sfx.add(S['till'] + 1.3, beep(2200, 0.12), 0.6)
amb.add(S['ots'], hum(14, 0.022))
amb.add(S['window'], hum(13, 0.015)); amb.add(S['window'], wind(13 + 8, 0.05, 2))
sfx.add(S['window'] + 7.2, thump(0.35, 120, 0.3), 1.0, 0.3)
sfx.add(S['rack'] + 3.2, conv(howl(2.8, 175, 11, 0.6), IR_CITY)[: int(6 * SR)] * 0.7 + np.pad(howl(2.8, 175, 11, 0.6), (0, int(6 * SR) - int(2.8 * SR))), 0.9, 0.2)
for k in range(9):
    h = howl(1.8 + rng.random() * 1.5, 140 + rng.random() * 120, 30 + k, 0.35); h = conv(h, IR_CITY)[: len(h) + SR * 2]
    sfx.add(S['rack'] + 4.3 + k * 0.45 + rng.random() * 0.4, fft_filter(h, hi=2200), 0.35, float(rng.uniform(-0.9, 0.9)))
amb.add(S['aerial'], wind(8, 0.16, 4)); sfx.add(S['aerial'], siren(8), 1.0, -0.4); sfx.add(S['aerial'] + 1.5, siren(6.5) * 0.6, 1.0, 0.6); sfx.add(S['aerial'], heli(8, 0.18), 1.0, 0.3)
sfx.add(S['aerial'], groans(8, 10, 0.25, 7), 1.0)
for a, b in [(0.35, 0.5), (0.62, 0.7), (1.2, 1.3), (2.9, 3.0)]: sfx.add(S['title'] + a, crackle(b - a, 0.35))
sfx.add(S['title'] + 0.3, buzz(3.3, 0.05))
amb.add(S['davis'], hum(14.5, 0.02))
for k in range(34): sfx.add(S['davis'] + 0.15 + k * 0.21, step(0.12 + 0.35 * k / 34), 1.0, 0.0)
sfx.add(S['shutter'] + 0.6, rattle(4.6, 0.25))
for k in range(10): sfx.add(S['shutter'] + 2.5 + k * 0.28, step(0.2 + 0.03 * k), 1.0, float(rng.uniform(-0.5, 0.5)))
sfx.add(S['shutter'] + 5.2, metal_crash(2.8, 0.9))
for k in range(60):
    at = S['shutter'] + 5.35 + rng.random() * 16; sfx.add(at, thump(0.25 + rng.random() * 0.25, 70 + rng.random() * 60), 0.9, float(rng.uniform(-0.8, 0.8)))
sfx.add(S['crane'], groans(11, 16, 0.45, 9)); amb.add(S['crane'], wind(11, 0.08, 5))
amb.add(S['turn'], hum(6, 0.015)); sfx.add(S['turn'], breath(2.3, 0.08))
sfx.add(S['turn'] + 2.3, howl(2.4, 150, 21, 0.9) + 0 * 0, 1.0); sfx.add(S['turn'] + 2.3, conv(howl(2.4, 150, 21, 0.4), IR_ROOM)[: int(3.5 * SR)], 0.6)
sfx.add(S['freezer'] + 0.05, metal_crash(1.5, 0.6))
for b in [0.8, 1.5, 2.1, 4.6, 5.2, 7.9, 10.4, 11.0, 13.6]: sfx.add(S['freezer'] + b, fft_filter(thump(0.9, 75, 0.5), hi=900), 1.0)
sfx.add(S['freezer'], fft_filter(groans(16, 6, 0.4, 13), hi=700))
amb.add(S['freezer'], hum(16, 0.012)); sfx.add(S['freezer'], breath(16, 0.05))
amb.add(S['phone'], hum(22, 0.008))
for k, f in enumerate([950, 700, 480]): sfx.add(114.2 + k * 0.33, beep(f, 0.26, 0.18))
amb.add(S['chalk'], hum(20, 0.02))
for a, b in [(2.5, 5.5), (7.0, 10.5), (11.5, 15.0), (18.0, 18.8)]: sfx.add(S['chalk'] + a, chalk(b - a, 0.12), 1.0, -0.3)
sfx.add(145.0, thump(0.5, 160, 0.15), 1.0); sfx.add(145.02, crackle(0.1, 0.5))

# ---------- VOICES ----------
def load_mp3(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)
def phone_fx(x): return np.tanh(fft_filter(x, lo=350, hi=3200, slope=8) * 2.2) * 0.6
vmask = np.zeros(N)
cues = []
for at, who, text, f, est in LINES:
    if f:
        x = load_mp3(os.path.join(HERE, f)); x = x / (np.abs(x).max() + 1e-9) * 0.8
        if who == 'M': x = phone_fx(x)
        else: x = x + conv(x, IR_ROOM)[: len(x)] * 0.08
        vox.add(at, x, 1.0); dur = len(x) / SR
    else: dur = est
    i, j = int(at * SR), int((at + dur) * SR); vmask[i:j] = 1
    cues.append({'start': at, 'end': at + dur, 'who': who, 'text': text, 'voiced': bool(f)})

# ---------- MIX ----------
k = int(0.25 * SR); sm = np.convolve(vmask, np.ones(k) / k, 'same')
duck = (1 - 0.55 * sm)[:, None]
mix = music.b * duck * 0.8 + sfx.b * (1 - 0.35 * sm)[:, None] + amb.b + vox.b
mix[int(145.06 * SR):] *= 0.0  # hard cut to silence when the plug is pulled
mix = mix[: int(TOTAL * SR)]
peak = np.abs(mix).max(); mix = np.tanh(mix / peak * 1.2) * 0.89
pcm = (mix * 32767).astype('<i2')
with wave.open(os.path.join(OUT, 'day1_mix.wav'), 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# ---------- CAPTIONS (ASS) ----------
def ts(s): h = int(s // 3600); m = int(s % 3600 // 60); return f"{h}:{m:02d}:{s % 60:05.2f}"
def wrap(text, n=46):
    words, lines, cur = text.split(), [], ''
    for w_ in words:
        if len(cur) + len(w_) + 1 > n: lines.append(cur); cur = w_
        else: cur = (cur + ' ' + w_).strip()
    lines.append(cur); return lines
ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: N,Figtree,52,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,3,1,2,120,120,60,1",
       "Style: D,Figtree,52,&H0066E0FF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,3,1,2,120,120,60,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for c in cues:
    lines = wrap(c['text']); chunks = [lines[i:i + 2] for i in range(0, len(lines), 2)]
    tot = sum(len(' '.join(ch)) for ch in chunks); t0 = c['start']
    for ch in chunks:
        d = (c['end'] - c['start']) * len(' '.join(ch)) / tot
        SEP = chr(92) + 'N'; ass.append('Dialogue: 0,%s,%s,%s,,0,0,0,,%s' % (ts(t0), ts(t0 + d), 'N' if c['who'] == 'N' else 'D', SEP.join(ch))); t0 += d
open(os.path.join(OUT, 'day1.ass'), 'w').write('\n'.join(ass) + '\n')
json.dump({'total': TOTAL, 'start': START, 'cues': cues}, open(os.path.join(OUT, 'day1_timeline.json'), 'w'), indent=1)
print('mix', round(TOTAL, 2), 's, cues', len(cues), 'voiced', sum(c['voiced'] for c in cues))
