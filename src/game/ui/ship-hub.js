// v1.7 SHIP HUB. The pre-flight ship screen is the one place to manage the ship: Equipment, Skills, Crew,
// Workshop, Appearance, Loadouts and Collection, plus an engineering Stats inspection. The 3D bay stays the
// centrepiece; slot chips around it jump straight to that slot. Everything reads the shared catalogue
// (equipment-catalogue.js) and stats sheet (ship-stats.js), so numbers match the run exactly.
const hubViews=[['gear','Equipment','armour'],['skills','Skills','scholar'],['crew','Crew','seeker'],['workshop','Workshop','power'],['paint','Appearance','area'],['loadouts','Loadouts','blade'],['collection','Collection','luck']];
let gearSel='',gearFilter='all',gearRarity='all',gearSort='rarity',gearQuery='';
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Playstyle tags each class, specialisation, crew member and skill leans towards (for synergy hints).
const classTags={interceptor:['evasive','dash','crit','glass'],juggernaut:['tank','shield','close','control','sustain'],gunship:['sustained','artillery','thermal','crit','aggressive'],carrier:['drones','salvage','area','control']};
const specTags={harrier:['close','dash'],spectre:['glass','crit','dash'],sovereign:['tank','control'],glacier:['control','tank'],tempest:['area','sustained'],helios:['thermal','area'],architect:['drones','control'],echo:['control','dash']};
const crewTags={harrier:['sustained','aggressive'],bastion:['tank'],tempest:['sustained'],helios:['area','thermal'],glacier:['tank'],architect:['sustain','tank'],scavenger:['salvage'],spectre:['evasive','dash'],echo:['salvage','control'],sovereign:['salvage']};
const crewSpeciality={harrier:'Weapons',bastion:'Defence',tempest:'Weapons',helios:'Reactor',glacier:'Defence',architect:'Engineering',scavenger:'Salvage',spectre:'Navigation',echo:'Navigation',sovereign:'Command'};
const nodeTags={i_reflex:['dash'],i_burn:['evasive'],i_thrust:['evasive'],i_crit:['crit'],i_key:['glass'],j_shield:['shield'],j_spikes:['close'],j_hull:['tank'],j_armour:['tank'],j_key:['tank'],g_crit:['crit'],g_area:['area'],g_dmg:['sustained'],g_rate:['sustained'],g_key:['aggressive'],c_drones:['drones'],c_sats:['drones'],c_magnet:['salvage'],c_greed:['salvage'],c_key:['drones']};
const tagNames={evasive:'evasive',dash:'dash',crit:'critical hits',glass:'glass cannon',tank:'tank',shield:'shields',close:'close range',control:'crowd control',sustain:'recovery',sustained:'sustained fire',artillery:'artillery',thermal:'heat weapons',aggressive:'aggression',drones:'drones',salvage:'salvage',area:'area damage'};

// Up to four short, specific hints about how a part fits the current build. Warnings are included.
function partSynergies(d){if(!d)return [];let sh=shipState(),out=[],tags=d.tags||[];
 let cls=sh.cls,ct=classTags[cls]||[],hit=tags.filter(t=>ct.includes(t));if(hit.length)out.push({good:1,t:'Suits your '+(shipBranches.find(x=>x.id===cls)?.name||'')+' class ('+hit.map(t=>tagNames[t]).join(', ')+').'});
 if(sh.spec){let st=specTags[sh.spec]||[],h=tags.filter(t=>st.includes(t));if(h.length)out.push({good:1,t:pilotName(sh.spec)+' specialisation likes '+h.map(t=>tagNames[t]).join(' and ')+'.'})}
 for(let id of crewAssigned()){let h=tags.filter(t=>(crewTags[id]||[]).includes(t));if(h.length){out.push({good:1,t:'Crew: '+crewName(id)+' ('+crewInfo[id].role+') backs '+tagNames[h[0]]+'.'});break}}
 for(let q of partSlots){if(q.id===d.slot)continue;let o=equippedPart(q.id),h=tags.filter(t=>(o.tags||[]).includes(t));if(h.length&&o.r>0){out.push({good:1,t:'Pairs with your '+o.name+' ('+tagNames[h[0]]+').'});break}}
 let nodes=sh.nodes||{};for(let [nid,nt] of Object.entries(nodeTags))if(nodes[nid]&&tags.some(t=>nt.includes(t))){out.push({good:1,t:'Builds on your '+shipNodes.find(x=>x.id===nid).name+' skill.'});break}
 // Specific interactions worth knowing.
 let starter=shipBasePilot().starter;
 if(d.sig==='solarFang')out.push(thermalWeapons.includes(starter)?{good:1,t:'Your starting '+(defs.find(x=>x.id===starter)?.name||'weapon')+' is a heat/energy weapon: +30%.'}:{good:0,t:'Your starting '+(defs.find(x=>x.id===starter)?.name||'weapon')+' is not heat/energy: −10% until you pick heat weapons.'});
 if(d.sig==='capacitor'&&nodes.j_shield)out.push({good:0,t:'Overlaps with your Shield Generator skill: both fit the same Energy Shield.'});
 if(d.sig==='siegeLock'&&(ct.includes('evasive')||nodes.i_reflex))out.push({good:0,t:'Siege Lock rewards standing still; your build likes to keep moving.'});
 if(d.sig==='bulwark'&&nodes.i_key)out.push({good:0,t:'Glass Cannon cuts hull by 40%; Bulwark wants you in the thick of it.'});
 if(d.st&&d.st.wslots!==undefined){let cur=equippedPart('mount').st.wslots;if(d.st.wslots!==cur)out.push({good:d.st.wslots>cur?1:0,t:(d.st.wslots>cur?'+':'')+(d.st.wslots-cur)+' weapon slot'+(Math.abs(d.st.wslots-cur)>1?'s':'')+' compared with your current mount.'})}
 if(d.st&&d.st.pslots!==undefined){let cur=equippedPart('plating').st.pslots;if(d.st.pslots!==cur)out.push({good:d.st.pslots>cur?1:0,t:(d.st.pslots>cur?'+':'')+(d.st.pslots-cur)+' passive slot'+(Math.abs(d.st.pslots-cur)>1?'s':'')+' compared with your current plating.'})}
 return out.slice(0,5)}

// Chips around the 3D bay: the five slots, colour-coded by the equipped part's rarity. Tap to manage that slot.
function hubBaySlots(){let ps=partState(),side=(ids,cls)=>'<div class="bay-slots '+cls+'">'+ids.map(id=>{let q=partSlots.find(x=>x.id===id),d=equippedPart(id),n=shipParts.filter(x=>x.slot===id&&partIsNew(x.id)).length;return '<button class="bay-slot'+(shipView==='gear'&&partSlotView===id?' on':'')+'" data-hub-slot="'+id+'" style="--rc:'+partRarity[d.r].c+'" aria-label="'+q.name+': '+esc(d.name)+'"><small>'+q.name.toUpperCase()+(n?' <i class="new-dot">'+n+'</i>':'')+'</small><b>'+esc(d.name)+'</b></button>'}).join('')+'</div>';
 return side(['wings','engine','reactor'],'left')+side(['mount','plating'],'right')}

function hubNav(){return '<nav class="ship-views hub-views" role="tablist">'+hubViews.map(([id,n,ic])=>{let badge=id==='gear'?shipParts.filter(x=>partIsNew(x.id)).length:id==='skills'?shipState().pts:0;return '<button role="tab" data-ship-view="'+id+'" aria-selected="'+(shipView===id)+'" aria-pressed="'+(shipView===id)+'"><i class="sv-ico">'+equipmentIcon(ic)+'</i>'+n+(badge?'<em class="hub-badge">'+badge+'</em>':'')+'</button>'}).join('')+'</nav>'}

// ---- Equipment ----
function gearList(slot){let ps=partState(),q=gearQuery.trim().toLowerCase();let list=shipParts.filter(d=>d.slot===slot);
 list=list.filter(d=>{let own=!!ps.owned[d.id];if(gearFilter==='owned'&&!own)return false;if(gearFilter==='new'&&!partIsNew(d.id))return false;if(gearFilter==='fav'&&!ps.fav[d.id])return false;if(gearFilter==='missing'&&own)return false;if(gearRarity!=='all'&&d.r!==+gearRarity)return false;if(q&&!(own&&d.name.toLowerCase().includes(q))&&!(d.tags||[]).some(t=>(tagNames[t]||t).includes(q)))return false;return true});
 let key={rarity:d=>-d.r*100-partLevel(d.id),level:d=>-partLevel(d.id)*10-d.r,recent:d=>-(ps.acq[d.id]||0),name:d=>0}[gearSort]||(d=>0);
 list.sort((a,b)=>(ps.eq[slot]===b.id)-(ps.eq[slot]===a.id)||(!!ps.owned[b.id])-(!!ps.owned[a.id])||key(a)-key(b)||a.name.localeCompare(b.name));return list}
function gearTile(d){let ps=partState(),own=!!ps.owned[d.id],eq=ps.eq[d.slot]===d.id,lv=partLevel(d.id),rc=partRarity[d.r];
 return '<button class="gear-tile'+(own?'':' unknown')+(eq?' equipped':'')+(gearSel===d.id?' sel':'')+'" data-gear-pick="'+d.id+'" style="--rc:'+rc.c+'" data-name="'+esc(own?d.name.toLowerCase():'')+'">'+
  '<span class="gt-art"><img src="'+partSrc(d.id)+'" alt="" loading="lazy"></span>'+
  '<span class="gt-meta"><small>'+rc.name.toUpperCase()+(eq?' · EQUIPPED':'')+'</small><b>'+(own?esc(d.name):'Undiscovered')+'</b>'+
  (own?'<span class="gt-pips">'+(d.r>0?[1,2,3,4,5].map(k=>'<u class="'+(k<=lv?'on':'')+'"></u>').join(''):'')+'</span>':'<span class="gt-src">'+esc(partSrcLabel(d))+'</span>')+'</span>'+
  (partIsNew(d.id)?'<em class="gt-new">NEW</em>':'')+(ps.fav[d.id]?'<em class="gt-fav" aria-label="Favourite">★</em>':'')+'</button>'}
function gearInspector(d){if(!d)return '<div class="gear-inspect empty"><p>Select a part to inspect it.</p></div>';let ps=partState(),own=!!ps.owned[d.id],eq=ps.eq[d.slot]===d.id,lv=partLevel(d.id),rc=partRarity[d.r],slot=partSlots.find(q=>q.id===d.slot);
 if(!own)return '<div class="gear-inspect unknown" style="--rc:'+rc.c+'"><div class="gi-art"><img src="'+partSrc(d.id)+'" alt=""></div><div class="gi-head"><small>'+rc.name.toUpperCase()+' · '+slot.name.toUpperCase()+'</small><h3>Undiscovered part</h3><p class="gi-src">Where to look: <b>'+esc(partSrcLabel(d))+'</b></p><p class="fine">'+rc.role+'</p></div></div>';
 let cmp=eq?[]:partComparison(d.id),sig=d.sig&&partSigs[d.sig];
 let rows=cmp.length?'<table class="gi-compare"><thead><tr><th>Stat</th><th>Now</th><th></th><th>With this</th><th>Change</th></tr></thead><tbody>'+cmp.map(r=>'<tr class="'+(r.better?'up':'down')+'"><td>'+r.label+'</td><td>'+r.fmt(r.cur)+'</td><td>→</td><td>'+r.fmt(r.next)+'</td><td>'+(r.better?'▲':'▼')+' '+fmtDelta(r)+'</td></tr>').join('')+'</tbody></table>':eq?'<p class="gi-eq">Equipped. Its effect is included in your stats.</p>':'<p class="fine">No stat change compared with your current '+slot.name.toLowerCase()+'.</p>';
 let cur=equippedPart(d.slot),lost=!eq&&cur.sig&&cur.sig!==d.sig?'<p class="gi-lose">You would lose <b>'+partSigs[cur.sig].name+'</b> from '+esc(cur.name)+'.</p>':'';
 let syn=partSynergies(d).map(x=>'<li class="'+(x.good?'good':'warn')+'">'+esc(x.t)+'</li>').join('');
 let up=d.r>0?(lv>=5?'<span class="gi-max">Fully upgraded</span>':'<button class="gi-up" data-gear-upgrade="'+d.id+'" '+(hangar.credits<partUpgradeCost(d)?'disabled':'')+'>Upgrade to +'+(lv+1)+' · '+partUpgradeCost(d)+' credits</button>'):'';
 return '<div class="gear-inspect" style="--rc:'+rc.c+'"><div class="gi-art"><img src="'+partSrc(d.id)+'" alt=""></div><div class="gi-head"><small>'+rc.name.toUpperCase()+' · '+slot.name.toUpperCase()+(lv?' · +'+lv:'')+'</small><h3>'+esc(d.name)+'</h3><p class="gi-lore">'+esc(d.lore||'')+'</p></div>'+
  '<p class="gi-stats">'+esc(partStatLine(d,lv))+'</p>'+rows+lost+(sig?'<div class="gi-sig"><b>'+sig.name+'</b><span>'+sig.desc+'</span><small>'+(lv>=5?'Upgraded: ':'At +5: ')+sig.lv5+'</small></div>':'')+(syn?'<ul class="gi-syn">'+syn+'</ul>':'')+
  '<div class="gi-actions">'+(eq?'<span class="gi-eqd">✓ Equipped</span>':'<button class="primary" data-gear-equip="'+d.id+'">Equip</button>')+up+'<button class="gi-favb" data-gear-fav="'+d.id+'" aria-pressed="'+!!ps.fav[d.id]+'">'+(ps.fav[d.id]?'★ Favourite':'☆ Favourite')+'</button></div>'+
  '<p class="gi-src fine">Source: '+esc(partSrcLabel(d))+(ps.acq[d.id]?' · found '+new Date(ps.acq[d.id]).toLocaleDateString():'')+'</p></div>'}
function fmtDelta(r){let d=r.delta;if(['hull','armour','speed','wslots','pslots','dashes'].includes(r.id))return (d>0?'+':'')+Math.round(d);if(r.id==='dashCd')return (d>0?'+':'')+(Math.round(d*10)/10)+' s';if(r.id==='regen')return (d>0?'+':'')+(Math.round(d*100)/100)+'/s';return (d>0?'+':'')+Math.round(d*100)+'%'}
function renderGearView(){let ps=partState(),slot=partSlotView;if(!partSlots.some(q=>q.id===slot))slot=partSlotView='engine';let q=partSlots.find(x=>x.id===slot),list=gearList(slot);if(!gearSel||shipParts.find(x=>x.id===gearSel)?.slot!==slot)gearSel=ps.eq[slot];
 let slots='<div class="gear-slots" role="tablist">'+partSlots.map(x=>{let d=equippedPart(x.id),n=shipParts.filter(p=>p.slot===x.id&&partIsNew(p.id)).length;return '<button role="tab" data-hub-slot="'+x.id+'" aria-selected="'+(x.id===slot)+'" style="--rc:'+partRarity[d.r].c+'"><img src="'+partSrc(d.id)+'" alt=""><span><small>'+x.name.toUpperCase()+'</small><b>'+esc(d.name)+'</b></span>'+(n?'<em class="hub-badge">'+n+'</em>':'')+'</button>'}).join('')+'</div>';
 let owned=shipParts.filter(d=>d.slot===slot&&ps.owned[d.id]).length,total=shipParts.filter(d=>d.slot===slot).length;
 let tools='<div class="gear-tools"><input id="gearSearch" type="search" placeholder="Search parts or playstyle" value="'+esc(gearQuery)+'" aria-label="Search parts">'+
  '<select data-gear-set="filter" aria-label="Show">'+[['all','All'],['owned','Owned'],['new','New'],['fav','Favourites'],['missing','Undiscovered']].map(([v,n])=>'<option value="'+v+'"'+(gearFilter===v?' selected':'')+'>'+n+'</option>').join('')+'</select>'+
  '<select data-gear-set="rarity" aria-label="Rarity"><option value="all">Any rarity</option>'+partRarity.map((r,i)=>'<option value="'+i+'"'+(gearRarity===String(i)?' selected':'')+'>'+r.name+'</option>').join('')+'</select>'+
  '<select data-gear-set="sort" aria-label="Sort">'+[['rarity','Sort: rarity'],['level','Sort: upgrade level'],['recent','Sort: recently found'],['name','Sort: name']].map(([v,n])=>'<option value="'+v+'"'+(gearSort===v?' selected':'')+'>'+n+'</option>').join('')+'</select></div>';
 return slots+testFlightButtons()+'<p class="gear-role"><b>'+q.name+'</b> · '+q.role+' <span>'+owned+' / '+total+' found</span></p>'+tools+'<div class="gear-body"><div class="gear-grid">'+(list.length?list.map(gearTile).join(''):'<p class="fine">Nothing matches these filters.</p>')+'</div>'+gearInspector(shipParts.find(x=>x.id===gearSel))+'</div>'}

// ---- Engineering stats ----
function renderStatsView(){let sheet=shipStatSheet(),groups=[...new Set(sheet.map(r=>r.group))];
 return '<div class="hub-stats"><p class="fine">Permanent ship statistics at launch, from your hull, skills, crew and parts. Level-up upgrades during a run add on top of these.</p>'+groups.map(g=>'<section><h4>'+g+'</h4>'+sheet.filter(r=>r.group===g).map(r=>'<div class="hs-row"><span class="hs-label">'+r.label+(r.help?' <i title="'+esc(r.help)+'">?</i>':'')+'</span><b>'+r.fmt(r.value)+'</b><span class="hs-parts">'+r.parts.slice(1).map(p=>'<em class="'+((r.lower?p.d<0:p.d>0)?'up':'down')+'">'+esc(p.name)+' '+fmtDelta({id:r.id,delta:p.d})+'</em>').join('')+'</span></div>').join('')+'</section>').join('')+'</div>'}

// ---- Workshop (inline, with exact next-level preview and milestones) ----
function renderWorkshopView(){let ps=partState(),owned=shipParts.filter(d=>d.r>0&&ps.owned[d.id]).sort((a,b)=>(ps.eq[b.slot]===b.id)-(ps.eq[a.slot]===a.id)||b.r-a.r);
 if(!owned.length)return '<p class="fine">Find parts from bosses and the Lost Signal outpost, then upgrade them here.</p>';
 return '<p class="fine hub-intro">Upgrades scale a part\'s helpful values by 12% per level (never its drawbacks) and stay with the part, so nothing is lost when you swap. +3 adds a polished finish; +5 upgrades signature mechanics. '+hangar.credits.toLocaleString()+' credits.</p><div class="ws-list hub-ws">'+owned.map(d=>{let lv=partLevel(d.id),max=lv>=5,cost=partUpgradeCost(d),eq=ps.eq[d.slot]===d.id,next=max?'':'<span class="ws-next">Next: '+esc(partStatLine(d,lv+1))+(lv+1===3?' · polished finish':'')+(lv+1===5&&d.sig?' · '+partSigs[d.sig].name+': '+partSigs[d.sig].lv5:'')+'</span>';
  return '<div class="ws-row" style="--rc:'+partRarity[d.r].c+'"><img src="'+partSrc(d.id)+'" alt=""><div><small>'+partRarity[d.r].name.toUpperCase()+' · '+partSlots.find(q=>q.id===d.slot).name.toUpperCase()+(eq?' · EQUIPPED':'')+'</small><b>'+esc(d.name)+' <i>+'+lv+'</i></b><span>'+esc(partStatLine(d,lv))+'</span>'+next+'<span class="ws-pips">'+[1,2,3,4,5].map(k=>'<u class="'+(k<=lv?'on':'')+(k===3||k===5?' ms':'')+'"></u>').join('')+'</span></div><button data-gear-upgrade="'+d.id+'" '+(max||hangar.credits<cost?'disabled':'')+'>'+(max?'MAX':'Upgrade<br><small>'+cost+' credits</small>')+'</button></div>'}).join('')+'</div>'}

// ---- Crew (inline, with specialities and which builds they help) ----
function renderCrewView(){let html=crewQuarters();let rows=crewOwned().map(id=>'<li><b>'+crewName(id)+'</b> · '+crewSpeciality[id]+' · '+crewInfo[id].perk+' · suits '+(crewTags[id]||[]).map(t=>tagNames[t]).join(', ')+'</li>').join('');
 return html+(rows?'<h4>Crew and your build</h4><ul class="crew-syn">'+rows+'</ul>':'')}

// ---- First-time guidance: one short card per view, dismissed for good once read ----
const hubHints={
 gear:'Tap a slot on the ship to see the parts that fit it. Pick one to compare it with what you have on, then Equip. Parts drop from runs; spend scrap to upgrade them.',
 skills:'Earn skill points by levelling your ship. Pick a class branch: its key node unlocks techniques, and masteries open at 11 points. The first refund is free.',
 crew:'Crew give passive bonuses. Assign them to stations; their tags show which of your parts and skills they work best with.',
 workshop:'Workshop milestones reward you for using parts. Fly with a part to level its mastery and unlock rewards.',
 paint:'Pick a colour scheme, finish and markings. Hangar look keeps your in-flight ship matching the 3D model; Classic neon brings back the glowing style.',
 loadouts:'Save your current parts, skills and paint as a loadout, then switch between builds in one tap.',
 collection:'Every part, scheme and marking you have found. Completing sets earns titles.',
 stats:'Every stat on your ship and where it comes from.'};
function hubHint(){let h=hubHints[shipView],sh=shipState();if(!h||(sh.hints||{})[shipView])return '';return '<div class="hub-hint" role="note"><b>Tip</b><span>'+esc(h)+'</span><button type="button" data-hint-ok="'+shipView+'">Got it</button></div>'}
function hintClick(e){let t=e.target.closest&&e.target.closest('[data-hint-ok]');if(!t)return;let sh=shipState();(sh.hints||(sh.hints={}))[t.dataset.hintOk]=1;try{saveHangar()}catch(_){}e.preventDefault();e.stopPropagation();let c=t.closest('.hub-hint');if(c)c.remove()}
// ---- Dispatch ----
function hubBody(){if(shipView==='gear')return renderGearView();if(shipView==='stats')return renderStatsView();if(shipView==='workshop')return renderWorkshopView();if(shipView==='crew')return renderCrewView();if(shipView==='loadouts')return typeof renderLoadoutsView==='function'?renderLoadoutsView():renderLoadouts();if(shipView==='paint')return renderCosmeticsTop()+'<h4>Colours</h4>'+renderPaintView();if(shipView==='collection')return typeof renderCollectionView==='function'?renderCollectionView():'';return null}

function hubClick(e){let t=e.target.closest('[data-hub-slot],[data-gear-pick],[data-gear-equip],[data-gear-fav],[data-gear-upgrade],[data-hub-stats],[data-hangar-action]');if(!t||!t.closest('#pilotPicker'))return;
 if(t.dataset.hubSlot){shipView='gear';partSlotView=t.dataset.hubSlot;gearSel='';partPreview=''}
 else if(t.dataset.gearPick){let d=shipParts.find(x=>x.id===t.dataset.gearPick),ps=partState();gearSel=d.id;markPartSeen(d.id);partPreview=ps.owned[d.id]&&ps.eq[d.slot]!==d.id?d.id:'';try{sound('ui')}catch(_){}}
 else if(t.dataset.gearEquip){let d=shipParts.find(x=>x.id===t.dataset.gearEquip);if(equipPart(d.id)){partPreview='';bayFx.scan=.001;bayBurst(partRarity[d.r].c,14+d.r*8,d.slot);sound(d.r>=4?'evolve':'cacheOpen')}}
 else if(t.dataset.gearFav){togglePartFav(t.dataset.gearFav);sound('ui')}
 else if(t.dataset.gearUpgrade){let d=shipParts.find(x=>x.id===t.dataset.gearUpgrade);if(upgradePart(d.id)){sound('level');bayBurst(partRarity[d.r].c,18,d.slot)}}
 else if(t.dataset.hubStats){shipView=shipView==='stats'?'gear':'stats';partPreview=''}
 else if(t.dataset.hangarAction){hangarAction(t.dataset.hangarAction,t.dataset.id)}
 else return;
 e.preventDefault();e.stopPropagation();selectedPilot=preflightShip=treePilot();renderPreflight()}
function hubChange(e){let t=e.target;if(!t.closest||!t.closest('#pilotPicker'))return;if(t.dataset&&t.dataset.gearSet){let k=t.dataset.gearSet,v=t.value;if(k==='filter')gearFilter=v;if(k==='rarity')gearRarity=v;if(k==='sort')gearSort=v;renderPreflight()}}
// Searching filters tiles in place so the field keeps focus while typing.
function hubInput(e){let t=e.target;if(t.id!=='gearSearch')return;gearQuery=t.value;let q=gearQuery.trim().toLowerCase();for(let el of document.querySelectorAll('#pilotPicker .gear-tile')){let d=shipParts.find(x=>x.id===el.dataset.gearPick),own=partState().owned[d.id];el.hidden=!!q&&!(own&&d.name.toLowerCase().includes(q))&&!(d.tags||[]).some(x=>(tagNames[x]||x).includes(q))}}
if(typeof document!=='undefined'&&typeof document.addEventListener==='function'){document.addEventListener('click',hubClick,true);document.addEventListener('click',hintClick,true);document.addEventListener('change',hubChange);document.addEventListener('input',hubInput)}
