// v1.7 skill tree: techniques (gameplay-changing nodes), mastery after the keystone, cheaper but safe refunds,
// and the technique mechanics themselves.
const fs=require('fs'),assert=require('assert');
function main(){
run(`hangar.ship=null;partState();shipState().pts=40;hangar.credits=2000`);
assert.equal(run(`buyShipNode('i_ghost')`),false,'techniques need 3 points in the branch');
run(`for(let i=0;i<3;i++)buyShipNode('i_thrust')`);assert(run(`buyShipNode('i_ghost')`));assert(run(`buyShipNode('i_tempo')`));
run(`for(let i=0;i<3;i++)buyShipNode('i_crit')`);assert(run(`buyShipNode('i_class')`));run(`buyShipNode('i_burn');buyShipNode('i_reflex')`);
assert.equal(run(`buyShipNode('i_mast')`),false,'mastery locked before the keystone');assert.equal(run(`nodeState(shipNodes.find(x=>x.id==='i_mast'))`),'needkey');
assert(run(`buyShipNode('i_spec','spectre')`));assert(run(`buyShipNode('i_key')`));
let sp0=JSON.parse(run(`JSON.stringify(Object.fromEntries(shipStatSheet().map(r=>[r.id,r.value])))`)).speed;
for(let i=0;i<5;i++)assert(run(`buyShipNode('i_mast')`),'mastery rank '+(i+1));assert.equal(run(`buyShipNode('i_mast')`),false,'mastery caps at 5');
let sp1=JSON.parse(run(`JSON.stringify(Object.fromEntries(shipStatSheet().map(r=>[r.id,r.value])))`)).speed;assert(sp1>sp0,'mastery shows in the stats sheet');
console.log('PASS techniques gated at 3 points, mastery after the keystone (5 ranks) and reflected in stats');
// Refunds: first free, later min(400, 25/point); every point comes back, never more.
let spent=run('shipSpent()'),pts=run('shipState().pts'),total=spent+pts;assert.equal(run('respecCost()'),0,'first refund free');assert(run('respecShip()'));assert.equal(run('shipState().pts'),total,'all points back');assert.equal(run('shipSpent()'),0);
run(`for(let i=0;i<3;i++)buyShipNode('j_hull')`);assert.equal(run('respecCost()'),75,'later refunds cost 25 per point');run(`shipState().pts+=30;for(let i=0;i<3;i++)buyShipNode('j_armour');buyShipNode('j_unbreak');buyShipNode('j_mom');buyShipNode('j_class');buyShipNode('j_shield');buyShipNode('j_spikes');buyShipNode('j_spec','sovereign');buyShipNode('j_key');for(let i=0;i<5;i++)buyShipNode('j_mast')`);
assert.equal(run('respecCost()'),400,'capped at 400');let c=run('hangar.credits');total=run('shipSpent()+shipState().pts');assert(run('respecShip()'));assert.equal(run('hangar.credits'),c-400);assert.equal(run('shipState().pts'),total,'no points lost or duplicated');
assert.equal(run('respecShip()'),false,'nothing to refund');console.log('PASS refunds: first free, then 25/point capped at 400, exact point totals');
// Mechanics.
run(`shipState().pts=40;for(let i=0;i<3;i++)buyShipNode('j_hull');buyShipNode('j_unbreak');state='menu';s=null;start()`);
run(`s.p.hp=5;s.p.inv=0;s.p.shield=0;hurtPlayer(500)`);assert.equal(run('s.p.hp'),1,'Unbreakable leaves 1 hull');assert(run('s.p.inv>=2'));run(`s.p.inv=0;hurtPlayer(500)`);assert(run('s.p.hp<=0'),'only once per 60 s');
run(`state='menu';s=null;respecShip();shipState().pts=40;for(let i=0;i<3;i++)buyShipNode('i_thrust');buyShipNode('i_tempo');for(let i=0;i<3;i++)buyShipNode('g_dmg');buyShipNode('g_focus');buyShipNode('c_magnet');buyShipNode('c_magnet');buyShipNode('c_magnet');buyShipNode('c_recycle');start()`);
run(`for(let i=0;i<4;i++)sigOnDash()`);assert(Math.abs(run(`sigDamageMult('bolt','',null)`)-1.24)<1e-9,'Tempo stacks to 3 (+24%)');
run(`sigState().tempoT=0;let e={hp:100,x:0,y:0};for(let i=0;i<7;i++)sigDamageMult('bolt','',e);globalThis.__e=e`);assert(Math.abs(run(`sigDamageMult('bolt','',__e)`)-1.2)<1e-9,'Focus Fire caps at +20% on one target');
run(`s.p.hp=10;for(let i=0;i<15;i++)sigOnKill({})`);assert(run('s.p.hp')>=15,'Recycler repairs 5 hull per 15 kills');
console.log('PASS techniques in play: Unbreakable once per 60 s, Tempo stacks, Focus Fire caps, Recycler repairs');
run(`state='menu';s=null`);}
eval(fs.readFileSync(require('path').join(__dirname,'TEST-MENUS.cjs'),'utf8').split('\n').slice(0,5).join('\n')+'\n;('+main.toString()+')();');
