// 3D staging for the CLOSING TIME storyboard (rendered with three.js by render3d.js)
'use strict';
const D = require('./draw');

// 2D character -> SVG texture for a billboard (feet at the bottom centre)
function actorSvg(o) {
  const body = o.mascot ? mascot() : D.person(Object.assign({}, o, { x: 0, y: 0, s: 1, noShadow: true }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-220 -430 440 450" width="880" height="900">${D.defs()}${body}</svg>`;
}
function mascot() {
  return `<rect x="-6" y="-120" width="12" height="120" fill="#8a6a40"/><circle cx="0" cy="-260" r="150" fill="#d63a3a"/><path d="M0,-410 q30,-10 60,-10" stroke="#5a3a1a" stroke-width="14" fill="none"/><ellipse cx="55" cy="-415" rx="45" ry="20" fill="#5bb85b"/><circle cx="-50" cy="-280" r="30" fill="#fff"/><circle cx="50" cy="-280" r="30" fill="#fff"/><circle cx="-45" cy="-276" r="12" fill="#111"/><circle cx="55" cy="-276" r="12" fill="#111"/><path d="M-60,-205 Q0,-150 60,-205" stroke="#111" stroke-width="11" fill="none"/><rect x="-70" y="-150" width="140" height="44" rx="6" fill="#f4f4f0"/><text x="0" y="-117" font-family="Caveat" font-size="34" fill="#222" text-anchor="middle">STEVE</text>`;
}
const A = (o) => Object.assign({}, o, { svg: actorSvg(o) });
const Z = (o) => A(Object.assign({ zombie: true }, o));
const zSvgs = (shirts = ['#2b2b2b', '#2f3530', '#3a2e2a']) => shirts.map((c, i) => actorSvg({ zombie: true, zshirt: c, dir: i % 2 ? -1 : 1, look: i - 1, zhair: i === 1 ? 'theo' : null }));

const NIGHT = [[0, '#03050a'], [0.55, '#0d1622'], [1, '#1f2b3b']];
const DAWN = [[0, '#1d2340'], [0.45, '#6a4a6a'], [0.8, '#e08a5a'], [1, '#ffc58a']];
const street = (n = 12) => `const s=Math.floor(R()*${n})-${n / 2}; return [s*38+32+(R()-0.5)*9, ZZ];`;

const S = {};
S[2] = { cam: { pos: [4.7, 1.6, -0.6], look: [4.6, 1.35, -6], fov: 34 }, sets: [['market', { light: 'bright', seed: 2 }], ['box', { w: 0.6, h: 0.35, d: 0.4, color: '#d6ecff', x: 3.6, y: 1.15, z: -4.1, mat: { transparent: true, opacity: 0.85, roughness: 0.2 } }]],
  actors: [A({ who: 'sami', mood: 'calm', look: -0.4, badge: true, arms: 'hold', x: 4.6, z: -5.4, h: 1.78 }), A({ who: 'man', back: true, x: 3.85, z: -1.5, h: 1.85, tint: '#3a3d42' })], bloom: [0.35, 0.4, 0.9] };
S[4] = { cam: { pos: [-0.6, 1.5, -6.4], look: [1.5, 1.2, 10], fov: 50 }, sky: NIGHT, fog: ['#0d1622', 0.012],
  sets: [['market', { light: 'bright', seed: 4 }], ['carpark', { lamps: [[1.2, 8.5], [-12, 15], [14, 22]], lampK: 260, cars: [[-6, 17, '#3b4452'], [9, 19, '#5a2a2a', { ry: 0.4 }]] }], ['skyline', { cz: 0, dir: 1, seed: 8 }], ['box', { w: 0.35, h: 0.25, d: 0.3, color: '#d6ecff', x: 3.0, y: 0.12, z: 8.8 }]],
  actors: [A({ who: 'sami', back: true, x: -1.0, z: -3.6 }), A({ who: 'man', pose: 'crouch', mood: 'sad', x: 2.3, z: 8.6, h: 1.8, tint: '#d8c49a' })], bloom: [0.5, 0.5, 0.85] };
S[6] = { cam: { pos: [-60, 150, 230], look: [0, 0, 20], fov: 44 }, sky: NIGHT, fog: ['#0e1724', 0.0016], exposure: 1.1,
  sets: [['city', { seed: 61, lit: 0.015, winK: 0.6, tall: 30, ground: '#1b2027', clearBox: [-70, 70, -45, 70], store: { x: 0, z: 0, w: 60, d: 45, h: 8, lit: true, sign: true }, fires: [[260, -700, 9], [-400, -900, 12]], police: [[70, 120], [-38, 200], [108, 260]] }], ['hemi', { sky: '#24324a', ground: '#05070a', k: 0.7 }], ['sun', { color: '#8fb0ff', k: 0.5, pos: [-300, 500, 300] }],
    ['miniHorde', { n: 2600, scale: 2.8, glow: 1.4, fnSrc: `if(R()<0.6){const s=Math.floor(R()*10)-5;return [s*38+32+(R()-0.5)*8, 60+R()*420];} const b=Math.floor(R()*10)+2; return [-260+R()*520, b*38+32+(R()-0.5)*8];` }]], bloom: [0.9, 0.6, 0.7] };
S[7] = { cam: { pos: [0.35, 1.5, -8], look: [0, 1.35, -30], fov: 36 }, sets: [['market', { light: 'bright', seed: 7 }]],
  actors: [A({ who: 'davis', pose: 'run', arms: 'run', mood: 'scared', x: 0, z: -15.5 }), A({ who: 'sami', mood: 'shock', look: -0.9, badge: true, x: 1.25, z: -9.9 })], bloom: [0.35, 0.4, 0.9] };
S[8] = { cam: { pos: [0.4, 0.25, -3.4], look: [0, 1.0, 0], fov: 62 }, sky: NIGHT, fog: ['#0d1622', 0.02],
  sets: [['market', { light: 'bright', seed: 8, shutter: 0.72 }], ['point', { color: '#ffffff', k: 20, pos: [0, 2.5, -2], dist: 8 }], ['carpark', { lamps: [[-6, 6], [8, 7]], lampK: 220 }], ['horde', { svgs: zSvgs(), n: 60, x0: -12, x1: 12, z0: 0.7, z1: 3.5, seed: 8, tint: '#c8c0b0' }]],
  actors: [], bloom: [0.4, 0.4, 0.9] };
S[9] = { cam: { pos: [7, 13, 31], look: [0, 2.2, 0], fov: 40 }, sky: NIGHT, fog: ['#0d1622', 0.012], exposure: 1.1,
  sets: [['exterior', { shutter: 1, lit: false }], ['carpark', { lamps: [[-13, 9], [13, 9], [-13, 26]], cars: [[-9, 20, '#3a4452', { ry: 0.3, wreck: true }], [11, 22, '#6a2a2a', { ry: -0.5 }]] }], ['skyline', { cz: -20, dir: -1, seed: 3 }], ['hemi', { sky: '#22304a', ground: '#06080b', k: 0.6 }],
    ['horde', { svgs: zSvgs(), n: 330, seed: 9, fnSrc: `return [-15+R()*30, 0.7+Math.pow(R(),1.8)*13];` }]], bloom: [0.7, 0.5, 0.75] };
S[10] = { cam: { pos: [0.15, 1.5, -3.0], look: [0, 1.55, -4.6], fov: 42, roll: 0.22 }, bg: '#000', sets: [['stockroom', { light: 'red', seed: 10 }]],
  actors: [Z({ zshirt: '#d8d8d8', dir: -1, x: 0, z: -4.7, h: 1.8, tint: '#ffb0a0' })], bloom: [0.8, 0.5, 0.7] };
S[11] = { cam: { pos: [0.9, 1.45, -0.6], look: [0.35, 1.35, -5.8], fov: 46 }, bg: '#000', sets: [['stockroom', { light: 'red', seed: 11 }], ['mist', { x: 0, y: 0, z: -5, w: 4, n: 14, color: '#d0e6ff', op: 0.18 }]],
  actors: [A({ who: 'sami', mood: 'scared', look: 0.7, arms: 'hold', x: 0.1, z: -5.35, tint: '#ffc0b8' })], bloom: [0.8, 0.5, 0.7] };
S[15] = { cam: { pos: [2, 8.5, -17.6], look: [2, 0, -17.65], fov: 34 }, bg: '#000', sets: [['market', { light: 'dark', seed: 15, noCeil: true }], ['spot', { color: '#bfd8ff', k: 7, pos: [2, 6, -17.6], target: [2, 2.5, -17.6], angle: 0.45, dist: 12 }], ['hemi', { sky: '#30405a', ground: '#05070a', k: 0.8 }]],
  actors: [A({ who: 'sami', mood: 'closed', arms: 'hold', x: 2, z: -16.8, y: 2.58, flat: true, rot: 0.15, h: 1.7 })], bloom: [0.6, 0.5, 0.8] };
S[16] = { cam: { pos: [0, 1.0, -7.5], look: [0, 1.0, 0], fov: 34 }, bg: '#000', sets: [['market', { light: 'dark', seed: 16, shutter: 1 }], ['point', { color: '#ffd6a0', k: 14, pos: [0, 2.8, -2.5], dist: 9 }]],
  actors: [A({ who: 'sami', pose: 'sit', mood: 'sad', look: 0.7, arms: 'hold', x: -0.75, z: -1.3, tint: '#d8dce4' }), A({ mascot: true, x: 0.85, z: -1.2, h: 2.1, tint: '#d8dce4' })], bloom: [0.4, 0.4, 0.9] };
S[18] = { cam: { pos: [30, 1.6, 9], look: [-4, 1.2, 1], fov: 10 }, sky: NIGHT, fog: ['#1a2433', 0.018],
  sets: [['exterior', { shutter: 1, lit: false, signK: 1.2 }], ['carpark', { lamps: [[1, 3.5]], lampK: 420 }], ['hemi', { sky: '#2a3a55', ground: '#0a0c10', k: 0.9 }], ['skyline', { seed: 18, cx: -60, dir: 1 }],
    ['horde', { svgs: zSvgs(), n: 260, seed: 18, fnSrc: `return [-22-Math.pow(R(),0.7)*60, 1+R()*14];` }]],
  actors: [A({ who: 'rico', mood: 'scared', look: 1, x: 2.6, z: 0.75 }), A({ who: 'theo', mood: 'scared', look: 1, x: 1.6, z: 0.7 }), A({ who: 'zoe', mood: 'angry', look: -1, x: 0.6, z: 0.75 }), A({ who: 'maya', mood: 'scared', look: 1, arms: 'reach', dir: 1, x: -0.4, z: 0.7 })], bloom: [0.6, 0.5, 0.8] };
S[20] = { cam: { pos: [0.6, 1.35, 5.4], look: [0, 0.75, 0.4], fov: 46 }, charTint: '#e0b080', bg: '#000', sets: [['stockroom', { light: 'warm', seed: 20 }]],
  actors: [A({ who: 'rico', pose: 'sit', mood: 'smile', look: 1, x: -2.3, z: 0.4 }), A({ who: 'zoe', pose: 'sit', mood: 'angry', look: 1, arms: 'hold', x: -1.15, z: 0.05 }), A({ who: 'maya', pose: 'crouch', mood: 'calm', look: -1, x: 0.15, z: -0.2 }), A({ who: 'theo', pose: 'sit', mood: 'scared', look: -1, arms: 'hold', x: 1.4, z: 0.1 }), A({ who: 'sami', mood: 'smile', look: -1, x: 2.5, z: 0.7 })], bloom: [0.5, 0.5, 0.9] };
S[22] = { cam: { pos: [0.4, 0.45, 5.5], look: [0.6, 1.3, -4], fov: 58 }, bg: '#000', fog: ['#6a6e74', 0.09],
  sets: [['stockroom', { light: 'dark', seed: 22 }], ['box', { w: 1.3, h: 0.8, d: 0.8, color: '#e0a81a', x: 1, y: 0.4, z: 0.6 }], ['box', { w: 1.0, h: 0.4, d: 0.82, color: '#2a2a2a', x: 1, y: 0.45, z: 0.62 }], ['cyl', { r: 0.03, h: 6, color: '#111', x: 1.0, y: 0.03, z: -2.6, rx: Math.PI / 2 }],
    ['spot', { color: '#fff3d6', k: 120, pos: [-3, 1.6, 4], target: [1, 0.5, -1], angle: 0.3, dist: 14, cone: 1.6, coneOp: 0.07, shadow: true }], ['spot', { color: '#fff3d6', k: 100, pos: [4, 1.7, 3.5], target: [0, 0.6, -3], angle: 0.28, dist: 14, cone: 1.4, coneOp: 0.06 }], ['mist', { x: 1, y: 0.8, z: 0.2, w: 6, n: 18, color: '#9a9ea4', op: 0.25 }]],
  actors: [A({ who: 'rico', back: true, x: -3.2, z: 4.1, tint: '#555' }), A({ who: 'zoe', back: true, x: 4.0, z: 3.7, tint: '#555' })], bloom: [0.5, 0.5, 0.8] };
S[23] = { cam: { pos: [3.4, 1.7, 2.8], look: [6.6, 0.4, -0.1], fov: 46 }, bg: '#000', sets: [['stockroom', { light: 'dark', seed: 23, dockGap: true }]],
  actors: [A({ who: 'theo', mood: 'closed', flat: true, rot: -Math.PI / 2 + 0.2, x: 5.9, z: 0.3, h: 1.7, tint: '#9aa6b4' }), A({ who: 'sami', pose: 'crouch', mood: 'scared', look: 1, arms: 'hold', x: 5.2, z: -0.6, tint: '#c8d4e0' })], bloom: [0.7, 0.5, 0.75] };
S[24] = { cam: { pos: [0, 1.55, 4.8], look: [0, 1.5, -6], fov: 42 }, bg: '#000', sets: [['stockroom', { light: 'red', seed: 24, lockText: '00:00:01', led: '#ff3b2e' }],
    ...[-2.4, -1.2, 0, 1.2, 2.4].map((x) => ['cyl', { r: 0.03, h: 2.5, color: '#a8875a', x: x - 0.25, y: 1.3, z: -1.35, rz: -0.1 }])],
  actors: ['zoe', 'maya', 'sami', 'theo', 'rico'].map((w, i) => A({ who: w, back: true, arms: 'hold', x: -2.4 + i * 1.2, z: -1.5, tint: '#ffc8c0' })), bloom: [0.8, 0.5, 0.7] };
S[25] = { cam: { pos: [0.4, 1.15, 1.6], look: [0, 1.4, -6], fov: 46 }, bg: '#000', fog: ['#1a2230', 0.03], sets: [['stockroom', { light: 'dark', seed: 25, freezerOpen: true }], ['mist', { x: 0, y: 0, z: -3.6, w: 7, n: 30, color: '#dceeff', op: 0.14, seed: 9 }]],
  actors: [Z({ zshirt: '#0d0f12', dir: 1, x: 0.05, z: -4.6, tint: '#5a6470' })], bloom: [0.9, 0.6, 0.7] };
S[28] = { cam: { pos: [0, 1.3, -7.6], look: [0, 0.7, -33], fov: 11 }, bg: '#000', sets: [['market', { light: 'dawn', seed: 28, empty: 0.5 }], ['cone', { from: [1, 4.5, -31], to: [0, 0, -32.5], r: 1.8, color: '#dfeaff', op: 0.07 }]],
  actors: [A({ who: 'sami', pose: 'sit', mood: 'sad', dir: 1, x: -0.35, z: -32.6, tint: '#c8d4e8' }), A({ who: 'maya', pose: 'sit', mood: 'sad', dir: -1, x: 0.4, z: -32.6, tint: '#c8d4e8' })], bloom: [0.5, 0.5, 0.8] };
S[30] = { cam: { pos: [-30, 175, 160], look: [0, 0, -40], fov: 50 }, sky: DAWN, fog: ['#9a7a8a', 0.0011], exposure: 1.3,
  sets: [['city', { seed: 30, lit: 0.015, winK: 0.5, tall: 22, ground: '#2a3038', clearBox: [-70, 70, -45, 70], store: { x: 0, z: 0, w: 60, d: 45, h: 8, sign: true, speaker: true }, fires: [[300, -600, 10], [-420, -800, 14], [160, -1100, 12]] }],
    ['hemi', { sky: '#7a7aa0', ground: '#2a2420', k: 0.9 }], ['sun', { color: '#ffb27a', k: 4.5, pos: [500, 160, -350], target: [0, 0, 0], shadow: 420 }],
    ['miniHorde', { n: 9500, scale: 1.7, glow: 0.45, seed: 30, fnSrc: `const r=R(); if(r<0.36) return [-42+R()*84, 24+R()*36]; if(r<0.5) return [-46+R()*12, -24+R()*50]; if(r<0.64) return [34+R()*12, -24+R()*50]; if(r<0.88){const s=Math.floor(R()*10)-5; return [s*38+32+(R()-0.5)*9, -30-Math.pow(R(),1.5)*600];} const b=-Math.floor(R()*14)-1; return [-300+R()*600, b*38+32+(R()-0.5)*9];` }]], bloom: [0.5, 0.5, 0.85] };
S[31] = { cam: { pos: [-4, 1.1, 1.8], look: [8, 1.7, -0.4], fov: 50 }, bg: '#000', fog: ['#4a3a2a', 0.015], exposure: 0.9,
  sets: [['stockroom', { light: 'dawn', seed: 31, dockOpen: 0.72 }], ['van', { x: 1.8, z: -3.0, ry: 0 }], ['cone', { from: [8.2, 3.2, 0.5], to: [2, 0, 0.5], r: 1.4, color: '#ffd9a0', op: 0.05 }]],
  actors: [A({ who: 'rico', back: true, arms: 'up', x: 7.0, z: 0.5, h: 1.8, tint: '#1a1a1a' })], bloom: [0.8, 0.6, 0.75] };
S[33] = { cam: { pos: [36, 48, 42], look: [32, 0, -70], fov: 55 }, sky: DAWN, fog: ['#c08a6a', 0.0024], exposure: 1.05,
  sets: [['city', { seed: 33, lit: 0, winK: 0.4, tall: 24, ground: '#2a3038', clearBox: [-40, 100, -560, -440], fires: [[-6, -120, 5], [70, -260, 7], [-40, -380, 9]] }],
    ['hemi', { sky: '#8a8ab0', ground: '#3a3028', k: 1.6 }], ['sun', { color: '#ffb27a', k: 3.0, pos: [300, 90, -500], target: [32, 0, -150], shadow: 300 }],
    ['van', { x: 32, z: 0, ry: Math.PI / 2, s: 1.5 }], ['car', { x: 28, z: -40, color: '#5a2a2a', ry: 0.6, wreck: true }], ['car', { x: 36, z: -75, color: '#3a4452', ry: -0.4, wreck: true }],
    ['stadium', { x: 32, z: -500, r: 55, h: 22 }], ['heli', { pos: [32, 30, -500], ry: 0.6 }],
    ['miniHorde', { n: 500, scale: 1.4, seed: 33, fnSrc: `const b=-Math.floor(R()*9)-1; return [32+(R()<0.5?-1:1)*(40+R()*200), b*38+32+(R()-0.5)*8];` }]], bloom: [0.5, 0.5, 0.85] };

module.exports = { S, actorSvg };
