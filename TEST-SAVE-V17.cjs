// v1.7 save safety: a fully progressed 1.7 profile (every part, upgrades, loadouts, cosmetics, skills) exports,
// validates and imports intact, stays well under the 2 MB backup/cloud limit, and names with quotes or
// apostrophes can never make a backup unimportable.
const fs=require('fs'),assert=require('assert');
function main(){
run(`hangar.ship=null;let ps=partState();for(let d of shipParts){ps.owned[d.id]=1;ps.acq[d.id]=Date.now();if(d.r>0)ps.lv[d.id]=5;ps.fav[d.id]=1}shipState().lvl=99;shipState().pts=0;shipState().name="Bert's <Ship>";
 for(let i=0;i<8;i++)saveNewLoadout();shipLoadouts()[0].name='O\\'Neil & "Co"';let pt=shipState().paint;Object.assign(pt,{accent:'#ff00aa',partTint:'accent',finish:'chrome',decal:'atom',inflight:'neon',look:{engine:'e_fusion'},scheme:'neon'});shipState().title='Shipwright Prime';shipState().pts=60;for(let d of shipNodes)for(let r=0;r<d.max;r++)buyShipNode(d.id,'spectre');saveHangar()`);
let text=run('JSON.stringify(createSaveBackup())');assert(text.length<2000000*.25,'a maxed save is '+Math.round(text.length/1024)+' KB, far under 2 MB');
assert(!/[<>&"']/.test(run(`JSON.stringify([shipState().name,...shipLoadouts().map(l=>l.name)])`).replace(/^\["|"\]$/g,'').replace(/","/g,'')),'stored names are made safe');
let back=run(`JSON.stringify(validateSaveBackup(${JSON.stringify(text)}).progress.rr_hangar.ship)`);back=JSON.parse(back);
assert.equal(back.parts.v,2);assert.equal(Object.keys(back.parts.owned).length,run('shipParts.length'));assert.equal(back.parts.lv.e_nova,5);assert.equal(back.loadouts2.length,8);assert.equal(back.paint.finish,'chrome');assert.equal(back.paint.decal,'atom');assert.equal(back.paint.look.engine,'e_fusion');assert.equal(back.title,'Shipwright Prime');
console.log('PASS maxed v1.7 save: '+Math.round(text.length/1024)+' KB, validates, keeps parts, upgrades, loadouts, cosmetics, title; unsafe characters stripped');}
eval(fs.readFileSync(require('path').join(__dirname,'TEST-MENUS.cjs'),'utf8').split('\n').slice(0,5).join('\n')+'\n;('+main.toString()+')();');
