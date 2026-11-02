const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








const fresh=()=>run("state='menu';start();s.dev.test=true;s.enemies=[];s.t=650;s.completed=true;s.bossIndex=3;s.bossKills=3;beginEndless()");
fresh();assert.equal(run('s.endlessStartedAt'),650);assert.equal(run('s.nextEndlessBoss'),770);assert.equal(run('endlessPressure().damage'),1);assert.equal(run('endlessPressure().health'),1);
// Continuous pressure, not tied to frame count or a wall-clock pause.
let hp=1,damage=1;for(let m of [1,2,5,10,20,60,180]){run('s.t=s.endlessStartedAt+'+m+'*60');let p=run('endlessPressure()');assert(p.health>hp&&p.damage>damage);assert(p.spawn<=2);hp=p.health;damage=p.damage}
// Ordinary, specialist, launched fighter and boss HP all follow the same pressure.
fresh();run('s.t+=600;ordinary=spawn(0);special=spawnSpecial("hunter");carrier=spawnSpecial("brood");launchFighters(carrier)');assert.equal(run('ordinary.max'),16*(1+1250/180)*16);assert.equal(run('special.max'),Math.round(80*(1+1250/240)*16));assert.equal(run('s.enemies.find(e=>e.fighterOwner).max'),18*(1+1250/240)*16);
// Strong armour can no longer flatten all late-game hits to the one-damage floor.
fresh();run('s.dev.god=false;s.items={armour:5};s.p.inv=0;s.p.shield=0;s.p.hp=1000;hurtPlayer(9)');let early=run('1000-s.p.hp');run('s.t+=1200;s.p.inv=0;s.p.hp=1000;hurtPlayer(9)');assert(run('1000-s.p.hp')>early*20);
// No bypass of dodge invulnerability or a deliberate developer God mode.
run('s.p.hp=1000;s.p.inv=1;hurtPlayer(999)');assert.equal(run('s.p.hp'),1000);run('s.p.inv=0;s.dev.god=true;hurtPlayer(999)');assert.equal(run('s.p.hp'),1000);
// Returning bosses rotate, retain sector mechanics, and never replay the clear transition.
for(let sector of ['grid','belt','storm','foundry','cryo','city']){fresh();run('s.sector='+JSON.stringify(sector));for(let i=0;i<4;i++){run('s.enemies=[];s.t=s.nextEndlessBoss;updateEndless()');assert.equal(run('s.enemies.filter(e=>e.boss).length'),1);assert.equal(run('s.enemies[0].name'),run('runRouteDefs()['+(i%3)+'].name'));assert.equal(run('s.bossIndex'),3);assert.equal(run('s.enemies[0].max'),run('(runRouteDefs()['+(i%3)+'].hp+s.lv*120)*endlessPressure().health'));run('s.enemies[0].arrival=0;hit(s.enemies[0],1e30,"bolt")');assert.equal(run('s.bossKills'),3);assert.equal(run('s.routeKills.length'),0);assert(!run('s.finalClearPending'));assert(run('s.completed'));assert.equal(run('s.endlessBossKills'),i+1)}}
// A living boss and the full population cap postpone, never duplicate, the next boss.
fresh();run('s.t=s.nextEndlessBoss;updateEndless();s.t+=300;updateEndless()');assert.equal(run('s.enemies.filter(e=>e.boss).length'),1);run('s.enemies=[];for(let i=0;i<300;i++)spawn(0);updateEndless()');assert.equal(run('s.enemies.length'),240);assert(!run('s.enemies.some(e=>e.boss)'));run('s.enemies.pop();updateEndless()');assert.equal(run('s.enemies.length'),240);assert.equal(run('s.enemies.filter(e=>e.boss).length'),1);
// Reset removes pressure and returns to the ordinary three-reactor route.
run("state='menu';start()");assert(!run('s.endless'));assert.equal(run('endlessPressure().health'),1);assert.equal(run('s.bossIndex'),0);
console.log('PASS increasing endless HP/damage, bounded spawn pressure, every fleet type, defence/invulnerability, all-sector recurring boss rotation, capped retries, clear retention and fresh-run reset');
