# Normal-run playtest and pacing pass - v0.23.0

Five complete automated runs used the actual combat, enemy, pickup, XP, boss and reward systems. All started with a fresh Vanguard in Neon Expanse; developer flags stayed false.

| Version / controls | Seed | Clear | Level | Level-ups | Kills | Peak enemies | Evolutions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| before / desktop | 12345 | 11:50 | 60 | 59 | 3258 | 121 | 2 |
| before / desktop | 54321 | 11:19 | 58 | 57 | 3015 | 86 | 2 |
| after / desktop | 12345 | 10:53 | 50 | 49 | 2876 | 90 | 2 |
| after / desktop | 54321 | 11:09 | 55 | 54 | 3075 | 76 | 1 |
| after / touch | 12345 | 11:28 | 54 | 53 | 3048 | 82 | 2 |

## Findings and changes

- Normal default-loadout clears reached all three bosses and the final reward/ending without a blocked state. Baseline final clears took11:19 and11:50; no need to extend the run or add enemy health.
- Baseline late level-up gaps had medians12.2–12.4s. After the pass they were14.1–14.3s in desktop samples, reducing repeated menu interruptions. Build variation means clear-time changes cannot be assigned solely to this adjustment.
- First level threshold6→5XP. Levels2–20 retain their old requirements. Above20 add2XP per level beyond20 to the requirement: floor(6 +3L + L^1.32 +2 max(0,L−20)).
- Each actual boss defeat eases ordinary reinforcements for8 game seconds: ordinary spawn interval×1.75. Existing enemies/attacks and special arrivals remain dangerous. Pause/reward screens do not consume the window. An active next boss overrides it; scheduled arrivals remain unchanged. HUD briefly says RECOVERY.
- After touch sample:11:29, level54,178 total damage taken,69.4 minimum absolute hull, two evolutions. Regen and Reinforced Hull affect survival; this is not a touch win-rate estimate.

## Method and limits

Driver follows nearby gems/caches/repair drops, avoids nearby enemies and projectiles, uses the ordinary dash, and selects only genuinely offered upgrades. Desktop uses normal independent mouse aim; the390×844 touch driver faces movement and approaches targets when clear. No god mode, gear grants, clock skips, disabled spawns or simulated HP inflation. Optional merchant/distress offers were not accepted by this driver.

The first diagnostic driver fled without aiming forward weapons; its low-kill result was excluded and the driver corrected before the baseline pair. Menus are chosen immediately, so reported durations exclude human deliberation. Headless simulation has a no-op renderer and says nothing about device FPS. Two seeds are exploratory coverage, not statistical balance proof. Human sessions, different ships/builds/sectors and optional merchant routes remain valuable follow-up coverage.

Reproduce: `node PLAYTEST-NORMAL-RUN.cjs index.html result.json 12345` or add `touch` for the phone-sized profile. `PACING-V023.json` retains all five event logs and30-second samples. `node TEST-PACING.cjs` checks requirements, real boss recovery, pauses, active-boss priority and reset.
