// v0.63 deeper endless: threats per cycle, shielded reactors, Overcharge rewards, cycle credits and sector records.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();run("s.runID='endless-deep';s.dev.test=false;s.completed=true;state='play';beginEndless()");
assert.deepEqual(JSON.parse(run('JSON.stringify(s.endlessThreats)')),[]);assert.equal(run('endlessThreat("swift")'),false);
// Each new cycle adds exactly one threat, never repeating.
run("s.nextEndlessBoss=1e9;s.t=s.endlessStartedAt+121;updateEndless()");assert.equal(run('s.endlessThreats.length'),1);assert.match(run("$('toast').textContent"),/NEW THREAT/);
run("s.t=s.endlessStartedAt+120*9+1;updateEndless()");assert.equal(run('s.endlessThreats.length'),7);assert.equal(run('new Set(s.endlessThreats).size'),7);
run("s.t=s.endlessStartedAt+120*12+1;updateEndless()");assert.equal(run('s.endlessThreats.length'),7,'pool is finite');
// Threat effects.
run("spawn(2);var e=s.enemies.at(-1)");assert.equal(run('enemyArmour(e)'),.4);
assert(run("endlessPressure().spawn")>run("Math.min(2,1+.1*endlessPressure().minutes)"),'surge raises spawn pressure');
run("e.hp=e.max/2;var before=e.hp;s.enemies=[e];e.freeze=0;update(.5)");assert(run('e.hp>before'),'self-repair');
// Shielded reactor with two shield systems; 60% shield until both fall.
run("s.enemies=[];var b=spawnBoss(true)");assert.equal(run("s.enemies.filter(p=>p.systemOwner===b).length"),2);assert.equal(run('enemyArmour(b)'),.6);
run("b.arrival=0;for(let p of s.enemies)if(p.systemOwner===b){p.arrival=0;hit(p,1e12)}bossAttack(b,.016)");assert.equal(run('b.shielded'),false);assert.equal(run('enemyArmour(b)'),.2);
// Overcharge rewards once mutations are exhausted.
run("s.mutations=Object.fromEntries(mutationDefs.map(d=>[d.id,true]));s.mutationPending=1;state='play';openMutation()");assert.equal(run('state'),'mutation');assert.equal(run('mutationOptions.every(d=>d.boon)'),true);
let hp0=run('maxHP()'),rate0=run('rate()');run("claimMutation(mutationOptions.findIndex(d=>d.id==='hull'))");assert.equal(run('maxHP()'),hp0+25);assert.equal(run('s.p.hp'),hp0+25);
run("s.mutationPending=1;state='play';openMutation();claimMutation(mutationOptions.findIndex(d=>d.id==='rate'))");assert(Math.abs(run('rate()')-rate0*.92)<1e-9);
run("s.mutationPending=1;state='play';openMutation();claimMutation(mutationOptions.findIndex(d=>d.id==='damage'))");assert.equal(run('endlessBoon("damage")'),1);
// Credits and records.
assert.equal(run('endlessCycleCredits()'),run('(endlessPressure().cycle-1)*15'));assert(run('endlessCycleCredits()')>0);
run("hangar.endlessBest={};finish(false)");assert.equal(run('hangar.endlessBest[s.sector].cycle'),run('endlessPressure().cycle'));assert.equal(run('s.endlessRecordNew'),true);
assert(run("($('runDebrief').innerHTML+$('endStats').innerHTML).includes('NEW SECTOR RECORD')"));assert(run("endlessBestLine(s.sector).includes('ENDLESS BEST')"));
// Records load back from saves; junk is ignored.
assert(run("JSON.stringify(hangar).includes('endlessBest')"));
// Sector route untouched: no threats outside endless.
fresh();assert.equal(run('endlessThreat("armour")'),false);run("spawn(2);var x=s.enemies.at(-1)");assert.equal(run('enemyArmour(x)'),.25);
// Quick test with a starting cycle.
assert.equal(run("quickTest('endless','',true,{cycle:5})"),true);assert.equal(run('s.endlessThreats.length'),4);assert.equal(run('s.dev.test'),true);
console.log('PASS deeper endless: one new threat per cycle (seven, no repeats), threat effects, shielded reactors, Overcharge rewards, cycle credits, sector records, route untouched, quick test cycle');
`);
