# Reactor Rogue

[Play Reactor Rogue](https://jambig1.github.io/reactor-rogue/)

A neon spaceship survivor game with eleven pilots, distinct movement abilities, 26 weapons and evolutions, weapon combinations, three sectors and a persistent Hangar.

Open `index.html` in a full browser to play offline. No installation, dependencies, API keys or build step are required. Keyboard/mouse and touch controls are supported. Progress stays in each browser.

## Development

Current version: 0.7.4. `index.html` is the self-contained game. See `DEVELOPMENT-HANDOVER.md` for mechanics, decisions and testing limits.

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
