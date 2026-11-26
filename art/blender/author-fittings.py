"""Export all 16 swappable fittings for every Reactor Rogue hull from Blender."""
import importlib
import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

sys.path.insert(0,str(Path(__file__).parent))
fleet=importlib.import_module("author-fleet")
material, loft, plate, pipe, ring = fleet.material, fleet.loft, fleet.plate, fleet.pipe, fleet.ring
DEST=fleet.DEST/"fittings"
DEST.mkdir(exist_ok=True)

ENGINE=("e_twin","e_ion","e_fusion","e_nova")
WING=("w_razor","w_vane","w_prism","w_phantom")
MOUNT=("m_heavy","m_rotary","m_array","m_siege")
PLATING=("p_reactive","p_light","p_heavy","p_aegis")
PALETTES={
    "e_twin":(.14,.61,1),"e_ion":(.32,.39,1),"e_fusion":(.67,.26,1),"e_nova":(1,.51,.095),
    "w_razor":(.2,.69,1),"w_vane":(.1,.92,.69),"w_prism":(.56,.25,1),"w_phantom":(1,.58,.13),
    "m_heavy":(.20,.56,1),"m_rotary":(.22,.63,1),"m_array":(.66,.25,1),"m_siege":(.09,.91,.83),
    "p_reactive":(.9,.30,.12),"p_light":(.24,.58,1),"p_heavy":(.63,.26,1),"p_aegis":(.14,.62,1),
}

WASP_HULL=[(-29,2.6,2.1,2.2,0),(-26,5.2,3.5,3.8,0),(-17,7,5.2,4.4,0),
           (-3,6.5,6.2,3.8,0),(9.5,4.6,4.6,3.3,.1),(22,2.4,2.3,2,.2),(31,.25,.35,.35,.1)]
WASP_WING=[(4.9,13,.8,.8,.35,-9),(9,12.3,1,.8,.8,-11),
           (17,8,1.1,.9,1.4,-18),(25,1.8,.5,.4,2.5,-23)]
WASP_DRIVE=(-32.4,8.35,-.86,2.8,11)
WASP_GUN=(.3,9.8,-.25,10,.93,1)


def outlet(x,y,z,r,index):
    marker=bpy.data.objects.new(f"exhaust {index}",None)
    marker.location=(x,y,z)
    marker["outletRadius"]=r
    bpy.context.collection.objects.link(marker)


def nozzle(x,y,z,r,facets,signal,direction=1):
    # An open, tapered throat with an internal emitter and an external collar.
    profiles=[(0,1),(.48,1.08),(2,.83),(2,.52),(.94,.54),(0,.78)]
    verts=[(x+direction*dx,y+r*k*math.cos(math.tau*i/facets),z+r*k*math.sin(math.tau*i/facets))
           for dx,k in profiles for i in range(facets)]
    faces=[(j*facets+i,j*facets+(i+1)%facets,((j+1)%6)*facets+(i+1)%facets,((j+1)%6)*facets+i)
           for j in range(6) for i in range(facets)]
    fleet.mesh("Nozzle shell",verts,faces,alloy,smooth=facets>=12)
    pipe("Internal emitter",(x+.99*direction,y,z),(x+1.08*direction,y,z),r*.44,r*.47,signal,facets)
    ring("Hot inner lip",(x+.36*direction,y,z),r*.75,.11,signal)


def engine(ship, item, signal):
    rear, lateral, z, radius, _=fleet.DRIVES.get(ship,WASP_DRIVE)
    centres=[-lateral,lateral]+([0] if ship in ("bastion","sovereign","scavenger") else [])
    for index,y in enumerate(centres):
        x=rear-.35-(1.25 if item=="e_nova" else 0)
        r=radius*(1.12 if y==0 else 1)
        loft("Engine cradle",[(x+1.1,r*.79,r*.79,r*.72,z),(x+3.1,r*1.12,r*1.02,r*.94,z),
              (x+8.6,r*1.1,r*.92,r*.8,z),(x+12.9,r*.57,r*.58,r*.53,z)],armour,y,.5)
        # Bolt the cradle into the actual stern shoulder.
        inboard=y-math.copysign(r*.78,y) if y else 0
        pipe("Load-bearing trunnion",(x+5,inboard,z),(x+14,inboard,z),r*.45,r*.39,alloy,8)
        if item=="e_twin":
            for side in (-1,1):
                yy=y+side*r*.61
                nozzle(x,yy,z,r*.58,12,signal)
                outlet(x-.15,yy,z,r*.36,index*2+side+1)
                pipe("Duplex scavenger line",(x+2,yy,z+r*.55),(x+7.8,yy,z+r*.85),.16,.23,alloy,8)
            for j in range(3):
                pipe("Twin blue intake bars",(x+4.5,y+(j-1)*r*.24,z+r*.94),
                     (x+7.6,y+(j-1)*r*.24,z+r*.93),.14,.14,signal,6)
        else:
            outer=r*(1.08 if item=="e_nova" else .86 if item=="e_ion" else 1)
            nozzle(x,y,z,outer,8 if item=="e_fusion" else 16,signal)
            outlet(x-.17,y,z,outer*.62,index)
            if item=="e_ion":
                for quarter in range(4):
                    a=quarter*math.pi/2+math.pi/4
                    yy,zz=y+math.cos(a)*r*.83,z+math.sin(a)*r*.83
                    pipe("Longitudinal ion braid",(x+2,yy,zz),(x+9,yy,zz),.22,.12,signal,8)
                for jj in (3,6,8):
                    ring("Ion cage spacer",(x+jj,y,z),r*1.1,.15,alloy)
                for j in range(4):
                    pipe("Violet ion grille",(x+3.8+j*.93,y-r*.61,z+r*.94),
                         (x+3.8+j*.93,y+r*.61,z+r*.94),.15,.15,signal,6)
            elif item=="e_fusion":
                cx=x+5.7
                pipe("Fusion reaction chamber",(cx,y,z+r*.72),(cx,y,z+r*1.30),r*.84,r*.75,dark,12)
                ring("Violet reactor perimeter",(cx,y,z+r*1.3),r*.75,.17,signal,"top")
                pipe("Amber reaction window",(cx,y,z+r*1.31),(cx,y,z+r*1.41),r*.48,r*.39,reactor,12)
                for side in (-1,1):
                    pipe("Reactor feed",(x+3,y+side*r*.78,z-r*.54),(x+10,y+side*r*.78,z-r*.54),.22,.16,alloy,8)
            else:
                ring("Afterburner constrictor",(x+.7,y,z),r*1.11,.18,signal)
                ring("Gold nozzle flange",(x+.49,y,z),r*1.13,.23,brass)
                for side in (-1,1):
                    plate("Afterburner shoulder fin",[(x+2,y+side*r*.65,z+r*.7),
                          (x+2.6,y+side*r*1.35,z+.5),(x+8.7,y+side*r*.89,z+r*1.07),
                          (x+7.2,y+side*r*.58,z+r*.89)],.37,brass)
                for sector in range(6):
                    a=math.tau*sector/6
                    yy,zz=y+math.cos(a)*r*.97,z+math.sin(a)*r*.97
                    pipe("Afterburner claw",(x-.56,yy,zz),(x+3.7,yy,zz),.20,.29,alloy,8)
                    pipe("Afterburner braid",(x+2.6,yy,zz),(x+6.9,yy,zz),.13,.13,signal,8)


# One side of the equip-card silhouette in tip-span and nose-to-tail units.
# The thin attachment below it is fitted separately to the ship.
CARD_WINGS={
    "w_phantom":[(0,0),(.10,.19),(.56,.36),(.83,.51),(.59,.57),(.54,.64),
                 (.65,.74),(.86,.86),(1,1),(.77,.91),(.45,.79),(.18,.75),(0,.67),(.06,.33)],
    "w_prism":[(0,0),(.24,.12),(.36,.29),(.73,.46),(1,1),(.72,.89),
               (.23,.77),(.16,.57),(0,.48)],
    "w_razor":[(0,0),(.14,.15),(.53,.42),(.95,.67),(.67,.64),(1,1),
               (.67,.88),(.18,.72),(.16,.54),(0,.46)],
    "w_vane":[(0,0),(.26,.11),(.34,.19),(.83,.33),(.90,.43),(.51,.43),
              (.97,.56),(1,.66),(.58,.64),(.91,.79),(.95,.89),(.83,.92),(0,.74)],
}


def wing(ship,item,signal,proxy):
    original=fleet.WINGS.get(ship,WASP_WING)
    _,chord,_,_,z,centre=original[0]
    tip,_,_,_,tip_z,tail=original[-1]
    tip+={"bastion":5.5,"architect":5.3,"sovereign":2.8,"harrier":2.25,"echo":2.0}.get(ship,0)
    hit,p,_,_=proxy.ray_cast((centre,80,z),(0,-1,0))
    if not hit:
        raise ValueError(f"No wing socket on {ship}")
    socket=p.y
    span=tip-socket
    if span<4:
        raise ValueError(f"No clearance for {ship} wings")
    # Grow the exposed blade on both axes about its inboard socket. Compact
    # hulls need more span than capital ships to make the wing read at bay scale.
    span*= {"harrier":1.40,"spectre":1.36,"wasp":1.35,"sovereign":1.24,"bastion":1.26,"architect":1.28}.get(ship,1.32)
    length=(chord*1.82+max(0,centre-tail)*.16)*1.20
    nose=centre+length*.50
    before=set(bpy.context.scene.objects)

    def point(u,v,lift=0):
        return (nose-length*v,socket+span*u,z+.32*u+(tip_z-z+1.0)*u*u+lift)

    def panel(name,coords,depth,mat,lift=0):
        return plate(name,[point(u,v,lift) for u,v in coords],depth,mat)

    def trim(name,coords,radius,mat,lift=.13):
        for a,b in zip(coords,coords[1:]):
            pipe(name,point(*a,lift),point(*b,lift),radius,radius,mat,6)

    outline=CARD_WINGS[item]
    rim=brass if item=="w_phantom" else prism if item=="w_prism" else alloy
    panel("Card-profile wing spar",outline,1.14 if ship!="spectre" else .76,armour)
    # Internal tongue is embedded in the pressure hull. The spar crosses the
    # card's near-vertical root without raising either wing at the hinge.
    panel("Wing socket tongue",[(-1.42/span,.29),(.12,.30),(.23,.43),(.20,.62),
                                (-1.42/span,.66)],1.4,armour,-.22)
    trim("Fixed root hinge",[(0,.32),(.02,.63)],.39,alloy,.29)
    trim("Bevelled perimeter",outline+outline[:1],.16,rim)
    outlines=[(u*.963+.014,v*.965+.018) for u,v in outline]
    trim("Guidance around the blade",outlines+outlines[:1],.085,signal,.20)
    trim("Ventral silhouette",outlines+outlines[:1],.08,signal,-.72 if ship=="spectre" else -1.1)

    if item=="w_phantom":
        frame=[(.19,.31),(.53,.40),(.72,.50),(.50,.55),(.45,.63),(.57,.75),
               (.81,.87),(.49,.76),(.21,.68)]
        panel("Smoked cyan Phantom sail",frame,.28,ceramic,.19)
        panel("Translucent cyan face",[(.21,.38),(.56,.48),(.45,.62),(.25,.68)],.15,cyan_glass,.24)
        panel("Cyan trailing face",[(.45,.64),(.56,.75),(.77,.85),(.32,.72)],.15,cyan_glass,.24)
        trim("Fine gold spar",frame+frame[:1],.08,brass,.27)
        trim("Cyan energy veins",[(.21,.43),(.34,.48),(.45,.63),(.65,.77)],.08,cyan_glass,.36)
        trim("Cyan energy veins",[(.24,.68),(.36,.59),(.53,.48)],.07,cyan_glass,.36)
    elif item=="w_prism":
        glass=[(.14,.41),(.34,.30),(.67,.51),(.86,.88),(.61,.79),(.25,.72)]
        panel("Violet Prism sail",glass,.31,prism,.22)
        for facet in [[(.16,.44),(.39,.41),(.47,.60)],[(.21,.68),(.47,.60),(.67,.77)],[(.47,.60),(.67,.53),(.80,.85)]]:
            panel("Iridescent prism facet",facet,.14,cyan_glass,.29)
        trim("Prism refracting seams",[(.19,.46),(.47,.60),(.75,.81)],.07,signal,.39)
    elif item=="w_vane":
        for v,u in ((.29,.36),(.48,.48),(.68,.47)):
            face=[(.12,v-.12),(u,v-.07),(u+.30,v+.09),(u+.26,v+.14),(.12,v+.04)]
            panel("Separate vane blade cap",face,.29,alloy,.24)
            trim("Cyan slat edge",[face[0],face[1],face[2]],.095,signal,.35)
    else:
        panel("Raised Razor leading plate",[(.05,.10),(.22,.23),(.80,.62),(.64,.59),(.18,.39)],.31,alloy,.25)
        trim("Razor red status bar",[(.11,.23),(.25,.33),(.36,.40)],.12,warning,.42)
        for v in (.66,.70,.74):
            trim("Teal Razor heat vent",[(.28,v),(.40,v+.04)],.085,cyan_glass,.18)

    # Reflect the finished geometry, including bevels, in the ship centreline.
    # Do not ray-cast/art-direct a second wing independently.
    mirror=Matrix.Diagonal((1,-1,1,1))
    # Sorted, not set order: copies are auto-numbered (.001, .002...) in the order made, and the export
    # joins pieces by name, so set order made every export shuffle the wing's vertices.
    for obj in sorted(set(bpy.context.scene.objects)-before,key=lambda o:o.name):
        bpy.context.view_layer.objects.active=obj
        for modifier in list(obj.modifiers):
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        twin=obj.copy()
        twin.data=obj.data.copy()
        twin.data.transform(mirror)
        twin.data.flip_normals()
        bpy.context.collection.objects.link(twin)


def mount(ship,item,signal):
    x,y,z,length,r,_=fleet.GUNS.get(ship,WASP_GUN)
    for side in (-1,1):
        yy=side*y
        height=.79 if ship=="spectre" else 1.14 if ship in ("sovereign","bastion") else 1
        z0=z+.55*height
        loft("Armoured receiver saddle",[(x-4,1.45,.49,1.1,z0),(x-1,2,1.3,1.48,z0),
             (x+2.3,1.75,1.16,1.3,z0),(x+4,1.05,.55,.67,z0)],armour,yy,.46)
        pipe("Inboard saddle brace",(x-.6,yy-side*min(y*.51,3.3),z0-1.05),(x-.6,yy,z0-.5),.52,.84,alloy,8)
        if item=="m_heavy":
            muzzle=x+length*.76+3.4
            pipe("Heavy heat jacket",(x,yy,z0),(muzzle-1.4,yy,z0),1.19*height,.86*height,alloy,10)
            nozzle(muzzle,yy,z0,.92*height,10,signal,-1)
            for j in range(4):
                ring("Heavy vent ring",(x+1+j*1.02,yy,z0),1.18*height,.18,dark)
        elif item=="m_rotary":
            muzzle=x+length*.73+3.3
            pipe("Rotary drum shroud",(x-2.6,yy,z0),(x+2.25,yy,z0),1.49*height,1.64*height,alloy,12)
            ring("Rotary blue drive seal",(x-2.56,yy,z0),1.28*height,.16,signal)
            pipe("Rotary central spindle",(x+1,yy,z0),(muzzle,yy,z0),.42,.32,alloy,12)
            for j in range(5):
                a=j*math.tau/5
                yp,zp=yy+math.cos(a)*1.03*height,z0+math.sin(a)*1.03*height
                pipe("Rotary individual tube",(x+1.5,yp,zp),(muzzle,yp,zp),.27,.21,alloy,8)
                pipe("Rotary muzzle aperture",(muzzle,yp,zp),(muzzle+.06,yp,zp),.15,.15,dark,8)
            for xx in (x+2,muzzle-2.8,muzzle-.75):
                ring("Timing collar",(xx,yy,z0),1.03*height,.27,signal if xx==x+2 else dark)
        elif item=="m_array":
            pipe("Overslung cross-feed",(x+2,yy-1.95*height,z0+.4),(x+2,yy+1.95*height,z0+.4),.61,.61,alloy,8)
            pipe("Overslung violet rail",(x+2,yy-1.65*height,z0+.98),(x+2,yy+1.65*height,z0+.98),.14,.14,signal,6)
            for index in (-1,0,1):
                yp=yy+index*height
                end=x+6+length*.50-(1.66*abs(index))
                loft("Overslung emitter arm",[(x+1,.42,.55,.51,z0+.53),
                     (x+3,.48,.86,.56,z0+1.21),(end,.36,.43,.43,z0+.91)],alloy,yp,.39)
                pipe("Focus rail",(x+3,yp,z0+1.97),(end-.3,yp,z0+1.42),.125,.085,signal,6)
        else:
            for j in (-1,1):
                yp=yy+j*.78*height
                end=x+max(13,length*.97)
                loft("Siege accelerator rail",[(x+1,.62,.53,.51,z0),(x+4,.54,.86,.56,z0+.22),
                     (end-1.3,.39,.59,.39,z0+.24),(end,.34,.37,.37,z0+.21)],alloy,yp,.36)
                pipe("Siege charging bus",(x+4,yp,z0+1),(end-.6,yp,z0+.75),.125,.085,signal,6)
                for offset in (1.6,2.8,4):
                    ring("Siege turquoise capacitor winding",(x+offset,yp,z0),.64,.13,signal)
                ring("Gold bracing ring",(end-1.3,yp,z0+.23),.55,.135,brass)
            for xx in (x+4,x+7,x+10):
                pipe("Siege rail separator",(xx,yy-.81*height,z0+.87),(xx,yy+.81*height,z0+.87),.19,.19,dark,6)


def plating(ship,item,signal,proxy):
    stations=fleet.HULLS.get(ship,WASP_HULL)
    n=4 if item=="p_heavy" else 3
    roots=stations[1:-1]
    if len(roots)>n:
        roots=roots[1:n+1]
    for side in (-1,1):
        for x,w,_,_,_ in roots:
            y=w*side*(.47 if item!="p_light" else .61)
            length=3.4 if item=="p_light" else 4.7 if item=="p_reactive" else 5.2 if item=="p_aegis" else 6.2
            width=min(w*.51,3.8) if item=="p_heavy" else min(w*.4,2.7)
            for face in (1,-1):
                hit,p,_,_=proxy.ray_cast((x,y,80*face),(0,0,-face))
                if not hit:
                    continue
                z=p.z
                height=.69 if item=="p_heavy" else .39
                cap=z+face*height
                outline=[(-.50,-.25),(-.32,-.50),(.33,-.50),(.50,-.26),(.50,.26),(.33,.50),(-.32,.50),(-.50,.25)]
                def point(u,v,rise=0):
                    px,py=x+u*length,y+v*width
                    ok,at,_,_=proxy.ray_cast((px,py,80*face),(0,0,-face))
                    return (px,py,(at.z if ok else z)+face*(height+rise))
                def traced(arr,mat,r):
                    for a,b in zip(arr,arr[1:]):
                        pipe("Armour perimeter",point(*a),point(*b),r,r,mat,6)
                if item=="p_light":
                    traced(outline+outline[:1],alloy,.17)
                    for end in outline[::2]:
                        traced([(0,0),end],alloy,.115)
                    for u,v in outline[::2]:
                        px,py,pz=point(u,v)
                        pipe("Blue light-frame fixing",(px,py,pz-face*.13),(px,py,pz+face*.15),.23,.16,signal,6)
                    continue
                skin=[point(u,v) for u,v in outline]
                plate("Conformal armour cassette",skin,.74*face,armour)
                if item=="p_reactive":
                    # The card's orange hex lattice is raised above blue-steel backing.
                    traced(outline+outline[:1],alloy,.13)
                    for shift in (-.23,.23):
                        hexagon=[(shift+.225*math.cos(i*math.tau/6),.34*math.sin(i*math.tau/6))
                                 for i in range(6)]
                        traced(hexagon+hexagon[:1],signal,.089)
                elif item=="p_heavy":
                    shield=[(-.44,-.22),(-.29,-.35),(.31,-.35),(.45,-.13),
                            (.45,.13),(.31,.35),(-.29,.35),(-.44,.22)]
                    plate("Layered heavy armour strike face",[point(u,v,.26) for u,v in shield],face*.43,alloy)
                    for k in (-1,1):
                        traced([(-.42,k*.34),(-.14,k*.34),(0,k*.22),(.22,k*.22),(.43,k*.37)],signal,.12)
                else:
                    traced(outline+outline[:1],brass,.19)
                    traced([(-.49,0),(-.21,-.07),(0,0),(.21,.07),(.49,0)],signal,.13)
                    for k in (-1,1):
                        traced([(-.41,0),(-.24,k*.32),(.21,k*.31),(.40,0)],brass,.135)
                    ring("Aegis field projector",(x,y,cap),min(width*.22,.68),.114,signal,"top")


def export_ship(ship, wing_only=False):
    global armour, alloy, dark, prism, brass, ceramic, reactor, cyan_glass, warning
    bpy.ops.wm.read_factory_settings(use_empty=True)
    armour=material("Fitting gunmetal",(.053,.083,.127),.63,.38)
    alloy=material("Brushed fitting edges",(.15,.22,.28),.72,.31)
    dark=material("Machined graphite",(.017,.022,.034),.43,.43)
    prism=material("Violet prismatic glass",(.23,.085,.50),.46,.19,.17)
    brass=material("Champagne gold edging",(.47,.27,.067),.74,.23)
    ceramic=material("Phantom blue-black enamel",(.048,.17,.18),.59,.26)
    cyan_glass=material("Cyan energy laminate",(.10,.55,.64),.33,.21,.45)
    warning=material("Razor red warning",(.97,.055,.064),.12,.34,1.9)
    reactor=material("Fusion amber core",(.96,.46,.07),.12,.32,2.7)
    proxy=loft("Plating reference",fleet.HULLS.get(ship,WASP_HULL),armour,
               power=.39 if ship in ("bastion","scavenger") else .55 if ship in ("architect","spectre") else .75)
    slots=(("wings",WING),) if wing_only else (("engine",ENGINE),("wings",WING),("mount",MOUNT),("plating",PLATING))
    for item in (item for _,ids in slots for item in ids):
        before=set(bpy.context.scene.objects)
        glow=material(f"{item} emitter",PALETTES[item],.1,.28,2.1)
        if item in ENGINE:
            engine(ship,item,glow)
        elif item in WING:
            wing(ship,item,glow,proxy)
        elif item in MOUNT:
            mount(ship,item,glow)
        else:
            plating(ship,item,glow,proxy)
        parent=bpy.data.objects.new(item,None)
        bpy.context.collection.objects.link(parent)
        parent["fittingId"]=item
        groups={}
        for o in set(bpy.context.scene.objects)-before-{parent}:
            if o.type=="EMPTY":
                o.parent=parent
            else:
                groups.setdefault(o.data.materials[0].name,[]).append(o)
        for mat,items in sorted(groups.items()):
            bpy.ops.object.select_all(action="DESELECT")
            items.sort(key=lambda o:o.name)
            for o in items:
                bpy.context.view_layer.objects.active=o
                for mod in list(o.modifiers):
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                o.select_set(True)
            bpy.context.view_layer.objects.active=items[0]
            bpy.ops.object.join()
            items[0].name=f"{item} {mat}"
            items[0].parent=parent
    bpy.data.objects.remove(proxy,do_unlink=True)
    ship_dir=DEST/ship
    ship_dir.mkdir(exist_ok=True)
    for slot, ids in slots:
        bpy.ops.object.select_all(action="DESELECT")
        for item in ids:
            parent=bpy.data.objects[item]
            parent.select_set(True)
            for obj in parent.children_recursive:
                obj.select_set(True)
        bpy.ops.export_scene.gltf(filepath=str(ship_dir/f"{slot}.glb"),use_selection=True,
                                 export_extras=True,export_format="GLB",export_texcoords=False)


if __name__ == "__main__":
    for model in (*fleet.HULLS,"wasp"):
        export_ship(model,"--wings-only" in sys.argv)
