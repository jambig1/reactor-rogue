const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Image:class{constructor(){this.complete=true;this.naturalWidth=1254}},Math:Object.create(Math),Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);



function fresh(id='vanguard'){run(`state='menu';hangar.ships=pilots.map(p=>p.id);selectedPilot='${id}';start();s.debris=[];s.debrisClock=99999;s.need=Infinity;s.spawn=99999;s.elite=99999;s.enemies=[];s.items={[s.pilot.starter]:1}`)}

function setup(id,path='',evolved=false){fresh();run(`Math.random=()=>.99;s.items={'${id}':3};s.spec=${path?`{'${id}':'${path}'}`:'{}'};s.evolved=${evolved?`{'${id}':true}`:'{}'};s.p.hp=50;s.pilot.damage=1;s.t=100;s.nextBreach=999;s.specialClock=999;s.spawn=999;s.elite=999;s.need=Infinity;s.debris=[];spawn(0);target=s.enemies[0];target.x=100;target.y=0;target.hp=target.max=100000;target.v=0;target.armour=0`)}


assert.equal(run('Object.keys(attackArtFamilies).length'),48);
assert(run("defs.filter(d=>d.kind==='weapon').every(d=>attackArtFamilies[d.id])"));
// Every weapon's real attack and both evolution forms reach the renderer on all quality/motion paths.
for(let id of run("defs.filter(d=>d.kind==='weapon').map(d=>d.id)"))for(let evolved of [false,true]){
 setup(id,'',evolved);run('s.spec.shield="capacity";s.p.inv=999;for(let i=0;i<8;i++){spawn(0);let e=s.enemies.at(-1);e.x=Math.cos(i*Math.PI/4)*90;e.y=Math.sin(i*Math.PI/4)*90;e.v=0;e.hp=e.max=100000;e.armour=0}s.nextBreach=999;s.specialClock=999;s.need=Infinity;attack(0);for(let i=0;i<80;i++)update(1/60)');
 for(let preset of ['low','medium','high','auto'])for(let motion of [false,true]){run(`graphics.preset='${preset}';graphics.motion='${motion?'on':'off'}';refreshGraphicsVisual()`);let before=run('JSON.stringify(s)'),calls=0,random=c.Math.random;c.Math.random=()=>{calls++;throw Error('render uses RNG')};run('draw()');c.Math.random=random;assert.equal(run('JSON.stringify(s)'),before,id+' mutated state');assert.equal(depth,0,id+' leaked canvas stack');assert.equal(calls,0)}
}
// Defensive state and hostile geometry remain visible even at the simplest settings.
fresh();run("s.items={shield:5,armour:5,plates:3,screen:3,intercept:5,thorns:5};s.p.shield=100;s.defence.screen=2;s.defence.plates=3;s.hostile=[{x:50,y:0,r:5,c:'#c5a2ff',vx:100,vy:0,life:2}];s.hazards=[{x:100,y:0,a:.3,r:12,life:1,max:1,c:'#ff79c6'}];s.sectorHazards=[{x:120,y:0,r:48,life:1,warning:.5,kind:'mine'},{x:-120,y:0,r:50,life:1,warning:0,kind:'storm'}];s.enemyBursts=[{x:0,y:100,r:80,wait:.5}]");
for(let preset of ['low','medium','high']){run(`graphics.preset='${preset}';refreshGraphicsVisual()`);let before=run('JSON.stringify(s)');run('draw()');assert.equal(run('JSON.stringify(s)'),before);assert.equal(depth,0)}
// Trails are capped, visual-only, WeakMap keyed, and reset on run/DEV clear.
fresh();run("s.shots=[{x:0,y:0,vx:100,vy:0,r:4,weapon:'rocket',life:2}];graphics.preset='high';refreshGraphicsVisual();reducedMotion=false;for(let i=0;i<100;i++){s.shots[0].x=i;updateAttackArt(.05)}");assert(run('attackArt.tracks.get(s.shots[0]).points.length<=6'));run('for(let i=0;i<100;i++)attackImpact({x:i*30,y:0},"bolt","")');assert(run('attackArt.impacts.length<=48'));fresh();assert.equal(run('attackArt.impacts.length'),0);assert.equal(run('attackArt.muzzles.length'),0);
// Invalid/dead and distant rendering does not create extra state.
run("drawWeaponProjectile({x:99999,y:0,r:3,vx:20,vy:0,weapon:'bolt',life:1},0);drawEnemyProjectileArt({x:0,y:0,r:3,vx:20,vy:0,life:0},0)");assert.equal(depth,0);
console.log('PASS all48 weapons/base+evolved across 4 quality presets and motion options; render/RNG purity, defensive layers, enemy shots/beams/hazards, bounded trails/impacts and resets');

// Repair feedback follows real healing, is rate-limited and does not create healing.
fresh();run("s.p.hp=50;healPlayer(1)");assert.equal(run('s.p.hp'),51);assert(run('attackArt.repairLife>0'));run('updateAttackArt(1)');assert.equal(run('attackArt.repairLife'),0);fresh();assert.equal(run('attackArt.repairLife'),0);

// Every usable weapon/support has individual art in all item surfaces.
assert.equal(run('Object.keys(passiveArtPaths).length'),32);assert.equal(run('new Set(Object.values(passiveArtPaths)).size'),32);assert.equal(run('Object.keys(weaponArtPaths).length'),48);assert(run(`defs.every(d=>equipmentIcon(d.id).includes('data-gear-id="'+d.id+'"'))`));
fresh();run("s.items={bolt:2,power:2};choices=[defs.find(d=>d.id==='power')];renderUpgradeChoices();hud()");assert(map.choices.innerHTML.includes('data-gear-id="power"'));assert(map.passives.innerHTML.includes('data-gear-id="power"'));assert(run("buildInventory('support').includes('data-gear-id=\"power\"')"));run("s.items={bolt:5,clock:1};evoFilter='all'");assert(run("recipes().includes('data-gear-id=\"clock\"')"));assert(run("equipmentIcon('bolt',true).includes('gear-evolved')"));
console.log('PASS individual artwork for all80 usable items,32 distinct passive designs, evolved variants and upgrade/HUD/build/recipe integration');
