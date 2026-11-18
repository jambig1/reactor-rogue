"""Model the little hangar repair bot. Blender axes: +X front (eye), +Z up.
Run (Blender's Python module): python art/blender/author-bots.py -- art/blender
Exports repair-bot.glb. The game moves BotArm / BotTorch itself (they reach to the hull), so they are
separate objects whose origin is the joint at their top and which point straight down (-Z)."""
import math
import sys
from pathlib import Path

import bpy

DEST = Path(sys.argv[sys.argv.index("--") + 1])
DEST.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, colour, metallic=.5, rough=.35, glow=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*colour, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = rough
    if glow:
        shader.inputs["Emission Color"].default_value = (*colour, 1)
        shader.inputs["Emission Strength"].default_value = glow
    return mat


SHELL = material("Bot enamel shell", (.42, .48, .55), .5, .3)
VISOR = material("Bot smoked visor", (.015, .03, .05), .3, .06)
DARK = material("Bot graphite joints", (.05, .07, .09), .7, .45)
TRIM = material("Bot service orange", (1.0, .42, .06), .25, .38)
METAL = material("Bot brushed arm", (.45, .5, .56), .85, .28)
EYE = material("Bot eye light", (.38, 1.0, .93), 0, .2, glow=6)
THRUST = material("Bot thruster glow", (.38, 1.0, .93), 0, .2, glow=3)
TORCH = material("Bot torch tip", (1.0, .8, .45), .2, .3, glow=4)


def finish(name, mat, smooth=True, bevel=0, location=None, scale=None):
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    obj.data.materials.append(mat)
    if location:
        obj.location = location
    if scale:
        obj.scale = scale
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    if bevel:
        mod = obj.modifiers.new("Machined edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj


root = bpy.data.objects.new("RepairBot", None)
bpy.context.collection.objects.link(root)
parts = []

# Rounded body, slightly long front-to-back, flattened.
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=18, radius=1)
parts.append(finish("BotShell", SHELL, location=(0, 0, 0), scale=(1.15, 1.0, .82)))
# Panel seam: a thin dark band around the equator.
bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=.035, major_segments=48, minor_segments=8)
parts.append(finish("BotSeam", DARK, location=(0, 0, .05), scale=(1.16, 1.01, 1)))
# Smoked visor wrapped on the front, with the eye behind it.
bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=14, radius=1)
parts.append(finish("BotVisor", VISOR, location=(.78, 0, .16), scale=(.46, .8, .38)))
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=.17)
parts.append(finish("BotEye", EYE, location=(1.2, 0, .18)))
# Orange service pods on each side (where its little rotors live).
for side in (-1, 1):
    bpy.ops.mesh.primitive_cube_add(size=1)
    parts.append(finish(f"BotPod{'L' if side < 0 else 'R'}", TRIM, smooth=False, bevel=.08, location=(-.05, side * 1.02, .02), scale=(.62, .28, .42)))
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=.3, depth=.06)
    parts.append(finish(f"BotRotor{'L' if side < 0 else 'R'}", DARK, location=(-.05, side * 1.02, .3)))
# Belly plate, hover-thruster ring and the shoulder joint underneath.
bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=.62, depth=.18)
parts.append(finish("BotBelly", DARK, location=(0, 0, -.74)))
bpy.ops.mesh.primitive_torus_add(major_radius=.74, minor_radius=.07, major_segments=40, minor_segments=8)
parts.append(finish("BotThruster", THRUST, location=(0, 0, -.7)))
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=.2)
parts.append(finish("BotShoulder", METAL, location=(.25, 0, -.84)))
# Antenna with a light.
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=.03, depth=.62)
parts.append(finish("BotAntenna", METAL, location=(-.4, 0, 1.0)))
bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=.08)
parts.append(finish("BotAntennaTip", EYE, location=(-.4, 0, 1.33)))

for obj in parts:
    obj.parent = root

# Arm and torch: origin at the top joint, pointing down (-Z), unit length arm.
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=.085, depth=1)
arm = finish("BotArm", METAL)
for v in arm.data.vertices:
    v.co.z -= .5
arm.location = (.25, 0, -.84)
arm.parent = root
bpy.ops.mesh.primitive_cone_add(vertices=14, radius1=.03, radius2=.14, depth=.34)
torch = finish("BotTorch", DARK)
for v in torch.data.vertices:
    v.co.z -= .17
torch.location = (.25, 0, -1.84)
torch.parent = root
bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=6, radius=.05)
tip = finish("BotTorchTip", TORCH, location=(0, 0, -.34))
tip.parent = torch

out = DEST / "repair-bot.glb"
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=str(out), export_format="GLB", export_apply=True, export_yup=True, use_selection=True)
print("exported", out)
