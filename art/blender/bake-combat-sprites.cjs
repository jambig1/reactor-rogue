// Render top-down combat sprites of every hull piece and fitting from the hangar Blender models.
// Uses headless Chrome + three.js (no Blender needed). Run after bake-combat.mjs (it reuses its piece bounds):
//   node art/blender/bake-combat-sprites.cjs [--force] [path/to/chrome]
// Software rendering and WebP encoding vary slightly between Chrome versions, so an existing sprite is only
// rewritten when it visibly changed (different size, or more than tiny anti-aliasing differences); --force rewrites all.
// Writes art/combat/<hull>/<piece>.webp and adds each piece's sprite box to combat-hulls-v1300.js.
// Painted panels are rendered neutral grey so the game can recolour them in the player's paint.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..'), PPU = 6;
const dataFile = path.join(root, 'combat-hulls-v1300.js');
const src = fs.readFileSync(dataFile, 'utf8'), json = src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1), data = JSON.parse(json);

const page = `<!doctype html><html><body style="margin:0;background:transparent"><canvas id="c"></canvas><script type="module">
import * as T from './vendor/three-0.187.0/three.module.js';
import { GLTFLoader } from './vendor/three-0.187.0/GLTFLoader.js';
import { MeshoptDecoder } from './vendor/three-0.187.0/meshopt_decoder.module.js';
import { slotOfObject } from './ship3d-blender.js';
const canvas = document.getElementById('c'), r = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
r.setClearColor(0, 0); r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = .72;
const scene = new T.Scene();
{ const pm = new T.PMREMGenerator(r), env = new T.Scene(), box = new T.BoxGeometry(1, 1, 1);
  env.add(new T.Mesh(new T.BoxGeometry(60, 30, 60), new T.MeshBasicMaterial({ color: 0x0b1424, side: T.BackSide })));
  const panel = (c, x, y, z, sx, sy, sz, k = 1) => { const m = new T.Mesh(box, new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k) })); m.position.set(x, y, z); m.scale.set(sx, sy, sz); env.add(m); };
  panel(0xffffff, 0, 14, 0, 30, .5, 8, 3); panel(0x65f7ef, -29, 4, 0, .5, 4, 40, 1.6); panel(0xb48cff, 29, 2, 0, .5, 3, 40, 1.3); panel(0xffc070, 0, 6, -29, 30, 2, .5, 1.2);
  scene.environment = pm.fromScene(env, .035).texture; }
scene.add(new T.HemisphereLight(0x9fc0e8, 0x05080e, .35));
const key = new T.DirectionalLight(0xffffff, 2.4); key.position.set(55, 45, -45); scene.add(key);   // low from the nose-left so curves and edges shade
const fillL = new T.DirectionalLight(0x6fbcff, .45); fillL.position.set(-50, 25, 50); scene.add(fillL);
const cam = new T.OrthographicCamera(-1, 1, 1, -1, .1, 1000); cam.position.set(0, 200, 0); cam.up.set(1, 0, 0); cam.lookAt(0, 0, 0);
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder), cache = new Map();
const load = url => { if (!cache.has(url)) cache.set(url, new Promise((ok, bad) => loader.load(url, g => ok(g.scene), undefined, bad))); return cache.get(url); };
const neutral = m => { m = m.clone(); if (/hull paint|midnight ceramic/i.test(m.name || '')) { m.color = new T.Color('#8a949f'); m.metalness = .45; m.roughness = .38; if (m.map) m.map = null; } return m; };
window.renderPiece = async ({ id, kind, slot, fid, box }) => {
  let root;
  if (kind === 'fit') { const cat = await load('./art/blender/fittings/' + id + '/' + slot + '.glb'); const c = cat.children.find(n => n.userData && n.userData.fittingId === fid); if (!c) return null; root = c.clone(true); }
  else { root = (await load('./art/blender/' + (id === 'wasp' ? 'wasp-refit' : id) + '.glb')).clone(true); }
  const holder = new T.Group(); holder.add(root); scene.add(holder);
  root.updateMatrixWorld(true);
  if (kind !== 'fit') { const ext = Math.max(...new T.Box3().setFromObject(root).getSize(new T.Vector3()).toArray()); if (ext < 12) holder.scale.setScalar(9.6); }
  const drop = []; root.traverse(o => { if (!o.isMesh) return; o.material = Array.isArray(o.material) ? o.material.map(neutral) : neutral(o.material);
    if (kind !== 'fit') { const s = slotOfObject(o.name.replaceAll('_', ' '), id); if ((kind === 'core' && s) || (kind === 'stock' && s !== slot)) drop.push(o); } });
  for (const o of drop) o.visible = false;
  // hull space: hx = z, hy = -x  ->  camera up = +x, right = +z
  const [x0, y0, x1, y1] = box, w = Math.round((x1 - x0) * ${PPU}), h = Math.round((y1 - y0) * ${PPU});
  cam.left = x0; cam.right = x1; cam.top = -y0; cam.bottom = -y1; cam.updateProjectionMatrix();
  r.setSize(w, h, false); r.clear(); r.render(scene, cam);
  const url = canvas.toDataURL('image/webp', .86);
  scene.remove(holder); return url;
};
// Compare two WebP sprites on colour weighted by opacity (transparent pixels' colour is meaningless).
window.spriteDiff = async (a, b) => {
  const decode = async u => { const im = await createImageBitmap(await (await fetch(u)).blob()), c = new OffscreenCanvas(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, im.width, im.height); };
  const A = await decode(a), B = await decode(b);
  if (A.width !== B.width || A.height !== B.height) return { sized: false };
  let sum = 0, big = 0; const n = A.width * A.height;
  for (let i = 0; i < A.data.length; i += 4) { const aa = A.data[i + 3], ba = B.data[i + 3]; let m = Math.abs(aa - ba);
    for (let k = 0; k < 3; k++) m = Math.max(m, Math.abs(A.data[i + k] * aa - B.data[i + k] * ba) / 255);
    sum += m; if (m > 24) big++; }
  return { sized: true, mean: sum / n, big: big / n };
};
window.ready = true;
</script></body></html>`;

const args = process.argv.slice(2), force = args.includes('--force'), chrome = args.find(a => !a.startsWith('--'))
  || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);   // else Playwright's own Chromium
const MEAN = 4.5, BIG = .06;   // keep the old sprite below these (mean opacity-weighted difference /255, share of pixels >24 apart)
const srv = http.createServer((rq, rs) => {
  const p = decodeURIComponent(rq.url.split('?')[0]);
  if (p === '/__bake.html') { rs.writeHead(200, { 'content-type': 'text/html' }); rs.end(page); return; }
  const f = path.join(root, p); if (!fs.existsSync(f)) { rs.writeHead(404); rs.end(); return; }
  rs.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream' }); fs.createReadStream(f).pipe(rs);
}).listen(0, async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await browser.newPage(); pg.on('pageerror', e => console.error('page', e.message));
  await pg.goto('http://localhost:' + port + '/__bake.html'); await pg.waitForFunction(() => window.ready);
  let total = 0, n = 0, kept = 0;
  const bounds = piece => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const l of piece.body) for (const [x, y] of l) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0 - 1, y0 - 1, x1 + 1, y1 + 1].map(v => +v.toFixed(1)); };
  for (const [id, B] of Object.entries(data)) {
    const dir = path.join(root, 'art', 'combat', id); fs.mkdirSync(dir, { recursive: true });
    const jobs = [['core', B.core, { kind: 'core' }], ...Object.entries(B.stock).map(([slot, p]) => ['stock-' + slot, p, { kind: 'stock', slot }]),
      ...Object.entries(B.fit).map(([fid, p]) => [fid, p, { kind: 'fit', fid, slot: fid[0] === 'e' ? 'engine' : fid[0] === 'w' ? 'wings' : fid[0] === 'm' ? 'mount' : 'plating' }])];
    for (const [name, piece, spec] of jobs) {
      if (!piece) continue;
      const box = bounds(piece), url = await pg.evaluate(a => window.renderPiece(a), { id, box, ...spec });
      if (!url) continue;
      const out = path.join(dir, name + '.webp');
      let buf = Buffer.from(url.split(',')[1], 'base64');
      if (!force && fs.existsSync(out)) {
        const old = fs.readFileSync(out), d = old.equals(buf) ? { sized: true, mean: 0, big: 0 } : await pg.evaluate(([a, b]) => window.spriteDiff(a, b), ['data:image/webp;base64,' + old.toString('base64'), url]);
        if (d.sized && d.mean <= MEAN && d.big <= BIG) { buf = old; kept++; }
      }
      if (!(fs.existsSync(out) && fs.readFileSync(out).equals(buf))) fs.writeFileSync(out, buf);
      piece.img = { src: 'art/combat/' + id + '/' + name + '.webp', box }; total += buf.length; n++;
    }
    console.log(id.padEnd(10), jobs.length, 'sprites');
  }
  fs.writeFileSync(dataFile, src.slice(0, src.indexOf('{')) + JSON.stringify(data) + ';\n');
  console.log('baked', n, 'sprites,', (total / 1024).toFixed(0), 'KB total;', kept, 'unchanged kept as they were (--force to rewrite); updated combat-hulls-v1300.js');
  await browser.close(); srv.close();
});
