// Holo HUD decor: one shared layer of sci-fi bits (radar sweep, tick rings, rulers, grid, scanline,
// ticking telemetry) that lives inside whichever overlay is on top.
// Purely decorative: aria-hidden, no pointer events, and inert outside a real browser DOM.
// Performance: only the radar sweep and the tick ring animate every frame (in CSS, transform only).
// Everything else is stepped here a few times a second, which costs a tiny repaint instead of
// extra layers redrawn over the live game canvases every frame.
function initHoloDecor(){
  if(typeof document==='undefined'||typeof document.createElement!=='function'||!document.body||typeof MutationObserver!=='function')return;
  const deco=document.createElement('div');
  deco.className='holo-deco';deco.setAttribute('aria-hidden','true');
  let ticks='';for(let i=0;i<60;i++)ticks+='<line x1="50" y1="'+(i%5?2:.5)+'" x2="50" y2="'+(i%5?4.5:5.5)+'" transform="rotate('+i*6+' 50 50)"/>';
  deco.innerHTML='<div class="hd-grid"></div><div class="hd-scan"></div>'+
    '<div class="hd-radar"><i class="hd-sweep"></i><b class="hd-blip"></b><b class="hd-blip hd-blip2"></b></div>'+
    '<div class="hd-ring"><svg viewBox="0 0 100 100" stroke="currentColor" stroke-width=".6">'+ticks+'</svg><i></i><span class="hd-ring-num">00</span></div>'+
    '<div class="hd-ruler hd-ruler-t"></div><div class="hd-ruler hd-ruler-b"><i></i></div>'+
    '<div class="hd-readout hd-readout-l"></div><div class="hd-readout hd-readout-r"></div>'+
    '<div class="hd-chev"><i></i><i></i><i></i><i></i></div>'+
    '<div class="hd-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  const $d=q=>deco.querySelector(q),$all=q=>[...deco.querySelectorAll(q)];
  const left=$d('.hd-readout-l'),right=$d('.hd-readout-r'),ringNum=$d('.hd-ring-num'),arc=$d('.hd-ring i'),marker=$d('.hd-ruler-b i');
  const bars=$all('.hd-bars i'),chev=$all('.hd-chev i'),blips=$all('.hd-blip');
  const hex=n=>Math.floor(Math.random()*n).toString(16).toUpperCase().padStart(4,'0');
  const pct=()=>String(60+Math.floor(Math.random()*40)).padStart(2,'0');
  const still=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)');
  let timer=0,step=0,arcTurn=0,markerAt=0;
  function tick(){
    step++;
    if(step%2===1){
      left.innerHTML='<span>SYS//'+hex(65535)+'</span><span>PWR '+pct()+'%</span><span>MEM '+pct()+'%</span><span>NET '+pct()+'%</span><span>LNK <em>OK</em></span>';
      right.innerHTML='<span>SECTOR '+hex(255)+'</span><span>VEC '+(Math.random()*360).toFixed(1)+'°</span><span>FLUX '+(Math.random()*9).toFixed(2)+'</span>';
      ringNum.textContent=pct();
    }
    const root=document.documentElement;   // also still with the game's Motion setting or Low graphics
    if(still&&still.matches||root.classList.contains('gfx-reduced-motion')||root.classList.contains('gfx-lite'))return;
    for(const b of bars)b.style.transform='scaleY('+(.15+Math.random()*.85).toFixed(2)+')';
    chev.forEach((c,i)=>c.classList.toggle('on',i===step%(chev.length+2)));
    blips.forEach((b,i)=>{b.style.opacity=(step+i*5)%9<2?'1':'0'});
    if(step%3===0){arcTurn-=40;arc.style.transform='rotate('+arcTurn+'deg)'}
    if(step%6===0){markerAt=Math.random()*100;marker.style.left='calc('+markerAt.toFixed(1)+'% - '+(markerAt*.12).toFixed(1)+'px)'}
  }
  const overlays=()=>[...document.querySelectorAll('.overlay')].filter(o=>!o.classList.contains('hidden'));
  function rehome(){
    const open=overlays(),top=open[open.length-1];
    if(top){if(deco.parentNode!==top)top.insertBefore(deco,top.firstChild);if(!timer){tick();timer=setInterval(tick,330)}}
    else{if(deco.parentNode)deco.parentNode.removeChild(deco);if(timer){clearInterval(timer);timer=0}}
  }
  const watch=new MutationObserver(rehome);
  for(const o of document.querySelectorAll('.overlay'))watch.observe(o,{attributes:true,attributeFilter:['class']});
  rehome();
}
initHoloDecor();
