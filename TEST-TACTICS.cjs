// v0.94 Yuka enemy tactics: swarm/flank/direct/heavy, flee when hurt, off in dev test runs and without the library.
const fs=require('fs'),path=require('path'),assert=require('assert');
const yuka=fs.readFileSync(path.join(__dirname,'vendor/yuka-0.7.8/yuka.js'),'utf8');assert(fs.existsSync(path.join(__dirname,'vendor/yuka-0.7.8/LICENSE')));
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();run("s.dev=null;s.enemies=[];spawn(0);var e=s.enemies[0];e.arrival=0;e.x=s.p.x+300;e.y=s.p.y");assert.equal(run('tacticHeading(e,1.5)'),1.5,'no library, no change');
run(${JSON.stringify('var window=this;')}+${JSON.stringify(yuka)});assert(run('tacticsInit()'),'Yuka starts');
run("s.enemies=[];for(let i=0;i<40;i++){spawn(i%6?0:2);let q=s.enemies.at(-1);q.arrival=0;q.x=s.p.x+300+i*9;q.y=s.p.y+(i%7)*20}");
let out=run("s.enemies.map(q=>tacticHeading(q,Math.atan2(s.p.y-q.y,s.p.x-q.x)))");assert(out.every(Number.isFinite));
let kinds=run("[...new Set(s.enemies.map(q=>q.tac&&q.tac.kind))]");for(let k of ['swarm','flank','heavy'])assert(kinds.includes(k),'has '+k);
assert.equal(run("JSON.stringify(s.enemies[0]).includes('steering')"),false,'agents never serialised with the run');
run("var f=s.enemies.find(q=>q.tac&&q.tac.kind==='flank');f.tacT=0");let toward=run("Math.atan2(s.p.y-f.y,s.p.x-f.x)"),fh=run("let h;for(let k=0;k<8;k++){f.tacT=0;h=tacticHeading(f,Math.atan2(s.p.y-f.y,s.p.x-f.x))}h");assert(Math.abs(Math.atan2(Math.sin(fh-toward),Math.cos(fh-toward)))>.3,'flankers swing wide');
run("var w=s.enemies.find(q=>q.tac&&q.tac.kind==='swarm');w.hp=w.max*.1;w.x=s.p.x+150;w.y=s.p.y+20;w.tacT=0");let away=run("Math.atan2(w.y-s.p.y,w.x-s.p.x)"),wh=run("let h2;for(let k=0;k<8;k++){w.tacT=0;h2=tacticHeading(w,Math.atan2(s.p.y-w.y,s.p.x-w.x))}h2");assert(Math.abs(Math.atan2(Math.sin(wh-away),Math.cos(wh-away)))<1.2,'hurt ships flee');
run("s.dev={test:true};var z=s.enemies[1];z.tacT=0");assert.equal(run('tacticHeading(z,.7)'),.7,'dev test runs unchanged');
run("s.dev=null;s.enemies.splice(0,10);tacticsPrune()");assert.equal(run('tactics.em.entities.length'),run('s.enemies.filter(q=>q.tac).length'),'dead ships removed');
console.log('PASS Yuka tactics: swarm/flank/heavy mix, wide flanks, hurt ships flee, cleanup, off without library or in test runs');
`);
