#!/bin/bash
# Render every section whose output is missing or older than its scene / the engine.
# Run from a project folder:  ../../tools/film/render-all.sh [s00 s01 ...]   (default: every compositions/s*.html)
ids=${@:-$(ls compositions/s*.html | xargs -n1 basename | sed 's/.html//')}
for id in $ids; do
  out=renders/$id.mp4
  fresh=1; for dep in assets/scenes/$id.js assets/film.js assets/art.js assets/hero.js assets/explainer.js; do [ -f $dep ] && [ $dep -nt $out ] && fresh=0; done
  if [ -f $out ] && [ $fresh = 1 ]; then echo "skip $id"; continue; fi
  echo "render $id $(date +%T)"
  npx hyperframes render -c compositions/$id.html -o $out --fps 60 --quality high --video-frame-format png > qa/render-$id.log 2>&1 || echo "FAILED $id"
  grep -E "PAGEERROR" qa/render-$id.log | head -3
done
ls renders/s*.mp4 | sed "s#.*#file '$PWD/&'#" > qa/concat.txt
ffmpeg -v error -y -f concat -safe 0 -i qa/concat.txt -c copy renders/video-only.mp4 && echo "joined -> renders/video-only.mp4"
