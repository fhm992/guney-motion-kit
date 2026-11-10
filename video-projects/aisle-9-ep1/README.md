# AISLE 9, Episode 1: "Closing Time"

Zombie-survival animated short (16:9, 1920x1080, 30 fps, ~9:40).

- `scenes/sXX.js`: one file per beat (shots, camera, acting). `python3 scenes/gen.py` builds `compositions/sXX.html`.
- `assets/toon.js` (character rig), `assets/cast.js` (looks), `assets/env.js` (store painter), `assets/props.js`, `assets/shot.js` (scene engine, lip sync).
- Voice: ElevenLabs lines in `assets/audio/vo/` (ids in `audio-src/vo_takes.txt`; narration n01-n29, Bob b01-b15, Tyler t01-t04, Mr. Halloran h01-h02, self-checkout r01).
- Sound: `python3 audio-src/synth.py` regenerates every SFX and music cue; `python3 audio-src/pa_fx.py` the PA echo.
  Cue sheets per scene in `audio-src/cues/` drive both the mix and the lip sync (`python3 audio-src/build_meta.py`).
- Render everything: `./render-all.sh` (add `force` to re-render scenes that exist) -> `renders/AISLE9-Ep1-Closing-Time.mp4`.
- Settings and cast notes: `plan/SERIES.md`.
