# Film kit: character explainers with music and sound, ready to reuse

The engine, characters, sets, sound effects and music from the "11 Ways to Use AI for Your Job Search" videos, made reusable
so a new video starts from them instead of rebuilding (and re-spending tokens on) the same pieces.

Two looks ship with it (both tell the same kind of story: two characters side by side, one tip per round, a scoreboard):
- **Paper cut-out** (`lib/paper.js`): everything cut from coloured card with rough edges, soft shadows and grain. Split
  screens, round banners, torn-paper labels, pencil notes, paper wipes, a big monitor that types the prompt as it is said.
  Music: `tools/audio/paper_score.py` (marimba, plucked strings, felt pad). Build with `make_compositions.py --paper`.
- **Flat explainer** (`lib/explainer-flat.js`): saturated flat shapes, deep gradient skies, soft glows, drifting particles,
  layered parallax hills. Same scene API (`P`) as the paper look, so the same scenes run on either:
  `make_compositions.py --flat`. Music: the ambient score (`tools/audio/score.py`).

Put the film's own tables (scoreboard points, props) in `assets/story.js` (example: `templates/film/examples/paper-story.js`;
example scenes `paper-hook.js`, `paper-round.js`). Keep full-frame images (grain, vignette) static: the looks mount them once,
because a full-frame image rebuilt every frame costs about a second per frame.

## What is where

| Piece | File | What it gives you |
|---|---|---|
| Film engine | `lib/film.js` (`FILM`) | One composition per section, shots that cross-dissolve, a smooth camera (`FILM.camPath`: one curve through the keys, even zoom speed, full-precision zoom), gentle pushes between sections, drifting motes, sound cues, real text measuring. |
| Characters | `lib/hero.js` (`HERO`) | One rig for every person: walk cycle, blink, breathing, sitting, 6 expressions (brows, eyes, mouth), arm and leg poses, props in hand, frost, pilot cap. Palettes: `hero`, `recruiter`, `manager`, `friend`, `crowd` (faceless), `clone`; the looks add `sam`, `maya`, `paperfolk`. |
| Pieces | `lib/paper.js` / `lib/explainer-flat.js` (`P`) | Backgrounds by mood, people (`P.ch`), labels, notes, rings, résumé sheets, job posts, laptop, phone, envelope, paper plane, desk, plant, cloud, split screen (`P.splitShot`), scoreboard (`P.board`), round banner (`P.round`), desk scene, full-screen prompt that types the voice word by word (`P.promptShot`), wipes. |
| Sound effects | `sfx/synth/*.wav` (82 files, copied into each project) and `tools/audio/sfx_synth.py` | Whooshes, pops, clicks, keys, typing, paper, stamps, doors, footsteps, chimes, dings, bells, ice, crash, engine, water, wind, crowd murmur, robot, whistle, risers, impacts, and more. All synthesised: no licences, no downloads. |
| Background music | `music/*.mp3` (22 mood loops) and `tools/audio/score.py` | Ambient-electronic explainer music: mystery, reveal, curious, curious16, dark, warm, lonely, wide, tension, freeze, build, climax, light, playful, night, adventure, resolve, calm, groove, uplift, finale, outro. `score.py` writes a full score that changes mood at the times you give it. |
| Mixdown | `tools/audio/mixdown.py` | Voice + music (ducked under speech, EQ'd out of the voice's way) + effects from cues, normalised to -14 LUFS. Quiet by default: music about 29 dB and effects about 20 dB under the voice. Keep the music low. |
| Film tools | `tools/film/` | `make_compositions.py` (sections -> compositions), `render-all.sh` (render what changed, then join), `collect-cues.mjs` (sound cues out of the scenes), `sheet.sh` (contact sheet). |
| Templates | `templates/film/` | `s00.js` (a starting scene), `sections.json`, `score.json`, and example scenes and story table (`examples/paper-*.js`). |

## Thumbnails

`templates/film/thumbnails.js`: six designs (`#p1` .. `#p6`) in the approved middle style for a 30+ audience: the video's own
background and characters at a modest size with calm expressions, big straight headlines about the topic, and realistic
screens (inbox, AI assistant results, prompt and answer, job-offer notification, recruiter search, the tip list). Avoid
cartoon stamps and wild expressions. Change the words and screens to fit each video; export at 1280 x 720.

## Making a film with it

From the kit folder: `npm run new-video -- <slug>`, then from `video-projects/<slug>/`:

1. Word timings: `node ../../tools/captions/import-srt.mjs <their.srt>` (writes `assets/vo-times.js`). Copy the voice to `assets/audio/vo/voice.mp3`.
2. Sections: write `plan/sections.json` (`[["s00", 0, 24], ["s01", 24, 56.6], ...]`, cut in the pauses), then
   `python3 ../../tools/film/make_compositions.py plan/sections.json --paper` (or `--flat` for the flat explainer look).
3. Scenes: one file per section in `assets/scenes/<id>.js`. Start from `templates/film/s00.js` or an example. A shot is
   `{ a, b, cam: [[T, {x, y, z}], ...], draw(T, c) }`; draw returns SVG built with `FILM`, `HERO` and the look (`P`).
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
- Smooth camera work: each shot glides on one curve from its start to its end camera (a gentle drift runs underneath).
  Move at a calm, steady pace: no snap zooms, no stop-and-go.
- Background music stays very low: about 29 dB under the voice (the mixdown default, `--music-db -48`).
- Scene scripts must live under `assets/` (the renderer only serves that folder).
- `FILM.section(id)` reads `window.FILM_SECTIONS` from `assets/sections.js`; a test slice can set `data-t0` / `data-t1` on `#root`.
