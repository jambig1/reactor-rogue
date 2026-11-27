import { buildFitting, fittingIds } from './ship3d-fittings.js';
import { finishFitting } from './ship3d-fitting-finish.js';

const unitScale = 9.6;
const models = new Set(['vanguard','wasp','bastion','harrier','glacier','tempest','scavenger','spectre','architect','helios','echo','sovereign']);
const assets = new Map();
const fittingAssets = new Map();
export const hasBlenderShip = id => models.has(id);
export const fittingSlots = parts => Object.entries(parts).filter(([,id]) => fittingIds.includes(id)).map(([slot]) => slot);

// Hull and fitting models are meshopt-compressed (EXT_meshopt_compression) by art/blender/bake-ships.mjs.
function loadScene(url) {
  return Promise.all([import('./vendor/three-0.187.0/GLTFLoader.js'), import('./vendor/three-0.187.0/meshopt_decoder.module.js')])
    .then(([{ GLTFLoader }, { MeshoptDecoder }]) => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(new URL(url, import.meta.url).href))
    .then(({ scene }) => scene);
}

export function loadBlenderShip(id) {
  if (!assets.has(id)) {
    assets.set(id, loadScene(`./art/blender/${id === 'wasp' ? 'wasp-refit' : id}.glb`)
      .catch(error => {
        assets.delete(id);
        throw error;
      }));
  }
  return assets.get(id);
}

export function loadBlenderFittings(id, slot) {
  const key = id + '/' + slot;
  if (!fittingAssets.has(key)) {
    fittingAssets.set(key, loadScene(`./art/blender/fittings/${key}.glb`).catch(error => {
      fittingAssets.delete(key);
      throw error;
    }));
  }
  return fittingAssets.get(key);
}

// Which fitting slot a hull piece belongs to (shared with art/blender/bake-combat.mjs). null = core hull.
export function slotOfObject(name, id) {
  if (id !== 'wasp') {
    const [role] = name.split(' ');
    return role === 'engine' ? 'engine' : role === 'wing' ? 'wings' : role === 'mount' ? 'mount' : null;
  }
  if (/^(Outer nozzle|Nozzle throat|Reactor emitter|Nozzle collar)/.test(name)) return 'engine';
  if (/^(Swept wing spar|Carbon slat|Stabiliser|Wing tracer|Squadron marking|Wing access hatch|Airbrake hinge|Underside wing service cover|Underside guidance trace)/.test(name)) return 'wings';
  if (/^(Long.range pulse cannon|Gun pylon)/.test(name)) return 'mount';
  return null;
}
const stockPart = { engine: 'e_stock', wings: 'w_stock', mount: 'm_stock' };
function replacedByPart(name, parts, id) {
  const slot = slotOfObject(name, id);
  return !!(slot && parts[slot] && parts[slot] !== stockPart[slot]);
}

// Any other Blender asset (e.g. the hangar repair bot).
export const loadBlenderAsset = url => loadScene(url);

export function buildBlenderShip(T, id, template, record, parts, catalog) {
  const root = new T.Group();
  root.name = id + ' — Blender airframe';
  const airframe = template.clone(true);
  // glTF is Y-up, whereas the hangar models use Blender's Z-up and +X nose.
  airframe.rotation.x = Math.PI / 2;
  if (id === 'wasp') airframe.scale.setScalar(unitScale);
  root.add(airframe);
  root.updateMatrixWorld(true);
  const disposables = [];
  const bodyMeshes = [], glowMeshes = [], flames = [];
  const trim = new T.Color(record.color || '#69f5e1');
  const exhaust = new T.Color(record.trail || trim);
  const paint = record.patternCanvas ? new T.CanvasTexture(record.patternCanvas) : null;
  if (paint) {
    paint.colorSpace = T.SRGBColorSpace;
    disposables.push(paint);
  }
  const remove = [], materials = new Map();
  const projected = new T.Vector3();
  let outlets = [];
  airframe.traverse(object => {
    if (object.userData.outletRadius) {
      projected.setFromMatrixPosition(object.matrixWorld);
      outlets.push({ x:projected.x, y:projected.y, z:projected.z, r:object.userData.outletRadius });
    }
    if (!object.isMesh) return;
    // Blender sanitises node names on import. The prefixes are invariant.
    if (replacedByPart(object.name.replaceAll('_', ' '), parts, id)) {
      remove.push(object);
      return;
    }
    const source = object.material;
    let material = materials.get(source);
    if (!material) {
      material = source.clone();
      materials.set(source, material);
      disposables.push(material);
      if (['Wasp teal guidance lights','Hull guidance'].includes(source.name)) {
        material.emissive.copy(trim);
        material.emissiveIntensity = 2.25;
        material.toneMapped = false;
      }
      if (paint && ['Midnight ceramic','Hull paint'].includes(source.name)) {
        material.map = paint;
        material.color.set(0xffffff);
      }
    }
    object.material = material;
    if (paint && material.map === paint) {
      const geometry = object.geometry.clone();
      const position = geometry.attributes.position;
      const uv = [];
      for (let i = 0; i < position.count; i++) {
        projected.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld);
        uv.push((40 - projected.y) / 80, (40 + projected.x) / 80);
      }
      geometry.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
      object.geometry = geometry;
      disposables.push(geometry);
    }
    (material.emissiveIntensity && material.emissive?.getHex() ? glowMeshes : bodyMeshes).push(object);
  });
  for (const object of remove) object.removeFromParent();

  if (id === 'wasp') outlets = [-1, 1].map(side => ({ x: -3.346 * unitScale, y: side * .87 * unitScale, z: -.09 * unitScale, r: 1.5 }));
  const width = outlets.reduce((maximum, {y}) => Math.max(maximum, Math.abs(y)), 0) || 8;
  const tail = outlets.reduce((minimum, {x}) => Math.min(minimum, x), 0) + 4;
  for (const [slot, partId] of Object.entries(parts)) {
    if (!fittingIds.includes(partId)) continue;
    const source = catalog?.get(slot)?.children.find(node => node.userData.fittingId === partId);
    if (source) {
      const fitting = source.clone(true);
      fitting.name = partId;
      fitting.rotation.x = Math.PI / 2;
      root.add(fitting);
      fitting.updateWorldMatrix(true, true);
      const nozzles = [];
      fitting.traverse(object => {
        if (object.userData.outletRadius) {
          projected.setFromMatrixPosition(object.matrixWorld);
          nozzles.push({x:projected.x, y:projected.y, z:projected.z, r:object.userData.outletRadius});
        }
        if (!object.isMesh) return;
        if (object.material.emissive?.getHex()) {
          let material = materials.get(object.material);
          if (!material) {
            material = object.material.clone();
            if (record.accent) material.emissive.set(record.accent); else material.emissive.lerp(trim, .16);
            material.toneMapped = false;
            materials.set(object.material, material);
            disposables.push(material);
          }
          object.material = material;
          glowMeshes.push(object);
        } else bodyMeshes.push(object);
      });
      if (slot === 'engine' && nozzles.length) outlets = nozzles;
      continue;
    }
    const base = buildFitting(T, partId, { color: record.color, width, tail, shipId: id });
    const fitting = finishFitting(T, base, partId, record.color);
    root.add(fitting.root);
    fitting.root.traverse(mesh => {
      if (mesh.isMesh) (mesh.material.isMeshBasicMaterial ? glowMeshes : bodyMeshes).push(mesh);
    });
    disposables.push(fitting);
    if (slot === 'engine') outlets = fitting.nozzles;
  }
  // v1.7 cosmetic finish. Painted panels take the hull colour at a depth that suits the finish; every other
  // surface follows the finish's sheen, so the five finishes read as genuinely different paint jobs.
  const finishes = {
    gloss:  { paint: .75, metal: .3, rough: .08, env: 1.9, body: [.7, .16], tint: 0 },
    satin:  { paint: .32, metal: .5, rough: .55, env: .8, body: [.6, .5], tint: -.15, grey: .3 },
    matte:  { paint: .16, metal: .02, rough: .96, env: .2,  body: [.05, .95], tint: -.45 },
    chrome: { paint: null, metal: 1,  rough: .05, env: 2.4, body: [1, .1], tint: .45 },
  };
  const f = finishes[record.finish];
  if (f) {
    const hull = new T.Color(record.color || '#69f5e1'), chrome = new T.Color('#dfe7ee'), grey = new T.Color('#9aa6b2'), black = new T.Color('#06080c');
    const seen = new Set();
    for (const mesh of bodyMeshes) {
      const m = mesh.material;
      if (!m || seen.has(m) || !('metalness' in m) || (m.transparent && m.opacity < .9)) continue;
      seen.add(m);
      const painted = /hull paint|midnight ceramic/i.test(m.name || '');
      if (painted) {
        if (f.paint === null) m.color.copy(chrome);
        else m.color.copy(hull).multiplyScalar(f.paint).lerp(black, record.finish === 'matte' ? .55 : 0).lerp(grey, f.grey || 0);
        m.metalness = f.metal; m.roughness = f.rough; m.envMapIntensity = f.env;
      } else {
        m.metalness = f.body[0]; m.roughness = f.body[1]; m.envMapIntensity = f.env;
        if (f.tint > 0) m.color.lerp(grey, f.tint); else if (f.tint < 0) m.color.lerp(black, -f.tint);
      }
    }
  }
  // Squadron markings: real decals laid on the top surface of the hull, one either side of the spine.
  if (record.decalCanvas) {
    root.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(root), size = box.getSize(new T.Vector3()), axes = ['x', 'y', 'z'];
    const upAxis = axes.reduce((a, b) => size[a] < size[b] ? a : b), lon = axes.reduce((a, b) => size[a] > size[b] ? a : b), lat = axes.find(a => a !== upAxis && a !== lon);
    const tex = new T.CanvasTexture(record.decalCanvas); tex.colorSpace = T.SRGBColorSpace;
    const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4 });
    const geo = new T.PlaneGeometry(1, 1), ray = new T.Raycaster(), down = new T.Vector3(), centre = box.getCenter(new T.Vector3());
    down[upAxis] = record.decalUp ? -record.decalUp : -1;
    for (const side of [-1, 1]) {
      const from = centre.clone(); from[lat] += side * size[lat] * (record.decalSpread || .2); from[lon] -= size[lon] * .06; from[upAxis] = down[upAxis] < 0 ? box.max[upAxis] + 5 : box.min[upAxis] - 5;
      ray.set(from, down);
      const hit = ray.intersectObjects(bodyMeshes, false)[0];
      if (!hit) continue;
      const d = new T.Mesh(geo, mat);
      d.scale.setScalar(Math.min(size[lat], size[lon]) * .15);
      d.position.copy(hit.point).addScaledVector(down, -.06);
      d.lookAt(d.position.clone().addScaledVector(down, -1));
      root.add(d); glowMeshes.push(d);
    }
    disposables.push(tex, mat, geo);
  }
  const flare = new T.MeshBasicMaterial({ color: exhaust, transparent: true, opacity: .55, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
  const core = new T.MeshBasicMaterial({ color: trim, toneMapped: false });
  disposables.push(flare, core);
  for (const outlet of outlets) {
    const { x, y, z, r } = outlet;
    const outer = new T.Mesh(new T.ConeGeometry(r, 1, 12, 1, true), flare);
    const inner = new T.Mesh(new T.ConeGeometry(r * .45, 1, 10, 1, true), core);
    for (const mesh of [outer, inner]) {
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(x, y, z);
      root.add(mesh);
      glowMeshes.push(mesh);
      disposables.push(mesh.geometry);
    }
    flames.push({ ...outlet, outer, inner });
  }
  return { root, bodyMeshes, glowMeshes, flames, disposables };
}
