// v0.58 blueprints and ship mastery: drops without RNG, damage scaling, dev isolation, banking,
// mastery XP/ranks/paints/reroll perk, save sanitising and backups.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
const tiers=()=>JSON.parse(run('JSON.stringify(hangar.blueprints)'));
// Fresh profile: no blueprints, no damage change.
run('hangar.blueprints={};hangar.mastery={};hangar.shipPaint={};saveHangar()');fresh();
assert.equal(run('s.blueprintMult'),null);assert.equal(run("blueprintScale('bolt','bolt')"),1);
// Choice: lowest tier first, then most damage this run; no Math.random use.
run("s.runID='t1';s.items={bolt:3,laser:2};s.weaponStats={bolt:{damage:100},laser:{damage:500}};Math.random=()=>{throw Error('blueprints must not use RNG')}");
run("awardBlueprint('boss')");assert.deepEqual(tiers(),{laser:1});
run("awardBlueprint('boss')");assert.deepEqual(tiers(),{laser:1,bolt:1});
run("awardBlueprint('elite')");assert.deepEqual(tiers(),{laser:2,bolt:1},'tie on tier resolved by damage');
assert.equal(run('s.blueprintQueue.length'),3);assert.match(run('s.blueprintQueue[0].text'),/PULSE LASER MK I|MK I/);
assert.equal(run('s.blueprintsFound.length'),3);
// Damage: laser now x1.2 in actual hits.
run("Math.random=()=>.99;spawn(0);var t=s.enemies.at(-1);t.hp=t.max=1e6;t.armour=0;t.arrival=0;var base=enemyDamage(t,100,false,'laser','laser');hit(t,100,'laser','laser')");
assert(Math.abs(run('1e6-t.hp')-run('base')*1.2)<1e-6,'tier 2 adds 20% to real damage');
assert.equal(run("blueprintScale('bolt','bolt')"),1.1);
// Elite counter: every sixth heavy (non-boss) kill.
run("s.eliteBlueprintCount=5;spawn(0);var el=s.enemies.at(-1);el.type=3;el.boss=false;el.hp=1;el.arrival=0;hit(el,1e6,'bolt','bolt')");
assert.deepEqual(tiers(),{laser:2,bolt:2},'sixth elite kill banks a blueprint');
// Developer test runs never bank.
run("s.dev={test:true};awardBlueprint('boss')");assert.deepEqual(tiers(),{laser:2,bolt:2});run('s.dev=null');
// Weapons outside the build when the build is maxed; then credits.
run("hangar.blueprints={};for(let d of defs)if(d.kind==='weapon')hangar.blueprints[d.id]=3;delete hangar.blueprints.rail;s.items={bolt:1}");
run("awardBlueprint('boss')");assert.equal(tiers().rail,1,'rotates to an unmaxed weapon outside the build');
run("hangar.blueprints.rail=3;var before=hangar.credits;awardBlueprint('boss')");assert.equal(run('hangar.credits-before'),60);
// Banking survives a reload (sanitised) and backups.
run("hangar.blueprints={bolt:2,rail:9,bad_key:1,'<x>':2,frost:-4};hangar.mastery={vanguard:600,BAD:5,wasp:-3};hangar.shipPaint={vanguard:'ember',wasp:'neon'};saveHangar();hangar=loadHangar()");
assert.deepEqual(tiers(),{bolt:2,rail:3,frost:0});assert.deepEqual(JSON.parse(run('JSON.stringify(hangar.mastery)')),{vanguard:600,wasp:0});assert.deepEqual(JSON.parse(run('JSON.stringify(hangar.shipPaint)')),{vanguard:'ember'});
assert.equal(run('createSaveBackup().progress.rr_hangar.blueprints.bolt'),2);
// Mastery: XP from time, bosses and clears, banked once.
run("hangar.mastery={};hangar.shipPaint={};saveHangar()");fresh('vanguard');
run("s.runID='m1';s.t=600;s.bossKills=3;s.completed=true;commitHangar('victory');commitHangar('victory')");
assert.equal(run("hangar.mastery.vanguard"),950,'600s + 3 bosses + clear, counted once');assert.equal(run("masteryRank('vanguard')"),2);
run("hangarAction('shipPaint','vanguard:violet')");assert.equal(run("hangar.shipPaint.vanguard"),undefined,'locked paint refused');
run("hangarAction('shipPaint','vanguard:ember')");assert.equal(run("hangar.shipPaint.vanguard"),'ember');
fresh('vanguard');assert.equal(run('s.pilot.color'),'#ff9a6b','mastery paint applied at run start');
let rerolls=run('s.rerolls');run("hangar.mastery.vanguard=5000;saveHangar()");fresh('vanguard');assert.equal(run('s.rerolls'),rerolls+1,'rank 5 adds one reroll');
assert.match(run("masteryBlock('vanguard')"),/RANK 5 \\/ 5/);
run("s.blueprintsFound=[{id:'bolt',tier:2,reason:'boss'}];s.masteryXPBefore=4000;s.masteryRankBefore=4");assert.match(run('progressDebrief()'),/RANK UP/);
run("s.dev={test:true}");assert.equal(run('progressDebrief()'),'');
console.log('PASS blueprint choice without RNG, tiered damage in real hits, sixth-elite drops, developer isolation, unbuilt-weapon rotation and credit salvage, sanitised save/reload/backup, mastery XP once per run, ranks, paint locks/application, rank-5 reroll and debrief');
`);
