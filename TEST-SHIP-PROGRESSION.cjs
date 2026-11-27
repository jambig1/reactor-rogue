// v1.7 ship progression: named loadouts (save, load, missing parts, duplicate), collection and titles,
// and test flights (the real ship, but no rewards).
const fs=require('fs'),assert=require('assert');
function main(){
run(`hangar.ship=null;let ps=partState();for(let id of ['e_nova','w_phantom','m_siege','p_aegis','r_overload'])ps.owned[id]=1;for(let id of ['e_nova','w_phantom','m_siege','p_aegis','r_overload'])equipPart(id);hangar.campaign.rescued=['spectre'];shipState().crew=['spectre']`);
run(`shipState().loadouts=[{eq:{engine:'e_nova',wings:'w_stock',mount:'m_stock',plating:'p_stock'},paint:{hull:'#ff0000'},label:'Old one'},null,null]`);
assert.equal(run('shipLoadouts().length'),1,'old 3-slot loadouts migrate');assert.equal(run('shipLoadouts()[0].name'),'Old one');
assert(run('saveNewLoadout()'));assert.equal(run('shipLoadouts().length'),2);assert.equal(run('shipLoadouts()[1].eq.reactor'),'r_overload','reactor saved');assert.deepEqual(JSON.parse(run('JSON.stringify(shipLoadouts()[1].crew)')),['spectre'],'crew saved');
run(`for(let q of partSlots)equipPart(stockPart(q.id).id)`);assert.equal(run(`partState().eq.engine`),'e_stock');
let miss=JSON.parse(run('JSON.stringify(applyLoadout(1))'));assert.deepEqual(miss,[]);assert.equal(run('partState().eq.engine'),'e_nova');assert.equal(run('partState().eq.reactor'),'r_overload');
run(`delete partState().owned.m_siege`);miss=JSON.parse(run('JSON.stringify(applyLoadout(1))'));assert.deepEqual(miss,['Siege Battery'],'missing part reported');assert.notEqual(run('partState().eq.mount'),'m_siege','never equips a part you do not own');
for(let i=0;i<10;i++)run('saveNewLoadout()');assert.equal(run('shipLoadouts().length'),8,'capped at 8');console.log('PASS loadouts: migrate old, save parts+reactor+crew, load, report and skip missing parts, cap');
let pct=run('collectionPct()');assert(pct>0&&pct<100);run(`for(let d of shipParts)partState().owned[d.id]=1`);assert.equal(run('collectionPct()'),100);console.log('PASS collection completion');
run(`state='preflight';hangar.credits=500;shipState().xp=0`);assert(run(`startTestFlight('waves')`));assert(run('s.dev.test&&s.dev.sim'));assert.equal(run('s.pilot.parts.engine'),'e_nova','test flight uses your ship');assert(run('s.tree.sig.afterburn===1'),'signatures active in test flight');
run(`s.kills=300;s.bossKills=3;s.creditsRun=999;commitHangar('end')`);assert.equal(run('hangar.credits'),500,'no credits');assert.equal(run('shipState().xp'),0,'no ship XP');console.log('PASS test flight: your ship and signatures, no credits or XP');
run(`state='menu';s=null`);run(`start();s.partDrops=[{part:shipParts[3],fresh:true}];partRevealAfterRun()`);console.log('PASS reveal is safe without a DOM');
}
eval(fs.readFileSync(require('path').join(__dirname,'TEST-MENUS.cjs'),'utf8').split('\n').slice(0,5).join('\n')+'\n;('+main.toString()+')();');
