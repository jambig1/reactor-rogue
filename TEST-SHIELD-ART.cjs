const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);




function shieldScene(){run("state='menu';start();s.dev.test=false;s.items={shield:3};s.spec={};s.p.shield=60;s.p.hp=100;s.p.inv=0;s.dashTime=0;s.pilot.armour=0;s.pilot.hp=100;s.hitAgo=10")}
shieldScene();run('hurtPlayer(12,{x:s.p.x+100,y:s.p.y})');assert.equal(run('s.p.shield'),48);assert.equal(run('s.p.hp'),100);assert.equal(run('attackArt.shieldHits.length'),1);assert.equal(run('attackArt.shieldHits[0].a'),0);
run('hurtPlayer(12,{x:s.p.x,y:s.p.y+100})');assert.equal(run('attackArt.shieldHits.length'),1,'invulnerability does not invent a shield impact');
run('s.p.inv=0;s.p.shield=5;hurtPlayer(12,{x:s.p.x,y:s.p.y+100})');assert.equal(run('s.p.shield'),0);assert.equal(run('s.p.hp'),93);assert(run('attackArt.shieldHits.at(-1).broken'));assert(Math.abs(run('attackArt.shieldHits.at(-1).a')-Math.PI/2)<1e-8);
for(let preset of ['low','high'])for(let motion of [true,false]){run(`graphics.preset='${preset}';reducedMotion=${motion};refreshGraphicsVisual()`);let before=run('JSON.stringify(s)');run("drawDefensiveArt(s.t);drawSupportModules(s.t)");assert.equal(run('JSON.stringify(s)'),before);assert.equal(depth,0)}
run('updateAttackArt(1)');assert.equal(run('attackArt.shieldHits.length'),0);
shieldScene();run('for(let i=0;i<20;i++){s.p.inv=0;s.p.shield=60;hurtPlayer(1,{x:NaN,y:NaN})}');assert.equal(run('attackArt.shieldHits.length'),6);assert(run('attackArt.shieldHits.every(h=>Number.isFinite(h.a))'));
run('state="menu";start()');assert.equal(run('attackArt.shieldHits.length'),0);assert.equal(run('attackArt.shieldReform'),0);
run('s.items={shield:1};s.p.shield=20;updateAttackArt(.01)');assert(run('attackArt.shieldReform>0'));
console.log('PASS shield absorption and hull spillover unchanged, directional/break impacts, immune-hit exclusion, finite bounded effects, pure Low/High/reduced-motion painters, expiry/reset and recharge visual');
