// Holo HUD decor: one shared layer of animated sci-fi bits (radar sweep, tick rings,
// rulers, grid, scanline, ticking telemetry) that lives inside whichever overlay is on top.
// Purely decorative: aria-hidden, no pointer events, and inert outside a real browser DOM.
function initHoloDecor(){
  if(typeof document==='undefined'||typeof document.createElement!=='function'||!document.body||typeof MutationObserver!=='function')return;
  const deco=document.createElement('div');
  deco.className='holo-deco';deco.setAttribute('aria-hidden','true');
  deco.innerHTML='<div class="hd-grid"></div><div class="hd-scan"></div>'+
    '<div class="hd-radar"><i class="hd-sweep"></i><b class="hd-blip"></b><b class="hd-blip hd-blip2"></b></div>'+
    '<div class="hd-ring"><i></i><i></i><span class="hd-ring-num">00</span></div>'+
    '<div class="hd-ruler hd-ruler-t"></div><div class="hd-ruler hd-ruler-b"><i></i></div>'+
    '<div class="hd-readout hd-readout-l"></div><div class="hd-readout hd-readout-r"></div>'+
    '<div class="hd-chev"><i></i><i></i><i></i><i></i></div>'+
    '<div class="hd-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  const left=deco.querySelector('.hd-readout-l'),right=deco.querySelector('.hd-readout-r'),ringNum=deco.querySelector('.hd-ring-num');
  const hex=n=>Math.floor(Math.random()*n).toString(16).toUpperCase().padStart(4,'0');
  const pct=()=>String(60+Math.floor(Math.random()*40)).padStart(2,'0');
  let timer=0;
  function tick(){
    left.innerHTML='<span>SYS//'+hex(65535)+'</span><span>PWR '+pct()+'%</span><span>MEM '+pct()+'%</span><span>NET '+pct()+'%</span><span>LNK <em>OK</em></span>';
    right.innerHTML='<span>SECTOR '+hex(255)+'</span><span>VEC '+(Math.random()*360).toFixed(1)+'°</span><span>FLUX '+(Math.random()*9).toFixed(2)+'</span>';
    ringNum.textContent=pct();
  }
  const overlays=()=>[...document.querySelectorAll('.overlay')].filter(o=>!o.classList.contains('hidden'));
  function rehome(){
    const open=overlays(),top=open[open.length-1];
    if(top){if(deco.parentNode!==top)top.insertBefore(deco,top.firstChild);if(!timer){tick();timer=setInterval(tick,650)}}
    else{if(deco.parentNode)deco.parentNode.removeChild(deco);if(timer){clearInterval(timer);timer=0}}
  }
  const watch=new MutationObserver(rehome);
  for(const o of document.querySelectorAll('.overlay'))watch.observe(o,{attributes:true,attributeFilter:['class']});
  rehome();
}
initHoloDecor();
