#!/bin/bash
# Join the section renders, add the final mix (loudness-normalised to -14 LUFS) -> renders/10-jobs-ai-2030.mp4
cd "$(dirname "$0")/.."
ls renders/{intro,job01,job02,job03,job04,job05,job06,job07,job08,job09,job10,finale}.mp4 | sed "s#^renders/#file '#;s#\$#'#" > renders/concat.txt
python3 tools/align.py
ffmpeg -v error -y -f concat -safe 0 -i renders/concat.txt -c copy renders/_video.mp4
ffmpeg -v error -y -i renders/_video.mp4 -i renders/mix-aligned.wav -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 320k -shortest -movflags +faststart renders/10-jobs-ai-2030.mp4
rm -f renders/_video.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact renders/10-jobs-ai-2030.mp4
