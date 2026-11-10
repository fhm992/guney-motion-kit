"""Mix a scene's sound from a cue sheet.  python3 audio-src/mix.py audio-src/cues/s01.json renders/s01.wav
Cue: {"f": "assets/audio/...", "at": sec, "db": gain, "from": offset-in-file, "len": max-length, "fi": fade-in, "fo": fade-out, "pan": -1..1}
Top level: {"length": sec, "cues": [...], "duck": [[start,end,db], ...]}  (duck lowers the music bus under dialogue)
"""
import json, subprocess, sys, wave
import numpy as np
SR = 48000
VO_LUFS = -16          # every voice line is levelled to full speech loudness
BUS_DB = {'music': -15, 'fx': -15, 'vo': 0}   # music and sound effects sit 15 dB under their cue levels
MASTER_LUFS = -14      # YouTube loudness
def load(path, lufs=None):
    af = ['-af', f'loudnorm=I={lufs}:TP=-2:LRA=11'] if lufs else []
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *af, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)
def main(sheet, out):
    S = json.load(open(sheet)); n = int(S['length'] * SR); bus = {'music': np.zeros((n, 2)), 'fx': np.zeros((n, 2)), 'vo': np.zeros((n, 2))}
    for c in S['cues']:
        x = load(c['f'], VO_LUFS if c.get('bus', 'fx') == 'vo' else None)[int(c.get('from', 0) * SR):]
        if 'len' in c: x = x[: int(c['len'] * SR)]
        if 'lp' in c:  # muffle (e.g. heard through shelves / underwater)
            import importlib.util, os
            spec = importlib.util.spec_from_file_location('synth', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'synth.py')); syn = importlib.util.module_from_spec(spec); spec.loader.exec_module(syn)
            x = np.stack([syn.biquad(syn.biquad(x[:, k].copy(), 'lp', c['lp'], 0.7), 'lp', c['lp'], 0.7) for k in range(2)], 1)
        x = x * 10 ** (c.get('db', 0) / 20)
        fi, fo = int(c.get('fi', 0.005) * SR), int(c.get('fo', 0.01) * SR)
        if fi: x[:fi] *= np.linspace(0, 1, fi)[:, None][: len(x)]
        if fo and len(x) > fo: x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        p = c.get('pan', 0); x = x * np.array([min(1, 1 - p), min(1, 1 + p)])
        i = int(c['at'] * SR); j = min(n, i + len(x)); b = bus[c.get('bus', 'fx')]; b[i:j] += x[: j - i]
    duck = np.ones(n)
    for a, b, db in S.get('duck', []):
        g = 10 ** (db / 20); i, j = int(a * SR), int(b * SR); r = int(0.15 * SR)
        env = np.ones(n); env[i:j] = g
        env[max(0, i - r):i] = np.linspace(1, g, i - max(0, i - r)); env[j:j + r] = np.linspace(g, 1, len(env[j:j + r]))
        duck = np.minimum(duck, env)
    g = {k: 10 ** (v / 20) for k, v in BUS_DB.items()}
    mixd = bus['music'] * duck[:, None] * g['music'] + bus['fx'] * g['fx'] + bus['vo'] * g['vo']
    peak = np.max(np.abs(mixd)) or 1
    if peak > 0.95: mixd = np.tanh(mixd / peak * 1.2) * 0.95 / np.tanh(1.2)  # soft limit
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mixd, -1, 1) * 32767).astype('<i2').tobytes())
    # master: measure loudness, apply one linear gain to reach MASTER_LUFS (keeps the balance), true-peak limited
    m = subprocess.run(['ffmpeg', '-hide_banner', '-i', out, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    lufs = float([l for l in m.splitlines() if l.strip().startswith('I:')][-1].split()[1])
    tmp = out + '.tmp.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out, '-af', f'volume={MASTER_LUFS - lufs}dB,alimiter=limit=0.89:level=false', tmp], check=True)
    import os; os.replace(tmp, out)
    print('mixed', out, f'{S["length"]}s, was {lufs:.1f} LUFS -> {MASTER_LUFS} LUFS')
if __name__ == '__main__': main(*sys.argv[1:3])
