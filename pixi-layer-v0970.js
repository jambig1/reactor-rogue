/* Reactor Rogue PixiJS layer, v0.89 (stage 2 of the PixiJS move); v0.97 adds pixi-filters screen effects
   (shockwave ripples, hit glitch, freeze grade) on this layer only, loaded lazily and skipped if unavailable.
   A WebGL canvas between the three.js background (#gpuLayer) and the 2D playfield (#game). It batches the
   things there are most of: ordinary enemy hulls and the floating sector scenery. Each enemy design is
   painted once by the existing canvas painter into a texture (keyed by fleet, type, role, colour and
   state), then drawn as GPU sprites. Purely cosmetic: it never reads or changes simulation, RNG or
   collision. Any failure returns null and the game keeps drawing everything on the 2D canvas. */
export const PIXI_URL = new URL('./vendor/pixi.js-8.23.0/pixi.js', import.meta.url).href;

export async function createPixiLayer(canvas, load = () => import(PIXI_URL), options = {}) {
  if (!canvas) return null;
  const P = await load();
  const app = new P.Application();
  try {
    await app.init({ canvas, backgroundAlpha: 0, antialias: false, autoStart: false, sharedTicker: false, preference: 'webgl', resolution: options.resolution || 1, autoDensity: false, width: options.width || 1, height: options.height || 1, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  if (app.ticker) app.ticker.stop();
  const world = new P.Container(), scenery = new P.Container(), sceneryGlow = new P.Container(), shadows = new P.Container(), hulls = new P.Container();
  world.addChild(scenery, sceneryGlow, shadows, hulls); app.stage.addChild(world);
  // v0.97 pixi-filters. Effects are only attached while something is playing, so idle frames cost nothing.
  let F = options.filters !== false && P.ShockwaveFilter ? P : null;
  const waves = [], fxState = { hurt: 0, hurtMax: 0.3, freeze: 0, clock: 0 }; let split = null, glitch = null, grade = null, filterArea = null;
  if (F) {
    try {
      split = new F.RGBSplitFilter({ red: { x: 0, y: 0 }, green: { x: 0, y: 0 }, blue: { x: 0, y: 0 } });
      glitch = new F.GlitchFilter({ slices: 6, offset: 0, direction: 0, fillMode: 2, average: false, seed: 0.5 });
      grade = new F.AdjustmentFilter({ saturation: 1, brightness: 1, red: 1, green: 1, blue: 1 });
      filterArea = new P.Rectangle(0, 0, 1, 1);
    } catch (e) { F = null; }
  }
  const pools = new Map([[scenery, []], [sceneryGlow, []], [shadows, []], [hulls, []]]), used = new Map();
  const textures = new Map(), atlasSources = new Map(), MAX_TEX = 180;
  let lost = false, width = 1, height = 1, ratio = 1, drawn = 0;
  const glCanvas = app.canvas || canvas;
  glCanvas.addEventListener('webglcontextlost', () => { lost = true; layer.onLost && layer.onLost(); });

  function sprite(container) {
    let pool = pools.get(container), i = used.get(container) || 0, sp = pool[i];
    if (!sp) { sp = new P.Sprite(); sp.anchor.set(0.5); container.addChild(sp); pool.push(sp); }
    used.set(container, i + 1); sp.visible = true; drawn++; return sp;
  }
  function cachedTexture(key, make) {
    let hit = textures.get(key);
    if (hit) { textures.delete(key); textures.set(key, hit); return hit; }
    let made = make(); if (!made) return null;
    if (textures.size >= MAX_TEX) { let [oldKey, old] = textures.entries().next().value; textures.delete(oldKey); if (old.own) try { old.tex.destroy(true); } catch (e) {} }
    textures.set(key, made); return made;
  }
  function atlas(img) {
    let src = atlasSources.get(img);
    if (!src) { src = P.Texture.from(img); atlasSources.set(img, src); }
    return src;
  }
  const layer = {
    onLost: null,
    get lost() { return lost; },
    get sprites() { return drawn; },
    get textureCount() { return textures.size; },
    resize(w, h, r) { width = Math.max(1, w); height = Math.max(1, h); ratio = r || 1; app.renderer.resolution = ratio; app.renderer.resize(width, height); },
    setVisible(on) { canvas.style.display = on ? 'block' : 'none'; },
    begin() { drawn = 0; for (let c of pools.keys()) used.set(c, 0); },
    // m: the 2D canvas transform in device pixels (DOMMatrix-like), so sprites line up exactly with it.
    camera(m) { world.setFromMatrix(new P.Matrix(m.a / ratio, m.b / ratio, m.c / ratio, m.d / ratio, m.e / ratio, m.f / ratio)); },
    // An ordinary enemy hull. paint(ctx2d) draws it in local units around (0,0); res = pixels per unit.
    enemy(key, paint, x, y, angle, scale, alpha = 1, res = 3, extent = 36) {
      let entry = cachedTexture(key, () => {
        if (typeof document === 'undefined' || !document.createElement) return null;
        let size = Math.ceil(extent * 2 * res), c = document.createElement('canvas'); c.width = c.height = size;
        let g = c.getContext('2d'); if (!g) return null; g.translate(size / 2, size / 2); g.scale(res, res);
        try { paint(g); } catch (e) { return null; }
        return { tex: P.Texture.from(c), own: true, res };
      });
      if (!entry) return false;
      let sh = sprite(shadows); sh.texture = entry.tex; sh.position.set(x + 1.5, y + 2.5); sh.rotation = angle; sh.scale.set(scale / entry.res); sh.tint = 0x020711; sh.alpha = 0.38 * alpha; sh.blendMode = 'normal';
      let sp = sprite(hulls); sp.texture = entry.tex; sp.position.set(x, y); sp.rotation = angle; sp.scale.set(scale / entry.res); sp.tint = 0xffffff; sp.alpha = alpha; sp.blendMode = 'normal';
      return true;
    },
    // A piece of floating scenery cut from an atlas image (and its additive glow atlas).
    scenery(img, sx, sy, w, h, x, y, angle, sx2, sy2, alpha, dim, glowImg, glowAlpha) {
      let key = 's|' + (img.src || '') + '|' + sx + ',' + sy;
      let entry = cachedTexture(key, () => ({ tex: new P.Texture({ source: atlas(img).source, frame: new P.Rectangle(sx, sy, w, h) }), own: false }));
      let sp = sprite(scenery); sp.texture = entry.tex; sp.position.set(x, y); sp.rotation = angle; sp.scale.set(sx2, sy2); sp.alpha = alpha; sp.blendMode = 'normal';
      let k = Math.round(255 * (1 - (dim || 0))); sp.tint = (k << 16) | (k << 8) | k;
      if (glowImg && glowAlpha > 0.01) {
        let gkey = 'g|' + (glowImg.src || '') + '|' + sx + ',' + sy;
        let ge = cachedTexture(gkey, () => ({ tex: new P.Texture({ source: atlas(glowImg).source, frame: new P.Rectangle(sx, sy, w, h) }), own: false }));
        let gs = sprite(sceneryGlow); gs.texture = ge.tex; gs.position.set(x, y); gs.rotation = angle; gs.scale.set(sx2, sy2); gs.alpha = Math.min(1, glowAlpha); gs.tint = 0xffffff; gs.blendMode = 'add';
      }
      return true;
    },
    get filters() { return !!F; },
    // A ripple from world point (x,y). power ~ 0.4 (heavy kill) .. 1.6 (boss / player death).
    shockwave(x, y, power = 1) {
      if (!F || lost) return false;
      let pt = world.toGlobal(new P.Point(x, y)), old = waves.length >= 4 ? waves.shift() : null;
      if (old) old.f.destroy?.();
      let f; try { f = new F.ShockwaveFilter({ center: { x: pt.x, y: pt.y }, speed: 520 + 260 * power, amplitude: 14 + 22 * power, wavelength: 90 + 60 * power, brightness: 1.12 + 0.12 * power, radius: 260 + 420 * power, time: 0 }); } catch (e) { return false; }
      waves.push({ f, wx: x, wy: y, t: 0, max: (260 + 420 * power) / (520 + 260 * power) + 0.15 }); return true;
    },
    hurt(strength = 1) { if (F) { fxState.hurt = fxState.hurtMax = 0.22 + 0.16 * Math.min(1, strength); fxState.hurtPower = Math.min(1, strength); } },
    freeze(level) { fxState.freeze = Math.max(0, Math.min(1, level || 0)); },
    tick(dt) {
      if (!F) return; fxState.clock += dt; let list = [];
      for (let i = waves.length - 1; i >= 0; i--) { let w = waves[i]; w.t += dt; if (w.t >= w.max) { try { w.f.destroy?.(); } catch (e) {} waves.splice(i, 1); continue; } let pt = world.toGlobal(new P.Point(w.wx, w.wy)); w.f.center = { x: pt.x, y: pt.y }; w.f.time = w.t; }
      for (let w of waves) list.push(w.f);
      if (fxState.freeze > 0.01) { let k = fxState.freeze; grade.saturation = 1 - 0.55 * k; grade.red = 1 - 0.25 * k; grade.green = 1 + 0.05 * k; grade.blue = 1 + 0.35 * k; grade.brightness = 1 + 0.08 * k; list.push(grade); }
      if (fxState.hurt > 0) {
        fxState.hurt = Math.max(0, fxState.hurt - dt); let k = fxState.hurt / fxState.hurtMax, o = 7 * k * (0.5 + 0.5 * (fxState.hurtPower || 1));
        split.red = { x: -o, y: 0 }; split.green = { x: 0, y: o * 0.4 }; split.blue = { x: o, y: 0 }; list.push(split);
        if (k > 0.35) { glitch.offset = 22 * k; glitch.seed = Math.random(); glitch.slices = 4 + Math.floor(Math.random() * 6); list.push(glitch); }
      }
      app.stage.filterArea = list.length ? (filterArea.width = width, filterArea.height = height, filterArea) : null;
      app.stage.filters = list.length ? list : null;
    },
    render() {
      if (lost) return;
      for (let [c, pool] of pools) { let n = used.get(c) || 0; for (let i = n; i < pool.length; i++) pool[i].visible = false; }
      app.renderer.render(app.stage);
    },
    clearTextures() { for (let { tex, own } of textures.values()) if (own) try { tex.destroy(true); } catch (e) {} textures.clear(); },
    dispose() { this.clearTextures(); try { app.destroy(false, { children: true }); } catch (e) {} }
  };
  return layer;
}
