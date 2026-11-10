# AISLE 9: Series style guide

The sheets in `stylesheets/png/` are rendered from the production assets themselves (`stylesheets/sheets.html`), so they
always match what ends up in an episode. Re-render: `node ../../tools/qa/snap.mjs stylesheets/sheets.html sheets stylesheets/png 0.5 1.5 ... 8.5`.

| Sheet | Covers |
|---|---|
| 01 Bob | turnaround (front, 3/4, side, back), 11 expressions, palette |
| 02 Supporting cast | Tyler, Mr. Halloran (healthy / sick), customer |
| 03 The Shoppers | zombie design rules, 4 shoppers, side/back |
| 04 Motion | walk, run and sneak cycles (6 phases each) |
| 05 Locations | register lanes, store floor, Aisle 9, stockroom, customer service, freezer aisle |
| 06 Light & colour | one aisle in each mood: day, red, grey, night-blue, ice, amber |
| 07 Props | cart, self-checkout, PA desk, phone, cans, waffles, basket, stool, speaker |
| 08 Type & graphics | captions (narrator / dialogue), name tag, place stamp, explainer note, rule card |
| 09 Titles, map, end card | series title, store map with route, subscribe card, day card |

## Characters
- Chibi proportions: the head is about 40% of the height. Glossy black sphere (zombies: grey-green), soft key light from
  the scene, coloured rim light on the far side. Big white eyes carry the acting; brows and lids do the rest.
- Rig (`assets/toon.js`): knees + feet solved from the floor up (feet never slide or float), head and body turn
  (`yaw` 0 = camera, ±1 = profile, >1 = turning away), gaits `walk / run / sneak / shamble`, presets in `EXPR`.
- Characters look at each other, at the threat, or at objects. Looking into the lens is a deliberate beat only.
- Cast colours: Bob red hoodie + green FreshMart apron + red sneakers; Tyler orange beanie + blue hoodie; Halloran gold
  glasses + brown cardigan; Shoppers keep their clothes, add stains, milky eyes and veins.

## World & camera
- One store, one layout (`assets/sets.js`): checkout lanes at the front, aisles 5, 4, 9, 7, 8 running back,
  stockroom, customer service, freezers. Everything is projected through one camera (`assets/world.js`), so props and
  people share floors, sizes and perspective.
- Every shot moves: push-ins, slides, cranes, handheld in chases, slow drift in quiet beats. No static frames.
- Shot vocabulary: wide establishing (f 900-1000), medium two-shot (f 1100), close-up (f 1500-2200), over-the-shoulder,
  POV through gaps (door crack, shutter gap), dolly down an aisle.
- Depth: near objects can pass in front of the characters (two-pass render), far objects fade into the mood's fog.

## Light & colour (`assets/fx.js`)
- Day 1 warm night shift → outbreak emergency red (spinning beacon) → Day 2 cold grey → Aisle 9 blue dark (safe) →
  freezer ice blue → hope (warm window light at the end).
- Ceiling fixtures cast beams, floor glints and lens streaks; dust always drifts; vignette on every shot.

## Type
- Captions: Anton, uppercase, white with a dark outline and worn texture; the spoken word turns toxic green
  `#A6FF3D`; dialogue gets a speaker tag in the character's colour (Bob `#FF5A4E`, Tyler `#5FA8FF`, Halloran `#E0B070`).
- Labels: JetBrains Mono. Explainer notes: one short sentence, 6th-grade reading level, top centre, 3-4 seconds.
- Rule cards stay on screen at least 5 seconds so viewers can pause and screenshot.

## Sound
- Voices are always clearest: each line levelled to -16 LUFS, music and SFX buses 15 dB under, master -14 LUFS.
- All music and SFX are synthesized (`audio-src/synth.py`); no samples.
