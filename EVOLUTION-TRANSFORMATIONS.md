# Evolution transformations, v0.50.0

Each evolution has a painted icon and a corresponding signature attack. These are real timed combat actors, not animation-only additions. Existing acquisition recipes, equipment slots and base weapon attacks are retained. Iron Halo replaces its older blade contacts and interception while its signature rings are active, so those hidden blades cannot cause damage.

| Weapon | Evolution | Signature cycle |
| --- | --- | --- |
| Chain Lightning | Storm Network | Three storm pylons form an electrical triangle, striking its edges and branching lightning into nearby ships. |
| Siege Cannon | Starbreaker | A star core cracks at the target, then six explosive fragments strike an expanding ring around it. |
| Orbiting Blades | Iron Halo | Two counter-rotating steel cutting rings shred close ships and intercept shots at their moving blades. |
| Toxic Cloud | Living Plague | Three spore reactors spread a creeping toxic network; destroyed ships seed a fourth growth and repair hull. |
| Neon Bolts | Photon Echo | Three echo drones form a moving triangular battery and fire staggered piercing volleys. |
| Needle Repeater | Railneedle Storm | Six rail emitters sweep a dense piercing needle storm across the firing lane. |
| Scatterburst | Scatter Sun | Four explosive sunlets spiral out, pulsing as they travel and detonating at the edge of their orbit. |
| Arc Discs | Eventide Discs | Three broad crescent discs sweep outward and return through the fleet on curved paths. |
| Frost Shards | Glacial Bloom | A glacial flower opens in eight stages, sending freezing crystalline shock fronts through the fleet. |
| Pulse Laser | Solar Lance | An exposed solar reactor fires a sustained broad lance that slowly tracks its target, with repeated burning contact. |
| Homing Missiles | Constellation Salvo | A missile carrier launches six curving warheads; each splits once into two homing bomblets. |
| Seeker Drones | Salvage Swarm | A carrier deploys seven harvesting drones that fire on nearby ships and sweep XP towards the pilot. |
| Nova Reactor | Aegis Supernova | Four shield vanes project an expanding supernova shell, damaging ships and converting intercepted fire into shield. |
| Plasma Mines | Shrapnel Garden | A six-mine garden erupts in sequence, sending piercing thorns towards nearby ships. |
| Gravity Well | Tidal Collapse | A vast tidal vortex drags ships into its centre before an expanding collapse shockwave. |
| Void Lance | Event Horizon | Three orbiting black holes pull separate packs together and collapse into a central void detonation. |
| Ion Harpoon | Thunderhook | Four thunderhooks cage the target, drag nearby ships into its edges and branch electric strikes. |
| Ember Wake | Solar Slipstream | Twin solar engines lay a braided burning wake behind the ship; using its ability adds crosswise fire trails. |
| Prism Satellites | Prismatic Array | Three orbiting satellites form a prism reactor and refract their beams through a shared target. |
| Scrapstorm | Junkstar Barrage | An armoured scrap star bursts into nine jagged fragments that ricochet inside a widening flight box. |
| Tesla Buoys | Storm Bastions | Three fortified bastions lock down a triangular area, branching lightning and intercepting fire along their links. |
| Saw Drones | Razor Squadron | A V formation of three heavy saw fighters dives through the pack and wheels back across the pilot. |
| Orbital Mortar | Meteor Battery | An orbital battery walks five staggered meteor impacts across the fleet, each with a visible landing mark. |
| Nanite Swarm | Grey Tide | Nine nanite drones advance as a wave, infecting ships along their path and repairing hull on a shared capped pulse. |
| Phase Torpedoes | Rift Torpedoes | Three rift mouths open around the target and fire phase torpedoes inward from different directions. |
| Sonic Pulse | Resonance Engine | A resonance turbine releases three expanding pressure walls; each wall damages once and drives ordinary ships outward. |
| Rail Lance | Parallax Lance | Three separated rail accelerators converge on a distant target, carving piercing lanes through the whole pack. |
| Flak Battery | Supernova Flak | A stellar shell detonates at the target and hurls ten heavy fragments outward, each with a final burst. |
| Crescent Blades | Lunar Reapers | Three oversized lunar reapers circle the target in a shrinking eclipse, then scythe back towards the pilot. |
| Plasma Fences | Fusion Grid | Four pylons unfold into a diamond fusion fortress with crossed plasma links that repeatedly burn passing ships. |
| Leech Beam | Sanguine Circuit | A blood reactor connects four ships into a drain circuit, returning capped repair pulses to the pilot. |
| Cryo Charges | Absolute Zero | A containment core cracks open into six frozen blast zones that interrupt ordinary ships and slow bosses. |
| Kinetic Ram | Titan Drive | A massive siege prow projects three advancing pressure wedges along the pilot’s heading, battering ships aside. |
| Solar Sails | Helios Wings | Four articulated solar wings sweep rotating beam spokes around the pilot, with gaps between the hot lanes. |
| Void Seeds | Black Bloom | Three singularity buds blossom in succession, drawing ships inward before each releases a second void pulse. |
| Stasis Net | Event Lock | A six-node containment cage rotates around a time-lock core, slowing ships and intercepting a limited number of hostile shots. |
| Storm Spires | Tempest Cathedral | Five spires rise around a storm core and discharge a staggered lightning circuit across the trapped fleet. |
| Echo Rings | Harmonic Horizon | Three displaced resonance gates emit overlapping travelling pressure walls, each with its own expanding front. |
| Crossfire Array | Gemini Battery | Two heavy satellite batteries alternate four crossing beam lanes through the pilot’s firing field. |
| Rupture Drill | Core Breacher | Industrial jaws clamp a marked hull while two diamond drills converge; the final impact bursts into nearby ships. |
| Ion Guardians | Citadel Orbit | Four heavy sentries form a moving orbital fortress, fire outward and intercept shots at their shields. |
| Plasma Rain | Nebula Reservoir | Three plasma reservoirs flow together around the target, growing into one pulsing nebula before dispersing. |
| Prism Tracers | Reactor Pinball | Five reflector nodes contain a ricocheting reactor star; each wall impact emits a damaging pulse. |
| Comet Scythes | Orbital Reaping | Three gigantic harvesting crescents spiral outward and sweep back across their original firing lanes. |
| Ion Curtain | Polar Cascade | Four polar emitters project an ion cross which rotates between its repeated piercing discharges. |
| Coronal Shroud | Soul Reactor | An exposed soul reactor releases coronal pulses and sends three repair motes around its burning shell. |
| Plasma Lash | Crimson Gyre | Three long plasma arms rotate into a crimson vortex, dragging nearby ships across the moving hot strands. |
| Binary Wisps | Binary Supercluster | Six linked drones form a miniature constellation and cascade three alternating bombardment zones around the pilot. |

Actors are bounded globally to 12 signature fields, at most 10 nodes per field and 96 signature projectiles. Missile splitting is limited to one generation; ordinary signature shots respect cover and phase torpedoes retain their phase exception. Damage passes through the existing armour, protocol, synergy and attribution path. Bosses resist new freezing/pull/knockback effects. Repair and interception pulses are bounded.

Painted atlas sprites match the approved ship-material study: slate armour facets, inset coloured cores and restrained emissive effects. Four versioned transparent atlases supply 96 base/evolved icons. The world renderer uses the same sheets for deployed hardware, with simulated beams, blades, pressure fronts and explosions kept separate. All damage actors are updated outside rendering. Low quality simplifies decorative effects; reduced motion keeps essential moving attack boundaries accurate.

`TEST-EVOLUTION-SIGNATURES.cjs` exercises every signature with actual attributed damage, finite actors, pure rendering, swept collisions, manual firing, bounded splitting, removal/reset and a 240-ship stress scene. `BASE_ONLY=1 node TEST-ATTACK-PARITY.cjs /path/to/v049.html` compares the unchanged base weapons. `REVIEW-EVOLUTIONS.cjs` optionally produces isolated production-canvas scenes using @napi-rs/canvas; these are labelled simulation reviews, not browser gameplay captures.
