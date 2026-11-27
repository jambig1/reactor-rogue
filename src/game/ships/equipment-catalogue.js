// v1.7 SHIP EQUIPMENT CATALOGUE. One source of truth for every ship part: the inventory, comparison, workshop,
// 3D preview, drops and the actual run all read these definitions. Stats are structured (`st`), so descriptions,
// comparisons and gameplay can never disagree. Part ids are unchanged from v0.99/v1.0, so saves carry over.
//
// Slots: engine (mobility), wings (handling and precision), mount (weapon capacity and firing), plating (support
// capacity and survival) and reactor (energy profile; replaces the old one-slot Reactor module).
// Rarity tiers have distinct jobs rather than just bigger numbers:
//   Common     reliable baseline, no trade-offs
//   Uncommon   one or two focused bonuses
//   Rare       a strong specialisation paid for with a real drawback
//   Epic       adds a conditional mechanic
//   Legendary  a build-defining signature mechanic
//   Exotic     rule-bending signature, only from one sector's bosses
const partSlots=[
 {id:'engine',name:'Engine',icon:'speed',role:'Movement speed, dash recharge and propulsion effects.'},
 {id:'wings',name:'Wings',icon:'crit',role:'Precision, attack area and pickup handling. Changes your silhouette.'},
 {id:'mount',name:'Gun mount',icon:'power',role:'Sets your weapon slots and how your weapons fire.'},
 {id:'plating',name:'Plating',icon:'armour',role:'Sets your passive slots and how much punishment you take.'},
 {id:'reactor',name:'Reactor',icon:'nova',role:'Energy profile: output, efficiency and risk.'}];
const partRarity=[
 {id:'common',name:'Common',c:'#9fb4c8',scrap:0,role:'Reliable baseline with no trade-offs.'},
 {id:'uncommon',name:'Uncommon',c:'#78e99e',scrap:40,role:'Focused bonuses, no surprises.'},
 {id:'rare',name:'Rare',c:'#6daaff',scrap:90,role:'Strong specialisation with a real drawback.'},
 {id:'epic',name:'Epic',c:'#c18aff',scrap:140,role:'Adds a conditional mechanic.'},
 {id:'legendary',name:'Legendary',c:'#ffcf64',scrap:200,role:'A build-defining signature mechanic.'},
 {id:'exotic',name:'Exotic',c:'#ff6fd8',scrap:320,role:'Rule-bending signature. Found only in one sector.'}];
// How each stat key reads. `good` is the direction that helps you; `pct` values are fractions.
const partStatDefs={
 hp:{label:'Max hull',good:1},armour:{label:'Armour',good:1},speed:{label:'Speed',good:1,pct:1},
 dmg:{label:'Damage',good:1,pct:1},rate:{label:'Fire rate',good:1,pct:1},crit:{label:'Crit chance',good:1,pct:1,pts:1},
 area:{label:'Attack area',good:1,pct:1},magnet:{label:'Pickup radius',good:1,pct:1},greed:{label:'Credits',good:1,pct:1},
 growth:{label:'Gem XP',good:1,pct:1},regen:{label:'Hull repair',good:1,unit:'/s'},
 dashCd:{label:'Dash recharge time',good:-1,pct:1},taken:{label:'Damage taken',good:-1,pct:1},
 wslots:{label:'Weapon slots',set:1},pslots:{label:'Passive slots',set:1}};
// Weapons a heat/energy mount favours (Solar Fang).
const thermalWeapons=['laser','ember','nova','sails','corona','plasmaRain','plasmaWhip','fence','leech','prismTrace','prism','mines','twinWisps'];
// Signature mechanics. Runtime hooks live in ship-signatures.js; `lv5` is what a fully upgraded part adds.
const partSigs={
 afterburn:{name:'Afterburn',desc:'Dashing leaves a burning wake that damages enemies in it.',lv5:'Wake burns 50% hotter.'},
 phaseWindow:{name:'Phase Window',desc:'After every dash, +25% crit chance for 2 s.',lv5:'Window lasts 3 s.'},
 slipstream:{name:'Slipstream',desc:'While flying near full speed, +8% crit chance.',lv5:'+12% instead.'},
 gravWell:{name:'Gravity Well',desc:'Every 5 s a gravity pulse slows nearby enemies by 35% for 1.5 s and pulls in pickups.',lv5:'Pulse every 4 s.'},
 siegeLock:{name:'Siege Lock',desc:'Hold nearly still for 1 s to brace: +20% damage until you move quickly again.',lv5:'+30% when braced.'},
 solarFang:{name:'Solar Fang',desc:'Heat and energy weapons (lasers, embers, plasma, solar, nova) deal +30% damage. All other weapons deal 10% less.',lv5:'+40% instead.'},
 aegisPulse:{name:'Aegis Pulse',desc:'Taking a hit releases a pulse that shoves nearby enemies away (every 10 s).',lv5:'Every 7 s.'},
 chitinMend:{name:'Chitin Mend',desc:'After 4 s without being hit, hull repair is tripled.',lv5:'Quadrupled.'},
 bulwark:{name:'Bulwark',desc:'Take 4% less damage for each enemy close to you, up to 24%.',lv5:'Up to 30%.'},
 coolant:{name:'Coolant Loop',desc:'Every 12th kill instantly recharges a dash.',lv5:'Every 9th kill.'},
 criticalMass:{name:'Critical Mass',desc:'Every 30 kills the reactor vents a nova that damages everything nearby.',lv5:'Every 24 kills.'},
 capacitor:{name:'Shield Capacitor',desc:'Start every run with an Energy Shield fitted.',lv5:'The shield starts at level 2.'}};
// src: 'any' = any boss can drop it; a sector id = only that sector's bosses. tags = playstyles it suits.
const shipParts=[
 {id:'e_stock',slot:'engine',r:0,name:'Stock Thrusters',st:{},src:'start',tags:[],lore:'Factory thrusters. Nothing to tune, nothing to break.'},
 {id:'e_twin',slot:'engine',r:1,name:'Twin-Burner',st:{speed:.08,dashCd:-.15},src:'any',tags:['evasive','dash'],lore:'Paired burners that relight fast between dashes.'},
 {id:'e_ion',slot:'engine',r:1,name:'Ion Drive',st:{speed:.06,magnet:.15},src:'any',tags:['salvage','evasive'],lore:'An ion wake that drags loose salvage along behind you.'},
 {id:'e_fusion',slot:'engine',r:2,name:'Fusion Core',st:{speed:.12,hp:10},src:'any',tags:['evasive','tank'],lore:'A dorsal fusion bottle feeding both nozzles. Heavy, but it hauls.'},
 {id:'e_nova',slot:'engine',r:4,name:'Nova Afterburner',st:{speed:.16,dashCd:-.3,hp:-10},sig:'afterburn',src:'any',tags:['dash','evasive','close'],lore:'Gold-flanged afterburners that leave the vacuum on fire.'},
 {id:'e_phantom',slot:'engine',r:5,name:'Phantom Drive',st:{speed:.1,dashCd:-.1,hp:-20},sig:'phaseWindow',src:'ghost',tags:['crit','dash','glass'],lore:'Salvaged from the Phantom Armada. It slips half out of phase whenever it burns.'},
 {id:'w_stock',slot:'wings',r:0,name:'Stock Wings',st:{},src:'start',tags:[],lore:'Standard swept wings.'},
 {id:'w_razor',slot:'wings',r:1,name:'Razor Fins',st:{crit:.04},src:'any',tags:['crit'],lore:'Knife-edged fins with targeting sensors along the leading edge.'},
 {id:'w_vane',slot:'wings',r:1,name:'Stabiliser Vanes',st:{area:.06},src:'any',tags:['area'],lore:'Stacked vanes that steady wide-spread weapons.'},
 {id:'w_prism',slot:'wings',r:2,name:'Prism Sails',st:{crit:.07,area:.08,speed:-.04},src:'any',tags:['crit','area'],lore:'Crystal sails that refract your shots. They catch the solar wind, too.'},
 {id:'w_phantom',slot:'wings',r:4,name:'Phantom Wings',st:{crit:.12,speed:.06},sig:'slipstream',src:'any',tags:['crit','evasive'],lore:'Gold-framed ghost wings. Faster is sharper.'},
 {id:'w_graviton',slot:'wings',r:5,name:'Graviton Wings',st:{magnet:.5,crit:-.04},sig:'gravWell',src:'rift',tags:['control','salvage','area'],lore:'Wings that bend space. Pulled from the Void Rift.'},
 {id:'m_stock',slot:'mount',r:0,name:'Standard Hardpoints',st:{wslots:6},src:'start',tags:[],lore:'Six standard weapon hardpoints.'},
 {id:'m_heavy',slot:'mount',r:1,name:'Heavy Mount',st:{wslots:5,dmg:.15},src:'any',tags:['sustained','close'],lore:'One fewer hardpoint, much heavier shots.'},
 {id:'m_rotary',slot:'mount',r:1,name:'Rotary Rack',st:{wslots:6,rate:.06},src:'any',tags:['sustained'],lore:'A rotating rack that cycles every weapon a little quicker.'},
 {id:'m_array',slot:'mount',r:2,name:'Overslung Array',st:{wslots:7,dmg:-.08},src:'any',tags:['drones','area'],lore:'Seven hardpoints, each one a little weaker.'},
 {id:'m_siege',slot:'mount',r:4,name:'Siege Battery',st:{wslots:7,dmg:.1,dashCd:.1},sig:'siegeLock',src:'any',tags:['artillery','sustained'],lore:'Twin accelerator rails. Plant yourself and let it work.'},
 {id:'m_solarfang',slot:'mount',r:5,name:'Solar Fang Mount',st:{wslots:6},sig:'solarFang',src:'solar',tags:['thermal','sustained'],lore:'Heat-sink fangs recovered from the Solar Throne.'},
 {id:'p_stock',slot:'plating',r:0,name:'Standard Plating',st:{pslots:6},src:'start',tags:[],lore:'Six passive slots and an honest hull.'},
 {id:'p_reactive',slot:'plating',r:1,name:'Reactive Plating',st:{pslots:6,armour:1},src:'any',tags:['tank'],lore:'Hex cells that blunt every hit.'},
 {id:'p_light',slot:'plating',r:1,name:'Light Frame',st:{pslots:4,speed:.1,dmg:.06},src:'any',tags:['glass','evasive'],lore:'An open lattice. Two fewer passives, a lot less weight.'},
 {id:'p_heavy',slot:'plating',r:2,name:'Heavy Plating',st:{pslots:6,hp:25,speed:-.06},src:'any',tags:['tank'],lore:'Layered strike plates. You will feel the weight.'},
 {id:'p_chitin',slot:'plating',r:3,name:'Hive Chitin',st:{pslots:6,hp:15,regen:.3,armour:-1},sig:'chitinMend',src:'hive',tags:['tank','sustain'],lore:'Living armour grown in the Hive. It knits itself shut.'},
 {id:'p_aegis',slot:'plating',r:4,name:'Aegis Shell',st:{pslots:7,armour:1,hp:15},sig:'aegisPulse',src:'any',tags:['tank','control'],lore:'A gold-ribbed shell with a field projector at its heart.'},
 {id:'p_titan',slot:'plating',r:5,name:'Titan Bastion Plating',st:{pslots:6,hp:40,armour:2,speed:-.12},sig:'bulwark',src:'foundry',tags:['tank','close'],lore:'Foundry-forged siege armour. Stronger the deeper you wade in.'},
 {id:'r_stock',slot:'reactor',r:0,name:'Standard Core',st:{},src:'start',tags:[],lore:'Original reactor output.'},
 {id:'r_survey',slot:'reactor',r:1,name:'Survey Array',st:{speed:-.08},module:'collector',show:{growth:.15},src:'any',tags:['salvage'],lore:'Diverts power to the sensors: more gem XP, less thrust.'},
 {id:'r_hot',slot:'reactor',r:1,name:'Hot Reactor',st:{hp:-10},module:'overdrive',show:{dmg:.1},src:'any',tags:['glass'],lore:'Runs the core hot. Weapons hit harder; the hull runs thin.'},
 {id:'r_capacitor',slot:'reactor',r:2,name:'Aegis Capacitor',st:{dmg:-.05},sig:'capacitor',src:'any',tags:['shield','tank'],lore:'A shield bank wired straight into the core.'},
 {id:'r_sustain',slot:'reactor',r:3,name:'Sustain Core',st:{rate:.08,dashCd:-.1,area:-.1},sig:'coolant',src:'cryo',tags:['sustained','dash'],lore:'A cryo-cooled core that never overheats. Found in Cryo Reach.'},
 {id:'r_overload',slot:'reactor',r:4,name:'Overload Reactor',st:{dmg:.2,rate:.08,taken:.2},sig:'criticalMass',src:'any',tags:['glass','aggressive'],lore:'Unstable and loud. The more you destroy, the hotter it runs.'}];
const stockPart=slot=>shipParts.find(x=>x.slot===slot&&x.r===0);
// Old Reactor module ids (hangar.module) -> reactor parts.
const moduleToReactor={collector:'r_survey',overdrive:'r_hot'};

// Human-readable stat line, e.g. "+8% speed · dash recharge −15%". `lv` scales the helpful values like gameplay does.
function partStatValue(d,key,lv){let v=(d.st||{})[key];if(v===undefined)v=(d.show||{})[key];if(v===undefined)return undefined;let def=partStatDefs[key]||{};if(def.set)return v;let k=1+.12*(lv||0),help=def.good*v>0;let out=help?v*k:v;return key==='hp'||key==='armour'?Math.round(out):out}
function fmtPartStat(key,v){let def=partStatDefs[key]||{};if(def.set)return v+' '+def.label.toLowerCase();let sign=v>0?'+':'−',a=Math.abs(v);return sign+(def.pct?Math.round(a*100)+'%':(Math.round(a*100)/100))+(def.unit||'')+' '+def.label.toLowerCase()}
function partStatLine(d,lv){let keys=Object.keys({...(d.st||{}),...(d.show||{})});if(!keys.length)return 'No bonuses. No drawbacks.';return keys.map(k=>fmtPartStat(k,partStatValue(d,k,lv))).join(' · ')}
function partSigText(d,lv){let g=d.sig&&partSigs[d.sig];return g?g.name+': '+g.desc+(lv>=5?' '+g.lv5:''):''}
// Kept for code and tests that read d.desc.
for(const d of shipParts)Object.defineProperty(d,'desc',{get(){return partStatLine(d,0)+(d.sig?' · '+partSigText(d,0):'')},enumerable:true});
function partSrcLabel(d){if(d.src==='start')return 'Standard issue';if(d.src==='any')return 'Any boss · Lost Signal outpost';return sectorName(d.src)+' bosses only'}

// Save data: hangar.ship.parts = {v, owned:{id:1}, eq:{slot:id}, lv:{id:n}, acq:{id:time}, seen:{id:1}, fav:{id:1}, pity:{sector:n}}.
// v2 (1.7): adds the reactor slot (migrating the old Reactor module), acquisition times, new/favourite flags and exotic pity.
// Migration only adds fields; nothing owned, equipped or upgraded is removed. The v1 parts object is kept once in partsV1.
function partState(){let sh=shipState();if(!sh.parts||typeof sh.parts!=='object'){let owned={e_stock:1,w_stock:1,m_stock:1,p_stock:1,r_stock:1};let starters=shipParts.filter(x=>x.r===1&&x.slot!=='reactor');owned[starters[Math.floor(Math.random()*starters.length)].id]=1;sh.parts={v:2,owned,eq:{engine:'e_stock',wings:'w_stock',mount:'m_stock',plating:'p_stock',reactor:'r_stock'},lv:{},acq:{},seen:{},fav:{},pity:{}};for(let id of Object.keys(owned))sh.parts.seen[id]=1}
 let ps=sh.parts;if((ps.v|0)<2)migratePartsV2(sh);if(!sh.paint||typeof sh.paint!=='object')sh.paint={hull:'',trail:'standard',trailColor:''};for(let k of ['owned','eq','lv','acq','seen','fav','pity'])if(!ps[k]||typeof ps[k]!=='object')ps[k]={};for(let q of partSlots){if(!ps.eq[q.id]||!ps.owned[ps.eq[q.id]])ps.eq[q.id]=stockPart(q.id).id;ps.owned[stockPart(q.id).id]=1}return ps}
function migratePartsV2(sh){let ps=sh.parts;try{if(!sh.partsV1)sh.partsV1=JSON.parse(JSON.stringify(ps))}catch(e){}ps.owned=ps.owned||{};ps.eq=ps.eq||{};ps.lv=ps.lv||{};ps.acq=ps.acq||{};ps.seen=ps.seen||{};ps.fav=ps.fav||{};ps.pity=ps.pity||{};
 for(let id of Object.keys(ps.owned))ps.seen[id]=1;ps.owned.r_stock=1;
 // The Reactor module was bought in the Hangar; owning one now means owning that reactor part, and the equipped one carries over.
 try{for(let [mod,rid] of Object.entries(moduleToReactor))if((hangar.owned||[]).includes(mod)){ps.owned[rid]=1;ps.seen[rid]=1}let m=moduleToReactor[hangar.module];ps.eq.reactor=m&&ps.owned[m]?m:'r_stock';if(hangar.module&&hangar.module!=='none'){hangar.moduleMigrated=hangar.module;hangar.module='none'}}catch(e){ps.eq.reactor=ps.eq.reactor||'r_stock'}
 ps.v=2}
function equippedPart(slot){let ps=partState(),id=ps.eq[slot];return shipParts.find(x=>x.id===id&&ps.owned[id])||stockPart(slot)}
function equipPart(id){let ps=partState(),d=shipParts.find(x=>x.id===id);if(!d||!ps.owned[id])return false;ps.eq[d.slot]=id;ps.seen[id]=1;saveHangar();return true}
function partIsNew(id){let ps=partState();return !!ps.owned[id]&&!ps.seen[id]}
function markPartSeen(id){let ps=partState();if(ps.owned[id]&&!ps.seen[id]){ps.seen[id]=1;saveHangar()}}
function togglePartFav(id){let ps=partState();if(!ps.owned[id])return false;if(ps.fav[id])delete ps.fav[id];else ps.fav[id]=1;saveHangar();return true}

// Drops. Bosses drop from the shared pool; a sector's bosses can also drop that sector's exotic/epic, with a pity
// counter so it always arrives within a handful of boss kills there. Unowned parts are strongly preferred.
const partDropWeights=tier=>[0,52-tier*3,30+tier,12+tier*1.2,6+tier*.8];
function rollPartDrop(tier,sector){let ps=partState(),pity=ps.pity||(ps.pity={});
 let local=sector?shipParts.filter(x=>x.src===sector&&!ps.owned[x.id]):[];
 if(local.length){pity[sector]=(pity[sector]|0)+1;let chance=.12+.06*Math.max(0,pity[sector]-1);if(pity[sector]>=6||Math.random()<chance){pity[sector]=0;return local[Math.floor(Math.random()*local.length)]}}
 let w=partDropWeights(tier),tot=w.reduce((a,b)=>a+b,0),n=Math.random()*tot,r=1;for(let i=1;i<w.length;i++){n-=w[i];if(n<=0){r=i;break}}
 let pool=shipParts.filter(x=>x.r===r&&x.src==='any');if(!pool.length)pool=shipParts.filter(x=>x.src==='any'&&x.r>0);
 let fresh=pool.filter(x=>!ps.owned[x.id]);if(fresh.length&&Math.random()<.75)pool=fresh;return pool[Math.floor(Math.random()*pool.length)]}
function grantPart(d,source){let ps=partState();if(ps.owned[d.id]){let c=partRarity[d.r].scrap;hangar.credits+=c;return {part:d,scrap:c,source}}ps.owned[d.id]=1;ps.acq[d.id]=Date.now();delete ps.seen[d.id];return {part:d,scrap:0,source,fresh:true}}
