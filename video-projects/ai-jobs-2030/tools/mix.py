# Final audio: edited voice + score (already ducked) + sound effects from plan/sfx-cues.json -> renders/mix.wav (48 kHz stereo)
import json, numpy as np, wave
SR = 48000
def rd(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(n), '<i2').astype(np.float32) / 32768
    return x.reshape(-1, ch).T if ch > 1 else x[None, :]
v = np.load('qa/voice_edit.npy').astype(np.float32); N = len(v)
m = rd('assets/audio/music.wav')[:, :N]
out = np.zeros((2, N), np.float32)
vg = 0.5 / (np.percentile(np.abs(v), 99.9) + 1e-9)          # voice peaks around -6 dBFS before limiting
out += v * vg
out[:, :m.shape[1]] += m * 0.95 * 10 ** (-20 / 20)   # background music lowered by 20 dB
cache = {}
for c in json.load(open('plan/sfx-cues.json')):
    if c['g'] <= 0: continue
    x = cache.setdefault(c['name'], rd(f"assets/audio/fx/{c['name']}.wav")[0]); i = int(c['t'] * SR)
    if i >= N: continue
    if i < 0: x = x[-i:]; i = 0
    seg = x[:N - i] * c['g'] * 0.42; p = c.get('pan', 0)
    out[0, i:i + len(seg)] += seg * np.cos((p + 1) * np.pi / 4) * 1.414; out[1, i:i + len(seg)] += seg * np.sin((p + 1) * np.pi / 4) * 1.414
pk = np.abs(out).max(); out = np.tanh(out / max(pk, 1e-9) * 1.2) / np.tanh(1.2) * 0.89   # soft limit at about -1 dBFS
w = wave.open('renders/mix.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out.T * 32767).astype('<i2').tobytes()); w.close()
print('mix', N / SR, 's peak in', round(float(pk), 2))
