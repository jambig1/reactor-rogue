import * as T from './vendor/three-0.187.0/three.module.js';
import {buildBlenderShip, fittingSlots, hasBlenderShip, loadBlenderFittings, loadBlenderShip} from './ship3d-blender.js';

const resolution = 256;
const limit = 6;
const sprites = new Map();
let renderer;

function getRenderer() {
  if (renderer?.getContext().isContextLost()) {
    renderer.dispose();
    renderer = undefined;
  }
  if (!renderer) {
    renderer = new T.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'});
    renderer.setSize(resolution,resolution,false);
    renderer.setClearColor(0x000000,0);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
  }
  return renderer;
}

function bakeShip(id, hull, record, parts, fittings) {
  const gpu = getRenderer();
  const model = buildBlenderShip(T,id,hull,record,parts,fittings);
  try {
    // Exhaust is drawn live at its exported sockets. The cached layer is the
    // opaque airframe, including fitted hardware, paint and emissive trim.
    for (const {outer,inner} of model.flames) {
      outer.removeFromParent();
      inner.removeFromParent();
    }
    const scene = new T.Scene();
    scene.add(model.root, new T.HemisphereLight(0xd8efff,0x435069,2.25));
    const key = new T.DirectionalLight(0xfff0d7,3);
    key.position.set(3,2,5);
    const rim = new T.DirectionalLight(0x6dbbff,1.8);
    rim.position.set(-2,-4,2);
    scene.add(key,rim);

    const bounds = new T.Box3().setFromObject(model.root);
    const extent = Math.max(48,Math.abs(bounds.min.x),Math.abs(bounds.max.x),Math.abs(bounds.min.y),Math.abs(bounds.max.y))+4;
    const camera = new T.OrthographicCamera(-extent,extent,extent,-extent,.1,240);
    camera.position.set(0,0,140);
    camera.lookAt(0,0,0);
    gpu.render(scene,camera);
    if (gpu.getContext().isContextLost()) throw new Error('Flight sprite context lost');

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = resolution;
    canvas.getContext('2d').drawImage(gpu.domElement,0,0);
    return {
      image:canvas,
      extent,
      outlets:model.flames.map(({x,y,r})=>({x,y:-y,r})),
      exhaust:record.trail || record.color || '#69f5e1',
    };
  } finally {
    for (const disposable of model.disposables) disposable.dispose();
    gpu.renderLists.dispose();
  }
}

export function loadFlightShip(id, record, parts) {
  if (!hasBlenderShip(id)) return Promise.resolve(null);
  const key = JSON.stringify([id,record.color,record.trail,record.pattern,record.patternColor,
    Object.entries(parts).sort(([a],[b])=>a.localeCompare(b))]);
  if (sprites.has(key)) {
    const cached = sprites.get(key);
    sprites.delete(key);
    sprites.set(key,cached);
    return cached;
  }

  const job = Promise.resolve().then(async () => {
    getRenderer();
    const [hull,slots] = await Promise.all([
      loadBlenderShip(id),
      Promise.all(fittingSlots(parts).map(async slot=>[slot,await loadBlenderFittings(id,slot)])),
    ]);
    return bakeShip(id,hull,record,parts,new Map(slots));
  }).catch(error=>{
    if (sprites.get(key) === job) sprites.delete(key);
    throw error;
  });
  sprites.set(key,job);
  if (sprites.size > limit) sprites.delete(sprites.keys().next().value);
  return job;
}

export function paintFlightShip(ctx,sprite,t,{heading,bank,thrust,boost,phased,reducedMotion}) {
  ctx.save();
  ctx.rotate(heading);
  ctx.scale(1,bank);
  ctx.shadowBlur = 0;
  if (phased) ctx.globalAlpha *= .6;
  if (!reducedMotion) {
    const pulse = 1.5 + Math.sin(t*17)*1.5;
    const length = (boost ? 25 : 5 + thrust*11) + pulse;
    for (const {x,y,r} of sprite.outlets) {
      ctx.save();
      ctx.fillStyle = sprite.exhaust;
      ctx.globalAlpha *= .42;
      ctx.beginPath();
      ctx.moveTo(x+1,y-r);
      ctx.quadraticCurveTo(x-length*.35,y-r*.88,x-length,y);
      ctx.quadraticCurveTo(x-length*.35,y+r*.88,x+1,y+r);
      ctx.fill();
      ctx.fillStyle = '#dffcff';
      ctx.globalAlpha *= .82;
      ctx.beginPath();
      ctx.moveTo(x+1,y-r*.47);
      ctx.lineTo(x-length*.64,y);
      ctx.lineTo(x+1,y+r*.47);
      ctx.fill();
      ctx.restore();
    }
  }
  const e = sprite.extent;
  ctx.drawImage(sprite.image,-e,-e,e*2,e*2);
  ctx.restore();
}
