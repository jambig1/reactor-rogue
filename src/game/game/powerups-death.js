function applyPowerUps(){let L=id=>0;s.pu={might:1+.05*L('might'),area:.05*L('area'),velocity:.1*L('velocity'),magnet:1+.2*L('magnet'),growth:1+.03*L('growth'),greed:1+.1*L('greed'),luck:.1*L('luck')};if(L('armor'))s.pilot.armour=(s.pilot.armour||0)+L('armor');s.pilot.hp+=10*L('hull');if(L('recovery'))s.pilot.regen=(s.pilot.regen||0)+.1*L('recovery');if(L('cooldown'))s.pilot.fireRate=(s.pilot.fireRate||1)*(1-.025*L('cooldown'));s.pilot.speed*=1+.05*L('thrust');s.puRevives=L('revival')}
const puIcons={might:'power',armor:'armour',hull:'hull',recovery:'regen',cooldown:'clock',area:'area',velocity:'velocity',thrust:'speed',magnet:'magnet',growth:'scholar',luck:'luck',revival:'lastStand'};
function puIcon(id){return id==='greed'?'<img src="pickup-coinBag-v0840.webp" alt="">':equipmentIcon(puIcons[id])}
function powerUpShop(){let refund=hangar.puSpent||0;return '<div class="shop-intro"><h3>Power-ups</h3><p>Permanent stat ranks for every ship. Each rank you own makes the next one a little dearer, so you can refund everything at any time and spend again.</p></div><div class="pu-grid">'+powerUps.map(p=>{let l=puLevel(p.id),maxed=l>=p.max,cost=puPrice(p.id),enough=hangar.credits>=cost;
 return '<article class="pu-card'+(maxed?' maxed':'')+'" style="--pu:'+p.c+'"><span class="pu-icon" aria-hidden="true">'+puIcon(p.id)+'</span><h3>'+p.name+'</h3><p>'+p.desc+'</p><div class="rank-pips" aria-label="'+l+' of '+p.max+' ranks">'+Array.from({length:p.max},(_,n)=>'<i class="'+(n<l?'filled':'')+'"></i>').join('')+'</div><button data-hangar-action="powerup" data-id="'+p.id+'" '+(maxed||!enough?'disabled':'')+'>'+(maxed?'MAX':enough?cost+' credits':'Need '+(cost-hangar.credits))+'</button></article>'}).join('')+'</div><div class="actions pu-refund"><button data-hangar-action="refundPowerups" data-id="all" '+(refund?'':'disabled')+'>Refund all'+(refund?' · +'+refund.toLocaleString()+' credits':'')+'</button></div>'}
// v0.86 Death sequence: the world freezes, the hull blows apart (flash, fireball, shockwaves, spinning hull shards, sparks, smoke), then the screen fades to the results. Cosmetic only; stateless from s.dying.t.
const deathLength=2.2;
function startDeath(){if(s.dying)return;let pl=pilots.find(q=>q.id===s.pilot?.id),c=pl?.color||s.pilot?.color||'#65fbd2',shards=[];for(let i=0;i<16;i++){let a=i/16*TAU+cityHash(i,7,401)*.5,sp=140+cityHash(i,9,403)*260,sz=5+cityHash(i,11,409)*9;shards.push({a,sp,sz,spin:(cityHash(i,13,419)-.5)*14,shape:i%3})}s.dying={t:0,x:s.p.x,y:s.p.y,c,shards};fxShockwave(s.p.x,s.p.y,1.6);wreckImpulse(s.p.x,s.p.y,160,2);fxBurst('player',s.p.x,s.p.y,c);s.shake=Math.max(s.shake||0,16);s.fxHitAt=s.t;s.fxFlashAt=s.t;s.fxFlashColor='#fff1d6';sound('explosion');sound('hurt');try{if(navigator.vibrate)navigator.vibrate([60,40,120])}catch(e){}}
function deathTick(dt){let d=s.dying;d.t+=dt;s.shake=Math.max(0,(s.shake||0)-dt*16);s.flash=Math.max(0,(s.flash||0)-dt*3);s.blastFlash=Math.max(0,(s.blastFlash||0)-dt*3);if(d.t>=deathLength){finish(false)}}
function deathEase(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3)}
function drawDeath(){let d=s.dying;if(!d)return;let t=d.t,x=d.x,y=d.y,c=d.c,detail=graphicsParticles()>0;ctx.save();ctx.shadowBlur=0;ctx.setLineDash([]);
 // Smoke (under everything else)
 if(detail)for(let i=0;i<9;i++){let a=i/9*TAU+.3,r=(20+cityHash(i,3,431)*40)*deathEase(t/1.6)+10,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r-t*14,rad=14+t*26,al=Math.max(0,.45*(1-t/deathLength))*Math.min(1,t*4);if(al<=0)continue;ctx.globalAlpha=al;let g=ctx.createRadialGradient(px,py,0,px,py,rad);g.addColorStop(0,'#5a5f6c');g.addColorStop(1,'#2a2e3800');ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,rad,0,TAU);ctx.fill()}
 ctx.globalCompositeOperation='lighter';
 // Fireball
 if(t<1.1){let k=deathEase(t/.45),rad=26+110*k,al=t<.12?1:Math.max(0,1-(t-.12)/.98);let g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba(255,255,240,'+al+')');g.addColorStop(.25,'rgba(255,214,140,'+al*.95+')');g.addColorStop(.55,'rgba(255,120,60,'+al*.6+')');g.addColorStop(1,'rgba(255,60,40,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad,0,TAU);ctx.fill()}
 // Shockwaves
 for(let [delay,col,speed,width] of [[0,'#ffffff',620,5],[.08,c,480,3],[.22,'#ffb070',360,2]]){let tt=t-delay;if(tt<=0||tt>1.2)continue;let r=20+speed*deathEase(tt/1.1),al=Math.max(0,1-tt/1.2);ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=width*(1-tt/1.4)+.5;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke()}
 // Sparks
 if(detail&&t<.9)for(let i=0;i<34;i++){let a=i/34*TAU+cityHash(i,5,433)*.4,sp=260+cityHash(i,6,439)*420,dist0=sp*deathEase(t/.9)*.55,len=10+18*(1-t/.9),px=x+Math.cos(a)*dist0,py=y+Math.sin(a)*dist0;ctx.globalAlpha=Math.max(0,1-t/.9);ctx.strokeStyle=i%3?'#ffd08a':c;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-Math.cos(a)*len,py-Math.sin(a)*len);ctx.stroke()}
 ctx.globalCompositeOperation='source-over';
 // Hull shards: dark fill, neon edge in the ship colour, spinning out and fading
 for(let sh of d.shards){let travel=sh.sp*(1-Math.exp(-t*2.2))/2.2,px=x+Math.cos(sh.a)*travel,py=y+Math.sin(sh.a)*travel,al=t<1.3?1:Math.max(0,1-(t-1.3)/.7);if(al<=0)continue;ctx.save();ctx.globalAlpha=al;ctx.translate(px,py);ctx.rotate(sh.a+t*sh.spin);let z=sh.sz,pts=sh.shape===0?[[-z,-z*.5],[z,0],[-z*.6,z*.6]]:sh.shape===1?[[-z,-z*.4],[z*.8,-z*.3],[z*.4,z*.5],[-z*.7,z*.4]]:[[-z*.8,0],[0,-z*.5],[z,0],[0,z*.35]];ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let p of pts.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fillStyle='#1a2433';ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=c;ctx.stroke();if(t<.8){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al*(1-t/.8)*.8;ctx.fillStyle='#ff9a50';ctx.fill();ctx.globalCompositeOperation='source-over'}ctx.restore()}
 ctx.restore();
 if(gpuFrame.on&&gpuFrame.bloom&&bloomLayer&&t<.9){try{bloomLayer.glow(x+gpuFrame.ox,y+gpuFrame.oy,90+160*deathEase(t/.5),'#ffb070',.9*(1-t/.9),0)}catch(e){}}}
function drawDeathFade(){let d=s?.dying;if(!d||d.t<1.45)return;ctx.fillStyle='rgba(2,4,13,'+clamp((d.t-1.45)/(deathLength-1.45),0,1)*.85+')';ctx.fillRect(0,0,W,H)}


// v0.97 Physics wreckage with Matter.js (vendor/matter-js-0.20.0, MIT). Destroyed ships and broken crates leave
// hull chunks that tumble, collide with each other, bounce off structures, get flung by explosions and the
// Plasma Breath jet, and are shoved aside by your ship. Purely cosmetic: lives outside the run state, uses its
// own random numbers and never touches damage, loot or collisions. Off with reduced motion or low particles.
const wreck={engine:null,chunks:[],statics:new Map(),seed:7,run:null,last:0,max:140,px:null,py:null};
function wreckRand(){wreck.seed=(wreck.seed*1664525+1013904223)>>>0;return wreck.seed/4294967296}
function wreckOn(){return typeof Matter!=='undefined'&&!reducedMotion&&graphicsParticles()>0&&typeof document!=='undefined'}
function wreckReset(){if(wreck.engine)try{Matter.Engine.clear(wreck.engine)}catch(e){}wreck.engine=null;wreck.chunks=[];wreck.statics=new Map();wreck.run=s;wreck.px=null}
function wreckEngine(){if(wreck.run!==s)wreckReset();if(!wreck.engine){wreck.engine=Matter.Engine.create({gravity:{x:0,y:0,scale:0},enableSleeping:false});wreck.engine.positionIterations=4;wreck.engine.velocityIterations=3}return wreck.engine}
function wreckSpawn(x,y,radius,color,kind){if(!wreckOn()||!s)return;let M=Matter,eng=wreckEngine(),n=kind==='debris'?5:radius>=150?16:radius>=80?9:radius>=45?6:3;n=Math.max(1,Math.round(n*Math.min(1,graphicsParticles()+.2)));
 for(let i=0;i<n;i++){let sz=(kind==="debris"?6:5)+wreckRand()*(radius>=80?10:6),sides=3+Math.floor(wreckRand()*3),a=wreckRand()*TAU,off=wreckRand()*Math.min(18,radius*.25);
  let b=M.Bodies.polygon(x+Math.cos(a)*off,y+Math.sin(a)*off,sides,sz,{frictionAir:.018+wreckRand()*.02,friction:.05,restitution:.55,density:.002,angle:wreckRand()*TAU});
  let sp=(1.6+wreckRand()*3.2)*(radius>=80?1.4:1);M.Body.setVelocity(b,{x:Math.cos(a)*sp,y:Math.sin(a)*sp});M.Body.setAngularVelocity(b,(wreckRand()-.5)*.35);
  let life=3.2+wreckRand()*2.2;b.rr={c:color||'#8fb3c8',life,max:life,hot:kind==='ice'?0:.7,ice:kind==='ice'};M.Composite.add(eng.world,b);wreck.chunks.push(b)}
 while(wreck.chunks.length>wreck.max){let old=wreck.chunks.shift();M.Composite.remove(eng.world,old)}}
function wreckImpulse(x,y,radius,power=1){if(!wreck.engine||wreck.run!==s)return;let reach=radius*2.2+40;for(let b of wreck.chunks){let dx=b.position.x-x,dy=b.position.y-y,d=Math.hypot(dx,dy);if(d>reach||d<.01)continue;let k=(1-d/reach)*6*power;Matter.Body.setVelocity(b,{x:b.velocity.x+dx/d*k,y:b.velocity.y+dy/d*k});Matter.Body.setAngularVelocity(b,b.angularVelocity+(wreckRand()-.5)*.2*power)}}
function wreckSyncStatics(){let M=Matter,eng=wreck.engine,seen=new Set();for(let f of s.terrain||[]){if(f.spent||!(f.kind==='cover'||f.kind==='station'||f.kind==='conduit'))continue;seen.add(f);let b=wreck.statics.get(f);if(!b){b=M.Bodies.circle(f.x,f.y,f.r,{isStatic:true,restitution:.7});M.Composite.add(eng.world,b);wreck.statics.set(f,b)}}for(let [f,b] of wreck.statics)if(!seen.has(f)){M.Composite.remove(eng.world,b);wreck.statics.delete(f)}}
function wreckStep(t){if(wreck.run!==s){wreckReset();wreck.last=t;return}let dt=Math.min(.05,Math.max(0,t-wreck.last));wreck.last=t;let p=s.p,mvx=wreck.px===null||dt<=0?0:(p.x-wreck.px)/dt,mvy=wreck.py===null||dt<=0?0:(p.y-wreck.py)/dt;wreck.px=p.x;wreck.py=p.y;
 if(!wreck.engine||!wreck.chunks.length||dt<=0||state!=='play')return;let M=Matter;
 wreckSyncStatics();let pr=(p.r||16)+6,flame=s.boosts?.flame>0,fa=s.face;
 for(let i=wreck.chunks.length-1;i>=0;i--){let b=wreck.chunks[i],r=b.rr;r.life-=dt;r.hot=Math.max(0,r.hot-dt);if(r.life<=0){M.Composite.remove(wreck.engine.world,b);wreck.chunks.splice(i,1);continue}
  let dx=b.position.x-p.x,dy=b.position.y-p.y,d=Math.hypot(dx,dy);
  if(d<pr&&d>.01){let push=(pr-d)/pr;M.Body.setPosition(b,{x:p.x+dx/d*pr,y:p.y+dy/d*pr});M.Body.setVelocity(b,{x:b.velocity.x+dx/d*push*4+mvx/60*.9,y:b.velocity.y+dy/d*push*4+mvy/60*.9});M.Body.setAngularVelocity(b,b.angularVelocity+(wreckRand()-.5)*.15)}
  if(flame&&d<230&&d>.01){let ang=Math.atan2(dy,dx)-fa;ang=Math.atan2(Math.sin(ang),Math.cos(ang));if(Math.abs(ang)<.7){let k=.35*(1-d/230);M.Body.setVelocity(b,{x:b.velocity.x+Math.cos(fa)*k,y:b.velocity.y+Math.sin(fa)*k});r.hot=Math.max(r.hot,.4)}}}
 M.Engine.update(wreck.engine,dt*1000)}
function drawWreck(){if(!wreck.chunks.length||wreck.run!==s)return;let vx=s.p.x,vy=s.p.y;ctx.save();ctx.shadowBlur=0;ctx.lineJoin='round';
 for(let b of wreck.chunks){let x=b.position.x,y=b.position.y;if(Math.abs(x-vx)>W/2+40||Math.abs(y-vy)>H/2+40)continue;let r=b.rr,v=b.vertices,fade=Math.min(1,r.life/.8);
  ctx.globalAlpha=fade;ctx.beginPath();ctx.moveTo(v[0].x,v[0].y);for(let i=1;i<v.length;i++)ctx.lineTo(v[i].x,v[i].y);ctx.closePath();ctx.fillStyle=r.ice?'#20384a':'#151e2b';ctx.fill();ctx.lineWidth=1.3;ctx.strokeStyle=r.c;ctx.globalAlpha=fade*.85;ctx.stroke();
  if(r.hot>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=fade*r.hot/.7*.8;ctx.fillStyle='#ff9a4a';ctx.fill();ctx.globalCompositeOperation='source-over'}}
 ctx.restore()}
// pixi-filters hooks (cosmetic). Shockwaves come from big explosions; the hit glitch from taking damage.
function fxShockwave(x,y,power){if(!pixiLayer||!pixiFrame.on||reducedMotion||graphicsFlash()<=0)return;try{pixiLayer.shockwave(x,y,power)}catch(e){}}
function fxHurt(amount){if(!pixiLayer||reducedMotion||graphicsFlash()<=0)return;try{pixiLayer.hurt(Math.min(1,(amount||10)/25))}catch(e){}}
function fxExplosion(x,y,radius,color,kind){if(kind==='ship'||kind==='debris'||kind==='ice')wreckSpawn(x,y,radius,color,kind);wreckImpulse(x,y,radius,radius>=80?1.4:.8);if(radius>=80)fxShockwave(x,y,clamp((radius-60)/90,.35,1.4))}


// v0.98 First-run flight coach. A short, non-blocking guide on the player's first real run: how to fly, gems,
// levelling, evolutions, dash and the reactor timer. Each step advances when the player does the thing (or
// after a while). Kept outside the run state; never shown in developer test runs. Replayable from the manual.
const coach={on:false,i:0,t:0,start:null,last:0,lv:1,gems:0,dashes:0};
const coachKey='rr_coach_done_v1';
function coachTouch(){return controlMode==='touch'||touchActive}
function coachSteps(){let touch=coachTouch();return [
 {text:touch?'<b>Drag anywhere</b> to fly. Your ship <b>fires on its own</b>.':'Fly with <b>WASD</b> or the <b>arrow keys</b>. Your ship <b>fires on its own</b>.',min:2.5,max:9,done:()=>coach.start&&Math.hypot(s.p.x-coach.start.x,s.p.y-coach.start.y)>260},
 {text:'Destroyed ships drop <b>glowing gems</b>. Fly over them to fill your <b>XP bar</b>.',min:3,max:14,done:()=>s.metrics.gems-coach.gems>=5},
 {text:'Fill the XP bar to <b>level up</b>, then pick an upgrade: new weapons, or boosts to what you have.',min:3,max:22,done:()=>s.lv>coach.lv},
 {text:'Max a weapon with its <b>matching passive</b> to <b>EVOLVE</b> it. Look for the evolution hints on upgrade cards.',min:6,max:8,done:()=>false},
 {text:touch?'Tap <b>DASH</b> to zip through danger. You can\'t be hit mid-dash.':'Press <b>Shift</b> to dash through danger. You can\'t be hit mid-dash.',min:2.5,max:12,done:()=>s.metrics.dashes>coach.dashes},
 {text:'Survive until the <b>reactor timer</b> (top) runs out, then destroy the <b>reactor boss</b>. Good luck, pilot!',min:6,max:7,done:()=>false}]}
function coachSeen(){try{return localStorage.getItem(coachKey)==='1'}catch(e){return true}}
function coachFinish(){coach.on=false;try{localStorage.setItem(coachKey,'1')}catch(e){}let el=$('coach');if(el)el.classList.remove('on')}
function coachBegin(force){if(typeof document==='undefined'||!$('coach'))return;if(!s||s.dev?.test||s.endless)return;if(!force&&coachSeen())return;if($('coachSkip'))$('coachSkip').onclick=e=>{e.stopPropagation();coachFinish()};coach.on=true;coach.i=0;coach.t=0;coach.start=null;coach.lv=s.lv;coach.gems=s.metrics.gems;coach.dashes=s.metrics.dashes;coachShow()}
function coachShow(){let st=coachSteps()[coach.i];if(!st){coachFinish();return}$('coachStep').textContent='FLIGHT TUTORIAL · '+(coach.i+1)+' / '+coachSteps().length;$('coachText').innerHTML=st.text;$('coachBar').style.width='0%';$('coach').classList.add('on');coach.lv=s.lv;coach.gems=s.metrics.gems;coach.dashes=s.metrics.dashes;if(coach.i===0)coach.start={x:s.p.x,y:s.p.y}}
function coachTick(now){if(!coach.on){if(s&&state==='play'&&coach.run!==s){coach.run=s;coachBegin(false)}if(!coach.on)return}let dt=Math.min(.1,Math.max(0,(now-(coach.last||now))/1000));coach.last=now;if(!s||state==='menu'||state==='end'){coachFinish();return}
 let el=$('coach');el.classList.toggle('on',state==='play');if(state!=='play')return;
 let st=coachSteps()[coach.i];if(!st){coachFinish();return}coach.t+=dt;$('coachBar').style.width=Math.min(100,coach.t/st.max*100)+'%';
 let ok=false;try{ok=st.done()}catch(e){}if((ok&&coach.t>=st.min)||coach.t>=st.max){coach.i++;coach.t=0;if(coach.i>=coachSteps().length){coachFinish();return}el.classList.remove('on');setTimeout(()=>{if(coach.on)coachShow()},350)}}

// v0.89 PixiJS layer (stage 2 of the PixiJS move): ordinary enemy hulls and floating scenery are drawn as
// GPU sprites on #pixiLayer, under the 2D playfield. Only used while the three.js background owns the
// backdrop (the 2D canvas is then transparent); otherwise, or on any failure, everything stays on the 2D canvas.
var pixiLayerModule='./pixi-layer-v0970.js',pixiFrame={on:false,cam:false},pixiLayer=null,pixiState='idle';
function pixiWanted(){try{return new URLSearchParams(location.search).get('pixi')!=='0'&&graphics.gpu!=='off'}catch(e){return false}}
function startPixiLayer(){if(pixiState!=='idle'||!pixiWanted()||typeof document==='undefined')return;let el=document.getElementById('pixiLayer');if(!el)return;pixiState='loading';try{import(pixiLayerModule).then(m=>m.createPixiLayer(el,undefined,{width:W,height:H,resolution:canvas.width/W})).then(l=>{if(!l)throw Error('PixiJS could not start');pixiLayer=l;pixiState='ready';l.onLost=()=>pixiFail('context lost');pixiResize()}).catch(pixiFail)}catch(e){pixiFail(e)}}
function pixiFail(e){pixiState='failed';pixiFrame.on=false;try{pixiLayer&&pixiLayer.setVisible(false)}catch(x){}pixiLayer=null;if(typeof console!=='undefined')console.warn('PixiJS layer off:',e&&e.message||e)}
function pixiResize(){if(pixiLayer)try{pixiLayer.resize(W,H,canvas.width/W)}catch(e){pixiFail(e)}}
function beginPixiFrame(){pixiFrame.cam=false;pixiFrame.on=!!(pixiLayer&&!pixiLayer.lost&&s&&state!=='menu'&&gpuFrame.on&&!gpuFrame.overlay);if(pixiLayer){pixiLayer.setVisible(pixiFrame.on);if(pixiFrame.on)pixiLayer.begin()}}
var pixiFxLast=0;function endPixiFrame(){if(pixiFrame.on)try{let now=performance.now()/1000,dt=Math.min(.05,Math.max(0,now-pixiFxLast));pixiFxLast=now;if(pixiLayer.tick){pixiLayer.freeze(s&&s.boosts?.freeze>0&&!reducedMotion?Math.min(1,s.boosts.freeze/.4):0);pixiLayer.tick(state==='play'?dt:0)}pixiLayer.render()}catch(e){pixiFail(e)}}
function contactRecoilOffset(e){if(reducedMotion)return [0,0];let f=attackArt.reactions.get(e);if(!f)return [0,0];let age=s.t-f.born;if(age<0||age>.14)return [0,0];let o=f.power*Math.sin(age/.14*Math.PI)*(1-age/.14);return [Math.cos(f.a)*o,Math.sin(f.a)*o]}
function pixiEnemy(e,t){if(e.objectiveTarget||e.finalBoss||e.systemOwner||e.sporePod||e.wreckTurret||e.swarm||e.boss)return false;
 let flash=e.glow>0&&graphicsFlash()>.5,frozen=e.freeze>0,hp=e.hp/e.max,tier=hp<.25?2:hp<.5?1:0,key='e|'+(e.sectorHull||'grid')+'|'+(e.type||0)+'|'+(e.role||'')+'|'+(e.c||'')+'|'+(flash?1:0)+(frozen?1:0)+tier+(e.launchWarning>0?1:0);
 let a=e.role==='hunter'&&(e.huntWarning>0||e.huntDash>0)?e.roleAim:formationHeading(e,Math.atan2(s.p.y-e.y,s.p.x-e.x)),[ox,oy]=contactRecoilOffset(e);
 return pixiLayer.enemy(key,g=>{let old=ctx;ctx=g;try{drawIllustratedEnemyHull(e,0,shipPainter(g))}finally{ctx=old}},e.x+ox,e.y+oy,a,e.r/20)}

// v0.93 Procedural map layout with simplex-noise (vendor/simplex-noise-4.0.3, MIT). Each run gets its own seed; a
// ridged noise field shapes dense belts, scattered fields and empty voids. Scenery density, asteroid spawn rate and
// rock size follow it. Developer test runs keep the old uniform layout so tests stay deterministic.
var mapField={noise:null,seed:0,ax:0,ay:0,belt:false};
const beltNames={grid:'DEBRIS FIELD',belt:'ASTEROID BELT',storm:'ION SHOAL',foundry:'SLAG FIELD',cryo:'ICE FIELD',city:'WRECKAGE ROW',solar:'CORONA DEBRIS',rift:'ACCRETION BAND',hive:'SPORE BANK',ghost:'SHIP GRAVEYARD'};
function hashNoise2D(seed){let h=(x,y)=>{let n=Math.sin(x*127.1+y*311.7+seed*.0137)*43758.5453;return n-Math.floor(n)},sm=t=>t*t*(3-2*t);return (x,y)=>{let xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1),u=sm(xf),v=sm(yf);return (a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v)*2-1}}
function mapFieldInit(seed){mapField.seed=seed>>>0;mapField.ax=seed%997;mapField.ay=Math.floor(seed/997)%991;mapField.belt=false;try{mapField.noise=typeof SimplexNoise!=='undefined'?SimplexNoise.createNoise2D(SimplexNoise.alea(String(seed))):hashNoise2D(seed)}catch(e){mapField.noise=hashNoise2D(seed)}}
function mapDensity(x,y){let n=mapField.noise;if(!n)return .5;let ridge=1-Math.abs(n(x/4200,y/4200)),detail=n(x/1100+31.7,y/1100-8.3);return clamp((ridge-.42)/.42+detail*.15,0,1)}
function updateMapZone(){if(!mapField.noise||!s||s.dev?.test)return;let d=mapDensity(s.p.x,s.p.y);if(!mapField.belt&&d>.68){mapField.belt=true;if(!(s.toast>0)){s.toast=2.5;$('toast').textContent='ENTERING '+(beltNames[s.sector]||'DEBRIS FIELD')}}else if(mapField.belt&&d<.5){mapField.belt=false;if(!(s.toast>0)){s.toast=2;$('toast').textContent='OPEN SPACE'}}}
// v0.94 Enemy tactics with Yuka (vendor/yuka-0.7.8, MIT). Ordinary ships pick a tactic: SWARM (flock with
// separation, alignment and cohesion while chasing), FLANK (arrive at a slot around you to surround you before
// closing in) or DIRECT. Small ships that are badly hurt break off and flee briefly, then come back. Heavies only
// keep their spacing. Yuka gives a heading; speed, damage and collisions are unchanged. Formations, specialists,
// bosses and objective spawns keep their own movement. Inactive if the library is missing.
const tactics={em:null,pool:[],ready:false,flankSlots:8};
function tacticsInit(){if(tactics.ready||typeof YUKA==='undefined')return tactics.ready;try{let em=new YUKA.EntityManager();em.spatialIndex=new YUKA.CellSpacePartitioning(4000,10,4000,16,1,16);tactics.em=em;tactics.ready=true}catch(e){tactics.ready=false}return tactics.ready}
function tacticEligible(e){return !e.boss&&!e.role&&!e.formation&&!e.stationary&&!e.swarm&&!e.podGuard&&!e.distressID&&!e.objectiveTarget&&!e.finalBoss&&!e.systemOwner&&!e.sporePod&&!e.wreckTurret&&!(e.arrival>0)}
function tacticAgent(e){let v=e.tac;if(v)return v;let T=YUKA;v=new T.Vehicle();v.maxSpeed=Math.max(40,e.v||80);v.maxForce=v.maxSpeed*3;v.mass=1;v.neighborhoodRadius=e.type>=2?80:55;v.updateNeighborhood=true;
 let h=cityHash(Math.floor(e.x*7),Math.floor(e.y*3),977),kind=(e.type||0)>=2?'heavy':h<.45?'swarm':h<.8?'flank':'direct';v.kind=kind;v.slot=Math.floor(cityHash(Math.floor(e.x),Math.floor(e.y),983)*tactics.flankSlots);
 v.seek=new T.SeekBehavior(new T.Vector3());v.arrive=new T.ArriveBehavior(new T.Vector3(),2.2,40);v.flee=new T.FleeBehavior(new T.Vector3(),260);v.sep=new T.SeparationBehavior();v.align=new T.AlignmentBehavior();v.coh=new T.CohesionBehavior();
 v.sep.weight=kind==='heavy'?2.6:2.2;v.align.weight=.45;v.coh.weight=.35;v.align.active=v.coh.active=kind==='swarm';v.arrive.active=false;v.flee.active=false;v.seek.active=kind!=='flank';
 for(let b of [v.seek,v.arrive,v.flee,v.sep,v.align,v.coh])v.steering.add(b);v.currentRegion=-1;tactics.em.add(v);Object.defineProperty(e,'tac',{value:v,writable:true,configurable:true,enumerable:false});return v}
function tacticsPrune(){if(!tactics.em)return;let live=new Set(s.enemies);for(let v of [...tactics.em.entities])if(!v.owner||!live.has(v.owner)||v.owner.hp<=0){tactics.em.remove(v);if(v.owner)v.owner.tac=null;v.owner=null}}
const tacForce={x:0,y:0,z:0};
function tacticHeading(e,base){if(!tactics.ready||!s||s.dev?.test||!tacticEligible(e))return base;let v=tacticAgent(e);v.owner=e;e.tacT=(e.tacT||0)-1/60;
 if(e.tacT>0&&e.tacA!==undefined)return e.tacA;e.tacT=.1+cityHash(Math.floor(e.x),Math.floor(e.y),991)*.05;
 try{let px=s.p.x,py=s.p.y,rx=e.x-px,ry=e.y-py,dist0=Math.hypot(rx,ry);v.position.set(rx,0,ry);v.velocity.set(Math.cos(e.tacA??base)*v.maxSpeed,0,Math.sin(e.tacA??base)*v.maxSpeed);v.currentRegion=tactics.em.spatialIndex.updateEntity(v,v.currentRegion);
  // Badly hurt light ships peel away once, then rejoin.
  if(v.kind!=='heavy'&&e.hp<e.max*.3&&e.tacFled===undefined){e.tacFled=s.t}let fleeing=e.tacFled!==undefined&&s.t-e.tacFled<2.2;v.flee.active=fleeing;v.flee.target.set(0,0,0);
  // Flankers swing wide to a slot on your far side (chosen relative to where they came from), then dive in.
  if(v.kind==='flank'&&v.slotA===undefined){let side=v.slot%2?1:-1;v.slotA=Math.atan2(ry,rx)+side*(1.5+(v.slot/tactics.flankSlots)*1.3)}
  let flanking=v.kind==='flank'&&!e.tacFlanked;if(flanking){let a=v.slotA+s.t*.1,r=230,tx=Math.cos(a)*r,ty=Math.sin(a)*r;if(Math.hypot(rx-tx,ry-ty)<80||s.t-(e.tacBorn??(e.tacBorn=s.t))>9)e.tacFlanked=true;v.arrive.target.set(tx,0,ty)}
  v.seek.active=!fleeing&&!flanking;v.seek.target.set(0,0,0);v.arrive.active=!fleeing&&flanking;
  tactics.em.updateNeighborhood(v);let f=new YUKA.Vector3();v.steering.calculate(.1,f);let dx=v.velocity.x+f.x*.25,dz=v.velocity.z+f.z*.25;if(Math.hypot(dx,dz)<1)return base;e.tacA=Math.atan2(dz,dx);return e.tacA}catch(err){tactics.ready=false;return base}}

// v0.96 swarm director: when ordinary ships pile up because the build can't keep up, new arrivals slow down
// (about half as often at 165 alive, a third at 220) so a struggling run can recover. Strong builds that keep
// the screen clear never trigger it. Endless mode is unaffected.
function swarmEase(){if(!s||s.endless)return 1;let alive=0;for(let e of s.enemies)if(e.hp>0&&!e.boss)alive++;return alive>110?1+(alive-110)/55:1}
// v0.82 Campaign: sectors open in a chain (2 bosses in the previous sector) and stranded pilots wait in each sector.
function campaignInit(){let c=hangar.campaign&&typeof hangar.campaign==='object'?hangar.campaign:{},fresh=c.v!==1,ok=a=>Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'))]:[],best={};for(let [k,v] of Object.entries(c.best&&typeof c.best==='object'?c.best:{}))if(/^[a-z]{1,20}$/.test(k))best[k]=Math.min(9,Math.max(0,Math.floor(Number(v)||0)));c={v:1,open:ok(c.open),rescued:ok(c.rescued),best};
 if(fresh){for(let x of sectors)if(legacySectorOpen(x.id))c.open.push(x.id);for(let id of Object.values(pilotPods)){let L=legacyShipChallenges[id];if(hangar.ships.includes(id)||L&&L.value(hangar)>=L.goal)c.rescued.push(id)}c.open=[...new Set(c.open)];c.rescued=[...new Set(c.rescued)]}
 hangar.campaign=c;saveHangar()}
function campaignBoss(){if(!s||s.dev?.test||!hangar.campaign||hangar.campaign.v!==1)return;let c=hangar.campaign,next=sectorChain[sectorChain.indexOf(s.sector)+1],before=next&&sectorOpen(next);c.best[s.sector]=Math.max(c.best[s.sector]||0,s.bossKills);if(next&&!before&&sectorOpen(next)){c.open.push(next);(s.blueprintQueue||(s.blueprintQueue=[])).unshift({text:'NEW SECTOR UNLOCKED / '+sectorName(next).toUpperCase()});(s.campaignUnlocks||(s.campaignUnlocks=[])).push(next)}saveHangar()}
const podHold=3,podRadius=72,podArt={};
function podImage(k){let im=podArt[k];if(!im&&typeof Image!=='undefined'){im=podArt[k]=new Image();im.src='pilot-pod-'+k+'-v0840.webp'}return im&&im.complete&&im.naturalWidth?im:null}
function pilotPodFor(sec){let id=pilotPods[sec];return id&&!(hangar.campaign?.rescued||[]).includes(id)?id:null}
function podSmoke(x,y,t){let N=graphicsVisual.particles==='full'?10:6,fr=v=>v-Math.floor(v);ctx.save();for(let k=0;k<N;k++){let age=fr(t*.35+k/N),h=cityHash(k,3,911),src=k%2?[14,-10]:[-12,8],px=x+src[0]+age*(30+h*30)+Math.sin(age*6+h*7)*6,py=y+src[1]-age*(70+h*30),r=10+age*34;ctx.globalAlpha=(1-age)*Math.min(1,age*6)*.85;let g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'#d0d4de');g.addColorStop(.6,'#9aa0acaa');g.addColorStop(1,'#5a606c00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill()}ctx.restore()}