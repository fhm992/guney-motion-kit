const D = require('./draw');
const { frame, person, zombie, rect } = D;
const T = (x, y, t, s, c) => `<text x="${x}" y="${y}" font-family="Anton" font-size="${s}" fill="${c}" text-anchor="middle" letter-spacing="2">${t}</text>`;
exports.shots = [{ id: 0, draw: () => {
  const who = [['sami', 'SAMI'], ['maya', 'MAYA'], ['zoe', 'ZOE'], ['theo', 'THEO'], ['rico', 'RICO'], ['davis', 'MR. DAVIS']];
  let s = rect(0, 0, 1920, 1080, '#1b2027') + `<ellipse cx="960" cy="560" rx="1000" ry="420" fill="url(#poolCool)" opacity="0.4"/>` + rect(0, 860, 1920, 220, '#14181d');
  who.forEach(([w, n], i) => { const x = 150 + i * 262; s += person({ who: w, x, y: 830, s: 1.3, mood: i === 4 ? 'smile' : 'calm', look: 0, badge: w === 'sami' }) + T(x, 905, n, 40, '#f2f2f2'); });
  s += zombie({ x: 1740, y: 830, s: 1.3, dir: 1 }) + T(1740, 905, 'THE INFECTED', 40, '#8fd65a');
  return frame(s, { label: 'CAST', sub: 'character reference' });
} }];
