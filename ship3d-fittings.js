import {roundedBox, roundedOutline} from './ship3d-surfaces.js';
/* Authored fitting assemblies. Local axes: +X nose, +Z dorsal.
   This module is staged for fleet integration; it does not change equipment stats. */
export const fittingIds = ['e_twin','e_ion','e_fusion','e_nova','w_razor','w_vane','w_prism','w_phantom','m_heavy','m_rotary','m_array','m_siege','p_reactive','p_light','p_heavy','p_aegis'];
// Hardpoints follow each hull's structure. Entries use positive lateral distances
// for mirrored hardware. Scavenger's loadout deliberately has asymmetric seating.
const airframes={
 vanguard:  {tail:-24,drive:9, wing:[-14,8,24,2,-22], weapon:[1,14,2.3], armour:[-13,8,3.1], style:'patrol'},
 harrier:   {tail:-20,drive:11,wing:[-8,10,21,1,16], weapon:[12,11,3], armour:[-11,11,3.2], style:'assault'},
 glacier:   {tail:-18,drive:13,wing:[-9,10,27,2,3], weapon:[0,13,4], armour:[-12,10,4.5], style:'cryo'},
 tempest:   {tail:-17,drive:15,wing:[-11,13,27,1,10], weapon:[1,15,5], armour:[-10,6,3.9], style:'arc'},
 scavenger: {tail:-20,drive:15,wing:[-13,14,26,3,-17],weapon:[4,15,4], armour:[-15,15,5], style:'salvage'},
 spectre:   {tail:-25,drive:5, wing:[-13,4,21,0,-28], weapon:[4,5,.9], armour:[-16,5,2.3], style:'stealth'},
 architect: {tail:-23,drive:16,wing:[-14,17,27,1,18],weapon:[8,16,7], armour:[-14,16,6], style:'carrier'},
 helios:    {tail:-22,drive:7, wing:[-15,7,27,2,8], weapon:[3,7,2.6], armour:[-12,7,4], style:'solar'},
 echo:      {tail:-16,drive:16,wing:[-9,14,26,2,1], weapon:[5,16,4], armour:[-14,7,4.5], style:'sonic'},
 sovereign: {tail:-27,drive:20,wing:[-19,18,34,3,17],weapon:[8,20,5.7], armour:[-21,20,5.5], style:'rift'}
};
export function buildFitting(T,id,{color='#65fbd2',width=12,tail=-22,shipId}={}){
 if(!fittingIds.includes(id))throw new Error('Unknown fitting '+id);
 const root=new T.Group(),resources=new Set();root.name=id;
 const metal=new T.MeshStandardMaterial({color:'#293e52',metalness:.7,roughness:.35});
 const dark=new T.MeshStandardMaterial({color:'#0b1521',metalness:.65,roughness:.5});
 const alloy=new T.MeshStandardMaterial({color:'#657888',metalness:.8,roughness:.3});
 const neon=new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(1.8),toneMapped:false});
 for(const m of [metal,dark,alloy,neon])resources.add(m);
 const mesh=(g,m,x,y,z,rz=0)=>{resources.add(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.rotation.z=rz;root.add(o);return o;};
 const box=(x,y,z,a,b,c,m=metal)=>mesh(roundedBox(T,a,b,c,shipId==='bastion'?.15:.27),m,x,y,z);
 const tube=(x,y,z,r,l,m=alloy)=>mesh(new T.CylinderGeometry(r,r,l,16),m,x,y,z,Math.PI/2);
 const ring=(x,y,z,r,m=neon)=>{const o=mesh(new T.TorusGeometry(r,.18,6,24),m,x,y,z);o.rotation.y=Math.PI/2;return o;};
 const plate=(pts,z,d,m=metal)=>{const s=roundedOutline(T,pts,shipId==='bastion'?.7:1.7);return mesh(new T.ExtrudeGeometry(s,{depth:d,steps:1,bevelEnabled:true,bevelSize:.2,bevelThickness:.2,bevelSegments:2,curveSegments:3}),m,0,0,z);};
 const nozzles=[];
 const palette={e_twin:'#ff9a52',e_ion:'#70beff',e_fusion:'#ffc968',e_nova:'#ff7852',w_razor:'#ff647b',w_vane:'#73e8d5',w_prism:'#b894ff',w_phantom:'#b391ff',m_heavy:'#ffb66c',m_rotary:'#ffdc83',m_array:'#85bdff',m_siege:'#ff735f',p_reactive:'#ffba70',p_light:'#6ce8db',p_heavy:'#a6bbdc',p_aegis:'#81dcff'};
 neon.color.set(palette[id]).multiplyScalar(2);
 const orb=(x,y,z,r,m=neon)=>mesh(new T.IcosahedronGeometry(r,1),m,x,y,z);
 const hoop=(x,y,z,r,m=neon)=>mesh(new T.TorusGeometry(r,.18,6,32),m,x,y,z);

 const frame=airframes[shipId];
 if(frame){
  const {style}=frame, slender=style==='stealth', capital=style==='rift'||style==='carrier';
  const fitColor=new T.Color(palette[id]).lerp(new T.Color(color),.43);
  neon.color.copy(fitColor).multiplyScalar(2.2);
  if(style==='rift'||style==='solar')alloy.color.set(style==='rift'?'#aa8756':'#916849');
  const strip=(a,b,r=.16)=>{
   const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from);
   const rail=mesh(new T.CylinderGeometry(r,r,delta.length(),6),neon,...from.add(to).multiplyScalar(.5));
   rail.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
  };
  for(const side of [-1,1]){
   const offset=style==='salvage'&&side===-1?-3:0;
   if(id.startsWith('e_')){
    const x=frame.tail+offset,z=style==='carrier'?1:style==='arc'?-.2:-.65;
    const y=side*frame.drive;
    const radius={e_twin:1.5,e_ion:2.1,e_fusion:2.6,e_nova:3}[id]*(capital?1.22:slender?.7:1);
    const length=id==='e_nova'?(style==='solar'?12:8):6;
    if(capital||style==='salvage')box(x+2,y,z,length+3,2.65*radius,2.35*radius,dark);
    else tube(x+2,y,z,radius+1,length+2,metal);
    if(style==='sonic'||style==='arc'){ring(x+1,y,z,radius+1.05,alloy);ring(x-1,y,z,radius+1.15);}
    const ports=id==='e_twin'?[-radius*.82,radius*.82]:[0];
    for(const port of ports){
     const r=ports.length===2?radius*.6:radius;
     const lip=x-length/2;
     tube(x,y+port,z,r+.25,length,alloy);
     tube(lip-.12,y+port,z,r,.25,dark);
     ring(lip-.3,y+port,z,r*.84);
     if(id==='e_nova')ring(lip-1.4,y+port,z,r*1.12);
     nozzles.push({x:lip-(id==='e_nova'?1.5:.4),y:y+port,z,r:r*.75});
    }
    if(id==='e_fusion'){orb(x+2,y,z+radius+.75,radius*.6);hoop(x+2,y,z+radius+.75,radius*.84,alloy);}
    if(id==='e_ion')for(let j=0;j<3;j++)box(x+j*1.25,y,z+radius+1,.4,radius*1.5,.25,neon);
   }else if(id.startsWith('w_')){
    const [x,root,span,z,tip]=frame.wing,y=n=>side*n;
    const edge=span+(id==='w_phantom'?3:id==='w_razor'?1:0);
    const material=id==='w_prism'?new T.MeshPhysicalMaterial({color:fitColor,metalness:.3,roughness:.17,transparent:true,opacity:.66,side:T.DoubleSide}):metal;
    resources.add(material);
    const pts=capital?[[x,y(root-2)],[x-3,y(edge)],[tip,y(edge)],[tip+1,y(edge-4)],[tip-4,y(root)]]:
     [[x,y(root-2)],[tip-5,y(edge-3)],[tip,y(edge)],[tip+6,y(edge-5)],[x+12,y(root)]];
    const depth=style==='salvage'||capital?2.1:slender?.55:1;
    plate(pts,z,depth,material);
    const edgeEnd=capital?[tip+1,y(edge-4),z+depth]:[tip+6,y(edge-5),z+depth];
    strip([tip,y(edge),z+depth],edgeEnd,.19);
    if(id==='w_vane'||id==='w_phantom')for(let j=0;j<(id==='w_phantom'?3:2);j++){
     const rib=box(x+(tip-x)*.45+j*2,y(root+(edge-root)*.55),z+depth+j*.2,5,.65,capital?2:1,alloy);
     rib.rotation.z=side*(capital?.15:.55);
    }
    if(style==='sonic'||style==='arc')hoop((tip+x)/2,y((edge+root)/2),z+depth,2.2);
   }else if(id.startsWith('m_')){
    const [x,base,z]=frame.weapon,y=side*base,h=capital?1.3:slender?.67:1;
    const barrels={m_heavy:1,m_rotary:5,m_array:3,m_siege:2}[id];
    box(x-1,y,z-.6,capital?11:7,4*h,2.6*h,dark);
    if(style==='sonic'||style==='arc'||style==='rift')ring(x+1,y,z,2.3*h);
    for(let j=0;j<barrels;j++){
     const phase=j*2*Math.PI/barrels,spread=barrels===1?0:1.3*h;
     const yy=y+Math.cos(phase)*spread,zz=z+Math.sin(phase)*spread;
     const length=(id==='m_siege'?16:10)*h;
     const radius=(barrels===1?1.1:.54)*h;
     if(slender){box(x+length/2,yy,zz,length,.85,1,alloy);strip([x,yy,zz+.6],[x+length,yy,zz+.6],.12);}
     else {tube(x+length/2,yy,zz,radius,length,alloy);ring(x+length,yy,zz,radius);}
    }
   }else{
    const [start,base,z]=frame.armour,y=side*base;
    const thick=id==='p_heavy'?(capital?2.65:1.8):id==='p_light'?.48:1;
    const rows=id==='p_light'?2:3;
    for(let j=0;j<rows;j++){
     const x=start+offset+j*(capital?8:6),w=capital?3.5:slender?1.5:2.45;
     plate([[x-3,y-w],[x+2,y-w],[x+3,y-w*.47],[x+3,y+w],[x-2,y+w]],z,thick,id==='p_light'?alloy:metal);
     if(id==='p_aegis'){hoop(x,y,z+thick+.15,w*.64);orb(x,y,z+thick+.22,w*.27);}
     if(id==='p_reactive')box(x,y,z+thick+.18,2.65,.38,.25,neon);
    }
   }
  }
  return {root,nozzles,dispose(){for(const resource of resources)resource.dispose();}};
 }

 if(shipId==='wasp'||shipId==='bastion'){
  const heavy=shipId==='bastion';
  const rail=(from,to,r)=>{const a=new T.Vector3(...from),b=new T.Vector3(...to),delta=b.clone().sub(a);
   const mid=a.clone().add(b).multiplyScalar(.5);
   const o=mesh(new T.CylinderGeometry(r,r,delta.length(),6),neon,...mid);
   o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
  };
  // Signature equipment uses the existing unlock IDs and statistics.
  // Wasp builds outwards and aft. Bastion builds upwards around its armoured deck.
  if(id==='e_nova'){
   if(heavy){
    box(-21,0,1,10,28,8,dark);
    for(const y of [-10,0,10]){
     const radius=y===0?4.2:2.8;
     box(-24,y,0,10,radius*2.35,radius*2.3,metal);
     tube(-29,y,0,radius,3,alloy);
     ring(-30.6,y,0,radius*.86);
     tube(-30.7,y,0,radius*.55,.2,neon);
     for(let k=0;k<3;k++)box(-25+k*2.3,y,radius*1.16,.7,radius*1.4,.3,neon);
     nozzles.push({x:-31,y,z:0,r:radius*.73});
    }
   }else{
    for(const side of [-1,1]){
     const y=side*8;
     tube(-24,y,-.6,2.6,10,metal);
     tube(-30,y,-.6,1.9,5,alloy);
     for(const x of [-28,-31,-33])ring(x,y,-.6,x===-33?2.25:2);
     plate([[-24,y],[-37,y+side*2],[-34,y+side*5],[-26,y+side*3]],-.9,1,metal);
     rail([-26,y+side*2,.35],[-35,y+side*3,.35],.18);
     nozzles.push({x:-33.25,y,z:-.6,r:1.75});
    }
   }
  }else if(id==='w_phantom'){
   for(const side of [-1,1]){
    const y=v=>v*side;
    if(heavy){
     plate([[-19,y(17)],[-21,y(27)],[-12,y(32)],[8,y(32)],[14,y(24)],[11,y(17)]],-3,4,metal);
     for(const x of [-13,-4,5]){
      box(x,y(26),2,7,8,2.5,alloy);
      box(x,y(30),3.4,4,.6,.4,neon);
     }
     rail([-12,y(32),.65],[8,y(32),.65],.24);
    }else{
     plate([[-17,y(6)],[-28,y(24)],[-34,y(30)],[-22,y(26)],[-7,y(12)],[1,y(7)]],-.7,1,metal);
     plate([[-22,y(15)],[-33,y(23)],[-35,y(24)],[-27,y(18)]],.4,.55,alloy);
     rail([-33,y(29),.55],[-22,y(25),.55],.18);
     rail([-22,y(25),.55],[-7,y(12),.55],.15);
     const fin=plate([[-31,0],[-34,5],[-23,2],[-21,0]],0,.55,dark);
     fin.rotation.x=side*Math.PI/2;
     if(side<0)fin.scale.y=-1;
     fin.position.set(0,y(25),.6);
    }
   }
  }else if(id==='m_siege'){
   for(const side of [-1,1]){
    const y=side*(heavy?12:8);
    if(heavy){
     box(-3,y,8.6,14,7,4,dark);
     box(0,y,12,12,8,4,metal);
     for(const dy of [-1.8,1.8]){
      tube(11,y+dy,12,1.43,18,alloy);
      tube(20.2,y+dy,12,1.52,.7,dark);
      ring(20.6,y+dy,12,1.3);
     }
     box(-2,y,14.2,6,3,.4,neon);
    }else{
     box(2,y,1.2,11,3,2,dark);
     for(const dy of [-.72,.72]){
      const offset=y+dy;
      box(11,offset,1.35,20,.65,1.15,alloy);
      rail([4,offset,2],[20.5,offset,2],.11);
     }
     box(16,y,1.35,1.3,2.1,1.15,metal);
    }
   }
  }else if(id==='p_aegis'){
   for(const side of [-1,1]){
    if(heavy){
     for(const x of [-15,1,13]){
      const y=side*17;
      plate([[x-4,y-3],[x+3,y-3],[x+5,y],[x+3,y+3],[x-4,y+3]],6,2.9,metal);
      mesh(new T.CylinderGeometry(2.1,2.5,1.3,6),alloy,x,y,9.25).rotation.x=Math.PI/2;
      hoop(x,y,10,1.9);
      orb(x,y,10,.85);
     }
    }else{
     const y=side*8;
     plate([[-21,y-side*2],[-19,y+side*2.7],[-4,y+side*2.4],[1,y-side*1]],2,1.1,metal);
     rail([-19,y+side*1.9,3.42],[-6,y+side*1.7,3.42],.16);
     for(const x of [-17,-9])hoop(x,y,3.55,.84);
    }
   }
  }
  if(['e_nova','w_phantom','m_siege','p_aegis'].includes(id)){
   return {root,nozzles,dispose(){for(const resource of resources)resource.dispose();}};
  }
  if(id.startsWith('e_')){
   const radius={e_twin:1.15,e_ion:1.65,e_fusion:1.9,e_nova:2.2}[id]+(heavy?1:0);
   const x=heavy?-22:-25;
   for(const side of [-1,1]){
    const y=side*(heavy?15:8),z=heavy?-.5:-.7;
    if(heavy)box(x+2,y,z,10,8,6,dark);
    else tube(x+2,y,z,radius+.5,7,metal);
    const offsets=id==='e_twin'?[-radius*.9,radius*.9]:[0];
    for(const offset of offsets){
     const r=radius*(offset?.62:1);
     tube(x-2,y+offset,z,r+.4,5,alloy);
     tube(x-4.55,y+offset,z,r,.14,dark);
     ring(x-4.75,y+offset,z,r*.82);
     if(id==='e_nova')ring(x-5.65,y+offset,z,r*1.14);
     nozzles.push({x:x-(id==='e_nova'?5.8:4.9),y:y+offset,z,r:r*.72});
    }
    if(id==='e_ion')for(let i=0;i<3;i++)box(x+i*1.35,y,z+radius+.55,.45,radius*1.4,.3,neon);
    if(id==='e_fusion'){orb(x+2,y,z+radius+.65,radius*.64);hoop(x+2,y,z+radius+.65,radius*.85,alloy);}
   }
  }else if(id.startsWith('w_')){
   const span={w_razor:2,w_vane:0,w_prism:3,w_phantom:4}[id];
   const sail=id==='w_prism'?new T.MeshPhysicalMaterial({color,roughness:.22,metalness:.3,transparent:true,opacity:.63,side:T.DoubleSide}):metal;
   resources.add(sail);
   for(const side of [-1,1]){
    const pts=heavy?[[-20,19],[-16,26+span],[4,26+span],[12,20],[9,16],[-19,16]]:
     [[-20,7],[-27,19+span],[-24,21+span],[-13,17],[4,9],[-3,7]];
    plate(pts.map(([x,y])=>[x,y*side]),heavy?-1.5:-.9,heavy?2.6:.9,sail);
    if(heavy){
     for(let i=0;i<3;i++)box(-12+i*6,side*(23+span*.5),1.8,4,3,1.5,alloy);
     rail([-14,side*(26+span),1.4],[3,side*(26+span),1.4],.23);
    }else{
     rail([-24,side*(21+span),.15],[-13,side*17,.15],.13);
     rail([-13,side*17,.15],[3,side*9.2,.15],.13);
    }
    const ribs=id==='w_phantom'?3:id==='w_vane'?2:1;
    for(let i=0;i<ribs;i++){
     const y=side*((heavy?22:13)+i*2);
     const rib=box(-15+i*2,y,heavy?2.4:.6,heavy?7:4,.65,heavy?1.4:.55,alloy);
     rib.rotation.z=heavy?0:side*.6;
    }
   }
  }else if(id.startsWith('m_')){
   const count={m_heavy:1,m_rotary:6,m_array:4,m_siege:2}[id];
   for(const side of [-1,1]){
    const y=side*(heavy?12:8),z=heavy?9.5:1.15,x=heavy?1:5;
    box(x,y,z-.55,heavy?11:9,heavy?7:3.4,heavy?4:2.4,dark);
    if(heavy)box(x-2,y,z+1.6,8,6,2,metal);
    else tube(x+1,y,z,1.1,6,metal);
    for(let i=0;i<count;i++){
     const angle=i*Math.PI*2/count;
     const spread=count===1?0:(heavy?1.5:.65),by=y+Math.cos(angle)*spread,bz=z+Math.sin(angle)*spread;
     const length=(id==='m_siege'?14:10)+(heavy?4:0);
     const r=(count===1?.95:.42)*(heavy?1.65:1);
     const start=x+2;
     tube(start+length/2,by,bz,r,length,id==='m_siege'?metal:alloy);
     ring(start+length,by,bz,r+.07,id==='m_siege'?neon:alloy);
    }
    box(x-1,y,z+(heavy?2.7:.8),heavy?6:3,.38,.25,neon);
   }
  }else{
   const rows=id==='p_light'?2:3;
   for(const side of [-1,1])for(let i=0;i<rows;i++){
    const x=(heavy?-14:-15)+i*(heavy?9:5.8);
    const y=side*(heavy?16:8);
    const z=heavy?6.1:2.45;
    const thick=id==='p_heavy'?(heavy?3:1.1):(heavy?1.55:.6);
    const halfLength=heavy?4:2.55,halfWidth=heavy?3.3:1.65;
    plate([[x-halfLength,y-halfWidth],[x+halfLength,y-halfWidth*.7],[x+halfLength,y+halfWidth*.7],[x-halfLength,y+halfWidth]],z,thick,id==='p_light'?alloy:metal);
    if(id==='p_aegis'){
     const r=heavy?1.65:.76;
     hoop(x,y,z+thick+.3,r);
     orb(x,y,z+thick+.4,r*.46);
    }else{
     box(x,y,z+thick+.16,heavy?3:1.6,.35,.25,id==='p_reactive'?neon:alloy);
    }
   }
  }
  return {root,nozzles,dispose(){for(const resource of resources)resource.dispose();}};
 }
 if(id.startsWith('e_')){
  const cfg={e_twin:[[-10,1.7],[-5,1.7],[5,1.7],[10,1.7]],e_ion:[[-7,2.4],[7,2.4]],e_fusion:[[-9,1.8],[0,3.6],[9,1.8]],e_nova:[[-7,3.5],[7,3.5]]}[id];
  box(tail+2,0,0,5,26,2,dark);
  for(const [y,r]of cfg){tube(tail,y,0,r+1,7,metal);tube(tail-3.6,y,0,r,.2,dark);ring(tail-3.8,y,0,r*.8);ring(tail-2.7,y,0,r+1,alloy);tube(tail-3.9,y,0,r*.45,.1,neon);
   for(let k=0;k<(id==='e_ion'?4:2);k++)box(tail+1-k*1.1,y,r+.8,.35,r*1.4,.25,neon);
   if(id==='e_nova')for(let a=0;a<6;a++){let q=a*Math.PI/3;box(tail,y+Math.cos(q)*(r+1),Math.sin(q)*(r+1),7,.5,.5,alloy);}
   nozzles.push({x:tail-4,y,z:0,r});}
 }else if(id.startsWith('w_')){
  for(const side of [-1,1]){const y=side*width;box(-8,y,0,9,3,2,alloy);
   const profiles={w_razor:[[-14,width],[-20,width+13],[-14,width+15],[-2,width]],w_vane:[[-15,width],[-13,width+12],[-9,width+12],[-5,width]],w_prism:[[-16,width],[-13,width+12],[-5,width+15],[2,width+4]],w_phantom:[[-18,width],[-13,width+17],[-7,width+12],[3,width+4]]};
   const pts=profiles[id].map(([x,y])=>[x,side*y]);
   const mat=id==='w_prism'?new T.MeshPhysicalMaterial({color,metalness:.3,roughness:.12,transparent:true,opacity:.55,side:T.DoubleSide}):metal;resources.add(mat);
   for(let k=0;k<(id==='w_vane'?3:1);k++){const p=plate(pts,.5+k*.8,.5,mat);p.position.x+=k*4;}
   box(-10,side*(width+8),1.5,5,.4,.3,neon);
   if(id==='w_phantom')plate([[-17,y],[-14,y],[-14,y+side*2],[-17,y+side*2]],2,3,dark);
  }
 }else if(id.startsWith('m_')){
  const count={m_heavy:1,m_rotary:6,m_array:4,m_siege:3}[id];
  for(const side of [-1,1]){let y=side*width;box(0,y,2,9,5,3,dark);tube(0,y,3,2.3,5,metal);ring(2.6,y,3,2,alloy);
   for(let k=0;k<count;k++){let a=k*Math.PI*2/count,r=count===1?0:1.4,yy=y+Math.cos(a)*r,z=3+Math.sin(a)*r; tube(6,yy,z,count===1?1.5:.5,id==='m_siege'?13:9);tube(id==='m_siege'?12.6:10.6,yy,z,count===1?1.1:.3,.1,dark);}
   box(-2,y,4.6,3,.5,.25,neon);
  }
 }else{
  for(const side of [-1,1])for(let k=0;k<(id==='p_light'?2:4);k++){let x=-12+k*6,y=side*(width*.55),d=id==='p_heavy'?2:1;
   plate([[x-2,y-2.6],[x+2,y-2.6],[x+3,y+2],[x-3,y+2]],3,d,id==='p_light'?alloy:metal);
   if(id==='p_reactive')box(x,y,4.2,3,3,.6,dark);
   if(id==='p_aegis'){box(x,y,4.2,2,2,.5,neon);box(x,y,4.6,1,1,.3,alloy);}
  }
 }
 // Signature hardware: each fitting changes the silhouette beyond its stock mount.
 if(id==='e_twin')for(const side of [-1,1]){box(tail+1,side*14,1,9,2,3,dark);for(let k=0;k<3;k++)box(tail+2-k*2.2,side*14,2.7,1.1,1.3,.45,neon);}
 if(id==='e_ion')for(const side of [-1,1])for(let k=0;k<4;k++){ring(tail-4-k*.8,side*7,0,2.5-k*.15, k%2?alloy:neon);}
 if(id==='e_fusion'){orb(tail+1,0,3.2,3.2);hoop(tail+1,0,3.2,4.7,alloy);for(const side of [-1,1])box(tail+1,side*4.7,3,6,.7,1.1,dark);}
 if(id==='e_nova')for(const side of [-1,1]){for(let k=0;k<3;k++)ring(tail-4-k*1.4,side*7,0,4.1+k*.45,k===1?alloy:neon);for(const sd of [-1,1])plate([[tail+4,side*7+sd*3],[tail-3,side*7+sd*7],[tail-7,side*7+sd*7],[tail-2,side*7+sd*3]],-1.5,3,dark);}
 if(id==='w_razor')for(const side of [-1,1]){plate([[-16,side*(width+3)],[-27,side*(width+19)],[-20,side*(width+17)],[-8,side*(width+4)]],1,1.3,alloy);box(-21,side*(width+14),2,4,.5,.3,neon);}
 if(id==='w_vane')for(const side of [-1,1])for(let k=0;k<3;k++){const o=box(-13+k*4,side*(width+8),3+k*.7,7,.65,2,alloy);o.rotation.x=side*.3;box(-13+k*4,side*(width+8),4.1+k*.7,5,.3,.2,neon);}
 if(id==='w_prism')for(const side of [-1,1]){const crystal=new T.MeshPhysicalMaterial({color:'#a58aff',metalness:.25,roughness:.1,transparent:true,opacity:.65,emissive:'#734dba',emissiveIntensity:.3,side:T.DoubleSide});resources.add(crystal);plate([[-15,side*(width+2)],[-18,side*(width+17)],[-6,side*(width+22)],[3,side*(width+7)]],2,.7,crystal);for(let k=0;k<3;k++)orb(-12+k*4,side*(width+9+k*2),3, .65);}
 if(id==='w_phantom')for(const side of [-1,1])for(let k=0;k<4;k++){const y=side*(width+5+k*4);plate([[-18+k*2,y],[-21+k*2,y+side*3],[-9+k*2,y+side*3],[-5+k*2,y]],1+k*.45,.7,k%2?alloy:dark);box(-12+k*2,y,2+k*.45,7,.35,.3,neon);}
 if(id==='m_heavy')for(const side of [-1,1]){tube(5,side*width,3,2,11,dark);ring(10.7,side*width,3,2,alloy);box(-3,side*width,5.5,5,3,2,metal);}
 if(id==='m_rotary')for(const side of [-1,1]){ring(7,side*width,3,2.2,alloy);ring(9,side*width,3,2.1);tube(-4,side*width,3,3,3,dark);for(let k=0;k<5;k++)box(-5+k*.8,side*(width+3),3,.4,1,3,alloy);}
 if(id==='m_array')for(const side of [-1,1]){box(-3,side*width,7,8,7,2,dark);for(let k=0;k<3;k++){tube(4,side*width+(k-1)*2,7,.7,9);ring(8.6,side*width+(k-1)*2,7,.65);}box(-3,side*width,5,2,2,5,alloy);}
 if(id==='m_siege')for(const side of [-1,1]){box(-4,side*width,7,9,6,3,dark);tube(5,side*width,7,1.6,19,metal);ring(14.6,side*width,7,1.5,alloy);for(let k=0;k<4;k++)ring(1+k*2.5,side*width,7,1.8,k%2?alloy:neon);box(-5,side*width,9,4,3,.35,neon);}
 if(id==='p_reactive')for(const side of [-1,1])for(let k=0;k<4;k++){const o=box(-12+k*6,side*(width*.65),6,4.5,4,1.4,metal);o.rotation.x=side*.25;box(-12+k*6,side*(width*.65),6.9,2,.35,.2,neon);}
 if(id==='p_light')for(const side of [-1,1])for(let k=0;k<3;k++){const o=box(-10+k*6,side*(width*.6),5,7,.7,.8,alloy);o.rotation.z=side*.6;box(-10+k*6,side*(width*.6),5.5,3,.3,.2,neon);}
 if(id==='p_heavy')for(const side of [-1,1]){plate([[-19,side*4],[-16,side*(width+2)],[8,side*(width+2)],[13,side*5]],2,3.8,metal);for(let k=0;k<5;k++)box(-13+k*4,side*(width*.8),6.3,2.8,4,.55,alloy);}
 if(id==='p_aegis')for(const side of [-1,1])for(let k=0;k<3;k++){const x=-12+k*8,y=side*(width*.75);box(x,y,5,4,4,3,dark);mesh(new T.CylinderGeometry(2,2,1,6),alloy,x,y,7).rotation.x=Math.PI/2;orb(x,y,7.8,1.25);hoop(x,y,7.8,2.5);}
 return {root,nozzles,dispose(){for(const r of resources)r.dispose();}};
}
