/* Reactor Rogue 3D hangar ship, v1.1.
   Builds a real 3D model of the player's ship from the same 2D drawing the game uses:
   index.html records every polygon, circle and line the hull/part painters draw (in draw order),
   and this module extrudes them into bevelled metal panels with neon edges, adds engine flames,
   reflections and a bloom glow, then renders on a transparent canvas laid over the hangar bay.
   Purely cosmetic and menu-only. Any failure returns null and the bay keeps its 2D ship. */

import { buildVanguard, supportsVanguard } from './vanguard-model.js';
export const THREE_URL = new URL('./vendor/three-0.187.0/three.module.js', import.meta.url).href;

const QUAD_VERTEX = `precision highp float;
attribute vec3 position;
varying vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BRIGHT_FRAGMENT = `precision highp float;
uniform sampler2D uTex; varying vec2 vUv;
void main(){ vec4 c = texture2D(uTex, vUv); float l = max(c.r, max(c.g, c.b)); float k = smoothstep(0.55, 1.2, l); gl_FragColor = vec4(c.rgb * k, 1.0); }`;

const BLUR_FRAGMENT = `precision highp float;
uniform sampler2D uTex; uniform vec2 uStep; varying vec2 vUv;
void main(){
  vec3 c = texture2D(uTex, vUv).rgb * 0.227027;
  c += (texture2D(uTex, vUv + uStep * 1.3846).rgb + texture2D(uTex, vUv - uStep * 1.3846).rgb) * 0.316216;
  c += (texture2D(uTex, vUv + uStep * 3.2308).rgb + texture2D(uTex, vUv - uStep * 3.2308).rgb) * 0.070270;
  gl_FragColor = vec4(c, 1.0);
}`;

const COMPOSITE_FRAGMENT = `precision highp float;
uniform sampler2D uNear; uniform sampler2D uWide; uniform float uStrength; varying vec2 vUv;
void main(){
  vec3 c = (texture2D(uNear, vUv).rgb * 0.7 + texture2D(uWide, vUv).rgb * 0.9) * uStrength;
  c = 1.0 - exp(-c);
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  gl_FragColor = vec4(c, a);
}`;

function polygonArea(p) { let a = 0; for (let i = 0; i < p.length; i++) { let q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1]; } return a / 2; }
function bbox(p) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (let [x, y] of p) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } return { x0, y0, x1, y1 }; }
function overlap(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

export async function createShip3D(canvas, loadThree = () => import(THREE_URL)) {
  if (!canvas) return null;
  const T = await loadThree();
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.autoClear = false;

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 1, 4000);

  // A small neon "room" baked into an environment map gives the metal something to reflect.
  {
    const pm = new T.PMREMGenerator(renderer), env = new T.Scene(), box = new T.BoxGeometry(1, 1, 1);
    env.add(new T.Mesh(new T.BoxGeometry(60, 30, 60), new T.MeshBasicMaterial({ color: 0x0b1424, side: T.BackSide })));
    const panel = (c, x, y, z, sx, sy, sz, k = 1) => { let m = new T.Mesh(box, new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k) })); m.position.set(x, y, z); m.scale.set(sx, sy, sz); env.add(m); };
    panel(0xffffff, 0, 14, 0, 30, .5, 8, 3);       // overhead strip light
    panel(0x65f7ef, -29, 4, 0, .5, 4, 40, 2);      // cyan wall strip
    panel(0xb48cff, 29, 2, 0, .5, 3, 40, 1.6);     // violet wall strip
    panel(0xffc070, 0, 6, -29, 30, 2, .5, 1.2);    // warm back strip
    panel(0x203048, 0, -14, 0, 60, .5, 60, 1);     // floor
    const rt = pm.fromScene(env, 0.035);
    scene.environment = rt.texture;
    pm.dispose();
  }

  // Lights: cool sky / dark ground, a key light from the top-left (like the 2D art), a coloured rim and a pad glow from below.
  const hemi = new T.HemisphereLight(0x9fc8ff, 0x0a1020, 0.6); scene.add(hemi);
  const key = new T.DirectionalLight(0xffffff, 2.2); key.position.set(-60, 120, 60); scene.add(key);
  const rim = new T.DirectionalLight(0x65f7ef, 2.0); rim.position.set(40, 30, -120); scene.add(rim);
  const pad = new T.PointLight(0x65f7ef, 1.2, 0, 0); pad.position.set(0, -60, 20); scene.add(pad);

  // pivot (user yaw/pitch/roll) > orient (nose points up the screen) > model (shape space: x nose, z thickness)
  const pivot = new T.Group(), orient = new T.Group(), model = new T.Group();
  orient.rotation.y = Math.PI / 2; model.rotation.x = -Math.PI / 2;
  pivot.add(orient); orient.add(model); scene.add(pivot);

  const glowMeshes = [], bodyMeshes = [], blackMat = new T.MeshBasicMaterial({ color: 0x000000 });
  let flames = [], built = '', disposables = [];
  const neonMat = new Map();
  const neon = (c, k = 1.6) => { let key = c + '|' + k; if (!neonMat.has(key)) { let m = new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k), toneMapped: false, side: T.DoubleSide }); neonMat.set(key, m); disposables.push(m); } return neonMat.get(key); };

  // Thin square tubes along a path, merged into one mesh per colour: the neon edges.
  function edgeMesh(paths, colour, w, z, k) {
    let pos = [], idx = [], h = w / 2;
    for (let { pts, closed } of paths) {
      let n = pts.length, segs = closed ? n : n - 1;
      for (let i = 0; i < segs; i++) {
        let a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); if (L < .05) continue;
        let nx = -dy / L * h, ny = dx / L * h, ex = dx / L * h, ey = dy / L * h, za = (a[2] ?? z), zb = (b[2] ?? z), base = pos.length / 3;
        let ax = a[0] - ex, ay = a[1] - ey, bx = b[0] + ex, by = b[1] + ey;
        for (let [x, y, zz] of [[ax + nx, ay + ny, za - h], [ax - nx, ay - ny, za - h], [ax - nx, ay - ny, za + h], [ax + nx, ay + ny, za + h], [bx + nx, by + ny, zb - h], [bx - nx, by - ny, zb - h], [bx - nx, by - ny, zb + h], [bx + nx, by + ny, zb + h]]) pos.push(x, -y, zz);
        for (let f of [[0, 1, 2, 0, 2, 3], [4, 6, 5, 4, 7, 6], [0, 4, 5, 0, 5, 1], [1, 5, 6, 1, 6, 2], [2, 6, 7, 2, 7, 3], [3, 7, 4, 3, 4, 0]]) for (let v of f) idx.push(base + v);
      }
    }
    if (!pos.length) return null;
    let g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    disposables.push(g);
    let m = new T.Mesh(g, neon(colour, k)); glowMeshes.push(m); return m;
  }

  function clearModel() {
    for (let o of [...model.children]) model.remove(o);
    for (let d of disposables) try { d.dispose(); } catch (e) {}
    disposables = []; neonMat.clear(); glowMeshes.length = 0; bodyMeshes.length = 0; flames = [];
  }

  // rec: {shapes:[{pts,fill,stroke,lw,alpha,glass}], lines:[{pts,closed,color,w}], color, trail, engines:[[x,y,r]]}
  // Shape space: x = nose, y = right side (mirrored to -y in 3D), z = up. Pieces are lofted, not slab-extruded:
  // the hull rises from a thin rim to a rounded spine; panels are shells that follow the surface under them.
  const prof = t => .2 + .8 * Math.sqrt(Math.max(0, 1 - t * t));               // contour scale at height fraction t
  const profInv = r => r <= .2 ? 1 : Math.sqrt(Math.max(0, 1 - Math.pow((r - .2) / .8, 2)));
  function densify(pts, step) { let out = []; for (let i = 0; i < pts.length; i++) { let a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return out; }
  // Round every corner with a small fillet (a quadratic curve cut back from the vertex).
  function roundCorners(pts, r, seg = 4) {
    if (r <= 0 || pts.length < 3) return pts; let out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      let p = pts[(i + n - 1) % n], v = pts[i], q = pts[(i + 1) % n], l1 = Math.hypot(p[0] - v[0], p[1] - v[1]), l2 = Math.hypot(q[0] - v[0], q[1] - v[1]);
      if (l1 < 1e-6 || l2 < 1e-6) continue;
      let d1 = Math.min(r, l1 * .42), d2 = Math.min(r, l2 * .42), a = [v[0] + (p[0] - v[0]) / l1 * d1, v[1] + (p[1] - v[1]) / l1 * d1], b = [v[0] + (q[0] - v[0]) / l2 * d2, v[1] + (q[1] - v[1]) / l2 * d2];
      let turn = Math.abs(((p[0] - v[0]) * (q[1] - v[1]) - (p[1] - v[1]) * (q[0] - v[0])) / (l1 * l2));
      if (turn < .08) { out.push(v); continue; }                                   // nearly straight: keep the point
      for (let k = 0; k <= seg; k++) { let u = k / seg, w = 1 - u; out.push([w * w * a[0] + 2 * w * u * v[0] + u * u * b[0], w * w * a[1] + 2 * w * u * v[1] + u * u * b[1]]); }
    }
    return out;
  }
  function ccw(pts) { return polygonArea(pts) > 0 ? pts : pts.slice().reverse(); }
  // half-width of a polygon across the line x = const (max |y| of the crossings)
  function halfWidth(pts, x) { let w = 0; for (let i = 0; i < pts.length; i++) { let a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) { let y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); w = Math.max(w, Math.abs(y)); } else if (a[0] === x) w = Math.max(w, Math.abs(a[1])); } return w; }
  function inside(pts, x, y) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { let a = pts[i], b = pts[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  // Loft a closed outline into a smooth solid. mode 'spine': contours squeeze toward y=0; 'centre': toward the centroid.
  function loft(pts0, H, Hb, mode, rings = 7) {
    let pts = ccw(pts0), n = pts.length, cx = 0, cy = 0; for (let [x, y] of pts) { cx += x; cy += y; } cx /= n; cy /= n;
    let ring = (t, z) => pts.map(([x, y]) => { let s = prof(t); return mode === 'spine' ? [x + (cx - x) * (1 - s) * .12, y * s, z] : [cx + (x - cx) * s, cy + (y - cy) * s, z]; });
    let pos = [], idx = [], add = r => { let b = pos.length / 3; for (let [x, y, z] of r) pos.push(x, -y, z); return b; };
    // top rings (rim duplicated so the rim stays crisp), then bottom rings
    let top = [], bot = [];
    for (let k = 0; k <= rings; k++) { let t = k / rings; top.push(add(ring(t, H * Math.sin(t * Math.PI / 2)))); }
    let bRings = Math.max(2, Math.round(rings / 2));
    for (let k = 0; k <= bRings; k++) { let t = k / bRings; bot.push(add(ring(t, -Hb * Math.sin(t * Math.PI / 2)))); }
    let strip = (A, B, flip) => { for (let i = 0; i < n; i++) { let j = (i + 1) % n, a = A + i, b = A + j, c = B + j, d = B + i; if (flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d); } };
    for (let k = 0; k < rings; k++) strip(top[k], top[k + 1], false);
    for (let k = 0; k < bRings; k++) strip(bot[k], bot[k + 1], true);
    let capT = T.ShapeUtils.triangulateShape(pts.map(([x, y]) => new T.Vector2(x, y)), []);
    for (let [a, b, c] of capT) { idx.push(top[rings] + a, top[rings] + b, top[rings] + c); idx.push(bot[bRings] + a, bot[bRings] + c, bot[bRings] + b); }
    let g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    // The y-mirror flips winding; make sure faces point outward.
    let nrm = g.getAttribute('normal'), p = g.getAttribute('position'), out = 0; for (let v = top[rings]; v < top[rings] + n; v++) out += nrm.getZ(v); if (out < 0) { let ix = g.getIndex().array; for (let q = 0; q < ix.length; q += 3) { let t0 = ix[q + 1]; ix[q + 1] = ix[q + 2]; ix[q + 2] = t0; } g.computeVertexNormals(); }
    return { geo: g, height: (x, y) => { if (!inside(pts, x, y)) return null; if (mode === 'spine') { let w = halfWidth(pts, x) || 1; return H * Math.sin(profInv(Math.abs(y) / w) * Math.PI / 2); } let d = Math.hypot(x - cx, y - cy), m = 0; for (let [px, py] of pts) m = Math.max(m, Math.hypot(px - cx, py - cy)); return H * Math.sin(profInv(Math.min(1, d / (m || 1))) * Math.PI / 2); } };
  }
  // A thin shell that drapes over the surface below it (detail plating).
  function shell(pts0, zAt, lift, thick) {
    let pts = ccw(densify(pts0, 2.0)), n = pts.length;
    // triangulate, then split long interior edges so the plate can bend with the hull (boundary edges are <= 2.0, never split)
    let V = pts.map(p => [p[0], p[1]]), tris = T.ShapeUtils.triangulateShape(pts.map(([x, y]) => new T.Vector2(x, y)), []).map(t => t.slice()), mid = new Map();
    let midpoint = (a, b) => { let k = a < b ? a + ',' + b : b + ',' + a; if (!mid.has(k)) { V.push([(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2]); mid.set(k, V.length - 1); } return mid.get(k); };
    let len = (a, b) => Math.hypot(V[a][0] - V[b][0], V[a][1] - V[b][1]);
    for (let pass = 0; pass < 6; pass++) {
      let next = [], split = false;
      for (let [a, b, c] of tris) {
        let e = [[a, b, c], [b, c, a], [c, a, b]].sort((p, q) => len(q[0], q[1]) - len(p[0], p[1]))[0];
        if (len(e[0], e[1]) > 2.1) { let m = midpoint(e[0], e[1]); next.push([e[0], m, e[2]], [m, e[1], e[2]]); split = true; } else next.push([a, b, c]);
      }
      tris = next; if (!split) break;
    }
    let N = V.length, tz = V.map(([x, y]) => zAt(x, y) + lift), pos = [], idx = [];
    for (let k = 0; k < N; k++) pos.push(V[k][0], -V[k][1], tz[k]);
    for (let k = 0; k < N; k++) pos.push(V[k][0], -V[k][1], tz[k] - thick);
    for (let [a, b, c] of tris) { idx.push(a, c, b); idx.push(N + a, N + b, N + c); }
    for (let k = 0; k < n; k++) { let m = (k + 1) % n; idx.push(k, m, N + m, k, N + m, N + k); }
    let g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    let nrm = g.getAttribute('normal'), up = 0; for (let v = 0; v < n; v++) up += nrm.getZ(v); if (up < 0) { let ix = g.getIndex().array; for (let q = 0; q < ix.length; q += 3) { let t0 = ix[q + 1]; ix[q + 1] = ix[q + 2]; ix[q + 2] = t0; } g.computeVertexNormals(); }
    return { geo: g, top: pts.map((p, k) => [p[0], p[1], tz[k] + .02]) };
  }


  function build(rec, key) {
    clearModel();
    if (supportsVanguard(key)) {
      const authored = buildVanguard(T, rec);
      model.add(authored.root);
      disposables.push(...authored.disposables);
      bodyMeshes.push(...authored.bodyMeshes); glowMeshes.push(...authored.glowMeshes);
      flames = authored.flames;
      pad.color.set(rec.color || '#65fbd2'); rim.color.set(rec.color || '#65fbd2');
      return;
    }
    let col = rec.color || '#65f7ef', shapes = rec.shapes.filter(s => s.pts.length >= 3 && (s.alpha > .3 || (s.glass && s.stroke))), base = -1, best = 0;
    shapes.forEach((s, i) => { s.area = Math.abs(polygonArea(s.pts)); s.box = bbox(s.pts); if (s.area > best && !s.glass) { best = s.area; base = i; } });
    shapes.forEach((s, i) => { let sz = Math.sqrt(s.area); s.pts = roundCorners(s.pts, i === base ? Math.min(2.6, sz * .09) : Math.min(1.5, sz * .12), i === base ? 5 : 3); });
    if (base < 0) return;
    let edgesBy = new Map(), addEdge = (c, path, w, k) => { let key = c + '|' + w + '|' + k; if (!edgesBy.has(key)) edgesBy.set(key, { c, w, k, paths: [] }); edgesBy.get(key).paths.push(path); };
    let B = shapes[base], span = Math.max(B.box.y1 - B.box.y0, B.box.x1 - B.box.x0), HH = Math.max(4, Math.min(9, span * .14)), surfaces = [], levels = [];
    let metal = (fill, main) => { let m = new T.MeshStandardMaterial({ color: new T.Color(fill || '#203346'), metalness: main ? .72 : .6, roughness: main ? .28 : .36, envMapIntensity: 1.0, emissive: new T.Color(col), emissiveIntensity: .02 }); disposables.push(m); return m; };
    let put = (geo, mat, glow) => { disposables.push(geo); let m = new T.Mesh(geo, mat); model.add(m); (glow ? glowMeshes : bodyMeshes).push(m); return m; };
    let zAt = (x, y) => { let z = -Infinity; for (let f of surfaces) { let h = f(x, y); if (h !== null && h > z) z = h; } return z === -Infinity ? 0 : z; };
    // 1) back-layer pieces (wings, fins, engine pods) as small rounded lofts; 2) the hull; 3) plating shells on top.
    let order = shapes.map((s, i) => i).filter(i => i < base).concat([base], shapes.map((s, i) => i).filter(i => i > base));
    for (let i of order) {
      let s = shapes[i]; if (s.area < 1.2 && i !== base) continue;
      if (s.glass) {
        let sh = shell(s.pts, (x, y) => i < base ? .2 : zAt(x, y), .35, .35);
        let mat = new T.MeshStandardMaterial({ color: new T.Color(s.fill), metalness: .1, roughness: .05, transparent: true, opacity: .36, emissive: new T.Color(s.fill), emissiveIntensity: .16, depthWrite: false, side: T.DoubleSide }); disposables.push(mat);
        let m = put(sh.geo, mat, false); bodyMeshes.pop(); m.renderOrder = 2;
        if (s.stroke) addEdge(s.stroke, { pts: sh.top, closed: true }, .35, 1.2);
        continue;
      }
      if (i <= base) {
        let main = i === base, H = main ? HH : Math.max(.9, Math.min(2.6, Math.sqrt(s.area) * .2)), L = loft(s.pts, H, main ? H * .45 : H * .6, main ? 'spine' : 'centre', main ? 8 : 4);
        put(L.geo, metal(s.fill, main)); surfaces.push(L.height);
        if (s.stroke) { let w = main ? .62 : .42, k = main ? 1.6 : 1.3; addEdge(s.stroke, { pts: densify(s.pts, 3).map(([x, y]) => [x, y, 0]), closed: true }, w, k); }
        if (s.fill && /^#?(f|e|d)[0-9a-f]/i.test(s.fill.replace('#', '')) && s.area < 40) { let m = bodyMeshes.pop(); m.material = neon(s.fill, 1.4); glowMeshes.push(m); }
        continue;
      }
      // a piece mostly hanging off the hull (tail lights, gun pods, vents) becomes a small rounded solid at the hull's side
      let onSurf = 0; for (let [x, y] of s.pts) { for (let f of surfaces) if (f(x, y) !== null) { onSurf++; break; } }
      if (onSurf < s.pts.length * .3) {
        let H = Math.max(.9, Math.min(2.4, Math.sqrt(s.area) * .3)), L = loft(s.pts, H, H * .75, 'centre', 4);
        let glowy = s.fill && /^#?(f|e|d)[0-9a-f]/i.test(s.fill.replace('#', '')) && s.area < 40;
        put(L.geo, glowy ? neon(s.fill, 1.4) : metal(s.fill, false), glowy); surfaces.push(L.height);
        if (s.stroke) addEdge(s.stroke, { pts: densify(s.pts, 2.5).map(([x, y]) => [x, y, 0]), closed: true }, .34, 1.2);
        continue;
      }
      // plating: lift above anything it overlaps that was plated earlier
      let lv = 0, cxs = (s.box.x0 + s.box.x1) / 2, cys = (s.box.y0 + s.box.y1) / 2; for (let p of levels) if (p.area > s.area * 1.2 && cxs > p.box.x0 && cxs < p.box.x1 && cys > p.box.y0 && cys < p.box.y1) lv = Math.max(lv, p.lv + 1); lv = Math.min(lv, 2);
      let dark = (() => { let c = new T.Color(s.fill || '#000'); return c.r + c.g + c.b < .06; })() && s.area < 24;
      let lift = dark ? .1 + lv * .26 : .26 + lv * .26, sh = shell(s.pts, zAt, lift, dark ? .3 : .6 + lv * .26);
      let glowy = s.fill && /^#?(f|e|d)[0-9a-f]/i.test(s.fill.replace('#', '')) && s.area < 40;
      put(sh.geo, glowy ? neon(s.fill, 1.4) : metal(s.fill, false), glowy);
      levels.push({ box: s.box, lv, area: s.area, pts: s.pts, lift });
      if (s.stroke) addEdge(s.stroke, { pts: sh.top, closed: true }, Math.max(.24, Math.min(.46, (s.lw || 1) * .28)), 1.2);
    }
    for (let l of rec.lines || []) if (l.pts && l.pts.length > 1) { let pts = l.pts.length === 2 ? [0, .25, .5, .75, 1].map(u => [l.pts[0][0] + (l.pts[1][0] - l.pts[0][0]) * u, l.pts[0][1] + (l.pts[1][1] - l.pts[0][1]) * u]) : l.pts; let lineZ = (x, y) => { let t = .3; for (let p of levels) if (inside(p.pts, x, y)) t = Math.max(t, p.lift + .04); return zAt(x, y) + t; };
      addEdge(l.color || col, { pts: (l.pts.length === 2 ? pts : densify(l.pts, 1.5)).map(([x, y]) => [x, y, lineZ(x, y)]), closed: !!l.closed }, Math.max(.22, Math.min(.42, (l.w || 1) * .26)), 1.1); }
    // engine flames: additive cones behind the tail
    let fm = new T.MeshBasicMaterial({ color: new T.Color(rec.trail || col).multiplyScalar(2.2), transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false, side: T.DoubleSide }),
        core = new T.MeshBasicMaterial({ color: new T.Color('#ffffff').multiplyScalar(2.4), transparent: true, opacity: .9, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false, side: T.DoubleSide });
    disposables.push(fm, core);
    for (let [x, y, r] of rec.engines || []) {
      let outer = new T.Mesh(new T.ConeGeometry(r || 2.6, 1, 14, 1, true), fm), inner = new T.Mesh(new T.ConeGeometry((r || 2.6) * .45, 1, 10, 1, true), core);
      disposables.push(outer.geometry, inner.geometry);
      for (let m of [outer, inner]) { m.rotation.z = Math.PI / 2; m.position.set(x, -y, Math.max(0, zAt(x + 2, y) * .5)); model.add(m); glowMeshes.push(m); }
      flames.push({ outer, inner, x, y: -y, z: Math.max(0, zAt(x + 2, y) * .5), r: r || 2.6 });
      { let rr = (r || 2.6), nz = new T.Mesh(new T.CylinderGeometry(rr * 1.05, rr * 1.3, 3.2, 16, 1, true), metal('#3a4c5e', true)); disposables.push(nz.geometry); nz.material.side = T.DoubleSide; nz.rotation.z = Math.PI / 2; nz.position.set(x + 1.2, -y, Math.max(0, zAt(x + 2, y) * .5)); model.add(nz); bodyMeshes.push(nz);
        addEdge(rec.trail || col, { pts: Array.from({ length: 17 }, (_, k) => { let a = k / 16 * Math.PI * 2; return [x - .4, y + Math.cos(a) * rr * 1.3, Math.max(0, zAt(x + 2, y) * .5) + Math.sin(a) * rr * 1.3]; }), closed: true }, .3, 1.5); }
      let glow = new T.PointLight(new T.Color(rec.trail || col), .6, 60, 1.5); glow.position.set(x - 6, -y, 0); model.add(glow);
    }
    for (let e of edgesBy.values()) { let m = edgeMesh(e.paths, e.c, e.w, 0, e.k); if (m) model.add(m); }
    pad.color.set(col); rim.color.set(col);
  }

  // Bloom: render only the glowing parts (bodies drawn black as occluders), blur at 1/2 and 1/4 size, add on top.
  const quadGeo = new T.BufferGeometry(); quadGeo.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const raw = (fs, uniforms, add) => new T.RawShaderMaterial({ vertexShader: QUAD_VERTEX, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false, transparent: !!add,
    blending: add ? T.CustomBlending : T.NoBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneFactor, blendSrcAlpha: T.OneFactor, blendDstAlpha: T.OneMinusSrcAlphaFactor });
  const bright = raw(BRIGHT_FRAGMENT, { uTex: { value: null } }), blur = raw(BLUR_FRAGMENT, { uTex: { value: null }, uStep: { value: new T.Vector2() } }),
        comp = raw(COMPOSITE_FRAGMENT, { uNear: { value: null }, uWide: { value: null }, uStrength: { value: 1 } }, true);
  const quad = new T.Mesh(quadGeo, bright); quad.frustumCulled = false; const qScene = new T.Scene(); qScene.add(quad); const qCam = new T.Camera();
  const rt = (w, h) => new T.WebGLRenderTarget(w, h, { type: T.HalfFloatType, depthBuffer: true, magFilter: T.LinearFilter, minFilter: T.LinearFilter });
  let G = rt(1, 1), A = rt(1, 1), B = rt(1, 1), C = rt(1, 1), D = rt(1, 1);
  const pass = (mat, out) => { quad.material = mat; renderer.setRenderTarget(out); renderer.clear(true, true, false); renderer.render(qScene, qCam); };

  let W = 1, H = 1, ratio = 1, lost = false;
  const tmpQ = new T.Quaternion(), qYaw = new T.Quaternion(), qPitch = new T.Quaternion(), qRoll = new T.Quaternion(), X = new T.Vector3(1, 0, 0), Y = new T.Vector3(0, 1, 0), Z = new T.Vector3(0, 0, 1);

  const ship = {
    exhaust: [],
    get lost() { return lost; },
    // rec is rebuilt only when its key changes (hull, paint, parts)
    setShip(key, rec) { if (key === built) return; try { build(rec, key); built = key; } catch (e) {
      console.warn('ship3d build; restoring recorded model', e);
      build(rec, 'legacy'); built = key;
    } },
    resize(w, h, dpr) {
      if (w === W && h === H && dpr === ratio) return; W = Math.max(1, w); H = Math.max(1, h); ratio = dpr || 1;
      renderer.setPixelRatio(ratio); renderer.setSize(W, H, false);
      let pw = Math.round(W * ratio), ph = Math.round(H * ratio);
      G.setSize(Math.ceil(pw / 2), Math.ceil(ph / 2)); A.setSize(Math.ceil(pw / 2), Math.ceil(ph / 2)); B.setSize(Math.ceil(pw / 2), Math.ceil(ph / 2));
      C.setSize(Math.ceil(pw / 4), Math.ceil(ph / 4)); D.setSize(Math.ceil(pw / 4), Math.ceil(ph / 4));
      camera.aspect = W / H;
    },
    // f: {x, y (CSS px of ship centre), scale (px per ship unit), yaw, pitch, roll, appear (0-1), thrust, t, bloom}
    render(f) {
      if (lost) return;
      let fov = 30, D0 = H / (2 * Math.tan(fov * Math.PI / 360) * Math.max(.05, f.scale)), elev = 58 * Math.PI / 180;
      camera.fov = fov; camera.near = D0 * .2; camera.far = D0 * 3;
      camera.position.set(0, Math.sin(elev) * D0, Math.cos(elev) * D0); camera.lookAt(0, 0, 0);
      camera.setViewOffset(W, H, W / 2 - f.x, H / 2 - f.y, W, H); camera.updateProjectionMatrix();
      // user rotation: yaw about the vertical, pitch toward the camera, roll about the nose
      qYaw.setFromAxisAngle(Y, -(f.yaw || 0)); qPitch.setFromAxisAngle(X, f.pitch || 0); qRoll.setFromAxisAngle(Z, f.roll || 0);
      tmpQ.copy(qPitch).multiply(qYaw).multiply(qRoll); pivot.quaternion.copy(tmpQ);
      let s = f.appear ?? 1; pivot.scale.setScalar(Math.max(.001, s));
      for (let fl of flames) {
        let flick = 1 + Math.sin(f.t * 31 + fl.x) * .08 + Math.sin(f.t * 17) * .06, L = (4 + (f.thrust || 0) * 9) * flick;
        fl.outer.scale.set(1, L, 1); fl.outer.position.x = fl.x - L / 2; fl.inner.scale.set(1, L * .6, 1); fl.inner.position.x = fl.x - L * .3;
      }
      renderer.setRenderTarget(null); renderer.setViewport(0, 0, W, H); renderer.clear(true, true, true);
      renderer.render(scene, camera);
      // where each nozzle is on screen, and which way (and how far, foreshortened) its exhaust points
      ship.exhaust = flames.map(fl => {
        let a = new T.Vector3(fl.x - 1.5, fl.y, fl.z).applyMatrix4(model.matrixWorld).project(camera), b = new T.Vector3(fl.x - 11.5, fl.y, fl.z).applyMatrix4(model.matrixWorld).project(camera);
        let ax = (a.x + 1) / 2 * W, ay = (1 - a.y) / 2 * H, bx = (b.x + 1) / 2 * W, by = (1 - b.y) / 2 * H, s0 = Math.max(.05, f.scale) * 10;
        return { x: ax, y: ay, dx: (bx - ax) / s0, dy: (by - ay) / s0, behind: b.z > a.z };
      });
      if (f.bloom === false) return;
      // glow-only pass
      let swapped = bodyMeshes.map(m => [m, m.material]); for (let [m] of swapped) m.material = blackMat;
      let env = scene.environment; scene.environment = null;
      renderer.setRenderTarget(G); renderer.clear(true, true, true); renderer.render(scene, camera);
      for (let [m, mat] of swapped) m.material = mat; scene.environment = env;
      bright.uniforms.uTex.value = G.texture; pass(bright, A);
      blur.uniforms.uTex.value = A.texture; blur.uniforms.uStep.value.set(1 / A.width, 0); pass(blur, B);
      blur.uniforms.uTex.value = B.texture; blur.uniforms.uStep.value.set(0, 1 / A.height); pass(blur, A);
      blur.uniforms.uTex.value = A.texture; blur.uniforms.uStep.value.set(.5 / A.width, .5 / A.height); pass(blur, C);
      blur.uniforms.uTex.value = C.texture; blur.uniforms.uStep.value.set(1.5 / C.width, 0); pass(blur, D);
      blur.uniforms.uTex.value = D.texture; blur.uniforms.uStep.value.set(0, 1.5 / C.height); pass(blur, C);
      comp.uniforms.uNear.value = A.texture; comp.uniforms.uWide.value = C.texture; comp.uniforms.uStrength.value = f.glow ?? 1;
      quad.material = comp; renderer.setRenderTarget(null); renderer.render(qScene, qCam);
    },
    dispose() { clearModel(); for (let t of [G, A, B, C, D]) t.dispose(); for (let m of [bright, blur, comp, blackMat]) m.dispose(); quadGeo.dispose(); renderer.dispose(); }
  };
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; });
  return ship;
}

