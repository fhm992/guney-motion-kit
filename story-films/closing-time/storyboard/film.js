// CLOSING TIME, Day 1 pilot: animated three.js shots. Each shot builds a scene and returns update(t) (t = seconds into the shot).
import * as K from '/scene3d.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
const { THREE, renderer } = K;
const W = 1920, H = 1080;

// ---------- helpers ----------
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const easeIn = (x) => { x = clamp01(x); return x * x * x; };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
function camPath(cam, keys, t) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const u = b.t === a.t ? 0 : (b.lin ? clamp01 : ease)((t - a.t) / (b.t - a.t));
  cam.position.set(...L3(a.pos, b.pos, u)); cam.up.set(0, 1, 0); cam.lookAt(...L3(a.look, b.look, u));
  const fa = a.fov ?? cam.fov, fb = b.fov ?? fa; cam.fov = lerp(fa, fb, u);
  const ra = a.roll || 0, rb = b.roll ?? ra; cam.rotateZ(lerp(ra, rb, u));
  cam.updateProjectionMatrix();
}
function shake(cam, t, amp, f = 1) { if (!amp) return; cam.rotateX((Math.sin(t * 7.1 * f) * 0.6 + Math.sin(t * 13.3 * f + 1) * 0.4) * amp); cam.rotateY((Math.sin(t * 6.3 * f + 2) * 0.6 + Math.sin(t * 11.7 * f + 3) * 0.4) * amp); }
const impulse = (t, at, len = 0.5) => (t >= at && t < at + len ? Math.exp(-((t - at) / len) * 5) : 0);
function textTex(lines, o = {}) {
  const c = document.createElement('canvas'); c.width = o.w || 1024; c.height = o.h || 512; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const draw = (fn) => { g.clearRect(0, 0, c.width, c.height); fn(g, c.width, c.height); tex.needsUpdate = true; };
  if (lines) draw((g2, w, h) => { g2.fillStyle = o.bg || '#000'; g2.fillRect(0, 0, w, h); g2.fillStyle = o.color || '#fff'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; lines.forEach((l, i) => { g2.font = l.font; g2.fillText(l.t, w / 2, l.y); }); });
  return { tex, draw, canvas: c };
}

async function actor(ctx, frames, o = {}) {
  const texs = await Promise.all(frames.map(async (sp) => K.svgTex(await window.svg(sp))));
  const h = o.h || 1.75; const geo = new THREE.PlaneGeometry((h * 440) / 400, (h * 450) / 400); geo.translate(0, (h * 205) / 400, 0);
  const mat = new THREE.MeshBasicMaterial({ map: texs[0], transparent: true, alphaTest: 0.25, color: o.tint || '#e4e4e4', side: THREE.DoubleSide, toneMapped: false, fog: o.fog ?? true });
  const mesh = new THREE.Mesh(geo, mat); const g = new THREE.Group(); g.add(mesh);
  if (o.shadow !== false) { const s = new THREE.Mesh(new THREE.CircleGeometry(h * 0.3, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.45, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.y = 0.012; g.add(s); }
  ctx.scene.add(g);
  const a = { g, mesh, mat, texs, frame(i) { mat.map = texs[((i % texs.length) + texs.length) % texs.length]; }, at(x, y, z) { g.position.set(x, y, z); }, face() { g.rotation.y = Math.atan2(ctx.cam.position.x - g.position.x, ctx.cam.position.z - g.position.z); } };
  if (o.at) a.at(...o.at);
  return a;
}
const cycle = (base, n = 8) => Array.from({ length: n }, (_, k) => Object.assign({}, base, { phase: (k / n) * Math.PI * 2 }));

async function hordeAnim(ctx, o) { // billboard zombies with sway/shuffle; o.move(inst, t) -> [x, z]
  const R = K.rng(o.seed || 1);
  const variants = o.variants || [{ zombie: true, zshirt: '#2b2b2b', dir: 1 }, { zombie: true, zshirt: '#2f3530', dir: -1, zhair: 'theo' }, { zombie: true, zshirt: '#3a2e2a', dir: 1, look: 1 }];
  const texs = await Promise.all(variants.map(async (sp) => K.svgTex(await window.svg(sp))));
  const h = o.h || 1.75; const per = Math.ceil(o.n / texs.length); const insts = []; const meshes = [];
  texs.forEach((tex, k) => {
    const geo = new THREE.PlaneGeometry((h * 440) / 400, (h * 450) / 400); geo.translate(0, (h * 205) / 400, 0);
    const im = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, color: o.tint || '#d8d8d8', side: THREE.DoubleSide, toneMapped: false }), per);
    for (let i = 0; i < per; i++) { const [x, z] = o.place(R); insts.push({ im, i, x0: x, z0: z, ph: R() * 6.28, sp: 0.8 + R() * 0.5, s: 0.85 + R() * 0.3, r: R() }); }
    meshes.push(im); ctx.scene.add(im);
  });
  const d = new THREE.Object3D();
  return (t) => {
    for (const p of insts) {
      const [x, z] = o.move ? o.move(p, t) : [p.x0, p.z0];
      const bob = Math.abs(Math.sin(t * 4 * p.sp + p.ph)) * 0.05 * (o.bob ?? 1);
      d.position.set(x, bob, z); d.rotation.set(0, Math.atan2(ctx.cam.position.x - x, ctx.cam.position.z - z), Math.sin(t * 2.2 * p.sp + p.ph) * 0.09 * (o.sway ?? 1));
      d.scale.setScalar(p.s); d.updateMatrix(); p.im.setMatrixAt(p.i, d.matrix);
    }
    meshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));
  };
}
function miniHordeAnim(ctx, o) {
  const R = K.rng(o.seed || 2); const k = o.scale || 1;
  const body = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.28 * k, 0.7 * k, 2, 6), K.std('#1c211d'), o.n);
  const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3 * k, 8, 6), new THREE.MeshStandardMaterial({ color: '#5f9a35', emissive: '#3f7a1f', emissiveIntensity: o.glow ?? 0.5 }), o.n);
  const P = []; for (let i = 0; i < o.n; i++) { const [x, z, vx, vz] = o.place(R); P.push({ x, z, vx, vz, ph: R() * 6.28 }); head.setColorAt(i, K.C(R() > 0.5 ? '#6fae3e' : '#5a9a34')); }
  ctx.scene.add(body, head); const d = new THREE.Object3D();
  return (t) => { P.forEach((p, i) => { let x = p.x + p.vx * t, z = p.z + p.vz * t; if (o.stop) [x, z] = o.stop(x, z, p); const b = Math.abs(Math.sin(t * 5 + p.ph)) * 0.25 * k; d.position.set(x, 0.63 * k + b, z); d.rotation.set(0, 0, Math.sin(t * 3 + p.ph) * 0.15); d.updateMatrix(); body.setMatrixAt(i, d.matrix); d.position.set(x, 1.38 * k + b, z); d.updateMatrix(); head.setMatrixAt(i, d.matrix); }); body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = true; };
}
function newCtx(o = {}) {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(o.fov || 40, W / H, 0.03, 5000);
  if (o.sky) { scene.background = K.TX.sky(o.sky); } else scene.background = K.C(o.bg || '#000');
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog[0], o.fog[1]);
  return { scene, cam, smoke: K.TX.smoke() };
}
const NIGHT = [[0, '#03050a'], [0.55, '#0d1622'], [1, '#1f2b3b']];

// ---------- SHOTS ----------
const SHOTS = [];
const shot = (id, dur, build, post) => SHOTS.push({ id, dur, build, post });

function card(text, font, color, glow) {
  return async (ctx) => {
    const T = textTex([{ t: text, font, y: 256 }], { color, bg: '#000', w: 2048, h: 512 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: T.tex, transparent: true, toneMapped: false, color: '#ffffff' }));
    ctx.scene.add(m); ctx.cam.position.set(0, 0, 6); ctx.cam.lookAt(0, 0, 0);
    return (t, dur) => {
      let a = seg(t, 0.3, 0.9) * (1 - seg(t, dur - 0.8, dur - 0.1));
      if (glow) { const fl = [0.35, 0.5, 0.62, 0.7, 1.2, 1.3, 2.9, 3.0]; for (let i = 0; i < fl.length; i += 2) if (t > fl[i] && t < fl[i + 1]) a *= 0.15; m.material.color.setScalar(1.6 * a + 0.0001); }
      m.material.opacity = a; ctx.cam.position.z = 6 - t * 0.12;
    };
  };
}
// S0 DAY 1
shot('day1', 2.0, card('DAY 1', '220px Caveat', '#f2f2ee'));
// S1 till ECU
shot('till', 6.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 1 });
  const T = textTex(null, { w: 1024, h: 640 });
  T.draw((g, w, h) => { g.fillStyle = '#04140a'; g.fillRect(0, 0, w, h); g.fillStyle = '#7dff9e'; g.font = 'bold 96px "JetBrains Mono"'; g.fillText('ICE 10LB', 50, 150); g.textAlign = 'right'; g.font = 'bold 150px "JetBrains Mono"'; g.fillText('$3.49', w - 50, 330); g.textAlign = 'left'; g.fillStyle = '#48c96a'; g.font = 'bold 70px "JetBrains Mono"'; g.fillText('REG 2     23:52', 50, 560); });
  K.box(ctx.scene, 0.56, 0.4, 0.06, K.std('#1e2328', { roughness: 0.4 }), 7.2, 1.3, -2.45);
  K.add(ctx.scene, new THREE.PlaneGeometry(0.48, 0.3), new THREE.MeshStandardMaterial({ map: T.tex, emissiveMap: T.tex, emissive: '#ffffff', emissiveIntensity: 0.55 }), 7.2, 1.3, -2.415);
  const l = new THREE.PointLight('#5fff8a', 1.2, 1.5, 2); l.position.set(7.2, 1.3, -2.2); ctx.scene.add(l);
  return (t) => { camPath(ctx.cam, [{ t: 0, pos: [7.05, 1.31, -1.75], look: [7.2, 1.3, -2.42], fov: 38, roll: -0.08 }, { t: 6, pos: [7.12, 1.3, -2.02], look: [7.2, 1.3, -2.42], fov: 38, roll: -0.1 }], t); };
}, { dof: { focus: 0.45, aperture: 0.012, maxblur: 0.012 }, bloom: [0.4, 0.4, 0.85] });
// S2 OTS at the till
shot('ots', 9.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 2 });
  K.box(ctx.scene, 0.6, 0.35, 0.4, new THREE.MeshStandardMaterial({ color: '#d6ecff', transparent: true, opacity: 0.85, roughness: 0.2 }), 3.6, 1.15, -4.1);
  const sami = await actor(ctx, [{ who: 'sami', mood: 'calm', look: -0.5, badge: true, arms: 'hold' }, { who: 'sami', mood: 'calm', look: 0.4, badge: true, arms: 'hold' }, { who: 'sami', mood: 'scared', look: 0.4, badge: true, arms: 'hold' }], { at: [4.6, 0, -5.4], h: 1.78 });
  const man = await actor(ctx, [{ who: 'man', back: true }], { at: [3.85, 0, -1.5], h: 1.85, tint: '#3a3d42' });
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [4.75, 1.6, -0.3], look: [4.6, 1.35, -6], fov: 34 }, { t: 9, pos: [4.68, 1.56, -0.95], look: [4.6, 1.4, -6], fov: 32 }], t); shake(ctx.cam, t, 0.0015);
    sami.frame(t < 4.2 ? 0 : t < 7.0 ? 1 : 2); sami.g.position.y = Math.sin(t * 1.3) * 0.006; sami.face();
    man.g.position.x = 3.85 + Math.sin(t * 0.7) * 0.02; man.face();
  };
}, { dof: { focus: 4.9, aperture: 0.004, maxblur: 0.01 }, bloom: [0.35, 0.4, 0.9] });
// S3 insert: cash and sleeve
shot('cash', 5.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 3 });
  const bill = textTex(null, { w: 512, h: 220 }); bill.draw((g, w, h) => { g.fillStyle = '#86b07c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#4f7a4a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#3d6038'; g.font = 'bold 110px Anton'; g.fillText('5', 40, 150); g.beginPath(); g.arc(w / 2, h / 2, 60, 0, 7); g.stroke(); });
  const billM = K.add(ctx.scene, new THREE.PlaneGeometry(0.2, 0.09), new THREE.MeshStandardMaterial({ map: bill.tex, roughness: 0.9 }), 3.4, 0.99, -3.4, { rx: -Math.PI / 2 });
  const hand = K.add(ctx.scene, new THREE.SphereGeometry(0.05, 16, 12), K.std('#141414', { roughness: 0.6 }), 3.4, 1.01, -3.34); hand.scale.set(0.9, 0.5, 1.2); const cuffL = K.add(ctx.scene, new THREE.CylinderGeometry(0.055, 0.06, 0.5, 16), K.std('#26302a'), 3.4, 1.03, -3.0, { rx: Math.PI / 2 });
  const armL = cuffL;
  const armR = new THREE.Group(); armR.add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.6, 16), K.std('#26302a'))); const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.057, 0.057, 0.09, 16, 1, true), K.std('#4a0d0d')); ring.position.y = 0.27; armR.add(ring); armR.rotation.x = -Math.PI / 2; armR.position.set(3.82, 1.04, -3.0); ctx.scene.add(armR);
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [3.55, 1.8, -3.25], look: [3.52, 0.97, -3.62], fov: 36 }, { t: 5, pos: [3.55, 1.7, -3.3], look: [3.52, 0.97, -3.64], fov: 34 }], t);
    const u = ease(seg(t, 0.4, 2.6)); const bz = lerp(-3.4, -3.85, u); const back = seg(t, 2.9, 3.8);
    billM.position.set(3.4, 0.99, bz); hand.position.set(3.4, 1.01, bz + 0.07 + back * 0.4); armL.position.set(3.4, 1.03, hand.position.z + 0.3);
    const tr = Math.sin(t * 31) * 0.004 + Math.sin(t * 17) * 0.003; armR.position.x = 3.82 + tr; armR.rotation.z = tr * 3;
  };
}, { dof: { focus: 0.88, aperture: 0.006, maxblur: 0.01 }, bloom: [0.3, 0.4, 0.9] });
// S4 wide through the windows: he walks out, drops the ice, falls to his knees
shot('window', 13.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 4 }); K.carPark(ctx.scene, { lamps: [[1.2, 8.5], [-12, 15], [14, 22]], lampK: 260, cars: [[-6, 17, '#3b4452'], [9, 19, '#5a2a2a', { ry: 0.4 }]] }); K.skyline(ctx.scene, { seed: 8 });
  const sami = await actor(ctx, [{ who: 'sami', back: true }], { at: [-1.0, 0, -3.6] });
  const walk = await actor(ctx, cycle({ who: 'man', pose: 'walk', back: true }), { at: [1.4, 0, 1.0], h: 1.8, tint: '#cfc0a0' });
  const kneel = await actor(ctx, [{ who: 'man', pose: 'crouch', back: true }], { at: [2.3, 0, 8.6], h: 1.8, tint: '#d8c49a' }); kneel.g.visible = false;
  const ice = K.box(ctx.scene, 0.32, 0.24, 0.28, K.std('#d6ecff', { roughness: 0.2 }), 1.6, 0.7, 1.0);
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [-0.1, 1.5, -6.6], look: [1.6, 1.2, 10], fov: 46 }, { t: 13, pos: [-1.3, 1.45, -6.1], look: [1.9, 1.1, 10], fov: 44 }], t, true);
    const u = seg(t, 0, 6.6); const x = lerp(1.4, 2.3, u), z = lerp(1.0, 8.6, u);
    walk.at(x, 0, z); walk.frame(Math.floor(t * 7.5)); walk.face(); walk.g.rotation.z = Math.sin(t * 1.7) * 0.03 + (t > 5.5 ? (t - 5.5) * 0.04 : 0);
    walk.g.visible = t < 7.6; kneel.g.visible = t >= 7.6; kneel.face(); if (t >= 7.6) kneel.g.position.y = -Math.max(0, 0.06 - (t - 7.6) * 0.2);
    if (t < 6.8) ice.position.set(x + 0.28, 0.72, z); else { const f = t - 6.8; ice.position.set(lerp(x + 0.28, x + 0.62, clamp01(f * 2)), Math.max(0.12, 0.72 - 4.9 * f * f) + (f > 0.37 ? Math.abs(Math.sin((f - 0.37) * 12)) * 0.05 * Math.exp(-(f - 0.37) * 6) : 0), z + clamp01(f * 2) * 0.2); ice.rotation.z = clamp01(f * 2) * 1.2; }
    sami.face();
  };
}, { bloom: [0.45, 0.5, 0.85] });
// S5 over Sami's shoulder: rack focus to the man as he stands up wrong
shot('rack', 8.0, async (ctx) => {
  ctx.scene.fog = new THREE.FogExp2('#0d1622', 0.01);
  K.market(ctx.scene, { light: 'bright', seed: 5 }); K.carPark(ctx.scene, { lamps: [[1.2, 8.5], [-12, 15]], lampK: 260, cars: [[-6, 17, '#3b4452'], [9, 19, '#5a2a2a', { ry: 0.4 }]] }); K.skyline(ctx.scene, { seed: 8 });
  const sami = await actor(ctx, [{ who: 'sami', back: true }], { at: [-1.75, 0, -1.0] });
  const kneel = await actor(ctx, [{ who: 'man', pose: 'crouch', back: true }], { at: [2.3, 0, 8.6], h: 1.8, tint: '#d8c49a' });
  const z = await actor(ctx, [{ zombie: true, zshirt: '#3a4a3a', dir: -1 }], { at: [2.3, 0, 8.6], h: 1.8, tint: '#e0d0a8' }); z.g.visible = false;
  K.box(ctx.scene, 0.32, 0.24, 0.28, K.std('#d6ecff', { roughness: 0.2 }), 2.9, 0.12, 8.8);
  const st = { focus: 1.2 };
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [-1.05, 1.7, -3.4], look: [2.3, 1.0, 8.6], fov: 26 }, { t: 8, pos: [-0.95, 1.68, -3.0], look: [2.3, 1.1, 8.6], fov: 22 }], t);
    st.focus = lerp(2.3, 12.4, ease(seg(t, 1.0, 2.6))); ctx.focus = st.focus;
    const up = t >= 3.0; kneel.g.visible = !up; z.g.visible = up; kneel.face(); z.face();
    if (up) { const f = t - 3.0; z.g.position.y = -0.5 * (1 - ease(f * 4)); z.mesh.rotation.z = Math.sin(f * 1.3) * 0.1 - 0.2 * (1 - ease(f * 3)); z.g.position.x = 2.3 + Math.sin(f * 0.9) * 0.05; }
    sami.face(); shake(ctx.cam, t, 0.001);
  };
}, { dof: { focus: 2.3, aperture: 0.005, maxblur: 0.014 }, bloom: [0.55, 0.5, 0.8] });
// S6 aerial night city
shot('aerial', 8.0, async (ctx) => {
  ctx.scene.background = K.TX.sky(NIGHT); ctx.scene.fog = new THREE.FogExp2('#0e1724', 0.0016);
  K.city(ctx.scene, { seed: 61, lit: 0.015, winK: 0.6, tall: 30, ground: '#1b2027', clear: (x, z) => x > -70 && x < 70 && z > -45 && z < 70, store: { x: 0, z: 0, w: 60, d: 45, h: 8, lit: true, sign: true }, fires: [[260, -700, 9], [-400, -900, 12]] });
  ctx.scene.add(new THREE.HemisphereLight('#24324a', '#05070a', 0.7)); const dl = new THREE.DirectionalLight('#8fb0ff', 0.5); dl.position.set(-300, 500, 300); ctx.scene.add(dl);
  const pol = [[70, 120], [-38, 200], [108, 260]].map(([x, z], i) => { const c = i % 2 ? '#3a6bff' : '#ff2a2a'; const m = K.add(ctx.scene, new THREE.SphereGeometry(0.8, 8, 8), K.emis(c, 12), x, 1.5, z); const l = new THREE.PointLight(c, 600, 40, 1.5); l.position.set(x, 3, z); ctx.scene.add(l); return { m, l }; });
  const hord = miniHordeAnim(ctx, { n: 2600, scale: 2.8, glow: 1.3, seed: 6, place: (R) => { if (R() < 0.62) { const s = Math.floor(R() * 10) - 5; return [s * 38 + 32 + (R() - 0.5) * 8, 70 + R() * 460, 0, -(2 + R() * 2)]; } const b = Math.floor(R() * 10) + 2; const x = -260 + R() * 520; return [x, b * 38 + 32 + (R() - 0.5) * 8, -Math.sign(x) * (2 + R() * 2), 0]; }, stop: (x, z, p) => [p.vx ? (Math.sign(x) !== Math.sign(p.x) ? 0 : x) : x, Math.max(z, 58)] });
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [-75, 170, 270], look: [0, 0, 40], fov: 44 }, { t: 8, pos: [-48, 128, 205], look: [0, 0, 10], fov: 44 }], t, true);
    pol.forEach((p, i) => { const on = Math.floor(t * 3 + i) % 2 === 0; p.l.intensity = on ? 600 : 60; p.m.material.emissiveIntensity = on ? 12 : 1; });
    hord(t);
  };
}, { bloom: [0.9, 0.6, 0.7] });
// TITLE
shot('title', 4.0, card('CLOSING TIME', '210px Anton', '#ff4a32', true), { bloom: [1.2, 0.6, 0.3] });
// S7 Davis runs down the aisle
shot('davis', 8.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 7 });
  const dav = await actor(ctx, cycle({ who: 'davis', pose: 'run', mood: 'scared', dir: 1 }), { at: [0, 0, -27] });
  const sami = await actor(ctx, [{ who: 'sami', back: true }, { who: 'sami', mood: 'shock', look: -0.9, badge: true }], { at: [1.25, 0, -9.9] });
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [0.4, 1.5, -9.3], look: [0, 1.35, -30], fov: 36 }, { t: 8, pos: [0.45, 1.45, -7.8], look: [0, 1.4, -30], fov: 38 }], t); shake(ctx.cam, t, 0.004, 1.3);
    const z = lerp(-27, -12.2, ease(seg(t, 0, 7.2) * 0.98)); dav.at(Math.sin(t * 2.5) * 0.15, Math.abs(Math.sin(t * 9.4)) * 0.05, z); dav.frame(Math.floor(t * 12)); dav.face();
    sami.frame(t < 4.6 ? 0 : 1); sami.face(); sami.g.position.x = 1.25 + (t > 4.6 ? ease(seg(t, 4.6, 5.4)) * 0.15 : 0);
  };
}, { bloom: [0.35, 0.4, 0.9] });
// S8 the shutter comes down (floor level)
shot('shutter', 6.5, async (ctx) => {
  ctx.scene.fog = new THREE.FogExp2('#0d1622', 0.02);
  K.market(ctx.scene, { light: 'bright', seed: 8 }); K.carPark(ctx.scene, { lamps: [[-6, 6], [8, 7]], lampK: 220 });
  const pl = new THREE.PointLight('#ffffff', 20, 8, 1.5); pl.position.set(0, 2.5, -2); ctx.scene.add(pl);
  const tx = K.TX.shutter(); tx.repeat.set(16, 6);
  const sh = K.add(ctx.scene, new THREE.PlaneGeometry(32, 3.4), K.std('#ffffff', { map: tx, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }), 0, 5.2, 0.2);
  const hord = await hordeAnim(ctx, { n: 60, seed: 8, place: (R) => [-12 + R() * 24, 9 + R() * 8], move: (p, t) => [p.x0, Math.max(0.75 + p.r * 0.5, p.z0 - t * (3.5 + p.r * 2))], tint: '#c8c0b0', sway: 1.6 });
  return (t) => {
    const d = easeIn(seg(t, 0.6, 5.2)); sh.position.y = lerp(5.2, 1.7, d);
    camPath(ctx.cam, [{ t: 0, pos: [0.4, 0.25, -3.4], look: [0, 1.0, 0], fov: 62 }, { t: 6.5, pos: [0.4, 0.22, -3.2], look: [0, 1.05, 0], fov: 60 }], t);
    shake(ctx.cam, t, 0.02 * impulse(t, 5.2, 0.6) + 0.002); hord(t);
    pl.intensity = 20 + (t > 5.2 && t < 5.35 ? 40 : 0);
  };
}, { bloom: [0.4, 0.4, 0.9] });
// S9 exterior crane: the horde at the shutter
shot('crane', 11.0, async (ctx) => {
  ctx.scene.background = K.TX.sky(NIGHT); ctx.scene.fog = new THREE.FogExp2('#0d1622', 0.012);
  K.storeExterior(ctx.scene, { shutter: 1, lit: false }); K.carPark(ctx.scene, { lamps: [[-13, 9], [13, 9], [-13, 26]], cars: [[-9, 20, '#3a4452', { ry: 0.3, wreck: true }], [11, 22, '#6a2a2a', { ry: -0.5 }]] }); K.skyline(ctx.scene, { cz: -20, dir: -1, seed: 3 });
  ctx.scene.add(new THREE.HemisphereLight('#22304a', '#06080b', 0.6));
  const hord = await hordeAnim(ctx, { n: 330, seed: 9, place: (R) => [-15 + R() * 30, 0.7 + Math.pow(R(), 1.8) * 13], move: (p, t) => [p.x0 + Math.sin(t * 0.7 + p.ph) * 0.15, Math.max(0.7, p.z0 - t * 0.12 * p.r)], sway: 1.4 });
  return (t) => { camPath(ctx.cam, [{ t: 0, pos: [4, 3.2, 21], look: [0, 2.2, 0], fov: 40 }, { t: 11, pos: [7.5, 13.5, 31], look: [0, 2.0, 0], fov: 40 }], t); hord(t); };
}, { bloom: [0.7, 0.5, 0.75] });
// S10 Davis turns (stockroom, red)
shot('turn', 6.0, async (ctx) => {
  K.stockroom(ctx.scene, { light: 'red', seed: 10 });
  const hum = await actor(ctx, [{ who: 'davis', pose: 'sit', mood: 'closed', dir: 1 }], { at: [0, 0, -5.2], h: 1.8, tint: '#ffb8a8' });
  const zom = await actor(ctx, [{ zombie: true, zshirt: '#d8d8d8', dir: -1 }], { at: [0, 0, -5.0], h: 1.8, tint: '#ffb0a0' }); zom.g.visible = false;
  return (t) => {
    const T0 = 2.3;
    camPath(ctx.cam, [{ t: 0, pos: [0.15, 1.05, -2.4], look: [0, 0.7, -5.2], fov: 42, roll: 0.05 }, { t: T0, pos: [0.15, 1.1, -2.6], look: [0, 0.75, -5.2], fov: 42, roll: 0.06 }, { t: T0 + 0.35, pos: [0.15, 1.5, -3.0], look: [0, 1.55, -4.8], fov: 30, roll: 0.24 }, { t: 6, pos: [0.15, 1.5, -3.2], look: [0, 1.55, -4.8], fov: 28, roll: 0.24 }], t);
    shake(ctx.cam, t, t > T0 ? 0.008 + 0.03 * impulse(t, T0, 0.6) : 0.002, 1.5);
    const up = t >= T0; hum.g.visible = !up; zom.g.visible = up; hum.face(); zom.face();
    if (up) { const f = t - T0; zom.g.position.y = -0.7 * (1 - ease(f * 5)); zom.mesh.rotation.z = Math.sin(f * 2) * 0.06; }
  };
}, { bloom: [0.8, 0.5, 0.7] });
// S11 freezer: Sami against the door
shot('freezer', 16.0, async (ctx) => {
  K.stockroom(ctx.scene, { light: 'red', seed: 11 }); K.mist(ctx.scene, 0, 0, -5, 4, 14, ctx.smoke, '#d0e6ff', 0.16);
  const sami = await actor(ctx, [{ who: 'sami', mood: 'scared', look: 0.7, arms: 'hold' }, { who: 'sami', mood: 'shock', look: -0.6, arms: 'hold' }], { at: [0.1, 0, -5.35], tint: '#ffc0b8' });
  const bangs = [0.8, 1.5, 2.1, 4.6, 5.2, 7.9, 10.4, 11.0, 13.6];
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [1.0, 1.45, -0.5], look: [0.35, 1.35, -5.8], fov: 46 }, { t: 16, pos: [0.75, 1.42, -2.7], look: [0.55, 1.4, -5.8], fov: 40 }], t);
    let k = 0; bangs.forEach((b) => (k += impulse(t, b, 0.35))); shake(ctx.cam, t, 0.002 + 0.012 * k, 1.2);
    sami.frame(k > 0.3 ? 1 : 0); sami.g.position.z = -5.35 + k * 0.03; sami.g.position.y = Math.sin(t * 2.2) * 0.008; sami.face();
  };
}, { bloom: [0.8, 0.5, 0.7] });
// S12 the phone call
shot('phone', 22.0, async (ctx) => {
  K.stockroom(ctx.scene, { light: 'dark', seed: 12 });
  const sami = await actor(ctx, [{ who: 'sami', pose: 'sit', mood: 'scared', look: 0.3, arms: 'hold', dir: 1 }, { who: 'sami', pose: 'sit', mood: 'sad', look: 0.3, arms: 'hold', dir: 1 }], { at: [-6.1, 0, 0.4], tint: '#9fb8d8' });
  const scr = textTex(null, { w: 256, h: 480 });
  const phone = K.add(ctx.scene, new THREE.PlaneGeometry(0.075, 0.14), new THREE.MeshStandardMaterial({ map: scr.tex, emissiveMap: scr.tex, emissive: '#ffffff', emissiveIntensity: 1.6 }), -5.86, 0.86, 0.62);
  const pl = new THREE.PointLight('#7fb8ff', 3, 3, 1.6); pl.position.set(-5.7, 1.0, 0.8); ctx.scene.add(pl);
  let last = -1;
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [-3.5, 1.1, 2.5], look: [-6.1, 0.75, 0.4], fov: 34 }, { t: 22, pos: [-4.1, 1.0, 1.9], look: [-6.1, 0.8, 0.4], fov: 28 }], t);
    const rgt = new THREE.Vector3().setFromMatrixColumn(ctx.cam.matrixWorld, 0); phone.position.set(-6.1 + rgt.x * 0.31, 0.97, 0.4 + rgt.z * 0.31 + 0.05);
    const state = t < 11.6 ? 0 : 1; if (state !== last) { last = state; scr.draw((g, w, h) => { g.fillStyle = state ? '#1a1a24' : '#1e3550'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '60px Anton'; g.fillText(state ? 'NO' : 'MUM', w / 2, 190); g.fillText(state ? 'SERVICE' : '', w / 2, 260); g.font = '30px Figtree'; g.fillText(state ? 'call failed' : 'calling…', w / 2, state ? 320 : 250); }); }
    phone.lookAt(ctx.cam.position); sami.frame(state); sami.face(); pl.intensity = state ? 1.5 : 3;
  };
}, { bloom: [0.7, 0.5, 0.75], dof: { focus: 3.0, aperture: 0.003, maxblur: 0.008 } });
// S13 the chalkboard rules
shot('chalk', 23.0, async (ctx) => {
  K.market(ctx.scene, { light: 'bright', seed: 13 });
  const B = textTex(null, { w: 1024, h: 700 });
  const lines = ['1. NO NOISE.', '2. NEVER OPEN THE SHUTTER.', '3. NEVER OPEN THE FREEZER.'];
  const timing = [[2.5, 5.5], [7.0, 10.5], [11.5, 15.0]];
  K.box(ctx.scene, 1.75, 1.22, 0.05, K.std('#6b4a2a'), -6, 1.45, -1.0);
  const board = K.add(ctx.scene, new THREE.PlaneGeometry(1.62, 1.1), new THREE.MeshStandardMaterial({ map: B.tex, roughness: 0.95 }), -6, 1.45, -1.03, { ry: Math.PI });
  [-0.8, 0.8].forEach((dx) => K.box(ctx.scene, 0.05, 2.0, 0.05, K.std('#5a3a1a'), -6 + dx, 1.0, -1.0));
  const sami = await actor(ctx, [{ who: 'sami', mood: 'calm', look: -1, arms: 'hold', badge: true }, { who: 'sami', mood: 'angry', look: -1, arms: 'hold', badge: true }], { at: [-4.85, 0, -0.95] });
  let lastKey = '';
  return (t) => {
    camPath(ctx.cam, [{ t: 0, pos: [-6.4, 1.4, -4.6], look: [-6, 1.4, -1.0], fov: 40 }, { t: 23, pos: [-6.15, 1.45, -2.9], look: [-6, 1.45, -1.0], fov: 38 }], t);
    const wipe = seg(t, 0.2, 2.0); const parts = timing.map(([a, b], i) => Math.floor(lines[i].length * seg(t, a, b))); const ul = seg(t, 18.0, 18.8);
    const key = `${Math.floor(wipe * 20)}|${parts.join(',')}|${Math.floor(ul * 10)}`;
    if (key !== lastKey) { lastKey = key; B.draw((g, w, h) => { g.fillStyle = '#1e2b25'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 9; i++) g.fillRect(i * 120, 0, 60, h); g.fillStyle = '#f2f2ee'; g.globalAlpha = 0.6 * (1 - wipe); g.font = '64px Caveat'; g.textAlign = 'center'; g.fillText("TODAY'S SPECIALS", w / 2, 90); g.fillText('Ice 10lb ... $3.49', w / 2, 200); g.globalAlpha = 0.92; g.textAlign = 'left'; g.font = '74px Caveat'; parts.forEach((n, i) => g.fillText(lines[i].slice(0, n), 50, 210 + i * 150)); if (ul > 0) { g.strokeStyle = '#f2f2ee'; g.lineWidth = 7; g.beginPath(); g.moveTo(50, 232); g.lineTo(50 + 360 * ul, 228); g.stroke(); } }); }
    sami.frame(t > 17.5 ? 1 : 0); sami.face(); sami.g.position.y = Math.sin(t * 1.4) * 0.006;
  };
}, { bloom: [0.35, 0.4, 0.9] });

// ---------- runtime ----------
let CUR = null;
window.SHOT_LIST = SHOTS.map((s) => ({ id: s.id, dur: s.dur }));
window.buildShot = async (i) => {
  if (CUR) { CUR.comp.dispose(); CUR.ctx.scene.traverse((m) => { if (m.geometry) m.geometry.dispose(); }); }
  const s = SHOTS[i]; const ctx = newCtx(); const update = await s.build(ctx);
  const comp = new EffectComposer(renderer); comp.setSize(W, H); comp.addPass(new RenderPass(ctx.scene, ctx.cam));
  let bokeh = null; if (s.post?.dof) { bokeh = new BokehPass(ctx.scene, ctx.cam, { focus: s.post.dof.focus, aperture: s.post.dof.aperture, maxblur: s.post.dof.maxblur }); comp.addPass(bokeh); }
  const b = s.post?.bloom || [0.6, 0.5, 0.85]; comp.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), b[0], b[1], b[2])); comp.addPass(new OutputPass());
  CUR = { s, ctx, update, comp, bokeh }; return s.dur;
};
window.renderFrame = (t) => {
  CUR.update(t, CUR.s.dur); if (CUR.bokeh && CUR.ctx.focus) CUR.bokeh.uniforms.focus.value = CUR.ctx.focus;
  CUR.comp.render(); return renderer.domElement.toDataURL('image/jpeg', 0.9);
};
window.filmReady = true;
