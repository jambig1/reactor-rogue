# Reactor Rogue

[Play Reactor Rogue](https://jambig1.github.io/reactor-rogue/)

A neon spaceship survivor game with eleven pilots, distinct movement abilities, 26 weapons and evolutions, weapon combinations, three sectors and a persistent Hangar.

Open `index.html` in a full browser to play offline. No installation, dependencies, API keys or build step are required. Keyboard/mouse and touch controls are supported. Progress stays in each browser.

## Development

Current version: 0.11.0. `index.html` is the self-contained game. See `DEVELOPMENT-HANDOVER.md` for mechanics, decisions and testing limits.

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
