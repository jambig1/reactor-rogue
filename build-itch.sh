#!/bin/sh
# Builds reactor-rogue-itch.zip for itch.io (HTML5, index.html at the root). Uses the service worker's
# precache list as the list of files the game needs, plus the worker, manifest, icons and licences.
set -e
cd "$(dirname "$0")"
FILES=$(node -e "const s=require('fs').readFileSync('sw.js','utf8');console.log(JSON.parse(s.match(/FILES=(\[[^\]]*\])/)[1]).join('\n'))")
EXTRA="home.html website.css reactor-rogue-app-mark.png sw.js manifest.webmanifest icon-180.png icon-192.png icon-512.png FONT-LICENSE-Exo2.txt"
# Loaded on demand, so not in the precache list: the 3D hangar modules and model loader, the hull and
# fitting models (Wasp.glb is only the Blender source), the hangar backdrop and the combat ship sprites.
EXTRA="$EXTRA ship3d-blender.js ship3d-fittings.js ship3d-fitting-finish.js ship3d-surfaces.js"
EXTRA="$EXTRA vendor/three-0.187.0/GLTFLoader.js vendor/three-0.187.0/meshopt_decoder.module.js art/blender/flight-deck.webp"
EXTRA="$EXTRA $(ls art/blender/*.glb | grep -v '/Wasp.glb$') $(ls art/blender/fittings/*/*.glb) $(ls art/combat/*/*.webp)"
for d in vendor/*/; do for l in "$d"LICENSE* "$d"README.txt; do [ -f "$l" ] && EXTRA="$EXTRA $l"; done; done
rm -f reactor-rogue-itch.zip
zip -q -X reactor-rogue-itch.zip $FILES $EXTRA
echo "reactor-rogue-itch.zip: $(unzip -l reactor-rogue-itch.zip | tail -1)"
