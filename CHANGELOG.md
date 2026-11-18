# v0.80.0 — layered backgrounds for every sector

- Neon Expanse now uses a layered background: a seamless cloud layer with no structures in it, plus painted top-down structures (rings, platforms, relay stations, antenna arrays, panels and debris) scattered across the map on a deeper, slower layer.
- Structures never repeat in a grid: their placement, size, angle and slow drift come from map position, so every stretch of space looks different, and you get a real sense of depth as you fly.
- Structures scale down on small screens so they don't crowd a phone.
- All ten sectors now use layered backgrounds, each with its own cloud layer and nine painted structures: asteroids and mining rigs (Belt), relay towers and dishes (Storm), smokestacks, pipes and furnace grates (Foundry), ice shelves and crystals (Cryo), rooftops and highways (City), ring stations and satellites (Solar), rune monoliths and arches (Rift), hive growths and egg sacs (Hive), and wrecked warships and anchor chains (Ghost).
- The structures are alive: each one slowly floats around its spot as it turns, its lights glow and pulse (Storm antennas blink, City windows twinkle, Ghost wrecks flicker), and many give off their own effect: smoke from Foundry stacks, embers from the ore pile and Solar reactors, spores from Hive sacs and pods, violet motes from Rift monoliths and crystals, ghostly wisps from Ghost wrecks, frost glints on Cryo ice, and sparks from the Belt drill.
- Effects follow the Particles graphics setting and pause in very crowded moments on Auto.

# v0.79.0 — weapon visuals

- Every player shot carries a soft glow in its weapon's colour and is drawn 20% larger (hit areas unchanged), so weapons are easy to tell apart at a glance and stand out on the painted backgrounds.
- Every beam weapon (Sails, Fence, Leech, Prism, Crossfire, Ion Curtain, Rupture, Harpoon, lasers and more) has a two-layer glowing halo instead of reading as a thin line.
- The glow follows the Glow graphics setting, so it is skipped on Low, and it eases off automatically during very crowded moments on Auto.

# v0.78.0 — visual pass: final bosses, abilities, explosions, backgrounds

- Every sector's final boss has its own design: Omega Reactor, The Scrap Monarch (crowned fortress with crane arms), Heart of the Storm (tesla cage with crawling arcs), The Prime Furnace (molten crucible with smokestacks), The Frozen Sun (ice-spear star), Metroplex Mind (floating district), Solar Throne (crescent throne with solar sails), The Singularity (black hole with an accretion disc), The Overmind (brain-hive with tendrils) and The Phantom Armada (spectral flagship).
- Explosions now leave a warm afterglow and drifting embers that fade in about six seconds, instead of black burn marks that looked like holes in space.
- Ship abilities hit harder visually: a launch flash, glowing filled shapes, afterimage trails along dashes, and a shockwave for abilities that don't move the ship (Harrier, Helios, Spectre, Scavenger and others).
- New painted backgrounds for the original six sectors, matching the four newer ones; sector previews and the website use them too.
- Dread Carrier (Ghost) and Skyline Enforcer (City) recoloured to fit their sectors.
- Every sector's fleet has its own ship silhouettes (salvage boxes in Belt, forked prongs in Storm, heavy wedges in Foundry, crystal diamonds in Cryo, hover-cars in City, flame wings in Solar, obsidian crescents in Rift, beetle shells in Hive, ribbed wrecks in Ghost), scaled up through fighters, interceptors, brutes and elites. Neon Expanse keeps the originals; specialist ships keep their role shapes.

# v0.77.0 — crash reports

- If the game closes unexpectedly (for example a phone running out of memory) or hits a script error, a crash report is saved. The next time you open the game, it shows the report with a Copy button (and Share on phones) so you can send it over.
- Reports note the version, device, screen size, where you were (sector, ship, run time, level, endless, overdrive, launch card) and how busy the screen was (enemies, shots, effects, frame rate, graphics setting). The last six are kept; a "Crash report" link appears on the launch menu while any are saved.
- Nothing is sent anywhere automatically; reports stay on your device until you copy them.

# v0.76.0 — launch cards

- After you press Launch, you're dealt three launch cards: pick one to bend the rules for the whole run, or fly without one. Nine cards: Glass Reactor, Iron Hull, Critical Mass, Boss Hunter, Lucky Cache, Overclocked Thrusters, Second Wind, Scrap Baron and Gravity Collector.
- Your card and what it does show on the pause screen (Second Wind also shows whether it's been used). Keys 1–3 pick a card.
- Test runs (quick tests and the developer panel) skip the cards.
- Each card has its own painted emblem.

# v0.75.0 — jackpot caches and Reactor Overdrive

- Caches now open with a reveal: the crate shakes, the tier label spins, then the lid bursts open before your choices flip in. Tap to skip.
- New painted cache crates (gold for evolution, cyan for supply) in the world and in the reveal, where the closed crate shakes and swaps to the open one as it bursts.
- Every cache rolls a bonus tier on top of its normal choice. BONUS: a free level on one of your items and 20 XP. JACKPOT: up to three free item levels, a full repair, 40 XP and 10 seconds of Overcharge. Evolution caches pay out far more often (about half give a bonus, roughly one in eight is a jackpot) than supply caches.
- Reactor Overdrive: five minutes into endless, hordes of weak orange drones pour in every couple of seconds in rings, columns and pincers, and every weapon hit is multiplied: ×1.5 after the first minute, rising each minute up to ×7. The screen edge glows while it's active.

# v0.74.0 — locked content, matching sector previews and tidier records

- Locked ships show a lock badge, a greyed icon and a dashed outline, with a progress bar toward their unlock challenge. Ships you can buy glow gold.
- Locked sectors have a greyed preview and a gold lock line saying exactly how to unlock them ("Defeat any boss" / "Win any run").
- On phones, locked sectors shrink to compact rows, so sector select is far shorter to scroll.
- The Launch button no longer wraps onto two lines; the ship and sector you picked show in the line above the cards instead.
- Every sector preview is now a painted view of that sector's background, so the original six match the four new sectors (no more gameplay screenshots with icons). The website uses the same images.
- Sector descriptions no longer say "Complete a sector to unlock" once the sector is open.
- Statistics: brand-new pilots see a "No flights logged yet" card instead of a wall of zeros.
- Multikill medals are badges: grey until earned, then lit in their own colour with how many times you have earned them.
- Hangar ships on phones sit in a 3-column grid instead of a sideways-scrolling strip.

# v0.73.0 — simpler menus

- The launch menu is now Play plus four destinations: How to play, Hangar & contracts, Records and Settings. Profile and Website & feedback are small links underneath.
- Arsenal discovery is no longer a separate button on the launch, pause and end screens; it is the Arsenal tab in Records.
- Phones and tablets see touch controls on the launch menu; PCs see keyboard controls.
- Pause buttons: Resume, Restart run and Settings, then Records, Hangar and Back to start.
- End screen buttons on phones sit in a 2×2 grid.

# v0.72.0 — menu polish

- Menus scale up on large screens (PC monitors), so text and buttons are readable instead of a small card in the middle of the screen.
- Text no longer shows through under the Back / Done bars on How to play, Records, Arsenal and the end screen.
- How to play opens on "Your first run", then groups the rest under Basics, Combat, Arsenal and Sectors. The intro now mentions the final encounter.
- Settings tabs wrap onto a second line instead of being cut off at both edges.
- Records keeps one size and a single tab row when switching between Leaderboard, Statistics, Recent runs and Arsenal.
- Pause buttons on wider screens sit in two even rows.

# v0.71.1 — painted sector objects and smoother haze

- The animated haze in Solar Corona, Hive Nebula and Ghost Fleet Graveyard no longer forms soft light rectangles on wide screens. The noise behind it is now rotated and warped, so it reads as drifting cloud, and it is a little fainter.
- Ghost fog is no longer stretched sideways into flat slabs.
- Painted rocks, cover, turrets, spore pods, fuel canisters and salvage crystals/crates for Solar Corona, Abyssal Rift, Hive Nebula and Ghost Fleet Graveyard. Each sector has nine rock and nine cover designs; objects keep their spin and drift, flash when hit, crack as they take damage, and cast a soft shadow.

# v0.71.0 — painted backgrounds and animated sector layers

- Solar Corona, Abyssal Rift, Hive Nebula and Ghost Fleet Graveyard now use painted backgrounds in the same style as the original six (also shown on their sector cards), replacing the code-drawn ones, which remain only as a fallback.
- New animated layers on the GPU over each of them: churning plasma and rising embers over the sun, bent starlight swirling around a drifting centre in the Rift, breathing green haze and drifting spores in the Hive, and rolling banks of pale fog through the Graveyard. They follow the Sector weather setting.
- The new backgrounds are included in the offline cache. GPU module renamed to gpu-layer-v0700.js.

# v0.70.0 — three more sectors and floating debris

- Abyssal Rift: a black-hole trench. Gravity wells drift through the fight for 14 seconds, pulling your ship and the swarm toward a crushing core. Resist them or drag enemies in. Bosses: Rift Stalker (blinks to a marked spot and fires), Event Horizon (pulls you in, then a closing ring of shots with a gap to escape through) and The Devourer (spiral bursts and consume zones); final encounter The Singularity.
- Hive Nebula: a living nebula. Spore pods grow near you and burst after five seconds into acid clouds (burns you) or healing blooms (heals enemies) unless you shoot them first. Hive ships split into two spawnlings when destroyed. Bosses: Brood Mother (launches spawnlings and acid spit), Spore Colossus (plants fast pods, spiral bursts) and The Hive Mind (links three synapse nodes that shield it until destroyed); final encounter The Overmind.
- Ghost Fleet Graveyard: derelict warships in cold green fog. Every 13 seconds an old turret on a nearby wreck wakes up (with a warning ring) and fires aimed bursts until destroyed. Bosses: Salvage Lich (raises revenant ships), Dread Carrier (launches fighter squadrons, broadsides) and The Admiral (gun decks shield the bridge until destroyed); final encounter The Phantom Armada.
- Each new sector has its own generated background, fleet styling, cover (void monoliths, hive growths, wreck sections), weather and menu colours, and unlocks after clearing any sector.
- Drifting rocks now look different in every sector: tech scrap, cratered asteroids, violet crystal with electric veins, slag with molten cracks, ice, city rubble with lit windows, molten solar rock, void stone, organic pods and wreck plating.
- Debris is now weightless: rocks drift slowly on their own and glide much further when pushed or hit before settling.

# v0.69.0 — Solar Corona

- New seventh sector, Solar Corona (unlocked by clearing any sector): skim the surface of a star with a generated sun-surface background, orange weather embers and its own fleet with gold mirror plating.
- Solar flares: every 16 seconds a flare warns for 2.6 seconds (an edge glow, a countdown and an arrow showing its direction) then sweeps across the arena. It burns your ship for 26 unless you shelter in the shadow behind a drifting satellite (shadow zones are marked SAFE during the warning). Flares also blast ordinary enemies caught in the open. No flares during boss fights.
- Satellites are the sector's cover: destructible solar arrays that also block shots. More appear when a flare is coming if none are nearby.
- Three new bosses: Prism Sentinel (cross beams and mirror volleys), Flare Engine (a sweeping lighthouse beam and ring bursts) and The Dying Star (expanding rings, corona strikes and double rings in overdrive), plus the Solar Throne final encounter.
- Built on a new add-on system so the next three sectors plug in the same way.

# v0.68.0 — boss entrances

- Every boss now arrives with a title card: letterbox bars with moving hazard stripes in the boss colour, a light streak, the boss name with a short subtitle (Reactor 1 of 3, Final encounter or Endless reactor) and its class, plus a warning siren. The final boss gets a longer, deeper version. Combat carries on underneath; the boss is still arriving while the card shows.
- Evolved weapons whose signature rides with your ship (such as Salvage Swarm, Solar Lance and Resonance) no longer draw a large weapon sprite under the ship; a small spinning emblem ring in the weapon colour marks them instead, like Constellation Salvo.
- Cosmetic only.

# v0.67.0 — enemy ships in the new style

- Enemy ships now share the player-ship look: darker armour tinted per sector, a bright neon outline in each ship's colour (pink fighters, green interceptors, violet brutes and specialists, gold elites) and neon detail lines on their plating, instead of grey hulls.
- Same shapes, sizes and hitboxes; drawing cost unchanged.

# v0.66.0 — clearer end-of-run screen

- The end screen now opens with a headline summary: sector, Run over or Sector clear, what destroyed you (and whether it was during a reactor fight or the final encounter) or how long the final encounter took, then survived time, level, kills and reactors defeated.
- Highlight badges for a new best score, longest run, new endless record, mastery rank-up, blueprints found and credits earned, plus your top weapon with its share of damage and kills.
- Blueprints, mastery, endless results, unlocks and achievements follow. Route, operation, full stats and weapon performance are folded into Run details.

# v0.65.0 — fewer level-up pauses

- Levels take longer from level 3 onwards (XP needed ×1.55), so a full run has about a fifth fewer level-up pauses: around level 40 at the end instead of 50. In simulated runs every route still clears, with a little more damage taken.
- New Settings → Weapons → Level-ups with three modes. Choose immediately (default) pauses for each level-up as before. Bank choices keeps you flying and shows a glowing LEVEL UP ×N button (or press U) to pick all banked upgrades in one go. Auto-pick never pauses and picks for you, favouring upgrades to what you already own.
- Specialisations, caches and mutations still open as before.

# v0.64.0 — animated menu

- New animated menu scene in place of the flat aurora ribbons: drifting nebula clouds in your selected sector's colours, three layers of parallax stars with shooting stars, and a large showcase boss that cycles through the sector's three reactors and its final boss.
- Your selected ship flies in the scene with engine glow and fires at small enemy waves crossing the screen, which break apart in explosions. Glows pick up bloom.
- The menu panel is narrower on wide screens and lightly see-through with a blur, so the scene shows around and behind it.
- Fix the menu's edge shading being drawn off-centre (a dark block in the lower right).
- Menu-only: its own state and random stream, bounded counts, and still under reduced motion. Runs, saves and combat are unchanged.

# v0.63.0 — deeper endless

- Each endless cycle (every two minutes) adds one new threat, announced on screen, until all seven are active: Armoured Fleet (+15% armour on ordinary ships), Swift Hulls (enemies 20% faster), Swarm Surge (25% more arrivals), Shielded Reactors (endless reactors bring two shield systems that cut damage by 60% until destroyed), Barrage (enemy shots 25% faster), Elite Escorts (elites twice as often) and Self-Repair (damaged ships repair 2% per second). Enemy health and damage keep rising as before.
- Once all six mutations are taken, endless reactor kills offer a stacking Overcharge instead: +12% damage, weapons cycle 8% faster, or +25 maximum HP with a full repair.
- Endless pays 15 credits for every cycle reached after the first.
- Each sector keeps an endless record (best cycle and time survived), shown on the sector cards and in the end-of-run debrief, which also lists the threats faced and Overcharges taken. Saves and backups carry the records.
- Test link: `test=endless&cycle=5` starts endless already at cycle 5 with four threats.
- The sector route is unchanged: threats only exist after choosing endless. Combat parity and the crowd benchmark are identical.

# v0.62.0 — sector boss designs

- Every sector's three bosses now have their own designs in the new boss style, matching what they do:
  - Shattered Belt: Grapple Corsair with snapping grapple claws on cables, Scrap Crusher with toothed jaws that open as it charges and smoking exhausts, Salvage Dreadnought with stacked cargo containers, a bridge tower and a swinging crane.
  - Storm Relay: Relay Keeper with four tesla coils and lightning jumping between them, Arc Conductor with three forked emitters arcing at the tips, Tempest Citadel with six lightning rods, a rolling cloud ring and a crackling core.
  - Cinder Foundry: Slag Harvester with a spinning grinder intake and a bubbling slag tank, Furnace Warden with glowing furnace grates and smoking stacks, The World Forge with four pumping hammer pistons around a molten crucible.
  - Cryo Reach: Rime Stalker as a faceted ice spear with swept crystal blades, Glass Empress as a crown of crystal spires, Absolute Zero as a snowflake of branching crystal arms around a white-hot core.
  - Neon Undercity: Patrol Interdictor with a flashing red/blue light bar and searchlight, Skyline Enforcer with twin siege cannons and lit precinct windows, Metroplex Overlord as a flying city block of lit towers inside a holographic ring.
- All bosses get brighter, colour-tinted armour, thicker neon outlines, panel seams, raised sub-panels and lights; ship-like bosses gain swept fins and pointed prows, square ones gain corner spikes. The dark disc behind round bosses is gone.
- Cosmetic only: hitboxes, attacks and stats are unchanged; combat parity is identical.

# v0.61.0 — boss redesign

- Every boss now shares the player ship's look: dark layered armour plates tinted per sector, a neon edge in the boss colour, inset plates, lit vents and running lights, and a glowing core that picks up bloom.
- Neon Expanse bosses are redrawn: Prism Warden (eight prism pylons on a guard ring, spinning crystal core), Rail Reaper (twin rails that fill with light as a shot charges, three engines) and Singularity Engine (segmented ring, three pods, black-hole core).
- The final boss is a solid armoured ring and citadel instead of outlines.
- Bosses show glowing cracks below half health and more damage below 30%. Frozen bosses turn icy.
- Constellation Salvo no longer draws a carrier sprite under your ship. Its six launch points are twinkling stars joined into a constellation.
- Cosmetic only: hitboxes, attacks and stats are unchanged; combat parity is identical.

# v0.60.0 — final encounter, weapon field effects and faster testing

## 1.3.0 — Combat ship matches the hangar, cleanup

- **In-game ship:** combat is back to the neon 2D style, now shaped like your Blender hangar model. Each hull's top view (silhouette, canopy, armour, painted panels and guidance lights) is baked from its model by `art/blender/bake-combat.mjs`, then drawn with a neon edge in your ship's colour. It appears instantly, with no swap from an old-style ship, and is easy to spot on dark backgrounds.
- **Fitted parts match too:** each hull is traced as its core plus stock wings, engine and gun, and all 16 fittings are traced from their own Blender models (for every hull). Combat puts together your exact loadout the same way the hangar does: fitted wings, engines and guns replace the stock ones, plating sits on top, and flames come from the fitted engine's nozzles. The data lives in `combat-hulls-v1300.js` (about 115 KB to download), and the hangar and the bake share one rule for which piece belongs to which slot (`slotOfObject` in `ship3d-blender.js`).
- The gun stays fixed in place like in the hangar. Aim still follows your movement, or your cursor with a mouse. The item-armour indicators show on your ship in combat again (the 3D combat sprite was hiding them).
- **Hangar:** no more old-style ship appearing before the 3D one. While a model downloads the bay stays empty, then the ship beams in. Your current ship's model now starts downloading while you're on the main menu, so it's usually ready instantly. The stand-in models (`ship3d-fleet.js`, `vanguard-model.js`, `ship3d-details.js`) are removed.
- **Test links behave like the real game:** removed the test-link shortcuts that unlocked every ship and fitting and added a test-ship picker.
- **Star map:** on phones the sun sits partly off the top-left edge instead of behind Neon Expanse.
- **Removed leftovers:** the 3D combat sprite (`ship3d-flight.js`), the Vanguard benchmark and review pages, their scripts and data, a stale test, and five GitHub workflows for old branches.

## 1.2.0 — 3D ship in the hangar

- Your ship in the hangar bay is now a real 3D model, not a flat drawing. It's built automatically from the same design the game draws, so your hull, class, specialisation, paint colour and fitted parts all appear on it.
- The hull is sculpted, not cut out flat. It rises from a thin neon rim to a rounded spine like a real fuselage, with a shallower curve underneath. Every outline has softly rounded corners. Detail plating is shaped to follow the hull's curve across its whole surface, so nothing hovers above it. Pieces that hang off the edge of the hull (lights, pods) are small rounded solids joined to its side, vents are flush inset grilles, and each engine flame comes out of a metal nozzle ring. Wings and engine pods are rounded, tapered pieces, and neon lines run along every edge and panel. It reflects the hangar's lights, gets a coloured rim light and pad glow, and has animated engine flames in your trail colour.
- Translucent parts such as Prism Sails are tinted crystal glass.
- Your trail (plasma, ribbon, sparks) now streams out of each real engine nozzle and follows the 3D ship however it's spun or tumbled, with one trail per engine.
- Drag left and right to spin it, and up and down to tumble it. Flick it and it keeps turning, then it settles back to its pose after a moment. Pinch (or use the mouse wheel) to zoom, and tap for a 3D barrel roll.
- Hull patterns aren't shown on the 3D model yet; they still show in game.
- If 3D isn't available on a device, the bay falls back to the 2D ship automatically. The game itself is unchanged.

## 1.1.0 — Immersive star map

- The star map now has depth: three layers of stars and the nebula shift at different speeds as you scroll, drag, move the mouse or tilt your phone, with a slow idle drift.
- A sun lights the scene from the same side the planets are shaded. It's a glowing star with a fine textured surface, a softly flickering corona, slow solar flares looping off its edge, a warm bloom and a faint lens flare. It stays in view as you scroll, like a distant star (on PC it sits partly off the top-left edge).
- A galactic band of faint stars and dark dust lanes runs across the map, and each sector's planet tints the clouds around it.
- Space dust drifts in front of the planets, and a shooting star crosses now and then.
- The selected planet has a small moon orbiting it, passing behind and in front.
- When your ship flies to a new planet, it leaves an engine trail and the stars streak into a brief warp.
- Motion respects the Reduce motion setting.

**Keyboard flight**

- Keyboard movement now has a little momentum. The ship ramps up to full speed in about a fifth of a second, glides briefly when you let go, and curves smoothly when you change direction instead of snapping between 8 fixed headings. Reversing direction responds faster than a gentle turn, so dodging still feels sharp.
- Dashes and abilities always go the way you're pressing, even mid-glide.
- The ship banks (its wings lean) into turns with every control type: keyboard, touch and mouse. The lean follows how fast the ship is turning, so smooth thumb curves on a phone lean as well as sharp turns. This is visual only, and off with Reduce motion.
- Top speed, diagonal speed, dash and boost distances are unchanged. Touch and mouse steering are unchanged apart from the lean.

## 1.0.0 — Crew and Workshop (RPG update, part 1)

- **Crew quarters** replace the old Ships tab. Pilots you rescue from distress pods now join your crew. Each one has a role and a perk: Gunner +6% damage, Quartermaster +15 hull, Navigator +6% speed, and so on. You start with one crew seat, get a second at ship level 5 and a third at level 10. Assigned crew show under your ship's name in the hangar bay. Pilots you haven't found yet show which planet they're lost on.
- **Workshop** replaces Power-ups. Spend credits to upgrade the parts you own, up to +5. Each level makes the part's bonuses 12% stronger.
- Power-ups are retired. Anything you spent on them is refunded once as credits, and a notice tells you how much.
- Cleanup of old-version leftovers: ship licences and mastery, the hull frame variants and old paint schemes on the Reactor tab, ship-challenge unlock notices, and pods that unlocked ships are gone. Wording throughout (manual, menus, hints, contract rewards) now matches the one-ship game.
- Hangar tabs: Crew, Workshop, Upgrade tools, Contracts, Reactor.

## 0.99.0 — ONE SHIP (rework phases 1 and 2, hangar)

The game now centres on one ship that grows with you, instead of a roster of separate pilots. The classic version is kept on the `classic` branch.

- **Your ship & skill tree:** Play opens *Your ship*. Every ship level gives a skill point to spend in four branches: Interceptor (speed, crits, dashes), Juggernaut (hull, armour, shields), Gunship (damage, fire rate) and Carrier (pickups, credits, drones).
  - 6 points in a branch unlock its **class**, which changes your hull and starting weapon (Wasp, Bastion, Gunship, Scavenger). You can only be one class at a time.
  - **Modules** start every run with a support or weapon already fitted (Thrusters, Energy Shield, Reactive Spikes, Critical Core, Size Matrix, Seeker Drones, Defence Satellites).
  - 9 points: choose one of two **specialisations** (Harrier/Spectre, Sovereign/Glacier, Tempest/Helios, Architect/Echo).
  - 10 points: a **keystone** with a big trade-off (Glass Cannon, Fortress, Overcharge, Swarm Command).
  - Refund every point for 25 credits per point.
- **Ship XP:** every run earns ship XP (kills, bosses, level reached). Existing saves start with bonus points based on bosses already beaten.
- **Star map:** step two is a star map of the ten planets along a route. Beat 2 of a planet's 3 reactor bosses to open the next.
- Results show ship XP and level-ups; the old ship-unlock goals are gone from the results screen.
- **Ship parts (phase 2):** four part slots (Engine, Wings, Gun mount, Plating) with Stock, Rare, Epic and Legendary parts (20 in total). Gun mounts set your weapon slots (5–7) and plating sets passive slots (4–7), so you can trade defence for firepower. Every boss you beat drops a part; duplicates are scrapped for credits. You start with the stock set plus one random Rare part. New parts show on the results screen.
- **Paint & trails:** pick a hull colour and an engine trail (Plasma stream, Spark shower, Rainbow ribbon, Afterimages) with its own colour. Some trails unlock with ship level.
- **Your build steers the cards:** level-up choices lean towards weapons and passives that suit your class (drones for Carriers, shields for Juggernauts, and so on).
- **Hangar bay:** your ship, large and animated on a landing pad. Drag it to spin it (with momentum) and nudge it about; tap for a barrel roll. Trails curl as it spins. Fitted modules show around it (drones, satellites, shield bubble, spikes, crit reticle, area ring); maintenance drones weld the hull; nav lights blink; a diagnostic scan sweeps over it when you open the screen or change class. Tilt your phone (TILT button) or move the mouse for parallax.
- **Detail pass:** ships get panel seams, a specular sheen and rear shading (in runs too), plus rivets, wing vents, engine nozzles and an antenna in the hangar. The hangar is now a scene: back wall with ribs and a lit girder, an observation window onto a planet, light rigs, docking clamps that release when you grab the ship, a hazard-striped pad with a BAY 07 decal, and drifting dust. Panels get icons on every skill and stat, cut-corner cards and section markers.
- **Part art and hangar backdrop (ChatGPT art):** found parts now show on your ship, in the hangar and in runs. Engines and wings sit behind the hull, plating over it and gun mounts on the nose, each in its rarity style (blue blade fins, purple prism sails, gold phantom wings, nova flames and more). Parts are drawn in code in the ships' own neon style and fitted to each hull: blade, vane, prism and phantom wings extend from the hull; twin, ion, fusion and nova engines bolt on at the back with flames from their own nozzles; hex, truss, slab and dome armour cover the body; heavy, rotary, array and siege guns form the nose. Their lights use your ship colour, or rarity colours via Paint › Part lights. Parts are shaded like the hull (panel sheen, seams, rivets, wing-root fairings) and animated: rotary barrels spin, the fusion core pulses inside a turning ring, nova plasma rings stream, ion grilles ripple, prism sails glint, phantom membranes shimmer, hex armour ripples with light, Aegis seams pulse and tip lights blink. Higher rarity glows stronger. A fitted gun mount replaces the turret and aims at enemies. The ChatGPT part art is used for the part pictures. The Parts tab shows the real part art, with silhouettes for parts you haven't found. The hangar bay has a painted backdrop: window onto a blue planet, light rigs and a striped landing pad.
- **Feedback:** unlock bursts, a class-change beam, equip "clunks" at the part's hardpoint, counting stat changes, and sounds for each.
- **Part previews:** tap a part to see green/red stat changes and its outline on the build radar before equipping.
- **Build radar:** a six-axis chart (speed, damage, defence, crit, firepower, utility) that morphs as your build changes.
- **Name your ship** (shown in the bay, launch summary, results and PC HUD); **colour wheel** with brightness for hull and trail; **hull patterns** (racing stripes, chevrons, tiger, camo, digital camo, hex armour, carbon fibre, neon edge; bold enough to read in-game, with their own colour and picker previews) and a **glow** slider; **3 saved loadouts** of parts, paint and trail.
- **Star map redesign:** a calm animated space backdrop with soft hyperlanes, shaded spinning planets in each sector's colour (rings on some), a compact mission card, and smooth motion: planets float, fade in one by one and the routes draw in when you open the map; it glides to your current planet; picking a planet pops it, slides the card info in and flies your ship over.
- **PC layout:** on wide screens the ship screen is two columns (big hangar bay and stats on the left, Skills/Parts/Paint on the right), the star map is a wide horizontal route showing every planet at once, and the header is compact.
- **Film grain setting** (Settings › Graphics): Off, Low (new default), Medium, Strong. It was too strong on PC.
- **Launch sequence:** your ship lifts off and the screen warps to the star map; your ship flies the route when you pick a planet.
- **Swipe** left/right to change Skills/Parts/Paint, or branches on the tree.
- Includes the unreleased 0.98 work: first-run flight tutorial, clearer control settings, itch.io build script.

## 0.98.0 — Flight tutorial, clearer controls, itch.io build

- **First-run flight tutorial:** six short tips on your first run (flying, gems, levelling, evolutions, dash, the reactor timer). Each step moves on when you do it; skippable, never blocks play, and replayable from the Field Manual.
- **Control settings tidied:** every PC mode now says how to dash; modes ordered Mouse + keyboard, Keyboard only, Mouse only, Touch; plainer wording; the dash is called the dash everywhere (not "ship ability"); phones no longer mention the U key.
- **Level-up choice moved** from the Weapons tab to Gameplay.
- HUD version label fixed (it still said 0.29.0).
- `build-itch.sh` makes an itch.io upload zip with only the files the game needs.

## 0.97.0 — Physics wreckage and screen effects

- **Matter.js wreckage:** destroyed ships and broken crates break into hull chunks that tumble, knock into each other, bounce off structures, get flung by explosions and the Plasma Breath jet, and get shoved aside when you fly through them. Hot chunks glow orange as they cool; frozen kills leave icy shards. Cosmetic only (max 140 pieces, own random numbers; off with reduced motion or particles off).
- **pixi-filters effects** on the enemy/scenery layer: shockwave ripples from heavy kills, boss kills, big blasts and your death; an RGB-split glitch when you take damage; an icy colour grade while Chrono Stop has enemies frozen. Off with reduced motion or screen flashes off.
- PixiJS is rebuilt with the four filters bundled in (one PixiJS instance, +26 KB).

## 0.96.0 — Smoother mid-game, cleaner phone HUD

- **Swarm director:** when ordinary enemies pile up past ~110 because the build can't keep up, new spawns slow down (about half as often at 165 alive). Strong builds never trigger it; endless mode is unchanged. In bot tests the weak builds that used to hit the 240-enemy cap and die around 7 minutes now peak at 150–170 and survive past 10–13 minutes.
- **Plasma Breath pickup:** the faint squiggle on the card is replaced with a proper layered neon flame, and its marker/boost icon is now 🔥 instead of ♨.
- **Plasma Breath effect:** the five flat orange beams and the pulsing ring are replaced with a streaming particle flame jet (white-hot at the nozzle, cooling through orange and red to smoke) that fills the damage cone.
- **Phone HUD (≤600px):** brand text hidden; clock, objective and kills on one compact row; wave label dropped; smaller settings and pause buttons; credits and total score hidden during play; the combo counter sits top-left and the boss bar is shifted right so they no longer overlap; toast and boost chips moved below them.

## 0.95.0

- Faster start: the first level now needs 3 XP instead of 5, and early levels are about 40% cheaper, easing back to normal by level 10. Enemies arrive about twice as often in the first minute and a half, so there's action and XP straight away.
- Neon Bolts fires 25% faster.
- Evolutions you can actually reach:
  - Every weapon card now shows which passive it evolves with and your progress (for example "Rail Lance 3/5 + ○ Guidance Chip"), including weapons you already own.
  - If none of the three level-up cards helps an evolution, there's a good chance one of them is swapped for a card that does.
  - When an evolution becomes ready, a banner tells you, and the next elite (which drops the evolution cache) arrives within about 10 seconds.

## 0.94.0

- Smarter enemies (Yuka AI). Ordinary ships now pick a tactic:
  - Swarmers fly as a flock, keeping spacing and moving together.
  - Flankers swing wide round to your far side to surround you, then dive in.
  - Direct ships charge straight at you as before.
  - Heavies keep their spacing so they don't stack up.
- Badly damaged small ships break off and flee for a couple of seconds before coming back.
- Enemy speed, damage and toughness are unchanged; only how they move is smarter. Bosses, formations and special enemies keep their own patterns.

## 0.93.0

- Procedural maps (simplex-noise): every run now has its own randomly generated layout. Each sector is shaped into dense belts, scattered fields and empty open voids, so you fly through real places instead of an even sprinkle.
- Belts are packed with asteroids (more of them, spawning faster, and bigger) and background scenery; voids are open space with almost nothing in them. A banner tells you when you enter one, named for the sector: Asteroid Belt, Ice Field, Slag Field, Ion Shoal, Wreckage Row, Corona Debris, Accretion Band, Spore Bank, Ship Graveyard or Debris Field.
- Asteroids still drift and can be blasted, so a belt never boxes you in.

## 0.92.0

- Eight new soundtracks, all generated in the game and each built around its sector:
  - Cinder Foundry, Furnace Breaks: industrial halftime with anvil clangs, steam vents and a grinding bass.
  - Cryo Reach, Glacier Rollers: liquid drum & bass with crystal bells and warm pads.
  - Neon Undercity, Undercity Pressure: cyberpunk neurofunk with a gated synth arpeggio, police sirens and a growling reese.
  - Solar Corona, Solar Flare: euphoric rave jungle with hoovers, major stabs and piano chords.
  - Abyssal Rift, Event Horizon: dark halftime with a sub drone, glitch stutters and swelling risers.
  - Hive Nebula, Swarm Riddim: acid ragga jungle with a squelchy 303 line and insect-buzz sirens.
  - Ghost Fleet, Ghost Signal: haunted dub with ghostly choir, theremin melody, distant bells and long echoes.
  - Final bosses, Reactor Meltdown: everything at once at 180 BPM with an alarm siren.
- Adaptive music: the track is muffled when the arena is quiet and opens up fully as the swarm builds, and always at full blast in boss fights.
- All new tracks can be picked in the soundtrack setting.

## 0.91.0

- Animated menus with GSAP (bundled offline): every menu panel springs in and its contents cascade into place; level-up and specialise cards flip in one after another (and again on reroll); buttons and cards squash when pressed and bounce back; the Launch button gently glows; the menu logo floats; and the numbers on the results screen count up.
- Turned off with reduced motion. Animations never block taps.

## 0.90.0

- Sound pass 1 (ZzFX): new generated sound effects. All 48 weapons now have a sound that fits them (blasters, needles, shotguns, missiles, zaps, lasers, ice, goo, pulses, comets…) instead of most sharing one beep.
- Every destroyed ship now makes a sound (crunchy pops for small ships, heavier booms for elites, a huge blast for bosses), placed left or right in stereo by where it happened.
- XP gems climb in pitch when you hoover up a run of them, like Vampire Survivors.
- New explosion, hurt, dash, boss arrival and boss fire sounds, and soft clicks on menu buttons.
- Sounds are generated once and reused, with voice limits so big fights stay clear and don't distort.

## 0.89.0

- PixiJS renderer, stage 1 (bundled offline): ordinary enemy ships and all the floating sector scenery are now drawn by PixiJS as GPU sprites. Each enemy design is painted once into a texture, then reused, so crowds are much cheaper to draw (about 3x faster with 220 enemies on screen in testing). They look the same as before.
- Bosses, special enemies, the player, weapons and effects still use the existing renderer for now; they move across in later stages.
- Only used when the three.js background is running. On older devices, or if PixiJS fails, everything is drawn the old way automatically. Add `&pixi=0` to the address to compare.

## 0.88.0

- three.quarks particle explosions (bundled offline beside three.js): every destroyed ship now bursts into GPU-batched sparks and glowing embers in its own colour, elites add a fireball, bosses erupt in a huge shower, and your own ship's death gets a big particle blast on top of the existing explosion.
- Particles feed into the bloom so they glow, follow the graphics settings (off on Low and with reduced motion), thin out when the screen is crowded, and are capped so phones stay smooth. If three.quarks can't load, the old effects carry on alone.

## 0.87.0

- Orbiting Blades are now **Defence Satellites**: little satellites with solar panels circle your ship and zap ships they touch. The evolution, **Laser Lattice**, links them into a glowing laser ring, and its special ability spins two rings of linked satellites.
- Comet Scythes are now **Rogue Comets**: blazing comets with glowing tails arc out and swing back. The evolution, **Comet Storm**, adds comets behind you and its ability spirals out three giant comets.
- Same damage, range and behaviour as before; only the names, descriptions, art and icons changed.

## 0.86.0

- Death explosion: when your hull is destroyed the action freezes and your ship blows apart (white-hot flash, fireball, three shockwave rings, sparks, smoke and spinning hull shards in your ship's colour, with a screen shake and a short phone buzz where supported), then the screen fades into the results instead of cutting straight to the menu.
- Vignette softened slightly.

## 0.85.0

- Post-processing: the glow layer now uses the postprocessing library's mip-chain bloom (bundled offline beside three.js) for smoother, wider, richer halos. If it can't load, the old bloom is used automatically.
- Getting hit now gives a quick red-blue chromatic split and a red flash around the screen edges; defeating a boss gives a warm flash.
- Subtle film grain on Medium and High graphics, and a soft vignette that darkens the screen corners (off on Low).
- Reduced motion turns off the colour split and the grain.

## 0.84.0

- New neon art style for the world, matching the ships: every pickup, XP gem, cache crate and distress pod, all 90 background structures across the ten sectors, and the painted terrain in Solar Corona, Abyssal Rift, Hive Nebula and Ghost Fleet now use flat dark hulls with a crisp neon outline.
- Scenery now sits in three depth layers (far, mid and near) that drift at different speeds. Each piece drifts and slowly spins like it is floating in space, its neon edges pulse, and on the GPU renderer the three.js bloom layer adds a soft halo. Far and near layers switch off on Low graphics and when the screen gets crowded.
- Menu previews for all ten sectors now show each sector's background.
- Pickups and gems are slightly larger with a soft glow so the line art reads at phone size.
- Launch card emblems and all 128 weapon, evolution and passive icons redrawn in the same neon style.
- Fixed a script error when drawing some ice rocks in Cryo Reach.

## 0.83.0

- Power-ups shop (Hangar → Power-ups), Vampire Survivors style: permanent ranks bought with credits that apply to every ship. Might, Armour, Max Hull, Recovery, Cooldown, Area, Velocity, Thrust, Magnet, Growth, Greed, Luck and Revival (come back once per run at 50% hull).
- Each rank costs more than the last, and every rank you own makes all others 10% dearer. Refund all returns every credit spent so you can rebuild.

## 0.82.0

- Campaign, Vampire Survivors style. Sectors now open in order: defeat 2 bosses in a sector to unlock the next (Neon Expanse → Shattered Belt → Storm Relay → Cinder Foundry → Cryo Reach → Neon Undercity → Solar Corona → Abyssal Rift → Hive Nebula → Ghost Fleet). A banner announces each new sector.
- Stranded pilots: ten ships are now found, not ground out. Each sector hides one pilot; their distress pod appears two minutes into a run, an edge arrow points to it, and holding position over it for 3 seconds rescues them. Rescued pilots can then be bought in the Hangar. Wasp still unlocks from 500 kills.
- Painted distress pod: it drifts, spins, smokes, sparks and flashes its red beacon, then splits open when the pilot is rescued. A ring of enemies guards it (more in later sectors) and reinforcements warp in while you hold position.
- Existing saves keep every sector and ship they had already unlocked.

## 0.81.0

- Painted pickups: coins, coin bags, XP gems (4 tiers), repair, chrono stop, purge beacon, XP vacuum, plasma breath, fortune shard, reroll, salvage fever, reactor surge, size matrix, kinetic drive, afterburner, overcharge and aegis now use hand-painted art with a soft coloured glow. Old icons stay as a fallback while images load.

## Final encounter
- A sector route no longer ends at the third reactor. About 20 seconds after it falls (after your mutation pick), a final boss arrives: Omega Reactor, The Scrap Monarch, Heart of the Storm, The Prime Furnace, The Frozen Sun or Metroplex Mind, depending on the sector.
- Phase I: four systems orbit the core. Two shield systems cut damage to the core by 60% until both are destroyed; two cannon systems fire aimed bursts. The core alternates ring and fan volleys.
- Phase II (below 65%): the remaining systems blow and a new array deploys: one shield system and two lance systems that fire telegraphed beams. The core adds spiral bursts.
- Phase III (below 30%): Core Meltdown. No systems or shields, the core moves faster and fires denser rings plus rotating cross beams through itself.
- Every attack is telegraphed. Destroying the boss wipes the remaining fleet, adds 5,000 score and a blueprint, then clears the sector after a short pause. The merchant waits until it is over.
- The boss bar shows the phase and how many systems are left; the route panel and objective show the final encounter; Recent runs record how long it took.
- New quick test and test link: `test=final`. The Developer tab's boss button spawns it after the three reactors.

## Faster testing
- Add Quick tests to Settings → Developer: Weapon showcase (any weapon at level 5, base or evolved, invulnerable, with a ring of enemies), Boss fight (late-run build plus the next sector boss), Late-run swarm (evolved build, eight minutes in, 100 enemies, invulnerable) and Endless. They start playing immediately using the chosen ship and sector.
- Add test links: `index.html?play=1&test=weapon:gravity:evo`, `test=boss`, `test=swarm` or `test=endless`, with optional `&ship=` and `&sector=`. The Developer tab shows the link for the current choice.
- Developer unlock can be kept on this device until you lock the panel.
- Recent runs now show what defeated you, blueprints recovered and mastery XP gained.
- Quick tests and test links are developer test runs: no credits, unlocks, records, blueprints or mastery.

## Weapon field effects
- Redraw weapon fields with GPU shaders beneath the ships. Gravity Well is a black hole with a dark core, a spinning accretion ring and arms spiralling inward; void rifts (Phase Torpedoes, Void effects, Sovereign's rift) use a violet version.
- Toxic Cloud billows as drifting gas; Plasma Rain pools swirl with a bright rim; Corona is a flickering ring of heat; Stasis Net and pylon beacons show a pulsing lattice; Ember and Slipstream trails burn as flame; storm hazards crackle.
- Fields can now darken as well as glow. Gravity and void cores add to bloom.
- Compatibility mode and the classic renderer keep the previous drawing. No gameplay, damage or hitbox changes.

# v0.59.0 — sector weather

- Add sector weather on the GPU: driving rain and lightning in the Storm Relay, snow in Cryo Reach, rising embers and furnace glows in Cinder Foundry, neon rain and sign flicker in the Neon Undercity, drifting dust in the Shattered Belt and light motes in the Neon Expanse. Particles drift at two depths with parallax.
- Lightning draws a branching bolt and lights the whole scene for a moment. Furnace and neon glows light the scenery they pass. Flashes off turns lightning into a distant flicker without bolts; reduced motion turns weather off.
- Add Settings → Graphics → Sector weather (On/Off). Low turns it off; Medium and High turn it on. Weather keeps running with bloom off.
- Fix GPU glow halos and sparks never being drawn by the real Three.js since v0.55: sprite quads were culled as back-facing. Halos, sparks and light pools now appear as designed, and bloom strength is rebalanced for them.
- Weather uses its own random stream and never changes combat; parity and the crowded benchmark are identical.

# v0.58.0 — blueprints and mastery

- Add weapon blueprints. Every sector boss drops one for a weapon in your build, as do every sixth elite, completed signals and cleared breaches. Each weapon has three tiers: Mk I, II and III add 10%, 20% and 30% damage in every future run. The weapon is chosen from your build (lowest tier first, then your top damage dealer); once your build is maxed, other weapons are upgraded in turn, then blueprints become 60 credits.
- Blueprints are banked when recovered, so a lost run keeps them. Upgrade cards, the Arsenal and the run debrief show tiers. Developer test runs never award them.
- Add ship mastery. Each ship earns XP from survival time (1 per second), sector bosses (50) and clears (200), up to rank 5. Ranks 2–5 unlock Ember, Violet, Frost and Mastery gold accent paints for that ship in the Hangar; rank 5 adds one reroll to every run with that ship.
- Saves and backups carry blueprints, mastery and ship paints; older saves load with none.

# v0.57.0 — smooth in big fights

- Shots now check only enemies in nearby grid cells instead of every enemy, in the same order as before. Identical combat results in all 48-weapon parity scenes and four seeded 200-enemy fights.
- Reactive gas does no work when no gas is visible and no longer allocates per ship each step. Blade orbits and debris collisions avoid repeated maths and temporary lists.
- Simulation is about 20–30% faster in crowded fights in the new `BENCHMARK-CROWD.cjs`.
- Bloom adapts to the device: if the frame rate stays below about 85% of the target, it eases from Full to Subtle, then pauses, and returns after ten smooth seconds. Your saved setting is unchanged; Settings shows when it has been eased.

# v0.56.0 — bloom and lighting

- Add real bloom: a second GPU canvas above the playfield blurs the bright parts of each frame (shots, explosions, engines, pickups, damage numbers) at two sizes and adds them back with additive blending.
- Add dynamic lighting: explosions, blast effects, bosses and the player's ship light up the sector artwork around them in proportion to its colour, with a soft light pool over nearby ships.
- Add Settings → Graphics → Bloom & lighting (Off, Subtle, Full). Low turns it off, Medium uses Subtle and High uses Full; Auto follows its current level. Lighting is gentler with flashes reduced or off, or with reduced motion. Sparks now draw crisp on top with their own glow.
- Load every image drawn into the playfield as trusted, so bloom can read the frame on iOS. If a frame can't be read, bloom falls back to effect glow for the session; if the bloom canvas can't start, v0.55 visuals remain.
- No gameplay, damage, hitbox or save changes; combat parity matches v0.54 for all 48 weapons.

# v0.55.2 — iPhone and iPad backgrounds

- Root cause: Safari marked the sector artwork as unreadable, so the GPU could not receive it. Sector images now load with `crossOrigin` set, which also restores the material finish and scenery lights that iOS had been silently skipping.
- Fix black sector backgrounds with GPU effects on iPhone and iPad (Safari's engine, used by every iOS browser). The sector artwork now reaches the GPU as raw pixels instead of a canvas upload.
- Add a background self-check: on each new sector the GPU layer compares a few rendered pixels with the artwork. If they differ on any device, it switches to compatibility mode: the classic background with GPU glow and particles added on top. Settings shows which mode is active.
- Use portable shader edge maths so stars and spark cores render the same on Apple graphics chips.
- If the first upload fails the check, try three alternatives (power-of-two resampled, and both without mipmaps) before using compatibility mode. Add `&gpudebug=1` to show the GPU name and per-method check results in Settings, and `&gpucheck=0` to skip the check for testing.

# v0.55.1 — bundled Three.js

- Ship Three.js 0.187.0 with the game (`vendor/three-0.187.0/`, MIT licence) instead of loading it from a CDN. GPU effects no longer depend on a third-party site and work offline from the first visit.
- Verified the GPU layer against the real library: shaders compile, the background matches the classic renderer, and glow, particles, settings and fallback behave as in v0.55.0.

# v0.55.0 — GPU layer (Three.js)

- Add an optional Three.js renderer beneath the playfield. It draws the sector background at the same position and scale as before, adds two parallax star layers for depth, and adds soft additive glow around shots, hostile fire, explosions, gems, enemies and the player ship.
- Render particles on the GPU as glowing sparks. At High glow, the costly 2D shadow blur is reduced because the GPU supplies the glow.
- Add Settings → Graphics → GPU effects (on by default) with a live status line. Glow, particle, Low preset, crowd and reduced-motion settings still apply.
- Fall back automatically to the classic renderer if Three.js cannot load, WebGL2 is unavailable or the GPU context is lost. 
- No gameplay, damage, hitbox, save or recipe changes; all 48 weapons match v0.54 in the combat parity check.

# v0.54.0 — lighter downloads

- Convert all painted weapon and support atlases, the wordmark, sector backgrounds and sector previews to WebP. Transparency and crop sizes are unchanged. First-visit download falls from about 20MB to about 5MB.
- Stop embedding images and the font in `index.html` (6.1MB → 0.75MB), so the menu appears sooner. Each asset now loads once from its own cached file instead of twice.
- Serve Exo 2 as WOFF (296KB → 133KB). Start loading the selected sector's background during ship and sector selection.
- Update the offline cache list and cache version. Remove superseded PNG/JPEG copies. No gameplay, balance, save or recipe changes.

# v0.53.0 — physical shields and combat materials

- Give Energy Shield a curved honeycomb shell with shaded metal emitters. Brighten nearby hex cells on actual absorbed hits, show directional rim impacts and a short collapse on depletion; show a reform pulse when charge returns. Reactive Screen uses a lighter outer shell. Respect Low effects, reduced motion and flash settings.
- Review production painters across all 48 base/evolved weapons and 32 supports. Replace older mine, cryo-charge, satellite, pylon, drone, crescent, scythe and decoy hardware with the shared painted materials; add a physical gravity core and softer cloud/plasma material. Preserve enemy mine warning art.
- Fit owned support modules to the hull in bounded mount positions, with modest thruster accents. Retain existing armour, interception, repair and reactive effects.
- Feather painted icon crop edges and use a bounded sprite cache for the same soft edges in gameplay. Discovery, upgrade and build icons share the treatment.
- Preserve damage, cooldowns, hitboxes, shield capacity, saves and recipes. Add shield event/painter regression checks and an optional 128-case native artwork review tool.

# v0.52.1 — align every painted crop

- Align column and row boundaries to actual artwork across all four weapon sheets, removing remaining neighbouring hardware fragments. Keep exact source clipping for every DOM icon.

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
