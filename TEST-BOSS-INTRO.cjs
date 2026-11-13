// v0.68 boss entrances and on-ship signature emblems.
const fs=require('fs'),path=require('path'),assert=require('assert');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();run("state='play';s.t=180;spawnBoss()");assert.equal(run('s.bossIntro.sub'),'REACTOR 1 OF 3');assert.equal(run('s.bossIntro.name'),'PRISM WARDEN');
run("drawBossIntro()");run("s.t+=5;drawBossIntro()");assert.equal(run('s.bossIntro'),null,'intro ends');
fresh();run("state='play';s.bossIndex=3;s.bossKills=3;s.finalEncounter={stage:'approach',at:0};s.t=700;spawnFinalBoss()");assert.equal(run('s.bossIntro.sub'),'FINAL ENCOUNTER');assert.equal(run('s.bossIntro.final'),true);
fresh();run("s.completed=true;state='play';beginEndless();s.nextEndlessBoss=0;spawnBoss(true)");assert.equal(run('s.bossIntro.sub'),'ENDLESS REACTOR');
console.log('PASS boss entrances: route, final and endless title cards that time out');
`);
