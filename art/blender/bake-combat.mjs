// Bake the hangar's Blender hulls into small 2D vector outlines for the in-game (combat) ship.
// Looks straight down on each model, records which material is on top at every point, traces each
// material's regions into simplified outlines and writes them between the BAKED-HULLS markers in index.html.
// Run: node art/blender/bake-combat.mjs   (no Blender needed: it reads the exported .glb files)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as T from '../../vendor/three-0.187.0/three.module.js';
import { GLTFLoader } from '../../vendor/three-0.187.0/GLTFLoader.js';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..', '..');
const ids = ['vanguard', 'wasp', 'bastion', 'harrier', 'glacier', 'tempest', 'scavenger', 'spectre', 'architect', 'helios', 'echo', 'sovereign'];
const file = id => path.join(here, (id === 'wasp' ? 'wasp-refit' : id) + '.glb');
const CELL = .2;                       // raster resolution in ship units
// material name -> layer (drawn in this order)
const layerOf = name => {
  if (/canopy/i.test(name)) return 'canopy';
  if (/guidance|lights/i.test(name)) return 'glow';
  if (/hull paint|midnight ceramic/i.test(name)) return 'paint';
  if (/graphite|heat/i.test(name)) return 'dark';
  if (/stencil|markings/i.test(name)) return 'mark';
  return 'panel';
};
const LAYERS = ['panel', 'paint', 'dark', 'mark', 'canopy', 'glow'];

const load = id => new Promise((ok, bad) => { const b = fs.readFileSync(file(id)); new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '', g => ok(g.scene), bad); });

// Marching squares on a boolean grid -> closed loops of grid points.
function contours(mask, W, H) {
  const at = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x];
  const segs = new Map(), key = (x, y) => x + ',' + y, add = (a, b) => { segs.set(key(...a), b); };
  for (let y = -1; y < H; y++) for (let x = -1; x < W; x++) {
    const tl = at(x, y), tr = at(x + 1, y), br = at(x + 1, y + 1), bl = at(x, y + 1), c = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);
    const T0 = [x + .5, y], R = [x + 1, y + .5], B = [x + .5, y + 1], L = [x, y + .5];
    // directed segments keep filled cells on the same side, so loops close cleanly
    switch (c) {
      case 1: add(L, B); break; case 2: add(B, R); break; case 3: add(L, R); break; case 4: add(R, T0); break;
      case 5: add(L, T0); add(R, B); break; case 6: add(B, T0); break; case 7: add(L, T0); break; case 8: add(T0, L); break;
      case 9: add(T0, B); break; case 10: add(T0, R); add(B, L); break; case 11: add(T0, R); break; case 12: add(R, L); break;
      case 13: add(R, B); break; case 14: add(B, L); break;
    }
  }
  const loops = [];
  while (segs.size) {
    const [k0, n0] = segs.entries().next().value; segs.delete(k0);
    const loop = [k0.split(',').map(Number)]; let cur = n0;
    while (cur && key(...cur) !== k0) { loop.push(cur); const nx = segs.get(key(...cur)); segs.delete(key(...cur)); cur = nx; }
    if (loop.length > 3) loops.push(loop);
  }
  return loops;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let dmax = 0, idx = 0; const [a, b] = [pts[0], pts[pts.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if (d > dmax) { dmax = d; idx = i; } }
  return dmax > eps ? rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps)) : [a, b];
}
const area = p => { let s = 0; for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; s += q[0] * r[1] - r[0] * q[1]; } return Math.abs(s / 2); };
function simplifyLoop(loop, eps) { const mid = loop.length >> 1, a = rdp(loop.slice(0, mid + 1), eps), b = rdp(loop.slice(mid).concat([loop[0]]), eps); return a.slice(0, -1).concat(b.slice(0, -1)); }

async function bake(id) {
  const scene = await load(id); scene.updateMatrixWorld(true);
  let box = new T.Box3().setFromObject(scene), ext = Math.max(...box.getSize(new T.Vector3()).toArray());
  const k = ext < 12 ? 9.6 : 1;          // the Wasp refit is exported in metres
  // to 2D hull space: hx = lateral (glTF z), hy = -nose (glTF -x), height = glTF y
  const x0 = box.min.z * k - 1, x1 = box.max.z * k + 1, y0 = -box.max.x * k - 1, y1 = -box.min.x * k + 1;
  const W = Math.ceil((x1 - x0) / CELL), H = Math.ceil((y1 - y0) / CELL), depth = new Float32Array(W * H).fill(-1e9), layer = new Int8Array(W * H).fill(-1);
  const v = [new T.Vector3(), new T.Vector3(), new T.Vector3()], outlets = [];
  scene.traverse(o => {
    if (o.userData && o.userData.outletRadius) { const p = new T.Vector3().setFromMatrixPosition(o.matrixWorld).multiplyScalar(k); outlets.push([+(p.z).toFixed(2), +(-p.x).toFixed(2), +(o.userData.outletRadius * k).toFixed(2)]); }
    if (!o.isMesh || o.material.transparent && o.material.opacity < .05) return;
    const L = LAYERS.indexOf(layerOf(o.material.name || '')), g = o.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count : pos.count;
    for (let t = 0; t < n; t += 3) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(pos, idx ? idx.getX(t + j) : t + j).applyMatrix4(o.matrixWorld).multiplyScalar(k);
      const P = v.map(q => [(q.z - x0) / CELL, (-q.x - y0) / CELL, q.y]);
      const minX = Math.max(0, Math.floor(Math.min(P[0][0], P[1][0], P[2][0]))), maxX = Math.min(W - 1, Math.ceil(Math.max(P[0][0], P[1][0], P[2][0])));
      const minY = Math.max(0, Math.floor(Math.min(P[0][1], P[1][1], P[2][1]))), maxY = Math.min(H - 1, Math.ceil(Math.max(P[0][1], P[1][1], P[2][1])));
      const d = (P[1][1] - P[2][1]) * (P[0][0] - P[2][0]) + (P[2][0] - P[1][0]) * (P[0][1] - P[2][1]); if (Math.abs(d) < 1e-9) continue;
      for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
        const px = x + .5, py = y + .5, a = ((P[1][1] - P[2][1]) * (px - P[2][0]) + (P[2][0] - P[1][0]) * (py - P[2][1])) / d, b = ((P[2][1] - P[0][1]) * (px - P[2][0]) + (P[0][0] - P[2][0]) * (py - P[2][1])) / d, c = 1 - a - b;
        if (a < -1e-4 || b < -1e-4 || c < -1e-4) continue;
        const z = a * P[0][2] + b * P[1][2] + c * P[2][2], i = y * W + x;
        if (z > depth[i]) { depth[i] = z; layer[i] = L; }
      }
    }
  });
  const toHull = ([gx, gy]) => [+(x0 + gx * CELL).toFixed(1), +(y0 + gy * CELL).toFixed(1)];
  const trace = (test, eps, minA) => contours(Uint8Array.from(layer, (l, i) => test(l, i) ? 1 : 0), W, H).map(l => simplifyLoop(l, eps / CELL).map(toHull)).filter(p => p.length > 2 && area(p) >= minA);
  // height shading: split the visible top into a lit upper ridge and the lower flanks
  let zmax = -1e9, zmin = 1e9; for (let i = 0; i < depth.length; i++) if (layer[i] >= 0) { zmax = Math.max(zmax, depth[i]); zmin = Math.min(zmin, depth[i]); }
  const out = { body: trace(l => l >= 0, .35, 2), ridge: trace((l, i) => l >= 0 && depth[i] > zmin + (zmax - zmin) * .62, .45, 4), outlets };
  for (const [i, name] of LAYERS.entries()) if (name !== 'panel') out[name] = trace(l => l === i, name === 'glow' || name === 'mark' ? .22 : .32, name === 'glow' ? .25 : .8);
  return out;
}

const all = {};
for (const id of ids) { all[id] = await bake(id); const n = Object.values(all[id]).reduce((a, x) => a + x.length, 0); console.log(id.padEnd(10), 'shapes', n); }
const json = JSON.stringify(all).replace(/\],\[/g, '],[');
const htmlPath = path.join(root, 'index.html'); let html = fs.readFileSync(htmlPath, 'utf8');
const A = '/*BAKED-HULLS*/', B = '/*/BAKED-HULLS*/', a = html.indexOf(A), b = html.indexOf(B);
if (a < 0 || b < 0) throw new Error('BAKED-HULLS markers not found in index.html');
html = html.slice(0, a + A.length) + 'const bakedHulls=' + json + ';' + html.slice(b);
fs.writeFileSync(htmlPath, html);
console.log('wrote', (json.length / 1024).toFixed(1), 'KB into index.html');
