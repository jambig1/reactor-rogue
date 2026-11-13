# Reactor Rogue roadmap

A plan, not a promise. Order and scope can change as updates are played. The game is currently played and tested by its developer only, so priorities favour depth, feel and testing speed over onboarding or online features. Each update should be small enough to check on iPhone, iPad and desktop before it goes live.

Current version: **0.70.0**.

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

### 0.61 — Boss redesign (done)
- All bosses redrawn in the player-ship style with sector-tinted armour, neon edges, glowing cores and damage states. Constellation Salvo's carrier sprite replaced by a star pattern.

### 0.62 — Sector boss designs (done)
- Unique designs for all fifteen sector bosses outside the Neon Expanse, each reflecting its attacks.

### 0.63 — Deeper endless (done)
- A new threat each endless cycle (seven in all), stacking Overcharge rewards once mutations run out, credits per cycle and an endless record per sector.

### 0.64 — Animated menu (done)
- Nebula, parallax stars, a showcase boss and your ship fighting small waves behind a lighter glass menu panel.

### 0.65 — Fewer level-up pauses (done)
- Slower level curve and a Level-ups setting: immediate, banked or auto-pick.

### 0.66 — Clearer end-of-run screen (done)
- Headline summary first, with cause of defeat, highlight badges and top weapon; details folded away.

### 0.67 — Enemy ships in the new style (done)
- Neon outlines and tinted armour for every enemy ship.

### 0.68 — Boss entrances (done)
- Title cards and sirens for every boss; on-ship signature sprites replaced by emblem rings.

### 0.69 — Solar Corona (done)
- Seventh sector: solar flares, satellite cover and three new bosses.

### 0.70 — Three more sectors (done)
- Abyssal Rift, Hive Nebula and Ghost Fleet Graveyard, each with a hazard, fleet, three bosses and a final encounter; per-sector debris and weightless drift.

## Next

To be chosen: pick from the list below.


## Later

- **New sector and enemy family:** a seventh environment with its own fleet and three bosses.
- **Final boss music:** a more intense variant of the boss track for the final encounter.
- **Cross-device saves:** switch on the cloud saves that are already built, so progress carries between iPhone, iPad and desktop.
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
