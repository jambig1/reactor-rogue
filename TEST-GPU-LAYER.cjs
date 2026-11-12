// v0.55 GPU layer checks that run in Node: module exports, colour parsing, shader sources,
// a stubbed Three.js run of createGpuLayer, 2D fallback wiring and offline caching.
const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const mod=await import(path.join(__dirname,'gpu-layer-v0550.js'));
assert(mod.THREE_URL.endsWith('/vendor/three-0.187.0/three.module.js'));for(let f of ['three.module.js','three.core.js','LICENSE'])assert(fs.existsSync(path.join(__dirname,'vendor/three-0.187.0',f)),f);assert(/REVISION = '187'/.test(fs.readFileSync(path.join(__dirname,'vendor/three-0.187.0/three.core.js'),'utf8')));
assert.deepEqual(mod.parseColour('#ff8000'),[1,128/255,0,1]);assert.deepEqual(mod.parseColour('#fff'),[1,1,1,1]);
assert.deepEqual(mod.parseColour('#ffffff80').map(v=>+v.toFixed(3)),[1,1,1,.502]);assert.deepEqual(mod.parseColour('rgba(255,0,0,.5)'),[1,0,0,.5]);assert.deepEqual(mod.parseColour('nonsense'),[1,1,1,1]);
for(let src of [mod.BACKGROUND_VERTEX,mod.BACKGROUND_FRAGMENT,mod.SPRITE_VERTEX,mod.SPRITE_FRAGMENT]){assert(/^precision (highp|mediump) float;/.test(src));assert(!/#version/.test(src),'GLSL ES 1.00 for RawShaderMaterial');assert.equal((src.match(/\{/g)||[]).length,(src.match(/\}/g)||[]).length)}
// Stub Three.js: records calls, no WebGL. Proves the layer's use of the API and its sprite buffer.
const calls=[];class V2{constructor(){this.x=0;this.y=0}set(x,y){this.x=x;this.y=y;return this}}class V3{set(){return this}}
class Attr{constructor(a,n){this.array=a;this.itemSize=n}setUsage(){return this}clearUpdateRanges(){}addUpdateRange(){}}
class Geo{setAttribute(){return this}setIndex(){}dispose(){}}
const T={WebGLRenderer:class{constructor(o){calls.push('renderer');this.capabilities={getMaxAnisotropy:()=>8}}setClearColor(){}setPixelRatio(r){calls.push('ratio '+r)}setSize(w,h){calls.push('size '+w+'x'+h)}render(){calls.push('render')}dispose(){}},
 Scene:class{add(){}},Camera:class{},BufferGeometry:Geo,InstancedBufferGeometry:Geo,BufferAttribute:Attr,InstancedBufferAttribute:Attr,RawShaderMaterial:class{constructor(o){Object.assign(this,o)}dispose(){}},
 Mesh:class{},Vector2:V2,Vector3:V3,CanvasTexture:class{constructor(i){this.image=i;calls.push('texture')}dispose(){calls.push('dispose texture')}},DynamicDrawUsage:1,CustomBlending:5,AddEquation:100,OneFactor:201,RepeatWrapping:1000,NoColorSpace:''};
const listeners={},canvas={style:{},addEventListener:(n,f)=>listeners[n]=f};
const layer=await mod.createGpuLayer(canvas,async()=>T);assert(layer);
layer.resize(800,600,2);layer.begin();layer.sprite(400,300,20,'#ff0000',.5);layer.sprite(-500,300,20,'#ff0000',1);layer.sprite(10,10,0,'#fff',1);layer.sprite(10,10,5,'#fff',0);
assert.equal(layer.spriteCount,1,'off-screen, zero-size and invisible sprites are skipped');
for(let i=0;i<5000;i++)layer.sprite(100,100,4,'#fff',1);assert.equal(layer.spriteCount,4096,'sprite capacity bound');
let tile={};layer.render({background:{tile,span:900,originX:1,originY:2},camX:5,camY:6,time:1});layer.render({background:{tile,span:900,originX:1,originY:2}});layer.render({background:{tile:{},span:900,originX:1,originY:2}});
assert.equal(calls.filter(c=>c==='texture').length,2,'texture uploads only when the sector tile changes');assert(calls.includes('dispose texture'));assert(calls.includes('ratio 2')&&calls.includes('size 800x600'));
let lost=0;layer.onLost=()=>lost++;listeners.webglcontextlost();assert.equal(lost,1);assert(layer.lost);let renders=calls.filter(c=>c==='render').length;layer.render({});assert.equal(calls.filter(c=>c==='render').length,renders,'no rendering after context loss');
assert.equal(await mod.createGpuLayer(canvas,async()=>({...T,WebGLRenderer:class{constructor(){throw Error('no webgl')}}})),null,'renderer failure returns null');
// Game wiring: optional start, fallback, setting, transparent 2D canvas only when active.
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),sw=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
for(let needle of ['<canvas id="gpuLayer" aria-hidden="true"></canvas><canvas id="game"',"gpu:['on','off']","gpu:'on'",'id="gfx-gpu" data-graphics="gpu"','function gpuFail(','.catch(gpuFail)',"if(gpuFrame.on)ctx.clearRect(0,0,W,H);else{ctx.fillStyle='#07101f';ctx.fillRect(0,0,W,H)}",'if(graphicsParticles()>0&&!gpuFrame.on)','startGpuLayer();',"var gpuLayer=null,gpuState='idle'"])assert(html.includes(needle),needle);
assert(sw.includes('"gpu-layer-v0550.js"'));assert(sw.includes('"vendor/three-0.187.0/three.module.js","vendor/three-0.187.0/three.core.js"'),'bundled Three.js precached');assert(!/jsdelivr/i.test(sw+html),'no CDN dependency');
console.log('PASS GPU layer exports, colour parsing, GLSL sources, stubbed Three.js lifecycle/bounds/texture reuse/context loss, renderer-failure fallback, game wiring and bundled offline Three.js');
})().catch(e=>{console.error(e);process.exitCode=1});
