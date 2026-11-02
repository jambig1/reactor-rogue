# Reactor Rogue gameplay roadmap

Agreed order: work through items 1–10. Complete one stage before starting the next unless James changes the plan.

1. **Optional distress signals and objectives - implemented in v0.10.0.** Stranded pilot boarding/extraction, freighter defence, and a timed destructible reactor. One optional encounter at a time alongside existing reactor breaches, with explicit acceptance, dismissal, boss suspension and a reward choice. Validate balance with real play; device FPS testing remains outstanding.
2. **More weapon specialisations - implemented in v0.11.0.** Eight additional weapons receive two paths each: Bolts, Scatterburst, Frost Shards, Chain Lightning, Toxic Cloud, Gravity Well, Nova Reactor and Pulse Laser. The original expansion added sixteen paths; v0.12.0 adds ten more weapons, their ten evolutions, twenty additional paths and eight defensive/passive supports. There are now 36 weapons/evolutions and 42 choices across twenty weapons and Energy Shield. Paths persist through evolution and reset each run. Existing Cannon, Repeater and Shield branches retained.
3. **Interactive sector features - implemented in v0.13.0.** Destructible projectile cover, single-use derelict repair stations, slowing salvage pockets with credit pods, overloadable Storm Relay conduits and directional ion currents. Sector-specific cycles, boss holds and bounded world-space objects. Original sector backgrounds retained.
4. **Reactor Protocols - deferred by James, not started.** Save the Arcana-inspired card idea for later: twelve build-shaping protocols, pre-run selection, challenge unlocks and later boss selections; separate from equipment slots. Not all require drawbacks.
5. **The Lost Signal alien merchant - implemented in v0.16.0.** Approved simplified neon concept C; three rotating offers from fifteen exclusive run-only modifications, scrap currency, one free refresh per visit and paid subsequent refreshes. Normal transmissions at 2:00/5:00/8:00, plus a purchasable extra call. Existing Hangar credits remain separate.
6. **Difficulty tiers with new rules - planned.** Unlock harder sectors with different formations, boss mechanics and resource rules rather than health increases alone.
7. **Weapon and ship mastery challenges - planned.** Encourage unusual builds; reward alternate specialisations and cosmetics.
8. **Secrets and exploration rewards - planned.** Strange transmissions, hidden wrecks and sector-specific discoveries.
9. **Stronger final encounter - planned.** Flagship with destructible systems, shield generators and multiple phases.
10. **Daily seeded challenges - planned.** A shared ship, sector and upgrade seed with personal records.

Existing features include 12 pilots, 36 weapons/evolutions, three sectors and themed bosses, Hangar challenges and licences, permanent tools, reactor mutations, three weapon/support specialisations, original risk-selectable reactor breaches, weighted salvage, weapon statistics, endless continuation, graphics controls and priority enemy specialists. Extend these systems rather than reintroducing them as missing features.

## Before step 4: crowding/performance pass - completed in v0.13.1

Ordinary purple brutes cap at eight, yellow elites at two. Yellow health scales once (650 + 7 × game seconds); elite cache/50 XP rewards and boss stats stay unchanged. Brute overflow becomes lighter ships; capped elite arrivals retry without a catch-up burst. Auto graphics immediately drops glow/ice decoration under crowd pressure and responds to measured render cost earlier. Manual presets remain explicit choices. Step 4 is still next.

### Additional interlude - v0.14.0 menu refresh

Requested before step 4: moving aurora, main/pause visual overhaul, information and responsive spacing audit. See DEVELOPMENT-HANDOVER.md for checkpoint and verification status. Step 4 remains next.

### Additional interlude - v0.15.0 Sovereign

Requested twelfth playable ship: premium600-credit licence after20 sector bosses; Void Seeds starter, evolution passive and Singularity Jump gravity-rift ability. Step4 remains next.

### Current priority

Step 4 / Reactor Protocols explicitly saved for later. Step 5 is the current completed implementation; verify live deployment and responsiveness. Step 6 difficulty tiers is next, not started.


### Core foundations take priority - v0.18.0

James deferred difficulty tiers to review the core game first. Foundation1, enemy pacing/variety, now adds six formations, readable warnings and escape gaps while replacing ordinary spawn slots and respecting caps. Other review areas: weapon balance/identity, build clarity, run structure/ending, combat readability, progression pacing, movement/collection, performance/reliability, first-run guidance and sound feedback. These are review priorities, not permission to implement all at once. Roadmap step6 remains unstarted; Reactor Protocols remain saved for later.


### Foundation2 - v0.19.0 weapon pass

All36 weapons measured; focused volleys/lead aim, weaker niche weapons, overlap limits and mortar prediction adjusted. Weapon role labels/tips and accurate count milestones added to existing UI. See BALANCE-NOTES.md and raw benchmark. Human mixed-build feedback remains useful. Do not automatically begin foundation3 or original step6; wait for James's next choice.


### Foundation3 - build clarity, v0.20.0

Authorised by James after foundation2. Dedicated Pause Build page adds current equipment/levels/specialisations, active combinations and explicit evolution next steps. Upgrade choices gain a collapsed current-run loadout with slot counts. No persistent discovery; no combat or balance changes. Foundation4 (run structure/ending) remains unstarted. Difficulty tiers and Reactor Protocols remain deferred.


### Foundation4 - run structure / ending, v0.21.0

Authorised by James. Clear three-reactor route, compact countdown/engagement objective,15s approach cues, Pause route timeline and sector-clear debrief. Final kill protects the clear before next reward; exhausted mutation pool cannot block victory. Endless remains optional and preserves win without duplicate banking. Foundation5 combat readability not started. Difficulty tiers and Reactor Protocols remain deferred.


### Foundation5 - combat readability, v0.22.0

Authorised by James. Critical threat drawing moved above decorative effects; hostile shot diamond/contrast backing, hazard boundary outlines, specialist warning lines and player locator added. Damage labels move clear of locator visually only. Existing combat logic untouched. Foundation6 progression pacing not started. Difficulty tiers and Reactor Protocols remain deferred.


### Foundation6 - normal-run playtest / progression pacing, v0.23.0

James authorised full normal-run testing and pacing pass. Five fresh-Vanguard normal-rules automated clears measured, including phone movement-facing. Small opening/late XP adjustments plus8s ordinary-spawn boss recovery implemented; exact data and limits in PACING-NOTES.md/PACING-V023.json. Foundation7 movement/collection not started. Difficulty tiers and Reactor Protocols deferred.


### James's notes - priority1 pickup visibility, v0.24.0

Implemented stronger pickup shapes, labels, layers, expiry visibility and bounded important edge markers. This addresses pickup readability within foundation7; broader movement/collection mechanics remain unchanged. New notes retained: profiles/local saves/export-import then account sync; achievements/contracts; music DnB/jungle/techno; more equipment; distinct new sectors. Only pickup visibility authorised this turn.


### James's notes - priority2 local profiles / backups, v0.25.0

Authorised next priority. Named local profiles and export/import transfer implemented, preserving current default save and using non-overwriting imports. Current run resume is not included. Account-based automatic cross-device sync remains pending a backend/service choice; no fake sign-in provided. Other noted content/music/contract/sector priorities remain unstarted.


### Follow-up - cache honesty and sector enemy looks, v0.26.0

James requested after interrupted profile polish: separate supplies/evolutions, evolution drop only when ready, and distinct sector enemies mixed with usual fleet. Implemented typed cache promises and sector hull variants without changing enemy stats/population. Other feature priorities remain unstarted.


### James's notes - achievements / contracts, v0.27.0

Authorised next goal.24new achievements/31total, one-off credit rewards, status/category board, completed badges, in-run notices and result summary. Per-profile counters/migration and reward deduplication included. Other content/music/new-sector/account-backend priorities remain unstarted.


## Notes priority5 - more equipment (v0.28.0)

Authorised by James, expanded on request after Vampire Survivors weapon research:12 new weapons/evolutions,24 paths,6 supports,12 synergies.48 total weapons and32 supports. Existing six-slot rules, missing-part-only hints, run resets, caches and save compatibility remain. Enemy/sectors/music/account backend are separate later tasks. Reactor Protocols and difficulty tiers remain deferred.


## Approved visual follow-up - complete combat art (v0.29.0)

James approved the second, restrained attack study, then explicitly broadened scope to all attacks, defensive weapons and enemy attacks.48 weapon families/base+evolved, shields/devices, ship ability fields, threat shots/rails/charge/hazard cues updated. Combat values and progression unchanged. These visuals do not start the later sectors/music/account work; Protocols and difficulty tiers remain deferred.


Scope clarified: redesign includes item artwork, not just attack effects. All80 usable items (48 weapon +32 passive/defensive) now have individual illustrations shared across equipment UI; gallery includes the full passive catalogue. Item mechanics and progression remain unchanged.


## Notes - music (v0.30.0)

Authorised original drum & bass/jungle/techno soundtrack implemented: six adaptive menu/sector/boss/transmission loops, crossfades, manual selection, preview and independent saved audio levels. Worker synthesis and bounded caches avoid per-note work during combat. New sectors/account backend remain later; Reactor Protocols and difficulty tiers remain deferred.


## More sectors - v0.31.0
James authorised more maps/sectors. Added Cinder Foundry and Cryo Reach, six bosses, distinct scenery/fleets, rectangular hazards, existing terrain mixes and five-sector selector previews. First-clear unlock; no currency cost. Original three sectors unchanged. Account backend, Reactor Protocols and difficulty tiers remain deferred.


## City sector and separate bosses - v0.32.0
James requested a city-looking map and different bosses for every map. Neon Undercity adds rooftop/road scenery, security hulls, lockdown lanes and three distinct city attack plans. All6 sectors list separate rosters(18 unique names). Cryo attacks separated from Foundry via split emitter pincers/radial fractures. First-clear unlock and existing run/budget/save rules retained.
