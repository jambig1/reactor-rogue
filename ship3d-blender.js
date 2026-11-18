import { buildFitting, fittingIds } from './ship3d-fittings.js';
import { finishFitting } from './ship3d-fitting-finish.js';

const unitScale = 9.6;
const models = new Set(['vanguard','wasp','bastion','harrier','glacier','tempest','scavenger','spectre','architect','helios','echo','sovereign']);
const assets = new Map();
const fittingAssets = new Map();
export const hasBlenderShip = id => models.has(id);
export const fittingSlots = parts => Object.entries(parts).filter(([,id]) => fittingIds.includes(id)).map(([slot]) => slot);

function loadScene(url) {
  return import('./vendor/three-0.187.0/GLTFLoader.js')
    .then(({ GLTFLoader }) => new GLTFLoader().loadAsync(new URL(url, import.meta.url).href))
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
            material.emissive.lerp(trim, .16);
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
