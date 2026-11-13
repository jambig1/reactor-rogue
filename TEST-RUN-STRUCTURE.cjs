const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








const fresh=()=>run("state='menu';start();s.enemies=[];s.dev.test=true");
fresh();assert.equal(run('runObjective()'),'REACTOR 1 · 03:00');run('s.t=179');assert.equal(run('runObjective()'),'REACTOR 1 · 00:01');run('updateRunApproach()');assert.equal(run('s.routeWarned.length'),1);run('updateRunApproach()');assert.equal(run('s.routeWarned.length'),1);
// All three sector routes use the actual boss names and preserve scheduled times.
for(let sector of ['grid','belt','storm']){fresh();run('s.sector='+JSON.stringify(sector));assert(run('runRouteReport().includes(runRouteDefs()[2].name)'));run('s.t=180;spawnBoss()');assert.equal(run('s.enemies[0].routeIndex'),0);assert.equal(run('runObjective()'),'REACTOR 1 · ENGAGED');run("s.enemies[0].arrival=0;hit(s.enemies[0],1e9,'bolt')");assert.equal(run('s.routeKills.length'),1);assert(!run('s.finalClearPending'));assert(run("runRouteReport().includes('Defeated 03:00')"))}
// A final actual boss hit protects the player before the rest of the update can damage them.
fresh();run("s.bossIndex=2;s.bossKills=2;s.t=601;spawnBoss();s.enemies[0].arrival=0;hit(s.enemies[0],1e9,'bolt')");assert(!run('s.finalClearPending'));assert.equal(run('s.finalEncounter.stage'),'approach');run("s.mutationPending=0;s.t=s.finalEncounter.at;updateFinalEncounter();var f=finalBoss();f.arrival=0;hit(f,1e9,'bolt')");assert(run('s.finalClearPending'));let hp=run('s.p.hp');run('s.p.inv=0;hurtPlayer(100000)');assert.equal(run('s.p.hp'),hp);run("s.mutationPending=1;s.t=s.finalClearAt;s.hostile=[{life:1}];s.hazards=[{}];s.enemyBursts=[{}];resolveFinalClear()");assert.equal(run('state'),'mutation');assert.equal(run('s.hostile.length'),0);assert.equal(run('s.enemyBursts.length'),0);assert.equal(run("$('mutationTitle').textContent"),'Final reactor secured.');run('claimMutation(0)');assert.equal(run('state'),'end');assert(run('s.completed'));assert(run("$('runDebrief').innerHTML.includes('SECTOR CLEAR')"));assert(run("$('runDebrief').innerHTML.includes('no permanent rewards')"));
// Endless is explicit, retains clear and cannot trigger the final transition twice.
run("$('continueEndless').onclick()");assert.equal(run('state'),'play');assert(run('s.endless&&s.completed&&!s.finalClearPending'));assert.equal(run('runObjective()'),'ENDLESS 1 · REACTOR 02:00');assert(!run('resolveFinalClear()'));
// Exhausted mutation pool still reaches victory; no permanently stuck final reward.
fresh();run('s.bossKills=3;s.finalClearPending=true;s.mutationPending=1;s.mutations=Object.fromEntries(mutationDefs.map(d=>[d.id,true]));resolveFinalClear()');assert.equal(run('state'),'end');assert(run('s.completed'));
// Normal victories bank once, including after endless defeat, and fresh runs reset route data.
fresh();run("s.dev.test=false;s.bossKills=3;s.completed=true;finish(true)");let wins=run('hangar.wins'),credits=run('hangar.credits');run("$('continueEndless').onclick();finish(false)");assert.equal(run('hangar.wins'),wins);assert.equal(run('hangar.credits'),credits);assert(run("$('runDebrief').innerHTML.includes('SECTOR CLEAR')"));fresh();assert.equal(run('s.routeKills.length'),0);assert.equal(run('s.routeWarned.length'),0);assert(!run('s.finalClearPending'));
fresh();run("devUnlocked=true;state='settings';settingsReturn='pause';spawnBoss();devAction('defeatBoss')");assert.equal(run('s.bossKills'),1);assert(run('s.dev.test'));
console.log('PASS three sector routes, boss timing/warnings, actual final hit protection, mutation/no-options victory, endless and bank-once/reset');
