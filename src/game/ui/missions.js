// v1.5 Mission board: short goals for your next run. Three on offer (Easy / Medium / Hard), up to two accepted.
// Progress is checked live during a run (with a pop-up when one completes); rewards are paid when the run is banked.
// `var` (not const) so nothing here can hit a temporal-dead-zone error if the hangar renders early.
var missionTierNames = ['Easy', 'Medium', 'Hard'];
var missionRewards = [{ credits: 60, xp: 80, part: false }, { credits: 120, xp: 160, part: false }, { credits: 220, xp: 300, part: true }];
var missionKinds = [
  { k: 'kills', tiers: [150, 300, 600], text: n => 'Defeat ' + n + ' enemies in one run', val: r => r.kills || 0 },
  { k: 'survive', tiers: [240, 420, 600], text: n => 'Survive ' + n / 60 + ' minutes', val: r => r.t || 0 },
  { k: 'combo', tiers: [15, 25, 40], text: n => 'Reach a ×' + n + ' combo', val: r => r.comboPeak || 0 },
  { k: 'level', tiers: [12, 18, 25], text: n => 'Reach level ' + n, val: r => r.lv || 0 },
  { k: 'breach', tiers: [1, 2, 3], text: n => 'Clear ' + n + ' reactor breach' + (n > 1 ? 'es' : ''), val: r => r.metrics?.breaches || 0 },
  { k: 'rescue', tiers: [1, 2, 3], text: n => 'Answer ' + n + ' distress signal' + (n > 1 ? 's' : ''), val: r => r.metrics?.distressCompleted || 0 },
  { k: 'evolve', tiers: [1, 2, 3], text: n => 'Evolve ' + n + ' weapon' + (n > 1 ? 's' : ''), val: r => Object.keys(r.evolved || {}).length },
  { k: 'boss', tiers: [1, 2, 3], text: n => 'Defeat ' + n + ' sector boss' + (n > 1 ? 'es' : ''), val: r => r.bossKills || 0 },
  { k: 'sectorBoss', tiers: [1, 1, 1], sector: true, text: (n, m) => 'Defeat the ' + missionSectorName(m.sector) + ' boss', val: (r, m) => r.sector === m.sector ? r.bossKills || 0 : 0 },
  { k: 'clean', minTier: 1, tiers: [1, 1, 2], text: n => 'Defeat ' + (n > 1 ? n + ' bosses' : 'a boss') + ' without taking a hit', val: r => r.metrics?.cleanBoss || 0 }
];
function missionSectorName(id) { try { return (sectors.find(x => x.id === id) || {}).name || id; } catch (e) { return id; } }
function missionKind(m) { return missionKinds.find(x => x.k === m.k); }
function missionText(m) { let d = missionKind(m); return d ? d.text(m.n, m) : 'Mission'; }
function missionReward(m) { return missionRewards[m.tier] || missionRewards[0]; }
function missionRewardText(m) { let r = missionReward(m); return r.credits + ' credits · ' + r.xp + ' ship XP' + (r.part ? ' · part drop' : ''); }
function missionSectorsOpen() { try { return sectorChain.filter(id => sectorOpen(id)); } catch (e) { return ['grid']; } }
function makeMission(tier, avoid) {
  let st = hangar.missions, pool = missionKinds.filter(d => !avoid.includes(d.k) && tier >= (d.minTier || 0));
  if (!pool.length) pool = missionKinds;
  let d = pool[Math.floor(Math.random() * pool.length)], m = { id: st.next++, k: d.k, tier, n: d.tiers[tier], active: false };
  if (d.sector) { let open = missionSectorsOpen(), i = Math.min(open.length - 1, tier * 2 + Math.floor(Math.random() * 2)); m.sector = open[Math.max(0, i)] || 'grid'; }
  return m;
}
function missionState() {
  let st = hangar.missions;
  if (!st || st.v !== 1) st = hangar.missions = { v: 1, board: [], next: 1, done: 0 };
  for (let tier = 0; tier < 3; tier++) if (!st.board.some(m => m.tier === tier)) st.board.push(makeMission(tier, st.board.map(m => m.k)));
  st.board.sort((a, b) => a.tier - b.tier);
  return st;
}
function activeMissions() { return missionState().board.filter(m => m.active); }
function toggleMission(id) {
  let st = missionState(), m = st.board.find(x => x.id === +id); if (!m) return false;
  if (!m.active && activeMissions().length >= 2) return false;
  m.active = !m.active; saveHangar(); return true;
}
var missionRerollCost = 20;
function rerollMissions() {
  let st = missionState(); if (hangar.credits < missionRerollCost) return false;
  hangar.credits -= missionRerollCost;
  let keep = st.board.filter(m => m.active);
  st.board = keep.slice();
  for (let tier = 0; tier < 3; tier++) if (!st.board.some(m => m.tier === tier)) st.board.push(makeMission(tier, st.board.map(m => m.k)));
  st.board.sort((a, b) => a.tier - b.tier); saveHangar(); return true;
}
// Run side: copy the accepted missions at launch, check them twice a second, pay when the run is banked.
function startRunMissions() { try { s.missions = s.dev?.test ? [] : activeMissions().map(m => ({ ...m, done: false, paid: false })); } catch (e) { s.missions = []; } }
function checkRunMissions() {
  if (!s || !s.missions || !s.missions.length) return;
  for (let m of s.missions) {
    if (m.done) continue; let d = missionKind(m); if (!d) continue;
    if (d.val(s, m) >= m.n) { m.done = true; s.toast = 4; try { $('toast').textContent = 'MISSION COMPLETE / ' + missionText(m).toUpperCase(); sound('reward'); } catch (e) {} }
  }
}
function payRunMissions() {
  if (!s || !s.missions) return;
  for (let m of s.missions) {
    if (!m.done || m.paid) continue; m.paid = true;
    let r = missionReward(m); hangar.credits += r.credits; s.missionCredits = (s.missionCredits || 0) + r.credits;
    try { let lv = shipGainXP(r.xp); s.shipGain = { xp: (s.shipGain?.xp || 0) + r.xp, lv: (s.shipGain?.lv || 0) + lv }; } catch (e) {}
    if (r.part) try { (s.partDrops || (s.partDrops = [])).push(grantPart(rollPartDrop(Math.min(9, 2 + m.tier)))); } catch (e) {}
    let st = missionState(), i = st.board.findIndex(x => x.id === m.id);
    if (i >= 0) { st.board.splice(i, 1); st.done++; st.board.push(makeMission(m.tier, st.board.map(x => x.k))); st.board.sort((a, b) => a.tier - b.tier); }
  }
}
function renderMissionBoard() {
  let st = missionState(), act = activeMissions().length;
  return '<section class="msn-board"><div class="msn-head"><h3>Mission board</h3><button class="msn-reroll" data-hangar-action="missionReroll"' + (hangar.credits < missionRerollCost ? ' disabled' : '') + '>New missions · ' + missionRerollCost + ' cr</button></div>' +
    '<p class="fine">Accept up to two. Complete them during a run; rewards are paid when the run ends. ' + st.done + ' completed so far.</p><div class="msn-grid">' +
    st.board.map(m => '<article class="msn-card tier-' + m.tier + (m.active ? ' active' : '') + '"><span class="msn-tier">' + missionTierNames[m.tier] + '</span><strong>' + escapeHTML(missionText(m)) + '</strong><small>' + missionRewardText(m) + '</small>' +
      '<button data-hangar-action="missionAccept" data-id="' + m.id + '" aria-pressed="' + m.active + '"' + (!m.active && act >= 2 ? ' disabled' : '') + '>' + (m.active ? 'Accepted ✓' : 'Accept') + '</button></article>').join('') + '</div></section>';
}
// small strip for the star map / launch screen
function missionStrip() { let a = activeMissions(); return a.length ? '<div class="msn-strip"><b>Missions</b>' + a.map(m => '<span class="tier-' + m.tier + '">' + escapeHTML(missionText(m)) + '</span>').join('') + '</div>' : ''; }
