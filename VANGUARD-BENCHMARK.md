# Vanguard 3D benchmark — draft, not deployed

Based on main commit `7847dac1d223947b27a2ba19fa72e00f1016902b` (the merged Claude 3D hangar work). Local branch: `codex/vanguard-3d-benchmark`.

## What changes

Stock Vanguard uses an authored 3D airframe instead of inflating the recorded 2D drawing. It has a chamfered longitudinal fuselage, connected ventral keel, separately layered swept wings, engine nacelles, raised smoked-glass canopy and sill, swept vertical stabilisers, radiator recesses, cannon housings and concentric thruster hardware. Accent colour and exhaust colour follow the existing record. The existing viewer rotations, hover, selection animation, nozzle projection and bloom preferences are retained. No gameplay or save code changes.

Static details are merged by material: 13 meshes and 4,204 triangles including exhaust. Geometry/materials are disposed by the existing model lifecycle.

This is deliberately the Vanguard benchmark checkpoint. Other eleven hulls and Vanguard with non-stock fittings keep the previous builder. No equipment is removed or altered. Authored representations of upgraded fittings and paint patterns are not part of this benchmark; the existing builder already omits paint patterns. No claim of a finished fleet redesign.

## Review

Serve this directory and open `ship-review.html` for a side-by-side Three.js comparison with identical lighting and camera controls. All twelve original recorded hulls are available. `node bundle-review.cjs` creates a self-contained review HTML for environments that permit local module/data imports. The baseline renderer is an unmodified copy of the main-branch module.

`Vanguard-Before-After.png` is a CPU rasterisation of the actual exported Three.js geometry under shared neutral lights. It is NOT an in-game screenshot and does not validate WebGL shaders, reflections, bloom or animation.

## Verification completed

- `node TEST-VANGUARD-3D.mjs`: finite geometry, unit normals, non-degenerate opaque triangles, positive hull volume, bounds, resource disposal, stock/non-stock routing. All twelve IDs exercised with real Three geometry at 390, 768 and 1280 widths and three yaw angles, with GPU transport mocked.
- `node TEST-SHIP-PREVIEWS.cjs`: existing twelve previews, deterministic hull drawing and gameplay-state isolation pass.
- Geometry inspected in front three-quarter and low side CPU renders. An underside gap and degenerate keel faces were corrected.

## Still required before merge

Actual WebGL testing in the integrated hangar, switching fittings, fallback tests on unavailable WebGL, desktop/iPhone/iPad browser checks, animation/performance and memory profiling. The automated viewport checks are not device tests. Finish visual validation and get the Vanguard benchmark reviewed before expanding the fleet.

## Delivery

Development branch: `codex/vanguard-3d-benchmark`. Draft benchmark only; do not merge before browser validation and visual review. Main and gameplay remain unchanged.
