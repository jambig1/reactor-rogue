const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








const fresh=()=>run("state='menu';start();s.enemies=[];s.drops=[];s.items={bolt:1}");
fresh();assert.equal(run('makeCacheDrop(0,0).cacheKind'),'supply');run('var supply=makeCacheDrop(0,0);s.items={bolt:5,clock:1};s.drops.push(supply);collectDrop(supply);openReward()');assert.equal(run('s.currentCacheKind'),'supply');assert(run('rewardOptions.every(o=>!evolutions.some(e=>e.id===o.id))'));assert.equal(run("$('rewardLabel').textContent"),'▣ SUPPLY CACHE ▣');run('claimReward(0)');
fresh();run('s.items={bolt:5,clock:1};var evo=makeCacheDrop(0,0);s.drops.push(evo)');assert.equal(run('evo.cacheKind'),'evolution');assert.equal(run('makeCacheDrop(1,1).cacheKind'),'supply');assert.equal(run('pickupInfo(evo).name'),'EVOLUTION CACHE');run('collectDrop(evo);s.drops=[];openReward()');assert(run('rewardOptions.every(o=>evolutions.some(e=>e.id===o.id))'));assert.equal(run("$('rewardLabel').textContent"),'✦ EVOLUTION CACHE ✦');run('claimReward(0)');assert(run('s.evolved.bolt'));assert.equal(run('makeCacheDrop(0,0).cacheKind'),'supply');
fresh();run('s.items={bolt:5,clock:1};s.drops.push(makeCacheDrop(0,0));delete s.items.clock;refreshCacheKinds()');assert.equal(run('s.drops[0].cacheKind'),'supply');assert.equal(run('pickupInfo(s.drops[0]).name'),'SUPPLY CACHE');
fresh();run("s.items={bolt:5,clock:1};s.merchant.owned.decoder=true;collectDrop(makeCacheDrop(0,0));openReward()");assert(run('s.rewardDecoderBonus'));assert.equal(run('rewardOptions.length'),1);let tools=run('s.rerolls');run('claimReward(0);claimReward(0)');assert.equal(run('s.rerolls'),tools+1);
// Same stat/RNG sequence, two new hulls followed by familiar hull; specialists retain their identities.
let fields=['x','y','r','hp','max','v','d','xp','c','type'];function fleet(sector){fresh();run('s.sector='+JSON.stringify(sector)+';var seed=123;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);for(let i=0;i<9;i++)spawn(i%3)');return run('s.enemies.map(e=>Object.fromEntries('+JSON.stringify(fields)+'.map(k=>[k,e[k]])))')}
let grid=JSON.stringify(fleet('grid'));assert.equal(JSON.stringify(fleet('belt')),grid);assert.equal(run('s.enemies.filter(e=>e.sectorHull).length'),6);assert.equal(run('s.enemies.filter(e=>!e.sectorHull).length'),3);assert.equal(JSON.stringify(fleet('storm')),grid);run('var specialist=spawn(0,true)');assert(!run('specialist.sectorHull'));
// Pure frozen/glowing/normal render paths across both sectors, all four classes and quality modes.
for(let sector of ['belt','storm'])for(let type of [0,1,2,3])for(let mode of ['low','high']){fresh();run('s.sector='+JSON.stringify(sector)+';var enemy=spawn('+type+');enemy.freeze=1;enemy.glow=.1;graphics.preset='+JSON.stringify(mode)+';refreshGraphicsVisual()');let before=run('JSON.stringify(s)');run('drawSectorEnemyShip(enemy,3)');assert.equal(run('JSON.stringify(s)'),before);assert.equal(depth,0)}fresh();assert.equal(run('s.cacheRewards.length'),0);assert.equal(run('s.sectorHullIndex'),0);
console.log('PASS distinct drop/reward kinds, readiness/duplicate gates, stale recipe refresh, decoder bonus, sector/familiar mix, unchanged spawn RNG/stats and pure variant rendering/reset');
