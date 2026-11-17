import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from './vendor/three-0.187.0/three.module.js';
import {buildVanguard,supportsVanguard} from './vanguard-model.js';
import {createShip3D} from './ship3d-v1100.js';
const stock={engine:'e_stock',wings:'w_stock',mount:'m_stock',plating:'p_stock'};
const key=(id='vanguard',parts=stock)=>JSON.stringify([id,'#65fbd2',parts,'match',1,'']);
assert(supportsVanguard(key())); assert(!supportsVanguard(key('wasp')));
assert(!supportsVanguard(key('vanguard',{...stock,engine:'e_twin'})));
assert(!supportsVanguard('unrecognised'));
const rec={color:'#65fbd2',trail:'#bb9dff'};
let s=buildVanguard(T,rec),triangles=0;
assert.equal(s.root.children.length,13);assert.equal(s.flames.length,2);
s.root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;
  assert([...p.array,...n.array].every(Number.isFinite));
  for(let i=0;i<n.count;i++)assert(Math.abs(Math.hypot(n.getX(i),n.getY(i),n.getZ(i))-1)<.001);
  const ix=o.geometry.index;triangles+=(ix?ix.count:p.count)/3;
  // Every opaque triangle must have positive area. No collapsed nose caps.
  if(!o.material.transparent){let a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
    for(let i=0;i<(ix?ix.count:p.count);i+=3){a.fromBufferAttribute(p,ix?ix.getX(i):i);b.fromBufferAttribute(p,ix?ix.getX(i+1):i+1);c.fromBufferAttribute(p,ix?ix.getX(i+2):i+2);assert(b.sub(a).cross(c.sub(a)).length()>1e-7);}}
});
assert(triangles<15000);const bounds=new T.Box3().setFromObject(s.root);assert(bounds.min.x>-30&&bounds.max.x<30);assert(bounds.min.y>-27&&bounds.max.y<27);
// Check authored fuselage outward normals directly: the top stations face +Z.
const hull=s.bodyMeshes.find(m=>m.material.name==='navy ceramic armour');assert(hull);
let volume=0,p=hull.geometry.attributes.position,a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
for(let i=0;i<p.count;i+=3){a.fromBufferAttribute(p,i);b.fromBufferAttribute(p,i+1);c.fromBufferAttribute(p,i+2);volume+=a.dot(b.cross(c))/6;}assert(volume>0);
let disposed=0;for(const d of s.disposables){d.addEventListener('dispose',()=>disposed++);d.dispose();}assert.equal(disposed,s.disposables.length);
console.log('PASS authored geometry: finite positions/normals, nonzero opaque faces, outward hull volume, bounds, '+triangles+' triangles, 13 meshes, owned-resource disposal');
// Real Three math/geometry, stub GPU transport only. This is not a browser/WebGL test.
let scene;
class Renderer {setClearColor(){} setPixelRatio(){} setSize(){} setRenderTarget(){} setViewport(){} clear(){} dispose(){} render(s,c){s.updateMatrixWorld(true);c.updateMatrixWorld(true);if(s.children.some(o=>o.isGroup))scene=s;}}
class PMREM {fromScene(){return {texture:new T.Texture()}}dispose(){}}
const load=async()=>({...T,WebGLRenderer:Renderer,PMREMGenerator:PMREM});
const fixtures=JSON.parse(fs.readFileSync(new URL('./ship-review-records.json',import.meta.url)));
const model=await createShip3D({addEventListener(){}},load);
for(const f of fixtures){model.setShip(key(f.id),structuredClone(f.rec));for(const [w,h] of [[390,260],[768,340],[1280,440]])for(const yaw of [0,1.57,3.14]){model.resize(w,h,2);model.render({x:w/2,y:h/2,scale:3,yaw,pitch:.4,appear:1,t:1,thrust:.3,bloom:false});assert(model.exhaust.every(e=>Object.values(e).every(v=>typeof v==='boolean'||Number.isFinite(v))));}}
model.setShip(key('vanguard',{...stock,engine:'e_twin'}),structuredClone(fixtures.find(f=>f.id==='vanguard').rec));
model.dispose();console.log('PASS all twelve IDs, three viewport sizes, rotation/projection, non-stock fallback and lifecycle with real Three geometry (GPU mocked)');
if(process.env.EXPORT_GEOMETRY){
  const original=await import('./ship3d-baseline.js');let result={};
  for(const [name,factory] of [['before',original.createShip3D],['after',createShip3D]]){
    const v=await factory({addEventListener(){}},load);v.setShip(key(),structuredClone(fixtures.find(f=>f.id==='vanguard').rec));
    v.resize(800,600,1);v.render({x:400,y:300,scale:5,yaw:0,pitch:0,appear:1,t:0,thrust:0,bloom:false});
    let meshes=[];scene.traverse(o=>{if(!o.isMesh||!o.geometry||Array.isArray(o.material))return;let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry,p=g.attributes.position,n=g.attributes.normal||(g.computeVertexNormals(),g.attributes.normal),verts=[],norms=[],nv=new T.Vector3(),pv=new T.Vector3(),nm=new T.Matrix3().getNormalMatrix(o.matrixWorld);for(let i=0;i<p.count;i++){pv.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);nv.fromBufferAttribute(n,i).applyMatrix3(nm).normalize();verts.push(...pv);norms.push(...nv);}meshes.push({positions:verts,normals:norms,color:o.material.color.toArray(),emissive:o.material.isMeshBasicMaterial,opacity:o.material.opacity});if(g!==o.geometry)g.dispose();});result[name]=meshes;v.dispose();
  }fs.writeFileSync('vanguard-geometry-review.json',JSON.stringify(result));
}
