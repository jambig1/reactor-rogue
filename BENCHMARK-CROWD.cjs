// Crowded-fight benchmark and exact-outcome comparison.
// Usage: node BENCHMARK-CROWD.cjs [other/index.html]   (compares outcome hashes when a second build is given)
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
function boot(file){let code=prefix.replace("const file=require('path').join(__dirname,'index.html');",'const file='+JSON.stringify(file)+';').replace('let c={console,Math,Date,','let c={console,Math:Object.create(Math),Date,');let context={require,console,__dirname:process.cwd()};vm.createContext(context);vm.runInContext(code+'\nthis.driver=run;',context);return context.driver}
const loadouts={
 kinetic:"{bolt:5,rapid:5,cannon:5,rocket:5,seeker:5,arc:5}",
 energy:"{laser:5,chain:5,solar:5,blade:5,frost:5,leech:5}",
 mixed:"{bolt:5,chain:5,rocket:5,blade:5,frost:5,mines:5}",
 barrage:"{bolt:5,rapid:5,seeker:5,cannon:5,arc:5,crescent:5}"};
function scene(run,loadout,frames,enemies){return run(`(()=>{let seed=12345;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 state='menu';start();s.t=420;s.need=Infinity;s.spawn=999;s.elite=999;s.specialClock=999;s.nextBreach=999;s.debrisClock=999;s.p.inv=0;s.pilot.hp=1e9;s.p.hp=1e9;
 let ids=Object.keys(${loadouts[loadout]}).filter(id=>defs.some(d=>d.id===id));s.items={};for(let id of ids)s.items[id]=5;s.evolved={};if('${loadout}'==='barrage')for(let id of ids)s.evolved[id]=true;
 for(let k of Object.keys(specialisations))s.spec[k]=specialisations[k][0].id;
 s.enemies=[];for(let i=0;i<${enemies};i++){spawn(i%4===3?2:i%3);let e=s.enemies.at(-1);let a=i*2.399,d=120+(i%9)*45;e.x=s.p.x+Math.cos(a)*d;e.y=s.p.y+Math.sin(a)*d;e.hp=e.max=e.max*3}
 let steps=0;for(let i=0;i<${frames};i++){if(state!=='play'){state='play'}update(1/60);steps++;
  if(s.enemies.length<${enemies}*.6)for(let k=0;k<20;k++){spawn(k%3);let e=s.enemies.at(-1),a=Math.random()*TAU;e.x=s.p.x+Math.cos(a)*420;e.y=s.p.y+Math.sin(a)*420}}
  let out=JSON.stringify({kills:s.kills,score:s.score,p:[s.p.x,s.p.y,s.p.hp],enemies:s.enemies.map(e=>[e.x,e.y,e.hp,e.freeze||0,e.slow||0]),shots:s.shots.map(b=>[b.x,b.y,b.life,b.pierce]),stats:s.weaponStats,gems:s.gems.length,debris:(s.debris||[]).length});
 return JSON.stringify({steps,count:s.enemies.length,shots:s.shots.length,out})})()`)}
const frames=+(process.env.FRAMES||600),enemies=+(process.env.ENEMIES||220);
const now=boot(path.join(__dirname,'index.html')),other=process.argv[2]?boot(path.resolve(process.argv[2])):null;
for(let loadout of Object.keys(loadouts)){
 let t0=process.hrtime.bigint(),a=JSON.parse(scene(now,loadout,frames,enemies));a.ms=Number(process.hrtime.bigint()-t0)/1e6;let hash=crypto.createHash('sha1').update(a.out).digest('hex').slice(0,12);
 let line=`${loadout.padEnd(8)} this build: ${(a.ms/a.steps).toFixed(2)} ms/step  enemies ${a.count} shots ${a.shots}  outcome ${hash}`;
 if(other){let t1=process.hrtime.bigint(),b=JSON.parse(scene(other,loadout,frames,enemies));b.ms=Number(process.hrtime.bigint()-t1)/1e6;let h2=crypto.createHash('sha1').update(b.out).digest('hex').slice(0,12);line+=`   | other: ${(b.ms/b.steps).toFixed(2)} ms/step  outcome ${h2}  ${h2===hash?'IDENTICAL':'DIFFERENT'}`;if(process.env.STRICT)assert.equal(hash,h2,loadout+' outcome differs')}
 console.log(line)}
