function drawBayDrones(g,t,dt,shx,shy,kk,w,h){let B=bayFx;if(!B.crew)B.crew=[{a:0,r:1,weld:0,wx:0,wy:0},{a:Math.PI,r:1.1,weld:0,wx:0,wy:0}];B.welds=B.welds||[];g.save();
 for(let [i,d] of B.crew.entries()){d.a+=dt*(.45+i*.15);let ox=Math.cos(d.a)*62*kk*d.r,oy=Math.sin(d.a*1.3)*22*kk-30*kk;d.weld=Math.max(0,d.weld-dt);if(d.weld<=0&&Math.random()<dt*.25){d.weld=1.1;let side=Math.random()<.5?-1:1;d.wx=side*(8+Math.random()*10);d.wy=(Math.random()-.5)*16}
  let x,y;if(d.weld>0){let q=Math.min(1,(1.1-d.weld)/.3,d.weld/.3);x=shx+ox*(1-q)+d.wx*kk*q*1.6;y=shy+oy*(1-q)+(d.wy-10)*kk*q;if(d.weld<.8&&d.weld>.2)for(let n=0;n<2;n++){let a=Math.random()*TAU,sp=30+Math.random()*60;B.welds.push({x:x,y:y+5,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-10,age:0,life:.25+Math.random()*.25})}}else{x=shx+ox;y=shy+oy}
  g.globalAlpha=.95;g.fillStyle='#1b2a3a';g.strokeStyle='#9fb4c8';g.lineWidth=1;g.beginPath();g.ellipse(x,y,5,3.4,0,0,TAU);g.fill();g.stroke();g.fillStyle=d.weld>0?'#ffd56f':'#65f7ef';g.beginPath();g.arc(x,y+.5,1.4,0,TAU);g.fill();g.strokeStyle='#9fb4c855';g.beginPath();g.moveTo(x-7,y-3);g.lineTo(x+7,y-3);g.stroke()}
 g.globalCompositeOperation='lighter';for(let q of B.welds){q.age+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=120*dt;let a=1-q.age/q.life;if(a<=0)continue;g.globalAlpha=a;g.fillStyle=a>.5?'#fff6c8':'#ffb03a';g.fillRect(q.x,q.y,1.6,1.6)}B.welds=B.welds.filter(q=>q.age<q.life).slice(-80);g.restore()}
function drawBayScan(g,t,dt,shx,shy,kk,w,h){let B=bayFx;if(!(B.scan>0))return;B.scan+=dt;let dur=1.3,q=Math.min(1,B.scan/dur),y=q*h;if(B.scan>dur+2.6){B.scan=0;return}g.save();
 if(q<1){g.globalCompositeOperation='lighter';let lg=g.createLinearGradient(0,y-26,0,y);lg.addColorStop(0,'#65f7ef00');lg.addColorStop(1,'#65f7ef55');g.fillStyle=lg;g.fillRect(0,y-26,w,26);g.fillStyle='#bffcff';g.fillRect(0,y-1,w,2)}
 let st=shipStatValues(shipTreeBonus()),eng=equippedPart('engine').name.split(' ')[0].toUpperCase(),labels=[];   // v1.7: the bay's slot chips show this now
 g.globalCompositeOperation='source-over';g.font='600 9px "Exo 2",sans-serif';g.textBaseline='middle';for(let [ly,txt,side] of labels){let seen=(y-ly)/h;if(seen<0)continue;let a=Math.min(1,seen*6)*Math.min(1,(dur+2.6-B.scan)/.6),tw=g.measureText(txt).width,lx=side<0?14:w-14,end=side<0?lx+tw+6:lx-tw-6,hull=shx+side*30*kk;g.globalAlpha=a;g.fillStyle='#071122cc';g.fillRect(side<0?lx-4:lx-tw-4,ly-7,tw+8,14);g.strokeStyle='#65f7ef99';g.lineWidth=1;g.beginPath();g.moveTo(end,ly);g.lineTo(hull,ly);g.stroke();g.fillStyle='#65f7ef';g.beginPath();g.arc(hull,ly,1.8,0,TAU);g.fill();g.fillStyle='#bffcff';g.textAlign=side<0?'left':'right';g.fillText(txt,lx,ly)}
 g.restore()}


// v0.99 build radar, ship name and saved loadouts.
const radarAxes=['SPEED','DAMAGE','DEFENCE','CRIT','FIREPOWER','UTILITY'];
function buildShape(T){let st=shipStatValues(T),it=T.items||{},c=v=>Math.max(.06,Math.min(1,v));return [c((st.speed-110)/170),c((T.dmg+.12)/.9+T.rate*1.5),c((st.hull-60)/240*.6+st.armour/8*.4+(it.shield?.15:0)+(it.thorns?.08:0)),c((st.crit-4)/28),c((st.wslots-4)/3*.55+T.area/.3*.3+(it.area?.15:0)),c(T.magnet/.6*.4+T.greed/.4*.3+Object.keys(it).length/5*.4)]}
function drawRadar(dt){let c=typeof document!=='undefined'&&document.getElementById('radar');if(!c||!c.offsetParent)return;let dpr=Math.min(2,window.devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}let g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
 let B=bayFx,target=buildShape(shipTreeBonus()),prev=partPreview?buildShape(shipTreeBonus({[shipParts.find(x=>x.id===partPreview)?.slot]:partPreview})):null;B.radar=B.radar||target.map(()=>.06);for(let i=0;i<6;i++)B.radar[i]+=(target[i]-B.radar[i])*Math.min(1,dt*6);
 let cx=w/2,cy=h/2,R=Math.min(w*.28,h*.33),pt=(i,v)=>{let a=-Math.PI/2+i*TAU/6;return [cx+Math.cos(a)*R*v,cy+Math.sin(a)*R*v]},col=bayPilot().color;
 g.strokeStyle='#ffffff18';g.lineWidth=1;for(let ring of [.33,.66,1]){g.beginPath();for(let i=0;i<6;i++){let [x,y]=pt(i,ring);i?g.lineTo(x,y):g.moveTo(x,y)}g.closePath();g.stroke()}for(let i=0;i<6;i++){let [x,y]=pt(i,1);g.beginPath();g.moveTo(cx,cy);g.lineTo(x,y);g.stroke()}
 let shape=(vals,fill,stroke,dash)=>{g.beginPath();vals.forEach((v,i)=>{let [x,y]=pt(i,v);i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();if(fill){g.fillStyle=fill;g.fill()}g.setLineDash(dash||[]);g.strokeStyle=stroke;g.lineWidth=1.8;g.stroke();g.setLineDash([])};
 shape(B.radar,col+'38',col);if(prev)shape(prev,null,'#ffdc8d',[4,3]);for(let i=0;i<6;i++){let [x,y]=pt(i,B.radar[i]);g.fillStyle=col;g.beginPath();g.arc(x,y,2.4,0,TAU);g.fill()}
 g.font='600 8.5px "Exo 2",sans-serif';g.fillStyle='#91a6bb';g.textBaseline='middle';for(let i=0;i<6;i++){let [x,y]=pt(i,1.28),d=prev?prev[i]-target[i]:0;g.textAlign=Math.abs(x-cx)<4?'center':x<cx?'right':'left';g.fillStyle=d>.01?'#7cf4a0':d<-.01?'#ff8a98':'#91a6bb';g.fillText(radarAxes[i],x,y)}}
let renamingShip=false;
function shipDisplayName(){let n=(shipState().name||'').trim();return n||shipClassName()}
function saveLoadout(i){let sh=shipState(),ps=partState();sh.loadouts=sh.loadouts||[null,null,null];sh.loadouts[i]={eq:{...ps.eq},paint:{...sh.paint},label:shipDisplayName()+' · '+shipClassName()};saveHangar()}
function loadLoadout(i){let sh=shipState(),ps=partState(),L=(sh.loadouts||[])[i];if(!L)return false;for(let [slot,id] of Object.entries(L.eq||{}))if(ps.owned[id])ps.eq[slot]=id;sh.paint={...sh.paint,...L.paint};saveHangar();return true}
function renderLoadouts(){let L=shipState().loadouts||[null,null,null];return '<h4>Saved loadouts</h4><p class="fine loadout-help">Saves your parts, paint and trail. Skills stay as they are.</p><div class="loadouts">'+[0,1,2].map(i=>{let x=L[i];return '<div class="loadout'+(x?'':' empty')+'"><b>'+(i+1)+'</b><span>'+(x?x.label:'Empty slot')+'</span><button data-loadout-save="'+i+'">Save</button>'+(x?'<button class="primary" data-loadout-load="'+i+'">Load</button>':'')+'</div>'}).join('')+'</div>'}


if(typeof document!=='undefined'&&document.addEventListener){let commitName=()=>{let inp=document.getElementById('shipNameInput');if(!inp||!renamingShip)return;shipState().name=inp.value.replace(/[<>"]/g,'').trim().slice(0,16);renamingShip=false;saveHangar();renderPreflight();updateLaunchSummary()};document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='shipNameInput'&&(e.key==='Enter'||e.key==='Escape')){e.preventDefault();commitName()}},true);document.addEventListener('focusout',e=>{if(e.target&&e.target.id==='shipNameInput')setTimeout(commitName,0)});document.addEventListener('input',e=>{if(e.target&&e.target.id==='glowSlider'){partState();shipState().paint.glow=+e.target.value/100}});document.addEventListener('change',e=>{if(e.target&&e.target.id==='glowSlider')saveHangar()})}


// v0.99 launch sequence (bay lift-off + warp) and the ship marker that flies the star map route.
let launchBusy=false,launchDone=false,mapFrom='';
function warpTransition(mid){if(typeof document==='undefined'||!document.body){mid();return}let el=document.createElement('div');el.id='warp';let c=document.createElement('canvas');el.appendChild(c);document.body.appendChild(el);let w=innerWidth,h=innerHeight,dpr=Math.min(2,devicePixelRatio||1);c.width=w*dpr;c.height=h*dpr;let g=c.getContext('2d');g.scale(dpr,dpr);let stars=Array.from({length:160},()=>({a:Math.random()*TAU,r:Math.random()*40+5,v:.6+Math.random()*1.4,c:Math.random()<.2?'#ffdc8d':Math.random()<.5?'#65f7ef':'#ffffff'})),t0=performance.now(),swapped=false,col=bayPilot().color;
 let step=now=>{let t=(now-t0)/1000,cx=w/2,cy=h/2;g.fillStyle='rgba(3,6,14,'+Math.min(.9,t*3)+')';g.fillRect(0,0,w,h);g.globalCompositeOperation='lighter';let sp=Math.min(1,t/.55);for(let q of stars){let r0=q.r+Math.pow(t*q.v*3.2,2.2)*120,len=10+sp*sp*260*q.v;g.strokeStyle=q.c;g.globalAlpha=Math.min(1,t*4)*(t>.75?Math.max(0,1-(t-.75)/.35):1);g.lineWidth=1+sp*1.6;g.beginPath();g.moveTo(cx+Math.cos(q.a)*r0,cy+Math.sin(q.a)*r0);g.lineTo(cx+Math.cos(q.a)*(r0+len),cy+Math.sin(q.a)*(r0+len));g.stroke()}
  if(t>.45&&t<.85){let f=1-Math.abs(t-.62)/.2;let rg=g.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.7);rg.addColorStop(0,'#ffffff');rg.addColorStop(.25,col);rg.addColorStop(1,col+'00');g.globalAlpha=Math.max(0,f);g.fillStyle=rg;g.fillRect(0,0,w,h)}g.globalCompositeOperation='source-over';g.globalAlpha=1;
  if(!swapped&&t>.62){swapped=true;mid()}if(t>.62)el.style.opacity=String(Math.max(0,1-(t-.62)/.45));if(t<1.1)requestAnimationFrame(step);else el.remove()};requestAnimationFrame(step)}
function planetPos(id){let L=mapLayout(),q=L.pts.find(p=>p.id===id)||L.pts[0];return {x:q.x,y:q.y}}
function placeMapShip(fly){let m=typeof document!=='undefined'&&document.getElementById('mapShip');if(!m||!m.style)return;let to=planetPos(hangar.sector),from=fly&&mapFrom&&mapFrom!==hangar.sector?planetPos(mapFrom):null,set=(p,anim)=>{m.style.transition=anim?'left .9s cubic-bezier(.5,0,.3,1),top .9s cubic-bezier(.5,0,.3,1)':'none';m.style.left='calc('+p.x+'% + '+(p===to&&!from?50:44)+'px)';m.style.top=(p.y-26)+'px'};
 if(from&&!reducedMotion){set(from,false);let a=Math.atan2(to.y-from.y,(to.x-from.x)*4.2)*180/Math.PI+90;m.style.setProperty('--rot',a+'deg');m.classList.add('flying');void m.offsetWidth;requestAnimationFrame(()=>{set(to,true);setTimeout(()=>{m.classList.remove('flying');m.style.setProperty('--rot','0deg')},950)})}else set(to,false);mapFrom=''}


// v0.99 swipe between Skills / Parts / Paint (and between branches on the tree), and tilt parallax in the bay.
let swipeStart=null,swipeDir='';
if(typeof document!=='undefined'&&document.addEventListener){
 document.addEventListener('touchstart',e=>{if(state!=='preflight'||preflightStep!=='ship'||e.touches.length!==1)return;let t=e.target,p0=e.touches[0];if(!t||!t.closest||!t.closest('#pilotPicker')||t.closest('#shipBay,#colourWheel,input,#radar'))return;swipeStart={x:p0.clientX,y:p0.clientY,branch:!!t.closest('.tree-path,.tree-tabs,.radar-card,.tree-tag'),time:performance.now()}},{passive:true});
 document.addEventListener('touchend',e=>{let st=swipeStart;swipeStart=null;if(!st||state!=='preflight')return;let p1=e.changedTouches[0];if(!p1)return;let dx=p1.clientX-st.x,dy=p1.clientY-st.y;if(Math.abs(dx)<70||Math.abs(dy)>45||performance.now()-st.time>700)return;let dir=dx<0?1:-1;if(st.branch&&shipView==='skills'){let i=shipBranches.findIndex(b=>b.id===treeBranch),n=shipBranches.length;treeBranch=shipBranches[(i+dir+n)%n].id}else{let views=['skills','parts','paint'],i=views.indexOf(shipView);shipView=views[(i+dir+3)%3];partPreview=''}respecArmed=false;swipeDir=dir>0?'left':'right';try{sound('ui')}catch(_){}renderPreflight();swipeDir=''},{passive:true});
 document.addEventListener('touchcancel',()=>{swipeStart=null});
 // tilt: mouse position over the bay on desktop, device orientation on phones (iPhone asks once)
 document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||bayFx.drag)return;let c=document.getElementById('shipBay');if(!c||!c.offsetParent)return;let r=c.getBoundingClientRect();if(e.clientY<r.top-60||e.clientY>r.bottom+60)return;bayFx.ttx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);bayFx.tty=clamp((e.clientY-r.top)/r.height*2-1,-1,1)});
}
let tiltOn=false;
function onTilt(e){if(e.gamma==null)return;bayFx.ttx=clamp((e.gamma||0)/25,-1,1);bayFx.tty=clamp(((e.beta||0)-45)/25,-1,1)}
function toggleTilt(){if(tiltOn){tiltOn=false;removeEventListener('deviceorientation',onTilt);bayFx.ttx=bayFx.tty=0;renderPreflight();return}let go=()=>{tiltOn=true;addEventListener('deviceorientation',onTilt);renderPreflight()};try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')go()}).catch(()=>{});else go()}catch(e){}}


// v0.99 hull detailing: specular sheen, rear shading, panel seams, rivets, vents, nozzles and antenna.
// Deterministic (no randomness); the full set only draws in the hangar, runs get the sheen and seams.
function drawHullDetail(g,shape,c,full,noNozzles){let path=k=>{g.beginPath();shape.forEach((q,i)=>{let x=q[0]*k,y=q[1]*k+(1-k)*2;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath()};let minY=Math.min(...shape.map(q=>q[1])),maxY=Math.max(...shape.map(q=>q[1])),maxX=Math.max(...shape.map(q=>Math.abs(q[0])));
 g.save();path(1);g.clip();g.shadowBlur=0;
 let rear=g.createLinearGradient(0,minY,0,maxY);rear.addColorStop(0,'#00000000');rear.addColorStop(.6,'#00000000');rear.addColorStop(1,'#00000066');g.fillStyle=rear;g.fillRect(-40,-40,80,80);
 let sheen=g.createLinearGradient(-maxX,minY,maxX*.4,maxY*.2);sheen.addColorStop(0,'#ffffff30');sheen.addColorStop(.45,'#ffffff0c');sheen.addColorStop(.46,'#ffffff00');g.fillStyle=sheen;g.fillRect(-40,-40,80,80);
 g.strokeStyle='#ffffff';g.lineWidth=.55;g.globalAlpha=.16;path(.68);g.stroke();
 g.globalAlpha=.13;g.lineWidth=.5;shape.forEach((q,i)=>{if(i%2)return;g.beginPath();g.moveTo(q[0]*.68,q[1]*.68+.64);g.lineTo(q[0]*.95,q[1]*.95+.1);g.stroke()});
 g.beginPath();g.moveTo(0,minY*.55);g.lineTo(0,maxY*.85);g.globalAlpha=.12;g.stroke();
 if(full){g.globalAlpha=.55;g.fillStyle='#d6eeff';shape.forEach((q,i)=>{let n=shape[(i+1)%shape.length];for(let f of [0,.5]){let x=(q[0]+(n[0]-q[0])*f)*.86,y=(q[1]+(n[1]-q[1])*f)*.86+.3;g.beginPath();g.arc(x,y,.42,0,TAU);g.fill()}});
  g.globalAlpha=.5;g.fillStyle='#050a12';g.strokeStyle='#ffffff';g.lineWidth=.3;for(let side of [-1,1])for(let k=0;k<3;k++){let x=side*(maxX*.48+k*1.6),y=3+k*1.4;g.save();g.translate(x,y);g.rotate(side*.5);g.fillRect(-.6,-2.6,1.2,5.2);g.globalAlpha=.25;g.strokeRect(-.6,-2.6,1.2,5.2);g.restore();g.globalAlpha=.5}
  g.globalAlpha=.35;g.strokeStyle=c;g.lineWidth=.45;for(let side of [-1,1]){g.beginPath();g.moveTo(side*maxX*.3,maxY*.2);g.lineTo(side*maxX*.62,maxY*.42);g.stroke()}}
 g.restore();
 if(full){g.save();g.globalAlpha=.9;if(!noNozzles)for(let side of [-1,1]){let x=side*8,y=maxY*.82;g.fillStyle='#0a1320';g.strokeStyle='#8fa6b8';g.lineWidth=.6;g.beginPath();g.ellipse(x,y,3,1.6,0,0,TAU);g.fill();g.stroke();g.fillStyle=c;g.shadowColor=c;g.shadowBlur=6;g.globalAlpha=.85;g.beginPath();g.ellipse(x,y,1.7,.8,0,0,TAU);g.fill()}
  g.shadowBlur=0;g.globalAlpha=.8;g.strokeStyle='#9fb4c8';g.lineWidth=.5;g.beginPath();g.moveTo(-3,minY*.62);g.lineTo(-5.5,minY*.92);g.stroke();g.fillStyle='#ff6a6a';g.beginPath();g.arc(-5.5,minY*.92,.7,0,TAU);g.fill();g.restore()}}


// v0.99 hangar scene: back wall with ribs and a girder, an observation window onto space, light rigs, hazard
// ring on the pad, BAY decal, docking clamps that release when you grab the ship or launch, dust in the light.
function drawHangarScene(g,t,dt,w,h,cx,pad,col,TX,TY,k){let B=bayFx;g.save();if(hangarArtReady()){g.fillStyle='#050b17';g.fillRect(0,0,w,h);let iw=w*1.14,ih=iw/1.5,ix=cx-iw/2-TX*8,iy=pad-ih*.8-TY*5;if(iy+ih<h){let f=(h-iy+4)/ih;iw*=f;ih*=f;ix=cx-iw/2-TX*8}g.drawImage(hangarImg,ix,iy,iw,ih);g.restore();g.save();B.dust=B.dust||Array.from({length:22},(_,i)=>({x:patternHash(i,1),y:patternHash(i,2),v:.2+patternHash(i,4)*.6}));g.fillStyle='#e8fbff';for(let d of B.dust){d.y-=dt*d.v*.05;d.x+=Math.sin(t*.6+d.v*9)*dt*.004;if(d.y<.15)d.y=.95;g.globalAlpha=.12+.25*Math.sin(t+d.v*20)**2;g.fillRect(d.x*w,d.y*h,1.2,1.2)}g.restore();return}
 let wall=g.createLinearGradient(0,0,0,pad);wall.addColorStop(0,'#0b1626');wall.addColorStop(1,'#060c18');g.fillStyle=wall;g.fillRect(0,0,w,pad);
 g.save();g.translate(-TX*5,-TY*3);
 let ww=w*.3,wh=h*.19,wx=cx-ww/2+w*.04,wy=18;g.fillStyle='#02040a';g.beginPath();g.roundRect?g.roundRect(wx,wy,ww,wh,8):g.rect(wx,wy,ww,wh);g.fill();g.save();g.clip();
 for(let i=0;i<40;i++){let x=wx+patternHash(i,3)*ww,y=wy+patternHash(i,7)*wh,tw=.5+.5*Math.sin(t*2+i);g.globalAlpha=.3+.5*tw*patternHash(i,9);g.fillStyle='#fff';g.fillRect(x-TX*3,y,1,1)}
 let px=wx+ww*.72-TX*6,py=wy+wh*.95,pr=wh*.7;let pl=g.createRadialGradient(px-pr*.35,py-pr*.45,pr*.1,px,py,pr);pl.addColorStop(0,'#7fd8ff');pl.addColorStop(.5,'#2a4f8a');pl.addColorStop(1,'#0a1430');g.globalAlpha=.95;g.fillStyle=pl;g.beginPath();g.arc(px,py,pr,0,TAU);g.fill();g.globalAlpha=.5;g.strokeStyle='#bfe9ff';g.lineWidth=1;g.beginPath();g.arc(px,py,pr,Math.PI*1.05,Math.PI*1.7);g.stroke();
 g.restore();g.strokeStyle='#2d4258';g.lineWidth=3;g.globalAlpha=1;g.beginPath();g.roundRect?g.roundRect(wx,wy,ww,wh,8):g.rect(wx,wy,ww,wh);g.stroke();g.lineWidth=2;for(let i=1;i<3;i++){g.beginPath();g.moveTo(wx+ww*i/3,wy);g.lineTo(wx+ww*i/3,wy+wh);g.stroke()}
 g.restore();
 g.save();g.translate(-TX*8,-TY*4);g.strokeStyle='#18283a';g.lineWidth=6;for(let i=-3;i<=3;i++){let x=cx+i*w*.17;if(Math.abs(i)<=1)continue;g.beginPath();g.moveTo(x,0);g.lineTo(x+(x-cx)*.15,pad-8);g.stroke()}
 g.fillStyle='#14243a';g.fillRect(0,wy+wh+6,w,7);g.fillStyle='#22364c';g.fillRect(0,wy+wh+6,w,1.5);for(let i=0;i<9;i++){let x=w*(i+.5)/9,on=((t*1.4+i*.37)%3)<2.4;g.fillStyle=on?'#ffdc8d':'#3a3220';g.globalAlpha=on?1:.6;g.fillRect(x-2,wy+wh+8,4,3)}g.globalAlpha=1;
 for(let side of [-1,1]){let x=cx+side*w*.3,y=wy+wh+13;g.fillStyle='#1d2d40';g.fillRect(x-9,y,18,6);g.fillStyle='#e8fbff';g.globalAlpha=.9;g.fillRect(x-6,y+5,12,2);let cone=g.createLinearGradient(0,y+7,0,pad+10);cone.addColorStop(0,'#e8fbff2a');cone.addColorStop(1,'#e8fbff00');g.globalAlpha=1;g.fillStyle=cone;g.beginPath();g.moveTo(x-6,y+7);g.lineTo(x+6,y+7);g.lineTo(x+side*-30+44,pad+10);g.lineTo(x+side*-30-44,pad+10);g.closePath();g.fill()}
 g.restore();
 B.dust=B.dust||Array.from({length:22},(_,i)=>({x:patternHash(i,1),y:patternHash(i,2),v:.2+patternHash(i,4)*.6}));g.fillStyle='#e8fbff';for(let d of B.dust){d.y-=dt*d.v*.05;d.x+=Math.sin(t*.6+d.v*9)*dt*.004;if(d.y<.15)d.y=.95;let x=d.x*w,y=d.y*h,a=.12+.25*Math.sin(t+d.v*20)**2;g.globalAlpha=a;g.fillRect(x,y,1.2,1.2)}g.globalAlpha=1;
 g.restore()}
function drawPadDetail(g,t,w,h,cx,pad,col,TX,TY,k){if(hangarArtReady()){g.save();g.translate(cx-TX*12,pad-TY*7);g.scale(1,.32);g.globalAlpha=.22;g.fillStyle=col;g.font='800 26px "Exo 2",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('BAY 07',0,w*.31*.42);g.restore();return}g.save();g.translate(cx-TX*12,pad-TY*7);g.scale(1,.32);let R=w*.31;for(let i=0;i<36;i++){let a0=i/36*TAU,a1=a0+TAU/36*.8;g.strokeStyle=i%2?'#1a1608':'#ffcf4a';g.globalAlpha=i%2?.9:.55;g.lineWidth=7;g.beginPath();g.arc(0,0,R,a0,a1);g.stroke()}g.globalAlpha=.5;g.strokeStyle='#2d4258';g.lineWidth=2;g.beginPath();g.arc(0,0,R+7,0,TAU);g.stroke();
 g.globalAlpha=.32;g.fillStyle=col;g.font='800 40px "Exo 2",sans-serif';g.textAlign='center';g.textBaseline='middle';g.font='800 30px "Exo 2",sans-serif';g.fillText('BAY 07',0,R*.4);g.restore()}
function drawClamps(g,t,dt,w,cx,shy,kk,rot){let B=bayFx,want=(B.drag||B.launch>0||Math.abs(B.rotVel||0)>.6||Math.abs(rot)>.15)?0:1;B.clamp=(B.clamp??1)+(want-(B.clamp??1))*Math.min(1,dt*(want?3:9));let q=B.clamp;if(q<.02)return;g.save();for(let side of [-1,1]){let base=side<0?0:w,tip=cx+side*(26*kk),reach=base+(tip-base)*(.55+.45*q),y=shy+4*kk;g.strokeStyle='#1d2d40';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(base,y+14);g.lineTo(base+(reach-base)*.55,y+6);g.lineTo(reach,y);g.stroke();g.strokeStyle='#3d5670';g.lineWidth=2;g.beginPath();g.moveTo(base,y+11);g.lineTo(base+(reach-base)*.55,y+3);g.lineTo(reach,y-3);g.stroke();g.fillStyle='#2a3e55';g.beginPath();g.arc(base+(reach-base)*.55,y+6,5,0,TAU);g.fill();g.fillStyle=q>.9?'#7cf4a0':'#ffcf4a';g.beginPath();g.arc(base+(reach-base)*.55,y+6,1.8,0,TAU);g.fill();g.fillStyle='#3d5670';g.fillRect(reach-(side<0?0:6),y-5,6,10)}g.restore()}

const nodeIcon={i_thrust:'speed',i_crit:'crit',i_burn:'speed',i_reflex:'clock',i_key:'power',j_hull:'hull',j_armour:'armour',j_shield:'shield',j_spikes:'thorns',j_key:'armour',g_dmg:'power',g_rate:'clock',g_crit:'crit',g_area:'area',g_key:'nova',c_magnet:'magnet',c_greed:'luck',c_drones:'seeker',c_sats:'blade',c_key:'seeker'};

// v0.99 ship part art (ChatGPT sheets, cut into part-<id>-v0990.webp). Engines and wings sit behind the hull,
// plating and gun mounts on top of it (under the rotating turret). Stock parts are the ship's own look, so only
// found parts (Rare and up) are drawn on the hull. Sizes are in hull units (nose up, ship about 50 units long).
const partArtSize={"m_stock": [196, 228], "m_heavy": [153, 256], "m_rotary": [171, 256], "m_array": [256, 212], "m_siege": [194, 256], "p_stock": [197, 256], "p_reactive": [209, 256], "p_light": [223, 256], "p_heavy": [212, 256], "p_aegis": [228, 256], "e_stock": [244, 227], "e_twin": [256, 216], "e_ion": [256, 222], "e_fusion": [256, 250], "e_nova": [244, 256], "w_stock": [256, 158], "w_razor": [256, 211], "w_vane": [256, 171], "w_prism": [256, 195], "w_phantom": [256, 187]};
const partArtPlace={engine:{w:26,x:0,y:25},wings:{w:64,x:0,y:3},plating:{w:21,x:0,y:3},mount:{w:13,x:0,y:-21}};
const partImgs={};
function partImg(id){if(typeof Image==='undefined')return null;if(!partImgs[id]){let im=new Image();im.decoding='async';im.src='part-'+id+'-v0990.webp';partImgs[id]=im}return partImgs[id]}
// Card art: painted art for the original parts; parts added in v1.7 are rendered from their own 3D models
// (so the card matches what is fitted); reactor cores get a generated emblem, as they sit inside the hull.
const partArtV1700=['e_phantom','w_graviton','m_solarfang','p_chitin','p_titan'];
function partSrc(id){if(id&&id[0]==='r'&&id[1]==='_')return reactorEmblem(id);return 'part-'+id+(partArtV1700.includes(id)?'-v1700':'-v0990')+'.webp'}
const reactorLook={r_stock:[6,0,'#9fdcff'],r_survey:[10,4,'#78e99e'],r_hot:[8,8,'#ff9a4a'],r_capacitor:[12,0,'#6daaff'],r_sustain:[16,6,'#9fe8ff'],r_overload:[6,12,'#ffb04a']};
function reactorEmblem(id){let [seg,rays,c]=reactorLook[id]||reactorLook.r_stock,d=shipParts.find(x=>x.id===id),rc=partRarity[d?.r||0].c,arcs='',spokes='';
 for(let i=0;i<seg;i++){let a0=i/seg*Math.PI*2+.08,a1=(i+1)/seg*Math.PI*2-.08,R=96;arcs+='<path d="M'+(128+Math.cos(a0)*R).toFixed(1)+' '+(125+Math.sin(a0)*R).toFixed(1)+' A'+R+' '+R+' 0 0 1 '+(128+Math.cos(a1)*R).toFixed(1)+' '+(125+Math.sin(a1)*R).toFixed(1)+'"/>'}
 for(let i=0;i<rays;i++){let a=i/rays*Math.PI*2;spokes+='<line x1="'+(128+Math.cos(a)*44).toFixed(1)+'" y1="'+(125+Math.sin(a)*44).toFixed(1)+'" x2="'+(128+Math.cos(a)*78).toFixed(1)+'" y2="'+(125+Math.sin(a)*78).toFixed(1)+'"/>'}
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 250"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="'+c+'"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="125" r="112" fill="#0b1626" stroke="#2c4258" stroke-width="6"/><circle cx="128" cy="125" r="84" fill="#101e30" stroke="#3a5672" stroke-width="3"/><g fill="none" stroke="'+rc+'" stroke-width="9" stroke-linecap="round">'+arcs+'</g><g stroke="'+c+'" stroke-width="5" opacity=".75">'+spokes+'</g><circle cx="128" cy="125" r="58" fill="url(#g)"/><circle cx="128" cy="125" r="22" fill="#fff" opacity=".9"/></svg>';
 return 'data:image/svg+xml,'+encodeURIComponent(svg)}
function hullShapeOf(pilot){return fleetHullProfiles[pilot.id]||pilot.shape.split(' ').map(q=>q.split(',').map(Number))}
// Fit each part to this hull: anchors come from the hull outline (nose, widest point, rear).
function partFit(pilot,slot,id){let sh=hullShapeOf(pilot),minY=Math.min(...sh.map(q=>q[1])),maxY=Math.max(...sh.map(q=>q[1])),span=Math.max(...sh.map(q=>Math.abs(q[0])))*2,wide=sh.reduce((a,q)=>Math.abs(q[0])>Math.abs(a[0])?q:a,sh[0]),sz=partArtSize[id]||[256,256],ar=sz[1]/sz[0],w;
 if(slot==='wings'){w=span*1.28;return {w,h:w*ar,x:0,y:wide[1]*.55+2}}
 if(slot==='engine'){w=Math.min(28,Math.max(20,span*.5));let h=w*ar;return {w,h,x:0,y:maxY+h*.02}}
 if(slot==='plating'){w=span*.5;let h=w*ar;return {w,h,x:0,y:(minY+maxY)/2+4}}
 w=Math.max(10,span*.24);let h=w*ar;return {w,h,x:0,y:minY+h*.42}}
// Recolour a part's lights to the ship colour (metal untouched); parts behind the hull get a touch of shade.
const partTintCache={};
function partCanvas(id,col,mode,back){let im=partImg(id);if(!im||!im.complete||!im.naturalWidth)return null;let d0=shipParts.find(x=>x.id===id),neon=mode==='match'?col:String(mode).startsWith('accent:')?String(mode).slice(7):(partRarity[d0?.r||0]||partRarity[0]).c,key=id+'|'+neon+'|'+(back?1:0);if(partTintCache[key])return partTintCache[key];if(typeof document==='undefined')return im;
 // Neon conversion: metal -> the hull's navy panel palette, lights -> the neon colour, a thick glowing neon outline
 // round the silhouette and faint neon seams on the panel lines, so parts match the ships' flat neon style.
 try{let c=document.createElement('canvas'),W=im.naturalWidth,H=im.naturalHeight;c.width=W;c.height=H;let g=c.getContext('2d');g.drawImage(im,0,0);let D=g.getImageData(0,0,W,H),px=D.data,N=hexToHsl(neon)||{h:170,s:90,l:65},nh=N.h/360,ns=Math.max(.55,N.s/100);
  let hsl2rgb=(h,s2,l)=>{let q=l<.5?l*(1+s2):l+s2-l*s2,p2=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p2+(q-p2)*6*t:t<.5?q:t<2/3?p2+(q-p2)*(2/3-t)*6:p2};return [f(h+1/3),f(h),f(h-1/3)]};
  let nc=hsl2rgb(nh,ns,Math.max(.55,Math.min(.72,N.l/100))),lum=new Float32Array(W*H),dist=new Float32Array(W*H);
  for(let i=0,j=0;j<W*H;i+=4,j++){lum[j]=(px[i]*.3+px[i+1]*.59+px[i+2]*.11)/255;dist[j]=px[i+3]>110?1e4:0}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let j=y*W+x;if(!dist[j])continue;let m=dist[j];if(x>0)m=Math.min(m,dist[j-1]+1);if(y>0)m=Math.min(m,dist[j-W]+1);if(x>0&&y>0)m=Math.min(m,dist[j-W-1]+1.41);if(x<W-1&&y>0)m=Math.min(m,dist[j-W+1]+1.41);dist[j]=m}
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){let j=y*W+x;if(!dist[j])continue;let m=dist[j];if(x<W-1)m=Math.min(m,dist[j+1]+1);if(y<H-1)m=Math.min(m,dist[j+W]+1);if(x<W-1&&y<H-1)m=Math.min(m,dist[j+W+1]+1.41);if(x>0&&y<H-1)m=Math.min(m,dist[j+W-1]+1.41);dist[j]=m}
  let edge=Math.max(3,Math.round(Math.max(W,H)/44)),dark=[12,24,40],mid=[32,51,70],lite=[61,92,116],shade=back?.84:1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let j=y*W+x,i=j*4;if(!px[i+3])continue;let r=px[i]/255,gg=px[i+1]/255,b=px[i+2]/255,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),l=(mx+mn)/2,sat=mx===mn?0:(mx-mn)/(1-Math.abs(2*l-1)),out;
   if(dist[j]>0&&dist[j]<=edge){let k=dist[j]<=edge*.45?.35:0;out=[nc[0]+(1-nc[0])*k,nc[1]+(1-nc[1])*k,nc[2]+(1-nc[2])*k].map(v=>v*255);px[i+3]=Math.max(px[i+3],230)}
   else if(sat>.3&&mx>.38){let L=Math.min(.82,.45+l*.5);out=hsl2rgb(nh,ns,L).map(v=>v*255)}
   else{let L=lum[j],t2=Math.min(1,L/.75),base=t2<.45?dark.map((v,k)=>v+(mid[k]-v)*t2/.45):mid.map((v,k)=>v+(lite[k]-v)*(t2-.45)/.55);
    let gx=x>0&&x<W-1?lum[j+1]-lum[j-1]:0,gy=y>0&&y<H-1?lum[j+W]-lum[j-W]:0,gm=Math.hypot(gx,gy);if(gm>.22){let a2=Math.min(.55,(gm-.22)*1.6);base=base.map((v,k)=>v+(nc[k]*255-v)*a2)}out=base}
   px[i]=out[0]*shade;px[i+1]=out[1]*shade;px[i+2]=out[2]*shade}
  g.putImageData(D,0,0);return partTintCache[key]=c}catch(e){return im}}
function partTintMode(pilot){return pilot.partTint==='accent'&&pilot.accent?'accent:'+pilot.accent:pilot.partTint||'match'}
function drawShipParts(g,pilot,layer){let P=pilot&&pilot.parts;if(!P||typeof g.drawImage!=='function')return;if(layer==='front'){if(P.plating){g.save();g.rotate(Math.PI/2);try{drawHullPlating(g,pilot,hullShapeOf(pilot),pilot.color)}catch(e){}g.restore()}return}let slots=layer==='back'?['wings','engine']:layer==='nose'?['mount']:[];if(!slots.length)return;g.save();g.rotate(Math.PI/2);g.shadowBlur=0;
 for(let slot of slots){let id=P[slot];if(!id)continue;let d=shipParts.find(x=>x.id===id);if(!d||d.r<1)continue;let cv=partCanvas(id,pilot.color,partTintMode(pilot),layer==='back');if(!cv)continue;let f=partFit(pilot,slot,id);
  try{g.shadowColor=pilot.color;g.shadowBlur=graphicsShadow(8);g.drawImage(cv,f.x-f.w/2,f.y-f.h/2,f.w,f.h)}catch(e){}}
 g.restore()}
// Plating is drawn INSIDE the hull outline (called from drawIdentityHull), with the neon edge redrawn over it.
function drawHullPlating(g,pilot,shape,c){let F=fuselage(pilot);if(F)shape=F.poly;let id=pilot.parts&&pilot.parts.plating,d=id&&shipParts.find(x=>x.id===id);if(!d||d.r<1||typeof g.drawImage!=='function'||typeof g.clip!=='function')return;let cv=partCanvas(id,c,partTintMode(pilot),false);if(!cv)return;let f=partFit(pilot,'plating',id);
 g.save();g.beginPath();shape.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.clip();g.shadowBlur=0;g.globalAlpha=.95;try{g.drawImage(cv,f.x-f.w/2,f.y-f.h/2,f.w,f.h)}catch(e){}g.restore();
 g.save();g.strokeStyle=c;g.lineWidth=1.7;g.shadowColor=c;g.shadowBlur=graphicsShadow(8);g.beginPath();shape.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.stroke();g.restore()}
// Animated flames from an equipped engine part's nozzles (heading frame: x forward).
function drawPartFlames(g,pilot,t,thrust,boost){let d=partOn(pilot,'engine');if(!d)return false;let E=engineGeo(pilot,d.id),acc=partAccent(pilot,d),pulse=.5+.5*Math.sin(t*17);
 if(!reducedMotion)for(let nz of E.nozzles){let len=((boost?26:5+thrust*12)+pulse*4)*nz.len,hx=-nz.y,hy=nz.x,w=nz.w;g.save();g.globalAlpha=.38;g.fillStyle=acc;g.beginPath();g.moveTo(hx,hy-w);g.lineTo(hx-len,hy);g.lineTo(hx,hy+w);g.closePath();g.fill();g.globalAlpha=.85;g.fillStyle='#e8fbff';g.beginPath();g.moveTo(hx,hy-w*.45);g.lineTo(hx-len*.6,hy);g.lineTo(hx,hy+w*.45);g.closePath();g.fill();if(nz.ring){g.globalAlpha=.6;g.strokeStyle=acc;g.lineWidth=.7;for(let r of [.35,.65]){g.beginPath();g.ellipse(hx-len*r,hy,1.2,w*1.4,0,0,TAU);g.stroke()}}g.restore()}return true}