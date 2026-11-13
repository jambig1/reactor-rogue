// v0.60 final encounter: queued after the third reactor, destructible systems, three phases, victory only after it falls.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();run("s.runID='final-test';state='play'");
// Third reactor: no longer ends the route; it queues the final encounter.
run("s.bossIndex=2;s.bossKills=2;var b=spawnBoss();b.arrival=0;hit(b,1e9)");
assert.equal(run('s.bossKills'),3);assert.equal(run('s.finalEncounter.stage'),'approach');assert.equal(run('!!s.finalClearPending'),false);assert.equal(run('s.mutationPending>0'),true);
run("s.mutationPending=0;state='play'");assert.equal(run('resolveFinalClear()'),false);assert.equal(run('!!s.completed'),false);
assert.match(run('runObjective()'),/^FINAL ENCOUNTER · /);assert.equal(run('merchantConnectionSafe()'),false);
// Arrival after the approach window.
run("s.enemies=[];s.t=s.finalEncounter.at-11;updateFinalEncounter()");assert.equal(run('s.finalEncounter.warned'),true);assert.equal(run('!!finalBoss()'),false);
run("s.t=s.finalEncounter.at;updateFinalEncounter()");assert.equal(run('s.finalEncounter.stage'),'active');
run("var f=finalBoss()");assert.equal(run('f.name'),'OMEGA REACTOR');assert.equal(run("s.enemies.filter(p=>p.systemOwner===f).map(p=>p.system).sort().join()"),'cannon,cannon,shield,shield');
assert.equal(run('spawnFinalBoss()'),null,'only one final boss at a time');
// Shielded core takes reduced damage until both shield systems fall.
assert.equal(run('enemyArmour(f)'),.6);run("f.arrival=0;for(let p of s.enemies)if(p.systemOwner===f)p.arrival=0");
run("for(let p of s.enemies.filter(p=>p.systemOwner===f&&p.system==='shield'))hit(p,1e9);finalBossAttack(f,.016)");
assert.equal(run('f.shielded'),false);assert.equal(run('enemyArmour(f)'),.15);
// Systems follow the core.
run("f.x+=100;finalBossAttack(f,.016)");assert.equal(run("s.enemies.filter(p=>p.systemOwner===f&&p.hp>0).every(p=>Math.abs(Math.hypot(p.x-f.x,p.y-f.y)-p.orbit)<1)"),true);
// Phase II: fresh systems with a shield and two lances.
run("f.hp=f.max*.6;finalBossAttack(f,.016)");assert.equal(run('f.phase'),2);assert.equal(run("s.enemies.filter(p=>p.systemOwner===f&&p.hp>0).map(p=>p.system).sort().join()"),'lance,lance,shield');assert.equal(run('f.shielded'),true);
// Pods and core fire with telegraphs and never throw.
run("s.hostile=[];s.hazards=[];for(let i=0;i<300;i++){s.t+=.05;finalBossAttack(f,.05);for(let p of s.enemies)if(p.systemOwner===f&&p.hp>0){p.arrival=0;enemyAttack(p,.05)}}");
assert(run('s.hostile.length')>0,'core fires');assert.equal(run("s.enemies.some(p=>p.systemOwner===f&&p.system==='lance'&&p.podCD!==undefined)"),true);
// Phase III: meltdown, no systems, cross beams.
run("f.hp=f.max*.29;finalBossAttack(f,.016)");assert.equal(run('f.phase'),3);assert.equal(run("s.enemies.filter(p=>p.systemOwner===f&&p.hp>0).length"),0);assert.equal(run('f.shielded'),false);
run("s.hazards=[];var crossed=false;for(let i=0;i<400&&!crossed;i++){s.t+=.05;finalBossAttack(f,.05);crossed=s.hazards.length>=2}");assert.equal(run('crossed'),true,'phase III fires cross beams');
// Drawing paths run.
run("let p=s.enemies.find(p=>p.systemOwner)||{systemOwner:f,system:'lance',r:19,hp:5,max:10,c:f.c,podCharge:.5,podAim:1,x:0,y:0};f.charge=.6;for(let k of ['ring','fan','spiral','cross']){f.attack=k;drawFinalWarnings(f)}drawFinalBoss(f,1);drawFinalSystem(p,1);hud()");
// Defeat: short pause, then a sector clear.
run("hit(f,1e9)");assert.equal(run('s.finalEncounter.stage'),'done');assert.equal(run('s.finalClearPending'),true);assert.equal(run('resolveFinalClear()'),false,'pause before the clear');
assert.equal(run("s.enemies.filter(e=>e.hp>0).length"),0);assert.equal(run('s.mutationPending'),0);
assert.equal(run("typeof snapshotRun('victory').finalTime"),'number');
run("s.t=s.finalClearAt+.1");assert.equal(run('resolveFinalClear()'),true);assert.equal(run('s.completed'),true);assert.equal(run('state'),'end');
// Quick test and test link.
assert.equal(run("quickTest('final','',true,{sector:'storm'})"),true);assert.equal(run('finalBoss().name'),'HEART OF THE STORM');assert.equal(run('s.dev.test'),true);
assert.equal(run("quickTestLink('final','bolt',false,'','')"),'index.html?play=1&test=final');
console.log('PASS final encounter: queued after the third reactor, shield systems gate the core, three phases, systems follow the core, telegraphed attacks, pause then sector clear, quick test');
`);
