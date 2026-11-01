const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);






run("state='menu';start();s.enemies=[];s.debris=[];s.clouds=[];s.fx=[];s.items={laser:3,rail:3,sails:3,leech:3,prism:3};s.p.x=0;s.p.y=0");
let target=run("({x:150,y:0,r:15,hp:10000,max:10000,type:0,arrival:0,freeze:0})");c.target=target;run('s.enemies=[target]');run("newBeam('rail',s.p,0,400,7,20)");assert.equal(target.hp<10000,true);assert.equal(run('s.fx[0].beamStyle'),'rail');assert.equal(run('s.fx[0].beamHits.length'),1);
run("s.fx=[];attack(.01)");let styles=run('s.fx.filter(f=>f.beamStyle).map(f=>f.beamStyle)');for(let id of ['laser','rail','sails','leech','prism'])assert(styles.includes(id),id);
run("s.fx=[];line(s.p,{x:100,y:100},'#c298ff',3,.2)");assert(!run('s.fx[0].beamStyle'));assert.equal(run('s.fx.length'),1);
run("s.fx=[];newBeam('rail',s.p,0,400,7,20)");for(let i=0;i<20;i++)run('beamHitMark(s.fx[0],{x:100,y:0})');assert.equal(run('s.fx[0].beamHits.length'),4);
let before=run('JSON.stringify(s)'),rng=Math.random;Math.random=()=>{throw Error('Rendering used gameplay RNG')};
for(let mode of ['low','medium','high'])for(let motion of [false,true]){run("graphics.preset="+JSON.stringify(mode)+";refreshGraphicsVisual();reducedMotion="+motion+";beamVisualCount=0");for(let style of ['laser','rail','sails','leech','prism','fence','harpoon']){run("drawWeaponBeam({x:0,y:0,bx:400,by:50,c:'#c298ff',width:12,life:.2,max:.3,beamStyle:"+JSON.stringify(style)+",beamHits:[{x:120,y:15}]},1)")}assert.equal(depth,0)}
run("drawWeaponBeam({x:0,y:0,bx:0,by:0,life:1,max:1,c:'#fff'},0);drawWeaponBeam({x:0,y:0,bx:NaN,by:10,life:1,max:1,c:'#fff'},0)");assert.equal(run('JSON.stringify(s)'),before);Math.random=rng;
let hitsBefore=target.hp;run('drawWeaponBeam(s.fx[0],1)');assert.equal(target.hp,hitsBefore);assert.equal(depth,0);
console.log('PASS tagged beam weapons, unchanged damage path, plain lightning distinction, bounded hit markers, all quality/motion profiles, no rendering RNG/state writes and degenerate beams');
