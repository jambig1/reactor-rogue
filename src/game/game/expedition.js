// v1.6 EXPEDITION: a run is one journey across 5 sectors. Each sector is a freshly generated, branching route map
// (like Slay the Spire / FTL): pick your path node by node to the sector boss. Your build carries over between nodes;
// dying ends the expedition. The fifth sector ends with the final encounter; beat it to win (endless is offered then).
// Progress is checkpointed between nodes so a long expedition can be continued later.
var EXP_ACTS = 5, EXP_STEPS = 6;
// Five star systems per expedition. Each system draws its planets from a tier of world types (harder further out),
// and gets a generated name and star colour, so every expedition is a different journey.
var expTierBiomes = [['grid', 'belt'], ['grid', 'belt', 'storm', 'foundry'], ['storm', 'foundry', 'cryo', 'city'], ['cryo', 'city', 'solar', 'rift'], ['solar', 'rift', 'hive', 'ghost']];
var expActBiomes = expTierBiomes;   // kept for older saves/tests
var expWorldKind = { grid: 'Neon world', belt: 'Asteroid belt', storm: 'Storm world', foundry: 'Forge world', cryo: 'Ice world', city: 'City world', solar: 'Solar world', rift: 'Rift world', hive: 'Hive world', ghost: 'Ship graveyard' };
var expStarColours = ['#ffd56f', '#ff9a5a', '#9fd8ff', '#ff6b8a', '#c18aff', '#7dffb0', '#fff1c4'];
var expSyl = ['ka', 'vor', 'el', 'tri', 'xa', 'nor', 've', 'spe', 'ra', 'quin', 'dra', 'lo', 'thy', 'sol', 'mir', 'ze', 'cas', 'ul', 'pha', 'ron', 'ix', 'ae', 'ny', 'kor'];
function expName(rng, parts = 2) { let n = ''; for (let i = 0; i < parts; i++) n += expSyl[Math.floor(rng() * expSyl.length)]; return n[0].toUpperCase() + n.slice(1); }
var expNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
function expGenSystem(act, seed) { let rng = expRng(seed), pool = expTierBiomes[act].slice().sort(() => rng() - .5).slice(0, act === 0 ? 2 : 3); return { name: expName(rng, 2 + (rng() < .3 ? 1 : 0)), star: expStarColours[Math.floor(rng() * expStarColours.length)], pool }; }
function expSystem(e = s.exp) { return (e.systems && e.systems[e.act]) || { name: 'Unknown', star: '#ffd56f', pool: expTierBiomes[e.act] }; }
var expNodeInfo = {
  planet: { icon: '◉', name: 'Hostile planet', c: '#65f7ef', desc: 'Survive the fight to clear the planet.' },
  elite: { icon: '✷', name: 'Fortress world', c: '#ff7ab6', desc: 'Tougher fight with elites. Better loot.' },
  outpost: { icon: '◈', name: 'Lost Signal station', c: '#ffb24a', desc: 'Repair your hull and trade scrap.' },
  distress: { icon: '✚', name: 'Distress beacon', c: '#7dffb0', desc: 'A stranded pilot needs rescue.' },
  unknown: { icon: '?', name: 'Anomaly', c: '#c18aff', desc: 'Anything could be out there.' },
  boss: { icon: '☀', name: 'System star', c: '#ffd56f', desc: 'The reactor guarding the star. Beat it to jump systems.' },
  final: { icon: '✦', name: 'The last star', c: '#ff5a6e', desc: 'The final encounter. Win the expedition.' }
};
function expRng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// ---- map generation: rows of 2–4 nodes, monotone (non-crossing) links, outposts before the boss ----
function expGenAct(act, seed, sys) {
  let rng = expRng(seed), pool = (sys && sys.pool) || expTierBiomes[act], rows = [], sysName = (sys && sys.name) || expName(rng);
  let pickType = k => {
    if (k === 0) return 'planet';
    if (k === EXP_STEPS - 1) return rng() < .55 ? 'outpost' : 'planet';
    let r = rng(), w = [['planet', .46], ['elite', k >= 2 ? .16 : 0], ['unknown', .16], ['distress', .11], ['outpost', k >= 2 ? .11 : 0]], tot = w.reduce((a, b) => a + b[1], 0);
    r *= tot; for (let [t, p] of w) { r -= p; if (r <= 0) return t; } return 'planet';
  };
  for (let k = 0; k < EXP_STEPS; k++) {
    let n = k === 0 ? 3 : 2 + Math.floor(rng() * 3), cols = [0, 1, 2, 3].sort(() => rng() - .5).slice(0, n).sort((a, b) => a - b);
    rows.push(cols.map(x => ({ k, x: x + (rng() - .5) * .35, type: pickType(k), biome: pool[Math.floor(rng() * pool.length)], seed: Math.floor(rng() * 1e9), next: [] })));
  }
  // name every place: planets get a world name + numeral (orbit order), stations take the system's name
  let used = new Set();
  for (let row of rows) for (let n of row) {
    let nm; do { nm = n.type === 'outpost' ? sysName + ' ' + ['Station', 'Relay', 'Depot', 'Outpost', 'Dock'][Math.floor(rng() * 5)] : n.type === 'distress' ? 'Beacon ' + expName(rng, 1).toUpperCase().slice(0, 2) + '-' + (10 + Math.floor(rng() * 89)) : n.type === 'unknown' ? 'Anomaly ' + expNumerals[Math.floor(rng() * 7)] : expName(rng) + ' ' + expNumerals[Math.floor(rng() * 6)]; } while (used.has(nm));
    used.add(nm); n.name = nm;
  }
  // at least one outpost on the last row
  let last = rows[EXP_STEPS - 1]; if (!last.some(n => n.type === 'outpost')) last[Math.floor(rng() * last.length)].type = 'outpost';
  // no two elites/outposts in a row along the same link is handled loosely by weights; link rows without crossings
  for (let k = 0; k < EXP_STEPS - 1; k++) {
    let A = rows[k], B = rows[k + 1], i = 0, j = 0, link = (a, b) => { if (!A[a].next.includes(b)) A[a].next.push(b); };
    link(0, 0);
    while (i < A.length - 1 || j < B.length - 1) {
      if (i === A.length - 1) j++; else if (j === B.length - 1) i++;
      else { let r = rng(); if (r < .4) i++; else if (r < .8) j++; else { i++; j++; } }
      link(i, j);
    }
  }
  let boss = { k: EXP_STEPS, x: 1.5, type: act === EXP_ACTS - 1 ? 'final' : 'boss', biome: pool[Math.floor(rng() * pool.length)], seed: Math.floor(rng() * 1e9), next: [], name: sysName + (act === EXP_ACTS - 1 ? ' Omega' : ' Prime') };
  for (let n of rows[EXP_STEPS - 1]) n.next.push(0);
  rows.push([boss]);
  return { act, rows, at: null, visited: [] };
}
function expNew() { let seed = Math.floor(Math.random() * 2 ** 31), systems = [0, 1, 2, 3, 4].map(a => expGenSystem(a, seed + 31 * a + 5)); return { v: 1, seed, systems, act: 0, map: expGenAct(0, seed + 1, systems[0]), node: null, phase: 'map', stageEnd: 0, cleared: 0 }; }
function expNode(e = s.exp) { return e && e.node ? e.map.rows[e.node[0]][e.node[1]] : null; }
function expReachable(e = s.exp) {
  let m = e.map; if (!e.node) return m.rows[0].map((_, i) => [0, i]);
  let n = expNode(e); return n.next.map(j => [e.node[0] + 1, j]);
}
// difficulty is set by how deep you are, not by total time, so 40+ minute expeditions stay balanced
function expDifficultyTime(e = s.exp) { let k = e.node ? e.node[0] : 0; return Math.min(620, 30 + e.act * 112 + k * 15); }
// ---- stages ----
function expClearField() {
  // bank the XP still lying around, then clear the battlefield (the build is untouched)
  for (let g of s.gems || []) s.xp += g.v || g.xp || 1;
  s.gems = []; s.enemies = []; s.hostile = []; s.shots = []; s.mines = []; s.fields = []; s.hazards = []; s.sectorHazards = []; s.enemyBursts = []; s.debris = []; s.drops = []; s.clouds = []; s.fx = []; s.particles = [];
  s.breach = null; s.breachPending = null; s.pod = null; s.finalClearPending = false; s.bossSpawned = false;
}
function expBeginStage(n) {
  let e = s.exp; expClearField();
  s.sector = n.biome; s.t = expDifficultyTime(e);
  try { initTerrain(); initFormations(); seedDebris(); } catch (err) { console.warn('stage setup', err); }
  s.spawn = 1; s.elite = s.t + (n.type === 'elite' ? 6 : 55); s.nextBreach = s.t + 70; s.bossRecoveryUntil = 0; s.bossIndex = 3; s.podChecked = true;
  if (s.merchant) { s.merchant.next = 99; s.merchant.available = false; }
  e.phase = 'stage'; e.stageEnd = s.t + (n.type === 'elite' ? 110 : n.type === 'distress' ? 120 : n.type === 'unknown' ? 75 : 150);
  let info = expNodeInfo[n.type], where = (n.name || info.name) + ' · ' + (expWorldKind[n.biome] || n.biome);
  if (n.type === 'boss' || n.type === 'final') {
    e.stageEnd = Infinity;
    e.bossAt = s.t + 3;
  }
  if (n.type === 'distress') { let id = null; try { id = pilotPodFor(n.biome) || pilots.map(p => p.id).find(id => !(hangar.campaign?.rescued || []).includes(id) && id !== s.pilot.id && crewInfo[id]); } catch (err) {} e.podId = id; e.podAt = s.t + 8; }
  state = 'play'; resetInput(); expHideMap();
  s.toast = 4; $('toast').textContent = where.toUpperCase() + ' / ' + (n.type === 'elite' ? 'FORTRESS WORLD · ELITES INBOUND' : n.type === 'boss' || n.type === 'final' ? 'THE STAR\'S REACTOR AWAKENS' : n.type === 'distress' ? 'BEACON FOUND · RESCUE THE PILOT' : 'HOSTILES · SURVIVE');
  expSave();
}
function updateExpedition(dt) {
  let e = s.exp; if (!e) return;
  // between nodes: open the map once launch cards / the shop / an upgrade pick have closed
  if (e.phase === 'map') { expOpenMap(); return; }
  if (e.phase === 'outpost' || e.phase === 'event') { expAfterInterlude(); return; }
  if (e.phase !== 'stage') return;
  s.runT = (s.runT || 0) + dt;
  let n = expNode(e); if (!n) return;
  if (n.type === 'elite' && s.elite > s.t + 22) s.elite = s.t + 22;
  if (e.podAt && s.t >= e.podAt) { e.podAt = 0; if (e.podId) try { spawnPilotPod(e.podId); } catch (err) {} else s.elite = Math.min(s.elite, s.t + 2); }
  if (e.bossAt && s.t >= e.bossAt) {
    e.bossAt = 0;
    if (n.type === 'final') { s.finalEncounter = null; spawnFinalBoss(); }
    else { s.bossIndex = [0, 1, 1, 2][e.act] ?? 2; spawnBoss(); s.bossIndex = 3; e.bossKillsBefore = s.bossKills - 0; e.bossLive = true; }
  }
  if (n.type === 'boss' && e.bossLive && !s.enemies.some(x => x.boss && x.hp > 0)) { e.bossLive = false; expStageClear(true); return; }
  if (s.t >= e.stageEnd && !s.enemies.some(x => x.boss && x.hp > 0)) expStageClear(false);
}
function expStageClear(actClear) {
  let e = s.exp, n = expNode(e);
  for (let x of s.enemies) if (x.hp > 0 && !x.boss) { x.hp = 0; try { combatExplosion(x.x, x.y, 30, x.c || '#65f7ef', 'ship'); } catch (err) {} }
  e.cleared++; e.map.visited.push(e.node.join(','));
  // node rewards
  if (s.merchant) s.merchant.scrap += n.type === 'elite' ? 40 : 15;
  if (n.type === 'elite') s.xp = Math.max(s.xp, s.need);
  e.phase = 'clearing'; e.clearAt = performance.now() + 1600;
  s.toast = 3; $('toast').textContent = actClear ? (expSystem(e).name + ' SYSTEM CLEAR').toUpperCase() + ' / JUMP TO THE NEXT STAR' : ((n.name || expNodeInfo[n.type].name) + ' clear').toUpperCase() + ' / +' + (n.type === 'elite' ? 40 : 15) + ' SCRAP';
  try { sound('reward'); } catch (err) {}
  setTimeout(() => {
    if (!s || s.exp !== e || state === 'end') return;
    if (actClear) { e.act++; e.map = expGenAct(e.act, e.seed + 1 + e.act * 7919, e.systems && e.systems[e.act]); e.node = null; try { s.p.hp = Math.min(s.pilot.hp, s.p.hp + s.pilot.hp * .25); } catch (err) {} }
    expOpenMap();
  }, 1600);
}
// non-combat nodes resolve straight from the map
function expEnter(r, i) {
  let e = s.exp, ok = expReachable(e).some(([a, b]) => a === r && b === i); if (!ok) return;
  e.node = [r, i]; let n = expNode(e);
  if (n.type === 'outpost') {
    e.map.visited.push(e.node.join(',')); e.cleared++;
    let heal = Math.round(s.pilot.hp * .35); s.p.hp = Math.min(s.pilot.hp, s.p.hp + heal);
    expHideMap(); state = 'play'; s.sector = n.biome;
    let m = s.merchant; m.available = true; m.free = 1; m.refreshes = 0; m.visit++; try { rollMerchantStock(); } catch (err) {}
    e.phase = 'outpost'; expSave(); openMerchant();
    s.toast = 4; $('toast').textContent = 'LOST SIGNAL / HULL REPAIRED +' + heal;
    return;
  }
  if (n.type === 'unknown') {
    let rng = expRng(n.seed), r0 = rng();
    if (r0 < .3) { expBeginStage(n); s.elite = s.t + 4; s.toast = 4; $('toast').textContent = 'UNKNOWN SIGNAL / IT WAS AN AMBUSH'; return; }
    e.map.visited.push(e.node.join(',')); e.cleared++;
    let msg;
    if (r0 < .55) { s.xp = Math.max(s.xp, s.need); msg = 'Derelict cache: free upgrade'; }
    else if (r0 < .78) { let h = Math.round(s.pilot.hp * .5); s.p.hp = Math.min(s.pilot.hp, s.p.hp + h); msg = 'Abandoned repair dock: +' + h + ' hull'; }
    else { s.merchant.scrap += 45; msg = 'Salvage field: +45 scrap'; }
    expEventNote = msg; expSave(); expRenderMap(); try { sound('reward'); } catch (err) {}
    if (s.xp >= s.need) { expHideMap(); state = 'play'; e.phase = 'event'; levelUp(); }
    return;
  }
  expBeginStage(n);
}
var expEventNote = '';
// after the outpost shop or a free upgrade, go back to the map
function expAfterInterlude() { let e = s && s.exp; if (!e || state !== 'play') return; if (e.phase === 'outpost' && !(s.merchant && s.merchant.available)) expOpenMap(); else if (e.phase === 'event') expOpenMap(); }
// ---- route map overlay ----
function ensureExpMap() {
  let el = document.getElementById('expMap'); if (el) return el;
  el = document.createElement('section'); el.id = 'expMap'; el.className = 'overlay hidden'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = '<div class="panel exp-panel"></div>'; document.body.appendChild(el);
  el.addEventListener('click', ev => { let b = ev.target.closest('button'); if (!b) return; if (b.dataset.expNode) { let [r, i] = b.dataset.expNode.split(',').map(Number); expEnter(r, i); } else if (b.dataset.expQuit) { expSave(); backToStart(); } });
  return el;
}
function expOpenMap() { if (!s || !s.exp) return; s.exp.phase = 'map'; state = 'route'; resetInput(); expSave(); expRenderMap(); ensureExpMap().classList.remove('hidden'); try { hud(); } catch (err) {} }
function expHideMap() { let el = document.getElementById('expMap'); if (el) el.classList.add('hidden'); }
function expRenderMap() {
  let e = s.exp, m = e.map, el = ensureExpMap(), p = el.querySelector('.exp-panel'), reach = expReachable(e).map(x => x.join(',')), rowH = 98, H = (m.rows.length) * rowH + 30;
  let pos = (r, i) => { let n = m.rows[r][i]; return { x: 12 + n.x / 3 * 76, y: H - 40 - r * rowH }; };
  let lines = '';
  m.rows.forEach((row, r) => row.forEach((n, i) => n.next.forEach(j => { let a = pos(r, i), b = pos(r + 1, j), on = e.node && e.node[0] === r && e.node[1] === i, done = m.visited.includes(r + ',' + i); lines += '<line x1="' + a.x + '%" y1="' + a.y + '" x2="' + b.x + '%" y2="' + b.y + '" class="' + (on ? 'live' : done ? 'done' : '') + '"/>'; })));
  let nodes = m.rows.map((row, r) => row.map((n, i) => {
    let key = r + ',' + i, info = expNodeInfo[n.type], q = pos(r, i), here = e.node && e.node.join(',') === key, can = reach.includes(key), done = m.visited.includes(key), big = n.type === 'boss' || n.type === 'final';
    let kind = expWorldKind[n.biome] || n.biome, world = n.type === 'planet' || n.type === 'elite', star = expSystem(e).star;
    // planets show their world artwork; the boss is the system's star; other stops keep a symbol
    let face = world ? (typeof planetOrb === 'function' ? '<b class="exp-orb">' + planetOrb(n.biome, 38) + '</b>' : '<i>' + info.icon + '</i>') + (n.type === 'elite' ? '<b class="exp-fort">✷</b>' : '')
      : big ? '<i class="exp-star" style="--sc:' + (n.type === 'final' ? '#ff5a6e' : star) + '"></i>' : '<i>' + info.icon + '</i>';
    let sub = world ? kind + (n.type === 'elite' ? ' · fortress' : '') : big ? (n.type === 'final' ? 'Final encounter' : 'System star · boss') : info.name;
    return '<button class="exp-node t-' + n.type + (can ? ' can' : '') + (here ? ' here' : '') + (done ? ' done' : '') + (big ? ' big' : '') + '" style="left:' + q.x + '%;top:' + q.y + 'px;--nc:' + info.c + '"' + (can ? ' data-exp-node="' + key + '"' : ' disabled') + ' aria-label="' + escapeHTML((n.name || info.name) + ' · ' + sub) + '">' + face + '<span>' + escapeHTML(n.name || info.name) + '<em>' + sub + '</em></span></button>';
  }).join('')).join('');
  let hp = Math.max(0, Math.round(s.p.hp)), mx = Math.round(s.pilot.hp);
  p.innerHTML = '<header class="exp-head"><div><div class="eyebrow">EXPEDITION · SYSTEM ' + (e.act + 1) + ' / ' + EXP_ACTS + '</div><h2>' + escapeHTML(expSystem(e).name) + ' System</h2></div><div class="exp-stats"><span>Hull <b>' + hp + '/' + mx + '</b></span><span>Level <b>' + s.lv + '</b></span><span>Scrap <b>' + (s.merchant?.scrap || 0) + '</b></span></div></header>' +
    (expEventNote ? '<p class="exp-note">' + escapeHTML(expEventNote) + '</p>' : '<p class="fine">Choose your next jump. Routes branch: plan your way to the star at the heart of the system.</p>') +
    '<div class="exp-scroll" style="--sc:' + expSystem(e).star + '"><div class="exp-map" style="height:' + H + 'px"><svg class="exp-lines" width="100%" height="' + H + '">' + lines + '</svg>' + nodes + '</div></div>' +
    '<div class="exp-legend">' + ['planet', 'elite', 'outpost', 'distress', 'unknown', 'boss'].map(t => '<span style="--nc:' + expNodeInfo[t].c + '"><i>' + (t === 'planet' ? '🪐\uFE0E' : t === 'boss' ? '☀\uFE0E' : expNodeInfo[t].icon) + '</i>' + expNodeInfo[t].name + '</span>').join('') + '</div>' +
    '<footer class="exp-foot"><button data-exp-quit="1">Save &amp; quit</button></footer>';
  expEventNote = '';
  // scroll so the reachable row is in view
  setTimeout(() => { let sc = p.querySelector('.exp-scroll'), t = p.querySelector('.exp-node.can'); if (sc && t) sc.scrollTop = Math.max(0, t.offsetTop - sc.clientHeight * .6); }, 0);
}
// ---- checkpoint: saved between nodes so a long expedition can be continued later ----
var expKeep = ['hangarCheckpoint', 'recorded', 'pilot', 'runID', 'startedAt', 'lv', 'xp', 'need', 'kills', 'items', 'evolved', 'mutations', 'spec', 'score', 'comboPeak', 'multiPeak', 'skips', 'rerolls', 'banishes', 'banished', 'metrics', 'medals', 'weaponStats', 'bossKills', 'missions', 'runT', 'merchant', 'boosts', 'defence', 'pu', 'toolCaps', 'frame', 'module', 'paint', 'masteryXPBefore', 'masteryRankBefore', 'levelBank', 'evoAnnounced', 'blueprintsFound', 'routeKills', 'starterBosses'];
function expSave() {
  if (!s || !s.exp || s.dev?.test) return;
  try {
    let keep = {}; for (let k of expKeep) if (s[k] !== undefined) keep[k] = s[k];
    keep.hp = s.p.hp; keep.shield = s.p.shield || 0;
    profileStorage.setItem('rr_expedition', JSON.stringify({ v: 1, at: Date.now(), exp: s.exp, keep }, (k, v) => v instanceof Set ? undefined : v));
  } catch (err) { console.warn('expedition save failed', err); }
}
function expSaved() { try { let j = JSON.parse(profileStorage.getItem('rr_expedition') || 'null'); return j && j.v === 1 && j.exp ? j : null; } catch (err) { return null; } }
function expClearSave() { try { profileStorage.removeItem ? profileStorage.removeItem('rr_expedition') : profileStorage.setItem('rr_expedition', 'null'); } catch (err) {} }
function expResume() {
  let j = expSaved(); if (!j) return false;
  start(); Object.assign(s, j.keep); s.p.hp = j.keep.hp; s.p.shield = j.keep.shield || 0; s.exp = j.exp;
  if (s.exp.phase === 'stage' || s.exp.phase === 'clearing') { s.exp.phase = 'stage'; expBeginStage(expNode(s.exp)); s.toast = 4; $('toast').textContent = 'EXPEDITION RESUMED / ' + $('toast').textContent; return true; }
  expOpenMap(); return true;
}
// called from start(): every run is now an expedition (dev quick tests keep the classic flow)
function expStartRun() { if (s.dev?.test) return; s.exp = expNew(); s.runT = 0; s.bossIndex = 3; if (s.merchant) s.merchant.next = 99; expClearSave(); }
var expeditionNext = false;
function expMenuButton() {
  let st = document.getElementById('start'); if (!st) return; let b = document.getElementById('expContinue'), j = expSaved();
  if (!j) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('button'); b.id = 'expContinue'; b.className = 'exp-continue'; st.insertAdjacentElement('afterend', b); b.addEventListener('click', () => { expResume(); }); }
  b.textContent = 'Continue expedition · Sector ' + (j.exp.act + 1) + ' →';
}

if (typeof setTimeout === 'function' && typeof document !== 'undefined' && document.readyState !== undefined) setTimeout(() => { try { expMenuButton(); } catch (err) {} }, 600);
