const fs=require('fs'),vm=require('vm');
let harness=fs.readFileSync('TEST-SHIP-PREVIEWS.cjs','utf8').split('// Menu artwork')[0];
harness += `\nfs.writeFileSync('ship-review-records.json',run('JSON.stringify(pilots.map(p=>({id:p.id,name:p.name,rec:recordShip3D({...p,parts:bayParts(),glow:1})})))'));`;
new Function('require','__dirname',harness)(require,__dirname);
