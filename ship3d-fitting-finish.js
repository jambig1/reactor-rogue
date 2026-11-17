// Detail the existing hull-specific fittings in place, keeping their seating,
// silhouette and exhaust metadata. The strike faces here use the hangar axes.
export function finishFitting(T, fitting, id, trim) {
  const {root, nozzles} = fitting;
  const alloy = new T.MeshStandardMaterial({color: '#718495', metalness: .72, roughness: .34});
  const charcoal = new T.MeshStandardMaterial({color: '#182532', metalness: .55, roughness: .47});
  const signal = new T.MeshBasicMaterial({color: new T.Color(trim || '#65fbd2').multiplyScalar(1.7), toneMapped: false});
  const added = [];
  const up = new T.Vector3(0, 1, 0);
  function add(geometry, material, x, y, z) {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    root.add(mesh);
    added.push(mesh);
    return mesh;
  }
  function rail(a, b, width, material) {
    const start = new T.Vector3(...a), end = new T.Vector3(...b);
    const delta = end.clone().sub(start);
    const mesh = add(new T.CylinderGeometry(width,width,delta.length(),6), material, ...start.lerp(end,.5));
    mesh.quaternion.setFromUnitVectors(up,delta.normalize());
  }
  function ring(x,y,z,r,width,material,alongNose=true) {
    const mesh = add(new T.TorusGeometry(r,width,6,18),material,x,y,z);
    if (alongNose) mesh.rotation.y = Math.PI/2;
  }

  root.updateMatrixWorld(true);
  const group = root.children.filter(mesh => mesh.isMesh && !mesh.material.isMeshBasicMaterial);
  const blocks = group.map(mesh => ({mesh, bounds:new T.Box3().setFromObject(mesh)}));
  const bounds = new T.Box3().setFromObject(root);
  const ray = new T.Raycaster();
  function surface(x,y,fromAbove) {
    root.updateMatrixWorld(true);
    ray.set(new T.Vector3(x,y,fromAbove ? 80 : -80),new T.Vector3(0,0,fromAbove ? -1 : 1));
    const hit = ray.intersectObjects(group)[0];
    return hit ? hit.point.z : null;
  }
  function runner(x,y,dx,dy,width,material,above=true) {
    const a = surface(x,y,above), b = surface(x+dx,y+dy,above);
    // Keep the detail seated, even on split fins and open attachment frames.
    if (a === null || b === null || Math.abs(a-b) > 1.2 || surface(x+dx/2,y+dy/2,above) === null) return;
    const lift = width*(above?.38:-.38);
    rail([x,y,a+lift],[x+dx,y+dy,b+lift],width,material);
  }
  if (id.startsWith('e_')) {
    const slot = {e_twin:4, e_ion:6, e_fusion:5, e_nova:8}[id];
    for (const {x,y,z,r} of nozzles) {
      ring(x+.28,y,z,r*1.03,.15,charcoal);
      if (id === 'e_fusion' || id === 'e_nova') ring(x-.02,y,z,r*.74,.10,signal);
      for (let j=0; j<slot; j++) {
        const a = j*Math.PI*2/slot, yy = y+Math.cos(a)*r*.88, zz = z+Math.sin(a)*r*.88;
        rail([x+.19,yy,zz],[x+.29,y+(yy-y)*.72,z+(zz-z)*.72],.09,alloy);
      }
      for (let j=0; j<3; j++) {
        runner(x+1+j*.84,y-.34,.38,.68,.1,id==='e_ion' ? signal : alloy);
        runner(x+1+j*.84,y-.34,.38,.68,.1,charcoal,false);
      }
    }
  } else if (id.startsWith('w_')) {
    for (const side of [-1,1]) {
      const spread = side<0 ? -bounds.min.y : bounds.max.y;
      const min = bounds.min.x, span = bounds.max.x-min;
      const rows = {w_razor:3, w_vane:5, w_prism:4, w_phantom:6}[id];
      for (let j=0; j<rows; j++) {
        const y = side*spread*(.55+j*.067);
        for (let k=1; k<7; k++) {
          const x = min+k*span/8;
          runner(x,y,span*.086,side*.55,.1,j%3===0 ? signal : alloy);
          runner(x,y,span*.075,side*.38,.11,id==='w_prism' ? signal : charcoal,false);
        }
      }
    }
  } else if (id.startsWith('m_')) {
    const barrelCandidates = blocks.filter(({bounds:b})=> {
      const dims = b.getSize(new T.Vector3());
      return dims.x>=6 && dims.y<3.25 && b.max.x>bounds.max.x-2.5;
    });
    for (const {bounds:b} of barrelCandidates) {
      const ctr=b.getCenter(new T.Vector3()), dims=b.getSize(new T.Vector3());
      const r=Math.min(dims.y,dims.z)*.5;
      if (r<.2) continue;
      ring(b.max.x-.35,ctr.y,ctr.z,r,.11,charcoal);
      for (let i=0;i<(id==='m_siege'?3:2);i++) {
        ring(b.min.x+dims.x*(.21+i*.135),ctr.y,ctr.z,r,.12,i===0 ? signal : alloy);
      }
    }
  } else {
    for (const {bounds:b} of blocks) {
      const dims=b.getSize(new T.Vector3()), ctr=b.getCenter(new T.Vector3());
      if (dims.x<4 || dims.y<2.5 || dims.z<.2) continue;
      for (let i=0;i<3;i++) {
        const x=ctr.x+dims.x*(i-1)*.19;
        runner(x,ctr.y-dims.y*.29,.4,dims.y*.13,.11,id==='p_reactive'?signal:alloy);
        runner(x,ctr.y+dims.y*.14,.4,dims.y*.13,.11,id==='p_aegis'?signal:charcoal);
        runner(x,ctr.y-.32,.55,.64,.12,charcoal,false);
      }
    }
  }
  // Bake the in-place detail into at most one draw per material.
  const baked = [];
  for (const material of [alloy,charcoal,signal]) {
    const positions = [], normals = [];
    for (const mesh of added.filter(mesh => mesh.material === material)) {
      mesh.updateMatrix();
      const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      geometry.applyMatrix4(mesh.matrix);
      for (const value of geometry.attributes.position.array) positions.push(value);
      for (const value of geometry.attributes.normal.array) normals.push(value);
      geometry.dispose();
      mesh.geometry.dispose();
      mesh.removeFromParent();
    }
    if (!positions.length) continue;
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));
    root.add(new T.Mesh(geometry,material));
    baked.push(geometry);
  }
  const dispose = fitting.dispose.bind(fitting);
  return {...fitting, dispose() {
    dispose();
    for (const resource of [...baked,alloy,charcoal,signal]) resource.dispose();
  }};
}

