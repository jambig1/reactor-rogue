// v1.7 cosmetics: schemes are earned, colours stay readable, finish/decal/accent reach the run, and part
// appearance overrides never change stats.
const fs=require('fs'),assert=require('assert');
function main(){
run(`hangar.ship=null;partState();hangar.campaign.best={};hangar.bosses=0`);
assert.equal(run(`applyScheme('neon')`),false,'locked scheme cannot be applied');assert(run(`applyScheme('factory')`));
run(`hangar.campaign.best.grid=1`);assert(run(`applyScheme('neon')`),'earned by a Neon Expanse boss');assert.equal(run(`shipState().paint.scheme`),'neon');assert.equal(run(`shipState().paint.decal`),'roundel');
assert.equal(run(`hexToHsl(readableColour('#050505')).l>=34.5`),true,'too-dark colours are lifted');
run(`let pt=shipState().paint;pt.accent='#ff00aa';pt.partTint='accent';pt.finish='chrome';pt.decal='star';let ps=partState();ps.owned.e_nova=1;ps.owned.e_fusion=1;equipPart('e_nova');pt.look={engine:'e_fusion'}`);
let before=run(`JSON.stringify(shipStatSheet().map(r=>r.value))`);run(`shipState().paint.look={}`);let after=run(`JSON.stringify(shipStatSheet().map(r=>r.value))`);assert.equal(before,after,'appearance override does not change stats');
run(`shipState().paint.look={engine:'e_fusion'};state='menu';s=null;start()`);
assert.equal(run('s.pilot.parts.engine'),'e_fusion','the run shows the chosen look');assert.equal(run('s.tree.sig.afterburn'),1,'but keeps the equipped part mechanics');
assert.equal(run('s.pilot.finish'),'chrome');assert.equal(run('s.pilot.decal'),'star');assert.equal(run('s.pilot.partTint'),'accent');assert.equal(run('s.pilot.accent'),'#ff00aa');
assert.equal(run(`partTintMode(s.pilot)`),'accent:#ff00aa');assert.equal(run(`partAccent(s.pilot,shipParts.find(x=>x.id==='e_nova'))`),'#ff00aa');
run(`shipState().paint.look={engine:'e_twin'};state='menu';s=null;start()`);assert.notEqual(run('s.pilot.parts.engine'),'e_twin','cannot show a part you do not own');
for(let f of ['gloss','satin','matte','chrome'])assert.notEqual(run(`JSON.stringify(finishBody('${f}','#ff6a8e'))`),run(`JSON.stringify(finishBody('factory','#ff6a8e'))`),f+' changes the combat body');assert.equal(run(`shipDecals.length`),11,'ten markings plus none');
run(`state='menu';s=null;start()`);assert.equal(run('s.pilot.inflight'),undefined,'hangar-model look is the default');run(`shipState().paint.inflight='neon';state='menu';s=null;start()`);assert.equal(run('s.pilot.inflight'),'neon','classic neon can be chosen');run(`shipState().paint.inflight='hangar'`);
run(`state='menu';s=null`);console.log('PASS cosmetics: earned schemes, readable colours, accent/finish/decal in the run, look overrides cosmetic only');}
eval(fs.readFileSync(require('path').join(__dirname,'TEST-MENUS.cjs'),'utf8').split('\n').slice(0,5).join('\n')+'\n;('+main.toString()+')();');
