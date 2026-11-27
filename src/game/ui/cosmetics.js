// v1.7 COSMETICS: paint schemes earned through play, accent colour for part lights, surface finishes, squadron
// markings and part appearance overrides. Cosmetic only: nothing here touches stats. Stored in hangar.ship.paint:
// accent, finish, decal, look {slot: partId}, scheme. The 3D bay, the in-run ship and loadouts all read it.
const shipFinishes=[{id:'factory',name:'Factory'},{id:'gloss',name:'Gloss'},{id:'satin',name:'Satin'},{id:'matte',name:'Matte'},{id:'chrome',name:'Chrome'}];
const shipDecals=[{id:'none',name:'None'},{id:'roundel',name:'Roundel'},{id:'reactor',name:'Reactor'},{id:'star',name:'Star'},{id:'hexmark',name:'Hex mark'}];
// Schemes set a whole livery at once. `need` returns true when earned; `how` says how to earn it.
const shipSchemes=[
 {id:'factory',name:'Factory',p:{hull:'',accent:'',pattern:'none',finish:'factory',decal:'none',trail:'standard',trailColor:''},how:'Always available',need:()=>true},
 {id:'neon',name:'Neon Expanse',p:{hull:'#65fbd2',accent:'#ff6fd8',pattern:'edge',patternColor:'#ff6fd8',finish:'gloss',decal:'roundel'},how:'Defeat a boss in Neon Expanse',need:()=>(hangar.campaign?.best?.grid||0)>=1},
 {id:'storm',name:'Storm Relay',p:{hull:'#7ff0ff',accent:'#ffe46a',pattern:'chevrons',patternColor:'#ffe46a',finish:'satin',decal:'star'},how:'Defeat a boss in Storm Relay',need:()=>(hangar.campaign?.best?.storm||0)>=1},
 {id:'solar',name:'Solar Throne',p:{hull:'#ffb070',accent:'#ffdc8d',pattern:'stripes',patternColor:'#ffdc8d',finish:'chrome',decal:'reactor',trail:'plasma',trailColor:'#ffb050'},how:'Defeat a boss in Solar Corona',need:()=>(hangar.campaign?.best?.solar||0)>=1},
 {id:'phantom',name:'Phantom Armada',p:{hull:'#c18aff',accent:'#ff6fd8',pattern:'tiger',patternColor:'#2a1640',finish:'matte',decal:'hexmark',trail:'ghost'},how:'Find the Phantom Drive',need:()=>!!partState().owned.e_phantom},
 {id:'veteran',name:'Veteran',p:{hull:'#e8f4ff',accent:'#ffcf64',pattern:'carbon',patternColor:'#9fb4c8',finish:'satin',decal:'star'},how:'Reach ship level 15',need:()=>shipState().lvl>=15},
 {id:'ace',name:'Reactor Ace',p:{hull:'#ff6a8e',accent:'#ffcf64',pattern:'chevrons',patternColor:'#ffcf64',finish:'gloss',decal:'reactor',trail:'sparks'},how:'Defeat 25 reactor bosses',need:()=>(hangar.bosses||0)>=25},
 {id:'shipwright',name:'Shipwright',p:{hull:'#ffdc8d',accent:'#ff6fd8',pattern:'hex',patternColor:'#ff6fd8',finish:'chrome',decal:'hexmark',trail:'ribbon'},how:'Collect 50% of all ship parts',need:()=>collectionPct()>=50},
 ...shipBranches.map(b=>({id:'cls_'+b.id,name:b.name+' livery',p:{hull:b.color,accent:'#ffffff',pattern:'edge',patternColor:b.color,finish:'gloss',decal:'roundel'},how:'Take the '+b.name+' keystone',need:()=>!!shipState().nodes[shipNodes.find(x=>x.b===b.id&&x.kind==='key').id]}))];
// Keep colours readable on the dark arena: never darker than 35% lightness.
function readableColour(hex){let h=hexToHsl(hex);return h&&h.l<35?hslToHex(h.h,h.s,35):hex}
function applyScheme(id){let sc=shipSchemes.find(x=>x.id===id);if(!sc||!sc.need())return false;let pt=shipState().paint,lvl=shipState().lvl;let p={...sc.p};if(p.trail&&(trailStyles.find(t=>t.id===p.trail)?.lvl||1)>lvl)delete p.trail;Object.assign(pt,p,{scheme:id});saveHangar();return true}
// Part appearance override: show another owned part of the same slot (or stock) while keeping the equipped part's stats.
function lookPart(slot){let pt=shipState().paint||{},ps=partState(),id=pt.look&&pt.look[slot];return id&&ps.owned[id]&&shipParts.find(x=>x.id===id&&x.slot===slot)||null}
function visualPart(slot){return lookPart(slot)||equippedPart(slot)}
// Squadron markings, drawn in hull units around (0,0): rotationally symmetric so they read the same on every hull.
function drawHullDecal(g,decal,c,size=5){if(!decal||decal==='none')return;g.save();g.strokeStyle=c;g.fillStyle=c;g.lineWidth=size*.18;g.globalAlpha=.85;
 if(decal==='roundel'){for(let r of [1,.62])g.beginPath(),g.arc(0,0,size*r,0,Math.PI*2),g.stroke();g.beginPath();g.arc(0,0,size*.28,0,Math.PI*2);g.fill()}
 else if(decal==='reactor'){g.beginPath();g.arc(0,0,size,0,Math.PI*2);g.stroke();for(let i=0;i<6;i++){let a=i*Math.PI/3;g.beginPath();g.moveTo(Math.cos(a)*size*.35,Math.sin(a)*size*.35);g.lineTo(Math.cos(a)*size*.85,Math.sin(a)*size*.85);g.stroke()}g.beginPath();g.arc(0,0,size*.22,0,Math.PI*2);g.fill()}
 else if(decal==='star'){g.beginPath();for(let i=0;i<12;i++){let a=i*Math.PI/6,r=i%2?size*.42:size;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()}
 else if(decal==='hexmark'){for(let k of [1,.55]){g.beginPath();for(let i=0;i<6;i++){let a=i*Math.PI/3+Math.PI/6;g.lineTo(Math.cos(a)*size*k,Math.sin(a)*size*k)}g.closePath();g.stroke()}}
 g.restore()}

// Inline SVG icons for the marking buttons (same shapes as drawHullDecal).
function decalSvg(id){let pts=(n,r,off=0)=>Array.from({length:n},(_,i)=>{let a=i*Math.PI*2/n+off;return (Math.cos(a)*r).toFixed(2)+','+(Math.sin(a)*r).toFixed(2)}).join(' ');
 let inner={roundel:'<circle r="5" fill="none" stroke="currentColor" stroke-width=".9"/><circle r="3.1" fill="none" stroke="currentColor" stroke-width=".9"/><circle r="1.4" fill="currentColor"/>',
  reactor:'<circle r="5" fill="none" stroke="currentColor" stroke-width=".9"/>'+[0,1,2,3,4,5].map(i=>{let a=i*Math.PI/3;return '<line x1="'+(Math.cos(a)*1.75).toFixed(2)+'" y1="'+(Math.sin(a)*1.75).toFixed(2)+'" x2="'+(Math.cos(a)*4.25).toFixed(2)+'" y2="'+(Math.sin(a)*4.25).toFixed(2)+'" stroke="currentColor" stroke-width=".9"/>'}).join('')+'<circle r="1.1" fill="currentColor"/>',
  star:'<polygon fill="currentColor" points="'+Array.from({length:12},(_,i)=>{let a=i*Math.PI/6,r=i%2?2.1:5;return (Math.cos(a)*r).toFixed(2)+','+(Math.sin(a)*r).toFixed(2)}).join(' ')+'"/>',
  hexmark:'<polygon fill="none" stroke="currentColor" stroke-width=".9" points="'+pts(6,5,Math.PI/6)+'"/><polygon fill="none" stroke="currentColor" stroke-width=".9" points="'+pts(6,2.75,Math.PI/6)+'"/>'}[id];
 return inner?'<svg viewBox="-6 -6 12 12" class="decal-ico" aria-hidden="true">'+inner+'</svg>':''}
function renderCosmeticsTop(){let sh=shipState(),pt=sh.paint;
 let schemes='<div class="cos-schemes">'+shipSchemes.map(sc=>{let ok=sc.need(),p=sc.p;return '<button class="cos-scheme'+(pt.scheme===sc.id?' on':'')+'" data-cos-scheme="'+sc.id+'" '+(ok?'':'disabled')+' title="'+esc(sc.how)+'"><i style="--a:'+(p.hull||'#65fbd2')+';--b:'+(p.accent||p.hull||'#65fbd2')+'"></i><b>'+esc(sc.name)+'</b><small>'+(ok?(pt.scheme===sc.id?'Applied':'Earned'):'🔒 '+esc(sc.how))+'</small></button>'}).join('')+'</div>';
 let finish='<div class="trail-pick cos-pick">'+shipFinishes.map(f=>'<button data-cos-finish="'+f.id+'" aria-pressed="'+((pt.finish||'factory')===f.id)+'">'+f.name+'</button>').join('')+'</div>';
 let decal='<div class="trail-pick cos-pick">'+shipDecals.map(d=>'<button data-cos-decal="'+d.id+'" aria-pressed="'+((pt.decal||'none')===d.id)+'">'+decalSvg(d.id)+d.name+'</button>').join('')+'</div>';
 let looks=partSlots.filter(q=>q.id!=='reactor').map(q=>{let eq=equippedPart(q.id),cur=pt.look?.[q.id]||'',opts=shipParts.filter(d=>d.slot===q.id&&partState().owned[d.id]);return '<label class="cos-look"><span>'+q.name+'</span><select data-cos-look="'+q.id+'"><option value="">As equipped ('+esc(eq.name)+')</option>'+opts.filter(d=>d.id!==eq.id).map(d=>'<option value="'+d.id+'"'+(cur===d.id?' selected':'')+'>Look like '+esc(d.name)+'</option>').join('')+'</select></label>'}).join('');
 return '<h4>Paint schemes</h4><p class="fine">Earned by playing. A scheme sets colours, finish, pattern and markings in one tap; change any of it afterwards.</p>'+schemes+
  '<h4>Finish</h4>'+finish+'<p class="fine">Shown on the 3D ship; in flight it adds a subtle sheen or a darker, flatter look.</p><h4>Squadron markings</h4>'+decal+
  '<h4>Part appearance</h4><p class="fine">Show another part you own in a slot. Stats always come from the equipped part.</p><div class="cos-looks">'+looks+'</div>'}
function cosmeticsClick(e){let t=e.target.closest('[data-cos-scheme],[data-cos-finish],[data-cos-decal]');if(!t||!t.closest('#pilotPicker'))return;let pt=shipState().paint;
 if(t.dataset.cosScheme){if(applyScheme(t.dataset.cosScheme)){bayBurst(readableColour(pt.hull||bayPilot().color),26);sound('reward')}}
 else if(t.dataset.cosFinish){pt.finish=t.dataset.cosFinish;pt.scheme='';saveHangar();sound('ui')}
 else if(t.dataset.cosDecal){pt.decal=t.dataset.cosDecal;pt.scheme='';saveHangar();sound('ui')}
 e.preventDefault();e.stopPropagation();renderPreflight()}
function cosmeticsChange(e){let t=e.target;if(!t.dataset||t.dataset.cosLook===undefined||!t.closest('#pilotPicker'))return;let pt=shipState().paint;pt.look=pt.look||{};if(t.value)pt.look[t.dataset.cosLook]=t.value;else delete pt.look[t.dataset.cosLook];saveHangar();renderPreflight()}
if(typeof document!=='undefined'&&typeof document.addEventListener==='function'){document.addEventListener('click',cosmeticsClick,true);document.addEventListener('change',cosmeticsChange);
}
