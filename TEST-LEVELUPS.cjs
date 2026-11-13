// v0.65 level-ups: immediate default, bank mode, auto-pick, slower curve.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
assert.equal(run('levelUpMode'),'immediate');
// Slower curve from level 3 on.
assert.equal(run('levelXPRequirement(1)'),5);assert(run('levelXPRequirement(10)')>=Math.floor((6+30+Math.pow(10,1.32)+.2*25)*1.5));
// Immediate: pauses as before.
fresh();run("s.need=levelXPRequirement(s.lv);state='play';s.xp=s.need;levelUp()");assert.equal(run('state'),'upgrade');
// Bank: no pause, levels bank, the button opens them one after another.
fresh();run("s.need=levelXPRequirement(s.lv);setLevelUpMode('bank');state='play';s.xp=s.need+levelXPRequirement(2)+1;levelUp()");assert.equal(run('state'),'play');assert.equal(run('s.levelBank'),2);assert.equal(run('s.lv'),3);
run('hud()');
assert.equal(run('openLevelBank()'),true);assert.equal(run('state'),'upgrade');assert.match(run("$('upTitle').textContent"),/1 more banked/);
run('choose(0)');assert.equal(run('state'),'upgrade','chains to the next banked choice');run('choose(0)');assert.equal(run('state'),'play');assert.equal(run('s.levelBank'),0);
// Auto-pick: never pauses, upgrades applied.
fresh();run("s.need=levelXPRequirement(s.lv);setLevelUpMode('auto');state='play';var n=Object.values(s.items).reduce((a,b)=>a+b,0);s.xp=s.need+levelXPRequirement(2)+levelXPRequirement(3)+1;levelUp()");assert.equal(run('state'),'play');assert.equal(run('s.levelBank'),0);assert.equal(run('Object.values(s.items).reduce((a,b)=>a+b,0)'),run('n')+3);
// Switching to immediate opens anything banked.
fresh();run("s.need=levelXPRequirement(s.lv);setLevelUpMode('bank');state='play';s.xp=s.need;levelUp();setLevelUpMode('immediate')");assert.equal(run('state'),'upgrade');
run("setLevelUpMode('immediate')");
console.log('PASS level-ups: immediate default, bank mode chains banked choices, auto-pick never pauses, slower curve');
`);
