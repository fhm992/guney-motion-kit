# From the sampled frames, find the parts of each shot's frame that stay empty -> assets/free.js
# FREE[section][shot] = { all: cells empty for the whole shot, win: [[t0, t1, cells], ...] cells empty within ~3 s windows }
# (times are section-local). Grid of 12 x 8 cells (160 x 135 px); cells near the captions band are never used.
import json, glob, numpy as np
from PIL import Image, ImageFilter
meta = json.load(open('qa/free/meta.json')); out = {}
CW, CH, GX, GY = 160, 135, 12, 8
def busy_map(p):
    im = Image.open(p).convert('L').resize((480, 270)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    g = np.asarray(im, np.float32); gx = np.abs(np.diff(g, axis=1))[:-1, :]; gy = np.abs(np.diff(g, axis=0))[:, :-1]; edge = gx + gy
    b = np.zeros((GY, GX))
    for j in range(GY):
        for i in range(GX):
            c = g[j * 34:(j + 1) * 34, i * 40:(i + 1) * 40]; e = edge[j * 34:(j + 1) * 34 - 1, i * 40:(i + 1) * 40 - 1]
            b[j, i] = max((e > 14).mean() / 0.05, (np.percentile(c, 97) - np.percentile(c, 10)) / 60)
    return b
def cells(busy):
    f = []
    for j in range(GY):
        for i in range(GX):
            if j >= 6 or j == 0 or i == 0 or i == GX - 1: continue
            nb = busy[max(0, j - 1):j + 2, max(0, i - 1):i + 2]
            if busy[j, i] < 1.0 and nb.max() < 2.0: f.append([i * CW + CW // 2, j * CH + CH // 2])
    return f
for sid, shots in meta.items():
    out[sid] = []
    for s in shots:
        files = sorted(glob.glob(f'qa/free/{sid}-{s["i"]}-*.jpg'), key=lambda p: int(p.rsplit('-', 1)[1][:-4]))
        n = len(files); ts = [s['t0'] + 0.15 + (s['t1'] - s['t0'] - 0.3) * (k / (n - 1)) for k in range(n)]
        maps = [busy_map(p) for p in files]
        win = []
        for k in range(n):
            a, b = max(0, k - 1), min(n, k + 3)               # covers about [t-1 s, t+2 s]
            win.append([round(ts[k] - 0.5, 2), round(ts[k] + 0.5, 2), cells(np.max(maps[a:b], axis=0))])
        out[sid].append({'all': cells(np.max(maps, axis=0)), 'win': win})
    print(sid, [(len(x['all']), round(np.mean([len(w[2]) for w in x['win']]), 1)) for x in out[sid]])
open('assets/free.js', 'w').write('window.FREE = ' + json.dumps(out) + ';\n')
