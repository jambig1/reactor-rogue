# Working on Reactor Rogue

**`index.html` is generated. Do not edit it directly.**

- Game code lives in `src/game/**` and styles in `src/styles/*.css`; `src/manifest.json` lists the order.
  `src/index.template.html` is the page around them (markup, external scripts).
- After any change in `src/`, run `node build.mjs` to regenerate `index.html`, and commit both.
- `node build.mjs --check` (and `TEST-BUILD.cjs`) fails if `index.html` is out of date.
- All game files are joined into one inline script in manifest order, so top-level statements run in that order
  and every function is visible to every file. Function declarations can be moved between files freely;
  top-level statements (`let`/`const`, calls) must keep their relative order.
- Tests: `node TEST-<name>.cjs` (they read the built `index.html`, so build first).
- Ship art comes from the Blender author scripts (`art/blender/author-*.py`). One command rebuilds it:
  `node art/blender/bake-ships.mjs` re-bakes the combat outlines and sprites and checks the fleet;
  add `--blender` to re-export and meshopt-compress the hull/fitting models first (needs bpy 4.5.16 on
  Python 3.11, e.g. `blender-python`), and `--force` to rewrite sprites that look unchanged.
  The *Bake Blender ships* GitHub workflow runs it with `--blender` when the ship scripts change.
