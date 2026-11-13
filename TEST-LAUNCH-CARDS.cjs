// v0.76 launch cards: dealt after launch, one per run, each card's rule.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
// Dealt once, three distinct cards, pauses play; test runs never get one.
fresh();run("state='play';s.dev=null;s.launchCard=undefined");assert.equal(run('openLaunchCards()'),true);assert.equal(run('state'),'launchCard');
assert.equal(run('launchCardHand.length'),3);assert.equal(run('new Set(launchCardHand.map(c=>c.id)).size'),3);
run("var id=launchCardHand[1].id;chooseLaunchCard(1)");assert.equal(run('state'),'play');assert.equal(run('s.launchCard'),run('id'));assert.equal(run('openLaunchCards()'),false,'only once per run');
fresh();run("state='play';s.dev=null;s.launchCard=undefined;openLaunchCards();chooseLaunchCard(-1)");assert.equal(run('s.launchCard'),null);assert.equal(run('state'),'play');
fresh();run("state='play';s.dev={test:true}");assert.equal(run('openLaunchCards()'),false);
// Every card is reachable when dealing.
run("var seen=new Set;for(let i=0;i<400;i++){let h=(Date.now=()=>i*7919)&&dealLaunchCards();h.forEach(c=>seen.add(c.id))}");assert.equal(run('seen.size'),run('launchCards.length'));
// Rules.
fresh();run("var base=maxHP();s.launchCard='glass'");assert.equal(run('maxHP()'),Math.round(run('base')*.6));
run("s.p.hp=1;spawn(0);var e=s.enemies.at(-1);var g=enemyDamage(e,10,false,'bolt','bolt');s.launchCard=null;var n=enemyDamage(e,10,false,'bolt','bolt')");assert(Math.abs(run('g/n')-1.45)<1e-9);
run("s.launchCard='iron'");assert.equal(run('maxHP()'),run('base')+60);assert(Math.abs(run("enemyDamage(e,10,false,'bolt','bolt')/n")-.85)<1e-9);
run("s.launchCard='crit'");assert(Math.abs(run('critChance()')-(.20+.08*run("support('crit')")))<1e-9);assert(Math.abs(run("enemyDamage(e,10,true,'bolt','bolt')/n")-3)<1e-9);
run("var b={...e,boss:true};s.launchCard=null;var bn=enemyDamage(b,10,false,'bolt','bolt');s.launchCard='boss'");assert(Math.abs(run("enemyDamage(b,10,false,'bolt','bolt')/bn")-1.7)<1e-9);assert(Math.abs(run("enemyDamage(e,10,false,'bolt','bolt')/n")-1)<1e-9,'no bonus on normal enemies');
run("s.launchCard='jackpot';s.items.bolt=1;var c=[0,0,0];for(let i=0;i<2000;i++){s.t=i*.41;c[rollCacheJackpot('evolution').tier]++}");assert(run('c[2]')/2000>.22,'lucky cache raises jackpots: '+run('c'));
run("s.launchCard='scrap';s.dev=null;var k=runCreditBreakdown();var plain=k.base+k.bonus");assert.equal(run('runCredits()'),Math.round(run('plain')*1.5));
// Second Wind saves exactly once.
fresh();run("state='play';s.dev=null;s.launchCard='wind';s.p.inv=0;s.p.shield=0;s.p.hp=5;hurtPlayer(500)");assert.equal(run('state'),'play');assert(run('s.p.hp')>0);assert.equal(run('s.windUsed'),true);
run("s.p.inv=0;s.dashTime=0;s.p.hp=5;hurtPlayer(500)");assert.equal(run('state'),'end','second lethal hit ends the run');
console.log('PASS launch cards: dealt once after launch (never in test runs), skip option, all nine cards reachable, glass/iron hull and damage, critical mass, boss hunter, lucky cache odds, scrap baron credits, second wind saves once');
`);
