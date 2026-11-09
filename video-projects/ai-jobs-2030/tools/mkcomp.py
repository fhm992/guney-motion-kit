# Writes compositions/<id>.html for every section in plan/edit.json (durations come from the edit).
import json
E = json.load(open('plan/edit.json'))
T = open('tools/comp.tpl').read()
for s in E['sections']:
    d = round(s['end'] - s['start'], 3)
    open(f"compositions/{s['id']}.html", 'w').write(T.replace('{{ID}}', s['id']).replace('{{DUR}}', str(d)))
    print(s['id'], d)
