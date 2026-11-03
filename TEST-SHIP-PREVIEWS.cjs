const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);




// Menu artwork must share the full gameplay renderer without touching the run.
run("hangar.ships=pilots.map(p=>p.id);start();s.t=123;s.items.armour=4;s.phaseTime=.6;s.ambushTime=2");
let stateBefore=run('JSON.stringify(s)'),drawDepth=depth;
let previews=run('pilots.map(p=>shipIcon(p))');assert.equal(previews.length,12);assert.equal(new Set(previews).size,12);
for(let svg of previews){assert(svg.includes('viewBox="-36 -38 72 76"'));assert(svg.includes('aria-hidden="true"'));assert(svg.includes('rotate(-90)'));assert(svg.includes('#314d60'));assert(svg.includes('#c5fff0'));assert(svg.includes('<rect'));assert(!svg.includes('NaN'));assert(!svg.includes('undefined'))}
assert.equal(run('JSON.stringify(s)'),stateBefore);assert.equal(depth,drawDepth);
run("s=null;state='menu';hangar.paint='original'");assert.equal(run('shipIcon(pilots[0])'),run('shipIcon(pilots[0])'));
for(let p of ['aurora','solar']){run("hangar.paints=hangar.paints||[];hangar.paint="+JSON.stringify(p));let svg=run('shipIcon(pilots[0])');assert(svg.includes('<svg'))}
run("reducedMotion=true;pilotPicker();renderHangar()");assert(map.pilotPicker.innerHTML.includes('#314d60'));assert(map.hangarContent.innerHTML.includes('#314d60'));
console.log('PASS all twelve complete previews, shared turret/detail geometry, no run-state mutation, static menu/reset and Hangar paths');

// Every hull and weapon mount is deterministic and independent of gameplay RNG.
run("start();s.t=30");let before=run('JSON.stringify(s)'),originalPilot=run('s.pilot.id');run("Math.random=()=>{throw Error('render consumed gameplay RNG')}");run("for(let p of pilots){s.pilot=p;pilotDesign(12)}");run('s.pilot=pilots.find(p=>p.id==='+JSON.stringify(originalPilot)+')');
assert.equal(run('JSON.stringify(s)'),before);
assert.equal(run('new Set(Object.values(fleetHullProfiles).map(x=>JSON.stringify(x))).size'),12);
for(let reduced of [false,true]){run('reducedMotion='+reduced);run("for(let sector of [null,'belt','storm','foundry','cryo','city'])for(let type=0;type<4;type++)for(let role of [null,'hunter','brood','volatileShip','carrier','rail','repair','minelayer'])enemyDesign({x:100,y:90,r:20,hp:20,max:100,c:'#ff709f',type,role,sectorHull:sector,freeze:0},12)");assert.equal(depth,0)}
console.log('PASS twelve unique hull profiles, mount families, render RNG isolation and all sector/class/specialist combinations');
if(process.env.FLEET_GALLERY){let cards=run("pilots.map(p=>'<article>'+shipIcon(p)+'<h2>'+p.name+'</h2><p>'+p.role+'</p></article>').join('')");fs.writeFileSync('TEST-FLEET-ART.html','<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reactor Rogue fleet artwork</title><style>body{margin:0;background:#080e1b;color:#e4f2ff;font-family:Arial,sans-serif;padding:36px}h1{color:#83f9d6}main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;max-width:1100px;margin:auto}header{max-width:1100px;margin:0 auto 24px}article{background:#142238;border:1px solid #39516a;border-radius:12px;text-align:center;padding:18px}svg{width:150px;height:158px}h2{font-size:18px;margin:8px}p{color:#9bb3c5;font-size:13px}@media(max-width:700px){main{grid-template-columns:repeat(2,minmax(0,1fr))}svg{width:110px;height:116px}}</style><header><p>REACTOR ROGUE / FLEET ARTWORK</p><h1>Twelve ships. Twelve identities.</h1><p>Shared gameplay and Hangar artwork. Static inspection at enlarged scale.</p></header><main>'+cards+'</main>')}
