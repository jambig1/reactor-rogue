# Reactor Rogue maintainer notes

These notes describe the current repository structure and maintenance workflow. The playable version is 0.78.0. Earlier implementation details remain in Git history; historical benchmark results are labelled separately.

## Files and runtime

| File | Purpose |
| --- | --- |
| `gpu-layer-v0700.js` | Optional Three.js GPU layer: sector background, parallax stars, glow halos and particles. |
| `index.html` | Game runtime, menus, equipment, progression and rendering. Art and the font load from versioned files beside it. |
| `home.html` | Public landing page, controls, sector gallery and feedback form. |
| `website.css` | Landing-page layout and presentation. |
| `feedback-v0341.js` | Currently shipped website feedback client. |
| `website.js` | Unreferenced source copy of the feedback client; the landing page loads the versioned file. |
| `site-app.js` | Service-worker registration and shared installation support. |
| `manifest.webmanifest`, `icon-*.png` | Browser installation metadata and icons. |
| `sw.js` | Versioned offline cache and update lifecycle. |
| `cloud-config.js`, `cloud-save.js` | Optional account and cloud checkpoint integration, currently disabled. |
| `CLOUD-SAVES.sql` | Cloud checkpoint schema and owner-only access policies. |
| `FEEDBACK-SETUP.sql` | Public submission endpoint and private feedback inbox. |
| `TEST-*.cjs`, `TEST-*.html` | Simulation checks and browser review tools. |

No application build step is required. The website expects these files to be served from the same directory. The bare site root opens the landing page; `index.html?play=1` opens the game directly.

## Current gameplay

The catalogue contains twelve ships, six sectors, eighteen named sector bosses, 48 weapon/evolution entries, 32 passive/defensive items and 31 contracts. The launch flow is Play, ship selection, sector selection, then launch. Sectors are selected in preflight rather than the Hangar. The Hangar retains licences, tools, contracts and loadouts. Equipment uses six weapon slots and six support slots. Achievement rewards range from 50 to 400 credits; ship licences range from 125 to 500, with Sovereign at 1,500 and Vanguard free. Existing paid achievements receive the payout difference once per profile, tracked by contractRewardVersion. Owned ships and challenge requirements are retained.

Sector bosses are scheduled at 3, 6 and 10 game minutes. Defeating all three secures a sector clear, followed by an explicit choice to finish or continue into endless. Endless health and damage scale continuously from the opt-in time; sector bosses rotate every two game minutes. Population and projectile caps remain. Pause and reward screens suspend combat. Fleet operations use three shuffled decks (patrol, assault and specialist) with a recovery window every fourth 40-second operation. Early operations respect specialist unlock times. Relay Circuits ask the pilot to hold three nodes in any order for 1.25 continuous seconds each before a 45-second timer expires. Relay rewards choose one conditional damage protocol for the run; replacement is explicit, no equipment slot is consumed and fresh runs reset it. The selected protocol is retained as run-history metadata.

Optional events auto-start after three continuous game seconds inside their marked area; leaving resets entry progress. Standard breaches retain optional risk selection. Merchant transmissions open automatically at a safe play-state boundary and suspend combat immediately. Bosses hold both systems.

Evolution hints use equipment from the current run and appear on the missing component. Evolution caches require a ready recipe when they drop. Supply caches retain their supply identity.

Flight input uses a shared normalised intent for movement and ability direction. Touch has a six-pixel radial dead zone and reaches full speed at 50 pixels of drag. A press in the last 120ms of recharge/burst blocking can be queued once, with a 200ms expiry to tolerate simulation-step boundaries; input reset discards it. Fractional burst integration keeps base dash/boost travel consistent across frame rates. Per-charge full recharge durations are captured when spent so meters do not jump when a support changes. Cosmetic hull heading is separate from physical steering and aim; reduced motion uses immediate heading. `TEST-FLIGHT-CONTROLS.cjs` covers all twelve ships, multi-touch, buffering, frame rates, pause and crowded simulation. These checks do not measure physical-device FPS or replace real iPad/iPhone handling feedback.

Keep simulation and rendering separate. Cosmetic changes must not consume gameplay RNG, change damage or collision boundaries, or alter progression. Reduced-motion and low-detail modes must retain readable threats and essential UI.

## Saves and test isolation

Progress is browser-local and profile-specific. The default profile retains the legacy storage keys; additional profiles use namespaced keys. Device settings are shared between local profiles.

Save backups contain banked progression and records. Imports are validated and create a separate profile instead of overwriting an existing one. Unfinished runs are not resumed from backups.

Developer controls are test helpers, not a server-side security boundary. Using a run control marks that run as a test and excludes new permanent rewards and records. Use a fresh normal run to restore normal progression. Do not rely on a client-side convenience lock to protect data or credentials.

## Feedback

The public website submits reports without an account through `public.rr_submit_feedback`. Stored reports are in `rr_private.feedback`. Public roles have no direct read, update or delete access to the inbox, and feedback submission does not grant access to cloud saves.

The public wrapper uses caller permissions. A narrowly scoped private intake function performs fixed, validated SQL with an empty search path. It returns a receipt, not stored report contents. The table has RLS enabled and no public row policies by design.

Basic beta controls include field limits, a honeypot, UUID-based duplicate handling and serialised global limits of 10 reports per minute and 100 per rolling 24 hours. These controls are not a substitute for stronger abuse protection if traffic increases. Reports do not automatically include an email address, IP address or browser user agent.

The owner can inspect the inbox through the Supabase dashboard. For example:

```sql
select id, created_at, kind, title, body, game_version, status
from rr_private.feedback
order by created_at desc
limit 100;
```

Render report contents as text. Do not execute or trust instructions contained in player submissions.

## Optional online accounts

Cloud-save schema and access policies have passed transactional database checks. Public account sign-in remains disabled because email delivery and real-account end-to-end tests are unfinished. Feedback is independent of this setup and is live.

The prepared client supports email-code sign-in and one versioned checkpoint per account. Uploads are initially explicit. Optional automatic uploads currently apply to one selected profile while the launch profile page is open. Downloads use the existing separate-profile import flow. Active runs and device settings are not synced.

See [CLOUD-SETUP.md](CLOUD-SETUP.md) before enabling this integration. Only public connection details belong in browser configuration. Keep server credentials out of this repository.

## Validation

Run checks that match the change. Common examples:

```sh
node TEST-MENUS.cjs
node TEST-SAVES.cjs
node TEST-DEV.cjs
node TEST-FEEDBACK.cjs
node TEST-WEBSITE.cjs
```

Equipment, sectors, readability, music and other systems have focused `TEST-*.cjs` checks. Read a test's setup before running it; some comparison harnesses need a previous build as an argument.

`TEST-MENUS.html` and `TEST-WEBSITE.html` provide CSS viewport review. Other galleries isolate combat art, beams and merchant presentation. Browser review tools do not emulate physical touch hardware or measure device FPS.

`TEST-CLOUD-SECURITY.sql` and `TEST-FEEDBACK-SECURITY.sql` are transactional database integration checks. Run only in a controlled test context with the required schema present. They roll back their test rows. Database role tests do not establish email delivery or complete browser authentication.

The balance and pacing reports are measurements of specific earlier builds. Automated success does not establish human win rates, final difficulty or physical device performance.

## Release checks

1. Update the game and website version labels when shipping a new playable release.
2. Bump the cache name in `sw.js` when shipped runtime files change. Documentation-only edits do not need a game version change.
3. Use a new versioned filename for changed website scripts when older service workers could otherwise serve incompatible cached code. Update the page reference and offline asset list together.
4. Do not force an offline-worker update to replace an active run. Check both fresh and returning-browser behaviour.
5. Check desktop and narrow-screen UI, navigation, saving and any changed online flow.
6. Verify the GitHub Pages deployment succeeds before describing the update as live.

Use real gameplay stills for sector previews. Keep third-party font licensing intact. Do not include private development conversations, personal account details or workstation paths in public documentation.

## v0.48 balance evidence

`BALANCE-V048.md` and `BALANCE-V048-RESULTS.json` document the matched campaign and coverage tests. Run `TEST-BALANCE-V048.cjs` for the stationary-relay and evolution regressions. `BENCHMARK-CAMPAIGN.cjs` accepts source/output paths; optional `CAMPAIGN_CASES` is a JSON array of sector, seed, profile, pilot, build and route settings. Its normal-stat controller is a regression tool, not a human difficulty or FPS measurement.

## Arsenal discovery, v0.49

Arsenal discovery is a Records tab with direct launch/pause/result actions. `archive.discovery` stores known weapon maximum levels, evolved weapon IDs, stable combination keys and one tracked recipe. Existing cleaned history/board builds contribute discoveries; future records bank into the bounded collection before history pruning. Normal in-flight gear is shown provisionally. Developer runs never bank discoveries. Tracking can be changed from the guide without banking live gear, changing random offers or touching combat stats. All data stays in the existing profile-specific archive and travels with backups. Older backups remain valid.

`TEST-DISCOVERY.cjs` checks banking, legacy migration, pruning, profile isolation/import, developer exclusion, filters, recipe states, tracking and 96 weapon icon variants. `TEST-WEAPON-ICONS.html` reviews the exact generated artwork.

## Evolution transformations, v0.50

`evolutionSignatures` defines a real timed signature cycle for every evolved weapon. `updateEvolutionSignatures` owns actors and damage; `drawEvolutionSignatures` is a pure painter. Signatures supplement existing mechanisms, except Iron Halo replaces legacy blade contacts/interception while its new cutting rings are active. Global limits are 12 fields and 96 signature shots, with at most ten nodes per field. Split missiles have one child generation. Ordinary signature projectiles share cover blocking; phase torpedoes retain their exception.

`weapon-atlas-0-v0540.webp` through `weapon-atlas-3-v0540.webp` contain 96 painted sprites. `weaponAtlasOrder`, `weaponAtlasSizes` and `weaponAtlasCell` define exact source rectangles. These external assets must be shipped beside the game and are listed in the offline cache. They are no longer embedded core icons in a standalone HTML download. The canvas and DOM icons share these files.

`EVOLUTION-TRANSFORMATIONS.md` / `.json` list every cycle. Run `TEST-EVOLUTION-SIGNATURES.cjs`, `TEST-DISCOVERY.cjs` and the base-only combat comparison. Optional `REVIEW-EVOLUTIONS.cjs` needs @napi-rs/canvas and produces labelled isolated simulation review scenes.

Support art v0.51: `support-atlas-0-v0540.webp` and `support-atlas-1-v0540.webp` contain all 32 supports in 4×4 grids. `supportAtlasOrder`, `supportAtlasSizes` and `supportAtlasCell` define crops. `equipmentIcon` routes all support surfaces through these shared sprites, independently of evolved weapon state. Ship both files alongside the game and in the offline cache.

Arsenal layout v0.52: selected-entry headings use an image/title flex row, recipe inputs are stacked named hardware rows, and the mobile browser is a bounded two-column list above the detail. `paintedAtlasIcon` uses a nested source viewport matching the crop aspect ratio; clipping only the square outer SVG allows adjacent atlas rows to leak into letterboxing. The first weapon sheet has hand-aligned column edges.

Combat art v0.53: `drawHoneycombShield` is visual only. `recordShieldImpact` records actual absorbed damage with a finite source angle; `attackArt.shieldHits` caps at six, expires in `updateAttackArt` and resets with a run. Recharge appearance is also visual state. Shield collision/capacity remains unchanged. `paintedSpriteCache` caps at 80 cropped, feathered canvases; it does not hold combat actors. `drawSupportModules` paints at most six hull fittings. Passive modules do not become extra attacking or colliding objects.
Run `TEST-SHIELD-ART.cjs`, `TEST-ATTACK-ART.cjs`, `TEST-COMBAT-FEEL.cjs` and the combat parity comparison. Optional `REVIEW-COMBAT-ART.cjs /output/path` requires @napi-rs/canvas and creates 48 base/evolved weapon cases, 32 support cases and shield-state scenes; these are simulated production-painter reviews, not browser gameplay recordings.

Asset delivery v0.54: `index.html` contains no embedded images or fonts. The wordmark, legacy attack atlas, six sector backgrounds, six sector stills, four weapon atlases, two support atlases and the Exo 2 font are separate versioned files (`*-v0540.webp`, `exo2-v0540.woff`) listed in `sw.js`. Atlases are lossy WebP (quality 90) with lossless alpha, so crop rectangles and transparency are unchanged; pixel sizes are identical to the v0.50/v0.51 PNG sheets. The wordmark is 1000×500, double its largest display size. Preflight starts decoding the selected sector background before launch. `exo2.ttf` stays as the licensed source font for native review tools; browsers load the WOFF copy. `sector-city-v0420.jpg` is kept for the README and `og:image`, where WebP support is inconsistent. When changing art, export a new versioned WebP and update the source array, `sw.js` and the related tests together.

GPU layer v0.55: `#gpuLayer` is a WebGL2 canvas beneath `#game`. `startGpuLayer` dynamically imports `gpu-layer-v0700.js`, which imports the bundled Three.js 0.187.0 from `vendor/three-0.187.0/three.module.js` (it imports `three.core.js` beside it; MIT licence included). These are the unminified build files from the official repository; GitHub Pages serves them compressed. While `gpuFrame.on`, `draw()` clears the 2D canvas instead of filling it; `drawTexturedSectorArena` hands the same seamless tile, span and pattern origin to the GPU layer and skips its 2D fill, but still draws sector ambience; the 2D particle loop is skipped; and `finishGpuFrame` collects screen-space halos for the player, enemies, shots, hostile shots, gems, blast effects and particles before rendering. The camera offset is read from the 2D transform after shake and combat kick, so both canvases stay aligned. At High glow, 2D shadow blur is scaled to 60% because the GPU halos supply the soft glow. Glow Off, Low preset, crowd mode, particle settings and reduced motion (no star twinkle) are respected.
`gpuFail` handles import failure, renderer failure, render exceptions and WebGL context loss: it hides the canvas and returns to the unchanged 2D path for the session. Settings → Graphics → GPU effects (`graphics.gpu`, on by default) is a device setting outside the quality presets. Its status line reports Loading, On, Off or Unavailable. GPU state uses `var` because `resize()` runs during start-up before the declaration.
Both vendor files are precached in `sw.js` with the game files, so GPU effects work offline from the first visit. To upgrade Three.js, add a new `vendor/three-<version>/` folder, change `THREE_VERSION` and update the `sw.js` list together.
`TEST-GPU-LAYER.cjs` checks the module with a stubbed Three.js (bounds, texture reuse, context loss, renderer failure) and the game/offline wiring. `REVIEW-GPU-LAYER.cjs` (Playwright + Chrome) runs the real game with `TEST-GPU-MOCK-THREE.js`, a raw-WebGL2 stand-in for the Three.js subset used, with the real bundled Three.js (`real`), or with the library blocked to confirm the fallback. Prefer `real`; the stand-in is for environments without WebGL-capable Three.js.

GPU background v0.55.2: WebKit (all iOS browsers) sampled black from a `CanvasTexture` of the seamless tile, so the tile is read once with `getImageData` and uploaded as a `DataTexture` (flipY false, repeat, mipmaps). After each new tile the layer renders once with stars and sprites hidden and compares five `readPixels` samples against the tile plus the dark wash. A mismatch, unreadable tile or exception switches the layer to `overlay` mode: `#gpuLayer` moves after `#game` with `mix-blend-mode: plus-lighter` (or `screen`), clears transparent and draws only glow and particles, while the 2D canvas paints the background as in v0.54. Before overlay, `TILE_STRATEGIES` are tried in order: `data` (full size, mipmapped), `pot` (resampled to the largest power of two), `nomip`, `pot-nomip`; the first passing strategy is kept. Query switches: `gpuoverlay=1` forces overlay, `gpucheck=0` skips the self-check, `gpudebug=1` appends `layer.diagnostics` (GPU name and per-strategy readback) to the Settings status line. Shader `smoothstep` calls always use edge0 < edge1, because reversed edges are undefined in GLSL and differ on Apple GPUs.

Bloom & lighting v0.56: `#gpuBloom` sits after `#game` with `mix-blend-mode: plus-lighter` (or `screen`). `createBloomLayer` (same module, second WebGL2 context) runs: prefilter of `bloomFrameCopy()` (the 2D canvas drawn at 1/3 CSS size; colour weighted by alpha because the copy is uploaded straight, so translucent smoke does not count as bright) into A at 1/4 size, plus `glow` sprites into A; separable 9-tap blur of A; downsample to C at 1/8 and blur; screen composite `A*near + C*wide` with alpha = brightest channel; then `screen` sprites (sparks, light pools) at full resolution. `collectGpuLights` builds up to 12 screen-space lights (player, combat blasts, blast fx, bosses) used by the background shader (`col += (col*1.3 + .025) * light * falloff²`) and as light pools. Strength comes from `graphicsVisual.bloom` (presets: low off, medium subtle, high full) and the flash/reduced-motion settings. All images drawn to the playfield load with `crossOrigin='anonymous'`; `bloomFrameCopy` re-checks readability every two seconds and switches to sprite-only bloom (`bloomCaptureOk=false`) if the canvas becomes tainted. With whole-frame bloom, per-entity halos are skipped and other glow sprites are scaled down. In overlay (compatibility) mode with bloom active, the bottom GPU canvas is hidden and the bloom canvas carries glow and sparks. Tuning values live in `finishGpuFrame` (threshold/near/wide) and `collectGpuLights`.

Performance v0.57: `buildShotGrid` bins live enemies into 96px cells (by their radius) once per update, immediately before the shot pass; `shotTargets(b, terrain)` returns terrain, grid candidates sorted by array index, enemies appended since the grid was built, then debris — the same bodies in the same order as the old `[...terrain, ...s.enemies, ...s.debris]`, which is valid because no hit, knock or impact moves an enemy during the shot pass (knock only sets velocity). Keep that true or rebuild the grid. `updateReactiveGas` is cosmetic, returns early when no clouds/smoke are visible and tracks previous positions as `gasStep/gasLx/gasLy`. Blade orbit offsets are precomputed per update with unchanged arithmetic plus a conservative ring test. `BENCHMARK-CROWD.cjs [other/index.html]` runs four seeded crowded fights and compares outcome hashes (`STRICT=1` asserts equality); use it with `TEST-ATTACK-PARITY.cjs` for any simulation change. Adaptive bloom: `adaptBloom` (called from `finishGpuFrame`) averages draw intervals in 2s windows during play against `bloomTargetMs()`; two slow windows lower `bloomCap`, five good windows raise it, and a relapse within 6s of raising sets `bloomUpLock`. `bloomLevel()` is the effective level; graphics changes reset the cap.

Blueprints & mastery v0.58: `hangar.blueprints` (weapon id → tier 0–3), `hangar.blueprintCursor`, `hangar.mastery` (ship id → XP) and `hangar.shipPaint` (ship id → original/ember/violet/frost/gold) are sanitised in `loadHangar` and travel in backups. `prepareBlueprints()` (start of `initExpansion`) builds `s.blueprintMult` (null when empty) and per-run counters. `hit()` passes `dmg*blueprintScale(source,owner)` to `enemyDamage`; the scale is memoised per source/owner through `damageOwner`. `awardBlueprint(reason)` is called from the elite/boss kill path (`type>=3`: every boss, every sixth non-boss), signal success and breach completion; it never uses `Math.random`, banks and saves immediately, applies the new tier at once and queues a toast shown when no other toast is active. Mastery XP = `floor(s.t) + 50·bossKills + 200·cleared`, banked as a delta in `commitHangar` via `s.hangarCheckpoint.mastery`; ranks at 0/500/1500/3000/5000. Mastery paints override `s.pilot.color` at run start; rank 5 adds one reroll and raises `s.toolCaps.rerolls`. `TEST-BLUEPRINTS.cjs` covers the rules; tests that complete signals or kill bosses in a normal run now bank blueprints, so clear `hangar.blueprints` before exact damage assertions.

Sector weather v0.59: `WEATHER_FRAGMENT` (top layer, additive, after the bloom composite) draws two procedural particle depths per sector type (`weatherTypes`: grid 1, belt 2, storm 3, foundry 4, cryo 5, city 6), scrolled by velocity × game time and camera × parallax. `render({bloom:false, weather})` skips every bloom pass, so the top canvas runs whenever `topActive()` (bloom or weather wanted). Weather events (`stepWeather`, `makeStrike`, `weatherLights`, `drawWeatherBolts`) use `weatherRand`, a private LCG, never `Math.random` or `visualRand`; they are screen-space, pause with game time and feed the shared light list (max 12) and top-layer sprites. `weatherWanted()` is false with reduced motion; lightning bolts need flashes, and flashes off leaves a faint flicker light. Settings key `weather` is part of the presets (low off, medium/high on).
Sprite rendering fix v0.59: the sprite vertex shader flips y, reversing triangle winding, so Three.js (FrontSide by default) culled every sprite on both GPU canvases from v0.55 to v0.58. Both sprite materials now use `side: T.DoubleSide`; `TEST-GPU-LAYER.cjs` asserts it, and `TEST-GPU-MOCK-THREE.js` now culls back faces like Three.js so the browser review would catch a regression.

Shader fields v0.60: `drawEnergyField` first calls `gpuFieldDraw`, which (GPU active, not overlay) sends the field to `gpuLayer.field(x,y,r,kind,colour,fade)` in screen space and skips the 2D painter. `FIELD_KINDS` maps gravity, void, corrosion/toxic, plasma, aura, net, fire/wake and storm to `FIELD_FRAGMENT` branches; unknown kinds or a full batch (64) return false and the 2D painter runs. Fields render between the background and sprites with premultiplied blending (ONE, ONE_MINUS_SRC_ALPHA): rgb glows, alpha darkens. Quads extend to 1.3× radius for outer glow and must stay double-sided. Time freezes with reduced motion. Gravity/void fields also add a soft glow sprite to bloom. All `drawEnergyField` callers pass world coordinates; keep it that way, because the GPU path converts with the camera offset only.

Quick tests v0.60: `quickTest(kind, weapon, evolve, {pilot, sector})` (kinds weapon/boss/final/swarm/endless) sets `devLaunch` before `start()`, so `initDevRun` marks the run as a developer test and nothing permanent is banked; it then applies `quickBuild` (bolt, laser, rocket, chain, frost, gravity at 5; area, power, reach, armour at 3), `quickRing` and the scenario, and sets `state='play'`. `quickTestFromURL` runs once after start-up for `?test=weapon:<id>[:evo]|boss|swarm|endless` with optional `ship`/`sector`; it needs no developer unlock because test runs cannot change progress. `devRemember` stores `rr_dev_remember` ('1'/'0') in raw localStorage; `lockDev` clears it. `hurtPlayer` stores `s.lastHitBy`; `snapshotRun` adds `cause` (defeats only, via `describeHit`), `blueprintsFound` and `masteryGain`, shown in Recent runs with `escapeHTML`. `TEST-QUICK-TESTS.cjs` covers these.

Final encounter v0.60: the third route boss kill calls `queueFinalEncounter()` (sets `s.finalEncounter={stage:'approach',at}`) instead of `finalClearPending`. `updateFinalEncounter()` runs beside the boss schedule and calls `spawnFinalBoss()` 22s later. The boss (`finalBoss:true`, `kind:'final'`, defs in `finalBossDefs` per sector) owns system pods (`systemOwner`, `system` = shield/cannon/lance) that `finalBossAttack` repositions on an orbit every frame; `finalSystemAttack` fires them (fields `podCD`, `podCharge`, `podAim`, so generic charge warnings skip them). `enemyArmour` gives the core 0.6 while any shield pod lives. Phases change at 65% and 30% in `finalPhase`. `finalBossDefeated` sets `finalClearPending` and `finalClearAt` (2.6s pause read by `resolveFinalClear`). `claimMutation` now ends the run on `finalClearPending`, not on three boss kills. Tests: `TEST-FINAL-ENCOUNTER.cjs`.

Deeper endless v0.63: `endlessThreatDefs` (seven) are added one per cycle by `updateEndlessThreats(cycle)` from `updateEndless`; `endlessThreat(id)` gates each effect (armour in `enemyArmour`, swift in enemy speed, surge in `endlessPressure().spawn`, barrage in `updateHostiles`, elites in the elite timer, repair in the enemy loop, shielded via `endlessShieldBoss`/`updateEndlessShield` reusing the final-encounter shield pods). `openMutation` offers `endlessBoonDefs` (stacking in `s.endlessBoons`, read by `enemyDamage`, `rate`, `maxHP`) once mutations are exhausted in endless. `endlessCycleCredits()` feeds `runCreditBreakdown`. `bankEndlessRecord()` (called from `finish`) writes `hangar.endlessBest[sector]={cycle,time}`. Tests: `TEST-ENDLESS-DEEP.cjs`.

Extra sectors v0.69: `var extraSectors` (declared before `sectors`) is filled at the end of the main script by `registerExtraSector(def)`, which adds the sector to `sectors` and to every per-sector table (fleet paint, boss plates, menu nebula, GPU tint, mist, terrain materials, weather, boss defs, presentations, designs, final boss). Core hooks read `extraSectors[id]` for: unlock (`sectorOpen`), fleet hull variants (`spawn`, `fitting`), terrain kinds and cover art, music, boss attacks and warnings, boss toast, ambient hazards (`hazardUpdate` in `updateExpansion`, `hazardDraw` in `drawCombatReadability`, `hazardScreen` after the vignette) and the background (`texture` painter → `proceduralSectorTexture` data URL used by `sectorTexture` and `sectorPreview`). Solar Corona: `solarHazardUpdate/Draw/Screen`, `solarShadowed`, `solarBossAttack`. Tests: `TEST-SOLAR.cjs`.
