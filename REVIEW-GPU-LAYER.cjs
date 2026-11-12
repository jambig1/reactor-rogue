// Browser review for the v0.55 GPU layer (needs playwright + Chrome). Usage: node REVIEW-GPU-LAYER.cjs <game dir> <output dir> [real|mock|offline]
// Browser test for the v0.55 GPU layer using the raw-WebGL2 Three.js stand-in.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2],out=process.argv[3],mock=fs.readFileSync(path.join(__dirname,'TEST-GPU-MOCK-THREE.js'),'utf8');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff':'font/woff','.webmanifest':'application/manifest+json'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(root,p);if(!fs.existsSync(f)){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)}).listen(8770,async()=>{
 const b=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const mode=process.argv[4]||'mock';
 const pg=await b.newPage({viewport:{width:1280,height:800}});let errs=[],cdn=[];
 pg.on('pageerror',e=>errs.push('JS '+e.message));pg.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(m.type()+': '+m.text())});
 await pg.route('**/vendor/three-*/three.module.js',route=>{cdn.push(route.request().url());if(mode==='real')route.continue();else if(mode==='mock')route.fulfill({status:200,contentType:'text/javascript',headers:{'access-control-allow-origin':'*'},body:mock});else route.abort()});
 await pg.goto('http://localhost:8770/index.html?play=1',{waitUntil:'networkidle'});await pg.waitForTimeout(1500);
 console.log('mode',mode,'gpuState',await pg.evaluate(()=>gpuState),'status',await pg.evaluate(()=>document.getElementById('gpuStatus').textContent),'cdn',JSON.stringify(cdn));
 await pg.screenshot({path:out+'/'+mode+'-menu.png'});
 await pg.evaluate(()=>{openPreflight();advancePreflight();start()});await pg.waitForTimeout(3500);
 await pg.screenshot({path:out+'/'+mode+'-play.png'});
 if(mode!=='offline'){
  // Freeze the loop, then compare GPU background against classic 2D with stars, glow and particles off.
  let r=await pg.evaluate(async()=>{window.requestAnimationFrame=()=>0;await new Promise(r=>setTimeout(r,100));
   let orig=gpuLayer.render;window.__origRender=orig;gpuLayer.render=f=>orig.call(gpuLayer,{...f,stars:0});
   graphicsVisual.glow='off';graphicsVisual.particles='off';s.particles=[];
   draw();return {sprites:gpuLayer.spriteCount,renders:window.__mockThreeRenders,bg:!!gpuFrame.background,ox:gpuFrame.ox,oy:gpuFrame.oy}});
  console.log('frozen gpu frame',JSON.stringify(r));
  await pg.waitForTimeout(300);await pg.screenshot({path:out+'/cmp-gpu.png'});
  await pg.evaluate(()=>{graphics.gpu='off';syncGpuLayer();draw()});await pg.waitForTimeout(300);await pg.screenshot({path:out+'/cmp-2d.png'});
  // Full effects frame with glows
  await pg.evaluate(()=>{graphics.gpu='on';gpuLayer.render=window.__origRender;setGraphics('preset','high');syncGpuLayer()});
  await pg.evaluate(()=>{window.requestAnimationFrame=f=>setTimeout(()=>f(performance.now()),16);requestAnimationFrame(frame)});
  await pg.evaluate(()=>{for(let i=0;i<14;i++)spawn(i%3);});await pg.waitForTimeout(5000);
  console.log('live', JSON.stringify(await pg.evaluate(()=>({state:gpuState,sprites:gpuLayer.spriteCount,shots:s.shots.length,enemies:s.enemies.length,particles:s.particles.length,shadow:graphicsShadow(18)}))));
  await pg.screenshot({path:out+'/mock-effects.png'});
  // Context loss falls back to 2D.
  await pg.evaluate(()=>{gpuLayer.onLost()});await pg.waitForTimeout(400);
  console.log('after loss',await pg.evaluate(()=>gpuState+' '+gpuActive()+' '+document.getElementById('gpuLayer').style.display));
  await pg.screenshot({path:out+'/mock-afterloss.png'});
 }
 console.log('errors',JSON.stringify(errs.filter(e=>!/GPU layer unavailable/.test(e)||mode==='mock')));
 await b.close();srv.close()});
