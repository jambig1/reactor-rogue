// Near-player warnings keep their physical boundaries even on Low effects.
for(let h of s.sectorHazards||[])if(h.life>0&&threatVisible(h,h.r)){if(h.kind==='vent'||h.kind==='fracture'||h.kind==='lockdown')drawFrontierHazard(h);else threatRing(h.x,h.y,h.r,h.warning>0);}
for(let b of s.enemyBursts||[])if(threatVisible(b,b.r))threatRing(b.x,b.y,b.r,true);
let count=0;for(let e of s.enemies){if(e.hp<=0||e.freeze>0)continue;if(e.role==='rail'&&e.roleWarning>0){threatLine(e.x,e.y,e.roleAim,650);count++}else if(e.role==='hunter'&&e.huntWarning>0){threatLine(e.x,e.y,e.roleAim,190);count++}if(count>=12)break}
drawHostileShots();if(!s.dying)drawPlayerLocator();}
function damageNumberPosition(n){let dx=n.x-s.p.x,dy=n.y-s.p.y,halfWidth=Math.min(200,String(n.label||'').length*6);if(Math.abs(dx)<44+halfWidth&&Math.abs(dy)<44)return {x:n.x,y:s.p.y+(dy>0?44:-44)};return {x:n.x,y:n.y}}

// v0.55 GPU layer. Three.js renders the sector background, parallax stars, glow halos and
// particles on #gpuLayer beneath the 2D canvas. Cosmetic only: reads positions, never changes
// simulation, RNG or collision. Any load, render or context failure falls back to 2D drawing.
const gpuLayerModule='./gpu-layer-v0850.js',gpuSectorTints={grid:'#7cbbb9',belt:'#bca17d',storm:'#ac99d4',foundry:'#e6a16a',cryo:'#9ac8d7',city:'#99b7cf'};
// var: resize() and graphicsShadow() can run before this point during start-up.
var gpuModule=null,bloomLayer=null,bloomState='idle',bloomCapture=null,bloomCaptureOk=true,bloomCheckAt=0,gpuLayer=null,gpuState='idle',gpuFrame={on:false,overlay:false,ox:0,oy:0,background:null,tint:null};
function gpuQuery(key,value){try{return new RegExp('[?&]'+key+'='+value+'(&|$)').test(location.search)}catch(e){return false}}
function gpuSupported(){try{return typeof window!=='undefined'&&typeof document!=='undefined'&&typeof document.getElementById==='function'&&!!window.WebGL2RenderingContext&&!!document.getElementById('gpuLayer')}catch(e){return false}}
function gpuActive(){return gpuState==='ready'&&!!gpuLayer&&graphics.gpu!=='off'}
function syncGpuStatus(){let el=typeof document!=='undefined'&&document.getElementById?document.getElementById('gpuStatus'):null;if(!el)return;let debug=gpuQuery('gpudebug','1')&&gpuLayer?' · '+gpuLayer.diagnostics:'';el.textContent=(graphics.gpu==='off'?'Off · classic renderer in use.':gpuState==='ready'?(gpuLayer?.mode==='overlay'?'On · compatibility mode: classic background with GPU glow and particles.':'On · Three.js background depth, glow and particles.'):gpuState==='loading'?'Loading Three.js…':gpuState==='failed'?'Unavailable on this device · classic renderer in use.':'Three.js background depth, glow and particles.')+debug}
function gpuFail(reason){gpuState='failed';gpuFrame.on=false;try{gpuLayer?.setVisible(false)}catch(e){}gpuLayer=null;if(typeof console!=='undefined')console.warn('Reactor Rogue GPU layer unavailable; using the 2D renderer.',reason);syncGpuStatus()}
function startGpuLayer(){if(gpuState!=='idle'||graphics.gpu==='off'||!gpuSupported())return;gpuState='loading';syncGpuStatus();try{import(gpuLayerModule).then(m=>(gpuModule=m).createGpuLayer(document.getElementById('gpuLayer'),undefined,{selfCheck:!gpuQuery('gpucheck','0')})).then(layer=>{if(!layer)throw Error('WebGL2 renderer could not start');gpuLayer=layer;gpuState='ready';layer.onLost=()=>gpuFail('WebGL context lost');layer.onModeChange=applyGpuMode;gpuResize();if(gpuQuery('gpuoverlay','1'))layer.forceOverlay();syncGpuLayer()}).catch(gpuFail)}catch(e){gpuFail(e)}}
// v0.56 bloom & lighting: a second Three.js canvas above #game, composited with plus-lighter. It blurs
// the bright parts of a small copy of each frame and adds sparks and light pools. Optional: any failure
// leaves the v0.55 behaviour. If the copy cannot be read (an untrusted image), bloom uses glow sprites only.
// v0.57 adaptive bloom: the saved setting is a ceiling. During play, two consecutive two-second windows
// below ~85% of the target frame rate step bloom down one level for the session; ten good seconds step it
// back up. A level that slows the game again within six seconds of returning is locked for the session.
var bloomCap=2,bloomUpLock=3,bloomPerf={last:0,sum:0,n:0,since:0,bad:0,good:0,raisedAt:-1e9};
function bloomWanted(){return {off:0,subtle:1,full:2}[graphicsVisual.bloom||'off']||0}
function bloomLevel(){return ['off','subtle','full'][Math.min(bloomWanted(),bloomCap)]}
function bloomActive(){return gpuActive()&&bloomState==='ready'&&!!bloomLayer&&bloomLevel()!=='off'}
// v0.59 sector weather shares the top canvas: it stays on with bloom off, and is always off with reduced motion.
function weatherWanted(){return (graphicsVisual.weather||'off')==='on'&&!reducedMotion}
function topActive(){return gpuActive()&&bloomState==='ready'&&!!bloomLayer&&(bloomLevel()!=='off'||weatherWanted())}
function bloomTargetMs(){let limit=graphics.fpsLimit==='display'?0:Number(graphics.fpsLimit),refresh=1000/Math.max(1000/120,graphicsTiming.refresh||1000/60);return 1000/Math.min(limit||refresh,refresh)}
function adaptBloom(now){let P=bloomPerf;if(state!=='play'||bloomState!=='ready'||bloomWanted()===0||graphics.preset==='low'){P.last=0;P.sum=P.n=P.bad=P.good=0;return}
 if(P.last){let ms=now-P.last;if(ms>0&&ms<250){P.sum+=ms;P.n++}}P.last=now;if(!P.since)P.since=now;if(now-P.since<2000)return;
 let avg=P.n?P.sum/P.n:0,target=bloomTargetMs(),level=Math.min(bloomWanted(),bloomCap);P.since=now;P.sum=P.n=0;if(!avg)return;
 if(avg>target*1.18){P.good=0;if(++P.bad>=2&&level>0){P.bad=0;if(now-P.raisedAt<6000)bloomUpLock=Math.min(bloomUpLock,level-1);bloomCap=level-1;syncGpuLayer()}}
 else if(avg<target*1.06){P.bad=0;if(++P.good>=5&&level<bloomWanted()&&level<bloomUpLock){P.good=0;bloomCap=level+1;P.raisedAt=now;syncGpuLayer()}}
 else{P.bad=0;P.good=0}}
function bloomFail(reason){bloomState='failed';try{bloomLayer?.setVisible(false)}catch(e){}bloomLayer=null;if(typeof console!=='undefined')console.warn('Reactor Rogue bloom unavailable.',reason);syncGpuLayer()}
function startBloomLayer(){if(bloomState!=='idle'||!gpuModule||bloomWanted()===0&&!weatherWanted())return;bloomState='loading';try{gpuModule.createBloomLayer(document.getElementById('gpuBloom')).then(layer=>{if(!layer)throw Error('bloom renderer could not start');bloomLayer=layer;bloomState='ready';layer.onLost=()=>bloomFail('WebGL context lost');let el=document.getElementById('gpuBloom');el.style.mixBlendMode=typeof CSS!=='undefined'&&CSS.supports?.('mix-blend-mode','plus-lighter')?'plus-lighter':'screen';gpuResize();syncGpuLayer()}).catch(bloomFail)}catch(e){bloomFail(e)}}
function syncWeatherStatus(){let el=typeof document!=='undefined'&&document.getElementById?document.getElementById('weatherStatus'):null;if(!el)return;let on=(graphicsVisual.weather||'off')==='on';
 el.textContent=graphics.gpu==='off'||gpuState==='failed'?'Needs GPU effects.':!on?(graphics.preset==='auto'?'Off · Auto is at Low detail; choose Medium or High to keep weather on.':graphics.preset==='low'?'Off · the Low preset turns weather off.':'Off.'):reducedMotion?(graphics.motion==='system'?'Paused · your device has Reduce Motion on. Set Reduced motion below to Off to show weather.':'Paused · Reduced motion is on.'):bloomState==='ready'?'On · every sector has its own weather; strongest in Storm Relay, Cryo Reach, Cinder Foundry and the Undercity.':bloomState==='failed'?'Unavailable on this device.':'Loading…'}
function syncBloomStatus(){syncWeatherStatus();let el=typeof document!=='undefined'&&document.getElementById?document.getElementById('bloomStatus'):null;if(!el)return;let capped=bloomWanted()>0&&bloomLevel()!==(graphicsVisual.bloom||'off');el.textContent=graphics.gpu==='off'||gpuState==='failed'?'Needs GPU effects.':bloomWanted()===0?'Off.':bloomState==='ready'?(capped?(bloomLevel()==='off'?'Paused to keep the game smooth':'Eased to Subtle to keep the game smooth'):'On · '+(bloomCaptureOk?'bloom from the whole frame':'bloom from effects only'))+(graphics.preset==='auto'?' · set by Auto':''):bloomState==='failed'?'Unavailable on this device.':'Loading…'}
function syncGpuLayer(){if(graphics.gpu!=='off'&&gpuState==='idle')startGpuLayer();if(gpuState==='ready')startBloomLayer();let bloom=bloomActive();try{gpuLayer?.setVisible(gpuActive()&&!(gpuLayer.mode==='overlay'&&bloom))}catch(e){gpuFail(e)}try{bloomLayer?.setVisible(topActive())}catch(e){bloomFail(e)}syncGpuStatus();syncBloomStatus()}
// Compatibility mode: the 2D canvas keeps painting the background and the GPU canvas moves above it,
// adding glow and particles with additive (plus-lighter) compositing. Used when the GPU background
// self-check fails, e.g. a browser that cannot upload the sector tile.
function applyGpuMode(mode){syncGpuLayer();try{let gl=document.getElementById('gpuLayer'),game=document.getElementById('game');if(mode==='overlay'){game.after(gl);gl.style.mixBlendMode=typeof CSS!=='undefined'&&CSS.supports?.('mix-blend-mode','plus-lighter')?'plus-lighter':'screen'}else{game.before(gl);gl.style.mixBlendMode=''}}catch(e){gpuFail(e)}syncGpuStatus()}
function gpuResize(){if(gpuLayer)try{gpuLayer.resize(W,H,canvas.width/W)}catch(e){gpuFail(e)}if(bloomLayer)try{bloomLayer.resize(W,H,canvas.width/W)}catch(e){bloomFail(e)}}
function beginGpuFrame(){gpuFrame.on=gpuActive();gpuFrame.overlay=gpuFrame.on&&gpuLayer.mode==='overlay';gpuFrame.ox=W/2-(s?s.p.x:0);gpuFrame.oy=H/2-(s?s.p.y:0);gpuFrame.background=null;gpuFrame.tint=null;gpuFrame.top=gpuFrame.on&&topActive();gpuFrame.bloom=gpuFrame.top&&bloomLevel()!=='off';if(gpuFrame.on)try{gpuLayer.begin()}catch(e){gpuFail(e)}if(gpuFrame.top)try{bloomLayer.begin()}catch(e){bloomFail(e);gpuFrame.top=gpuFrame.bloom=false}}
function captureGpuCamera(){try{let m=ctx.getTransform(),k=canvas.width/W||1;gpuFrame.ox=m.e/k;gpuFrame.oy=m.f/k}catch(e){}}
function gpuShotColor(b){let id=b.weapon||(b.cannon?'cannon':b.frost?'frost':b.homing?'seeker':'bolt');return s?.evolved?.[id]?evoStyles[id]?.color||b.color:b.color||attackArtColor(id)}
function collectGpuSprites(px,py){let B=gpuFrame.bloom?bloomLayer:null,whole=!!B&&bloomCaptureOk,G=B?(x,y,r,c,a,h)=>B.glow(x,y,r,c,a,h):(x,y,r,c,a,h)=>gpuLayer.sprite(x,y,r,c,a,h),Sp=B?(x,y,r,c,a,h)=>B.screen(x,y,r,c,a,h):G,L={sprite:G},ox=gpuFrame.ox,oy=gpuFrame.oy,glow=graphicsVisual.glow==='off'?0:graphicsVisual.glow==='low'?.65:1,crowded=graphics.preset==='auto'&&graphicsCrowd.active,g=(crowded?glow*.7:glow)*(gpuFrame.overlay&&!B?.7:1);
 if(!s)return;
 // With whole-frame bloom the captured image already carries ship and enemy brightness.
 if(g>0&&whole)g*=.45;
 if(g>0){
  if(!whole){L.sprite(s.p.x+ox,s.p.y+oy,42,'#69f5e1',.2*g);for(let e of s.enemies){if(e.hp<=0)continue;let r=e.r||12;L.sprite(e.x+ox,e.y+oy,r*(e.boss?2.5:1.9),e.c||'#e28ca6',(e.boss?.26:.16)*g)}}
  for(let b of s.shots){let r=Math.max(2,b.r||4);L.sprite(b.x+ox,b.y+oy,r*5+8,gpuShotColor(b),.6*g)}
  for(let b of s.hostile||[]){if(b.life<=0)continue;let r=b.r||4;L.sprite(b.x+ox,b.y+oy,r*4.5+8,'#ff7a5c',.55*g)}
  for(let gem of s.gems){let c=gem.v>=50?'#ffcf64':gem.v>=15?'#c18aff':gem.v>=5?'#69ef9d':'#52dbff';L.sprite(gem.x+ox,gem.y+oy,gem.v>=15?20:14,c,.22*g)}
  for(let f of s.fx){if(f.type!=='blast')continue;let age=1-f.life/f.max,rad=Math.max(1,f.r*(.1+age*1.15));L.sprite(f.x+ox,f.y+oy,rad*1.6,f.c,(whole?.3:.65)*Math.pow(f.life/f.max,2)*g)}
  for(let b of s.combatBlasts||[]){let age=1-b.life/b.max,fade=1-age,expand=reducedMotion?.65:1-Math.pow(1-age,2);L.sprite(b.x+ox,b.y+oy,Math.max(4,b.r*expand*1.8),b.c,(whole?.35:.8)*fade*g);if(age<.35&&!whole)L.sprite(b.x+ox,b.y+oy,Math.max(3,b.r*.45),'#fff1bf',(.35-age)*1.6*g,.6)}
 }
 if(graphicsParticles()>0)for(let p of s.particles){let a=clamp(p.life/p.max,0,1);if(B){Sp(p.x+ox,p.y+oy,p.r*1.5+1,p.c,a,.8);if(g>0)G(p.x+ox,p.y+oy,p.r*3+3,p.c,a*.7,0)}else if(g>0)L.sprite(p.x+ox,p.y+oy,p.r*2.6+2,p.c,a*.85,.55);else L.sprite(p.x+ox,p.y+oy,p.r*.75+.5,p.c,a,1)}
 // Light pools: a soft wash of each light over ships and scenery on the bloom canvas.
 if(B)for(let l of gpuFrame.lights||[])Sp(l.x,l.y,l.r*.75,l.c,Math.min(.12,l.i*.09),0)
}
// Light sources in screen space: explosions, blast effects, bosses and the player's ship. Scaled by the
// bloom level and kept gentler when flashes are reduced, off or motion is reduced.
function collectGpuLights(){let out=[];if(!s||!gpuFrame.top)return out;if(!gpuFrame.bloom)return weatherLights().slice(0,12);let ox=gpuFrame.ox,oy=gpuFrame.oy,level=bloomLevel()==='full'?1:.6,calm=reducedMotion||graphicsVisual.flash==='off'?.45:graphicsVisual.flash==='reduced'?.7:1;
 out.push({x:s.p.x+ox,y:s.p.y+oy,r:140,i:.14,c:'#69f5e1'});
 for(let b of s.combatBlasts||[]){let age=1-b.life/b.max,fade=1-age,expand=reducedMotion?.65:1-Math.pow(1-age,2);out.push({x:b.x+ox,y:b.y+oy,r:Math.max(60,b.r*(1.8+expand*1.4)),i:.75*fade*fade*calm,c:b.c})}
 for(let f of s.fx){if(f.type!=='blast')continue;let a=f.life/f.max;out.push({x:f.x+ox,y:f.y+oy,r:Math.max(50,f.r*2.2),i:.5*a*a*a*calm,c:f.c})}
 for(let e of s.enemies)if(e.boss&&e.hp>0)out.push({x:e.x+ox,y:e.y+oy,r:(e.r||40)*4,i:.3,c:e.c||'#e28ca6'});
 for(let l of out)l.i*=level;out=out.concat(weatherLights());out=out.filter(l=>l.i>.02&&l.x>-l.r&&l.y>-l.r&&l.x<W+l.r&&l.y<H+l.r).sort((a,b)=>b.i*b.r-a.i*a.r).slice(0,12);return out}
// Sector weather events (screen space, cosmetic). Their own random stream keeps them separate from
// combat and from other visual effects. Storm lightning: bolts + a scene-wide light, a distant flicker
// with flashes off. Foundry: slow furnace glows from the edges. Undercity: flickering neon sign light.
var weatherState={seed:0x5eed1234,last:null,sector:'',strikes:[],glows:[],nextStrike:4,nextGlow:3};
const weatherTypes={grid:1,belt:2,storm:3,foundry:4,cryo:5,city:6};
function weatherRand(){weatherState.seed=(Math.imul(weatherState.seed,1664525)+1013904223)>>>0;return weatherState.seed/4294967296}
function weatherAmount(){return graphics.preset==='auto'&&graphicsCrowd.active?.7:1}
function weatherFlash(){return graphicsVisual.flash==='off'?0:graphicsVisual.flash==='reduced'?.5:1}
function makeStrike(){let x0=W*(.12+.76*weatherRand()),x1=x0+(weatherRand()-.5)*W*.35,y1=H*(.35+.45*weatherRand()),pts=[[x0,-30]],n=12;
 for(let i=1;i<=n;i++){let q=i/n,j=(1-q*.6)*22;pts.push([x0+(x1-x0)*q+(weatherRand()-.5)*2*j,-30+(y1+30)*q+(weatherRand()-.5)*8])}
 let branch=[],from=pts[5],bx=from[0],by=from[1],dir=weatherRand()<.5?-1:1;branch.push([bx,by]);for(let i=1;i<=5;i++){bx+=dir*(10+weatherRand()*14);by+=14+weatherRand()*16;branch.push([bx,by])}
 return {pts,branch,x:x1,y:y1,life:.5,max:.5}}
function strikeLevel(k){let age=1-k.life/k.max;return age<.1?1:age<.18?.2:age<.3?.85:Math.max(0,(1-age)*.5)}
function stepWeather(){let Wt=weatherState;if(!s||!weatherWanted()){Wt.last=null;Wt.strikes=[];Wt.glows=[];return}let dt=Wt.last===null?0:Math.max(0,Math.min(.1,s.t-Wt.last));Wt.last=s.t;
 if(Wt.sector!==s.sector){Wt.sector=s.sector;Wt.strikes=[];Wt.glows=[];Wt.nextStrike=3+weatherRand()*4;Wt.nextGlow=2}
 if(s.sector==='storm'&&(Wt.nextStrike-=dt)<=0){Wt.nextStrike=5+weatherRand()*8;Wt.strikes.push(makeStrike())}
 if((s.sector==='foundry'||s.sector==='city')&&(Wt.nextGlow-=dt)<=0){let city=s.sector==='city',side=weatherRand()<.5;Wt.nextGlow=city?2.5+weatherRand()*4:4+weatherRand()*5;
  Wt.glows.push(city?{x:side?-30:W+30,y:H*(.15+.7*weatherRand()),r:W*.55,c:weatherRand()<.5?'#ff5fd2':'#5ce8ff',life:.9,max:.9,flicker:true}:{x:W*(.1+.8*weatherRand()),y:side?H+60:-60,r:Math.max(W,H)*.6,c:'#ff8a3d',life:2.8,max:2.8,flicker:false})}
 for(let k of Wt.strikes)k.life-=dt;Wt.strikes=Wt.strikes.filter(k=>k.life>0);for(let g of Wt.glows)g.life-=dt;Wt.glows=Wt.glows.filter(g=>g.life>0)}
function weatherLights(){let out=[],a=weatherAmount(),f=weatherFlash();if(!weatherWanted())return out;
 for(let k of weatherState.strikes){let v=strikeLevel(k);out.push({x:k.x,y:k.y*.5,r:Math.max(W,H)*1.1,i:1.25*v*(f||.12)*a,c:'#b7a6ff'})}
 for(let g of weatherState.glows){let age=1-g.life/g.max,env=Math.sin(Math.PI*age),fl=g.flicker?(Math.sin(age*48)>-.2?1:.35):1;out.push({x:g.x,y:g.y,r:g.r,i:(g.flicker?.35:.5)*env*fl*a,c:g.c})}
 return out}
function drawWeatherBolts(){if(!weatherFlash())return;let B=bloomLayer,bloom=gpuFrame.bloom,f=weatherFlash();for(let k of weatherState.strikes){let v=strikeLevel(k)*f;if(v<.03)continue;
 for(let path of [k.pts,k.branch])for(let i=1;i<path.length;i++){let [ax,ay]=path[i-1],[bx,by]=path[i],len=Math.hypot(bx-ax,by-ay),n=Math.max(1,Math.ceil(len/1.6)),main=path===k.pts;
  for(let j=0;j<n;j++){let q=j/n,x=ax+(bx-ax)*q,y=ay+(by-ay)*q;B.screen(x,y,main?2.4:1.6,'#f4efff',v,1);if(j%7===0){if(bloom)B.glow(x,y,main?14:9,'#9d86ff',v*.55,0);else B.screen(x,y,main?12:8,'#9d86ff',v*.14,0)}}}}}
function weatherFrame(px,py){let type=s&&weatherWanted()?weatherTypes[s.sector]||0:0;return type?{type,amount:weatherAmount(),camX:px,camY:py,time:s.t}:null}
// Small copy of the 2D frame for whole-frame bloom. A read check every two seconds detects an untrusted
// (tainted) canvas, which WebGL cannot read; bloom then uses glow sprites only for the session.
// v0.85 post-processing cues (cosmetic): a short chromatic fringe and red edge flash when the hull is hit, a warm flash on boss kills, fine film grain on Medium/High.
function postFxFrame(full){if(!s||state!=='play'&&state!=='pause')return {grain:0};let now=s.t+(s.dying?s.dying.t:0),hit=s.fxHitAt!=null?Math.max(0,1-(now-s.fxHitAt)/.38):0,fl=s.fxFlashAt!=null?Math.max(0,1-(now-s.fxFlashAt)/.6):0,calm=reducedMotion,flash=null;
 if(hit>0)flash={color:'#ff2f55',amount:.38*hit};else if(fl>0)flash={color:s.fxFlashColor||'#ffe7a8',amount:.32*fl};
 return {chroma:calm?0:hit*(full?1:.6),flash,grain:calm?0:({off:0,low:.012,medium:.03,strong:.05}[graphics.filmGrain||'low']??.012)*(full||graphics.preset==='high'?1:.7),time:s.t}}
// v0.88 three.quarks explosions on the GPU top layer (cosmetic; the 2D effects still play underneath).
let fxClockAt=0,fxBudget={t:0,n:0};
function particleClock(){let now=performance.now(),d=fxClockAt?(now-fxClockAt)/1000:0;fxClockAt=now;return state==='play'?Math.min(d,.05):0}
function fxColour(c){let m=/^#?([0-9a-f]{6})/i.exec(String(c||''));if(!m)return [1,.6,.3];let n=parseInt(m[1],16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
function fxBurst(kind,x,y,c,scale=1){if(!bloomLayer||!bloomLayer.particles||!gpuFrame.top)return;let p=graphicsParticles();if(!(p>0))return;let now=performance.now();if(now-fxBudget.t>120){fxBudget.t=now;fxBudget.n=0}if(kind==='enemy'&&++fxBudget.n>(graphicsCrowd.active?3:7))return;let density=Math.min(1,p)*(graphicsCrowd.active&&kind==='enemy'?.5:1);try{bloomLayer.burst(kind,x,y,fxColour(c),scale,density)}catch(e){}}
function bloomFrameCopy(){if(!bloomCaptureOk)return null;try{let cw=Math.max(1,Math.ceil(W/3)),ch=Math.max(1,Math.ceil(H/3));if(!bloomCapture)bloomCapture=document.createElement('canvas');if(bloomCapture.width!==cw||bloomCapture.height!==ch){bloomCapture.width=cw;bloomCapture.height=ch}let g=bloomCapture.getContext('2d');g.clearRect(0,0,cw,ch);g.drawImage(canvas,0,0,cw,ch);let now=performance.now();if(now-bloomCheckAt>2000){bloomCheckAt=now;g.getImageData(0,0,1,1)}return bloomCapture}catch(e){bloomCaptureOk=false;if(typeof console!=='undefined')console.warn('Reactor Rogue bloom: frame copy unreadable; using effect glow only.',e);syncBloomStatus();return null}}
var gpuDebugAt=0;function finishGpuFrame(px,py,time){try{if(gpuFrame.top)stepWeather();gpuFrame.lights=collectGpuLights();collectGpuSprites(px,py);if(gpuFrame.top)drawWeatherBolts();let crowded=graphics.preset==='auto'&&graphicsCrowd.active;gpuLayer.render({background:gpuFrame.background,tint:gpuFrame.tint||gpuSectorTints[s?.sector]||gpuSectorTints.grid,camX:px,camY:py,time,reducedMotion,stars:graphics.preset==='low'||crowded?.6:1,lights:gpuFrame.overlay?[]:gpuFrame.lights});if(gpuFrame.top)try{let full=bloomLevel()==='full',k=crowded?.7:1,weather=weatherFrame(px,py);if(gpuFrame.bloom)bloomLayer.render({capture:bloomFrameCopy(),threshold:full?.5:.6,near:(full?.85:.5)*k,wide:(full?.95:.55)*k,weather,fx:postFxFrame(full),ox:gpuFrame.ox,oy:gpuFrame.oy,fxDt:particleClock()});else bloomLayer.render({bloom:false,weather,ox:gpuFrame.ox,oy:gpuFrame.oy,fxDt:particleClock()})}catch(e){bloomFail(e)}adaptBloom(performance.now());if(gpuQuery('gpudebug','1')&&performance.now()-gpuDebugAt>1000){gpuDebugAt=performance.now();syncGpuStatus()}}catch(e){gpuFail(e)}}
function draw(){
beamVisualCount=0;resetAttackArtFrame();updateGraphicsCrowd();beginGpuFrame();beginPixiFrame();if(gpuFrame.on&&!gpuFrame.overlay)ctx.clearRect(0,0,W,H);else{ctx.fillStyle='#07101f';ctx.fillRect(0,0,W,H)}
let px=s?s.p.x:0,py=s?s.p.y:0,t=s?s.t:0,visualTime=s?t:ambientTime;ctx.save();
if(s&&s.shake&&graphicsShake())ctx.translate(Math.sin(visualTime*97.3+px*.1)*s.shake*graphicsShake(),Math.sin(visualTime*83.1+py*.1)*s.shake*graphicsShake());
drawCombatKick();ctx.translate(W/2-px,H/2-py);if(gpuFrame.on)captureGpuCamera();
if(state==='menu'){ctx.save();ctx.translate(px,py);drawMenuScene(ambientTime);ctx.restore()}else if(s&&s.sector&&s.sector!=='grid')drawSectorArena(px,py,visualTime);else drawArena(px,py,visualTime);
if(s){
drawScorches();drawFormationWarnings();drawMerchant();drawTerrain(t);drawNewArsenal(t);drawExpansion();drawMobility();drawBreach(t);drawDebris(t);for(let m of s.mines)drawAttackMine(m,t);for(let f of s.fields)drawGravityArt(f,t);for(let c of s.clouds)drawToxicGas(c,t);for(let c of s.smoke)drawSmoke(c,t);drawEvolvedAreas(t);drawEvolutionSignatures(t);drawExtraArsenal(t);

for(let g of s.gems){if(Math.abs(g.x-px)>W/2+25||Math.abs(g.y-py)>H/2+25)continue;let color=g.v>=50?'#ffcf64':g.v>=15?'#c18aff':g.v>=5?'#69ef9d':'#52dbff',r=g.v>=50?7:g.v>=15?6:4;
let gemImg=pickupImage('gem'+(g.v>=50?3:g.v>=15?2:g.v>=5?1:0));if(gemImg){let sz=r*3.4+3,by=reducedMotion?0:Math.sin(t*4+g.x*.1)*3;softGlow(g.x,g.y+by,sz*.85,color,reducedMotion?.3:.2+.25*(.5+.5*Math.sin(t*3+g.x)));ctx.drawImage(gemImg,g.x-sz/2,g.y+by-sz/2,sz,sz);continue}
ctx.save();ctx.translate(g.x,g.y+(reducedMotion?0:Math.sin(t*4+g.x*.1)*3));ctx.shadowColor=color;ctx.shadowBlur=graphicsShadow(14);poly([[0,-r*1.5],[r,0],[0,r*1.5],[-r,0]],color,'#06101f',1.5);
ctx.shadowBlur=graphicsShadow(0);ctx.save();ctx.globalAlpha=reducedMotion?.3:.2+.25*(.5+.5*Math.sin(t*3+g.x));circle(0,0,r*1.8,color,false);ctx.restore();poly([[0,-r*1.5],[0,r*.65],[-r,0]],'#ffffff55');poly([[0,r*.65],[r,0],[0,r*1.5],[-r,0]],'#07101f66');poly([[0,-r*1.2],[r*.45,-r*.05],[0,r*.45]],'#ffffff80');
if(g.v>=15){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r*1.7,0);ctx.lineTo(-r*1.3,0);ctx.moveTo(r*1.3,0);ctx.lineTo(r*1.7,0);ctx.stroke()}ctx.restore()}
for(let beam of s.lances)drawWeaponBeam(beam,t,'solarLance',beam.r*2,'#ffae77');for(let b of s.shots)drawProjectile(b,t);


if(pixiFrame.on&&!pixiFrame.cam){pixiLayer.camera(ctx.getTransform());pixiFrame.cam=true}
for(let e of s.enemies){if(Math.abs(e.x-px)>W/2+45||Math.abs(e.y-py)>H/2+45)continue;ctx.save();ctx.translate(e.x,e.y);if(!(pixiFrame.on&&pixiEnemy(e,t)))enemyDesign(e,t);else drawSpecialist(e);drawFrozenHull(e,t);ctx.restore();
if(e.type>=2&&e.hp<e.max){ctx.fillStyle='#152336';ctx.fillRect(e.x-e.r,e.y-e.r-11,e.r*2,3);ctx.fillStyle=e.c;ctx.fillRect(e.x-e.r,e.y-e.r-11,e.r*2*clamp(e.hp/e.max,0,1),3)}}
drawBladeArt(t);
for(let f of s.fx){ctx.save();ctx.globalAlpha=f.life/f.max;ctx.lineWidth=f.width||2;ctx.shadowBlur=f.beamStyle?0:graphicsShadow(18);ctx.shadowColor=f.c;
if(f.type==='blast'){let age=1-f.life/f.max,rad=Math.max(1,f.r*(.1+age*1.15));ctx.globalAlpha=f.life/f.max;let flare=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,rad);flare.addColorStop(0,'#fff1bf55');flare.addColorStop(.25,'#ffbd7044');flare.addColorStop(.65,'#ff66352a');flare.addColorStop(1,'#ff394000');circle(f.x,f.y,rad,flare);ctx.shadowBlur=graphicsShadow(22);ctx.lineWidth=3*(1-age)+1;circle(f.x,f.y,rad,f.c,false);ctx.lineWidth=1;circle(f.x,f.y,rad*.74,'#ffe3ad',false);for(let i=0;i<8;i++){let a=i*TAU/8+f.x*.1;ctx.strokeStyle=f.c;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*rad*.65,f.y+Math.sin(a)*rad*.65);ctx.lineTo(f.x+Math.cos(a)*rad*.98,f.y+Math.sin(a)*rad*.98);ctx.stroke()}}
else if(f.type==='line'&&f.beamStyle){drawWeaponBeam(f,t)}
else if(f.type==='line'){if(['#c298ff','#edb6ff','#d8abff','#8cbfff','#e0edff'].includes(f.c))drawArcAttack(f,t);else drawLashAttack(f,t)}
else{let expansion=1-f.life/f.max;drawPressureWave(f.x,f.y,f.r*(1+expansion*.3),f.c,f.life/f.max)}ctx.restore()}
if(s.boosts.defence>0){ctx.save();ctx.translate(px,py);ctx.rotate(t*.4);ctx.shadowColor='#8abaff';ctx.shadowBlur=graphicsShadow(18);hex(31,'#8abaff0a','#8abaff',1.5);ctx.restore()}
if(s.boosts.speed>0){ctx.save();ctx.strokeStyle='#69f5e170';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(px,py,26+i*5,t*4+i,t*4+i+.7);ctx.stroke()}ctx.restore()}
if(s.boosts.damage>0){ctx.save();ctx.shadowColor='#ffb86e';ctx.shadowBlur=graphicsShadow(16);ctx.lineWidth=2;ctx.strokeStyle='#ffb86e';ctx.beginPath();ctx.arc(px,py,21,-.4+t*2,.8+t*2);ctx.arc(px,py,21,Math.PI-.4+t*2,Math.PI+.8+t*2);ctx.stroke();ctx.restore()}
if(!s.dying){drawDefensiveArt(t);
ctx.save();ctx.translate(px,py);if(s.p.inv>0&&Math.floor(t*18)%2===0)ctx.globalAlpha=.45;
pilotDesign(t);drawFrameAccent();ctx.restore();drawSupportModules(t)}
if(graphicsParticles()>0&&!gpuFrame.on)for(let p of s.particles){ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.c;ctx.fillRect(p.x-p.r/2,p.y-p.r/2,p.r,p.r)}ctx.globalAlpha=1;drawAttackImpacts(t);drawCombatExplosions();try{if(typeof Matter!=='undefined')wreckStep(visualTime);drawWreck()}catch(e){}try{drawShipTrail(visualTime)}catch(e){}drawPickupWaves();for(let d of s.drops)if(Math.abs(d.x-px)<W/2+70&&Math.abs(d.y-py)<H/2+70)drawDrop(d,t);drawDamageNumbers();drawCombatReadability();drawDeath();
}
ctx.restore();