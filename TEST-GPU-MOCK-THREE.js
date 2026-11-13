// Test stand-in for the subset of Three.js used by gpu-layer-v0550.js, implemented on raw WebGL2.
// Follows the r187 behaviours checked in its source: RawShaderMaterial gets only #define prefixes,
// custom blending ONE/ONE, instanced attributes with divisor 1, CanvasTexture honouring flipY.
export const FrontSide = 0, BackSide = 1, DoubleSide = 2, DynamicDrawUsage = 35048, CustomBlending = 5, AddEquation = 100, OneFactor = 201, RepeatWrapping = 1000, NoColorSpace = '';
export class Vector2 { constructor(x = 0, y = 0) { this.x = x; this.y = y } set(x, y) { this.x = x; this.y = y; return this } }
export class Vector3 { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z } set(x, y, z) { this.x = x; this.y = y; this.z = z; return this } }
export class BufferAttribute { constructor(array, itemSize) { this.array = array; this.itemSize = itemSize; this.version = 0; this.divisor = 0 } setUsage() { return this } set needsUpdate(v) { if (v) this.version++ } clearUpdateRanges() {} addUpdateRange() {} }
export class InstancedBufferAttribute extends BufferAttribute { constructor(a, s) { super(a, s); this.divisor = 1 } }
export class BufferGeometry { constructor() { this.attributes = {}; this.index = null } setAttribute(n, a) { this.attributes[n] = a; return this } setIndex(i) { this.index = new Uint16Array(i) } dispose() {} }
export class InstancedBufferGeometry extends BufferGeometry { constructor() { super(); this.instanceCount = Infinity } }
export class RawShaderMaterial { constructor(o) { Object.assign(this, { transparent: false, blending: 1 }, o) } dispose() {} }
export class Mesh { constructor(g, m) { this.geometry = g; this.material = m; this.visible = true; this.renderOrder = 0 } }
export class Scene { constructor() { this.children = [] } add(o) { this.children.push(o) } }
export class Camera {}
export class CanvasTexture { constructor(img) { this.image = img; this.flipY = true; this.version = 0; this.anisotropy = 1 } set needsUpdate(v) { if (v) this.version++ } dispose() { this.disposed = true } }
export class WebGLRenderer {
  constructor({ canvas }) {
    this.canvas = canvas; const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false });
    if (!gl) throw Error('no webgl2'); this.gl = gl; this.clear = [0, 0, 0]; this.ratio = 1; this.programs = new Map(); this.buffers = new Map(); this.textures = new Map();
    this.capabilities = { getMaxAnisotropy: () => 1 }; window.__mockThreeRenders = 0;
  }
  setClearColor(hex) { this.clear = [(hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (hex & 255) / 255] }
  setPixelRatio(r) { this.ratio = r }
  setSize(w, h) { this.canvas.width = Math.round(w * this.ratio); this.canvas.height = Math.round(h * this.ratio) }
  dispose() {}
  program(m) {
    let gl = this.gl, p = this.programs.get(m); if (p) return p;
    const prefix = '#define SHADER_TYPE RawShaderMaterial\n#define SHADER_NAME \n';
    const sh = (type, src) => { let s = gl.createShader(type); gl.shaderSource(s, prefix + src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error('shader: ' + gl.getShaderInfoLog(s)); return s };
    p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, m.vertexShader)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, m.fragmentShader)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error('link: ' + gl.getProgramInfoLog(p)); this.programs.set(m, p); return p;
  }
  buffer(attr, target) {
    let gl = this.gl, b = this.buffers.get(attr);
    if (!b) { b = { buf: gl.createBuffer(), version: -1 }; this.buffers.set(attr, b) }
    gl.bindBuffer(target, b.buf); if (b.version !== attr.version) { gl.bufferData(target, attr.array, gl.DYNAMIC_DRAW); b.version = attr.version }
    return b;
  }
  texture(t, unit) {
    let gl = this.gl, e = this.textures.get(t);
    if (!e) { e = { tex: gl.createTexture(), version: -1 }; this.textures.set(t, e) }
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, e.tex);
    if (e.version !== t.version) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, t.flipY); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image); gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); e.version = t.version;
    }
  }
  render(scene) {
    let gl = this.gl; window.__mockThreeRenders++;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height); gl.clearColor(...this.clear, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    for (let mesh of [...scene.children].sort((a, b) => a.renderOrder - b.renderOrder)) {
      if (!mesh.visible) continue; let g = mesh.geometry, m = mesh.material, p = this.program(m); gl.useProgram(p);
      // Like Three.js: materials are front-side unless told otherwise, so back-facing triangles are culled.
      if (m.side === DoubleSide) gl.disable(gl.CULL_FACE); else { gl.enable(gl.CULL_FACE); gl.cullFace(m.side === BackSide ? gl.FRONT : gl.BACK); }
      if (m.blending === CustomBlending) { gl.enable(gl.BLEND); gl.blendEquation(gl.FUNC_ADD); gl.blendFunc(gl.ONE, gl.ONE) } else gl.disable(gl.BLEND);
      let vao = mesh.__vao || (mesh.__vao = gl.createVertexArray()); gl.bindVertexArray(vao);
      for (let [name, attr] of Object.entries(g.attributes)) {
        let loc = gl.getAttribLocation(p, name); if (loc < 0) continue; this.buffer(attr, gl.ARRAY_BUFFER);
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, attr.itemSize, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(loc, attr.divisor);
      }
      let unit = 0;
      for (let [name, u] of Object.entries(m.uniforms || {})) {
        let loc = gl.getUniformLocation(p, name); if (!loc) continue; let v = u.value;
        if (v instanceof Vector2) gl.uniform2f(loc, v.x, v.y); else if (v instanceof Vector3) gl.uniform3f(loc, v.x, v.y, v.z);
        else if (v instanceof CanvasTexture) { this.texture(v, unit); gl.uniform1i(loc, unit++) } else if (typeof v === 'number') gl.uniform1f(loc, v);
      }
      if (g.index) {
        let b = this.buffers.get(g) || { buf: gl.createBuffer() }; this.buffers.set(g, b); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.buf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.index, gl.STATIC_DRAW);
        if (g instanceof InstancedBufferGeometry) gl.drawElementsInstanced(gl.TRIANGLES, g.index.length, gl.UNSIGNED_SHORT, 0, g.instanceCount); else gl.drawElements(gl.TRIANGLES, g.index.length, gl.UNSIGNED_SHORT, 0);
      } else gl.drawArrays(gl.TRIANGLES, 0, g.attributes.position.array.length / 3);
      gl.bindVertexArray(null);
    }
    let err = gl.getError(); if (err) throw Error('gl error ' + err);
  }
}
