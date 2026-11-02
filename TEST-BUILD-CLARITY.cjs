const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);







const fresh=()=>run("state='menu';start();s.items={bolt:1};s.spec={};s.evolved={};s.banished=[]");
fresh();let before=run('JSON.stringify(s)');let report=run('buildReport()');assert(report.includes('Neon Bolts'));assert(report.includes('1 / 6 slots'));assert(report.includes('No passives or defence'));assert(!report.includes('NOT EQUIPPED'));assert.equal(run('JSON.stringify(s)'),before);
// Every recipe reports the precise missing support, ready cache, and completed state.
for(let i=0;i<run('evolutions.length');i++){fresh();run(`s.items={[evolutions[${i}].id]:4}`);assert(run(`buildNext(evolutions[${i}]).includes('4/5')`));run(`s.items[evolutions[${i}].id]=5;s.items[evolutions[${i}].passive]=1`);assert.equal(run(`buildNext(evolutions[${i}])`),'Ready: collect an elite cache');run(`s.evolved[evolutions[${i}].id]=true`);assert.equal(run(`buildNext(evolutions[${i}])`),'Evolution active')}
fresh();run("s.banished=[evolutions.find(e=>e.id==='bolt').passive]");assert(run("buildReport().includes('banished this run')"));
fresh();run("s.items=Object.fromEntries(defs.filter(d=>d.kind==='support'&&d.id!==evolutions.find(e=>e.id==='bolt').passive).slice(0,6).map(d=>[d.id,1]));s.items.bolt=5");assert(run("buildReport().includes('support slots full')"));
// Active combinations require both halves; no discovery persists into another run.
fresh();run('s.items={[synergyDefs[0].a]:1}');assert(!run('buildReport().includes("✓ "+synergyDefs[0].name)'));run('s.items[synergyDefs[0].b]=1');assert(run('buildReport().includes("✓ "+synergyDefs[0].name)'));run('renderUpgradeBuild()');assert(run("$('upgradeBuild').innerHTML.includes(defs.find(d=>d.id===synergyDefs[0].a).name)"));run("state='menu';start();renderUpgradeBuild()");assert(!run('buildReport().includes("✓ "+synergyDefs[0].name)'));
fresh();run("setPauseTab('build')");assert(run("$('pauseBuild').innerHTML.includes('Your build this run')"));assert(html.includes('aria-controls="pauseBuild"'));assert(html.includes('class="build-peek"'));
console.log('PASS all36 recipe next steps, active-only combinations, slot/banish blockers, inspection purity, loadout refresh and run reset');
