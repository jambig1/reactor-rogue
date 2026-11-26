// One command for the ship art pipeline. Runs, in order:
//   1. (with --blender) export the hulls and fittings from the Blender author scripts, then meshopt-compress
//      them (about 4x smaller; the game decodes with vendor/three-0.187.0/meshopt_decoder.module.js).
//      The hangar repair bot has its own workflow, .github/workflows/blender-bots.yml.
//   2. bake-combat.mjs          - trace the combat outlines into combat-hulls-v1300.js
//   3. bake-combat-sprites.cjs  - render the shaded combat sprites into art/combat/ (keeps visually unchanged ones)
//   4. check-fleet.mjs          - load every ship, fitting and full loadout and check them
// Usage: node art/blender/bake-ships.mjs [--blender] [--force] [path/to/chrome]
//   --blender  also re-export the .glb models (needs Blender's Python module, bpy 4.5.16 on Python 3.11;
//              uses $BLENDER_PYTHON, else `blender-python`, else `python3`) and glTF-Transform
//              (@gltf-transform/cli, from NODE_PATH or node_modules, else fetched with npx)
//   --force    rewrite every combat sprite even when it looks unchanged
import { spawnSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..', '..');
const args = process.argv.slice(2), blender = args.includes('--blender'), force = args.includes('--force');
const chrome = args.filter(a => !a.startsWith('--'));
const GLTF_TRANSFORM = '4.5.1';   // pinned: the compressed bytes depend on the tool version

function run(label, cmd, cmdArgs, quiet = false) {
  if (!quiet) console.log(`\n== ${label}`);
  const started = Date.now(), r = spawnSync(cmd, cmdArgs, { cwd: root, stdio: quiet ? ['ignore', 'ignore', 'inherit'] : 'inherit' });
  if (r.error || r.status !== 0) {
    console.error(`\n${label} failed` + (r.error ? `: ${r.error.message}` : ` (exit ${r.status})`));
    process.exit(1);
  }
  if (!quiet) console.log(`   ${label} done in ${((Date.now() - started) / 1000).toFixed(0)}s`);
}

if (blender) {
  const candidates = [process.env.BLENDER_PYTHON, 'blender-python', 'python3'].filter(Boolean);
  const py = candidates.find(c => spawnSync(c, ['-c', 'import bpy'], { stdio: 'ignore' }).status === 0);
  if (!py) { console.error('No Python with Blender\'s bpy module found (tried ' + candidates.join(', ') + '). Install bpy==4.5.16 on Python 3.11.'); process.exit(1); }
  const dest = path.join('art', 'blender');
  run('Blender: hulls', py, [path.join(dest, 'author-fleet.py'), '--', dest]);
  run('Blender: fittings', py, [path.join(dest, 'author-fittings.py'), '--', dest]);
  // Compress only the fresh exports: compressing an already compressed file changes its bytes again.
  // Wasp.glb is the Blender source the refit is built from and repair-bot.glb has its own workflow.
  const models = [...fs.readdirSync(path.join(root, dest)).filter(f => f.endsWith('.glb') && !['Wasp.glb', 'repair-bot.glb'].includes(f)).map(f => path.join(dest, f)),
    ...fs.readdirSync(path.join(root, dest, 'fittings')).flatMap(s => fs.readdirSync(path.join(root, dest, 'fittings', s)).filter(f => f.endsWith('.glb')).map(f => path.join(dest, 'fittings', s, f)))];
  let cli;
  try { cli = [process.execPath, path.join(path.dirname(createRequire(import.meta.url).resolve('@gltf-transform/cli/package.json')), 'bin', 'cli.js')]; }
  catch { cli = ['npx', '--yes', '@gltf-transform/cli@' + GLTF_TRANSFORM]; }
  console.log(`\n== Compress ${models.length} models (meshopt)`);
  for (const f of models) run('compress ' + f, cli[0], [...cli.slice(1), 'meshopt', f, f], true);
}
run('Combat outlines', process.execPath, [path.join(here, 'bake-combat.mjs')]);
run('Combat sprites', process.execPath, [path.join(here, 'bake-combat-sprites.cjs'), ...(force ? ['--force'] : []), ...chrome]);
run('Fleet check', process.execPath, [path.join(here, 'check-fleet.mjs')]);
console.log('\nShip art baked. Review `git status`, then commit the changed models, sprites and combat-hulls-v1300.js.');
