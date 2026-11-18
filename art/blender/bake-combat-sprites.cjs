// Render top-down combat sprites of every hull piece and fitting from the hangar Blender models.
// Uses headless Chrome + three.js (no Blender needed). Run after bake-combat.mjs (it reuses its piece bounds):
//   node art/blender/bake-combat-sprites.cjs [path/to/chrome]
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
const loader = new GLTFLoader(), cache = new Map();
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
window.ready = true;
</script></body></html>`;

const srv = http.createServer((rq, rs) => {
  const p = decodeURIComponent(rq.url.split('?')[0]);
  if (p === '/__bake.html') { rs.writeHead(200, { 'content-type': 'text/html' }); rs.end(page); return; }
  const f = path.join(root, p); if (!fs.existsSync(f)) { rs.writeHead(404); rs.end(); return; }
  rs.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream' }); fs.createReadStream(f).pipe(rs);
}).listen(0, async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: process.argv[2] || '/usr/bin/google-chrome', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await browser.newPage(); pg.on('pageerror', e => console.error('page', e.message));
  await pg.goto('http://localhost:' + port + '/__bake.html'); await pg.waitForFunction(() => window.ready);
  let total = 0, n = 0;
  const bounds = piece => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const l of piece.body) for (const [x, y] of l) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0 - 1, y0 - 1, x1 + 1, y1 + 1].map(v => +v.toFixed(1)); };
  for (const [id, B] of Object.entries(data)) {
    const dir = path.join(root, 'art', 'combat', id); fs.mkdirSync(dir, { recursive: true });
    const jobs = [['core', B.core, { kind: 'core' }], ...Object.entries(B.stock).map(([slot, p]) => ['stock-' + slot, p, { kind: 'stock', slot }]),
      ...Object.entries(B.fit).map(([fid, p]) => [fid, p, { kind: 'fit', fid, slot: fid[0] === 'e' ? 'engine' : fid[0] === 'w' ? 'wings' : fid[0] === 'm' ? 'mount' : 'plating' }])];
    for (const [name, piece, spec] of jobs) {
      if (!piece) continue;
      const box = bounds(piece), url = await pg.evaluate(a => window.renderPiece(a), { id, box, ...spec });
      if (!url) continue;
      const buf = Buffer.from(url.split(',')[1], 'base64'); fs.writeFileSync(path.join(dir, name + '.webp'), buf);
      piece.img = { src: 'art/combat/' + id + '/' + name + '.webp', box }; total += buf.length; n++;
    }
    console.log(id.padEnd(10), jobs.length, 'sprites');
  }
  fs.writeFileSync(dataFile, src.slice(0, src.indexOf('{')) + JSON.stringify(data) + ';\n');
  console.log('wrote', n, 'sprites,', (total / 1024).toFixed(0), 'KB total; updated combat-hulls-v1300.js');
  await browser.close(); srv.close();
});
