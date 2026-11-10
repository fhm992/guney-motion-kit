// cast.js: the AISLE 9 characters, one place to change a look.
(function () {
  const C = {
    bob:      { hair: 'messy', hairColor: '#0d0d0d', outfit: 'hoodie', top: '#E8382F', apron: '#1F8A55', name: 'BOB', pants: '#2B3550', shoe: '#C9302C', seed: 1 },
    tyler:    { hair: 'beanie', hat: '#FF8A3D', outfit: 'hoodie', top: '#2F7BE8', apron: '#1F8A55', name: 'TYLER', pants: '#3B3F47', shoe: '#F2F0EC', sole: '#2F7BE8', seed: 5 },
    halloran: { hair: 'old', hairColor: '#E9E6DF', outfit: 'cardigan', top: '#9A6A44', pants: '#6B6F78', shoe: '#5A3E2B', sole: '#2B2B2B', seed: 9 },
    zHalloran:{ hair: 'old', hairColor: '#C9C6BF', outfit: 'cardigan', top: '#7A5A44', pants: '#5B5F68', shoe: '#5A3E2B', sole: '#2B2B2B', zombie: true, seed: 9 },
    zBasket:  { hair: 'curly', hairColor: '#2a1a14', outfit: 'hoodie', top: '#B55A8A', pants: '#3a3f55', shoe: '#ddd', zombie: true, seed: 21 },
    zPajama:  { hair: 'side', hairColor: '#3a3a3a', outfit: 'pajamas', top: '#5A86C9', pants: '#5A86C9', shoe: '#7a6a5a', sole: '#3a3a3a', zombie: true, seed: 33 },
    zShopper: { hair: 'side', hairColor: '#2a2a2a', outfit: 'hoodie', top: '#6E8A3A', pants: '#2B2F3A', shoe: '#444', zombie: true, seed: 41 },
    hallSick: { hair: 'old', hairColor: '#E9E6DF', outfit: 'cardigan', top: '#9A6A44', pants: '#6B6F78', shoe: '#5A3E2B', sole: '#2B2B2B', skin: '#4b544e', seed: 9 },
    customer: { hair: 'curly', hairColor: '#5a3a22', outfit: 'hoodie', top: '#F06EA9', pants: '#3a3f55', shoe: '#F2F0EC', sole: '#F06EA9', lashes: true, seed: 17 },
    zBasketW: { hair: 'curly', hairColor: '#3a2a20', outfit: 'cardigan', top: '#8A4FE0', pants: '#3a3f55', shoe: '#ddd', zombie: true, lashes: true, seed: 23 },
  };
  window.CAST = C;
})();
// Expression presets: merge into a pose (EXPR.scared etc.). Mouth/eye/brow values for the rig.
window.EXPR = {
  neutral:   { lid: 0.1, brow: 0, browUp: 0.2, mouth: { open: 0, smile: 0.3 }, look: [0, 0] },
  deadpan:   { lid: 0.42, brow: -0.25, browUp: 0, mouth: { open: 0, smile: 0.05, wide: 0.9 } },
  happy:     { lid: 0.15, brow: 0.1, browUp: 0.6, mouth: { open: 0.45, smile: 0.9, wide: 1.05 } },
  worried:   { lid: 0.05, brow: 0.6, browUp: 0.9, mouth: { open: 0, smile: -0.45, wide: 0.75 } },
  scared:    { lid: 0, brow: 0.7, browUp: 1, eyeScale: 1.14, pupil: 0.55, mouth: { open: 0, smile: -0.85, wide: 0.5 } },
  terror:    { lid: 0, brow: 0.9, browUp: 1, eyeScale: 1.22, pupil: 0.45, mouth: { open: 0.75, smile: -0.9, wide: 0.75 } },
  whisper:   { lid: 0.2, brow: 0.5, browUp: 0.7, mouth: { open: 0.12, smile: -0.3, wide: 0.55 } },
  sad:       { lid: 0.4, brow: 0.85, browUp: 0.9, look: [0, 0.4], mouth: { open: 0.1, smile: -0.8, wide: 0.7 } },
  relieved:  { lid: 0.45, brow: 0.3, browUp: 0.5, mouth: { open: 0, smile: 0.65, wide: 0.85 } },
  determined:{ lid: 0.3, brow: -0.6, browUp: 0, mouth: { open: 0, smile: -0.2, wide: 0.8 } },
  exhausted: { lid: 0.58, brow: 0.3, browUp: 0.2, look: [0, 0.5], mouth: { open: 0.06, smile: -0.5, wide: 0.6 } },
  zombie:    { lid: 0, brow: 0, browUp: 0, look: [0, 0], eyeScale: 1.12, mouth: { open: 0.35, smile: -0.55 } },
  zombieShriek: { lid: 0, brow: 0.9, eyeScale: 1.2, mouth: { open: 1, smile: -1, wide: 1.1 } },
};
