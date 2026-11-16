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
// Power-ups are retired in v1.0: no run effects, one-time refund, shop gone.
run("hangar.powerups={might:5,armor:3,hull:3};hangar.puSpent=300;hangar.credits=10;hangar.puRetired=0");
fresh();run("var hp0=s.pilot.hp;s.dev=null;applyPowerUps()");assert.equal(run('s.pilot.hp-hp0'),0);
run('retirePowerUps()');assert.equal(run('hangar.credits'),310);assert.deepEqual(run('JSON.stringify(hangar.powerups)'),'{}');
run('hangar.puSpent=300;retirePowerUps()');assert.equal(run('hangar.credits'),310,'refund only once');
console.log('powerups ok');
`);
