# v0.48.0 balance and progression review

Baseline: v0.47.1, commit `7c9e3c0657eeb970ce07b419c50684e7f8456a9c`.

## Changes justified by the tests

**Storm Relay:** stationary Power Relays had no orbit sign. When their distance from the player entered the rail specialist’s orbital band (265–355 units), `specialistHeading` returned NaN. Multiplying that heading by zero speed still produced NaN positions. This left relays untargetable while their owner retained extra armour. The campaign controller subsequently propagated the invalid position into steering. A diagnostic captured the first invalid actor at 366.25 seconds. Stationary specialists now return their incoming heading before orbital steering. Relay health, firing, population limits and boss health are unchanged.

**Binary Supercluster:** the evolution moved zones from radius 135 to 175 without enlarging their level-five radius of 75. Its inner coverage edge therefore moved from 60 to 100 units. Enlarging evolved zones by 45 retains close coverage, including Wide’s orbit/radius multipliers. Damage, cadence and zone count are unchanged.

**Orbital Reaping:** spreading six scythes evenly around the ship removed two original forward lanes. It now retains the original three-shot fan and adds three rearward arcs. Six projectiles, damage and cooldown are unchanged. The evolution description now states the actual pattern.

Prism Tracers was also investigated. Its evolution trades forward coverage for surrounding coverage; it was retained rather than changing it solely to improve one stationary-target score.

## Method and limits

`BENCHMARK-CAMPAIGN.cjs` runs the same 19 cases against both sources, with a fixed 60 Hz simulation and a 900-second cap. Cases cover every sector using desktop seed 12345 and touch-profile seed 67890, crossed Grid seeds, three build preferences and two signal routes. Each uses Vanguard, ordinary health, XP, loot, spawning and genuine offered upgrade choices. Only sector/ship selection gates are bypassed in isolated test memory. No developer invulnerability, forced levels, forced equipment or permanent tools are granted. Merchants are skipped. The controller engages bosses, collects resources and approximates hazard avoidance; touch means movement-facing steering at a phone viewport, not physical touch hardware.

An initial resource-only controller was rejected because it failed to engage bosses reliably. All published before/after comparisons use the same corrected controller. These results are deterministic regression evidence, not human win rates, comprehensive ship balance or measured device frame rates. Some defensive builds still reach the time cap; those do not justify global boss-health reductions.

`BENCHMARK-WEAPONS.cjs` covers all 48 weapons at levels 1/3/5 and evolved level 5 in four 20-second scenes: armoured single target, forward pack, close surround and moving trail. Stationary unlimited-health targets isolate coverage; they do not measure on-kill utility or establish a universal weapon ranking. Only six of 768 rows change, all from the two intended evolutions.

## Progression and rewards

The baseline controller’s first upgrade arrives in 10.85–30.20 seconds across the 19 cases. Level two already guarantees an eligible starter upgrade. Clear-run base credits range from 153 to 312 before automatically banked contract payouts. Newly completed contracts are automatically claimed when banking, so an empty ready-contract list after a clear does not mean the player earned no contract rewards.

The economy regression covers reward totals, purchase gates, legacy paid-contract top-ups, duplicate protection, profile reloads and retained purchases. Contract rewards remain 50–400 credits; standard licences 125–500; Sovereign 1,500 with its existing challenge. No prices, payouts, XP thresholds, offer weights or boss-health scaling changed. Save and profile tests pass.

## Reproduce

```sh
node BENCHMARK-CAMPAIGN.cjs /path/to/before.html before-campaign.json
node BENCHMARK-CAMPAIGN.cjs index.html after-campaign.json
node BENCHMARK-WEAPONS.cjs /path/to/before.html before-weapons.json
node BENCHMARK-WEAPONS.cjs index.html after-weapons.json
node TEST-BALANCE-V048.cjs
```

The focused regression fails on the baseline’s stationary-relay heading and passes on the release. It also checks relay firing/destruction/armour removal, moving specialist headings, close coverage for normal/Wide Wisps and preservation of normal/Wide forward scythe lanes. `BALANCE-V048-RESULTS.json` records paired campaign outcomes, boss timings, initial upgrades, source/controller hashes and changed weapon rows.

## Matched outcomes

15 of 19 candidate cases clear, compared with 13 of 19 baseline cases. The only changed campaign outcomes are Storm Relay: desktop now clears at 680.92 seconds and touch profile at 672.25 seconds; both baseline cases stalled at one boss until the 900-second cap. The other 17 cases retain identical outcomes and timings. Four cases still reach the cap, reflecting this controller/build combination rather than a measured human failure rate.

At evolved level five, Orbital Reaping’s forward-pack DPS changes from 166.8 to 345.0 (base level five: 345.0). Binary Supercluster’s close-surround DPS changes from 0 to 378.4 (base: 215.6). These controlled coverage figures are not general damage multipliers.
