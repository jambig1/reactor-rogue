const fs=require('fs'),vm=require('vm'),assert=require('assert');const file=require('path').join(__dirname,'index.html');let html=fs.readFileSync(file,'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1],map={},storage={},events={},depth=0;
const ctx=new Proxy({save(){depth++},restore(){depth--;assert(depth>=0)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
function element(id){return map[id]||(map[id]={style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},dataset:{},getContext:()=>ctx,addEventListener(){},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>[],querySelector:()=>element('q'),textContent:'',innerHTML:'',value:1,checked:false})}
let c={console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Infinity,performance:{now:()=>0},document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){},hidden:false},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},matchMedia:()=>({matches:false}),innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener:(name,cb)=>{(events[name]??=[]).push(cb)},requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};c.window=c;vm.createContext(c);vm.runInContext(js,c);let run=code=>vm.runInContext(code,c);






// v1.6 expedition route maps: 300 random maps must be well-formed.
for(let t=0;t<300;t++){let act=t%5,m=run('expGenAct('+act+','+(t*7919+13)+')');
 assert.equal(m.rows.length,7);assert.equal(m.rows[0].length,3);let last=m.rows[6];assert.equal(last.length,1);assert.equal(last[0].type,act===4?'final':'boss');
 assert(m.rows[5].some(n=>n.type==='outpost'),'an outpost before the boss');
 for(let k=0;k<6;k++){let A=m.rows[k],B=m.rows[k+1];for(let n of A){assert(n.next.length>=1,'no dead ends');for(let j of n.next)assert(j>=0&&j<B.length)}
  for(let j=0;j<B.length;j++)assert(A.some(n=>n.next.includes(j)),'every node reachable');
  // links never cross: order by column on both rows
  let edges=[];A.forEach((n,i)=>n.next.forEach(j=>edges.push([i,j])));for(let a of edges)for(let b of edges)assert(!(a[0]<b[0]&&a[1]>b[1]),'crossing link')
  for(let n of A)assert(run('expActBiomes['+act+']').includes(n.biome))}
 assert.equal(m.rows[0].every(n=>n.type==='planet'),true)}
// difficulty rises with depth and stays within the tuned range
assert(run('expDifficultyTime({act:0,node:null})')<run('expDifficultyTime({act:2,node:[3,0]})'));assert(run('expDifficultyTime({act:4,node:[6,0]})')<=620);
console.log('expedition maps ok');
