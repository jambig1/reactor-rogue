# Reactor Rogue

[Play Reactor Rogue](https://jambig1.github.io/reactor-rogue/)

A neon spaceship survivor game with twelve pilots, distinct movement abilities, 48 weapons and evolutions, weapon combinations, six sectors and a persistent Hangar.

Open `index.html` in a full browser to play offline. No installation, dependencies, API keys or build step are required. Keyboard/mouse and touch controls are supported. Progress stays in each browser.

## Development

Current version: 0.34.2. `index.html` is the self-contained game. See `DEVELOPMENT-HANDOVER.md` for mechanics, decisions and testing limits.

GitHub Pages publishes the root of `main` automatically. Update the complete game file and verify the deployment before reporting a live update.

## v0.5

Pause → Weapons and the results screen show effective damage, damage share, DPS, finishing-hit kills and boss damage. Recent runs retain the breakdown. Five weapons received an initial damage tuning pass. Shattered Belt and Storm Relay each have three themed boss encounters; Neon Expanse retains its original roster.

## v0.6

Eleven ships now have individual challenges and credit licence purchases. Vanguard is free for new players; pre-v0.6 saves keep all six original ships, their credit balances and equipment. Five new ships: Scavenger, Spectre, Architect, Helios and Echo, each with a distinct starter and ability. Hangar → Ships shows requirements, progress, prices and ownership. Hangar → Upgrade tools sells three permanent ranks each for skips, rerolls and banishes, applying to future runs. Credits are earned from kills, survival, bosses, breaches and contracts, including on defeat or leaving a run. Saves are local to each browser.

## v0.6.1 menu and progression review

Compact launch roster, ship list/detail Hangar, clear ownership and affordability states, permanent tool upgrade rows and structured Pause/results summaries. Menus support native touch scrolling while canvas flight gestures remain isolated. Hangar navigation and Back stay visible; opening it from Pause banks current challenge progress and credits without duplicating rewards. Settings, records and Hangar hide and restore their parent screen. Existing saves and purchases are preserved.

## v0.7 - ship identity and progression feedback

Every ship has a distinct passive, detailed hull and menu icon, engine trail and ability effect. The HUD shows available credits and run earnings, with non-blocking ship challenge notifications. Results show progress towards the next two unowned ships and a shortcut to their licences. Scavenger earns 20% extra run credits, excluding contract rewards.

Starter balance: the first level offers a starter upgrade, and equipped weapon upgrades no longer inherit their acquisition rarity penalty. Phase Torpedoes fire two shots (three evolved), with a 2.2s base cycle. Licence prices are unchanged. See `BALANCE-NOTES.md` for simulation results and limitations.


## v0.7.2 - weighted salvage
Salvage crates now use a level-gated, Luck-aware weighted pool inspired by Vampire Survivors. Crates check for a spawn each game second at 10% base chance (50% Luck cap; 10 crates nearby). Their drops include credit chips/bundles/caches, 30 HP repair cells, XP-only vacuum, Chrono Stop, Purge Beacon, Plasma Breath, Fortune Shards, Reroll Tokens, and level-30 Salvage Fever/Reactor Surge. Credit values are adapted to this game: 1/5/25. Common ships retain XP; elites retain caches and can drop existing combat supplies/passive upgrades. Bosses resist Chrono Stop. Since v0.7.3, Purge also destroys visible bosses. Drop rates and effects are listed under How to play → Salvage drops and rates. The v0.7.1 compact card fix is retained.


## v0.7.3 - cinematic pickup waves
Purge now sends three expanding pressure ripples through a glowing honeycomb grid, with a flattened equatorial shock ring and travelling ship destruction. Visible ships, including bosses, break into hull fragments as the front reaches them; hostile projectiles inside the front are cleared too. Existing kill/XP/cache/mutation accounting is preserved, with reward menus held until the targeted ships are cleared. Chrono Stop sends an icy pulse and encases frozen ships in faceted ice, cracks and crystal spikes. Both pickups have distinct synthesised cues. Reduced motion uses static fading geometry without expanding rings, shimmer, shake or flying shards.


## v0.7.4 - combat explosions
Ship deaths, boss deaths, explosive impacts, fuel/gas chains and salvage destruction now use layered reactor blooms, bright cores, pressure rings, broken arcs, outward streaks and glowing hull fragments. Small ships have short compact bursts; bosses get wider, longer detonations with an equatorial shock disc. Frozen ships shatter in icy blue, with compact ship pops and deeper boss detonation sounds. Large blasts leave the existing fading smoke/embers. Effects are bounded, overlapping same-frame blasts merge, and reduced motion uses static fading geometry. This update changes visuals only: damage, drop rates, prices and progression are unchanged.


## v0.8 - Graphics & Effects
Settings now has a Graphics & Effects tab with Auto/Low/Medium/High/Custom presets; glow, particles/debris, explosion detail, smoke, damage-number modes, screen shake, flashes, playfield resolution, 30/60/display drawing limits, FPS counter and reduced-motion controls. Choices apply immediately, save independently of progression, and have a graphics-only reset. Auto starts at Medium, drops to Low after sustained slow frames, and cautiously recovers to Medium; High is an explicit choice. Enemy outlines, attack warnings, damage-area footprints and pickup icons remain visible. Menus/HUD use native resolution. Rendering limits are separate from simulation pace.


## v0.8.1 - contextual upgrade combinations
Level-up cards show related evolution recipes and weapon synergies only when at least one part is already equipped. Both component names are shown with owned/missing marks; evolution weapons show their level out of5. Ready recipes point to an elite cache, evolved weapons are marked, and synergy cards show active or completes-on-pick status. Neither part owned means no hint, even when that item is offered.


## v0.8.2 - clean per-run upgrade hints
Starting or restarting a run explicitly clears the previous upgrade choices and card markup. Combination hints continue to use only current-run equipped items and evolution state; prior runs and archive discoveries do not reveal them. Your starting weapon counts as owned.

## v0.8.3 - hints on the missing component
Upgrade cards only show a combination or evolution hint when the offered item is not equipped and its partner is already equipped in this run. Owned-item upgrade cards and completed pairs show no hints.

## v0.9.0 - priority enemy ships
Existing shield carriers gain a distinct wing silhouette. Hunters lock a 0.95s warning lane before a 0.5s charge; volatile ships leave a 0.45s enemy-only chain blast; fighter carriers warn for 1.2s before launching two fighters (six alive and twelve total per carrier). Introductions at 50/80/105/145 seconds, using the existing specialist spawn budget. Caps: 12 specialists, two shield/fighter carriers each, four other specialists per role, 240 total ships, 24 queued chain blasts. Freeze pauses abilities; carrier protection retains existing 20% reduction, damage numbers use actual mitigated damage, chain damage is attributed to the triggering weapon. No new cache farming or permanent progression. Contextual hints remain missing-component-only and reset each run.

## v0.10.0 - optional distress signals

Rescue a stranded pilot and reach extraction, protect a freighter with its own hull, or destroy an unstable reactor before containment closes. Signals require acceptance and can be ignored, dismissed or abandoned. Their timers and objective damage pause during bosses. One optional encounter is shown at a time using the existing HUD; a shuffled set of three signals is followed by an original reactor breach.

Successful signals give 20 XP, 300 points and one reward choice: compatible Rare-or-better equipment (40 XP fallback), repair (reroll fallback at full hull), or 25 bankable credits. Raiders have a one-second arrival warning and a twelve-ship lifetime cap per event, within the existing ship budget. New signal completions stay separate from reactor-breach unlock requirements. Equipment slots, banishes and existing saves are respected.

See [ROADMAP.md](ROADMAP.md) for the agreed ten-step plan. Step 2 was completed in v0.11.0; step 3 is next. Run `node TEST-DISTRESS.cjs` for the dependency-free state/regression checks. Render and device-performance checks are documented in the handover.

## v0.11.0 - more weapon specialisations

Eight additional weapons now branch at level 3: Neon Bolts, Scatterburst, Frost Shards, Chain Lightning, Toxic Cloud, Gravity Well, Nova Reactor and Pulse Laser. Choose between extra bolts or penetrating lances, tight or wide shotgun cones, stronger freeze or forward ice javelins, longer chains or concentrated triple strikes, ship-centred or concentrated poison, stronger gravity pull or early collapse, wide or double novas, and broad or armour-cutting beams.

Each path has an explicit trade-off, remains active through evolution, uses no extra slot and resets each run. Original Cannon/Repeater/Shield paths remain, for 22 choices across 11 branching items. Upgrade previews apply the chosen damage multiplier, cards identify the path, Pause explains it and weapon reports name it. Specialisation choices use compact responsive cards and pause combat. Run `node TEST-SPECIALISATIONS.cjs` for the new mechanics/regressions; `node TEST-DISTRESS.cjs` continues to check step 1.

Roadmap step 2 is complete. Step 3, interactive sector features, is next and has not started.

## v0.12.0 - ten weapons and eight supports

Step 2 expands further with Rail Lance, Flak Battery, Crescent Blades, Plasma Fences, Leech Beam, Cryo Charges, Kinetic Ram, Solar Sails, Void Seeds and Stasis Net. Each has an elite-cache evolution and two level-3 specialisations. Ten new contextual weapon synergies connect them to the existing arsenal. Total: 36 weapons/evolutions and 42 branch choices across twenty weapons and Energy Shield.

Defensive supports: Ablative Plates, Reactive Screen, Decoy Beacon and Salvage Medics. Passive supports: Supply Tractor, Guidance Chip, Field Capacitor and Salvage Appraiser. All use the existing six support slots and level to five. The weapon limit stays six. New effects, plate charges, decoys and fractional salvage bonuses reset per run; credit banking uses existing checkpoints.

Run `node TEST-ARSENAL.cjs` to check new attacks, evolutions, branches, support mechanics, synergy amplification, slot/banish restrictions, pickup values, banking guards and bounded crowded fights. Existing distress and specialisation checks remain available. Step 3 is still next; it has not started.

## v0.13.0 - interactive sector features

Step 3 makes the sectors tactically different while retaining their backgrounds. Neon Expanse gains cargo cover, derelict repair stations and salvage pockets. Shattered Belt favours asteroid cover and salvage; Storm Relay has overloadable conduits, directional ion currents and stations.

Destructible cover blocks physical shots from both sides, stops hunter charges and affects enemy routes. Beams and area damage bypass it. Dock at a station with F or the contextual touch button, staying nearby for four seconds during combat to repair 45 HP. Salvage pockets slow normal ships by 20% and hold three 5-credit pods, compatible with Supply Tractor, appraisal and salvage healing. Prime a conduit by shooting or pressing F, then escape its marked 1.4-second, 150-range blast. Ion currents can carry the player and ordinary enemies along their direction.

Boss encounters hold docking, conduit countdowns, salvage collection and currents; cover remains solid. Features begin at 18s and cycle approximately every 40s when there is room. All objects, one-use charges and normal-run reward budgets reset each run. Run `node TEST-TERRAIN.cjs` for collision, reward, boss-hold, sector-cycle and crowded-scene regressions. Roadmap step 4, rewards with a downside, is next and has not started.

## v0.13.1 - mid-run crowding and Auto graphics

Yellow elites now use one steady health curve rather than multiplying two time-scaling curves. At five minutes: 2,750 HP instead of about 9,733; their 35% armour, cache and 50 XP rewards remain. Limit two living yellow elites and eight ordinary purple brutes; specialist quotas and boss stats remain separate. At the brute limit, regular arrivals favour lighter ships. Elite arrivals blocked by population limits retry after five seconds, and a successful spawn begins its next 60-second interval without overdue bursts.

Auto quality immediately suppresses glow and simplifies frozen-hull decoration during dense fights, with a short hold to avoid flicker. It also lowers detail after the first expensive render sample instead of relying only on callback timing. Warnings, boundaries and damage-number preferences remain. Manual Low/Medium/High/Custom choices are respected. `node TEST-PRESSURE.cjs` checks the population, rewards and cosmetic boundaries. This balance/performance pass is complete; roadmap step 4 is next.

## v0.14.0 - aurora flight deck

Main and pause menus gain slow mint/violet aurora ribbons, dark readable panels, consistent spacing and responsive layouts. Launch groups the selected ship, passive description, sector, hull, module and credits beside flight controls. Pause keeps pilot/time/kills/level/hull visible across its three pages, with fixed tabs and action buttons around a scrollable content area. Overview includes ability, equipment, pace, weapon/support slots, credits/tools, specialisations, signals, mutations and advanced stats. Existing reports and evolution recipes remain. Aurora is hidden in combat and respects reduced motion. TEST-MENUS.html provides desktop/tablet/phone CSS viewport checks using normal game controls. Roadmap step 4 is still on hold.

## v0.14.1 - phone aurora visibility

Phone launch/pause panels now let the aurora show through their backing. Ribbons fit the full viewport instead of cropping a wide scene into portrait, with explicit SVG gradient coordinates for consistency. Text and inner content cards keep their contrast. Reduced-motion rules still apply.

## v0.14.2 - approved Overcharged Arcade logo

The main menu uses the approved concept C wordmark, without the small RR symbol beneath it. Transparent PNG is embedded into index.html to preserve single-file offline play. reactor-rogue-wordmark.png is the standalone source; reactor-rogue-app-mark.png preserves the separate RR mark for a future app. The app mark is not currently used as a favicon or installed app icon. Future platform exports need appropriate opaque backgrounds and safe-area variants.

### v0.14.3 - title spacing

Approved logo spacing refined so the T in REACTOR no longer intrudes into the G in ROGUE. Separate reserved app mark is unchanged.

## v0.14.4 - logo colour harmony

Violet/pink aurora ribbons, purple-tinted panels, selected tabs, ship selection and fine border highlights connect the menus to the approved logo. Main actions stay mint. A slow spectrum shifts across the thin menu header edge. Both animations respect reduced motion and remain menu-only. No combat colours or mechanics changed.

## v0.14.5 - Exo 2 throughout the game

User-selected font option D, Exo 2, is embedded as a variable TrueType font for offline use. Menus, buttons, HUD, damage numbers and canvas labels use it, with system symbol fallback and tabular numeric styling for stats. Approved logo and reserved app mark are unchanged. See FONT-LICENSE-Exo2.txt for SIL Open Font License and attribution; a copy is embedded in the HTML.

## v0.14.6 - full in-game ship previews

Launch and Hangar previews now use the same complete ship renderer as gameplay: distinct hulls, plating, engine pods, cockpit and turret. SVG export keeps the preview sharp at every menu size; a neutral static pose excludes temporary combat upgrades/effects. Selected unlocked paint colours apply. Preview generation is bounded/cached and never changes the current run. TEST-SHIP-PREVIEWS.cjs covers all eleven ships and state isolation.

## v0.15.0 - Sovereign, the twelfth ship

A violet-and-gold rift flagship completes the twelve-ship roster. Defeat 20 sector bosses across runs to unlock its licence, then purchase it for 600 credits, the highest ship price. 125 HP, 1 armour, 165 speed; starts with Void Seeds. Imperial Arsenal adds 4% weapon damage per evolved weapon, capped at 24%. Singularity Jump blinks 220 range with 0.4s invulnerability, leaving a single 135-range departure rift for 2.4s. Eight 18-base-damage pulses slow nearby ships; non-boss, non-stationary, unfrozen ships are drawn inward. Bosses resist pull and take normally mitigated damage. One charge, 10s recharge. Rift damage is tracked as Other and excludes the evolution passive. All effects reset per run; earned progress and existing saves are retained. Run TEST-SOVEREIGN.cjs and TEST-SHIP-PREVIEWS.cjs. Roadmap step 4 remains on hold.

## v0.15.1 - overcharged beam visuals

Pulse Laser, evolved laser lances, Rail Lance, Solar Sails, Leech Beam and Prism refraction now use layered energy, bright cores, tapered/rippling envelopes, emitter lenses and weapon-specific travelling details. Rail/Solar/Pulse hits add compact contact flares. Leech siphon nodes flow back towards the pilot. Plasma Fences and Ion Harpoon use matching energy styling. Low and crowded Auto use a simpler clear core; reduced motion fixes decorative movement. At most twelve beam draws per frame receive full detail, with up to four contact markers per short beam effect and no new particle arrays or long-beam shadow blur. Combat calculations, lifetimes, cooldowns and RNG are unchanged. TEST-BEAMS.cjs checks tagging, state/RNG isolation, quality/motion and marker bounds. TEST-BEAMS.html is an isolated visual showroom using the release renderer; it does not use saves or simulate combat.

## v0.16.0 - The Lost Signal alien merchant

Three transmissions around 2:00, 5:00 and 8:00 offer three rotating, unowned modifications from a pool of fifteen. Open the transmission button or J within 45 game seconds; bosses hold arrival/departure, and shopping pauses combat and departure. Each visit has one free refresh, then 15/25/35… scrap refreshes. Leaving closes that visit. Installed modifications appear in Pause → Overview and use no weapon/support slots.

Run-only scrap is separate from Hangar credits: every fourth ordinary kill drops 3, elites 12, bosses 30. Collect nearby scrap before its 90-second lifetime ends; at most 80 stacks exist. Unspent scrap and all modifications reset next run. Existing credit rewards and saves stay unchanged.

Merchant exclusives: Salvage Drone, Phase Plating, Cache Decoder, Echo Chamber, Scrap Converter, Rift Anchor, Execution Lens, Emergency Warp, Prism Mirror, Afterburner Core, Bounty Scanner, Reactor Battery, Gravity Collector, Overkill Capacitor and Smuggler’s Beacon. Shop rules are in How to play; exact effects/prices are on shop cards; these never enter level-up/drop pools. Fifteen distinct inline SVG icons and a six-eyed hooded hologram match approved concept C, with the existing Exo 2/neon palette and reduced-motion support.

`node TEST-MERCHANT.cjs` covers every effect, transactions, bounded arrays, pause/boss holds, per-run reset and crowded update/render integration. `TEST-MERCHANT.html` is an isolated viewport/purchase preview using release markup/CSS/art/code with sample scrap, no combat or save access. Step 4 is deferred: Reactor Protocols (Arcana-inspired cards) are saved for later. Step 6 is next after this merchant pass.

## v0.17.0 - developer test panel

Settings → Developer contains a session-only password gate (default `ReactorBert`), fresh test launches with any of the twelve ships and three sectors, invulnerability, enemy freeze, unlimited ability charges, temporary 0.25–4× simulation speed, hull/shield restoration, level-up and upgrade tools, equipment levels/removal/forced evolution, mutations, enemy/boss/terrain spawning, attack/enemy cleanup, pickups and merchant stock/scrap tests. Existing slot, heavy-enemy and population limits remain.

This is a convenience lock in inspectable client-side code, not secure authentication. Unlocking/browsing alone does not flag a normal run. Any run control marks it permanently as a developer test for its lifetime: no new Hangar progress/credits, archive entries or best scores. Existing legitimately banked progress remains. Locking or disabling cheats does not remove that flag. Start a fresh normal run to restore progression. Test launch choices never buy/unlock ships or modify saved pilot/sector choices. Graphics/audio/control settings continue to work normally. Dev speed is temporary and separate from saved game pace. `node TEST-DEV.cjs` checks the lock, action groups, transaction/save exclusions and reset paths. Roadmap is unchanged.

## v0.18.0 - enemy formations and pacing

Ordinary pursuit now mixes with V-shaped fighter squadrons, crossing interceptor lanes with a three-slot gap, a brute with fighter escorts, an encirclement with a wide marked opening, opposing pincer wings and a light-fighter burst followed by a recovery window. Pattern eligibility starts at18/65/110/150/220/280 game seconds. A1.6s edge-arrow warning precedes arrivals; all ships begin outside the current viewport. They hold a coherent approach for8s (lanes9s), then resume ordinary pursuit. Existing armour, damage and kill/XP/drop accounting are retained.

Formations borrow future ordinary spawn slots one-for-one:6–12 ships, max24 outstanding borrowed slots, max2 active groups, no formation launch above200 living enemies, all within cap240 and existing heavy quotas. No warnings in the ten seconds before a scheduled boss; active bosses cancel warnings, release formations and hold new groups for12s after the fight. Warnings respect reduced motion and consume no gameplay RNG. State resets each run. Settings → Developer now lets you queue any formation for testing (password unchanged: ReactorBert).

Run `node TEST-FORMATIONS.cjs` for six-pattern/four-viewport, gaps, warning timing, borrowed spawn accounting, caps, boss holds, pause/reset and actual update/render checks. Difficulty tiers remain deferred while the core gameplay foundation is reviewed.

## v0.19.0 - weapon balance and identity

A controlled576-scene before/after pass reviews all36 weapons at levels1/3/5/evolved5. Focused Neon Bolt and evolved Crescent volleys retain their extra shots on target; Arc Discs aim a lead spoke. Rail gains modest base damage and30% inherent armour penetration (Needle60%); Leech, Chain Lightning and flank-focused Solar Sails improve. Stacked Ember trails and evolved torpedo rifts now have per-target damage limits. Mortar leads ordinary moving targets, with a70m cap and no prediction for frozen/stationary targets. Utility and distinct coverage roles remain; this is not an equal-DPS redesign.

Upgrade cards show a short weapon role and actual volley-count milestones; existing weapon reports explain each role. Current-run synergy hint rules, six-slot limits, recipes, saves and enemy formations remain. See BALANCE-NOTES.md for exact changes, method and limitations; BALANCE-V019.json contains every matched result. `node TEST-WEAPON-BALANCE.cjs` runs targeted regressions; `node BENCHMARK-WEAPONS.cjs index.html result.json` reproduces the current controlled matrix. Roadmap remains on the core-foundation review; difficulty tiers and Reactor Protocols are deferred.


## v0.20.0 - build clarity

Pause → Build shows current weapons and passives/defence with levels, specialisations, active combinations and evolution next steps, including cache readiness, banished supports and full-slot blockers. Upgrade choices include a collapsed current-loadout summary with slot counts. Everything derives from current run state; no permanent recipe discovery or combat changes. Existing missing-component-only card hints remain. Run `node TEST-BUILD-CLARITY.cjs` for recipe, slot, synergy and reset checks.


## v0.21.0 - sector route and ending

Compact reactor countdown replaces the arbitrary wave number in the combat HUD. Pause Overview maps the actual sector bosses at3:00,6:00,10:00, with engaged/defeated states. A15-second approach warning names the next reactor. Final boss death secures the clear immediately; a safe final mutation selection leads to a sector-clear debrief. Explicit endless continuation retains the win, with no duplicate banking. No extra boss health, spawn budget, currency rewards or longer run requirement. `node TEST-RUN-STRUCTURE.cjs` checks routes, warnings, final-hit protection, mutation exhaustion and endless banking.


## v0.22.0 - combat readability

Hostile bullets gain a consistent warm diamond outline, bright centre and dark contrast backing. Charged warnings, active rail hazards and hostile shots render after explosions/damage numbers. Essential sector hazard boundaries and nearby specialist aim lines remain visible across graphics profiles. Small pale corner marks locate the player; damage labels are drawn outside a44-unit locator area without changing their stored positions. All cues are static/reduced-motion safe and add no particles. No damage, hitbox, timing or balance changes. How to play explains these cues. `node TEST-COMBAT-READABILITY.cjs` checks draw purity/RNG separation, profiles, visibility and layering.


## v0.23.0 - measured normal-run pacing

Five complete fresh-Vanguard automated normal-rules runs cover desktop baseline/repeat seeds and a phone movement-facing sample. First level costs5XP; levels2–20 unchanged; later requirements grow gently to reduce repeated upgrade pauses. Boss defeats give8game seconds of reduced ordinary reinforcements, with a RECOVERY objective cue. Boss schedule, health, rewards and currency unchanged. See PACING-NOTES.md for results/limits and PACING-V023.json for raw logs. PLAYTEST-NORMAL-RUN.cjs reproduces the driver; TEST-PACING.cjs covers regressions.


## v0.24.0 - pickup visibility

Round credits, hex supplies and square gold evolution caches now use dark-backed high-contrast glyphs; important drops have larger labels and sit above decorative explosions, below hostile threats. Drops remain visible during expiry, with a last-five-second timer. Important-only edge markers prioritise caches/needed repair, avoid overlap and cap at4phone/6desktop. Scrap and XP gain contrast outlines. Rates, rewards, pickup ranges and lifetimes unchanged. TEST-PICKUPS.cjs covers rendering/markers/preferences.


## v0.25.0 - local profiles and save backups

Settings → Profiles & saves supports up to8 named local profiles, fresh-profile creation, rename and launch-only switching. Existing progress remains Commander with unchanged legacy storage keys. Other profiles isolate Hangar, banked credits/unlocks/tools, scores, records and selected ship; device settings stay shared. Download JSON backups and preview/import them as separate profiles on another browser/device. Imports validate format/version/size/content and never overwrite another profile. Storage failures leave the old manifest/progress intact. Unfinished runs are not saved; account login and automatic cloud sync require a future backend and are not connected. TEST-SAVES.cjs covers persistence/validation/rollback; TEST-SAVES.html isolates browser QA from normal progress.


## v0.26.0 - honest caches and sector fleets

Cyan supply caches and gold evolution caches now retain separate reward kinds from drop to collection. Evolution caches require a ready recipe; only one evolution cache may wait on the floor/in the reward queue. Supply caches offer supplies even if a recipe becomes ready later. Evolution screens offer evolutions only; Cache Decoder supplies its spare benefit as a reroll when no fourth evolution is available. Header, hint, icon and ground label agree.

Shattered Belt mixes rugged Scrap Marauder hulls into the ordinary fleet; Storm Relay adds crystalline Relay Sentinel hulls. Two of every three ordinary spawns use the sector hull, retaining familiar ships alongside them. Neon Expanse and specialists remain familiar. No extra population, RNG draws, stats, hitboxes or rewards. TEST-CACHES-SECTORS.cjs covers cache promises, readiness, decoder, mixed fleets and unchanged spawn sequences.


## v0.27.0 - achievements and contracts

24 new achievements join the7 existing blueprint contracts:31 total. Milestones, combat, mastery and exploration include three evolutions in one run, four specialisations, eight merchant modifications, different pilot/sector wins, weapon-family goals, freezes, ignitions and clean bosses. New goals offer545 one-off credits in total. Existing ship challenges and blueprint unlocks remain. Hangar → Contracts has status/category filters, earned badges, readable progress and claim buttons for ready historical goals. Normal run banking still pays rewards automatically; results show newly paid goals and existing notice UI announces new completions. Developer tests are excluded. New progress persists per profile and transfers in backups; available recorded history seeds new counters once. `node TEST-CONTRACTS.cjs` covers thresholds, rewards, banking, migration, filters and profile transfer. `node TEST-MENUS.cjs` is the portable menu regression suite updated for the new two-minute reward.


## v0.28.0 - expanded survivor arsenal

Adds twelve weapons with twelve evolutions, two level-3 paths each and twelve contextual synergies. Total: 48 weapons/evolutions, 32 supports and 66 branch choices across 32 weapons and Energy Shield. Six weapon/six support slots remain.

| Weapon | Coverage | Evolution support → evolution |
|---|---|---|
| Storm Spires | Staggered fixed-area lightning | Predator Chip → Tempest Cathedral |
| Echo Rings | Expanding wavefront, one hit per ship | Shock Baffles → Harmonic Horizon |
| Crossfire Array | Converging paired side cannons | Manoeuvre Jets → Gemini Battery |
| Rupture Drill | Delayed armour-piercing toughest-hull strike | Last Stand Core → Core Breacher |
| Ion Guardians | Temporary medium-range orbiting sentries | Shield Coupler → Citadel Orbit |
| Plasma Rain | Lingering plasma pools | Magnet → Nebula Reservoir |
| Prism Tracers | Crystals reflect within a fixed launch box | Armour Plating → Reactor Pinball |
| Comet Scythes | Curving heavy throws | Size Matrix → Orbital Reaping |
| Ion Curtain | Vertical piercing column | Targeting Array → Polar Cascade |
| Coronal Shroud | Continuous close-range damage aura | Repair Amplifier → Soul Reactor |
| Plasma Lash | Alternating front/rear sweep | Reactive Spikes → Crimson Gyre |
| Binary Wisps | Counter-rotating bombardment zones | Field Capacitor → Binary Supercluster |

Six new support items: Manoeuvre Jets (+5% ability recovery/level), Shield Coupler (0.5s earlier shield recharge/level), Shock Baffles (reactive ordinary-ship slow, 8s cooldown), Repair Amplifier (+8% hull repair/level), Predator Chip (+4% elite/specialist/boss weapon damage/level), Last Stand Core (+6% weapon damage/level below40% hull). Configured support rarities are now honoured, including the earlier expansion’s definitions.

Inspirations: Vampire Survivors’ orbit/zone/bounce/arc/column/aura/sweep/circling-bombardment coverage patterns, adapted to the original Reactor Rogue names, art, values and run rules. Research reference: https://vampire.survivors.wiki/w/Weapons . No game assets or source code copied.

`node TEST-EQUIPMENT.cjs` checks all new attacks, evolutions, paths, supports, targeting/delays, conditional combinations, slot/banish/hint rules, archived path validation and bounded240-enemy simulations. Existing save, contract, developer, cache, UI and weapon regressions remain. Simulation checks are not a device FPS measurement or human win-rate study.


## v0.29.0 - complete attack and defence art

Applies the approved restrained Reactor Rogue attack direction across all48 weapon identities, base/evolved forms, defensive devices and enemy threats. Tapered energy needles, finned missiles, faceted crystals, mechanical drones and blades replace placeholder projectiles. Short motion trails, compact muzzle/hull-impact details, branching electrical arcs, flowing field contours, planted devices, artillery markers and layered energy paths establish different weapon families. Shield segments reflect remaining charge; plates, armour, spikes, decoys, interception and phase effects have mechanical/holographic cues. Ship defence beacons, singularity wakes and plasma breath use the same visual language.

Enemy shots retain a bright warm core and dark outline, with faceted heads and short trails. Hostile beam edges and hazard rings keep their actual warning/damage boundaries; boss charge colours use the hostile palette. Threats still render after decorative player effects. Existing purge/freeze and combat explosion treatments remain.

One transparent approved-style atlas is embedded for offline play and retained as `reactor-rogue-attack-atlas.png`; procedural silhouettes are immediate fallbacks and the Low presentation. Trails retain at most6 points per live object using WeakMap keys. Caps:48 impact marks,18 emitter flashes,72 atlas draws,24 detailed fields and100 detailed devices per frame. Offscreen culling, crowded Auto simplification and reduced motion remain. No damage, collision, firing schedule, drop rate or progression changes.

`TEST-ATTACKS.html` is an isolated gallery using release drawing helpers:48 weapons, defensive/ability samples and enemy attacks, quality/evolution/motion toggles; no combat/save access. `node TEST-ATTACK-ART.cjs` checks all48 base/evolved weapons across quality and motion modes, render-state/RNG purity, defensive/hostile layers and bounded effects. `node TEST-ATTACK-PARITY.cjs /path/to/v028/index.html` compares96 matched combat scenes against the preceding release. Native verification does not establish phone hardware FPS.


Full item scope: every usable equipment entry now has individual mechanical SVG artwork (48 weapons +32 passive/defensive items), including evolved weapon variants. Upgrade cards, HUD slots, build summaries, weapon reports, specialisation cards and evolution recipes share these illustrations; passive art includes distinct reactors, chips, thrusters, repair kits, armour plates, shield couplers and targeting devices. HUD SVG markup is cached until item level/ownership/evolution changes. The isolated gallery also has a32-item passive catalogue, with descriptions and the actual live ship preview. Real healing gives a restrained rate-limited repair cue; no healing or stats are created by artwork.


## v0.30 - original adaptive music

Six original synthesized soundtrack loops: Aurora Drift (ambient breaks,112 BPM), Neon Breaker (drum & bass,170), Scrapyard Circuit (jungle,174), Relay Pressure (techno,138), Critical Mass (boss drum & bass,176) and Lost Carrier (transmission ambience,104). Adaptive mode follows menus, sectors, bosses and merchant transmissions with crossfades. Settings → Audio offers manual track selection, a20-second preview, separate effects/music/master levels and optional music during pauses. Hidden tabs go silent. Audio starts after a user gesture.

Loops render in a worker, cache at most four mono buffers and use looping sources outside the effects voice budget. A cooperative fallback covers browsers without workers. No recordings, downloads or gameplay RNG are used. `node TEST-MUSIC.cjs` checks synthesis, isolated worker execution, transport, preferences and background/pause handling; this does not establish device FPS or listening quality.


## v0.31 - Cinder Foundry and Cryo Reach

Two new selectable sectors unlock with Rogue operator (first sector clear); existing earned unlocks apply immediately. Hangar → Sectors now includes scenery previews. Cinder Foundry has industrial platforms, furnace fleet silhouettes, heat vents and a stronger rail/minelayer mix. Cryo Reach has fractured ice shelves, crystal hulls, frost fractures and more interceptors/hunters. Two in every three ordinary arrivals use the themed hull; familiar enemies remain. Existing enemy stats, spawn cadence and population limits stay unchanged.

Each route has three bosses at3:00/6:00/10:00: Slag Harvester/Furnace Warden/The World Forge and Rime Stalker/Glass Empress/Absolute Zero. Telegraphs precede aimed volleys and rectangular vent/fracture lanes; warm borders mark the real hazard boundaries. Ordinary environmental hazards hold during bosses. Cover/conduits/stations distinguish Foundry; cover/currents/stations distinguish Cryo. Existing techno and jungle tracks accompany the new sectors. Ten-minute clear, endless, equipment, rewards, profile backups and developer-test exclusions retain their rules. Original Sector trilogy contract still requires the original three sectors.

`node TEST-FRONTIER-SECTORS.cjs` covers routes, six bosses, warning/damage geometry, hazard holds, mixed hulls, archive IDs, music mapping, render purity and bounded crowded updates. Native simulation and CSS viewport checks do not measure iPhone hardware FPS or establish human balance.


## v0.32 - Neon Undercity and boss identity

Six sectors now have18 uniquely named bosses; the selector lists each sector’s actual roster. Neon Undercity unlocks after the first sector clear: rooftops, service roads, neon signs and ambient traffic below the ship. Roofs are decorative; marked terrain cover remains physical. Security fleets mix with familiar enemies. Patrol Interdictor uses a tight triple volley and aimed lockdown lane; Skyline Enforcer has twin cannon banks and paired avenues; Metroplex Overlord uses a ring with an escape wedge and a four-lane blockade with a safe central pocket. Warm dashed/solid rectangles show warning/active damage boundaries. Boss times remain3/6/10minutes. Existing drum & bass accompanies city combat.

Cryo bosses now fire split pincer volleys from two emitters and place radial fractures with a safe centre; Foundry retains heavy cannon fans and parallel furnace rows. Existing three sector rosters remain separate. TEST-CITY-SECTOR validates all18 unique names, city plans, gaps, warnings/collision, holds, ending, archive/music/fleet integration, render purity and bounded crowded updates. Browser smoke and CSS viewport checks are not hardware FPS or full-run balance measurements.


## v0.32.1 - sector scene previews
Replaced schematic symbols with six detailed16:9 illustrated miniatures using each map’s actual visual motifs: grid/docks, wreckage and rocks, relay station, furnace platforms, fractured ice and rooftop city. Static cached SVG scenes, no network assets or animation cost. Wider cards and full-contrast locked previews preserve visibility; explicit unlock labels retain disabled selection. Gameplay unchanged.


## v0.32.2 - actual gameplay stills
Replaces all illustrated previews with six real960×540 screenshots captured from in-game DEV test combat, one per sector. The captures use the real renderer/scenery/ships/bosses; cropped to the playfield to exclude HUD. Original JPEG files retained as sector-ID.jpg and embedded for offline use. Compact side-by-side picture/details cards replace oversized posters. No gameplay/progression change.


## v0.33.0 - high-altitude Neon Undercity
Approved cloud/neon concept implemented as live procedural scenery: small varied rooftops, L/circular footprints, stepped high-rise crowns, pink/cyan roof lights, analytic street traffic trails, trains and translucent cloud wisps below combat. City uses0.55 camera parallax for distance. Scenery does not alter enemies, damage, collisions, hazards, rewards or saves. Reduced motion freezes traffic/trains/clouds; Low/crowded Auto reduces traffic lanes and cloud count. Static320px tiles cache in a32-entry LRU; one512×96 cloud sprite is reused, no per-frame shadow blur, particles or global RNG. At most100 visible traffic cells processed. TEST-CITY-SCENERY verifies cache reuse/bounds, render purity/RNG independence and reduced-motion time invariance. Existing city/menu/readability tests pass. Device FPS is not established by native checks. Actual gameplay sector still refreshed after deployment.


## v0.33.1 - neon traffic lights
Traffic now uses two cached96×20 light sprites with fading coloured tails, layered soft halos and paired bright headlights/taillights, rotated along roads. No per-frame shadow blur or particles; Low uses reduced intensity/count, reduced motion still freezes positions. Original simple-line fallback only when offscreen canvas is unavailable.


## v0.33.2 - centred touch ability labels
The circular ability control now removes inherited menu padding and uses explicit flex centring, unit line height, zero letter spacing and native-appearance reset. Dash counts, boost/phase labels and recharge times share the same centre at both 64px and 72px sizes.


## v0.34.0 - public website and installation
`home.html` is the public landing page with actual gameplay, controls, sectors, install help and user-reviewed GitHub feedback/downloadable reports. Bare root URLs redirect to home; existing versioned URLs and index.html still open the game. New menu links open the website without abandoning the run. Manifest, existing approved logo icons and a versioned service worker support standalone installation/offline shell; no forced activation during a run. Bump sw.js CACHE with future changes. Local save origin/keys unchanged. Domain remains free GitHub address by user choice. Cloud account integration is prepared but disabled pending an owner Supabase project and RLS/auth/email verification; see CLOUD-SETUP.md. Do not describe cloud saves as live.


## v0.34.1 - direct feedback and wording
Removed em dashes from game/website wording and project notes. Website feedback now POSTs to the Supabase public rr_submit_feedback RPC, no account/email/GitHub required. Reports live in rr_private.feedback, not a public listing; owner reviews through the Supabase Table Editor or SQL Editor. Public roles cannot read, update or delete the inbox or access cloud saves. Bounded private SECURITY DEFINER intake with fixed SQL and empty search_path, invoker public wrapper, validation, honeypot, advisory-lock-serialised cap of 10 reports/minute and 100/24h, and UUID idempotency. These are basic beta spam controls, not per-user CAPTCHA protection. No IP address, email address or browser user agent stored in reports. Download remains an offline fallback. Cache version bumped. Cloud account sign-in remains disabled pending SMTP setup; feedback does not use Auth or SMTP. TEST-FEEDBACK-SECURITY.sql passed on project with transaction rollback; TEST-FEEDBACK.cjs covers success/retry/error/duplicate/validation. Existing save/menu and offline-shell tests pass.

Feedback uses the versioned feedback-v0341.js asset with public project config so browsers controlled by the older offline worker do not load the obsolete GitHub form script. The honeypot position is also inline for old cached styles. Future website script changes should use new versioned asset filenames.


## v0.34.2 - simpler launch and footer
Removed installation buttons from the website hero, installation help and game launch menu. Browser installation support/manifest stays available through browser controls. Removed personal creator attribution from the website footer. Feedback continues using its verified versioned script.
