const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);




// Menu artwork must share the full gameplay renderer without touching the run.
run("hangar.ships=pilots.map(p=>p.id);start();s.t=123;s.items.armour=4;s.phaseTime=.6;s.ambushTime=2");
let stateBefore=run('JSON.stringify(s)'),drawDepth=depth;
let previews=run('pilots.map(p=>shipIcon(p))');assert.equal(previews.length,12);assert.equal(new Set(previews).size,12);
for(let svg of previews){assert(svg.includes('viewBox="-36 -38 72 76"'));assert(svg.includes('aria-hidden="true"'));assert(svg.includes('rotate(-90)'));assert(svg.includes('#314d60'));assert(svg.includes('#d2fff4'));assert(svg.includes('<rect'));assert(!svg.includes('NaN'));assert(!svg.includes('undefined'))}
assert.equal(run('JSON.stringify(s)'),stateBefore);assert.equal(depth,drawDepth);
run("s=null;state='menu';hangar.paint='original'");assert.equal(run('shipIcon(pilots[0])'),run('shipIcon(pilots[0])'));
for(let p of ['aurora','solar']){run("hangar.paints=hangar.paints||[];hangar.paint="+JSON.stringify(p));let svg=run('shipIcon(pilots[0])');assert(svg.includes('<svg'))}
run("reducedMotion=true;pilotPicker();renderHangar()");assert(map.pilotPicker.innerHTML.includes('#314d60'));assert(map.hangarContent.innerHTML.includes('#314d60'));
console.log('PASS all twelve complete previews, shared turret/detail geometry, no run-state mutation, static menu/reset and Hangar paths');
