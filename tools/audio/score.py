# Explainer score generator: ambient-electronic background music in the spirit of science-explainer channels
# (warm detuned pads, plucky arpeggios, soft FM bells, sub bass, light percussion, swells into each chapter). No samples, no licences.
#   Full score that follows a story:  python3 tools/audio/score.py --map plan/score.json out.wav
#       score.json: {"bpm": 92, "duration": 412.5, "map": [[0, "mystery", ["Bm","G","D","A"]], [24, "curious", [...]], ...], "chapters": [24.6, ...]}
#       (see tools/audio/score-example.json: the map of the "11 ways to use AI" video)
#   One mood as a loop:               python3 tools/audio/score.py --loop curious --bars 16 out.wav
#   List moods and chords:            python3 tools/audio/score.py --list
# Moods: see MOODS below. Chords: see CH below. Output .wav (stereo 48 kHz) or .npy.
import numpy as np, sys, json

SR = 48000
BPM = 92
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 412.5
N = int(SR * DUR)
R = np.random.default_rng(92)
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name):
    n, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((NOTE[n] + 12 * (o + 1) - 69) / 12)


CH = {
    'D': ('D2', ['D3', 'F#3', 'A3', 'D4', 'F#4', 'A4', 'D5']), 'Dmaj7': ('D2', ['D3', 'F#3', 'A3', 'C#4', 'F#4', 'A4', 'C#5']),
    'Dadd9': ('D2', ['D3', 'A3', 'E4', 'F#4', 'A4', 'E5', 'F#5']), 'Bm': ('B1', ['B2', 'D3', 'F#3', 'B3', 'D4', 'F#4', 'B4']),
    'Bm7': ('B1', ['B2', 'D3', 'F#3', 'A3', 'D4', 'F#4', 'A4']), 'G': ('G1', ['G2', 'B2', 'D3', 'G3', 'B3', 'D4', 'G4']),
    'Gmaj7': ('G1', ['G2', 'B2', 'D3', 'F#3', 'B3', 'D4', 'F#4']), 'Glyd': ('G1', ['G2', 'B2', 'C#4', 'D4', 'F#4', 'B4', 'C#5']),
    'A': ('A1', ['A2', 'C#3', 'E3', 'A3', 'C#4', 'E4', 'A4']), 'Asus': ('A1', ['A2', 'D3', 'E3', 'A3', 'D4', 'E4', 'A4']),
    'Em': ('E2', ['E3', 'G3', 'B3', 'E4', 'G4', 'B4', 'E5']), 'Em7': ('E2', ['E3', 'G3', 'B3', 'D4', 'G4', 'B4', 'D5']),
    'F#': ('F#1', ['F#2', 'A#2', 'C#3', 'F#3', 'A#3', 'C#4', 'F#4']), 'F#m': ('F#2', ['F#3', 'A3', 'C#4', 'F#4', 'A4', 'C#5', 'F#5']),
}

# mood presets: pad cutoff, pad level, arp pattern ('none'|'8'|'16'|'bell'|'sparse'), arp level, bass, kick, hat, bell, drone
MOODS = {
    'mystery': dict(cut=650, pad=0.75, arp='bell', arpL=0.5, bass=0.5, kick=0, hat=0, shaker=0, drone=0.6),
    'silence': dict(cut=400, pad=0.0, arp='none', arpL=0, bass=0, kick=0, hat=0, shaker=0, drone=0),
    'reveal': dict(cut=1800, pad=1.0, arp='16', arpL=0.55, bass=0.7, kick=0, hat=0, shaker=0.3, drone=0, sparkle=1),
    'curious': dict(cut=1300, pad=0.7, arp='8', arpL=0.75, bass=0.6, kick=0.35, hat=0.25, shaker=0.3, drone=0),
    'curious16': dict(cut=1600, pad=0.7, arp='16', arpL=0.7, bass=0.65, kick=0.5, hat=0.35, shaker=0.35, drone=0),
    'dark': dict(cut=700, pad=0.8, arp='pulse', arpL=0.6, bass=0.8, kick=0.3, hat=0.3, shaker=0, drone=0.5),
    'warm': dict(cut=1500, pad=0.85, arp='bell8', arpL=0.65, bass=0.55, kick=0.2, hat=0.15, shaker=0.25, drone=0),
    'lonely': dict(cut=800, pad=0.7, arp='sparse', arpL=0.6, bass=0.4, kick=0, hat=0, shaker=0, drone=0.3),
    'wide': dict(cut=1400, pad=0.9, arp='16', arpL=0.5, bass=0.6, kick=0, hat=0.2, shaker=0.2, drone=0),
    'tension': dict(cut=900, pad=0.8, arp='pulse', arpL=0.65, bass=0.7, kick=0.25, hat=0.3, shaker=0, drone=0.4),
    'freeze': dict(cut=2600, pad=0.45, arp='bell', arpL=0.35, bass=0.0, kick=0, hat=0, shaker=0, drone=0.2),
    'build': dict(cut=1500, pad=0.9, arp='16', arpL=0.75, bass=0.75, kick=0.45, hat=0.4, shaker=0.3, drone=0, rise=1),
    'climax': dict(cut=3000, pad=1.15, arp='16', arpL=0.85, bass=0.9, kick=0.7, hat=0.5, shaker=0.4, drone=0, sparkle=1),
    'light': dict(cut=1700, pad=0.6, arp='8', arpL=0.6, bass=0.5, kick=0.2, hat=0.2, shaker=0.3, drone=0),
    'playful': dict(cut=1900, pad=0.55, arp='bell8', arpL=0.75, bass=0.55, kick=0.4, hat=0.3, shaker=0.35, drone=0),
    'night': dict(cut=700, pad=0.6, arp='sparse', arpL=0.5, bass=0.35, kick=0, hat=0, shaker=0, drone=0.2),
    'adventure': dict(cut=2200, pad=0.8, arp='16', arpL=0.75, bass=0.75, kick=0.55, hat=0.45, shaker=0.35, drone=0),
    'resolve': dict(cut=2000, pad=0.95, arp='8', arpL=0.65, bass=0.65, kick=0.3, hat=0.25, shaker=0.3, drone=0, sparkle=1),
    'calm': dict(cut=1100, pad=0.75, arp='bell', arpL=0.5, bass=0.45, kick=0, hat=0, shaker=0.15, drone=0),
    'groove': dict(cut=1300, pad=0.6, arp='8', arpL=0.55, bass=0.65, kick=0.4, hat=0.3, shaker=0.25, drone=0),
    'uplift': dict(cut=2600, pad=1.0, arp='16', arpL=0.8, bass=0.75, kick=0.55, hat=0.45, shaker=0.35, drone=0, sparkle=1),
    'finale': dict(cut=3200, pad=1.15, arp='16', arpL=0.85, bass=0.85, kick=0.6, hat=0.45, shaker=0.4, drone=0, sparkle=1),
    'outro': dict(cut=1800, pad=1.0, arp='bell', arpL=0.55, bass=0.5, kick=0, hat=0, shaker=0, drone=0, hold=1),
}




def lowpass(x, cut, q=0.35):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / cut) ** 4) ** 0.5, len(x))


def saw(f, t, ph=0.0):
    return 2 * ((f * t + ph) % 1.0) - 1


def env(n, a, d, s, r, total):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel = np.clip((total - t) / max(r, 1e-4), 0, 1)
    return e * rel


def pad_chord(tones, d, cut, level):
    n = int(SR * (d + 1.6))
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in tones:
        for k, dt in enumerate((-9, -4, 0, 4, 9)):
            ff = f * 2 ** (dt / 1200)
            s += saw(ff, t, R.random()) * (0.7 if k in (0, 4) else 1.0)
    s = lowpass(s, cut)
    s *= env(n, 0.9, 1.0, 0.85, 1.6, d + 1.6)
    s *= 1 + 0.06 * np.sin(2 * np.pi * 0.21 * t)
    return s * level / (len(tones) * 5)


def pluck(f, d, cut=2400, level=1.0, bright=1.0):
    n = int(SR * (d + 0.5))
    t = np.arange(n) / SR
    s = 0.6 * saw(f, t) + 0.4 * np.sign(np.sin(2 * np.pi * f * 1.003 * t))
    s = lowpass(s, cut * bright) * np.exp(-t / 0.16) + lowpass(s, cut * 0.35) * np.exp(-t / 0.45) * 0.6
    return s * np.minimum(1, t / 0.003) * np.clip((d + 0.5 - t) / 0.5, 0, 1) * level


def fmbell(f, level=1.0, d=2.4):
    n = int(SR * d)
    t = np.arange(n) / SR
    I = 2.4 * np.exp(-t / 0.35)
    s = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 0.8)
    s += 0.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.4)
    return s * np.minimum(1, t / 0.002) * level


def sub(f, d, level):
    n = int(SR * (d + 0.3))
    t = np.arange(n) / SR
    s = np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * 0.8 + 0.3 * np.sin(2 * np.pi * f * 2 * t)
    return s * env(n, 0.01, 0.6, 0.7, 0.3, d + 0.3) * level


def kick():
    n = int(SR * 0.4)
    t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13)


def hat(seed, d=0.06):
    n = int(SR * d)
    x = np.random.default_rng(seed).standard_normal(n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    x = np.fft.irfft(X * (fr > 7000), n)
    return x * np.exp(-np.arange(n) / SR / 0.02) * 0.6


def shaker(seed):
    n = int(SR * 0.09)
    x = np.random.default_rng(seed).standard_normal(n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    x = np.fft.irfft(X * ((fr > 4000) & (fr < 11000)), n)
    t = np.arange(n) / SR
    return x * (t / 0.03) * np.exp(-t / 0.025) * 0.5


def swell(d=2.2):
    n = int(SR * d)
    t = np.arange(n) / SR
    x = np.random.default_rng(7).standard_normal(n)
    out = np.zeros(n)
    hop = 4800
    for i in range(0, n, hop):
        seg = x[i:i + hop * 2]
        if len(seg) < 16:
            break
        fc = 300 + 5000 * (i / n) ** 2
        out[i:i + len(seg)] += lowpass(seg, fc) * np.hanning(len(seg))
    return out * (t / d) ** 2.2 * 0.5


def put(buf, x, t0, pan=0.0, g=1.0):
    i = int(t0 * SR)
    if i >= N or len(x) == 0:
        return
    j = min(N, i + len(x))
    l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    buf[0, i:j] += x[: j - i] * l * g
    buf[1, i:j] += x[: j - i] * r * g


def reverb(x, seconds=2.6, mix=0.32, seed=3):
    n = int(SR * seconds)
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    out = x.copy()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 5))
        ir = lowpass(ir, 5000)
        ir /= np.sqrt((ir ** 2).sum())
        # overlap-add FFT convolution
        L = 1 << 18
        nfft = 1 << int(np.ceil(np.log2(L + n)))
        H = np.fft.rfft(ir, nfft)
        y = np.zeros(len(x[ch]) + n)
        for i in range(0, len(x[ch]), L):
            blk = x[ch, i:i + L]
            yb = np.fft.irfft(np.fft.rfft(blk, nfft) * H, nfft)[: len(blk) + n]
            y[i:i + len(yb)] += yb
        out[ch] += mix * y[: len(x[ch])]
    return out


def build(MAP, CHAPTERS):
    pads = np.zeros((2, N))
    mel = np.zeros((2, N))
    low = np.zeros((2, N))
    drum = np.zeros((2, N))
    for si, (t0, mood, prog) in enumerate(MAP):
        t1 = MAP[si + 1][0] if si + 1 < len(MAP) else DUR
        M = MOODS[mood]
        if mood == 'silence':
            continue
        nb = int(np.ceil((t1 - t0) / BAR))
        for b in range(nb):
            bt = t0 + b * BAR
            if bt >= t1 - 0.05:
                break
            name = prog[b % len(prog)]
            root, tones = CH[name]
            d = min(BAR, t1 - bt) if not M.get('hold') else DUR - bt - 2.5
            # pad (rising filter inside 'build' moods)
            cut = M['cut'] * (1 + (0.8 * (b / max(1, nb - 1)) if M.get('rise') else 0))
            if M['pad']:
                put(pads, pad_chord([hz(x) for x in tones[1:5]], d, cut, 0.55 * M['pad']), bt)
            if M['bass']:
                put(low, sub(hz(root), min(d, BAR) - 0.05, 0.42 * M['bass']), bt)
            arp = M['arp']
            if arp in ('8', '16', 'pulse'):
                step = BEAT / 2 if arp in ('8', 'pulse') else BEAT / 4
                pat = [3, 4, 5, 4, 6, 5, 4, 5] if arp != 'pulse' else [0, 0, 0, 0, 0, 0, 0, 0]
                for k in range(int(min(d, BAR) / step)):
                    tt = bt + k * step
                    if tt >= t1:
                        break
                    if arp == 'pulse':
                        f, cutp, lv = hz(tones[0]), 900, 0.32
                    else:
                        f, cutp, lv = hz(tones[pat[k % 8]]), 2600, 0.26
                    acc = 1.0 if k % 4 == 0 else 0.72 + 0.12 * R.random()
                    put(mel, pluck(f, step * 1.3, cutp, lv * acc * M['arpL']), tt, -0.35 + 0.7 * ((k * 3) % 4) / 3)
            elif arp in ('bell', 'bell8', 'sparse'):
                hits = [(0, 4), (1.5, 5), (2.5, 6), (3.25, 5)] if arp == 'bell' else ([(k * 0.5, [4, 5, 6, 5, 4, 6, 5, 3][k]) for k in range(8)] if arp == 'bell8' else [(0, 4), (2, 6)])
                for bb, ti in hits:
                    tt = bt + bb * BEAT
                    if tt < t1:
                        put(mel, fmbell(hz(tones[ti]) * (2 if arp != 'sparse' else 1), (0.22 if arp == 'bell8' else 0.3) * M['arpL']), tt, -0.4 + 0.8 * R.random())
            if M.get('sparkle') and b % 2 == 0:
                for k in range(4):
                    put(mel, fmbell(hz(tones[6]) * 2 * [1, 1.5, 2, 1.5][k], 0.07), bt + k * BEAT * 0.5 + 2 * BEAT, 0.5 - 0.3 * k)
            if M.get('drone'):
                n = int(SR * (d + 1))
                tt = np.arange(n) / SR
                dr = (np.sin(2 * np.pi * hz(CH[prog[0]][0]) * tt) + 0.5 * np.sin(2 * np.pi * hz(CH[prog[0]][0]) * 1.5 * tt)) * np.minimum(1, tt / 1.0) * np.clip((d + 1 - tt) / 1.0, 0, 1)
                put(low, dr * 0.12 * M['drone'], bt)
            # drums: soft kick on 1 and 3, hats on off-beats, shaker 16ths
            for k in range(16):
                tt = bt + k * BEAT / 4
                if tt >= t1 or tt >= bt + d:
                    break
                if M['kick'] and k in (0, 8):
                    put(drum, kick(), tt, 0, 0.5 * M['kick'])
                if M['hat'] and k % 4 == 2:
                    put(drum, hat(k + b), tt, 0.3, 0.32 * M['hat'])
                if M['shaker'] and k % 2 == 1:
                    put(drum, shaker(k * 7 + b), tt, -0.3, 0.22 * M['shaker'] * (1 if k % 4 == 3 else 0.6))
    # swells into each chapter
    sw = swell(2.2)
    for c in CHAPTERS:
        put(pads, sw, c - 2.2, 0.0, 0.18)
    # sidechain feel: duck pads/bass slightly on kicks of drum-driven parts
    mix = reverb(pads + mel, 2.8, 0.38) + low + reverb(drum, 1.2, 0.15, 5) * 0.9
    fade = np.ones(N)
    fe = int(SR * 3.0)
    fade[-fe:] = np.linspace(1, 0, fe) ** 1.6
    fade[: int(SR * 1.5)] = np.linspace(0, 1, int(SR * 1.5))
    mix *= fade
    mix /= np.max(np.abs(mix)) + 1e-9
    return (mix * 0.9).astype(np.float32)


def render(MAP, CHAPTERS=(), dur=None, bpm=92):
    global DUR, N, BPM, BEAT, BAR
    BPM = bpm; BEAT = 60 / BPM; BAR = BEAT * 4
    DUR = dur or (MAP[-1][0] + BAR * 4); N = int(SR * DUR)
    return build(MAP, list(CHAPTERS))


def save(m, path):
    if path.endswith('.npy'):
        np.save(path, m)
    else:
        import wave
        w = wave.open(path, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(m, -1, 1).T * 32767).astype(np.int16).tobytes()); w.close()


if __name__ == '__main__':
    a = sys.argv[1:]
    if '--list' in a or not a:
        print(__doc__ if __doc__ else ''); print('moods:', ', '.join(MOODS)); print('chords:', ', '.join(CH)); sys.exit(0)
    out = [x for x in a if x.endswith(('.wav', '.npy'))][0]
    if '--loop' in a:
        mood = a[a.index('--loop') + 1]; bars = int(a[a.index('--bars') + 1]) if '--bars' in a else 12
        prog = {'mystery': ['Bm', 'G', 'D', 'A'], 'dark': ['Bm', 'G', 'Em', 'F#'], 'tension': ['Bm', 'G', 'Em', 'Asus'], 'lonely': ['Bm', 'G', 'D', 'A'], 'night': ['Bm', 'G', 'D', 'A'], 'warm': ['Gmaj7', 'D', 'Em7', 'Asus'], 'calm': ['Gmaj7', 'D', 'Em7', 'A'], 'uplift': ['Dadd9', 'A', 'Bm', 'Gmaj7'], 'freeze': ['Em7', 'Bm7']}.get(mood, ['D', 'A', 'Bm', 'G'])
        dur = bars * 4 * 60 / 92 + 3.0
        m = render([(0.0, mood, prog)], [], dur)
    else:
        spec = json.load(open(a[a.index('--map') + 1]))
        m = render([tuple(x) for x in spec['map']], spec.get('chapters', []), spec.get('duration'), spec.get('bpm', 92))
    save(m, out)
    print('score ->', out, round(m.shape[1] / SR, 1), 's')
