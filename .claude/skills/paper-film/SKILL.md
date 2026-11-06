---
name: paper-film
description: Make a cinematic paper cut-out explainer video from a voiceover - acting paper puppet characters (You, the Manager, the AI Intern robot and a cast), a parallax camera, clean UI screens in paper laptops and phones, chapter cards with a learning tracker, and a code-made score (no piano) plus paper sound effects mixed under the voice. Use when someone wants a paper / cut-out / storytelling / character-driven video, or a follow-up in the style of "How to protect your job from AI".
---

# Paper film

Read `docs/PAPER-FILM.md` first: it is the engine manual (characters, moods, poses, props, screens, camera, sound,
tools and the rules learned the hard way). `templates/paper-film/example/` holds a complete 12-scene film to copy from:
`scenes/*.js` (every scene script), `plan/BEATS.md` (the storyboard format the person approved), `plan/scenes.json`,
`plan/music.json`, and `storyboard-frames.html` (how the storyboard stills were drawn).

Workflow (follow `make-video` for the brief and checks; this adds the paper specifics):
1. `npm run new-video -- <slug>`; put their voice in `voice/`, import their word SRT (`tools/captions/import-srt.mjs`).
2. **Storyboard first**: write `plan/BEATS.md` (look, characters, camera, sound, a table per scene: time, VO, on screen /
   acting, camera, SFX), then draw 15-25 storyboard frames with paper.js/film.js and lay them out as labelled sheets
   (`tools/paper/sheet.py` for quick contact sheets). Show them and wait for approval.
3. Build one scene script per chapter in `assets/scenes/`, `python3 ../../tools/paper/mkcomp.py`, snap stills, fix,
   render with `../../tools/paper/render.sh` (in the background; ~5 fps per worker), scan with `tools/qa/scan.py`.
4. Sound: `tools/paper/cues.mjs` -> `music.py` (sections per chapter in `plan/music.json`) -> `mix.py`.
5. `tools/paper/join.sh <name>`; send a copy under 400 MB (2-pass x264, see the manual) and say where the master is.

Their preferences (also in `house-style/HOUSE-STYLE.md`): music about 15 dB under the voice, matched to each scene,
no piano; smooth camera, never fast; every micro beat of the script shown; prompts typed on screen; no captions unless asked.
