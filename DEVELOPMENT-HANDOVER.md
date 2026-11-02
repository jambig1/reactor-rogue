# v0.7 - ship identity and progression feedback

Each ship now has an explicit passive. `traitDamage` applies eligible weapon bonuses through the central damage pipeline, retaining armour/piercing, critical hits, actual HP-loss accounting and kill attribution. Mutation/ship/environment damage (`other`) is excluded. Arc Feedback is applied per Arc Disc contact and counts enemies, excluding debris, capped at three bonuses.

| Ship | Passive | Rule |
|---|---|---|
| Wasp | Afterdash Overclock | 20% faster weapon firing for 3 seconds after using a dash. |
| Vanguard | Pristine Reactor | Deal 10% more weapon damage while above 75% hull. |
| Bastion | Siege Stabilisers | Siege Cannon deals 20% more damage after holding position for half a second. |
| Harrier | Point-Blank Assault | Deal 20% more weapon damage to enemies within 150 range. |
| Glacier | Brittle Hulls | Deal 20% more weapon damage to frozen enemies. Retains 0.5 HP/sec repair. |
| Tempest | Arc Feedback | Arc Discs gain 15% damage per enemy already pierced, up to 45% extra. |
| Scavenger | Salvage Dividend | Earn 20% extra run credits, rounded down. Contract bonuses are unchanged. |
| Spectre | Phase Ambush | Deal 35% more weapon damage for 3 seconds after Phase Shift ends. |
| Architect | Field Engineer | Tesla Buoys, Plasma Mines, Gravity Well and Orbital Mortar deal 25% more damage. |
| Helios | Solar Reclamation | Gas ignitions restore 3 HP, at most once per second. |
| Echo | Resonant Pressure | Your Sonic Pulses slow enemies for 1 second. Deal 15% more damage to slowed targets. |

Timers advance in simulation time only. Phase Ambush begins when phase ends. Solar Reclamation is capped to one heal per second. Siege Stabilisers tracks recent movement with a half-second setup. Afterdash Overclock divides weapon firing intervals by 1.2. Scavenger's 20% bonus floors the base run earnings before contract bonuses and uses the existing banking checkpoint to prevent duplicate credits.

`liveChallengeProgress` projects unbanked progress without mutating permanent saves. Each run snapshots starting challenge values, suppresses notifications for already-owned/previously-complete challenges, and queues new completions once. HUD notices never pause combat, never auto-purchase, and respect menu visibility. Results show progress/deltas for the two most relevant unowned ships, with a Hangar shortcut.

Desktop ship inspection separates its scrollable details from a fixed price/purchase area; the roster scrolls independently. Mobile keeps one natural vertical content flow with a horizontal roster.

All eleven hulls have code-native details rather than sharing the old generic centre hull overlay. Matching SVG menu hulls, bounded 42-point engine trails and distinct cast effects reinforce identity. Reduced motion disables trails and leaves ability pulses static apart from fades. HUD credit display stays at an edge and is hidden while menus are open.

Balance changes: first level guarantees an eligible starter offer; owned weapon upgrades use the regular upgrade rarity tier while retaining their displayed item rarity. New weapon acquisition odds are unchanged. Guarantee respects banishment, level caps and rerolls. Phase Torpedoes: base/evolved salvo 2/3, 2.2s interval, radius 7. Prices unchanged after run/currency checks. See BALANCE-NOTES.md.

Validation: individual passive rules, caps/timers, credit bonus dedup, live projection and challenge notices, results progress, starter guarantee/banishment, torpedo cadence/count, all hulls through real Canvas2D, bounded effects, v0.6 saves/purchases/abilities and v0.5 weapon/boss regression suites. Full simulated runs completed for all eleven pilots with two additional Spectre seeds. Simulation cannot establish human difficulty, physical touch feel or win rates. Optional objectives remain deferred.

---

# v0.6.1 - menu and progression review

- Fixed page-wide `touch-action:none`: body/menus now permit native scrolling; canvas alone owns flight gestures. All dialog panels are bounded and scrollable. Hangar has a single independently scrollable content pane with fixed tabs and Back; tab switches reset scroll position.
- Main menu: one selected ship preview plus compact roster. Locked roster entries open the matching Hangar detail. Desktop Hangar has a list/detail layout; mobile has a horizontal two-row roster above the detail. Owned ships never display misleading incomplete unlock bars: retained legacy ships explicitly explain ownership.
- Tool upgrades use consistent rows, clear current/next allowances, rank pips, prices, disabled states and exact shortfall. Shared permanent/next-run instructions replace repeated paragraphs.
- Functional fix: opening Hangar from Pause calls `commitHangar('progress')` before rendering. Current credits, challenges and contract rewards become usable immediately, with existing checkpoint deduplication. This does not refill current-run tools or create an extra run record. Close refreshes Pause wallet and launch summary.
- Settings is split into Movement, Weapons, Audio and Gameplay pages, with a fixed Done action. Records tabs show their selected state and retain a sticky Back action.
- Settings, records and Hangar hide/restore their parent menu rather than stacking translucent dialogs. Start/back dismiss every secondary overlay, including Hangar and specialisation. HUD elements hide while a menu is active. Dialog roles added for accessibility.
- Pause uses structured overview cards; results use summary statistics and a distinct earned-credit/wallet breakdown. Field manual rewritten into concise expandable instructions; obsolete version notes removed. Records have a single entry point with internal tabs.
- Tests: one-screen transitions and return paths; pause-Hangar banking/dedup; purchases during run vs next-run allowances; locked/ready/unaffordable/legacy ownership states; results navigation; all v0.6 progression/ability and v0.5 weapon/boss regressions; Canvas render paths and original Neon Expanse preservation. Live desktop menu screenshots complement simulation tests. Physical iPad touch remains manual QA.

---

# v0.6 progression - 31 October 2026

Authoritative source: repository `index.html`. Ship progression is versioned under `rr_hangar.progressionVersion=1`. First upgrade of an existing Hangar save grants legacy ownership of all six original ships; recognised older pilot/archive progress also qualifies. Fresh saves own Vanguard only. Migration writes once immediately. New ships are never granted by migration.

Ship challenge / price:
- Vanguard: free.
- Wasp: 500 lifetime kills / 40 credits.
- Bastion: 100 Siege Cannon finishing-hit kills / 50.
- Harrier: survive 6 minutes in one run / 60.
- Glacier: freeze 200 different enemies across runs / 75.
- Tempest: defeat any sector boss / 85.
- Scavenger: collect 500 gem pickups (merged gems count once) / 100.
- Spectre: defeat a boss without losing HP during its encounter; shield damage allowed / 160.
- Architect: 250 Tesla Buoy finishing-hit kills / 120.
- Helios: 50 gas ignitions / 140.
- Echo: discover Sonic Pulse evolution / 180.

`shipChallenges`, `shipOwned`, `shipReady`, `buyProgression` own all purchase/selection checks. Launch checks ownership independently of menu state. New pilot identities round-trip through archive validation. Challenge progress is banked with the run when ended or abandoned, using `hangarCheckpoint.progress` deltas; repeated records never duplicate progress or currency. Enemy freezing counts unique living enemies using `freezeTracked`. Boss HP-loss baseline is captured at spawn. Previous runs cannot reconstruct untracked freezing or clean-boss encounters.

Currency reuses existing Hangar salvage, now labelled credits: floor(kills/25) + 10 per boss + 8 per breach + floor(game seconds/60), plus one-time contract rewards. Results show credits earned including contract bonuses. Existing balances and equipment costs are preserved. No credits are spent or lost merely on defeat.

Tool ranks: 3 base uses plus up to 3 purchased ranks for each tool. Prices: skips 35/80/150, rerolls 50/100/180, banishes 60/120/200. Purchases are permanent, validated/clamped in saves, and never refill the active run. Each run snapshots its initial tool caps for Pause display.

New ship abilities:
- Scavenger: Scrapstorm, 95 HP, 185 speed, 1 armour. Salvage Burst marks gems/supply drops within 300 for attraction, 8s cooldown.
- Spectre: Phase Torpedoes, 70 HP, 215 speed. Phase Shift lasts 0.9s with invulnerability, 25% movement boost and no enemy collision push, 6s cooldown.
- Architect: Tesla Buoys, 115 HP, 155 speed, 1 armour. One 4s beacon at a time, 110 radius: 30% incoming damage reduction while inside and one hostile interception per .35s, 9s cooldown.
- Helios: Ember Wake, 90 HP, 205 speed. 2s Solar Boost activates the existing boosted-wake interaction, 7s cooldown.
- Echo: Sonic Pulse, 100 HP, 180 speed. Two shockwave dash charges, each 5s cooldown; cast emits Sonic Pulse.

Validation: fresh and legacy save migration, challenge gating, all ship purchases, duplicate/insufficient-funds guards, three tool ranks/caps, next-run allowance snapshot, deduplicated progress and earnings, unique freeze count, beacon reduction, five abilities/starter attacks, all eleven archive identities, Hangar pages; existing 26-weapon/nine-boss and sector/evolution regression suites. Full human balance runs and physical iPad touch remain manual QA.

Backlog - deliberately deferred: optional convoys, distress signals, reactor station objectives and risky caches. No new objective/event system added in v0.6.

---

# REACTOR ROGUE - current handover

## v0.5 - 31 October 2026

Use `index.html` in this repository as the source of truth. The historical notes below describe earlier builds.

- Weapon accounting is centralized in `hit`: actual enemy HP removed after armour, excluding overkill/scenery. The optional fourth argument preserves ownership for piercing shots and singularity fields. Source aliases handle DOT, mines, evolutions and synergy effects. Ship/reactor/environment damage is its own row.
- `weaponStats` stores damage, bossDamage, kills, hit events and game seconds equipped. Pause → Weapons, results, and expandable Recent runs display breakdowns. DPS includes idle time while equipped, excludes pauses and uses game seconds at any speed. Snapshot/cleanRun round-trip bounded stats; older records show unavailable rather than invented data.
- Initial tuning: harpoon 8+4L → 10+5L; mortar 35+18L → 42+21L; phase torpedo 28+14L → 38+20L. Gravity tick 7+5L → 6+4L; poison tick 5+4L → 4+3.5L. Upgrade previews share the new values. This is an initial balance pass, not a claim that all builds have equal DPS.
- `sectorBossDefs`: original Neon Expanse unchanged. Belt: Grapple Corsair, Scrap Crusher, Salvage Dreadnought. Storm: Relay Keeper, Arc Conductor, Tempest Citadel. All use the existing 3/6/10 minute schedule and mutation/cache/victory pipeline.
- Sector boss attacks alternate projectile patterns and 1.5-second ground warnings. Belt drops moving salvage hazards; the final carrier also launches physical debris. Storm bosses use arc zones; later tiers deploy at most two destroyable firing relays, increasing boss armour from 20% to 40% while any relay is alive. Below half health attacks accelerate. Boss defeat clears owned relays and hazards.
- Automated checks: full boot, save/load stats, overkill/death guards, all 26 weapon attribution sums, all nine bosses, warnings, relay cap/armour/cleanup, pause/results, v0.4 mechanics regression, responsive render paths, and original arena byte-for-byte preservation. Runtime harnesses use mocked DOM and real simulation; hosted browser checks supplement them. Full human ten-minute runs and physical iPad touch remain manual QA.

---

# NEON SWARM - Development handover

Prepared 30 October 2026 (Europe/London). This is a portable snapshot; use the HTML supplied alongside this document as the source of truth.

## Start here at home

1. Copy this entire folder to your home computer.
2. Open NEON-SWARM-v0.2.html in a full browser to play. File/attachment previews may disable JavaScript. Click/tap to unlock audio.
3. Open a new development chat and attach BOTH the HTML and this handover. The old local development chat may not be available on the home computer.
4. Ask the assistant to inspect the actual HTML before changing it. Work on a copy and return a full updated downloadable HTML, not snippets.
5. Keep a dated backup before each substantial change. Use one latest working copy to avoid divergent versions between computers.

Suggested message:
“Continue developing NEON SWARM from the attached working HTML and development handover. Read both first, preserve all existing features and the neon visual style, and make changes directly to this game. The handover records the decisions and validation limits. My next change is: …”

## Goal and visual direction

Single-file, offline, top-down survivor / bullet-heaven browser game, inspired by Vampire Survivors build progression and Returnal combat energy. Supports relaxed play as well as powerful, chaotic builds. It is an original game; do not import copyrighted art, music or voice recordings.

The user strongly prefers:
- Dark original grid background, NOT the detailed floor-panel environment tried earlier.
- Animated multicoloured pixels and subtle light streaks along grid lines.
- Neon glow, particle explosions, screen shake, floating faceted gems.
- Detailed mechanical ships and enemies: layered armour, vents, optics, reactor cores.
- Distinct pilot hulls, a separately rotating turret, and thrusters attached ONLY to the hull.
- Hull faces travel direction; turret follows the selected aiming scheme. Manual starter fire follows the turret/pilot aim.
- Gas that looks gaseous, billows and reacts to actors, projectiles and explosions.
- Neon arcade menus, readable combat and mobile-friendly overlays.
Keep the existing artwork and gameplay when making changes. An earlier rebuild lost the visual character and the user disliked it.

## Packaging and implementation

- NEON-SWARM-v0.2.html is the entire game: inline CSS, Canvas 2D rendering, DOM UI, inline plain JavaScript and synthesised Web Audio.
- No installation, build step, external assets, libraries, accounts, network service or API keys are required.
- The filename/version has stayed v0.2 through many additions; it is substantially more developed than the first v0.2.
- Simulation state lives in variable s, outside the renderer. Main states include menu, play, pause, upgrade, reward, mutation, settings, records and end.
- requestAnimationFrame calls frame(); simulation is subdivided into steps no larger than .016 game seconds. Overall speed scales the simulation.
- Avoid relying on globals from this development chat. The HTML must work standalone.
- Original v0.1 was supplied as a visual reference; the current game was rebuilt then extensively refined. The current HTML is authoritative.

## Controls and settings

Three saved control modes:
- Mouse + keyboard: WASD/arrows move; cursor controls turret direction.
- Mouse only: hold left-click to fly toward cursor; release to stop.
- WASD/arrows only: move and aim in travel direction; mouse aim ignored.
- Touch-drag floating joystick remains available in every mode.

Firing:
- Auto: weapons acquire and fire at nearby enemies.
- Manual: ONLY the pilot's starting weapon requires input and fires in the direction the turret is looking.
- All other acquired weapons remain automatic, including another pilot's starter.
- Manual input: left-click for hybrid; right-click in mouse-only mode; held Space or the on-screen FIRE button in any mode.
- Orbiting weapons and defences remain active automatically.
- Escape/P pauses. Space also pauses in Auto mode.
- Dash: Shift, middle-click or the on-screen DASH button. Follows movement or current facing if stationary. Brief invulnerability; cooldown pauses with gameplay.

Settings:
- Game pace .65× to 1.5×, adjustable while paused, saved locally.
- Supply/cache floor icons and off-screen direction toggle. NO XP GEM INDICATORS.
- Master/effects/music volume, mute and Test sound.
- Back to start is available from pause/results. Opening records/settings from gameplay pauses safely.

## Pilots

All pilots can obtain EVERY weapon, subject to six active weapon slots and six shared support/defensive slots.
- WASP: 75 HP, speed 225, Needle Repeater starter; quick/light fire, long dash (~220 base distance), 3s cooldown.
- VANGUARD: 100 HP, speed 180, Neon Bolts starter; balanced, medium dash (~170), 4s cooldown.
- BASTION: 150 HP, speed 140, 2 innate damage reduction, Siege Cannon starter; heavy explosive fire, short dash (~130), 5s cooldown.
Actual movement passives and boosts can affect dash travel. Check code before rebalancing.
Armour Plating progressively adds visible armour segments.

## Progression and weapons

Three random level-up choices. Items have five levels; slot limits are enforced. Extra XP queues further level-ups. Maxed builds receive repair choices. Six shared support slots mean a defence competes with a passive.

16 weapons (IDs):
- Neon Bolts (bolt)
- Needle Repeater (rapid)
- Siege Cannon (cannon)
- Scatterburst (scatter)
- Arc Discs (arc)
- Plasma Mines (mines)
- Gravity Well (gravity)
- Void Lance (singularity)
- Chain Lightning (chain)
- Orbiting Blades (blade)
- Toxic Cloud (toxic)
- Frost Shards (frost)
- Pulse Laser (laser)
- Homing Missiles (rocket)
- Seeker Drones (seeker)
- Nova Reactor (nova)

Ranges intentionally differ. Starters/shotgun are short range; cannon/discs medium; missiles, Pulse Laser and Void Lance longer. Projectile travel is capped independently of projectile speed. Targeting Array increases reach. Do not restore universal early screen-wide attacks: the user found that too easy.

18 support/defensive items (IDs):
Size Matrix (area), Kinetic Drive (velocity), Targeting Array (reach), Lucky Circuit (luck), Reactive Spikes (thorns), Phase Safeguard (phase), Reinforced Hull (hull), Point Defence (intercept), Power Amplifier (power), Data Harvester (scholar), Energy Shield (shield), Armour Plating (armour), Regeneration (regen), Repulsion Field (repulse), Overclock (clock), Magnet (magnet), Critical Core (crit), Thrusters (speed).

Size Matrix: +12% weapon area/size and defensive coverage per level.
Kinetic Drive: +12% projectile/orbit speed and defensive recovery per level.
Both are permanent passives available at level-up AND as floor drops. They occupy support slots and stack to 5. If no free support slot, a new passive pickup stays on the floor; owned passives can upgrade while slots are full. Maxed duplicates become 10 XP.
Movement speed, projectile speed, fire rate and game pace are different systems.

## Rarity and Luck

Fixed item rarity, shown on level-up cards and loadout borders:
White Common → Green Uncommon → Blue Rare → Purple Epic → Red Mythic → Gold Legendary → Prismatic Ascendant.
Rarity is an item's identity/selection weight, NOT a separate random quality roll for an already equipped weapon.
The rarityMap in source is authoritative.

Lucky Circuit adds 20% Luck per level. Luck increases rarity-weighted level-up odds, supply drop frequency and supply quality. Choices are unique and obey slot/cap rules. There is drop pity to avoid excessively long droughts.

Supply quality is rolled separately: higher-quality timed boosts last longer; repair cells heal more; rarer vacuums grant some shield. Supply icons retain their functional symbols.

## Gems and supplies

XP: blue +1 (drones), green +5 (hunters), purple +15 (brutes), gold +50 (elites); bosses yield +200.
Gem merging conserves all XP and prevents excessive objects. Moving vacuum-marked gems retain their state through merging.

Random supplies: XP Vacuum, Afterburner, Overcharge, Aegis, Repair Cell, Size Matrix, Kinetic Drive.
- XP Vacuum makes ALL existing gems and supplies float toward the pilot, accelerating and collecting on arrival. It does not instantly delete and credit everything.
- Afterburner: +50% movement speed.
- Overcharge: +75% weapon damage.
- Aegis: halves incoming damage.
- Basic boosts last 12s; quality adds time. Repeats refresh rather than multiply.
- Supplies normally expire; vacuum-attracted supplies are protected while travelling.
- Elite caches offer eligible evolutions, otherwise supplies/repair/XP.
- Marker toggle includes supplies/caches only, never XP gems.

## Evolutions

Level 5 weapon + matching support at level 1+, then collect an elite evolution cache and choose:
- Chain Lightning + Critical Core → Storm Network: critical hits branch lightning.
- Siege Cannon + Power Amplifier → Starbreaker: explosions spawn six secondary explosive shells.
- Orbiting Blades + Armour Plating → Iron Halo: stronger blades intercept hostile shots.
- Toxic Cloud + Regeneration → Living Plague: poison kills heal and spread gas.
No extra slot used; recipes/status in Pause; evolved loadout icons have a star.
Starbreaker fragments must avoid immediately colliding again with their original target, so they travel outward.

## Bosses and mutations

Bosses spawn once each, at 3:00, 6:00 and 10:00 GAME time. If a prior boss remains alive, the next waits.
- Prism Warden: pink radial bursts and aimed fans.
- Rail Reaper: cyan railgun craft, telegraphed crossing beams and fast volleys.
- Singularity Engine: orange/pink reactor core, rotating projectile spirals and rings.
Distinct hulls, arrival protection, warning patterns, HP bars, harder phases below half HP. The timer must NOT end the game at 10:00 before the final fight.
Boss defeat clears existing hostile shots/beam hazards, gives a mutation choice and drops an evolution cache.

Choose 1 of 3 fresh mutations after EACH boss; stack 3 in one run without equipment slots.
Pool:
- Ricochet Matrix: non-explosive shots bounce toward up to 3 fresh enemies.
- Cryo Cascade: all projectiles can freeze; frozen deaths shatter.
- Mirror Reactor: intercepted shots become friendly homing shots; grants slot-free Point Defence 1.
- Overflow Capacitor: excess healing becomes up to 40 extra shield, +1 HP/sec regeneration.
- Dash Dynamo: dash releases damaging/slowing shockwave.
- Volatile Core: weapon kills create nearby explosions.
No duplicate mutation offers. Recipes and mutations shown in Pause.
Win after the final boss AND final mutation selection. Results offer Continue Endless, retaining the build and the same run record.

## Gas interactions and ignition

Toxic Cloud uses soft overlapping gradient lobes, wisps and motes. Basic lifetime: 3.8s at level 1, 6.2s at level 5. Living Plague spread clouds last 3.2s.
Reactive gas:
- Pilot/enemies displace plumes and leave settling wakes.
- Shots leave small trails; beams disturb gas.
- Blasts push gas outward.
- Wakes/flow are bounded and decay. Simulation updates only during gameplay.
- Reduced-motion rendering suppresses extra motion without disabling ignition gameplay.

Explosions, Nova Reactor and Pulse Laser ignite gas. Frost and dash pressure disturb but do not ignite.
Ignition consumes a cloud, deals burst damage and spreads to neighbouring clouds with ~.16s delay.
A cloud detonates once, then flames fade (~.95s). Ignition adds points/chain progress. It does not damage the player.
Gas blasts and beam impulses are capped/consumed per update. Large builds need browser performance testing.

## Scores, medals and records

Score multiplier up to ×10:
- Kills add chain progress; gas detonations add more.
- Four-second inactivity timer.
- Multiplier affects POINTS, never XP or damage.
- Animated high-multiplier celebrations; reduced-motion alternative.

Separate kill-only four-second multikill streak:
2 Double Kill; 3 Triple Kill; 4 Overkill; 5 Killtacular; 6 Killtrocity; 7 Killamanjaro; 8 Killtastrophe; 9 Killpocalypse; 10 Killionaire.
Gas detonations themselves are not kills. Counts above 10 continue tracked but do not repeatedly spam the Killionaire medal. No copied announcer audio; synthesised reward cues.

Local pages available from start/pause/results:
- Leaderboard: top 50 scores, pilot, kills, survival game time, bosses, combo, pace range, result/date.
- Stats: runs, wins, win rate, kills, actual/game time, scores/averages, damage dealt, HP lost, gem/supply pickups, dashes, ignitions, evolutions, mutations, per-pilot records and medal counts.
- Recent runs: last 100 records with weapons/supports, levels, evolutions and mutations.
Records save on completion, restart or return to start. Repeated saves and endless continuation update the SAME run by delta, not duplicate lifetime totals.
Detailed tracking began with this feature; earlier sessions only have legacy bests.
No online leaderboard. Browser storage does NOT travel with the HTML.

Storage keys:
neonSwarm02 (legacy bests), ns_archive (history/board/lifetime stats), ns_controls, ns_fire, ns_pilot, ns_pace, ns_markers, ns_audio.
All storage operations need graceful failure handling. Export/import saves has been suggested but NOT implemented.

## Audio

Procedural Web Audio effects for weapons, explosions, pickups, dash, damage, bosses and rewards. Looping synthesised electronic music.
- Audio unlocks on user interaction; browser may initially block autoplay.
- Master/effects/music volume, mute, saved settings, Test sound.
- Music pauses with gameplay; hidden pages are silenced.
- Voice cap, rate limits and compressor prevent excessive overlap.
- Game remains playable when audio/storage unavailable.
No external recordings or music files.

## Technical landmarks

Search these functions/definitions in HTML rather than trusting line numbers:
defs, rarityMap, weaponReach, rollChoices, pilots, start, attack, shoot, hit, hurtPlayer, update, frame, hud;
pool, levelUp, choose; dropTypes, rollDrop, collectDrop, mergeGems;
evolutions, openReward, claimReward; mutationDefs, openMutation, claimMutation;
bossDefs, spawnBoss, bossAttack, drawBossWarning, updateHazards;
dash; gasLobe, updateReactiveGas, gasBlast, gasBeam, igniteGas, updateIgnitions, drawToxicGas;
drawArena, enemyBase/enemyDesign, pilotBase/pilotDesign, drawProjectile;
audioPrefs, unlockAudio, sound, audioTick;
medalNames, awardMultikill, archive, cleanRun, snapshotRun, recordRun, openRecords, renderRecords.

## Verification status and development cautions

Completed repeatedly: JavaScript syntax parsing and VM-based runtime checks using mocked DOM/Canvas/Audio APIs. Tests covered upgrade queues/slot caps; pilots/firing/control modes; dash; boss schedules/attacks; mutations/evolutions; gas motion/ignition; combo/medal scoring; rarity distributions; gem merge conservation; records reload/dedup/endless; settings/storage-blocked/audio-unavailable fallback; rendering code paths at mobile/tablet/desktop sizes.

Important limitation: mocked rendering tests establish that code paths execute, NOT that the browser pixels look correct or performance is good. A local browser-preview attempt timed out in this environment. Visual browser inspection, audible listening tests and physical iPad tests remain unverified. The user has been playing and giving visual feedback.

Before declaring a feature finished:
- Run the actual game in a browser where available, inspect errors, play and verify controls.
- Test hybrid mouse/keyboard, mouse-only, WASD-only and touch.
- Check maxed evolved/mutation builds for CPU load, recursion, cloud/projectile counts.
- Verify menu/pause/reward/upgrade transitions and automatic focus-loss pause.
- Ensure upgrades don't accidentally make manual mode govern every weapon.
- Keep hull and turret Canvas transforms independently balanced. A previous double rotation caused engines to appear on the turret.
- Maintain actual projectile distance caps; a prior careless text replacement touched hostile movement rather than player shots. Edit the intended function precisely.
- Avoid cascading duplicate death credit; hit() has a dead flag guard.
- Gas graphics displacement does not change poison damage footprint; ignition intentionally changes behaviour.
- Returned HTML must remain offline and self-contained.

## Sensible next work (not yet implemented)

Browser playtesting and balance tuning are the main priority. The user thought early range was too forgiving; it has been reduced and differentiated but not quantitatively balanced.
Potential follow-ups, only if requested: export/import browser saves, additional bosses or arenas, new mutations/evolutions, announcer-style original voice/audio (not copied), performance settings, accessibility/control remapping, online services.
Do not claim these already exist.

## Updating this handover

When new features are added, update this document and copy the current HTML alongside it again. Check both files belong to the same snapshot. The scheduled end-of-day refresh was completed on 30 October 2026 after 16:45 UK time. The supplied HTML is the latest working source.


## Subsequent update - Reactor breaches and touch-only controls

This section supersedes the earlier “not yet implemented” map-event notes and three-control-mode summary.

- Optional reactors appear starting at 1:15, with a directional HUD. Approach within 80 range and press E or click/tap Configure breach. The three risk cards also use keys 1–3.
- Stabilise: 14 seconds in the 115-radius zone, 45-second limit, extra enemies every 2s, Rare+ compatible upgrade choice, 15 XP, 250 base points and Rare Repair Cell.
- Overload: 20s hold / 55s limit, 1.35s waves, stronger hunters/brutes, Epic+ compatible upgrade choice, 30 XP, 600 base points, Epic Overcharge.
- Meltdown: 26s hold / 65s limit, two enemies per 1.05s wave with stronger stats, Mythic+ compatible upgrade choice, 50 XP, 1200 base points and Legendary Aegis.
- All event rewards respect weapon/support slots and five-level caps. Three choices are offered; compatible high-rarity upgrades are used where possible, with supply alternatives when the pool is exhausted or slots prevent them. Completion XP/score/supply is awarded separately from the selected reward. Points use the existing combo multiplier.
- Progress drains at .6 seconds per second outside the zone. Event timers, progress and waves suspend during bosses. Ignored available events expire after 65 seconds; success/failure schedules another event ~120 seconds later. Initial event is fully optional.
- Added lifetime stats counters for breaches cleared/failed; existing record files safely default these counters to zero.
- Four saved input modes now include Touch. Touch FIRE (manual mode only) and DASH buttons show only in explicit Touch mode or after actual touch input; mouse input returns the automatic detector to desktop unless Touch remains explicitly selected. Coarse-pointer devices default to Touch before loading saved controls. Keyboard/mouse functionality remains available through their respective modes.
- New functions: breachRisks, spawnBreach, nearBreach, configureBreach, beginBreach, updateBreach, completeBreach, openBreachReward, claimBreachReward, drawBreach, updateBreachHUD, touchButtons. States breachSelect/breachReward pause combat.
- Verified with mocked runtime tests: all risk levels, reward rarity floors, slot caps, completion/failure, boss suspension, input detection, action-button visibility, E/1–3/Escape navigation, stats saving, and live simulated combat for hybrid/mouse/keyboard/touch. Physical touch and visual browser checks remain unverified.


## Latest preference - no multikill callouts

The user found multikill callouts excessive in dense fights. All multikill banners and associated audio have been removed. Keep score multiplier UI and its celebrations. Historic and current multikill statistics still track silently. Do not restore multikill announcements unless requested.


## Latest update - Knockback and destructible salvage

- Shot impacts impart damped momentum; brutes/elites/bosses have greater mass. Colliding with enemies pushes them away even when the pilot is temporarily invulnerable. Dash rams deal damage and a stronger impulse; Bastion is strongest.
- Added drifting, spinning asteroids and neon supply wreckage, initially seeded and replenished around the moving arena (cap 24). Debris is pushable rather than an impassable wall.
- Breakable objects take damage from projectiles, beams, orbiting blades, blasts and dash rams. Wreckage guarantees a supply drop plus XP; asteroids yield XP with a chance of repair, magnet or boost drops. Loot quality uses Luck.
- Auto-targeting prefers live enemies and only falls back to debris when no enemy is in range. Broken debris gives points using the current score multiplier, but does not count as an enemy kill or multikill.
- Break/death guards prevent duplicate loot. Impulses are capped and damped; debris despawns far away. Moving debris also disturbs toxic gas.
- New functions: knock, addDebris, seedDebris, hitDebris, updateDebris, drawDebris. Player projectile collision includes enemies and debris; gasBlast applies physical blast pressure and debris damage.
- Verified in mocked runtime: weighted knockback resistance, priority targeting, single loot emission, dash rams, impulse decay, blast damage, and combat in hybrid/mouse/keyboard/touch. Browser visual and physical-device validation still needed.


## Latest update - Sparse asteroids, fragments and damaging shrapnel

Supersedes earlier guaranteed loot / density notes: initial debris is 6 whole objects, replenished every 8 seconds up to 8 whole objects. Total fragments/objects capped at 48. Asteroids split once into 2–3 small physical chunks which expire after 6 seconds; fragments never split or drop loot. Auto-targeting ignores fragments. Explosion pressure charges whole debris and fragments for 2 seconds; fast pieces moving toward enemies deal momentum-scaled damage and knockback, once per target per blast charge. Friendly debris does not hurt the pilot. Ordinary bumps alone do not cause shrapnel damage. Surviving fragments inherit parent blast charge and hit history. Objects can drop nothing: asteroid XP chance 28%, supply chance 12%; wreckage XP chance 65%, supply chance 50%. Independent rolls. Verified fragmentation, no duplicate loot, sparse spawning, expiry, target priority, momentum damage/guards and all control-mode simulations. Visual/browser testing remains unverified.


## Latest update - Explosive fuel cells

Sparse debris now includes orange pulsing fuel cells (20% of whole-object spawns; wreckage 22%; rest asteroids). Shooting/destroying one triggers a 155-range blast, enemy damage, physical pressure, gas ignition and nearby fuel-cell chains. Each cell explodes only once, creates five fast temporary hull shards subject to the 48-object cap, awards points and chain progress, and drops no loot. Friendly explosions do not hurt the pilot. Shards are emitted AFTER the blast/chain propagation so they survive their own explosion. New function detonateFuel; fuel property on whole debris; fuelShard marks its fragments. Tests cover cell chaining, gas ignition, enemy pressure/damage, live shrapnel, no duplicate reward, no self-damage and bounded combat. Visual/browser inspection remains unverified.


## Latest update - Warning fuses and dramatic chains

Fuel cells now arm on lethal damage: HP stays at 1, a ~0.65s fuse flashes the cell and shows a countdown ring, then detonateFuel marks it broken/dead. Repeat hits cannot reset the fuse. Linked cells each get their own warning delay. chainBlastFX tracks consecutive fuel/gas detonations within 1.8 seconds and escalates multi-layer shockwaves, spark output, shrapnel (5–10 per fuel cell), capped screen shake (16 maximum) and a brief subtle warm screen tint. Visual blast size grows without expanding fuel damage radius. Reduced-motion suppresses viewport shake/tint. Debris cap remains 48. Test checks passed for fuses, sequential propagation, no duplicate explosions, bounded fragments, visual effect code paths and tint decay with/without reduced-motion. Browser visual inspection remains unverified.


## Latest update - Reactive smoke, scorch marks and salvage-only consumables

Hot explosions/gas-chain blasts now leave scorch marks (~24s, cap 48) and drifting grey smoke (~8s, cap 18). Smoke uses the gas disturbance simulation with seven lobes: ship/enemy/debris motion, shots, beams and blast pressure stir it. Smoke has no poison damage and cannot ignite. Scorches render under objects; smoke stays under ships and attacks. Nearby simultaneous marks are deduplicated, reduced-motion stops extra drift, and all aftermath expires. Added s.smoke/s.scorches and addAftermath/updateAftermath/drawSmoke/drawScorches. Salvage drops are explicitly tagged origin=salvage and restricted to repair/vacuum/speed/damage/defence plus XP gems; a defensive collection guard converts any invalid salvage passive to repair. Permanent passive drops from enemy supply rolls remain unchanged. Verified creation, flow response, shot wakes, bounds, expiry, reduced-motion and consumable-only salvage in mocked runtime. Browser visual inspection remains unverified.


## Latest update - Six ships and more visible salvage

Three new pilots join the original three: Harrier (85 HP, speed 210, Scatterburst starter +2 starter pellets, 3.5s/1000-speed dash), Glacier (105 HP, speed 170, Frost Shards starter, 0.5 HP/sec innate regeneration, 4.2s/780 dash), Tempest (90 HP, speed 195, Arc Discs starter, all weapon cycles 10% faster, 3.8s/920 dash). Distinct hulls and picker silhouettes; responsive picker uses 3 columns desktop / 2 mobile. All sixteen weapons remain available to all pilots. Manual fire still governs only the chosen starter. New starters receive proper pilot firing-rate modifiers. Save validation, per-pilot stats and records include all six IDs.

Salvage was too sparse: now 10 visible initial objects (5 asteroids, 3 wreckage, 2 fuel cells), replenished every 4.5s up to 12 whole objects. New salvage appears near visible viewport edges rather than far beyond view; initial locations avoid the pilot. Fragment cap remains 48; consumable-only loot rules remain.

Also corrected the turret render layer so it draws once independently of hull/armour, including unarmoured pilots. Verified balanced canvas transforms across all six hulls and armour levels. Runtime checks passed for starters, manual gating, special traits, all-pilot save/stat support, visible salvage, and combat across all input modes. Visual/browser checks remain unverified.


## Latest update - Full sixteen-weapon evolution roster

Every weapon now has one themed evolution. The original four remain. New recipes (weapon level 5 + paired support level 1, then an elite cache):

| Weapon | Support | Evolution | Behaviour |
|---|---|---|---|
| Neon Bolts | Overclock | Photon Echo | Two delayed reduced-damage echoes per bolt |
| Needle Repeater | Kinetic Drive | Railneedle Storm | Faster piercing needles apply damaging ion fractures |
| Scatterburst | Size Matrix | Scatter Sun | Pellets explode into miniature blasts |
| Arc Discs | Targeting Array | Eventide Discs | Return to pilot and hit targets again on return |
| Frost Shards | Size Matrix | Glacial Bloom | Guaranteed freeze; expanded shatter on frozen deaths |
| Pulse Laser | Power Amplifier | Solar Lance | Lingering damaging beam corridor |
| Homing Missiles | Targeting Array | Constellation Salvo | Impacts release three smaller homing missiles toward fresh targets |
| Seeker Drones | Magnet | Salvage Swarm | Flying drones vacuum nearby XP gems toward pilot |
| Nova Reactor | Energy Shield | Aegis Supernova | Clears nearby hostile shots and refills shield; works with Mirror Reactor |
| Plasma Mines | Reactive Spikes | Shrapnel Garden | Detonations launch eight piercing spikes |
| Gravity Well | Repulsion Field | Tidal Collapse | Inward pull ends with outward damaging implosion |
| Void Lance | Reinforced Hull | Event Horizon | Damage scales with max HP; impacts leave collapsing micro black holes |

Evolution caches offer up to three eligible choices. Recipes/effects are shown in Pause and hints on level-up cards; all evolutions stay in the original weapon slot. Level-up randomness is preserved; recipe pairings are deliberate and thematic. Save sanitisation now accepts all sixteen evolution IDs. Helpers evolveProjectile, evolvedImpact, updateEvolutionExtras and state arrays s.echoes/s.lances implement new effects. Cluster children are tagged to prevent recursive splitting; echoes are tagged to prevent infinite echoing.

Tests passed for all sixteen unlock recipes and slot preservation, new effects, capped choices, evolved combat and history persistence. Original four already regression-tested previously; full runtime rendering passes remain mocked, not browser-visual verification.


## Latest update - Pause evolution tab and limited upgrade tools

Evolution recipes/effects now live only in a separate Evolutions tab inside Pause; Overview keeps run multipliers, mutations and upgrade-tool counters. Removed recipe hints from level-up cards to reduce clutter. Every new run starts with 3 Skips, 3 Rerolls and 3 Banishes. Skip consumes the current level-up without an item or XP refund. Reroll draws three new legal choices at the same level (avoids the previous set when enough alternatives exist). Banish toggles selection mode; select a displayed item to exclude it from future level-up/breach choices without removing equipped levels, then choose from fresh cards. Cancellation costs no charge; repair fallback cards cannot be banished. All counters/banished IDs reset on new runs; queued XP levels remain intact. Tools apply to normal level-up choices, not automatic floor consumables or boss mutation selections. New functions: drawUpgradeChoices/renderUpgradeChoices, skipUpgrade/rerollUpgrade/toggleBanish/banishChoice, setPauseTab. Tests passed for per-run limits, no duplicate XP/levels, banished pool exclusion, cancellation, fallback exhaustion, queue processing and pause-tab rendering.


## Latest update - Distinct weapon firing patterns

Forward turret weapons: Neon Bolts, Needle Repeater, Siege Cannon, Scatterburst, Pulse Laser, Void Lance. In Auto they fire only when a target is within a forward cone; they no longer pivot every weapon toward the nearest enemy. Turn the turret using your selected controls. Arc Discs use rotating radial spokes; Frost Shards use 360-degree rings; missiles launch around the pilot and then home. Lightning, seeker drones, gas and gravity wells still acquire targets independently. Blades/Nova remain all-round and mines trail. Manual mode overrides only the pilot starter to an aimed forward spread, including Glacier/Tempest starters. Additional weapons remain automatic. Weapon pattern labels appear on upgrade cards. New firingPatterns/forwardWeapon/forwardTarget helpers. Radial projectile counts increased for coverage; further balance tuning may be needed. Tests passed for forward gating, all radial quadrants, independent targets, all six manual starters and evolved combined combat.


## Latest update - Distinct evolved weapon audiovisual identity

All sixteen evolutions now have evoStyles colour/accent/synth profiles and dedicated evolvedSound firing cues (layered tones/noise with individual cooldowns, existing voice cap and volume/mute respected). New evolution selection triggers a three-second named reveal, particle ring and evolution fanfare. Projectile rendering wraps projectileBase with distinct luminous cores, double trails, crystal branches, multi-ring discs, rocket armour and singularity rings. Evolved non-projectile visuals include Iron Halo shield blades, Living Plague bioluminescent tendrils, Shrapnel Garden spike rings, Tidal Collapse/Event Horizon containment arcs, gold Solar Lance beams and blue Aegis Nova. Effects are cosmetic; core weapon damage/physics unchanged. Gold laser still ignites gas. New helpers: evolvedSound, celebrateEvolution, drawEvolvedAreas and projectileBase/drawProjectile wrapper. Reduced-motion CSS/visual paths retained. Tests passed for all sixteen sound profiles, normal/evolved dispatch, mute/effects-zero, voice/object bounds and combined evolved render/runtime paths with/without reduced motion. These are mocked audio/render tests, not audible listening or browser visual verification.


## Final end-of-day verification - 30 October 2026

The ZIP was refreshed after the final evolved audiovisual update and contains the latest game, this handover, START-HERE.txt and SHA256.txt. The game parses as JavaScript and the packaged bytes were checked against the current output. No gameplay changes were made during final packaging.

Hands-on browser testing was attempted twice using approved native control and independent Playwright sessions. Native control stopped because it could not reliably identify the browser URL; isolated Chrome/Edge attempts failed during browser startup (profile/crash-reporting process failures). Therefore the assistant has NOT actually played the game or verified real browser screenshots/listening. Earlier runtime, rendering and audio checks were mocks; never describe them as real playtests. Existing game and user saves were not modified by those attempts. The user has been playing and providing feedback.

At home: attach NEON-SWARM-v0.2.html and DEVELOPMENT-HANDOVER.md to a new development chat, ask it to read both, and state the next change. This file includes later update sections which supersede earlier summaries; the current HTML is authoritative. No browser stats, settings, credentials or development-browser profiles are included in the package.


## Update - RPG damage numbers, 31 October 2026
Enemy damage now displays floating world-space numbers after power, Overcharge and critical bonuses. Normal hits are pale mint; critical hits are larger gold numbers with !. Rapid same-enemy hits of the same critical status combine within short fixed windows; labels cap at 100 and offscreen hits are omitted. Numbers use game-time expiry, pause with combat, reset per run and suppress drift/pop under reduced motion. Displayed damage includes overkill to make weapon strength comparable; lifetime damage tracking remains capped to actual HP lost. No damage balance changed. Helpers: addDamageNumber, damageLabel, updateDamageNumbers, drawDamageNumbers. Automated logic checks only; real browser/iPad visual verification remains outstanding.


## Authoritative snapshot - REACTOR ROGUE v0.3, 31 October 2026

The game has been renamed REACTOR ROGUE. Use REACTOR-ROGUE.html alongside this file. Earlier NEON SWARM names, packaging instructions and files describe the historical builds. This snapshot incorporates all prior changes, including damage numbers, enemy ships/armour, six ship mobility abilities and the new animated vector menu branding.

### v0.3 gameplay and Hangar
- Five enemy roles: flanking Interceptor, ranged Rail Frigate with a 1.1 second aim warning, Shield Carrier granting nearby non-boss allies 20 percentage points of extra mitigation, Mine Layer dropping visibly arming hazards, Repair Drone restoring nearby damaged non-boss ships. Ships retain physical knockback and freeze/slow behaviour. Stationary rail turrets occur in Storm Relay.
- Four 40-second encounter phases: Patrol, Swarm Rush, Specialist Squad, Recovery Window. Spawn cadence changes; recovery suppresses new specialist spawns. Boss fights reduce regular spawn cadence and suspend new sector hazards/specialist spawning.
- Level 3 Siege Cannon, Needle Repeater and Energy Shield each trigger a paused two-choice specialisation. No slot or extra XP consumed. Cannon: Siege Bloom (+50% radius, -10% damage) or Bunker Breaker (ignores 60% of armour). Repeater: Needle Fan (+2 shots, -30% each) or Rail Conversion (one shot, +50% damage, +3 penetration, 30% longer cycle). Shield: Deep Capacitor (+40% capacity) or Rapid Recovery (60% faster, 4s delay). Supports existing evolutions and per-run reset; queued XP survives.
- Upgrade cards show damage or support-stat comparisons. Weapon damage values are before critical hits and enemy protection. Values include active damage bonuses, relevant specialisations and direct evolution damage modifiers.
- Hangar accessible from main menu, pause and results. Contracts, Loadout and Sectors tabs. All existing ships/weapons remain available.
- Salvage per run: floor(kills/25) + 10 per boss + 8 per breach + floor(game seconds/60). Granted on record/save at completion, return or restart, using a per-run delta checkpoint. Endless continuation cannot duplicate awards. Contracts give additional one-time salvage.
- Seven contracts: first boss unlocks Shattered Belt; 3 cumulative breaches unlock Reinforced frame blueprint; 5 distinct discovered evolutions unlock Survey Array blueprint; Glacier victory unlocks Aurora paint; boss killed with starter unevolved unlocks Hot Reactor blueprint; 500 cumulative kills unlock Interceptor frame blueprint; any victory unlocks Storm Relay and Solar paint.
- Hull frames cost 30 salvage each: Interceptor gives +12% speed / -12% HP; Reinforced gives +20 HP / -10% speed. Modules cost 25 each and occupy one dedicated Hangar slot: Survey Array +15 percentage points gem XP / -8% speed; Hot Reactor +10% damage / -10 HP. Equipment is selectable, original loadout remains free. Frames have visible extra fins/plates. Paints change pilot accent colour. Selections apply next run.
- Three sectors: original Neon Expanse (no added environment hazard); Shattered Belt (warned drifting asteroid lanes); Storm Relay (warned electrical zones and occasional stationary defence turrets). Hazards cap at 24, pause with gameplay and clear on boss defeat. Decorative rendering respects reduced motion.
- New browser key rr_hangar; old keys remain untouched. Storage failure falls back to session progress. Run records retain sector/frame/module/specialisations, with validation for old saves.

### Verification
Passed JavaScript syntax and full standalone-script mocked-runtime boot/start/render tests, all specialisation prompts and queued XP, enemy role behaviours, damage mitigation/penetration, Hangar reload, seven contracts, no repeated reward credit, loadout application, three-sector hazards/object caps, six-pilot max-evolved builds, blocked storage, and Canvas transform balance. Mocked rendering also exercised desktop/mobile menu scenes and reduced-motion static paths in prior updates.
Actual browser testing remains unverified: Playwright was present but no browser binary; installing Chromium failed because the downloaded archive was invalid/truncated. Do not describe these tests as hands-on browser playtests. Physical iPad testing, visual layout inspection, audio listening and balance tuning remain needed.

### Helpers
mobility / updateMobility / dash; addDamageNumber / enemyDamage / drawEnemyShip; rrEmblem / drawMenuScene; sectors / frames / modules / contracts / hangar / commitHangar / initExpansion / openHangar / renderHangar; specialisations / offerSpecialisation / chooseSpecialisation / upgradeComparison / applyProjectileSpec; encounter / roleInfo / spawnSpecial / specialistHeading / specialistAttack / updateExpansion / drawExpansion / drawSpecialist.


## v0.4 - Ten weapons, ten evolutions, sector art and recipe UI

Source of truth is now GitHub jambig1/reactor-rogue, index.html. GitHub Pages publishes main/root automatically at https://jambig1.github.io/reactor-rogue/. User authorised publishing future requested game updates automatically. The GitHub connector has read access but returned 403 on writes during setup; browser upload was authorised and used. Recheck current repository before editing. No credentials belong in source or handover.

Neon Expanse's drawArena is preserved byte-for-byte. Only belt/storm select drawSectorArena: fractured amber grid, dim station hulks and parallax asteroid silhouettes for Shattered Belt; violet angled circuitry, relay towers, power pulses and electrical motes for Storm Relay. These structures are decorative; existing gameplay hazards stay outlined. Reduced motion stops decorative drift/pulses.

The arsenal is now 26 weapons, each with an evolution. Ten new IDs and recipes:
- harpoon, Ion Harpoon + Targeting Array → Thunderhook: two simultaneous tethers and an extra electric branch.
- ember, Ember Wake + Thrusters → Solar Slipstream: longer/wider burning trails, twin trails while using mobility. Trail ignites toxic gas.
- prism, Prism Satellites + Size Matrix → Prismatic Array: four double-firing satellites and three Pulse Laser refractions.
- scrap, Scrapstorm + Armour Plating → Junkstar Barrage: explosion-charged shards split once into three children. Guards prevent recursive splitting.
- buoy, Tesla Buoys + Point Defence → Storm Bastions: up to five long-lived, multi-target towers that intercept shots.
- saw, Saw Drones + Kinetic Drive → Razor Squadron: faster, stronger penetrating saws return to the pilot.
- mortar, Orbital Mortar + Power Amplifier → Meteor Battery: three delayed marked explosions.
- nanite, Nanite Swarm + Regeneration → Grey Tide: infection casualties spread once and heal a small amount. Spread infections do not cascade.
- phaseTorp, Phase Torpedoes + Phase Safeguard → Rift Torpedoes: armour-piercing projectiles leave pulsing slow/damage rifts.
- sonic, Sonic Pulse + Repulsion Field → Resonance Engine: second delayed, stronger slowing shockwave.

Normal six weapon/six support slots and five-level caps remain. All original sixteen evolutions retained. New weapons are automatic acquired weapons; original manual-starter rules are unchanged. New sound dispatch uses existing procedural cues and dedicated evolved profiles. New effects live in s.arsenal and reset with a run. Bounds: tethers 2, wakes 50, buoys 5, strikes 18, infections 80, rifts 12, pulses 12; projectiles retain the shared 250 cap.

Ten displayed weapon combinations: Harpoon/Chain branches; Ember/Toxic ignition; Prism/Laser refraction; Scrap/Cannon explosion charging; Saw/Frost bonus frozen damage; Nanite/Gravity boosted infection; Mortar/Frost boosted frozen damage; Phase Torpedoes/Gravity impact pull; Sonic/Mines outward mine deployment and accelerated arming; Buoys/Shield recharge on successful zaps. Some underlying physical interactions (e.g. explosion charging) also work with other compatible sources.

Evolutions tab defaults to My build, with Ready to evolve and All 26 recipes filters. Cards show equipped weapon level/progress, owned or missing support, evolved status, readiness and explicit next action. Support-slot and banishment blockers are explained. Combinations show active/missing partner; upgrades flag combinations with equipped items. Existing requirements remain weapon level 5, support level 1+, then elite cache.

Automated verification: full-script mocked boot/start/render; every new weapon deals damage at base/evolved levels; all ten cache recipes claim correctly; original systems, specialisations, Hangar, storage failure and progression regression checks; all-sector rendering paths at mobile/tablet/desktop sizes; recipe status/filter checks; Junkstar charge/child guard; original arena renderer equality. Combined evolved build tested with bounded effect arrays. These are mocked checks, not visual/performance guarantees. Hosted browser menu/launch/pause/Hangar smoke checks were completed for v0.3; v0.4 visual results should be recorded after deployment. Physical iPad and long-run balance remain user playtest tasks.

Hosted v0.4 checks: deployment succeeded; live menu reports 26 weapons; launch and pause operate; My build explicitly shows Neon Bolts 1/5 and missing Overclock; All 26 recipes displays original and new evolutions and combinations. Desktop screenshot inspected. Return-flight steering now overrides homing for evolved saws. Actual locked-sector playthroughs and physical iPad validation remain unverified.


## v0.7.2 salvage update
- Source research: https://vampire-survivors.fandom.com/wiki/Light_source and https://vampire.survivors.wiki/w/Pickups (checked 1 Nov 2026). Community-maintained documentation, not an official universal drop percentage; stage restrictions and content-specific drops exist.
- Classic baseline: one destructible spawn attempt/second, Mad Forest 10% base, Luck cap 50%, 10 active light sources. Applied to salvage crates in all three sectors; existing asteroid/fuel visuals unchanged. Break a crate for one drop unless ground cap64 is reached. Asteroids retain XP and a reduced 2.5% salvage chance; fragments give no supplies.
- Weights/level gates: coin50/L0, bundle10/L0, rich1/L5, repair12/L0, freeze2/L4, purge1/L8, vacuum2/L12, flame1/L0, clover0.5/L0, reroll1/L0, fever1/L30, surge0.02/L30. Normalise eligible weights, selectively multiply rare utility/healing weights by Luck; currency chip/bundle, clover, reroll, surge do not scale. Level30 denominator81.52 at baseline Luck.
- Reactor Rogue adaptations: credits1/5/25, repairs30HP, Chrono10s/boss2s and freezes bullets; Purge kills visible non-boss ships with normal XP/accounting; Vacuum draws gems only. Flame10s aimed cone, 24 damage per0.2s. Fortune+10% run Luck without support slot; reroll+1 current-run use (shop ranks unchanged). Fever10s, +1 per5 kills capped20, pulls ground currency. Ultra-rare Surge14s invulnerability, 4x fire cadence, 50 kills yields one cache otherwise5 credits. These are themed equivalents; specialised DLC/evolved/co-op pickups are not copied.
- initSalvage state is run-only; salvage credits flow through existing checkpoint delta banking and Scavenger bonus. Save schema and prices unchanged. Ordinary enemies now only give their existing guaranteed XP, with elite utility chances4% and elite/boss20%, multiplied by Luck capped50%. Existing seven utility/passive types remain in elite rewards.
- Supplies persist120s; old special elite utilities60s, caches120s. Ground and crate populations bounded. New boosts exposed in existing HUD, all pickup icons use existing reduced-motion-friendly renderer.
- Validation: test-drops072.cjs checks300,000 weighted rolls, level/Luck gates, healing, gem-only vacuum, credits/checkpoint dedup, effects/boss resistance, surge rewards, crate/drop caps and lifetimes. Existing v0.7/menu/v0.5/v0.4 regression suites pass. Browser/device and full-run balance evidence is recorded separately below when available.

Full simulated runs (seed12345, normal HP/XP/loot/upgrades, automated movement/aim; not human balance evidence): Vanguard victory753s, level61, 246 credits, three bosses. Scavenger victory682s, level62, 327 credits, three bosses. Bot follows gems rather than prioritising crates. The new currency increases earnings; prices are intentionally unchanged and need human-run economy feedback. Chrono-frozen contact cannot harm the pilot while the pickup is active. No physical iPhone/iPad test.


## v0.7.3 - cinematic pickup waves (supersedes v0.7.2 Purge immunity)
User requested a rippling honeycomb space shockwave which destroys all enemies, plus a cooler freeze effect. `launchPickupWave`, `updatePickupWaves`, `drawPickupWaves`, `drawFrozenHull` implement Canvas-native effects, not external bitmap assets.
- Purge snapshots all visible living ships, including bosses and arrival ships, and resolves their normal hit/death path as the front reaches their activation distance. Arrival protection is intentionally removed for this pickup. Offscreen/future enemies are not targeted. Boss credit, XP, caches, mutations and victory remain on the normal path. Huge overkill numerals and pickup critical chains are suppressed. Pending upgrade/reward menus wait until the target snapshot is cleared.
- Three trailing rings, a flattened disc, warm/cold hexagon fronts and bounded hull shards. Up to4 active waves and210 shards. Replacing an oldest wave resolves any outstanding kills first, so spam cannot lose rewards. FX live outside the generic150-effect cap. Hex draw work is viewport-clipped and capped850 cells per wave.
- Chrono keeps its v0.7.2 mechanics (10s, bosses2s) with a blue pulse and hull-anchored translucent ice facets, cracks and six spikes; this treatment also applies to weapon freezes. Synthesised bass-pressure and ice cues honour sound settings. Reduced motion retains static fading rings/honeycomb and ice plates, with no expansion, shimmer, shake or shards.
- Automated test-drops073.cjs covers weighted drops plus travelling kills, visible boss kills, offscreen exclusion, duplicate death, bounds, cleanup and both motion modes. Actual Canvas2D renderer produced a paired24-frame animation preview. Existing v0.7/menu/v0.5 regressions pass. No physical iPhone/iPad testing.


## v0.7.4 - combat explosion visuals
`combatExplosion`, `updateCombatExplosions`, `drawCombatExplosions` add visual-only detonations to normal enemy/boss deaths, non-fragment debris, gasBlast impacts and chainBlastFX. Purge retains its separate honeycomb/shard treatment. No new random draws: shard direction/speed/life use deterministic geometry and positions, preserving combat/drop RNG.
- Radius26 for basic ships,48 for strong ships,80 for elites,160 for bosses; impact sizes clamped15–190. Durations0.48/0.8/1.1s. Frozen kills use icy colour/core rather than warm fire.
- Up to48 blasts and180 shards; merge same-frame overlapping blasts, allowing a larger boss blast to replace a small impact. Viewport culling, local bloom instead of extra fullscreen flashes, and compact normal ship bursts protect readability. Existing smoke/scorch pools remain bounded18/48.
- Rendering: radial reactor bloom, short white-hot centre, two pressure rings, fragmented arcs, radial streaks, flattened disc on larger blasts, glowing hull chips and fading embers. Reduced motion has static fading cores/rings, with no moving shards, streaks or expanding geometry. Existing screen shake settings are unchanged.
- Verified via test-explosions074.cjs: no RNG or combat accounting changes, caps/cleanup, merge promotion, duplicate deaths, icy shatter, balanced Canvas state in both motion modes. Actual Canvas2D renderer generated25 animation frames. Existing v0.7.3 drop/wave, v0.7, menu and v0.5 checks pass. No physical mobile hardware test.

Small ship destruction now uses a short synthesised pop; boss death uses a low reactor detonation. Both honour existing audio volume/mute/debounce behaviour. No additional fullscreen flash or shake was introduced.


## v0.8 - graphics controls and adaptive quality
- Added Settings → Graphics & Effects with native labelled selects and a scrollable two-column label/control layout. Existing horizontal tab navigation, parent restoration and touch scrolling remain. Preferences use the independent `ns_graphics` key, validated through an allow-list. Invalid JSON/fields safely default; blocked storage is session-only. Reset affects graphics only.
- Presets: Low = no blur/particles/smoke/shake/flash, simple explosions, combined numbers,75% playfield resolution; Medium = capped3px glow,25% particles, reduced smoke, detailed explosions, combined numbers, low shake/reduced flashes,100%; High = original full effects, individual numbers,100%. Custom retains explicitly chosen effective settings. Changing FPS limit, FPS counter or motion does not disable Auto. Manual visual changes capture the active preset then switch to Custom.
- Auto starts Medium, lowers after two consecutive2s slow windows (>125% target frame interval), recovers after nine consecutive2s headroom windows (within112% target and JS cost<35% budget). Ceiling Medium prioritises performance; High remains manual. It ignores paused/menu/background frames. Effective choices and current tier appear in Settings. No enemy count or damage/difficulty changes.
- All Canvas shadowBlur assignments use the small `graphicsShadow` helper (Off0, Low capped3px, High original). No rendering proxy. Particles, hull shards and engine trails are capped/trimmed by preference. Cosmetic particle RNG is now separate from gameplay RNG; render shake also uses deterministic visual noise, so quality/FPS choices do not consume combat/drop random rolls.
- Smoke Off uses clear simple toxic/burning footprint circles; decorative smoke is skipped. Critical enemy outlines, projectiles, boss warnings, hazards, freeze outlines and pickup markers remain in every mode. Simple purge retains its travelling kills and ring; only detailed mesh/disc/shards are omitted. Reduced motion follows device by default with explicit On/Off overrides; it also suppresses shake/flashes and CSS decoration.
- Resolution50/75/100% multiplies the existing capped DPR, with logical W/H and input coordinates unchanged. Menus/HUD/FPS are DOM and stay sharp; in-world Canvas graphics including combat text scale with the playfield.
- FPS limit schedules only drawing, using a deadline to avoid under-running60FPS on144Hz monitors. Simulation/audio still update on each requestAnimationFrame and retain existing simulation timing/substeps. Counter reports rendered frames every2s. 30/60/display scheduling tested against60/120/144Hz synthetic callbacks, including equal simulated elapsed time.
- test-graphics08.cjs covers presets, Custom, persistence/reload/reset, corrupt/blocked storage, OS motion, auto hysteresis/manual locks, budgets, separate visual RNG, equal hit damage, number modes, frame pacing and all render modes. Existing combat/progression/menu suites pass; legacy full-particle effect tests explicitly select High. Native Canvas heavy-scene comparisons are diagnostic CPU raster measurements, not browser/device FPS. No physical iPhone/iPad test.


## v0.8.1 - contextual upgrade combinations
Expanded upgradeSynergy into a compact per-card hint renderer for all26 evolutions and10 weapon combinations. It checks actual s.items ownership of either component; an offered but unowned item does not count as ownership. It displays both names, owned/missing marks, weapon level/5 and ready-cache/evolved/active-combo/completes-combo status. Shared passives show only relevant recipes with an owned part. Unknown/recovery options have no hint. Stats remain ahead of hints; the fixed mobile card grid is retained. No recipes, slot rules or gameplay values changed.


## v0.8.2 - clean per-run upgrade hints
Ownership/evolved state was already reinitialised by start(), and upgradeSynergy reads s.items rather than persistent data. start() now also clears the global choices array and #choices markup explicitly, removing stale cards/hints immediately at the new-run boundary. Cross-run regression covers restart, different pilots and persistent archive/Hangar evolution history; starter-owned recipes correctly remain visible.

## v0.8.3
Only the missing second component card shows contextual evolution/synergy hints. Already-equipped cards return no hint, including completed/evolved pairs. Current-run ownership and start resets remain authoritative.

## v0.9.0 - priority enemy ships
Existing shield carriers gain a distinct wing silhouette. Hunters lock a 0.95s warning lane before a 0.5s charge; volatile ships leave a 0.45s enemy-only chain blast; fighter carriers warn for 1.2s before launching two fighters (six alive and twelve total per carrier). Introductions at 50/80/105/145 seconds, using the existing specialist spawn budget. Caps: 12 specialists, two shield/fighter carriers each, four other specialists per role, 240 total ships, 24 queued chain blasts. Freeze pauses abilities; carrier protection retains existing 20% reduction, damage numbers use actual mitigated damage, chain damage is attributed to the triggering weapon. No new cache farming or permanent progression. Contextual hints remain missing-component-only and reset each run.

Validation: role-specific warning/freeze/charge tests, shield mitigation/removal, delayed two-ship chains and weapon attribution, purge suppression, reinforcement lifetime/active caps, 240-ship simulation and native Canvas2D rendering passed. Existing menu, contextual-hint, graphics, pickup and explosion suites checked. Visual QA uses a staged native Canvas2D scene; device FPS has not been measured for this update. Distress signals remain deferred.

## v0.10.0 - roadmap step 1: optional distress signals

The ten-step plan is saved in ROADMAP.md. Only step 1 is implemented. Step 2 is next; do not start it automatically.

Signals extend the existing s.breach slot and breachSelect/breachReward surfaces. initDistress resets the deck, sequence, choices, run log and three separate distress metrics. First opportunity is at 75 game seconds; shuffled rescue/defend/reactor opportunities precede an original breach, then repeat in endless. Unanswered signals last 55s, with a 75s wait after expiry/dismissal; accepted objectives use a 100s wait after completion/failure. One encounter/pending reward at a time. Classic breach settings and unlock accounting are retained.

Rescue: board within 65 units for 3s, then reach a gate 240 units from the ship within a total 50s. Freighter: 120 hull, 22s defence inside radius 130, total limit 55s; marked raiders pursue it, dealing 6 hull damage per 0.85s at contact. Hostile shots hitting the hull deal at most 8 damage and are consumed. Freeze stops raider hull damage. Reactor: weapon-targetable stationary structure, 35s timer, HP 180 + min(700, level*22 + time*0.35). All regular weapon targeting includes it, including blade contact; it is immune to knockback and gravity movement. Its damage counts towards the triggering weapon but it awards no enemy kill, gem, crate or cache. Purge excludes the structure. Failure seals the reactor with a visual blast; there is no player damage penalty.

Bosses hold all signal clocks and objective damage. The reactor target is temporarily removed from enemy targeting during bosses and restored when there is capacity. Accepted signals may be abandoned; failures lose the reward and do not end the run. Freighter attackers switch back to targeting the player after completion/failure. Extra ships are bounded to 12 per encounter, within the existing 240 list cap, and have 1s arrival warnings and at least 120 units of spawn separation from the pilot. Cosmetic signal effects use existing graphics/reduced-motion controls.

Success: 20 XP, 300 flat score, and a single reward choice. Equipment uses pool() (slot, banish and max-level restrictions); absent eligible equipment falls back to 40 XP. Supplies offer 45 HP repair, or one reroll when hull is full. Payment is 25 salvage credits through addSalvageCredits, using existing Scavenger bonus/banking checkpoint logic. Separate distress counters appear in Pause/results and snapshots; they do not count towards old breach contracts or ship unlocks. Completion/reward/banking guards prevent duplicate payouts.

UI: reuse one compact objective HUD at the screen edge with direction, timer, progress and optional dismissal. Briefing pauses combat and explicitly explains the task and reward. Accept is key 1/tap, review is E/tap, Escape leaves the briefing. Reward is keys 1–3/tap. Cards use scoped compact flex layouts; phone cards stack and panels scroll. No new permanent HUD cluster.

Validation: TEST-DISTRESS.cjs covers scheduling/deck, proximity, opt-in/ignore/dismiss, staged rescue, freighter hull/cooldown/freeze/hostile shots, weapon/blade reactor damage and stationary behaviour, purge exclusion, full-slot/banish fallbacks, rewards and credit-bank deduplication, all boss holds/resume, timeout/abandonment, resets, extra-spawn budgets and legacy breaches. Native Canvas2D scenes checked for all three kinds, Low quality and reduced motion. Full simulation also completes each signal with normal automatic attacks, and checks crowded limits plus phone/tablet/desktop render paths. Existing menu, hint, specialist, graphics and pickup suites pass. Browser smoke and deployment verification are required before reporting live. Real-device iPhone/iPad FPS is not measured by the Node harness.

## v0.11.0 - roadmap step 2: eight more branching weapons

Only step 2 is implemented here; ROADMAP.md marks step 3 as next. specialisations now has 11 keys: original Cannon, Repeater and Shield plus Bolt, Scatter, Frost, Chain, Toxic, Gravity, Nova and Laser. Each offers two choices at item level 3 through the existing paused specialisation surface. initExpansion resets s.spec and the bounded s.specEchoes queue; start also clears pendingSpec and old choice markup. Existing run snapshots already store specialisations; labels read both live spec and recorded specialisations. There is no persistent damage upgrade or save migration.

Paths:
- Prism Fan: +2 bolts, wider 0.25-radian spacing, x0.7 damage. Lance Array: +2 penetration, x1.2 damage and x1.2 cycle time.
- Focused Choke: 0.055-radian pellet spacing, x1.25 damage, x1.3 cycle time. Deck Sweeper: +3 pellets, 0.2-radian spacing, x0.75 damage.
- Cryostasis: +0.2 freeze probability, +0.5s freeze (including evolved Deep Freeze), x0.75 damage. Ice Javelins: replace automatic radial ring with a three-shot forward fan, +2 penetration, x1.5 damage. Manual starter fire still requires player input.
- Storm Network: +2 targets and x1.5 hop range, x0.75 strike damage. Arc Anchor: up to three strikes on one locked target at x0.55 each, stops if it dies; no retargeting. Evolved critical storms retain their original behaviour.
- Miasma Wake: cloud origin at the ship, x1.5 radius and x0.75 tick damage. Caustic Pools: target-centred, x0.5 radius and x1.5 tick damage. Evolved death-cloud radius/tick modifiers persist; gas ignition damage is an independent existing effect.
- Tidal Net: x1.25 radius, pull 105 rather than 70, x0.75 tick damage. Collapse Charge: x0.5 duration, x0.75 ticks, expiry detonation even before evolution; evolved expiry blasts x1.35 damage. Per-field snapshots prevent old fields changing on selection. Singularity-generated fields retain their old behaviour.
- Event Horizon: x1.4 radius, x0.75 damage. Twin Pulse: two x0.65 pulses, second after 0.35 game seconds at the ship's current position. Both retain evolved reflection and shield logic. Queue capped at 6; simulation timing is independent of drawing and reduced motion.
- Floodlight: primary beam and evolved trail x2 width, x0.65 damage. Armour Cutter: x0.65 width, x1.2 damage, ignores 60% of armour for direct beam and evolved trail. Both credit Laser statistics correctly. Prism sentry refractions remain independent Prism damage.

Projectile effects are applied once before evolution; copied Photon Echo projectiles retain the applied flags and do not multiply again. previewDamage shares specDamageMult for the eight new paths. Upgrade cards show compact path labels or level-3 availability, Pause shows weapon/path/effect descriptions, and reports show the chosen path. Existing Cannon/Repeater preview and projectile modifiers remain separate and unchanged. Specialisation card CSS overrides the old global grid to use compact flex text, stacked below 650px, inside a scrollable 88dvh panel.

Validation: TEST-SPECIALISATIONS.cjs covers every level gate/choice, 16 new path behaviours, evolved projectiles, one-time application, count/penetration/cones, actual damage versus previews, frozen duration, chain range/target lock, poison placement and ticks, early gravity collapse, double-nova delay/reflection, laser armour/trail ownership, card/Pause/history labels, 240-ship loops and reset. Native Canvas2D checked representative frost, toxic, gravity, nova and laser states at Medium, Low and reduced motion. Menu, contextual-hint, graphics and weighted-pickup regressions pass. TEST-DISTRESS fixture now selects paths explicitly when testing mission completion, since level-3 weapons correctly open new branch menus. This is initial numerical tuning, not a claim that every path has identical effectiveness; real-device FPS and long-term win-rate balance still need play feedback. Verify browser launch/manual and Pages deployment before reporting live.

## v0.12.0 - step 2 extension: ten weapons, eight supports

ROADMAP.md retains the agreed order; step 3 remains next. The added arsenal is a bounded subsystem in s.newArsenal with fences (8), charges (8), delayed seeds (32), nets (5) and one decoy. initNewArsenal resets this and s.defence (plate charges, recharge clock, reactive-screen timer/cooldown and fractional pickup credits) on every run. extraWeaponIds includes the new rows so the base attack loop excludes them; attackExtra delegates once to attackNewWeapons and skips them in its legacy loop. New projectile modifiers are already captured at emission and excluded from applyProjectileSpec to prevent multiplication twice. All new hits use weapon IDs, so armour, actual-damage numbers, traits and per-weapon statistics remain shared.

Weapon / matching support / evolution:
- Rail Lance / Guidance Chip / Parallax Lance: penetrating forward beam; evolved pairs each deal 70% damage. Needle Rail trades width for x1.3 damage and 60% armour bypass; Rail Fan fires three x0.75 angled beams.
- Flak Battery / Size Matrix / Supernova Flak: proximity burst (70% payload), direct contact (30%) and radial fragments (35% each). Six fragments, ten evolved. Fragment Fuse adds four at x0.8 payload; Demolition Slug uses x1.8 payload, a smaller burst and no fragments. Burst flag prevents duplicate fragmentation; spent shells cannot revive through ricochet.
- Crescent Blades / Kinetic Drive / Lunar Reapers: paired returning piercing projectiles, three evolved with +4 penetration and x1.3 damage. Lunar Spread adds one at x0.75 damage; Quick Return has 40% faster outward speed and 60% outward range. Return flights reset seen targets using the existing return system.
- Plasma Fences / Field Capacitor / Fusion Grid: planted damage wires, two crossed wires and 50% longer life when evolved. Perimeter Wire is wider/longer at x0.7 ticks; Cutting Wire is thin at x1.4 ticks with a 20% longer cycle.
- Leech Beam / Salvage Medics / Sanguine Circuit: drain one ship, two evolved, for limited healing per cycle. Recovery Siphon doubles healing at x0.65 damage; Predatory Siphon uses x1.4 damage with no healing. Structures never supply healing.
- Cryo Charges / Lucky Circuit / Absolute Zero: planted proximity blasts, 0.75s arming, 1.2s freeze; evolved radius 120 and 2.5s freeze. Boss freeze is x0.4. Snap Freeze arms in 0.15s; Deep Charges take 1.4s, with 60% longer freezes at x0.8 damage.
- Kinetic Ram / Ablative Plates / Titan Drive: forward cone with knockback; evolved has more reach and x1.3 damage. Sweeping Ram widens at x0.7; Piercing Ram narrows at x1.4 and bypasses 60% armour.
- Solar Sails / Power Amplifier / Helios Wings: two flank beams, four directions evolved. Solar Wheel rotates independently at x0.8 damage; Long Wings gains 40% reach with 30% longer cycle.
- Void Seeds / Regeneration / Black Bloom: homing contact damage (20% payload) plants a timed blast; evolved adds a single secondary half-strength bloom. Spreading Seeds gains 40% radius, x0.8 damage and 1.6s fuse; Quick Bloom is 0.35s with 30% less radius. Secondary blooms do not reproduce.
- Stasis Net / Reactive Screen / Event Lock: planted slow/tick/interception field. Two interceptions, five evolved, with evolved radius +25%. Barrier Net adds four blocks at x0.75 radius/x0.7 damage; Predator Net gains x1.4 ticks and forfeits interception. Shot life is cleared before normal hostile collision handling.

New defensive supports (five levels, ordinary support slots): Ablative Plates hold min(3, level) charges, absorb 8+4*level damage per consumed plate (can fully absorb), recharge one every 15s; new levels replenish added capacity. Reactive Screen grants 20% reduction after a hit for 1+0.4*level seconds, activation cooldown 8s; it does not reduce the triggering hit. Decoy Beacon leaves one 2+0.6*level second decoy on successful ship ability activation, attracting type-0/1 ships within 220+20*level range. Specialists, bosses and active freighter attackers retain their goals. Salvage Medics heal 0.5+0.5*level HP per currency pickup, not mission/fever payments.

New passive supports: Supply Tractor pulls ground supplies/credits within 90+30*level range (no XP; full-slot passive drops are excluded). Guidance Chip adds 5% projectile speed and 15% homing steering per level, including homing/return target speeds. Field Capacitor adds 10% planted Toxic/Gravity/Fence/Net duration per level, captured when spawned. Salvage Appraiser adds 10% currency-pickup value per level; fractional bonuses accumulate in s.defence.creditFraction and reset on restart. Integer credits flow through addSalvageCredits and existing Scavenger/banking rules; mission rewards do not receive an appraisal multiplier.

Ten contextual synergies are registered with actual effects: rail/seed + gravity damage, flak gas ignition, crescent frozen damage, fence slowed damage with net, leech infected damage, cryo/mortar freeze and blast interaction, ram/sonic knockback, sails/prism refraction, net/buoy lifetime extension (capped 12s remaining). Missing-component-only hint gating and all 36 evolution recipes use the shared functions. Existing six weapon/six support limits, rarity/banish/max-level rules and save migration are unchanged.

Validation: TEST-ARSENAL.cjs covers all new casts/paths and cache evolutions, damage previews, returning projectiles, flak deduplication, fences, healing exclusions, freezing, cone hits, side beams, finite seed echoes, net interception budgets, plates/recharge/full absorption, reactive timers, decoy goals, appraisal fractional arithmetic, repair and credit-bank dedup, tractor, duration/speed snapshots, slot and banish limits, synergy multipliers and six-weapon 240-ship stress loops/reset. Native Canvas2D rendered all ten evolved weapons at Medium, Low and reduced motion. Existing menus, contextual hints, distress, specialisations, graphics and salvage regressions pass. Initial numbers require normal play feedback; no physical iPhone/iPad FPS claim is made. Verify Pages/live launch before reporting deployment complete.

## v0.13.0 - roadmap step 3: interactive sector features

Step 3 is implemented; step 4 remains next in ROADMAP.md. Arena background renderers are unchanged. New world-space s.terrain objects are drawn separately and reset by initTerrain. Array cap 12, off-screen cleanup at 1.8 viewport diagonals +500 world units; cover formations cost three slots. First feature at 18s, then a 40s opportunity clock; failed placement advances the cycle without forcing overlaps. Safe spawns avoid current optional objectives and nearby features. Normal-run spawn budgets: three stations, four salvage pockets, five conduits. Endless removes these lifetime reward budgets while retaining active-object caps. Spent objects clean up after short visual remnants; unused landmarks remain until the pilot leaves their region. Objective spawning clears overlapping cover so rescue/defence/breach zones remain accessible.

Grid cycle: station, cover, salvage. Belt: cover, salvage, station. Storm: conduit, current, station. Cover is styled as cargo in the first sector and asteroids in the belt; sectors retain their prior colours and backgrounds. Cover pieces have radius 32 / 220 HP, stationary collision and no kill/XP rewards. Physical friendly/hostile shots stop on cover and damage it; hostile collision uses swept segment distance before player collision. Friendly sweep checks precede actors, consume penetration and prevent ricochet through the rock. Beam/area effects retain their old enemy targeting and pass through cover. Dash collision deals 35 cover damage (70 Bastion), limited by 0.4s per-piece cooldown; phase bypasses solids. Normal enemy headings steer around close obstacles, collision resolution prevents overlap, bosses/objective structures are excluded, and hunters stop dashing when they hit cover.

Stations: approach within 85 units, press F/tap contextual Dock, then remain nearby for 4 game seconds during combat. Docking resets input on entry; moving out cancels progress. Completion repairs 45 HP and consumes one charge. Full hull preserves charge, including if regeneration restores hull during docking. The one transient button is normally hidden, safe-area-aware, and hidden with all menu screens. F is only handled during play without Ctrl/Meta/Alt; E remains reserved for reactor breaches/distress signals.

Salvage: radius 100 field applies x0.8 movement speed to the pilot and non-boss/non-objective ships. Three one-use 5-credit pods, collected within 24 units; Supply Tractor pulls them at its normal range using the shared pull helper. Pods are marked used before collectDrop({id:'coinBag'}), so medics/appraiser/Scavenger and credit checkpoints remain shared, without duplicate pickups. Exhausted pockets cease slowing flight and fade.

Conduits: 120 HP, can be shot or activated with F within 90 units. Priming creates a 1.4s radius-150 warning. Discharge marks it spent before dealing 180 enemy damage/slowing and 22 player damage through normal hurtPlayer (armour, plates, shields, invulnerability apply). No direct credit reward; enemy kills retain normal accounting. Boss encounters prevent charging and hold active warnings. Currents have radius 115, push the pilot 45 units/s and eligible normal enemies 30 units/s in the marked direction. Frozen enemies, bosses and objective structures are excluded.

Bosses pause feature creation, docking clocks, pod collection, conduit countdowns and current forces; cover remains active. Resume is from the saved progress. Generic pause/upgrade/reward menus stop the simulation as before. No new permanent HUD cluster, scene transition or purchased currency type. Terrain objects/budgets/docking state are per-run only.

Validation: TEST-TERRAIN.cjs checks sector order and initial timing; swept hostile and piercing/ricocheting friendly collision; cover durability/no kill farming; pilot overlap/phase/hunter interactions; repair opt-in, leaving, one-use/full-hull guards and boss holds; salvage slow/tractor/appraisal/healing/banking; conduit warnings, boss hold and bilateral damage; current direction/freeze/boss behaviour; budgets/object cap/objective clearance/reset; crowded three-sector and phone/tablet/landscape render paths. Native Canvas2D scenes checked belt/storm/grid and Low/reduced-motion readability. Existing menu, distress, arsenal, specialisation, graphics and salvage tests pass. These are simulation/render checks, not physical iPhone/iPad FPS or long-term balance evidence. Verify Pages deployment and browser launch/help before reporting live.

## v0.13.1 - requested crowding/performance pass before step 4

Diagnosis on v0.13.0: yellow HP was (650 + 10*t)*(1 + t/180), plus 35% armour. A newly spawned 5-minute elite had ~9,733 HP / ~14,974 effective HP without cover. Elite spawning had no class limit or total-population guard. Ordinary purple brutes used a 12% regular-arrival roll but no class quota. A normal scripted seed-12345 replay at minutes 4–5 had a sampled purple peak of 11 and a killed yellow lifetime of 95.5s. Two protected replays isolated buildup and had yellow lifetimes of 115.8s and 83.9s; they are not win-rate evidence.

Balance: spawn(type, specialist=false) now returns the spawned object or null and respects 240 list entries. Ordinary brute cap 8 alive (excludes roles/bosses), overflow becomes equally likely type-0/1 ships. Yellow cap 2 alive, health 650 + 7*t, unchanged armour/damage/XP/cache. spawnSpecial passes the explicit specialist flag and uses the returned reference, so it cannot mutate an unrelated last enemy on failure. Due elite arrivals retry in 5 seconds if blocked; successful arrivals schedule t+60 instead of accumulating missed intervals. No existing enemy is silently despawned. Boss creation/stats and original specialist quotas are unchanged.

Rendering: updateGraphicsCrowd runs once per draw, with no gameplay RNG. Auto activates at >=20 visible ships, >=6 visible frozen ships, >=80 friendly projectiles, >=40 hostile shots, or >=12 combat blasts. Relief sets effective shadow blur to zero and uses a simple icy outline/crack rather than the multi-facet hull. It holds for 3 game seconds, releasing only below 14 visible / 3 frozen / 40 friendly / 20 hostile / 6 blast thresholds. It stays effective behind paused/reward menus rather than re-enabling expensive glow on the same backdrop. New runs/settings reset the transient flag. Manual quality presets do not use the crowd override; Low already has glow off and now also uses simpler ice.

Auto now downshifts after a measured render-cost sample >65% of its frame budget, or after the original two slow-interval samples. Recovery still needs nine good samples and no active crowd relief. Damage numbers retain the chosen mode (Auto remains Combined), as do attack warnings, collision geometry and terrain boundaries. Changes are visual only; update cadence, controls, damage and RNG are unaffected by quality.

Before/after replay: same scripts/seeds/pick policy, builds can diverge as drops/XP change. Normal seed 12345 yellow lifetime 95.5→46.0s, sampled purple peak 11→7, total sampled peak 35→28. Protected seeds produced yellow lifetimes 44.7s / 40.3s and brute peaks <=8. Simulation mean did not improve consistently in the normal replay (~0.53→0.56ms), so do not call population tuning a measured CPU speedup. It primarily fixes balance/buildup.

Fixed original 5-minute snapshot, identical 27 actors and effects, 1024x768 software Canvas2D: manual Medium mean draw ~66.5ms; Auto crowd relief ~13.5ms. This is an isolated software render measurement, not browser or physical device FPS. It confirms glow/ice rendering was the larger cost in that scene. Real iPhone/iPad checks remain useful.

Validation: TEST-PRESSURE.cjs covers brute fallback, specialist separation, elite cap/linear HP, successful retry cadence, cache/XP deduplication, spawn helper population guard, unchanged boss HP, immediate Auto/hysteresis/paused backdrop, manual preset control, cost-sensitive adaptation and visual RNG separation. Terrain, arsenal, distress, specialisation, menu and graphics regressions pass; salvage/purge suite rerun. New pressure tests are dependency-free Node VM checks. The graphics regression's slow-interval fixture now uses cheap rendering to keep testing two-interval hysteresis independently of the new expensive-render trigger. Pages and live launch/help verification required before reporting deployed. Roadmap step 4 has not started.

## v0.14.0 - menu refresh requested before step 4 (work checkpoint)

James requested main/pause visual refresh with a moving aurora, full information audit, responsive alignment/spacing, and saved progress if credits interrupt work. Step 4 remains on hold. Main menu now separates ship/loadout from flight controls; labels sector, hull, module and credits; exposes selected pilot passive description. Pause adds persistent pilot/time/kills/level/hull telemetry, flight ability/equipment/pace/slot information, and a bounded scrolling page area with fixed tabs and footer. Existing weapon reports, 36 evolution recipes/filters, credits/tools, sector/specialisations, mutations, signals and advanced stats remain.

Aurora: three SVG gradient groups with slow CSS transform animation, no filter or extra animation loop. Non-interactive, aria-hidden; shown only when launch or pause is visible. Hidden during gameplay and other overlays. CSS system reduced-motion and game graphics reduced-motion stop animation. Menu/paused panels use dark translucent backing. Original combat canvas untouched.

CHECKPOINT: implementation local; menu navigation VM checks pass. Remaining: regression suite, publish through GitHub (connector writes previously 403, authorised browser fallback), live desktop and responsive QA using TEST-MENUS.html, fix findings, capture final screenshots, verify Pages success. Browser file:// preview is disallowed by URL policy: do not retry or work around local-file restriction. Use normal authorised GitHub Pages publishing for visual review. TEST-MENUS.html is a development viewport harness embedding the normal index; uses UI controls only, no game-state injection and no separate save. Physical iPhone/iPad FPS and Safari are not emulated.

Visual QA checkpoint: first menu commit 79486b95154d20087c8a0f7c1762f9587487de2e deployed successfully (Pages run 41337884968). Desktop screenshots checked, launch/pause navigation and weapon/evolution pages verified. 390×844 phone layout has no horizontal overflow; pause panel itself does not scroll, details do. Found 320×568 left only 88px for detail scrolling. Added short-phone breakpoint to compact telemetry/header and fit six footer actions in two rows. Pending publish of this fix and final small/tablet/landscape/reduced-motion checks. VM menu/graphics/pressure/terrain checks and all eleven pilot summaries pass. Step 4 remains on hold.

Further QA: 768×1024 tablet and 844×390 landscape pause layouts checked; bounded inner scroll and footer reachability retained. Desktop Weapons and Evolutions retain performance explanation, slot levels, missing components and all-36 filter. Graphics → Reduced motion On produces computed aurora animation-name:none; restored Follow device after check. Main uses no horizontal overflow at 390 width; long menus use native vertical scrolling. Original motion/graphics settings and saves retained. Short-phone fix is the only final pending live check; after it is confirmed, menu refresh is complete and step 4 is the next gameplay task. No physical Safari or device FPS claim.

Final spacing commit 020526560a2985994d951632512a31079b54384d deployed successfully (Pages 41338298773). QA iframe retained cached previous HTML after ordinary reload, confirmed by absence of new short-phone CSS in rendered style element. TEST-MENUS.html now uses versioned initial URL and a timestamp on its Reload game button, so future reviews load current styles. Physical device/browser cache may need a refresh to get latest files. Final compact check must show more than prior 88px details area at 320×568; all other checks above passed.

## v0.14.1 phone aurora follow-up

User reports aurora invisible on iPhone. Confirmed design cause: nearly opaque launch/pause panels occupy almost all portrait viewport. Mobile backing now uses 64–72% opacity instead of 93–96%, vignette weaker, ribbon SVG fits viewport without wide-scene crop, explicit percentage gradient coordinates. Inner cards remain dark/readable, reduced motion unchanged. Step 4 still on hold. Publish and verify phone viewport; physical Safari check remains user-side.

## v0.14.2 - approved logo C implementation

James chose Overcharged Arcade C: big wordmark in game, no small RR underneath; retain separate RR for a possible future app. Imagegen edits of approved C produced transparent wordmark and separate RR source mark. Both original PNG assets saved in repository; wordmark embedded once as PNG data URL in index.html, preserving offline HTML use. Main h1 contains accessible alt text, responsive max-height 200 desktop/150 phone/100 short landscape. No added animated filters; no RR app mark in current gameplay or favicon. Existing compact HUD icon retained, stale version label updated. User request for future app mark is preservation, not approval to create or publish an app. Step 4 remains on hold. Pending live responsive/image-load QA and deployment verification.

## v0.14.3 - logo spacing correction during review

User spotted the T of REACTOR intruding into the G of ROGUE. Imagegen edited only wordmark spacing, exposing separation between the letterforms and preserving approved colours/style. Updated standalone wordmark and embedded PNG; RR app-mark source unchanged. v0.14.2 commit dffb75f0cc0af98d658b80d9e8e8e300b9442a6e was already submitted while correction arrived, superseded by this patch. Verify v0.14.3 live, image decode and desktop/phone bounds before reporting.

## v0.14.4 - logo palette in menus

James requested logo colours through menus and moving purple while retaining the aurora. Enhanced violet ribbon strength, made third ribbon violet/pink, added purple tint to readable menu panels/cards and selected tabs/buttons, retaining mint primary actions. Two-pixel spectrum border moves slowly only on visible main/pause panels; existing motion-class override and system media query stop it. No added blur, particles or JS animation loop. Combat colours/mechanics unchanged; aurora still hidden during play. v0.14.3 deployment and desktop/390px image decode/bounds passed; RR app mark remains reserved. Step 4 still on hold. Current colour patch pending publish/browser visual checks.

## v0.14.5 - chosen font D / Exo 2

James selected option D from the actual-font comparison. Applied Exo 2 across CSS font families/shorthands and all canvas text declarations (including damage numbers, pickups and warnings). Variable TTF embedded in @font-face, weights 100–900, font-display swap, system/Apple Symbols/Segoe UI Symbol fallback. No remote font fetch or dependency for offline HTML. SIL OFL copied to FONT-LICENSE-Exo2.txt and HTML comment. Logo PNG bytes/app mark unchanged. Stats use tabular figures where supported. Step 4 remains on hold. Pending font-load/phone/menu/Canvas checks and deployment verification.

## v0.14.6 - menu ships match gameplay

James observed menu icons still looked like the old designs. shipIcon previously used a simplified hand-authored SVG with only hull/partial identity parts; pilotDesign added engine pods, vents, cockpit core and rotating turret during play. Now shipPainter provides the shared primitive API; drawIdentityHull and pilotDesign accept an explicit painter/view, defaulting to live Canvas/state. A small SVG context exports that same full renderer at t=0 in neutral state, pointing up, without transient phase, dash, shield/armour upgrades. Menu/Hangar SVGs use 72×76 viewBox with padding for turret and hull tips. Original Canvas pixel output for all eleven ships was compared before/after and is identical. No gameplay drawing/design change. 

Preview colour follows selected unlocked global paint, using the same Aurora/Solar colours as initExpansion. Cache keyed by pilot ID, shape, effective colour and motion preference, bounded at 66 entries; previews use no gameplay RNG or state writes. SVG excludes soft shadow blur and the world-only ground shadow; it preserves hull/engine geometry, lights, plating and turret. Native Canvas sheet comparison passed, TEST-SHIP-PREVIEWS.cjs checks eleven unique SVGs and shared detail/turret, no run mutation, no-run generation, and menu/Hangar paths. Existing menu and identity/passive regression suites pass. Pending browser main/Hangar/phone visual checks and deployment. Step 4 remains on hold.

## v0.15.0 - Sovereign / twelve-ship roster

User requested one more really cool ship, completing an even roster, with the most expensive unlock. Added sovereign: violet/gold crown-wing hull with multiple gold inlays and reactor rings, shared menu/gameplay painter, diamond engine trails and a geometric arrival aperture. Stats 125 HP, 165 speed, 1 innate armour, starter Void Seeds. Licence challenge: 20 cumulative sector bosses, existing hangar.bosses/liveChallengeProgress/checkpoint banking; 600 credits versus prior maximum 180. No new permanent progress schema or auto purchase. Added new ID to loadHangar save whitelist; purchase persistence test caught and fixed omission. Pre-existing ship licences/balances are retained. Menu roster is 12, three full rows of four. Preview cache cap now pilots.length*6, notice cap pilots.length.

Passive Imperial Arsenal: +4% weapon damage per key in current-run s.evolved, max six / 24%; shared traitDamage applies after existing weapon attribution and excludes Other/riftDrive. Ability Singularity Jump: one charge / 10s, instant 220-range travel in movement/aim direction, 0.4s invulnerability, one s.riftWake at departure. Rift radius135, life2.4, tick0.3, eight pulses with18 base damage via hit(riftDrive), ordinary armour/crit/power and reward accounting. Nonboss/nonstationary/unfrozen ships pull up to65 units/sec; bosses keep position, arrivals and distress structures excluded. Pulses apply0.55s slow. Simulation time only, all resets in initShipIdentity; no array growth. Exits hit loop if a kill changes play state. Normal 10s cooldown prevents overlapping fields; assignment keeps a hard single-field bound. Normal/reduced-motion simple ring/arc artwork retains actual footprint, no screen-wide shader or extra loop.

Validation: TEST-SOVEREIGN.cjs covers locked/ready/unaffordable/purchase/persistence/repeat purchase, starter/stats, evolution scaling/cap/ability exclusion, distance/invulnerability/cooldown, exactly eight pulse timings, boss armour/pull resistance, arrivals/objectives, elite cache/kill dedup, live and banked challenge progress, paused frames, menu/pause/artwork, render paths/reset. Updated preview roster expectation to12. Menu, original identity/passives, arsenal, pressure and terrain regressions pass. Native Canvas/SVG all12 hull render sheets checked. Exo 2 font and approved logo unchanged. Browser main/locked challenge/phone and deployment checks still required before reporting live. This is an additional interlude; step4 not started.

## v0.15.1 - beam weapon visual pass

James requested better-looking beam weapons. drawWeaponBeam adds layered colour/core, tapered gradient/rippling envelopes, lens/muzzle facets, terminal taper, travelling chevrons (rail), diagonal gold bands (sails), reverse-flow braided leech strands and crystal prism nodes. Plasma Fences and Ion Harpoon render through the same helper. line now optionally tags beamStyle and returns its existing visual object; only friendly beam weapon call sites are tagged. Generic lightning, hostile warnings and support zaps retain their previous draw paths. Rail/Solar/Pulse collision loops add at most4 fixed-coordinate contact markers to their short-lived existing visual; no targeting change. Evolved laser lances use their previous lifetime/width and get the same renderer.

Graphics: no shadow blur on long beam geometry. Full detail capped at12 helper calls per drawn frame; subsequent beams retain their base/core. Low or Auto crowd relief uses simplified body/core/lens. Extra flowing nodes depend on particles being enabled. Reduced motion fixes ripple/node movement and impact sizes; fades remain. No added persistent arrays or gameplay RNG. Native Canvas all7 profiles and degenerate beams checked. TEST-BEAMS.cjs verifies tagged main weapon paths, regular lightning distinction,4-marker cap, all quality/motion profiles, balanced saves/restores, render no RNG/no combat state writes. Existing arsenal/menu/graphics/terrain/pressure/Sovereign tests pass. Before/after seeded10-second fights (six weapons, evolved main beams, build with fences and build with harpoon,16 durable targets) match combat HP/positions/metrics/stats/cooldowns/lance timing and RNG exactly. Not a device FPS measurement.

TEST-BEAMS.html is a standalone release-renderer visual loop with quality/reduced-motion controls; it never loads a player save or runs combat. Generated from the production helper for visual QA, not a new game menu. Main HTML remains self-contained with embedded logo/font. Pending live deployment, showroom/Low/motion and normal game launch checks. Step4 remains on hold.


## v0.16.0 - The Lost Signal alien merchant

James approved simplified concept C: six gold eyes in a neon purple hologram hood, mint controls, dark panels and Exo 2. Requested fifteen exclusive offers rotating at each transmission, with matching item images. Implemented inline SVG portrait and fifteen distinct icons, native scrollable shop body with fixed header/footer, compact horizontal offer rows on phones and reduced-motion CSS. No new raster/network assets. Current build v0.16.0.

Run state s.merchant is initialised fresh in start(). Never saved to Hangar or localStorage. Fifteen goods defined in merchantGoods, not defs/dropTypes. Three non-owned offers prefer to avoid the previous set, with repeats only when the remaining pool requires them. Purchase verifies current state/stock/ownership/wallet. Single-use purchases stay owned after use; no repurchase. Visits at game seconds 120/300/480; bosses hold arrivals and the 45s response timer. Remote transmission button / J opens, Escape or Leave closes that visit. state=merchant pauses the simulation, departure and timers, resets input. One free refresh per visit; paid costs15/25/35…; empty pool cannot charge. Smuggler's Beacon one-time extra visit at purchase+90s, offered before540s in normal runs, or endless. Next step: 6 difficulty tiers, not started. Reactor Protocols / Arcana cards (step4 replacement) explicitly deferred and retained in roadmap.

Scrap: every fourth ordinary kill3, yellow elite12, boss30, physical stack90s lifetime, max80 stacks (overflow merges into last). Drone vacuum260m vs base65m; pickup24m. Credits untouched. Converter5HP per15 newly collected scrap; spending never triggers it. No end-run conversion.

Effects: Plating blocks a hit then30sCD; Warp one fatal save at25% hull,180m warp,2s immunity (existing solid-cover resolver applied). Decoder adds one option to elite-cache list, up to fourth evolution otherwise +1reroll option; still exactly one chosen reward. Echo: every fifth normal weapon projectile repeats at35% damage, no fragments/recursive echoes, total shot cap250, existing projectiles marked on acquisition. Anchor max3×100m/3s slowing zones on successful ability use; Afterburner20% speed/2s. Lens30% damage below20% enemy hull for tracked weapon owners only; purge/Other excluded. Mirror consumes one nearby hostile,35base projectile,8sCD, respects supply freeze/shot cap. Bounty targets nearby normal non-objective ship,20s kill window,12physical scrap reward,30s interval. Battery repeats next eligible combat supply after12s once, excludes currency/XP/repairs, no recursion; waits for active purge wave to finish. Collector220m XP vacuum every15s, no supplies. Capacitor stores excess tracked weapon kill damage max240, releases120 charge for40base/100m pulse max once/2s, own damage tracked Other so cannot feed itself. All timers use game time and stop in menus.

TEST-MERCHANT.cjs passes all fifteen mechanics, guards, ownership/cost/refresh, no save/currency mixing, pause/boss holds, bounty/battery/cache transactions, icon coverage, per-run resets, rendering state isolation, array caps and actual600-frame crowded update/draw integration. Existing Arsenal, Sovereign, Terrain, Pressure, Graphics and Menu regression suites pass. TEST-MERCHANT.html uses release markup/CSS/art/purchase code inside a separate sandbox iframe,145 sample scrap, viewport controls and reset; no save or combat access. Live browser responsive/deployment review pending at this checkpoint; no physical iPhone/Safari/FPS claim.

### v0.16.0 live verification complete

Published commit eb5048c1396e7ec632f53a050ed0acd9d6a943ad; Pages run41352629897 succeeded (build20s/deploy10s). Live title v0.16.0, normal launch, rendered arena and pause Overview with Alien modifications verified. Isolated release-code preview checked at1280×800,390×844,320×568 and844×390: fixed shop header/footer remain accessible, inner body scrolls at short sizes, all three cards fit phone portrait, distinct icons and six-eyed portrait visible. Buy Drone:145→80scrap, removed stock,1/15installed, other purchases correctly unaffordable. Free refresh changes offers without spending and next label15scrap. Screenshots captured desktop/phone. No game-source console errors observed; cloud extension metadata warnings unrelated. Browser checks use CSS viewports, not physical Safari/FPS, and actual timed merchant encounters/effect combat were exercised in VM integration rather than a full manual browser run. Step5 complete; Reactor Protocols remain deferred, step6 not started.


## v0.17.0 - Settings developer panel

James requested a password-gated in-game dev panel with usual testing controls. Default convenience password ReactorBert; in-memory devUnlocked false on reload, manual Lock button; password input cleared after attempt, no localStorage credentials. Public client source is inspectable, explicitly labelled convenience lock. No server authentication claim.

Settings tab Developer uses existing tab/content scrolling system; devLogin/devControls gate, native details groups, labelled selects/checkboxes and responsive action rows. Fresh test launch selects any ship/sector without changing selectedPilot/hangar selections or licences. Existing active run ends through normal start() checkpoint; new s.dev.test set by devLaunch then launch cleared. Normal start resets all modifiers/speed/test flags. Start test leaves run paused with Settings open; Done then Resume. Controls require unlocked session plus Settings returning to Pause; browse/unlock alone leaves normal run unflagged. Mutating controls set sticky test flag before applying. Locking does not disable current effects or restore ranked status (notice explains).

Controls: invulnerability via hurtPlayer guard, per-step enemy freeze, instant ability recharge/unlimited charges, test simulation speed0.25/0.5/1/2/4 multiplied separately from saved gameSpeed with existing .016 substeps. Heal/shield, queue one level-up, +10 each run tool, +60 clock without simulation. Equip/set1–5 with six-slot limits, forced evolution bypasses recipe, remove clears attack systems. Grant mutation. Spawn1/10/25/100 regular/interceptor/brute/elite while respecting cap240/heavy quotas. Next boss one at a time, sector order/index limits. Clear enemies without kill rewards retains objective targets; active attack/effect cleanup. Spawn selected sector feature using existing placement/budgets. Place selected supply/cache45m beside pilot. Add250 merchant scrap; open transmission with chosen unowned featured offer (blocked during active boss). Existing merchant purchase code used.

Permanent isolation: commitHangar and recordRun early-return for s.dev.test; runCredits returns0; liveChallengeProgress returns saved hangar; finish skips best score/time/kill writes. Existing banked normal progress is retained, never rolled back. Test flag persists even after effects off/lock. DEV TEST badge in gameplay and pause overview warning. No persistent unlock-all/save editor provided. Input fields/selects excluded from gameplay keyboard shortcuts, preserving password entry/select navigation. Escape still closes Settings.

TEST-DEV.cjs passes default/wrong-password/session locks, fresh locked Sovereign/Storm launch without licence/selection mutation, god/flags, controls, slot/heavy/boss caps, resource/pickup/mutation/merchant paths, temporary speed, record/Hangar/best isolation across finish/back/start, and fresh normal reset. Existing Merchant (all15 plus600-frame crowded update/draw), Menu, Sovereign and Beams suites pass. Pending live Settings/password/test-launch/responsive check and deployment at this checkpoint. Roadmap step6 not started; Reactor Protocols deferred.

### v0.17.0 live verification complete

Developer release a744629 deployed successfully via Pages run41353893558 (build24s/deploy17s). Live title v0.17.0 verified. Settings → Developer initially password-gated; correct password reveals controls, run actions disabled on launch menu. Fresh test launch selected locked Sovereign/Storm Relay; developer test status displayed, invulnerability and0.5× selected. +250 scrap and Open merchant transmission opened real shop with250 scrap and selected Drone offer. Leave → Pause → Back to start preserved original Vanguard/Neon Expanse,0credits,0best and all locked ships. Phone390×844 Settings tab scrolling, password gate and unlocked controls checked via TEST-MENUS; no overflow, Done stays fixed, internal content scrolls. Screenshot reactor-rogue-v017-dev-panel.jpg captured. No physical Safari or device-FPS claim. Development task complete; roadmap unchanged.


## v0.18.0 - core gameplay pacing: formations

James deferred difficulty tiers to build core foundations first, choosing enemy pacing/variety. Added six readable formations to existing random pursuit, not a new population allowance. formationDefs eligibility: squad18s, lanes65s, escort110s, ring150s, pincer220s, rush280s. At most one pending warning; next opportunity24s after launch (30s after rush), eligibility avoids previous pattern when alternatives exist. Failed placement/crowd/budget retries in5s, no catch-up loop. First warning18s,1.6s before launch. Formation offsets remain relative to current player for warning and spawn, so moving during warning cannot cause an on-screen spawn. Ring positions ray-project to viewport rectangle+100 rather than ellipse (avoids diagonal spawns inside desktop view). All positions outside viewport tested at1280×800,390×844,320×568,844×390.

Squad7 light fighters in V, escort1 brute+6 fighters, pincer2×5-fighterV wings from opposite edges, lanes6 interceptors with3 missing adjacent slots (gap spacing clamps26–70), ring~8–9 fighters with1.8rad opening, rush12 light fighters in3×4. Shared flight vector per wing, consistent approach speed95 (escort75/lanes120/rush125), terrain steering still applies. Draw hull faces formation direction. Original speed restored at release8s (lanes9s); then normal pursuit. Stuns/freeze/collision retain existing handling. Group arrays max2×12; corpse/removed references cleaned. Normal heavy quotas preserved via spawn(), no specialist quota changes, unchanged health/armour/loot. Enemies above200 prevent launch; normal cap240 retained.

Borrowed ordinary spawns: each actual formation ship adds1 debt; ordinarySpawnSlot consumes1 debt instead of spawning. Plan/launch cannot exceed24 outstanding slots. Replaced count tracked in run-only stats. Special/elite/boss budgets unchanged. Rush recovery starts6s after launch and ends14s after launch, multiplying ordinary spawn interval1.5 (after debt repayment). No formation within10s before scheduled boss; active boss cancels pending, releases group vector/speed, sets next>=now+12. Pausing/settings/upgrades naturally hold all clocks through existing state machine. initFormations resets all state each start. Dev clear enemies clears pending/groups; dev dropdown queues patterns, using normal warning path and sticky test flag.

Warnings: max12 small edge chevrons,11px name/countdown, ring outline with mint OPEN label, no particles/blur and no RNG in draw. Reduced motion fixes warning alpha. Native Canvas six actual update/render scenes inspected (V, lane gap, escort, open ring, opposingVs, rush); browser review pending at checkpoint. TEST-FORMATIONS.cjs passes all six at four viewports, outside-screen positions after moving during warning,1.6s warning, escape gaps, one-for-one spawn replacement, movement release, heavy/population caps, boss holds/preboss guard, RNG/state isolation, pause/reset and actual six-pattern update/render approach. Existing Dev, Merchant (600-frame crowded), Pressure, Arsenal and Graphics pass. Terrain suite also run. No physical Safari/FPS claim. Current version0.18.0; ReactorBert password retained.

### v0.18.0 live verification

Release bde88f5 deployed via Pages run41355578062 (build22s/deploy11s, Success). Live v0.18.0 title verified. ReactorBert unlocks Developer; fresh Vanguard test launched, formation dropdown lists all six patterns. Queue Encirclement → Done → Resume produces edge chevrons, countdown, partial violet ring and mint OPEN escape marker, then normal formation activation toast. Runtime logs show cloud-extension metadata warnings only, no observed game error. Native actual update/draw scenes cover all six approaches; browser live check covers warning/activation. Viewport/cap/pacing tests documented above. No physical Safari/device FPS claim. Foundation1 implementation complete; subsequent foundation tasks require James's next choice.


## v0.19.0 - foundation2 weapon balance/identity

Resumed James's interrupted request to start foundation2. Source saved before edits as v0.18.0; current v0.19.0. Benchmark576 matched20s scenes per version (36weapons×4level profiles×4scenarios),60Hzseed12345. BENCHMARK-WEAPONS.cjs deliberately bypasses offerSpecialisation in test harness; initial aborted matrix that paused at level3 was discarded and replaced with valid uninterrupted results. Durable held targets, no support/branches/merchant/ship damage trait; trail scene moves100/s. Raw retained in BALANCE-V019.json; exact changes/results/limits in BALANCE-NOTES.md. Not a player-win-rate/device-performance test. Current values changed for9weapons plus mortar prediction; remaining weapons retain their established utility roles.

Fixed extra-shot geometry regressions in Bolt5 and evolved Crescent3-shot volleys; Arc first spoke now aims at target. Rail newBase58+24L and inherent30% armour penetration (Needle60%, not stacked); Leech24+10L/cycle1.6/heal cap retained; Sails36+16L/cycle2.2/halfwidth10+L; Chain24+14L/cycle1.9. Shared preview bases updated. Ember max one target hit per0.15s across wakes; evolved torpedo rifts max2ticks/target/0.4s window. Data on enemy objects only, resets with new enemies. Mortar predicts ordinary movement/formation direction max70m over.85s, excludes stationary/frozen/role/boss/structures. No extra projectiles or persistent collections added.

weaponRoles covers36defs; compact role text on upgrade cards and role tip in weaponReport. weaponVolleyCount/volleyUpgradeHint exposes true upcoming count changes, including branch/evolution counts, without revealing unrelated synergy/evolution recipes. Existing compact responsive card rules preserved. Corrected Overclock description to cycle reduction. TEST-WEAPON-BALANCE passes overlap/armour/geometry/aim/role/milestone isolation. TEST-ARSENAL updates old Rail3 expected118→130 while preserving both synergy factors. Existing Dev, Merchant600-frame, Formations/four-viewports, Graphics, Menu, Sovereign, Beams and missing-only upgrade hints pass. Live deployment/UI checks pending at this checkpoint. Password ReactorBert. Core foundation3 build clarity is not started beyond the weapon-specific role labels here; difficulty tiers and Reactor Protocols remain deferred.


### v0.19.0 live verification complete

Code commit dad1413164bc1832c72d91173830667f82454ddd deployed successfully through Pages run41421805950 (build20s/deploy10s). Live title v0.19.0 verified. Developer test run equipped six weapons; Pause → Weapons correctly shows role/usage tips alongside damage/DPS/kills/boss damage, within the existing scroll area. Live level2 Neon Bolts card shows GENERALIST and22→29 damage plus1→2 shots/volley. Phone390×844 viewport check shows compact single-column cards, full-width descriptions, role labels and accessible skip/reroll/banish controls; internal scrolling retained. Screenshots reactor-rogue-v019-weapons.jpg, reactor-rogue-v019-upgrades.jpg and reactor-rogue-v019-phone.jpg saved. Phone check is CSS viewport coverage, not physical Safari/device FPS. Foundation2 complete. Foundation3, difficulty tiers and Reactor Protocols not started.


## v0.20.0 - foundation3 build clarity

James authorised foundation3. Added fourth Pause tab Build inside existing bounded scrolling page. buildEquipment filters current defs/items only; buildNext derives each owned weapon recipe requirements via evolutionStatus, identifies banished support/full slots/cache-ready/evolved. buildInventory lists current levels, evolved names, specialisations and descriptions/role tips; buildReport includes active-only synergyDefs and owned-weapon next steps, directs other information to existing Overview/Weapons/Evolutions pages. Upgrade render calls renderUpgradeBuild, populating collapsed native details with current slot counts/equipment, refreshed after reroll/banish/new run. No combat HUD panels or saved discovery state. Existing missing-component-only hints unchanged. Responsive columns collapse below650px; four pause tabs fit mobile. TEST-BUILD-CLARITY passes all36 recipes, blockers, active-only pairs, state purity and fresh resets. Weapon Balance, Menu061, upgrade hints083 and Dev pass. Live verification pending. Foundation4 not started. Reactor Protocols and difficulty tiers deferred.


### v0.20.0 live verification complete

Code0cb0e03d4e522effc206079c5b42077c1d477204 deployed via Pages run41426417985, Success (build20s/deploy9s). Live v0.20.0 verified. Desktop Developer test: Bolt5/Overclock1/Chain1 → Pause Build shows2weapon/1support slots, cache-ready Photon Echo, exact missing Critical Core and Chain level requirement. Phone390×844: four pause tabs fit, Build collapses to one column with independent page scroll and accessible fixed footer. Queue level-up shows collapsed current-run1/6weapon0/6support summary; expansion lists actual Needle Repeater level1 and empty support state within scroll panel. Screenshots v020-build, v020-phone-build and v020-phone-upgrade captured. CSS viewport test, not physical Safari/device FPS. Build, Weapon Balance, Menu061, missing-only hint083, Dev, Arsenal, Merchant600-frame and Graphics tests pass. Foundation3 complete; foundation4 remains unstarted.


## v0.21.0 - foundation4 run structure and ending

James authorised foundation4. runBossTimes180/360/600 shares existing schedule; runObjective replaces visible arbitrary wave count (wave counter logic retained) with next reactor/countdown, ENGAGED, secured or endless. Existing HUD footprint. runRouteReport on Pause Overview and results maps actual sector boss definitions, timestamps successful kills via run-only routeKills; routeIndex assigned at spawn. updateRunApproach names upcoming boss once in last15s (routeWarned perrun). No schedule/health/spawn/reward changes.

Final hit increments existing bossKills and marks finalClearPending; hurtPlayer ignores damage during pending uncompleted clear. resolveFinalClear at update boundaries drains hostile/hazards/sectorHazards/enemyBursts and pending formations, then opens safe final mutation (existing reward) or finishes. Exhausted mutation pool now resolves pending clear rather than leaving victory blocked. Existing claimMutation completion/banking reused. Results add animated reduced-motion-safe sector seal, route and clear/banked status; devtest accurately says no rewards. Endless explicit resets pending flag, retains completed, standard scoring/world resumes, no extra scheduled bosses. Endless defeat text retains clear rather than offering an unavailable continuation. TEST-RUN-STRUCTURE covers3sectors, timing/warn idempotence, actual boss hit/hurt safety, mutation/no-options finalisation, endless/bank-once/fresh reset. BuildClarity,Dev,Merchant600-frame,Menu061 pass. Live verification pending. Foundation5 not started.


### v0.21.0 live flow verified

Code b286952a deployed content serving v0.21.0 at?v=0210; Pages run41427703453 deploy job125218432197 verified succeeded in12s (build24s). Initial summary displayed stale In progress until opening the job. Desktop normal devpanel controls used (no state injection): Spawn next sector boss + new Defeat active sector boss control three times, Resume and select mutation after each. Final title reads Final reactor secured; final selection reaches Jump corridor open / SECTOR CLEAR, all3actual route ticks, devtest no permanent rewards. Explicit Re-enter sector endless returns to play; Pause shows sector clear retained. New dev control uses devMark + real hit path (boss arrival cleared), covered in TEST-RUN-STRUCTURE. Phone390×844 normal launch/pause route stacks all3actual names/times and keeps footer accessible; no physical Safari/FPS claim. Screenshots reactor-rogue-v021-victory.jpg, v021-route.jpg and v021-phone-route.jpg captured. Graphics checks also pass. No foundation5 changes.


## v0.22.0 - foundation5 combat readability

James authorised next foundation. Removed original early hostile-shot drawing and relocated charged/boss warnings plus live rail hazard drawings to drawCombatReadability at end of world pass after combat explosions/pickup waves/damage numbers. Existing warning geometry/timing preserved, dead charged enemies excluded. New drawHostileShots only renders live visible shots, dark backing/warm diamond/native-colour core, no glow/particles/RNG. threatRing outlines sector hazard physical radii (dashed preparing, solid active) and enemyBursts. threatLine gives rail/hunter warm/dark aimlines, max12 specialist cues; existing specialist counts capped12. drawPlayerLocator static four corner marks21units aroundplayer, explicitly not hitbox. damageNumberPosition draws labels at least44units fromplayer without mutating numbers. One extra bounded enemy pass; no sorting, persistent objects or combat mutations. All graphics profiles including Low/reduced motion retain cues. Help entry explains marks. TEST-COMBAT-READABILITY passes state purity, RNG rejection, quality/motion variants, culling and final draw order; RunStructure,Beams,Merchant600-frame,Formations andDev pass. Live QA pending. Foundation6 not started.


### v0.22.0 deployment checkpoint

Code f6944dabfde7d159c5b4f792005ee02679a794b4 committed; Pages run41429672700 build33s passed, deploy failed transient OIDC token fetch (Failed to get ID Token / socket hang up; generic permission suggestion also printed). Re-run only deploy through UI, attempt2 queued without runner/job allocated at checkpoint. No permissions changed. Live content stillv0.21.0; final crowded/phone visual check pending deployment. All native checks listed above plus WeaponBalance,Menu061 andGraphics pass. Next action verify deployment, use normaldevpanel spawn crowds/boss and capture v022readability screenshots. No foundation6 work authorised or started.


### v0.22.0 live verification complete

Fresh checkpoint commit911dddc triggered Pages run41430325971: Success, build32s/deploy13s. Live titlev0.22.0 verified at?v=0220. Original run49 attempt2 remained queued; no permission changes made. Desktop Developer normal controls: god+4speed, two yellow elites+first boss,100fighters, Nova5/Cannon5, claimed ordinary specialisations and earned upgrades. Actual fight reached101kills/10s; screenshot shows player brackets amid pickups/enemies and outlined pink hostile diamonds distinct from cyan XP. Phone390×844 normal launch verified player locator and compact HUD. Native bounded draw tests cover threat ordering, hazard outlines and Low/reduced-motion persistence; browser checks are visual, not physical Safari/FPS claims. Saved reactor-rogue-v022-combat.jpg and reactor-rogue-v022-phone.jpg. Foundation5 complete. Foundation6 progression pacing remains unstarted.


## v0.23.0 - normal-run playtest and pacing

James requested full normal-run playtest/pacing. Added PLAYTEST-NORMAL-RUN.cjs real60Hz update driver, fresh isolated storage, Vanguard/grid/no paidmeta, devfalse, normal movement/dash/offered choices. Two baseline desktop seeds12345/54321 clear710.13/679.10s at levels60/58; after changes653.07/669.22s at50/55. Touch390×844 movement-facing after seed12345 clears688.95s level54,178taken,minHP69.4,twoevolutions. Raw five complete logs/samples in PACING-V023.json; methods/limitations in PACING-NOTES.md. Initial keyboard fleeing driver unable to aim was excluded and corrected to normal hybrid mouse aim before baseline pair. Optional merchant/distress unaccepted; native systems run. Not human win rates/FPS; instant menus; build/RNG divergence limits causal claims.

Changes: levelXPRequirement(1)=5 instead6; levels2–20 oldformula; above20 adds2*(L−20)XP. levelUp uses helper. Boss actual hit sets bossRecoveryUntil=t+8. Ordinary spawn interval multiplies1.75 while window active and no liveboss. No existing enemies killed, immunity, bonus rewards or timing shift. Gameclock pauses window in overlays. runObjective RECOVERY countdown lower priority than active boss/final clear/endless. Per-run init resets. Addedhelp explanation. TEST-PACING passes thresholds/pause/real kill/reset/nextboss priority. Existing RunStructure,Dev,Merchant600-frame,Formations,Readability,UpgradeHints083,Menu061 pass. Live verification pending. Foundation6 complete in code; foundation7 not started.


### v0.23.0 live verification complete

Release e54704d via Pages run41433040015 Success (build25s/deploy9s). Live titlev0.23.0 at?v=0230 verified. Separate live UI smoke used normal developer controls to spawn/defeat first boss, Resume/select mutation; HUD shows RECOVERY8s, pause retains window. This smoke is distinct from the five normal-rules devfalse full-run simulations. Help → Post-reactor recovery correctly describes reduced ordinary reinforcements, remaining danger, paused timer and unchanged next boss schedule. Returned live game to launch so user starts normal progression. Screenshot reactor-rogue-v023-recovery.jpg saved. Tests passed: Pacing,RunStructure,Dev,Merchant600-frame,BuildClarity,Formations/fourviewports,CombatReadability,missing-onlyUpgradeHints083,Menu061. No physical-device FPS or human difficulty claim. Foundation6 complete; foundation7 not started.


## v0.24.0 - pickup visibility

James chose priority1 from notes. Pure pickupInfo/importantPickup helpers. drawDrop replaces spinning common diamonds/blinking expiry with dark-backed round credits, hex supplies, square gold cache, larger native glyphs and10px important labels. Last5seconds show countdown, no disappearance. Drop bodies relocated above decorative blasts/waves before numbers/threats; XP diamond darkoutline, merchant scraphex7/darkbacking. No reward/range/lifetime/drop-rate changes. pickupMarkerLayout only important chest/repair/freeze/novaDrop/vacuum, offscreen-safe area, prioritycache thenneededrepair thennearest; max4phone/6desktop, >=36px spacing. No redundant visible badges or currencyedgeclutter. Existing ns_markers preference retained. Allpure/noRNG. Helpadded. TEST-PICKUPS covers everyicon/expiry/unknown, Low+motion, priority/budget/spacing/toggle/state. Readabilitytest adjusted for new intermediate pickup pass, preserves threats drawnlast. Pacing,RunStructure,Merchant600-frame pass. LiveQA pending. Other notes saved inROADMAP; not implemented.


### v0.24.0 live verification complete

Release e299008bf1c7acd1d69bee30a239821b20cf6422 deployed via Pages run41435369742 Success (build24s/deploy49s). Live TEST-MENUS titlev0.24.0 confirmed. Phone390×844 Developer fresh test → place Elite cache → Resume shows square dark-backed gold case, large star and readable EVOLUTION CACHE label beside player, above scenery, no redundant in-view marker. Saved reactor-rogue-v024-phone-cache.jpg. Native tests cover all supplies/credits/expiry, Low/reduced motion, offscreen priorities/budget/spacing and preference. Phone viewport test not physical Safari/deviceFPS. No changes to collection/rates/rewards. Other notes retained only.


## v0.25.0 - named local profiles and backup transfer

James chose priority2. Four progress keys rr_hangar/ns_archive/neonSwarm02/ns_pilot routed through profileStorage; default uses unchanged legacy keys, new profiles rr_profile_ID_KEY. Device/audio/graphics/control preferences retain shared keys. Manifest rr_profiles_v1 stores version1/active/up-to8 names. sessionProfileId fixed per page so another tab selecting a different profile cannot redirect this tab's writes. No data migrations/deletions of default. Main launch Profile button and Settings Profiles & saves tab; create/rename/switch/import restricted to launch, switch commits manifest then reloads. No delete action. Export banked Hangar/archive/best/selected ship only, available during run; active run not included.

Backups format reactor-rogue-save/version1, JSON max2MB. Validate required fields, numeric bounds, pilots/loadout, records budgets, depth/node budgets, unsafe text/prototype keys. Profile names escaped separately. File read preview then explicit Import as separate profile. Import writes new keys before manifest and cleans partial writes on failure; current active/profile data kept. Cancellation/async generation guards. Storage-error controls fail closed, export available. New names/manifest created only on explicit action. Account login/cloudsync not connected; local transfer works via backup. Modern ship whitelist/pilot archive loader includes all12 so transferred Sovereign/new-ship records survive reload.

TEST-SAVES.cjs covers preexisting123credit legacy, isolated new7credit save/reload, shared controls, roundtrip/import/reload, separate active manifest, malformed/future/oversized/unsafe/loadout failures, quota rollback, active-run guard, default preservation and modern ship records. Dev/Merchant600-frame/BuildClarity/Sovereign/Menu061 pass. TEST-SAVES.html uses ?save-review=1 namespace rr_save_review_ for all storage; normal keys untouched, real UI/file download/import QA. Live verification pending. Original broader foundation7 not started beyond prior pickup clarity.


### v0.25.0 live save flow verified

Initial release def6f9ae479aad775c9021929a19485998517130 deployed Pages41437867607 Success (build22s/deploy12s). Isolated TEST-SAVES UI: rename Commander→Backup check, download JSON, create Fresh pilot/switch/reload, upload actual downloaded file, preview0credits/1ship/0records, import as Backup check imported while Fresh pilot remains current, explicit switch/reload confirms imported name at launch. Actual downloaded /workspace/scratch/reactor-rogue-default-2026-11-02.json1133bytes parsed correct format/version/fourprogresskeys. Download event automation timed out/reset REPL, but file existed and actual file import succeeded; not a game export failure. All QA profile writes used rr_save_review_ namespace. Normal phone390×844 profile screen confirms Commander unchanged and scrollable form/fixedDone. Screenshot reactor-rogue-v025-phone-saves.jpg. No physicalSafari/FPS claim.

Polish follow-up fixes singular ship/record preview grammar and scrolls selected Settings tab into view. Mutations refresh latest profile manifest first to preserve profiles added by another open tab; stale-tab regression added. Saves/Menu061 pass after changes. Cloud accounts/automatic sync still unconnected; active runs not backed up. Local profiles/export/import complete; other priorities not started.


## v0.26.0 - typed caches and mixed sector hulls

Resumed prior profile polish first: committed e566ae0 via browser after fresh turn access restored. Then James's screenshot fix. Internal chest id retained for compatibility; makeCacheDrop sets cacheKind at creation (evolution only if eligible and none outstanding on floor/queue/open reward; otherwise supply). All normal elite/boss/surge and dev drop sources use factory. Ground info: supply cyanhex/▣, evolutiongoldsquare/✦. collectDrop queues kind in run-onlycacheRewards; openReward consumes typed ticket, supply never upgrades retroactively. Evolution options all actualeligibleevolutions. Header/title/hint/icons consistent. CacheDecoder: supply4thnavData option; evolution4thchoice ifpossible elseautomatic+1reroll alongsidechosenEV. Bonus one-use guarded. refreshCacheKinds handles recipe removal viaDev and postEV by converting stale floorEV tosupplies beforecollection. Legacy test-created untyped chests derive readiness. No saveformat migration or new cache drop rate.

Sector models: spawn assigns sectorHull to2of3 ordinary spawns inbelt/storm via per-runsectorHullIndex (no extraRNG). Third familiar; specialists excluded, existingsectorbosses retained. Pure drawSectorEnemyShip ruggedmechanicalhooks/plating forScrapMarauders, angledcrystalvanes/core forRelaySentinels; strengthoutlinecolours/freeze/glow/formationheading respected. Stats/radii/speeds/XP/armour/spawnquotas unchanged. Native same-seed spawnstats andRNGsequence equalgrid/belt/storm. TEST-CACHES-SECTORS plusSaves/Merchant/Pickups/RunStructure/Dev/Formations/Pressure pass. LiveQA pending.


### v0.26.0 live verification complete

Profile finish commit e566ae0 deployed via Pages41463181990 Success first. Cache/fleet release11b9906a322c4c8c80fc1d6d7b5e2c507075a0d2 via Pages41464690957 Success (deploy13s). Live?v=0260 title0.26.0. Normal developer UI freshVanguard+SupplyTractor1 then cache with unreadybolt opensSUPPLY CACHE/Choose your supplies, repair45/XP25/boost12, no evolution wording. EquipBolt5+Overclock1, chooseordinaryLanceArray specialisation, explicitlyplacecache, tractorcollect → EVOLUTION CACHE/Choose your evolution, PhotonEcho only with correctrecipehint. ClaimedEV normally. No source injection.

FreshShatteredBelt thenStormRelay devtest spawned10ordinarytype2budgeted ships: newmechanicalhulled andcrystalvaned variants visiblymixed withfamiliarships. Strengthcolours, headings and silhouettes readable; native same-seed/stat tests cover no gameplay changes. Screenshots reactor-rogue-v026-supply.jpg, v026-evolution.jpg, v026-belt-fleet.jpg, v026-storm-fleet.jpg saved. Native tests alsoSovereign/Arsenal/Pacing/Readability/UpgradeHints083/Menu061 pass. These aredesktop livevisualchecks plusnative render/functional checks, not physicalSafari/FPS. Returned tolaunch fornormalrun. Both userrequests complete; no newcontent/AIstats orcloudbackend added.


## v0.27.0 - expanded achievements and contracts

James requested more achievements/contracts.24new/31total, newrewards545credits one-off (old7remain150). CategoriesMilestones/Combat/Mastery/Exploration plusoldBlueprints. Goals include kills2500/10000,boss25,wins5,survival2/10m,cannon500/buoy500kills,250kbeamdamage(laser/rail/leech/sails),500missile-familykills(rocket/seeker/phaseTorp),250freezes/100ignitions/5cleanbosses,x10combo,15/30distinctEV,3EV/fourpaths/eightmerchantmods/3signalsinrun,1000/5000gem pickups,all3sectorwins/3pilotwins. Numbers reflect effective weapon accounting and mergedgemcount semantics. No weapon/stats/drop/pacing changes.

New h.progress fields beamDamage,missileKills,maxEvolutions,maxSpecialisations,maxMerchantMods,maxSignals,maxCombo,pilotWinMask,sectorWinMask; contractVersion1. Missingmarker seeds available archive history once (bounded100runs), preserving older permanent counters/claims; not all historic detail can be recovered. contractRunCounters shared by live projection and commit checkpoint delta. applyContractBests uses max/OR, win masks onlysuccessfulclears. commitHangar existing devguard/credit awardloop retained, addsruncontractCompletions. claimContractReward supports banked historic-ready goals once; no devtest claims. Progressbank autoawards normally. Counts/profile/backups covered.

Contractboard status+category filters, banked progress, paidbadges and readyclaim states; survival displayedastime. Existing unlockNotice queue reused at.5s cadence with boundedcontract entries, onlynormalruns; completed results max4detailcards pluscount. No new permanentcombatHUD panel. Addedportable TEST-MENUS.cjs from prior scratchmenu061 suite; exactbankcredit assertion updated for newFlightCadet10reward (old scratch assertion expected6andnowrightlysees16). TEST-CONTRACTS testsall31thresholds,695totalincludingold, no doubleclaim/bank, liveprojectionpure, cumdeltas, max/masks/endless, devexclusion, notice/results/filters, once-onlyhistorymigration andbackup/importreboot. Saves/Dev/Menus/Merchant600-frame/RunStructure/Pacing/CachesSectors/Formations pass. LiveQA pending. Other priorities untouched.


# v0.28.0 - twelve new weapons and six supports

James requested notes priority5 / more equipment, then explicitly expanded scope beyond the original four-weapon proposal using Vampire Survivors inspiration. Final:12 weapons/12 evolutions/24 paths/6 supports/12 synergies. See README table for names/recipes. Original art and code-native geometry retained; reference research uses https://vampire.survivors.wiki/w/Weapons . No copied assets/code.

`equipmentWeaponRows` participates in existing defs/rarities/evolutions/slot pool/DEV/recipes/reports; `equipmentSpecChoices` preserves validated new paths in archived runs. `s.equipment` resets via initNewArsenal, including developer attack clear/removal. Budgets:8 storm marks,8 rings,4 drill locks,2 guardian deployments,12 pools,24 tracers,30 comet arcs,12 wisp marks; ordinary projectile cap250 retained. Ring Sets hit each hull once; guardian map prevents faster than0.4s hits; tracers clear their hit Set at each reflection and expire after six reflections. Plasma ticks0.4s; evolved Soul Reactor heal capped once/sec. Marked areas and drill locks can miss moving ships; drill selects highest current HP and uses60% armour penetration through existing pipeline. All damage credits effective HP loss via hit()/owner. Enemy bullets/warnings retain final draw priority. Graphics options/reduced motion retain essential footprints and limit decoration; no extra global particles or spawns.

Supports: manoeuvre recovery divides ability cooldown by1+0.05L; shield delay subtracts0.5L with1.5s minimum; baffles trigger only when damage remains after plates (shield hits count),8s cooldown, ordinary ships only; repair amplifier multiplies actual healing1+0.08L; predator/last-stand apply only to attributed weapon damage, excluding purge/environment/other. Configured newSupports rarities are now copied into rarityMap (previously overwritten as common). Existing upgrade rarity logic still favours upgrading equipped weapons.

Added TEST-EQUIPMENT; updated arsenal/branch/weapon/build counts. The old SPECIALISATIONS chain assertion still expected56 base at level3, predating v019’s66; reproduced on untouched v027 baseline, corrected assertion to66. Current contracts, saves, dev exclusions, caches, build clarity and menu regressions checked. Completed blueprint cards now retain their blueprint unlock labels. HUD build label corrected from stale0.19 to0.28.

Native tests passed for new attack modes/evolutions/paths/supports/synergies, delayed misses, one-hit rings, convergence, armour/attribution, cooldowns/healing/shield, slot/hint restrictions, reset and240-enemy legal six-weapon simulations. These are simulation stability tests, not iPhone/iPad FPS measurements. Live browser/render/phone QA and deployment verification follow publication; record their result before final handover.


Live QA: code commit9f55517 deployed via Pages run61 (41473618908), successful build/deploy in1m8s. Live titlev0.28.0 verified. Through ordinary DEV controls equipped a legal six-weapon level2 build (Ion Guardians/Plasma Rain/Prism Tracers/Comet Scythes/Ion Curtain/Coronal Shroud), spawned100 fighters, resumed and paused with33 kills. Damage report attributed effective damage to the relevant new weapons; screenshots show readable hull, effects and labels. All new48 recipes render;390×844 CSS viewport check shows Citadel Orbit requirements/effect with wrapped text, scrolling body and accessible fixed actions. Corrected stale “All36 recipes” filter label to48 and Plasma Lash description to forward/rear, matching its actual facing-relative sweep. No application-origin console errors observed; extension metadata errors are external. Native queued full checks passed. This is a short render/control smoke test, not a full-run balance pass or hardware FPS benchmark. Screenshot proof lives in task workspace (v028-equipment.jpg and v028-phone-recipes.jpg). Follow-up publication only corrects wording/counts and records QA; no combat changes.


# v0.29.0 - approved complete attack art

Scope: James approved the second muted vector-like visual study; corrected initial six-weapon scope to ALL attacks and defensive weapons, then added enemy attacks. Implemented across all48 weapon families, base/evolved styles, defence, ability fields and hostile shots/beams/warnings/hazards. The selected exact study was image-edit-target-6e22f19798d6e2e4.png; generated one transparent4-cell atlas for bolt/missile/scythe/guardian, copied to repo and embedded for offline use. Other art remains procedural; fallback silhouettes always work before image load and on Low.

Core: attackArtFamilies covers every weapon; drawWeaponProjectile routes every projectile renderer through family geometry; field/device/pressure/reticle/arc/lash helpers replace flat world effects; existing overcharged beam envelope treatment gains mechanical emitters. All48 renderer branches and evolved styles tested across Low/Medium/High/Auto and reduced motion. Combat pipeline remains unchanged except visual event hooks. attack() wraps untouched attackCombat() only to detect emitter flashes. hit() records bounded cosmetic impacts after actual damage. updateNewArsenal advances an external attackArt cache; no gameplay RNG. WeakMap trails max6 samples per live object; limited to visible objects, detailed effects and motion enabled. Reset via initNewArsenal also handles DEV attack clear/remove.

Budgets:48 impacts,18 muzzles,72 atlas sprites,24 detailed fields,100 detailed devices per frame; excess falls back to simple silhouettes/boundaries. Existing shot/enemy limits remain250/240. Rendering uses no new full-screen effects, no long-beam shadow blur and no extra gameplay particles. Atlas source regions explicitly exclude transparent gutters. Constant image load is async with native fallback. Frame counters/cache are cosmetic and outside serialised combat state.

Enemy threat layer keeps final priority; warm dark-backed faceted shots, bright physical beam edges and directional warning chevrons. Boss pattern timing/count/length/target locations unchanged. Mine/storm/volatile danger rings retain collision radii. Purge/Chrono Stop/hull freeze/combat explosion effects already approved are preserved. Passive-only upgrades do not invent attacks or fill the playfield with idle effects.

Tests: TEST-ATTACK-ART checks48×2 forms×4 presets×2 motion modes, state/RNG purity, defensive/hostile cases and reset/bounds. TEST-ATTACK-PARITY opt-in baseline comparison verified all96 weapon scenes for150 simulation frames each against unchanged v028: identical time/player/CD/items/metrics/weapon stats/enemy position+HP+statuses/kills/score/gems/shots/hostiles/drops/evolutions. Existing equipment, arsenal, beams, combat-readability, DEV, saves, contracts and run-structure checks passed. This verifies gameplay equivalence in controlled scenes, not every possible player build or device FPS.

TEST-ATTACKS.html is an isolated no-save release-helper gallery; gallery fixtures intentionally demonstrate visual families rather than simulate balance. Browser QA/deployment follow publication; record final results in a follow-up handover note. The game was not changed during either concept-preview turn; implementation begins with this v029 task.


## Final scope correction and item artwork

James clarified this is a redesign of ALL usable attacking/defensive/passive items, not only their combat effects. Added individual procedural SVG art for all80 defs entries:48 weapon-family illustrations and32 distinct passive/defensive paths. equipmentIcon() is cached (base/evolved); old d.icon characters remain data fallbacks for non-equipment mutations/supplies. Upgrade cards/HUD/build/weapon report/specialisation cards/evolution recipes use the artwork; recipes show matching support art too. Passives keep their existing stats/behaviour and do not invent idle attacks. HUD rack markup only rebuilds when its id/level/evolution signature changes to avoid repeated SVG DOM work. Native coverage asserts all80 have art and checks upgrade/HUD/build/recipe wiring.

Live first publication82ccbc9 / Pages run63 (41481388488) succeeded1m2s. Gallery loaded all48 weapon examples, defensive/ability samples and enemy projectiles/rails/warnings/mines/storms/volatile blasts. Live v029 test via normal DEV controls used six level2 weapons (Bolts/Missiles/Lightning/Guardians/Plasma Rain/Comet Scythes), six supports,100 fighters and a sector boss;99 ordinary kills recorded in the short smoke test, no application-origin console errors. This is renderer/control smoke QA, not balance or hardware FPS evidence. Saved combat and enemy-gallery screenshots. Exported actual live Vanguard SVG for gallery (native harness export had only a fallback triangle).

Follow-up adds final all80 item art/catalogue, native fallback improvements and rate-limited real-repair feedback: only positive actual healing, min0.75 accumulated HP and0.8s cooldown, two tiny green repair ticks for0.35s. Updated helper gallery uses the current release module and actual ship SVG. Final publication/browser item and phone checks follow.


# v0.30.0 - original adaptive soundtrack

Six16-bar mono22050Hz synthesized loops (menu112, grid170, belt174, storm138, boss176, merchant104 BPM). Private LCG for synthesis and startup SFX noise; no gameplay RNG consumed. Worker embeds renderMusicChunks generator and renderMusicPCM wrapper, transfers PCM; cooperative6ms-budget fallback yields between synthesis steps and output chunks. LRU max4 buffers. Looping sources use separate fade gains into existing music bus,0.55s crossfades, max2 retiring tails, remembered playheads. No effects voice consumption or per-note combat scheduling.

ns_audio retains existing volume/mute fields and adds soundtrack=auto and pauseMusic=true defaults. Menu/end use Aurora Drift; sectors their own tracks; alive boss overrides sector; merchant uses Lost Carrier. Settings manual override plus20s preview. Pause setting defaults to stopping/resuming remembered loop; optional background pause music is ducked. visibilitychange immediately stops transport and mutes bus even if rAF stops; muted/zero-level tabs stop playback. Existing pointer/key gesture unlock retained and interrupted audio can resume. UI synchronises track/status, preview expiry and preferences.

TEST-MUSIC covers deterministic finite bounded/seam-faded PCM, worker isolation, adaptive transitions, independent bus, bounded cache/tails, offset resume, pause/mute/hidden behaviour and saved selection. Native synthesis tests are not hardware timing or human listening evaluation. Browser QA/deployment recorded separately after publication. No combat balance/progression changes.


## v0.30.1 - stable weapon silhouettes and touch selection
Atlas weapon silhouettes no longer depend on Auto/Low detail or the frame-order72-sprite allowance, which could swap a live projectile/device between PNG and procedural shapes. Existing projectile/device population bounds remain; trails/glow/field decorations still simplify. Missing/unloaded atlas retains procedural safety fallback. Page selection, iOS touch callouts and tap highlight disabled; input/textarea/contenteditable retain text selection. Noneditable selectstart/context menus suppressed; native menu scrolling/control gestures unchanged. Native attack-art and menu regressions checked; physical iPhone long-press behaviour requires user verification.


# v0.31.0 - two frontier sectors

foundry/cryo added to sectors, sectorOpen(first clear contract), DEV choices and cleanRun archive IDs. Existing profile validator uses sector catalogue. Original trilogy win mask deliberately remains original3 IDs; value masks with7. Selection previews are inline SVG, no image requests. Native tests check existing profile round-trip plus new archive IDs.

World-anchored procedural320-unit platform/ice tiles and24 ambient motes; deterministic draw math, no gameplay RNG; reduced motion freezes ambience. Existing2/3 hull mix extended; drawFrontierHull creates foundry slab/vent and cryo crystalline silhouettes with role colours, no stat changes. Weighted eligible rail/minelayer or interceptor/hunter roles borrow the same specialist cadence/quota. Terrain cycles foundry cover/conduit/station, cryo cover/current/station; ice cover custom shape.

Ordinary hazards every10/11sec after initial12sec,1.8s warning. Vent180×38 active1.2s; fracture155×28 active0.8s. Oriented rectangular collision with12-unit player padding; broadphase radius half-diagonal. Warm dashed/solid exact lane border in final threat layer, never generic circle. Uses existing per-hazard0.7s damage tick and20damage. Max24 hazards; boss holds ambient clocks/lifetime/damage as existing.

Each new route uses existing3/6/10minute progression, boss health tier curve similar to preceding sectors and existing effective damage/rewards. Dedicated attack alternates aimed fan volleys(5/7/9) and2/3/4 rectangular lanes;1.5s volley/placement telegraph, then each placed hazard warns1.5s. Phase2 faster volleys/cooldown; boss-owned lanes continue while ambient held. Boss silhouettes gain tier cores/arcs. Uses common hostile bullet limits. Foundry maps to techno soundtrack, Cryo to jungle; avoids missing music track crash. Existing sectors untouched except shared rectangle collision dispatch defaults to original circular rule.

TEST-FRONTIER-SECTORS covers first-clear gating, six boss routes/ending, warning no-damage, oriented collision, ordinary boss holds, themed/familiar mix, archive IDs, soundtrack map,24hazard cap, RNG/state-pure draw across quality, bounded180-enemy real updates. Existing saves/menus/caches/run structure checks passed. These are native stability checks, not device FPS/human balance. Browser release QA follows publication.


Live QA: d4535d3 published via Pages run67(41512756572), Success1m21s. DEV Foundry and Cryo launches,25fighters and first boss each rendered without application-origin console errors. No permanent progression. Screenshots in task workspace. Phone390×844 selector check found existing auto-grid rows compressing sector card contents; set max-content rows and card minimums, and corrected missing sectorPreview insertion. Follow-up polish publication retains v0.31.0. All native checks above passed, including music worker/transport; these short live checks do not establish phone FPS or full-run balance.


# v0.32.0 - Neon Undercity / boss identity

city in sector catalogue/unlock(first clear)/archive/DEV/2-of-3 hull mix/music(grid DnB). drawCityArena:340world-unit roads,4 roof blocks/tile, windows, roof equipment, signs and2 light streaks/tile; viewport bounded, no RNG, reduced motion static. Roofs explicitly decorative below ship. Existing cover/station/conduit cycle and specialist interceptor/rail weighting within same quotas. City security hull has twin light bars; boss tiers add side banks and chassis.

City roster Interdictor/Enforcer/Overlord all unique;18 names across6maps tested. CityPlan snapshots ray origins/angles and lane rectangles during1.5s telegraph; warning and execution consume exact same plan. Tier0:3shot tight fan/one260×30 lane. Tier1:6shots from two emitters/two310×30 parallel avenues around central corridor. Tier2:12shot partial ring with forward escape wedge/four340×30 lanes centred±105 around safe central pocket. Phase2 speed/cooldown acceleration; existing180hostile and24hazard bounds. Placed lanes warn1.8s, active.9s, inherit20damage/.7tick and rectangular player padding. Ambient lane12sec cadence, existing initial12sec; boss holds ambient clock/life/damage. Original3/6/10min route/clear/reward pipeline used.

Cryo differentiated: paired side emitter pincer(6/8/10shots), radial fracture placement170units from lock-on centre; Foundry retains5/7/9heavy fan and parallel rows. Warning geometry matches emitters. Existing tier health/reward/movement retained. Original3sector behaviours unchanged. Selector now shows actual boss roster under preview; min-content card sizes/scroll remain.

TEST-CITY-SECTOR asserts6catalogue/18unique names, unlocks, three plan shapes/counts/safe gaps, warning no-damage then collision, ambient holds, finalclear, mixedfleet/archive/music,24hazard cap, low/high/auto/reduced RNG-free pure draws and180enemy real updates. Updated frontier volley counts. Native menus/saves/frontier/runstructure pass. Live release smoke follows publication; native/CSS tests do not establish phone FPS/human balance.


## v0.32.1 - preview correction
James rejected the schematic sector previews. Replaced sectorPreview with cached detailed SVG scenes(320×180), shared restrained palette and miniature ship/terrain motifs. Static illustrative previews rather than literal screenshots. Sector-specific class and grid(min265px) create3-column desktop /1phone, edge-to-edge16:9 image; existing scrolling/content-height rows retained. Locked sector cards stay full opacity and use explicit unlock status; disabled selection unchanged. No new canvas, timer, RNG or network. Native menu/city regression checks passed; browser visual QA follows publication.


## v0.32.2 - requested gameplay screenshots
User clarified literal gameplay stills. Captured all6maps from livev0321 via ordinary DEV controls(Vanguard,25fighters,firstsectorboss; no permanent progression). CUA screenshot clip x202 y200 w960 h540 excludes HUD and includes actual scenery/ship/boss. No illustration generation or rendering replacements. Saved6sector-ID.jpg originals and embedded JPEG bytes into sectorGameplayStills; sectorPreview outputs image only. Removed SVG illustration generator/cache. Compact two-column desktop grid with horizontal image/details cards; one-column below800px, phone preserves complete row content and scrolling. Version0322. Native menu/city checks and image signature/dimension checks, followed by live screenshot/UI verification.


## v0.33.0 - high-altitude Neon Undercity
Approved cloud/neon concept implemented as live procedural scenery: small varied rooftops, L/circular footprints, stepped high-rise crowns, pink/cyan roof lights, analytic street traffic trails, trains and translucent cloud wisps below combat. City uses0.55 camera parallax for distance. Scenery does not alter enemies, damage, collisions, hazards, rewards or saves. Reduced motion freezes traffic/trains/clouds; Low/crowded Auto reduces traffic lanes and cloud count. Static320px tiles cache in a32-entry LRU; one512×96 cloud sprite is reused, no per-frame shadow blur, particles or global RNG. At most100 visible traffic cells processed. TEST-CITY-SCENERY verifies cache reuse/bounds, render purity/RNG independence and reduced-motion time invariance. Existing city/menu/readability tests pass. Device FPS is not established by native checks. Actual gameplay sector still refreshed after deployment.


Live v033 QA: initial Pages73(41522998443)47s Success; polish Pages74(41523489958)1m12s Success. Live check caught correlated coordinate hash; added avalanche mixing so neighbouring lots/roofs differ and reduced highrise frequency to18%. Strengthened neon and cloud texture modestly. Final live code hash marker verified after cache-busting reload. DEV25fighter+boss scene ran to11seconds/4kills, lockdown lane readable over city; no app-origin console errors, no permanent progression. Refreshed city preview from exact960×540 gameplay crop, never generated concept art. These are short control/render checks, not physical phone FPS/full-run balance.


## v0.33.1 - neon traffic lights
Traffic now uses two cached96×20 light sprites with fading coloured tails, layered soft halos and paired bright headlights/taillights, rotated along roads. No per-frame shadow blur or particles; Low uses reduced intensity/count, reduced motion still freezes positions. Original simple-line fallback only when offscreen canvas is unavailable.


## v0.33.2 - centred touch ability labels
The circular ability control now removes inherited menu padding and uses explicit flex centring, unit line height, zero letter spacing and native-appearance reset. Dash counts, boost/phase labels and recharge times share the same centre at both 64px and 72px sizes.


## v0.34.0 - public website and installation
`home.html` is the public landing page with actual gameplay, controls, sectors, install help and user-reviewed GitHub feedback/downloadable reports. Bare root URLs redirect to home; existing versioned URLs and index.html still open the game. New menu links open the website without abandoning the run. Manifest, existing approved logo icons and a versioned service worker support standalone installation/offline shell; no forced activation during a run. Bump sw.js CACHE with future changes. Local save origin/keys unchanged. Domain remains free GitHub address by user choice. Cloud account integration is prepared but disabled pending an owner Supabase project and RLS/auth/email verification; see CLOUD-SETUP.md. Do not describe cloud saves as live.


### Pending Supabase activation
Owner supplied public config for project `kykieqonuxpvvtwjnlfd`. Auth settings reachable with publishable key; email enabled, sign-ups allowed, confirmation required. Cloud table returned PGRST205 (not in schema cache). Local cloud-config.js now holds public URL/key with enabled:false; cloud-save.js explicitly requires enabled:true. Not published yet. Supabase plugin discovered and suggested to execute schema and verify RLS without admin secrets. Await confirmed connection; never activate or claim production cloud sync before tests.


### Supabase database completed, sender pending
Dashboard GitHub sign-in succeeded for owner. Public schema initially empty. Applied CLOUD-SAVES.sql (PUBLIC/anon table privileges revoked) and ran TEST-CLOUD-SECURITY.sql with a full editor replacement (Ctrl+A, Backspace, fill). Test PASS: own saves, reciprocal cross-account read/write denial, forged owner denial, revisions/CAS, anon read/RPC; all test users/data rolled back. REST confirms 401/42501 for anonymous table and RPC. Captured proof reactor-rogue-cloud-security.jpg in workspace. Email templates on free project require custom SMTP or Pro; SMTP not configured. Owner selected help setting up sender; propose Brevo verified sender. Browser controls then timed out twice; no further dashboard mutations. Cloud remains disabled, no live auth session test. Pending local files: cloud-config.js/cloud-save.js explicit enabled gate, CLOUD-SAVES.sql revoke PUBLIC, TEST-CLOUD-SECURITY.sql, CLOUD-SETUP.md and this handover. GitHub writes still 403, not published.


## v0.34.1 - direct feedback and wording
Removed em dashes from game/website wording and project notes. Website feedback now POSTs to the Supabase public rr_submit_feedback RPC, no account/email/GitHub required. Reports live in rr_private.feedback, not a public listing; owner reviews through the Supabase Table Editor or SQL Editor. Public roles cannot read, update or delete the inbox or access cloud saves. Bounded private SECURITY DEFINER intake with fixed SQL and empty search_path, invoker public wrapper, validation, honeypot, advisory-lock-serialised cap of 10 reports/minute and 100/24h, and UUID idempotency. These are basic beta spam controls, not per-user CAPTCHA protection. No IP address, email address or browser user agent stored in reports. Download remains an offline fallback. Cache version bumped. Cloud account sign-in remains disabled pending SMTP setup; feedback does not use Auth or SMTP. TEST-FEEDBACK-SECURITY.sql passed on project with transaction rollback; TEST-FEEDBACK.cjs covers success/retry/error/duplicate/validation. Existing save/menu and offline-shell tests pass.
