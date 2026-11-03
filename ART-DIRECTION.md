# Sector artwork, v0.42.0

The six sector textures follow the approved Neon Expanse study and the actual production ship artwork. This is a deliberately illustrated arcade style: broad shaded forms, crisp controlled edges, slate-blue mechanical fills, limited neon rim accents and organic layered clouds. Avoid photographic smoke microtexture, coarse pixel blocks, checkerboard dithering and wireframe environments.

Each sector has an independent 1254-pixel square texture supplied as sector-background-*-v0420.jpg and embedded in index.html. Neon Expanse uses the approved study directly. The other five images were generated individually using that approved background and the ship artwork as style references, with distinct scenes and material identities:

| Sector | Identity |
| --- | --- |
| Neon Expanse | Navy space, teal/violet cloud banks, designed orbital wreckage |
| Shattered Belt | Faceted amber/copper rocks, broken cargo hulls, salvage plates |
| Storm Relay | Indigo ion clouds, damaged relay masts, restrained electrical accents |
| Cinder Foundry | Dark furnace platforms, thick pipes, cooling towers, ember slits |
| Cryo Reach | Layered blue ice shelves, small frozen fragments, cyan fissures |
| Neon Undercity | Varied small shaded rooftops, stepped silhouettes, curving roads, sparse windows |

Background objects are decorative and add no collision. Keep scenery darker and quieter than ships, pickups and threat warnings.

## Rendering and ambient life

The renderer builds each periodic surface once, blending an 18% overlap on opposite edges with complementary smooth alpha weights. Four wrapped contributions make the corners continuous. A single repeating Canvas pattern avoids mirrored neighbours and subpixel tile cracks. Texture scale stays fixed in world space across viewports. Low quality uses a smaller cached surface at the same scale; at most two sectors remain decoded, with one surface each.

The existing restrained material treatment is retained because it was present in the approved in-engine study. Fine clustered dithering and grain do not lower the texture resolution. Scenery-aligned sampled lights blink in place, with 18/64 point budgets that remain available in Low/crowded Auto. Dust, Foundry embers, Cryo snow and Storm filaments follow particle settings. Reduced motion freezes ambient animation. These layers render below gameplay and never consume simulation RNG.

## Validation and previews

TEST-ENVIRONMENTS.cjs checks rendering order, state/RNG isolation, cache bounds, motion and light budgets. TEST-TEXTURE-SEAMS.cjs checks all actual image edges, opaque corners, embedded/file parity and material/light candidates using optional @napi-rs/canvas. TEST-ENVIRONMENT-GALLERY.cjs executes the standalone scenery review with actual native canvases. Synthetic review scenes are not presented as captured gameplay.

Menu and website previews must use separate real gameplay captures from their corresponding sectors. Keep them consistent with the shipped art and use versioned filenames and offline-cache updates.
