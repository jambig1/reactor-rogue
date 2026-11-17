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
 let nozzles=[];
 if(parts.engine&&parts.engine!=='e_stock'){}else for(let i=0;i<p.engines;i++){const y=(i-(p.engines-1)/2)*9;box(-L*.8,y,0,7,5,4);tube(-L*.9,y,0,2.2,4);ring(-L*.9-2,y,0,1.8);nozzles.push({x:-L*.9-2.2,y,z:0,r:1.6});}
 for(const [slot,pid]of Object.entries(parts))if(pid&&!pid.endsWith('_stock')){const a=buildFitting(T,pid,{color:rec.color,width:W*.55,tail:-L*.9});root.add(a.root);a.root.traverse(o=>{if(o.isMesh)(o.material.isMeshBasicMaterial?glowMeshes:bodyMeshes).push(o);});owned.add({dispose:a.dispose});if(slot==='engine')nozzles=a.nozzles;}
 const fm=new T.MeshBasicMaterial({color:rec.trail||rec.color,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});owned.add(fm);
 for(const n of nozzles){const outer=mesh(new T.ConeGeometry(n.r,1,12,1,true),fm,n.x,n.y,n.z),inner=mesh(new T.ConeGeometry(n.r*.45,1,10,1,true),neon,n.x,n.y,n.z);outer.rotation.z=inner.rotation.z=Math.PI/2;bodyMeshes.splice(bodyMeshes.indexOf(outer),1);glowMeshes.push(outer);flames.push({...n,outer,inner});}
 return {root,bodyMeshes,glowMeshes,flames,disposables:[...owned]};
}
