/* Authored fitting assemblies. Local axes: +X nose, +Z dorsal.
   This module is staged for fleet integration; it does not change equipment stats. */
export const fittingIds = ['e_twin','e_ion','e_fusion','e_nova','w_razor','w_vane','w_prism','w_phantom','m_heavy','m_rotary','m_array','m_siege','p_reactive','p_light','p_heavy','p_aegis'];
export function buildFitting(T,id,{color='#65fbd2',width=12,tail=-22}={}){
 if(!fittingIds.includes(id))throw new Error('Unknown fitting '+id);
 const root=new T.Group(),resources=new Set();root.name=id;
 const metal=new T.MeshStandardMaterial({color:'#293e52',metalness:.7,roughness:.35});
 const dark=new T.MeshStandardMaterial({color:'#0b1521',metalness:.65,roughness:.5});
 const alloy=new T.MeshStandardMaterial({color:'#657888',metalness:.8,roughness:.3});
 const neon=new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(1.8),toneMapped:false});
 for(const m of [metal,dark,alloy,neon])resources.add(m);
 const mesh=(g,m,x,y,z,rz=0)=>{resources.add(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.rotation.z=rz;root.add(o);return o;};
 const box=(x,y,z,a,b,c,m=metal)=>mesh(new T.BoxGeometry(a,b,c),m,x,y,z);
 const tube=(x,y,z,r,l,m=alloy)=>mesh(new T.CylinderGeometry(r,r,l,16),m,x,y,z,Math.PI/2);
 const ring=(x,y,z,r,m=neon)=>{const o=mesh(new T.TorusGeometry(r,.18,6,24),m,x,y,z);o.rotation.y=Math.PI/2;return o;};
 const plate=(pts,z,d,m=metal)=>{const s=new T.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return mesh(new T.ExtrudeGeometry(s,{depth:d,steps:1,bevelEnabled:true,bevelSize:.2,bevelThickness:.2,bevelSegments:1}),m,0,0,z);};
 const nozzles=[];
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
 return {root,nozzles,dispose(){for(const r of resources)r.dispose();}};
}
