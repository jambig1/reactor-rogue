// v0.61 boss art: the Neon Expanse reactors and the final boss share the player's material language:
// dark layered hull plates, a neon edge in the boss colour, lit vents, a glowing core and visible damage.
// Drawn in local units (radius about 50) facing +x; drawPresentedBoss supplies rotation and scale. Cosmetic only.
function bossArtV2(e){return !!e}
const bossArt={
 hull(points,e,o={}){let a=bossArtPalette(e),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  let g=ctx.createLinearGradient(x0,y0,x1*.3+x0*.7,y1);g.addColorStop(0,o.light||a.plateLight);g.addColorStop(1,o.dark||a.plateDark);
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  ctx.lineJoin='round';ctx.strokeStyle='#03070e';ctx.lineWidth=(o.key??3.2)*1.15;ctx.stroke();ctx.fillStyle=g;ctx.fill();
  // Panel seams on large plates, like the player's plated hull.
  {let w=x1-x0,hh=y1-y0;if(w*hh>260&&o.seams!==false){ctx.save();ctx.clip();let along=w>=hh,step=along?Math.max(7,w/5):Math.max(7,hh/5);for(let k=(along?x0:y0)+step;k<(along?x1:y1)-2;k+=step){let off=(Math.round(k*7)%3)*.25;ctx.strokeStyle='rgba(2,6,12,.55)';ctx.lineWidth=1;ctx.beginPath();if(along){ctx.moveTo(k,y0);ctx.lineTo(k+hh*off*.2,y1)}else{ctx.moveTo(x0,k);ctx.lineTo(x1,k+w*off*.2)}ctx.stroke();ctx.strokeStyle='rgba(215,236,255,.12)';ctx.beginPath();if(along){ctx.moveTo(k+1,y0);ctx.lineTo(k+1+hh*off*.2,y1)}else{ctx.moveTo(x0,k+1);ctx.lineTo(x1,k+1+w*off*.2)}ctx.stroke()}ctx.restore();ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath()}
  if(w*hh>380&&o.greeble!==false){let cx=(x0+x1)/2,cy=(y0+y1)/2,along=w>=hh,L=along?w:hh,S=along?hh:w,seed=Math.abs(Math.round(cx*3+cy*7));ctx.save();ctx.clip();
   // raised sub-panel
   let pw=along?L*.38:S*.5,ph=along?S*.5:L*.38,px=cx-pw/2+(along?-L*.12:0),py=cy-ph/2+(along?0:-L*.12);let g2=ctx.createLinearGradient(px,py,px,py+ph);g2.addColorStop(0,a.plateMid);g2.addColorStop(1,a.plateLight);ctx.fillStyle='#03070e';ctx.fillRect(px-.8,py-.8,pw+1.6,ph+1.6);ctx.fillStyle=g2;ctx.fillRect(px,py,pw,ph);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(px,py,pw,1);
   // accent strip and lights
   let sx=along?cx+L*.16:cx-S*.3,sy=along?cy-S*.3:cy+L*.16;ctx.fillStyle='#03070e';ctx.fillRect(sx-1,sy-1,(along?L*.22:S*.6)+2,(along?S*.6:L*.22)+2);ctx.save();ctx.shadowColor=a.c;ctx.shadowBlur=graphicsShadow(5);ctx.fillStyle=a.c;ctx.globalAlpha*=.85;ctx.fillRect(sx,sy,along?L*.22:1.3,along?1.3:L*.22);ctx.restore();
   for(let k=0;k<3;k++){let t2=(k+1)/4;circle(along?x0+L*t2:x0+S*.18,along?y0+S*.18:y0+L*t2,.9,(seed+k)%3===0?a.c:'rgba(220,238,255,.55)')}
   ctx.restore();ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath()}}
  if(o.edge!==false){ctx.save();if(o.glow){ctx.shadowColor=a.c;ctx.shadowBlur=graphicsShadow(o.glow*1.3)}ctx.strokeStyle=o.edgeColor||a.c;ctx.globalAlpha*=Math.min(1,(o.edgeAlpha??.9)+.2);ctx.lineWidth=(o.edgeWidth??1.3)*(o.glow?1.7:1.35);ctx.stroke();ctx.restore()}
  // Bevel: a faint lit inset towards the light.
  let cx=xs.reduce((v,x)=>v+x,0)/xs.length,cy=ys.reduce((v,y)=>v+y,0)/ys.length;ctx.beginPath();points.forEach((p,i)=>{let x=cx+(p[0]-cx)*.82,y=cy+(p[1]-cy)*.82;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.strokeStyle='rgba(205,232,255,.2)';ctx.lineWidth=1.1;ctx.stroke()},
 line(x,y,bx,by,c,w=1,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(bx,by);ctx.stroke();ctx.restore()},
 vent(x,y,w,h,n,e,heat=0){let a=bossArtPalette(e);ctx.fillStyle='#04080f';ctx.fillRect(x,y,w,h);for(let i=0;i<n;i++){let yy=y+(i+.5)*h/n;bossArt.line(x+1,yy,x+w-1,yy,heat>0?a.hot:a.c,Math.max(.8,h/n*.45),.45+.55*heat)}},
 light(x,y,r,c,on=1){ctx.save();ctx.globalAlpha*=.22*on;circle(x,y,r*2.4,c);ctx.restore();circle(x,y,r,'#04080f');ctx.save();ctx.globalAlpha*=.4+.6*Math.max(0,Math.min(1,on));circle(x,y,r*.7,c);ctx.restore();circle(x-r*.2,y-r*.2,r*.28,'#ffffff')},
 core(r,e,t,o={}){let a=bossArtPalette(e),pulse=.5+.5*Math.sin(t*(a.hot2?7:2.6)),charge=o.charge||0;
  let g=ctx.createRadialGradient(0,0,0,0,0,r*2.2);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.25,a.c+'aa');g.addColorStop(1,a.c+'00');ctx.save();ctx.globalAlpha*=.5+.3*pulse+.4*charge;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*2.2,0,TAU);ctx.fill();ctx.restore();
  circle(0,0,r+3,'#03070e');circle(0,0,r+1.5,a.plateDark);ctx.save();ctx.strokeStyle=a.c;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,r+1.5,0,TAU);ctx.stroke();ctx.restore();
  let g2=ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);g2.addColorStop(0,'#ffffff');g2.addColorStop(.35+.15*pulse,a.hot2?a.hot:a.c);g2.addColorStop(1,a.deep);ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,0,r*(.86+.08*pulse+.1*charge),0,TAU);ctx.fill()},
 chargeRing(r,e,p){if(!(p>0))return;ctx.save();ctx.strokeStyle='#fff0c9';ctx.lineWidth=2.2;ctx.shadowColor='#fff0c9';ctx.shadowBlur=graphicsShadow(8);ctx.beginPath();ctx.arc(0,0,r,-Math.PI/2,-Math.PI/2+Math.max(.02,p*TAU));ctx.stroke();ctx.restore()},
 damage(e,t,R){let ratio=e.hp/e.max;if(ratio>=.5)return;let a=bossArtPalette(e),flick=.6+.4*Math.sin(t*13+e.r);
  ctx.save();ctx.lineCap='round';let cracks=ratio<.3?[[-.2,-.5,.15,-.25,.05,0],[.45,.1,.2,.3,.3,.55],[-.5,.3,-.25,.15,-.1,.35]]:[[-.2,-.5,.15,-.25,.05,0]];
  for(let k of cracks){bossArt.line(k[0]*R,k[1]*R,k[2]*R,k[3]*R,'#03070e',3);bossArt.line(k[2]*R,k[3]*R,k[4]*R,k[5]*R,'#03070e',3);bossArt.line(k[0]*R,k[1]*R,k[2]*R,k[3]*R,a.hot,1.2,flick);bossArt.line(k[2]*R,k[3]*R,k[4]*R,k[5]*R,a.hot,1.2,flick)}
  if(ratio<.3){ctx.globalAlpha=.18*flick;circle(R*.2,R*.35,R*.18,a.hot)}ctx.restore()},
 flash(e,draw){if(!(e.glow>0&&graphicsFlash()>.5))return;ctx.save();ctx.globalAlpha=.35;ctx.globalCompositeOperation='lighter';draw();ctx.restore()}
};
const bossArtPlates={grid:['#3f5b78','#1f3047'],belt:['#6e5f4e','#33291f'],storm:['#57518a','#2a2650'],foundry:['#715447','#36241f'],cryo:['#4c7894','#21405a'],city:['#56598a','#282b4c']};
function bossArtMix(hex,k){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return '#'+[r,g,b].map(v=>Math.round(v*k).toString(16).padStart(2,'0')).join('')}
function bossArtBlend(x,y,k){let a=parseInt(x.slice(1),16),b=parseInt(y.slice(1),16);return '#'+[16,8,0].map(s=>Math.round((a>>s&255)*(1-k)+(b>>s&255)*k).toString(16).padStart(2,'0')).join('')}
function bossArtPalette(e){let frozen=e.freeze>0,c=frozen?'#d4f7ff':e.c,pl=bossArtPlates[e.finalBoss?'grid':e.sectorBoss||'grid']||bossArtPlates.grid;return {c,frozen,hot:'#ffcf8f',hot2:e.hp<e.max*.5,deep:frozen?'#4d7f99':bossArtDeep[e.kind]||bossArtMix(c,.42),plateLight:frozen?'#4f6f86':bossArtBlend(pl[0],c,.22),plateDark:frozen?'#22384b':bossArtBlend(pl[1],c,.1),plateMid:bossArtBlend(pl[0],'#ffffff',.12)}}
const bossArtDeep={warden:'#7a1f5b',reaper:'#145f87',engine:'#8a4416',final:'#173a52'};
function drawBossArtV2(e,t){let clock=reducedMotion||e.freeze>0?0:t,charge=bossChargeProgress(e),a=bossArtPalette(e);ctx.save();ctx.lineJoin='round';ctx.shadowBlur=0;
 // Soft cast shadow so the hull sits above the arena.
 if(e.kind==='reaper')drawRailReaperArt(e,clock,charge,a);else if(e.kind==='engine')drawSingularityEngineArt(e,clock,charge,a);else drawPrismWardenArt(e,clock,charge,a);
 bossArt.damage(e,clock,40);ctx.restore()}
function drawPrismWardenArt(e,t,charge,a){
 // Eight prism pylons with a broken guard ring between them.
 ctx.save();ctx.strokeStyle='#03070e';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,40,0,TAU);ctx.stroke();ctx.strokeStyle=a.c;ctx.globalAlpha=.35;ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
 for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);
  bossArt.hull([[26,-8.5],[42,-6.5],[48,0],[42,6.5],[26,8.5]],e,{edgeAlpha:.75});bossArt.line(24,0,38,0,'#03070e',2.4);bossArt.line(25,0,37,0,a.c,1,.55+.45*charge);
  let tip=.6+.4*Math.sin(t*3+i*.8)+charge*.6;ctx.save();ctx.shadowColor=a.c;ctx.shadowBlur=graphicsShadow(10*tip);poly([[44,0],[50,-4.5],[55,0],[50,4.5]],a.c,'#03070e',1.4);ctx.restore();poly([[50,-4.5],[55,0],[50,0]],'#ffffff');ctx.restore()}
 let oct=Array.from({length:8},(_,i)=>[Math.cos(i*TAU/8+TAU/16)*33,Math.sin(i*TAU/8+TAU/16)*33]);bossArt.hull(oct,e,{glow:10,edgeWidth:1.6});
 let inner=oct.map(p=>[p[0]*.72,p[1]*.72]);bossArt.hull(inner,e,{dark:'#0a121d',light:'#1b2a3d',edgeAlpha:.5});
 for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);bossArt.line(14,0,22,0,'#03070e',2.5);bossArt.line(15,0,22,0,a.c,.8,.5);ctx.restore()}
 ctx.save();ctx.rotate(-t*.6);for(let i=0;i<8;i++){let on=.5+.5*Math.sin(t*4-i*.785);ctx.save();ctx.rotate(i*TAU/8);bossArt.light(27,0,1.6,a.c,on);ctx.restore()}ctx.restore();
 bossArt.core(10,e,t,{charge});ctx.save();ctx.rotate(t*.4);poly([[0,-11],[7,0],[0,11],[-7,0]],'#ffe1f2','#03070e',1);poly([[0,-11],[-7,0],[0,2]],'#ffffff');poly([[0,2],[7,0],[0,11]],a.c);ctx.restore();
 bossArt.chargeRing(16,e,charge)}
function drawRailReaperArt(e,t,charge,a){
 // Twin rail barrels flank an armoured carriage; the rails fill with light as a shot charges.
 for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
  bossArt.hull([[-30,14],[-8,12],[4,18],[-4,22],[-30,22]],e,{edgeAlpha:.5});
  bossArt.hull([[-40,19],[44,19],[52,23],[44,29],[-40,29],[-44,24]],e,{glow:6});
  ctx.fillStyle='#03070e';ctx.fillRect(-34,22.5,74,3);let fill=charge>0?charge:.25+.1*Math.sin(t*3);let g=ctx.createLinearGradient(-34,0,40,0);g.addColorStop(0,a.c);g.addColorStop(1,'#ffffff');ctx.save();ctx.shadowColor=a.c;ctx.shadowBlur=graphicsShadow(8);ctx.fillStyle=g;ctx.globalAlpha=.5+.5*fill;ctx.fillRect(-34,23,74*Math.min(1,fill+.05),2);ctx.restore();
  for(let j=0;j<5;j++)bossArt.line(-30+j*15,19.5,-30+j*15,21.5,'#03070e',1.4);
  bossArt.light(50,24,2.2,a.c,.6+.4*charge);
  bossArt.hull([[-42,8],[-32,6],[-30,14],[-46,16]],e,{edgeAlpha:.4,key:2.4});
 ctx.restore()}
 // Engines.
 for(let y of [-9,0,9]){let f=.7+.3*Math.sin(t*23+y);ctx.save();let g=ctx.createLinearGradient(-44,0,-62,0);g.addColorStop(0,'#ffffff');g.addColorStop(.3,a.c);g.addColorStop(1,a.c+'00');ctx.fillStyle=g;ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(-42,y-3.2);ctx.lineTo(-42-16*f,y);ctx.lineTo(-42,y+3.2);ctx.fill();ctx.restore();ctx.fillStyle='#03070e';ctx.fillRect(-44,y-3.5,5,7)}
 bossArt.hull([[42,0],[24,-11],[18,-17],[-30,-17],[-41,-10],[-41,10],[-30,17],[18,17],[24,11]],e,{glow:10,edgeWidth:1.6});
 bossArt.hull([[30,0],[16,-7],[-30,-8],[-34,0],[-30,8],[16,7]],e,{dark:'#0a121d',light:'#1e2f44',edgeAlpha:.55});
 for(let x of [-24,-16,-8])bossArt.vent(x,-12.5,5,4,2,e,e.hp<e.max*.5?1:0),bossArt.vent(x,8.5,5,4,2,e,e.hp<e.max*.5?1:0);
 ctx.save();ctx.shadowColor=a.c;ctx.shadowBlur=graphicsShadow(6);poly([[36,0],[27,-3],[22,0],[27,3]],a.c,'#03070e',1);ctx.restore();
 ctx.save();ctx.translate(-6,0);bossArt.core(7,e,t,{charge});ctx.restore();bossArt.line(2,0,20,0,'#03070e',3);bossArt.line(3,0,20,0,a.c,1,.7);
 ctx.save();ctx.translate(-6,0);bossArt.chargeRing(11,e,charge);ctx.restore()}
function drawSingularityEngineArt(e,t,charge,a){
 // A segmented torus carrying three nacelles around a black-hole core.
 for(let i=0;i<12;i++){ctx.save();ctx.rotate(i*TAU/12);let w=TAU/12*.42;bossArt.hull([[Math.cos(-w)*36,Math.sin(-w)*36],[Math.cos(-w)*48,Math.sin(-w)*48],[Math.cos(w)*48,Math.sin(w)*48],[Math.cos(w)*36,Math.sin(w)*36]],e,{edgeAlpha:.55,key:2.6});bossArt.vent(39,-2,6,4,2,e,(e.hp<e.max*.5?.6:0)+.3*Math.max(0,Math.sin(t*2+i)));ctx.restore()}
 for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*TAU/3+TAU/6);bossArt.hull([[30,-9],[44,-13],[54,-6],[54,6],[44,13],[30,9]],e,{glow:6});bossArt.line(36,-5,50,-5,'#03070e',2);bossArt.line(36,5,50,5,'#03070e',2);bossArt.light(48,0,2.6,a.c,.6+.4*Math.sin(t*4+i));ctx.restore()}
 let hex=Array.from({length:6},(_,i)=>[Math.cos(i*TAU/6)*30,Math.sin(i*TAU/6)*30]);bossArt.hull(hex,e,{glow:10,edgeWidth:1.6});
 ctx.save();ctx.rotate(-t*.7);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);bossArt.hull([[15,-4],[25,-6],[25,6],[15,4]],e,{dark:'#0a121d',light:'#1e2f44',edgeAlpha:.45,key:2});ctx.restore()}ctx.restore();
 // Singularity: dark centre with a bright accretion swirl.
 let g=ctx.createRadialGradient(0,0,4,0,0,20);g.addColorStop(0,'#000000');g.addColorStop(.45,'#05070d');g.addColorStop(.62,a.c);g.addColorStop(.75,a.c+'55');g.addColorStop(1,a.c+'00');ctx.save();ctx.globalAlpha=.85+.15*charge;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.fill();ctx.restore();
 ctx.save();ctx.rotate(t*1.6);ctx.strokeStyle='#fff3dc';ctx.lineWidth=1.3;for(let i=0;i<3;i++){ctx.rotate(TAU/3);ctx.beginPath();ctx.arc(0,0,12.5,0,1.3);ctx.stroke()}ctx.restore();circle(0,0,7.5,'#000000');
 bossArt.chargeRing(23,e,charge)}
// Final boss: solid armour ring and inner citadel in the same material.
// v0.78 final boss designs: one silhouette per sector (local units ~50 = boss radius). The shared core,
// phase-3 cracks and charge ring are drawn on top by drawFinalBossArt. Cosmetic only.
const FP=(n,r,rot=0)=>Array.from({length:n},(_,i)=>[Math.cos(rot+i*TAU/n)*r,Math.sin(rot+i*TAU/n)*r]);
const finalDesigns={
 // THE SCRAP MONARCH: a crowned salvage fortress with four grabbing crane arms.
 belt(e,t,a,hot){const H=(p,o)=>bossArt.hull(p,e,o);
  ctx.save();ctx.rotate(t*.12);for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4+TAU/8);let reach=.5+.5*Math.sin(t*1.4+i*1.6);
   H([[30,-5],[50,-4],[50,4],[30,5]],{greeble:false,seams:false,key:2.4});bossArt.line(31,0,49,0,a.c,1,.5);H([[47,-4],[56+reach*4,-11],[60+reach*4,-5],[52,0]],{glow:4,seams:false,greeble:false});H([[47,4],[56+reach*4,11],[60+reach*4,5],[52,0]],{glow:4,seams:false,greeble:false});bossArt.light(49,0,2.2,a.c,.85);ctx.restore()}ctx.restore();
  H([[-26,-24],[26,-24],[30,-14],[30,14],[26,24],[-26,24],[-30,14],[-30,-14]],{glow:10});
  for(let i=-2;i<=2;i++)H([[i*10-4,-24],[i*10,-34-(i%2?0:6)],[i*10+4,-24]],{glow:6,seams:false,greeble:false});
  for(let i=0;i<3;i++)bossArt.vent(-20+i*14,14,9,5,3,e,hot?1:0);bossWindows(-22,-16,6,2,4,3,a.c,t,7)},
 // HEART OF THE STORM: a caged storm core with three tesla rods and crawling arcs.
 storm(e,t,a,hot){const H=(p,o)=>bossArt.hull(p,e,o);let rods=FP(3,40,t*.5);
  ctx.save();ctx.rotate(-t*.2);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);H([[20,-4],[34,-10],[36,-2],[22,3]],{edgeAlpha:.7,seams:false,greeble:false});ctx.restore()}ctx.restore();
  H(FP(8,24,t*.1),{glow:12});
  rods.forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(y,x));H([[-7,-5],[9,-4],[11,0],[9,4],[-7,5]],{glow:8,seams:false});bossArt.light(10,0,2.6,'#ffffff',.7+.3*Math.sin(t*9+i));ctx.restore()});
  for(let i=0;i<3;i++){let [x,y]=rods[i],[x2,y2]=rods[(i+1)%3];bossArc(x,y,x2,y2,a.c,t,i,1.6,.85);bossArc(x*.55,y*.55,x,y,'#ffffff',t,i+5,1,.6)}},
 // THE PRIME FURNACE: a crucible with a molten window, four stacks and turning vent rings.
 foundry(e,t,a,hot){const H=(p,o)=>bossArt.hull(p,e,o);
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4+TAU/8);H([[24,-8],[46,-7],[46,7],[24,8]],{glow:4});let f=.6+.4*Math.sin(t*7+i*2);ctx.save();ctx.globalAlpha=f;let g=ctx.createRadialGradient(48,0,0,48,0,10);g.addColorStop(0,'#fff2c0');g.addColorStop(.4,'#ff9a3a');g.addColorStop(1,'#ff4a1000');circle(49,0,10,g);ctx.restore();ctx.restore()}
  H(FP(8,33,TAU/16),{glow:12});ctx.save();ctx.rotate(t*.35);for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);bossArt.vent(26,-3,6,6,2,e,1);ctx.restore()}ctx.restore();
  let g=ctx.createRadialGradient(0,0,2,0,0,21);g.addColorStop(0,'#fff6d0');g.addColorStop(.35,'#ffb04a');g.addColorStop(1,'#a8320a');circle(0,0,21,g);ctx.strokeStyle='#1a0d06';ctx.lineWidth=2.4;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*7,-19);ctx.lineTo(i*7,19);ctx.stroke()}},
 // THE FROZEN SUN: a blazing pale core ringed by long faceted ice spears.
 cryo(e,t,a,hot){ctx.save();ctx.rotate(t*.08);for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);let L=i%2?44:56;bossFacet([[16,-5],[L,0],[16,5],[12,0]],e,i%2?'#bfefff':null);if(i%2===0){bossFacet([[30,-2],[40,-11],[36,-1]],e,'#dff8ff');bossFacet([[30,2],[40,11],[36,1]],e,'#dff8ff')}ctx.restore()}ctx.restore();
  ctx.save();ctx.globalAlpha=.35+.15*Math.sin(t*2);let g=ctx.createRadialGradient(0,0,0,0,0,34);g.addColorStop(0,'#ffffff');g.addColorStop(.4,'#bff3ff');g.addColorStop(1,'#bff3ff00');circle(0,0,34,g);ctx.restore();
  bossArt.hull(FP(6,19,t*-.2),e,{glow:14,light:'#dff8ff',dark:'#5aa8c8'})},
 // METROPLEX MIND: a floating district of towers around a thinking dome.
 city(e,t,a,hot){const H=(p,o)=>bossArt.hull(p,e,o);let towers=[[-30,-22,12,18],[18,-30,14,16],[22,14,12,20],[-28,12,14,16],[-6,-40,10,12],[-6,30,12,12],[34,-6,10,14],[-42,-4,10,12]];
  H([[-38,-30],[30,-38],[42,-6],[34,30],[-6,42],[-40,26]],{glow:10});
  for(let [x,y,w,h] of towers){H([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],{seams:false,greeble:false,key:2});bossWindows(x+2,y+2,Math.max(1,Math.floor((w-3)/4)),Math.max(1,Math.floor((h-3)/4)),3,3,a.c,t,x+y)}
  ctx.save();ctx.globalAlpha=.9;let g=ctx.createRadialGradient(-4,-4,2,0,0,17);g.addColorStop(0,'#ffffff');g.addColorStop(.4,a.c);g.addColorStop(1,bossArtMix(a.c,.35));circle(0,0,17,g);ctx.restore();
  ctx.strokeStyle=a.c;ctx.globalAlpha=.6;ctx.lineWidth=1.2;for(let i=0;i<4;i++){let q=t*1.3+i*TAU/4;ctx.beginPath();ctx.ellipse(0,0,22,8,q,0,TAU);ctx.stroke()}ctx.globalAlpha=1},
 // SOLAR THRONE: a crescent throne cupping a star, solar sails fanned like rays.
 solar(e,t,a,hot){ctx.save();ctx.rotate(Math.sin(t*.4)*.15);for(let i=-3;i<=3;i++){ctx.save();ctx.rotate(Math.PI+i*.32);let g=ctx.createLinearGradient(20,0,54,0);g.addColorStop(0,'#2b4a7a');g.addColorStop(1,'#152544');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(22,-4);ctx.lineTo(54,-7);ctx.lineTo(54,7);ctx.lineTo(22,4);ctx.closePath();ctx.fill();ctx.strokeStyle='#03070e';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#7fb2ff66';ctx.lineWidth=.8;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(22+k*8,-5);ctx.lineTo(22+k*8,5);ctx.stroke()}ctx.restore()}ctx.restore();
  bossArt.hull([[-12,-40],[14,-34],[30,-16],[34,0],[30,16],[14,34],[-12,40],[2,24],[12,0],[2,-24]],e,{glow:12});
  let p=.5+.5*Math.sin(t*3),g=ctx.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'#fffbe6');g.addColorStop(.35,'#ffd27a');g.addColorStop(.7,'#ff8a2a88');g.addColorStop(1,'#ff6a0000');ctx.save();ctx.globalAlpha=.75+.25*p;circle(-6,0,30,g);ctx.restore()},
 // THE SINGULARITY: an accretion disc around a black core, obsidian shards falling inward.
 rift(e,t,a,hot){for(let i=0;i<9;i++){let q=t*(.5+i*.04)+i*2.1,r=44-((t*6+i*9)%26);ctx.save();ctx.translate(Math.cos(q)*r,Math.sin(q)*r);ctx.rotate(q*2);bossArt.hull([[-6,-3],[6,-2],[3,3],[-5,2]],e,{seams:false,greeble:false,key:2,edgeAlpha:.6});ctx.restore()}
  ctx.save();ctx.rotate(.4);ctx.scale(1,.42);ctx.rotate(t*.6);for(let k=0;k<3;k++){ctx.strokeStyle=k===1?'#ffd9a0':a.c;ctx.globalAlpha=.55-k*.12;ctx.lineWidth=7-k*2;ctx.beginPath();ctx.arc(0,0,34+k*6,0,TAU);ctx.stroke()}ctx.restore();ctx.globalAlpha=1;
  let g=ctx.createRadialGradient(0,0,10,0,0,26);g.addColorStop(0,'#000000');g.addColorStop(.7,'#000000');g.addColorStop(.85,bossArtMix(a.c,.6));g.addColorStop(1,'#00000000');circle(0,0,26,g)},
 // THE OVERMIND: a lobed brain-hive with grasping tendrils and glowing nodes.
 hive(e,t,a,hot){ctx.save();ctx.lineCap='round';for(let i=0;i<7;i++){let q=i*TAU/7+Math.sin(t*.7+i)*.2;ctx.strokeStyle='#03070e';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(Math.cos(q)*24,Math.sin(q)*24);let mx=Math.cos(q+.35*Math.sin(t*1.3+i))*42,my=Math.sin(q+.35*Math.sin(t*1.3+i))*42,ex=Math.cos(q+.6*Math.sin(t+i))*56,ey=Math.sin(q+.6*Math.sin(t+i))*56;ctx.quadraticCurveTo(mx,my,ex,ey);ctx.stroke();ctx.strokeStyle=bossArtMix(a.c,.55);ctx.lineWidth=4;ctx.stroke();bossArt.light(ex,ey,2.2,a.c,.6+.4*Math.sin(t*4+i))}ctx.restore();
  for(let i=0;i<5;i++){let q=i*TAU/5+t*.05;bossArt.hull(FP(7,15,i).map(([x,y])=>[x+Math.cos(q)*15,y+Math.sin(q)*15]),e,{glow:8,seams:false})}
  for(let i=0;i<6;i++){let q=i*1.9+t*.3;bossArt.light(Math.cos(q)*16,Math.sin(q)*16,2.6,'#e6ff8a',.5+.5*Math.sin(t*5+i*2))}},
 // THE PHANTOM ARMADA: a spectral flagship with a ghost echo of itself and gun decks along its flanks.
 ghost(e,t,a,hot){const hullPts=[[-46,-10],[-30,-20],[24,-18],[50,-4],[50,4],[24,18],[-30,20],[-46,10]];
  ctx.save();ctx.globalAlpha=.25+.1*Math.sin(t*2);ctx.translate(Math.sin(t*1.1)*5,-8+Math.cos(t*.9)*3);bossArt.hull(hullPts,e,{seams:false,greeble:false,light:'#8affc0',dark:'#1d5a40',key:1.4});ctx.restore();
  bossArt.hull(hullPts,e,{glow:10});for(let side of [-1,1]){ctx.save();ctx.scale(1,side);for(let i=0;i<3;i++){bossArt.hull([[-24+i*16,14],[-14+i*16,14],[-14+i*16,24],[-24+i*16,24]],e,{seams:false,greeble:false,key:2});bossArt.line(-19+i*16,24,-19+i*16,32,a.c,2,.8)}ctx.restore()}
  bossArt.hull([[-18,-8],[14,-8],[20,0],[14,8],[-18,8]],e,{light:'#3a4a42',dark:'#151c18',seams:false});bossWindows(-14,-5,6,2,3,3,a.c,t,11);for(let i=0;i<2;i++)bossEngine(-46,(i?1:-1)*6,4,a.c,t,16,i)}
};
function drawFinalBossArt(e,t){let a=bossArtPalette(e),R=e.r,s1=R/50,hot=e.phase===3;ctx.save();ctx.scale(s1,s1);ctx.lineJoin='round';
 let design=finalDesigns[s.sector];if(design){try{design(e,t,a,hot)}catch(err){}if(s.sector!=='rift')bossArt.core(13,{...e,hp:hot?0:e.hp},t,{charge:bossChargeProgress(e)});else bossArt.light(0,0,3,'#ffffff',.6+.4*Math.sin(t*5));if(hot){ctx.save();ctx.strokeStyle=a.hot;ctx.lineWidth=1.4;for(let i=0;i<5;i++){let q=i*1.37;ctx.globalAlpha=.6+.4*Math.sin(t*11+i);ctx.beginPath();ctx.moveTo(Math.cos(q)*15,Math.sin(q)*15);ctx.lineTo(Math.cos(q+.2)*25,Math.sin(q+.2)*25);ctx.lineTo(Math.cos(q-.1)*32,Math.sin(q-.1)*32);ctx.stroke()}ctx.restore()}bossArt.chargeRing(19,e,bossChargeProgress(e));ctx.restore();return}
 ctx.save();ctx.rotate(t*.18);for(let i=0;i<12;i++){ctx.save();ctx.rotate(i*TAU/12);let w=TAU/12*.4;bossArt.hull([[Math.cos(-w)*37,Math.sin(-w)*37],[Math.cos(-w*.8)*51,Math.sin(-w*.8)*51],[Math.cos(w*.8)*51,Math.sin(w*.8)*51],[Math.cos(w)*37,Math.sin(w)*37]],e,{glow:i%3===0?6:0,edgeAlpha:i%3===0?.95:.55});if(i%3===0)bossArt.light(45,0,2.4,hot?a.hot:a.c,.6+.4*Math.sin(t*3+i));else bossArt.vent(41,-2.5,6,5,2,e,hot?1:0);ctx.restore()}ctx.restore();
 ctx.save();ctx.rotate(-t*.32);let hex=Array.from({length:6},(_,i)=>[Math.cos(i*TAU/6)*33,Math.sin(i*TAU/6)*33]);bossArt.hull(hex,e,{glow:12,edgeWidth:1.8});
 for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6+TAU/12);bossArt.hull([[17,-5],[28,-7],[28,7],[17,5]],e,{dark:'#0a121d',light:'#1e2f44',edgeAlpha:.5,key:2});ctx.restore()}ctx.restore();
 bossArt.core(13,{...e,hp:hot?0:e.hp},t,{charge:bossChargeProgress(e)});
 if(hot){ctx.save();ctx.strokeStyle=a.hot;ctx.lineWidth=1.4;for(let i=0;i<5;i++){let q=i*1.37;ctx.globalAlpha=.6+.4*Math.sin(t*11+i);ctx.beginPath();ctx.moveTo(Math.cos(q)*15,Math.sin(q)*15);ctx.lineTo(Math.cos(q+.2)*25,Math.sin(q+.2)*25);ctx.lineTo(Math.cos(q-.1)*32,Math.sin(q-.1)*32);ctx.stroke()}ctx.restore()}
 bossArt.chargeRing(19,e,bossChargeProgress(e));
 ctx.restore()}
// v0.62 sector boss designs: each reactor gets its own silhouette in the shared boss material.
// Local units (radius about 50), facing +x; radial designs are spun by drawPresentedBoss. Cosmetic only.
function bossArc(x,y,bx,by,c,t,seed=0,w=1.4,alpha=1){let n=6,dx=bx-x,dy=by-y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,step=Math.floor(t*14+seed*7);ctx.save();ctx.globalAlpha*=alpha;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.shadowColor=c;ctx.shadowBlur=graphicsShadow(8);ctx.beginPath();ctx.moveTo(x,y);for(let i=1;i<n;i++){let k=i/n,j=Math.sin((step+i)*12.9898+seed*78.233)*43758.5453;j=(j-Math.floor(j)-.5)*len*.22;ctx.lineTo(x+dx*k+nx*j,y+dy*k+ny*j)}ctx.lineTo(bx,by);ctx.stroke();ctx.restore()}
function bossFacet(points,e,tint){let a=bossArtPalette(e),c=tint||a.c,xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);let g=ctx.createLinearGradient(Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys));g.addColorStop(0,'#ffffff');g.addColorStop(.35,c);g.addColorStop(1,bossArtMix(c,.35));ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.lineJoin='round';ctx.strokeStyle='#03070e';ctx.lineWidth=2.4;ctx.stroke();ctx.fillStyle=g;ctx.globalAlpha*=.92;ctx.fill();ctx.globalAlpha/=.92;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=.8;ctx.stroke()}
function bossWindows(x,y,cols,rows,w,h,c,t,seed=0){for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){let v=Math.sin((i*7+j*13+seed)*1.7),on=v>-.3,flick=Math.sin(t*2+i*3+j*5+seed)>.92;ctx.fillStyle=on&&!flick?c:'#0b1222';ctx.globalAlpha=on?.85:1;ctx.fillRect(x+i*(w+1.2),y+j*(h+1.2),w,h);ctx.globalAlpha=1}}
function bossEngine(x,y,r,c,t,len=14,seed=0){let f=.75+.25*Math.sin(t*23+seed*2.1);let g=ctx.createLinearGradient(x,0,x-len*f,0);g.addColorStop(0,'#ffffff');g.addColorStop(.3,c);g.addColorStop(1,c+'00');ctx.save();ctx.fillStyle=g;ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x-len*f,y);ctx.lineTo(x,y+r);ctx.fill();ctx.restore();ctx.fillStyle='#03070e';ctx.fillRect(x-1.5,y-r-.6,4,r*2+1.2)}
function bossFins(e,x,y,len,sweep=.55,w=7){for(let side of [-1,1]){ctx.save();ctx.scale(1,side);bossArt.hull([[x,y],[x+w,y],[x-len*sweep+w*.3,y+len],[x-len*sweep-w*.6,y+len*.92],[x-w*.4,y+len*.25]],e,{glow:6,greeble:false,seams:false});bossArt.line(x+w*.2,y+2,x-len*sweep+w*.1,y+len-3,bossArtPalette(e).c,1,.7);ctx.restore()}}
function bossSpikes(e,n,r0,r1,w=5,offset=0){for(let i=0;i<n;i++){ctx.save();ctx.rotate(offset+i*TAU/n);bossArt.hull([[r0,-w],[r1,0],[r0,w]],e,{glow:6,greeble:false,seams:false});ctx.restore()}}
const bossDesigns={
 // SHATTERED BELT: salvage pirates.
 'belt/corsair'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);let open=.25+.2*Math.sin(t*2)+ch*.5;bossFins(e,-20,12,20,.9,6);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
   H([[-6,10],[26,14],[30,20],[-4,20]],{edgeAlpha:.6});bossArt.line(0,15,26,17,'#03070e',1.5);
   ctx.save();ctx.translate(30,18);ctx.rotate(-open);H([[0,-4],[16,-6],[22,-1],[14,1],[16,5],[0,5]],{glow:6});bossArt.light(17,-2,1.4,a.c,.7);ctx.restore();
   ctx.save();ctx.strokeStyle='#c7a77a';ctx.lineWidth=1;ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(-6,15);ctx.lineTo(30,18);ctx.stroke();ctx.restore();
   H([[-34,8],[-18,10],[-14,24],[-32,26],[-40,18]],{edgeAlpha:.6});bossEngine(-40,18,3,a.c,t,12,side);
  ctx.restore()}
  H([[34,0],[20,-11],[-6,-14],[-30,-10],[-38,0],[-30,10],[-6,14],[20,11]],{glow:10,edgeWidth:1.6});
  H([[14,-9],[24,-3],[24,3],[14,9],[2,9],[2,-9]],{dark:'#151110',light:'#3a3128',edgeAlpha:.5});bossWindows(6,-4,3,2,3,3,a.c,t,3);
  H([[-26,-8],[-10,-8],[-10,-2],[-26,-2]],{light:'#7a5b3b',dark:'#2c2018',edgeAlpha:.5});H([[-26,2],[-10,2],[-10,8],[-26,8]],{light:'#55606b',dark:'#1d2228',edgeAlpha:.5});
  ctx.save();ctx.translate(-6,0);bossArt.core(5,e,t,{charge:ch});ctx.restore();bossEngine(-38,0,4,a.c,t,16,0)},
 'belt/crusher'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);let bite=(1-ch)*.22+.05*Math.sin(t*3);bossFins(e,-18,24,22,.8,8);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
   H([[-36,16],[22,16],[26,30],[-38,30]],{edgeAlpha:.6});for(let i=0;i<8;i++){bossArt.line(-32+i*7,18,-32+i*7,28,'#03070e',2)}bossArt.line(-34,23,22,23,a.c,.8,.35);
   ctx.save();ctx.translate(26,10);ctx.rotate(bite);H([[0,-2],[22,2],[28,12],[20,10],[16,6],[0,10]],{glow:8});for(let i=0;i<4;i++)poly([[5+i*5,2],[7.5+i*5,-2+i*.4],[10+i*5,3]],'#e8d3b0','#03070e',.8);ctx.restore();
  ctx.restore()}
  H([[30,-12],[44,0],[30,12],[-30,16],[-46,10],[-40,0],[-46,-10],[-30,-16]],{glow:10,edgeWidth:1.6});
  H([[20,-8],[24,0],[20,8],[-18,10],[-24,0],[-18,-10]],{dark:'#151110',light:'#3a3128',edgeAlpha:.45});
  for(let x of [-30,-22])bossArt.vent(x,-5,5,10,4,e,e.hp<e.max*.5?1:.3);
  for(let side of [-1,1]){let puff=((t*1.5+side*.3)%1+1)%1;ctx.save();ctx.globalAlpha=.25*(1-puff);circle(-34-puff*10,side*6,3+puff*5,'#9a8b7a');ctx.restore()}
  bossArt.core(8,e,t,{charge:ch});bossArt.chargeRing(12,e,ch)},
 'belt/dreadnought'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);bossFins(e,-30,34,18,.9,8);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);
   H([[-44,22],[18,20],[38,28],[18,36],[-44,36],[-50,29]],{edgeAlpha:.6});
   let cols=['#7a5b3b','#4d6a7d','#7d4a3f','#6b6b4a'];for(let i=0;i<5;i++)H([[-40+i*11,24],[-31+i*11,24],[-31+i*11,32],[-40+i*11,32]],{light:cols[(i+(side>0?1:0))%4],dark:bossArtMix(cols[(i+(side>0?1:0))%4],.35),edgeAlpha:.3,key:1.6});
   bossEngine(-50,29,3.5,a.c,t,14,side+2);
  ctx.restore()}
  H([[50,0],[34,-14],[10,-20],[-34,-20],[-48,-10],[-48,10],[-34,20],[10,20],[34,14]],{glow:12,edgeWidth:1.8});
  H([[36,-6],[44,0],[36,6],[22,6],[22,-6]],{dark:'#0c0a0a',light:'#2a2420',edgeAlpha:.5});bossArt.line(24,0,38,0,a.c,1,.6);
  ctx.save();ctx.translate(-16,-6);H([[-12,-8],[12,-8],[16,0],[12,8],[-12,8]],{light:'#4a4138',dark:'#1d1a1c',edgeAlpha:.55});bossWindows(-9,-5,5,2,3,2.6,a.c,t,9);ctx.restore();
  ctx.save();ctx.translate(6,8);ctx.rotate(Math.sin(t*.7)*.5);H([[-2,-2],[24,-2],[24,2],[-2,2]],{light:'#8a7350',dark:'#3a3020',edgeAlpha:.5,key:1.6});bossArt.line(24,0,24,6,'#c7a77a',1);poly([[21,6],[27,6],[24,10]],'#c7a77a','#03070e',.8);circle(0,0,3,'#2a2420',a.c);ctx.restore();
  bossEngine(-48,-6,4,a.c,t,18,1);bossEngine(-48,6,4,a.c,t,18,2);
  ctx.save();ctx.translate(-26,10);bossArt.core(6,e,t,{charge:ch});bossArt.chargeRing(10,e,ch);ctx.restore()},
 // STORM RELAY: electrical machinery.
 'storm/keeper'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);let tips=[];bossSpikes(e,4,22,42,6,Math.PI/4);
  for(let i=0;i<4;i++){let ang=i*Math.PI/2;ctx.save();ctx.rotate(ang);H([[18,-7],[34,-6],[34,6],[18,7]],{edgeAlpha:.6});for(let k=0;k<3;k++){H([[28+k*6,-9+k],[32+k*6,-9+k],[32+k*6,9-k],[28+k*6,9-k]],{light:'#6d68a0',dark:'#211f3d',edgeAlpha:.8,key:1.8})}circle(48,0,4.5,'#03070e');circle(48,0,3.2,a.c);circle(47,-1,1.2,'#ffffff');ctx.restore();tips.push([Math.cos(ang)*48,Math.sin(ang)*48])}
  for(let i=0;i<4;i++){let p=tips[i],q=tips[(i+1)%4];if(ch>0||Math.sin(t*3+i*1.9)>.3)bossArc(p[0],p[1],q[0],q[1],a.c,t,i,1.2,.5+.5*ch)}
  let oct=[[22,-14],[22,14],[14,22],[-14,22],[-22,14],[-22,-14],[-14,-22],[14,-22]];H(oct,{glow:10,edgeWidth:1.6});H(oct.map(p=>[p[0]*.66,p[1]*.66]),{dark:'#0d0c1c',light:'#26244a',edgeAlpha:.45});
  bossArt.core(9,e,t,{charge:ch});for(let i=0;i<4;i++)bossArc(0,0,Math.cos(i*Math.PI/2+t)*9,Math.sin(i*Math.PI/2+t)*9,'#ffffff',t,i+5,.8,.7);bossArt.chargeRing(14,e,ch)},
 'storm/conductor'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);let tips=[];
  for(let i=0;i<3;i++){let ang=i*TAU/3;ctx.save();ctx.rotate(ang);H([[14,-6],[30,-5],[34,0],[30,5],[14,6]],{edgeAlpha:.6});
   for(let side of [-1,1]){H([[30,side*2],[44,side*12],[50,side*10],[38,side*1]],{glow:6})}H([[32,-2],[52,-1.5],[52,1.5],[32,2]],{glow:6});
   for(let k=0;k<3;k++)bossArt.vent(17+k*5,-2,3.5,4,2,e,ch);ctx.restore();for(let side of [-1,1]){let aa=ang+side*Math.atan2(11,47);tips.push([Math.cos(aa)*49,Math.sin(aa)*49])}
   bossArc(Math.cos(ang+.23)*49,Math.sin(ang+.23)*49,Math.cos(ang-.23)*49,Math.sin(ang-.23)*49,a.c,t,i,1.1,.6+.4*ch)}
  H([[22,0],[0,22],[-22,0],[0,-22]],{glow:10,edgeWidth:1.6});H([[14,0],[0,14],[-14,0],[0,-14]],{dark:'#0b1720',light:'#1e3a4a',edgeAlpha:.45});
  bossArt.core(8,e,t,{charge:ch});if(ch>0)for(let i=0;i<3;i++)bossArc(0,0,Math.cos(i*TAU/3)*50,Math.sin(i*TAU/3)*50,'#ffffff',t,i+3,1,ch);bossArt.chargeRing(13,e,ch)},
 'storm/citadel'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);
  ctx.save();ctx.rotate(-t*.5);for(let i=0;i<10;i++){ctx.save();ctx.rotate(i*TAU/10);ctx.globalAlpha=.55;let g=ctx.createRadialGradient(44,0,0,44,0,9);g.addColorStop(0,'#8a83c4');g.addColorStop(1,'#8a83c400');ctx.fillStyle=g;ctx.beginPath();ctx.arc(44,0,9,0,TAU);ctx.fill();ctx.restore()}ctx.restore();
  let rods=[];for(let i=0;i<6;i++){let ang=i*TAU/6+TAU/12;ctx.save();ctx.rotate(ang);H([[24,-6],[36,-4],[36,4],[24,6]],{edgeAlpha:.6});H([[36,-1.5],[50,-.8],[50,.8],[36,1.5]],{glow:6,key:2});circle(50,0,2.6,a.c);ctx.restore();rods.push([Math.cos(ang)*50,Math.sin(ang)*50])}
  let hex=Array.from({length:6},(_,i)=>[Math.cos(i*TAU/6)*31,Math.sin(i*TAU/6)*31]);H(hex,{glow:12,edgeWidth:1.8});
  for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6+TAU/12);H([[14,-6],[24,-8],[24,8],[14,6]],{dark:'#0d0c1c',light:'#2a2752',edgeAlpha:.45,key:2});bossArt.light(20,0,1.4,a.c,.5+.5*Math.sin(t*4+i));ctx.restore()}
  let k=Math.floor(t*2.3)%6;if(Math.sin(t*6)>0||ch>0)bossArc(rods[k][0],rods[k][1],rods[(k+2)%6][0],rods[(k+2)%6][1],a.c,t,k,1.3,.8);
  bossArt.core(11,e,t,{charge:ch});ctx.save();ctx.rotate(t*1.4);for(let i=0;i<3;i++){ctx.rotate(TAU/3);bossArc(0,0,10,0,'#ffffff',t,i,.8,.8)}ctx.restore();bossArt.chargeRing(16,e,ch)},
 // CINDER FOUNDRY: heavy industry.
 'foundry/harvester'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);bossFins(e,-22,14,24,.7,7);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);H([[14,8],[40,14],[44,24],[30,28],[10,20]],{glow:6});bossArt.line(18,14,40,20,'#03070e',2);ctx.restore()}
  ctx.save();ctx.translate(36,0);ctx.rotate(t*3);for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);poly([[3,-1.5],[11,-3],[12,0],[3,1.5]],'#cbb39b','#03070e',.8);ctx.restore()}circle(0,0,3.5,'#2a2420',a.c);ctx.restore();
  H([[28,-12],[30,12],[-30,18],[-42,8],[-42,-8],[-30,-18]],{glow:10,edgeWidth:1.6});
  let g=ctx.createLinearGradient(-30,0,0,0);g.addColorStop(0,'#ff6a1f');g.addColorStop(1,'#ffd27a');ctx.save();ctx.beginPath();ctx.ellipse(-14,0,13,8,0,0,TAU);ctx.strokeStyle='#03070e';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=g;ctx.globalAlpha=.75+.25*Math.sin(t*3);ctx.fill();ctx.restore();
  for(let i=0;i<3;i++){let b=(t*.8+i*.33)%1;ctx.save();ctx.globalAlpha=1-b;circle(-20+i*6,Math.sin(i*2)*3,1.2+b*2,'#fff1c4');ctx.restore()}
  for(let side of [-1,1])bossArt.line(-6,side*10,20,side*7,'#03070e',3),bossArt.line(-6,side*10,20,side*7,'#7a5c4a',1.6);
  ctx.save();ctx.translate(14,0);bossArt.core(5,e,t,{charge:ch});bossArt.chargeRing(9,e,ch);ctx.restore();bossEngine(-42,-4,3,a.c,t,12,1);bossEngine(-42,4,3,a.c,t,12,2)},
 'foundry/warden'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);
  bossFins(e,-26,28,16,.9,7);for(let side of [-1,1]){ctx.save();ctx.scale(1,side);H([[-38,16],[26,16],[40,23],[24,31],[-30,31],[-42,25]],{edgeAlpha:.6});
   for(let i=0;i<3;i++){let x=-26+i*17;H([[x,18],[x+12,18],[x+12,28],[x,28]],{light:'#2a1d1a',dark:'#120c0c',edgeAlpha:.5,key:1.8});let heat=.55+.45*Math.sin(t*2.4+i*1.3+side);let g=ctx.createLinearGradient(0,19,0,27);g.addColorStop(0,'#ffe2a3');g.addColorStop(1,'#ff5a1a');ctx.save();ctx.globalAlpha=.5+.5*heat;ctx.fillStyle=g;ctx.fillRect(x+2,20,8,6);ctx.restore();for(let k=0;k<3;k++)bossArt.line(x+3+k*3,20,x+3+k*3,26,'#03070e',1)}
  ctx.restore()}
  H([[40,0],[28,-14],[-30,-14],[-40,-6],[-40,6],[-30,14],[28,14]],{glow:10,edgeWidth:1.6});H([[42,-5],[56,0],[42,5],[34,4],[34,-4]],{glow:6});
  for(let x of [-30,-20]){ctx.save();ctx.translate(x,0);H([[-4,-4],[4,-4],[4,4],[-4,4]],{light:'#3a2c28',dark:'#140e0e',edgeAlpha:.6,key:2});let rise=((t*.9+x*.1)%1+1)%1;ctx.globalAlpha=.3*(1-rise);circle(-rise*8,0,2+rise*5,'#ff9a5a');ctx.restore()}
  H([[24,-8],[30,0],[24,8],[-6,8],[-10,0],[-6,-8]],{dark:'#140e0e',light:'#3a2c28',edgeAlpha:.45});
  ctx.save();ctx.translate(8,0);bossArt.core(7,e,t,{charge:ch});for(let i=-1;i<=1;i++)bossArt.line(-4,i*3,4,i*3,'#03070e',1.2);bossArt.chargeRing(11,e,ch);ctx.restore()},
 'foundry/forge'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);bossSpikes(e,4,32,50,7,Math.PI/4);
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);let pump=Math.max(0,Math.sin(t*2.2+i*Math.PI/2))*6*(1+ch);H([[28,-11],[38,-11],[38,11],[28,11]],{edgeAlpha:.6});bossArt.line(38,0,40+pump,0,'#03070e',5);bossArt.line(38,0,40+pump,0,'#a08a74',2.4);H([[40+pump,-12],[50+pump,-10],[50+pump,10],[40+pump,12]],{glow:8});for(let k=0;k<3;k++)bossArt.line(43+pump,-7+k*7,48+pump,-7+k*7,'#03070e',1.4);ctx.restore()}
  let oct=[[30,-20],[30,20],[20,30],[-20,30],[-30,20],[-30,-20],[-20,-30],[20,-30]];H(oct,{glow:12,edgeWidth:1.8});
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2+Math.PI/4);bossArt.vent(20,-3,7,6,3,e,.5+.5*Math.sin(t*2+i));ctx.restore()}
  circle(0,0,19,'#03070e');let g=ctx.createRadialGradient(-3,-3,0,0,0,17);g.addColorStop(0,'#fff5cf');g.addColorStop(.35,'#ffb44d');g.addColorStop(.8,'#e0461a');g.addColorStop(1,'#5a1408');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.fill();
  ctx.save();ctx.rotate(t*.4);ctx.strokeStyle='rgba(90,20,8,.6)';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(TAU/3);ctx.beginPath();ctx.arc(4,0,8,0,2);ctx.stroke()}ctx.restore();
  for(let i=0;i<4;i++){let b=(t*.7+i*.25)%1,ang=i*2.1;ctx.save();ctx.globalAlpha=(1-b)*.9;circle(Math.cos(ang)*9*b,Math.sin(ang)*9*b,1.4+b*1.5,'#fff1c4');ctx.restore()}
  ctx.save();ctx.strokeStyle=a.c;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,19,0,TAU);ctx.stroke();ctx.restore();bossArt.chargeRing(22,e,ch)},
 // CRYO REACH: crystal hunters.
 'cryo/stalker'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);bossFacet([[4,8],[-26,32],[-34,30],[-14,10]],e);bossFacet([[-8,10],[-36,22],[-40,16],[-20,8]],e,'#d8f4ff');ctx.restore()}
  H([[52,0],[20,-9],[-20,-11],[-32,0],[-20,11],[20,9]],{glow:10,edgeWidth:1.6});bossFacet([[48,0],[24,-5],[24,5]],e,'#ffffff');
  bossFacet([[18,0],[4,-6],[-12,0],[4,6]],e);
  let mist=(t*.6)%1;ctx.save();ctx.globalAlpha=.25*(1-mist);circle(-36-mist*12,0,4+mist*6,'#d8f4ff');ctx.restore();bossEngine(-32,0,3.5,a.c,t,14,0);
  ctx.save();ctx.translate(-8,0);bossArt.core(5,e,t,{charge:ch});bossArt.chargeRing(9,e,ch);ctx.restore()},
 'cryo/empress'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);
  for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8+TAU/16);let big=i%2===0,L=big?50:38;bossFacet([[18,-5],[L-8,-6],[L,0],[L-8,6],[18,5]],e,big?a.c:'#e6f4ff');bossArt.line(22,0,L-6,0,'rgba(255,255,255,.5)',.7);ctx.restore()}
  let sq=[[29,0],[0,29],[-29,0],[0,-29]];H(sq,{glow:12,edgeWidth:1.8});H(sq.map(p=>[p[0]*.68,p[1]*.68]),{dark:'#0d1424',light:'#2a3557',edgeAlpha:.45});
  ctx.save();ctx.rotate(t*.3);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);ctx.globalAlpha=.35+.35*Math.sin(t*2+i);poly([[13,0],[16,-1.5],[19,0],[16,1.5]],'#ffffff');ctx.restore()}ctx.restore();
  bossArt.core(8,e,t,{charge:ch});bossFacet([[0,-9],[6,0],[0,9],[-6,0]],e,'#ffffff');bossArt.chargeRing(14,e,ch)},
 'cryo/zero'(e,t,ch,a){
  for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6);bossFacet([[16,-3],[50,-1.5],[52,0],[50,1.5],[16,3]],e);
   for(let k=0;k<3;k++){let x=24+k*8,l=10-k*2;for(let side of [-1,1])bossFacet([[x,side*1.5],[x+l*.7,side*l],[x+l*.9,side*(l-1.5)],[x+3,side*1.5]],e,'#e6fbff')}
   ctx.restore()}
  let hex=Array.from({length:6},(_,i)=>[Math.cos(i*TAU/6+TAU/12)*22,Math.sin(i*TAU/6+TAU/12)*22]);bossArt.hull(hex,e,{glow:12,edgeWidth:1.8});
  ctx.save();ctx.rotate(-t*.25);let inner=hex.map(p=>[p[0]*.62,p[1]*.62]);bossArt.hull(inner,e,{dark:'#0b1a24',light:'#21404f',edgeAlpha:.5});ctx.restore();
  let g=ctx.createRadialGradient(0,0,0,0,0,14);g.addColorStop(0,'#ffffff');g.addColorStop(.4,'#e8fffd');g.addColorStop(1,a.c+'00');ctx.save();ctx.globalAlpha=.85+.15*Math.sin(t*2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.fill();ctx.restore();
  bossFacet([[0,-6],[5,0],[0,6],[-5,0]],e,'#ffffff');bossArt.chargeRing(16,e,ch)},
 // NEON UNDERCITY: police and city machinery.
 'city/interdictor'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);
  ctx.save();let g=ctx.createLinearGradient(40,0,95,0);g.addColorStop(0,'rgba(255,240,220,.28)');g.addColorStop(1,'rgba(255,240,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(40,-3);ctx.lineTo(95,-16-ch*6);ctx.lineTo(95,16+ch*6);ctx.lineTo(40,3);ctx.fill();ctx.restore();
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);H([[10,8],[-14,30],[-34,32],[-26,12]],{glow:6});bossArt.line(-10,22,-28,26,a.c,1,.6);bossEngine(-30,22,3,a.c,t,12,side);H([[16,12],[34,14],[36,18],[16,18]],{edgeAlpha:.7,key:1.8});ctx.restore()}
  H([[44,0],[24,-9],[-14,-12],[-34,-8],[-38,0],[-34,8],[-14,12],[24,9]],{glow:10,edgeWidth:1.6});
  bossFacet([[30,0],[18,-5],[10,0],[18,5]],e,'#a9dfef');
  let blink=Math.floor(t*6)%2;ctx.save();ctx.shadowBlur=graphicsShadow(10);for(let k=0;k<2;k++){let red=(k===blink);ctx.shadowColor=red?'#ff4d6d':'#4db8ff';ctx.fillStyle=red?'#ff4d6d':'#4db8ff';ctx.fillRect(-4,k?1:-5,8,4)}ctx.restore();ctx.fillStyle='#03070e';ctx.fillRect(-5,-1,10,2);
  ctx.save();ctx.translate(-18,0);bossArt.core(5,e,t,{charge:ch});bossArt.chargeRing(9,e,ch);ctx.restore();bossEngine(-38,0,3.5,a.c,t,14,0)},
 'city/enforcer'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);bossFins(e,-26,28,18,.8,8);
  for(let side of [-1,1]){ctx.save();ctx.scale(1,side);H([[-30,18],[10,18],[14,30],[-34,30]],{edgeAlpha:.6});bossWindows(-28,20,8,2,3.2,3.2,'#ffd9a8',t,side*5);
   let recoil=ch>0?ch*3:0;H([[6-recoil,10],[48-recoil,11],[52-recoil,14],[48-recoil,17],[6-recoil,18]],{glow:8});bossArt.line(14-recoil,14,46-recoil,14,'#03070e',2);bossArt.light(50-recoil,14,1.6,a.c,.5+.5*ch);
  ctx.restore()}
  H([[34,0],[22,-16],[-14,-18],[-38,-12],[-42,0],[-38,12],[-14,18],[22,16]],{glow:10,edgeWidth:1.6});
  for(let k=0;k<3;k++){let s1=1-k*.22;H([[26*s1,0],[16*s1,-12*s1],[-20*s1,-12*s1],[-28*s1,0],[-20*s1,12*s1],[16*s1,12*s1]].map(p=>[p[0]-k*3,p[1]]),{dark:bossArtMix('#16182e',1-k*.15),light:bossArtMix('#45476a',1-k*.1),edgeAlpha:.35+.1*k,key:1.6})}
  bossWindows(-14,-6,4,3,2.6,2.6,'#ffd9a8',t,11);
  ctx.save();ctx.translate(14,0);bossArt.core(6,e,t,{charge:ch});bossArt.chargeRing(10,e,ch);ctx.restore();bossEngine(-42,-6,3.5,a.c,t,14,1);bossEngine(-42,6,3.5,a.c,t,14,2)},
 'city/overlord'(e,t,ch,a){const H=(p,o)=>bossArt.hull(p,e,o);bossSpikes(e,4,36,52,7,Math.PI/4);bossSpikes(e,4,32,42,5,0);
  ctx.save();ctx.rotate(t*.6);ctx.strokeStyle=a.c;ctx.setLineDash([6,4]);ctx.lineWidth=1.4;ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(0,0,48,0,TAU);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.globalAlpha=.9;poly([[46,-2],[51,0],[46,2]],a.c)}ctx.restore();
  let sq=[[34,-26],[34,26],[26,34],[-26,34],[-34,26],[-34,-26],[-26,-34],[26,-34]];H(sq,{glow:12,edgeWidth:1.8});
  let towers=[[-24,-24,12,14,3],[8,-26,16,10,4],[-26,6,10,18,2],[12,10,14,16,3],[-8,16,12,10,2]];
  for(let [x,y,w,h,f] of towers){H([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],{light:'#45476a',dark:'#16182e',edgeAlpha:.5,key:1.6});bossWindows(x+2,y+2,Math.max(1,Math.floor((w-3)/3.2)),Math.max(1,Math.floor((h-3)/3.2)),2,2,f%2?'#ffd9a8':a.c,t,x*y)}
  for(let [x,y] of [[-30,-30],[30,-30],[30,30],[-30,30]]){bossArt.line(x,y,x*1.18,y*1.18,'#03070e',2.4);bossArt.line(x,y,x*1.18,y*1.18,'#8a8cb0',1);bossArt.light(x*1.2,y*1.2,1.5,Math.sin(t*3+x)>0?'#ff4d6d':a.c,1)}
  circle(0,0,13,'#03070e');bossArt.core(10,e,t,{charge:ch});ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle='#ffffff';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,10,4,t,0,TAU);ctx.stroke();ctx.restore();bossArt.chargeRing(15,e,ch)}
};
function drawSectorBossArt(e,t){let clock=reducedMotion||e.freeze>0?0:t,charge=bossChargeProgress(e),a=bossArtPalette(e),design=bossPresentation(e);ctx.save();ctx.lineJoin='round';ctx.shadowBlur=0;
 bossDesigns[e.sectorBoss+'/'+e.kind](e,clock,charge,a);bossArt.damage(e,clock,34);ctx.restore()}
function drawPresentedBoss(e,t){let design=bossPresentation(e),a=design.radial?(reducedMotion||e.freeze>0?0:t*.075):Number.isFinite(e.aim)&&e.charge>0?e.aim:Math.atan2(s.p.y-e.y,s.p.x-e.x);ctx.save();ctx.rotate(a);ctx.scale(e.r/50,e.r/50);if(!e.sectorBoss)drawBossArtV2(e,t);else if(bossDesigns[e.sectorBoss+'/'+e.kind])drawSectorBossArt(e,t);else drawIllustratedBossHull(e,t);ctx.restore();
 if(e.arrival>0){ctx.save();ctx.shadowBlur=0;ctx.lineWidth=1.5;ctx.strokeStyle='#c5d9e8';let r=e.r+12;for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);ctx.beginPath();ctx.moveTo(r-4,-7);ctx.lineTo(r,-7);ctx.lineTo(r,7);ctx.lineTo(r-4,7);ctx.stroke();ctx.restore()}ctx.restore()}}
function enemyDesign(e,t){if(e.objectiveTarget)return;ctx.save();drawContactRecoil(e);if(e.finalBoss)drawFinalBoss(e,t);else if(e.systemOwner)drawFinalSystem(e,t);else if(e.sporePod)drawSporePod(e,t);else if(e.wreckTurret)drawWreckTurret(e,t);else if(e.swarm)drawSwarmDrone(e,t);else if(e.boss)drawPresentedBoss(e,t);else drawEnemyShip(e,t);ctx.restore();if(!e.boss&&!e.systemOwner&&!e.sporePod&&!e.wreckTurret&&!e.swarm)drawSpecialist(e)}
function pilotDesign(t,view=s,paint=shipCanvasPainter){
const {ctx,poly,circle,hex}=paint;const s=view;
if(!s.preview){ctx.save();ctx.translate(3,6);ctx.scale(1,.55);circle(0,0,s.pilot.id==='bastion'?28:19,'#00000088');ctx.restore();}
let bankS=1-Math.abs(s.flightVisual?.bank||0)*.28;
let baked=!!hullBake(s.pilot.id)&&paint===shipCanvasPainter;ctx.save();ctx.rotate(paintHullHeading(s));ctx.scale(1,bankS);if(!(baked&&drawBakedHull(ctx,s.pilot)))baked=false,drawIdentityHull(s.pilot,t,paint,s);ctx.restore();ctx.save();ctx.rotate(paintHullHeading(s));ctx.scale(1,bankS);
let partEngine=false;if(!baked)try{partEngine=drawPartFlames(ctx,s.pilot,t,s.flightVisual?.thrust||0,s.dashTime>0||s.boostTime>0)}catch(e){}if(!reducedMotion&&!partEngine){let pulse=.5+.5*Math.sin(t*17),length=(s.dashTime>0||s.boostTime>0?28:4+(s.flightVisual?.thrust||0)*12)+pulse*4,noz=baked&&bakedOutlets(s.pilot).length?bakedOutlets(s.pilot).map(([hx,hy,r])=>[-hy,hx,r]):[-1,1].map(side=>[-15,side*(s.pilot.id==='bastion'?16:9),2]);for(let [x,y,r] of noz){let w=Math.max(1.2,r*.9);ctx.save();ctx.globalAlpha=.3;poly([[x,y-w],[x-length,y],[x,y+w]],s.pilot.color);ctx.globalAlpha=.75;poly([[x,y-w*.5],[x-2-length*.6,y],[x,y+w*.5]],'#d4fff3');ctx.restore()}}
ctx.shadowBlur=graphicsShadow(0);
let heavy=['bastion','sovereign'].includes(s.pilot.id),light=s.pilot.id==='wasp',c=s.pilot.color
if(!baked){for(let side of [-1,1]){let y=side*(heavy?14:9);poly([[-9,y-3],[3,y-3],[7,y],[3,y+3],[-9,y+3]],heavy?'#526170':'#335c67','#7ca7ad',.6);
for(let i=0;i<3;i++){ctx.fillStyle='#0a1c2b';ctx.fillRect(-7+i*3,y-2,1.2,4)}
circle(2,y,1,'#c2fff0');ctx.strokeStyle='#c2fff044';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-10,y-4);ctx.lineTo(2,y-4);ctx.stroke()}
poly([[8,0],[-1,-5],[-5,0],[-1,5]],'#081c30','#78ded5',1);poly([[5,0],[-1,-2],[-3,0],[-1,2]],'#c9fff2');ctx.save();ctx.globalAlpha=reducedMotion?.25:.2+.2*Math.sin(t*4);circle(0,0,7,s.pilot.color);ctx.restore();

if(!partEngine)for(let side of [-1,1]){let y=side*(heavy?16:light?12:9);ctx.fillStyle='#385261';ctx.fillRect(-14,y-3,5,6);ctx.fillStyle=c;ctx.fillRect(-16,y-1,3,2)}}
if((s.items.armour||0))for(let i=0;i<Math.min(6,(s.items.armour||0)+1);i++){ctx.save();ctx.rotate(Math.PI/6+i*TAU/6);ctx.fillStyle='#e7f1ef88';ctx.fillRect(16,-4,3,1);ctx.fillStyle='#1c2a3c';ctx.fillRect(18,-1,2,2);ctx.restore()}
if(!baked&&s.pilot.parts&&s.pilot.parts.plating)try{ctx.save();ctx.rotate(Math.PI/2);drawPartsGeo(paint,s.pilot,'armour',fleetHullProfiles[s.pilot.id]||s.pilot.shape.split(' ').map(q=>q.split(',').map(Number)),t);ctx.restore()}catch(e){}ctx.restore();
ctx.save();ctx.rotate(s.face||0);ctx.shadowColor=s.pilot.color;ctx.shadowBlur=graphicsShadow(6);
if(baked){}else if(partOn(s.pilot,'mount')){ctx.rotate(Math.PI/2);try{drawPartsGeo(paint,s.pilot,'turret',fleetHullProfiles[s.pilot.id]||s.pilot.shape.split(' ').map(q=>q.split(',').map(Number)),t)}catch(e){drawFleetMount(s.pilot,paint)}}else drawFleetMount(s.pilot,paint);ctx.restore()}