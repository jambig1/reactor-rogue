// Ship equipment foundations (v1.7): the stats sheet shown in the hangar must equal what a run actually gets,
// old saves migrate without losing anything, signatures reach gameplay, and drops respect sources and pity.
const fs=require('fs'),assert=require('assert');
function main(){
const near=(a,b,m)=>assert(Math.abs(a-b)<1e-6,m+': sheet '+b+' vs run '+a);
// 1. v1 save that owns and equips the old Reactor module, with an upgraded rare part.
run(`hangar.owned=[...(hangar.owned||[]),'collector','overdrive'];hangar.module='collector';hangar.ship={v:1,xp:0,lvl:6,pts:0,nodes:{j_hull:2,i_crit:1},cls:'',spec:'',parts:{owned:{e_stock:1,w_stock:1,m_stock:1,p_stock:1,e_twin:1,p_heavy:1},eq:{engine:'e_twin',wings:'w_stock',mount:'m_stock',plating:'p_heavy'},lv:{e_twin:3}}};hangar.campaign.rescued=['bastion','spectre'];hangar.ship.crew=['bastion','spectre'];`);
let ps=JSON.parse(run('JSON.stringify(partState())'));
assert.equal(ps.v,2);assert.equal(ps.eq.reactor,'r_survey','equipped Reactor module becomes the equipped reactor');assert(ps.owned.r_hot&&ps.owned.r_survey,'owned modules become owned reactors');
assert.equal(ps.eq.engine,'e_twin');assert.equal(ps.lv.e_twin,3,'upgrade levels kept');assert(ps.owned.p_heavy,'parts kept');assert.equal(run('hangar.module'),'none','old module retired so it is not applied twice');
assert(run('!!hangar.ship.partsV1'),'v1 parts snapshot kept');console.log('PASS v1 save migrates: parts, equips, levels kept; Reactor module becomes the reactor slot');
// 2. Sheet == run, for several builds.
for(let eq of [{},{engine:'e_nova',wings:'w_phantom',mount:'m_siege',plating:'p_aegis',reactor:'r_overload'},{engine:'e_fusion',plating:'p_light',mount:'m_heavy',reactor:'r_hot'}]){
 run(`for(let d of shipParts)partState().owned[d.id]=1;for(let [k,v] of Object.entries(${JSON.stringify(eq)}))equipPart(v);`);
 let sheet=JSON.parse(run('JSON.stringify(Object.fromEntries(shipStatSheet().map(r=>[r.id,r.value])))'));
 run('state="menu";s=null;start()');
 let got=JSON.parse(run(`JSON.stringify({hull:s.pilot.hp,armour:s.pilot.armour,speed:s.pilot.speed,dashCd:abilityState().cd*s.tree.dashCd,crit:.05+s.tree.crit,wslots:s.slots.weapon,pslots:s.slots.support,taken:s.tree.taken,regen:s.pilot.regen||0,module:s.module})`));
 near(got.hull,sheet.hull,'hull '+JSON.stringify(eq));near(got.armour,sheet.armour,'armour');assert(Math.abs(got.speed-sheet.speed)<1,'speed '+got.speed+' vs '+sheet.speed);near(got.dashCd,sheet.dashCd,'dash recharge');near(got.crit,sheet.crit,'crit');near(got.wslots,sheet.wslots,'weapon slots');near(got.pslots,sheet.pslots,'passive slots');near(got.taken,sheet.taken,'damage taken');near(got.regen,sheet.regen,'regen');
 if(eq.reactor==='r_hot')assert.equal(got.module,'overdrive','reactor drives the old module hooks');
}
console.log('PASS hangar stats sheet equals the stats a run starts with (3 builds incl. skills, crew, every slot)');
// 3. Comparison shows drawbacks, not just gains.
run(`equipPart('e_stock')`);let cmp=JSON.parse(run(`JSON.stringify(partComparison('e_nova'))`));
assert(cmp.some(r=>r.id==='hull'&&!r.better),'Nova Afterburner comparison shows the hull loss');assert(cmp.some(r=>r.id==='speed'&&r.better));console.log('PASS comparison lists gains and losses');
// 4. Signatures reach gameplay.
run(`for(let [k,v] of Object.entries({mount:'m_solarfang',plating:'p_titan'}))equipPart(v);state="menu";s=null;start()`);
assert.equal(run(`s.tree.sig.solarFang`),1);assert(Math.abs(run(`sigDamageMult('laser')`)-1.3)<1e-9,'thermal weapon boosted');assert(Math.abs(run(`sigDamageMult('bolt')`)-.9)<1e-9,'other weapon reduced');
run(`s.enemies=[];for(let i=0;i<3;i++)s.enemies.push({x:s.p.x+20*i,y:s.p.y,hp:10})`);assert(Math.abs(run('sigTakenMult()')-.88)<1e-9,'Bulwark: 3 close enemies = 12% less damage');
run(`state="menu";s=null;s=null`);console.log('PASS signatures: Solar Fang damage split, Bulwark damage reduction');
// 5. Drops: exotics only from their sector, pity guarantees one; outpost never sells them.
run(`let ps=partState();for(let d of shipParts)if(d.r>0)delete ps.owned[d.id];ps.pity={}`);
for(let i=0;i<200;i++){let src=run(`rollPartDrop(3,'grid').src`);assert.equal(src,'any','no exotic from a sector without one')}
let got6=false;for(let i=0;i<6;i++)if(run(`rollPartDrop(3,'ghost').id`)==='e_phantom'){got6=true;break}assert(got6,'Phantom Drive within 6 Ghost boss kills');
for(let i=0;i<40;i++){let st=JSON.parse(run(`hangar.outpost=null;JSON.stringify(outpostState().stock)`));assert.equal(st.length,3,'outpost always stocks 3 parts');for(let id of st)assert.equal(run(`shipParts.find(x=>x.id===${JSON.stringify(id)}).src`),'any','outpost never sells sector parts')}console.log('PASS drops: sector exotics only from their sector, pity guarantees them, never sold');
}
// Reuse the TEST-MENUS boot (DOM stubs + run()); main runs in the same scope so it can call run().
eval(fs.readFileSync(require('path').join(__dirname,'TEST-MENUS.cjs'),'utf8').split('\n').slice(0,5).join('\n')+'\n;('+main.toString()+')();');
