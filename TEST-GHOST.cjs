// v0.72 Ghost Fleet Graveyard: derelict turrets wake and fire, bosses attack, the Admiral's gun decks shield it.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
assert.equal(run("sectors.some(x=>x.id==='ghost')&&sectorBossDefs.ghost.length===3&&finalBossDefs.ghost.name"),'THE PHANTOM ARMADA');
fresh();run("s.sector='ghost';state='play';s.enemies=[];s.terrain=[];s.t=20;s.ghost={next:0};ghostHazardUpdate(.016,false)");assert.equal(run('s.enemies.filter(e=>e.wreckTurret).length'),1);
run("var tu=s.enemies.find(e=>e.wreckTurret);tu.x=s.p.x+200;tu.y=s.p.y;s.hostile=[];for(let i=0;i<300;i++)enemyAttack(tu,1/60)");assert(run('s.hostile.length')>0,'turret fires after waking');
run("ghostHazardUpdate(.016,true)");assert.equal(run('s.enemies.filter(e=>e.wreckTurret).length'),1,'no new turrets in boss fights');
for(const i of [0,1,2]){run("s.enemies=[];s.hazards=[];s.hostile=[];s.sectorHazards=[];s.bossIndex="+i+";var b=spawnBoss();b.arrival=0");for(let k=0;k<400;k++)run("b.hp=b.max*("+(k>200?.4:1)+");sectorBossAttack(b,.05)");assert(run('s.hostile.length')>0,'boss '+i+' fires')}
assert(run("s.enemies.filter(x=>x.systemOwner===b&&x.hp>0).length")>0,'admiral gun decks');assert.equal(run('enemyArmour(b)'),.6);
run("for(let q of s.enemies)if(q.systemOwner===b){q.arrival=0;hit(q,1e12)}sectorBossAttack(b,.016)");assert.equal(run('enemyArmour(b)'),.2);
console.log('PASS Ghost Fleet: turrets wake on wrecks and fire, none during bosses, three bosses fire, gun decks shield the Admiral');
`);
