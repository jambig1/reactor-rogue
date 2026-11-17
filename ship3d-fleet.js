import {buildFitting} from './ship3d-fittings.js';
export const fleetProfiles={
 wasp:{length:30,width:15,depth:2.5,wing:'dart',engines:1},
 bastion:{length:23,width:24,depth:6,wing:'block',engines:3},
 harrier:{length:25,width:19,depth:3,wing:'fork',engines:2},
 glacier:{length:25,width:21,depth:4,wing:'diamond',engines:2},
 tempest:{length:28,width:23,depth:2.8,wing:'crescent',engines:2},
 scavenger:{length:23,width:24,depth:4.5,wing:'industrial',engines:3},
 spectre:{length:33,width:17,depth:2,wing:'stealth',engines:2},
 architect:{length:21,width:23,depth:4,wing:'gantry',engines:2},
 helios:{length:28,width:23,depth:3.2,wing:'solar',engines:2},
 echo:{length:24,width:23,depth:3.5,wing:'resonator',engines:2},
 sovereign:{length:32,width:29,depth:5.5,wing:'royal',engines:3}
};
export function buildFleetShip(T,id,rec,parts={}){
 const p=fleetProfiles[id];if(!p)throw Error('Unknown airframe '+id);
 const root=new T.Group(),owned=new Set(),bodyMeshes=[],glowMeshes=[],flames=[];root.name=id+' authored airframe';
 const mat=(c,m=.65,r=.4)=>{const a=new T.MeshStandardMaterial({color:c,metalness:m,roughness:r});owned.add(a);return a;};
 const hull=mat('#25394c'),dark=mat('#0b1724'),steel=mat('#52697a',.8,.3),glass=mat('#123e59',.35,.1);
 const neon=new T.MeshBasicMaterial({color:new T.Color(rec.color).multiplyScalar(2),toneMapped:false});owned.add(neon);
 if(rec.patternCanvas){const tex=new T.CanvasTexture(rec.patternCanvas);tex.colorSpace=T.SRGBColorSpace;owned.add(tex);hull.map=tex;hull.color.set('#ffffff');}
 const mesh=(g,m,x=0,y=0,z=0)=>{owned.add(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);root.add(o);(m===neon?glowMeshes:bodyMeshes).push(o);return o;};
 const box=(x,y,z,a,b,c,m=hull)=>mesh(new T.BoxGeometry(a,b,c),m,x,y,z);
 const plate=(pts,z,d,m=hull)=>{const sh=new T.Shape();pts.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:.35,bevelThickness:.3,bevelSegments:1,steps:1});if(m===hull&&rec.patternCanvas){const a=g.attributes.position,uv=[];for(let i=0;i<a.count;i++)uv.push((-a.getY(i)+40)/80,(a.getX(i)+40)/80);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));}return mesh(g,m,0,0,z);};
 const tube=(x,y,z,r,l,m=steel)=>{const o=mesh(new T.CylinderGeometry(r,r,l,16),m,x,y,z);o.rotation.z=Math.PI/2;return o;};
 const ring=(x,y,z,r,m=neon)=>{const o=mesh(new T.TorusGeometry(r,.2,6,24),m,x,y,z);o.rotation.y=Math.PI/2;return o;};
 const L=p.length,W=p.width,D=p.depth;
 // Station-built volumes: full dorsal and ventral surfaces, with crisp chines.
 function body(stations,y=0,z=0,m=hull){
  const pos=[],ix=[];for(const [x,w,h,down]of stations)for(const [yy,zz]of [[-.6*w,h],[.6*w,h],[w,h*.4],[w,-down*.4],[.6*w,-down],[-.6*w,-down],[-w,-down*.4],[-w,h*.4]])pos.push(x,yy+y,zz+z);
  for(let j=0;j<stations.length-1;j++)for(let k=0;k<8;k++){let q=j*8+k,n=j*8+(k+1)%8;ix.push(q,n+8,n,q,q+8,n+8);}
  for(let k=1;k<7;k++){ix.push(0,k,k+1);let n=(stations.length-1)*8;ix.push(n,n+k+1,n+k);}
  let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(ix);let flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();
  if(m===hull&&rec.patternCanvas){let p=flat.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push((-p.getY(i)+40)/80,(p.getX(i)+40)/80);flat.setAttribute('uv',new T.Float32BufferAttribute(uv,2));}return mesh(flat,m);
 }
 const orb=(x,y,z,r,m=neon)=>mesh(new T.IcosahedronGeometry(r,1),m,x,y,z);
 const hoop=(x,y,z,r,m=steel)=>mesh(new T.TorusGeometry(r,.35,8,32),m,x,y,z);
 const canopy=(x,y,z,len,w)=>{body([[x-len*.5,w*.6,.6,.4],[x-len*.15,w,2.7,.4],[x+len*.4,w*.6,2,.3],[x+len*.5,.4,.4,.2]],y,z,steel);body([[x-len*.4,w*.45,.5,.2],[x-len*.1,w*.82,2.4,.2],[x+len*.35,w*.45,1.8,.2]],y,z+.5,glass);};
 const wing=(side,pts,z,d)=>{if(!parts.wings||parts.wings==='w_stock')plate(pts.map(([x,y])=>[x,side*y]),z,d);};
 const gun=(x,y,z,r,len)=>{if(parts.mount&&parts.mount!=='m_stock')return;body([[x-5,2,2,1],[x+2,2.2,1.8,1],[x+4,1,1,.6]],y,z,dark);tube(x+len*.45,y,z,r,len);ring(x+len*.95,y,z,r,steel);};
 if(id==='wasp'){
  // Interceptor: continuous tapered body, shoulder intakes and twin underslung drives.
  body([[-27,2.3,1.9,1.8],[-22,4.1,3.1,2.4],[-13,5.6,4.5,3.1],[-2,5.3,5.6,3],[9,4.1,4.8,2.3],[21,2.5,2.7,1.5],[31,.35,.55,.35]]);
  body([[-23,1.8,.8,1],[-8,3.4,1,2],[13,2,.7,1.3],[26,.4,.3,.3]],0,-2.1,dark);
  // The canopy rises from a broad sill and tapers into the nose, rather than floating above it.
  body([[-6,3.3,.8,.5],[0,4,1.3,.5],[10,3,1,.4],[17,1.4,.4,.3]],0,4.6,steel);
  body([[-5,2.7,.6,.4],[0,3.35,3.1,.4],[7,2.8,3.2,.3],[13,1.4,1.6,.2],[16,.4,.4,.2]],0,5.2,glass);
  const seam=(points,r=.12)=>{for(let k=1;k<points.length;k++){const a=new T.Vector3(...points[k-1]),b=new T.Vector3(...points[k]),d=b.clone().sub(a),g=new T.CylinderGeometry(r,r,d.length(),6);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));g.translate(...a.add(b).multiplyScalar(.5));mesh(g,neon);}};
  for(const side of [-1,1]){
   // Broad wing roots physically connect the nacelles and outer wings to the body.
   body([[-20,2,1.6,1.5],[-12,3.3,2.2,1.7],[0,3.6,1.6,1.4],[10,1.5,.8,.7]],side*7,-.4,steel);
   body([[-25,1.8,2,2],[-20,3.2,3.3,2.7],[-9,3.3,3.7,2.9],[0,2.6,2.7,2],[7,1.1,1.1,1]],side*8,-.6);
   // Dark inset intake with a metal lip, supported by the front of the drive housing.
   tube(4.8,side*8,.2,1.65,1.2,dark);ring(5.5,side*8,.2,1.7,steel);ring(5.6,side*8,.2,1.1);
   if(!parts.wings||parts.wings==='w_stock'){
    wing(side,[[-22,7],[-26,19],[-21,22],[-12,17],[8,8]],-.9,1.1);
    plate([[-21,side*9],[-23,side*18],[-20,side*19],[-8,side*12],[3,side*8]],.6,.45,steel);
    seam([[-24,side*19,1],[-21,side*21,1],[-12,side*16,1],[4,side*8,1]],.15);
    const fin=plate([[-23,0],[-21,7],[-17,5.5],[-12,0]],0,.5,dark);fin.rotateX(Math.PI/2);fin.position.set(0,side*7.5,2.5);
    seam([[-21,side*7.5,9.4],[-17,side*7.5,7.8]],.13);
   }
   for(let k=0;k<5;k++){box(-18+k*1.6,side*8,3.3,.55,3.5,.4,dark);box(-18+k*1.6,side*8,3.55,.3,2.4,.12,steel);}
   gun(7,side*12,1.2,.48,15);
   seam([[-19,side*10.5,1],[-9,side*11,1.4],[1,side*9.5,1.1]],.13);
   seam([[-4,side*2.8,6],[0,side*3.4,7.9],[7,side*2.9,8.1],[13,side*1.5,6.9]],.11);
   seam([[16,side*1.6,3.6],[23,side*.9,2],[28,side*.4,1.1]],.1);
  }
  // Dorsal service spine, heat vents and small navigation lamps.
  body([[-24,1.3,1,.4],[-17,2.1,1.4,.4],[-8,2,.8,.3]],0,4.2,dark);
  for(let k=0;k<4;k++)box(-20+k*2,0,5.7,.7,2.5,.2,steel);
  box(-11,0,5.3,2,1.5,.18,neon);box(23,0,2.65,1,.7,.2,neon);
 }else if(id==='bastion'){
  body([[-22,9,4,4],[-14,15,8,5],[4,15,9,5],[18,11,6,4],[24,7,3,2]]);
  canopy(12,0,7,9,3.7);
  for(const side of [-1,1]){body([[-20,4,4,3],[-12,6,7,4],[10,6,6,4],[18,3,3,2]],side*17,0);wing(side,[[-20,10],[-19,25],[14,24],[20,11]],0,3);for(let k=0;k<4;k++)box(-13+k*6,side*17,7.4,4,7,1,steel);gun(1,side*12,9,1.6,23);box(-9,side*13,8.5,7,.5,.3,neon);}
 }else if(id==='harrier'){
  body([[-23,4,3,2],[-10,7,5,3],[5,6,4,2],[22,2,2,1]]);
  canopy(5,0,4,10,3);
  for(const side of [-1,1]){body([[-18,3,3,2],[0,4,4,2],[24,2.3,3,2],[29,1,1,1]],side*11,0);wing(side,[[-18,4],[-18,19],[0,14],[9,5]],-1,1.4);for(let k=0;k<3;k++)gun(13,side*11+(k-1)*1.3,3,.65,11);box(9,side*13,3,12,.3,.3,neon);}
 }else if(id==='glacier'){
  body([[-22,5,4,3],[-9,10,7,4],[7,9,6,4],[25,1,1,1]]);
  canopy(9,0,6,9,3);
  const ice=mat('#79adc9',.35,.2);
  for(const side of [-1,1]){body([[-17,2,2,2],[-6,5,5,3],[6,3,3,2]],side*13,0,steel);wing(side,[[-18,7],[-2,25],[12,9],[0,13]],-1,2);for(let k=0;k<3;k++){const o=mesh(new T.ConeGeometry(2,8+k*2,5),ice,-13+k*6,side*10,7);o.rotation.x=side*.35;}gun(10,side*8,3,.9,10);}
  hoop(-8,0,8,5);orb(-8,0,8,2.3);
 }else if(id==='tempest'){
  body([[-23,3,2,2],[-8,6,5,3],[7,4,4,2],[28,.5,.6,.4]]);canopy(9,0,4,11,2.5);
  for(const side of [-1,1]){body([[-15,2,2,2],[-5,4,4,3],[8,2,2,2]],side*15,0,dark);wing(side,[[-21,4],[-24,23],[-9,18],[14,24],[7,7]],-1,1.3);const o=hoop(-4,side*15,5,5.5);o.rotation.x=side*.5;hoop(-4,side*15,5,4,neon);orb(-4,side*15,5,1.7);}
 }else if(id==='scavenger'){
  body([[-24,8,4,4],[-12,10,6,5],[6,9,5,4],[20,5,3,2]]);
  canopy(8,-4,5,10,3);
  body([[-19,5,4,3],[-8,6,6,4],[7,5,5,3]],-16,0,dark);
  body([[-17,3,3,2],[-4,4,4,3],[12,2,2,1]],15,0,steel);
  for(const side of [-1,1]){wing(side,[[-20,7],[-18,24],[4,24],[12,9]],-2,2);for(let k=0;k<4;k++)box(-15+k*4,side*16,6,1,7,.6,steel);}
  box(10,18,2,15,3,3,steel);box(17,15,2,3,9,3,steel);gun(6,12,5,2,14);
 }else if(id==='spectre'){
  body([[-26,4,1.5,2],[-10,7,3,3],[6,5,3.8,2],[33,.2,.25,.2]]);
  canopy(13,0,3.2,15,2.1);
  for(const side of [-1,1]){wing(side,[[-26,4],[-29,19],[8,8],[24,2]],-.8,.8);body([[-24,1.5,2,1],[-15,2,4,1],[-5,.5,1,.4]],side*6,2,dark);box(-12,side*8,2.7,12,.18,.15,neon);gun(11,side*4,1,.4,18);}
 }else if(id==='architect'){
  for(const side of [-1,1]){body([[-22,4,4,3],[-12,5,6,4],[12,5,6,4],[22,3,3,2]],side*16,0);for(const x of [-14,12]){box(x,side*10,0,5,14,3,steel);box(x,side*17,7,6,6,3,dark);hoop(x,side*17,9,2.5,neon);orb(x,side*17,9,1);}}
  body([[-10,5,3,3],[0,7,6,4],[15,5,4,3],[22,2,2,1]],0,3);canopy(8,0,8,9,3);
  for(const side of [-1,1])wing(side,[[-20,12],[-20,24],[19,24],[19,20],[-12,20],[-12,12]],-2,1.5);
 }else if(id==='helios'){
  body([[-23,4,4,3],[-10,7,6,4],[8,5,4,3],[28,.5,.6,.5]]);canopy(12,0,4,10,2.5);
  const copper=mat('#73503b',.8,.32);hoop(-9,0,7,6,copper);hoop(-9,0,7,4.7,neon);orb(-9,0,7,2.5);
  for(const side of [-1,1]){wing(side,[[-22,5],[-13,24],[14,19],[7,7]],-1,1);for(let k=0;k<5;k++){const o=box(-16+k*5,side*13,2+k*.3,2,12,1,copper);o.rotation.x=side*.22;box(-16+k*5,side*13,3+k*.3,.4,10,.2,neon);}gun(7,side*7,2,.8,11);}
 }else if(id==='echo'){
  body([[-23,3,3,3],[-8,7,6,4],[9,5,5,3],[24,2,2,1]]);canopy(11,0,5,9,3);
  for(const side of [-1,1]){body([[-10,3,3,3],[0,7,6,5],[10,3,3,3]],side*16,0,dark);box(0,side*8,1,10,12,3,steel);for(let k=0;k<3;k++)hoop(0,side*16,5+k*.8,7-k*1.5,k===1?neon:steel);orb(0,side*16,6,2);wing(side,[[-18,5],[-14,24],[4,25],[12,7]],-2,1.4);}
 }else if(id==='sovereign'){
  body([[-30,6,5,4],[-18,11,9,6],[1,10,10,5],[18,6,6,3],[34,.7,1,.5]]);
  canopy(18,0,6,12,3);
  const gold=mat('#aa8756',.85,.32);
  for(const side of [-1,1]){body([[-25,4,4,3],[-12,5,7,4],[12,4,5,3],[24,1,1,1]],side*20,0,dark);wing(side,[[-28,7],[-26,28],[20,30],[12,19],[25,8]],-2,2);for(let k=0;k<3;k++){body([[-22+k*10,1.5,1,1],[-18+k*10,2,8-k,1],[-13+k*10,.5,2,1]],side*12,5,gold);}box(-8,side*13,7,17,.3,.3,neon);}
  hoop(-12,0,11,8,gold);hoop(-12,0,11,6,neon);orb(-12,0,11,3);
 }
 let nozzles=[];
 if(parts.engine&&parts.engine!=='e_stock'){}else for(let i=0;i<(id==='wasp'?2:p.engines);i++){const y=id==='wasp'?(i===0?-8:8):(i-(p.engines-1)/2)*9;box(-L*.8,y,0,7,5,4);tube(-L*.9,y,0,2.2,4);ring(-L*.9-2,y,0,1.8);nozzles.push({x:-L*.9-2.2,y,z:0,r:1.6});}
 for(const [slot,pid]of Object.entries(parts))if(pid&&!pid.endsWith('_stock')){const a=buildFitting(T,pid,{color:rec.color,width:W*.55,tail:-L*.9,shipId:id});root.add(a.root);a.root.traverse(o=>{if(o.isMesh)(o.material.isMeshBasicMaterial?glowMeshes:bodyMeshes).push(o);});owned.add({dispose:a.dispose});if(slot==='engine')nozzles=a.nozzles;}
 const fm=new T.MeshBasicMaterial({color:rec.trail||rec.color,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});owned.add(fm);
 for(const n of nozzles){const outer=mesh(new T.ConeGeometry(n.r,1,12,1,true),fm,n.x,n.y,n.z),inner=mesh(new T.ConeGeometry(n.r*.45,1,10,1,true),neon,n.x,n.y,n.z);outer.rotation.z=inner.rotation.z=Math.PI/2;bodyMeshes.splice(bodyMeshes.indexOf(outer),1);glowMeshes.push(outer);flames.push({...n,outer,inner});}
 return {root,bodyMeshes,glowMeshes,flames,disposables:[...owned]};
}
