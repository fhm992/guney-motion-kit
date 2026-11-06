# python3 tools/paper/sfx.py [outdir]  (default sfx/paper; already generated, copied into each project as assets/audio/sfx/paper)
# Synthesises every paper-world sound effect the scenes cue, into audio/sfx/<name>.wav (44.1 kHz mono).
import numpy as np, wave, os
SR = 44100
rng = np.random.default_rng(7)
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', '..', 'sfx', 'paper'); os.makedirs(OUT, exist_ok=True)

def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((f >= lo) & (f <= hi)).astype(float)
    # soft edges
    m = np.convolve(m, np.hanning(41) / np.hanning(41).sum(), 'same')
    return np.fft.irfft(X * m, len(x))
def env(d, a=0.005, r=None, shape=4.0):
    t = t_(d); r = d if r is None else r
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-shape * np.maximum(0, t - a) / r)
    return e
def adsr(d, a, s_end):  # linear attack, hold, release at end
    t = t_(d); e = np.minimum(1, t / a); rel = np.clip((d - t) / s_end, 0, 1); return e * rel
def tone(f, d, parts=((1, 1, 1),), a=0.003):
    t = t_(d); y = np.zeros_like(t)
    for mult, amp, dec in parts: y += amp * np.sin(2 * np.pi * f * mult * t) * np.exp(-t / dec)
    return y * np.minimum(1, t / a)
def sweep(f0, f1, d, kind='exp'):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d) if kind == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def bell(f, d=1.2): return tone(f, d, ((1, 1, d * 0.5), (2.76, 0.4, d * 0.18), (5.4, 0.2, d * 0.08), (8.9, 0.1, 0.05)))
def mallet(f, d=0.8): return tone(f, d, ((1, 1, d * 0.4), (3.9, 0.3, 0.08), (9.2, 0.1, 0.03)))
def thump(f=70, d=0.35, k=1.0):
    t = t_(d); ff = f * (1 + 1.5 * np.exp(-t / 0.02)); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / (d * 0.3)) * k
def mix(*xs):
    n = max(len(x) for x in xs); y = np.zeros(n)
    for x in xs: y[:len(x)] += x
    return y
def at(x, s): return np.concatenate([np.zeros(int(s * SR)), x])
def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1; x = x / m * peak
    fade = min(len(x), int(0.01 * SR)); x[-fade:] *= np.linspace(1, 0, fade); return x
def paper(d, lo=1500, hi=9000, a=0.02, shape=3): return band(noise(d), lo, hi) * env(d, a, d, shape)
def slide(d=0.35, lo=800, hi=6000):  # rising-falling paper slide
    t = t_(d); e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return band(noise(d), lo, hi) * e
def click(f=3000, d=0.02): return band(noise(d), f * 0.5, f * 2) * env(d, 0.0005, d, 6)

S = {}
S['key'] = lambda: mix(click(2500, 0.03) * 0.8, tone(1800, 0.03, ((1, .3, .008),)))
S['tick'] = lambda: mix(click(5000, 0.02), tone(2600, 0.04, ((1, .4, .01),)))
S['click'] = lambda: mix(click(3500, 0.03), thump(400, 0.05, .3))
S['blip'] = lambda: tone(880, 0.08, ((1, .6, .05),)) * (np.sign(np.sin(2 * np.pi * 440 * t_(0.08))) * .3 + .7)
S['clack'] = lambda: mix(mallet(820, 0.25), click(3000, 0.02) * .5)
S['clip'] = lambda: mix(click(4000, 0.02), at(click(2500, 0.03), 0.05))
S['clickin'] = lambda: mix(click(3000, 0.03), at(click(2000, 0.04), 0.06), at(thump(300, 0.1, .4), 0.06))
S['lock'] = lambda: mix(click(2500, 0.04), at(mix(click(1800, 0.05), thump(500, 0.12, .5)), 0.08))
S['staple'] = lambda: mix(thump(220, 0.12, .8), click(5000, 0.04), at(click(3000, 0.03), 0.03))
S['dart'] = lambda: mix(thump(300, 0.15, 1), click(2000, 0.05))
S['flick'] = lambda: paper(0.09, 2000, 9000, 0.003, 5)
S['marker'] = lambda: band(noise(0.45), 2500, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t_(0.45))) * env(0.45, 0.02, 0.45, 1.5)
S['scribble'] = lambda: band(noise(0.5), 1800, 6000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t_(0.5)))) * env(0.5, 0.02, 0.5, 1.5)
S['paperslide'] = lambda: slide(0.35)
S['swish'] = lambda: slide(0.28, 1500, 9000)
S['swipe'] = lambda: slide(0.22, 1200, 8000)
S['handoff'] = lambda: slide(0.3, 900, 6000)
S['whoosh'] = lambda: band(noise(0.6), 200, 3000) * np.sin(np.pi * np.clip(t_(0.6) / 0.6, 0, 1)) ** 2
S['plane'] = lambda: band(noise(1.4), 300, 4000) * np.sin(np.pi * np.clip(t_(1.4) / 1.4, 0, 1)) ** 2
S['flutter'] = lambda: band(noise(0.6), 1200, 7000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 14 * t_(0.6)))) * env(0.6, 0.03, 0.6, 2)
S['flag'] = lambda: band(noise(0.35), 1200, 6000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 18 * t_(0.35)))) * env(0.35, 0.02, 0.35, 2)
S['flip'] = lambda: mix(paper(0.12, 1500, 8000, 0.005, 4), at(paper(0.08, 800, 5000, 0.002, 6) * .6, 0.08))
S['flipcards'] = lambda: mix(*[at(paper(0.07, 1500, 8000, 0.002, 5) * (0.6 + 0.4 * rng.random()), i * 0.045) for i in range(10)])
S['deal'] = lambda: mix(paper(0.1, 1500, 9000, 0.002, 5), at(click(2500, 0.02) * .5, 0.07))
S['sticky'] = lambda: mix(thump(260, 0.08, .6), paper(0.06, 2000, 8000, 0.001, 6) * .5)
S['slap'] = lambda: mix(paper(0.15, 600, 6000, 0.001, 6), thump(140, 0.2, .8))
S['stamp'] = lambda: mix(thump(110, 0.35, 1), paper(0.08, 500, 4000, 0.001, 6) * .5)
S['thunk'] = lambda: mix(thump(70, 0.5, 1), paper(0.05, 300, 2000, 0.001, 6) * .4)
S['thud'] = lambda: thump(55, 0.6, 1)
S['clunk'] = lambda: mix(thump(120, 0.3), mallet(240, 0.3) * .4)
S['door'] = lambda: mix(thump(90, 0.4), at(click(1500, 0.05), 0.02))
S['drawer'] = lambda: mix(slide(0.25, 300, 3000), at(thump(150, 0.2, .7), 0.22))
S['step'] = lambda: mix(thump(160, 0.12, .6), paper(0.05, 800, 4000, 0.001, 6) * .3)
S['card'] = lambda: mix(slide(0.3, 800, 6000), at(thump(160, 0.18, .6), 0.25))
S['pop'] = lambda: mix(tone(600, 0.12, ((1, 1, .03),)) * np.exp(-t_(0.12) / 0.04), click(2000, 0.02) * .3)
S['boop'] = lambda: sweep(500, 300, 0.25) * env(0.25, 0.01, 0.25, 4)
S['boing'] = lambda: sweep(180, 360, 0.35, 'lin') * np.exp(-t_(0.35) / 0.15) * (1 + 0.3 * np.sin(2 * np.pi * 18 * t_(0.35)))
S['stretch'] = lambda: sweep(200, 900, 1.2) * env(1.2, 0.05, 1.2, 1.2) * 0.6
S['gulp'] = lambda: mix(sweep(300, 120, 0.18) * env(0.18, 0.01, 0.18, 3), at(sweep(260, 110, 0.15) * env(0.15, 0.01, 0.15, 3) * .6, 0.2))
S['wink'] = lambda: mix(bell(2400, 0.4) * .6, at(bell(3200, 0.4) * .5, 0.08))
S['ding'] = lambda: bell(1320, 1.4)
S['tink'] = lambda: bell(3100, 0.6)
S['chime'] = lambda: mix(bell(1046, 1.2), at(bell(1318, 1.2), 0.1), at(bell(1568, 1.4), 0.2)) * .6
S['shimmer'] = lambda: mix(*[at(bell(f, 1.0) * .4, i * 0.06) for i, f in enumerate([1568, 1976, 2349, 2637, 3136])])
S['frost'] = lambda: mix(*[at(bell(f, 0.8) * .4, i * 0.05) for i, f in enumerate([2637, 3520, 4186])])
S['dreamy'] = lambda: mix(*[at(bell(f, 2.0) * .35, i * 0.12) for i, f in enumerate([880, 1108, 1318, 1760, 1318, 1108])])
S['ping'] = lambda: mix(bell(1568, 0.6) * .7, at(bell(2093, 0.8) * .7, 0.09))
S['callchime'] = lambda: mix(bell(784, 0.8), at(bell(1046, 0.8), 0.15), at(bell(1318, 1.0), 0.3)) * .6
S['clockchime'] = lambda: mix(bell(523, 2.0), at(bell(392, 2.2), 0.5)) * .7
S['ring'] = lambda: mix(*[at(tone(1200 if i % 2 else 1500, 0.05, ((1, 1, .05),)), i * 0.05) for i in range(16)]) * .5
S['kaching'] = lambda: mix(thump(200, 0.1, .5), at(bell(2093, 1.0), 0.06), at(bell(2637, 1.0) * .6, 0.12), paper(0.15, 3000, 9000, 0.001, 5) * .3)
S['coin'] = lambda: mix(bell(2800, 0.5) * .7, at(bell(3600, 0.4) * .4, 0.03))
S['coins'] = lambda: mix(*[at(bell(2400 + 900 * rng.random(), 0.4) * .5, rng.random() * 0.6) for _ in range(12)])
S['snap'] = lambda: mix(thump(200, 0.15, .7), click(3000, 0.03), at(bell(1568, 0.8) * .4, 0.02))
S['sting'] = lambda: mix(mallet(392, 0.4), at(mallet(370, 0.6), 0.22)) * .8
S['resolve'] = lambda: mix(mallet(523, 1.2), mallet(659, 1.2) * .7, at(mallet(784, 1.4) * .7, 0.15)) * .6
S['warm'] = lambda: mix(*[tone(f, 2.0, ((1, .5, 1.2), (2, .15, .6)), a=0.3) for f in (294, 370, 440, 587)]) * .4
S['whimsy'] = lambda: mix(*[at(mallet(f, 0.4) * .6, i * 0.08) for i, f in enumerate([784, 988, 1175, 1568, 1175])])
S['finale'] = lambda: mix(*[at(tone(f, 3.0, ((1, .5, 2.0), (2, .2, 1.0), (3, .1, .5)), a=0.02), i * 0.03) for i, f in enumerate([147, 220, 294, 370, 440, 587, 740])]) * .5
S['swell'] = lambda: band(noise(1.4), 200, 4000) * adsr(1.4, 1.0, 0.4) * .4 + mix(*[tone(f, 1.4, ((1, .3, 3),), a=1.0) for f in (294, 440, 587)]) * adsr(1.4, 1.0, 0.4) * .5
S['dread'] = lambda: (sweep(70, 55, 1.6) * .8 + band(noise(1.6), 40, 300) * .5) * adsr(1.6, 0.3, 1.0)
S['rumble'] = lambda: band(noise(1.5), 30, 200) * adsr(1.5, 0.4, 0.8)
S['creak'] = lambda: band(np.sign(np.sin(2 * np.pi * np.cumsum(90 + 30 * np.sin(2 * np.pi * 3 * t_(0.6))) / SR)) * 1.0, 200, 2500) * env(0.6, 0.05, 0.6, 2) * .5
S['tug'] = lambda: S['creak']()[:int(0.35 * SR)]
S['scrape'] = lambda: band(noise(0.5), 400, 3000) * (0.6 + 0.4 * np.sin(2 * np.pi * 30 * t_(0.5))) * env(0.5, 0.02, 0.5, 2)
S['snip'] = lambda: mix(click(4000, 0.03), at(paper(0.04, 3000, 9000, 0.001, 6), 0.01), at(click(5000, 0.02), 0.06))
S['crunch'] = lambda: mix(*[at(paper(0.04, 1000, 6000, 0.001, 6) * rng.random(), i * 0.035) for i in range(8)])
S['copier'] = lambda: band(noise(0.8), 500, 5000) * (0.5 + 0.5 * np.sin(np.pi * t_(0.8) / 0.8)) * .6 + tone(120, 0.8, ((1, .3, 2),)) * .3
S['deflate'] = lambda: mix(sweep(400, 90, 0.7) * env(0.7, 0.02, 0.7, 1.5) * .6, band(noise(0.7), 300, 3000) * env(0.7, 0.05, 0.7, 2) * .4)
S['glue'] = lambda: mix(sweep(300, 200, 0.15) * env(0.15, .005, .15, 3), paper(0.1, 500, 3000, 0.001, 5) * .4)
S['rewind'] = lambda: band(noise(0.7), 600, 6000) * np.linspace(0.2, 1, int(0.7 * SR)) * adsr(0.7, 0.05, 0.1) + sweep(900, 200, 0.7) * .2
S['paste'] = lambda: mix(click(3000, 0.03), at(S['pop']() * .6, 0.03))
S['send'] = lambda: mix(slide(0.3, 1500, 8000), sweep(500, 1200, 0.25) * env(0.25, 0.01, 0.25, 3) * .3)
S['yawn'] = lambda: band(noise(1.2), 300, 1200) * adsr(1.2, 0.4, 0.6) * .6 + sweep(220, 150, 1.2) * adsr(1.2, 0.4, 0.6) * .2
S['sigh'] = lambda: band(noise(0.9), 400, 2500) * adsr(0.9, 0.1, 0.7) * .5
S['gasp'] = lambda: band(noise(0.35), 800, 4000) * adsr(0.35, 0.05, 0.2) * .6
S['ooh'] = lambda: mix(*[tone(f, 1.0, ((1, .5, .8), (2, .25, .5), (3, .1, .3)), a=0.15) * (1 + 0.05 * np.sin(2 * np.pi * 5 * t_(1.0))) for f in (330, 392, 494)]) * .4
S['clap'] = lambda: mix(*[at(band(noise(0.06), 800, 5000) * env(0.06, 0.001, 0.06, 6), i * 0.012) for i in range(3)])
S['unroll'] = lambda: band(noise(0.8), 800, 6000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 20 * t_(0.8)))) * adsr(0.8, 0.05, 0.3)
S['clink'] = lambda: mix(bell(2200, 0.3) * .6, click(4000, 0.02))
S['tear'] = lambda: band(noise(0.45), 1200, 7000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 40 * t_(0.45)))) * env(0.45, 0.01, 0.45, 2)
S['crash'] = lambda: mix(thump(60, 0.6, 1), band(noise(0.9), 400, 6000) * env(0.9, 0.002, 0.9, 3) * .8, *[at(bell(2000 + 1500 * rng.random(), 0.3) * .2, rng.random() * 0.3) for _ in range(6)])
S['shatter'] = lambda: mix(band(noise(0.8), 2000, 9000) * env(0.8, 0.002, 0.8, 4) * .6, *[at(bell(2500 + 2000 * rng.random(), 0.4) * .25, rng.random() * 0.5) for _ in range(14)])
S['netcatch'] = lambda: mix(thump(120, 0.3, .8), at(band(noise(0.4), 600, 3000) * (0.5 + 0.5 * np.sin(2 * np.pi * 25 * t_(0.4))) * env(0.4, 0.01, 0.4, 2) * .5, 0.04))
S['zip'] = lambda: band(noise(0.45), 1500, 7000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * np.cumsum(np.linspace(30, 90, int(0.45 * SR))) / SR))) * env(0.45, 0.02, 0.45, 1.5)
S['build'] = lambda: mix(*[at(mix(mallet(300 + 60 * i, 0.2) * .5, click(2000, 0.02) * .4), i * 0.07) for i in range(9)])
S['chug'] = lambda: mix(*[at(mix(thump(90, 0.15, .7), paper(0.08, 500, 3000, 0.002, 5) * .3), i * 0.18) for i in range(6)])
S['settle'] = lambda: mix(paper(0.3, 800, 5000, 0.02, 3), at(thump(200, 0.1, .3), 0.25))
S['accordion'] = lambda: mix(*[at(paper(0.06, 1500, 7000, 0.002, 5) * .7, i * 0.05) for i in range(8)])
S['sand'] = lambda: band(noise(1.0), 3000, 9000) * adsr(1.0, 0.1, 0.4) * .5
S['rain'] = lambda: mix(*[at(click(3000 + 3000 * rng.random(), 0.01) * rng.random(), rng.random() * 2.0) for _ in range(120)]) * .5
S['gameover'] = lambda: mix(*[at(tone(f, 0.18, ((1, .7, .2),)) * (np.sign(np.sin(2 * np.pi * f * t_(0.18))) * .4 + .6), i * 0.16) for i, f in enumerate([660, 523, 440, 330])])
S['pluck'] = lambda: tone(220, 0.6, ((1, 1, .15), (2, .4, .08), (3, .2, .05)))
S['fade'] = lambda: band(noise(1.0), 300, 3000) * adsr(1.0, 0.5, 0.5) * .4
S['release'] = lambda: mix(sweep(300, 600, 0.4) * env(0.4, 0.02, 0.4, 2) * .4, at(bell(1318, 1.0) * .5, 0.2))
S['tug'] = S['tug']

for name, fn in S.items():
    y = norm(fn(), 0.9).astype(np.float32)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((y * 32767).astype(np.int16).tobytes())
print(len(S), 'sounds ->', OUT)
