# Musical / structural cue times per section (program seconds) -> plan/cues.json
import json, re
E = json.load(open('plan/edit.json')); P = E['words']
n = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
N = [n(w['w']) for w in P]
def find(phrase, a, b):
    t = [n(x) for x in phrase.split()]
    for i in range(len(P)):
        if a <= P[i]['s'] < b and N[i:i + len(t)] == t: return P[i]['s']
    return None
C = {}
for s in E['sections']:
    a, b = s['start'], s['end']; c = {'start': a, 'end': b}
    if s['id'].startswith('job'):
        c['name'] = find('number', a, b)
        c['desc'] = find('if you are', a, b) or find('if you', a, b)
        c['pivot'] = find('you should', a, b)
        c['prompt'] = min([x for x in [find('open chatgpt', a, b), find('open claude', a, b), find('type this prompt', a, b)] if x] or [None])
        # the prompt body starts after the inserted pause
        c['body'] = next(P[i + 1]['s'] for i in range(len(P) - 1) if P[i]['s'] >= c['prompt'] and P[i + 1]['s'] - P[i]['e'] > 0.7)
        c['cta'] = find('i put every prompt', a, b)
        ends = [w['e'] for w in P if a <= w['s'] < c['prompt'] + 0.3 and w['w'][-1] in '.?!' and w['e'] < c['prompt'] + 0.05]
        c['prep'] = min(w['s'] for w in P if w['s'] > ends[-2])
        c['end_voice'] = max(w['e'] for w in P if a <= w['s'] < b)
    C[s['id']] = c
C['intro'].update({'hook': find('you checked', 0, 99), 'boss': find('right now', 0, 99), 'loud': find('out loud', 0, 99) + 0.6, 'title': find('here are 10', 0, 99)})
f = C['finale']; a = f['start']
f.update({'voice': find('ai is not erasing', a, 1e9), 'breath': find('all day', a, 1e9) + 0.7, 'next': find('next time you check', a, 1e9), 'iam': find('i am fahim', a, 1e9), 'comment': find('comment the word', a, 1e9), 'started': find('you started watching', a, 1e9), 'end_voice': P[-1]['e']})
json.dump(C, open('plan/cues.json', 'w'), indent=1)
for k, v in C.items(): print(k, {x: round(y, 1) for x, y in v.items() if y})
open('assets/cues.js', 'w').write('window.CUES = ' + json.dumps(C) + ';\n')
