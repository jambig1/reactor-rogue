"""Author and render the Reactor Rogue flight deck for the ship viewer."""
import math
import random
import sys
from pathlib import Path

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector


output = Path(sys.argv[sys.argv.index("--") + 1]).resolve()
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
rng = random.Random(702)


def material(name, color, rough=.43, metal=.55, emission=0, wear=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    graph = mat.node_tree
    shader = graph.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = rough
    shader.inputs["Metallic"].default_value = metal
    if emission:
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = emission
    if wear:
        grain = graph.nodes.new("ShaderNodeTexNoise")
        grain.inputs["Scale"].default_value = 36
        grain.inputs["Roughness"].default_value = .7
        ramp = graph.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = (*(c*.77 for c in color), 1)
        ramp.color_ramp.elements[1].color = (*(c*1.28 for c in color), 1)
        bump = graph.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = wear
        bump.inputs["Distance"].default_value = .07
        graph.links.new(grain.outputs["Fac"], ramp.inputs["Fac"])
        graph.links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
        graph.links.new(grain.outputs["Fac"], bump.inputs["Height"])
        graph.links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return mat


navy = material("Ablative slate panels", (.042,.063,.107), wear=.21)
deck = material("Brushed deck plates", (.048,.062,.081), .37,.62,wear=.15)
reinforcement = material("Powder coated gantry", (.066,.094,.136), .38,.64,wear=.18)
graphite = material("Graphite pressure frame", (.022,.028,.043), .53,.43,wear=.2)
alloy = material("Edge chamfers and latches", (.123,.154,.187),.32,.67)
stripe = material("Worn cold paint", (.19,.28,.32),.51,.27,wear=.28)
amber = material("Hazard paint", (.36,.174,.049), .5,.33,wear=.24)
cyan = material("Recessed approach lights", (.088,.64,1), emission=2.2)
violet = material("Service doors in standby", (.36,.19,1), emission=1.15)
white = material("Inspection lighting", (.52,.82,1), emission=2.85)
landing = material("Flush landing plate", (.029,.044,.063), .44,.62,wear=.19)


def finish(obj,name,mat,edge):
    obj.name = name
    obj.data.materials.append(mat)
    if edge:
        bevel = obj.modifiers.new("Machined bevel", "BEVEL")
        bevel.width = edge
        bevel.segments = 2
        bevel.harden_normals = True
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def block(name, pos, size, mat, edge=.07, yaw=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    obj=bpy.context.object
    for vertex in obj.data.vertices:
        for axis in range(3):
            vertex.co[axis] *= size[axis]
    obj.rotation_euler.z=yaw
    return finish(obj,name,mat,edge)


def beam(name, a, b, width, depth, mat, edge=.06):
    a,b=Vector(a),Vector(b)
    obj=block(name,(a+b)/2,(width,depth,(b-a).length),mat,edge)
    obj.rotation_euler=(b-a).to_track_quat("Z","Y").to_euler()
    return obj


def tube(name, a, b, r, mat, vertices=16):
    a,b=Vector(a),Vector(b)
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=(b-a).length,location=(a+b)/2)
    obj=bpy.context.object
    obj.rotation_euler=(b-a).to_track_quat("Z","Y").to_euler()
    return finish(obj,name,mat,.028)


def lamp(name,pos,target,power,color,size):
    data=bpy.data.lights.new(name,"AREA")
    data.energy, data.color, data.shape, data.size = power,color,"DISK",size
    obj=bpy.data.objects.new(name,data)
    bpy.context.collection.objects.link(obj)
    obj.location=pos
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()


# A recessed launch pad and low-glare floor markings, with a clear centre
# where the game's separately rendered ship and service drones appear.
pad_y=-6.4
block("Deck substructure",(0,0,-.50),(54,50,.8),graphite)
for x in range(-24,25,4):
    for y in range(-22,18,4):
        if abs(x)<10 and abs(y-pad_y)<9:
            continue
        block("Replaceable deck tile",(x,y,-.135),(3.96,3.96,.24),deck if (x+y)%12 else navy,.035)
block("Central deck inset",(0,pad_y,-.15),(19.9,16.2,.28),deck)
tube("Octagonal landing deck",(0,pad_y,-.11),(0,pad_y,.035),7.05,landing,8)
for i in range(8):
    a,b=math.tau*i/8,math.tau*(i+1)/8
    p=Vector((6.65*math.cos(a),pad_y+6.65*math.sin(a),.044))
    q=Vector((6.65*math.cos(b),pad_y+6.65*math.sin(b),.044))
    beam("Landing plate edge stencil",p.lerp(q,.08),p.lerp(q,.92),.16,.022,stripe,.006)
    beam("Inset landing marker",p.lerp(q,.39),p.lerp(q,.61),.076,.024,cyan,.008)
for side in (-1,1):
    for y in (-17,-13,-9,-5,-1,3,7,11):
        block("Guide channel",(side*9.35,y,.025),(.68,3.5,.065),graphite)
        block("Guide channel inlay",(side*9.35,y+.22,.067),(.11,2.6,.026),cyan,.01)
        for j in range(3):
            block("Boundary safety paint",(side*(10.08+j*.33),y+1.28,.014),(.22,1.05,.012),amber,.005,yaw=side*.37)

# Repeated hull ribs and outer maintenance corridors establish depth. Keep
# work lights and equipment outside the ship's swept viewing area.
for side in (-1,1):
    block("Side pressure shell",(side*16,0,6.45),(1.1,39,13),navy)
    block("Raised service raceway",(side*13.7,-.4,.66),(3.1,34,1.35),graphite)
    block("Perforated service deck",(side*13.7,-.4,1.35),(3.13,34,.16),reinforcement)
    for y in (-14,-7,0,7,14):
        beam("Main loading rib",(side*13.55,y,.6),(side*14.1,y,8.7),1.15,1.18,reinforcement,.13)
        beam("Sloped shoulder rib",(side*14.1,y,8.65),(side*10.8,y,12),1.14,1.18,reinforcement,.13)
        beam("Shoulder light pocket",(side*13.45,y-.63,8.3),(side*10.8,y-.63,10.95),.31,.08,graphite,.05)
        beam("Shoulder light",(side*13.4,y-.7,8.4),(side*11.18,y-.7,10.62),.13,.045,cyan,.025)
        block("Replaceable lower impact panel",(side*15.35,y,3.5),(.34,5.4,3.25),navy,.09)
        block("Horizontal wall recess",(side*15.04,y,3.7),(.38,4.2,1),graphite,.08)
        for q in range(4):
            block("Intake grille",(side*14.83,y+(q-1.5)*.67,3.72),(.24,.20,.72),alloy,.024)
        block("Standby relay",(side*13.09,y,2.08),(1.32,2.9,1.28),navy,.13)
        block("Relay light visor",(side*12.35,y-.62,2.28),(.06,.65,.08),violet,.022)
        beam("Deck barrier",(side*12.12,y-2.9,1.58),(side*12.12,y-.65,1.58),.12,.16,alloy)
    for offset in (0,.38,.76):
        tube("Bundled station coolant",(side*14.74,-17,5.0+offset),(side*14.74,15,5.0+offset),.095,alloy)
    for y in (-10,5):
        lamp("Indirect corridor violet",(side*13.2,y,5),(side*15.2,y,2.6),370,(.24,.20,1),3)

# Open bay aperture. A shadowed frame and visible shutter tracks break up
# the viewport while leaving the planet visible above the ship.
for side in (-1,1):
    beam("Bay door upright",(side*12.4,14.8,.4),(side*12.4,14.8,8.1),2.0,1.9,graphite,.18)
    beam("Angled aperture lintel",(side*12.4,14.8,8.1),(side*9.25,14.8,11.05),2.0,1.9,reinforcement,.18)
    beam("Door guide slot",(side*11.3,14.17,.55),(side*11.3,14.17,7.17),.19,.10,cyan,.02)
    for z in (1.5,3.3,5.1,6.9):
        block("Shutter latch",(side*11.65,14.1,z),(.85,.55,.36),alloy)
beam("Upper aperture header",(-10,14.8,11.12),(10,14.8,11.12),1.4,1.9,graphite,.16)
beam("Blast sill",(-12.5,15,.14),(12.5,15,.14),1.6,.55,reinforcement,.11)
for x in (-9,-6,-3,3,6,9):
    block("Low-intensity threshold lamp",(x,14.03,.42),(1.1,.17,.12),cyan,.026)

for y in (-14,-6,2,10):
    beam("Overhead transverse truss",(-13,y,12.1),(13,y,12.1),.64,1,graphite,.09)
    for x in (-9,9):
        block("Overhead key fixture",(x,y-.4,11.56),(3.4,.61,.42),graphite)
        block("Inspection fixture diffuser",(x,y-.4,11.30),(2.34,.29,.08),white,.02)
        lamp("Bounced deck inspection key",(x,y,11.15),(x*.62,y-2,0),620,(.60,.79,1),4.7)
lamp("Cool aperture key",(-2,15,8),(0,-4,0),2400,(.27,.60,1),9)
lamp("Soft front reflection",(2,-18,7),(0,-4,1),1000,(.49,.65,.92),7)

# A distant planet with a procedural surface and viewing-angle atmosphere.
planet=material("Blue planet with thin atmosphere",(.019,.084,.21),.59,0)
graph=planet.node_tree
shader=graph.nodes.get("Principled BSDF")
cloud=graph.nodes.new("ShaderNodeTexNoise")
cloud.inputs["Scale"].default_value=5.7
cloud.inputs["Detail"].default_value=6
cloud.inputs["Roughness"].default_value=.71
ocean=graph.nodes.new("ShaderNodeValToRGB")
ocean.color_ramp.elements[0].position=.20
ocean.color_ramp.elements[0].color=(.007,.021,.064,1)
ocean.color_ramp.elements[1].position=.82
ocean.color_ramp.elements[1].color=(.19,.39,.57,1)
ocean.color_ramp.elements.new(.59).color=(.029,.145,.31,1)
limb=graph.nodes.new("ShaderNodeLayerWeight")
atmosphere=graph.nodes.new("ShaderNodeValToRGB")
atmosphere.color_ramp.elements[0].position=.05
atmosphere.color_ramp.elements[0].color=(.015,.06,.21,1)
atmosphere.color_ramp.elements[1].position=.94
atmosphere.color_ramp.elements[1].color=(.085,.47,1,1)
light_trace=graph.nodes.new("ShaderNodeMixRGB")
light_trace.blend_type="ADD"
light_trace.inputs[0].default_value=.35
graph.links.new(cloud.outputs["Fac"],ocean.inputs["Fac"])
graph.links.new(limb.outputs["Facing"],atmosphere.inputs["Fac"])
graph.links.new(ocean.outputs["Color"],light_trace.inputs[1])
graph.links.new(atmosphere.outputs["Color"],light_trace.inputs[2])
graph.links.new(ocean.outputs["Color"],shader.inputs["Base Color"])
graph.links.new(light_trace.outputs["Color"],shader.inputs["Emission Color"])
shader.inputs["Emission Strength"].default_value=.36
bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=32,radius=18,location=(12,76,-15.7))
planet_obj=finish(bpy.context.object,"Planet below the station",planet,0)
for face in planet_obj.data.polygons:
    face.use_smooth=True

stars=material("Distant stars",(.39,.58,.96),emission=2.1)
verts=[]
faces=[]
for _ in range(152):
    x,z=rng.uniform(-82,83),rng.uniform(-30,53)
    r=rng.uniform(.035,.105)
    index=len(verts)
    verts.extend([(x-r,105,z),(x,105,z-r),(x+r,105,z),(x,105,z+r)])
    faces.append((index,index+1,index+2,index+3))
mesh=bpy.data.meshes.new("Star field")
mesh.from_pydata(verts,[],faces)
field=bpy.data.objects.new("Star field",mesh)
bpy.context.collection.objects.link(field)
mesh.materials.append(stars)

world=bpy.data.worlds.new("Deep blue space")
scene.world=world
world.use_nodes=True
world.node_tree.nodes.get("Background").inputs[0].default_value=(.008,.013,.036,1)
world.node_tree.nodes.get("Background").inputs[1].default_value=.28
scene.view_settings.view_transform="AgX"
scene.render.engine="CYCLES"
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.resolution_x=1200
scene.render.resolution_y=800
scene.render.resolution_percentage=100

bpy.ops.object.camera_add(location=(0,-25.6,8.1))
camera=bpy.context.object
scene.camera=camera
camera.data.lens=30
camera.data.clip_end=180
target=Vector((0,4.8,4.85))
camera.rotation_euler=(target-camera.location).to_track_quat("-Z","Y").to_euler()
bpy.context.view_layer.update()
pad=world_to_camera_view(scene,camera,Vector((0,pad_y,0)))
camera.data.shift_y=(pad.y-.20)*scene.render.resolution_y/scene.render.resolution_x

scene.use_nodes=True
tree=scene.node_tree
tree.nodes.clear()
source=tree.nodes.new("CompositorNodeRLayers")
glare=tree.nodes.new("CompositorNodeGlare")
glare.glare_type="FOG_GLOW"
glare.threshold=1.35
glare.size=7
composite=tree.nodes.new("CompositorNodeComposite")
tree.links.new(source.outputs["Image"],glare.inputs["Image"])
tree.links.new(glare.outputs["Image"],composite.inputs["Image"])
scene.render.image_settings.file_format="PNG"
scene.render.filepath=str(output/"Hangar.png")
bpy.ops.wm.save_as_mainfile(filepath=str(output/"Reactor-Rogue-Hangar.blend"))
bpy.ops.render.render(write_still=True)

