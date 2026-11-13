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
