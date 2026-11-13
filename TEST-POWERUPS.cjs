// v0.83 permanent power-ups shop.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
run("hangar.powerups={};hangar.puSpent=0;hangar.credits=0");
assert.equal(run("puPrice('might')"),100);assert.equal(run("buyPowerUp('might')"),false,'no credits');
run("hangar.credits=100000");assert.equal(run("buyPowerUp('might')"),true);assert.equal(run("puLevel('might')"),1);
assert.equal(run("puPrice('might')"),Math.round(100*2*1.1),'rank and owned-ranks both raise price');
assert.equal(run("puPrice('armor')"),Math.round(60*1*1.1));
for(let i=0;i<10;i++)run("buyPowerUp('might')");assert.equal(run("puLevel('might')"),5,'capped at max');
run("var before=hangar.credits+hangar.puSpent;refundPowerUps()");assert.equal(run('hangar.credits'),run('before'));assert.equal(run("puLevel('might')"),0);
// Saved and reloaded.
run("buyPowerUp('greed');buyPowerUp('hull')");assert.equal(run("loadHangar().powerups.greed"),1);
// Effects apply at run start (not in developer test runs).
run("hangar.powerups={might:5,armor:3,hull:3,recovery:5,cooldown:2,area:2,velocity:2,thrust:2,magnet:2,growth:5,greed:5,luck:3,revival:1}");
fresh();run("var hp0=s.pilot.hp,sp0=s.pilot.speed,ar0=s.pilot.armour||0,fr0=s.pilot.fireRate||1;s.dev=null;applyPowerUps()");
assert.equal(run('s.pilot.hp-hp0'),30);assert.equal(run('s.pilot.armour-ar0'),3);assert(Math.abs(run('s.pilot.speed/sp0')-1.1)<1e-9);assert(Math.abs(run('s.pilot.fireRate/fr0')-.95)<1e-9);
assert(Math.abs(run('s.pu.might')-1.25)<1e-9);assert(Math.abs(run('areaMult()')-(1.1+.12*run("support('area')")))<1e-9);assert.equal(run('s.puRevives'),1);
// Revival saves you once.
run("s.p.inv=0;s.dashTime=0;s.p.shield=0;s.p.hp=1;hurtPlayer(500)");assert.equal(run("state==='end'"),false);assert(run('s.p.hp')>0);assert.equal(run('s.puRevives'),0);
// Shop renders.
run("hangarTab='powerups';openHangar()");assert(run('powerUpShop()').includes('Refund all'));assert(run('powerUpShop()').includes('Might'));
console.log('powerups ok');
`);
