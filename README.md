# Reactor Rogue

[Play Reactor Rogue](https://jambig1.github.io/reactor-rogue/)

A neon spaceship survivor game with eleven pilots, distinct movement abilities, 26 weapons and evolutions, weapon combinations, three sectors and a persistent Hangar.

Open `index.html` in a full browser to play offline. No installation, dependencies, API keys or build step are required. Keyboard/mouse and touch controls are supported. Progress stays in each browser.

## Development

Current version: 0.7. `index.html` is the self-contained game. See `DEVELOPMENT-HANDOVER.md` for mechanics, decisions and testing limits.

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
