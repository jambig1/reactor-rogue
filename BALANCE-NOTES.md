# Historical balance measurements

These measurements describe versions 0.19.0 and 0.7. They are retained for reproducibility, not as current equipment counts, licence prices, player win rates or device-performance claims. The current game includes later content and balance changes.

# v0.19.0 weapon balance and identity pass

First core-foundation weapon pass after formations. All36 weapons reviewed across four deliberately different controlled scenes: one150-range target with35% armour; twelve frontal targets; twelve80-range surrounding targets; and twelve targets trailing a ship moving at100/s.20s each,60 simulation steps/s, seed12345, levels1/3/5 and evolved5:576 scenarios before and576 after. Full attack/projectile/field/hit code, no support items, chosen specialisations, merchant modifiers or ship damage traits. Target HP is effectively unlimited, positions held relative to the player; scenery and normal spawning disabled. The harness bypasses specialisation UI so level3/5 simulations remain active. This is not a human win-rate test or a universal weapon ranking. It under-represents utility and kill-triggered evolutions, and planted-zone results benefit from held targets.

Reproduce current measurements with `node BENCHMARK-WEAPONS.cjs index.html result.json`. `BALANCE-V019.json` retains all matched before/after rows and methodology. Baseline was the saved v0.18.0 source. No physics, health, XP, loot, slot or evolution-recipe changes.

## Changes

- Neon Bolts: normal volley spacing0.16→0.075rad. Added shots remain useful against a focused target. Prism Fan retains its intentionally wide0.25rad spread.
- Arc Discs: first radial spoke aims at the selected enemy, with the other spokes still radial. Fixes unreliable first-pick coverage; shot count/damage/cycle unchanged.
- Crescent evolution: normal evolved volley spacing0.30→0.13rad. Three evolved blades no longer spread two shots off a target hit by the original pair. Wide branch retains0.65rad spread.
- Rail Lance: base52+22×level→58+24×level, inherently ignores30% of enemy armour. Needle specialisation still ignores60%, replacing rather than multiplying penetration.2.4s cycle retained.
- Leech Beam: base20+8×level→24+10×level, cycle1.8→1.6s. Healing remains capped at0.8HP per target (1.3 with healing branch), based on actual damage, never structures.
- Solar Sails: base28+12×level→36+16×level, cycle2.5→2.2s, beam half-width8→10+level. Keeps its flank-specific aiming and four-direction evolution.
- Chain Lightning: base20+12×level→24+14×level; cycle2.1→1.9s. Remains stronger against groups than lone targets.
- Ember Wake: overlapping wakes share a per-target0.15s minimum burn interval, rather than multiplying damage for every overlapping patch. Trail width/lifetime/boost/evolution still matter for coverage.
- Evolved Phase Torpedoes: max two rift ticks per target per0.4s game-time window, rather than a tick from every overlapping rift. Direct torpedo damage, armour penetration, slowing and rift array cap unchanged.
- Orbital Mortar: leads ordinary moving targets by up to70m over its0.85s delay, following formation direction when present. Frozen, stationary, boss, specialist and structure targets retain their current position. No projectile count/damage increase.

## Selected matched results

Effective DPS after armour, over20s. These examples show the intended niche only; see raw rows for every scenario.

| Weapon/profile | Scene | Before | After |
|---|---|---:|---:|
| Neon Bolts5 | Armoured target |47.1|144.6|
| Arc Discs1 | Frontal group |20.3|44.6|
| Rail Lance1 | Armoured target |21.6|27.9|
| Leech Beam1 | Armoured target |10.9|14.4|
| Chain Lightning1 | Frontal group |48.0|62.7|
| Solar Sails1 | Surrounding group |32.0|52.0|
| Evolved Crescent5 | Armoured target |41.2|123.6|
| Evolved Ember5 | Trailing group |6906.2|1887.2|
| Evolved Phase Torpedoes5 | Frontal group |5970.2|2873.9|

Held targets exaggerate overlap cases: the last two rows explain why overlapping zones needed limits, not expected in-game DPS. Mortar prediction is checked with moving/frozen/formation targets separately; its stationary-target benchmark is unchanged.

## Identity and information

All36 weapons have a short role label on upgrade cards and a role/usage tip in the existing weapon report. Exact volley/target/beam count milestones are shown only when acquiring a weapon or when the next level changes that count. Existing descriptions, specialisation choices and current-run missing-component-only synergy hints retained. Overclock wording corrected to9% cycle-time reduction per rank, matching existing math. No new menu tab or equipment pool.

## Validation and remaining review

TEST-WEAPON-BALANCE checks base/preview agreement, role coverage, focused shots, radial lead aim, evolved crescents, armour factors, overlap limits, mortar prediction and UI state isolation. Existing Arsenal expected Rail3 base updated118→130; contextual1.3×Needle and1.25×gravity synergy assertions retained. Dev, Merchant, Formations, Graphics, Menu, Sovereign, Beams and upgrade-hint suites pass. Live UI/viewport checks are recorded in handover. Human mixed-build runs across sectors are still needed for final tuning; no device-FPS or player-win-rate claim.

---

# v0.7 balance notes

## Method

Normal HP, loot, XP, upgrade slots, damage and boss schedules; no HP/XP/credit grants during runs. All ship licences were enabled only to select each test pilot. Standard frame, no reactor module, default tool allowances and Neon Expanse. An automated controller aimed, moved, dodged, used abilities and chose upgrades from the actual offered cards. Simulation ran at 30 updates per game second with a 15-minute cap. It paused normally for choices. Each primary run used seed 12345.

The controller adjusts its orbit speed for slow ships, so a waypoint does not continually outrun Bastion. Its play is more precise than a typical human. These are viability and regression checks, not estimates of player win rates or final difficulty balance.

## Final full-run sweep

Credits below exclude one-time contract rewards; Scavenger's total includes its passive. Each run defeated all three bosses and reached victory.

| Ship | Victory time | Kills | Run credits | Starter share of effective damage |
|---|---:|---:|---:|---:|
| Wasp | 10:25 | 2842 | 153 | 13.8% |
| Vanguard | 10:31 | 2792 | 151 | 17.9% |
| Bastion | 11:15 | 3001 | 161 | 20.3% |
| Harrier | 11:08 | 3010 | 161 | 14.0% |
| Glacier | 10:35 | 2821 | 152 | 17.4% |
| Tempest | 10:59 | 2930 | 157 | 25.3% |
| Scavenger | 10:35 | 2832 | 183 | 8.5% |
| Spectre | 11:14 | 3010 | 161 | 7.8% |
| Architect | 10:30 | 2791 | 151 | 52.4% |
| Helios | 11:20 | 3151 | 167 | 43.9% |
| Echo | 10:49 | 2947 | 157 | 23.0% |

Different offered upgrades produced different builds, so starter damage share should not be read as a weapon ranking.

## Spectre follow-up

An initial run failed before three minutes while rare starter upgrades were hard to obtain. The first starter upgrade is now offered reliably; owned weapons do not keep their acquisition rarity penalty. Phase Torpedoes now fire a paired salvo (three evolved), with a 2.2-second cycle and slightly wider contact radius.

- Seed 12345: victory at 11:14, 161 run credits.
- Seed 67890: victory at 10:52, 156 run credits.
- Seed 34567: victory at 10:57, 157 run credits.

## Economy decision

Licence prices remain 40–180 credits (Vanguard free). Skilled completed runs produced 151–183 credits before contracts. Shorter/failed runs earn less, and challenges still control when licences can be purchased. The first tool ranks remain 35/50/60 credits. No global damage purchase or mandatory permanent power upgrade was added.

## Remaining manual QA

Physical iPad steering/ability feel, slower human collection patterns, multiple seeds for every other pilot, sector-specific human boss runs and late-game frame rate on lower-powered devices. The code-native visuals and menu flows also receive live browser smoke checks; scripted simulations do not replace those checks.
