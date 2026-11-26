// Bake the hangar's Blender hulls into small 2D vector outlines for the in-game (combat) ship.
// Looks straight down on each model, records which material is on top at every point and traces each material's
// regions into simplified outlines. Every hull is split into its core and stock wings/engine/gun, and every fitting
// is traced from its own model, so the game can assemble any loadout. Writes combat-hulls-v1300.js.
// Run: node art/blender/bake-combat.mjs   (no Blender needed: it reads the exported .glb files)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as T from '../../vendor/three-0.187.0/three.module.js';
import { GLTFLoader } from '../../vendor/three-0.187.0/GLTFLoader.js';
import { MeshoptDecoder } from '../../vendor/three-0.187.0/meshopt_decoder.module.js';
import { slotOfObject } from '../../ship3d-blender.js';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..', '..');
const ids = ['vanguard', 'wasp', 'bastion', 'harrier', 'glacier', 'tempest', 'scavenger', 'spectre', 'architect', 'helios', 'echo', 'sovereign'];
const file = id => path.join(here, (id === 'wasp' ? 'wasp-refit' : id) + '.glb');
const CELL = .2;                       // raster resolution in ship units
// material name -> layer (drawn in this order)
const layerOfName = name => {
  if (/canopy/i.test(name)) return 'canopy';
  if (/guidance|lights/i.test(name)) return 'glow';
  if (/hull paint|midnight ceramic/i.test(name)) return 'paint';
  if (/graphite|heat/i.test(name)) return 'dark';
  if (/stencil|markings/i.test(name)) return 'mark';
  return 'panel';
};
const LAYERS = ['panel', 'paint', 'dark', 'mark', 'canopy', 'glow'];

const loadFile = f => new Promise((ok, bad) => { const b = fs.readFileSync(f); new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '', g => ok(g.scene), bad); });
const isGlow = m => !!(m.emissive && m.emissive.getHex() && (m.emissiveIntensity ?? 1) > 0);
const layerFor = m => { const n = m.name || ''; if (/canopy/i.test(n)) return 'canopy'; if (isGlow(m) || /guidance|lights/i.test(n)) return 'glow'; if (/hull paint|midnight ceramic/i.test(n)) return 'paint'; if (/graphite|heat|enamel/i.test(n)) return 'dark'; if (/stencil|markings|edges|edging/i.test(n)) return 'mark'; return 'panel'; };

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

// Rasterise a set of meshes looking straight down and trace each material layer into outlines (hull units).
function tracePiece(meshes, k, { ridge = false, eps = .35 } = {}) {
  if (!meshes.length) return null;
  const box = new T.Box3(); for (const o of meshes) box.expandByObject(o);
  const x0 = box.min.z * k - 1, x1 = box.max.z * k + 1, y0 = -box.max.x * k - 1, y1 = -box.min.x * k + 1;
  const W = Math.ceil((x1 - x0) / CELL), H = Math.ceil((y1 - y0) / CELL), depth = new Float32Array(W * H).fill(-1e9), layer = new Int8Array(W * H).fill(-1);
  const v = [new T.Vector3(), new T.Vector3(), new T.Vector3()];
  for (const o of meshes) {
    if (o.material.transparent && o.material.opacity < .05) continue;
    const L = LAYERS.indexOf(layerFor(o.material)), g = o.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count : pos.count;
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
  }
  const toHull = ([gx, gy]) => [+(x0 + gx * CELL).toFixed(1), +(y0 + gy * CELL).toFixed(1)];
  const trace = (test, e, minA) => contours(Uint8Array.from(layer, (l, i) => test(l, i) ? 1 : 0), W, H).map(l => simplifyLoop(l, e / CELL).map(toHull)).filter(p => p.length > 2 && area(p) >= minA);
  const out = { body: trace(l => l >= 0, eps, 1.2) };
  if (!out.body.length) return null;
  if (ridge) { let zmax = -1e9, zmin = 1e9; for (let i = 0; i < depth.length; i++) if (layer[i] >= 0) { zmax = Math.max(zmax, depth[i]); zmin = Math.min(zmin, depth[i]); } out.ridge = trace((l, i) => l >= 0 && depth[i] > zmin + (zmax - zmin) * .62, .45, 4); }
  for (const [i, name] of LAYERS.entries()) if (name !== 'panel') { const t = trace(l => l === i, name === 'glow' || name === 'mark' ? .22 : .32, name === 'glow' ? .25 : .8); if (t.length) out[name] = t; }
  return out;
}
const outletsOf = (root, k, keep = () => true) => { const o = []; root.traverse(n => { if (n.userData && n.userData.outletRadius && keep(n)) { const p = new T.Vector3().setFromMatrixPosition(n.matrixWorld).multiplyScalar(k); o.push([+p.z.toFixed(2), +(-p.x).toFixed(2), +(n.userData.outletRadius * k).toFixed(2)]); } }); return o; };

async function bake(id) {
  const hull = await loadFile(file(id)); hull.updateMatrixWorld(true);
  const ext = Math.max(...new T.Box3().setFromObject(hull).getSize(new T.Vector3()).toArray()), k = ext < 12 ? 9.6 : 1;   // the Wasp refit is exported in metres
  const meshes = []; hull.traverse(o => { if (o.isMesh) meshes.push(o); });
  const slotOf = o => slotOfObject(o.name.replaceAll('_', ' '), id);
  const out = { core: tracePiece(meshes.filter(o => !slotOf(o)), k, { ridge: true }), stock: {}, fit: {} };
  for (const slot of ['engine', 'wings', 'mount']) { const p = tracePiece(meshes.filter(o => slotOf(o) === slot), k); if (p) out.stock[slot] = p; }
  out.outlets = id === 'wasp' ? [-1, 1].map(side => [+(side * -.87 * 9.6).toFixed(2), +(3.346 * 9.6).toFixed(2), 1.5]) : outletsOf(hull, k);
  for (const slot of ['engine', 'wings', 'mount', 'plating']) {
    const f = path.join(here, 'fittings', id, slot + '.glb'); if (!fs.existsSync(f)) continue;
    const cat = await loadFile(f); cat.updateMatrixWorld(true);
    for (const child of cat.children) {
      const fid = child.userData && child.userData.fittingId; if (!fid) continue;
      const ms = []; child.traverse(o => { if (o.isMesh) ms.push(o); });
      const p = tracePiece(ms, 1, { eps: .4 }); if (!p) continue;
      if (slot === 'engine') p.outlets = outletsOf(child, 1);
      out.fit[fid] = p;
    }
  }
  return out;
}

const all = {};
for (const id of ids) { all[id] = await bake(id); console.log(id.padEnd(10), 'stock', Object.keys(all[id].stock).join(',') || '-', 'fittings', Object.keys(all[id].fit).length, 'outlets', all[id].outlets.length); }
const json = JSON.stringify(all);
const outFile = path.join(root, 'combat-hulls-v1300.js');
fs.writeFileSync(outFile, '// Generated by art/blender/bake-combat.mjs from the hangar Blender models. Do not edit by hand.\nvar bakedHulls=' + json + ';\n');
console.log('wrote combat-hulls-v1300.js', (json.length / 1024).toFixed(1), 'KB');
