# v0.7 — ship identity and progression feedback

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

# v0.6.1 — menu and progression review

- Fixed page-wide `touch-action:none`: body/menus now permit native scrolling; canvas alone owns flight gestures. All dialog panels are bounded and scrollable. Hangar has a single independently scrollable content pane with fixed tabs and Back; tab switches reset scroll position.
- Main menu: one selected ship preview plus compact roster. Locked roster entries open the matching Hangar detail. Desktop Hangar has a list/detail layout; mobile has a horizontal two-row roster above the detail. Owned ships never display misleading incomplete unlock bars: retained legacy ships explicitly explain ownership.
- Tool upgrades use consistent rows, clear current/next allowances, rank pips, prices, disabled states and exact shortfall. Shared permanent/next-run instructions replace repeated paragraphs.
- Functional fix: opening Hangar from Pause calls `commitHangar('progress')` before rendering. Current credits, challenges and contract rewards become usable immediately, with existing checkpoint deduplication. This does not refill current-run tools or create an extra run record. Close refreshes Pause wallet and launch summary.
- Settings is split into Movement, Weapons, Audio and Gameplay pages, with a fixed Done action. Records tabs show their selected state and retain a sticky Back action.
- Settings, records and Hangar hide/restore their parent menu rather than stacking translucent dialogs. Start/back dismiss every secondary overlay, including Hangar and specialisation. HUD elements hide while a menu is active. Dialog roles added for accessibility.
- Pause uses structured overview cards; results use summary statistics and a distinct earned-credit/wallet breakdown. Field manual rewritten into concise expandable instructions; obsolete version notes removed. Records have a single entry point with internal tabs.
- Tests: one-screen transitions and return paths; pause-Hangar banking/dedup; purchases during run vs next-run allowances; locked/ready/unaffordable/legacy ownership states; results navigation; all v0.6 progression/ability and v0.5 weapon/boss regressions; Canvas render paths and original Neon Expanse preservation. Live desktop menu screenshots complement simulation tests. Physical iPad touch remains manual QA.

---

# v0.6 progression — 31 October 2026

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

Backlog — deliberately deferred: optional convoys, distress signals, reactor station objectives and risky caches. No new objective/event system added in v0.6.

---

# REACTOR ROGUE — current handover

## v0.5 — 31 October 2026

Use `index.html` in this repository as the source of truth. The historical notes below describe earlier builds.

- Weapon accounting is centralized in `hit`: actual enemy HP removed after armour, excluding overkill/scenery. The optional fourth argument preserves ownership for piercing shots and singularity fields. Source aliases handle DOT, mines, evolutions and synergy effects. Ship/reactor/environment damage is its own row.
- `weaponStats` stores damage, bossDamage, kills, hit events and game seconds equipped. Pause → Weapons, results, and expandable Recent runs display breakdowns. DPS includes idle time while equipped, excludes pauses and uses game seconds at any speed. Snapshot/cleanRun round-trip bounded stats; older records show unavailable rather than invented data.
- Initial tuning: harpoon 8+4L → 10+5L; mortar 35+18L → 42+21L; phase torpedo 28+14L → 38+20L. Gravity tick 7+5L → 6+4L; poison tick 5+4L → 4+3.5L. Upgrade previews share the new values. This is an initial balance pass, not a claim that all builds have equal DPS.
- `sectorBossDefs`: original Neon Expanse unchanged. Belt: Grapple Corsair, Scrap Crusher, Salvage Dreadnought. Storm: Relay Keeper, Arc Conductor, Tempest Citadel. All use the existing 3/6/10 minute schedule and mutation/cache/victory pipeline.
- Sector boss attacks alternate projectile patterns and 1.5-second ground warnings. Belt drops moving salvage hazards; the final carrier also launches physical debris. Storm bosses use arc zones; later tiers deploy at most two destroyable firing relays, increasing boss armour from 20% to 40% while any relay is alive. Below half health attacks accelerate. Boss defeat clears owned relays and hazards.
- Automated checks: full boot, save/load stats, overkill/death guards, all 26 weapon attribution sums, all nine bosses, warnings, relay cap/armour/cleanup, pause/results, v0.4 mechanics regression, responsive render paths, and original arena byte-for-byte preservation. Runtime harnesses use mocked DOM and real simulation; hosted browser checks supplement them. Full human ten-minute runs and physical iPad touch remain manual QA.

---

# NEON SWARM — Development handover

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


## Subsequent update — Reactor breaches and touch-only controls

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


## Latest preference — no multikill callouts

The user found multikill callouts excessive in dense fights. All multikill banners and associated audio have been removed. Keep score multiplier UI and its celebrations. Historic and current multikill statistics still track silently. Do not restore multikill announcements unless requested.


## Latest update — Knockback and destructible salvage

- Shot impacts impart damped momentum; brutes/elites/bosses have greater mass. Colliding with enemies pushes them away even when the pilot is temporarily invulnerable. Dash rams deal damage and a stronger impulse; Bastion is strongest.
- Added drifting, spinning asteroids and neon supply wreckage, initially seeded and replenished around the moving arena (cap 24). Debris is pushable rather than an impassable wall.
- Breakable objects take damage from projectiles, beams, orbiting blades, blasts and dash rams. Wreckage guarantees a supply drop plus XP; asteroids yield XP with a chance of repair, magnet or boost drops. Loot quality uses Luck.
- Auto-targeting prefers live enemies and only falls back to debris when no enemy is in range. Broken debris gives points using the current score multiplier, but does not count as an enemy kill or multikill.
- Break/death guards prevent duplicate loot. Impulses are capped and damped; debris despawns far away. Moving debris also disturbs toxic gas.
- New functions: knock, addDebris, seedDebris, hitDebris, updateDebris, drawDebris. Player projectile collision includes enemies and debris; gasBlast applies physical blast pressure and debris damage.
- Verified in mocked runtime: weighted knockback resistance, priority targeting, single loot emission, dash rams, impulse decay, blast damage, and combat in hybrid/mouse/keyboard/touch. Browser visual and physical-device validation still needed.


## Latest update — Sparse asteroids, fragments and damaging shrapnel

Supersedes earlier guaranteed loot / density notes: initial debris is 6 whole objects, replenished every 8 seconds up to 8 whole objects. Total fragments/objects capped at 48. Asteroids split once into 2–3 small physical chunks which expire after 6 seconds; fragments never split or drop loot. Auto-targeting ignores fragments. Explosion pressure charges whole debris and fragments for 2 seconds; fast pieces moving toward enemies deal momentum-scaled damage and knockback, once per target per blast charge. Friendly debris does not hurt the pilot. Ordinary bumps alone do not cause shrapnel damage. Surviving fragments inherit parent blast charge and hit history. Objects can drop nothing: asteroid XP chance 28%, supply chance 12%; wreckage XP chance 65%, supply chance 50%. Independent rolls. Verified fragmentation, no duplicate loot, sparse spawning, expiry, target priority, momentum damage/guards and all control-mode simulations. Visual/browser testing remains unverified.


## Latest update — Explosive fuel cells

Sparse debris now includes orange pulsing fuel cells (20% of whole-object spawns; wreckage 22%; rest asteroids). Shooting/destroying one triggers a 155-range blast, enemy damage, physical pressure, gas ignition and nearby fuel-cell chains. Each cell explodes only once, creates five fast temporary hull shards subject to the 48-object cap, awards points and chain progress, and drops no loot. Friendly explosions do not hurt the pilot. Shards are emitted AFTER the blast/chain propagation so they survive their own explosion. New function detonateFuel; fuel property on whole debris; fuelShard marks its fragments. Tests cover cell chaining, gas ignition, enemy pressure/damage, live shrapnel, no duplicate reward, no self-damage and bounded combat. Visual/browser inspection remains unverified.


## Latest update — Warning fuses and dramatic chains

Fuel cells now arm on lethal damage: HP stays at 1, a ~0.65s fuse flashes the cell and shows a countdown ring, then detonateFuel marks it broken/dead. Repeat hits cannot reset the fuse. Linked cells each get their own warning delay. chainBlastFX tracks consecutive fuel/gas detonations within 1.8 seconds and escalates multi-layer shockwaves, spark output, shrapnel (5–10 per fuel cell), capped screen shake (16 maximum) and a brief subtle warm screen tint. Visual blast size grows without expanding fuel damage radius. Reduced-motion suppresses viewport shake/tint. Debris cap remains 48. Test checks passed for fuses, sequential propagation, no duplicate explosions, bounded fragments, visual effect code paths and tint decay with/without reduced-motion. Browser visual inspection remains unverified.


## Latest update — Reactive smoke, scorch marks and salvage-only consumables

Hot explosions/gas-chain blasts now leave scorch marks (~24s, cap 48) and drifting grey smoke (~8s, cap 18). Smoke uses the gas disturbance simulation with seven lobes: ship/enemy/debris motion, shots, beams and blast pressure stir it. Smoke has no poison damage and cannot ignite. Scorches render under objects; smoke stays under ships and attacks. Nearby simultaneous marks are deduplicated, reduced-motion stops extra drift, and all aftermath expires. Added s.smoke/s.scorches and addAftermath/updateAftermath/drawSmoke/drawScorches. Salvage drops are explicitly tagged origin=salvage and restricted to repair/vacuum/speed/damage/defence plus XP gems; a defensive collection guard converts any invalid salvage passive to repair. Permanent passive drops from enemy supply rolls remain unchanged. Verified creation, flow response, shot wakes, bounds, expiry, reduced-motion and consumable-only salvage in mocked runtime. Browser visual inspection remains unverified.


## Latest update — Six ships and more visible salvage

Three new pilots join the original three: Harrier (85 HP, speed 210, Scatterburst starter +2 starter pellets, 3.5s/1000-speed dash), Glacier (105 HP, speed 170, Frost Shards starter, 0.5 HP/sec innate regeneration, 4.2s/780 dash), Tempest (90 HP, speed 195, Arc Discs starter, all weapon cycles 10% faster, 3.8s/920 dash). Distinct hulls and picker silhouettes; responsive picker uses 3 columns desktop / 2 mobile. All sixteen weapons remain available to all pilots. Manual fire still governs only the chosen starter. New starters receive proper pilot firing-rate modifiers. Save validation, per-pilot stats and records include all six IDs.

Salvage was too sparse: now 10 visible initial objects (5 asteroids, 3 wreckage, 2 fuel cells), replenished every 4.5s up to 12 whole objects. New salvage appears near visible viewport edges rather than far beyond view; initial locations avoid the pilot. Fragment cap remains 48; consumable-only loot rules remain.

Also corrected the turret render layer so it draws once independently of hull/armour, including unarmoured pilots. Verified balanced canvas transforms across all six hulls and armour levels. Runtime checks passed for starters, manual gating, special traits, all-pilot save/stat support, visible salvage, and combat across all input modes. Visual/browser checks remain unverified.


## Latest update — Full sixteen-weapon evolution roster

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


## Latest update — Pause evolution tab and limited upgrade tools

Evolution recipes/effects now live only in a separate Evolutions tab inside Pause; Overview keeps run multipliers, mutations and upgrade-tool counters. Removed recipe hints from level-up cards to reduce clutter. Every new run starts with 3 Skips, 3 Rerolls and 3 Banishes. Skip consumes the current level-up without an item or XP refund. Reroll draws three new legal choices at the same level (avoids the previous set when enough alternatives exist). Banish toggles selection mode; select a displayed item to exclude it from future level-up/breach choices without removing equipped levels, then choose from fresh cards. Cancellation costs no charge; repair fallback cards cannot be banished. All counters/banished IDs reset on new runs; queued XP levels remain intact. Tools apply to normal level-up choices, not automatic floor consumables or boss mutation selections. New functions: drawUpgradeChoices/renderUpgradeChoices, skipUpgrade/rerollUpgrade/toggleBanish/banishChoice, setPauseTab. Tests passed for per-run limits, no duplicate XP/levels, banished pool exclusion, cancellation, fallback exhaustion, queue processing and pause-tab rendering.


## Latest update — Distinct weapon firing patterns

Forward turret weapons: Neon Bolts, Needle Repeater, Siege Cannon, Scatterburst, Pulse Laser, Void Lance. In Auto they fire only when a target is within a forward cone; they no longer pivot every weapon toward the nearest enemy. Turn the turret using your selected controls. Arc Discs use rotating radial spokes; Frost Shards use 360-degree rings; missiles launch around the pilot and then home. Lightning, seeker drones, gas and gravity wells still acquire targets independently. Blades/Nova remain all-round and mines trail. Manual mode overrides only the pilot starter to an aimed forward spread, including Glacier/Tempest starters. Additional weapons remain automatic. Weapon pattern labels appear on upgrade cards. New firingPatterns/forwardWeapon/forwardTarget helpers. Radial projectile counts increased for coverage; further balance tuning may be needed. Tests passed for forward gating, all radial quadrants, independent targets, all six manual starters and evolved combined combat.


## Latest update — Distinct evolved weapon audiovisual identity

All sixteen evolutions now have evoStyles colour/accent/synth profiles and dedicated evolvedSound firing cues (layered tones/noise with individual cooldowns, existing voice cap and volume/mute respected). New evolution selection triggers a three-second named reveal, particle ring and evolution fanfare. Projectile rendering wraps projectileBase with distinct luminous cores, double trails, crystal branches, multi-ring discs, rocket armour and singularity rings. Evolved non-projectile visuals include Iron Halo shield blades, Living Plague bioluminescent tendrils, Shrapnel Garden spike rings, Tidal Collapse/Event Horizon containment arcs, gold Solar Lance beams and blue Aegis Nova. Effects are cosmetic; core weapon damage/physics unchanged. Gold laser still ignites gas. New helpers: evolvedSound, celebrateEvolution, drawEvolvedAreas and projectileBase/drawProjectile wrapper. Reduced-motion CSS/visual paths retained. Tests passed for all sixteen sound profiles, normal/evolved dispatch, mute/effects-zero, voice/object bounds and combined evolved render/runtime paths with/without reduced motion. These are mocked audio/render tests, not audible listening or browser visual verification.


## Final end-of-day verification — 30 October 2026

The ZIP was refreshed after the final evolved audiovisual update and contains the latest game, this handover, START-HERE.txt and SHA256.txt. The game parses as JavaScript and the packaged bytes were checked against the current output. No gameplay changes were made during final packaging.

Hands-on browser testing was attempted twice using approved native control and independent Playwright sessions. Native control stopped because it could not reliably identify the browser URL; isolated Chrome/Edge attempts failed during browser startup (profile/crash-reporting process failures). Therefore the assistant has NOT actually played the game or verified real browser screenshots/listening. Earlier runtime, rendering and audio checks were mocks; never describe them as real playtests. Existing game and user saves were not modified by those attempts. The user has been playing and providing feedback.

At home: attach NEON-SWARM-v0.2.html and DEVELOPMENT-HANDOVER.md to a new development chat, ask it to read both, and state the next change. This file includes later update sections which supersede earlier summaries; the current HTML is authoritative. No browser stats, settings, credentials or development-browser profiles are included in the package.


## Update — RPG damage numbers, 31 October 2026
Enemy damage now displays floating world-space numbers after power, Overcharge and critical bonuses. Normal hits are pale mint; critical hits are larger gold numbers with !. Rapid same-enemy hits of the same critical status combine within short fixed windows; labels cap at 100 and offscreen hits are omitted. Numbers use game-time expiry, pause with combat, reset per run and suppress drift/pop under reduced motion. Displayed damage includes overkill to make weapon strength comparable; lifetime damage tracking remains capped to actual HP lost. No damage balance changed. Helpers: addDamageNumber, damageLabel, updateDamageNumbers, drawDamageNumbers. Automated logic checks only; real browser/iPad visual verification remains outstanding.


## Authoritative snapshot — REACTOR ROGUE v0.3, 31 October 2026

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


## v0.4 — Ten weapons, ten evolutions, sector art and recipe UI

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


## v0.7.3 — cinematic pickup waves (supersedes v0.7.2 Purge immunity)
User requested a rippling honeycomb space shockwave which destroys all enemies, plus a cooler freeze effect. `launchPickupWave`, `updatePickupWaves`, `drawPickupWaves`, `drawFrozenHull` implement Canvas-native effects, not external bitmap assets.
- Purge snapshots all visible living ships, including bosses and arrival ships, and resolves their normal hit/death path as the front reaches their activation distance. Arrival protection is intentionally removed for this pickup. Offscreen/future enemies are not targeted. Boss credit, XP, caches, mutations and victory remain on the normal path. Huge overkill numerals and pickup critical chains are suppressed. Pending upgrade/reward menus wait until the target snapshot is cleared.
- Three trailing rings, a flattened disc, warm/cold hexagon fronts and bounded hull shards. Up to4 active waves and210 shards. Replacing an oldest wave resolves any outstanding kills first, so spam cannot lose rewards. FX live outside the generic150-effect cap. Hex draw work is viewport-clipped and capped850 cells per wave.
- Chrono keeps its v0.7.2 mechanics (10s, bosses2s) with a blue pulse and hull-anchored translucent ice facets, cracks and six spikes; this treatment also applies to weapon freezes. Synthesised bass-pressure and ice cues honour sound settings. Reduced motion retains static fading rings/honeycomb and ice plates, with no expansion, shimmer, shake or shards.
- Automated test-drops073.cjs covers weighted drops plus travelling kills, visible boss kills, offscreen exclusion, duplicate death, bounds, cleanup and both motion modes. Actual Canvas2D renderer produced a paired24-frame animation preview. Existing v0.7/menu/v0.5 regressions pass. No physical iPhone/iPad testing.


## v0.7.4 — combat explosion visuals
`combatExplosion`, `updateCombatExplosions`, `drawCombatExplosions` add visual-only detonations to normal enemy/boss deaths, non-fragment debris, gasBlast impacts and chainBlastFX. Purge retains its separate honeycomb/shard treatment. No new random draws: shard direction/speed/life use deterministic geometry and positions, preserving combat/drop RNG.
- Radius26 for basic ships,48 for strong ships,80 for elites,160 for bosses; impact sizes clamped15–190. Durations0.48/0.8/1.1s. Frozen kills use icy colour/core rather than warm fire.
- Up to48 blasts and180 shards; merge same-frame overlapping blasts, allowing a larger boss blast to replace a small impact. Viewport culling, local bloom instead of extra fullscreen flashes, and compact normal ship bursts protect readability. Existing smoke/scorch pools remain bounded18/48.
- Rendering: radial reactor bloom, short white-hot centre, two pressure rings, fragmented arcs, radial streaks, flattened disc on larger blasts, glowing hull chips and fading embers. Reduced motion has static fading cores/rings, with no moving shards, streaks or expanding geometry. Existing screen shake settings are unchanged.
- Verified via test-explosions074.cjs: no RNG or combat accounting changes, caps/cleanup, merge promotion, duplicate deaths, icy shatter, balanced Canvas state in both motion modes. Actual Canvas2D renderer generated25 animation frames. Existing v0.7.3 drop/wave, v0.7, menu and v0.5 checks pass. No physical mobile hardware test.

Small ship destruction now uses a short synthesised pop; boss death uses a low reactor detonation. Both honour existing audio volume/mute/debounce behaviour. No additional fullscreen flash or shake was introduced.


## v0.8 — graphics controls and adaptive quality
- Added Settings → Graphics & Effects with native labelled selects and a scrollable two-column label/control layout. Existing horizontal tab navigation, parent restoration and touch scrolling remain. Preferences use the independent `ns_graphics` key, validated through an allow-list. Invalid JSON/fields safely default; blocked storage is session-only. Reset affects graphics only.
- Presets: Low = no blur/particles/smoke/shake/flash, simple explosions, combined numbers,75% playfield resolution; Medium = capped3px glow,25% particles, reduced smoke, detailed explosions, combined numbers, low shake/reduced flashes,100%; High = original full effects, individual numbers,100%. Custom retains explicitly chosen effective settings. Changing FPS limit, FPS counter or motion does not disable Auto. Manual visual changes capture the active preset then switch to Custom.
- Auto starts Medium, lowers after two consecutive2s slow windows (>125% target frame interval), recovers after nine consecutive2s headroom windows (within112% target and JS cost<35% budget). Ceiling Medium prioritises performance; High remains manual. It ignores paused/menu/background frames. Effective choices and current tier appear in Settings. No enemy count or damage/difficulty changes.
- All Canvas shadowBlur assignments use the small `graphicsShadow` helper (Off0, Low capped3px, High original). No rendering proxy. Particles, hull shards and engine trails are capped/trimmed by preference. Cosmetic particle RNG is now separate from gameplay RNG; render shake also uses deterministic visual noise, so quality/FPS choices do not consume combat/drop random rolls.
- Smoke Off uses clear simple toxic/burning footprint circles; decorative smoke is skipped. Critical enemy outlines, projectiles, boss warnings, hazards, freeze outlines and pickup markers remain in every mode. Simple purge retains its travelling kills and ring; only detailed mesh/disc/shards are omitted. Reduced motion follows device by default with explicit On/Off overrides; it also suppresses shake/flashes and CSS decoration.
- Resolution50/75/100% multiplies the existing capped DPR, with logical W/H and input coordinates unchanged. Menus/HUD/FPS are DOM and stay sharp; in-world Canvas graphics including combat text scale with the playfield.
- FPS limit schedules only drawing, using a deadline to avoid under-running60FPS on144Hz monitors. Simulation/audio still update on each requestAnimationFrame and retain existing simulation timing/substeps. Counter reports rendered frames every2s. 30/60/display scheduling tested against60/120/144Hz synthetic callbacks, including equal simulated elapsed time.
- test-graphics08.cjs covers presets, Custom, persistence/reload/reset, corrupt/blocked storage, OS motion, auto hysteresis/manual locks, budgets, separate visual RNG, equal hit damage, number modes, frame pacing and all render modes. Existing combat/progression/menu suites pass; legacy full-particle effect tests explicitly select High. Native Canvas heavy-scene comparisons are diagnostic CPU raster measurements, not browser/device FPS. No physical iPhone/iPad test.


## v0.8.1 — contextual upgrade combinations
Expanded upgradeSynergy into a compact per-card hint renderer for all26 evolutions and10 weapon combinations. It checks actual s.items ownership of either component; an offered but unowned item does not count as ownership. It displays both names, owned/missing marks, weapon level/5 and ready-cache/evolved/active-combo/completes-combo status. Shared passives show only relevant recipes with an owned part. Unknown/recovery options have no hint. Stats remain ahead of hints; the fixed mobile card grid is retained. No recipes, slot rules or gameplay values changed.


## v0.8.2 — clean per-run upgrade hints
Ownership/evolved state was already reinitialised by start(), and upgradeSynergy reads s.items rather than persistent data. start() now also clears the global choices array and #choices markup explicitly, removing stale cards/hints immediately at the new-run boundary. Cross-run regression covers restart, different pilots and persistent archive/Hangar evolution history; starter-owned recipes correctly remain visible.

## v0.8.3
Only the missing second component card shows contextual evolution/synergy hints. Already-equipped cards return no hint, including completed/evolved pairs. Current-run ownership and start resets remain authoritative.

## v0.9.0 — priority enemy ships
Existing shield carriers gain a distinct wing silhouette. Hunters lock a 0.95s warning lane before a 0.5s charge; volatile ships leave a 0.45s enemy-only chain blast; fighter carriers warn for 1.2s before launching two fighters (six alive and twelve total per carrier). Introductions at 50/80/105/145 seconds, using the existing specialist spawn budget. Caps: 12 specialists, two shield/fighter carriers each, four other specialists per role, 240 total ships, 24 queued chain blasts. Freeze pauses abilities; carrier protection retains existing 20% reduction, damage numbers use actual mitigated damage, chain damage is attributed to the triggering weapon. No new cache farming or permanent progression. Contextual hints remain missing-component-only and reset each run.

Validation: role-specific warning/freeze/charge tests, shield mitigation/removal, delayed two-ship chains and weapon attribution, purge suppression, reinforcement lifetime/active caps, 240-ship simulation and native Canvas2D rendering passed. Existing menu, contextual-hint, graphics, pickup and explosion suites checked. Visual QA uses a staged native Canvas2D scene; device FPS has not been measured for this update. Distress signals remain deferred.

## v0.10.0 — roadmap step 1: optional distress signals

The ten-step plan is saved in ROADMAP.md. Only step 1 is implemented. Step 2 is next; do not start it automatically.

Signals extend the existing s.breach slot and breachSelect/breachReward surfaces. initDistress resets the deck, sequence, choices, run log and three separate distress metrics. First opportunity is at 75 game seconds; shuffled rescue/defend/reactor opportunities precede an original breach, then repeat in endless. Unanswered signals last 55s, with a 75s wait after expiry/dismissal; accepted objectives use a 100s wait after completion/failure. One encounter/pending reward at a time. Classic breach settings and unlock accounting are retained.

Rescue: board within 65 units for 3s, then reach a gate 240 units from the ship within a total 50s. Freighter: 120 hull, 22s defence inside radius 130, total limit 55s; marked raiders pursue it, dealing 6 hull damage per 0.85s at contact. Hostile shots hitting the hull deal at most 8 damage and are consumed. Freeze stops raider hull damage. Reactor: weapon-targetable stationary structure, 35s timer, HP 180 + min(700, level*22 + time*0.35). All regular weapon targeting includes it, including blade contact; it is immune to knockback and gravity movement. Its damage counts towards the triggering weapon but it awards no enemy kill, gem, crate or cache. Purge excludes the structure. Failure seals the reactor with a visual blast; there is no player damage penalty.

Bosses hold all signal clocks and objective damage. The reactor target is temporarily removed from enemy targeting during bosses and restored when there is capacity. Accepted signals may be abandoned; failures lose the reward and do not end the run. Freighter attackers switch back to targeting the player after completion/failure. Extra ships are bounded to 12 per encounter, within the existing 240 list cap, and have 1s arrival warnings and at least 120 units of spawn separation from the pilot. Cosmetic signal effects use existing graphics/reduced-motion controls.

Success: 20 XP, 300 flat score, and a single reward choice. Equipment uses pool() (slot, banish and max-level restrictions); absent eligible equipment falls back to 40 XP. Supplies offer 45 HP repair, or one reroll when hull is full. Payment is 25 salvage credits through addSalvageCredits, using existing Scavenger bonus/banking checkpoint logic. Separate distress counters appear in Pause/results and snapshots; they do not count towards old breach contracts or ship unlocks. Completion/reward/banking guards prevent duplicate payouts.

UI: reuse one compact objective HUD at the screen edge with direction, timer, progress and optional dismissal. Briefing pauses combat and explicitly explains the task and reward. Accept is key 1/tap, review is E/tap, Escape leaves the briefing. Reward is keys 1–3/tap. Cards use scoped compact flex layouts; phone cards stack and panels scroll. No new permanent HUD cluster.

Validation: TEST-DISTRESS.cjs covers scheduling/deck, proximity, opt-in/ignore/dismiss, staged rescue, freighter hull/cooldown/freeze/hostile shots, weapon/blade reactor damage and stationary behaviour, purge exclusion, full-slot/banish fallbacks, rewards and credit-bank deduplication, all boss holds/resume, timeout/abandonment, resets, extra-spawn budgets and legacy breaches. Native Canvas2D scenes checked for all three kinds, Low quality and reduced motion. Full simulation also completes each signal with normal automatic attacks, and checks crowded limits plus phone/tablet/desktop render paths. Existing menu, hint, specialist, graphics and pickup suites pass. Browser smoke and deployment verification are required before reporting live. Real-device iPhone/iPad FPS is not measured by the Node harness.

## v0.11.0 — roadmap step 2: eight more branching weapons

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

## v0.12.0 — step 2 extension: ten weapons, eight supports

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
