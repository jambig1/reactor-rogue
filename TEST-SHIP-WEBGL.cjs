const {chromium,webkit,devices}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {PNG}=require('pngjs');
const out=path.join(__dirname,'ship-webgl-results');fs.mkdirSync(out,{recursive:true});
const results=[],failures=[];
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const p=path.resolve(__dirname,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(p,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(b);});});
const profiles=[['desktop',chromium,{viewport:{width:1440,height:1000},deviceScaleFactor:1}],['iphone',webkit,devices['iPhone 13']],['ipad',webkit,devices['iPad (gen 7)']]];
async function capture(page,name){await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
async function run(name,engine,device,base){
 const browser=await engine.launch({headless:false,...(engine===chromium?{args:['--use-angle=swiftshader']}:{})});
 const context=await browser.newContext({...device,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader|GL_INVALID/i.test(m.text()))errors.push(m.text());});
 try{
  await page.goto(base+'/ship-review.html');await page.waitForFunction(()=>window.shipReview?.views?.every(Boolean),{},{timeout:30000});
  const ids=await page.locator('#ship option').evaluateAll(xs=>xs.map(x=>x.value));assert.equal(ids.length,12);
  const beforeStorage=await page.evaluate(()=>JSON.stringify(localStorage));
  const checks=[];
  for(const id of ids){await page.selectOption('#ship',id);
    for(const [angle,yaw,pitch] of [['front',-.5,0],['rear',2.5,0],['side',1.57,1],['under',-.4,2.6]]){
      const sample=await page.evaluate(({yaw,pitch})=>{
       const v=shipReview.views[1],c=document.getElementById('after');v.resize(c.clientWidth,c.clientHeight,1);
       v.render({x:c.clientWidth/2,y:c.clientHeight/2,scale:Math.min(c.clientWidth/100,c.clientHeight/85),yaw,pitch,appear:1,t:1,thrust:.3,bloom:true,glow:.65});
       const gl=c.getContext('webgl2'),pixels=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
       let lit=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>16)lit++;
       return {lit,error:gl.getError(),...v.diagnostics};
      },{yaw,pitch});assert(sample.lit>100,`${id} ${angle}: blank render`);assert.equal(sample.error,0,`${id} ${angle}: GL error`);checks.push({id,angle,...sample});
      // Set the visible review's persistent camera controls before capture.
      await page.evaluate(({yaw,pitch})=>{document.getElementById('yaw').value=Math.round(yaw*180/Math.PI);document.getElementById('pitch').value=Math.round(pitch*180/Math.PI);},{yaw,pitch});
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      if(name==='desktop'||id==='vanguard')await capture(page,`${name}-${id}-${angle}`);
    }
  }
  assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),beforeStorage,'review changed saves');
  await page.selectOption('#ship','vanguard');await page.waitForTimeout(200);
  const first=await page.evaluate(()=>shipReview.views[1].diagnostics);
  for(let i=0;i<24;i++){await page.selectOption('#ship',i%2?'vanguard':'wasp');}
  await page.waitForTimeout(200);const last=await page.evaluate(()=>shipReview.views[1].diagnostics);
  assert(last.geometries<=first.geometries+2,'geometry growth after switching');assert(last.textures<=first.textures+1,'texture growth');
  await page.locator('#bloom').uncheck();await capture(page,`${name}-vanguard-no-bloom`);
  // Exercise the actual production integration in an isolated browser profile.
  await page.goto(base+'/index.html?play=1');await page.locator('#start').click();
  await page.waitForFunction(()=>typeof bay3d!=='undefined'&&bay3d.state==='ready'&&bay3d.ship.diagnostics.authored,{},{timeout:30000});
  await page.waitForTimeout(500);await capture(page,`${name}-hangar`);
  assert(await page.locator('#shipBay3d').isVisible());
  const snapshot=await page.evaluate(()=>JSON.stringify(localStorage));
  const rect=await page.locator('#shipBay').boundingBox();
  await page.mouse.move(rect.x+rect.width*.4,rect.y+rect.height*.5);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.65,rect.y+rect.height*.65,{steps:10});await page.mouse.up();
  await capture(page,`${name}-hangar-rotated`);
  assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),snapshot,'rotation changed saves');
  // Force context loss and verify the original 2D fallback actually becomes visible.
  await page.evaluate(()=>document.getElementById('shipBay3d').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>bay3d.ship.lost&&bay3d.canvas.style.display==='none');await capture(page,`${name}-context-loss-fallback`);
  assert.equal(errors.length,0,errors.join('\n'));
  results.push({profile:name,status:'passed',checks,memory:{first,last},note:'Browser/device emulation on Linux; not physical iOS hardware or a device performance benchmark.'});
 }catch(e){try{await capture(page,`${name}-FAILURE`);}catch{}failures.push({profile:name,error:e.stack,console:errors});}
 finally{await browser.close();}
}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 try{for(const p of profiles){console.log('Testing',p[0]);try{await run(...p,base);}catch(e){failures.push({profile:p[0],error:e.stack});}}}
 finally{server.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,failures},null,2));console.log(JSON.stringify({passed:results.map(r=>r.profile),failures},null,2));if(failures.length)process.exitCode=1;}
})();
