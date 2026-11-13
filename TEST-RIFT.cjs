// v0.70 Abyssal Rift: gravity wells pull the pilot and crush enemies; bosses attack cleanly.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
assert.equal(run("sectors.some(x=>x.id==='rift')&&sectorBossDefs.rift.length===3&&finalBossDefs.rift.name"),'THE SINGULARITY');
fresh();run("s.sector='rift';state='play';s.enemies=[];s.t=20;s.rift={wells:[],next:0};riftHazardUpdate(.016,false)");assert.equal(run('s.rift.wells.length'),1);
run("var w=s.rift.wells[0];w.vx=w.vy=0;w.warn=0;s.p.x=w.x+150;s.p.y=w.y;var x0=s.p.x;for(let i=0;i<30;i++)riftHazardUpdate(1/60,false)");assert(run('s.p.x<x0'),'pilot pulled in');
run("spawn(0);var e=s.enemies.at(-1);e.x=w.x+10;e.y=w.y;e.hp=e.max;for(let i=0;i<120;i++)riftHazardUpdate(1/60,false)");assert(run('e.hp<e.max'),'enemy crushed');
run("riftHazardUpdate(.016,true)");assert(run('w.life<=1.5'),'wells fade in boss fights');
for(const i of [0,1,2]){run("s.enemies=[];s.hazards=[];s.hostile=[];s.sectorHazards=[];s.bossIndex="+i+";var b=spawnBoss();b.arrival=0");for(let k=0;k<400;k++)run("b.hp=b.max*("+(k>200?.4:1)+");sectorBossAttack(b,.05)");assert(run('s.hostile.length+s.sectorHazards.length')>0,'boss '+i+' fires');assert.equal(run('b.sectorBoss'),'rift')}
console.log('PASS Abyssal Rift: wells pull the pilot, crush enemies, fade for bosses; three bosses fire');
`);
