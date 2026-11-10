# AISLE 9, Episode 1: "Closing Time" (v2)

Zombie-survival animated short (16:9, 1920x1080, 30 fps, about 9:50).

- `scenes/sXX.js`: one file per beat (shots, camera moves, acting). `python3 scenes/gen.py` builds `compositions/sXX.html`.
  The first version's scenes are kept in `scenes/v1/`.
- Engine:
  - `assets/world.js`: the 2.5D store. Boxes and quads are drawn through a perspective camera, with depth bands so the characters sit between the shelves.
  - `assets/sets.js`: every location (store, aisle, freezer, stockroom, service desk, entrance).
  - `assets/fx.js`: light beams, dust, haze, lens streaks and the colour grade.
  - `assets/toon.js`: the character rig. It has turnaround, walk, run, sneak and shamble cycles, and feet on the ground.
  - `assets/cast.js`: the character looks and expressions.
  - `assets/props.js`: the props.
  - `assets/gfx.js`: the captions, explainer notes, map, stamps, title and subscribe card.
  - `assets/shot.js`: the scene engine, the 3D camera and the lip sync.
- Style sheets for this and future episodes: `stylesheets/STYLE-GUIDE.md` and `stylesheets/png/sheet-01..09.png`.
- Voice: ElevenLabs lines in `assets/audio/vo/`. The ids are in `audio-src/vo_takes.txt`, the texts in `audio-src/lines.json`.
  - Narration: n01–n29, plus bridges x01–x12.
  - Bob: b01–b15. Tyler: t01–t04. Mr. Halloran: h01–h02. Self-checkout: r01.
- Captions use word timings from Whisper (`assets/capwords.js`).
- Sound:
  - `python3 audio-src/synth.py` regenerates every SFX and music cue.
  - `python3 audio-src/pa_fx.py` regenerates the PA echo.
  - The cue sheets per scene in `audio-src/cues/` drive the mix (voice −16 LUFS, music and FX buses −15 dB), the lip sync and the captions. Run `python3 audio-src/build_meta.py` after editing them.
- Render everything: `./render-all.sh force` produces `renders/AISLE9-Ep1-Closing-Time.mp4`.
- Settings and cast notes: `plan/SERIES.md`.
