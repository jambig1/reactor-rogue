from pathlib import Path

index = Path("index.html")
html = index.read_bytes()
previous = b"   if(sprite){entry.sprite=sprite;entry.paint=renderer.paintFlightShip}\n  }).catch(()=>{});"
current = b"   if(sprite){entry.sprite=sprite;entry.paint=renderer.paintFlightShip}\n  }).catch(error=>console.warn('Flight model unavailable; using the 2D ship',error));"
draw = b" if(sprite){\n  paintModel(ctx,sprite,t,"
draw_with_status = b" if(sprite){\n  if(ctx.canvas.dataset.flightModel!==s.pilot.id)ctx.canvas.dataset.flightModel=s.pilot.id;\n  paintModel(ctx,sprite,t,"
assert html.count(previous) == 1 and html.count(draw) == 1
index.write_bytes(html.replace(previous,current).replace(draw,draw_with_status))
