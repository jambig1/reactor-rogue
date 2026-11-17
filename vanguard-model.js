import {roundedBox, roundedOutline} from './ship3d-surfaces.js';
import {buildFitting} from './ship3d-fittings.js';
/* Authored Vanguard benchmark. Shape space: +X forward, +Z dorsal.
 * No simulation state, storage, randomness, textures or external dependencies.
 * Stock fittings only for this review milestone; other loadouts retain the legacy builder.
 */
export function supportsVanguard(key) {
  try { return JSON.parse(key)[0] === 'vanguard'; } catch { return false; }
}

export function buildVanguard(T, rec, parts={}) {
  const root = new T.Group(); root.name = 'Vanguard / authored stock airframe';
  const owned = new Set(), batches = new Map(), bodyMeshes = [], glowMeshes = [], flames = [];
  const material = (name, color, metalness, roughness, extra={}) => {
    const m = new T.MeshStandardMaterial({color,metalness,roughness,...extra});m.name=name;owned.add(m);return m;
  };
  const hull=material('navy ceramic armour','#25394c',.65,.39), edge=material('worn alloy bevels','#536778',.78,.32);
  const dark=material('recessed graphite machinery','#0c1722',.65,.5), steel=material('titanium fittings','#344653',.85,.3);
  const paint=material('painted identification panels',rec.color||'#65fbd2',.48,.43);
  const glass=material('smoked cockpit glass','#123a51',.38,.12,{envMapIntensity:1.65});
  const warm=material('heat-stained nozzle rims','#66584e',.82,.42);
  const light = new T.MeshBasicMaterial({color:new T.Color(rec.trail||rec.color||'#65fbd2').multiplyScalar(1.25),toneMapped:false});owned.add(light);
  const accent = new T.MeshBasicMaterial({color:new T.Color(rec.color||'#65fbd2').multiplyScalar(2.1),toneMapped:false});owned.add(accent);
  if(rec.patternCanvas){const tex=new T.CanvasTexture(rec.patternCanvas);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;owned.add(tex);hull.map=tex;hull.color.set('#ffffff');}
  const add=(g,m,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{
    const matrix=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(1,1,1));
    g.applyMatrix4(matrix); if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g);return g;
  };
  // Closed longitudinal sections with a chamfered octagonal cross-section.
  // Deliberate chine breaks replace the old uniformly inflated 2D outline.
  function section(stations,m,cy=0,cz=0) {
    const pos=[],idx=[];
    for(const [x,w,top,bottom] of stations){for(const [y,z] of [[-.62*w,top],[.62*w,top],[w,top*.5],[w,bottom*.45],[.65*w,bottom],[-.65*w,bottom],[-w,bottom*.45],[-w,top*.5]])pos.push(x,y+cy,z+cz);}
    for(let j=0;j<stations.length-1;j++)for(let k=0;k<8;k++){let a=j*8+k,b=j*8+(k+1)%8,c=b+8,d=a+8;idx.push(a,b,c,a,c,d);}
    for(let k=1;k<7;k++){idx.push(0,k+1,k);let n=(stations.length-1)*8;idx.push(n,n+k,n+k+1);}
    for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
    // Keep plane breaks crisp, rather than averaging normals around every chine.
    const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();return add(flat,m);
  }
  function plate(points,z,depth,m,bevel=.22){const s=roundedOutline(T,points,1.35);
    return add(new T.ExtrudeGeometry(s,{depth,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:2,steps:1,curveSegments:3}),m,0,0,z);}
  const box=(x,y,z,sx,sy,sz,m,rz=0)=>add(roundedBox(T,sx,sy,sz,.20),m,x,y,z,0,0,rz);
  const cylinder=(x,y,z,r1,r2,l,m,n=16)=>add(new T.CylinderGeometry(r1,r2,l,n,1,false),m,x,y,z,0,0,-Math.PI/2);
  const strip=(points,r=.15)=>{for(let i=1;i<points.length;i++){const a=new T.Vector3(...points[i-1]),b=new T.Vector3(...points[i]),d=b.clone().sub(a);const g=new T.CylinderGeometry(r,r,d.length(),6);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));g.translate(...a.add(b).multiplyScalar(.5));add(g,accent);}};
  const ring=(x,y,z,r,t,m)=>add(new T.TorusGeometry(r,t,6,24),m,x,y,z,0,Math.PI/2,0);
  section([[-22,3.2,1.4,-1.8],[-17,7.1,3.3,-3],[-6,10,4.8,-3.7],[5,8,5.5,-3.1],[15,5,3.7,-1.7],[26,.35,.35,-.35]],dark);
  section([[-19,3.8,2.4,-.2],[-12,7.6,4.6,-.5],[0,8.8,5.3,-.6],[12,5.5,4.5,-.4],[25,.4,.55,-.1]],hull);
  // Exposed keel and ventral armour: meaningful construction from below too.
  section([[-19,2,.8,-.7],[-9,4.7,.8,-2],[7,3.4,.8,-1.4],[20,.6,.8,-.3]],steel,0,-1.8);
  for(const side of [-1,1]){
    const pts=a=>a.map(([x,y])=>[x,y*side]);
    if(!parts.wings||parts.wings==='w_stock'){
    plate(pts([[-18,7],[-19,20],[-11,24],[1,12],[3,7]]),-.65,1.45,dark,.28);
    plate(pts([[-16.8,9],[-17.7,19.5],[-11,22.8],[-1,12],[1,8.5]]),.9,.65,hull,.32);
    plate(pts([[-15.9,17.7],[-16.5,19.4],[-11.1,21.6],[-8.4,19.1]]),1.9,.15,paint,.1);
    strip([[-17,side*19.5,1.9],[-11,side*22.7,1.9],[-1,side*12,1.9]],.18);
    strip([[-18,side*11.6,1.4],[-7,side*12,1.7],[0,side*10.9,1.2]],.14);
    strip([[12,side*3.7,4.05],[18,side*2.2,2.7],[23,side*.7,1.05]],.13);
    box(-10,side*9,4.45,3,.4,.2,accent);
    }
    // Spars join the gun/engine assemblies to the core, under visible armour.
    box(-8,side*11,.3,13,5,2.6,steel,side*.12);
    section([[-22,2.6,2.3,-2.3],[-18,3.5,3.4,-2.9],[-7,3.3,3.8,-2.7],[0,2.4,2.3,-1.7],[4,.7,.8,-.6]],hull,side*9,-.6);
    section([[-18,2.35,.5,-.5],[-10,2.65,.6,-.5],[-5,1.5,.3,-.3]],steel,side*9,3.2);
    // Recessed radiator bed with separate metal vanes, no luminous wireframe.
    box(-12,side*9,3.9,7,3.7,.35,dark);
    for(let j=0;j<6;j++)box(-14.8+j*1.1,side*9,4.18,.4,3.3,.3,steel);
    // Compact raised wing-root cannons with collars and a recessed muzzle.
    if(!parts.mount||parts.mount==='m_stock'){
    box(-1,side*14.1,1.6,7,3.2,2.6,dark);
    section([[-5,1.6,1.8,-1],[0,1.8,1.8,-1],[4,1.1,1,-.6]],hull,side*14.1,2);
    cylinder(5,side*14.1,2.5,.72,.95,6.5,steel,12);
    cylinder(8.4,side*14.1,2.5,.94,.94,1.2,dark,12);
    ring(9,side*14.1,2.5,.65,.18,edge);
    cylinder(9.01,side*14.1,2.5,.43,.43,.05,dark,12);
    }
    // Small canted vertical stabilisers, built as finite solids.
    const fin=plate([[-19,0],[-19,5],[-16,4.7],[-10,0]],0,.48,steel,.12);
    fin.rotateX(Math.PI/2);fin.translate(0,side*7,2.5);
    // Nozzle sleeve, concentric heat rings and deep dark throat.
    if(!parts.engine||parts.engine==='e_stock'){
    cylinder(-22,side*9,-.5,2.65,2.65,3,steel,24);
    ring(-23.5,side*9,-.5,2.45,.32,warm);
    cylinder(-23.58,side*9,-.5,2.07,2.07,.12,dark,24);
    ring(-23.7,side*9,-.5,1.61,.18,light);
    cylinder(-23.76,side*9,-.5,1.25,1.25,.08,light,24);
    for(let j=0;j<8;j++){const a=j*Math.PI/4;box(-22.1,side*9+Math.cos(a)*2.6,-.5+Math.sin(a)*2.6,2,.35,.35,edge);}
    }
    // Flush position lamps and short edge wear marks, deliberately sparse.
    box(-11,side*22.2,1.55,1.5,.3,.25,accent);
    for(let j=0;j<3;j++)box(-14+j*1.2,side*20.1,1.85,.65,.12,.05,edge,side*.3);
  }
  section([[8,2,.65,.1],[14,2.85,1.05,.1],[20,1.45,.6,.1],[24,.3,.25,.1]],steel,0,-1.6);
  for(const side of [-1,1]){
    box(-5,side*5.4,4.85,4.8,1.15,.28,dark);
    for(let j=0;j<4;j++)box(-6.6+j*.94,side*5.4,5.05,.28,.88,.17,edge);
  }
  // An actual raised canopy with an opaque smoked lens, metal sill and framing.
  section([[-3,2.3,.6,-.4],[1,3.7,2.4,-.3],[7,2.8,2.8,-.2],[13,.65,.4,-.1]],steel,0,5);
  section([[-2,1.9,.35,-.1],[1,3.12,2.22,-.1],[6.8,2.32,2.5,-.1],[11.7,.65,.45,-.1]],glass,0,5.55);
  strip([[-2,-2.1,6.1],[1,-3.15,6.65],[6.8,-2.35,6.9],[11.7,-.65,6]],.12);
  strip([[-2,2.1,6.1],[1,3.15,6.65],[6.8,2.35,6.9],[11.7,.65,6]],.12);
  box(.9,0,7.88,.35,3.9,.15,edge);
  box(-2.2,0,6,1,4.6,.6,hull);
  // Nose sensor aperture and segmented dorsal service hatch.
  box(20,0,2.0,2.6,1.5,.18,dark);box(20.6,0,2.11,.7,.8,.08,accent);
  plate([[-14,-2.6],[-6,-3.3],[-4,0],[-6,3.3],[-14,2.6]],4.3,.45,hull,.18);
  for(let j=0;j<3;j++)box(-12+j*1.6,0,5.02,.65,3.3,.16,dark);
  // Merge static geometry by material to bound draw calls independent of detail count.
  for(const [mat,geos] of batches){let positions=[],normals=[];
    for(let g of geos){let q=g.index?g.toNonIndexed():g;const p=q.getAttribute('position'),n=q.getAttribute('normal');positions.push(...p.array);normals.push(...n.array);if(q!==g)q.dispose();g.dispose();}
    let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.computeBoundingSphere();if(mat===hull&&rec.patternCanvas){const p=g.attributes.position,uv=[];for(let i=0;i<p.count;i++)uv.push((-p.getY(i)+32)/64,(p.getX(i)+32)/64);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));}owned.add(g);
    const mesh=new T.Mesh(g,mat);mesh.name=mat.name||'inset emitters';root.add(mesh);(mat===light||mat===accent?glowMeshes:bodyMeshes).push(mesh);
  }
  const fm=new T.MeshBasicMaterial({color:new T.Color(rec.trail||rec.color||'#65fbd2'),transparent:true,opacity:.42,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide});
  const core=new T.MeshBasicMaterial({color:'#c8fff1',transparent:true,opacity:.72,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide});owned.add(fm);owned.add(core);
  for(const y of ((!parts.engine||parts.engine==='e_stock')?[-9,9]:[])){const outer=new T.Mesh(new T.ConeGeometry(1.65,1,16,1,true),fm),inner=new T.Mesh(new T.ConeGeometry(.65,1,12,1,true),core);
    for(const m of [outer,inner]){owned.add(m.geometry);m.rotation.z=Math.PI/2;m.position.set(-23.8,y,-.5);root.add(m);glowMeshes.push(m);}
    flames.push({outer,inner,x:-23.8,y,z:-.5,r:1.65});}
  for(const [slot,id]of Object.entries(parts))if(id&&!id.endsWith('_stock')){
    const f=buildFitting(T,id,{color:rec.color,width:14.1,tail:-22,shipId:'vanguard'});root.add(f.root);
    f.root.traverse(o=>{if(o.isMesh)(o.material.isMeshBasicMaterial?glowMeshes:bodyMeshes).push(o);});owned.add({dispose:f.dispose});
    if(slot==='engine')for(const n of f.nozzles){const outer=new T.Mesh(new T.ConeGeometry(n.r,1,16,1,true),fm),inner=new T.Mesh(new T.ConeGeometry(n.r*.45,1,12,1,true),core);for(const m of [outer,inner]){owned.add(m.geometry);m.rotation.z=Math.PI/2;m.position.set(n.x,n.y,n.z);root.add(m);glowMeshes.push(m);}flames.push({...n,outer,inner});}
  }
  return {root,bodyMeshes,glowMeshes,flames,disposables:[...owned]};
}
