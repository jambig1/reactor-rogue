const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);






const fresh=()=>run("state='menu';start();s.enemies=[];s.debris=[];s.pilot={...s.pilot,starter:'test'};s.p.hp=50;s.items={};s.spec={};s.cd={};s.arsenal=null;s.formations.next=9999");
fresh();assert.equal(run("defs.filter(d=>d.kind==='weapon').length"),48);assert(run("defs.filter(d=>d.kind==='weapon').every(d=>weaponRoles[d.id]?.role&&weaponRoles[d.id]?.tip)"));
// All base previews agree with newly balanced attack values.
assert.equal(run("newBase('rail',3)"),130);assert.equal(run("newBase('leech',1)"),34);assert.equal(run("newBase('sails',5)"),116);assert.equal(run("weaponBase('chain',3)"),66);
// Volley count changes match the real shots, including branch/evolution adjustments.
for(let id of ['bolt','rapid','scatter','arc','frost','rocket','seeker','prism','scrap','saw','nanite','phaseTorp','crescent','rail','leech','sails','chain','voidSeed','mortar'])for(let l of [1,3,5]){fresh();run('s.items['+JSON.stringify(id)+']='+l);assert(run('weaponVolleyCount('+JSON.stringify(id)+','+l+')>0'))}
fresh();run("s.items={bolt:5};s.enemies=[{x:150,y:0,hp:10000,max:10000,r:15,type:0,armour:0,freeze:0}];attack(0)");assert.equal(run('s.shots.length'),3);assert(run('s.shots.every(b=>Math.abs(Math.atan2(b.vy,b.vx))<=.076)'));assert.equal(run("weaponVolleyCount('bolt',5)"),3);run("s.spec.bolt='fan'");assert.equal(run("weaponVolleyCount('bolt',5)"),5);
// Radial discs retain a guaranteed lead spoke towards a non-forward target.
fresh();run("s.t=1.37;s.items={arc:1};s.enemies=[{x:0,y:150,hp:10000,max:10000,r:15,type:0}];attack(0)");assert.equal(run('s.shots.length'),3);assert(run('Math.abs(Math.atan2(s.shots[0].vy,s.shots[0].vx)-Math.PI/2)<1e-8'));
// Evolved crescents preserve direct-target coverage instead of spreading two shots off target.
fresh();run("s.items={crescent:5};s.evolved.crescent=true;s.enemies=[{x:150,y:0,hp:10000,max:10000,r:15,type:0}];attack(0)");assert.equal(run('s.shots.length'),3);assert(run('s.shots.every(b=>Math.abs(Math.atan2(b.vy,b.vx))<=.131)'));
// Armour niche is 30% penetration normally, stronger Needle branch remains 60%.
fresh();run("s.enemies=[{hp:1000,max:1000,type:0,armour:.5}]");assert.equal(run("enemyDamage(s.enemies[0],100,false,'rail','rail')"),65);assert.equal(run("enemyDamage(s.enemies[0],100,false,'piercing','rail')"),80);assert.equal(run("enemyDamage(s.enemies[0],100,false,'laser','laser')"),50);
// Overlapping wakes share a target cooldown without preventing damage on different ships.
fresh();run("s.t=1;s.enemies=[{x:0,y:0,hp:10000,max:10000,type:0,r:10},{x:5,y:0,hp:10000,max:10000,type:0,r:10}];newArsenalState();for(let i=0;i<20;i++)s.arsenal.wakes.push({x:0,y:0,r:30,life:2,tick:0,l:5,evolved:false});updateExtraArsenal(.01)");assert.equal(run("weaponStat('ember').hits"),2);run('s.t+=.05;for(let w of s.arsenal.wakes)w.tick=0;updateExtraArsenal(.01)');assert.equal(run("weaponStat('ember').hits"),2);run('s.t+=.15;for(let w of s.arsenal.wakes)w.tick=0;updateExtraArsenal(.01)');assert.equal(run("weaponStat('ember').hits"),4);
// Rifts permit two hits per target per 0.4s window, not one hit per overlapping field.
fresh();run("s.t=.8;s.enemies=[{x:0,y:0,hp:10000,max:10000,type:0,r:10}];newArsenalState();for(let i=0;i<12;i++)s.arsenal.rifts.push({x:0,y:0,r:50,life:2,tick:0,damage:10});updateExtraArsenal(.01)");assert.equal(run("weaponStat('phaseTorp').hits"),2);run('s.t=1.21;for(let f of s.arsenal.rifts)f.tick=0;updateExtraArsenal(.01)');assert.equal(run("weaponStat('phaseTorp').hits"),4);
// Prediction is bounded, follows ordinary formations and leaves frozen/stationary targets alone.
fresh();assert.equal(run('mortarAim({x:200,y:0,v:100},.85).x'),130);assert.equal(run('mortarAim({x:200,y:0,v:100,freeze:1},.85).x'),200);assert.equal(run('mortarAim({x:200,y:0,v:100,stationary:true},.85).x'),200);assert.equal(run('mortarAim({x:200,y:0,v:100,formation:{dx:0,dy:1}},.85).y'),70);
// Roles and exact upgrade milestones appear without revealing unrelated recipes or changing state.
fresh();run("s.items={bolt:1};choices=[defs.find(d=>d.id==='bolt')];renderUpgradeChoices()");assert(run("$('choices').innerHTML.includes('GENERALIST')"));assert(run("$('choices').innerHTML.includes('1 → 2 shots / volley')"));assert(run("weaponReport().includes('Reliable forward volleys')"));let snapshot=run('JSON.stringify(s)');run("weaponReport();upgradeComparison(defs.find(d=>d.id==='bolt'))");assert.equal(run('JSON.stringify(s)'),snapshot);
console.log('PASS 48 weapon identities, tuned base values, focused volleys, aimed radial lead, armour niches, bounded overlapping damage, mortar prediction and accurate UI milestones/state isolation');
