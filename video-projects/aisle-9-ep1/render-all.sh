#!/bin/bash
# Render every scene (30 fps, 1080p), mix its sound, mux, then join into the episode.
cd "$(dirname "$0")"
python3 audio-src/build_meta.py
for f in compositions/s*.html; do
  id=$(basename $f .html); sid=${id%%-*}
  [ -s renders/scenes/$sid.mp4 ] && [ "$1" != "force" ] && { echo "skip $sid"; continue; }
  mkdir -p renders/scenes
  echo "== $sid $(date +%T)"
  npx hyperframes render -c $f -o renders/scenes/$sid-silent.mp4 --fps 30 --quality high --video-frame-format png 2>&1 | grep -E "rendered in|rror" 
  python3 audio-src/mix.py audio-src/cues/$sid.json renders/scenes/$sid.wav
  ffmpeg -v error -y -i renders/scenes/$sid-silent.mp4 -i renders/scenes/$sid.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest renders/scenes/$sid.mp4 && rm renders/scenes/$sid-silent.mp4
done
ls renders/scenes/s*.mp4 | sort | sed 's#renders/#file #' > renders/concat.txt
ffmpeg -v error -y -f concat -safe 0 -i renders/concat.txt -c copy renders/AISLE9-Ep1-Closing-Time.mp4 && echo "EPISODE DONE $(date +%T)"
