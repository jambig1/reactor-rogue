import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import * as T from '../../vendor/three-0.187.0/three.module.js';
import {GLTFLoader} from '../../vendor/three-0.187.0/GLTFLoader.js';
import {buildBlenderShip, hasBlenderShip} from '../../ship3d-blender.js';
import {fittingIds} from '../../ship3d-fittings.js';

const directory = new URL('./',import.meta.url);
const files = (await readdir(directory)).filter(file=>file.endsWith('.glb'));
assert.equal(files.length,12);
const slot = {e:'engine',w:'wings',m:'mount',p:'plating'};
const record = {color:'#58f0c8',trail:'#fc57a8',patternCanvas:{}};
const loader = new GLTFLoader();
const inspect = ship => {
  assert(ship.flames.length>0 && ship.bodyMeshes.length>0 && ship.glowMeshes.length>0);
  const b = new T.Box3().setFromObject(ship.root);
  assert(!b.isEmpty() && [b.min.x,b.max.x,b.min.z,b.max.z].every(Number.isFinite));
  assert(b.min.x < -12 && b.max.x > 12 && b.min.z < -.6 && b.max.z > .75);
  assert(ship.bodyMeshes.some(mesh=>mesh.material.map && mesh.geometry.attributes.uv));
  for (const d of ship.disposables) d.dispose();
};
for (const file of files) {
  const id=file.slice(0,-4).toLowerCase();
  assert(hasBlenderShip(id));
  const bytes = await readFile(new URL(file,directory));
  assert(bytes.byteLength < 2_000_000, `${id} exceeds the two megabyte budget`);
  const {scene} = await loader.parseAsync(Uint8Array.from(bytes).buffer,'');
  if (id !== 'wasp') {
    const meshes=scene.children.filter(o=>o.isMesh);
    assert(meshes.length < 24 && meshes.some(o=>o.name.startsWith('wing')));
  }
  inspect(buildBlenderShip(T,id,scene,record,{}));
  for (const fitting of fittingIds) {
    const model=buildBlenderShip(T,id,scene,record,{[slot[fitting[0]]]:fitting});
    assert(model.root.getObjectByName(fitting),`${id} missing fitting ${fitting}`);
    if (id !== 'wasp' && fitting[0] !== 'p') {
      assert(![...model.bodyMeshes,...model.glowMeshes].some(m=>m.name.startsWith(slot[fitting[0]].replace(/s$/,'')+'_')));
    }
    inspect(model);
  }
  const fitted=buildBlenderShip(T,id,scene,record,
    {engine:'e_nova',wings:'w_phantom',mount:'m_siege',plating:'p_aegis'});
  inspect(fitted);
  console.log(`${id}: ${Math.round(bytes.byteLength/1024)} KiB, stock + 16 individual fittings + full loadout verified`);
}

