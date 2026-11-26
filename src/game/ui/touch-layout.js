// Touch layout: drag the Dash (and manual Fire) buttons wherever your thumbs rest. Positions are saved per
// profile as fractions of the screen, so they survive rotation and different screen sizes, and are clamped
// so a button always stays fully on screen. Settings > Movement > "Move touch buttons" opens the editor.
// Also keeps the ability card (#abilityHUD) above the bottom loadout dock, whatever height the dock is.
const touchLayoutIds=['dashButton','fireButton'];
function loadTouchLayout(){
  try{
    const raw=JSON.parse(profileStorage.getItem('ns_touch_layout')||'null'),out={};
    if(raw&&typeof raw==='object')for(const id of touchLayoutIds){const p=raw[id];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))out[id]={x:Math.min(1,Math.max(0,p.x)),y:Math.min(1,Math.max(0,p.y))}}
    return out;
  }catch(e){return {}}
}
let touchLayout=loadTouchLayout(),touchLayoutOpen=false;
function saveTouchLayout(){try{profileStorage.setItem('ns_touch_layout',JSON.stringify(touchLayout))}catch(e){}}
// Place one element (a real button or its editor handle) from the saved layout, or back to its stylesheet spot.
function placeTouchElement(el,id){
  if(!el||!el.style)return;
  const p=touchLayout[id],st=el.style;
  if(p){
    const half=id==='fireButton'?40:38;   // half the button's size plus a little, so it stays fully on screen
    st.left='clamp('+half+'px, '+(p.x*100).toFixed(2)+'%, calc(100% - '+half+'px))';
    st.top='clamp(calc('+half+'px + env(safe-area-inset-top)), '+(p.y*100).toFixed(2)+'%, calc(100% - '+half+'px - env(safe-area-inset-bottom)))';
    st.right='auto';st.bottom='auto';st.transform='translate(-50%,-50%)';
  }else{st.left='';st.top='';st.right='';st.bottom='';st.transform=''}
}
function applyTouchLayout(){
  for(const id of touchLayoutIds){
    placeTouchElement($(id),id);
    if(typeof document!=='undefined'&&document.querySelector)placeTouchElement(document.querySelector('.touch-handle[data-for="'+id+'"]'),id);
  }
}
function openTouchLayout(){
  if(touchLayoutOpen)return;touchLayoutOpen=true;
  const fire=document.querySelector('.touch-handle[data-for="fireButton"]');
  if(fire)fire.classList.toggle('hidden',fireMode!=='manual');
  applyTouchLayout();show('settings',false);show('touchLayout',true);
  const done=$('touchLayoutDone');if(done&&done.focus)done.focus();
}
function closeTouchLayout(){
  if(!touchLayoutOpen)return;touchLayoutOpen=false;
  saveTouchLayout();show('touchLayout',false);show('settings',true);
  const back=$('touchLayoutOpen');if(back&&back.focus)back.focus();
}
function resetTouchLayout(){touchLayout={};saveTouchLayout();applyTouchLayout()}
function wireTouchLayout(){
  if(typeof document==='undefined'||typeof document.querySelectorAll!=='function'||typeof addEventListener!=='function')return;
  const open=$('touchLayoutOpen'),done=$('touchLayoutDone'),reset=$('touchLayoutReset');
  if(open&&open.addEventListener)open.addEventListener('click',openTouchLayout);
  if(done&&done.addEventListener)done.addEventListener('click',closeTouchLayout);
  if(reset&&reset.addEventListener)reset.addEventListener('click',resetTouchLayout);
  for(const handle of document.querySelectorAll('.touch-handle')){
    const id=handle.dataset.for;let drag=null;
    handle.addEventListener('pointerdown',e=>{
      e.preventDefault();const r=handle.getBoundingClientRect();
      drag={dx:e.clientX-(r.left+r.width/2),dy:e.clientY-(r.top+r.height/2)};
      handle.setPointerCapture?.(e.pointerId);handle.classList.add('dragging');
    });
    handle.addEventListener('pointermove',e=>{
      if(!drag)return;
      touchLayout[id]={x:Math.min(1,Math.max(0,(e.clientX-drag.dx)/innerWidth)),y:Math.min(1,Math.max(0,(e.clientY-drag.dy)/innerHeight))};
      placeTouchElement(handle,id);
    });
    const end=()=>{if(!drag)return;drag=null;handle.classList.remove('dragging');applyTouchLayout()};
    handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
    // Keyboard: arrow keys nudge the focused handle (Shift for bigger steps).
    handle.addEventListener('keydown',e=>{
      const step=e.shiftKey?.05:.01,move={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];
      if(!move)return;e.preventDefault();
      const r=handle.getBoundingClientRect(),p=touchLayout[id]||{x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height/2)/innerHeight};
      touchLayout[id]={x:Math.min(1,Math.max(0,p.x+move[0])),y:Math.min(1,Math.max(0,p.y+move[1]))};applyTouchLayout();
    });
  }
  // Escape finishes editing (and must not also close Settings underneath, which the game's own handler would).
  addEventListener('keydown',e=>{if(touchLayoutOpen&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeTouchLayout()}},true);
  // Keep the ability card clear of the loadout dock: --dock-clear is the dock's top edge, measured from the bottom.
  const dock=document.querySelector('.loadout'),root=document.documentElement;
  const measure=()=>{if(!dock||!root||typeof dock.getBoundingClientRect!=='function'||!root.style)return;const r=dock.getBoundingClientRect();if(r.height>0)root.style.setProperty('--dock-clear',Math.round(innerHeight-r.top)+'px')};
  if(dock&&typeof ResizeObserver==='function')new ResizeObserver(measure).observe(dock);
  addEventListener('resize',measure);measure();
  applyTouchLayout();
}
wireTouchLayout();
