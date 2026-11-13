// v0.55 GPU layer checks that run in Node: module exports, colour parsing, shader sources,
// a stubbed Three.js run of createGpuLayer, 2D fallback wiring and offline caching.
const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const mod=await import(path.join(__dirname,'gpu-layer-v0590.js'));
assert(mod.THREE_URL.endsWith('/vendor/three-0.187.0/three.module.js'));for(let f of ['three.module.js','three.core.js','LICENSE'])assert(fs.existsSync(path.join(__dirname,'vendor/three-0.187.0',f)),f);assert(/REVISION = '187'/.test(fs.readFileSync(path.join(__dirname,'vendor/three-0.187.0/three.core.js'),'utf8')));
assert.deepEqual(mod.parseColour('#ff8000'),[1,128/255,0,1]);assert.deepEqual(mod.parseColour('#fff'),[1,1,1,1]);
assert.deepEqual(mod.parseColour('#ffffff80').map(v=>+v.toFixed(3)),[1,1,1,.502]);assert.deepEqual(mod.parseColour('rgba(255,0,0,.5)'),[1,0,0,.5]);assert.deepEqual(mod.parseColour('nonsense'),[1,1,1,1]);
for(let src of [mod.BACKGROUND_VERTEX,mod.BACKGROUND_FRAGMENT,mod.SPRITE_VERTEX,mod.SPRITE_FRAGMENT]){assert(/^precision (highp|mediump) float;/.test(src));assert(!/#version/.test(src),'GLSL ES 1.00 for RawShaderMaterial');assert.equal((src.match(/\{/g)||[]).length,(src.match(/\}/g)||[]).length)}
// Stub Three.js: records calls, no WebGL. Proves the layer's use of the API and its sprite buffer.
const calls=[];class V2{constructor(){this.x=0;this.y=0}set(x,y){this.x=x;this.y=y;return this}}class V3{set(){return this}}class V4{set(){return this}}
class Attr{constructor(a,n){this.array=a;this.itemSize=n}setUsage(){return this}clearUpdateRanges(){}addUpdateRange(){}}
class Geo{setAttribute(){return this}setIndex(){}dispose(){}}
let readValue=[0,0,0];const fakeGl={drawingBufferWidth:1600,drawingBufferHeight:1200,RGBA:1,UNSIGNED_BYTE:2,readPixels:(x,y,w,h,f,t,out)=>{out.set([...readValue,255])}};
class DataTex{constructor(d,w,h){this.data=d;this.userData={};calls.push('texture '+w+'x'+h)}dispose(){calls.push('dispose texture')}}
const T={DataTexture:DataTex,RGBAFormat:1023,UnsignedByteType:1009,LinearFilter:1006,LinearMipmapLinearFilter:1008,WebGLRenderer:class{constructor(o){calls.push('renderer '+o.alpha);this.capabilities={getMaxAnisotropy:()=>8}}getContext(){return fakeGl}setClearColor(){}setPixelRatio(r){calls.push('ratio '+r)}setSize(w,h){calls.push('size '+w+'x'+h)}render(){calls.push('render')}dispose(){}},
 Scene:class{add(){}},Camera:class{},BufferGeometry:Geo,InstancedBufferGeometry:Geo,BufferAttribute:Attr,InstancedBufferAttribute:Attr,RawShaderMaterial:class{constructor(o){Object.assign(this,o)}dispose(){}},
 Mesh:class{constructor(){this.visible=true}},Vector2:V2,Vector3:V3,Vector4:V4,CanvasTexture:class{constructor(i){this.image=i;calls.push('texture')}dispose(){calls.push('dispose texture')}},DynamicDrawUsage:1,CustomBlending:5,AddEquation:100,OneFactor:201,RepeatWrapping:1000,NoColorSpace:'',DoubleSide:2};
const listeners={},canvas={style:{},addEventListener:(n,f)=>listeners[n]=f};
const layer=await mod.createGpuLayer(canvas,async()=>T);assert(layer);
layer.resize(800,600,2);layer.begin();layer.sprite(400,300,20,'#ff0000',.5);layer.sprite(-500,300,20,'#ff0000',1);layer.sprite(10,10,0,'#fff',1);layer.sprite(10,10,5,'#fff',0);
assert.equal(layer.spriteCount,1,'off-screen, zero-size and invisible sprites are skipped');
for(let i=0;i<5000;i++)layer.sprite(100,100,4,'#fff',1);assert.equal(layer.spriteCount,4096,'sprite capacity bound');
// A uniform tile: every background pixel should read back as tile*(1-.2196)+wash*.2196.
const makeTile=v=>({width:4,height:4,getContext:()=>({getImageData:()=>({data:new Uint8ClampedArray(64).fill(v)})})});
let colour=v=>[0,1,2].map(c=>Math.round(v*(1-.2196)+[4,10,20][c]*.2196));
let tile=makeTile(200),modes=[];layer.onModeChange=m=>modes.push(m);readValue=colour(200);
layer.render({background:{tile,span:900,originX:1,originY:2},camX:5,camY:6,time:1});layer.render({background:{tile,span:900,originX:1,originY:2}});
assert.equal(layer.mode,'gpu','matching readback keeps the GPU background');assert.equal(calls.filter(c=>c==='render').length,3,'one extra self-check render per new tile');
readValue=colour(120);layer.render({background:{tile:makeTile(120),span:900,originX:1,originY:2}});
assert.equal(calls.filter(c=>/^texture /.test(c)).length,2,'texture uploads only when the sector tile changes');assert(calls.includes('renderer true'),'transparent-capable context');assert(calls.includes('dispose texture'));assert(calls.includes('ratio 2')&&calls.includes('size 800x600'));
// A black readback (the iOS failure) switches to overlay mode instead of a black playfield.
readValue=[0,0,0];let before=calls.filter(c=>/^texture /.test(c)).length;layer.render({background:{tile:makeTile(90),span:900,originX:1,originY:2}});assert.equal(layer.mode,'overlay');assert(calls.filter(c=>/^texture /.test(c)).length-before>=2&&/nomip: 0\/5/.test(layer.diagnostics),'alternative upload strategies tried before overlay');assert(/data: 0\/5 got 0,0,0/.test(layer.diagnostics),layer.diagnostics);assert.deepEqual(modes,['overlay']);
let unreadable={width:4,height:4,getContext:()=>({getImageData:()=>{throw Error('tainted')}})};
const layer2=await mod.createGpuLayer({style:{},addEventListener(){}},async()=>T);layer2.resize(800,600,2);layer2.render({background:{tile:unreadable,span:900,originX:0,originY:0}});assert.equal(layer2.mode,'overlay','unreadable tile uses overlay mode');
let lost=0;layer.onLost=()=>lost++;listeners.webglcontextlost();assert.equal(lost,1);assert(layer.lost);let renders=calls.filter(c=>c==='render').length;layer.render({});assert.equal(calls.filter(c=>c==='render').length,renders,'no rendering after context loss');
assert.equal(await mod.createGpuLayer(canvas,async()=>({...T,WebGLRenderer:class{constructor(){throw Error('no webgl')}}})),null,'renderer failure returns null');
// Lighting reaches the background uniforms (max 12).
const lit=await mod.createGpuLayer({style:{},addEventListener(){}},async()=>T);lit.resize(800,600,1);readValue=colour(150);
lit.render({background:{tile:makeTile(150),span:900,originX:0,originY:0},lights:Array.from({length:20},(_,i)=>({x:i,y:i,r:100,i:.5,c:'#ff8800'}))});
// Bloom layer: pass order, capture upload reuse, sprites, context loss and failure.
const passes=[];class RT{constructor(w,h){this.width=w;this.height=h;this.texture={rt:this}}setSize(w,h){this.width=w;this.height=h}dispose(){}}
const TB={...T,NoBlending:0,WebGLRenderTarget:RT,CanvasTexture:class{constructor(i){this.image=i;passes.push('capture texture')}dispose(){}},WebGLRenderer:class{constructor(o){this.autoClear=true;this.target=null;passes.push('bloom renderer '+o.alpha)}setClearColor(){}setPixelRatio(){}setSize(){}setRenderTarget(t){this.target=t}clear(){}render(scene){passes.push(this.target?'rt '+this.target.width+'x'+this.target.height:'screen')}dispose(){}}};
const bl={},bloomCanvas={style:{},addEventListener:(n,f)=>bl[n]=f};const bloom=await mod.createBloomLayer(bloomCanvas,async()=>TB);assert(bloom);
bloom.resize(800,600,2);bloom.begin();bloom.glow(100,100,20,'#ffaa00',1);bloom.screen(100,100,5,'#ffffff',1,1);bloom.screen(-900,100,5,'#fff',1);assert.equal(bloom.spriteCount,2);
let cap={width:267,height:200};bloom.render({capture:cap,threshold:.4,near:1,wide:1.2});bloom.render({capture:cap});
assert.equal(passes.filter(p=>p==='capture texture').length,1,'capture texture reused while the copy canvas is the same');
let frame=passes.slice(passes.indexOf('capture texture')+1);assert.deepEqual(frame.slice(0,8),['rt 200x150','rt 200x150','rt 200x150','rt 200x150','rt 100x75','rt 100x75','rt 100x75','screen'],'prefilter, glow, blur x2 at 1/4, downsample and blur x2 at 1/8, composite');
passes.length=0;bloom.begin();bloom.render({capture:null});assert(!passes.includes('capture texture')&&passes.at(-1)==='screen','bloom runs without a frame copy');
let bloomLost=0;bloom.onLost=()=>bloomLost++;bl.webglcontextlost();assert.equal(bloomLost,1);passes.length=0;bloom.render({capture:null});assert.equal(passes.length,0);
assert.equal(await mod.createBloomLayer(bloomCanvas,async()=>({...TB,WebGLRenderer:class{constructor(){throw Error('no webgl')}}})),null);
// Weather: drawn on screen after the bloom composite; weather-only frames skip every bloom pass.
const wx=await mod.createBloomLayer({style:{},addEventListener(){}},async()=>TB);wx.resize(800,600,1);
passes.length=0;wx.begin();wx.render({bloom:false,weather:{type:5,amount:1,camX:0,camY:0,time:3}});assert.deepEqual(passes,['screen'],'weather only: one screen pass, no render targets');
passes.length=0;wx.begin();wx.screen(10,10,2,'#fff',1,1);wx.render({bloom:false,weather:null});assert.deepEqual(passes,['screen'],'no weather: sprites only');
passes.length=0;wx.begin();wx.render({capture:null,weather:{type:3,amount:1}});assert.deepEqual(passes.slice(-2),['screen','screen'],'bloom composite then weather');
assert.equal((fs.readFileSync(path.join(__dirname,'gpu-layer-v0590.js'),'utf8').match(/side: T\.DoubleSide/g)||[]).length,2,'y-flipped sprite quads must be double-sided or Three.js culls them');assert(/uType < 5\.5/.test(mod.WEATHER_FRAGMENT)&&!/smoothstep\(\s*[0-9.]+\s*,\s*0\.0/.test(mod.WEATHER_FRAGMENT));
for(let src of [mod.PREFILTER_FRAGMENT,mod.BLUR_FRAGMENT,mod.COMPOSITE_FRAGMENT]){assert(/^precision mediump float;/.test(src));assert(!/smoothstep\(\s*[0-9.]+\s*,\s*0\.0/.test(src))}
assert(/uLight\[12\]/.test(mod.BACKGROUND_FRAGMENT)&&/float\(i\) >= uLightCount/.test(mod.BACKGROUND_FRAGMENT));
// Game wiring: optional start, fallback, setting, transparent 2D canvas only when active.
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),sw=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
for(let needle of ['<canvas id="gpuLayer" aria-hidden="true"></canvas><canvas id="game"','<canvas id="gpuBloom" aria-hidden="true"></canvas>',"bloom:['off','subtle','full']","low:{weather:'off',bloom:'off',","medium:{weather:'on',bloom:'subtle',","high:{weather:'on',bloom:'full',",'id="gfx-bloom" data-graphics="bloom"',"weaponArtAtlas.crossOrigin='anonymous'","let image=new Image;image.crossOrigin='anonymous';image.src=file",'function bloomFrameCopy(','function collectGpuLights(','function weatherWanted(','function topActive(','function makeStrike(','id="gfx-weather" data-graphics="weather"',"weather:['off','on']","gpu:['on','off']","gpu:'on'",'id="gfx-gpu" data-graphics="gpu"','function gpuFail(','.catch(gpuFail)','function applyGpuMode(mode)',"if(gpuFrame.on&&!gpuFrame.overlay)ctx.clearRect(0,0,W,H)","if(gpuFrame.on&&!gpuFrame.overlay)ctx.clearRect(0,0,W,H);else{ctx.fillStyle='#07101f';ctx.fillRect(0,0,W,H)}",'if(graphicsParticles()>0&&!gpuFrame.on)','startGpuLayer();',"var gpuModule=null,bloomLayer=null,bloomState='idle'"])assert(html.includes(needle),needle);
assert(sw.includes('"gpu-layer-v0590.js"'));assert(sw.includes('"vendor/three-0.187.0/three.module.js","vendor/three-0.187.0/three.core.js"'),'bundled Three.js precached');assert(!/jsdelivr/i.test(sw+html),'no CDN dependency');
console.log('PASS GPU layer exports, colour parsing, GLSL sources, stubbed Three.js lifecycle/bounds/pixel-upload reuse/self-check, strategy retries and overlay fallback/context loss, renderer-failure fallback, background lighting, bloom pass chain/capture reuse/context loss, weather passes, game wiring and bundled offline Three.js');
})().catch(e=>{console.error(e);process.exitCode=1});
