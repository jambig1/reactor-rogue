# Reactor Rogue roadmap

A plan, not a promise. Order and scope can change as updates are played. The game is currently played and tested by its developer only, so priorities favour depth, feel and testing speed over onboarding or online features. Each update should be small enough to check on iPhone, iPad and desktop before it goes live.

Current version: **0.60.0**.

## Where the game is now

| Area | State |
| --- | --- |
| Core game | Twelve ships, six sectors, eighteen bosses plus a final encounter in each sector, 48 weapons and evolutions, 32 supports, contracts, merchant, distress signals, endless mode. |
| Presentation | Painted weapon and support art, Three.js GPU layer with parallax stars, bloom and dynamic lighting, classic renderer fallback. |
| Delivery | About 5MB first download, offline play, Three.js bundled, works on iPhone and iPad. |
| Saves | Local profiles and backups. Cloud saves built but not switched on. |
| Testing | Automated simulation and rendering checks, browser review tools, device checks through preview links. |

## Now

### 0.57 — Smooth in big fights (done)
- Collision grid so shots, beams and targeting only check nearby enemies instead of every enemy.
- Bloom adapts to the device: drops from Full to Subtle, then Off, when the frame rate stays low, and comes back when there is headroom.
- Goal: steady 60 FPS in late-run crowds on iPhone.

### 0.58 — Blueprints and mastery (done)
- Weapon blueprints from bosses, every sixth elite, signals and breaches: three tiers per weapon (+10/20/30% damage), chosen from your current build.
- Ship mastery ranks (1–5) from time, bosses and clears: accent paints per ship and one extra reroll at rank 5.

### 0.59 — Sector weather (done)
- GPU weather and lighting per sector: lightning that lights the Storm Relay, snow in Cryo Reach, embers and furnace glows in Cinder Foundry, neon rain and sign flicker in the Undercity, dust in the Shattered Belt and light motes in the Neon Expanse.
- Cosmetic only. Respects reduced motion, flash and quality settings.

### 0.60 — Final encounter, weapon fields and tester tools (done)
- A final boss after the third reactor in every sector, with destructible shield, cannon and lance systems and three phases ending in a core meltdown.
- Gravity wells, void rifts, toxic gas, plasma pools, Corona, nets, flame trails and storm hazards drawn by GPU shaders beneath the ships.
- Recent runs record what defeated you, blueprints found, mastery gained and final encounter time. Developer quick tests (weapon showcase, boss fight, final encounter, late-run swarm, endless) and test links; the developer unlock can be remembered per device.

## Next

### 0.61 — Cross-device saves
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
