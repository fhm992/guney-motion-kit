#!/bin/bash
# Run from a project folder: ../../tools/paper/join.sh <name>   joins scene renders and lay the final mix under them -> renders/final.mp4
: > renders/concat.txt
for id in $(python3 -c "import json;print(' '.join(json.load(open('plan/scenes.json'))['scenes']))"); do echo "file '$id.mp4'" >> renders/concat.txt; done
ffmpeg -v error -y -f concat -safe 0 -i renders/concat.txt -c copy renders/_video.mp4
ffmpeg -v error -y -i renders/_video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart renders/${1:-final}.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 renders/${1:-final}.mp4
