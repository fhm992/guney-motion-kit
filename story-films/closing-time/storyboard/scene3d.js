// CLOSING TIME: three.js set builder. 3D world, 2D characters as billboards. Deterministic (seeded).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1920, H = 1080;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const C = (c) => new THREE.Color(c);
const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.8, metalness: 0 }, o));
const emis = (color, k = 1) => new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: k });
function canvasTex(w, h, draw, repeat) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t; }
function add(scene, geo, mat, x, y, z, o = {}) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; m.castShadow = !!o.cast; m.receiveShadow = !!o.recv; scene.add(m); return m; }
const box = (scene, w, h, d, mat, x, y, z, o) => add(scene, new THREE.BoxGeometry(w, h, d), mat, x, y, z, o);

// ---------- textures ----------
const TX = {};
TX.shutter = () => canvasTex(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9aa1a8'); gr.addColorStop(1, '#6d747b'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = '#3a3f44'; g.fillRect(0, y, w, 3); g.fillStyle = '#c4cad0'; g.fillRect(0, y + 4, w, 2); } }, [6, 8]);
TX.windows = (seed, lit = 0.12) => canvasTex(256, 512, (g, w, h) => { const R = rng(seed); g.fillStyle = '#20252c'; g.fillRect(0, 0, w, h); for (let y = 8; y < h; y += 26) for (let x = 8; x < w; x += 22) { g.fillStyle = R() < lit ? (R() > 0.4 ? '#ffcf73' : '#dfe9ff') : '#11151a'; g.fillRect(x, y, 13, 16); } });
TX.windowsEm = (seed, lit = 0.12) => canvasTex(256, 512, (g, w, h) => { const R = rng(seed); g.fillStyle = '#000'; g.fillRect(0, 0, w, h); for (let y = 8; y < h; y += 26) for (let x = 8; x < w; x += 22) { if (R() < lit) { g.fillStyle = R() > 0.4 ? '#ffcf73' : '#dfe9ff'; g.fillRect(x, y, 13, 16); } } });
TX.roof = (seed) => canvasTex(128, 128, (g, w, h) => { const R = rng(seed); g.fillStyle = '#3a3f46'; g.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { g.fillStyle = ['#2c3036', '#4a5058', '#33373d'][i % 3]; g.fillRect(R() * w, R() * h, 10 + R() * 30, 10 + R() * 30); } });
TX.text = (txt, color, bg, w = 1024, h = 160, font = 'Anton', size = 110) => canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = color; g.font = `${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 6); });
TX.asphalt = () => canvasTex(256, 256, (g, w, h) => { const R = rng(9); g.fillStyle = '#23272c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${R() > 0.5 ? 255 : 0},${R() > 0.5 ? 255 : 0},${R() > 0.5 ? 255 : 0},0.04)`; g.fillRect(R() * w, R() * h, 2, 2); } }, [20, 20]);
TX.tiles = (c1, c2) => canvasTex(256, 256, (g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h); g.strokeStyle = c2; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } }, [24, 30]);
TX.smoke = () => canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
TX.sky = (stops) => canvasTex(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
TX.box = () => canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#9a7448'; g.fillRect(0, 0, w, h); g.fillStyle = '#c9a26a'; g.fillRect(0, 56, w, 14); g.strokeStyle = '#6a4d2c'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); });
TX.chalk = (lines) => canvasTex(1024, 640, (g, w, h) => { g.fillStyle = '#6b4a2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#1e2b25'; g.fillRect(28, 28, w - 56, h - 56); g.fillStyle = '#f2f2ee'; g.font = '64px Caveat'; lines.forEach((l, i) => g.fillText(l, 70, 150 + i * 100)); });

// ---------- billboards (2D characters) ----------
const texCache = new Map();
function svgTex(svg) {
  if (texCache.has(svg)) return texCache.get(svg);
  const p = new Promise((res) => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  texCache.set(svg, p); return p;
}
// Actor SVG viewBox is -220 -430 440 450 per 400 units of height (feet at 0,0)
async function actor(scene, cam, a) {
  const tex = await svgTex(a.svg);
  const h = a.h || 1.75, w = (h * 440) / 400, hh = (h * 450) / 400;
  const geo = new THREE.PlaneGeometry(w, hh); geo.translate(0, (h * 205) / 400, 0);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.25, color: a.tint || '#e4e4e4', side: THREE.DoubleSide, toneMapped: false, opacity: a.opacity ?? 1, fog: a.fog ?? true });
  const m = new THREE.Mesh(geo, mat);
  const g = new THREE.Group(); g.add(m);
  g.position.set(a.x, a.y || 0, a.z);
  if (a.flat) { m.rotation.x = -Math.PI / 2; m.rotation.z = a.rot || 0; m.position.y = 0.03; }
  else { g.rotation.y = a.yaw ?? Math.atan2(cam.position.x - a.x, cam.position.z - a.z); if (a.rot) m.rotation.z = a.rot; }
  if (!a.flat && a.shadow !== false) { const s = new THREE.Mesh(new THREE.CircleGeometry(w * 0.32, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.45, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.y = 0.012; g.add(s); }
  scene.add(g); return g;
}
// Crowd of billboard zombies: instanced, each facing the camera
async function billboardHorde(scene, cam, o) {
  const R = rng(o.seed || 1);
  const texs = await Promise.all(o.svgs.map(svgTex));
  const per = Math.ceil(o.n / texs.length);
  texs.forEach((tex, k) => {
    const h = o.h || 1.75; const geo = new THREE.PlaneGeometry((h * 440) / 400, (h * 450) / 400); geo.translate(0, (h * 205) / 400, 0);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, color: o.tint || '#e4e4e4', side: THREE.DoubleSide, toneMapped: false });
    const im = new THREE.InstancedMesh(geo, mat, per);
    const d = new THREE.Object3D();
    for (let i = 0; i < per; i++) {
      let x, z; if (o.fn) [x, z] = o.fn(R); else { x = o.x0 + (o.x1 - o.x0) * R(); z = o.z0 + (o.z1 - o.z0) * R(); }
      d.position.set(x, 0, z); d.rotation.set(0, Math.atan2(cam.position.x - x, cam.position.z - z), (R() - 0.5) * 0.25);
      const s = 0.85 + R() * 0.3; d.scale.set(s, s, s); d.updateMatrix(); im.setMatrixAt(i, d.matrix);
    }
    scene.add(im);
  });
}
// Small 3D zombies for aerial shots (instanced bodies + glowing heads)
function miniHorde(scene, o) {
  const R = rng(o.seed || 2); const n = o.n; const k = o.scale || 1;
  const body = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.28 * k, 0.7 * k, 2, 6), std('#1c211d'), n);
  const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3 * k, 8, 6), new THREE.MeshStandardMaterial({ color: '#5f9a35', emissive: '#3f7a1f', emissiveIntensity: o.glow ?? 0.35, roughness: 0.7 }), n);
  const d = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    let x, z; if (o.fn) [x, z] = o.fn(R); else { x = o.x0 + (o.x1 - o.x0) * R(); z = o.z0 + (o.z1 - o.z0) * R(); }
    const lean = (R() - 0.5) * 0.4;
    d.position.set(x, 0.63 * k, z); d.rotation.set(lean, R() * 6.28, lean * 0.5); d.scale.setScalar(1); d.updateMatrix(); body.setMatrixAt(i, d.matrix);
    d.position.set(x + lean * 0.3 * k, 1.38 * k, z); d.updateMatrix(); head.setMatrixAt(i, d.matrix);
    head.setColorAt(i, C(R() > 0.5 ? '#6fae3e' : '#5a9a34'));
  }
  body.castShadow = head.castShadow = true;
  scene.add(body, head);
}

// ---------- props ----------
function lampPost(scene, x, z, o = {}) {
  const m = std('#1a1d22', { metalness: 0.6, roughness: 0.4 });
  box(scene, 0.15, 6, 0.15, m, x, 3, z); box(scene, 1.4, 0.12, 0.2, m, x + 0.65, 6, z);
  box(scene, 0.5, 0.1, 0.3, emis('#fff1c7', 6), x + 1.2, 5.92, z);
  const s = new THREE.SpotLight(o.color || '#ffcf8a', o.k ?? 120, 22, 0.75, 0.6, 1.6); s.position.set(x + 1.2, 5.85, z); s.target.position.set(x + 1.6, 0, z); s.castShadow = !!o.shadow; scene.add(s, s.target);
}
function carMesh(scene, x, z, color, o = {}) {
  const g = new THREE.Group(); const bm = std(color, { roughness: 0.35, metalness: 0.5 }); const gl = std('#0d1218', { roughness: 0.1, metalness: 0.8 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.75, 1.85), bm); b.position.y = 0.6; g.add(b);
  const c = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.65, 1.7), gl); c.position.set(-0.2, 1.25, 0); g.add(c);
  const w = new THREE.CylinderGeometry(0.36, 0.36, 0.3, 16); const wm = std('#0b0b0b');
  [[-1.4, 0.95], [1.4, 0.95], [-1.4, -0.95], [1.4, -0.95]].forEach(([wx, wz]) => { const m = new THREE.Mesh(w, wm); m.rotation.x = Math.PI / 2; m.position.set(wx, 0.36, wz); g.add(m); });
  if (o.lights) { const hl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.4), emis('#fff1c0', 4)); hl.position.set(2.16, 0.7, 0.6); g.add(hl); const h2 = hl.clone(); h2.position.z = -0.6; g.add(h2); }
  if (o.door) { const d = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.06), bm); d.position.set(0.3, 0.75, 1.3); d.rotation.y = -0.9; g.add(d); }
  g.traverse((m) => { m.castShadow = true; m.receiveShadow = true; });
  g.position.set(x, 0, z); g.rotation.y = o.ry || 0; if (o.wreck) g.rotation.z = 0.05; scene.add(g); return g;
}
function van(scene, x, z, ry = 0, s = 1) {
  const g = new THREE.Group(); const wm = std('#eeeeee', { roughness: 0.4 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.4, 2.1), wm); b.position.set(-0.5, 1.6, 0); g.add(b);
  const c = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 2.0), wm); c.position.set(2.8, 1.25, 0); g.add(c);
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 1.8), std('#1a2a3a', { roughness: 0.1, metalness: 0.7 })); ws.position.set(3.56, 1.6, 0); g.add(ws);
  [[-2, 1], [2.4, 1], [-2, -1], [2.4, -1]].forEach(([wx, wz]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16), std('#0b0b0b')); m.rotation.x = Math.PI / 2; m.position.set(wx, 0.45, wz); g.add(m); });
  const tl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.25), emis('#ff2a1a', 5)); tl.position.set(-3.11, 1.0, 0.85); g.add(tl); const t2 = tl.clone(); t2.position.z = -0.85; g.add(t2);
  g.traverse((m) => { m.castShadow = true; }); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); scene.add(g); return g;
}
function fire(scene, x, z, r, smokeTex) {
  add(scene, new THREE.SphereGeometry(r, 12, 8), emis('#ff8a2a', 6), x, r * 0.4, z);
  const l = new THREE.PointLight('#ff7a1a', r * r * 60, r * 14, 1.5); l.position.set(x, r * 1.5, z); scene.add(l);
  for (let i = 0; i < 6; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, color: '#3a3a40', transparent: true, opacity: 0.5, depthWrite: false })); sp.position.set(x + i * r * 0.3, r * 2 + i * r * 2.2, z - i * r * 0.4); sp.scale.setScalar(r * (4 + i * 1.6)); scene.add(sp); }
}
function mist(scene, x, y, z, w, n, smokeTex, color = '#dceeff', op = 0.35, seed = 4) {
  const R = rng(seed); for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, color, transparent: true, opacity: op, depthWrite: false })); sp.position.set(x + (R() - 0.5) * w, y + R() * 0.6, z + (R() - 0.5) * w * 0.6); sp.scale.setScalar(1.5 + R() * 2.5); scene.add(sp); }
}
function lightCone(scene, from, to, radius, color = '#fff3d6', op = 0.08) {
  const len = new THREE.Vector3(...from).distanceTo(new THREE.Vector3(...to));
  const geo = new THREE.ConeGeometry(radius, len, 32, 1, true); geo.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  m.position.set(...from); m.lookAt(...to); m.rotateX(-Math.PI / 2); scene.add(m);
}

// ---------- SETS ----------
// Supermarket: front glass at z=0 (outside is z>0), aisles run along z between -7 and -33, back wall z=-40.
function market(scene, o) {
  const R = rng(o.seed || 3);
  const mode = o.light || 'bright';
  const floorM = new THREE.MeshStandardMaterial({ map: TX.tiles(mode === 'bright' ? '#b8bec4' : '#8a9096', '#9aa0a6'), roughness: 0.18, metalness: 0.05, color: mode === 'bright' ? '#d8dce0' : '#9aa0a8' });
  add(scene, new THREE.PlaneGeometry(32, 42), floorM, 0, 0, -20, { rx: -Math.PI / 2, recv: true });
  if (!o.noCeil) box(scene, 32, 0.2, 42, std(mode === 'bright' ? '#9aa0a6' : '#2a2e34'), 0, 4.6, -20);
  box(scene, 32, 4.6, 0.3, std('#cfd5da'), 0, 2.3, -40.1);
  [-16, 16].forEach((x) => box(scene, 0.3, 4.6, 42, std('#c8ced3'), x, 2.3, -20));
  // shelving + products
  const units = [-10, -6, -2, 2, 6, 10];
  const pal = ['#e04848', '#f2b51d', '#3d8fd6', '#ffffff', '#5bb85b', '#ff8a3d', '#9b5bd6', '#e8e0cc', '#c8262b', '#2a8a7a'];
  const frameM = std('#8e979f', { metalness: 0.6, roughness: 0.4 }), shelfM = std('#eef1f3', { roughness: 0.5 });
  const N = 9000; const prod = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.55 }), N); let pi = 0; const d = new THREE.Object3D();
  const levels = [0.12, 0.62, 1.12, 1.62, 2.12];
  units.forEach((ux) => {
    box(scene, 1.0, 2.6, 26, frameM, ux, 1.3, -20, { recv: true });
    levels.forEach((ly) => { box(scene, 1.3, 0.05, 26, shelfM, ux, ly, -20, { recv: true }); [-1, 1].forEach((sd) => box(scene, 0.02, 0.07, 26, emis(mode === 'bright' ? '#f25a3a' : '#3a1010', mode === 'bright' ? 0.6 : 0.2), ux + sd * 0.66, ly + 0.02, -20)); });
    [-1, 1].forEach((sd) => levels.forEach((ly) => { let z = -32.8; while (z < -7.2 && pi < N) { const w = 0.18 + R() * 0.3, h = 0.22 + R() * 0.2; if (R() > (o.empty || 0)) { d.position.set(ux + sd * 0.42, ly + 0.03 + h / 2, z + w / 2); d.scale.set(0.42, h, w - 0.02); d.rotation.set(0, 0, 0); d.updateMatrix(); prod.setMatrixAt(pi, d.matrix); prod.setColorAt(pi, C(pal[Math.floor(R() * pal.length)])); pi++; } z += w; } }));
  });
  prod.count = pi; prod.castShadow = false; prod.receiveShadow = true; scene.add(prod);
  // ceiling strips
  const stripOn = mode === 'bright';
  [-12, -8, -4, 0, 4, 8, 12].forEach((x) => { for (let z = -36; z < -2; z += 3) { const on = stripOn || (o.flicker && Math.abs(z + 20) < 2 && x === 0); box(scene, 0.22, 0.05, 1.8, on ? emis('#f4fbff', 2.2) : std('#2a2e34'), x, 4.45, z); } });
  // checkouts near the front
  [3.5, 7, 10.5].forEach((x) => { box(scene, 1.0, 0.95, 3.2, std('#3a424c', { roughness: 0.5 }), x, 0.48, -3.6, { cast: true, recv: true }); box(scene, 1.02, 0.03, 2.4, std('#111'), x, 0.97, -3.9); box(scene, 0.35, 0.3, 0.05, emis('#38ff7a', 0.5), x - 0.2, 1.35, -2.2); });
  // front: glass, mullions, shutter
  const glassM = new THREE.MeshPhysicalMaterial({ color: '#9fc8ff', transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0, depthWrite: false });
  add(scene, new THREE.PlaneGeometry(32, 3.4), glassM, 0, 1.7, 0);
  for (let x = -16; x <= 16; x += 2.6) box(scene, 0.14, 3.4, 0.14, std('#262b31', { metalness: 0.5 }), x, 1.7, 0);
  box(scene, 32, 0.2, 0.2, std('#262b31'), 0, 3.45, 0);
  box(scene, 32, 1.2, 0.3, std('#cfd5da'), 0, 4.1, 0);
  if (o.shutter) { const hgt = 3.4 * o.shutter; const t = TX.shutter(); t.repeat.set(16, Math.max(1, 6 * o.shutter)); add(scene, new THREE.PlaneGeometry(32, hgt), std('#ffffff', { map: t, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }), 0, 3.4 - hgt / 2, 0.2); }
  if (o.chalk) { add(scene, new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshStandardMaterial({ map: TX.chalk(o.chalk) }), -6, 1.7, -0.5, { ry: Math.PI }); }
  // lighting
  if (mode === 'bright') { scene.add(new THREE.HemisphereLight('#f4f8ff', '#8a9096', 0.55)); [-24, -14, -6].forEach((z) => { const l = new THREE.PointLight('#f4fbff', 14, 18, 1.4); l.position.set(0, 4.2, z); scene.add(l); }); const dl = new THREE.DirectionalLight('#ffffff', 0.45); dl.position.set(3, 10, 4); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); Object.assign(dl.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, far: 60 }); scene.add(dl); }
  if (mode === 'red') { scene.add(new THREE.HemisphereLight('#401010', '#0a0505', 0.4)); [-30, -20, -10, -4].forEach((z, i) => { const l = new THREE.PointLight('#ff2a1a', 25, 14, 1.5); l.position.set(i % 2 ? 6 : -6, 4.0, z); scene.add(l); box(scene, 0.4, 0.15, 0.2, emis('#ff3b2e', 6), l.position.x, 4.4, z); }); }
  if (mode === 'dark') { scene.add(new THREE.HemisphereLight('#1a2a44', '#05070a', 0.6)); const dl = new THREE.DirectionalLight('#8fb0ff', 0.6); dl.position.set(-4, 10, 8); scene.add(dl); }
  if (mode === 'dawn') { scene.add(new THREE.HemisphereLight('#4a5a78', '#151a20', 0.9)); const dl = new THREE.DirectionalLight('#ffd6a8', 2.2); dl.position.set(6, 6, 20); dl.target.position.set(0, 0, -20); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); Object.assign(dl.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); scene.add(dl, dl.target); }
}

function storeExterior(scene, o) { // building (front at z=0), car park, lamps, skyline
  const lit = o.lit !== false;
  box(scene, 34, 6.4, 40, std('#3e444c', { roughness: 0.9 }), 0, 3.2, -20.3, { recv: true, cast: true });
  box(scene, 34.4, 0.4, 40.4, std('#2a2e34'), 0, 6.6, -20.3);
  const sign = TX.text(o.sign || 'FRESHWAY MARKET', '#ff5a3a', '#16191d', 1024, 160, 'Anton', 120);
  add(scene, new THREE.PlaneGeometry(12, 1.9), new THREE.MeshStandardMaterial({ map: sign, emissiveMap: sign, emissive: '#ffffff', emissiveIntensity: o.signK ?? 1.6 }), 0, 5.0, 0.12);
  if (lit) add(scene, new THREE.PlaneGeometry(32, 3.4), emis('#ffd9a0', 1.2), 0, 1.7, 0.05);
  else add(scene, new THREE.PlaneGeometry(32, 3.4), std('#0b0d10'), 0, 1.7, 0.05);
  for (let x = -16; x <= 16; x += 2.6) box(scene, 0.14, 3.4, 0.14, std('#262b31'), x, 1.7, 0.15);
  if (o.shutter) { const hgt = 3.4 * o.shutter; const t = TX.shutter(); t.repeat.set(16, 6 * o.shutter); add(scene, new THREE.PlaneGeometry(32, hgt), std('#ffffff', { map: t, metalness: 0.5, roughness: 0.5 }), 0, 3.4 - hgt / 2, 0.25, { recv: true }); }
  if (lit) { const p = new THREE.PointLight('#ffcf8a', 80, 30, 1.4); p.position.set(0, 2, 4); scene.add(p); }
}
function carPark(scene, o) {
  const asp = TX.asphalt(); add(scene, new THREE.PlaneGeometry(400, 400), std('#ffffff', { map: asp, roughness: 0.95 }), 0, 0, 60, { rx: -Math.PI / 2, recv: true });
  for (let x = -15; x <= 15; x += 3) box(scene, 0.1, 0.01, 5, emis('#8a8a80', 0.2), x, 0.01, 14);
  (o.lamps || [[-12, 10], [12, 10], [-12, 28], [12, 28]]).forEach(([x, z], i) => lampPost(scene, x, z, { shadow: i < 2, k: o.lampK ?? 140 }));
  (o.cars || []).forEach((c) => carMesh(scene, ...c));
}
function skyline(scene, o) {
  const R = rng(o.seed || 7); const tex = TX.windowsEm(o.seed || 7, o.lit ?? 0.08);
  const mat = new THREE.MeshStandardMaterial({ color: '#0d1117', emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: o.k ?? 1.2, roughness: 0.9 });
  for (let i = 0; i < 70; i++) { const w = 8 + R() * 16, h = 12 + R() * 50; const ang = -1.2 + (i / 70) * 2.4; const r = 110 + R() * 60; box(scene, w, h, w, mat, Math.sin(ang) * r + (o.cx || 0), h / 2, (o.cz || 0) + Math.cos(ang) * r * (o.dir || 1)); }
}
function nightSky(scene, stops, fogColor, fogDensity) { scene.background = TX.sky(stops); scene.fog = new THREE.FogExp2(fogColor, fogDensity); }

function stockroom(scene, o) { // room x -8..8, z -6..6, freezer door on back wall (z=-6), dock door on right wall (x=8)
  const R = rng(o.seed || 5); const mode = o.light || 'red';
  add(scene, new THREE.PlaneGeometry(16, 12), std('#3a3a3c', { roughness: 0.6, map: TX.tiles('#4a4a4c', '#3a3a3c') }), 0, 0, 0, { rx: -Math.PI / 2, recv: true });
  box(scene, 16, 0.2, 12, std('#232326'), 0, 5, 0);
  box(scene, 16, 5, 0.2, std('#5a5a5e'), 0, 2.5, -6.1, { recv: true }); box(scene, 0.2, 5, 12, std('#55555a'), -8.1, 2.5, 0, { recv: true }); box(scene, 16, 5, 0.2, std('#55555a'), 0, 2.5, 6.1, { recv: true });
  // racking with boxes on left wall
  const bt = TX.box(); const bm = std('#ffffff', { map: bt });
  for (let z = -5; z <= 5; z += 2.5) { box(scene, 1.2, 4, 0.08, std('#3b5a8a', { metalness: 0.5 }), -7.3, 2, z - 1.2); for (let l = 0; l < 4; l++) { box(scene, 1.2, 0.06, 2.4, std('#c87a2a', { metalness: 0.4 }), -7.3, 0.3 + l * 1.1, z); for (let b = 0; b < 3; b++) if (R() > 0.2) { const s = 0.5 + R() * 0.3; box(scene, s * 1.4, s, s * 1.4, bm, -7.3, 0.33 + l * 1.1 + s / 2, z - 0.8 + b * 0.8, { cast: true }); } } }
  // freezer
  const fx = o.freezerX ?? 0;
  box(scene, 3.0, 3.4, 0.25, std('#7f8b95', { metalness: 0.7, roughness: 0.35 }), fx, 1.7, -5.95);
  if (o.freezerOpen) { box(scene, 2.3, 2.9, 0.1, emis('#e8f6ff', 1.6), fx, 1.45, -5.9); const door = box(scene, 2.3, 2.9, 0.12, std('#c4d0d9', { metalness: 0.6, roughness: 0.3 }), fx - 1.15, 1.45, -5.2, { ry: -1.2 }); door.geometry.translate(1.15, 0, 0); door.position.x = fx - 1.15; const l = new THREE.PointLight('#cfe8ff', 22, 14, 1.4); l.position.set(fx, 1.6, -5.2); scene.add(l); }
  else { box(scene, 2.3, 2.9, 0.12, std('#c4d0d9', { metalness: 0.6, roughness: 0.3 }), fx, 1.45, -5.8, { recv: true }); box(scene, 0.12, 0.8, 0.12, std('#59626b', { metalness: 0.8 }), fx + 0.9, 1.5, -5.7); }
  box(scene, 0.45, 0.6, 0.1, std('#24282d'), fx + 1.9, 1.6, -5.9);
  if (o.lockText) { const t = TX.text(o.lockText, o.lockCol || '#ff3b2e', '#140303', 512, 160, 'JetBrains Mono', 90); add(scene, new THREE.PlaneGeometry(0.4, 0.13), new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#fff', emissiveIntensity: 2 }), fx + 1.9, 1.75, -5.84); }
  add(scene, new THREE.CircleGeometry(0.04, 16), emis(o.led || '#3dff6a', 8), fx + 1.9, 1.5, -5.84);
  // dock door (right wall)
  const open = o.dockOpen || 0; const dh = 3.6;
  if (open > 0) { add(scene, new THREE.PlaneGeometry(4.4, dh * open), emis(o.dockLight || '#ffd9a0', 1.4), 8.05, (dh * open) / 2, 0, { ry: -Math.PI / 2 }); const sun = new THREE.DirectionalLight('#ffc98a', 3); sun.position.set(20, 4, 2); sun.target.position.set(0, 0, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, far: 60 }); scene.add(sun, sun.target); }
  const t = TX.shutter(); t.repeat.set(3, 4); add(scene, new THREE.PlaneGeometry(4.4, dh * (1 - open)), std('#ffffff', { map: t, metalness: 0.5, roughness: 0.5 }), 7.95, dh * open + (dh * (1 - open)) / 2, 0, { ry: -Math.PI / 2, recv: true });
  if (o.dockGap) { add(scene, new THREE.PlaneGeometry(4.4, 0.06), emis('#e8f2ff', 3), 7.94, 0.03, 0, { ry: -Math.PI / 2 }); add(scene, new THREE.PlaneGeometry(3.5, 4.4), new THREE.MeshBasicMaterial({ color: '#9fc0e0', transparent: true, opacity: 0.1, depthWrite: false }), 6.2, 0.02, 0, { rx: -Math.PI / 2 }); const l = new THREE.PointLight('#cfe0ff', 25, 6, 1.5); l.position.set(7.2, 0.3, 0); scene.add(l); }
  box(scene, 0.2, 5, 12, std('#55555a'), 8.1, 2.5, 0, { recv: true }).visible = false;
  // lights
  if (mode === 'red') { scene.add(new THREE.HemisphereLight('#3a0d0d', '#0a0404', 0.6)); [[-4, -3], [4, -3], [0, 3]].forEach(([x, z]) => { const l = new THREE.PointLight('#ff2a1a', 30, 14, 1.4); l.position.set(x, 4.6, z); scene.add(l); box(scene, 0.5, 0.15, 0.25, emis('#ff3b2e', 6), x, 4.85, z); }); }
  if (mode === 'warm') { scene.add(new THREE.HemisphereLight('#2a1a0a', '#050302', 0.4)); const l = new THREE.PointLight('#ffa040', 18, 9, 1.4); l.position.set(0, 0.9, 1.0); l.castShadow = true; scene.add(l); add(scene, new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), std('#f2f2f2'), 0, 0.7, 1.0); add(scene, new THREE.SphereGeometry(0.03, 8, 8), emis('#ffd27a', 10), 0, 0.84, 1.0); box(scene, 1.2, 0.6, 0.8, std('#6a4a2a'), 0, 0.3, 1.0); }
  if (mode === 'dark') { scene.add(new THREE.HemisphereLight('#1a2030', '#050608', 0.5)); }
  if (mode === 'dawn') { scene.add(new THREE.HemisphereLight('#3a4050', '#0a0b0e', 0.8)); }
}

function city(scene, o) { // aerial city; meters; store at origin facing +z with car park in front
  const R = rng(o.seed || 11);
  add(scene, new THREE.PlaneGeometry(3000, 3000), std(o.ground || '#262c33', { roughness: 0.95 }), 0, 0, 0, { rx: -Math.PI / 2, recv: true });
  const blk = 26, st = 12, P = blk + st;
  const wallTex = TX.windows(5, o.lit ?? 0.06), wallEm = TX.windowsEm(5, o.lit ?? 0.06), roofTex = TX.roof(3);
  const wallM = new THREE.MeshStandardMaterial({ map: wallTex, emissiveMap: wallEm, emissive: '#ffffff', emissiveIntensity: o.winK ?? 1.0, roughness: 0.85 });
  const roofM = std('#ffffff', { map: roofTex, roughness: 0.9 });
  const mats = [wallM, wallM, roofM, roofM, wallM, wallM];
  const list = [];
  for (let bx = -16; bx <= 16; bx++) for (let bz = -16; bz <= 22; bz++) {
    const x0 = bx * P, z0 = bz * P;
    if (o.clear && o.clear(x0 + blk / 2, z0 + blk / 2)) continue;
    const n = 1 + Math.floor(R() * 3);
    for (let k = 0; k < n; k++) { const w = blk / n - 1.5, h = 8 + R() * (o.tall || 40) * (R() > 0.85 ? 2 : 1); list.push([x0 + k * (blk / n) + w / 2 + 0.75, h, z0 + blk / 2, w, blk - 1.5]); }
  }
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mats, list.length); const d = new THREE.Object3D();
  list.forEach(([x, h, z, w, dd], i) => { d.position.set(x, h / 2, z); d.scale.set(w, h, dd); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
  im.castShadow = true; im.receiveShadow = true; scene.add(im);
  // sidewalks
  const sw = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), std('#3a4048'), 33 * 39); let si = 0;
  for (let bx = -16; bx <= 16; bx++) for (let bz = -16; bz <= 22; bz++) { const x0 = bx * P, z0 = bz * P; if (o.clear && o.clear(x0 + blk / 2, z0 + blk / 2)) continue; d.position.set(x0 + blk / 2, 0.1, z0 + blk / 2); d.scale.set(blk + 2, 0.2, blk + 2); d.updateMatrix(); sw.setMatrixAt(si++, d.matrix); }
  sw.count = si; sw.receiveShadow = true; scene.add(sw);
  // the store
  if (o.store) {
    const s = o.store; box(scene, s.w, s.h, s.d, std('#4a5058', { roughness: 0.8 }), s.x, s.h / 2, s.z, { cast: true, recv: true });
    for (let i = 0; i < 8; i++) box(scene, 2 + R() * 3, 1.2, 2 + R() * 3, std('#5a6068'), s.x - s.w / 2 + 5 + R() * (s.w - 10), s.h + 0.6, s.z - s.d / 2 + 5 + R() * (s.d - 10), { cast: true });
    add(scene, new THREE.PlaneGeometry(s.w + 20, 34), std('#33383f', { roughness: 0.9 }), s.x, 0.05, s.z + s.d / 2 + 17, { rx: -Math.PI / 2, recv: true });
    if (s.lit) { add(scene, new THREE.PlaneGeometry(s.w * 0.9, 3), emis('#ffd9a0', 1.4), s.x, 1.7, s.z + s.d / 2 + 0.05); const l = new THREE.PointLight('#ffcf8a', 500, 60, 1.4); l.position.set(s.x, 8, s.z + s.d / 2 + 14); scene.add(l); }
    if (s.sign) { const t = TX.text('FRESHWAY MARKET', '#ff5a3a', '#16191d', 1024, 160, 'Anton', 120); add(scene, new THREE.PlaneGeometry(16, 2.5), new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#fff', emissiveIntensity: 2 }), s.x, s.h - 1.6, s.z + s.d / 2 + 0.1); }
    if (s.speaker) { add(scene, new THREE.SphereGeometry(0.6, 12, 8), emis('#ffd27a', 12), s.x, 1.2, s.z + s.d / 2 + 0.8); }
  }
  const smoke = TX.smoke();
  (o.fires || []).forEach(([x, z, r]) => fire(scene, x, z, r, smoke));
  (o.police || []).forEach(([x, z], i) => { const c = i % 2 ? '#3a6bff' : '#ff2a2a'; add(scene, new THREE.SphereGeometry(0.8, 8, 8), emis(c, 12), x, 1.5, z); const l = new THREE.PointLight(c, 600, 40, 1.5); l.position.set(x, 3, z); scene.add(l); });
}

// ---------- main entry ----------
window.renderShot = async (S) => {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(S.cam.fov || 40, W / H, 0.05, 4000);
  cam.position.set(...S.cam.pos); cam.lookAt(new THREE.Vector3(...S.cam.look)); if (S.cam.roll) cam.rotateZ(S.cam.roll);
  renderer.toneMappingExposure = S.exposure ?? 1;
  const smoke = TX.smoke();
  if (S.sky) nightSky(scene, S.sky, S.fog?.[0] || '#000', S.fog?.[1] ?? 0.01); else { scene.background = C(S.bg || '#000'); if (S.fog) scene.fog = new THREE.FogExp2(S.fog[0], S.fog[1]); }
  for (const st of S.sets || []) {
    const [name, o] = st;
    if (name === 'market') market(scene, o);
    if (name === 'exterior') storeExterior(scene, o);
    if (name === 'carpark') carPark(scene, o);
    if (name === 'skyline') skyline(scene, o);
    if (name === 'stockroom') stockroom(scene, o);
    if (name === 'city') city(scene, Object.assign({}, o, o.clearBox ? { clear: (x, z) => x > o.clearBox[0] && x < o.clearBox[1] && z > o.clearBox[2] && z < o.clearBox[3] } : {}));
    if (name === 'sun') { const s = new THREE.DirectionalLight(o.color, o.k); s.position.set(...o.pos); s.target.position.set(...(o.target || [0, 0, 0])); s.castShadow = !!o.shadow; if (o.shadow) { s.shadow.mapSize.set(4096, 4096); Object.assign(s.shadow.camera, { left: -o.shadow, right: o.shadow, top: o.shadow, bottom: -o.shadow, near: 1, far: 3000 }); s.shadow.bias = -0.0005; } scene.add(s, s.target); }
    if (name === 'hemi') scene.add(new THREE.HemisphereLight(o.sky, o.ground, o.k));
    if (name === 'point') { const l = new THREE.PointLight(o.color, o.k, o.dist || 0, 1.5); l.position.set(...o.pos); l.castShadow = !!o.shadow; scene.add(l); }
    if (name === 'spot') { const l = new THREE.SpotLight(o.color, o.k, o.dist || 30, o.angle || 0.4, 0.5, 1.4); l.position.set(...o.pos); l.target.position.set(...o.target); l.castShadow = !!o.shadow; scene.add(l, l.target); if (o.cone) lightCone(scene, o.pos, o.target, o.cone, o.coneColor, o.coneOp); }
    if (name === 'cone') lightCone(scene, o.from, o.to, o.r, o.color, o.op);
    if (name === 'mist') mist(scene, o.x, o.y, o.z, o.w, o.n, smoke, o.color, o.op, o.seed);
    if (name === 'car') carMesh(scene, o.x, o.z, o.color, o);
    if (name === 'van') van(scene, o.x, o.z, o.ry || 0, o.s || 1);
    if (name === 'box') box(scene, o.w, o.h, o.d, o.emissive ? emis(o.color, o.emissive) : std(o.color, o.mat || {}), o.x, o.y, o.z, { cast: true, recv: true, ry: o.ry });
    if (name === 'cyl') add(scene, new THREE.CylinderGeometry(o.r, o.r, o.h, 12), std(o.color), o.x, o.y, o.z, { rx: o.rx, rz: o.rz, cast: true });
    if (name === 'miniHorde') { const fn = o.fnSrc ? new Function('R', o.fnSrc) : null; miniHorde(scene, Object.assign({}, o, { fn })); }
    if (name === 'horde') { const fn = o.fnSrc ? new Function('R', o.fnSrc) : null; await billboardHorde(scene, cam, Object.assign({}, o, { fn })); }
    if (name === 'heli') { const g = new THREE.Group(); const m = std('#1a1d22', { metalness: 0.5 }); const b = new THREE.Mesh(new THREE.CapsuleGeometry(1.4, 3, 4, 12), m); b.rotation.z = Math.PI / 2; g.add(b); const t = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 0.4), m); t.position.x = -4; g.add(t); const r = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.05, 32), new THREE.MeshBasicMaterial({ color: '#555', transparent: true, opacity: 0.35 })); r.position.y = 1.8; g.add(r); const bl = new THREE.Mesh(new THREE.SphereGeometry(0.2), emis('#ff3b2e', 10)); bl.position.y = -1.3; g.add(bl); g.position.set(...o.pos); g.rotation.y = o.ry || 0; scene.add(g); }
    if (name === 'stadium') { const g = new THREE.Group(); const ring = new THREE.Mesh(new THREE.CylinderGeometry(o.r, o.r * 0.9, o.h, 48, 1, true), std('#5c626b', { side: THREE.DoubleSide })); ring.position.y = o.h / 2; g.add(ring); const roofr = new THREE.Mesh(new THREE.RingGeometry(o.r * 0.7, o.r, 48), std('#6a7078', { side: THREE.DoubleSide })); roofr.rotation.x = -Math.PI / 2; roofr.position.y = o.h; g.add(roofr); const field = new THREE.Mesh(new THREE.CircleGeometry(o.r * 0.7, 48), std('#3a6a30')); field.rotation.x = -Math.PI / 2; field.position.y = 0.3; g.add(field); g.position.set(o.x, 0, o.z); g.traverse((m) => { m.castShadow = true; m.receiveShadow = true; }); scene.add(g); }
    if (name === 'plane') add(scene, new THREE.PlaneGeometry(o.w, o.h), o.emissive ? emis(o.color, o.emissive) : std(o.color), o.x, o.y, o.z, { rx: o.rx, ry: o.ry });
  }
  for (const a of S.actors || []) await actor(scene, cam, Object.assign({ tint: S.charTint }, a));
  const comp = new EffectComposer(renderer); comp.setSize(W, H);
  comp.addPass(new RenderPass(scene, cam));
  const b = S.bloom || [0.6, 0.5, 0.85]; comp.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), b[0], b[1], b[2]));
  comp.addPass(new OutputPass());
  comp.render();
  const url = renderer.domElement.toDataURL('image/jpeg', 0.92);
  comp.dispose(); scene.traverse((m) => { if (m.geometry) m.geometry.dispose(); });
  return url;
};
window.ready = true;
