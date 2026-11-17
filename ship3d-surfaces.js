// Geometry shared by hangar hulls and fittings. Model units are unchanged.
export function roundedBox(T, width, height, depth, fraction=.24) {
  const half = [width/2, height/2, depth/2];
  const radius = Math.min(...half)*fraction*2;
  if (radius < .075) return new T.BoxGeometry(width, height, depth);
  // Sample the bevel bands separately from the large, flat panel faces.
  const geometry = new T.BoxGeometry(2, 2, 2, 5, 5, 5);
  const position = geometry.attributes.position, normal = geometry.attributes.normal;
  for (let i=0; i<position.count; i++) {
    const point=[position.getX(i), position.getY(i), position.getZ(i)];
    const core=point.map((value,axis)=>Math.sign(value)*Math.min(Math.abs(value)/.6,1)*(half[axis]-radius));
    const bevel=point.map(value=>Math.sign(value)*Math.max(0,(Math.abs(value)-.6)/.4));
    const length=Math.hypot(...bevel);
    const n=bevel.map(value=>value/length);
    position.setXYZ(i,...core.map((value,axis)=>value+radius*n[axis]));
    normal.setXYZ(i,...n);
  }
  return geometry;
}

export function roundedOutline(T, points, radius) {
  const shape=new T.Shape();
  for(let i=0;i<points.length;i++){
    const [x,y]=points[i],prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];
    const trim=([u,v])=>{
      const length=Math.hypot(u-x,v-y);
      const ratio=length ? Math.min(.27,radius/length):0;
      return [x+(u-x)*ratio,y+(v-y)*ratio];
    };
    const start=trim(prev),end=trim(next);
    if(i===0)shape.moveTo(...start);else shape.lineTo(...start);
    shape.quadraticCurveTo(x,y,...end);
  }
  shape.closePath();
  return shape;
}

function interpolate(stations, index, channel, t) {
  const a=stations[index],b=stations[index+1],gap=b[0]-a[0];
  const current=(b[channel]-a[channel])/gap;
  const slope=(left,right)=>left*right>0 ? (2*left*right)/(left+right) : 0;
  const prev=stations[index-1],next=stations[index+2];
  const m0=prev?slope((a[channel]-prev[channel])/(a[0]-prev[0]),current):current;
  const m1=next?slope(current,(next[channel]-b[channel])/(next[0]-b[0])):current;
  return a[channel]+t*(gap*m0+t*(3*(b[channel]-a[channel])-gap*(2*m0+m1)+t*(2*(a[channel]-b[channel])+gap*(m0+m1))));
}

export function sculptedLoft(T, stations, y, z, power, sides=20) {
  const rings=[stations[0]];
  for(let i=0;i<stations.length-1;i++){
    const x=stations[i][0],gap=stations[i+1][0]-x;
    const steps=Math.max(2,Math.ceil(gap/3));
    for(let n=1;n<=steps;n++){
      const t=n/steps;
      rings.push([x+t*gap,...[1,2,3].map(channel=>interpolate(stations,i,channel,t))]);
    }
  }
  const positions=[],indices=[];
  for(const [x,width,top,bottom] of rings){
    for(let j=0;j<sides;j++){
      const angle=j*2*Math.PI/sides,c=Math.cos(angle),s=Math.sin(angle);
      positions.push(x,y+width*Math.sign(c)*Math.abs(c)**power,z+(s>=0?top:bottom)*Math.sign(s)*Math.abs(s)**power);
    }
  }
  for(let i=0;i<rings.length-1;i++)for(let j=0;j<sides;j++){
    const a=i*sides+j,b=i*sides+(j+1)%sides;
    indices.push(a,b,b+sides,a,b+sides,a+sides);
  }
  // Separate end faces so the rim stays crisp where caps meet the skin.
  for(const end of [0,1]){
    const cap=positions.length/3;
    const source=end?(rings.length-1)*sides:0;
    for(let j=0;j<sides;j++)positions.push(...positions.slice(3*(source+j),3*(source+j+1)));
    for(let j=1;j<sides-1;j++)if(end)indices.push(cap,cap+j,cap+j+1);else indices.push(cap,cap+j+1,cap+j);
  }
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
