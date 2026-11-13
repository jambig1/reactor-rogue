// v0.71 Hive Nebula: spore pods ripen into clouds unless shot, ships split, bosses attack cleanly.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
assert.equal(run("sectors.some(x=>x.id==='hive')&&sectorBossDefs.hive.length===3&&finalBossDefs.hive.name"),'THE OVERMIND');
fresh();run("s.sector='hive';state='play';s.enemies=[];s.t=20;s.hive={next:0,clouds:[]};hiveHazardUpdate(.016,false)");assert.equal(run('s.enemies.filter(e=>e.sporePod).length'),1);
run("var pod=s.enemies.find(e=>e.sporePod);pod.cloud='acid';pod.x=s.p.x;pod.y=s.p.y;s.hive.next=1e9;for(let i=0;i<330;i++)hiveHazardUpdate(1/60,false)");assert.equal(run('s.hive.clouds.length'),1,'ripe pod bursts');
run("s.p.inv=0;s.hive.clouds[0].tick=0;var hp0=s.p.hp;hiveHazardUpdate(.1,false)");assert(run('s.p.hp<hp0'),'acid cloud burns');
run("s.hive.clouds=[];var pod2=spawnSporePod(s.p.x+50,s.p.y);hit(pod2,1e9)");assert.equal(run('s.hive.clouds.length'),0,'shot pod is defused');
run("s.enemies=[];spawn(0);var e=s.enemies.at(-1);e.arrival=0;hit(e,1e9)");assert.equal(run('s.enemies.filter(x=>x.split&&x.hp>0).length'),2,'ship splits');
run("var kid=s.enemies.find(x=>x.split);hit(kid,1e9)");assert.equal(run('s.enemies.filter(x=>x.split&&x.hp>0).length'),1,'spawnlings do not split');
for(const i of [0,1,2]){run("s.enemies=[];s.hazards=[];s.hostile=[];s.sectorHazards=[];s.bossIndex="+i+";var b=spawnBoss();b.arrival=0");for(let k=0;k<400;k++)run("b.hp=b.max*("+(k>200?.4:1)+");sectorBossAttack(b,.05)");assert(run('s.hostile.length+s.sectorHazards.length')>0,'boss '+i+' fires')}
assert(run("s.enemies.filter(x=>x.systemOwner===b).length")>0,'hive mind links synapse nodes');assert.equal(run('enemyArmour(b)'),.6);
console.log('PASS Hive Nebula: pods burst or defuse, acid burns, ships split once, three bosses fire, hive mind shield links');
`);
