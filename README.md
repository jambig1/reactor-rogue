# Reactor Rogue

[Play Reactor Rogue](https://jambig1.github.io/reactor-rogue/)

A neon spaceship survivor game with twelve pilots, distinct movement abilities, 36 weapons and evolutions, weapon combinations, three sectors and a persistent Hangar.

Open `index.html` in a full browser to play offline. No installation, dependencies, API keys or build step are required. Keyboard/mouse and touch controls are supported. Progress stays in each browser.

## Development

Current version: 0.15.1. `index.html` is the self-contained game. See `DEVELOPMENT-HANDOVER.md` for mechanics, decisions and testing limits.

GitHub Pages publishes the root of `main` automatically. Update the complete game file and verify the deployment before reporting a live update.

## v0.5

Pause → Weapons and the results screen show effective damage, damage share, DPS, finishing-hit kills and boss damage. Recent runs retain the breakdown. Five weapons received an initial damage tuning pass. Shattered Belt and Storm Relay each have three themed boss encounters; Neon Expanse retains its original roster.

## v0.6

Eleven ships now have individual challenges and credit licence purchases. Vanguard is free for new players; pre-v0.6 saves keep all six original ships, their credit balances and equipment. Five new ships: Scavenger, Spectre, Architect, Helios and Echo, each with a distinct starter and ability. Hangar → Ships shows requirements, progress, prices and ownership. Hangar → Upgrade tools sells three permanent ranks each for skips, rerolls and banishes, applying to future runs. Credits are earned from kills, survival, bosses, breaches and contracts, including on defeat or leaving a run. Saves are local to each browser.

## v0.6.1 menu and progression review

Compact launch roster, ship list/detail Hangar, clear ownership and affordability states, permanent tool upgrade rows and structured Pause/results summaries. Menus support native touch scrolling while canvas flight gestures remain isolated. Hangar navigation and Back stay visible; opening it from Pause banks current challenge progress and credits without duplicating rewards. Settings, records and Hangar hide and restore their parent screen. Existing saves and purchases are preserved.

## v0.7 — ship identity and progression feedback

Every ship has a distinct passive, detailed hull and menu icon, engine trail and ability effect. The HUD shows available credits and run earnings, with non-blocking ship challenge notifications. Results show progress towards the next two unowned ships and a shortcut to their licences. Scavenger earns 20% extra run credits, excluding contract rewards.

Starter balance: the first level offers a starter upgrade, and equipped weapon upgrades no longer inherit their acquisition rarity penalty. Phase Torpedoes fire two shots (three evolved), with a 2.2s base cycle. Licence prices are unchanged. See `BALANCE-NOTES.md` for simulation results and limitations.


## v0.7.2 — weighted salvage
Salvage crates now use a level-gated, Luck-aware weighted pool inspired by Vampire Survivors. Crates check for a spawn each game second at 10% base chance (50% Luck cap; 10 crates nearby). Their drops include credit chips/bundles/caches, 30 HP repair cells, XP-only vacuum, Chrono Stop, Purge Beacon, Plasma Breath, Fortune Shards, Reroll Tokens, and level-30 Salvage Fever/Reactor Surge. Credit values are adapted to this game: 1/5/25. Common ships retain XP; elites retain caches and can drop existing combat supplies/passive upgrades. Bosses resist Chrono Stop. Since v0.7.3, Purge also destroys visible bosses. Drop rates and effects are listed under How to play → Salvage drops and rates. The v0.7.1 compact card fix is retained.


## v0.7.3 — cinematic pickup waves
Purge now sends three expanding pressure ripples through a glowing honeycomb grid, with a flattened equatorial shock ring and travelling ship destruction. Visible ships, including bosses, break into hull fragments as the front reaches them; hostile projectiles inside the front are cleared too. Existing kill/XP/cache/mutation accounting is preserved, with reward menus held until the targeted ships are cleared. Chrono Stop sends an icy pulse and encases frozen ships in faceted ice, cracks and crystal spikes. Both pickups have distinct synthesised cues. Reduced motion uses static fading geometry without expanding rings, shimmer, shake or flying shards.


## v0.7.4 — combat explosions
Ship deaths, boss deaths, explosive impacts, fuel/gas chains and salvage destruction now use layered reactor blooms, bright cores, pressure rings, broken arcs, outward streaks and glowing hull fragments. Small ships have short compact bursts; bosses get wider, longer detonations with an equatorial shock disc. Frozen ships shatter in icy blue, with compact ship pops and deeper boss detonation sounds. Large blasts leave the existing fading smoke/embers. Effects are bounded, overlapping same-frame blasts merge, and reduced motion uses static fading geometry. This update changes visuals only: damage, drop rates, prices and progression are unchanged.


## v0.8 — Graphics & Effects
Settings now has a Graphics & Effects tab with Auto/Low/Medium/High/Custom presets; glow, particles/debris, explosion detail, smoke, damage-number modes, screen shake, flashes, playfield resolution, 30/60/display drawing limits, FPS counter and reduced-motion controls. Choices apply immediately, save independently of progression, and have a graphics-only reset. Auto starts at Medium, drops to Low after sustained slow frames, and cautiously recovers to Medium; High is an explicit choice. Enemy outlines, attack warnings, damage-area footprints and pickup icons remain visible. Menus/HUD use native resolution. Rendering limits are separate from simulation pace.


## v0.8.1 — contextual upgrade combinations
Level-up cards show related evolution recipes and weapon synergies only when at least one part is already equipped. Both component names are shown with owned/missing marks; evolution weapons show their level out of5. Ready recipes point to an elite cache, evolved weapons are marked, and synergy cards show active or completes-on-pick status. Neither part owned means no hint, even when that item is offered.


## v0.8.2 — clean per-run upgrade hints
Starting or restarting a run explicitly clears the previous upgrade choices and card markup. Combination hints continue to use only current-run equipped items and evolution state; prior runs and archive discoveries do not reveal them. Your starting weapon counts as owned.

## v0.8.3 — hints on the missing component
Upgrade cards only show a combination or evolution hint when the offered item is not equipped and its partner is already equipped in this run. Owned-item upgrade cards and completed pairs show no hints.

## v0.9.0 — priority enemy ships
Existing shield carriers gain a distinct wing silhouette. Hunters lock a 0.95s warning lane before a 0.5s charge; volatile ships leave a 0.45s enemy-only chain blast; fighter carriers warn for 1.2s before launching two fighters (six alive and twelve total per carrier). Introductions at 50/80/105/145 seconds, using the existing specialist spawn budget. Caps: 12 specialists, two shield/fighter carriers each, four other specialists per role, 240 total ships, 24 queued chain blasts. Freeze pauses abilities; carrier protection retains existing 20% reduction, damage numbers use actual mitigated damage, chain damage is attributed to the triggering weapon. No new cache farming or permanent progression. Contextual hints remain missing-component-only and reset each run.

## v0.10.0 — optional distress signals

Rescue a stranded pilot and reach extraction, protect a freighter with its own hull, or destroy an unstable reactor before containment closes. Signals require acceptance and can be ignored, dismissed or abandoned. Their timers and objective damage pause during bosses. One optional encounter is shown at a time using the existing HUD; a shuffled set of three signals is followed by an original reactor breach.

Successful signals give 20 XP, 300 points and one reward choice: compatible Rare-or-better equipment (40 XP fallback), repair (reroll fallback at full hull), or 25 bankable credits. Raiders have a one-second arrival warning and a twelve-ship lifetime cap per event, within the existing ship budget. New signal completions stay separate from reactor-breach unlock requirements. Equipment slots, banishes and existing saves are respected.

See [ROADMAP.md](ROADMAP.md) for the agreed ten-step plan. Step 2 was completed in v0.11.0; step 3 is next. Run `node TEST-DISTRESS.cjs` for the dependency-free state/regression checks. Render and device-performance checks are documented in the handover.

## v0.11.0 — more weapon specialisations

Eight additional weapons now branch at level 3: Neon Bolts, Scatterburst, Frost Shards, Chain Lightning, Toxic Cloud, Gravity Well, Nova Reactor and Pulse Laser. Choose between extra bolts or penetrating lances, tight or wide shotgun cones, stronger freeze or forward ice javelins, longer chains or concentrated triple strikes, ship-centred or concentrated poison, stronger gravity pull or early collapse, wide or double novas, and broad or armour-cutting beams.

Each path has an explicit trade-off, remains active through evolution, uses no extra slot and resets each run. Original Cannon/Repeater/Shield paths remain, for 22 choices across 11 branching items. Upgrade previews apply the chosen damage multiplier, cards identify the path, Pause explains it and weapon reports name it. Specialisation choices use compact responsive cards and pause combat. Run `node TEST-SPECIALISATIONS.cjs` for the new mechanics/regressions; `node TEST-DISTRESS.cjs` continues to check step 1.

Roadmap step 2 is complete. Step 3, interactive sector features, is next and has not started.

## v0.12.0 — ten weapons and eight supports

Step 2 expands further with Rail Lance, Flak Battery, Crescent Blades, Plasma Fences, Leech Beam, Cryo Charges, Kinetic Ram, Solar Sails, Void Seeds and Stasis Net. Each has an elite-cache evolution and two level-3 specialisations. Ten new contextual weapon synergies connect them to the existing arsenal. Total: 36 weapons/evolutions and 42 branch choices across twenty weapons and Energy Shield.

Defensive supports: Ablative Plates, Reactive Screen, Decoy Beacon and Salvage Medics. Passive supports: Supply Tractor, Guidance Chip, Field Capacitor and Salvage Appraiser. All use the existing six support slots and level to five. The weapon limit stays six. New effects, plate charges, decoys and fractional salvage bonuses reset per run; credit banking uses existing checkpoints.

Run `node TEST-ARSENAL.cjs` to check new attacks, evolutions, branches, support mechanics, synergy amplification, slot/banish restrictions, pickup values, banking guards and bounded crowded fights. Existing distress and specialisation checks remain available. Step 3 is still next; it has not started.

## v0.13.0 — interactive sector features

Step 3 makes the sectors tactically different while retaining their backgrounds. Neon Expanse gains cargo cover, derelict repair stations and salvage pockets. Shattered Belt favours asteroid cover and salvage; Storm Relay has overloadable conduits, directional ion currents and stations.

Destructible cover blocks physical shots from both sides, stops hunter charges and affects enemy routes. Beams and area damage bypass it. Dock at a station with F or the contextual touch button, staying nearby for four seconds during combat to repair 45 HP. Salvage pockets slow normal ships by 20% and hold three 5-credit pods, compatible with Supply Tractor, appraisal and salvage healing. Prime a conduit by shooting or pressing F, then escape its marked 1.4-second, 150-range blast. Ion currents can carry the player and ordinary enemies along their direction.

Boss encounters hold docking, conduit countdowns, salvage collection and currents; cover remains solid. Features begin at 18s and cycle approximately every 40s when there is room. All objects, one-use charges and normal-run reward budgets reset each run. Run `node TEST-TERRAIN.cjs` for collision, reward, boss-hold, sector-cycle and crowded-scene regressions. Roadmap step 4, rewards with a downside, is next and has not started.

## v0.13.1 — mid-run crowding and Auto graphics

Yellow elites now use one steady health curve rather than multiplying two time-scaling curves. At five minutes: 2,750 HP instead of about 9,733; their 35% armour, cache and 50 XP rewards remain. Limit two living yellow elites and eight ordinary purple brutes; specialist quotas and boss stats remain separate. At the brute limit, regular arrivals favour lighter ships. Elite arrivals blocked by population limits retry after five seconds, and a successful spawn begins its next 60-second interval without overdue bursts.

Auto quality immediately suppresses glow and simplifies frozen-hull decoration during dense fights, with a short hold to avoid flicker. It also lowers detail after the first expensive render sample instead of relying only on callback timing. Warnings, boundaries and damage-number preferences remain. Manual Low/Medium/High/Custom choices are respected. `node TEST-PRESSURE.cjs` checks the population, rewards and cosmetic boundaries. This balance/performance pass is complete; roadmap step 4 is next.

## v0.14.0 — aurora flight deck

Main and pause menus gain slow mint/violet aurora ribbons, dark readable panels, consistent spacing and responsive layouts. Launch groups the selected ship, passive description, sector, hull, module and credits beside flight controls. Pause keeps pilot/time/kills/level/hull visible across its three pages, with fixed tabs and action buttons around a scrollable content area. Overview includes ability, equipment, pace, weapon/support slots, credits/tools, specialisations, signals, mutations and advanced stats. Existing reports and evolution recipes remain. Aurora is hidden in combat and respects reduced motion. TEST-MENUS.html provides desktop/tablet/phone CSS viewport checks using normal game controls. Roadmap step 4 is still on hold.

## v0.14.1 — phone aurora visibility

Phone launch/pause panels now let the aurora show through their backing. Ribbons fit the full viewport instead of cropping a wide scene into portrait, with explicit SVG gradient coordinates for consistency. Text and inner content cards keep their contrast. Reduced-motion rules still apply.

## v0.14.2 — approved Overcharged Arcade logo

The main menu uses the approved concept C wordmark, without the small RR symbol beneath it. Transparent PNG is embedded into index.html to preserve single-file offline play. reactor-rogue-wordmark.png is the standalone source; reactor-rogue-app-mark.png preserves the separate RR mark for a future app. The app mark is not currently used as a favicon or installed app icon. Future platform exports need appropriate opaque backgrounds and safe-area variants.

### v0.14.3 — title spacing

Approved logo spacing refined so the T in REACTOR no longer intrudes into the G in ROGUE. Separate reserved app mark is unchanged.

## v0.14.4 — logo colour harmony

Violet/pink aurora ribbons, purple-tinted panels, selected tabs, ship selection and fine border highlights connect the menus to the approved logo. Main actions stay mint. A slow spectrum shifts across the thin menu header edge. Both animations respect reduced motion and remain menu-only. No combat colours or mechanics changed.

## v0.14.5 — Exo 2 throughout the game

User-selected font option D, Exo 2, is embedded as a variable TrueType font for offline use. Menus, buttons, HUD, damage numbers and canvas labels use it, with system symbol fallback and tabular numeric styling for stats. Approved logo and reserved app mark are unchanged. See FONT-LICENSE-Exo2.txt for SIL Open Font License and attribution; a copy is embedded in the HTML.

## v0.14.6 — full in-game ship previews

Launch and Hangar previews now use the same complete ship renderer as gameplay: distinct hulls, plating, engine pods, cockpit and turret. SVG export keeps the preview sharp at every menu size; a neutral static pose excludes temporary combat upgrades/effects. Selected unlocked paint colours apply. Preview generation is bounded/cached and never changes the current run. TEST-SHIP-PREVIEWS.cjs covers all eleven ships and state isolation.

## v0.15.0 — Sovereign, the twelfth ship

A violet-and-gold rift flagship completes the twelve-ship roster. Defeat 20 sector bosses across runs to unlock its licence, then purchase it for 600 credits, the highest ship price. 125 HP, 1 armour, 165 speed; starts with Void Seeds. Imperial Arsenal adds 4% weapon damage per evolved weapon, capped at 24%. Singularity Jump blinks 220 range with 0.4s invulnerability, leaving a single 135-range departure rift for 2.4s. Eight 18-base-damage pulses slow nearby ships; non-boss, non-stationary, unfrozen ships are drawn inward. Bosses resist pull and take normally mitigated damage. One charge, 10s recharge. Rift damage is tracked as Other and excludes the evolution passive. All effects reset per run; earned progress and existing saves are retained. Run TEST-SOVEREIGN.cjs and TEST-SHIP-PREVIEWS.cjs. Roadmap step 4 remains on hold.

## v0.15.1 — overcharged beam visuals

Pulse Laser, evolved laser lances, Rail Lance, Solar Sails, Leech Beam and Prism refraction now use layered energy, bright cores, tapered/rippling envelopes, emitter lenses and weapon-specific travelling details. Rail/Solar/Pulse hits add compact contact flares. Leech siphon nodes flow back towards the pilot. Plasma Fences and Ion Harpoon use matching energy styling. Low and crowded Auto use a simpler clear core; reduced motion fixes decorative movement. At most twelve beam draws per frame receive full detail, with up to four contact markers per short beam effect and no new particle arrays or long-beam shadow blur. Combat calculations, lifetimes, cooldowns and RNG are unchanged. TEST-BEAMS.cjs checks tagging, state/RNG isolation, quality/motion and marker bounds. TEST-BEAMS.html is an isolated visual showroom using the release renderer; it does not use saves or simulate combat.
