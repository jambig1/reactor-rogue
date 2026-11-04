const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').resolve(process.argv[2]||require('path').join(__dirname,'index.html'));let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);






const fresh=()=>run("state='menu';start();s.enemies=[];s.debris=[];s.pilot={...s.pilot,starter:'test'};s.p.hp=50;s.items={};s.spec={};s.cd={};s.arsenal=null;s.formations.next=9999");

// Reproduce the orbital-distance band which previously returned NaN for stationary relays.
fresh();run("s.p.x=0;s.p.y=0;let owner={x:170,y:0,tier:1,c:'#fff',hp:10000,boss:true,sectorBoss:'storm'};s.enemies=[owner];spawnBossRelays(owner)");
assert.equal(run('s.enemies.filter(e=>e.stationary).length'),2);assert.equal(run('enemyArmour(owner)'),.4);
assert(run("s.enemies.filter(e=>e.stationary).every(e=>Number.isFinite(specialistHeading(e,Math.atan2(-e.y,-e.x))))"));
run("var relays=s.enemies.filter(e=>e.stationary),orig=relays.map(e=>({x:e.x,y:e.y}));for(let i=0;i<600;i++)for(let e of relays){let a=specialistHeading(e,Math.atan2(s.p.y-e.y,s.p.x-e.x));e.x+=Math.cos(a)*e.v/60;e.y+=Math.sin(a)*e.v/60;specialistAttack(e,1/60)}");
assert(run('relays.every((e,i)=>Number.isFinite(e.x)&&Number.isFinite(e.y)&&e.x===orig[i].x&&e.y===orig[i].y)'));
assert(run('s.hostile.length>0'));
run("relays.forEach(e=>hit(e,100000,'bolt'))");assert(run('relays.every(e=>e.hp<=0&&e.dead)'));assert.equal(run('enemyArmour(owner)'),.2);
// Moving rail specialists keep their orbiting behaviour.
assert(run("Number.isFinite(specialistHeading({x:310,y:0,role:'rail',orbit:1},Math.PI))"));
// Binary Supercluster must retain the inner edge of Binary Wisps at level five,
// including the Wide specialisation, while extending its outer edge.
for(let wide of [false,true]){
 fresh();run("s.items={twinWisps:5};s.spec="+(wide?"{twinWisps:'wide'}":"{}")+";s.equipment={marks:[],rings:[],locks:[],tracers:[],comets:[],curtains:[],wisps:[]};attackEquipment(0)");
 let base=run('s.equipment.wisps.map(w=>({orbit:Math.hypot(w.x-s.p.x,w.y-s.p.y),r:w.r}))');
 run("s.equipment={marks:[],rings:[],locks:[],tracers:[],comets:[],curtains:[],wisps:[]};s.cd={};s.evolved.twinWisps=true;attackEquipment(0)");
 let evo=run('s.equipment.wisps.map(w=>({orbit:Math.hypot(w.x-s.p.x,w.y-s.p.y),r:w.r}))');
 assert.equal(evo.length,3);assert(evo.every(w=>w.orbit-w.r<=base[0].orbit-base[0].r+1e-8));assert(evo.every(w=>w.orbit+w.r>base[0].orbit+base[0].r));
}
// Orbital Reaping retains all three original forward lanes plus three rear lanes.
for(let wide of [false,true]){
 fresh();run("s.items={cometAxe:5};s.spec="+(wide?"{cometAxe:'wide'}":"{}")+";s.face=.72;s.equipment={marks:[],rings:[],locks:[],tracers:[],comets:[],curtains:[],wisps:[]};attackEquipment(0)");
 let base=run('s.equipment.comets.map(c=>({vx:c.vx,vy:c.vy,damage:c.damage}))');
 run("s.equipment={marks:[],rings:[],locks:[],tracers:[],comets:[],curtains:[],wisps:[]};s.cd={};s.evolved.cometAxe=true;attackEquipment(0)");
 let evo=run('s.equipment.comets.map(c=>({vx:c.vx,vy:c.vy,damage:c.damage}))');
 assert.equal(evo.length,6);for(let b of base)assert(evo.some(e=>Math.abs(e.vx-b.vx)<1e-8&&Math.abs(e.vy-b.vy)<1e-8&&e.damage===b.damage));
}
console.log('PASS v0.48 balance: stationary relays, targetable destruction, moving rail orbit, inner coverage and retained forward lanes');
