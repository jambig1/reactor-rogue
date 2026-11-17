"""Build an editable Wasp hangar model and render inspection views in Blender."""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

out = Path(sys.argv[sys.argv.index("--") + 1])
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)

def material(name, colour, metallic, roughness, glow=0):
    mat=bpy.data.materials.new(name)
    mat.use_nodes=True
    shader=mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value=(*colour,1)
    shader.inputs["Metallic"].default_value=metallic
    shader.inputs["Roughness"].default_value=roughness
    if glow:
        shader.inputs["Emission Color"].default_value=(*colour,1)
        shader.inputs["Emission Strength"].default_value=glow
    return mat

navy=material("Midnight ceramic",(.035,.08,.13),.53,.33)
edge=material("Brushed titanium",(.17,.24,.28),.75,.32)
dark=material("Graphite heat shields",(.018,.023,.033),.65,.41)
glass=material("Smoked teal canopy",(.021,.14,.18),.62,.13)
teal=material("Wasp teal guidance lights",(.035,.9,.64),.1,.28,3)
white=material("Pearl inspection markings",(.7,.84,.84),.28,.42)

def finish(obj,name,mat,bevel=0):
    obj.name=name
    obj.data.materials.append(mat)
    if bevel:
        modifier=obj.modifiers.new("Machined edge radius","BEVEL")
        modifier.width=bevel
        modifier.segments=3
        obj.modifiers.new("Weighted normals","WEIGHTED_NORMAL")
    return obj

def mesh(name,verts,faces,mat,bevel=0):
    data=bpy.data.meshes.new(name)
    data.from_pydata(verts,[],faces)
    data.update()
    obj=bpy.data.objects.new(name,data)
    bpy.context.collection.objects.link(obj)
    return finish(obj,name,mat,bevel)

def hull(name,sections,mat,centre=0,power=.72):
    sides=16
    verts=[]
    for x,wide,top,bottom,z in sections:
        for i in range(sides):
            a=math.tau*i/sides
            c,s=math.cos(a),math.sin(a)
            verts.append((x,centre+wide*math.copysign(abs(c)**power,c),
                          z+math.copysign(abs(s)**power,s)*(top if s>=0 else bottom)))
    faces=[tuple(reversed(range(sides)))]
    for row in range(len(sections)-1):
        for i in range(sides):
            a=row*sides+i
            b=row*sides+(i+1)%sides
            faces.append((a,b,b+sides,a+sides))
    faces.append(tuple(range(len(verts)-sides,len(verts))))
    obj=mesh(name,verts,faces,mat)
    for polygon in obj.data.polygons[1:-1]:
        polygon.use_smooth=True
    return obj

def panel(name,points,thickness,mat):
    if sum(p[0]*q[1]-q[0]*p[1] for p,q in zip(points,points[1:]+points[:1]))<0:
        points=list(reversed(points))
    n=len(points)
    verts=points+[(x,y,z-thickness) for x,y,z in points]
    faces=[tuple(range(n)),tuple(reversed(range(n,2*n)))]
    faces.extend((i,i+n,(i+1)%n+n,(i+1)%n) for i in range(n))
    return mesh(name,verts,faces,mat,.038)

def barrel(name,a,b,r1,r2,mat):
    a,b=Vector(a),Vector(b)
    axis=b-a
    bpy.ops.mesh.primitive_cone_add(vertices=20,radius1=r1,radius2=r2,depth=axis.length,location=(a+b)/2)
    obj=bpy.context.object
    obj.rotation_euler=axis.to_track_quat("Z","Y").to_euler()
    return finish(obj,name,mat,.023)

# Nose +X. The upper spine, engine shoulders and ventral keel read as one volume.
hull("Main interceptor pressure hull",[
    (-3.05,.28,.22,.23,0),(-2.75,.55,.37,.40,0),(-1.75,.73,.55,.45,0),
    (-.3,.68,.65,.40,0),(1.02,.47,.47,.32,0),(2.35,.26,.24,.20,.02),
    (3.28,.025,.038,.035,.015)],navy)
hull("Ventral titanium keel",[
    (-2.55,.19,.12,.09,-.3),(-1.7,.38,.16,.18,-.36),(-.4,.44,.16,.29,-.34),
    (.8,.37,.14,.2,-.30),(2.25,.115,.08,.09,-.14)],edge)
hull("Canopy frame",[
    (-.88,.19,.055,.09,.55),(-.59,.38,.18,.12,.59),(.08,.38,.23,.15,.61),
    (.73,.26,.14,.11,.52),(1.37,.045,.04,.06,.41)],edge)
hull("Raised wraparound canopy",[
    (-.69,.18,.06,.08,.67),(-.44,.30,.22,.12,.71),(.18,.30,.30,.15,.72),
    (.79,.19,.14,.12,.65),(1.17,.031,.03,.05,.51)],glass,power=.95)

for side in [-1,1]:
    y=lambda value:side*value
    hull(f"Drive nacelle {side}",[
        (-2.96,.25,.26,.27,-.09),(-2.54,.42,.39,.39,-.04),
        (-1.5,.43,.40,.43,-.04),(-.55,.31,.32,.32,-.06),(.03,.11,.17,.19,-.06)],
        navy,y(.87))
    panel(f"Swept wing spar {side}",[
        (-2.70,y(.55),.03),(-2.86,y(2.50),.22),(-2.24,y(2.68),.25),
        (-.91,y(1.61),.04),(.25,y(.57),.06)],.19,navy)
    panel(f"Carbon slat {side}",[
        (-2.63,y(.94),.08),(-2.65,y(2.37),.22),(-2.28,y(2.42),.22),
        (-1.32,y(1.48),.08)],.09,dark)
    panel(f"Stabiliser {side}",[
        (-2.64,y(.94),.21),(-2.68,y(1.19),1.03),
        (-2.28,y(1.19),.87),(-1.68,y(.92),.24)],.11,navy)
    barrel(f"Outer nozzle {side}",(-3.30,y(.87),-.09),(-2.75,y(.87),-.09),.29,.24,edge)
    barrel(f"Nozzle throat {side}",(-3.325,y(.87),-.09),(-3.27,y(.87),-.09),.224,.213,dark)
    barrel(f"Reactor emitter {side}",(-3.346,y(.87),-.09),(-3.33,y(.87),-.09),.15,.15,teal)
    barrel(f"Long-range pulse cannon {side}",(-.55,y(1.03),-.04),(1.10,y(1.03),-.04),.11,.063,dark)
    panel(f"Gun pylon {side}",[(-.86,y(.67),.10),(-.72,y(1.16),.08),(-.24,y(1.1),.07),(-.05,y(.59),.1)],.23,edge)
    barrel(f"Wing tracer {side}",(-2.67,y(2.51),.268),(-1.91,y(1.99),.20),.023,.017,teal)
    barrel(f"Belly running light {side}",(-2.18,y(.83),-.454),(-1.48,y(.83),-.467),.023,.023,teal)
    panel(f"Armoured belly access cover {side}",[
        (-1.83,y(.28),-.35),(-1.09,y(.35),-.49),(-.22,y(.29),-.53),
        (.19,y(.09),-.52),(-1.61,y(.10),-.40)],.115,dark)
    for i in range(4):
        x=-1.55+i*.19
        barrel(f"Ventral heat louvre {side}.{i}",(x,y(.20),-.52),(x+.065,y(.32),-.50),.026,.026,edge)
    for i in range(3):
        x=-2.32+i*.26
        barrel(f"Intake rib {side}.{i}",(x,y(.66),.35),(x+.05,y(.96),.35),.031,.031,edge)
    for i in range(2):
        x=-1.98+i*.16
        barrel(f"Squadron marking {side}.{i}",(x,y(1.55),.142),(x-.12,y(1.74),.16),.014,.014,white)

asset_objects=list(bpy.context.scene.objects)
for obj in asset_objects:
    bpy.context.view_layer.objects.active=obj
    obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/"Wasp.glb"),export_format="GLB",use_selection=True,export_apply=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/"Wasp.blend"))
bpy.ops.object.select_all(action="DESELECT")

scene=bpy.context.scene
scene.render.engine="CYCLES"
scene.cycles.samples=16
scene.cycles.use_denoising=True
scene.render.resolution_x=760
scene.render.resolution_y=540
scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new("Dark hangar")
scene.world.use_nodes=True
scene.world.node_tree.nodes["Background"].inputs[0].default_value=(.037,.055,.095,1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value=.45

def aim(obj,target=(0,0,0)):
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()

def area(name,position,energy,colour,size):
    data=bpy.data.lights.new(name,"AREA")
    data.energy=energy
    data.color=colour
    data.shape="DISK"
    data.size=size
    obj=bpy.data.objects.new(name,data)
    scene.collection.objects.link(obj)
    obj.location=position
    aim(obj)

area("Cool hangar key",(1,-4,6),1100,(.72,.87,1),6)
area("Teal rim",(-4,4,3),950,(.20,1,.76),4)
area("Underside inspection fill",(2,-2,-5),780,(.58,.74,1),5)
data=bpy.data.cameras.new("Inspection camera")
data.type="ORTHO"
data.ortho_scale=8.9
camera=bpy.data.objects.new("Inspection camera",data)
scene.collection.objects.link(camera)
scene.camera=camera
for name,location in {"top":(7,-8,10),"belly":(6,-8,-8),"rear":(-9,6,3)}.items():
    camera.location=location
    aim(camera)
    scene.render.filepath=str(out/f"Wasp-{name}.png")
    bpy.ops.render.render(write_still=True)
