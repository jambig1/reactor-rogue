from pathlib import Path

index = Path("index.html")
html = index.read_bytes()
previous = b"if(!s.preview&&s.pilot&&graphicsQuality!=='low'){"
current = b"if(!s.preview&&s.pilot&&graphics.preset!=='low'){"
assert html.count(previous) == 1
index.write_bytes(html.replace(previous,current))
