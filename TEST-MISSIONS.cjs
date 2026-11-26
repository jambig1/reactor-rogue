const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);






// v1.5 mission board, Lost Signal outpost and Neon Slots.
const fresh=()=>run("state='menu';start();s.enemies=[];s.spawn=999;s.elite=999;s.nextBreach=999;s.terrainNext=999");
run("hangar.missions=null;hangar.credits=500");
let st=run('missionState()');assert.equal(st.board.length,3);assert.deepEqual(st.board.map(m=>m.tier),[0,1,2]);
for(let i=0;i<40;i++){run("hangar.missions=null");assert(!run("missionState().board.some(m=>m.tier===0&&m.k==='clean')"),'no hitless boss missions on Easy')}
// accept up to two
run("hangar.missions=null;missionState()");let ids=run('missionState().board.map(m=>m.id)');assert(run('toggleMission('+ids[0]+')'));assert(run('toggleMission('+ids[1]+')'));assert(!run('toggleMission('+ids[2]+')'),'third cannot be accepted');assert.equal(run('activeMissions().length'),2);
// a run: force a kill mission into the active set, complete it, bank it
run("let st=missionState();st.board[1]={id:st.next++,k:'kills',tier:1,n:5,active:true};saveHangar()");fresh();assert.equal(run('s.missions.length'),2);
let c0=run('hangar.credits');run('s.kills=6;checkRunMissions()');assert(run("s.missions.find(m=>m.k==='kills'&&m.n===5).done"));assert(run("$('toast').textContent").includes('MISSION COMPLETE'));
run("commitHangar('defeated')");assert.equal(run('hangar.credits')-c0>=120,true,'medium mission pays 120 credits');run("commitHangar('defeated')");let c1=run('hangar.credits');run("commitHangar('defeated')");assert.equal(run('hangar.credits'),c1,'paid once');
assert.equal(run('missionState().done'),1);assert.equal(run('missionState().board.length'),3);assert(!run("missionState().board.some(m=>m.k==='kills'&&m.n===5)"),'completed mission replaced');
// reroll keeps accepted missions and costs credits
let act=run('activeMissions().map(m=>m.id)'),cr=run('hangar.credits');assert(run('rerollMissions()'));assert.equal(run('hangar.credits'),cr-20);for(let id of act)assert(run('missionState().board.some(m=>m.id==='+id+')'));
// outpost: three unowned parts, buying grants the part and spends credits, restocks after a run
run("hangar.outpost=null;hangar.credits=2000");let stock=run('outpostState().stock');assert.equal(stock.length,3);for(let id of stock)assert(!run('partState().owned['+JSON.stringify(id)+']'));
let id=stock[0],price=run('outpostPrices[shipParts.find(d=>d.id==='+JSON.stringify(id)+').r]');assert(run('buyOutpostPart('+JSON.stringify(id)+')'));assert.equal(run('hangar.credits'),2000-price);assert(run('partState().owned['+JSON.stringify(id)+']'));assert.equal(run('outpostState().stock.length'),2);
run('outpostRestockAfterRun()');assert.equal(run('outpostState().stock.length'),3);
// slots payout table
assert.equal(run('slotPayout([0,0,0],10)'),200);assert.equal(run('slotPayout([5,5,5],10)'),0);assert.equal(run('slotPayout([1,1,4],10)'),20);assert.equal(run('slotPayout([5,5,0],10)'),0);assert.equal(run('slotPayout([0,1,2],10)'),0);
let ret=0;for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++)ret+=run('slotPayout(['+a+','+b+','+c+'],10)');ret/=216*10;assert(ret>.88&&ret<.96,'slots return about 92% ('+ret+')');
console.log('missions, outpost and slots ok · slots return '+(ret*100).toFixed(1)+'%');
