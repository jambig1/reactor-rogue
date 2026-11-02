const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=process.argv[2]||require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math:Object.create(Math),Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








const profile=process.argv[5]||'desktop';if(profile==='touch'){c.innerWidth=390;c.innerHeight=844;run('resize()')}c.profile=profile;let seed=Number(process.argv[4]||12345);c.Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
run(`
selectedPilot='vanguard';controlMode=profile==='touch'?'touch':'hybrid';start();
var samples=[],log=[],lastLevel=1,lastBoss=0,lastSecond=-1,lastHP=s.p.hp,minHP=s.p.hp,peakEnemies=0,decisions=0,nearestDanger=999;
function recordChoice(type,name){log.push({t:+s.t.toFixed(2),type,name})}
function botChoice(d){let l=s.items[d.id]||0;let priority={bolt:100,clock:90,regen:88,armour:85,power:83,magnet:80,chain:78,laser:77,blade:76,rocket:74,hull:72,shield:70};let score=priority[d.id]||35;if(d.kind==='weapon'&&buildEquipment('weapon').length>=4&&!l)score-=45;if(l)score+=l*3;return score}
function bot(){
 if(state==='upgrade'){let ranked=choices.map((d,i)=>({i,score:botChoice(d)})).sort((a,b)=>b.score-a.score);recordChoice('upgrade',choices[ranked[0].i].name);choose(ranked[0].i);decisions++;return}
 if(state==='specialise'){recordChoice('specialisation',pendingSpec);chooseSpecialisation(0);return}
 if(state==='mutation'){let i=mutationOptions.findIndex(d=>d.id==='overflow');claimMutation(i<0?0:i);recordChoice('mutation','selected');return}
 if(state==='reward'){let i=rewardOptions.findIndex(d=>evolutions.some(e=>e.id===d.id));if(i<0)i=rewardOptions.findIndex(d=>d.id===(s.p.hp<maxHP()*.65?'repair':'xp'));claimReward(i<0?0:i);recordChoice('cache','claimed');return}
 if(state==='breachReward'){claimDistressReward(0);return}
 if(state!=='play')return;
 let goal=null,best=Infinity;
 for(let g of [...s.gems,...s.drops.filter(d=>d.id==='chest'||d.id==='repair')]){let d=dist(g,s.p),cost=d/(g.id==='chest'?3:g.id==='repair'&&s.p.hp<maxHP()*.7?4:1);if(cost<best){best=cost;goal=g}}
 let gx=goal?goal.x-s.p.x:Math.cos(s.t*.09)*140,gy=goal?goal.y-s.p.y:Math.sin(s.t*.09)*140,n=Math.hypot(gx,gy)||1;gx/=n;gy/=n;
 let rx=0,ry=0;nearestDanger=999;for(let e of s.enemies){if(e.hp<=0||e.arrival>0)continue;let dx=s.p.x-e.x,dy=s.p.y-e.y,d=Math.hypot(dx,dy)||1,clear=d-e.r;nearestDanger=Math.min(nearestDanger,clear);let safe=e.boss?100:75;if(clear<safe){let f=(safe-clear)/safe*2.8;rx+=dx/d*f;ry+=dy/d*f}}
 for(let b of s.hostile){let dx=s.p.x-b.x,dy=s.p.y-b.y,d=Math.hypot(dx,dy)||1;if(d<65){rx+=dx/d*(65-d)/22;ry+=dy/d*(65-d)/22}}
 move.x=gx+rx;move.y=gy+ry;let l=Math.hypot(move.x,move.y);if(l>1){move.x/=l;move.y/=l}if(nearestDanger<36)dash();
 let aim=nearest(s.p,800);if(aim&&profile==='desktop'){mouseSeen=true;mouseAim={x:W/2+aim.x-s.p.x,y:H/2+aim.y-s.p.y}}else if(aim&&nearestDanger>100&&(!goal||dist(goal,s.p)>100)){let dx=aim.x-s.p.x,dy=aim.y-s.p.y,d=Math.hypot(dx,dy)||1;move.x=dx/d;move.y=dy/d}
 update(1/60);
 if(s.lv!==lastLevel){log.push({t:+s.t.toFixed(2),type:'level',level:s.lv});lastLevel=s.lv}
 if(s.bossKills!==lastBoss){log.push({t:+s.t.toFixed(2),type:'boss',boss:s.bossKills});lastBoss=s.bossKills}
 minHP=Math.min(minHP,s.p.hp);peakEnemies=Math.max(peakEnemies,s.enemies.filter(e=>e.hp>0).length);
 let second=Math.floor(s.t);if(second!==lastSecond&&second%30===0){if(second%60===0)console.log('minute',second/60,'level',s.lv,'kills',s.kills,'hp',Math.round(s.p.hp),'bosses',s.bossKills);samples.push({t:second,level:s.lv,hp:+s.p.hp.toFixed(1),kills:s.kills,enemies:s.enemies.filter(e=>e.hp>0).length,bosses:s.bossKills,bossIndex:s.bossIndex,xp:s.xp,need:s.need,gems:s.gems.length,evolved:Object.keys(s.evolved).length});lastSecond=second}
}
for(let frames=0;frames<60*900+3000&&state!=='end'&&s.t<900;frames++)bot();
var result={seed:0,profile,viewport:[W,H],status:state,completed:s.completed,time:+s.t.toFixed(2),level:s.lv,kills:s.kills,bosses:s.bossKills,damageTaken:s.metrics.taken,minHP,peakEnemies,dev:s.dev.test,items:s.items,evolved:s.evolved,samples,log};
`);
let result=run('result');result.seed=Number(process.argv[4]||12345);fs.writeFileSync(process.argv[3]||'PACING-RUN.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,samples:undefined,log:undefined}));
