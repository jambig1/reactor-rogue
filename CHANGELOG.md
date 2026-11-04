# v0.43.0 — illustrated enemy fleets

- Rebuilt standard enemies with shaded armour, controlled steel edges and compact engine lights to match the player ships.
- Gave scouts, interceptors, gunships and cruisers distinct silhouettes, with separate salvage, relay, furnace, ice and security fittings across the six fleets.
- Added eight specialist hulls and equipment: hunter blades, swept interceptor wings, rail channels, shield emitters, fighter bays, mine racks, volatile tanks and repair arms.
- Kept combat statistics, collision radii, spawns, progression and attack warnings unchanged. Artwork remains readable in Low quality and reduced motion.

# v0.42.0 — illustrated sector artwork

- Applied the approved Neon Expanse direction to all six maps, matching the ships’ shaded illustrated forms, controlled edges and restrained neon lighting.
- Kept every sector distinct in layout, materials and colour. No coarse pixel treatment or photographic background noise.
- Retained seamless scrolling, sharp desktop rendering, scenery lights, dust, embers, snow and reduced-motion support.
- Refreshed the sector previews from separate real gameplay runs.

# v0.41.1 — worn scenery and ambient life

- Kept the sharp six-sector textures and seamless scrolling, with a restrained cached dither, broken colour and fine grain treatment.
- Added scenery-aligned twinkling lights that remain visible in Low quality and crowded Auto scenes, independently of combat effect detail.
- Restored slow drifting dust, rising Foundry embers, Cryo snow and faint Storm filaments. Reduced motion freezes the ambient animation.
- Ambient effects stay behind all ships, pickups and threat markers and never consume simulation RNG.

# v0.41.0 — plasma beam and Iron Halo artwork

- Added layered energy sheaths, animated filaments, bright cores and compact contact flares to every player beam family, including evolved forms, Ion Curtain, Plasma Lash and Rupture Drill.
- Gave Solar Lance its own amber-white coronal ribbons and a matching persistent burn corridor.
- Replaced Iron Halo’s reused blade sprite with curved steel vanes, heated edges and short segmented orbital trails.
- Retained Plasma Fences’ existing artwork. Hostile beams retain their warm warning colour and full danger boundaries.
- Kept damage, hit geometry, timings, evolution recipes and progression unchanged. Low detail and reduced-motion variants remain available.

# v0.40.0 — sharper continuous sector scenery

- Refreshed all six menu and website previews with separate live gameplay captures using the new scenery.

- Replaced the six atlas cells with six independently generated high-resolution sector textures.
- Removed mirrored background neighbours. Smooth periodic edge blending and a single repeating pattern eliminate reflection joins and subpixel tile cracks.
- Kept scenery at a fixed world scale so desktop viewports reveal more detail instead of stretching the background.
- Limited decoded textures to two sectors, with a smaller Low-quality surface and frozen ambient animation under reduced motion.

# v0.39.2 — sector cover polish

- Removed ambient fracture lanes in Cryo Reach and lockdown lanes in Neon Undercity. Boss attack telegraphs and Cinder Foundry vents remain.
- Replaced flat cover outlines with shaded sector materials, stable surface detail, impact flashes and progressive damage cracks. Cover collision, durability and shot blocking are unchanged.
- Matched destruction colour to sector material and refreshed sector descriptions and offline cache.

# Recent changes

This is a concise summary of recent releases. Older implementation history is available in Git history.

## 0.39.1

- Replaced all six embedded sector previews with separate live gameplay captures of the new environments.
- Updated the website hero, sector gallery and README gameplay image to the current capture set.
- Used versioned image filenames to avoid older cached screenshots. Each sector has its own ship, encounter and still.

## 0.39.0

- Replaced the live sector backgrounds with six distinct textured environments inspired by nebula clouds, dark wreckage silhouettes and atmospheric lighting.
- Added open teal/violet space, amber wreck fields, ion storm clouds, furnace smoke, glacial shelves and a distant neon city, using one embedded background atlas.
- Added slow background parallax, seamless mirrored edges, restrained ambient motes and city traffic. Reduced motion freezes ambient movement, and low detail reduces decorative work.
- Retained all physical terrain, enemy, pickup and hazard rendering above the scenery. Combat, progression and collisions are unchanged.

## 0.38.3

- Keep atmospheric colour fields fully inside their transparent texture margins to remove rectangular mist edges.

## 0.38.2

- Paint neighbouring world cells into cached surfaces so rocks, shading and colour fields continue across tile joins.

## 0.38.1

- Replaced live wireframe sector scenery with cached shaded surface artwork across all six maps.
- Added irregular rock and ice forms, crater and mineral shading, rounded industrial housings, furnace light, soft relay surfaces and illuminated city rooftops.
- Retained city light trails, slow parallax, reduced motion and scenery below gameplay objects.
- Bounded the new shared tile cache to 24 surfaces and reduced live scenery work to cached image draws.

## 0.38.0

- Added sector-specific distant structures and layered atmosphere to all six maps, including orbital ribs, rock strata, relay foundations, furnace shafts, ice fissures and high-rise crowns.
- Added slow parallax and subtle ambient motes, with cached mist textures and bounded drawing budgets.
- Varied Foundry platforms and Cryo shelves to reduce repeated scenery.
- All scenery draws before gameplay objects and warnings. Reduced motion freezes ambient movement; low detail reduces extra scenery effects.

## 0.37.0

- Refined all twelve player hull silhouettes with shared panel, canopy and engine details.
- Added distinct cannon, twin-barrel, fork and energy weapon mounts by ship family.
- Refined enemy class outlines, dorsal armour, engine apertures, specialist fittings and damaged hull details across sector fleets.
- Menu ship previews use the same geometry as gameplay. Combat, collision sizes, progression and spawn rates are unchanged.

## 0.36.2

- Show touch movement controls on phones and iPads, hiding keyboard and mouse mode choices on those devices.
- Use touch-specific firing instructions and ignore an older saved desktop movement mode on mobile.
- Retain desktop control choices, including narrow browser windows and touch-capable Windows computers.

## 0.36.1

- Keep Play and Launch text readable when buttons are hovered or focused.
- Verify ship and sector navigation at phone, small-phone, landscape, tablet and desktop viewport sizes.

## 0.36.0

- Add separate ship and sector selection before launching, with gameplay previews, boss rosters and unlock requirements.
- Remember ship and sector choices; keep licences, upgrades, contracts and loadouts in the Hangar.
- Support backing out, inspecting locked ships and returning from licence purchases without starting or abandoning a run.

## 0.35.2

- Auto-start optional events after three continuous game seconds in their marked area, with a visible countdown and reset on leaving.
- Open merchant arrivals automatically as paused transmissions, with no accept button or missed-call countdown. Bosses and other menus hold the connection.
- Preserve event rewards and optional higher-risk breach choices; standard breaches need no selection.

## 0.35.1

- Rebalance achievement payouts to 50-400 credits and ship licences to 125-500 credits, with Sovereign at 1,500 and Vanguard free.
- Pay existing profiles the difference for previously completed achievements once, preserving owned ships, challenges, tools and banked progress.
- Show the achievement top-up on the Contracts board and preserve its migration version through profile backups.

## 0.35.0

- Steeper XP requirements after the early levels, with leftover XP retained.
- Endless survival now increases enemy health and damage continuously, raises spawn frequency within existing population caps, and rotates sector bosses every two game minutes.
- Endless HUD and pause overview show the current cycle and pressure. Sector clears stay banked and fresh runs reset endless progression.

## 0.34.3

- Simplified the website sector-gallery caption.
- Replaced the crowded city preview with a cleaner gameplay still across the website and game.

## 0.34.2

- Removed installation buttons from the website and game menu.
- Simplified the website footer.

## 0.34.1

- Added direct bug reports and suggestions without a GitHub or game account.
- Added private feedback storage, submission validation, duplicate handling and basic rate limits.
- Updated wording and returning-browser script compatibility.

## 0.34.0

- Added the public landing page, gameplay gallery, controls and browser offline support.
- Prepared an optional account/cloud checkpoint integration. This integration remains disabled.

## 0.33

- Reworked Neon Undercity with varied rooftops, high-rise details, distant traffic and thin clouds.
- Improved traffic glows and fading light trails.
- Centred touch ability-button labels.

## 0.32

- Added Neon Undercity and its three bosses.
- Gave all six sectors separate named boss rosters.
- Replaced sector preview illustrations with actual gameplay stills.

## 0.31

- Added Cinder Foundry and Cryo Reach with themed scenery, fleets, hazards and bosses.

## 0.30

- Added an original adaptive soundtrack with menu, sector, boss and merchant music.

## Earlier releases

Established the current ship progression, equipment catalogue, formations, optional encounters, merchant, local profiles, contracts, build information, run ending and combat presentation.
