#!/bin/sh
# Builds reactor-rogue-itch.zip for itch.io (HTML5, index.html at the root). Uses the service worker's
# precache list as the list of files the game needs, plus the worker, manifest, icons and licences.
set -e
cd "$(dirname "$0")"
FILES=$(node -e "const s=require('fs').readFileSync('sw.js','utf8');console.log(JSON.parse(s.match(/FILES=(\[[^\]]*\])/)[1]).join('\n'))")
EXTRA="home.html website.css reactor-rogue-app-mark.png sw.js manifest.webmanifest icon-180.png icon-192.png icon-512.png FONT-LICENSE-Exo2.txt"
for d in vendor/*/; do for l in "$d"LICENSE* "$d"README.txt; do [ -f "$l" ] && EXTRA="$EXTRA $l"; done; done
rm -f reactor-rogue-itch.zip
zip -q -X reactor-rogue-itch.zip $FILES $EXTRA
echo "reactor-rogue-itch.zip: $(unzip -l reactor-rogue-itch.zip | tail -1)"
