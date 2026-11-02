const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Image:class{constructor(){this.complete=true;this.naturalWidth=1254}},Math:Object.create(Math),Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);



function fresh(id='vanguard'){run(`state='menu';hangar.ships=pilots.map(p=>p.id);selectedPilot='${id}';start();s.debris=[];s.debrisClock=99999;s.need=Infinity;s.spawn=99999;s.elite=99999;s.enemies=[];s.items={[s.pilot.starter]:1}`)}

function setup(id,path='',evolved=false){fresh();run(`Math.random=()=>.99;s.items={'${id}':3};s.spec=${path?`{'${id}':'${path}'}`:'{}'};s.evolved=${evolved?`{'${id}':true}`:'{}'};s.p.hp=50;s.pilot.damage=1;s.t=100;s.nextBreach=999;s.specialClock=999;s.spawn=999;s.elite=999;s.need=Infinity;s.debris=[];spawn(0);target=s.enemies[0];target.x=100;target.y=0;target.hp=target.max=100000;target.v=0;target.armour=0`)}



fresh();run("s.sector='city'");let random=c.Math.random;c.Math.random=()=>{throw Error('City consumed gameplay RNG')};
// Use real cache path with fake offscreen canvases; verify warm draws reuse and LRU bounds.
let made=0;c.document.createElement=tag=>{assert.equal(tag,'canvas');made++;return {width:0,height:0,getContext:()=>ctx}};
let before=run('JSON.stringify(s)');run('drawCityArena(0,0,10)');let warm=made;run('drawCityArena(0,0,11)');assert.equal(made,warm);assert(run('cityScenery.tiles.size<=32'));assert(run('!!cityScenery.cloud'));for(let i=0;i<50;i++)run(`drawCityArena(${i*700},${i*400},10)`);assert(run('cityScenery.tiles.size<=32'));assert.equal(run('JSON.stringify(s)'),before);assert.equal(depth,0);
// Reduced motion is time invariant; detailed mode evolves only drawing, never state.
run("drawCityArena(0,0,0)");let ops=[];ctx.fillRect=(...args)=>ops.push(['rect',...args]);ctx.moveTo=(...args)=>ops.push(['move',...args]);ctx.lineTo=(...args)=>ops.push(['line',...args]);ctx.drawImage=(...args)=>ops.push(['image',...args.slice(1)]);ctx.translate=(...args)=>ops.push(['translate',...args]);run('reducedMotion=true;drawCityArena(0,0,2)');let first=JSON.stringify(ops);ops=[];run('drawCityArena(0,0,22)');assert.equal(JSON.stringify(ops),first);ops=[];run('reducedMotion=false;drawCityArena(0,0,2)');first=JSON.stringify(ops);ops=[];run('drawCityArena(0,0,22)');assert.notEqual(JSON.stringify(ops),first);assert.equal(run('JSON.stringify(s)'),before);assert.equal(depth,0);c.Math.random=random;
console.log('PASS city static tile/cloud reuse, bounded32tile LRU, private hash/no gameplay RNG, pure rendering, animated traffic and time-invariant reduced motion');
