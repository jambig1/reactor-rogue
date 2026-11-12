const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').resolve(process.argv[2]||require('path').join(__dirname,'index.html'));let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);







const fresh=id=>run(`state='menu';start();Math.random=()=>.99;s.enemies=[];s.shots=[];s.hostile=[];s.items={'${id}':5};s.evolved={'${id}':true};s.spec={};s.p.x=s.p.y=0;s.face=0;s.p.hp=maxHP();s.need=Infinity;s.p.inv=999;s.signature=null;s.dev.test=true`);
let ids=run("defs.filter(d=>d.kind==='weapon').map(d=>d.id)");assert.equal(ids.length,48);assert.equal(run('Object.keys(evolutionSignatures).length'),48);assert.equal(run('new Set(Object.values(evolutionSignatures).map(p=>p.kind)).size'),48);
for(let id of ids){fresh(id);run("for(let x of [-260,-180,-100,-40,40,100,180,260])for(let y of [-240,-140,-60,0,60,140,240]){spawn(0);let e=s.enemies.at(-1);e.x=x;e.y=y;e.hp=e.max=1000000;e.v=0;e.stationary=true;e.arrival=0}");
 run('for(let i=0;i<480;i++){s.t+=1/60;updateEvolutionSignatures(1/60)}');assert(run(`signatureState().casts['${id}']>0`),id+' did not cast');assert(run(`weaponStat('${id}').damage>0`),id+' did not deal attributed damage');assert(run('s.signature.fields.length<=signatureLimits.fields&&s.signature.shots.length<=signatureLimits.shots'));
 for(let preset of ['low','high'])for(let motion of [false,true]){run(`graphics.preset='${preset}';reducedMotion=${motion};refreshGraphicsVisual()`);let before=run('JSON.stringify(s)');run('drawEvolutionSignatures(s.t)');assert.equal(run('JSON.stringify(s)'),before,id+' renderer mutated simulation');assert.equal(depth,0,id+' unbalanced rendering')}
 assert(run('s.signature.shots.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y))'),id+' invalid projectile');
}
// Counter-rotating rings contain eight unique blades, rather than duplicate contacts.
fresh('blade');run("spawn(0);s.enemies[0].x=100;castEvolutionSignature('blade')");assert.equal(run("new Set(signaturePoints(s.signature.fields[0]).map(n=>n.x.toFixed(3)+':'+n.y.toFixed(3))).size"),8);
// The crop map matches every shipped WebP atlas, including real alpha transparency.
for(let i=0;i<4;i++){let file=run('weaponAtlasFiles['+i+']'),data=fs.readFileSync(require('path').join(__dirname,file));assert.equal(data.toString('ascii',8,16),'WEBPVP8X');assert.equal(1+data.readUIntLE(24,3),run('weaponAtlasSizes['+i+'][0]'));assert.equal(1+data.readUIntLE(27,3),run('weaponAtlasSizes['+i+'][1]'));assert(data[20]&16,'WebP alpha')}
// Split warheads stop after one generation, with explicit global limits.
fresh('rocket');run("spawn(0);s.enemies[0].x=400;s.enemies[0].y=0;s.enemies[0].hp=s.enemies[0].max=1e8;castEvolutionSignature('rocket');for(let i=0;i<180;i++)updateEvolutionSignatures(1/60)");assert(run('s.signature.shots.length<=96'));assert(run('s.signature.shots.every(b=>!b.split||b.split===2)'));
// Collision follows the swept projectile segment, including large simulation steps.
fresh('rapid');run("spawn(0);let e=s.enemies[0];e.x=50;e.y=0;e.hp=e.max=1000;e.arrival=0;signatureState().clock.rapid=999;signatureShot({id:'rapid',damage:100},0,0,0,{vx:600,vy:0});updateEvolutionSignatures(.2)");assert(run("weaponStat('rapid').damage>=100"));
// Damage only occurs after evolution, and manual starters require fire input.
fresh('bolt');run("s.evolved={};spawn(0);s.enemies[0].x=100;s.enemies[0].y=0;updateEvolutionSignatures(1)");assert.equal(run('s.signature.fields.length'),0);run("s.evolved.bolt=true;fireMode='manual';fireHeld=false;fireTouch=false;keys.Space=false;updateEvolutionSignatures(1)");assert.equal(run('s.signature.fields.length'),0);run('fireHeld=true;updateEvolutionSignatures(.1)');assert(run('s.signature.fields.length>0'));
// Ordinary signature shots stop at cover; phase torpedoes retain their phase exception.
fresh('rapid');run("spawn(0);s.enemies[0].x=100;s.enemies[0].y=0;s.enemies[0].hp=1000;s.signature={fields:[],shots:[],clock:{rapid:999},casts:{},audioClock:0};s.terrain=[{kind:'cover',x:50,y:0,r:18,hp:1000,max:1000,c:'#99aabb',glow:0}];signatureShot({id:'rapid',damage:100},0,0,0,{vx:600,vy:0});updateEvolutionSignatures(.2)");assert(run('s.terrainStats.coverBlocked>0'));assert.equal(run('s.signature.shots.length'),0);
// A fresh run clears actors; removing equipment cannot leave damaging signatures behind.
run("fireMode='auto';s.items={};updateEvolutionSignatures(.1)");assert.equal(run('s.signature.fields.length'),0);run("state='menu';start()");assert.equal(run('s.signature'),null);
// Shared caps apply even to deliberately illegal developer stress builds.
run("s.items=Object.fromEntries(defs.filter(d=>d.kind==='weapon').map(d=>[d.id,5]));s.evolved=Object.fromEntries(Object.keys(s.items).map(id=>[id,true]));s.enemies=[];for(let i=0;i<240;i++){spawn(0);let e=s.enemies.at(-1);e.x=(i%20-10)*30;e.y=(Math.floor(i/20)-6)*30;e.hp=e.max=1e8;e.arrival=0}for(let i=0;i<600;i++)updateEvolutionSignatures(1/60)");assert(run('s.signature.fields.length<=12&&s.signature.shots.length<=96'));assert(run('s.enemies.every(e=>Number.isFinite(e.x)&&Number.isFinite(e.y))'));
console.log('PASS 48 unique signature cycles with real attributed damage, pure Low/High/reduced-motion rendering, finite actors, swept collision, manual firing, one-generation splitting, reset/removal and global stress caps');
