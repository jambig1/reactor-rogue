// v0.60 quick tests, test links, remembered developer unlock and run-log causes.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
run("hangar.blueprints={};hangar.mastery={};saveHangar()");
const snap=()=>run('JSON.stringify({credits:hangar.credits,bp:hangar.blueprints,mastery:hangar.mastery,runs:archive.runs.length,board:archive.board.length})');
let before=snap();
// Weapon showcase: one weapon at level 5, optional evolution, invulnerable, enemy ring, playing at once.
assert.equal(run("quickTest('weapon','gravity',true,{pilot:'vanguard',sector:'grid'})"),true);
assert.equal(run('s.dev.test'),true);assert.equal(run('s.dev.god'),true);assert.equal(run('state'),'play');
assert.deepEqual(JSON.parse(run('JSON.stringify(s.items)')),{gravity:5});assert.equal(run('!!s.evolved.gravity'),true);assert(run('s.enemies.length')>=18);
assert.equal(run("quickTest('weapon','not-a-weapon',false)"),false);assert.equal(run("quickTest('nope','bolt',false)"),false);
// Boss fight: late-run build and an active sector boss.
run("quickTest('boss','',false,{pilot:'vanguard',sector:'grid'})");assert.equal(run('s.enemies.some(e=>e.boss&&e.hp>0)'),true);assert.equal(run('s.items.bolt'),5);assert.equal(run('s.dev.god'),false);
// Swarm: evolved build, eight minutes in, large crowd, invulnerable.
run("quickTest('swarm','',true)");assert.equal(run('s.t'),480);assert(run('s.enemies.length')>=60);assert.equal(run('Object.keys(s.evolved).length')>=3,true);
// Endless: completed run continuing into endless.
run("quickTest('endless','',true)");assert.equal(run('s.endless'),true);assert.equal(run('state'),'play');
// None of these runs can bank anything, even when they end.
run("awardBlueprint('boss');s.t=900;s.bossKills=3;finish(false)");assert.equal(snap(),before,'quick tests never change credits, blueprints, mastery or records');
// Links.
assert.equal(run("quickTestLink('weapon','gravity',true,'vanguard','storm')"),'index.html?play=1&test=weapon:gravity:evo&ship=vanguard&sector=storm');
assert.equal(run("quickTestLink('boss','bolt',false,'','')"),'index.html?play=1&test=boss');
// Run log: cause of defeat in normal runs.
fresh();run("s.runID='cause';spawn(1);var e=s.enemies.at(-1);s.p.inv=0;s.dashTime=0;hurtPlayer(5,e)");assert.equal(run("describeHit(s.lastHitBy)"),'Interceptor');
assert.equal(run("describeHit({boss:true,name:'Reaper Engine'})"),'Reaper Engine');assert.equal(run("describeHit({kind:'storm',x:0,y:0})"),'Storm strike');assert.equal(run("describeHit({x:0,y:0,d:18,life:2})"),'Enemy fire');assert.equal(run('describeHit(null)'),'');
assert.equal(run("snapshotRun('defeated').cause"),'Interceptor');assert.equal(run("snapshotRun('victory').cause"),'');
assert.equal(run("escapeHTML('<b>&\\"')"),'&lt;b&gt;&amp;&quot;');
// Remembered developer unlock.
run("devRemember(true)");assert.equal(run('devRemembered()'),true);run("devRemember(false)");assert.equal(run('devRemembered()'),false);
console.log('PASS quick tests (weapon showcase, boss, swarm, endless) start as test runs that bank nothing, invalid inputs refused, test links, defeat causes in the run log, escaping and remembered developer unlock');
`);
