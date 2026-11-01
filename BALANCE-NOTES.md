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
