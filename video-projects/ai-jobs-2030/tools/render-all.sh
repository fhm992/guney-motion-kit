#!/bin/bash
# Renders every section (in film order) to renders/<id>.mp4; skips ones listed as done unless FORCE=1.
cd "$(dirname "$0")/.."
for id in ${@:-intro job01 job02 job03 job04 job05 job06 job07 job08 job09 job10 finale}; do
  s=$(date +%s)
  npx hyperframes render -c compositions/$id.html -o renders/$id.mp4 --fps 60 --quality high --video-frame-format png --workers 4 --quiet > qa/render-$id.log 2>&1
  echo "$id exit=$? $(( $(date +%s) - s ))s" >> qa/render-all.log
done
echo ALLDONE >> qa/render-all.log
