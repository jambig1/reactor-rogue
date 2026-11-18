// v0.78 sector fleet silhouettes: each sector's fleet gets its own outline family (half profiles, mirrored),
// scaled per class. Neon Expanse keeps the original hulls; specialist roles keep their role shapes.
const sectorHullHalves={
 belt:[[20,0],[13,-6],[-3,-8],[-7,-12],[-18,-12],[-16,-5],[-21,-3]],
 storm:[[24,0],[8,-4],[3,-12],[-5,-8],[-18,-13],[-13,-3],[-20,-2]],
 foundry:[[18,0],[15,-8],[-2,-10],[-13,-10],[-20,-7],[-20,-2]],
 cryo:[[25,0],[7,-6],[0,-14],[-6,-6],[-20,-5],[-16,-1]],
 city:[[23,0],[18,-5],[0,-7],[-15,-10],[-21,-6],[-18,-1]],
 solar:[[24,0],[6,-5],[-4,-16],[-10,-10],[-22,-15],[-14,-3],[-19,-1]],
 rift:[[26,0],[1,-4],[-7,-18],[-14,-16],[-9,-5],[-20,-1]],
 hive:[[20,0],[16,-8],[6,-12],[-6,-12],[-16,-9],[-20,-4],[-22,-1]],
 ghost:[[20,0],[12,-4],[10,-10],[-4,-9],[-8,-13],[-18,-10],[-15,-4],[-21,-1]]};
const sectorHullScale=[[1,1],[1.12,1.35],[1.02,1.55],[1.12,1.95]];
const sectorHullCache={};
function enemyShape(e){if(e.role&&enemyRoleProfiles[e.role])return enemyRoleProfiles[e.role];let kind=Math.min(3,e.type||0),half=sectorHullHalves[e.sectorHull];if(!half)return enemyHullProfiles[kind];let key=e.sectorHull+kind,hit=sectorHullCache[key];if(hit)return hit;let [sx,sy]=sectorHullScale[kind],top=half.map(([x,y])=>[x*sx,y*sy]),bottom=top.slice(1).reverse().map(([x,y])=>[x,-y]).filter(([x,y])=>y!==0);return sectorHullCache[key]=[...top,...bottom]}
function drawIllustratedEnemyHull(e,t,paint=shipCanvasPainter){
 let {ctx,poly,circle,lineLocal}=paint,f=enemyFleetPaint[e.sectorHull]||enemyFleetPaint.grid;
 const role=e.role,kind=e.type||0,shape=enemyShape(e);
 const c=e.freeze>0?'#cbf5ff':e.c||f.trim,hull=e.glow>0&&graphicsFlash()>.5?'#e5f4ff':e.freeze>0?'#7facc3':f.hull,heavy=kind>=2;
 f={...f,edge:c};
 ctx.save();ctx.lineJoin='round';ctx.shadowBlur=0;
 // A dark cut edge, broad top planes and shaded undersides give volume at native size.
 poly(shape,'#0a1220','#03070e',3.6);poly(shape,hull,c,1.35);
 poly(shape.map(([x,y])=>[x*.82-1,y*.74+2]),f.shade);
 for(let side of [-1,1]){
  const y=side*(heavy?12:7),end=heavy?5:-2;
  poly([[-19,y-3],[end,y-3],[end+5,y],[-9,y+3],[-19,y+2]],f.shade);
  poly([[-17,y-3],[end,y-3],[end+3,y-1],[-14,y-1]],f.light);
  ctx.fillStyle='#091523';ctx.fillRect(-19,y-2,3,4);ctx.fillStyle=c;ctx.fillRect(-20,y-1,2,2);
  const flame=reducedMotion?4:4+1.7*Math.sin(t*19+(e.x||0)*.07+side);
  poly([[-21,y-1.4],[-21-flame,y],[-21,y+1.4]],c);
 }
 poly([[20,0],[4,-6],[-11,-5],[-15,0],[-9,5],[4,6]],hull);
 poly([[19,-.5],[3,-6],[-11,-5],[-7,-2],[4,-2]],f.light);
 poly([[18,1],[3,5],[-9,4],[-14,0],[-6,1]],f.shade);
 // Sector construction language changes actual fittings, rather than only tinting a shared hull.
 for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
  if(e.sectorHull==='belt'){poly([[-14,7],[-3,8],[1,12],[-12,12]],'#89735c',f.edge,.55);lineLocal(-11,8,-8,11,'#e2ba7e',1.4)}
  else if(e.sectorHull==='storm'){poly([[-12,8],[-17,17],[-9,14],[0,6]],f.light,f.edge,.5);lineLocal(-12,12,-6,8,c,1.1)}
  else if(e.sectorHull==='foundry'){poly([[-16,7],[-4,7],[0,12],[-17,12]],f.light);for(let j=0;j<3;j++)lineLocal(-13+j*4,8,-11+j*4,11,'#382b2e',1.5)}
  else if(e.sectorHull==='cryo'){poly([[-13,7],[-11,16],[3,8],[-4,6]],f.light,f.edge,.65);poly([[-10,10],[-9,13],[-2,9]],'#d4e8ed')}
  else if(extraSectors[e.sectorHull]?.fitting){extraSectors[e.sectorHull].fitting(e,f,c)}
  else if(e.sectorHull==='city'){poly([[-16,7],[-4,7],[0,11],[-15,11]],f.shade,f.edge,.55);lineLocal(-13,8,-5,8,c,1.2);ctx.fillStyle=f.light;ctx.fillRect(-12,10,5,1.5)}
  else{poly([[-13,7],[-5,6],[1,10],[-10,12]],f.light);lineLocal(-10,9,-4,8,c,1.2)}
 ctx.restore()}
 if(kind===1&&!role){for(let side of [-1,1]){poly([[-12,side*7],[-17,side*17],[-12,side*15],[2,side*6]],f.light);lineLocal(-14,side*14,-6,side*9,c,1.2)}}
 if(heavy&&!role){for(let side of [-1,1]){let y=side*(kind===3?16:12);poly([[-15,y-3],[6,y-3],[11,y],[5,y+3],[-16,y+3]],f.light,'#172536',.8);ctx.fillStyle=f.shade;ctx.fillRect(-11,y-1,15,2);lineLocal(4,y,17,y,'#afc4d2',2.5);lineLocal(14,y,18,y,c,1.2)}}
 // Distinct specialist equipment remains legible with bloom and particles disabled.
 if(role==='hunter'){for(let side of [-1,1])poly([[25,0],[6,side*5],[-4,side*10],[3,side*3]],f.light,f.edge,.65)}
 if(role==='interceptor'){for(let side of [-1,1]){poly([[-10,side*8],[-13,side*19],[-8,side*17],[-2,side*7]],f.light);lineLocal(-11,side*16,-6,side*10,c,1.4)}}
 if(role==='rail'){poly([[-9,-4],[22,-4],[30,-2],[30,2],[22,4],[-9,4]],f.light,'#132236',.9);ctx.fillStyle='#091523';ctx.fillRect(-4,-1.6,33,3.2);lineLocal(2,-2,24,-2,c,1.2);lineLocal(29,-3,29,3,c,1.6)}
 if(role==='carrier'){poly([[-12,-7],[1,-7],[7,0],[1,7],[-12,7]],f.light,f.edge,.7);circle(-4,0,5,'#152638');circle(-4,0,3,c);for(let side of [-1,1])poly([[-16,side*14],[5,side*13],[11,side*9],[2,side*10],[-16,side*11]],f.light,f.edge,.8)}
 if(role==='brood'){for(let side of [-1,1]){poly([[-20,side*12],[12,side*13],[17,side*18],[-22,side*18]],f.light,f.edge,.65);lineLocal(-17,side*16,10,side*16,'#091522',4);for(let j=0;j<3;j++){ctx.fillStyle=e.launchWarning>0?'#fff1c6':c;ctx.fillRect(-15+j*8,side*16-1,4,2)}}}
 if(role==='volatileShip'){for(let side of [-1,1]){poly([[-16,side*7],[0,side*7],[5,side*11],[0,side*14],[-16,side*14],[-20,side*10]],'#996b47','#e4bc87',.8);lineLocal(-13,side*10,-1,side*10,'#30292a',3);lineLocal(-11,side*10,-4,side*10,'#ffd49a',1.5)}}
 if(role==='minelayer'){for(let side of [-1,1])for(let j=0;j<3;j++){let x=-15+j*7;poly([[x,side*9],[x+3,side*12],[x,side*15],[x-3,side*12]],f.light,f.edge,.5);circle(x,side*12,1.2,c)}}
 if(role==='repair'){for(let side of [-1,1]){lineLocal(-2,side*5,8,side*12,f.light,3);circle(8,side*12,2.3,c)}lineLocal(-6,-3,-6,3,'#d2ffe1',2);lineLocal(-9,0,-3,0,'#d2ffe1',2)}
 if(!['rail','carrier','repair'].includes(role)){poly([[12,0],[2,-3],[-4,0],[2,3]],'#0a1a2b',f.edge,.6);poly([[9,0],[2,-1.4],[-1,0],[2,1.4]],c)}
 if(e.hp/e.max<.5){poly([[-9,-4],[-3,-2],[-7,2],[-11,1]],'#09111e');if(e.hp/e.max<.25)circle(-8,-1,1.3,'#ffbd82')}
 ctx.restore();
}
function drawSectorEnemyShip(e,t){drawEnemyShip(e,t)}
function drawEnemyShip(e,t){
 let a=e.role==='hunter'&&(e.huntWarning>0||e.huntDash>0)?e.roleAim:formationHeading(e,Math.atan2(s.p.y-e.y,s.p.x-e.x));
 ctx.save();ctx.translate(1.5,2.5);ctx.rotate(a);ctx.scale(e.r/20,e.r/20);ctx.globalAlpha=.38;poly(enemyShape(e),'#020711');ctx.restore();
 ctx.save();ctx.rotate(a);ctx.scale(e.r/20,e.r/20);drawIllustratedEnemyHull(e,t);ctx.restore();
}
// Presentation reads combat state; it never advances schedules, changes collision or consumes RNG.
const bossPresentations={
 'grid/warden':{label:'PRISM ARRAY',radial:true,body:[[30,0],[21,21],[0,30],[-21,21],[-30,0],[-21,-21],[0,-30],[21,-21]]},
 'grid/reaper':{label:'RAIL CARRIAGE',body:[[40,0],[17,-17],[-29,-17],[-39,0],[-29,17],[17,17]]},
 'grid/engine':{label:'SINGULARITY CORE',radial:true,body:[[26,0],[13,23],[-13,23],[-26,0],[-13,-23],[13,-23]]},
 'belt/corsair':{label:'GRAPPLE RIG',body:[[36,0],[14,-17],[-28,-20],[-38,-7],[-28,0],[-38,7],[-28,20],[14,17]]},
 'belt/crusher':{label:'BREAKER JAWS',body:[[30,-25],[44,-14],[34,0],[44,14],[30,25],[-26,25],[-39,12],[-39,-12],[-26,-25]]},
 'belt/dreadnought':{label:'SALVAGE FORTRESS',body:[[43,0],[25,-19],[9,-20],[-5,-32],[-36,-32],[-43,-17],[-35,0],[-43,17],[-36,32],[-5,32],[9,20],[25,19]]},
 'storm/keeper':{label:'RELAY HUB',radial:true,body:[[26,-17],[26,17],[17,26],[-17,26],[-26,17],[-26,-17],[-17,-26],[17,-26]]},
 'storm/conductor':{label:'ARC RESONATOR',radial:true,body:[[26,0],[0,26],[-26,0],[0,-26]]},
 'storm/citadel':{label:'STORM BASTION',radial:true,body:[[31,0],[16,27],[-16,27],[-31,0],[-16,-27],[16,-27]]},
 'foundry/harvester':{label:'SLAG INTAKE',body:[[35,0],[16,-18],[-27,-24],[-39,-13],[-32,0],[-39,13],[-27,24],[16,18]]},
 'foundry/warden':{label:'FURNACE BATTERY',body:[[36,0],[23,-23],[-28,-23],[-38,-12],[-32,0],[-38,12],[-28,23],[23,23]]},
 'foundry/forge':{label:'WORLD CRUCIBLE',radial:true,body:[[31,-21],[31,21],[21,31],[-21,31],[-31,21],[-31,-21],[-21,-31],[21,-31]]},
 'cryo/stalker':{label:'GLACIAL SPEAR',body:[[49,0],[6,-12],[-29,-30],[-35,-17],[-20,0],[-35,17],[-29,30],[6,12]]},
 'cryo/empress':{label:'CRYSTAL CROWN',radial:true,body:[[31,0],[0,30],[-31,0],[0,-30]]},
 'cryo/zero':{label:'ZERO-POINT LATTICE',radial:true,body:[[27,0],[14,24],[-14,24],[-27,0],[-14,-24],[14,-24]]},
 'city/interdictor':{label:'PATROL COMMAND',body:[[42,0],[11,-14],[-13,-29],[-35,-30],[-28,-12],[-36,0],[-28,12],[-35,30],[-13,29],[11,14]]},
 'city/enforcer':{label:'SIEGE PRECINCT',body:[[31,0],[18,-20],[-11,-23],[-34,-14],[-38,0],[-34,14],[-11,23],[18,20]]},
 'city/overlord':{label:'METROPLEX CONTROL',radial:true,body:[[30,-22],[30,22],[22,30],[-22,30],[-30,22],[-30,-22],[-22,-30],[22,-30]]}
};
function bossPresentation(e){return bossPresentations[(e.sectorBoss||'grid')+'/'+e.kind]||bossPresentations['grid/warden']}
function bossChargeProgress(e){return e.charge>0?clamp(1-e.charge/(e.sectorBoss?1.5:1.2),0,1):0}
function bossSignal(e){if(e.arrival>0)return 'CONTACT INBOUND';if(e.endlessShield&&e.shielded)return 'SHIELDED · DESTROY THE SHIELD SYSTEMS';if(e.freeze>0)return 'REACTOR FROZEN';if(e.charge>0)return 'ATTACK CHARGING';if(e.burst>0)return 'DISCHARGING';return e.hp<e.max*.5?'OVERDRIVE ACTIVE':'REACTOR ACTIVE'}
function drawIllustratedBossHull(e,t,paint=shipCanvasPainter){
 const {ctx,poly,circle,lineLocal}=paint,id=e.sectorBoss||'grid',kind=e.kind,design=bossPresentation(e),f=enemyFleetPaint[id]||enemyFleetPaint.grid;
 const c=e.freeze>0?'#d4f7ff':e.c,hot=e.hp<e.max*.5,charge=bossChargeProgress(e),lit=e.charge>0,clock=reducedMotion||e.freeze>0?0:t;
 const metal=e.glow>0&&graphicsFlash()>.5?'#e7f4ff':e.freeze>0?'#90b5c9':f.hull;
 const half=(pts,y,upper)=>{let out=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length],inside=upper?a[1]<=y:a[1]>=y,next=upper?b[1]<=y:b[1]>=y;if(inside)out.push(a);if(inside!==next){let k=(y-a[1])/(b[1]-a[1]);out.push([a[0]+(b[0]-a[0])*k,y])}}return out};
 const accentFill=fill=>fill!==metal&&fill!==f.shade&&fill!==f.hull;
 const panel=(points,fill=metal)=>{if(bossArtV2(e)){let ac=accentFill(fill);bossArt.hull(points,e,{edgeAlpha:ac?.95:.7,light:ac?bossArtMix(fill,.55):undefined,dark:ac?bossArtMix(fill,.2):undefined});{let xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),hh=Math.max(...ys)-Math.min(...ys);if(w*hh>180){let cx=xs.reduce((a,b)=>a+b,0)/xs.length,cy=ys.reduce((a,b)=>a+b,0)/ys.length,along=w>=hh;lineLocal(cx-(along?w*.28:0),cy-(along?0:hh*.28),cx+(along?w*.28:0),cy+(along?0:hh*.28),'#03070e',1.2);for(let k of [-1,1])circle(cx+(along?k*w*.36:0),cy+(along?0:k*hh*.36),.9,'rgba(200,230,255,.35)')}}if(e.glow>0&&graphicsFlash()>.5){ctx.save();ctx.globalAlpha=.3;poly(points,'#e7f4ff');ctx.restore()}return}poly(points,fill,'#08111f',2.5);let x=points.reduce((v,p)=>v+p[0],0)/points.length,y=points.reduce((v,p)=>v+p[1],0)/points.length,inset=points.map(p=>[x+(p[0]-x)*.88,y+(p[1]-y)*.82]);poly(inset,fill);let top=half(inset,y-1,true),bottom=half(inset,y+2,false);if(top.length>2)poly(top,e.glow>0&&graphicsFlash()>.5?'#f3fbff':f.light);if(bottom.length>2)poly(bottom,f.shade);lineLocal(...points[0],...points[1],f.edge,.8)};
 const slot=(x,y,w=10)=>{if(bossArtV2(e)){lineLocal(x,y,x+w,y,'#03070e',3.6);ctx.save();ctx.shadowColor=c;ctx.shadowBlur=graphicsShadow(lit?8:4);lineLocal(x+1,y,x+w-1,y,hot?'#ffce92':c,lit?2.1:1.3);ctx.restore();return}lineLocal(x,y,x+w,y,'#0a1727',3.5);lineLocal(x+1,y,x+w-1,y,hot?'#ffce92':c,lit?2.1:1.2)};
 const core=(r=12)=>{
  if(bossArtV2(e)){bossArt.core(r*.8,e,clock,{charge});ctx.save();ctx.globalAlpha=.85;
   if(id==='belt'){for(let i=-1;i<=1;i++)lineLocal(i*r*.35,-r*.45,i*r*.35,r*.45,'#03070e',1.6)}
   else if(id==='storm'){ctx.rotate(clock*.8);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);lineLocal(r*.3,0,r*.75,0,'#ffffff',1.2)}}
   else if(id==='foundry'){for(let i=-1;i<=1;i++)lineLocal(-r*.5,i*r*.32,r*.5,i*r*.32,'#03070e',1.5)}
   else if(id==='cryo'){poly([[0,-r*.75],[r*.5,0],[0,r*.75],[-r*.5,0]],'#ffffffcc','#03070e',1);poly([[0,-r*.75],[r*.5,0],[0,0]],c)}
   else if(id==='city'){ctx.strokeStyle='#03070e';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,r*.45,0,TAU);ctx.stroke()}
   ctx.restore();bossArt.chargeRing(r+5,e,charge);return}
  circle(0,0,r+4,f.shade);circle(0,0,r+2,f.edge,false);circle(0,0,r,'#081523');
  if(id==='cryo'||id==='grid'&&kind==='warden'){poly([[0,-r],[r*.7,0],[0,r],[-r*.7,0]],c,f.edge,.7);poly([[0,-r],[-r*.7,0],[0,r*.25]],'#d5edf5');poly([[0,r*.25],[r*.7,0],[0,r]],f.shade);poly([[0,-r*.4],[r*.25,0],[0,r*.2],[-r*.25,0]],lit?'#fff7dd':'#e1f4ff')}
  else if(id==='belt'){panel([[-r*.8,-r*.55],[r*.8,-r*.55],[r*.8,r*.55],[-r*.8,r*.55]]);for(let i=-1;i<=1;i++)lineLocal(i*r*.45,-r*.4,i*r*.45,r*.4,lit?'#fff0ca':c,2.5)}
  else if(id==='storm'){circle(0,0,r*.72,c,false);for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);lineLocal(r*.65,-2,r,-2,f.light,3);ctx.restore()}circle(0,0,r*.4,lit?'#effaff':c)}
  else if(id==='city'){poly([[-r*.6,-r*.7],[r*.4,-r*.7],[r*.8,0],[r*.4,r*.7],[-r*.6,r*.7],[-r*.8,0]],f.light);circle(0,0,r*.58,'#081523');circle(1,0,r*.35,c);circle(0,-1,r*.12,'#ecf8ff')}
  else if(id==='foundry'&&kind!=='forge'){for(let i=-1;i<=1;i++){lineLocal(-r*.65,i*r*.45,r*.65,i*r*.45,f.light,3.3);lineLocal(-r*.4,i*r*.45,r*.4,i*r*.45,lit?'#fff0c4':c,1.6)}}
  else{for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);poly([[r*.4,-2],[r-1,-3],[r+1,2],[r*.4,3]],f.light);ctx.restore()}circle(0,0,r*(lit?.45+charge*.25:.35),hot?'#ffe1aa':c);circle(-1,-1,r*.12,'#f2faff')}
  if(lit){ctx.lineWidth=2;ctx.strokeStyle='#fff0c9';ctx.beginPath();ctx.arc(0,0,r+5,-Math.PI/2,-Math.PI/2+Math.max(.02,charge*TAU));ctx.stroke()}
 };
 ctx.save();ctx.lineJoin='round';ctx.shadowBlur=0;
 if(bossArtV2(e)&&design.radial){ctx.save();ctx.globalAlpha=.35;ctx.translate(4,7);circle(0,0,46,'#01040a');ctx.restore()}
 // Large articulated assemblies establish identity before the central armour is painted.
 if(design.radial){let n=id==='grid'?(kind==='engine'?3:8):id==='storm'?(kind==='keeper'?4:kind==='conductor'?3:6):id==='foundry'?4:id==='cryo'?(kind==='empress'?4:6):4;
  for(let i=0;i<n;i++){ctx.save();ctx.rotate(i*TAU/n+(id==='cryo'?Math.PI/4:0));
   if(id==='cryo'){panel([[18,-5],[36,-12],[51,0],[36,9],[18,5]]);poly([[29,-5],[47,0],[34,3]],'#c4dce8');slot(29,0,9)}
   else if(id==='storm'&&kind==='conductor'){panel([[16,-6],[46,-15],[50,-10],[31,-3],[50,7],[46,13],[16,6]]);slot(28,-7,13);slot(28,5,13)}
   else if(id==='grid'&&kind==='engine'){panel([[17,-10],[36,-20],[49,-9],[43,12],[23,15]]);circle(35,-2,6,'#102033');circle(35,-2,3,hot?'#ffdc9f':c);lineLocal(25,-10,38,-14,f.edge,1.2)}
   else if(id==='city'){panel([[19,-9],[36,-13],[47,-7],[47,7],[36,13],[19,9]]);slot(29,-4,12);slot(29,4,12);panel([[32,-13],[40,-19],[46,-17],[44,-9]])}
   else if(id==='foundry'){panel([[19,-12],[43,-15],[49,-6],[49,6],[43,15],[19,12]]);for(let j=0;j<3;j++)slot(29,-7+j*7,13)}
   else{panel([[19,-6],[36,-10],[48,-5],[48,5],[36,10],[19,6]]);circle(37,0,5,'#102034');circle(37,0,3,lit?'#fff0c4':c);slot(24,-4,8)}ctx.restore()}
 }
 if(!design.radial){for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
  if(id==='grid'){panel([[-30,20],[27,20],[48,26],[27,32],[-30,32]]);slot(-23,25,54);panel([[-27,32],[5,32],[12,38],[-26,38]])}
  else if(id==='belt'&&kind==='corsair'){panel([[-22,19],[23,18],[47,32],[44,46],[35,43],[37,33],[17,28],[-25,28]]);lineLocal(-14,23,21,23,'#d7b58b',2)}
  else if(id==='belt'&&kind==='crusher'){panel([[13,19],[33,22],[51,12],[52,27],[27,39],[8,30]]);panel([[29,29],[43,24],[45,29],[31,35]],'#b59b76');slot(-24,21,20)}
  else if(id==='belt'){panel([[-36,26],[13,26],[29,36],[13,43],[-38,43]]);for(let j=0;j<3;j++){panel([[-23+j*15,25],[-15+j*15,25],[-11+j*15,34],[-24+j*15,34]]);slot(-21+j*15,30,7)}}
  else if(id==='foundry'&&kind==='harvester'){panel([[-25,20],[17,19],[46,28],[42,44],[33,40],[35,31],[11,28],[-27,30]]);for(let j=0;j<3;j++)lineLocal(-16+j*9,23,-13+j*9,28,'#f0ba80',2)}
  else if(id==='foundry'){panel([[-29,19],[20,19],[35,28],[21,38],[-31,38]]);for(let j=0;j<4;j++)slot(-23+j*11,28,6);panel([[23,22],[46,22],[49,26],[44,30],[23,30]])}
  else if(id==='cryo'){panel([[-27,15],[-15,30],[9,24],[28,13],[1,17]]);poly([[-16,23],[7,21],[-6,27]],'#bad6e2')}
  else if(kind==='interdictor'){panel([[-29,18],[-9,25],[13,12],[-5,15]]);slot(-23,22,9);panel([[6,13],[32,12],[35,16],[25,19],[7,18]])}
  else{panel([[-31,19],[21,19],[44,28],[37,38],[-31,38]]);panel([[-15,23],[33,23],[43,27],[33,31],[-15,31]]);slot(-10,27,45)}
 ctx.restore()}}
 if(bossArtV2(e)){bossArt.hull(design.body,e,{glow:10,edgeWidth:1.6});bossArt.hull(design.body.map(p=>[p[0]*.68,p[1]*.68]),e,{dark:bossArtMix(bossArtPalette(e).plateDark,.7),light:bossArtPalette(e).plateDark,edgeAlpha:.4,key:2});let far=design.body.reduce((m,p)=>Math.hypot(...p)>Math.hypot(...m)?p:m,design.body[0]);for(let k of design.radial?[0,1,2,3]:[0]){ctx.save();ctx.rotate(k*Math.PI/2);bossArt.light(far[0]*.84,far[1]*.84,1.6,c,.55+.45*Math.sin(clock*3+k*1.6));ctx.restore()}}else panel(design.body);
 // Sector machinery sits in the open centre of each unique frame.
 if(id==='belt'){for(let side of [-1,1]){slot(-24,side*12,24);panel([[-27,side*7],[-12,side*7],[-8,side*11],[-27,side*11]])}for(let i=0;i<3;i++)lineLocal(-24+i*7,-6,-24+i*7,6,'#1a2330',2);core(kind==='dreadnought'?13:10)}
 else if(id==='foundry'){for(let side of [-1,1]){panel([[-21,side*9],[15,side*9],[20,side*16],[-22,side*16]]);for(let j=0;j<4;j++)slot(-16+j*8,side*13,5)}core(kind==='forge'?16:11)}
 else if(id==='cryo'){for(let side of [-1,1])poly([[3,side*5],[-19,side*17],[-9,side*3]],f.shade);core(kind==='zero'?16:11);if(kind==='zero'){ctx.save();ctx.rotate(-clock*.12);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);lineLocal(20,-4,25,-4,c,1.4);ctx.restore()}ctx.restore()}}
 else if(id==='city'){for(let side of [-1,1]){slot(-22,side*12,14);slot(7,side*12,12)}core(kind==='overlord'?15:10);if(kind==='interdictor'){lineLocal(16,-3,26,-3,'#e7afce',2.5);lineLocal(16,3,26,3,'#a9dfef',2.5)}}
 else{core(kind==='engine'?17:kind==='citadel'?15:12);if(kind==='reaper'){panel([[-19,-7],[24,-7],[34,-3],[34,3],[24,7],[-19,7]]);slot(-12,0,43);circle(-15,0,3,c)}}
 // Overdrive opens bright cooling seams; only the rotor motion obeys the animation clock.
 for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);if(hot){panel([[13,-3],[22,-5],[25,-1],[18,2]],f.shade);slot(16,-1,6)}ctx.restore()}
 if(bossArtV2(e))bossArt.damage(e,clock,36);else if(e.hp/e.max<.3){poly([[-16,-7],[-6,-4],[-11,1],[-18,0]],'#070f1b');lineLocal(-15,-5,-9,-3,'#ffc18e',1)}
 ctx.restore();
}