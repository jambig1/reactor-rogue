// v1.7 SHIP STATS. One calculation for every screen that shows ship numbers (overview chips, engineering
// inspection, part comparison). It uses the same base pilot, mobility table and shipTreeBonus() that
// applyShipTree() feeds into a run, and TEST-SHIP-STATS.cjs checks the two agree. These are permanent ship
// statistics at launch; in-run upgrades (level-up cards) are not included.
const shipStatRows=[
 {id:'hull',label:'Max hull',group:'Survival',core:1,fmt:v=>Math.round(v)},
 {id:'armour',label:'Armour',group:'Survival',core:1,fmt:v=>Math.round(v),help:'Subtracted from every hit you take.'},
 {id:'taken',label:'Damage taken',group:'Survival',fmt:v=>Math.round(v*100)+'%',lower:1},
 {id:'regen',label:'Hull repair',group:'Survival',fmt:v=>(Math.round(v*100)/100)+'/s'},
 {id:'speed',label:'Speed',group:'Movement',core:1,fmt:v=>Math.round(v)},
 {id:'dashes',label:'Dash charges',group:'Movement',fmt:v=>v},
 {id:'dashCd',label:'Dash recharge',group:'Movement',fmt:v=>(Math.round(v*10)/10)+' s',lower:1},
 {id:'damage',label:'Damage',group:'Offence',core:1,fmt:v=>(v>=0?'+':'')+Math.round(v*100)+'%'},
 {id:'cycle',label:'Weapon cycle time',group:'Offence',fmt:v=>Math.round(v*100)+'%',lower:1,help:'Time between shots. Lower fires faster.'},
 {id:'crit',label:'Crit chance',group:'Offence',core:1,fmt:v=>Math.round(v*100)+'%'},
 {id:'critDmg',label:'Crit damage',group:'Offence',fmt:v=>Math.round(v*100)+'%'},
 {id:'area',label:'Attack area',group:'Offence',fmt:v=>(v>=0?'+':'')+Math.round(v*100)+'%'},
 {id:'starter',label:'Starting weapon',group:'Offence',fmt:v=>Math.round(v*100)+'%'},
 {id:'pickup',label:'Pickup radius',group:'Utility',fmt:v=>(v>=0?'+':'')+Math.round(v*100)+'%'},
 {id:'xp',label:'Gem XP',group:'Utility',fmt:v=>(v>=0?'+':'')+Math.round(v*100)+'%'},
 {id:'credits',label:'Credits',group:'Utility',fmt:v=>(v>=0?'+':'')+Math.round(v*100)+'%'},
 {id:'wslots',label:'Weapon slots',group:'Capacity',core:1,fmt:v=>v},
 {id:'pslots',label:'Passive slots',group:'Capacity',core:1,fmt:v=>v}];
function shipBasePilot(){return pilots.find(x=>x.id===treePilot())||pilots[1]}
// Numbers for one bonus object T (from shipTreeBonus).
function shipStatsFrom(T){let p=shipBasePilot(),m=(typeof mobility!=='undefined'&&mobility[p.id])||{charges:1,cd:4},hot=T.module==='overdrive',survey=T.module==='collector';
 return {hull:Math.max(20,Math.round((p.hp+T.hp)*T.hpMult)),armour:(p.armour||0)+T.armour,taken:T.taken,regen:(p.regen||0)+T.regen,
  speed:Math.round(p.speed*Math.max(.3,1+T.speed)),dashes:m.charges,dashCd:m.cd*T.dashCd,
  damage:(1+T.dmg)*(hot?1.1:1)-1,cycle:(p.fireRate||1)*(1-T.rate),crit:.05+T.crit,critDmg:2,area:T.area,starter:T.starter,
  pickup:T.magnet,xp:T.growth+(survey?.15:0),credits:T.greed,wslots:T.wslots,pslots:T.pslots}}
// Full sheet: final values plus where each one comes from. eqOverride previews a part without equipping it.
function shipStatSheet(eqOverride){let all=shipStatsFrom(shipTreeBonus(eqOverride)),base=shipStatsFrom(shipTreeBonus(null,'none')),
 sources=[['skills','Skill tree'],['crew','Crew'],...partSlots.map(q=>[q.id,equippedPartFor(q.id,eqOverride).name])].map(([k,name])=>({k,name,v:shipStatsFrom(shipTreeBonus(eqOverride,k))}));
 return shipStatRows.map(r=>{let parts=[{name:'Base hull ('+pilotName(shipBasePilot().id)+')',d:base[r.id]}];for(let src of sources){let d=src.v[r.id]-base[r.id];if(Math.abs(d)>1e-9)parts.push({name:src.name,d,k:src.k})}return {...r,value:all[r.id],base:base[r.id],parts}})}
function equippedPartFor(slot,eqOverride){return eqOverride&&eqOverride[slot]?shipParts.find(x=>x.id===eqOverride[slot])||equippedPart(slot):equippedPart(slot)}
// Difference between the current ship and the ship with `id` equipped: one row per stat that changes.
function partComparison(id){let d=shipParts.find(x=>x.id===id);if(!d)return [];let cur=shipStatsFrom(shipTreeBonus()),next=shipStatsFrom(shipTreeBonus({[d.slot]:id}));
 return shipStatRows.filter(r=>Math.abs(next[r.id]-cur[r.id])>1e-9).map(r=>{let delta=next[r.id]-cur[r.id],better=r.lower?delta<0:delta>0;return {...r,cur:cur[r.id],next:next[r.id],delta,better}})}
