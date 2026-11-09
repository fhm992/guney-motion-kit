# Beat map of the voice: phrases (split at pauses and punctuation) and stressed words (loudness, numbers, key terms)
# -> assets/beats.js. Also lists where captions stay off (chapter titles, prompts already typed on screen).
import json, re, numpy as np
E = json.load(open('plan/edit.json')); C = json.load(open('plan/cues.json')); P = E['words']
v = np.load('qa/voice_edit.npy'); SR = 48000
KEY = set('''ai chatgpt claude 2030 data entry clerk analyst support rep customer success manager conversation designer copywriter
strategist editor bookkeeper financial cash flow advisor tester engineer security auditor translator localization specialist graphic
ux ui product paralegal legal operations compliance cashier teller banker relationship telemarketer setter account executive revenue
erase erasing replaced replace cutting disappearing fading growing million thousands seconds overnight instantly automatically
never zero exact prompt prompts linkedin interview portfolio human robotic tonight career pivot switch'''.split())
n = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
def rms(a, b): x = v[int(a * SR):int(b * SR)]; return float(np.sqrt((x ** 2).mean())) if len(x) else 0
loud = np.array([rms(w['s'], max(w['e'], w['s'] + 0.08)) for w in P])
med = np.array([np.median(loud[max(0, i - 6):i + 7]) for i in range(len(P))])
words = []
for i, w in enumerate(P):
    k = n(w['w']); em = 0
    if re.search(r'\d', w['w']) or k in KEY: em = 1
    if loud[i] > med[i] * 1.35 and len(k) > 3: em = max(em, 1)
    if re.search(r'\d', w['w']) and len(k) >= 2: em = 2
    words.append({'w': w['w'], 's': w['s'], 'e': w['e'], 'em': em})
# phrases
ph = []; cur = []
for i, w in enumerate(words):
    cur.append(i)
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    text = ' '.join(words[j]['w'] for j in cur)
    if w['w'][-1] in '.,?!;:' or gap > 0.22 or len(cur) >= 5 or len(text) > 30 or nxt is None:
        ph.append({'a': cur[0], 'b': cur[-1], 's': words[cur[0]]['s'], 'e': words[cur[-1]]['e']}); cur = []
# where captions stay off
OUTRO = {'job01': 'practice that workflow', 'job02': 'save that output'}
def find(phrase, a, b):
    t = phrase.split(); N = [n(x['w']) for x in P]
    for i in range(len(P)):
        if a <= P[i]['s'] < b and N[i:i + len(t)] == t: return P[i]['s']
excl = []
for k, c in C.items():
    if not k.startswith('job'): continue
    excl.append([c['start'], c['desc'] - 0.15])                       # chapter card shows the title already
    end = find(OUTRO[k], c['body'], c['end']) if k in OUTRO else (c['cta'] or c['end_voice'] + 0.3)
    excl.append([c['body'] - 0.2, end - 0.05])                        # the prompt is being typed in the window
    if c.get('cta'): excl.append([c['cta'] + 3.0, c['end']])          # "comment AI JOBS" box
F = C['finale']; excl.append([find('comment the word', F['start'], F['end']), F['started'] - 0.1])
open('assets/beats.js', 'w').write('window.BEATS = ' + json.dumps({'words': words, 'phrases': ph, 'excl': excl}) + ';\n')
print(len(words), 'words', len(ph), 'phrases', sum(1 for w in words if w['em']), 'stressed', 'avg phrase', round(np.mean([p['e'] - p['s'] for p in ph]), 2), 's')
