# Film kit: character explainers with music and sound, ready to reuse

The engine, characters, sets, sound effects and music from the "11 Ways to Use AI for Your Job Search" videos, made reusable
so a new video starts from them instead of rebuilding (and re-spending tokens on) the same pieces.

Three looks ship with it:
- **Road movie** (`lib/art.js`): a story with one hero on a journey, flat shapes, an indigo night that turns into morning,
  parallax camera, no outlines. Inspired by science-explainer animation.
- **Infographic explainer** (`lib/explainer.js`): a bright teal day world, bold outlines, versus split-screens, meters,
  charts, stamps, a level bar that fills tip by tip, prompts typed on a big phone.
- **Paper cut-out** (`lib/paper.js`): everything cut from coloured card with rough edges, soft shadows and grain; poses step
  at 12 a second like stop-motion while the camera glides. Split screens (two characters, one scoreboard), round banners,
  torn-paper labels, pencil notes, paper wipes, a big monitor that types the prompt as it is said. Music: `tools/audio/paper_score.py`
  (marimba, plucked strings, felt pad). Build with `make_compositions.py --paper`; put film tables (score, props) in `assets/story.js`
  (example: `templates/film/examples/paper-story.js`, scenes `paper-hook.js`, `paper-round.js`). Keep the grain/vignette static
  (paper.js mounts them once): a full-frame image rebuilt every frame costs about a second per frame.

## What is where

| Piece | File | What it gives you |
|---|---|---|
| Film engine | `lib/film.js` (`FILM`) | One composition per section, shots that cross-dissolve while the camera keeps moving, zoom-through between sections, a sky clock (night to morning), drifting stars and motes, key phrases, labels, sound cues, real text measuring. |
| Characters | `lib/hero.js` (`HERO`) | One rig for every person: walk cycle, blink, breathing, sitting, 6 expressions (brows, eyes, mouth), arm and leg poses, props in hand, frost, pilot cap. Palettes: `hero`, `recruiter`, `manager`, `friend`, `crowd` (faceless), `clone`; the explainer adds `maya`, `twin`, `boss`, `rec`. |
| Sets and props | `lib/art.js` (`ART`) | Room with window and city, desk, chair, laptop, phone, inbox, mug, lamp, couch, resumes, paper plane, envelope, notes, road set with parallax, hills, signposts, office, city skyline, the 11-stop landscape, bubbles, thought bubbles, pills, checks and crosses, sparkles, chat window that types the voice word by word, prompt shot, chapter mark. |
| Explainer look | `lib/explainer.js` (`V`) | Outlined characters (`V.ch`), mood backgrounds, labels with pointers, stamps, big headlines, gauges ("-o-meters"), bars, versus split, level HUD, tip banner, big phone prompt (`V.promptShot`), icons, crowd grid, cards, job post, chips. |
| Sound effects | `sfx/synth/*.wav` (82 files, copied into each project) and `tools/audio/sfx_synth.py` | Whooshes, pops, clicks, keys, typing, paper, stamps, doors, footsteps, chimes, dings, bells, ice, crash, engine, water, wind, crowd murmur, robot, whistle, risers, impacts, and more. All synthesised: no licences, no downloads. |
| Background music | `music/*.mp3` (22 mood loops) and `tools/audio/score.py` | Ambient-electronic explainer music: mystery, reveal, curious, curious16, dark, warm, lonely, wide, tension, freeze, build, climax, light, playful, night, adventure, resolve, calm, groove, uplift, finale, outro. `score.py` writes a full score that changes mood at the times you give it. |
| Mixdown | `tools/audio/mixdown.py` | Voice + music (ducked under speech, EQ'd out of the voice's way) + effects from cues, normalised to -14 LUFS. Quiet by default: music about 14 dB and effects about 20 dB under the voice. |
| Film tools | `tools/film/` | `make_compositions.py` (sections -> compositions), `render-all.sh` (render what changed, then join), `collect-cues.mjs` (sound cues out of the scenes), `sheet.sh` (contact sheet). |
| Templates | `templates/film/` | `s00.js` (a starting scene), `sections.json`, `score.json`, and four complete example scenes (road-movie hook and sunrise, explainer hook and a full tip). |

## Making a film with it

From the kit folder: `npm run new-video -- <slug>`, then from `video-projects/<slug>/`:

1. Word timings: `node ../../tools/captions/import-srt.mjs <their.srt>` (writes `assets/vo-times.js`). Copy the voice to `assets/audio/vo/voice.mp3`.
2. Sections: write `plan/sections.json` (`[["s00", 0, 24], ["s01", 24, 56.6], ...]`, cut in the pauses), then
   `python3 ../../tools/film/make_compositions.py plan/sections.json` (add `--explainer` for the infographic look).
3. Scenes: one file per section in `assets/scenes/<id>.js`. Start from `templates/film/s00.js` or an example. A shot is
   `{ a, b, cam: [[T, {x, y, z}], ...], draw(T, c) }`; draw returns SVG built with `FILM`, `HERO`, `ART` (and `V`).
   Register sounds with `FILM.cue(time, 'name', gain)` at build time (never inside `draw`).
4. Check: `node ../../tools/qa/snap.mjs compositions/s00.html s00 qa/s00 1 3 5` and `../../tools/film/sheet.sh qa/s00 qa/s00.jpg 4`.
5. Render: `../../tools/film/render-all.sh` (about 7 frames a second on 4 cores; a 7-minute film takes about an hour).
6. Sound: `node ../../tools/film/collect-cues.mjs`, then music either from a loop in `../../music/` or a story score:
   `python3 ../../tools/audio/score.py --map plan/score.json qa/audio/score.wav` (copy `templates/film/score.json` and
   change the times and moods), then
   `python3 ../../tools/audio/mixdown.py --voice assets/audio/vo/voice.mp3 --music qa/audio/score.wav --cues qa/audio/cues.json --out qa/audio/final.wav`.
7. Join: `ffmpeg -i renders/video-only.mp4 -i qa/audio/final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest renders/final.mp4`.

## Rules the engine already follows

- Every frame is a pure function of the voice time `T`: no randomness at draw time (seeded `FILM.R(seed)`), so any frame renders alone.
- Fonts are loaded explicitly before the first frame (SVG text set through `innerHTML` does not trigger a font load by itself).
- The camera is never still: a gentle drift runs under every shot; give each shot a start and end camera.
- Scene scripts must live under `assets/` (the renderer only serves that folder).
- `FILM.section(id)` reads `window.FILM_SECTIONS` from `assets/sections.js`; a test slice can set `data-t0` / `data-t1` on `#root`.
