// v0.89 PixiJS layer: wiring, enemy routing and fallbacks (renderer itself is checked in the browser).
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),sw=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8'),mod=fs.readFileSync(path.join(__dirname,'pixi-layer-v0970.js'),'utf8');
assert(html.includes('<canvas id="gpuLayer" aria-hidden="true"></canvas><canvas id="pixiLayer" aria-hidden="true"></canvas><canvas id="game"'),'pixi canvas sits between background and playfield');
assert(sw.includes('"pixi-layer-v0970.js","vendor/pixi.js-8.23.0/pixi.js"'),'precached offline');
assert(fs.existsSync(path.join(__dirname,'vendor/pixi.js-8.23.0/LICENSE')));
assert(mod.includes("preference: 'webgl'")&&mod.includes('catch (e) { return null; }'),'webgl only, null on failure');
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
fresh();assert.equal(run('pixiState'),'idle');assert.equal(run('pixiFrame.on'),false,'off without a layer');
run("var calls=[];pixiLayer={lost:false,setVisible(){},begin(){},camera(){},render(){},enemy(k,p,x,y,a,sc){calls.push(k);return true},scenery(){return true}}");
run("s.enemies=[];spawn(0);var e=s.enemies[0]");assert.equal(run('pixiEnemy(e,0)'),true);assert(run('calls[0]').startsWith('e|'));
run("e.glow=1;e.hp=e.max*.2;pixiEnemy(e,0)");assert.notEqual(run('calls[1]'),run('calls[0]'),'hit flash / damage get their own texture');
run("e.boss=true");assert.equal(run('pixiEnemy(e,0)'),false,'bosses stay on the 2D canvas');
assert.equal(run("typeof contactRecoilOffset(s.enemies[0])"),'object');
console.log('PASS PixiJS layer wiring, enemy routing, texture keys and boss fallback');
`);
