"""Export all 16 swappable fittings for every Reactor Rogue hull from Blender."""
import importlib
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

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
    "e_twin":(.95,.35,.11),"e_ion":(.10,.59,1),"e_fusion":(1,.62,.13),"e_nova":(1,.18,.085),
    "w_razor":(.85,.12,.23),"w_vane":(.1,.92,.69),"w_prism":(.56,.25,1),"w_phantom":(.41,.15,1),
    "m_heavy":(1,.4,.12),"m_rotary":(.98,.59,.18),"m_array":(.23,.65,1),"m_siege":(1,.23,.12),
    "p_reactive":(.9,.30,.12),"p_light":(.11,.82,.57),"p_heavy":(.35,.54,.84),"p_aegis":(.14,.62,1),
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
            elif item=="e_fusion":
                pipe("Fusion shield cell",(x+3.2,y,z+r*.76),(x+8.7,y,z+r*.76),r*.57,r*.47,signal,10)
                for xx in (3.5,5.15,7,8.55):
                    ring("Reactor containment rib",(x+xx,y,z+r*.76),r*.63,.21,alloy)
                for side in (-1,1):
                    pipe("Reactor feed",(x+3,y+side*r*.78,z-r*.54),(x+10,y+side*r*.78,z-r*.54),.22,.16,alloy,8)
            else:
                ring("Afterburner constrictor",(x+.7,y,z),r*1.11,.18,signal)
                for sector in range(6):
                    a=math.tau*sector/6
                    yy,zz=y+math.cos(a)*r*.97,z+math.sin(a)*r*.97
                    pipe("Afterburner claw",(x-.56,yy,zz),(x+3.7,yy,zz),.20,.29,alloy,8)
                    pipe("Afterburner braid",(x+2.6,yy,zz),(x+6.9,yy,zz),.13,.13,signal,8)


def wing(ship,item,signal):
    original=fleet.WINGS.get(ship,WASP_WING)
    yi,chord,_,_,z,xi=original[0]
    yo,_,_,_,zo,xo=original[-1]
    span=yo-yi
    for side in (-1,1):
        if item=="w_razor":
            specs=[(0,1,z,xi),(.24,.67,z+.45,xi*.76+xo*.24),(.75,.27,zo+.8,xo-1.7),(1.04,.07,zo+2.8,xo-4)]
        elif item=="w_vane":
            specs=[(0,.95,z,xi),(.34,.83,z+.4,xi*.67+xo*.33),(.76,.45,zo+1.05,xo+2),(1,.30,zo+1.7,xo+3.2)]
        elif item=="w_prism":
            specs=[(0,.87,z,xi),(.35,.81,z-.2,xi*.65+xo*.35),(.72,.58,zo+.28,xo+1.8),(1.07,.06,zo+3.3,xo+1.5)]
        else:
            specs=[(0,.96,z-.2,xi),(.19,.70,z,xi*.76+xo*.24),(.64,.44,zo+.68,xo-1.1),(1.09,.05,zo+2.1,xo-6)]
        thickness=.66 if ship=="spectre" else 1
        rows=[(max(.3,yi-1.6) if i==0 else yi+f*span,chord*k,
               thickness*(1.4-.65*f),thickness*(1-.45*f),zz,xx)
              for i,(f,k,zz,xx) in enumerate(specs)]
        surface=loft("Control surface",rows,armour,power=.58,wing=True,mirror=side)
        for y,w,_,_,_,x in rows[1:-1]:
            fleet.stripe(surface,"Leading structural inlay",(x+w*.69,side*(y-1.7)),(x+w*.43,side*(y+1.5)),.135,signal)
            fleet.stripe(surface,"Underside actuator guide",(x-w*.48,side*(y-1.45)),(x+w*.49,side*(y+.65)),.115,alloy,-1)
        if item=="w_vane":
            y,w,_,_,z,x=rows[2]
            for offset in (-2.6,0,2.6):
                plate("Articulating stabiliser slat",[(x+offset-1,side*(y-2),z+.62),
                      (x+offset-.6,side*(y+2.1),z+1.75),(x+offset+.56,side*(y+2.15),z+1.6),
                      (x+offset+.81,side*(y-2),z+.53)],.42,alloy)
        elif item=="w_prism":
            y,w,_,_,z,x=rows[1]
            for j in (-1,0,1):
                x0=x+j*w*.39
                plate("Prismatic capacitor tile",[(x0-1.35,side*(y-1.5),z+.95),(x0+.65,side*(y-1.35),z+1.15),
                      (x0+1.2,side*(y+1.55),z+1.15),(x0-.89,side*(y+1.6),z+1.04)],.40,prism)
                pipe("Capacitor bus",(x0-.8,side*(y-.6),z+1.21),(x0-.35,side*(y+.77),z+1.22),.105,.1,signal,6)
        elif item=="w_phantom":
            winglet=[(y,min(w,chord)*.42,.46,.41,zz-.87,xx-w*.64)
                     for y,w,_,_,zz,xx in rows[1:]]
            blade=loft("Split stealth winglet",winglet,alloy,power=.6,wing=True,mirror=side)
            y,w,_,_,_,x=winglet[1]
            fleet.stripe(blade,"Stealth emitter",(x-w*.6,side*(y-.6)),(x+w*.47,side*(y+1)),.14,signal,-1)
        else:
            for y,w,_,_,_,x in rows[1:-1]:
                fleet.stripe(surface,"Razor abrasion strip",(x+w*.67,side*(y-1)),(x+w*.84,side*y),.23,alloy)


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
            pipe("Rotary central spindle",(x+1,yy,z0),(muzzle,yy,z0),.42,.32,alloy,12)
            for j in range(5):
                a=j*math.tau/5
                yp,zp=yy+math.cos(a)*1.03*height,z0+math.sin(a)*1.03*height
                pipe("Rotary individual tube",(x+1.5,yp,zp),(muzzle,yp,zp),.27,.21,alloy,8)
                pipe("Rotary muzzle aperture",(muzzle,yp,zp),(muzzle+.06,yp,zp),.15,.15,dark,8)
            for xx in (x+2,muzzle-2.8,muzzle-.75):
                ring("Timing collar",(xx,yy,z0),1.03*height,.27,signal if xx==x+2 else dark)
        elif item=="m_array":
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
            for xx in (x+4,x+7,x+10):
                pipe("Siege rail separator",(xx,yy-.81*height,z0+.87),(xx,yy+.81*height,z0+.87),.19,.19,dark,6)


def plating(ship,item,signal,proxy):
    stations=fleet.HULLS.get(ship,WASP_HULL)
    n=4 if item=="p_heavy" else 3
    roots=stations[1:-1]
    if len(roots)>n:
        roots=roots[1:n+1]
    for side in (-1,1):
        for j,(x,w,_,_,_) in enumerate(roots):
            y=w*side*(.47 if item!="p_light" else .61)
            length=3.4 if item=="p_light" else 4.7 if item=="p_reactive" else 5.2 if item=="p_aegis" else 6.2
            width=min(w*.51,3.8) if item=="p_heavy" else min(w*.4,2.7)
            for face in (1,-1):
                hit,p,_,_=proxy.ray_cast((x,y,80*face),(0,0,-face))
                if not hit:
                    continue
                z=p.z
                cap=z+face*(.59 if item=="p_heavy" else .32)
                points=[(x+u*length,y+v*width,cap) for u,v in [(-.5,-.26),(-.34,-.5),(.37,-.5),
                        (.5,-.24),(.46,.29),(.3,.5),(-.35,.5),(-.5,.22)]]
                plate("Armour cassette frame",points,cap-z+.48 if face==1 else -.54,alloy if item=="p_light" else armour)
                if item=="p_reactive":
                    for u in (-.29,0,.29):
                        pipe("Reactive cell breaker",(x+u*length,y-width*.24,cap),(x+u*length+.26,y+width*.24,cap),.135,.135,signal,6)
                elif item=="p_light":
                    pipe("Exposed light frame tension rod",(x-length*.32,y-width*.28,cap),(x+length*.32,y+width*.28,cap),.13,.13,signal,8)
                elif item=="p_heavy":
                    pipe("Heavy plate locking crossbar",(x-.26,y-width*.37,cap),(x+.26,y+width*.37,cap),.18,.18,dark,8)
                    for yy in (-.31,.31):
                        pipe("Heavy plate witness mark",(x-length*.29,y+yy*width,cap),(x-length*.15,y+yy*width,cap),.09,.09,signal,6)
                else:
                    ring("Aegis field projector",(x,y,cap),min(width*.36,.98),.145,signal,"top")
                    pipe("Aegis ceramic centre",(x,y,cap-face*.08),(x,y,cap+face*.12),width*.20,width*.18,alloy,8)


def export_ship(ship):
    global armour, alloy, dark, prism
    bpy.ops.wm.read_factory_settings(use_empty=True)
    armour=material("Fitting gunmetal",(.053,.083,.127),.63,.38)
    alloy=material("Brushed fitting edges",(.15,.22,.28),.72,.31)
    dark=material("Machined graphite",(.017,.022,.034),.43,.43)
    prism=material("Prismatic ceramic",(.21,.15,.43),.57,.20)
    proxy=loft("Plating reference",fleet.HULLS.get(ship,WASP_HULL),armour,
               power=.39 if ship in ("bastion","scavenger") else .55 if ship in ("architect","spectre") else .75)
    for item in ENGINE+WING+MOUNT+PLATING:
        before=set(bpy.context.scene.objects)
        glow=material(f"{item} emitter",PALETTES[item],.1,.28,2.1)
        if item in ENGINE:
            engine(ship,item,glow)
        elif item in WING:
            wing(ship,item,glow)
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
    bpy.ops.export_scene.gltf(filepath=str(DEST/f"{ship}.glb"),export_extras=True,export_format="GLB",export_texcoords=False)


if __name__ == "__main__":
    for model in (*fleet.HULLS,"wasp"):
        export_ship(model)
