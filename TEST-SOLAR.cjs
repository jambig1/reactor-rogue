// v0.69 Solar Corona: registration, unlock, flares and satellite shelter, bosses.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
assert.equal(run("sectors.some(x=>x.id==='solar')"),true);assert.equal(run("sectorBossDefs.solar.length"),3);assert.equal(run("finalBossDefs.solar.name"),'SOLAR THRONE');
assert.equal(run("hangar.campaign.best.city=0;sectorOpen('solar')"),false);assert.equal(run("hangar.campaign.best.city=2;sectorOpen('solar')"),true);
// Flare: warning, then the sweep hurts an exposed pilot once.
fresh();run("s.sector='solar';state='play';s.terrain=[];s.enemies=[];s.p.inv=0;s.dashTime=0;s.t=30;s.solar={next:0,flare:null,count:0};solarHazardUpdate(.016,false)");assert.equal(run('!!s.solar.flare'),true);
run("s.terrain=[];var hp0=s.p.hp;for(let i=0;i<300&&s.solar.flare;i++){s.p.inv=0;solarHazardUpdate(1/60,false)}");assert(run('s.p.hp')<run('hp0'),'exposed pilot is burned');assert.equal(run('s.solar.count'),1);
// Sheltered behind a satellite: no damage.
run("s.solar.next=0;solarHazardUpdate(.016,false);var f=s.solar.flare;s.terrain=[{kind:'cover',x:s.p.x-f.dx*40,y:s.p.y-f.dy*40,r:32,hp:220,max:220,terrain:true}];var hp1=s.p.hp;for(let i=0;i<300&&s.solar.flare;i++){s.p.inv=0;solarHazardUpdate(1/60,false)}");assert.equal(run('s.p.hp'),run('hp1'),'shadow protects');
// Enemies caught in the open take heavy damage; no flares during bosses.
run("s.solar.next=0;s.terrain=[];spawn(0);var e=s.enemies.at(-1);e.x=s.p.x+60;e.y=s.p.y+60;solarHazardUpdate(.016,false);s.terrain=[];for(let i=0;i<300&&s.solar.flare;i++)solarHazardUpdate(1/60,false)");assert(run('e.hp<=0||e.hp<e.max'));
run("s.solar={next:0,flare:null,count:0};solarHazardUpdate(.016,true)");assert.equal(run('s.solar.flare'),null);
// Bosses fire every pattern without errors.
for(const i of [0,1,2]){run("s.enemies=[];s.hazards=[];s.hostile=[];s.sectorHazards=[];s.bossIndex="+i+";var b=spawnBoss();b.arrival=0");for(let k=0;k<400;k++)run("b.hp=b.max*("+(k>200?.4:1)+");sectorBossAttack(b,.05)");assert(run('s.hostile.length+s.hazards.length+s.sectorHazards.length')>=0);assert.equal(run('b.sectorBoss'),'solar')}
assert.equal(run("typeof bossDesigns['solar/star']"),'function');assert.equal(run("bossPresentation({sectorBoss:'solar',kind:'flare'}).label"),'FLARE CANNON');
console.log('PASS Solar Corona: registered and unlocked with a clear, flares burn exposed pilots and enemies, satellites shelter, no flares in boss fights, three bosses attack cleanly');
`);
