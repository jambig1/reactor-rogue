const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Image:class{constructor(){this.complete=true;this.naturalWidth=1254}},Math:Object.create(Math),Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);



function fresh(id='vanguard'){run(`state='menu';hangar.ships=pilots.map(p=>p.id);selectedPilot='${id}';start();s.debris=[];s.debrisClock=99999;s.need=Infinity;s.spawn=99999;s.elite=99999;s.enemies=[];s.items={[s.pilot.starter]:1}`)}

function setup(id,path='',evolved=false){fresh();run(`Math.random=()=>.99;s.items={'${id}':3};s.spec=${path?`{'${id}':'${path}'}`:'{}'};s.evolved=${evolved?`{'${id}':true}`:'{}'};s.p.hp=50;s.pilot.damage=1;s.t=100;s.nextBreach=999;s.specialClock=999;s.spawn=999;s.elite=999;s.need=Infinity;s.debris=[];spawn(0);target=s.enemies[0];target.x=100;target.y=0;target.hp=target.max=100000;target.v=0;target.armour=0`)}



assert.equal(run('sectors.length'),5);
run("hangar.claimed=[]");assert(!run("sectorOpen('foundry')"));assert(!run("sectorOpen('cryo')"));run("hangar.claimed=['win']");assert(run("sectorOpen('foundry')&&sectorOpen('cryo')"));assert(!run("sectorOpen('invalid')"));
for(let id of ['foundry','cryo']){
 fresh();run(`s.sector='${id}';s.dev.test=true;s.sectorClock=0;updateExpansion(.1)`);assert.equal(run('s.sectorHazards.length'),1);assert.equal(run('s.sectorHazards[0].kind'),id==='foundry'?'vent':'fracture');assert(run('s.sectorHazards[0].warning>=1.5'));
 // Real oriented rectangle collision, including player-radius tolerance.
 run("s.sectorHazards=[];addFrontierHazard('vent',0,0,Math.PI/2)");assert(run('frontierHazardContains(s.sectorHazards[0],{x:0,y:80})'));assert(!run('frontierHazardContains(s.sectorHazards[0],{x:80,y:0})'));
 let hp=run('s.p.hp');run('s.p.x=0;s.p.y=0;updateExpansion(.1)');assert.equal(run('s.p.hp'),hp);run('s.sectorHazards[0].warning=0;s.p.inv=0;updateExpansion(.1)');assert(run('s.p.hp')<hp);
 // Ordinary hazard clock/lifetime and damage held during boss, boss-owned lanes continue.
 fresh();run(`s.sector='${id}';s.sectorClock=4;addFrontierHazard('vent',0,0);s.sectorHazards[0].warning=0;spawnBoss();s.p.inv=0`);hp=run('s.p.hp');run('updateExpansion(.5)');assert.equal(run('s.sectorClock'),4);assert.equal(run('s.sectorHazards[0].life'),1.2);assert.equal(run('s.p.hp'),hp);
 for(let tier=0;tier<3;tier++){
  fresh();run(`s.sector='${id}';s.dev.test=true;s.bossIndex=${tier};s.t=180;spawnBoss();target=s.enemies[0];target.arrival=0;target.fireCD=0`);assert.equal(run('target.sectorBoss'),id);assert.equal(run('target.routeIndex'),tier);run('bossAttack(target,.1)');assert.equal(run('target.charge'),1.5);run('bossAttack(target,1.6)');assert.equal(run('s.hostile.length'),5+tier*2);
  run('target.fireCD=0;bossAttack(target,.1)');assert.equal(run('target.frontierTargets.length'),2+tier);run('bossAttack(target,1.6)');assert.equal(run('s.sectorHazards.length'),2+tier);assert(run('s.sectorHazards.every(h=>h.warning===1.5&&h.bossOwner===target)'));
  let before=run('JSON.stringify(s,(k,v)=>k==="bossOwner"?undefined:v)'),random=c.Math.random;c.Math.random=()=>{throw Error('Rendering used gameplay RNG')};for(let quality of ['low','high','auto']){run(`graphics.preset='${quality}';refreshGraphicsVisual();draw()`);assert.equal(depth,0)}c.Math.random=random;assert.equal(run('JSON.stringify(s,(k,v)=>k==="bossOwner"?undefined:v)'),before);
  if(tier===2){run("s.bossKills=2;hit(target,1e9,'bolt')");assert(run('s.finalClearPending'));run('resolveFinalClear()');assert(run("state==='mutation'||state==='end'"))}
 }
 fresh();run(`s.sector='${id}';s.enemies=[];spawn(0);spawn(0);spawn(0)`);assert.equal(run('s.enemies.filter(e=>e.sectorHull===s.sector).length'),2);assert.equal(run('cleanRun({...snapshotRun("abandoned"),sector:s.sector}).sector'),id);
 run(`state='play'`);assert.equal(run('musicScene()'),id==='foundry'?'storm':'belt');
 run('s.sectorHazards=[];for(let i=0;i<100;i++)addFrontierHazard("vent",0,0)');assert.equal(run('s.sectorHazards.length'),24);
 // Hundreds of real updates with legal loadout and existing population cap.
 fresh();run(`s.sector='${id}';s.dev.test=true;s.dev.god=true;s.items={bolt:3,echoRing:2,corona:2,shield:2};s.need=Infinity;s.nextBreach=9999;s.t=240;s.spawn=999;for(let i=0;i<180;i++)spawn(0)`);for(let i=0;i<300;i++)run('update(.016)');assert(run('s.enemies.length<=240&&s.sectorHazards.length<=24'));assert(run('Number.isFinite(s.p.x+s.p.y+s.p.hp)'));
}
// Original trilogy is still three named sectors; new wins cannot substitute for one.
run('hangar.progress.sectorWinMask=3');assert.equal(run('contracts.find(c=>c.id==="sectorTrilogy").value(hangar)'),2);
console.log('PASS five sectors, unlocks, six bosses, warning timing/rectangle collision, boss hazard holds, route ending, save/record IDs, music mapping, mixed fleets, render purity and bounded crowded updates');
