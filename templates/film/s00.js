// A starting scene for the film engine. Copy to assets/scenes/s00.js and edit.
// Every frame is a pure function of T (seconds on the voiceover). A shot = { a, b, cam: [[T, {x, y, z}], ...], draw(T, c) -> svg }.
(() => {
  const F = FILM, A = ART, H = HERO, { G, tr, rect, circ, path, line, text, glow, C, E, seg, f, L, cue, phrase } = F;
  const SECTION = F.section('s00'), { start, end } = SECTION;
  cue(start + 0.2, 'whoosh', 0.5);                     // sounds: names from tools/audio/sfx_synth.py
  const shots = [
    { a: start, b: start + 3, cam: [[start, { x: 960, y: 540, z: 1.1 }], [start + 3, { x: 900, y: 520, z: 1.3 }]], draw: (T, c) => {
      const w = A.walkX(T, [[start, 300], [start + 2.5, 900]]);
      return A.roadSet(T, c, { id: 'a', world: H.svg({ x: w.x, y: 860, face: 1, walk: w.phase, brows: 'happy', mouth: 'smile', seed: 1 }, T) });
    } },
    { a: start + 3, b: end, cam: [[start + 3, { x: 960, y: 540, z: 1.0 }], [end, { x: 960, y: 540, z: 1.1 }]], draw: (T, c) =>
      A.roadSet(T, c, { id: 'b', world: H.svg({ x: 960, y: 860, face: 0, brows: 'up', mouth: 'grin', armL: [160, -10], armR: [160, -10], seed: 1 }, T) }) },
  ];
  F.run({ id: SECTION.id, start, end, shots, overlay: (T) => phrase(T, start + 3.2, end - 0.5, 'hello world', { hl: [1] }) });
})();
