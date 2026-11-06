// A starting scene for the film engine with the paper (--paper) or flat explainer (--flat) look. Copy to assets/scenes/s00.js.
// Every frame is a pure function of T (seconds on the voiceover). A shot = { a, b, cam: [[T, {x, y, z}], ...], draw(T, c) -> svg }.
// The camera follows one smooth curve through the keys (FILM.camPath): give each shot a start and an end, move at a calm pace.
(() => {
  const F = FILM, { G, tr, rect, text, E, seg, L, cue } = F, K = P.K;
  const SECTION = F.section('s00'), { start, end } = SECTION;
  cue(start + 0.2, 'whoosh', 0.5);                     // sounds: names from sfx/synth (tools/audio/sfx_synth.py)
  const shots = [
    // a person at a desk, the camera pushes in to the laptop
    { a: start, b: start + 4, cam: [[start, { x: 1000, y: 560, z: 1.0 }], [start + 4, { x: 1150, y: 520, z: 1.4 }]], draw: (T, c) =>
      P.deskScene(T, c, { who: 'sam', screen: () => rect(0, 0, 300, 22, '#EDE6D8') + text(150, 16, 'ChatGPT or Claude', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: K.inkS }) }) },
    // the two of them side by side, a label pops in on a word
    P.splitShot({ a: start + 4, b: end,
      L: (T, c) => P.bg(T, c, 'mustard') + L(c, 1, P.ch({ pal: 'sam', x: 960, y: 880, face: 0, brows: 'up', mouth: 'smile', seed: 1 }, T) + P.label(T, start + 4.4, 960, 980, 'SAM', { bg: K.cream, size: 80 })),
      R: (T, c) => P.bg(T, c, 'teal') + L(c, 1, P.ch({ pal: 'maya', x: 960, y: 880, face: 0, brows: 'happy', mouth: 'grin', armL: [150, -20], seed: 3 }, T) + P.label(T, start + 4.6, 960, 980, 'MAYA', { bg: K.cream, size: 80 })) }),
  ];
  F.run({ id: SECTION.id, start, end, shots, xfade: 0.3, vignette: '' });
})();
