// v0.90 sound pass: every ZzFX effect renders finite, bounded audio; every weapon has a family sound.
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const pick=(name)=>{let i=html.indexOf(name);assert(i>0,name);return i};
let a=pick('function zzfxBuild('),b=pick('const sfxFamily=');const src=html.slice(a,b);
const {sfxRender,sfxBank}=new Function(src+';return {sfxRender,sfxBank}')();
for(const [name,p] of Object.entries(sfxBank)){let pcm=sfxRender(44100,p);assert(pcm.length>100&&pcm.length<44100*3,name+' length');let peak=0;for(const v of pcm){assert(Number.isFinite(v),name+' finite');peak=Math.max(peak,Math.abs(v))}assert(peak>.01&&peak<=p[0]+1e-6,name+' peak '+peak)}
const fam=new Function(html.slice(b,html.indexOf(';',html.indexOf('const sfxFamily=')))+';return sfxFamily')();
const order=JSON.parse(html.match(/weaponAtlasOrder=(\[\[.*?\]\]);/)[1].replace(/'/g,'"')).flat();
for(const id of order)assert(fam[id]&&sfxBank[fam[id]],'weapon '+id+' has a sound');
assert(fs.existsSync(path.join(__dirname,'vendor/zzfx-1.4.0/LICENSE')));
console.log('PASS '+Object.keys(sfxBank).length+' ZzFX effects render cleanly; all '+order.length+' weapons mapped to a sound family');
