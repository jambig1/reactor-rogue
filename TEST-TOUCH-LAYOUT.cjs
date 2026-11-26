// Movable touch buttons (src/game/ui/touch-layout.js) in a real browser: default spot, ability card above the dock,
// dragging in the editor, Escape back to Settings, saved across reloads, clamped on small screens, Reset, Fire handle.
// Needs Playwright with Chromium. Run after `node build.mjs`.
const {chromium}=require('playwright');
const page=require('url').pathToFileURL(require('path').join(__dirname,'index.html')).href;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const center=async(p,sel)=>p.evaluate(s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),w:r.width,top:r.top,bottom:r.bottom,left:r.left,right:r.right}},sel);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(page);await p.waitForTimeout(1500);
await p.evaluate("start();s.p.hp=s.p.maxHp=1e9;try{coachFinish()}catch(e){}");await p.waitForTimeout(800);
const d0=await center(p,'#dashButton');ok(Math.abs(d0.x-(1280-108-36))<3&&Math.abs(d0.y-(800-85-36))<3,'dash starts at its default spot '+JSON.stringify([d0.x,d0.y]));
const ab=await center(p,'#abilityHUD'),dock=await center(p,'.loadout');ok(ab.bottom<=dock.top-4,'ability card sits above the dock (card bottom '+Math.round(ab.bottom)+' / dock top '+Math.round(dock.top)+')');

await p.evaluate("pause();openSettings()");await p.waitForTimeout(500);
await p.click('#touchLayoutOpen');await p.waitForTimeout(500);
ok(await p.evaluate("!document.getElementById('touchLayout').classList.contains('hidden')&&document.getElementById('settings').classList.contains('hidden')"),'editor opens in place of Settings');
ok(await p.evaluate("document.querySelector('.touch-handle-fire').classList.contains('hidden')"),'fire handle hidden while fire mode is automatic');
const h=await center(p,'.touch-handle[data-for=dashButton]');ok(Math.abs(h.x-d0.x)<3&&Math.abs(h.y-d0.y)<3,'dash handle starts where the button is');
await p.mouse.move(h.x+5,h.y+5);await p.mouse.down();await p.mouse.move(300,500,{steps:8});await p.mouse.move(205,405,{steps:8});await p.mouse.up();await p.waitForTimeout(200);
const h2=await center(p,'.touch-handle[data-for=dashButton]');ok(Math.abs(h2.x-200)<4&&Math.abs(h2.y-400)<4,'handle follows the drag (keeps the grab offset) '+JSON.stringify([h2.x,h2.y]));

await p.keyboard.press('Escape');await p.waitForTimeout(300);
ok(await p.evaluate("document.getElementById('touchLayout').classList.contains('hidden')&&!document.getElementById('settings').classList.contains('hidden')&&state==='settings'"),'Escape closes only the editor, back to Settings');
await p.evaluate("closeSettings()");await p.evaluate("state==='pause'&&resume()").catch(()=>{});await p.evaluate("if(state!=='play'){document.querySelectorAll('.overlay').forEach(o=>o.classList.add('hidden'));state='play'};hud()");await p.waitForTimeout(400);
const d1=await center(p,'#dashButton');ok(Math.abs(d1.x-200)<4&&Math.abs(d1.y-400)<4,'real Dash button moved in play '+JSON.stringify([d1.x,d1.y]));

await p.reload();await p.waitForTimeout(1500);await p.evaluate("start();try{coachFinish()}catch(e){}");await p.waitForTimeout(500);
const d2=await center(p,'#dashButton');ok(Math.abs(d2.x-200)<4&&Math.abs(d2.y-400)<4,'position kept after reload');
await p.setViewportSize({width:390,height:300});await p.waitForTimeout(300);
const d3=await center(p,'#dashButton');ok(d3.left>=0&&d3.right<=390&&d3.top>=0&&d3.bottom<=300,'stays fully on screen when the window shrinks '+JSON.stringify([d3.left,d3.top,d3.right,d3.bottom].map(Math.round)));
await p.setViewportSize({width:1280,height:800});
await p.evaluate("pause();openSettings()");await p.click('#touchLayoutOpen');await p.click('#touchLayoutReset');await p.click('#touchLayoutDone');await p.evaluate("closeSettings()");await p.evaluate("document.querySelectorAll('.overlay').forEach(o=>o.classList.add('hidden'));state='play';hud()");await p.waitForTimeout(300);
const d4=await center(p,'#dashButton');ok(Math.abs(d4.x-d0.x)<3&&Math.abs(d4.y-d0.y)<3,'Reset puts it back '+JSON.stringify([d4.x,d4.y]));
await p.evaluate("setFireMode('manual');pause();openSettings()");await p.click('#touchLayoutOpen');
ok(await p.evaluate("!document.querySelector('.touch-handle-fire').classList.contains('hidden')"),'fire handle shown with manual fire');
await p.click('#touchLayoutDone');
await b.close();if(!process.exitCode)console.log('PASS movable touch buttons and ability card placement')})();
