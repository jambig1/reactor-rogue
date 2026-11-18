// Builds index.html from the source files in src/ (see src/manifest.json for the order).
//   node build.mjs          write index.html
//   node build.mjs --check  exit 1 if index.html is out of date (used by TEST-BUILD.cjs)
// Edit the files in src/, never index.html directly: it is generated and will be overwritten.
// The game files are joined in manifest order into ONE inline script, exactly as before the split, so all
// top-level code runs in the same order and every function is visible everywhere.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const manifest = JSON.parse(read('src/manifest.json'));
const join = list => list.map(read).join('\n');

export function buildHtml() {
  const tpl = read('src/index.template.html');
  if (!tpl.includes('/*@styles*/') || !tpl.includes('/*@game*/')) throw new Error('template markers missing');
  return tpl.replace('/*@styles*/', () => join(manifest.styles)).replace('/*@game*/', () => join(manifest.game));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = buildHtml(), target = path.join(root, 'index.html');
  if (process.argv.includes('--check')) {
    const cur = fs.readFileSync(target, 'utf8');
    if (cur !== out) { console.error('index.html is out of date: edit src/ and run `node build.mjs`.'); process.exit(1); }
    console.log('index.html is up to date');
  } else {
    fs.writeFileSync(target, out);
    console.log('built index.html', (out.length / 1024).toFixed(0), 'KB from', manifest.styles.length + manifest.game.length, 'source files');
  }
}
