# Background music loops (synthesised, free to use in any video)

22 mood loops of about 24 s (9 bars at 92 BPM), made with `tools/audio/score.py --loop <mood> --bars 9`.
They loop cleanly enough under a voice; for a whole video that changes mood with the story, write a mood map and run
`python3 tools/audio/score.py --map plan/score.json qa/audio/score.wav` instead (see `docs/FILM-KIT.md`).

| Mood | Use it for |
|---|---|
| mystery | a hook, an open question, a slow start |
| reveal | a title, a big "here are N ways" moment |
| curious, curious16 | explaining, step by step (16 = busier) |
| light, playful | easy tips, fun asides, calls to action |
| warm, calm | personal stories, reassurance |
| lonely, night | waiting, frustration, late nights |
| dark, tension | a problem, a hidden system, a scary question |
| freeze | a held breath, hesitation (airy, no bass) |
| wide | zooming out to the big picture |
| build | rising towards a turning point |
| climax, finale | the payoff, the turning point, the ending |
| adventure, groove | journeys, montages, travel |
| resolve, uplift | the problem solved, morning, success |
| outro | a final held chord to end on |

Mix them under the voice with `tools/audio/mixdown.py` (music about 19 dB under the voice by default, ducked further while speaking; keep it low).
