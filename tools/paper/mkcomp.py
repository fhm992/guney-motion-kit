# Writes compositions/<id>.html for each scene script in assets/scenes/<id>.js (paper-film engine).
# Run from a video project folder:  python3 ../../tools/paper/mkcomp.py [ids...]
# Scene timings come from plan/scenes.json: {"end": <s>, "scenes": {"c00": [start, end], ...}} in voiceover seconds.
import sys, json
SCENES = json.load(open('plan/scenes.json'))['scenes']
for sid in (sys.argv[1:] or SCENES):
    a, b = SCENES[sid]; d = round(b - a, 3)
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{sid}</title>
<script src="assets/gsap.min.js"></script>
<script src="assets/stage.js"></script>
<script src="assets/vo-times.js"></script>
<script src="assets/paper.js"></script>
<script src="assets/film.js"></script>
<link rel="stylesheet" href="assets/fonts.css">
<style> html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #EFE6D3; }} </style>
</head>
<body>
<div id="root" data-composition-id="{sid}" data-vo-start="{a}" data-start="0" data-duration="{d}" data-width="1920" data-height="1080">
  <div id="stage" class="clip" data-start="0" data-duration="{d}" data-track-index="0"></div>
</div>
<script src="assets/scenes/{sid}.js"></script>
</body>
</html>
'''
    open(f'compositions/{sid}.html', 'w').write(html)
    print('wrote', sid, a, b, d)
