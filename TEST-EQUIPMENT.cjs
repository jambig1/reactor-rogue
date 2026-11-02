const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);



function fresh(id='vanguard'){run(`state='menu';hangar.ships=pilots.map(p=>p.id);selectedPilot='${id}';start();s.debris=[];s.debrisClock=99999;s.need=Infinity;s.spawn=99999;s.elite=99999;s.enemies=[];s.items={[s.pilot.starter]:1}`)}

function setup(id,path='',evolved=false){fresh();run(`Math.random=()=>.99;s.items={'${id}':3};s.spec=${path?`{'${id}':'${path}'}`:'{}'};s.evolved=${evolved?`{'${id}':true}`:'{}'};s.p.hp=50;s.pilot.damage=1;s.t=100;s.nextBreach=999;s.specialClock=999;s.spawn=999;s.elite=999;s.need=Infinity;s.debris=[];spawn(0);target=s.enemies[0];target.x=100;target.y=0;target.hp=target.max=100000;target.v=0;target.armour=0`)}

assert.equal(run("defs.filter(d=>d.kind==='weapon').length"),48);
assert.equal(run("defs.filter(d=>d.kind==='support').length"),32);
for(let id of ['spire','echoRing','crossfire','rupture'])for(let evolved of [false,true])for(let path of run(`specialisations['${id}'].map(p=>p.id)`)){
 setup(id,path,evolved);run("s.p.inv=999;target.x=80;target.y=0;attack(0);for(let i=0;i<150;i++){s.t+=1/60;updateNewArsenal(1/60)}draw()");
 if(id==='crossfire')run('for(let i=0;i<120;i++){if(state!==\'play\')throw Error(state);update(1/60)}');
 assert(run(`weaponStat('${id}').damage>0`),id+' '+path+' '+evolved);
 assert(run(`previewDamage('${id}',3)>0`));
 assert.equal(run(`specialisations['${id}'].length`),2);
 fresh();let passive=run(`evolutions.find(e=>e.id==='${id}').passive`);run(`s.items={'${id}':5,'${passive}':1};s.rewards=1;openReward();claimReward(0)`);assert(run(`s.evolved['${id}']`));
}
// Timed area strikes remain fixed to their marker and do not hit moving targets elsewhere.
setup('spire');run('attack(0);target.x=900;updateNewArsenal(.6)');assert.equal(run("weaponStat('spire').damage"),0);
setup('spire');run('attack(0);updateNewArsenal(.6);updateNewArsenal(.4);updateNewArsenal(.4)');assert.equal(run("weaponStat('spire').hits"),3);assert.equal(run('s.equipment.marks.length'),0);
setup('spire','',true);run('attack(0);for(let i=0;i<100;i++)updateNewArsenal(.03)');assert.equal(run("weaponStat('spire').hits"),5);
// One hit per target per travelling ring, including a staggered evolved echo.
setup('echoRing');run('attack(0);for(let i=0;i<100;i++)updateNewArsenal(.01)');assert.equal(run("weaponStat('echoRing').hits"),1);
setup('echoRing','',true);run('attack(0);for(let i=0;i<140;i++)updateNewArsenal(.01)');assert.equal(run("weaponStat('echoRing').hits"),2);
setup('echoRing');run('s.items.repulse=1;attack(0);updateNewArsenal(.6)');assert(run('Math.hypot(target.kx,target.ky)>0'));
// Crossfire convergence / guidance / evolution / two materially different paths.
setup('crossfire');run('attack(0)');assert.equal(run('s.shots.length'),2);let pierce=run('s.shots[0].pierce');setup('crossfire');run('s.items.guidance=1;attack(0)');assert.equal(run('s.shots[0].pierce'),pierce+1);
setup('crossfire','fan',true);run('attack(0)');assert.equal(run('s.shots.length'),8);assert(Math.abs(run('s.shots[0].dmg')-run("previewDamage('crossfire',3)"))<1e-7);
// Toughest-hull targeting, delayed miss, armour penetration and retarget on destruction.
setup('rupture');run('spawn(0);var weak=s.enemies[1];weak.x=50;weak.y=0;weak.hp=weak.max=100;attack(0)');assert(run('s.equipment.locks[0].target===target'));run('updateNewArsenal(1)');assert(run("weaponStat('rupture').damage>0"));
setup('rupture');run('attack(0);target.x=900;updateNewArsenal(1)');assert.equal(run("weaponStat('rupture').damage"),0);
setup('rupture','',true);run('target.hp=1;spawn(0);var second=s.enemies[1];second.x=100;second.y=5;second.hp=second.max=.5;attack(0);updateNewArsenal(1);updateNewArsenal(.31)');assert.equal(run("weaponStat('rupture').kills"),2);
setup('rupture');run('target.armour=.5');let ordinary=run("enemyDamage(target,100,false,'rupture')"),piercing=run("enemyDamage(target,100,false,'piercing','rupture')");assert(piercing>ordinary);
setup('spire');run('s.items.frost=1;target.freeze=1');assert.equal(run("arsenalSynergy(target,'spire')"),1.3);
setup('rupture');run('s.items.gravity=1;s.fields=[{x:100,y:0,r:80}]');assert.equal(run("arsenalSynergy(target,'piercing','rupture')"),1.25);
// Support conditions, no equipment means no effect, repairs cap and shield delay composes with path.
fresh();run('s.items={maneuver:5};dash()');assert(Math.abs(run('s.mobilityTimers[0]')-run('mobility.vanguard.cd/1.25'))<1e-9);
fresh();run('s.items={repairAmp:5};s.p.hp=50;healPlayer(10)');assert.equal(run('s.p.hp'),64);run('healPlayer(100)');assert.equal(run('s.p.hp'),100);
fresh();run('s.items={shield:1,coupler:5};s.hitAgo=4.6;s.p.shield=0;s.p.inv=999;update(.01)');assert(run('s.p.shield>0'));fresh();run('s.items={shield:1};s.hitAgo=4.6;s.p.shield=0;s.p.inv=999;update(.01)');assert.equal(run('s.p.shield'),0);
setup('spire');run('s.items={baffles:3};target.x=30;hurtPlayer(20)');assert(run('target.slow>=1.9'));run('target.slow=0;s.p.inv=0;hurtPlayer(20)');assert.equal(run('target.slow'),0);run('updateNewArsenal(8.1);s.p.inv=0;hurtPlayer(20)');assert(run('target.slow>=1.9'));
setup('spire');run('s.items={predator:5,lastStand:5};s.p.hp=39;target.type=3');assert(Math.abs(run("equipmentDamage(target,'spire')")-1.56)<1e-9);assert.equal(run("equipmentDamage(target,'pickupPurge')"),1);assert.equal(run("equipmentDamage(target,'thorns')"),1);run('target.type=0;s.p.hp=40');assert.equal(run("equipmentDamage(target,'spire')"),1);
// Full slots, banishing, contextual hints, save clean-up and new run resets.
fresh();run("s.items={spire:1};");assert(run("upgradeSynergy('predator').includes('Tempest Cathedral')"));assert.equal(run("upgradeSynergy('spire')"),'');fresh();assert.equal(run("upgradeSynergy('predator')"),'');
fresh();run('s.items={bolt:1,rapid:1,chain:1,laser:1,nova:1,rocket:1,armour:1,hull:1,regen:1,shield:1,speed:1,clock:1}');assert(!run("pool().some(d=>equipmentWeaponIds.includes(d.id)||['maneuver','coupler','baffles','repairAmp','predator','lastStand'].includes(d.id))"));
fresh();run("s.banished=['spire','coupler']");assert(!run("pool().some(d=>d.id==='spire'||d.id==='coupler')"));
// Simulated crowded combat: no extra spawns, budgets, finite state and balanced draw stack.
fresh();run("s.items={spire:5,echoRing:5,crossfire:5,rupture:5,shield:5,coupler:5,baffles:5,repairAmp:5,predator:5,lastStand:5};for(let id of equipmentWeaponIds){s.evolved[id]=true;s.spec[id]=specialisations[id][0].id}s.spec.shield='capacity';s.p.inv=999;while(s.enemies.length<240)spawn(0);for(let i=0;i<600;i++){update(1/60);if(state!=='play')throw Error(state);if(i%30===0)draw()}draw()");
assert(run('s.equipment.marks.length<=8&&s.equipment.rings.length<=8&&s.equipment.locks.length<=4&&s.shots.length<=250'));assert(run('s.enemies.every(e=>Number.isFinite(e.hp)&&Number.isFinite(e.x))'));assert.equal(depth,0);fresh();assert.equal(run('s.equipment.marks.length+s.equipment.rings.length+s.equipment.locks.length+s.equipment.baffleCD'),0);
console.log('PASS 4 weapons/evolutions, 8 paths, 6 supports, conditional synergies, delayed misses, one-hit rings, convergence, armour/attribution, cooldowns/healing/shield, slots/hints/reset and 240-enemy simulation');
// Survivor-inspired space coverage: every added weapon, evolution and branch deals attributed damage.
for(let id of ['ionGuard','plasmaRain','prismTrace','cometAxe','ionCurtain','corona','plasmaWhip','twinWisps'])for(let evolved of [false,true])for(let path of run(`specialisations['${id}'].map(p=>p.id)`)){
 setup(id,path,evolved);run("target.x=70;target.y=0;if('"+id+"'==='ionCurtain'){target.x=0;target.y=100}if('"+id+"'==='prismTrace'){target.x=80;target.y=55}attack(0)");
 if(id==='ionGuard')run('target.x=s.equipment.guards[0].r;target.y=0');
 if(id==='twinWisps')run('target.x=s.equipment.wisps[0].x;target.y=s.equipment.wisps[0].y');
 run('for(let i=0;i<120;i++){s.t+=.02;updateNewArsenal(.02)}draw()');assert(run(`weaponStat('${id}').damage>0`),id+' '+path+' '+evolved);
 fresh();let passive=run(`evolutions.find(e=>e.id==='${id}').passive`);run(`s.items={'${id}':5,'${passive}':1};s.rewards=1;openReward();claimReward(0)`);assert(run(`s.evolved['${id}']`));
}
setup('plasmaRain','long',true);run('attack(0);var poolBefore={...s.equipment.pools[0]};updateNewArsenal(1)');assert(run('s.equipment.pools[0].x<poolBefore.x'));assert.equal(run('s.equipment.pools[0].life'),5);
setup('prismTrace','',true);run('s.items.shield=1;s.p.shield=0;attack(0);var tracer=s.equipment.tracers[0];tracer.x=tracer.ox+tracer.box-1;tracer.vx=200;tracer.vy=0;target.x=tracer.x;target.y=tracer.y;updateNewArsenal(.02)');assert.equal(run('tracer.bounces'),1);assert(run('tracer.vx<0'));assert(run('s.p.shield>=1'));assert(run("weaponStat('prismTrace').damage>0"));
setup('ionGuard','',true);run('s.items.shield=1;attack(0);var guard=s.equipment.guards[0];s.hostile=[{x:guard.r,y:0,r:5,life:1}];updateNewArsenal(.001)');assert.equal(run('guard.blocks'),5);assert.equal(run('s.hostile[0].life'),0);
setup('corona','',true);run('s.p.hp=50;target.x=20;target.hp=1;attack(0)');assert.equal(run('s.p.hp'),51);run('spawn(0);var other=s.enemies.at(-1);other.x=20;other.y=0;other.hp=1;s.cd.corona=0;attack(0)');assert.equal(run('s.p.hp'),51);
setup('twinWisps');run('s.items.spire=1;attack(0)');assert.equal(run('s.equipment.wisps.length'),3);
setup('cometAxe');run('s.items.frost=1;target.freeze=1');assert.equal(run("arsenalSynergy(target,'cometAxe')"),1.3);
setup('ionCurtain');run('s.items.stasisNet=1;target.slow=1');assert.equal(run("arsenalSynergy(target,'ionCurtain')"),1.25);
setup('plasmaWhip');run('s.items.thorns=1;target.x=40');assert.equal(run("arsenalSynergy(target,'plasmaWhip')"),1.25);
setup('plasmaRain');run('s.items.gravity=1;s.fields=[{x:100,y:0,r:80}]');assert.equal(run("arsenalSynergy(target,'plasmaRain')"),1.25);
// Six of the new weapons in a legal six-slot crowded loadout, both normal and evolved.
for(let evolved of [false,true]){fresh();run(`s.items={ionGuard:5,plasmaRain:5,prismTrace:5,cometAxe:5,ionCurtain:5,corona:5,coupler:5,baffles:5,repairAmp:5,predator:5,lastStand:5,shield:5};for(let id of Object.keys(s.items))if(specialisations[id])s.spec[id]=specialisations[id][0].id;if(${evolved})for(let id of equipmentWeaponIds)s.evolved[id]=true;s.p.inv=999;while(s.enemies.length<240)spawn(0);for(let i=0;i<600;i++){update(1/60);if(state!=='play')throw Error(state);if(i%30===0)draw()}`);assert(run('s.equipment.guards.length<=2&&s.equipment.pools.length<=12&&s.equipment.tracers.length<=24&&s.equipment.comets.length<=30&&s.equipment.wisps.length<=12'));assert.equal(depth,0);}
fresh();assert(run('s.equipment.guards.length+s.equipment.pools.length+s.equipment.tracers.length+s.equipment.comets.length+s.equipment.wisps.length===0'));
console.log('PASS all12 new weapons/evolutions, 24 paths, 6 support items, 12 synergies, timed/piercing/reflecting/orbit/aura/pool behaviour and legal crowded builds');

for(let id of run('equipmentWeaponIds')){let path=run(`equipmentSpecChoices['${id}'][0]`);assert.equal(run(`cleanRun({id:'test',pilot:'vanguard',specialisations:{'${id}':'${path}'}}).specialisations['${id}']`),path);assert(run(`equipmentSpecChoices['${id}'].every(p=>specialisations['${id}'].some(x=>x.id===p))`));}
assert(run('newSupports.every(w=>defs.find(d=>d.id===w[0]).rarity===w[4])'));

assert(html.includes('All '+run('evolutions.length')+' recipes'));
