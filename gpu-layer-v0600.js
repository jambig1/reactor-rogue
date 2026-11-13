/* Reactor Rogue GPU layers, v0.60 (shader weapon fields on the bottom layer; sector weather on the top).
   createGpuLayer: Three.js canvas beneath the 2D playfield (sector background, parallax stars, lighting,
   glow sprites). createBloomLayer: Three.js canvas above it, composited with plus-lighter, adding
   thresholded bloom from a small copy of the frame, glow sprites, sparks and light pools.
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
uniform vec4 uLight[12];
uniform vec3 uLightCol[12];
uniform float uLightCount;
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
  // Point lights brighten the scenery in proportion to its own colour, plus a faint coloured haze.
  for (int i = 0; i < 12; i++) {
    if (float(i) >= uLightCount) break;
    vec4 L = uLight[i];
    float f = max(0.0, 1.0 - length(vScreen - L.xy) / L.z);
    f *= f;
    col += (col * 1.3 + 0.025) * uLightCol[i] * (L.w * f);
  }
  col += starLayer(vScreen + uCam * 0.55, 96.0, 0.20, 1.3, 0.0) * 0.30 * uStars;
  col += starLayer(vScreen + uCam * 0.82, 150.0, 0.12, 1.9, 17.0) * 0.45 * uStars;
  gl_FragColor = vec4(col, 1.0);
}`;

// Sprite quads flip y into screen space, which reverses their winding: their materials must use
// DoubleSide or Three.js culls every sprite as back-facing (the cause of invisible sprites before v0.59).
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

// Weapon fields (v0.60): gravity wells, void rifts, toxic gas, plasma pools, corona, nets, flame
// trails and storm hazards, drawn on the bottom layer between the scenery and the 2D ships. Output is
// premultiplied (rgb glows, alpha darkens), so a gravity well can have a genuinely black core.
// Kinds: 1 gravity, 2 void, 3 corrosion, 4 plasma, 5 aura, 6 net, 7 fire/wake, 8 storm.
export const FIELD_KINDS = { gravity: 1, void: 2, corrosion: 3, toxic: 3, plasma: 4, aura: 5, net: 6, fire: 7, wake: 7, storm: 8 };
const FIELD_CAP = 64;
export const FIELD_VERTEX = `precision highp float;
attribute vec3 position;
attribute vec4 aField;
attribute vec4 aFieldColor;
uniform vec2 uRes;
varying vec2 vUv;
varying vec4 vCol;
varying float vKind;
void main(){
  vUv = position.xy * 1.3;
  vCol = aFieldColor;
  vKind = aField.w;
  vec2 p = aField.xy + position.xy * aField.z * 1.3;
  vec2 c = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;
export const FIELD_FRAGMENT = `precision highp float;
uniform float uTime;
uniform float uMotion;
varying vec2 vUv;
varying vec4 vCol;
varying float vKind;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float band(float x, float centre, float width){ float d = (x - centre) / width; return exp(-d * d); }
void main(){
  vec2 p = vUv;
  float r = length(p);
  if (r > 1.3) discard;
  float t = uTime * uMotion + vKind * 3.7;
  float ang = atan(p.y, p.x);
  vec3 c = vCol.rgb;
  float fade = vCol.a;
  float inside = 1.0 - smoothstep(0.86, 1.0, r);
  vec3 glow = vec3(0.0);
  float dark = 0.0;
  float k = vKind;
  if (k < 2.5) {
    // Gravity well / void: inward-spiralling arms, accretion ring, black core, lensing rim.
    float sw = ang + 1.7 / (r + 0.22) - t * 1.3;
    float arms = 0.5 + 0.5 * sin(sw * 3.0);
    float flow = fbm(vec2(sw * 1.6, r * 5.0 + t * 2.0));
    float body = inside * smoothstep(0.14, 0.36, r);
    glow += c * (0.12 + 0.75 * arms * flow) * body * (1.0 - r * 0.55);
    float dopp = 0.55 + 0.45 * sin(ang - t * 2.4);
    glow += mix(c, vec3(1.0), 0.6) * band(r, 0.3, 0.04) * dopp * 1.4;
    glow += c * band(r, 0.985, 0.03) * 0.45;
    dark = (1.0 - smoothstep(0.15, 0.27, r)) * 0.95 + inside * 0.28 * (1.0 - smoothstep(0.3, 1.0, r));
  } else if (k < 3.5) {
    // Corrosive gas: two drifting noise layers, murky body with brighter wisps.
    float n = fbm(p * 2.2 + vec2(t * 0.16, -t * 0.11));
    float n2 = fbm(p * 4.2 - vec2(t * 0.22, t * 0.07));
    float soft = 1.0 - smoothstep(0.55, 1.02, r + (n - 0.5) * 0.25);
    float dens = smoothstep(0.32, 0.78, n * 0.7 + n2 * 0.45);
    glow += c * (0.16 + 0.62 * dens) * soft + c * smoothstep(0.62, 0.85, n2) * soft * 0.35;
    dark = dens * soft * 0.3;
  } else if (k < 4.5) {
    // Plasma pool: slow swirl with a bright rim.
    float n = fbm(vec2(ang * 2.0 + t * 0.35, r * 3.2 - t * 0.6));
    glow += c * (0.06 + 0.36 * n) * inside * (0.55 + 0.45 * r) + c * band(r, 0.95, 0.05) * 0.32;
  } else if (k < 5.5) {
    // Corona: a ring of flickering heat at the edge, faint inside.
    float flames = fbm(vec2(ang * 4.0, r * 3.0 - t * 1.6));
    glow += c * band(r, 0.9, 0.11) * (0.35 + 1.0 * flames) * 0.85 + c * 0.05 * inside;
  } else if (k < 6.5) {
    // Net: a pulsing triangular lattice with a bright boundary.
    vec2 q = p * 5.5;
    float l1 = abs(fract(q.x + 0.5) - 0.5), l2 = abs(fract(dot(q, vec2(0.5, 0.866)) + 0.5) - 0.5), l3 = abs(fract(dot(q, vec2(-0.5, 0.866)) + 0.5) - 0.5);
    float lines = 1.0 - smoothstep(0.0, 0.07, min(l1, min(l2, l3)));
    float pulse = 0.5 + 0.5 * sin(r * 10.0 - t * 3.0);
    glow += c * (lines * 0.38 * (0.5 + 0.5 * pulse) * inside + band(r, 0.97, 0.04) * 0.85 + 0.04 * inside);
  } else if (k < 7.5) {
    // Flame: rising, flickering fire with a hot core.
    float n = fbm(p * 3.0 + vec2(0.0, t * 1.4));
    float dens = smoothstep(0.3, 0.8, n) * (1.0 - smoothstep(0.35, 1.0, r));
    glow += mix(c * 1.15, vec3(1.0, 0.88, 0.6), dens * 0.45) * dens * 0.85;
  } else {
    // Storm: crackling filaments.
    float n = fbm(p * 5.0 + vec2(t * 0.9, -t * 0.6));
    float arc = 1.0 - smoothstep(0.0, 0.045, abs(n - 0.5));
    glow += c * (arc * 1.1 + 0.07) * inside + c * band(r, 0.97, 0.04) * 0.5;
  }
  gl_FragColor = vec4(min(vec3(1.0), glow * fade), clamp(dark * fade, 0.0, 1.0));
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

// Upload strategies tried in order until the self-check passes: full-size mipmapped, power-of-two
// resampled (for drivers that mishandle non-power-of-two repeat), then each without mipmaps.
export const TILE_STRATEGIES = ['data', 'pot', 'nomip', 'pot-nomip'];

export async function createGpuLayer(canvas, loadThree = () => import(THREE_URL), options = {}) {
  const selfCheck = options.selfCheck !== false;
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
    uStars: { value: 1 }, uTint: { value: new T.Vector3(0.5, 0.75, 0.75) },
    uLight: { value: Array.from({ length: 12 }, () => new T.Vector4()) }, uLightCol: { value: Array.from({ length: 12 }, () => new T.Vector3()) }, uLightCount: { value: 0 }
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
    transparent: true, depthTest: false, depthWrite: false, side: T.DoubleSide,
    blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneFactor
  });
  const sprites = new T.Mesh(spriteGeometry, spriteMaterial);
  sprites.frustumCulled = false; sprites.renderOrder = 1;
  scene.add(sprites);

  const fieldGeometry = new T.InstancedBufferGeometry();
  fieldGeometry.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
  fieldGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  const fieldData = new Float32Array(FIELD_CAP * 4), fieldColour = new Float32Array(FIELD_CAP * 4);
  const aField = new T.InstancedBufferAttribute(fieldData, 4), aFieldColor = new T.InstancedBufferAttribute(fieldColour, 4);
  aField.setUsage(T.DynamicDrawUsage); aFieldColor.setUsage(T.DynamicDrawUsage);
  fieldGeometry.setAttribute('aField', aField); fieldGeometry.setAttribute('aFieldColor', aFieldColor); fieldGeometry.instanceCount = 0;
  const fieldUniforms = { uRes: bgUniforms.uRes, uTime: { value: 0 }, uMotion: { value: 1 } };
  const fieldMaterial = new T.RawShaderMaterial({
    uniforms: fieldUniforms, vertexShader: FIELD_VERTEX, fragmentShader: FIELD_FRAGMENT,
    transparent: true, depthTest: false, depthWrite: false, side: T.DoubleSide,
    blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneMinusSrcAlphaFactor
  });
  const fields = new T.Mesh(fieldGeometry, fieldMaterial);
  fields.frustumCulled = false; fields.renderOrder = 0.5;
  scene.add(fields);
  let fieldCount = 0;

  let count = 0, tile = null, texture = null, lost = false, width = 1, height = 1, ratio = 1;
  // Background modes: 'gpu' paints the sector tile here; 'overlay' means the 2D canvas paints the
  // background and this canvas sits above it, adding only glow and particles (CSS plus-lighter).
  let mode = 'gpu', pendingCheck = null, diag = [];

  // Raw pixel upload: the most portable path. Uploading the 2D tile canvas directly produced a
  // black texture in Safari/WebKit (all iOS browsers), so the tile is read back once per sector.
  function tileTexture(source, strategy = 'data') {
    let w = source.width, h = source.height, data, mip = !strategy.includes('nomip');
    try {
      let read = source;
      if (strategy.startsWith('pot')) {
        let n = 256; while (n * 2 <= Math.min(w, h)) n *= 2;
        let cv = (source.ownerDocument || document).createElement('canvas'); cv.width = cv.height = n;
        let g = cv.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(source, 0, 0, n, n);
        read = cv; w = h = n;
      }
      data = read.getContext('2d').getImageData(0, 0, w, h).data;
    } catch (e) { diag.push(strategy + ': unreadable (' + (e && e.name || e) + ')'); return null; }
    let tex = new T.DataTexture(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), w, h, T.RGBAFormat, T.UnsignedByteType);
    tex.flipY = false; tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.colorSpace = T.NoColorSpace;
    tex.magFilter = T.LinearFilter; tex.minFilter = mip ? T.LinearMipmapLinearFilter : T.LinearFilter; tex.generateMipmaps = mip;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    tex.needsUpdate = true; tex.userData.pixels = data; tex.userData.w = w; tex.userData.h = h; tex.userData.strategy = strategy;
    return tex;
  }

  // Compare a few rendered background pixels (stars and sprites hidden) with the tile they should
  // show. Any mismatch on a device switches to overlay mode instead of showing a black playfield.
  function backgroundMatches(bg) {
    let px = texture.userData.pixels, tw = texture.userData.w, th = texture.userData.h, good = 0, tested = 0, out = new Uint8Array(4), note = '';
    let bw = gl.drawingBufferWidth, bh = gl.drawingBufferHeight;
    for (let [fx, fy] of [[0.5, 0.5], [0.3, 0.35], [0.7, 0.35], [0.3, 0.7], [0.7, 0.7]]) {
      let sx = fx * width, sy = fy * height;
      let u = ((sx - bg.originX) / bg.span % 1 + 1) % 1, v = ((sy - bg.originY) / bg.span % 1 + 1) % 1;
      let i = (Math.floor(v * th) * tw + Math.floor(u * tw)) * 4;
      let expected = [0, 1, 2].map(c => px[i + c] * (1 - 0.2196) + [4, 10, 20][c] * 0.2196);
      gl.readPixels(Math.floor(fx * bw), Math.floor((1 - fy) * bh), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, out);
      let diff = Math.abs(out[0] - expected[0]) + Math.abs(out[1] - expected[1]) + Math.abs(out[2] - expected[2]);
      tested++; if (diff <= 60) good++;
      if (!note) note = ' got ' + [out[0], out[1], out[2]].join(',') + ' want ' + expected.map(Math.round).join(',');
    }
    diag.push(texture.userData.strategy + ': ' + good + '/' + tested + note);
    return good * 2 > tested;
  }

  function gpuName() {
    try { let ext = gl.getExtension('WEBGL_debug_renderer_info'); return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).slice(0, 60); } catch (e) { return 'GPU unknown'; }
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
    get diagnostics() { return gpuName() + ' · ' + (diag.slice(-6).join(' | ') || 'no checks yet'); },
    forceOverlay() { setMode('overlay'); },
    resize(w, h, r) {
      width = Math.max(1, w); height = Math.max(1, h); ratio = r || 1;
      renderer.setPixelRatio(ratio); renderer.setSize(width, height, false);
      bgUniforms.uRes.value.set(width, height);
    },
    setVisible(on) { canvas.style.display = on ? 'block' : 'none'; },
    begin() { count = 0; fieldCount = 0; },
    // A weapon field in screen-space CSS pixels. Returns false when full or the kind is unknown,
    // so the caller can draw it the classic way instead.
    field(x, y, radius, kind, colour, fade = 1) {
      let k = FIELD_KINDS[kind];
      if (!k || fieldCount >= FIELD_CAP || !(radius > 0)) return false;
      let reach = radius * 1.3;
      if (x < -reach || y < -reach || x > width + reach || y > height + reach) return true;
      let c = parseColour(colour), i = fieldCount * 4;
      fieldData[i] = x; fieldData[i + 1] = y; fieldData[i + 2] = radius; fieldData[i + 3] = k;
      fieldColour[i] = c[0]; fieldColour[i + 1] = c[1]; fieldColour[i + 2] = c[2]; fieldColour[i + 3] = Math.max(0, Math.min(1, fade));
      fieldCount++;
      return true;
    },
    get fieldCount() { return fieldCount; },
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
          tile = bg.tile; diag = []; texture = tileTexture(tile, TILE_STRATEGIES[0]); bgUniforms.uTex.value = texture;
          if (!texture) { setMode('overlay'); return; }
          pendingCheck = selfCheck;
          if (!selfCheck) diag.push(texture.userData.strategy + ': self-check skipped');
        }
        bgUniforms.uHasTex.value = 1; bgUniforms.uOrigin.value.set(bg.originX, bg.originY); bgUniforms.uSpan.value = bg.span;
      } else bgUniforms.uHasTex.value = 0;
      bgUniforms.uCam.value.set(frame.camX || 0, frame.camY || 0);
      bgUniforms.uTime.value = frame.time || 0;
      bgUniforms.uMotion.value = frame.reducedMotion ? 0 : 1;
      bgUniforms.uStars.value = frame.stars ?? 1;
      let lights = frame.lights || [], n = Math.min(12, lights.length);
      for (let i = 0; i < n; i++) { let l = lights[i], c = parseColour(l.c); bgUniforms.uLight.value[i].set(l.x, l.y, l.r, l.i); bgUniforms.uLightCol.value[i].set(c[0], c[1], c[2]); }
      bgUniforms.uLightCount.value = n;
      let tint = parseColour(frame.tint || '#7cbbb9');
      bgUniforms.uTint.value.set(tint[0], tint[1], tint[2]);
      fieldGeometry.instanceCount = fieldCount; fields.visible = fieldCount > 0;
      fieldUniforms.uTime.value = frame.time || 0; fieldUniforms.uMotion.value = frame.reducedMotion ? 0 : 1;
      if (fieldCount) for (let attr of [aField, aFieldColor]) { if (attr.clearUpdateRanges) { attr.clearUpdateRanges(); attr.addUpdateRange(0, fieldCount * 4); } attr.needsUpdate = true; }
      spriteGeometry.instanceCount = count; sprites.visible = count > 0;
      if (count) {
        for (let attr of [aSprite, aColor]) {
          if (attr.clearUpdateRanges) { attr.clearUpdateRanges(); attr.addUpdateRange(0, count * 4); }
          attr.needsUpdate = true;
        }
      }
      if (pendingCheck && mode === 'gpu' && bg && bg.tile) {
        pendingCheck = false;
        let stars = bgUniforms.uStars.value, spritesOn = sprites.visible, fieldsOn = fields.visible, ok = false;
        bgUniforms.uStars.value = 0; sprites.visible = false; fields.visible = false;
        for (let k = 0; k < TILE_STRATEGIES.length && !ok; k++) {
          if (k > 0) {
            if (texture) texture.dispose();
            texture = tileTexture(tile, TILE_STRATEGIES[k]); bgUniforms.uTex.value = texture;
            if (!texture) continue;
          }
          try { renderer.render(scene, camera); ok = backgroundMatches(bg); } catch (e) { diag.push(TILE_STRATEGIES[k] + ': error ' + (e && e.message || e)); ok = false; }
        }
        bgUniforms.uStars.value = stars; sprites.visible = spritesOn; fields.visible = fieldsOn;
        if (!ok) { setMode('overlay'); return; }
      }
      renderer.render(scene, camera);
    },
    dispose() {
      if (texture) texture.dispose();
      bgGeometry.dispose(); bgMaterial.dispose(); spriteGeometry.dispose(); spriteMaterial.dispose(); fieldGeometry.dispose(); fieldMaterial.dispose(); renderer.dispose();
    }
  };
  canvas.addEventListener('webglcontextlost', () => { lost = true; if (layer.onLost) layer.onLost(); });
  return layer;
}

// ---------------------------------------------------------------------------------------------
// Bloom layer. Pipeline per frame, all in CSS-pixel space:
//   capture (small copy of the 2D frame, optional) -> prefilter threshold into A (1/4 size)
//   + glow sprites added into A -> blur A (H, V) -> downsample to C (1/8) -> blur C (H, V)
//   -> screen: A*near + C*wide, then sparks and light pools drawn additively at full resolution.
// Output is premultiplied (alpha = brightest channel) for plus-lighter compositing over the page.

const QUAD_VERTEX = `precision highp float;
attribute vec3 position;
varying vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export const PREFILTER_FRAGMENT = `precision mediump float;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uKnee;
varying vec2 vUv;
void main(){
  // The copy is uploaded straight (not premultiplied), so weight colour by coverage: faint smoke and
  // fading flares on the transparent 2D canvas must not count as fully bright.
  vec4 a = texture2D(uTex, vUv + uTexel * vec2(-0.5, -0.5)), b = texture2D(uTex, vUv + uTexel * vec2(0.5, -0.5));
  vec4 d = texture2D(uTex, vUv + uTexel * vec2(-0.5, 0.5)), e = texture2D(uTex, vUv + uTexel * vec2(0.5, 0.5));
  vec3 c = (a.rgb * a.a + b.rgb * b.a + d.rgb * d.a + e.rgb * e.a) * 0.25;
  float luma = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c * smoothstep(uThreshold, uThreshold + uKnee, luma), 1.0);
}`;

export const BLUR_FRAGMENT = `precision mediump float;
uniform sampler2D uTex;
uniform vec2 uStep;
varying vec2 vUv;
void main(){
  vec3 c = texture2D(uTex, vUv).rgb * 0.227027;
  c += (texture2D(uTex, vUv + uStep * 1.3846153).rgb + texture2D(uTex, vUv - uStep * 1.3846153).rgb) * 0.3162162;
  c += (texture2D(uTex, vUv + uStep * 3.2307692).rgb + texture2D(uTex, vUv - uStep * 3.2307692).rgb) * 0.0702703;
  gl_FragColor = vec4(c, 1.0);
}`;

export const COMPOSITE_FRAGMENT = `precision mediump float;
uniform sampler2D uNear;
uniform sampler2D uWide;
uniform float uNearStrength;
uniform float uWideStrength;
varying vec2 vUv;
void main(){
  vec3 c = min(vec3(1.0), texture2D(uNear, vUv).rgb * uNearStrength + texture2D(uWide, vUv).rgb * uWideStrength);
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`;

// Procedural sector weather, drawn additively on the top layer. Two particle depths per sector, each a grid
// of cells holding at most one particle, scrolled by velocity over time and by the camera for parallax.
// Types: 1 grid motes, 2 belt dust, 3 storm rain, 4 foundry embers, 5 cryo snow, 6 city neon rain.
export const WEATHER_FRAGMENT = `precision highp float;
uniform vec2 uRes;
uniform vec2 uCam;
uniform float uTime;
uniform float uType;
uniform float uAmount;
varying vec2 vUv;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec3 layer(vec2 screen, float par, float cell, vec2 vel, float density, float seed, vec2 size, vec3 a, vec3 b, float sway, float flick){
  vec2 pos = screen + uCam * par - vel * uTime;
  vec2 g = floor(pos / cell);
  vec2 f = pos / cell - g;
  float h = hash(g + seed);
  if (h > density) return vec3(0.0);
  vec2 c = vec2(hash(g + seed + 3.1), hash(g + seed + 7.7)) * 0.5 + 0.25;
  c.x += sin(uTime * (0.7 + h) + h * 6.28) * sway / cell;
  vec2 d = (f - c) * cell;
  vec2 dir = normalize(vel + vec2(0.0, 0.0001));
  vec2 q = vec2(dot(d, vec2(dir.y, -dir.x)), dot(d, dir));
  float r = length(q / size);
  float m = 1.0 - smoothstep(0.35, 1.0, r);
  float tw = 1.0 - flick * 0.55 * (0.5 + 0.5 * sin(uTime * (6.0 + h * 9.0) + h * 30.0));
  return mix(a, b, hash(g + seed + 1.9)) * m * tw;
}
void main(){
  vec2 sc = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
  vec3 c = vec3(0.0);
  if (uType < 1.5) {
    c += layer(sc, 0.95, 92.0, vec2(4.0, -14.0), 0.10, 1.0, vec2(1.5), vec3(0.45, 0.95, 0.9), vec3(0.55, 0.75, 1.0), 6.0, 0.6) * 0.6;
    c += layer(sc, 1.15, 120.0, vec2(-3.0, -20.0), 0.08, 9.0, vec2(2.0), vec3(0.5, 1.0, 0.9), vec3(0.7, 0.6, 1.0), 9.0, 0.6) * 0.55;
  } else if (uType < 2.5) {
    c += layer(sc, 0.9, 70.0, vec2(16.0, 5.0), 0.18, 2.0, vec2(1.3), vec3(0.78, 0.66, 0.52), vec3(0.6, 0.58, 0.55), 4.0, 0.2) * 0.55;
    c += layer(sc, 1.2, 96.0, vec2(26.0, 8.0), 0.12, 11.0, vec2(2.0), vec3(0.85, 0.72, 0.55), vec3(0.7, 0.66, 0.6), 6.0, 0.2) * 0.5;
  } else if (uType < 3.5) {
    c += layer(sc, 1.0, 64.0, vec2(-110.0, 720.0), 0.45, 3.0, vec2(0.8, 12.0), vec3(0.62, 0.62, 1.0), vec3(0.8, 0.75, 1.0), 0.0, 0.0) * 0.55;
    c += layer(sc, 1.3, 88.0, vec2(-140.0, 900.0), 0.32, 13.0, vec2(1.0, 16.0), vec3(0.7, 0.7, 1.0), vec3(0.85, 0.8, 1.0), 0.0, 0.0) * 0.5;
  } else if (uType < 4.5) {
    c += layer(sc, 1.0, 88.0, vec2(8.0, -42.0), 0.18, 4.0, vec2(2.0), vec3(1.0, 0.5, 0.15), vec3(1.0, 0.78, 0.35), 9.0, 1.0) * 1.9;
    c += layer(sc, 1.25, 120.0, vec2(-6.0, -60.0), 0.12, 14.0, vec2(2.6), vec3(1.0, 0.42, 0.12), vec3(1.0, 0.65, 0.25), 12.0, 1.0) * 1.6;
  } else if (uType < 5.5) {
    c += layer(sc, 0.9, 68.0, vec2(14.0, 42.0), 0.32, 5.0, vec2(2.2), vec3(0.85, 0.95, 1.0), vec3(0.75, 0.88, 1.0), 10.0, 0.1) * 0.9;
    c += layer(sc, 1.3, 96.0, vec2(22.0, 70.0), 0.22, 15.0, vec2(3.2), vec3(0.9, 0.97, 1.0), vec3(0.8, 0.92, 1.0), 14.0, 0.1) * 0.8;
  } else {
    c += layer(sc, 1.0, 72.0, vec2(-55.0, 780.0), 0.4, 6.0, vec2(0.75, 13.0), vec3(1.0, 0.45, 0.85), vec3(0.4, 0.9, 1.0), 0.0, 0.0) * 0.6;
    c += layer(sc, 1.3, 96.0, vec2(-70.0, 950.0), 0.26, 16.0, vec2(0.95, 18.0), vec3(1.0, 0.5, 0.9), vec3(0.45, 0.95, 1.0), 0.0, 0.0) * 0.5;
  }
  c = min(vec3(1.0), c * uAmount);
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`;

function spriteBatch(T, uniforms) {
  const geometry = new T.InstancedBufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  const sprite = new Float32Array(SPRITE_CAP * 4), colour = new Float32Array(SPRITE_CAP * 4);
  const aSprite = new T.InstancedBufferAttribute(sprite, 4), aColor = new T.InstancedBufferAttribute(colour, 4);
  aSprite.setUsage(T.DynamicDrawUsage); aColor.setUsage(T.DynamicDrawUsage);
  geometry.setAttribute('aSprite', aSprite); geometry.setAttribute('aColor', aColor); geometry.instanceCount = 0;
  const material = new T.RawShaderMaterial({ uniforms, vertexShader: SPRITE_VERTEX, fragmentShader: SPRITE_FRAGMENT, transparent: true, depthTest: false, depthWrite: false, side: T.DoubleSide,
    blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneFactor });
  const mesh = new T.Mesh(geometry, material); mesh.frustumCulled = false;
  let count = 0, width = 1, height = 1;
  return {
    mesh,
    size(w, h) { width = w; height = h; },
    clear() { count = 0; },
    get count() { return count; },
    add(x, y, radius, tint, alpha = 1, hard = 0) {
      if (count >= SPRITE_CAP || !(radius > 0) || !(alpha > 0.002)) return;
      if (x < -radius || y < -radius || x > width + radius || y > height + radius) return;
      let c = parseColour(tint), i = count * 4;
      sprite[i] = x; sprite[i + 1] = y; sprite[i + 2] = radius; sprite[i + 3] = hard;
      colour[i] = c[0]; colour[i + 1] = c[1]; colour[i + 2] = c[2]; colour[i + 3] = c[3] * Math.min(1, alpha);
      count++;
    },
    commit() {
      geometry.instanceCount = count; mesh.visible = count > 0;
      if (count) for (let attr of [aSprite, aColor]) { if (attr.clearUpdateRanges) { attr.clearUpdateRanges(); attr.addUpdateRange(0, count * 4); } attr.needsUpdate = true; }
    },
    dispose() { geometry.dispose(); material.dispose(); }
  };
}

export async function createBloomLayer(canvas, loadThree = () => import(THREE_URL)) {
  if (!canvas) return null;
  const T = await loadThree();
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  const camera = new T.Camera(), res = { value: new T.Vector2(1, 1) };
  const quadGeometry = new T.BufferGeometry();
  quadGeometry.setAttribute('position', new T.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const raw = (fragmentShader, uniforms, additive) => new T.RawShaderMaterial({ uniforms, vertexShader: QUAD_VERTEX, fragmentShader, depthTest: false, depthWrite: false,
    transparent: !!additive, blending: additive ? T.CustomBlending : T.NoBlending, blendEquation: T.AddEquation, blendSrc: T.OneFactor, blendDst: T.OneFactor });
  const prefilter = raw(PREFILTER_FRAGMENT, { uTex: { value: null }, uTexel: { value: new T.Vector2() }, uThreshold: { value: 0.5 }, uKnee: { value: 0.3 } });
  const blur = raw(BLUR_FRAGMENT, { uTex: { value: null }, uStep: { value: new T.Vector2() } });
  const copy = raw(BLUR_FRAGMENT, { uTex: { value: null }, uStep: { value: new T.Vector2() } });
  const composite = raw(COMPOSITE_FRAGMENT, { uNear: { value: null }, uWide: { value: null }, uNearStrength: { value: 1 }, uWideStrength: { value: 1 } }, true);
  const weather = raw(WEATHER_FRAGMENT, { uRes: res, uCam: { value: new T.Vector2() }, uTime: { value: 0 }, uType: { value: 0 }, uAmount: { value: 1 } }, true);
  const quad = new T.Mesh(quadGeometry, prefilter); quad.frustumCulled = false;
  const quadScene = new T.Scene(); quadScene.add(quad);
  const glow = spriteBatch(T, { uRes: res }), screen = spriteBatch(T, { uRes: res });
  const glowScene = new T.Scene(); glowScene.add(glow.mesh);
  const screenScene = new T.Scene(); screenScene.add(screen.mesh);
  const target = (w, h) => new T.WebGLRenderTarget(w, h, { depthBuffer: false, stencilBuffer: false, type: T.UnsignedByteType, magFilter: T.LinearFilter, minFilter: T.LinearFilter, generateMipmaps: false });
  let A = target(1, 1), B = target(1, 1), C = target(1, 1), D = target(1, 1);
  let width = 1, height = 1, lost = false, captureTexture = null, captureSource = null;

  function run(material, out, clear = true) {
    quad.material = material; renderer.setRenderTarget(out);
    if (clear) renderer.clear(true, false, false);
    renderer.render(quadScene, camera);
  }

  const layer = {
    onLost: null,
    get lost() { return lost; },
    resize(w, h, ratio) {
      width = Math.max(1, w); height = Math.max(1, h); res.value.set(width, height);
      renderer.setPixelRatio(ratio || 1); renderer.setSize(width, height, false);
      let qw = Math.max(1, Math.ceil(width / 4)), qh = Math.max(1, Math.ceil(height / 4)), ew = Math.max(1, Math.ceil(width / 8)), eh = Math.max(1, Math.ceil(height / 8));
      A.setSize(qw, qh); B.setSize(qw, qh); C.setSize(ew, eh); D.setSize(ew, eh);
      glow.size(width, height); screen.size(width, height);
    },
    setVisible(on) { canvas.style.display = on ? 'block' : 'none'; },
    begin() { glow.clear(); screen.clear(); },
    // Blurred into the bloom (halos). Screen-space CSS pixels.
    glow(x, y, r, c, a = 1, hard = 0) { glow.add(x, y, r, c, a, hard); },
    // Drawn sharp at full resolution on top (sparks, light pools).
    screen(x, y, r, c, a = 1, hard = 0) { screen.add(x, y, r, c, a, hard); },
    get spriteCount() { return glow.count + screen.count; },
    // frame: {bloom: bool (default true), capture: canvas|null, threshold, near, wide,
    //         weather: {type 1-6, amount, camX, camY, time} | null}
    render(frame) {
      if (lost) return;
      glow.commit(); screen.commit();
      const drawWeather = () => {
        let w = frame.weather;
        if (!w || !(w.type > 0) || !(w.amount > 0)) return;
        weather.uniforms.uType.value = w.type; weather.uniforms.uAmount.value = w.amount; weather.uniforms.uTime.value = w.time || 0;
        weather.uniforms.uCam.value.set(w.camX || 0, w.camY || 0);
        quad.material = weather; renderer.render(quadScene, camera);
      };
      if (frame.bloom === false) {
        renderer.setRenderTarget(null); renderer.clear(true, false, false);
        drawWeather();
        if (screen.count) renderer.render(screenScene, camera);
        return;
      }
      let src = frame.capture || null;
      // Prefilter the captured frame into A, or start A empty.
      if (src) {
        if (src !== captureSource) { if (captureTexture) captureTexture.dispose(); captureSource = src; captureTexture = new T.CanvasTexture(src); captureTexture.colorSpace = T.NoColorSpace; captureTexture.generateMipmaps = false; captureTexture.minFilter = captureTexture.magFilter = T.LinearFilter; }
        captureTexture.needsUpdate = true;
        prefilter.uniforms.uTex.value = captureTexture; prefilter.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
        prefilter.uniforms.uThreshold.value = frame.threshold ?? 0.5; prefilter.uniforms.uKnee.value = 0.3;
        run(prefilter, A);
      } else { renderer.setRenderTarget(A); renderer.clear(true, false, false); }
      if (glow.count) { renderer.setRenderTarget(A); renderer.render(glowScene, camera); }
      // Two blur levels.
      blur.uniforms.uTex.value = A.texture; blur.uniforms.uStep.value.set(1 / A.width, 0); run(blur, B);
      blur.uniforms.uTex.value = B.texture; blur.uniforms.uStep.value.set(0, 1 / A.height); run(blur, A);
      copy.uniforms.uTex.value = A.texture; copy.uniforms.uStep.value.set(0.5 / A.width, 0.5 / A.height); run(copy, C);
      blur.uniforms.uTex.value = C.texture; blur.uniforms.uStep.value.set(1 / C.width, 0); run(blur, D);
      blur.uniforms.uTex.value = D.texture; blur.uniforms.uStep.value.set(0, 1 / C.height); run(blur, C);
      // Screen.
      renderer.setRenderTarget(null); renderer.clear(true, false, false);
      composite.uniforms.uNear.value = A.texture; composite.uniforms.uWide.value = C.texture;
      composite.uniforms.uNearStrength.value = frame.near ?? 1; composite.uniforms.uWideStrength.value = frame.wide ?? 1;
      quad.material = composite; renderer.render(quadScene, camera);
      drawWeather();
      if (screen.count) renderer.render(screenScene, camera);
    },
    dispose() {
      for (let t of [A, B, C, D]) t.dispose();
      if (captureTexture) captureTexture.dispose();
      for (let m of [prefilter, blur, copy, composite, weather]) m.dispose();
      quadGeometry.dispose(); glow.dispose(); screen.dispose(); renderer.dispose();
    }
  };
  canvas.addEventListener('webglcontextlost', () => { lost = true; if (layer.onLost) layer.onLost(); });
  return layer;
}
