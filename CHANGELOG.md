# v0.52.0 — readable Arsenal discovery

- Tighten the archive header, simplify discovery wording and align saved counts. Widen the detail column, make recipe requirements separate readable rows and give names, levels and descriptions a consistent hierarchy.
- Use two readable icon columns and a bounded browsing list on phones. Place the selected detail after the list, with selection focus moving to the entry. Keep descriptions clear of the artwork and the Back action.
- Clip each painted source rectangle inside an exact-aspect nested SVG before fitting the outer icon. This stops neighbouring atlas images appearing in letterbox space. Refine first-sheet column boundaries around the actual artwork. Shared icon surfaces and artwork galleries use the fix.
- Preserve saved discoveries, filters, tracking, recipes and combat.

# v0.51.1 — upgrade card spacing

- Reserve the real 64px/48px painted-icon column in compact upgrade and reward cards. Keep text outside the artwork at phone and tablet widths; give support icons the same visual size as weapons.

# v0.51.0 — painted support upgrades

- Replace all 32 outlined support icons with individual painted ship modules, including Overclock, shields, armour, drives and chips. Match the slate metal and restrained energy of the weapon arsenal.
- Share the artwork across upgrade offers, HUD racks, build inventories, specialisations, synergy combinations and evolution recipes. No stat, save, recipe or combat changes.
- Cache both support atlases for offline play and add a production support artwork gallery.

# v0.50.0 — evolution transformations and painted arsenal

- Replaced the rejected vector attack miniatures with 96 painted base/evolved sprites across four transparent atlases, following the approved slate-armour ship study. All weapon surfaces share the new sprites.
- Added a distinct real signature cycle to every evolution: deployable batteries, missile carriers, cutting rings, converging lances, linked defences, collapsing vortices, staged bombardments, spreading clouds and moving formations. See `EVOLUTION-TRANSFORMATIONS.md` for all 48 identities.
- Share painted hardware between icons and gameplay. Keep actual damage, interception, pulling, freezing, homing and impacts in simulation; rendering remains pure. Iron Halo’s new active rings replace its legacy blade contacts and interception while visible.
- Add individual signature audio accents and use the existing evolution reveal to describe the new cycle. Preserve all base attacks, recipes, discoveries, slots and banked progression.
- Bound signature fields, nodes, shots, missile generations and visual impact histories. Ordinary signature shots respect cover; phase torpedoes pass through. Include all four atlas files in offline caching.

# v0.49.0 — arsenal discovery and illustrated weapon icons

- Added Arsenal discovery from launch, pause, results and Records. Search weapons, evolutions and combinations; filter discovered, undiscovered or current-build entries; inspect roles and exact evolution requirements.
- Track one evolution recipe per pilot profile. Matching upgrade cards and the paused Build page show the tracked recipe without altering offers or combat.
- Bank discoveries from normal runs, migrate existing run/leaderboard builds and retain discovery after history pruning. Discoveries and tracking travel with existing profile backups/imports. Live gear is provisional; developer tests add no discoveries.
- Replaced all 48 geometric attack symbols with shaded hardware and energy illustrations, plus 48 evolved variants, shared across upgrade cards, the weapon rack, recipes, reports and the collection. Passive icons remain distinct. SVG templates are cached and each rendered instance has isolated gradient IDs.

# v0.48.0 — campaign and evolution balance pass

- Fixed stationary Power Relays receiving an invalid orbital heading during Storm Relay boss fights. Relays now stay finite, targetable and destructible; destroying them correctly removes the boss armour bonus.
- Binary Supercluster now enlarges its bombardment zones as their orbit widens, retaining the close coverage of Binary Wisps, including its Wide specialisation.
- Orbital Reaping retains Comet Scythes’ original three forward lanes and adds three rearward arcs. Damage, cooldown and six-scythe count are unchanged.
- Added repeatable normal-stat campaign comparisons across all six sectors, build preferences and optional signal routes, plus focused relay and evolution regression checks. See `BALANCE-V048.md` for methods and results. Existing prices, payouts, upgrade probabilities and boss health are retained.

# v0.47.1 — ability meter spacing

- Keep the ability meter above weapon-rack labels at desktop, tablet, phone and small-phone widths.

# v0.47.0 — flight controls and ability polish

- Unified movement and ability direction across keyboard, hybrid, mouse-only and touch controls. Mouse-only abilities use the current cursor immediately; touch steering has a radial dead zone and proportional speed.
- Integrated partial dash, phase and boost steps so burst travel remains consistent at 30/60/120 simulation Hz. Normal steering still responds immediately, stops on release and retains existing ship speeds.
- Added cosmetic hull turn response for all twelve ships, with quicker light fighters and steadier heavy craft. Weapon aim and physical steering stay immediate; reduced motion removes visual lag.
- Added per-charge recharge meters, active-duration states, a quiet recharge cue, directional steering chevrons and compact blink landing marks. The ability button is also available on desktop and supports keyboard activation.
- Added a short single-input buffer for imminent recharge/burst endings. Pause, menu changes, focus loss and resize discard pending input. Secondary touch activation does not steal the steering finger.
- Replaced generic ability descriptions with concrete information for every ship. Existing damage, cooldown values, charge counts and progression are retained.

# v0.46.0 — run variety

- Replaced the fixed encounter loop with shuffled patrol, assault and specialist operation decks. Fleet composition and specialist emphasis vary; every fourth operation remains a recovery window. Specialist unlock timing and boss, formation and population budgets are retained.
- Added optional Relay Circuits to the signal rotation, within the first two signal opportunities. Hold each of three nodes for 1.25 continuous seconds within 45 seconds. Existing bosses suspend the event.
- Relay rewards offer three field protocols: choose a close-range, long-range, cold-target or siege damage bonus for the current run. Only one protocol can be active; choosing another replaces it and uses no equipment slot.
- Show the current operation and field protocol in the pause route report, explain them in How to Play, and retain the chosen protocol in run history. New runs start without a protocol.
- Added test-only relay controls and checks for operation diversity, safe early fleets, node progress/expiry, interruption, rewards, damage boundaries, records and full simulation completion.

# v0.45.0 — combat contact and destruction

- Added directional kinetic sparks, energy splashes, armour chips, heavier pressure arcs and gold critical-hit marks at the target surface. Sustained weapons use smaller contact effects.
- Added brief cosmetic target recoil and a small, throttled heavy-hit camera kick. No hit-stop, aim changes, physical knockback or timing changes.
- Added quiet contact sounds for kinetic, energy, armour, heavy and critical hits, plus short metallic transients in ship destruction sounds. Contact sounds share a rate limit and retain the existing mute, effects-volume and voice caps.
- Added bounded shaded hull fragments to ship detonations. Reduced motion freezes recoil and fragment travel; shake, flash and particle preferences control the corresponding effects.
- Verified identical combat outcomes for all 48 weapons and their evolutions over 150 simulation frames each against v0.44.1.

# v0.44.1 — boss display spacing

- Move notifications below the boss display during encounters so arrival and wave messages do not overlap the name, health or charge state.

# v0.44.0 — boss presentation

- Rebuilt all eighteen sector bosses with individual silhouettes, shaded armour and sector-specific reactors, weapons and machinery.
- Added arrival brackets, reactor charge readouts and exposed overdrive cooling seams. Reduced motion freezes rotating assemblies; charge still reflects the actual attack timer.
- Refined the boss HUD with a half-health marker, reactor identity and explicit inbound, charging, frozen and overdrive states.
- Added six bounded metal fragments to boss detonations. Existing blast duration and combat rules are retained.
- No changes to boss health, damage, collision, spawn schedules, attack plans, warning footprints, drops or progression.

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
