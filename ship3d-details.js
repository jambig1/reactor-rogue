// Each hull has its own service panel positions and vent grouping.
const markings={
 vanguard:[.27,.54,.73,4], wasp:[.19,.39,.63,5], bastion:[.24,.48,.76,3],
 harrier:[.18,.56,.73,3], glacier:[.26,.42,.67,6], tempest:[.22,.55,.82,4],
 scavenger:[.32,.57,.70,5], spectre:[.17,.40,.78,3], architect:[.21,.49,.77,4],
 helios:[.25,.43,.69,6], echo:[.29,.51,.74,3], sovereign:[.21,.46,.72,5]
};

// Cast onto the actual skin, so marks follow both smooth and faceted hulls.
// Three small batches per ship keep the detailing independent from paint UVs.
export function addHullDetails(T, surface, stations, centreY, id, batches, face='both') {
 const start=stations[0][0],length=stations.at(-1)[0]-start;
 if(length<15||Math.max(...stations.map(s=>s[1]))<2.75)return;
 const [engine,service,nose,vents]=markings[id]||markings.vanguard;
 const ray=new T.Raycaster();
 const skin=new T.Mesh(surface);
 // Geometry already contains its model-space offset and uses outward winding.
 const point=(u,fraction)=>{
  const x=start+u*length;
  let i=stations.findIndex(s=>s[0]>=x)-1;
  i=Math.max(0,Math.min(i,stations.length-2));
  const t=(x-stations[i][0])/(stations[i+1][0]-stations[i][0]);
  const width=stations[i][1]+t*(stations[i+1][1]-stations[i][1]);
  return [x,centreY+fraction*width];
 };
 let sideZ=1;
 const sample=(x,y)=>{
  ray.ray.origin.set(x,y,80*sideZ);
  ray.ray.direction.set(0,0,-sideZ);
  const hit=ray.intersectObject(skin,false)[0];
  return hit&&[x,y,hit.point.z+.065*sideZ];
 };
 function line(a,b,width,layer){
  const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
  if(length<.001)return;
  const ox=-dy/length*width/2,oy=dx/length*width/2;
  let prev;
  const steps=Math.max(1,Math.ceil(length/.65));
  for(let i=0;i<=steps;i++){
   const x=a[0]+dx*i/steps,y=a[1]+dy*i/steps;
   const pair=[sample(x+ox,y+oy),sample(x-ox,y-oy)];
   if(prev?.every(Boolean)&&pair.every(Boolean)){
    const [a,b]=prev,[c,d]=pair;
    batches[layer].push(...(sideZ===1?[...a,...b,...d,...a,...d,...c]:[...a,...d,...b,...a,...c,...d]));
   }
   prev=pair;
  }
 }
 const path=(ps,width,layer)=>{for(let i=1;i<ps.length;i++)line(point(...ps[i-1]),point(...ps[i]),width,layer);};
 if(face!=='bottom'){
 for(const side of [-1,1]){
  // Interrupted armour joints leave the canopy and main silhouette readable.
  path([[.12,.65*side],[.32,.72*side],[.55,.62*side],[.68,.48*side]],.15,0);
  path([[.33,.67*side],[.39,.57*side],[.55,.57*side]],.067,1);
  path([[service-.11,.35*side],[service-.08,.66*side],[service+.01,.67*side],[service+.04,.37*side],[service-.11,.35*side]],.13,0);
  path([[service-.06,.43*side],[service-.032,.43*side]],.18,1);
  for(let j=0;j<vents;j++){
   const x=engine+j*Math.min(.016, .10/vents);
   path([[x,.29*side],[x+.012,.52*side]],id==='bastion'?.27:.19,0);
  }
  for(let j=0;j<3;j++){
   const x=nose+j*.018;
   path([[x,.42*side],[x+.014,.57*side]],.17,2);
  }
 }
 // Functional service markings differ by role, even with stock fittings.
 const emblem={
  wasp:[[0,-.15],[.045,0],[0,.15]],
  bastion:[[0,-.2],[0,.2],[.035,.2],[.035,-.2],[0,-.2]],
  harrier:[[0,-.22],[.035,-.11],[0,0],[.035,.11],[0,.22]],
  glacier:[[0,-.17],[.055,.17],[.055,-.17],[0,.17]],
  tempest:[[0,-.18],[.045,-.045],[.017,.025],[.06,.18]],
  scavenger:[[0,-.18],[.04,-.18],[.04,.18],[.07,.18]],
  spectre:[[0,-.17],[.06,0],[0,.17],[.018,0],[0,-.17]],
  architect:[[0,-.2],[.046,-.2],[.046,.2],[0,.2],[0,-.2],[.046,.2]],
  helios:[[0,0],[.027,-.19],[.054,0],[.027,.19],[0,0]],
  echo:[[0,-.18],[.014,-.12],[.014,-.05],[.045,0],[.014,.05],[.014,.12],[0,.18]],
  sovereign:[[0,-.2],[.045,-.1],[.01,0],[.045,.1],[0,.2]],
  vanguard:[[0,-.17],[.048,0],[0,.17],[.048,0],[.074,0]]
 }[id];
 if(emblem)path(emblem.map(([x,y])=>[nose-.07+x,y]),.14,1);
 }
 if(face!=='top'){
  sideZ=-1;
  // [bay centre, bay length, lateral offset, rail length, vent count]
  const layouts={
   vanguard:[.41,.17,.39,.19,4],wasp:[.32,.12,.38,.24,3],bastion:[.5,.24,.44,.18,5],
   harrier:[.35,.12,.54,.22,3],glacier:[.38,.23,.47,.25,6],tempest:[.44,.14,.55,.24,4],
   scavenger:[.42,.21,.48,.12,5],spectre:[.36,.12,.33,.3,3],architect:[.46,.27,.37,.12,4],
   helios:[.31,.17,.45,.29,6],echo:[.47,.17,.53,.15,4],sovereign:[.46,.25,.43,.21,5]
  };
  const [bay,span,lateral,rail,grilles]=layouts[id]||layouts.vanguard;
  for(const side of [-1,1]){
   const centre=bay+(id==='scavenger'&&side===-1?.075:0),left=centre-span/2,right=centre+span/2;
   const inner=(lateral-.24)*side,outer=(lateral+.28)*side;
   // Stepped skid plate and a dark maintenance bay with metal louvres.
   path([[left-.05,inner*.64],[left-.025,outer],[right,outer],[right+.04,inner*.9]],.24,1);
   path([[left,inner],[right,inner],[right-.022,outer],[left+.022,outer],[left,inner]],.21,0);
   line(point(left+.03,lateral*side),point(right-.03,lateral*side),.78,0);
   for(let i=0;i<grilles;i++){
    const x=left+span*(i+1)/(grilles+1);
    path([[x,inner+.05*side],[x+.009,outer-.05*side]],.16,1);
   }
   path([[.13,outer*.88],[.17,outer],[.17+rail,outer]],.17,2);
   path([[.72,inner],[.75,outer*.77],[.79,outer*.67],[.81,inner]],.15,0);
   path([[.76,outer*.45],[.79,outer*.45]],.19,2);
  }
  // Centreline seams stay visible between the landing rails.
  path([[.23,0],[.35,0]],.19,1);
  path([[.60,0],[.66,0]],.19,1);
 }
 skin.material.dispose();
}

export function hullDetailGeometry(T, positions) {
 const g=new T.BufferGeometry();
 g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
 g.computeVertexNormals();
 return g;
}
