// v1.7 SHIP PROGRESSION: discovery reveal, named loadouts, the equipment collection and test flights.
// All of it reads the shared catalogue; none of it creates a new currency.

// ---- Discovery reveal (after a run that found new parts). Skippable, one screen, rarity-coloured. ----
function partRevealAfterRun(){if(typeof document==='undefined'||!document.body||!s||s.dev?.test)return;let fresh=(s.partDrops||[]).filter(x=>x.fresh&&x.part).sort((a,b)=>b.part.r-a.part.r);if(!fresh.length)return;
 let top=fresh[0],d=top.part,rc=partRarity[d.r],sig=d.sig&&partSigs[d.sig],slot=partSlots.find(q=>q.id===d.slot);
 let el=document.getElementById('partReveal');if(!el){el=document.createElement('div');el.id='partReveal';el.className='overlay part-reveal';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','New ship part');document.body.appendChild(el)}
 el.style.setProperty('--rc',rc.c);el.dataset.r=d.r;
 el.innerHTML='<div class="panel pr-panel"><div class="eyebrow">'+(fresh.length>1?fresh.length+' NEW SHIP PARTS':'NEW SHIP PART')+' · '+esc(top.source||'Recovered')+'</div>'+
  '<div class="pr-art"><img src="'+partSrc(d.id)+'" alt=""></div><small class="pr-rar">'+rc.name.toUpperCase()+' · '+slot.name.toUpperCase()+'</small><h2>'+esc(d.name)+'</h2><p class="pr-stats">'+esc(partStatLine(d,0))+'</p>'+
  (sig?'<div class="gi-sig"><b>'+sig.name+'</b><span>'+sig.desc+'</span></div>':'')+'<p class="gi-lore">'+esc(d.lore||'')+'</p>'+
  (fresh.length>1?'<div class="pr-more">'+fresh.slice(1).map(x=>'<span style="--rc:'+partRarity[x.part.r].c+'"><img src="'+partSrc(x.part.id)+'" alt=""><b>'+esc(x.part.name)+'</b><small>'+partRarity[x.part.r].name+'</small></span>').join('')+'</div>':'')+
  '<div class="actions"><button id="prSkip">Continue</button><button class="primary" id="prInspect">Inspect and fit →</button></div></div>';
 el.classList.remove('hidden');try{sound(d.r>=4?'evolve':d.r>=2?'cacheOpen':'reward')}catch(e){}
 let close=()=>{el.classList.add('hidden')};$('prSkip').onclick=close;el.onclick=e=>{if(e.target===el)close()};
 $('prInspect').onclick=()=>{close();shipView='gear';partSlotView=d.slot;gearSel=d.id;gearFilter='all';try{if(typeof openPreflight==='function'){backToStart();openPreflight()}}catch(e){}};
 try{$('prInspect').focus()}catch(e){}}

// ---- Named loadouts: parts, appearance and crew. Skills are not swapped (they cost points to change). ----
// Save backups refuse text containing < > & " ' (so a backup can never inject markup); keep every name we store safe.
function safeSaveText(t){return String(t==null?'':t).replace(/[<>&"']/g,'')}
function shipLoadouts(){let sh=shipState();if(!Array.isArray(sh.loadouts2)){sh.loadouts2=[];for(let L of sh.loadouts||[])if(L&&L.eq)sh.loadouts2.push({name:safeSaveText(L.label||'Loadout').slice(0,24),eq:{...L.eq},paint:{...(L.paint||{})},crew:[]})}for(let L of sh.loadouts2)if(L&&typeof L.name==='string'&&L.name!==safeSaveText(L.name))L.name=safeSaveText(L.name);if(typeof sh.name==='string'&&sh.name!==safeSaveText(sh.name))sh.name=safeSaveText(sh.name);for(let L of sh.loadouts||[])if(L&&typeof L.label==='string')L.label=safeSaveText(L.label);return sh.loadouts2}
let loadoutMsg='',loadoutRename=-1;
function snapshotLoadout(name){let ps=partState(),sh=shipState();return {name:safeSaveText(name||'Loadout').slice(0,24),eq:{...ps.eq},paint:JSON.parse(JSON.stringify(sh.paint||{})),crew:[...crewAssigned()]}}
function saveNewLoadout(){let L=shipLoadouts();if(L.length>=8)return false;L.push(snapshotLoadout(shipClassName()+' · '+equippedPart('engine').name.split(' ')[0]+' '+(L.length+1)));saveHangar();return true}
function applyLoadout(i){let L=shipLoadouts()[i];if(!L)return null;let ps=partState(),missing=[];for(let q of partSlots){let id=L.eq?.[q.id];if(!id)continue;if(ps.owned[id])ps.eq[q.id]=id;else missing.push(shipParts.find(x=>x.id===id)?.name||id)}
 let sh=shipState();sh.paint={...sh.paint,...(L.paint||{})};if(Array.isArray(L.crew)){let own=crewOwned();sh.crew=L.crew.filter(id=>own.includes(id)).slice(0,crewSeats());let gone=L.crew.filter(id=>!own.includes(id));if(gone.length)missing.push(...gone.map(crewName))}saveHangar();return missing}
function renderLoadoutsView(){let L=shipLoadouts();
 return '<p class="fine hub-intro">A loadout saves your parts, appearance and crew. Skills stay as they are, because changing them costs a refund. Parts you no longer own are skipped and listed.</p>'+(loadoutMsg?'<p class="build-status">'+esc(loadoutMsg)+'</p>':'')+
  '<div class="lo-list">'+L.map((x,i)=>{let parts=partSlots.map(q=>shipParts.find(p=>p.id===x.eq?.[q.id])).filter(Boolean),bad=parts.filter(p=>!partState().owned[p.id]);return '<div class="lo-row'+(bad.length?' warn':'')+'"><div class="lo-art">'+parts.map(p=>'<img src="'+partSrc(p.id)+'" alt="" title="'+esc(p.name)+'" style="--rc:'+partRarity[p.r].c+'">').join('')+'</div><div class="lo-meta">'+(loadoutRename===i?'<input class="lo-name" data-lo-name="'+i+'" maxlength="24" value="'+esc(x.name)+'">':'<b>'+esc(x.name)+'</b>')+'<small>'+parts.filter(p=>p.r>0).map(p=>esc(p.name)).join(' · ')+(x.crew?.length?' · crew: '+x.crew.map(crewName).join(', '):'')+(bad.length?' · missing: '+bad.map(p=>esc(p.name)).join(', '):'')+'</small></div><div class="lo-act"><button class="primary" data-lo-load="'+i+'">Load</button><button data-lo-save="'+i+'" title="Overwrite with your current ship">Save</button><button data-lo-dup="'+i+'" '+(L.length>=8?'disabled':'')+'>Duplicate</button><button data-lo-ren="'+i+'">Rename</button><button data-lo-del="'+i+'" aria-label="Delete loadout">✕</button></div></div>'}).join('')+'</div>'+
  '<button class="lo-new" data-lo-new="1" '+(L.length>=8?'disabled':'')+'>+ Save current ship as a new loadout ('+L.length+' / 8)</button>'}

// ---- Collection: completion, sources and titles (titles are cosmetic, never stat bonuses). ----
const collectionTitles=[[25,'Scavenger'],[50,'Field Engineer'],[75,'Quartermaster'],[100,'Shipwright Prime']];
function collectionPct(){let ps=partState(),all=shipParts.filter(d=>d.r>0);return Math.round(all.filter(d=>ps.owned[d.id]).length/all.length*100)}
function renderCollectionView(){let ps=partState(),pct=collectionPct(),sh=shipState();
 let bySlot=partSlots.map(q=>{let all=shipParts.filter(d=>d.slot===q.id&&d.r>0),got=all.filter(d=>ps.owned[d.id]).length;return '<div class="col-slot"><span>'+q.name+'</span><i><u style="width:'+Math.round(got/all.length*100)+'%"></u></i><b>'+got+' / '+all.length+'</b></div>'}).join('');
 let byRar=partRarity.slice(1).map((r,i)=>{let all=shipParts.filter(d=>d.r===i+1),got=all.filter(d=>ps.owned[d.id]).length;return '<span style="--rc:'+r.c+'"><b>'+got+'/'+all.length+'</b>'+r.name+'</span>'}).join('');
 let sectorsHtml=[...new Set(shipParts.filter(d=>d.src!=='any'&&d.src!=='start').map(d=>d.src))].map(sec=>{let list=shipParts.filter(d=>d.src===sec);return '<div class="col-sector"><b>'+esc(sectorName(sec))+'</b>'+list.map(d=>'<span class="'+(ps.owned[d.id]?'got':'')+'" style="--rc:'+partRarity[d.r].c+'"><img src="'+partSrc(d.id)+'" alt="">'+(ps.owned[d.id]?esc(d.name):'Unknown '+partRarity[d.r].name.toLowerCase()+' '+partSlots.find(q=>q.id===d.slot).name.toLowerCase())+'</span>').join('')+'<small>'+(sectorOpen(sec)?'Its bosses can drop these; each boss there without one raises the chance, guaranteed within 6.':'Sector locked.')+'</small></div>'}).join('');
 let titles=collectionTitles.map(([n,t])=>{let got=pct>=n;return '<button class="col-title'+(sh.title===t?' on':'')+'" data-col-title="'+t+'" '+(got?'':'disabled')+'>'+(got?'':'🔒 ')+t+'<small>'+n+'%</small></button>'}).join('');
 return '<div class="col-head"><div class="col-ring" style="--p:'+pct+'"><b>'+pct+'%</b><small>collected</small></div><div class="col-bars">'+bySlot+'</div></div><div class="col-rar">'+byRar+'</div>'+
  '<h4>Sector equipment</h4><p class="fine">Common to Legendary parts can drop from any boss and turn up at the Lost Signal outpost. Some parts only exist in one sector:</p><div class="col-sectors">'+sectorsHtml+'</div>'+
  '<h4>Titles</h4><p class="fine">Shown under your ship\'s name. Cosmetic only.</p><div class="col-titles">'+titles+(sh.title?'<button class="col-title" data-col-title="">No title</button>':'')+'</div>'}

// ---- Test flight: your current ship, no credits, XP, parts, records or missions (it is a developer test run). ----
function startTestFlight(kind){if(!['preflight','hangar','menu'].includes(state))return false;let pilot=treePilot(),sector=sectorOpen(hangar.sector)?hangar.sector:'grid';
 for(let id of ['preflight','hangar','menu','end','records','settings'])try{show(id,false)}catch(e){}
 if(kind==='boss'){quickTest('boss',null,false,{pilot,sector})}else{devLaunch={pilot,sector};start()}
 if(!s)return false;s.dev.test=true;s.dev.sim=true;s.hangarReport='Test flight. No credits, ship XP, parts, records or missions are earned.';try{$('devRunBadge').textContent='TEST FLIGHT · NO REWARDS'}catch(e){}return true}
function testFlightButtons(){return '<div class="hub-sim"><b>Test flight</b><span>Fly this exact ship with no rewards and no risk. Quit from the pause menu to come back.</span><button data-sim="waves">Waves</button><button data-sim="boss">Boss duel</button></div>'}

function progressionClick(e){let t=e.target.closest('[data-lo-load],[data-lo-save],[data-lo-dup],[data-lo-ren],[data-lo-del],[data-lo-new],[data-col-title],[data-sim]');if(!t||!t.closest('#pilotPicker'))return;let L=shipLoadouts(),i;
 if(t.dataset.loLoad!==undefined){let miss=applyLoadout(+t.dataset.loLoad);loadoutMsg=miss&&miss.length?'Loaded "'+L[+t.dataset.loLoad].name+'". Not available any more, kept your current: '+miss.join(', ')+'.':'Loaded "'+L[+t.dataset.loLoad].name+'".';bayFx.scan=.001;bayBurst('#65f7ef',30);sound('cacheOpen')}
 else if(t.dataset.loSave!==undefined){i=+t.dataset.loSave;L[i]={...snapshotLoadout(L[i].name)};saveHangar();loadoutMsg='Saved your current ship into "'+L[i].name+'".';sound('reward')}
 else if(t.dataset.loDup!==undefined){i=+t.dataset.loDup;if(L.length<8){L.splice(i+1,0,{...JSON.parse(JSON.stringify(L[i])),name:(L[i].name+' copy').slice(0,24)});saveHangar();loadoutMsg='Duplicated. Load it, change things, then Save.'}}
 else if(t.dataset.loRen!==undefined){loadoutRename=+t.dataset.loRen}
 else if(t.dataset.loDel!==undefined){i=+t.dataset.loDel;if(t.dataset.armed){L.splice(i,1);saveHangar();loadoutMsg='Loadout deleted.'}else{t.dataset.armed='1';t.textContent='Delete?';e.preventDefault();e.stopPropagation();return}}
 else if(t.dataset.loNew){if(saveNewLoadout()){loadoutMsg='Saved as a new loadout.';sound('reward')}}
 else if(t.dataset.colTitle!==undefined){shipState().title=t.dataset.colTitle;saveHangar();sound('ui')}
 else if(t.dataset.sim){e.preventDefault();e.stopPropagation();startTestFlight(t.dataset.sim);return}
 e.preventDefault();e.stopPropagation();renderPreflight()}
function progressionChange(e){let t=e.target;if(t.dataset&&t.dataset.loName!==undefined){let L=shipLoadouts(),i=+t.dataset.loName;if(L[i]){L[i].name=safeSaveText(t.value.trim()||L[i].name).slice(0,24);saveHangar()}loadoutRename=-1;renderPreflight()}}
if(typeof document!=='undefined'&&typeof document.addEventListener==='function'){document.addEventListener('click',progressionClick,true);document.addEventListener('change',progressionChange)}
