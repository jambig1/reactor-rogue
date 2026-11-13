// v0.82 campaign: sector chain and stranded-pilot rescue pods.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
// Chain order and unlock rule: 2 bosses in the previous sector.
assert.equal(run('sectorChain.length'),10);assert.equal(run('sectorChain.every(id=>sectors.some(x=>x.id===id))'),true);
run("hangar.claimed=[];hangar.campaign={v:1,open:[],rescued:[],best:{}}");
assert(run("sectorOpen('grid')"));assert(!run("sectorOpen('belt')"));assert(!run("sectorOpen('ghost')"));
run("hangar.campaign.best.grid=1");assert(!run("sectorOpen('belt')"));run("hangar.campaign.best.grid=2");assert(run("sectorOpen('belt')"));assert(!run("sectorOpen('storm')"));
assert(run("sectorLockText('storm')").includes('Shattered Belt'));
// Boss hook opens the next sector and announces it; dev runs never do.
fresh();run("hangar.campaign={v:1,open:[],rescued:[],best:{}};s.dev=null;s.sector='belt';s.bossKills=2;s.blueprintQueue=[];campaignBoss()");
assert(run("sectorOpen('storm')"));assert(run("hangar.campaign.open.includes('storm')"));assert(run("s.blueprintQueue[0].text").includes('STORM RELAY'));
fresh();run("hangar.campaign={v:1,open:[],rescued:[],best:{}};s.dev={test:true};s.sector='belt';s.bossKills=2;campaignBoss()");assert(!run("sectorOpen('storm')"));
// Migration keeps everything an existing player had.
run("hangar.campaign=undefined;hangar.claimed=['win','firstBoss'];hangar.ships=['vanguard','glacier'];hangar.progress.maxTime=400;campaignInit()");
assert(run("sectorOpen('ghost')&&sectorOpen('city')"));assert(run("hangar.campaign.rescued.includes('glacier')"));assert(run("hangar.campaign.rescued.includes('harrier')"),'old harrier challenge met');assert(!run("hangar.campaign.rescued.includes('bastion')"));
// Every pod ship is unlocked by rescue only.
assert.equal(run('Object.keys(pilotPods).length'),10);
for(let id of run('Object.values(pilotPods)')){run("hangar.campaign.rescued=[]");assert(!run("shipReady('"+id+"')"));run("hangar.campaign.rescued=['"+id+"']");assert(run("shipReady('"+id+"')"))}
// Pod appears at 2:00 in a sector with a lost pilot, rescue needs 3s inside the ring.
fresh();run("hangar.campaign={v:1,open:[],rescued:[],best:{}};hangar.ships=['vanguard'];s.dev=null;s.sector='grid';s.t=119;updatePilotPod(.1)");assert.equal(run('!!s.pod'),false);
run("s.t=121;updatePilotPod(.1)");assert.equal(run('s.pod.id'),'harrier');assert(run('dist(s.p,s.pod)')>700);
run("updatePilotPod(5)");assert.equal(run('s.pod.status'),'lost','too far away');
run("s.p.x=s.pod.x;s.p.y=s.pod.y;updatePilotPod(1.5);updatePilotPod(1.6)");assert.equal(run('s.pod.status'),'rescued');assert(run("hangar.campaign.rescued.includes('harrier')"));assert(run("shipReady('harrier')"));
// No pod once rescued, or for an owned ship.
fresh();run("s.dev=null;s.sector='grid';s.t=130;updatePilotPod(.1)");assert.equal(run('!!s.pod'),false);
fresh();run("hangar.campaign.rescued=[];hangar.ships.push('bastion');s.dev=null;s.sector='belt';s.t=130;updatePilotPod(.1)");assert.equal(run('!!s.pod'),false);
// Draw does not throw in either state.
fresh();run("hangar.campaign.rescued=[];hangar.ships=['vanguard'];s.sector='storm';s.t=130;updatePilotPod(.1);drawPilotPod();s.pod.status='rescued';drawPilotPod()");
console.log('campaign ok');
`);
