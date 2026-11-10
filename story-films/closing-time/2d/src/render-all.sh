#!/usr/bin/env bash
# Renders every Day 1 composition, then joins them with the voiced soundtrack and captions.
set -uo pipefail
cd "$(dirname "$0")"
FPS=${FPS:-30}
for c in compositions/*.html; do n=$(basename "$c" .html); [ -f "renders/$n.mp4" ] && continue
  npx hyperframes render -c "$c" -o "renders/$n.mp4" --fps "$FPS" --quality high > "renders/$n.log" 2>&1 && echo "ok $n" || echo "FAIL $n"; done
ls renders/*.mp4 | sort | sed "s/^/file '/; s/$/'/; s#file 'renders/#file '#" > renders/list.txt
A=../../story-films/closing-time/audio/out
FONTS=$(cd ../.. && pwd)/fonts
ffmpeg -y -loglevel error -f concat -safe 0 -i renders/list.txt -i $A/day1_mix.wav -filter_complex \
 "[0:v]drawbox=x=0:y=0:w=iw:h=110:color=black:t=fill,drawbox=x=0:y=ih-110:w=iw:h=110:color=black:t=fill,ass=$A/day1.ass:fontsdir=$FONTS,fade=t=out:st=146.3:d=1.2[v];[1:a]loudnorm=I=-16:TP=-1.5:LRA=11[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart renders/closing-time-day1-2d.mp4 && echo ASSEMBLED
