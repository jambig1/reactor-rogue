/* Reactor Rogue PixiJS layer, v0.89 (stage 2 of the PixiJS move).
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
