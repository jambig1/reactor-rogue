// v1.7 SKILL TREE presentation: who each class is, what changes if you take it, and which of your skills are
// active and how they interact with your equipment. The tree rules themselves live with shipNodes.
const classInfo={
 interceptor:{fantasy:'Strike, dash out, strike again. A knife-fighter that never stops moving.',strong:'Speed, extra dash charges, critical hits',weak:'Thin hull; punished for standing still',gear:'Twin-Burner, Nova Afterburner or Phantom Drive; Razor Fins or Phantom Wings; Light Frame'},
 juggernaut:{fantasy:'Wade into the swarm and outlast it. The fleet breaks on you.',strong:'Hull, armour, shields, survival',weak:'Slow; fights come to you',gear:'Heavy Plating, Aegis Shell or Titan Bastion; Aegis Capacitor; Fusion Core'},
 gunship:{fantasy:'Overwhelming firepower. Find a lane and hold the trigger.',strong:'Damage, fire rate, area',weak:'Takes more damage when overcharged',gear:'Heavy Mount, Siege Battery or Solar Fang; Overload Reactor; Prism Sails'},
 carrier:{fantasy:'Let the drones do the work while you collect the spoils.',strong:'Drones and satellites, pickups, credits',weak:'Weaker main weapon',gear:'Overslung Array; Ion Drive; Graviton Wings; Survey Array'}};
function classPreview(b){let sh=shipState(),cur=shipBasePilot(),next=pilots.find(x=>x.id===b.pilot)||pilots[1];if(sh.cls===b.id)return '<p class="ci-now">This is your class'+(sh.spec?' · '+pilotName(sh.spec)+' specialisation':'')+'.</p>';
 let m0=mobility[cur.id]||{},m1=mobility[next.id]||{},w=id=>defs.find(d=>d.id===id)?.name||id,row=(l,a,c,fmt=v=>v)=>a===c?'':'<span><small>'+l+'</small>'+fmt(a)+' → <b>'+fmt(c)+'</b></span>';
 let rows=row('Hull',cur.hp,next.hp)+row('Speed',cur.speed,next.speed)+row(m1.name||'Dash',m0.charges,m1.charges,v=>v+'×')+row('Starting weapon',w(cur.starter),w(next.starter));
 return '<div class="ci-preview"><small>'+(sh.cls?'Switching to '+b.name+' (needs a refund first)':'Becoming '+b.name)+' changes:</small>'+(rows||'<span>Your hull and its +10% weapon damage.</span>')+'</div>'}
function classIdentity(b){let info=classInfo[b.id];if(!info)return '';return '<section class="class-identity" style="--bc:'+b.color+'"><p class="ci-fantasy">'+esc(info.fantasy)+'</p><div class="ci-grid"><span><small>STRONG</small>'+esc(info.strong)+'</span><span><small>WEAK</small>'+esc(info.weak)+'</span><span><small>PAIRS WITH</small>'+esc(info.gear)+'</span></div>'+classPreview(b)+'</section>'}
// Every owned skill in one list, with the equipment it works with.
function activeSkills(){let sh=shipState(),owned=shipNodes.filter(d=>(sh.nodes[d.id]||0)>0);if(!owned.length)return '';
 let eq=partSlots.map(q=>equippedPart(q.id)).filter(d=>d.r>0);
 return '<section class="active-skills"><h4>Active skills · '+owned.length+'</h4><ul>'+owned.map(d=>{let r=sh.nodes[d.id],tags=nodeTags[d.id]||[],with_=eq.filter(p=>(p.tags||[]).some(t=>tags.includes(t))).map(p=>p.name);return '<li><b>'+esc(d.name)+(d.max>1?' '+r+'/'+d.max:'')+'</b><span>'+esc(d.kind==='spec'?pilotName(sh.spec)+' specialisation':d.desc)+'</span>'+(with_.length?'<em>Works with your '+esc(with_.join(', '))+'</em>':'')+'</li>'}).join('')+'</ul></section>'}
// Playstyle tags for the new skill nodes (used by equipment synergy hints too).
Object.assign(nodeTags,{i_ghost:['dash','close'],i_tempo:['dash','aggressive'],i_mast:['evasive','crit'],j_unbreak:['tank'],j_mom:['close','tank','dash'],j_mast:['tank'],g_focus:['sustained','artillery'],g_heat:['sustained','thermal'],g_mast:['sustained'],c_overclock:['drones'],c_recycle:['sustain','salvage'],c_mast:['salvage']});
