// Runtime for part signature mechanics (partSigs in equipment-catalogue.js). applyShipTree puts the equipped
// signatures in s.tree.sig as {id: 1 | 2} (2 = part at upgrade level 5); per-run state lives in s.sigState.
// Every hook is cheap and does nothing when the signature isn't equipped. Not active in developer test runs.
function sigLv(id){return (s&&s.tree&&s.tree.sig&&s.tree.sig[id])||0}
function sigState(){return s.sigState||(s.sigState={})}
function sigActive(){return !!(s&&s.tree&&s.tree.sig&&Object.keys(s.tree.sig).length)}
// Called when a dash/ram starts.
function sigOnDash(){if(!sigActive())return;let st=sigState();if(sigLv('phaseWindow')){st.phase=sigLv('phaseWindow')>1?3:2;s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r:34,c:'#ff6fd8',life:.35,max:.35})}if(sigLv('afterburn'))st.burnEmit=.32}
// Extra crit chance (added in critChance()).
function sigCritBonus(){if(!sigActive())return 0;let st=sigState(),b=0;if(st.phase>0)b+=.25;if(sigLv('slipstream')&&st.fast)b+=sigLv('slipstream')>1?.12:.08;return b}
// Damage dealt multiplier for one hit (in hit()); `source`/`owner` name the weapon.
function sigDamageMult(source,owner){if(!sigActive())return 1;let st=sigState(),m=1;if(sigLv('siegeLock')&&st.braced)m*=sigLv('siegeLock')>1?1.3:1.2;if(sigLv('solarFang')){let w=typeof damageOwner==='function'?damageOwner(source,owner):(owner||source);if(defs.some(d=>d.id===w&&d.kind==='weapon'))m*=thermalWeapons.includes(w)?(sigLv('solarFang')>1?1.4:1.3):.9}return m}
// Damage taken multiplier (in hurtPlayer()).
function sigTakenMult(){if(!sigActive()||!sigLv('bulwark'))return 1;let near=0;for(let e of s.enemies)if(e.hp>0&&Math.abs(e.x-s.p.x)<130&&Math.abs(e.y-s.p.y)<130&&dist(e,s.p)<130)near++;return 1-Math.min(sigLv('bulwark')>1?.3:.24,.04*near)}
// After the player takes a hit.
function sigOnHurt(){if(!sigActive()||!sigLv('aegisPulse'))return;let st=sigState();if((st.aegisCd||0)>0)return;st.aegisCd=sigLv('aegisPulse')>1?7:10;let r=150*areaMult();for(let e of s.enemies){if(e.hp<=0)continue;let d=dist(e,s.p);if(d>r||d<1)continue;if(!e.boss)knock(e,(e.x-s.p.x)/d,(e.y-s.p.y)/d,260);hit(e,10,'aegis')}s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r,c:'#ffd76a',life:.45,max:.45})}
// After any enemy dies.
function sigOnKill(e){if(!sigActive())return;let st=sigState();if(sigLv('coolant')){st.cool=(st.cool|0)+1;if(st.cool>=(sigLv('coolant')>1?9:12)){st.cool=0;if(s.mobilityTimers&&s.mobilityTimers.length){let i=s.mobilityTimers.indexOf(Math.max(...s.mobilityTimers));if(s.mobilityTimers[i]>0){s.mobilityTimers[i]=0;s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r:26,c:'#9fe8ff',life:.3,max:.3})}}}}
 if(sigLv('criticalMass')){st.mass=(st.mass|0)+1;if(st.mass>=(sigLv('criticalMass')>1?24:30)){st.mass=0;st.nova=.05}}}
// Hull repair multiplier (in the regen tick).
function sigRegenMult(){if(!sigActive()||!sigLv('chitinMend'))return 1;return (s.hitAgo||0)>4?(sigLv('chitinMend')>1?4:3):1}
// Per-frame update.
function sigUpdate(dt){if(!sigActive()||!s.p)return;let st=sigState();
 let mx=s.p.x-(st.lx??s.p.x),my=s.p.y-(st.ly??s.p.y),v=dt>0?Math.hypot(mx,my)/dt:0;st.lx=s.p.x;st.ly=s.p.y;st.v=(st.v||0)*.8+v*.2;let top=Math.max(60,s.pilot.speed||200);
 st.fast=st.v>top*.75&&s.dashTime<=0;
 if(st.phase>0)st.phase=Math.max(0,st.phase-dt);if(st.aegisCd>0)st.aegisCd=Math.max(0,st.aegisCd-dt);
 if(sigLv('siegeLock')){if(st.v<top*.15){st.still=(st.still||0)+dt;if(st.still>=1&&!st.braced){st.braced=true;s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r:40,c:'#4fffd8',life:.4,max:.4})}}else{st.still=0;if(st.v>top*.5)st.braced=false}}
 if(sigLv('afterburn')){if(st.burnEmit>0){st.burnEmit-=dt;st.burnTick=(st.burnTick||0)-dt;if(st.burnTick<=0){st.burnTick=.035;(st.burns||(st.burns=[])).push({x:s.p.x,y:s.p.y,life:1.3});if(st.burns.length>40)st.burns.shift();s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r:16,c:'#ffb050',life:.5,max:.5})}}
  if(st.burns&&st.burns.length){st.burnHit=(st.burnHit||0)-dt;let tick=st.burnHit<=0;if(tick)st.burnHit=.25;for(let b of st.burns)b.life-=dt;st.burns=st.burns.filter(b=>b.life>0);if(tick){let dmg=7*(sigLv('afterburn')>1?1.5:1);for(let e of s.enemies){if(e.hp<=0)continue;for(let b of st.burns)if(Math.abs(e.x-b.x)<30&&Math.abs(e.y-b.y)<30){hit(e,dmg,'afterburn');break}}}}}
 if(sigLv('gravWell')){st.grav=(st.grav??2)-dt;if(st.grav<=0){st.grav=sigLv('gravWell')>1?4:5;let r=170*areaMult();for(let e of s.enemies)if(e.hp>0&&!e.boss&&dist(e,s.p)<r)e.slow=Math.max(e.slow||0,1.5);for(let g of s.gems||[])if(dist(g,s.p)<r*1.6)g.vacuum=true;s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r,c:'#b48cff',life:.6,max:.6})}}
 if(st.nova>0){st.nova-=dt;if(st.nova<=0){let r=220*areaMult(),dmg=30+3*(s.lv||1);for(let e of s.enemies)if(e.hp>0&&dist(e,s.p)<r)hit(e,dmg,'criticalMass');s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r,c:'#ff7a3a',life:.6,max:.6});s.shake=Math.max(s.shake||0,5);try{sound('reactorBlast',s.p.x)}catch(e){}}}}
// Short status line for the HUD/tests: which signatures are currently "on".
function sigStatus(){if(!sigActive())return [];let st=sigState(),out=[];if(st.phase>0)out.push('PHASE');if(st.braced)out.push('BRACED');if(st.fast&&sigLv('slipstream'))out.push('SLIPSTREAM');return out}
