"""PA-system versions of Bob's announcement: b10_pa.wav (the whole line through ceiling speakers, big store echo) and
help_echo.wav (the last word "help" bouncing back three times, then looping for the chase)."""
import os, subprocess, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synth as S
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); SR = S.SR
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(ROOT, 'assets/audio/vo/b10.mp3'), '-af', 'loudnorm=I=-16:TP=-2', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, '<f4').astype(np.float64)
def pa(v):  # small ceiling speaker: band-limited, a little crunchy
    v = S.biquad(S.biquad(v, 'hp', 380, 0.8), 'lp', 3200, 0.9); v = S.biquad(v, 'peak', 1800, 1.2, 6)
    return np.tanh(v * 2.2) / np.tanh(2.2)
# find the last word: last run of loud frames
hop = SR // 50; rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x), hop)]); th = 0.25 * rms.max()
loud = np.where(rms > th)[0]; end = loud[-1]; start = end
while start > 0 and rms[start - 1] > th * 0.4: start -= 1
help_w = x[start * hop:(end + 2) * hop].copy(); help_w *= np.hanning(len(help_w)) ** 0.25
print('last word', round(start * hop / SR, 2), '->', round((end + 2) * hop / SR, 2), 's')
line = S.reverb(pa(x), 0.55, 2.2)
S.write(os.path.join(ROOT, 'assets/audio/sfx9/b10_pa.wav'), line, 0.9)
# echoes: "...help... help... help..." each quieter, wetter
out = np.zeros(int(6.0 * SR)); hw = pa(help_w)
for k, (at, g) in enumerate(((0.0, 0.9), (1.05, 0.6), (2.2, 0.38), (3.4, 0.22))):
    S.place(out, hw * g, at)
S.write(os.path.join(ROOT, 'assets/audio/sfx9/help_echo.wav'), S.reverb(out, 0.7, 2.6), 0.85)
