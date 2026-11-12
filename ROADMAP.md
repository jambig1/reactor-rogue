# Reactor Rogue roadmap

A plan, not a promise. Order and scope can change as updates are played. The game is currently played and tested by its developer only, so priorities favour depth, feel and testing speed over onboarding or online features. Each update should be small enough to check on iPhone, iPad and desktop before it goes live.

Current version: **0.57.0**.

## Where the game is now

| Area | State |
| --- | --- |
| Core game | Twelve ships, six sectors, eighteen bosses, 48 weapons and evolutions, 32 supports, contracts, merchant, distress signals, endless mode. |
| Presentation | Painted weapon and support art, Three.js GPU layer with parallax stars, bloom and dynamic lighting, classic renderer fallback. |
| Delivery | About 5MB first download, offline play, Three.js bundled, works on iPhone and iPad. |
| Saves | Local profiles and backups. Cloud saves built but not switched on. |
| Testing | Automated simulation and rendering checks, browser review tools, device checks through preview links. |

## Now

### 0.57 — Smooth in big fights (done)
- Collision grid so shots, beams and targeting only check nearby enemies instead of every enemy.
- Bloom adapts to the device: drops from Full to Subtle, then Off, when the frame rate stays low, and comes back when there is headroom.
- Goal: steady 60 FPS in late-run crowds on iPhone.

### 0.58 — Blueprints and mastery
- New weapons unlock through blueprints found in runs, events and contracts. Existing unlocks are kept.
- Ship mastery ranks earned by playing each ship, with cosmetic rewards such as hull paints and engine colours.

### 0.59 — Run history and tester tools
- A local run log in Records: ship, sector, time, level, build, damage by weapon and what defeated you. No data leaves the device.
- Quick-test options in the Developer tab: start at a chosen boss, grant a build, jump to endless. Test runs still never count towards progress.

## Next

### 0.60 — Sector weather
- GPU weather and lighting per sector: lightning that lights the Storm Relay, snow drift in Cryo Reach, embers and heat shimmer in Cinder Foundry, neon rain in the Undercity.
- Cosmetic only. Respects reduced motion, flash and quality settings.

### 0.61 — Final encounter
- A larger last boss with destructible systems and phases, as a proper ending to a sector clear.

### 0.62 — Cross-device saves
- Switch on the cloud saves that are already built, so progress carries between iPhone, iPad and desktop.

## Later

- **New sector and enemy family:** a seventh environment with its own fleet and three bosses.
- **Deeper endless mode:** escalating mutators and rewards for long runs.
- **Daily seeded run:** the same set-up each day as a personal challenge.
- **Before sharing the game more widely:** a guided first run, a clearer end-of-run screen, optional anonymous run reports and online leaderboards.
- **Co-op:** a large project, considered once everything else is settled.

## Ongoing

- **Code health:** move one system at a time out of `index.html` into its own file when that system is being worked on. Keep tools and tests in a separate folder from the published game.
- **Device testing:** every update is checked through a preview link on iPhone, iPad and desktop before it goes live.

## Principles

- Visual updates never change damage, hitboxes, pacing or saves.
- Every new visual feature has a setting and a safe fallback.
- Saved progress is never lost: new unlock systems keep what is already unlocked.
- Small, testable updates over large rewrites.
