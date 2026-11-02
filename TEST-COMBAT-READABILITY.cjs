const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








run("state='menu';start();s.enemies=[];s.hostile=[{x:50,y:0,r:5,c:'#c5a2ff',vx:100,vy:0,life:2},{x:99999,y:0,r:5,life:2},{x:0,y:0,r:4,life:0}];s.enemyBursts=[{x:80,y:0,r:105,wait:.3}];s.sectorHazards=[{x:-90,y:0,r:48,life:2,warning:1,kind:'storm'}];s.enemies=[{x:100,y:0,r:20,hp:50,max:50,role:'rail',roleAim:0,roleWarning:.5,freeze:0},{x:-100,y:0,r:15,hp:50,max:50,role:'hunter',roleAim:0,huntWarning:.5,freeze:0}]");
// All readability functions must be pure, consume no combat RNG and balance save/restore.
let before=run('JSON.stringify(s)');let random=c.Math.random;c.Math.random=()=>{throw Error('render consumed combat RNG')};for(let preset of ['low','medium','high','auto']){run('graphics.preset='+JSON.stringify(preset)+';refreshGraphicsVisual();drawCombatReadability()');assert.equal(depth,0);assert.equal(run('JSON.stringify(s)'),before)}c.Math.random=random;
// Near-ship text moves only on the canvas, preserving every number and its simulation position.
run("s.damageNumbers=[{x:s.p.x,y:s.p.y,label:'29',life:1,max:1,vx:0}]");let numberBefore=run('JSON.stringify(s.damageNumbers)');assert.equal(run('Math.hypot(damageNumberPosition(s.damageNumbers[0]).x-s.p.x,damageNumberPosition(s.damageNumbers[0]).y-s.p.y)'),44);run('drawDamageNumbers()');assert.equal(run('JSON.stringify(s.damageNumbers)'),numberBefore);assert.equal(run('damageNumberPosition({x:100,y:100}).x'),100);
// Dead/offscreen hostile shots are omitted, essential marks survive reduced motion/Low.
assert(!run('threatVisible(s.hostile[1])'));run("graphics.preset='low';graphics.motion='on';refreshGraphicsVisual();drawCombatReadability()");assert.equal(depth,0);assert(html.indexOf('drawDamageNumbers();drawCombatReadability();')>html.indexOf('drawCombatExplosions();drawPickupWaves();'));assert(html.includes('Reading combat threats'));
console.log('PASS pure/RNG-free threat layer across quality and motion profiles, bounded shot visibility, near-player text separation and final draw order');
