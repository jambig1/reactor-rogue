"""Rebuild the Reactor Rogue hangar hulls. Blender axes: +X nose, +Z dorsal."""
import math
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector

DEST = Path(sys.argv[sys.argv.index("--") + 1])
DEST.mkdir(parents=True, exist_ok=True)


def material(name, colour, metallic=.65, rough=.34, glow=0):
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


def mesh(name, verts, faces, material, smooth=False, chamfer=0):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    data.materials.append(material)
    bm = bmesh.new()
    bm.from_mesh(data)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(data)
    bm.free()
    data.update()
    for face in data.polygons:
        face.use_smooth = smooth and len(face.vertices) == 4
    if chamfer:
        bevel = obj.modifiers.new("Machined edges", "BEVEL")
        bevel.width = chamfer
        bevel.segments = 2
    return obj


def loft(name, stations, mat, lateral=0, power=.72, wing=False, mirror=1):
    # A chordwise section loft is also used for wings. The last value drives
    # dihedral on wings and the pressure-hull centreline on fuselages.
    sides = 14
    verts = []
    for x, width, top, belly, centre, *offset in stations:
        for i in range(sides):
            a = math.tau * i / sides
            c, s = math.cos(a), math.sin(a)
            u = lateral + width * math.copysign(abs(c) ** power, c)
            z = centre + (top if s >= 0 else belly) * math.copysign(abs(s) ** power, s)
            verts.append((u + offset[0], x * mirror, z) if wing else (x, u, z))
    faces = [tuple(range(sides))]
    for j in range(len(stations) - 1):
        for i in range(sides):
            n = j * sides + i
            k = j * sides + (i + 1) % sides
            faces.append((n, k, k + sides, n + sides))
    faces.append(tuple(range(len(verts) - sides, len(verts))))
    return mesh(name, verts, faces, mat, smooth=True)


def plate(name, points, thickness, mat):
    n = len(points)
    verts = points + [(x, y, z - thickness) for x, y, z in points]
    faces = [tuple(range(n)), tuple(range(n, n * 2))]
    faces += [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)]
    return mesh(name, verts, faces, mat, chamfer=min(thickness * .23, .17))


def pipe(name, a, b, r0, r1, mat, segments=12):
    a, b = Vector(a), Vector(b)
    axis = b - a
    rotation = axis.to_track_quat("Z", "Y")
    verts = []
    for end, radius in [(a, r0), (b, r1)]:
        for i in range(segments):
            theta = math.tau * i / segments
            verts.append(end + rotation @ Vector((radius * math.cos(theta), radius * math.sin(theta), 0)))
    faces = [tuple(range(segments)), tuple(range(segments, 2 * segments))]
    faces += [(i, (i + 1) % segments, (i + 1) % segments + segments, i + segments) for i in range(segments)]
    return mesh(name, verts, faces, mat, smooth=segments >= 10)


def ring(name, center, radius, tube, mat, plane="rear", start=0, arc=math.tau):
    verts = []
    steps = 24
    for i in range(steps + 1):
        angle = start + arc * i / steps
        for side in range(6):
            t = math.tau * side / 6
            r = radius + tube * math.cos(t)
            u, v, w = r * math.cos(angle), r * math.sin(angle), tube * math.sin(t)
            delta = (w, u, v) if plane == "rear" else (u, v, w)
            verts.append(tuple(a + b for a, b in zip(center, delta)))
    faces = [(i*6+j, i*6+(j+1)%6, (i+1)*6+(j+1)%6, (i+1)*6+j)
             for i in range(steps) for j in range(6)]
    faces += [tuple(range(6)), tuple(range(steps*6, steps*6+6))]
    return mesh(name, verts, faces, mat, smooth=True)


def mark(surface, name, points, radius, mat, sign=1):
    track = []
    for x, y in points:
        hit, loc, normal, _ = surface.ray_cast((x, y, 80*sign), (0, 0, -sign))
        if hit:
            track.append(loc + normal * radius * .54)
        else:
            track.append(None)
    for a, b in zip(track, track[1:]):
        if a is not None and b is not None and (a-b).length > .01:
            pipe(name, a, b, radius, radius, mat, 6)


def stripe(surface, name, a, b, radius, mat, sign=1):
    mark(surface, name, [(a[0]+(b[0]-a[0])*t/8, a[1]+(b[1]-a[1])*t/8)
                         for t in range(9)], radius, mat, sign)


def nacelle(x, y, z, r, length, facets):
    # A hollow collar extends beyond the turbine disc. Outside and inside
    # radius taper in opposing directions to give the nozzle a visible throat.
    n = facets
    profiles = [(x,r), (x+.55,r*1.03), (x+2,r*.78), (x+2,r*.5),
                (x+.64,r*.56), (x,r*.82)]
    verts = [(p, y+rad*math.cos(math.tau*i/n), z+rad*math.sin(math.tau*i/n))
             for p, rad in profiles for i in range(n)]
    faces = [(j*n+i, j*n+(i+1)%n, ((j+1)%6)*n+(i+1)%n, ((j+1)%6)*n+i)
             for j in range(6) for i in range(n)]
    mesh("engine skirt", verts, faces, titanium, smooth=facets>10)
    loft("Drive housing", [(x+1,r*.72,r*.76,r*.68,z),(x+3,r*1.13,r*1.1,r*.95,z),
                          (x+length*.7,r*1.04,r*.9,r*.88,z),(x+length,r*.52,r*.52,r*.52,z)], paint,y)
    pipe("engine graphite throat", (x+.55,y,z), (x+1.03,y,z), r*.64,r*.63,graphite)
    pipe("engine lit core", (x+.5,y,z), (x+.56,y,z),r*.42,r*.42,light)
    ring("engine emitter ring", (x+.1,y,z),r*.72,.14,light)
    for k in range(5):
        a=math.tau*k/5
        pipe("engine radial braces",(x+.42,y+r*.53*math.cos(a),z+r*.53*math.sin(a)),
             (x+.56,y+r*.21*math.cos(a),z+r*.21*math.sin(a)),.11,.13,titanium,6)
    return (x-.15,y,z,r*.56)


def hardpoint(x, y, z, length, r, count=1):
    loft("mount receiver", [(x-3,r*1.6,r,r,z),(x-1,r*2,r*1.4,r*1.2,z),
                            (x+2,r*1.6,r*1.15,r,z),(x+3,r,r*.55,r*.55,z)],graphite,y)
    for i in range(count):
        yy=y+(i-(count-1)/2)*r*1.7
        pipe("mount jacket",(x,yy,z),(x+length*.58,yy,z),r*.82,r*.68,titanium)
        pipe("mount barrel",(x+length*.45,yy,z),(x+length,yy,z),r*.53,r*.42,graphite)
        ring("mount muzzle",(x+length,yy,z),r*.41,.11,light)
        pipe("mount feed line",(x-1,yy,z+r),(x+length*.38,yy,z+r*.65),.11,.09,light,6)


def armor_chevrons(surface, a, b, width):
    for side in (-1, 1):
        for n in range(3):
            x = a+(b-a)*n/3
            stripe(surface, "Heat shield joint", (x,side*.8), (x-1.5,side*width), .15, graphite,-1)
        stripe(surface,"Ventral bus line",(a,side*width*.66),(b,side*width*.66),.16,light,-1)
        for n in range(3):
            x=b-1.25*n
            stripe(surface,"Stencilled inspection mark",(x,side*width*.45),(x-.4,side*width*.7),.115,marking,-1)


# Each row is an independently shaped pressure hull, not a scaled template.
# x, half-width, crown height, keel depth, vertical centreline
HULLS = {
    "vanguard": [(-25,4,2,2,0),(-19,9,4,4,0),(-9,10,5,4,0),(1,8,5.8,3.7,0),(13,6,5,3.1,.2),(23,3,2.6,2,0),(29,.9,.8,.9,0)],
    "bastion": [(-24,7,4,4,0),(-20,12,6,6,0),(-12,15,8,6,0),(7,14,8.5,6,0),(17,12,6.7,5,0),(23,9,4.2,3,0)],
    "harrier": [(-23,3,2.2,2,0),(-15,5,4,3,0),(-3,6,5,3,0),(7,5,4,2.7,0),(14,3.2,2.4,2,0),(20,.7,.5,.5,0)],
    "glacier": [(-22,5,3,3,0),(-14,8,6,4,0),(-4,10,7.5,5.5,0),(5,9,6.4,5,0),(17,6,3.3,3.2,0),(25,2.4,1.4,1.4,0)],
    "tempest": [(-25,1.7,1,1,0),(-16,4.5,3.4,3,0),(-7,6.8,4.9,3.5,0),(4,5,5,3,0),(16,3,3.4,2,0),(30,.53,.55,.5,0)],
    "scavenger": [(-23,7,3.9,4,0),(-18,10.8,5.4,5,0),(-8,11,6.8,5.6,0),(5,9,5.5,4.7,0),(16,8,3.9,3,0),(21,5,2,1.7,0)],
    "spectre": [(-27,2,1,1,0),(-19,5.3,1.8,1.8,0),(-7,7,2.9,2.15,0),(4,6,3.9,2,0),(21,3.3,2.2,1.4,0),(33,.42,.32,.42,0)],
    "architect": [(-25,4,2.9,3,0),(-17,6,5,4,0),(-8,8,6.5,4,0),(8,8,5,5,0),(18,7,4,4,0),(23,3,2,2,0)],
    "helios": [(-25,3.7,2.8,2,0),(-17,8,4.8,3.6,0),(-5,9,7.6,4.8,0),(4,9,6,4,0),(13,5,4.5,2.7,0),(26,1.6,1.2,1.4,0)],
    "echo": [(-21,3,2,2,0),(-15,6,4,3,0),(-4,7,6,4,0),(6,7,5.6,3.5,0),(18,5,3,2.4,0),(24,2,1,1,0)],
    "sovereign": [(-30,5,4,5,0),(-22,8,5.9,6,0),(-10,11,7.7,7,0),(5,12,8.2,6.5,0),(16,9,6.4,4,0),(25,5,4,2.5,0),(34,1,.7,1,0)],
}

# y, half-chord, crown, underside, dihedral, longitudinal centre.
WINGS = {
    "vanguard": [(6,14,1.6,1.1,0,-5),(13,10,1.5,1.1,.4,-9),(21,6,1.0,.7,1,-14),(27,2.1,.64,.39,2.2,-19)],
    "bastion": [(10,19,2.8,2.4,0,-1),(17,18,3,2.3,.1,-1),(23,15,1.9,2.1,-.1,-2),(26,11,1.2,1.6,-.8,-3)],
    "harrier": [(4,12,1.3,1.1,0,-7),(10,12,1.7,1.3,-.4,-7),(17,7,1.2,.9,-.6,-11),(21,2.5,.5,.45,-.8,-14)],
    "glacier": [(7,12,2.1,1.4,-.8,-5),(13,10,2.05,1.55,-1,-4),(20,7,1.65,1.3,-1.8,-3),(27,1.3,.4,.5,-.4,-1)],
    "tempest": [(5,10,1.5,1.5,-.35,-4),(11,7,1.3,1.2,-.9,-2),(17,5.4,1.6,1.1,-.45,2),(23,4.1,1.1,.9,1,8),(27,1.1,.27,.55,2.7,13)],
    "scavenger": [(6,14,1.7,1.7,.3,-2),(13,13,2.6,1.9,.4,-5),(19,10,2.5,1.7,.7,-9),(25,5,1.5,1,1,-14)],
    "spectre": [(4,15,1.2,.8,-.3,-3),(9,14,1.05,.65,-.1,-8),(14,11,.75,.57,.2,-14),(22,2.5,.3,.27,.9,-26)],
    "architect": [(6,11,1.8,1.2,0,-5),(13,13,1.9,1.4,0,-2),(20,15,2,1.8,0,-.1),(27,13,1.25,1.35,.2,2)],
    "helios": [(6,15,2,1.5,0,-5),(12,13,1.8,1.4,.4,-3),(18,9.2,1.35,1.3,1,1),(24,6,1.2,.85,2.1,6),(27,1.5,.45,.3,3,10)],
    "echo": [(5,11,1.6,1.4,0,-4),(10,8,1.5,1.15,-.4,-3),(16,9,1.7,1.55,-.35,-2),(22,6.5,1.2,1.1,.65,0),(26,1.7,.45,.55,1.7,2)],
    "sovereign": [(8,20,2.5,2.25,.5,-3),(14,17,2.4,2.1,.45,-3),(21,13,2.1,1.9,.8,-4),(28,10,1.8,1.24,2,-6),(34,2.4,.55,.44,4,-13)],
}

# Paired outlets share stations with the retrofit hardpoints. The capital
# hulls also retain a centreline engine in their stock configuration.
DRIVES = {
    "vanguard": (-27,9,-.7,2.55,11), "bastion": (-28,12,-.7,3.4,14),
    "harrier": (-24,11,-.6,2.35,13), "glacier": (-22,13,-.65,2.8,13),
    "tempest": (-21,15,-.2,2.45,12), "scavenger": (-23,15,-.8,3.0,14),
    "spectre": (-28,5,-.6,1.6,11), "architect": (-26,16,1,3.3,14),
    "helios": (-26,7,-.7,2.65,12), "echo": (-20,16,-.65,2.8,13),
    "sovereign": (-31,20,-.65,3.55,16),
}

ACCENTS = {
    "vanguard": (.07,.68,.98), "bastion": (1,.26,.06), "harrier": (1,.19,.31),
    "glacier": (.32,.78,1), "tempest": (.47,.28,1), "scavenger": (1,.48,.09),
    "spectre": (.55,.19,1), "architect": (.25,.91,.71), "helios": (1,.60,.12),
    "echo": (.92,.24,.73), "sovereign": (.83,.42,1),
}

GUNS = {
    "vanguard": (2,11,1.2,10,1.0,1), "bastion": (1,12,9,18,1.55,2),
    "harrier": (11,11,2,14,.78,3), "glacier": (7,8,2,10,.85,1),
    "tempest": (3,15,.2,7,.65,1), "scavenger": (5,14,2,9,1,1),
    "spectre": (4,5,.8,15,.55,2), "architect": (8,16,3.6,8,.9,1),
    "helios": (3,7,2.4,12,.85,1), "echo": (5,16,2.4,11,.8,1),
    "sovereign": (8,20,3.1,16,1.3,2),
}


def keel(x0, x1, width, depth, side=0):
    return loft("Ventral keel",
                [(x0,width*.48,.7,.9,-depth*.67),
                 (x0+(x1-x0)*.24,width,1.5,1.2,-depth),
                 (x0+(x1-x0)*.69,width*.88,1.35,1.1,-depth*.95),
                 (x1,width*.36,.65,.68,-depth*.59)], graphite, side)


def pod(x0, x1, y, width, depth, z, mat= None):
    return loft("Shoulder structure",
                [(x0,width*.53,depth*.7,depth*.48,z),
                 (x0+(x1-x0)*.22,width,depth,depth*.8,z),
                 (x0+(x1-x0)*.72,width*.84,depth*.88,depth*.72,z),
                 (x1,width*.36,depth*.38,depth*.38,z)],mat or paint,y)


def cockpit(x, y, z, length, width, height):
    for scale, h, mat in [(1.17,.54,titanium),(1,1,glass)]:
        loft("Canopy",[(x-length*.57*scale,width*.31*scale,.28,.45,z),
             (x-length*.29*scale,width*.91*scale,height*h*.92,.65,z+.25),
             (x+length*.16*scale,width*scale,height*h,.58,z),
             (x+length*.57*scale,width*.24*scale,.24,.53,z-.78)],mat,y, power=.85)


def signature(ship, hull):
    if ship == "vanguard":
        cockpit(8,0,4.45,13,3.6,2.7)
        for side in (-1,1):
            pod(-23,6,side*8.4,3.8,2.75,0)
            rail = keel(-19,18,2.05,3.95,side*2.5)
            stripe(rail,"Ventral patrol strip",(-12,side*2.5),(10,side*2.5),.16,light,-1)
            plate("Tail elevator",[(-21,side*8,1.7),(-19,side*11,7),(-15,side*11,6.3),(-9,side*8,1.8)],.8,paint)
    elif ship == "bastion":
        cockpit(12,0,6.3,9,3.4,2.1)
        for side in (-1,1):
            armor=pod(-23,19,side*16.5,6.35,5.5,1.4)
            for x in (-14,-6,2,10):
                stripe(armor,"Fortress armour joint",(x,side*12),(x-1,side*21),.26,graphite)
                stripe(armor,"Armoured running light",(x+1,side*18.8),(x+3,side*18.8),.16,light)
            keel(-20,13,4.8,4.2,side*15)
    elif ship == "harrier":
        cockpit(5,0,3.8,10,2.65,2.7)
        for side in (-1,1):
            fork=loft("Forward lance cheek",[(-20,2.7,2.3,1.8,0),(-9,4,3.2,3,0),
                       (8,3.5,3.65,2.6,0),(20,2.7,2,1.25,.6),
                       (29,1.6,1.2,.85,1),(33,.36,.27,.22,1.1)],paint,side*11)
            stripe(fork,"Fork guidance rail",(8,side*12.2),(29,side*11.5),.22,light)
            stripe(fork,"Ventral fork spine",(4,side*11),(25,side*11),.22,titanium,-1)
    elif ship == "glacier":
        cockpit(10,0,4.8,10,3.1,1.8)
        for side in (-1,1):
            pod(-19,10,side*12.6,4.5,2.9,-.4)
            pipe("Cryogenic return manifold",(-17,side*12.8,-2.3),(7,side*12.8,-2.3),1,1.15,titanium)
            for x in (-13,-9,-5,-1,3):
                ring("Coolant compression collar",(x,side*12.8,-2.3),1.08,.18,light if x%3 else graphite)
            for x in (-12,-6,0):
                plate("Radiator blade",[(x-3,side*8,3),(x-1,side*14,7.1),(x+2,side*13,5.8),(x+3,side*8,3)],.85,titanium)
        ring("Cryocell guard",(-6,0,6.8),3.3,.53,titanium,"top")
        pipe("Cryocell",(-6,0,6.3),(-6,0,9.35),1.8,1.15,light,8)
    elif ship == "tempest":
        cockpit(8,0,4.3,13,2.4,2.6)
        for side in (-1,1):
            pod(-19,7,side*13,3.8,3,.1,graphite)
            ring("Storm collector bezel",(0,side*16,2.35),4.65,.58,titanium,"top")
            ring("Storm collector arc",(0,side*16,2.35),3.88,.21,light,"top")
            for i in range(3):
                theta=i*math.tau/3
                pipe("Collector electrode",(4.3*math.cos(theta),side*16+4.3*math.sin(theta),2.3),(0,side*16,2.3),.34,.61,graphite,8)
            pipe("Lower storm cell",(0,side*16,-2),(0,side*16,2.65),1.48,1,light)
    elif ship == "scavenger":
        cockpit(8,-4,4.1,10,2.8,2.2)
        pod(-21,18,-15,5.1,3.8,.65)
        pod(-21,18,15,4.15,3.3,.3,graphite)
        for x in (-15,-8,-1,6):
            plate("Salvage cassette",[(x-2.9,-19,4),(x+3,-19,4),(x+2.5,-12,4.7),(x-2.9,-12,4.7)],1.1,titanium)
            pipe("Cassette latch",(x,-18,4.1),(x,-15,4.6),.22,.22,marking,6)
        for side in (-1,1):
            pipe("Magnetic grapple arm",(2,side*14,-1.25),(20,side*15,-2.8),1.34,.85,graphite,8)
            pipe("Grapple piston",(9,side*16,-1),(23,side*16,-1.85),.63,.48,titanium)
            pipe("Grapple jaw",(21,side*15,-2.5),(27,side*13,-3.2),1.05,.8,marking,8)
        keel(-17,13,4.6,4.9)
    elif ship == "spectre":
        cockpit(10,0,2.9,12,2.35,1.46)
        for side in (-1,1):
            pod(-25,6,side*4.4,2.4,1.25,-.4,graphite)
            vane = loft("Stealth chine",[(2.7,13,.6,.5,0,6),(5.2,18,.63,.55,0,-1),
                        (8,10.3,.45,.5,-.5,-10)],graphite,wing=True,mirror=side)
            stripe(vane,"Inset sensor line",(-15,side*6.2),(10,side*4.2),.13,light)
        ventral=keel(-22,20,2.5,1.6)
        stripe(ventral,"Low signature repeater",(-18,0),(13,0),.12,light,-1)
    elif ship == "architect":
        cockpit(11,0,4.5,10,3.2,2.6)
        for side in (-1,1):
            pod(-24,20,side*16,5,3.5,.6)
            plate("Flight deck",[(2,side*11,5),(20,side*11,4.4),(20,side*22,3.7),
                                 (6,side*23,3.3),(-5,side*19,3.35)],1.2,graphite)
            for x in (4,12):
                ring("Drone pad guide",(x,side*16,4.95-(x-4)*.035),2.9,.19,light,"top")
                pipe("Drone cradle",(x,side*16,4),(x,side*16,5.03),2.5,2.2,titanium,8)
            pod(-16,12,side*16,3.9,1.7,-2.8,graphite)
            pipe("Lower hangar track",(-13,side*16,-4.25),(9,side*16,-4.25),.4,.35,light,8)
    elif ship == "helios":
        cockpit(7,0,5.4,11,3,1.7)
        ring("Solar collector guard",(-8,0,7.2),4.7,.55,titanium,"top")
        ring("Solar ring",(-8,0,7.3),3.65,.21,light,"top")
        pipe("Contained solar core",(-8,0,6.7),(-8,0,9),2.65,1.86,light,12)
        for side in (-1,1):
            pod(-20,6,side*7.5,3.5,2.9,.6)
            lower=keel(-19,10,2.7,3.8,side*3.3)
            stripe(lower,"Ventral solar feed",(-15,side*3.3),(6,side*3.3),.24,light,-1)
    elif ship == "echo":
        cockpit(9,0,4.8,9,3.1,2.25)
        for side in (-1,1):
            pod(-18,13,side*15.5,5.3,3.45,.4)
            for x, r in ((-8,4),(-2,4.4),(4,4.1)):
                ring("Resonator coil",(x,side*16,.25),r,.34,titanium)
                ring("Resonator energy band",(x+.46,side*16,.25),r*.98,.17,light)
            pipe("Resonator waveguide",(-8,side*16,-2.5),(9,side*16,-2.5),1.2,1.05,graphite)
    else:  # Sovereign's split nacelles enclose a tall, exposed rift spine.
        cockpit(14,0,5.8,12,3.85,2.35)
        for side in (-1,1):
            pod(-27,19,side*19,5.2,4.4,1)
            aft=keel(-24,11,3.5,4.45,side*19)
            stripe(aft,"Outrigger underglow",(-19,side*19),(2,side*19),.27,light,-1)
            plate("Rift antenna",[(-20,side*12,4),(-16,side*15,12.8),(-13,side*15.5,11),(-7,side*12,5)],1.1,titanium)
        for x in (-16,-11,-6):
            ring("Rift spine brace",(x,0,7.6),3,.39,titanium)
            ring("Rift spine emitter",(x+.55,0,7.6),2.5,.19,light)
        pipe("Rift reactor",(-17,0,7.6),(-3,0,7.6),1.35,.75,light)


def build(ship):
    global paint, titanium, graphite, glass, light, marking
    bpy.ops.wm.read_factory_settings(use_empty=True)
    accent = ACCENTS[ship]
    paint = material("Hull paint",tuple(.027+.035*a for a in accent))
    titanium = material("Brushed panel alloy",tuple(.115+.085*a for a in accent),.78,.31)
    graphite = material("Graphite heat armour",(.023,.033,.047),.42,.48)
    glass = material("Smoked canopy",tuple(.029+.20*a for a in accent),.53,.16)
    light = material("Hull guidance",accent,.12,.25,2.25)
    marking = material("Service stencil",(.53,.62,.63),.26,.48)
    hull = loft("Pressure hull", HULLS[ship], paint,
                power=.39 if ship in ("bastion","scavenger") else .55 if ship in ("architect","spectre") else .75)
    armor_chevrons(hull, -13, 11, min(s[1] for s in HULLS[ship][2:5])*.83)
    for side in (-1,1):
        stripe(hull,"Hull panel break",(-15,side*3),(13,side*2.5),.15,titanium)
        stripe(hull,"Nose registration line",(13,side*1.6),(19,side*1.1),.12,light)
        for j in range(3):
            x=-14+j*1.7
            stripe(hull,"Shoulder cooling vents",(x,side*2.7),(x-1,side*4),.16,graphite)
    for side in (-1,1):
        rows = WINGS[ship]
        wing = loft("wing surface", rows, paint, power=.66, wing=True, mirror=side)
        inner, outer = rows[0], rows[-2]
        end = (outer[-1],outer[0]*side)
        stripe(wing,"wing dorsal guide",(inner[-1]-inner[1]*.49,(inner[0]+1)*side),end,.20,light)
        stripe(wing,"wing ventral guide",(inner[-1],(inner[0]+1)*side),end,.17,light,-1)
        for row in rows[1:-1]:
            y,chord,_,_,_,x=row
            stripe(wing,"wing armour seam",(x-chord*.73,y*side),(x+chord*.62,y*side),.15,graphite)
            for offset in (-.4,.4):
                stripe(wing,"wing maintenance stripe",(x+chord*.31+offset,y*side),
                       (x+chord*.43+offset,(y-.9)*side),.12,marking)
        if ship == "helios":
            for row in rows[1:-1]:
                y,chord,_,_,_,x=row
                for j in range(3):
                    pos=x-chord*.30+j*.14*chord
                    stripe(wing,"wing photovoltaic traces",(pos,y*side),(pos+1.7,(y+2.2)*side),.25,titanium)
        x,y,z,length,r,count = GUNS[ship]
        hardpoint(x,y*side,z,length,r,count)
    signature(ship,hull)
    x,y,z,r,length=DRIVES[ship]
    outlets=[nacelle(x,side*y,z,r,length,8 if ship in ("bastion","spectre","scavenger") else 16)
             for side in (-1,1)]
    if ship in ("bastion","scavenger","sovereign"):
        outlets.append(nacelle(x+1,0,z,r*1.15,length,12))
    for i, (x,y,z,r) in enumerate(outlets):
        empty=bpy.data.objects.new(f"outlet {i}",None)
        empty.location=(x,y,z)
        empty["outletRadius"]=r
        bpy.context.collection.objects.link(empty)
    # Merge by paint and replacement group so extra construction detail does
    # not turn into hundreds of draws. Keep outlet markers as separate nodes.
    groups={}
    for obj in bpy.context.scene.objects:
        if obj.type!="MESH":
            continue
        first=obj.name.split()[0]
        role=first if first in ("engine","wing","mount") else "hull"
        groups.setdefault((role,obj.data.materials[0].name),[]).append(obj)
    for (role, mat), objects in groups.items():
        bpy.ops.object.select_all(action="DESELECT")
        for obj in objects:
            bpy.context.view_layer.objects.active=obj
            for mod in list(obj.modifiers):
                bpy.ops.object.modifier_apply(modifier=mod.name)
            obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join()
        objects[0].name=f"{role} {mat}"
    bpy.ops.export_scene.gltf(filepath=str(DEST/f"{ship}.glb"), export_extras=True,
                             export_format="GLB", export_texcoords=False)


for name in HULLS:
    build(name)

