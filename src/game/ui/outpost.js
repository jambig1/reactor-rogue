// v1.5 Lost Signal outpost: a stop on the star map between planets. Buy ship parts with credits (stock refreshes
// after every run) and try the Neon Slots casino. Credits only; the slots return about 92% over time.
var outpostPrices = [0, 120, 260, 520];
var outpostQuotes = ['Signal steady. Browse, pilot.', 'Fresh salvage from the last convoy. Mostly legal.', 'Feeling lucky? The machine certainly is.', 'Everything fits. Eventually.'];
var outpostView = 'parts';
function outpostState() {
  let o = hangar.outpost;
  if (!o || o.v !== 1) o = hangar.outpost = { v: 1, stock: [], restock: true, spins: 0, won: 0, bet: 10 };
  if (o.restock || !o.stock.length) {
    let ps = partState(), pool = shipParts.filter(d => d.r > 0 && !ps.owned[d.id]), pick = [];
    if (!pool.length) pool = shipParts.filter(d => d.r > 0);
    while (pick.length < 3 && pool.length) { let w = pool.map(d => [0, 6, 3, 1][d.r]), tot = w.reduce((a, b) => a + b, 0), n = Math.random() * tot, i = 0; for (; i < pool.length - 1; i++) { n -= w[i]; if (n <= 0) break; } pick.push(pool[i].id); pool.splice(i, 1); }
    o.stock = pick; o.restock = false; try { saveHangar(); } catch (e) {}
  }
  return o;
}
function outpostRestockAfterRun() { try { if (hangar.outpost) hangar.outpost.restock = true; } catch (e) {} }
function buyOutpostPart(id) {
  let o = outpostState(), d = shipParts.find(x => x.id === id); if (!d || !o.stock.includes(id)) return false;
  let price = outpostPrices[d.r]; if (hangar.credits < price) return false;
  hangar.credits -= price; grantPart(d); o.stock = o.stock.filter(x => x !== id); saveHangar(); return true;
}
// ---- Neon Slots ----
var slotSymbols = [{ g: '☢︎', n: 'Reactor', pay: 20, c: '#65f7ef' }, { g: '★︎', n: 'Star', pay: 12, c: '#ffd56f' }, { g: '◆︎', n: 'Gem', pay: 8, c: '#c18aff' }, { g: '▲︎', n: 'Ship', pay: 5, c: '#6daaff' }, { g: '☻︎', n: 'Crew', pay: 4, c: '#7dffb0' }, { g: '☠︎', n: 'Skull', pay: 0, c: '#ff6b8a' }];
var slotBets = [10, 25, 50], slotSpinning = false, slotLast = null;
function slotPayout(r, bet) {
  let [a, b, c] = r;
  if (a === b && b === c) return bet * slotSymbols[a].pay;
  let pair = a === b ? a : b === c ? b : a === c ? a : -1;
  return pair >= 0 && slotSymbols[pair].pay > 0 ? bet * 2 : 0;
}
function spinSlots() {
  let o = outpostState(), bet = slotBets.includes(o.bet) ? o.bet : 10;
  if (slotSpinning || hangar.credits < bet) return;
  hangar.credits -= bet; o.spins++; slotSpinning = true;
  let result = [0, 1, 2].map(() => Math.floor(Math.random() * slotSymbols.length)), win = slotPayout(result, bet);
  saveHangar(); renderOutpost();
  let reels = [...document.querySelectorAll('#outpost .slot-reel')], t0 = performance.now(), stops = [700, 1050, 1400];
  try { sound('ui'); } catch (e) {}
  let tick = () => {
    let el = performance.now() - t0, done = 0;
    reels.forEach((r, i) => {
      if (el < stops[i]) { let k = Math.floor(el / 60 + i * 2) % slotSymbols.length; r.textContent = slotSymbols[k].g; r.style.color = slotSymbols[k].c; r.classList.add('spin'); }
      else { if (r.classList.contains('spin')) { r.classList.remove('spin'); try { sound('pickup'); } catch (e) {} } r.textContent = slotSymbols[result[i]].g; r.style.color = slotSymbols[result[i]].c; done++; }
    });
    if (done < 3) { requestAnimationFrame(tick); return; }
    slotSpinning = false; slotLast = { result, win, bet };
    if (win) { hangar.credits += win; o.won += win; saveHangar(); try { sound('reward'); } catch (e) {} }
    renderOutpost();
  };
  requestAnimationFrame(tick);
}
// ---- panel ----
function ensureOutpost() {
  let el = document.getElementById('outpost'); if (el) return el;
  el = document.createElement('section'); el.id = 'outpost'; el.className = 'overlay hidden'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = '<div class="panel outpost-panel"></div>'; document.body.appendChild(el);
  el.addEventListener('click', e => {
    let b = e.target.closest('button'); if (!b) return;
    if (b.dataset.outpostClose) closeOutpost();
    else if (b.dataset.outpostView) { outpostView = b.dataset.outpostView; renderOutpost(); }
    else if (b.dataset.outpostBuy) { if (buyOutpostPart(b.dataset.outpostBuy)) { try { sound('reward'); } catch (e) {} } renderOutpost(); }
    else if (b.dataset.slotBet) { outpostState().bet = +b.dataset.slotBet; saveHangar(); renderOutpost(); }
    else if (b.dataset.slotSpin) spinSlots();
  });
  return el;
}
function openOutpost() { let el = ensureOutpost(); el.dataset.quote = Math.floor(Math.random() * outpostQuotes.length); outpostView = 'parts'; renderOutpost(); el.classList.remove('hidden'); try { sound('ui'); } catch (e) {} }
function closeOutpost() { let el = document.getElementById('outpost'); if (el && !slotSpinning) el.classList.add('hidden'); try { updateLaunchSummary(); } catch (e) {} }
function renderOutpost() {
  let el = ensureOutpost(), p = el.querySelector('.outpost-panel'), o = outpostState(), cr = hangar.credits;
  let head = '<header class="outpost-head"><div><div class="eyebrow">THE LOST SIGNAL / OUTPOST</div><h2>Lost Signal</h2></div><strong class="outpost-wallet">' + cr + ' credits</strong></header>' +
    '<div class="outpost-who"><div class="outpost-portrait">' + (typeof merchantPortrait === 'function' ? merchantPortrait() : '') + '</div><p>' + outpostQuotes[+el.dataset.quote || 0] + '</p></div>' +
    '<div class="outpost-tabs" role="tablist">' + [['parts', 'Parts'], ['slots', 'Neon Slots']].map(([id, n]) => '<button data-outpost-view="' + id + '" aria-pressed="' + (outpostView === id) + '">' + n + '</button>').join('') + '</div>';
  let body;
  if (outpostView === 'parts') {
    body = '<p class="fine">New stock after every run. Parts you already own aren\'t offered.</p><div class="outpost-parts">' + (o.stock.length ? o.stock.map(id => {
      let d = shipParts.find(x => x.id === id), price = outpostPrices[d.r], rr = partRarity[d.r];
      return '<article class="outpost-part" style="--rc:' + rr.c + '"><img src="' + partSrc(id) + '" alt="" loading="lazy"><div><span class="op-rar">' + rr.name + ' · ' + d.slot + '</span><strong>' + d.name + '</strong><small>' + d.desc + '</small></div><button data-outpost-buy="' + id + '"' + (cr < price ? ' disabled' : '') + '>' + price + ' cr</button></article>';
    }).join('') : '<p class="fine">Sold out. Come back after your next run.</p>') + '</div>';
  } else {
    let r = slotLast ? slotLast.result : [0, 1, 2], win = slotLast?.win, bet = slotBets.includes(o.bet) ? o.bet : 10;
    body = '<div class="slots' + (win ? ' won' : '') + '"><div class="slot-window">' + r.map(k => '<div class="slot-reel" style="color:' + slotSymbols[k].c + '">' + slotSymbols[k].g + '</div>').join('') + '</div>' +
      '<p class="slot-msg">' + (slotSpinning ? 'Spinning…' : slotLast ? (win ? 'You won <b>' + win + ' credits</b>!' : 'No luck this time.') : 'Three of a kind pays big. Any pair pays ×2.') + '</p>' +
      '<div class="slot-bets">' + slotBets.map(b => '<button data-slot-bet="' + b + '" aria-pressed="' + (bet === b) + '">' + b + '</button>').join('') + '</div>' +
      '<button class="primary slot-spin" data-slot-spin="1"' + (slotSpinning || cr < bet ? ' disabled' : '') + '>Spin · ' + bet + ' cr</button>' +
      '<div class="slot-pays">' + slotSymbols.map(s0 => '<span><i style="color:' + s0.c + '">' + s0.g + s0.g + s0.g + '</i> ' + (s0.pay ? '×' + s0.pay : '—') + '</span>').join('') + '<span><i>pair</i> ×2</span></div>' +
      '<p class="fine">In-game credits only. ' + o.spins + ' spins · ' + o.won + ' credits won.</p></div>';
  }
  p.innerHTML = head + body + '<footer class="outpost-foot"><button data-outpost-close="1">Back to the star map →</button></footer>';
}
// the outpost marker on the star map (between the first two planets)
function outpostMarker(L) {
  let wide = wideMap(), x = wide ? 9 : 80, y = wide ? 300 : 62;
  return '<button class="map-outpost" data-outpost="1" style="left:' + x + '%;top:' + y + 'px" aria-label="Visit the Lost Signal outpost"><i class="op-ring"></i><i class="op-core"></i><span class="planet-tag"><b>Lost Signal</b><em>Outpost · shop &amp; slots</em></span></button>';
}
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', e => { let b = e.target && e.target.closest && e.target.closest('[data-outpost]'); if (b) { e.preventDefault(); openOutpost(); } });
