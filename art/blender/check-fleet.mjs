import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import * as T from '../../vendor/three-0.187.0/three.module.js';
import {GLTFLoader} from '../../vendor/three-0.187.0/GLTFLoader.js';
import {buildBlenderShip, hasBlenderShip} from '../../ship3d-blender.js';
import {fittingIds} from '../../ship3d-fittings.js';

const directory = new URL('./',import.meta.url);
const files = (await readdir(directory)).filter(file=>file.endsWith('.glb') && file !== 'Wasp.glb');
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
  const id=file === 'wasp-refit.glb' ? 'wasp' : file.slice(0,-4);
  assert(hasBlenderShip(id));
  const bytes = await readFile(new URL(file,directory));
  assert(bytes.byteLength < 2_000_000, `${id} exceeds the two megabyte budget`);
  const {scene} = await loader.parseAsync(Uint8Array.from(bytes).buffer,'');
  const catalog=new Map();
  let largestFittingPack=0;
  for (const name of Object.values(slot)) {
    const fittingBytes=await readFile(new URL(`fittings/${id}/${name}.glb`,directory));
    assert(fittingBytes.byteLength < 1_600_000,`${id} ${name} pack exceeds the download budget`);
    largestFittingPack=Math.max(largestFittingPack,fittingBytes.byteLength);
    const {scene}=await loader.parseAsync(Uint8Array.from(fittingBytes).buffer,'');
    const expected=fittingIds.filter(fitting=>slot[fitting[0]]===name).sort();
    assert.deepEqual(scene.children.map(node=>node.userData.fittingId).sort(),expected);
    catalog.set(name,scene);
  }
  if (id !== 'wasp') {
    const meshes=scene.children.filter(o=>o.isMesh);
    assert(meshes.length < 24 && meshes.some(o=>o.name.startsWith('wing')));
  }
  inspect(buildBlenderShip(T,id,scene,record,{}));
  for (const fitting of fittingIds) {
    const model=buildBlenderShip(T,id,scene,record,{[slot[fitting[0]]]:fitting},catalog);
    const node=model.root.getObjectByName(fitting);
    assert.equal(node?.userData.fittingId,fitting,`${id} missing Blender fitting ${fitting}`);
    assert(node.children.some(child=>child.isMesh && child.geometry.attributes.normal));
    if (fitting[0]==='w') {
      node.updateWorldMatrix(true,true);
      const halves=[new T.Box3(),new T.Box3()];
      const v=new T.Vector3();
      node.traverse(mesh=>{
        if (!mesh.isMesh) return;
        const positions=mesh.geometry.attributes.position;
        for(let i=0;i<positions.count;i++){
          v.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);
          const side=v.y<0?0:1;
          v.y=Math.abs(v.y);
          halves[side].expandByPoint(v);
        }
      });
      for(const limit of ['min','max']){
        assert(halves[0][limit].distanceTo(halves[1][limit])<.035,`${id} ${fitting} ${limit} is asymmetric`);
      }
    }
    if (fitting[0]==='e') {
      assert.equal(model.flames.length,(id==='bastion'||id==='sovereign'||id==='scavenger' ? 3 : 2)*(fitting==='e_twin'?2:1));
      assert(model.flames.every(flame=>flame.x < -16 && flame.r > 0));
    }
    if (id !== 'wasp' && fitting[0] !== 'p') {
      assert(![...model.bodyMeshes,...model.glowMeshes].some(m=>m.name.startsWith(slot[fitting[0]].replace(/s$/,'')+'_')));
    }
    inspect(model);
  }
  const fitted=buildBlenderShip(T,id,scene,record,
    {engine:'e_nova',wings:'w_phantom',mount:'m_siege',plating:'p_aegis'},catalog);
  inspect(fitted);
  console.log(`${id}: ${Math.round(largestFittingPack/1024)} KiB largest slot pack; stock + 16 fittings + full loadout verified`);
}

