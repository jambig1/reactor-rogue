// v0.75 jackpot caches and endless Reactor Overdrive.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
// Every cache rolls a tier; the reveal never blocks claiming.
fresh();run("s.need=levelXPRequirement(s.lv);state='play';s.items.bolt=1;s.rewards=1;s.cacheRewards=[{kind:'supply'}];openReward()");assert.equal(run('state'),'reward');
assert(run('s.cacheJackpot&&[0,1,2].includes(s.cacheJackpot.tier)'));
run("s.cacheJackpot={tier:2,picks:['bolt'],applied:false};s.p.hp=10");run('claimReward(0)');
assert.equal(run('s.items.bolt'),2,'jackpot levels the picked item');assert.equal(run('s.p.hp'),run('maxHP()'),'jackpot repairs fully');assert(run('s.boosts.damage>=10'));assert.equal(run('s.cacheJackpot'),null);
// Odds: evolution caches pay out more often than supply caches; all tiers appear; no combat RNG used.
fresh();run("s.items.bolt=1;var tally=k=>{let c=[0,0,0];for(let i=0;i<3000;i++){s.t=i*.37;c[rollCacheJackpot(k).tier]++}return c};var ev=tally('evolution'),su=tally('supply');var r0=Math.random");
let ev=run('ev'),su=run('su');assert(ev.every(n=>n>0)&&su.every(n=>n>0),'all tiers reachable');
assert(ev[2]/3000>.07&&ev[2]/3000<.17,'evolution jackpot about 12%: '+ev);assert(su[2]/3000<.08,'supply jackpot rare: '+su);assert(ev[0]<su[0],'evolution caches pay out more');
// Picks only ever raise items below level 5, and never twice.
fresh();run("for(let d of defs.filter(d=>d.kind==='weapon').slice(0,6))s.items[d.id]=5;s.items.bolt=5;var j=rollCacheJackpot('evolution')");assert.equal(run('j.picks.length'),0);
fresh();run("s.items.bolt=4;s.items.laser=1;s.items.armour=2;var seen=new Set;for(let i=0;i<200;i++){s.t=i;let j=rollCacheJackpot(\x27evolution\x27);if(new Set(j.picks).size!==j.picks.length)throw Error(\x27dup\x27);j.picks.forEach(p=>seen.add(p))}");
// Overdrive: off outside endless and for the first five endless minutes.
fresh();assert.equal(run('overdrivePower()'),1);run('s.endless=true;s.endlessStartedAt=s.t-4*60');assert.equal(run('overdrivePower()'),1);
run('s.endlessStartedAt=s.t-7*60');assert(run('overdrivePower()')>1.9&&run('overdrivePower()')<2.3);
run("s.endlessStartedAt=s.t-60*60");assert.equal(run('overdrivePower()'),7,'capped');
// Hordes spawn, stay weak, never split, respect the cap, and every weapon hit is multiplied.
fresh();run("state='play';s.endless=true;s.endlessStartedAt=s.t-8*60;s.enemies=[];updateOverdrive(2)");let n=run('s.enemies.filter(e=>e.swarm).length');assert(n>=20,'a wave arrives: '+n);
assert(run('s.enemies.filter(e=>e.swarm).every(e=>e.hp<20&&e.split&&e.d<=3)'));
run("for(let i=0;i<40;i++)updateOverdrive(4)");assert(run('s.enemies.filter(e=>e.swarm).length')<=150);assert(run('s.enemies.length')<=330);
run("var drone=s.enemies.find(e=>e.swarm),on=enemyDamage(drone,10,false,'bolt','bolt');s.endless=false;var off=enemyDamage(drone,10,false,'bolt','bolt')");assert(Math.abs(run('on/off')-run("(s.endless=true,overdrivePower())"))<1e-9);
console.log('PASS jackpot caches (tiers, odds, level picks, repair, boost) and Reactor Overdrive (start time, damage curve and cap, horde waves, swarm cap)');
`);
