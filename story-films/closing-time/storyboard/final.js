// Final storyboard frames: 3D renders (panels3d/raw-XX.jpg) framed with letterbox + labels; other shots stay as drawn.
const fs = require('fs'), path = require('path');
const { frame } = require('./draw');
const { shots } = require('./panels');
exports.shots = shots.map((s) => {
  const raw = path.join(__dirname, 'panels3d', `raw-${String(s.id).padStart(2, '0')}.jpg`);
  if (!fs.existsSync(raw)) return s;
  const uri = 'data:image/jpeg;base64,' + fs.readFileSync(raw).toString('base64');
  return Object.assign({}, s, { is3d: true, draw: () => frame(`<image href="${uri}" x="0" y="0" width="1920" height="1080"/>`, { label: `${String(s.id).padStart(2, '0')}  ·  ${s.size.split('·')[0].trim().toUpperCase()}`, sub: `3D · ${s.lens}`, vig: 0.55 }) });
});
