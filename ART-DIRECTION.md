# Environment artwork

The six-sector background atlas is `sector-atmosphere-atlas-v0390.jpg`. It is also embedded in `index.html` so the core game does not depend on an extra image request. The production atlas was created with the built-in image generation tool using a player-provided visual reference for atmosphere, then encoded as JPEG without changing its composition.

The layout is three columns and two rows: Neon Expanse, Shattered Belt, Storm Relay, Cinder Foundry, Cryo Reach, Neon Undercity.

Generation brief: a cohesive overhead 2D neon space background atlas with six distinct environments, rich turbulent nebula and surface textures, dark silhouettes, soft local light and clear dark space for combat. The sectors use open teal/violet cosmic space, amber asteroid wreckage, indigo ion storms, orange furnace smoke, cyan glacial shelves and a violet neon city. No characters, ships, interface, text, wireframes or outlined polygon scenery.

Runtime rendering samples each sector's own atlas region. Mirrored neighbouring regions match edge pixels. Slow parallax and sparse ambient motes add motion without changing simulation state. Reduced motion freezes ambient animation. Physical terrain, ships, pickups, attacks and hazard warnings draw above the background. The source texture is decorative and adds no collision boundaries.

The background remains an art pass in an actively developed game. `TEST-ENVIRONMENTS.html` shows representative ships and contrast markers using the actual scenery renderers, rather than a captured run. `TEST-ENVIRONMENTS.cjs` checks the loaded-atlas and fallback paths.
