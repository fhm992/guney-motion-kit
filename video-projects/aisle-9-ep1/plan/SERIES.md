# AISLE 9: series settings

- Format: 16:9, 1920x1080, **30 fps**.
  Render: `npx hyperframes render -c compositions/<scene>.html -o renders/<scene>-silent.mp4 --fps 30 --quality high --video-frame-format png`
- Sound: `python3 audio-src/synth.py` (all SFX + music), `python3 audio-src/mix.py audio-src/cues/<scene>.json renders/<scene>.wav`.
  Voice levelled to -16 LUFS per line, music and SFX buses -15 dB, master -14 LUFS.
- Lead character: **Bob** (male), styled after the reference image: messy black hair, red hoodie, green FreshMart apron.
  (Briefly Becca; changed back to Bob, male, at the user's request.) Lines that say his name: 1:00, 1:10, 1:24, 4:15.
