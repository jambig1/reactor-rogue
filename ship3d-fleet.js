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
 plate([[-L*.8,-W*.32],[-L*.9,0],[-L*.8,W*.32],[L*.35,W*.3],[L,0],[L*.35,-W*.3]],-D*.5,D,dark);
 plate([[-L*.7,-W*.26],[-L*.75,W*.26],[L*.25,W*.25],[L*.95,0],[L*.25,-W*.25]],D*.2,D*.65);
 for(const side of [-1,1]){
  const w=W, shapes={
   dart:[[-L*.7,4],[-L*.9,w],[L*.1,w*.45],[L*.5,4]],
   block:[[-L*.8,5],[-L*.8,w],[L*.5,w],[L*.7,7]],
   fork:[[-L*.7,5],[-L*.8,w],[L*.8,w*.8],[L*.9,w*.55],[0,7]],
   diamond:[[-L*.8,5],[0,w],[L*.7,6],[0,w*.45]],
   crescent:[[-L*.85,5],[-L*.9,w],[0,w*.65],[L*.65,w],[L*.25,7]],
   industrial:[[-L*.8,5],[-L*.8,w],[L*.35,w],[L*.4,8]],
   stealth:[[-L*.8,4],[-L*.9,w],[L*.8,4]],
   gantry:[[-L*.8,5],[-L*.8,w],[L*.8,w],[L*.8,w*.65],[-L*.4,w*.65],[-L*.4,5]],
   solar:[[-L*.8,4],[-L*.4,w],[L*.65,w*.85],[L*.2,6]],
   resonator:[[-L*.65,5],[-L*.5,w],[L*.5,w],[L*.7,6]],
   royal:[[-L*.85,5],[-L*.9,w*.85],[L*.65,w],[L*.35,w*.65],[L*.8,9]]
  };
  if(!parts.wings||parts.wings==='w_stock')plate(shapes[p.wing].map(([x,y])=>[x,side*y]),-1,1.6);
  box(-L*.25,side*W*.45,0,L*.9,4,D,steel);
  box(-L*.2,side*W*.45,D*.65,L*.55,.35,.3,neon);
  for(let k=0;k<4;k++)box(-L*.55+k*2,side*W*.45,D*.65+1,.6,3,.4,dark);
  if(!parts.mount||parts.mount==='m_stock'){box(L*.1,side*W*.48,D*.3,7,3,2);tube(L*.35,side*W*.48,D*.5,.65,8);ring(L*.35+4,side*W*.48,D*.5,.6,steel);}
 }
 plate([[-2,-2.8],[-4,0],[-2,2.8],[L*.5,0]],D,1.7,steel);
 plate([[0,-2],[0,2],[L*.42,0]],D+1.8,1.1,glass);
 box(1,0,D+3,1.4,.5,.2,neon);
 if(['echo','sovereign'].includes(id)){const o=mesh(new T.TorusGeometry(id==='echo'?6:8,.8,8,32),steel,-L*.35,0,D);mesh(new T.CylinderGeometry(3,3,1,24),neon,-L*.35,0,D).rotation.x=Math.PI/2;}
 if(id==='architect')for(const x of [-L*.65,L*.55])for(const side of [-1,1]){box(x,side*W*.8,2,6,6,4);box(x,side*W*.8,4.2,2,2,.3,neon);}
 if(id==='helios')for(const side of [-1,1])for(let k=0;k<5;k++)box(-L*.3+k*3,side*W*.7,1.2,.5,5,.2,neon);
 if(id==='scavenger'){box(-4,-W*.7,3,12,7,5,dark);box(-4,-W*.7,5.6,9,4,.3,steel);}
 // Class-specific structures, independent of optional fitting assemblies.
 const orb=(x,y,z,r,m=neon)=>mesh(new T.IcosahedronGeometry(r,1),m,x,y,z);
 const hoop=(x,y,z,r,m=steel)=>mesh(new T.TorusGeometry(r,.35,8,32),m,x,y,z);
 if(id==='wasp'){
  plate([[L*.9,0],[L*.25,-3],[L*.05,0],[L*.25,3]],D*.8,1.2,steel);
  for(const side of [-1,1]){plate([[-L*.6,side*5],[-L*.85,side*12],[-L*.55,side*10],[L*.25,side*5]],2,1,dark);
   box(-L*.45,side*6,3,12,.35,.25,neon);tube(L*.45,side*4,2,.45,12);}
 }
 if(id==='bastion'){
  for(const side of [-1,1]){plate([[-20,side*7],[-18,side*16],[8,side*16],[16,side*7]],3,4.2);
   for(let k=0;k<4;k++){box(-14+k*6,side*12,7.5,4.7,6,.65,steel);box(-14+k*6,side*14,8,2,.4,.2,neon);}
   box(4,side*9,8,8,5,3,dark);tube(14,side*9,9,1.35,18);ring(23,side*9,9,1.25,steel);}
  box(-8,0,7,9,9,3,dark);for(let k=0;k<5;k++)box(-11+k*1.5,0,8.7,.5,7,.3,steel);
 }
 if(id==='harrier'){
  for(const side of [-1,1]){plate([[4,side*6],[23,side*12],[25,side*9],[9,side*4]],2,2.2,steel);
   box(12,side*8,4.5,10,.4,.25,neon);box(-9,side*9,4,10,5,2,dark);
   for(let k=0;k<3;k++)tube(10,side*7+(k-1)*1.2,3,.6,10);}
 }
 if(id==='glacier'){
  const ice=new T.MeshPhysicalMaterial({color:'#9edfff',metalness:.2,roughness:.16,transparent:true,opacity:.68,emissive:'#2f7299',emissiveIntensity:.2});owned.add(ice);
  for(const side of [-1,1]){plate([[-15,side*6],[-2,side*17],[12,side*6],[-2,side*10]],3,2,steel);
   for(let k=0;k<3;k++){const o=mesh(new T.ConeGeometry(2-k*.25,7+k,5),ice,-10+k*7,side*(9+k),5);o.rotation.x=side*.45;box(-10+k*7,side*9,4,3,.4,.3,neon);}}
  hoop(-7,0,6,5);orb(-7,0,6,2.8,ice);
 }
 if(id==='tempest'){
  for(const side of [-1,1]){const o=hoop(-5,side*12,4,5);o.rotation.x=side*.35;
   orb(-5,side*12,4,2);for(let k=0;k<3;k++){box(-9+k*4,side*12,4,1,1,6,steel);box(-9+k*4,side*12,7.2,.7,.7,.25,neon);}
   plate([[3,side*7],[17,side*18],[19,side*15],[8,side*5]],2,1.5);}
 }
 if(id==='scavenger'){
  for(const side of [-1,1]){box(-6,side*15,3,15,8,5,dark);for(let k=0;k<4;k++)box(-12+k*4,side*15,6,1,7,.7,steel);}
  box(8,-13,2,17,3,3,steel);box(15,-10,2,3,8,3,steel);
  tube(8,13,4,3,12,dark);ring(14.2,13,4,2.7);
  for(let k=0;k<3;k++)box(-7+k*3,-15,6.5,1,5,.25,neon);
 }
 if(id==='spectre'){
  plate([[31,0],[-16,-6],[-9,0],[-16,6]],2,1.3,dark);
  for(const side of [-1,1]){plate([[-20,side*5],[-26,side*14],[7,side*6],[19,side*2]],.8,1.1,steel);
   box(-8,side*7,3,12,.22,.18,neon);plate([[-22,side*5],[-13,side*5],[-17,side*5.7]],3,4,dark);}
  box(10,0,4.4,8,.3,.2,neon);
 }
 if(id==='architect'){
  for(const side of [-1,1]){box(-1,side*18,5,28,2,2,steel);for(const x of [-14,12]){box(x,side*18,7,6,6,3,dark);hoop(x,side*18,9,2,neon);orb(x,side*18,9,.8);}}
  plate([[-10,-7],[-10,7],[7,7],[10,0],[7,-7]],4,2.5);
  for(let k=0;k<4;k++)box(-7+k*4,0,7,1,8,.3,steel);
 }
 if(id==='helios'){
  const copper=new T.MeshStandardMaterial({color:'#76503d',metalness:.8,roughness:.35});owned.add(copper);
  hoop(-8,0,6,6,copper);orb(-8,0,6,3);
  for(const side of [-1,1])for(let k=0;k<5;k++){plate([[-15+k*5,side*6],[-18+k*5,side*17],[-15+k*5,side*18],[-12+k*5,side*6]],2,1,copper);box(-14+k*5,side*12,3.4,.45,7,.25,neon);}
 }
 if(id==='echo'){
  for(const side of [-1,1]){hoop(-2,side*14,4,7,dark);hoop(-2,side*14,4,5.4,neon);hoop(-2,side*14,4,3.7,steel);orb(-2,side*14,4,1.7);
   box(-2,side*8,3,12,4,2,steel);}
  for(let k=0;k<3;k++)box(-15+k*4,0,6,1,6-k,.6,steel);
 }
 if(id==='sovereign'){
  const gold=new T.MeshStandardMaterial({color:'#aa8a5e',metalness:.82,roughness:.32});owned.add(gold);
  for(const side of [-1,1]){plate([[-25,side*8],[-20,side*20],[19,side*24],[13,side*16]],3,2.5,dark);
   plate([[-21,side*10],[-18,side*12],[12,side*20],[14,side*19]],6,.5,gold);
   for(let k=0;k<3;k++)plate([[-19+k*9,side*11],[-14+k*9,side*13],[-16+k*9,side*14]],5,5-k,gold);
   box(-8,side*10,7,13,.35,.3,neon);}
  hoop(-10,0,8,8,gold);hoop(-10,0,8,6,neon);orb(-10,0,8,3);plate([[25,0],[12,-3],[15,0],[12,3]],5,1,gold);
 }
 let nozzles=[];
 if(parts.engine&&parts.engine!=='e_stock'){}else for(let i=0;i<p.engines;i++){const y=(i-(p.engines-1)/2)*9;box(-L*.8,y,0,7,5,4);tube(-L*.9,y,0,2.2,4);ring(-L*.9-2,y,0,1.8);nozzles.push({x:-L*.9-2.2,y,z:0,r:1.6});}
 for(const [slot,pid]of Object.entries(parts))if(pid&&!pid.endsWith('_stock')){const a=buildFitting(T,pid,{color:rec.color,width:W*.55,tail:-L*.9});root.add(a.root);a.root.traverse(o=>{if(o.isMesh)(o.material.isMeshBasicMaterial?glowMeshes:bodyMeshes).push(o);});owned.add({dispose:a.dispose});if(slot==='engine')nozzles=a.nozzles;}
 const fm=new T.MeshBasicMaterial({color:rec.trail||rec.color,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});owned.add(fm);
 for(const n of nozzles){const outer=mesh(new T.ConeGeometry(n.r,1,12,1,true),fm,n.x,n.y,n.z),inner=mesh(new T.ConeGeometry(n.r*.45,1,10,1,true),neon,n.x,n.y,n.z);outer.rotation.z=inner.rotation.z=Math.PI/2;bodyMeshes.splice(bodyMeshes.indexOf(outer),1);glowMeshes.push(outer);flames.push({...n,outer,inner});}
 return {root,bodyMeshes,glowMeshes,flames,disposables:[...owned]};
}
