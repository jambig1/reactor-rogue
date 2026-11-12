/* Reactor Rogue GPU layer, v0.55.2.
   An optional Three.js renderer drawn on its own canvas beneath the 2D playfield canvas.
   Purely cosmetic: it receives screen-space data from draw() and never reads or changes
   simulation state, RNG, collision or progression. Any failure returns null or reports a
   loss, and the game keeps using the existing 2D renderer. */

export const THREE_VERSION = '0.187.0';
// Bundled beside the game (MIT licence in vendor/three-0.187.0/LICENSE); three.module.js imports ./three.core.js.
export const THREE_URL = new URL('./vendor/three-' + THREE_VERSION + '/three.module.js', import.meta.url).href;

const SPRITE_CAP = 4096;

// Full-screen background: the sector's seamless tile (same tile, scale and parallax as the
// 2D painter), its dark wash, then two procedural star layers at nearer parallax depths.
export const BACKGROUND_VERTEX = `precision highp float;
attribute vec3 position;
uniform vec2 uRes;
varying vec2 vScreen;
void main(){
  vec2 q = position.xy * 0.5 + 0.5;
  vScreen = vec2(q.x * uRes.x, (1.0 - q.y) * uRes.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export const BACKGROUND_FRAGMENT = `precision highp float;
uniform sampler2D uTex;
uniform float uHasTex;
uniform vec2 uOrigin;
uniform float uSpan;
uniform vec2 uCam;
uniform float uTime;
uniform float uMotion;
uniform float uStars;
uniform vec3 uTint;
varying vec2 vScreen;
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec3 starLayer(vec2 pos, float cell, float density, float size, float seed){
  vec2 g = floor(pos / cell);
  vec2 f = pos / cell - g;
  float h = hash(g + seed);
  if (h > density) return vec3(0.0);
  vec2 centre = vec2(hash(g + seed + 3.1), hash(g + seed + 7.7)) * 0.8 + 0.1;
  float d = length((f - centre) * cell);
  float twinkle = 0.7 + 0.3 * sin(uTime * (0.8 + h * 2.0) * uMotion + h * 40.0);
  float core = 1.0 - smoothstep(0.0, size, d);
  float halo = (1.0 - smoothstep(0.0, size * 4.0, d)) * 0.18;
  vec3 colour = mix(vec3(0.78, 0.88, 1.0), uTint, hash(g + seed + 1.3));
  return colour * (core + halo) * twinkle;
}
void main(){
  vec3 col = vec3(0.027, 0.063, 0.122);
  if (uHasTex > 0.5) col = texture2D(uTex, (vScreen - uOrigin) / uSpan).rgb;
  col = mix(col, vec3(0.0157, 0.0392, 0.0784), 0.2196);
  col += starLayer(vScreen + uCam * 0.55, 96.0, 0.20, 1.3, 0.0) * 0.30 * uStars;
  col += starLayer(vScreen + uCam * 0.82, 150.0, 0.12, 1.9, 17.0) * 0.45 * uStars;
  gl_FragColor = vec4(col, 1.0);
}`;

// Instanced soft sprites, added to the background. hard = 0 is a wide glow halo;
// hard = 1 adds a bright core, used for particles that replace the 2D squares.
export const SPRITE_VERTEX = `precision highp float;
attribute vec3 position;
attribute vec4 aSprite;
attribute vec4 aColor;
uniform vec2 uRes;
varying vec2 vUv;
varying vec4 vColor;
varying float vHard;
void main(){
  vUv = position.xy;
  vColor = aColor;
  vHard = aSprite.w;
  vec2 p = aSprite.xy + position.xy * aSprite.z;
  vec2 c = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;

export const SPRITE_FRAGMENT = `precision mediump float;
varying vec2 vUv;
varying vec4 vColor;
varying float vHard;
void main(){
  float d = length(vUv);
  if (d >= 1.0) discard;
  float glow = pow(1.0 - d, 2.4);
  float core = 1.0 - smoothstep(0.25, 0.55, d);
  float a = mix(glow, max(glow * 0.5, core), vHard) * vColor.a;
  gl_FragColor = vec4(vColor.rgb * a, a);
}`;

const colourCache = new Map();
export function parseColour(text) {
  let hit = colourCache.get(text);
  if (hit) return hit;
  let r = 1, g = 1, b = 1, a = 1, s = String(text || '').trim();
  if (s[0] === '#') {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = h.split('').map(x => x + x).join('');
    if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) {
      r = parseInt(h.slice(0, 2), 16) / 255; g = parseInt(h.slice(2, 4), 16) / 255; b = parseInt(h.slice(4, 6), 16) / 255;
      if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
    }
  } else {
    let m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      let p = m[1].split(',').map(Number);
      if (p.length >= 3 && p.slice(0, 3).every(Number.isFinite)) { r = p[0] / 255; g = p[1] / 255; b = p[2] / 255; if (Number.isFinite(p[3])) a = p[3]; }
    }
  }
  hit = [r, g, b, Math.max(0, Math.min(1, a))];
  if (colourCache.size > 512) colourCache.clear();
  colourCache.set(text, hit);
  return hit;
}

export async function createGpuLayer(canvas, loadThree = () => import(THREE_URL)) {
  if (!canvas) return null;
  const T = await loadThree();
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }
  renderer.setClearColor(0x07101f, 1);
  const gl = renderer.getContext();
  const scene = new T.Scene(), camera = new T.Camera();

  const bgGeometry = new T.BufferGeometry();
  bgGeometry.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const bgUniforms = {
    uTex: { value: null }, uHasTex: { value: 0 }, uOrigin: { value: new T.Vector2() }, uSpan: { value: 1 },
    uRes: { value: new T.Vector2(1, 1) }, uCam: { value: new T.Vector2() }, uTime: { value: 0 }, uMotion: { value: 1 },
    uStars: { value: 1 }, uTint: { value: new T.Vector3(0.5, 0.75, 0.75) }
  };
  const bgMaterial = new T.RawShaderMaterial({ uniforms: bgUniforms, vertexShader: BACKGROUND_VERTEX, fragmentShader: BACKGROUND_FRAGMENT, depthTest: false, depthWrite: false });
  const background = new T.Mesh(bgGeometry, bgMaterial);
  background.frustumCulled = false; background.renderOrder = 0;
  scene.add(background);

  const spriteGeometry = new T.InstancedBufferGeometry();
  spriteGeometry.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
  spriteGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  const spriteData = new Float32Array(SPRITE_CAP * 4), colourData = new Float32Array(SPRITE_CAP * 4);
  const aSprite = new T.InstancedBufferAttribute(spriteData, 4), aColor = new T.InstancedBufferAttribute(colourData, 4);
  aSprite.setUsage(T.DynamicDrawUsage); aColor.setUsage(T.DynamicDrawUsage);
  spriteGeometry.setAttribute('aSprite', aSprite); spriteGeometry.setAttribute('aColor', aColor);
  spriteGeometry.instanceCount = 0;
  const spriteMaterial = new T.RawShaderMaterial({
    uniforms: { uRes: bgUniforms.uRes }, vertexShader: SPRITE_VERTEX, fragmentShader: SPRITE_FRAGMENT,
    transparent: true, depthTest: false, depthWrite: false,
    blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneFactor
  });
  const sprites = new T.Mesh(spriteGeometry, spriteMaterial);
  sprites.frustumCulled = false; sprites.renderOrder = 1;
  scene.add(sprites);

  let count = 0, tile = null, texture = null, lost = false, width = 1, height = 1, ratio = 1;
  // Background modes: 'gpu' paints the sector tile here; 'overlay' means the 2D canvas paints the
  // background and this canvas sits above it, adding only glow and particles (CSS plus-lighter).
  let mode = 'gpu', pendingCheck = null;

  // Raw pixel upload: the most portable path. Uploading the 2D tile canvas directly produced a
  // black texture in Safari/WebKit (all iOS browsers), so the tile is read back once per sector.
  function tileTexture(source) {
    let w = source.width, h = source.height, data;
    try { data = source.getContext('2d').getImageData(0, 0, w, h).data; } catch (e) { return null; }
    let tex = new T.DataTexture(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), w, h, T.RGBAFormat, T.UnsignedByteType);
    tex.flipY = false; tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.colorSpace = T.NoColorSpace;
    tex.magFilter = T.LinearFilter; tex.minFilter = T.LinearMipmapLinearFilter; tex.generateMipmaps = true;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    tex.needsUpdate = true; tex.userData.pixels = data; tex.userData.w = w; tex.userData.h = h;
    return tex;
  }

  // Compare a few rendered background pixels (stars and sprites hidden) with the tile they should
  // show. Any mismatch on a device switches to overlay mode instead of showing a black playfield.
  function backgroundMatches(bg) {
    let px = texture.userData.pixels, tw = texture.userData.w, th = texture.userData.h, good = 0, tested = 0, out = new Uint8Array(4);
    let bw = gl.drawingBufferWidth, bh = gl.drawingBufferHeight;
    for (let [fx, fy] of [[0.5, 0.5], [0.3, 0.35], [0.7, 0.35], [0.3, 0.7], [0.7, 0.7]]) {
      let sx = fx * width, sy = fy * height;
      let u = ((sx - bg.originX) / bg.span % 1 + 1) % 1, v = ((sy - bg.originY) / bg.span % 1 + 1) % 1;
      let i = (Math.floor(v * th) * tw + Math.floor(u * tw)) * 4;
      let expected = [0, 1, 2].map(c => px[i + c] * (1 - 0.2196) + [4, 10, 20][c] * 0.2196);
      gl.readPixels(Math.floor(fx * bw), Math.floor((1 - fy) * bh), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, out);
      let diff = Math.abs(out[0] - expected[0]) + Math.abs(out[1] - expected[1]) + Math.abs(out[2] - expected[2]);
      tested++; if (diff <= 60) good++;
    }
    return good * 2 > tested;
  }

  function setMode(next) {
    if (mode === next) return;
    mode = next;
    background.visible = mode === 'gpu';
    renderer.setClearColor(mode === 'gpu' ? 0x07101f : 0x000000, mode === 'gpu' ? 1 : 0);
    if (layer.onModeChange) layer.onModeChange(mode);
  }

  const layer = {
    onLost: null,
    onModeChange: null,
    get lost() { return lost; },
    get mode() { return mode; },
    forceOverlay() { setMode('overlay'); },
    resize(w, h, r) {
      width = Math.max(1, w); height = Math.max(1, h); ratio = r || 1;
      renderer.setPixelRatio(ratio); renderer.setSize(width, height, false);
      bgUniforms.uRes.value.set(width, height);
    },
    setVisible(on) { canvas.style.display = on ? 'block' : 'none'; },
    begin() { count = 0; },
    // Screen-space CSS pixels. hard: 0 glow halo, 1 bright core.
    sprite(x, y, radius, colour, alpha = 1, hard = 0) {
      if (count >= SPRITE_CAP || !(radius > 0) || !(alpha > 0.002)) return;
      if (x < -radius || y < -radius || x > width + radius || y > height + radius) return;
      let c = parseColour(colour), i = count * 4;
      spriteData[i] = x; spriteData[i + 1] = y; spriteData[i + 2] = radius; spriteData[i + 3] = hard;
      colourData[i] = c[0]; colourData[i + 1] = c[1]; colourData[i + 2] = c[2]; colourData[i + 3] = c[3] * Math.min(1, alpha);
      count++;
    },
    get spriteCount() { return count; },
    render(frame) {
      if (lost) return;
      let bg = frame.background;
      if (mode === 'gpu' && bg && bg.tile) {
        if (bg.tile !== tile) {
          if (texture) texture.dispose();
          tile = bg.tile; texture = tileTexture(tile); bgUniforms.uTex.value = texture;
          if (!texture) { setMode('overlay'); return; }
          pendingCheck = true;
        }
        bgUniforms.uHasTex.value = 1; bgUniforms.uOrigin.value.set(bg.originX, bg.originY); bgUniforms.uSpan.value = bg.span;
      } else bgUniforms.uHasTex.value = 0;
      bgUniforms.uCam.value.set(frame.camX || 0, frame.camY || 0);
      bgUniforms.uTime.value = frame.time || 0;
      bgUniforms.uMotion.value = frame.reducedMotion ? 0 : 1;
      bgUniforms.uStars.value = frame.stars ?? 1;
      let tint = parseColour(frame.tint || '#7cbbb9');
      bgUniforms.uTint.value.set(tint[0], tint[1], tint[2]);
      spriteGeometry.instanceCount = count; sprites.visible = count > 0;
      if (count) {
        for (let attr of [aSprite, aColor]) {
          if (attr.clearUpdateRanges) { attr.clearUpdateRanges(); attr.addUpdateRange(0, count * 4); }
          attr.needsUpdate = true;
        }
      }
      if (pendingCheck && mode === 'gpu' && bg && bg.tile) {
        pendingCheck = false;
        let stars = bgUniforms.uStars.value, spritesOn = sprites.visible, ok = false;
        bgUniforms.uStars.value = 0; sprites.visible = false;
        try { renderer.render(scene, camera); ok = backgroundMatches(bg); } catch (e) { ok = false; }
        bgUniforms.uStars.value = stars; sprites.visible = spritesOn;
        if (!ok) { setMode('overlay'); return; }
      }
      renderer.render(scene, camera);
    },
    dispose() {
      if (texture) texture.dispose();
      bgGeometry.dispose(); bgMaterial.dispose(); spriteGeometry.dispose(); spriteMaterial.dispose(); renderer.dispose();
    }
  };
  canvas.addEventListener('webglcontextlost', () => { lost = true; if (layer.onLost) layer.onLost(); });
  return layer;
}
