#!/usr/bin/env python3
"""Write one HyperFrames composition per section for a film-engine video.
Run from a project folder:  python3 ../../tools/film/make_compositions.py plan/sections.json [--explainer]
plan/sections.json: [["s00", 0, 24], ["s01", 24, 56.6], ...]  (seconds on the voiceover; the last one may run past the voice)
Writes compositions/<id>.html (each loads assets/scenes/<id>.js) and assets/sections.js (window.FILM_SECTIONS).
--explainer also loads assets/explainer.js (the bright infographic look).
--paper loads assets/paper.js (the paper cut-out look) and assets/story.js (the film's own tables, e.g. the score).
--flat loads assets/explainer-flat.js (deep skies, glows, particles; same scene API as --paper) and assets/story.js."""
import json, pathlib, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
if not args:
    print(__doc__); sys.exit(1)
sections = json.load(open(args[0]))
extra = ('<script src="assets/explainer.js"></script>\n' if '--explainer' in sys.argv else '') + ('<script src="assets/paper.js"></script>\n<script src="assets/story.js"></script>\n' if '--paper' in sys.argv else '') + ('<script src="assets/explainer-flat.js"></script>\n<script src="assets/story.js"></script>\n' if '--flat' in sys.argv else '')
T = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{id}</title>
<link rel="stylesheet" href="assets/fonts.css">
<script src="assets/gsap.min.js"></script>
<script src="assets/stage.js"></script>
<script src="assets/vo-times.js"></script>
<script src="assets/sections.js"></script>
<script src="assets/film.js"></script>
<script src="assets/hero.js"></script>
<script src="assets/art.js"></script>
{extra}<style>html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0E1236; }} svg {{ position: absolute; inset: 0; }}</style>
</head>
<body>
<div id="root" data-composition-id="{id}" data-start="0" data-duration="{d}" data-width="1920" data-height="1080">
  <svg id="stage" class="clip" data-start="0" data-duration="{d}" data-track-index="0" viewBox="0 0 1920 1080" width="1920" height="1080"><g id="svg"></g></svg>
</div>
<script src="assets/scenes/{id}.js"></script>
</body>
</html>
"""
root = pathlib.Path('.')
(root / 'compositions').mkdir(exist_ok=True)
(root / 'assets/scenes').mkdir(parents=True, exist_ok=True)
for sid, a, b in sections:
    (root / 'compositions' / f'{sid}.html').write_text(T.format(id=sid, d=round(b - a, 3), extra=extra))
(root / 'assets/sections.js').write_text('window.FILM_SECTIONS = ' + json.dumps({sid: [a, b] for sid, a, b in sections}) + ';\n')
print(f'{len(sections)} compositions + assets/sections.js')
