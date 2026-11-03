# Reactor Rogue maintainer notes

These notes describe the current repository structure and maintenance workflow. The playable version is 0.41.1. Earlier implementation details remain in Git history; historical benchmark results are labelled separately.

## Files and runtime

| File | Purpose |
| --- | --- |
| `index.html` | Game runtime, menus, equipment, progression, rendering and embedded core assets. |
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

Sector bosses are scheduled at 3, 6 and 10 game minutes. Defeating all three secures a sector clear, followed by an explicit choice to finish or continue into endless. Endless health and damage scale continuously from the opt-in time; sector bosses rotate every two game minutes. Population and projectile caps remain. Pause and reward screens suspend combat. Optional events auto-start after three continuous game seconds inside their marked area; leaving resets entry progress. Standard breaches retain optional risk selection. Merchant transmissions open automatically at a safe play-state boundary and suspend combat immediately. Bosses hold both systems.

Evolution hints use equipment from the current run and appear on the missing component. Evolution caches require a ready recipe when they drop. Supply caches retain their supply identity.

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
