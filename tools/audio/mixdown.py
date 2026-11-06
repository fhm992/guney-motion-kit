#!/usr/bin/env python3
"""Final sound for a film-engine video: voice + background music (ducked under the voice) + sound effects from cues.
Run from a project folder:
  python3 ../../tools/audio/mixdown.py --voice assets/audio/vo/voice.mp3 --music qa/audio/score.wav --cues qa/audio/cues.json --out qa/audio/final.wav
Options: --music-db -48 (bed level; about 29 dB under the voice; lower = quieter. Keep the music low.)  --sfx-db -21  --duck 0.6 (how far the music dips under speech)
         --dur <seconds> (default: length of the voice + 1.5 s)
Cues: [{"t": 1.2, "name": "whoosh", "gain": 0.5}, ...] collected with tools/film/collect-cues.mjs; names come from
tools/audio/sfx_synth.py (or any WAV in sfx/synth/). The voice file is only read, never changed.
The result is loudness-normalised to -14 LUFS (YouTube / LinkedIn) with ffmpeg."""
import json, subprocess, sys, os, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfx_synth import SFX, SR


def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


if '--voice' not in sys.argv:
    print(__doc__); sys.exit(1)


def decode(path, n=None):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2).T.astype(np.float64)
    if n is None:
        return x
    out = np.zeros((2, n)); out[:, : min(n, x.shape[1])] = x[:, :n]
    return out


voice = decode(arg('--voice'))
DUR = float(arg('--dur', voice.shape[1] / SR + 1.5)); N = int(SR * DUR)
voice = np.pad(voice, ((0, 0), (0, max(0, N - voice.shape[1]))))[:, :N]
mpath = arg('--music')
music = (np.load(mpath) if mpath and mpath.endswith('.npy') else decode(mpath, N)) if mpath else np.zeros((2, N))
music = np.pad(music, ((0, 0), (0, max(0, N - music.shape[1]))))[:, :N].astype(np.float64)
# EQ the bed: trim the sub, carve room where the voice lives
for ch in range(2):
    X = np.fft.rfft(music[ch]); fq = np.fft.rfftfreq(N, 1 / SR)
    X *= np.where(fq < 45, (fq / 45) ** 2, 1.0) * np.where(fq < 160, 0.6, 1.0) * np.where((fq > 900) & (fq < 4000), 0.7, 1.0)
    music[ch] = np.fft.irfft(X, N)

# voice: active-speech RMS to -19 dBFS; ducking envelope (fast attack, slow release)
mono = voice.mean(0); hop = SR // 50
fr = mono[: len(mono) // hop * hop].reshape(-1, hop)
rms = np.sqrt((fr ** 2).mean(1) + 1e-12); act = rms > np.percentile(rms, 95) * 0.12
voice *= 10 ** (-19 / 20) / np.sqrt((fr[act] ** 2).mean())
env = np.zeros(len(rms))
for i in range(1, len(env)):
    env[i] = env[i - 1] + (act[i] - env[i - 1]) * (0.5 if act[i] > env[i - 1] else 0.04)
envN = np.pad(np.repeat(env, hop), (0, N))[:N]
if np.abs(music).max() > 0:
    music *= 10 ** (float(arg('--music-db', -48)) / 20) / np.sqrt((music ** 2).mean())
music *= 1 - float(arg('--duck', 0.6)) * envN

# effects
bus = np.zeros((2, N)); cache = {}; rng = np.random.default_rng(5); missing = set()
here = os.path.dirname(os.path.abspath(__file__)); lib = os.path.join(here, '..', '..', 'sfx', 'synth')
for c in (json.load(open(arg('--cues'))) if arg('--cues') else []):
    name = c['name']
    if name not in cache:
        if name in SFX:
            x = SFX[name]()
        elif os.path.exists(os.path.join(lib, name + '.wav')):
            x = decode(os.path.join(lib, name + '.wav')).mean(0)
        else:
            missing.add(name); continue
        cache[name] = x / (np.abs(x).max() + 1e-9)
    x = cache[name]; i = int(c['t'] * SR)
    if not 0 <= i < N:
        continue
    j = min(N, i + len(x)); pan = float(np.clip(rng.normal(0, 0.25), -0.6, 0.6)); g = c.get('gain', 0.5) * 10 ** (float(arg('--sfx-db', -21)) / 20)
    bus[0, i:j] += x[: j - i] * g * np.cos((pan + 1) * np.pi / 4) * 1.41
    bus[1, i:j] += x[: j - i] * g * np.sin((pan + 1) * np.pi / 4) * 1.41
bus *= 1 - 0.35 * envN
if missing:
    print('unknown sound names:', sorted(missing))

mix = np.tanh((voice + music + bus) * 1.2) / 1.2
out = arg('--out', 'qa/audio/final.wav'); tmp = out + '.raw.wav'
w = wave.open(tmp, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1).T * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), out], check=True)
os.remove(tmp)
print('mix ->', out)
