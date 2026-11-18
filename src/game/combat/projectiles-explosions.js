function projectileBase(b,t){drawWeaponProjectile(b,t)}





function drawProjectile(b,t){drawWeaponProjectile(b,t)}
function drawEvolvedAreas(t){for(let m of s.mines)if(s.evolved.mines){ctx.save();ctx.translate(m.x,m.y);for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4);poly([[10,-2],[17,0],[10,2]],'#314251','#ffe6bc',.8);ctx.restore()}ctx.restore()}}

// Visual-only explosions: combat damage, loot and RNG are untouched.
function combatExplosion(x,y,r,color='#ffb47e',kind='impact'){if(!s)return;let radius=clamp(r,15,190),seed=x*.037+y*.019+s.t*.7,life=radius>90?1.1:radius>45?.8:.48;
s.combatBlasts=s.combatBlasts||[];s.blastShards=s.blastShards||[];
// Merge overlapping same-frame impacts to keep weapon-heavy runs readable.
let recent=s.combatBlasts.find(b=>b.life>b.max-.04&&Math.hypot(x-b.x,y-b.y)<Math.min(radius,b.r)*.35);if(recent){if(radius<=recent.r)return;recent.life=0}
try{fxExplosion(x,y,radius,color,kind)}catch(e){}s.combatBlasts.push({x,y,r:radius,c:color,kind,seed,life,max:life});if(s.combatBlasts.length>48)s.combatBlasts.shift();if(radius>50)addAftermath(x,y,radius*.7);
if(graphicsParticles()>0&&graphicsDetailed()){let count=Math.ceil((radius>90?14:radius>45?9:5)*graphicsParticles());for(let i=0;i<count&&s.blastShards.length<Math.round(180*graphicsParticles());i++){let a=i*TAU/count+seed,v=40+radius*(1+(i%3)*.35),duration=.55+(i%4)*.14;s.blastShards.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,a,spin:i%2?2.4:-1.9,r:2+(i%3),life:duration,max:duration,c:i%3?color:'#ffe7b5'})}}}
function updateCombatExplosions(dt){for(let b of s.combatBlasts||[])b.life-=dt;s.combatBlasts=(s.combatBlasts||[]).filter(b=>b.life>0);for(let p of s.blastShards||[]){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-2*dt);p.vy*=Math.exp(-2*dt);p.a+=p.spin*dt}s.blastShards=(s.blastShards||[]).filter(p=>p.life>0)}
function drawBossReactorDebris(b,age){if(b.kind!=='boss')return;ctx.save();ctx.translate(b.x,b.y);ctx.shadowBlur=0;ctx.globalAlpha=(1-age)*.8;let spread=b.r*(reducedMotion?.45:.22+age*.65);for(let i=0;i<6;i++){ctx.save();let a=i*TAU/6+b.seed;ctx.translate(Math.cos(a)*spread,Math.sin(a)*spread);ctx.rotate(a+(reducedMotion?0:age*(i%2?1:-1)));let size=6+(i%3)*3;poly([[-size,-3],[size*.4,-size*.5],[size,1],[0,size*.5]],'#526276','#142033',1);lineLocal(-size*.5,-2,size*.4,-size*.4,b.c,1);ctx.restore()}ctx.restore()}
function drawShipBreakup(b,age){if(b.kind!=='ship'||graphicsParticles()<=0)return;ctx.save();ctx.translate(b.x,b.y);ctx.shadowBlur=0;ctx.globalAlpha=(1-age)*.8;let count=attackArtDetailed()?4:2;for(let i=0;i<count;i++){let a=b.seed+i*TAU/count,spread=b.r*(reducedMotion?.38:.18+age*.65),size=Math.min(8,2+b.r*.065);ctx.save();ctx.translate(Math.cos(a)*spread,Math.sin(a)*spread);ctx.rotate(a+(reducedMotion?0:age*(i%2?1.4:-1.4)));poly([[-size,-2],[size*.5,-size*.5],[size,1],[0,size*.6]],'#526778','#142335',.8);lineLocal(-size*.4,-1,size*.5,-size*.4,b.c,.7);ctx.restore()}ctx.restore()}
function drawCombatExplosions(){for(let b of s.combatBlasts||[]){if(Math.abs(b.x-s.p.x)>W/2+b.r*2||Math.abs(b.y-s.p.y)>H/2+b.r*2)continue;let age=1-b.life/b.max,fade=1-age,expand=reducedMotion?.65:1-Math.pow(1-age,2),radius=Math.max(2,b.r*expand);drawBossReactorDebris(b,age);drawShipBreakup(b,age);if(!graphicsDetailed()){ctx.save();ctx.globalAlpha=fade*.65;ctx.lineWidth=1.5;circle(b.x,b.y,radius,b.c,false);circle(b.x,b.y,Math.max(1,radius*.2),b.c);ctx.restore();continue}ctx.save();ctx.translate(b.x,b.y);ctx.globalAlpha=fade;ctx.shadowBlur=graphicsShadow(0);
// Soft reactor bloom with a short white-hot core, rather than a screen flash.
let bloom=ctx.createRadialGradient(0,0,0,0,0,radius);bloom.addColorStop(0,'#fff1d0b0');bloom.addColorStop(.16,b.kind==='ice'?'#c6f5ffb0':'#ffd894c0');bloom.addColorStop(.45,b.kind==='ice'?'#62d2ff70':'#ff924978');bloom.addColorStop(1,b.kind==='ice'?'#42c4ff00':'#ff493000');circle(0,0,radius,bloom);
if(!reducedMotion&&age<.65){let lobes=b.r>65?7:3;ctx.globalAlpha=fade*Math.max(0,1-age/.65);for(let i=0;i<lobes;i++){let a=i*TAU/lobes+b.seed,spread=radius*.4,puff=b.r*(.12+.06*Math.sin(i*2.3+b.seed))*(1-age*.4);circle(Math.cos(a)*spread,Math.sin(a)*spread,Math.max(1,puff),b.kind==='ice'?'#8edfff55':'#ff984b66')}ctx.globalAlpha=fade}
ctx.shadowColor=b.c;ctx.shadowBlur=graphicsShadow(reducedMotion?0:12);ctx.lineWidth=age<.25?2.5:1.3;circle(0,0,radius,b.c,false);ctx.globalAlpha=fade*.45;ctx.lineWidth=1;circle(0,0,Math.max(1,radius*.72),'#ffe6c2',false);
if(b.r>65){ctx.save();ctx.scale(1,.32);ctx.globalAlpha=fade*.7;ctx.lineWidth=2;circle(0,0,radius*1.35,b.c,false);ctx.restore()}
// Broken arcs and outward streaks distinguish a detonation from a shield ring.
ctx.shadowBlur=graphicsShadow(0);if(!reducedMotion){for(let i=0;i<8;i++){let a=i*TAU/8+b.seed;ctx.globalAlpha=fade*.6;ctx.strokeStyle=i%2?b.c:'#ffe6b7';ctx.lineWidth=i%3===0?2:1;ctx.beginPath();ctx.arc(0,0,radius*(.85+(i%3)*.05),a,a+.17);ctx.stroke();let inner=radius*(.5+age*.3),outer=radius*(.8+age*.35);ctx.beginPath();ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);ctx.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);ctx.stroke()}}
let core=Math.max(0,1-age*3);if(core>0){ctx.globalAlpha=core*.8;circle(0,0,Math.max(1,b.r*.16*core),'#fff8e6');if(!reducedMotion){ctx.strokeStyle='#fff3cf';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-b.r*.6*core,0);ctx.lineTo(b.r*.6*core,0);ctx.stroke()}}ctx.restore()}
if(graphicsParticles()>0&&graphicsDetailed())for(let p of s.blastShards||[]){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.strokeStyle=p.c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-p.r*3,0);ctx.lineTo(0,0);ctx.stroke();poly([[-p.r,-p.r*.5],[p.r,0],[-p.r*.4,p.r]],'#233043',p.c,.8);circle(p.r,0,1,'#ffd995');ctx.restore()}}
function addAftermath(x,y,r){if(!s)return;let radius=clamp(r*.65,20,120),recent=s.smoke.find(c=>Math.hypot(c.x-x,c.y-y)<Math.min(40,radius*.5)&&c.max-c.life<.3);if(recent)return;
s.scorches.push({x,y,r:radius,life:6,max:6,angle:(x*.7+y*.31)%TAU});if(s.scorches.length>48)s.scorches.shift();
if(graphicsVisual.smoke==='off')return;s.smoke.push({smoke:true,x,y,r:radius*.85,life:8,max:8,seed:x*.03+y*.07});if(s.smoke.length>18)s.smoke.shift()}
function updateAftermath(dt){updateCombatExplosions(dt);for(let mark of s.scorches)mark.life-=dt;s.scorches=s.scorches.filter(m=>m.life>0);for(let cloud of s.smoke){cloud.life-=dt;if(!reducedMotion){cloud.x+=(3+Math.sin(s.t*.3+cloud.seed)*2)*dt;cloud.y-=4*dt;cloud.r=Math.min(150,cloud.r+2*dt)}}s.smoke=s.smoke.filter(c=>c.life>0)}
function drawScorches(){ctx.save();ctx.globalCompositeOperation='lighter';for(let m of s.scorches){if(Math.abs(m.x-s.p.x)>W/2+m.r||Math.abs(m.y-s.p.y)>H/2+m.r)continue;
 // v0.78: explosions leave a warm afterglow and drifting embers that fade, not a black burn mark (which read as holes in painted space).
 let age=m.max-m.life,glow=Math.max(0,1-age/1.8),fade=Math.min(1,m.life/(m.max*.6));ctx.save();ctx.translate(m.x,m.y);
 if(glow>0){ctx.globalAlpha=glow;let g=ctx.createRadialGradient(0,0,0,0,0,m.r*(.7+.3*(1-glow)));g.addColorStop(0,'rgba(255,190,110,.34)');g.addColorStop(.45,'rgba(255,120,60,.16)');g.addColorStop(1,'rgba(255,90,40,0)');circle(0,0,m.r,g)}
 ctx.globalAlpha=fade*.8;for(let i=0;i<7;i++){let a=i*2.39+m.angle,d=m.r*(.35+.55*Math.min(1,age/m.max*2.2))*(.7+.3*((i*37)%10)/10),fl=reducedMotion?.7:.55+.45*Math.sin(age*6+i*1.7);ctx.globalAlpha=fade*.75*fl;ctx.fillStyle=i%3?'#ffb46a':'#ffe2a8';ctx.fillRect(Math.cos(a)*d-1,Math.sin(a)*d-1,i%2?2:3,i%2?2:3)}
 ctx.restore()}ctx.restore()}
function drawSmoke(c,t){if(graphicsVisual.smoke==='off')return;if(Math.abs(c.x-s.p.x)>W/2+c.r||Math.abs(c.y-s.p.y)>H/2+c.r)return;ctx.save();let age=c.max-c.life,fade=Math.min(1,age/.18,c.life/2),clock=reducedMotion?0:t;
ctx.globalAlpha=fade;for(let i=0;i<(graphicsVisual.smoke==='reduced'?3:7);i++){let p=gasLobe(c,i,clock),f=c.flow&&c.flow[i],x=p.x+(f?f.x:0),y=p.y+(f?f.y:0),r=c.r*(.38+.05*Math.sin(clock*.6+i));let g=ctx.createRadialGradient(x-r*.1,y-r*.2,0,x,y,r);g.addColorStop(0,'#84909e28');g.addColorStop(.4,'#59667425');g.addColorStop(.75,'#303c4d16');g.addColorStop(1,'#25344600');circle(x,y,r,g)}
if(!reducedMotion&&graphicsVisual.smoke==='full')for(let w of c.wakes||[]){ctx.globalAlpha=fade*w.life/w.max*.14;ctx.save();ctx.translate(w.x,w.y);ctx.rotate(w.a);ctx.strokeStyle='#c1cbd5';ctx.lineWidth=1;for(let side of [-1,1]){ctx.beginPath();ctx.arc(-w.r*.4,side*w.r*.6,w.r*.55,side<0?0:Math.PI,side<0?Math.PI*1.3:Math.PI*2.3);ctx.stroke()}ctx.restore()}ctx.restore()}

function gasLobe(c,i,t){let seed=c.x*.017+c.y*.031,phase=i*2.399+seed,drift=t*(.2+(i%3)*.07),angle=phase+Math.sin(drift+phase)*.3,reach=c.r*(.15+(i%4)*.135);return {x:c.x+Math.cos(angle)*reach+Math.sin(t*.65+phase)*c.r*.05,y:c.y+Math.sin(angle)*reach+Math.cos(t*.5+phase)*c.r*.045}}
function gasBlast(x,y,r,power=220,canIgnite=true){chargeScrap(x,y,r);if(s&&canIgnite){addAftermath(x,y,r);combatExplosion(x,y,r,'#ffb47e','impact')}if(s){for(let e of s.enemies){let d=Math.hypot(e.x-x,e.y-y);if(d<r+e.r)knock(e,e.x-x,e.y-y,power*(1-d/(r+e.r)))}for(let o of [...s.debris]){let d=Math.hypot(o.x-x,o.y-y);if(o.hp>0&&d<r+o.r){o.blastCharge=2;o.impactHits=new Set;knock(o,o.x-x,o.y-y,power*.8);hitDebris(o,18+power*.1)}}}if(s&&canIgnite)igniteNear(x,y,r);if(reducedMotion||!s||(!s.clouds.length&&!s.smoke.length))return;if(!s.gasBlasts)s.gasBlasts=[];if(s.gasBlasts.length<32)s.gasBlasts.push({x,y,r,power})}
function gasBeam(a,b){if(reducedMotion||!s||(!s.clouds.length&&!s.smoke.length))return;if(!s.gasBeams)s.gasBeams=[];if(s.gasBeams.length<16)s.gasBeams.push({x:a.x,y:a.y,bx:b.x,by:b.y})}
// v0.57 shot grid. Enemies are binned once per update into 96px cells by their own radius. Each shot
// then checks terrain, the enemies in the cells its circle touches (in original array order), any
// enemies added since the grid was built, and debris: the same bodies, in the same order, that the
// full list produced, because no hit, knock or impact moves an enemy during the shot pass.
const shotGrid={cell:96,map:new Map(),pool:[],n:0,stamp:new Int32Array(512),tick:0,list:[],targets:[]};
function shotCellKey(x,y){return (x+1048576)*2097152+(y+1048576)}
function buildShotGrid(){let g=shotGrid,E=s.enemies,c=g.cell;for(let arr of g.map.values()){arr.length=0;g.pool.push(arr)}g.map.clear();g.n=E.length;if(g.stamp.length<E.length){g.stamp=new Int32Array(E.length*2);g.tick=0}
 for(let i=0;i<E.length;i++){let e=E[i];if(e.hp<=0||!Number.isFinite(e.x)||!Number.isFinite(e.y))continue;let r=Math.max(0,e.r||0),x0=Math.floor((e.x-r)/c),x1=Math.floor((e.x+r)/c),y0=Math.floor((e.y-r)/c),y1=Math.floor((e.y+r)/c);
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){let key=shotCellKey(x,y),arr=g.map.get(key);if(!arr){arr=g.pool.pop()||[];g.map.set(key,arr)}arr.push(i)}}}
function shotTargets(b,terrain){let g=shotGrid,T=g.targets,L=g.list,E=s.enemies,c=g.cell;T.length=0;L.length=0;for(let o of terrain)T.push(o);
 if(++g.tick>2000000000){g.stamp.fill(0);g.tick=1}
 let r=Math.max(0,b.r||0);if(Number.isFinite(b.x)&&Number.isFinite(b.y)){let x0=Math.floor((b.x-r)/c),x1=Math.floor((b.x+r)/c),y0=Math.floor((b.y-r)/c),y1=Math.floor((b.y+r)/c);
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){let arr=g.map.get(shotCellKey(x,y));if(arr)for(let i of arr)if(g.stamp[i]!==g.tick){g.stamp[i]=g.tick;L.push(i)}}}
 if(L.length>1)L.sort((a,z)=>a-z);for(let i of L)T.push(E[i]);for(let i=g.n;i<E.length;i++)T.push(E[i]);for(let o of s.debris)T.push(o);return T}
// Cosmetic gas flow only (no RNG, no combat state). v0.57: skipped entirely while no gas is visible;
// previous positions are kept as numbers and only trusted when recorded on the previous update.
function updateReactiveGas(dt){
s.gasStep=(s.gasStep||0)+1;
if(reducedMotion||graphicsVisual.smoke==='off'||!s.clouds.length&&!s.smoke.length){s.gasBlasts=[];s.gasBeams=[];return}
let step=s.gasStep,moving=[];
function track(actor,shot){if(!shot&&actor.hp<=0)return;let known=actor.gasStep===step-1,ox=known?actor.gasLx:shot?actor.x-actor.vx*dt:NaN,oy=known?actor.gasLy:shot?actor.y-actor.vy*dt:NaN;actor.gasStep=step;actor.gasLx=actor.x;actor.gasLy=actor.y;if(!Number.isFinite(ox))return;let dx=actor.x-ox,dy=actor.y-oy,m=Math.hypot(dx,dy);if(m<.05||m>80)return;moving.push({x:actor.x,y:actor.y,ox,oy,vx:dx/dt,vy:dy/dt,shot,r:actor===s.p?15:actor.r||12,speed:Math.min(700,m/dt)})}
track(s.p,false);for(let e of s.enemies)track(e,false);for(let o of s.debris)track(o,false);for(let i=0;i<s.shots.length&&i<64;i++)track(s.shots[i],true);for(let i=0;i<s.hostile.length&&i<32;i++)track(s.hostile[i],true);
for(let c of [...s.clouds,...s.smoke]){if(!c.flow)c.flow=Array.from({length:c.smoke?7:11},()=>({x:0,y:0,vx:0,vy:0}));if(!c.wakes)c.wakes=[];c.wakeCD=Math.max(0,(c.wakeCD||0)-dt);
let near=[];for(let a of moving){let d=Math.hypot(a.x-c.x,a.y-c.y);if(d<c.r+a.r+35)near.push([d,a])}near.sort((p,q)=>p[0]-q[0]);let nearby=near.slice(0,12).map(p=>p[1]);
for(let i=0;i<c.flow.length;i++){let f=c.flow[i],base=gasLobe(c,i,s.t),x=base.x+f.x,y=base.y+f.y;
for(let actor of nearby){let dx=x-actor.x,dy=y-actor.y,d=Math.hypot(dx,dy),radius=actor.r+c.r*.3;if(d>=radius)continue;let nx=d>.1?dx/d:-actor.vy/Math.max(1,actor.speed),ny=d>.1?dy/d:actor.vx/Math.max(1,actor.speed),weight=1-d/radius,push=actor.speed*weight*dt*(actor.shot?.35:1);f.vx+=(nx*.85+actor.vx/Math.max(1,actor.speed)*.45-ny*.22)*push*4;f.vy+=(ny*.85+actor.vy/Math.max(1,actor.speed)*.45+nx*.22)*push*4}
for(let blast of s.gasBlasts||[]){let dx=x-blast.x,dy=y-blast.y,d=Math.hypot(dx,dy);if(d<blast.r+c.r*.2){let weight=Math.max(0,1-d/(blast.r+c.r*.2)),a=d>.1?Math.atan2(dy,dx):i*TAU/11;f.vx+=Math.cos(a)*blast.power*weight;f.vy+=Math.sin(a)*blast.power*weight}}
for(let beam of s.gasBeams||[]){let dx=beam.bx-beam.x,dy=beam.by-beam.y,length=dx*dx+dy*dy;if(length<1)continue;let t=clamp(((x-beam.x)*dx+(y-beam.y)*dy)/length,0,1),nx=x-beam.x-dx*t,ny=y-beam.y-dy*t,d=Math.hypot(nx,ny);if(d<c.r*.3+8){let a=d>.1?Math.atan2(ny,nx):Math.atan2(dy,dx)+Math.PI/2;f.vx+=Math.cos(a)*75;f.vy+=Math.sin(a)*75}}
f.vx-=f.x*5*dt;f.vy-=f.y*5*dt;let drag=Math.exp(-3*dt);f.vx*=drag;f.vy*=drag;f.x+=f.vx*dt;f.y+=f.vy*dt;let d=Math.hypot(f.x,f.y),limit=c.r*.3;if(d>limit){f.x*=limit/d;f.y*=limit/d;f.vx*=.6;f.vy*=.6}}
if(c.wakeCD<=0&&nearby.length){c.wakeCD=.09;for(let actor of nearby.slice(0,3)){let angle=Math.atan2(actor.vy,actor.vx),strength=Math.min(1,actor.speed/220);c.wakes.push({x:actor.ox,y:actor.oy,a:angle,r:actor.shot?Math.min(9,actor.r+3):actor.r+7,life:1.15,max:1.15,strength:strength*(actor.shot?.65:1)})}c.wakes=c.wakes.slice(-22)}
for(let w of c.wakes){w.life-=dt;w.x+=Math.cos(w.a)*12*dt;w.y+=Math.sin(w.a)*12*dt;w.r+=14*dt}c.wakes=c.wakes.filter(w=>w.life>0);
}s.gasBlasts=[];s.gasBeams=[];}

function drawBurningGas(c,t){let fade=Math.min(1,c.life*2),age=.95-c.life;ctx.save();ctx.globalAlpha=fade;let glow=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.r*(1+age*.2));glow.addColorStop(0,'#ffe8a060');glow.addColorStop(.45,'#ff9b4745');glow.addColorStop(1,'#ff436000');circle(c.x,c.y,c.r*(1+age*.2),glow);for(let i=0;i<11;i++){let p=gasLobe(c,i,reducedMotion?0:t),f=c.flow&&c.flow[i],r=c.r*(.21+.035*Math.sin(t*8+i)),x=p.x+(f?f.x:0),y=p.y+(f?f.y:0)-(reducedMotion?0:age*25);let flame=ctx.createRadialGradient(x,y,0,x,y,r);flame.addColorStop(0,'#fff4bd80');flame.addColorStop(.35,'#ffae5b65');flame.addColorStop(1,'#ff526000');circle(x,y,r,flame)}ctx.restore()}
function drawToxicGas(c,t){if(c.burning){drawBurningGas(c,t);return}drawEnergyField(c.x,c.y,c.r,s.evolved.toxic?'#b5efa4':'#90cd88',t,'corrosion',Math.min(1,c.life))}

// Rebrand 31 October 2026: REACTOR ROGUE. Inline SVG reactor/ship emblem reused on menu, HUD, pause/results. Legacy storage names intentionally retained. Decorative menu motion uses ambient time only and is static under reduced motion. Mocked QA only; browser visual review pending.
// Menu-only visual simulation: fixed object counts, no combat or saved run changes.
// v0.64 menu scene: nebula, parallax stars, a showcase boss and your ship fighting small waves.
// Menu-only: its own state and random stream, bounded counts, never touches the run, saves or combat RNG.
const menuSim={last:0,rng:7,stars:null,enemies:[],shots:[],bursts:[],sparks:[],nextWave:.6,fire:0,shoot:{t:9,x:0,y:0,a:2.4},bossIndex:0,bossClock:1.5};
function menuRand(){menuSim.rng=(menuSim.rng*16807)%2147483647;return (menuSim.rng-1)/2147483646}
const menuNebula={grid:['#2fd6b5','#b04cff','#3a6bff'],belt:['#ff9a4a','#c9603a','#6a7cff'],storm:['#8a7dff','#3fc8ff','#c46bff'],foundry:['#ff7a3a','#ffb34d','#b0405a'],cryo:['#7fe6ff','#9fa8ff','#3fb6c8'],city:['#ff5fc8','#8a5cff','#3fd2ff']};
function menuLayout(){let portrait=H>W*1.15;return {portrait,shipScale:portrait?1.25:1.7,bossScale:Math.min(W,H)*(portrait?.0045:.0042),bossX:portrait?W*.2:W*.35,bossY:portrait?-H*.36:-H*.17,ship:{x:portrait?-W*.18:-W*.36,y:portrait?H*.4:H*.2}}}
function menuSector(){return sectors.some(x=>x.id===hangar?.sector)?hangar.sector:'grid'}
function menuBossList(){let id=menuSector();return [...(sectorBossDefs[id]||bossDefs).map(d=>({...d,boss:true,type:4})),{name:'FINAL',kind:'final',finalBoss:true,boss:true,c:(finalBossDefs[id]||finalBossDefs.grid).c,r:74}]}
function menuStep(dt,L){let m=menuSim;
 if(!m.stars){m.stars=[];for(let i=0;i<110;i++)m.stars.push({x:menuRand(),y:menuRand(),z:i<60?0:i<95?1:2,tw:menuRand()*TAU})}
 for(let st of m.stars){let v=[.006,.016,.045][st.z];st.x-=v*dt;st.y+=v*.35*dt;if(st.x<0)st.x+=1;if(st.y>1)st.y-=1}
 m.bossClock+=dt;if(m.bossClock>16){m.bossClock=0;m.bossIndex=(m.bossIndex+1)%menuBossList().length}
 // Waves of small fighters cross from the right.
 m.nextWave-=dt;if(m.nextWave<=0&&m.enemies.length<12){m.nextWave=3.2+menuRand()*2;let n=3+Math.floor(menuRand()*3),y0=(menuRand()-.5)*H*(L.portrait?.5:.6)+L.ship.y*.4,type=menuRand()<.25?1:0;for(let i=0;i<n;i++){let row=Math.ceil(i/2),side=i===0?0:i%2?1:-1;m.enemies.push({x:W/2+40+row*28,y:y0+side*row*22,vx:-(70+menuRand()*25),vy:Math.sin(i)*6,r:type?17:14,type,hp:type?3:2,max:type?3:2,role:'',c:'',sectorHull:menuSector(),freeze:0,glow:0,wob:menuRand()*TAU})}}
 for(let e of m.enemies){e.x+=e.vx*dt;e.y+=e.vy*dt+Math.sin(ambientTime*1.6+e.wob)*12*dt;e.glow=Math.max(0,e.glow-dt)}
 // The ship weaves and fires at the nearest fighter in front of it.
 let sx=L.ship.x+Math.sin(ambientTime*.45)*W*.05,sy=L.ship.y+Math.sin(ambientTime*.9)*H*.035;m.sx=sx;m.sy=sy;
 let target=null,best=1e9;for(let e of m.enemies){if(e.hp<=0||e.x<sx+20||e.x>W/2)continue;let d=Math.hypot(e.x-sx,e.y-sy);if(d<best){best=d;target=e}}
 m.aim=target?Math.atan2(target.y-sy,target.x-sx):-.25;m.fire-=dt;if(target&&m.fire<=0&&m.shots.length<24){m.fire=.28;for(let k of [-1,1])m.shots.push({x:sx+Math.cos(m.aim)*18-Math.sin(m.aim)*k*7,y:sy+Math.sin(m.aim)*18+Math.cos(m.aim)*k*7,vx:Math.cos(m.aim)*620,vy:Math.sin(m.aim)*620,life:1.4})}
 for(let b of m.shots){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(let e of m.enemies)if(e.hp>0&&b.life>0&&Math.hypot(e.x-b.x,e.y-b.y)<e.r+4){b.life=0;e.hp--;e.glow=.12;if(e.hp<=0)menuBurst(e.x,e.y,e.r)}}
 m.shots=m.shots.filter(b=>b.life>0&&Math.abs(b.x)<W/2+40&&Math.abs(b.y)<H/2+40);m.enemies=m.enemies.filter(e=>e.hp>0&&e.x>-W/2-60);
 for(let p of m.sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-3*dt);p.vy*=Math.exp(-3*dt);p.life-=dt}m.sparks=m.sparks.filter(p=>p.life>0);
 for(let b of m.bursts)b.life-=dt;m.bursts=m.bursts.filter(b=>b.life>0);
 m.shoot.t+=dt;if(m.shoot.t>5+menuRand()*3){m.shoot={t:0,x:(menuRand()-.2)*W,y:-H/2-20,a:Math.PI*.78+menuRand()*.15}}}
function menuEngines(pilot,t){let heavy=['bastion','sovereign'].includes(pilot.id);for(let side of [-1,1]){let y=side*(heavy?16:9),len=14+4*Math.sin(t*17+side);ctx.save();ctx.globalAlpha=.35;poly([[-15,y-2.5],[-15-len*1.6,y],[-15,y+2.5]],pilot.color);ctx.globalAlpha=.85;poly([[-15,y-1.2],[-17-len,y],[-15,y+1.2]],'#e4fff8');ctx.restore()}}
function menuBurst(x,y,r){let m=menuSim;if(m.bursts.length<10)m.bursts.push({x,y,r:r*3.2,life:.55,max:.55});for(let i=0;i<14&&m.sparks.length<160;i++){let a=menuRand()*TAU,v=60+menuRand()*170;m.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.35+menuRand()*.45,max:.8,c:i%3?'#ffd59a':'#ffffff'})}}
function drawMenuScene(t){let L=menuLayout(),m=menuSim,motion=reducedMotion?0:t,dt=reducedMotion?0:clamp(t-m.last,0,.05);m.last=t;menuStep(dt,L);
 let cols=menuNebula[menuSector()]||menuNebula.grid;ctx.save();
 // Nebula: soft additive clouds drifting slowly.
 ctx.globalCompositeOperation='lighter';for(let i=0;i<5;i++){let c=cols[i%3],x=Math.sin(motion*.03+i*2.1)*W*.35+(i-2)*W*.12,y=Math.cos(motion*.025+i*1.3)*H*.3,r=Math.max(W,H)*(.32+.08*(i%3));let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c+'5c');g.addColorStop(.45,c+'24');g.addColorStop(1,c+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
 ctx.globalCompositeOperation='source-over';
 // Parallax stars; the nearest layer streaks.
 for(let st of m.stars||[]){let x=st.x*W-W/2,y=st.y*H-H/2,tw=.55+.45*Math.sin(motion*2+st.tw);if(st.z===2){ctx.globalAlpha=.75*tw;ctx.strokeStyle='#e8fbff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(reducedMotion?2:9),y-(reducedMotion?1:3));ctx.stroke()}else{ctx.globalAlpha=(st.z?.6:.35)*tw;ctx.fillStyle=st.z?'#cfefff':'#8fb6d8';let r=st.z?1.6:1;ctx.fillRect(x,y,r,r)}}ctx.globalAlpha=1;
 if(m.shoot.t<1.2&&!reducedMotion){let p=m.shoot,k=p.t/1.2,x=p.x+Math.cos(p.a)*k*W*.9,y=p.y+Math.sin(p.a)*k*W*.9;let g=ctx.createLinearGradient(x,y,x-Math.cos(p.a)*140,y-Math.sin(p.a)*140);g.addColorStop(0,'#ffffffcc');g.addColorStop(1,'#ffffff00');ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(p.a)*140,y-Math.sin(p.a)*140);ctx.stroke()}
 // Showcase boss: large, slightly distant, cycling through the sector's roster with a fade.
 let list=menuBossList(),d=list[m.bossIndex%list.length],fade=reducedMotion?1:clamp(Math.min(m.bossClock/1.5,(16-m.bossClock)/1.5),0,1);
 if(d&&fade>0){let e={...d,hp:1,max:1,freeze:0,glow:0,charge:0,arrival:0,phase:1,shielded:false},bx=L.bossX+Math.sin(motion*.12)*W*.02,by=L.bossY+Math.cos(motion*.1)*H*.02;
  ctx.save();ctx.translate(bx,by);ctx.globalAlpha=.85*fade;let halo=ctx.createRadialGradient(0,0,0,0,0,90*L.bossScale*1.4);halo.addColorStop(0,e.c+'30');halo.addColorStop(1,e.c+'00');ctx.fillStyle=halo;ctx.fillRect(-140*L.bossScale,-140*L.bossScale,280*L.bossScale,280*L.bossScale);
  ctx.scale(L.bossScale,L.bossScale);if(e.finalBoss){drawFinalBossArt({...e,r:50,phase:1},motion)}else{let design=bossPresentation(e);ctx.rotate(design.radial?motion*.06:Math.PI*.82+Math.sin(motion*.3)*.06);if(!e.sectorBoss)drawBossArtV2(e,motion);else if(bossDesigns[e.sectorBoss+'/'+e.kind])drawSectorBossArt(e,motion);}
  ctx.restore();
  ctx.save();ctx.globalAlpha=.5*fade;ctx.font='700 '+Math.round(Math.max(9,Math.min(12,W*.012)))+'px "Exo 2", sans-serif';ctx.letterSpacing='3px';ctx.textAlign='center';ctx.fillStyle=e.c;ctx.fillText(e.finalBoss?(finalBossDefs[menuSector()]||finalBossDefs.grid).name:e.name,bx,by+64*L.bossScale+14);ctx.restore()}
 // Fighters.
 for(let e of m.enemies){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.PI);ctx.scale(e.r/20,e.r/20);drawIllustratedEnemyHull(e,t);ctx.restore()}
 // Bolts.
 let pc=(pilots.find(p=>p.id===selectedPilot)||pilots[0]).color;ctx.save();ctx.lineCap='round';ctx.shadowColor=pc;ctx.shadowBlur=graphicsShadow(8);for(let b of m.shots){ctx.strokeStyle=pc;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.025,b.y-b.vy*.025);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.stroke()}ctx.restore();
 // Explosions.
 for(let b of m.bursts){let k=1-b.life/b.max;ctx.save();ctx.globalCompositeOperation='lighter';let g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*(.4+k));g.addColorStop(0,'rgba(255,240,210,'+(.9*(1-k))+')');g.addColorStop(.4,'rgba(255,150,80,'+(.5*(1-k))+')');g.addColorStop(1,'rgba(255,90,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(.4+k),0,TAU);ctx.fill();ctx.restore();ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle='#ffd59a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(.3+k*1.2),0,TAU);ctx.stroke();ctx.restore()}
 for(let p of m.sparks){ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.c;ctx.fillRect(p.x-1,p.y-1,2.2,2.2)}ctx.globalAlpha=1;
 // Your ship.
 let pilot=pilots.find(p=>p.id===selectedPilot)||pilots[0],view={pilot,preview:false,dashTime:0,boostTime:0,flightVisual:{thrust:1,heading:m.aim*.35-.08},ambushTime:0,phaseTime:0,hullFace:0};
 ctx.save();ctx.translate(m.sx??L.ship.x,m.sy??L.ship.y);ctx.scale(L.shipScale,L.shipScale);ctx.rotate(view.flightVisual.heading);menuEngines(pilot,motion);drawIdentityHull(pilot,motion,shipCanvasPainter,view);ctx.restore();
 ctx.restore()}
// Threat information is drawn last, without particles, RNG or combat mutations.
function threatVisible(o,pad=60){return Math.abs(o.x-s.p.x)<W/2+pad&&Math.abs(o.y-s.p.y)<H/2+pad}
function threatLine(x,y,a,length){ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*length,y+Math.sin(a)*length);ctx.lineWidth=5;ctx.strokeStyle='#08101f';ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#ffb28f';ctx.setLineDash([9,6]);ctx.stroke();ctx.setLineDash([]);if(attackArtDetailed()){ctx.translate(x,y);ctx.rotate(a);for(let i=1;i<4;i++){let xx=length*i/4;artStrut(xx-5,-4,xx,0,'#ffd6ad',1);artStrut(xx,0,xx-5,4,'#ffd6ad',1)}}ctx.restore()}
function threatRing(x,y,r,warning=false){ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);ctx.lineWidth=5;circle(x,y,r,'#08101f',false);ctx.lineWidth=2;ctx.setLineDash(warning?[7,5]:[]);circle(x,y,r,'#ffad92',false);ctx.setLineDash([]);if(attackArtDetailed()){for(let i=0;i<4;i++){let a=i*TAU/4;ctx.save();ctx.translate(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.rotate(a);poly([[-5,-3],[-1,0],[-5,3]],'#ffad92');ctx.restore()}}ctx.restore()}
function drawHostileShots(){for(let b of s.hostile)drawEnemyProjectileArt(b,s.t)}
function drawPlayerLocator(){ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);let x=s.p.x,y=s.p.y,r=21;for(let c of ['#07101f','#e5fff8']){ctx.strokeStyle=c;ctx.lineWidth=c==='#07101f'?4:1.5;ctx.beginPath();for(let dx of [-1,1])for(let dy of [-1,1]){ctx.moveTo(x+dx*r,y+dy*(r-5));ctx.lineTo(x+dx*r,y+dy*r);ctx.lineTo(x+dx*(r-5),y+dy*r)}ctx.stroke()}ctx.restore()}
function drawCombatReadability(){
extraSectors[s.sector]?.hazardDraw?.();drawPilotPod();
for(let h of s.hazards)drawEnemyBeamArt(h,s.t);
for(let e of s.enemies){if(e.finalBoss){if(e.hp>0)drawFinalWarnings(e);continue}if(e.systemOwner)continue;if(e.hp>0&&e.charge>0){if(e.boss){drawBossWarning(e);continue}ctx.save();ctx.globalAlpha=.3+.5*(1-e.charge/(e.boss?1.2:.9));ctx.strokeStyle='#ffb28f';ctx.lineWidth=1;ctx.setLineDash([7,7]);let radial=e.boss&&e.pattern%2===0,n=radial?(e.hp<e.max/2?22:16):e.boss?(e.hp<e.max/2?9:5):e.type===3?5:1;for(let i=0;i<n;i++){let a=radial?e.aim+i*TAU/n:e.aim+(i-(n-1)/2)*(e.boss?.18:.22);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a)*(radial?210:650),e.y+Math.sin(a)*(radial?210:650));ctx.stroke()}ctx.setLineDash([]);circle(e.x,e.y,e.r+8,'#ffb28f',false);ctx.restore()}}