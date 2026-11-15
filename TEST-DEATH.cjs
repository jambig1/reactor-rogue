// v0.86 death explosion: freeze, explode, then results.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();run("state='play';s.dev=null;s.p.inv=0;s.dashTime=0;s.p.shield=0;s.p.hp=3;hurtPlayer(500)");
assert.equal(run('state'),'play','still playing while the ship explodes');assert(run('!!s.dying'));assert.equal(run('s.p.hp'),0);
run("let hp0=s.p.hp;hurtPlayer(500)");assert.equal(run('s.dying.t'),0,'no more hits while dying');
run("drawDeath();deathTick(1)");assert.equal(run('state'),'play');run("drawDeath();drawDeathFade();deathTick(1.3)");assert.equal(run('state'),'end');
console.log('death ok');
`);
