// index.html is generated from src/ by build.mjs. Fails if someone edited index.html directly or forgot to rebuild.
const {execFileSync}=require('child_process');
try{execFileSync(process.execPath,['build.mjs','--check'],{cwd:__dirname,stdio:'pipe'});console.log('build ok: index.html matches src/')}
catch(e){console.error(String(e.stderr||e.message));process.exit(1)}
