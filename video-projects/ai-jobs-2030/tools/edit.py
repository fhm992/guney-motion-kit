# Builds the program edit: cuts the duplicate, inserts music-only breaths, writes the edited voice,
# program-time words (assets/edit.js) and a per-frame voice envelope (assets/vo-env.js) for lip sync.
import json, subprocess, numpy as np, wave
W = json.load(open('qa/words.json')); W = W if isinstance(W, list) else W['words']
def find(seq, after=0):
    toks = seq.split()
    for i in range(len(W)):
        if W[i]['s'] < after: continue
        if all(W[i+k]['w'].lower().strip('.,') == t.lower().strip('.,') for k, t in enumerate(toks)): return i
    raise SystemExit('not found ' + seq)
def st(i): return W[i]['s']
def en(i): return W[i]['e']
# section starts (word index of "Number ...")
num = ['Number one is Data', 'Number two is Tier', 'Number three is Junior', 'Number four is Basic', 'Number five is Manual',
       'Number six is Traditional', 'Number seven is Junior', 'Number eight is Paralegal', 'Number nine is Retail', 'Number 10 is Appointment']
idx = [find(num[0], 28)]
for n in num[1:]:
    a = idx[-1]; i = find(n, st(a) + 5)
    if n.startswith('Number seven'): i = find(n, 500)
    idx.append(i)
dup0 = find('Number five is Manual', 390)      # second copy of #5 starts here
loud = find('out loud.'); here = find('Here are 10'); fin = find('AI is not erasing'); allday = find('all day.', 700); nxt = find('Next time you check', 700)
# decoded source, used to find the quietest point for cuts between touching words
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'assets/audio/vo/voice.mp3', '-ac', '1', '-ar', '48000', '-f', 'f32le', 'qa/_src.raw'], check=True)
SRC = np.fromfile('qa/_src.raw', dtype=np.float32); SR = 48000
def quiet(a, b):
    i0, i1 = int(a * SR), int(b * SR); f = int(0.01 * SR)
    x = SRC[i0:i1]; n = len(x) // f
    if n < 2: return (a + b) / 2
    e = (x[:n * f].reshape(n, f) ** 2).mean(1); e = np.convolve(e, np.ones(3) / 3, 'same')
    return a + (int(np.argmin(e)) + 0.5) * 0.01
# voice pieces: (src0, src1, gap_before)
cuts = []   # list of [src0, src1, gap_before]
pad = 0.12
cuts.append([0.0, en(loud + 1) + pad, 5.0])
cuts.append([st(here) - pad, en(idx[0] - 1) + pad, 2.6])
for k in range(10):
    a = idx[k]; b = (idx[k + 1] if k < 9 else fin)
    endw = b - 1
    if k == 5: endw = dup0 - 1
    cuts.append([st(a) - pad, en(endw) + pad, 3.2])
cuts.append([st(fin) - pad, en(allday + 1) + pad, 2.4])
cuts.append([st(nxt) - pad, W[-1]['e'] + 0.6, 4.0])
# small breaths before each prompt is read: split pieces after "...this prompt." / "...prompt into ChatGPT."
marks = []
for i in range(len(W) - 2):
    a, b = W[i]['w'].lower(), W[i + 1]['w'].lower()
    if (a in ('this', 'exact') and b == 'prompt.') or (a == 'into' and b == 'chatgpt.' and W[i - 1]['w'].lower() == 'prompt'):
        e, n2 = en(i + 1), st(i + 2)
        if n2 - e >= 0.2: marks.append((e + 0.08, n2 - 0.08))
        else: c = quiet(e - 0.25, n2 + 0.02); marks.append((c, c))
pieces = []
for s0, s1, g in cuts:
    cur = s0; gap = g
    for m0, m1 in marks:
        if s0 < m0 < s1:
            pieces.append([cur, m0, gap]); cur = m1; gap = 0.9
    pieces.append([cur, s1, gap])
# touching pieces (cut inside a tight gap): cut both at the quietest point, never repeat audio
for k in range(len(pieces) - 1):
    A, B = pieces[k], pieces[k + 1]
    if A[0] < B[0] < A[1]: c = quiet(B[0], A[1]); A[1] = c; B[0] = c
# program layout
segs = []; t = 0.0
for s0, s1, g in pieces:
    t += g; segs.append({'src0': round(s0, 3), 'src1': round(s1, 3), 'dst0': round(t, 3)}); t += s1 - s0
TOTAL = round(t + 6.0, 3)
def seg_of(src):
    for s in segs:
        if s['src0'] - 1e-6 <= src <= s['src1'] + 1e-6: return s
    return None
def p2(src):
    s = seg_of(src); return None if s is None else s['dst0'] + src - s['src0']
PW = []
for w in W:
    sg = seg_of(w['s'])
    if sg is None: continue
    if sg['src1'] - w['s'] < 0.06:   # a word stamped at the very end of a piece is spoken after the cut
        nx = [x for x in segs if abs(x['src0'] - sg['src1']) < 1e-6]
        if nx: sg = nx[0]; w = dict(w, s=sg['src0'], e=max(w['e'], sg['src0'] + 0.3))
    a = sg['dst0'] + w['s'] - sg['src0']; b = sg['dst0'] + min(w['e'], sg['src1']) - sg['src0']
    PW.append({'w': w['w'], 's': round(a, 3), 'e': round(max(a + 0.05, b), 3)})
# sections (program time): intro, j1..j10, finale. Each job starts with its music-only chapter card.
sec = []
seg_job = {}
for k in range(10):
    s = p2(st(idx[k]))
    sec.append(s)
chap = [round(s - 3.2, 3) for s in sec]
S = [{'id': 'intro', 'start': 0.0, 'end': chap[0]}]
for k in range(10): S.append({'id': f'job{k+1:02d}', 'start': chap[k], 'end': chap[k + 1] if k < 9 else round(p2(st(fin)) - 2.4, 3)})
S.append({'id': 'finale', 'start': S[-1]['end'], 'end': TOTAL})
json.dump({'segs': segs, 'total': TOTAL, 'sections': S, 'words': PW}, open('plan/edit.json', 'w'), indent=1)
open('assets/edit.js', 'w').write('window.EDIT = ' + json.dumps({'segs': segs, 'total': TOTAL, 'sections': S}) + ';\nwindow.PW = ' + json.dumps(PW) + ';\n')
# render the edited voice (48k mono float), short fades at each cut
src = SRC
out = np.zeros(int(TOTAL * SR) + SR, np.float32)
for s in segs:
    a = src[int(s['src0'] * SR):int(s['src1'] * SR)].copy(); f = int(0.012 * SR)
    a[:f] *= np.linspace(0, 1, f); a[-f:] *= np.linspace(1, 0, f)
    d = int(s['dst0'] * SR); out[d:d + len(a)] += a
out = out[:int(TOTAL * SR)]
import os; os.remove('qa/_src.raw')
np.save('qa/voice_edit.npy', out)
w = wave.open('assets/audio/vo/voice_edit.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
# envelope at 60 fps, smoothed, normalised
hop = SR // 60; n = len(out) // hop
env = np.sqrt((out[:n * hop].reshape(n, hop) ** 2).mean(1))
k = np.ones(3) / 3; env = np.convolve(env, k, 'same'); env = np.clip(env / (np.percentile(env[env > 0.01], 90) + 1e-9), 0, 1)
open('assets/vo-env.js', 'w').write('window.VOENV = "' + ''.join(chr(48 + int(v * 60)) for v in env) + '";\n')
print('total', TOTAL, 'pieces', len(segs))
for s in S: print(s['id'], s['start'], s['end'], round(s['end'] - s['start'], 1))
