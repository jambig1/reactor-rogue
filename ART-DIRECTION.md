# Sector backgrounds, v0.40.0

Each sector now uses an independent full-resolution texture, embedded in index.html and supplied as a sector-background-*-v0400.jpg file. The six images were generated individually to preserve the dark painterly sci-fi style while increasing usable detail over the former 512 by 512 atlas cells. They are not upscaled atlas crops.

The renderer constructs a periodic surface once per selected sector and quality level. Smooth complementary alpha weights blend an 18% overlap on opposite edges, then additive wrapping combines all four corner contributions. The result is flattened to opaque navy to prevent quantisation from revealing translucent seams. A single repeating Canvas pattern draws the surface; no mirrored neighbours or separate image rectangles are used.

Texture scale is fixed in world space rather than stretched to viewport size. A larger monitor reveals more scenery. Low quality uses a smaller cached surface with the same world scale. At most two sectors remain decoded and each keeps one surface. Reduced motion freezes ambient drift and particles. Renderers do not consume gameplay RNG or alter collision geometry.

The generation brief for each texture requested overhead orthographic artwork, rich fine detail, restrained local light and dark readable combat space, without ships, UI, text, borders, wireframes or panel divisions. Sector themes are teal/violet nebula, amber asteroid wreckage, indigo ion storm, ember industrial foundry, blue glacial shelves and violet/teal distant city rooftops.

TEST-ENVIRONMENTS.cjs checks state/RNG isolation, cache bounds, render order and reduced motion. TEST-TEXTURE-SEAMS.cjs uses the optional @napi-rs/canvas package to inspect actual pixel joins and resolution in all six textures. Synthetic review scenes are not advertised as captured gameplay.
