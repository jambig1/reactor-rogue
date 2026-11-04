const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=process.argv[2]||require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math:Object.create(Math),Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);








const profile=process.argv[5]||'desktop',sector=process.argv[6]||'grid',pilot=process.argv[7]||'vanguard',build=process.argv[8]||'balanced',route=process.argv[9]||'survival';c.sector=sector;c.pilot=pilot;c.build=build;c.route=route;if(profile==='touch'){c.innerWidth=390;c.innerHeight=844;run('resize()')}c.profile=profile;let seed=Number(process.argv[4]||12345);c.Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
run(`
if(!sectors.some(x=>x.id===sector)||!pilots.some(x=>x.id===pilot))throw Error('Invalid playtest sector/pilot');selectedPilot=pilot;if(!hangar.ships.includes(pilot))hangar.ships.push(pilot);hangar.sector=sector;var originalSectorOpen=sectorOpen;sectorOpen=id=>id===sector||originalSectorOpen(id);controlMode=profile==='touch'?'touch':'hybrid';start();sectorOpen=originalSectorOpen;
var samples=[],log=[],lastLevel=1,lastBoss=0,lastSecond=-1,lastHP=s.p.hp,minHP=s.p.hp,peakEnemies=0,decisions=0,nearestDanger=999,bossLog=[],trackedBoss=null;
function recordChoice(type,name){log.push({t:+s.t.toFixed(2),type,name})}
function botChoice(d){let l=s.items[d.id]||0;let priority={bolt:100,clock:90,regen:88,armour:85,power:83,magnet:80,chain:78,laser:77,blade:76,rocket:74,hull:72,shield:70};let groups={close:['blade','nova','scatter','corona','ram','toxic','area','armour','regen'],long:['laser','rail','rocket','mortar','power','reach','clock'],control:['frost','chain','gravity','stasisNet','cryoCharge','spire','velocity','clock']};let score=(groups[build]||[]).includes(d.id)?95:priority[d.id]||35;for(let e of evolutions)if(e.passive===d.id&&support(e.id)>=3)score+=30;if(d.kind==='weapon'&&buildEquipment('weapon').length>=4&&!l)score-=45;if(l)score+=l*3;return score}
function bot(){
 if(state==='merchant'){recordChoice('merchant','transmission closed');leaveMerchant();return}
 if(state==='upgrade'){let ranked=choices.map((d,i)=>({i,score:botChoice(d)})).sort((a,b)=>b.score-a.score);recordChoice('upgrade',choices[ranked[0].i].name);choose(ranked[0].i);decisions++;return}
 if(state==='specialise'){recordChoice('specialisation',pendingSpec);chooseSpecialisation(0);return}
 if(state==='mutation'){let i=mutationOptions.findIndex(d=>d.id==='overflow');claimMutation(i<0?0:i);recordChoice('mutation','selected');return}
 if(state==='reward'){let i=rewardOptions.findIndex(d=>evolutions.some(e=>e.id===d.id));if(i<0)i=rewardOptions.findIndex(d=>d.id===(s.p.hp<maxHP()*.65?'repair':'xp'));claimReward(i<0?0:i);recordChoice('cache','claimed');return}
 if(state==='breachReward'){let i=distressOptions.findIndex(d=>d.kind==='protocol'&&d.id===(build==='close'?'close':build==='control'?'frost':'long'));claimBreachReward(i<0?0:i);recordChoice('signal reward','claimed');return}
 if(state!=='play')return;
 let goal=null,best=Infinity;
 for(let g of [...s.gems,...s.drops.filter(d=>d.id==='chest'||d.id==='repair')]){let d=dist(g,s.p),cost=d/(g.id==='chest'?3:g.id==='repair'&&s.p.hp<maxHP()*.7?4:1);if(cost<best){best=cost;goal=g}}
 let bossTarget=s.enemies.find(e=>e.boss&&e.hp>0);if(bossTarget&&!(goal?.id==='chest'&&dist(goal,s.p)<300)&&!(goal?.id==='repair'&&s.p.hp<maxHP()*.7)){let a=Math.atan2(s.p.y-bossTarget.y,s.p.x-bossTarget.x)+.35,radius=build==='close'?130:build==='long'?260:180;goal={x:bossTarget.x+Math.cos(a)*radius,y:bossTarget.y+Math.sin(a)*radius}}if(route==='signals'&&s.breach?.kind==='relay'&&['available','active'].includes(s.breach.status)&&!terrainBoss()){goal=relayAnchor(s.breach);if(dist(goal,s.p)<30){goal={x:s.p.x,y:s.p.y}}}let gx=goal?goal.x-s.p.x:Math.cos(s.t*.09)*140,gy=goal?goal.y-s.p.y:Math.sin(s.t*.09)*140,n=Math.hypot(gx,gy)||1;gx/=n;gy/=n;
 let rx=0,ry=0;nearestDanger=999;for(let e of s.enemies){if(e.hp<=0||e.arrival>0)continue;let dx=s.p.x-e.x,dy=s.p.y-e.y,d=Math.hypot(dx,dy)||1,clear=d-e.r;nearestDanger=Math.min(nearestDanger,clear);let safe=e.boss?(build==='close'?55:90):75;if(clear<safe){let f=(safe-clear)/safe*2.8;rx+=dx/d*f;ry+=dy/d*f}}
 for(let b of s.hostile){let dx=s.p.x-b.x,dy=s.p.y-b.y,d=Math.hypot(dx,dy)||1;if(d<65){rx+=dx/d*(65-d)/22;ry+=dy/d*(65-d)/22}}
 for(let h of s.sectorHazards||[]){if(h.life<=0)continue;if(['vent','fracture','lockdown'].includes(h.kind)){let a=h.a||0,dx=s.p.x-h.x,dy=s.p.y-h.y,lx=dx*Math.cos(a)+dy*Math.sin(a),ly=-dx*Math.sin(a)+dy*Math.cos(a);if(Math.abs(lx)<h.length/2+25&&Math.abs(ly)<h.width/2+40){let side=ly>=0?1:-1;rx-=Math.sin(a)*side*3;ry+=Math.cos(a)*side*3}}else{let dx=s.p.x-h.x,dy=s.p.y-h.y,d=Math.hypot(dx,dy)||1;if(d<h.r+40){let f=(h.r+40-d)/40;rx+=dx/d*f*2;ry+=dy/d*f*2}}}
 function dodgeRay(ray,length=650){let dx=s.p.x-ray.x,dy=s.p.y-ray.y,c=Math.cos(ray.a),sn=Math.sin(ray.a),along=dx*c+dy*sn,across=-dx*sn+dy*c;if(along>0&&along<length&&Math.abs(across)<40){let side=across>=0?1:-1;rx-=sn*side*2;ry+=c*side*2}}
 for(let e of s.enemies)if(e.hp>0&&e.charge>0){if(e.cityPlan)for(let ray of e.cityPlan.rays)dodgeRay(ray,480);else if(!e.sectorBoss&&bossPattern(e)==='rails')for(let a of railAngles(e))dodgeRay({x:e.x-Math.cos(a)*1000,y:e.y-Math.sin(a)*1000,a},2000);else if(Number.isFinite(e.aim))dodgeRay({x:e.x,y:e.y,a:e.aim});}
 move.x=gx+rx;move.y=gy+ry;let l=Math.hypot(move.x,move.y);if(l>1){move.x/=l;move.y/=l}if(nearestDanger<36)dash();
 let aim=nearest(s.p,800);if(aim&&profile==='desktop'){mouseSeen=true;mouseAim={x:W/2+aim.x-s.p.x,y:H/2+aim.y-s.p.y}}else if(aim&&nearestDanger>100&&(!goal||dist(goal,s.p)>100)){let dx=aim.x-s.p.x,dy=aim.y-s.p.y,d=Math.hypot(dx,dy)||1;move.x=dx/d;move.y=dy/d}
 let activeBoss=s.enemies.find(e=>e.boss&&e.hp>0);if(activeBoss&&trackedBoss!==activeBoss){trackedBoss=activeBoss;bossLog.push({name:activeBoss.name,spawn:+s.t.toFixed(2),level:s.lv,hp:activeBoss.max})}update(1/60);
 if(s.lv!==lastLevel){log.push({t:+s.t.toFixed(2),type:'level',level:s.lv});lastLevel=s.lv}
 if(s.bossKills!==lastBoss){log.push({t:+s.t.toFixed(2),type:'boss',boss:s.bossKills});lastBoss=s.bossKills;if(bossLog.length)bossLog.at(-1).defeated=+s.t.toFixed(2)}
 minHP=Math.min(minHP,s.p.hp);peakEnemies=Math.max(peakEnemies,s.enemies.filter(e=>e.hp>0).length);
 let second=Math.floor(s.t);if(second!==lastSecond&&second%30===0){if(second%60===0)console.log('minute',second/60,'level',s.lv,'kills',s.kills,'hp',Math.round(s.p.hp),'bosses',s.bossKills);samples.push({t:second,level:s.lv,hp:+s.p.hp.toFixed(1),kills:s.kills,enemies:s.enemies.filter(e=>e.hp>0).length,bosses:s.bossKills,bossIndex:s.bossIndex,xp:s.xp,need:s.need,gems:s.gems.length,evolved:Object.keys(s.evolved).length});lastSecond=second}
}
for(let frames=0;frames<60*900+3000&&state!=='end'&&s.t<900;frames++)bot();
var result={seed:0,profile,sector,pilot,build,route,credits:runCreditBreakdown(),protocol:s.runProtocol,abilities:s.metrics.dashes,bossLog,readyContracts:contracts.filter(c=>!hasContract(c.id)&&c.value(liveChallengeProgress())>=c.goal).map(c=>({id:c.id,reward:c.reward})),viewport:[W,H],status:state,completed:s.completed,time:+s.t.toFixed(2),level:s.lv,kills:s.kills,bosses:s.bossKills,damageTaken:s.metrics.taken,minHP,peakEnemies,dev:s.dev.test,items:s.items,evolved:s.evolved,samples,log};
`);
let result=run('result');result.seed=Number(process.argv[4]||12345);fs.writeFileSync(process.argv[3]||'PACING-RUN.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,samples:undefined,log:undefined}));
