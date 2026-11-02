const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








run("state='menu';start()");assert.equal(run('s.need'),5);for(let l=2;l<=500;l++)assert(run('levelXPRequirement('+l+')')>run('levelXPRequirement('+(l-1)+')'));
for(let l of [10,20,40,80])assert(run('levelXPRequirement('+l+')')>Math.floor(6+l*3+Math.pow(l,1.32)+Math.max(0,l-20)*2));
// Carry surplus XP through chained rewards; each reward charges the next threshold.
run('s.xp=100;s.items={};levelUp()');assert.equal(run('s.lv'),2);assert.equal(run('s.xp'),95);let second=run('s.need');run('choose(0)');assert.equal(run('s.lv'),3);assert.equal(run('s.xp'),95-second);
run("state='menu';start()");
// Recovery is created by an actual boss kill and pauses with game time.
run("s.t=180;spawnBoss();s.enemies[0].arrival=0;hit(s.enemies[0],1e9,'bolt')");assert.equal(run('s.bossRecoveryUntil'),188);assert.equal(run('bossRecoveryMultiplier()'),1.75);assert.equal(run('runObjective()'),'RECOVERY · 8s');run("state='pause';hud();renderPauseOverview()");assert.equal(run('s.bossRecoveryUntil-s.t'),8);run("state='play';s.t=188");assert.equal(run('bossRecoveryMultiplier()'),1);
// A newly active boss takes priority; recovery never postpones the scheduled boss.
run('s.bossRecoveryUntil=999;spawnBoss()');assert.equal(run('bossRecoveryMultiplier()'),1);assert.equal(run('runObjective()'),'REACTOR 2 · ENGAGED');run("state='menu';start()");assert.equal(run('s.bossRecoveryUntil'),0);assert.equal(run('bossRecoveryMultiplier()'),1);
console.log('PASS first upgrade threshold, strictly increasing XP through level500, steeper later curve, surplus carryover, real boss recovery/pause/reset and active-boss priority');
