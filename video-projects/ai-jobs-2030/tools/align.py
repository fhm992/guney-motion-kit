# Re-times renders/mix.wav to the actual frame counts of each section render, so sound stays in sync after the join.
# Each section's audio slice is placed at the section's real start in the joined video (gaps of a frame are filled
# by holding the tail of the previous slice with a short crossfade).
import json, subprocess, numpy as np, wave
SR = 48000; E = json.load(open('plan/edit.json'))
w = wave.open('renders/mix.wav'); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2).astype(np.float32)
parts = []; pos = 0
for s in E['sections']:
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f"renders/{s['id']}.mp4"], capture_output=True, text=True).stdout.strip())
    a, b = int(round(s['start'] * SR)), int(round(s['end'] * SR)); want = int(round(n / 60 * SR))
    seg = x[a:b]
    if len(seg) < want:
        pad = want - len(seg); tail = seg[-pad:] if pad <= len(seg) else np.zeros((pad, 2), np.float32)
        seg = np.concatenate([seg, tail[::-1]])      # mirrored hold: no step at the join
    parts.append(seg[:want]); print(s['id'], n, 'frames', round((want - (b - a)) / SR * 1000, 1), 'ms added')
y = np.concatenate(parts)
o = wave.open('renders/mix-aligned.wav', 'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(np.clip(y, -32768, 32767).astype('<i2').tobytes()); o.close()
