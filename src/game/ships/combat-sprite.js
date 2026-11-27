
// In-game ship drawn from the hangar's Blender models (see art/blender/bake-combat.mjs, data in combat-hulls-v1300.js):
// neon 2D, assembled from the hull core + the stock or fitted wings/engine/gun/plating, cached per look
// (the gun stays fixed like in the hangar; aim is shown by the existing aim chevron).
const bakedHullCache=new Map(),bakedStock={engine:'e_stock',wings:'w_stock',mount:'m_stock',plating:'p_stock'};
// Rendered sprites of each piece (art/combat, made by bake-combat-sprites.cjs). Loaded on demand; until a piece's
// sprite is ready the traced vector version is drawn instead.
const bakedSprites=new Map();
function bakedSprite(p){if(!p||!p.img||typeof Image==='undefined')return null;let e=bakedSprites.get(p.img.src);if(!e){e={im:new Image(),ok:false};e.im.onload=()=>{e.ok=true;bakedHullCache.clear()};e.im.src=p.img.src;bakedSprites.set(p.img.src,e)}return e.ok?e.im:null}
function preloadBakedShip(pilot){try{let B=hullBake(pilot.id);if(!B)return;for(let p of [B.core,bakedPiece(B,pilot,'wings'),bakedPiece(B,pilot,'engine'),bakedPiece(B,pilot,'mount'),bakedPiece(B,pilot,'plating')])bakedSprite(p)}catch(e){}}
function hullBake(id){return (typeof bakedHulls!=='undefined'&&bakedHulls&&bakedHulls[id])||null}
function bakedPiece(B,pilot,slot){let id=(pilot.parts||{})[slot];if(id&&id!==bakedStock[slot]&&B.fit[id])return B.fit[id];return slot==='plating'?null:B.stock[slot]||null}
function bakedOutlets(pilot){let B=hullBake(pilot.id);if(!B)return [];let e=(pilot.parts||{}).engine,f=e&&e!==bakedStock.engine&&B.fit[e];return f&&f.outlets&&f.outlets.length?f.outlets:B.outlets}
function bakedImage(pilot,pieces,key){let hit=bakedHullCache.get(key);if(hit)return hit;if(typeof document==='undefined'||!document.createElement||!pieces.length)return null;
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let p of pieces)for(let l of p.body)for(let [x,y] of l){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
 let S=4,P=4,cv=document.createElement('canvas');cv.width=Math.ceil((x1-x0+P*2)*S);cv.height=Math.ceil((y1-y0+P*2)*S);let g=cv.getContext('2d');if(!g||!g.setTransform)return null;
 g.setTransform(S,0,0,S,(P-x0)*S,(P-y0)*S);let c=pilot.color||'#65f7ef',glow=pilot.glow??1,nc=p=>p.__core||pilot.partTint!=='accent'||!pilot.accent?c:pilot.accent;   // fitted parts take the accent colour when chosen
 let path=loops=>{g.beginPath();for(let l of loops){g.moveTo(l[0][0],l[0][1]);for(let i=1;i<l.length;i++)g.lineTo(l[i][0],l[i][1]);g.closePath()}};
 let fill=(loops,style,alpha=1)=>{if(!loops||!loops.length)return;g.globalAlpha=alpha;g.fillStyle=style;path(loops);g.fill('evenodd');g.globalAlpha=1};
 // 1) one neon glow and outline around the whole silhouette (inner seams get covered by the fills below)
 g.save();g.shadowColor=c;g.shadowBlur=2.4*S*glow;for(let p of pieces)fill(p.body,'#0a1420');g.restore();
 g.lineWidth=1.1;g.lineJoin='round';for(let p of pieces){g.strokeStyle=nc(p);path(p.body);g.stroke()}
 // 2) each piece in order: base, shading, paint, markings, canopy, lights, and a faint seam
 for(let p of pieces){let sp=bakedSprite(p);
  if(sp){let [bx0,by0,bx1,by1]=p.img.box,bw=bx1-bx0,bh=by1-by0;g.drawImage(sp,bx0,by0,bw,bh);
   // the original neon look: dark navy-steel body (keeping the rendered shading), colour only as neon lines
   g.save();path(p.body);g.clip('evenodd');for(let [op,col,al] of finishBody(pilot.finish,c)){g.globalCompositeOperation=op;g.globalAlpha=al;if(col==='sheen'){let sh=g.createLinearGradient(bx0,by0,bx1,by1);sh.addColorStop(0,'#ffffff00');sh.addColorStop(.45,'#ffffff');sh.addColorStop(.55,'#ffffff00');g.fillStyle=sh}else g.fillStyle=col;g.fillRect(bx0,by0,bw,bh)}g.restore();
   if(p.canopy){let gr=g.createLinearGradient(0,by0,0,by1);gr.addColorStop(0,'#eafcff');gr.addColorStop(.3,'#7fe6ff');gr.addColorStop(1,'#1a5a78');g.save();g.shadowColor='#9ff0ff';g.shadowBlur=1.6*S;fill(p.canopy,gr);g.restore();
    g.save();path(p.canopy);g.clip('evenodd');g.fillStyle='#ffffffb0';g.beginPath();for(let l of p.canopy){let cx=0,cy=0;for(let [x,y] of l){cx+=x;cy+=y}cx/=l.length;cy/=l.length;g.ellipse(cx-.6,cy-1.6,.7,1.6,0,0,TAU)}g.fill();g.restore();
    g.save();g.strokeStyle=c;g.lineWidth=.55;g.shadowColor=c;g.shadowBlur=.8*S;path(p.canopy);g.stroke();g.restore()}
   // A-style inner neon: spine circuitry, armour edges, markings and lights in the player's colour
   g.save();g.lineJoin='round';g.shadowColor=c;
   if(p.ridge){g.globalAlpha=.55;g.strokeStyle=c;g.lineWidth=.35;g.shadowBlur=.6*S;path(p.ridge);g.stroke()}
   if(p.dark){g.globalAlpha=.45;g.strokeStyle=c;g.lineWidth=.3;g.shadowBlur=.4*S;path(p.dark);g.stroke()}
   if(p.mark){g.globalAlpha=.9;g.shadowBlur=.8*S;fill(p.mark,c,.75)}
   g.restore();
   if(p.paint){g.save();fill(p.paint,c,.08);g.globalAlpha=.9;g.strokeStyle=c;g.lineWidth=.5;g.lineJoin='round';g.shadowColor=c;g.shadowBlur=.5*S;path(p.paint);g.stroke();g.restore()}
   if(p.paint&&pilot.pattern&&pilot.pattern!=='none')try{g.save();path(p.paint);g.clip('evenodd');g.globalAlpha=.12;drawHullPattern(g,[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],pilot.pattern,pilot.patternColor||c);g.restore()}catch(e){}
   if(p.glow){g.save();g.shadowColor=c;g.shadowBlur=2*S;fill(p.glow,c,1);fill(p.glow,'#ffffff',.35);g.restore()}
   if(p.outlets)for(let [ox,oy,orr] of p.outlets){g.save();g.shadowColor=c;g.shadowBlur=1.6*S;g.fillStyle=c;g.beginPath();g.arc(ox,oy,Math.max(.8,orr*.6),0,TAU);g.fill();g.fillStyle='#ffffffcc';g.beginPath();g.arc(ox,oy,Math.max(.4,orr*.28),0,TAU);g.fill();g.restore()}
   if(p!==pieces[0]){g.strokeStyle='#02060c';g.globalAlpha=.5;g.lineWidth=.3;path(p.body);g.stroke();g.globalAlpha=1}
   continue}
  fill(p.body,'#18222e');if(p.ridge)fill(p.ridge,'#2a3a4c');
  g.save();path(p.body);g.clip('evenodd');
  // soft lighting across the ship: a lit spine and darker flanks
  let lg=g.createLinearGradient(x0,0,x1,0);lg.addColorStop(0,'#00000066');lg.addColorStop(.42,'#ffffff10');lg.addColorStop(.5,'#ffffff1c');lg.addColorStop(.58,'#ffffff10');lg.addColorStop(1,'#00000066');fill(p.body,lg);
  fill(p.dark,'#080e16',.92);fill(p.paint,c,.34);fill(p.paint,'#0b1622',.3);
  // hull pattern only on the painted panels, kept subtle
  if(p.paint&&pilot.pattern&&pilot.pattern!=='none')try{g.save();path(p.paint);g.clip('evenodd');g.globalAlpha=.28;drawHullPattern(g,[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],pilot.pattern,pilot.patternColor||c);g.restore()}catch(e){}
  fill(p.mark,'#9fb6c9',.45);if(p.ridge){g.strokeStyle='#ffffff18';g.lineWidth=.35;path(p.ridge);g.stroke()}
  if(p.canopy){let gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'#bff4ff');gr.addColorStop(.35,'#2c7d99');gr.addColorStop(1,'#08202e');fill(p.canopy,gr);g.strokeStyle='#d8fbff66';g.lineWidth=.3;path(p.canopy);g.stroke()}
  g.restore();
  if(p.glow){g.save();g.shadowColor=c;g.shadowBlur=2*S;fill(p.glow,c);fill(p.glow,'#ffffff',.35);g.restore()}
  g.save();path(p.body);g.clip('evenodd');g.strokeStyle='#ffffff26';g.lineWidth=.9;path(p.body);g.stroke();g.restore();
  if(p!==pieces[0]){g.strokeStyle='#02060c';g.globalAlpha=.6;g.lineWidth=.35;path(p.body);g.stroke();g.globalAlpha=1}}
 // v1.7 cosmetics: a squadron marking on the core, clipped to the ship itself (the finish is applied to the body above).
 if(pilot.decal&&pilot.decal!=='none'){let core=pieces.find(p=>p.__core);if(core){let a=1e9,b=1e9,cc=-1e9,d=-1e9;for(let l of core.body)for(let [x,y] of l){a=Math.min(a,x);b=Math.min(b,y);cc=Math.max(cc,x);d=Math.max(d,y)}g.save();g.globalCompositeOperation='source-atop';g.translate((a+cc)/2,(b+d)/2);g.shadowColor='#000';g.shadowBlur=1.2*S;drawHullDecal(g,pilot.decal,pilot.accent||pilot.patternColor||c,Math.min(cc-a,d-b)*.3);g.restore()}}
 if(pieces.some(p=>bakedSprite(p))){g.save();g.shadowBlur=1.3*S*glow;g.globalAlpha=1;g.lineWidth=1.25;g.lineJoin='round';for(let p of pieces){g.shadowColor=g.strokeStyle=nc(p);path(p.body);g.stroke()}g.restore()}
 hit={cv,x:x0-P,y:y0-P,S};bakedHullCache.set(key,hit);if(bakedHullCache.size>48)bakedHullCache.delete(bakedHullCache.keys().next().value);return hit}
function bakedHullImage(pilot){let B=hullBake(pilot.id);if(!B||!B.core)return null;if(B.stock.engine&&!B.stock.engine.outlets)B.stock.engine.outlets=B.outlets;else if(!B.stock.engine&&!B.core.outlets)B.core.outlets=B.outlets;let pt=pilot.parts||{};B.core.__core=true;
 let pieces=[bakedPiece(B,pilot,'wings'),B.core,bakedPiece(B,pilot,'engine'),bakedPiece(B,pilot,'mount'),bakedPiece(B,pilot,'plating')].filter(Boolean);
 return bakedImage(pilot,pieces,['hull',pilot.id,pilot.color,pilot.pattern||'',pilot.patternColor||'',pilot.glow??1,pt.wings||'',pt.engine||'',pt.mount||'',pt.plating||'',pilot.partTint||'',pilot.accent||'',pilot.finish||'',pilot.decal||''].join('|'))}
function bakedMountImage(pilot){let B=hullBake(pilot.id);if(!B)return null;let m=bakedPiece(B,pilot,'mount');if(!m)return null;return bakedImage(pilot,[m],['mount',pilot.id,pilot.color,pilot.glow??1,(pilot.parts||{}).mount||''].join('|'))}
function stampBaked(ctx,im){ctx.save();ctx.rotate(Math.PI/2);ctx.drawImage(im.cv,im.x,im.y,im.cv.width/im.S,im.cv.height/im.S);ctx.restore()}
// Draws in pilot space (nose +x). Return true when drawn.
function drawBakedHull(ctx,pilot){let im=bakedHullImage(pilot);if(!im||!ctx.drawImage)return false;stampBaked(ctx,im);return true}
function drawBakedMount(ctx,pilot){let im=bakedMountImage(pilot);if(!im||!ctx.drawImage)return false;stampBaked(ctx,im);return true}

// v0.77 crash reports. Script errors are caught as they happen. Phones (iOS Safari especially) can also kill the page
// outright when memory runs out, with no error at all, so a small snapshot is saved every few seconds and the
// session is marked clean whenever the page is hidden or closed normally. An unclean session on the next load
// becomes a "closed unexpectedly" report.
const crashVersion='1.6.0',crashMon={frames:0,lastFrames:0,fps:0,errors:[],session:null,pending:null};
function crashStore(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||'null');localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function crashReports(){let r=crashStore('rr_crash_reports');return Array.isArray(r)?r:[]}
function addCrashReport(r){let list=crashReports();list.unshift(r);crashStore('rr_crash_reports',list.slice(0,6));return r}
function crashDevice(){let n=typeof navigator==='object'?navigator:{},w=typeof innerWidth==='number'?innerWidth:0,h=typeof innerHeight==='number'?innerHeight:0;return {ua:String(n.userAgent||'unknown').slice(0,220),screen:w+'×'+h+' @'+(typeof devicePixelRatio==='number'?devicePixelRatio:1)+'x',mem:n.deviceMemory||null,cores:n.hardwareConcurrency||null}}
function crashSnapshot(){let read=f=>{try{return f()}catch(e){return undefined}},g=read(()=>s)||null,c=a=>Array.isArray(a)?a.length:0,heap=null;try{let m=performance.memory;if(m)heap=Math.round(m.usedJSHeapSize/1048576)+' / '+Math.round(m.jsHeapSizeLimit/1048576)+' MB'}catch(e){}
 let snap={at:Date.now(),state:read(()=>state)||'loading',fps:crashMon.fps,heap};
 snap.graphics=(read(()=>graphics.preset)||'?')+(read(()=>graphicsCrowd.active)?' (crowded)':'');
 if(g)try{Object.assign(snap,{sector:g.sector,ship:g.pilot?.id,time:Math.round(g.t||0),level:g.lv,endless:!!g.endless,overdrive:Math.round((read(()=>overdriveLevel())||0)*10)/10,card:g.launchCard||null,enemies:c(g.enemies),swarm:Array.isArray(g.enemies)?g.enemies.filter(e=>e.swarm).length:0,shots:c(g.shots),hostile:c(g.hostile),fx:c(g.fx),particles:c(g.particles),drops:c(g.drops),gems:c(g.gems),debris:c(g.debris),hazards:c(g.hazards)})}catch(e){}
 return snap}
function crashBeat(){let id=crashMon.session;if(!id)return;crashStore('rr_crash_session',{id,v:crashVersion,clean:crashMon.clean===true,beat:Date.now(),snap:crashSnapshot(),errors:crashMon.errors.slice(-8)})}
function crashMarkClean(clean){crashMon.clean=clean;crashBeat()}
function crashRecordError(message,where){let text=String(message||'Unknown error').slice(0,300),key=text+'|'+where;if(crashMon.errors.some(e=>e.key===key))return;let entry={key,message:text,where:String(where||'').slice(0,160),at:Date.now()};crashMon.errors.push(entry);if(crashMon.errors.length>12)crashMon.errors.shift();
 let report=addCrashReport({kind:'error',v:crashVersion,at:Date.now(),device:crashDevice(),snap:crashSnapshot(),errors:[entry]});crashMon.pending=report;crashBeat();try{if(typeof showCrashBanner==='function')showCrashBanner(report)}catch(e){}}
(function crashStart(){try{let prev=crashStore('rr_crash_session');if(prev&&!prev.clean&&Date.now()-(prev.beat||0)<6*3600e3)crashMon.pending=addCrashReport({kind:'closed',v:prev.v||'?',at:prev.beat||Date.now(),device:crashDevice(),snap:prev.snap||{},errors:prev.errors||[]})}catch(e){}
 crashMon.session=Date.now().toString(36);crashMon.clean=false;crashBeat();
 if(typeof addEventListener==='function'){addEventListener('error',e=>crashRecordError(e.message||e.error?.message,(e.filename||'').split('/').pop()+':'+(e.lineno||0)+':'+(e.colno||0)+(e.error?.stack?' · '+String(e.error.stack).split('\n').slice(0,3).join(' | '):'')));addEventListener('unhandledrejection',e=>crashRecordError('Promise: '+(e.reason?.message||e.reason),String(e.reason?.stack||'').split('\n').slice(0,3).join(' | ')));
  addEventListener('pagehide',()=>crashMarkClean(true));addEventListener('pageshow',()=>crashMarkClean(false))}
 if(typeof document==='object'&&document.addEventListener)document.addEventListener('visibilitychange',()=>crashMarkClean(document.visibilityState==='hidden'));
 if(typeof setInterval==='function'){let iv=setInterval(()=>{crashMon.fps=Math.round((crashMon.frames-crashMon.lastFrames)/3);crashMon.lastFrames=crashMon.frames;if(!(typeof document==='object'&&document.visibilityState==='hidden'))crashBeat()},3000);if(iv&&iv.unref)iv.unref()}})();
function crashReportText(r){let d=r.device||{},n=r.snap||{},when=new Date(r.at||Date.now()),pad=x=>String(x).padStart(2,'0'),t=n.time!=null?Math.floor(n.time/60)+':'+pad(n.time%60):'?';
 return ['Reactor Rogue crash report','Version '+r.v+' · '+when.getFullYear()+'-'+pad(when.getMonth()+1)+'-'+pad(when.getDate())+' '+pad(when.getHours())+':'+pad(when.getMinutes()),
 'Type: '+(r.kind==='closed'?'game closed unexpectedly (often the phone running out of memory)':'script error'),
 'Device: '+(d.screen||'?')+(d.mem?' · '+d.mem+' GB':'')+(d.cores?' · '+d.cores+' cores':'')+' · '+(d.ua||'?'),
 'Screen: '+(n.state||'?')+(n.sector?' · sector '+n.sector:'')+(n.ship?' · ship '+n.ship:'')+(n.time!=null?' · run '+t:'')+(n.level?' · level '+n.level:'')+(n.endless?' · endless':'')+(n.overdrive?' · overdrive '+n.overdrive:'')+(n.card?' · card '+n.card:''),
 'Load: '+['enemies','swarm','shots','hostile','fx','particles','drops','gems','debris','hazards'].filter(k=>n[k]!=null).map(k=>k+' '+n[k]).join(' · ')+(n.fps!=null?' · fps '+n.fps:'')+(n.graphics?' · graphics '+n.graphics:'')+(n.heap?' · heap '+n.heap:''),
 ...(r.errors||[]).map(e=>'Error: '+e.message+(e.where?' @ '+e.where:''))].join('\n')}
if(typeof location!=='undefined'&&typeof location.pathname==='string'&&location.pathname.endsWith('/')&&!location.search&&!location.hash)location.replace('home.html');
const profileRawStorage=localStorage,profileReview=typeof location!=='undefined'&&typeof location.search==='string'&&location.search.includes('save-review=1');
const profileNativeStorage=profileReview?{getItem:k=>profileRawStorage.getItem('rr_save_review_'+k),setItem:(k,v)=>profileRawStorage.setItem('rr_save_review_'+k,v),removeItem:k=>profileRawStorage.removeItem('rr_save_review_'+k)}:profileRawStorage,profileProgressKeys=['rr_hangar','ns_archive','neonSwarm02','ns_pilot'];
let profilesAvailable=true,profileManifest={version:1,active:'default',profiles:[{id:'default',name:'Commander',created:0}]};
try{let m=JSON.parse(profileNativeStorage.getItem('rr_profiles_v1')||'null');if(m&&m.version===1&&Array.isArray(m.profiles)){let rows=m.profiles.filter(p=>p&&/^(default|p[0-9a-z-]{1,60})$/.test(p.id)&&typeof p.name==='string').slice(0,8).map(p=>({id:p.id,name:p.name.trim().slice(0,24)||'Commander',created:Number(p.created)||0}));rows=[{id:'default',name:rows.find(p=>p.id==='default')?.name||'Commander',created:0},...rows.filter((p,i,a)=>p.id!=='default'&&a.findIndex(q=>q.id===p.id)===i)].slice(0,8);profileManifest={version:1,active:rows.some(p=>p.id===m.active)?m.active:'default',profiles:rows}}}catch(e){profilesAvailable=false}
const sessionProfileId=profileManifest.active;
function profileKey(key,id=sessionProfileId){return profileProgressKeys.includes(key)&&id!=='default'?'rr_profile_'+id+'_'+key:key}
const profileStorage={getItem:key=>profileNativeStorage.getItem(profileKey(key)),setItem:(key,value)=>profileNativeStorage.setItem(profileKey(key),value)};

'use strict';
const $=id=>document.getElementById(id),canvas=$('game');let ctx=canvas.getContext('2d');
const TAU=Math.PI*2, rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const defs=[
['bolt','Neon Bolts','➤','weapon','#65f7ef','Auto-aimed bolts. +damage, extra shots and piercing.'],
['scatter','Scatterburst','⋰','weapon','#a6efae','Close-range shotgun cone. More pellets and damage per level.'],
['arc','Arc Discs','◉','weapon','#8abfff','Radial piercing discs with one aimed at the nearest target. More discs and damage per level.'],
['mines','Plasma Mines','⊗','weapon','#ff6a8e','Drops armed proximity mines behind your pilot. Larger explosions per level.'],
['gravity','Gravity Well','◍','weapon','#ffd56f','Creates a field that pulls enemies together and deals damage over time.'],
['singularity','Void Lance','✺','weapon','#ffb5fa','Rare piercing void bolts detonate on impact. Large damage and blasts.'],
['area','Size Matrix','⤢','support','#b2e8fe','Permanent passive: +12% weapon size, area and defensive coverage per level. Rare elite supply drop.'],
['velocity','Kinetic Drive','»','support','#9edcff','Permanent passive: +12% projectile/orbit speed and defensive recovery speed per level. Rare elite supply drop.'],
['reach','Targeting Array','⌖','support','#aebdff','+15% weapon reach per level.'],
['luck','Lucky Circuit','♧','support','#92f0ad','+20% Luck per level. Better rarity rolls, more salvage crates and rarer salvage supplies.'],
['thorns','Reactive Spikes','✹','support','#ff8eae','Taking a hit releases a 100-range burst: 12 damage per level.'],
['phase','Phase Safeguard','⬡','support','#d5b5ff','When hit below 30% HP, gain 1.5s invulnerability. Cooldown: 24 seconds, reduced by 3 per level.'],
['rapid','Needle Repeater','⋙','weapon','#77e8ff','Rapid light projectiles. +damage, extra needles and piercing. Wasp starter.'],
['cannon','Siege Cannon','⬟','weapon','#ffc387','Slow explosive shells fired straight ahead. +damage and blast radius. Bastion starter.'],
['rocket','Homing Missiles','⬈','weapon','#ffba79','Auto-seeking explosive missiles. +blast radius and damage.'],
['seeker','Seeker Drones','⋈','weapon','#f9a3ff','Twin homing energy drones. +count and damage.'],
['nova','Nova Reactor','☀','weapon','#ffe28c','Automatic radial shockwave. +radius and damage.'],
['hull','Reinforced Hull','⬢','support','#bdc9ec','Adds 20 maximum HP per level and heals 20 HP.'],
['intercept','Point Defence','⊕','support','#91caff','Automatically destroys a hostile projectile within 90 range. Cooldown falls with level.'],
['power','Power Amplifier','↯','support','#ffbb91','Adds 10% damage to every weapon per level.'],
['scholar','Data Harvester','◇','support','#b1a3ff','Adds 10% XP from collected gems per level.'],
['chain','Chain Lightning','ϟ','weapon','#c298ff','Leaps between targets. +damage and chain jumps.'],
['blade','Defence Satellites','✦','weapon','#ffb975','Satellites circle your ship and zap ships they touch. +satellite count, reach and damage.'],
['toxic','Toxic Cloud','☣','weapon','#8ce990','Lingering poison zones. +radius, duration and damage.'],
['frost','Frost Shards','❄','weapon','#8ddfff','Piercing shards slow foes. +shards, piercing and freeze chance.'],
['laser','Pulse Laser','⌁','weapon','#ff79c6','Piercing beam through the swarm. +width and damage.'],
['shield','Energy Shield','◈','support','#7cafff','Absorbs 20 damage per level. Recharges after 7 seconds without a hit.'],
['armour','Armour Plating','⬡','support','#b9c8de','Reduces contact damage by 2 per level (minimum 1 damage).'],
['regen','Regeneration','✚','support','#9de5a3','Restores 0.6 HP per second per level.'],
['repulse','Repulsion Field','◎','support','#f8d487','Every 5 seconds, pushes nearby foes away. +radius and force.'],
['clock','Overclock','»','support','#ffbd81','Reduces weapon firing cycle time by 9% per level.'],
['magnet','Magnet','∩','support','#c4a1ff','Increases pickup radius by 35 per level.'],
['crit','Critical Core','✧','support','#ff8baf','Adds 8% critical chance per level. Critical hits deal double damage.'],
['speed','Thrusters','↑','support','#7ee8f0','Adds 9% movement speed per level.']
].map(d=>({id:d[0],name:d[1],icon:d[2],kind:d[3],color:d[4],desc:d[5]}));
let weaponArtAtlas=null;if(typeof Image!=='undefined'){weaponArtAtlas=new Image();weaponArtAtlas.crossOrigin='anonymous';weaponArtAtlas.src='reactor-rogue-attack-atlas-v0540.webp'}
// Reactor Rogue attack art. Geometry/atlas renderers never change combat state or consume RNG.
const attackArtFamilies={bolt:'needle',rapid:'repeater',scatter:'pellet',arc:'disc',mines:'mine',gravity:'gravity',singularity:'void',cannon:'shell',rocket:'missile',seeker:'drone',nova:'pulse',chain:'lightning',blade:'blade',toxic:'corrosion',frost:'crystal',laser:'beam',harpoon:'tether',ember:'wake',prism:'satellite',scrap:'shrapnel',buoy:'pylon',saw:'saw',mortar:'bombardment',nanite:'swarm',phaseTorp:'torpedo',sonic:'pressure',rail:'rail',flak:'flak',crescent:'crescent',fence:'fence',leech:'siphon',cryoCharge:'cryoMine',ram:'ram',sails:'solar',voidSeed:'seed',stasisNet:'net',spire:'storm',echoRing:'echo',crossfire:'crossfire',rupture:'drill',ionGuard:'guardian',plasmaRain:'plasma',prismTrace:'tracer',cometAxe:'scythe',ionCurtain:'curtain',corona:'aura',plasmaWhip:'lash',twinWisps:'binary'};
const attackAtlasRegions={bolt:[120,286,394,81],missile:[762,240,355,177],scythe:[179,769,311,338],guardian:[803,822,275,236]};
let attackArt={tracks:new WeakMap,impacts:[],muzzles:[],sprites:0,fields:0,details:0,repair:0,repairWait:0,repairLife:0,shieldHits:[],shieldReform:0,shieldPrevious:0,reactions:new WeakMap,kick:0,kickAngle:0,kickWait:0,contactWait:0};
// Body colour treatment per finish for the combat sprite: blend steps [operation, colour, alpha] over the rendered
// shading. Factory keeps the original navy steel; Gloss/Satin paint the body in the hull colour (Gloss brighter, with a
// sheen); Matte goes flat near-black; Chrome goes bright silver with a sheen.
function finishBody(finish,c){let mix=(a,b,t)=>{let pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16),r=k=>Math.round(((pa>>k)&255)*(1-t)+((pb>>k)&255)*t);return '#'+[16,8,0].map(k=>r(k).toString(16).padStart(2,'0')).join('')},hex=/^#[0-9a-f]{6}$/i.test(c)?c:'#65f7ef';
 if(finish==='gloss')return [['color',hex,1],['screen',mix(hex,'#000000',.4),.8],['screen','sheen',.32]];
 if(finish==='satin')return [['color',hex,1],['screen',mix(hex,'#000000',.68),.55]];
 if(finish==='matte')return [['color','#2a3038',1],['multiply','#3c424a',1]];
 if(finish==='chrome')return [['color','#8f9aa6',1],['screen','#a9b4bf',.85],['screen','sheen',.45]];
 return [['color','#2a4660',1],['multiply','#3a5068',.9]]}
