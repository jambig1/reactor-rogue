from pathlib import Path

index = Path("index.html")
html = index.read_bytes()
entry = b"function pilotDesign(t,view=s,paint=shipCanvasPainter){"
adapter = b"""const combatShipSprites=new WeakMap();
function combatShipSprite(pilot){
 let entry=combatShipSprites.get(pilot);
 if(!entry){
  entry={};
  combatShipSprites.set(pilot,entry);
  import('./ship3d-flight.js').then(async renderer=>{
   const sprite=await renderer.loadFlightShip(pilot.id,recordShip3D(pilot),pilot.parts||{});
   if(sprite){entry.sprite=sprite;entry.paint=renderer.paintFlightShip}
  }).catch(()=>{});
 }
 return entry;
}
"""
line = b"let bankS=1-Math.abs(s.flightVisual?.bank||0)*.28;"
render = b"""
if(!s.preview&&s.pilot&&graphicsQuality!=='low'){
 const {sprite,paint:paintModel}=combatShipSprite(s.pilot);
 if(sprite){
  paintModel(ctx,sprite,t,{heading:paintHullHeading(s),bank:bankS,thrust:s.flightVisual?.thrust||0,
   boost:s.dashTime>0||s.boostTime>0,phased:s.pilot.id==='spectre'&&s.phaseTime>0,reducedMotion});
  return;
 }
}
"""
assert html.count(entry) == html.count(line) == 1
html = html.replace(entry, adapter + entry).replace(line, line + render)
index.write_bytes(html)
