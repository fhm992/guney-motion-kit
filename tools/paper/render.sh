#!/bin/bash
# Run from a project folder: ../../tools/paper/render.sh c00 c01 ... : renders each composition at 60fps into renders/<id>.mp4
for id in "$@"; do
  python3 ../../tools/paper/mkcomp.py $id >/dev/null
  start=$(date +%s)
  npx hyperframes render -c compositions/$id.html -o renders/$id.mp4 --fps 60 --quality high --video-frame-format png --workers 3 --quiet > qa/render-$id.log 2>&1
  echo "$id done in $(( $(date +%s) - start ))s  errors: $(grep -c PAGEERROR qa/render-$id.log)"
done
