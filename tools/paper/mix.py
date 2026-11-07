# Run from a project folder: python3 ../../tools/paper/mix.py  -> audio/mix.wav  (voice -15 LUFS, music 25 dB under, effects ~13 under, mix -14.5)
# Final mix: voice (their recording, untouched apart from gain) + score at ~25 dB under the voice + sound effects.
import numpy as np, wave, json, subprocess, os, re
SR = 44100
D = '.'; CFG = json.load(open('plan/scenes.json'))
def read(path):  # any file -> float32 stereo at 44.1k via ffmpeg
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def lufs(x):
    p = os.path.join(D, 'audio', '_tmp.wav'); write(p, x)
    out = subprocess.run(['ffmpeg', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    os.remove(p); return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1])
def write(p, x):
    with wave.open(p, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
END = CFG['end']; N = int(END * SR)
SFXDIR = os.environ.get('SFX_DIR', os.path.join('assets', 'audio', 'sfx', 'paper'))
voice = read(CFG.get('voice', 'voice/voiceover.mp3')); v = np.zeros((N, 2), np.float32); v[:min(N, len(voice))] = voice[:N]
music = read(os.path.join(D, 'audio', 'music.wav'))[:N]; m = np.zeros((N, 2), np.float32); m[:len(music)] = music
# sound effects bus from the cue sheet
cues = json.load(open(os.path.join(D, 'audio', 'cues.json'))); sfx = np.zeros((N, 2), np.float32); cache = {}
for c in cues:
    if c['name'] not in cache: cache[c['name']] = read(os.path.join(SFXDIR, c['name'] + '.wav'))
    b = cache[c['name']]; i = int(max(0, c['t']) * SR); n = min(len(b), N - i)
    if n > 0: sfx[i:i + n] += b[:n] * c['gain']
VT = -15.0
gv = 10 ** ((VT - lufs(v)) / 20); v *= gv
gm = 10 ** ((VT - 25.0 - lufs(m)) / 20); m *= gm
gs = 10 ** ((VT - 13.0 - lufs(sfx)) / 20); sfx *= gs   # effects sit ~13 LU under the voice on average
print('gains dB  voice %.1f  music %.1f  sfx %.1f' % tuple(20 * np.log10([gv, gm, gs])))
mixed = v + m + sfx
mixed *= 10 ** ((-14.5 - lufs(mixed)) / 20)
write(os.path.join(D, 'audio', 'mix_raw.wav'), mixed)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(D, 'audio', 'mix_raw.wav'), '-af', 'alimiter=limit=0.89:level=false', '-ar', '48000', os.path.join(D, 'audio', 'mix.wav')])
print('voice', round(lufs(v), 1), 'music', round(lufs(m), 1), 'sfx', round(lufs(sfx), 1), 'mix', round(lufs(read(os.path.join(D, 'audio', 'mix.wav'))), 1))
