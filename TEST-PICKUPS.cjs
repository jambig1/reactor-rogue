const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








run("state='menu';start();s.drops=[];pickupMarkers=true");
// Priority, small-screen budget, collisions, live-only filtering and marker preference.
c.innerWidth=390;c.innerHeight=844;run("resize();s.drops=Array.from({length:40},(_,i)=>({id:i===0?'chest':i%2?'repair':'freeze',x:Math.cos(i)*1200,y:Math.sin(i)*1200,life:60}));s.drops.push({id:'coin',x:999,y:999,life:30})");let before=run('JSON.stringify(s)');assert(run('pickupMarkerLayout().length<=4'));assert.equal(run('pickupMarkerLayout()[0].d.id'),'chest');assert(run('pickupMarkerLayout().every(p=>p.x>=27&&p.x<=363&&p.y>=149&&p.y<=695)'));assert(run('pickupMarkerLayout().every((p,i,a)=>a.every((q,j)=>i===j||Math.hypot(p.x-q.x,p.y-q.y)>=36))'));run('drawPickupMarkers()');assert.equal(run('JSON.stringify(s)'),before);run('pickupMarkers=false');assert.equal(run('pickupMarkerLayout().length'),0);
// Every pickup draws without modifying its timer or consuming gameplay RNG, even near expiry.
let random=c.Math.random;c.Math.random=()=>{throw Error('render RNG')};run("graphics.preset='low';graphics.motion='on';refreshGraphicsVisual();for(let id of [...dropTypes.map(d=>d.id),'chest']){let d={id,x:0,y:0,life:2};let old=JSON.stringify(d);drawDrop(d,1);if(JSON.stringify(d)!==old)throw Error('mutated pickup')}drawDrop({id:'unknown',life:5},1)");c.Math.random=random;assert.equal(depth,0);assert(html.includes('drawDrop(d,t);drawDamageNumbers();drawCombatReadability();'));
console.log('PASS all pickup icons, expiry visibility, Low/motion, bounded important edge markers, priority/spacing, toggle and render state/RNG isolation');
