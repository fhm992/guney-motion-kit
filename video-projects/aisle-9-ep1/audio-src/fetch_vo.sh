#!/bin/bash
# fetch_vo.sh <expires>: download each take listed in vo_takes.txt to assets/audio/vo/<id>.mp3
cd "$(dirname "$0")/.."; EXP=${1:-1794344400}
while read id ses gen sig; do
  [ -z "$id" ] && continue; [ -s assets/audio/vo/$id.mp3 ] && continue
  sigq="$sig"
  curl -sSf -o assets/audio/vo/$id.mp3 "https://elevenlabsusercontent.com/database/workspace/b61ccec573b647c58b557bd1207ba07b/content_generation/$ses/$gen/content.mp3?Expires=$EXP&KeyName=assets-cdn-key-1&Signature=$sigq" || echo "FAILED $id"
done < audio-src/vo_takes.txt
