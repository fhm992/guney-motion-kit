#!/bin/bash
# contact sheet of the PNGs in a folder: scenes/sheet.sh qa/s00 out.jpg [cols]
D=$1; O=$2; COLS=${3:-4}
N=$(ls $D/*.png | wc -l); ROWS=$(( (N + COLS - 1) / COLS ))
ffmpeg -v error -y -pattern_type glob -i "$D/*.png" -vf "scale=640:-1,drawtext=text='%{metadata\:none}':fontsize=1,tile=${COLS}x${ROWS}:padding=6:color=0x05061A" -frames:v 1 -q:v 3 $O
